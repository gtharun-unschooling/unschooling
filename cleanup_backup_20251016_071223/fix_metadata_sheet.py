#!/usr/bin/env python3
"""
Fix Metadata Sheet with Proper Column Names and Descriptions
Add color coding information to metadata
"""

import gspread
from gspread_formatting import *
import json

def fix_metadata_sheet():
    """Update the Metadata sheet with proper column information"""
    
    print("🔧 Fixing Metadata Sheet with proper column descriptions...")
    
    try:
        # Authenticate with service account
        gc = gspread.service_account(filename='google-sheets-service-account.json')
        sheet = gc.open_by_key('14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ')
        metadata_worksheet = sheet.worksheet('Metadata')
        
        print("✅ Connected to Google Sheets")
        
        # Define the proper metadata structure
        metadata_data = [
            # Header row
            ['Column Name', 'Purpose', 'Visibility', 'Data Type', 'Format', 'Character Limit', 'Requirements', 'Examples', 'Validation Rules'],
            
            # 🟢 GREEN = Customer/Parent Visible
            ['Activity Name', 'Display name of the activity for parents and children', 'Customer Visible', 'Text', 'Free text', '100 chars max', 'Must be descriptive and engaging', 'Baby\'s First Texture Discovery', 'No special characters, descriptive'],
            ['Objective', 'What the child will learn or achieve', 'Customer Visible', 'Text', 'Free text', '200 chars max', 'Clear learning outcome', 'Introduce baby to different textures and develop sensory awareness', 'Must be educational goal'],
            ['Explanation', 'How to conduct the activity', 'Customer Visible', 'Text', 'Free text', '500 chars max', 'Step-by-step guidance', 'Create a safe exploration space with various textures...', 'Must be clear and actionable'],
            ['Estimated Time', 'How long the activity takes', 'Customer Visible', 'Text', 'Time format', '20 chars max', 'Realistic time estimate', '10-15 minutes', 'Format: X-Y minutes'],
            ['Materials', 'What materials are needed (at home)', 'Customer Visible', 'Text', 'Semicolon separated', '300 chars max', 'Common household items', 'Soft fabric squares; Smooth wooden blocks', 'Separate with semicolons'],
            ['Steps', 'Step-by-step instructions', 'Customer Visible', 'Text', 'Numbered list', '1000 chars max', 'Clear numbered steps', '1. Choose when baby is calm and alert; 2. Place different textures...', 'Number each step'],
            ['Skills', 'Skills the child develops', 'Customer Visible', 'Text', 'Comma separated', '200 chars max', 'Educational skills', 'Sensory awareness, Tactile exploration', 'Separate with commas'],
            ['Age Group', 'Target age range', 'Customer Visible', 'Text', 'Age range format', '20 chars max', 'Accurate age targeting', 'Infant (0-1)', 'Format: Age Group (range)'],
            ['Difficulty Level', 'How hard the activity is', 'Customer Visible', 'Text', 'Fixed values', '15 chars max', 'Standard difficulty levels', 'Beginner', 'Values: Beginner, Intermediate, Advanced'],
            ['Activity Type', 'Type of activity', 'Customer Visible', 'Text', 'Fixed values', '20 chars max', 'Standard activity types', 'Sensory', 'Values: Sensory, Physical, Cognitive, Creative'],
            ['Hashtags', 'Tags for categorization and search', 'Customer Visible', 'Text', 'Hash separated', '100 chars max', 'Relevant tags', '#SensoryPlay, #InfantActivities', 'Start with #'],
            
            # 🔴 RED = Internal/Company Only
            ['Activity ID', 'Unique identifier for each activity', 'Internal Only', 'Text', 'pillar-age-group-category-number', '50 chars max', 'Must be unique across all pillars', 'play-creativity-infant-0-1-sensory-exploration-1', 'No duplicates, lowercase with hyphens'],
            ['Topic Number', 'Sequential number within category', 'Internal Only', 'Number', 'Integer', '3 digits max', 'Sequential numbering', '1', 'Must be unique within category'],
            ['Setup Time', 'Time needed to prepare activity', 'Internal Only', 'Text', 'Time format', '20 chars max', 'Realistic setup estimate', '5 minutes', 'Format: X minutes'],
            ['Supervision Level', 'Level of adult supervision needed', 'Internal Only', 'Text', 'Fixed values', '15 chars max', 'Safety guidance', 'High', 'Values: High, Medium, Low'],
            ['Kit Materials', 'Materials provided in activity kit', 'Internal Only', 'Text', 'Semicolon separated', '300 chars max', 'Kit inventory', 'Activity kit (supplied by us); Step-by-step guide', 'Separate with semicolons'],
            ['Materials at Home', 'What parents need to provide', 'Internal Only', 'Text', 'Numbered list', '200 chars max', 'Home requirements', '1. Shallow tray', 'Number each item'],
            ['Materials to Buy for Kit', 'Materials to purchase for kit', 'Internal Only', 'Text', 'Numbered list', '300 chars max', 'Procurement list', '1. Soft fabric squares [Product Link: TBD]', 'Include product links'],
            ['Last Updated', 'When the activity was last modified', 'Internal Only', 'Date', 'YYYY-MM-DD', '10 chars max', 'Automatic timestamp', '2025-09-27', 'Format: YYYY-MM-DD'],
            ['Updated By', 'Who last modified the activity', 'Internal Only', 'Text', 'Name', '50 chars max', 'User accountability', 'Tharun', 'Full name or username'],
            ['Last Synced', 'When last synced to database', 'Internal Only', 'Timestamp', 'YYYY-MM-DD HH:MM:SS', '19 chars max', 'Sync tracking', '2025-09-27 11:12:02', 'Format: YYYY-MM-DD HH:MM:SS'],
            ['Feedback', 'Quality feedback and notes', 'Internal Only', 'Text', 'Free text', '500 chars max', 'Quality control', 'Great activity, needs more materials', 'Optional feedback'],
            ['Corrections Needed', 'What needs to be fixed', 'Internal Only', 'Text', 'Free text', '300 chars max', 'Improvement tracking', 'Update materials list', 'Optional corrections'],
            ['Validation Score', 'Quality score out of 100', 'Internal Only', 'Number', 'X/100 format', '10 chars max', 'Quality metrics', '100/100 (A+)', 'Format: X/100 (Grade)'],
            
            # 🟡 YELLOW = Mixed/Conditional
            ['Category', 'Activity category within pillar', 'Conditional', 'Text', 'Free text', '50 chars max', 'Logical categorization', 'Sensory Exploration', 'Must be consistent within pillar'],
            ['Category Description', 'Description of the category', 'Conditional', 'Text', 'Free text', '200 chars max', 'Category context', 'Activities focusing on developing tactile awareness...', 'Explain the category purpose'],
            ['General Instructions', 'General safety and guidance', 'Conditional', 'Text', 'Free text', '300 chars max', 'Safety information', 'Supervise closely during texture tray adventure', 'Safety and general guidance'],
            ['Additional Information', 'Extra context or notes', 'Conditional', 'Text', 'Free text', '200 chars max', 'Optional context', 'Perfect for rainy days', 'Additional helpful information'],
            ['Pillar', 'Essential growth pillar', 'Conditional', 'Text', 'Fixed values', '30 chars max', 'Standard pillar names', 'Play & Creativity', 'Values: Play & Creativity, Cognitive Skills, etc.'],
        ]
        
        # Clear existing data and update with new structure
        metadata_worksheet.clear()
        metadata_worksheet.update('A1:I40', metadata_data)
        
        # Apply formatting to header row
        format_cell_range(metadata_worksheet, 'A1:I1', CellFormat(
            backgroundColor=Color(0.2, 0.4, 0.8),  # Blue header
            textFormat=TextFormat(bold=True, foregroundColor=Color(1, 1, 1))
        ))
        
        # Apply color coding to visibility column
        for row in range(2, len(metadata_data) + 1):
            visibility = metadata_worksheet.cell(row, 3).value
            if visibility == 'Customer Visible':
                format_cell_range(metadata_worksheet, f'A{row}:I{row}', CellFormat(
                    backgroundColor=Color(0.8, 1.0, 0.8)  # Light green
                ))
            elif visibility == 'Internal Only':
                format_cell_range(metadata_worksheet, f'A{row}:I{row}', CellFormat(
                    backgroundColor=Color(1.0, 0.8, 0.8)  # Light red
                ))
            elif visibility == 'Conditional':
                format_cell_range(metadata_worksheet, f'A{row}:I{row}', CellFormat(
                    backgroundColor=Color(1.0, 1.0, 0.8)  # Light yellow
                ))
        
        print("✅ Metadata sheet updated successfully!")
        print("📊 Added proper column descriptions with visibility indicators")
        print("🎨 Applied color coding to show Customer/Internal/Conditional columns")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    print("🔧 Fix Metadata Sheet Tool")
    print("=" * 30)
    
    fix_metadata_sheet()
    
    print("\n✅ Metadata sheet fixed!")
    print("📋 Now you can review the column descriptions and make corrections!")
