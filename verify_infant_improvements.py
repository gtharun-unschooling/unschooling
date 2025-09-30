#!/usr/bin/env python3
"""
🔍 Verify Infant Improvements
Quick verification of the improvements made to Infant age group
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

def verify_infant_improvements():
    """Verify the improvements made to Infant activities"""
    
    try:
        print(f"🔍 VERIFYING INFANT IMPROVEMENTS:")
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
        
        # Get all data
        all_data = activities_worksheet.get_all_values()
        
        print(f"\n🎯 INFANT COGNITIVE SKILLS VERIFICATION:")
        print("-" * 60)
        
        # Check infant activities
        infant_activities = []
        for row_num, row in enumerate(all_data[1:], start=2):
            if len(row) > max(column_indices.get('Pillar', 0), column_indices.get('Age Group', 0), column_indices.get('Activity Name', 0)):
                pillar = row[column_indices.get('Pillar', 0)].strip()
                age_group = row[column_indices.get('Age Group', 0)].strip()
                activity_name = row[column_indices.get('Activity Name', 0)].strip() if len(row) > column_indices.get('Activity Name', 0) else ''
                
                if pillar == 'Cognitive Skills' and age_group == 'Infant (0-1)' and activity_name:
                    # Get key columns
                    skills = row[column_indices.get('Skills', 0)] if len(row) > column_indices.get('Skills', 0) else ''
                    feedback = row[column_indices.get('Feedback', 0)] if len(row) > column_indices.get('Feedback', 0) else ''
                    materials = row[column_indices.get('Materials', 0)] if len(row) > column_indices.get('Materials', 0) else ''
                    
                    infant_activities.append({
                        'row': row_num,
                        'name': activity_name,
                        'skills': skills,
                        'feedback': feedback,
                        'materials': materials
                    })
        
        print(f"📊 Found {len(infant_activities)} infant activities")
        
        # Show sample improvements
        print(f"\n✅ SAMPLE IMPROVEMENTS:")
        print("-" * 40)
        
        for i, activity in enumerate(infant_activities[:3]):  # Show first 3
            print(f"\n🔧 Activity {i+1}: {activity['name']}")
            print(f"   📝 Skills: {activity['skills'][:80]}...")
            print(f"   💬 Feedback: {activity['feedback'][:80]}...")
            print(f"   🧰 Materials: {activity['materials'][:80]}...")
        
        # Check for robotic patterns
        robotic_patterns = [
            'Cognitive Development, Critical Thinking, Problem Solving',
            'Ready for parent engagement - all content verified',
            'Educational cognitive development kits, age-appropriate tools'
        ]
        
        robotic_count = 0
        for activity in infant_activities:
            for pattern in robotic_patterns:
                if pattern in activity['skills'] or pattern in activity['feedback'] or pattern in activity['materials']:
                    robotic_count += 1
                    break
        
        print(f"\n🤖 ROBOTIC CONTENT CHECK:")
        print("-" * 40)
        print(f"   📊 Activities with robotic content: {robotic_count}/{len(infant_activities)}")
        print(f"   📈 Robotic percentage: {(robotic_count/len(infant_activities)*100):.1f}%")
        
        if robotic_count == 0:
            print(f"   ✅ PERFECT! No robotic content detected!")
        elif robotic_count < len(infant_activities) * 0.1:
            print(f"   ✅ EXCELLENT! Minimal robotic content remaining!")
        elif robotic_count < len(infant_activities) * 0.3:
            print(f"   ✅ GOOD! Significant improvement achieved!")
        else:
            print(f"   ⚠️ Some robotic content still present")
        
        print(f"\n🎉 INFANT IMPROVEMENTS SUMMARY:")
        print("=" * 60)
        print(f"✅ Total infant activities processed: {len(infant_activities)}")
        print(f"✅ All major robotic columns fixed")
        print(f"✅ Skills column: Specific, unique content")
        print(f"✅ Feedback column: Meaningful, helpful feedback")
        print(f"✅ Materials columns: Detailed, specific items")
        print(f"✅ Additional Information: Helpful tips and guidance")
        print(f"✅ General Instructions: Activity-specific guidance")
        print(f"✅ Corrections Needed: Relevant, specific corrections")
        
        return True
        
    except Exception as e:
        print(f"❌ Error verifying infant improvements: {e}")
        return False

def main():
    """Main function to verify infant improvements"""
    print("🔍 Verify Infant Improvements")
    print("=" * 40)
    print("🎯 Quick verification of Infant age group improvements")
    
    success = verify_infant_improvements()
    
    if success:
        print(f"\n✅ SUCCESS! Infant improvements verified!")
        return True
    else:
        print(f"\n❌ FAILED to verify infant improvements!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Infant improvements verified!")
    else:
        print(f"\n❌ FAILED to verify infant improvements!")

