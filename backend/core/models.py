from django.db import models

# Create your models here

class User(models.Model):
    username = models.CharField(max_length=150)
    email = models.EmailField(unique=True)
    created_at = models.DateTimeField(auto_now_add=True)

class AudioRecord(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    audio_file = models.CharField(max_length=255)
    transcript=models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

class AIResult(models.Model):
    audio=models.OneToOneField(AudioRecord,on_delete=models.CASCADE)
    summary=models.TextField()
    key_points=models.TextField()
    translation=models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)



