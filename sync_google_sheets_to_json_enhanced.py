#!/usr/bin/env python3
"""
🔄 Enhanced Google Sheets to JSON Sync
Sync with better formatting for website display
"""

import pandas as pd
import json
import os
from google.oauth2 import service_account
import gspread
from datetime import datetime
import time

def sync_google_sheets_to_json_enhanced():
    """Sync Google Sheets data to local JSON files with enhanced formatting"""
    
    print("🔄 Enhanced Google Sheets to JSON Sync")
    print("=" * 60)
    
    # Configuration
    CREDS_FILE = 'sheets-credentials.json'
    
    try:
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
        print(f"\n📖 Loading Google Sheets data...")
        sheets_data = worksheet.get_all_values()
        if not sheets_data:
            print("❌ No data found in Google Sheets")
            return False
        
        # Convert to DataFrame
        sheets_headers = sheets_data[0]
        sheets_rows = sheets_data[1:]
        sheets_df = pd.DataFrame(sheets_rows, columns=sheets_headers)
        
        print(f"   ✅ Loaded {len(sheets_df)} rows from Google Sheets")
        
        # Create output directory if it doesn't exist
        output_dir = 'public/data/essential-growth'
        os.makedirs(f'{output_dir}/play-creativity', exist_ok=True)
        os.makedirs(f'{output_dir}/cognitive-skills', exist_ok=True)
        
        # Process Play & Creativity data
        print(f"\n🎨 Processing Play & Creativity data...")
        play_creativity_data = sheets_df[sheets_df['Pillar'] == 'Play & Creativity']
        
        if not play_creativity_data.empty:
            # Convert to the expected JSON structure with enhanced formatting
            play_creativity_json = convert_to_activities_json_enhanced(play_creativity_data, 'Play & Creativity')
            
            # Save to JSON file
            play_creativity_path = f'{output_dir}/play-creativity/activities.json'
            with open(play_creativity_path, 'w', encoding='utf-8') as f:
                json.dump(play_creativity_json, f, indent=2, ensure_ascii=False)
            
            print(f"   ✅ Saved {len(play_creativity_data)} Play & Creativity activities to {play_creativity_path}")
            
            # Create index file for Play & Creativity
            play_creativity_index = create_index_json(play_creativity_data, 'Play & Creativity', 'play-creativity')
            play_creativity_index_path = f'{output_dir}/play-creativity/index.json'
            with open(play_creativity_index_path, 'w', encoding='utf-8') as f:
                json.dump(play_creativity_index, f, indent=2, ensure_ascii=False)
            
            print(f"   ✅ Created Play & Creativity index file")
        
        # Process Cognitive Skills data
        print(f"\n🧠 Processing Cognitive Skills data...")
        cognitive_skills_data = sheets_df[sheets_df['Pillar'] == 'Cognitive Skills']
        
        if not cognitive_skills_data.empty:
            # Convert to the expected JSON structure with enhanced formatting
            cognitive_skills_json = convert_to_activities_json_enhanced(cognitive_skills_data, 'Cognitive Skills')
            
            # Save to JSON file
            cognitive_skills_path = f'{output_dir}/cognitive-skills/activities.json'
            with open(cognitive_skills_path, 'w', encoding='utf-8') as f:
                json.dump(cognitive_skills_json, f, indent=2, ensure_ascii=False)
            
            print(f"   ✅ Saved {len(cognitive_skills_data)} Cognitive Skills activities to {cognitive_skills_path}")
            
            # Create index file for Cognitive Skills
            cognitive_skills_index = create_index_json(cognitive_skills_data, 'Cognitive Skills', 'cognitive-skills')
            cognitive_skills_index_path = f'{output_dir}/cognitive-skills/index.json'
            with open(cognitive_skills_index_path, 'w', encoding='utf-8') as f:
                json.dump(cognitive_skills_index, f, indent=2, ensure_ascii=False)
            
            print(f"   ✅ Created Cognitive Skills index file")
        
        # Create main Essential Growth index
        print(f"\n📋 Creating Essential Growth index...")
        essential_growth_index = create_essential_growth_index(sheets_df)
        essential_growth_index_path = f'{output_dir}/index.json'
        with open(essential_growth_index_path, 'w', encoding='utf-8') as f:
            json.dump(essential_growth_index, f, indent=2, ensure_ascii=False)
        
        print(f"   ✅ Created Essential Growth index file")
        
        # Summary
        print(f"\n🎉 ENHANCED SYNC COMPLETED!")
        print("=" * 50)
        print(f"   ✅ Play & Creativity: {len(play_creativity_data)} activities")
        print(f"   ✅ Cognitive Skills: {len(cognitive_skills_data)} activities")
        print(f"   ✅ Total: {len(sheets_df)} activities")
        print(f"   ✅ Enhanced formatting applied")
        print(f"   ✅ Numbered steps with color coding")
        print(f"   ✅ Skills as proper lists")
        print(f"   ✅ Hashtags as proper lists")
        
        print(f"\n📁 Updated Files:")
        print(f"   - {output_dir}/play-creativity/activities.json")
        print(f"   - {output_dir}/play-creativity/index.json")
        print(f"   - {output_dir}/cognitive-skills/activities.json")
        print(f"   - {output_dir}/cognitive-skills/index.json")
        print(f"   - {output_dir}/index.json")
        
        print(f"\n🎯 ENHANCEMENTS APPLIED:")
        print(f"   ✅ Steps: Numbered (1, 2, 3) with color coding")
        print(f"   ✅ Skills: Converted to proper list format")
        print(f"   ✅ Hashtags: Converted to proper list format")
        print(f"   ✅ Better website display formatting")
        
        print(f"\n🔗 Google Sheets URL: {spreadsheet.url}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error during sync: {e}")
        return False

