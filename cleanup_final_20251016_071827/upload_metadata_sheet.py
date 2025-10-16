#!/usr/bin/env python3
"""
📋 Upload Metadata Sheet to Google Sheets
Upload the metadata sheet to Google Sheets for reference
"""

import pandas as pd
import os
from google.oauth2 import service_account
import gspread
from datetime import datetime

def upload_metadata_sheet():
    """Upload metadata sheet to Google Sheets"""
    
    print("📋 Uploading Metadata Sheet to Google Sheets")
    print("=" * 60)
    
    # Configuration
    METADATA_FILE = 'essential-growth-activities-metadata.csv'
    CREDS_FILE = 'sheets-credentials.json'
    
    # Read metadata CSV
    df = pd.read_csv(METADATA_FILE)
    print(f"📊 Loaded metadata with {len(df)} rows and {len(df.columns)} columns")
    
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
            print("Available files:")
            for sheet in all_sheets:
                sheet_name = sheet.get('name', sheet.get('title', 'Unknown'))
                print(f"  - {sheet_name}")
            return False
        
        # Upload metadata to the first target file
        target_sheet = target_files[0]
        sheet_name = target_sheet.get('name', target_sheet.get('title', 'Unknown'))
        print(f"\n📤 Uploading metadata to: {sheet_name}")
        
        # Open sheet
        spreadsheet = client.open_by_key(target_sheet['id'])
        
        # Create a new worksheet for metadata
        try:
            # Try to get existing metadata worksheet
            metadata_worksheet = spreadsheet.worksheet("Metadata")
            print("✅ Found existing Metadata worksheet")
        except gspread.WorksheetNotFound:
            # Create new metadata worksheet
            metadata_worksheet = spreadsheet.add_worksheet(title="Metadata", rows=100, cols=20)
            print("✅ Created new Metadata worksheet")
        
        # Clear and upload data
        metadata_worksheet.clear()
        
        # Prepare data for upload
        headers = df.columns.tolist()
        data_rows = df.values.tolist()
        
        # Upload data
        metadata_worksheet.update([headers] + data_rows)
        
        # Format headers
        metadata_worksheet.format('A1:Z1', {
            'backgroundColor': {'red': 0.2, 'green': 0.6, 'blue': 0.8},
            'textFormat': {'foregroundColor': {'red': 1, 'green': 1, 'blue': 1}, 'bold': True}
        })
        
        # Format the metadata info row (row 2)
        metadata_worksheet.format('A2:Z2', {
            'backgroundColor': {'red': 0.9, 'green': 0.9, 'blue': 0.9},
            'textFormat': {'bold': True}
        })
        
        print(f"✅ Successfully uploaded metadata to {sheet_name}")
        print(f"🔗 URL: {spreadsheet.url}")
        print(f"📋 Worksheet: Metadata")
        
        print("\n🎉 Metadata Upload Complete!")
        return True
        
    except Exception as e:
        print(f"❌ Error during upload: {e}")
        return False

if __name__ == '__main__':
    success = upload_metadata_sheet()
    
    if success:
        print("\n✅ SUCCESS! Metadata sheet uploaded to Google Sheets!")
        print("📋 You can now use it as a reference for creating new activities")
    else:
        print("\n❌ FAILED to upload metadata sheet to Google Sheets.")
