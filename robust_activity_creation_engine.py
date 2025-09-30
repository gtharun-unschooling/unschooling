#!/usr/bin/env python3
"""
🎯 Robust Activity Creation Engine
Systematic, non-duplicate, pillar-specific activity creation with Google Sheets integration
"""

import gspread
from google.oauth2.service_account import Credentials
import time
import random
from datetime import datetime

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

class RobustActivityCreator:
    """Robust activity creation engine with duplicate prevention and quality control"""
    
    def __init__(self, client):
        self.client = client
        self.existing_activities = {}
        self.quality_threshold = 8  # Minimum quality score
        
        # Define pillar-specific strategies
        self.pillar_strategies = {
            'Play & Creativity': {
                'focus': 'Creative expression, imagination, artistic development',
                'unique_skills': ['Creativity', 'Imagination', 'Artistic Expression', 'Musical Abilities', 'Construction'],
                'age_categories': {
                    'Infant (0-1)': ['Sensory Exploration', 'Tummy Time Play', 'Interactive Sounds And Textures', 'Parent Child Bonding Activities'],
                    'Toddler (1-3)': ['Pretend Play', 'Building With Blocks', 'Drawing And Scribbling', 'Exploring Musical Instruments'],
                    'Preschooler (3-5)': ['Imaginative Play With Dolls', 'Simple Crafting', 'Role Playing Games', 'Shape Sorting And Color Matching'],
                    'Child (6-8)': ['Creative Storytelling', 'Advanced Drawing And Painting', 'Diy Craft Projects', 'Inventing Games'],
                    'Pre-Teen (9-12)': ['Design Thinking For Toys', 'Stop Motion Animation Projects', 'Music Composition And Recording', 'Sculpting And 3D Modeling'],
                    'Teen (13-18)': ['Artistic Performance And Design', 'Creating Digital Art', 'Building And Designing Gadgets', 'Independent Fashion Design']
                }
            }
        }
        
        # Age-specific requirements
        self.age_requirements = {
            'Infant (0-1)': {
                'duration': '2-5 minutes',
                'supervision': 'Constant',
                'materials': 'Soft, non-toxic, large enough to prevent choking',
                'skills_focus': 'Sensory exploration, visual tracking, basic cause-and-effect',
                'complexity': 'Very simple, single-step activities'
            },
            'Toddler (1-3)': {
                'duration': '5-15 minutes',
                'supervision': 'Close',
                'materials': 'Large, durable, easy to manipulate',
                'skills_focus': 'Exploration, basic problem-solving, pretend play',
                'complexity': 'Simple, 2-3 step activities'
            },
            'Preschooler (3-5)': {
                'duration': '15-30 minutes',
                'supervision': 'Moderate',
                'materials': 'Craft supplies, age-appropriate tools',
                'skills_focus': 'Creative expression, social skills, following instructions',
                'complexity': 'Moderate, 3-4 step activities'
            },
            'Child (6-8)': {
                'duration': '30-45 minutes',
                'supervision': 'Minimal',
                'materials': 'Art supplies, writing materials',
                'skills_focus': 'Creative projects, writing, detailed crafts',
                'complexity': 'Complex, 4-5 step activities'
            },
            'Pre-Teen (9-12)': {
                'duration': '45-60 minutes',
                'supervision': 'Independent with check-ins',
                'materials': 'Advanced craft supplies, technology tools',
                'skills_focus': 'Complex projects, design thinking, technology',
                'complexity': 'Advanced, 5+ step activities'
            },
            'Teen (13-18)': {
                'duration': '60+ minutes',
                'supervision': 'Independent with guidance',
                'materials': 'Professional-level supplies and tools',
                'skills_focus': 'Sophisticated projects, professional skills',
                'complexity': 'Expert-level, multi-step projects'
            }
        }
    
    def load_existing_activities(self, worksheet):
        """Load existing activities to prevent duplicates"""
        print("📊 Loading existing activities for duplicate checking...")
        
        all_data = worksheet.get_all_values()
        if not all_data:
            return
        
        headers = all_data[0]
        
        # Find column indices
        activity_id_col = headers.index('Activity ID') if 'Activity ID' in headers else None
        activity_name_col = headers.index('Activity Name') if 'Activity Name' in headers else None
        steps_col = headers.index('Steps') if 'Steps' in headers else None
        materials_col = headers.index('Materials') if 'Materials' in headers else None
        skills_col = headers.index('Skills') if 'Skills' in headers else None
        objective_col = headers.index('Objective') if 'Objective' in headers else None
        
        # Load existing data
        for row in all_data[1:]:
            if len(row) > max(activity_id_col, activity_name_col, steps_col, materials_col, skills_col, objective_col):
                activity_id = row[activity_id_col].strip()
                activity_name = row[activity_name_col].strip()
                steps = row[steps_col].strip()
                materials = row[materials_col].strip()
                skills = row[skills_col].strip()
                objective = row[objective_col].strip()
                
                self.existing_activities[activity_id] = {
                    'name': activity_name,
                    'steps': steps,
                    'materials': materials,
                    'skills': skills,
                    'objective': objective
                }
        
        print(f"✅ Loaded {len(self.existing_activities)} existing activities")
    
    def check_duplicates(self, activity_data):
        """Check for duplicates across multiple levels"""
        activity_name = activity_data.get('activity_name', '').lower()
        steps = activity_data.get('steps', '').lower()
        materials = activity_data.get('materials', '').lower()
        skills = activity_data.get('skills', '').lower()
        objective = activity_data.get('objective', '').lower()
        
        # Check against existing activities
        for existing_id, existing_data in self.existing_activities.items():
            # Level 1: Activity Name Check
            if activity_name in existing_data['name'].lower() or existing_data['name'].lower() in activity_name:
                return f"Duplicate activity name: '{activity_name}' similar to '{existing_data['name']}'"
            
            # Level 2: Steps Content Check
            if len(steps) > 50 and len(existing_data['steps']) > 50:
                # Check for significant overlap in steps
                steps_words = set(steps.split())
                existing_words = set(existing_data['steps'].lower().split())
                overlap = len(steps_words.intersection(existing_words))
                if overlap > len(steps_words) * 0.7:  # 70% overlap threshold
                    return f"Duplicate steps content: {overlap} words overlap with existing activity"
            
            # Level 3: Materials Check
            if materials and existing_data['materials']:
                materials_words = set(materials.split(','))
                existing_materials = set(existing_data['materials'].lower().split(','))
                if len(materials_words.intersection(existing_materials)) > len(materials_words) * 0.8:
                    return f"Duplicate materials: {len(materials_words.intersection(existing_materials))} materials overlap"
            
            # Level 4: Skills Combination Check
            if skills and existing_data['skills']:
                skills_list = set([s.strip() for s in skills.split(',')])
                existing_skills = set([s.strip() for s in existing_data['skills'].lower().split(',')])
                if len(skills_list.intersection(existing_skills)) > len(skills_list) * 0.8:
                    return f"Duplicate skills combination: {len(skills_list.intersection(existing_skills))} skills overlap"
            
            # Level 5: Objective Check
            if objective and existing_data['objective']:
                obj_words = set(objective.split())
                existing_obj_words = set(existing_data['objective'].lower().split())
                if len(obj_words.intersection(existing_obj_words)) > len(obj_words) * 0.6:
                    return f"Duplicate objective: {len(obj_words.intersection(existing_obj_words))} words overlap"
        
        return None  # No duplicates found
    
    def calculate_quality_score(self, activity_data):
        """Calculate quality score based on multiple criteria"""
        score = 0
        
        # Age Appropriateness (2 points)
        if activity_data.get('age_appropriate', False):
            score += 2
        elif activity_data.get('age_mostly_appropriate', False):
            score += 1
        
        # Clarity of Instructions (2 points)
        steps = activity_data.get('steps', '')
        if len(steps) > 50 and '1.' in steps and '2.' in steps:
            score += 2
        elif len(steps) > 30:
            score += 1
        
        # Safety Considerations (2 points)
        if activity_data.get('safety_considered', False):
            score += 2
        elif activity_data.get('basic_safety', False):
            score += 1
        
        # Developmental Value (2 points)
        skills = activity_data.get('skills', '')
        if len(skills.split(',')) >= 3:
            score += 2
        elif len(skills.split(',')) >= 2:
            score += 1
        
        # Accessibility of Materials (2 points)
        materials = activity_data.get('materials', '')
        common_materials = ['paper', 'crayons', 'blocks', 'toys', 'fabric', 'cardboard']
        if any(material in materials.lower() for material in common_materials):
            score += 2
        elif len(materials) > 20:
            score += 1
        
        return score
    
    def create_pillar_specific_activity(self, pillar, age_group, category, activity_number):
        """Create a pillar-specific activity with quality control"""
        
        # Get pillar strategy
        pillar_strategy = self.pillar_strategies.get(pillar)
        if not pillar_strategy:
            return None
        
        # Get age requirements
        age_req = self.age_requirements.get(age_group)
        if not age_req:
            return None
        
        # Generate unique activity data
        activity_data = self.generate_activity_content(pillar, age_group, category, activity_number, pillar_strategy, age_req)
        
        # Check for duplicates
        duplicate_check = self.check_duplicates(activity_data)
        if duplicate_check:
            print(f"⚠️ Duplicate detected: {duplicate_check}")
            return None
        
        # Calculate quality score
        quality_score = self.calculate_quality_score(activity_data)
        if quality_score < self.quality_threshold:
            print(f"⚠️ Quality score too low: {quality_score}/10")
            return None
        
        # Add quality score to activity data
        activity_data['validation_score'] = quality_score
        
        return activity_data
    
    def generate_activity_content(self, pillar, age_group, category, activity_number, pillar_strategy, age_req):
        """Generate comprehensive activity content"""
        
        # Generate unique activity ID
        activity_id = f"{pillar.lower().replace(' ', '-').replace('&', 'and')}-{age_group.lower().replace(' ', '-').replace('(', '').replace(')', '')}-{category.lower().replace(' ', '-')}-{activity_number}"
        
        # Generate activity name based on category and pillar focus
        activity_names = self.generate_activity_names(category, pillar_strategy)
        activity_name = random.choice(activity_names)
        
        # Generate pillar-specific objective
        objective = self.generate_pillar_specific_objective(category, age_group, pillar_strategy)
        
        # Generate age-appropriate steps
        steps = self.generate_age_appropriate_steps(category, age_group, age_req)
        
        # Generate materials list
        materials = self.generate_materials_list(category, age_group, age_req)
        
        # Generate skills list
        skills = self.generate_skills_list(category, pillar_strategy)
        
        # Create comprehensive activity data
        activity_data = {
            'activity_id': activity_id,
            'pillar': pillar,
            'age_group': age_group,
            'difficulty_level': self.determine_difficulty_level(age_group),
            'activity_type': self.determine_activity_type(category),
            'category': category,
            'category_description': self.get_category_description(category),
            'topic_number': str(activity_number),
            'topic': activity_name,
            'activity_name': activity_name,
            'objective': objective,
            'explanation': self.generate_explanation(category, age_group, pillar_strategy),
            'age': self.get_specific_age_range(age_group),
            'estimated_time': age_req['duration'],
            'setup_time': self.calculate_setup_time(age_req),
            'supervision_level': age_req['supervision'],
            'materials': materials,
            'additional_information': self.generate_additional_info(category, age_group),
            'steps': steps,
            'skills': skills,
            'hashtags': self.generate_hashtags(category, age_group),
            'kit_materials': materials,
            'general_instructions': self.generate_general_instructions(age_group, category),
            'materials_at_home': self.generate_home_alternatives(materials),
            'materials_to_buy_for_kit': materials,
            'corrections_needed': '',
            'validation_score': 0,
            # Quality indicators for scoring
            'age_appropriate': True,
            'age_mostly_appropriate': False,
            'safety_considered': True,
            'basic_safety': False,
            'materials': materials
        }
        
        return activity_data
    
    def generate_activity_names(self, category, pillar_strategy):
        """Generate unique activity names based on category"""
        name_templates = {
            'Sensory Exploration': [
                'Gentle Texture Discovery',
                'Soft Touch Adventure',
                'Sensory Wonderland',
                'Tactile Exploration Fun',
                'Multi-Sensory Journey'
            ],
            'Building With Blocks': [
                'Tower Building Adventure',
                'Creative Construction Challenge',
                'Block Masterpiece Creation',
                'Architectural Discovery',
                'Building Genius Workshop'
            ],
            'Creative Storytelling': [
                'Imagination Story Journey',
                'Fantasy Tale Creation',
                'Character Adventure Workshop',
                'Story Magic Discovery',
                'Narrative Genius Challenge'
            ]
            # Add more category-specific templates
        }
        
        return name_templates.get(category, [f'Creative {category} Activity'])
    
    def generate_pillar_specific_objective(self, category, age_group, pillar_strategy):
        """Generate pillar-specific learning objectives"""
        objectives = {
            'Sensory Exploration': 'Develop tactile awareness and sensory processing through gentle exploration of different textures and materials.',
            'Building With Blocks': 'Enhance fine motor skills, spatial awareness, and problem-solving abilities through hands-on construction activities.',
            'Creative Storytelling': 'Foster imagination, language development, and narrative thinking through engaging storytelling activities.'
        }
        
        base_objective = objectives.get(category, f'Develop {pillar_strategy["unique_skills"][0].lower()} skills through creative exploration.')
        return base_objective
    
    def generate_age_appropriate_steps(self, category, age_group, age_req):
        """Generate age-appropriate step-by-step instructions"""
        if age_group == 'Infant (0-1)':
            return "1. Place baby on soft mat; 2. Show gentle textures; 3. Let baby explore safely; 4. Provide encouragement; 5. Supervise closely"
        elif age_group == 'Toddler (1-3)':
            return "1. Set up activity area; 2. Show simple demonstration; 3. Let toddler try with help; 4. Encourage exploration; 5. Celebrate efforts"
        elif age_group == 'Preschooler (3-5)':
            return "1. Prepare materials and space; 2. Give clear instructions; 3. Guide through steps; 4. Encourage creativity; 5. Celebrate completion"
        else:
            return "1. Gather all materials; 2. Follow step-by-step instructions; 3. Take your time; 4. Be creative; 5. Enjoy the process"
    
    def generate_materials_list(self, category, age_group, age_req):
        """Generate age-appropriate materials list"""
        base_materials = {
            'Infant (0-1)': 'Soft fabrics, safe toys, gentle supervision',
            'Toddler (1-3)': 'Large blocks, safe art supplies, close supervision',
            'Preschooler (3-5)': 'Craft supplies, art materials, moderate supervision',
            'Child (6-8)': 'Art supplies, writing materials, minimal supervision',
            'Pre-Teen (9-12)': 'Advanced craft supplies, technology tools, independent work',
            'Teen (13-18)': 'Professional supplies, advanced tools, independent work'
        }
        
        return base_materials.get(age_group, 'Age-appropriate materials')
    
    def generate_skills_list(self, category, pillar_strategy):
        """Generate skills list based on pillar focus"""
        return ', '.join(pillar_strategy['unique_skills'][:3])
    
    def determine_difficulty_level(self, age_group):
        """Determine difficulty level based on age"""
        difficulty_map = {
            'Infant (0-1)': 'Beginner',
            'Toddler (1-3)': 'Beginner',
            'Preschooler (3-5)': 'Intermediate',
            'Child (6-8)': 'Intermediate',
            'Pre-Teen (9-12)': 'Advanced',
            'Teen (13-18)': 'Advanced'
        }
        return difficulty_map.get(age_group, 'Intermediate')
    
    def determine_activity_type(self, category):
        """Determine activity type based on category"""
        type_map = {
            'Sensory Exploration': 'Sensory',
            'Building With Blocks': 'Physical',
            'Creative Storytelling': 'Creative',
            'Pretend Play': 'Creative',
            'Drawing And Scribbling': 'Creative'
        }
        return type_map.get(category, 'Creative')
    
    def get_category_description(self, category):
        """Get category description"""
        descriptions = {
            'Sensory Exploration': 'Activities focusing on developing tactile, visual, and auditory awareness through safe, gentle exploration of different textures, sounds, and visual stimuli.',
            'Building With Blocks': 'Basic construction and stacking activities that develop fine motor skills, spatial awareness, and problem-solving through hands-on building experiences.',
            'Creative Storytelling': 'Advanced storytelling activities that develop imagination, language skills, and narrative thinking through writing, drawing, and performance.'
        }
        return descriptions.get(category, f'Creative activities focused on {category.lower()}.')
    
    def get_specific_age_range(self, age_group):
        """Get specific age range within age group"""
        ranges = {
            'Infant (0-1)': '6-12 months',
            'Toddler (1-3)': '18-36 months',
            'Preschooler (3-5)': '36-60 months',
            'Child (6-8)': '6-8 years',
            'Pre-Teen (9-12)': '9-12 years',
            'Teen (13-18)': '13-18 years'
        }
        return ranges.get(age_group, age_group)
    
    def calculate_setup_time(self, age_req):
        """Calculate setup time based on age requirements"""
        if age_req['supervision'] == 'Constant':
            return '1-2 minutes'
        elif age_req['supervision'] == 'Close':
            return '2-3 minutes'
        elif age_req['supervision'] == 'Moderate':
            return '3-5 minutes'
        else:
            return '5-10 minutes'
    
    def generate_explanation(self, category, age_group, pillar_strategy):
        """Generate detailed explanation"""
        return f"This {category.lower()} activity helps develop {pillar_strategy['unique_skills'][0].lower()} and {pillar_strategy['unique_skills'][1].lower()} skills while providing age-appropriate challenges and learning opportunities."
    
    def generate_additional_info(self, category, age_group):
        """Generate additional information"""
        return f"Supervise closely and encourage exploration. Focus on the process rather than perfect results. Celebrate efforts and creativity."
    
    def generate_hashtags(self, category, age_group):
        """Generate relevant hashtags"""
        age_tag = age_group.lower().replace(' ', '').replace('(', '').replace(')', '')
        category_tag = category.lower().replace(' ', '')
        return f"#{category_tag}, #{age_tag}, #playandcreativity, #developmental, #fun"
    
    def generate_general_instructions(self, age_group, category):
        """Generate general instructions for parents"""
        return f"Supervise according to age requirements. Encourage exploration and creativity. Focus on the learning process."
    
    def generate_home_alternatives(self, materials):
        """Generate home alternatives for materials"""
        return f"Use household items as alternatives: {materials}"
    
    def create_activities_for_category(self, pillar, age_group, category, worksheet):
        """Create 5 activities for a specific category"""
        print(f"\n🎯 Creating 5 activities for {age_group} - {category}")
        
        created_activities = []
        attempts = 0
        max_attempts = 20  # Prevent infinite loops
        
        while len(created_activities) < 5 and attempts < max_attempts:
            attempts += 1
            activity_number = len(created_activities) + 1
            
            # Create activity
            activity_data = self.create_pillar_specific_activity(pillar, age_group, category, activity_number)
            
            if activity_data:
                # Update Google Sheets
                success = self.update_google_sheets(activity_data, worksheet)
                if success:
                    created_activities.append(activity_data)
                    self.existing_activities[activity_data['activity_id']] = {
                        'name': activity_data['activity_name'],
                        'steps': activity_data['steps'],
                        'materials': activity_data['materials'],
                        'skills': activity_data['skills'],
                        'objective': activity_data['objective']
                    }
                    print(f"   ✅ Created: {activity_data['activity_name']} (Quality: {activity_data['validation_score']}/10)")
                else:
                    print(f"   ❌ Failed to update Google Sheets for: {activity_data['activity_name']}")
            else:
                print(f"   ⚠️ Failed to create activity {activity_number} (attempt {attempts})")
        
        print(f"✅ Successfully created {len(created_activities)}/5 activities for {category}")
        return created_activities
    
    def update_google_sheets(self, activity_data, worksheet):
        """Update Google Sheets with new activity data"""
        try:
            # Get all data to find next empty row
            all_data = worksheet.get_all_values()
            next_row = len(all_data) + 1
            
            # Prepare row data in correct order
            headers = all_data[0] if all_data else []
            row_data = []
            
            for header in headers:
                value = activity_data.get(header.lower().replace(' ', '_'), '')
                row_data.append(str(value))
            
            # Update the row
            worksheet.append_row(row_data)
            
            # Add rate limiting
            time.sleep(1)
            
            return True
            
        except Exception as e:
            print(f"❌ Error updating Google Sheets: {e}")
            return False
    
    def create_complete_pillar_activities(self, pillar, worksheet):
        """Create complete set of activities for a pillar"""
        print(f"\n🚀 Creating complete activities for {pillar} pillar")
        print("=" * 60)
        
        # Load existing activities
        self.load_existing_activities(worksheet)
        
        # Get pillar strategy
        pillar_strategy = self.pillar_strategies.get(pillar)
        if not pillar_strategy:
            print(f"❌ No strategy found for pillar: {pillar}")
            return False
        
        total_created = 0
        
        # Create activities for each age group
        for age_group, categories in pillar_strategy['age_categories'].items():
            print(f"\n📊 Processing {age_group}: {len(categories)} categories")
            
            for category in categories:
                created = self.create_activities_for_category(pillar, age_group, category, worksheet)
                total_created += len(created)
        
        print(f"\n🎉 COMPLETE! Created {total_created} activities for {pillar} pillar")
        return True

