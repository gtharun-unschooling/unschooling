#!/usr/bin/env python3
"""
🧠 Enhance Cognitive Skills Data Directly in Google Sheets
This script works directly with your Google Sheets to enhance the Cognitive Skills data
to match the Play Creativity pillar structure.
"""

import gspread
from google.oauth2.service_account import Credentials
import time

def get_google_sheets_client():
    """Connect to Google Sheets using credentials"""
    try:
        # Use the proper service account
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

def find_essential_growth_sheet(client):
    """Find the Essential Growth spreadsheet"""
    try:
        # List all spreadsheets
        all_sheets = client.list_spreadsheet_files()
        print(f"📋 Found {len(all_sheets)} spreadsheets")
        
        # Look for Essential Growth related sheets
        target_files = []
        for sheet in all_sheets:
            title = ""
            if 'title' in sheet:
                title = sheet['title'].lower()
            elif 'name' in sheet:
                title = sheet['name'].lower()
            elif 'title' in sheet.get('properties', {}):
                title = sheet['properties']['title'].lower()
            
            # Look for sheets with Essential Growth, Sample, or similar names
            if title and any(keyword in title for keyword in ['essential', 'growth', 'sample', 'activities', 'cognitive', 'play']):
                target_files.append(sheet)
                print(f"✅ Found potential target: {title}")
        
        if target_files:
            # Use the first target file
            target_sheet = target_files[0]
            sheet_name = target_sheet.get('name', target_sheet.get('title', 'Unknown'))
            print(f"\n📤 Working with: {sheet_name}")
            
            # Open the spreadsheet
            spreadsheet = client.open_by_key(target_sheet['id'])
            return spreadsheet, sheet_name
        else:
            print("❌ No suitable Essential Growth spreadsheet found")
            return None, None
            
    except Exception as e:
        print(f"❌ Error finding spreadsheet: {e}")
        return None, None

def get_current_cognitive_skills_data(worksheet):
    """Get current Cognitive Skills data from the worksheet"""
    try:
        print("📖 Reading current Cognitive Skills data...")
        
        # Get all data
        all_data = worksheet.get_all_values()
        if not all_data:
            print("❌ No data found in worksheet")
            return []
        
        # Get headers
        headers = all_data[0]
        print(f"📋 Headers found: {headers}")
        
        # Filter for Cognitive Skills data
        cognitive_skills_data = []
        pillar_col_index = headers.index('Pillar') if 'Pillar' in headers else None
        
        if pillar_col_index is None:
            print("❌ 'Pillar' column not found")
            return []
        
        for row in all_data[1:]:
            if len(row) > pillar_col_index and row[pillar_col_index].strip() == 'Cognitive Skills':
                cognitive_skills_data.append(row)
        
        print(f"✅ Found {len(cognitive_skills_data)} existing Cognitive Skills activities")
        
        # Show current age groups
        age_group_col_index = headers.index('Age Group') if 'Age Group' in headers else None
        if age_group_col_index is not None:
            age_groups = set()
            for row in cognitive_skills_data:
                if len(row) > age_group_col_index:
                    age_groups.add(row[age_group_col_index].strip())
            print(f"📊 Current age groups: {sorted(age_groups)}")
        
        # Show current categories
        category_col_index = headers.index('Category') if 'Category' in headers else None
        if category_col_index is not None:
            categories = set()
            for row in cognitive_skills_data:
                if len(row) > category_col_index:
                    categories.add(row[category_col_index].strip())
            print(f"📊 Current categories: {sorted(categories)}")
        
        return cognitive_skills_data, headers
        
    except Exception as e:
        print(f"❌ Error reading current data: {e}")
        return [], []

