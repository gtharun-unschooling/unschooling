#!/usr/bin/env python3
"""
🎨 Check Play & Creativity Activity Names
Check what good, specific activity names look like from Play & Creativity
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

def check_play_creativity_activity_names():
    """Check what good, specific activity names look like"""
    
    try:
        print(f"🎨 CHECKING PLAY & CREATIVITY ACTIVITY NAMES:")
        print("=" * 60)
        
        # Connect to Google Sheets
        client = get_google_sheets_client()
        if not client:
            return False
        
        # Open spreadsheet
        spreadsheet = client.open_by_key('14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ')
        activities_worksheet = spreadsheet.worksheet('Activities')
        
        # Get headers
        headers = activities_worksheet.row_values(1)
        column_indices = {}
        for i, header in enumerate(headers):
            column_indices[header] = i
        
        print(f"📋 Headers: {headers}")
        
        # Get all data
        all_data = activities_worksheet.get_all_values()
        
        # Find Play & Creativity activities
        print(f"\n🎨 PLAY & CREATIVITY ACTIVITY NAMES (Good Examples):")
        print("-" * 60)
        
        play_creativity_count = 0
        for i, row in enumerate(all_data[1:], start=2):
            if len(row) > 1 and row[1] == 'Play & Creativity':
                play_creativity_count += 1
                age_group = row[2] if len(row) > 2 else 'Unknown'
                topic = row[8] if len(row) > 8 else 'Unknown'
                activity_name = row[9] if len(row) > 9 else 'Unknown'
                
                if play_creativity_count <= 15:  # Show first 15
                    print(f"📋 Row {i}: {age_group}")
                    print(f"   Topic: {topic}")
                    print(f"   Activity Name: {activity_name}")
                    print()
        
        print(f"📊 Total Play & Creativity activities: {play_creativity_count}")
        
        # Now show current Cognitive Skills activity names (the generic ones)
        print(f"\n🧠 CURRENT COGNITIVE SKILLS ACTIVITY NAMES (Generic - Need Fixing):")
        print("-" * 60)
        
        cognitive_count = 0
        for i, row in enumerate(all_data[1:], start=2):
            if len(row) > 1 and row[1] == 'Cognitive Skills':
                cognitive_count += 1
                age_group = row[2] if len(row) > 2 else 'Unknown'
                topic = row[8] if len(row) > 8 else 'Unknown'
                activity_name = row[9] if len(row) > 9 else 'Unknown'
                
                if cognitive_count <= 15:  # Show first 15
                    print(f"📋 Row {i}: {age_group}")
                    print(f"   Topic: {topic}")
                    print(f"   Activity Name: {activity_name}")
                    print()
        
        print(f"📊 Total Cognitive Skills activities: {cognitive_count}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error checking activity names: {e}")
        return False

def main():
    """Main function to check activity names"""
    print("🎨 Check Play & Creativity Activity Names")
    print("=" * 50)
    print("🎯 See what good, specific activity names look like")
    
    success = check_play_creativity_activity_names()
    
    if success:
        print(f"\n✅ SUCCESS! Activity names checked!")
        return True
    else:
        print(f"\n❌ FAILED to check activity names!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Activity names checked!")
    else:
        print(f"\n❌ FAILED to check activity names!")
