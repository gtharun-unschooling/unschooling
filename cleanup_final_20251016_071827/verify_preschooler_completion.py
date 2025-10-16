#!/usr/bin/env python3
"""
✅ Verify Preschooler Completion
Verify all Preschooler Cognitive Skills activities are complete and metadata compliant
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

def verify_preschooler_completion(client):
    """Verify all Preschooler activities are complete"""
    
    try:
        spreadsheet = client.open_by_key('14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ')
        activities_worksheet = spreadsheet.worksheet('Activities')
        
        print(f"✅ VERIFYING PRESCHOOLER COMPLETION:")
        print("=" * 60)
        
        all_data = activities_worksheet.get_all_values()
        headers = all_data[0]
        
        # Find column indices
        pillar_col_index = headers.index('Pillar') if 'Pillar' in headers else None
        age_group_col_index = headers.index('Age Group') if 'Age Group' in headers else None
        
        # Required columns to check
        required_columns = [
            'Activity Name', 'Objective', 'Explanation', 'Age', 'Estimated Time', 
            'Setup Time', 'Supervision Level', 'Materials', 'Additional Information',
            'Steps', 'Skills', 'Hashtags', 'Kit Materials', 'General Instructions',
            'Materials at Home', 'Materials to Buy for Kit', 'Corrections Needed',
            'Validation Score', 'Last Updated', 'Feedback', 'Updated By', 'Last Synced'
        ]
        
        column_indices = {}
        for i, header in enumerate(headers):
            if header in required_columns:
                column_indices[header] = i
        
        # Find all Preschooler Cognitive Skills activities
        preschooler_activities = []
        
        for row_num, row in enumerate(all_data[1:], start=2):
            if len(row) > max(pillar_col_index, age_group_col_index):
                pillar = row[pillar_col_index].strip()
                age_group = row[age_group_col_index].strip()
                
                if pillar == 'Cognitive Skills' and age_group == 'Preschooler (3-5)':
                    activity_data = {
                        'row': row_num,
                        'name': row[headers.index('Activity Name')].strip() if 'Activity Name' in headers else ''
                    }
                    
                    # Check completion status
                    completion_status = {}
                    for column in required_columns:
                        if column in column_indices:
                            column_index = column_indices[column]
                            value = row[column_index].strip() if column_index < len(row) else ''
                            completion_status[column] = bool(value.strip())
                    
                    activity_data['completion'] = completion_status
                    preschooler_activities.append(activity_data)
        
        print(f"📊 Found {len(preschooler_activities)} Preschooler Cognitive Skills activities")
        print("\n📋 COMPLETION STATUS:")
        print("=" * 60)
        
        total_activities = len(preschooler_activities)
        completed_activities = 0
        
        for activity in preschooler_activities:
            activity_name = activity['name']
            completion = activity['completion']
            
            # Count completed columns
            completed_columns = sum(completion.values())
            total_columns = len(completion)
            
            if completed_columns == total_columns:
                completed_activities += 1
                status = "✅ COMPLETE"
            else:
                status = f"❌ INCOMPLETE ({completed_columns}/{total_columns})"
            
            print(f"{status} - {activity_name}")
            
            # Show missing columns if incomplete
            if completed_columns < total_columns:
                missing_columns = [col for col, completed in completion.items() if not completed]
                print(f"   Missing: {', '.join(missing_columns)}")
        
        print(f"\n📊 COMPLETION SUMMARY:")
        print("=" * 60)
        print(f"✅ Completed Activities: {completed_activities}/{total_activities}")
        print(f"✅ Completion Rate: {(completed_activities/total_activities)*100:.1f}%")
        
        if completed_activities == total_activities:
            print(f"🎉 ALL PRESCHOOLER ACTIVITIES COMPLETE!")
            print("✅ All required columns filled")
            print("✅ Metadata requirements met")
            print("✅ Ready for engagement")
            return True
        else:
            print(f"⚠️  {total_activities - completed_activities} activities still need completion")
            return False
        
    except Exception as e:
        print(f"❌ Error verifying completion: {e}")
        return False

def main():
    """Main function to verify Preschooler completion"""
    print("✅ Verify Preschooler Completion")
    print("=" * 70)
    print("🎯 Verify all Preschooler Cognitive Skills activities are complete")
    
    # Connect to Google Sheets
    client = get_google_sheets_client()
    if not client:
        return False
    
    # Verify completion
    success = verify_preschooler_completion(client)
    
    if success:
        print(f"\n✅ SUCCESS! All Preschooler activities verified complete!")
        return True
    else:
        print(f"\n❌ Some activities still need completion!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Preschooler verification complete!")
    else:
        print(f"\n❌ Verification failed!")
