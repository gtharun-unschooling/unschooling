#!/usr/bin/env python3
"""
Sync Essential Growth data from Google Sheets to local JSON files
"""

import gspread
from oauth2client.service_account import ServiceAccountCredentials
import json
import os
from datetime import datetime

# Pillar mapping
PILLARS = {
    1: {"name": "Play & Creativity", "slug": "play-creativity"},
    2: {"name": "Cognitive Skills", "slug": "cognitive-skills"},
    3: {"name": "Physical & Social Play", "slug": "physical-social-play"},
    4: {"name": "Language & Speech", "slug": "language-speech"},
    5: {"name": "Learning Tools", "slug": "learning-tools"},
    6: {"name": "Nature & Exploration", "slug": "nature-exploration"},
    7: {"name": "Mindfulness & Well-being", "slug": "mindfulness-wellbeing"},
    8: {"name": "Music & Rhythm", "slug": "music-rhythm"},
    9: {"name": "Visual Arts", "slug": "visual-arts"},
    10: {"name": "Science & Innovation", "slug": "science-innovation"},
    11: {"name": "Emotional Intelligence", "slug": "emotional-intelligence"},
    12: {"name": "Cultural Awareness", "slug": "cultural-awareness"},
    13: {"name": "Teamwork & Leadership", "slug": "teamwork-leadership"},
    14: {"name": "Problem Solving & Logic", "slug": "problem-solving-logic"},
    15: {"name": "Health & Fitness", "slug": "health-fitness"},
    16: {"name": "Social Skills", "slug": "social-skills"},
    17: {"name": "Fine Motor Skills", "slug": "fine-motor-skills"},
    18: {"name": "Memory & Recall", "slug": "memory-recall"}
}

def authenticate_sheets():
    """Authenticate with Google Sheets"""
    print("🔐 Authenticating with Google Sheets...")
    
    scope = [
        'https://spreadsheets.google.com/feeds',
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive'
    ]
    
    creds = ServiceAccountCredentials.from_json_keyfile_name(
        '../google-sheets-service-account.json', scope
    )
    client = gspread.authorize(creds)
    print("✅ Authenticated successfully")
    return client

def get_full_activities(client):
    """Get full activities for Pillar 1 & 2 from 'EG Activities' TAB"""
    print("\n📊 Fetching full activities from 'Sample 1' → 'EG Activities' tab...")
    
    try:
        # Open Sample 1 sheet
        spreadsheet = client.open("Sample 1")
        
        # Get the "EG Activities" tab (worksheet)
        worksheet = spreadsheet.worksheet("EG Activities")
        print(f"   ✅ Found 'EG Activities' tab")
        
        # Get all records
        records = worksheet.get_all_records()
        print(f"✅ Retrieved {len(records)} activities")
        
        # Organize by pillar
        pillar_1_activities = []
        pillar_2_activities = []
        
        for record in records:
            # Determine which pillar this activity belongs to
            pillar = record.get('Pillar', '')
            
            if 'play' in pillar.lower() and 'creativity' in pillar.lower():
                pillar_1_activities.append(record)
            elif 'cognitive' in pillar.lower():
                pillar_2_activities.append(record)
        
        print(f"   • Pillar 1 (Play & Creativity): {len(pillar_1_activities)} activities")
        print(f"   • Pillar 2 (Cognitive Skills): {len(pillar_2_activities)} activities")
        
        return {
            1: pillar_1_activities,
            2: pillar_2_activities
        }
        
    except Exception as e:
        print(f"❌ Error fetching activities: {e}")
        return {}

def get_activity_names(client):
    """Get activity names for all pillars from 'EG Activity Names' TAB"""
    print("\n📊 Fetching activity names from 'Sample 1' → 'EG Activity Names' tab...")
    
    try:
        # Open Sample 1 sheet
        spreadsheet = client.open("Sample 1")
        
        # Get the "EG Activity Names" tab (worksheet)
        worksheet = spreadsheet.worksheet("EG Activity Names")
        print(f"   ✅ Found 'EG Activity Names' tab")
        
        # Get all records
        records = worksheet.get_all_records()
        print(f"✅ Retrieved {len(records)} activity names")
        
        # Map section names to pillar numbers
        section_to_pillar = {
            'Play & Creativity': 1,
            'Cognitive Skills': 2,
            'Physical & Social Play': 3,
            'Language & Speech': 4,
            'Learning Tools': 5,
            'Nature & Exploration': 6,
            'Mindfulness & Well-being': 7,
            'Music & Rhythm': 8,
            'Visual Arts': 9,
            'Science & Innovation': 10,
            'Emotional Intelligence': 11,
            'Cultural Awareness': 12,
            'Teamwork & Leadership': 13,
            'Problem Solving & Logic': 14,
            'Health & Fitness': 15,
            'Social Skills': 16,
            'Fine Motor Skills': 17,
            'Memory & Recall': 18
        }
        
        # Organize by pillar
        pillar_names = {}
        for i in range(1, 19):  # All 18 pillars
            pillar_names[i] = []
        
        for record in records:
            section = record.get('Section', '')
            activity_name = record.get('Activity Name', '')
            age_group = record.get('Age Group', '')
            category = record.get('Category', '')
            
            # Map section to pillar number
            pillar_num = section_to_pillar.get(section, 0)
            
            if pillar_num and activity_name:
                pillar_names[pillar_num].append({
                    'name': activity_name,
                    'age_group': age_group,
                    'category': category
                })
        
        for pillar_num, names in pillar_names.items():
            if names:
                print(f"   • Pillar {pillar_num} ({PILLARS[pillar_num]['name']}): {len(names)} activities")
        
        return pillar_names
        
    except Exception as e:
        print(f"❌ Error fetching activity names: {e}")
        return {}

