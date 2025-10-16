#!/usr/bin/env python3
"""
🎯 Fix Objectives - Remove Age References
Remove redundant age mentions from objectives since age is already in Age Group column
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

def create_clean_objectives():
    """Create clean objectives without age references"""
    
    # Define clean objectives focused on the activity itself
    clean_objectives = {
        # Child (6-8) activities
        'Mastermind Planning Adventure': "Master strategic planning and forward-thinking to anticipate consequences and make informed decisions.",
        'Step-by-Step Detective Mission': "Build confidence in complex problem-solving by breaking challenges into manageable, sequential steps.",
        'Mini Detective Mystery Solver': "Develop analytical reasoning skills to examine evidence, identify patterns, and draw logical conclusions.",
        'Organized Puzzle Master': "Transform chaos into clarity through systematic approaches that organize thoughts and solve problems methodically.",
        'Brain Power Logic Challenge': "Master deductive reasoning and logical analysis through increasingly complex logic puzzles.",
        'Super Organizer Academy': "Master time and task management through practical planning and organizational skills.",
        'Emotion Mastery Quest': "Build emotional intelligence and self-control through recognition and management of emotions and triggers.",
        'Dream to Reality Journey': "Transform abstract goals into concrete action plans with realistic timelines and achievable steps.",
        'Task Champion Training': "Develop efficient work habits through structured task management and time estimation skills.",
        'Brain Commander Bootcamp': "Strengthen executive functions including attention control, planning, and self-monitoring.",
        'Mental Notepad Olympics': "Exercise working memory through engaging games that challenge information holding and manipulation.",
        'Memory Palace Builder': "Master memory techniques for storing and retrieving important information effectively over time.",
        'Super Memory Tool Kit': "Discover powerful memory strategies and proven techniques for remembering complex information.",
        'Memory Marathon Challenge': "Push memory boundaries through sophisticated exercises that handle multiple information streams.",
        'Memory Master Quest': "Achieve memory mastery through advanced techniques that build unshakeable confidence.",
        'Lightning Brain Speed Test': "Enhance mental agility through fast-paced games that improve processing speed and accuracy.",
        'Precision Thinking Workshop': "Develop precision thinking and attention to detail for accurate task completion.",
        'Brain Optimization Lab': "Optimize cognitive performance through streamlined activities that improve mental efficiency.",
        'Speed Thinking Championship': "Develop both speed and precision in thinking processes and decision-making.",
        'Mental Processing Power-Up': "Enhance information organization, manipulation, and understanding capabilities.",
        
        # Pre-Teen (9-12) activities
        'Mind-Bending Abstract Adventure': "Develop higher-order thinking skills through abstract reasoning and conceptual thinking.",
        'Logic Detective Academy': "Build critical thinking foundations through logical analysis and argument evaluation.",
        'Advanced Reasoning Mastery': "Achieve mastery in complex reasoning by integrating multiple thinking skills simultaneously.",
        'Elite Logic Puzzle Master': "Master deductive reasoning through increasingly complex logic puzzles and pattern recognition.",
        'Expert Problem Solver Quest': "Develop advanced problem-solving skills through sophisticated challenges and creative approaches.",
        'Strategic Mastermind Challenge': "Master long-term thinking and strategic planning with future anticipation skills.",
        'Future Vision Planner': "Transform aspirations into achievements through structured goal-setting and timeline creation.",
        'Decision Master Workshop': "Develop leadership thinking through strategic decision-making and option evaluation.",
        'Advanced Planning Expedition': "Master complex planning by coordinating multiple variables and creating comprehensive action plans.",
        'Strategic Thinking Championship': "Develop strategic mindset through challenging exercises that consider multiple outcomes.",
        'Influence Master Academy': "Master the art of influence through persuasive communication and respectful presentation.",
        'Debate Champion Training': "Develop critical thinking and communication through structured debate and logical argumentation.",
        'Language Power Workshop': "Elevate communication skills through advanced language exercises and precise expression.",
        'Confidence Speaker Academy': "Build confidence and communication skills through public speaking and audience engagement.",
        'Communication Strategy Quest': "Master effective communication through strategic adaptation for different audiences.",
        'Innovation Breakthrough Lab': "Spark creative breakthroughs through innovation challenges and unconventional thinking.",
        'Creative Solution Innovation Hub': "Unleash creative potential through innovative problem-solving and imaginative approaches.",
        'Originality Innovation Hub': "Develop unique perspectives through original thinking and unconventional solution generation.",
        'Innovation Creation Academy': "Cultivate breakthrough thinking through systematic innovation development and practical implementation.",
        'Creative Brain Power Lab': "Fuse creativity with cognition through innovative activities that enhance complex problem-solving.",
        
        # Teen (13-18) activities
        'Deep Dive Analysis Expedition': "Master sophisticated analytical thinking through deep exploration of complex issues and multi-perspective analysis.",
        'Critical Evaluation Workshop': "Develop expert evaluation skills through critical assessment and informed judgment making.",
        'Advanced Reasoning Mastery': "Achieve mastery in complex reasoning by integrating multiple thinking skills and perspectives.",
        'Critical Thinking Excellence Lab': "Master sophisticated critical thinking through advanced analysis, evaluation, and synthesis.",
        'Sophisticated Analysis Academy': "Develop deep analytical skills through sophisticated system and relationship examination.",
        'Leadership Decision Workshop': "Develop leadership capabilities through stakeholder-considering decision-making with long-term consequences.",
        'Team Leadership Challenge': "Master team leadership through group coordination and collaborative achievement inspiration.",
        'Strategic Leadership Academy': "Develop strategic leadership skills through advanced activities that guide others toward vision and goals.",
        'Leadership Problem Solver Quest': "Cultivate leadership problem-solving through complex issue addressing while inspiring others.",
        'Cognitive Leadership Bootcamp': "Strengthen leadership cognition through strategic thinking and effective guidance enhancement.",
        'Research Detective Academy': "Master research skills through information gathering, organization, and data evaluation.",
        'Research Analysis Workshop': "Develop analytical research skills through structured data examination and meaningful conclusion drawing.",
        'Data Integration Mastery': "Master information integration through data synthesis challenges and coherent insight creation.",
        'Advanced Research Academy': "Cultivate sophisticated research capabilities through thorough, methodical investigation conduct.",
        'Research Method Mastery Lab': "Master research methods through structured study design, data collection, and systematic analysis.",
        'Breakthrough Innovation Studio': "Drive revolutionary thinking through breakthrough innovation activities and paradigm-shifting solution creation.",
        'Creative Solution Innovation Hub': "Unleash creative potential through innovative problem-solving with imaginative and original approaches.",
        'Originality Breakthrough Lab': "Develop unique perspectives through original thinking challenges and novel idea generation.",
        'Innovation Creation Academy': "Cultivate breakthrough thinking through innovation development and creative idea transformation.",
        'Advanced Creative Mastery Studio': "Master the fusion of creativity and analytical thinking to generate breakthrough solutions and original innovations."
    }
    
    return clean_objectives

def fix_objectives_remove_age():
    """Fix objectives by removing age references"""
    
    try:
        print(f"🎯 FIXING OBJECTIVES - REMOVING AGE REFERENCES:")
        print("=" * 60)
        
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
        
        # Get clean objectives
        clean_objectives = create_clean_objectives()
        
        # Get all data
        all_data = activities_worksheet.get_all_values()
        
        print(f"\n🎯 UPDATING COGNITIVE SKILLS OBJECTIVES:")
        print("-" * 60)
        
        total_updates = 0
        
        # Update only Cognitive Skills activities
        for row_num, row in enumerate(all_data[1:], start=2):
            if len(row) > max(column_indices.get('Pillar', 0), column_indices.get('Activity Name', 0)):
                pillar = row[column_indices.get('Pillar', 0)].strip()
                activity_name = row[column_indices.get('Activity Name', 0)].strip() if len(row) > column_indices.get('Activity Name', 0) else ''
                
                if pillar == 'Cognitive Skills':
                    # Get the new clean objective
                    new_objective = clean_objectives.get(activity_name, '')
                    
                    if new_objective:
                        print(f"   🎯 Row {row_num}: {activity_name}")
                        print(f"      New Objective: {new_objective}")
                        
                        # Update the Objective
                        obj_col = column_indices.get('Objective', 10)
                        activities_worksheet.update_cell(row_num, obj_col + 1, new_objective)
                        print(f"      ✅ Updated!")
                        time.sleep(0.5)
                        
                        total_updates += 1
                        
                        # Add delay every 10 updates
                        if total_updates % 10 == 0:
                            print(f"      ⏳ Waiting 10 seconds to avoid rate limits...")
                            time.sleep(10)
        
        print(f"\n🎉 OBJECTIVES FIXED!")
        print("=" * 50)
        print(f"✅ Total objectives updated: {total_updates}")
        print(f"✅ All objectives are now clean and focused")
        print(f"✅ No more redundant age references")
        print(f"✅ Objectives focus on the activity itself")
        
        return True
        
    except Exception as e:
        print(f"❌ Error fixing objectives: {e}")
        return False

def main():
    """Main function to fix objectives"""
    print("🎯 Fix Objectives - Remove Age References")
    print("=" * 50)
    print("🎯 Remove redundant age mentions from objectives")
    
    success = fix_objectives_remove_age()
    
    if success:
        print(f"\n✅ SUCCESS! Objectives fixed!")
        print("=" * 50)
        print("✅ All objectives are clean and focused")
        print("✅ No more redundant age references")
        print("✅ Objectives focus on the activity itself")
        
        return True
    else:
        print(f"\n❌ FAILED to fix objectives!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Objectives fixed!")
    else:
        print(f"\n❌ FAILED to fix objectives!")