def convert_to_activities_json_enhanced(df, pillar):
    """Convert DataFrame to the expected activities JSON structure with enhanced formatting"""
    
    # Group by age group and category
    age_groups = []
    
    for age_group in df['Age Group'].unique():
        age_group_data = df[df['Age Group'] == age_group]
        
        categories = []
        for category in age_group_data['Category'].unique():
            category_data = age_group_data[age_group_data['Category'] == category]
            
            activities = []
            for _, row in category_data.iterrows():
                # Enhanced formatting for steps
                steps_raw = row.get('Steps', '')
                if steps_raw:
                    # Split by semicolon and number each step
                    steps_list = [step.strip() for step in steps_raw.split(';') if step.strip()]
                    # Remove any existing numbering and add clean numbering
                    clean_steps = []
                    for step in steps_list:
                        # Remove any existing numbering (like "1. " at the beginning)
                        clean_step = step.strip()
                        if clean_step and clean_step[0].isdigit() and '. ' in clean_step:
                            clean_step = clean_step.split('. ', 1)[1]
                        clean_steps.append(clean_step)
                    numbered_steps = [f"{i+1}. {step}" for i, step in enumerate(clean_steps)]
                else:
                    numbered_steps = []
                
                # Enhanced formatting for skills
                skills_raw = row.get('Skills', '')
                if skills_raw:
                    skills_list = [skill.strip() for skill in skills_raw.split(';') if skill.strip()]
                else:
                    skills_list = []
                
                # Enhanced formatting for hashtags
                hashtags_raw = row.get('Hashtags', '')
                if hashtags_raw:
                    hashtags_list = [tag.strip() for tag in hashtags_raw.split(';') if tag.strip()]
                else:
                    hashtags_list = []
                
                activity = {
                    "topicNumber": int(row.get('Topic Number', 1)),
                    "topic": row.get('Topic', ''),
                    "objective": row.get('Objective', ''),
                    "explanation": row.get('Explanation', ''),
                    "hashtags": hashtags_list,  # Now proper list instead of comma-separated
                    "estimatedTime": row.get('Estimated Time', ''),
                    "age": row.get('Age', ''),
                    "activity": {
                        "name": row.get('Activity Name', ''),
                        "materials": row.get('Materials', '').split(';') if row.get('Materials') else [],
                        "steps": numbered_steps,  # Now numbered steps
                        "skills": skills_list  # Now proper list instead of comma-separated
                    }
                }
                activities.append(activity)
            
            category_info = {
                "category": category,
                "description": row.get('Category Description', ''),
                "activities": activities
            }
            categories.append(category_info)
        
        age_group_info = {
            "ageGroup": age_group,
            "categories": categories
        }
        age_groups.append(age_group_info)
    
    return {"ageGroups": age_groups}

def create_index_json(df, pillar, slug):
    """Create index JSON for a pillar"""
    
    total_activities = len(df)
    age_groups = df['Age Group'].unique().tolist()
    categories = df['Category'].unique().tolist()
    
    return {
        "pillar": pillar,
        "slug": slug,
        "color": "#dbeafe" if pillar == "Play & Creativity" else "#fef3c7",
        "icon": "palette" if pillar == "Play & Creativity" else "psychology",
        "description": f"Develop {pillar.lower()} through engaging activities and hands-on learning.",
        "ageGroups": age_groups,
        "categories": [{"name": cat, "description": f"{cat} activities for {pillar.lower()}"} for cat in categories],
        "totalActivities": total_activities,
        "totalCategories": len(categories),
        "lastUpdated": datetime.now().strftime("%Y-%m-%d"),
        "status": "complete-with-activities"
    }

def create_essential_growth_index(df):
    """Create main Essential Growth index"""
    
    pillars = df['Pillar'].unique().tolist()
    total_activities = len(df)
    
    return {
        "framework": "Essential Growth",
        "description": "Comprehensive development framework for children's essential growth areas",
        "pillars": pillars,
        "totalActivities": total_activities,
        "lastUpdated": datetime.now().strftime("%Y-%m-%d"),
        "status": "active"
    }

if __name__ == '__main__':
    result = sync_google_sheets_to_json_enhanced()
    if result:
        print(f"\n✅ SUCCESS! Enhanced sync completed!")
    else:
        print(f"\n❌ FAILED to sync with enhancements")
