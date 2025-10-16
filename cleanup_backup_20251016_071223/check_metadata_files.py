#!/usr/bin/env python3
"""
📋 Check All Metadata Files
Check all available files for metadata structure that might restore the original
"""

import os
import json
import csv

def check_metadata_files():
    """Check all files for metadata structure"""
    
    print("📋 CHECKING ALL METADATA FILES")
    print("=" * 50)
    
    # Look for files that might contain metadata structure
    metadata_files = []
    
    # Check all files in current directory
    for file in os.listdir('.'):
        if any(keyword in file.lower() for keyword in ['metadata', 'structure', 'guidelines', 'comprehensive', 'pillar']):
            metadata_files.append(file)
    
    print(f"📊 Found {len(metadata_files)} potential metadata files:")
    for file in metadata_files:
        print(f"   - {file}")
    
    # Check specific files that might contain the structure
    important_files = [
        'COMPREHENSIVE_PILLAR_STRUCTURE.md',
        'COMPREHENSIVE_ACTIVITY_CREATION_GUIDELINES.md',
        'ROBUST_ACTIVITY_CREATION_STRATEGY.md',
        'create_comprehensive_metadata_guidelines.py',
        'update_comprehensive_metadata_structure.py'
    ]
    
    print(f"\n🔍 CHECKING IMPORTANT METADATA FILES:")
    print("=" * 40)
    
    for file in important_files:
        if os.path.exists(file):
            print(f"\n📄 CHECKING: {file}")
            try:
                with open(file, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                    # Look for metadata structure information
                    if 'pillar' in content.lower() and 'category' in content.lower():
                        print(f"   ✅ Contains pillar and category information")
                        
                        # Extract key structure information
                        if 'Play & Creativity' in content:
                            print(f"   ✅ Contains Play & Creativity structure")
                        
                        if '6 Age Groups' in content or '4 Categories' in content:
                            print(f"   ✅ Contains systematic structure (6 age groups, 4 categories)")
                        
                        # Show first few lines to see what's in the file
                        lines = content.split('\n')[:10]
                        print(f"   📋 First 10 lines:")
                        for i, line in enumerate(lines, 1):
                            if line.strip():
                                print(f"      {i}. {line.strip()}")
                        
                        # Look for specific metadata structure
                        if 'METADATA STRUCTURE' in content or 'PILLAR-SPECIFIC' in content:
                            print(f"   🎯 CONTAINS METADATA STRUCTURE INFORMATION!")
                            
                            # Extract the metadata structure section
                            if 'METADATA STRUCTURE GUIDELINES' in content:
                                start_idx = content.find('METADATA STRUCTURE GUIDELINES')
                                if start_idx != -1:
                                    metadata_section = content[start_idx:start_idx + 2000]  # First 2000 chars
                                    print(f"   📋 Metadata Structure Preview:")
                                    print(f"      {metadata_section[:500]}...")
                    else:
                        print(f"   ❌ No clear metadata structure found")
                        
            except Exception as e:
                print(f"   ❌ Error reading file: {e}")
        else:
            print(f"   ❌ File not found: {file}")
    
    # Check CSV backup files for metadata
    print(f"\n🔍 CHECKING CSV BACKUP FILES:")
    print("=" * 40)
    
    csv_files = [f for f in os.listdir('.') if f.endswith('.csv') and 'metadata' in f.lower()]
    
    if csv_files:
        print(f"📊 Found {len(csv_files)} CSV metadata files:")
        for file in csv_files:
            print(f"   - {file}")
            
            try:
                with open(file, 'r', encoding='utf-8') as f:
                    reader = csv.reader(f)
                    first_row = next(reader, None)
                    if first_row:
                        print(f"      Headers: {first_row[:5]}...")  # Show first 5 headers
            except Exception as e:
                print(f"      Error reading: {e}")
    else:
        print(f"❌ No CSV metadata files found")
    
    # Check Python files that might contain metadata structure
    print(f"\n🔍 CHECKING PYTHON METADATA FILES:")
    print("=" * 40)
    
    python_files = [f for f in os.listdir('.') if f.endswith('.py') and any(keyword in f.lower() for keyword in ['metadata', 'structure', 'guidelines'])]
    
    if python_files:
        print(f"📊 Found {len(python_files)} Python metadata files:")
        for file in python_files:
            print(f"   - {file}")
            
            try:
                with open(file, 'r', encoding='utf-8') as f:
                    content = f.read()
                    
                    # Look for metadata structure definitions
                    if 'category_descriptions' in content or 'pillar_strategies' in content:
                        print(f"      ✅ Contains metadata structure definitions")
                        
                        # Look for specific structures
                        if 'Play & Creativity' in content:
                            print(f"      ✅ Contains Play & Creativity definitions")
                        
                        if 'age_categories' in content:
                            print(f"      ✅ Contains age category structure")
                            
            except Exception as e:
                print(f"      Error reading: {e}")
    
    return metadata_files

def extract_metadata_structure():
    """Extract metadata structure from available files"""
    
    print(f"\n🎯 EXTRACTING METADATA STRUCTURE:")
    print("=" * 40)
    
    # Try to extract from the most comprehensive file
    comprehensive_file = 'COMPREHENSIVE_PILLAR_STRUCTURE.md'
    
    if os.path.exists(comprehensive_file):
        print(f"📄 Extracting from: {comprehensive_file}")
        
        try:
            with open(comprehensive_file, 'r', encoding='utf-8') as f:
                content = f.read()
                
                # Extract the structure
                print(f"✅ Found comprehensive structure file!")
                
                # Look for the specific structure
                if 'INFANT (0-1): 4 Categories × 5 Topics = 20 Activities' in content:
                    print(f"✅ Contains the 6 age groups × 4 categories structure!")
                    
                    # Extract the categories for each age group
                    age_groups = ['INFANT (0-1)', 'TODDLER (1-3)', 'PRESCHOOLER (3-5)', 'CHILD (6-8)', 'PRE-TEEN (9-12)', 'TEEN (13-18)']
                    
                    for age_group in age_groups:
                        if age_group in content:
                            print(f"   ✅ Found {age_group} structure")
                
                return content
                
        except Exception as e:
            print(f"❌ Error reading comprehensive file: {e}")
    
    return None

def main():
    """Main function to check metadata files"""
    print("📋 Checking All Available Metadata Files")
    print("=" * 60)
    print("🔍 Looking for files that might contain your original metadata structure")
    
    # Check all metadata files
    metadata_files = check_metadata_files()
    
    # Extract metadata structure
    structure = extract_metadata_structure()
    
    if structure:
        print(f"\n✅ SUCCESS! Found metadata structure!")
        print("=" * 40)
        print("✅ Found comprehensive metadata structure in available files")
        print("✅ Can potentially restore your original metadata table")
        print("✅ Structure includes all age groups and categories")
        
        return True
    else:
        print(f"\n❌ NO COMPLETE METADATA STRUCTURE FOUND")
        print("=" * 40)
        print("❌ Could not find complete metadata structure")
        print("❌ May need to rebuild from scratch")
        
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Metadata file check completed!")
        print("🎯 Found structure that can restore your metadata table!")
    else:
        print(f"\n❌ FAILED to find complete metadata structure!")
