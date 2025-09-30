#!/usr/bin/env python3
"""
📋 Update Correct Metadata Sheet
Update the Metadata worksheet with comprehensive structure guidelines
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

def update_metadata_sheet(client):
    """Update the correct Metadata worksheet"""
    
    try:
        # Open the Sample 1 spreadsheet
        spreadsheet = client.open_by_key('14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ')
        
        # Open the Metadata worksheet
        metadata_worksheet = spreadsheet.worksheet('Metadata')
        
        print(f"📤 Working with: Metadata worksheet")
        
        # Get current data from metadata sheet
        try:
            existing_data = metadata_worksheet.get_all_values()
            print(f"📊 Current metadata sheet has {len(existing_data)} rows")
        except:
            existing_data = []
            print("📊 Metadata sheet appears to be empty")
        
        print(f"📋 Updating metadata sheet with comprehensive structure...")
        
        # Create comprehensive metadata structure
        metadata_structure = [
            # Header row
            ['METADATA STRUCTURE GUIDELINES', '', '', '', ''],
            
            # Overview section
            ['OVERVIEW', '', '', '', ''],
            ['Systematic Structure', '6 Age Groups × 4 Categories × 5 Topics = 120 Activities per Pillar', '', '', ''],
            ['Quality Standards', 'Minimum 8/10 validation score required', '', '', ''],
            ['Duplicate Prevention', 'Multi-level checking system implemented', '', '', ''],
            ['', '', '', '', ''],
            
            # Pillar-specific structure
            ['PILLAR-SPECIFIC STRUCTURE', '', '', '', ''],
            ['Play & Creativity Pillar', '', '', '', ''],
            ['Focus', 'Creative expression, imagination, artistic development', '', '', ''],
            ['Unique Skills', 'Creativity, Imagination, Artistic Expression, Musical Abilities, Construction', '', '', ''],
            ['', '', '', '', ''],
            
            # Age group structure
            ['AGE GROUP STRUCTURE', '', '', '', ''],
            ['Age Group', 'Categories (4 per group)', 'Topics (5 per category)', 'Total Activities', 'Focus Area'],
            ['Infant (0-1)', 'Sensory Exploration, Tummy Time, Interactive Sounds, Parent Bonding', '5 topics each', '20 activities', 'Sensory development'],
            ['Toddler (1-3)', 'Pretend Play, Building Blocks, Creative Art, Musical Exploration', '5 topics each', '20 activities', 'Creative exploration'],
            ['Preschooler (3-5)', 'Imaginative Dolls, Arts & Crafts, Role Playing, Sorting & Matching', '5 topics each', '20 activities', 'Social creativity'],
            ['Child (6-8)', 'Creative Storytelling, Advanced Art, DIY Crafts, Game Creation', '5 topics each', '20 activities', 'Complex creativity'],
            ['Pre-Teen (9-12)', 'Design Thinking, Animation, Music Composition, 3D Modeling', '5 topics each', '20 activities', 'Innovation focus'],
            ['Teen (13-18)', 'Artistic Performance, Digital Art, Engineering, Fashion Design', '5 topics each', '20 activities', 'Professional skills'],
            ['', '', '', '', ''],
            
            # Category requirements
            ['CATEGORY REQUIREMENTS', '', '', '', ''],
            ['Requirement', 'Description', 'Example', '', ''],
            ['Descriptive Names', 'Specific, clear names in proper title case', 'Sensory Exploration And Discovery', '', ''],
            ['No Abbreviations', 'Full descriptive names, no shortcuts', 'Building And Construction Play', '', ''],
            ['Clear Focus', 'Obviously indicate activity type and purpose', 'Creative Storytelling And Writing', '', ''],
            ['Pillar-Specific', 'Unique to pillar, no cross-pillar duplication', 'Design Thinking And Innovation', '', ''],
            ['Age-Appropriate', 'Match developmental capabilities', 'All categories age-matched', '', ''],
            ['', '', '', '', ''],
            
            # Topic requirements
            ['TOPIC REQUIREMENTS', '', '', '', ''],
            ['Requirement', 'Description', 'Example', '', ''],
            ['Engaging Names', 'Descriptive, interesting topic names', 'Tower Building Adventure', '', ''],
            ['Age-Appropriate', 'Language and concepts match age group', 'Gentle Tummy Time Play', '', ''],
            ['Specific Focus', 'Clear indication of activity type', 'Creative Storytelling Workshop', '', ''],
            ['Sequential Numbering', 'Numbered 1-5 within each category', '1, 2, 3, 4, 5', '', ''],
            ['Category Alignment', 'Consistent with category purpose', 'All topics match category focus', '', ''],
            ['', '', '', '', ''],
            
            # Quality standards
            ['QUALITY STANDARDS', '', '', '', ''],
            ['Standard', 'Requirement', 'Validation Method', '', ''],
            ['Age Appropriateness', 'Activities match developmental capabilities', 'Developmental milestone check', '', ''],
            ['Clear Objectives', 'Specific learning goals and outcomes', 'Objective clarity review', '', ''],
            ['Safety Compliance', 'Safe materials and supervision requirements', 'Safety checklist validation', '', ''],
            ['Material Accessibility', 'Common, affordable materials', 'Cost and availability check', '', ''],
            ['Engagement Factor', 'Fun and interesting for target age', 'Engagement assessment', '', ''],
            ['Complete Metadata', 'All 30 columns filled accurately', 'Completeness validation', '', ''],
            ['', '', '', '', ''],
            
            # Implementation guidelines
            ['IMPLEMENTATION GUIDELINES', '', '', '', ''],
            ['Step', 'Action', 'Quality Check', '', ''],
            ['1. Pillar Analysis', 'Define unique focus and skills', 'Verify pillar-specific focus', '', ''],
            ['2. Age Group Planning', 'Create 4 categories per age group', 'Check age-appropriate complexity', '', ''],
            ['3. Category Creation', 'Develop descriptive, specific categories', 'Validate naming conventions', '', ''],
            ['4. Topic Development', 'Create 5 topics per category', 'Ensure topic-category alignment', '', ''],
            ['5. Activity Creation', 'Develop activities with quality control', 'Apply 8/10 minimum score', '', ''],
            ['6. Duplicate Checking', 'Multi-level duplicate prevention', 'Verify uniqueness', '', ''],
            ['7. Google Sheets Update', 'Direct integration with validation', 'Confirm successful upload', '', ''],
            ['', '', '', '', ''],
            
            # Validation scoring
            ['VALIDATION SCORING SYSTEM', '', '', '', ''],
            ['Criteria', 'Points', 'Description', '', ''],
            ['Age Appropriateness', '2 points', 'Perfect match to developmental capabilities', '', ''],
            ['Clarity of Instructions', '2 points', 'Clear, numbered, easy to follow', '', ''],
            ['Safety Considerations', '2 points', 'Comprehensive safety measures', '', ''],
            ['Developmental Value', '2 points', 'Strong learning benefits', '', ''],
            ['Material Accessibility', '2 points', 'Very accessible and affordable', '', ''],
            ['Total Score', '10 points', 'Minimum 8/10 required for approval', '', ''],
            ['', '', '', '', ''],
            
            # Success metrics
            ['SUCCESS METRICS', '', '', '', ''],
            ['Metric', 'Target', 'Measurement', '', ''],
            ['Zero Duplicates', '100%', 'Multi-level duplicate checking', '', ''],
            ['Pillar-Specific Focus', '100%', 'Category-pillar alignment validation', '', ''],
            ['Quality Score', '8+/10', 'Validation scoring system', '', ''],
            ['Complete Metadata', '100%', 'All 30 columns populated', '', ''],
            ['Age Appropriateness', '100%', 'Developmental capability matching', '', ''],
            ['Category Alignment', '100%', 'Topic-category consistency check', '', ''],
            ['', '', '', '', ''],
            
            # Ready for implementation
            ['READY FOR IMPLEMENTATION', '', '', '', ''],
            ['Status', 'Complete', 'All guidelines established', '', ''],
            ['Next Step', 'Begin systematic activity creation', 'Follow implementation guidelines', '', ''],
            ['Quality Assurance', 'Built-in validation system', '8/10 minimum score required', '', ''],
            ['Scalability', 'Ready for thousands of activities', 'Consistent process established', '', '']
        ]
        
        # Clear existing data and add new structure
        print(f"\n📝 UPDATING METADATA SHEET:")
        print("=" * 40)
        
        # Clear the worksheet
        metadata_worksheet.clear()
        print("   ✅ Cleared existing metadata")
        
        # Add new metadata structure
        for row in metadata_structure:
            metadata_worksheet.append_row(row)
            time.sleep(0.5)  # Rate limiting
        
        print("   ✅ Added comprehensive metadata structure")
        print(f"   ✅ Added {len(metadata_structure)} rows of metadata guidelines")
        
        print(f"\n🎉 METADATA SHEET UPDATE COMPLETE!")
        print("=" * 50)
        print(f"✅ Metadata worksheet updated with comprehensive structure")
        print(f"✅ Pillar-specific guidelines established")
        print(f"✅ Age group structure defined (6 groups × 4 categories)")
        print(f"✅ Topic requirements specified (5 topics per category)")
        print(f"✅ Quality standards and validation system established")
        print(f"✅ Implementation guidelines created")
        print(f"✅ Ready for systematic activity creation")
        
        return True
        
    except Exception as e:
        print(f"❌ Error updating metadata sheet: {e}")
        return False

def main():
    """Main function to update metadata sheet"""
    print("📋 Updating Correct Metadata Sheet")
    print("=" * 50)
    print("🎯 Updating Metadata worksheet with comprehensive structure guidelines")
    
    # Connect to Google Sheets
    client = get_google_sheets_client()
    if not client:
        return False
    
    # Update metadata sheet
    success = update_metadata_sheet(client)
    
    if success:
        print(f"\n✅ SUCCESS! Metadata sheet updated!")
        print("=" * 40)
        print("✅ Correct metadata worksheet updated")
        print("✅ Comprehensive structure guidelines added")
        print("✅ Pillar-specific focus established")
        print("✅ Quality standards defined")
        print("✅ Implementation guidelines created")
        print("✅ Ready for systematic activity creation")
        
        return True
    else:
        print(f"\n❌ FAILED to update metadata sheet!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Metadata sheet update completed!")
    else:
        print(f"\n❌ FAILED to update metadata sheet!")
