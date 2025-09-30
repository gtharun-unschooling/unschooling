#!/usr/bin/env python3
"""
🔄 Comprehensive Cognitive Skills Restructure
Completely restructure infant activities with proper diversity
"""

import gspread
from google.oauth2.service_account import Credentials
import time

def get_google_sheets_client():
    """Connect to Google Sheets using credentials"""
    try:
        scope = [
            'https://spreadsheets.google.com/feeds',
            'https://www.googleapis.com/auth/spreadsheets',
            'https://www.googleapis.com/auth/drive',
            'https://www.googleapis.com/auth/drive.file'
        ]
        creds = Credentials.from_service_account_file('sheets-credentials.json', scopes=scope)
        client = gspread.authorize(creds)
        print("✅ Connected to Google Sheets")
        return client
    except Exception as e:
        print(f"❌ Error connecting to Google Sheets: {e}")
        return None

def restructure_infant_activities(client):
    """Completely restructure infant activities with proper diversity"""
    
    try:
        # Find the spreadsheet
        all_sheets = client.list_spreadsheet_files()
        target_sheet = None
        
        for sheet in all_sheets:
            title = sheet.get('name', sheet.get('title', '')).lower()
            if 'sample' in title or 'essential' in title:
                target_sheet = sheet
                break
        
        if not target_sheet:
            print("❌ No suitable spreadsheet found")
            return False
        
        # Open the spreadsheet
        spreadsheet = client.open_by_key(target_sheet['id'])
        worksheet = spreadsheet.get_worksheet(0)
        
        print(f"📤 Working with: {target_sheet.get('name', 'Unknown')}")
        
        # Get all data
        all_data = worksheet.get_all_values()
        if not all_data:
            print("❌ No data found")
            return False
        
        headers = all_data[0]
        print(f"📋 Found {len(headers)} columns")
        
        # Find Cognitive Skills infant rows
        infant_rows = []
        pillar_col_index = headers.index('Pillar') if 'Pillar' in headers else None
        age_group_col_index = headers.index('Age Group') if 'Age Group' in headers else None
        category_col_index = headers.index('Category') if 'Category' in headers else None
        category_desc_col_index = headers.index('Category Description') if 'Category Description' in headers else None
        activity_type_col_index = headers.index('Activity Type') if 'Activity Type' in headers else None
        difficulty_col_index = headers.index('Difficulty Level') if 'Difficulty Level' in headers else None
        
        if not all([pillar_col_index, age_group_col_index, category_col_index, activity_type_col_index, difficulty_col_index]):
            print("❌ Required columns not found")
            return False
        
        for row_num, row in enumerate(all_data[1:], start=2):
            if (len(row) > pillar_col_index and row[pillar_col_index].strip() == 'Cognitive Skills' and
                len(row) > age_group_col_index and 'infant' in row[age_group_col_index].lower()):
                infant_rows.append((row_num, row))
        
        print(f"👶 Found {len(infant_rows)} Cognitive Skills infant activities")
        
        # Define comprehensive cognitive categories for infants
        cognitive_categories = [
            {
                "category": "Visual Tracking & Focus",
                "description": "Develop visual attention and tracking abilities through engaging visual stimuli",
                "activity_types": ["Attention", "Visual-Spatial", "Sensory"],
                "difficulties": ["Beginner", "Intermediate"]
            },
            {
                "category": "Cause and Effect Learning",
                "description": "Build understanding of cause-and-effect relationships through interactive play",
                "activity_types": ["Problem Solving", "Attention", "Sensory"],
                "difficulties": ["Beginner", "Intermediate"]
            },
            {
                "category": "Memory Development",
                "description": "Enhance memory formation and recall through repetitive and engaging activities",
                "activity_types": ["Memory", "Attention", "Language"],
                "difficulties": ["Beginner", "Intermediate"]
            },
            {
                "category": "Problem Solving Basics",
                "description": "Introduce foundational problem-solving skills through age-appropriate challenges",
                "activity_types": ["Problem Solving", "Visual-Spatial", "Attention"],
                "difficulties": ["Beginner", "Intermediate"]
            },
            {
                "category": "Language Foundation",
                "description": "Develop early language skills and communication through interactive experiences",
                "activity_types": ["Language", "Memory", "Attention"],
                "difficulties": ["Beginner", "Intermediate"]
            },
            {
                "category": "Sensory Integration",
                "description": "Integrate multiple sensory experiences for comprehensive cognitive development",
                "activity_types": ["Sensory", "Attention", "Visual-Spatial"],
                "difficulties": ["Beginner"]
            },
            {
                "category": "Visual Processing",
                "description": "Enhance visual information processing and spatial awareness skills",
                "activity_types": ["Visual-Spatial", "Attention", "Memory"],
                "difficulties": ["Beginner", "Intermediate"]
            },
            {
                "category": "Creative Exploration",
                "description": "Foster creative thinking and exploration through open-ended activities",
                "activity_types": ["Creative Thinking", "Sensory", "Attention"],
                "difficulties": ["Beginner", "Intermediate"]
            }
        ]
        
        # Distribute activities across categories
        activities_per_category = len(infant_rows) // len(cognitive_categories)
        remaining_activities = len(infant_rows) % len(cognitive_categories)
        
        print(f"📊 Distributing {len(infant_rows)} activities across {len(cognitive_categories)} categories")
        print(f"   Base: {activities_per_category} activities per category")
        print(f"   Extra: {remaining_activities} activities distributed to first categories")
        
        # Track updates
        updates_made = 0
        category_index = 0
        activities_in_current_category = 0
        activities_assigned_to_category = activities_per_category + (1 if category_index < remaining_activities else 0)
        
        for row_num, row in infant_rows:
            # Get current category info
            current_category = cognitive_categories[category_index]
            
            # Choose activity type and difficulty for this category
            activity_types = current_category["activity_types"]
            difficulties = current_category["difficulties"]
            
            # Distribute within category
            type_index = activities_in_current_category % len(activity_types)
            difficulty_index = activities_in_current_category % len(difficulties)
            
            new_activity_type = activity_types[type_index]
            new_difficulty = difficulties[difficulty_index]
            
            # Update category information
            worksheet.update_cell(row_num, category_col_index + 1, current_category["category"])
            if category_desc_col_index:
                worksheet.update_cell(row_num, category_desc_col_index + 1, current_category["description"])
            
            # Update activity type
            worksheet.update_cell(row_num, activity_type_col_index + 1, new_activity_type)
            
            # Update difficulty
            worksheet.update_cell(row_num, difficulty_col_index + 1, new_difficulty)
            
            updates_made += 1
            activities_in_current_category += 1
            
            print(f"✅ Row {row_num}: {current_category['category']} | {new_activity_type} | {new_difficulty}")
            
            # Move to next category if current one is full
            if activities_in_current_category >= activities_assigned_to_category:
                category_index += 1
                if category_index < len(cognitive_categories):
                    activities_in_current_category = 0
                    activities_assigned_to_category = activities_per_category + (1 if category_index < remaining_activities else 0)
            
            time.sleep(0.2)  # Rate limiting
        
        print(f"\n🎉 RESTRUCTURE COMPLETE!")
        print("=" * 50)
        print(f"✅ Updated {updates_made} infant activities")
        
        # Show final distribution
        print(f"\n📊 FINAL CATEGORY DISTRIBUTION:")
        category_counts = {}
        for row_num, row in infant_rows:
            category = row[category_col_index] if len(row) > category_col_index else "Unknown"
            if category in category_counts:
                category_counts[category] += 1
            else:
                category_counts[category] = 1
        
        for category, count in category_counts.items():
            print(f"   {category}: {count} activities")
        
        print(f"\n🎯 STRATEGIC IMPROVEMENTS:")
        print("✅ Created 8 diverse cognitive categories")
        print("✅ Distributed activities evenly across categories")
        print("✅ Applied diverse activity types: Attention, Visual-Spatial, Problem Solving, Memory, Language, Creative Thinking, Sensory")
        print("✅ Applied difficulty progression: Beginner → Intermediate")
        print("✅ Each category has age-appropriate cognitive focus")
        
        return True
        
    except Exception as e:
        print(f"❌ Error restructuring activities: {e}")
        return False

