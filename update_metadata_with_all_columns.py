#!/usr/bin/env python3
"""
📋 Update Metadata with All Columns
Update metadata sheet to include all 29 columns and color coding information
"""

import pandas as pd
from datetime import datetime

def update_metadata_with_all_columns():
    """Update metadata sheet with all columns and color coding"""
    
    print("📋 Updating Metadata with All Columns")
    print("=" * 60)
    
    # Define metadata for all 29 columns
    metadata = [
        {
            "Column Name": "Activity ID",
            "Purpose": "Unique identifier for each activity",
            "Format": "kebab-case with descriptive elements",
            "Pattern": "pillar-agegroup-category-topicnumber",
            "Example": "play-creativity-infant-0-1-sensory-exploration-1",
            "Max Words": "N/A",
            "Max Items": "N/A",
            "Max Steps": "N/A",
            "Max Skills": "N/A",
            "Max Hashtags": "N/A",
            "Max Words per Step": "N/A",
            "Options": "N/A",
            "Color Code": "🔴 Admin (Red)",
            "Customer Facing": "No",
            "Rules": "Must be unique across all activities; Use lowercase letters and hyphens only; Include pillar, age group, category, and topic number; No spaces or special characters; Should be descriptive and searchable",
            "Quality Standards": "Unique, descriptive, searchable"
        },
        
        {
            "Column Name": "Pillar",
            "Purpose": "Main category of the activity",
            "Format": "Title Case",
            "Pattern": "N/A",
            "Example": "Play & Creativity",
            "Max Words": "N/A",
            "Max Items": "N/A",
            "Max Steps": "N/A",
            "Max Skills": "N/A",
            "Max Hashtags": "N/A",
            "Max Words per Step": "N/A",
            "Options": "Play & Creativity, Cognitive Skills",
            "Color Code": "🟢 Customer (Green)",
            "Customer Facing": "Yes",
            "Rules": "Must be one of the predefined options; Use proper title case; No abbreviations or variations; Consistent across all activities",
            "Quality Standards": "Consistent, predefined options only"
        },
        
        {
            "Column Name": "Age Group",
            "Purpose": "Target age range for the activity",
            "Format": "Age Range (Description)",
            "Pattern": "N/A",
            "Example": "Infant (0-1)",
            "Max Words": "N/A",
            "Max Items": "N/A",
            "Max Steps": "N/A",
            "Max Skills": "N/A",
            "Max Hashtags": "N/A",
            "Max Words per Step": "N/A",
            "Options": "Infant (0-1), Toddler (1-3), Preschooler (3-5), Child (6-8), Pre-Teen (9-12), Teen (13-18)",
            "Color Code": "🟢 Customer (Green)",
            "Customer Facing": "Yes",
            "Rules": "Must be one of the predefined options; Include both age range and description; Use consistent formatting; No variations or abbreviations",
            "Quality Standards": "Consistent, predefined options only"
        },
        
        {
            "Column Name": "Difficulty Level",
            "Purpose": "How challenging the activity is",
            "Format": "Single word",
            "Pattern": "N/A",
            "Example": "Beginner",
            "Max Words": "N/A",
            "Max Items": "N/A",
            "Max Steps": "N/A",
            "Max Skills": "N/A",
            "Max Hashtags": "N/A",
            "Max Words per Step": "N/A",
            "Options": "Beginner, Intermediate, Advanced",
            "Color Code": "🟢 Customer (Green)",
            "Customer Facing": "Yes",
            "Rules": "Must be one of the predefined options; Based on age group: Infant/Toddler = Beginner, Preschooler/Child = Intermediate, Pre-Teen/Teen = Advanced; No variations or descriptions; Consistent across similar age groups",
            "Quality Standards": "Age-appropriate, consistent"
        },
        
        {
            "Column Name": "Activity Type",
            "Purpose": "Category of the activity",
            "Format": "Single word",
            "Pattern": "N/A",
            "Example": "Sensory",
            "Max Words": "N/A",
            "Max Items": "N/A",
            "Max Steps": "N/A",
            "Max Skills": "N/A",
            "Max Hashtags": "N/A",
            "Max Words per Step": "N/A",
            "Options": "Sensory, Physical, Cognitive, Creative, Social, Emotional",
            "Color Code": "🟢 Customer (Green)",
            "Customer Facing": "Yes",
            "Rules": "Must be one of the predefined options; Based on the main focus of the activity; No variations or descriptions; Consistent with activity content",
            "Quality Standards": "Consistent, activity-focused"
        },
        
        {
            "Column Name": "Category",
            "Purpose": "Specific subcategory within the pillar",
            "Format": "Title Case",
            "Pattern": "N/A",
            "Example": "Sensory Exploration",
            "Max Words": "N/A",
            "Max Items": "N/A",
            "Max Steps": "N/A",
            "Max Skills": "N/A",
            "Max Hashtags": "N/A",
            "Max Words per Step": "N/A",
            "Options": "N/A",
            "Color Code": "🟢 Customer (Green)",
            "Customer Facing": "Yes",
            "Rules": "Must be descriptive and specific; Use proper title case; No abbreviations; Should clearly indicate the activity focus; Consistent within each pillar",
            "Quality Standards": "Descriptive, specific, consistent"
        },
        
        {
            "Column Name": "Category Description",
            "Purpose": "Brief explanation of what this category covers",
            "Format": "Sentence or phrase",
            "Pattern": "N/A",
            "Example": "Stimulate tactile senses through safe material exploration",
            "Max Words": "15",
            "Max Items": "N/A",
            "Max Steps": "N/A",
            "Max Skills": "N/A",
            "Max Hashtags": "N/A",
            "Max Words per Step": "N/A",
            "Options": "N/A",
            "Color Code": "🟢 Customer (Green)",
            "Customer Facing": "Yes",
            "Rules": "Must be clear and descriptive; Explain what skills or concepts are developed; Use simple, parent-friendly language; No jargon or technical terms; Should match the category name; Maximum 15 words",
            "Quality Standards": "Clear, descriptive, parent-friendly"
        },
        
        {
            "Column Name": "Topic Number",
            "Purpose": "Sequential number within the category",
            "Format": "Integer",
            "Pattern": "N/A",
            "Example": "1",
            "Max Words": "N/A",
            "Max Items": "N/A",
            "Max Steps": "N/A",
            "Max Skills": "N/A",
            "Max Hashtags": "N/A",
            "Max Words per Step": "N/A",
            "Options": "N/A",
            "Color Code": "🔴 Admin (Red)",
            "Customer Facing": "No",
            "Rules": "Must be a positive integer; Sequential within each category; Start from 1 for each category; No gaps in numbering; Consistent across all activities",
            "Quality Standards": "Sequential, consistent, no gaps"
        },
        
        {
            "Column Name": "Topic",
            "Purpose": "Name of the specific activity",
            "Format": "Title Case",
            "Pattern": "N/A",
            "Example": "Texture Tray Adventure",
            "Max Words": "6",
            "Max Items": "N/A",
            "Max Steps": "N/A",
            "Max Skills": "N/A",
            "Max Hashtags": "N/A",
            "Max Words per Step": "N/A",
            "Options": "N/A",
            "Color Code": "🟢 Customer (Green)",
            "Customer Facing": "Yes",
            "Rules": "Must be descriptive and engaging; Use proper title case; No abbreviations or acronyms; Should clearly indicate what the activity is; Avoid generic terms like 'Activity' or 'Game'; Make it appealing to parents and children; Maximum 6 words",
            "Quality Standards": "Descriptive, engaging, appealing"
        },
        
        {
            "Column Name": "Activity Name",
            "Purpose": "Full descriptive name of the activity",
            "Format": "Title Case",
            "Pattern": "N/A",
            "Example": "Texture Tray Adventure",
            "Max Words": "8",
            "Max Items": "N/A",
            "Max Steps": "N/A",
            "Max Skills": "N/A",
            "Max Hashtags": "N/A",
            "Max Words per Step": "N/A",
            "Options": "N/A",
            "Color Code": "🟢 Customer (Green)",
            "Customer Facing": "Yes",
            "Rules": "Must be more descriptive than Topic; Use proper title case; Should include the main action or focus; No abbreviations or acronyms; Make it clear what the child will do; Should be engaging and appealing; Maximum 8 words",
            "Quality Standards": "Descriptive, clear, engaging"
        },
        
        {
            "Column Name": "Objective",
            "Purpose": "What the activity aims to achieve",
            "Format": "Sentence",
            "Pattern": "N/A",
            "Example": "Stimulate tactile senses through safe material exploration",
            "Max Words": "15",
            "Max Items": "N/A",
            "Max Steps": "N/A",
            "Max Skills": "N/A",
            "Max Hashtags": "N/A",
            "Max Words per Step": "N/A",
            "Options": "N/A",
            "Color Code": "🟢 Customer (Green)",
            "Customer Facing": "Yes",
            "Rules": "Must be clear and specific; Focus on what the child will learn or develop; Use action verbs (develop, improve, enhance, build); No jargon or technical terms; Should be measurable or observable; Parent-friendly language; Maximum 15 words",
            "Quality Standards": "Clear, specific, measurable"
        },
        
        {
            "Column Name": "Explanation",
            "Purpose": "Brief description of what the activity involves",
            "Format": "Sentence or short paragraph",
            "Pattern": "N/A",
            "Example": "Provide a tray with different safe materials (e.g., silk, sponge). Baby explores textures with hands.",
            "Max Words": "25",
            "Max Items": "N/A",
            "Max Steps": "N/A",
            "Max Skills": "N/A",
            "Max Hashtags": "N/A",
            "Max Words per Step": "N/A",
            "Options": "N/A",
            "Color Code": "🟢 Customer (Green)",
            "Customer Facing": "Yes",
            "Rules": "Must be clear and engaging; Describe what the child will do; Use simple, parent-friendly language; No jargon or technical terms; Should make parents want to try it; Include the main materials or actions; Be specific and actionable; Maximum 25 words",
            "Quality Standards": "Clear, engaging, actionable"
        },
        
        {
            "Column Name": "Age",
            "Purpose": "Specific age range for this activity",
            "Format": "Age range",
            "Pattern": "N/A",
            "Example": "3-12 months",
            "Max Words": "N/A",
            "Max Items": "N/A",
            "Max Steps": "N/A",
            "Max Skills": "N/A",
            "Max Hashtags": "N/A",
            "Max Words per Step": "N/A",
            "Options": "N/A",
            "Color Code": "🟢 Customer (Green)",
            "Customer Facing": "Yes",
            "Rules": "Must be within the Age Group range; Use format like '3-6 months' or '2-3 years'; Be more specific than Age Group; Consider developmental milestones; No overlaps between activities; Should be realistic and achievable",
            "Quality Standards": "Specific, realistic, achievable"
        },
        
        {
            "Column Name": "Estimated Time",
            "Purpose": "How long the activity typically takes",
            "Format": "Time range",
            "Pattern": "N/A",
            "Example": "10-15 min",
            "Max Words": "N/A",
            "Max Items": "N/A",
            "Max Steps": "N/A",
            "Max Skills": "N/A",
            "Max Hashtags": "N/A",
            "Max Words per Step": "N/A",
            "Options": "N/A",
            "Color Code": "🟢 Customer (Green)",
            "Customer Facing": "Yes",
            "Rules": "Use format like '10-15 min' or '5-10 min'; Be realistic for the age group; Consider attention spans; Include setup and cleanup time; No single numbers, always ranges; Should be achievable for busy parents",
            "Quality Standards": "Realistic, achievable, age-appropriate"
        },
        
        {
            "Column Name": "Setup Time",
            "Purpose": "How long it takes to prepare the activity",
            "Format": "Time range",
            "Pattern": "N/A",
            "Example": "5-10 min",
            "Max Words": "N/A",
            "Max Items": "N/A",
            "Max Steps": "N/A",
            "Max Skills": "N/A",
            "Max Hashtags": "N/A",
            "Max Words per Step": "N/A",
            "Options": "N/A",
            "Color Code": "🟢 Customer (Green)",
            "Customer Facing": "Yes",
            "Rules": "Use format like '5-10 min' or '2-5 min'; Be realistic for busy parents; Consider material gathering and preparation; No single numbers, always ranges; Should be quick and easy; Focus on parent convenience",
            "Quality Standards": "Quick, easy, parent-friendly"
        },
        
        {
            "Column Name": "Supervision Level",
            "Purpose": "How much adult supervision is needed",
            "Format": "Single word",
            "Pattern": "N/A",
            "Example": "High",
            "Max Words": "N/A",
            "Max Items": "N/A",
            "Max Steps": "N/A",
            "Max Skills": "N/A",
            "Max Hashtags": "N/A",
            "Max Words per Step": "N/A",
            "Options": "High, Medium, Low",
            "Color Code": "🟢 Customer (Green)",
            "Customer Facing": "Yes",
            "Rules": "Must be one of the predefined options; Based on safety requirements and age; High = constant supervision needed; Medium = periodic check-ins needed; Low = minimal supervision needed; Consider safety and developmental needs",
            "Quality Standards": "Safety-focused, age-appropriate"
        },
        
        {
            "Column Name": "Materials",
            "Purpose": "What parents need to gather for the activity",
            "Format": "Semicolon-separated list",
            "Pattern": "N/A",
            "Example": "Silk fabric; Sponge; Cotton balls; Tray; Shallow container",
            "Max Words": "N/A",
            "Max Items": "6",
            "Max Steps": "N/A",
            "Max Skills": "N/A",
            "Max Hashtags": "N/A",
            "Max Words per Step": "N/A",
            "Options": "N/A",
            "Color Code": "🟢 Customer (Green)",
            "Customer Facing": "Yes",
            "Rules": "Must be specific and clear; Use semicolons to separate items; No vague terms like 'various' or 'different'; Include quantities when helpful; Focus on items parents can easily find; No internal references or kit items; Should be realistic and accessible; Maximum 6 items",
            "Quality Standards": "Specific, clear, accessible"
        },
        
        {
            "Column Name": "Additional Information",
            "Purpose": "Internal information and redundant materials",
            "Format": "Semicolon-separated list",
            "Pattern": "N/A",
            "Example": "Learning progress tracker; Cognitive development kit",
            "Max Words": "N/A",
            "Max Items": "N/A",
            "Max Steps": "N/A",
            "Max Skills": "N/A",
            "Max Hashtags": "N/A",
            "Max Words per Step": "N/A",
            "Options": "N/A",
            "Color Code": "🔴 Admin (Red)",
            "Customer Facing": "No",
            "Rules": "Contains internal references and redundant materials; Use semicolons to separate items; No customer-facing information; Should be kept separate from main materials",
            "Quality Standards": "Internal use only, not customer-facing"
        },
        
        {
            "Column Name": "Steps",
            "Purpose": "Clear, actionable instructions for parents",
            "Format": "Semicolon-separated list",
            "Pattern": "N/A",
            "Example": "Fill a shallow tray with different textured materials; Place baby on their tummy near the tray; Let baby reach out and touch the textures; Describe what they're feeling; Watch their reactions; Clean up when done",
            "Max Words": "N/A",
            "Max Items": "N/A",
            "Max Steps": "8",
            "Max Skills": "N/A",
            "Max Hashtags": "N/A",
            "Max Words per Step": "20",
            "Options": "N/A",
            "Color Code": "🟢 Customer (Green)",
            "Customer Facing": "Yes",
            "Rules": "Must be specific to the activity; Use semicolons to separate steps; Start with action verbs; Be clear and actionable; No generic instructions; Include safety considerations; Use parent-friendly language; Should be easy to follow; Include what to do and what to say; End with cleanup instructions; Maximum 8 steps, 20 words each",
            "Quality Standards": "Specific, actionable, parent-friendly"
        },
        
        {
            "Column Name": "Skills",
            "Purpose": "What skills the child will develop",
            "Format": "Comma-separated list",
            "Pattern": "N/A",
            "Example": "Tactile exploration, Sensory awareness, Hand-eye coordination",
            "Max Words": "N/A",
            "Max Items": "N/A",
            "Max Steps": "N/A",
            "Max Skills": "6",
            "Max Hashtags": "N/A",
            "Max Words per Step": "N/A",
            "Options": "N/A",
            "Color Code": "🟢 Customer (Green)",
            "Customer Facing": "Yes",
            "Rules": "Must be specific and measurable; Use commas to separate skills; Focus on developmental outcomes; No vague terms like 'learning' or 'development'; Should be observable behaviors; Use parent-friendly language; Include both physical and cognitive skills; Should match the activity content; Maximum 6 skills",
            "Quality Standards": "Specific, measurable, observable"
        },
        
        {
            "Column Name": "Hashtags",
            "Purpose": "Keywords for searching and categorization",
            "Format": "Comma-separated list with #",
            "Pattern": "N/A",
            "Example": "#Tactile, #SensoryPlay, #InfantActivities",
            "Max Words": "N/A",
            "Max Items": "N/A",
            "Max Steps": "N/A",
            "Max Skills": "N/A",
            "Max Hashtags": "5",
            "Max Words per Step": "N/A",
            "Options": "N/A",
            "Color Code": "🟢 Customer (Green)",
            "Customer Facing": "Yes",
            "Rules": "Must start with # symbol; Use commas to separate hashtags; Be relevant to the activity; Include age group, activity type, and skills; No spaces in hashtags; Should be searchable and discoverable; Use consistent terminology; Maximum 5 hashtags",
            "Quality Standards": "Relevant, searchable, consistent"
        },
        
        {
            "Column Name": "Kit Materials",
            "Purpose": "Materials provided in the activity kit",
            "Format": "Semicolon-separated list",
            "Pattern": "N/A",
            "Example": "Activity kit; Step-by-step guide; Progress tracking sheet",
            "Max Words": "N/A",
            "Max Items": "N/A",
            "Max Steps": "N/A",
            "Max Skills": "N/A",
            "Max Hashtags": "N/A",
            "Max Words per Step": "N/A",
            "Options": "N/A",
            "Color Code": "🔴 Admin (Red)",
            "Customer Facing": "No",
            "Rules": "Contains materials provided in the kit; Use semicolons to separate items; Internal reference only; Not customer-facing",
            "Quality Standards": "Internal use only, kit-specific"
        },
        
        {
            "Column Name": "General Instructions",
            "Purpose": "General instructions for all activities",
            "Format": "Semicolon-separated list",
            "Pattern": "N/A",
            "Example": "Use materials from our activity kit; Follow our step-by-step guide; Track progress on our tracking sheet",
            "Max Words": "N/A",
            "Max Items": "N/A",
            "Max Steps": "N/A",
            "Max Skills": "N/A",
            "Max Hashtags": "N/A",
            "Max Words per Step": "N/A",
            "Options": "N/A",
            "Color Code": "🔴 Admin (Red)",
            "Customer Facing": "No",
            "Rules": "Contains general instructions for all activities; Use semicolons to separate items; Internal reference only; Not customer-facing",
            "Quality Standards": "Internal use only, general instructions"
        },
        
        {
            "Column Name": "Last Updated",
            "Purpose": "When the activity was last modified",
            "Format": "Date",
            "Pattern": "N/A",
            "Example": "2025-09-27",
            "Max Words": "N/A",
            "Max Items": "N/A",
            "Max Steps": "N/A",
            "Max Skills": "N/A",
            "Max Hashtags": "N/A",
            "Max Words per Step": "N/A",
            "Options": "N/A",
            "Color Code": "🔴 Admin (Red)",
            "Customer Facing": "No",
            "Rules": "Must be in YYYY-MM-DD format; Updated when activity is modified; Internal tracking only; Not customer-facing",
            "Quality Standards": "Accurate, consistent date format"
        },
        
        {
            "Column Name": "Feedback",
            "Purpose": "Internal feedback and notes",
            "Format": "Text",
            "Pattern": "N/A",
            "Example": "Needs more specific steps",
            "Max Words": "N/A",
            "Max Items": "N/A",
            "Max Steps": "N/A",
            "Max Skills": "N/A",
            "Max Hashtags": "N/A",
            "Max Words per Step": "N/A",
            "Options": "N/A",
            "Color Code": "🔴 Admin (Red)",
            "Customer Facing": "No",
            "Rules": "Contains internal feedback and notes; Free text format; Internal use only; Not customer-facing",
            "Quality Standards": "Internal use only, feedback tracking"
        },
        
        {
            "Column Name": "Updated By",
            "Purpose": "Who last updated the activity",
            "Format": "Text",
            "Pattern": "N/A",
            "Example": "Tharun",
            "Max Words": "N/A",
            "Max Items": "N/A",
            "Max Steps": "N/A",
            "Max Skills": "N/A",
            "Max Hashtags": "N/A",
            "Max Words per Step": "N/A",
            "Options": "N/A",
            "Color Code": "🔴 Admin (Red)",
            "Customer Facing": "No",
            "Rules": "Contains name of person who last updated; Free text format; Internal tracking only; Not customer-facing",
            "Quality Standards": "Internal use only, user tracking"
        },
        
        {
            "Column Name": "Last Synced",
            "Purpose": "When the activity was last synced with Google Sheets",
            "Format": "Date and time",
            "Pattern": "N/A",
            "Example": "2025-09-27 11:12:02",
            "Max Words": "N/A",
            "Max Items": "N/A",
            "Max Steps": "N/A",
            "Max Skills": "N/A",
            "Max Hashtags": "N/A",
            "Max Words per Step": "N/A",
            "Options": "N/A",
            "Color Code": "🔴 Admin (Red)",
            "Customer Facing": "No",
            "Rules": "Must be in YYYY-MM-DD HH:MM:SS format; Updated when synced with Google Sheets; Internal tracking only; Not customer-facing",
            "Quality Standards": "Accurate, consistent datetime format"
        },
        
        {
            "Column Name": "Materials at Home",
            "Purpose": "Materials that parents can find at home",
            "Format": "Semicolon-separated list",
            "Pattern": "N/A",
            "Example": "Tray; Shallow container",
            "Max Words": "N/A",
            "Max Items": "N/A",
            "Max Steps": "N/A",
            "Max Skills": "N/A",
            "Max Hashtags": "N/A",
            "Max Words per Step": "N/A",
            "Options": "N/A",
            "Color Code": "🔴 Admin (Red)",
            "Customer Facing": "No",
            "Rules": "Contains materials available at home; Use semicolons to separate items; Internal reference for kit planning; Not customer-facing",
            "Quality Standards": "Internal use only, kit planning"
        },
        
        {
            "Column Name": "Materials to Buy for Kit",
            "Purpose": "Materials that need to be purchased for the kit",
            "Format": "Semicolon-separated list",
            "Pattern": "N/A",
            "Example": "Safe textured materials (silk, sponge, cotton)",
            "Max Words": "N/A",
            "Max Items": "N/A",
            "Max Steps": "N/A",
            "Max Skills": "N/A",
            "Max Hashtags": "N/A",
            "Max Words per Step": "N/A",
            "Options": "N/A",
            "Color Code": "🔴 Admin (Red)",
            "Customer Facing": "No",
            "Rules": "Contains materials to be purchased for the kit; Use semicolons to separate items; Internal reference for procurement; Not customer-facing",
            "Quality Standards": "Internal use only, procurement planning"
        }
    ]
    
    # Create DataFrame
    df = pd.DataFrame(metadata)
    
    # Add metadata information
    metadata_info = {
        "Column Name": "METADATA INFO",
        "Purpose": "This sheet contains standards and rules for all 29 columns in the Essential Growth Activities dataset",
        "Format": "Reference document",
        "Pattern": "N/A",
        "Example": "N/A",
        "Max Words": "N/A",
        "Max Items": "N/A",
        "Max Steps": "N/A",
        "Max Skills": "N/A",
        "Max Hashtags": "N/A",
        "Max Words per Step": "N/A",
        "Options": "N/A",
        "Color Code": "N/A",
        "Customer Facing": "N/A",
        "Rules": "Created on " + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + "; Use this as reference for creating new activities; All standards are maximum limits only (no minimums); Quality standards must be followed for consistency; Color coding: Green = Customer-facing, Red = Admin-facing",
        "Quality Standards": "Comprehensive, clear, actionable"
    }
    
    # Add metadata info as first row
    df = pd.concat([pd.DataFrame([metadata_info]), df], ignore_index=True)
    
    # Save to CSV
    output_file = 'essential-growth-activities-metadata-updated.csv'
    df.to_csv(output_file, index=False)
    
    print(f"✅ Updated metadata sheet created: {output_file}")
    print(f"📊 Total columns documented: {len(metadata)}")
    print(f"📋 Total rows: {len(df)}")
    
    # Show summary
    print(f"\n📋 Updated Metadata Sheet Summary:")
    print(f"   - File: {output_file}")
    print(f"   - Columns documented: {len(metadata)}")
    print(f"   - Includes: Purpose, Format, Rules, Quality Standards, Color Code, Customer Facing")
    print(f"   - Maximum limits: Word, Item, Step, Skill, Hashtag limits")
    print(f"   - Options: Predefined options for select columns")
    print(f"   - Examples: Sample values for each column")
    print(f"   - Color coding: Green (Customer), Red (Admin)")
    
    # Show color coding summary
    customer_columns = [col for col in metadata if col['Customer Facing'] == 'Yes']
    admin_columns = [col for col in metadata if col['Customer Facing'] == 'No']
    
    print(f"\n🎨 Color Coding Summary:")
    print(f"   🟢 Customer-facing columns: {len(customer_columns)}")
    print(f"   🔴 Admin-facing columns: {len(admin_columns)}")
    
    print(f"\n🟢 Customer-facing columns:")
    for col in customer_columns:
        print(f"      - {col['Column Name']}")
    
    print(f"\n🔴 Admin-facing columns:")
    for col in admin_columns:
        print(f"      - {col['Column Name']}")
    
    return output_file

if __name__ == '__main__':
    output_file = update_metadata_with_all_columns()
    
    print(f"\n✅ Updated metadata sheet created successfully!")
    print(f"📁 File: {output_file}")
    print(f"🎯 Ready to upload to Google Sheets")
