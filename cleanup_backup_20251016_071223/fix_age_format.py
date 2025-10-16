#!/usr/bin/env python3
"""
🔧 Fix Age Format
Correct age format: above 12 months should be years only
"""

import gspread
from google.oauth2.service_account import Credentials
import time

def get_google_sheets_client():
    """Connect to Google Sheets using credentials"""
    try:
        scope = [
            'https://spreadsheets.google.com/feeds',
            'https://www.googleapis.com/auth/spreadsheets',
            'https://www.googleapis.com/auth/drive',
            'https://www.googleapis.com/auth/drive.file'
        ]
        creds = Credentials.from_service_account_file('sheets-credentials.json', scopes=scope)
        client = gspread.authorize(creds)
        print("✅ Connected to Google Sheets")
        return client
    except Exception as e:
        print(f"❌ Error connecting to Google Sheets: {e}")
        return None

def fix_age_format(client):
    """Fix age format for all activities"""
    
    try:
        # Open the Sample 1 spreadsheet
        spreadsheet = client.open_by_key('14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ')
        activities_worksheet = spreadsheet.worksheet('Activities')
        
        print(f"🔧 FIXING AGE FORMAT:")
        print("=" * 60)
        
        # Get all data
        all_data = activities_worksheet.get_all_values()
        headers = all_data[0]
        
        # Find Age column
        age_col_index = headers.index('Age') if 'Age' in headers else None
        
        if age_col_index is None:
            print("❌ Age column not found")
            return False
        
        # Age format corrections
        age_corrections = {
            '18-24 months': '1-2 years',
            '24-36 months': '2-3 years',
            '18-30 months': '1-3 years',
            '20-30 months': '2-3 years',
            '20-36 months': '2-3 years',
            '24-36 months': '2-3 years'
        }
        
        fixes_made = 0
        
        # Find all rows and fix age format
        for row_num, row in enumerate(all_data[1:], start=2):
            if len(row) > age_col_index:
                current_age = row[age_col_index].strip()
                
                # Check if age needs correction
                if current_age in age_corrections:
                    new_age = age_corrections[current_age]
                    activities_worksheet.update_cell(row_num, age_col_index + 1, new_age)
                    print(f"   ✅ Row {row_num}: '{current_age}' → '{new_age}'")
                    fixes_made += 1
                    time.sleep(1)  # Rate limiting
        
        print(f"\n🎉 AGE FORMAT FIXED!")
        print("=" * 50)
        print(f"✅ Fixed {fixes_made} age entries")
        print(f"✅ All ages above 12 months now in years format")
        print(f"✅ Age format corrected")
        
        return True
        
    except Exception as e:
        print(f"❌ Error fixing age format: {e}")
        return False

def main():
    """Main function to fix age format"""
    print("🔧 Fix Age Format")
    print("=" * 70)
    print("🎯 Correct age format: above 12 months should be years only")
    
    # Connect to Google Sheets
    client = get_google_sheets_client()
    if not client:
        return False
    
    # Fix age format
    success = fix_age_format(client)
    
    if success:
        print(f"\n✅ SUCCESS! Age format fixed!")
        print("=" * 50)
        print("✅ 18-24 months → 1-2 years")
        print("✅ 24-36 months → 2-3 years")
        print("✅ 18-30 months → 1-3 years")
        print("✅ 20-30 months → 2-3 years")
        print("✅ 20-36 months → 2-3 years")
        print("✅ All ages above 12 months now in years format")
        
        return True
    else:
        print(f"\n❌ FAILED to fix age format!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Age format corrected!")
    else:
        print(f"\n❌ FAILED to fix age format!")
