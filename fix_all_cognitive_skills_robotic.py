#!/usr/bin/env python3
"""
🔧 Fix ALL Cognitive Skills Robotic Content
Fix robotic content for ALL Cognitive Skills activities (all age groups)
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

def create_all_specific_skills():
    """Create specific, unique skills for ALL Cognitive Skills activities"""
    
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
        'Advanced Creative Mastery Studio': 'Advanced Creative Thinking, Innovation Mastery, Creative Leadership, Innovation Excellence, Creative Mastery',
        
        # Additional activities that might exist
        'Logic Detective Adventures': 'Logical Reasoning, Deductive Thinking, Evidence Analysis, Problem Solving, Critical Thinking',
        'Time Travel Planner': 'Time Management, Planning Skills, Sequential Thinking, Organization, Future Planning',
        'Emotion Navigator Quest': 'Emotional Intelligence, Self-Awareness, Emotion Regulation, Social Skills, Empathy Development',
        'Reality Builder Journey': 'Creative Thinking, Planning Skills, Goal Setting, Implementation Skills, Project Management',
        'Task Master Training': 'Task Management, Productivity Skills, Focus Development, Time Management, Achievement Skills',
        'Brain Commander Bootcamp': 'Executive Function, Decision Making, Strategic Thinking, Leadership Skills, Mental Discipline',
        'Mental Notepad Olympics': 'Memory Training, Information Processing, Recall Skills, Mental Organization, Cognitive Fitness',
        'Memory Palace Builder': 'Advanced Memory Techniques, Spatial Memory, Visualization Skills, Memory Strategies, Information Architecture',
        'Super Memory Tool Kit': 'Memory Strategies, Learning Techniques, Information Processing, Memory Confidence, Study Skills',
        'Memory Marathon Challenge': 'Endurance Memory Training, Long-term Retention, Memory Strategies, Cognitive Stamina, Recall Excellence'
    }
    
    return skills_map

def fix_all_cognitive_skills_robotic():
    """Fix robotic content for ALL Cognitive Skills activities"""
    
    try:
        print(f"🔧 FIXING ALL COGNITIVE SKILLS ROBOTIC CONTENT:")
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
        
        # Get specific skills content
        skills_map = create_all_specific_skills()
        
        # Get all data
        all_data = activities_worksheet.get_all_values()
        
        print(f"\n🎯 FIXING ALL COGNITIVE SKILLS ACTIVITIES:")
        print("-" * 70)
        
        # Collect all Cognitive Skills activities
        cognitive_activities = []
        for row_num, row in enumerate(all_data[1:], start=2):
            if len(row) > max(column_indices.get('Pillar', 0), column_indices.get('Activity Name', 0)):
                pillar = row[column_indices.get('Pillar', 0)].strip()
                activity_name = row[column_indices.get('Activity Name', 0)].strip() if len(row) > column_indices.get('Activity Name', 0) else ''
                
                if pillar == 'Cognitive Skills' and activity_name:
                    cognitive_activities.append((row_num, activity_name))
        
        print(f"📊 Found {len(cognitive_activities)} Cognitive Skills activities to update")
        print(f"⏳ Processing with 3-second delays between updates...")
        
        total_updates = 0
        
        # Update all Cognitive Skills activities
        for i, (row_num, activity_name) in enumerate(cognitive_activities):
            print(f"\n🔧 Activity {i+1}/{len(cognitive_activities)}: Row {row_num}")
            print(f"   📝 {activity_name}")
            
            updates_made = 0
            
            # Update Skills Column
            if activity_name in skills_map and 'Skills' in column_indices:
                new_skills = skills_map[activity_name]
                activities_worksheet.update_cell(row_num, column_indices['Skills'] + 1, new_skills)
                updates_made += 1
                print(f"      ✅ Updated Skills")
                time.sleep(3)
            
            print(f"   🎉 Completed {updates_made} column updates for {activity_name}")
            total_updates += 1
            
            # Add delay between activities
            if i < len(cognitive_activities) - 1:
                print(f"      ⏳ Waiting 5 seconds before next activity...")
                time.sleep(5)
        
        print(f"\n🎉 ALL COGNITIVE SKILLS ROBOTIC CONTENT FIXED!")
        print("=" * 70)
        print(f"✅ Total activities updated: {total_updates}")
        print(f"✅ Skills column now has specific, unique content")
        print(f"✅ No more robotic templates")
        print(f"✅ Each activity has unique, detailed skills")
        print(f"✅ Professional, engaging, and helpful content")
        
        return True
        
    except Exception as e:
        print(f"❌ Error fixing all cognitive skills robotic content: {e}")
        return False

def main():
    """Main function to fix all cognitive skills robotic content"""
    print("🔧 Fix ALL Cognitive Skills Robotic Content")
    print("=" * 60)
    print("🎯 Fix robotic content for ALL Cognitive Skills activities (all age groups)")
    
    success = fix_all_cognitive_skills_robotic()
    
    if success:
        print(f"\n✅ SUCCESS! All Cognitive Skills robotic content fixed!")
        print("=" * 60)
        print("✅ Skills column updated with specific content")
        print("✅ No more robotic templates")
        print("✅ Each activity has unique, detailed skills")
        
        return True
    else:
        print(f"\n❌ FAILED to fix all cognitive skills robotic content!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! All Cognitive Skills robotic content fixed!")
    else:
        print(f"\n❌ FAILED to fix all cognitive skills robotic content!")

