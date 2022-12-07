from django.db import models
from django.contrib.auth.models import User


class VideoCategories(models.Model):
    name = models.CharField(max_length=128, unique=True, null=False, blank=False)


class Video(models.Model):
    ProcessingStatus = models.TextChoices('ProcessingStatus', 'QUEUED PROCESSING COMPLETE')

    name = models.CharField(max_length=512, null=False)
    created = models.DateTimeField(auto_now_add=True, auto_now=False, blank=True)
    updated = models.DateTimeField(auto_now=True, blank=True)
    uploader = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=False)
    thumbnail = models.CharField(max_length=200, null=True, blank=True)
    path = models.CharField(max_length=200, null=True, blank=True)
    categories = models.ManyToManyField(VideoCategories)
    status = models.CharField(blank=True, choices=ProcessingStatus.choices, max_length=16)


class Playlist(models.Model):
    name = models.CharField(max_length=180)
    timestamp = models.DateTimeField(auto_now_add=True, auto_now=False, blank=True)
    owner = models.ForeignKey(User, on_delete=models.CASCADE, blank=True, null=False)
    videos = models.ManyToManyField(Video)
