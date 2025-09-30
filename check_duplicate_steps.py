#!/usr/bin/env python3
"""
🔍 Check Duplicate Steps
Find all duplicate values in the steps column and identify generic steps
"""

import pandas as pd
import os
from google.oauth2 import service_account
import gspread
from datetime import datetime
from collections import Counter

def check_duplicate_steps():
    """Find all duplicate values in the steps column and identify generic steps"""
    
    print("🔍 Checking for Duplicate Steps in All Activities")
    print("=" * 70)
    
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
        
        # Collect all steps and find duplicates
        all_steps = []
        steps_by_activity = {}
        
        for row_num, row in enumerate(all_data[1:], 2):  # Skip header, start from row 2
            if len(row) > steps_col:
                steps_text = row[steps_col]
                topic = row[topic_col] if topic_col < len(row) else ""
                activity_name = row[activity_name_col] if activity_name_col < len(row) else ""
                
                if steps_text:
                    all_steps.append(steps_text)
                    steps_by_activity[row_num-1] = {
                        'topic': topic,
                        'activity_name': activity_name,
                        'steps': steps_text
                    }
        
        # Find duplicate steps
        steps_counter = Counter(all_steps)
        duplicate_steps = {steps: count for steps, count in steps_counter.items() if count > 1}
        
        print(f"\n📊 Steps Analysis")
        print("=" * 40)
        print(f"   Total activities: {len(all_steps)}")
        print(f"   Unique step sets: {len(steps_counter)}")
        print(f"   Duplicate step sets: {len(duplicate_steps)}")
        
        if duplicate_steps:
            print(f"\n⚠️ Found {len(duplicate_steps)} sets of duplicate steps:")
            print("=" * 60)
            
            for i, (steps_text, count) in enumerate(duplicate_steps.items(), 1):
                print(f"\n{i}. Duplicate Steps (appears {count} times):")
                print(f"   Steps: {steps_text[:150]}...")
                
                # Find which activities have these steps
                activities_with_these_steps = []
                for activity_num, activity_data in steps_by_activity.items():
                    if activity_data['steps'] == steps_text:
                        activities_with_these_steps.append({
                            'activity_num': activity_num,
                            'topic': activity_data['topic'],
                            'activity_name': activity_data['activity_name']
                        })
                
                print(f"   Activities with these steps:")
                for activity in activities_with_these_steps:
                    print(f"      - Activity {activity['activity_num']}: {activity['topic']} ({activity['activity_name']})")
                
                # Check if these are generic steps
                generic_indicators = [
                    "set up the activity",
                    "show them what to do",
                    "stay nearby to help",
                    "praise their efforts",
                    "let them explore",
                    "clean up together",
                    "use materials from our activity kit",
                    "follow our step-by-step guide",
                    "track progress on our tracking sheet",
                    "return materials when activity is complete"
                ]
                
                is_generic = any(indicator in steps_text.lower() for indicator in generic_indicators)
                if is_generic:
                    print(f"   🚨 GENERIC STEPS DETECTED!")
                else:
                    print(f"   ✅ Appears to be activity-specific")
        else:
            print(f"\n✅ No duplicate steps found!")
            print("   All activities have unique, customized steps.")
        
        # Summary
        print(f"\n🎯 Duplicate Steps Summary")
        print("=" * 40)
        if duplicate_steps:
            total_duplicates = sum(duplicate_steps.values())
            print(f"   Total duplicate instances: {total_duplicates}")
            print(f"   Unique duplicate sets: {len(duplicate_steps)}")
            
            # Count generic vs specific duplicates
            generic_duplicates = 0
            specific_duplicates = 0
            
            for steps_text in duplicate_steps.keys():
                generic_indicators = [
                    "set up the activity",
                    "show them what to do",
                    "stay nearby to help",
                    "praise their efforts",
                    "let them explore",
                    "clean up together"
                ]
                is_generic = any(indicator in steps_text.lower() for indicator in generic_indicators)
                if is_generic:
                    generic_duplicates += duplicate_steps[steps_text]
                else:
                    specific_duplicates += duplicate_steps[steps_text]
            
            print(f"   Generic duplicates: {generic_duplicates}")
            print(f"   Specific duplicates: {specific_duplicates}")
        else:
            print(f"   ✅ All activities have unique steps")
        
        print(f"\n🔗 Google Sheets URL: {spreadsheet.url}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error during check: {e}")
        return False

if __name__ == '__main__':
    check_duplicate_steps()
