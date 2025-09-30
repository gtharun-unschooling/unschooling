#!/usr/bin/env python3
"""
🔄 Undo Incorrect Changes to Activities Sheet
Revert the changes made to the activities sheet instead of metadata sheet
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

def undo_incorrect_changes(client):
    """Undo the incorrect changes made to activities sheet"""
    
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
        category_desc_col_index = headers.index('Category Description') if 'Category Description' in headers else None
        additional_info_col_index = headers.index('Additional Information') if 'Additional Information' in headers else None
        
        print(f"🔄 Undoing incorrect changes to activities sheet...")
        
        # Revert category descriptions to original state
        print(f"\n🔄 REVERTING CATEGORY DESCRIPTIONS:")
        print("=" * 40)
        
        # Define original category descriptions (before my incorrect changes)
        original_descriptions = {
            'Sensory Exploration': 'Activities focusing on developing tactile, visual, and auditory awareness through safe, gentle exploration of different textures, sounds, and visual stimuli appropriate for 0-1 year olds.',
            'Tummy Time Play': 'Gentle tummy time activities that help develop neck strength, visual tracking, and early motor skills while providing safe, supervised play experiences for infants.',
            'Interactive Sounds And Textures': 'Simple cause-and-effect activities using safe, soft materials that respond to infant touch or movement, helping develop basic understanding of cause and effect.',
            'Parent Child Bonding Activities': 'Calm, nurturing activities that strengthen the parent-child bond through gentle interaction, eye contact, and responsive communication.',
            'Pretend Play': 'Simple imaginative play activities that encourage creativity, social skills, and language development through role-playing and make-believe scenarios.',
            'Building With Blocks': 'Basic construction and stacking activities that develop fine motor skills, spatial awareness, and problem-solving through hands-on building experiences.',
            'Drawing And Scribbling': 'Early art activities using large, safe materials that encourage creativity, fine motor development, and self-expression through drawing and mark-making.',
            'Exploring Musical Instruments': 'Introduction to music through simple instruments, rhythm, and sound exploration that develops auditory skills and coordination.',
            'Imaginative Play With Dolls': 'Complex pretend play using dolls and figures to develop empathy, social skills, storytelling, and emotional understanding.',
            'Simple Crafting': 'Basic art and craft projects that develop creativity, fine motor skills, and following instructions while creating tangible objects.',
            'Role Playing Games': 'Structured pretend play activities that teach social skills, problem-solving, and cooperation through themed role-playing scenarios.',
            'Shape Sorting And Color Matching': 'Cognitive activities that develop pattern recognition, categorization, and early math concepts through sorting and matching games.',
            'Creative Storytelling': 'Advanced storytelling activities that develop imagination, language skills, and narrative thinking through writing, drawing, and performance.',
            'Advanced Drawing And Painting': 'Sophisticated art activities that develop technical skills, creativity, and artistic expression through various drawing and painting techniques.',
            'Diy Craft Projects': 'Complex crafting projects that develop planning skills, creativity, and problem-solving through multi-step construction and design challenges.',
            'Inventing Games': 'Creative game design activities that develop innovation, rule-making, and social interaction through creating and playing original games.',
            'Design Thinking For Toys': 'Innovation-focused activities that develop critical thinking, problem-solving, and design skills through creating and improving toys.',
            'Stop Motion Animation Projects': 'Technology-integrated creative projects that develop planning, patience, and technical skills through creating animated stories.',
            'Music Composition And Recording': 'Advanced music activities that develop creativity, technical skills, and self-expression through composing and recording original music.',
            'Sculpting And 3D Modeling': 'Three-dimensional art projects that develop spatial thinking, creativity, and technical skills through sculpting and modeling materials.',
            'Artistic Performance And Design': 'Professional-level creative activities that develop advanced artistic skills, performance abilities, and creative expression.',
            'Creating Digital Art': 'Technology-based art activities that develop digital literacy, creativity, and modern artistic skills using digital tools and platforms.',
            'Building And Designing Gadgets': 'Engineering-focused creative projects that develop problem-solving, innovation, and technical skills through designing and building functional objects.',
            'Independent Fashion Design': 'Advanced design activities that develop creativity, technical skills, and self-expression through creating and styling fashion items.'
        }
        
        # Revert category descriptions
        reverted_count = 0
        for row_num, row in enumerate(all_data[1:], start=2):
            if len(row) > category_desc_col_index:
                # Get category from the row (assuming it's in a category column)
                category_col_index = headers.index('Category') if 'Category' in headers else None
                if category_col_index and len(row) > category_col_index:
                    current_category = row[category_col_index].strip()
                    
                    if current_category in original_descriptions:
                        original_desc = original_descriptions[current_category]
                        current_desc = row[category_desc_col_index].strip()
                        
                        # Only revert if it's different from original
                        if current_desc != original_desc:
                            worksheet.update_cell(row_num, category_desc_col_index + 1, original_desc)
                            reverted_count += 1
                            print(f"   ✅ Reverted: {current_category}")
        
        print(f"✅ Reverted {reverted_count} category descriptions")
        
        # Clear the Additional Information column that I incorrectly updated
        print(f"\n🔄 CLEARING INCORRECT ADDITIONAL INFORMATION:")
        print("=" * 50)
        
        cleared_count = 0
        for row_num, row in enumerate(all_data[1:], start=2):
            if len(row) > additional_info_col_index:
                current_info = row[additional_info_col_index].strip()
                
                # If it contains the metadata structure info I added, clear it
                if 'COMPREHENSIVE METADATA STRUCTURE GUIDELINES' in current_info:
                    worksheet.update_cell(row_num, additional_info_col_index + 1, '')
                    cleared_count += 1
                    print(f"   ✅ Cleared row {row_num}")
                    break  # Only clear the first occurrence
        
        print(f"✅ Cleared {cleared_count} incorrect additional information entries")
        
        print(f"\n🎉 UNDO OPERATION COMPLETE!")
        print("=" * 40)
        print(f"✅ Reverted {reverted_count} category descriptions to original state")
        print(f"✅ Cleared {cleared_count} incorrect additional information entries")
        print(f"✅ Activities sheet restored to original state")
        print(f"✅ Ready to update correct metadata sheet")
        
        return True
        
    except Exception as e:
        print(f"❌ Error undoing changes: {e}")
        return False

def main():
    """Main function to undo incorrect changes"""
    print("🔄 Undoing Incorrect Changes to Activities Sheet")
    print("=" * 60)
    print("🎯 Reverting changes made to activities sheet instead of metadata sheet")
    
    # Connect to Google Sheets
    client = get_google_sheets_client()
    if not client:
        return False
    
    # Undo incorrect changes
    success = undo_incorrect_changes(client)
    
    if success:
        print(f"\n✅ SUCCESS! Incorrect changes undone!")
        print("=" * 40)
        print("✅ Activities sheet restored to original state")
        print("✅ Category descriptions reverted")
        print("✅ Additional information cleared")
        print("✅ Ready to update correct metadata sheet")
        
        return True
    else:
        print(f"\n❌ FAILED to undo changes!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Undo operation completed!")
    else:
        print(f"\n❌ FAILED to undo changes!")
