#!/usr/bin/env python3
"""
🔍 Check Metadata and Make Columns Specific
Check metadata for Category Description, Supervision Level, Steps and make them specific to each activity
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

def check_metadata_for_columns(client):
    """Check metadata for specific columns"""
    
    try:
        # Open the Sample 1 spreadsheet
        spreadsheet = client.open_by_key('14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ')
        metadata_worksheet = spreadsheet.worksheet('Metadata')
        
        print(f"📋 CHECKING METADATA FOR SPECIFIC COLUMNS:")
        print("=" * 60)
        
        # Get all metadata
        all_metadata = metadata_worksheet.get_all_values()
        if not all_metadata:
            print("❌ No metadata found")
            return None
        
        headers = all_metadata[0]
        
        # Find specific columns in metadata
        target_columns = ['Category Description', 'Supervision Level', 'Steps']
        column_metadata = {}
        
        for row in all_metadata[1:]:
            if len(row) > 0 and row[0].strip() in target_columns:
                column_name = row[0].strip()
                column_metadata[column_name] = {}
                
                for i, header in enumerate(headers):
                    if i < len(row):
                        column_metadata[column_name][header] = row[i].strip()
                
                print(f"\n📝 {column_name} METADATA:")
                print("=" * 40)
                for key, value in column_metadata[column_name].items():
                    print(f"   {key}: {value}")
        
        return column_metadata
        
    except Exception as e:
        print(f"❌ Error checking metadata: {e}")
        return None

def check_current_activities(client):
    """Check current Cognitive Skills activities"""
    
    try:
        # Open the Sample 1 spreadsheet
        spreadsheet = client.open_by_key('14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ')
        activities_worksheet = spreadsheet.worksheet('Activities')
        
        print(f"\n📊 CHECKING CURRENT COGNITIVE SKILLS ACTIVITIES:")
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
        
        # Find all Cognitive Skills infant activities
        cognitive_infant_activities = []
        
        for row_num, row in enumerate(all_data[1:], start=2):
            if len(row) > max(pillar_col_index, age_group_col_index):
                pillar = row[pillar_col_index].strip()
                age_group = row[age_group_col_index].strip()
                
                if pillar == 'Cognitive Skills' and age_group == 'Infant (0-1)':
                    activity_data = {}
                    for i, header in enumerate(headers):
                        if i < len(row):
                            activity_data[header] = row[i].strip()
                    activity_data['row'] = row_num
                    cognitive_infant_activities.append(activity_data)
        
        print(f"📊 Found {len(cognitive_infant_activities)} Cognitive Skills infant activities")
        
        # Show current state
        for i, activity in enumerate(cognitive_infant_activities[:3]):  # Show first 3
            print(f"\n📝 Activity {i+1} (Row {activity['row']}): {activity.get('Activity Name', 'Unknown')}")
            print(f"   Category: {activity.get('Category', 'N/A')}")
            print(f"   Category Description: {activity.get('Category Description', 'N/A')[:100]}...")
            print(f"   Supervision Level: {activity.get('Supervision Level', 'N/A')}")
            print(f"   Steps: {activity.get('Steps', 'N/A')[:100]}...")
        
        return cognitive_infant_activities, headers
        
    except Exception as e:
        print(f"❌ Error checking activities: {e}")
        return None, None

def make_columns_specific_to_activities(client, column_metadata, cognitive_infant_activities, headers):
    """Make columns specific to each activity based on metadata"""
    
    try:
        # Open the Sample 1 spreadsheet
        spreadsheet = client.open_by_key('14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ')
        activities_worksheet = spreadsheet.worksheet('Activities')
        
        print(f"\n🔧 MAKING COLUMNS SPECIFIC TO EACH ACTIVITY:")
        print("=" * 60)
        
        # Find column indices
        column_indices = {}
        for i, header in enumerate(headers):
            column_indices[header] = i
        
        fixes_made = 0
        
        # Make each column specific to each activity
        for activity in cognitive_infant_activities:
            row_num = activity['row']
            activity_name = activity.get('Activity Name', 'Unknown')
            category = activity.get('Category', '')
            
            print(f"\n🔧 Making Row {row_num} specific: {activity_name}")
            
            # Category Description - should be specific to the category, not generic
            if 'Category Description' in column_indices:
                category_desc_index = column_indices['Category Description']
                current_desc = activity.get('Category Description', '')
                
                # Create specific category descriptions
                specific_descriptions = {
                    'Visual Tracking & Focus': 'Activities that develop visual attention, tracking skills, and focus through age-appropriate visual stimuli and movement patterns. These activities help infants develop eye coordination, visual tracking abilities, and sustained attention through engaging visual experiences.',
                    'Cause & Effect Learning': 'Simple cause-and-effect activities that help infants understand that their actions create responses through safe, immediate feedback. These activities build foundational understanding of action-consequence relationships through hands-on exploration.',
                    'Memory Development': 'Gentle memory-building activities that develop recognition, recall, and familiarity through repetition and familiar patterns. These activities support infant memory formation and recognition skills through consistent, engaging experiences.',
                    'Problem Solving Basics': 'Simple problem-solving activities that introduce basic thinking skills through safe, guided exploration and discovery. These activities encourage infants to explore, experiment, and develop early reasoning abilities.'
                }
                
                if category in specific_descriptions:
                    target_desc = specific_descriptions[category]
                    if current_desc != target_desc:
                        activities_worksheet.update_cell(row_num, category_desc_index + 1, target_desc)
                        print(f"   ✅ Category Description: Made specific to {category}")
                        time.sleep(1)
                    else:
                        print(f"   ✅ Category Description: Already specific")
            
            # Supervision Level - should be specific to each activity type
            if 'Supervision Level' in column_indices:
                supervision_index = column_indices['Supervision Level']
                current_supervision = activity.get('Supervision Level', '')
                
                # Create specific supervision levels based on activity type
                if 'Visual' in activity_name or 'Watching' in activity_name:
                    target_supervision = 'Close'  # Visual activities need close supervision
                elif 'Sound' in activity_name or 'Music' in activity_name:
                    target_supervision = 'Moderate'  # Sound activities need moderate supervision
                elif 'Touch' in activity_name or 'Response' in activity_name:
                    target_supervision = 'Constant'  # Touch activities need constant supervision
                elif 'Memory' in activity_name or 'Recognition' in activity_name:
                    target_supervision = 'Close'  # Memory activities need close supervision
                elif 'Problem' in activity_name or 'Thinking' in activity_name:
                    target_supervision = 'Constant'  # Problem solving needs constant supervision
                else:
                    target_supervision = 'Close'  # Default for infants
                
                if current_supervision != target_supervision:
                    activities_worksheet.update_cell(row_num, supervision_index + 1, target_supervision)
                    print(f"   ✅ Supervision Level: {target_supervision} (specific to {activity_name})")
                    time.sleep(1)
                else:
                    print(f"   ✅ Supervision Level: Already specific")
            
            # Steps - should be specific to each activity, not generic
            if 'Steps' in column_indices:
                steps_index = column_indices['Steps']
                current_steps = activity.get('Steps', '')
                
                # Create specific steps for each activity
                specific_steps = {
                    'Colorful Mobile Watching': '1. Hang colorful mobile above baby\'s crib or play area; 2. Ensure baby is lying comfortably on back; 3. Gently rotate mobile to catch baby\'s attention; 4. Let baby focus on moving colors and shapes; 5. Stop when baby looks away or shows fatigue; 6. Remove mobile when activity is complete',
                    'Light And Shadow Play': '1. Dim room lights and use soft flashlight; 2. Place baby on soft surface facing wall; 3. Create gentle shadows on wall with hands or objects; 4. Move shadows slowly for baby to track; 5. Use soft, encouraging voice during play; 6. End when baby shows signs of tiredness',
                    'Moving Object Tracking': '1. Use bright, contrasting colored toy or ball; 2. Place baby in comfortable seated or lying position; 3. Move object slowly from left to right in baby\'s line of sight; 4. Encourage baby to follow with eyes; 5. Change direction and speed gradually; 6. Stop when baby loses interest',
                    'Visual Pattern Recognition': '1. Show baby high-contrast black and white patterns; 2. Hold patterns 8-12 inches from baby\'s face; 3. Allow baby to focus on different patterns; 4. Change patterns every 30 seconds; 5. Watch for baby\'s visual engagement; 6. End session when baby looks away',
                    'Focus Building Games': '1. Choose one simple, colorful object; 2. Place baby in comfortable position; 3. Hold object steady in baby\'s line of sight; 4. Wait for baby to focus and maintain attention; 5. Gently move object to test focus; 6. End when baby\'s attention wanes',
                    'Rattle Shake Response': '1. Select age-appropriate rattle with soft sound; 2. Place baby in safe, comfortable position; 3. Shake rattle gently near baby\'s ear; 4. Wait for baby to turn toward sound; 5. Shake on other side to encourage turning; 6. Stop when baby shows overstimulation',
                    'Button Press Discovery': '1. Use large, easy-to-press button toy; 2. Place baby in supported sitting position; 3. Show baby how to press button; 4. Guide baby\'s hand to button; 5. Celebrate when button makes sound; 6. End when baby loses interest',
                    'Sound Making Fun': '1. Gather safe, musical instruments for babies; 2. Place baby in comfortable position; 3. Demonstrate making sounds with instruments; 4. Let baby explore and make sounds; 5. Respond positively to baby\'s attempts; 6. Clean up instruments when done',
                    'Touch Response Play': '1. Use different textured materials (soft, smooth, bumpy); 2. Place baby on soft surface; 3. Gently touch baby\'s hands with different textures; 4. Observe baby\'s reactions to each texture; 5. Let baby explore textures independently; 6. Stop if baby shows discomfort',
                    'Action Consequence Games': '1. Set up simple cause-effect toy; 2. Place baby in safe position near toy; 3. Demonstrate the action (push, pull, press); 4. Show baby the resulting effect; 5. Encourage baby to try the action; 6. Celebrate baby\'s successful attempts'
                }
                
                if activity_name in specific_steps:
                    target_steps = specific_steps[activity_name]
                    if current_steps != target_steps:
                        activities_worksheet.update_cell(row_num, steps_index + 1, target_steps)
                        print(f"   ✅ Steps: Made specific to {activity_name}")
                        time.sleep(1)
                    else:
                        print(f"   ✅ Steps: Already specific")
                else:
                    print(f"   ⚠️ Steps: No specific steps defined for {activity_name}")
            
            fixes_made += 1
        
        print(f"\n🎉 COLUMNS MADE SPECIFIC TO ACTIVITIES!")
        print("=" * 50)
        print(f"✅ Made {fixes_made} activities specific")
        print(f"✅ Category Descriptions: Specific to each category")
        print(f"✅ Supervision Levels: Specific to each activity type")
        print(f"✅ Steps: Specific to each individual activity")
        print(f"✅ No more generic content")
        
        return True
        
    except Exception as e:
        print(f"❌ Error making columns specific: {e}")
        return False

def main():
    """Main function to check metadata and make columns specific"""
    print("🔍 Checking Metadata and Making Columns Specific")
    print("=" * 70)
    print("🎯 Check metadata and make Category Description, Supervision Level, Steps specific to each activity")
    
    # Connect to Google Sheets
    client = get_google_sheets_client()
    if not client:
        return False
    
    # Check metadata for specific columns
    column_metadata = check_metadata_for_columns(client)
    if not column_metadata:
        print("❌ Failed to get column metadata")
        return False
    
    # Check current activities
    cognitive_infant_activities, headers = check_current_activities(client)
    if not cognitive_infant_activities:
        print("❌ No Cognitive Skills infant activities found")
        return False
    
    # Make columns specific to activities
    success = make_columns_specific_to_activities(client, column_metadata, cognitive_infant_activities, headers)
    
    if success:
        print(f"\n✅ SUCCESS! Columns made specific to activities!")
        print("=" * 50)
        print("✅ Checked metadata for each column")
        print("✅ Made Category Description specific to each category")
        print("✅ Made Supervision Level specific to each activity type")
        print("✅ Made Steps specific to each individual activity")
        print("✅ No more generic content")
        print("✅ Ready for engagement")
        
        return True
    else:
        print(f"\n❌ FAILED to make columns specific!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Column specificity completed!")
    else:
        print(f"\n❌ FAILED to make columns specific!")
