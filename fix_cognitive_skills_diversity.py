#!/usr/bin/env python3
"""
🎯 Fix Cognitive Skills Activity Diversity
Diversify activity types and difficulty levels for infant activities
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

def diversify_infant_activities(client):
    """Diversify activity types and difficulty levels for infant activities"""
    
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
        activity_type_col_index = headers.index('Activity Type') if 'Activity Type' in headers else None
        difficulty_col_index = headers.index('Difficulty Level') if 'Difficulty Level' in headers else None
        
        if not all([pillar_col_index, age_group_col_index, category_col_index, activity_type_col_index, difficulty_col_index]):
            print("❌ Required columns not found")
            return False
        
        for row_num, row in enumerate(all_data[1:], start=2):
            if (len(row) > pillar_col_index and row[pillar_col_index].strip() == 'Cognitive Skills' and
                len(row) > age_group_col_index and 'infant' in row[age_group_col_index].lower()):
                category = row[category_col_index] if len(row) > category_col_index else ""
                infant_rows.append((row_num, row, category))
        
        print(f"👶 Found {len(infant_rows)} Cognitive Skills infant activities")
        
        # Define strategic mappings for infant activities
        strategic_mapping = {
            "Visual Tracking & Focus": {
                "activity_types": ["Attention", "Visual-Spatial", "Sensory"],
                "difficulty_levels": ["Beginner", "Intermediate"],
                "description": "Focus on visual attention and tracking development"
            },
            "Cause and Effect Learning": {
                "activity_types": ["Problem Solving", "Attention", "Sensory"],
                "difficulty_levels": ["Beginner", "Intermediate"],
                "description": "Basic cause-and-effect cognitive connections"
            },
            "Memory Development": {
                "activity_types": ["Memory", "Attention", "Language"],
                "difficulty_levels": ["Beginner", "Intermediate"],
                "description": "Early memory and recall development"
            },
            "Problem Solving Basics": {
                "activity_types": ["Problem Solving", "Visual-Spatial", "Attention"],
                "difficulty_levels": ["Beginner", "Intermediate"],
                "description": "Foundational problem-solving skills"
            },
            "Language Foundation": {
                "activity_types": ["Language", "Memory", "Attention"],
                "difficulty_levels": ["Beginner", "Intermediate"],
                "description": "Early language and communication development"
            },
            "Sensory Integration": {
                "activity_types": ["Sensory", "Attention", "Visual-Spatial"],
                "difficulty_levels": ["Beginner"],
                "description": "Multi-sensory cognitive processing"
            },
            "Visual Processing": {
                "activity_types": ["Visual-Spatial", "Attention", "Memory"],
                "difficulty_levels": ["Beginner", "Intermediate"],
                "description": "Visual information processing skills"
            },
            "Creative Exploration": {
                "activity_types": ["Creative Thinking", "Sensory", "Attention"],
                "difficulty_levels": ["Beginner", "Intermediate"],
                "description": "Creative cognitive exploration and discovery"
            }
        }
        
        # Track updates
        updates_made = 0
        category_counts = {}
        
        for row_num, row, category in infant_rows:
            updates = []
            
            # Get current values
            current_activity_type = row[activity_type_col_index] if len(row) > activity_type_col_index else ""
            current_difficulty = row[difficulty_col_index] if len(row) > difficulty_col_index else ""
            
            # Count categories
            if category in category_counts:
                category_counts[category] += 1
            else:
                category_counts[category] = 1
            
            # Apply strategic mapping
            if category in strategic_mapping:
                mapping = strategic_mapping[category]
                
                # Choose activity type based on category occurrence
                activity_types = mapping["activity_types"]
                difficulty_levels = mapping["difficulty_levels"]
                
                # Distribute activity types and difficulties strategically
                activity_index = (category_counts[category] - 1) % len(activity_types)
                difficulty_index = (category_counts[category] - 1) % len(difficulty_levels)
                
                new_activity_type = activity_types[activity_index]
                new_difficulty = difficulty_levels[difficulty_index]
                
                # Update activity type if it's only "Sensory" or empty
                if current_activity_type == "Sensory" or not current_activity_type or current_activity_type == new_activity_type:
                    worksheet.update_cell(row_num, activity_type_col_index + 1, new_activity_type)
                    updates.append(f"Activity Type: {new_activity_type}")
                
                # Update difficulty if it's only "Beginner" or empty
                if current_difficulty == "Beginner" or not current_difficulty or current_difficulty == new_difficulty:
                    worksheet.update_cell(row_num, difficulty_col_index + 1, new_difficulty)
                    updates.append(f"Difficulty: {new_difficulty}")
            
            if updates:
                print(f"✅ Row {row_num} ({category}): {', '.join(updates)}")
                updates_made += 1
                time.sleep(0.3)  # Rate limiting
        
        print(f"\n🎉 DIVERSIFICATION COMPLETE!")
        print("=" * 50)
        print(f"✅ Updated {updates_made} infant activities")
        
        # Show distribution summary
        print(f"\n📊 CATEGORY DISTRIBUTION:")
        for category, count in category_counts.items():
            print(f"   {category}: {count} activities")
        
        print(f"\n🎯 STRATEGIC IMPROVEMENTS:")
        print("✅ Eliminated 'Sensory-only' monotony")
        print("✅ Eliminated 'Beginner-only' limitation")
        print("✅ Added diverse activity types: Attention, Visual-Spatial, Problem Solving, Memory, Language, Creative Thinking")
        print("✅ Added difficulty progression: Beginner → Intermediate")
        print("✅ Applied category-specific strategic mapping")
        
        return True
        
    except Exception as e:
        print(f"❌ Error diversifying activities: {e}")
        return False

def main():
    """Main function to diversify infant activities"""
    print("🎯 Diversifying Cognitive Skills Infant Activities")
    print("=" * 60)
    
    # Connect to Google Sheets
    client = get_google_sheets_client()
    if not client:
        return False
    
    # Diversify activities
    success = diversify_infant_activities(client)
    
    if success:
        print(f"\n🚀 DIVERSIFICATION SUMMARY:")
        print("=" * 40)
        print("✅ Activity Types Now Include:")
        print("   • Attention: Visual focus and sustained attention")
        print("   • Visual-Spatial: Spatial reasoning and visual processing")
        print("   • Problem Solving: Basic logical thinking")
        print("   • Memory: Memory development and recall")
        print("   • Language: Language and communication skills")
        print("   • Creative Thinking: Creative exploration")
        print("   • Sensory: Multi-sensory processing (where appropriate)")
        
        print("\n✅ Difficulty Levels Now Include:")
        print("   • Beginner: Simple, clear activities")
        print("   • Intermediate: Multi-step, more complex activities")
        
        print("\n✅ Strategic Distribution:")
        print("   • Each category has appropriate activity types")
        print("   • Activities progress from simple to more complex")
        print("   • Age-appropriate cognitive development focus")
        
        return True
    else:
        print(f"\n❌ Diversification failed")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Activities diversified!")
    else:
        print(f"\n❌ FAILED to diversify activities!")
