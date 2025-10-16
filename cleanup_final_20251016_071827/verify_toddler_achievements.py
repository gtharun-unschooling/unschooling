#!/usr/bin/env python3
"""
🔍 Verify Toddler Achievements - Check What's Been Accomplished
Verify the current state of Toddler age group in Cognitive Skills
"""

import gspread
from google.oauth2.service_account import Credentials
import time
import re

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

def check_robotic_content(text):
    """Check if text contains robotic patterns"""
    robotic_patterns = [
        r'Ready for parent engagement - all content verified and complete',
        r'Age-appropriate learning materials, interactive tools, educational resources, comfortable workspace',
        r'Educational cognitive development kits, age-appropriate tools',
        r'Use age-appropriate activities for \d+-\d+ years\. Guide skill development\. Celebrate cognitive growth',
        r'No corrections needed - activity is complete and age-appropriate',
        r'Household cognitive activities, family learning opportunities',
        r'Cognitive Development, Critical Thinking, Problem Solving, Analytical Reasoning, Memory Enhancement, Attention Focus',
        r'Memory Strategies, Information Retention, Recall Techniques, Cognitive Processing'
    ]
    
    for pattern in robotic_patterns:
        if re.search(pattern, text, re.IGNORECASE):
            return True
    return False

def verify_toddler_achievements():
    """Verify what has been achieved for Toddler age group"""
    
    try:
        print(f"🔍 VERIFYING TODDLER ACHIEVEMENTS:")
        print("=" * 80)
        
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
        
        # Get all data
        all_data = activities_worksheet.get_all_values()
        
        print(f"\n🎯 ANALYZING TODDLER COGNITIVE SKILLS:")
        print("-" * 80)
        
        # Collect all Toddler activities
        toddler_activities = []
        for row_num, row in enumerate(all_data[1:], start=2):
            if len(row) > max(column_indices.get('Pillar', 0), column_indices.get('Age Group', 0), column_indices.get('Activity Name', 0)):
                pillar = row[column_indices.get('Pillar', 0)].strip()
                age_group = row[column_indices.get('Age Group', 0)].strip()
                activity_name = row[column_indices.get('Activity Name', 0)].strip() if len(row) > column_indices.get('Activity Name', 0) else ''
                
                if pillar == 'Cognitive Skills' and 'Toddler' in age_group and activity_name:
                    toddler_activities.append((row_num, activity_name, row))
        
        print(f"📊 Found {len(toddler_activities)} Toddler activities")
        
        # Analyze each column for robotic content
        columns_to_check = [
            'Skills', 'Feedback', 'Materials', 'Kit Materials', 'Materials at Home', 
            'Materials to Buy for Kit', 'General Instructions', 'Corrections Needed', 'Additional Information'
        ]
        
        column_stats = {}
        for column in columns_to_check:
            if column in column_indices:
                column_stats[column] = {'total': 0, 'robotic': 0, 'empty': 0, 'good': 0}
        
        print(f"\n🔍 DETAILED ANALYSIS BY ACTIVITY:")
        print("-" * 80)
        
        for i, (row_num, activity_name, row) in enumerate(toddler_activities):
            print(f"\n🔧 Activity {i+1}: {activity_name}")
            print(f"   📍 Row: {row_num}")
            
            activity_robotic_count = 0
            activity_total_columns = 0
            
            for column in columns_to_check:
                if column in column_indices:
                    content = row[column_indices[column]] if len(row) > column_indices[column] else ''
                    column_stats[column]['total'] += 1
                    activity_total_columns += 1
                    
                    if not content.strip():
                        column_stats[column]['empty'] += 1
                        print(f"      ⚪ {column}: EMPTY")
                    elif check_robotic_content(content):
                        column_stats[column]['robotic'] += 1
                        activity_robotic_count += 1
                        print(f"      🤖 {column}: ROBOTIC")
                    else:
                        column_stats[column]['good'] += 1
                        print(f"      ✅ {column}: GOOD")
            
            robotic_percentage = (activity_robotic_count / activity_total_columns * 100) if activity_total_columns > 0 else 0
            print(f"   📊 Robotic Content: {activity_robotic_count}/{activity_total_columns} ({robotic_percentage:.1f}%)")
        
        print(f"\n📊 OVERALL COLUMN STATISTICS:")
        print("-" * 80)
        
        for column, stats in column_stats.items():
            total = stats['total']
            robotic = stats['robotic']
            empty = stats['empty']
            good = stats['good']
            
            robotic_pct = (robotic / total * 100) if total > 0 else 0
            empty_pct = (empty / total * 100) if total > 0 else 0
            good_pct = (good / total * 100) if total > 0 else 0
            
            print(f"📋 {column}:")
            print(f"   🤖 Robotic: {robotic}/{total} ({robotic_pct:.1f}%)")
            print(f"   ⚪ Empty: {empty}/{total} ({empty_pct:.1f}%)")
            print(f"   ✅ Good: {good}/{total} ({good_pct:.1f}%)")
        
        print(f"\n🎉 TODDLER ACHIEVEMENT SUMMARY:")
        print("=" * 80)
        
        total_columns = sum(stats['total'] for stats in column_stats.values())
        total_robotic = sum(stats['robotic'] for stats in column_stats.values())
        total_empty = sum(stats['empty'] for stats in column_stats.values())
        total_good = sum(stats['good'] for stats in column_stats.values())
        
        overall_robotic_pct = (total_robotic / total_columns * 100) if total_columns > 0 else 0
        overall_empty_pct = (total_empty / total_columns * 100) if total_columns > 0 else 0
        overall_good_pct = (total_good / total_columns * 100) if total_columns > 0 else 0
        
        print(f"✅ Total Toddler Activities: {len(toddler_activities)}")
        print(f"📊 Total Columns Analyzed: {total_columns}")
        print(f"🤖 Robotic Content: {total_robotic}/{total_columns} ({overall_robotic_pct:.1f}%)")
        print(f"⚪ Empty Content: {total_empty}/{total_columns} ({overall_empty_pct:.1f}%)")
        print(f"✅ Good Content: {total_good}/{total_columns} ({overall_good_pct:.1f}%)")
        
        if overall_robotic_pct == 0:
            print(f"\n🎉 PERFECT! No robotic content detected in Toddler age group!")
        elif overall_robotic_pct < 10:
            print(f"\n🎉 EXCELLENT! Very little robotic content remaining!")
        elif overall_robotic_pct < 25:
            print(f"\n✅ GOOD! Some robotic content needs attention!")
        else:
            print(f"\n⚠️ NEEDS WORK! Significant robotic content remains!")
        
        return True
        
    except Exception as e:
        print(f"❌ Error verifying toddler achievements: {e}")
        return False

def main():
    """Main function to verify toddler achievements"""
    print("🔍 Verify Toddler Achievements - Check What's Been Accomplished")
    print("=" * 70)
    print("🎯 Verify the current state of Toddler age group in Cognitive Skills")
    
    success = verify_toddler_achievements()
    
    if success:
        print(f"\n✅ SUCCESS! Toddler achievements verified!")
        print("=" * 70)
        
        return True
    else:
        print(f"\n❌ FAILED to verify toddler achievements!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Toddler achievements verified!")
    else:
        print(f"\n❌ FAILED to verify toddler achievements!")

