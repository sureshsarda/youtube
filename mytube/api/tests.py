from django.test import TestCase
import json
from django.contrib.auth.models import User
import glob


def get_videos():
    return list(glob.glob('C:\\Users\\Suresh\\Desktop\\MyTube\\cats\\*.mp4'))


class VideoTest(TestCase):

    def setUp(self):
        self.client.force_login(User.objects.get_or_create(username='testuser')[0])

    def test_video_upload_test(self):
        with open('C:\\Users\\Suresh\\Downloads\\Little Kitten Playing His Toy Mouse.mp4', 'rb') as fp:
            response = self.client.post('/api/videos', {
                'video': fp,
                'payload': json.dumps({
                    'name': 'Cat Video',
                    'categories': ['cat', 'funny']
                })
            })

        with open('C:\\Users\\Suresh\\Downloads\\Little Kitten Playing His Toy Mouse.mp4', 'rb') as fp:
            response = self.client.post('/api/videos', {
                'video': fp,
                'payload': json.dumps({
                    'name': 'Cat Video',
                    'categories': ['cat', 'funny']
                })
            })

            print(response.data)


class TestWatchLater(TestCase):
    def setUp(self):
        self.client.force_login(User.objects.get_or_create(username='testuser')[0])

        for file_path in get_videos():
            with open(file_path, 'rb') as fp:
                response = self.client.post('/api/videos', {
                    'video': fp,
                    'payload': json.dumps({
                        'name': 'Cat Video',
                        'categories': ['cat', 'funny'],
                        'skip_upload': True
                    })
                })
                print(response.data)

    def test_likes(self):
        # initially likes should be empty
        res = self.client.get('/api/playlist/likes')

        res = self.client.put('/api/playlist/likes/1')

        res = self.client.get('/api/playlist/likes')
        assert len(res.data) == 1

        self.client.put('/api/playlist/likes/2')
        res = self.client.get('/api/playlist/likes')
        assert len(res.data) == 2

        self.client.put('/api/playlist/likes/2')
        res = self.client.get('/api/playlist/likes')
        assert len(res.data) == 2

        self.client.delete('/api/playlist/likes/2')
        res = self.client.get('/api/playlist/likes')
        assert len(res.data) == 1
