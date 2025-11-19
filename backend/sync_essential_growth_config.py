#!/usr/bin/env python3
"""
Sync Essential Growth Pillars Config from Google Sheets to local JSON file
"""

import gspread
from oauth2client.service_account import ServiceAccountCredentials
import json
import os
from datetime import datetime

def authenticate_sheets():
    """Authenticate with Google Sheets"""
    print("🔐 Authenticating with Google Sheets...")
    
    scope = [
        'https://spreadsheets.google.com/feeds',
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive'
    ]
    
    creds = ServiceAccountCredentials.from_json_keyfile_name(
        '../google-sheets-service-account.json', scope
    )
    client = gspread.authorize(creds)
    print("✅ Authenticated successfully")
    return client

def get_pillars_config(client):
    """Get pillars config from 'EG Pillars Config' sheet"""
    print("\n📊 Fetching pillars config from 'Sample 1' → 'EG Pillars Config' tab...")
    
    try:
        # Open Sample 1 sheet
        spreadsheet = client.open("Sample 1")
        
        # Get the "EG Pillars Config" worksheet
        worksheet = spreadsheet.worksheet("EG Pillars Config")
        print(f"   ✅ Found 'EG Pillars Config' tab")
        
        # Get all records
        records = worksheet.get_all_records()
        print(f"✅ Retrieved {len(records)} pillars")
        
        return records
        
    except Exception as e:
        print(f"❌ Error fetching pillars config: {e}")
        return []

def convert_to_json_format(pillars):
    """Convert sheet records to JSON format"""
    formatted_pillars = []
    
    for pillar in pillars:
        # Skip empty rows
        if not pillar.get('Pillar Name') or not pillar.get('Slug'):
            continue
            
        formatted_pillar = {
            "id": pillar.get('ID', 0),
            "name": pillar.get('Pillar Name', ''),
            "slug": pillar.get('Slug', ''),
            "tagline": pillar.get('Tagline', ''),
            "description": pillar.get('Description', ''),
            "color": pillar.get('Color', '#667eea'),
            "primaryColor": pillar.get('Primary Color', '#667eea'),
            "secondaryColor": pillar.get('Secondary Color', '#764ba2'),
            "backgroundColor": pillar.get('Background Color', '#f8f4ff'),
            "icon": pillar.get('Icon', 'default-icon.svg'),
            "ageRange": pillar.get('Age Range', '0-18'),
            "totalActivities": pillar.get('Total Activities', 120),
            "keyBenefits": [
                pillar.get('Key Benefit 1', ''),
                pillar.get('Key Benefit 2', ''),
                pillar.get('Key Benefit 3', '')
            ],
            "problemsAddressed": pillar.get('Problems Addressed', ''),
            "approach": pillar.get('Approach', ''),
            "whyKidsLoveIt": pillar.get('Why Kids Love It', '')
        }
        formatted_pillars.append(formatted_pillar)
    
    return formatted_pillars

def save_to_json(pillars):
    """Save pillars config to JSON file"""
    file_path = "data/essential-growth-config.json"
    
    # Create the config structure
    config_data = {
        "pillars": pillars,
        "totalPillars": len(pillars),
        "lastUpdated": datetime.now().isoformat()
    }
    
    # Save to file
    with open(file_path, 'w', encoding='utf-8') as f:
        json.dump(config_data, f, indent=2, ensure_ascii=False)
    
    print(f"✅ Saved {len(pillars)} pillars to {file_path}")

def main():
    """Main sync function"""
    print("=" * 70)
    print("🚀 SYNCING ESSENTIAL GROWTH PILLARS CONFIG FROM GOOGLE SHEETS")
    print("=" * 70)
    
    # Authenticate
    client = authenticate_sheets()
    
    # Get pillars config
    pillars_records = get_pillars_config(client)
    
    if not pillars_records:
        print("\n❌ No pillar data found. Exiting.")
        return
    
    # Convert to JSON format
    print("\n" + "=" * 70)
    print("💾 CONVERTING TO JSON FORMAT")
    print("=" * 70)
    
    pillars_json = convert_to_json_format(pillars_records)
    
    print(f"\n✅ Converted {len(pillars_json)} pillars:")
    for pillar in pillars_json:
        print(f"   • {pillar['name']:30} → {pillar['slug']:25} ({pillar['color']})")
    
    # Save to JSON
    print("\n" + "=" * 70)
    print("💾 SAVING TO JSON FILE")
    print("=" * 70)
    
    save_to_json(pillars_json)
    
    print("\n" + "=" * 70)
    print("✅ SYNC COMPLETE!")
    print("=" * 70)
    print("\n📁 Updated file: backend/data/essential-growth-config.json")
    print("\n🔍 Next steps:")
    print("   1. Review the JSON file")
    print("   2. Update frontend component to load from JSON")
    print("   3. Test locally")
    print("   4. Deploy to staging")
    print()

if __name__ == '__main__':
    main()

