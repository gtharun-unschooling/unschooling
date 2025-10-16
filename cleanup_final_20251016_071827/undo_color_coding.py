#!/usr/bin/env python3
"""
Undo Color Coding from Google Sheets
Reset all column headers to default formatting
"""

import gspread
from gspread_formatting import *
import json

def undo_color_coding():
    """Remove color coding from Essential Growth Activities sheet"""
    
    print("🔄 Undoing color coding from Google Sheets...")
    
    try:
        # Authenticate with service account
        gc = gspread.service_account(filename='google-sheets-service-account.json')
        sheet = gc.open_by_key('14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ')
        worksheet = sheet.worksheet('Essential Growth Activities')
        
        print("✅ Connected to Google Sheets")
        
        # Get all column headers (row 1)
        headers = worksheet.row_values(1)
        print(f"📊 Found {len(headers)} columns to reset")
        
        # Reset formatting for each column header
        for col_index, header in enumerate(headers, 1):
            # Format the header cell back to default
            cell_range = f'{chr(64 + col_index)}1:{chr(64 + col_index)}1'
            
            format_cell_range(worksheet, cell_range, CellFormat(
                backgroundColor=Color(1, 1, 1),  # White background
                textFormat=TextFormat(bold=False, foregroundColor=Color(0, 0, 0))  # Black text
            ))
            
            print(f"   ✅ Reset: {header} (Column {col_index})")
        
        print("✅ Color coding removed successfully!")
        
    except Exception as e:
        print(f"❌ Error: {e}")

if __name__ == "__main__":
    print("🔄 Undo Color Coding Tool")
    print("=" * 30)
    
    undo_color_coding()
    
    print("\n✅ Color coding undone!")
    print("📋 Your Google Sheets headers are back to default formatting!")
