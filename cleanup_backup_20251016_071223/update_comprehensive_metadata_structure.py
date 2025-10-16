#!/usr/bin/env python3
"""
📋 Update Comprehensive Metadata Structure in Google Sheets
Update category descriptions, pillar-specific focus, and systematic structure
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

def update_metadata_structure(client):
    """Update comprehensive metadata structure in Google Sheets"""
    
    try:
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
        
        # Get all data
        all_data = worksheet.get_all_values()
        if not all_data:
            print("❌ No data found")
            return False
        
        headers = all_data[0]
        
        # Find column indices
        pillar_col_index = headers.index('Pillar') if 'Pillar' in headers else None
        age_group_col_index = headers.index('Age Group') if 'Age Group' in headers else None
        category_col_index = headers.index('Category') if 'Category' in headers else None
        category_desc_col_index = headers.index('Category Description') if 'Category Description' in headers else None
        topic_number_col_index = headers.index('Topic Number') if 'Topic Number' in headers else None
        topic_col_index = headers.index('Topic') if 'Topic' in headers else None
        additional_info_col_index = headers.index('Additional Information') if 'Additional Information' in headers else None
        
        print(f"📊 Updating comprehensive metadata structure...")
        
        # Define comprehensive pillar-specific category structure
        pillar_category_structure = {
            'Play & Creativity': {
                'Infant (0-1)': {
                    'categories': [
                        'Sensory Exploration And Discovery',
                        'Tummy Time And Motor Development', 
                        'Interactive Sounds And Musical Play',
                        'Parent Child Bonding And Connection'
                    ],
                    'descriptions': {
                        'Sensory Exploration And Discovery': 'Comprehensive sensory development activities that introduce infants to different textures, temperatures, and tactile experiences through safe, supervised exploration of age-appropriate materials and objects.',
                        'Tummy Time And Motor Development': 'Structured tummy time activities that strengthen neck muscles, develop visual tracking skills, and promote early motor coordination through engaging, supervised play experiences.',
                        'Interactive Sounds And Musical Play': 'Early musical and auditory development activities that introduce infants to different sounds, rhythms, and musical instruments through gentle, interactive play experiences.',
                        'Parent Child Bonding And Connection': 'Nurturing relationship-building activities that strengthen the parent-child bond through gentle interaction, eye contact, responsive communication, and emotional connection.'
                    }
                },
                'Toddler (1-3)': {
                    'categories': [
                        'Pretend Play And Imagination',
                        'Building And Construction Play',
                        'Creative Art And Expression',
                        'Musical Exploration And Rhythm'
                    ],
                    'descriptions': {
                        'Pretend Play And Imagination': 'Imaginative play activities that develop creativity, social skills, and language through role-playing, make-believe scenarios, and storytelling experiences.',
                        'Building And Construction Play': 'Hands-on construction activities that develop fine motor skills, spatial awareness, and problem-solving through building with blocks, stacking, and creative construction.',
                        'Creative Art And Expression': 'Early art activities that encourage self-expression, creativity, and fine motor development through safe drawing, painting, and artistic exploration.',
                        'Musical Exploration And Rhythm': 'Musical development activities that introduce rhythm, melody, and sound exploration through simple instruments, singing, and musical play.'
                    }
                },
                'Preschooler (3-5)': {
                    'categories': [
                        'Imaginative Play With Characters',
                        'Arts And Crafts Projects',
                        'Role Playing And Social Games',
                        'Cognitive Sorting And Matching'
                    ],
                    'descriptions': {
                        'Imaginative Play With Characters': 'Complex pretend play using dolls, figures, and characters to develop empathy, storytelling skills, and emotional understanding through creative scenarios.',
                        'Arts And Crafts Projects': 'Structured art and craft activities that develop creativity, fine motor skills, and following instructions while creating tangible, meaningful objects.',
                        'Role Playing And Social Games': 'Social skill development through structured pretend play that teaches cooperation, communication, and problem-solving through themed role-playing scenarios.',
                        'Cognitive Sorting And Matching': 'Cognitive development activities that enhance pattern recognition, categorization skills, and early mathematical concepts through sorting and matching games.'
                    }
                },
                'Child (6-8)': {
                    'categories': [
                        'Creative Storytelling And Writing',
                        'Advanced Art And Design',
                        'DIY Craft And Construction',
                        'Game Creation And Innovation'
                    ],
                    'descriptions': {
                        'Creative Storytelling And Writing': 'Advanced storytelling activities that develop imagination, language skills, and narrative thinking through creative writing, drawing, and performance.',
                        'Advanced Art And Design': 'Sophisticated art activities that develop technical skills, creativity, and artistic expression through various drawing, painting, and design techniques.',
                        'DIY Craft And Construction': 'Complex crafting projects that develop planning skills, creativity, and problem-solving through multi-step construction and design challenges.',
                        'Game Creation And Innovation': 'Creative game design activities that develop innovation, rule-making skills, and social interaction through creating and playing original games.'
                    }
                },
                'Pre-Teen (9-12)': {
                    'categories': [
                        'Design Thinking And Innovation',
                        'Animation And Digital Media',
                        'Music Composition And Recording',
                        '3D Modeling And Sculpting'
                    ],
                    'descriptions': {
                        'Design Thinking And Innovation': 'Innovation-focused activities that develop critical thinking, problem-solving, and design skills through creating, improving, and redesigning toys and products.',
                        'Animation And Digital Media': 'Technology-integrated creative projects that develop planning, patience, and technical skills through creating animated stories and digital media.',
                        'Music Composition And Recording': 'Advanced music activities that develop creativity, technical skills, and self-expression through composing, arranging, and recording original music.',
                        '3D Modeling And Sculpting': 'Three-dimensional art projects that develop spatial thinking, creativity, and technical skills through sculpting, modeling, and construction with various materials.'
                    }
                },
                'Teen (13-18)': {
                    'categories': [
                        'Artistic Performance And Design',
                        'Digital Art And Technology',
                        'Engineering And Gadget Creation',
                        'Fashion Design And Styling'
                    ],
                    'descriptions': {
                        'Artistic Performance And Design': 'Professional-level creative activities that develop advanced artistic skills, performance abilities, and creative expression through sophisticated projects.',
                        'Digital Art And Technology': 'Technology-based art activities that develop digital literacy, creativity, and modern artistic skills using digital tools, software, and platforms.',
                        'Engineering And Gadget Creation': 'Engineering-focused creative projects that develop problem-solving, innovation, and technical skills through designing and building functional objects and gadgets.',
                        'Fashion Design And Styling': 'Advanced design activities that develop creativity, technical skills, and self-expression through creating, designing, and styling fashion items and accessories.'
                    }
                }
            }
        }
        
        # Define systematic topic structure (5 topics per category)
        topic_structure = {
            'Sensory Exploration And Discovery': [
                'Texture Treasure Hunt',
                'Gentle Touch And Feel',
                'Temperature Discovery',
                'Sensory Bottle Exploration',
                'Multi-Sensory Play'
            ],
            'Tummy Time And Motor Development': [
                'Gentle Tummy Time Play',
                'Visual Tracking Fun',
                'Reaching And Grasping',
                'Rolling And Movement',
                'Interactive Tummy Time'
            ],
            'Interactive Sounds And Musical Play': [
                'Musical Rattle Play',
                'Gentle Singing Time',
                'Sound Discovery',
                'Rhythm And Movement',
                'Musical Bonding'
            ],
            'Parent Child Bonding And Connection': [
                'Eye Contact And Connection',
                'Gentle Massage Time',
                'Lullaby And Cuddles',
                'Responsive Play',
                'Bonding Through Touch'
            ],
            'Pretend Play And Imagination': [
                'Kitchen Role Play',
                'Doll Care And Nurturing',
                'Animal Pretend Play',
                'Superhero Adventures',
                'Family Pretend Play'
            ],
            'Building And Construction Play': [
                'Tower Building Challenge',
                'Bridge Construction',
                'Block Sorting Fun',
                'Creative Building',
                'Construction Team Play'
            ],
            'Creative Art And Expression': [
                'Finger Painting Fun',
                'Crayon Scribbling',
                'Sticker Art Creation',
                'Water Color Play',
                'Mixed Media Art'
            ],
            'Musical Exploration And Rhythm': [
                'Drum And Rhythm Play',
                'Singing And Dancing',
                'Instrument Exploration',
                'Musical Story Time',
                'Rhythm Games'
            ]
            # Add more topic structures as needed
        }
        
        # Update category descriptions and structure
        print(f"\n📝 UPDATING CATEGORY DESCRIPTIONS:")
        print("=" * 50)
        
        updates_made = 0
        
        for row_num, row in enumerate(all_data[1:], start=2):
            if len(row) > max(pillar_col_index, age_group_col_index, category_col_index, category_desc_col_index):
                pillar = row[pillar_col_index].strip()
                age_group = row[age_group_col_index].strip()
                current_category = row[category_col_index].strip()
                
                # Only process Play & Creativity activities
                if pillar == 'Play & Creativity':
                    # Get the new category structure for this age group
                    if age_group in pillar_category_structure['Play & Creativity']:
                        age_structure = pillar_category_structure['Play & Creativity'][age_group]
                        
                        # Check if current category needs updating
                        if current_category in age_structure['descriptions']:
                            new_description = age_structure['descriptions'][current_category]
                            current_description = row[category_desc_col_index].strip()
                            
                            if current_description != new_description:
                                worksheet.update_cell(row_num, category_desc_col_index + 1, new_description)
                                updates_made += 1
                                print(f"   ✅ Updated: {current_category} - {age_group}")
        
        print(f"✅ Updated {updates_made} category descriptions")
        
        # Add comprehensive metadata structure information
        print(f"\n📋 ADDING COMPREHENSIVE METADATA STRUCTURE:")
        print("=" * 50)
        
        metadata_structure_info = """
