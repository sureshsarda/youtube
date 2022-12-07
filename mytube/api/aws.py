import boto3
import tempfile
from moviepy.editor import *

# BUCKET_NAME = 'x21169489-mytube'
BUCKET_NAME = 'mytube-1'


def create_thumbnail(video_file_path):
    file_id, tmp_thumbnail_path = tempfile.mkstemp(suffix='.jpg')

    clip = VideoFileClip(video_file_path)
    clip.save_frame(tmp_thumbnail_path, t=1.00)

    return tmp_thumbnail_path


# def upload_video_to_local_fs(video_file, thumbnail_file, id):
#     base_path = 'C:\\Users\\Suresh\\Desktop\\MyTube\\storage\\'
#
#     # directory location
#     directory = base_path + '\\' + id
#     video_location = directory + '\\' + 'video.mp4'
#     thumbnail_location = directory + '\\' + 'thumb.jpg'
#
#     # create a directory if not already present
#     os.makedirs(base_path, id)
#
#     # copy the files
#     with open(video_location, 'wb') as wp:
#         wp.write(video_file.read())
#
#     with open(thumbnail_location, 'wb') as wp:
#         wp.write(thumbnail_file.read())


def upload_video(video_file_name, thumbnail_file_name, video_id):
    s3 = boto3.resource('s3')

    bucket = s3.Bucket(BUCKET_NAME)

    bucket.objects.filter(Prefix=str(video_id) + '/').delete()

    s3_thumb_path = '{}/thumb.jpg'.format(video_id)
    s3_video_path = '{}/video.mp4'.format(video_id)

    bucket.upload_file(video_file_name, s3_video_path)
    bucket.upload_file(thumbnail_file_name, s3_thumb_path)

    base_path = 'https://{}.s3.amazonaws.com/'.format(BUCKET_NAME)
    return base_path + s3_video_path, base_path + s3_thumb_path


def create_queue_listener():
    while True:
        for message in queue.receive_messages(WaitTimeSeconds=20):
            # Get the custom author message attribute if it was set
            author_text = ''
            if message.message_attributes is not None:
                author_name = message.message_attributes.get('Author').get('StringValue')
                if author_name:
                    author_text = ' ({0})'.format(author_name)

            # Print out the body and author (if set)
            print('Hello, {0}!{1}'.format(message.body, author_text))

            # Let the queue know that the message is processed
            message.delete()


if __name__ == '__main__':

    from botocore.config import Config

    # s3 = boto3.resource('s3')
    # for bucket in s3.buckets.all():
    #     print(bucket.name)

    sqs = boto3.resource('sqs', region_name='ap-northeast-1')
    queue = sqs.get_queue_by_name(QueueName='mytube')

    # response = queue.send_message(MessageBody='world')

    # Process messages by printing out body and optional author name
    for message in queue.receive_messages(WaitTimeSeconds=20):
        # Get the custom author message attribute if it was set
        author_text = ''
        if message.message_attributes is not None:
            author_name = message.message_attributes.get('Author').get('StringValue')
            if author_name:
                author_text = ' ({0})'.format(author_name)

        # Print out the body and author (if set)
        print('Hello, {0}!{1}'.format(message.body, author_text))

        # Let the queue know that the message is processed
        message.delete()
