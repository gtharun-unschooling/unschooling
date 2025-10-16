#!/usr/bin/env python3
"""
🔍 Analyze and Improve Materials
Analyze Materials at Home and Materials to Buy for Kit columns
Add numbering and product links
"""

import pandas as pd
import os
from google.oauth2 import service_account
import gspread
from datetime import datetime
import time

def analyze_and_improve_materials():
    """Analyze and improve Materials at Home and Materials to Buy for Kit columns"""
    
    print("🔍 Analyzing and Improving Materials Columns")
    print("=" * 60)
    
    # Configuration
    CREDS_FILE = 'sheets-credentials.json'
    
    # Common household items that parents likely have
    common_household_items = [
        "tray", "container", "bowl", "cup", "spoon", "plate", "towel", "blanket", "pillow",
        "paper", "tissue", "aluminum foil", "plastic bag", "ziplock bag", "tape", "scissors",
        "water", "rice", "beans", "flour", "salt", "food coloring", "soap", "shampoo",
        "mirror", "ball", "book", "toy", "stuffed animal", "clothes", "socks", "hat",
        "chair", "table", "mat", "carpet", "bed", "crib", "high chair", "stroller"
    ]
    
    # Items that typically need to be purchased
    specialized_items = [
        "sensory", "educational", "developmental", "therapeutic", "specialized", "professional",
        "foam blocks", "stacking rings", "texture books", "musical instruments", "art supplies",
        "finger paints", "modeling clay", "play-doh", "puzzles", "games", "toys", "equipment"
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
        
        # Analyze and improve first 20 activities
        print(f"\n🔍 Analyzing and Improving Materials (First 20 Activities):")
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
                    
                    # Categorize materials
                    materials_at_home = []
                    materials_to_buy = []
                    
                    for material in materials_list:
                        material_lower = material.lower()
                        
                        # Check if it's a common household item
                        is_household = any(item in material_lower for item in common_household_items)
                        
                        # Check if it's a specialized item
                        is_specialized = any(item in material_lower for item in specialized_items)
                        
                        if is_household and not is_specialized:
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
        print(f"\n🎉 Materials Analysis and Improvement Complete!")
        print("=" * 60)
        print(f"   Activities Updated: {activities_updated}")
        print(f"   Materials now numbered and categorized")
        
        print(f"\n📝 Improvements Made:")
        print("=" * 30)
        print("   ✅ Added numbering to materials (1, 2, 3, etc.)")
        print("   ✅ Categorized materials into household vs specialized")
        print("   ✅ Added product link placeholders for items to buy")
        print("   ✅ Kept household items in 'Materials at Home'")
        print("   ✅ Moved specialized items to 'Materials to Buy for Kit'")
        
        print(f"\n🔍 Categorization Logic:")
        print("=" * 35)
        print("   Household Items (Materials at Home):")
        print("   - Common items parents likely have")
        print("   - Basic household supplies")
        print("   - Everyday objects")
        print()
        print("   Specialized Items (Materials to Buy):")
        print("   - Educational/sensory materials")
        print("   - Specialized toys/equipment")
        print("   - Items requiring purchase")
        
        print(f"\n🔗 Google Sheets URL: {spreadsheet.url}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error during materials analysis: {e}")
        return False

if __name__ == '__main__':
    result = analyze_and_improve_materials()
    if result:
        print(f"\n✅ SUCCESS! Materials analyzed and improved!")
    else:
        print(f"\n❌ FAILED to analyze and improve materials")
