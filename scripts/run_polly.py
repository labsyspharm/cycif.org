import hashlib
import boto3
import glob
import yaml

def upload_hash(text, text_key):
    polly_client = boto3.client('polly')
    response = polly_client.synthesize_speech(Text=text, OutputFormat="mp3", VoiceId="Matthew")
    audio = response['AudioStream'].read()
    s3_client = boto3.client("s3")
    s3_client.put_object(ACL="public-read", Body=audio, Bucket="www.cycif.org", ContentType="audio/mpeg", StorageClass="REDUCED_REDUNDANCY", Key=f"speech/{text_key}.mp3")

def delete_hash(text_key):
    s3_client = boto3.client("s3")
    s3_client.delete_object(Bucket="www.cycif.org", Key=f"speech/{text_key}.mp3")

def list_hash():
    s3_client = boto3.client("s3")
    response = s3_client.list_objects_v2(Bucket="www.cycif.org", Prefix=f"speech/")
    contents = response.get('Contents', None)
    if contents:
        return [c['Key'].split('/')[1].split('.')[0] for c in contents]
    return []

def do_sha1(text):
    return hashlib.sha1(text.encode("utf-8")).hexdigest()

def yield_texts():
    cycif_paths = glob.glob('../_data/*/*.yml')
    for path in cycif_paths:
        with open(path, 'r') as op:
            parsed = yaml.load(op, Loader=yaml.FullLoader)
            exhibit = parsed.get('Exhibit', {})
            stories = exhibit.get('Stories', [])
            header = exhibit.get('Header', '')
            if len(header):
                yield header
            for s_id, s in enumerate(stories):
                waypoints = s.get('Waypoints', [])
                for w_id, w in enumerate(waypoints):
                    if len(w['Description']):
                        yield w['Description']

if __name__ == "__main__":

    a = list_hash()
    texts = [t for t in yield_texts()]
    sha1_texts = {do_sha1(t):t for t in texts} 

    needed_sha1 = set(sha1_texts.keys())
    existing_sha1 = set(list_hash())

    for h in needed_sha1 - existing_sha1:
        upload_hash(sha1_texts[h], h)
        print(f'uploaded {h}')
    for h in existing_sha1 - needed_sha1:
        delete_hash(h)
        print(f'deleted {h}')
    
