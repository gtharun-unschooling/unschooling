#!/usr/bin/env python3
"""
👁️ Visual Tracking & Focus Category Analysis
Analyze current distribution and optimal allocation
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

def analyze_visual_tracking_category(client):
    """Analyze Visual Tracking & Focus category distribution"""
    
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
        
        # Find Cognitive Skills infant rows
        infant_rows = []
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
            if (len(row) > pillar_col_index and row[pillar_col_index].strip() == 'Cognitive Skills' and
                len(row) > age_group_col_index and 'infant' in row[age_group_col_index].lower()):
                category = row[category_col_index] if len(row) > category_col_index else ""
                activity_type = row[activity_type_col_index] if len(row) > activity_type_col_index else ""
                difficulty = row[difficulty_col_index] if len(row) > difficulty_col_index else ""
                topic = row[topic_col_index] if len(row) > topic_col_index else ""
                infant_rows.append((row_num, category, activity_type, difficulty, topic))
        
        print(f"👶 Analyzing {len(infant_rows)} Cognitive Skills infant activities")
        
        # Filter for Visual Tracking & Focus activities
        visual_tracking_activities = [row for row in infant_rows if "Visual Tracking" in row[1]]
        
        print(f"\n👁️ VISUAL TRACKING & FOCUS CATEGORY ANALYSIS:")
        print("=" * 60)
        
        print(f"📊 CURRENT DISTRIBUTION:")
        print(f"   Total infant activities: {len(infant_rows)}")
        print(f"   Visual Tracking & Focus activities: {len(visual_tracking_activities)}")
        
        if visual_tracking_activities:
            print(f"\n📋 CURRENT ACTIVITIES IN THIS CATEGORY:")
            for i, (row_num, category, activity_type, difficulty, topic) in enumerate(visual_tracking_activities, 1):
                print(f"   {i}. Row {row_num}: {topic}")
                print(f"      Activity Type: {activity_type}")
                print(f"      Difficulty: {difficulty}")
                print()
        
        # Analyze all categories for comparison
        category_counts = Counter([row[1] for row in infant_rows])
        print(f"📊 ALL CATEGORIES DISTRIBUTION:")
        for category, count in category_counts.most_common():
            percentage = (count / len(infant_rows)) * 100
            print(f"   {category}: {count} activities ({percentage:.1f}%)")
        
        # Calculate optimal distribution
        total_activities = len(infant_rows)
        num_categories = len(category_counts)
        base_per_category = total_activities // num_categories
        extra_activities = total_activities % num_categories
        
        print(f"\n🎯 OPTIMAL DISTRIBUTION ANALYSIS:")
        print(f"   Total activities: {total_activities}")
        print(f"   Number of categories: {num_categories}")
        print(f"   Base per category: {base_per_category}")
        print(f"   Extra activities: {extra_activities}")
        
        # Strategic considerations for Visual Tracking & Focus
        print(f"\n🧠 STRATEGIC CONSIDERATIONS FOR VISUAL TRACKING & FOCUS:")
        print("   ✅ Critical for infant development (0-12 months)")
        print("   ✅ Foundation for all visual learning")
        print("   ✅ Supports eye coordination and attention span")
        print("   ✅ Essential for reading readiness")
        print("   ✅ High priority cognitive skill")
        
        # Recommended allocation
        print(f"\n💡 RECOMMENDED ALLOCATION:")
        
        # Priority-based allocation
        priority_categories = {
            "Visual Tracking & Focus": 3,  # High priority - critical foundation skill
            "Memory Development": 3,       # High priority - essential for learning
            "Cause and Effect Learning": 3, # High priority - basic cognitive understanding
            "Problem Solving Basics": 3,   # High priority - foundational thinking
            "Language Foundation": 2,      # Medium priority - important but can be less
            "Sensory Integration": 2,      # Medium priority - important but can be less
            "Visual Processing": 2,        # Medium priority - important but can be less
            "Creative Exploration": 2      # Lower priority - enrichment activity
        }
        
        print(f"   📈 PRIORITY-BASED ALLOCATION:")
        for category, recommended_count in priority_categories.items():
            current_count = category_counts.get(category, 0)
            status = "✅" if current_count == recommended_count else "⚠️"
            print(f"     {status} {category}: {current_count}/{recommended_count} activities")
        
        # Visual Tracking & Focus specific analysis
        current_vt_count = len(visual_tracking_activities)
        recommended_vt_count = 3
        
        print(f"\n👁️ VISUAL TRACKING & FOCUS SPECIFIC ANALYSIS:")
        print(f"   Current: {current_vt_count} activities")
        print(f"   Recommended: {recommended_vt_count} activities")
        
        if current_vt_count == recommended_vt_count:
            print(f"   ✅ PERFECT! Optimal allocation achieved")
        elif current_vt_count < recommended_vt_count:
            print(f"   ⚠️ UNDER-ALLOCATED: Need {recommended_vt_count - current_vt_count} more activities")
            print(f"   💡 Consider adding more visual tracking activities")
        else:
            print(f"   ⚠️ OVER-ALLOCATED: Have {current_vt_count - recommended_vt_count} extra activities")
            print(f"   💡 Consider redistributing to other priority categories")
        
        # Age-specific considerations
        print(f"\n👶 AGE-SPECIFIC CONSIDERATIONS (Infant 0-12 months):")
        print(f"   ✅ 0-3 months: High contrast visual stimuli")
        print(f"   ✅ 3-6 months: Tracking moving objects")
        print(f"   ✅ 6-9 months: Depth perception and focus")
        print(f"   ✅ 9-12 months: Visual memory and recognition")
        
        print(f"\n🎯 CONCLUSION:")
        if current_vt_count == 3:
            print(f"   ✅ Visual Tracking & Focus category is optimally allocated")
            print(f"   ✅ Provides comprehensive coverage of visual development milestones")
            print(f"   ✅ Balanced with other cognitive development areas")
        else:
            print(f"   ⚠️ Visual Tracking & Focus category needs adjustment")
            print(f"   💡 Target: 3 activities for optimal cognitive development coverage")
        
        return True
        
    except Exception as e:
        print(f"❌ Error analyzing category: {e}")
        return False

def main():
    """Main function to analyze Visual Tracking & Focus category"""
    print("👁️ Visual Tracking & Focus Category Analysis")
    print("=" * 60)
    
    # Connect to Google Sheets
    client = get_google_sheets_client()
    if not client:
        return False
    
    # Analyze category
    success = analyze_visual_tracking_category(client)
    
    if success:
        print(f"\n✅ Analysis completed!")
        return True
    else:
        print(f"\n❌ Analysis failed")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Visual Tracking & Focus analysis completed!")
    else:
        print(f"\n❌ FAILED to analyze Visual Tracking & Focus category!")
