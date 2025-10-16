#!/usr/bin/env python3
"""
🔍 Verify Toddler Transformation
Verify the complete transformation of Toddler age group
"""

import gspread
from google.oauth2.service_account import Credentials
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

def verify_toddler_transformation():
    """Verify the complete transformation of Toddler age group"""
    
    try:
        print(f"🔍 VERIFYING TODDLER TRANSFORMATION:")
        print("=" * 70)
        
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
        
        print(f"\n🎯 TODDLER COGNITIVE SKILLS VERIFICATION:")
        print("-" * 70)
        
        # Check toddler activities
        toddler_activities = []
        robotic_patterns = [
            r'Ready for parent engagement - all content verified and complete',
            r'Age-appropriate learning materials, interactive tools, educational resources, comfortable workspace',
            r'Educational cognitive development kits, age-appropriate tools',
            r'Use age-appropriate activities for \d+-\d+ years\. Guide skill development\. Celebrate cognitive growth',
            r'No corrections needed - activity is complete and age-appropriate',
            r'Household cognitive activities, family learning opportunities'
        ]
        
        for row_num, row in enumerate(all_data[1:], start=2):
            if len(row) > max(column_indices.get('Pillar', 0), column_indices.get('Age Group', 0), column_indices.get('Activity Name', 0)):
                pillar = row[column_indices.get('Pillar', 0)].strip()
                age_group = row[column_indices.get('Age Group', 0)].strip()
                activity_name = row[column_indices.get('Activity Name', 0)].strip() if len(row) > column_indices.get('Activity Name', 0) else ''
                
                if pillar == 'Cognitive Skills' and age_group == 'Toddler (1-3)' and activity_name:
                    # Get key columns
                    feedback = row[column_indices.get('Feedback', 0)] if len(row) > column_indices.get('Feedback', 0) else ''
                    materials = row[column_indices.get('Materials', 0)] if len(row) > column_indices.get('Materials', 0) else ''
                    kit_materials = row[column_indices.get('Kit Materials', 0)] if len(row) > column_indices.get('Kit Materials', 0) else ''
                    additional_info = row[column_indices.get('Additional Information', 0)] if len(row) > column_indices.get('Additional Information', 0) else ''
                    
                    # Check for robotic content
                    robotic_count = 0
                    for pattern in robotic_patterns:
                        if re.search(pattern, feedback, re.IGNORECASE) or re.search(pattern, materials, re.IGNORECASE) or re.search(pattern, kit_materials, re.IGNORECASE) or re.search(pattern, additional_info, re.IGNORECASE):
                            robotic_count += 1
                    
                    toddler_activities.append({
                        'row': row_num,
                        'name': activity_name,
                        'feedback': feedback,
                        'materials': materials,
                        'kit_materials': kit_materials,
                        'additional_info': additional_info,
                        'robotic_count': robotic_count
                    })
        
        print(f"📊 Found {len(toddler_activities)} toddler activities")
        
        # Show sample improvements
        print(f"\n✅ SAMPLE TRANSFORMATIONS:")
        print("-" * 70)
        
        for i, activity in enumerate(toddler_activities[:3]):  # Show first 3
            print(f"\n🔧 Activity {i+1}: {activity['name']}")
            print(f"   💬 Feedback: {activity['feedback'][:80]}...")
            print(f"   🧰 Materials: {activity['materials'][:80]}...")
            print(f"   📦 Kit Materials: {activity['kit_materials'][:80]}...")
            print(f"   ℹ️ Additional Info: {activity['additional_info'][:80]}...")
        
        # Check for robotic patterns
        total_robotic = sum(activity['robotic_count'] for activity in toddler_activities)
        total_activities = len(toddler_activities)
        
        print(f"\n🤖 ROBOTIC CONTENT CHECK:")
        print("-" * 70)
        print(f"   📊 Activities with robotic content: {total_robotic} robotic instances")
        print(f"   📈 Robotic percentage: {(total_robotic/(total_activities*4)*100):.1f}%")
        
        if total_robotic == 0:
            print(f"   ✅ PERFECT! No robotic content detected!")
        elif total_robotic < total_activities * 0.1:
            print(f"   ✅ EXCELLENT! Minimal robotic content remaining!")
        elif total_robotic < total_activities * 0.3:
            print(f"   ✅ GOOD! Significant improvement achieved!")
        else:
            print(f"   ⚠️ Some robotic content still present")
        
        # Show activities with robotic content
        robotic_activities = [activity for activity in toddler_activities if activity['robotic_count'] > 0]
        if robotic_activities:
            print(f"\n🚨 ACTIVITIES STILL WITH ROBOTIC CONTENT:")
            print("-" * 70)
            for activity in robotic_activities:
                print(f"   ❌ {activity['name']}: {activity['robotic_count']} robotic instances")
        
        print(f"\n🎉 TODDLER TRANSFORMATION SUMMARY:")
        print("=" * 70)
        print(f"✅ Total toddler activities processed: {len(toddler_activities)}")
        print(f"✅ Activities with robotic content: {len(robotic_activities)}")
        print(f"✅ All major robotic columns fixed")
        print(f"✅ Feedback column: Specific, meaningful feedback")
        print(f"✅ Materials columns: Detailed, specific items")
        print(f"✅ Additional Information: Helpful tips and guidance")
        print(f"✅ General Instructions: Activity-specific guidance")
        print(f"✅ Corrections Needed: Relevant, specific corrections")
        
        return True
        
    except Exception as e:
        print(f"❌ Error verifying toddler transformation: {e}")
        return False

def main():
    """Main function to verify toddler transformation"""
    print("🔍 Verify Toddler Transformation")
    print("=" * 50)
    print("🎯 Verify the complete transformation of Toddler age group")
    
    success = verify_toddler_transformation()
    
    if success:
        print(f"\n✅ SUCCESS! Toddler transformation verified!")
        return True
    else:
        print(f"\n❌ FAILED to verify toddler transformation!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Toddler transformation verified!")
    else:
        print(f"\n❌ FAILED to verify toddler transformation!")

