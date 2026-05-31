from rest_framework import serializers
from django.contrib.auth.password_validation import validate_password
from .models import Answer, CustomUser, Lesson, LessonQuestion, LessonQuizResult, Question, Quiz, QuizResult, Video


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'role']


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, validators=[validate_password])
    password2 = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = CustomUser
        fields = ['username', 'email', 'role', 'password', 'password2']

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({'password': 'Les mots de passe ne correspondent pas.'})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')
        user = CustomUser(**validated_data)
        user.set_password(password)
        user.save()
        return user


class AnswerSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id', 'question', 'text', 'is_correct']


class AnswerPublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id', 'text']


class QuestionSerializer(serializers.ModelSerializer):
    answers = AnswerPublicSerializer(many=True, read_only=True)

    class Meta:
        model = Question
        fields = ['id', 'quiz', 'text', 'order', 'answers']


class AnswerNestedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Answer
        fields = ['id', 'text', 'is_correct']


class QuestionCreateSerializer(serializers.ModelSerializer):
    answers = AnswerNestedSerializer(many=True)

    class Meta:
        model = Question
        fields = ['id', 'quiz', 'text', 'order', 'answers']

    def create(self, validated_data):
        answers_data = validated_data.pop('answers')
        question = Question.objects.create(**validated_data)
        for answer_data in answers_data:
            Answer.objects.create(question=question, **answer_data)
        return question

    def update(self, instance, validated_data):
        answers_data = validated_data.pop('answers', [])
        instance.quiz = validated_data.get('quiz', instance.quiz)
        instance.text = validated_data.get('text', instance.text)
        instance.order = validated_data.get('order', instance.order)
        instance.save()

        if answers_data:
            instance.answers.all().delete()
            for answer_data in answers_data:
                Answer.objects.create(question=instance, **answer_data)
        return instance


class VideoSerializer(serializers.ModelSerializer):
    video_url = serializers.SerializerMethodField()
    file = serializers.FileField(required=False, allow_null=True)
    url = serializers.URLField(required=False, allow_blank=True)

    class Meta:
        model = Video
        fields = ['id', 'lesson', 'title', 'url', 'file', 'video_url', 'description', 'created_at']

    def get_video_url(self, obj):
        """Retourne l'URL de la vidéo (fichier ou URL externe)"""
        if obj.file and obj.file.name:
            # Si c'est un fichier uploadé, retourner l'URL du fichier
            return obj.file.url
        # Sinon retourner l'URL externe
        return obj.url if obj.url else ''


class LessonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Lesson
        fields = ['id', 'title', 'content', 'order', 'published', 'created_at']


class LessonDetailSerializer(serializers.ModelSerializer):
    videos = VideoSerializer(many=True, read_only=True)

    class Meta:
        model = Lesson
        fields = ['id', 'title', 'content', 'order', 'published', 'created_at', 'videos']


class LessonQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonQuestion
        fields = ['id', 'lesson', 'text', 'option_a', 'option_b', 'option_c', 'correct_answer', 'explanation', 'level', 'order', 'points']


class LessonQuestionPublicSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonQuestion
        fields = ['id', 'lesson', 'text', 'option_a', 'option_b', 'option_c', 'level', 'order', 'points']


class LessonQuestionDetailSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonQuestion
        fields = ['id', 'lesson', 'text', 'option_a', 'option_b', 'option_c', 'correct_answer', 'explanation', 'level', 'points', 'order']


class LessonQuizSubmissionSerializer(serializers.Serializer):
    lesson_id = serializers.IntegerField()
    answers = serializers.DictField(child=serializers.CharField())

    def validate(self, data):
        try:
            lesson = Lesson.objects.get(id=data['lesson_id'])
        except Lesson.DoesNotExist:
            raise serializers.ValidationError("Lesson not found")
        data['lesson'] = lesson
        return data


class LessonQuizResultSerializer(serializers.ModelSerializer):
    student = UserSerializer(read_only=True)
    lesson_title = serializers.CharField(source='lesson.title', read_only=True)

    class Meta:
        model = LessonQuizResult
        fields = ['id', 'student', 'lesson', 'lesson_title', 'score', 'max_score', 'taken_at', 'answers']


class QuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = Quiz
        fields = ['id', 'title', 'description', 'published', 'created_at']


class QuizDetailSerializer(serializers.ModelSerializer):
    questions = QuestionSerializer(many=True, read_only=True)

    class Meta:
        model = Quiz
        fields = ['id', 'title', 'description', 'published', 'created_at', 'questions']


class QuizResultSerializer(serializers.ModelSerializer):
    student = UserSerializer(read_only=True)
    quiz_title = serializers.CharField(source='quiz.title', read_only=True)

    class Meta:
        model = QuizResult
        fields = ['id', 'quiz', 'quiz_title', 'student', 'score', 'taken_at']
