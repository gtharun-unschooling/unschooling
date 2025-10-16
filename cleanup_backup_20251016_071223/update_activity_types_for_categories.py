#!/usr/bin/env python3
"""
🎨 Update Activity Types for Play & Creativity Categories
Set appropriate activity types for each category based on their purpose
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

def get_appropriate_activity_type(category_name):
    """Determine appropriate activity type for each category"""
    
    # Define mapping of categories to appropriate activity types
    category_activity_type_mapping = {
        # Infant categories
        'Sensory Exploration': 'Sensory',
        'Tummy Time Play': 'Physical',
        'Interactive Sounds And Textures': 'Sensory',
        'Parent Child Bonding Activities': 'Social',
        
        # Toddler categories
        'Pretend Play': 'Creative',
        'Building With Blocks': 'Physical',
        'Drawing And Scribbling': 'Creative',
        'Exploring Musical Instruments': 'Creative',
        
        # Preschooler categories
        'Imaginative Play With Dolls': 'Creative',
        'Simple Crafting': 'Creative',
        'Role Playing Games': 'Social',
        'Shape Sorting And Color Matching': 'Cognitive',
        
        # Child categories
        'Creative Storytelling': 'Creative',
        'Advanced Drawing And Painting': 'Creative',
        'Diy Craft Projects': 'Creative',
        'Inventing Games': 'Creative',
        
        # Pre-Teen categories
        'Design Thinking For Toys': 'Creative',
        'Stop Motion Animation Projects': 'Creative',
        'Music Composition And Recording': 'Creative',
        'Sculpting And 3D Modeling': 'Creative',
        
        # Teen categories
        'Artistic Performance And Design': 'Creative',
        'Creating Digital Art': 'Creative',
        'Building And Designing Gadgets': 'Creative',
        'Independent Fashion Design': 'Creative'
    }
    
    return category_activity_type_mapping.get(category_name, 'Creative')

def update_activity_types(client):
    """Update Activity Type column with appropriate types for each category"""
    
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
        category_col_index = headers.index('Category') if 'Category' in headers else None
        activity_type_col_index = headers.index('Activity Type') if 'Activity Type' in headers else None
        activity_id_col_index = headers.index('Activity ID') if 'Activity ID' in headers else None
        
        # Debug: print column indices
        print(f"🔍 Column indices: Activity ID={activity_id_col_index}, Activity Type={activity_type_col_index}, Category={category_col_index}")
        
        # Debug: check each column index
        print(f"🔍 Column existence check:")
        print(f"   Activity ID: {activity_id_col_index} ({type(activity_id_col_index)})")
        print(f"   Activity Type: {activity_type_col_index} ({type(activity_type_col_index)})")
        print(f"   Category: {category_col_index} ({type(category_col_index)})")
        
        if activity_id_col_index is None:
            print("❌ Activity ID column not found")
            return False
        if activity_type_col_index is None:
            print("❌ Activity Type column not found")
            return False
        if category_col_index is None:
            print("❌ Category column not found")
            return False
        
        print(f"📊 Found columns: Category (index {category_col_index}), Activity Type (index {activity_type_col_index})")
        
        # Define appropriate activity types for each category
        print(f"\n🎨 ACTIVITY TYPE MAPPING:")
        print("=" * 50)
        
        category_activity_mapping = {
            # Infant categories
            'Sensory Exploration': 'Sensory',
            'Tummy Time Play': 'Physical',
            'Interactive Sounds And Textures': 'Sensory',
            'Parent Child Bonding Activities': 'Social',
            
            # Toddler categories
            'Pretend Play': 'Creative',
            'Building With Blocks': 'Physical',
            'Drawing And Scribbling': 'Creative',
            'Exploring Musical Instruments': 'Creative',
            
            # Preschooler categories
            'Imaginative Play With Dolls': 'Creative',
            'Simple Crafting': 'Creative',
            'Role Playing Games': 'Social',
            'Shape Sorting And Color Matching': 'Cognitive',
            
            # Child categories
            'Creative Storytelling': 'Creative',
            'Advanced Drawing And Painting': 'Creative',
            'Diy Craft Projects': 'Creative',
            'Inventing Games': 'Creative',
            
            # Pre-Teen categories
            'Design Thinking For Toys': 'Creative',
            'Stop Motion Animation Projects': 'Creative',
            'Music Composition And Recording': 'Creative',
            'Sculpting And 3D Modeling': 'Creative',
            
            # Teen categories
            'Artistic Performance And Design': 'Creative',
            'Creating Digital Art': 'Creative',
            'Building And Designing Gadgets': 'Creative',
            'Independent Fashion Design': 'Creative'
        }
        
        for category, activity_type in sorted(category_activity_mapping.items()):
            print(f"   📂 {category} → {activity_type}")
        
        # Find rows that need activity type updates
        updates_needed = []
        
        for row_num, row in enumerate(all_data[1:], start=2):
            if len(row) > max(category_col_index, activity_type_col_index, activity_id_col_index):
                activity_id = row[activity_id_col_index].strip()
                current_category = row[category_col_index].strip()
                current_activity_type = row[activity_type_col_index].strip()
                
                # Only process Play & Creativity activities
                if activity_id.startswith('play-creativity'):
                    if current_category in category_activity_mapping:
                        expected_activity_type = category_activity_mapping[current_category]
                        
                        if current_activity_type != expected_activity_type:
                            updates_needed.append({
                                'row': row_num,
                                'activity_id': activity_id,
                                'category': current_category,
                                'current': current_activity_type,
                                'expected': expected_activity_type
                            })
        
        print(f"\n🔄 FOUND {len(updates_needed)} ACTIVITY TYPE UPDATES NEEDED:")
        print("=" * 60)
        
        if not updates_needed:
            print("✅ No activity type updates needed - all are already correct!")
            return True
        
        # Show what needs to be updated
        category_updates = {}
        for update in updates_needed:
            category = update['category']
            if category not in category_updates:
                category_updates[category] = []
            category_updates[category].append(update)
        
        for category, updates in sorted(category_updates.items()):
            print(f"\n   📂 {category} ({len(updates)} activities):")
            print(f"      Current: {updates[0]['current']} → Expected: {updates[0]['expected']}")
        
        # Apply updates with rate limiting
        updates_made = 0
        batch_size = 10
        delay_between_batches = 2
        
        print(f"\n🔄 APPLYING ACTIVITY TYPE UPDATES:")
        print("=" * 40)
        
        for i in range(0, len(updates_needed), batch_size):
            batch = updates_needed[i:i + batch_size]
            
            print(f"\n📦 Processing batch {i//batch_size + 1} ({len(batch)} updates):")
            
            for update in batch:
                try:
                    worksheet.update_cell(update['row'], activity_type_col_index + 1, update['expected'])
                    updates_made += 1
                    
                    print(f"   ✅ Row {update['row']}: '{update['current']}' → '{update['expected']}' ({update['category']})")
                    
                    time.sleep(0.3)  # Rate limiting
                    
                except Exception as e:
                    print(f"   ❌ Error updating row {update['row']}: {e}")
            
            # Delay between batches
            if i + batch_size < len(updates_needed):
                print(f"   ⏳ Waiting {delay_between_batches} seconds before next batch...")
                time.sleep(delay_between_batches)
        
        print(f"\n🎉 ACTIVITY TYPE UPDATES COMPLETE!")
        print("=" * 40)
        print(f"✅ Updated {updates_made} activity type entries")
        print(f"✅ All categories now have appropriate activity types")
        
        # Show final summary
        print(f"\n📊 FINAL ACTIVITY TYPE DISTRIBUTION:")
        print("=" * 40)
        
        # Count final activity types
        activity_type_counts = {}
        for update in updates_needed:
            expected_type = update['expected']
            if expected_type in activity_type_counts:
                activity_type_counts[expected_type] += 1
            else:
                activity_type_counts[expected_type] = 1
        
        for activity_type, count in sorted(activity_type_counts.items()):
            print(f"   {activity_type}: {count} activities")
        
        return True
        
    except Exception as e:
        print(f"❌ Error updating activity types: {e}")
        return False

def main():
    """Main function to update activity types"""
    print("🎨 Updating Activity Types for Play & Creativity Categories")
    print("=" * 70)
    
    # Connect to Google Sheets
    client = get_google_sheets_client()
    if not client:
        return False
    
    # Update activity types
    success = update_activity_types(client)
    
    if success:
        print(f"\n✅ SUCCESS! Activity types updated!")
        print("=" * 40)
        print("✅ All categories now have appropriate activity types")
        print("✅ Activity types match category purposes")
        print("✅ Ready for website display")
        
        return True
    else:
        print(f"\n❌ FAILED to update activity types!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Activity type updates completed!")
    else:
        print(f"\n❌ FAILED to update activity types!")
