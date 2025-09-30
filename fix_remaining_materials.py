#!/usr/bin/env python3
"""
🔧 Fix Remaining Materials Issues
Fix the remaining 36 activities with materials issues
"""

import pandas as pd
from datetime import datetime

def fix_remaining_materials():
    """Fix remaining materials issues"""
    
    print("🔧 Fixing Remaining Materials Issues")
    print("=" * 50)
    
    # Read the CSV
    df = pd.read_csv('essential-growth-activities-enhanced-20250927_003226.csv')
    print(f"📊 Loaded {len(df)} activities")
    
    # Specific fixes for remaining issues
    specific_fixes = {
        'Safe textured materials (silk, sponge, cotton); Tray or shallow container': 'Silk fabric; Sponge; Cotton balls; Tray; Shallow container',
        'Different textured fabrics; Soft play area': 'Silk fabric; Cotton fabric; Velvet fabric; Soft play mat',
        'Soft towel or blanket; Soft play mat; Cushions': 'Soft towel; Blanket; Soft play mat; Cushions',
        'Soft music or musical toys; Play mat': 'Musical toys; Soft music player; Play mat',
        'Crinkle fabric or toys; Soft play mat; Cushions': 'Crinkle fabric; Soft toys; Soft play mat; Cushions',
        'Small bottles; Rice or beads; Tape': 'Small plastic bottles; Rice; Small beads; Tape',
        'Musical mat or toys; Soft play mat; Cushions': 'Musical mat; Musical toys; Soft play mat; Cushions',
        'Soft cloth or blanket; Soft play mat; Cushions': 'Soft cloth; Blanket; Soft play mat; Cushions',
        'Hands or soft cloth; Soft play mat; Cushions': 'Hands; Soft cloth; Soft play mat; Cushions',
        'Toy pots, pans, and food; Safe toys; Soft play area': 'Toy pots; Toy pans; Toy food; Safe play area',
        'Different colored blocks; Soft play area': 'Red blocks; Blue blocks; Yellow blocks; Green blocks',
        'Various musical instruments; Soft play area': 'Drum; Shaker; Bell; Soft play area',
        'Different textured materials; Soft play area': 'Silk fabric; Cotton fabric; Velvet fabric; Soft play area',
        'Various art supplies; Soft play area': 'Paper; Markers; Crayons; Soft play area',
        'Different sized objects; Soft play area': 'Small objects; Medium objects; Large objects; Soft play area',
        'Various craft materials; Soft play area': 'Paper; Glue; Scissors; Soft play area',
        'Different colored items; Soft play area': 'Red items; Blue items; Yellow items; Green items',
        'Various building materials; Soft play area': 'Blocks; Legos; Cardboard; Soft play area',
        'Different shaped objects; Soft play area': 'Circle objects; Square objects; Triangle objects; Soft play area',
        'Various sensory materials; Soft play area': 'Sand; Water; Play dough; Soft play area',
        'Different sized containers; Soft play area': 'Small containers; Medium containers; Large containers; Soft play area',
        'Various art tools; Soft play area': 'Paint brushes; Paints; Paper; Soft play area',
        'Different colored papers; Soft play area': 'Red paper; Blue paper; Yellow paper; Green paper',
        'Various craft tools; Soft play area': 'Scissors; Glue; Tape; Soft play area',
        'Different textured papers; Soft play area': 'Smooth paper; Rough paper; Glossy paper; Soft play area',
        'Various building blocks; Soft play area': 'Wooden blocks; Plastic blocks; Foam blocks; Soft play area',
        'Different sized balls; Soft play area': 'Small balls; Medium balls; Large balls; Soft play area',
        'Various puzzle pieces; Soft play area': 'Puzzle pieces; Puzzle board; Soft play area',
        'Different colored markers; Soft play area': 'Red markers; Blue markers; Yellow markers; Green markers',
        'Various art papers; Soft play area': 'Construction paper; Drawing paper; Colored paper; Soft play area',
        'Different sized toys; Soft play area': 'Small toys; Medium toys; Large toys; Soft play area',
        'Various craft papers; Soft play area': 'Tissue paper; Construction paper; Wrapping paper; Soft play area',
        'Different colored crayons; Soft play area': 'Red crayons; Blue crayons; Yellow crayons; Green crayons',
        'Various art brushes; Soft play area': 'Paint brushes; Watercolor brushes; Soft play area',
        'Different sized containers; Soft play area': 'Small containers; Medium containers; Large containers; Soft play area',
        'Various craft scissors; Soft play area': 'Safety scissors; Decorative scissors; Soft play area'
    }
    
    print("\n📋 Applying specific fixes...")
    
    changes_made = 0
    
    for idx, row in df.iterrows():
        materials = str(row['Materials']) if pd.notna(row['Materials']) else ''
        topic = row['Topic']
        
        # Apply specific fixes
        for old, new in specific_fixes.items():
            if old in materials:
                df.at[idx, 'Materials'] = new
                changes_made += 1
                print(f"  {idx+1:3d}. {topic[:30]:<30} | Fixed")
                break
    
    # Create backup
    backup_name = f'essential-growth-activities-backup-before-final-materials-fix-{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'
    df.to_csv(backup_name, index=False)
    print(f"\n✅ Created backup: {backup_name}")
    
    # Save updated file
    df.to_csv('essential-growth-activities-enhanced-20250927_003226.csv', index=False)
    print("✅ Updated main file with final materials fixes")
    
    print(f"\n📊 Changes made: {changes_made} activities")
    
    print("\n" + "=" * 50)
    print("🎉 Final Materials Fix Complete!")
    
    return True

if __name__ == '__main__':
    success = fix_remaining_materials()
    
    if success:
        print("\n🚀 Next step: Sync to Google Sheets")
        print("Run: python upload_with_proper_sa.py")
    else:
        print("\n❌ Fix failed")
