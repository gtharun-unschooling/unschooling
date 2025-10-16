#!/usr/bin/env python3
"""
🔍 Check Preschooler Completion Status
Verify what's actually in Google Sheets for Preschooler Cognitive Skills activities
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

def check_preschooler_status(client):
    """Check the actual status of Preschooler activities in Google Sheets"""
    
    try:
        spreadsheet = client.open_by_key('14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ')
        activities_worksheet = spreadsheet.worksheet('Activities')
        
        print(f"🔍 CHECKING PRESCHOOLER COGNITIVE SKILLS STATUS:")
        print("=" * 70)
        
        all_data = activities_worksheet.get_all_values()
        headers = all_data[0]
        
        # Find column indices
        pillar_col_index = headers.index('Pillar') if 'Pillar' in headers else None
        age_group_col_index = headers.index('Age Group') if 'Age Group' in headers else None
        activity_name_index = headers.index('Activity Name') if 'Activity Name' in headers else None
        
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
                        'name': row[activity_name_index].strip() if len(row) > activity_name_index else ''
                    }
                    
                    # Check each required column
                    for column in required_columns:
                        if column in column_indices:
                            column_index = column_indices[column]
                            value = row[column_index].strip() if column_index < len(row) else ''
                            activity_data[column] = value
                    
                    preschooler_activities.append(activity_data)
        
        print(f"📊 Found {len(preschooler_activities)} Preschooler Cognitive Skills activities")
        print("\n📋 DETAILED STATUS CHECK:")
        print("=" * 70)
        
        total_activities = len(preschooler_activities)
        empty_activities = 0
        partially_complete = 0
        fully_complete = 0
        
        for activity in preschooler_activities:
            activity_name = activity['name']
            row_num = activity['row']
            
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
                status = "❌ COMPLETELY EMPTY"
                empty_activities += 1
            elif empty_count > total_columns * 0.3:  # More than 30% empty
                status = f"⚠️  PARTIALLY COMPLETE ({completion_rate:.0f}%)"
                partially_complete += 1
            else:
                status = f"✅ COMPLETE ({completion_rate:.0f}%)"
                fully_complete += 1
            
            print(f"\n{status} - {activity_name} (Row {row_num})")
            
            if empty_columns:
                print(f"   Empty columns: {', '.join(empty_columns[:5])}")
                if len(empty_columns) > 5:
                    print(f"   ... and {len(empty_columns) - 5} more")
            
            # Show sample of what's filled
            filled_columns = [col for col in required_columns if col in activity and activity[col].strip()]
            if filled_columns:
                print(f"   Sample filled: {filled_columns[0]}: {activity[filled_columns[0]][:50]}...")
        
        print(f"\n📊 COMPLETION SUMMARY:")
        print("=" * 70)
        print(f"❌ Completely Empty: {empty_activities}/{total_activities}")
        print(f"⚠️  Partially Complete: {partially_complete}/{total_activities}")
        print(f"✅ Fully Complete: {fully_complete}/{total_activities}")
        print(f"📈 Overall Completion: {((fully_complete + partially_complete) / total_activities) * 100:.1f}%")
        
        if empty_activities > 0 or partially_complete > 0:
            print(f"\n⚠️  ISSUE FOUND: {empty_activities + partially_complete} activities need completion!")
            return False
        else:
            print(f"\n✅ ALL ACTIVITIES COMPLETE!")
            return True
        
    except Exception as e:
        print(f"❌ Error checking status: {e}")
        return False

def main():
    """Main function to check Preschooler status"""
    print("🔍 Check Preschooler Completion Status")
    print("=" * 70)
    print("🎯 Verify what's actually in Google Sheets for Preschooler activities")
    
    # Connect to Google Sheets
    client = get_google_sheets_client()
    if not client:
        return False
    
    # Check status
    success = check_preschooler_status(client)
    
    if success:
        print(f"\n✅ SUCCESS! All Preschooler activities are complete!")
        return True
    else:
        print(f"\n❌ ISSUE FOUND! Activities need completion!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Status check complete!")
    else:
        print(f"\n❌ ISSUE FOUND! Need to complete activities!")
