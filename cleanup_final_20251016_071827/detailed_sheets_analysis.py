#!/usr/bin/env python3
"""
Detailed Google Sheets Analysis
"""

import gspread
import json

def analyze_all_worksheets():
    print("🔍 Detailed Analysis of Your Google Sheets...")
    
    try:
        gc = gspread.service_account(filename='google-sheets-service-account.json')
        print("✅ Service account authentication successful!")
        
        # Get the main spreadsheet
        sheet = gc.open_by_key('14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ')
        print(f"\n📋 Analyzing: {sheet.title}")
        
        worksheets = sheet.worksheets()
        print(f"📊 Found {len(worksheets)} worksheets:")
        
        for i, worksheet in enumerate(worksheets, 1):
            print(f"\n{i}. 📄 {worksheet.title}")
            
            try:
                # Get all records
                records = worksheet.get_all_records()
                print(f"   📊 Records: {len(records)}")
                
                if records:
                    # Show columns
                    columns = list(records[0].keys())
                    print(f"   📋 Columns ({len(columns)}): {columns[:5]}{'...' if len(columns) > 5 else ''}")
                    
                    # Show sample data
                    sample = records[0]
                    print(f"   📝 Sample data keys: {list(sample.keys())[:10]}")
                    
                    # Show first few values
                    print(f"   🔍 First values:")
                    for key, value in list(sample.items())[:5]:
                        if value:  # Only show non-empty values
                            print(f"      {key}: {str(value)[:50]}{'...' if len(str(value)) > 50 else ''}")
                
                else:
                    print("   ❌ No records found")
                    
            except Exception as e:
                print(f"   ❌ Error reading worksheet: {e}")
        
        return sheet, worksheets
        
    except Exception as e:
        print(f"❌ Error: {e}")
        return None, []

def get_worksheet_data(sheet, worksheet_name):
    """Get data from a specific worksheet"""
    try:
        worksheet = sheet.worksheet(worksheet_name)
        data = worksheet.get_all_records()
        print(f"\n📊 {worksheet_name} - {len(data)} records")
        
        if data:
            # Show sample
            print(f"📋 Columns: {list(data[0].keys())}")
            print(f"📝 Sample record: {data[0]}")
        
        return data
        
    except Exception as e:
        print(f"❌ Error reading {worksheet_name}: {e}")
        return []

if __name__ == "__main__":
    sheet, worksheets = analyze_all_worksheets()
    
    if sheet:
        print(f"\n🎯 Available worksheets:")
        for i, ws in enumerate(worksheets, 1):
            print(f"{i}. {ws.title}")
        
        # Ask which worksheet to analyze in detail
        print(f"\n🔍 Which worksheet would you like to see in detail?")
        for i, ws in enumerate(worksheets, 1):
            print(f"{i}. {ws.title}")
        
        # For now, let's analyze the main ones
        print(f"\n📊 Analyzing key worksheets:")
        
        # Essential Growth Activities
        essential_data = get_worksheet_data(sheet, "Essential Growth Activities")
        
        # Niche Topics
        niche_data = get_worksheet_data(sheet, "Niche Topics")
        
        # Metadata
        metadata = get_worksheet_data(sheet, "Metadata")
        
        print(f"\n✅ Analysis complete!")
