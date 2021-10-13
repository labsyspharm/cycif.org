import os
import json
import yaml
import itertools
from pathlib import Path

def yield_paths(dir, ext):
    paths = Path(dir).glob(f'**/*.{ext}')
    for path in paths:
        yield path

def convert_to_json(yaml_path):
    json_path = yaml_path.with_suffix('.json') 
    with open(yaml_path, "r") as stream:
        try:
            data = yaml.safe_load(stream)
            if 'Exhibit' in data:
                with open(json_path, 'w') as out_stream:
                    json.dump(data['Exhibit'], out_stream)
                os.remove(yaml_path)
            else:
                print(f'Keeping {yaml_path}')
        except yaml.YAMLError as exc:
            print(exc)

if __name__ == "__main__":
    yml_paths = yield_paths('./_data', 'yml')
    yaml_paths = yield_paths('./_data', 'yaml')
    for path in itertools.chain(yml_paths, yaml_paths):
        convert_to_json(path)
