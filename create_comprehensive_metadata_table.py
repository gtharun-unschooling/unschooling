#!/usr/bin/env python3
"""
📋 Create Comprehensive Metadata Table
Create detailed column-specific information for activity creation
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

def create_comprehensive_metadata_table(client):
    """Create comprehensive metadata table with detailed column information"""
    
    try:
        # Open the Sample 1 spreadsheet
        spreadsheet = client.open_by_key('14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ')
        
        # Open the Metadata worksheet
        metadata_worksheet = spreadsheet.worksheet('Metadata')
        
        print(f"📤 Working with: Metadata worksheet")
        
        # Clear the worksheet first
        metadata_worksheet.clear()
        print("✅ Cleared metadata worksheet")
        
        # Create comprehensive metadata table
        metadata_table = [
            # Header row
            ['Column Name', 'Purpose', 'Format', 'Requirements', 'Examples', 'Validation Rules', 'Age Considerations', 'Pillar-Specific Notes'],
            
            # Activity ID
            ['Activity ID', 'Unique identifier for each activity', 'pillar-age-group-category-number', 'Must be unique, lowercase with hyphens, sequential numbering', 'play-creativity-infant-0-1-sensory-exploration-1', 'No duplicates, follows naming convention', 'Include age range in ID', 'Different pillars have different prefixes'],
            
            # Pillar
            ['Pillar', 'Identifies the growth pillar this activity belongs to', 'Exact pillar name', 'Must be exactly as defined (Play & Creativity, Cognitive Skills, etc.)', 'Play & Creativity', 'Exact match required', 'Same across all ages', 'Unique focus and skills per pillar'],
            
            # Age Group
            ['Age Group', 'Developmental stage for the activity', 'Age range format', 'Must match exact format: Infant (0-1), Toddler (1-3), etc.', 'Infant (0-1)', 'Must match defined age groups', 'Critical for developmental appropriateness', 'Each pillar has same age groups'],
            
            # Difficulty Level
            ['Difficulty Level', 'Indicates complexity level of the activity', 'Beginner, Intermediate, Advanced', 'Match to age capabilities and activity complexity', 'Beginner', 'Age-appropriate difficulty', 'Infants: mostly Beginner, Teens: mostly Advanced', 'Consistent within pillar categories'],
            
            # Activity Type
            ['Activity Type', 'Primary skill area the activity develops', 'Creative, Physical, Social, Sensory, Cognitive, etc.', 'Must match category purpose and pillar focus', 'Creative', 'Aligns with category goals', 'Age-appropriate skill development', 'Pillar-specific skill focus'],
            
            # Category
            ['Category', 'Specific category within the pillar and age group', 'Descriptive title case name', '4 categories per age group, unique names, pillar-specific', 'Sensory Exploration And Discovery', 'No abbreviations, descriptive names', 'Age-appropriate categories', 'Unique to each pillar'],
            
            # Category Description
            ['Category Description', 'Detailed explanation of what this category focuses on', 'Comprehensive paragraph', 'Explain developmental benefits, appropriate activities, learning objectives', 'Activities focusing on developing tactile, visual, and auditory awareness through safe, gentle exploration', 'Detailed and informative', 'Age-specific capabilities and benefits', 'Pillar-specific developmental focus'],
            
            # Topic Number
            ['Topic Number', 'Sequential number within the category', '1, 2, 3, 4, 5', 'Sequential numbering from 1-5 within each category', '1', 'No gaps in sequence', 'Same across all ages', 'Consistent within pillar structure'],
            
            # Topic
            ['Topic', 'Brief, engaging title of the specific activity topic', 'Descriptive, engaging name', 'Age-appropriate language, clear activity focus', 'Texture Treasure Hunt', 'Engaging and descriptive', 'Age-appropriate concepts', 'Category-specific focus'],
            
            # Activity Name
            ['Activity Name', 'Clear name explaining what the child will do', 'Action-oriented, specific name', 'Use action words, be specific about the activity', 'Gentle Texture Discovery Adventure', 'Clear and engaging', 'Age-appropriate actions', 'Pillar-specific activity types'],
            
            # Objective
            ['Objective', 'Clear learning goal for the activity', '1-2 sentences', 'Specific developmental skill or knowledge targeted', 'Develop fine motor skills and spatial awareness through building towers', 'Measurable outcomes', 'Age-appropriate learning goals', 'Pillar-specific skill development'],
            
            # Explanation
            ['Explanation', 'Detailed explanation of benefits and developmental value', 'Comprehensive paragraph', 'Explain why beneficial, what skills developed, developmental theory', 'This activity helps toddlers develop hand-eye coordination and spatial reasoning', 'Informative for parents', 'Age-specific developmental benefits', 'Pillar-specific developmental focus'],
            
            # Age
            ['Age', 'Specific age range within the age group', 'Specific range format', 'Be precise about developmental appropriateness', '6-12 months', 'Precise age targeting', 'Consider individual variation', 'Age-appropriate complexity'],
            
            # Estimated Time
            ['Estimated Time', 'Realistic time estimate for the activity', 'Time in minutes', 'Match to age attention spans and activity complexity', '10-15 minutes', 'Realistic expectations', 'Infants: 2-5 min, Teens: 60+ min', 'Age-appropriate duration'],
            
            # Setup Time
            ['Setup Time', 'Time needed to prepare materials and environment', 'Time in minutes', 'Include all preparation steps, be realistic', '5 minutes', 'Complete preparation time', 'Consider parent time constraints', 'Accessible setup requirements'],
            
            # Supervision Level
            ['Supervision Level', 'Required supervision for safety and guidance', 'Constant, Close, Moderate, Minimal', 'Match to age safety requirements and activity complexity', 'Close', 'Safety-appropriate supervision', 'Infants: Constant, Teens: Minimal', 'Age-specific safety needs'],
            
            # Materials
            ['Materials', 'All required materials for the activity', 'Comma-separated list', 'Common, accessible materials with quantities', 'Soft fabric squares, smooth wooden blocks, shallow tray', 'Complete material list', 'Age-safe materials', 'Accessible and affordable'],
            
            # Additional Information
            ['Additional Information', 'Special considerations, safety notes, variations', 'Detailed notes', 'Safety considerations, variations, troubleshooting tips', 'Use large blocks to prevent choking, celebrate efforts', 'Comprehensive guidance', 'Age-specific safety notes', 'Pillar-specific considerations'],
            
            # Steps
            ['Steps', 'Numbered, clear instructions for the activity', 'Numbered list format', 'Simple language, sequential, include safety considerations', '1. Place baby on soft mat; 2. Show textures; 3. Let explore safely', 'Clear and actionable', 'Age-appropriate language', 'Pillar-specific activity flow'],
            
            # Skills
            ['Skills', 'Skills developed through this activity', 'Comma-separated list', 'Be specific and comprehensive, include primary and secondary', 'Fine Motor, Spatial Awareness, Problem Solving', 'Comprehensive skill list', 'Age-appropriate skills', 'Pillar-specific skill development'],
            
            # Hashtags
            ['Hashtags', 'Relevant tags for categorization and search', 'Hashtag format', 'Use consistent hashtag format, include keywords', '#sensory, #creativity, #infant', 'Relevant and consistent', 'Age-appropriate tags', 'Pillar-specific categorization'],
            
            # Kit Materials
            ['Kit Materials', 'Materials that would be included in an activity kit', 'Specific item list', 'List specific items that parents could purchase', '6 large wooden blocks, soft play mat, instruction card', 'Kit-ready materials', 'Age-appropriate kit contents', 'Pillar-specific kit focus'],
            
            # General Instructions
            ['General Instructions', 'Overall guidance for parents and caregivers', 'Clear guidance text', 'How to facilitate successfully, engagement tips', 'Supervise closely and encourage exploration, focus on process', 'Parent-friendly guidance', 'Age-specific facilitation', 'Pillar-specific guidance'],
            
            # Materials at Home
            ['Materials at Home', 'Common household alternatives', 'Household item list', 'List accessible alternatives for main materials', 'Large cardboard boxes, plastic containers, soft pillows', 'Accessible alternatives', 'Age-safe home alternatives', 'Universal accessibility'],
            
            # Materials to Buy for Kit
            ['Materials to Buy for Kit', 'Specific purchasing guidance for complete kit', 'Purchasing list with sources', 'Include where to find items, quality suggestions', 'Large wooden blocks from toy store, soft play mat from baby store', 'Complete purchasing guide', 'Age-appropriate purchases', 'Pillar-specific kit focus'],
            
            # Corrections Needed
            ['Corrections Needed', 'Quality control tracking for identified issues', 'Issue description or blank', 'Leave blank for completed activities, note improvements', '', 'Quality tracking', 'Age-appropriateness review', 'Pillar-specific standards'],
            
            # Validation Score
            ['Validation Score', 'Quality score from 1-10 based on multiple criteria', 'Numerical score 1-10', 'Based on age appropriateness, clarity, safety, value, accessibility', '9/10', 'Minimum 8/10 required', 'Age-appropriate validation', 'Pillar-specific quality standards']
        ]
        
        # Add the metadata table to the worksheet
        print(f"\n📝 ADDING COMPREHENSIVE METADATA TABLE:")
        print("=" * 50)
        
        for row in metadata_table:
            metadata_worksheet.append_row(row)
            time.sleep(0.5)  # Rate limiting
        
        print(f"✅ Added {len(metadata_table)} rows of comprehensive metadata")
        print(f"✅ Each row describes one column in detail")
        print(f"✅ Includes purpose, format, requirements, examples, validation")
        print(f"✅ Age considerations and pillar-specific notes included")
        
        print(f"\n🎉 COMPREHENSIVE METADATA TABLE CREATED!")
        print("=" * 50)
        print(f"✅ Complete column-specific information")
        print(f"✅ Detailed requirements and examples")
        print(f"✅ Validation rules and quality standards")
        print(f"✅ Age-specific considerations")
        print(f"✅ Pillar-specific notes and focus")
        print(f"✅ Ready for creating thousands of activities")
        
        return True
        
    except Exception as e:
        print(f"❌ Error creating metadata table: {e}")
        return False

def main():
    """Main function to create comprehensive metadata table"""
    print("📋 Creating Comprehensive Metadata Table")
    print("=" * 60)
    print("🎯 Creating detailed column-specific information for activity creation")
    
    # Connect to Google Sheets
    client = get_google_sheets_client()
    if not client:
        return False
    
    # Create comprehensive metadata table
    success = create_comprehensive_metadata_table(client)
    
    if success:
        print(f"\n✅ SUCCESS! Comprehensive metadata table created!")
        print("=" * 50)
        print("✅ Each column has detailed information")
        print("✅ Complete requirements and examples")
        print("✅ Validation rules and quality standards")
        print("✅ Age and pillar-specific considerations")
        print("✅ Ready for systematic activity creation")
        
        return True
    else:
        print(f"\n❌ FAILED to create metadata table!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Metadata table creation completed!")
    else:
        print(f"\n❌ FAILED to create metadata table!")
