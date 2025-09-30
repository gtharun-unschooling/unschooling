#!/usr/bin/env python3
"""
📦 Divide Materials into Home vs Kit Materials
Separate materials available at home vs materials to buy for monthly kits
"""

import pandas as pd
from datetime import datetime

def divide_materials_for_first_15():
    """Divide materials for first 15 activities"""
    
    print("📦 Dividing Materials: Home vs Kit")
    print("=" * 50)
    
    # Read the CSV
    df = pd.read_csv('essential-growth-activities-enhanced-20250927_003226.csv')
    print(f"📊 Loaded {len(df)} activities")
    
    # Work on first 15 activities only
    df_sample = df.head(15).copy()
    print(f"🎯 Working on first 15 activities")
    
    # Add new columns
    df_sample['Materials at Home'] = ''
    df_sample['Materials to Buy for Kit'] = ''
    
    # Define materials that are typically available at home
    home_materials = [
        'water', 'bowl', 'tray', 'shallow container', 'cotton balls', 'cotton',
        'fabric', 'fabrics', 'cloth', 'cloths', 'mirror', 'safe mirror',
        'soft play area', 'clean play area', 'play area', 'safe area',
        'soft surface', 'floor', 'table', 'chair', 'blanket', 'towel',
        'paper', 'cardboard', 'box', 'container', 'cup', 'cups', 'spoon',
        'spoons', 'plate', 'plates', 'book', 'books', 'pillow', 'pillows',
        'bed', 'sofa', 'couch', 'carpet', 'rug', 'mat', 'mats'
    ]
    
    # Define materials that need to be bought for kits
    kit_materials = [
        'textured materials', 'silk', 'sponge', 'cotton', 'ziplock bag',
        'gel', 'glitter', 'tape', 'floating toys', 'nature objects',
        'leaves', 'pinecones', 'sensory bag', 'high contrast cards',
        'black and white cards', 'activity stand', 'clips', 'play dough',
        'modeling clay', 'crayons', 'markers', 'colored pencils',
        'paint', 'brushes', 'construction paper', 'scissors', 'glue',
        'beads', 'string', 'yarn', 'buttons', 'blocks', 'toys',
        'musical instruments', 'rattle', 'squeaky toy', 'ball',
        'balls', 'puzzle', 'puzzles', 'cards', 'game', 'games'
    ]
    
    print("\n📋 Processing each activity...")
    
    for idx, row in df_sample.iterrows():
        activity_id = row['Activity ID']
        topic = row['Topic']
        materials = str(row['Materials']) if pd.notna(row['Materials']) else ''
        
        print(f"\n{idx+1:2d}. {topic}")
        print(f"    Original Materials: {materials[:100]}...")
        
        if materials:
            # Split materials by semicolon
            material_list = [m.strip() for m in materials.split(';') if m.strip()]
            
            home_mats = []
            kit_mats = []
            
            for material in material_list:
                material_lower = material.lower()
                
                # Check if it's a home material
                is_home = any(home_mat in material_lower for home_mat in home_materials)
                # Check if it's a kit material
                is_kit = any(kit_mat in material_lower for kit_mat in kit_materials)
                
                if is_home and not is_kit:
                    home_mats.append(material)
                elif is_kit or not is_home:
                    kit_mats.append(material)
                else:
                    # If unclear, put in kit materials (safer for planning)
                    kit_mats.append(material)
            
            # Update the dataframe
            df_sample.at[idx, 'Materials at Home'] = '; '.join(home_mats) if home_mats else 'None needed'
            df_sample.at[idx, 'Materials to Buy for Kit'] = '; '.join(kit_mats) if kit_mats else 'None needed'
            
            print(f"    🏠 Home: {home_mats}")
            print(f"    📦 Kit: {kit_mats}")
        else:
            df_sample.at[idx, 'Materials at Home'] = 'None specified'
            df_sample.at[idx, 'Materials to Buy for Kit'] = 'None specified'
            print(f"    ⚠️ No materials specified")
    
    # Create a sample file with the first 15 activities
    sample_filename = 'essential-growth-activities-sample-15.csv'
    df_sample.to_csv(sample_filename, index=False)
    
    print("\n" + "=" * 50)
    print("🎉 Materials Division Complete!")
    print(f"📁 Sample file created: {sample_filename}")
    print(f"📊 Activities processed: 15")
    
    # Show summary
    print("\n📊 Summary:")
    print("🏠 Materials typically available at home:")
    print("   - Basic household items (bowls, trays, containers)")
    print("   - Common fabrics and soft materials")
    print("   - Furniture and surfaces")
    print("   - Basic kitchen items")
    
    print("\n📦 Materials to buy for kits:")
    print("   - Specialized educational materials")
    print("   - Arts and crafts supplies")
    print("   - Sensory play items")
    print("   - Toys and games")
    print("   - Specialized equipment")
    
    print("\n🎯 Next steps:")
    print("1. Review the sample file: essential-growth-activities-sample-15.csv")
    print("2. If this looks good, run the script for all 140 activities")
    print("3. Use the 'Materials to Buy for Kit' column to plan monthly kits")
    
    return sample_filename

