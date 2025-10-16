#!/usr/bin/env python3
"""
🔍 Check Metadata Standards
Verify that all columns have proper standards and conditions defined in the metadata sheet
"""

import pandas as pd
import os
from google.oauth2 import service_account
import gspread
from datetime import datetime
import time

def check_metadata_standards():
    """Check if all columns have proper standards and conditions in the metadata sheet"""
    
    print("🔍 Checking Metadata Standards for All Columns")
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
        
        # Get all worksheets
        worksheets = spreadsheet.worksheets()
        print(f"\n📋 Found {len(worksheets)} worksheets:")
        for i, ws in enumerate(worksheets):
            print(f"   {i+1}. {ws.title}")
        
        # Find the metadata sheet
        metadata_sheet = None
        for ws in worksheets:
            if 'metadata' in ws.title.lower() or 'standards' in ws.title.lower() or 'column' in ws.title.lower():
                metadata_sheet = ws
                break
        
        if not metadata_sheet:
            print("❌ No metadata sheet found")
            print("   Looking for sheets with 'metadata', 'standards', or 'column' in the title")
            return False
        
        print(f"\n📝 Found metadata sheet: {metadata_sheet.title}")
        
        # Get metadata data
        metadata_data = metadata_sheet.get_all_values()
        if not metadata_data:
            print("❌ No data found in metadata sheet")
            return False
        
        # Get headers from metadata
        metadata_headers = metadata_data[0]
        print(f"\n📋 Metadata sheet columns:")
        for i, header in enumerate(metadata_headers):
            print(f"   {i+1}. {header}")
        
        # Find important columns in metadata
        column_name_idx = None
        word_limit_idx = None
        content_type_idx = None
        customer_facing_idx = None
        admin_facing_idx = None
        description_idx = None
        
        for i, header in enumerate(metadata_headers):
            if 'column' in header.lower() and 'name' in header.lower():
                column_name_idx = i
            elif 'word' in header.lower() and 'limit' in header.lower():
                word_limit_idx = i
            elif 'content' in header.lower() and 'type' in header.lower():
                content_type_idx = i
            elif 'customer' in header.lower() and 'facing' in header.lower():
                customer_facing_idx = i
            elif 'admin' in header.lower() and 'facing' in header.lower():
                admin_facing_idx = i
            elif 'description' in header.lower():
                description_idx = i
        
        print(f"\n🔍 Metadata Analysis:")
        print("=" * 50)
        print(f"   Column Name Index: {column_name_idx}")
        print(f"   Word Limit Index: {word_limit_idx}")
        print(f"   Content Type Index: {content_type_idx}")
        print(f"   Customer Facing Index: {customer_facing_idx}")
        print(f"   Admin Facing Index: {admin_facing_idx}")
        print(f"   Description Index: {description_idx}")
        
        # Get all column names from the main sheet
        main_sheet = worksheets[0]  # First sheet is usually the main data
        main_data = main_sheet.get_all_values()
        main_headers = main_data[0]
        
        print(f"\n📊 Main Sheet Columns ({len(main_headers)} total):")
        for i, header in enumerate(main_headers):
            print(f"   {i+1}. {header}")
        
        # Check which columns have metadata
        print(f"\n🔍 Checking Metadata Coverage:")
        print("=" * 50)
        
        columns_with_metadata = []
        columns_without_metadata = []
        
        for main_header in main_headers:
            found_in_metadata = False
            for row in metadata_data[1:]:  # Skip header row
                if len(row) > column_name_idx and row[column_name_idx].strip() == main_header:
                    found_in_metadata = True
                    columns_with_metadata.append(main_header)
                    break
            
            if not found_in_metadata:
                columns_without_metadata.append(main_header)
        
        print(f"\n✅ Columns WITH metadata ({len(columns_with_metadata)}):")
        for col in columns_with_metadata:
            print(f"   - {col}")
        
        print(f"\n❌ Columns WITHOUT metadata ({len(columns_without_metadata)}):")
        for col in columns_without_metadata:
            print(f"   - {col}")
        
        # Show detailed metadata for each column
        print(f"\n📋 Detailed Metadata for Each Column:")
        print("=" * 60)
        
        for main_header in main_headers:
            print(f"\n🔍 Column: {main_header}")
            print("-" * 40)
            
            found_metadata = False
            for row_num, row in enumerate(metadata_data[1:], 2):  # Skip header row
                if len(row) > column_name_idx and row[column_name_idx].strip() == main_header:
                    found_metadata = True
                    print(f"   Row {row_num} in metadata sheet:")
                    
                    if word_limit_idx is not None and len(row) > word_limit_idx:
                        word_limit = row[word_limit_idx].strip()
                        print(f"      Word Limit: {word_limit}")
                    
                    if content_type_idx is not None and len(row) > content_type_idx:
                        content_type = row[content_type_idx].strip()
                        print(f"      Content Type: {content_type}")
                    
                    if customer_facing_idx is not None and len(row) > customer_facing_idx:
                        customer_facing = row[customer_facing_idx].strip()
                        print(f"      Customer Facing: {customer_facing}")
                    
                    if admin_facing_idx is not None and len(row) > admin_facing_idx:
                        admin_facing = row[admin_facing_idx].strip()
                        print(f"      Admin Facing: {admin_facing}")
                    
                    if description_idx is not None and len(row) > description_idx:
                        description = row[description_idx].strip()
                        print(f"      Description: {description}")
                    
                    break
            
            if not found_metadata:
                print(f"   ❌ No metadata found for this column")
        
        # Summary
        print(f"\n🎯 Metadata Coverage Summary:")
        print("=" * 50)
        print(f"   Total columns in main sheet: {len(main_headers)}")
        print(f"   Columns with metadata: {len(columns_with_metadata)}")
        print(f"   Columns without metadata: {len(columns_without_metadata)}")
        print(f"   Coverage percentage: {len(columns_with_metadata) / len(main_headers) * 100:.1f}%")
        
        if columns_without_metadata:
            print(f"\n⚠️ RECOMMENDATIONS:")
            print("   1. Add metadata for missing columns")
            print("   2. Ensure all columns have proper standards")
            print("   3. Define word limits and content types")
            print("   4. Specify customer vs admin facing")
        else:
            print(f"\n✅ All columns have metadata!")
            print("   - Complete coverage achieved")
            print("   - All standards defined")
            print("   - Ready for quality control")
        
        print(f"\n🔗 Google Sheets URL: {spreadsheet.url}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error during metadata check: {e}")
        return False

if __name__ == '__main__':
    check_metadata_standards()
