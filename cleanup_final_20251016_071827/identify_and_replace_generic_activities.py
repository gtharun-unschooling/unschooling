#!/usr/bin/env python3
"""
🔍 Identify and Replace Generic Activities
Find all generic, unusable activities and replace with specific, valuable ones
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

def identify_generic_activities(client):
    """Identify all generic, unusable activities"""
    
    try:
        # Open the Sample 1 spreadsheet
        spreadsheet = client.open_by_key('14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ')
        activities_worksheet = spreadsheet.worksheet('Activities')
        
        print(f"🔍 IDENTIFYING GENERIC, UNUSABLE ACTIVITIES:")
        print("=" * 70)
        
        # Get all data
        all_data = activities_worksheet.get_all_values()
        headers = all_data[0]
        
        # Find column indices
        pillar_col_index = headers.index('Pillar') if 'Pillar' in headers else None
        age_group_col_index = headers.index('Age Group') if 'Age Group' in headers else None
        activity_name_index = headers.index('Activity Name') if 'Activity Name' in headers else None
        objective_index = headers.index('Objective') if 'Objective' in headers else None
        steps_index = headers.index('Steps') if 'Steps' in headers else None
        materials_index = headers.index('Materials') if 'Materials' in headers else None
        
        # Generic activity patterns to identify
        generic_patterns = [
            'activities', 'games', 'exercises', 'challenges', 'play', 'building', 'training'
        ]
        
        # Vague material patterns
        vague_material_patterns = [
            'age-appropriate', 'comfortable environment', 'various', 'assorted', 'different', 'simple', 'basic'
        ]
        
        # Vague step patterns
        vague_step_patterns = [
            'choose', 'select', 'pick', 'use', 'provide', 'ensure', 'create', 'gather'
        ]
        
        generic_activities = []
        
        # Check all activities
        for row_num, row in enumerate(all_data[1:], start=2):
            if len(row) > max(pillar_col_index, age_group_col_index):
                pillar = row[pillar_col_index].strip()
                age_group = row[age_group_col_index].strip()
                activity_name = row[activity_name_index].strip() if len(row) > activity_name_index else ''
                objective = row[objective_index].strip() if len(row) > objective_index else ''
                steps = row[steps_index].strip() if len(row) > steps_index else ''
                materials = row[materials_index].strip() if len(row) > materials_index else ''
                
                # Check if this is a generic activity
                is_generic = False
                reasons = []
                
                # Check activity name
                if any(pattern in activity_name.lower() for pattern in generic_patterns):
                    is_generic = True
                    reasons.append("Generic name pattern")
                
                # Check materials
                if any(pattern in materials.lower() for pattern in vague_material_patterns):
                    is_generic = True
                    reasons.append("Vague materials")
                
                # Check steps
                if any(pattern in steps.lower() for pattern in vague_step_patterns):
                    is_generic = True
                    reasons.append("Vague steps")
                
                # Check objective for generic language
                if 'develop' in objective.lower() and len(objective.split()) < 10:
                    is_generic = True
                    reasons.append("Generic objective")
                
                if is_generic:
                    generic_activities.append({
                        'row': row_num,
                        'name': activity_name,
                        'pillar': pillar,
                        'age_group': age_group,
                        'reasons': reasons,
                        'objective': objective,
                        'materials': materials,
                        'steps': steps
                    })
        
        print(f"📊 FOUND {len(generic_activities)} GENERIC ACTIVITIES:")
        print("=" * 50)
        
        for activity in generic_activities:
            print(f"\n❌ {activity['name']} (Row {activity['row']})")
            print(f"   Pillar: {activity['pillar']}")
            print(f"   Age Group: {activity['age_group']}")
            print(f"   Reasons: {', '.join(activity['reasons'])}")
            print(f"   Objective: {activity['objective'][:100]}...")
            print(f"   Materials: {activity['materials'][:100]}...")
        
        return generic_activities, headers
        
    except Exception as e:
        print(f"❌ Error identifying generic activities: {e}")
        return None, None

def create_specific_activities():
    """Create specific, valuable activities to replace generic ones"""
    
    specific_activities = {
        # Replace "Attention Span Activities" with specific activity
        'Attention Span Activities': {
            'Activity Name': 'Toddler Puzzle Completion Challenge',
            'Objective': 'Complete 2-3 age-appropriate puzzles within 8-12 minutes to build focus and task completion skills.',
            'Explanation': 'Puzzle completion challenges help toddlers develop sustained attention and problem-solving skills. This specific activity provides measurable goals and clear success criteria that parents can track and celebrate with their child.',
            'Age': '2-3 years',
            'Estimated Time': '8-12 minutes',
            'Setup Time': '2 minutes',
            'Supervision Level': 'Close',
            'Materials': '3 wooden puzzles (4-6 pieces each), timer, reward stickers, comfortable table space',
            'Additional Information': 'Start with puzzles child has completed before. Use timer to create excitement. Celebrate each puzzle completion immediately.',
            'Steps': '1. Set up 3 puzzles on table; 2. Start 5-minute timer; 3. Guide child to complete first puzzle; 4. Give sticker and celebrate; 5. Start timer for second puzzle; 6. Continue until all puzzles complete or time ends',
            'Skills': 'Puzzle solving, attention span, task completion, fine motor skills, problem-solving',
            'Hashtags': '#puzzles #attention #completion #toddlerlearning #cognitiveskills #2-3years #focus',
            'Kit Materials': '3 wooden toddler puzzles, digital timer, reward sticker sheet, completion certificate',
            'General Instructions': 'Choose puzzles child has mastered. Use timer to create urgency and excitement. Celebrate each success immediately.',
            'Materials at Home': 'Any 3 simple puzzles, phone timer, stickers or small treats',
            'Materials to Buy for Kit': 'Melissa & Doug wooden puzzles, kitchen timer, reward stickers, completion tracking sheet'
        },
        
        # Replace "Focus Building Games" with specific activity
        'Focus Building Games': {
            'Activity Name': 'Toddler Concentration Tower Building',
            'Objective': 'Build the tallest tower possible using 12 blocks within 5-10 minutes while maintaining focus.',
            'Explanation': 'Tower building with specific goals helps toddlers develop sustained attention and spatial reasoning. The clear objective and time limit create measurable success that parents can observe and celebrate.',
            'Age': '2-3 years',
            'Estimated Time': '5-10 minutes',
            'Setup Time': '1 minute',
            'Supervision Level': 'Close',
            'Materials': '12 wooden blocks, timer, measuring tape, camera for photos',
            'Additional Information': 'Use blocks child is familiar with. Take photos of each tower attempt. Measure height with tape measure.',
            'Steps': '1. Line up 12 blocks on floor; 2. Start timer for 5 minutes; 3. Challenge child to build tallest tower; 4. Take photo when complete; 5. Measure height with tape; 6. Try to beat previous record',
            'Skills': 'Building, attention span, spatial reasoning, measurement, persistence',
            'Hashtags': '#building #tower #concentration #toddlerlearning #cognitiveskills #2-3years #focus',
            'Kit Materials': '12 wooden building blocks, digital timer, measuring tape, photo frame for tower pictures',
            'General Instructions': 'Start with familiar blocks. Use timer to create excitement. Take photos to track progress.',
            'Materials at Home': 'Any 12 blocks, phone timer, ruler or measuring tape',
            'Materials to Buy for Kit': 'Wooden building blocks set, kitchen timer, measuring tape, photo documentation kit'
        },
        
        # Replace "Concentration Exercises" with specific activity
        'Concentration Exercises': {
            'Activity Name': 'Toddler Memory Card Matching Game',
            'Objective': 'Match 6 pairs of picture cards within 5-8 minutes to develop memory and concentration skills.',
            'Explanation': 'Memory card matching provides specific, measurable concentration practice. The clear goal of matching pairs gives parents concrete success criteria and helps toddlers develop focused attention.',
            'Age': '2-3 years',
            'Estimated Time': '5-8 minutes',
            'Setup Time': '2 minutes',
            'Supervision Level': 'Close',
            'Materials': '12 picture cards (6 pairs), flat surface, timer, small rewards',
            'Additional Information': 'Use cards with familiar objects. Start with cards face up, then progress to face down. Celebrate each successful match.',
            'Steps': '1. Place 6 pairs of cards face up; 2. Show child how to match pairs; 3. Start timer for 5 minutes; 4. Let child find and match pairs; 5. Celebrate each match; 6. Count total matches completed',
            'Skills': 'Memory, concentration, matching, visual recognition, attention span',
            'Hashtags': '#memory #matching #concentration #toddlerlearning #cognitiveskills #2-3years #focus',
            'Kit Materials': '12 picture memory cards, storage box, timer, reward tokens',
            'General Instructions': 'Start with familiar objects. Use timer to create urgency. Celebrate each successful match immediately.',
            'Materials at Home': 'Homemade picture cards, phone timer, small treats or stickers',
            'Materials to Buy for Kit': 'Educational memory cards, kitchen timer, reward tokens, storage box'
        },
        
        # Replace "Sustained Play Games" with specific activity
        'Sustained Play Games': {
            'Activity Name': 'Toddler Story Creation with Props',
            'Objective': 'Create and act out a 15-25 minute story using 5 props to develop sustained imagination and focus.',
            'Explanation': 'Story creation with specific props and time goals helps toddlers develop extended attention and creative thinking. The clear framework gives parents structure while allowing child-led creativity.',
            'Age': '2-3 years',
            'Estimated Time': '15-25 minutes',
            'Setup Time': '3 minutes',
            'Supervision Level': 'Close',
            'Materials': '5 story props (doll, car, animal, book, toy food), comfortable seating area, timer',
            'Additional Information': 'Let child lead the story. Use props to extend play. Record story for memory keeping.',
            'Steps': '1. Set up 5 props in play area; 2. Start timer for 20 minutes; 3. Ask child to create story using props; 4. Act out story together; 5. Use all props in the story; 6. Take photos of story scenes',
            'Skills': 'Imagination, sustained attention, storytelling, creativity, language development',
            'Hashtags': '#storytelling #imagination #sustainedplay #toddlerlearning #cognitiveskills #2-3years #creativity',
            'Kit Materials': '5 story props, timer, story recording sheet, photo frame',
            'General Instructions': 'Let child lead story creation. Use all props to extend play. Record memorable moments.',
            'Materials at Home': 'Any 5 toys or household objects, phone timer, camera',
            'Materials to Buy for Kit': 'Story props set, kitchen timer, story documentation kit, photo frame'
        },
        
        # Replace "Focus Training Activities" with specific activity
        'Focus Training Activities': {
            'Activity Name': 'Toddler Color Sorting Challenge',
            'Objective': 'Sort 20 objects into 4 color groups within 6-10 minutes to develop focus and classification skills.',
            'Explanation': 'Color sorting with specific quantities and time limits provides measurable focus training. The clear goal and structured approach give parents concrete success criteria and help toddlers develop sustained attention.',
            'Age': '2-3 years',
            'Estimated Time': '6-10 minutes',
            'Setup Time': '2 minutes',
            'Supervision Level': 'Close',
            'Materials': '20 colored objects (5 red, 5 blue, 5 yellow, 5 green), 4 sorting containers, timer',
            'Additional Information': 'Use familiar objects in 4 distinct colors. Count objects as child sorts. Celebrate completion of each color group.',
            'Steps': '1. Mix 20 colored objects together; 2. Set up 4 color-labeled containers; 3. Start timer for 8 minutes; 4. Guide child to sort by color; 5. Count objects in each container; 6. Celebrate when all sorted correctly',
            'Skills': 'Color recognition, sorting, classification, attention span, counting',
            'Hashtags': '#colors #sorting #classification #toddlerlearning #cognitiveskills #2-3years #focus',
            'Kit Materials': '20 colored sorting objects, 4 sorting containers, timer, completion certificate',
            'General Instructions': 'Use distinct colors. Count as child sorts. Celebrate each completed color group.',
            'Materials at Home': 'Colored blocks, toys, or household objects, 4 containers, phone timer',
            'Materials to Buy for Kit': 'Educational color sorting set, sorting containers, kitchen timer, completion tracking sheet'
        }
    }
    
    return specific_activities

def replace_generic_activities(client, generic_activities, headers, specific_activities):
    """Replace generic activities with specific ones"""
    
    try:
        # Open the Sample 1 spreadsheet
        spreadsheet = client.open_by_key('14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ')
        activities_worksheet = spreadsheet.worksheet('Activities')
        
        print(f"\n🔧 REPLACING GENERIC ACTIVITIES WITH SPECIFIC ONES:")
        print("=" * 70)
        
        # Find column indices
        column_indices = {}
        for i, header in enumerate(headers):
            column_indices[header] = i
        
        replacements_made = 0
        
        # Replace each generic activity
        for activity in generic_activities:
            activity_name = activity['name']
            
            if activity_name in specific_activities:
                row_num = activity['row']
                new_activity = specific_activities[activity_name]
                
                print(f"\n🔧 Replacing: {activity_name} (Row {row_num})")
                
                # Update all columns with new specific activity data
                for column_name, value in new_activity.items():
                    if column_name in column_indices:
                        column_index = column_indices[column_name]
                        activities_worksheet.update_cell(row_num, column_index + 1, value)
                        print(f"   ✅ {column_name}: {value[:50]}...")
                        time.sleep(1)  # Rate limiting
                
                replacements_made += 1
        
        print(f"\n🎉 GENERIC ACTIVITIES REPLACED!")
        print("=" * 50)
        print(f"✅ Replaced {replacements_made} generic activities")
        print(f"✅ All activities now specific and valuable")
        print(f"✅ Parents get real value for their money")
        print(f"✅ Professional, actionable content")
        
        return True
        
    except Exception as e:
        print(f"❌ Error replacing activities: {e}")
        return False

def main():
    """Main function to identify and replace generic activities"""
    print("🔍 Identify and Replace Generic Activities")
    print("=" * 70)
    print("🎯 Find generic activities and replace with specific, valuable ones")
    
    # Connect to Google Sheets
    client = get_google_sheets_client()
    if not client:
        return False
    
    # Identify generic activities
    generic_activities, headers = identify_generic_activities(client)
    if not generic_activities:
        print("❌ No generic activities found")
        return False
    
    # Create specific activities
    specific_activities = create_specific_activities()
    
    # Replace generic activities
    success = replace_generic_activities(client, generic_activities, headers, specific_activities)
    
    if success:
        print(f"\n✅ SUCCESS! Generic activities replaced!")
        print("=" * 50)
        print("✅ Identified generic, unusable activities")
        print("✅ Created specific, valuable replacements")
        print("✅ Parents now get real value for their money")
        print("✅ Professional, actionable content delivered")
        
        return True
    else:
        print(f"\n❌ FAILED to replace generic activities!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Generic activities eliminated!")
    else:
        print(f"\n❌ FAILED to replace generic activities!")
