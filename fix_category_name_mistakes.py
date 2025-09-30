#!/usr/bin/env python3
"""
🔧 Fix Category Name Mistakes
Fix the incorrect "12" prefix in Pre-Teen category names
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

def fix_category_name_mistakes(client):
    """Fix incorrect category names with age prefixes"""
    
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
        
        # Define the corrections needed
        corrections = {
            '12 Design Thinking For Toys': 'Design Thinking For Toys',
            '12 Stop Motion Animation Projects': 'Stop Motion Animation Projects',
            '12 Music Composition And Recording': 'Music Composition And Recording',
            '12 Sculpting And 3D Modeling': 'Sculpting And 3D Modeling'
        }
        
        # Find rows that need correction
        corrections_needed = []
        
        for row_num, row in enumerate(all_data[1:], start=2):
            if len(row) > max(activity_id_col_index, category_col_index):
                activity_id = row[activity_id_col_index].strip()
                current_category = row[category_col_index].strip()
                
                # Only process Play & Creativity activities
                if activity_id.startswith('play-creativity'):
                    if current_category in corrections:
                        corrections_needed.append({
                            'row': row_num,
                            'activity_id': activity_id,
                            'current': current_category,
                            'corrected': corrections[current_category]
                        })
        
        print(f"\n🔧 FOUND {len(corrections_needed)} CORRECTIONS NEEDED:")
        print("=" * 60)
        
        if not corrections_needed:
            print("✅ No corrections needed - Category names are already correct!")
            return True
        
        # Show what needs to be corrected
        for correction in corrections_needed:
            print(f"   Row {correction['row']}:")
            print(f"      Current: '{correction['current']}'")
            print(f"      Corrected: '{correction['corrected']}'")
            print(f"      Activity ID: {correction['activity_id']}")
            print()
        
        # Apply corrections with rate limiting
        updates_made = 0
        batch_size = 5
        delay_between_batches = 2
        
        print(f"🔄 APPLYING CORRECTIONS:")
        print("=" * 30)
        
        for i in range(0, len(corrections_needed), batch_size):
            batch = corrections_needed[i:i + batch_size]
            
            print(f"\n📦 Processing batch {i//batch_size + 1} ({len(batch)} corrections):")
            
            for correction in batch:
                try:
                    worksheet.update_cell(correction['row'], category_col_index + 1, correction['corrected'])
                    updates_made += 1
                    
                    print(f"   ✅ Row {correction['row']}: '{correction['current']}' → '{correction['corrected']}'")
                    
                    time.sleep(0.5)  # Rate limiting
                    
                except Exception as e:
                    print(f"   ❌ Error correcting row {correction['row']}: {e}")
            
            # Delay between batches
            if i + batch_size < len(corrections_needed):
                print(f"   ⏳ Waiting {delay_between_batches} seconds before next batch...")
                time.sleep(delay_between_batches)
        
        print(f"\n🎉 CORRECTIONS COMPLETE!")
        print("=" * 30)
        print(f"✅ Corrected {updates_made} category names")
        print(f"✅ Removed incorrect age prefixes")
        
        return True
        
    except Exception as e:
        print(f"❌ Error fixing category names: {e}")
        return False

def main():
    """Main function to fix category name mistakes"""
    print("🔧 Fixing Category Name Mistakes")
    print("=" * 50)
    print("🎯 Removing incorrect '12' prefixes from Pre-Teen categories")
    
    # Connect to Google Sheets
    client = get_google_sheets_client()
    if not client:
        return False
    
    # Fix category names
    success = fix_category_name_mistakes(client)
    
    if success:
        print(f"\n✅ SUCCESS! Category name mistakes fixed!")
        print("=" * 40)
        print("✅ Removed incorrect '12' prefixes")
        print("✅ Pre-Teen categories now have clean names")
        print("✅ Ready for website display")
        
        return True
    else:
        print(f"\n❌ FAILED to fix category names!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Category corrections completed!")
    else:
        print(f"\n❌ FAILED to correct categories!")
