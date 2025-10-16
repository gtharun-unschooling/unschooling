#!/usr/bin/env python3
"""
🎨 Extract Play & Creativity Categories
Retrieve all Play & Creativity categories from Google Sheets Activity ID column
"""

import gspread
from google.oauth2.service_account import Credentials
from collections import defaultdict

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

def extract_play_creativity_categories(client):
    """Extract all Play & Creativity categories from Activity ID column"""
    
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
        activity_id_col_index = headers.index('Activity ID') if 'Activity ID' in headers else None
        
        if activity_id_col_index is None:
            print("❌ Activity ID column not found")
            return False
        
        # Extract Play & Creativity Activity IDs
        play_creativity_activities = []
        for row_num, row in enumerate(all_data[1:], start=2):
            if len(row) > activity_id_col_index and row[activity_id_col_index].strip():
                activity_id = row[activity_id_col_index].strip()
                if activity_id.startswith('play-creativity'):
                    play_creativity_activities.append(activity_id)
        
        print(f"🎨 Found {len(play_creativity_activities)} Play & Creativity Activity IDs")
        
        # Parse and organize by age groups and categories
        age_group_categories = defaultdict(lambda: defaultdict(list))
        
        for activity_id in play_creativity_activities:
            # Parse: play-creativity-agegroup-category-number
            parts = activity_id.split('-')
            if len(parts) >= 4:
                age_group = parts[2] + '-' + parts[3]  # e.g., "infant-0-1"
                category = '-'.join(parts[4:-1])  # Everything between age and number
                activity_number = parts[-1]  # Last part is the number
                
                age_group_categories[age_group][category].append({
                    'activity_id': activity_id,
                    'number': activity_number
                })
        
        # Display results
        print(f"\n🎨 PLAY & CREATIVITY CATEGORIES:")
        print("=" * 60)
        
        # Sort age groups
        sorted_age_groups = sorted(age_group_categories.keys())
        
        for age_group in sorted_age_groups:
            categories = age_group_categories[age_group]
            total_activities = sum(len(activities) for activities in categories.values())
            
            print(f"\n👶 {age_group.upper()} ({total_activities} activities):")
            print("-" * 40)
            
            # Sort categories within each age group
            sorted_categories = sorted(categories.items())
            
            for category, activities in sorted_categories:
                print(f"   📂 {category} ({len(activities)} activities)")
                for activity in activities[:3]:  # Show first 3
                    print(f"      {activity['number']}. {activity['activity_id']}")
                if len(activities) > 3:
                    print(f"      ... and {len(activities) - 3} more")
        
        # Summary by categories
        print(f"\n📊 PLAY & CREATIVITY CATEGORY SUMMARY:")
        print("=" * 50)
        
        all_categories = set()
        for age_group, categories in age_group_categories.items():
            for category in categories.keys():
                all_categories.add(category)
        
        print(f"   Total unique categories: {len(all_categories)}")
        print(f"   Total age groups: {len(age_group_categories)}")
        print(f"   Total activities: {len(play_creativity_activities)}")
        
        print(f"\n📋 ALL PLAY & CREATIVITY CATEGORIES:")
        print("=" * 40)
        
        # Clean category names (remove age prefixes)
        clean_categories = []
        for category in sorted(all_categories):
            # Remove age prefix (e.g., "1-", "3-", "5-", "8-", "9-12-", "18-")
            clean_name = category
            if '-' in category:
                parts = category.split('-')
                if parts[0].isdigit() or parts[0] in ['9-12', '18']:
                    clean_name = '-'.join(parts[1:])
            
            clean_categories.append((clean_name, category))
        
        # Display clean categories
        for i, (clean_name, original_name) in enumerate(sorted(clean_categories), 1):
            # Count total activities for this category across all age groups
            total_count = 0
            for age_group, categories in age_group_categories.items():
                if original_name in categories:
                    total_count += len(categories[original_name])
            
            print(f"   {i:2d}. {clean_name} ({total_count} activities)")
        
        # Age group distribution
        print(f"\n👶 AGE GROUP DISTRIBUTION:")
        print("=" * 30)
        for age_group in sorted_age_groups:
            categories_count = len(age_group_categories[age_group])
            activities_count = sum(len(activities) for activities in age_group_categories[age_group].values())
            print(f"   {age_group}: {categories_count} categories, {activities_count} activities")
        
        return True
        
    except Exception as e:
        print(f"❌ Error extracting categories: {e}")
        return False

def main():
    """Main function to extract Play & Creativity categories"""
    print("🎨 Extracting Play & Creativity Categories from Google Sheets")
    print("=" * 70)
    
    # Connect to Google Sheets
    client = get_google_sheets_client()
    if not client:
        return False
    
    # Extract categories
    success = extract_play_creativity_categories(client)
    
    if success:
        print(f"\n✅ SUCCESS! Play & Creativity categories extracted!")
        return True
    else:
        print(f"\n❌ FAILED to extract categories!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Category extraction completed!")
    else:
        print(f"\n❌ FAILED to extract categories!")
