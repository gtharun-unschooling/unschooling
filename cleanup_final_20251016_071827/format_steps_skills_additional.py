#!/usr/bin/env python3

import gspread
from google.oauth2.service_account import Credentials
import re

def format_columns():
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
        
        # Find column indices
        headers = all_values[0]
        
        columns_to_format = ['Steps', 'Skills', 'Additional Information']
        column_indices = {}
        
        for col_name in columns_to_format:
            if col_name in headers:
                idx = headers.index(col_name)
                column_indices[col_name] = {
                    'index': idx,
                    'letter': chr(65 + idx) if idx < 26 else chr(65 + idx // 26 - 1) + chr(65 + idx % 26)
                }
                print(f"✅ Found '{col_name}' column at index {idx} (Column {column_indices[col_name]['letter']})")
            else:
                print(f"⚠️  '{col_name}' column not found!")
        
        if not column_indices:
            print("❌ No columns to format!")
            return
        
        # Process each row
        updates = []
        
        print(f"\n📝 Processing formatting for {len(column_indices)} columns...")
        
        for i, row in enumerate(all_values[1:], start=2):  # Start from row 2 (skip header)
            
            for col_name, col_info in column_indices.items():
                col_idx = col_info['index']
                col_letter = col_info['letter']
                
                if col_idx < len(row):
                    current_value = row[col_idx]
                    
                    if not current_value or not current_value.strip():
                        continue
                    
                    formatted_value = None
                    
                    # Format Steps (numbered items like "1. ", "2. ", etc.)
                    if col_name == 'Steps':
                        # Split by number patterns like "1.", "2.", "3."
                        # Match patterns like "1. " or "1." at the start or after text
                        parts = re.split(r'(\d+\.\s*)', current_value)
                        
                        # Reconstruct with newlines
                        formatted_parts = []
                        for j in range(1, len(parts), 2):  # Get number + content pairs
                            if j < len(parts) - 1:
                                number = parts[j].strip()
                                content = parts[j + 1].strip()
                                if content:
                                    formatted_parts.append(f"{number} {content}")
                        
                        if formatted_parts:
                            formatted_value = '\n'.join(formatted_parts)
                    
                    # Format Skills and Additional Information (bullet points)
                    elif '•' in current_value:
                        # Split by bullet points and rejoin with newlines
                        parts = current_value.split('•')
                        # Filter out empty parts and strip whitespace
                        parts = [part.strip() for part in parts if part.strip()]
                        
                        # Rejoin with bullet points and newlines
                        if parts:
                            formatted_value = '\n'.join([f'• {part}' for part in parts])
                    
                    # If we formatted the value and it's different, add to updates
                    if formatted_value and formatted_value != current_value:
                        print(f"\n   Row {i} - {col_name} BEFORE:")
                        print(f"   {current_value[:100]}{'...' if len(current_value) > 100 else ''}")
                        print(f"   Row {i} - {col_name} AFTER:")
                        for line in formatted_value.split('\n')[:5]:  # Show first 5 lines
                            print(f"   {line}")
                        if len(formatted_value.split('\n')) > 5:
                            print(f"   ... ({len(formatted_value.split('\n'))} lines total)")
                        
                        cell_address = f"{col_letter}{i}"
                        updates.append({
                            'range': cell_address,
                            'values': [[formatted_value]]
                        })
        
        if not updates:
            print("\n✅ No formatting needed - all columns already properly formatted!")
            return
        
        # Apply all updates in batch
        print(f"\n🔄 Applying {len(updates)} updates to Google Sheets...")
        
        # Batch update
        eg_activities.batch_update(updates)
        
        print(f"\n✅ Successfully formatted {len(updates)} cells!")
        print(f"   Each item is now on a new line within the same cell.")
        
        # Verify
        print(f"\n🔍 Verifying updates...")
        all_values_after = eg_activities.get_all_values()
        
        print(f"\n📋 Sample verification (Row 2):")
        row = all_values_after[1]  # Row 2 (index 1)
        
        for col_name, col_info in column_indices.items():
            col_idx = col_info['index']
            if col_idx < len(row):
                value = row[col_idx]
                print(f"\n   {col_name}:")
                lines = value.split('\n')
                for line in lines[:5]:  # Show first 5 lines
                    print(f"   {line}")
                if len(lines) > 5:
                    print(f"   ... ({len(lines)} lines total)")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    print("=" * 80)
    print("FORMATTING STEPS, SKILLS, AND ADDITIONAL INFORMATION COLUMNS")
    print("=" * 80)
    format_columns()
    print("\n" + "=" * 80)
    print("FORMATTING COMPLETE")
    print("=" * 80)




