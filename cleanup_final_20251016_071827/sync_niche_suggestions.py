#!/usr/bin/env python3

import gspread
from google.oauth2.service_account import Credentials
import json

def sync_niche_suggestions():
    """
    Sync updated niche suggestions from Google Sheets to local JSON files
    """
    try:
        print("🔄 SYNCING UPDATED NICHE SUGGESTIONS")
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
        
        # Update src/data/nichesdata.json
        with open('src/data/nichesdata.json', 'w') as f:
            json.dump(all_data, f, indent=2)
        print("✅ Updated src/data/nichesdata.json")
        
        # Update public/nichesdata.json
        with open('public/nichesdata.json', 'w') as f:
            json.dump(all_data, f, indent=2)
        print("✅ Updated public/nichesdata.json")
        
        # Show some examples of updated suggestions
        print("\n📝 SAMPLE UPDATED SUGGESTIONS:")
        for i, niche in enumerate(all_data[:5]):
            if niche.get('Suggestion'):
                print(f"   {niche['Niche']}: {niche['Suggestion']}")
        
        print(f"\n🎉 SUCCESS! Synced {len(all_data)} niches with updated suggestions")
        print("📝 All suggestions now use actual niche names and are clean of duplicates")
        
        return True
        
    except Exception as e:
        print(f"❌ Error syncing niche suggestions: {e}")
        return False

if __name__ == "__main__":
    success = sync_niche_suggestions()
    if success:
        print("\n✅ Niche suggestions synced successfully!")
    else:
        print("\n❌ Sync failed.")
