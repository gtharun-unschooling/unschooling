#!/usr/bin/env python3
"""
🔍 Check Steps Format
Analyze steps section for clarity and completeness
"""

import pandas as pd
import re
from collections import Counter

def check_steps_format():
    """Check steps section for clarity and completeness"""
    
    print("🔍 Checking Steps Format")
    print("=" * 50)
    
    # Read the CSV
    df = pd.read_csv('essential-growth-activities-enhanced-20250927_003226.csv')
    print(f"📊 Loaded {len(df)} activities")
    
    # Analyze steps column
    steps_issues = []
    all_steps = []
    steps_stats = {
        'empty': 0,
        'too_short': 0,
        'too_long': 0,
        'unclear_instructions': 0,
        'missing_details': 0,
        'vague_terms': 0
    }
    
    print("\n📋 Analyzing steps...")
    
    for idx, row in df.iterrows():
        activity_id = row['Activity ID']
        topic = row['Topic']
        steps = str(row['Steps']) if pd.notna(row['Steps']) else ''
        
        # Check for issues
        issues = []
        
        # 1. Check if empty
        if not steps or steps.strip() == '':
            issues.append("Empty steps")
            steps_stats['empty'] += 1
        
        # 2. Check length
        if steps:
            step_items = [item.strip() for item in steps.split(';') if item.strip()]
            if len(step_items) < 3:
                issues.append("Too few steps")
                steps_stats['too_short'] += 1
            elif len(step_items) > 15:
                issues.append("Too many steps")
                steps_stats['too_long'] += 1
            
            # 3. Check for unclear instructions
            unclear_patterns = [
                r'\b(do it|make it|use it|put it|get it)\b',  # Vague actions
                r'\b(somehow|somewhere|something|anything)\b',  # Vague terms
                r'\b(etc|etc\.|\.\.\.)\b',  # Etcetera
                r'\b(and so on|and more|and others)\b',  # Vague continuations
                r'\b(as needed|if needed|if required)\b',  # Conditional terms
                r'\b(optional|maybe|perhaps)\b'  # Optional terms
            ]
            
            for step in step_items:
                for pattern in unclear_patterns:
                    if re.search(pattern, step.lower()):
                        issues.append(f"Unclear step: {step[:50]}...")
                        steps_stats['unclear_instructions'] += 1
                        break
            
            # 4. Check for missing details
            detail_patterns = [
                r'\b(place|put|set)\b(?!\s+(the|a|an|your|their))',  # Place without object
                r'\b(use|get|take)\b(?!\s+(the|a|an|your|their))',  # Use without object
                r'\b(make|create|build)\b(?!\s+(the|a|an|your|their))',  # Make without object
                r'\b(show|demonstrate|explain)\b(?!\s+(the|a|an|your|their))'  # Show without object
            ]
            
            for step in step_items:
                for pattern in detail_patterns:
                    if re.search(pattern, step.lower()):
                        issues.append(f"Missing details: {step[:50]}...")
                        steps_stats['missing_details'] += 1
                        break
            
            # 5. Check for vague terms
            vague_terms = ['various', 'different', 'some', 'any', 'etc', 'etc.', '...', 'and so on']
            for step in step_items:
                for term in vague_terms:
                    if term.lower() in step.lower():
                        issues.append(f"Vague term: {step[:50]}...")
                        steps_stats['vague_terms'] += 1
                        break
            
            # Collect all steps for analysis
            all_steps.extend(step_items)
        
        if issues:
            steps_issues.append({
                'activity_id': activity_id,
                'topic': topic,
                'steps': steps,
                'issues': issues
            })
    
    # Show statistics
    print(f"\n📊 Steps Statistics:")
    print(f"   - Total activities: {len(df)}")
    print(f"   - Empty steps: {steps_stats['empty']}")
    print(f"   - Too few steps: {steps_stats['too_short']}")
    print(f"   - Too many steps: {steps_stats['too_long']}")
    print(f"   - Unclear instructions: {steps_stats['unclear_instructions']}")
    print(f"   - Missing details: {steps_stats['missing_details']}")
    print(f"   - Vague terms: {steps_stats['vague_terms']}")
    
    # Show most common step patterns
    step_patterns = Counter()
    for step in all_steps:
        # Extract action words
        action_words = re.findall(r'\b(place|put|set|use|get|take|make|create|build|show|demonstrate|explain|help|guide|supervise|watch|observe|encourage|support|assist)\b', step.lower())
        for action in action_words:
            step_patterns[action] += 1
    
    print(f"\n📝 Most Common Action Words:")
    for action, count in step_patterns.most_common(10):
        print(f"   - {action}: {count} times")
    
    # Show issues
    if steps_issues:
        print(f"\n⚠️ Steps with Issues ({len(steps_issues)} activities):")
        for i, issue in enumerate(steps_issues[:10]):  # Show first 10
            print(f"\n{i+1}. {issue['topic']}")
            print(f"   Steps: {issue['steps'][:100]}...")
            print(f"   Issues: {', '.join(issue['issues'])}")
        
        if len(steps_issues) > 10:
            print(f"\n... and {len(steps_issues) - 10} more activities with issues")
    else:
        print("\n✅ No major issues found in steps section!")
    
    # Show examples of good vs bad steps
    print(f"\n📋 Examples of Steps Format:")
    
    # Find examples of good steps
    good_examples = []
    bad_examples = []
    
    for idx, row in df.iterrows():
        steps = str(row['Steps']) if pd.notna(row['Steps']) else ''
        topic = row['Topic']
        
        if steps:
            step_items = [item.strip() for item in steps.split(';') if item.strip()]
            
            # Good example: 3-10 steps, clear, specific
            if 3 <= len(step_items) <= 10 and all(len(item) > 10 for item in step_items):
                if len(good_examples) < 3:
                    good_examples.append({'topic': topic, 'steps': steps})
            
            # Bad example: too few, too many, or unclear
            elif len(step_items) < 3 or len(step_items) > 15 or any('do it' in item.lower() for item in step_items):
                if len(bad_examples) < 3:
                    bad_examples.append({'topic': topic, 'steps': steps})
    
    print(f"\n✅ Good Examples:")
    for i, example in enumerate(good_examples, 1):
        print(f"   {i}. {example['topic']}")
        print(f"      Steps: {example['steps'][:150]}...")
    
    print(f"\n❌ Bad Examples:")
    for i, example in enumerate(bad_examples, 1):
        print(f"   {i}. {example['topic']}")
        print(f"      Steps: {example['steps'][:150]}...")
    
    return steps_issues

if __name__ == '__main__':
    issues = check_steps_format()
    
    if issues:
        print(f"\n🔧 Recommendation: Fix {len(issues)} activities with steps issues")
    else:
        print(f"\n✅ Steps section looks good!")
