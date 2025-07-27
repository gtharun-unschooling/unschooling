import gspread
import json
import os

# Define the destination folder
output_folder = os.path.join("src", "data")
os.makedirs(output_folder, exist_ok=True)

# Authenticate using service account
gc = gspread.service_account(filename="credentials.json")

# Open the sheet
sh = gc.open("3 pages")

# === Load Niche Topics Sheet ===
niche_topics_ws = sh.worksheet("Niche Topics")
niche_topics_data = niche_topics_ws.get_all_records()

niche_topics_path = os.path.join(output_folder, "topicsdata.json")
with open(niche_topics_path, 'w', encoding='utf-8') as f:
    json.dump(niche_topics_data, f, ensure_ascii=False, indent=2)
    print(f'Niche topics data saved to {niche_topics_path}')

# === Load Niche Description Sheet ===
niche_description_ws = sh.worksheet("Niche Description")
niche_description_data = niche_description_ws.get_all_records()

niche_description_path = os.path.join(output_folder, "nichesdata.json")
with open(niche_description_path, 'w', encoding='utf-8') as f:
    json.dump(niche_description_data, f, ensure_ascii=False, indent=2)
    print(f'Niche description data saved to {niche_description_path}')

# === Load Essential Growth Topics Sheet ===
essential_growth_ws = sh.worksheet("Essential Growth Topics")
essential_growth_data = essential_growth_ws.get_all_records()

essential_growth_path = os.path.join(output_folder, "essential_growth_data.json")
with open(essential_growth_path, 'w', encoding='utf-8') as f:
    json.dump(essential_growth_data, f, ensure_ascii=False, indent=2)
    print(f'Essential growth topics data saved to {essential_growth_path}')