#!/usr/bin/env python3
"""
Comprehensive Sheet Cleanup Script for EG Activities
Performs: Format fixing, data population, color coding, duplicate removal
"""

import gspread
from google.oauth2.service_account import Credentials
import re
import sys

class SheetCleanup:
    def __init__(self, spreadsheet_id, worksheet_name='EG Activities'):
        """Initialize the cleanup handler"""
        SCOPES = ['https://www.googleapis.com/auth/spreadsheets']
        creds = Credentials.from_service_account_file(
            'google-sheets-service-account.json', 
            scopes=SCOPES
        )
        self.client = gspread.authorize(creds)
        self.spreadsheet = self.client.open_by_key(spreadsheet_id)
        self.worksheet = self.spreadsheet.worksheet(worksheet_name)
        self.data = None
        self.headers = None
        
    def load_data(self):
        """Load current sheet data"""
        print("📊 Loading sheet data...")
        self.data = self.worksheet.get_all_values()
        self.headers = self.data[0]
        print(f"✓ Loaded {len(self.data)-1} rows, {len(self.headers)} columns")
        
    def remove_duplicate_header_rows(self):
        """Remove duplicate header rows in data"""
        print("\n🔍 Checking for duplicate header rows...")
        
        rows_to_delete = []
        
        # Check first 10 columns (most important ones) to detect duplicate headers
        # This handles cases where some trailing columns might be empty
        key_columns = min(10, len(self.headers))
        header_key = self.headers[:key_columns]
        
        # Check each data row to see if it matches the header
        for i, row in enumerate(self.data[1:], start=2):  # Start from row 2
            row_key = row[:key_columns]
            
            # Check if this row matches header in key columns
            if row_key == header_key:
                rows_to_delete.append(i)
                print(f"  Found duplicate header at row {i}")
        
        if rows_to_delete:
            print(f"⚠️ Found {len(rows_to_delete)} duplicate header row(s):")
            for row_num in rows_to_delete:
                print(f"  - Row {row_num}")
            
            # Delete rows from bottom to top to maintain indices
            for row_num in sorted(rows_to_delete, reverse=True):
                print(f"  Deleting row {row_num}...")
                self.worksheet.delete_rows(row_num)
            
            print("✓ Removed duplicate header rows")
            self.load_data()  # Reload after deletion
        else:
            print("✓ No duplicate header rows found")
    
    def remove_duplicate_columns(self):
        """Remove duplicate column headers"""
        print("\n🔍 Checking for duplicate columns...")
        
        seen = {}
        duplicates = []
        
        for i, col in enumerate(self.headers):
            if col in seen:
                duplicates.append((i, col))
            else:
                seen[col] = i
        
        if duplicates:
            print(f"⚠️ Found {len(duplicates)} duplicate columns:")
            for idx, col_name in duplicates:
                print(f"  - Column {idx+1} ('{col_name}')")
            
            # Delete duplicate columns (from right to left to maintain indices)
            for idx, col_name in sorted(duplicates, reverse=True):
                print(f"  Deleting column {idx+1}...")
                self.worksheet.delete_columns(idx+1)
            
            print("✓ Removed duplicate columns")
            self.load_data()  # Reload after deletion
        else:
            print("✓ No duplicate columns found")
    
    def populate_age_pillar_category(self, start_row, end_row, age, pillar, categories):
        """
        Populate Age, Pillar, and Category columns for specified rows
        
        Args:
            start_row: Starting row number (1-indexed, e.g., 42)
            end_row: Ending row number (1-indexed, e.g., 61)
            age: Age value (e.g., "🧒 Preschooler (3–5)")
            pillar: Pillar value (e.g., "Play & Creativity")
            categories: List of category names in order
        """
        print(f"\n📝 Populating Age, Pillar, Category for rows {start_row}-{end_row}...")
        
        age_col = self.headers.index('Age') + 1
        pillar_col = self.headers.index('Pillar') + 1
        category_col = self.headers.index('Category') + 1
        
        updates = []
        total_rows = end_row - start_row + 1
        rows_per_category = total_rows // len(categories)
        
        current_row = start_row
        for category in categories:
            # Calculate how many rows for this category
            rows_for_category = rows_per_category
            if category == categories[-1]:
                # Last category gets any remaining rows
                rows_for_category = end_row - current_row + 1
            
            print(f"  {category}: rows {current_row}-{current_row + rows_for_category - 1}")
            
            for row in range(current_row, current_row + rows_for_category):
                updates.append({
                    'range': f'{chr(64+age_col)}{row}',
                    'values': [[age]]
                })
                updates.append({
                    'range': f'{chr(64+pillar_col)}{row}',
                    'values': [[pillar]]
                })
                updates.append({
                    'range': f'{chr(64+category_col)}{row}',
                    'values': [[category]]
                })
            
            current_row += rows_for_category
        
        print(f"  Updating {len(updates)} cells...")
        self.worksheet.batch_update(updates)
        print("✓ Successfully populated Age, Pillar, and Category")
    
    def fix_formatting(self, start_row, end_row):
        """
        Fix formatting for Materials, Steps, and Skills columns
        Adds line breaks between bullet points and numbered steps
        """
        print(f"\n🎨 Fixing formatting for rows {start_row}-{end_row}...")
        
        self.load_data()  # Reload to get latest data
        
        materials_col = self.headers.index('Materials') + 1
        steps_col = self.headers.index('Steps') + 1
        skills_col = self.headers.index('Skills') + 1
        
        updates = []
        
        for row_idx in range(start_row, end_row + 1):
            row_data = self.data[row_idx - 1]
            
            # Fix Materials column
            materials = row_data[materials_col - 1]
            if materials and '•' in materials:
                # First, clean up any existing newlines
                fixed_materials = re.sub(r'\n+', '\n', materials)
                # Normalize spacing around bullets
                fixed_materials = re.sub(r'•\s*', '• ', fixed_materials)
                # Add single newline before each bullet (except first)
                fixed_materials = re.sub(r'(?<!\n)•', '\n•', fixed_materials.strip())
                # Remove any leading newline
                fixed_materials = fixed_materials.lstrip('\n')
                # Clean up multiple consecutive newlines to single
                fixed_materials = re.sub(r'\n\n+', '\n', fixed_materials)
                if fixed_materials != materials:
                    updates.append({
                        'range': f'{chr(64+materials_col)}{row_idx}',
                        'values': [[fixed_materials]]
                    })
            
            # Fix Steps column
            steps = row_data[steps_col - 1]
            if steps and re.search(r'\d+\.', steps):
                # First, clean up any existing newlines
                fixed_steps = re.sub(r'\n+', '\n', steps)
                # Normalize spacing around numbers
                fixed_steps = re.sub(r'(\d+)\.\s*', r'\1. ', fixed_steps)
                # Add single newline before each number (except first)
                fixed_steps = re.sub(r'(?<!\n)(\d+)\.', r'\n\1.', fixed_steps.strip())
                # Remove any leading newline
                fixed_steps = fixed_steps.lstrip('\n')
                # Clean up multiple consecutive newlines to single
                fixed_steps = re.sub(r'\n\n+', '\n', fixed_steps)
                if fixed_steps != steps:
                    updates.append({
                        'range': f'{chr(64+steps_col)}{row_idx}',
                        'values': [[fixed_steps]]
                    })
            
            # Fix Skills column
            skills = row_data[skills_col - 1]
            if skills and '•' in skills:
                # First, clean up any existing newlines
                fixed_skills = re.sub(r'\n+', '\n', skills)
                # Normalize spacing around bullets
                fixed_skills = re.sub(r'•\s*', '• ', fixed_skills)
                # Add single newline before each bullet (except first)
                fixed_skills = re.sub(r'(?<!\n)•', '\n•', fixed_skills.strip())
                # Remove any leading newline
                fixed_skills = fixed_skills.lstrip('\n')
                # Clean up multiple consecutive newlines to single
                fixed_skills = re.sub(r'\n\n+', '\n', fixed_skills)
                if fixed_skills != skills:
                    updates.append({
                        'range': f'{chr(64+skills_col)}{row_idx}',
                        'values': [[fixed_skills]]
                    })
        
        if updates:
            print(f"  Updating {len(updates)} cells...")
            self.worksheet.batch_update(updates)
            print("✓ Successfully fixed formatting")
        else:
            print("✓ No formatting changes needed")
    
    def fill_sno_column(self, start_row, end_row):
        """
        Fill SNo column with 1-20 for each age group
        
        Args:
            start_row: Starting row number (1-indexed)
            end_row: Ending row number (1-indexed)
        """
        print(f"\n📝 Filling SNo column for rows {start_row}-{end_row}...")
        
        # Check if SNo column exists
        if 'SNo' not in self.headers:
            print("⚠️ SNo column not found - skipping")
            return
        
        sno_col = self.headers.index('SNo') + 1
        
        # Each age group gets 1-20
        updates = []
        total_rows = end_row - start_row + 1
        rows_per_age = 20  # Each age group has 20 activities
        
        current_row = start_row
        sno = 1
        
        for row in range(start_row, end_row + 1):
            updates.append({
                'range': f'{chr(64+sno_col)}{row}',
                'values': [[sno]]
            })
            
            sno += 1
            if sno > 20:
                sno = 1  # Reset for next age group
        
        print(f"  Updating {len(updates)} cells...")
        
        # Batch update in chunks
        chunk_size = 100
        for i in range(0, len(updates), chunk_size):
            chunk = updates[i:i+chunk_size]
            self.worksheet.batch_update(chunk)
        
        print("✓ Successfully filled SNo column")
    
    def apply_color_coding(self, start_row, end_row, color_name, rgb):
        """
        Apply background color to specified rows
        
        Args:
            start_row: Starting row number (1-indexed)
            end_row: Ending row number (1-indexed)
            color_name: Name of color (for logging)
            rgb: Dict with 'red', 'green', 'blue' values (0-1 scale)
        """
        print(f"\n🎨 Applying {color_name} color to rows {start_row}-{end_row}...")
        
        # Get last column letter
        last_col = chr(64 + len(self.headers))
        range_str = f'A{start_row}:{last_col}{end_row}'
        
        self.worksheet.format(range_str, {
            'backgroundColor': rgb
        })
        
        print(f"✓ Applied {color_name} background color")
    
    def run_cleanup(self, start_row, end_row, age, pillar, categories, color_name, rgb):
        """
        Run complete cleanup process for specified rows
        
        Args:
            start_row: Starting row number (1-indexed)
            end_row: Ending row number (1-indexed)
            age: Age value (e.g., "🧒 Preschooler (3–5)")
            pillar: Pillar value (e.g., "Play & Creativity")
            categories: List of category names
            color_name: Name of color (for logging)
            rgb: Dict with 'red', 'green', 'blue' values
        """
        print("="*60)
        print(f"🚀 STARTING CLEANUP FOR ROWS {start_row}-{end_row}")
        print("="*60)
        
        # Step 1: Load data
        self.load_data()
        
        # Step 2: Remove duplicate header rows (FIRST - most important!)
        self.remove_duplicate_header_rows()
        
        # Step 3: Remove duplicate columns
        self.remove_duplicate_columns()
        
        # Step 4: Populate Age, Pillar, Category
        self.populate_age_pillar_category(start_row, end_row, age, pillar, categories)
        
        # Step 5: Fill SNo column (1-20 for each age group)
        self.fill_sno_column(start_row, end_row)
        
        # Step 6: Fix formatting
        self.fix_formatting(start_row, end_row)
        
        # Step 7: Apply color coding
        self.apply_color_coding(start_row, end_row, color_name, rgb)
        
        print("\n" + "="*60)
        print("✅ CLEANUP COMPLETE!")
        print("="*60)
        print(f"\nSummary:")
        print(f"  ✓ Duplicate header rows: Checked and removed")
        print(f"  ✓ Duplicate columns: Checked and removed")
        print(f"  ✓ Rows {start_row}-{end_row} processed")
        print(f"  ✓ Age: {age}")
        print(f"  ✓ Pillar: {pillar}")
        print(f"  ✓ Categories: {', '.join(categories)}")
        print(f"  ✓ SNo: Filled 1-20 for each age group")
        print(f"  ✓ Color: {color_name}")
        print(f"  ✓ Formatting: Fixed")
        print(f"\n🎉 Refresh your Google Sheet to see the changes!")


def main():
    """Main execution"""
    
    # Configuration
    SPREADSHEET_ID = '14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ'
    
    # Teen (13-18) configuration
    config = {
        'start_row': 102,
        'end_row': 121,
        'age': '🧑‍🎤 Teen (13–18)',
        'pillar': 'Play & Creativity',
        'categories': [
            'Artistic Performance & Design',
            'Creating Digital Art',
            'Building and Designing Gadgets',
            'Independent Fashion Design'
        ],
        'color_name': 'Light Mint',
        'rgb': {
            'red': 0.85,
            'green': 1.0,
            'blue': 0.95
        }
    }
    
    # Run cleanup
    cleanup = SheetCleanup(SPREADSHEET_ID)
    cleanup.run_cleanup(**config)


if __name__ == "__main__":
    main()

