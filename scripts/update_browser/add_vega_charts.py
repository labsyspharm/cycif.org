import os
import csv
import json
import itertools
from pathlib import Path

def yield_paths(dir, ext):
    paths = Path(dir).glob(f'**/*.{ext}')
    for path in paths:
        yield path

def update_barchart(path):
    if not isinstance(path, str):
        raise ValueError('Barchart path must be string.')

    return {
        "config": {
            "view": {
                "continuousWidth": 400,
                "continuousHeight": 300
            },
            "background": None
        },
        "data": {
            "url": path
        },
        "mark": "bar",
        "encoding": {
            "x": {
                "type": "nominal",
                "field": "type",
                "grid": False
            },
            "y": {
                "type": "quantitative",
                "field": "frequency",
                "grid": False
            },
            "color": {
                "legend": {
                    "direction": "horizontal",
                    "orient": "bottom"
                }
            }
        },
        "$schema": "https://vega.github.io/schema/vega-lite/v4.8.1.json",
        "datasets": {},
        "width": "container"
    }

def update_matrix(path):
    if not isinstance(path, str):
        raise ValueError('Matrix path must be string.')

    sort_x = []
    sort_y = []
    rel_path = os.path.relpath(path, '/')
    with open(rel_path, 'r', newline='') as rf:
        reader = csv.reader(rf, delimiter=',')
        for i, row in enumerate(reader):
            if i == 0:
                header = 'channel,type,frequency'
                if ','.join(row) != header:
                    raise ValueError(f'Matrix header must be {header}')
            else:
                if row[0] not in sort_x:
                    sort_x.append(row[0])
                if row[1] not in sort_y:
                    sort_y.append(row[1])

    if not len(sort_y) or not len(sort_x):
        raise ValueError('Matrix must specify sort order.')

    return {
        "config": {
            "view": {
                "continuousWidth": 400,
                "continuousHeight": 300
            },
            "background": None
        },
        "data": {
            "url": path
        },
        "mark": "rect",
        "encoding": {
            "color": {
                "type": "quantitative",
                "field": "frequency",
                "legend": {
                    "direction": "horizontal",
                    "orient": "bottom"
                }
            },
            "x": {
                "type": "nominal",
                "field": "channel",
                "sort": sort_x,
                "grid": False
            },
            "y": {
                "type": "nominal",
                "field": "type",
                "sort": sort_y,
                "grid": False
            }
        },
        "$schema": "https://vega.github.io/schema/vega-lite/v4.8.1.json",
        "datasets": {},
        "width": "container"
    }

def update_scatterplot(path, axes, labels, colors):
    if not isinstance(path, str):
        raise ValueError('Scatterplot path must be string.')
    if not isinstance(axes, dict) or "x" not in axes or "y" not in axes:
        raise ValueError('Scatterplot must specify axes.')
    if not isinstance(labels, list):
        raise ValueError('Scatterplot must specify labels.')
    if not isinstance(colors, list):
        raise ValueError('Scatterplot must specify colors.')

    return {
        "config": {
            "view": {
                "continuousWidth": 400,
                "continuousHeight": 300
            },
            "background": None
        },
        "data": {
            "url": path
        },
        "mark": {
            "type": "circle",
            "size": 60
        },
        "encoding": {
            "color": {
                "type": "nominal",
                "field": "Cluster",
                "scale": {
                    "domain": labels,
                    "range": colors
                },
                "legend": {
                    "direction": "horizontal",
                    "orient": "bottom"
                }
            },
            "x": {
                "type": "quantitative",
                "field": axes["x"],
                "scale": {
                    "zero": False
                },
                "grid": False
            },
            "y": {
                "type": "quantitative",
                "field": axes["y"],
                "scale": {
                    "zero": False
                },
                "grid": False
            }
        },
        "transform": [
            {
                "lookup": "clust_ID",
                "from": {
                    "data": {
                        "name": "data-from-yaml"
                    },
                    "key": "clust_ID",
                    "fields": [
                        "Cluster"
                    ]
                }
            },
            {
                "filter": "(datum.Cluster !== null)"
            }
        ],
        "$schema": "https://vega.github.io/schema/vega-lite/v4.8.1.json",
        "datasets": {
            "data-from-yaml": [
                {
                    "clust_ID": 1,
                    "Cluster": "Tumor"
                },
                {
                    "clust_ID": 2,
                    "Cluster": "Other"
                },
                {
                    "clust_ID": 3,
                    "Cluster": "Immune"
                },
                {
                    "clust_ID": 4,
                    "Cluster": "Stromal"
                }
            ]
        },
        "width": "container"
    }

def add_hash(color):
    return color if color[0] == '#' else f'#{color}'

def update_scatterplot_from_dict(config):
    axes = config["axes"]
    data = config["data"]
    clusters = config["clusters"]
    labels = clusters["labels"].split(',')
    colors = list(map(add_hash, clusters["colors"].split(',')))
    return update_scatterplot(data, axes, labels, colors)

def modify_charts(data):
    for story in data.get("Stories", []):
        for waypoint in story.get("Waypoints", []):

            if "VisBarChart" in waypoint:
                barchart_path = waypoint["VisBarChart"]
                waypoint["VisBarChart"] = update_barchart(barchart_path)

            if "VisMatrix" in waypoint:
                matrix_path = waypoint["VisMatrix"]
                if isinstance(matrix_path, dict):
                    matrix_path = matrix_path["data"]
                waypoint["VisMatrix"] = update_matrix(matrix_path)

            if "VisScatterplot" in waypoint:
                scatter_dict = waypoint["VisScatterplot"]
                waypoint["VisScatterplot"] = update_scatterplot_from_dict(scatter_dict)
            if "VisCanvasScatterplot" in waypoint:
                scatter_dict = waypoint["VisCanvasScatterplot"]
                waypoint["VisScatterplot"] = update_scatterplot_from_dict(scatter_dict)

    return data

def convert_to_vega(json_path):
    with open(json_path, "r+") as out_stream:
        data = None
        try:
            data = json.load(out_stream)
        except json.decoder.JSONDecodeError as e:
            print(f'Error with {json_path}')
            print(e)
        if data:
            out_stream.seek(0)
            new_data = modify_charts(data)
            json.dump(new_data, out_stream)

if __name__ == "__main__":
    json_paths = yield_paths('./_data', 'json')
    for path in json_paths:
        convert_to_vega(path)
