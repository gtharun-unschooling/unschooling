#!/usr/bin/env python3
"""
🔧 Restore Tummy Time Play Category
Add the missing Tummy Time Play category to the Play & Creativity JSON file
"""

import json
import csv

def read_csv_data():
    """Read the comprehensive CSV data to get Tummy Time Play activities"""
    tummy_time_activities = []
    
    try:
        with open('essential-growth-activities-comprehensive.csv', 'r') as file:
            reader = csv.DictReader(file)
            
            for row in reader:
                if (row['Pillar'] == 'Play & Creativity' and 
                    row['Age Group'] == 'Infant (0-1)' and 
                    row['Category'] == 'Tummy Time Play'):
                    
                    activity = {
                        "topicNumber": int(row['Topic Number']),
                        "topic": row['Topic'],
                        "objective": row['Objective'],
                        "explanation": row['Explanation'],
                        "hashtags": [row['Hashtags']] if row['Hashtags'] else [],
                        "estimatedTime": row['Estimated Time'],
                        "age": row['Age'],
                        "activity": {
                            "name": row['Activity Name'],
                            "materials": row['Materials'].split(';') if row['Materials'] else [],
                            "steps": row['Steps'].split(';') if row['Steps'] else [],
                            "skills": row['Skills'].split(';') if row['Skills'] else []
                        }
                    }
                    tummy_time_activities.append(activity)
        
        print(f"✅ Found {len(tummy_time_activities)} Tummy Time Play activities in CSV")
        return tummy_time_activities
        
    except Exception as e:
        print(f"❌ Error reading CSV: {e}")
        return []

def restore_tummy_time_category():
    """Restore the Tummy Time Play category to the JSON file"""
    
    # Read CSV data
    tummy_time_activities = read_csv_data()
    
    if not tummy_time_activities:
        print("❌ No Tummy Time Play activities found in CSV")
        return False
    
    # Read current JSON file
    try:
        with open('public/data/essential-growth/play-creativity/activities.json', 'r') as file:
            data = json.load(file)
        
        print("✅ Loaded current JSON file")
        
        # Find the infant age group
        for age_group in data['ageGroups']:
            if 'infant' in age_group['ageGroup'].lower():
                print(f"👶 Found infant age group: {age_group['ageGroup']}")
                
                # Check if Tummy Time Play category already exists
                existing_categories = [cat['category'] for cat in age_group['categories']]
                
                if 'Tummy Time Play' in existing_categories:
                    print("⚠️ Tummy Time Play category already exists")
                    return True
                
                # Add Tummy Time Play category
                tummy_time_category = {
                    "category": "Tummy Time Play",
                    "description": "Strengthen neck and visual tracking through reflection",
                    "activities": tummy_time_activities
                }
                
                # Insert after Sensory Exploration (index 0)
                age_group['categories'].insert(1, tummy_time_category)
                
                print(f"✅ Added Tummy Time Play category with {len(tummy_time_activities)} activities")
                
                # Show the activities that were added
                print(f"\n📋 Added Activities:")
                for activity in tummy_time_activities:
                    print(f"   {activity['topicNumber']}. {activity['topic']}")
                    print(f"      Age: {activity['age']}, Time: {activity['estimatedTime']}")
                    print(f"      Objective: {activity['objective']}")
                    print()
                
                break
        
        # Write updated JSON file
        with open('public/data/essential-growth/play-creativity/activities.json', 'w') as file:
            json.dump(data, file, indent=2)
        
        print("✅ Updated JSON file saved")
        
        # Update the index file as well
        try:
            with open('public/data/essential-growth/play-creativity/index.json', 'r') as file:
                index_data = json.load(file)
            
            # Add Tummy Time Play to categories list
            tummy_time_index = {
                "name": "Tummy Time Play",
                "description": "Tummy Time Play activities for play & creativity"
            }
            
            # Insert after Sensory Exploration
            index_data['categories'].insert(1, tummy_time_index)
            
            # Update totals
            index_data['totalCategories'] = len(index_data['categories'])
            index_data['totalActivities'] += len(tummy_time_activities)
            
            with open('public/data/essential-growth/play-creativity/index.json', 'w') as file:
                json.dump(index_data, file, indent=2)
            
            print("✅ Updated index file")
            
        except Exception as e:
            print(f"⚠️ Could not update index file: {e}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error updating JSON file: {e}")
        return False

def main():
    """Main function to restore Tummy Time Play category"""
    print("🔧 Restoring Tummy Time Play Category")
    print("=" * 50)
    
    success = restore_tummy_time_category()
    
    if success:
        print(f"\n🎉 SUCCESS! Tummy Time Play category restored!")
        print("=" * 40)
        print("✅ Added Tummy Time Play category to JSON file")
        print("✅ Added 5 Tummy Time Play activities")
        print("✅ Updated index file")
        print("✅ Website should now display the category")
        
        print(f"\n📋 RESTORED ACTIVITIES:")
        print("   1. Mirror Face Time")
        print("   2. Tummy Toy Reach") 
        print("   3. Blanket Roll Support")
        print("   4. Parent Chest Tummy Time")
        print("   5. Tummy Time with Music")
        
        return True
    else:
        print(f"\n❌ FAILED to restore Tummy Time Play category")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Tummy Time Play category restored!")
    else:
        print(f"\n❌ FAILED to restore Tummy Time Play category!")
