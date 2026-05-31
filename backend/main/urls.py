from django.urls import include, path
from rest_framework.routers import DefaultRouter
from .views import (
    AnswerViewSet,
    ForgotPasswordView,
    LessonQuestionViewSet,
    LessonQuizResultViewSet,
    LessonViewSet,
    QuestionViewSet,
    QuizResultViewSet,
    QuizViewSet,
    RegisterView,
    VideoViewSet,
)
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

router = DefaultRouter()
router.register('quizzes', QuizViewSet, basename='quiz')
router.register('questions', QuestionViewSet, basename='question')
router.register('answers', AnswerViewSet, basename='answer')
router.register('lessons', LessonViewSet, basename='lesson')
router.register('videos', VideoViewSet, basename='video')
router.register('lesson-questions', LessonQuestionViewSet, basename='lesson-question')
router.register('lesson-quiz-results', LessonQuizResultViewSet, basename='lesson-quiz-result')
router.register('results', QuizResultViewSet, basename='result')

urlpatterns = [
    path('', include(router.urls)),
    path('auth/register/', RegisterView.as_view(), name='register'),
    path('auth/forgot-password/', ForgotPasswordView.as_view(), name='forgot_password'),
    path('auth/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('auth/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
]
