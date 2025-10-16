#!/usr/bin/env python3

import gspread
from google.oauth2.service_account import Credentials

def add_columns():
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
        
        headers = all_values[0]
        print(f"\n📋 Current columns ({len(headers)}): {headers}")
        
        # Check which columns need to be added
        columns_to_add = []
        column_indices = {}
        
        for col_name in ['Age', 'Pillar', 'Category']:
            if col_name in headers:
                idx = headers.index(col_name)
                column_indices[col_name] = idx
                print(f"✅ '{col_name}' column already exists at index {idx}")
            else:
                columns_to_add.append(col_name)
                print(f"➕ '{col_name}' column will be added")
        
        # Add new columns if needed
        if columns_to_add:
            print(f"\n🔧 Adding {len(columns_to_add)} new column(s)...")
            
            # Add columns to the end
            for col_name in columns_to_add:
                col_idx = len(headers)
                headers.append(col_name)
                column_indices[col_name] = col_idx
                print(f"   Added '{col_name}' at index {col_idx}")
            
            # Update header row
            header_range = f"A1:{chr(65 + len(headers) - 1)}1"
            eg_activities.update(header_range, [headers])
            print(f"✅ Updated header row: {header_range}")
        
        # Define the data
        pillar = "Play & Creativity"
        age = "👶 Infant (0–1)"
        
        # Categories for groups of 5 activities each
        categories = [
            "Sensory Exploration",        # Activities 1-5
            "Tummy Time Play",             # Activities 6-10
            "Interactive Sounds & Textures", # Activities 11-15
            "Parent-Child Bonding Activities"  # Activities 16-20
        ]
        
        print(f"\n📝 Populating columns...")
        print(f"   Pillar: {pillar}")
        print(f"   Age: {age}")
        print(f"   Categories (5 activities each):")
        for i, cat in enumerate(categories, 1):
            start = (i-1)*5 + 1
            end = i*5
            print(f"      Activities {start}-{end}: {cat}")
        
        # Prepare updates
        updates = []
        data_rows = len(all_values) - 1  # Exclude header
        
        print(f"\n🔄 Processing {data_rows} activities...")
        
        for row_idx in range(1, min(data_rows + 1, 21)):  # Process up to 20 activities
            activity_num = row_idx
            
            # Determine category based on activity number
            category_idx = (activity_num - 1) // 5  # 0-3
            if category_idx < len(categories):
                category = categories[category_idx]
            else:
                category = ""
            
            # Update Age
            age_col_idx = column_indices['Age']
            age_col_letter = chr(65 + age_col_idx) if age_col_idx < 26 else chr(65 + age_col_idx // 26 - 1) + chr(65 + age_col_idx % 26)
            cell_address = f"{age_col_letter}{row_idx + 1}"
            updates.append({
                'range': cell_address,
                'values': [[age]]
            })
            
            # Update Pillar
            pillar_col_idx = column_indices['Pillar']
            pillar_col_letter = chr(65 + pillar_col_idx) if pillar_col_idx < 26 else chr(65 + pillar_col_idx // 26 - 1) + chr(65 + pillar_col_idx % 26)
            cell_address = f"{pillar_col_letter}{row_idx + 1}"
            updates.append({
                'range': cell_address,
                'values': [[pillar]]
            })
            
            # Update Category
            category_col_idx = column_indices['Category']
            category_col_letter = chr(65 + category_col_idx) if category_col_idx < 26 else chr(65 + category_col_idx // 26 - 1) + chr(65 + category_col_idx % 26)
            cell_address = f"{category_col_letter}{row_idx + 1}"
            updates.append({
                'range': cell_address,
                'values': [[category]]
            })
            
            print(f"   Row {row_idx + 1}: Age={age}, Pillar={pillar}, Category={category}")
        
        # Apply all updates in batch
        if updates:
            print(f"\n🔄 Applying {len(updates)} updates to Google Sheets...")
            eg_activities.batch_update(updates)
            print(f"✅ Successfully updated {len(updates)} cells!")
        
        # Verify
        print(f"\n🔍 Verifying updates...")
        all_values_after = eg_activities.get_all_values()
        
        headers_after = all_values_after[0]
        print(f"\n📋 Updated columns ({len(headers_after)}): {headers_after}")
        
        # Show sample data
        print(f"\n📊 Sample data verification (first 5 activities):")
        age_idx = column_indices['Age']
        pillar_idx = column_indices['Pillar']
        category_idx = column_indices['Category']
        
        # Assuming Activity Name is at index 0
        name_idx = 0
        
        print(f"\n{'Row':<5} {'Activity Name':<35} {'Age':<20} {'Pillar':<20} {'Category':<35}")
        print("=" * 120)
        
        for i, row in enumerate(all_values_after[1:6], start=2):  # First 5 data rows
            name = row[name_idx][:32] + "..." if len(row[name_idx]) > 32 else row[name_idx]
            age_val = row[age_idx] if age_idx < len(row) else ""
            pillar_val = row[pillar_idx] if pillar_idx < len(row) else ""
            category_val = row[category_idx] if category_idx < len(row) else ""
            
            print(f"{i:<5} {name:<35} {age_val:<20} {pillar_val:<20} {category_val:<35}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    print("=" * 80)
    print("ADDING AGE, PILLAR, AND CATEGORY COLUMNS")
    print("=" * 80)
    add_columns()
    print("\n" + "=" * 80)
    print("UPDATE COMPLETE")
    print("=" * 80)




