from django.urls import path, include
from .views import (
    VideoListApiView, VideoApiView, PlaylistApiView
)

urlpatterns = [
    path('videos', VideoListApiView.as_view()),
    path('video/<int:id>', VideoApiView.as_view()),
    path('playlist/<slug:name>', PlaylistApiView.as_view()),
    path('playlist/<slug:name>/<int:video_id>', PlaylistApiView.as_view())
]
