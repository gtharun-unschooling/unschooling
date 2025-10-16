#!/usr/bin/env python3

import gspread
from google.oauth2.service_account import Credentials

def format_materials_column():
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
        
        # Find Materials column index
        headers = all_values[0]
        
        if 'Materials' not in headers:
            print("❌ 'Materials' column not found!")
            return
        
        materials_col_idx = headers.index('Materials')
        materials_col_letter = chr(65 + materials_col_idx)  # Convert to letter (A, B, C, etc.)
        
        print(f"✅ Found 'Materials' column at index {materials_col_idx} (Column {materials_col_letter})")
        
        # Process each row
        updates = []
        rows_updated = 0
        
        print(f"\n📝 Processing materials formatting...")
        
        for i, row in enumerate(all_values[1:], start=2):  # Start from row 2 (skip header)
            if materials_col_idx < len(row):
                current_material = row[materials_col_idx]
                
                if current_material and '•' in current_material:
                    # Show before state
                    print(f"\n   Row {i} BEFORE:")
                    print(f"   {current_material}")
                    
                    # Add newline before each bullet point (except if it's already at the start)
                    # Replace '•' with '\n•' but handle the first one
                    formatted_material = current_material.strip()
                    
                    # Split by bullet points and rejoin with newlines
                    parts = formatted_material.split('•')
                    # Filter out empty parts and strip whitespace
                    parts = [part.strip() for part in parts if part.strip()]
                    
                    # Rejoin with bullet points and newlines
                    formatted_material = '\n'.join([f'• {part}' for part in parts])
                    
                    # Show after state
                    print(f"   Row {i} AFTER:")
                    print(f"   {formatted_material}")
                    
                    # Prepare update
                    cell_address = f"{materials_col_letter}{i}"
                    updates.append({
                        'range': cell_address,
                        'values': [[formatted_material]]
                    })
                    rows_updated += 1
        
        if not updates:
            print("\n✅ No materials need formatting!")
            return
        
        # Apply all updates in batch
        print(f"\n🔄 Applying {len(updates)} updates to Google Sheets...")
        
        # Batch update
        eg_activities.batch_update(updates)
        
        print(f"\n✅ Successfully formatted {rows_updated} rows!")
        print(f"   Each bullet point is now on a new line within the same cell.")
        
        # Verify
        print(f"\n🔍 Verifying updates...")
        all_values_after = eg_activities.get_all_values()
        
        print(f"\n📋 Sample verification (first 3 rows):")
        for i, row in enumerate(all_values_after[1:4], start=2):
            if materials_col_idx < len(row):
                material = row[materials_col_idx]
                print(f"\n   Row {i}:")
                # Show how it will appear (with newlines visible)
                for line in material.split('\n'):
                    print(f"   {line}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    print("=" * 80)
    print("FORMATTING MATERIALS COLUMN - ADDING NEWLINES AFTER EACH BULLET POINT")
    print("=" * 80)
    format_materials_column()
    print("\n" + "=" * 80)
    print("FORMATTING COMPLETE")
    print("=" * 80)




