#!/usr/bin/env python3
"""
🇮🇳 Fix Materials for Indian Homes
Update materials categorization for Indian household context
"""

import pandas as pd
import os
from google.oauth2 import service_account
import gspread
from datetime import datetime
import time

def fix_materials_for_indian_homes():
    """Fix materials categorization for Indian household context"""
    
    print("🇮🇳 Fixing Materials for Indian Homes")
    print("=" * 50)
    
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
        
        # Find Materials columns
        materials_at_home_col = None
        materials_to_buy_col = None
        materials_col = None
        
        for i, header in enumerate(headers):
            if header == "Materials at Home":
                materials_at_home_col = i
            elif header == "Materials to Buy for Kit":
                materials_to_buy_col = i
            elif header == "Materials":
                materials_col = i
        
        if materials_at_home_col is None or materials_to_buy_col is None or materials_col is None:
            print("❌ Materials columns not found")
            return False
        
        print(f"📝 Found Materials at Home column at index {materials_at_home_col}")
        print(f"📝 Found Materials to Buy for Kit column at index {materials_to_buy_col}")
        print(f"📝 Found Materials column at index {materials_col}")
        
        # Fix materials categorization for Indian context
        print(f"\n🇮🇳 Fixing Materials for Indian Homes (First 20 Activities):")
        print("=" * 80)
        
        activities_updated = 0
        
        for row_num in range(2, min(22, len(all_data) + 1)):  # First 20 activities
            if row_num <= len(all_data):
                # Get current materials
                current_materials = all_data[row_num - 1][materials_col] if materials_col < len(all_data[row_num - 1]) else ""
                current_materials_at_home = all_data[row_num - 1][materials_at_home_col] if materials_at_home_col < len(all_data[row_num - 1]) else ""
                current_materials_to_buy = all_data[row_num - 1][materials_to_buy_col] if materials_to_buy_col < len(all_data[row_num - 1]) else ""
                
                if current_materials:
                    print(f"\n   Activity {row_num - 1}:")
                    print(f"      Current Materials: '{current_materials}'")
                    
                    # Split materials by semicolon
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
                        # Add product link placeholder
                        numbered_materials_to_buy.append(f"{i}. {material} [Product Link: TBD]")
                    
                    # Update the columns
                    new_materials_at_home = '; '.join(numbered_materials_at_home) if numbered_materials_at_home else ""
                    new_materials_to_buy = '; '.join(numbered_materials_to_buy) if numbered_materials_to_buy else ""
                    
                    # Update Materials at Home
                    if new_materials_at_home != current_materials_at_home:
                        cell = worksheet.cell(row_num, materials_at_home_col + 1)
                        cell.value = new_materials_at_home
                        worksheet.update_cells([cell])
                        print(f"      ✅ Updated Materials at Home: {new_materials_at_home}")
                    
                    # Update Materials to Buy
                    if new_materials_to_buy != current_materials_to_buy:
                        cell = worksheet.cell(row_num, materials_to_buy_col + 1)
                        cell.value = new_materials_to_buy
                        worksheet.update_cells([cell])
                        print(f"      ✅ Updated Materials to Buy: {new_materials_to_buy}")
                    
                    activities_updated += 1
                    
                    # Wait to avoid rate limits
                    time.sleep(2)
        
        # Summary
        print(f"\n🎉 Materials Fixed for Indian Homes!")
        print("=" * 50)
        print(f"   Activities Updated: {activities_updated}")
        print(f"   Materials now categorized for Indian context")
        
        print(f"\n📝 Changes Made:")
        print("=" * 30)
        print("   ✅ Moved non-Indian items to 'Materials to Buy'")
        print("   ✅ Kept only truly common Indian household items")
        print("   ✅ Updated categorization logic for Indian context")
        
        print(f"\n🇮🇳 Items Moved to 'Materials to Buy' (Not Common in India):")
        print("=" * 60)
        print("   - Ziplock bags")
        print("   - Tissue paper")
        print("   - Aluminum foil")
        print("   - Duct tape")
        print("   - Food coloring")
        print("   - Hair gel")
        print("   - Wet wipes")
        print("   - Smock/apron")
        print("   - Art supplies")
        print("   - Specialized toys")
        
        print(f"\n🏠 Items Kept in 'Materials at Home' (Common in India):")
        print("=" * 55)
        print("   - Steel bowls, plates, spoons")
        print("   - Cotton cloth, towels, blankets")
        print("   - Plastic bowls, plates, cups")
        print("   - Wooden spoons, bowls")
        print("   - Newspaper, old clothes")
        print("   - Basic household items")
        
        print(f"\n🔗 Google Sheets URL: {spreadsheet.url}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error during materials fix: {e}")
        return False

if __name__ == '__main__':
    result = fix_materials_for_indian_homes()
    if result:
        print(f"\n✅ SUCCESS! Materials fixed for Indian homes!")
    else:
        print(f"\n❌ FAILED to fix materials for Indian homes")
