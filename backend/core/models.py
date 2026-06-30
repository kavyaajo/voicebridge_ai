from django.db import models
from django.contrib.auth.models import User


class AudioRecord(models.Model):
    """Stores uploaded audio files and their transcripts."""
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    audio_file = models.FileField(upload_to="audio/")
    transcript = models.TextField(blank=True,default="")
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} - {self.audio_file.name}"


class AIResult(models.Model):
    audio = models.OneToOneField(AudioRecord, on_delete=models.CASCADE)

    summary = models.TextField()

    action_items = models.TextField(blank=True, default="")

    important_names_dates = models.TextField(blank=True, default="")

    translation = models.TextField(blank=True, default="")

    created_at = models.DateTimeField(auto_now_add=True)