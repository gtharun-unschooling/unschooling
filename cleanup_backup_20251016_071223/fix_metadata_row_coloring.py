#!/usr/bin/env python3
"""
🎨 Fix Metadata Row Coloring
Apply color coding to each row in metadata sheet based on customer vs admin facing
"""

import pandas as pd
import os
from google.oauth2 import service_account
import gspread
from datetime import datetime

def fix_metadata_row_coloring():
    """Apply color coding to each row in metadata sheet"""
    
    print("🎨 Fixing Metadata Row Coloring")
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
        
        # Apply row-based color coding
        print("\n🎨 Applying row-based color coding...")
        
        # Function to convert column number to letter
        def col_num_to_letter(col_num):
            result = ""
            while col_num > 0:
                col_num -= 1
                result = chr(65 + col_num % 26) + result
                col_num //= 26
            return result
        
        # Get the number of columns
        num_columns = len(headers)
        last_column_letter = col_num_to_letter(num_columns)
        
        # Apply color coding to each row based on "Customer Facing" column
        for i, row in enumerate(data_rows):
            row_num = i + 2  # +2 because row 1 is headers, and we start from row 2
            range_name = f"A{row_num}:{last_column_letter}{row_num}"
            
            # Find the "Customer Facing" column index
            customer_facing_index = None
            for j, header in enumerate(headers):
                if header == "Customer Facing":
                    customer_facing_index = j
                    break
            
            if customer_facing_index is not None and customer_facing_index < len(row):
                customer_facing_value = str(row[customer_facing_index]).strip().lower()
                
                if customer_facing_value == "yes":
                    # Green for customer-facing columns
                    metadata_worksheet.format(range_name, {
                        'backgroundColor': {'red': 0.8, 'green': 1.0, 'blue': 0.8}  # Light green
                    })
                elif customer_facing_value == "no":
                    # Red for admin-facing columns
                    metadata_worksheet.format(range_name, {
                        'backgroundColor': {'red': 1.0, 'green': 0.8, 'blue': 0.8}  # Light red
                    })
                else:
                    # Gray for metadata info row
                    metadata_worksheet.format(range_name, {
                        'backgroundColor': {'red': 0.9, 'green': 0.9, 'blue': 0.9}  # Light gray
                    })
        
        print("✅ Applied row-based color coding")
        
        print(f"\n🎉 Metadata Row Coloring Complete!")
        print(f"🔗 URL: {spreadsheet.url}")
        print(f"📋 Metadata sheet: {metadata_worksheet.title}")
        
        # Show summary
        print(f"\n📊 Row Coloring Summary:")
        print(f"   - Total rows: {len(data_rows)}")
        print(f"   - Total columns: {len(headers)}")
        print(f"   - Row-based color coding: Applied")
        print(f"   - Green rows: Customer-facing columns")
        print(f"   - Red rows: Admin-facing columns")
        print(f"   - Gray rows: Metadata info")
        
        return True
        
    except Exception as e:
        print(f"❌ Error during metadata row coloring: {e}")
        return False

if __name__ == '__main__':
    success = fix_metadata_row_coloring()
    
    if success:
        print("\n✅ SUCCESS! Row-based color coding applied to metadata sheet!")
        print("🎨 Each row is now colored based on customer vs admin facing")
        print("🟢 Green rows: Customer-facing columns")
        print("🔴 Red rows: Admin-facing columns")
        print("⚪ Gray rows: Metadata info")
    else:
        print("\n❌ FAILED to apply row-based color coding to metadata sheet.")
