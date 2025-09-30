#!/usr/bin/env python3
"""
🧠 Check Cognitive Skills JSON Categories
Check what categories actually exist in the Cognitive Skills JSON file
"""

import json
from collections import Counter

def check_cognitive_skills_json():
    """Check categories in Cognitive Skills JSON file"""
    print("🧠 CHECKING COGNITIVE SKILLS JSON FILE:")
    print("=" * 60)
    
    try:
        # Read the JSON file
        json_file = "public/data/essential-growth/cognitive-skills/activities.json"
        with open(json_file, 'r') as f:
            data = json.load(f)
        
        print(f"✅ Loaded JSON file: {json_file}")
        
        # Find infant data
        infant_categories = []
        for age_group in data.get('ageGroups', []):
            if 'infant' in age_group.get('ageGroup', '').lower():
                print(f"\n👶 Found age group: {age_group.get('ageGroup')}")
                
                for category in age_group.get('categories', []):
                    category_name = category.get('category', '')
                    activities_count = len(category.get('activities', []))
                    infant_categories.append((category_name, activities_count))
                    
                    print(f"   📁 Category: {category_name} ({activities_count} activities)")
                    
                    # Show first few activities
                    activities = category.get('activities', [])
                    for i, activity in enumerate(activities[:3]):  # Show first 3
                        topic = activity.get('topic', 'No topic')
                        print(f"      {i+1}. {topic}")
                    if len(activities) > 3:
                        print(f"      ... and {len(activities) - 3} more activities")
        
        print(f"\n📊 COGNITIVE SKILLS JSON SUMMARY:")
        print(f"   Total infant categories: {len(infant_categories)}")
        print(f"   Total infant activities: {sum(count for _, count in infant_categories)}")
        
        # Show all age groups for comparison
        print(f"\n👥 ALL AGE GROUPS IN COGNITIVE SKILLS:")
        for age_group in data.get('ageGroups', []):
            age_name = age_group.get('ageGroup', 'Unknown')
            categories_count = len(age_group.get('categories', []))
            activities_count = sum(len(cat.get('activities', [])) for cat in age_group.get('categories', []))
            print(f"   • {age_name}: {categories_count} categories, {activities_count} activities")
        
        return infant_categories
        
    except Exception as e:
        print(f"❌ Error reading Cognitive Skills JSON file: {e}")
        return []

def main():
    """Main function to check Cognitive Skills JSON categories"""
    print("🧠 Checking Cognitive Skills JSON Categories")
    print("=" * 60)
    
    # Check JSON categories
    infant_categories = check_cognitive_skills_json()
    
    if infant_categories:
        print(f"\n✅ SUCCESS! Found {len(infant_categories)} categories in Cognitive Skills JSON")
        return True
    else:
        print(f"\n❌ FAILED to read Cognitive Skills JSON")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Cognitive Skills JSON analysis completed!")
    else:
        print(f"\n❌ FAILED to analyze Cognitive Skills JSON!")
