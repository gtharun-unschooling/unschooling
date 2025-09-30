#!/usr/bin/env python3
"""
🧹 Clean CSV Structure
Remove duplicates and separate general info from specific activity details
"""

import pandas as pd
import re
from datetime import datetime

def clean_csv_structure():
    """Clean the CSV structure by removing duplicates and separating general info"""
    
    print("🧹 Cleaning CSV Structure")
    print("=" * 50)
    
    # Read the CSV
    df = pd.read_csv('essential-growth-activities-enhanced-20250927_003226.csv')
    print(f"📊 Loaded {len(df)} activities")
    
    # 1. Remove duplicate columns
    print("\n1️⃣ Removing duplicate columns...")
    
    # Skills and Learning Outcomes are identical - remove Learning Outcomes
    if 'Skills' in df.columns and 'Learning Outcomes' in df.columns:
        # Check if they're identical
        skills_identical = (df['Skills'] == df['Learning Outcomes']).all()
        if skills_identical:
            df = df.drop('Learning Outcomes', axis=1)
            print("✅ Removed duplicate 'Learning Outcomes' column")
        else:
            print("⚠️ Skills and Learning Outcomes are different - keeping both")
    
    # 2. Create new columns for general information
    print("\n2️⃣ Creating new columns for general information...")
    
    # Add General Instructions column
    df['General Instructions'] = 'Use materials from our activity kit; Follow our step-by-step guide; Track progress on our tracking sheet; Return materials when activity is complete'
    
    # Add Kit Materials column  
    df['Kit Materials'] = 'Activity kit (supplied by us); Step-by-step guide (supplied by us); Progress tracking sheet (supplied by us)'
    
    print("✅ Added 'General Instructions' column")
    print("✅ Added 'Kit Materials' column")
    
    # 3. Clean Materials column - remove general kit materials
    print("\n3️⃣ Cleaning Materials column...")
    
    def clean_materials(materials_str):
        if pd.isna(materials_str):
            return ''
        
        # Remove general kit materials
        kit_materials = [
            'Activity kit (supplied by us)',
            'Step-by-step guide (supplied by us)', 
            'Progress tracking sheet (supplied by us)'
        ]
        
        # Split by semicolon and clean
        materials = [m.strip() for m in str(materials_str).split(';')]
        
        # Remove kit materials
        cleaned_materials = [m for m in materials if m not in kit_materials]
        
        return '; '.join(cleaned_materials)
    
    df['Materials'] = df['Materials'].apply(clean_materials)
    print("✅ Cleaned Materials column - removed general kit materials")
    
    # 4. Clean Steps column - remove general instructions
    print("\n4️⃣ Cleaning Steps column...")
    
    def clean_steps(steps_str):
        if pd.isna(steps_str):
            return ''
        
        # General instructions to remove
        general_instructions = [
            'Use materials from our activity kit',
            'Follow our step-by-step guide',
            'Track progress on our tracking sheet',
            'Return materials when activity is complete'
        ]
        
        # Split by semicolon and clean
        steps = [s.strip() for s in str(steps_str).split(';')]
        
        # Remove general instructions
        cleaned_steps = []
        for step in steps:
            is_general = any(gen_inst.lower() in step.lower() for gen_inst in general_instructions)
            if not is_general:
                cleaned_steps.append(step)
        
        return '; '.join(cleaned_steps)
    
    df['Steps'] = df['Steps'].apply(clean_steps)
    print("✅ Cleaned Steps column - removed general instructions")
    
    # 5. Clean Skills column - remove general skills
    print("\n5️⃣ Cleaning Skills column...")
    
    def clean_skills(skills_str):
        if pd.isna(skills_str):
            return ''
        
        # General skills to remove
        general_skills = [
            'Material management',
            'Progress tracking', 
            'Resource sharing'
        ]
        
        # Split by comma and clean
        skills = [s.strip() for s in str(skills_str).split(',')]
        
        # Remove general skills
        cleaned_skills = [s for s in skills if s not in general_skills]
        
        return ', '.join(cleaned_skills)
    
    df['Skills'] = df['Skills'].apply(clean_skills)
    print("✅ Cleaned Skills column - removed general skills")
    
    # 6. Reorder columns for better structure
    print("\n6️⃣ Reordering columns...")
    
    # Define new column order
    column_order = [
        'Activity ID',
        'Pillar', 
        'Age Group',
        'Difficulty Level',
        'Activity Type',
        'Category',
        'Category Description',
        'Topic Number',
        'Topic',
        'Activity Name',
        'Objective',
        'Explanation',
        'Age',
        'Estimated Time',
        'Setup Time',
        'Supervision Level',
        'Materials',
        'Kit Materials',
        'Steps',
        'General Instructions',
        'Skills',
        'Hashtags',
        'Last Updated',
        'Feedback',
        'Updated By',
        'Last Synced'
    ]
    
    # Reorder columns
    df = df[column_order]
    print("✅ Reordered columns for better structure")
    
    # 7. Create backup and save cleaned file
    print("\n7️⃣ Saving cleaned file...")
    
    # Create backup
    backup_name = f'essential-growth-activities-backup-before-cleanup-{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'
    df.to_csv(backup_name, index=False)
    print(f"✅ Created backup: {backup_name}")
    
    # Save cleaned file
    df.to_csv('essential-growth-activities-enhanced-20250927_003226.csv', index=False)
    print("✅ Saved cleaned file")
    
    print("\n" + "=" * 50)
    print("🎉 CSV Structure Cleaned!")
    print(f"📊 Activities: {len(df)}")
    print(f"📋 Columns: {len(df.columns)}")
    print("\n📋 New column structure:")
    for i, col in enumerate(df.columns, 1):
        print(f"  {i:2d}. {col}")
    
    print("\n✅ Changes made:")
    print("  - Removed duplicate 'Learning Outcomes' column")
    print("  - Added 'General Instructions' column")
    print("  - Added 'Kit Materials' column") 
    print("  - Cleaned 'Materials' (removed kit materials)")
    print("  - Cleaned 'Steps' (removed general instructions)")
    print("  - Cleaned 'Skills' (removed general skills)")
    print("  - Reordered columns for better structure")
    
    return True

if __name__ == '__main__':
    success = clean_csv_structure()
    
    if success:
        print("\n🚀 Next step: Sync to Google Sheets")
        print("Run: python upload_with_proper_sa.py")
    else:
        print("\n❌ Cleanup failed")
