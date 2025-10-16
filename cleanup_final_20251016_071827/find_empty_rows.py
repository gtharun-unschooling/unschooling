#!/usr/bin/env python3

import gspread
from google.oauth2.service_account import Credentials

def find_and_clear_empty_rows():
    try:
        # Load service account credentials
        creds = Credentials.from_service_account_file(
            'google-sheets-service-account.json',
            scopes=[
                'https://www.googleapis.com/auth/spreadsheets',
                'https://www.googleapis.com/auth/drive'
            ]
        )
        
        # Create gspread client
        gc = gspread.authorize(creds)
        
        print("🔍 Accessing Sample 1 Google Sheet...")
        
        # Get Sample 1 sheet
        sheets = gc.openall()
        sample_1_sheet = None
        
        for sheet in sheets:
            if 'sample 1' in sheet.title.lower():
                sample_1_sheet = sheet
                break
        
        # Get Theme Names worksheet
        theme_names_ws = None
        for ws in sample_1_sheet.worksheets():
            if 'theme' in ws.title.lower() and 'name' in ws.title.lower():
                theme_names_ws = ws
                break
        
        print(f"✅ Found worksheet: '{theme_names_ws.title}'")
        
        # Get all values
        all_values = theme_names_ws.get_all_values()
        
        print(f"\n📊 Total rows in sheet: {len(all_values)}")
        
        # Find empty rows (rows where all cells are empty)
        empty_rows = []
        for i, row in enumerate(all_values, 1):
            # Skip header row
            if i == 1:
                continue
            # Check if row is completely empty or only has whitespace
            if not any(cell.strip() for cell in row):
                empty_rows.append(i)
        
        print(f"\n🔍 Found {len(empty_rows)} empty rows")
        
        if empty_rows:
            print("\n📋 Empty rows found at:")
            # Show first 20 empty rows
            for row_num in empty_rows[:20]:
                print(f"   Row {row_num}")
            if len(empty_rows) > 20:
                print(f"   ... and {len(empty_rows) - 20} more")
            
            # Delete empty rows (from bottom to top to avoid index shifting)
            print(f"\n🗑️  Deleting {len(empty_rows)} empty rows...")
            
            for row_num in reversed(empty_rows):
                try:
                    theme_names_ws.delete_rows(row_num)
                    print(f"   Deleted row {row_num}")
                except Exception as e:
                    print(f"   ⚠️  Could not delete row {row_num}: {e}")
            
            print(f"\n✅ SUCCESS! Cleared all empty rows from Theme Names table!")
            
            # Check final row count
            final_values = theme_names_ws.get_all_values()
            print(f"\n📊 Final row count: {len(final_values)}")
            print(f"   Removed: {len(all_values) - len(final_values)} rows")
        else:
            print("\n✅ No empty rows found - table is already clean!")
        
        print(f"\n🌐 View it here: {sample_1_sheet.url}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    find_and_clear_empty_rows()

