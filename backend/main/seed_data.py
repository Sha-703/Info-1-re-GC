from .models import Lesson

DEFAULT_LESSONS = [
    {
        'title': 'Le Bus',
        'order': 1,
        'content': 'Leçon sur le bus en informatique.',
        'published': True,
    },
    {
        'title': 'Les Ports',
        'order': 2,
        'content': 'Leçon sur les ports informatiques et leurs usages.',
        'published': True,
    },
    {
        'title': "Notions sur l'informatique",
        'order': 3,
        'content': 'Leçon sur les notions de base en informatique.',
        'published': True,
    },
    {
        'title': "L'ordinateur et ses parties",
        'order': 4,
        'content': 'Leçon sur l ordinateur et ses différentes parties.',
        'published': True,
    },
    {
        'title': "Générations d'ordinateurs",
        'order': 5,
        'content': 'Leçon sur les générations d ordinateurs.',
        'published': True,
    },
    {
        'title': 'Mémoire informatique',
        'order': 6,
        'content': 'Leçon sur la mémoire et le stockage.',
        'published': True,
    },
]


def populate_lessons_and_questions():
    for lesson_data in DEFAULT_LESSONS:
        lesson, created = Lesson.objects.update_or_create(
            title=lesson_data['title'],
            defaults={
                'order': lesson_data['order'],
                'content': lesson_data['content'],
                'published': lesson_data['published'],
            }
        )
        if created:
            print(f'✓ Leçon créée: {lesson.title}')
        else:
            print(f'✓ Leçon mise à jour: {lesson.title}')
