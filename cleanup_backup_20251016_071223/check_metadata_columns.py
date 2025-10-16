#!/usr/bin/env python3
"""
Check Metadata Sheet Columns
See what columns are currently in the Metadata sheet
"""

import gspread
import json

def check_metadata_columns():
    """Check the current columns in the Metadata sheet"""
    
    print("🔍 Checking Metadata Sheet columns...")
    
    try:
        # Authenticate with service account
        gc = gspread.service_account(filename='google-sheets-service-account.json')
        sheet = gc.open_by_key('14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ')
        metadata_worksheet = sheet.worksheet('Metadata')
        
        print("✅ Connected to Google Sheets")
        
        # Get all records from metadata sheet
        records = metadata_worksheet.get_all_records()
        
        print(f"📊 Found {len(records)} records in Metadata sheet")
        
        if records:
            # Show the columns
            columns = list(records[0].keys())
            print(f"📋 Current columns ({len(columns)}):")
            for i, col in enumerate(columns, 1):
                print(f"   {i}. {col}")
            
            # Show first few records
            print(f"\n📝 First 3 records:")
            for i, record in enumerate(records[:3], 1):
                print(f"\nRecord {i}:")
                for key, value in record.items():
                    if value:  # Only show non-empty values
                        print(f"   {key}: {str(value)[:100]}{'...' if len(str(value)) > 100 else ''}")
        
        else:
            print("❌ No records found in Metadata sheet")
            
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    print("🔍 Check Metadata Columns Tool")
    print("=" * 35)
    
    check_metadata_columns()
