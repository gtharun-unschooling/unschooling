#!/usr/bin/env python3
"""
🔍 Check Cognitive Skills Metadata Structure
Examine existing Cognitive Skills infant data and verify metadata matching
"""

import gspread
from google.oauth2.service_account import Credentials
import json

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

def examine_cognitive_skills_data(client):
    """Examine existing Cognitive Skills data structure"""
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
            return None
        
        # Open the spreadsheet
        spreadsheet = client.open_by_key(target_sheet['id'])
        worksheet = spreadsheet.get_worksheet(0)
        
        print(f"📤 Working with: {target_sheet.get('name', 'Unknown')}")
        
        # Get all data
        all_data = worksheet.get_all_values()
        if not all_data:
            print("❌ No data found")
            return None
        
        headers = all_data[0]
        print(f"\n📋 Headers found ({len(headers)} columns):")
        for i, header in enumerate(headers):
            print(f"   {i+1:2d}. {header}")
        
        # Filter for Cognitive Skills data
        cognitive_skills_data = []
        pillar_col_index = headers.index('Pillar') if 'Pillar' in headers else None
        
        if pillar_col_index is None:
            print("❌ 'Pillar' column not found")
            return None
        
        for row_num, row in enumerate(all_data[1:], start=2):
            if len(row) > pillar_col_index and row[pillar_col_index].strip() == 'Cognitive Skills':
                cognitive_skills_data.append((row_num, row))
        
        print(f"\n🧠 Found {len(cognitive_skills_data)} Cognitive Skills activities")
        
        if not cognitive_skills_data:
            print("❌ No Cognitive Skills data found")
            return None
        
        # Analyze the data structure
        print(f"\n📊 COGNITIVE SKILLS DATA ANALYSIS:")
        print("=" * 50)
        
        # Check age groups
        age_group_col_index = headers.index('Age Group') if 'Age Group' in headers else None
        if age_group_col_index is not None:
            age_groups = set()
            for row_num, row in cognitive_skills_data:
                if len(row) > age_group_col_index:
                    age_groups.add(row[age_group_col_index].strip())
            print(f"📊 Age Groups: {sorted(age_groups)}")
        
        # Check categories
        category_col_index = headers.index('Category') if 'Category' in headers else None
        if category_col_index is not None:
            categories = set()
            for row_num, row in cognitive_skills_data:
                if len(row) > category_col_index:
                    categories.add(row[category_col_index].strip())
            print(f"📊 Categories: {sorted(categories)}")
        
        # Focus on Infant data specifically
        infant_data = []
        if age_group_col_index is not None:
            for row_num, row in cognitive_skills_data:
                if len(row) > age_group_col_index and 'infant' in row[age_group_col_index].lower():
                    infant_data.append((row_num, row))
        
        print(f"\n👶 INFANT (0-1) DATA ANALYSIS:")
        print("=" * 40)
        print(f"📊 Found {len(infant_data)} infant activities")
        
        if infant_data:
            # Analyze each infant activity in detail
            for i, (row_num, row) in enumerate(infant_data, 1):
                print(f"\n🔍 Activity {i} (Row {row_num}):")
                
                # Create a dictionary of the row data
                activity_data = {}
                for j, header in enumerate(headers):
                    if j < len(row):
                        activity_data[header] = row[j]
                
                # Display key fields
                key_fields = ['Topic', 'Objective', 'Explanation', 'Activity Name', 'Materials', 'Steps', 'Skills', 'Hashtags']
                for field in key_fields:
                    if field in activity_data:
                        value = activity_data[field].strip()
                        if value:
                            # Truncate long values for display
                            display_value = value[:100] + "..." if len(value) > 100 else value
                            print(f"   {field}: {display_value}")
                        else:
                            print(f"   {field}: [EMPTY]")
                    else:
                        print(f"   {field}: [MISSING COLUMN]")
                
                print(f"   {'-'*50}")
        
        # Check metadata consistency
        print(f"\n🔍 METADATA CONSISTENCY CHECK:")
        print("=" * 40)
        
        # Check for empty or missing critical fields
        critical_fields = ['Topic', 'Objective', 'Activity Name', 'Materials', 'Steps', 'Skills']
        missing_fields = {}
        
        for row_num, row in cognitive_skills_data:
            for field in critical_fields:
                if field in headers:
                    col_index = headers.index(field)
                    if len(row) <= col_index or not row[col_index].strip():
                        if field not in missing_fields:
                            missing_fields[field] = []
                        missing_fields[field].append(row_num)
        
        if missing_fields:
            print("❌ Missing or empty critical fields:")
            for field, rows in missing_fields.items():
                print(f"   {field}: Missing in rows {rows}")
        else:
            print("✅ All critical fields have data")
        
        # Check data format consistency
        print(f"\n🔍 DATA FORMAT CHECK:")
        print("=" * 30)
        
        # Check if steps are properly formatted
        steps_col_index = headers.index('Steps') if 'Steps' in headers else None
        if steps_col_index is not None:
            steps_issues = []
            for row_num, row in cognitive_skills_data:
                if len(row) > steps_col_index:
                    steps = row[steps_col_index].strip()
                    if steps:
                        # Check if steps are numbered or have bullet points
                        if not any(char in steps for char in ['1.', '2.', '3.', '•', ';']):
                            steps_issues.append((row_num, steps[:50] + "..."))
            
            if steps_issues:
                print("⚠️  Steps formatting issues:")
                for row_num, steps_preview in steps_issues:
                    print(f"   Row {row_num}: {steps_preview}")
            else:
                print("✅ Steps appear to be properly formatted")
        
        # Check if skills are properly formatted
        skills_col_index = headers.index('Skills') if 'Skills' in headers else None
        if skills_col_index is not None:
            skills_issues = []
            for row_num, row in cognitive_skills_data:
                if len(row) > skills_col_index:
                    skills = row[skills_col_index].strip()
                    if skills:
                        # Check if skills are separated properly
                        if not any(char in skills for char in [';', ',', '•']):
                            skills_issues.append((row_num, skills[:50] + "..."))
            
            if skills_issues:
                print("⚠️  Skills formatting issues:")
                for row_num, skills_preview in skills_issues:
                    print(f"   Row {row_num}: {skills_preview}")
            else:
                print("✅ Skills appear to be properly formatted")
        
        return {
            'headers': headers,
            'cognitive_skills_data': cognitive_skills_data,
            'infant_data': infant_data,
            'missing_fields': missing_fields
        }
        
    except Exception as e:
        print(f"❌ Error examining data: {e}")
        return None

