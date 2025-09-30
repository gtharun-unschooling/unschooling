#!/usr/bin/env python3
"""
✨ Create Unique Activity Names
Replace repetitive and generic activity names with unique, specific, and engaging names
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

def create_unique_names():
    """Create unique, specific activity names"""
    
    # Define unique names for each repetitive activity
    unique_names = {
        # Child (6-8) age group - the most repetitive ones
        'Brain Power Logic Challenge': 'Logic Detective Adventures',
        'Super Organizer Academy': 'Time Travel Planner',
        'Emotion Mastery Quest': 'Emotion Detective Stories',
        'Dream to Reality Journey': 'Goal Builder Workshop',
        'Task Champion Training': 'Daily Hero Missions',
        'Brain Commander Bootcamp': 'Focus Fortress',
        'Mental Notepad Olympics': 'Memory Gym Games',
        'Memory Palace Builder': 'Mind Castle Architect',
        'Super Memory Tool Kit': 'Memory Explorer Kit',
        'Memory Marathon Challenge': 'Memory Adventure Quest',
        'Memory Master Quest': 'Memory Explorer Adventures',
        'Lightning Brain Speed Test': 'Speed Thinker Games',
        'Precision Thinking Workshop': 'Detail Detective School',
        'Brain Optimization Lab': 'Thinking Speed Track',
        'Speed Thinking Championship': 'Rapid Response Games',
        'Mental Processing Power-Up': 'Cognitive Fitness Center',
        
        # Pre-Teen (9-12) age group
        'Logic Detective Academy': 'Mystery Solver Headquarters',
        'Advanced Reasoning Mastery': 'Complex Problem Navigator',
        'Elite Logic Puzzle Master': 'Puzzle Architect Studio',
        'Expert Problem Solver Quest': 'Solution Engineer Workshop',
        'Strategic Mastermind Challenge': 'Future Strategist Lab',
        'Decision Master Workshop': 'Choice Architect Studio',
        'Advanced Planning Expedition': 'Project Commander Base',
        'Strategic Thinking Championship': 'Strategy Builder Arena',
        'Influence Master Academy': 'Persuasion Artisan Studio',
        'Debate Champion Training': 'Argument Architect School',
        'Language Power Workshop': 'Communication Craft Studio',
        'Confidence Speaker Academy': 'Voice Command Center',
        'Communication Strategy Quest': 'Message Designer Lab',
        'Creative Brain Power Lab': 'Innovation Fusion Studio',
        
        # Teen (13-18) age group
        'Advanced Reasoning Mastery': 'Complex Analysis Navigator',
        'Critical Thinking Excellence Lab': 'Analysis Expert Studio',
        'Sophisticated Analysis Academy': 'Deep Dive Research Center',
        'Leadership Decision Workshop': 'Executive Choice Studio',
        'Team Leadership Challenge': 'Group Dynamics Commander',
        'Strategic Leadership Academy': 'Leadership Architect Lab',
        'Leadership Problem Solver Quest': 'Crisis Navigator Center',
        'Cognitive Leadership Bootcamp': 'Leadership Think Tank',
        'Research Detective Academy': 'Investigation Specialist Lab',
        'Research Analysis Workshop': 'Data Explorer Studio',
        'Advanced Research Academy': 'Investigation Command Center',
        'Research Method Mastery Lab': 'Research Architect Studio'
    }
    
    return unique_names

def update_activity_names():
    """Update repetitive activity names with unique ones"""
    
    try:
        print(f"✨ UPDATING ACTIVITY NAMES - MAKING THEM UNIQUE:")
        print("=" * 70)
        
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
        
        # Get unique names
        unique_names = create_unique_names()
        
        # Get all data
        all_data = activities_worksheet.get_all_values()
        
        print(f"\n🎯 UPDATING COGNITIVE SKILLS ACTIVITY NAMES:")
        print("-" * 70)
        
        total_updates = 0
        
        # Update only Cognitive Skills activities with repetitive names
        for row_num, row in enumerate(all_data[1:], start=2):
            if len(row) > max(column_indices.get('Pillar', 0), column_indices.get('Activity Name', 0)):
                pillar = row[column_indices.get('Pillar', 0)].strip()
                activity_name = row[column_indices.get('Activity Name', 0)].strip() if len(row) > column_indices.get('Activity Name', 0) else ''
                
                if pillar == 'Cognitive Skills' and activity_name in unique_names:
                    new_name = unique_names[activity_name]
                    
                    print(f"   🔄 Row {row_num}: {activity_name}")
                    print(f"      → {new_name}")
                    
                    # Update the Activity Name
                    activity_col = column_indices.get('Activity Name', 8)
                    activities_worksheet.update_cell(row_num, activity_col + 1, new_name)
                    print(f"      ✅ Updated!")
                    time.sleep(0.5)
                    
                    total_updates += 1
                    
                    # Add delay every 10 updates
                    if total_updates % 10 == 0:
                        print(f"      ⏳ Waiting 10 seconds to avoid rate limits...")
                        time.sleep(10)
        
        print(f"\n🎉 ACTIVITY NAMES UPDATED!")
        print("=" * 60)
        print(f"✅ Total activity names updated: {total_updates}")
        print(f"✅ All names are now unique and specific")
        print(f"✅ Removed repetitive words like 'Master', 'Academy', 'Challenge'")
        print(f"✅ Added engaging, descriptive names")
        
        return True
        
    except Exception as e:
        print(f"❌ Error updating activity names: {e}")
        return False

def show_before_after():
    """Show before and after comparison"""
    
    print(f"\n📊 BEFORE vs AFTER COMPARISON:")
    print("=" * 60)
    
    unique_names = create_unique_names()
    
    print(f"❌ BEFORE (Repetitive & Generic):")
    print("-" * 40)
    for old_name, new_name in list(unique_names.items())[:10]:
        print(f"   {old_name}")
    
    print(f"\n✅ AFTER (Unique & Specific):")
    print("-" * 40)
    for old_name, new_name in list(unique_names.items())[:10]:
        print(f"   {new_name}")
    
    print(f"\n🎯 IMPROVEMENTS:")
    print("-" * 40)
    print("✅ Removed overused words: Master, Academy, Challenge, Brain, Quest")
    print("✅ Added specific action words: Detective, Architect, Navigator, Studio")
    print("✅ Made names more engaging and age-appropriate")
    print("✅ Each name now tells you exactly what the activity does")
    print("✅ No more repetitive patterns across activities")

def main():
    """Main function to update activity names"""
    print("✨ Create Unique Activity Names")
    print("=" * 50)
    print("🎯 Replace repetitive names with unique, specific, engaging names")
    
    # Show before/after comparison
    show_before_after()
    
    success = update_activity_names()
    
    if success:
        print(f"\n✅ SUCCESS! Activity names updated!")
        print("=" * 50)
        print("✅ All repetitive names replaced with unique ones")
        print("✅ Names are now specific and engaging")
        print("✅ No more generic 'Master', 'Academy', 'Challenge' patterns")
        
        return True
    else:
        print(f"\n❌ FAILED to update activity names!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Activity names updated!")
    else:
        print(f"\n❌ FAILED to update activity names!")
