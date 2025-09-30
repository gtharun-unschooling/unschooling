#!/usr/bin/env python3

import gspread
from google.oauth2.service_account import Credentials
import json
import pandas as pd

def read_niche_description_worksheet():
    """
    Read the specific 'Niche Description' worksheet
    """
    try:
        # Set up credentials
        SCOPES = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive']
        SERVICE_ACCOUNT_FILE = 'google-credentials.json'
        credentials = Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)
        gc = gspread.authorize(credentials)
        
        print("🎯 READING 'NICHE DESCRIPTION' WORKSHEET")
        print("="*60)
        
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
            print(f"✅ Found: {niche_ws.title}")
            
            # Get all values
            all_values = niche_ws.get_all_values()
            print(f"📈 Total rows: {len(all_values)}")
            
            if all_values:
                print(f"\n📋 FIRST 10 ROWS:")
                print("-" * 60)
                for i, row in enumerate(all_values[:10]):
                    print(f"Row {i+1}: {row}")
                
                # Save to JSON
                with open('niche_description_worksheet.json', 'w') as f:
                    json.dump(all_values, f, indent=2)
                print(f"\n💾 JSON saved to: niche_description_worksheet.json")
                
                # Try to create DataFrame
                if len(all_values) > 1:
                    try:
                        df = pd.DataFrame(all_values[1:], columns=all_values[0])
                        print(f"\n📊 DATAFRAME ANALYSIS:")
                        print(f"   Rows: {df.shape[0]}")
                        print(f"   Columns: {df.shape[1]}")
                        print(f"   Column names: {list(df.columns)}")
                        
                        # Show sample data
                        print(f"\n📋 SAMPLE DATA (first 5 rows):")
                        print(df.head().to_string())
                        
                        # Save as CSV
                        df.to_csv('niche_description_worksheet.csv', index=False)
                        print(f"\n💾 CSV saved to: niche_description_worksheet.csv")
                        
                        # Analyze the data
                        print(f"\n🔍 DATA ANALYSIS:")
                        print(f"   Total niches: {len(df)}")
                        
                        # Check for specific columns
                        if 'Niche' in df.columns:
                            print(f"   Unique niches: {df['Niche'].nunique()}")
                            print(f"   Niche names: {df['Niche'].unique()[:10]}")  # First 10
                        
                        if 'Hero Tagline' in df.columns:
                            print(f"   Niches with taglines: {df['Hero Tagline'].notna().sum()}")
                        
                        if 'Sub heading' in df.columns:
                            print(f"   Niches with descriptions: {df['Sub heading'].notna().sum()}")
                        
                        return df
                        
                    except Exception as e:
                        print(f"❌ Error creating DataFrame: {e}")
                        return all_values
                else:
                    print("❌ No data rows found")
                    return all_values
            else:
                print("❌ No data found in worksheet")
                return None
        else:
            print("❌ 'Niche Description' worksheet not found")
            return None
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

if __name__ == "__main__":
    data = read_niche_description_worksheet()
    if data is not None:
        print(f"\n🎉 SUCCESS! Retrieved niche description data!")
    else:
        print(f"\n❌ No niche description data found.")
