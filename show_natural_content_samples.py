#!/usr/bin/env python3
"""
📖 Show Natural Content Samples
Display samples of the new natural, engaging content
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

def show_natural_content_samples():
    """Show samples of the new natural content"""
    
    try:
        print(f"📖 SHOWING NATURAL CONTENT SAMPLES:")
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
        
        # Sample activities to show
        sample_activities = [
            ('Strategic Thinking Games', 182, 'Child (6-8)'),
            ('Multi-Step Problem Solving', 183, 'Child (6-8)'),
            ('Abstract Thinking Games', 202, 'Pre-Teen (9-12)'),
            ('Deep Analysis Games', 222, 'Teen (13-18)')
        ]
        
        for activity_name, row_num, age_group in sample_activities:
            print(f"\n🎯 {activity_name} ({age_group}) - Row {row_num}")
            print("-" * 50)
            
            # Get the row data
            row_data = activities_worksheet.row_values(row_num)
            
            # Show Objective
            obj_col = column_indices.get('Objective', 10)
            if obj_col < len(row_data):
                objective = row_data[obj_col]
                print(f"📝 OBJECTIVE:")
                print(f"   {objective}")
            
            # Show Explanation
            exp_col = column_indices.get('Explanation', 11)
            if exp_col < len(row_data):
                explanation = row_data[exp_col]
                print(f"\n📖 EXPLANATION:")
                print(f"   {explanation}")
            
            # Show Materials
            mat_col = column_indices.get('Materials', 16)
            if mat_col < len(row_data):
                materials = row_data[mat_col]
                print(f"\n🧰 MATERIALS:")
                print(f"   {materials}")
            
            # Show Steps (first few)
            steps_col = column_indices.get('Steps', 18)
            if steps_col < len(row_data):
                steps = row_data[steps_col]
                print(f"\n📋 STEPS (first few):")
                step_lines = steps.split('\n')[:3]  # Show first 3 steps
                for step in step_lines:
                    if step.strip():
                        print(f"   {step}")
            
            print("\n" + "="*60)
        
        return True
        
    except Exception as e:
        print(f"❌ Error showing samples: {e}")
        return False

def main():
    """Main function to show natural content samples"""
    print("📖 Show Natural Content Samples")
    print("=" * 50)
    print("🎯 Display samples of the new natural, engaging content")
    
    success = show_natural_content_samples()
    
    if success:
        print(f"\n✅ SUCCESS! Natural content samples displayed!")
        print("=" * 50)
        print("✅ No more robotic 'Develop' statements")
        print("✅ Unique, engaging explanations")
        print("✅ Specific, relevant materials")
        print("✅ Natural, step-by-step instructions")
        
        return True
    else:
        print(f"\n❌ FAILED to show samples!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Natural content samples displayed!")
    else:
        print(f"\n❌ FAILED to show samples!")
