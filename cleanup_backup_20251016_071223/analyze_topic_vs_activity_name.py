#!/usr/bin/env python3
"""
🔍 Analyze Topic vs Activity Name
Analyze the difference between Topic and Activity Name columns
"""

import pandas as pd
import os
from google.oauth2 import service_account
import gspread
from datetime import datetime

def analyze_topic_vs_activity_name():
    """Analyze the difference between Topic and Activity Name columns"""
    
    print("🔍 Analyzing Topic vs Activity Name")
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
        
        # Find Topic and Activity Name columns
        topic_col_index = None
        activity_name_col_index = None
        
        for i, header in enumerate(headers):
            if header == "Topic":
                topic_col_index = i
            elif header == "Activity Name":
                activity_name_col_index = i
        
        if topic_col_index is None or activity_name_col_index is None:
            print("❌ Topic or Activity Name column not found")
            return False
        
        print(f"📝 Found Topic column at index {topic_col_index}")
        print(f"📝 Found Activity Name column at index {activity_name_col_index}")
        
        # Analyze first 20 activities
        print(f"\n🔍 Analyzing Topic vs Activity Name (First 20 Activities):")
        print("=" * 80)
        
        identical_count = 0
        different_count = 0
        examples = []
        
        for row_num in range(2, min(22, len(all_data) + 1)):  # First 20 activities
            if row_num <= len(all_data):
                topic = all_data[row_num - 1][topic_col_index] if topic_col_index < len(all_data[row_num - 1]) else ""
                activity_name = all_data[row_num - 1][activity_name_col_index] if activity_name_col_index < len(all_data[row_num - 1]) else ""
                
                if topic and activity_name:
                    is_identical = topic.strip() == activity_name.strip()
                    
                    if is_identical:
                        identical_count += 1
                    else:
                        different_count += 1
                        examples.append({
                            'activity': row_num - 1,
                            'topic': topic,
                            'activity_name': activity_name
                        })
                    
                    print(f"   Activity {row_num - 1}:")
                    print(f"      Topic: '{topic}'")
                    print(f"      Activity Name: '{activity_name}'")
                    print(f"      Identical: {'✅ Yes' if is_identical else '❌ No'}")
                    print()
        
        # Summary analysis
        print(f"\n📊 Analysis Summary:")
        print("=" * 40)
        print(f"   Total Activities Analyzed: 20")
        print(f"   Identical Topic/Activity Name: {identical_count}")
        print(f"   Different Topic/Activity Name: {different_count}")
        print(f"   Identical Percentage: {(identical_count/20)*100:.1f}%")
        
        if examples:
            print(f"\n🔍 Examples of Different Topic vs Activity Name:")
            print("=" * 50)
            for example in examples[:5]:  # Show first 5 examples
                print(f"   Activity {example['activity']}:")
                print(f"      Topic: '{example['topic']}'")
                print(f"      Activity Name: '{example['activity_name']}'")
                print()
        
        # Recommendations
        print(f"\n💡 Recommendations:")
        print("=" * 30)
        
        if identical_count > different_count:
            print("   🔴 REDUNDANCY DETECTED:")
            print("   - Most activities have identical Topic and Activity Name")
            print("   - This creates unnecessary duplication")
            print("   - Consider removing one column or making them serve different purposes")
        else:
            print("   🟢 GOOD SEPARATION:")
            print("   - Topic and Activity Name serve different purposes")
            print("   - Keep both columns for clarity")
        
        print(f"\n📝 Suggested Column Purposes:")
        print("=" * 35)
        print("   Topic: Should be the general category/theme (e.g., 'Texture Exploration')")
        print("   Activity Name: Should be the specific activity title (e.g., 'Baby's First Texture Discovery')")
        print("   - Topic = What type of activity")
        print("   - Activity Name = What to call this specific activity")
        
        print(f"\n🔗 Google Sheets URL: {spreadsheet.url}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error during analysis: {e}")
        return False

if __name__ == '__main__':
    analyze_topic_vs_activity_name()
