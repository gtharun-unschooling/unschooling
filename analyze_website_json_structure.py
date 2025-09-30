#!/usr/bin/env python3
"""
🌐 Website JSON Structure Analysis
Analyze what the website actually displays from JSON files
"""

import json
from collections import Counter

def analyze_json_file(file_path, pillar_name):
    """Analyze a JSON file structure"""
    print(f"📄 ANALYZING {pillar_name.upper()} JSON FILE:")
    print("=" * 60)
    
    try:
        with open(file_path, 'r') as f:
            data = json.load(f)
        
        print(f"✅ Loaded: {file_path}")
        
        # Analyze age groups
        age_groups = data.get('ageGroups', [])
        print(f"📊 Total age groups: {len(age_groups)}")
        
        total_activities = 0
        total_categories = 0
        
        for age_group in age_groups:
            age_name = age_group.get('ageGroup', 'Unknown')
            categories = age_group.get('categories', [])
            activities_count = sum(len(cat.get('activities', [])) for cat in categories)
            
            total_activities += activities_count
            total_categories += len(categories)
            
            print(f"\n👶 {age_name}:")
            print(f"   Categories: {len(categories)}")
            print(f"   Activities: {activities_count}")
            
            # Show categories for this age group
            for category in categories:
                cat_name = category.get('category', 'Unknown')
                cat_desc = category.get('description', 'No description')
                cat_activities = len(category.get('activities', []))
                
                print(f"   📁 {cat_name} ({cat_activities} activities)")
                print(f"      Description: {cat_desc}")
                
                # Show first few activities
                activities = category.get('activities', [])
                for i, activity in enumerate(activities[:2]):  # Show first 2
                    topic = activity.get('topic', 'No topic')
                    age_range = activity.get('age', 'No age')
                    time_est = activity.get('estimatedTime', 'No time')
                    print(f"         {i+1}. {topic} ({age_range}, {time_est})")
                
                if len(activities) > 2:
                    print(f"         ... and {len(activities) - 2} more activities")
        
        print(f"\n📊 {pillar_name.upper()} SUMMARY:")
        print(f"   Total age groups: {len(age_groups)}")
        print(f"   Total categories: {total_categories}")
        print(f"   Total activities: {total_activities}")
        
        return {
            'age_groups': len(age_groups),
            'categories': total_categories,
            'activities': total_activities,
            'data': data
        }
        
    except Exception as e:
        print(f"❌ Error reading {file_path}: {e}")
        return None

