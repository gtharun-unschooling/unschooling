#!/usr/bin/env python3
"""
🔧 Fix Remaining Generic Steps
Replace the remaining 20 activities with generic steps with activity-specific instructions
"""

import pandas as pd
import os
from google.oauth2 import service_account
import gspread
from datetime import datetime
import time

def fix_remaining_generic_steps():
    """Replace the remaining 20 activities with generic steps with activity-specific instructions"""
    
    print("🔧 Fixing Remaining Generic Steps (20 Activities)")
    print("=" * 70)
    
    # Configuration
    CREDS_FILE = 'sheets-credentials.json'
    
    # Activity-specific steps for the 20 activities with generic steps
    activity_specific_steps = {
        14: [  # Sound Mat Crawl
            "1. Place the sound mat on a clean, flat surface",
            "2. Show baby how to press different areas to make sounds",
            "3. Let baby explore and crawl over the mat",
            "4. Encourage them to press different sections",
            "5. Celebrate when they discover new sounds"
        ],
        121: [  # High Contrast Card Play
            "1. Hold a high-contrast card 8-12 inches from baby's face",
            "2. Slowly move the card from side to side",
            "3. Watch baby's eyes track the movement",
            "4. Describe what baby is seeing (e.g., 'Look at the stripes!')",
            "5. Try different cards to maintain interest"
        ],
        122: [  # Floating Balloon Discovery
            "1. Inflate a helium balloon and tie it securely",
            "2. Hold the balloon string and let it float above baby",
            "3. Move the balloon slowly up and down",
            "4. Let baby reach for the balloon if they can",
            "5. Watch their eyes track the floating movement"
        ],
        123: [  # Peek-a-Boo Object Game
            "1. Show baby a favorite toy or object",
            "2. Hide the object behind your back or under a cloth",
            "3. Ask 'Where did it go?' with an excited voice",
            "4. Reveal the object and say 'Peek-a-boo!'",
            "5. Repeat the hiding and revealing game"
        ],
        124: [  # Colorful Mobile Watching
            "1. Hang a colorful mobile above baby's crib or play area",
            "2. Gently spin or move the mobile to catch their attention",
            "3. Point out different colors and shapes on the mobile",
            "4. Let baby focus on the moving objects",
            "5. Change the mobile's position occasionally for variety"
        ],
        125: [  # Light and Shadow Exploration
            "1. Turn off the lights and use a flashlight in a dark room",
            "2. Shine the light on different surfaces and objects",
            "3. Move the light slowly to create moving shadows",
            "4. Let baby watch the light patterns on the wall",
            "5. Make shadow puppets with your hands"
        ],
        126: [  # Rattle Shake Response
            "1. Give baby a rattle and show them how to shake it",
            "2. Shake the rattle yourself to demonstrate the sound",
            "3. Help baby hold and shake the rattle",
            "4. Praise them when they make the sound",
            "5. Try different rattles with different sounds"
        ],
        127: [  # Button Press Discovery
            "1. Show baby a toy with buttons that make sounds",
            "2. Press a button and point to the sound it makes",
            "3. Help baby press the button with their finger",
            "4. Celebrate when they press it and make sound",
            "5. Try different buttons to show cause and effect"
        ],
        128: [  # Drop and Retrieve Game
            "1. Give baby a soft ball or toy to hold",
            "2. Show them how to drop it and watch it fall",
            "3. Help them pick it up and drop it again",
            "4. Talk about 'up' and 'down' as you play",
            "5. Let them experiment with dropping different objects"
        ],
        129: [  # Water Splash Discovery
            "1. Fill a shallow container with a small amount of water",
            "2. Let baby sit safely and splash their hands in the water",
            "3. Show them how splashing creates ripples",
            "4. Talk about the water and how it feels",
            "5. Supervise closely and keep the water level low"
        ],
        130: [  # Musical Instrument Response
            "1. Give baby a simple musical instrument like a bell or shaker",
            "2. Show them how to make sound by shaking or tapping",
            "3. Help them hold and play the instrument",
            "4. Play along with them to create music together",
            "5. Try different instruments to explore various sounds"
        ],
        131: [  # Familiar Face Recognition Game
            "1. Show baby photos of family members and familiar people",
            "2. Point to each face and say their name",
            "3. Let baby look at the photos and touch them",
            "4. Ask 'Who is this?' and wait for their response",
            "5. Repeat with the same photos to build recognition"
        ],
        132: [  # Routine Memory Building
            "1. Follow the same daily routine (feeding, playing, sleeping)",
            "2. Use the same words and phrases for each activity",
            "3. Show baby what comes next in the sequence",
            "4. Let them anticipate what will happen",
            "5. Keep the routine consistent to build memory"
        ],
        133: [  # Hidden Object Memory Game
            "1. Show baby a favorite toy and let them play with it",
            "2. Hide the toy under a blanket or behind something",
            "3. Ask 'Where is your toy?' and help them look",
            "4. Reveal the toy and celebrate when they find it",
            "5. Try hiding it in different places"
        ],
        134: [  # Song and Rhyme Repetition
            "1. Sing the same simple song or nursery rhyme",
            "2. Use hand gestures and movements with the song",
            "3. Repeat the song several times in a row",
            "4. Let baby try to join in with sounds or movements",
            "5. Sing the same songs daily to build familiarity"
        ],
        135: [  # Familiar Object Recognition
            "1. Show baby their favorite toys and objects one by one",
            "2. Let them touch and explore each object",
            "3. Name each object as they play with it",
            "4. Ask them to find a specific object from a group",
            "5. Celebrate when they recognize and choose correctly"
        ],
        136: [  # Obstacle Navigation Challenge
            "1. Create simple obstacles using pillows or soft blocks",
            "2. Show baby how to crawl around or over them",
            "3. Encourage them to navigate the obstacles",
            "4. Help them if they get stuck or frustrated",
            "5. Celebrate when they successfully navigate through"
        ],
        137: [  # Container Opening Challenge
            "1. Give baby containers with easy-to-open lids",
            "2. Show them how to twist or pull the lid off",
            "3. Help them practice opening and closing",
            "4. Put small toys inside for them to discover",
            "5. Let them experiment with different containers"
        ],
        138: [  # Shape Fitting Practice
            "1. Give baby a simple shape sorter with large pieces",
            "2. Show them how to fit shapes into matching holes",
            "3. Help them try to place each shape correctly",
            "4. Celebrate when they get a shape in the right hole",
            "5. Let them experiment with different shapes"
        ],
        139: [  # Stacking and Building Challenge
            "1. Give baby large blocks or cups to stack",
            "2. Show them how to place one block on top of another",
            "3. Help them build a simple tower",
            "4. Let them knock it down and start again",
            "5. Encourage them to try building on their own"
        ],
        140: [  # Choice Making Practice
            "1. Present baby with two different toys or objects",
            "2. Let them look at both options",
            "3. Ask them to choose which one they want",
            "4. Give them the chosen object and play with it",
            "5. Try the same choice game with different objects"
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
        
        # Fix generic steps
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
        print(f"\n🎉 Generic Steps Fixed!")
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
    result = fix_remaining_generic_steps()
    if result:
        print(f"\n✅ SUCCESS! Remaining generic steps fixed with activity-specific instructions!")
    else:
        print(f"\n❌ FAILED to fix remaining generic steps")
