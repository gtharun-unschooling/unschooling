#!/usr/bin/env python3
"""
🔍 Check Actual Play & Creativity Categories
Compare JSON files vs Google Sheets for infant categories
"""

import gspread
from google.oauth2.service_account import Credentials
import json
from collections import Counter

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

def check_json_categories():
    """Check categories in JSON files"""
    print("📄 CHECKING JSON FILE CATEGORIES:")
    print("=" * 50)
    
    try:
        # Read the JSON file
        json_file = "public/data/essential-growth/play-creativity/activities.json"
        with open(json_file, 'r') as f:
            data = json.load(f)
        
        print(f"✅ Loaded JSON file: {json_file}")
        
        # Find infant data
        infant_categories = []
        for age_group in data.get('ageGroups', []):
            if 'infant' in age_group.get('ageGroup', '').lower():
                print(f"\n👶 Found age group: {age_group.get('ageGroup')}")
                
                for category in age_group.get('categories', []):
                    category_name = category.get('category', '')
                    activities_count = len(category.get('activities', []))
                    infant_categories.append((category_name, activities_count))
                    
                    print(f"   📁 Category: {category_name} ({activities_count} activities)")
                    
                    # Show first few activities
                    activities = category.get('activities', [])
                    for i, activity in enumerate(activities[:3]):  # Show first 3
                        topic = activity.get('topic', 'No topic')
                        print(f"      {i+1}. {topic}")
                    if len(activities) > 3:
                        print(f"      ... and {len(activities) - 3} more activities")
        
        print(f"\n📊 JSON SUMMARY:")
        print(f"   Total infant categories: {len(infant_categories)}")
        print(f"   Total infant activities: {sum(count for _, count in infant_categories)}")
        
        return infant_categories
        
    except Exception as e:
        print(f"❌ Error reading JSON file: {e}")
        return []

def check_google_sheets_categories(client):
    """Check categories in Google Sheets"""
    print(f"\n📊 CHECKING GOOGLE SHEETS CATEGORIES:")
    print("=" * 50)
    
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
            return []
        
        # Open the spreadsheet
        spreadsheet = client.open_by_key(target_sheet['id'])
        worksheet = spreadsheet.get_worksheet(0)
        
        print(f"📤 Working with: {target_sheet.get('name', 'Unknown')}")
        
        # Get all data
        all_data = worksheet.get_all_values()
        if not all_data:
            print("❌ No data found")
            return []
        
        headers = all_data[0]
        print(f"📋 Headers: {headers}")
        
        # Find Play & Creativity infant rows
        infant_rows = []
        pillar_col_index = headers.index('Pillar') if 'Pillar' in headers else None
        age_group_col_index = headers.index('Age Group') if 'Age Group' in headers else None
        category_col_index = headers.index('Category') if 'Category' in headers else None
        topic_col_index = headers.index('Topic') if 'Topic' in headers else None
        
        if not all([pillar_col_index, age_group_col_index, category_col_index]):
            print("❌ Required columns not found")
            return []
        
        print(f"\n🔍 Searching for Play & Creativity infant activities...")
        
        for row_num, row in enumerate(all_data[1:], start=2):
            pillar = row[pillar_col_index] if len(row) > pillar_col_index else ""
            age_group = row[age_group_col_index] if len(row) > age_group_col_index else ""
            category = row[category_col_index] if len(row) > category_col_index else ""
            topic = row[topic_col_index] if len(row) > topic_col_index else ""
            
            if (pillar.strip() == 'Play & Creativity' and 
                'infant' in age_group.lower()):
                infant_rows.append((row_num, category, topic))
        
        print(f"👶 Found {len(infant_rows)} Play & Creativity infant activities")
        
        if infant_rows:
            # Group by category
            categories = Counter([row[1] for row in infant_rows])
            
            print(f"\n📁 CATEGORIES IN GOOGLE SHEETS:")
            for category, count in categories.most_common():
                print(f"   📂 {category}: {count} activities")
                
                # Show activities in this category
                category_activities = [row for row in infant_rows if row[1] == category]
                for i, (row_num, cat, topic) in enumerate(category_activities[:3]):  # Show first 3
                    print(f"      {i+1}. Row {row_num}: {topic}")
                if len(category_activities) > 3:
                    print(f"      ... and {len(category_activities) - 3} more activities")
        
        print(f"\n📊 GOOGLE SHEETS SUMMARY:")
        print(f"   Total infant categories: {len(categories)}")
        print(f"   Total infant activities: {len(infant_rows)}")
        
        return list(categories.items())
        
    except Exception as e:
        print(f"❌ Error reading Google Sheets: {e}")
        return []

