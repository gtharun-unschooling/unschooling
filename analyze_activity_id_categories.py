#!/usr/bin/env python3
"""
📋 Analyze Activity ID Categories
Extract and list all categories from Activity ID column in Google Sheets
"""

import gspread
from google.oauth2.service_account import Credentials
from collections import defaultdict, Counter

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

def analyze_activity_id_categories(client):
    """Analyze Activity ID column to extract category patterns"""
    
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
        print(f"📋 Headers: {headers}")
        
        # Find Activity ID column
        activity_id_col_index = headers.index('Activity ID') if 'Activity ID' in headers else None
        
        if activity_id_col_index is None:
            print("❌ Activity ID column not found")
            return False
        
        print(f"📊 Found Activity ID column at index {activity_id_col_index}")
        
        # Extract Activity IDs and analyze patterns
        activity_ids = []
        for row_num, row in enumerate(all_data[1:], start=2):
            if len(row) > activity_id_col_index and row[activity_id_col_index].strip():
                activity_ids.append(row[activity_id_col_index].strip())
        
        print(f"📋 Found {len(activity_ids)} Activity IDs")
        
        # Analyze Activity ID patterns
        print(f"\n🔍 ACTIVITY ID ANALYSIS:")
        print("=" * 60)
        
        # Group by pillar
        pillars = defaultdict(list)
        age_groups = defaultdict(list)
        categories = defaultdict(list)
        
        for activity_id in activity_ids:
            # Parse Activity ID format: pillar-agegroup-category-number
            parts = activity_id.split('-')
            if len(parts) >= 4:
                pillar = parts[0] + '-' + parts[1]  # e.g., "play-creativity"
                age_group = parts[2] + '-' + parts[3]  # e.g., "infant-0-1"
                category = '-'.join(parts[4:-1])  # Everything between age and number
                
                pillars[pillar].append(activity_id)
                age_groups[age_group].append(activity_id)
                categories[category].append(activity_id)
        
        # Display results
        print(f"\n📊 PILLAR BREAKDOWN:")
        for pillar, ids in pillars.items():
            print(f"   🏛️ {pillar}: {len(ids)} activities")
        
        print(f"\n👶 AGE GROUP BREAKDOWN:")
        for age_group, ids in age_groups.items():
            print(f"   👶 {age_group}: {len(ids)} activities")
        
        print(f"\n📁 CATEGORY BREAKDOWN:")
        print("=" * 40)
        
        # Sort categories for better display
        sorted_categories = sorted(categories.items())
        
        for category, ids in sorted_categories:
            print(f"\n   📂 {category}: {len(ids)} activities")
            print(f"      Activity IDs:")
            for i, activity_id in enumerate(ids[:5]):  # Show first 5
                print(f"         {i+1}. {activity_id}")
            if len(ids) > 5:
                print(f"         ... and {len(ids) - 5} more")
        
        # Summary statistics
        print(f"\n📊 SUMMARY STATISTICS:")
        print("=" * 30)
        print(f"   Total Activity IDs: {len(activity_ids)}")
        print(f"   Total Pillars: {len(pillars)}")
        print(f"   Total Age Groups: {len(age_groups)}")
        print(f"   Total Categories: {len(categories)}")
        
        # Category distribution
        category_counts = Counter(categories.keys())
        print(f"\n📈 CATEGORY DISTRIBUTION:")
        for category, count in category_counts.most_common():
            print(f"   {category}: {count} activities")
        
        # Show all unique categories in a clean list
        print(f"\n📋 ALL CATEGORIES FROM ACTIVITY ID:")
        print("=" * 50)
        unique_categories = sorted(set(categories.keys()))
        for i, category in enumerate(unique_categories, 1):
            count = len(categories[category])
            print(f"   {i:2d}. {category} ({count} activities)")
        
        return True
        
    except Exception as e:
        print(f"❌ Error analyzing Activity IDs: {e}")
        return False

def main():
    """Main function to analyze Activity ID categories"""
    print("📋 Analyzing Activity ID Categories from Google Sheets")
    print("=" * 70)
    
    # Connect to Google Sheets
    client = get_google_sheets_client()
    if not client:
        return False
    
    # Analyze Activity IDs
    success = analyze_activity_id_categories(client)
    
    if success:
        print(f"\n✅ SUCCESS! Activity ID analysis completed!")
        return True
    else:
        print(f"\n❌ FAILED to analyze Activity IDs!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Category extraction completed!")
    else:
        print(f"\n❌ FAILED to extract categories!")
