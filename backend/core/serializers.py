from rest_framework import serializers
from .models import AudioRecord, User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = [ 'username', 'email']
        
class AudioRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = AudioRecord
        fields = '__all__'
