#!/usr/bin/env python3
"""
Color Code Google Sheets Columns
Green = Customer/Parent Visible
Red = Internal/Company Only  
Yellow = Mixed/Conditional
"""

import gspread
from gspread_formatting import *
import json

def color_code_essential_growth_sheet():
    """Apply color coding to Essential Growth Activities sheet"""
    
    print("🎨 Applying color coding to Google Sheets...")
    
    try:
        # Authenticate with service account
        gc = gspread.service_account(filename='google-sheets-service-account.json')
        sheet = gc.open_by_key('14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ')
        worksheet = sheet.worksheet('Essential Growth Activities')
        
        print("✅ Connected to Google Sheets")
        
        # Define color schemes
        GREEN = Color(0.2, 0.8, 0.2)  # Customer/Parent Visible
        RED = Color(0.8, 0.2, 0.2)    # Internal/Company Only
        YELLOW = Color(1.0, 0.8, 0.2) # Mixed/Conditional
        
        # Define column classifications
        column_colors = {
            # 🟢 GREEN = Customer/Parent Visible
            'Activity Name': GREEN,
            'Objective': GREEN,
            'Explanation': GREEN,
            'Estimated Time': GREEN,
            'Materials': GREEN,
            'Steps': GREEN,
            'Skills': GREEN,
            'Age Group': GREEN,
            'Difficulty Level': GREEN,
            'Activity Type': GREEN,
            'Hashtags': GREEN,
            
            # 🔴 RED = Internal/Company Only
            'Activity ID': RED,
            'Topic Number': RED,
            'Setup Time': RED,
            'Supervision Level': RED,
            'Kit Materials': RED,
            'Materials at Home': RED,
            'Materials to Buy for Kit': RED,
            'Last Updated': RED,
            'Updated By': RED,
            'Last Synced': RED,
            'Feedback': RED,
            'Corrections Needed': RED,
            'Validation Score': RED,
            
            # 🟡 YELLOW = Mixed/Conditional
            'Category': YELLOW,
            'Category Description': YELLOW,
            'General Instructions': YELLOW,
            'Additional Information': YELLOW,
            'Pillar': YELLOW,  # Could be useful for filtering
        }
        
        # Get all column headers (row 1)
        headers = worksheet.row_values(1)
        print(f"📊 Found {len(headers)} columns to color code")
        
        # Apply colors to each column header
        for col_index, header in enumerate(headers, 1):
            if header in column_colors:
                color = column_colors[header]
                
                # Format the header cell (row 1, column col_index)
                cell_range = f'{chr(64 + col_index)}1:{chr(64 + col_index)}1'
                
                if color == GREEN:
                    format_cell_range(worksheet, cell_range, CellFormat(
                        backgroundColor=GREEN,
                        textFormat=TextFormat(bold=True, foregroundColor=Color(1, 1, 1))
                    ))
                    color_name = "🟢 Customer"
                elif color == RED:
                    format_cell_range(worksheet, cell_range, CellFormat(
                        backgroundColor=RED,
                        textFormat=TextFormat(bold=True, foregroundColor=Color(1, 1, 1))
                    ))
                    color_name = "🔴 Internal"
                else:  # YELLOW
                    format_cell_range(worksheet, cell_range, CellFormat(
                        backgroundColor=YELLOW,
                        textFormat=TextFormat(bold=True, foregroundColor=Color(0, 0, 0))
                    ))
                    color_name = "🟡 Mixed"
                
                print(f"   {color_name}: {header} (Column {col_index})")
        
        # Create a legend sheet
        create_legend_sheet(sheet)
        
        print("✅ Color coding applied successfully!")
        print("\n📋 Legend:")
        print("🟢 GREEN = Customer/Parent Visible")
        print("🔴 RED = Internal/Company Only")
        print("🟡 YELLOW = Mixed/Conditional")
        
    except Exception as e:
        print(f"❌ Error: {e}")

