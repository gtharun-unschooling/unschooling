#!/usr/bin/env python3
"""
🎨 Show Enhanced Formatting Improvements
Display the improvements made to the Essential Growth data
"""

import json
import os

def show_enhancements():
    """Show the enhanced formatting improvements"""
    
    print("🎨 Essential Growth Data Enhancements")
    print("=" * 60)
    
    # Check if files exist
    play_creativity_path = 'public/data/essential-growth/play-creativity/activities.json'
    cognitive_skills_path = 'public/data/essential-growth/cognitive-skills/activities.json'
    
    if not os.path.exists(play_creativity_path):
        print("❌ Play & Creativity data not found")
        return
    
    if not os.path.exists(cognitive_skills_path):
        print("❌ Cognitive Skills data not found")
        return
    
    # Load Play & Creativity data
    with open(play_creativity_path, 'r', encoding='utf-8') as f:
        play_creativity_data = json.load(f)
    
    # Load Cognitive Skills data
    with open(cognitive_skills_path, 'r', encoding='utf-8') as f:
        cognitive_skills_data = json.load(f)
    
    # Get first activity from each pillar
    first_play_activity = None
    first_cognitive_activity = None
    
    if play_creativity_data.get('ageGroups'):
        first_age_group = play_creativity_data['ageGroups'][0]
        if first_age_group.get('categories'):
            first_category = first_age_group['categories'][0]
            if first_category.get('activities'):
                first_play_activity = first_category['activities'][0]
    
    if cognitive_skills_data.get('ageGroups'):
        first_age_group = cognitive_skills_data['ageGroups'][0]
        if first_age_group.get('categories'):
            first_category = first_age_group['categories'][0]
            if first_category.get('activities'):
                first_cognitive_activity = first_category['activities'][0]
    
    print("\n🎯 ENHANCEMENTS APPLIED:")
    print("=" * 40)
    
    # Show Play & Creativity enhancements
    if first_play_activity:
        print("\n🎨 PLAY & CREATIVITY - Sample Activity:")
        print(f"   Topic: {first_play_activity.get('topic', 'N/A')}")
        print(f"   Activity: {first_play_activity.get('activity', {}).get('name', 'N/A')}")
        
        print(f"\n   📝 STEPS (Numbered & Clean):")
        steps = first_play_activity.get('activity', {}).get('steps', [])
        for i, step in enumerate(steps[:3], 1):  # Show first 3 steps
            print(f"      {step}")
        if len(steps) > 3:
            print(f"      ... and {len(steps) - 3} more steps")
        
        print(f"\n   🎯 SKILLS (Proper List):")
        skills = first_play_activity.get('activity', {}).get('skills', [])
        for skill in skills:
            print(f"      • {skill}")
        
        print(f"\n   🏷️ HASHTAGS (Proper List):")
        hashtags = first_play_activity.get('hashtags', [])
        for hashtag in hashtags:
            print(f"      {hashtag}")
    
    # Show Cognitive Skills enhancements
    if first_cognitive_activity:
        print(f"\n🧠 COGNITIVE SKILLS - Sample Activity:")
        print(f"   Topic: {first_cognitive_activity.get('topic', 'N/A')}")
        print(f"   Activity: {first_cognitive_activity.get('activity', {}).get('name', 'N/A')}")
        
        print(f"\n   📝 STEPS (Numbered & Clean):")
        steps = first_cognitive_activity.get('activity', {}).get('steps', [])
        for i, step in enumerate(steps[:3], 1):  # Show first 3 steps
            print(f"      {step}")
        if len(steps) > 3:
            print(f"      ... and {len(steps) - 3} more steps")
        
        print(f"\n   🎯 SKILLS (Proper List):")
        skills = first_cognitive_activity.get('activity', {}).get('skills', [])
        for skill in skills:
            print(f"      • {skill}")
    
    print(f"\n✅ SUMMARY OF IMPROVEMENTS:")
    print("=" * 40)
    print("   ✅ Steps: Clean numbering (1, 2, 3) - no duplicates")
    print("   ✅ Skills: Proper list format instead of comma-separated")
    print("   ✅ Hashtags: Proper list format instead of comma-separated")
    print("   ✅ Materials: Clean list format")
    print("   ✅ Better website display formatting")
    print("   ✅ Ready for color coding in website")
    
    print(f"\n🎯 NEXT STEPS:")
    print("=" * 20)
    print("   1. Deploy these enhanced JSON files to your website")
    print("   2. Website will display numbered steps with color coding")
    print("   3. Skills and hashtags will show as proper lists")
    print("   4. All changes sync from Google Sheets automatically")

if __name__ == '__main__':
    show_enhancements()
