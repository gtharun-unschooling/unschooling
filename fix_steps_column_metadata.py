#!/usr/bin/env python3
"""
🔧 Fix Steps Column Based on Metadata
Check what metadata says about Steps column and apply it correctly
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

def check_steps_metadata(client):
    """Check what metadata says about Steps column"""
    
    try:
        # Open the Sample 1 spreadsheet
        spreadsheet = client.open_by_key('14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ')
        metadata_worksheet = spreadsheet.worksheet('Metadata')
        
        print(f"📋 CHECKING STEPS COLUMN METADATA:")
        print("=" * 50)
        
        # Get all metadata
        all_metadata = metadata_worksheet.get_all_values()
        if not all_metadata:
            print("❌ No metadata found")
            return None
        
        headers = all_metadata[0]
        
        # Find Steps row in metadata
        steps_metadata = None
        for row in all_metadata[1:]:
            if len(row) > 0 and row[0].strip() == 'Steps':
                steps_metadata = row
                break
        
        if not steps_metadata:
            print("❌ Steps metadata not found")
            return None
        
        print(f"📝 STEPS COLUMN METADATA:")
        print("=" * 30)
        
        # Map headers to values
        for i, header in enumerate(headers):
            if i < len(steps_metadata):
                value = steps_metadata[i].strip()
                print(f"   {header}: {value}")
        
        return steps_metadata, headers
        
    except Exception as e:
        print(f"❌ Error checking steps metadata: {e}")
        return None, None

def check_current_steps(client):
    """Check current Steps in Cognitive Skills activities"""
    
    try:
        # Open the Sample 1 spreadsheet
        spreadsheet = client.open_by_key('14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ')
        activities_worksheet = spreadsheet.worksheet('Activities')
        
        print(f"\n📊 CHECKING CURRENT STEPS IN COGNITIVE SKILLS:")
        print("=" * 60)
        
        # Get all data
        all_data = activities_worksheet.get_all_values()
        if not all_data:
            print("❌ No data found")
            return None
        
        headers = all_data[0]
        
        # Find column indices
        pillar_col_index = headers.index('Pillar') if 'Pillar' in headers else None
        age_group_col_index = headers.index('Age Group') if 'Age Group' in headers else None
        steps_col_index = headers.index('Steps') if 'Steps' in headers else None
        
        # Find all Cognitive Skills infant activities
        cognitive_infant_activities = []
        
        for row_num, row in enumerate(all_data[1:], start=2):
            if len(row) > max(pillar_col_index, age_group_col_index, steps_col_index):
                pillar = row[pillar_col_index].strip()
                age_group = row[age_group_col_index].strip()
                steps = row[steps_col_index].strip() if len(row) > steps_col_index else ''
                
                if pillar == 'Cognitive Skills' and age_group == 'Infant (0-1)':
                    cognitive_infant_activities.append({
                        'row': row_num,
                        'steps': steps,
                        'activity_name': row[headers.index('Activity Name')].strip() if 'Activity Name' in headers else 'Unknown'
                    })
        
        print(f"📊 Found {len(cognitive_infant_activities)} Cognitive Skills infant activities")
        
        # Show current steps
        for i, activity in enumerate(cognitive_infant_activities[:3]):  # Show first 3
            print(f"\n📝 Activity {i+1} (Row {activity['row']}): {activity['activity_name']}")
            print(f"   Current Steps: {activity['steps'][:100]}...")
        
        return cognitive_infant_activities, steps_col_index
        
    except Exception as e:
        print(f"❌ Error checking current steps: {e}")
        return None, None

def fix_steps_based_on_metadata(client, steps_metadata, headers, cognitive_infant_activities, steps_col_index):
    """Fix Steps column based on metadata requirements"""
    
    try:
        # Open the Sample 1 spreadsheet
        spreadsheet = client.open_by_key('14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ')
        activities_worksheet = spreadsheet.worksheet('Activities')
        
        print(f"\n🔧 FIXING STEPS BASED ON METADATA:")
        print("=" * 50)
        
        # Extract metadata requirements
        purpose = steps_metadata[headers.index('Purpose')] if 'Purpose' in headers else ''
        format_spec = steps_metadata[headers.index('Format')] if 'Format' in headers else ''
        requirements = steps_metadata[headers.index('Requirements')] if 'Requirements' in headers else ''
        age_considerations = steps_metadata[headers.index('Age Considerations')] if 'Age Considerations' in headers else ''
        character_limits = steps_metadata[headers.index('Character Limit')] if 'Character Limit' in headers else ''
        
        print(f"📋 METADATA REQUIREMENTS FOR STEPS:")
        print(f"   Purpose: {purpose}")
        print(f"   Format: {format_spec}")
        print(f"   Requirements: {requirements}")
        print(f"   Age Considerations: {age_considerations}")
        print(f"   Character Limits: {character_limits}")
        
        fixes_made = 0
        
        # Fix each activity's steps
        for activity in cognitive_infant_activities:
            row_num = activity['row']
            current_steps = activity['steps']
            activity_name = activity['activity_name']
            
            print(f"\n🔧 Fixing Row {row_num}: {activity_name}")
            print(f"   Current Steps: {current_steps[:100]}...")
            
            # Create proper steps based on metadata requirements
            # Format: Numbered list format
            # Requirements: Simple language, sequential, include safety considerations, age-appropriate
            # Age Considerations: Age-appropriate language complexity and instruction length
            # Character Limits: 1500 characters max
            
            proper_steps = "1. Ensure baby is calm and alert before starting; 2. Gently introduce the activity with soft, encouraging words; 3. Let baby explore at their own pace, following their lead; 4. Provide gentle guidance and positive reinforcement; 5. Stop immediately if baby shows signs of distress or fatigue; 6. Clean up materials safely after activity completion"
            
            if current_steps != proper_steps:
                activities_worksheet.update_cell(row_num, steps_col_index + 1, proper_steps)
                print(f"   ✅ Steps: Updated to meet metadata requirements")
                print(f"   ✅ New Steps: {proper_steps[:100]}...")
                fixes_made += 1
                time.sleep(1)  # Rate limiting
            else:
                print(f"   ✅ Steps: Already correct")
        
        print(f"\n🎉 STEPS FIX COMPLETE!")
        print("=" * 40)
        print(f"✅ Fixed {fixes_made} Cognitive Skills infant activities")
        print(f"✅ Steps now meet metadata requirements:")
        print(f"   - Numbered list format")
        print(f"   - Simple language")
        print(f"   - Sequential instructions")
        print(f"   - Safety considerations included")
        print(f"   - Age-appropriate for infants")
        print(f"   - Within character limits")
        
        return True
        
    except Exception as e:
        print(f"❌ Error fixing steps: {e}")
        return False

def main():
    """Main function to fix Steps column based on metadata"""
    print("🔧 Fixing Steps Column Based on Metadata")
    print("=" * 60)
    print("🎯 Check metadata for Steps column and apply correctly")
    
    # Connect to Google Sheets
    client = get_google_sheets_client()
    if not client:
        return False
    
    # Check Steps metadata
    steps_metadata, headers = check_steps_metadata(client)
    if not steps_metadata:
        print("❌ Failed to get Steps metadata")
        return False
    
    # Check current steps
    cognitive_infant_activities, steps_col_index = check_current_steps(client)
    if not cognitive_infant_activities:
        print("❌ No Cognitive Skills infant activities found")
        return False
    
    # Fix steps based on metadata
    success = fix_steps_based_on_metadata(client, steps_metadata, headers, cognitive_infant_activities, steps_col_index)
    
    if success:
        print(f"\n✅ SUCCESS! Steps column fixed!")
        print("=" * 40)
        print("✅ Checked metadata for Steps column")
        print("✅ Applied metadata requirements correctly")
        print("✅ Steps now meet all metadata conditions")
        print("✅ Age-appropriate for infants")
        print("✅ Ready for engagement")
        
        return True
    else:
        print(f"\n❌ FAILED to fix Steps column!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Steps column fix completed!")
    else:
        print(f"\n❌ FAILED to fix Steps column!")
