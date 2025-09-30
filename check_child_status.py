#!/usr/bin/env python3
"""
🔍 Check Child Status
Verify what Child activities exist in Google Sheets
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

def check_child_status(client):
    """Check what Child activities exist"""
    
    try:
        spreadsheet = client.open_by_key('14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ')
        activities_worksheet = spreadsheet.worksheet('Activities')
        
        print(f"🔍 CHECKING CHILD COGNITIVE SKILLS STATUS:")
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
        
        # Find all Child activities
        child_activities = []
        
        for row_num, row in enumerate(all_data[1:], start=2):
            if len(row) > max(pillar_col_index, age_group_col_index):
                pillar = row[pillar_col_index].strip()
                age_group = row[age_group_col_index].strip()
                
                if pillar == 'Cognitive Skills' and age_group == 'Child (6-12)':
                    activity_name = row[activity_name_index].strip() if len(row) > activity_name_index else ''
                    child_activities.append({
                        'row': row_num,
                        'name': activity_name
                    })
        
        print(f"📊 Found {len(child_activities)} Child Cognitive Skills activities")
        
        if child_activities:
            print("\n📋 CHILD ACTIVITIES FOUND:")
            print("=" * 40)
            for activity in child_activities:
                print(f"Row {activity['row']}: {activity['name']}")
        else:
            print("\n⚠️  NO CHILD ACTIVITIES FOUND!")
            print("Need to create Child activities first")
        
        return child_activities
        
    except Exception as e:
        print(f"❌ Error checking Child status: {e}")
        return []

def main():
    """Main function to check Child status"""
    print("🔍 Check Child Status")
    print("=" * 50)
    
    # Connect to Google Sheets
    client = get_google_sheets_client()
    if not client:
        return False
    
    # Check status
    child_activities = check_child_status(client)
    
    if child_activities:
        print(f"\n✅ Found {len(child_activities)} Child activities!")
        return True
    else:
        print(f"\n❌ No Child activities found!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Child activities exist!")
    else:
        print(f"\n❌ NO Child activities found!")
