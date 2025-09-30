#!/usr/bin/env python3
"""
🎯 Comprehensive Age Appropriateness Check for Play & Creativity Pillar
Check ALL age groups to ensure activities match developmental capabilities
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

def check_age_appropriateness(client):
    """Check age appropriateness for all Play & Creativity activities"""
    
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
        category_col_index = headers.index('Category') if 'Category' in headers else None
        
        print(f"📊 Analyzing Play & Creativity activities for age appropriateness...")
        
        # Define age-appropriate capabilities and inappropriate activities
        age_capabilities = {
            'Infant (0-1)': {
                'can_do': [
                    'sensory exploration', 'visual tracking', 'basic cause and effect',
                    'simple social interaction', 'tummy time', 'gentle touch',
                    'listening to sounds', 'following moving objects'
                ],
                'cannot_do': [
                    'stack blocks', 'build towers', 'draw', 'paint', 'color', 'write',
                    'trace', 'cut', 'glue', 'craft', 'problem solve', 'think abstractly',
                    'remember complex instructions', 'sort', 'match', 'arrange',
                    'fine motor skills', 'precise movements'
                ]
            },
            'Toddler (1-3)': {
                'can_do': [
                    'basic stacking', 'simple drawing', 'pretend play', 'building with blocks',
                    'simple sorting', 'color recognition', 'basic matching',
                    'exploring musical instruments', 'simple crafts with help'
                ],
                'cannot_do': [
                    'complex problem solving', 'writing', 'detailed drawing',
                    'complex crafts', 'abstract thinking', 'planning ahead'
                ]
            },
            'Preschooler (3-5)': {
                'can_do': [
                    'drawing', 'coloring', 'simple crafts', 'pretend play', 'role playing',
                    'basic puzzles', 'simple sorting', 'shape matching', 'color matching',
                    'cutting with safety scissors', 'gluing with help'
                ],
                'cannot_do': [
                    'complex writing', 'detailed artwork', 'abstract concepts',
                    'complex problem solving', 'multi-step planning'
                ]
            },
            'Child (6-8)': {
                'can_do': [
                    'drawing', 'painting', 'writing', 'crafting', 'storytelling',
                    'building', 'problem solving', 'creative thinking', 'planning',
                    'detailed artwork', 'multi-step projects'
                ],
                'cannot_do': [
                    'complex abstract thinking', 'advanced technical skills',
                    'adult-level problem solving'
                ]
            },
            'Pre-Teen (9-12)': {
                'can_do': [
                    'advanced drawing', 'complex crafts', 'design thinking',
                    'creative projects', 'problem solving', 'planning',
                    'technical skills', 'abstract thinking', 'detailed work'
                ],
                'cannot_do': [
                    'adult-level complex projects', 'professional skills'
                ]
            },
            'Teen (13-18)': {
                'can_do': [
                    'advanced creative projects', 'complex problem solving',
                    'detailed planning', 'technical skills', 'abstract thinking',
                    'professional-level work', 'independent projects'
                ],
                'cannot_do': [
                    'expert-level skills without training'
                ]
            }
        }
        
        # Collect activities by age group
        activities_by_age = {}
        inappropriate_activities = []
        
        for row_num, row in enumerate(all_data[1:], start=2):
            if len(row) > max(activity_id_col_index, age_group_col_index, activity_name_col_index, steps_col_index, pillar_col_index):
                activity_id = row[activity_id_col_index].strip()
                age_group = row[age_group_col_index].strip()
                activity_name = row[activity_name_col_index].strip()
                steps = row[steps_col_index].strip()
                pillar = row[pillar_col_index].strip()
                category = row[category_col_index].strip()
                
                # Only analyze Play & Creativity activities
                if pillar == 'Play & Creativity':
                    if age_group not in activities_by_age:
                        activities_by_age[age_group] = []
                    
                    activities_by_age[age_group].append({
                        'row': row_num,
                        'activity_id': activity_id,
                        'activity_name': activity_name,
                        'steps': steps,
                        'category': category
                    })
                    
                    # Check for inappropriate activities
                    if age_group in age_capabilities:
                        capabilities = age_capabilities[age_group]
                        activity_name_lower = activity_name.lower()
                        steps_lower = steps.lower()
                        
                        # Check if activity requires skills they can't do
                        is_inappropriate = False
                        inappropriate_reasons = []
                        
                        for cannot_do in capabilities['cannot_do']:
                            if cannot_do in activity_name_lower or cannot_do in steps_lower:
                                is_inappropriate = True
                                inappropriate_reasons.append(f"Requires {cannot_do} (not age-appropriate)")
                        
                        if is_inappropriate:
                            inappropriate_activities.append({
                                'row': row_num,
                                'activity_id': activity_id,
                                'activity_name': activity_name,
                                'age_group': age_group,
                                'category': category,
                                'steps': steps,
                                'reasons': inappropriate_reasons
                            })
        
        # Display comprehensive analysis
        print(f"\n📊 PLAY & CREATIVITY AGE GROUP ANALYSIS:")
        print("=" * 60)
        
        for age_group, activities in sorted(activities_by_age.items()):
            print(f"\n🎯 {age_group}: {len(activities)} activities")
            
            if age_group in age_capabilities:
                capabilities = age_capabilities[age_group]
                print(f"   ✅ Can do: {', '.join(capabilities['can_do'][:3])}...")
                print(f"   ❌ Cannot do: {', '.join(capabilities['cannot_do'][:3])}...")
                
                # Show sample activities
                print(f"   📋 Sample activities:")
                for activity in activities[:3]:
                    print(f"      - {activity['activity_name']} ({activity['category']})")
        
        # Show inappropriate activities
        print(f"\n🚨 INAPPROPRIATE ACTIVITIES FOUND: {len(inappropriate_activities)}")
        print("=" * 60)
        
        if inappropriate_activities:
            # Group by age
            inappropriate_by_age = {}
            for item in inappropriate_activities:
                age = item['age_group']
                if age not in inappropriate_by_age:
                    inappropriate_by_age[age] = []
                inappropriate_by_age[age].append(item)
            
            for age_group, items in sorted(inappropriate_by_age.items()):
                print(f"\n❌ {age_group} ({len(items)} inappropriate):")
                for item in items[:3]:  # Show first 3 from each age
                    print(f"   Row {item['row']}: {item['activity_name']}")
                    print(f"      Issues: {', '.join(item['reasons'][:2])}")
                    print(f"      Category: {item['category']}")
        else:
            print("✅ All Play & Creativity activities appear age-appropriate!")
        
        # Summary by age group
        print(f"\n📋 SUMMARY BY AGE GROUP:")
        print("=" * 40)
        
        total_activities = sum(len(activities) for activities in activities_by_age.values())
        total_inappropriate = len(inappropriate_activities)
        
        for age_group, activities in sorted(activities_by_age.items()):
            inappropriate_count = len([item for item in inappropriate_activities if item['age_group'] == age_group])
            percentage = (inappropriate_count / len(activities) * 100) if activities else 0
            
            status = "✅ GOOD" if inappropriate_count == 0 else f"❌ {inappropriate_count} ISSUES"
            print(f"   {age_group}: {len(activities)} activities - {status} ({percentage:.1f}% inappropriate)")
        
        print(f"\n🎯 OVERALL SUMMARY:")
        print(f"   Total Play & Creativity activities: {total_activities}")
        print(f"   Inappropriate activities: {total_inappropriate}")
        print(f"   Percentage inappropriate: {(total_inappropriate/total_activities*100):.1f}%")
        
        if total_inappropriate > 0:
            print(f"\n⚠️  ACTION NEEDED: {total_inappropriate} activities need to be fixed!")
        else:
            print(f"\n✅ EXCELLENT: All activities are age-appropriate!")
        
        return True
        
    except Exception as e:
        print(f"❌ Error checking age appropriateness: {e}")
        return False

def main():
    """Main function to check age appropriateness"""
    print("🎯 Comprehensive Age Appropriateness Check - Play & Creativity Pillar")
    print("=" * 80)
    print("🔍 Checking ALL age groups for developmentally appropriate activities")
    
    # Connect to Google Sheets
    client = get_google_sheets_client()
    if not client:
        return False
    
    # Check age appropriateness
    success = check_age_appropriateness(client)
    
    if success:
        print(f"\n✅ SUCCESS! Age appropriateness analysis completed!")
        return True
    else:
        print(f"\n❌ FAILED to analyze age appropriateness!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Comprehensive age check completed!")
    else:
        print(f"\n❌ FAILED to complete age check!")
