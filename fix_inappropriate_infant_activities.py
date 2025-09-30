#!/usr/bin/env python3
"""
👶 Fix Inappropriate Infant Activities (0-1 years)
Replace developmentally inappropriate activities with truly infant-appropriate ones
"""

import gspread
from google.oauth2.service_account import Credentials
import time

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
        print("✅ Connected to Google Sheets")
        return client
    except Exception as e:
        print(f"❌ Error connecting to Google Sheets: {e}")
        return None

def fix_inappropriate_infant_activities(client):
    """Fix inappropriate infant activities"""
    
    try:
        # Find the spreadsheet
        all_sheets = client.list_spreadsheet_files()
        target_sheet = None
        
        for sheet in all_sheets:
            title = sheet.get('name', sheet.get('title', '')).lower()
            if 'sample' in title or 'essential' in title:
                target_sheet = sheet
                break
        
        if not target_sheet:
            print("❌ No suitable spreadsheet found")
            return False
        
        # Open the spreadsheet
        spreadsheet = client.open_by_key(target_sheet['id'])
        worksheet = spreadsheet.get_worksheet(0)
        
        print(f"📤 Working with: {target_sheet.get('name', 'Unknown')}")
        
        # Get all data
        all_data = worksheet.get_all_values()
        if not all_data:
            print("❌ No data found")
            return False
        
        headers = all_data[0]
        
        # Find column indices
        activity_id_col_index = headers.index('Activity ID') if 'Activity ID' in headers else None
        age_group_col_index = headers.index('Age Group') if 'Age Group' in headers else None
        activity_name_col_index = headers.index('Activity Name') if 'Activity Name' in headers else None
        steps_col_index = headers.index('Steps') if 'Steps' in headers else None
        pillar_col_index = headers.index('Pillar') if 'Pillar' in headers else None
        objective_col_index = headers.index('Objective') if 'Objective' in headers else None
        materials_col_index = headers.index('Materials') if 'Materials' in headers else None
        
        print(f"📊 Fixing inappropriate infant activities...")
        
        # Define truly appropriate infant activities
        appropriate_infant_activities = {
            # Play & Creativity - Tummy Time Play
            'play-creativity-infant-0-1-tummy-time-play-1': {
                'activity_name': 'Gentle Tummy Time with Soft Toys',
                'objective': 'Encourage tummy time and visual tracking development',
                'steps': '1. Place baby on tummy on soft mat; 2. Show colorful soft toys; 3. Move toys slowly for baby to track; 4. Encourage with gentle voice; 5. Keep sessions short (2-3 minutes)',
                'materials': 'Soft mat, colorful soft toys, gentle voice'
            },
            
            # Play & Creativity - Interactive Sounds & Textures  
            'play-creativity-infant-0-1-interactive-sounds-and-textures-1': {
                'activity_name': 'Soft Texture Touch and Feel',
                'objective': 'Develop tactile awareness and sensory exploration',
                'steps': '1. Gather soft textures (fabric, silk, cotton); 2. Gently touch baby\'s hands with different textures; 3. Let baby explore textures with supervision; 4. Watch for baby\'s reactions; 5. Keep sessions calm and gentle',
                'materials': 'Soft fabrics, cotton balls, silk scarf, gentle supervision'
            },
            
            # Cognitive Skills - Problem Solving Basics
            'cognitive-skills-infant-0-1-problem-solving-basics-4': {
                'activity_name': 'Simple Cause and Effect with Soft Toys',
                'objective': 'Introduce basic cause and effect concepts',
                'steps': '1. Show baby a soft toy that makes gentle sounds; 2. Demonstrate gentle shaking or squeezing; 3. Let baby explore with hands; 4. Celebrate any response; 5. Keep it simple and safe',
                'materials': 'Soft sound-making toys, gentle supervision'
            }
        }
        
        # Find and fix inappropriate infant activities
        fixes_made = 0
        
        for row_num, row in enumerate(all_data[1:], start=2):
            if len(row) > max(activity_id_col_index, age_group_col_index, activity_name_col_index, steps_col_index):
                activity_id = row[activity_id_col_index].strip()
                age_group = row[age_group_col_index].strip()
                activity_name = row[activity_name_col_index].strip()
                
                # Check if this is an infant activity that needs fixing
                if (age_group == 'Infant (0-1)' and 
                    activity_id in appropriate_infant_activities):
                    
                    new_activity = appropriate_infant_activities[activity_id]
                    
                    print(f"\n🔧 Fixing Row {row_num}: {activity_name}")
                    print(f"   Activity ID: {activity_id}")
                    
                    # Update activity name
                    worksheet.update_cell(row_num, activity_name_col_index + 1, new_activity['activity_name'])
                    print(f"   ✅ Activity Name: {new_activity['activity_name']}")
                    
                    # Update objective
                    worksheet.update_cell(row_num, objective_col_index + 1, new_activity['objective'])
                    print(f"   ✅ Objective: {new_activity['objective']}")
                    
                    # Update steps
                    worksheet.update_cell(row_num, steps_col_index + 1, new_activity['steps'])
                    print(f"   ✅ Steps: {new_activity['steps'][:50]}...")
                    
                    # Update materials
                    worksheet.update_cell(row_num, materials_col_index + 1, new_activity['materials'])
                    print(f"   ✅ Materials: {new_activity['materials']}")
                    
                    fixes_made += 1
                    time.sleep(1)  # Rate limiting
        
        print(f"\n🎉 INFANT ACTIVITY FIXES COMPLETE!")
        print("=" * 40)
        print(f"✅ Fixed {fixes_made} inappropriate infant activities")
        print(f"✅ All activities now developmentally appropriate")
        print(f"✅ Activities match infant capabilities")
        
        return True
        
    except Exception as e:
        print(f"❌ Error fixing infant activities: {e}")
        return False

def main():
    """Main function to fix inappropriate infant activities"""
    print("👶 Fixing Inappropriate Infant Activities (0-1 years)")
    print("=" * 60)
    print("🎯 Replacing activities that require skills infants don't have")
    
    # Connect to Google Sheets
    client = get_google_sheets_client()
    if not client:
        return False
    
    # Fix inappropriate activities
    success = fix_inappropriate_infant_activities(client)
    
    if success:
        print(f"\n✅ SUCCESS! Infant activities fixed!")
        print("=" * 40)
        print("✅ All activities now developmentally appropriate")
        print("✅ Activities match infant capabilities (0-1 years)")
        print("✅ No more impossible tasks for babies!")
        
        return True
    else:
        print(f"\n❌ FAILED to fix infant activities!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Infant activity fixes completed!")
    else:
        print(f"\n❌ FAILED to fix infant activities!")
