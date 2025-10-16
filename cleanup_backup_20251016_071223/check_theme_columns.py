#!/usr/bin/env python3

import gspread
from google.oauth2.service_account import Credentials

def check_theme_columns():
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
        
        if not sample_1_sheet:
            print("❌ Sample 1 not found!")
            return
        
        # Get Theme Names worksheet
        theme_names_ws = None
        for ws in sample_1_sheet.worksheets():
            if 'theme' in ws.title.lower() and 'name' in ws.title.lower():
                theme_names_ws = ws
                break
        
        if not theme_names_ws:
            print("❌ Theme Names worksheet not found!")
            return
        
        print(f"✅ Found worksheet: '{theme_names_ws.title}'")
        
        # Get header row (row 1)
        print("\n📋 HEADER ROW (Row 1):")
        headers = theme_names_ws.row_values(1)
        for i, header in enumerate(headers, 1):
            print(f"  Column {i}: {header}")
        
        # Get a sample row to see the format
        print("\n📄 SAMPLE ROW (Row 2):")
        sample_row = theme_names_ws.row_values(2)
        for i, value in enumerate(sample_row, 1):
            header = headers[i-1] if i <= len(headers) else f"Column {i}"
            print(f"  {header}: {value}")
        
        # Check current row 177
        print("\n🔍 CURRENT ROW 177:")
        row_177 = theme_names_ws.row_values(177)
        for i, value in enumerate(row_177, 1):
            header = headers[i-1] if i <= len(headers) else f"Column {i}"
            print(f"  {header}: {value}")
        
        # Check rows around 177 to see the pattern
        print("\n📊 ROWS AROUND 177:")
        for row_num in [175, 176, 177, 178, 179]:
            row_data = theme_names_ws.row_values(row_num)
            if row_data:
                print(f"Row {row_num}: {row_data[:5]}")  # First 5 columns
            else:
                print(f"Row {row_num}: [empty]")
        
        return theme_names_ws, headers
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    check_theme_columns()

