#!/usr/bin/env python3
"""
🔍 Recheck Category Names
Analyze current Category column names in Google Sheets to identify mistakes
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

def recheck_category_names(client):
    """Recheck current category names in Google Sheets"""
    
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
        category_col_index = headers.index('Category') if 'Category' in headers else None
        
        if activity_id_col_index is None or category_col_index is None:
            print("❌ Required columns not found")
            return False
        
        print(f"📊 Analyzing columns: Activity ID (index {activity_id_col_index}), Category (index {category_col_index})")
        
        # Extract and analyze current data
        play_creativity_data = []
        
        for row_num, row in enumerate(all_data[1:], start=2):
            if len(row) > max(activity_id_col_index, category_col_index):
                activity_id = row[activity_id_col_index].strip()
                current_category = row[category_col_index].strip()
                
                if activity_id.startswith('play-creativity'):
                    play_creativity_data.append({
                        'row': row_num,
                        'activity_id': activity_id,
                        'current_category': current_category
                    })
        
        print(f"🎨 Found {len(play_creativity_data)} Play & Creativity activities")
        
        # Analyze current categories
        print(f"\n🔍 CURRENT CATEGORY ANALYSIS:")
        print("=" * 60)
        
        category_groups = defaultdict(list)
        
        for item in play_creativity_data:
            category_groups[item['current_category']].append(item)
        
        print(f"📊 Current Categories in Google Sheets:")
        for category, items in sorted(category_groups.items()):
            print(f"\n   📂 '{category}' ({len(items)} activities):")
            for item in items[:3]:  # Show first 3
                print(f"      Row {item['row']}: {item['activity_id']}")
            if len(items) > 3:
                print(f"      ... and {len(items) - 3} more")
        
        # Extract expected categories from Activity IDs
        print(f"\n🎯 EXPECTED CATEGORIES FROM ACTIVITY ID:")
        print("=" * 50)
        
        expected_categories = {}
        
        for item in play_creativity_data:
            activity_id = item['activity_id']
            # Parse Activity ID to get expected category
            parts = activity_id.split('-')
            if len(parts) >= 4:
                category_part = '-'.join(parts[4:-1])
                
                # Clean up category name
                if '-' in category_part:
                    category_parts = category_part.split('-')
                    if category_parts[0].isdigit() or category_parts[0] in ['9-12', '18']:
                        category_part = '-'.join(category_parts[1:])
                
                # Convert to title case
                expected_category = category_part.replace('-', ' ').title()
                expected_categories[activity_id] = expected_category
        
        # Compare current vs expected
        print(f"\n🔍 COMPARISON: Current vs Expected:")
        print("=" * 50)
        
        mismatches = []
        matches = []
        
        for item in play_creativity_data:
            activity_id = item['activity_id']
            current = item['current_category']
            expected = expected_categories.get(activity_id, '')
            
            if current != expected:
                mismatches.append({
                    'row': item['row'],
                    'activity_id': activity_id,
                    'current': current,
                    'expected': expected
                })
            else:
                matches.append(item)
        
        print(f"✅ MATCHES: {len(matches)} activities")
        print(f"❌ MISMATCHES: {len(mismatches)} activities")
        
        if mismatches:
            print(f"\n❌ MISMATCHED CATEGORIES:")
            print("-" * 40)
            for mismatch in mismatches:
                print(f"   Row {mismatch['row']}:")
                print(f"      Current: '{mismatch['current']}'")
                print(f"      Expected: '{mismatch['expected']}'")
                print(f"      Activity ID: {mismatch['activity_id']}")
                print()
        
        # Show all unique categories
        print(f"\n📋 ALL UNIQUE CURRENT CATEGORIES:")
        print("=" * 40)
        unique_categories = sorted(set(category_groups.keys()))
        for i, category in enumerate(unique_categories, 1):
            count = len(category_groups[category])
            print(f"   {i:2d}. '{category}' ({count} activities)")
        
        # Show all unique expected categories
        print(f"\n📋 ALL UNIQUE EXPECTED CATEGORIES:")
        print("=" * 40)
        unique_expected = sorted(set(expected_categories.values()))
        for i, category in enumerate(unique_expected, 1):
            count = sum(1 for exp in expected_categories.values() if exp == category)
            print(f"   {i:2d}. '{category}' ({count} activities)")
        
        return True
        
    except Exception as e:
        print(f"❌ Error rechecking category names: {e}")
        return False

def main():
    """Main function to recheck category names"""
    print("🔍 Rechecking Category Names in Google Sheets")
    print("=" * 60)
    
    # Connect to Google Sheets
    client = get_google_sheets_client()
    if not client:
        return False
    
    # Recheck category names
    success = recheck_category_names(client)
    
    if success:
        print(f"\n✅ SUCCESS! Category names rechecked!")
        return True
    else:
        print(f"\n❌ FAILED to recheck category names!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Category recheck completed!")
    else:
        print(f"\n❌ FAILED to recheck categories!")
