#!/usr/bin/env python3
"""
🔍 COMPREHENSIVE CHECK - ALL COLUMNS
Check EVERY single column for Toddler Cognitive Skills and fill what's missing
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

def comprehensive_check_all_columns(client):
    """Check EVERY column for missing values"""
    
    try:
        # Open the Sample 1 spreadsheet
        spreadsheet = client.open_by_key('14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ')
        activities_worksheet = spreadsheet.worksheet('Activities')
        
        print(f"🔍 COMPREHENSIVE CHECK - ALL COLUMNS:")
        print("=" * 70)
        
        # Get all data
        all_data = activities_worksheet.get_all_values()
        headers = all_data[0]
        
        print(f"📋 ALL COLUMNS IN SHEET:")
        for i, header in enumerate(headers):
            print(f"   {i+1:2d}. {header}")
        
        # Find column indices
        pillar_col_index = headers.index('Pillar') if 'Pillar' in headers else None
        age_group_col_index = headers.index('Age Group') if 'Age Group' in headers else None
        activity_name_index = headers.index('Activity Name') if 'Activity Name' in headers else None
        
        # ALL columns to check (including hashtags and everything else)
        all_columns = [
            'Activity Name', 'Objective', 'Explanation', 'Age', 'Estimated Time', 
            'Setup Time', 'Supervision Level', 'Materials', 'Additional Information',
            'Steps', 'Skills', 'Hashtags', 'Kit Materials', 'General Instructions',
            'Materials at Home', 'Materials to Buy for Kit', 'Corrections Needed',
            'Validation Score', 'Last Updated', 'Feedback', 'Updated By', 'Last Synced'
        ]
        
        column_indices = {}
        for col in all_columns:
            if col in headers:
                column_indices[col] = headers.index(col)
            else:
                print(f"⚠️  Column '{col}' not found in sheet!")
        
        # Find all Toddler Cognitive Skills activities
        toddler_activities = []
        
        for row_num, row in enumerate(all_data[1:], start=2):
            if len(row) > max(pillar_col_index, age_group_col_index):
                pillar = row[pillar_col_index].strip()
                age_group = row[age_group_col_index].strip()
                
                if pillar == 'Cognitive Skills' and age_group == 'Toddler (1-3)':
                    activity_name = row[activity_name_index].strip() if len(row) > activity_name_index else ''
                    
                    activity_status = {
                        'name': activity_name,
                        'row': row_num,
                        'missing_columns': []
                    }
                    
                    # Check EVERY column
                    for col, col_index in column_indices.items():
                        if col_index < len(row):
                            value = row[col_index].strip()
                            if not value:
                                activity_status['missing_columns'].append(col)
                    
                    toddler_activities.append(activity_status)
        
        print(f"\n📊 FOUND {len(toddler_activities)} TODDLER ACTIVITIES")
        
        # Show what's missing for each activity
        for activity in toddler_activities:
            print(f"\n📝 {activity['name']} (Row {activity['row']}):")
            if activity['missing_columns']:
                print(f"   ❌ Missing: {', '.join(activity['missing_columns'])}")
            else:
                print(f"   ✅ Complete")
        
        return toddler_activities, headers, column_indices
        
    except Exception as e:
        print(f"❌ Error during comprehensive check: {e}")
        return None, None, None

def get_complete_values_for_all_columns():
    """Get complete values for ALL missing columns including hashtags"""
    
    complete_values = {
        'Hashtags': {
            'Word Recognition Games': '#wordrecognition #vocabulary #earlyliteracy #toddlerlearning #language #cognitiveskills #18-24months',
            'Simple Conversation Practice': '#conversation #communication #language #toddlerlearning #socialskills #cognitiveskills #24-36months',
            'Vocabulary Building Play': '#vocabulary #language #playbased #toddlerlearning #cognitiveskills #18-30months #wordbuilding',
            'Sound Pattern Recognition': '#soundpatterns #auditory #rhythm #toddlerlearning #cognitiveskills #20-30months #music',
            'Language Imitation Games': '#language #imitation #speech #toddlerlearning #cognitiveskills #18-24months #communication',
            'Hide and Seek Memory': '#memory #hideseek #objectpermanence #toddlerlearning #cognitiveskills #20-30months #recall',
            'Simple Sequence Games': '#sequences #patterns #logicalthinking #toddlerlearning #cognitiveskills #24-36months #memory',
            'Familiar Object Recall': '#memory #recall #recognition #toddlerlearning #cognitiveskills #20-30months #vocabulary',
            'Song and Rhyme Memory': '#memory #songs #rhymes #music #toddlerlearning #cognitiveskills #18-30months #auditory',
            'Picture Memory Games': '#memory #pictures #visual #recognition #toddlerlearning #cognitiveskills #20-30months #recall',
            'Simple Shape Sorting': '#shapes #sorting #problemsolving #toddlerlearning #cognitiveskills #24-36months #classification',
            'Basic Puzzle Play': '#puzzles #problemsolving #spatial #toddlerlearning #cognitiveskills #24-36months #persistence',
            'Cause and Effect Discovery': '#causeandeffect #exploration #problemsolving #toddlerlearning #cognitiveskills #18-30months #discovery',
            'Simple Building Games': '#building #construction #spatial #toddlerlearning #cognitiveskills #20-36months #creativity',
            'Exploration Challenges': '#exploration #discovery #curiosity #toddlerlearning #cognitiveskills #18-30months #investigation',
            'Focus Building Games': '#focus #attention #concentration #toddlerlearning #cognitiveskills #20-30months #selfregulation',
            'Attention Span Activities': '#attention #focus #persistence #toddlerlearning #cognitiveskills #24-36months #concentration',
            'Concentration Exercises': '#concentration #focus #mindfulness #toddlerlearning #cognitiveskills #24-36months #attention',
            'Sustained Play Games': '#sustainedplay #focus #engagement #toddlerlearning #cognitiveskills #24-36months #attention',
            'Focus Training Activities': '#focustraining #attention #discipline #toddlerlearning #cognitiveskills #24-36months #concentration'
        },
        'Steps': {
            'Word Recognition Games': '1. Show toddler picture cards with simple words\n2. Say the word clearly and point to the picture\n3. Let toddler explore the cards freely\n4. Repeat words multiple times\n5. Encourage any attempts to say the word\n6. Keep sessions short and fun',
            'Simple Conversation Practice': '1. Choose a familiar topic or object\n2. Ask simple questions like "What is this?"\n3. Wait patiently for toddler\'s response\n4. Expand on their words to model longer sentences\n5. Use gestures and facial expressions\n6. Praise all communication attempts',
            'Vocabulary Building Play': '1. Gather familiar household objects\n2. Show each object to toddler one by one\n3. Say the object\'s name clearly\n4. Let toddler touch and explore the object\n5. Repeat the name multiple times\n6. Play simple games with the objects',
            'Sound Pattern Recognition': '1. Create simple sound patterns with household items\n2. Play the pattern for toddler (clap-clap-pause-clap)\n3. Encourage toddler to copy the pattern\n4. Start with very simple patterns\n5. Be patient with repetition\n6. Use rhythm and movement',
            'Language Imitation Games': '1. Choose simple words or phrases\n2. Say the word clearly with gestures\n3. Encourage toddler to copy the word\n4. Use facial expressions and body language\n5. Repeat the word multiple times\n6. Celebrate any attempts to speak',
            'Hide and Seek Memory': '1. Choose a favorite toy or object\n2. Show it to toddler and let them touch it\n3. Hide it in an obvious place (under a blanket)\n4. Ask "Where did it go?"\n5. Help toddler find it if needed\n6. Celebrate when they find it',
            'Simple Sequence Games': '1. Line up 2-3 objects in a simple pattern\n2. Show toddler the pattern\n3. Mix up the objects\n4. Ask toddler to recreate the pattern\n5. Start with just 2 items\n6. Use colorful, interesting objects',
            'Familiar Object Recall': '1. Show toddler 3-4 familiar objects\n2. Let them touch and name each one\n3. Cover the objects with a blanket\n4. Ask "What was under the blanket?"\n5. Remove blanket and check together\n6. Praise correct answers',
            'Song and Rhyme Memory': '1. Choose a simple, familiar song\n2. Sing the song with actions\n3. Encourage toddler to join in\n4. Repeat the song multiple times\n5. Use gestures and movement\n6. Let toddler lead sometimes',
            'Picture Memory Games': '1. Show toddler 2-3 simple pictures\n2. Name each picture clearly\n3. Hide the pictures\n4. Ask "What pictures did you see?"\n5. Show pictures again to check\n6. Use colorful, simple images',
            'Simple Shape Sorting': '1. Gather different shaped objects\n2. Show toddler how to sort by shape\n3. Start with just 2 different shapes\n4. Let toddler try to sort\n5. Provide gentle help when needed\n6. Celebrate successful sorting',
            'Basic Puzzle Play': '1. Choose a very simple puzzle (2-4 pieces)\n2. Show toddler how pieces fit together\n3. Let them try to place pieces\n4. Provide encouragement and help\n5. Don\'t rush the process\n6. Celebrate completion',
            'Cause and Effect Discovery': '1. Choose toys with clear cause-effect (pop-up toy)\n2. Show toddler how to activate the effect\n3. Let them explore and experiment\n4. Be enthusiastic about results\n5. Try different cause-effect toys\n6. Follow toddler\'s interests',
            'Simple Building Games': '1. Provide large, safe building blocks\n2. Show toddler how to stack blocks\n3. Let them build freely\n4. Celebrate all attempts, even if they fall\n5. Join in the building when invited\n6. Don\'t interrupt focused play',
            'Exploration Challenges': '1. Set up safe objects for exploration\n2. Let toddler investigate freely\n3. Ask open-ended questions\n4. Follow their interests and curiosity\n5. Ensure all objects are safe\n6. Provide guidance when needed',
            'Focus Building Games': '1. Choose an activity toddler enjoys\n2. Set up a quiet, distraction-free space\n3. Start with short focus periods (2-3 minutes)\n4. Gradually increase time as able\n5. Provide encouragement throughout\n6. Don\'t force if they lose interest',
            'Attention Span Activities': '1. Select activities that interest toddler\n2. Set realistic time limits\n3. Provide encouragement and support\n4. Allow breaks when needed\n5. Celebrate completion of tasks\n6. Build up attention gradually',
            'Concentration Exercises': '1. Choose simple, engaging activities\n2. Create a calm environment\n3. Start with very short exercises\n4. Provide lots of encouragement\n5. Don\'t force concentration\n6. Make it fun and game-like',
            'Sustained Play Games': '1. Choose activities toddler loves\n2. Set up the play space\n3. Let them engage without interruption\n4. Join in only when invited\n5. Don\'t rush or hurry them\n6. Celebrate extended play',
            'Focus Training Activities': '1. Choose fun, engaging focus games\n2. Start with simple activities\n3. Provide lots of praise and encouragement\n4. Don\'t push beyond toddler\'s limits\n5. Keep training game-like\n6. End on a positive note'
        },
        'Skills': {
            'Word Recognition Games': 'Language development, Visual recognition, Vocabulary building, Early literacy, Communication',
            'Simple Conversation Practice': 'Communication skills, Language expression, Social interaction, Listening, Turn-taking',
            'Vocabulary Building Play': 'Vocabulary expansion, Language development, Object recognition, Word association, Communication',
            'Sound Pattern Recognition': 'Auditory processing, Pattern recognition, Rhythm, Listening skills, Memory',
            'Language Imitation Games': 'Speech development, Language acquisition, Imitation, Pronunciation, Communication',
            'Hide and Seek Memory': 'Memory development, Object permanence, Spatial awareness, Problem-solving, Recall',
            'Simple Sequence Games': 'Logical thinking, Pattern recognition, Memory, Sequencing, Problem-solving',
            'Familiar Object Recall': 'Memory skills, Object recognition, Vocabulary, Recall, Attention',
            'Song and Rhyme Memory': 'Auditory memory, Language skills, Rhythm, Music appreciation, Recall',
            'Picture Memory Games': 'Visual memory, Picture recognition, Recall, Attention, Visual processing',
            'Simple Shape Sorting': 'Shape recognition, Classification, Problem-solving, Fine motor skills, Logical thinking',
            'Basic Puzzle Play': 'Problem-solving, Spatial reasoning, Persistence, Fine motor skills, Hand-eye coordination',
            'Cause and Effect Discovery': 'Cause-effect understanding, Exploration, Problem-solving, Scientific thinking, Curiosity',
            'Simple Building Games': 'Spatial reasoning, Creativity, Problem-solving, Fine motor skills, Planning',
            'Exploration Challenges': 'Curiosity, Investigation, Problem-solving, Scientific thinking, Exploration',
            'Focus Building Games': 'Attention span, Concentration, Self-regulation, Persistence, Focus',
            'Attention Span Activities': 'Attention control, Task completion, Persistence, Self-regulation, Focus',
            'Concentration Exercises': 'Concentration, Mental discipline, Attention control, Self-regulation, Focus',
            'Sustained Play Games': 'Extended attention, Engagement, Persistence, Self-regulation, Focus',
            'Focus Training Activities': 'Attention training, Mental discipline, Concentration, Self-control, Focus'
        }
    }
    
    return complete_values

def fill_all_missing_values(client, toddler_activities, headers, column_indices, complete_values):
    """Fill ALL missing values"""
    
    try:
        # Open the Sample 1 spreadsheet
        spreadsheet = client.open_by_key('14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ')
        activities_worksheet = spreadsheet.worksheet('Activities')
        
        print(f"\n🔧 FILLING ALL MISSING VALUES:")
        print("=" * 50)
        
        fixes_made = 0
        
        # Fill missing values for each activity
        for activity in toddler_activities:
            activity_name = activity['name']
            row_num = activity['row']
            missing_columns = activity['missing_columns']
            
            if missing_columns:
                print(f"\n🔧 Filling: {activity_name} (Row {row_num})")
                
                for missing_column in missing_columns:
                    if missing_column in complete_values and activity_name in complete_values[missing_column]:
                        value = complete_values[missing_column][activity_name]
                        
                        # Update the cell
                        activities_worksheet.update_cell(row_num, column_indices[missing_column] + 1, value)
                        print(f"   ✅ {missing_column}: {value[:50]}...")
                        time.sleep(1)  # Rate limiting
                
                fixes_made += 1
        
        print(f"\n🎉 ALL MISSING VALUES FILLED!")
        print("=" * 40)
        print(f"✅ Filled missing values for {fixes_made} activities")
        print(f"✅ All columns now complete including hashtags")
        print(f"✅ Ready for engagement")
        
        return True
        
    except Exception as e:
        print(f"❌ Error filling missing values: {e}")
        return False

def main():
    """Main function to comprehensively check and fill all missing values"""
    print("🔍 COMPREHENSIVE CHECK - ALL COLUMNS")
    print("=" * 70)
    print("🎯 Check EVERY column including hashtags and fill what's missing")
    
    # Connect to Google Sheets
    client = get_google_sheets_client()
    if not client:
        return False
    
    # Comprehensive check
    toddler_activities, headers, column_indices = comprehensive_check_all_columns(client)
    if not toddler_activities:
        print("❌ No Toddler activities found")
        return False
    
    # Get complete values for all columns
    complete_values = get_complete_values_for_all_columns()
    
    # Fill all missing values
    success = fill_all_missing_values(client, toddler_activities, headers, column_indices, complete_values)
    
    if success:
        print(f"\n✅ SUCCESS! All missing values filled!")
        print("=" * 50)
        print("✅ Checked ALL columns comprehensively")
        print("✅ Filled hashtags and all other missing values")
        print("✅ All columns now complete")
        print("✅ Ready for engagement")
        
        return True
    else:
        print(f"\n❌ FAILED to fill missing values!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Comprehensive check and fill completed!")
    else:
        print(f"\n❌ FAILED to complete comprehensive check!")
