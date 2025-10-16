#!/usr/bin/env python3
"""
🇮🇳 Update Materials Metadata for Indian Context
Update the Materials columns metadata to reflect Indian household context
"""

import pandas as pd
import os
from google.oauth2 import service_account
import gspread
from datetime import datetime
import time

def update_materials_metadata_indian():
    """Update the Materials columns metadata to reflect Indian household context"""
    
    print("🇮🇳 Updating Materials Metadata for Indian Context")
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
        
        # Get metadata worksheet
        metadata_worksheet = spreadsheet.worksheet("Metadata")
        print("✅ Found Metadata sheet")
        
        # Get all data from metadata sheet
        all_data = metadata_worksheet.get_all_values()
        
        # Update Materials at Home metadata (Row 29)
        print(f"\n📝 Updating Materials at Home metadata (Row 29)...")
        
        materials_at_home_row = 29
        materials_at_home_data = [
            "Materials at Home",
            "Items commonly available in Indian households",
            "Numbered list (1. Item; 2. Item; etc.)",
            "1. Item; 2. Item; etc.",
            "1. Steel bowl; 2. Cotton cloth; 3. Plastic cup",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "🟢 Customer (Green)",
            "Yes",
            "Must contain only items commonly available in Indian households; Use numbered format; Focus on items Indian parents can find at home without purchasing; Examples: steel bowls, cotton cloth, plastic cups, wooden spoons, newspaper, old clothes; No ziplock bags, tissue paper, aluminum foil, duct tape, food coloring; Maximum 6 items",
            "Indian household context, easily available items only"
        ]
        
        # Update the row
        range_name = f"A{materials_at_home_row}:P{materials_at_home_row}"
        metadata_worksheet.update(range_name, [materials_at_home_data])
        print(f"   ✅ Updated Materials at Home metadata")
        
        # Update Materials to Buy for Kit metadata (Row 30)
        print(f"\n📝 Updating Materials to Buy for Kit metadata (Row 30)...")
        
        materials_to_buy_row = 30
        materials_to_buy_data = [
            "Materials to Buy for Kit",
            "Items that need to be purchased for the activity kit",
            "Numbered list with product links (1. Item [Product Link: TBD]; 2. Item [Product Link: TBD]; etc.)",
            "1. Item [Product Link: TBD]; 2. Item [Product Link: TBD]; etc.",
            "1. Ziplock bags [Product Link: TBD]; 2. Food coloring [Product Link: TBD]",
            "",
            "",
            "",
            "",
            "",
            "",
            "",
            "🟢 Customer (Green)",
            "Yes",
            "Must contain items not commonly available in Indian households or specialized educational materials; Use numbered format with product links; Include [Product Link: TBD] for each item; Focus on items Indian parents need to buy; Examples: ziplock bags, tissue paper, aluminum foil, duct tape, food coloring, specialized toys; Maximum 6 items",
            "Items to purchase, product links required, Indian context"
        ]
        
        # Update the row
        range_name = f"A{materials_to_buy_row}:P{materials_to_buy_row}"
        metadata_worksheet.update(range_name, [materials_to_buy_data])
        print(f"   ✅ Updated Materials to Buy for Kit metadata")
        
        # Summary
        print(f"\n🎉 Materials Metadata Updated for Indian Context!")
        print("=" * 60)
        print(f"   Metadata updated to reflect Indian household context")
        print(f"   Clear distinction between household items and items to buy")
        
        print(f"\n📝 Updated Metadata:")
        print("=" * 30)
        print("   ✅ Materials at Home: Indian household items only")
        print("   ✅ Materials to Buy for Kit: Items not available in Indian homes")
        print("   ✅ Clear examples and guidelines")
        print("   ✅ Product link requirements for items to buy")
        
        print(f"\n🇮🇳 Key Changes:")
        print("=" * 20)
        print("   - Focus on Indian household context")
        print("   - Clear distinction between home vs buy items")
        print("   - Examples specific to Indian homes")
        print("   - Product link requirements for purchased items")
        print("   - Specific items mentioned (steel bowls, cotton cloth, etc.)")
        print("   - Items to avoid (ziplock bags, tissue paper, etc.)")
        
        print(f"\n🔗 Google Sheets URL: {spreadsheet.url}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error during metadata update: {e}")
        return False

if __name__ == '__main__':
    result = update_materials_metadata_indian()
    if result:
        print(f"\n✅ SUCCESS! Materials metadata updated for Indian context!")
    else:
        print(f"\n❌ FAILED to update materials metadata for Indian context")
