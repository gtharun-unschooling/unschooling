#!/usr/bin/env python3
"""
🚀 Upload using proper service account
"""

import gspread
import pandas as pd
from oauth2client.service_account import ServiceAccountCredentials

def upload_to_sheets():
    """Upload to Google Sheets using proper service account"""
    
    print("🚀 Uploading to Google Sheets")
    print("=" * 40)
    
    # Read CSV and clean data
    df = pd.read_csv('essential-growth-activities-enhanced-20250927_003226.csv')
    df['Feedback'] = ''
    
    # Clean NaN values
    df = df.fillna('')
    
    print(f"📊 Loaded {len(df)} activities")
    
    try:
        # Use the proper service account
        scope = [
            'https://spreadsheets.google.com/feeds',
            'https://www.googleapis.com/auth/spreadsheets',
            'https://www.googleapis.com/auth/drive'
        ]
        
        creds = ServiceAccountCredentials.from_json_keyfile_name('sheets-credentials.json', scope)
        client = gspread.authorize(creds)
        print("✅ Authenticated with Sheets Uploader service account")
        
        # Get all sheets
        all_sheets = client.list_spreadsheet_files()
        print(f"📋 Found {len(all_sheets)} sheets")
        
        # Find your files
        target_files = []
        for sheet in all_sheets:
            print(f"Available sheet: {sheet}")
            # Try different ways to get the title
            title = ""
            if 'title' in sheet:
                title = sheet['title'].lower()
            elif 'name' in sheet:
                title = sheet['name'].lower()
            elif 'title' in sheet.get('properties', {}):
                title = sheet['properties']['title'].lower()
            
            if title and ('sample 1' in title or 'sample 2' in title or 'sample one' in title or 'sample two' in title):
                target_files.append(sheet)
                print(f"✅ Found: {title}")
        
        if not target_files:
            print("❌ No Sample One or Sample Two found")
            print("Available files:")
            for sheet in all_sheets:
                sheet_name = sheet.get('name', sheet.get('title', 'Unknown'))
                print(f"  - {sheet_name}")
            return False
        
        # Upload data
        headers = df.columns.tolist()
        data_rows = df.values.tolist()
        
        for sheet in target_files:
            try:
                sheet_name = sheet.get('name', sheet.get('title', 'Unknown'))
                print(f"\n📤 Uploading to: {sheet_name}")
                
                # Open sheet
                spreadsheet = client.open_by_key(sheet['id'])
                worksheet = spreadsheet.get_worksheet(0)
                
                # Clear and upload
                worksheet.clear()
                worksheet.update([headers] + data_rows)
                
                # Format headers
                worksheet.format('A1:Z1', {
                    'backgroundColor': {'red': 0.26, 'green': 0.52, 'blue': 0.96},
                    'textFormat': {'foregroundColor': {'red': 1, 'green': 1, 'blue': 1}, 'bold': True}
                })
                
                print(f"✅ Successfully uploaded to {sheet_name}")
                print(f"🔗 URL: {spreadsheet.url}")
                
            except Exception as e:
                sheet_name = sheet.get('name', sheet.get('title', 'Unknown'))
                print(f"❌ Error with {sheet_name}: {e}")
        
        print("\n🎉 Upload Complete!")
        return True
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return False

if __name__ == '__main__':
    success = upload_to_sheets()
    
    if success:
        print("\n✅ SUCCESS! Your data is now in your Google Sheets!")
    else:
        print("\n❌ Upload failed")
