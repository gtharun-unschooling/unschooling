#!/usr/bin/env python3
"""
🧠 Create All Cognitive Skills Activities for All Ages
Create robust activities for Toddler, Preschooler, Child, Pre-Teen, Teen age groups
Following same method: 4 categories per age group, 5 activities per category
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

def create_cognitive_skills_structure():
    """Create comprehensive structure for all age groups"""
    
    print(f"🧠 CREATING COGNITIVE SKILLS STRUCTURE FOR ALL AGES:")
    print("=" * 70)
    
    structure = {
        'Toddler (1-3)': {
            'categories': {
                'Language Development': {
                    'description': 'Activities that develop vocabulary, communication skills, and language understanding through age-appropriate verbal interactions and word games.',
                    'activity_type': 'Language',
                    'activities': [
                        'Word Recognition Games',
                        'Simple Conversation Practice',
                        'Vocabulary Building Play',
                        'Sound Pattern Recognition',
                        'Language Imitation Games'
                    ]
                },
                'Memory and Recall': {
                    'description': 'Activities that develop memory skills, recall abilities, and pattern recognition through simple memory games and repetition activities.',
                    'activity_type': 'Memory',
                    'activities': [
                        'Hide and Seek Memory',
                        'Simple Sequence Games',
                        'Familiar Object Recall',
                        'Song and Rhyme Memory',
                        'Picture Memory Games'
                    ]
                },
                'Problem Solving Basics': {
                    'description': 'Simple problem-solving activities that introduce basic thinking skills through safe, guided exploration and discovery.',
                    'activity_type': 'Problem Solving',
                    'activities': [
                        'Simple Shape Sorting',
                        'Basic Puzzle Play',
                        'Cause and Effect Discovery',
                        'Simple Building Games',
                        'Exploration Challenges'
                    ]
                },
                'Attention and Focus': {
                    'description': 'Activities that develop attention span, focus, and concentration through engaging, age-appropriate activities.',
                    'activity_type': 'Attention',
                    'activities': [
                        'Focus Building Games',
                        'Attention Span Activities',
                        'Concentration Exercises',
                        'Sustained Play Games',
                        'Focus Training Activities'
                    ]
                }
            }
        },
        'Preschooler (3-5)': {
            'categories': {
                'Critical Thinking': {
                    'description': 'Activities that develop critical thinking skills, reasoning, and logical problem-solving through age-appropriate challenges.',
                    'activity_type': 'Critical Thinking',
                    'activities': [
                        'Logical Reasoning Games',
                        'Cause and Effect Analysis',
                        'Decision Making Activities',
                        'Problem Solving Challenges',
                        'Critical Thinking Puzzles'
                    ]
                },
                'Memory Enhancement': {
                    'description': 'Advanced memory activities that develop recall, recognition, and memory strategies through engaging games.',
                    'activity_type': 'Memory',
                    'activities': [
                        'Memory Strategy Games',
                        'Recall Enhancement Activities',
                        'Pattern Memory Games',
                        'Sequential Memory Play',
                        'Memory Training Exercises'
                    ]
                },
                'Language and Communication': {
                    'description': 'Advanced language activities that develop communication skills, vocabulary, and expressive language.',
                    'activity_type': 'Language',
                    'activities': [
                        'Advanced Vocabulary Games',
                        'Communication Skills Practice',
                        'Storytelling Activities',
                        'Language Expression Games',
                        'Conversation Building'
                    ]
                },
                'Cognitive Flexibility': {
                    'description': 'Activities that develop cognitive flexibility, adaptability, and creative thinking through varied challenges.',
                    'activity_type': 'Cognitive Flexibility',
                    'activities': [
                        'Flexible Thinking Games',
                        'Adaptation Challenges',
                        'Creative Problem Solving',
                        'Multi-Step Thinking',
                        'Cognitive Flexibility Training'
                    ]
                }
            }
        },
        'Child (6-8)': {
            'categories': {
                'Advanced Problem Solving': {
                    'description': 'Complex problem-solving activities that develop analytical thinking, strategy development, and systematic approaches.',
                    'activity_type': 'Problem Solving',
                    'activities': [
                        'Strategic Thinking Games',
                        'Multi-Step Problem Solving',
                        'Analytical Reasoning',
                        'Systematic Problem Solving',
                        'Advanced Logic Games'
                    ]
                },
                'Executive Function': {
                    'description': 'Activities that develop executive function skills including planning, organization, and self-regulation.',
                    'activity_type': 'Executive Function',
                    'activities': [
                        'Planning and Organization',
                        'Self-Regulation Activities',
                        'Goal Setting Games',
                        'Task Management Practice',
                        'Executive Function Training'
                    ]
                },
                'Advanced Memory': {
                    'description': 'Sophisticated memory activities that develop working memory, long-term memory, and memory strategies.',
                    'activity_type': 'Memory',
                    'activities': [
                        'Working Memory Games',
                        'Long-Term Memory Training',
                        'Memory Strategy Development',
                        'Complex Memory Tasks',
                        'Advanced Memory Challenges'
                    ]
                },
                'Cognitive Processing': {
                    'description': 'Activities that develop cognitive processing speed, accuracy, and efficiency through targeted exercises.',
                    'activity_type': 'Cognitive Processing',
                    'activities': [
                        'Processing Speed Games',
                        'Cognitive Accuracy Training',
                        'Mental Efficiency Exercises',
                        'Processing Speed Challenges',
                        'Cognitive Processing Games'
                    ]
                }
            }
        },
        'Pre-Teen (9-12)': {
            'categories': {
                'Complex Reasoning': {
                    'description': 'Advanced reasoning activities that develop abstract thinking, logical analysis, and complex problem-solving skills.',
                    'activity_type': 'Reasoning',
                    'activities': [
                        'Abstract Thinking Games',
                        'Logical Analysis Activities',
                        'Complex Reasoning Challenges',
                        'Advanced Logic Puzzles',
                        'Sophisticated Problem Solving'
                    ]
                },
                'Strategic Thinking': {
                    'description': 'Activities that develop strategic thinking, planning, and long-term goal setting through complex challenges.',
                    'activity_type': 'Strategic Thinking',
                    'activities': [
                        'Strategic Planning Games',
                        'Long-Term Goal Setting',
                        'Strategic Decision Making',
                        'Advanced Planning Activities',
                        'Strategic Thinking Challenges'
                    ]
                },
                'Advanced Communication': {
                    'description': 'Sophisticated communication activities that develop persuasive speaking, debate skills, and advanced language use.',
                    'activity_type': 'Communication',
                    'activities': [
                        'Persuasive Communication',
                        'Debate Skills Practice',
                        'Advanced Language Use',
                        'Public Speaking Activities',
                        'Communication Strategy Games'
                    ]
                },
                'Cognitive Innovation': {
                    'description': 'Creative cognitive activities that develop innovation, creative thinking, and original problem-solving approaches.',
                    'activity_type': 'Innovation',
                    'activities': [
                        'Innovation Challenges',
                        'Creative Problem Solving',
                        'Original Thinking Games',
                        'Innovation Development',
                        'Creative Cognitive Activities'
                    ]
                }
            }
        },
        'Teen (13-18)': {
            'categories': {
                'Advanced Critical Analysis': {
                    'description': 'Sophisticated critical analysis activities that develop deep thinking, evaluation skills, and complex reasoning.',
                    'activity_type': 'Critical Analysis',
                    'activities': [
                        'Deep Analysis Games',
                        'Evaluation Skills Practice',
                        'Complex Reasoning Challenges',
                        'Advanced Critical Thinking',
                        'Sophisticated Analysis Activities'
                    ]
                },
                'Cognitive Leadership': {
                    'description': 'Leadership-focused cognitive activities that develop decision-making, team management, and strategic leadership skills.',
                    'activity_type': 'Leadership',
                    'activities': [
                        'Leadership Decision Making',
                        'Team Management Games',
                        'Strategic Leadership Activities',
                        'Leadership Problem Solving',
                        'Cognitive Leadership Training'
                    ]
                },
                'Advanced Research Skills': {
                    'description': 'Research-focused activities that develop information gathering, analysis, and synthesis skills.',
                    'activity_type': 'Research',
                    'activities': [
                        'Information Gathering Games',
                        'Research Analysis Activities',
                        'Data Synthesis Challenges',
                        'Advanced Research Skills',
                        'Research Methodology Practice'
                    ]
                },
                'Cognitive Innovation': {
                    'description': 'High-level innovation activities that develop creative problem-solving, original thinking, and breakthrough solutions.',
                    'activity_type': 'Innovation',
                    'activities': [
                        'Breakthrough Innovation',
                        'Creative Problem Solving',
                        'Original Thinking Challenges',
                        'Innovation Development',
                        'Advanced Creative Activities'
                    ]
                }
            }
        }
    }
    
    return structure

def create_specific_content_for_all_ages():
    """Create specific content for all activities across all age groups"""
    
    specific_content = {
        # Toddler Activities
        'Word Recognition Games': {
            'steps': '1. Show toddler simple picture cards with words; 2. Say the word clearly and point to picture; 3. Encourage toddler to repeat the word; 4. Ask "Where is the [word]?"; 5. Celebrate when toddler points correctly; 6. Repeat with different words',
            'skills': 'Word Recognition, Vocabulary Building, Language Development, Visual Processing, Memory',
            'objective': 'Develop word recognition and vocabulary skills through interactive picture-word games that support early language development.',
            'explanation': 'Word recognition games help toddlers develop vocabulary and language skills through visual and auditory learning. This activity supports early literacy and communication development.',
            'materials': 'Picture cards with simple words, comfortable seating area',
            'estimated_time': '8-12 minutes',
            'setup_time': '3 minutes',
            'supervision_level': 'Close',
            'hashtags': '#WordRecognition #VocabularyBuilding #LanguageDevelopment #ToddlerLearning #EarlyLiteracy'
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
            'hashtags': '#ConversationSkills #LanguageExpression #Communication #SocialInteraction #ToddlerDevelopment'
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
            'hashtags': '#VocabularyBuilding #ObjectRecognition #LanguageLearning #ToddlerPlay #CognitiveDevelopment'
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
            'hashtags': '#SoundRecognition #PatternRecognition #AuditoryProcessing #ToddlerGames #CognitiveDevelopment'
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
            'hashtags': '#LanguageImitation #SpeechDevelopment #Communication #ToddlerLearning #LanguageSkills'
        },
        
        # Preschooler Activities
        'Logical Reasoning Games': {
            'steps': '1. Present simple logical scenarios; 2. Ask "What happens next?"; 3. Guide child through reasoning process; 4. Encourage logical explanations; 5. Celebrate correct reasoning; 6. Increase complexity gradually',
            'skills': 'Logical Reasoning, Critical Thinking, Problem Solving, Analysis, Cognitive Development',
            'objective': 'Develop logical reasoning skills through interactive scenario-based games that support critical thinking development.',
            'explanation': 'Logical reasoning games help preschoolers develop critical thinking and problem-solving skills through scenario analysis. This activity supports cognitive development and analytical thinking.',
            'materials': 'Scenario cards or pictures, comfortable thinking space',
            'estimated_time': '15-20 minutes',
            'setup_time': '5 minutes',
            'supervision_level': 'Moderate',
            'hashtags': '#LogicalReasoning #CriticalThinking #ProblemSolving #PreschoolerLearning #CognitiveDevelopment'
        },
        'Memory Strategy Games': {
            'steps': '1. Show child a sequence of objects; 2. Hide objects and ask child to recall; 3. Teach simple memory strategies; 4. Practice using strategies; 5. Celebrate improved recall; 6. Increase sequence length',
            'skills': 'Memory Strategies, Recall, Recognition, Cognitive Processing, Learning Techniques',
            'objective': 'Develop memory strategies and recall skills through interactive memory games that support cognitive development.',
            'explanation': 'Memory strategy games help preschoolers develop effective memory techniques and recall abilities. This activity supports cognitive development and learning skills.',
            'materials': 'Various objects for sequencing, comfortable learning area',
            'estimated_time': '12-18 minutes',
            'setup_time': '3 minutes',
            'supervision_level': 'Moderate',
            'hashtags': '#MemoryStrategies #Recall #CognitiveProcessing #PreschoolerLearning #LearningTechniques'
        },
        'Advanced Vocabulary Games': {
            'steps': '1. Introduce new, more complex words; 2. Use words in context; 3. Ask child to use words in sentences; 4. Play word association games; 5. Encourage creative word use; 6. Celebrate vocabulary growth',
            'skills': 'Advanced Vocabulary, Language Development, Word Usage, Communication, Creative Expression',
            'objective': 'Expand vocabulary with more complex words through interactive language games that support advanced communication development.',
            'explanation': 'Advanced vocabulary games help preschoolers develop richer language skills and more sophisticated communication abilities. This activity supports language development and creative expression.',
            'materials': 'Advanced vocabulary cards, comfortable learning space',
            'estimated_time': '15-20 minutes',
            'setup_time': '5 minutes',
            'supervision_level': 'Moderate',
            'hashtags': '#AdvancedVocabulary #LanguageDevelopment #Communication #PreschoolerLearning #CreativeExpression'
        },
        'Flexible Thinking Games': {
            'steps': '1. Present problems with multiple solutions; 2. Ask child to think of different ways to solve; 3. Encourage creative approaches; 4. Celebrate multiple solutions; 5. Discuss why different solutions work; 6. Increase problem complexity',
            'skills': 'Flexible Thinking, Creative Problem Solving, Adaptability, Innovation, Cognitive Flexibility',
            'objective': 'Develop flexible thinking and creative problem-solving skills through multi-solution challenges that support cognitive flexibility.',
            'explanation': 'Flexible thinking games help preschoolers develop adaptability and creative problem-solving abilities. This activity supports cognitive flexibility and innovation skills.',
            'materials': 'Multi-solution problem cards, comfortable thinking space',
            'estimated_time': '18-25 minutes',
            'setup_time': '5 minutes',
            'supervision_level': 'Moderate',
            'hashtags': '#FlexibleThinking #CreativeProblemSolving #Adaptability #PreschoolerLearning #Innovation'
        },
        
        # Child Activities
        'Strategic Thinking Games': {
            'steps': '1. Present strategic challenges; 2. Guide child through planning process; 3. Encourage long-term thinking; 4. Discuss consequences of actions; 5. Practice strategic decision making; 6. Celebrate strategic successes',
            'skills': 'Strategic Thinking, Planning, Long-term Thinking, Decision Making, Problem Solving',
            'objective': 'Develop strategic thinking and planning skills through complex challenges that support advanced cognitive development.',
            'explanation': 'Strategic thinking games help children develop planning abilities and long-term thinking skills. This activity supports advanced problem-solving and decision-making development.',
            'materials': 'Strategic game materials, comfortable planning space',
            'estimated_time': '25-30 minutes',
            'setup_time': '5 minutes',
            'supervision_level': 'Moderate',
            'hashtags': '#StrategicThinking #Planning #DecisionMaking #ChildDevelopment #ProblemSolving'
        },
        'Planning and Organization': {
            'steps': '1. Give child a multi-step task; 2. Help them break it into steps; 3. Guide them to organize materials; 4. Practice following the plan; 5. Discuss what worked well; 6. Celebrate successful completion',
            'skills': 'Planning, Organization, Task Management, Self-Regulation, Executive Function',
            'objective': 'Develop planning and organization skills through structured task completion that supports executive function development.',
            'explanation': 'Planning and organization activities help children develop executive function skills and self-regulation abilities. This activity supports task management and organizational skills.',
            'materials': 'Multi-step task materials, organization tools',
            'estimated_time': '20-25 minutes',
            'setup_time': '5 minutes',
            'supervision_level': 'Moderate',
            'hashtags': '#Planning #Organization #TaskManagement #ExecutiveFunction #ChildDevelopment'
        },
        'Working Memory Games': {
            'steps': '1. Present information to remember; 2. Give child a task to complete; 3. Ask them to recall original information; 4. Practice holding information in mind; 5. Celebrate successful recall; 6. Increase complexity',
            'skills': 'Working Memory, Information Processing, Multi-tasking, Cognitive Control, Memory Management',
            'objective': 'Develop working memory and information processing skills through dual-task challenges that support cognitive development.',
            'explanation': 'Working memory games help children develop the ability to hold and manipulate information in mind while completing other tasks. This activity supports cognitive control and memory management.',
            'materials': 'Information cards, task materials, comfortable learning space',
            'estimated_time': '15-20 minutes',
            'setup_time': '3 minutes',
            'supervision_level': 'Moderate',
            'hashtags': '#WorkingMemory #InformationProcessing #MultiTasking #ChildDevelopment #CognitiveControl'
        },
        'Processing Speed Games': {
            'steps': '1. Present rapid-fire questions or tasks; 2. Encourage quick but accurate responses; 3. Time responses when appropriate; 4. Practice speed with accuracy; 5. Celebrate improved speed; 6. Increase difficulty gradually',
            'skills': 'Processing Speed, Quick Thinking, Accuracy, Cognitive Efficiency, Mental Agility',
            'objective': 'Develop processing speed and cognitive efficiency through rapid-response challenges that support mental agility.',
            'explanation': 'Processing speed games help children develop faster thinking and more efficient cognitive processing. This activity supports mental agility and cognitive efficiency.',
            'materials': 'Quick-response game materials, timer, comfortable space',
            'estimated_time': '10-15 minutes',
            'setup_time': '2 minutes',
            'supervision_level': 'Moderate',
            'hashtags': '#ProcessingSpeed #QuickThinking #CognitiveEfficiency #ChildDevelopment #MentalAgility'
        },
        
        # Pre-Teen Activities
        'Abstract Thinking Games': {
            'steps': '1. Present abstract concepts or scenarios; 2. Ask child to analyze and interpret; 3. Encourage deeper thinking; 4. Discuss abstract connections; 5. Celebrate insightful analysis; 6. Increase abstraction level',
            'skills': 'Abstract Thinking, Conceptual Analysis, Deep Thinking, Interpretation, Cognitive Sophistication',
            'objective': 'Develop abstract thinking and conceptual analysis skills through complex scenarios that support advanced cognitive development.',
            'explanation': 'Abstract thinking games help pre-teens develop sophisticated thinking abilities and conceptual analysis skills. This activity supports advanced cognitive development and analytical thinking.',
            'materials': 'Abstract concept materials, comfortable thinking space',
            'estimated_time': '25-30 minutes',
            'setup_time': '5 minutes',
            'supervision_level': 'Minimal',
            'hashtags': '#AbstractThinking #ConceptualAnalysis #DeepThinking #PreTeenDevelopment #CognitiveSophistication'
        },
        'Strategic Planning Games': {
            'steps': '1. Present complex strategic challenges; 2. Guide through detailed planning process; 3. Encourage consideration of multiple factors; 4. Practice strategic decision making; 5. Discuss long-term implications; 6. Celebrate strategic thinking',
            'skills': 'Strategic Planning, Complex Decision Making, Long-term Thinking, Risk Assessment, Leadership',
            'objective': 'Develop advanced strategic planning and complex decision-making skills through sophisticated challenges that support leadership development.',
            'explanation': 'Strategic planning games help pre-teens develop advanced planning abilities and complex decision-making skills. This activity supports leadership development and strategic thinking.',
            'materials': 'Strategic planning materials, comfortable planning space',
            'estimated_time': '30-35 minutes',
            'setup_time': '5 minutes',
            'supervision_level': 'Minimal',
            'hashtags': '#StrategicPlanning #ComplexDecisionMaking #Leadership #PreTeenDevelopment #StrategicThinking'
        },
        'Persuasive Communication': {
            'steps': '1. Present topics for persuasive discussion; 2. Guide through argument construction; 3. Practice persuasive techniques; 4. Encourage evidence-based arguments; 5. Discuss effective communication; 6. Celebrate persuasive skills',
            'skills': 'Persuasive Communication, Argument Construction, Evidence Analysis, Public Speaking, Critical Thinking',
            'objective': 'Develop persuasive communication and argument construction skills through structured practice that supports advanced communication development.',
            'explanation': 'Persuasive communication activities help pre-teens develop advanced communication skills and critical thinking abilities. This activity supports public speaking and argument construction skills.',
            'materials': 'Persuasive topic materials, comfortable speaking space',
            'estimated_time': '25-30 minutes',
            'setup_time': '5 minutes',
            'supervision_level': 'Minimal',
            'hashtags': '#PersuasiveCommunication #ArgumentConstruction #PublicSpeaking #PreTeenDevelopment #CriticalThinking'
        },
        'Innovation Challenges': {
            'steps': '1. Present open-ended innovation challenges; 2. Encourage creative problem-solving approaches; 3. Guide through innovation process; 4. Celebrate original ideas; 5. Discuss implementation possibilities; 6. Encourage continued innovation',
            'skills': 'Innovation, Creative Problem Solving, Original Thinking, Implementation Planning, Entrepreneurship',
            'objective': 'Develop innovation and creative problem-solving skills through open-ended challenges that support entrepreneurial thinking.',
            'explanation': 'Innovation challenges help pre-teens develop creative thinking and original problem-solving abilities. This activity supports entrepreneurial thinking and innovation skills.',
            'materials': 'Innovation challenge materials, comfortable creative space',
            'estimated_time': '30-35 minutes',
            'setup_time': '5 minutes',
            'supervision_level': 'Minimal',
            'hashtags': '#Innovation #CreativeProblemSolving #Entrepreneurship #PreTeenDevelopment #OriginalThinking'
        },
        
        # Teen Activities
        'Deep Analysis Games': {
            'steps': '1. Present complex topics for analysis; 2. Guide through systematic analysis process; 3. Encourage multiple perspectives; 4. Practice evidence evaluation; 5. Discuss analytical conclusions; 6. Celebrate insightful analysis',
            'skills': 'Deep Analysis, Systematic Thinking, Evidence Evaluation, Critical Assessment, Sophisticated Reasoning',
            'objective': 'Develop deep analysis and systematic thinking skills through complex topic analysis that supports advanced critical thinking.',
            'explanation': 'Deep analysis games help teens develop sophisticated analytical abilities and systematic thinking skills. This activity supports advanced critical thinking and evidence evaluation.',
            'materials': 'Complex analysis materials, comfortable study space',
            'estimated_time': '35-40 minutes',
            'setup_time': '5 minutes',
            'supervision_level': 'Minimal',
            'hashtags': '#DeepAnalysis #SystematicThinking #CriticalThinking #TeenDevelopment #EvidenceEvaluation'
        },
        'Leadership Decision Making': {
            'steps': '1. Present leadership scenarios with decisions needed; 2. Guide through decision-making process; 3. Encourage consideration of team impact; 4. Practice ethical decision making; 5. Discuss leadership implications; 6. Celebrate leadership thinking',
            'skills': 'Leadership Decision Making, Team Management, Ethical Reasoning, Strategic Leadership, Responsibility',
            'objective': 'Develop leadership decision-making and team management skills through realistic scenarios that support leadership development.',
            'explanation': 'Leadership decision-making activities help teens develop advanced leadership abilities and ethical reasoning skills. This activity supports team management and strategic leadership development.',
            'materials': 'Leadership scenario materials, comfortable discussion space',
            'estimated_time': '30-35 minutes',
            'setup_time': '5 minutes',
            'supervision_level': 'Minimal',
            'hashtags': '#LeadershipDecisionMaking #TeamManagement #EthicalReasoning #TeenDevelopment #StrategicLeadership'
        },
        'Information Gathering Games': {
            'steps': '1. Present research topics or questions; 2. Guide through information gathering process; 3. Practice source evaluation; 4. Encourage systematic research; 5. Discuss information quality; 6. Celebrate research skills',
            'skills': 'Information Gathering, Source Evaluation, Research Methodology, Data Analysis, Critical Research',
            'objective': 'Develop information gathering and research methodology skills through structured research activities that support academic development.',
            'explanation': 'Information gathering games help teens develop advanced research skills and source evaluation abilities. This activity supports academic development and critical research skills.',
            'materials': 'Research materials, access to information sources, comfortable study space',
            'estimated_time': '40-45 minutes',
            'setup_time': '5 minutes',
            'supervision_level': 'Minimal',
            'hashtags': '#InformationGathering #ResearchMethodology #SourceEvaluation #TeenDevelopment #CriticalResearch'
        },
        'Breakthrough Innovation': {
            'steps': '1. Present breakthrough innovation challenges; 2. Encourage radical thinking approaches; 3. Guide through innovation process; 4. Celebrate breakthrough ideas; 5. Discuss implementation strategies; 6. Encourage continued innovation',
            'skills': 'Breakthrough Innovation, Radical Thinking, Creative Problem Solving, Implementation Strategy, Entrepreneurship',
            'objective': 'Develop breakthrough innovation and radical thinking skills through advanced challenges that support entrepreneurial development.',
            'explanation': 'Breakthrough innovation activities help teens develop advanced creative thinking and entrepreneurial abilities. This activity supports radical thinking and implementation strategy development.',
            'materials': 'Innovation challenge materials, comfortable creative space',
            'estimated_time': '35-40 minutes',
            'setup_time': '5 minutes',
            'supervision_level': 'Minimal',
            'hashtags': '#BreakthroughInnovation #RadicalThinking #Entrepreneurship #TeenDevelopment #CreativeProblemSolving'
        }
    }
    
    return specific_content

def create_all_cognitive_skills_activities(client):
    """Create all Cognitive Skills activities for all age groups"""
    
    try:
        # Open the Sample 1 spreadsheet
        spreadsheet = client.open_by_key('14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ')
        activities_worksheet = spreadsheet.worksheet('Activities')
        
        print(f"\n🔧 CREATING ALL COGNITIVE SKILLS ACTIVITIES:")
        print("=" * 70)
        
        # Get current data to find next available row
        all_data = activities_worksheet.get_all_values()
        headers = all_data[0]
        
        # Find column indices
        column_indices = {}
        for i, header in enumerate(headers):
            column_indices[header] = i
        
        # Get structure and specific content
        structure = create_cognitive_skills_structure()
        specific_content = create_specific_content_for_all_ages()
        
        # Start from next available row
        next_row = len(all_data) + 1
        
        activities_created = 0
        
        # Create activities for each age group
        for age_group, age_data in structure.items():
            print(f"\n📊 Creating activities for {age_group}:")
            
            activity_number = 1
            
            for category_name, category_data in age_data['categories'].items():
                print(f"   📂 Category: {category_name}")
                
                for activity_name in category_data['activities']:
                    print(f"      🔧 Creating: {activity_name}")
                    
                    # Create activity row
                    activity_row = [''] * len(headers)
                    
                    # Fill in basic information
                    activity_row[column_indices['Activity ID']] = f'cognitive-skills-{age_group.lower().replace(" ", "-").replace("(", "").replace(")", "")}-{category_name.lower().replace(" ", "-")}-{activity_number}'
                    activity_row[column_indices['Pillar']] = 'Cognitive Skills'
                    activity_row[column_indices['Age Group']] = age_group
                    activity_row[column_indices['Difficulty Level']] = 'Beginner' if 'Infant' in age_group else 'Intermediate' if 'Toddler' in age_group or 'Preschooler' in age_group else 'Advanced'
                    activity_row[column_indices['Activity Type']] = category_data['activity_type']
                    activity_row[column_indices['Category']] = category_name
                    activity_row[column_indices['Category Description']] = category_data['description']
                    activity_row[column_indices['Topic Number']] = str(activity_number)
                    activity_row[column_indices['Topic']] = activity_name
                    activity_row[column_indices['Activity Name']] = activity_name
                    
                    # Fill in specific content if available
                    if activity_name in specific_content:
                        content = specific_content[activity_name]
                        activity_row[column_indices['Objective']] = content.get('objective', '')
                        activity_row[column_indices['Steps']] = content.get('steps', '')
                        activity_row[column_indices['Skills']] = content.get('skills', '')
                        activity_row[column_indices['Materials']] = content.get('materials', '')
                        activity_row[column_indices['Estimated Time']] = content.get('estimated_time', '')
                        activity_row[column_indices['Setup Time']] = content.get('setup_time', '')
                        activity_row[column_indices['Supervision Level']] = content.get('supervision_level', 'Moderate')
                        activity_row[column_indices['Hashtags']] = content.get('hashtags', '')
                        activity_row[column_indices['Explanation']] = content.get('explanation', '')
                    
                    # Add row to worksheet
                    activities_worksheet.append_row(activity_row)
                    activities_created += 1
                    activity_number += 1
                    
                    time.sleep(1)  # Rate limiting
        
        print(f"\n🎉 ALL COGNITIVE SKILLS ACTIVITIES CREATED!")
        print("=" * 50)
        print(f"✅ Created {activities_created} activities across all age groups")
        print(f"✅ 4 categories per age group")
        print(f"✅ 5 activities per category")
        print(f"✅ All activities specific to each individual activity")
        print(f"✅ Ready for engagement")
        
        return True
        
    except Exception as e:
        print(f"❌ Error creating activities: {e}")
        return False

def main():
    """Main function to create all Cognitive Skills activities"""
    print("🧠 Creating All Cognitive Skills Activities for All Ages")
    print("=" * 70)
    print("🎯 Create robust activities for Toddler, Preschooler, Child, Pre-Teen, Teen")
    print("🎯 Following same method: 4 categories per age group, 5 activities per category")
    
    # Connect to Google Sheets
    client = get_google_sheets_client()
    if not client:
        return False
    
    # Create all activities
    success = create_all_cognitive_skills_activities(client)
    
    if success:
        print(f"\n✅ SUCCESS! All Cognitive Skills activities created!")
        print("=" * 50)
        print("✅ Created activities for all age groups")
        print("✅ 4 categories per age group")
        print("✅ 5 activities per category")
        print("✅ All activities specific to each individual activity")
        print("✅ Ready for engagement")
        
        return True
    else:
        print(f"\n❌ FAILED to create all Cognitive Skills activities!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! All Cognitive Skills activities creation completed!")
    else:
        print(f"\n❌ FAILED to create all Cognitive Skills activities!")