def compare_sources(json_categories, sheets_categories):
    """Compare categories between JSON and Google Sheets"""
    print(f"\n🔄 COMPARING JSON vs GOOGLE SHEETS:")
    print("=" * 60)
    
    json_cat_names = set(name for name, _ in json_categories)
    sheets_cat_names = set(name for name, _ in sheets_categories)
    
    print(f"📄 JSON Categories ({len(json_cat_names)}):")
    for name, count in json_categories:
        print(f"   • {name}: {count} activities")
    
    print(f"\n📊 Google Sheets Categories ({len(sheets_cat_names)}):")
    for name, count in sheets_categories:
        print(f"   • {name}: {count} activities")
    
    # Find differences
    only_in_json = json_cat_names - sheets_cat_names
    only_in_sheets = sheets_cat_names - json_cat_names
    in_both = json_cat_names & sheets_cat_names
    
    print(f"\n🔍 COMPARISON RESULTS:")
    print(f"   Categories in both sources: {len(in_both)}")
    if in_both:
        for cat in sorted(in_both):
            json_count = next(count for name, count in json_categories if name == cat)
            sheets_count = next(count for name, count in sheets_categories if name == cat)
            match_status = "✅" if json_count == sheets_count else "⚠️"
            print(f"     {match_status} {cat}: JSON({json_count}) vs Sheets({sheets_count})")
    
    if only_in_json:
        print(f"   Categories only in JSON: {len(only_in_json)}")
        for cat in sorted(only_in_json):
            count = next(count for name, count in json_categories if name == cat)
            print(f"     📄 {cat}: {count} activities")
    
    if only_in_sheets:
        print(f"   Categories only in Google Sheets: {len(only_in_sheets)}")
        for cat in sorted(only_in_sheets):
            count = next(count for name, count in sheets_categories if name == cat)
            print(f"     📊 {cat}: {count} activities")
    
    # Check if they match
    if json_cat_names == sheets_cat_names:
        print(f"\n✅ PERFECT MATCH: JSON and Google Sheets have identical categories")
    else:
        print(f"\n⚠️ MISMATCH: JSON and Google Sheets have different categories")
        print(f"   This suggests data sync issues or different data sources")

def main():
    """Main function to check actual categories"""
    print("🔍 Checking Actual Play & Creativity Infant Categories")
    print("=" * 70)
    
    # Check JSON categories
    json_categories = check_json_categories()
    
    # Check Google Sheets categories
    client = get_google_sheets_client()
    if not client:
        print("❌ Cannot connect to Google Sheets")
        return False
    
    sheets_categories = check_google_sheets_categories(client)
    
    # Compare sources
    if json_categories and sheets_categories:
        compare_sources(json_categories, sheets_categories)
    elif json_categories:
        print(f"\n⚠️ Only JSON data available (Google Sheets connection failed)")
    elif sheets_categories:
        print(f"\n⚠️ Only Google Sheets data available (JSON file not found)")
    else:
        print(f"\n❌ No data found in either source")
    
    print(f"\n✅ Analysis completed!")
    return True

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Category comparison completed!")
    else:
        print(f"\n❌ FAILED to compare categories!")
