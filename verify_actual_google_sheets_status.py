#!/usr/bin/env python3
"""
🔍 Verify Actual Google Sheets Status
Check the real status of Toddler Cognitive Skills activities in Google Sheets
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

def verify_actual_google_sheets_status(client):
    """Verify the actual status from Google Sheets"""
    
    try:
        # Open the Sample 1 spreadsheet
        spreadsheet = client.open_by_key('14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ')
        activities_worksheet = spreadsheet.worksheet('Activities')
        
        print(f"🔍 VERIFYING ACTUAL GOOGLE SHEETS STATUS:")
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
        steps_index = headers.index('Steps') if 'Steps' in headers else None
        skills_index = headers.index('Skills') if 'Skills' in headers else None
        objective_index = headers.index('Objective') if 'Objective' in headers else None
        materials_index = headers.index('Materials') if 'Materials' in headers else None
        category_index = headers.index('Category') if 'Category' in headers else None
        
        # Find all Toddler Cognitive Skills activities
        toddler_cognitive_activities = []
        
        for row_num, row in enumerate(all_data[1:], start=2):
            if len(row) > max(pillar_col_index, age_group_col_index):
                pillar = row[pillar_col_index].strip()
                age_group = row[age_group_col_index].strip()
                
                if pillar == 'Cognitive Skills' and age_group == 'Toddler (1-3)':
                    activity_data = {
                        'row': row_num,
                        'activity_name': row[activity_name_index].strip() if len(row) > activity_name_index else '',
                        'category': row[category_index].strip() if len(row) > category_index else '',
                        'steps': row[steps_index].strip() if len(row) > steps_index else '',
                        'skills': row[skills_index].strip() if len(row) > skills_index else '',
                        'objective': row[objective_index].strip() if len(row) > objective_index else '',
                        'materials': row[materials_index].strip() if len(row) > materials_index else ''
                    }
                    toddler_cognitive_activities.append(activity_data)
        
        print(f"📊 ACTUAL GOOGLE SHEETS STATUS:")
        print(f"Found {len(toddler_cognitive_activities)} Toddler Cognitive Skills activities")
        print("=" * 60)
        
        # Check actual content status
        categories = {}
        for activity in toddler_cognitive_activities:
            category = activity['category']
            if category not in categories:
                categories[category] = []
            
            # Check if content is actually filled
            has_steps = bool(activity['steps'].strip())
            has_skills = bool(activity['skills'].strip())
            has_objective = bool(activity['objective'].strip())
            has_materials = bool(activity['materials'].strip())
            
            content_status = "✅ Complete" if (has_steps and has_skills and has_objective and has_materials) else "❌ Missing Content"
            
            categories[category].append({
                'name': activity['activity_name'],
                'row': activity['row'],
                'status': content_status,
                'steps': has_steps,
                'skills': has_skills,
                'objective': has_objective,
                'materials': has_materials
            })
        
        # Display actual status
        for category, activities in categories.items():
            print(f"\n📂 {category}: {len(activities)} activities")
            for activity in activities:
                print(f"   - {activity['name']} (Row {activity['row']}) - {activity['status']}")
                if not activity['status'] == "✅ Complete":
                    missing = []
                    if not activity['steps']: missing.append("Steps")
                    if not activity['skills']: missing.append("Skills")
                    if not activity['objective']: missing.append("Objective")
                    if not activity['materials']: missing.append("Materials")
                    print(f"     Missing: {', '.join(missing)}")
        
        # Show sample of actual content
        print(f"\n📋 SAMPLE OF ACTUAL CONTENT:")
        print("=" * 40)
        if toddler_cognitive_activities:
            sample = toddler_cognitive_activities[0]
            print(f"Activity: {sample['activity_name']}")
            print(f"Category: {sample['category']}")
            print(f"Steps: {sample['steps'][:100]}..." if sample['steps'] else "Steps: [EMPTY]")
            print(f"Skills: {sample['skills'][:100]}..." if sample['skills'] else "Skills: [EMPTY]")
            print(f"Objective: {sample['objective'][:100]}..." if sample['objective'] else "Objective: [EMPTY]")
            print(f"Materials: {sample['materials'][:100]}..." if sample['materials'] else "Materials: [EMPTY]")
        
        return toddler_cognitive_activities, categories
        
    except Exception as e:
        print(f"❌ Error verifying Google Sheets status: {e}")
        return None, None

def main():
    """Main function to verify actual Google Sheets status"""
    print("🔍 Verifying Actual Google Sheets Status")
    print("=" * 70)
    print("🎯 Check the real status of Toddler Cognitive Skills in Google Sheets")
    
    # Connect to Google Sheets
    client = get_google_sheets_client()
    if not client:
        return False
    
    # Verify actual status
    toddler_activities, categories = verify_actual_google_sheets_status(client)
    
    if toddler_activities:
        print(f"\n✅ VERIFICATION COMPLETE!")
        print("=" * 40)
        print("✅ Checked actual Google Sheets data")
        print("✅ Verified real content status")
        print("✅ Identified any gaps or missing content")
        
        return True
    else:
        print(f"\n❌ FAILED to verify Google Sheets status!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Google Sheets verification completed!")
    else:
        print(f"\n❌ FAILED to verify Google Sheets status!")
