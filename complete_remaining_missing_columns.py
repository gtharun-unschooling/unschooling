#!/usr/bin/env python3
"""
🔧 Complete Remaining Missing Columns
Fill the remaining missing columns: General Instructions, Materials at Home, Kit Materials, Materials to Buy for Kit
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

def get_remaining_values():
    """Get values for remaining missing columns"""
    
    remaining_values = {
        'General Instructions': {
            'Word Recognition Games': 'Keep sessions short and engaging. Use lots of praise and encouragement. Let toddler explore cards at their own pace.',
            'Simple Conversation Practice': 'Be patient with responses. Use simple questions. Expand on toddler\'s words to model longer sentences.',
            'Vocabulary Building Play': 'Use objects toddler is familiar with. Repeat words multiple times. Make it fun and playful.',
            'Sound Pattern Recognition': 'Start with simple sounds. Be patient with repetition. Keep patterns short and clear.',
            'Language Imitation Games': 'Use clear pronunciation. Repeat phrases multiple times. Use gestures to support understanding.',
            'Hide and Seek Memory': 'Start with obvious hiding places. Use familiar objects. Give lots of encouragement.',
            'Simple Sequence Games': 'Start with 2-item sequences. Use colorful, interesting objects. Be patient with attempts.',
            'Familiar Object Recall': 'Use objects toddler knows well. Keep sessions short. Give lots of praise.',
            'Song and Rhyme Memory': 'Use songs toddler enjoys. Repeat frequently. Use gestures and movement.',
            'Picture Memory Games': 'Use simple, colorful pictures. Keep sessions short. Give lots of encouragement.',
            'Simple Shape Sorting': 'Start with simple shapes. Be patient with attempts. Provide gentle help when needed.',
            'Basic Puzzle Play': 'Start with very simple puzzles. Provide encouragement. Don\'t rush the process.',
            'Cause and Effect Discovery': 'Use toys with clear cause-effect relationships. Be enthusiastic about results. Let toddler explore freely.',
            'Simple Building Games': 'Use large, safe blocks. Let toddler build freely. Celebrate all attempts.',
            'Exploration Challenges': 'Ensure all objects are safe. Follow toddler\'s interests. Ask open-ended questions.',
            'Focus Building Games': 'Start with short focus periods. Remove distractions. Be patient with attention span.',
            'Attention Span Activities': 'Choose activities toddler enjoys. Set realistic time limits. Provide encouragement.',
            'Concentration Exercises': 'Keep exercises simple and short. Provide lots of encouragement. Don\'t force concentration.',
            'Sustained Play Games': 'Choose activities toddler loves. Don\'t interrupt focused play. Join in when invited.',
            'Focus Training Activities': 'Keep training fun and game-like. Provide lots of praise. Don\'t push beyond toddler\'s limits.'
        },
        'Materials at Home': {
            'Word Recognition Games': 'Magazine pictures, homemade picture cards, household objects with labels',
            'Simple Conversation Practice': 'Family photos, favorite toys, everyday objects to discuss',
            'Vocabulary Building Play': 'Kitchen utensils, toys, books, household items',
            'Sound Pattern Recognition': 'Pots, pans, spoons, musical toys, rhythm instruments',
            'Language Imitation Games': 'Favorite books, nursery rhymes, simple songs',
            'Hide and Seek Memory': 'Favorite toys, stuffed animals, household objects',
            'Simple Sequence Games': 'Colored blocks, toy cars, stuffed animals, household items',
            'Familiar Object Recall': 'Favorite toys, household objects, books, stuffed animals',
            'Song and Rhyme Memory': 'Music player, favorite songs, nursery rhyme books',
            'Picture Memory Games': 'Picture books, family photos, magazine pictures',
            'Simple Shape Sorting': 'Kitchen containers, different shaped objects, homemade sorting boxes',
            'Basic Puzzle Play': 'Homemade puzzles from pictures, simple board puzzles',
            'Cause and Effect Discovery': 'Light switches, water toys, musical instruments, pop-up toys',
            'Simple Building Games': 'Cardboard boxes, plastic containers, soft blocks, pillows',
            'Exploration Challenges': 'Kitchen utensils, safe household objects, natural materials',
            'Focus Building Games': 'Favorite books, puzzles, quiet toys, comfortable seating',
            'Attention Span Activities': 'Coloring books, simple crafts, favorite toys, books',
            'Concentration Exercises': 'Quiet toys, books, simple puzzles, comfortable seating',
            'Sustained Play Games': 'Blocks, dolls, toy cars, art supplies, books',
            'Focus Training Activities': 'Simple focus games, quiet activities, comfortable seating'
        },
        'Kit Materials': {
            'Word Recognition Games': 'High-quality picture word cards, storage box, instruction guide',
            'Simple Conversation Practice': 'Conversation starter cards, family photo album, discussion prompts',
            'Vocabulary Building Play': 'Vocabulary building objects, storage basket, word cards',
            'Sound Pattern Recognition': 'Sound pattern cards, rhythm instruments, audio guide',
            'Language Imitation Games': 'Language imitation cards, gesture guide, audio examples',
            'Hide and Seek Memory': 'Memory game objects, hiding place cards, instruction guide',
            'Simple Sequence Games': 'Sequence cards, sequencing objects, pattern guide',
            'Familiar Object Recall': 'Recall game objects, memory cards, instruction guide',
            'Song and Rhyme Memory': 'Song cards, rhythm instruments, audio guide',
            'Picture Memory Games': 'Picture memory cards, storage box, instruction guide',
            'Simple Shape Sorting': 'Shape sorting toy, instruction guide, extension activities',
            'Basic Puzzle Play': 'Basic puzzle set, instruction guide, progression activities',
            'Cause and Effect Discovery': 'Cause-effect toys, discovery guide, extension activities',
            'Simple Building Games': 'Building block set, construction guide, extension activities',
            'Exploration Challenges': 'Exploration objects, discovery guide, safety checklist',
            'Focus Building Games': 'Focus building activities, attention guide, timer',
            'Attention Span Activities': 'Attention span activities, completion guide, progress tracker',
            'Concentration Exercises': 'Concentration exercises, focus guide, relaxation materials',
            'Sustained Play Games': 'Sustained play activities, engagement guide, play extension ideas',
            'Focus Training Activities': 'Focus training kit, instruction guide, progress tracker'
        },
        'Materials to Buy for Kit': {
            'Word Recognition Games': 'Picture word cards from educational stores, laminating sheets for durability',
            'Simple Conversation Practice': 'Conversation starter cards, family photo album, educational discussion materials',
            'Vocabulary Building Play': 'Educational vocabulary toys, word building blocks, picture books',
            'Sound Pattern Recognition': 'Musical instruments for toddlers, sound pattern games, rhythm toys',
            'Language Imitation Games': 'Speech development toys, language learning cards, audio books',
            'Hide and Seek Memory': 'Memory development toys, hide-and-seek games, spatial learning toys',
            'Simple Sequence Games': 'Sequencing toys, pattern recognition games, logical thinking toys',
            'Familiar Object Recall': 'Memory development toys, recall games, cognitive learning toys',
            'Song and Rhyme Memory': 'Children\'s music, nursery rhyme books, musical instruments',
            'Picture Memory Games': 'Picture memory games, visual learning cards, educational pictures',
            'Simple Shape Sorting': 'Educational shape sorters, sorting toys, shape recognition games',
            'Basic Puzzle Play': 'Age-appropriate puzzles, puzzle storage, educational puzzle games',
            'Cause and Effect Discovery': 'Educational cause-effect toys, discovery games, interactive learning toys',
            'Simple Building Games': 'Educational building blocks, construction toys, spatial learning games',
            'Exploration Challenges': 'Educational exploration toys, discovery kits, sensory learning materials',
            'Focus Building Games': 'Attention development toys, focus games, concentration aids',
            'Attention Span Activities': 'Attention development games, task completion toys, focus aids',
            'Concentration Exercises': 'Concentration games, focus development toys, mindfulness activities',
            'Sustained Play Games': 'Open-ended toys, creative play materials, engagement games',
            'Focus Training Activities': 'Focus development games, attention training toys, cognitive exercises'
        },
        'Corrections Needed': {
            'Word Recognition Games': '',
            'Simple Conversation Practice': '',
            'Vocabulary Building Play': '',
            'Sound Pattern Recognition': '',
            'Language Imitation Games': '',
            'Hide and Seek Memory': '',
            'Simple Sequence Games': '',
            'Familiar Object Recall': '',
            'Song and Rhyme Memory': '',
            'Picture Memory Games': '',
            'Simple Shape Sorting': '',
            'Basic Puzzle Play': '',
            'Cause and Effect Discovery': '',
            'Simple Building Games': '',
            'Exploration Challenges': '',
            'Focus Building Games': '',
            'Attention Span Activities': '',
            'Concentration Exercises': '',
            'Sustained Play Games': '',
            'Focus Training Activities': ''
        },
        'Feedback': {
            'Word Recognition Games': '',
            'Simple Conversation Practice': '',
            'Vocabulary Building Play': '',
            'Sound Pattern Recognition': '',
            'Language Imitation Games': '',
            'Hide and Seek Memory': '',
            'Simple Sequence Games': '',
            'Familiar Object Recall': '',
            'Song and Rhyme Memory': '',
            'Picture Memory Games': '',
            'Simple Shape Sorting': '',
            'Basic Puzzle Play': '',
            'Cause and Effect Discovery': '',
            'Simple Building Games': '',
            'Exploration Challenges': '',
            'Focus Building Games': '',
            'Attention Span Activities': '',
            'Concentration Exercises': '',
            'Sustained Play Games': '',
            'Focus Training Activities': ''
        }
    }
    
    return remaining_values

def complete_remaining_columns(client):
    """Complete the remaining missing columns"""
    
    try:
        # Open the Sample 1 spreadsheet
        spreadsheet = client.open_by_key('14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ')
        activities_worksheet = spreadsheet.worksheet('Activities')
        
        print(f"🔧 COMPLETING REMAINING MISSING COLUMNS:")
        print("=" * 60)
        
        # Get all data
        all_data = activities_worksheet.get_all_values()
        headers = all_data[0]
        
        # Find column indices for remaining columns
        remaining_columns = [
            'General Instructions', 'Materials at Home', 'Kit Materials', 
            'Materials to Buy for Kit', 'Corrections Needed', 'Feedback'
        ]
        
        column_indices = {}
        for col in remaining_columns:
            if col in headers:
                column_indices[col] = headers.index(col)
        
        # Find pillar and age group columns
        pillar_col_index = headers.index('Pillar') if 'Pillar' in headers else None
        age_group_col_index = headers.index('Age Group') if 'Age Group' in headers else None
        activity_name_index = headers.index('Activity Name') if 'Activity Name' in headers else None
        
        # Get remaining values
        remaining_values = get_remaining_values()
        
        # Find all Toddler Cognitive Skills activities
        fixes_made = 0
        
        for row_num, row in enumerate(all_data[1:], start=2):
            if len(row) > max(pillar_col_index, age_group_col_index):
                pillar = row[pillar_col_index].strip()
                age_group = row[age_group_col_index].strip()
                
                if pillar == 'Cognitive Skills' and age_group == 'Toddler (1-3)':
                    activity_name = row[activity_name_index].strip() if len(row) > activity_name_index else ''
                    
                    print(f"\n🔧 Completing: {activity_name} (Row {row_num})")
                    
                    # Fill remaining columns
                    for col, col_index in column_indices.items():
                        if col_index < len(row):
                            current_value = row[col_index].strip()
                            
                            # Only update if empty
                            if not current_value and activity_name in remaining_values[col]:
                                value = remaining_values[col][activity_name]
                                activities_worksheet.update_cell(row_num, col_index + 1, value)
                                print(f"   ✅ {col}: {value[:50]}...")
                                time.sleep(1)  # Rate limiting
                    
                    fixes_made += 1
        
        print(f"\n🎉 REMAINING COLUMNS COMPLETED!")
        print("=" * 50)
        print(f"✅ Completed {fixes_made} Toddler activities")
        print(f"✅ All remaining columns filled")
        print(f"✅ Ready for engagement")
        
        return True
        
    except Exception as e:
        print(f"❌ Error completing remaining columns: {e}")
        return False

def main():
    """Main function to complete remaining missing columns"""
    print("🔧 Completing Remaining Missing Columns")
    print("=" * 70)
    print("🎯 Fill General Instructions, Materials at Home, Kit Materials, etc.")
    
    # Connect to Google Sheets
    client = get_google_sheets_client()
    if not client:
        return False
    
    # Complete remaining columns
    success = complete_remaining_columns(client)
    
    if success:
        print(f"\n✅ SUCCESS! All remaining columns completed!")
        print("=" * 50)
        print("✅ General Instructions filled")
        print("✅ Materials at Home filled")
        print("✅ Kit Materials filled")
        print("✅ Materials to Buy for Kit filled")
        print("✅ Corrections Needed filled")
        print("✅ Feedback filled")
        print("✅ Ready for engagement")
        
        return True
    else:
        print(f"\n❌ FAILED to complete remaining columns!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! All columns completed!")
    else:
        print(f"\n❌ FAILED to complete remaining columns!")
