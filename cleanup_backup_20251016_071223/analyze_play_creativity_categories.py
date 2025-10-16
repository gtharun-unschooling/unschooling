#!/usr/bin/env python3
"""
🎨 Play & Creativity Category Analysis
Analyze category distribution and strategic allocation
"""

import gspread
from google.oauth2.service_account import Credentials
from collections import Counter

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

def analyze_play_creativity_categories(client):
    """Analyze Play & Creativity category distribution across all age groups"""
    
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
        
        # Find Play & Creativity rows
        play_creativity_rows = []
        pillar_col_index = headers.index('Pillar') if 'Pillar' in headers else None
        age_group_col_index = headers.index('Age Group') if 'Age Group' in headers else None
        category_col_index = headers.index('Category') if 'Category' in headers else None
        activity_type_col_index = headers.index('Activity Type') if 'Activity Type' in headers else None
        difficulty_col_index = headers.index('Difficulty Level') if 'Difficulty Level' in headers else None
        topic_col_index = headers.index('Topic') if 'Topic' in headers else None
        
        if not all([pillar_col_index, age_group_col_index, category_col_index]):
            print("❌ Required columns not found")
            return False
        
        for row_num, row in enumerate(all_data[1:], start=2):
            if (len(row) > pillar_col_index and row[pillar_col_index].strip() == 'Play & Creativity'):
                age_group = row[age_group_col_index] if len(row) > age_group_col_index else ""
                category = row[category_col_index] if len(row) > category_col_index else ""
                activity_type = row[activity_type_col_index] if len(row) > activity_type_col_index else ""
                difficulty = row[difficulty_col_index] if len(row) > difficulty_col_index else ""
                topic = row[topic_col_index] if len(row) > topic_col_index else ""
                play_creativity_rows.append((row_num, age_group, category, activity_type, difficulty, topic))
        
        print(f"🎨 Analyzing {len(play_creativity_rows)} Play & Creativity activities")
        
        # Group by age group
        age_groups = {}
        for row in play_creativity_rows:
            age_group = row[1]
            if age_group not in age_groups:
                age_groups[age_group] = []
            age_groups[age_group].append(row)
        
        print(f"\n📊 PLAY & CREATIVITY CATEGORY ANALYSIS:")
        print("=" * 70)
        
        # Overall analysis
        all_categories = [row[2] for row in play_creativity_rows]
        category_counts = Counter(all_categories)
        
        print(f"📈 OVERALL DISTRIBUTION:")
        print(f"   Total Play & Creativity activities: {len(play_creativity_rows)}")
        print(f"   Total categories: {len(category_counts)}")
        
        print(f"\n📋 ALL CATEGORIES DISTRIBUTION:")
        for category, count in category_counts.most_common():
            percentage = (count / len(play_creativity_rows)) * 100
            print(f"   {category}: {count} activities ({percentage:.1f}%)")
        
        # Age group analysis
        print(f"\n👶 AGE GROUP BREAKDOWN:")
        for age_group, activities in sorted(age_groups.items()):
            print(f"\n   🎯 {age_group} ({len(activities)} activities):")
            
            # Category distribution for this age group
            age_categories = Counter([row[2] for row in activities])
            for category, count in age_categories.most_common():
                percentage = (count / len(activities)) * 100
                print(f"     • {category}: {count} activities ({percentage:.1f}%)")
            
            # Activity type distribution
            age_activity_types = Counter([row[3] for row in activities])
            print(f"     Activity Types: {', '.join([f'{t}({c})' for t, c in age_activity_types.most_common()])}")
            
            # Difficulty distribution
            age_difficulties = Counter([row[4] for row in activities])
            print(f"     Difficulties: {', '.join([f'{d}({c})' for d, c in age_difficulties.most_common()])}")
        
        # Strategic analysis
        print(f"\n🎯 STRATEGIC ANALYSIS:")
        
        # Check for category balance
        avg_per_category = len(play_creativity_rows) / len(category_counts)
        print(f"   Average activities per category: {avg_per_category:.1f}")
        
        # Identify imbalances
        imbalanced_categories = []
        for category, count in category_counts.items():
            deviation = abs(count - avg_per_category)
            if deviation > avg_per_category * 0.5:  # More than 50% deviation
                imbalanced_categories.append((category, count, deviation))
        
        if imbalanced_categories:
            print(f"\n   ⚠️ POTENTIAL IMBALANCES:")
            for category, count, deviation in imbalanced_categories:
                print(f"     • {category}: {count} activities (deviation: {deviation:.1f})")
        else:
            print(f"   ✅ Category distribution is well-balanced")
        
        # Age-appropriate category analysis
        print(f"\n🧠 AGE-APPROPRIATE CATEGORY ANALYSIS:")
        
        age_appropriate_categories = {
            "Infant (0-1)": {
                "priority": ["Sensory Exploration", "Visual Stimulation", "Motor Development"],
                "secondary": ["Social Interaction", "Language Foundation"],
                "avoid": ["Complex Problem Solving", "Advanced Creative Projects"]
            },
            "Toddler (1-3)": {
                "priority": ["Motor Development", "Sensory Exploration", "Creative Expression"],
                "secondary": ["Social Interaction", "Language Foundation", "Problem Solving"],
                "avoid": ["Advanced Creative Projects", "Complex Problem Solving"]
            },
            "Preschooler (3-5)": {
                "priority": ["Creative Expression", "Problem Solving", "Social Interaction"],
                "secondary": ["Motor Development", "Sensory Exploration", "Language Foundation"],
                "avoid": []
            },
            "Child (6-8)": {
                "priority": ["Creative Expression", "Problem Solving", "Advanced Creative Projects"],
                "secondary": ["Social Interaction", "Motor Development"],
                "avoid": ["Sensory Exploration"]
            },
            "Pre-Teen (9-12)": {
                "priority": ["Advanced Creative Projects", "Problem Solving", "Creative Expression"],
                "secondary": ["Social Interaction"],
                "avoid": ["Sensory Exploration", "Motor Development"]
            },
            "Teen (13-18)": {
                "priority": ["Advanced Creative Projects", "Creative Expression", "Problem Solving"],
                "secondary": ["Social Interaction"],
                "avoid": ["Sensory Exploration", "Motor Development"]
            }
        }
        
        for age_group, activities in sorted(age_groups.items()):
            if age_group in age_appropriate_categories:
                print(f"\n   👶 {age_group}:")
                age_categories = [row[2] for row in activities]
                
                # Check priority categories
                priority_cats = age_appropriate_categories[age_group]["priority"]
                secondary_cats = age_appropriate_categories[age_group]["secondary"]
                avoid_cats = age_appropriate_categories[age_group]["avoid"]
                
                print(f"     Priority categories present: {[cat for cat in priority_cats if cat in age_categories]}")
                print(f"     Secondary categories present: {[cat for cat in secondary_cats if cat in age_categories]}")
                print(f"     Categories to avoid: {[cat for cat in avoid_cats if cat in age_categories]}")
        
        # Recommendations
        print(f"\n💡 RECOMMENDATIONS:")
        
        # Check for missing categories in each age group
        for age_group, activities in sorted(age_groups.items()):
            if age_group in age_appropriate_categories:
                age_categories = [row[2] for row in activities]
                priority_cats = age_appropriate_categories[age_group]["priority"]
                
                missing_priority = [cat for cat in priority_cats if cat not in age_categories]
                if missing_priority:
                    print(f"   ⚠️ {age_group}: Missing priority categories: {missing_priority}")
                else:
                    print(f"   ✅ {age_group}: All priority categories present")
        
        # Category distribution recommendations
        print(f"\n📊 CATEGORY DISTRIBUTION RECOMMENDATIONS:")
        
        # Calculate recommended distribution based on total activities
        total_activities = len(play_creativity_rows)
        num_categories = len(category_counts)
        
        # Priority-based allocation for Play & Creativity
        priority_allocation = {
            "Creative Expression": min(4, total_activities // 4),  # High priority
            "Problem Solving": min(3, total_activities // 6),
            "Social Interaction": min(3, total_activities // 6),
            "Motor Development": min(3, total_activities // 6),
            "Sensory Exploration": min(2, total_activities // 8),
            "Advanced Creative Projects": min(2, total_activities // 8),
            "Language Foundation": min(2, total_activities // 8),
            "Visual Stimulation": min(1, total_activities // 10)
        }
        
        print(f"   Recommended allocation (based on {total_activities} total activities):")
        for category, recommended in priority_allocation.items():
            current = category_counts.get(category, 0)
            status = "✅" if current == recommended else "⚠️"
            print(f"     {status} {category}: {current}/{recommended} activities")
        
        return True
        
    except Exception as e:
        print(f"❌ Error analyzing categories: {e}")
        return False

def main():
    """Main function to analyze Play & Creativity categories"""
    print("🎨 Play & Creativity Category Analysis")
    print("=" * 60)
    
    # Connect to Google Sheets
    client = get_google_sheets_client()
    if not client:
        return False
    
    # Analyze categories
    success = analyze_play_creativity_categories(client)
    
    if success:
        print(f"\n✅ Analysis completed!")
        return True
    else:
        print(f"\n❌ Analysis failed")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Play & Creativity category analysis completed!")
    else:
        print(f"\n❌ FAILED to analyze Play & Creativity categories!")
