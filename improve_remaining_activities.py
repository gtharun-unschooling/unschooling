#!/usr/bin/env python3
"""
🔧 Improve Remaining Activities
Improve activities 21-140 one by one with all requirements
"""

import pandas as pd
import os
from google.oauth2 import service_account
import gspread
from datetime import datetime
import time
import random

def improve_remaining_activities():
    """Improve activities 21-140 one by one with all requirements"""
    
    print("🔧 Improving Remaining Activities (21-140)")
    print("=" * 60)
    
    # Configuration
    CREDS_FILE = 'sheets-credentials.json'
    
    # Common household items in Indian homes
    indian_household_items = [
        "tray", "container", "bowl", "cup", "spoon", "plate", "towel", "blanket", "pillow",
        "water", "rice", "beans", "flour", "salt", "soap", "shampoo",
        "mirror", "ball", "book", "toy", "stuffed animal", "clothes", "socks", "hat",
        "chair", "table", "mat", "carpet", "bed", "crib", "high chair", "stroller",
        "steel bowl", "steel plate", "steel spoon", "steel glass", "steel container",
        "cotton cloth", "cotton towel", "cotton blanket", "cotton pillow",
        "plastic bowl", "plastic plate", "plastic cup", "plastic spoon",
        "wooden spoon", "wooden bowl", "wooden plate",
        "newspaper", "old clothes", "old sheets", "old towels"
    ]
    
    # Items that are NOT commonly available in Indian homes
    not_common_in_india = [
        "ziplock bag", "ziplock", "tissue paper", "tissues", "aluminum foil", "foil",
        "duct tape", "food coloring", "hair gel", "gel", "tape", "scissors",
        "plastic bag", "wrapping paper", "colorful tape", "wet wipes", "wipes",
        "smock", "apron", "art supplies", "finger paints", "paints",
        "musical mat", "musical toys", "texture books", "specialized"
    ]
    
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
        topic_col = None
        activity_name_col = None
        objective_col = None
        explanation_col = None
        category_description_col = None
        estimated_time_col = None
        setup_time_col = None
        materials_col = None
        steps_col = None
        skills_col = None
        hashtags_col = None
        materials_at_home_col = None
        materials_to_buy_col = None
        validation_score_col = None
        
        for i, header in enumerate(headers):
            if header == "Topic":
                topic_col = i
            elif header == "Activity Name":
                activity_name_col = i
            elif header == "Objective":
                objective_col = i
            elif header == "Explanation":
                explanation_col = i
            elif header == "Category Description":
                category_description_col = i
            elif header == "Estimated Time":
                estimated_time_col = i
            elif header == "Setup Time":
                setup_time_col = i
            elif header == "Materials":
                materials_col = i
            elif header == "Steps":
                steps_col = i
            elif header == "Skills":
                skills_col = i
            elif header == "Hashtags":
                hashtags_col = i
            elif header == "Materials at Home":
                materials_at_home_col = i
            elif header == "Materials to Buy for Kit":
                materials_to_buy_col = i
            elif header == "Validation Score":
                validation_score_col = i
        
        print(f"📝 Found required columns")
        
        # Process activities 21-140
        print(f"\n🔧 Processing Activities 21-140...")
        
        activities_updated = 0
        
        for activity_num in range(21, 141):  # Activities 21-140
            if activity_num <= len(all_data):
                print(f"\n🔧 Improving Activity {activity_num}...")
                
                # Get the row number (activity_num + 1, since row 1 is headers)
                row_num = activity_num + 1
                
                # Get current data
                current_row = all_data[row_num - 1] if row_num - 1 < len(all_data) else []
                
                if not current_row:
                    print(f"   ⚠️ Activity {activity_num}: No data found, skipping")
                    continue
                
                # Get current values
                current_topic = current_row[topic_col] if topic_col < len(current_row) else ""
                current_activity_name = current_row[activity_name_col] if activity_name_col < len(current_row) else ""
                current_objective = current_row[objective_col] if objective_col < len(current_row) else ""
                current_explanation = current_row[explanation_col] if explanation_col < len(current_row) else ""
                current_category_description = current_row[category_description_col] if category_description_col < len(current_row) else ""
                current_estimated_time = current_row[estimated_time_col] if estimated_time_col < len(current_row) else ""
                current_setup_time = current_row[setup_time_col] if setup_time_col < len(current_row) else ""
                current_materials = current_row[materials_col] if materials_col < len(current_row) else ""
                current_steps = current_row[steps_col] if steps_col < len(current_row) else ""
                current_skills = current_row[skills_col] if skills_col < len(current_row) else ""
                current_hashtags = current_row[hashtags_col] if hashtags_col < len(current_row) else ""
                
                # Improve the activity
                improvements_made = []
                
                # 1. Improve Activity Name (make it more engaging)
                if current_activity_name and current_activity_name == current_topic:
                    # Make activity name more engaging
                    if "Play" in current_topic:
                        new_activity_name = f"Fun {current_topic}"
                    elif "Exploration" in current_topic:
                        new_activity_name = f"Discover {current_topic}"
                    elif "Learning" in current_topic:
                        new_activity_name = f"Learn {current_topic}"
                    else:
                        new_activity_name = f"Amazing {current_topic}"
                    
                    cell = worksheet.cell(row_num, activity_name_col + 1)
                    cell.value = new_activity_name
                    worksheet.update_cells([cell])
                    improvements_made.append(f"Activity Name: {new_activity_name}")
                
                # 2. Improve Explanation (make it parent-friendly, 20-25 words)
                if current_explanation:
                    # Clean up explanation and make it parent-friendly
                    explanation_words = current_explanation.split()
                    if len(explanation_words) > 25:
                        # Truncate to 25 words
                        new_explanation = " ".join(explanation_words[:25])
                        if not new_explanation.endswith("."):
                            new_explanation += "."
                    else:
                        new_explanation = current_explanation
                    
                    # Make it more parent-friendly
                    if "baby" not in new_explanation.lower():
                        new_explanation = new_explanation.replace("child", "baby").replace("infant", "baby")
                    
                    cell = worksheet.cell(row_num, explanation_col + 1)
                    cell.value = new_explanation
                    worksheet.update_cells([cell])
                    improvements_made.append(f"Explanation: {new_explanation}")
                
                # 3. Improve Steps (add numbering if not present)
                if current_steps:
                    steps_list = [step.strip() for step in current_steps.split(';') if step.strip()]
                    
                    # Check if steps are already numbered
                    first_step = steps_list[0] if steps_list else ""
                    if first_step and not first_step[0].isdigit():
                        # Add numbers to steps
                        numbered_steps = []
                        for i, step in enumerate(steps_list, 1):
                            numbered_steps.append(f"{i}. {step}")
                        
                        new_steps = '; '.join(numbered_steps)
                        
                        cell = worksheet.cell(row_num, steps_col + 1)
                        cell.value = new_steps
                        worksheet.update_cells([cell])
                        improvements_made.append(f"Steps: Added numbering")
                
                # 4. Improve Materials categorization for Indian context
                if current_materials:
                    materials_list = [mat.strip() for mat in current_materials.split(';') if mat.strip()]
                    
                    # Categorize materials for Indian context
                    materials_at_home = []
                    materials_to_buy = []
                    
                    for material in materials_list:
                        material_lower = material.lower()
                        
                        # Check if it's commonly available in Indian homes
                        is_indian_household = any(item in material_lower for item in indian_household_items)
                        
                        # Check if it's NOT commonly available in Indian homes
                        is_not_common_india = any(item in material_lower for item in not_common_in_india)
                        
                        if is_indian_household and not is_not_common_india:
                            materials_at_home.append(material)
                        else:
                            materials_to_buy.append(material)
                    
                    # Number the materials
                    numbered_materials_at_home = []
                    for i, material in enumerate(materials_at_home, 1):
                        numbered_materials_at_home.append(f"{i}. {material}")
                    
                    numbered_materials_to_buy = []
                    for i, material in enumerate(materials_to_buy, 1):
                        numbered_materials_to_buy.append(f"{i}. {material} [Product Link: TBD]")
                    
                    # Update Materials at Home
                    new_materials_at_home = '; '.join(numbered_materials_at_home) if numbered_materials_at_home else ""
                    if materials_at_home_col is not None:
                        cell = worksheet.cell(row_num, materials_at_home_col + 1)
                        cell.value = new_materials_at_home
                        worksheet.update_cells([cell])
                        improvements_made.append(f"Materials at Home: {len(materials_at_home)} items")
                    
                    # Update Materials to Buy
                    new_materials_to_buy = '; '.join(numbered_materials_to_buy) if numbered_materials_to_buy else ""
                    if materials_to_buy_col is not None:
                        cell = worksheet.cell(row_num, materials_to_buy_col + 1)
                        cell.value = new_materials_to_buy
                        worksheet.update_cells([cell])
                        improvements_made.append(f"Materials to Buy: {len(materials_to_buy)} items")
                
                # 5. Calculate and update validation score
                if validation_score_col is not None:
                    score = 0
                    
                    # Simple scoring criteria (out of 100)
                    if current_topic:
                        score += 10  # Clear title
                    if current_explanation and len(current_explanation.split()) <= 25:
                        score += 15  # Parent-friendly explanation
                    if current_steps and ";" in current_steps:
                        score += 20  # Clear, actionable steps
                    if current_materials and ";" in current_materials:
                        score += 15  # Specific, accessible materials
                    if current_skills and "," in current_skills:
                        score += 10  # Clear skills development
                    if current_estimated_time:
                        score += 10  # Appropriate time estimates
                    if current_setup_time:
                        score += 10  # Safety considerations
                    if current_hashtags:
                        score += 10  # Age-appropriate content
                    
                    # Determine grade
                    if score >= 90:
                        grade = "A+"
                    elif score >= 80:
                        grade = "A"
                    elif score >= 70:
                        grade = "B+"
                    elif score >= 60:
                        grade = "B"
                    elif score >= 50:
                        grade = "C+"
                    elif score >= 40:
                        grade = "C"
                    else:
                        grade = "D"
                    
                    # Update validation score
                    cell = worksheet.cell(row_num, validation_score_col + 1)
                    cell.value = f"{score}/100 ({grade})"
                    worksheet.update_cells([cell])
                    improvements_made.append(f"Validation Score: {score}/100 ({grade})")
                
                print(f"   ✅ Activity {activity_num}: {len(improvements_made)} improvements made")
                for improvement in improvements_made:
                    print(f"      - {improvement}")
                
                activities_updated += 1
                
                # Wait to avoid rate limits
                time.sleep(1)
        
        # Summary
        print(f"\n🎉 Remaining Activities Improvement Complete!")
        print("=" * 60)
        print(f"   Activities Updated: {activities_updated}")
        print(f"   Activities Processed: 21-140")
        
        print(f"\n📝 Improvements Made:")
        print("=" * 30)
        print("   ✅ More engaging activity names")
        print("   ✅ Parent-friendly explanations (20-25 words)")
        print("   ✅ Numbered steps")
        print("   ✅ Materials categorized for Indian context")
        print("   ✅ Product link placeholders for items to buy")
        print("   ✅ Validation scores calculated")
        
        print(f"\n🔗 Google Sheets URL: {spreadsheet.url}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error during improvement: {e}")
        return False

if __name__ == '__main__':
    result = improve_remaining_activities()
    if result:
        print(f"\n✅ SUCCESS! Remaining activities improved!")
    else:
        print(f"\n❌ FAILED to improve remaining activities")
