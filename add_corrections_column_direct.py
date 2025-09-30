#!/usr/bin/env python3
"""
🔧 Add Corrections Column Direct
Direct approach to add corrections column to Google Sheets
"""

import pandas as pd
import os
from google.oauth2 import service_account
import gspread
from datetime import datetime

def add_corrections_column_direct():
    """Direct approach to add corrections column to Google Sheets"""
    
    print("🔧 Adding Corrections Column Direct")
    print("=" * 60)
    
    # Configuration
    CREDS_FILE = 'sheets-credentials.json'
    METADATA_FILE = 'essential-growth-activities-metadata-updated.csv'
    
    try:
        # Load metadata
        df_metadata = pd.read_csv(METADATA_FILE)
        print(f"📋 Loaded metadata: {len(df_metadata)} column definitions")
        
        # Use the proper service account
        scope = [
            'https://spreadsheets.google.com/feeds',
            'https://www.googleapis.com/auth/spreadsheets',
            'https://www.googleapis.com/auth/drive',
            'https://www.googleapis.com/auth/drive.file'
        ]
        creds = service_account.Credentials.from_service_account_file(CREDS_FILE, scopes=scope)
        client = gspread.authorize(creds)
        print("✅ Authenticated with Sheets Uploader service account")
        
        # Get all sheets
        all_sheets = client.list_spreadsheet_files()
        print(f"📋 Found {len(all_sheets)} sheets")
        
        # Find your files
        target_files = []
        for sheet in all_sheets:
            print(f"Available sheet: {sheet}")
            # Try different ways to get the title
            title = ""
            if 'title' in sheet:
                title = sheet['title'].lower()
            elif 'name' in sheet:
                title = sheet['name'].lower()
            elif 'title' in sheet.get('properties', {}):
                title = sheet['properties']['title'].lower()
            
            if title and ('sample 1' in title or 'sample 2' in title or 'sample one' in title or 'sample two' in title):
                target_files.append(sheet)
                print(f"✅ Found: {title}")
        
        if not target_files:
            print("❌ No Sample One or Sample Two found")
            return False
        
        # Open the first target file
        target_sheet = target_files[0]
        sheet_name = target_sheet.get('name', target_sheet.get('title', 'Unknown'))
        print(f"\n📤 Working with: {sheet_name}")
        
        # Open sheet
        spreadsheet = client.open_by_key(target_sheet['id'])
        
        # Get the main worksheet (first one)
        worksheet = spreadsheet.get_worksheet(0)
        
        # Get all data
        all_data = worksheet.get_all_values()
        if not all_data:
            print("❌ No data found in the worksheet")
            return False
        
        # Get headers
        headers = all_data[0]
        print(f"📋 Found {len(headers)} columns in Google Sheets")
        
        # Get the first activity (row 2, since row 1 is headers)
        first_activity_row = all_data[1] if len(all_data) > 1 else []
        if not first_activity_row:
            print("❌ No activity data found")
            return False
        
        print(f"\n🎯 Analyzing first activity:")
        print(f"   Activity ID: {first_activity_row[0] if len(first_activity_row) > 0 else 'N/A'}")
        print(f"   Topic: {first_activity_row[8] if len(first_activity_row) > 8 else 'N/A'}")
        print(f"   Pillar: {first_activity_row[1] if len(first_activity_row) > 1 else 'N/A'}")
        print(f"   Age Group: {first_activity_row[2] if len(first_activity_row) > 2 else 'N/A'}")
        
        # Create metadata lookup
        metadata_lookup = {}
        for _, row in df_metadata.iterrows():
            if row['Column Name'] != 'METADATA INFO':
                metadata_lookup[row['Column Name']] = row
        
        print(f"\n📋 Metadata standards loaded for {len(metadata_lookup)} columns")
        
        # Analyze each column for issues
        corrections_needed = []
        
        for i, column_name in enumerate(headers):
            if column_name in metadata_lookup and i < len(first_activity_row):
                current_value = str(first_activity_row[i])
                metadata = metadata_lookup[column_name]
                
                # Check for specific issues
                issues = []
                
                # Check word limits
                if pd.notna(metadata['Max Words']) and metadata['Max Words'] != '' and metadata['Max Words'] != 'N/A':
                    try:
                        max_words = int(metadata['Max Words'])
                        word_count = len(current_value.split())
                        if word_count > max_words:
                            issues.append(f"Exceeds word limit: {word_count} words (max: {max_words})")
                    except:
                        pass
                
                # Check item limits
                if pd.notna(metadata['Max Items']) and metadata['Max Items'] != '' and metadata['Max Items'] != 'N/A':
                    try:
                        max_items = int(metadata['Max Items'])
                        if ';' in current_value:
                            item_count = len([item.strip() for item in current_value.split(';') if item.strip()])
                        else:
                            item_count = 1 if current_value.strip() else 0
                        if item_count > max_items:
                            issues.append(f"Exceeds item limit: {item_count} items (max: {max_items})")
                    except:
                        pass
                
                # Check step limits
                if pd.notna(metadata['Max Steps']) and metadata['Max Steps'] != '' and metadata['Max Steps'] != 'N/A':
                    try:
                        max_steps = int(metadata['Max Steps'])
                        if ';' in current_value:
                            step_count = len([step.strip() for step in current_value.split(';') if step.strip()])
                        else:
                            step_count = 1 if current_value.strip() else 0
                        if step_count > max_steps:
                            issues.append(f"Exceeds step limit: {step_count} steps (max: {max_steps})")
                    except:
                        pass
                
                # Check skill limits
                if pd.notna(metadata['Max Skills']) and metadata['Max Skills'] != '' and metadata['Max Skills'] != 'N/A':
                    try:
                        max_skills = int(metadata['Max Skills'])
                        if ',' in current_value:
                            skill_count = len([skill.strip() for skill in current_value.split(',') if skill.strip()])
                        else:
                            skill_count = 1 if current_value.strip() else 0
                        if skill_count > max_skills:
                            issues.append(f"Exceeds skill limit: {skill_count} skills (max: {max_skills})")
                    except:
                        pass
                
                # Check hashtag limits
                if pd.notna(metadata['Max Hashtags']) and metadata['Max Hashtags'] != '' and metadata['Max Hashtags'] != 'N/A':
                    try:
                        max_hashtags = int(metadata['Max Hashtags'])
                        if ',' in current_value:
                            hashtag_count = len([tag.strip() for tag in current_value.split(',') if tag.strip()])
                        else:
                            hashtag_count = 1 if current_value.strip() else 0
                        if hashtag_count > max_hashtags:
                            issues.append(f"Exceeds hashtag limit: {hashtag_count} hashtags (max: {max_hashtags})")
                    except:
                        pass
                
                # Check words per step
                if pd.notna(metadata['Max Words per Step']) and metadata['Max Words per Step'] != '' and metadata['Max Words per Step'] != 'N/A':
                    try:
                        max_words_per_step = int(metadata['Max Words per Step'])
                        if ';' in current_value:
                            steps = [step.strip() for step in current_value.split(';') if step.strip()]
                            for j, step in enumerate(steps):
                                step_word_count = len(step.split())
                                if step_word_count > max_words_per_step:
                                    issues.append(f"Step {j+1} exceeds word limit: {step_word_count} words (max: {max_words_per_step})")
                    except:
                        pass
                
                # Check for predefined options
                if pd.notna(metadata['Options']) and metadata['Options'] != '' and metadata['Options'] != 'N/A':
                    valid_options = [opt.strip() for opt in metadata['Options'].split(',')]
                    if current_value not in valid_options:
                        issues.append(f"Invalid option: '{current_value}' (valid: {', '.join(valid_options)})")
                
                # Check for empty values where required
                if current_value.strip() == '' or current_value.strip() == 'nan':
                    if 'required' in metadata['Rules'].lower() or 'must' in metadata['Rules'].lower():
                        issues.append(f"Empty value where required")
                
                # Check for internal references in customer-facing columns
                if metadata['Customer Facing'] == 'Yes':
                    internal_phrases = ['supplied by us', 'our activity kit', 'our step-by-step guide', 'our tracking sheet']
                    for phrase in internal_phrases:
                        if phrase.lower() in current_value.lower():
                            issues.append(f"Contains internal reference: '{phrase}' in customer-facing column")
                
                # Store issues for this column
                if issues:
                    corrections_needed.append({
                        'column': column_name,
                        'current_value': current_value,
                        'issues': issues,
                        'metadata': metadata
                    })
        
        # Add corrections column to Google Sheets
        print(f"\n📝 Adding corrections column to Google Sheets...")
        
        # Check if corrections column already exists
        if 'Corrections Needed' not in headers:
            # Add new column header
            new_headers = headers + ['Corrections Needed']
            worksheet.update('A1', [new_headers])
            print("✅ Added 'Corrections Needed' column header")
        else:
            print("✅ 'Corrections Needed' column already exists")
        
        # Add corrections for the first activity
        if corrections_needed:
            corrections_text = "; ".join([f"{correction['column']}: {', '.join(correction['issues'])}" for correction in corrections_needed])
        else:
            corrections_text = "No corrections needed - meets all standards"
        
        # Update the corrections cell for the first activity (row 2)
        # Use proper column letter calculation
        corrections_col_index = len(headers)  # 0-based index
        corrections_col_letter = chr(65 + corrections_col_index)  # Convert to letter
        corrections_cell = f"{corrections_col_letter}2"
        
        # Use the correct update format with proper cell reference
        worksheet.update(corrections_cell, corrections_text)
        print(f"✅ Added corrections for first activity: {corrections_text}")
        
        # Format the corrections column
        worksheet.format(f"{corrections_col_letter}1", {
            'backgroundColor': {'red': 0.26, 'green': 0.52, 'blue': 0.96},
            'textFormat': {'foregroundColor': {'red': 1, 'green': 1, 'blue': 1}, 'bold': True}
        })
        
        # Color code the corrections cell
        if corrections_needed:
            # Red background for issues
            worksheet.format(f"{corrections_col_letter}2", {
                'backgroundColor': {'red': 1.0, 'green': 0.8, 'blue': 0.8}
            })
        else:
            # Green background for no issues
            worksheet.format(f"{corrections_col_letter}2", {
                'backgroundColor': {'red': 0.8, 'green': 1.0, 'blue': 0.8}
            })
        
        print("✅ Formatted corrections column")
        
        # Summary
        print(f"\n📊 Analysis Summary:")
        print("=" * 30)
        print(f"   Total columns analyzed: {len(headers)}")
        print(f"   Columns with issues: {len(corrections_needed)}")
        print(f"   Columns without issues: {len(headers) - len(corrections_needed)}")
        print(f"   Corrections column: Added to Google Sheets")
        
        if corrections_needed:
            print(f"\n🚨 Corrections Needed:")
            print("=" * 30)
            for correction in corrections_needed:
                print(f"\n📝 {correction['column']}:")
                print(f"   Current: {correction['current_value']}")
                print(f"   Issues: {len(correction['issues'])}")
                for issue in correction['issues']:
                    print(f"      {issue}")
        else:
            print(f"\n✅ No corrections needed for the first activity!")
        
        print(f"\n🎉 Analysis Complete!")
        print(f"🔗 URL: {spreadsheet.url}")
        print(f"📋 Corrections column added and populated")
        
        return corrections_needed
        
    except Exception as e:
        print(f"❌ Error during analysis: {e}")
        return []

if __name__ == '__main__':
    corrections = add_corrections_column_direct()
    
    if corrections:
        print(f"\n🎯 Found {len(corrections)} columns needing corrections")
        print("📝 Corrections added to Google Sheets")
    else:
        print(f"\n✅ First activity meets all metadata standards!")
        print("📝 'No corrections needed' added to Google Sheets")