def divide_materials_for_all():
    """Divide materials for all activities"""
    
    print("📦 Dividing Materials for ALL Activities")
    print("=" * 50)
    
    # Read the CSV
    df = pd.read_csv('essential-growth-activities-enhanced-20250927_003226.csv')
    print(f"📊 Loaded {len(df)} activities")
    
    # Add new columns
    df['Materials at Home'] = ''
    df['Materials to Buy for Kit'] = ''
    
    # Define materials that are typically available at home
    home_materials = [
        'water', 'bowl', 'tray', 'shallow container', 'cotton balls', 'cotton',
        'fabric', 'fabrics', 'cloth', 'cloths', 'mirror', 'safe mirror',
        'soft play area', 'clean play area', 'play area', 'safe area',
        'soft surface', 'floor', 'table', 'chair', 'blanket', 'towel',
        'paper', 'cardboard', 'box', 'container', 'cup', 'cups', 'spoon',
        'spoons', 'plate', 'plates', 'book', 'books', 'pillow', 'pillows',
        'bed', 'sofa', 'couch', 'carpet', 'rug', 'mat', 'mats', 'plastic',
        'bottle', 'bottles', 'jar', 'jars', 'can', 'cans', 'bag', 'bags'
    ]
    
    # Define materials that need to be bought for kits
    kit_materials = [
        'textured materials', 'silk', 'sponge', 'cotton', 'ziplock bag',
        'gel', 'glitter', 'tape', 'floating toys', 'nature objects',
        'leaves', 'pinecones', 'sensory bag', 'high contrast cards',
        'black and white cards', 'activity stand', 'clips', 'play dough',
        'modeling clay', 'crayons', 'markers', 'colored pencils',
        'paint', 'brushes', 'construction paper', 'scissors', 'glue',
        'beads', 'string', 'yarn', 'buttons', 'blocks', 'toys',
        'musical instruments', 'rattle', 'squeaky toy', 'ball',
        'balls', 'puzzle', 'puzzles', 'cards', 'game', 'games',
        'sticker', 'stickers', 'foam', 'sponge', 'textured', 'sensory'
    ]
    
    print("\n📋 Processing all activities...")
    
    for idx, row in df.iterrows():
        materials = str(row['Materials']) if pd.notna(row['Materials']) else ''
        
        if materials:
            # Split materials by semicolon
            material_list = [m.strip() for m in materials.split(';') if m.strip()]
            
            home_mats = []
            kit_mats = []
            
            for material in material_list:
                material_lower = material.lower()
                
                # Check if it's a home material
                is_home = any(home_mat in material_lower for home_mat in home_materials)
                # Check if it's a kit material
                is_kit = any(kit_mat in material_lower for kit_mat in kit_materials)
                
                if is_home and not is_kit:
                    home_mats.append(material)
                elif is_kit or not is_home:
                    kit_mats.append(material)
                else:
                    # If unclear, put in kit materials (safer for planning)
                    kit_mats.append(material)
            
            # Update the dataframe
            df.at[idx, 'Materials at Home'] = '; '.join(home_mats) if home_mats else 'None needed'
            df.at[idx, 'Materials to Buy for Kit'] = '; '.join(kit_mats) if kit_mats else 'None needed'
    
    # Create backup
    backup_name = f'essential-growth-activities-backup-before-material-division-{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'
    df.to_csv(backup_name, index=False)
    print(f"✅ Created backup: {backup_name}")
    
    # Save updated file
    df.to_csv('essential-growth-activities-enhanced-20250927_003226.csv', index=False)
    print("✅ Updated main file with material divisions")
    
    print("\n🎉 All activities processed!")
    print(f"📊 Total activities: {len(df)}")
    
    return True

if __name__ == '__main__':
    print("📦 Material Division Tool")
    print("=" * 60)
    
    choice = input("Choose option:\n1. Process first 15 activities (sample)\n2. Process all 140 activities\nEnter choice (1 or 2): ")
    
    if choice == '1':
        sample_file = divide_materials_for_first_15()
        print(f"\n✅ Sample file created: {sample_file}")
        print("Review this file first, then run option 2 if it looks good.")
    elif choice == '2':
        success = divide_materials_for_all()
        if success:
            print("\n🚀 Next step: Sync to Google Sheets")
            print("Run: python upload_with_proper_sa.py")
    else:
        print("Invalid choice. Please run again and choose 1 or 2.")
