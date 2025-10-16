#!/usr/bin/env python3

import gspread
from google.oauth2.service_account import Credentials

def remove_header_rows():
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
        
        print("🔍 Accessing Sample 1 Google Sheets...")
        
        # Open Sample 1
        sample_1 = gc.open("Sample 1")
        
        # Get EG Activities worksheet
        eg_activities = sample_1.worksheet("EG Activities")
        
        print(f"📊 Reading 'EG Activities' worksheet...")
        
        # Get all values
        all_values = eg_activities.get_all_values()
        
        if not all_values:
            print("❌ No data found!")
            return
        
        # Headers should be in first row only
        headers = all_values[0]
        print(f"\n✅ Valid headers (row 1): {headers[:5]}...")
        
        # Find rows that are duplicate headers
        rows_to_delete = []
        
        for i, row in enumerate(all_values[1:], start=2):  # Start from row 2 (index 1)
            # Check if this row looks like a header row
            # A header row would have column names instead of data
            if len(row) > 0:
                # Check if the first few cells match the header names
                is_header = False
                
                # Check if "Difficulty Level" appears in the difficulty level column (column 3, index 3)
                if len(row) > 3 and row[3] == "Difficulty Level":
                    is_header = True
                
                # Additional check: see if multiple columns match header names
                matches = sum(1 for j, cell in enumerate(row) if j < len(headers) and cell == headers[j])
                if matches >= 3:  # If 3 or more columns match headers, it's likely a header row
                    is_header = True
                
                if is_header:
                    rows_to_delete.append(i)
                    print(f"   🔴 Found duplicate header at row {i}: {row[:5]}...")
        
        if not rows_to_delete:
            print("\n✅ No duplicate header rows found!")
            return
        
        print(f"\n📋 Found {len(rows_to_delete)} duplicate header row(s) to remove:")
        for row_num in rows_to_delete:
            print(f"   - Row {row_num}")
        
        # Delete rows in reverse order (from bottom to top) to maintain row numbers
        print(f"\n🗑️  Removing duplicate header rows...")
        for row_num in reversed(rows_to_delete):
            print(f"   Deleting row {row_num}...")
            eg_activities.delete_rows(row_num)
        
        print(f"\n✅ Successfully removed {len(rows_to_delete)} duplicate header row(s)!")
        
        # Verify the cleanup
        print(f"\n🔍 Verifying cleanup...")
        all_values_after = eg_activities.get_all_values()
        data_rows_after = all_values_after[1:]
        
        print(f"   Rows before cleanup: {len(all_values) - 1}")
        print(f"   Rows after cleanup: {len(data_rows_after)}")
        print(f"   Rows removed: {len(all_values) - 1 - len(data_rows_after)}")
        
        # Check if any "Difficulty Level" values remain in data
        difficulty_issues = []
        for i, row in enumerate(data_rows_after, start=2):
            if len(row) > 3 and row[3] == "Difficulty Level":
                difficulty_issues.append(i)
        
        if difficulty_issues:
            print(f"\n⚠️  Warning: Still found {len(difficulty_issues)} rows with 'Difficulty Level' as value")
        else:
            print(f"\n✅ All duplicate headers successfully removed!")
        
        print(f"\n📊 Final data summary:")
        print(f"   Total data rows: {len(data_rows_after)}")
        print(f"   All rows cleaned: ✅")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    print("=" * 80)
    print("REMOVING DUPLICATE HEADER ROWS FROM EG ACTIVITIES")
    print("=" * 80)
    remove_header_rows()
    print("\n" + "=" * 80)
    print("CLEANUP COMPLETE")
    print("=" * 80)




