#!/usr/bin/env python3
"""
📋 Check Available Sheets to Find Metadata Sheet
Find the correct metadata sheet to update
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

def check_available_sheets(client):
    """Check all available sheets to find metadata sheet"""
    
    try:
        print("📋 Checking all available spreadsheets...")
        
        # Get all spreadsheets
        all_sheets = client.list_spreadsheet_files()
        
        print(f"\n📊 FOUND {len(all_sheets)} SPREADSHEETS:")
        print("=" * 50)
        
        for i, sheet in enumerate(all_sheets, 1):
            sheet_name = sheet.get('name', 'Unknown')
            sheet_id = sheet.get('id', 'Unknown')
            
            print(f"{i}. {sheet_name}")
            print(f"   ID: {sheet_id}")
            
            # Open spreadsheet to check worksheets
            try:
                spreadsheet = client.open_by_key(sheet_id)
                worksheets = spreadsheet.worksheets()
                
                print(f"   Worksheets:")
                for j, worksheet in enumerate(worksheets, 1):
                    worksheet_name = worksheet.title
                    print(f"      {j}. {worksheet_name}")
                
                print()
                
            except Exception as e:
                print(f"   Error accessing worksheets: {e}")
                print()
        
        # Look for metadata-related sheets
        print("🔍 LOOKING FOR METADATA SHEETS:")
        print("=" * 40)
        
        metadata_sheets = []
        for sheet in all_sheets:
            sheet_name = sheet.get('name', '').lower()
            if any(keyword in sheet_name for keyword in ['metadata', 'meta', 'structure', 'template', 'guidelines']):
                metadata_sheets.append(sheet)
                print(f"   📋 Potential metadata sheet: {sheet.get('name')}")
        
        if metadata_sheets:
            print(f"\n✅ Found {len(metadata_sheets)} potential metadata sheets")
            return metadata_sheets
        else:
            print(f"\n❌ No obvious metadata sheets found")
            print("   Looking for sheets with 'metadata', 'meta', 'structure', 'template', or 'guidelines' in the name")
            return []
        
    except Exception as e:
        print(f"❌ Error checking sheets: {e}")
        return []

def main():
    """Main function to check available sheets"""
    print("📋 Checking Available Sheets to Find Metadata Sheet")
    print("=" * 60)
    
    # Connect to Google Sheets
    client = get_google_sheets_client()
    if not client:
        return False
    
    # Check available sheets
    metadata_sheets = check_available_sheets(client)
    
    if metadata_sheets:
        print(f"\n✅ SUCCESS! Found potential metadata sheets!")
        return True
    else:
        print(f"\n❌ No metadata sheets found!")
        print("   Please specify which sheet contains the metadata structure")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Sheet check completed!")
    else:
        print(f"\n❌ FAILED to find metadata sheets!")
