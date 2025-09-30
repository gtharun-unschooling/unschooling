#!/usr/bin/env python3
"""
🔍 Validate First 5 Activities
Analyze and rate the first 5 activities in Google Sheets on a 100-point scale
"""

import pandas as pd
import os
from google.oauth2 import service_account
import gspread
from datetime import datetime

def validate_first_5_activities():
    """Validate and rate the first 5 activities in Google Sheets"""
    
    print("🔍 Validating First 5 Activities")
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
        
        # Create metadata lookup
        metadata_lookup = {}
        for _, row in df_metadata.iterrows():
            if row['Column Name'] != 'METADATA INFO':
                metadata_lookup[row['Column Name']] = row
        
        print(f"\n📋 Metadata standards loaded for {len(metadata_lookup)} columns")
        
        # Analyze first 5 activities
        activities_analysis = []
        
        for activity_index in range(1, min(6, len(all_data))):  # First 5 activities (skip header)
            activity_row = all_data[activity_index]
            if not activity_row:
                continue
                
            print(f"\n🎯 Analyzing Activity {activity_index}:")
            print(f"   Activity ID: {activity_row[0] if len(activity_row) > 0 else 'N/A'}")
            print(f"   Topic: {activity_row[8] if len(activity_row) > 8 else 'N/A'}")
            print(f"   Pillar: {activity_row[1] if len(activity_row) > 1 else 'N/A'}")
            print(f"   Age Group: {activity_row[2] if len(activity_row) > 2 else 'N/A'}")
            
            # Score tracking
            total_score = 0
            max_possible_score = 0
            issues = []
            strengths = []
            
            # Analyze each column
            for i, column_name in enumerate(headers):
                if column_name in metadata_lookup and i < len(activity_row):
                    current_value = str(activity_row[i])
                    metadata = metadata_lookup[column_name]
                    
                    # Calculate score for this column
                    column_score = 0
                    column_max_score = 10  # Each column worth 10 points
                    column_issues = []
                    column_strengths = []
                    
                    # Check word limits
                    if pd.notna(metadata['Max Words']) and metadata['Max Words'] != '' and metadata['Max Words'] != 'N/A':
                        try:
                            max_words = int(metadata['Max Words'])
                            word_count = len(current_value.split())
                            if word_count <= max_words:
                                column_score += 2
                                column_strengths.append(f"Word count within limit ({word_count}/{max_words})")
                            else:
                                column_issues.append(f"Exceeds word limit: {word_count} words (max: {max_words})")
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
                                column_strengths.append(f"Item count within limit ({item_count}/{max_items})")
                            else:
                                column_issues.append(f"Exceeds item limit: {item_count} items (max: {max_items})")
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
                                column_strengths.append(f"Step count within limit ({step_count}/{max_steps})")
                            else:
                                column_issues.append(f"Exceeds step limit: {step_count} steps (max: {max_steps})")
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
                                column_strengths.append(f"Skill count within limit ({skill_count}/{max_skills})")
                            else:
                                column_issues.append(f"Exceeds skill limit: {skill_count} skills (max: {max_skills})")
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
                                column_strengths.append(f"Hashtag count within limit ({hashtag_count}/{max_hashtags})")
                            else:
                                column_issues.append(f"Exceeds hashtag limit: {hashtag_count} hashtags (max: {max_hashtags})")
                        except:
                            pass
                    
                    # Check words per step
                    if pd.notna(metadata['Max Words per Step']) and metadata['Max Words per Step'] != '' and metadata['Max Words per Step'] != 'N/A':
                        try:
                            max_words_per_step = int(metadata['Max Words per Step'])
                            if ';' in current_value:
                                steps = [step.strip() for step in current_value.split(';') if step.strip()]
                                all_steps_within_limit = True
                                for j, step in enumerate(steps):
                                    step_word_count = len(step.split())
                                    if step_word_count > max_words_per_step:
                                        all_steps_within_limit = False
                                        column_issues.append(f"Step {j+1} exceeds word limit: {step_word_count} words (max: {max_words_per_step})")
                                if all_steps_within_limit:
                                    column_score += 2
                                    column_strengths.append(f"All steps within word limit")
                        except:
                            pass
                    
                    # Check for predefined options
                    if pd.notna(metadata['Options']) and metadata['Options'] != '' and metadata['Options'] != 'N/A':
                        valid_options = [opt.strip() for opt in metadata['Options'].split(',')]
                        if current_value in valid_options:
                            column_score += 2
                            column_strengths.append(f"Valid option: {current_value}")
                        else:
                            column_issues.append(f"Invalid option: '{current_value}' (valid: {', '.join(valid_options)})")
                    
                    # Check for empty values where required
                    if current_value.strip() == '' or current_value.strip() == 'nan':
                        if 'required' in metadata['Rules'].lower() or 'must' in metadata['Rules'].lower():
                            column_issues.append(f"Empty value where required")
                        else:
                            column_score += 1  # Partial credit for optional empty values
                    else:
                        column_score += 2  # Full credit for non-empty values
                        column_strengths.append("Non-empty value")
                    
                    # Check for internal references in customer-facing columns
                    if metadata['Customer Facing'] == 'Yes':
                        internal_phrases = ['supplied by us', 'our activity kit', 'our step-by-step guide', 'our tracking sheet']
                        has_internal_ref = False
                        for phrase in internal_phrases:
                            if phrase.lower() in current_value.lower():
                                has_internal_ref = True
                                column_issues.append(f"Contains internal reference: '{phrase}' in customer-facing column")
                        if not has_internal_ref:
                            column_score += 2
                            column_strengths.append("No internal references in customer-facing column")
                    
                    # Add to totals
                    total_score += column_score
                    max_possible_score += column_max_score
                    
                    # Store issues and strengths
                    if column_issues:
                        issues.extend([f"{column_name}: {issue}" for issue in column_issues])
                    if column_strengths:
                        strengths.extend([f"{column_name}: {strength}" for strength in column_strengths])
            
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
            
            # Store analysis
            activities_analysis.append({
                'activity_index': activity_index,
                'activity_id': activity_row[0] if len(activity_row) > 0 else 'N/A',
                'topic': activity_row[8] if len(activity_row) > 8 else 'N/A',
                'pillar': activity_row[1] if len(activity_row) > 1 else 'N/A',
                'age_group': activity_row[2] if len(activity_row) > 2 else 'N/A',
                'score': final_score,
                'grade': grade,
                'total_score': total_score,
                'max_possible_score': max_possible_score,
                'issues': issues,
                'strengths': strengths
            })
            
            print(f"   Score: {final_score:.1f}/100 ({grade})")
            print(f"   Issues: {len(issues)}")
            print(f"   Strengths: {len(strengths)}")
        
        # Summary
        print(f"\n📊 Validation Summary:")
        print("=" * 50)
        print(f"   Activities analyzed: {len(activities_analysis)}")
        print(f"   Average score: {sum(a['score'] for a in activities_analysis) / len(activities_analysis):.1f}/100")
        print(f"   Highest score: {max(a['score'] for a in activities_analysis):.1f}/100")
        print(f"   Lowest score: {min(a['score'] for a in activities_analysis):.1f}/100")
        
        # Detailed results
        print(f"\n🎯 Detailed Results:")
        print("=" * 50)
        for analysis in activities_analysis:
            print(f"\n📝 Activity {analysis['activity_index']}: {analysis['topic']}")
            print(f"   ID: {analysis['activity_id']}")
            print(f"   Pillar: {analysis['pillar']}")
            print(f"   Age Group: {analysis['age_group']}")
            print(f"   Score: {analysis['score']:.1f}/100 ({analysis['grade']})")
            print(f"   Breakdown: {analysis['total_score']}/{analysis['max_possible_score']} points")
            
            if analysis['issues']:
                print(f"   🚨 Issues ({len(analysis['issues'])}):")
                for issue in analysis['issues'][:5]:  # Show first 5 issues
                    print(f"      - {issue}")
                if len(analysis['issues']) > 5:
                    print(f"      ... and {len(analysis['issues']) - 5} more")
            
            if analysis['strengths']:
                print(f"   ✅ Strengths ({len(analysis['strengths'])}):")
                for strength in analysis['strengths'][:5]:  # Show first 5 strengths
                    print(f"      - {strength}")
                if len(analysis['strengths']) > 5:
                    print(f"      ... and {len(analysis['strengths']) - 5} more")
        
        # Add scores to Google Sheets
        print(f"\n📝 Adding scores to Google Sheets...")
        
        # Check if scores column already exists
        if 'Validation Score' not in headers:
            # Add new column header
            new_headers = headers + ['Validation Score']
            worksheet.update('A1', [new_headers])
            print("✅ Added 'Validation Score' column header")
        else:
            print("✅ 'Validation Score' column already exists")
        
        # Add scores for each activity
        for analysis in activities_analysis:
            row_num = analysis['activity_index'] + 1  # +1 because row 1 is headers
            score_text = f"{analysis['score']:.1f}/100 ({analysis['grade']})"
            
            # Calculate column position
            score_col_index = len(headers)  # 0-based index
            score_col_letter = chr(65 + score_col_index)  # Convert to letter
            score_cell = f"{score_col_letter}{row_num}"
            
            # Update the score cell
            worksheet.update(score_cell, score_text)
            print(f"✅ Added score for Activity {analysis['activity_index']}: {score_text}")
        
        # Format the scores column
        score_col_letter = chr(65 + len(headers))
        worksheet.format(f"{score_col_letter}1", {
            'backgroundColor': {'red': 0.26, 'green': 0.52, 'blue': 0.96},
            'textFormat': {'foregroundColor': {'red': 1, 'green': 1, 'blue': 1}, 'bold': True}
        })
        
        # Color code the score cells
        for analysis in activities_analysis:
            row_num = analysis['activity_index'] + 1
            score_cell = f"{score_col_letter}{row_num}"
            
            # Color based on score
            if analysis['score'] >= 90:
                # Green for excellent
                worksheet.format(score_cell, {
                    'backgroundColor': {'red': 0.8, 'green': 1.0, 'blue': 0.8}
                })
            elif analysis['score'] >= 70:
                # Yellow for good
                worksheet.format(score_cell, {
                    'backgroundColor': {'red': 1.0, 'green': 1.0, 'blue': 0.8}
                })
            else:
                # Red for needs improvement
                worksheet.format(score_cell, {
                    'backgroundColor': {'red': 1.0, 'green': 0.8, 'blue': 0.8}
                })
        
        print("✅ Formatted scores column")
        
        print(f"\n🎉 Validation Complete!")
        print(f"🔗 URL: {spreadsheet.url}")
        print(f"📋 Scores added to Google Sheets")
        
        return activities_analysis
        
    except Exception as e:
        print(f"❌ Error during validation: {e}")
        return []

if __name__ == '__main__':
    results = validate_first_5_activities()
    
    if results:
        print(f"\n🎯 Validation complete for {len(results)} activities")
        print("📝 Scores added to Google Sheets")
        print(f"📊 Average score: {sum(r['score'] for r in results) / len(results):.1f}/100")
    else:
        print(f"\n❌ Failed to validate activities")
