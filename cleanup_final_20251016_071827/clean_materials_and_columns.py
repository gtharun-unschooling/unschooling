#!/usr/bin/env python3
"""
🧹 Clean Materials and Organize Columns
Clean materials section and separate customer vs admin columns
"""

import pandas as pd
from datetime import datetime

def clean_materials_and_columns():
    """Clean materials and organize columns by customer vs admin"""
    
    print("🧹 Cleaning Materials and Organizing Columns")
    print("=" * 60)
    
    # Read the CSV
    df = pd.read_csv('essential-growth-activities-enhanced-20250927_003226.csv')
    print(f"📊 Loaded {len(df)} activities")
    
    # Define column categories
    customer_columns = [
        'Activity ID', 'Pillar', 'Age Group', 'Difficulty Level', 'Activity Type',
        'Category', 'Category Description', 'Topic Number', 'Topic', 'Activity Name',
        'Objective', 'Explanation', 'Age', 'Estimated Time', 'Setup Time',
        'Supervision Level', 'Materials', 'Steps', 'Skills', 'Hashtags'
    ]
    
    admin_columns = [
        'Kit Materials', 'General Instructions', 'Last Updated', 'Feedback', 
        'Updated By', 'Last Synced', 'Materials at Home', 'Materials to Buy for Kit'
    ]
    
    print(f"\n📋 Column Analysis:")
    print(f"   - Customer columns: {len(customer_columns)}")
    print(f"   - Admin columns: {len(admin_columns)}")
    print(f"   - Total columns: {len(df.columns)}")
    
    # Clean materials column - remove internal references
    def clean_materials(materials):
        """Clean materials by removing internal references"""
        if pd.isna(materials) or materials == '':
            return ''
        
        materials_str = str(materials)
        
        # Remove internal references
        internal_phrases = [
            ' (supplied by us)',
            ' (available at home)',
            ' (available at home)',
            ' (supplied by us)',
            'Activity kit (supplied by us)',
            'Step-by-step guide (supplied by us)',
            'Progress tracking sheet (supplied by us)',
            'Learning progress tracker (supplied by us)',
            'Cognitive development kit (supplied by us)',
            'Skill assessment tools (supplied by us)'
        ]
        
        for phrase in internal_phrases:
            materials_str = materials_str.replace(phrase, '')
        
        # Clean up extra spaces and semicolons
        items = [item.strip() for item in materials_str.split(';') if item.strip()]
        
        # Remove duplicates while preserving order
        seen = set()
        clean_items = []
        for item in items:
            if item not in seen:
                clean_items.append(item)
                seen.add(item)
        
        return '; '.join(clean_items)
    
    print(f"\n🧹 Cleaning materials column...")
    
    # Clean materials
    df['Materials'] = df['Materials'].apply(clean_materials)
    
    # Clean steps column - remove internal references
    def clean_steps(steps):
        """Clean steps by removing internal references"""
        if pd.isna(steps) or steps == '':
            return ''
        
        steps_str = str(steps)
        
        # Remove internal references from steps
        internal_phrases = [
            'Use materials from our activity kit',
            'Follow our step-by-step guide',
            'Track progress on our tracking sheet',
            'Return materials when activity is complete',
            'TEST EDIT COMPLETED'
        ]
        
        for phrase in internal_phrases:
            steps_str = steps_str.replace(phrase, '')
        
        # Clean up extra semicolons and spaces
        step_items = [item.strip() for item in steps_str.split(';') if item.strip()]
        
        return '; '.join(step_items)
    
    print(f"🧹 Cleaning steps column...")
    
    # Clean steps
    df['Steps'] = df['Steps'].apply(clean_steps)
    
    # Clean skills column - remove internal references
    def clean_skills(skills):
        """Clean skills by removing internal references"""
        if pd.isna(skills) or skills == '':
            return ''
        
        skills_str = str(skills)
        
        # Remove internal references
        internal_phrases = [
            'Material management',
            'Progress tracking',
            'Resource sharing',
            'Test editing'
        ]
        
        for phrase in internal_phrases:
            skills_str = skills_str.replace(phrase, '')
        
        # Clean up extra commas and spaces
        skill_items = [item.strip() for item in skills_str.split(',') if item.strip()]
        
        # Remove duplicates while preserving order
        seen = set()
        clean_skills = []
        for skill in skill_items:
            if skill not in seen:
                clean_skills.append(skill)
                seen.add(skill)
        
        return ', '.join(clean_skills)
    
    print(f"🧹 Cleaning skills column...")
    
    # Clean skills
    df['Skills'] = df['Skills'].apply(clean_skills)
    
    # Clean hashtags column - remove test references
    def clean_hashtags(hashtags):
        """Clean hashtags by removing test references"""
        if pd.isna(hashtags) or hashtags == '':
            return ''
        
        hashtags_str = str(hashtags)
        
        # Remove test references
        test_phrases = [
            '#TESTEDIT',
            'TESTEDIT',
            'TEST EDIT'
        ]
        
        for phrase in test_phrases:
            hashtags_str = hashtags_str.replace(phrase, '')
        
        # Clean up extra commas and spaces
        hashtag_items = [item.strip() for item in hashtags_str.split(',') if item.strip()]
        
        # Remove duplicates while preserving order
        seen = set()
        clean_hashtags = []
        for hashtag in hashtag_items:
            if hashtag not in seen:
                clean_hashtags.append(hashtag)
                seen.add(hashtag)
        
        return ', '.join(clean_hashtags)
    
    print(f"🧹 Cleaning hashtags column...")
    
    # Clean hashtags
    df['Hashtags'] = df['Hashtags'].apply(clean_hashtags)
    
    # Reorder columns - customer first, then admin
    print(f"\n📋 Reordering columns...")
    
    # Get all existing columns
    existing_columns = df.columns.tolist()
    
    # Create final column order
    final_columns = []
    
    # Add customer columns that exist
    for col in customer_columns:
        if col in existing_columns:
            final_columns.append(col)
    
    # Add admin columns that exist
    for col in admin_columns:
        if col in existing_columns:
            final_columns.append(col)
    
    # Add any remaining columns not in either category
    for col in existing_columns:
        if col not in final_columns:
            final_columns.append(col)
    
    # Reorder dataframe
    df = df[final_columns]
    
    # Create backup
    backup_name = f'essential-growth-activities-backup-before-cleanup-{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'
    df.to_csv(backup_name, index=False)
    print(f"\n✅ Created backup: {backup_name}")
    
    # Save updated file
    df.to_csv('essential-growth-activities-enhanced-20250927_003226.csv', index=False)
    print("✅ Updated main file with cleaned materials and organized columns")
    
    # Show column organization
    print(f"\n📋 Column Organization:")
    print(f"\n🟢 CUSTOMER COLUMNS ({len([c for c in customer_columns if c in df.columns])}):")
    for i, col in enumerate([c for c in customer_columns if c in df.columns], 1):
        print(f"   {i:2d}. {col}")
    
    print(f"\n🔴 ADMIN COLUMNS ({len([c for c in admin_columns if c in df.columns])}):")
    for i, col in enumerate([c for c in admin_columns if c in df.columns], 1):
        print(f"   {i:2d}. {col}")
    
    # Show examples of cleaned data
    print(f"\n📋 Examples of Cleaned Data:")
    
    for i in range(min(3, len(df))):
        row = df.iloc[i]
        print(f"\n{i+1}. {row['Topic']}")
        print(f"   Materials: {row['Materials']}")
        print(f"   Steps: {row['Steps'][:100]}...")
        print(f"   Skills: {row['Skills']}")
        print(f"   Hashtags: {row['Hashtags']}")
    
    print("\n" + "=" * 60)
    print("🎉 Materials and Columns Cleaned!")
    
    return True

if __name__ == '__main__':
    success = clean_materials_and_columns()
    
    if success:
        print("\n🚀 Next step: Sync to Google Sheets")
        print("Run: python upload_with_proper_sa.py")
    else:
        print("\n❌ Cleanup failed")
