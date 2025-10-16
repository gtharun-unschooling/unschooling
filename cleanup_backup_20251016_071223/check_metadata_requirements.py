#!/usr/bin/env python3
"""
📋 Check Metadata Requirements
Check the metadata requirements for each column to understand what's needed
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
        return client
    except Exception as e:
        print(f"❌ Error connecting to Google Sheets: {e}")
        return None

def check_metadata_requirements():
    """Check the metadata requirements for each column"""
    
    try:
        print(f"📋 CHECKING METADATA REQUIREMENTS:")
        print("=" * 60)
        
        # Connect to Google Sheets
        client = get_google_sheets_client()
        if not client:
            return False
        
        # Open spreadsheet
        spreadsheet = client.open_by_key('14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ')
        
        # Check Metadata worksheet
        try:
            metadata_worksheet = spreadsheet.worksheet('Metadata')
            print("✅ Found Metadata worksheet")
            
            # Get all metadata
            metadata_data = metadata_worksheet.get_all_values()
            print(f"📊 Metadata has {len(metadata_data)} rows")
            
            if len(metadata_data) > 1:
                headers = metadata_data[0]
                print(f"📋 Metadata headers: {headers}")
                
                # Show metadata for key columns
                key_columns = ['Objective', 'Explanation', 'Materials', 'Steps', 'Skills', 'Hashtags', 'Age']
                
                for column_name in key_columns:
                    print(f"\n🔍 METADATA FOR '{column_name}':")
                    print("-" * 40)
                    
                    # Find row for this column
                    for row in metadata_data[1:]:
                        if len(row) > 0 and row[0] == column_name:
                            print(f"Purpose: {row[1] if len(row) > 1 else 'Not specified'}")
                            print(f"Format: {row[2] if len(row) > 2 else 'Not specified'}")
                            print(f"Requirements: {row[3] if len(row) > 3 else 'Not specified'}")
                            print(f"Examples: {row[4] if len(row) > 4 else 'Not specified'}")
                            print(f"Validation Rules: {row[5] if len(row) > 5 else 'Not specified'}")
                            break
                    else:
                        print(f"❌ No metadata found for '{column_name}'")
            else:
                print("❌ Metadata worksheet is empty")
                
        except Exception as e:
            print(f"❌ Error accessing Metadata worksheet: {e}")
        
        # Also check Generation Strategy worksheet
        try:
            strategy_worksheet = spreadsheet.worksheet('Generation Strategy')
            print(f"\n✅ Found Generation Strategy worksheet")
            
            # Get strategy data
            strategy_data = strategy_worksheet.get_all_values()
            print(f"📊 Generation Strategy has {len(strategy_data)} rows")
            
            if len(strategy_data) > 1:
                print(f"\n🎯 GENERATION STRATEGY REQUIREMENTS:")
                print("-" * 40)
                for i, row in enumerate(strategy_data[1:], 1):
                    if len(row) > 0:
                        print(f"{i}. {row[0]}")
            
        except Exception as e:
            print(f"❌ Error accessing Generation Strategy worksheet: {e}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error checking metadata: {e}")
        return False

def main():
    """Main function to check metadata requirements"""
    print("📋 Check Metadata Requirements")
    print("=" * 50)
    print("🎯 Check what the metadata requires for each column")
    
    success = check_metadata_requirements()
    
    if success:
        print(f"\n✅ SUCCESS! Metadata requirements checked!")
        return True
    else:
        print(f"\n❌ FAILED to check metadata!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Metadata requirements checked!")
    else:
        print(f"\n❌ FAILED to check metadata!")
