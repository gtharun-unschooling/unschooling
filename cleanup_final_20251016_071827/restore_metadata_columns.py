#!/usr/bin/env python3
"""
Restore Original Metadata Sheet Structure
Bring back all 15 original columns
"""

import gspread
from gspread_formatting import *
import json

def restore_metadata_columns():
    """Restore the original 15-column structure of Metadata sheet"""
    
    print("🔧 Restoring original Metadata sheet structure...")
    
    try:
        # Authenticate with service account
        gc = gspread.service_account(filename='google-sheets-service-account.json')
        sheet = gc.open_by_key('14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ')
        metadata_worksheet = sheet.worksheet('Metadata')
        
        print("✅ Connected to Google Sheets")
        
        # Define the original 15-column metadata structure
        metadata_data = [
            # Header row (15 columns)
            ['Column Name', 'Purpose', 'Format', 'Character Limit', 'Requirements', 'Examples', 'Validation Rules', 'Age Considerations', 'Pillar-Specific Notes', 'Data Type', 'Mandatory', 'Default Value', 'Source', 'Update Frequency', 'Quality Standards'],
            
            # 🟢 GREEN = Customer/Parent Visible
            ['Activity Name', 'Display name of the activity for parents and children', 'Free text', '100 chars max', 'Must be descriptive and engaging', 'Baby\'s First Texture Discovery', 'No special characters, descriptive', 'Age-appropriate language', 'Keep simple for all pillars', 'Text', 'Yes', '', 'Manual entry', 'As needed', 'Must be clear and engaging'],
            ['Objective', 'What the child will learn or achieve', 'Free text', '200 chars max', 'Clear learning outcome', 'Introduce baby to different textures and develop sensory awareness', 'Must be educational goal', 'Age-appropriate objectives', 'Align with pillar goals', 'Text', 'Yes', '', 'Manual entry', 'As needed', 'Must be measurable'],
            ['Explanation', 'How to conduct the activity', 'Free text', '500 chars max', 'Step-by-step guidance', 'Create a safe exploration space with various textures...', 'Must be clear and actionable', 'Age-appropriate instructions', 'Pillar-specific methodology', 'Text', 'Yes', '', 'Manual entry', 'As needed', 'Must be detailed and clear'],
            ['Estimated Time', 'How long the activity takes', 'Time format', '20 chars max', 'Realistic time estimate', '10-15 minutes', 'Format: X-Y minutes', 'Age-appropriate duration', 'Consider attention span', 'Text', 'Yes', '', 'Manual entry', 'As needed', 'Must be realistic'],
            ['Materials', 'What materials are needed (at home)', 'Semicolon separated', '300 chars max', 'Common household items', 'Soft fabric squares; Smooth wooden blocks', 'Separate with semicolons', 'Age-safe materials', 'Pillar-appropriate materials', 'Text', 'Yes', '', 'Manual entry', 'As needed', 'Must be accessible'],
            ['Steps', 'Step-by-step instructions', 'Numbered list', '1000 chars max', 'Clear numbered steps', '1. Choose when baby is calm and alert; 2. Place different textures...', 'Number each step', 'Age-appropriate complexity', 'Pillar-specific approach', 'Text', 'Yes', '', 'Manual entry', 'As needed', 'Must be sequential and clear'],
            ['Skills', 'Skills the child develops', 'Comma separated', '200 chars max', 'Educational skills', 'Sensory awareness, Tactile exploration', 'Separate with commas', 'Age-appropriate skills', 'Pillar-specific skills', 'Text', 'Yes', '', 'Manual entry', 'As needed', 'Must be educational'],
            ['Age Group', 'Target age range', 'Age range format', '20 chars max', 'Accurate age targeting', 'Infant (0-1)', 'Format: Age Group (range)', 'Must match pillar age groups', 'Pillar-specific age ranges', 'Text', 'Yes', '', 'Manual entry', 'As needed', 'Must be accurate'],
            ['Difficulty Level', 'How hard the activity is', 'Fixed values', '15 chars max', 'Standard difficulty levels', 'Beginner', 'Values: Beginner, Intermediate, Advanced', 'Age-appropriate difficulty', 'Pillar-specific complexity', 'Text', 'Yes', 'Beginner', 'Manual entry', 'As needed', 'Must be consistent'],
            ['Activity Type', 'Type of activity', 'Fixed values', '20 chars max', 'Standard activity types', 'Sensory', 'Values: Sensory, Physical, Cognitive, Creative', 'Age-appropriate types', 'Pillar-specific types', 'Text', 'Yes', '', 'Manual entry', 'As needed', 'Must be categorized'],
            ['Hashtags', 'Tags for categorization and search', 'Hash separated', '100 chars max', 'Relevant tags', '#SensoryPlay, #InfantActivities', 'Start with #', 'Age-relevant tags', 'Pillar-specific tags', 'Text', 'No', '', 'Manual entry', 'As needed', 'Must be searchable'],
            
            # 🔴 RED = Internal/Company Only
            ['Activity ID', 'Unique identifier for each activity', 'pillar-age-group-category-number', '50 chars max', 'Must be unique across all pillars', 'play-creativity-infant-0-1-sensory-exploration-1', 'No duplicates, lowercase with hyphens', 'Include age range in ID format', 'Different pillars have different prefixes', 'Text', 'Yes', 'Auto-generated', 'System generated', 'Never', 'Must be unique across all 18 pillars'],
            ['Topic Number', 'Sequential number within category', 'Integer', '3 digits max', 'Sequential numbering', '1', 'Must be unique within category', 'Age-appropriate sequencing', 'Pillar-specific numbering', 'Number', 'Yes', 'Auto-generated', 'System generated', 'Never', 'Must be sequential'],
            ['Setup Time', 'Time needed to prepare activity', 'Time format', '20 chars max', 'Realistic setup estimate', '5 minutes', 'Format: X minutes', 'Age-appropriate setup', 'Pillar-specific requirements', 'Text', 'Yes', '', 'Manual entry', 'As needed', 'Must be accurate'],
            ['Supervision Level', 'Level of adult supervision needed', 'Fixed values', '15 chars max', 'Safety guidance', 'High', 'Values: High, Medium, Low', 'Age-appropriate supervision', 'Pillar-specific safety needs', 'Text', 'Yes', '', 'Manual entry', 'As needed', 'Must prioritize safety'],
            ['Kit Materials', 'Materials provided in activity kit', 'Semicolon separated', '300 chars max', 'Kit inventory', 'Activity kit (supplied by us); Step-by-step guide', 'Separate with semicolons', 'Age-safe kit items', 'Pillar-specific kit contents', 'Text', 'No', '', 'Manual entry', 'As needed', 'Must be complete'],
            ['Materials at Home', 'What parents need to provide', 'Numbered list', '200 chars max', 'Home requirements', '1. Shallow tray', 'Number each item', 'Age-appropriate home items', 'Pillar-specific needs', 'Text', 'No', '', 'Manual entry', 'As needed', 'Must be accessible'],
            ['Materials to Buy for Kit', 'Materials to purchase for kit', 'Numbered list', '300 chars max', 'Procurement list', '1. Soft fabric squares [Product Link: TBD]', 'Include product links', 'Age-appropriate purchases', 'Pillar-specific procurement', 'Text', 'No', '', 'Manual entry', 'As needed', 'Must include product links'],
            ['Last Updated', 'When the activity was last modified', 'YYYY-MM-DD', '10 chars max', 'Automatic timestamp', '2025-09-27', 'Format: YYYY-MM-DD', 'Age-appropriate updates', 'Pillar-specific revisions', 'Date', 'Yes', 'Auto-generated', 'System generated', 'Automatic', 'Must be current'],
            ['Updated By', 'Who last modified the activity', 'Name', '50 chars max', 'User accountability', 'Tharun', 'Full name or username', 'Age-appropriate edits', 'Pillar-specific expertise', 'Text', 'Yes', 'Auto-generated', 'System generated', 'Automatic', 'Must be tracked'],
            ['Last Synced', 'When last synced to database', 'YYYY-MM-DD HH:MM:SS', '19 chars max', 'Sync tracking', '2025-09-27 11:12:02', 'Format: YYYY-MM-DD HH:MM:SS', 'Age-appropriate sync', 'Pillar-specific sync', 'Timestamp', 'Yes', 'Auto-generated', 'System generated', 'Automatic', 'Must be synchronized'],
            ['Feedback', 'Quality feedback and notes', 'Free text', '500 chars max', 'Quality control', 'Great activity, needs more materials', 'Optional feedback', 'Age-appropriate feedback', 'Pillar-specific improvements', 'Text', 'No', '', 'Manual entry', 'As needed', 'Must be constructive'],
            ['Corrections Needed', 'What needs to be fixed', 'Free text', '300 chars max', 'Improvement tracking', 'Update materials list', 'Optional corrections', 'Age-appropriate corrections', 'Pillar-specific fixes', 'Text', 'No', '', 'Manual entry', 'As needed', 'Must be actionable'],
            ['Validation Score', 'Quality score out of 100', 'X/100 format', '10 chars max', 'Quality metrics', '100/100 (A+)', 'Format: X/100 (Grade)', 'Age-appropriate scoring', 'Pillar-specific quality', 'Text', 'Yes', 'Auto-generated', 'System generated', 'Automatic', 'Must be accurate'],
            
            # 🟡 YELLOW = Mixed/Conditional
            ['Category', 'Activity category within pillar', 'Free text', '50 chars max', 'Logical categorization', 'Sensory Exploration', 'Must be consistent within pillar', 'Age-appropriate categories', 'Pillar-specific categories', 'Text', 'Yes', '', 'Manual entry', 'As needed', 'Must be consistent'],
            ['Category Description', 'Description of the category', 'Free text', '200 chars max', 'Category context', 'Activities focusing on developing tactile awareness...', 'Explain the category purpose', 'Age-appropriate descriptions', 'Pillar-specific context', 'Text', 'No', '', 'Manual entry', 'As needed', 'Must be descriptive'],
            ['General Instructions', 'General safety and guidance', 'Free text', '300 chars max', 'Safety information', 'Supervise closely during texture tray adventure', 'Safety and general guidance', 'Age-appropriate safety', 'Pillar-specific guidance', 'Text', 'No', '', 'Manual entry', 'As needed', 'Must prioritize safety'],
            ['Additional Information', 'Extra context or notes', 'Free text', '200 chars max', 'Optional context', 'Perfect for rainy days', 'Additional helpful information', 'Age-appropriate extras', 'Pillar-specific notes', 'Text', 'No', '', 'Manual entry', 'As needed', 'Must be helpful'],
            ['Pillar', 'Essential growth pillar', 'Fixed values', '30 chars max', 'Standard pillar names', 'Play & Creativity', 'Values: Play & Creativity, Cognitive Skills, etc.', 'Age-appropriate pillars', 'Must match pillar definitions', 'Text', 'Yes', '', 'Manual entry', 'Rarely', 'Must be accurate'],
        ]
        
        # Clear existing data and update with restored structure
        metadata_worksheet.clear()
        metadata_worksheet.update('A1:O40', metadata_data)
        
        # Apply formatting to header row
        format_cell_range(metadata_worksheet, 'A1:O1', CellFormat(
            backgroundColor=Color(0.2, 0.4, 0.8),  # Blue header
            textFormat=TextFormat(bold=True, foregroundColor=Color(1, 1, 1))
        ))
        
        print("✅ Original 15-column structure restored!")
        print("📊 Metadata sheet now has all original columns back")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    print("🔧 Restore Metadata Columns Tool")
    print("=" * 35)
    
    restore_metadata_columns()
    
    print("\n✅ Original metadata structure restored!")
    print("📋 All 15 original columns are back!")
