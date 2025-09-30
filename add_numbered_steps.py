#!/usr/bin/env python3
"""
🔢 Add Numbered Steps
Add numbered steps (1, 2, 3) to all activities
"""

import pandas as pd
import os
from google.oauth2 import service_account
import gspread
from datetime import datetime
import time

def add_numbered_steps():
    """Add numbered steps (1, 2, 3) to all activities"""
    
    print("🔢 Adding Numbered Steps to All Activities")
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
        print(f"\n🔢 Adding numbered steps to all activities...")
        
        activities_updated = 0
        
        for row_num in range(2, len(all_data) + 1):  # Start from row 2
            if row_num <= len(all_data):
                # Get current steps
                current_steps = all_data[row_num - 1][steps_col_index] if steps_col_index < len(all_data[row_num - 1]) else ""
                
                if current_steps:
                    # Split steps by semicolon
                    steps_list = [step.strip() for step in current_steps.split(';') if step.strip()]
                    
                    # Check if steps are already numbered
                    first_step = steps_list[0] if steps_list else ""
                    if first_step and first_step[0].isdigit():
                        print(f"   ⚠️ Activity {row_num - 1}: Steps already numbered, skipping")
                        continue
                    
                    # Add numbers to steps
                    numbered_steps = []
                    for i, step in enumerate(steps_list, 1):
                        numbered_steps.append(f"{i}. {step}")
                    
                    # Join back with semicolon
                    new_steps = '; '.join(numbered_steps)
                    
                    # Update the cell
                    cell = worksheet.cell(row_num, steps_col_index + 1)
                    cell.value = new_steps
                    worksheet.update_cells([cell])
                    
                    print(f"   ✅ Activity {row_num - 1}: Added numbered steps ({len(steps_list)} steps)")
                    activities_updated += 1
                    
                    # Wait to avoid rate limits
                    time.sleep(2)
        
        # Summary
        print(f"\n🎉 Numbered Steps Addition Complete!")
        print("=" * 50)
        print(f"   Activities Updated: {activities_updated}")
        print(f"   Steps now numbered (1, 2, 3, etc.)")
        
        print(f"\n📝 Example of Numbered Steps:")
        print("=" * 30)
        print("   Before: 'Choose when baby is calm; Place different textures; Let baby explore'")
        print("   After:  '1. Choose when baby is calm; 2. Place different textures; 3. Let baby explore'")
        
        print(f"\n🔗 Google Sheets URL: {spreadsheet.url}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error during numbered steps addition: {e}")
        return False

if __name__ == '__main__':
    result = add_numbered_steps()
    if result:
        print(f"\n✅ SUCCESS! Numbered steps added to all activities!")
    else:
        print(f"\n❌ FAILED to add numbered steps")
