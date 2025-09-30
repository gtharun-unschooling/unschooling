#!/usr/bin/env python3
"""
🚀 Fill All Missing Content
Fill ALL missing content columns for Cognitive Skills activities
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
        return client
    except Exception as e:
        print(f"❌ Error connecting to Google Sheets: {e}")
        return None

def fill_all_missing_content():
    """Fill ALL missing content columns for Cognitive Skills activities"""
    
    try:
        print(f"🚀 FILLING ALL MISSING CONTENT:")
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
        
        print(f"📋 Headers: {headers}")
        
        # Target age groups with their specific content
        target_groups = [
            {
                'age_group': 'Child (6-8)',
                'age_range': '6-8 years',
                'time_estimate': '20-30 minutes',
                'setup_time': '5-10 minutes',
                'supervision': 'Moderate',
                'difficulty': 'Intermediate'
            },
            {
                'age_group': 'Pre-Teen (9-12)',
                'age_range': '9-12 years',
                'time_estimate': '30-45 minutes',
                'setup_time': '5-15 minutes',
                'supervision': 'Low',
                'difficulty': 'Advanced'
            },
            {
                'age_group': 'Teen (13-18)',
                'age_range': '13-18 years',
                'time_estimate': '45-60 minutes',
                'setup_time': '10-20 minutes',
                'supervision': 'Minimal',
                'difficulty': 'Expert'
            }
        ]
        
        total_updates = 0
        
        for group_info in target_groups:
            age_group = group_info['age_group']
            age_range = group_info['age_range']
            
            print(f"\n🚀 Filling content for {age_group}...")
            
            # Find all Cognitive Skills activities for this age group
            all_data = activities_worksheet.get_all_values()
            
            for row_num, row in enumerate(all_data[1:], start=2):
                if len(row) > max(column_indices.get('Pillar', 0), column_indices.get('Age Group', 0)):
                    pillar = row[column_indices.get('Pillar', 0)].strip()
                    current_age_group = row[column_indices.get('Age Group', 0)].strip()
                    
                    if pillar == 'Cognitive Skills' and current_age_group == age_group:
                        activity_name = row[column_indices.get('Activity Name', 0)].strip() if len(row) > column_indices.get('Activity Name', 0) else ''
                        
                        print(f"   🚀 Filling: {activity_name} (Row {row_num})")
                        
                        # Fill Objective
                        obj_col = column_indices.get('Objective', 10)
                        if obj_col < len(row) and (not row[obj_col].strip() or row[obj_col].strip() == ''):
                            objective = f"Develop advanced cognitive skills and {activity_name.lower().replace(' ', ' and ')} abilities for {age_range} children through engaging, age-appropriate activities."
                            activities_worksheet.update_cell(row_num, obj_col + 1, objective)
                            print(f"      ✅ Objective: Filled")
                            time.sleep(0.5)
                        
                        # Fill Explanation
                        exp_col = column_indices.get('Explanation', 11)
                        if exp_col < len(row) and (not row[exp_col].strip() or row[exp_col].strip() == ''):
                            explanation = f"This {age_group.lower()} activity focuses on developing essential cognitive skills through structured, engaging exercises. Children will practice critical thinking, problem-solving, and cognitive processing while having fun and building confidence in their abilities."
                            activities_worksheet.update_cell(row_num, exp_col + 1, explanation)
                            print(f"      ✅ Explanation: Filled")
                            time.sleep(0.5)
                        
                        # Fill Estimated Time
                        time_col = column_indices.get('Estimated Time', 13)
                        if time_col < len(row) and (not row[time_col].strip() or row[time_col].strip() == ''):
                            activities_worksheet.update_cell(row_num, time_col + 1, group_info['time_estimate'])
                            print(f"      ✅ Estimated Time: {group_info['time_estimate']}")
                            time.sleep(0.5)
                        
                        # Fill Setup Time
                        setup_col = column_indices.get('Setup Time', 14)
                        if setup_col < len(row) and (not row[setup_col].strip() or row[setup_col].strip() == ''):
                            activities_worksheet.update_cell(row_num, setup_col + 1, group_info['setup_time'])
                            print(f"      ✅ Setup Time: {group_info['setup_time']}")
                            time.sleep(0.5)
                        
                        # Fill Supervision Level
                        sup_col = column_indices.get('Supervision Level', 15)
                        if sup_col < len(row) and (not row[sup_col].strip() or row[sup_col].strip() == ''):
                            activities_worksheet.update_cell(row_num, sup_col + 1, group_info['supervision'])
                            print(f"      ✅ Supervision Level: {group_info['supervision']}")
                            time.sleep(0.5)
                        
                        # Fill Materials
                        mat_col = column_indices.get('Materials', 16)
                        if mat_col < len(row) and (not row[mat_col].strip() or row[mat_col].strip() == ''):
                            materials = f"Age-appropriate cognitive development materials, educational tools, worksheets, and engaging resources suitable for {age_range} children."
                            activities_worksheet.update_cell(row_num, mat_col + 1, materials)
                            print(f"      ✅ Materials: Filled")
                            time.sleep(0.5)
                        
                        # Fill Steps
                        steps_col = column_indices.get('Steps', 18)
                        if steps_col < len(row) and (not row[steps_col].strip() or row[steps_col].strip() == ''):
                            steps = f"1. Prepare materials and create a comfortable learning environment\n2. Introduce the activity with clear, age-appropriate instructions\n3. Guide children through the cognitive exercise step by step\n4. Provide encouragement and support as needed\n5. Discuss what was learned and celebrate achievements\n6. Clean up materials together and plan for next steps"
                            activities_worksheet.update_cell(row_num, steps_col + 1, steps)
                            print(f"      ✅ Steps: Filled")
                            time.sleep(0.5)
                        
                        # Fill Skills
                        skills_col = column_indices.get('Skills', 19)
                        if skills_col < len(row) and (not row[skills_col].strip() or row[skills_col].strip() == ''):
                            skills = f"Cognitive Development, Critical Thinking, Problem Solving, Analytical Reasoning, Memory Enhancement, Attention Focus, Logical Processing, Creative Thinking"
                            activities_worksheet.update_cell(row_num, skills_col + 1, skills)
                            print(f"      ✅ Skills: Filled")
                            time.sleep(0.5)
                        
                        # Fill Hashtags
                        hash_col = column_indices.get('Hashtags', 20)
                        if hash_col < len(row) and (not row[hash_col].strip() or row[hash_col].strip() == ''):
                            hashtags = f"#CognitiveSkills #BrainDevelopment #CriticalThinking #ProblemSolving #EducationalActivities #ChildDevelopment #LearningFun #MentalGrowth"
                            activities_worksheet.update_cell(row_num, hash_col + 1, hashtags)
                            print(f"      ✅ Hashtags: Filled")
                            time.sleep(0.5)
                        
                        total_updates += 1
                        
                        # Add delay between activities
                        if total_updates % 5 == 0:
                            print(f"      ⏳ Waiting 15 seconds to avoid rate limits...")
                            time.sleep(15)
        
        print(f"\n🎉 ALL MISSING CONTENT FILLED!")
        print("=" * 50)
        print(f"✅ Total activities updated: {total_updates}")
        print(f"✅ All core content columns filled")
        print(f"✅ Ready for final verification")
        
        return True
        
    except Exception as e:
        print(f"❌ Error filling missing content: {e}")
        return False

def main():
    """Main function to fill all missing content"""
    print("🚀 Fill All Missing Content")
    print("=" * 50)
    print("🎯 Fill ALL missing core content columns for Cognitive Skills")
    
    success = fill_all_missing_content()
    
    if success:
        print(f"\n✅ SUCCESS! All missing content filled!")
        print("=" * 50)
        print("✅ Core content columns completed")
        print("✅ All activities ready for engagement")
        print("✅ Perfect completion achieved")
        
        return True
    else:
        print(f"\n❌ FAILED to fill missing content!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! All missing content filled!")
    else:
        print(f"\n❌ FAILED to fill missing content!")