COMPREHENSIVE METADATA STRUCTURE GUIDELINES:

PILLAR-SPECIFIC FOCUS:
- Each pillar has unique developmental focus and skills
- No duplication of categories across pillars
- Consistent naming conventions within each pillar
- Clear distinction between pillar purposes

SYSTEMATIC STRUCTURE:
- 6 Age Groups: Infant (0-1), Toddler (1-3), Preschooler (3-5), Child (6-8), Pre-Teen (9-12), Teen (13-18)
- 4 Categories per Age Group (24 total categories per pillar)
- 5 Topics per Category (120 total topics per pillar)
- 5 Activities per Topic (600 total activities per pillar)

CATEGORY REQUIREMENTS:
- Descriptive, specific names in proper title case
- No abbreviations or generic terms
- Clearly indicate activity focus and purpose
- Consistent within each pillar
- Age-appropriate complexity and focus
- Unique to the pillar (no cross-pillar duplication)

TOPIC REQUIREMENTS:
- Engaging, descriptive names
- Age-appropriate language and concepts
- Clear indication of specific activity type
- Sequential numbering within each category (1-5)
- Consistent with category focus and purpose

QUALITY STANDARDS:
- All activities must be developmentally appropriate
- Clear learning objectives and outcomes
- Safe materials and supervision requirements
- Accessible and affordable materials
- Engaging and fun for target age group
- Complete metadata for all 30 columns
- Minimum 8/10 quality validation score

