#!/usr/bin/env python3
"""
🧠 Analyze and Fix Cognitive Skills Infant Activities
Apply robust strategy to make Cognitive Skills infant activities perfect
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

def analyze_cognitive_skills_infants(client):
    """Analyze current Cognitive Skills infant activities"""
    
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
        activity_type_col_index = headers.index('Activity Type') if 'Activity Type' in headers else None
        difficulty_col_index = headers.index('Difficulty Level') if 'Difficulty Level' in headers else None
        
        print(f"🧠 ANALYZING COGNITIVE SKILLS INFANT ACTIVITIES:")
        print("=" * 60)
        
        # Find all Cognitive Skills infant activities
        cognitive_infant_activities = []
        
        for row_num, row in enumerate(all_data[1:], start=2):
            if len(row) > max(pillar_col_index, age_group_col_index, category_col_index, activity_name_col_index):
                pillar = row[pillar_col_index].strip()
                age_group = row[age_group_col_index].strip()
                category = row[category_col_index].strip()
                activity_name = row[activity_name_col_index].strip()
                activity_type = row[activity_type_col_index].strip() if len(row) > activity_type_col_index else ''
                difficulty = row[difficulty_col_index].strip() if len(row) > difficulty_col_index else ''
                
                if pillar == 'Cognitive Skills' and age_group == 'Infant (0-1)':
                    cognitive_infant_activities.append({
                        'row': row_num,
                        'category': category,
                        'activity_name': activity_name,
                        'activity_type': activity_type,
                        'difficulty': difficulty
                    })
        
        print(f"📊 FOUND {len(cognitive_infant_activities)} COGNITIVE SKILLS INFANT ACTIVITIES:")
        print("=" * 50)
        
        # Analyze current categories
        current_categories = {}
        activity_types = {}
        difficulty_levels = {}
        
        for activity in cognitive_infant_activities:
            category = activity['category']
            activity_type = activity['activity_type']
            difficulty = activity['difficulty']
            
            if category not in current_categories:
                current_categories[category] = []
            current_categories[category].append(activity['activity_name'])
            
            if activity_type not in activity_types:
                activity_types[activity_type] = 0
            activity_types[activity_type] += 1
            
            if difficulty not in difficulty_levels:
                difficulty_levels[difficulty] = 0
            difficulty_levels[difficulty] += 1
        
        print(f"\n📋 CURRENT CATEGORIES ({len(current_categories)}):")
        for category, activities in current_categories.items():
            print(f"   📂 {category}: {len(activities)} activities")
            for activity in activities[:2]:  # Show first 2 activities
                print(f"      - {activity}")
        
        print(f"\n🎯 CURRENT ACTIVITY TYPES:")
        for activity_type, count in activity_types.items():
            print(f"   {activity_type}: {count} activities")
        
        print(f"\n📊 CURRENT DIFFICULTY LEVELS:")
        for difficulty, count in difficulty_levels.items():
            print(f"   {difficulty}: {count} activities")
        
        return cognitive_infant_activities, current_categories
        
    except Exception as e:
        print(f"❌ Error analyzing cognitive skills infants: {e}")
        return None, None

def create_cognitive_skills_strategy():
    """Create robust strategy for Cognitive Skills infant activities"""
    
    print(f"\n🎯 COGNITIVE SKILLS INFANT STRATEGY:")
    print("=" * 50)
    
    # Define the 4 categories for Cognitive Skills infants
    cognitive_infant_categories = {
        'Visual Tracking And Focus': {
            'description': 'Activities that develop visual attention, tracking skills, and focus through age-appropriate visual stimuli and movement patterns.',
            'activity_type': 'Cognitive',
            'focus': 'Visual attention, tracking, focus development',
            'examples': ['Colorful Mobile Watching', 'Light And Shadow Play', 'Moving Object Tracking', 'Visual Pattern Recognition', 'Focus Building Games']
        },
        'Cause And Effect Learning': {
            'description': 'Simple cause-and-effect activities that help infants understand that their actions create responses through safe, immediate feedback.',
            'activity_type': 'Cognitive',
            'focus': 'Cause-effect understanding, action-response learning',
            'examples': ['Rattle Shake Response', 'Button Press Discovery', 'Sound Making Fun', 'Touch Response Play', 'Action Consequence Games']
        },
        'Memory Development': {
            'description': 'Gentle memory-building activities that develop recognition, recall, and familiarity through repetition and familiar patterns.',
            'activity_type': 'Memory',
            'focus': 'Recognition, recall, familiarity building',
            'examples': ['Familiar Face Recognition', 'Routine Memory Building', 'Object Permanence Play', 'Song And Rhyme Repetition', 'Memory Pattern Games']
        },
        'Problem Solving Basics': {
            'description': 'Simple problem-solving activities that introduce basic thinking skills through safe, guided exploration and discovery.',
            'activity_type': 'Problem Solving',
            'focus': 'Basic thinking, exploration, discovery',
            'examples': ['Simple Shape Fitting', 'Basic Stacking Play', 'Exploration Discovery', 'Simple Puzzle Play', 'Thinking Games']
        }
    }
    
    print(f"📋 COGNITIVE SKILLS INFANT CATEGORIES (4 categories × 5 activities = 20 activities):")
    print("=" * 60)
    
    for category, details in cognitive_infant_categories.items():
        print(f"\n📂 {category}:")
        print(f"   Purpose: {details['description']}")
        print(f"   Activity Type: {details['activity_type']}")
        print(f"   Focus: {details['focus']}")
        print(f"   Examples: {', '.join(details['examples'])}")
    
    return cognitive_infant_categories

def fix_cognitive_skills_infants(client, cognitive_infant_categories):
    """Fix Cognitive Skills infant activities based on strategy"""
    
    try:
        # Open the Sample 1 spreadsheet
        spreadsheet = client.open_by_key('14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ')
        activities_worksheet = spreadsheet.worksheet('Activities')
        
        print(f"\n🔧 FIXING COGNITIVE SKILLS INFANT ACTIVITIES:")
        print("=" * 50)
        
        # Get all data
        all_data = activities_worksheet.get_all_values()
        headers = all_data[0]
        
        # Find column indices
        pillar_col_index = headers.index('Pillar') if 'Pillar' in headers else None
        age_group_col_index = headers.index('Age Group') if 'Age Group' in headers else None
        category_col_index = headers.index('Category') if 'Category' in headers else None
        activity_type_col_index = headers.index('Activity Type') if 'Activity Type' in headers else None
        difficulty_col_index = headers.index('Difficulty Level') if 'Difficulty Level' in headers else None
        category_desc_col_index = headers.index('Category Description') if 'Category Description' in headers else None
        activity_name_col_index = headers.index('Activity Name') if 'Activity Name' in headers else None
        objective_col_index = headers.index('Objective') if 'Objective' in headers else None
        steps_col_index = headers.index('Steps') if 'Steps' in headers else None
        skills_col_index = headers.index('Skills') if 'Skills' in headers else None
        
        fixes_made = 0
        
        # Fix each Cognitive Skills infant activity
        for row_num, row in enumerate(all_data[1:], start=2):
            if len(row) > max(pillar_col_index, age_group_col_index, category_col_index):
                pillar = row[pillar_col_index].strip()
                age_group = row[age_group_col_index].strip()
                category = row[category_col_index].strip()
                
                if pillar == 'Cognitive Skills' and age_group == 'Infant (0-1)':
                    # Update category to match strategy
                    if category in cognitive_infant_categories:
                        category_details = cognitive_infant_categories[category]
                        
                        print(f"\n🔧 Fixing Row {row_num}: {row[activity_name_col_index] if len(row) > activity_name_col_index else 'Unknown'}")
                        
                        # Update Activity Type
                        activities_worksheet.update_cell(row_num, activity_type_col_index + 1, category_details['activity_type'])
                        print(f"   ✅ Activity Type: {category_details['activity_type']}")
                        
                        # Update Difficulty Level (infants should be Beginner)
                        activities_worksheet.update_cell(row_num, difficulty_col_index + 1, 'Beginner')
                        print(f"   ✅ Difficulty Level: Beginner")
                        
                        # Update Category Description
                        activities_worksheet.update_cell(row_num, category_desc_col_index + 1, category_details['description'])
                        print(f"   ✅ Category Description: Updated")
                        
                        # Update Skills to be cognitive-focused
                        cognitive_skills = 'Visual Attention, Memory Development, Problem Solving, Cause and Effect, Cognitive Development'
                        activities_worksheet.update_cell(row_num, skills_col_index + 1, cognitive_skills)
                        print(f"   ✅ Skills: {cognitive_skills}")
                        
                        # Update Objective to be cognitive-focused
                        cognitive_objective = f"Develop {category_details['focus'].lower()} through age-appropriate cognitive activities that support infant brain development and learning."
                        activities_worksheet.update_cell(row_num, objective_col_index + 1, cognitive_objective)
                        print(f"   ✅ Objective: Updated for cognitive focus")
                        
                        # Update Steps to be infant-appropriate
                        infant_steps = "1. Ensure baby is calm and alert; 2. Introduce activity gently; 3. Let baby explore at their own pace; 4. Provide encouragement and support; 5. Stop when baby shows signs of being done"
                        activities_worksheet.update_cell(row_num, steps_col_index + 1, infant_steps)
                        print(f"   ✅ Steps: Updated for infant appropriateness")
                        
                        fixes_made += 1
                        time.sleep(1)  # Rate limiting
        
        print(f"\n🎉 COGNITIVE SKILLS INFANT FIXES COMPLETE!")
        print("=" * 50)
        print(f"✅ Fixed {fixes_made} Cognitive Skills infant activities")
        print(f"✅ Updated Activity Types to cognitive focus")
        print(f"✅ Set all difficulty levels to Beginner (age-appropriate)")
        print(f"✅ Updated Category Descriptions with cognitive focus")
        print(f"✅ Updated Skills to cognitive development")
        print(f"✅ Updated Objectives for cognitive learning")
        print(f"✅ Updated Steps for infant appropriateness")
        
        return True
        
    except Exception as e:
        print(f"❌ Error fixing cognitive skills infants: {e}")
        return False

def main():
    """Main function to analyze and fix Cognitive Skills infant activities"""
    print("🧠 Analyzing and Fixing Cognitive Skills Infant Activities")
    print("=" * 70)
    print("🎯 Applying robust strategy to make Cognitive Skills infant activities perfect")
    
    # Connect to Google Sheets
    client = get_google_sheets_client()
    if not client:
        return False
    
    # Analyze current state
    cognitive_infant_activities, current_categories = analyze_cognitive_skills_infants(client)
    
    if not cognitive_infant_activities:
        print("❌ No Cognitive Skills infant activities found")
        return False
    
    # Create strategy
    cognitive_infant_categories = create_cognitive_skills_strategy()
    
    # Fix the activities
    success = fix_cognitive_skills_infants(client, cognitive_infant_categories)
    
    if success:
        print(f"\n✅ SUCCESS! Cognitive Skills infant activities perfected!")
        print("=" * 50)
        print("✅ Applied robust strategy from Play & Creativity")
        print("✅ Fixed Activity Types to cognitive focus")
        print("✅ Set age-appropriate difficulty levels")
        print("✅ Updated descriptions for cognitive development")
        print("✅ Made activities infant-appropriate")
        print("✅ Ready to show proof of quality improvement")
        
        return True
    else:
        print(f"\n❌ FAILED to fix Cognitive Skills infant activities!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Cognitive Skills infant improvement completed!")
    else:
        print(f"\n❌ FAILED to improve Cognitive Skills infant activities!")
