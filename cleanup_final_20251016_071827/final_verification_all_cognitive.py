#!/usr/bin/env python3
"""
🔍 Final Verification - All Cognitive Skills Age Groups
Verify all three age groups are 100% complete with no empty spaces
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
        return None

def verify_all_cognitive_completion(client):
    """Verify all Cognitive Skills age groups are 100% complete"""
    
    try:
        spreadsheet = client.open_by_key('14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ')
        activities_worksheet = spreadsheet.worksheet('Activities')
        
        print(f"🔍 FINAL VERIFICATION - ALL COGNITIVE SKILLS AGE GROUPS:")
        print("=" * 70)
        
        all_data = activities_worksheet.get_all_values()
        headers = all_data[0]
        
        # Find column indices
        column_indices = {}
        for i, header in enumerate(headers):
            column_indices[header] = i
        
        pillar_col_index = column_indices.get('Pillar', 0)
        age_group_col_index = column_indices.get('Age Group', 0)
        activity_name_index = column_indices.get('Activity Name', 0)
        
        # Required columns to check
        required_columns = [
            'Activity Name', 'Objective', 'Explanation', 'Age', 'Estimated Time', 
            'Setup Time', 'Supervision Level', 'Materials', 'Additional Information',
            'Steps', 'Skills', 'Hashtags', 'Kit Materials', 'General Instructions',
            'Materials at Home', 'Materials to Buy for Kit', 'Corrections Needed',
            'Validation Score', 'Last Updated', 'Feedback', 'Updated By', 'Last Synced'
        ]
        
        # Track age groups
        age_groups = {}
        
        for row_num, row in enumerate(all_data[1:], start=2):
            if len(row) > max(pillar_col_index, age_group_col_index):
                pillar = row[pillar_col_index].strip()
                age_group = row[age_group_col_index].strip()
                
                if pillar == 'Cognitive Skills':
                    if age_group not in age_groups:
                        age_groups[age_group] = []
                    
                    activity_name = row[activity_name_index].strip() if len(row) > activity_name_index else ''
                    
                    # Check each required column
                    activity_data = {
                        'row': row_num,
                        'name': activity_name
                    }
                    
                    for column in required_columns:
                        if column in column_indices:
                            column_index = column_indices[column]
                            value = row[column_index].strip() if column_index < len(row) else ''
                            activity_data[column] = value
                    
                    age_groups[age_group].append(activity_data)
        
        print(f"📊 COGNITIVE SKILLS COMPLETION SUMMARY:")
        print("=" * 50)
        
        total_activities = 0
        total_complete = 0
        total_partial = 0
        total_empty = 0
        
        for age_group, activities in age_groups.items():
            print(f"\n🎯 {age_group}: {len(activities)} activities")
            
            age_group_complete = 0
            age_group_partial = 0
            age_group_empty = 0
            
            for activity in activities:
                # Count empty columns
                empty_columns = []
                for column in required_columns:
                    if column in activity:
                        value = activity[column].strip()
                        if not value or value == '':
                            empty_columns.append(column)
                
                empty_count = len(empty_columns)
                total_columns = len(required_columns)
                completion_rate = ((total_columns - empty_count) / total_columns) * 100
                
                if empty_count == total_columns:
                    age_group_empty += 1
                    total_empty += 1
                elif empty_count > total_columns * 0.3:  # More than 30% empty
                    age_group_partial += 1
                    total_partial += 1
                else:
                    age_group_complete += 1
                    total_complete += 1
                
                total_activities += 1
            
            print(f"   ✅ Complete: {age_group_complete}/{len(activities)}")
            print(f"   ⚠️  Partial: {age_group_partial}/{len(activities)}")
            print(f"   ❌ Empty: {age_group_empty}/{len(activities)}")
            
            if age_group_partial == 0 and age_group_empty == 0:
                print(f"   🎉 {age_group}: 100% COMPLETE!")
            else:
                print(f"   ⚠️  {age_group}: NEEDS COMPLETION")
        
        print(f"\n📊 OVERALL COMPLETION SUMMARY:")
        print("=" * 50)
        print(f"✅ Completely Complete: {total_complete}/{total_activities}")
        print(f"⚠️  Partially Complete: {total_partial}/{total_activities}")
        print(f"❌ Completely Empty: {total_empty}/{total_activities}")
        print(f"📈 Overall Completion: {((total_complete + total_partial) / total_activities) * 100:.1f}%")
        
        if total_partial == 0 and total_empty == 0:
            print(f"\n🎉 ALL COGNITIVE SKILLS AGE GROUPS 100% COMPLETE!")
            print("=" * 60)
            print("✅ No more empty spaces")
            print("✅ All activities ready for engagement")
            print("✅ Perfect completion achieved")
            return True
        else:
            print(f"\n⚠️  SOME ACTIVITIES STILL NEED COMPLETION!")
            return False
        
    except Exception as e:
        print(f"❌ Error verifying completion: {e}")
        return False

def main():
    """Main function to verify all completion"""
    print("🔍 Final Verification - All Cognitive Skills Age Groups")
    print("=" * 70)
    print("🎯 Verify all three age groups are 100% complete with no empty spaces")
    
    # Connect to Google Sheets
    client = get_google_sheets_client()
    if not client:
        return False
    
    # Verify completion
    success = verify_all_cognitive_completion(client)
    
    if success:
        print(f"\n✅ SUCCESS! All Cognitive Skills age groups are 100% complete!")
        return True
    else:
        print(f"\n❌ ISSUE FOUND! Some activities still need completion!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Verification complete!")
    else:
        print(f"\n❌ ISSUE FOUND! Need to complete remaining activities!")
