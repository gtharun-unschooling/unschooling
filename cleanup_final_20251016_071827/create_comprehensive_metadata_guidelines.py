#!/usr/bin/env python3
"""
📋 Create Comprehensive Metadata Guidelines for Activity Creation
Update category descriptions and create detailed metadata standards for all columns
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

def update_category_descriptions_and_metadata(client):
    """Update category descriptions and create comprehensive metadata guidelines"""
    
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
        category_col_index = headers.index('Category') if 'Category' in headers else None
        category_desc_col_index = headers.index('Category Description') if 'Category Description' in headers else None
        additional_info_col_index = headers.index('Additional Information') if 'Additional Information' in headers else None
        
        print(f"📊 Updating category descriptions and metadata guidelines...")
        
        # Define comprehensive category descriptions for Play & Creativity
        category_descriptions = {
            # Infant categories
            'Sensory Exploration': 'Activities focusing on developing tactile, visual, and auditory awareness through safe, gentle exploration of different textures, sounds, and visual stimuli appropriate for 0-1 year olds.',
            
            'Tummy Time Play': 'Gentle tummy time activities that help develop neck strength, visual tracking, and early motor skills while providing safe, supervised play experiences for infants.',
            
            'Interactive Sounds And Textures': 'Simple cause-and-effect activities using safe, soft materials that respond to infant touch or movement, helping develop basic understanding of cause and effect.',
            
            'Parent Child Bonding Activities': 'Calm, nurturing activities that strengthen the parent-child bond through gentle interaction, eye contact, and responsive communication.',
            
            # Toddler categories
            'Pretend Play': 'Simple imaginative play activities that encourage creativity, social skills, and language development through role-playing and make-believe scenarios.',
            
            'Building With Blocks': 'Basic construction and stacking activities that develop fine motor skills, spatial awareness, and problem-solving through hands-on building experiences.',
            
            'Drawing And Scribbling': 'Early art activities using large, safe materials that encourage creativity, fine motor development, and self-expression through drawing and mark-making.',
            
            'Exploring Musical Instruments': 'Introduction to music through simple instruments, rhythm, and sound exploration that develops auditory skills and coordination.',
            
            # Preschooler categories
            'Imaginative Play With Dolls': 'Complex pretend play using dolls and figures to develop empathy, social skills, storytelling, and emotional understanding.',
            
            'Simple Crafting': 'Basic art and craft projects that develop creativity, fine motor skills, and following instructions while creating tangible objects.',
            
            'Role Playing Games': 'Structured pretend play activities that teach social skills, problem-solving, and cooperation through themed role-playing scenarios.',
            
            'Shape Sorting And Color Matching': 'Cognitive activities that develop pattern recognition, categorization, and early math concepts through sorting and matching games.',
            
            # Child categories
            'Creative Storytelling': 'Advanced storytelling activities that develop imagination, language skills, and narrative thinking through writing, drawing, and performance.',
            
            'Advanced Drawing And Painting': 'Sophisticated art activities that develop technical skills, creativity, and artistic expression through various drawing and painting techniques.',
            
            'Diy Craft Projects': 'Complex crafting projects that develop planning skills, creativity, and problem-solving through multi-step construction and design challenges.',
            
            'Inventing Games': 'Creative game design activities that develop innovation, rule-making, and social interaction through creating and playing original games.',
            
            # Pre-Teen categories
            'Design Thinking For Toys': 'Innovation-focused activities that develop critical thinking, problem-solving, and design skills through creating and improving toys.',
            
            'Stop Motion Animation Projects': 'Technology-integrated creative projects that develop planning, patience, and technical skills through creating animated stories.',
            
            'Music Composition And Recording': 'Advanced music activities that develop creativity, technical skills, and self-expression through composing and recording original music.',
            
            'Sculpting And 3D Modeling': 'Three-dimensional art projects that develop spatial thinking, creativity, and technical skills through sculpting and modeling materials.',
            
            # Teen categories
            'Artistic Performance And Design': 'Professional-level creative activities that develop advanced artistic skills, performance abilities, and creative expression.',
            
            'Creating Digital Art': 'Technology-based art activities that develop digital literacy, creativity, and modern artistic skills using digital tools and platforms.',
            
            'Building And Designing Gadgets': 'Engineering-focused creative projects that develop problem-solving, innovation, and technical skills through designing and building functional objects.',
            
            'Independent Fashion Design': 'Advanced design activities that develop creativity, technical skills, and self-expression through creating and styling fashion items.'
        }
        
        # Define comprehensive metadata guidelines for each column
        metadata_guidelines = {
            'Activity ID': 'Format: pillar-age-group-category-number (e.g., play-creativity-infant-0-1-sensory-exploration-1). Must be unique, descriptive, and follow consistent naming convention.',
            
            'Pillar': 'Must be exactly "Play & Creativity" for this pillar. Use consistent capitalization and spelling.',
            
            'Age Group': 'Must match developmental capabilities: "Infant (0-1)", "Toddler (1-3)", "Preschooler (3-5)", "Child (6-8)", "Pre-Teen (9-12)", "Teen (13-18)". Verify activities match age abilities.',
            
            'Difficulty Level': 'Use: "Beginner", "Intermediate", "Advanced". Match to age group capabilities - infants should be mostly beginner, teens can handle advanced.',
            
            'Activity Type': 'Choose from: "Creative", "Physical", "Social", "Sensory", "Cognitive", "Language", "Memory", "Problem Solving". Must match category purpose.',
            
            'Category': 'Must exactly match one of the 24 defined categories. Use proper capitalization and spelling as defined in the system.',
            
            'Category Description': 'Detailed explanation of what this category focuses on, developmental benefits, and appropriate activities for the age group.',
            
            'Topic Number': 'Sequential number within category (1, 2, 3, etc.). Keep consistent numbering within each category.',
            
            'Topic': 'Brief, descriptive title of the specific activity topic. Should be engaging and age-appropriate.',
            
            'Activity Name': 'Clear, descriptive name that explains what the child will do. Use action words and be specific about the activity.',
            
            'Objective': 'Clear learning goal in 1-2 sentences. State what developmental skill or knowledge the activity targets.',
            
            'Explanation': 'Detailed explanation of why this activity is beneficial, what skills it develops, and how it fits into child development.',
            
            'Age': 'Specific age range within the age group (e.g., "6-8 months" for infant activities). Be precise about developmental appropriateness.',
            
            'Estimated Time': 'Realistic time estimate in minutes. Consider attention spans: infants 2-5 min, toddlers 5-15 min, preschoolers 15-30 min, etc.',
            
            'Setup Time': 'Time needed to prepare materials and environment. Include all preparation steps.',
            
            'Supervision Level': 'Required supervision: "Constant" (infants), "Close" (toddlers), "Moderate" (preschoolers), "Minimal" (older children).',
            
            'Materials': 'List all required materials in simple format: "Item 1, Item 2, Item 3". Use common, accessible materials when possible.',
            
            'Additional Information': 'Any special considerations, safety notes, variations, or additional context for the activity.',
            
            'Steps': 'Numbered, clear instructions. Use simple language appropriate for the age group. Include safety considerations.',
            
            'Skills': 'Comma-separated list of skills developed: "Fine Motor, Creativity, Problem Solving". Be specific and comprehensive.',
            
            'Hashtags': 'Relevant tags for categorization: "#sensory, #creativity, #infant". Use consistent hashtag format.',
            
            'Kit Materials': 'Materials that would be included in an activity kit. List specific items that parents could purchase or gather.',
            
            'General Instructions': 'Overall guidance for parents/caregivers on how to facilitate the activity successfully.',
            
            'Materials at Home': 'Common household items that can be used as alternatives or supplements to the main materials.',
            
            'Materials to Buy for Kit': 'Specific items to purchase for a complete activity kit, with suggestions for where to find them.',
            
            'Corrections Needed': 'Any identified issues or improvements needed for the activity. Leave blank for completed activities.',
            
            'Validation Score': 'Quality score from 1-10 based on: age appropriateness, clarity, safety, developmental value, accessibility of materials.'
        }
        
        # Update category descriptions
        print(f"\n📝 UPDATING CATEGORY DESCRIPTIONS:")
        print("=" * 50)
        
        # Get unique categories from the data
        unique_categories = set()
        for row in all_data[1:]:
            if len(row) > category_col_index and row[category_col_index].strip():
                unique_categories.add(row[category_col_index].strip())
        
        category_updates_made = 0
        
        for category in sorted(unique_categories):
            if category in category_descriptions:
                # Find first row with this category to update description
                for row_num, row in enumerate(all_data[1:], start=2):
                    if (len(row) > max(category_col_index, category_desc_col_index) and 
                        row[category_col_index].strip() == category):
                        
                        current_desc = row[category_desc_col_index].strip()
                        new_desc = category_descriptions[category]
                        
                        if current_desc != new_desc:
                            worksheet.update_cell(row_num, category_desc_col_index + 1, new_desc)
                            print(f"   ✅ Updated: {category}")
                            category_updates_made += 1
                        break
        
        print(f"✅ Updated {category_updates_made} category descriptions")
        
        # Create metadata guidelines document
        print(f"\n📋 CREATING METADATA GUIDELINES:")
        print("=" * 40)
        
        # Update Additional Information column with guidelines
        guidelines_text = "METADATA GUIDELINES FOR ACTIVITY CREATION:\n\n"
        
        for column, guidelines in metadata_guidelines.items():
            guidelines_text += f"{column}: {guidelines}\n\n"
        
        # Add age-specific guidelines
        guidelines_text += "AGE-SPECIFIC REQUIREMENTS:\n\n"
        guidelines_text += "INFANT (0-1): Activities must be sensory-focused, safe for mouth exploration, require constant supervision, and last 2-5 minutes.\n\n"
        guidelines_text += "TODDLER (1-3): Activities should encourage exploration, basic problem-solving, and simple cause-and-effect. Duration: 5-15 minutes.\n\n"
        guidelines_text += "PRESCHOOLER (3-5): Activities can include basic crafts, pretend play, and simple rules. Duration: 15-30 minutes.\n\n"
        guidelines_text += "CHILD (6-8): Activities can involve writing, detailed crafts, and multi-step projects. Duration: 30-45 minutes.\n\n"
        guidelines_text += "PRE-TEEN (9-12): Activities can include complex projects, design thinking, and technology integration. Duration: 45-60 minutes.\n\n"
        guidelines_text += "TEEN (13-18): Activities can be sophisticated, professional-level projects with advanced skills. Duration: 60+ minutes.\n\n"
        
        guidelines_text += "SAFETY REQUIREMENTS:\n"
        guidelines_text += "- All activities must be age-appropriate and safe\n"
        guidelines_text += "- Include supervision level requirements\n"
        guidelines_text += "- List any safety considerations\n"
        guidelines_text += "- Use non-toxic, safe materials\n"
        guidelines_text += "- Consider choking hazards for young children\n\n"
        
        guidelines_text += "QUALITY STANDARDS:\n"
        guidelines_text += "- Activities must have clear learning objectives\n"
        guidelines_text += "- Steps must be numbered and easy to follow\n"
        guidelines_text += "- Materials should be accessible and affordable\n"
        guidelines_text += "- Activities should be engaging and fun\n"
        guidelines_text += "- Include skill development clearly\n"
        guidelines_text += "- Validate developmental appropriateness\n\n"
        
        # Update a sample row with guidelines (first row with data)
        for row_num, row in enumerate(all_data[1:], start=2):
            if len(row) > additional_info_col_index:
                worksheet.update_cell(row_num, additional_info_col_index + 1, guidelines_text)
                print(f"   ✅ Added comprehensive metadata guidelines to row {row_num}")
                break
        
        print(f"\n🎉 METADATA GUIDELINES CREATION COMPLETE!")
        print("=" * 50)
        print(f"✅ Updated {category_updates_made} category descriptions")
        print(f"✅ Created comprehensive metadata guidelines")
        print(f"✅ Added age-specific requirements")
        print(f"✅ Included safety and quality standards")
        print(f"✅ Guidelines ready for creating thousands more activities")
        
        return True
        
    except Exception as e:
        print(f"❌ Error updating metadata guidelines: {e}")
        return False

def main():
    """Main function to create comprehensive metadata guidelines"""
    print("📋 Creating Comprehensive Metadata Guidelines for Activity Creation")
    print("=" * 80)
    print("🎯 Updating category descriptions and creating standards for all columns")
    
    # Connect to Google Sheets
    client = get_google_sheets_client()
    if not client:
        return False
    
    # Update metadata guidelines
    success = update_category_descriptions_and_metadata(client)
    
    if success:
        print(f"\n✅ SUCCESS! Metadata guidelines created!")
        print("=" * 40)
        print("✅ Category descriptions updated")
        print("✅ Comprehensive column guidelines created")
        print("✅ Age-specific requirements defined")
        print("✅ Safety and quality standards established")
        print("✅ Ready for scaling to thousands of activities")
        
        return True
    else:
        print(f"\n❌ FAILED to create metadata guidelines!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Comprehensive metadata guidelines completed!")
    else:
        print(f"\n❌ FAILED to create metadata guidelines!")
