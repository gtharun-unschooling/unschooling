#!/usr/bin/env python3

import gspread
from google.oauth2.service_account import Credentials
import json
from collections import Counter, defaultdict

def analyze_eg_activities():
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
        
        # Headers and data
        headers = all_values[0]
        data_rows = all_values[1:]
        
        print("\n" + "=" * 80)
        print("📋 COMPREHENSIVE DATA ANALYSIS - EG ACTIVITIES")
        print("=" * 80)
        
        # Basic statistics
        print(f"\n📊 BASIC STATISTICS:")
        print(f"   Total rows: {len(data_rows)}")
        print(f"   Total columns: {len(headers)}")
        print(f"   Non-empty rows: {sum(1 for row in data_rows if any(cell.strip() for cell in row))}")
        
        # Column names
        print(f"\n📑 COLUMN STRUCTURE ({len(headers)} columns):")
        for i, header in enumerate(headers, 1):
            print(f"   {i:2d}. {header}")
        
        # Create a dictionary for easier analysis
        data_dict = []
        for row in data_rows:
            if any(cell.strip() for cell in row):  # Skip empty rows
                row_dict = {}
                for i, header in enumerate(headers):
                    row_dict[header] = row[i] if i < len(row) else ""
                data_dict.append(row_dict)
        
        print(f"\n✅ Analyzing {len(data_dict)} non-empty rows...")
        
        # Analyze key columns
        analyses = {}
        
        # Age Group distribution
        if 'Age Group' in headers:
            age_groups = [row.get('Age Group', '').strip() for row in data_dict if row.get('Age Group', '').strip()]
            age_counter = Counter(age_groups)
            analyses['Age Groups'] = age_counter
        
        # Category distribution
        if 'Category' in headers:
            categories = [row.get('Category', '').strip() for row in data_dict if row.get('Category', '').strip()]
            category_counter = Counter(categories)
            analyses['Categories'] = category_counter
        
        # Pillar distribution
        if 'Pillar' in headers:
            pillars = [row.get('Pillar', '').strip() for row in data_dict if row.get('Pillar', '').strip()]
            pillar_counter = Counter(pillars)
            analyses['Pillars'] = pillar_counter
        
        # Difficulty Level
        if 'Difficulty Level' in headers:
            difficulty = [row.get('Difficulty Level', '').strip() for row in data_dict if row.get('Difficulty Level', '').strip()]
            difficulty_counter = Counter(difficulty)
            analyses['Difficulty Levels'] = difficulty_counter
        
        # Activity Type
        if 'Activity Type' in headers:
            activity_types = [row.get('Activity Type', '').strip() for row in data_dict if row.get('Activity Type', '').strip()]
            activity_type_counter = Counter(activity_types)
            analyses['Activity Types'] = activity_type_counter
        
        # Display analyses
        for analysis_name, counter in analyses.items():
            print(f"\n📈 {analysis_name.upper()} DISTRIBUTION:")
            total = sum(counter.values())
            for item, count in counter.most_common():
                percentage = (count / total * 100) if total > 0 else 0
                print(f"   {item:40s}: {count:4d} ({percentage:5.1f}%)")
        
        # Data completeness analysis
        print(f"\n🔍 DATA COMPLETENESS ANALYSIS:")
        completeness = {}
        for header in headers:
            filled = sum(1 for row in data_dict if row.get(header, '').strip())
            total = len(data_dict)
            percentage = (filled / total * 100) if total > 0 else 0
            completeness[header] = {
                'filled': filled,
                'total': total,
                'percentage': percentage
            }
        
        # Sort by completeness
        sorted_completeness = sorted(completeness.items(), key=lambda x: x[1]['percentage'])
        
        print("\n   Columns with INCOMPLETE data (< 100%):")
        incomplete_shown = False
        for header, stats in sorted_completeness:
            if stats['percentage'] < 100:
                incomplete_shown = True
                print(f"   {header:40s}: {stats['filled']:4d}/{stats['total']:4d} ({stats['percentage']:5.1f}%)")
        
        if not incomplete_shown:
            print("   ✅ All columns are 100% complete!")
        
        print("\n   Columns with COMPLETE data (100%):")
        complete_count = 0
        for header, stats in sorted_completeness:
            if stats['percentage'] == 100:
                complete_count += 1
                print(f"   {header:40s}: {stats['filled']:4d}/{stats['total']:4d} ({stats['percentage']:5.1f}%)")
        
        # Sample data preview
        print(f"\n📄 SAMPLE DATA (First 3 rows):")
        print("=" * 80)
        for i, row_dict in enumerate(data_dict[:3], 1):
            print(f"\nRow {i}:")
            for header in headers[:10]:  # Show first 10 columns
                value = row_dict.get(header, '')
                display_value = value[:60] + "..." if len(value) > 60 else value
                print(f"   {header:25s}: {display_value}")
        
        # Time-based analysis
        if 'Estimated Time' in headers:
            print(f"\n⏱️  TIME ANALYSIS:")
            times = [row.get('Estimated Time', '').strip() for row in data_dict if row.get('Estimated Time', '').strip()]
            time_counter = Counter(times)
            print(f"   Unique time ranges: {len(time_counter)}")
            for time_range, count in time_counter.most_common(10):
                print(f"   {time_range:30s}: {count:4d}")
        
        # Materials analysis
        if 'Materials' in headers:
            print(f"\n🧰 MATERIALS ANALYSIS:")
            materials_filled = sum(1 for row in data_dict if row.get('Materials', '').strip())
            print(f"   Activities with materials: {materials_filled}/{len(data_dict)}")
            
            # Check for common patterns
            materials_list = [row.get('Materials', '').strip() for row in data_dict if row.get('Materials', '').strip()]
            avg_length = sum(len(m) for m in materials_list) / len(materials_list) if materials_list else 0
            print(f"   Average materials text length: {avg_length:.0f} characters")
        
        # Steps analysis
        if 'Steps' in headers:
            print(f"\n📝 STEPS ANALYSIS:")
            steps_filled = sum(1 for row in data_dict if row.get('Steps', '').strip())
            print(f"   Activities with steps: {steps_filled}/{len(data_dict)}")
            
            steps_list = [row.get('Steps', '').strip() for row in data_dict if row.get('Steps', '').strip()]
            avg_length = sum(len(s) for s in steps_list) / len(steps_list) if steps_list else 0
            print(f"   Average steps text length: {avg_length:.0f} characters")
        
        # Activity ID analysis
        if 'Activity ID' in headers:
            print(f"\n🆔 ACTIVITY ID ANALYSIS:")
            activity_ids = [row.get('Activity ID', '').strip() for row in data_dict if row.get('Activity ID', '').strip()]
            print(f"   Activities with ID: {len(activity_ids)}/{len(data_dict)}")
            if activity_ids:
                # Check for duplicates
                duplicates = [id for id, count in Counter(activity_ids).items() if count > 1]
                if duplicates:
                    print(f"   ⚠️  Duplicate IDs found: {len(duplicates)}")
                    for dup_id in duplicates[:5]:
                        print(f"      - {dup_id}")
                else:
                    print(f"   ✅ All Activity IDs are unique")
                
                # Show ID pattern examples
                print(f"   Sample Activity IDs:")
                for aid in activity_ids[:5]:
                    print(f"      - {aid}")
        
        # Save detailed analysis to JSON
        output_data = {
            'total_rows': len(data_dict),
            'total_columns': len(headers),
            'headers': headers,
            'distributions': {k: dict(v) for k, v in analyses.items()},
            'completeness': completeness,
            'sample_data': data_dict[:5]  # First 5 rows
        }
        
        output_file = 'eg_activities_analysis.json'
        with open(output_file, 'w') as f:
            json.dump(output_data, f, indent=2)
        
        print(f"\n💾 Detailed analysis saved to: {output_file}")
        
        return data_dict
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()
        return None

if __name__ == "__main__":
    analyze_eg_activities()


