#!/usr/bin/env python3

import gspread
from google.auth import default
import json

def access_google_sheets():
    try:
        # Use default credentials
        credentials, project = default()
        
        # Create gspread client
        gc = gspread.authorize(credentials)
        
        print("🔍 Searching for Google Sheets...")
        
        # List all spreadsheets
        sheets = gc.openall()
        
        print(f"📊 Found {len(sheets)} Google Sheets:")
        print("=" * 50)
        
        for i, sheet in enumerate(sheets, 1):
            print(f"{i}. {sheet.title}")
            print(f"   ID: {sheet.id}")
            print(f"   URL: {sheet.url}")
            print()
        
        # Look for sheets with "niche" or "description" in the title
        niche_sheets = [sheet for sheet in sheets if 'niche' in sheet.title.lower() or 'description' in sheet.title.lower()]
        
        if niche_sheets:
            print("🎯 Found potential niche-related sheets:")
            print("=" * 50)
            
            for sheet in niche_sheets:
                print(f"📋 Sheet: {sheet.title}")
                print(f"   ID: {sheet.id}")
                print(f"   URL: {sheet.url}")
                
                # Get worksheet names
                worksheets = sheet.worksheets()
                print(f"   Worksheets: {[ws.title for ws in worksheets]}")
                
                # Look for "Niche description" worksheet
                niche_desc_ws = None
                for ws in worksheets:
                    if 'niche' in ws.title.lower() and 'description' in ws.title.lower():
                        niche_desc_ws = ws
                        break
                
                if niche_desc_ws:
                    print(f"   ✅ Found 'Niche description' worksheet: {niche_desc_ws.title}")
                    
                    # Get all values from the worksheet
                    try:
                        all_values = niche_desc_ws.get_all_values()
                        print(f"   📊 Data rows: {len(all_values)}")
                        
                        if all_values:
                            print("   📋 First few rows:")
                            for i, row in enumerate(all_values[:5]):  # Show first 5 rows
                                print(f"      Row {i+1}: {row}")
                        
                        # Save data to JSON file for analysis
                        with open('niche_description_data.json', 'w') as f:
                            json.dump(all_values, f, indent=2)
                        print(f"   💾 Data saved to: niche_description_data.json")
                        
                    except Exception as e:
                        print(f"   ❌ Error reading worksheet data: {e}")
                
                print()
        
        return sheets
        
    except Exception as e:
        print(f"❌ Error accessing Google Sheets: {e}")
        return None

if __name__ == "__main__":
    access_google_sheets()
