from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import Answer, CustomUser, Lesson, LessonQuestion, LessonQuizResult, Question, Quiz, QuizResult, Video
from django.utils.html import format_html


class AnswerInline(admin.TabularInline):
    model = Answer
    extra = 4  # Number of empty forms to display


class VideoInline(admin.TabularInline):
    model = Video
    extra = 3
    readonly_fields = ('video_preview',)
    fields = ('title', 'file', 'url', 'video_preview')

    def video_preview(self, obj):
        if not obj:
            return ''
        if obj.file:
            return format_html('<a href="{}" target="_blank">Voir le fichier</a>', obj.file.url)
        if obj.url:
            return format_html('<a href="{}" target="_blank">Voir la vidéo</a>', obj.url)
        return ''

    video_preview.short_description = 'Aperçu'


@admin.register(Question)
class QuestionAdmin(admin.ModelAdmin):
    inlines = [AnswerInline]
    list_display = ['text', 'quiz', 'order']


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin):
    fieldsets = UserAdmin.fieldsets + (
        ('Rôle', {'fields': ('role',)}),
    )


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = ['title', 'order', 'published', 'created_at']
    list_filter = ['published', 'created_at']
    search_fields = ['title', 'content']
    inlines = [VideoInline]


@admin.register(Quiz)
class QuizAdmin(admin.ModelAdmin):
    list_display = ['title', 'published', 'created_at']
    list_filter = ['published', 'created_at']


@admin.register(Answer)
class AnswerAdmin(admin.ModelAdmin):
    list_display = ['text', 'question', 'is_correct']
    list_filter = ['is_correct']


@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = ['title', 'lesson', 'url', 'file', 'created_at']
    search_fields = ['title', 'lesson__title']

    def video_preview(self, obj):
        if not obj:
            return ''
        if obj.file:
            return format_html('<a href="{}" target="_blank">Voir le fichier</a>', obj.file.url)
        if obj.url:
            return format_html('<a href="{}" target="_blank">Voir la vidéo</a>', obj.url)
        return ''

    video_preview.short_description = 'Aperçu'


@admin.register(LessonQuestion)
class LessonQuestionAdmin(admin.ModelAdmin):
    list_display = ['text', 'lesson', 'level', 'order', 'points']
    list_filter = ['level', 'lesson']
    search_fields = ['text', 'lesson__title']
    readonly_fields = ['correct_answer']


@admin.register(LessonQuizResult)
class LessonQuizResultAdmin(admin.ModelAdmin):
    list_display = ['student', 'lesson', 'score', 'max_score', 'taken_at']
    list_filter = ['lesson', 'taken_at']
    search_fields = ['student__username', 'lesson__title']
    readonly_fields = ['student', 'lesson', 'score', 'max_score', 'taken_at']


@admin.register(QuizResult)
class QuizResultAdmin(admin.ModelAdmin):
    list_display = ['student', 'quiz', 'score', 'taken_at']
    list_filter = ['quiz', 'taken_at']
    readonly_fields = ['student', 'quiz', 'score', 'taken_at']
