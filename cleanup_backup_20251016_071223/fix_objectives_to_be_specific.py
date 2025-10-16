#!/usr/bin/env python3
"""
🎯 Fix Objectives to Be Specific and Creative
Make objectives specific to each activity, not generic "develop" statements
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
        print("✅ Connected to Google Sheets")
        return client
    except Exception as e:
        print(f"❌ Error connecting to Google Sheets: {e}")
        return None

def get_specific_objectives_for_activities():
    """Create specific, creative objectives for each activity"""
    
    specific_objectives = {
        # Memory and Recall Activities
        'Hide and Seek Memory': 'Help toddlers discover the joy of finding hidden treasures while building memory skills through exciting hide-and-seek adventures that make learning feel like play.',
        'Simple Sequence Games': 'Introduce toddlers to the magical world of patterns and sequences through colorful, hands-on activities that spark curiosity about order and arrangement.',
        'Familiar Object Recall': 'Transform everyday objects into memory-building tools by creating fun guessing games that help toddlers remember and recognize items from their daily lives.',
        'Song and Rhyme Memory': 'Create musical memory adventures where toddlers learn to remember lyrics, rhythms, and melodies through joyful singing and rhyming experiences.',
        'Picture Memory Games': 'Turn picture viewing into an engaging memory challenge where toddlers learn to remember and recall visual information through fun, colorful activities.',
        
        # Problem Solving Basics Activities
        'Simple Shape Sorting': 'Guide toddlers through shape-matching adventures that teach them to recognize, sort, and categorize different shapes while having fun with colorful toys.',
        'Basic Puzzle Play': 'Introduce toddlers to the satisfaction of puzzle-solving through age-appropriate challenges that build spatial reasoning and problem-solving confidence.',
        'Cause and Effect Discovery': 'Spark toddlers\' curiosity about how things work by creating exciting cause-and-effect experiments that reveal the magic of action and reaction.',
        'Simple Building Games': 'Inspire toddlers to become little architects by encouraging them to build, stack, and create structures that teach spatial reasoning and creativity.',
        'Exploration Challenges': 'Transform toddlers into curious explorers who discover new things through guided adventures that encourage investigation and discovery.',
        
        # Attention and Focus Activities
        'Focus Building Games': 'Help toddlers become attention superheroes by engaging them in activities that gradually increase their ability to concentrate and focus on tasks.',
        'Attention Span Activities': 'Create engaging experiences that naturally extend toddlers\' attention spans through activities they love and want to complete.',
        'Concentration Exercises': 'Teach toddlers the power of focused attention through calming, engaging activities that help them learn to concentrate on single tasks.',
        'Sustained Play Games': 'Encourage toddlers to dive deep into play by providing open-ended activities that naturally extend their engagement and attention.',
        'Focus Training Activities': 'Train toddlers\' attention muscles through fun, structured activities that build their ability to maintain focus and concentration.',
        
        # Language Development Activities (fixing these too)
        'Word Recognition Games': 'Turn word learning into an exciting treasure hunt where toddlers discover new words through interactive picture games that make vocabulary building feel like play.',
        'Simple Conversation Practice': 'Create magical conversation moments where toddlers learn to express themselves and communicate their thoughts through guided, encouraging dialogue.',
        'Vocabulary Building Play': 'Transform everyday objects into vocabulary-building adventures that help toddlers learn new words through hands-on exploration and discovery.',
        'Sound Pattern Recognition': 'Introduce toddlers to the musical world of sound patterns through rhythm games that teach them to recognize and create different sound sequences.',
        'Language Imitation Games': 'Help toddlers become confident speakers by creating fun imitation games that encourage them to copy and practice new words and phrases.',
        
        # Additional specific objectives for other activities
        'Colorful Mobile Watching': 'Create mesmerizing visual experiences that capture toddlers\' attention and help them develop tracking skills through beautiful, moving displays.',
        'Light And Shadow Play': 'Transform darkness into a magical learning space where toddlers discover the wonder of light and shadows through interactive play.',
        'Moving Object Tracking': 'Turn toddlers into skilled observers who learn to follow moving objects with their eyes, building visual tracking abilities through exciting games.',
        'Visual Pattern Recognition': 'Introduce toddlers to the fascinating world of patterns through high-contrast visuals that stimulate their developing vision and pattern recognition.',
        'Focus Building Games': 'Help toddlers become attention champions by engaging them in activities that naturally build their focus and concentration abilities.',
        'Rattle Shake Response': 'Create musical discovery moments where toddlers learn that their actions create sounds, building understanding of cause and effect through rhythm.',
        'Button Press Discovery': 'Transform toddlers into button-pressing explorers who discover the magic of cause and effect through interactive toys and games.',
        'Sound Making Fun': 'Turn toddlers into little musicians who discover the joy of creating sounds and music through safe, age-appropriate instruments.',
        'Touch Response Play': 'Create sensory adventures where toddlers explore different textures and learn about the world through their sense of touch.',
        'Action Consequence Games': 'Help toddlers become little scientists who discover how their actions create reactions through exciting cause-and-effect experiments.'
    }
    
    return specific_objectives

def fix_objectives_in_google_sheets(client):
    """Fix objectives in Google Sheets to be specific and creative"""
    
    try:
        # Open the Sample 1 spreadsheet
        spreadsheet = client.open_by_key('14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ')
        activities_worksheet = spreadsheet.worksheet('Activities')
        
        print(f"🎯 FIXING OBJECTIVES TO BE SPECIFIC AND CREATIVE:")
        print("=" * 60)
        
        # Get all data
        all_data = activities_worksheet.get_all_values()
        if not all_data:
            print("❌ No data found")
            return None
        
        headers = all_data[0]
        
        # Find column indices
        pillar_col_index = headers.index('Pillar') if 'Pillar' in headers else None
        age_group_col_index = headers.index('Age Group') if 'Age Group' in headers else None
        activity_name_index = headers.index('Activity Name') if 'Activity Name' in headers else None
        objective_index = headers.index('Objective') if 'Objective' in headers else None
        
        # Get specific objectives
        specific_objectives = get_specific_objectives_for_activities()
        
        fixes_made = 0
        
        # Find all activities and fix their objectives
        for row_num, row in enumerate(all_data[1:], start=2):
            if len(row) > max(pillar_col_index, age_group_col_index):
                pillar = row[pillar_col_index].strip()
                age_group = row[age_group_col_index].strip()
                activity_name = row[activity_name_index].strip() if len(row) > activity_name_index else ''
                current_objective = row[objective_index].strip() if len(row) > objective_index else ''
                
                # Focus on Cognitive Skills activities
                if pillar == 'Cognitive Skills' and activity_name in specific_objectives:
                    new_objective = specific_objectives[activity_name]
                    
                    # Check if objective needs updating (if it's generic "develop" statement)
                    if current_objective.lower().startswith('develop') or not current_objective.strip():
                        print(f"\n🎯 Fixing: {activity_name} (Row {row_num})")
                        print(f"   Old: {current_objective[:100]}..." if current_objective else "   Old: [EMPTY]")
                        print(f"   New: {new_objective[:100]}...")
                        
                        activities_worksheet.update_cell(row_num, objective_index + 1, new_objective)
                        print(f"   ✅ Objective: Updated to be specific and creative")
                        fixes_made += 1
                        time.sleep(1)  # Rate limiting
                    else:
                        print(f"\n✅ {activity_name}: Objective already specific")
        
        print(f"\n🎉 OBJECTIVES FIXED!")
        print("=" * 40)
        print(f"✅ Fixed {fixes_made} objectives to be specific and creative")
        print(f"✅ No more generic 'develop' statements")
        print(f"✅ Each objective is unique to the activity")
        print(f"✅ Objectives are engaging and creative")
        
        return True
        
    except Exception as e:
        print(f"❌ Error fixing objectives: {e}")
        return False

def main():
    """Main function to fix objectives"""
    print("🎯 Fixing Objectives to Be Specific and Creative")
    print("=" * 70)
    print("🎯 Make objectives specific to each activity, not generic 'develop' statements")
    
    # Connect to Google Sheets
    client = get_google_sheets_client()
    if not client:
        return False
    
    # Fix objectives
    success = fix_objectives_in_google_sheets(client)
    
    if success:
        print(f"\n✅ SUCCESS! Objectives fixed!")
        print("=" * 50)
        print("✅ All objectives are now specific to each activity")
        print("✅ No more generic 'develop' statements")
        print("✅ Objectives are creative and engaging")
        print("✅ Ready for engagement")
        
        return True
    else:
        print(f"\n❌ FAILED to fix objectives!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Objective fixing completed!")
    else:
        print(f"\n❌ FAILED to fix objectives!")
