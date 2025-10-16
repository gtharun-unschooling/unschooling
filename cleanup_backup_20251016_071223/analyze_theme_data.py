#!/usr/bin/env python3

import gspread
from google.oauth2.service_account import Credentials
from collections import Counter
import re

def analyze_theme_data():
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
        
        print("🔍 Accessing Sample 1 Google Sheet...")
        
        # Get Sample 1 sheet
        sheets = gc.openall()
        sample_1_sheet = None
        
        for sheet in sheets:
            if 'sample 1' in sheet.title.lower():
                sample_1_sheet = sheet
                break
        
        # Get Theme Names worksheet
        theme_names_ws = None
        for ws in sample_1_sheet.worksheets():
            if 'theme' in ws.title.lower() and 'name' in ws.title.lower():
                theme_names_ws = ws
                break
        
        print(f"✅ Found worksheet: '{theme_names_ws.title}'")
        print("=" * 80)
        
        # Get all data
        all_data = theme_names_ws.get_all_values()
        headers = all_data[0]
        data_rows = all_data[1:]
        
        print(f"\n📊 OVERALL STATISTICS")
        print("=" * 80)
        print(f"Total themes: {len(data_rows)}")
        print(f"Columns: {len(headers)}")
        print(f"Headers: {headers}")
        
        # Analyze each column
        plan_types = []
        s_nos = []
        age_groups = []
        theme_names = []
        descriptions = []
        focus_areas = []
        
        missing_data = {
            'Plan Type': [],
            'S.No': [],
            'Age Group': [],
            'Theme Name': [],
            'Short Description': [],
            'Core Focus Area': []
        }
        
        for i, row in enumerate(data_rows, 2):  # Start from row 2 (skip header)
            if len(row) >= 6:
                plan_type = row[0].strip()
                s_no = row[1].strip()
                age_group = row[2].strip()
                theme_name = row[3].strip()
                description = row[4].strip()
                focus_area = row[5].strip()
                
                # Collect data
                if plan_type: plan_types.append(plan_type)
                else: missing_data['Plan Type'].append(i)
                
                if s_no: s_nos.append(s_no)
                else: missing_data['S.No'].append(i)
                
                if age_group: age_groups.append(age_group)
                else: missing_data['Age Group'].append(i)
                
                if theme_name: theme_names.append(theme_name)
                else: missing_data['Theme Name'].append(i)
                
                if description: descriptions.append(description)
                else: missing_data['Short Description'].append(i)
                
                if focus_area: focus_areas.append(focus_area)
                else: missing_data['Core Focus Area'].append(i)
        
        # DATA COMPLETENESS ANALYSIS
        print(f"\n🎯 DATA COMPLETENESS")
        print("=" * 80)
        total_cells = len(data_rows) * 6
        filled_cells = len(plan_types) + len(s_nos) + len(age_groups) + len(theme_names) + len(descriptions) + len(focus_areas)
        completeness_rate = (filled_cells / total_cells) * 100
        
        print(f"Completeness Rate: {completeness_rate:.1f}%")
        print(f"Filled Cells: {filled_cells}/{total_cells}")
        
        print("\nMissing Data by Column:")
        has_missing = False
        for col, rows in missing_data.items():
            if rows:
                has_missing = True
                print(f"  ❌ {col}: {len(rows)} missing (rows: {rows[:5]}{'...' if len(rows) > 5 else ''})")
            else:
                print(f"  ✅ {col}: Complete")
        
        if not has_missing:
            print("  🎉 Perfect! No missing data!")
        
        # PLAN TYPE DISTRIBUTION
        print(f"\n📋 PLAN TYPE DISTRIBUTION")
        print("=" * 80)
        plan_type_counts = Counter(plan_types)
        for plan_type, count in plan_type_counts.most_common():
            percentage = (count / len(plan_types)) * 100
            print(f"  {plan_type}: {count} themes ({percentage:.1f}%)")
        
        # AGE GROUP DISTRIBUTION
        print(f"\n👶 AGE GROUP DISTRIBUTION")
        print("=" * 80)
        age_group_counts = Counter(age_groups)
        for age_group, count in sorted(age_group_counts.items()):
            percentage = (count / len(age_groups)) * 100
            print(f"  {age_group}: {count} themes ({percentage:.1f}%)")
        
        # CORE FOCUS AREA DISTRIBUTION
        print(f"\n🎨 CORE FOCUS AREA DISTRIBUTION")
        print("=" * 80)
        focus_area_counts = Counter(focus_areas)
        for focus_area, count in focus_area_counts.most_common(10):
            percentage = (count / len(focus_areas)) * 100
            print(f"  {focus_area}: {count} themes ({percentage:.1f}%)")
        
        if len(focus_area_counts) > 10:
            print(f"  ... and {len(focus_area_counts) - 10} more focus areas")
        
        # DUPLICATE ANALYSIS
        print(f"\n🔍 DUPLICATE ANALYSIS")
        print("=" * 80)
        
        # Check for duplicate theme names
        theme_name_counts = Counter(theme_names)
        duplicates = {name: count for name, count in theme_name_counts.items() if count > 1}
        
        if duplicates:
            print(f"⚠️  Found {len(duplicates)} duplicate theme names:")
            for name, count in sorted(duplicates.items(), key=lambda x: x[1], reverse=True)[:10]:
                print(f"  '{name}': appears {count} times")
        else:
            print("✅ No duplicate theme names found!")
        
        # Check for duplicate S.No
        s_no_counts = Counter(s_nos)
        duplicate_s_nos = {sno: count for sno, count in s_no_counts.items() if count > 1}
        
        if duplicate_s_nos:
            print(f"\n⚠️  Found duplicate S.No values:")
            for sno, count in sorted(duplicate_s_nos.items(), key=lambda x: x[1], reverse=True)[:10]:
                print(f"  S.No '{sno}': appears {count} times")
        else:
            print("✅ All S.No values are unique!")
        
        # DATA QUALITY CHECKS
        print(f"\n✨ DATA QUALITY CHECKS")
        print("=" * 80)
        
        # Check description lengths
        short_descriptions = [d for d in descriptions if len(d) < 20]
        long_descriptions = [d for d in descriptions if len(d) > 150]
        
        print(f"Description Length Analysis:")
        print(f"  Average length: {sum(len(d) for d in descriptions) / len(descriptions):.0f} characters")
        print(f"  Too short (<20 chars): {len(short_descriptions)} themes")
        print(f"  Too long (>150 chars): {len(long_descriptions)} themes")
        
        # Check for consistency in age group format
        age_pattern = re.compile(r'^\d+–\d+\s+yrs$')
        inconsistent_ages = [ag for ag in age_groups if not age_pattern.match(ag)]
        
        if inconsistent_ages:
            print(f"\n⚠️  Age format inconsistencies: {len(inconsistent_ages)} found")
            print(f"  Examples: {list(set(inconsistent_ages))[:5]}")
        else:
            print(f"\n✅ All age groups follow consistent format (X–Y yrs)")
        
        # OVERALL QUALITY SCORE
        print(f"\n🏆 OVERALL QUALITY SCORE")
        print("=" * 80)
        
        quality_score = 0
        max_score = 100
        
        # Completeness (40 points)
        quality_score += (completeness_rate / 100) * 40
        
        # No duplicates in theme names (20 points)
        if not duplicates:
            quality_score += 20
        else:
            quality_score += 20 * (1 - len(duplicates) / len(theme_names))
        
        # No duplicate S.No (20 points)
        if not duplicate_s_nos:
            quality_score += 20
        else:
            quality_score += 20 * (1 - len(duplicate_s_nos) / len(s_nos))
        
        # Description quality (10 points)
        good_descriptions = len(descriptions) - len(short_descriptions) - len(long_descriptions)
        quality_score += (good_descriptions / len(descriptions)) * 10
        
        # Age format consistency (10 points)
        quality_score += ((len(age_groups) - len(inconsistent_ages)) / len(age_groups)) * 10
        
        print(f"Quality Score: {quality_score:.1f}/{max_score}")
        
        if quality_score >= 90:
            grade = "A+ (Excellent)"
            emoji = "🌟"
        elif quality_score >= 80:
            grade = "A (Very Good)"
            emoji = "✨"
        elif quality_score >= 70:
            grade = "B (Good)"
            emoji = "👍"
        elif quality_score >= 60:
            grade = "C (Fair)"
            emoji = "📝"
        else:
            grade = "D (Needs Improvement)"
            emoji = "⚠️"
        
        print(f"Grade: {emoji} {grade}")
        
        # RECOMMENDATIONS
        print(f"\n💡 RECOMMENDATIONS")
        print("=" * 80)
        
        if has_missing:
            print("1. Fill in missing data to achieve 100% completeness")
        
        if duplicates:
            print(f"2. Review and resolve {len(duplicates)} duplicate theme names")
        
        if duplicate_s_nos:
            print(f"3. Fix duplicate S.No values to ensure unique identifiers")
        
        if short_descriptions:
            print(f"4. Expand {len(short_descriptions)} short descriptions (add more detail)")
        
        if inconsistent_ages:
            print(f"5. Standardize {len(inconsistent_ages)} age group formats")
        
        if quality_score >= 90:
            print("✅ Data quality is excellent! Minor improvements only.")
        
        print(f"\n🌐 View the sheet: {sample_1_sheet.url}")
        
    except Exception as e:
        print(f"❌ Error: {e}")
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    analyze_theme_data()

