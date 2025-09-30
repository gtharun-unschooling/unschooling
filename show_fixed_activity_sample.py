#!/usr/bin/env python3
"""
✅ Show Fixed Activity Sample
Show the before/after of the Advanced Creative Mastery Studio activity
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

def show_fixed_activity_sample():
    """Show the fixed activity sample"""
    
    try:
        print(f"✅ SHOWING FIXED ACTIVITY SAMPLE:")
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
        
        # Find the Advanced Creative Mastery Studio activity
        print(f"🎨 ADVANCED CREATIVE MASTERY STUDIO - AFTER FIX:")
        print("-" * 60)
        
        for row_num, row in enumerate(all_data[1:], start=2):
            if len(row) > 9 and row[9] == 'Advanced Creative Mastery Studio':
                age_group = row[2] if len(row) > 2 else 'Unknown'
                
                print(f"📋 Row {row_num}: {age_group}")
                print(f"Activity Name: {row[9]}")
                print()
                
                # Show the fixed content
                if len(row) > 10:
                    objective = row[10]
                    print(f"📝 OBJECTIVE:")
                    print(f"   {objective}")
                    print()
                
                if len(row) > 11:
                    explanation = row[11]
                    print(f"📖 EXPLANATION:")
                    print(f"   {explanation}")
                    print()
                
                if len(row) > 16:
                    materials = row[16]
                    print(f"🧰 MATERIALS:")
                    print(f"   {materials}")
                    print()
                
                if len(row) > 18:
                    steps = row[18]
                    print(f"📋 STEPS:")
                    step_lines = steps.split('\n')
                    for step in step_lines[:4]:  # Show first 4 steps
                        if step.strip():
                            print(f"   {step}")
                    if len(step_lines) > 4:
                        print(f"   ... and {len(step_lines) - 4} more steps")
                    print()
                
                if len(row) > 19:
                    skills = row[19]
                    print(f"🎯 SKILLS:")
                    print(f"   {skills}")
                    print()
                
                if len(row) > 20:
                    hashtags = row[20]
                    print(f"🏷️ HASHTAGS:")
                    print(f"   {hashtags}")
                
                break
        
        print(f"\n✅ COMPARISON - BEFORE vs AFTER:")
        print("=" * 50)
        print("❌ BEFORE (Generic):")
        print("   Explanation: 'This comprehensive activity helps 13-18 years children develop essential cognitive skills...'")
        print("   Materials: 'Age-appropriate materials and tools specifically selected for...'")
        print("   Steps: Generic 6-step template")
        print()
        print("✅ AFTER (Specific):")
        print("   Explanation: 'This sophisticated creative studio challenges 13-18 years children to fuse advanced creativity...'")
        print("   Materials: 'Advanced creative tools (digital design software, 3D modeling kits, innovation workbooks)...'")
        print("   Steps: Specific 6-step creative studio process")
        
        return True
        
    except Exception as e:
        print(f"❌ Error showing fixed activity: {e}")
        return False

def main():
    """Main function to show fixed activity sample"""
    print("✅ Show Fixed Activity Sample")
    print("=" * 50)
    print("🎯 Show the before/after of the Advanced Creative Mastery Studio")
    
    success = show_fixed_activity_sample()
    
    if success:
        print(f"\n✅ SUCCESS! Fixed activity sample shown!")
        return True
    else:
        print(f"\n❌ FAILED to show fixed activity!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Fixed activity sample shown!")
    else:
        print(f"\n❌ FAILED to show fixed activity!")
