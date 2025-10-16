#!/usr/bin/env python3
"""
✅ Show Improved Objective
Show the improved objective without age reference
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

def show_improved_objective():
    """Show the improved objective"""
    
    try:
        print(f"✅ SHOWING IMPROVED OBJECTIVE:")
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
        print(f"🎨 ADVANCED CREATIVE MASTERY STUDIO - IMPROVED OBJECTIVE:")
        print("-" * 60)
        
        for row_num, row in enumerate(all_data[1:], start=2):
            if len(row) > 9 and row[9] == 'Advanced Creative Mastery Studio':
                age_group = row[2] if len(row) > 2 else 'Unknown'
                
                print(f"📋 Row {row_num}: {age_group}")
                print(f"Activity Name: {row[9]}")
                print()
                
                # Show the improved objective
                if len(row) > 10:
                    objective = row[10]
                    print(f"📝 IMPROVED OBJECTIVE:")
                    print(f"   {objective}")
                    print()
                
                # Show a few more examples
                print(f"📝 OTHER IMPROVED OBJECTIVES:")
                print("-" * 40)
                
                # Show a few more examples from different age groups
                examples = [
                    ('Mastermind Planning Adventure', 'Child (6-8)'),
                    ('Logic Detective Academy', 'Pre-Teen (9-12)'),
                    ('Breakthrough Innovation Studio', 'Teen (13-18)')
                ]
                
                for example_name, example_age in examples:
                    for ex_row in all_data[1:]:
                        if len(ex_row) > 9 and ex_row[9] == example_name:
                            ex_objective = ex_row[10] if len(ex_row) > 10 else 'Not found'
                            print(f"   {example_name} ({example_age}):")
                            print(f"   {ex_objective}")
                            print()
                            break
                
                break
        
        print(f"\n✅ COMPARISON - BEFORE vs AFTER:")
        print("=" * 50)
        print("❌ BEFORE (With redundant age):")
        print("   'Fuse advanced creativity with cognition through sophisticated activities that challenge 13-18 years children to use imaginative thinking for complex problem-solving.'")
        print()
        print("✅ AFTER (Clean and focused):")
        print("   'Master the fusion of creativity and analytical thinking to generate breakthrough solutions and original innovations.'")
        print()
        print("🎯 IMPROVEMENTS:")
        print("   ✅ Removed redundant '13-18 years children' (age is in Age Group column)")
        print("   ✅ More concise and powerful")
        print("   ✅ Focuses on the core skill being developed")
        print("   ✅ Specific outcome (breakthrough solutions and innovations)")
        print("   ✅ Action-oriented (Master, generate)")
        
        return True
        
    except Exception as e:
        print(f"❌ Error showing improved objective: {e}")
        return False

def main():
    """Main function to show improved objective"""
    print("✅ Show Improved Objective")
    print("=" * 50)
    print("🎯 Show the improved objective without age reference")
    
    success = show_improved_objective()
    
    if success:
        print(f"\n✅ SUCCESS! Improved objective shown!")
        return True
    else:
        print(f"\n❌ FAILED to show improved objective!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Improved objective shown!")
    else:
        print(f"\n❌ FAILED to show improved objective!")
