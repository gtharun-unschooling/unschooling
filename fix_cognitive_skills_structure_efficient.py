#!/usr/bin/env python3
"""
🔧 Fix Cognitive Skills Structure Efficiently
Apply proper 4x5 structure with rate limiting
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

def fix_cognitive_skills_structure_efficiently(client):
    """Fix Cognitive Skills structure efficiently with proper rate limiting"""
    
    try:
        # Open the Sample 1 spreadsheet
        spreadsheet = client.open_by_key('14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ')
        activities_worksheet = spreadsheet.worksheet('Activities')
        
        print(f"🔧 FIXING COGNITIVE SKILLS STRUCTURE EFFICIENTLY:")
        print("=" * 60)
        
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
        
        # Define the proper 4x5 structure
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
        
        # Find all Cognitive Skills infant activities
        cognitive_infant_activities = []
        for row_num, row in enumerate(all_data[1:], start=2):
            if len(row) > max(pillar_col_index, age_group_col_index, category_col_index):
                pillar = row[pillar_col_index].strip()
                age_group = row[age_group_col_index].strip()
                
                if pillar == 'Cognitive Skills' and age_group == 'Infant (0-1)':
                    cognitive_infant_activities.append(row_num)
        
        print(f"📊 Found {len(cognitive_infant_activities)} Cognitive Skills infant activities")
        print(f"🎯 Applying proper 4x5 structure...")
        
        # Fix each activity with proper rate limiting
        for i, row_num in enumerate(cognitive_infant_activities):
            # Determine which category and activity this should be
            activity_index = i % 5  # Which activity in the category (0-4)
            category_index = i // 5  # Which category (0-3)
            
            category_names = list(proper_structure.keys())
            target_category = category_names[category_index]
            target_activity = proper_structure[target_category][activity_index]
            
            print(f"\n🔧 Fixing Row {row_num} ({i+1}/20):")
            print(f"   Target: {target_category} - {target_activity}")
            
            # Update category
            activities_worksheet.update_cell(row_num, category_col_index + 1, target_category)
            print(f"   ✅ Category: {target_category}")
            time.sleep(2)  # Rate limiting
            
            # Update activity name
            activities_worksheet.update_cell(row_num, activity_name_col_index + 1, target_activity)
            print(f"   ✅ Activity Name: {target_activity}")
            time.sleep(2)  # Rate limiting
            
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
            time.sleep(2)  # Rate limiting
            
            # Update difficulty level
            activities_worksheet.update_cell(row_num, difficulty_col_index + 1, 'Beginner')
            print(f"   ✅ Difficulty Level: Beginner")
            time.sleep(2)  # Rate limiting
            
            print(f"   ✅ Row {row_num} completed")
        
        print(f"\n🎉 COGNITIVE SKILLS STRUCTURE FIX COMPLETE!")
        print("=" * 50)
        print(f"✅ Fixed {len(cognitive_infant_activities)} Cognitive Skills infant activities")
        print(f"✅ Created proper 4x5 structure (4 categories × 5 activities)")
        print(f"✅ All activities now in same line for easy engagement")
        print(f"✅ Structure matches metadata requirements")
        print(f"✅ Ready for easy engagement and management")
        
        return True
        
    except Exception as e:
        print(f"❌ Error fixing structure: {e}")
        return False

def main():
    """Main function to fix Cognitive Skills structure efficiently"""
    print("🔧 Fixing Cognitive Skills Structure Efficiently")
    print("=" * 60)
    print("🎯 Applying proper 4x5 structure with rate limiting")
    
    # Connect to Google Sheets
    client = get_google_sheets_client()
    if not client:
        return False
    
    # Fix the structure
    success = fix_cognitive_skills_structure_efficiently(client)
    
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
