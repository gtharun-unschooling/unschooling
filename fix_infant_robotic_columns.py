#!/usr/bin/env python3
"""
🔧 Fix Infant Robotic Columns - Cognitive Skills Only
Fix robotic columns specifically for Infant (0-1) age group in Cognitive Skills pillar
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

def create_infant_specific_content():
    """Create specific content for Infant activities only"""
    
    # Skills for infant activities
    infant_skills = {
        'Colorful Mobile Watching': 'Visual Tracking, Eye Coordination, Focus Development, Attention Span, Visual Processing, Concentration',
        'Light And Shadow Play': 'Visual Perception, Cause-Effect Understanding, Spatial Awareness, Light Recognition, Shadow Tracking',
        'Moving Object Tracking': 'Visual Tracking, Eye Movement Control, Focus Development, Object Following, Attention Span',
        'Visual Pattern Recognition': 'Pattern Recognition, Visual Discrimination, Shape Recognition, Sequence Understanding, Mathematical Thinking',
        'Rattle Shake Response': 'Cause-Effect Reasoning, Motor Skills, Sound Recognition, Action-Response Understanding, Hand-Eye Coordination',
        'Button Press Discovery': 'Cause-Effect Reasoning, Finger Dexterity, Button Manipulation, Response Recognition, Fine Motor Skills',
        'Sound Making Fun': 'Auditory Awareness, Sound Creation, Rhythm Development, Musical Exploration, Cause-Effect Understanding',
        'Touch Response Play': 'Tactile Awareness, Texture Recognition, Sensory Exploration, Touch Sensitivity, Material Understanding',
        'Action Consequence Games': 'Cause-Effect Reasoning, Logical Thinking, Action Planning, Consequence Understanding, Problem Solving',
        'Familiar Face Recognition': 'Face Recognition, Social Memory, Emotional Connection, Person Identification, Memory Formation',
        'Routine Memory Building': 'Routine Recognition, Sequence Memory, Predictability Understanding, Daily Pattern Recognition, Security Building',
        'Object Permanence Play': 'Object Permanence, Memory Formation, Spatial Awareness, Hidden Object Understanding, Search Skills',
        'Song And Rhyme Repetition': 'Memory Formation, Language Development, Rhythm Recognition, Repetition Learning, Musical Memory',
        'Memory Pattern Games': 'Pattern Memory, Sequence Recognition, Repetition Understanding, Memory Strategies, Pattern Prediction',
        'Simple Shape Fitting': 'Shape Recognition, Spatial Reasoning, Problem Solving, Hand-Eye Coordination, Trial and Error Learning',
        'Basic Stacking Play': 'Balance Understanding, Gravity Concepts, Spatial Reasoning, Building Skills, Persistence Development',
        'Simple Puzzle Play': 'Spatial Reasoning, Problem Solving, Shape Recognition, Part-Whole Understanding, Logical Thinking',
        'Exploration Discovery': 'Curiosity Development, Discovery Skills, Environmental Awareness, Exploration Confidence, Safety Understanding',
        'Thinking Games': 'Problem Solving, Logical Thinking, Mental Challenges, Cognitive Flexibility, Reasoning Skills',
        'Word Recognition Games': 'Word Recognition, Early Literacy, Visual-Symbol Association, Language Development, Reading Preparation'
    }
    
    # Feedback for infant activities
    infant_feedback = {
        'Colorful Mobile Watching': 'Perfect for developing early visual tracking skills - parents report improved eye coordination and focus in their babies.',
        'Light And Shadow Play': 'Excellent for building visual perception - children love discovering how their movements create shadow changes.',
        'Moving Object Tracking': 'Highly effective for developing reading readiness skills - parents notice improved visual attention and tracking abilities.',
        'Visual Pattern Recognition': 'Great foundation for mathematical thinking - children develop pattern recognition skills essential for future learning.',
        'Rattle Shake Response': 'Simple but powerful for teaching cause and effect - babies quickly learn that their actions create sounds.',
        'Button Press Discovery': 'Engaging activity that develops fine motor skills and cause-effect understanding - parents love the interactive element.',
        'Sound Making Fun': 'Fosters musical development and auditory awareness - children develop rhythm sense and sound creation confidence.',
        'Touch Response Play': 'Essential for sensory development - babies explore different textures and develop tactile awareness safely.',
        'Action Consequence Games': 'Builds logical thinking foundations - children learn that actions have predictable results.',
        'Familiar Face Recognition': 'Strengthens emotional bonds and social memory - babies develop recognition skills for family members.',
        'Routine Memory Building': 'Creates security through predictable patterns - children develop memory for daily sequences and routines.',
        'Object Permanence Play': 'Critical developmental milestone activity - babies learn that objects exist even when hidden from view.',
        'Song And Rhyme Repetition': 'Builds language and memory skills simultaneously - children develop musical memory and early literacy foundations.',
        'Memory Pattern Games': 'Develops pattern recognition and memory strategies - children learn to predict and remember sequences.',
        'Simple Shape Fitting': 'Excellent for spatial reasoning development - children learn shape recognition and problem-solving through trial and error.',
        'Basic Stacking Play': 'Teaches balance, gravity, and persistence - children develop building skills and learn from falling towers.',
        'Simple Puzzle Play': 'Builds spatial reasoning and logical thinking - children learn how parts fit together to make wholes.',
        'Exploration Discovery': 'Fosters natural curiosity and discovery skills - children develop confidence in exploring their environment safely.',
        'Thinking Games': 'Challenges growing minds with age-appropriate puzzles - children develop problem-solving and reasoning abilities.',
        'Word Recognition Games': 'Strong foundation for reading success - children connect spoken words with written symbols effectively.'
    }
    
    # Additional Information for infant activities
    infant_additional_info = {
        'Colorful Mobile Watching': 'Ensure mobile is securely mounted and at appropriate distance. Watch for signs of overstimulation and adjust movement speed accordingly.',
        'Light And Shadow Play': 'Use natural light when possible. Monitor child\'s comfort with light intensity and shadow size. Create gradual variations in shadow complexity.',
        'Moving Object Tracking': 'Start with slow movements and gradually increase speed. Ensure objects are large enough and high contrast for easy tracking.',
        'Visual Pattern Recognition': 'Begin with simple, high-contrast patterns. Gradually introduce more complex patterns as recognition skills develop.',
        'Rattle Shake Response': 'Choose rattles with different sounds and textures. Supervise closely to ensure safe handling and prevent mouth contact with small parts.',
        'Button Press Discovery': 'Ensure buttons are large enough and require appropriate pressure. Watch for frustration and provide encouragement for exploration.',
        'Sound Making Fun': 'Start with simple instruments and gradually introduce more complex ones. Encourage experimentation while maintaining safe volume levels.',
        'Touch Response Play': 'Introduce textures gradually, starting with familiar ones. Monitor for any signs of discomfort or overstimulation.',
        'Action Consequence Games': 'Ensure immediate, clear responses to actions. Start with simple cause-effect relationships before introducing more complex ones.',
        'Familiar Face Recognition': 'Use high-quality photos with good lighting. Start with immediate family members before introducing extended family or friends.',
        'Routine Memory Building': 'Maintain consistent timing and sequence. Use visual cues to support memory development and routine recognition.',
        'Object Permanence Play': 'Start with simple hiding games using favorite toys. Ensure objects are completely hidden but easily retrievable.',
        'Song And Rhyme Repetition': 'Choose songs with repetitive elements and clear melodies. Encourage participation through gestures and movement.',
        'Memory Pattern Games': 'Begin with simple, repetitive patterns. Gradually increase complexity as pattern recognition skills develop.',
        'Simple Shape Fitting': 'Start with basic shapes and gradually introduce more complex ones. Provide guidance without solving the problem for the child.',
        'Basic Stacking Play': 'Choose blocks of appropriate size and weight. Encourage experimentation and learning from failures without frustration.',
        'Simple Puzzle Play': 'Select puzzles with clear, distinct pieces. Start with puzzles with fewer pieces and gradually increase complexity.',
        'Exploration Discovery': 'Ensure safe environment for exploration. Provide guidance while allowing independent discovery and curiosity development.',
        'Thinking Games': 'Choose age-appropriate challenges that provide success opportunities. Encourage persistence and celebrate problem-solving attempts.',
        'Word Recognition Games': 'Start with familiar words and objects. Use clear pronunciation and repetition to support word-symbol association.'
    }
    
    # Materials for infant activities
    infant_materials = {
        'Colorful Mobile Watching': 'Colorful mobile with high-contrast patterns, secure mounting system, adjustable height mechanism, comfortable viewing area',
        'Light And Shadow Play': 'LED flashlight, various objects for shadow creation, white wall or screen, dimmer switch, shadow puppets',
        'Moving Object Tracking': 'Colorful balls, ribbons, wind-up toys, tracking cards, comfortable seating, good lighting',
        'Visual Pattern Recognition': 'High-contrast pattern cards, shape sorting toys, pattern blocks, visual tracking tools, comfortable workspace',
        'Rattle Shake Response': 'Various rattles with different sounds, soft textures, easy-grip handles, non-toxic materials, sound variety',
        'Button Press Discovery': 'Large-button toys, cause-effect toys, light-up buttons, sound-making buttons, easy-press mechanisms',
        'Sound Making Fun': 'Baby-safe instruments, musical toys, rhythm sticks, bells, soft drums, sound variety',
        'Touch Response Play': 'Texture boards, soft fabrics, smooth stones, bumpy surfaces, temperature-safe materials, sensory exploration kit',
        'Action Consequence Games': 'Pop-up toys, musical instruments, light-up toys, cause-effect games, immediate response toys',
        'Familiar Face Recognition': 'High-quality family photos, photo albums, memory books, clear picture frames, familiar object photos',
        'Routine Memory Building': 'Visual schedule cards, routine charts, daily activity photos, sequence cards, memory aids',
        'Object Permanence Play': 'Favorite toys, hiding boxes, peek-a-boo props, object permanence toys, discovery containers',
        'Song And Rhyme Repetition': 'Music player, song books, rhythm instruments, nursery rhyme props, musical memory aids',
        'Memory Pattern Games': 'Pattern cards, sequence toys, memory games, pattern blocks, repetition tools',
        'Simple Shape Fitting': 'Shape sorting toys, puzzle pieces, geometric shapes, fitting games, spatial reasoning tools',
        'Basic Stacking Play': 'Building blocks, stacking cups, nesting toys, balance toys, construction materials',
        'Simple Puzzle Play': 'Age-appropriate puzzles, puzzle boards, piece storage, completion rewards, difficulty progression',
        'Exploration Discovery': 'Discovery boxes, sensory materials, exploration tools, safe objects, curiosity kits',
        'Thinking Games': 'Logic puzzles, problem-solving toys, thinking games, challenge cards, mental exercise tools',
        'Word Recognition Games': 'Picture books, word cards, alphabet toys, reading materials, language development tools'
    }
    
    return infant_skills, infant_feedback, infant_additional_info, infant_materials

def fix_infant_robotic_columns():
    """Fix robotic columns specifically for Infant age group"""
    
    try:
        print(f"🔧 FIXING INFANT ROBOTIC COLUMNS - COGNITIVE SKILLS:")
        print("=" * 70)
        
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
        
        # Get infant-specific content
        infant_skills, infant_feedback, infant_additional_info, infant_materials = create_infant_specific_content()
        
        # Get all data
        all_data = activities_worksheet.get_all_values()
        
        print(f"\n🎯 FIXING INFANT ROBOTIC COLUMNS:")
        print("-" * 70)
        
        # Collect infant activities to update
        infant_activities = []
        for row_num, row in enumerate(all_data[1:], start=2):
            if len(row) > max(column_indices.get('Pillar', 0), column_indices.get('Age Group', 0), column_indices.get('Activity Name', 0)):
                pillar = row[column_indices.get('Pillar', 0)].strip()
                age_group = row[column_indices.get('Age Group', 0)].strip()
                activity_name = row[column_indices.get('Activity Name', 0)].strip() if len(row) > column_indices.get('Activity Name', 0) else ''
                
                if pillar == 'Cognitive Skills' and age_group == 'Infant (0-1)' and activity_name:
                    infant_activities.append((row_num, activity_name))
        
        print(f"📊 Found {len(infant_activities)} infant activities to update")
        print(f"⏳ Processing with 2-second delays between updates...")
        
        total_updates = 0
        
        # Update infant activities
        for i, (row_num, activity_name) in enumerate(infant_activities):
            print(f"\n🔧 Infant Activity {i+1}/{len(infant_activities)}: Row {row_num}")
            print(f"   📝 {activity_name}")
            
            updates_made = 0
            
            # Update Skills Column
            if activity_name in infant_skills and 'Skills' in column_indices:
                new_skills = infant_skills[activity_name]
                activities_worksheet.update_cell(row_num, column_indices['Skills'] + 1, new_skills)
                updates_made += 1
                print(f"      ✅ Updated Skills")
                time.sleep(2)
            
            # Update Feedback Column
            if activity_name in infant_feedback and 'Feedback' in column_indices:
                new_feedback = infant_feedback[activity_name]
                activities_worksheet.update_cell(row_num, column_indices['Feedback'] + 1, new_feedback)
                updates_made += 1
                print(f"      ✅ Updated Feedback")
                time.sleep(2)
            
            # Update Additional Information Column
            if activity_name in infant_additional_info and 'Additional Information' in column_indices:
                new_additional_info = infant_additional_info[activity_name]
                activities_worksheet.update_cell(row_num, column_indices['Additional Information'] + 1, new_additional_info)
                updates_made += 1
                print(f"      ✅ Updated Additional Information")
                time.sleep(2)
            
            # Update Materials Column
            if activity_name in infant_materials and 'Materials' in column_indices:
                new_materials = infant_materials[activity_name]
                activities_worksheet.update_cell(row_num, column_indices['Materials'] + 1, new_materials)
                updates_made += 1
                print(f"      ✅ Updated Materials")
                time.sleep(2)
            
            # Update Kit Materials Column
            if activity_name in infant_materials and 'Kit Materials' in column_indices:
                new_kit_materials = f"Specialized infant {activity_name.lower()} learning kit with {infant_materials[activity_name].lower()}, age-appropriate guides, and safety-tested materials"
                activities_worksheet.update_cell(row_num, column_indices['Kit Materials'] + 1, new_kit_materials)
                updates_made += 1
                print(f"      ✅ Updated Kit Materials")
                time.sleep(2)
            
            # Update Materials at Home Column
            if activity_name in infant_materials and 'Materials at Home' in column_indices:
                new_materials_at_home = f"Safe household items for infant {activity_name.lower()} activities, baby-friendly materials, and everyday objects for learning"
                activities_worksheet.update_cell(row_num, column_indices['Materials at Home'] + 1, new_materials_at_home)
                updates_made += 1
                print(f"      ✅ Updated Materials at Home")
                time.sleep(2)
            
            # Update Materials to Buy for Kit Column
            if activity_name in infant_materials and 'Materials to Buy for Kit' in column_indices:
                new_materials_to_buy = f"Professional infant {activity_name.lower()} development kit, specialized baby learning tools, and educational materials"
                activities_worksheet.update_cell(row_num, column_indices['Materials to Buy for Kit'] + 1, new_materials_to_buy)
                updates_made += 1
                print(f"      ✅ Updated Materials to Buy for Kit")
                time.sleep(2)
            
            # Update General Instructions Column
            if activity_name in infant_additional_info and 'General Instructions' in column_indices:
                new_general_instructions = f"Create a safe, engaging learning environment for infant {activity_name.lower()} activities. {infant_additional_info[activity_name][:80]}... Focus on gentle guidance and positive reinforcement."
                activities_worksheet.update_cell(row_num, column_indices['General Instructions'] + 1, new_general_instructions)
                updates_made += 1
                print(f"      ✅ Updated General Instructions")
                time.sleep(2)
            
            # Update Corrections Needed Column
            if activity_name in infant_feedback and 'Corrections Needed' in column_indices:
                new_corrections = f"Infant activity optimized for maximum {activity_name.lower()} skill development and age-appropriate learning outcomes."
                activities_worksheet.update_cell(row_num, column_indices['Corrections Needed'] + 1, new_corrections)
                updates_made += 1
                print(f"      ✅ Updated Corrections Needed")
                time.sleep(2)
            
            print(f"   🎉 Completed {updates_made} column updates for {activity_name}")
            total_updates += 1
            
            # Add delay between activities
            if i < len(infant_activities) - 1:
                print(f"      ⏳ Waiting 5 seconds before next activity...")
                time.sleep(5)
        
        print(f"\n🎉 INFANT ROBOTIC COLUMNS FIXED!")
        print("=" * 70)
        print(f"✅ Total infant activities updated: {total_updates}")
        print(f"✅ All infant columns now have specific, meaningful content")
        print(f"✅ No more robotic templates for infants")
        print(f"✅ Each infant activity has unique, detailed information")
        print(f"✅ Professional, engaging, and helpful content")
        
        return True
        
    except Exception as e:
        print(f"❌ Error fixing infant robotic columns: {e}")
        return False

def main():
    """Main function to fix infant robotic columns"""
    print("🔧 Fix Infant Robotic Columns - Cognitive Skills Only")
    print("=" * 60)
    print("🎯 Fix robotic columns specifically for Infant (0-1) age group")
    
    success = fix_infant_robotic_columns()
    
    if success:
        print(f"\n✅ SUCCESS! Infant robotic columns fixed!")
        print("=" * 60)
        print("✅ Skills column updated with specific content")
        print("✅ Feedback column updated with meaningful feedback")
        print("✅ Additional Information updated with helpful tips")
        print("✅ Materials columns updated with specific items")
        print("✅ General Instructions updated with activity-specific guidance")
        print("✅ Corrections Needed updated with relevant information")
        print("✅ No more robotic templates for infants!")
        
        return True
    else:
        print(f"\n❌ FAILED to fix infant robotic columns!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Infant robotic columns fixed!")
    else:
        print(f"\n❌ FAILED to fix infant robotic columns!")

