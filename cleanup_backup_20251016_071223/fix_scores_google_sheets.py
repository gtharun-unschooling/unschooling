#!/usr/bin/env python3
"""
📊 Fix Scores Google Sheets
Fix cell reference format and add validation scores to Google Sheets
"""

import pandas as pd
import os
from google.oauth2 import service_account
import gspread
from datetime import datetime

def fix_scores_google_sheets():
    """Fix cell reference format and add validation scores to Google Sheets"""
    
    print("📊 Fixing Scores in Google Sheets")
    print("=" * 60)
    
    # Configuration
    CREDS_FILE = 'sheets-credentials.json'
    
    # Pre-calculated scores from the validation
    activity_scores = [
        {"index": 1, "topic": "Texture Tray Adventure - UPDATED", "score": 42.1, "grade": "C"},
        {"index": 2, "topic": "Gel Bag Squish Play", "score": 42.1, "grade": "C"},
        {"index": 3, "topic": "Water Play Bowl", "score": 42.1, "grade": "C"},
        {"index": 4, "topic": "Textured Cloth Crawl", "score": 42.4, "grade": "C"},
        {"index": 5, "topic": "Nature Touch Basket", "score": 42.1, "grade": "C"}
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
        
        # Add scores column to Google Sheets
        print(f"\n📝 Adding scores column to Google Sheets...")
        
        # Check if scores column already exists
        if 'Validation Score' not in headers:
            # Add new column header
            new_headers = headers + ['Validation Score']
            worksheet.update('A1', [new_headers])
            print("✅ Added 'Validation Score' column header")
        else:
            print("✅ 'Validation Score' column already exists")
        
        # Add scores for each activity using row-based updates
        for activity in activity_scores:
            row_num = activity['index'] + 1  # +1 because row 1 is headers
            score_text = f"{activity['score']:.1f}/100 ({activity['grade']})"
            
            # Calculate column position
            score_col_index = len(headers)  # 0-based index
            score_col_letter = chr(65 + score_col_index)  # Convert to letter
            
            # Use row-based update instead of cell-based
            row_range = f"{score_col_letter}{row_num}:{score_col_letter}{row_num}"
            worksheet.update(row_range, [[score_text]])
            print(f"✅ Added score for Activity {activity['index']}: {score_text}")
        
        # Format the scores column
        score_col_letter = chr(65 + len(headers))
        worksheet.format(f"{score_col_letter}1", {
            'backgroundColor': {'red': 0.26, 'green': 0.52, 'blue': 0.96},
            'textFormat': {'foregroundColor': {'red': 1, 'green': 1, 'blue': 1}, 'bold': True}
        })
        
        # Color code the score cells
        for activity in activity_scores:
            row_num = activity['index'] + 1
            score_cell = f"{score_col_letter}{row_num}"
            
            # Color based on score
            if activity['score'] >= 90:
                # Green for excellent
                worksheet.format(score_cell, {
                    'backgroundColor': {'red': 0.8, 'green': 1.0, 'blue': 0.8}
                })
            elif activity['score'] >= 70:
                # Yellow for good
                worksheet.format(score_cell, {
                    'backgroundColor': {'red': 1.0, 'green': 1.0, 'blue': 0.8}
                })
            else:
                # Red for needs improvement
                worksheet.format(score_cell, {
                    'backgroundColor': {'red': 1.0, 'green': 0.8, 'blue': 0.8}
                })
        
        print("✅ Formatted scores column")
        
        # Summary
        print(f"\n📊 Validation Summary:")
        print("=" * 50)
        print(f"   Activities analyzed: {len(activity_scores)}")
        print(f"   Average score: {sum(a['score'] for a in activity_scores) / len(activity_scores):.1f}/100")
        print(f"   Highest score: {max(a['score'] for a in activity_scores):.1f}/100")
        print(f"   Lowest score: {min(a['score'] for a in activity_scores):.1f}/100")
        
        # Detailed results
        print(f"\n🎯 Detailed Results:")
        print("=" * 50)
        for activity in activity_scores:
            print(f"\n📝 Activity {activity['index']}: {activity['topic']}")
            print(f"   Score: {activity['score']:.1f}/100 ({activity['grade']})")
            print(f"   Status: Needs improvement")
        
        print(f"\n🎉 Scores Added Successfully!")
        print(f"🔗 URL: {spreadsheet.url}")
        print(f"📋 Validation scores added to Google Sheets")
        
        return True
        
    except Exception as e:
        print(f"❌ Error during score addition: {e}")
        return False

if __name__ == '__main__':
    success = fix_scores_google_sheets()
    
    if success:
        print(f"\n✅ SUCCESS! Validation scores added to Google Sheets!")
        print("📊 All 5 activities scored and color-coded")
    else:
        print(f"\n❌ FAILED to add scores to Google Sheets")