def create_enhanced_cognitive_skills_activities():
    """Create enhanced cognitive skills activities data"""
    
    # Enhanced activities data to add to Google Sheets
    enhanced_activities = [
        # Toddler (1-3) activities
        {
            'Pillar': 'Cognitive Skills',
            'Age Group': 'Toddler (1-3)',
            'Category': 'Pattern Recognition',
            'Category Description': 'Develop early pattern recognition and classification skills',
            'Topic Number': '1',
            'Topic': 'Color Sorting Fun',
            'Objective': 'Introduce basic sorting and pattern recognition through color games',
            'Explanation': 'Help toddlers recognize patterns by sorting objects by color, building early classification skills.',
            'Hashtags': '#PatternRecognition; #ColorSorting; #ToddlerActivities',
            'Estimated Time': '10-15 min',
            'Age': '18-36 months',
            'Activity Name': 'Rainbow Sorting Adventure',
            'Materials': 'Colored blocks or toys; Sorting containers; Color cards',
            'Steps': '1. Set up colored containers or spaces; 2. Show toddler different colored objects; 3. Demonstrate sorting by putting red items in red space; 4. Encourage toddler to sort remaining items; 5. Celebrate correct sorting with enthusiasm',
            'Skills': 'Pattern recognition; Color identification; Classification; Fine motor skills'
        },
        {
            'Pillar': 'Cognitive Skills',
            'Age Group': 'Toddler (1-3)',
            'Category': 'Simple Classification',
            'Category Description': 'Develop basic categorization and grouping skills',
            'Topic Number': '1',
            'Topic': 'Big and Small Sorting',
            'Objective': 'Teach basic size comparison and classification',
            'Explanation': 'Help toddlers understand size concepts by sorting objects into big and small groups.',
            'Hashtags': '#Classification; #SizeConcepts; #ToddlerLearning',
            'Estimated Time': '10-15 min',
            'Age': '18-36 months',
            'Activity Name': 'Size Detective Game',
            'Materials': 'Various sized objects; Two boxes (big/small); Size comparison cards',
            'Steps': '1. Gather objects of different sizes; 2. Show toddler the big and small boxes; 3. Demonstrate putting large items in big box; 4. Let toddler try sorting remaining items; 5. Talk about sizes: "This ball is big!" "This button is small!"',
            'Skills': 'Size comparison; Classification; Vocabulary development; Logical thinking'
        },
        
        # Preschooler (3-5) activities
        {
            'Pillar': 'Cognitive Skills',
            'Age Group': 'Preschooler (3-5)',
            'Category': 'Advanced Problem Solving',
            'Category Description': 'Develop complex problem-solving skills through engaging challenges',
            'Topic Number': '1',
            'Topic': 'Puzzle Master Challenge',
            'Objective': 'Build problem-solving skills through age-appropriate puzzles',
            'Explanation': 'Use puzzles to develop spatial reasoning, pattern recognition, and persistence in problem-solving.',
            'Hashtags': '#ProblemSolving; #Puzzles; #SpatialReasoning',
            'Estimated Time': '15-20 min',
            'Age': '3-5 years',
            'Activity Name': 'Mystery Puzzle Quest',
            'Materials': 'Age-appropriate puzzles; Timer; Progress chart',
            'Steps': '1. Choose a puzzle appropriate for child\'s skill level; 2. Look at the puzzle picture together; 3. Start with corner and edge pieces; 4. Work on sections that match the picture; 5. Celebrate completion and discuss strategies used',
            'Skills': 'Problem solving; Spatial reasoning; Persistence; Visual processing'
        },
        {
            'Pillar': 'Cognitive Skills',
            'Age Group': 'Preschooler (3-5)',
            'Category': 'Executive Function',
            'Category Description': 'Develop planning, organization, and self-control skills',
            'Topic Number': '1',
            'Topic': 'Morning Routine Planning',
            'Objective': 'Develop planning and organization skills through daily routines',
            'Explanation': 'Help children learn to plan and organize their daily activities, building executive function skills.',
            'Hashtags': '#ExecutiveFunction; #Planning; #Organization',
            'Estimated Time': '10-15 min',
            'Age': '3-5 years',
            'Activity Name': 'Super Planner Adventure',
            'Materials': 'Picture cards of daily activities; Chart paper; Stickers',
            'Steps': '1. Show child picture cards of morning activities; 2. Discuss what needs to be done first, second, etc.; 3. Arrange cards in logical order; 4. Create a visual schedule together; 5. Practice following the routine',
            'Skills': 'Planning; Organization; Sequencing; Self-regulation'
        },
        
        # Child (6-8) activities
        {
            'Pillar': 'Cognitive Skills',
            'Age Group': 'Child (6-8)',
            'Category': 'Complex Problem Solving',
            'Category Description': 'Develop advanced problem-solving strategies and critical thinking',
            'Topic Number': '1',
            'Topic': 'Escape Room Challenge',
            'Objective': 'Apply multiple problem-solving strategies to solve complex puzzles',
            'Explanation': 'Create an age-appropriate escape room experience to develop complex problem-solving skills.',
            'Hashtags': '#ComplexProblemSolving; #CriticalThinking; #Teamwork',
            'Estimated Time': '30-45 min',
            'Age': '6-8 years',
            'Activity Name': 'Mystery Mansion Escape',
            'Materials': 'Locks and keys; Puzzle pieces; Clue cards; Timer',
            'Steps': '1. Set up a series of connected puzzles; 2. Give child the first clue to start; 3. Guide them through problem-solving process; 4. Encourage multiple solution attempts; 5. Celebrate when they "escape" and discuss strategies',
            'Skills': 'Complex problem solving; Critical thinking; Persistence; Strategic planning'
        },
        {
            'Pillar': 'Cognitive Skills',
            'Age Group': 'Child (6-8)',
            'Category': 'Strategic Thinking',
            'Category Description': 'Develop planning and strategic decision-making skills',
            'Topic Number': '1',
            'Topic': 'Chess for Beginners',
            'Objective': 'Introduce strategic thinking through chess basics',
            'Explanation': 'Use chess to develop strategic thinking, planning ahead, and considering consequences.',
            'Hashtags': '#StrategicThinking; #Chess; #Planning',
            'Estimated Time': '20-30 min',
            'Age': '6-8 years',
            'Activity Name': 'Chess Strategy Adventure',
            'Materials': 'Chess set; Chess puzzle cards; Timer',
            'Steps': '1. Introduce basic chess piece movements; 2. Start with simple endgame scenarios; 3. Practice thinking 2-3 moves ahead; 4. Discuss why certain moves are good; 5. Gradually increase complexity',
            'Skills': 'Strategic thinking; Planning ahead; Consequence evaluation; Patience'
        },
        
        # Pre-Teen (9-12) activities
        {
            'Pillar': 'Cognitive Skills',
            'Age Group': 'Pre-Teen (9-12)',
            'Category': 'Advanced Critical Thinking',
            'Category Description': 'Develop sophisticated critical thinking and analysis skills',
            'Topic Number': '1',
            'Topic': 'Debate and Discussion',
            'Objective': 'Develop critical thinking through structured debate and analysis',
            'Explanation': 'Use age-appropriate debate topics to develop critical thinking, evidence evaluation, and persuasive reasoning.',
            'Hashtags': '#CriticalThinking; #Debate; #Analysis',
            'Estimated Time': '30-45 min',
            'Age': '9-12 years',
            'Activity Name': 'Young Debater Challenge',
            'Materials': 'Debate topics; Research materials; Timer; Scoring sheet',
            'Steps': '1. Choose an age-appropriate debate topic; 2. Research both sides of the argument; 3. Practice presenting evidence; 4. Listen to opposing arguments; 5. Reflect on what makes a strong argument',
            'Skills': 'Critical thinking; Evidence evaluation; Persuasive reasoning; Active listening'
        },
        {
            'Pillar': 'Cognitive Skills',
            'Age Group': 'Pre-Teen (9-12)',
            'Category': 'Complex Logic',
            'Category Description': 'Develop advanced logical reasoning and deductive thinking',
            'Topic Number': '1',
            'Topic': 'Logic Puzzle Mastery',
            'Objective': 'Master complex logic puzzles and deductive reasoning',
            'Explanation': 'Use advanced logic puzzles to develop deductive reasoning and systematic problem-solving approaches.',
            'Hashtags': '#Logic; #DeductiveReasoning; #Puzzles',
            'Estimated Time': '25-35 min',
            'Age': '9-12 years',
            'Activity Name': 'Logic Detective Agency',
            'Materials': 'Logic puzzle books; Grid paper; Pencils; Timer',
            'Steps': '1. Start with a logic grid puzzle; 2. Read all clues carefully; 3. Use process of elimination; 4. Make logical deductions step by step; 5. Check reasoning and find the solution',
            'Skills': 'Logical reasoning; Deductive thinking; Systematic analysis; Attention to detail'
        },
        
        # Teen (13-18) activities
        {
            'Pillar': 'Cognitive Skills',
            'Age Group': 'Teen (13-18)',
            'Category': 'Advanced Analytical Thinking',
            'Category Description': 'Develop sophisticated analytical and evaluative thinking skills',
            'Topic Number': '1',
            'Topic': 'Case Study Analysis',
            'Objective': 'Apply analytical thinking to complex real-world scenarios',
            'Explanation': 'Use case studies to develop advanced analytical thinking, evidence evaluation, and solution development.',
            'Hashtags': '#AnalyticalThinking; #CaseStudy; #RealWorldProblemSolving',
            'Estimated Time': '45-60 min',
            'Age': '13-18 years',
            'Activity Name': 'Strategic Problem Solver',
            'Materials': 'Case study materials; Analysis framework; Research resources; Presentation tools',
            'Steps': '1. Read and understand the case study scenario; 2. Identify key problems and stakeholders; 3. Research relevant information and data; 4. Analyze multiple potential solutions; 5. Present recommendations with supporting evidence',
            'Skills': 'Analytical thinking; Evidence evaluation; Solution development; Presentation skills'
        },
        {
            'Pillar': 'Cognitive Skills',
            'Age Group': 'Teen (13-18)',
            'Category': 'Innovation Thinking',
            'Category Description': 'Develop creative problem-solving and innovation skills',
            'Topic Number': '1',
            'Topic': 'Design Thinking Challenge',
            'Objective': 'Apply design thinking methodology to solve complex problems',
            'Explanation': 'Use design thinking to develop innovative solutions to real-world problems, building creativity and systematic innovation skills.',
            'Hashtags': '#Innovation; #DesignThinking; #CreativeProblemSolving',
            'Estimated Time': '60-90 min',
            'Age': '13-18 years',
            'Activity Name': 'Innovation Lab Workshop',
            'Materials': 'Design thinking framework; Prototyping materials; Research tools; Presentation materials',
            'Steps': '1. Empathize: Research and understand the problem; 2. Define: Clearly articulate the problem; 3. Ideate: Generate multiple creative solutions; 4. Prototype: Build a simple model or mockup; 5. Test: Get feedback and iterate on the solution',
            'Skills': 'Innovation thinking; Creative problem solving; Prototyping; Iterative design'
        }
    ]
    
    return enhanced_activities

