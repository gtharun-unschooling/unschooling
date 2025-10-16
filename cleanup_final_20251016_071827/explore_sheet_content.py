#!/usr/bin/env python3

import gspread
from google.oauth2.service_account import Credentials
import json
import pandas as pd

def explore_sheet_content():
    """
    Explore the content of the available Google Sheet
    """
    try:
        # Set up credentials
        SCOPES = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive']
        SERVICE_ACCOUNT_FILE = 'google-credentials.json'
        credentials = Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)
        gc = gspread.authorize(credentials)
        
        print("🔍 Exploring Google Sheet content...")
        
        # Get the spreadsheet
        spreadsheet = gc.open_by_key('14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ')
        print(f"📊 Spreadsheet: {spreadsheet.title}")
        
        worksheets = spreadsheet.worksheets()
        print(f"📋 Worksheets: {[ws.title for ws in worksheets]}")
        
        # Explore each worksheet
        for ws in worksheets:
            print(f"\n{'='*60}")
            print(f"📋 Worksheet: {ws.title}")
            print(f"{'='*60}")
            
            try:
                # Get all values
                all_values = ws.get_all_values()
                print(f"📈 Total rows: {len(all_values)}")
                
                if all_values:
                    print(f"📋 First 5 rows:")
                    for i, row in enumerate(all_values[:5]):
                        print(f"   Row {i+1}: {row}")
                    
                    # Check if this looks like niche data
                    first_row = all_values[0] if all_values else []
                    niche_keywords = ['niche', 'topic', 'subject', 'description', 'title', 'name']
                    
                    if any(keyword in str(first_row).lower() for keyword in niche_keywords):
                        print(f"   🎯 This looks like niche-related data!")
                        
                        # Save the data
                        output_file = f"sheet_data_{ws.title.replace(' ', '_')}.json"
                        with open(output_file, 'w') as f:
                            json.dump(all_values, f, indent=2)
                        print(f"   💾 Data saved to: {output_file}")
                        
                        # Try to create DataFrame
                        if len(all_values) > 1:
                            try:
                                df = pd.DataFrame(all_values[1:], columns=all_values[0])
                                print(f"   📊 DataFrame: {df.shape[0]} rows, {df.shape[1]} columns")
                                print(f"   📋 Columns: {list(df.columns)}")
                                
                                # Show sample data
                                print(f"   📋 Sample data:")
                                print(df.head().to_string())
                                
                                # Save as CSV
                                csv_file = f"sheet_data_{ws.title.replace(' ', '_')}.csv"
                                df.to_csv(csv_file, index=False)
                                print(f"   💾 CSV saved to: {csv_file}")
                                
                            except Exception as e:
                                print(f"   ⚠️ Could not create DataFrame: {e}")
                    
                    # Check for specific niche-related content
                    all_text = ' '.join([' '.join(row) for row in all_values]).lower()
                    if any(keyword in all_text for keyword in ['finance', 'communication', 'ai', 'entrepreneurship', 'dance', 'music']):
                        print(f"   🎯 Found niche-related content!")
                        
                        # Look for specific niches
                        found_niches = []
                        niche_list = ['finance', 'communication', 'ai', 'entrepreneurship', 'dance', 'music', 'nature', 'travel', 'coding', 'civics']
                        for niche in niche_list:
                            if niche in all_text:
                                found_niches.append(niche)
                        
                        if found_niches:
                            print(f"   🎯 Found niches: {found_niches}")
                
                else:
                    print("   ❌ No data found")
                    
            except Exception as e:
                print(f"   ❌ Error reading worksheet: {e}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == "__main__":
    explore_sheet_content()
