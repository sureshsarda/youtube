import json

from rest_framework import status
from rest_framework.response import Response
from rest_framework.views import APIView

from .aws import create_thumbnail, upload_video
from .models import Video, VideoCategories, Playlist
from django.core.exceptions import ObjectDoesNotExist
from .serializers import VideoSerializer, PlaylistSerializer, VideoCategorySerializer


class VideoCategoryListApiView(APIView):
    def get(self, request, *args, **kwargs):
        categories = VideoCategories.objects.all()
        serializer = VideoCategorySerializer(categories, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class VideoListApiView(APIView):
    # add permission to check if user is authenticated
    # permission_classes = [permissions.IsAuthenticated]

    def get(self, request, *args, **kwargs):
        base_params = {'status': 'COMPLETE'}
        params = request.query_params
        if 'category' in params:
            base_params['categories__name'] = params['category']

        if 'query' in params:
            base_params['name__contains'] = params['query']

        videos = Video.objects.filter(**base_params)
        serializer = VideoSerializer(videos, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        video_fp = request.data.get('video')
        payload = json.loads(request.data.get('payload'))

        categories = payload['categories']
        VideoCategories.objects.bulk_create([VideoCategories(name=c) for c in categories], ignore_conflicts=True)

        already_present = VideoCategories.objects.filter(name__in=categories)

        video = Video(name=payload['name'], uploader_id=1, status='QUEUED')
        video.save()

        video.categories.set(already_present)

        if 'skip_upload' not in payload:
            thumbnail_location = create_thumbnail(video_fp.file.name)
            s3_video, s3_thumb = upload_video(video_fp.file.name, thumbnail_location, video.id)

            video.path = s3_video
            video.thumbnail = s3_thumb
        else:
            print('Skipping upload process')

        video.status = 'COMPLETE'
        video.save()

        return Response(VideoSerializer(video).data, status=status.HTTP_200_OK)


class VideoApiView(APIView):

    def get(self, request, id, *args, **kwargs):
        videos = Video.objects.get(id=id)
        serializer = VideoSerializer(videos)
        return Response(serializer.data, status=status.HTTP_200_OK)


class PlaylistApiView(APIView):

    def get(self, request, name, *args, **kwargs):
        try:
            videos = Video.objects.prefetch_related('categories').filter(playlist__name=name,
                                                                         playlist__owner_id=1)

            return Response(VideoSerializer(videos, many=True).data, status=status.HTTP_200_OK)
        except ObjectDoesNotExist:
            return Response([], status=status.HTTP_200_OK)

    def put(self, request, name, video_id, *args, **kwargs):
        try:
            playlist = Playlist.objects.get(owner_id=1, name=name)
        except ObjectDoesNotExist:
            playlist = Playlist(name=name, owner_id=1)
            playlist.save()

        playlist.videos.add(video_id)
        playlist.save()
        return Response(status=status.HTTP_202_ACCEPTED)

    def delete(self, request, name, video_id, *args, **kwargs):
        try:
            playlist = Playlist.objects.get(owner_id=1, name=name)
            playlist.videos.remove(video_id)
            playlist.save()
        except ObjectDoesNotExist:
            # nothing to do
            pass

        return Response(status=status.HTTP_202_ACCEPTED)
