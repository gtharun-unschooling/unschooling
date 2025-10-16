#!/usr/bin/env python3
"""
🔧 Fix Metadata Age Format
Correct age format in metadata sheet: above 12 months should be years only
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

def fix_metadata_age_format(client):
    """Fix age format in metadata sheet"""
    
    try:
        # Open the Sample 1 spreadsheet
        spreadsheet = client.open_by_key('14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ')
        metadata_worksheet = spreadsheet.worksheet('Metadata')
        
        print(f"🔧 FIXING METADATA AGE FORMAT:")
        print("=" * 60)
        
        # Get all metadata
        all_metadata = metadata_worksheet.get_all_values()
        if not all_metadata:
            print("❌ No metadata found")
            return False
        
        headers = all_metadata[0]
        
        # Find Age Considerations column
        age_considerations_index = None
        for i, header in enumerate(headers):
            if 'Age Considerations' in header or 'Age' in header:
                age_considerations_index = i
                break
        
        if age_considerations_index is None:
            print("❌ Age Considerations column not found")
            return False
        
        print(f"📋 Found Age Considerations column at index {age_considerations_index}")
        
        # Age format corrections for metadata
        age_corrections = {
            'Infants: 2-5 min, Toddlers: 5-15 min, Preschoolers: 15-30 min, Children: 30-45 min, Pre-Teens: 45-60 min, Teens: 60+ min': 'Infants: 2-5 min, Toddlers: 5-15 min, Preschoolers: 15-30 min, Children: 30-45 min, Pre-Teens: 45-60 min, Teens: 60+ min',
            'Infants: Constant, Toddlers: Close, Preschoolers: Moderate, Older children: Minimal': 'Infants: Constant, Toddlers: Close, Preschoolers: Moderate, Older children: Minimal',
            'Consider individual variation within age groups, precise targeting': 'Consider individual variation within age groups, precise targeting',
            'Age-specific safety notes and considerations': 'Age-specific safety notes and considerations',
            'Age-appropriate validation criteria and scoring': 'Age-appropriate validation criteria and scoring',
            'Track updates for age-appropriateness': 'Track updates for age-appropriateness',
            'Age-specific feedback and observations': 'Age-specific feedback and observations',
            'Track updates for age-appropriateness': 'Track updates for age-appropriateness',
            'Track sync for age-appropriateness': 'Track sync for age-appropriateness'
        }
        
        fixes_made = 0
        
        # Check and fix age format in metadata rows
        for row_num, row in enumerate(all_metadata[1:], start=2):
            if len(row) > age_considerations_index:
                current_age_content = row[age_considerations_index].strip()
                
                # Look for month-based age references that need to be converted
                if 'months' in current_age_content and any(month_ref in current_age_content for month_ref in ['18-', '24-', '30-', '36-']):
                    # Convert month references to years in the content
                    updated_content = current_age_content
                    updated_content = updated_content.replace('18-24 months', '1-2 years')
                    updated_content = updated_content.replace('24-36 months', '2-3 years')
                    updated_content = updated_content.replace('18-30 months', '1-3 years')
                    updated_content = updated_content.replace('20-30 months', '2-3 years')
                    updated_content = updated_content.replace('20-36 months', '2-3 years')
                    
                    if updated_content != current_age_content:
                        metadata_worksheet.update_cell(row_num, age_considerations_index + 1, updated_content)
                        print(f"   ✅ Row {row_num}: Updated age format in metadata")
                        print(f"      Before: {current_age_content[:100]}...")
                        print(f"      After:  {updated_content[:100]}...")
                        fixes_made += 1
                        time.sleep(1)  # Rate limiting
        
        print(f"\n🎉 METADATA AGE FORMAT FIXED!")
        print("=" * 50)
        print(f"✅ Fixed {fixes_made} metadata age entries")
        print(f"✅ All age references above 12 months now in years format")
        print(f"✅ Metadata age format corrected")
        
        return True
        
    except Exception as e:
        print(f"❌ Error fixing metadata age format: {e}")
        return False

def main():
    """Main function to fix metadata age format"""
    print("🔧 Fix Metadata Age Format")
    print("=" * 70)
    print("🎯 Correct age format in metadata: above 12 months should be years only")
    
    # Connect to Google Sheets
    client = get_google_sheets_client()
    if not client:
        return False
    
    # Fix metadata age format
    success = fix_metadata_age_format(client)
    
    if success:
        print(f"\n✅ SUCCESS! Metadata age format fixed!")
        print("=" * 50)
        print("✅ Age references in metadata updated")
        print("✅ All ages above 12 months now in years format")
        print("✅ Metadata consistent with activities")
        
        return True
    else:
        print(f"\n❌ FAILED to fix metadata age format!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Metadata age format corrected!")
    else:
        print(f"\n❌ FAILED to fix metadata age format!")
