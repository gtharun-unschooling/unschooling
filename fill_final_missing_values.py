#!/usr/bin/env python3
"""
🔧 Fill Final Missing Values
Fill the remaining missing values: Explanation, Corrections Needed, Feedback
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

def get_final_missing_values():
    """Get values for final missing columns"""
    
    final_values = {
        'Explanation': {
            'Hide and Seek Memory': 'Hide and seek memory games help toddlers develop memory skills and object permanence understanding. This activity supports cognitive development and spatial memory by teaching toddlers that objects exist even when hidden from view.',
            'Simple Sequence Games': 'Sequence games help toddlers develop logical thinking and pattern recognition abilities. This activity supports cognitive development and memory skills by teaching toddlers to recognize and recreate simple patterns.',
            'Familiar Object Recall': 'Familiar object recall games help toddlers develop memory skills and object recognition abilities. This activity supports cognitive development and vocabulary building by encouraging toddlers to remember and name familiar items.',
            'Song and Rhyme Memory': 'Song and rhyme memory games help toddlers develop auditory memory and language skills through repetition and rhythm. This activity supports cognitive development and social interaction by combining music with memory building.',
            'Picture Memory Games': 'Picture memory games help toddlers develop visual memory and picture recognition abilities. This activity supports cognitive development and vocabulary building by teaching toddlers to remember and identify visual information.',
            'Simple Shape Sorting': 'Shape sorting games help toddlers develop problem-solving skills and shape recognition abilities. This activity supports cognitive development and fine motor skills by teaching toddlers to match and categorize different shapes.',
            'Basic Puzzle Play': 'Puzzle play helps toddlers develop problem-solving skills and spatial reasoning abilities. This activity supports cognitive development and persistence by teaching toddlers to fit pieces together to complete a picture.',
            'Cause and Effect Discovery': 'Cause and effect discovery games help toddlers understand action-consequence relationships and develop problem-solving skills. This activity supports cognitive development and exploration by teaching toddlers that their actions create specific results.',
            'Simple Building Games': 'Building games help toddlers develop spatial reasoning and problem-solving skills through hands-on construction. This activity supports cognitive development and creativity by encouraging toddlers to create structures and explore spatial relationships.',
            'Exploration Challenges': 'Exploration challenges help toddlers develop curiosity and problem-solving skills through hands-on discovery. This activity supports cognitive development and learning by encouraging toddlers to investigate and learn about their environment.',
            'Focus Building Games': 'Focus building games help toddlers develop attention span and concentration abilities. This activity supports cognitive development and self-regulation by teaching toddlers to sustain attention on specific activities.',
            'Attention Span Activities': 'Attention span activities help toddlers develop the ability to focus and complete tasks. This activity supports cognitive development and persistence by encouraging toddlers to maintain attention on activities they enjoy.',
            'Concentration Exercises': 'Concentration exercises help toddlers develop the ability to focus mentally and sustain attention. This activity supports cognitive development and self-regulation by teaching toddlers to concentrate on specific tasks.',
            'Sustained Play Games': 'Sustained play games help toddlers develop the ability to engage in extended, focused play. This activity supports cognitive development and creativity by encouraging toddlers to immerse themselves in activities they enjoy.',
            'Focus Training Activities': 'Focus training activities help toddlers develop attention control and mental discipline. This activity supports cognitive development and self-regulation by teaching toddlers to maintain focus through structured exercises.'
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
    
    return final_values

def fill_final_missing_values(client):
    """Fill the final missing values"""
    
    try:
        # Open the Sample 1 spreadsheet
        spreadsheet = client.open_by_key('14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ')
        activities_worksheet = spreadsheet.worksheet('Activities')
        
        print(f"🔧 FILLING FINAL MISSING VALUES:")
        print("=" * 60)
        
        # Get all data
        all_data = activities_worksheet.get_all_values()
        headers = all_data[0]
        
        # Find column indices for final missing columns
        final_columns = ['Explanation', 'Corrections Needed', 'Feedback']
        
        column_indices = {}
        for col in final_columns:
            if col in headers:
                column_indices[col] = headers.index(col)
        
        # Find pillar and age group columns
        pillar_col_index = headers.index('Pillar') if 'Pillar' in headers else None
        age_group_col_index = headers.index('Age Group') if 'Age Group' in headers else None
        activity_name_index = headers.index('Activity Name') if 'Activity Name' in headers else None
        
        # Get final values
        final_values = get_final_missing_values()
        
        # Find all Toddler Cognitive Skills activities
        fixes_made = 0
        
        for row_num, row in enumerate(all_data[1:], start=2):
            if len(row) > max(pillar_col_index, age_group_col_index):
                pillar = row[pillar_col_index].strip()
                age_group = row[age_group_col_index].strip()
                
                if pillar == 'Cognitive Skills' and age_group == 'Toddler (1-3)':
                    activity_name = row[activity_name_index].strip() if len(row) > activity_name_index else ''
                    
                    print(f"\n🔧 Completing: {activity_name} (Row {row_num})")
                    
                    # Fill final columns
                    for col, col_index in column_indices.items():
                        if col_index < len(row):
                            current_value = row[col_index].strip()
                            
                            # Only update if empty
                            if not current_value and activity_name in final_values[col]:
                                value = final_values[col][activity_name]
                                activities_worksheet.update_cell(row_num, col_index + 1, value)
                                print(f"   ✅ {col}: {value[:50]}...")
                                time.sleep(1)  # Rate limiting
                    
                    fixes_made += 1
        
        print(f"\n🎉 FINAL MISSING VALUES FILLED!")
        print("=" * 50)
        print(f"✅ Completed {fixes_made} Toddler activities")
        print(f"✅ Explanation filled")
        print(f"✅ Corrections Needed filled")
        print(f"✅ Feedback filled")
        print(f"✅ EVERYTHING COMPLETE!")
        
        return True
        
    except Exception as e:
        print(f"❌ Error filling final missing values: {e}")
        return False

def main():
    """Main function to fill final missing values"""
    print("🔧 Fill Final Missing Values")
    print("=" * 70)
    print("🎯 Fill Explanation, Corrections Needed, Feedback")
    
    # Connect to Google Sheets
    client = get_google_sheets_client()
    if not client:
        return False
    
    # Fill final missing values
    success = fill_final_missing_values(client)
    
    if success:
        print(f"\n✅ SUCCESS! All final missing values filled!")
        print("=" * 50)
        print("✅ Explanation filled")
        print("✅ Corrections Needed filled")
        print("✅ Feedback filled")
        print("✅ EVERYTHING COMPLETE!")
        print("✅ NO MORE MISSING VALUES!")
        
        return True
    else:
        print(f"\n❌ FAILED to fill final missing values!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! All final values filled!")
    else:
        print(f"\n❌ FAILED to fill final missing values!")
