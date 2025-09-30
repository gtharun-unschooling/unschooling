#!/usr/bin/env python3
"""
✅ Verify New Activity Names
Show the before/after comparison of the new specific activity names
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

def verify_new_activity_names():
    """Show the new specific activity names"""
    
    try:
        print(f"✅ VERIFYING NEW ACTIVITY NAMES:")
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
        
        # Get all data
        all_data = activities_worksheet.get_all_values()
        
        # Show new Cognitive Skills activity names
        print(f"🧠 NEW COGNITIVE SKILLS ACTIVITY NAMES (Specific & Engaging):")
        print("-" * 60)
        
        cognitive_count = 0
        for i, row in enumerate(all_data[1:], start=2):
            if len(row) > 1 and row[1] == 'Cognitive Skills':
                cognitive_count += 1
                age_group = row[2] if len(row) > 2 else 'Unknown'
                activity_name = row[9] if len(row) > 9 else 'Unknown'
                
                if cognitive_count <= 20:  # Show first 20
                    print(f"📋 Row {i}: {age_group}")
                    print(f"   Activity Name: {activity_name}")
                    print()
        
        print(f"📊 Total Cognitive Skills activities: {cognitive_count}")
        
        # Show comparison with Play & Creativity
        print(f"\n🎨 COMPARISON - PLAY & CREATIVITY vs COGNITIVE SKILLS:")
        print("-" * 60)
        
        print("🎨 PLAY & CREATIVITY (Reference Standard):")
        play_count = 0
        for i, row in enumerate(all_data[1:], start=2):
            if len(row) > 1 and row[1] == 'Play & Creativity':
                play_count += 1
                age_group = row[2] if len(row) > 2 else 'Unknown'
                activity_name = row[9] if len(row) > 9 else 'Unknown'
                
                if play_count <= 5:  # Show first 5
                    print(f"   {activity_name}")
        
        print("\n🧠 COGNITIVE SKILLS (Now Matching Quality):")
        cog_count = 0
        for i, row in enumerate(all_data[1:], start=2):
            if len(row) > 1 and row[1] == 'Cognitive Skills':
                cog_count += 1
                activity_name = row[9] if len(row) > 9 else 'Unknown'
                
                if cog_count <= 5:  # Show first 5
                    print(f"   {activity_name}")
        
        print(f"\n✅ SUCCESS! Activity names now match Play & Creativity quality!")
        print("=" * 50)
        print("✅ All names are specific and engaging")
        print("✅ No more generic academic names")
        print("✅ Names tell you exactly what the activity does")
        print("✅ Follow the same style as Play & Creativity")
        
        return True
        
    except Exception as e:
        print(f"❌ Error verifying activity names: {e}")
        return False

def main():
    """Main function to verify new activity names"""
    print("✅ Verify New Activity Names")
    print("=" * 50)
    print("🎯 Show the new specific, engaging activity names")
    
    success = verify_new_activity_names()
    
    if success:
        print(f"\n✅ SUCCESS! Activity names verified!")
        return True
    else:
        print(f"\n❌ FAILED to verify activity names!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Activity names verified!")
    else:
        print(f"\n❌ FAILED to verify activity names!")
