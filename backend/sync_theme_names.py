#!/usr/bin/env python3
"""
Sync Theme Names from Google Sheets to local JSON
"""

import gspread
from oauth2client.service_account import ServiceAccountCredentials
import json
import os

def sync_theme_names():
    """Download theme names from Google Sheets and save as JSON"""
    
    print("🔐 Authenticating...")
    scope = [
        'https://spreadsheets.google.com/feeds',
        'https://www.googleapis.com/auth/spreadsheets',
        'https://www.googleapis.com/auth/drive'
    ]
    creds = ServiceAccountCredentials.from_json_keyfile_name(
        '../google-sheets-service-account.json', scope
    )
    client = gspread.authorize(creds)
    print("✅ Authenticated\n")
    
    print("=" * 70)
    print("📥 SYNCING THEME NAMES FROM GOOGLE SHEETS")
    print("=" * 70)
    
    # Open sheet
    spreadsheet = client.open("Sample 1")
    worksheet = spreadsheet.worksheet("Theme Names")
    
    # Get all records
    records = worksheet.get_all_records()
    
    print(f"\n📊 Retrieved {len(records)} theme records")
    
    # Organize data
    themes_data = {
        "lastUpdated": "2025-10-12",
        "totalThemes": len(records),
        "themes": []
    }
    
    holistic_count = 0
    hybrid_count = 0
    by_age = {}
    
    for record in records:
        plan_type = record.get('Plan Type', '').strip()
        age_group = record.get('Age Group', '').strip()
        
        # Skip invalid rows
        if not plan_type or not age_group or age_group == 'Age Group':
            continue
        
        theme = {
            "planType": plan_type,
            "sno": record.get('S.No', ''),
            "ageGroup": age_group,
            "themeName": record.get('Theme Name', '').strip(),
            "shortDescription": record.get('Short Description', '').strip(),
            "coreFocusArea": record.get('Core Focus Area', '').strip()
        }
        
        themes_data["themes"].append(theme)
        
        # Track stats
        if plan_type == 'Holistic':
            holistic_count += 1
        elif plan_type == 'Hybrid':
            hybrid_count += 1
        
        if age_group not in by_age:
            by_age[age_group] = {'holistic': 0, 'hybrid': 0}
        
        if plan_type == 'Holistic':
            by_age[age_group]['holistic'] += 1
        elif plan_type == 'Hybrid':
            by_age[age_group]['hybrid'] += 1
    
    # Add statistics
    themes_data["statistics"] = {
        "totalHolistic": holistic_count,
        "totalHybrid": hybrid_count,
        "byAgeGroup": by_age
    }
    
    print(f"\n📊 Statistics:")
    print(f"   • Total themes: {len(themes_data['themes'])}")
    print(f"   • Holistic: {holistic_count}")
    print(f"   • Hybrid: {hybrid_count}")
    print(f"\n   By Age Group:")
    for age in sorted(by_age.keys()):
        print(f"      {age}:")
        print(f"         Holistic: {by_age[age]['holistic']}")
        print(f"         Hybrid: {by_age[age]['hybrid']}")
    
    # Save to local file
    output_dir = "data"
    os.makedirs(output_dir, exist_ok=True)
    output_file = os.path.join(output_dir, "theme_names.json")
    
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(themes_data, f, indent=2, ensure_ascii=False)
    
    print(f"\n✅ Saved to: {output_file}")
    print(f"   File size: {os.path.getsize(output_file) / 1024:.2f} KB")
    
    # Show sample
    print(f"\n📋 Sample themes (first 3):")
    for i, theme in enumerate(themes_data["themes"][:3], 1):
        print(f"   {i}. [{theme['planType']}] {theme['themeName']} ({theme['ageGroup']})")
    
    print("\n" + "=" * 70)
    print("✅ THEME NAMES SYNCED TO LOCAL!")
    print("=" * 70)
    
    return output_file

if __name__ == '__main__':
    sync_theme_names()




