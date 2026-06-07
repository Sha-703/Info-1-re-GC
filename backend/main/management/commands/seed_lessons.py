from django.core.management.base import BaseCommand
from main.seed_data import populate_lessons_and_questions


class Command(BaseCommand):
    help = 'Populate lessons and lesson questions if missing.'

    def handle(self, *args, **options):
        self.stdout.write('Seeding lessons and questions...')
        populate_lessons_and_questions()
        self.stdout.write(self.style.SUCCESS('Lessons and questions seeded.'))
