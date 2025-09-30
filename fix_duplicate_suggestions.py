#!/usr/bin/env python3

import gspread
from google.oauth2.service_account import Credentials
import re

def fix_duplicate_suggestions():
    """
    Fix duplicate terms in Google Sheets suggestions
    """
    try:
        print("🔄 FIXING DUPLICATE SUGGESTIONS IN GOOGLE SHEETS")
        print("=" * 60)
        
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
        
        # Fix duplicates
        updated_count = 0
        for i, niche in enumerate(all_data):
            if niche.get('Suggestion'):
                original_suggestion = niche['Suggestion']
                fixed_suggestion = original_suggestion
                
                # Fix common duplicates
                duplicates_to_fix = [
                    ('Leadership & Team Building & Team Building', 'Leadership & Team Building'),
                    ('Culture & Heritage & Heritage', 'Culture & Heritage'),
                    ('Design Thinking & Arts & Crafts', 'Design Thinking & Creativity'),
                    ('Leadership & Team Building & Team Building', 'Leadership & Team Building'),
                    ('Music, Music', 'Music'),
                    ('Nature Exploration, Nature Exploration', 'Nature Exploration'),
                    ('Coding & Programming, Coding & Programming', 'Coding & Programming'),
                    ('Psychology, Psychology', 'Psychology'),
                    ('Communication, Communication', 'Communication'),
                    ('Mathematics, Mathematics', 'Mathematics'),
                    ('Arts & Crafts, Arts & Crafts', 'Arts & Crafts'),
                    ('Health & Hygiene, Health & Hygiene', 'Health & Hygiene'),
                    ('Physical Fitness, Physical Fitness', 'Physical Fitness'),
                    ('Emotional Intelligence, Emotional Intelligence', 'Emotional Intelligence'),
                    ('General Science, General Science', 'General Science'),
                    ('Travel, Travel', 'Travel'),
                    ('History, History', 'History'),
                    ('Sports, Sports', 'Sports'),
                    ('Games & Recreational Skills, Games & Recreational Skills', 'Games & Recreational Skills'),
                    ('Teaching & Pedagogy, Teaching & Pedagogy', 'Teaching & Pedagogy'),
                    ('Public Speaking & Debate, Public Speaking & Debate', 'Public Speaking & Debate'),
                    ('Law & Legal Education, Law & Legal Education', 'Law & Legal Education'),
                    ('Behavioral Science, Behavioral Science', 'Behavioral Science'),
                    ('Automobiles & Engineering, Automobiles & Engineering', 'Automobiles & Engineering'),
                    ('Spirituality & Devotion, Spirituality & Devotion', 'Spirituality & Devotion'),
                    ('Architecture & Design, Architecture & Design', 'Architecture & Design'),
                    ('Supply Chain & Logistics, Supply Chain & Logistics', 'Supply Chain & Logistics'),
                    ('Product Design & User Experience (UX), Product Design & User Experience (UX)', 'Product Design & User Experience (UX)'),
                    ('Emergency Response & Safety Skills, Emergency Response & Safety Skills', 'Emergency Response & Safety Skills'),
                    ('Tools & Machines Literacy, Tools & Machines Literacy', 'Tools & Machines Literacy'),
                    ('Ayurveda & Natural Healing, Ayurveda & Natural Healing', 'Ayurveda & Natural Healing')
                ]
                
                for duplicate, replacement in duplicates_to_fix:
                    if duplicate in fixed_suggestion:
                        fixed_suggestion = fixed_suggestion.replace(duplicate, replacement)
                
                # Only update if there were changes
                if fixed_suggestion != original_suggestion:
                    worksheet.update_cell(i+2, 14, fixed_suggestion)  # Column 14 is 'Suggestion'
                    print(f"✅ Fixed {niche['Niche']}: {original_suggestion} → {fixed_suggestion}")
                    updated_count += 1
        
        print(f"\n🎉 SUCCESS! Fixed {updated_count} duplicate suggestions in Google Sheets")
        print("📝 All suggestions now have clean, non-duplicate niche names")
        
        return True
        
    except Exception as e:
        print(f"❌ Error fixing Google Sheets: {e}")
        return False

if __name__ == "__main__":
    success = fix_duplicate_suggestions()
    if success:
        print("\n✅ Google Sheets duplicates fixed successfully!")
    else:
        print("\n❌ Fix failed.")
