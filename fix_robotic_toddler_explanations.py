#!/usr/bin/env python3
"""
🔧 Fix Robotic Toddler Explanations - Remove "Your Toddler" Repetition
Fix explanations that start with repetitive "Your toddler" patterns
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
        return client
    except Exception as e:
        print(f"❌ Error connecting to Google Sheets: {e}")
        return False

def create_natural_explanations():
    """Create natural explanations without robotic 'Your toddler' patterns"""
    
    explanations = {
        'Simple Shape Sorting': 'Children explore the world of shapes through hands-on sorting activities that build categorization skills and spatial reasoning. This engaging game helps little ones recognize and group similar shapes together while developing early mathematical thinking.',
        
        'Basic Puzzle Play': 'Puzzle time becomes an adventure in problem-solving as children fit pieces together and develop spatial reasoning skills. Through trial and error, they learn to recognize patterns and understand how different parts create a complete picture.',
        
        'Cause and Effect Discovery': 'Little scientists discover the magic of cause and effect through simple experiments that spark curiosity and logical thinking. Children learn that their actions create reactions, building essential understanding of how the world works.',
        
        'Simple Building Games': 'Construction play becomes a lesson in physics as children build structures using blocks and materials. They explore concepts of balance, gravity, and engineering while developing spatial reasoning and fine motor skills.',
        
        'Exploration Challenges': 'Adventure awaits as children tackle age-appropriate exploration challenges that build problem-solving and discovery skills. Each challenge encourages curiosity and persistence while teaching them to approach new situations with confidence.',
        
        'Concentration Tower Challenge': 'Focus and patience come together in this engaging tower-building activity. Children construct towers using 12 blocks, developing concentration, fine motor skills, and the ability to plan their approach and persist when challenges arise.',
        
        'Puzzle Master Quest': 'Puzzle mastery develops through age-appropriate challenges that build spatial reasoning and persistence. Children learn to recognize patterns, fit pieces together, and develop the patience needed to complete complex tasks.',
        
        'Memory Match Adventure': 'Memory skills get a workout through this exciting card-matching game that builds concentration and recall abilities. Children learn to remember locations and recognize similarities while having fun with friends and family.',
        
        'Story Studio Workshop': 'Creativity blooms as children create simple stories using props and toys, developing both language skills and imagination. They learn to sequence events and express their ideas through engaging storytelling activities.',
        
        'Color Explorer Games': 'The world of colors comes alive through hands-on sorting activities that build categorization skills and color recognition. Children learn to group similar colors together while developing early classification abilities.'
    }
    
    return explanations

def fix_robotic_toddler_explanations():
    """Fix all robotic toddler explanations"""
    
    try:
        print(f"🔧 FIXING ROBOTIC TODDLER EXPLANATIONS:")
        print("=" * 80)
        
        # Connect to Google Sheets
        client = get_google_sheets_client()
        if not client:
            return False
        
        # Open spreadsheet
        spreadsheet = client.open_by_key('14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ')
        activities_worksheet = spreadsheet.worksheet('Activities')
        
        # Get headers
        headers = activities_worksheet.row_values(1)
        column_indices = {}
        for i, header in enumerate(headers):
            column_indices[header] = i
        
        # Get all data
        all_data = activities_worksheet.get_all_values()
        
        print(f"\n🎯 IDENTIFYING ROBOTIC TODDLER EXPLANATIONS:")
        print("-" * 80)
        
        # Get natural explanations
        natural_explanations = create_natural_explanations()
        
        # Find activities with robotic explanations
        robotic_explanations = []
        for row_num, row in enumerate(all_data[1:], start=2):
            if len(row) > max(column_indices.get('Pillar', 0), column_indices.get('Age Group', 0), column_indices.get('Activity Name', 0)):
                pillar = row[column_indices.get('Pillar', 0)].strip()
                age_group = row[column_indices.get('Age Group', 0)].strip()
                activity_name = row[column_indices.get('Activity Name', 0)].strip() if len(row) > column_indices.get('Activity Name', 0) else ''
                explanation = row[column_indices.get('Explanation', 0)].strip() if len(row) > column_indices.get('Explanation', 0) else ''
                
                if (pillar == 'Cognitive Skills' and 'Toddler' in age_group and 
                    activity_name in natural_explanations and 
                    explanation.startswith('Your toddler')):
                    robotic_explanations.append((row_num, activity_name, natural_explanations[activity_name], age_group))
        
        print(f"📊 Found {len(robotic_explanations)} activities with robotic explanations")
        print(f"⏳ Processing with 2-second delays between updates...")
        
        total_updates = 0
        
        # Update all robotic explanations
        for i, (row_num, activity_name, new_explanation, age_group) in enumerate(robotic_explanations):
            try:
                print(f"\n🔧 Activity {i+1}/{len(robotic_explanations)}: Row {row_num}")
                print(f"   📝 {activity_name}")
                print(f"   👶 Age Group: {age_group}")
                print(f"   📖 New Explanation: {new_explanation[:80]}...")
                
                # Update Explanation
                activities_worksheet.update_cell(row_num, column_indices['Explanation'] + 1, new_explanation)
                total_updates += 1
                print(f"      ✅ Updated Explanation")
                
                # Add delay between updates
                if i < len(robotic_explanations) - 1:
                    print(f"      ⏳ Waiting 2 seconds before next activity...")
                    time.sleep(2)
                    
            except Exception as e:
                print(f"   ❌ Error updating explanation for {activity_name}: {e}")
                print(f"      ⏳ Waiting 3 seconds before continuing...")
                time.sleep(3)
                continue
        
        print(f"\n🎉 ROBOTIC TODDLER EXPLANATIONS FIXED!")
        print("=" * 80)
        print(f"✅ Total explanations updated: {total_updates}")
        print(f"✅ Removed robotic 'Your toddler' patterns")
        print(f"✅ Created natural, engaging explanations")
        print(f"✅ Eliminated repetitive language")
        
        return True
        
    except Exception as e:
        print(f"❌ Error fixing robotic toddler explanations: {e}")
        return False

def main():
    """Main function to fix robotic toddler explanations"""
    print("🔧 Fix Robotic Toddler Explanations - Remove Repetitive Patterns")
    print("=" * 70)
    print("🎯 Remove robotic 'Your toddler' patterns from explanations")
    
    success = fix_robotic_toddler_explanations()
    
    if success:
        print(f"\n✅ SUCCESS! Robotic toddler explanations fixed!")
        print("=" * 70)
        print("✅ All robotic patterns removed")
        print("✅ Natural and engaging explanations created")
        print("✅ Eliminated repetitive language")
        
        return True
    else:
        print(f"\n❌ FAILED to fix robotic toddler explanations!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Robotic toddler explanations fixed!")
    else:
        print(f"\n❌ FAILED to fix robotic toddler explanations!")

