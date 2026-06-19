import pytest
from django.contrib.auth.models import User
from core.models import AudioRecord
from core.serializers import UserSerializer,AudioRecordSerializer

pytestmark=pytest.mark.django_db

def test_user_serializer():
    user=User.objects.create_user(
    username="kavya",
    email="kavya@example.com")
    serializer = UserSerializer(user)

    assert serializer.data["username"] == "kavya"
    assert serializer.data["email"] == "kavya@example.com"


def test_audio_record_serializer():
    user = User.objects.create_user(
        username="testuser",
        email="test@example.com"
    )

    audio = AudioRecord.objects.create(
        user=user,
        audio_file="audio/test.mp3",
        transcript="Hello world"
    )

    serializer = AudioRecordSerializer(audio)

    assert serializer.data["transcript"] == "Hello world"
    assert serializer.data["user"] == user.id





