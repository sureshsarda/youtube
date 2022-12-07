from rest_framework import serializers
from .models import Video, Playlist, VideoCategories


class VideoCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = VideoCategories
        fields = ["name"]


class VideoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Video
        fields = ["id", "name", "created", "updated", "uploader", "thumbnail", "path", "categories"]


class PlaylistSerializer(serializers.ModelSerializer):
    class Meta:
        model = Playlist
        fields = ["name", "owner", "videos"]
