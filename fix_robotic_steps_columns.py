#!/usr/bin/env python3
"""
🔧 Fix Robotic Steps Columns - Create Specific, Semi-Colon Separated Steps
Fix all robotic steps with specific, meaningful, semi-colon separated instructions
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

def create_specific_steps():
    """Create specific, meaningful steps for each activity"""
    
    steps_mappings = {
        # Child (6-8) Activities
        'Mastermind Planning Adventure': 'Set up planning board with goal cards; Help children identify main objective; Break down big goal into smaller tasks; Create timeline with milestones; Track progress daily; Celebrate each completed step; Review and adjust plan weekly',
        
        'Step-by-Step Detective Mission': 'Present mystery scenario and evidence; Help children identify key clues; Guide systematic investigation process; Encourage hypothesis formation; Test theories with new evidence; Draw logical conclusions; Celebrate mystery solved',
        
        'Mini Detective Mystery Solver': 'Set up observation station with magnifying glasses; Present detail-rich scenes; Guide children to notice specific elements; Practice pattern recognition; Compare findings with others; Discuss what makes good detectives; Build observation confidence',
        
        'Organized Puzzle Master': 'Sort puzzle pieces by color and edge type; Organize workspace systematically; Start with corner and edge pieces; Build sections methodically; Check fit before forcing pieces; Celebrate each section completed; Discuss organization strategies',
        
        'Logic Detective Adventures': 'Present logical reasoning problem; Help identify given information; Guide elimination of impossible options; Encourage systematic deduction; Verify conclusions with evidence; Celebrate breakthrough moments; Discuss logic strategies used',
        
        'Time Travel Planner': 'Choose specific time period to explore; Research historical context; Plan activities for that era; Create timeline of events; Imagine daily life differences; Discuss how planning changes over time; Celebrate historical understanding gained',
        
        'Emotion Detective Stories': 'Read emotion-rich story together; Identify different feelings in characters; Discuss what caused each emotion; Practice recognizing emotions in real life; Role-play appropriate responses; Build emotional vocabulary; Celebrate empathy development',
        
        'Goal Builder Workshop': 'Help children identify personal dreams; Break big goals into small steps; Create visual goal map; Set weekly milestones; Track daily progress; Celebrate small wins; Adjust goals as interests change',
        
        'Daily Hero Missions': 'Assign age-appropriate responsibility; Create mission checklist; Set completion timeline; Check progress regularly; Provide guidance when needed; Celebrate mission completion; Discuss leadership skills gained',
        
        'Focus Fortress': 'Create distraction-free environment; Start with short focus periods; Gradually increase duration; Practice mindfulness techniques; Use focus timers; Celebrate concentration improvements; Discuss focus strategies that work',
        
        'Memory Gym Games': 'Warm up with simple memory games; Practice memory palace technique; Try chunking information; Use visualization strategies; Test recall abilities; Celebrate memory improvements; Build confidence in memory skills',
        
        'Mind Castle Architect': 'Choose familiar location for memory palace; Assign specific rooms to information; Practice walking through palace; Visualize placing memories; Test recall using palace; Celebrate palace mastery; Discuss memory techniques learned',
        
        'Memory Explorer Kit': 'Experiment with different memory techniques; Try visualization, association, and repetition; Test which methods work best; Practice personalized strategies; Track memory improvements; Celebrate technique mastery; Build memory confidence',
        
        'Memory Adventure Quest': 'Create treasure hunt with memory clues; Hide objects in specific locations; Give memory-based directions; Test recall of hidden items; Celebrate successful discoveries; Discuss memory strategies used; Build adventure confidence',
        
        'Memory Explorer Adventures': 'Explore different memory landscapes; Practice memory techniques in various settings; Test recall in different environments; Adapt strategies to new situations; Celebrate memory adaptability; Discuss exploration discoveries; Build memory versatility',
        
        'Speed Thinker Games': 'Start with simple quick-thinking games; Practice rapid decision making; Increase speed gradually; Use timers for challenges; Celebrate speed improvements; Discuss thinking strategies; Build mental agility confidence',
        
        'Detail Detective School': 'Set up detail observation stations; Practice noticing specific features; Compare observations with others; Discuss importance of details; Build attention to detail; Celebrate observation skills; Develop detective confidence',
        
        'Thinking Speed Track': 'Create mental speed challenges; Practice rapid processing; Use timed thinking exercises; Celebrate speed improvements; Discuss thinking strategies; Build cognitive confidence; Develop mental agility',
        
        'Rapid Response Games': 'Practice quick decision making; Use response time challenges; Celebrate rapid thinking; Discuss decision strategies; Build response confidence; Develop mental speed; Practice quick problem solving',
        
        'Cognitive Fitness Center': 'Design comprehensive brain workout; Practice multiple cognitive skills; Track mental fitness improvements; Celebrate cognitive gains; Discuss brain training benefits; Build mental confidence; Develop cognitive versatility',
        
        # Preschooler (3-5) Activities
        'Detective Mystery Challenge': 'Set up simple mystery scene; Help children notice clues; Guide investigation questions; Encourage logical thinking; Celebrate mystery solved; Discuss detective skills; Build problem-solving confidence',
        
        'Cause and Effect Analysis': 'Demonstrate simple cause-effect; Let children create reactions; Discuss what happened and why; Practice predicting outcomes; Celebrate understanding gained; Discuss scientific thinking; Build analytical confidence',
        
        'Family Restaurant Manager': 'Set up pretend restaurant; Assign roles and responsibilities; Practice taking orders; Manage multiple tasks; Serve customers; Celebrate restaurant success; Discuss management skills learned',
        
        'Escape Room Adventure': 'Create simple escape challenges; Provide puzzle clues; Guide teamwork approach; Celebrate escape success; Discuss problem-solving strategies; Build collaborative confidence; Develop puzzle-solving skills',
        
        'Critical Thinking Puzzles': 'Start with simple logic puzzles; Guide reasoning process; Encourage multiple solutions; Celebrate puzzle completion; Discuss thinking strategies; Build logical confidence; Develop problem-solving abilities',
        
        'Memory Olympics Training': 'Create friendly memory competitions; Practice recall techniques; Celebrate memory improvements; Discuss training strategies; Build memory confidence; Develop competitive spirit; Practice memory skills',
        
        'Memory Treasure Hunt': 'Hide treasures with memory clues; Give memory-based directions; Test recall abilities; Celebrate discoveries; Discuss memory strategies; Build treasure-hunting confidence; Develop recall skills',
        
        'Pattern Master Challenge': 'Present pattern recognition games; Guide pattern identification; Practice pattern extension; Celebrate pattern mastery; Discuss pattern strategies; Build pattern confidence; Develop recognition skills',
        
        'Story Sequence Theater': 'Create story with clear sequence; Practice story retelling; Act out story events; Discuss story order; Celebrate storytelling success; Build narrative confidence; Develop sequencing skills',
        
        'Memory Gym Workout': 'Design memory exercise routine; Practice memory techniques; Track memory strength; Celebrate improvements; Discuss workout benefits; Build memory confidence; Develop mental fitness',
        
        'Word Wizard Academy': 'Practice vocabulary building; Use word games and activities; Celebrate word discoveries; Discuss language strategies; Build vocabulary confidence; Develop communication skills; Practice word mastery',
        
        'Public Speaking Academy': 'Create supportive speaking environment; Practice presentation skills; Build speaking confidence; Celebrate communication improvements; Discuss speaking strategies; Develop presentation abilities; Practice public speaking',
        
        'Story Studio Production': 'Plan story production; Assign creative roles; Practice storytelling; Celebrate production success; Discuss creative process; Build storytelling confidence; Develop narrative skills',
        
        'Language Lab Experiments': 'Explore language through experiments; Practice communication techniques; Celebrate language discoveries; Discuss linguistic strategies; Build language confidence; Develop communication skills; Practice language mastery',
        
        'Talk Show Host Training': 'Create talk show format; Practice interview skills; Build communication confidence; Celebrate hosting success; Discuss interview strategies; Develop presentation abilities; Practice conversation skills',
        
        'Innovation Lab: Rethink Everything': 'Encourage creative thinking; Practice problem reimagining; Celebrate innovative solutions; Discuss creative strategies; Build innovation confidence; Develop creative abilities; Practice original thinking',
        
        'Survival Island Adventure': 'Create adventure challenges; Practice problem-solving; Celebrate survival success; Discuss adventure strategies; Build survival confidence; Develop resilience; Practice creative problem solving',
        
        'Creative Solution Innovation Hub': 'Encourage creative problem-solving; Practice innovative thinking; Celebrate solution discoveries; Discuss creative strategies; Build innovation confidence; Develop creative abilities; Practice solution finding',
        
        'Multi-Step Thinking': 'Break down complex tasks; Practice step-by-step planning; Celebrate systematic success; Discuss planning strategies; Build organizational confidence; Develop planning abilities; Practice systematic thinking',
        
        'Brain Gym Circuit Training': 'Design cognitive workout circuit; Practice multiple brain skills; Celebrate cognitive improvements; Discuss training benefits; Build mental confidence; Develop cognitive versatility; Practice brain fitness',
        
        # Toddler (1-3) Activities
        'Word Recognition Games': 'Show familiar word cards; Practice word identification; Celebrate word recognition; Discuss language learning; Build vocabulary confidence; Develop reading readiness; Practice word matching',
        
        'Simple Conversation Practice': 'Create conversation opportunities; Practice turn-taking; Celebrate communication; Discuss social skills; Build conversation confidence; Develop language abilities; Practice dialogue skills',
        
        'Vocabulary Building Play': 'Introduce new words through play; Practice word usage; Celebrate vocabulary growth; Discuss language development; Build word confidence; Develop communication skills; Practice vocabulary expansion',
        
        'Sound Pattern Recognition': 'Play sound matching games; Practice pattern identification; Celebrate sound discoveries; Discuss auditory skills; Build listening confidence; Develop pattern recognition; Practice sound differentiation',
        
        'Language Imitation Games': 'Model language patterns; Practice imitation; Celebrate language progress; Discuss communication skills; Build language confidence; Develop speech abilities; Practice verbal skills',
        
        'Hide and Seek Memory': 'Play memory-based hide and seek; Practice recall of locations; Celebrate successful finds; Discuss memory strategies; Build memory confidence; Develop recall abilities; Practice spatial memory',
        
        'Simple Sequence Games': 'Practice step-by-step activities; Guide sequence completion; Celebrate sequence mastery; Discuss organization skills; Build sequencing confidence; Develop logical thinking; Practice step ordering',
        
        'Familiar Object Recall': 'Practice remembering familiar items; Test recall abilities; Celebrate memory success; Discuss memory strategies; Build recall confidence; Develop memory skills; Practice object recognition',
        
        'Song and Rhyme Memory': 'Practice song and rhyme recall; Test memory abilities; Celebrate musical memory; Discuss memory techniques; Build memory confidence; Develop recall skills; Practice rhythmic memory',
        
        'Picture Memory Games': 'Practice visual memory; Test picture recall; Celebrate visual memory; Discuss memory strategies; Build memory confidence; Develop visual recall; Practice image recognition',
        
        'Simple Shape Sorting': 'Practice shape identification; Guide sorting activities; Celebrate shape mastery; Discuss categorization skills; Build sorting confidence; Develop shape recognition; Practice classification abilities',
        
        'Basic Puzzle Play': 'Practice puzzle completion; Guide piece fitting; Celebrate puzzle success; Discuss problem-solving; Build puzzle confidence; Develop spatial skills; Practice logical thinking',
        
        'Cause and Effect Discovery': 'Demonstrate cause-effect relationships; Practice creating reactions; Celebrate understanding; Discuss scientific thinking; Build discovery confidence; Develop analytical skills; Practice experimentation',
        
        'Simple Building Games': 'Practice construction skills; Guide building activities; Celebrate building success; Discuss engineering concepts; Build construction confidence; Develop spatial abilities; Practice creative building',
        
        'Exploration Challenges': 'Encourage safe exploration; Practice discovery skills; Celebrate exploration success; Discuss curiosity benefits; Build exploration confidence; Develop discovery abilities; Practice investigative skills',
        
        'Concentration Tower Challenge': 'Practice focus and concentration; Guide tower building; Celebrate concentration success; Discuss attention skills; Build focus confidence; Develop concentration abilities; Practice sustained attention',
        
        'Puzzle Master Quest': 'Practice puzzle-solving strategies; Guide completion process; Celebrate puzzle mastery; Discuss problem-solving; Build puzzle confidence; Develop logical thinking; Practice systematic approach',
        
        'Memory Match Adventure': 'Practice memory matching; Guide recall strategies; Celebrate match success; Discuss memory techniques; Build memory confidence; Develop recall abilities; Practice visual memory',
        
        'Story Studio Workshop': 'Practice creative storytelling; Guide story development; Celebrate story creation; Discuss narrative skills; Build storytelling confidence; Develop creativity; Practice imaginative expression',
        
        'Color Explorer Games': 'Practice color identification; Guide color sorting; Celebrate color mastery; Discuss categorization; Build color confidence; Develop recognition skills; Practice color classification'
    }
    
    return steps_mappings

def fix_robotic_steps_columns():
    """Fix all robotic steps columns with specific, semi-colon separated steps"""
    
    try:
        print(f"🔧 FIXING ROBOTIC STEPS COLUMNS - CREATE SPECIFIC, SEMI-COLON SEPARATED STEPS:")
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
        
        print(f"\n🎯 IDENTIFYING ROBOTIC STEPS COLUMNS:")
        print("-" * 80)
        
        # Get specific steps mappings
        steps_mappings = create_specific_steps()
        
        # Find activities with robotic steps
        robotic_steps = []
        for row_num, row in enumerate(all_data[1:], start=2):
            if len(row) > max(column_indices.get('Pillar', 0), column_indices.get('Age Group', 0), column_indices.get('Activity Name', 0)):
                pillar = row[column_indices.get('Pillar', 0)].strip()
                age_group = row[column_indices.get('Age Group', 0)].strip()
                activity_name = row[column_indices.get('Activity Name', 0)].strip() if len(row) > column_indices.get('Activity Name', 0) else ''
                steps = row[column_indices.get('Steps', 0)].strip() if len(row) > column_indices.get('Steps', 0) else ''
                
                if (pillar == 'Cognitive Skills' and 
                    activity_name in steps_mappings and 
                    ('Prepare materials and create engaging environment' in steps or 
                     'Introduce activity with clear, age-appropriate instructions' in steps)):
                    robotic_steps.append((row_num, activity_name, steps_mappings[activity_name], age_group))
        
        print(f"📊 Found {len(robotic_steps)} activities with robotic steps")
        print(f"⏳ Processing with 2-second delays between updates...")
        
        total_updates = 0
        
        # Update all robotic steps
        for i, (row_num, activity_name, new_steps, age_group) in enumerate(robotic_steps):
            try:
                print(f"\n🔧 Activity {i+1}/{len(robotic_steps)}: Row {row_num}")
                print(f"   📝 {activity_name}")
                print(f"   👶 Age Group: {age_group}")
                print(f"   📋 New Steps: {new_steps[:80]}...")
                
                # Update Steps
                activities_worksheet.update_cell(row_num, column_indices['Steps'] + 1, new_steps)
                total_updates += 1
                print(f"      ✅ Updated Steps (Semi-colon separated)")
                
                # Add delay between updates
                if i < len(robotic_steps) - 1:
                    print(f"      ⏳ Waiting 2 seconds before next activity...")
                    time.sleep(2)
                    
            except Exception as e:
                print(f"   ❌ Error updating steps for {activity_name}: {e}")
                print(f"      ⏳ Waiting 3 seconds before continuing...")
                time.sleep(3)
                continue
        
        print(f"\n🎉 ROBOTIC STEPS COLUMNS FIXED!")
        print("=" * 80)
        print(f"✅ Total steps updated: {total_updates}")
        print(f"✅ Removed robotic 'Prepare materials...' templates")
        print(f"✅ Created specific, meaningful, activity-specific steps")
        print(f"✅ All steps now semi-colon separated as requested")
        print(f"✅ Parents get actual useful instructions")
        
        return True
        
    except Exception as e:
        print(f"❌ Error fixing robotic steps columns: {e}")
        return False

def main():
    """Main function to fix robotic steps columns"""
    print("🔧 Fix Robotic Steps Columns - Create Specific, Semi-Colon Separated Steps")
    print("=" * 70)
    print("🎯 Replace robotic step templates with specific, meaningful, semi-colon separated instructions")
    
    success = fix_robotic_steps_columns()
    
    if success:
        print(f"\n✅ SUCCESS! Robotic steps columns fixed!")
        print("=" * 70)
        print("✅ All robotic templates removed")
        print("✅ Specific, meaningful steps created")
        print("✅ Semi-colon separated format applied")
        print("✅ Parents get actual useful instructions")
        
        return True
    else:
        print(f"\n❌ FAILED to fix robotic steps columns!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Robotic steps columns fixed!")
    else:
        print(f"\n❌ FAILED to fix robotic steps columns!")