def create_legend_sheet(sheet):
    """Create a legend sheet explaining the color coding"""
    
    try:
        # Try to get existing legend sheet, or create new one
        try:
            legend_sheet = sheet.worksheet('Color Legend')
            legend_sheet.clear()
        except:
            legend_sheet = sheet.add_worksheet(title='Color Legend', rows=20, cols=3)
        
        # Add legend content
        legend_data = [
            ['COLOR CODING LEGEND', '', ''],
            ['', '', ''],
            ['🟢 GREEN', 'Customer/Parent Visible', 'What parents and children see'],
            ['Activity Name', '', 'Name of the activity'],
            ['Objective', '', 'What the child will learn'],
            ['Explanation', '', 'How to do the activity'],
            ['Estimated Time', '', 'How long it takes'],
            ['Materials', '', 'What materials are needed'],
            ['Steps', '', 'Step-by-step instructions'],
            ['Skills', '', 'Skills the child develops'],
            ['Age Group', '', 'Target age range'],
            ['Difficulty Level', '', 'How hard the activity is'],
            ['Activity Type', '', 'Type of activity'],
            ['Hashtags', '', 'Tags for categorization'],
            ['', '', ''],
            ['🔴 RED', 'Internal/Company Only', 'What only your team sees'],
            ['Activity ID', '', 'Internal identifier'],
            ['Topic Number', '', 'Internal sequencing'],
            ['Setup Time', '', 'Internal planning time'],
            ['Supervision Level', '', 'Internal guidance level'],
            ['Kit Materials', '', 'Internal kit management'],
            ['Materials at Home', '', 'Internal planning'],
            ['Materials to Buy for Kit', '', 'Internal procurement'],
            ['Last Updated', '', 'Internal tracking'],
            ['Updated By', '', 'Internal accountability'],
            ['Last Synced', '', 'Internal sync tracking'],
            ['Feedback', '', 'Internal quality control'],
            ['Corrections Needed', '', 'Internal improvement'],
            ['Validation Score', '', 'Internal quality metrics'],
            ['', '', ''],
            ['🟡 YELLOW', 'Mixed/Conditional', 'Context-dependent visibility'],
            ['Category', '', 'Could be public for filtering'],
            ['Category Description', '', 'Could be public for context'],
            ['General Instructions', '', 'Could be public for safety'],
            ['Additional Information', '', 'Depends on content'],
            ['Pillar', '', 'Could be useful for filtering'],
        ]
        
        # Update the legend sheet
        legend_sheet.update('A1:C40', legend_data)
        
        # Format the legend
        format_cell_range(legend_sheet, 'A1:C1', {
            'backgroundColor': Color(0.3, 0.3, 0.3),
            'textFormat': {'bold': True, 'foregroundColor': Color(1, 1, 1)}
        })
        
        format_cell_range(legend_sheet, 'A3:A3', {'backgroundColor': GREEN})
        format_cell_range(legend_sheet, 'A16:A16', {'backgroundColor': RED})
        format_cell_range(legend_sheet, 'A30:A30', {'backgroundColor': YELLOW})
        
        print("✅ Color legend created!")
        
    except Exception as e:
        print(f"⚠️ Could not create legend: {e}")

def show_column_classification():
    """Show the column classification for reference"""
    
    print("\n📊 COLUMN CLASSIFICATION:")
    print("=" * 50)
    
    green_columns = [
        'Activity Name', 'Objective', 'Explanation', 'Estimated Time',
        'Materials', 'Steps', 'Skills', 'Age Group', 'Difficulty Level',
        'Activity Type', 'Hashtags'
    ]
    
    red_columns = [
        'Activity ID', 'Topic Number', 'Setup Time', 'Supervision Level',
        'Kit Materials', 'Materials at Home', 'Materials to Buy for Kit',
        'Last Updated', 'Updated By', 'Last Synced', 'Feedback',
        'Corrections Needed', 'Validation Score'
    ]
    
    yellow_columns = [
        'Category', 'Category Description', 'General Instructions',
        'Additional Information', 'Pillar'
    ]
    
    print("🟢 CUSTOMER/PARENT VISIBLE:")
    for col in green_columns:
        print(f"   • {col}")
    
    print("\n🔴 INTERNAL/COMPANY ONLY:")
    for col in red_columns:
        print(f"   • {col}")
    
    print("\n🟡 MIXED/CONDITIONAL:")
    for col in yellow_columns:
        print(f"   • {col}")

if __name__ == "__main__":
    print("🎨 Google Sheets Color Coding Tool")
    print("=" * 40)
    
    # Show classification first
    show_column_classification()
    
    # Apply color coding
    color_code_essential_growth_sheet()
    
    print("\n✅ Color coding complete!")
    print("📋 Check your Google Sheets to see the color-coded columns!")
