#!/usr/bin/env python3
"""
🔧 Fix Generic Steps
Replace generic steps with activity-specific instructions
"""

import pandas as pd
import os
from google.oauth2 import service_account
import gspread
from datetime import datetime
import time

def fix_generic_steps():
    """Replace generic steps with activity-specific instructions"""
    
    print("🔧 Fixing Generic Steps with Activity-Specific Instructions")
    print("=" * 70)
    
    # Configuration
    CREDS_FILE = 'sheets-credentials.json'
    
    # Activity-specific steps for each activity
    activity_specific_steps = {
        21: [  # Kitchen Role Play
            "1. Set up toy kitchen utensils on a low table or floor mat",
            "2. Show toddler how to 'stir' with a wooden spoon in a bowl",
            "3. Let them pretend to 'cook' by mixing and stirring",
            "4. Encourage them to 'taste' their imaginary food",
            "5. Ask what they're cooking and join in the pretend play"
        ],
        31: [  # Scribble Freestyle
            "1. Give toddler large crayons and big sheets of paper",
            "2. Show them how to hold the crayon and make marks",
            "3. Let them scribble freely without any rules",
            "4. Comment on their colors and movements",
            "5. Display their artwork proudly when finished"
        ],
        32: [  # Color Tracing Lines
            "1. Draw thick, wavy lines on paper with a dark marker",
            "2. Give toddler a crayon and show them how to trace",
            "3. Guide their hand along the line a few times",
            "4. Let them try tracing on their own",
            "5. Celebrate their tracing attempts and progress"
        ],
        33: [  # Sticker Drawing Fun
            "1. Give toddler stickers and a large piece of paper",
            "2. Show them how to peel and stick stickers",
            "3. Let them place stickers anywhere they want",
            "4. Encourage them to draw around the stickers",
            "5. Talk about their sticker scene and colors"
        ],
        34: [  # Magic Water Drawing
            "1. Fill a shallow tray with water",
            "2. Give toddler a paintbrush and show them how to 'paint' with water",
            "3. Let them make water marks on the tray",
            "4. Show them how the water disappears (evaporates)",
            "5. Let them experiment with different brush strokes"
        ],
        35: [  # Rainbow Scribbles
            "1. Set out multiple colored crayons",
            "2. Show toddler how to hold and use each color",
            "3. Let them scribble with different colors",
            "4. Name the colors as they use them",
            "5. Encourage them to mix and layer colors"
        ],
        36: [  # Drumbeat Dance
            "1. Play simple drum beats or clap rhythms",
            "2. Show toddler how to clap along to the beat",
            "3. Let them move their body to the rhythm",
            "4. Encourage them to make their own sounds",
            "5. Dance together and have fun with the music"
        ],
        37: [  # Sound Matching Game
            "1. Play two different instrument sounds",
            "2. Show toddler how to listen carefully",
            "3. Play the sounds again and ask which is which",
            "4. Let them point to or name the instruments",
            "5. Celebrate when they get it right"
        ],
        38: [  # Kitchen Band Jam
            "1. Gather pots, pans, and wooden spoons",
            "2. Show toddler how to tap and make sounds",
            "3. Let them experiment with different 'instruments'",
            "4. Play along and create a rhythm together",
            "5. Have a fun jam session with household items"
        ],
        39: [  # Musical Parade
            "1. Give toddler simple instruments or noise makers",
            "2. Start marching around the room",
            "3. Let them follow and play their instruments",
            "4. March to different rooms in the house",
            "5. End the parade with a big finish"
        ],
        40: [  # Name That Instrument
            "1. Play different instrument sounds one at a time",
            "2. Show toddler the instrument making the sound",
            "3. Play the sound again and ask what it is",
            "4. Let them try to name or point to the instrument",
            "5. Celebrate their correct answers"
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
    result = fix_generic_steps()
    if result:
        print(f"\n✅ SUCCESS! Generic steps fixed with activity-specific instructions!")
    else:
        print(f"\n❌ FAILED to fix generic steps")
