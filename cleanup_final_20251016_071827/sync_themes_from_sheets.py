#!/usr/bin/env python3

import gspread
from google.oauth2.service_account import Credentials
import json
from datetime import datetime

def sync_themes_from_sheets():
    try:
        # Load service account credentials
        creds = Credentials.from_service_account_file(
            'google-sheets-service-account.json',
            scopes=[
                'https://www.googleapis.com/auth/spreadsheets',
                'https://www.googleapis.com/auth/drive'
            ]
        )
        
        # Create gspread client
        gc = gspread.authorize(creds)
        
        print("🔍 Accessing Sample 1 Google Sheet...")
        
        # Get Sample 1 sheet
        sheets = gc.openall()
        sample_1_sheet = None
        
        for sheet in sheets:
            if 'sample 1' in sheet.title.lower():
                sample_1_sheet = sheet
                break
        
        if not sample_1_sheet:
            print("❌ Sample 1 not found!")
            return
        
        # Get Theme Names worksheet
        theme_names_ws = None
        for ws in sample_1_sheet.worksheets():
            if 'theme' in ws.title.lower() and 'name' in ws.title.lower():
                theme_names_ws = ws
                break
        
        if not theme_names_ws:
            print("❌ Theme Names worksheet not found!")
            return
        
        print(f"✅ Found worksheet: '{theme_names_ws.title}'")
        
        # Get all data
        all_data = theme_names_ws.get_all_values()
        headers = all_data[0]
        data_rows = all_data[1:]
        
        print(f"📊 Retrieved {len(data_rows)} themes from Google Sheets")
        
        # Convert to JSON format
        themes = []
        for i, row in enumerate(data_rows, 1):
            if len(row) >= 6 and any(cell.strip() for cell in row):
                theme = {
                    "planType": row[0].strip(),
                    "sno": int(row[1].strip()) if row[1].strip().isdigit() else row[1].strip(),
                    "ageGroup": row[2].strip(),
                    "themeName": row[3].strip(),
                    "shortDescription": row[4].strip(),
                    "coreFocusArea": row[5].strip()
                }
                themes.append(theme)
        
        print(f"✅ Converted {len(themes)} themes to JSON format")
        
        # Create the JSON structure
        theme_data = {
            "lastUpdated": datetime.now().strftime("%Y-%m-%d"),
            "totalThemes": len(themes),
            "themes": themes
        }
        
        # Save to local file
        local_file = "backend/data/theme_names.json"
        
        # Backup existing file
        import os
        if os.path.exists(local_file):
            backup_file = f"backend/data/theme_names_backup_{datetime.now().strftime('%Y%m%d_%H%M%S')}.json"
            os.rename(local_file, backup_file)
            print(f"📦 Backed up existing file to: {backup_file}")
        
        # Write new file
        with open(local_file, 'w', encoding='utf-8') as f:
            json.dump(theme_data, f, indent=2, ensure_ascii=False)
        
        print(f"✅ Saved to local file: {local_file}")
        
        # Verify the file
        with open(local_file, 'r', encoding='utf-8') as f:
            verified_data = json.load(f)
        
        print(f"\n🔍 VERIFICATION:")
        print(f"   Total themes in file: {verified_data['totalThemes']}")
        print(f"   Last updated: {verified_data['lastUpdated']}")
        
        # Show the Story Builders entries
        story_builders = [t for t in verified_data['themes'] if 'Story Builders' in t['themeName']]
        if story_builders:
            print(f"\n📖 Story Builders themes found: {len(story_builders)}")
            for sb in story_builders:
                print(f"   - {sb['ageGroup']}: {sb['themeName']} (S.No: {sb['sno']})")
        
        print(f"\n✅ SUCCESS! Synced Google Sheets → Local JSON file")
        print(f"📁 File location: {local_file}")
        
        # Summary
        print(f"\n📊 SYNC SUMMARY:")
        print(f"   Source: Google Sheets (Theme Names)")
        print(f"   Destination: {local_file}")
        print(f"   Themes synced: {len(themes)}")
        print(f"   Date: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
        
        return theme_data
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return None

if __name__ == "__main__":
    sync_themes_from_sheets()

