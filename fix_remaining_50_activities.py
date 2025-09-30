#!/usr/bin/env python3
"""
🔧 Fix Remaining 50 Activities
Create unique, activity-specific steps for activities 71-120
"""

import pandas as pd
import os
from google.oauth2 import service_account
import gspread
from datetime import datetime
import time

def fix_remaining_50_activities():
    """Create unique, activity-specific steps for activities 71-120"""
    
    print("🔧 Fixing Remaining 50 Activities (71-120)")
    print("=" * 70)
    
    # Configuration
    CREDS_FILE = 'sheets-credentials.json'
    
    # Activity-specific steps for activities 71-120
    activity_specific_steps = {
        71: [  # Marble Maze Challenge
            "1. Gather cardboard, straws, and marbles for the maze",
            "2. Help child design a maze layout on cardboard",
            "3. Let them glue straws to create maze walls",
            "4. Test the maze by rolling marbles through it",
            "5. Challenge them to create more complex mazes"
        ],
        72: [  # Paper Roller Coaster
            "1. Collect paper rolls and create ramps and loops",
            "2. Show child how to build a roller coaster structure",
            "3. Let them test different track designs",
            "4. Help them understand physics concepts like gravity",
            "5. Have a roller coaster competition"
        ],
        73: [  # Friendship Bracelets
            "1. Give child colorful threads and beads",
            "2. Show them how to braid or weave the threads",
            "3. Let them create bracelets for friends and family",
            "4. Help them learn different bracelet patterns",
            "5. Organize a bracelet exchange with friends"
        ],
        74: [  # Popsicle Stick Bridge
            "1. Provide popsicle sticks and glue for bridge building",
            "2. Show child how to create strong bridge structures",
            "3. Let them test their bridge with weights",
            "4. Help them understand engineering principles",
            "5. Have a bridge strength competition"
        ],
        75: [  # Light-Up Greeting Card
            "1. Gather LED lights, batteries, and card materials",
            "2. Show child how to create a simple circuit",
            "3. Let them design a card that lights up",
            "4. Help them understand basic electronics",
            "5. Send the light-up card to someone special"
        ],
        76: [  # Backyard Obstacle Course
            "1. Use household items to create obstacles",
            "2. Show child how to navigate through the course",
            "3. Let them time themselves and improve",
            "4. Help them design their own obstacles",
            "5. Have a family obstacle course race"
        ],
        77: [  # Dice Math Race
            "1. Roll dice and solve math problems quickly",
            "2. Show child how to do physical activities between problems",
            "3. Let them combine movement with math learning",
            "4. Help them understand that math can be fun",
            "5. Create a math race tournament"
        ],
        78: [  # Create-a-Game Challenge
            "1. Give child materials to design their own game",
            "2. Show them how to create rules and objectives",
            "3. Let them test their game with family",
            "4. Help them refine the game based on feedback",
            "5. Have a family game night with their creation"
        ],
        79: [  # Recycled Board Game
            "1. Use waste materials to create game pieces and board",
            "2. Show child how to design a sustainable game",
            "3. Let them create rules that teach about recycling",
            "4. Help them understand environmental concepts",
            "5. Play their eco-friendly board game"
        ],
        80: [  # Vocabulary Treasure Hunt
            "1. Hide word cards around the house with clues",
            "2. Show child how to follow clues to find words",
            "3. Let them create sentences with the words they find",
            "4. Help them expand their vocabulary through play",
            "5. Have a vocabulary celebration when they find all words"
        ],
        81: [  # Toy Redesign Challenge
            "1. Give child an existing toy to improve",
            "2. Show them how to identify problems and solutions",
            "3. Let them redesign the toy with new features",
            "4. Help them understand design thinking",
            "5. Test their improved toy design"
        ],
        82: [  # Toy for a Different Age
            "1. Ask child to redesign a toy for a different age group",
            "2. Show them how to consider age-appropriate features",
            "3. Let them create adaptations for younger or older kids",
            "4. Help them understand developmental differences",
            "5. Present their age-adapted toy design"
        ],
        83: [  # Problem-Solving Prototype
            "1. Give child a real problem to solve with a toy",
            "2. Show them how to brainstorm creative solutions",
            "3. Let them build a prototype of their solution",
            "4. Help them test and improve their design",
            "5. Share their problem-solving invention"
        ],
        84: [  # Inclusive Toy Design
            "1. Ask child to design toys for kids with disabilities",
            "2. Show them how to consider accessibility needs",
            "3. Let them create inclusive toy features",
            "4. Help them understand empathy and inclusion",
            "5. Test their inclusive toy with different users"
        ],
        85: [  # Packaging That Pops!
            "1. Give child a toy and materials to create packaging",
            "2. Show them how to make packaging attractive and protective",
            "3. Let them design eye-catching packaging",
            "4. Help them understand marketing and design",
            "5. Display their creative packaging designs"
        ],
        86: [  # Claymation Mini Movie
            "1. Give child clay to create characters for animation",
            "2. Show them how to make stop-motion videos",
            "3. Let them create a short animated story",
            "4. Help them understand filmmaking and storytelling",
            "5. Host a mini film festival for their movies"
        ],
        87: [  # Object Life Stories
            "1. Choose everyday objects to bring to life",
            "2. Show child how to give objects personality and voice",
            "3. Let them create animated stories about objects",
            "4. Help them understand personification and creativity",
            "5. Share their object animation stories"
        ],
        88: [  # Paper Puppet Theater
            "1. Help child create paper puppets and a theater stage",
            "2. Show them how to make puppets move and talk",
            "3. Let them create a puppet show story",
            "4. Help them understand theater and performance",
            "5. Put on a puppet show for family and friends"
        ],
        89: [  # History Rewind Reel
            "1. Choose a historical event to animate",
            "2. Show child how to research and understand history",
            "3. Let them create an animated historical scene",
            "4. Help them connect with historical events",
            "5. Share their historical animation"
        ],
        90: [  # Flipbook Animation
            "1. Give child a stack of paper to create a flipbook",
            "2. Show them how to draw sequential images",
            "3. Let them create a simple animation sequence",
            "4. Help them understand motion and timing",
            "5. Display their flipbook animation"
        ],
        91: [  # Theme Song Creation
            "1. Help child compose a personal theme song",
            "2. Show them how to use music apps or instruments",
            "3. Let them record their original song",
            "4. Help them understand music composition",
            "5. Perform their theme song for family"
        ],
        92: [  # Soundtrack to a Scene
            "1. Show child a silent video clip",
            "2. Help them create music that matches the scene",
            "3. Let them compose and record the soundtrack",
            "4. Help them understand music and emotion",
            "5. Play their soundtrack with the video"
        ],
        93: [  # Nature Beatbox Session
            "1. Record outdoor sounds with child",
            "2. Show them how to layer sounds with beatboxing",
            "3. Let them create a nature-inspired rhythm",
            "4. Help them understand sound mixing and rhythm",
            "5. Perform their nature beatbox creation"
        ],
        94: [  # Genre Remix Project
            "1. Choose a familiar melody with child",
            "2. Show them how to transform it into different genres",
            "3. Let them experiment with various musical styles",
            "4. Help them understand musical genres and remixing",
            "5. Share their genre remix creations"
        ],
        95: [  # Rhyming Rap Story
            "1. Help child write a story that rhymes",
            "2. Show them how to perform it as a rap",
            "3. Let them practice rhythm and flow",
            "4. Help them understand poetry and music",
            "5. Perform their rhyming rap story"
        ],
        96: [  # Recycled Sculpture Build
            "1. Collect recycled materials for sculpture",
            "2. Show child how to create 3D art from waste",
            "3. Let them build their own recycled sculpture",
            "4. Help them understand sustainability and art",
            "5. Display their recycled art sculpture"
        ],
        97: [  # Clay Emotion Masks
            "1. Give child clay to sculpt emotion masks",
            "2. Show them how to express different emotions",
            "3. Let them create masks showing various feelings",
            "4. Help them understand emotions and expression",
            "5. Use masks for emotion recognition games"
        ],
        98: [  # 3D Food Art
            "1. Give child clay to create pretend food",
            "2. Show them how to sculpt realistic food items",
            "3. Let them create a 3D food art collection",
            "4. Help them understand sculpture and food",
            "5. Display their 3D food art gallery"
        ],
        99: [  # Architecture from Imagination
            "1. Give child building materials for imaginary structures",
            "2. Show them how to design buildings from their imagination",
            "3. Let them create fantastical architectural designs",
            "4. Help them understand architecture and creativity",
            "5. Present their imaginary building designs"
        ],
        100: [  # Miniature Stage Set
            "1. Help child build a tiny stage with props",
            "2. Show them how to create miniature scenes",
            "3. Let them design sets for different stories",
            "4. Help them understand theater and design",
            "5. Use their stage set for miniature performances"
        ],
        101: [  # Street Theatre Performance
            "1. Help child create a short play about social issues",
            "2. Show them how to rehearse and perform",
            "3. Let them express their views through theater",
            "4. Help them understand social awareness and art",
            "5. Perform their street theater piece"
        ],
        102: [  # Costume Design Studio
            "1. Give child materials to design costumes",
            "2. Show them how to create outfits for characters",
            "3. Let them design and make costumes",
            "4. Help them understand fashion and character design",
            "5. Have a costume fashion show"
        ],
        103: [  # Spoken Word Slam
            "1. Help child write original poetry",
            "2. Show them how to perform spoken word",
            "3. Let them express their thoughts through poetry",
            "4. Help them understand language and performance",
            "5. Host a spoken word performance"
        ],
        104: [  # Stage Lighting Design
            "1. Show child how lighting affects mood and atmosphere",
            "2. Help them experiment with different lighting setups",
            "3. Let them design lighting for different scenes",
            "4. Help them understand theater technology",
            "5. Use their lighting design for performances"
        ],
        105: [  # Set Design Blueprint
            "1. Help child create blueprints for theater sets",
            "2. Show them how to plan and design spaces",
            "3. Let them create detailed set designs",
            "4. Help them understand architecture and theater",
            "5. Use their blueprints to build actual sets"
        ],
        106: [  # Digital Comic Strip
            "1. Show child digital tools for creating comics",
            "2. Help them design characters and storylines",
            "3. Let them create their own digital comic",
            "4. Help them understand digital art and storytelling",
            "5. Share their digital comic online"
        ],
        107: [  # Self-Portrait Remix
            "1. Help child create digital self-portraits",
            "2. Show them how to use creative filters and effects",
            "3. Let them experiment with different artistic styles",
            "4. Help them understand digital art and identity",
            "5. Display their digital self-portrait gallery"
        ],
        108: [  # Fantasy World Map
            "1. Help child design a map of an imaginary world",
            "2. Show them how to create geography and landmarks",
            "3. Let them build a complete fantasy world",
            "4. Help them understand geography and world-building",
            "5. Use their map for fantasy storytelling"
        ],
        109: [  # Memes with Meaning
            "1. Help child create meaningful, funny memes",
            "2. Show them how to combine humor with important messages",
            "3. Let them design memes about school and life issues",
            "4. Help them understand digital communication and humor",
            "5. Share their meaningful memes responsibly"
        ],
        110: [  # Social Change Poster
            "1. Help child choose a social or environmental issue",
            "2. Show them how to create impactful poster designs",
            "3. Let them express their views through art",
            "4. Help them understand civic engagement and design",
            "5. Display their social change posters"
        ],
        111: [  # Recycled Gadget Challenge
            "1. Give child scrap materials to build useful gadgets",
            "2. Show them how to create functional inventions",
            "3. Let them design and build recycled gadgets",
            "4. Help them understand engineering and sustainability",
            "5. Test and use their recycled gadget inventions"
        ],
        112: [  # Paper Circuit Cards
            "1. Show child how to create circuits with copper tape",
            "2. Help them make greeting cards with LED lights",
            "3. Let them design interactive paper electronics",
            "4. Help them understand basic electronics and art",
            "5. Send their light-up cards to friends"
        ],
        113: [  # Rubber Band-Powered Machine
            "1. Help child build machines powered by rubber bands",
            "2. Show them how to use tension for movement",
            "3. Let them create their own rubber band machines",
            "4. Help them understand physics and mechanics",
            "5. Test their rubber band-powered inventions"
        ],
        114: [  # Smartphone Tripod Hack
            "1. Help child create a smartphone tripod from household items",
            "2. Show them how to stabilize their phone for videos",
            "3. Let them design and build their own tripod",
            "4. Help them understand photography and engineering",
            "5. Use their tripod for video creation"
        ],
        115: [  # Chain Reaction Machine
            "1. Help child design a Rube Goldberg machine",
            "2. Show them how to create cause-and-effect sequences",
            "3. Let them build their own chain reaction machine",
            "4. Help them understand physics and engineering",
            "5. Film their chain reaction machine in action"
        ],
        116: [  # T-Shirt Upcycle Project
            "1. Give child old T-shirts to redesign",
            "2. Show them how to transform clothes into something new",
            "3. Let them create their own upcycled fashion",
            "4. Help them understand sustainable design",
            "5. Wear their upcycled T-shirt creations"
        ],
        117: [  # Mood Board for a Collection
            "1. Help child create a mood board for a clothing line",
            "2. Show them how to express themes through visuals",
            "3. Let them design their own fashion collection",
            "4. Help them understand fashion design and branding",
            "5. Present their fashion mood board"
        ],
        118: [  # Fabric Painting Lab
            "1. Give child fabric and paint for wearable art",
            "2. Show them how to paint designs on clothes",
            "3. Let them create their own painted fashion",
            "4. Help them understand textile art and DIY fashion",
            "5. Wear their painted fabric creations"
        ],
        119: [  # Cultural Fusion Outfit Sketch
            "1. Help child research different cultural clothing styles",
            "2. Show them how to combine elements from different cultures",
            "3. Let them design fusion outfits that celebrate diversity",
            "4. Help them understand cultural awareness and design",
            "5. Present their cultural fusion fashion designs"
        ],
        120: [  # DIY Fashion Photoshoot
            "1. Help child plan a themed fashion photoshoot",
            "2. Show them how to style, pose, and photograph",
            "3. Let them execute their own fashion photoshoot",
            "4. Help them understand photography and fashion",
            "5. Create a fashion portfolio from their photos"
        ]
    }
    
    try:
        # Use the proper service account
        scope = [
            'https://spreadsheets.google.com/feeds',
            'https://www.googleapis.com/auth/spreadsheets',
            'https://www.googleapis.com/auth/drive',
            'https://www.googleapis.com/auth/drive.file'
        ]
        creds = service_account.Credentials.from_service_account_file(CREDS_FILE, scopes=scope)
        client = gspread.authorize(creds)
        print("✅ Authenticated with Sheets Uploader service account")
        
        # Get all sheets
        all_sheets = client.list_spreadsheet_files()
        print(f"📋 Found {len(all_sheets)} sheets")
        
        # Find your files
        target_files = []
        for sheet in all_sheets:
            print(f"Available sheet: {sheet}")
            # Try different ways to get the title
            title = ""
            if 'title' in sheet:
                title = sheet['title'].lower()
            elif 'name' in sheet:
                title = sheet['name'].lower()
            elif 'title' in sheet.get('properties', {}):
                title = sheet['properties']['title'].lower()
            
            if title and ('sample 1' in title or 'sample 2' in title or 'sample one' in title or 'sample two' in title):
                target_files.append(sheet)
                print(f"✅ Found: {title}")
        
        if not target_files:
            print("❌ No Sample One or Sample Two found")
            return False
        
        # Open the first target file
        target_sheet = target_files[0]
        sheet_name = target_sheet.get('name', target_sheet.get('title', 'Unknown'))
        print(f"\n📤 Working with: {sheet_name}")
        
        # Open sheet
        spreadsheet = client.open_by_key(target_sheet['id'])
        
        # Get the main worksheet (first one)
        worksheet = spreadsheet.get_worksheet(0)
        
        # Get all data
        all_data = worksheet.get_all_values()
        if not all_data:
            print("❌ No data found in the worksheet")
            return False
        
        # Get headers
        headers = all_data[0]
        print(f"📋 Found {len(headers)} columns in Google Sheets")
        
        # Find Steps column
        steps_col = None
        topic_col = None
        activity_name_col = None
        
        for i, header in enumerate(headers):
            if header == "Steps":
                steps_col = i
            elif header == "Topic":
                topic_col = i
            elif header == "Activity Name":
                activity_name_col = i
        
        if steps_col is None:
            print("❌ Steps column not found")
            return False
        
        print(f"📝 Found Steps column at index {steps_col}")
        
        # Fix generic steps for activities 71-120
        activities_fixed = 0
        
        for activity_num, specific_steps in activity_specific_steps.items():
            print(f"\n🔧 Fixing Activity {activity_num}...")
            
            # Get the row number (activity_num + 1, since row 1 is headers)
            row_num = activity_num + 1
            
            # Get current data
            current_row = all_data[row_num - 1] if row_num - 1 < len(all_data) else []
            
            if not current_row:
                print(f"   ⚠️ Activity {activity_num}: No data found, skipping")
                continue
            
            # Get current values
            current_topic = current_row[topic_col] if topic_col < len(current_row) else ""
            current_activity_name = current_row[activity_name_col] if activity_name_col < len(current_row) else ""
            
            # Create new steps
            new_steps = '; '.join(specific_steps)
            
            # Update the steps
            cell = worksheet.cell(row_num, steps_col + 1)
            cell.value = new_steps
            worksheet.update_cells([cell])
            
            print(f"   ✅ Activity {activity_num}: {current_topic}")
            print(f"      Activity Name: {current_activity_name}")
            print(f"      New Steps: {len(specific_steps)} activity-specific steps")
            print(f"      Steps: {new_steps[:100]}...")
            
            activities_fixed += 1
            
            # Wait to avoid rate limits
            time.sleep(1)
        
        # Summary
        print(f"\n🎉 All Remaining Duplicates Fixed!")
        print("=" * 50)
        print(f"   Activities Fixed: {activities_fixed}")
        print(f"   Activities Processed: {list(activity_specific_steps.keys())}")
        
        print(f"\n📝 Improvements Made:")
        print("=" * 30)
        print("   ✅ Activity-specific steps created")
        print("   ✅ Clear, actionable instructions")
        print("   ✅ Age-appropriate guidance")
        print("   ✅ Parent-friendly language")
        print("   ✅ Step-by-step procedures")
        
        print(f"\n🔗 Google Sheets URL: {spreadsheet.url}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error during fix: {e}")
        return False

if __name__ == '__main__':
    result = fix_remaining_50_activities()
    if result:
        print(f"\n✅ SUCCESS! All remaining duplicate steps fixed!")
    else:
        print(f"\n❌ FAILED to fix remaining duplicate steps")
