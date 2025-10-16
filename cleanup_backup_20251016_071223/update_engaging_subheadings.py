#!/usr/bin/env python3

import gspread
from google.oauth2.service_account import Credentials

def update_engaging_subheadings():
    """
    Update all niches with more engaging, varied sub-headings
    """
    try:
        # Set up credentials
        SCOPES = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive']
        SERVICE_ACCOUNT_FILE = 'google-credentials.json'
        credentials = Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)
        gc = gspread.authorize(credentials)
        
        print("✨ UPDATING ENGAGING SUB-HEADINGS")
        print("=" * 50)
        
        # Get the spreadsheet
        spreadsheet = gc.open_by_key('14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ')
        print(f"📊 Spreadsheet: {spreadsheet.title}")
        
        # Get the 'Niche Description' worksheet
        niche_ws = None
        for ws in spreadsheet.worksheets():
            if 'niche' in ws.title.lower() and 'description' in ws.title.lower():
                niche_ws = ws
                break
        
        if niche_ws:
            print(f"✅ Found worksheet: {niche_ws.title}")
            
            # New engaging sub-headings for each niche
            updated_subheadings = {
                "Dance": "Where Every Move Tells a Story & Every Beat Sparks Joy",
                "Music": "Where Melodies Become Magic & Every Note Builds Confidence", 
                "Nature Exploration": "Where Every Leaf Holds a Secret & Every Bug is a Friend",
                "Travel": "Where Your Living Room Becomes the World & Every Culture is an Adventure",
                "Coding & Programming": "Where Ideas Come to Life & Every Line of Code is Pure Magic",
                "Civics & Government": "Where Kids Become Superheroes of Change & Every Voice Matters",
                "History": "Where the Past Becomes Your Playground & Every Story is an Epic Adventure",
                "Fashion & Styling": "Where Clothes Become Your Canvas & Every Outfit Tells Your Story",
                "Arts & Crafts": "Where Imagination Takes Flight & Every Creation is a Masterpiece",
                "Behavioral Science": "Where Every Person is a Mystery to Solve & Every Interaction is an Adventure",
                "General Science": "Where the World Becomes Your Laboratory & Every Question Leads to Wonder"
            }
            
            # Update each niche with new sub-heading
            for niche_name, new_subheading in updated_subheadings.items():
                print(f"\n📝 Updating {niche_name}...")
                
                # Find the row for this niche
                all_values = niche_ws.get_all_values()
                niche_row = None
                
                for i, row in enumerate(all_values, 1):
                    if len(row) > 1 and row[1] == niche_name:  # Column B is the Niche name
                        niche_row = i
                        break
                
                if niche_row:
                    # Update only the sub-heading (column E)
                    niche_ws.update_cell(niche_row, 5, new_subheading)
                    print(f"✅ {niche_name}: '{new_subheading}'")
                else:
                    print(f"❌ Could not find {niche_name} in the sheet")
            
            print(f"\n🎉 All sub-headings updated with engaging, varied language!")
            print("✨ No more robotic 'through' repetition!")
            
            return True
            
        else:
            print("❌ 'Niche Description' worksheet not found")
            return False
        
    except Exception as e:
        print(f"❌ Error updating sheet: {e}")
        return False

if __name__ == "__main__":
    success = update_engaging_subheadings()
    if success:
        print("\n🎉 All sub-headings now have engaging, varied language!")
    else:
        print("\n❌ Failed to update sub-headings.")
