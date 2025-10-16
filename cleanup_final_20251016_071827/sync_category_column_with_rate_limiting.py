#!/usr/bin/env python3
"""
🔄 Sync Category Column with Rate Limiting
Update Category column in Google Sheets with proper rate limiting
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

def sync_category_column_with_rate_limiting(client):
    """Sync Category column with proper rate limiting"""
    
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
        
        print(f"📊 Found columns: Activity ID (index {activity_id_col_index}), Category (index {category_col_index})")
        
        # Collect all updates first
        updates_needed = []
        
        for row_num, row in enumerate(all_data[1:], start=2):
            if len(row) > max(activity_id_col_index, category_col_index):
                activity_id = row[activity_id_col_index].strip()
                current_category = row[category_col_index].strip()
                
                # Only process Play & Creativity activities
                if activity_id.startswith('play-creativity'):
                    # Extract category from Activity ID
                    extracted_category = extract_category_from_activity_id(activity_id)
                    
                    if extracted_category and extracted_category != current_category:
                        updates_needed.append({
                            'row': row_num,
                            'current': current_category,
                            'new': extracted_category,
                            'activity_id': activity_id
                        })
        
        print(f"\n🔄 FOUND {len(updates_needed)} UPDATES NEEDED:")
        print("=" * 50)
        
        if not updates_needed:
            print("✅ No updates needed - Category column is already synchronized!")
            return True
        
        # Process updates with rate limiting
        updates_made = 0
        batch_size = 10  # Process in smaller batches
        delay_between_batches = 2  # 2 seconds between batches
        
        for i in range(0, len(updates_needed), batch_size):
            batch = updates_needed[i:i + batch_size]
            
            print(f"\n📦 Processing batch {i//batch_size + 1} ({len(batch)} updates):")
            
            for update in batch:
                try:
                    worksheet.update_cell(update['row'], category_col_index + 1, update['new'])
                    updates_made += 1
                    
                    print(f"   ✅ Row {update['row']}: '{update['current']}' → '{update['new']}'")
                    
                    # Small delay between individual updates
                    time.sleep(0.5)
                    
                except Exception as e:
                    print(f"   ❌ Error updating row {update['row']}: {e}")
            
            # Longer delay between batches
            if i + batch_size < len(updates_needed):
                print(f"   ⏳ Waiting {delay_between_batches} seconds before next batch...")
                time.sleep(delay_between_batches)
        
        print(f"\n🎉 SYNC COMPLETE!")
        print("=" * 30)
        print(f"✅ Updated {updates_made} category entries")
        print(f"✅ Category column now matches Activity ID patterns")
        
        return True
        
    except Exception as e:
        print(f"❌ Error syncing category column: {e}")
        return False

def main():
    """Main function to sync category column with rate limiting"""
    print("🔄 Syncing Category Column with Rate Limiting")
    print("=" * 60)
    print("🎯 Focus: Play & Creativity pillar only")
    
    # Connect to Google Sheets
    client = get_google_sheets_client()
    if not client:
        return False
    
    # Sync category column
    success = sync_category_column_with_rate_limiting(client)
    
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
