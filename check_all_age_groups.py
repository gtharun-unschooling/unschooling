#!/usr/bin/env python3
"""
🔍 Check All Age Groups
Check what age groups exist for Cognitive Skills
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

def check_all_age_groups(client):
    """Check what age groups exist for Cognitive Skills"""
    
    try:
        spreadsheet = client.open_by_key('14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ')
        activities_worksheet = spreadsheet.worksheet('Activities')
        
        print(f"🔍 CHECKING ALL COGNITIVE SKILLS AGE GROUPS:")
        print("=" * 60)
        
        all_data = activities_worksheet.get_all_values()
        headers = all_data[0]
        
        # Find column indices
        column_indices = {}
        for i, header in enumerate(headers):
            column_indices[header] = i
        
        pillar_col_index = column_indices.get('Pillar', 0)
        age_group_col_index = column_indices.get('Age Group', 0)
        activity_name_index = column_indices.get('Activity Name', 0)
        
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
                    age_groups[age_group].append({
                        'row': row_num,
                        'name': activity_name
                    })
        
        print(f"📊 COGNITIVE SKILLS AGE GROUPS FOUND:")
        print("=" * 50)
        
        for age_group, activities in age_groups.items():
            print(f"\n🎯 {age_group}: {len(activities)} activities")
            for activity in activities[:3]:  # Show first 3
                print(f"   Row {activity['row']}: {activity['name']}")
            if len(activities) > 3:
                print(f"   ... and {len(activities) - 3} more")
        
        return age_groups
        
    except Exception as e:
        print(f"❌ Error checking age groups: {e}")
        return {}

def main():
    """Main function to check age groups"""
    print("🔍 Check All Age Groups")
    print("=" * 50)
    
    # Connect to Google Sheets
    client = get_google_sheets_client()
    if not client:
        return False
    
    # Check age groups
    age_groups = check_all_age_groups(client)
    
    if age_groups:
        print(f"\n✅ Found {len(age_groups)} age groups!")
        return True
    else:
        print(f"\n❌ No age groups found!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Age groups found!")
    else:
        print(f"\n❌ NO age groups found!")