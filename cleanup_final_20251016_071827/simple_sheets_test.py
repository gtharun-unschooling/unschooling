#!/usr/bin/env python3
"""
Simple Google Sheets Test with Service Account
"""

import gspread
import json

def test_service_account():
    print("🔍 Testing Google Sheets with Service Account...")
    
    try:
        # Use the service account key file
        gc = gspread.service_account(filename='google-sheets-service-account.json')
        print("✅ Service account authentication successful!")
        
        # List all accessible spreadsheets
        print("\n📊 Your Google Sheets:")
        spreadsheets = gc.openall()
        
        if not spreadsheets:
            print("❌ No spreadsheets found")
            print("💡 Make sure your Google Sheets are shared with:")
            print("   unschooling-service-account@unschooling-464413.iam.gserviceaccount.com")
            return
        
        for i, sheet in enumerate(spreadsheets, 1):
            print(f"\n{i}. 📋 {sheet.title}")
            print(f"   ID: {sheet.id}")
            
            try:
                worksheets = sheet.worksheets()
                print(f"   Worksheets: {[w.title for w in worksheets]}")
                
                # Show sample data from first worksheet
                if worksheets:
                    worksheet = worksheets[0]
                    data = worksheet.get_all_records()
                    print(f"   Records: {len(data)}")
                    
                    if data:
                        print(f"   Columns: {list(data[0].keys())}")
                        print(f"   Sample row: {data[0]}")
                
            except Exception as e:
                print(f"   Error: {e}")
        
        return spreadsheets
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return []

if __name__ == "__main__":
    spreadsheets = test_service_account()
    
    if spreadsheets:
        print(f"\n✅ Found {len(spreadsheets)} accessible spreadsheets!")
        print("\n🎯 To access a specific sheet, you can use:")
        print("   sheet = gc.open_by_key('SHEET_ID')")
        print("   worksheet = sheet.worksheet('SHEET_NAME')")
        print("   data = worksheet.get_all_records()")
    else:
        print("\n❌ No spreadsheets accessible")
