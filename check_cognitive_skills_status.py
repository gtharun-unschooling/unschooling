#!/usr/bin/env python3
"""
🔍 Check Cognitive Skills Status
Check the actual status of Cognitive Skills activities in Google Sheets
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

def check_cognitive_skills_status():
    """Check the actual status of Cognitive Skills activities"""
    
    try:
        print(f"🔍 CHECKING COGNITIVE SKILLS STATUS:")
        print("=" * 60)
        
        # Connect to Google Sheets
        client = get_google_sheets_client()
        if not client:
            return
        
        # Open spreadsheet
        spreadsheet = client.open_by_key('14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ')
        activities_worksheet = spreadsheet.worksheet('Activities')
        
        # Get all data
        all_data = activities_worksheet.get_all_values()
        headers = all_data[0]
        
        # Find column indices
        column_indices = {}
        for i, header in enumerate(headers):
            column_indices[header] = i
        
        print(f"📋 Headers: {headers}")
        
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
            print("-" * 50)
            
            activities_found = 0
            complete_activities = 0
            partial_activities = 0
            
            for row_num, row in enumerate(all_data[1:], start=2):
                if len(row) > max(column_indices.get('Pillar', 0), column_indices.get('Age Group', 0)):
                    pillar = row[column_indices.get('Pillar', 0)].strip()
                    current_age_group = row[column_indices.get('Age Group', 0)].strip()
                    
                    if pillar == 'Cognitive Skills' and current_age_group == age_group:
                        activities_found += 1
                        activity_name = row[column_indices.get('Activity Name', 0)].strip() if len(row) > column_indices.get('Activity Name', 0) else ''
                        
                        # Check completion status
                        empty_columns = []
                        for column in required_columns:
                            if column in column_indices:
                                column_index = column_indices[column]
                                value = row[column_index].strip() if column_index < len(row) else ''
                                if not value or value == '':
                                    empty_columns.append(column)
                        
                        if len(empty_columns) == 0:
                            complete_activities += 1
                            status = "✅ COMPLETE"
                        elif len(empty_columns) < len(required_columns) * 0.5:
                            partial_activities += 1
                            status = "⚠️ PARTIAL"
                        else:
                            status = "❌ EMPTY"
                        
                        # Show first few activities with details
                        if activities_found <= 3:
                            print(f"\n📋 Activity {activities_found}: {activity_name} (Row {row_num})")
                            print(f"   Status: {status}")
                            if empty_columns:
                                print(f"   Missing: {', '.join(empty_columns[:5])}")
                                if len(empty_columns) > 5:
                                    print(f"   ... and {len(empty_columns) - 5} more")
                            
                            # Show sample of filled columns
                            filled_sample = []
                            for col in ['Objective', 'Explanation', 'Age']:
                                if col in column_indices:
                                    val = row[column_indices[col]].strip() if column_indices[col] < len(row) else ''
                                    if val:
                                        filled_sample.append(f"{col}: {val[:30]}...")
                            if filled_sample:
                                print(f"   Sample filled: {filled_sample[0]}")
            
            print(f"\n📊 {age_group} Summary:")
            print(f"   Total activities: {activities_found}")
            print(f"   Complete: {complete_activities}")
            print(f"   Partial: {partial_activities}")
            print(f"   Empty: {activities_found - complete_activities - partial_activities}")
        
        # Also check if there are any recent updates
        print(f"\n🔍 CHECKING FOR RECENT UPDATES:")
        print("-" * 50)
        
        # Check a few specific rows that should have been updated
        test_rows = [182, 202, 222]  # First activity of each age group
        for row_num in test_rows:
            if row_num <= len(all_data):
                row = all_data[row_num - 1]  # Convert to 0-based index
                if len(row) > column_indices.get('Last Updated', 0):
                    last_updated = row[column_indices.get('Last Updated', 0)]
                    activity_name = row[column_indices.get('Activity Name', 0)] if len(row) > column_indices.get('Activity Name', 0) else 'Unknown'
                    print(f"   Row {row_num} ({activity_name}): Last Updated = '{last_updated}'")
        
    except Exception as e:
        print(f"❌ Error checking status: {e}")

def main():
    """Main function to check Cognitive Skills status"""
    print("🔍 Check Cognitive Skills Status")
    print("=" * 50)
    
    check_cognitive_skills_status()

if __name__ == "__main__":
    main()
