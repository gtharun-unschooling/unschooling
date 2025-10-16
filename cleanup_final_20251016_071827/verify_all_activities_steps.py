#!/usr/bin/env python3
"""
🔍 Verify All Activities Have Specific Steps
Check that all 140 activities have personalized, specific steps
"""

import pandas as pd
from datetime import datetime

def verify_all_activities_steps():
    """Verify all activities have specific steps"""
    
    print("🔍 Verifying All Activities Have Specific Steps")
    print("=" * 60)
    
    # Read the CSV
    df = pd.read_csv('essential-growth-activities-enhanced-20250927_003226.csv')
    print(f"📊 Loaded {len(df)} activities")
    
    # Check for generic steps patterns
    generic_patterns = [
        "Choose a good time when baby is calm and alert",
        "Set up the activity in a safe, comfortable space",
        "Let baby explore at their own pace",
        "Stay close and watch for safety",
        "Talk to them about what they're doing",
        "Clean up when they're finished",
        "Clear a safe space for the activity",
        "Show them what to do, then let them try",
        "Stay nearby to help if needed",
        "Praise their efforts and creativity",
        "Let them explore and experiment",
        "Clean up together when finished"
    ]
    
    print(f"\n🔍 Checking for generic steps...")
    
    activities_with_generic_steps = []
    activities_with_specific_steps = []
    
    for idx, row in df.iterrows():
        activity_id = row['Activity ID']
        topic = row['Topic']
        steps = str(row['Steps']) if pd.notna(row['Steps']) else ''
        
        # Check if steps contain generic patterns
        is_generic = False
        for pattern in generic_patterns:
            if pattern in steps:
                is_generic = True
                break
        
        if is_generic:
            activities_with_generic_steps.append({
                'activity_id': activity_id,
                'topic': topic,
                'steps': steps
            })
        else:
            activities_with_specific_steps.append({
                'activity_id': activity_id,
                'topic': topic,
                'steps': steps
            })
    
    print(f"\n📊 Verification Results:")
    print(f"   - Total activities: {len(df)}")
    print(f"   - Activities with specific steps: {len(activities_with_specific_steps)}")
    print(f"   - Activities with generic steps: {len(activities_with_generic_steps)}")
    
    if activities_with_generic_steps:
        print(f"\n⚠️ Activities with generic steps ({len(activities_with_generic_steps)}):")
        for i, activity in enumerate(activities_with_generic_steps[:10], 1):
            print(f"   {i}. {activity['topic']}")
            print(f"      Steps: {activity['steps'][:100]}...")
        
        if len(activities_with_generic_steps) > 10:
            print(f"   ... and {len(activities_with_generic_steps) - 10} more")
    else:
        print(f"\n✅ All activities have specific steps!")
    
    # Show examples of specific steps
    print(f"\n📋 Examples of Specific Steps:")
    
    for i in range(min(10, len(activities_with_specific_steps))):
        activity = activities_with_specific_steps[i]
        steps = activity['steps']
        step_items = [item.strip() for item in steps.split(';') if item.strip()]
        
        print(f"\n{i+1}. {activity['topic']}")
        print(f"   Steps ({len(step_items)} total):")
        for j, step in enumerate(step_items, 1):
            print(f"      {j}. {step}")
    
    # Check step length distribution
    step_lengths = []
    for idx, row in df.iterrows():
        steps = str(row['Steps']) if pd.notna(row['Steps']) else ''
        step_items = [item.strip() for item in steps.split(';') if item.strip()]
        step_lengths.append(len(step_items))
    
    print(f"\n📊 Step Length Distribution:")
    print(f"   - Average steps per activity: {sum(step_lengths)/len(step_lengths):.1f}")
    print(f"   - Min steps: {min(step_lengths)}")
    print(f"   - Max steps: {max(step_lengths)}")
    
    # Count by step length
    from collections import Counter
    length_counts = Counter(step_lengths)
    for length in sorted(length_counts.keys()):
        print(f"   - {length} steps: {length_counts[length]} activities")
    
    # Check for empty steps
    empty_steps = df[df['Steps'].isna() | (df['Steps'] == '')].shape[0]
    print(f"\n📊 Empty Steps: {empty_steps} activities")
    
    # Final verification
    if len(activities_with_generic_steps) == 0 and empty_steps == 0:
        print(f"\n🎉 VERIFICATION COMPLETE!")
        print(f"✅ All {len(df)} activities have specific, personalized steps")
        print(f"✅ No generic steps found")
        print(f"✅ No empty steps found")
        print(f"✅ Average {sum(step_lengths)/len(step_lengths):.1f} steps per activity")
        return True
    else:
        print(f"\n❌ VERIFICATION FAILED!")
        print(f"❌ {len(activities_with_generic_steps)} activities still have generic steps")
        print(f"❌ {empty_steps} activities have empty steps")
        return False

if __name__ == '__main__':
    success = verify_all_activities_steps()
    
    if success:
        print(f"\n🎯 RESULT: All activities have specific steps - DONE!")
    else:
        print(f"\n🔧 RESULT: Some activities need specific steps - NOT DONE!")
