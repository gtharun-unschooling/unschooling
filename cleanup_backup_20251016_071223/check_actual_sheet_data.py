#!/usr/bin/env python3
"""
🔍 Check Actual Sheet Data
Check what's actually in the Google Sheets from the bottom up
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

def check_actual_sheet_data():
    """Check what's actually in the Google Sheets"""
    
    try:
        print(f"🔍 CHECKING ACTUAL SHEET DATA:")
        print("=" * 60)
        
        # Connect to Google Sheets
        client = get_google_sheets_client()
        if not client:
            return False
        
        # Open spreadsheet
        spreadsheet = client.open_by_key('14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ')
        activities_worksheet = spreadsheet.worksheet('Activities')
        
        print(f"📊 Spreadsheet: {spreadsheet.title}")
        print(f"📊 Worksheet: {activities_worksheet.title}")
        print(f"📊 Total rows: {activities_worksheet.row_count}")
        print(f"📊 Total columns: {activities_worksheet.col_count}")
        
        # Get headers
        headers = activities_worksheet.row_values(1)
        print(f"\n📋 Headers: {headers}")
        
        # Get all data
        all_data = activities_worksheet.get_all_values()
        print(f"\n📊 Total data rows: {len(all_data)}")
        
        # Check from the bottom up - last 10 rows
        print(f"\n🔍 CHECKING LAST 10 ROWS (from bottom up):")
        print("-" * 60)
        
        start_row = max(1, len(all_data) - 10)
        for i in range(start_row, len(all_data)):
            row_num = i + 1
            row = all_data[i]
            
            if len(row) > 1:  # Skip empty rows
                pillar = row[1] if len(row) > 1 else 'Unknown'
                age_group = row[2] if len(row) > 2 else 'Unknown'
                activity_name = row[9] if len(row) > 9 else 'Unknown'
                
                print(f"\n📋 Row {row_num}:")
                print(f"   Pillar: {pillar}")
                print(f"   Age Group: {age_group}")
                print(f"   Activity Name: {activity_name}")
                
                # Check key columns
                if len(row) > 10:
                    objective = row[10].strip() if row[10] else 'EMPTY'
                    print(f"   Objective: {objective[:50]}..." if len(objective) > 50 else f"   Objective: {objective}")
                
                if len(row) > 11:
                    explanation = row[11].strip() if row[11] else 'EMPTY'
                    print(f"   Explanation: {explanation[:50]}..." if len(explanation) > 50 else f"   Explanation: {explanation}")
                
                if len(row) > 16:
                    materials = row[16].strip() if row[16] else 'EMPTY'
                    print(f"   Materials: {materials[:50]}..." if len(materials) > 50 else f"   Materials: {materials}")
                
                if len(row) > 18:
                    steps = row[18].strip() if row[18] else 'EMPTY'
                    print(f"   Steps: {steps[:50]}..." if len(steps) > 50 else f"   Steps: {steps}")
                
                if len(row) > 19:
                    skills = row[19].strip() if row[19] else 'EMPTY'
                    print(f"   Skills: {skills[:50]}..." if len(skills) > 50 else f"   Skills: {skills}")
                
                if len(row) > 20:
                    hashtags = row[20].strip() if row[20] else 'EMPTY'
                    print(f"   Hashtags: {hashtags[:50]}..." if len(hashtags) > 50 else f"   Hashtags: {hashtags}")
        
        # Check specific Cognitive Skills activities
        print(f"\n🔍 CHECKING COGNITIVE SKILLS ACTIVITIES:")
        print("-" * 60)
        
        cognitive_count = 0
        for i, row in enumerate(all_data[1:], start=2):
            if len(row) > 1 and row[1] == 'Cognitive Skills':
                cognitive_count += 1
                age_group = row[2] if len(row) > 2 else 'Unknown'
                activity_name = row[9] if len(row) > 9 else 'Unknown'
                
                if cognitive_count <= 5:  # Show first 5
                    print(f"\n📋 Row {i}: {age_group} - {activity_name}")
                    
                    # Check if content is actually there
                    if len(row) > 10:
                        objective = row[10].strip() if row[10] else 'EMPTY'
                        print(f"   Objective: {'✅ FILLED' if objective and objective != 'EMPTY' else '❌ EMPTY'}")
                    
                    if len(row) > 11:
                        explanation = row[11].strip() if row[11] else 'EMPTY'
                        print(f"   Explanation: {'✅ FILLED' if explanation and explanation != 'EMPTY' else '❌ EMPTY'}")
                    
                    if len(row) > 16:
                        materials = row[16].strip() if row[16] else 'EMPTY'
                        print(f"   Materials: {'✅ FILLED' if materials and materials != 'EMPTY' else '❌ EMPTY'}")
                    
                    if len(row) > 18:
                        steps = row[18].strip() if row[18] else 'EMPTY'
                        print(f"   Steps: {'✅ FILLED' if steps and steps != 'EMPTY' else '❌ EMPTY'}")
                    
                    if len(row) > 19:
                        skills = row[19].strip() if row[19] else 'EMPTY'
                        print(f"   Skills: {'✅ FILLED' if skills and skills != 'EMPTY' else '❌ EMPTY'}")
                    
                    if len(row) > 20:
                        hashtags = row[20].strip() if row[20] else 'EMPTY'
                        print(f"   Hashtags: {'✅ FILLED' if hashtags and hashtags != 'EMPTY' else '❌ EMPTY'}")
        
        print(f"\n📊 Total Cognitive Skills activities found: {cognitive_count}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error checking sheet data: {e}")
        return False

def main():
    """Main function to check actual sheet data"""
    print("🔍 Check Actual Sheet Data")
    print("=" * 50)
    print("🎯 Check what's actually in the Google Sheets from bottom up")
    
    success = check_actual_sheet_data()
    
    if success:
        print(f"\n✅ SUCCESS! Actual sheet data checked!")
        return True
    else:
        print(f"\n❌ FAILED to check sheet data!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Actual sheet data checked!")
    else:
        print(f"\n❌ FAILED to check sheet data!")
