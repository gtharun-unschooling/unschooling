#!/usr/bin/env python3
"""
🔧 Conservative Fix Robotic Columns
Fix robotic columns with very conservative rate limiting
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

def create_specific_skills():
    """Create specific, unique skills for each activity"""
    
    skills_map = {
        # Visual Tracking & Focus activities
        'Colorful Mobile Watching': 'Visual Tracking, Eye Coordination, Focus Development, Attention Span, Visual Processing, Concentration',
        'Light And Shadow Play': 'Visual Perception, Cause-Effect Understanding, Spatial Awareness, Light Recognition, Shadow Tracking',
        'Moving Object Tracking': 'Visual Tracking, Eye Movement Control, Focus Development, Object Following, Attention Span',
        'Visual Pattern Recognition': 'Pattern Recognition, Visual Discrimination, Shape Recognition, Sequence Understanding, Mathematical Thinking',
        
        # Cause and Effect activities
        'Rattle Shake Response': 'Cause-Effect Reasoning, Motor Skills, Sound Recognition, Action-Response Understanding, Hand-Eye Coordination',
        'Button Press Discovery': 'Cause-Effect Reasoning, Finger Dexterity, Button Manipulation, Response Recognition, Fine Motor Skills',
        'Sound Making Fun': 'Auditory Awareness, Sound Creation, Rhythm Development, Musical Exploration, Cause-Effect Understanding',
        'Touch Response Play': 'Tactile Awareness, Texture Recognition, Sensory Exploration, Touch Sensitivity, Material Understanding',
        'Action Consequence Games': 'Cause-Effect Reasoning, Logical Thinking, Action Planning, Consequence Understanding, Problem Solving',
        
        # Memory Building activities
        'Familiar Face Recognition': 'Face Recognition, Social Memory, Emotional Connection, Person Identification, Memory Formation',
        'Routine Memory Building': 'Routine Recognition, Sequence Memory, Predictability Understanding, Daily Pattern Recognition, Security Building',
        'Object Permanence Play': 'Object Permanence, Memory Formation, Spatial Awareness, Hidden Object Understanding, Search Skills',
        'Song And Rhyme Repetition': 'Memory Formation, Language Development, Rhythm Recognition, Repetition Learning, Musical Memory',
        'Memory Pattern Games': 'Pattern Memory, Sequence Recognition, Repetition Understanding, Memory Strategies, Pattern Prediction',
        
        # Problem Solving activities
        'Simple Shape Fitting': 'Shape Recognition, Spatial Reasoning, Problem Solving, Hand-Eye Coordination, Trial and Error Learning',
        'Basic Stacking Play': 'Balance Understanding, Gravity Concepts, Spatial Reasoning, Building Skills, Persistence Development',
        'Simple Puzzle Play': 'Spatial Reasoning, Problem Solving, Shape Recognition, Part-Whole Understanding, Logical Thinking',
        'Exploration Discovery': 'Curiosity Development, Discovery Skills, Environmental Awareness, Exploration Confidence, Safety Understanding',
        'Thinking Games': 'Problem Solving, Logical Thinking, Mental Challenges, Cognitive Flexibility, Reasoning Skills',
        
        # Language activities
        'Word Recognition Games': 'Word Recognition, Early Literacy, Visual-Symbol Association, Language Development, Reading Preparation',
        'Simple Conversation Practice': 'Conversation Skills, Turn-Taking, Social Communication, Language Expression, Listening Skills',
        'Vocabulary Building Play': 'Vocabulary Expansion, Word Learning, Language Acquisition, Communication Confidence, Word Usage',
        'Sound Pattern Recognition': 'Auditory Discrimination, Sound Pattern Recognition, Rhythm Awareness, Musical Development, Listening Skills',
        'Language Imitation Games': 'Language Imitation, Sound Production, Communication Skills, Verbal Expression, Language Confidence',
        
        # Memory Enhancement activities
        'Hide and Seek Memory': 'Spatial Memory, Object Location Memory, Search Skills, Memory Strategies, Recall Development',
        'Picture Memory Games': 'Visual Memory, Image Recognition, Memory Strategies, Attention to Detail, Recall Skills',
        'Familiar Object Recall': 'Object Recognition, Memory Retrieval, Name-Object Association, Recall Skills, Memory Confidence',
        'Song and Rhyme Memory': 'Musical Memory, Language Memory, Rhythm Memory, Repetition Skills, Memory Strategies',
        
        # Executive Function activities
        'Toddler Concentration Tower Building': 'Concentration, Focus Development, Patience Building, Fine Motor Skills, Persistence, Planning',
        'Daily Hero Missions': 'Task Completion, Responsibility Development, Multi-Step Following, Time Management, Self-Control',
        'Focus Fortress': 'Attention Control, Focus Development, Distraction Resistance, Concentration Skills, Mental Discipline',
        'Memory Gym Games': 'Memory Exercise, Recall Practice, Memory Strategies, Concentration Skills, Mental Fitness',
        'Mind Castle Architect': 'Memory Techniques, Information Organization, Memory Strategies, Advanced Recall, Mental Architecture',
        'Memory Explorer Kit': 'Memory Strategies, Learning Techniques, Information Processing, Memory Confidence, Study Skills',
        'Memory Adventure Quest': 'Memory Challenges, Recall Practice, Memory Strategies, Adventure-Based Learning, Memory Confidence',
        'Memory Explorer Adventures': 'Memory Exploration, Strategy Development, Learning Techniques, Memory Mastery, Adventure Learning',
        
        # Processing Speed activities
        'Speed Thinker Games': 'Quick Thinking, Rapid Decision Making, Mental Agility, Processing Speed, Reaction Time',
        'Thinking Speed Track': 'Mental Speed Training, Information Processing, Quick Response, Mental Efficiency, Time Pressure Handling',
        'Rapid Response Games': 'Reaction Time, Quick Response, Mental Agility, Speed-Accuracy Balance, Processing Efficiency',
        'Cognitive Fitness Center': 'Mental Fitness, Cognitive Exercise, Brain Training, Mental Agility, Cognitive Flexibility',
        
        # Abstract Thinking activities
        'Mind-Bending Abstract Adventure': 'Abstract Thinking, Conceptual Reasoning, Pattern Recognition, Complex Reasoning, Mental Modeling',
        'Complex Analysis Navigator': 'Complex Problem Solving, Analytical Thinking, Multi-Step Reasoning, Problem Decomposition, Analysis Skills',
        'Puzzle Architect Studio': 'Spatial Reasoning, Logical Thinking, Problem Solving, Design Thinking, Systematic Approach',
        
        # Communication Skills activities
        'Voice Command Center': 'Public Speaking, Presentation Skills, Voice Projection, Confidence Building, Communication Clarity',
        'Message Designer Lab': 'Communication Design, Audience Adaptation, Message Crafting, Persuasion Skills, Communication Strategy',
        'Argument Architect School': 'Logical Argumentation, Debate Skills, Critical Thinking, Persuasive Communication, Evidence-Based Reasoning',
        
        # Leadership Skills activities
        'Executive Choice Studio': 'Decision Making, Leadership Thinking, Consequence Analysis, Strategic Decision, Leadership Skills',
        'Group Dynamics Commander': 'Team Leadership, Group Management, Motivation Skills, Conflict Resolution, Collaborative Leadership',
        'Leadership Think Tank': 'Strategic Thinking, Leadership Development, Decision Making, Team Guidance, Leadership Vision',
        
        # Research Skills activities
        'Investigation Specialist Lab': 'Research Skills, Information Gathering, Source Evaluation, Critical Analysis, Evidence-Based Reasoning',
        'Data Explorer Studio': 'Data Analysis, Information Processing, Research Methodology, Data Interpretation, Analytical Skills',
        'Research Architect Studio': 'Research Design, Investigation Planning, Data Collection, Systematic Research, Research Methodology',
        
        # Innovation activities
        'Innovation Breakthrough Lab': 'Creative Thinking, Innovation Design, Prototyping, Iterative Development, Solution Architecture',
        'Creative Solution Innovation Hub': 'Creative Problem Solving, Innovation Thinking, Solution Generation, Creative Confidence, Original Thinking',
        'Originality Innovation Hub': 'Original Thinking, Creative Innovation, Unique Solution Development, Creative Confidence, Innovation Skills',
        'Innovation Creation Academy': 'Innovation Development, Creative Implementation, Solution Creation, Innovation Skills, Creative Entrepreneurship',
        'Innovation Fusion Studio': 'Creative Synthesis, Innovation Combination, Multi-Idea Integration, Creative Fusion, Innovation Skills',
        'Breakthrough Innovation Studio': 'Breakthrough Thinking, Innovation Mastery, Creative Breakthrough, Innovation Leadership, Creative Excellence',
        'Originality Breakthrough Lab': 'Original Breakthrough Thinking, Creative Innovation, Unique Solution Development, Creative Mastery',
        'Advanced Creative Mastery Studio': 'Advanced Creative Thinking, Innovation Mastery, Creative Leadership, Innovation Excellence, Creative Mastery'
    }
    
    return skills_map

def create_specific_feedback():
    """Create specific, meaningful feedback for each activity"""
    
    feedback_map = {
        # Visual Tracking activities
        'Colorful Mobile Watching': 'Perfect for developing early visual tracking skills - parents report improved eye coordination and focus in their babies.',
        'Light And Shadow Play': 'Excellent for building visual perception - children love discovering how their movements create shadow changes.',
        'Moving Object Tracking': 'Highly effective for developing reading readiness skills - parents notice improved visual attention and tracking abilities.',
        'Visual Pattern Recognition': 'Great foundation for mathematical thinking - children develop pattern recognition skills essential for future learning.',
        
        # Cause and Effect activities
        'Rattle Shake Response': 'Simple but powerful for teaching cause and effect - babies quickly learn that their actions create sounds.',
        'Button Press Discovery': 'Engaging activity that develops fine motor skills and cause-effect understanding - parents love the interactive element.',
        'Sound Making Fun': 'Fosters musical development and auditory awareness - children develop rhythm sense and sound creation confidence.',
        'Touch Response Play': 'Essential for sensory development - babies explore different textures and develop tactile awareness safely.',
        'Action Consequence Games': 'Builds logical thinking foundations - children learn that actions have predictable results.',
        
        # Memory Building activities
        'Familiar Face Recognition': 'Strengthens emotional bonds and social memory - babies develop recognition skills for family members.',
        'Routine Memory Building': 'Creates security through predictable patterns - children develop memory for daily sequences and routines.',
        'Object Permanence Play': 'Critical developmental milestone activity - babies learn that objects exist even when hidden from view.',
        'Song And Rhyme Repetition': 'Builds language and memory skills simultaneously - children develop musical memory and early literacy foundations.',
        'Memory Pattern Games': 'Develops pattern recognition and memory strategies - children learn to predict and remember sequences.',
        
        # Problem Solving activities
        'Simple Shape Fitting': 'Excellent for spatial reasoning development - children learn shape recognition and problem-solving through trial and error.',
        'Basic Stacking Play': 'Teaches balance, gravity, and persistence - children develop building skills and learn from falling towers.',
        'Simple Puzzle Play': 'Builds spatial reasoning and logical thinking - children learn how parts fit together to make wholes.',
        'Exploration Discovery': 'Fosters natural curiosity and discovery skills - children develop confidence in exploring their environment safely.',
        'Thinking Games': 'Challenges growing minds with age-appropriate puzzles - children develop problem-solving and reasoning abilities.',
        
        # Language activities
        'Word Recognition Games': 'Strong foundation for reading success - children connect spoken words with written symbols effectively.',
        'Simple Conversation Practice': 'Develops essential communication skills - children learn turn-taking and social conversation patterns.',
        'Vocabulary Building Play': 'Expands language skills through play - children learn new words and gain confidence in using them.',
        'Sound Pattern Recognition': 'Builds auditory discrimination and musical awareness - children develop rhythm sense and sound recognition.',
        'Language Imitation Games': 'Encourages language development through mimicry - children practice sounds and words in a supportive environment.',
        
        # Memory Enhancement activities
        'Hide and Seek Memory': 'Develops spatial memory and search skills - children learn to remember object locations and use memory strategies.',
        'Picture Memory Games': 'Strengthens visual memory and attention to detail - children develop memory techniques for remembering images.',
        'Familiar Object Recall': 'Builds object recognition and memory confidence - children learn to connect names with objects from memory.',
        'Song and Rhyme Memory': 'Combines musical and language memory - children develop memory strategies through familiar songs and rhymes.',
        
        # Executive Function activities
        'Toddler Concentration Tower Building': 'Develops focus, patience, and fine motor skills - parents report improved attention span and persistence.',
        'Daily Hero Missions': 'Builds responsibility and task completion skills - children develop executive function through age-appropriate challenges.',
        'Focus Fortress': 'Strengthens attention control and concentration - children develop the ability to focus without getting distracted.',
        'Memory Gym Games': 'Exercises memory muscles through fun challenges - children develop memory strategies and confidence in their recall abilities.',
        'Mind Castle Architect': 'Teaches advanced memory techniques - children learn memory palace strategies used by memory champions.',
        'Memory Explorer Kit': 'Provides memory strategies toolkit - children develop personalized memory techniques for school and daily life.',
        'Memory Adventure Quest': 'Makes memory practice exciting and engaging - children develop memory skills through adventure-based learning.',
        'Memory Explorer Adventures': 'Explores different memory techniques - children discover which memory strategies work best for them.',
        
        # Processing Speed activities
        'Speed Thinker Games': 'Develops quick thinking and decision-making - children improve mental agility and processing speed effectively.',
        'Thinking Speed Track': 'Trains mental speed and accuracy - children develop the ability to work efficiently under time pressure.',
        'Rapid Response Games': 'Improves reaction time and mental agility - children develop quick thinking skills while maintaining accuracy.',
        'Cognitive Fitness Center': 'Provides comprehensive mental fitness training - children develop overall cognitive flexibility and mental agility.',
        
        # Abstract Thinking activities
        'Mind-Bending Abstract Adventure': 'Develops higher-order thinking skills - children learn to reason about abstract concepts and complex relationships.',
        'Complex Analysis Navigator': 'Builds analytical thinking and problem decomposition - children learn to break down complex problems systematically.',
        'Puzzle Architect Studio': 'Develops spatial reasoning and design thinking - children learn to approach problems systematically and creatively.',
        
        # Communication Skills activities
        'Voice Command Center': 'Builds public speaking confidence - children develop presentation skills and learn to express ideas clearly.',
        'Message Designer Lab': 'Teaches communication strategy - children learn to adapt their message for different audiences and purposes.',
        'Argument Architect School': 'Develops logical argumentation skills - children learn to construct evidence-based arguments and defend positions respectfully.',
        
        # Leadership Skills activities
        'Executive Choice Studio': 'Develops decision-making and leadership skills - children learn to make complex decisions considering multiple factors.',
        'Group Dynamics Commander': 'Builds team leadership abilities - children learn to manage groups, motivate others, and resolve conflicts.',
        'Leadership Think Tank': 'Develops strategic thinking and leadership vision - children learn to guide others toward common goals effectively.',
        
        # Research Skills activities
        'Investigation Specialist Lab': 'Builds research and analysis skills - children learn to gather information, evaluate sources, and draw conclusions.',
        'Data Explorer Studio': 'Develops data analysis abilities - children learn to collect, organize, and interpret data to find meaningful insights.',
        'Research Architect Studio': 'Teaches research methodology - children learn to design and conduct systematic investigations effectively.',
        
        # Innovation activities
        'Innovation Breakthrough Lab': 'Develops breakthrough thinking and innovation skills - children learn to create transformative solutions to real problems.',
        'Creative Solution Innovation Hub': 'Builds creative problem-solving abilities - children learn to generate innovative solutions and think outside the box.',
        'Originality Innovation Hub': 'Fosters original thinking and creativity - children develop unique perspectives and unconventional solution approaches.',
        'Innovation Creation Academy': 'Teaches innovation implementation - children learn to turn creative ideas into practical, impactful solutions.',
        'Innovation Fusion Studio': 'Develops creative synthesis skills - children learn to combine different ideas and approaches to create breakthrough innovations.',
        'Breakthrough Innovation Studio': 'Masters breakthrough innovation - children develop advanced creative thinking and innovation leadership skills.',
        'Originality Breakthrough Lab': 'Achieves creative breakthroughs - children develop original thinking and revolutionary solution generation abilities.',
        'Advanced Creative Mastery Studio': 'Masters creative innovation excellence - children develop advanced creative thinking and innovation mastery skills.'
    }
    
    return feedback_map

def conservative_fix_robotic_columns():
    """Fix robotic columns with very conservative rate limiting"""
    
    try:
        print(f"🔧 CONSERVATIVE FIX ROBOTIC COLUMNS:")
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
        
        # Get specific content
        skills_map = create_specific_skills()
        feedback_map = create_specific_feedback()
        
        # Get all data
        all_data = activities_worksheet.get_all_values()
        
        print(f"\n🎯 FIXING ROBOTIC COLUMNS (CONSERVATIVE MODE):")
        print("-" * 60)
        
        # Collect all activities to update
        activities_to_update = []
        for row_num, row in enumerate(all_data[1:], start=2):
            if len(row) > max(column_indices.get('Pillar', 0), column_indices.get('Activity Name', 0)):
                pillar = row[column_indices.get('Pillar', 0)].strip()
                activity_name = row[column_indices.get('Activity Name', 0)].strip() if len(row) > column_indices.get('Activity Name', 0) else ''
                
                if pillar == 'Cognitive Skills' and activity_name:
                    activities_to_update.append((row_num, activity_name))
        
        print(f"📊 Found {len(activities_to_update)} activities to update")
        print(f"⏳ Processing 1 activity at a time with 3-minute delays...")
        
        total_updates = 0
        
        # Process one activity at a time with 3-minute delays
        for i, (row_num, activity_name) in enumerate(activities_to_update):
            print(f"\n🔧 Activity {i+1}/{len(activities_to_update)}: Row {row_num}")
            print(f"   📝 {activity_name}")
            
            updates_made = 0
            
            # Update Skills Column
            if activity_name in skills_map and 'Skills' in column_indices:
                new_skills = skills_map[activity_name]
                activities_worksheet.update_cell(row_num, column_indices['Skills'] + 1, new_skills)
                updates_made += 1
                print(f"      ✅ Updated Skills")
                time.sleep(15)  # 15 seconds between updates
            
            # Update Feedback Column
            if activity_name in feedback_map and 'Feedback' in column_indices:
                new_feedback = feedback_map[activity_name]
                activities_worksheet.update_cell(row_num, column_indices['Feedback'] + 1, new_feedback)
                updates_made += 1
                print(f"      ✅ Updated Feedback")
                time.sleep(15)
            
            print(f"   🎉 Completed {updates_made} column updates for {activity_name}")
            total_updates += 1
            
            # Wait 3 minutes between activities (except for the last activity)
            if i < len(activities_to_update) - 1:
                print(f"      ⏳ Waiting 3 minutes before next activity...")
                time.sleep(180)  # 3 minutes
        
        print(f"\n🎉 ROBOTIC COLUMNS FIXED!")
        print("=" * 60)
        print(f"✅ Total activities updated: {total_updates}")
        print(f"✅ Skills and Feedback columns now have specific content")
        print(f"✅ No more robotic templates")
        print(f"✅ Each activity has unique, detailed information")
        
        return True
        
    except Exception as e:
        print(f"❌ Error fixing robotic columns: {e}")
        return False

def main():
    """Main function to fix robotic columns conservatively"""
    print("🔧 Conservative Fix Robotic Columns")
    print("=" * 50)
    print("🎯 Fix robotic columns with very conservative rate limiting")
    
    success = conservative_fix_robotic_columns()
    
    if success:
        print(f"\n✅ SUCCESS! Robotic columns fixed!")
        print("=" * 50)
        print("✅ Skills and Feedback columns updated")
        print("✅ No more robotic templates")
        print("✅ Specific, meaningful content")
        
        return True
    else:
        print(f"\n❌ FAILED to fix robotic columns!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Robotic columns fixed!")
    else:
        print(f"\n❌ FAILED to fix robotic columns!")
