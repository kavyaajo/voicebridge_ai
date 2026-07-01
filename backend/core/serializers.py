from rest_framework import serializers
from django.contrib.auth.models import User

from .models import AudioRecord, AIResult


class UserSerializer(serializers.ModelSerializer):
    """Serializes user information."""

    class Meta:
        model = User
        fields = ["username", "email"]


class AIResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = AIResult
        fields = [
            "summary",
            "action_items",
            "important_names_dates",
            "translation",
            "created_at",
        ]


class AudioRecordSerializer(serializers.ModelSerializer):
    """Serializes audio records."""

    ai_result = AIResultSerializer(source="airesult", read_only=True)

    class Meta:
        model = AudioRecord 
        fields = "__all__"
        read_only_fields = ["user", "transcript", "ai_result"]

    def validate_transcript(self, value):
        if value and not value.strip():
            raise serializers.ValidationError(
                "Transcript cannot be empty."
            )
        return value

    def validate_audio_file(self, value):
        if not value.name.lower().endswith((".mp3", ".wav", ".m4a")):
            raise serializers.ValidationError(
                "Only MP3, WAV and M4A files are allowed."
            )
        return value