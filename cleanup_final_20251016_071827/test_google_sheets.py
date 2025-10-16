#!/usr/bin/env python3
"""
Simple Google Sheets API Test
This script will help you test Google Sheets API access
"""

import gspread
import json
import sys
from google.auth.exceptions import DefaultCredentialsError

def test_google_sheets_access():
    """Test Google Sheets API access"""
    
    print("🔍 Testing Google Sheets API Access...")
    
    try:
        # Method 1: Try OAuth (for interactive use)
        print("\n📱 Method 1: OAuth Authentication")
        print("This will open a browser for authentication...")
        
        gc = gspread.oauth()
        print("✅ OAuth authentication successful!")
        
        # List all your spreadsheets
        print("\n📊 Your Google Sheets:")
        spreadsheets = gc.openall()
        
        if not spreadsheets:
            print("❌ No spreadsheets found or accessible")
            return
        
        for i, sheet in enumerate(spreadsheets, 1):
            print(f"{i}. {sheet.title} (ID: {sheet.id})")
            
            # Show worksheets in this spreadsheet
            try:
                worksheets = sheet.worksheets()
                print(f"   Worksheets: {[w.title for w in worksheets]}")
            except Exception as e:
                print(f"   Error accessing worksheets: {e}")
        
        # If you want to access a specific sheet, uncomment and modify:
        # sheet_id = "YOUR_SHEET_ID_HERE"
        # sheet = gc.open_by_key(sheet_id)
        # worksheet = sheet.sheet1  # or sheet.worksheet("Sheet Name")
        # data = worksheet.get_all_records()
        # print(f"Sample data: {data[:3]}")
        
    except DefaultCredentialsError:
        print("❌ No OAuth credentials found")
        print("\n📋 To set up OAuth:")
        print("1. Run: gspread-oauth")
        print("2. Or use service account method below")
        
    except Exception as e:
        print(f"❌ OAuth failed: {e}")
    
    # Method 2: Service Account (if you have the key file)
    print("\n🔑 Method 2: Service Account Authentication")
    print("Looking for service account key file...")
    
    try:
        # Look for common service account key file names
        key_files = [
            "google-sheets-service-account.json",
            "service-account-key.json", 
            "credentials.json",
            "gcp-credentials.json"
        ]
        
        key_file_found = None
        for key_file in key_files:
            try:
                gc = gspread.service_account(filename=key_file)
                key_file_found = key_file
                print(f"✅ Service account authentication successful with {key_file}!")
                break
            except FileNotFoundError:
                continue
        
        if not key_file_found:
            print("❌ No service account key file found")
            print("\n📋 To set up service account:")
            print("1. Go to Google Cloud Console")
            print("2. Create service account")
            print("3. Download JSON key file")
            print("4. Save as 'google-sheets-service-account.json'")
            return
        
        # List spreadsheets accessible by service account
        print("\n📊 Spreadsheets accessible by service account:")
        spreadsheets = gc.openall()
        
        if not spreadsheets:
            print("❌ No spreadsheets accessible by service account")
            print("💡 Make sure to share your sheets with the service account email")
            return
        
        for i, sheet in enumerate(spreadsheets, 1):
            print(f"{i}. {sheet.title} (ID: {sheet.id})")
            
            # Show worksheets
            try:
                worksheets = sheet.worksheets()
                print(f"   Worksheets: {[w.title for w in worksheets]}")
                
                # Show sample data from first worksheet
                if worksheets:
                    sample_data = worksheets[0].get_all_records()[:3]
                    print(f"   Sample data (first 3 rows): {sample_data}")
                    
            except Exception as e:
                print(f"   Error accessing worksheets: {e}")
    
    except Exception as e:
        print(f"❌ Service account authentication failed: {e}")

def interactive_sheet_access():
    """Interactive method to access specific sheet"""
    
    print("\n🎯 Interactive Sheet Access")
    
    try:
        # Try OAuth first
        gc = gspread.oauth()
        
        # Get sheet ID from user
        sheet_id = input("\n📝 Enter your Google Sheet ID (from the URL): ").strip()
        
        if not sheet_id:
            print("❌ No sheet ID provided")
            return
        
        # Open the sheet
        sheet = gc.open_by_key(sheet_id)
        print(f"✅ Opened sheet: {sheet.title}")
        
        # List worksheets
        worksheets = sheet.worksheets()
        print(f"\n📋 Available worksheets:")
        for i, ws in enumerate(worksheets, 1):
            print(f"{i}. {ws.title}")
        
        # Get worksheet choice
        try:
            ws_choice = int(input("\n🎯 Choose worksheet number: ")) - 1
            if 0 <= ws_choice < len(worksheets):
                worksheet = worksheets[ws_choice]
                print(f"✅ Selected: {worksheet.title}")
                
                # Get data
                data = worksheet.get_all_records()
                print(f"\n📊 Found {len(data)} rows of data")
                
                if data:
                    print("\n📋 Sample data (first 3 rows):")
                    for i, row in enumerate(data[:3], 1):
                        print(f"Row {i}: {row}")
                    
                    # Save to file
                    save_choice = input("\n💾 Save data to JSON file? (y/n): ").lower()
                    if save_choice == 'y':
                        filename = f"sheet_data_{sheet_id}.json"
                        with open(filename, 'w') as f:
                            json.dump(data, f, indent=2)
                        print(f"✅ Data saved to {filename}")
                
            else:
                print("❌ Invalid worksheet choice")
                
        except ValueError:
            print("❌ Please enter a valid number")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    print("🚀 Google Sheets API Test Tool")
    print("=" * 50)
    
    # Test basic access
    test_google_sheets_access()
    
    # Ask if user wants interactive access
    choice = input("\n🎯 Want to access a specific sheet interactively? (y/n): ").lower()
    if choice == 'y':
        interactive_sheet_access()
    
    print("\n✅ Test completed!")
