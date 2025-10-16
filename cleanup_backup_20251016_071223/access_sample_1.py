#!/usr/bin/env python3

import gspread
from google.oauth2.service_account import Credentials
import json

def access_sample_1():
    try:
        # Load service account credentials
        creds = Credentials.from_service_account_file(
            'google-sheets-service-account.json',
            scopes=[
                'https://www.googleapis.com/auth/spreadsheets',
                'https://www.googleapis.com/auth/drive'
            ]
        )
        
        # Create gspread client
        gc = gspread.authorize(creds)
        
        print("🔍 Searching for Google Sheets...")
        
        # List all spreadsheets
        sheets = gc.openall()
        
        print(f"📊 Found {len(sheets)} Google Sheets:")
        print("=" * 70)
        
        # Look for "Sample 1" sheet
        sample_1_sheet = None
        
        for i, sheet in enumerate(sheets, 1):
            sheet_title_lower = sheet.title.lower()
            print(f"{i}. {sheet.title}")
            print(f"   ID: {sheet.id}")
            print(f"   URL: {sheet.url}")
            
            # Check if this is "Sample 1"
            if 'sample 1' in sheet_title_lower or 'sample one' in sheet_title_lower:
                sample_1_sheet = sheet
                print(f"   ✅ THIS IS SAMPLE 1!")
            
            print()
        
        # If we found Sample 1, get details
        if sample_1_sheet:
            print("\n" + "=" * 70)
            print("📋 SAMPLE 1 DETAILS:")
            print("=" * 70)
            print(f"Title: {sample_1_sheet.title}")
            print(f"ID: {sample_1_sheet.id}")
            print(f"URL: {sample_1_sheet.url}")
            print()
            
            # Get all worksheets
            worksheets = sample_1_sheet.worksheets()
            print(f"📑 Number of worksheets: {len(worksheets)}")
            print("\nWorksheets:")
            for i, ws in enumerate(worksheets, 1):
                print(f"  {i}. {ws.title} ({ws.row_count} rows x {ws.col_count} cols)")
            
            # Try to access the first worksheet
            if worksheets:
                print("\n" + "=" * 70)
                print(f"📄 Preview of first worksheet: '{worksheets[0].title}'")
                print("=" * 70)
                
                first_ws = worksheets[0]
                
                # Get first 10 rows
                try:
                    values = first_ws.get_all_values()
                    print(f"\nTotal rows: {len(values)}")
                    
                    if values:
                        # Show headers
                        if len(values) > 0:
                            print("\nHeaders:")
                            print(values[0])
                        
                        # Show first 5 data rows
                        print("\nFirst 5 rows:")
                        for i, row in enumerate(values[1:6], 1):
                            print(f"Row {i}: {row[:5] if len(row) > 5 else row}...")  # Show first 5 columns
                        
                        # Save to JSON
                        output_file = 'sample_1_preview.json'
                        with open(output_file, 'w') as f:
                            json.dump({
                                'title': sample_1_sheet.title,
                                'id': sample_1_sheet.id,
                                'url': sample_1_sheet.url,
                                'worksheets': [ws.title for ws in worksheets],
                                'first_worksheet_data': values[:10]  # First 10 rows
                            }, f, indent=2)
                        
                        print(f"\n💾 Preview saved to: {output_file}")
                        
                except Exception as e:
                    print(f"❌ Error reading worksheet: {e}")
            
            return sample_1_sheet
        else:
            print("❌ 'Sample 1' sheet not found!")
            print("\nAvailable sheets:")
            for sheet in sheets:
                print(f"  - {sheet.title}")
            return None
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return None

if __name__ == "__main__":
    access_sample_1()


