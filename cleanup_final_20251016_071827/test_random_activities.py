#!/usr/bin/env python3
"""
🎯 Test Random Activities
Test random activities to verify they meet all criteria
"""

import pandas as pd
import os
from google.oauth2 import service_account
import gspread
from datetime import datetime
import random

def test_random_activities():
    """Test random activities to verify they meet all criteria"""
    
    print("🎯 Testing Random Activities for Quality")
    print("=" * 60)
    
    # Configuration
    CREDS_FILE = 'sheets-credentials.json'
    
    try:
        # Use the proper service account
        scope = [
            'https://spreadsheets.google.com/feeds',
            'https://www.googleapis.com/auth/spreadsheets',
            'https://www.googleapis.com/auth/drive',
            'https://www.googleapis.com/auth/drive.file'
        ]
        creds = service_account.Credentials.from_service_account_file(CREDS_FILE, scopes=scope)
        client = gspread.authorize(creds)
        print("✅ Authenticated with Sheets Uploader service account")
        
        # Get all sheets
        all_sheets = client.list_spreadsheet_files()
        print(f"📋 Found {len(all_sheets)} sheets")
        
        # Find your files
        target_files = []
        for sheet in all_sheets:
            print(f"Available sheet: {sheet}")
            # Try different ways to get the title
            title = ""
            if 'title' in sheet:
                title = sheet['title'].lower()
            elif 'name' in sheet:
                title = sheet['name'].lower()
            elif 'title' in sheet.get('properties', {}):
                title = sheet['properties']['title'].lower()
            
            if title and ('sample 1' in title or 'sample 2' in title or 'sample one' in title or 'sample two' in title):
                target_files.append(sheet)
                print(f"✅ Found: {title}")
        
        if not target_files:
            print("❌ No Sample One or Sample Two found")
            return False
        
        # Open the first target file
        target_sheet = target_files[0]
        sheet_name = target_sheet.get('name', target_sheet.get('title', 'Unknown'))
        print(f"\n📤 Working with: {sheet_name}")
        
        # Open sheet
        spreadsheet = client.open_by_key(target_sheet['id'])
        
        # Get the main worksheet (first one)
        worksheet = spreadsheet.get_worksheet(0)
        
        # Get all data
        all_data = worksheet.get_all_values()
        if not all_data:
            print("❌ No data found in the worksheet")
            return False
        
        # Get headers
        headers = all_data[0]
        print(f"📋 Found {len(headers)} columns in Google Sheets")
        
        # Find column indices
        topic_col = None
        activity_name_col = None
        objective_col = None
        explanation_col = None
        category_description_col = None
        estimated_time_col = None
        setup_time_col = None
        materials_col = None
        steps_col = None
        skills_col = None
        hashtags_col = None
        materials_at_home_col = None
        materials_to_buy_col = None
        validation_score_col = None
        
        for i, header in enumerate(headers):
            if header == "Topic":
                topic_col = i
            elif header == "Activity Name":
                activity_name_col = i
            elif header == "Objective":
                objective_col = i
            elif header == "Explanation":
                explanation_col = i
            elif header == "Category Description":
                category_description_col = i
            elif header == "Estimated Time":
                estimated_time_col = i
            elif header == "Setup Time":
                setup_time_col = i
            elif header == "Materials":
                materials_col = i
            elif header == "Steps":
                steps_col = i
            elif header == "Skills":
                skills_col = i
            elif header == "Hashtags":
                hashtags_col = i
            elif header == "Materials at Home":
                materials_at_home_col = i
            elif header == "Materials to Buy for Kit":
                materials_to_buy_col = i
            elif header == "Validation Score":
                validation_score_col = i
        
        print(f"📝 Found required columns")
        
        # Select random activities to test
        total_activities = len(all_data) - 1  # Subtract header row
        test_activities = random.sample(range(1, total_activities + 1), min(10, total_activities))
        
        print(f"\n🎯 Testing {len(test_activities)} random activities...")
        
        test_results = []
        
        for activity_num in test_activities:
            print(f"\n🔍 Testing Activity {activity_num}...")
            
            # Get the row number (activity_num + 1, since row 1 is headers)
            row_num = activity_num + 1
            
            # Get current data
            current_row = all_data[row_num - 1] if row_num - 1 < len(all_data) else []
            
            if not current_row:
                print(f"   ⚠️ Activity {activity_num}: No data found, skipping")
                continue
            
            # Get current values
            current_topic = current_row[topic_col] if topic_col < len(current_row) else ""
            current_activity_name = current_row[activity_name_col] if activity_name_col < len(current_row) else ""
            current_explanation = current_row[explanation_col] if explanation_col < len(current_row) else ""
            current_materials = current_row[materials_col] if materials_col < len(current_row) else ""
            current_steps = current_row[steps_col] if steps_col < len(current_row) else ""
            current_skills = current_row[skills_col] if skills_col < len(current_row) else ""
            current_estimated_time = current_row[estimated_time_col] if estimated_time_col < len(current_row) else ""
            current_setup_time = current_row[setup_time_col] if setup_time_col < len(current_row) else ""
            current_hashtags = current_row[hashtags_col] if hashtags_col < len(current_row) else ""
            current_materials_at_home = current_row[materials_at_home_col] if materials_at_home_col < len(current_row) else ""
            current_materials_to_buy = current_row[materials_to_buy_col] if materials_to_buy_col < len(current_row) else ""
            current_validation_score = current_row[validation_score_col] if validation_score_col < len(current_row) else ""
            
            # Test criteria
            test_score = 0
            max_score = 100
            test_details = []
            
            # 1. Clear Activity Name (10 points)
            if current_activity_name and current_activity_name != current_topic:
                test_score += 10
                test_details.append("✅ Clear Activity Name")
            else:
                test_details.append("❌ Activity Name needs improvement")
            
            # 2. Parent-friendly Explanation (15 points)
            if current_explanation:
                explanation_words = current_explanation.split()
                if len(explanation_words) <= 25:
                    test_score += 15
                    test_details.append("✅ Parent-friendly Explanation (≤25 words)")
                else:
                    test_details.append(f"❌ Explanation too long ({len(explanation_words)} words)")
            else:
                test_details.append("❌ Missing Explanation")
            
            # 3. Numbered Steps (20 points)
            if current_steps:
                steps_list = [step.strip() for step in current_steps.split(';') if step.strip()]
                if steps_list and steps_list[0][0].isdigit():
                    test_score += 20
                    test_details.append("✅ Numbered Steps")
                else:
                    test_details.append("❌ Steps need numbering")
            else:
                test_details.append("❌ Missing Steps")
            
            # 4. Materials Categorization (15 points)
            if current_materials_at_home or current_materials_to_buy:
                test_score += 15
                test_details.append("✅ Materials Categorized")
            else:
                test_details.append("❌ Materials not categorized")
            
            # 5. Skills Development (10 points)
            if current_skills and "," in current_skills:
                test_score += 10
                test_details.append("✅ Clear Skills Development")
            else:
                test_details.append("❌ Skills need improvement")
            
            # 6. Time Estimates (10 points)
            if current_estimated_time and current_setup_time:
                test_score += 10
                test_details.append("✅ Time Estimates Provided")
            else:
                test_details.append("❌ Missing Time Estimates")
            
            # 7. Age-appropriate Content (10 points)
            if current_hashtags:
                test_score += 10
                test_details.append("✅ Age-appropriate Content")
            else:
                test_details.append("❌ Missing Hashtags")
            
            # 8. Validation Score (10 points)
            if current_validation_score and "/100" in current_validation_score:
                test_score += 10
                test_details.append("✅ Validation Score Present")
            else:
                test_details.append("❌ Missing Validation Score")
            
            # Determine grade
            if test_score >= 90:
                grade = "A+"
            elif test_score >= 80:
                grade = "A"
            elif test_score >= 70:
                grade = "B+"
            elif test_score >= 60:
                grade = "B"
            elif test_score >= 50:
                grade = "C+"
            elif test_score >= 40:
                grade = "C"
            else:
                grade = "D"
            
            test_results.append({
                'activity_num': activity_num,
                'topic': current_topic,
                'activity_name': current_activity_name,
                'test_score': test_score,
                'grade': grade,
                'details': test_details
            })
            
            print(f"   📊 Test Score: {test_score}/{max_score} ({grade})")
            for detail in test_details:
                print(f"      {detail}")
        
        # Summary
        print(f"\n🎉 Random Activity Testing Complete!")
        print("=" * 60)
        
        # Calculate overall statistics
        total_score = sum(result['test_score'] for result in test_results)
        avg_score = total_score / len(test_results) if test_results else 0
        
        print(f"📊 Overall Test Results:")
        print(f"   Activities Tested: {len(test_results)}")
        print(f"   Average Score: {avg_score:.1f}/100")
        
        # Grade distribution
        grade_counts = {}
        for result in test_results:
            grade = result['grade']
            grade_counts[grade] = grade_counts.get(grade, 0) + 1
        
        print(f"\n📈 Grade Distribution:")
        for grade in ['A+', 'A', 'B+', 'B', 'C+', 'C', 'D']:
            count = grade_counts.get(grade, 0)
            percentage = (count / len(test_results)) * 100 if test_results else 0
            print(f"   {grade}: {count} activities ({percentage:.1f}%)")
        
        # Show best and worst activities
        if test_results:
            best_activity = max(test_results, key=lambda x: x['test_score'])
            worst_activity = min(test_results, key=lambda x: x['test_score'])
            
            print(f"\n🏆 Best Activity:")
            print(f"   Activity {best_activity['activity_num']}: {best_activity['topic']}")
            print(f"   Score: {best_activity['test_score']}/100 ({best_activity['grade']})")
            
            print(f"\n⚠️ Needs Improvement:")
            print(f"   Activity {worst_activity['activity_num']}: {worst_activity['topic']}")
            print(f"   Score: {worst_activity['test_score']}/100 ({worst_activity['grade']})")
        
        print(f"\n🔗 Google Sheets URL: {spreadsheet.url}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error during testing: {e}")
        return False

if __name__ == '__main__':
    result = test_random_activities()
    if result:
        print(f"\n✅ SUCCESS! Random activities tested!")
    else:
        print(f"\n❌ FAILED to test random activities")
