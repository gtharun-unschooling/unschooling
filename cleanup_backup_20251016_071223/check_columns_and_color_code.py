#!/usr/bin/env python3
"""
🎨 Check Columns and Color Code
Check all columns in Google Sheets and add color coding for customer vs admin columns
"""

import pandas as pd
import os
from google.oauth2 import service_account
import gspread
from datetime import datetime

def check_columns_and_color_code():
    """Check all columns and add color coding"""
    
    print("🎨 Checking Columns and Adding Color Coding")
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
        
        # Get all data to see columns
        all_data = worksheet.get_all_values()
        if not all_data:
            print("❌ No data found in the worksheet")
            return False
        
        # Get headers
        headers = all_data[0]
        print(f"\n📋 Found {len(headers)} columns:")
        for i, header in enumerate(headers, 1):
            print(f"   {i:2d}. {header}")
        
        # Define customer-facing vs admin-facing columns
        customer_columns = [
            "Pillar",
            "Age Group", 
            "Difficulty Level",
            "Activity Type",
            "Category",
            "Category Description",
            "Topic",
            "Activity Name",
            "Objective",
            "Explanation",
            "Age",
            "Estimated Time",
            "Setup Time",
            "Supervision Level",
            "Materials",
            "Steps",
            "Skills",
            "Hashtags"
        ]
        
        admin_columns = [
            "Activity ID",
            "Topic Number",
            "Kit Materials",
            "General Instructions",
            "Last Updated",
            "Feedback",
            "Updated By",
            "Last Synced",
            "Materials at Home",
            "Materials to Buy for Kit",
            "Additional Information"
        ]
        
        print(f"\n🎨 Color Coding Plan:")
        print(f"   🟢 Customer-facing columns: {len(customer_columns)}")
        print(f"   🔴 Admin-facing columns: {len(admin_columns)}")
        
        # Check which columns are missing from our definitions
        all_defined_columns = customer_columns + admin_columns
        missing_columns = [col for col in headers if col not in all_defined_columns]
        
        if missing_columns:
            print(f"\n⚠️ Columns not categorized:")
            for col in missing_columns:
                print(f"   - {col}")
        
        # Apply color coding
        print(f"\n🎨 Applying color coding...")
        
        # Green for customer-facing columns
        customer_colors = []
        for i, header in enumerate(headers):
            if header in customer_columns:
                customer_colors.append(i + 1)  # 1-based indexing
        
        if customer_colors:
            # Format customer-facing columns (green background)
            for col_num in customer_colors:
                col_letter = gspread.utils.col_letter(col_num)
                range_name = f"{col_letter}1:{col_letter}{len(all_data)}"
                worksheet.format(range_name, {
                    'backgroundColor': {'red': 0.8, 'green': 1.0, 'blue': 0.8}  # Light green
                })
            print(f"✅ Applied green color to {len(customer_colors)} customer-facing columns")
        
        # Red for admin-facing columns
        admin_colors = []
        for i, header in enumerate(headers):
            if header in admin_columns:
                admin_colors.append(i + 1)  # 1-based indexing
        
        if admin_colors:
            # Format admin-facing columns (red background)
            for col_num in admin_colors:
                col_letter = gspread.utils.col_letter(col_num)
                range_name = f"{col_letter}1:{col_letter}{len(all_data)}"
                worksheet.format(range_name, {
                    'backgroundColor': {'red': 1.0, 'green': 0.8, 'blue': 0.8}  # Light red
                })
            print(f"✅ Applied red color to {len(admin_colors)} admin-facing columns")
        
        # Format headers with stronger colors
        if customer_colors:
            for col_num in customer_colors:
                col_letter = gspread.utils.col_letter(col_num)
                worksheet.format(f"{col_letter}1", {
                    'backgroundColor': {'red': 0.0, 'green': 0.8, 'blue': 0.0},  # Dark green
                    'textFormat': {'foregroundColor': {'red': 1, 'green': 1, 'blue': 1}, 'bold': True}
                })
        
        if admin_colors:
            for col_num in admin_colors:
                col_letter = gspread.utils.col_letter(col_num)
                worksheet.format(f"{col_letter}1", {
                    'backgroundColor': {'red': 0.8, 'green': 0.0, 'blue': 0.0},  # Dark red
                    'textFormat': {'foregroundColor': {'red': 1, 'green': 1, 'blue': 1}, 'bold': True}
                })
        
        print(f"\n🎉 Color Coding Complete!")
        print(f"🔗 URL: {spreadsheet.url}")
        
        # Show summary
        print(f"\n📊 Color Coding Summary:")
        print(f"   🟢 Customer-facing columns ({len(customer_colors)}):")
        for col_num in customer_colors:
            col_name = headers[col_num - 1]
            print(f"      - {col_name}")
        
        print(f"   🔴 Admin-facing columns ({len(admin_colors)}):")
        for col_num in admin_colors:
            col_name = headers[col_num - 1]
            print(f"      - {col_name}")
        
        if missing_columns:
            print(f"   ⚠️ Uncategorized columns ({len(missing_columns)}):")
            for col in missing_columns:
                print(f"      - {col}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error during color coding: {e}")
        return False

if __name__ == '__main__':
    success = check_columns_and_color_code()
    
    if success:
        print("\n✅ SUCCESS! Color coding applied to Google Sheets!")
        print("🎨 Customer-facing columns: Green")
        print("🎨 Admin-facing columns: Red")
    else:
        print("\n❌ FAILED to apply color coding to Google Sheets.")
