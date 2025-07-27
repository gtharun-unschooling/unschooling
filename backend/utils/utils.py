import json

import os

def load_niche_data():
    # Get the current directory (backend folder)
    current_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    data_path = os.path.join(current_dir, "data", "topicsdata.json")
    with open(data_path, "r", encoding="utf-8") as f:
        return json.load(f)
