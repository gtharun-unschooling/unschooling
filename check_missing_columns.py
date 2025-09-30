#!/usr/bin/env python3
"""
🔍 Check Missing Columns
Check what specific columns are missing in Child, Pre-Teen, and Teen activities
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

def check_missing_columns(client):
    """Check what specific columns are missing"""
    
    try:
        spreadsheet = client.open_by_key('14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ')
        activities_worksheet = spreadsheet.worksheet('Activities')
        
        print(f"🔍 CHECKING MISSING COLUMNS:")
        print("=" * 50)
        
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
        
        # Check specific age groups
        target_age_groups = ['Child (6-8)', 'Pre-Teen (9-12)', 'Teen (13-18)']
        
        for age_group in target_age_groups:
            print(f"\n🎯 CHECKING {age_group}:")
            print("-" * 40)
            
            missing_columns_count = {}
            
            for row_num, row in enumerate(all_data[1:], start=2):
                if len(row) > max(pillar_col_index, age_group_col_index):
                    pillar = row[pillar_col_index].strip()
                    current_age_group = row[age_group_col_index].strip()
                    
                    if pillar == 'Cognitive Skills' and current_age_group == age_group:
                        activity_name = row[activity_name_index].strip() if len(row) > activity_name_index else ''
                        
                        print(f"\n📋 Activity: {activity_name} (Row {row_num})")
                        
                        # Check each required column
                        for column in required_columns:
                            if column in column_indices:
                                column_index = column_indices[column]
                                value = row[column_index].strip() if column_index < len(row) else ''
                                
                                if not value or value == '':
                                    print(f"   ❌ Missing: {column}")
                                    if column not in missing_columns_count:
                                        missing_columns_count[column] = 0
                                    missing_columns_count[column] += 1
                                else:
                                    print(f"   ✅ Present: {column}")
                        
                        # Only check first 2 activities per age group to avoid spam
                        break
            
            print(f"\n📊 {age_group} Missing Columns Summary:")
            if missing_columns_count:
                for column, count in missing_columns_count.items():
                    print(f"   ❌ {column}: Missing in {count} activities")
            else:
                print(f"   ✅ No missing columns found!")
        
    except Exception as e:
        print(f"❌ Error checking missing columns: {e}")

def main():
    """Main function to check missing columns"""
    print("🔍 Check Missing Columns")
    print("=" * 50)
    
    # Connect to Google Sheets
    client = get_google_sheets_client()
    if not client:
        return False
    
    # Check missing columns
    check_missing_columns(client)

if __name__ == "__main__":
    main()
