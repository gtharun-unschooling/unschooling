#!/usr/bin/env python3
"""
🔍 Check Google Sheets Column Names
Verify exact column names in Google Sheets
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

def check_column_names(client):
    """Check exact column names in Google Sheets"""
    
    try:
        # Find the spreadsheet
        all_sheets = client.list_spreadsheet_files()
        target_sheet = None
        
        for sheet in all_sheets:
            title = sheet.get('name', sheet.get('title', '')).lower()
            if 'sample' in title or 'essential' in title:
                target_sheet = sheet
                break
        
        if not target_sheet:
            print("❌ No suitable spreadsheet found")
            return False
        
        # Open the spreadsheet
        spreadsheet = client.open_by_key(target_sheet['id'])
        worksheet = spreadsheet.get_worksheet(0)
        
        print(f"📤 Working with: {target_sheet.get('name', 'Unknown')}")
        
        # Get headers
        headers = worksheet.row_values(1)
        
        print(f"\n📋 EXACT COLUMN NAMES:")
        print("=" * 40)
        for i, header in enumerate(headers):
            print(f"   {i:2d}. '{header}'")
        
        # Find relevant columns
        relevant_columns = {}
        for i, header in enumerate(headers):
            if 'activity' in header.lower() and 'id' in header.lower():
                relevant_columns['activity_id'] = (i, header)
            elif 'category' in header.lower():
                relevant_columns['category'] = (i, header)
        
        print(f"\n🎯 RELEVANT COLUMNS:")
        print("=" * 30)
        for key, (index, name) in relevant_columns.items():
            print(f"   {key}: '{name}' (index {index})")
        
        return relevant_columns
        
    except Exception as e:
        print(f"❌ Error checking columns: {e}")
        return None

def main():
    """Main function to check column names"""
    print("🔍 Checking Google Sheets Column Names")
    print("=" * 50)
    
    # Connect to Google Sheets
    client = get_google_sheets_client()
    if not client:
        return False
    
    # Check column names
    columns = check_column_names(client)
    
    if columns:
        print(f"\n✅ SUCCESS! Column names identified!")
        return True
    else:
        print(f"\n❌ FAILED to identify columns!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Column check completed!")
    else:
        print(f"\n❌ FAILED to check columns!")
