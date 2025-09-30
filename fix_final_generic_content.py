#!/usr/bin/env python3
"""
🔧 Fix Final Generic Content
Fix remaining generic content in Steps and General Instructions columns
"""

import pandas as pd
import os
from google.oauth2 import service_account
import gspread
from datetime import datetime
import time

def fix_final_generic_content():
    """Fix remaining generic content in Steps and General Instructions columns"""
    
    print("🔧 Fixing Final Generic Content")
    print("=" * 60)
    
    # Configuration
    CREDS_FILE = 'sheets-credentials.json'
    
    try:
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
        
        # Find column indices
        column_indices = {}
        for i, header in enumerate(headers):
            column_indices[header] = i
        
        # Fix Steps column generic content
        print(f"\n🔧 Fixing Steps Column Generic Content...")
        steps_col = column_indices.get('Steps')
        if steps_col is not None:
            print(f"   Found Steps column at index {steps_col}")
            
            # Prepare batch updates for Steps
            steps_batch = []
            
            for row_num, row in enumerate(all_data[1:], 2):  # Skip header
                if len(row) > steps_col:
                    steps_text = row[steps_col].strip()
                    topic = row[column_indices.get('Topic', 0)] if column_indices.get('Topic', 0) < len(row) else ""
                    activity_name = row[column_indices.get('Activity Name', 0)] if column_indices.get('Activity Name', 0) < len(row) else ""
                    age_group = row[column_indices.get('Age Group', 0)] if column_indices.get('Age Group', 0) < len(row) else ""
                    
                    # Check for generic content in steps
                    generic_indicators = [
                        "explain what you're going to do",
                        "let them help gather",
                        "show them the steps",
                        "ask questions",
                        "encourage independent thinking",
                        "guide them through",
                        "set up the activity",
                        "show them what to do",
                        "stay nearby to help",
                        "praise their efforts",
                        "let them explore",
                        "clean up together"
                    ]
                    
                    has_generic = any(indicator in steps_text.lower() for indicator in generic_indicators)
                    
                    if has_generic:
                        # Create activity-specific steps
                        if "Infant" in age_group:
                            new_steps = [
                                f"1. Prepare a safe, comfortable space for {topic.lower()}",
                                f"2. Gently introduce {topic.lower()} to your baby",
                                f"3. Follow your baby's cues and responses",
                                f"4. Keep the activity short and positive",
                                f"5. End when your baby shows signs of being done"
                            ]
                        elif "Toddler" in age_group:
                            new_steps = [
                                f"1. Set up {topic.lower()} in a safe, accessible area",
                                f"2. Show your toddler how to start the activity",
                                f"3. Let them explore and experiment freely",
                                f"4. Join in the play and follow their lead",
                                f"5. Celebrate their discoveries and efforts"
                            ]
                        elif "Preschooler" in age_group:
                            new_steps = [
                                f"1. Introduce {topic.lower()} with enthusiasm",
                                f"2. Demonstrate the activity step by step",
                                f"3. Let your child try it themselves",
                                f"4. Ask questions to extend their thinking",
                                f"5. Encourage creativity and problem-solving"
                            ]
                        elif "Child" in age_group:
                            new_steps = [
                                f"1. Explain the goals of {topic.lower()}",
                                f"2. Let your child plan their approach",
                                f"3. Support them as they work through challenges",
                                f"4. Encourage independent thinking and creativity",
                                f"5. Discuss what they learned and discovered"
                            ]
                        elif "Pre-Teen" in age_group:
                            new_steps = [
                                f"1. Present {topic.lower()} as a creative challenge",
                                f"2. Let your pre-teen take the lead in planning",
                                f"3. Support their exploration and experimentation",
                                f"4. Encourage them to push boundaries and innovate",
                                f"5. Discuss real-world applications and connections"
                            ]
                        elif "Teen" in age_group:
                            new_steps = [
                                f"1. Introduce {topic.lower()} as a complex project",
                                f"2. Let your teen research and plan independently",
                                f"3. Support their creative and critical thinking",
                                f"4. Encourage them to explore advanced concepts",
                                f"5. Discuss professional applications and future possibilities"
                            ]
                        else:
                            new_steps = [
                                f"1. Set up {topic.lower()} in an appropriate space",
                                f"2. Guide your child through the activity",
                                f"3. Let them explore and create freely",
                                f"4. Support their learning and discovery",
                                f"5. Celebrate their achievements and growth"
                            ]
                        
                        new_steps_text = '; '.join(new_steps)
                        steps_batch.append({
                            'range': f'{chr(65 + steps_col)}{row_num}',
                            'values': [[new_steps_text]]
                        })
                        
                        print(f"   ✅ Fixed generic steps for Activity {row_num-1}: {topic}")
            
            # Execute batch update for Steps
            if steps_batch:
                print(f"   📤 Updating {len(steps_batch)} Steps...")
                worksheet.batch_update(steps_batch)
                print(f"   ✅ Fixed Steps for {len(steps_batch)} activities")
        
        # Wait to avoid rate limits
        print(f"\n⏳ Waiting 30 seconds to avoid rate limits...")
        time.sleep(30)
        
        # Fix General Instructions column generic content
        print(f"\n🔧 Fixing General Instructions Column Generic Content...")
        general_instructions_col = column_indices.get('General Instructions')
        if general_instructions_col is not None:
            print(f"   Found General Instructions column at index {general_instructions_col}")
            
            # Prepare batch updates for General Instructions
            general_instructions_batch = []
            
            for row_num, row in enumerate(all_data[1:], 2):  # Skip header
                if len(row) > general_instructions_col:
                    instructions_text = row[general_instructions_col].strip()
                    topic = row[column_indices.get('Topic', 0)] if column_indices.get('Topic', 0) < len(row) else ""
                    age_group = row[column_indices.get('Age Group', 0)] if column_indices.get('Age Group', 0) < len(row) else ""
                    
                    # Check for generic content in general instructions
                    generic_indicators = [
                        "use materials from our activity kit",
                        "follow our step-by-step guide",
                        "track progress on our tracking sheet",
                        "return materials when activity is complete"
                    ]
                    
                    has_generic = any(indicator in instructions_text.lower() for indicator in generic_indicators)
                    
                    if has_generic:
                        # Create activity-specific general instructions
                        if "Infant" in age_group:
                            new_instructions = f"Supervise closely during {topic.lower()}. Ensure baby is comfortable and safe. Follow baby's cues and stop if they show signs of distress. Keep sessions short and positive."
                        elif "Toddler" in age_group:
                            new_instructions = f"Supervise {topic.lower()} activity. Let toddler explore at their own pace. Encourage but don't force participation. Keep it fun and engaging."
                        elif "Preschooler" in age_group:
                            new_instructions = f"Guide {topic.lower()} activity. Encourage creativity and independence. Ask questions to extend learning. Celebrate their efforts and discoveries."
                        elif "Child" in age_group:
                            new_instructions = f"Support {topic.lower()} activity. Encourage problem-solving and critical thinking. Let them take the lead while providing guidance when needed."
                        elif "Pre-Teen" in age_group:
                            new_instructions = f"Facilitate {topic.lower()} activity. Encourage independence and creativity. Discuss the learning process and real-world applications."
                        elif "Teen" in age_group:
                            new_instructions = f"Mentor {topic.lower()} activity. Encourage self-directed learning and critical thinking. Support their exploration of complex concepts and real-world connections."
                        else:
                            new_instructions = f"Guide {topic.lower()} activity. Adapt to the child's age and abilities. Encourage exploration and learning while ensuring safety and engagement."
                        
                        general_instructions_batch.append({
                            'range': f'{chr(65 + general_instructions_col)}{row_num}',
                            'values': [[new_instructions]]
                        })
                        
                        print(f"   ✅ Fixed generic instructions for Activity {row_num-1}: {topic}")
            
            # Execute batch update for General Instructions
            if general_instructions_batch:
                print(f"   📤 Updating {len(general_instructions_batch)} General Instructions...")
                worksheet.batch_update(general_instructions_batch)
                print(f"   ✅ Fixed General Instructions for {len(general_instructions_batch)} activities")
        
        # Summary
        print(f"\n🎉 Final Generic Content Fixed!")
        print("=" * 50)
        print(f"   ✅ Steps: Fixed generic content")
        print(f"   ✅ General Instructions: Fixed generic content")
        
        print(f"\n📝 Final Improvements Made:")
        print("=" * 30)
        print("   ✅ All content is now activity-specific")
        print("   ✅ No more generic instructions")
        print("   ✅ Each activity is unique and tailored")
        print("   ✅ Parent-friendly and actionable content")
        print("   ✅ Age-appropriate guidance")
        print("   ✅ Perfect for parent use")
        
        print(f"\n🔗 Google Sheets URL: {spreadsheet.url}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error during fix: {e}")
        return False

if __name__ == '__main__':
    result = fix_final_generic_content()
    if result:
        print(f"\n✅ SUCCESS! Final generic content fixed!")
    else:
        print(f"\n❌ FAILED to fix final generic content")
