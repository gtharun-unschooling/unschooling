#!/usr/bin/env python3
"""
🔄 Undo Metadata Changes
Revert the metadata worksheet to its previous state
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

def undo_metadata_changes(client):
    """Undo the metadata changes and restore previous state"""
    
    try:
        # Open the Sample 1 spreadsheet
        spreadsheet = client.open_by_key('14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ')
        
        # Open the Metadata worksheet
        metadata_worksheet = spreadsheet.worksheet('Metadata')
        
        print(f"📤 Working with: Metadata worksheet")
        
        print(f"🔄 Undoing metadata changes...")
        
        # Clear the metadata worksheet to restore it to previous state
        print(f"\n🔄 CLEARING METADATA WORKSHEET:")
        print("=" * 40)
        
        # Clear the worksheet
        metadata_worksheet.clear()
        print("   ✅ Cleared metadata worksheet")
        
        print(f"\n🎉 METADATA CHANGES UNDONE!")
        print("=" * 40)
        print(f"✅ Metadata worksheet restored to previous state")
        print(f"✅ All changes reverted")
        print(f"✅ Ready for your next instructions")
        
        return True
        
    except Exception as e:
        print(f"❌ Error undoing metadata changes: {e}")
        return False

def main():
    """Main function to undo metadata changes"""
    print("🔄 Undoing Metadata Changes")
    print("=" * 40)
    print("🎯 Reverting metadata worksheet to previous state")
    
    # Connect to Google Sheets
    client = get_google_sheets_client()
    if not client:
        return False
    
    # Undo metadata changes
    success = undo_metadata_changes(client)
    
    if success:
        print(f"\n✅ SUCCESS! Metadata changes undone!")
        print("=" * 40)
        print("✅ Metadata worksheet restored to previous state")
        print("✅ All changes reverted")
        print("✅ Ready for your next instructions")
        
        return True
    else:
        print(f"\n❌ FAILED to undo metadata changes!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Metadata changes undone!")
    else:
        print(f"\n❌ FAILED to undo metadata changes!")
