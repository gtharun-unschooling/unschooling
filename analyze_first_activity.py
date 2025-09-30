#!/usr/bin/env python3
"""
🔍 Analyze First Activity
Analyze the first activity against metadata standards and identify corrections needed
"""

import pandas as pd
import os
from datetime import datetime

def analyze_first_activity():
    """Analyze the first activity against metadata standards"""
    
    print("🔍 Analyzing First Activity Against Metadata Standards")
    print("=" * 70)
    
    # Load the main data
    main_data_file = 'essential-growth-activities-enhanced-20250927_003226.csv'
    metadata_file = 'essential-growth-activities-metadata-updated.csv'
    
    try:
        # Load main data
        df_main = pd.read_csv(main_data_file)
        print(f"📊 Loaded main data: {len(df_main)} activities")
        
        # Load metadata
        df_metadata = pd.read_csv(metadata_file)
        print(f"📋 Loaded metadata: {len(df_metadata)} column definitions")
        
        # Get the first activity
        first_activity = df_main.iloc[0]
        print(f"\n🎯 Analyzing first activity:")
        print(f"   Activity ID: {first_activity['Activity ID']}")
        print(f"   Topic: {first_activity['Topic']}")
        print(f"   Pillar: {first_activity['Pillar']}")
        print(f"   Age Group: {first_activity['Age Group']}")
        
        # Create metadata lookup
        metadata_lookup = {}
        for _, row in df_metadata.iterrows():
            if row['Column Name'] != 'METADATA INFO':
                metadata_lookup[row['Column Name']] = row
        
        print(f"\n📋 Metadata standards loaded for {len(metadata_lookup)} columns")
        
        # Analyze each column
        corrections_needed = []
        
        print(f"\n🔍 Column-by-Column Analysis:")
        print("=" * 50)
        
        for column_name in df_main.columns:
            if column_name in metadata_lookup:
                current_value = str(first_activity[column_name])
                metadata = metadata_lookup[column_name]
                
                print(f"\n📝 {column_name}:")
                print(f"   Current: {current_value}")
                print(f"   Purpose: {metadata['Purpose']}")
                print(f"   Format: {metadata['Format']}")
                print(f"   Rules: {metadata['Rules']}")
                print(f"   Quality Standards: {metadata['Quality Standards']}")
                
                # Check for specific issues
                issues = []
                
                # Check word limits
                if pd.notna(metadata['Max Words']) and metadata['Max Words'] != '' and metadata['Max Words'] != 'N/A':
                    try:
                        max_words = int(metadata['Max Words'])
                        word_count = len(current_value.split())
                        if word_count > max_words:
                            issues.append(f"❌ Exceeds word limit: {word_count} words (max: {max_words})")
                        else:
                            print(f"   ✅ Word count: {word_count}/{max_words}")
                    except:
                        pass
                
                # Check item limits
                if pd.notna(metadata['Max Items']) and metadata['Max Items'] != '' and metadata['Max Items'] != 'N/A':
                    try:
                        max_items = int(metadata['Max Items'])
                        if ';' in current_value:
                            item_count = len([item.strip() for item in current_value.split(';') if item.strip()])
                        else:
                            item_count = 1 if current_value.strip() else 0
                        if item_count > max_items:
                            issues.append(f"❌ Exceeds item limit: {item_count} items (max: {max_items})")
                        else:
                            print(f"   ✅ Item count: {item_count}/{max_items}")
                    except:
                        pass
                
                # Check step limits
                if pd.notna(metadata['Max Steps']) and metadata['Max Steps'] != '' and metadata['Max Steps'] != 'N/A':
                    try:
                        max_steps = int(metadata['Max Steps'])
                        if ';' in current_value:
                            step_count = len([step.strip() for step in current_value.split(';') if step.strip()])
                        else:
                            step_count = 1 if current_value.strip() else 0
                        if step_count > max_steps:
                            issues.append(f"❌ Exceeds step limit: {step_count} steps (max: {max_steps})")
                        else:
                            print(f"   ✅ Step count: {step_count}/{max_steps}")
                    except:
                        pass
                
                # Check skill limits
                if pd.notna(metadata['Max Skills']) and metadata['Max Skills'] != '' and metadata['Max Skills'] != 'N/A':
                    try:
                        max_skills = int(metadata['Max Skills'])
                        if ',' in current_value:
                            skill_count = len([skill.strip() for skill in current_value.split(',') if skill.strip()])
                        else:
                            skill_count = 1 if current_value.strip() else 0
                        if skill_count > max_skills:
                            issues.append(f"❌ Exceeds skill limit: {skill_count} skills (max: {max_skills})")
                        else:
                            print(f"   ✅ Skill count: {skill_count}/{max_skills}")
                    except:
                        pass
                
                # Check hashtag limits
                if pd.notna(metadata['Max Hashtags']) and metadata['Max Hashtags'] != '' and metadata['Max Hashtags'] != 'N/A':
                    try:
                        max_hashtags = int(metadata['Max Hashtags'])
                        if ',' in current_value:
                            hashtag_count = len([tag.strip() for tag in current_value.split(',') if tag.strip()])
                        else:
                            hashtag_count = 1 if current_value.strip() else 0
                        if hashtag_count > max_hashtags:
                            issues.append(f"❌ Exceeds hashtag limit: {hashtag_count} hashtags (max: {max_hashtags})")
                        else:
                            print(f"   ✅ Hashtag count: {hashtag_count}/{max_hashtags}")
                    except:
                        pass
                
                # Check words per step
                if pd.notna(metadata['Max Words per Step']) and metadata['Max Words per Step'] != '' and metadata['Max Words per Step'] != 'N/A':
                    try:
                        max_words_per_step = int(metadata['Max Words per Step'])
                        if ';' in current_value:
                            steps = [step.strip() for step in current_value.split(';') if step.strip()]
                            for i, step in enumerate(steps):
                                step_word_count = len(step.split())
                                if step_word_count > max_words_per_step:
                                    issues.append(f"❌ Step {i+1} exceeds word limit: {step_word_count} words (max: {max_words_per_step})")
                                else:
                                    print(f"   ✅ Step {i+1} word count: {step_word_count}/{max_words_per_step}")
                    except:
                        pass
                
                # Check for predefined options
                if pd.notna(metadata['Options']) and metadata['Options'] != '' and metadata['Options'] != 'N/A':
                    valid_options = [opt.strip() for opt in metadata['Options'].split(',')]
                    if current_value not in valid_options:
                        issues.append(f"❌ Invalid option: '{current_value}' (valid: {', '.join(valid_options)})")
                    else:
                        print(f"   ✅ Valid option: {current_value}")
                
                # Check for empty values where required
                if current_value.strip() == '' or current_value.strip() == 'nan':
                    if 'required' in metadata['Rules'].lower() or 'must' in metadata['Rules'].lower():
                        issues.append(f"❌ Empty value where required")
                    else:
                        print(f"   ⚠️ Empty value (may be optional)")
                
                # Check for internal references in customer-facing columns
                if metadata['Customer Facing'] == 'Yes':
                    internal_phrases = ['supplied by us', 'our activity kit', 'our step-by-step guide', 'our tracking sheet']
                    for phrase in internal_phrases:
                        if phrase.lower() in current_value.lower():
                            issues.append(f"❌ Contains internal reference: '{phrase}' in customer-facing column")
                
                # Display issues
                if issues:
                    print(f"   🚨 Issues found:")
                    for issue in issues:
                        print(f"      {issue}")
                    corrections_needed.append({
                        'column': column_name,
                        'current_value': current_value,
                        'issues': issues,
                        'metadata': metadata
                    })
                else:
                    print(f"   ✅ No issues found")
        
        # Summary
        print(f"\n📊 Analysis Summary:")
        print("=" * 30)
        print(f"   Total columns analyzed: {len(df_main.columns)}")
        print(f"   Columns with issues: {len(corrections_needed)}")
        print(f"   Columns without issues: {len(df_main.columns) - len(corrections_needed)}")
        
        if corrections_needed:
            print(f"\n🚨 Corrections Needed:")
            print("=" * 30)
            for correction in corrections_needed:
                print(f"\n📝 {correction['column']}:")
                print(f"   Current: {correction['current_value']}")
                print(f"   Issues: {len(correction['issues'])}")
                for issue in correction['issues']:
                    print(f"      {issue}")
                print(f"   Rules: {correction['metadata']['Rules']}")
                print(f"   Quality Standards: {correction['metadata']['Quality Standards']}")
        else:
            print(f"\n✅ No corrections needed for the first activity!")
        
        return corrections_needed
        
    except Exception as e:
        print(f"❌ Error during analysis: {e}")
        return []

if __name__ == '__main__':
    corrections = analyze_first_activity()
    
    if corrections:
        print(f"\n🎯 Ready to make corrections for {len(corrections)} columns")
    else:
        print(f"\n✅ First activity meets all metadata standards!")
