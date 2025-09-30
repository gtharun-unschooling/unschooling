#!/usr/bin/env python3
"""
🔍 Comprehensive Column Analysis
Check ALL columns for duplicates, generic content, and activity-specific quality
"""

import pandas as pd
import os
from google.oauth2 import service_account
import gspread
from datetime import datetime
from collections import Counter
import re

def comprehensive_column_analysis():
    """Check ALL columns for duplicates, generic content, and activity-specific quality"""
    
    print("🔍 Comprehensive Column Analysis - ALL Columns")
    print("=" * 80)
    
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
        
        # Find all important columns
        column_indices = {}
        for i, header in enumerate(headers):
            column_indices[header] = i
        
        print(f"\n📝 Column Analysis:")
        print("=" * 50)
        for i, header in enumerate(headers):
            print(f"   {i+1}. {header}")
        
        # Analyze each important column for duplicates and generic content
        important_columns = [
            'Activity Name', 'Objective', 'Explanation', 'Materials', 
            'Steps', 'Skills', 'Hashtags', 'Materials at Home', 
            'Materials to Buy for Kit', 'General Instructions'
        ]
        
        analysis_results = {}
        
        for column_name in important_columns:
            if column_name in column_indices:
                col_idx = column_indices[column_name]
                print(f"\n🔍 Analyzing Column: {column_name}")
                print("=" * 60)
                
                # Collect all values for this column
                column_values = []
                for row_num, row in enumerate(all_data[1:], 2):  # Skip header
                    if len(row) > col_idx:
                        value = row[col_idx].strip()
                        if value:
                            column_values.append(value)
                
                # Find duplicates
                value_counter = Counter(column_values)
                duplicates = {value: count for value, count in value_counter.items() if count > 1}
                
                print(f"   Total values: {len(column_values)}")
                print(f"   Unique values: {len(value_counter)}")
                print(f"   Duplicate values: {len(duplicates)}")
                
                if duplicates:
                    print(f"\n   🚨 DUPLICATES FOUND in {column_name}:")
                    for i, (value, count) in enumerate(duplicates.items(), 1):
                        print(f"      {i}. '{value[:100]}...' (appears {count} times)")
                        
                        # Find which activities have this duplicate value
                        activities_with_value = []
                        for row_num, row in enumerate(all_data[1:], 2):
                            if len(row) > col_idx and row[col_idx].strip() == value:
                                topic = row[column_indices.get('Topic', 0)] if column_indices.get('Topic', 0) < len(row) else ""
                                activity_name = row[column_indices.get('Activity Name', 0)] if column_indices.get('Activity Name', 0) < len(row) else ""
                                activities_with_value.append({
                                    'row': row_num,
                                    'topic': topic,
                                    'activity_name': activity_name
                                })
                        
                        print(f"         Activities with this value:")
                        for activity in activities_with_value[:5]:  # Show first 5
                            print(f"            - Activity {activity['row']-1}: {activity['topic']} ({activity['activity_name']})")
                        if len(activities_with_value) > 5:
                            print(f"            ... and {len(activities_with_value) - 5} more activities")
                        
                        # Check if this is generic content
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
                            "clean up together",
                            "use materials from our activity kit",
                            "follow our step-by-step guide",
                            "track progress on our tracking sheet",
                            "return materials when activity is complete",
                            "activity kit (supplied by us)",
                            "step-by-step guide (supplied by us)",
                            "progress tracking sheet (supplied by us)"
                        ]
                        
                        is_generic = any(indicator in value.lower() for indicator in generic_indicators)
                        if is_generic:
                            print(f"         🚨 GENERIC CONTENT DETECTED!")
                        else:
                            print(f"         ✅ Appears to be activity-specific")
                else:
                    print(f"   ✅ No duplicates found in {column_name}")
                
                # Check for generic patterns
                generic_patterns = [
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
                
                generic_count = 0
                for value in column_values:
                    if any(pattern in value.lower() for pattern in generic_patterns):
                        generic_count += 1
                
                if generic_count > 0:
                    print(f"   ⚠️ Generic content found: {generic_count} instances")
                else:
                    print(f"   ✅ No generic content found")
                
                analysis_results[column_name] = {
                    'total_values': len(column_values),
                    'unique_values': len(value_counter),
                    'duplicates': len(duplicates),
                    'generic_count': generic_count
                }
        
        # Summary
        print(f"\n🎯 Comprehensive Analysis Summary")
        print("=" * 60)
        
        total_duplicates = 0
        total_generic = 0
        
        for column_name, results in analysis_results.items():
            print(f"\n📊 {column_name}:")
            print(f"   Total values: {results['total_values']}")
            print(f"   Unique values: {results['unique_values']}")
            print(f"   Duplicates: {results['duplicates']}")
            print(f"   Generic content: {results['generic_count']}")
            
            total_duplicates += results['duplicates']
            total_generic += results['generic_count']
        
        print(f"\n🎯 Overall Summary:")
        print(f"   Total duplicate instances: {total_duplicates}")
        print(f"   Total generic content instances: {total_generic}")
        
        if total_duplicates > 0 or total_generic > 0:
            print(f"\n⚠️ RECOMMENDATIONS:")
            print("   1. Fix all duplicate values to be activity-specific")
            print("   2. Replace generic content with specific instructions")
            print("   3. Ensure each activity is unique and tailored")
            print("   4. Make all content parent-friendly and actionable")
        else:
            print(f"\n✅ All columns are perfect!")
            print("   - No duplicates found")
            print("   - No generic content found")
            print("   - All activities are unique and specific")
        
        print(f"\n🔗 Google Sheets URL: {spreadsheet.url}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error during analysis: {e}")
        return False

if __name__ == '__main__':
    comprehensive_column_analysis()
