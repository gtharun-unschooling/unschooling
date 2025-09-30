#!/usr/bin/env python3
"""
🧹 Remove Cleanup Steps
Remove generic "clean up" steps from all activities
"""

import pandas as pd
import os
from google.oauth2 import service_account
import gspread
from datetime import datetime
import time

def remove_cleanup_steps():
    """Remove generic cleanup steps from all activities"""
    
    print("🧹 Removing Generic Cleanup Steps")
    print("=" * 50)
    
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
        
        # Find the Steps column
        steps_col_index = None
        for i, header in enumerate(headers):
            if header == "Steps":
                steps_col_index = i
                break
        
        if steps_col_index is None:
            print("❌ Steps column not found")
            return False
        
        print(f"📝 Found Steps column at index {steps_col_index}")
        
        # Process all activities (starting from row 2, since row 1 is headers)
        print(f"\n🧹 Removing cleanup steps from all activities...")
        
        activities_updated = 0
        
        for row_num in range(2, len(all_data) + 1):  # Start from row 2
            if row_num <= len(all_data):
                # Get current steps
                current_steps = all_data[row_num - 1][steps_col_index] if steps_col_index < len(all_data[row_num - 1]) else ""
                
                if current_steps:
                    # Split steps by semicolon
                    steps_list = [step.strip() for step in current_steps.split(';') if step.strip()]
                    
                    # Remove generic cleanup steps
                    cleanup_phrases = [
                        "clean up when done",
                        "clean up when finished",
                        "clean up area",
                        "clean up thoroughly",
                        "clean up scraps",
                        "put away when done",
                        "end when baby shows signs of being done"
                    ]
                    
                    # Filter out cleanup steps
                    filtered_steps = []
                    for step in steps_list:
                        is_cleanup = False
                        for phrase in cleanup_phrases:
                            if phrase.lower() in step.lower():
                                is_cleanup = True
                                break
                        if not is_cleanup:
                            filtered_steps.append(step)
                    
                    # Join back with semicolon
                    new_steps = '; '.join(filtered_steps)
                    
                    # Only update if there's a change
                    if new_steps != current_steps:
                        # Update the cell
                        cell = worksheet.cell(row_num, steps_col_index + 1)
                        cell.value = new_steps
                        worksheet.update_cells([cell])
                        
                        print(f"   ✅ Activity {row_num - 1}: Removed cleanup steps")
                        activities_updated += 1
                        
                        # Wait to avoid rate limits
                        time.sleep(2)
        
        # Summary
        print(f"\n🎉 Cleanup Steps Removal Complete!")
        print("=" * 50)
        print(f"   Activities Updated: {activities_updated}")
        print(f"   Generic cleanup phrases removed from Steps column")
        
        print(f"\n📝 Cleanup Phrases Removed:")
        print("=" * 30)
        print("   - 'clean up when done'")
        print("   - 'clean up when finished'")
        print("   - 'clean up area'")
        print("   - 'clean up thoroughly'")
        print("   - 'clean up scraps'")
        print("   - 'put away when done'")
        print("   - 'end when baby shows signs of being done'")
        
        print(f"\n🔗 Google Sheets URL: {spreadsheet.url}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error during cleanup removal: {e}")
        return False

if __name__ == '__main__':
    result = remove_cleanup_steps()
    if result:
        print(f"\n✅ SUCCESS! Generic cleanup steps removed from all activities!")
    else:
        print(f"\n❌ FAILED to remove cleanup steps")
