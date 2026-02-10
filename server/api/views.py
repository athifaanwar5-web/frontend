import pdfplumber
import json
from django.db import models
from rest_framework import status, views, generics, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from .models import CandidateProfile, Resume, Skill, Job, JobApplication, MatchScore
from .serializers import (
    UserSerializer, CandidateProfileSerializer, ResumeSerializer, 
    JobSerializer, JobApplicationSerializer
)
from .ai_utils import (
    parse_resume_ai, polish_summary_ai, match_job_ai, 
    generate_jd_ai, generate_interview_questions_ai
)

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def post(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return Response({
                "user": serializer.data,
                "refresh": str(refresh),
                "access": str(refresh.access_token),
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    permission_classes = [permissions.AllowAny]

class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = CandidateProfileSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user.profile

class ResumeUploadView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        file_obj = request.data.get('file')
        if not file_obj:
            return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)

        # Save Resume
        profile = request.user.profile
        resume = Resume.objects.create(candidate=profile, file=file_obj)

        # Extract Text
        raw_text = ""
        with pdfplumber.open(resume.file.path) as pdf:
            for page in pdf.pages:
                raw_text += page.extract_text() or ""

        resume.raw_text = raw_text
        resume.save()

        # AI Parsing
        structured_data = parse_resume_ai(raw_text)
        resume.structured_data = structured_data
        resume.save()

        # Update Profile
        profile.full_name = structured_data.get('Full Name', profile.full_name)
        profile.email = structured_data.get('Email', profile.email)
        profile.phone = structured_data.get('Phone', profile.phone)
        profile.summary = structured_data.get('Summary', profile.summary)
        profile.experience = structured_data.get('Experience', [])
        profile.education = structured_data.get('Education', [])
        
        # Handle Skills
        skills_list = structured_data.get('Skills', [])
        for skill_name in skills_list:
            skill, _ = Skill.objects.get_or_create(name=skill_name.lower().strip())
            profile.skills.add(skill)
        
        profile.save()

        return Response(CandidateProfileSerializer(profile).data, status=status.HTTP_201_CREATED)

class GuestResumeUploadView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        file_obj = request.data.get('file')
        if not file_obj:
            return Response({"error": "No file uploaded"}, status=status.HTTP_400_BAD_REQUEST)

        # Extract Text
        raw_text = ""
        try:
            print(f"DEBUG: Processing file {file_obj.name}")
            import io
            file_obj.seek(0)
            with pdfplumber.open(io.BytesIO(file_obj.read())) as pdf:
                for page in pdf.pages:
                    raw_text += page.extract_text() or ""
            
            print(f"DEBUG: Extracted {len(raw_text)} chars")
            if not raw_text.strip():
                return Response({"error": "Could not extract text from PDF"}, status=status.HTTP_400_BAD_REQUEST)

            # AI Parsing
            structured_data = parse_resume_ai(raw_text)
            print(f"DEBUG: AI Parsing complete")
            return Response(structured_data, status=status.HTTP_200_OK)
        except Exception as e:
            error_msg = str(e)
            print(f"DEBUG ERROR: {error_msg}")
            import traceback
            traceback.print_exc()
            return Response({"error": error_msg}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class PolishSummaryView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        summary = request.data.get('summary')
        if not summary:
            return Response({"error": "No summary provided"}, status=status.HTTP_400_BAD_REQUEST)
        
        polished = polish_summary_ai(summary)
        return Response({"polished": polished})

class JobListCreateView(generics.ListCreateAPIView):
    queryset = Job.objects.all().order_by('-created_at')
    serializer_class = JobSerializer
    permission_classes = [permissions.IsAuthenticated]

class JobMatchView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        job_id = request.query_params.get('job_id')
        if not job_id:
            return Response({"error": "job_id is required"}, status=status.HTTP_400_BAD_REQUEST)
        
        try:
            job = Job.objects.get(id=job_id)
            profile = request.user.profile
            
            # Check if match score already exists
            application, created = JobApplication.objects.get_or_create(
                job=job, candidate=profile
            )
            
            if not hasattr(application, 'match_score'):
                # Generate Match
                resume_data = {
                    'skills': [s.name for s in profile.skills.all()],
                    'summary': profile.summary,
                    'experience': profile.experience
                }
                match_data = match_job_ai(resume_data, job.description)
                MatchScore.objects.create(
                    application=application,
                    score=match_data['score'],
                    explanation=match_data['explanation'],
                    missing_skills=match_data['missing_skills']
                )
            
            return Response(JobApplicationSerializer(application).data)
        except Job.DoesNotExist:
            return Response({"error": "Job not found"}, status=status.HTTP_404_NOT_FOUND)

class InterviewPrepView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        job_id = request.data.get('job_id')
        job = Job.objects.get(id=job_id)
        profile = request.user.profile
        
        resume_data = {
            'skills': [s.name for s in profile.skills.all()],
            'experience': profile.experience
        }
        questions = generate_interview_questions_ai(resume_data, job.description)
        return Response({"questions": questions})

@api_view(['GET'])
@permission_classes([permissions.AllowAny])
def api_root(request):
    return Response({
        "message": "Welcome to AIVault API",
        "endpoints": {
            "auth": "/api/auth/",
            "profile": "/api/profile/",
            "jobs": "/api/jobs/",
            "resume": "/api/resume/"
        }
    })

class RecruiterAnalyticsView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        # Simplistic analytics
        total_candidates = CandidateProfile.objects.count()
        total_jobs = Job.objects.count()
        avg_score = MatchScore.objects.all().aggregate(avg=models.Avg('score'))['avg'] or 0
        
        return Response({
            "total_candidates": total_candidates,
            "total_jobs": total_jobs,
            "avg_score": round(avg_score, 2)
        })