def main():
    """Main function to restructure infant activities"""
    print("🔄 Comprehensive Cognitive Skills Infant Restructure")
    print("=" * 70)
    
    # Connect to Google Sheets
    client = get_google_sheets_client()
    if not client:
        return False
    
    # Restructure activities
    success = restructure_infant_activities(client)
    
    if success:
        print(f"\n🚀 RESTRUCTURE SUMMARY:")
        print("=" * 40)
        print("✅ PROBLEM SOLVED:")
        print("   • Eliminated single 'Sensory Exploration' category")
        print("   • Eliminated 'Sensory-only' activity type monotony")
        print("   • Eliminated 'Beginner-only' difficulty limitation")
        
        print("\n✅ NEW STRUCTURE:")
        print("   • 8 Diverse Cognitive Categories")
        print("   • 7 Different Activity Types")
        print("   • 2 Difficulty Levels (Beginner, Intermediate)")
        print("   • Strategic distribution across all categories")
        
        print("\n✅ COGNITIVE DEVELOPMENT FOCUS:")
        print("   • Visual Tracking & Focus")
        print("   • Cause and Effect Learning")
        print("   • Memory Development")
        print("   • Problem Solving Basics")
        print("   • Language Foundation")
        print("   • Sensory Integration")
        print("   • Visual Processing")
        print("   • Creative Exploration")
        
        print("\n✅ ACTIVITY TYPE DIVERSITY:")
        print("   • Attention: Focus and sustained attention")
        print("   • Visual-Spatial: Spatial reasoning")
        print("   • Problem Solving: Logical thinking")
        print("   • Memory: Memory development")
        print("   • Language: Communication skills")
        print("   • Creative Thinking: Creative exploration")
        print("   • Sensory: Multi-sensory processing")
        
        return True
    else:
        print(f"\n❌ Restructure failed")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Cognitive Skills infant activities restructured!")
    else:
        print(f"\n❌ FAILED to restructure activities!")
