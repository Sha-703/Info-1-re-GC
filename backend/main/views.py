from rest_framework import permissions, viewsets
from rest_framework.parsers import FormParser, JSONParser, MultiPartParser
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .models import Answer, CustomUser, Lesson, LessonQuestion, LessonQuizResult, Question, Quiz, QuizResult, Video
from .permissions import IsTeacherOrReadOnly
from .serializers import (
    AnswerSerializer,
    LessonDetailSerializer,
    LessonQuestionDetailSerializer,
    LessonQuestionPublicSerializer,
    LessonQuestionSerializer,
    LessonQuizResultSerializer,
    LessonQuizSubmissionSerializer,
    LessonSerializer,
    QuestionCreateSerializer,
    QuestionSerializer,
    QuizDetailSerializer,
    QuizResultSerializer,
    QuizSerializer,
    RegisterSerializer,
    UserSerializer,
    VideoSerializer,
)


class RegisterView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = RegisterSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(UserSerializer(user).data)


class ForgotPasswordView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        if not email:
            return Response({'error': 'Email requis'}, status=400)
        
        try:
            user = CustomUser.objects.get(email=email)
            # En production, vous enverriez un email avec un lien de réinitialisation
            # Pour démo: retourner simplement un message de succès
            return Response({
                'message': f'Un email de réinitialisation a été envoyé à {email}',
                'note': 'En production, consultez votre email pour réinitialiser votre mot de passe.'
            })
        except CustomUser.DoesNotExist:
            # Ne pas révéler si l'email existe ou non (sécurité)
            return Response({
                'message': 'Si cet email est enregistré, vous recevrez un lien de réinitialisation.'
            })


class QuizViewSet(viewsets.ModelViewSet):
    queryset = Quiz.objects.filter(published=True).order_by('-created_at')
    serializer_class = QuizSerializer
    permission_classes = [IsTeacherOrReadOnly]

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return QuizDetailSerializer
        return QuizSerializer


class QuestionViewSet(viewsets.ModelViewSet):
    queryset = Question.objects.all()
    serializer_class = QuestionSerializer
    permission_classes = [IsTeacherOrReadOnly]

    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return QuestionCreateSerializer
        return QuestionSerializer


class AnswerViewSet(viewsets.ModelViewSet):
    queryset = Answer.objects.all()
    serializer_class = AnswerSerializer
    permission_classes = [IsTeacherOrReadOnly]


from rest_framework.decorators import action
from rest_framework.response import Response

class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.filter(published=True).order_by('order')
    serializer_class = LessonSerializer
    permission_classes = [IsTeacherOrReadOnly]
    lookup_field = 'order'
    lookup_value_regex = '[0-9]+'

    def ensure_lessons_populated(self):
        if not Lesson.objects.exists():
            from .seed_data import populate_lessons_and_questions
            populate_lessons_and_questions()

    def get_queryset(self):
        self.ensure_lessons_populated()
        if self.action in ['retrieve', 'questions', 'submit_quiz']:
            return Lesson.objects.all().order_by('order')
        return self.queryset

    def list(self, request, *args, **kwargs):
        self.ensure_lessons_populated()
        return super().list(request, *args, **kwargs)

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return LessonDetailSerializer
        return LessonSerializer

    def get_serializer_context(self):
        """Ajoute request au contexte pour les serializers"""
        context = super().get_serializer_context()
        context['request'] = self.request
        return context

    def get_permissions(self):
        if self.action in ['submit_quiz', 'questions']:
            return [permissions.AllowAny()]
        return [permission() for permission in self.permission_classes]

    @action(detail=True, methods=['get'])
    def questions(self, request, order=None):
        """Get all quiz questions for a lesson"""
        lesson = self.get_object()
        questions = lesson.quiz_questions.all()
        serializer = LessonQuestionPublicSerializer(questions, many=True)
        return Response(serializer.data)

    @action(detail=False, methods=['post'])
    def submit_quiz(self, request):
        """Submit quiz answers and get scoring"""
        serializer = LessonQuizSubmissionSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        
        lesson = serializer.validated_data['lesson']
        answers = serializer.validated_data['answers']
        
        # Calculate score
        questions = lesson.quiz_questions.all()
        score = 0
        total_points = 0
        correct_count = 0
        results_detail = []
        
        for question in questions:
            total_points += question.points
            student_answer = answers.get(str(question.id))
            is_correct = student_answer == question.correct_answer
            
            if is_correct:
                score += question.points
                correct_count += 1
            
            results_detail.append({
                'question_id': question.id,
                'text': question.text,
                'option_a': question.option_a,
                'option_b': question.option_b,
                'option_c': question.option_c,
                'student_answer': student_answer,
                'correct_answer': question.correct_answer,
                'is_correct': is_correct,
                'explanation': question.explanation,
                'level': question.level
            })
        
        # Normalize score to 10
        final_score = (score / total_points * 10) if total_points > 0 else 0
        
        # Save result if user is authenticated
        if request.user.is_authenticated:
            LessonQuizResult.objects.create(
                student=request.user,
                lesson=lesson,
                score=final_score,
                max_score=10,
                answers=answers
            )
        
        return Response({
            'score': final_score,
            'max_score': 10,
            'correct_count': correct_count,
            'total_count': len(questions),
            'details': results_detail,
            'lesson_id': lesson.id,
            'lesson_title': lesson.title,
            'saved': request.user.is_authenticated
        })


class VideoViewSet(viewsets.ModelViewSet):
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    queryset = Video.objects.all()
    serializer_class = VideoSerializer
    permission_classes = [IsTeacherOrReadOnly]


class LessonQuestionViewSet(viewsets.ModelViewSet):
    queryset = LessonQuestion.objects.all()
    serializer_class = LessonQuestionSerializer
    permission_classes = [IsTeacherOrReadOnly]

    def get_serializer_class(self):
        if self.action == 'retrieve':
            return LessonQuestionDetailSerializer
        return LessonQuestionSerializer


class LessonQuizResultViewSet(viewsets.ModelViewSet):
    queryset = LessonQuizResult.objects.all()
    serializer_class = LessonQuizResultSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if not self.request.user.is_authenticated:
            return LessonQuizResult.objects.none()

        if self.request.user.role == 'teacher':
            return LessonQuizResult.objects.all()

        return LessonQuizResult.objects.filter(student=self.request.user)

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)


class QuizResultViewSet(viewsets.ModelViewSet):
    queryset = QuizResult.objects.all()
    serializer_class = QuizResultSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        if not self.request.user.is_authenticated:
            return QuizResult.objects.none()

        if self.request.user.role == 'teacher':
            return QuizResult.objects.all()

        return QuizResult.objects.filter(student=self.request.user)

    def perform_create(self, serializer):
        serializer.save(student=self.request.user)
