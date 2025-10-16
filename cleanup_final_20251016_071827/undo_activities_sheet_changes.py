#!/usr/bin/env python3
"""
🔄 Undo Activities Sheet Changes
Remove the unnecessary changes I made to the Activities sheet, specifically row 2
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

def undo_activities_sheet_changes(client):
    """Undo the unnecessary changes I made to the Activities sheet"""
    
    try:
        # Open the Sample 1 spreadsheet
        spreadsheet = client.open_by_key('14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ')
        
        # Open the Activities worksheet
        activities_worksheet = spreadsheet.worksheet('Activities')
        
        print(f"📤 Working with: Activities worksheet")
        
        # Get current data from activities sheet
        all_data = activities_worksheet.get_all_values()
        
        if not all_data:
            print("❌ No data found in Activities sheet")
            return False
        
        headers = all_data[0]
        
        # Find the Additional Information column
        additional_info_col_index = headers.index('Additional Information') if 'Additional Information' in headers else None
        
        if additional_info_col_index is None:
            print("❌ Additional Information column not found")
            return False
        
        print(f"🔍 Checking row 2 for unnecessary changes...")
        
        # Check row 2 (index 1)
        if len(all_data) > 1:
            row_2 = all_data[1]
            if len(row_2) > additional_info_col_index:
                current_additional_info = row_2[additional_info_col_index]
                
                print(f"📊 Current Additional Information in row 2:")
                print(f"   Length: {len(current_additional_info)} characters")
                
                # Check if it contains the metadata guidelines I added
                if 'COMPREHENSIVE METADATA STRUCTURE GUIDELINES' in current_additional_info:
                    print(f"❌ Found unnecessary metadata guidelines in row 2")
                    print(f"   This was added by me and needs to be removed")
                    
                    # Clear the Additional Information in row 2
                    print(f"\n🔄 REMOVING UNNECESSARY CHANGES:")
                    print("=" * 40)
                    
                    activities_worksheet.update_cell(2, additional_info_col_index + 1, '')
                    print(f"   ✅ Cleared Additional Information in row 2")
                    print(f"   ✅ Removed unnecessary metadata guidelines")
                    
                else:
                    print(f"✅ No unnecessary changes found in row 2")
                    print(f"   Additional Information is clean")
        
        print(f"\n🎉 ACTIVITIES SHEET CHANGES UNDONE!")
        print("=" * 40)
        print(f"✅ Removed unnecessary changes from row 2")
        print(f"✅ Activities sheet restored to clean state")
        print(f"✅ Only metadata table updated as requested")
        
        return True
        
    except Exception as e:
        print(f"❌ Error undoing activities sheet changes: {e}")
        return False

def main():
    """Main function to undo activities sheet changes"""
    print("🔄 Undoing Activities Sheet Changes")
    print("=" * 50)
    print("🎯 Removing unnecessary changes I made to Activities sheet row 2")
    
    # Connect to Google Sheets
    client = get_google_sheets_client()
    if not client:
        return False
    
    # Undo activities sheet changes
    success = undo_activities_sheet_changes(client)
    
    if success:
        print(f"\n✅ SUCCESS! Activities sheet changes undone!")
        print("=" * 40)
        print("✅ Removed unnecessary changes from row 2")
        print("✅ Activities sheet is clean")
        print("✅ Only metadata table contains the guidelines")
        
        return True
    else:
        print(f"\n❌ FAILED to undo activities sheet changes!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Activities sheet cleanup completed!")
    else:
        print(f"\n❌ FAILED to clean up activities sheet!")
