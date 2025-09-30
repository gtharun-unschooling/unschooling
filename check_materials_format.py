#!/usr/bin/env python3
"""
🔍 Check Materials Format
Analyze materials section for formatting issues and unused information
"""

import pandas as pd
import re
from collections import Counter

def check_materials_format():
    """Check materials section for formatting issues"""
    
    print("🔍 Checking Materials Format")
    print("=" * 50)
    
    # Read the CSV
    df = pd.read_csv('essential-growth-activities-enhanced-20250927_003226.csv')
    print(f"📊 Loaded {len(df)} activities")
    
    # Analyze materials column
    materials_issues = []
    all_materials = []
    materials_stats = {
        'empty': 0,
        'too_short': 0,
        'too_long': 0,
        'format_issues': 0,
        'unclear_items': 0
    }
    
    print("\n📋 Analyzing materials...")
    
    for idx, row in df.iterrows():
        activity_id = row['Activity ID']
        topic = row['Topic']
        materials = str(row['Materials']) if pd.notna(row['Materials']) else ''
        
        # Check for issues
        issues = []
        
        # 1. Check if empty
        if not materials or materials.strip() == '':
            issues.append("Empty materials")
            materials_stats['empty'] += 1
        
        # 2. Check length
        if materials:
            items = [item.strip() for item in materials.split(';') if item.strip()]
            if len(items) < 2:
                issues.append("Too few items")
                materials_stats['too_short'] += 1
            elif len(items) > 8:
                issues.append("Too many items")
                materials_stats['too_long'] += 1
            
            # 3. Check format issues
            if ';' not in materials and len(items) > 1:
                issues.append("Missing semicolon separator")
                materials_stats['format_issues'] += 1
            
            # 4. Check for unclear items
            unclear_patterns = [
                r'\b(and|or|with|for|the|a|an)\b',  # Common words that might be unclear
                r'\b(etc|etc\.|\.\.\.)\b',  # Etcetera
                r'\b(various|different|some|any)\b',  # Vague terms
                r'\b(as needed|optional|if available)\b'  # Optional terms
            ]
            
            for item in items:
                for pattern in unclear_patterns:
                    if re.search(pattern, item.lower()):
                        issues.append(f"Unclear item: {item}")
                        materials_stats['unclear_items'] += 1
                        break
            
            # Collect all materials for analysis
            all_materials.extend(items)
        
        if issues:
            materials_issues.append({
                'activity_id': activity_id,
                'topic': topic,
                'materials': materials,
                'issues': issues
            })
    
    # Show statistics
    print(f"\n📊 Materials Statistics:")
    print(f"   - Total activities: {len(df)}")
    print(f"   - Empty materials: {materials_stats['empty']}")
    print(f"   - Too few items: {materials_stats['too_short']}")
    print(f"   - Too many items: {materials_stats['too_long']}")
    print(f"   - Format issues: {materials_stats['format_issues']}")
    print(f"   - Unclear items: {materials_stats['unclear_items']}")
    
    # Show most common materials
    material_counts = Counter(all_materials)
    print(f"\n📦 Most Common Materials:")
    for material, count in material_counts.most_common(10):
        print(f"   - {material}: {count} times")
    
    # Show issues
    if materials_issues:
        print(f"\n⚠️ Materials with Issues ({len(materials_issues)} activities):")
        for i, issue in enumerate(materials_issues[:10]):  # Show first 10
            print(f"\n{i+1}. {issue['topic']}")
            print(f"   Materials: {issue['materials']}")
            print(f"   Issues: {', '.join(issue['issues'])}")
        
        if len(materials_issues) > 10:
            print(f"\n... and {len(materials_issues) - 10} more activities with issues")
    else:
        print("\n✅ No major issues found in materials section!")
    
    # Check for specific problematic patterns
    print(f"\n🔍 Checking for specific issues...")
    
    problematic_patterns = {
        'vague_terms': [],
        'missing_specifics': [],
        'format_inconsistencies': [],
        'unclear_separators': []
    }
    
    for idx, row in df.iterrows():
        materials = str(row['Materials']) if pd.notna(row['Materials']) else ''
        topic = row['Topic']
        
        if materials:
            # Check for vague terms
            vague_terms = ['various', 'different', 'some', 'any', 'etc', 'etc.', '...']
            for term in vague_terms:
                if term.lower() in materials.lower():
                    problematic_patterns['vague_terms'].append({
                        'topic': topic,
                        'materials': materials,
                        'issue': f"Contains vague term: {term}"
                    })
            
            # Check for missing specifics
            if 'materials' in materials.lower() and 'specific' not in materials.lower():
                problematic_patterns['missing_specifics'].append({
                    'topic': topic,
                    'materials': materials,
                    'issue': "Mentions 'materials' but not specific"
                })
            
            # Check format inconsistencies
            if ';' in materials and ',' in materials:
                problematic_patterns['format_inconsistencies'].append({
                    'topic': topic,
                    'materials': materials,
                    'issue': "Mixed separators (; and ,)"
                })
    
    # Show problematic patterns
    for pattern_type, issues in problematic_patterns.items():
        if issues:
            print(f"\n⚠️ {pattern_type.replace('_', ' ').title()}:")
            for issue in issues[:5]:  # Show first 5
                print(f"   - {issue['topic']}: {issue['issue']}")
            if len(issues) > 5:
                print(f"   ... and {len(issues) - 5} more")
    
    # Show examples of good vs bad materials
    print(f"\n📋 Examples of Materials Format:")
    
    # Find examples of good materials
    good_examples = []
    bad_examples = []
    
    for idx, row in df.iterrows():
        materials = str(row['Materials']) if pd.notna(row['Materials']) else ''
        topic = row['Topic']
        
        if materials:
            items = [item.strip() for item in materials.split(';') if item.strip()]
            
            # Good example: 2-6 items, clear, specific
            if 2 <= len(items) <= 6 and all(len(item) > 3 for item in items):
                if len(good_examples) < 3:
                    good_examples.append({'topic': topic, 'materials': materials})
            
            # Bad example: too few, too many, or unclear
            elif len(items) < 2 or len(items) > 8 or any('various' in item.lower() for item in items):
                if len(bad_examples) < 3:
                    bad_examples.append({'topic': topic, 'materials': materials})
    
    print(f"\n✅ Good Examples:")
    for i, example in enumerate(good_examples, 1):
        print(f"   {i}. {example['topic']}")
        print(f"      Materials: {example['materials']}")
    
    print(f"\n❌ Bad Examples:")
    for i, example in enumerate(bad_examples, 1):
        print(f"   {i}. {example['topic']}")
        print(f"      Materials: {example['materials']}")
    
    return materials_issues

if __name__ == '__main__':
    issues = check_materials_format()
    
    if issues:
        print(f"\n🔧 Recommendation: Fix {len(issues)} activities with materials issues")
    else:
        print(f"\n✅ Materials section looks good!")
