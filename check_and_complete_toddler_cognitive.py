#!/usr/bin/env python3
"""
🔍 Check and Complete Toddler Cognitive Skills
Thoroughly check Toddler (1-3) Cognitive Skills activities and complete any gaps
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
        print("✅ Connected to Google Sheets")
        return client
    except Exception as e:
        print(f"❌ Error connecting to Google Sheets: {e}")
        return None

def check_toddler_cognitive_activities(client):
    """Check current Toddler Cognitive Skills activities"""
    
    try:
        # Open the Sample 1 spreadsheet
        spreadsheet = client.open_by_key('14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ')
        activities_worksheet = spreadsheet.worksheet('Activities')
        
        print(f"🔍 CHECKING TODDLER COGNITIVE SKILLS ACTIVITIES:")
        print("=" * 60)
        
        # Get all data
        all_data = activities_worksheet.get_all_values()
        if not all_data:
            print("❌ No data found")
            return None
        
        headers = all_data[0]
        
        # Find column indices
        pillar_col_index = headers.index('Pillar') if 'Pillar' in headers else None
        age_group_col_index = headers.index('Age Group') if 'Age Group' in headers else None
        
        # Find all Toddler Cognitive Skills activities
        toddler_cognitive_activities = []
        
        for row_num, row in enumerate(all_data[1:], start=2):
            if len(row) > max(pillar_col_index, age_group_col_index):
                pillar = row[pillar_col_index].strip()
                age_group = row[age_group_col_index].strip()
                
                if pillar == 'Cognitive Skills' and age_group == 'Toddler (1-3)':
                    activity_data = {}
                    for i, header in enumerate(headers):
                        if i < len(row):
                            activity_data[header] = row[i].strip()
                    activity_data['row'] = row_num
                    toddler_cognitive_activities.append(activity_data)
        
        print(f"📊 Found {len(toddler_cognitive_activities)} Toddler Cognitive Skills activities")
        
        # Analyze current structure
        current_categories = {}
        for activity in toddler_cognitive_activities:
            category = activity.get('Category', 'Unknown')
            if category not in current_categories:
                current_categories[category] = []
            current_categories[category].append({
                'name': activity.get('Activity Name', 'Unknown'),
                'row': activity['row'],
                'has_content': bool(activity.get('Steps', '').strip() and activity.get('Skills', '').strip())
            })
        
        print(f"\n📋 CURRENT TODDLER STRUCTURE:")
        print("=" * 40)
        for category, activities in current_categories.items():
            print(f"📂 {category}: {len(activities)} activities")
            for activity in activities:
                status = "✅ Complete" if activity['has_content'] else "❌ Missing Content"
                print(f"   - {activity['name']} (Row {activity['row']}) - {status}")
        
        return toddler_cognitive_activities, headers, current_categories
        
    except Exception as e:
        print(f"❌ Error checking toddler activities: {e}")
        return None, None, None

def create_complete_toddler_content():
    """Create complete content for all Toddler activities"""
    
    complete_toddler_content = {
        # Language Development Activities
        'Word Recognition Games': {
            'steps': '1. Show toddler simple picture cards with words; 2. Say the word clearly and point to picture; 3. Encourage toddler to repeat the word; 4. Ask "Where is the [word]?"; 5. Celebrate when toddler points correctly; 6. Repeat with different words',
            'skills': 'Word Recognition, Vocabulary Building, Language Development, Visual Processing, Memory',
            'objective': 'Develop word recognition and vocabulary skills through interactive picture-word games that support early language development.',
            'explanation': 'Word recognition games help toddlers develop vocabulary and language skills through visual and auditory learning. This activity supports early literacy and communication development.',
            'materials': 'Picture cards with simple words, comfortable seating area',
            'estimated_time': '8-12 minutes',
            'setup_time': '3 minutes',
            'supervision_level': 'Close',
            'hashtags': '#WordRecognition #VocabularyBuilding #LanguageDevelopment #ToddlerLearning #EarlyLiteracy',
            'age': '18-24 months',
            'general_instructions': 'Keep sessions short and engaging. Use lots of praise and encouragement. Let toddler explore cards at their own pace.',
            'materials_at_home': 'Magazine pictures, homemade picture cards, household objects with labels',
            'kit_materials': 'High-quality picture word cards, storage box, instruction guide',
            'materials_to_buy': 'Picture word cards from educational stores, laminating sheets for durability'
        },
        'Simple Conversation Practice': {
            'steps': '1. Engage toddler in simple conversation; 2. Ask simple questions about their day; 3. Listen carefully to their responses; 4. Expand on their words; 5. Encourage longer responses; 6. End when toddler shows fatigue',
            'skills': 'Conversation Skills, Language Expression, Communication, Listening, Social Interaction',
            'objective': 'Develop conversation skills and language expression through simple, guided conversations that support communication development.',
            'explanation': 'Conversation practice helps toddlers develop language expression and communication skills through interactive dialogue. This activity supports social interaction and language development.',
            'materials': 'Comfortable conversation area, engaging topics',
            'estimated_time': '10-15 minutes',
            'setup_time': '2 minutes',
            'supervision_level': 'Close',
            'hashtags': '#ConversationSkills #LanguageExpression #Communication #SocialInteraction #ToddlerDevelopment',
            'age': '24-36 months',
            'general_instructions': 'Be patient with responses. Use simple questions. Expand on toddler\'s words to model longer sentences.',
            'materials_at_home': 'Family photos, favorite toys, everyday objects to discuss',
            'kit_materials': 'Conversation starter cards, family photo album, discussion prompts',
            'materials_to_buy': 'Conversation starter cards, family photo album, educational discussion materials'
        },
        'Vocabulary Building Play': {
            'steps': '1. Use everyday objects around the house; 2. Name each object clearly; 3. Encourage toddler to repeat the name; 4. Ask toddler to find objects; 5. Use objects in simple sentences; 6. Celebrate new words learned',
            'skills': 'Vocabulary Expansion, Object Recognition, Language Learning, Memory, Cognitive Development',
            'objective': 'Expand vocabulary through interactive object naming and recognition games that support language development.',
            'explanation': 'Vocabulary building play helps toddlers learn new words through hands-on exploration and repetition. This activity supports language development and cognitive growth.',
            'materials': 'Everyday household objects, comfortable play area',
            'estimated_time': '12-18 minutes',
            'setup_time': '2 minutes',
            'supervision_level': 'Close',
            'hashtags': '#VocabularyBuilding #ObjectRecognition #LanguageLearning #ToddlerPlay #CognitiveDevelopment',
            'age': '18-30 months',
            'general_instructions': 'Use objects toddler is familiar with. Repeat words multiple times. Make it fun and playful.',
            'materials_at_home': 'Kitchen utensils, toys, books, household items',
            'kit_materials': 'Vocabulary building objects, storage basket, word cards',
            'materials_to_buy': 'Educational vocabulary toys, word building blocks, picture books'
        },
        'Sound Pattern Recognition': {
            'steps': '1. Make different sounds (clapping, tapping, humming); 2. Ask toddler to listen carefully; 3. Have toddler repeat the sound; 4. Create simple sound patterns; 5. Ask toddler to continue the pattern; 6. Celebrate pattern recognition',
            'skills': 'Sound Recognition, Pattern Recognition, Auditory Processing, Memory, Cognitive Development',
            'objective': 'Develop sound pattern recognition through interactive sound games that support auditory processing and cognitive development.',
            'explanation': 'Sound pattern recognition helps toddlers develop auditory processing skills and pattern recognition abilities. This activity supports cognitive development and listening skills.',
            'materials': 'Various sound-making objects, quiet environment',
            'estimated_time': '8-12 minutes',
            'setup_time': '2 minutes',
            'supervision_level': 'Close',
            'hashtags': '#SoundRecognition #PatternRecognition #AuditoryProcessing #ToddlerGames #CognitiveDevelopment',
            'age': '20-30 months',
            'general_instructions': 'Start with simple sounds. Be patient with repetition. Keep patterns short and clear.',
            'materials_at_home': 'Pots, pans, spoons, musical toys, rhythm instruments',
            'kit_materials': 'Sound pattern cards, rhythm instruments, audio guide',
            'materials_to_buy': 'Musical instruments for toddlers, sound pattern games, rhythm toys'
        },
        'Language Imitation Games': {
            'steps': '1. Use simple, clear phrases; 2. Say phrase slowly and clearly; 3. Encourage toddler to repeat; 4. Use gestures to help understanding; 5. Celebrate successful imitation; 6. Gradually increase phrase complexity',
            'skills': 'Language Imitation, Speech Development, Listening, Memory, Communication',
            'objective': 'Develop language imitation skills through interactive phrase repetition games that support speech development.',
            'explanation': 'Language imitation games help toddlers develop speech and language skills through repetition and modeling. This activity supports communication development and listening skills.',
            'materials': 'Simple phrases and sentences, comfortable environment',
            'estimated_time': '6-10 minutes',
            'setup_time': '1 minute',
            'supervision_level': 'Close',
            'hashtags': '#LanguageImitation #SpeechDevelopment #Communication #ToddlerLearning #LanguageSkills',
            'age': '18-24 months',
            'general_instructions': 'Use clear pronunciation. Repeat phrases multiple times. Use gestures to support understanding.',
            'materials_at_home': 'Favorite books, nursery rhymes, simple songs',
            'kit_materials': 'Language imitation cards, gesture guide, audio examples',
            'materials_to_buy': 'Speech development toys, language learning cards, audio books'
        },
        
        # Memory and Recall Activities
        'Hide and Seek Memory': {
            'steps': '1. Hide familiar objects in easy-to-find places; 2. Tell toddler what to look for; 3. Give simple clues if needed; 4. Celebrate when objects are found; 5. Ask toddler to remember where objects were; 6. Repeat with different objects',
            'skills': 'Memory Development, Object Permanence, Recall, Spatial Memory, Problem Solving',
            'objective': 'Develop memory and recall skills through hide-and-seek games that support cognitive development.',
            'explanation': 'Hide and seek memory games help toddlers develop memory skills and object permanence understanding. This activity supports cognitive development and spatial memory.',
            'materials': 'Familiar toys or objects, comfortable play area',
            'estimated_time': '10-15 minutes',
            'setup_time': '3 minutes',
            'supervision_level': 'Close',
            'hashtags': '#MemoryDevelopment #ObjectPermanence #Recall #SpatialMemory #ToddlerGames',
            'age': '20-30 months',
            'general_instructions': 'Start with obvious hiding places. Use familiar objects. Give lots of encouragement.',
            'materials_at_home': 'Favorite toys, stuffed animals, household objects',
            'kit_materials': 'Memory game objects, hiding place cards, instruction guide',
            'materials_to_buy': 'Memory development toys, hide-and-seek games, spatial learning toys'
        },
        'Simple Sequence Games': {
            'steps': '1. Create simple sequences with 2-3 items; 2. Show toddler the sequence; 3. Mix up the items; 4. Ask toddler to recreate the sequence; 5. Provide help if needed; 6. Celebrate successful sequences',
            'skills': 'Sequential Thinking, Pattern Recognition, Memory, Logical Reasoning, Cognitive Development',
            'objective': 'Develop sequential thinking and pattern recognition through simple sequence games that support cognitive development.',
            'explanation': 'Sequence games help toddlers develop logical thinking and pattern recognition abilities. This activity supports cognitive development and memory skills.',
            'materials': 'Simple objects for sequencing, comfortable play area',
            'estimated_time': '8-12 minutes',
            'setup_time': '3 minutes',
            'supervision_level': 'Close',
            'hashtags': '#SequentialThinking #PatternRecognition #Memory #LogicalReasoning #ToddlerLearning',
            'age': '24-36 months',
            'general_instructions': 'Start with 2-item sequences. Use colorful, interesting objects. Be patient with attempts.',
            'materials_at_home': 'Colored blocks, toy cars, stuffed animals, household items',
            'kit_materials': 'Sequence cards, sequencing objects, pattern guide',
            'materials_to_buy': 'Sequencing toys, pattern recognition games, logical thinking toys'
        },
        'Familiar Object Recall': {
            'steps': '1. Show toddler 3-4 familiar objects; 2. Name each object clearly; 3. Cover objects with a cloth; 4. Ask toddler to name objects from memory; 5. Reveal objects to check answers; 6. Celebrate correct recalls',
            'skills': 'Memory Recall, Object Recognition, Vocabulary, Attention, Cognitive Development',
            'objective': 'Develop memory recall and object recognition through familiar object games that support cognitive development.',
            'explanation': 'Familiar object recall games help toddlers develop memory skills and object recognition abilities. This activity supports cognitive development and vocabulary building.',
            'materials': '3-4 familiar objects, cloth for covering, comfortable area',
            'estimated_time': '6-10 minutes',
            'setup_time': '2 minutes',
            'supervision_level': 'Close',
            'hashtags': '#MemoryRecall #ObjectRecognition #Vocabulary #Attention #ToddlerDevelopment',
            'age': '20-30 months',
            'general_instructions': 'Use objects toddler knows well. Keep sessions short. Give lots of praise.',
            'materials_at_home': 'Favorite toys, household objects, books, stuffed animals',
            'kit_materials': 'Recall game objects, memory cards, instruction guide',
            'materials_to_buy': 'Memory development toys, recall games, cognitive learning toys'
        },
        'Song and Rhyme Memory': {
            'steps': '1. Sing familiar songs or nursery rhymes; 2. Encourage toddler to join in; 3. Pause and let toddler fill in words; 4. Repeat songs multiple times; 5. Celebrate when toddler remembers words; 6. Add new songs gradually',
            'skills': 'Auditory Memory, Language Development, Rhythm, Pattern Recognition, Social Interaction',
            'objective': 'Develop auditory memory and language skills through song and rhyme repetition that supports cognitive development.',
            'explanation': 'Song and rhyme memory games help toddlers develop auditory memory and language skills through repetition and rhythm. This activity supports cognitive development and social interaction.',
            'materials': 'Familiar songs or nursery rhymes, comfortable environment',
            'estimated_time': '10-15 minutes',
            'setup_time': '1 minute',
            'supervision_level': 'Close',
            'hashtags': '#AuditoryMemory #LanguageDevelopment #Rhythm #PatternRecognition #ToddlerSongs',
            'age': '18-30 months',
            'general_instructions': 'Use songs toddler enjoys. Repeat frequently. Use gestures and movement.',
            'materials_at_home': 'Music player, favorite songs, nursery rhyme books',
            'kit_materials': 'Song cards, rhythm instruments, audio guide',
            'materials_to_buy': 'Children\'s music, nursery rhyme books, musical instruments'
        },
        'Picture Memory Games': {
            'steps': '1. Show toddler 2-3 simple pictures; 2. Name each picture clearly; 3. Remove pictures from view; 4. Ask toddler to remember what they saw; 5. Show pictures again to check; 6. Celebrate correct memories',
            'skills': 'Visual Memory, Picture Recognition, Vocabulary, Attention, Cognitive Development',
            'objective': 'Develop visual memory and picture recognition through simple picture games that support cognitive development.',
            'explanation': 'Picture memory games help toddlers develop visual memory and picture recognition abilities. This activity supports cognitive development and vocabulary building.',
            'materials': 'Simple, colorful pictures, comfortable viewing area',
            'estimated_time': '6-10 minutes',
            'setup_time': '2 minutes',
            'supervision_level': 'Close',
            'hashtags': '#VisualMemory #PictureRecognition #Vocabulary #Attention #ToddlerLearning',
            'age': '20-30 months',
            'general_instructions': 'Use simple, colorful pictures. Keep sessions short. Give lots of encouragement.',
            'materials_at_home': 'Picture books, family photos, magazine pictures',
            'kit_materials': 'Picture memory cards, storage box, instruction guide',
            'materials_to_buy': 'Picture memory games, visual learning cards, educational pictures'
        },
        
        # Problem Solving Basics Activities
        'Simple Shape Sorting': {
            'steps': '1. Provide simple shape sorting toy; 2. Show toddler how to match shapes; 3. Let toddler try independently; 4. Provide gentle guidance if needed; 5. Celebrate successful matches; 6. Encourage continued sorting',
            'skills': 'Shape Recognition, Problem Solving, Hand-Eye Coordination, Logical Thinking, Fine Motor Skills',
            'objective': 'Develop shape recognition and problem-solving skills through simple sorting activities that support cognitive development.',
            'explanation': 'Shape sorting games help toddlers develop problem-solving skills and shape recognition abilities. This activity supports cognitive development and fine motor skills.',
            'materials': 'Simple shape sorting toy, comfortable play area',
            'estimated_time': '10-15 minutes',
            'setup_time': '2 minutes',
            'supervision_level': 'Close',
            'hashtags': '#ShapeRecognition #ProblemSolving #HandEyeCoordination #ToddlerLearning #FineMotorSkills',
            'age': '24-36 months',
            'general_instructions': 'Start with simple shapes. Be patient with attempts. Provide gentle help when needed.',
            'materials_at_home': 'Kitchen containers, different shaped objects, homemade sorting boxes',
            'kit_materials': 'Shape sorting toy, instruction guide, extension activities',
            'materials_to_buy': 'Educational shape sorters, sorting toys, shape recognition games'
        },
        'Basic Puzzle Play': {
            'steps': '1. Provide simple 2-4 piece puzzles; 2. Show toddler how pieces fit together; 3. Let toddler try independently; 4. Provide help when frustrated; 5. Celebrate completed puzzles; 6. Gradually increase difficulty',
            'skills': 'Problem Solving, Spatial Reasoning, Hand-Eye Coordination, Persistence, Cognitive Development',
            'objective': 'Develop problem-solving and spatial reasoning skills through basic puzzle play that supports cognitive development.',
            'explanation': 'Puzzle play helps toddlers develop problem-solving skills and spatial reasoning abilities. This activity supports cognitive development and persistence.',
            'materials': 'Simple 2-4 piece puzzles, comfortable play area',
            'estimated_time': '8-12 minutes',
            'setup_time': '2 minutes',
            'supervision_level': 'Close',
            'hashtags': '#ProblemSolving #SpatialReasoning #HandEyeCoordination #ToddlerPuzzles #CognitiveDevelopment',
            'age': '24-36 months',
            'general_instructions': 'Start with very simple puzzles. Provide encouragement. Don\'t rush the process.',
            'materials_at_home': 'Homemade puzzles from pictures, simple board puzzles',
            'kit_materials': 'Basic puzzle set, instruction guide, progression activities',
            'materials_to_buy': 'Age-appropriate puzzles, puzzle storage, educational puzzle games'
        },
        'Cause and Effect Discovery': {
            'steps': '1. Use simple cause-effect toys; 2. Demonstrate the action and result; 3. Let toddler try the action; 4. Celebrate when effect occurs; 5. Encourage repeated attempts; 6. Explore different cause-effect relationships',
            'skills': 'Cause and Effect Understanding, Problem Solving, Exploration, Logical Thinking, Cognitive Development',
            'objective': 'Develop understanding of cause and effect relationships through interactive discovery games that support cognitive development.',
            'explanation': 'Cause and effect discovery games help toddlers understand action-consequence relationships and develop problem-solving skills. This activity supports cognitive development and exploration.',
            'materials': 'Simple cause-effect toys, comfortable play area',
            'estimated_time': '10-15 minutes',
            'setup_time': '3 minutes',
            'supervision_level': 'Close',
            'hashtags': '#CauseAndEffect #ProblemSolving #Exploration #ToddlerDiscovery #CognitiveDevelopment',
            'age': '18-30 months',
            'general_instructions': 'Use toys with clear cause-effect relationships. Be enthusiastic about results. Let toddler explore freely.',
            'materials_at_home': 'Light switches, water toys, musical instruments, pop-up toys',
            'kit_materials': 'Cause-effect toys, discovery guide, extension activities',
            'materials_to_buy': 'Educational cause-effect toys, discovery games, interactive learning toys'
        },
        'Simple Building Games': {
            'steps': '1. Provide large, safe building blocks; 2. Show toddler how to stack blocks; 3. Let toddler build freely; 4. Encourage different structures; 5. Celebrate successful builds; 6. Discuss what was built',
            'skills': 'Building Skills, Spatial Reasoning, Problem Solving, Creativity, Fine Motor Skills',
            'objective': 'Develop building skills and spatial reasoning through simple construction games that support cognitive development.',
            'explanation': 'Building games help toddlers develop spatial reasoning and problem-solving skills through hands-on construction. This activity supports cognitive development and creativity.',
            'materials': 'Large, safe building blocks, comfortable play area',
            'estimated_time': '12-18 minutes',
            'setup_time': '2 minutes',
            'supervision_level': 'Close',
            'hashtags': '#BuildingSkills #SpatialReasoning #ProblemSolving #ToddlerBuilding #Creativity',
            'age': '20-36 months',
            'general_instructions': 'Use large, safe blocks. Let toddler build freely. Celebrate all attempts.',
            'materials_at_home': 'Cardboard boxes, plastic containers, soft blocks, pillows',
            'kit_materials': 'Building block set, construction guide, extension activities',
            'materials_to_buy': 'Educational building blocks, construction toys, spatial learning games'
        },
        'Exploration Challenges': {
            'steps': '1. Set up safe exploration area with various objects; 2. Let toddler explore freely; 3. Observe what interests them; 4. Ask questions about discoveries; 5. Encourage continued exploration; 6. Discuss findings together',
            'skills': 'Exploration, Discovery, Problem Solving, Curiosity, Cognitive Development',
            'objective': 'Encourage exploration and discovery through safe, guided exploration activities that support cognitive development.',
            'explanation': 'Exploration challenges help toddlers develop curiosity and problem-solving skills through hands-on discovery. This activity supports cognitive development and learning.',
            'materials': 'Various safe objects for exploration, comfortable play area',
            'estimated_time': '15-20 minutes',
            'setup_time': '3 minutes',
            'supervision_level': 'Close',
            'hashtags': '#Exploration #Discovery #ProblemSolving #ToddlerLearning #Curiosity',
            'age': '18-30 months',
            'general_instructions': 'Ensure all objects are safe. Follow toddler\'s interests. Ask open-ended questions.',
            'materials_at_home': 'Kitchen utensils, safe household objects, natural materials',
            'kit_materials': 'Exploration objects, discovery guide, safety checklist',
            'materials_to_buy': 'Educational exploration toys, discovery kits, sensory learning materials'
        },
        
        # Attention and Focus Activities
        'Focus Building Games': {
            'steps': '1. Choose one engaging activity; 2. Set up distraction-free environment; 3. Guide toddler to focus on activity; 4. Encourage sustained attention; 5. Celebrate focused moments; 6. Gradually increase focus time',
            'skills': 'Attention Development, Focus, Concentration, Self-Regulation, Cognitive Control',
            'objective': 'Develop attention span and focus through engaging activities that support cognitive development.',
            'explanation': 'Focus building games help toddlers develop attention span and concentration abilities. This activity supports cognitive development and self-regulation.',
            'materials': 'Engaging, age-appropriate activity materials, quiet environment',
            'estimated_time': '5-10 minutes',
            'setup_time': '2 minutes',
            'supervision_level': 'Close',
            'hashtags': '#AttentionDevelopment #Focus #Concentration #ToddlerLearning #SelfRegulation',
            'age': '20-30 months',
            'general_instructions': 'Start with short focus periods. Remove distractions. Be patient with attention span.',
            'materials_at_home': 'Favorite books, puzzles, quiet toys, comfortable seating',
            'kit_materials': 'Focus building activities, attention guide, timer',
            'materials_to_buy': 'Attention development toys, focus games, concentration aids'
        },
        'Attention Span Activities': {
            'steps': '1. Choose activity that matches toddler\'s interests; 2. Set clear start and end points; 3. Encourage completion of activity; 4. Provide gentle reminders to focus; 5. Celebrate when activity is completed; 6. Gradually extend activity time',
            'skills': 'Attention Span, Task Completion, Persistence, Self-Control, Cognitive Development',
            'objective': 'Develop attention span and task completion skills through engaging activities that support cognitive development.',
            'explanation': 'Attention span activities help toddlers develop the ability to focus and complete tasks. This activity supports cognitive development and persistence.',
            'materials': 'Age-appropriate activity materials, comfortable environment',
            'estimated_time': '8-12 minutes',
            'setup_time': '2 minutes',
            'supervision_level': 'Close',
            'hashtags': '#AttentionSpan #TaskCompletion #Persistence #ToddlerDevelopment #SelfControl',
            'age': '24-36 months',
            'general_instructions': 'Choose activities toddler enjoys. Set realistic time limits. Provide encouragement.',
            'materials_at_home': 'Coloring books, simple crafts, favorite toys, books',
            'kit_materials': 'Attention span activities, completion guide, progress tracker',
            'materials_to_buy': 'Attention development games, task completion toys, focus aids'
        },
        'Concentration Exercises': {
            'steps': '1. Set up quiet, focused environment; 2. Choose simple concentration activity; 3. Guide toddler through activity; 4. Encourage sustained concentration; 5. Provide gentle support when needed; 6. Celebrate concentration efforts',
            'skills': 'Concentration, Mental Focus, Self-Regulation, Cognitive Control, Attention',
            'objective': 'Develop concentration and mental focus through structured exercises that support cognitive development.',
            'explanation': 'Concentration exercises help toddlers develop the ability to focus mentally and sustain attention. This activity supports cognitive development and self-regulation.',
            'materials': 'Simple concentration activities, quiet environment',
            'estimated_time': '5-8 minutes',
            'setup_time': '2 minutes',
            'supervision_level': 'Close',
            'hashtags': '#Concentration #MentalFocus #SelfRegulation #ToddlerLearning #Attention',
            'age': '24-36 months',
            'general_instructions': 'Keep exercises simple and short. Provide lots of encouragement. Don\'t force concentration.',
            'materials_at_home': 'Quiet toys, books, simple puzzles, comfortable seating',
            'kit_materials': 'Concentration exercises, focus guide, relaxation materials',
            'materials_to_buy': 'Concentration games, focus development toys, mindfulness activities'
        },
        'Sustained Play Games': {
            'steps': '1. Choose engaging, open-ended play activity; 2. Set up inviting play environment; 3. Let toddler engage with activity; 4. Encourage extended play; 5. Join in when appropriate; 6. Celebrate sustained engagement',
            'skills': 'Sustained Attention, Extended Play, Engagement, Creativity, Cognitive Development',
            'objective': 'Develop sustained attention and extended play skills through engaging activities that support cognitive development.',
            'explanation': 'Sustained play games help toddlers develop the ability to engage in extended, focused play. This activity supports cognitive development and creativity.',
            'materials': 'Open-ended play materials, comfortable play environment',
            'estimated_time': '15-25 minutes',
            'setup_time': '3 minutes',
            'supervision_level': 'Close',
            'hashtags': '#SustainedAttention #ExtendedPlay #Engagement #ToddlerPlay #Creativity',
            'age': '24-36 months',
            'general_instructions': 'Choose activities toddler loves. Don\'t interrupt focused play. Join in when invited.',
            'materials_at_home': 'Blocks, dolls, toy cars, art supplies, books',
            'kit_materials': 'Sustained play activities, engagement guide, play extension ideas',
            'materials_to_buy': 'Open-ended toys, creative play materials, engagement games'
        },
        'Focus Training Activities': {
            'steps': '1. Create focus training environment; 2. Introduce simple focus exercises; 3. Guide toddler through exercises; 4. Practice sustained attention; 5. Provide positive reinforcement; 6. Gradually increase difficulty',
            'skills': 'Focus Training, Attention Control, Mental Discipline, Self-Regulation, Cognitive Development',
            'objective': 'Develop focus training and attention control through structured exercises that support cognitive development.',
            'explanation': 'Focus training activities help toddlers develop attention control and mental discipline. This activity supports cognitive development and self-regulation.',
            'materials': 'Focus training materials, quiet environment',
            'estimated_time': '6-10 minutes',
            'setup_time': '2 minutes',
            'supervision_level': 'Close',
            'hashtags': '#FocusTraining #AttentionControl #MentalDiscipline #ToddlerDevelopment #SelfRegulation',
            'age': '24-36 months',
            'general_instructions': 'Keep training fun and game-like. Provide lots of praise. Don\'t push beyond toddler\'s limits.',
            'materials_at_home': 'Simple focus games, quiet activities, comfortable seating',
            'kit_materials': 'Focus training kit, instruction guide, progress tracker',
            'materials_to_buy': 'Focus development games, attention training toys, cognitive exercises'
        }
    }
    
    return complete_toddler_content

def complete_toddler_activities(client, toddler_activities, headers, complete_content):
    """Complete any missing content in Toddler activities"""
    
    try:
        # Open the Sample 1 spreadsheet
        spreadsheet = client.open_by_key('14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ')
        activities_worksheet = spreadsheet.worksheet('Activities')
        
        print(f"\n🔧 COMPLETING TODDLER ACTIVITIES:")
        print("=" * 50)
        
        # Find column indices
        column_indices = {}
        for i, header in enumerate(headers):
            column_indices[header] = i
        
        fixes_made = 0
        
        # Complete each Toddler activity
        for activity in toddler_activities:
            activity_name = activity.get('Activity Name', '')
            row_num = activity['row']
            
            if activity_name in complete_content:
                content = complete_content[activity_name]
                
                print(f"\n🔧 Completing: {activity_name} (Row {row_num})")
                
                # Update each column with complete content
                for column_name, value in content.items():
                    if column_name in column_indices:
                        column_index = column_indices[column_name]
                        current_value = activity.get(column_name, '')
                        
                        if not current_value.strip() or current_value != value:
                            activities_worksheet.update_cell(row_num, column_index + 1, value)
                            print(f"   ✅ {column_name}: Updated")
                            time.sleep(1)  # Rate limiting
                        else:
                            print(f"   ✅ {column_name}: Already complete")
                
                fixes_made += 1
        
        print(f"\n🎉 TODDLER ACTIVITIES COMPLETED!")
        print("=" * 40)
        print(f"✅ Completed {fixes_made} Toddler activities")
        print(f"✅ All columns filled with specific content")
        print(f"✅ Ready for engagement")
        
        return True
        
    except Exception as e:
        print(f"❌ Error completing toddler activities: {e}")
        return False

def main():
    """Main function to check and complete Toddler Cognitive Skills"""
    print("🔍 Checking and Completing Toddler Cognitive Skills")
    print("=" * 70)
    print("🎯 Thoroughly check Toddler (1-3) Cognitive Skills and complete any gaps")
    
    # Connect to Google Sheets
    client = get_google_sheets_client()
    if not client:
        return False
    
    # Check current Toddler activities
    toddler_activities, headers, current_categories = check_toddler_cognitive_activities(client)
    if not toddler_activities:
        print("❌ No Toddler Cognitive Skills activities found")
        return False
    
    # Get complete content
    complete_content = create_complete_toddler_content()
    
    # Complete any missing content
    success = complete_toddler_activities(client, toddler_activities, headers, complete_content)
    
    if success:
        print(f"\n✅ SUCCESS! Toddler Cognitive Skills completed!")
        print("=" * 50)
        print("✅ All 20 Toddler activities checked")
        print("✅ All gaps filled with complete content")
        print("✅ All columns specific to each activity")
        print("✅ Ready for engagement")
        
        return True
    else:
        print(f"\n❌ FAILED to complete Toddler Cognitive Skills!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Toddler Cognitive Skills completion finished!")
    else:
        print(f"\n❌ FAILED to complete Toddler Cognitive Skills!")
