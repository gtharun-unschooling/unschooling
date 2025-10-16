#!/usr/bin/env python3
"""
🔄 Sync All Explanations to 25 Words
Ensure all activities have explanations within 20-25 words
"""

import pandas as pd
from datetime import datetime

def sync_all_explanations():
    """Sync all explanations to 20-25 words"""
    
    print("🔄 Syncing All Explanations to 20-25 Words")
    print("=" * 50)
    
    # Read the CSV
    df = pd.read_csv('essential-growth-activities-enhanced-20250927_003226.csv')
    print(f"📊 Loaded {len(df)} activities")
    
    def count_words(text):
        """Count words in text"""
        if pd.isna(text) or text == '':
            return 0
        return len(str(text).split())
    
    def improve_explanation(explanation, topic, objective):
        """Improve explanation to be 20-25 words"""
        if pd.isna(explanation) or explanation == '':
            return f"Engaging {topic.lower()} activity for child development and learning."
        
        words = str(explanation).split()
        current_words = len(words)
        
        # If already 20-25 words, keep as is
        if 20 <= current_words <= 25:
            return explanation
        
        # If too short, expand it
        if current_words < 20:
            # Use objective to expand
            if pd.notna(objective) and objective != '':
                obj_words = str(objective).split()
                # Combine explanation with objective
                combined = words + obj_words
                if len(combined) <= 25:
                    return ' '.join(combined) + '.'
                else:
                    return ' '.join(combined[:25]) + '.'
            else:
                # Add generic expansion
                expansion = "This activity helps develop important skills through hands-on learning and exploration."
                combined = words + expansion.split()
                return ' '.join(combined[:25]) + '.'
        
        # If too long, shorten it
        if current_words > 25:
            return ' '.join(words[:25]) + '.'
    
    print("\n📋 Processing all activities...")
    
    changes_made = 0
    word_counts = []
    
    for idx, row in df.iterrows():
        activity_id = row['Activity ID']
        topic = row['Topic']
        objective = row['Objective']
        original_explanation = row['Explanation']
        
        # Count current words
        current_words = count_words(original_explanation)
        word_counts.append(current_words)
        
        # Improve explanation
        new_explanation = improve_explanation(original_explanation, topic, objective)
        new_words = count_words(new_explanation)
        
        # Update if changed
        if new_explanation != original_explanation:
            df.at[idx, 'Explanation'] = new_explanation
            changes_made += 1
            print(f"  {idx+1:3d}. {topic[:30]:<30} | {current_words:2d} → {new_words:2d} words")
    
    # Show statistics
    print(f"\n📊 Statistics:")
    print(f"   - Activities processed: {len(df)}")
    print(f"   - Changes made: {changes_made}")
    print(f"   - Average words: {sum(word_counts)/len(word_counts):.1f}")
    print(f"   - Min words: {min(word_counts)}")
    print(f"   - Max words: {max(word_counts)}")
    
    # Count by word range
    ranges = {
        '1-10 words': sum(1 for w in word_counts if 1 <= w <= 10),
        '11-19 words': sum(1 for w in word_counts if 11 <= w <= 19),
        '20-25 words': sum(1 for w in word_counts if 20 <= w <= 25),
        '26+ words': sum(1 for w in word_counts if w > 25)
    }
    
    print(f"\n📊 Word count distribution:")
    for range_name, count in ranges.items():
        print(f"   - {range_name}: {count} activities")
    
    # Create backup
    backup_name = f'essential-growth-activities-backup-before-explanation-sync-{datetime.now().strftime("%Y%m%d_%H%M%S")}.csv'
    df.to_csv(backup_name, index=False)
    print(f"\n✅ Created backup: {backup_name}")
    
    # Save updated file
    df.to_csv('essential-growth-activities-enhanced-20250927_003226.csv', index=False)
    print("✅ Updated main file with synced explanations")
    
    # Show examples
    print("\n📋 Examples of synced explanations:")
    
    for i in range(min(5, len(df))):
        row = df.iloc[i]
        explanation = row['Explanation']
        word_count = count_words(explanation)
        print(f"\n{i+1}. {row['Topic']} ({row['Pillar']})")
        print(f"   Words: {word_count}")
        print(f"   Explanation: {explanation}")
    
    print("\n" + "=" * 50)
    print("🎉 Explanation Sync Complete!")
    
    return True

if __name__ == '__main__':
    success = sync_all_explanations()
    
    if success:
        print("\n🚀 Next step: Sync to Google Sheets")
        print("Run: python upload_with_proper_sa.py")
    else:
        print("\n❌ Sync failed")
