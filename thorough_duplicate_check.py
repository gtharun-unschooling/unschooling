#!/usr/bin/env python3
"""
🔍 Thorough Duplicate Check
Find ALL duplicates in the steps column with detailed analysis
"""

import pandas as pd
import os
from google.oauth2 import service_account
import gspread
from datetime import datetime
from collections import Counter
import re

def thorough_duplicate_check():
    """Find ALL duplicates in the steps column with detailed analysis"""
    
    print("🔍 Thorough Duplicate Check - All Steps")
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
        
        # Collect all steps with detailed analysis
        all_steps = []
        steps_by_activity = {}
        step_patterns = {}
        
        for row_num, row in enumerate(all_data[1:], 2):  # Skip header, start from row 2
            if len(row) > steps_col:
                steps_text = row[steps_col]
                topic = row[topic_col] if topic_col < len(row) else ""
                activity_name = row[activity_name_col] if activity_name_col < len(row) else ""
                
                if steps_text:
                    # Clean and normalize the steps for comparison
                    normalized_steps = steps_text.strip().lower()
                    
                    all_steps.append(steps_text)
                    steps_by_activity[row_num-1] = {
                        'topic': topic,
                        'activity_name': activity_name,
                        'steps': steps_text,
                        'normalized': normalized_steps
                    }
                    
                    # Extract step patterns (first few words of each step)
                    steps_list = [step.strip() for step in steps_text.split(';') if step.strip()]
                    pattern = []
                    for step in steps_list[:3]:  # First 3 steps
                        first_words = ' '.join(step.split()[:4])  # First 4 words
                        pattern.append(first_words.lower())
                    pattern_key = ' | '.join(pattern)
                    
                    if pattern_key not in step_patterns:
                        step_patterns[pattern_key] = []
                    step_patterns[pattern_key].append({
                        'activity_num': row_num-1,
                        'topic': topic,
                        'activity_name': activity_name,
                        'full_steps': steps_text
                    })
        
        # Find exact duplicates
        steps_counter = Counter(all_steps)
        exact_duplicates = {steps: count for steps, count in steps_counter.items() if count > 1}
        
        # Find pattern duplicates
        pattern_duplicates = {pattern: activities for pattern, activities in step_patterns.items() if len(activities) > 1}
        
        print(f"\n📊 Detailed Steps Analysis")
        print("=" * 50)
        print(f"   Total activities: {len(all_steps)}")
        print(f"   Unique step sets: {len(steps_counter)}")
        print(f"   Exact duplicates: {len(exact_duplicates)}")
        print(f"   Pattern duplicates: {len(pattern_duplicates)}")
        
        # Show exact duplicates
        if exact_duplicates:
            print(f"\n🚨 EXACT DUPLICATES FOUND:")
            print("=" * 60)
            
            for i, (steps_text, count) in enumerate(exact_duplicates.items(), 1):
                print(f"\n{i}. Exact Duplicate (appears {count} times):")
                print(f"   Steps: {steps_text[:200]}...")
                
                # Find which activities have these exact steps
                activities_with_these_steps = []
                for activity_num, activity_data in steps_by_activity.items():
                    if activity_data['steps'] == steps_text:
                        activities_with_these_steps.append({
                            'activity_num': activity_num,
                            'topic': activity_data['topic'],
                            'activity_name': activity_data['activity_name']
                        })
                
                print(f"   Activities with these exact steps:")
                for activity in activities_with_these_steps:
                    print(f"      - Activity {activity['activity_num']}: {activity['topic']} ({activity['activity_name']})")
                
                # Check if these are generic steps
                generic_indicators = [
                    "explain what you're going to do",
                    "let them help gather",
                    "show them the steps",
                    "ask questions",
                    "encourage independent thinking",
                    "guide them through",
                    "set up the activity",
                    "show them what to do",
                    "stay nearby to help",
                    "praise their efforts",
                    "let them explore",
                    "clean up together"
                ]
                
                is_generic = any(indicator in steps_text.lower() for indicator in generic_indicators)
                if is_generic:
                    print(f"   🚨 GENERIC STEPS DETECTED!")
                else:
                    print(f"   ✅ Appears to be activity-specific")
        
        # Show pattern duplicates
        if pattern_duplicates:
            print(f"\n🔄 PATTERN DUPLICATES FOUND:")
            print("=" * 60)
            
            for i, (pattern, activities) in enumerate(pattern_duplicates.items(), 1):
                print(f"\n{i}. Pattern Duplicate ({len(activities)} activities):")
                print(f"   Pattern: {pattern}")
                print(f"   Activities with similar patterns:")
                for activity in activities[:10]:  # Show first 10
                    print(f"      - Activity {activity['activity_num']}: {activity['topic']} ({activity['activity_name']})")
                if len(activities) > 10:
                    print(f"      ... and {len(activities) - 10} more activities")
                
                # Check if this pattern is generic
                generic_patterns = [
                    "explain what you're going to do",
                    "let them help gather",
                    "show them the steps",
                    "ask questions",
                    "encourage independent thinking",
                    "guide them through"
                ]
                
                is_generic_pattern = any(gp in pattern for gp in generic_patterns)
                if is_generic_pattern:
                    print(f"   🚨 GENERIC PATTERN DETECTED!")
                else:
                    print(f"   ✅ Pattern appears to be activity-specific")
        
        # Summary
        print(f"\n🎯 Comprehensive Duplicate Analysis")
        print("=" * 50)
        
        total_duplicate_instances = sum(exact_duplicates.values()) if exact_duplicates else 0
        total_pattern_instances = sum(len(activities) for activities in pattern_duplicates.values()) if pattern_duplicates else 0
        
        print(f"   Exact duplicate instances: {total_duplicate_instances}")
        print(f"   Pattern duplicate instances: {total_pattern_instances}")
        print(f"   Total duplicate instances: {total_duplicate_instances + total_pattern_instances}")
        
        if exact_duplicates or pattern_duplicates:
            print(f"\n⚠️ RECOMMENDATION:")
            print("   These duplicates need to be made unique for each activity.")
            print("   Each activity should have steps specific to its requirements.")
        else:
            print(f"\n✅ No duplicates found!")
            print("   All activities have unique steps.")
        
        print(f"\n🔗 Google Sheets URL: {spreadsheet.url}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error during check: {e}")
        return False

if __name__ == '__main__':
    thorough_duplicate_check()
