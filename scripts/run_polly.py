import hashlib
import pathlib
import botocore
import boto3
import yaml
import sys
import time
import argparse
import itertools
from bs4 import BeautifulSoup
from markdown import markdown

def make_key(text_key):
    return f"speech/{text_key}.mp3"

def upload_hash(polly_client, text_md, text_key, bucket):
    text_html = BeautifulSoup(markdown(text_md), features="html.parser")
    text = ''.join(text_html.findAll(text=True))
    response = polly_client.synthesize_speech(Text=text, OutputFormat="mp3", VoiceId="Matthew", Engine="standard")
    audio = response['AudioStream'].read()
    s3_client = boto3.client("s3")
    s3_client.put_object(ACL="public-read", Body=audio, Bucket=bucket, ContentType="audio/mpeg", StorageClass="REDUCED_REDUNDANCY", Key=make_key(text_key))

def upload_hash_async(polly_client, text_md, text_key, bucket):
    text_html = BeautifulSoup(markdown(text_md), features="html.parser")
    text = ''.join(text_html.findAll(text=True))
    response = polly_client.start_speech_synthesis_task(Text=text, OutputFormat="mp3", VoiceId="Matthew", Engine="standard",
                                                        OutputS3BucketName=bucket, OutputS3KeyPrefix=make_key(text_key))
    task = response.get('SynthesisTask', {})
    return {
        'status': task.get('TaskStatus', 'failed'),
        'id': task.get('TaskId', ''),
        'key': make_key(text_key),
        'hash': text_key,
        'bucket': bucket
    }

def filter_current_tasks(current_tasks):
    filtered_tasks = []
    for task in current_tasks:
        if task['status'] in ['scheduled', 'inProgress']:
            if all([task.get(k) for k in ['id', 'bucket', 'key', 'hash']]):
                filtered_tasks.append(task)
    return filtered_tasks

def awaiting_any_tasks(current_tasks):
    return len(filter_current_tasks(current_tasks)) > 0

def delete_hash(text_key, bucket):
    s3_client = boto3.client("s3")
    s3_client.delete_object(Bucket=bucket, Key=f"speech/{text_key}.mp3")

def list_hash(bucket):
    s3_client = boto3.client("s3")
    response = s3_client.list_objects_v2(Bucket=bucket, Prefix=f"speech/")
    contents = response.get('Contents', None)
    if contents:
        return [c['Key'].split('/')[1].split('.')[0] for c in contents]
    return []

def do_sha1(text):
    return hashlib.sha1(text.encode("utf-8")).hexdigest()

def yield_paths(data_path):
    yml_paths = data_path.glob('*/*.yml')
    yaml_paths = data_path.glob('*/*.yaml')
    for path in itertools.chain(yml_paths, yaml_paths):
        yield path

def yield_texts(paths):
    for path in paths:
        with open(path, 'r') as op:
            parsed = yaml.load(op, Loader=yaml.FullLoader)
            exhibit = parsed.get('Exhibit', {})
            stories = exhibit.get('Stories', [])
            header = exhibit.get('Header', '')
            if len(header):
                yield (path, 'header', header)
            for s_id, s in enumerate(stories):
                waypoints = s.get('Waypoints', [])
                for w_id, w in enumerate(waypoints):
                    if len(w['Description']):
                        yield (path, f'{s_id}:{w_id}', w['Description'])

if __name__ == "__main__":
  
    polly_client = boto3.client('polly')
    parser = argparse.ArgumentParser()
    parser.add_argument("bucket")
    args = parser.parse_args()
    bucket = args.bucket

    try:
        list_hash(bucket)
    except botocore.exceptions.NoCredentialsError as e:
        print('No Available AWS Credentials')
        print(e)
        sys.exit(0)
 
    root = pathlib.Path(__file__).resolve().parents[1]
    paths = [p for p in yield_paths(root / "_data")]
    sha1_texts = {do_sha1(t):(p,k,t) for (p,k,t) in yield_texts(paths)}

    needed_sha1 = set(sha1_texts.keys())
    existing_sha1 = set(list_hash(bucket))
    current_tasks = []

    for h in needed_sha1 - existing_sha1:
        path, key, text = sha1_texts[h]
        if len(text) > 3000:
            latest_task = upload_hash_async(polly_client, text, h, bucket)
            current_tasks.append(latest_task)
            print(f'scheduled upload of {path} {key} to {h}')
        else:
            upload_hash(polly_client, text, h, bucket)
            print(f'uploaded {path} {key} to {h}')
    for h in existing_sha1 - needed_sha1:
        delete_hash(h, bucket)
        print(f'deleted {h}')

    while awaiting_any_tasks(current_tasks):
        filtered_tasks = filter_current_tasks(current_tasks)
        print(f'Checking {len(filtered_tasks)} scheduled uploads')
        for task in filtered_tasks:
            response = polly_client.get_speech_synthesis_task(task['id'])
            new_task = response.get('SynthesisTask', {})
            task['status'] = new_task.get('TaskStatus', task['status'])
            if task['status'] == 'completed' and task['hash'] in sha1_texts:
                path, key, text = sha1_texts.get(task['hash'])
                print(f'Finished upload of {path} {key} to {h}')
        time.sleep(5)
