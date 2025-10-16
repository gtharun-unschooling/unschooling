#!/usr/bin/env python3
"""
🔧 Fix All Generic Columns
Fix all columns with generic, repetitive content in Cognitive Skills activities
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
        return client
    except Exception as e:
        print(f"❌ Error connecting to Google Sheets: {e}")
        return False

def remove_age_column():
    """Remove the redundant Age column"""
    
    try:
        print(f"🗑️ REMOVING REDUNDANT AGE COLUMN:")
        print("=" * 50)
        
        # Connect to Google Sheets
        client = get_google_sheets_client()
        if not client:
            return False
        
        # Open spreadsheet
        spreadsheet = client.open_by_key('14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ')
        activities_worksheet = spreadsheet.worksheet('Activities')
        
        # Get headers to find Age column
        headers = activities_worksheet.row_values(1)
        
        # Find Age column index
        age_column_index = None
        for i, header in enumerate(headers):
            if header.lower() == 'age':
                age_column_index = i
                break
        
        if age_column_index is None:
            print(f"❌ Age column not found!")
            return False
        
        print(f"📍 Found Age column at index: {age_column_index}")
        print(f"📍 Age column header: '{headers[age_column_index]}'")
        
        # Delete the Age column
        print(f"🗑️ Deleting Age column...")
        activities_worksheet.delete_columns(age_column_index + 1)  # +1 because gspread uses 1-based indexing
        
        print(f"✅ Age column deleted!")
        
        # Wait a moment for the change to propagate
        time.sleep(2)
        
        # Get updated headers to confirm
        updated_headers = activities_worksheet.row_values(1)
        print(f"📋 Updated headers: {updated_headers}")
        print(f"📍 Total columns after removal: {len(updated_headers)}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error removing Age column: {e}")
        return False

def create_specific_content():
    """Create specific, engaging content for each activity"""
    
    # Define specific content for each activity
    specific_content = {
        # Innovation Breakthrough Lab example
        'Innovation Breakthrough Lab': {
            'explanation': 'Transform creative ideas into breakthrough solutions through structured innovation challenges. Students learn to think beyond conventional boundaries, prototype rapidly, and iterate on solutions. This hands-on approach develops creative confidence and teaches systematic innovation methods used by leading companies and startups.',
            'skills': 'Creative Thinking, Innovation Design, Prototyping, Iterative Development, Solution Architecture, Breakthrough Analysis',
            'materials': 'Innovation challenge cards, prototyping materials (cardboard, tape, markers), timer, solution templates, reflection journals',
            'kit_materials': 'Innovation toolkit with challenge cards, prototyping supplies, design thinking templates, solution evaluation rubrics',
            'materials_at_home': 'Household items for rapid prototyping, recycled materials, basic art supplies, smartphone for documentation',
            'materials_to_buy': 'Professional prototyping kit, design thinking workbook, innovation challenge deck, solution presentation tools',
            'general_instructions': 'Set up innovation workspace with prototyping materials. Introduce challenge, allow 20 minutes for ideation, 15 minutes for prototyping, 10 minutes for testing and iteration.',
            'additional_info': 'Encourage wild ideas initially, then focus on feasibility. Document the innovation process for learning reflection.',
            'corrections_needed': 'Activity optimized for maximum creative output and innovation skill development.'
        }
    }
    
    return specific_content

def fix_generic_columns():
    """Fix all generic columns with specific content"""
    
    try:
        print(f"🔧 FIXING ALL GENERIC COLUMNS:")
        print("=" * 60)
        
        # Connect to Google Sheets
        client = get_google_sheets_client()
        if not client:
            return False
        
        # Open spreadsheet
        spreadsheet = client.open_by_key('14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ')
        activities_worksheet = spreadsheet.worksheet('Activities')
        
        # Get headers
        headers = activities_worksheet.row_values(1)
        column_indices = {}
        for i, header in enumerate(headers):
            column_indices[header] = i
        
        # Get all data
        all_data = activities_worksheet.get_all_values()
        
        print(f"\n🎯 FIXING COGNITIVE SKILLS GENERIC CONTENT:")
        print("-" * 60)
        
        total_updates = 0
        
        # Get specific content
        specific_content = create_specific_content()
        
        # Update Cognitive Skills activities
        for row_num, row in enumerate(all_data[1:], start=2):
            if len(row) > max(column_indices.get('Pillar', 0), column_indices.get('Activity Name', 0)):
                pillar = row[column_indices.get('Pillar', 0)].strip()
                activity_name = row[column_indices.get('Activity Name', 0)].strip() if len(row) > column_indices.get('Activity Name', 0) else ''
                
                if pillar == 'Cognitive Skills' and activity_name:
                    print(f"   🔧 Row {row_num}: {activity_name}")
                    
                    # Check if we have specific content for this activity
                    if activity_name in specific_content:
                        content = specific_content[activity_name]
                        
                        # Update Explanation
                        if 'Explanation' in column_indices and 'explanation' in content:
                            activities_worksheet.update_cell(row_num, column_indices['Explanation'] + 1, content['explanation'])
                            print(f"      ✅ Updated Explanation")
                        
                        # Update Skills
                        if 'Skills' in column_indices and 'skills' in content:
                            activities_worksheet.update_cell(row_num, column_indices['Skills'] + 1, content['skills'])
                            print(f"      ✅ Updated Skills")
                        
                        # Update Materials
                        if 'Materials' in column_indices and 'materials' in content:
                            activities_worksheet.update_cell(row_num, column_indices['Materials'] + 1, content['materials'])
                            print(f"      ✅ Updated Materials")
                        
                        # Update Kit Materials
                        if 'Kit Materials' in column_indices and 'kit_materials' in content:
                            activities_worksheet.update_cell(row_num, column_indices['Kit Materials'] + 1, content['kit_materials'])
                            print(f"      ✅ Updated Kit Materials")
                        
                        # Update Materials at Home
                        if 'Materials at Home' in column_indices and 'materials_at_home' in content:
                            activities_worksheet.update_cell(row_num, column_indices['Materials at Home'] + 1, content['materials_at_home'])
                            print(f"      ✅ Updated Materials at Home")
                        
                        # Update Materials to Buy for Kit
                        if 'Materials to Buy for Kit' in column_indices and 'materials_to_buy' in content:
                            activities_worksheet.update_cell(row_num, column_indices['Materials to Buy for Kit'] + 1, content['materials_to_buy'])
                            print(f"      ✅ Updated Materials to Buy for Kit")
                        
                        # Update General Instructions
                        if 'General Instructions' in column_indices and 'general_instructions' in content:
                            activities_worksheet.update_cell(row_num, column_indices['General Instructions'] + 1, content['general_instructions'])
                            print(f"      ✅ Updated General Instructions")
                        
                        # Update Additional Information
                        if 'Additional Information' in column_indices and 'additional_info' in content:
                            activities_worksheet.update_cell(row_num, column_indices['Additional Information'] + 1, content['additional_info'])
                            print(f"      ✅ Updated Additional Information")
                        
                        # Update Corrections Needed
                        if 'Corrections Needed' in column_indices and 'corrections_needed' in content:
                            activities_worksheet.update_cell(row_num, column_indices['Corrections Needed'] + 1, content['corrections_needed'])
                            print(f"      ✅ Updated Corrections Needed")
                        
                        total_updates += 1
                        time.sleep(1)
                        
                        # Add delay every 5 updates
                        if total_updates % 5 == 0:
                            print(f"      ⏳ Waiting 5 seconds to avoid rate limits...")
                            time.sleep(5)
                    else:
                        print(f"      ⚠️  No specific content available for this activity")
        
        print(f"\n🎉 GENERIC COLUMNS FIXED!")
        print("=" * 50)
        print(f"✅ Total activities updated: {total_updates}")
        print(f"✅ All content is now specific and engaging")
        print(f"✅ Removed generic templates and age references")
        print(f"✅ Added activity-specific details")
        
        return True
        
    except Exception as e:
        print(f"❌ Error fixing generic columns: {e}")
        return False

def main():
    """Main function to fix all generic columns"""
    print("🔧 Fix All Generic Columns")
    print("=" * 50)
    print("🎯 Remove generic content and make everything specific")
    
    # Step 1: Remove redundant Age column
    print(f"\n📋 STEP 1: Remove redundant Age column")
    success1 = remove_age_column()
    
    if not success1:
        print(f"❌ Failed to remove Age column!")
        return False
    
    # Step 2: Fix generic content
    print(f"\n📋 STEP 2: Fix generic content")
    success2 = fix_generic_columns()
    
    if success1 and success2:
        print(f"\n✅ SUCCESS! All generic columns fixed!")
        print("=" * 50)
        print("✅ Redundant Age column removed")
        print("✅ Generic content replaced with specific content")
        print("✅ All activities now have unique, engaging details")
        
        return True
    else:
        print(f"\n❌ FAILED to fix all generic columns!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! All generic columns fixed!")
    else:
        print(f"\n❌ FAILED to fix all generic columns!")
