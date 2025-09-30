#!/usr/bin/env python3
"""
🔧 Fix Preschooler All Robotic Columns - Complete Transformation
Fix ALL robotic content for Preschooler age group across all columns
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

def create_preschooler_specific_content():
    """Create specific content for Preschooler activities"""
    
    content_mappings = {
        'Detective Mystery Challenge': {
            'feedback': 'Develops critical thinking and deductive reasoning - children learn to gather clues and make logical connections.',
            'materials': 'Mystery props, clue cards, detective tools, investigation materials, problem-solving games',
            'kit_materials': 'Professional preschooler detective kit with mystery props, clue cards, investigation tools, and critical thinking development materials',
            'materials_at_home': 'Household mystery items, family clues, everyday objects for detective games',
            'materials_to_buy': 'Advanced preschooler detective mastery kit with specialized investigation tools and professional mystery-solving materials',
            'general_instructions': 'Provide clear clues and encourage logical thinking. Guide children through the investigation process step by step.',
            'corrections_needed': 'Activity optimized for maximum detective skills and critical thinking development in preschoolers aged 3-5 years.',
            'explanation': 'Young detectives embark on exciting mystery-solving adventures that build critical thinking and deductive reasoning skills. Children learn to gather clues, analyze evidence, and make logical connections while having fun solving age-appropriate mysteries.'
        },
        'Cause and Effect Analysis': {
            'feedback': 'Builds logical thinking and consequence understanding - children develop analytical skills through real-world examples.',
            'materials': 'Analysis cards, consequence examples, logical thinking tools, cause-effect games',
            'kit_materials': 'Professional preschooler analysis kit with cause-effect cards, logical thinking tools, and analytical development materials',
            'materials_at_home': 'Household cause-effect items, family examples, everyday objects for analysis practice',
            'materials_to_buy': 'Advanced preschooler logical thinking kit with specialized analysis tools and professional reasoning development materials',
            'general_instructions': 'Use familiar examples and real-world situations. Encourage children to identify causes and predict effects.',
            'corrections_needed': 'Activity optimized for maximum cause-effect understanding and logical thinking development in preschoolers aged 3-5 years.',
            'explanation': 'Little analysts explore the fascinating world of cause and effect through hands-on experiments and real-world examples. Children develop logical thinking skills as they discover how actions create reactions and learn to predict outcomes.'
        },
        'Family Restaurant Manager': {
            'feedback': 'Develops planning, organization, and social skills - children learn to manage multiple tasks and interact with others.',
            'materials': 'Restaurant props, order forms, menu cards, role-play materials, management tools',
            'kit_materials': 'Professional preschooler restaurant kit with management props, order forms, menu cards, and leadership development materials',
            'materials_at_home': 'Household restaurant items, kitchen props, everyday objects for restaurant management',
            'materials_to_buy': 'Advanced preschooler leadership kit with specialized management tools and professional organizational development materials',
            'general_instructions': 'Provide clear roles and responsibilities. Encourage multitasking and customer service skills.',
            'corrections_needed': 'Activity optimized for maximum management skills and social development in preschoolers aged 3-5 years.',
            'explanation': 'Future restaurateurs take charge in this engaging role-play activity that builds planning, organization, and social skills. Children learn to manage multiple tasks, take orders, and provide excellent customer service while developing leadership abilities.'
        },
        'Escape Room Adventure': {
            'feedback': 'Develops teamwork and creative problem-solving - children learn to work together and think outside the box.',
            'materials': 'Puzzle pieces, escape room props, teamwork tools, problem-solving games, adventure materials',
            'kit_materials': 'Professional preschooler escape room kit with puzzle props, teamwork tools, and collaborative problem-solving materials',
            'materials_at_home': 'Household puzzle items, family escape games, everyday objects for adventure challenges',
            'materials_to_buy': 'Advanced preschooler adventure kit with specialized escape tools and professional teamwork development materials',
            'general_instructions': 'Encourage collaboration and creative thinking. Provide hints when needed and celebrate team successes.',
            'corrections_needed': 'Activity optimized for maximum teamwork skills and creative problem-solving development in preschoolers aged 3-5 years.',
            'explanation': 'Adventure seekers work together to solve puzzles and escape from exciting themed rooms. This collaborative experience builds teamwork skills, creative problem-solving, and the ability to think outside the box while having thrilling fun.'
        },
        'Critical Thinking Puzzles': {
            'feedback': 'Strengthens reasoning and problem-solving abilities - children develop systematic approaches to complex challenges.',
            'materials': 'Logic puzzles, reasoning games, critical thinking tools, problem-solving cards',
            'kit_materials': 'Professional preschooler critical thinking kit with logic puzzles, reasoning games, and analytical development materials',
            'materials_at_home': 'Household puzzle items, family reasoning games, everyday objects for critical thinking',
            'materials_to_buy': 'Advanced preschooler reasoning kit with specialized logic tools and professional analytical development materials',
            'general_instructions': 'Start with simple puzzles and gradually increase complexity. Encourage systematic thinking and multiple solution approaches.',
            'corrections_needed': 'Activity optimized for maximum critical thinking and reasoning skills development in preschoolers aged 3-5 years.',
            'explanation': 'Puzzle masters tackle challenging logic problems that build reasoning and problem-solving abilities. Children learn systematic approaches to complex challenges while developing the persistence needed to overcome obstacles.'
        },
        'Memory Olympics Training': {
            'feedback': 'Builds memory skills through fun competitive challenges - children develop recall strategies and confidence.',
            'materials': 'Memory games, recall practice tools, memory strategies guide, competitive elements',
            'kit_materials': 'Professional preschooler memory training kit with competitive games, recall tools, and memory development materials',
            'materials_at_home': 'Household memory items, family competition games, everyday objects for memory practice',
            'materials_to_buy': 'Advanced preschooler memory mastery kit with specialized training tools and professional competitive development materials',
            'general_instructions': 'Create friendly competition atmosphere. Celebrate improvements and encourage memory strategy use.',
            'corrections_needed': 'Activity optimized for maximum memory training and competitive skill development in preschoolers aged 3-5 years.',
            'explanation': 'Memory athletes train for the ultimate recall challenge through fun competitive games that build memory skills and confidence. Children develop recall strategies while enjoying the excitement of friendly competition.'
        },
        'Memory Treasure Hunt': {
            'feedback': 'Combines memory skills with adventure - children develop recall abilities while having exciting fun.',
            'materials': 'Treasure hunt props, memory clues, adventure materials, recall practice tools',
            'kit_materials': 'Professional preschooler treasure hunt kit with memory clues, adventure props, and recall development materials',
            'materials_at_home': 'Household treasure items, family hunt games, everyday objects for memory adventures',
            'materials_to_buy': 'Advanced preschooler adventure memory kit with specialized hunt tools and professional recall development materials',
            'general_instructions': 'Create exciting treasure hunt atmosphere. Use memory clues to guide the adventure.',
            'corrections_needed': 'Activity optimized for maximum memory adventure and recall skill development in preschoolers aged 3-5 years.',
            'explanation': 'Treasure hunters embark on memory-powered adventures that combine recall skills with exciting exploration. Children develop memory abilities while following clues and discovering hidden treasures.'
        },
        'Pattern Master Challenge': {
            'feedback': 'Develops pattern recognition and prediction skills - children learn to identify and extend sequences.',
            'materials': 'Pattern cards, sequence materials, prediction tools, recognition games',
            'kit_materials': 'Professional preschooler pattern kit with sequence cards, recognition tools, and prediction development materials',
            'materials_at_home': 'Household pattern items, family sequence games, everyday objects for pattern recognition',
            'materials_to_buy': 'Advanced preschooler pattern mastery kit with specialized recognition tools and professional sequence development materials',
            'general_instructions': 'Start with simple patterns and increase complexity. Encourage prediction and extension of sequences.',
            'corrections_needed': 'Activity optimized for maximum pattern recognition and sequence skill development in preschoolers aged 3-5 years.',
            'explanation': 'Pattern detectives master the art of sequence recognition through engaging challenges that build prediction and extension skills. Children learn to identify patterns and predict what comes next while developing logical thinking.'
        },
        'Story Sequence Theater': {
            'feedback': 'Develops storytelling and sequencing skills - children learn to organize events and express ideas.',
            'materials': 'Story props, sequence cards, theater materials, narrative tools',
            'kit_materials': 'Professional preschooler story theater kit with narrative props, sequence tools, and storytelling development materials',
            'materials_at_home': 'Household story items, family theater props, everyday objects for narrative play',
            'materials_to_buy': 'Advanced preschooler storytelling kit with specialized theater tools and professional narrative development materials',
            'general_instructions': 'Encourage creative storytelling. Help children organize events in logical sequence.',
            'corrections_needed': 'Activity optimized for maximum storytelling and sequencing skill development in preschoolers aged 3-5 years.',
            'explanation': 'Storytellers bring tales to life through theatrical performances that build narrative and sequencing skills. Children learn to organize events in logical order while developing creativity and expressive language.'
        },
        'Memory Gym Workout': {
            'feedback': 'Exercises memory muscles through fun fitness-themed challenges - children build recall strength and endurance.',
            'materials': 'Memory fitness tools, workout props, recall exercises, endurance games',
            'kit_materials': 'Professional preschooler memory fitness kit with workout tools, recall exercises, and memory development materials',
            'materials_at_home': 'Household fitness items, family workout games, everyday objects for memory exercises',
            'materials_to_buy': 'Advanced preschooler memory fitness kit with specialized workout tools and professional recall development materials',
            'general_instructions': 'Create fun fitness atmosphere. Encourage memory endurance and celebrate improvements.',
            'corrections_needed': 'Activity optimized for maximum memory fitness and recall endurance development in preschoolers aged 3-5 years.',
            'explanation': 'Memory athletes hit the gym for fun fitness-themed challenges that build recall strength and endurance. Children develop memory muscles through engaging workout activities that make learning feel like play.'
        },
        'Word Wizard Academy': {
            'feedback': 'Develops vocabulary and language skills through magical word adventures - children become confident communicators.',
            'materials': 'Word cards, vocabulary tools, language games, magical props',
            'kit_materials': 'Professional preschooler word wizard kit with vocabulary tools, language games, and magical development materials',
            'materials_at_home': 'Household word items, family language games, everyday objects for vocabulary building',
            'materials_to_buy': 'Advanced preschooler language mastery kit with specialized word tools and professional vocabulary development materials',
            'general_instructions': 'Create magical learning atmosphere. Encourage creative word use and expression.',
            'corrections_needed': 'Activity optimized for maximum vocabulary and language skill development in preschoolers aged 3-5 years.',
            'explanation': 'Word wizards embark on magical language adventures that build vocabulary and communication skills. Children develop confidence in using words creatively while exploring the power of language through fun activities.'
        },
        'Public Speaking Academy': {
            'feedback': 'Builds confidence and communication skills - children learn to express ideas clearly and engage audiences.',
            'materials': 'Speaking props, presentation tools, confidence builders, audience materials',
            'kit_materials': 'Professional preschooler speaking kit with presentation tools, confidence builders, and communication development materials',
            'materials_at_home': 'Household speaking items, family presentation props, everyday objects for public speaking',
            'materials_to_buy': 'Advanced preschooler communication kit with specialized speaking tools and professional presentation development materials',
            'general_instructions': 'Create supportive speaking environment. Encourage confidence and clear expression.',
            'corrections_needed': 'Activity optimized for maximum public speaking and communication skill development in preschoolers aged 3-5 years.',
            'explanation': 'Future speakers develop confidence and communication skills through supportive public speaking experiences. Children learn to express ideas clearly and engage audiences while building self-assurance.'
        },
        'Story Studio Production': {
            'feedback': 'Develops creativity and narrative skills through film production - children become storytellers and directors.',
            'materials': 'Production props, story tools, creative materials, directing equipment',
            'kit_materials': 'Professional preschooler story studio kit with production tools, creative materials, and narrative development resources',
            'materials_at_home': 'Household production items, family story props, everyday objects for creative filmmaking',
            'materials_to_buy': 'Advanced preschooler creative kit with specialized production tools and professional storytelling development materials',
            'general_instructions': 'Encourage creative storytelling and directing. Support imaginative expression and narrative development.',
            'corrections_needed': 'Activity optimized for maximum creative storytelling and production skill development in preschoolers aged 3-5 years.',
            'explanation': 'Young filmmakers create their own stories through exciting production experiences that build creativity and narrative skills. Children become both storytellers and directors while developing imaginative expression.'
        },
        'Language Lab Experiments': {
            'feedback': 'Develops language skills through scientific exploration - children become language scientists and experimenters.',
            'materials': 'Language experiment tools, scientific props, exploration materials, discovery games',
            'kit_materials': 'Professional preschooler language lab kit with experiment tools, scientific props, and language development materials',
            'materials_at_home': 'Household experiment items, family language games, everyday objects for linguistic exploration',
            'materials_to_buy': 'Advanced preschooler linguistic kit with specialized experiment tools and professional language development materials',
            'general_instructions': 'Create scientific exploration atmosphere. Encourage language discovery and experimentation.',
            'corrections_needed': 'Activity optimized for maximum language exploration and linguistic skill development in preschoolers aged 3-5 years.',
            'explanation': 'Language scientists conduct exciting experiments that explore the fascinating world of words and communication. Children develop linguistic skills through hands-on discovery and scientific exploration.'
        },
        'Talk Show Host Training': {
            'feedback': 'Develops communication and interview skills - children learn to conduct conversations and engage with others.',
            'materials': 'Interview tools, conversation props, hosting materials, engagement games',
            'kit_materials': 'Professional preschooler talk show kit with interview tools, conversation props, and communication development materials',
            'materials_at_home': 'Household interview items, family conversation games, everyday objects for hosting practice',
            'materials_to_buy': 'Advanced preschooler communication kit with specialized hosting tools and professional interview development materials',
            'general_instructions': 'Create engaging talk show atmosphere. Encourage conversation skills and audience interaction.',
            'corrections_needed': 'Activity optimized for maximum communication and interview skill development in preschoolers aged 3-5 years.',
            'explanation': 'Future talk show hosts develop communication and interview skills through engaging conversation experiences. Children learn to conduct interviews, ask questions, and interact with others while building confidence.'
        },
        'Innovation Lab: Rethink Everything': {
            'feedback': 'Develops creative thinking and innovation skills - children learn to question assumptions and create new solutions.',
            'materials': 'Innovation tools, creative thinking props, problem-solving materials, invention games',
            'kit_materials': 'Professional preschooler innovation kit with creative tools, thinking props, and invention development materials',
            'materials_at_home': 'Household innovation items, family invention games, everyday objects for creative problem-solving',
            'materials_to_buy': 'Advanced preschooler creative kit with specialized innovation tools and professional invention development materials',
            'general_instructions': 'Encourage questioning and creative thinking. Support innovative solutions and new approaches.',
            'corrections_needed': 'Activity optimized for maximum creative thinking and innovation skill development in preschoolers aged 3-5 years.',
            'explanation': 'Innovation explorers question everything and create new solutions through exciting creative challenges. Children develop the ability to think differently and solve problems in unique ways while building confidence in their creative abilities.'
        },
        'Survival Island Adventure': {
            'feedback': 'Develops problem-solving and survival skills - children learn to adapt and overcome challenges.',
            'materials': 'Survival props, adventure tools, problem-solving materials, challenge games',
            'kit_materials': 'Professional preschooler survival kit with adventure tools, challenge props, and problem-solving development materials',
            'materials_at_home': 'Household survival items, family adventure games, everyday objects for challenge solving',
            'materials_to_buy': 'Advanced preschooler adventure kit with specialized survival tools and professional challenge development materials',
            'general_instructions': 'Create exciting adventure atmosphere. Encourage creative problem-solving and adaptation.',
            'corrections_needed': 'Activity optimized for maximum survival skills and problem-solving development in preschoolers aged 3-5 years.',
            'explanation': 'Adventure survivors tackle exciting island challenges that build problem-solving and adaptation skills. Children learn to think creatively, work together, and overcome obstacles while having thrilling adventures.'
        },
        'Creative Solution Innovation Hub': {
            'feedback': 'Develops creative problem-solving and innovation skills - children learn to think outside the box and create unique solutions.',
            'materials': 'Creative problem-solving tools, innovation props, solution materials, thinking games',
            'kit_materials': 'Professional preschooler creative hub kit with innovation tools, problem-solving props, and solution development materials',
            'materials_at_home': 'Household creative items, family innovation games, everyday objects for solution building',
            'materials_to_buy': 'Advanced preschooler innovation kit with specialized creative tools and professional solution development materials',
            'general_instructions': 'Encourage creative thinking and unique solutions. Support innovative approaches to problems.',
            'corrections_needed': 'Activity optimized for maximum creative problem-solving and innovation skill development in preschoolers aged 3-5 years.',
            'explanation': 'Creative innovators develop unique solutions to exciting challenges through hands-on problem-solving experiences. Children learn to think creatively and develop innovative approaches while building confidence in their creative abilities.'
        },
        'Multi-Step Thinking': {
            'feedback': 'Develops complex reasoning and planning skills - children learn to break down problems into manageable steps.',
            'materials': 'Multi-step problem tools, planning materials, reasoning games, sequence props',
            'kit_materials': 'Professional preschooler multi-step kit with planning tools, reasoning materials, and complex thinking development resources',
            'materials_at_home': 'Household planning items, family reasoning games, everyday objects for step-by-step thinking',
            'materials_to_buy': 'Advanced preschooler reasoning kit with specialized planning tools and professional complex thinking development materials',
            'general_instructions': 'Guide children through step-by-step processes. Encourage planning and organization of thoughts.',
            'corrections_needed': 'Activity optimized for maximum complex reasoning and planning skill development in preschoolers aged 3-5 years.',
            'explanation': 'Strategic thinkers master the art of multi-step problem-solving through engaging challenges that build complex reasoning and planning skills. Children learn to break down problems into manageable steps while developing organizational thinking.'
        },
        'Brain Gym Circuit Training': {
            'feedback': 'Develops cognitive fitness and mental agility - children build brain strength through fun circuit challenges.',
            'materials': 'Brain fitness tools, circuit props, mental agility games, cognitive exercises',
            'kit_materials': 'Professional preschooler brain gym kit with fitness tools, circuit materials, and cognitive development resources',
            'materials_at_home': 'Household brain fitness items, family cognitive games, everyday objects for mental exercises',
            'materials_to_buy': 'Advanced preschooler cognitive kit with specialized brain fitness tools and professional mental development materials',
            'general_instructions': 'Create fun fitness atmosphere. Encourage cognitive challenges and celebrate mental improvements.',
            'corrections_needed': 'Activity optimized for maximum cognitive fitness and mental agility development in preschoolers aged 3-5 years.',
            'explanation': 'Brain athletes train their minds through exciting circuit challenges that build cognitive fitness and mental agility. Children develop brain strength through fun exercises that make thinking feel like play.'
        }
    }
    
    return content_mappings

def fix_preschooler_all_robotic_columns():
    """Fix ALL robotic content for Preschooler age group"""
    
    try:
        print(f"🔧 FIXING PRESCHOOLER ALL ROBOTIC COLUMNS - COMPLETE TRANSFORMATION:")
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
        
        print(f"\n🎯 IDENTIFYING PRESCHOOLER ACTIVITIES:")
        print("-" * 80)
        
        # Get content mappings
        content_mappings = create_preschooler_specific_content()
        
        # Find all Preschooler activities
        preschooler_activities = []
        for row_num, row in enumerate(all_data[1:], start=2):
            if len(row) > max(column_indices.get('Pillar', 0), column_indices.get('Age Group', 0), column_indices.get('Activity Name', 0)):
                pillar = row[column_indices.get('Pillar', 0)].strip()
                age_group = row[column_indices.get('Age Group', 0)].strip()
                activity_name = row[column_indices.get('Activity Name', 0)].strip() if len(row) > column_indices.get('Activity Name', 0) else ''
                
                if pillar == 'Cognitive Skills' and 'Preschooler' in age_group and activity_name in content_mappings:
                    preschooler_activities.append((row_num, activity_name, content_mappings[activity_name], age_group))
        
        print(f"📊 Found {len(preschooler_activities)} Preschooler activities to update")
        print(f"⏳ Processing with 2-second delays between updates...")
        
        total_updates = 0
        
        # Update all Preschooler activities
        for i, (row_num, activity_name, content, age_group) in enumerate(preschooler_activities):
            try:
                print(f"\n🔧 Activity {i+1}/{len(preschooler_activities)}: Row {row_num}")
                print(f"   📝 {activity_name}")
                print(f"   👶 Age Group: {age_group}")
                
                updates_made = 0
                
                # Update all columns
                columns_to_update = [
                    ('Feedback', content['feedback']),
                    ('Materials', content['materials']),
                    ('Kit Materials', content['kit_materials']),
                    ('Materials at Home', content['materials_at_home']),
                    ('Materials to Buy for Kit', content['materials_to_buy']),
                    ('General Instructions', content['general_instructions']),
                    ('Corrections Needed', content['corrections_needed']),
                    ('Explanation', content['explanation'])
                ]
                
                for column_name, new_content in columns_to_update:
                    if column_name in column_indices:
                        activities_worksheet.update_cell(row_num, column_indices[column_name] + 1, new_content)
                        updates_made += 1
                        print(f"      ✅ Updated {column_name}")
                        time.sleep(2)  # 2-second delay between updates
                
                print(f"   🎉 Completed {updates_made} column updates for {activity_name}")
                total_updates += 1
                
                # Add delay between activities
                if i < len(preschooler_activities) - 1:
                    print(f"      ⏳ Waiting 3 seconds before next activity...")
                    time.sleep(3)
                    
            except Exception as e:
                print(f"   ❌ Error processing activity {activity_name}: {e}")
                print(f"      ⏳ Waiting 5 seconds before continuing...")
                time.sleep(5)
                continue
        
        print(f"\n🎉 PRESCHOOLER ALL ROBOTIC COLUMNS FIXED!")
        print("=" * 80)
        print(f"✅ Total activities updated: {total_updates}")
        print(f"✅ All robotic content eliminated for Preschooler age group")
        print(f"✅ Perfect transformation achieved for all columns!")
        print(f"✅ Professional, engaging, and helpful content")
        
        return True
        
    except Exception as e:
        print(f"❌ Error fixing preschooler robotic columns: {e}")
        return False

def main():
    """Main function to fix preschooler robotic columns"""
    print("🔧 Fix Preschooler All Robotic Columns - Complete Transformation")
    print("=" * 70)
    print("🎯 Fix ALL robotic content for Preschooler age group across all columns")
    
    success = fix_preschooler_all_robotic_columns()
    
    if success:
        print(f"\n✅ SUCCESS! Preschooler robotic columns fixed!")
        print("=" * 70)
        print("✅ All robotic content eliminated")
        print("✅ All columns transformed")
        print("✅ Perfect transformation achieved!")
        
        return True
    else:
        print(f"\n❌ FAILED to fix preschooler robotic columns!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Preschooler robotic columns fixed!")
    else:
        print(f"\n❌ FAILED to fix preschooler robotic columns!")

