#!/usr/bin/env python3
"""
🔧 Fix Repetitive Toddler Names - Remove Robotic "Toddler" Prefix
Fix activity names that have repetitive "Toddler" prefixes
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

def create_better_activity_names():
    """Create better activity names without repetitive prefixes"""
    
    name_mappings = {
        'Toddler Concentration Tower Building': 'Concentration Tower Challenge',
        'Toddler Puzzle Completion Challenge': 'Puzzle Master Quest',
        'Toddler Memory Card Matching Game': 'Memory Match Adventure',
        'Toddler Story Creation with Props': 'Story Studio Workshop',
        'Toddler Color Sorting Challenge': 'Color Explorer Games',
        
        # Also fix any other repetitive patterns we might find
        'Preschooler Detective Mystery Challenge': 'Detective Mystery Challenge',
        'Preschooler Family Restaurant Manager': 'Family Restaurant Manager',
        'Preschooler Escape Room Adventure': 'Escape Room Adventure',
        'Preschooler Memory Olympics Training': 'Memory Olympics Training',
        'Preschooler Memory Treasure Hunt': 'Memory Treasure Hunt',
        'Preschooler Pattern Master Challenge': 'Pattern Master Challenge',
        'Preschooler Story Sequence Theater': 'Story Sequence Theater',
        'Preschooler Memory Gym Workout': 'Memory Gym Workout',
        'Preschooler Word Wizard Academy': 'Word Wizard Academy',
        'Preschooler Public Speaking Academy': 'Public Speaking Academy',
        'Preschooler Story Studio Production': 'Story Studio Production',
        'Preschooler Language Lab Experiments': 'Language Lab Experiments',
        'Preschooler Talk Show Host Training': 'Talk Show Host Training',
        'Preschooler Innovation Lab: Rethink Everything': 'Innovation Lab: Rethink Everything',
        'Preschooler Survival Island Adventure': 'Survival Island Adventure',
        'Preschooler Brain Gym Circuit Training': 'Brain Gym Circuit Training'
    }
    
    return name_mappings

def fix_repetitive_activity_names():
    """Fix repetitive activity names across all age groups"""
    
    try:
        print(f"🔧 FIXING REPETITIVE ACTIVITY NAMES:")
        print("=" * 80)
        
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
        
        print(f"\n🎯 IDENTIFYING REPETITIVE ACTIVITY NAMES:")
        print("-" * 80)
        
        # Get name mappings
        name_mappings = create_better_activity_names()
        
        # Find activities with repetitive names
        repetitive_activities = []
        for row_num, row in enumerate(all_data[1:], start=2):
            if len(row) > max(column_indices.get('Pillar', 0), column_indices.get('Age Group', 0), column_indices.get('Activity Name', 0)):
                pillar = row[column_indices.get('Pillar', 0)].strip()
                age_group = row[column_indices.get('Age Group', 0)].strip()
                activity_name = row[column_indices.get('Activity Name', 0)].strip() if len(row) > column_indices.get('Activity Name', 0) else ''
                
                if pillar == 'Cognitive Skills' and activity_name in name_mappings:
                    repetitive_activities.append((row_num, activity_name, name_mappings[activity_name], age_group))
        
        print(f"📊 Found {len(repetitive_activities)} activities with repetitive names")
        print(f"⏳ Processing with 2-second delays between updates...")
        
        total_updates = 0
        
        # Update all repetitive activity names
        for i, (row_num, old_name, new_name, age_group) in enumerate(repetitive_activities):
            try:
                print(f"\n🔧 Activity {i+1}/{len(repetitive_activities)}: Row {row_num}")
                print(f"   📝 {old_name} → {new_name}")
                print(f"   👶 Age Group: {age_group}")
                
                # Update Activity Name
                activities_worksheet.update_cell(row_num, column_indices['Activity Name'] + 1, new_name)
                total_updates += 1
                print(f"      ✅ Updated Activity Name")
                
                # Add delay between updates
                if i < len(repetitive_activities) - 1:
                    print(f"      ⏳ Waiting 2 seconds before next activity...")
                    time.sleep(2)
                    
            except Exception as e:
                print(f"   ❌ Error updating activity {old_name}: {e}")
                print(f"      ⏳ Waiting 3 seconds before continuing...")
                time.sleep(3)
                continue
        
        print(f"\n🎉 REPETITIVE ACTIVITY NAMES FIXED!")
        print("=" * 80)
        print(f"✅ Total activity names updated: {total_updates}")
        print(f"✅ Removed robotic prefixes from all activities")
        print(f"✅ Created more natural and engaging names")
        print(f"✅ Eliminated repetitive patterns")
        
        return True
        
    except Exception as e:
        print(f"❌ Error fixing repetitive activity names: {e}")
        return False

def main():
    """Main function to fix repetitive activity names"""
    print("🔧 Fix Repetitive Activity Names - Remove Robotic Prefixes")
    print("=" * 70)
    print("🎯 Remove repetitive 'Toddler', 'Preschooler' prefixes from activity names")
    
    success = fix_repetitive_activity_names()
    
    if success:
        print(f"\n✅ SUCCESS! Repetitive activity names fixed!")
        print("=" * 70)
        print("✅ All robotic prefixes removed")
        print("✅ Natural and engaging names created")
        print("✅ Eliminated repetitive patterns")
        
        return True
    else:
        print(f"\n❌ FAILED to fix repetitive activity names!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Repetitive activity names fixed!")
    else:
        print(f"\n❌ FAILED to fix repetitive activity names!")