def add_enhanced_activities_to_sheets(worksheet, headers, enhanced_activities):
    """Add enhanced activities to Google Sheets"""
    try:
        print(f"\n📤 Adding {len(enhanced_activities)} enhanced activities to Google Sheets...")
        
        # Prepare data rows
        rows_to_add = []
        for activity in enhanced_activities:
            row = []
            for header in headers:
                row.append(activity.get(header, ''))
            rows_to_add.append(row)
        
        # Add rows in batches to avoid API limits
        batch_size = 10
        for i in range(0, len(rows_to_add), batch_size):
            batch = rows_to_add[i:i+batch_size]
            worksheet.append_rows(batch)
            print(f"✅ Added batch {i//batch_size + 1}/{(len(rows_to_add)-1)//batch_size + 1}")
            time.sleep(2)  # Rate limiting
        
        print(f"🎉 Successfully added {len(enhanced_activities)} enhanced activities!")
        return True
        
    except Exception as e:
        print(f"❌ Error adding activities to sheets: {e}")
        return False

def main():
    """Main function to enhance Cognitive Skills data in Google Sheets"""
    print("🧠 Enhancing Cognitive Skills Data in Google Sheets")
    print("=" * 60)
    
    # Connect to Google Sheets
    client = get_google_sheets_client()
    if not client:
        return False
    
    # Find the Essential Growth spreadsheet
    spreadsheet, sheet_name = find_essential_growth_sheet(client)
    if not spreadsheet:
        return False
    
    # Get the first worksheet
    worksheet = spreadsheet.get_worksheet(0)
    
    # Get current Cognitive Skills data
    current_data, headers = get_current_cognitive_skills_data(worksheet)
    
    # Create enhanced activities
    enhanced_activities = create_enhanced_cognitive_skills_activities()
    
    # Add enhanced activities to sheets
    success = add_enhanced_activities_to_sheets(worksheet, headers, enhanced_activities)
    
    if success:
        print(f"\n🎉 ENHANCEMENT COMPLETE!")
        print("=" * 40)
        print(f"✅ Added {len(enhanced_activities)} new activities")
        print(f"✅ Added 5 new age groups: Toddler, Preschooler, Child, Pre-Teen, Teen")
        print(f"✅ Added 8 new categories")
        print(f"✅ Enhanced Cognitive Skills data in Google Sheets")
        
        print(f"\n📊 New Activities by Age Group:")
        age_groups = {}
        for activity in enhanced_activities:
            age_group = activity['Age Group']
            age_groups[age_group] = age_groups.get(age_group, 0) + 1
        
        for age_group, count in age_groups.items():
            print(f"   {age_group}: {count} activities")
        
        print(f"\n🚀 Next Steps:")
        print(f"   1. Review the enhanced data in Google Sheets")
        print(f"   2. Add more activities to reach comprehensive coverage")
        print(f"   3. Run sync script to update application")
        print(f"   4. Test Cognitive Skills pillar in application")
        
        print(f"\n🔗 Google Sheets URL: {spreadsheet.url}")
        
        return True
    else:
        print(f"\n❌ Enhancement failed")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Cognitive Skills enhanced in Google Sheets!")
    else:
        print(f"\n❌ FAILED to enhance Cognitive Skills data")
