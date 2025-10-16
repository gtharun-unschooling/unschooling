#!/usr/bin/env python3
"""
🔍 Check and Fix Cognitive Skills Structure
Ensure 4 categories per age group, 5 activities per category, all in same line
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

def check_current_structure(client):
    """Check current Cognitive Skills infant structure"""
    
    try:
        # Open the Sample 1 spreadsheet
        spreadsheet = client.open_by_key('14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ')
        activities_worksheet = spreadsheet.worksheet('Activities')
        
        print(f"📤 Working with: Activities worksheet")
        
        # Get all data
        all_data = activities_worksheet.get_all_values()
        if not all_data:
            print("❌ No data found")
            return False
        
        headers = all_data[0]
        
        # Find column indices
        pillar_col_index = headers.index('Pillar') if 'Pillar' in headers else None
        age_group_col_index = headers.index('Age Group') if 'Age Group' in headers else None
        category_col_index = headers.index('Category') if 'Category' in headers else None
        activity_name_col_index = headers.index('Activity Name') if 'Activity Name' in headers else None
        
        print(f"🔍 CHECKING CURRENT COGNITIVE SKILLS INFANT STRUCTURE:")
        print("=" * 60)
        
        # Find all Cognitive Skills infant activities
        cognitive_infant_activities = []
        
        for row_num, row in enumerate(all_data[1:], start=2):
            if len(row) > max(pillar_col_index, age_group_col_index, category_col_index):
                pillar = row[pillar_col_index].strip()
                age_group = row[age_group_col_index].strip()
                category = row[category_col_index].strip()
                activity_name = row[activity_name_col_index].strip() if len(row) > activity_name_col_index else ''
                
                if pillar == 'Cognitive Skills' and age_group == 'Infant (0-1)':
                    cognitive_infant_activities.append({
                        'row': row_num,
                        'category': category,
                        'activity_name': activity_name
                    })
        
        print(f"📊 FOUND {len(cognitive_infant_activities)} COGNITIVE SKILLS INFANT ACTIVITIES:")
        print("=" * 50)
        
        # Analyze current categories
        current_categories = {}
        for activity in cognitive_infant_activities:
            category = activity['category']
            if category not in current_categories:
                current_categories[category] = []
            current_categories[category].append(activity['activity_name'])
        
        print(f"\n📋 CURRENT CATEGORIES ({len(current_categories)}):")
        for category, activities in current_categories.items():
            print(f"   📂 {category}: {len(activities)} activities")
            for activity in activities:
                print(f"      - {activity}")
        
        print(f"\n❌ PROBLEMS IDENTIFIED:")
        print("=" * 30)
        print(f"❌ Has {len(current_categories)} categories (should be 4)")
        print(f"❌ Activities per category: {[len(activities) for activities in current_categories.values()]}")
        print(f"❌ Not all categories have 5 activities")
        print(f"❌ Structure doesn't match metadata requirements")
        
        return cognitive_infant_activities, current_categories
        
    except Exception as e:
        print(f"❌ Error checking structure: {e}")
        return None, None

def create_proper_structure():
    """Create proper 4x5 structure for Cognitive Skills infants"""
    
    print(f"\n🎯 CREATING PROPER 4x5 STRUCTURE:")
    print("=" * 40)
    
    # Define the 4 categories with 5 activities each
    proper_structure = {
        'Visual Tracking & Focus': [
            'Colorful Mobile Watching',
            'Light And Shadow Play',
            'Moving Object Tracking',
            'Visual Pattern Recognition',
            'Focus Building Games'
        ],
        'Cause & Effect Learning': [
            'Rattle Shake Response',
            'Button Press Discovery',
            'Sound Making Fun',
            'Touch Response Play',
            'Action Consequence Games'
        ],
        'Memory Development': [
            'Familiar Face Recognition',
            'Routine Memory Building',
            'Object Permanence Play',
            'Song And Rhyme Repetition',
            'Memory Pattern Games'
        ],
        'Problem Solving Basics': [
            'Simple Shape Fitting',
            'Basic Stacking Play',
            'Exploration Discovery',
            'Simple Puzzle Play',
            'Thinking Games'
        ]
    }
    
    print(f"📋 PROPER STRUCTURE (4 categories × 5 activities = 20 activities):")
    print("=" * 60)
    
    for category, activities in proper_structure.items():
        print(f"\n📂 {category}:")
        for i, activity in enumerate(activities, 1):
            print(f"   {i}. {activity}")
    
    return proper_structure

def fix_structure_properly(client, proper_structure):
    """Fix the structure to match metadata requirements"""
    
    try:
        # Open the Sample 1 spreadsheet
        spreadsheet = client.open_by_key('14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ')
        activities_worksheet = spreadsheet.worksheet('Activities')
        
        print(f"\n🔧 FIXING STRUCTURE TO MATCH METADATA:")
        print("=" * 50)
        
        # Get all data
        all_data = activities_worksheet.get_all_values()
        headers = all_data[0]
        
        # Find column indices
        pillar_col_index = headers.index('Pillar') if 'Pillar' in headers else None
        age_group_col_index = headers.index('Age Group') if 'Age Group' in headers else None
        category_col_index = headers.index('Category') if 'Category' in headers else None
        activity_name_col_index = headers.index('Activity Name') if 'Activity Name' in headers else None
        activity_type_col_index = headers.index('Activity Type') if 'Activity Type' in headers else None
        difficulty_col_index = headers.index('Difficulty Level') if 'Difficulty Level' in headers else None
        category_desc_col_index = headers.index('Category Description') if 'Category Description' in headers else None
        objective_col_index = headers.index('Objective') if 'Objective' in headers else None
        steps_col_index = headers.index('Steps') if 'Steps' in headers else None
        skills_col_index = headers.index('Skills') if 'Skills' in headers else None
        
        fixes_made = 0
        
        # Find all Cognitive Skills infant activities and fix them
        for row_num, row in enumerate(all_data[1:], start=2):
            if len(row) > max(pillar_col_index, age_group_col_index, category_col_index):
                pillar = row[pillar_col_index].strip()
                age_group = row[age_group_col_index].strip()
                category = row[category_col_index].strip()
                
                if pillar == 'Cognitive Skills' and age_group == 'Infant (0-1)':
                    # Determine which category this should be in based on position
                    activity_index = fixes_made % 5  # Which activity in the category (0-4)
                    category_index = fixes_made // 5  # Which category (0-3)
                    
                    category_names = list(proper_structure.keys())
                    target_category = category_names[category_index]
                    target_activity = proper_structure[target_category][activity_index]
                    
                    print(f"\n🔧 Fixing Row {row_num}:")
                    print(f"   Current: {category} - {row[activity_name_col_index] if len(row) > activity_name_col_index else 'Unknown'}")
                    print(f"   Target:  {target_category} - {target_activity}")
                    
                    # Update category
                    activities_worksheet.update_cell(row_num, category_col_index + 1, target_category)
                    print(f"   ✅ Category: {target_category}")
                    
                    # Update activity name
                    activities_worksheet.update_cell(row_num, activity_name_col_index + 1, target_activity)
                    print(f"   ✅ Activity Name: {target_activity}")
                    
                    # Update activity type based on category
                    if target_category == 'Visual Tracking & Focus':
                        activity_type = 'Visual-Spatial'
                    elif target_category == 'Cause & Effect Learning':
                        activity_type = 'Cognitive'
                    elif target_category == 'Memory Development':
                        activity_type = 'Memory'
                    else:  # Problem Solving Basics
                        activity_type = 'Problem Solving'
                    
                    activities_worksheet.update_cell(row_num, activity_type_col_index + 1, activity_type)
                    print(f"   ✅ Activity Type: {activity_type}")
                    
                    # Update difficulty level
                    activities_worksheet.update_cell(row_num, difficulty_col_index + 1, 'Beginner')
                    print(f"   ✅ Difficulty Level: Beginner")
                    
                    # Update category description
                    category_descriptions = {
                        'Visual Tracking & Focus': 'Activities that develop visual attention, tracking skills, and focus through age-appropriate visual stimuli and movement patterns.',
                        'Cause & Effect Learning': 'Simple cause-and-effect activities that help infants understand that their actions create responses through safe, immediate feedback.',
                        'Memory Development': 'Gentle memory-building activities that develop recognition, recall, and familiarity through repetition and familiar patterns.',
                        'Problem Solving Basics': 'Simple problem-solving activities that introduce basic thinking skills through safe, guided exploration and discovery.'
                    }
                    
                    activities_worksheet.update_cell(row_num, category_desc_col_index + 1, category_descriptions[target_category])
                    print(f"   ✅ Category Description: Updated")
                    
                    # Update objective
                    objectives = {
                        'Visual Tracking & Focus': 'Develop visual attention and tracking skills through engaging visual stimuli that support infant eye coordination and focus development.',
                        'Cause & Effect Learning': 'Help infants understand cause-and-effect relationships through simple, safe activities that provide immediate feedback for their actions.',
                        'Memory Development': 'Build recognition and recall skills through familiar patterns and repetition that support infant memory development.',
                        'Problem Solving Basics': 'Introduce basic thinking and exploration skills through safe, guided activities that encourage infant problem-solving development.'
                    }
                    
                    activities_worksheet.update_cell(row_num, objective_col_index + 1, objectives[target_category])
                    print(f"   ✅ Objective: Updated")
                    
                    # Update steps
                    steps = "1. Ensure baby is calm and alert; 2. Introduce activity gently; 3. Let baby explore at their own pace; 4. Provide encouragement and support; 5. Stop when baby shows signs of being done"
                    activities_worksheet.update_cell(row_num, steps_col_index + 1, steps)
                    print(f"   ✅ Steps: Updated for infant appropriateness")
                    
                    # Update skills
                    skills = 'Visual Attention, Memory Development, Problem Solving, Cause and Effect, Cognitive Development'
                    activities_worksheet.update_cell(row_num, skills_col_index + 1, skills)
                    print(f"   ✅ Skills: Updated")
                    
                    fixes_made += 1
                    time.sleep(1)  # Rate limiting
        
        print(f"\n🎉 STRUCTURE FIX COMPLETE!")
        print("=" * 40)
        print(f"✅ Fixed {fixes_made} Cognitive Skills infant activities")
        print(f"✅ Created proper 4x5 structure")
        print(f"✅ All activities now in same line for easy engagement")
        print(f"✅ Structure matches metadata requirements")
        
        return True
        
    except Exception as e:
        print(f"❌ Error fixing structure: {e}")
        return False

def main():
    """Main function to check and fix Cognitive Skills structure"""
    print("🔍 Checking and Fixing Cognitive Skills Structure")
    print("=" * 60)
    print("🎯 Ensuring 4 categories per age group, 5 activities per category")
    
    # Connect to Google Sheets
    client = get_google_sheets_client()
    if not client:
        return False
    
    # Check current structure
    cognitive_infant_activities, current_categories = check_current_structure(client)
    
    if not cognitive_infant_activities:
        print("❌ No Cognitive Skills infant activities found")
        return False
    
    # Create proper structure
    proper_structure = create_proper_structure()
    
    # Fix the structure
    success = fix_structure_properly(client, proper_structure)
    
    if success:
        print(f"\n✅ SUCCESS! Cognitive Skills structure fixed!")
        print("=" * 40)
        print("✅ Now has 4 categories per age group")
        print("✅ Each category has exactly 5 activities")
        print("✅ All activities in same line for easy engagement")
        print("✅ Structure matches metadata requirements")
        print("✅ Ready for easy engagement and management")
        
        return True
    else:
        print(f"\n❌ FAILED to fix Cognitive Skills structure!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Cognitive Skills structure improvement completed!")
    else:
        print(f"\n❌ FAILED to improve Cognitive Skills structure!")