def compare_pillars(play_creativity_data, cognitive_skills_data):
    """Compare the two pillars"""
    print(f"\n🔄 PILLAR COMPARISON:")
    print("=" * 60)
    
    if not play_creativity_data or not cognitive_skills_data:
        print("❌ Cannot compare - missing data")
        return
    
    print(f"📊 STRUCTURE COMPARISON:")
    print(f"   {'Metric':<20} {'Play & Creativity':<20} {'Cognitive Skills':<20} {'Winner':<15}")
    print(f"   {'-'*20} {'-'*20} {'-'*20} {'-'*15}")
    
    # Age groups comparison
    pc_ages = play_creativity_data['age_groups']
    cs_ages = cognitive_skills_data['age_groups']
    age_winner = "🏆 Cognitive Skills" if cs_ages > pc_ages else "🏆 Play & Creativity" if pc_ages > cs_ages else "🤝 Tie"
    print(f"   {'Age Groups':<20} {pc_ages:<20} {cs_ages:<20} {age_winner:<15}")
    
    # Categories comparison
    pc_cats = play_creativity_data['categories']
    cs_cats = cognitive_skills_data['categories']
    cat_winner = "🏆 Cognitive Skills" if cs_cats > pc_cats else "🏆 Play & Creativity" if pc_cats > cs_cats else "🤝 Tie"
    print(f"   {'Total Categories':<20} {pc_cats:<20} {cs_cats:<20} {cat_winner:<15}")
    
    # Activities comparison
    pc_acts = play_creativity_data['activities']
    cs_acts = cognitive_skills_data['activities']
    act_winner = "🏆 Cognitive Skills" if cs_acts > pc_acts else "🏆 Play & Creativity" if pc_acts > cs_acts else "🤝 Tie"
    print(f"   {'Total Activities':<20} {pc_acts:<20} {cs_acts:<20} {act_winner:<15}")
    
    # Infant-specific comparison
    print(f"\n👶 INFANT (0-1) SPECIFIC COMPARISON:")
    
    # Find infant data for both pillars
    pc_infant_cats = 0
    pc_infant_acts = 0
    cs_infant_cats = 0
    cs_infant_acts = 0
    
    for age_group in play_creativity_data['data'].get('ageGroups', []):
        if 'infant' in age_group.get('ageGroup', '').lower():
            pc_infant_cats = len(age_group.get('categories', []))
            pc_infant_acts = sum(len(cat.get('activities', [])) for cat in age_group.get('categories', []))
            break
    
    for age_group in cognitive_skills_data['data'].get('ageGroups', []):
        if 'infant' in age_group.get('ageGroup', '').lower():
            cs_infant_cats = len(age_group.get('categories', []))
            cs_infant_acts = sum(len(cat.get('activities', [])) for cat in age_group.get('categories', []))
            break
    
    print(f"   {'Infant Categories':<20} {pc_infant_cats:<20} {cs_infant_cats:<20} {'🏆 Cognitive Skills' if cs_infant_cats > pc_infant_cats else '🤝 Tie':<15}")
    print(f"   {'Infant Activities':<20} {pc_infant_acts:<20} {cs_infant_acts:<20} {'🤝 Tie' if pc_infant_acts == cs_infant_acts else ('🏆 Cognitive Skills' if cs_infant_acts > pc_infant_acts else '🏆 Play & Creativity'):<15}")
    
    # Strategic diversity analysis
    print(f"\n🎯 STRATEGIC DIVERSITY ANALYSIS:")
    
    # Play & Creativity infant categories
    pc_infant_categories = []
    for age_group in play_creativity_data['data'].get('ageGroups', []):
        if 'infant' in age_group.get('ageGroup', '').lower():
            for category in age_group.get('categories', []):
                cat_name = category.get('category', '')
                cat_count = len(category.get('activities', []))
                pc_infant_categories.append((cat_name, cat_count))
    
    # Cognitive Skills infant categories
    cs_infant_categories = []
    for age_group in cognitive_skills_data['data'].get('ageGroups', []):
        if 'infant' in age_group.get('ageGroup', '').lower():
            for category in age_group.get('categories', []):
                cat_name = category.get('category', '')
                cat_count = len(category.get('activities', []))
                cs_infant_categories.append((cat_name, cat_count))
    
    print(f"   📊 Play & Creativity infant categories:")
    for cat_name, count in pc_infant_categories:
        percentage = (count / pc_infant_acts) * 100
        print(f"      • {cat_name}: {count} activities ({percentage:.1f}%)")
    
    print(f"   🧠 Cognitive Skills infant categories:")
    for cat_name, count in cs_infant_categories:
        percentage = (count / cs_infant_acts) * 100
        print(f"      • {cat_name}: {count} activities ({percentage:.1f}%)")
    
    # Diversity score
    pc_diversity = len(pc_infant_categories)
    cs_diversity = len(cs_infant_categories)
    
    print(f"\n🏆 DIVERSITY SCORES:")
    print(f"   Play & Creativity: {pc_diversity} categories")
    print(f"   Cognitive Skills: {cs_diversity} categories")
    print(f"   Winner: {'🏆 Cognitive Skills' if cs_diversity > pc_diversity else '🤝 Tie'}")

def main():
    """Main function to analyze website JSON structure"""
    print("🌐 Website JSON Structure Analysis")
    print("=" * 70)
    
    # Analyze Play & Creativity
    play_creativity_data = analyze_json_file(
        "public/data/essential-growth/play-creativity/activities.json",
        "Play & Creativity"
    )
    
    print("\n" + "="*70)
    
    # Analyze Cognitive Skills
    cognitive_skills_data = analyze_json_file(
        "public/data/essential-growth/cognitive-skills/activities.json",
        "Cognitive Skills"
    )
    
    # Compare pillars
    if play_creativity_data and cognitive_skills_data:
        compare_pillars(play_creativity_data, cognitive_skills_data)
    
    print(f"\n✅ Website JSON analysis completed!")
    return True

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Website structure analysis completed!")
    else:
        print(f"\n❌ FAILED to analyze website structure!")
