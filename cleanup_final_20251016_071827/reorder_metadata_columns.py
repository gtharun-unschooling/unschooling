#!/usr/bin/env python3
"""
Reorder Metadata Sheet Columns
Move Examples to 3rd position (before Format)
"""

import gspread
from gspread_formatting import *
import json

def reorder_metadata_columns():
    """Reorder columns to put Examples as 3rd column"""
    
    print("🔧 Reordering metadata columns...")
    
    try:
        # Authenticate with service account
        gc = gspread.service_account(filename='google-sheets-service-account.json')
        sheet = gc.open_by_key('14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ')
        metadata_worksheet = sheet.worksheet('Metadata')
        
        print("✅ Connected to Google Sheets")
        
        # New column order: Examples becomes 3rd column
        new_column_order = [
            'Column Name',           # 1
            'Purpose',              # 2
            'Examples',             # 3 (moved here)
            'Format',               # 4 (moved down)
            'Character Limit',      # 5
            'Requirements',         # 6
            'Validation Rules',     # 7 (moved down)
            'Age Considerations',   # 8
            'Pillar-Specific Notes', # 9
            'Data Type',            # 10
            'Mandatory',            # 11
            'Default Value',        # 12
            'Source',               # 13
            'Update Frequency',     # 14
            'Quality Standards'     # 15
        ]
        
        # Define the reordered metadata structure
        metadata_data = [
            # Header row (new order)
            new_column_order,
            
            # 🟢 GREEN = Customer/Parent Visible
            ['Activity Name', 'Display name of the activity for parents and children', 'Baby\'s First Texture Discovery', 'Free text', '100 chars max', 'Must be descriptive and engaging', 'No special characters, descriptive', 'Age-appropriate language', 'Keep simple for all pillars', 'Text', 'Yes', '', 'Manual entry', 'As needed', 'Must be clear and engaging'],
            ['Objective', 'What the child will learn or achieve', 'Introduce baby to different textures and develop sensory awareness', 'Free text', '200 chars max', 'Clear learning outcome', 'Must be educational goal', 'Age-appropriate objectives', 'Align with pillar goals', 'Text', 'Yes', '', 'Manual entry', 'As needed', 'Must be measurable'],
            ['Explanation', 'How to conduct the activity', 'Create a safe exploration space with various textures...', 'Free text', '500 chars max', 'Step-by-step guidance', 'Must be clear and actionable', 'Age-appropriate instructions', 'Pillar-specific methodology', 'Text', 'Yes', '', 'Manual entry', 'As needed', 'Must be detailed and clear'],
            ['Estimated Time', 'How long the activity takes', '10-15 minutes', 'Time format', '20 chars max', 'Realistic time estimate', 'Format: X-Y minutes', 'Age-appropriate duration', 'Consider attention span', 'Text', 'Yes', '', 'Manual entry', 'As needed', 'Must be realistic'],
            ['Materials', 'What materials are needed (at home)', 'Soft fabric squares; Smooth wooden blocks', 'Semicolon separated', '300 chars max', 'Common household items', 'Separate with semicolons', 'Age-safe materials', 'Pillar-appropriate materials', 'Text', 'Yes', '', 'Manual entry', 'As needed', 'Must be accessible'],
            ['Steps', 'Step-by-step instructions', '1. Choose when baby is calm and alert; 2. Place different textures...', 'Numbered list', '1000 chars max', 'Clear numbered steps', 'Number each step', 'Age-appropriate complexity', 'Pillar-specific approach', 'Text', 'Yes', '', 'Manual entry', 'As needed', 'Must be sequential and clear'],
            ['Skills', 'Skills the child develops', 'Sensory awareness, Tactile exploration', 'Comma separated', '200 chars max', 'Educational skills', 'Separate with commas', 'Age-appropriate skills', 'Pillar-specific skills', 'Text', 'Yes', '', 'Manual entry', 'As needed', 'Must be educational'],
            ['Age Group', 'Target age range', 'Infant (0-1)', 'Age range format', '20 chars max', 'Accurate age targeting', 'Format: Age Group (range)', 'Must match pillar age groups', 'Pillar-specific age ranges', 'Text', 'Yes', '', 'Manual entry', 'As needed', 'Must be accurate'],
            ['Difficulty Level', 'How hard the activity is', 'Beginner', 'Fixed values', '15 chars max', 'Standard difficulty levels', 'Values: Beginner, Intermediate, Advanced', 'Age-appropriate difficulty', 'Pillar-specific complexity', 'Text', 'Yes', 'Beginner', 'Manual entry', 'As needed', 'Must be consistent'],
            ['Activity Type', 'Type of activity', 'Sensory', 'Fixed values', '20 chars max', 'Standard activity types', 'Values: Sensory, Physical, Cognitive, Creative', 'Age-appropriate types', 'Pillar-specific types', 'Text', 'Yes', '', 'Manual entry', 'As needed', 'Must be categorized'],
            ['Hashtags', 'Tags for categorization and search', '#SensoryPlay, #InfantActivities', 'Hash separated', '100 chars max', 'Relevant tags', 'Start with #', 'Age-relevant tags', 'Pillar-specific tags', 'Text', 'No', '', 'Manual entry', 'As needed', 'Must be searchable'],
            ['Category', 'Activity category within pillar (for filtering and organization)', 'Sensory Exploration', 'Free text', '50 chars max', 'Logical categorization', 'Must be consistent within pillar', 'Age-appropriate categories', 'Pillar-specific categories', 'Text', 'Yes', '', 'Manual entry', 'As needed', 'Must be consistent'],
            ['Category Description', 'Description of the category (for context and understanding)', 'Activities focusing on developing tactile awareness...', 'Free text', '200 chars max', 'Category context', 'Explain the category purpose', 'Age-appropriate descriptions', 'Pillar-specific context', 'Text', 'No', '', 'Manual entry', 'As needed', 'Must be descriptive'],
            ['Pillar', 'Essential growth pillar (for navigation and filtering)', 'Play & Creativity', 'Fixed values', '30 chars max', 'Standard pillar names', 'Values: Play & Creativity, Cognitive Skills, etc.', 'Age-appropriate pillars', 'Must match pillar definitions', 'Text', 'Yes', '', 'Manual entry', 'Rarely', 'Must be accurate'],
            
            # 🔴 RED = Internal/Company Only
            ['Activity ID', 'Unique identifier for each activity', 'play-creativity-infant-0-1-sensory-exploration-1', 'pillar-age-group-category-number', '50 chars max', 'Must be unique across all pillars', 'No duplicates, lowercase with hyphens', 'Include age range in ID format', 'Different pillars have different prefixes', 'Text', 'Yes', 'Auto-generated', 'System generated', 'Never', 'Must be unique across all 18 pillars'],
            ['Topic Number', 'Sequential number within category', '1', 'Integer', '3 digits max', 'Sequential numbering', 'Must be unique within category', 'Age-appropriate sequencing', 'Pillar-specific numbering', 'Number', 'Yes', 'Auto-generated', 'System generated', 'Never', 'Must be sequential'],
            ['Setup Time', 'Time needed to prepare activity', '5 minutes', 'Time format', '20 chars max', 'Realistic setup estimate', 'Format: X minutes', 'Age-appropriate setup', 'Pillar-specific requirements', 'Text', 'Yes', '', 'Manual entry', 'As needed', 'Must be accurate'],
            ['Supervision Level', 'Level of adult supervision needed', 'High', 'Fixed values', '15 chars max', 'Safety guidance', 'Values: High, Medium, Low', 'Age-appropriate supervision', 'Pillar-specific safety needs', 'Text', 'Yes', '', 'Manual entry', 'As needed', 'Must prioritize safety'],
            ['Kit Materials', 'Materials provided in activity kit', 'Activity kit (supplied by us); Step-by-step guide', 'Semicolon separated', '300 chars max', 'Kit inventory', 'Separate with semicolons', 'Age-safe kit items', 'Pillar-specific kit contents', 'Text', 'No', '', 'Manual entry', 'As needed', 'Must be complete'],
            ['Materials at Home', 'What parents need to provide', '1. Shallow tray', 'Numbered list', '200 chars max', 'Home requirements', 'Number each item', 'Age-appropriate home items', 'Pillar-specific needs', 'Text', 'No', '', 'Manual entry', 'As needed', 'Must be accessible'],
            ['Materials to Buy for Kit', 'Materials to purchase for kit', '1. Soft fabric squares [Product Link: TBD]', 'Numbered list', '300 chars max', 'Procurement list', 'Include product links', 'Age-appropriate purchases', 'Pillar-specific procurement', 'Text', 'No', '', 'Manual entry', 'As needed', 'Must include product links'],
            ['Last Updated', 'When the activity was last modified', '2025-09-27', 'YYYY-MM-DD', '10 chars max', 'Automatic timestamp', 'Format: YYYY-MM-DD', 'Age-appropriate updates', 'Pillar-specific revisions', 'Date', 'Yes', 'Auto-generated', 'System generated', 'Automatic', 'Must be current'],
            ['Updated By', 'Who last modified the activity', 'Tharun', 'Name', '50 chars max', 'User accountability', 'Full name or username', 'Age-appropriate edits', 'Pillar-specific expertise', 'Text', 'Yes', 'Auto-generated', 'System generated', 'Automatic', 'Must be tracked'],
            ['Last Synced', 'When last synced to database', '2025-09-27 11:12:02', 'YYYY-MM-DD HH:MM:SS', '19 chars max', 'Sync tracking', 'Format: YYYY-MM-DD HH:MM:SS', 'Age-appropriate sync', 'Pillar-specific sync', 'Timestamp', 'Yes', 'Auto-generated', 'System generated', 'Automatic', 'Must be synchronized'],
            ['Feedback', 'Quality feedback and notes', 'Great activity, needs more materials', 'Free text', '500 chars max', 'Quality control', 'Optional feedback', 'Age-appropriate feedback', 'Pillar-specific improvements', 'Text', 'No', '', 'Manual entry', 'As needed', 'Must be constructive'],
            ['Corrections Needed', 'What needs to be fixed', 'Update materials list', 'Free text', '300 chars max', 'Improvement tracking', 'Optional corrections', 'Age-appropriate corrections', 'Pillar-specific fixes', 'Text', 'No', '', 'Manual entry', 'As needed', 'Must be actionable'],
            ['Validation Score', 'Quality score out of 100', '100/100 (A+)', 'X/100 format', '10 chars max', 'Quality metrics', 'Format: X/100 (Grade)', 'Age-appropriate scoring', 'Pillar-specific quality', 'Text', 'Yes', 'Auto-generated', 'System generated', 'Automatic', 'Must be accurate'],
            
            # 🟡 YELLOW = Mixed/Conditional
            ['General Instructions', 'General safety and guidance', 'Supervise closely during texture tray adventure', 'Free text', '300 chars max', 'Safety information', 'Safety and general guidance', 'Age-appropriate safety', 'Pillar-specific guidance', 'Text', 'No', '', 'Manual entry', 'As needed', 'Must prioritize safety'],
            ['Additional Information', 'Extra context or notes', 'Perfect for rainy days', 'Free text', '200 chars max', 'Optional context', 'Additional helpful information', 'Age-appropriate extras', 'Pillar-specific notes', 'Text', 'No', '', 'Manual entry', 'As needed', 'Must be helpful'],
        ]
        
        # Clear existing data and update with reordered structure
        metadata_worksheet.clear()
        metadata_worksheet.update('A1:O40', metadata_data)
        
        # Apply formatting to header row
        format_cell_range(metadata_worksheet, 'A1:O1', CellFormat(
            backgroundColor=Color(0.2, 0.4, 0.8),  # Blue header
            textFormat=TextFormat(bold=True, foregroundColor=Color(1, 1, 1))
        ))
        
        # Apply color coding to rows
        apply_visibility_colors(metadata_worksheet)
        
        print("✅ Column order updated successfully!")
        print("📊 Examples is now the 3rd column (before Format)")
        
    except Exception as e:
        print(f"❌ Error: {e}")

