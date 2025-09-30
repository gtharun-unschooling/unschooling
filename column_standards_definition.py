#!/usr/bin/env python3
"""
📋 Column Standards Definition
Define rules and standards for each column to ensure consistency and quality
"""

def define_column_standards():
    """Define standards for each column"""
    
    print("📋 Column Standards Definition")
    print("=" * 60)
    
    column_standards = {
        "Activity ID": {
            "purpose": "Unique identifier for each activity",
            "format": "kebab-case with descriptive elements",
            "pattern": "pillar-agegroup-category-topicnumber",
            "example": "play-creativity-infant-0-1-sensory-exploration-1",
            "rules": [
                "Must be unique across all activities",
                "Use lowercase letters and hyphens only",
                "Include pillar, age group, category, and topic number",
                "No spaces or special characters",
                "Should be descriptive and searchable"
            ]
        },
        
        "Pillar": {
            "purpose": "Main category of the activity",
            "format": "Title Case",
            "options": ["Play & Creativity", "Cognitive Skills"],
            "rules": [
                "Must be one of the predefined options",
                "Use proper title case",
                "No abbreviations or variations",
                "Consistent across all activities"
            ]
        },
        
        "Age Group": {
            "purpose": "Target age range for the activity",
            "format": "Age Range (Description)",
            "options": [
                "Infant (0-1)",
                "Toddler (1-3)", 
                "Preschooler (3-5)",
                "Child (6-8)",
                "Pre-Teen (9-12)",
                "Teen (13-18)"
            ],
            "rules": [
                "Must be one of the predefined options",
                "Include both age range and description",
                "Use consistent formatting",
                "No variations or abbreviations"
            ]
        },
        
        "Difficulty Level": {
            "purpose": "How challenging the activity is",
            "format": "Single word",
            "options": ["Beginner", "Intermediate", "Advanced"],
            "rules": [
                "Must be one of the predefined options",
                "Based on age group: Infant/Toddler = Beginner, Preschooler/Child = Intermediate, Pre-Teen/Teen = Advanced",
                "No variations or descriptions",
                "Consistent across similar age groups"
            ]
        },
        
        "Activity Type": {
            "purpose": "Category of the activity",
            "format": "Single word",
            "options": ["Sensory", "Physical", "Cognitive", "Creative", "Social", "Emotional"],
            "rules": [
                "Must be one of the predefined options",
                "Based on the main focus of the activity",
                "No variations or descriptions",
                "Consistent with activity content"
            ]
        },
        
        "Category": {
            "purpose": "Specific subcategory within the pillar",
            "format": "Title Case",
            "rules": [
                "Must be descriptive and specific",
                "Use proper title case",
                "No abbreviations",
                "Should clearly indicate the activity focus",
                "Consistent within each pillar"
            ]
        },
        
        "Category Description": {
            "purpose": "Brief explanation of what this category covers",
            "format": "Sentence or phrase",
            "word_limit": "5-15 words",
            "rules": [
                "Must be clear and descriptive",
                "Explain what skills or concepts are developed",
                "Use simple, parent-friendly language",
                "No jargon or technical terms",
                "Should match the category name"
            ]
        },
        
        "Topic Number": {
            "purpose": "Sequential number within the category",
            "format": "Integer",
            "rules": [
                "Must be a positive integer",
                "Sequential within each category",
                "Start from 1 for each category",
                "No gaps in numbering",
                "Consistent across all activities"
            ]
        },
        
        "Topic": {
            "purpose": "Name of the specific activity",
            "format": "Title Case",
            "word_limit": "2-6 words",
            "rules": [
                "Must be descriptive and engaging",
                "Use proper title case",
                "No abbreviations or acronyms",
                "Should clearly indicate what the activity is",
                "Avoid generic terms like 'Activity' or 'Game'",
                "Make it appealing to parents and children"
            ]
        },
        
        "Activity Name": {
            "purpose": "Full descriptive name of the activity",
            "format": "Title Case",
            "word_limit": "3-8 words",
            "rules": [
                "Must be more descriptive than Topic",
                "Use proper title case",
                "Should include the main action or focus",
                "No abbreviations or acronyms",
                "Make it clear what the child will do",
                "Should be engaging and appealing"
            ]
        },
        
        "Objective": {
            "purpose": "What the activity aims to achieve",
            "format": "Sentence",
            "word_limit": "8-15 words",
            "rules": [
                "Must be clear and specific",
                "Focus on what the child will learn or develop",
                "Use action verbs (develop, improve, enhance, build)",
                "No jargon or technical terms",
                "Should be measurable or observable",
                "Parent-friendly language"
            ]
        },
        
        "Explanation": {
            "purpose": "Brief description of what the activity involves",
            "format": "Sentence or short paragraph",
            "word_limit": "20-25 words",
            "rules": [
                "Must be clear and engaging",
                "Describe what the child will do",
                "Use simple, parent-friendly language",
                "No jargon or technical terms",
                "Should make parents want to try it",
                "Include the main materials or actions",
                "Be specific and actionable"
            ]
        },
        
        "Age": {
            "purpose": "Specific age range for this activity",
            "format": "Age range",
            "rules": [
                "Must be within the Age Group range",
                "Use format like '3-6 months' or '2-3 years'",
                "Be more specific than Age Group",
                "Consider developmental milestones",
                "No overlaps between activities",
                "Should be realistic and achievable"
            ]
        },
        
        "Estimated Time": {
            "purpose": "How long the activity typically takes",
            "format": "Time range",
            "rules": [
                "Use format like '10-15 min' or '5-10 min'",
                "Be realistic for the age group",
                "Consider attention spans",
                "Include setup and cleanup time",
                "No single numbers, always ranges",
                "Should be achievable for busy parents"
            ]
        },
        "Setup Time": {
            "purpose": "How long it takes to prepare the activity",
            "format": "Time range",
            "rules": [
                "Use format like '5-10 min' or '2-5 min'",
                "Be realistic for busy parents",
                "Consider material gathering and preparation",
                "No single numbers, always ranges",
                "Should be quick and easy",
                "Focus on parent convenience"
            ]
        },
        
        "Supervision Level": {
            "purpose": "How much adult supervision is needed",
            "format": "Single word",
            "options": ["High", "Medium", "Low"],
            "rules": [
                "Must be one of the predefined options",
                "Based on safety requirements and age",
                "High = constant supervision needed",
                "Medium = periodic check-ins needed",
                "Low = minimal supervision needed",
                "Consider safety and developmental needs"
            ]
        },
        
        "Materials": {
            "purpose": "What parents need to gather for the activity",
            "format": "Semicolon-separated list",
            "item_limit": "2-6 items",
            "rules": [
                "Must be specific and clear",
                "Use semicolons to separate items",
                "No vague terms like 'various' or 'different'",
                "Include quantities when helpful",
                "Focus on items parents can easily find",
                "No internal references or kit items",
                "Should be realistic and accessible"
            ]
        },
        
        "Steps": {
            "purpose": "Clear, actionable instructions for parents",
            "format": "Semicolon-separated list",
            "step_limit": "4-8 steps",
            "word_limit_per_step": "8-20 words",
            "rules": [
                "Must be specific to the activity",
                "Use semicolons to separate steps",
                "Start with action verbs",
                "Be clear and actionable",
                "No generic instructions",
                "Include safety considerations",
                "Use parent-friendly language",
                "Should be easy to follow",
                "Include what to do and what to say",
                "End with cleanup instructions"
            ]
        },
        
        "Skills": {
            "purpose": "What skills the child will develop",
            "format": "Comma-separated list",
            "skill_limit": "3-6 skills",
            "rules": [
                "Must be specific and measurable",
                "Use commas to separate skills",
                "Focus on developmental outcomes",
                "No vague terms like 'learning' or 'development'",
                "Should be observable behaviors",
                "Use parent-friendly language",
                "Include both physical and cognitive skills",
                "Should match the activity content"
            ]
        },
        
        "Hashtags": {
            "purpose": "Keywords for searching and categorization",
            "format": "Comma-separated list with #",
            "hashtag_limit": "3-5 hashtags",
            "rules": [
                "Must start with # symbol",
                "Use commas to separate hashtags",
                "Be relevant to the activity",
                "Include age group, activity type, and skills",
                "No spaces in hashtags",
                "Should be searchable and discoverable",
                "Use consistent terminology"
            ]
        }
    }
    
    print("📋 Column Standards:")
    print("=" * 60)
    
    for column, standards in column_standards.items():
        print(f"\n🔹 {column}")
        print(f"   Purpose: {standards['purpose']}")
        print(f"   Format: {standards['format']}")
        
        if 'word_limit' in standards:
            print(f"   Word Limit: {standards['word_limit']}")
        if 'item_limit' in standards:
            print(f"   Item Limit: {standards['item_limit']}")
        if 'step_limit' in standards:
            print(f"   Step Limit: {standards['step_limit']}")
        if 'skill_limit' in standards:
            print(f"   Skill Limit: {standards['skill_limit']}")
        if 'hashtag_limit' in standards:
            print(f"   Hashtag Limit: {standards['hashtag_limit']}")
        if 'word_limit_per_step' in standards:
            print(f"   Word Limit per Step: {standards['word_limit_per_step']}")
        
        if 'options' in standards:
            print(f"   Options: {', '.join(standards['options'])}")
        if 'example' in standards:
            print(f"   Example: {standards['example']}")
        if 'pattern' in standards:
            print(f"   Pattern: {standards['pattern']}")
        
        print(f"   Rules:")
        for i, rule in enumerate(standards['rules'], 1):
            print(f"      {i}. {rule}")
    
    print("\n" + "=" * 60)
    print("📋 Summary of Key Standards:")
    print("=" * 60)
    
    print("\n🎯 Word Limits:")
    print("   - Explanation: 20-25 words")
    print("   - Objective: 8-15 words")
    print("   - Category Description: 5-15 words")
    print("   - Topic: 2-6 words")
    print("   - Activity Name: 3-8 words")
    print("   - Steps: 4-8 steps, 8-20 words each")
    
    print("\n📝 Format Requirements:")
    print("   - Materials: Semicolon-separated, 2-6 items")
    print("   - Steps: Semicolon-separated, 4-8 steps")
    print("   - Skills: Comma-separated, 3-6 skills")
    print("   - Hashtags: Comma-separated with #, 3-5 hashtags")
    
    print("\n✅ Quality Standards:")
    print("   - No generic or vague terms")
    print("   - Parent-friendly language")
    print("   - Specific and actionable")
    print("   - Consistent formatting")
    print("   - Realistic and achievable")
    
    return column_standards

if __name__ == '__main__':
    standards = define_column_standards()
    
    print(f"\n🎯 Next Steps:")
    print(f"1. Review these standards")
    print(f"2. Make any corrections or additions")
    print(f"3. Finalize the standards")
    print(f"4. Apply them to all activities")
    print(f"5. Ensure consistency across all columns")
