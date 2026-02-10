from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Skill, Job, CandidateProfile, Resume, JobApplication, MatchScore

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        CandidateProfile.objects.create(user=user)
        return user

class SkillSerializer(serializers.ModelSerializer):
    class Meta:
        model = Skill
        fields = '__all__'

class JobSerializer(serializers.ModelSerializer):
    required_skills = SkillSerializer(many=True, read_only=True)
    required_skills_ids = serializers.ListField(
        child=serializers.IntegerField(), write_only=True, required=False
    )

    class Meta:
        model = Job
        fields = ('id', 'title', 'company', 'description', 'required_skills', 'required_skills_ids', 'created_at')

    def create(self, validated_data):
        skill_ids = validated_data.pop('required_skills_ids', [])
        job = Job.objects.create(**validated_data)
        job.required_skills.set(skill_ids)
        return job

class CandidateProfileSerializer(serializers.ModelSerializer):
    skills = SkillSerializer(many=True, read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = CandidateProfile
        fields = '__all__'

class ResumeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resume
        fields = '__all__'

class JobApplicationSerializer(serializers.ModelSerializer):
    job_details = JobSerializer(source='job', read_only=True)
    match_score = serializers.SerializerMethodField()

    class Meta:
        model = JobApplication
        fields = ('id', 'job', 'job_details', 'candidate', 'resume', 'status', 'applied_at', 'match_score')

    def get_match_score(self, obj):
        try:
            return {
                'score': obj.match_score.score,
                'explanation': obj.match_score.explanation,
                'missing_skills': obj.match_score.missing_skills
            }
        except:
            return None
