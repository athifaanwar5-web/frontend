from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import (
    RegisterView, ProfileView, ResumeUploadView, GuestResumeUploadView,
    PolishSummaryView, JobListCreateView, JobMatchView,
    InterviewPrepView, RecruiterAnalyticsView, api_root
)

urlpatterns = [
    path('', api_root, name='api-root'),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    
    path('profile/', ProfileView.as_view(), name='profile'),
    path('profile/polish/', PolishSummaryView.as_view(), name='profile-polish'),
    
    path('resume/upload/', ResumeUploadView.as_view(), name='resume-upload'),
    path('resume/guest-upload/', GuestResumeUploadView.as_view(), name='resume-guest-upload'),
    
    path('jobs/', JobListCreateView.as_view(), name='job-list-create'),
    path('jobs/match/', JobMatchView.as_view(), name='job-match'),
    path('jobs/interview-prep/', InterviewPrepView.as_view(), name='interview-prep'),
    
    path('recruiter/analytics/', RecruiterAnalyticsView.as_view(), name='analytics'),
]
