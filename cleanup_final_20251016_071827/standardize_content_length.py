#!/usr/bin/env python3
"""
📏 Standardize Content Length
Make all explanations, materials, and steps consistent in length and detail
"""

import pandas as pd
from datetime import datetime

def standardize_content_length():
    """Standardize content length across all activities"""
    
    print("📏 Standardizing Content Length")
    print("=" * 50)
    
    # Read the CSV
    df = pd.read_csv('essential-growth-activities-enhanced-20250927_003226.csv')
    print(f"📊 Loaded {len(df)} activities")
    
    # Define target lengths (in words)
    TARGET_LENGTHS = {
        'explanation': 25,  # 25 words max
        'materials': 8,     # 8 items max
        'steps': 6,         # 6 steps max
        'skills': 5         # 5 skills max
    }
    
    print(f"🎯 Target lengths:")
    print(f"   - Explanation: {TARGET_LENGTHS['explanation']} words max")
    print(f"   - Materials: {TARGET_LENGTHS['materials']} items max")
    print(f"   - Steps: {TARGET_LENGTHS['steps']} steps max")
    print(f"   - Skills: {TARGET_LENGTHS['skills']} skills max")
    
    def count_words(text):
        """Count words in text"""
        if pd.isna(text) or text == '':
            return 0
        return len(str(text).split())
    
    def count_items(text, separator=';'):
        """Count items separated by semicolon"""
        if pd.isna(text) or text == '':
            return 0
        return len([item.strip() for item in str(text).split(separator) if item.strip()])
    
    def standardize_explanation(explanation):
        """Standardize explanation to target length"""
        if pd.isna(explanation) or explanation == '':
            return 'Engaging activity for child development.'
        
        words = str(explanation).split()
        if len(words) <= TARGET_LENGTHS['explanation']:
            return explanation
        
        # Keep first 25 words
        return ' '.join(words[:TARGET_LENGTHS['explanation']]) + '.'
    
    def standardize_materials(materials):
        """Standardize materials to target length"""
        if pd.isna(materials) or materials == '':
            return 'Basic materials as specified'
        
        items = [item.strip() for item in str(materials).split(';') if item.strip()]
        if len(items) <= TARGET_LENGTHS['materials']:
            return materials
        
        # Keep first 8 items
        return '; '.join(items[:TARGET_LENGTHS['materials']])
    
    def standardize_steps(steps):
        """Standardize steps to target length"""
        if pd.isna(steps) or steps == '':
            return 'Follow activity instructions'
        
        step_list = [step.strip() for step in str(steps).split(';') if step.strip()]
        if len(step_list) <= TARGET_LENGTHS['steps']:
            return steps
        
        # Keep first 6 steps
        return '; '.join(step_list[:TARGET_LENGTHS['steps']])
    
    def standardize_skills(skills):
        """Standardize skills to target length"""
        if pd.isna(skills) or skills == '':
            return 'Skill development'
        
        skill_list = [skill.strip() for skill in str(skills).split(',') if skill.strip()]
        if len(skill_list) <= TARGET_LENGTHS['skills']:
            return skills
        
        # Keep first 5 skills
        return ', '.join(skill_list[:TARGET_LENGTHS['skills']])
    
    print("\n📋 Processing activities...")
    
    # Track changes
    changes_made = {
        'explanation': 0,
        'materials': 0,
        'steps': 0,
        'skills': 0
    }
    
    for idx, row in df.iterrows():
        activity_id = row['Activity ID']
        pillar = row['Pillar']
        
        # Standardize Explanation
        original_explanation = row['Explanation']
        new_explanation = standardize_explanation(original_explanation)
        if new_explanation != original_explanation:
            df.at[idx, 'Explanation'] = new_explanation
            changes_made['explanation'] += 1
        
        # Standardize Materials
        original_materials = row['Materials']
        new_materials = standardize_materials(original_materials)
        if new_materials != original_materials:
            df.at[idx, 'Materials'] = new_materials
            changes_made['materials'] += 1
        
        # Standardize Steps
        original_steps = row['Steps']
        new_steps = standardize_steps(original_steps)
        if new_steps != original_steps:
            df.at[idx, 'Steps'] = new_steps
            changes_made['steps'] += 1
        
        # Standardize Skills
        original_skills = row['Skills']
        new_skills = standardize_skills(original_skills)
        if new_skills != original_skills:
            df.at[idx, 'Skills'] = new_skills
            changes_made['skills'] += 1
    
    # Create backup
    backup_name = f'essential-growth-activities-backup-before-standardization-{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'
    df.to_csv(backup_name, index=False)
    print(f"✅ Created backup: {backup_name}")
    
    # Save updated file
    df.to_csv('essential-growth-activities-enhanced-20250927_003226.csv', index=False)
    print("✅ Updated main file with standardized content")
    
    print("\n" + "=" * 50)
    print("🎉 Content Standardization Complete!")
    print(f"📊 Activities processed: {len(df)}")
    
    print("\n📊 Changes made:")
    for field, count in changes_made.items():
        print(f"   - {field.title()}: {count} activities updated")
    
    # Show examples
    print("\n📋 Examples of standardized content:")
    
    # Show a few examples
    for i in range(min(3, len(df))):
        row = df.iloc[i]
        print(f"\n{i+1}. {row['Topic']} ({row['Pillar']})")
        print(f"   Explanation: {row['Explanation']}")
        print(f"   Materials: {row['Materials']}")
        print(f"   Steps: {row['Steps']}")
        print(f"   Skills: {row['Skills']}")
    
    return True

if __name__ == '__main__':
    success = standardize_content_length()
    
    if success:
        print("\n🚀 Next step: Sync to Google Sheets")
        print("Run: python upload_with_proper_sa.py")
    else:
        print("\n❌ Standardization failed")
