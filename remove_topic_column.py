#!/usr/bin/env python3
"""
🗑️ Remove Topic Column
Remove the entire Topic column from the Activities sheet
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
        return client
    except Exception as e:
        print(f"❌ Error connecting to Google Sheets: {e}")
        return False

def remove_topic_column():
    """Remove the Topic column from the Activities sheet"""
    
    try:
        print(f"🗑️ REMOVING TOPIC COLUMN:")
        print("=" * 50)
        
        # Connect to Google Sheets
        client = get_google_sheets_client()
        if not client:
            return False
        
        # Open spreadsheet
        spreadsheet = client.open_by_key('14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ')
        activities_worksheet = spreadsheet.worksheet('Activities')
        
        # Get headers to find Topic column
        headers = activities_worksheet.row_values(1)
        
        print(f"📋 Current headers: {headers}")
        print()
        
        # Find Topic column index
        topic_column_index = None
        for i, header in enumerate(headers):
            if header.lower() == 'topic':
                topic_column_index = i
                break
        
        if topic_column_index is None:
            print(f"❌ Topic column not found!")
            print(f"Available columns: {headers}")
            return False
        
        print(f"📍 Found Topic column at index: {topic_column_index}")
        print(f"📍 Topic column header: '{headers[topic_column_index]}'")
        
        # Get the total number of columns
        total_cols = len(headers)
        print(f"📍 Total columns before removal: {total_cols}")
        
        # Delete the Topic column
        print(f"🗑️ Deleting Topic column...")
        activities_worksheet.delete_columns(topic_column_index + 1)  # +1 because gspread uses 1-based indexing
        
        print(f"✅ Topic column deleted!")
        
        # Wait a moment for the change to propagate
        time.sleep(2)
        
        # Get updated headers to confirm
        updated_headers = activities_worksheet.row_values(1)
        print(f"📋 Updated headers: {updated_headers}")
        print(f"📍 Total columns after removal: {len(updated_headers)}")
        
        print(f"\n🎉 TOPIC COLUMN REMOVED SUCCESSFULLY!")
        print("=" * 50)
        print(f"✅ Topic column deleted from Activities sheet")
        print(f"✅ Column count reduced from {total_cols} to {len(updated_headers)}")
        print(f"✅ All data shifted left to fill the gap")
        
        return True
        
    except Exception as e:
        print(f"❌ Error removing Topic column: {e}")
        return False

def main():
    """Main function to remove Topic column"""
    print("🗑️ Remove Topic Column")
    print("=" * 50)
    print("🎯 Remove the entire Topic column from Activities sheet")
    
    success = remove_topic_column()
    
    if success:
        print(f"\n✅ SUCCESS! Topic column removed!")
        print("=" * 50)
        print("✅ Topic column completely removed")
        print("✅ All data automatically shifted")
        print("✅ No data loss - just column removal")
        
        return True
    else:
        print(f"\n❌ FAILED to remove Topic column!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Topic column removed!")
    else:
        print(f"\n❌ FAILED to remove Topic column!")
