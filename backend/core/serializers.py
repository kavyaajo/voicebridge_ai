from rest_framework import serializers
from .models import AudioRecord
from django.contrib.auth.models import User

class UserSerializer(serializers.ModelSerializer):
    """Serializes user information for API responses."""
    class Meta:
        model = User
        fields = [ 'username', 'email']
        
class AudioRecordSerializer(serializers.ModelSerializer):
    """Serializes audio record data for create and retrieve operations."""
    class Meta:
        model = AudioRecord
        fields = '__all__'
    def validate_transcript(self, value):
        if value and not value.strip():
            raise serializers.ValidationError(
                "Transcript cannot be empty."
            )
        return value

    def validate_audio_file(self, value):
        if not value.name.lower().endswith((".mp3", ".wav", ".m4a")):
            raise serializers.ValidationError(
                "Only MP3, WAV, and M4A files are allowed."
            )                                  
        return value 