#!/usr/bin/env python3
"""
📋 Fix Metadata Upload
Fix NaN values and upload updated metadata to Google Sheets
"""

import pandas as pd
import os
from google.oauth2 import service_account
import gspread
from datetime import datetime

def fix_metadata_upload():
    """Fix NaN values and upload updated metadata to Google Sheets"""
    
    print("📋 Fixing Metadata Upload")
    print("=" * 60)
    
    # Configuration
    METADATA_FILE = 'essential-growth-activities-metadata-updated.csv'
    CREDS_FILE = 'sheets-credentials.json'
    
    try:
        # Read the updated metadata
        df = pd.read_csv(METADATA_FILE)
        print(f"📊 Loaded metadata with {len(df)} rows and {len(df.columns)} columns")
        
        # Fix NaN values
        df = df.fillna('')
        print("✅ Fixed NaN values")
        
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
        
        # Check if metadata sheet exists, if not create it
        try:
            metadata_worksheet = spreadsheet.worksheet("Metadata")
            print("✅ Found existing Metadata sheet")
        except gspread.WorksheetNotFound:
            print("📋 Creating new Metadata sheet")
            metadata_worksheet = spreadsheet.add_worksheet(title="Metadata", rows=1000, cols=20)
        
        # Clear existing content
        metadata_worksheet.clear()
        
        # Upload new metadata
        headers = df.columns.tolist()
        data_rows = df.values.tolist()
        
        # Upload data
        metadata_worksheet.update([headers] + data_rows)
        print(f"✅ Uploaded {len(data_rows)} rows of metadata")
        
        # Format headers
        metadata_worksheet.format('A1:Z1', {
            'backgroundColor': {'red': 0.26, 'green': 0.52, 'blue': 0.96},
            'textFormat': {'foregroundColor': {'red': 1, 'green': 1, 'blue': 1}, 'bold': True}
        })
        print("✅ Formatted headers")
        
        # Apply color coding to metadata sheet
        print("\n🎨 Applying color coding to metadata sheet...")
        
        # Function to convert column number to letter
        def col_num_to_letter(col_num):
            result = ""
            while col_num > 0:
                col_num -= 1
                result = chr(65 + col_num % 26) + result
                col_num //= 26
            return result
        
        # Define customer-facing vs admin-facing columns for metadata
        customer_metadata_columns = [
            "Purpose",
            "Format", 
            "Pattern",
            "Example",
            "Options",
            "Rules",
            "Quality Standards"
        ]
        
        admin_metadata_columns = [
            "Column Name",
            "Max Words",
            "Max Items", 
            "Max Steps",
            "Max Skills",
            "Max Hashtags",
            "Max Words per Step",
            "Color Code",
            "Customer Facing"
        ]
        
        # Apply color coding to metadata columns
        for i, header in enumerate(headers):
            col_letter = col_num_to_letter(i + 1)
            if header in customer_metadata_columns:
                # Green for customer-facing metadata
                metadata_worksheet.format(f"{col_letter}1:{col_letter}{len(data_rows) + 1}", {
                    'backgroundColor': {'red': 0.8, 'green': 1.0, 'blue': 0.8}
                })
            elif header in admin_metadata_columns:
                # Red for admin-facing metadata
                metadata_worksheet.format(f"{col_letter}1:{col_letter}{len(data_rows) + 1}", {
                    'backgroundColor': {'red': 1.0, 'green': 0.8, 'blue': 0.8}
                })
        
        print("✅ Applied color coding to metadata sheet")
        
        print(f"\n🎉 Metadata Upload Complete!")
        print(f"🔗 URL: {spreadsheet.url}")
        print(f"📋 Metadata sheet: {metadata_worksheet.title}")
        
        # Show summary
        print(f"\n📊 Metadata Upload Summary:")
        print(f"   - Total rows: {len(data_rows)}")
        print(f"   - Total columns: {len(headers)}")
        print(f"   - Customer-facing metadata columns: {len(customer_metadata_columns)}")
        print(f"   - Admin-facing metadata columns: {len(admin_metadata_columns)}")
        print(f"   - Color coding: Applied")
        print(f"   - Headers: Formatted")
        
        return True
        
    except Exception as e:
        print(f"❌ Error during metadata upload: {e}")
        return False

if __name__ == '__main__':
    success = fix_metadata_upload()
    
    if success:
        print("\n✅ SUCCESS! Updated metadata uploaded to Google Sheets!")
        print("📋 All 29 columns documented with standards and rules")
        print("🎨 Color coding applied to metadata sheet")
    else:
        print("\n❌ FAILED to upload updated metadata to Google Sheets.")