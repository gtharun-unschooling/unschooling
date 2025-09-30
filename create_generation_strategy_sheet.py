#!/usr/bin/env python3
"""
📋 Create Generation Strategy Sheet
Create a dedicated sheet with metadata-first instructions and best practices
"""

import gspread
from google.oauth2.service_account import Credentials
import time

def get_google_sheets_client():
    """Connect to Google Sheets using credentials"""
    try:
        scope = [
            'https://spreadsheets.google.com/feeds',
            'https://www.googleapis.com/auth/spreadsheets',
            'https://www.googleapis.com/auth/drive',
            'https://www.googleapis.com/auth/drive.file'
        ]
        creds = Credentials.from_service_account_file('sheets-credentials.json', scopes=scope)
        client = gspread.authorize(creds)
        print("✅ Connected to Google Sheets")
        return client
    except Exception as e:
        print(f"❌ Error connecting to Google Sheets: {e}")
        return None

def create_generation_strategy_sheet(client):
    """Create Generation Strategy sheet with best practices"""
    
    try:
        # Open the Sample 1 spreadsheet
        spreadsheet = client.open_by_key('14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ')
        
        # Check if sheet already exists
        try:
            existing_sheet = spreadsheet.worksheet('Generation Strategy')
            print("📋 Generation Strategy sheet already exists")
            return existing_sheet
        except gspread.WorksheetNotFound:
            print("📋 Creating new Generation Strategy sheet")
        
        # Create new worksheet
        strategy_sheet = spreadsheet.add_worksheet(title="Generation Strategy", rows=100, cols=10)
        
        print(f"✅ Created Generation Strategy sheet")
        
        # Define the strategy content
        strategy_content = [
            # Header row
            ["GENERATION STRATEGY - METADATA-FIRST APPROACH", "", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", ""],
            
            # Core Principle
            ["🎯 CORE PRINCIPLE", "", "", "", "", "", "", "", "", ""],
            ["META FIRST", "Metadata First, Everything Else Second", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", ""],
            
            # Step-by-Step Process
            ["📋 STEP-BY-STEP PROCESS", "", "", "", "", "", "", "", "", ""],
            ["Step 1", "Check metadata for the specific column(s) being worked on", "", "", "", "", "", "", "", ""],
            ["Step 2", "Understand the exact requirements from metadata", "", "", "", "", "", "", "", ""],
            ["Step 3", "Follow metadata specifications precisely", "", "", "", "", "", "", "", ""],
            ["Step 4", "Apply changes according to metadata guidelines", "", "", "", "", "", "", "", ""],
            ["Step 5", "Verify work against metadata requirements", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", ""],
            
            # Metadata Checklist
            ["🔍 METADATA CHECKLIST FOR EACH COLUMN", "", "", "", "", "", "", "", "", ""],
            ["Check Item", "Description", "", "", "", "", "", "", "", ""],
            ["Purpose", "What is this column for?", "", "", "", "", "", "", "", ""],
            ["Format", "What format should it be in?", "", "", "", "", "", "", "", ""],
            ["Requirements", "What are the specific requirements?", "", "", "", "", "", "", "", ""],
            ["Validation Rules", "What makes it valid?", "", "", "", "", "", "", "", ""],
            ["Quality Standards", "What quality level is expected?", "", "", "", "", "", "", "", ""],
            ["Character Limits", "Any length restrictions?", "", "", "", "", "", "", "", ""],
            ["Age Considerations", "Any age-specific requirements?", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", ""],
            
            # Before Making Changes
            ["🚨 BEFORE MAKING ANY CHANGES", "", "", "", "", "", "", "", "", ""],
            ["Question", "What does the metadata say about this column?", "", "", "", "", "", "", "", ""],
            ["Read", "Check metadata requirements first", "", "", "", "", "", "", "", ""],
            ["Plan", "Create approach based on metadata", "", "", "", "", "", "", "", ""],
            ["Execute", "Apply changes following metadata exactly", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", ""],
            
            # Red Flags to Avoid
            ["❌ RED FLAGS TO AVOID", "", "", "", "", "", "", "", "", ""],
            ["Making assumptions", "About what content should be", "", "", "", "", "", "", "", ""],
            ["Using generic templates", "Without checking metadata", "", "", "", "", "", "", "", ""],
            ["Following common sense", "Instead of metadata requirements", "", "", "", "", "", "", "", ""],
            ["Skipping metadata check", "Because 'I think I know'", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", ""],
            
            # Green Flags to Follow
            ["✅ GREEN FLAGS TO FOLLOW", "", "", "", "", "", "", "", "", ""],
            ["Always check metadata first", "Before making any changes", "", "", "", "", "", "", "", ""],
            ["Follow metadata requirements exactly", "As the single source of truth", "", "", "", "", "", "", "", ""],
            ["Use metadata as guide", "For all content generation", "", "", "", "", "", "", "", ""],
            ["Verify work against metadata", "To ensure compliance", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", ""],
            
            # Example Workflow
            ["📝 EXAMPLE WORKFLOW", "", "", "", "", "", "", "", "", ""],
            ["Task", "Fix Objectives column", "", "", "", "", "", "", "", ""],
            ["Step 1", "Check metadata for 'Objective' column", "", "", "", "", "", "", "", ""],
            ["Step 2", "Read requirements: 'Specific developmental skill, measurable outcomes'", "", "", "", "", "", "", "", ""],
            ["Step 3", "Create objectives that are specific and measurable", "", "", "", "", "", "", "", ""],
            ["Step 4", "Apply changes following metadata exactly", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", ""],
            
            # Memory Tool
            ["🧠 MEMORY TOOL", "", "", "", "", "", "", "", "", ""],
            ["META FIRST", "Metadata First, Everything Else Second", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", ""],
            
            # Specific Column Guidelines
            ["📊 SPECIFIC COLUMN GUIDELINES", "", "", "", "", "", "", "", "", ""],
            ["Column", "Key Requirements", "Format", "Character Limit", "", "", "", "", "", ""],
            ["Objective", "Specific, measurable, age-appropriate outcomes", "1-2 sentences", "200 chars max", "", "", "", "", "", ""],
            ["Steps", "Clear, actionable, numbered steps specific to activity", "Numbered list", "1500 chars max", "", "", "", "", "", ""],
            ["Skills", "Specific skills developed by the activity", "Comma-separated list", "200 chars max", "", "", "", "", "", ""],
            ["Category Description", "Detailed explanation of category focus", "Comprehensive paragraph", "500 chars max", "", "", "", "", "", ""],
            ["Activity Name", "Clear, action-oriented, specific name", "Action words", "100 chars max", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", ""],
            
            # Quality Control
            ["🎯 QUALITY CONTROL CHECKLIST", "", "", "", "", "", "", "", "", ""],
            ["Item", "Check", "", "", "", "", "", "", "", ""],
            ["Metadata Compliance", "Does content follow metadata requirements?", "", "", "", "", "", "", "", ""],
            ["Specificity", "Is content specific to the individual activity?", "", "", "", "", "", "", "", ""],
            ["Age Appropriateness", "Is content appropriate for the age group?", "", "", "", "", "", "", "", ""],
            ["Character Limits", "Does content fit within character limits?", "", "", "", "", "", "", "", ""],
            ["Quality Standards", "Does content meet quality standards?", "", "", "", "", "", "", "", ""],
            ["", "", "", "", "", "", "", "", "", ""],
            
            # Last Updated
            ["📅 LAST UPDATED", "", "", "", "", "", "", "", "", ""],
            ["Date", "2024-01-XX", "", "", "", "", "", "", "", ""],
            ["Version", "1.0", "", "", "", "", "", "", "", ""],
            ["Status", "Active", "", "", "", "", "", "", "", ""]
        ]
        
        # Add all content to the sheet
        strategy_sheet.update('A1', strategy_content)
        
        print(f"✅ Added Generation Strategy content to sheet")
        
        return strategy_sheet
        
    except Exception as e:
        print(f"❌ Error creating Generation Strategy sheet: {e}")
        return None

def main():
    """Main function to create Generation Strategy sheet"""
    print("📋 Creating Generation Strategy Sheet")
    print("=" * 70)
    print("🎯 Create dedicated sheet with metadata-first instructions and best practices")
    
    # Connect to Google Sheets
    client = get_google_sheets_client()
    if not client:
        return False
    
    # Create Generation Strategy sheet
    strategy_sheet = create_generation_strategy_sheet(client)
    
    if strategy_sheet:
        print(f"\n✅ SUCCESS! Generation Strategy sheet created!")
        print("=" * 50)
        print("✅ Created 'Generation Strategy' sheet")
        print("✅ Added metadata-first approach guidelines")
        print("✅ Included step-by-step process")
        print("✅ Added quality control checklist")
        print("✅ Ready for future content generation")
        
        return True
    else:
        print(f"\n❌ FAILED to create Generation Strategy sheet!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Generation Strategy sheet creation completed!")
    else:
        print(f"\n❌ FAILED to create Generation Strategy sheet!")