def main():
    """Main function to check Cognitive Skills metadata"""
    print("🔍 Checking Cognitive Skills Metadata Structure")
    print("=" * 60)
    
    # Connect to Google Sheets
    client = get_google_sheets_client()
    if not client:
        return False
    
    # Examine the data
    analysis = examine_cognitive_skills_data(client)
    
    if analysis:
        print(f"\n📋 SUMMARY:")
        print("=" * 20)
        print(f"✅ Total Cognitive Skills activities: {len(analysis['cognitive_skills_data'])}")
        print(f"✅ Infant activities: {len(analysis['infant_data'])}")
        print(f"✅ Total columns: {len(analysis['headers'])}")
        
        if analysis['missing_fields']:
            print(f"⚠️  Issues found: {len(analysis['missing_fields'])} fields with missing data")
        else:
            print(f"✅ No critical missing data found")
        
        print(f"\n🎯 RECOMMENDATIONS:")
        print("=" * 25)
        print("1. Review the infant data structure above")
        print("2. Ensure all metadata fields are properly filled")
        print("3. Check formatting consistency for Steps and Skills")
        print("4. Verify that the data matches the expected JSON structure")
        
        return True
    else:
        print("❌ Failed to analyze data")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ Metadata check completed!")
    else:
        print(f"\n❌ Metadata check failed!")