def convert_to_json_format(activities, age_group="All Ages"):
    """Convert sheet records to JSON format"""
    formatted_activities = []
    
    for i, activity in enumerate(activities, 1):
        formatted_activity = {
            "topicNumber": str(activity.get('SNo', i)),
            "topic": activity.get('Activity Name', activity.get('Topic', f'Activity {i}')),
            "objective": activity.get('Objective', ''),
            "explanation": activity.get('Explanation', ''),
            "estimatedTime": activity.get('Estimated Time', '20-30 min'),
            "age": activity.get('Age', age_group),
            "difficultyLevel": activity.get('Difficulty Level', ''),
            "supervisionLevel": activity.get('Supervision Level', ''),
            "additionalInfo": activity.get('Additional Information', ''),
            "pillar": activity.get('Pillar', ''),
            "category": activity.get('Category', ''),
            "hashtags": activity.get('Hashtags', '').split(',') if activity.get('Hashtags') else [],
            "activity": {
                "name": activity.get('Activity Name', activity.get('Topic', f'Activity {i}')),
                "materials": activity.get('Materials', '').split('\n') if activity.get('Materials') else [],
                "steps": activity.get('Steps', '').split('\n') if activity.get('Steps') else [],
                "skills": activity.get('Skills', '').split(',') if activity.get('Skills') else []
            }
        }
        formatted_activities.append(formatted_activity)
    
    return formatted_activities

def create_basic_activities_from_names(names, pillar_info):
    """Create basic activity structure from just names"""
    formatted_activities = []
    
    for i, activity_data in enumerate(names, 1):
        # Handle both dict and string formats
        if isinstance(activity_data, dict):
            name = activity_data.get('name', f'Activity {i}')
            age_group = activity_data.get('age_group', 'All Ages')
            category = activity_data.get('category', pillar_info['name'])
        else:
            name = activity_data
            age_group = 'All Ages'
            category = pillar_info['name']
        
        formatted_activity = {
            "topicNumber": str(i),
            "topic": name,
            "objective": f"Engage in {name} activities to develop {pillar_info['name'].lower()} skills",
            "explanation": f"This activity focuses on {name} within the {pillar_info['name']} pillar.",
            "estimatedTime": "20-30 min",
            "age": age_group,
            "difficultyLevel": "Medium",
            "supervisionLevel": "Moderate Supervision",
            "additionalInfo": "",
            "pillar": pillar_info['name'],
            "category": category,
            "hashtags": [],
            "activity": {
                "name": name,
                "materials": ["Basic materials needed"],
                "steps": ["Follow activity guidelines", "Engage with materials", "Complete activity"],
                "skills": [pillar_info['name']]
            }
        }
        formatted_activities.append(formatted_activity)
    
    return formatted_activities

def save_to_json(pillar_num, activities):
    """Save activities to JSON file"""
    pillar_info = PILLARS[pillar_num]
    pillar_dir = f"data/essential-growth/{pillar_info['slug']}"
    
    # Ensure directory exists
    os.makedirs(pillar_dir, exist_ok=True)
    
    # Create the activities.json structure
    activities_data = {
        "ageGroups": [
            {
                "ageGroup": "All Ages",
                "categories": [
                    {
                        "category": pillar_info['name'],
                        "description": f"Activities for {pillar_info['name']}",
                        "activities": activities
                    }
                ]
            }
        ],
        "totalActivities": len(activities),
        "lastUpdated": datetime.now().isoformat()
    }
    
    # Save to file
    file_path = f"{pillar_dir}/activities.json"
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(activities_data, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Saved {len(activities)} activities to {file_path}")

def main():
    """Main sync function"""
    print("=" * 70)
    print("🚀 SYNCING ESSENTIAL GROWTH DATA FROM GOOGLE SHEETS")
    print("=" * 70)
    
    # Authenticate
    client = authenticate_sheets()
    
    # Get full activities for Pillar 1 & 2
    full_activities = get_full_activities(client)
    
    # Get activity names for Pillars 3-18
    activity_names = get_activity_names(client)
    
    print("\n" + "=" * 70)
    print("💾 SAVING TO LOCAL JSON FILES")
    print("=" * 70)
    
    # Save Pillar 1 & 2 with full data
    for pillar_num in [1, 2]:
        if pillar_num in full_activities and full_activities[pillar_num]:
            activities_json = convert_to_json_format(full_activities[pillar_num])
            save_to_json(pillar_num, activities_json)
            print(f"   ✓ Pillar {pillar_num}: {PILLARS[pillar_num]['name']}")
    
    # Save Pillars 3-18 with basic structure from names
    print("\n💡 Saving remaining pillars (3-18) with activity names...")
    for pillar_num in range(3, 19):
        if pillar_num in activity_names and activity_names[pillar_num]:
            activities_json = create_basic_activities_from_names(
                activity_names[pillar_num],
                PILLARS[pillar_num]
            )
            save_to_json(pillar_num, activities_json)
            print(f"   ✓ Pillar {pillar_num}: {PILLARS[pillar_num]['name']} ({len(activities_json)} activities)")
    
    print("\n" + "=" * 70)
    print("✅ SYNC COMPLETE!")
    print("=" * 70)
    print("\n📁 Updated files in: backend/data/essential-growth/")
    print("\n🔍 Next steps:")
    print("   1. Review the updated JSON files")
    print("   2. Test locally")
    print("   3. Deploy to GCP if everything looks good")
    print()

if __name__ == '__main__':
    main()

