#!/usr/bin/env python3

import gspread
from google.oauth2.service_account import Credentials
import json
import pandas as pd

def read_niche_descriptions():
    """
    Read niche descriptions from Google Sheets
    """
    try:
        # Set up credentials
        SCOPES = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive']
        SERVICE_ACCOUNT_FILE = 'google-credentials.json'
        credentials = Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)
        gc = gspread.authorize(credentials)
        
        print("🔍 Accessing Google Sheets...")
        
        # List all spreadsheets
        spreadsheets = gc.list_spreadsheet_files()
        print(f"📊 Found {len(spreadsheets)} spreadsheets:")
        
        for i, sheet in enumerate(spreadsheets, 1):
            print(f"{i}. {sheet['name']} (ID: {sheet['id']})")
        
        print("\n" + "="*60)
        
        # Look for niche-related spreadsheets
        niche_sheets = []
        for sheet in spreadsheets:
            if any(keyword in sheet['name'].lower() for keyword in ['niche', 'description', 'topic', 'subject']):
                niche_sheets.append(sheet)
        
        if niche_sheets:
            print(f"🎯 Found {len(niche_sheets)} potential niche-related sheets:")
            for sheet in niche_sheets:
                print(f"   - {sheet['name']} (ID: {sheet['id']})")
        else:
            print("❌ No niche-related sheets found by name. Checking all sheets...")
            niche_sheets = spreadsheets
        
        # Check each sheet for "Niche description" worksheet
        for sheet_info in niche_sheets:
            print(f"\n📋 Checking: {sheet_info['name']}")
            try:
                spreadsheet = gc.open_by_key(sheet_info['id'])
                worksheets = spreadsheet.worksheets()
                
                print(f"   Worksheets: {[ws.title for ws in worksheets]}")
                
                # Look for "Niche description" or similar worksheet
                target_worksheet = None
                for ws in worksheets:
                    ws_title_lower = ws.title.lower()
                    if any(keyword in ws_title_lower for keyword in ['niche', 'description', 'topic', 'subject']):
                        target_worksheet = ws
                        print(f"   ✅ Found target worksheet: {ws.title}")
                        break
                
                if target_worksheet:
                    print(f"\n📊 Reading data from: {target_worksheet.title}")
                    
                    # Get all values
                    all_values = target_worksheet.get_all_values()
                    print(f"   📈 Total rows: {len(all_values)}")
                    
                    if all_values:
                        print(f"   📋 First few rows:")
                        for i, row in enumerate(all_values[:10]):  # Show first 10 rows
                            print(f"      Row {i+1}: {row}")
                        
                        # Save to JSON for analysis
                        output_file = f"niche_descriptions_{sheet_info['name'].replace(' ', '_')}.json"
                        with open(output_file, 'w') as f:
                            json.dump(all_values, f, indent=2)
                        print(f"   💾 Data saved to: {output_file}")
                        
                        # Try to convert to DataFrame for better analysis
                        if len(all_values) > 1:
                            try:
                                df = pd.DataFrame(all_values[1:], columns=all_values[0])
                                print(f"   📊 DataFrame created: {df.shape[0]} rows, {df.shape[1]} columns")
                                print(f"   📋 Columns: {list(df.columns)}")
                                
                                # Save as CSV too
                                csv_file = f"niche_descriptions_{sheet_info['name'].replace(' ', '_')}.csv"
                                df.to_csv(csv_file, index=False)
                                print(f"   💾 CSV saved to: {csv_file}")
                                
                            except Exception as e:
                                print(f"   ⚠️ Could not create DataFrame: {e}")
                        
                        return all_values
                    else:
                        print("   ❌ No data found in worksheet")
                else:
                    print("   ❌ No target worksheet found")
                    
            except Exception as e:
                print(f"   ❌ Error accessing sheet: {e}")
        
        return None
        
    except Exception as e:
        print(f"❌ Error accessing Google Sheets: {e}")
        return None

if __name__ == "__main__":
    data = read_niche_descriptions()
    if data:
        print(f"\n🎉 Successfully retrieved {len(data)} rows of niche description data!")
    else:
        print("\n❌ No niche description data found.")
