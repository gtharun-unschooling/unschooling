#!/usr/bin/env python3

import gspread
from google.oauth2.service_account import Credentials

def add_story_builders_row():
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
        
        print("🔍 Searching for Sample 1 Google Sheet...")
        
        # List all spreadsheets
        sheets = gc.openall()
        
        # Look for "Sample 1" sheet
        sample_1_sheet = None
        
        for sheet in sheets:
            sheet_title_lower = sheet.title.lower()
            if 'sample 1' in sheet_title_lower or 'sample one' in sheet_title_lower:
                sample_1_sheet = sheet
                print(f"✅ Found Sample 1: {sheet.title}")
                print(f"   URL: {sheet.url}")
                break
        
        if not sample_1_sheet:
            print("❌ 'Sample 1' sheet not found!")
            return
        
        # Get all worksheets
        worksheets = sample_1_sheet.worksheets()
        print(f"\n📑 Available worksheets:")
        
        theme_names_ws = None
        for ws in worksheets:
            print(f"  - {ws.title}")
            if 'theme' in ws.title.lower() and 'name' in ws.title.lower():
                theme_names_ws = ws
                print(f"    ✅ Found Theme names worksheet!")
        
        if not theme_names_ws:
            print("\n❌ 'Theme names' worksheet not found!")
            return
        
        print(f"\n📄 Working with worksheet: '{theme_names_ws.title}'")
        print(f"   Size: {theme_names_ws.row_count} rows x {theme_names_ws.col_count} cols")
        
        # Check current row 177
        print("\n🔍 Checking row 177...")
        try:
            current_row = theme_names_ws.row_values(177)
            print(f"Current row 177: {current_row}")
        except:
            print("Row 177 appears to be empty")
        
        # The data to insert at row 177
        new_row_data = [
            "26",                                      # sno (or column A)
            "6–8 yrs",                                 # Age Group
            "Story Builders",                          # Theme Name
            "Writing and storytelling with props",     # Short Description
            "Language & Creativity"                    # Core Focus Area
        ]
        
        print("\n📝 Data to insert:")
        print(f"   sno: 26")
        print(f"   Age Group: 6–8 yrs")
        print(f"   Theme Name: Story Builders")
        print(f"   Short Description: Writing and storytelling with props")
        print(f"   Core Focus Area: Language & Creativity")
        
        # Confirm before proceeding
        print("\n⚠️  About to insert data at row 177")
        response = input("Proceed? (yes/no): ")
        
        if response.lower() != 'yes':
            print("❌ Cancelled by user")
            return
        
        # Insert the row at position 177
        theme_names_ws.insert_row(new_row_data, index=177)
        
        print("\n✅ Successfully inserted Story Builders at row 177!")
        
        # Verify the insertion
        print("\n🔍 Verifying insertion...")
        new_row = theme_names_ws.row_values(177)
        print(f"Row 177 now contains: {new_row}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    add_story_builders_row()

