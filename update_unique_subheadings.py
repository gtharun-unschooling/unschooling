#!/usr/bin/env python3

import gspread
from google.oauth2.service_account import Credentials

def update_unique_subheadings():
    """
    Update all niches with completely unique, diverse sub-headings
    """
    try:
        # Set up credentials
        SCOPES = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive']
        SERVICE_ACCOUNT_FILE = 'google-credentials.json'
        credentials = Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)
        gc = gspread.authorize(credentials)
        
        print("🎨 CREATING UNIQUE, DIVERSE SUB-HEADINGS")
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
            
            # Completely unique sub-headings for each niche
            unique_subheadings = {
                "Dance": "Transform Your Living Room Into a Dance Studio & Discover Your Inner Performer",
                "Music": "Turn Everyday Objects Into Instruments & Create Your Own Musical Universe", 
                "Nature Exploration": "Become a Backyard Detective & Uncover Nature's Hidden Treasures",
                "Travel": "Pack Your Imagination & Explore the World Without Leaving Home",
                "Coding & Programming": "Build Your Own Digital Universe & Watch Your Ideas Come to Life",
                "Civics & Government": "Step Into the Shoes of Leaders & Shape the Future of Your Community",
                "History": "Jump Into Time Machines & Meet the Heroes Who Shaped Our World",
                "Fashion & Styling": "Design Your Signature Look & Express Your Personality Through Style",
                "Arts & Crafts": "Turn Trash Into Treasure & Create Masterpieces From Everyday Materials",
                "Behavioral Science": "Decode the Secret Language of Human Behavior & Become a People Expert",
                "General Science": "Transform Your Kitchen Into a Science Lab & Discover the Magic of Everyday Life"
            }
            
            # Update each niche with unique sub-heading
            for niche_name, new_subheading in unique_subheadings.items():
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
            
            print(f"\n🎉 All sub-headings now have completely unique, diverse language!")
            print("✨ Each one tells a different story and uses different patterns!")
            
            return True
            
        else:
            print("❌ 'Niche Description' worksheet not found")
            return False
        
    except Exception as e:
        print(f"❌ Error updating sheet: {e}")
        return False

if __name__ == "__main__":
    success = update_unique_subheadings()
    if success:
        print("\n🎉 All sub-headings are now completely unique and engaging!")
    else:
        print("\n❌ Failed to update sub-headings.")
