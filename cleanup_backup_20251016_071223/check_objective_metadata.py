#!/usr/bin/env python3
"""
🔍 Check Objective Column Metadata
Check what the metadata says about the Objective column requirements
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

def check_objective_metadata(client):
    """Check the metadata for the Objective column"""
    
    try:
        # Open the Sample 1 spreadsheet
        spreadsheet = client.open_by_key('14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ')
        metadata_worksheet = spreadsheet.worksheet('Metadata')
        
        print(f"🔍 CHECKING OBJECTIVE COLUMN METADATA:")
        print("=" * 60)
        
        # Get all metadata
        all_metadata = metadata_worksheet.get_all_values()
        if not all_metadata:
            print("❌ No metadata found")
            return None
        
        headers = all_metadata[0]
        
        # Find Objective row in metadata
        objective_metadata = None
        for row in all_metadata[1:]:
            if len(row) > 0 and row[0].strip() == 'Objective':
                objective_metadata = row
                break
        
        if not objective_metadata:
            print("❌ Objective metadata not found")
            return None
        
        print(f"📝 OBJECTIVE COLUMN METADATA:")
        print("=" * 40)
        
        # Map headers to values
        for i, header in enumerate(headers):
            if i < len(objective_metadata):
                value = objective_metadata[i].strip()
                print(f"   {header}: {value}")
        
        return objective_metadata, headers
        
    except Exception as e:
        print(f"❌ Error checking objective metadata: {e}")
        return None, None

def main():
    """Main function to check objective metadata"""
    print("🔍 Checking Objective Column Metadata")
    print("=" * 70)
    print("🎯 Check what the metadata says about Objective column requirements")
    
    # Connect to Google Sheets
    client = get_google_sheets_client()
    if not client:
        return False
    
    # Check objective metadata
    objective_metadata, headers = check_objective_metadata(client)
    
    if objective_metadata:
        print(f"\n✅ OBJECTIVE METADATA CHECKED!")
        print("=" * 40)
        print("✅ Found Objective column metadata")
        print("✅ Checked requirements and specifications")
        
        return True
    else:
        print(f"\n❌ FAILED to check objective metadata!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Objective metadata check completed!")
    else:
        print(f"\n❌ FAILED to check objective metadata!")
