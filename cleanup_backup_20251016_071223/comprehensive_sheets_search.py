#!/usr/bin/env python3

import gspread
from google.oauth2.service_account import Credentials
import json
import pandas as pd

def comprehensive_sheets_search():
    """
    Comprehensive search through all Google Sheets for niche descriptions
    """
    try:
        # Set up credentials
        SCOPES = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive']
        SERVICE_ACCOUNT_FILE = 'google-credentials.json'
        credentials = Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)
        gc = gspread.authorize(credentials)
        
        print("🔍 COMPREHENSIVE GOOGLE SHEETS SEARCH")
        print("="*60)
        
        # List ALL spreadsheets
        spreadsheets = gc.list_spreadsheet_files()
        print(f"📊 Found {len(spreadsheets)} total spreadsheets:")
        
        for i, sheet in enumerate(spreadsheets, 1):
            print(f"{i}. {sheet['name']} (ID: {sheet['id']})")
        
        print("\n" + "="*60)
        
        # Search through each spreadsheet
        for sheet_info in spreadsheets:
            print(f"\n🔍 SEARCHING: {sheet_info['name']}")
            print("-" * 40)
            
            try:
                spreadsheet = gc.open_by_key(sheet_info['id'])
                worksheets = spreadsheet.worksheets()
                
                print(f"📋 Worksheets: {[ws.title for ws in worksheets]}")
                
                # Check each worksheet
                for ws in worksheets:
                    print(f"\n  📄 Worksheet: {ws.title}")
                    
                    try:
                        # Get all values
                        all_values = ws.get_all_values()
                        print(f"    📈 Rows: {len(all_values)}")
                        
                        if all_values:
                            # Check for niche-related keywords in the data
                            all_text = ' '.join([' '.join(row) for row in all_values]).lower()
                            
                            # Look for specific niche keywords
                            niche_keywords = [
                                'finance', 'communication', 'ai', 'entrepreneurship', 'dance', 'music',
                                'nature', 'travel', 'coding', 'civics', 'history', 'fashion', 'arts',
                                'science', 'sports', 'design', 'photography', 'trading', 'mathematics',
                                'writing', 'social media', 'education', 'books', 'speaking', 'electronics',
                                'law', 'emotional', 'culture', 'food', 'health', 'biology', 'fitness',
                                'leadership', 'iot', 'automobiles', 'sustainability', 'spirituality',
                                'robotics', 'space', 'energy', 'cybersecurity', 'marine', 'architecture',
                                'psychology', 'filmmaking', 'cryptocurrency', 'agriculture', 'aerospace'
                            ]
                            
                            found_niches = [niche for niche in niche_keywords if niche in all_text]
                            
                            if found_niches:
                                print(f"    🎯 FOUND NICHES: {found_niches}")
                                
                                # Look for description-like content
                                description_keywords = [
                                    'description', 'tagline', 'hero', 'sub heading', 'problems',
                                    'approach', 'steps', 'why kids love', 'color', 'illustration'
                                ]
                                
                                found_descriptions = [desc for desc in description_keywords if desc in all_text]
                                
                                if found_descriptions:
                                    print(f"    📝 FOUND DESCRIPTION FIELDS: {found_descriptions}")
                                    
                                    # Show first few rows
                                    print(f"    📋 First 3 rows:")
                                    for i, row in enumerate(all_values[:3]):
                                        print(f"      Row {i+1}: {row}")
                                    
                                    # Save the data
                                    output_file = f"niche_data_{sheet_info['name'].replace(' ', '_')}_{ws.title.replace(' ', '_')}.json"
                                    with open(output_file, 'w') as f:
                                        json.dump(all_values, f, indent=2)
                                    print(f"    💾 Saved to: {output_file}")
                                    
                                    # Try to create DataFrame
                                    if len(all_values) > 1:
                                        try:
                                            df = pd.DataFrame(all_values[1:], columns=all_values[0])
                                            print(f"    📊 DataFrame: {df.shape[0]} rows, {df.shape[1]} columns")
                                            print(f"    📋 Columns: {list(df.columns)}")
                                            
                                            # Save as CSV
                                            csv_file = f"niche_data_{sheet_info['name'].replace(' ', '_')}_{ws.title.replace(' ', '_')}.csv"
                                            df.to_csv(csv_file, index=False)
                                            print(f"    💾 CSV saved to: {csv_file}")
                                            
                                        except Exception as e:
                                            print(f"    ⚠️ Could not create DataFrame: {e}")
                                    
                                    return all_values
                            
                            # Also check for any worksheet with "niche" or "description" in title
                            if any(keyword in ws.title.lower() for keyword in ['niche', 'description', 'topic', 'subject']):
                                print(f"    🎯 POTENTIAL NICHE WORKSHEET: {ws.title}")
                                
                                # Show first few rows
                                print(f"    📋 First 5 rows:")
                                for i, row in enumerate(all_values[:5]):
                                    print(f"      Row {i+1}: {row}")
                                
                                # Save the data
                                output_file = f"potential_niche_{sheet_info['name'].replace(' ', '_')}_{ws.title.replace(' ', '_')}.json"
                                with open(output_file, 'w') as f:
                                    json.dump(all_values, f, indent=2)
                                print(f"    💾 Saved to: {output_file}")
                        
                        else:
                            print(f"    ❌ No data found")
                            
                    except Exception as e:
                        print(f"    ❌ Error reading worksheet: {e}")
            
            except Exception as e:
                print(f"❌ Error accessing spreadsheet: {e}")
        
        print(f"\n🔍 SEARCH COMPLETE")
        return None
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return None

if __name__ == "__main__":
    comprehensive_sheets_search()
