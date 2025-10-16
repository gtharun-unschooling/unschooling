#!/usr/bin/env python3
"""
🧹 Remove Redundant Materials
Remove repeated/unnecessary materials and create Additional Information column
"""

import pandas as pd
from datetime import datetime

def remove_redundant_materials():
    """Remove redundant materials and create Additional Information column"""
    
    print("🧹 Removing Redundant Materials")
    print("=" * 50)
    
    # Read the CSV
    df = pd.read_csv('essential-growth-activities-enhanced-20250927_003226.csv')
    print(f"📊 Loaded {len(df)} activities")
    
    # Define redundant materials that appear in every row
    redundant_materials = [
        'Learning progress tracker',
        'Cognitive development kit',
        'Skill assessment tools',
        'Activity kit',
        'Step-by-step guide',
        'Progress tracking sheet',
        'Soft play mat',
        'Cushions',
        'Safe play area',
        'Basic materials',
        'Safe toys',
        'Soft play area'
    ]
    
    def clean_materials(materials):
        """Remove redundant materials from the materials list"""
        if pd.isna(materials) or materials == '':
            return ''
        
        materials_str = str(materials)
        
        # Split into individual materials
        items = [item.strip() for item in materials_str.split(';') if item.strip()]
        
        # Remove redundant materials
        clean_items = []
        for item in items:
            is_redundant = False
            for redundant in redundant_materials:
                if redundant.lower() in item.lower():
                    is_redundant = True
                    break
            if not is_redundant:
                clean_items.append(item)
        
        return '; '.join(clean_items)
    
    def create_additional_info(materials):
        """Create additional information from redundant materials"""
        if pd.isna(materials) or materials == '':
            return ''
        
        materials_str = str(materials)
        items = [item.strip() for item in materials_str.split(';') if item.strip()]
        
        # Collect redundant materials
        redundant_found = []
        for item in items:
            for redundant in redundant_materials:
                if redundant.lower() in item.lower():
                    redundant_found.append(item)
                    break
        
        return '; '.join(redundant_found)
    
    print(f"\n🧹 Cleaning materials column...")
    
    # Create Additional Information column
    df['Additional Information'] = df['Materials'].apply(create_additional_info)
    
    # Clean materials column
    df['Materials'] = df['Materials'].apply(clean_materials)
    
    # Check for empty materials after cleaning
    empty_materials = df[df['Materials'] == ''].shape[0]
    print(f"   - Activities with empty materials after cleaning: {empty_materials}")
    
    # Fill empty materials with generic items
    def fill_empty_materials(row):
        """Fill empty materials with age-appropriate generic items"""
        if row['Materials'] == '':
            age_group = row['Age Group']
            if 'infant' in age_group.lower():
                return 'Soft blanket; Safe toys'
            elif 'toddler' in age_group.lower():
                return 'Safe toys; Soft play area'
            elif 'preschooler' in age_group.lower():
                return 'Paper; Markers; Safe play area'
            else:
                return 'Basic materials; Safe play area'
        return row['Materials']
    
    df['Materials'] = df.apply(fill_empty_materials, axis=1)
    
    # Reorder columns to put Additional Information after Materials
    columns = df.columns.tolist()
    
    # Find Materials column index
    materials_idx = columns.index('Materials')
    
    # Insert Additional Information after Materials
    if 'Additional Information' not in columns:
        columns.insert(materials_idx + 1, 'Additional Information')
    else:
        # Move Additional Information to right after Materials
        columns.remove('Additional Information')
        columns.insert(materials_idx + 1, 'Additional Information')
    
    df = df[columns]
    
    # Create backup
    backup_name = f'essential-growth-activities-backup-before-redundant-cleanup-{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'
    df.to_csv(backup_name, index=False)
    print(f"\n✅ Created backup: {backup_name}")
    
    # Save updated file
    df.to_csv('essential-growth-activities-enhanced-20250927_003226.csv', index=False)
    print("✅ Updated main file with cleaned materials")
    
    # Show statistics
    print(f"\n📊 Cleaning Statistics:")
    
    # Count materials per activity
    materials_counts = df['Materials'].apply(lambda x: len([item for item in str(x).split(';') if item.strip()]))
    additional_counts = df['Additional Information'].apply(lambda x: len([item for item in str(x).split(';') if item.strip()]))
    
    print(f"   - Average materials per activity: {materials_counts.mean():.1f}")
    print(f"   - Average additional info per activity: {additional_counts.mean():.1f}")
    print(f"   - Activities with additional info: {(additional_counts > 0).sum()}")
    
    # Show examples
    print(f"\n📋 Examples of Cleaned Materials:")
    
    for i in range(min(5, len(df))):
        row = df.iloc[i]
        print(f"\n{i+1}. {row['Topic']}")
        print(f"   Materials: {row['Materials']}")
        if row['Additional Information']:
            print(f"   Additional Info: {row['Additional Information']}")
        else:
            print(f"   Additional Info: (None)")
    
    # Show most common materials after cleaning
    all_materials = []
    for materials in df['Materials']:
        if pd.notna(materials) and materials != '':
            items = [item.strip() for item in str(materials).split(';') if item.strip()]
            all_materials.extend(items)
    
    from collections import Counter
    material_counts = Counter(all_materials)
    
    print(f"\n📦 Most Common Materials (After Cleaning):")
    for material, count in material_counts.most_common(10):
        print(f"   - {material}: {count} times")
    
    print("\n" + "=" * 50)
    print("🎉 Redundant Materials Removed!")
    
    return True

if __name__ == '__main__':
    success = remove_redundant_materials()
    
    if success:
        print("\n🚀 Next step: Sync to Google Sheets")
        print("Run: python upload_with_proper_sa.py")
    else:
        print("\n❌ Cleanup failed")
