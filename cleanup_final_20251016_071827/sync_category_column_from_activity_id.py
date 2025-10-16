#!/usr/bin/env python3
"""
🔄 Sync Category Column from Activity ID
Update Category column in Google Sheets to match Activity ID category names
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

def extract_category_from_activity_id(activity_id):
    """Extract clean category name from Activity ID"""
    if not activity_id:
        return None
    
    # Parse Activity ID format: pillar-agegroup-category-number
    parts = activity_id.split('-')
    if len(parts) >= 4:
        # Extract category part (everything between age group and number)
        category = '-'.join(parts[4:-1])
        
        # Clean up category name
        # Remove age prefixes (e.g., "1-", "3-", "5-", "8-", "9-12-", "18-")
        if '-' in category:
            category_parts = category.split('-')
            if category_parts[0].isdigit() or category_parts[0] in ['9-12', '18']:
                category = '-'.join(category_parts[1:])
        
        # Convert to title case with proper spacing
        category = category.replace('-', ' ').title()
        
        return category
    
    return None

def sync_category_column(client):
    """Sync Category column with Activity ID category names"""
    
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
        
        # Find column indices
        activity_id_col_index = headers.index('Activity ID') if 'Activity ID' in headers else None
        category_col_index = headers.index('Category') if 'Category' in headers else None
        
        print(f"🔍 Column indices: Activity ID={activity_id_col_index}, Category={category_col_index}")
        
        print(f"🔍 Checking conditions: activity_id_col_index={activity_id_col_index}, category_col_index={category_col_index}")
        print(f"🔍 Both found: {activity_id_col_index is not None and category_col_index is not None}")
        
        if activity_id_col_index is None or category_col_index is None:
            print("❌ Required columns not found")
            print(f"   Activity ID column: {activity_id_col_index}")
            print(f"   Category column: {category_col_index}")
            return False
        
        print(f"📊 Found columns: Activity ID (index {activity_id_col_index}), Category (index {category_col_index})")
        
        # Process each row
        updates_made = 0
        focus_on_play_creativity = True
        
        print(f"\n🔄 SYNCING CATEGORY COLUMN FROM ACTIVITY ID:")
        print("=" * 60)
        
        for row_num, row in enumerate(all_data[1:], start=2):
            if len(row) > max(activity_id_col_index, category_col_index):
                activity_id = row[activity_id_col_index].strip()
                current_category = row[category_col_index].strip()
                
                # Extract category from Activity ID
                extracted_category = extract_category_from_activity_id(activity_id)
                
                if extracted_category:
                    # Check if we should focus only on Play & Creativity
                    if focus_on_play_creativity and not activity_id.startswith('play-creativity'):
                        continue
                    
                    # Update if different
                    if extracted_category != current_category:
                        worksheet.update_cell(row_num, category_col_index + 1, extracted_category)
                        updates_made += 1
                        
                        print(f"✅ Row {row_num}: '{current_category}' → '{extracted_category}'")
                        print(f"   Activity ID: {activity_id}")
                        
                        time.sleep(0.2)  # Rate limiting
        
        print(f"\n🎉 SYNC COMPLETE!")
        print("=" * 30)
        print(f"✅ Updated {updates_made} category entries")
        print(f"✅ Category column now matches Activity ID patterns")
        
        # Show summary of categories after update
        print(f"\n📊 CATEGORY SUMMARY AFTER UPDATE:")
        print("=" * 40)
        
        # Get updated data to show categories
        updated_data = worksheet.get_all_values()
        categories = {}
        
        for row in updated_data[1:]:
            if len(row) > max(activity_id_col_index, category_col_index):
                activity_id = row[activity_id_col_index].strip()
                category = row[category_col_index].strip()
                
                if activity_id.startswith('play-creativity') and category:
                    if category in categories:
                        categories[category] += 1
                    else:
                        categories[category] = 1
        
        # Display categories
        for category, count in sorted(categories.items()):
            print(f"   📂 {category}: {count} activities")
        
        return True
        
    except Exception as e:
        print(f"❌ Error syncing category column: {e}")
        return False

def main():
    """Main function to sync category column"""
    print("🔄 Syncing Category Column from Activity ID")
    print("=" * 60)
    print("🎯 Focus: Play & Creativity pillar only")
    
    # Connect to Google Sheets
    client = get_google_sheets_client()
    if not client:
        return False
    
    # Sync category column
    success = sync_category_column(client)
    
    if success:
        print(f"\n✅ SUCCESS! Category column synchronized!")
        print("=" * 40)
        print("✅ Category column now reflects Activity ID structure")
        print("✅ Play & Creativity categories properly named")
        print("✅ Ready for website display")
        
        return True
    else:
        print(f"\n❌ FAILED to sync category column!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Category sync completed!")
    else:
        print(f"\n❌ FAILED to sync categories!")
