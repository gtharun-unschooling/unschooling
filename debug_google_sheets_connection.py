#!/usr/bin/env python3
"""
🔍 Debug Google Sheets Connection
Check what's wrong with the Google Sheets connection and updates
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

def debug_google_sheets():
    """Debug the Google Sheets connection and data"""
    
    try:
        print(f"🔍 DEBUGGING GOOGLE SHEETS CONNECTION:")
        print("=" * 60)
        
        # Connect to Google Sheets
        client = get_google_sheets_client()
        if not client:
            print("❌ Failed to connect to Google Sheets")
            return
        
        print("✅ Successfully connected to Google Sheets")
        
        # Try to open the spreadsheet
        spreadsheet_id = '14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ'
        print(f"🔍 Trying to open spreadsheet: {spreadsheet_id}")
        
        try:
            spreadsheet = client.open_by_key(spreadsheet_id)
            print("✅ Successfully opened spreadsheet")
            print(f"📊 Spreadsheet title: {spreadsheet.title}")
            
            # List all worksheets
            worksheets = spreadsheet.worksheets()
            print(f"\n📋 Available worksheets:")
            for i, worksheet in enumerate(worksheets):
                print(f"   {i+1}. {worksheet.title} (ID: {worksheet.id})")
            
            # Try to access the Activities worksheet
            try:
                activities_worksheet = spreadsheet.worksheet('Activities')
                print(f"\n✅ Found 'Activities' worksheet")
                print(f"📊 Worksheet has {activities_worksheet.row_count} rows and {activities_worksheet.col_count} columns")
                
                # Get a sample of data
                print(f"\n🔍 Sample data from Activities worksheet:")
                sample_data = activities_worksheet.get_all_values()
                if sample_data:
                    print(f"📊 Total rows: {len(sample_data)}")
                    if len(sample_data) > 0:
                        print(f"📋 Headers: {sample_data[0][:10]}...")  # First 10 columns
                        print(f"📋 Sample row 2: {sample_data[1][:5]}...")  # First 5 columns of row 2
                        
                        # Check for Cognitive Skills activities
                        cognitive_count = 0
                        for row in sample_data[1:]:  # Skip header
                            if len(row) > 1 and row[1] == 'Cognitive Skills':  # Assuming pillar is column 1
                                cognitive_count += 1
                        
                        print(f"📊 Found {cognitive_count} Cognitive Skills activities")
                        
                        # Show a few Cognitive Skills activities
                        print(f"\n🎯 Sample Cognitive Skills activities:")
                        shown = 0
                        for i, row in enumerate(sample_data[1:], start=2):
                            if len(row) > 2 and row[1] == 'Cognitive Skills' and shown < 3:
                                age_group = row[2] if len(row) > 2 else 'Unknown'
                                activity_name = row[9] if len(row) > 9 else 'Unknown'  # Assuming activity name is column 9
                                print(f"   Row {i}: {age_group} - {activity_name}")
                                shown += 1
                else:
                    print("❌ No data found in Activities worksheet")
                    
            except Exception as e:
                print(f"❌ Error accessing 'Activities' worksheet: {e}")
                
        except Exception as e:
            print(f"❌ Error opening spreadsheet: {e}")
            print(f"🔍 This might be the issue! Check if:")
            print(f"   1. The spreadsheet ID is correct")
            print(f"   2. The service account has access to this spreadsheet")
            print(f"   3. The spreadsheet exists and is accessible")
        
    except Exception as e:
        print(f"❌ General error: {e}")

def main():
    """Main function to debug Google Sheets"""
    print("🔍 Debug Google Sheets Connection")
    print("=" * 50)
    
    debug_google_sheets()

if __name__ == "__main__":
    main()
