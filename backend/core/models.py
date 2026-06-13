from django.db import models
from django.contrib.auth.models import User


class AudioRecord(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    audio_file = models.FileField(upload_to="audio/")
    transcript = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.audio_file.name}"


class AIResult(models.Model):
    audio = models.OneToOneField(AudioRecord, on_delete=models.CASCADE)
    summary = models.TextField()
    key_points = models.TextField()
    translation = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"AI Result for {self.audio.id}"