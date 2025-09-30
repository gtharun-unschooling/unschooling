#!/usr/bin/env python3
"""
👶 Check Inappropriate Infant Activities (0-6 months)
Identify activities that are not developmentally appropriate for 0-6 month olds
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
        print("✅ Connected to Google Sheets")
        return client
    except Exception as e:
        print(f"❌ Error connecting to Google Sheets: {e}")
        return None

def check_infant_activities(client):
    """Check all 0-6 month activities for developmental appropriateness"""
    
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
        
        print(f"🔍 Column indices: Activity ID={activity_id_col_index}, Age Group={age_group_col_index}, Activity Name={activity_name_col_index}, Steps={steps_col_index}, Pillar={pillar_col_index}")
        
        if activity_id_col_index is None:
            print("❌ Activity ID column not found")
            return False
        if age_group_col_index is None:
            print("❌ Age Group column not found")
            return False
        if activity_name_col_index is None:
            print("❌ Activity Name column not found")
            return False
        if steps_col_index is None:
            print("❌ Steps column not found")
            return False
        if pillar_col_index is None:
            print("❌ Pillar column not found")
            return False
        
        print(f"📊 Checking infant activities (0-6 months)...")
        
        # Find all 0-6 month activities
        infant_activities = []
        
        for row_num, row in enumerate(all_data[1:], start=2):
            if len(row) > max(activity_id_col_index, age_group_col_index, activity_name_col_index, steps_col_index, pillar_col_index):
                activity_id = row[activity_id_col_index].strip()
                age_group = row[age_group_col_index].strip()
                activity_name = row[activity_name_col_index].strip()
                steps = row[steps_col_index].strip()
                pillar = row[pillar_col_index].strip()
                
                # Check for 0-6 month activities
                if 'infant' in activity_id.lower() and age_group == '0-6 months':
                    infant_activities.append({
                        'row': row_num,
                        'activity_id': activity_id,
                        'activity_name': activity_name,
                        'steps': steps,
                        'pillar': pillar
                    })
        
        print(f"\n👶 FOUND {len(infant_activities)} INFANT ACTIVITIES (0-6 months):")
        print("=" * 70)
        
        # Analyze each activity for developmental appropriateness
        inappropriate_activities = []
        
        for activity in infant_activities:
            activity_name_lower = activity['activity_name'].lower()
            steps_lower = activity['steps'].lower()
            
            # Check for inappropriate skills/activities
            inappropriate_keywords = [
                'stack', 'tower', 'build', 'arrange', 'sort', 'match', 'draw', 'paint', 'color',
                'write', 'trace', 'cut', 'glue', 'stick', 'craft', 'make', 'create art',
                'hold block', 'grasp block', 'fine motor', 'precise', 'detailed',
                'problem solve', 'think', 'reason', 'remember', 'recall'
            ]
            
            is_inappropriate = False
            inappropriate_reasons = []
            
            for keyword in inappropriate_keywords:
                if keyword in activity_name_lower:
                    is_inappropriate = True
                    inappropriate_reasons.append(f"Activity name contains '{keyword}'")
                if keyword in steps_lower:
                    is_inappropriate = True
                    inappropriate_reasons.append(f"Steps contain '{keyword}'")
            
            # Additional checks for specific inappropriate activities
            if 'soft block' in activity_name_lower and 'stack' in activity_name_lower:
                is_inappropriate = True
                inappropriate_reasons.append("Soft block stacking requires skills infants don't have")
            
            if is_inappropriate:
                inappropriate_activities.append({
                    'activity': activity,
                    'reasons': inappropriate_reasons
                })
        
        # Display results
        print(f"\n🚨 INAPPROPRIATE ACTIVITIES FOUND: {len(inappropriate_activities)}")
        print("=" * 50)
        
        if inappropriate_activities:
            for item in inappropriate_activities:
                activity = item['activity']
                reasons = item['reasons']
                
                print(f"\n❌ Row {activity['row']}: {activity['activity_name']}")
                print(f"   Pillar: {activity['pillar']}")
                print(f"   Activity ID: {activity['activity_id']}")
                print(f"   Why inappropriate:")
                for reason in reasons:
                    print(f"     - {reason}")
                print(f"   Steps: {activity['steps'][:100]}...")
        else:
            print("✅ All infant activities appear developmentally appropriate!")
        
        # Show all infant activities for context
        print(f"\n📋 ALL INFANT ACTIVITIES (0-6 months):")
        print("=" * 50)
        
        for activity in infant_activities:
            print(f"   Row {activity['row']}: {activity['activity_name']} ({activity['pillar']})")
        
        return True
        
    except Exception as e:
        print(f"❌ Error checking infant activities: {e}")
        return False

def main():
    """Main function to check infant activities"""
    print("👶 Checking Inappropriate Infant Activities (0-6 months)")
    print("=" * 60)
    print("🎯 Looking for activities that require skills infants don't have yet")
    
    # Connect to Google Sheets
    client = get_google_sheets_client()
    if not client:
        return False
    
    # Check infant activities
    success = check_infant_activities(client)
    
    if success:
        print(f"\n✅ SUCCESS! Infant activity analysis completed!")
        return True
    else:
        print(f"\n❌ FAILED to analyze infant activities!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Infant activity check completed!")
    else:
        print(f"\n❌ FAILED to check infant activities!")