PILLAR-SPECIFIC CATEGORIES:

PLAY & CREATIVITY PILLAR:
Infant (0-1): Sensory Exploration And Discovery, Tummy Time And Motor Development, Interactive Sounds And Musical Play, Parent Child Bonding And Connection
Toddler (1-3): Pretend Play And Imagination, Building And Construction Play, Creative Art And Expression, Musical Exploration And Rhythm
Preschooler (3-5): Imaginative Play With Characters, Arts And Crafts Projects, Role Playing And Social Games, Cognitive Sorting And Matching
Child (6-8): Creative Storytelling And Writing, Advanced Art And Design, DIY Craft And Construction, Game Creation And Innovation
Pre-Teen (9-12): Design Thinking And Innovation, Animation And Digital Media, Music Composition And Recording, 3D Modeling And Sculpting
Teen (13-18): Artistic Performance And Design, Digital Art And Technology, Engineering And Gadget Creation, Fashion Design And Styling

IMPLEMENTATION GUIDELINES:
- Follow systematic creation process
- Check for duplicates at all levels
- Validate quality and appropriateness
- Update Google Sheets immediately
- Maintain consistency across all activities
- Ensure pillar-specific focus maintained
"""
        
        # Update Additional Information column with comprehensive guidelines
        for row_num, row in enumerate(all_data[1:], start=2):
            if len(row) > additional_info_col_index:
                worksheet.update_cell(row_num, additional_info_col_index + 1, metadata_structure_info)
                print(f"   ✅ Added comprehensive metadata structure to row {row_num}")
                break
        
        print(f"\n🎉 COMPREHENSIVE METADATA STRUCTURE UPDATE COMPLETE!")
        print("=" * 60)
        print(f"✅ Updated {updates_made} category descriptions")
        print(f"✅ Added comprehensive metadata structure guidelines")
        print(f"✅ Defined pillar-specific category structure")
        print(f"✅ Established systematic topic organization")
        print(f"✅ Created quality standards and implementation guidelines")
        print(f"✅ Ready for systematic activity creation")
        
        return True
        
    except Exception as e:
        print(f"❌ Error updating metadata structure: {e}")
        return False

def main():
    """Main function to update comprehensive metadata structure"""
    print("📋 Updating Comprehensive Metadata Structure in Google Sheets")
    print("=" * 80)
    print("🎯 Updating category descriptions, pillar-specific focus, and systematic structure")
    
    # Connect to Google Sheets
    client = get_google_sheets_client()
    if not client:
        return False
    
    # Update metadata structure
    success = update_metadata_structure(client)
    
    if success:
        print(f"\n✅ SUCCESS! Metadata structure updated!")
        print("=" * 40)
        print("✅ Category descriptions updated with proper title case")
        print("✅ Pillar-specific focus established")
        print("✅ 4 categories per age group structure defined")
        print("✅ 5 topics per category structure established")
        print("✅ Comprehensive guidelines added")
        print("✅ Ready for systematic activity creation")
        
        return True
    else:
        print(f"\n❌ FAILED to update metadata structure!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Comprehensive metadata structure update completed!")
    else:
        print(f"\n❌ FAILED to update metadata structure!")
