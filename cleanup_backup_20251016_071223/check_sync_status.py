#!/usr/bin/env python3
"""
🔄 Check Sync Status
Compare Google Sheets and local CSV to ensure they are in sync
"""

import pandas as pd
import os
from google.oauth2 import service_account
import gspread
from datetime import datetime
import time

def check_sync_status():
    """Compare Google Sheets and local CSV to check sync status"""
    
    print("🔄 Checking Sync Status - Google Sheets vs Local CSV")
    print("=" * 70)
    
    # Configuration
    CREDS_FILE = 'sheets-credentials.json'
    
    try:
        # Check if local CSV exists
        csv_files = []
        for file in os.listdir('.'):
            if file.endswith('.csv') and 'essential-growth' in file.lower():
                csv_files.append(file)
        
        if not csv_files:
            print("❌ No local CSV files found")
            print("   Looking for files with 'essential-growth' in the name")
            return False
        
        print(f"📁 Found {len(csv_files)} local CSV files:")
        for csv_file in csv_files:
            print(f"   - {csv_file}")
        
        # Use the most recent CSV file
        latest_csv = max(csv_files, key=lambda x: os.path.getmtime(x))
        print(f"\n📊 Using latest CSV: {latest_csv}")
        
        # Load local CSV
        print(f"\n📖 Loading local CSV data...")
        local_df = pd.read_csv(latest_csv)
        print(f"   ✅ Loaded {len(local_df)} rows from local CSV")
        print(f"   📋 Columns: {list(local_df.columns)}")
        
        # Connect to Google Sheets
        scope = [
            'https://spreadsheets.google.com/feeds',
            'https://www.googleapis.com/auth/spreadsheets',
            'https://www.googleapis.com/auth/drive',
            'https://www.googleapis.com/auth/drive.file'
        ]
        creds = service_account.Credentials.from_service_account_file(CREDS_FILE, scopes=scope)
        client = gspread.authorize(creds)
        print("✅ Authenticated with Google Sheets")
        
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
        
        # Get all data from Google Sheets
        print(f"\n📖 Loading Google Sheets data...")
        sheets_data = worksheet.get_all_values()
        if not sheets_data:
            print("❌ No data found in Google Sheets")
            return False
        
        # Convert to DataFrame
        sheets_headers = sheets_data[0]
        sheets_rows = sheets_data[1:]
        sheets_df = pd.DataFrame(sheets_rows, columns=sheets_headers)
        
        print(f"   ✅ Loaded {len(sheets_df)} rows from Google Sheets")
        print(f"   📋 Columns: {list(sheets_df.columns)}")
        
        # Compare basic statistics
        print(f"\n📊 Basic Comparison:")
        print("=" * 50)
        print(f"   Local CSV rows: {len(local_df)}")
        print(f"   Google Sheets rows: {len(sheets_df)}")
        print(f"   Local CSV columns: {len(local_df.columns)}")
        print(f"   Google Sheets columns: {len(sheets_df.columns)}")
        
        # Check if row counts match
        if len(local_df) != len(sheets_df):
            print(f"\n⚠️ ROW COUNT MISMATCH:")
            print(f"   Local CSV: {len(local_df)} rows")
            print(f"   Google Sheets: {len(sheets_df)} rows")
            print(f"   Difference: {abs(len(local_df) - len(sheets_df))} rows")
        else:
            print(f"\n✅ Row counts match: {len(local_df)} rows")
        
        # Check if column counts match
        if len(local_df.columns) != len(sheets_df.columns):
            print(f"\n⚠️ COLUMN COUNT MISMATCH:")
            print(f"   Local CSV: {len(local_df.columns)} columns")
            print(f"   Google Sheets: {len(sheets_df.columns)} columns")
            print(f"   Difference: {abs(len(local_df.columns) - len(sheets_df.columns))} columns")
        else:
            print(f"\n✅ Column counts match: {len(local_df.columns)} columns")
        
        # Check column names
        local_cols = set(local_df.columns)
        sheets_cols = set(sheets_df.columns)
        
        missing_in_sheets = local_cols - sheets_cols
        missing_in_local = sheets_cols - local_cols
        
        if missing_in_sheets:
            print(f"\n⚠️ COLUMNS MISSING IN GOOGLE SHEETS:")
            for col in missing_in_sheets:
                print(f"   - {col}")
        
        if missing_in_local:
            print(f"\n⚠️ COLUMNS MISSING IN LOCAL CSV:")
            for col in missing_in_local:
                print(f"   - {col}")
        
        if not missing_in_sheets and not missing_in_local:
            print(f"\n✅ All column names match")
        
        # Compare specific columns if row counts match
        if len(local_df) == len(sheets_df) and len(local_df.columns) == len(sheets_df.columns):
            print(f"\n🔍 Detailed Content Comparison:")
            print("=" * 50)
            
            # Compare key columns
            key_columns = ['Activity ID', 'Pillar', 'Age Group', 'Topic', 'Activity Name', 'Objective', 'Explanation']
            
            for col in key_columns:
                if col in local_df.columns and col in sheets_df.columns:
                    # Compare the first few rows
                    local_values = local_df[col].astype(str).tolist()[:10]
                    sheets_values = sheets_df[col].astype(str).tolist()[:10]
                    
                    matches = sum(1 for l, s in zip(local_values, sheets_values) if l == s)
                    total = len(local_values)
                    
                    print(f"   {col}: {matches}/{total} matches in first 10 rows")
                    
                    if matches == total:
                        print(f"      ✅ Perfect match")
                    elif matches > total * 0.8:
                        print(f"      ⚠️ Mostly in sync ({matches/total*100:.1f}% match)")
                    else:
                        print(f"      ❌ Out of sync ({matches/total*100:.1f}% match)")
        
        # Check for data type differences
        print(f"\n🔍 Data Type Comparison:")
        print("=" * 50)
        
        common_cols = local_cols & sheets_cols
        for col in list(common_cols)[:5]:  # Check first 5 common columns
            if col in local_df.columns and col in sheets_df.columns:
                local_type = str(local_df[col].dtype)
                sheets_type = str(sheets_df[col].dtype)
                
                if local_type == sheets_type:
                    print(f"   {col}: ✅ Same type ({local_type})")
                else:
                    print(f"   {col}: ⚠️ Different types (Local: {local_type}, Sheets: {sheets_type})")
        
        # Check for missing values
        print(f"\n🔍 Missing Values Comparison:")
        print("=" * 50)
        
        for col in list(common_cols)[:5]:  # Check first 5 common columns
            if col in local_df.columns and col in sheets_df.columns:
                local_missing = local_df[col].isna().sum()
                sheets_missing = sheets_df[col].isna().sum()
                
                if local_missing == sheets_missing:
                    print(f"   {col}: ✅ Same missing count ({local_missing})")
                else:
                    print(f"   {col}: ⚠️ Different missing counts (Local: {local_missing}, Sheets: {sheets_missing})")
        
        # Summary
        print(f"\n🎯 Sync Status Summary:")
        print("=" * 50)
        
        if len(local_df) == len(sheets_df) and len(local_df.columns) == len(sheets_df.columns) and not missing_in_sheets and not missing_in_local:
            print("   ✅ PERFECT SYNC: Google Sheets and local CSV are in sync")
            print("   - Row counts match")
            print("   - Column counts match")
            print("   - Column names match")
            print("   - Data appears to be synchronized")
        else:
            print("   ⚠️ SYNC ISSUES DETECTED:")
            if len(local_df) != len(sheets_df):
                print(f"   - Row count mismatch: {len(local_df)} vs {len(sheets_df)}")
            if len(local_df.columns) != len(sheets_df.columns):
                print(f"   - Column count mismatch: {len(local_df.columns)} vs {len(sheets_df.columns)}")
            if missing_in_sheets:
                print(f"   - Missing columns in Google Sheets: {len(missing_in_sheets)}")
            if missing_in_local:
                print(f"   - Missing columns in local CSV: {len(missing_in_local)}")
            
            print("\n   🔧 RECOMMENDATIONS:")
            print("   1. Sync the data to ensure consistency")
            print("   2. Check for recent updates in either source")
            print("   3. Verify which source has the latest changes")
            print("   4. Consider updating the outdated source")
        
        print(f"\n🔗 Google Sheets URL: {spreadsheet.url}")
        print(f"📁 Local CSV file: {latest_csv}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error during sync check: {e}")
        return False

if __name__ == '__main__':
    check_sync_status()
