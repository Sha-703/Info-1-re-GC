from django.contrib.auth.models import AbstractUser
from django.db import models


class CustomUser(AbstractUser):
    ROLE_TEACHER = 'teacher'
    ROLE_STUDENT = 'student'
    ROLE_CHOICES = [
        (ROLE_TEACHER, 'Enseignant'),
        (ROLE_STUDENT, 'Élève'),
    ]

    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default=ROLE_STUDENT)

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"


class Quiz(models.Model):
    title = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"Quiz: {self.title}"


class Question(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='questions')
    text = models.CharField(max_length=500)
    order = models.PositiveIntegerField(default=1)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.text


class Answer(models.Model):
    question = models.ForeignKey(Question, on_delete=models.CASCADE, related_name='answers')
    text = models.CharField(max_length=300)
    is_correct = models.BooleanField(default=False)

    def __str__(self):
        return self.text


class QuizResult(models.Model):
    quiz = models.ForeignKey(Quiz, on_delete=models.CASCADE, related_name='results')
    student = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='quiz_results')
    score = models.FloatField()
    taken_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-taken_at']

    def __str__(self):
        return f"{self.student.username} - {self.quiz.title} ({self.score})"


class Lesson(models.Model):
    title = models.CharField(max_length=200)
    content = models.TextField(blank=True)
    order = models.PositiveIntegerField(default=1)
    published = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['order']

    def __str__(self):
        return self.title


class Video(models.Model):
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='videos')
    title = models.CharField(max_length=200)
    url = models.URLField(blank=True)
    file = models.FileField(upload_to='lesson_videos/', blank=True, null=True)
    description = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['created_at']

    def __str__(self):
        return self.title

    @property
    def video_url(self):
        if self.file:
            return self.file.url
        return self.url


class LessonQuestion(models.Model):
    LEVEL_CHOICES = [
        ('remember', 'Se souvenir'),
        ('understand', 'Comprendre'),
        ('apply', 'Appliquer'),
        ('analyze', 'Analyser'),
        ('evaluate', 'Évaluer'),
    ]

    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE, related_name='quiz_questions')
    text = models.CharField(max_length=500)
    option_a = models.CharField(max_length=300, verbose_name='Option A')
    option_b = models.CharField(max_length=300, verbose_name='Option B')
    option_c = models.CharField(max_length=300, verbose_name='Option C')
    correct_answer = models.CharField(max_length=1, choices=[('a', 'A'), ('b', 'B'), ('c', 'C')])
    explanation = models.TextField(blank=True, help_text="Explication détaillée de la bonne réponse")
    level = models.CharField(max_length=20, choices=LEVEL_CHOICES, default='remember')
    points = models.PositiveIntegerField(default=1)
    order = models.PositiveIntegerField(default=1)

    class Meta:
        ordering = ['lesson', 'order']

    def __str__(self):
        return f"{self.lesson.title} - Q{self.order}"


class LessonQuizResult(models.Model):
    student = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name='lesson_quiz_results')
    lesson = models.ForeignKey(Lesson, on_delete=models.CASCADE)
    score = models.FloatField()
    max_score = models.FloatField(default=10)
    taken_at = models.DateTimeField(auto_now_add=True)
    answers = models.JSONField(default=dict, help_text="Mapping of question_id to selected answer")

    class Meta:
        ordering = ['-taken_at']

    def __str__(self):
        return f"{self.student.username} - {self.lesson.title} ({self.score}/{self.max_score})"
