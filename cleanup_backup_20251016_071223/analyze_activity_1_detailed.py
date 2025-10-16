#!/usr/bin/env python3
"""
🔍 Analyze Activity 1 Detailed
Detailed analysis of Activity 1 to identify specific issues and improvements needed
"""

import pandas as pd
import os
from google.oauth2 import service_account
import gspread
from datetime import datetime

def analyze_activity_1_detailed():
    """Detailed analysis of Activity 1 to identify specific issues and improvements"""
    
    print("🔍 Detailed Analysis of Activity 1")
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
        
        print(f"\n🎯 Activity 1 Details:")
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
        
        # Detailed analysis of each column
        print(f"\n🔍 Detailed Column Analysis:")
        print("=" * 60)
        
        total_score = 0
        max_possible_score = 0
        issues = []
        improvements = []
        
        for i, column_name in enumerate(headers):
            if column_name in metadata_lookup and i < len(first_activity_row):
                current_value = str(first_activity_row[i])
                metadata = metadata_lookup[column_name]
                
                print(f"\n📝 {column_name}:")
                print(f"   Current: {current_value}")
                print(f"   Purpose: {metadata['Purpose']}")
                print(f"   Format: {metadata['Format']}")
                print(f"   Rules: {metadata['Rules']}")
                print(f"   Quality Standards: {metadata['Quality Standards']}")
                
                # Calculate score for this column
                column_score = 0
                column_max_score = 10  # Each column worth 10 points
                column_issues = []
                column_improvements = []
                
                # Check word limits
                if pd.notna(metadata['Max Words']) and metadata['Max Words'] != '' and metadata['Max Words'] != 'N/A':
                    try:
                        max_words = int(metadata['Max Words'])
                        word_count = len(current_value.split())
                        if word_count <= max_words:
                            column_score += 2
                            print(f"   ✅ Word count: {word_count}/{max_words}")
                        else:
                            column_issues.append(f"Exceeds word limit: {word_count} words (max: {max_words})")
                            column_improvements.append(f"Reduce to {max_words} words or less")
                            print(f"   ❌ Word count: {word_count}/{max_words} (EXCEEDS LIMIT)")
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
                        if item_count <= max_items:
                            column_score += 2
                            print(f"   ✅ Item count: {item_count}/{max_items}")
                        else:
                            column_issues.append(f"Exceeds item limit: {item_count} items (max: {max_items})")
                            column_improvements.append(f"Reduce to {max_items} items or less")
                            print(f"   ❌ Item count: {item_count}/{max_items} (EXCEEDS LIMIT)")
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
                        if step_count <= max_steps:
                            column_score += 2
                            print(f"   ✅ Step count: {step_count}/{max_steps}")
                        else:
                            column_issues.append(f"Exceeds step limit: {step_count} steps (max: {max_steps})")
                            column_improvements.append(f"Reduce to {max_steps} steps or less")
                            print(f"   ❌ Step count: {step_count}/{max_steps} (EXCEEDS LIMIT)")
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
                        if skill_count <= max_skills:
                            column_score += 2
                            print(f"   ✅ Skill count: {skill_count}/{max_skills}")
                        else:
                            column_issues.append(f"Exceeds skill limit: {skill_count} skills (max: {max_skills})")
                            column_improvements.append(f"Reduce to {max_skills} skills or less")
                            print(f"   ❌ Skill count: {skill_count}/{max_skills} (EXCEEDS LIMIT)")
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
                        if hashtag_count <= max_hashtags:
                            column_score += 2
                            print(f"   ✅ Hashtag count: {hashtag_count}/{max_hashtags}")
                        else:
                            column_issues.append(f"Exceeds hashtag limit: {hashtag_count} hashtags (max: {max_hashtags})")
                            column_improvements.append(f"Reduce to {max_hashtags} hashtags or less")
                            print(f"   ❌ Hashtag count: {hashtag_count}/{max_hashtags} (EXCEEDS LIMIT)")
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
                                if step_word_count <= max_words_per_step:
                                    print(f"   ✅ Step {j+1} word count: {step_word_count}/{max_words_per_step}")
                                else:
                                    column_issues.append(f"Step {j+1} exceeds word limit: {step_word_count} words (max: {max_words_per_step})")
                                    column_improvements.append(f"Reduce Step {j+1} to {max_words_per_step} words or less")
                                    print(f"   ❌ Step {j+1} word count: {step_word_count}/{max_words_per_step} (EXCEEDS LIMIT)")
                    except:
                        pass
                
                # Check for predefined options
                if pd.notna(metadata['Options']) and metadata['Options'] != '' and metadata['Options'] != 'N/A':
                    valid_options = [opt.strip() for opt in metadata['Options'].split(',')]
                    if current_value in valid_options:
                        column_score += 2
                        print(f"   ✅ Valid option: {current_value}")
                    else:
                        column_issues.append(f"Invalid option: '{current_value}' (valid: {', '.join(valid_options)})")
                        column_improvements.append(f"Use one of: {', '.join(valid_options)}")
                        print(f"   ❌ Invalid option: '{current_value}' (valid: {', '.join(valid_options)})")
                
                # Check for empty values where required
                if current_value.strip() == '' or current_value.strip() == 'nan':
                    if 'required' in metadata['Rules'].lower() or 'must' in metadata['Rules'].lower():
                        column_issues.append(f"Empty value where required")
                        column_improvements.append(f"Fill in required value")
                        print(f"   ❌ Empty value where required")
                    else:
                        column_score += 1  # Partial credit for optional empty values
                        print(f"   ⚠️ Empty value (may be optional)")
                else:
                    column_score += 2  # Full credit for non-empty values
                    print(f"   ✅ Non-empty value")
                
                # Check for internal references in customer-facing columns
                if metadata['Customer Facing'] == 'Yes':
                    internal_phrases = ['supplied by us', 'our activity kit', 'our step-by-step guide', 'our tracking sheet']
                    has_internal_ref = False
                    for phrase in internal_phrases:
                        if phrase.lower() in current_value.lower():
                            has_internal_ref = True
                            column_issues.append(f"Contains internal reference: '{phrase}' in customer-facing column")
                            column_improvements.append(f"Remove internal reference: '{phrase}'")
                            print(f"   ❌ Contains internal reference: '{phrase}'")
                    if not has_internal_ref:
                        column_score += 2
                        print(f"   ✅ No internal references in customer-facing column")
                
                # Add to totals
                total_score += column_score
                max_possible_score += column_max_score
                
                # Store issues and improvements
                if column_issues:
                    issues.extend([f"{column_name}: {issue}" for issue in column_issues])
                if column_improvements:
                    improvements.extend([f"{column_name}: {improvement}" for improvement in column_improvements])
                
                print(f"   📊 Column Score: {column_score}/{column_max_score}")
        
        # Calculate final score
        final_score = (total_score / max_possible_score) * 100 if max_possible_score > 0 else 0
        
        # Determine grade
        if final_score >= 90:
            grade = "A+"
        elif final_score >= 80:
            grade = "A"
        elif final_score >= 70:
            grade = "B+"
        elif final_score >= 60:
            grade = "B"
        elif final_score >= 50:
            grade = "C+"
        elif final_score >= 40:
            grade = "C"
        else:
            grade = "D"
        
        # Summary
        print(f"\n📊 Activity 1 Analysis Summary:")
        print("=" * 50)
        print(f"   Final Score: {final_score:.1f}/100 ({grade})")
        print(f"   Breakdown: {total_score}/{max_possible_score} points")
        print(f"   Total Issues: {len(issues)}")
        print(f"   Total Improvements: {len(improvements)}")
        
        if issues:
            print(f"\n🚨 Issues Found:")
            print("=" * 30)
            for issue in issues:
                print(f"   - {issue}")
        
        if improvements:
            print(f"\n💡 Improvements Needed:")
            print("=" * 30)
            for improvement in improvements:
                print(f"   - {improvement}")
        
        # Priority improvements
        print(f"\n🎯 Priority Improvements (Top 5):")
        print("=" * 40)
        priority_improvements = improvements[:5]
        for i, improvement in enumerate(priority_improvements, 1):
            print(f"   {i}. {improvement}")
        
        # Expected score after improvements
        potential_score = final_score + (len(improvements) * 2)  # Assume 2 points per improvement
        if potential_score > 100:
            potential_score = 100
        
        print(f"\n🚀 Expected Score After Improvements: {potential_score:.1f}/100")
        
        return {
            'current_score': final_score,
            'potential_score': potential_score,
            'issues': issues,
            'improvements': improvements,
            'priority_improvements': priority_improvements
        }
        
    except Exception as e:
        print(f"❌ Error during analysis: {e}")
        return None

if __name__ == '__main__':
    result = analyze_activity_1_detailed()
    
    if result:
        print(f"\n✅ Analysis complete!")
        print(f"📊 Current score: {result['current_score']:.1f}/100")
        print(f"🚀 Potential score: {result['potential_score']:.1f}/100")
        print(f"💡 Improvements needed: {len(result['improvements'])}")
    else:
        print(f"\n❌ Analysis failed")
