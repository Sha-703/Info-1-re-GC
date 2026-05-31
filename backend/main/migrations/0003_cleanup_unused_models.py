# Generated migration to clean up unused models

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('main', '0002_question_lesson_alter_question_quiz'),
    ]

    operations = [
        # Remove Video references first
        migrations.DeleteModel(
            name='Video',
        ),
        # Remove Lesson references from Question
        migrations.RemoveField(
            model_name='question',
            name='lesson',
        ),
        # Remove Lesson model
        migrations.DeleteModel(
            name='Lesson',
        ),
        # Remove Quiz's reference to Course
        migrations.RemoveField(
            model_name='quiz',
            name='course',
        ),
        # Remove Course model
        migrations.DeleteModel(
            name='Course',
        ),
        # Add created_at field to Quiz
        migrations.AddField(
            model_name='quiz',
            name='created_at',
            field=models.DateTimeField(auto_now_add=True, null=True),
        ),
        # Make question.quiz field non-nullable
        migrations.AlterField(
            model_name='question',
            name='quiz',
            field=models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='questions', to='main.quiz'),
        ),
    ]
