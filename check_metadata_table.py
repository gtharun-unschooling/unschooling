#!/usr/bin/env python3
"""
📋 Check Metadata Table
Check what was in the metadata table before I cleared it
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

def check_metadata_table(client):
    """Check the current state of metadata table"""
    
    try:
        # Open the Sample 1 spreadsheet
        spreadsheet = client.open_by_key('14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ')
        
        # Open the Metadata worksheet
        metadata_worksheet = spreadsheet.worksheet('Metadata')
        
        print(f"📤 Working with: Metadata worksheet")
        
        # Get current data from metadata sheet
        try:
            existing_data = metadata_worksheet.get_all_values()
            print(f"📊 Current metadata sheet has {len(existing_data)} rows")
            
            if existing_data:
                print(f"\n📋 CURRENT METADATA TABLE CONTENT:")
                print("=" * 50)
                
                for i, row in enumerate(existing_data):
                    if i < 10:  # Show first 10 rows
                        print(f"Row {i+1}: {row}")
                    elif i == 10:
                        print(f"... and {len(existing_data) - 10} more rows")
                        break
            else:
                print(f"\n❌ METADATA TABLE IS EMPTY!")
                print("   I mistakenly cleared it completely")
                print("   This is not what you had previously")
                
        except Exception as e:
            print(f"❌ Error reading metadata sheet: {e}")
            existing_data = []
        
        # Also check if there's any backup or version history we can reference
        print(f"\n🔍 CHECKING FOR BACKUP INFORMATION:")
        print("=" * 40)
        
        # Check the Activities worksheet to see if there are any clues about metadata structure
        activities_worksheet = spreadsheet.worksheet('Activities')
        activities_data = activities_worksheet.get_all_values()
        
        if activities_data:
            headers = activities_data[0]
            print(f"📊 Activities sheet headers (which might indicate metadata structure):")
            for i, header in enumerate(headers):
                print(f"   {i+1}. {header}")
        
        print(f"\n❌ ISSUE IDENTIFIED:")
        print("   I mistakenly cleared the metadata worksheet completely")
        print("   This removed whatever structure you had previously")
        print("   I need to restore the original metadata structure")
        
        return existing_data
        
    except Exception as e:
        print(f"❌ Error checking metadata table: {e}")
        return []

def main():
    """Main function to check metadata table"""
    print("📋 Checking Metadata Table")
    print("=" * 40)
    print("🔍 Checking what was in the metadata table before I cleared it")
    
    # Connect to Google Sheets
    client = get_google_sheets_client()
    if not client:
        return False
    
    # Check metadata table
    current_data = check_metadata_table(client)
    
    if current_data:
        print(f"\n✅ Found existing metadata content!")
        return True
    else:
        print(f"\n❌ Metadata table is empty!")
        print("   I need to restore the original structure")
        print("   Please tell me what the metadata table should contain")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Metadata table check completed!")
    else:
        print(f"\n❌ FAILED to check metadata table!")
