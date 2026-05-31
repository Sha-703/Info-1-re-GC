import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend.settings')
django.setup()

from main.models import Lesson
from main.serializers import LessonDetailSerializer
from rest_framework.test import APIRequestFactory

# Créer une fausse requête pour le contexte
factory = APIRequestFactory()
request = factory.get('/lessons/2/')

# Sérialiser la leçon 2 avec contexte
lesson = Lesson.objects.get(id=2)
serializer = LessonDetailSerializer(lesson, context={'request': request})
data = serializer.data

print("Leçon 2 sérialisée:")
print(f"Title: {data.get('title')}")
print(f"Videos count: {len(data.get('videos', []))}")
if data.get('videos'):
    for video in data.get('videos'):
        print(f"  - Video: {video.get('title')}")
        print(f"    video_url: {video.get('video_url')}")
        print(f"    file: {video.get('file')}")
        print(f"    url: {video.get('url')}")
else:
    print("No videos found!")
