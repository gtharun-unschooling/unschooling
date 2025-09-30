#!/usr/bin/env python3
"""
📋 Create Metadata Sheet
Create a comprehensive metadata sheet with all column standards and rules
"""

import pandas as pd
from datetime import datetime

def create_metadata_sheet():
    """Create a metadata sheet with all column standards"""
    
    print("📋 Creating Metadata Sheet")
    print("=" * 60)
    
    # Define metadata for each column
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
            "Rules": "Must be specific and clear; Use semicolons to separate items; No vague terms like 'various' or 'different'; Include quantities when helpful; Focus on items parents can easily find; No internal references or kit items; Should be realistic and accessible; Maximum 6 items",
            "Quality Standards": "Specific, clear, accessible"
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
            "Rules": "Must start with # symbol; Use commas to separate hashtags; Be relevant to the activity; Include age group, activity type, and skills; No spaces in hashtags; Should be searchable and discoverable; Use consistent terminology; Maximum 5 hashtags",
            "Quality Standards": "Relevant, searchable, consistent"
        }
    ]
    
    # Create DataFrame
    df = pd.DataFrame(metadata)
    
    # Add metadata information
    metadata_info = {
        "Column Name": "METADATA INFO",
        "Purpose": "This sheet contains standards and rules for all columns in the Essential Growth Activities dataset",
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
        "Rules": "Created on " + datetime.now().strftime("%Y-%m-%d %H:%M:%S") + "; Use this as reference for creating new activities; All standards are maximum limits only (no minimums); Quality standards must be followed for consistency",
        "Quality Standards": "Comprehensive, clear, actionable"
    }
    
    # Add metadata info as first row
    df = pd.concat([pd.DataFrame([metadata_info]), df], ignore_index=True)
    
    # Save to CSV
    output_file = 'essential-growth-activities-metadata.csv'
    df.to_csv(output_file, index=False)
    
    print(f"✅ Metadata sheet created: {output_file}")
    print(f"📊 Total columns documented: {len(metadata)}")
    print(f"📋 Total rows: {len(df)}")
    
    # Show summary
    print(f"\n📋 Metadata Sheet Summary:")
    print(f"   - File: {output_file}")
    print(f"   - Columns documented: {len(metadata)}")
    print(f"   - Includes: Purpose, Format, Rules, Quality Standards")
    print(f"   - Maximum limits: Word, Item, Step, Skill, Hashtag limits")
    print(f"   - Options: Predefined options for select columns")
    print(f"   - Examples: Sample values for each column")
    
    # Show first few rows
    print(f"\n📋 Sample of Metadata Sheet:")
    print(df[['Column Name', 'Purpose', 'Max Words', 'Max Items', 'Max Steps']].head(10).to_string(index=False))
    
    print(f"\n🎯 Usage Instructions:")
    print(f"1. Use this sheet as reference when creating new activities")
    print(f"2. Follow the rules and quality standards for each column")
    print(f"3. Respect the maximum limits (no minimums)")
    print(f"4. Ensure consistency across all activities")
    print(f"5. Update this sheet if standards change")
    
    return output_file

if __name__ == '__main__':
    output_file = create_metadata_sheet()
    
    print(f"\n✅ Metadata sheet created successfully!")
    print(f"📁 File: {output_file}")
    print(f"🎯 Ready to use as reference for all future activities")
