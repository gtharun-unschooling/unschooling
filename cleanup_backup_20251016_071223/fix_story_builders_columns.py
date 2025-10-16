#!/usr/bin/env python3

import gspread
from google.oauth2.service_account import Credentials

def fix_story_builders_row():
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
        
        # The CORRECT data for row 177
        correct_row_data = [
            "Hybrid",                                   # Column 1: Plan Type
            "26",                                       # Column 2: S.No
            "6–8 yrs",                                  # Column 3: Age Group
            "Story Builders",                           # Column 4: Theme Name
            "Writing and storytelling with props",      # Column 5: Short Description
            "Language & Creativity"                     # Column 6: Core Focus Area
        ]
        
        print("\n📝 Current row 177:")
        current = theme_names_ws.row_values(177)
        print(f"   {current}")
        
        print("\n✏️  Correcting row 177 with proper columns:")
        print(f"   Plan Type: Hybrid")
        print(f"   S.No: 26")
        print(f"   Age Group: 6–8 yrs")
        print(f"   Theme Name: Story Builders")
        print(f"   Short Description: Writing and storytelling with props")
        print(f"   Core Focus Area: Language & Creativity")
        
        # Update the entire row 177 with correct data
        theme_names_ws.update(f'A177:F177', [correct_row_data])
        
        print("\n✅ SUCCESS! Row 177 has been corrected!")
        
        # Verify
        print("\n🔍 Verifying correction...")
        updated_row = theme_names_ws.row_values(177)
        print(f"Row 177 now contains: {updated_row}")
        
        print(f"\n🌐 View it here: {sample_1_sheet.url}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    fix_story_builders_row()