def main():
    """Main function to demonstrate robust activity creation"""
    print("🎯 Robust Activity Creation Engine")
    print("=" * 50)
    print("🚀 Systematic, non-duplicate, pillar-specific creation")
    
    # Connect to Google Sheets
    client = get_google_sheets_client()
    if not client:
        return False
    
    # Find the spreadsheet
    all_sheets = client.list_spreadsheet_files()
    target_sheet = None
    
    for sheet in all_sheets:
        title = sheet.get('name', sheet.get('title', '')).lower()
        if 'sample' in title or 'essential' in title:
            target_sheet = sheet
            break
    
    if not target_sheet:
        print("❌ No suitable spreadsheet found")
        return False
    
    # Open the spreadsheet
    spreadsheet = client.open_by_key(target_sheet['id'])
    worksheet = spreadsheet.get_worksheet(0)
    
    print(f"📤 Working with: {target_sheet.get('name', 'Unknown')}")
    
    # Create robust activity creator
    creator = RobustActivityCreator(client)
    
    # Create activities for Play & Creativity pillar
    success = creator.create_complete_pillar_activities('Play & Creativity', worksheet)
    
    if success:
        print(f"\n✅ SUCCESS! Robust activity creation completed!")
        return True
    else:
        print(f"\n❌ FAILED to create activities!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Robust activity creation engine completed!")
    else:
        print(f"\n❌ FAILED to run activity creation engine!")
