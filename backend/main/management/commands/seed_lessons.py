import subprocess
from django.core.management.base import BaseCommand


class Command(BaseCommand):
    help = 'Populate lessons and lesson questions if missing.'

    def handle(self, *args, **options):
        self.stdout.write('Seeding lessons and questions...')
        result = subprocess.run(
            ['python', 'populate_lesson_questions.py'],
            check=False,
            capture_output=True,
            text=True,
        )

        if result.stdout:
            self.stdout.write(result.stdout)
        if result.stderr:
            self.stderr.write(result.stderr)

        if result.returncode != 0:
            raise Exception('populate_lesson_questions.py failed with exit code ' + str(result.returncode))

        self.stdout.write(self.style.SUCCESS('Lessons and questions seeded.'))
