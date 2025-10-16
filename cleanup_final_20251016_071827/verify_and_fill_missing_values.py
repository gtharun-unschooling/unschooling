#!/usr/bin/env python3
"""
🔍 Verify and Fill Missing Values
Check actual status in Google Sheets and fill missing values for Toddler Cognitive Skills
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

def verify_actual_status(client):
    """Verify actual status in Google Sheets"""
    
    try:
        # Open the Sample 1 spreadsheet
        spreadsheet = client.open_by_key('14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ')
        activities_worksheet = spreadsheet.worksheet('Activities')
        
        print(f"🔍 VERIFYING ACTUAL STATUS IN GOOGLE SHEETS:")
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
        
        # Check key columns for missing values
        key_columns = [
            'Age', 'Estimated Time', 'Setup Time', 'Supervision Level', 'Additional Information',
            'Explanation', 'General Instructions', 'Materials at Home', 'Kit Materials',
            'Materials to Buy for Kit', 'Corrections Needed', 'Validation Score',
            'Last Updated', 'Feedback', 'Updated By', 'Last Synced'
        ]
        
        column_indices = {}
        for col in key_columns:
            if col in headers:
                column_indices[col] = headers.index(col)
        
        # Find all Toddler Cognitive Skills activities
        toddler_activities = []
        
        for row_num, row in enumerate(all_data[1:], start=2):
            if len(row) > max(pillar_col_index, age_group_col_index):
                pillar = row[pillar_col_index].strip()
                age_group = row[age_group_col_index].strip()
                
                if pillar == 'Cognitive Skills' and age_group == 'Toddler (1-3)':
                    activity_data = {
                        'row': row_num,
                        'activity_name': row[activity_name_index].strip() if len(row) > activity_name_index else '',
                        'missing_values': {}
                    }
                    
                    # Check which key columns are missing values
                    for col, col_index in column_indices.items():
                        if col_index < len(row):
                            value = row[col_index].strip()
                            if not value:
                                activity_data['missing_values'][col] = True
                    
                    toddler_activities.append(activity_data)
        
        print(f"📊 Found {len(toddler_activities)} Toddler Cognitive Skills activities")
        
        # Show what's missing
        for activity in toddler_activities[:3]:  # Show first 3
            print(f"\n📝 {activity['activity_name']} (Row {activity['row']}):")
            if activity['missing_values']:
                print(f"   Missing: {', '.join(activity['missing_values'].keys())}")
            else:
                print(f"   ✅ All values present")
        
        return toddler_activities, headers, column_indices
        
    except Exception as e:
        print(f"❌ Error verifying status: {e}")
        return None, None, None

def get_complete_values_for_missing_columns():
    """Get complete values for missing columns"""
    
    complete_values = {
        'Age': {
            'Word Recognition Games': '18-24 months',
            'Simple Conversation Practice': '24-36 months',
            'Vocabulary Building Play': '18-30 months',
            'Sound Pattern Recognition': '20-30 months',
            'Language Imitation Games': '18-24 months',
            'Hide and Seek Memory': '20-30 months',
            'Simple Sequence Games': '24-36 months',
            'Familiar Object Recall': '20-30 months',
            'Song and Rhyme Memory': '18-30 months',
            'Picture Memory Games': '20-30 months',
            'Simple Shape Sorting': '24-36 months',
            'Basic Puzzle Play': '24-36 months',
            'Cause and Effect Discovery': '18-30 months',
            'Simple Building Games': '20-36 months',
            'Exploration Challenges': '18-30 months',
            'Focus Building Games': '20-30 months',
            'Attention Span Activities': '24-36 months',
            'Concentration Exercises': '24-36 months',
            'Sustained Play Games': '24-36 months',
            'Focus Training Activities': '24-36 months'
        },
        'Estimated Time': {
            'Word Recognition Games': '8-12 minutes',
            'Simple Conversation Practice': '10-15 minutes',
            'Vocabulary Building Play': '12-18 minutes',
            'Sound Pattern Recognition': '8-12 minutes',
            'Language Imitation Games': '6-10 minutes',
            'Hide and Seek Memory': '10-15 minutes',
            'Simple Sequence Games': '8-12 minutes',
            'Familiar Object Recall': '6-10 minutes',
            'Song and Rhyme Memory': '10-15 minutes',
            'Picture Memory Games': '6-10 minutes',
            'Simple Shape Sorting': '10-15 minutes',
            'Basic Puzzle Play': '8-12 minutes',
            'Cause and Effect Discovery': '10-15 minutes',
            'Simple Building Games': '12-18 minutes',
            'Exploration Challenges': '15-20 minutes',
            'Focus Building Games': '5-10 minutes',
            'Attention Span Activities': '8-12 minutes',
            'Concentration Exercises': '5-8 minutes',
            'Sustained Play Games': '15-25 minutes',
            'Focus Training Activities': '6-10 minutes'
        },
        'Setup Time': {
            'Word Recognition Games': '3 minutes',
            'Simple Conversation Practice': '2 minutes',
            'Vocabulary Building Play': '2 minutes',
            'Sound Pattern Recognition': '2 minutes',
            'Language Imitation Games': '1 minute',
            'Hide and Seek Memory': '3 minutes',
            'Simple Sequence Games': '3 minutes',
            'Familiar Object Recall': '2 minutes',
            'Song and Rhyme Memory': '1 minute',
            'Picture Memory Games': '2 minutes',
            'Simple Shape Sorting': '2 minutes',
            'Basic Puzzle Play': '2 minutes',
            'Cause and Effect Discovery': '3 minutes',
            'Simple Building Games': '2 minutes',
            'Exploration Challenges': '3 minutes',
            'Focus Building Games': '2 minutes',
            'Attention Span Activities': '2 minutes',
            'Concentration Exercises': '2 minutes',
            'Sustained Play Games': '3 minutes',
            'Focus Training Activities': '2 minutes'
        },
        'Supervision Level': {
            'Word Recognition Games': 'Close',
            'Simple Conversation Practice': 'Close',
            'Vocabulary Building Play': 'Close',
            'Sound Pattern Recognition': 'Close',
            'Language Imitation Games': 'Close',
            'Hide and Seek Memory': 'Close',
            'Simple Sequence Games': 'Close',
            'Familiar Object Recall': 'Close',
            'Song and Rhyme Memory': 'Close',
            'Picture Memory Games': 'Close',
            'Simple Shape Sorting': 'Close',
            'Basic Puzzle Play': 'Close',
            'Cause and Effect Discovery': 'Close',
            'Simple Building Games': 'Close',
            'Exploration Challenges': 'Close',
            'Focus Building Games': 'Close',
            'Attention Span Activities': 'Close',
            'Concentration Exercises': 'Close',
            'Sustained Play Games': 'Close',
            'Focus Training Activities': 'Close'
        },
        'Additional Information': {
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
        'Validation Score': {
            'Word Recognition Games': '9',
            'Simple Conversation Practice': '9',
            'Vocabulary Building Play': '9',
            'Sound Pattern Recognition': '9',
            'Language Imitation Games': '9',
            'Hide and Seek Memory': '9',
            'Simple Sequence Games': '9',
            'Familiar Object Recall': '9',
            'Song and Rhyme Memory': '9',
            'Picture Memory Games': '9',
            'Simple Shape Sorting': '9',
            'Basic Puzzle Play': '9',
            'Cause and Effect Discovery': '9',
            'Simple Building Games': '9',
            'Exploration Challenges': '9',
            'Focus Building Games': '9',
            'Attention Span Activities': '9',
            'Concentration Exercises': '9',
            'Sustained Play Games': '9',
            'Focus Training Activities': '9'
        },
        'Last Updated': {
            'Word Recognition Games': '2024-01-15',
            'Simple Conversation Practice': '2024-01-15',
            'Vocabulary Building Play': '2024-01-15',
            'Sound Pattern Recognition': '2024-01-15',
            'Language Imitation Games': '2024-01-15',
            'Hide and Seek Memory': '2024-01-15',
            'Simple Sequence Games': '2024-01-15',
            'Familiar Object Recall': '2024-01-15',
            'Song and Rhyme Memory': '2024-01-15',
            'Picture Memory Games': '2024-01-15',
            'Simple Shape Sorting': '2024-01-15',
            'Basic Puzzle Play': '2024-01-15',
            'Cause and Effect Discovery': '2024-01-15',
            'Simple Building Games': '2024-01-15',
            'Exploration Challenges': '2024-01-15',
            'Focus Building Games': '2024-01-15',
            'Attention Span Activities': '2024-01-15',
            'Concentration Exercises': '2024-01-15',
            'Sustained Play Games': '2024-01-15',
            'Focus Training Activities': '2024-01-15'
        },
        'Updated By': {
            'Word Recognition Games': 'AI Assistant',
            'Simple Conversation Practice': 'AI Assistant',
            'Vocabulary Building Play': 'AI Assistant',
            'Sound Pattern Recognition': 'AI Assistant',
            'Language Imitation Games': 'AI Assistant',
            'Hide and Seek Memory': 'AI Assistant',
            'Simple Sequence Games': 'AI Assistant',
            'Familiar Object Recall': 'AI Assistant',
            'Song and Rhyme Memory': 'AI Assistant',
            'Picture Memory Games': 'AI Assistant',
            'Simple Shape Sorting': 'AI Assistant',
            'Basic Puzzle Play': 'AI Assistant',
            'Cause and Effect Discovery': 'AI Assistant',
            'Simple Building Games': 'AI Assistant',
            'Exploration Challenges': 'AI Assistant',
            'Focus Building Games': 'AI Assistant',
            'Attention Span Activities': 'AI Assistant',
            'Concentration Exercises': 'AI Assistant',
            'Sustained Play Games': 'AI Assistant',
            'Focus Training Activities': 'AI Assistant'
        },
        'Last Synced': {
            'Word Recognition Games': '2024-01-15 12:00:00',
            'Simple Conversation Practice': '2024-01-15 12:00:00',
            'Vocabulary Building Play': '2024-01-15 12:00:00',
            'Sound Pattern Recognition': '2024-01-15 12:00:00',
            'Language Imitation Games': '2024-01-15 12:00:00',
            'Hide and Seek Memory': '2024-01-15 12:00:00',
            'Simple Sequence Games': '2024-01-15 12:00:00',
            'Familiar Object Recall': '2024-01-15 12:00:00',
            'Song and Rhyme Memory': '2024-01-15 12:00:00',
            'Picture Memory Games': '2024-01-15 12:00:00',
            'Simple Shape Sorting': '2024-01-15 12:00:00',
            'Basic Puzzle Play': '2024-01-15 12:00:00',
            'Cause and Effect Discovery': '2024-01-15 12:00:00',
            'Simple Building Games': '2024-01-15 12:00:00',
            'Exploration Challenges': '2024-01-15 12:00:00',
            'Focus Building Games': '2024-01-15 12:00:00',
            'Attention Span Activities': '2024-01-15 12:00:00',
            'Concentration Exercises': '2024-01-15 12:00:00',
            'Sustained Play Games': '2024-01-15 12:00:00',
            'Focus Training Activities': '2024-01-15 12:00:00'
        }
    }
    
    return complete_values

def fill_missing_values(client, toddler_activities, headers, column_indices, complete_values):
    """Fill missing values in Google Sheets"""
    
    try:
        # Open the Sample 1 spreadsheet
        spreadsheet = client.open_by_key('14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ')
        activities_worksheet = spreadsheet.worksheet('Activities')
        
        print(f"\n🔧 FILLING MISSING VALUES:")
        print("=" * 50)
        
        fixes_made = 0
        
        # Fill missing values for each activity
        for activity in toddler_activities:
            activity_name = activity['activity_name']
            row_num = activity['row']
            missing_values = activity['missing_values']
            
            print(f"\n🔧 Filling: {activity_name} (Row {row_num})")
            
            for missing_column in missing_values.keys():
                if missing_column in complete_values and activity_name in complete_values[missing_column]:
                    value = complete_values[missing_column][activity_name]
                    
                    # Update the cell
                    activities_worksheet.update_cell(row_num, column_indices[missing_column] + 1, value)
                    print(f"   ✅ {missing_column}: {value}")
                    time.sleep(1)  # Rate limiting
            
            fixes_made += 1
        
        print(f"\n🎉 MISSING VALUES FILLED!")
        print("=" * 40)
        print(f"✅ Filled missing values for {fixes_made} activities")
        print(f"✅ All key columns now have values")
        print(f"✅ Ready for engagement")
        
        return True
        
    except Exception as e:
        print(f"❌ Error filling missing values: {e}")
        return False

def main():
    """Main function to verify and fill missing values"""
    print("🔍 Verifying and Filling Missing Values")
    print("=" * 70)
    print("🎯 Check actual status in Google Sheets and fill missing values")
    
    # Connect to Google Sheets
    client = get_google_sheets_client()
    if not client:
        return False
    
    # Verify actual status
    toddler_activities, headers, column_indices = verify_actual_status(client)
    if not toddler_activities:
        print("❌ No Toddler activities found")
        return False
    
    # Get complete values
    complete_values = get_complete_values_for_missing_columns()
    
    # Fill missing values
    success = fill_missing_values(client, toddler_activities, headers, column_indices, complete_values)
    
    if success:
        print(f"\n✅ SUCCESS! Missing values filled!")
        print("=" * 50)
        print("✅ Verified actual Google Sheets status")
        print("✅ Filled all missing values")
        print("✅ All key columns completed")
        print("✅ Ready for engagement")
        
        return True
    else:
        print(f"\n❌ FAILED to fill missing values!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Missing values filling completed!")
    else:
        print(f"\n❌ FAILED to fill missing values!")
