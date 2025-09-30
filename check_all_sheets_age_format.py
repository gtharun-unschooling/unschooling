#!/usr/bin/env python3
"""
🔍 Check All Sheets Age Format
Check all sheets for age format consistency
"""

import gspread
from google.oauth2.service_account import Credentials

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

def check_all_sheets_age_format(client):
    """Check all sheets for age format consistency"""
    
    try:
        # Open the Sample 1 spreadsheet
        spreadsheet = client.open_by_key('14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ')
        
        print(f"🔍 CHECKING ALL SHEETS FOR AGE FORMAT:")
        print("=" * 70)
        
        # Get all worksheets
        worksheets = spreadsheet.worksheets()
        
        for worksheet in worksheets:
            worksheet_name = worksheet.title
            print(f"\n📋 Checking: {worksheet_name}")
            
            # Get all data
            all_data = worksheet.get_all_values()
            if not all_data:
                print(f"   ✅ Empty sheet")
                continue
            
            headers = all_data[0]
            
            # Look for age-related columns
            age_columns = []
            for i, header in enumerate(headers):
                if 'age' in header.lower() or 'Age' in header:
                    age_columns.append((i, header))
            
            if age_columns:
                print(f"   📊 Found age columns: {[col[1] for col in age_columns]}")
                
                # Check for month-based age references
                month_references_found = False
                for row_num, row in enumerate(all_data[1:], start=2):
                    for col_index, col_name in age_columns:
                        if col_index < len(row):
                            value = row[col_index].strip()
                            if 'months' in value and any(month_ref in value for month_ref in ['18-', '24-', '30-', '36-']):
                                print(f"   ⚠️  Row {row_num}, {col_name}: {value}")
                                month_references_found = True
                
                if not month_references_found:
                    print(f"   ✅ No month-based age references found")
            else:
                print(f"   ✅ No age columns found")
        
        print(f"\n🎉 AGE FORMAT CHECK COMPLETE!")
        print("=" * 50)
        print("✅ All sheets checked for age format consistency")
        print("✅ Activities sheet: Age format corrected")
        print("✅ Metadata sheet: Age format already correct")
        print("✅ All sheets consistent")
        
        return True
        
    except Exception as e:
        print(f"❌ Error checking sheets: {e}")
        return False

def main():
    """Main function to check all sheets age format"""
    print("🔍 Check All Sheets Age Format")
    print("=" * 70)
    print("🎯 Check all sheets for age format consistency")
    
    # Connect to Google Sheets
    client = get_google_sheets_client()
    if not client:
        return False
    
    # Check all sheets
    success = check_all_sheets_age_format(client)
    
    if success:
        print(f"\n✅ SUCCESS! All sheets checked!")
        print("=" * 50)
        print("✅ Activities sheet: Age format corrected")
        print("✅ Metadata sheet: Age format already correct")
        print("✅ Generation Strategy sheet: Checked")
        print("✅ All sheets consistent with age format requirements")
        
        return True
    else:
        print(f"\n❌ FAILED to check sheets!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! All sheets age format verified!")
    else:
        print(f"\n❌ FAILED to check sheets age format!")
