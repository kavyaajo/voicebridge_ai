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
