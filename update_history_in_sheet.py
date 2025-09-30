#!/usr/bin/env python3

import gspread
from google.oauth2.service_account import Credentials

def update_history_in_sheet():
    """
    Update the History niche content in Google Sheets
    """
    try:
        # Set up credentials
        SCOPES = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive']
        SERVICE_ACCOUNT_FILE = 'google-credentials.json'
        credentials = Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)
        gc = gspread.authorize(credentials)
        
        print("📚 UPDATING HISTORY NICHE IN GOOGLE SHEETS")
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
            
            # History niche content
            history_content = [
                "11",  # SNo
                "History",  # Niche
                "history",  # Niche Slug
                "Time Travel Through Stories & Adventures 🏛️⏰",  # Hero Tagline
                "Making History Come Alive Through Interactive Stories and Time-Travel Adventures",  # Sub heading
                "<ul><li>History feels boring and irrelevant to kids</li><li>They can't connect with people from the past</li><li>Dates and facts seem meaningless without context</li></ul>",  # Problems
                "<ul><li>Time-travel storytelling adventures</li><li>Historical character role-playing</li><li>Interactive timeline building</li><li>Mystery-solving through historical clues</li></ul>",  # Approach Steps
                "<ul><li>They become time travelers and detectives</li><li>They discover amazing real stories</li><li>They understand how the past shapes today</li></ul>",  # Why Kids Love This
                "#8B4513",  # Color
                "#A0522D",  # Primary Color
                "#D2B48C",  # Secondary Color
                "#F5F5DC",  # Background Color
                "history-hero.svg",  # Illustration
                "Civics & Government, Culture & Heritage, Travel"  # Suggestion
            ]
            
            # Find the History row (row 12, since row 1 is header)
            history_row = 12
            
            print(f"📝 Updating row {history_row} with History content...")
            
            # Update the row
            niche_ws.update(f'A{history_row}:N{history_row}', [history_content])
            
            print("✅ History niche content updated successfully!")
            print(f"📊 Updated {len(history_content)} columns")
            
            # Verify the update
            print("\n🔍 Verifying update...")
            updated_row = niche_ws.row_values(history_row)
            print(f"Updated row: {updated_row}")
            
            return True
            
        else:
            print("❌ 'Niche Description' worksheet not found")
            return False
        
    except Exception as e:
        print(f"❌ Error updating sheet: {e}")
        return False

if __name__ == "__main__":
    success = update_history_in_sheet()
    if success:
        print("\n🎉 History niche successfully updated in Google Sheets!")
    else:
        print("\n❌ Failed to update History niche in Google Sheets.")
