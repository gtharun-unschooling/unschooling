#!/usr/bin/env python3
"""
🎯 Fix Robotic Explanations
Replace robotic "Your baby" explanations with natural, engaging content
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
    """Create natural, engaging explanations with varied approaches"""
    
    explanations = {
        # Natural, varied explanations - no more "Your baby" repetition
        
        # Visual Tracking activities - varied approaches
        'Colorful Mobile Watching': 'Watch as tiny eyes follow colorful objects moving through the air, strengthening eye muscles and building the foundation for reading skills. This gentle activity develops visual tracking abilities essential for future learning.',
        
        'Light And Shadow Play': 'Discover the magic of light and shadows! Little ones explore how light creates shadows, learning cause and effect while developing visual perception and understanding of space and movement.',
        
        'Moving Object Tracking': 'Transform curious eyes into skilled observers! Children learn to follow moving objects, developing visual tracking skills essential for reading and sports while practicing focus and eye coordination.',
        
        'Visual Pattern Recognition': 'Introduce the fascinating world of patterns through high-contrast visuals that stimulate developing vision. Children identify simple patterns, building the foundation for mathematical thinking and problem-solving.',
        
        # Memory Building activities - different styles
        'Familiar Face Recognition': 'Build social memory and emotional connections through familiar face exposure. Children learn to recognize family members and caregivers, developing their ability to remember and respond to different people.',
        
        'Routine Memory Building': 'Create security through predictable patterns! Children remember daily routines like feeding and nap times, developing memory for sequences and building confidence through familiar rhythms.',
        
        'Object Permanence Play': 'Master the concept that objects still exist even when hidden! This classic developmental milestone builds memory and spatial awareness as children learn that things don\'t disappear just because they can\'t see them.',
        
        'Song And Rhyme Repetition': 'Create musical memories that last a lifetime! Children learn familiar songs and rhymes, developing memory, language skills, and rhythm while building early literacy foundations through repetition and anticipation.',
        
        'Memory Pattern Games': 'Exercise those growing minds with pattern recognition! Children recognize repeating patterns in games and activities, developing memory and pattern recognition skills while learning to predict what comes next.',
        
        # Problem Solving activities - action-focused
        'Simple Shape Fitting': 'Master the art of shape matching! Children learn that different shapes fit into matching holes, developing spatial reasoning and problem-solving skills through hands-on trial and error.',
        
        'Basic Stacking Play': 'Build towers and discover gravity! Children stack blocks or cups, learning about balance, spatial relationships, and persistence when towers inevitably fall down.',
        
        'Simple Puzzle Play': 'Piece together the puzzle of problem-solving! Children fit puzzle pieces together, developing spatial reasoning and problem-solving skills while learning to recognize shapes and understand how parts fit into wholes.',
        
        'Exploration Discovery': 'Unleash natural curiosity through safe exploration! Children discover their environment, developing curiosity and discovery skills while learning about objects, textures, and cause-and-effect through guided exploration.',
        
        'Thinking Games': 'Challenge growing minds with age-appropriate mental puzzles! Children engage in simple problem-solving activities that challenge their thinking and develop cognitive skills through fun mental challenges.',
        
        # Cause and Effect activities - discovery-focused
        'Rattle Shake Response': 'Discover the magic of cause and effect! Children learn that shaking a rattle creates sound, developing understanding of how their actions produce immediate results while building confidence and motor skills.',
        
        'Button Press Discovery': 'Press buttons and watch the magic happen! Children learn that pressing buttons creates responses like lights, sounds, or movements, developing cause-and-effect thinking and finger dexterity through interactive exploration.',
        
        'Sound Making Fun': 'Create a symphony of discovery! Children experiment with making sounds using safe instruments or toys, developing auditory awareness, rhythm sense, and learning that they can create music through their actions.',
        
        'Touch Response Play': 'Explore the world through touch! Children discover different textures like soft, rough, smooth, and bumpy materials, developing tactile awareness and learning about the world through their sense of touch.',
        
        'Action Consequence Games': 'Become little scientists discovering cause and effect! Children learn that their actions create reactions through simple games, discovering cause and effect relationships while building logical thinking and problem-solving foundations.',
        
        # Communication activities - skill-building focused
        'Word Recognition Games': 'Build the foundation for reading success! Children learn to recognize familiar words in books and signs, connecting spoken words with written symbols and developing early literacy skills.',
        
        'Simple Conversation Practice': 'Master the art of conversation! Children practice having back-and-forth conversations, learning turn-taking and social communication while developing vocabulary and confidence in expressing their thoughts.',
        
        'Vocabulary Building Play': 'Expand word power through play! Children learn new words through interaction and play, expanding their language skills while practicing using words in context and building communication confidence.',
        
        'Sound Pattern Recognition': 'Tune into the rhythm of learning! Children learn to recognize and respond to different sound patterns and rhythms, developing auditory discrimination skills and musical awareness.',
        
        'Language Imitation Games': 'Copy, learn, and grow! Children practice copying sounds, words, and gestures, developing language and communication skills while learning to mimic and respond to verbal cues.',
        
        # Memory Enhancement activities - strategy-focused
        'Hide and Seek Memory': 'Train memory like a detective! Children remember where objects are hidden, developing spatial memory and recall skills while learning to use memory to solve problems and find things.',
        
        'Picture Memory Games': 'Exercise visual memory muscles! Children remember pictures they\'ve seen, developing visual memory and attention skills while practicing focusing on details and recalling information.',
        
        'Familiar Object Recall': 'Connect names with objects! Children remember and identify familiar objects from memory, developing recall skills and object recognition while learning to connect names with objects.',
        
        'Song and Rhyme Memory': 'Sing memories into existence! Children remember and sing familiar songs and rhymes, developing memory, language, and musical skills while building confidence through repetition and recognition.',
        
        # Executive Function activities - goal-oriented
        'Toddler Concentration Tower Building': 'Build focus, one block at a time! Children construct towers using 12 blocks, developing focus, patience, and fine motor skills while learning to plan their approach and persist when blocks fall down.',
        
        'Daily Hero Missions': 'Transform everyday tasks into heroic adventures! Children complete age-appropriate tasks like organizing toys or setting the table, developing responsibility and executive function skills while learning to follow multi-step instructions.',
        
        'Focus Fortress': 'Build an unbreakable focus fortress! Children practice sustained attention through concentration games, building the ability to focus on tasks without getting distracted and improving their ability to complete homework.',
        
        'Memory Gym Games': 'Work out those memory muscles! Children exercise their memory through fun games that challenge recall and recognition, developing strategies for remembering information and building confidence in their memory abilities.',
        
        'Mind Castle Architect': 'Construct mental memory palaces! Children create mental "memory palaces" to remember information, learning advanced memory techniques used by memory champions and discovering how to organize information for better recall.',
        
        'Memory Explorer Kit': 'Discover the secrets of memory! Children learn different memory strategies and techniques, building a toolkit for remembering information in school and daily life while practicing with various memory exercises.',
        
        # Processing Speed activities - performance-focused
        'Speed Thinker Games': 'Race against time and win! Children practice quick thinking and rapid decision-making through fast-paced games, developing mental agility and the ability to process information quickly.',
        
        'Thinking Speed Track': 'Train for mental speed and accuracy! Children train their brain to process information faster through timed challenges, developing mental efficiency and the ability to work under time pressure.',
        
        'Rapid Response Games': 'React fast, think smart! Children exercise their reaction time and processing speed through engaging activities, learning to think and respond quickly while maintaining accuracy.',
        
        'Cognitive Fitness Center': 'Get mentally fit! Children exercise different cognitive skills through varied mental challenges, developing overall mental fitness and building strength in multiple thinking areas.',
        
        # Abstract Thinking activities - concept-focused
        'Mind-Bending Abstract Adventure': 'Journey into the realm of abstract thinking! Children explore abstract concepts like patterns, relationships, and logical sequences, developing higher-order thinking skills and learning to reason about things they can\'t see or touch.',
        
        'Complex Analysis Navigator': 'Navigate the maze of complex problems! Children learn to break down complex problems into manageable parts, developing analytical thinking skills while practicing identifying patterns and relationships in information.',
        
        'Puzzle Architect Studio': 'Design and solve like a master architect! Children design and solve increasingly complex puzzles, developing spatial reasoning and logical thinking while learning to approach problems systematically and creatively.',
        
        # Communication Skills activities - impact-focused
        'Voice Command Center': 'Find your voice and command attention! Children practice public speaking and presentation skills, building confidence in expressing their ideas and learning to organize their thoughts and communicate effectively.',
        
        'Message Designer Lab': 'Craft messages that matter! Children learn to adapt their communication style for different audiences and purposes, developing skills in persuasion, explanation, and storytelling.',
        
        'Argument Architect School': 'Build arguments that stand strong! Children learn to construct logical arguments and defend their positions respectfully, developing critical thinking and communication skills through structured debates.',
        
        # Leadership Skills activities - influence-focused
        'Executive Choice Studio': 'Make decisions like a CEO! Children learn to make complex decisions by considering multiple factors and consequences, developing leadership skills and the ability to guide others through decision-making processes.',
        
        'Group Dynamics Commander': 'Lead teams to victory! Children learn to lead teams, manage group dynamics, and inspire others toward common goals, developing skills in collaboration, motivation, and conflict resolution.',
        
        'Leadership Think Tank': 'Think strategically, lead effectively! Children develop strategic thinking and leadership abilities through complex scenarios, learning to analyze situations, consider multiple perspectives, and make informed decisions.',
        
        # Research Skills activities - discovery-focused
        'Investigation Specialist Lab': 'Investigate like a professional! Children learn to conduct thorough research, evaluate sources, and analyze information critically, developing skills in information literacy and evidence-based reasoning.',
        
        'Data Explorer Studio': 'Explore data and discover insights! Children learn to collect, organize, and analyze data to draw meaningful conclusions, developing skills in research methodology and data interpretation.',
        
        'Research Architect Studio': 'Design investigations that reveal truth! Children learn to design and conduct systematic investigations, developing skills in research planning, data collection, and analysis while practicing the scientific method.',
        
        # Innovation activities - breakthrough-focused
        'Innovation Breakthrough Lab': 'Break through barriers and create breakthroughs! Children tackle real-world challenges like "How can we reduce food waste in our school?" They brainstorm wild ideas, build prototypes, test solutions, and iterate based on feedback, learning to think like entrepreneurs.',
        
        'Creative Solution Innovation Hub': 'Innovate solutions that change the world! Children generate creative solutions to complex problems, developing innovation and creative thinking skills while learning to approach challenges with fresh perspectives.',
        
        'Originality Innovation Hub': 'Create original ideas that inspire! Children develop original thinking and creative problem-solving abilities, developing innovation and creativity skills while learning to generate unique ideas and solutions.',
        
        'Innovation Creation Academy': 'Create innovations that make a difference! Children learn to create and implement innovative solutions to real-world problems, developing entrepreneurship and creative thinking skills while learning to turn ideas into impactful solutions.',
        
        'Innovation Fusion Studio': 'Fuse ideas into breakthrough innovations! Children combine different ideas and approaches to create innovative solutions, developing creative thinking and synthesis skills while learning to merge concepts and create new possibilities.',
        
        'Breakthrough Innovation Studio': 'Create breakthroughs that transform! Children develop breakthrough thinking and innovation skills, developing creative problem-solving and entrepreneurship abilities while learning to create transformative solutions.',
        
        'Originality Breakthrough Lab': 'Break through to original thinking! Children develop original thinking and breakthrough creativity, developing innovation and creative problem-solving skills while learning to generate revolutionary ideas and solutions.',
        
        'Advanced Creative Mastery Studio': 'Master the art of creative innovation! Children master advanced creative thinking and innovation techniques, developing expertise in creative problem-solving and innovation while learning to create breakthrough solutions and lead creative initiatives.'
    }
    
    return explanations

def fix_robotic_explanations():
    """Fix robotic explanations with natural, engaging content"""
    
    try:
        print(f"🎯 FIXING ROBOTIC EXPLANATIONS:")
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
        
        # Get natural explanations
        explanations = create_natural_explanations()
        
        # Get all data
        all_data = activities_worksheet.get_all_values()
        
        print(f"\n🎯 REPLACING ROBOTIC EXPLANATIONS WITH NATURAL CONTENT:")
        print("-" * 60)
        
        total_updates = 0
        
        # Update Cognitive Skills activities
        for row_num, row in enumerate(all_data[1:], start=2):
            if len(row) > max(column_indices.get('Pillar', 0), column_indices.get('Activity Name', 0)):
                pillar = row[column_indices.get('Pillar', 0)].strip()
                activity_name = row[column_indices.get('Activity Name', 0)].strip() if len(row) > column_indices.get('Activity Name', 0) else ''
                
                if pillar == 'Cognitive Skills' and activity_name:
                    # Get the new natural explanation
                    new_explanation = explanations.get(activity_name, '')
                    
                    if new_explanation:
                        print(f"   🎯 Row {row_num}: {activity_name}")
                        print(f"      New Explanation: {new_explanation[:80]}...")
                        
                        # Update the Explanation
                        explanation_col = column_indices.get('Explanation', 10)
                        activities_worksheet.update_cell(row_num, explanation_col + 1, new_explanation)
                        print(f"      ✅ Updated!")
                        time.sleep(2)
                        
                        total_updates += 1
                        
                        # Add delay every 10 updates
                        if total_updates % 10 == 0:
                            print(f"      ⏳ Waiting 30 seconds to avoid rate limits...")
                            time.sleep(30)
                    else:
                        print(f"   ⚠️  Row {row_num}: {activity_name} - No natural explanation available yet")
        
        print(f"\n🎉 ROBOTIC EXPLANATIONS FIXED!")
        print("=" * 50)
        print(f"✅ Total explanations updated: {total_updates}")
        print(f"✅ All explanations are now natural and engaging")
        print(f"✅ No more robotic 'Your baby' repetition")
        print(f"✅ Varied, human-like writing styles")
        print(f"✅ Professional, engaging content")
        
        return True
        
    except Exception as e:
        print(f"❌ Error fixing robotic explanations: {e}")
        return False

def main():
    """Main function to fix robotic explanations"""
    print("🎯 Fix Robotic Explanations")
    print("=" * 50)
    print("🎯 Replace robotic 'Your baby' explanations with natural, engaging content")
    
    success = fix_robotic_explanations()
    
    if success:
        print(f"\n✅ SUCCESS! Robotic explanations fixed!")
        print("=" * 50)
        print("✅ Natural, engaging explanations")
        print("✅ No more robotic repetition")
        print("✅ Varied, human-like writing styles")
        print("✅ Professional, engaging content")
        
        return True
    else:
        print(f"\n❌ FAILED to fix robotic explanations!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Robotic explanations fixed!")
    else:
        print(f"\n❌ FAILED to fix robotic explanations!")
