#!/usr/bin/env python3
"""
🔍 Check Current Skills Column
Check what's actually in the Skills column right now
"""

import gspread
from google.oauth2.service_account import Credentials

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
        return client
    except Exception as e:
        print(f"❌ Error connecting to Google Sheets: {e}")
        return False

def check_current_skills_column():
    """Check what's currently in the Skills column"""
    
    try:
        print(f"🔍 CHECKING CURRENT SKILLS COLUMN:")
        print("=" * 60)
        
        # Connect to Google Sheets
        client = get_google_sheets_client()
        if not client:
            return False
        
        # Open spreadsheet
        spreadsheet = client.open_by_key('14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ')
        activities_worksheet = spreadsheet.worksheet('Activities')
        
        # Get headers
        headers = activities_worksheet.row_values(1)
        column_indices = {}
        for i, header in enumerate(headers):
            column_indices[header] = i
        
        print(f"📊 Headers found: {headers}")
        print(f"📊 Skills column index: {column_indices.get('Skills', 'NOT FOUND')}")
        
        # Get all data
        all_data = activities_worksheet.get_all_values()
        
        print(f"\n🎯 CURRENT SKILLS COLUMN CONTENT:")
        print("-" * 60)
        
        # Check Cognitive Skills activities
        cognitive_activities = []
        for row_num, row in enumerate(all_data[1:], start=2):
            if len(row) > max(column_indices.get('Pillar', 0), column_indices.get('Activity Name', 0)):
                pillar = row[column_indices.get('Pillar', 0)].strip()
                activity_name = row[column_indices.get('Activity Name', 0)].strip() if len(row) > column_indices.get('Activity Name', 0) else ''
                
                if pillar == 'Cognitive Skills' and activity_name:
                    skills = row[column_indices.get('Skills', 0)] if len(row) > column_indices.get('Skills', 0) else ''
                    cognitive_activities.append({
                        'row': row_num,
                        'name': activity_name,
                        'skills': skills
                    })
        
        print(f"📊 Found {len(cognitive_activities)} Cognitive Skills activities")
        
        # Show first 10 activities
        print(f"\n📝 FIRST 10 ACTIVITIES - SKILLS COLUMN:")
        print("-" * 60)
        for i, activity in enumerate(cognitive_activities[:10]):
            print(f"{i+1:2d}. Row {activity['row']:3d}: {activity['name']}")
            print(f"    Skills: {activity['skills']}")
            print()
        
        # Check for robotic patterns
        robotic_patterns = [
            'Cognitive Development, Critical Thinking, Problem Solving, Analytical Reasoning, Memory Enhancement, Attention Focus',
            'Logical Reasoning, Critical Thinking, Problem Analysis, Solution Finding, Decision Making',
            'Memory Strategies, Information Retention, Recall Techniques, Cognitive Processing'
        ]
        
        robotic_count = 0
        for activity in cognitive_activities:
            for pattern in robotic_patterns:
                if pattern in activity['skills']:
                    robotic_count += 1
                    break
        
        print(f"\n🤖 ROBOTIC CONTENT ANALYSIS:")
        print("-" * 60)
        print(f"📊 Activities with robotic skills: {robotic_count}/{len(cognitive_activities)}")
        print(f"📈 Robotic percentage: {(robotic_count/len(cognitive_activities)*100):.1f}%")
        
        # Show unique skills
        unique_skills = set()
        for activity in cognitive_activities:
            unique_skills.add(activity['skills'])
        
        print(f"📊 Unique skills entries: {len(unique_skills)}")
        print(f"📊 Total activities: {len(cognitive_activities)}")
        print(f"📈 Uniqueness ratio: {len(unique_skills)/len(cognitive_activities)*100:.1f}%")
        
        if robotic_count > len(cognitive_activities) * 0.5:
            print(f"❌ CRITICAL: Skills column is still highly robotic!")
        elif robotic_count > len(cognitive_activities) * 0.2:
            print(f"⚠️ WARNING: Skills column has significant robotic content!")
        else:
            print(f"✅ GOOD: Skills column has minimal robotic content!")
        
        return True
        
    except Exception as e:
        print(f"❌ Error checking skills column: {e}")
        return False

def main():
    """Main function to check current skills column"""
    print("🔍 Check Current Skills Column")
    print("=" * 40)
    print("🎯 See what's actually in the Skills column right now")
    
    success = check_current_skills_column()
    
    if success:
        print(f"\n✅ SUCCESS! Skills column checked!")
        return True
    else:
        print(f"\n❌ FAILED to check skills column!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Skills column checked!")
    else:
        print(f"\n❌ FAILED to check skills column!")

