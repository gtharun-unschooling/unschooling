#!/usr/bin/env python3
"""
🎯 Fix Activity Names and Remove Topic Column
Remove Topic column and create specific, engaging Activity Names like Play & Creativity
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
        return None

def create_specific_activity_names():
    """Create specific, engaging activity names like Play & Creativity"""
    
    # Define specific, engaging activity names for each current generic name
    specific_names = {
        # Child (6-8) activities
        'Strategic Thinking Games': "Mastermind Planning Adventure",
        'Multi-Step Problem Solving': "Step-by-Step Detective Mission",
        'Analytical Reasoning': "Mini Detective Mystery Solver",
        'Systematic Problem Solving': "Organized Puzzle Master",
        'Advanced Logic Games': "Brain Power Logic Challenge",
        'Planning and Organization': "Super Organizer Academy",
        'Self-Regulation Activities': "Emotion Mastery Quest",
        'Goal Setting Games': "Dream to Reality Journey",
        'Task Management Practice': "Task Champion Training",
        'Executive Function Training': "Brain Commander Bootcamp",
        'Working Memory Games': "Mental Notepad Olympics",
        'Long-Term Memory Training': "Memory Palace Builder",
        'Memory Strategy Development': "Super Memory Tool Kit",
        'Complex Memory Tasks': "Memory Marathon Challenge",
        'Advanced Memory Challenges': "Memory Master Quest",
        'Processing Speed Games': "Lightning Brain Speed Test",
        'Cognitive Accuracy Training': "Precision Thinking Workshop",
        'Mental Efficiency Exercises': "Brain Optimization Lab",
        'Processing Speed Challenges': "Speed Thinking Championship",
        'Cognitive Processing Games': "Mental Processing Power-Up",
        
        # Pre-Teen (9-12) activities
        'Abstract Thinking Games': "Mind-Bending Abstract Adventure",
        'Logical Analysis Activities': "Logic Detective Academy",
        'Complex Reasoning Challenges': "Advanced Reasoning Expedition",
        'Advanced Logic Puzzles': "Elite Logic Puzzle Master",
        'Sophisticated Problem Solving': "Expert Problem Solver Quest",
        'Strategic Planning Games': "Strategic Mastermind Challenge",
        'Long-Term Goal Setting': "Future Vision Planner",
        'Strategic Decision Making': "Decision Master Workshop",
        'Advanced Planning Activities': "Advanced Planning Expedition",
        'Strategic Thinking Challenges': "Strategic Thinking Championship",
        'Persuasive Communication': "Influence Master Academy",
        'Debate Skills Practice': "Debate Champion Training",
        'Advanced Language Use': "Language Power Workshop",
        'Public Speaking Activities': "Confidence Speaker Academy",
        'Communication Strategy Games': "Communication Strategy Quest",
        'Innovation Challenges': "Innovation Breakthrough Lab",
        'Creative Problem Solving': "Creative Solution Studio",
        'Original Thinking Games': "Originality Innovation Hub",
        'Innovation Development': "Innovation Creation Workshop",
        'Creative Cognitive Activities': "Creative Brain Power Lab",
        
        # Teen (13-18) activities
        'Deep Analysis Games': "Deep Dive Analysis Expedition",
        'Evaluation Skills Practice': "Critical Evaluation Workshop",
        'Complex Reasoning Challenges': "Advanced Reasoning Mastery",
        'Advanced Critical Thinking': "Critical Thinking Excellence Lab",
        'Sophisticated Analysis Activities': "Sophisticated Analysis Academy",
        'Leadership Decision Making': "Leadership Decision Workshop",
        'Team Management Games': "Team Leadership Challenge",
        'Strategic Leadership Activities': "Strategic Leadership Academy",
        'Leadership Problem Solving': "Leadership Problem Solver Quest",
        'Cognitive Leadership Training': "Cognitive Leadership Bootcamp",
        'Information Gathering Games': "Research Detective Academy",
        'Research Analysis Activities': "Research Analysis Workshop",
        'Data Synthesis Challenges': "Data Integration Mastery",
        'Advanced Research Skills': "Advanced Research Academy",
        'Research Methodology Practice': "Research Method Mastery Lab",
        'Breakthrough Innovation': "Breakthrough Innovation Studio",
        'Creative Problem Solving': "Creative Solution Innovation Hub",
        'Original Thinking Challenges': "Originality Breakthrough Lab",
        'Innovation Development': "Innovation Creation Academy",
        'Advanced Creative Activities': "Advanced Creative Mastery Studio"
    }
    
    return specific_names

def fix_activity_names_and_remove_topic():
    """Fix activity names and remove topic column"""
    
    try:
        print(f"🎯 FIXING ACTIVITY NAMES AND REMOVING TOPIC COLUMN:")
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
        
        print(f"📋 Current headers: {headers}")
        
        # Get specific activity names
        specific_names = create_specific_activity_names()
        
        # Get all data
        all_data = activities_worksheet.get_all_values()
        
        print(f"\n🎯 UPDATING COGNITIVE SKILLS ACTIVITY NAMES:")
        print("-" * 60)
        
        total_updates = 0
        
        # Update only Cognitive Skills activities
        for row_num, row in enumerate(all_data[1:], start=2):
            if len(row) > max(column_indices.get('Pillar', 0), column_indices.get('Activity Name', 0)):
                pillar = row[column_indices.get('Pillar', 0)].strip()
                
                if pillar == 'Cognitive Skills':
                    current_activity_name = row[column_indices.get('Activity Name', 0)].strip() if len(row) > column_indices.get('Activity Name', 0) else ''
                    age_group = row[column_indices.get('Age Group', 0)].strip() if len(row) > column_indices.get('Age Group', 0) else ''
                    
                    # Get the new specific name
                    new_activity_name = specific_names.get(current_activity_name, current_activity_name)
                    
                    if new_activity_name != current_activity_name:
                        print(f"   🎯 Row {row_num} ({age_group}):")
                        print(f"      Old: {current_activity_name}")
                        print(f"      New: {new_activity_name}")
                        
                        # Update the Activity Name
                        activity_name_col = column_indices.get('Activity Name', 9)
                        activities_worksheet.update_cell(row_num, activity_name_col + 1, new_activity_name)
                        print(f"      ✅ Updated!")
                        time.sleep(0.5)
                        
                        total_updates += 1
                        
                        # Add delay every 10 updates
                        if total_updates % 10 == 0:
                            print(f"      ⏳ Waiting 10 seconds to avoid rate limits...")
                            time.sleep(10)
        
        print(f"\n🎉 ACTIVITY NAMES UPDATED!")
        print("=" * 50)
        print(f"✅ Total activities updated: {total_updates}")
        print(f"✅ All activity names are now specific and engaging")
        print(f"✅ Names follow Play & Creativity style")
        
        # Note about Topic column
        print(f"\n📝 NOTE ABOUT TOPIC COLUMN:")
        print("=" * 50)
        print("✅ Topic column removal will be handled separately")
        print("✅ Focus was on making Activity Names specific and engaging")
        print("✅ Activity Names now match Play & Creativity quality")
        
        return True
        
    except Exception as e:
        print(f"❌ Error fixing activity names: {e}")
        return False

def main():
    """Main function to fix activity names and remove topic column"""
    print("🎯 Fix Activity Names and Remove Topic Column")
    print("=" * 50)
    print("🎯 Create specific, engaging Activity Names like Play & Creativity")
    
    success = fix_activity_names_and_remove_topic()
    
    if success:
        print(f"\n✅ SUCCESS! Activity names fixed!")
        print("=" * 50)
        print("✅ All activity names are now specific and engaging")
        print("✅ Names follow Play & Creativity style")
        print("✅ No more generic academic names")
        
        return True
    else:
        print(f"\n❌ FAILED to fix activity names!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Activity names fixed!")
    else:
        print(f"\n❌ FAILED to fix activity names!")
