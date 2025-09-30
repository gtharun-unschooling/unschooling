#!/usr/bin/env python3
"""
🔧 Fill Missing Toddler Content
Actually fill the missing content for the 15 Toddler activities that are empty
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

def get_missing_toddler_activities(client):
    """Get the Toddler activities that are missing content"""
    
    try:
        # Open the Sample 1 spreadsheet
        spreadsheet = client.open_by_key('14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ')
        activities_worksheet = spreadsheet.worksheet('Activities')
        
        print(f"🔍 GETTING MISSING TODDLER ACTIVITIES:")
        print("=" * 50)
        
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
        steps_index = headers.index('Steps') if 'Steps' in headers else None
        skills_index = headers.index('Skills') if 'Skills' in headers else None
        objective_index = headers.index('Objective') if 'Objective' in headers else None
        materials_index = headers.index('Materials') if 'Materials' in headers else None
        category_index = headers.index('Category') if 'Category' in headers else None
        
        # Find missing Toddler activities
        missing_activities = []
        
        for row_num, row in enumerate(all_data[1:], start=2):
            if len(row) > max(pillar_col_index, age_group_col_index):
                pillar = row[pillar_col_index].strip()
                age_group = row[age_group_col_index].strip()
                
                if pillar == 'Cognitive Skills' and age_group == 'Toddler (1-3)':
                    steps = row[steps_index].strip() if len(row) > steps_index else ''
                    skills = row[skills_index].strip() if len(row) > skills_index else ''
                    objective = row[objective_index].strip() if len(row) > objective_index else ''
                    materials = row[materials_index].strip() if len(row) > materials_index else ''
                    
                    # Check if content is missing
                    if not (steps and skills and objective and materials):
                        activity_data = {
                            'row': row_num,
                            'activity_name': row[activity_name_index].strip() if len(row) > activity_name_index else '',
                            'category': row[category_index].strip() if len(row) > category_index else '',
                            'missing_steps': not bool(steps),
                            'missing_skills': not bool(skills),
                            'missing_objective': not bool(objective),
                            'missing_materials': not bool(materials)
                        }
                        missing_activities.append(activity_data)
        
        print(f"📊 Found {len(missing_activities)} Toddler activities missing content")
        
        return missing_activities, headers
        
    except Exception as e:
        print(f"❌ Error getting missing activities: {e}")
        return None, None

def get_complete_content_for_missing_activities():
    """Get complete content for the missing activities"""
    
    complete_content = {
        # Memory and Recall Activities
        'Hide and Seek Memory': {
            'steps': '1. Hide familiar objects in easy-to-find places; 2. Tell toddler what to look for; 3. Give simple clues if needed; 4. Celebrate when objects are found; 5. Ask toddler to remember where objects were; 6. Repeat with different objects',
            'skills': 'Memory Development, Object Permanence, Recall, Spatial Memory, Problem Solving',
            'objective': 'Develop memory and recall skills through hide-and-seek games that support cognitive development.',
            'materials': 'Familiar toys or objects, comfortable play area'
        },
        'Simple Sequence Games': {
            'steps': '1. Create simple sequences with 2-3 items; 2. Show toddler the sequence; 3. Mix up the items; 4. Ask toddler to recreate the sequence; 5. Provide help if needed; 6. Celebrate successful sequences',
            'skills': 'Sequential Thinking, Pattern Recognition, Memory, Logical Reasoning, Cognitive Development',
            'objective': 'Develop sequential thinking and pattern recognition through simple sequence games that support cognitive development.',
            'materials': 'Simple objects for sequencing, comfortable play area'
        },
        'Familiar Object Recall': {
            'steps': '1. Show toddler 3-4 familiar objects; 2. Name each object clearly; 3. Cover objects with a cloth; 4. Ask toddler to name objects from memory; 5. Reveal objects to check answers; 6. Celebrate correct recalls',
            'skills': 'Memory Recall, Object Recognition, Vocabulary, Attention, Cognitive Development',
            'objective': 'Develop memory recall and object recognition through familiar object games that support cognitive development.',
            'materials': '3-4 familiar objects, cloth for covering, comfortable area'
        },
        'Song and Rhyme Memory': {
            'steps': '1. Sing familiar songs or nursery rhymes; 2. Encourage toddler to join in; 3. Pause and let toddler fill in words; 4. Repeat songs multiple times; 5. Celebrate when toddler remembers words; 6. Add new songs gradually',
            'skills': 'Auditory Memory, Language Development, Rhythm, Pattern Recognition, Social Interaction',
            'objective': 'Develop auditory memory and language skills through song and rhyme repetition that supports cognitive development.',
            'materials': 'Familiar songs or nursery rhymes, comfortable environment'
        },
        'Picture Memory Games': {
            'steps': '1. Show toddler 2-3 simple pictures; 2. Name each picture clearly; 3. Remove pictures from view; 4. Ask toddler to remember what they saw; 5. Show pictures again to check; 6. Celebrate correct memories',
            'skills': 'Visual Memory, Picture Recognition, Vocabulary, Attention, Cognitive Development',
            'objective': 'Develop visual memory and picture recognition through simple picture games that support cognitive development.',
            'materials': 'Simple, colorful pictures, comfortable viewing area'
        },
        
        # Problem Solving Basics Activities
        'Simple Shape Sorting': {
            'steps': '1. Provide simple shape sorting toy; 2. Show toddler how to match shapes; 3. Let toddler try independently; 4. Provide gentle guidance if needed; 5. Celebrate successful matches; 6. Encourage continued sorting',
            'skills': 'Shape Recognition, Problem Solving, Hand-Eye Coordination, Logical Thinking, Fine Motor Skills',
            'objective': 'Develop shape recognition and problem-solving skills through simple sorting activities that support cognitive development.',
            'materials': 'Simple shape sorting toy, comfortable play area'
        },
        'Basic Puzzle Play': {
            'steps': '1. Provide simple 2-4 piece puzzles; 2. Show toddler how pieces fit together; 3. Let toddler try independently; 4. Provide help when frustrated; 5. Celebrate completed puzzles; 6. Gradually increase difficulty',
            'skills': 'Problem Solving, Spatial Reasoning, Hand-Eye Coordination, Persistence, Cognitive Development',
            'objective': 'Develop problem-solving and spatial reasoning skills through basic puzzle play that support cognitive development.',
            'materials': 'Simple 2-4 piece puzzles, comfortable play area'
        },
        'Cause and Effect Discovery': {
            'steps': '1. Use simple cause-effect toys; 2. Demonstrate the action and result; 3. Let toddler try the action; 4. Celebrate when effect occurs; 5. Encourage repeated attempts; 6. Explore different cause-effect relationships',
            'skills': 'Cause and Effect Understanding, Problem Solving, Exploration, Logical Thinking, Cognitive Development',
            'objective': 'Develop understanding of cause and effect relationships through interactive discovery games that support cognitive development.',
            'materials': 'Simple cause-effect toys, comfortable play area'
        },
        'Simple Building Games': {
            'steps': '1. Provide large, safe building blocks; 2. Show toddler how to stack blocks; 3. Let toddler build freely; 4. Encourage different structures; 5. Celebrate successful builds; 6. Discuss what was built',
            'skills': 'Building Skills, Spatial Reasoning, Problem Solving, Creativity, Fine Motor Skills',
            'objective': 'Develop building skills and spatial reasoning through simple construction games that support cognitive development.',
            'materials': 'Large, safe building blocks, comfortable play area'
        },
        'Exploration Challenges': {
            'steps': '1. Set up safe exploration area with various objects; 2. Let toddler explore freely; 3. Observe what interests them; 4. Ask questions about discoveries; 5. Encourage continued exploration; 6. Discuss findings together',
            'skills': 'Exploration, Discovery, Problem Solving, Curiosity, Cognitive Development',
            'objective': 'Encourage exploration and discovery through safe, guided exploration activities that support cognitive development.',
            'materials': 'Various safe objects for exploration, comfortable play area'
        },
        
        # Attention and Focus Activities
        'Focus Building Games': {
            'steps': '1. Choose one engaging activity; 2. Set up distraction-free environment; 3. Guide toddler to focus on activity; 4. Encourage sustained attention; 5. Celebrate focused moments; 6. Gradually increase focus time',
            'skills': 'Attention Development, Focus, Concentration, Self-Regulation, Cognitive Control',
            'objective': 'Develop attention span and focus through engaging activities that support cognitive development.',
            'materials': 'Engaging, age-appropriate activity materials, quiet environment'
        },
        'Attention Span Activities': {
            'steps': '1. Choose activity that matches toddler\'s interests; 2. Set clear start and end points; 3. Encourage completion of activity; 4. Provide gentle reminders to focus; 5. Celebrate when activity is completed; 6. Gradually extend activity time',
            'skills': 'Attention Span, Task Completion, Persistence, Self-Control, Cognitive Development',
            'objective': 'Develop attention span and task completion skills through engaging activities that support cognitive development.',
            'materials': 'Age-appropriate activity materials, comfortable environment'
        },
        'Concentration Exercises': {
            'steps': '1. Set up quiet, focused environment; 2. Choose simple concentration activity; 3. Guide toddler through activity; 4. Encourage sustained concentration; 5. Provide gentle support when needed; 6. Celebrate concentration efforts',
            'skills': 'Concentration, Mental Focus, Self-Regulation, Cognitive Control, Attention',
            'objective': 'Develop concentration and mental focus through structured exercises that support cognitive development.',
            'materials': 'Simple concentration activities, quiet environment'
        },
        'Sustained Play Games': {
            'steps': '1. Choose engaging, open-ended play activity; 2. Set up inviting play environment; 3. Let toddler engage with activity; 4. Encourage extended play; 5. Join in when appropriate; 6. Celebrate sustained engagement',
            'skills': 'Sustained Attention, Extended Play, Engagement, Creativity, Cognitive Development',
            'objective': 'Develop sustained attention and extended play skills through engaging activities that support cognitive development.',
            'materials': 'Open-ended play materials, comfortable play environment'
        },
        'Focus Training Activities': {
            'steps': '1. Create focus training environment; 2. Introduce simple focus exercises; 3. Guide toddler through exercises; 4. Practice sustained attention; 5. Provide positive reinforcement; 6. Gradually increase difficulty',
            'skills': 'Focus Training, Attention Control, Mental Discipline, Self-Regulation, Cognitive Development',
            'objective': 'Develop focus training and attention control through structured exercises that support cognitive development.',
            'materials': 'Focus training materials, quiet environment'
        }
    }
    
    return complete_content

def fill_missing_content(client, missing_activities, headers, complete_content):
    """Fill the missing content for Toddler activities"""
    
    try:
        # Open the Sample 1 spreadsheet
        spreadsheet = client.open_by_key('14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ')
        activities_worksheet = spreadsheet.worksheet('Activities')
        
        print(f"\n🔧 FILLING MISSING CONTENT:")
        print("=" * 50)
        
        # Find column indices
        steps_index = headers.index('Steps') if 'Steps' in headers else None
        skills_index = headers.index('Skills') if 'Skills' in headers else None
        objective_index = headers.index('Objective') if 'Objective' in headers else None
        materials_index = headers.index('Materials') if 'Materials' in headers else None
        
        fixes_made = 0
        
        # Fill missing content for each activity
        for activity in missing_activities:
            activity_name = activity['activity_name']
            row_num = activity['row']
            
            if activity_name in complete_content:
                content = complete_content[activity_name]
                
                print(f"\n🔧 Filling: {activity_name} (Row {row_num})")
                
                # Fill Steps if missing
                if activity['missing_steps'] and steps_index is not None:
                    activities_worksheet.update_cell(row_num, steps_index + 1, content['steps'])
                    print(f"   ✅ Steps: Filled")
                    time.sleep(1)  # Rate limiting
                
                # Fill Skills if missing
                if activity['missing_skills'] and skills_index is not None:
                    activities_worksheet.update_cell(row_num, skills_index + 1, content['skills'])
                    print(f"   ✅ Skills: Filled")
                    time.sleep(1)  # Rate limiting
                
                # Fill Objective if missing
                if activity['missing_objective'] and objective_index is not None:
                    activities_worksheet.update_cell(row_num, objective_index + 1, content['objective'])
                    print(f"   ✅ Objective: Filled")
                    time.sleep(1)  # Rate limiting
                
                # Fill Materials if missing
                if activity['missing_materials'] and materials_index is not None:
                    activities_worksheet.update_cell(row_num, materials_index + 1, content['materials'])
                    print(f"   ✅ Materials: Filled")
                    time.sleep(1)  # Rate limiting
                
                fixes_made += 1
        
        print(f"\n🎉 MISSING CONTENT FILLED!")
        print("=" * 40)
        print(f"✅ Filled content for {fixes_made} activities")
        print(f"✅ All missing Steps, Skills, Objectives, and Materials filled")
        print(f"✅ Ready for engagement")
        
        return True
        
    except Exception as e:
        print(f"❌ Error filling missing content: {e}")
        return False

def main():
    """Main function to fill missing Toddler content"""
    print("🔧 Filling Missing Toddler Content")
    print("=" * 70)
    print("🎯 Fill the missing content for 15 Toddler activities that are empty")
    
    # Connect to Google Sheets
    client = get_google_sheets_client()
    if not client:
        return False
    
    # Get missing activities
    missing_activities, headers = get_missing_toddler_activities(client)
    if not missing_activities:
        print("❌ No missing Toddler activities found")
        return False
    
    # Get complete content
    complete_content = get_complete_content_for_missing_activities()
    
    # Fill missing content
    success = fill_missing_content(client, missing_activities, headers, complete_content)
    
    if success:
        print(f"\n✅ SUCCESS! Missing content filled!")
        print("=" * 50)
        print("✅ Filled content for all missing Toddler activities")
        print("✅ All Steps, Skills, Objectives, and Materials completed")
        print("✅ Ready for engagement")
        
        return True
    else:
        print(f"\n❌ FAILED to fill missing content!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Missing content filling completed!")
    else:
        print(f"\n❌ FAILED to fill missing content!")
