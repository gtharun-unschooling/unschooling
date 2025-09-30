#!/usr/bin/env python3
"""
🔍 Check Generic Steps
Check if activities still have generic steps that need to be customized
"""

import pandas as pd
import os
from google.oauth2 import service_account
import gspread
from datetime import datetime

def check_generic_steps():
    """Check if activities still have generic steps that need to be customized"""
    
    print("🔍 Checking for Generic Steps in Activities")
    print("=" * 60)
    
    # Configuration
    CREDS_FILE = 'sheets-credentials.json'
    
    # Generic steps to look for
    generic_steps = [
        "Set up the activity in a safe space",
        "Show them what to do, then let them try",
        "Stay nearby to help if needed",
        "Praise their efforts and creativity",
        "Let them explore and experiment",
        "Clean up together when finished"
    ]
    
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
        print("✅ Authenticated with Sheets Uploader service account")
        
        # Get all sheets
        all_sheets = client.list_spreadsheet_files()
        print(f"📋 Found {len(all_sheets)} sheets")
        
        # Find your files
        target_files = []
        for sheet in all_sheets:
            print(f"Available sheet: {sheet}")
            # Try different ways to get the title
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
        
        # Get all data
        all_data = worksheet.get_all_values()
        if not all_data:
            print("❌ No data found in the worksheet")
            return False
        
        # Get headers
        headers = all_data[0]
        print(f"📋 Found {len(headers)} columns in Google Sheets")
        
        # Find Steps column
        steps_col = None
        topic_col = None
        activity_name_col = None
        
        for i, header in enumerate(headers):
            if header == "Steps":
                steps_col = i
            elif header == "Topic":
                topic_col = i
            elif header == "Activity Name":
                activity_name_col = i
        
        if steps_col is None:
            print("❌ Steps column not found")
            return False
        
        print(f"📝 Found Steps column at index {steps_col}")
        
        # Check for generic steps
        activities_with_generic_steps = []
        
        for row_num, row in enumerate(all_data[1:], 2):  # Skip header, start from row 2
            if len(row) > steps_col:
                steps_text = row[steps_col]
                topic = row[topic_col] if topic_col < len(row) else ""
                activity_name = row[activity_name_col] if activity_name_col < len(row) else ""
                
                if steps_text:
                    # Check if any generic steps are present
                    generic_found = []
                    for generic_step in generic_steps:
                        if generic_step.lower() in steps_text.lower():
                            generic_found.append(generic_step)
                    
                    if generic_found:
                        activities_with_generic_steps.append({
                            'row': row_num,
                            'topic': topic,
                            'activity_name': activity_name,
                            'generic_steps': generic_found,
                            'steps_text': steps_text
                        })
        
        # Summary
        print(f"\n🎯 Generic Steps Analysis")
        print("=" * 40)
        print(f"   Total activities checked: {len(all_data) - 1}")
        print(f"   Activities with generic steps: {len(activities_with_generic_steps)}")
        
        if activities_with_generic_steps:
            print(f"\n⚠️ Activities with Generic Steps:")
            print("=" * 50)
            
            for i, activity in enumerate(activities_with_generic_steps[:10]):  # Show first 10
                print(f"\n{i+1}. Activity {activity['row']-1}: {activity['topic']}")
                print(f"   Activity Name: {activity['activity_name']}")
                print(f"   Generic steps found: {len(activity['generic_steps'])}")
                for step in activity['generic_steps']:
                    print(f"      - {step}")
                print(f"   Steps text: {activity['steps_text'][:100]}...")
            
            if len(activities_with_generic_steps) > 10:
                print(f"\n   ... and {len(activities_with_generic_steps) - 10} more activities")
            
            print(f"\n🔧 Recommendation:")
            print("   These activities need customized steps specific to each activity.")
            print("   Generic steps should be replaced with activity-specific instructions.")
        else:
            print(f"\n✅ No generic steps found!")
            print("   All activities have customized steps.")
        
        print(f"\n🔗 Google Sheets URL: {spreadsheet.url}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error during check: {e}")
        return False

if __name__ == '__main__':
    check_generic_steps()