def apply_visibility_colors(metadata_worksheet):
    """Apply color coding to show visibility"""
    
    try:
        records = metadata_worksheet.get_all_records()
        
        for i, record in enumerate(records, 2):  # Start from row 2 (skip header)
            if record['Column Name'] in ['Activity Name', 'Objective', 'Explanation', 'Estimated Time', 
                                          'Materials', 'Steps', 'Skills', 'Age Group', 'Difficulty Level', 
                                          'Activity Type', 'Hashtags', 'Category', 'Category Description', 'Pillar']:
                # Apply light green background for Customer Visible
                format_cell_range(metadata_worksheet, f'A{i}:O{i}', CellFormat(
                    backgroundColor=Color(0.8, 1.0, 0.8)  # Light green
                ))
            elif record['Column Name'] in ['Activity ID', 'Topic Number', 'Setup Time', 'Supervision Level',
                                          'Kit Materials', 'Materials at Home', 'Materials to Buy for Kit',
                                          'Last Updated', 'Updated By', 'Last Synced', 'Feedback',
                                          'Corrections Needed', 'Validation Score']:
                # Apply light red background for Internal Only
                format_cell_range(metadata_worksheet, f'A{i}:O{i}', CellFormat(
                    backgroundColor=Color(1.0, 0.8, 0.8)  # Light red
                ))
            elif record['Column Name'] in ['General Instructions', 'Additional Information']:
                # Apply light yellow background for Conditional
                format_cell_range(metadata_worksheet, f'A{i}:O{i}', CellFormat(
                    backgroundColor=Color(1.0, 1.0, 0.8)  # Light yellow
                ))
        
        print("🎨 Applied color coding to show visibility")
        
    except Exception as e:
        print(f"⚠️ Could not apply colors: {e}")

if __name__ == "__main__":
    print("🔧 Reorder Metadata Columns Tool")
    print("=" * 35)
    
    reorder_metadata_columns()
    
    print("\n✅ Column order updated!")
    print("📊 New order: Column Name | Purpose | Examples | Format | ...")
