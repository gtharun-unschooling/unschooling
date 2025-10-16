#!/usr/bin/env python3

import gspread
from google.oauth2.service_account import Credentials
import pandas as pd

def update_google_sheets_suggestions():
    """
    Update Google Sheets with mapped suggestion terms
    """
    try:
        print("🔄 UPDATING GOOGLE SHEETS SUGGESTIONS")
        print("=" * 50)
        
        # Set up credentials
        scope = [
            "https://www.googleapis.com/auth/spreadsheets",
            "https://www.googleapis.com/auth/drive"
        ]
        
        creds = Credentials.from_service_account_file('sheets-credentials.json', scopes=scope)
        client = gspread.authorize(creds)
        
        # Open the spreadsheet
        spreadsheet = client.open("Sample 1")
        worksheet = spreadsheet.worksheet("Niche Description")
        
        print("✅ Connected to Google Sheets")
        
        # Get all data
        all_data = worksheet.get_all_records()
        print(f"📊 Found {len(all_data)} niches in Google Sheets")
        
        # Mapping dictionary (same as in the React component)
        suggestion_mapping = {
            'Math in Real Life': 'Mathematics',
            'Storytelling': 'Communication',
            'Group Play': 'Games & Recreational Skills',
            'Logic Building': 'Coding & Programming',
            'Digital Literacy': 'Social Media Literacy',
            'Future Careers': 'AI',
            'Creative Thinking': 'Design Thinking & Creativity',
            'Decision-Making': 'Leadership & Team Building',
            'Risk & Reward': 'Trading & Investments',
            'Physical Health': 'Physical Fitness',
            'Creativity': 'Arts & Crafts',
            'Body Awareness': 'Dance',
            'Expression': 'Music',
            'Rhythm': 'Music',
            'Ecology': 'Nature Exploration',
            'Observation': 'Nature Exploration',
            'Environmental Empathy': 'Sustainability & Environment',
            'Geography': 'Travel',
            'Culture': 'Culture & Heritage',
            'Curiosity': 'General Science',
            'Logic': 'Coding & Programming',
            'Digital Creation': 'Content Creation',
            'Future Skills': 'AI',
            'Justice': 'Law & Legal Education',
            'Leadership': 'Leadership & Team Building',
            'Critical Thinking': 'Psychology'
        }
        
        # Update suggestions for each niche
        updated_count = 0
        for i, niche in enumerate(all_data):
            if niche.get('Suggestion'):
                original_suggestion = niche['Suggestion']
                updated_suggestion = original_suggestion
                
                # Apply mappings
                for old_term, new_term in suggestion_mapping.items():
                    if old_term in updated_suggestion:
                        updated_suggestion = updated_suggestion.replace(old_term, new_term)
                
                # Only update if there were changes
                if updated_suggestion != original_suggestion:
                    # Update the cell (row i+2 because Google Sheets is 1-indexed and has header)
                    worksheet.update_cell(i+2, 14, updated_suggestion)  # Column 14 is 'Suggestion'
                    print(f"✅ Updated {niche['Niche']}: {original_suggestion} → {updated_suggestion}")
                    updated_count += 1
        
        print(f"\n🎉 SUCCESS! Updated {updated_count} suggestions in Google Sheets")
        print("📝 All suggestions now use actual niche names instead of generic terms")
        
        return True
        
    except Exception as e:
        print(f"❌ Error updating Google Sheets: {e}")
        return False

if __name__ == "__main__":
    success = update_google_sheets_suggestions()
    if success:
        print("\n✅ Google Sheets suggestions updated successfully!")
    else:
        print("\n❌ Update failed.")
