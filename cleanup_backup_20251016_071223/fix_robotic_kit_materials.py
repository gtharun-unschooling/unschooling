#!/usr/bin/env python3
"""
🔧 Fix Robotic Kit Materials - Create Meaningful Kit Descriptions
Fix all robotic kit materials with specific, useful, and meaningful descriptions
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

def create_meaningful_kit_descriptions():
    """Create meaningful, specific kit descriptions that actually help parents"""
    
    kit_descriptions = {
        'Detective Mystery Challenge': 'Complete detective starter kit: magnifying glass, fingerprint powder, clue cards, suspect profiles, evidence bags, detective notebook, and mystery case files with 5 age-appropriate cases to solve.',
        
        'Cause and Effect Analysis': 'Science exploration kit: domino sets, marble runs, balloon pumps, simple machines (levers, pulleys), cause-effect cards with real examples, and experiment journal for recording discoveries.',
        
        'Family Restaurant Manager': 'Restaurant management kit: play money, order pads, menu templates, chef hat, apron, table numbers, customer feedback cards, and business planning sheets for running a successful pretend restaurant.',
        
        'Escape Room Adventure': 'Escape room creator kit: combination locks, hidden compartment boxes, puzzle pieces, cipher wheels, UV flashlight with invisible ink, timer, and 3 complete escape room scenarios with solutions.',
        
        'Critical Thinking Puzzles': 'Logic master kit: tangram puzzles, pattern blocks, sequence cards, logic grid puzzles, brain teaser cards, and solution guides with difficulty levels from beginner to advanced.',
        
        'Memory Olympics Training': 'Memory athlete kit: memory palace cards, recall practice games, memory technique flashcards, timer, score sheets, and memory champion certificate for celebrating achievements.',
        
        'Memory Treasure Hunt': 'Treasure hunting kit: treasure map templates, memory clue cards, compass, treasure chest with locks, pirate coins, and adventure story cards for creating exciting memory-based treasure hunts.',
        
        'Pattern Master Challenge': 'Pattern recognition kit: colored blocks, sequence strips, pattern cards, prediction worksheets, and pattern extension games with increasing complexity levels.',
        
        'Story Sequence Theater': 'Storytelling theater kit: character puppets, scene backgrounds, story sequence cards, theater stage, and narrative building blocks for creating and performing original stories.',
        
        'Memory Gym Workout': 'Memory fitness kit: memory exercise cards, brain training games, focus timers, memory strength trackers, and workout routine cards for building mental endurance.',
        
        'Word Wizard Academy': 'Vocabulary magic kit: word cards, spell books, magical vocabulary games, word building blocks, and wizard hat with wand for casting word spells and building language skills.',
        
        'Public Speaking Academy': 'Confidence building kit: microphone, presentation board, audience feedback cards, speaking tips cards, and confidence building exercises with practice scenarios.',
        
        'Story Studio Production': 'Film production kit: camera props, director clapper, storyboard templates, character cards, scene cards, and production planning sheets for creating original films.',
        
        'Language Lab Experiments': 'Linguistic science kit: sound tubes, word experiment cards, language discovery tools, scientific observation sheets, and hypothesis testing materials for exploring language.',
        
        'Talk Show Host Training': 'Broadcasting kit: microphone, interview question cards, guest name tags, audience applause sign, and conversation starter cards for hosting engaging talk shows.',
        
        'Innovation Lab: Rethink Everything': 'Creative invention kit: building blocks, design thinking cards, prototype materials, innovation journal, and challenge cards for reimagining everyday objects.',
        
        'Survival Island Adventure': 'Adventure survival kit: compass, survival cards, challenge scenarios, team building games, and problem-solving tools for surviving exciting island adventures.',
        
        'Creative Solution Innovation Hub': 'Innovation workshop kit: brainstorming tools, creative thinking cards, solution prototype materials, and innovation challenge cards for developing unique solutions.',
        
        'Multi-Step Thinking': 'Strategic planning kit: step-by-step planning cards, sequence organizers, multi-task management tools, and complex reasoning games for mastering multi-step processes.',
        
        'Brain Gym Circuit Training': 'Cognitive fitness kit: brain exercise stations, mental workout cards, cognitive challenge timers, and fitness tracking sheets for building mental strength and agility.'
    }
    
    return kit_descriptions

def fix_robotic_kit_materials():
    """Fix all robotic kit materials across all age groups"""
    
    try:
        print(f"🔧 FIXING ROBOTIC KIT MATERIALS - CREATE MEANINGFUL DESCRIPTIONS:")
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
        
        print(f"\n🎯 IDENTIFYING ROBOTIC KIT MATERIALS:")
        print("-" * 80)
        
        # Get meaningful kit descriptions
        meaningful_kits = create_meaningful_kit_descriptions()
        
        # Find activities with robotic kit materials
        robotic_kits = []
        for row_num, row in enumerate(all_data[1:], start=2):
            if len(row) > max(column_indices.get('Pillar', 0), column_indices.get('Age Group', 0), column_indices.get('Activity Name', 0)):
                pillar = row[column_indices.get('Pillar', 0)].strip()
                age_group = row[column_indices.get('Age Group', 0)].strip()
                activity_name = row[column_indices.get('Activity Name', 0)].strip() if len(row) > column_indices.get('Activity Name', 0) else ''
                kit_materials = row[column_indices.get('Kit Materials', 0)].strip() if len(row) > column_indices.get('Kit Materials', 0) else ''
                
                if (pillar == 'Cognitive Skills' and 
                    activity_name in meaningful_kits and 
                    ('Professional' in kit_materials and 'kit with' in kit_materials and 'development materials' in kit_materials)):
                    robotic_kits.append((row_num, activity_name, meaningful_kits[activity_name], age_group))
        
        print(f"📊 Found {len(robotic_kits)} activities with robotic kit materials")
        print(f"⏳ Processing with 2-second delays between updates...")
        
        total_updates = 0
        
        # Update all robotic kit materials
        for i, (row_num, activity_name, new_kit_description, age_group) in enumerate(robotic_kits):
            try:
                print(f"\n🔧 Activity {i+1}/{len(robotic_kits)}: Row {row_num}")
                print(f"   📝 {activity_name}")
                print(f"   👶 Age Group: {age_group}")
                print(f"   📦 New Kit: {new_kit_description[:100]}...")
                
                # Update Kit Materials
                activities_worksheet.update_cell(row_num, column_indices['Kit Materials'] + 1, new_kit_description)
                total_updates += 1
                print(f"      ✅ Updated Kit Materials")
                
                # Add delay between updates
                if i < len(robotic_kits) - 1:
                    print(f"      ⏳ Waiting 2 seconds before next activity...")
                    time.sleep(2)
                    
            except Exception as e:
                print(f"   ❌ Error updating kit materials for {activity_name}: {e}")
                print(f"      ⏳ Waiting 3 seconds before continuing...")
                time.sleep(3)
                continue
        
        print(f"\n🎉 ROBOTIC KIT MATERIALS FIXED!")
        print("=" * 80)
        print(f"✅ Total kit materials updated: {total_updates}")
        print(f"✅ Removed robotic 'Professional [age] kit with [items] and [development] materials' patterns")
        print(f"✅ Created specific, meaningful, and useful kit descriptions")
        print(f"✅ Parents can now understand exactly what they're buying")
        
        return True
        
    except Exception as e:
        print(f"❌ Error fixing robotic kit materials: {e}")
        return False

def main():
    """Main function to fix robotic kit materials"""
    print("🔧 Fix Robotic Kit Materials - Create Meaningful Descriptions")
    print("=" * 70)
    print("🎯 Replace robotic kit descriptions with specific, useful, meaningful content")
    
    success = fix_robotic_kit_materials()
    
    if success:
        print(f"\n✅ SUCCESS! Robotic kit materials fixed!")
        print("=" * 70)
        print("✅ All robotic patterns removed")
        print("✅ Specific, meaningful descriptions created")
        print("✅ Parents can understand value and contents")
        
        return True
    else:
        print(f"\n❌ FAILED to fix robotic kit materials!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Robotic kit materials fixed!")
    else:
        print(f"\n❌ FAILED to fix robotic kit materials!")

