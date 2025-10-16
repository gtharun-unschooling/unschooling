#!/usr/bin/env python3
"""
Update Metadata Sheet Visibility
Change Category, Category Description, and Pillar to Customer Visible (Green)
"""

import gspread
from gspread_formatting import *
import json

def update_metadata_visibility():
    """Update specific columns to be Customer Visible"""
    
    print("🔧 Updating metadata visibility for Category, Category Description, and Pillar...")
    
    try:
        # Authenticate with service account
        gc = gspread.service_account(filename='google-sheets-service-account.json')
        sheet = gc.open_by_key('14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ')
        metadata_worksheet = sheet.worksheet('Metadata')
        
        print("✅ Connected to Google Sheets")
        
        # Get all records
        records = metadata_worksheet.get_all_records()
        
        # Find and update the specific columns
        columns_to_update = ['Category', 'Category Description', 'Pillar']
        
        for record in records:
            if record['Column Name'] in columns_to_update:
                # Find the row number for this record
                row_num = None
                for i, row_data in enumerate(metadata_worksheet.get_all_values()[1:], 2):  # Skip header row
                    if row_data[0] == record['Column Name']:  # Column Name is first column
                        row_num = i
                        break
                
                if row_num:
                    # Update the Purpose to reflect Customer Visible
                    if record['Column Name'] == 'Category':
                        new_purpose = 'Activity category within pillar (for filtering and organization)'
                    elif record['Column Name'] == 'Category Description':
                        new_purpose = 'Description of the category (for context and understanding)'
                    elif record['Column Name'] == 'Pillar':
                        new_purpose = 'Essential growth pillar (for navigation and filtering)'
                    
                    # Update the row
                    metadata_worksheet.update_cell(row_num, 2, new_purpose)  # Purpose column
                    metadata_worksheet.update_cell(row_num, 8, 'Customer Visible')  # Age Considerations (we'll use this for visibility)
                    
                    print(f"   ✅ Updated: {record['Column Name']} → Customer Visible")
        
        # Apply color coding to show the changes
        apply_visibility_colors(metadata_worksheet)
        
        print("✅ Visibility updated successfully!")
        print("🟢 Category, Category Description, and Pillar are now Customer Visible")
        
    except Exception as e:
        print(f"❌ Error: {e}")

def apply_visibility_colors(metadata_worksheet):
    """Apply color coding to show visibility"""
    
    try:
        records = metadata_worksheet.get_all_records()
        
        for i, record in enumerate(records, 2):  # Start from row 2 (skip header)
            # Check if this is one of the updated columns
            if record['Column Name'] in ['Category', 'Category Description', 'Pillar']:
                # Apply light green background
                format_cell_range(metadata_worksheet, f'A{i}:O{i}', CellFormat(
                    backgroundColor=Color(0.8, 1.0, 0.8)  # Light green for Customer Visible
                ))
            elif record['Column Name'] in ['Activity Name', 'Objective', 'Explanation', 'Estimated Time', 
                                          'Materials', 'Steps', 'Skills', 'Age Group', 'Difficulty Level', 
                                          'Activity Type', 'Hashtags']:
                # Keep existing green for other customer visible columns
                format_cell_range(metadata_worksheet, f'A{i}:O{i}', CellFormat(
                    backgroundColor=Color(0.8, 1.0, 0.8)  # Light green
                ))
            elif record['Column Name'] in ['Activity ID', 'Topic Number', 'Setup Time', 'Supervision Level',
                                          'Kit Materials', 'Materials at Home', 'Materials to Buy for Kit',
                                          'Last Updated', 'Updated By', 'Last Synced', 'Feedback',
                                          'Corrections Needed', 'Validation Score']:
                # Apply light red for internal columns
                format_cell_range(metadata_worksheet, f'A{i}:O{i}', CellFormat(
                    backgroundColor=Color(1.0, 0.8, 0.8)  # Light red for Internal Only
                ))
            elif record['Column Name'] in ['General Instructions', 'Additional Information']:
                # Apply light yellow for mixed columns
                format_cell_range(metadata_worksheet, f'A{i}:O{i}', CellFormat(
                    backgroundColor=Color(1.0, 1.0, 0.8)  # Light yellow for Conditional
                ))
        
        print("🎨 Applied color coding to show visibility changes")
        
    except Exception as e:
        print(f"⚠️ Could not apply colors: {e}")

if __name__ == "__main__":
    print("🔧 Update Metadata Visibility Tool")
    print("=" * 35)
    
    update_metadata_visibility()
    
    print("\n✅ Metadata visibility updated!")
    print("🟢 Category, Category Description, and Pillar are now Customer Visible!")
