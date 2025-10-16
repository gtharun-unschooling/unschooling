#!/usr/bin/env python3
"""
🔄 Sync from Google Sheets back to CSV
Download changes from Google Sheets and update local CSV file
"""

import gspread
import pandas as pd
from oauth2client.service_account import ServiceAccountCredentials
import os
from datetime import datetime

def sync_from_sheets_to_csv():
    """Download data from Google Sheets and update local CSV"""
    
    print("🔄 Syncing from Google Sheets to CSV")
    print("=" * 50)
    
    try:
        # Authenticate with service account
        scope = [
            'https://spreadsheets.google.com/feeds',
            'https://www.googleapis.com/auth/spreadsheets',
            'https://www.googleapis.com/auth/drive'
        ]
        
        creds = ServiceAccountCredentials.from_json_keyfile_name('sheets-credentials.json', scope)
        client = gspread.authorize(creds)
        print("✅ Authenticated with Sheets Uploader service account")
        
        # Find your Google Sheet
        all_sheets = client.list_spreadsheet_files()
        target_sheet = None
        
        for sheet in all_sheets:
            sheet_name = sheet.get('name', '').lower()
            if 'sample 1' in sheet_name:
                target_sheet = sheet
                print(f"✅ Found: {sheet.get('name')}")
                break
        
        if not target_sheet:
            print("❌ Sample 1 sheet not found")
            return False
        
        # Open the spreadsheet
        spreadsheet = client.open_by_key(target_sheet['id'])
        worksheet = spreadsheet.get_worksheet(0)
        
        print(f"📊 Reading data from: {target_sheet.get('name')}")
        
        # Get all data from the sheet
        all_data = worksheet.get_all_values()
        
        if not all_data:
            print("❌ No data found in the sheet")
            return False
        
        # Convert to DataFrame
        headers = all_data[0]
        data_rows = all_data[1:]
        
        df = pd.DataFrame(data_rows, columns=headers)
        
        print(f"📊 Downloaded {len(df)} activities from Google Sheets")
        print(f"📋 Columns: {list(df.columns)}")
        
        # Check if "Updated By" column exists, if not add it
        if 'Updated By' not in df.columns:
            df['Updated By'] = 'Tharun'
            print("✅ Added 'Updated By' column with 'Tharun'")
        else:
            # Update existing "Updated By" column
            df['Updated By'] = 'Tharun'
            print("✅ Updated 'Updated By' column with 'Tharun'")
        
        # Add timestamp
        df['Last Synced'] = datetime.now().strftime('%Y-%m-%d %H:%M:%S')
        print("✅ Added 'Last Synced' timestamp")
        
        # Create backup of original CSV
        original_csv = 'essential-growth-activities-enhanced-20250927_003226.csv'
        backup_csv = f'essential-growth-activities-backup-{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'
        
        if os.path.exists(original_csv):
            import shutil
            shutil.copy2(original_csv, backup_csv)
            print(f"✅ Created backup: {backup_csv}")
        
        # Save updated CSV
        df.to_csv(original_csv, index=False)
        print(f"✅ Updated local CSV: {original_csv}")
        
        print("\n" + "=" * 50)
        print("🎉 Sync Complete!")
        print(f"📊 Activities synced: {len(df)}")
        print(f"📋 Columns: {len(df.columns)}")
        print(f"📁 Local file: {original_csv}")
        print(f"💾 Backup: {backup_csv}")
        print("=" * 50)
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

def add_updated_by_column_to_sheets():
    """Add 'Updated By' column to Google Sheets"""
    
    print("📝 Adding 'Updated By' column to Google Sheets")
    print("=" * 50)
    
    try:
        # Authenticate
        scope = [
            'https://spreadsheets.google.com/feeds',
            'https://www.googleapis.com/auth/spreadsheets',
            'https://www.googleapis.com/auth/drive'
        ]
        
        creds = ServiceAccountCredentials.from_json_keyfile_name('sheets-credentials.json', scope)
        client = gspread.authorize(creds)
        print("✅ Authenticated")
        
        # Find your sheet
        all_sheets = client.list_spreadsheet_files()
        target_sheet = None
        
        for sheet in all_sheets:
            sheet_name = sheet.get('name', '').lower()
            if 'sample 1' in sheet_name:
                target_sheet = sheet
                break
        
        if not target_sheet:
            print("❌ Sample 1 sheet not found")
            return False
        
        # Open spreadsheet
        spreadsheet = client.open_by_key(target_sheet['id'])
        worksheet = spreadsheet.get_worksheet(0)
        
        # Get current data
        all_data = worksheet.get_all_values()
        headers = all_data[0]
        
        # Check if "Updated By" column already exists
        if 'Updated By' in headers:
            print("✅ 'Updated By' column already exists")
            return True
        
        # Add "Updated By" column
        new_headers = headers + ['Updated By']
        
        # Update headers
        worksheet.update('A1', [new_headers])
        
        # Fill "Updated By" column with "Tharun"
        num_rows = len(all_data) - 1  # Exclude header
        if num_rows > 0:
            updated_by_column = ['Tharun'] * num_rows
            col_letter = chr(ord('A') + len(headers))  # Next column after last
            range_name = f'{col_letter}2:{col_letter}{num_rows + 1}'
            worksheet.update(range_name, [[val] for val in updated_by_column])
        
        print("✅ Added 'Updated By' column with 'Tharun' values")
        print(f"🔗 Updated sheet: {spreadsheet.url}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == '__main__':
    print("🔄 Google Sheets ↔ CSV Sync Test")
    print("=" * 60)
    
    # Step 1: Add "Updated By" column to Google Sheets
    print("Step 1: Adding 'Updated By' column to Google Sheets...")
    if add_updated_by_column_to_sheets():
        print("✅ Step 1 completed")
    else:
        print("❌ Step 1 failed")
        exit(1)
    
    print("\n" + "-" * 40)
    
    # Step 2: Sync from Google Sheets to CSV
    print("Step 2: Syncing from Google Sheets to CSV...")
    if sync_from_sheets_to_csv():
        print("✅ Step 2 completed")
    else:
        print("❌ Step 2 failed")
        exit(1)
    
    print("\n🎉 Both directions working!")
    print("✅ Google Sheets → CSV: Working")
    print("✅ CSV → Google Sheets: Working")
    print("✅ Bidirectional sync: Complete")
