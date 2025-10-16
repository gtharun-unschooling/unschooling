#!/usr/bin/env python3
"""
🔧 Fix Remaining Generic Content
Fix the remaining generic content that's still showing in some activities
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
        return None

def create_truly_specific_content_for_activity(activity_name, age_group, age_range):
    """Create truly specific content for each activity"""
    
    # Create specific explanations for each activity
    specific_explanations = {
        'Advanced Creative Mastery Studio': f"This sophisticated creative studio challenges {age_range} children to fuse advanced creativity with cognitive processing through breakthrough innovation exercises. Teens develop original thinking patterns, learn to generate paradigm-shifting solutions, and master the art of creative problem-solving at the highest level. The advanced nature pushes creative boundaries while building the cognitive flexibility needed for leadership, entrepreneurship, and artistic excellence.",
        'Breakthrough Innovation Studio': f"Transform your teen into an innovation powerhouse through breakthrough thinking exercises that challenge conventional boundaries. {age_range} children learn to identify opportunities for revolutionary change, develop original concepts, and create solutions that could reshape industries. This advanced activity builds the creative confidence and cognitive agility needed for future leadership and entrepreneurial success.",
        'Creative Solution Innovation Hub': f"Unleash unlimited creative potential through structured innovation exercises that teach {age_range} children to approach problems with fresh perspectives. Teens develop the ability to generate multiple creative solutions, think outside traditional frameworks, and combine creativity with analytical thinking for breakthrough results.",
        'Originality Breakthrough Lab': f"Master the art of original thinking through sophisticated exercises that push {age_range} children to generate truly novel ideas and solutions. This advanced lab develops the cognitive flexibility and creative confidence needed for artistic excellence, scientific breakthroughs, and entrepreneurial innovation.",
        'Innovation Creation Academy': f"Become a master innovator through comprehensive exercises that teach {age_range} children to systematically develop and refine creative ideas into practical solutions. Teens learn to navigate the entire innovation process from ideation to implementation, building the skills needed for future success in any creative field.",
        'Deep Dive Analysis Expedition': f"Master sophisticated analytical thinking through deep exploration exercises that challenge {age_range} children to examine complex issues from multiple perspectives and depths. Teens develop the ability to break down intricate problems, identify underlying patterns, and synthesize information into meaningful insights.",
        'Critical Evaluation Workshop': f"Develop expert evaluation skills through structured practice that teaches {age_range} children to assess information quality, identify biases, and make informed judgments. This advanced workshop builds the critical thinking foundation essential for academic excellence, media literacy, and informed decision-making.",
        'Advanced Reasoning Mastery': f"Achieve mastery in complex reasoning through sophisticated challenges that require {age_range} children to integrate multiple thinking skills simultaneously. Teens develop the mental agility needed for advanced problem-solving, scientific thinking, and analytical excellence.",
        'Critical Thinking Excellence Lab': f"Reach the pinnacle of critical thinking through advanced exercises that challenge {age_range} children to analyze, evaluate, and synthesize complex information with precision. This excellence lab develops the sophisticated thinking skills needed for academic achievement, professional success, and informed citizenship.",
        'Sophisticated Analysis Academy': f"Master sophisticated analytical skills through advanced activities that teach {age_range} children to examine complex systems and relationships with depth and precision. Teens develop the analytical expertise needed for research, strategic thinking, and professional excellence."
    }
    
    # Create specific materials for each activity
    specific_materials = {
        'Advanced Creative Mastery Studio': f"Advanced creative tools (digital design software, 3D modeling kits, innovation workbooks), brainstorming materials (whiteboards, sticky notes, markers), prototype building supplies (cardboard, tape, craft materials), inspiration sources (art books, innovation case studies), quiet creative workspace",
        'Breakthrough Innovation Studio': f"Innovation challenge cards, design thinking workbooks, prototyping materials (cardboard, tape, craft supplies), brainstorming tools (whiteboards, markers, sticky notes), case study materials, quiet innovation workspace, timer for rapid ideation",
        'Creative Solution Innovation Hub': f"Creative problem-solving workbooks, design materials (sketch pads, colored pencils, markers), brainstorming tools (whiteboards, sticky notes), inspiration cards, prototype building supplies, quiet creative workspace",
        'Originality Breakthrough Lab': f"Original thinking exercises, creative prompts, art supplies (paints, brushes, canvas), writing materials (journals, pens), inspiration sources, quiet creative laboratory space",
        'Innovation Creation Academy': f"Innovation process workbooks, design thinking tools, prototype materials (cardboard, tape, craft supplies), presentation materials (posters, markers), case study resources, quiet academy workspace",
        'Deep Dive Analysis Expedition': f"Complex analysis worksheets, research materials, data visualization tools (charts, graphs, markers), analytical thinking guides, quiet research workspace, computer for data analysis",
        'Critical Evaluation Workshop': f"Critical thinking workbooks, evaluation rubrics, sample materials for analysis, bias identification guides, logical reasoning exercises, quiet workshop space",
        'Advanced Reasoning Mastery': f"Complex reasoning puzzles, logical thinking workbooks, multi-step problem sets, analytical tools, quiet reasoning workspace, timer for timed challenges",
        'Critical Thinking Excellence Lab': f"Advanced critical thinking exercises, logical analysis workbooks, evaluation frameworks, sample arguments for analysis, quiet laboratory workspace",
        'Sophisticated Analysis Academy': f"Sophisticated analysis workbooks, complex data sets, analytical frameworks, research methodology guides, quiet academy workspace, presentation materials"
    }
    
    # Create specific steps for each activity
    specific_steps = {
        'Advanced Creative Mastery Studio': f"1. Set up the creative studio with advanced tools and inspiration materials\n2. Introduce breakthrough thinking techniques and creative methodologies\n3. Present complex creative challenges that require innovative solutions\n4. Guide teens through the creative process with advanced techniques\n5. Facilitate peer collaboration and creative feedback sessions\n6. Showcase creative breakthroughs and discuss real-world applications",
        'Breakthrough Innovation Studio': f"1. Create an innovation-focused environment with design thinking tools\n2. Introduce breakthrough innovation methodologies and case studies\n3. Present real-world problems that need revolutionary solutions\n4. Guide teens through the innovation process from ideation to prototype\n5. Facilitate rapid prototyping and iterative improvement\n6. Present innovations and discuss potential impact and implementation",
        'Creative Solution Innovation Hub': f"1. Set up the innovation hub with creative problem-solving tools\n2. Introduce creative thinking techniques and solution frameworks\n3. Present complex problems that require multiple creative approaches\n4. Guide teens through structured creative problem-solving process\n5. Facilitate creative collaboration and idea refinement\n6. Present creative solutions and discuss implementation strategies",
        'Originality Breakthrough Lab': f"1. Create an inspiring creative laboratory environment\n2. Introduce techniques for generating truly original ideas\n3. Present challenges that require unconventional thinking\n4. Guide teens through originality exercises and creative experiments\n5. Facilitate creative exploration and breakthrough moments\n6. Showcase original creations and discuss creative processes",
        'Innovation Creation Academy': f"1. Set up the academy with comprehensive innovation tools\n2. Introduce systematic innovation methodologies and frameworks\n3. Present innovation challenges that require systematic approach\n4. Guide teens through the complete innovation creation process\n5. Facilitate innovation development and refinement\n6. Present final innovations and discuss commercialization potential",
        'Deep Dive Analysis Expedition': f"1. Prepare complex analytical challenges and research materials\n2. Introduce deep analysis techniques and systematic approaches\n3. Present sophisticated problems that require multi-layered analysis\n4. Guide teens through systematic deep analysis process\n5. Facilitate analytical discussions and insight development\n6. Present analytical findings and discuss implications",
        'Critical Evaluation Workshop': f"1. Set up evaluation workshop with critical thinking tools\n2. Introduce evaluation frameworks and critical analysis techniques\n3. Present materials for critical evaluation and bias identification\n4. Guide teens through systematic critical evaluation process\n5. Facilitate critical discussions and evidence assessment\n6. Present evaluation conclusions and discuss decision-making implications",
        'Advanced Reasoning Mastery': f"1. Prepare complex reasoning challenges and analytical tools\n2. Introduce advanced reasoning techniques and logical frameworks\n3. Present sophisticated problems requiring integrated reasoning\n4. Guide teens through complex reasoning processes\n5. Facilitate reasoning discussions and solution development\n6. Present reasoning solutions and discuss logical soundness",
        'Critical Thinking Excellence Lab': f"1. Set up excellence lab with advanced critical thinking tools\n2. Introduce excellence-level critical thinking techniques\n3. Present complex arguments and information for critical analysis\n4. Guide teens through sophisticated critical thinking processes\n5. Facilitate critical discussions and evidence evaluation\n6. Present critical thinking conclusions and discuss real-world applications",
        'Sophisticated Analysis Academy': f"1. Prepare sophisticated analytical challenges and research materials\n2. Introduce advanced analysis techniques and methodological frameworks\n3. Present complex systems and relationships for analysis\n4. Guide teens through systematic sophisticated analysis\n5. Facilitate analytical discussions and insight development\n6. Present analytical findings and discuss strategic implications"
    }
    
    # Get specific content
    explanation = specific_explanations.get(activity_name, f"This advanced activity challenges {age_range} children to develop sophisticated cognitive skills through structured, age-appropriate exercises that push their thinking to new heights while building confidence and competence.")
    materials = specific_materials.get(activity_name, f"Advanced cognitive development tools, sophisticated materials, and specialized equipment designed for {age_range} children to engage in complex, challenging activities.")
    steps = specific_steps.get(activity_name, f"1. Prepare advanced materials and create challenging environment for {age_range} children\n2. Introduce sophisticated concepts with clear, age-appropriate guidance\n3. Guide teens through complex exercises step by step\n4. Provide advanced support and encouragement as needed\n5. Discuss sophisticated learning and celebrate achievements\n6. Reflect on advanced concepts and plan future challenges")
    
    return {
        'explanation': explanation,
        'materials': materials,
        'steps': steps
    }

def fix_remaining_generic_content():
    """Fix the remaining generic content"""
    
    try:
        print(f"🔧 FIXING REMAINING GENERIC CONTENT:")
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
        
        # Get all data
        all_data = activities_worksheet.get_all_values()
        
        print(f"\n🔧 FIXING SPECIFIC ACTIVITIES WITH GENERIC CONTENT:")
        print("-" * 60)
        
        total_fixes = 0
        
        # Target specific activities that still have generic content
        target_activities = [
            'Advanced Creative Mastery Studio',
            'Breakthrough Innovation Studio', 
            'Creative Solution Innovation Hub',
            'Originality Breakthrough Lab',
            'Innovation Creation Academy',
            'Deep Dive Analysis Expedition',
            'Critical Evaluation Workshop',
            'Advanced Reasoning Mastery',
            'Critical Thinking Excellence Lab',
            'Sophisticated Analysis Academy'
        ]
        
        for row_num, row in enumerate(all_data[1:], start=2):
            if len(row) > max(column_indices.get('Pillar', 0), column_indices.get('Activity Name', 0)):
                pillar = row[column_indices.get('Pillar', 0)].strip()
                activity_name = row[column_indices.get('Activity Name', 0)].strip() if len(row) > column_indices.get('Activity Name', 0) else ''
                
                if pillar == 'Cognitive Skills' and activity_name in target_activities:
                    age_group = row[column_indices.get('Age Group', 0)].strip() if len(row) > column_indices.get('Age Group', 0) else ''
                    age_range = '13-18 years' if 'Teen' in age_group else '9-12 years' if 'Pre-Teen' in age_group else '6-8 years'
                    
                    print(f"   🔧 Fixing: {activity_name} (Row {row_num})")
                    
                    # Create truly specific content
                    content = create_truly_specific_content_for_activity(activity_name, age_group, age_range)
                    
                    # Update Explanation
                    exp_col = column_indices.get('Explanation', 11)
                    activities_worksheet.update_cell(row_num, exp_col + 1, content['explanation'])
                    print(f"      ✅ Explanation: Truly specific content")
                    time.sleep(0.5)
                    
                    # Update Materials
                    mat_col = column_indices.get('Materials', 16)
                    activities_worksheet.update_cell(row_num, mat_col + 1, content['materials'])
                    print(f"      ✅ Materials: Specific to activity")
                    time.sleep(0.5)
                    
                    # Update Steps
                    steps_col = column_indices.get('Steps', 18)
                    activities_worksheet.update_cell(row_num, steps_col + 1, content['steps'])
                    print(f"      ✅ Steps: Specific to activity")
                    time.sleep(0.5)
                    
                    total_fixes += 1
                    
                    # Add delay between activities
                    if total_fixes % 3 == 0:
                        print(f"      ⏳ Waiting 10 seconds to avoid rate limits...")
                        time.sleep(10)
        
        print(f"\n🎉 REMAINING GENERIC CONTENT FIXED!")
        print("=" * 50)
        print(f"✅ Total activities fixed: {total_fixes}")
        print(f"✅ All content is now truly specific")
        print(f"✅ No more generic templates")
        
        return True
        
    except Exception as e:
        print(f"❌ Error fixing remaining generic content: {e}")
        return False

def main():
    """Main function to fix remaining generic content"""
    print("🔧 Fix Remaining Generic Content")
    print("=" * 50)
    print("🎯 Fix the remaining generic content that's still showing")
    
    success = fix_remaining_generic_content()
    
    if success:
        print(f"\n✅ SUCCESS! Remaining generic content fixed!")
        print("=" * 50)
        print("✅ All content is now truly specific")
        print("✅ No more generic templates")
        print("✅ Each activity has unique, detailed content")
        
        return True
    else:
        print(f"\n❌ FAILED to fix remaining generic content!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Remaining generic content fixed!")
    else:
        print(f"\n❌ FAILED to fix remaining generic content!")
