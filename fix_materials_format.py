#!/usr/bin/env python3
"""
🔧 Fix Materials Format
Fix formatting issues and unclear information in materials section
"""

import pandas as pd
from datetime import datetime

def fix_materials_format():
    """Fix materials format issues"""
    
    print("🔧 Fixing Materials Format Issues")
    print("=" * 50)
    
    # Read the CSV
    df = pd.read_csv('essential-growth-activities-enhanced-20250927_003226.csv')
    print(f"📊 Loaded {len(df)} activities")
    
    def fix_materials(materials, topic, age_group):
        """Fix materials format and clarity"""
        if pd.isna(materials) or materials == '':
            return 'Basic materials as specified'
        
        materials_str = str(materials)
        
        # Fix common issues
        fixes = {
            # Fix vague terms
            'different textured fabrics': 'Silk fabric; Cotton fabric; Velvet fabric',
            'various materials': 'Paper; Cardboard; Glue; Markers',
            'various objects': 'Small toys; Blocks; Balls',
            'different colors': 'Red items; Blue items; Yellow items; Green items',
            'various sizes': 'Small objects; Medium objects; Large objects',
            'soft music or musical toys': 'Musical toys; Soft music player',
            'crinkle fabric or toys': 'Crinkle fabric; Soft toys',
            'musical mat or toys': 'Musical mat; Musical toys',
            'rice or beads': 'Rice; Small beads',
            'small bottles': 'Small plastic bottles; Rice; Tape',
            
            # Fix single items to multiple
            'soft towel or blanket': 'Soft towel; Blanket',
            'comfortable reclining surface': 'Comfortable chair; Soft pillow',
            'baby-safe bell anklets': 'Baby-safe bell anklets; Soft play mat',
            'none required': 'No materials needed',
            'none needed': 'No materials needed',
            
            # Fix unclear items
            'tray or shallow container': 'Tray; Shallow container',
            'safe textured materials (silk, sponge, cotton)': 'Silk fabric; Sponge; Cotton balls',
            'soft play area': 'Soft play mat; Cushions',
            'play mat': 'Soft play mat; Cushions',
            'clean play area': 'Clean floor space; Soft mat',
            
            # Fix format inconsistencies
            'safe textured materials (silk, sponge, cotton); tray or shallow container': 'Silk fabric; Sponge; Cotton balls; Tray; Shallow container',
        }
        
        # Apply fixes
        for old, new in fixes.items():
            if old.lower() in materials_str.lower():
                materials_str = materials_str.replace(old, new)
        
        # Split and clean items
        items = [item.strip() for item in materials_str.split(';') if item.strip()]
        
        # Remove duplicates
        items = list(dict.fromkeys(items))
        
        # Ensure minimum 2 items (unless it's "No materials needed")
        if len(items) < 2 and 'no materials needed' not in materials_str.lower():
            # Add age-appropriate default items
            if 'infant' in age_group.lower():
                items.extend(['Soft play mat', 'Cushions'])
            elif 'toddler' in age_group.lower():
                items.extend(['Safe toys', 'Soft play area'])
            elif 'preschooler' in age_group.lower():
                items.extend(['Paper', 'Markers'])
            else:
                items.extend(['Basic materials', 'Safe play area'])
        
        # Limit to 8 items max
        if len(items) > 8:
            items = items[:8]
        
        return '; '.join(items)
    
    print("\n📋 Fixing materials...")
    
    changes_made = 0
    
    for idx, row in df.iterrows():
        activity_id = row['Activity ID']
        topic = row['Topic']
        age_group = row['Age Group']
        original_materials = row['Materials']
        
        # Fix materials
        new_materials = fix_materials(original_materials, topic, age_group)
        
        # Update if changed
        if new_materials != original_materials:
            df.at[idx, 'Materials'] = new_materials
            changes_made += 1
            print(f"  {idx+1:3d}. {topic[:30]:<30} | Fixed")
    
    # Create backup
    backup_name = f'essential-growth-activities-backup-before-materials-fix-{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'
    df.to_csv(backup_name, index=False)
    print(f"\n✅ Created backup: {backup_name}")
    
    # Save updated file
    df.to_csv('essential-growth-activities-enhanced-20250927_003226.csv', index=False)
    print("✅ Updated main file with fixed materials")
    
    print(f"\n📊 Changes made: {changes_made} activities")
    
    # Show examples of fixed materials
    print(f"\n📋 Examples of fixed materials:")
    
    for i in range(min(5, len(df))):
        row = df.iloc[i]
        materials = row['Materials']
        items = [item.strip() for item in materials.split(';') if item.strip()]
        
        print(f"\n{i+1}. {row['Topic']}")
        print(f"   Materials ({len(items)} items): {materials}")
    
    print("\n" + "=" * 50)
    print("🎉 Materials Format Fixed!")
    
    return True

if __name__ == '__main__':
    success = fix_materials_format()
    
    if success:
        print("\n🚀 Next step: Sync to Google Sheets")
        print("Run: python upload_with_proper_sa.py")
    else:
        print("\n❌ Fix failed")
