#!/usr/bin/env python3
"""
🔧 Fix Cognitive Skills Metadata Matching Issues
Fix formatting inconsistencies to match Play Creativity structure
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

def fix_cognitive_skills_metadata(client):
    """Fix metadata formatting issues in Cognitive Skills data"""
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
        print(f"📋 Found {len(headers)} columns")
        
        # Find column indices
        pillar_col_index = headers.index('Pillar') if 'Pillar' in headers else None
        hashtags_col_index = headers.index('Hashtags') if 'Hashtags' in headers else None
        skills_col_index = headers.index('Skills') if 'Skills' in headers else None
        materials_col_index = headers.index('Materials') if 'Materials' in headers else None
        
        if not all([pillar_col_index, hashtags_col_index, skills_col_index, materials_col_index]):
            print("❌ Required columns not found")
            return False
        
        # Find Cognitive Skills rows
        cognitive_skills_rows = []
        for row_num, row in enumerate(all_data[1:], start=2):
            if len(row) > pillar_col_index and row[pillar_col_index].strip() == 'Cognitive Skills':
                cognitive_skills_rows.append((row_num, row))
        
        print(f"🧠 Found {len(cognitive_skills_rows)} Cognitive Skills activities to fix")
        
        if not cognitive_skills_rows:
            print("❌ No Cognitive Skills data found")
            return False
        
        # Fix metadata formatting issues
        fixes_applied = 0
        
        for row_num, row in cognitive_skills_rows:
            row_fixes = []
            updated_row = row.copy()
            
            # Fix 1: Hashtags formatting
            if len(updated_row) > hashtags_col_index:
                hashtags = updated_row[hashtags_col_index].strip()
                if hashtags:
                    # Convert comma-separated hashtags to proper format
                    # Remove extra spaces and ensure proper formatting
                    hashtag_list = [tag.strip() for tag in hashtags.split(',') if tag.strip()]
                    # Ensure each hashtag starts with #
                    formatted_hashtags = []
                    for tag in hashtag_list:
                        if not tag.startswith('#'):
                            tag = '#' + tag
                        formatted_hashtags.append(tag)
                    updated_row[hashtags_col_index] = ', '.join(formatted_hashtags)
                    row_fixes.append(f"Fixed hashtags formatting")
            
            # Fix 2: Skills formatting
            if len(updated_row) > skills_col_index:
                skills = updated_row[skills_col_index].strip()
                if skills:
                    # Clean up skills formatting - remove extra spaces and normalize
                    skill_list = [skill.strip() for skill in skills.split(',') if skill.strip()]
                    # Remove duplicates and sort for consistency
                    unique_skills = list(dict.fromkeys(skill_list))  # Preserves order while removing duplicates
                    updated_row[skills_col_index] = ', '.join(unique_skills)
                    row_fixes.append(f"Fixed skills formatting")
            
            # Fix 3: Materials formatting
            if len(updated_row) > materials_col_index:
                materials = updated_row[materials_col_index].strip()
                if materials:
                    # Clean up materials formatting - remove extra spaces
                    material_list = [material.strip() for material in materials.split(';') if material.strip()]
                    # Remove duplicates and clean up formatting
                    unique_materials = list(dict.fromkeys(material_list))
                    updated_row[materials_col_index] = '; '.join(unique_materials)
                    row_fixes.append(f"Fixed materials formatting")
            
            # Apply fixes if any were made
            if row_fixes:
                # Update individual cells that were changed
                if len(updated_row) > hashtags_col_index and updated_row[hashtags_col_index] != row[hashtags_col_index]:
                    worksheet.update_cell(row_num, hashtags_col_index + 1, updated_row[hashtags_col_index])
                if len(updated_row) > skills_col_index and updated_row[skills_col_index] != row[skills_col_index]:
                    worksheet.update_cell(row_num, skills_col_index + 1, updated_row[skills_col_index])
                if len(updated_row) > materials_col_index and updated_row[materials_col_index] != row[materials_col_index]:
                    worksheet.update_cell(row_num, materials_col_index + 1, updated_row[materials_col_index])
                
                print(f"✅ Row {row_num}: {', '.join(row_fixes)}")
                fixes_applied += 1
                time.sleep(0.5)  # Rate limiting
        
        print(f"\n🎉 METADATA FIXES COMPLETED!")
        print("=" * 40)
        print(f"✅ Fixed {fixes_applied} Cognitive Skills activities")
        print(f"✅ Standardized hashtags formatting")
        print(f"✅ Cleaned up skills formatting")
        print(f"✅ Improved materials formatting")
        
        return True
        
    except Exception as e:
        print(f"❌ Error fixing metadata: {e}")
        return False

def main():
    """Main function to fix Cognitive Skills metadata"""
    print("🔧 Fixing Cognitive Skills Metadata Issues")
    print("=" * 50)
    
    # Connect to Google Sheets
    client = get_google_sheets_client()
    if not client:
        return False
    
    # Fix the metadata
    success = fix_cognitive_skills_metadata(client)
    
    if success:
        print(f"\n🚀 NEXT STEPS:")
        print("=" * 20)
        print("1. Run sync script to update application data")
        print("2. Verify metadata consistency in generated JSON")
        print("3. Test Cognitive Skills pillar in application")
        
        return True
    else:
        print(f"\n❌ Metadata fix failed")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Cognitive Skills metadata fixed!")
    else:
        print(f"\n❌ FAILED to fix metadata")
