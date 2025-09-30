#!/usr/bin/env python3
"""
🇮🇳 Update Metadata Fixed
Update metadata sheet to reflect Indian household context (fixed version)
"""

import pandas as pd
import os
from google.oauth2 import service_account
import gspread
from datetime import datetime
import time

def update_metadata_fixed():
    """Update metadata sheet to reflect Indian household context (fixed version)"""
    
    print("🇮🇳 Updating Metadata for Indian Context (Fixed)")
    print("=" * 60)
    
    # Configuration
    CREDS_FILE = 'sheets-credentials.json'
    
    # Updated metadata for Indian context
    updated_metadata = {
        "Materials at Home": {
            "Column": "Materials at Home",
            "Purpose": "Items commonly available in Indian households",
            "Format": "Numbered list (1. Item; 2. Item; etc.)",
            "Word Limit": "Maximum 50 words",
            "Content": "Only items that are easily available in typical Indian homes",
            "Examples": "Steel bowls, cotton cloth, plastic cups, wooden spoons, newspaper, old clothes",
            "Customer Facing": "Yes",
            "Admin Facing": "No",
            "Notes": "Focus on items that Indian parents can find at home without purchasing"
        },
        "Materials to Buy for Kit": {
            "Column": "Materials to Buy for Kit",
            "Purpose": "Items that need to be purchased for the activity kit",
            "Format": "Numbered list with product links (1. Item [Product Link: TBD]; 2. Item [Product Link: TBD]; etc.)",
            "Word Limit": "Maximum 100 words",
            "Content": "Items not commonly available in Indian households or specialized educational materials",
            "Examples": "Ziplock bags, tissue paper, aluminum foil, duct tape, food coloring, specialized toys",
            "Customer Facing": "Yes",
            "Admin Facing": "No",
            "Notes": "Include product links for easy purchasing. Focus on items Indian parents need to buy."
        }
    }
    
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
        
        # Check if metadata sheet exists, if not create it
        try:
            metadata_worksheet = spreadsheet.worksheet("Metadata")
            print("✅ Found existing Metadata sheet")
        except:
            print("📝 Creating new Metadata sheet")
            metadata_worksheet = spreadsheet.add_worksheet(title="Metadata", rows=100, cols=10)
        
        # Get all data from metadata sheet
        all_data = metadata_worksheet.get_all_values()
        
        # Get headers
        headers = all_data[0] if all_data else []
        print(f"📋 Found {len(headers)} columns in Metadata sheet")
        
        # Update metadata for Materials columns
        print(f"\n🇮🇳 Updating Metadata for Indian Context...")
        
        # Find or create columns for Materials metadata
        column_col = None
        purpose_col = None
        format_col = None
        word_limit_col = None
        content_col = None
        examples_col = None
        customer_facing_col = None
        admin_facing_col = None
        notes_col = None
        
        for i, header in enumerate(headers):
            if header == "Column":
                column_col = i
            elif header == "Purpose":
                purpose_col = i
            elif header == "Format":
                format_col = i
            elif header == "Word Limit":
                word_limit_col = i
            elif header == "Content":
                content_col = i
            elif header == "Examples":
                examples_col = i
            elif header == "Customer Facing":
                customer_facing_col = i
            elif header == "Admin Facing":
                admin_facing_col = i
            elif header == "Notes":
                notes_col = i
        
        # If metadata sheet is empty, create headers
        if not headers:
            headers = ["Column", "Purpose", "Format", "Word Limit", "Content", "Examples", "Customer Facing", "Admin Facing", "Notes"]
            metadata_worksheet.update('A1', [headers])
            print("✅ Created metadata headers")
            
            # Set column indices
            column_col = 0
            purpose_col = 1
            format_col = 2
            word_limit_col = 3
            content_col = 4
            examples_col = 5
            customer_facing_col = 6
            admin_facing_col = 7
            notes_col = 8
        
        # Update Materials at Home metadata
        print(f"\n📝 Updating Materials at Home metadata...")
        
        # Find row for Materials at Home
        materials_at_home_row = None
        for i, row in enumerate(all_data):
            if len(row) > column_col and row[column_col] == "Materials at Home":
                materials_at_home_row = i + 1
                break
        
        if materials_at_home_row is None:
            # Add new row for Materials at Home
            materials_at_home_row = len(all_data) + 1
            print(f"   📝 Adding new row for Materials at Home at row {materials_at_home_row}")
        else:
            print(f"   📝 Updating existing row for Materials at Home at row {materials_at_home_row}")
        
        # Update Materials at Home metadata
        materials_at_home_data = updated_metadata["Materials at Home"]
        row_data = [
            materials_at_home_data["Column"],
            materials_at_home_data["Purpose"],
            materials_at_home_data["Format"],
            materials_at_home_data["Word Limit"],
            materials_at_home_data["Content"],
            materials_at_home_data["Examples"],
            materials_at_home_data["Customer Facing"],
            materials_at_home_data["Admin Facing"],
            materials_at_home_data["Notes"]
        ]
        
        # Update the row
        range_name = f"A{materials_at_home_row}:I{materials_at_home_row}"
        metadata_worksheet.update(range_name, [row_data])
        print(f"   ✅ Updated Materials at Home metadata")
        
        # Update Materials to Buy for Kit metadata
        print(f"\n📝 Updating Materials to Buy for Kit metadata...")
        
        # Find row for Materials to Buy for Kit
        materials_to_buy_row = None
        for i, row in enumerate(all_data):
            if len(row) > column_col and row[column_col] == "Materials to Buy for Kit":
                materials_to_buy_row = i + 1
                break
        
        if materials_to_buy_row is None:
            # Add new row for Materials to Buy for Kit
            materials_to_buy_row = len(all_data) + 2
            print(f"   📝 Adding new row for Materials to Buy for Kit at row {materials_to_buy_row}")
        else:
            print(f"   📝 Updating existing row for Materials to Buy for Kit at row {materials_to_buy_row}")
        
        # Update Materials to Buy for Kit metadata
        materials_to_buy_data = updated_metadata["Materials to Buy for Kit"]
        row_data = [
            materials_to_buy_data["Column"],
            materials_to_buy_data["Purpose"],
            materials_to_buy_data["Format"],
            materials_to_buy_data["Word Limit"],
            materials_to_buy_data["Content"],
            materials_to_buy_data["Examples"],
            materials_to_buy_data["Customer Facing"],
            materials_to_buy_data["Admin Facing"],
            materials_to_buy_data["Notes"]
        ]
        
        # Update the row
        range_name = f"A{materials_to_buy_row}:I{materials_to_buy_row}"
        metadata_worksheet.update(range_name, [row_data])
        print(f"   ✅ Updated Materials to Buy for Kit metadata")
        
        # Summary
        print(f"\n🎉 Metadata Updated for Indian Context!")
        print("=" * 50)
        print(f"   Metadata sheet updated with Indian household context")
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
        
        print(f"\n🔗 Google Sheets URL: {spreadsheet.url}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error during metadata update: {e}")
        return False

if __name__ == '__main__':
    result = update_metadata_fixed()
    if result:
        print(f"\n✅ SUCCESS! Metadata updated for Indian context!")
    else:
        print(f"\n❌ FAILED to update metadata for Indian context")
