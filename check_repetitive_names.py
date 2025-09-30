#!/usr/bin/env python3
"""
🔍 Check Repetitive Activity Names
Check for repetitive and generic activity names in Cognitive Skills
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

def check_repetitive_names():
    """Check for repetitive activity names"""
    
    try:
        print(f"🔍 CHECKING REPETITIVE ACTIVITY NAMES:")
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
        
        print(f"🎯 COGNITIVE SKILLS ACTIVITY NAMES:")
        print("-" * 60)
        
        # Collect all Cognitive Skills activity names
        cognitive_activities = []
        for row_num, row in enumerate(all_data[1:], start=2):
            if len(row) > max(column_indices.get('Pillar', 0), column_indices.get('Activity Name', 0)):
                pillar = row[column_indices.get('Pillar', 0)].strip()
                if pillar == 'Cognitive Skills':
                    activity_name = row[column_indices.get('Activity Name', 0)].strip() if len(row) > column_indices.get('Activity Name', 0) else ''
                    age_group = row[column_indices.get('Age Group', 0)].strip() if len(row) > column_indices.get('Age Group', 0) else ''
                    if activity_name:
                        cognitive_activities.append((activity_name, age_group, row_num))
        
        # Group by age group
        age_groups = {}
        for activity_name, age_group, row_num in cognitive_activities:
            if age_group not in age_groups:
                age_groups[age_group] = []
            age_groups[age_group].append((activity_name, row_num))
        
        # Display activities by age group
        for age_group, activities in age_groups.items():
            print(f"\n📋 {age_group}:")
            print("-" * 40)
            for activity_name, row_num in activities:
                print(f"   Row {row_num}: {activity_name}")
        
        # Check for repetitive patterns
        print(f"\n🔍 REPETITIVE PATTERN ANALYSIS:")
        print("=" * 50)
        
        # Common repetitive words
        repetitive_words = ['Brain', 'Power', 'Super', 'Master', 'Academy', 'Quest', 'Training', 'Bootcamp', 'Challenge', 'Olympics', 'Tool Kit', 'Marathon']
        
        repetitive_count = {}
        for word in repetitive_words:
            count = sum(1 for activity_name, _, _ in cognitive_activities if word in activity_name)
            if count > 1:
                repetitive_count[word] = count
        
        print(f"📊 Most overused words:")
        for word, count in sorted(repetitive_count.items(), key=lambda x: x[1], reverse=True):
            print(f"   '{word}': {count} times")
        
        # Find activities with repetitive names
        print(f"\n🚨 ACTIVITIES WITH REPETITIVE NAMES:")
        print("-" * 50)
        
        repetitive_activities = [
            'Brain Power Logic Challenge',
            'Super Organizer Academy', 
            'Emotion Mastery Quest',
            'Dream to Reality Journey',
            'Task Champion Training',
            'Brain Commander Bootcamp',
            'Mental Notepad Olympics',
            'Memory Palace Builder',
            'Super Memory Tool Kit',
            'Memory Marathon Challenge'
        ]
        
        for activity_name, _, row_num in cognitive_activities:
            if activity_name in repetitive_activities:
                print(f"   Row {row_num}: {activity_name}")
        
        print(f"\n💡 SUGGESTIONS FOR UNIQUE NAMES:")
        print("-" * 50)
        print("Instead of generic 'Brain Power' → specific cognitive skill")
        print("Instead of 'Super' → descriptive action words")
        print("Instead of 'Academy/Quest/Training' → engaging activity names")
        print("Instead of 'Master/Challenge' → specific outcomes")
        print("Instead of 'Olympics/Marathon' → fun, age-appropriate names")
        
        return True
        
    except Exception as e:
        print(f"❌ Error checking repetitive names: {e}")
        return False

def main():
    """Main function to check repetitive names"""
    print("🔍 Check Repetitive Activity Names")
    print("=" * 50)
    print("🎯 Identify repetitive and generic activity names")
    
    success = check_repetitive_names()
    
    if success:
        print(f"\n✅ SUCCESS! Repetitive names identified!")
        return True
    else:
        print(f"\n❌ FAILED to check repetitive names!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Repetitive names identified!")
    else:
        print(f"\n❌ FAILED to check repetitive names!")
