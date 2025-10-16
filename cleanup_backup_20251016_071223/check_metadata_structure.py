#!/usr/bin/env python3
"""
🔍 Check Metadata Structure
Check the current structure of the metadata sheet
"""

import pandas as pd
import os
from google.oauth2 import service_account
import gspread
from datetime import datetime

def check_metadata_structure():
    """Check the current structure of the metadata sheet"""
    
    print("🔍 Checking Metadata Structure")
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
        
        # Check if metadata sheet exists
        try:
            metadata_worksheet = spreadsheet.worksheet("Metadata")
            print("✅ Found existing Metadata sheet")
        except:
            print("❌ Metadata sheet not found")
            return False
        
        # Get all data from metadata sheet
        all_data = metadata_worksheet.get_all_values()
        
        # Get headers
        headers = all_data[0] if all_data else []
        print(f"📋 Found {len(headers)} columns in Metadata sheet")
        
        print(f"\n📝 Metadata Sheet Headers:")
        print("=" * 40)
        for i, header in enumerate(headers):
            print(f"   {i}: {header}")
        
        print(f"\n📊 Metadata Sheet Data (First 10 rows):")
        print("=" * 50)
        for i, row in enumerate(all_data[:10]):
            print(f"   Row {i}: {row}")
        
        # Look for Materials columns
        print(f"\n🔍 Looking for Materials columns:")
        print("=" * 40)
        
        for i, row in enumerate(all_data):
            if len(row) > 0 and "Materials" in row[0]:
                print(f"   Row {i}: {row}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error during metadata check: {e}")
        return False

if __name__ == '__main__':
    check_metadata_structure()
