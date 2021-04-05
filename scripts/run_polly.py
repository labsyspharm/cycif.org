import hashlib
import pathlib
import botocore
import boto3
import yaml
import sys
import argparse
import itertools
from bs4 import BeautifulSoup
from markdown import markdown

def upload_hash(text_md, text_key, bucket):
    polly_client = boto3.client('polly')
    text_html = BeautifulSoup(markdown(text_md), features="html.parser")
    text = ''.join(text_html.findAll(text=True))
    response = polly_client.synthesize_speech(Text=text, OutputFormat="mp3", VoiceId="Matthew")
    audio = response['AudioStream'].read()
    s3_client = boto3.client("s3")
    s3_client.put_object(ACL="public-read", Body=audio, Bucket=bucket, ContentType="audio/mpeg", StorageClass="REDUCED_REDUNDANCY", Key=f"speech/{text_key}.mp3")

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

    for h in needed_sha1 - existing_sha1:
        path, key, text = sha1_texts[h]
        try:
            upload_hash(text, h, bucket)
            print(f'uploaded {path} {key} to {h}')
        except botocore.exceptions.TextLengthExceededException as e:
            print(f'{path} {key} text is too long.')
            short_text = text[:3000]
            upload_hash(short_text, h, bucket)
            percent = 100 * len(short_text) / len(text)
            print(f'uploaded {percent:.2f}% of {path} {key} to {h}')
    for h in existing_sha1 - needed_sha1:
        delete_hash(h, bucket)
        print(f'deleted {h}')
