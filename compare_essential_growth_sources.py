#!/usr/bin/env python3
"""
🔍 Compare Essential Growth Data Sources
Compare local JSON files vs Google Sheets to identify differences
"""

import pandas as pd
import json
import os
from google.oauth2 import service_account
import gspread
from datetime import datetime

def compare_essential_growth_sources():
    """Compare Essential Growth data sources to identify differences"""
    
    print("🔍 Essential Growth Data Sources Comparison")
    print("=" * 70)
    
    # Check local JSON files
    print("\n📁 LOCAL JSON FILES:")
    print("=" * 50)
    
    local_sources = {
        'play_creativity': 'public/data/essential-growth/play-creativity/activities.json',
        'cognitive_skills': 'public/data/essential-growth/cognitive-skills/activities.json',
        'play_creativity_index': 'public/data/essential-growth/play-creativity/index.json',
        'cognitive_skills_index': 'public/data/essential-growth/cognitive-skills/index.json',
        'essential_growth_index': 'public/data/essential-growth/index.json'
    }
    
    local_data = {}
    for name, path in local_sources.items():
        if os.path.exists(path):
            with open(path, 'r') as f:
                local_data[name] = json.load(f)
            print(f"✅ {name}: {path}")
        else:
            print(f"❌ {name}: {path} (NOT FOUND)")
    
    # Analyze local data structure
    print(f"\n📊 LOCAL DATA ANALYSIS:")
    print("=" * 50)
    
    for name, data in local_data.items():
        if 'activities' in name:
            if 'ageGroups' in data:
                total_activities = sum(
                    len(category.get('activities', []))
                    for age_group in data['ageGroups']
                    for category in age_group.get('categories', [])
                )
                print(f"   {name}: {len(data['ageGroups'])} age groups, {total_activities} activities")
            else:
                print(f"   {name}: {len(data)} items")
        else:
            print(f"   {name}: {len(data)} items")
    
    # Check Google Sheets
    print(f"\n📊 GOOGLE SHEETS DATA:")
    print("=" * 50)
    
    try:
        # Configuration
        CREDS_FILE = 'sheets-credentials.json'
        
        # Use the proper service account
        scope = [
            'https://spreadsheets.google.com/feeds',
            'https://www.googleapis.com/auth/spreadsheets',
            'https://www.googleapis.com/auth/drive',
            'https://www.googleapis.com/auth/drive.file'
        ]
        creds = service_account.Credentials.from_service_account_file(CREDS_FILE, scopes=scope)
        client = gspread.authorize(creds)
        print("✅ Authenticated with Google Sheets")
        
        # Get all sheets
        all_sheets = client.list_spreadsheet_files()
        print(f"📋 Found {len(all_sheets)} sheets")
        
        # Find your files
        target_files = []
        for sheet in all_sheets:
            title = ""
            if 'title' in sheet:
                title = sheet['title'].lower()
            elif 'name' in sheet:
                title = sheet['name'].lower()
            elif 'title' in sheet.get('properties', {}):
                title = sheet['properties']['title'].lower()
            
            if title and ('sample 1' in title or 'sample 2' in title or 'sample one' in title or 'sample two' in title):
                target_files.append(sheet)
                print(f"✅ Found: {title}")
        
        if not target_files:
            print("❌ No Sample One or Sample Two found")
            return False
        
        # Open the first target file
        target_sheet = target_files[0]
        sheet_name = target_sheet.get('name', target_sheet.get('title', 'Unknown'))
        print(f"\n📤 Working with: {sheet_name}")
        
        # Open sheet
        spreadsheet = client.open_by_key(target_sheet['id'])
        
        # Get the main worksheet (first one)
        worksheet = spreadsheet.get_worksheet(0)
        
        # Get all data from Google Sheets
        sheets_data = worksheet.get_all_values()
        if not sheets_data:
            print("❌ No data found in Google Sheets")
            return False
        
        # Convert to DataFrame
        sheets_headers = sheets_data[0]
        sheets_rows = sheets_data[1:]
        sheets_df = pd.DataFrame(sheets_rows, columns=sheets_headers)
        
        print(f"   ✅ Google Sheets: {len(sheets_df)} rows, {len(sheets_df.columns)} columns")
        
        # Analyze Google Sheets data
        play_creativity_count = len(sheets_df[sheets_df['Pillar'] == 'Play & Creativity'])
        cognitive_skills_count = len(sheets_df[sheets_df['Pillar'] == 'Cognitive Skills'])
        
        print(f"   📊 Play & Creativity: {play_creativity_count} activities")
        print(f"   📊 Cognitive Skills: {cognitive_skills_count} activities")
        print(f"   📊 Total: {play_creativity_count + cognitive_skills_count} activities")
        
        # Compare data structures
        print(f"\n🔍 DATA STRUCTURE COMPARISON:")
        print("=" * 50)
        
        # Check if local JSON has the same number of activities
        local_play_creativity_count = 0
        local_cognitive_skills_count = 0
        
        if 'play_creativity' in local_data and 'ageGroups' in local_data['play_creativity']:
            local_play_creativity_count = sum(
                len(category.get('activities', []))
                for age_group in local_data['play_creativity']['ageGroups']
                for category in age_group.get('categories', [])
            )
        
        if 'cognitive_skills' in local_data and 'ageGroups' in local_data['cognitive_skills']:
            local_cognitive_skills_count = sum(
                len(category.get('activities', []))
                for age_group in local_data['cognitive_skills']['ageGroups']
                for category in age_group.get('categories', [])
            )
        
        print(f"   📊 Play & Creativity:")
        print(f"      Local JSON: {local_play_creativity_count} activities")
        print(f"      Google Sheets: {play_creativity_count} activities")
        print(f"      Match: {'✅' if local_play_creativity_count == play_creativity_count else '❌'}")
        
        print(f"   📊 Cognitive Skills:")
        print(f"      Local JSON: {local_cognitive_skills_count} activities")
        print(f"      Google Sheets: {cognitive_skills_count} activities")
        print(f"      Match: {'✅' if local_cognitive_skills_count == cognitive_skills_count else '❌'}")
        
        # Check for differences in content
        print(f"\n🔍 CONTENT DIFFERENCES:")
        print("=" * 50)
        
        # Sample comparison for first few activities
        if 'play_creativity' in local_data and 'ageGroups' in local_data['play_creativity']:
            local_first_activity = None
            for age_group in local_data['play_creativity']['ageGroups']:
                for category in age_group.get('categories', []):
                    if category.get('activities'):
                        local_first_activity = category['activities'][0]
                        break
                if local_first_activity:
                    break
            
            if local_first_activity:
                print(f"   📝 Local JSON First Activity:")
                print(f"      Topic: {local_first_activity.get('topic', 'N/A')}")
                print(f"      Objective: {local_first_activity.get('objective', 'N/A')}")
                print(f"      Steps: {len(local_first_activity.get('activity', {}).get('steps', []))} steps")
                print(f"      Materials: {len(local_first_activity.get('activity', {}).get('materials', []))} materials")
        
        # Get first Play & Creativity activity from Google Sheets
        play_creativity_sheets = sheets_df[sheets_df['Pillar'] == 'Play & Creativity']
        if not play_creativity_sheets.empty:
            first_sheets_activity = play_creativity_sheets.iloc[0]
            print(f"   📝 Google Sheets First Activity:")
            print(f"      Topic: {first_sheets_activity.get('Topic', 'N/A')}")
            print(f"      Objective: {first_sheets_activity.get('Objective', 'N/A')}")
            print(f"      Steps: {len(str(first_sheets_activity.get('Steps', '')).split(';')) if first_sheets_activity.get('Steps') else 0} steps")
            print(f"      Materials: {len(str(first_sheets_activity.get('Materials', '')).split(';')) if first_sheets_activity.get('Materials') else 0} materials")
        
        # Check for enhanced columns in Google Sheets
        print(f"\n🔍 ENHANCED FEATURES IN GOOGLE SHEETS:")
        print("=" * 50)
        
        enhanced_columns = [
            'Difficulty Level', 'Activity Type', 'Setup Time', 'Supervision Level',
            'Materials at Home', 'Materials to Buy for Kit', 'General Instructions',
            'Last Updated', 'Feedback', 'Updated By', 'Last Synced',
            'Corrections Needed', 'Validation Score'
        ]
        
        for col in enhanced_columns:
            if col in sheets_df.columns:
                print(f"   ✅ {col}: Available in Google Sheets")
            else:
                print(f"   ❌ {col}: Not available")
        
        # Summary
        print(f"\n🎯 SUMMARY:")
        print("=" * 50)
        
        total_local = local_play_creativity_count + local_cognitive_skills_count
        total_sheets = play_creativity_count + cognitive_skills_count
        
        print(f"   📊 Total Activities:")
        print(f"      Local JSON: {total_local}")
        print(f"      Google Sheets: {total_sheets}")
        print(f"      Match: {'✅' if total_local == total_sheets else '❌'}")
        
        if total_local == total_sheets:
            print(f"\n   ✅ DATA IS IN SYNC!")
            print(f"      - Same number of activities")
            print(f"      - Local JSON files are current")
            print(f"      - Website will display latest data")
        else:
            print(f"\n   ⚠️ DATA OUT OF SYNC!")
            print(f"      - Different number of activities")
            print(f"      - Local JSON files may be outdated")
            print(f"      - Website may not show latest data")
        
        print(f"\n   🔧 RECOMMENDATIONS:")
        if total_local == total_sheets:
            print(f"      ✅ No action needed - data is synchronized")
        else:
            print(f"      🔄 Update local JSON files from Google Sheets")
            print(f"      🔄 Deploy updated files to website")
            print(f"      🔄 Verify website displays latest data")
        
        print(f"\n🔗 Google Sheets URL: {spreadsheet.url}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error during comparison: {e}")
        return False

if __name__ == '__main__':
    compare_essential_growth_sources()
