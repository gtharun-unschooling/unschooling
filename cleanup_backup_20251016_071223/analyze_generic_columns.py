#!/usr/bin/env python3
"""
🔍 Analyze Generic Columns
Analyze all columns to identify which ones contain generic, repetitive information
"""

import gspread
from google.oauth2.service_account import Credentials
from collections import defaultdict, Counter

def get_google_sheets_client():
    """Connect to Google Sheets using credentials"""
    try:
        scope = [
            'https://spreadsheets.google.com/feeds',
            'https://www.googleapis.com/auth/spreadsheets',
            'https://www.googleapis.com/auth/drive',
            'https://www.googleapis.com/auth/drive.file'
        ]
        creds = Credentials.from_service_account_file('sheets-credentials.json', scopes=scope)
        client = gspread.authorize(creds)
        return client
    except Exception as e:
        print(f"❌ Error connecting to Google Sheets: {e}")
        return None

def analyze_generic_columns():
    """Analyze all columns for generic content"""
    
    try:
        print(f"🔍 ANALYZING GENERIC COLUMNS:")
        print("=" * 70)
        
        # Connect to Google Sheets
        client = get_google_sheets_client()
        if not client:
            return False
        
        # Open spreadsheet
        spreadsheet = client.open_by_key('14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ')
        activities_worksheet = spreadsheet.worksheet('Activities')
        
        # Get headers
        headers = activities_worksheet.row_values(1)
        print(f"📋 Available columns: {headers}")
        print()
        
        # Get all data
        all_data = activities_worksheet.get_all_values()
        
        # Focus on Cognitive Skills activities
        cognitive_activities = []
        for row_num, row in enumerate(all_data[1:], start=2):
            if len(row) > 1 and row[1] == 'Cognitive Skills':  # Pillar column
                cognitive_activities.append((row, row_num))
        
        print(f"🎯 ANALYZING {len(cognitive_activities)} COGNITIVE SKILLS ACTIVITIES:")
        print("-" * 70)
        
        # Analyze each column for generic content
        column_analysis = {}
        
        for col_index, header in enumerate(headers):
            if col_index >= len(cognitive_activities[0][0]):
                continue
                
            print(f"\n📊 Column {col_index}: '{header}'")
            print("-" * 50)
            
            # Collect all values for this column
            values = []
            for row, row_num in cognitive_activities:
                if col_index < len(row):
                    value = row[col_index].strip()
                    if value:  # Only non-empty values
                        values.append(value)
            
            if not values:
                print(f"   ⚠️  No values found")
                continue
            
            # Count frequency of each value
            value_counts = Counter(values)
            total_values = len(values)
            unique_values = len(value_counts)
            
            print(f"   📈 Total values: {total_values}")
            print(f"   🔢 Unique values: {unique_values}")
            print(f"   📊 Uniqueness ratio: {unique_values/total_values:.2%}")
            
            # Check for generic patterns
            generic_indicators = [
                'age-appropriate', '9-12 years', '6-8 years', '13-18 years', 
                'cognitive development', 'essential cognitive skills',
                'hands-on, age-appropriate', 'structured approach',
                'Guide skill development', 'Celebrate cognitive growth',
                'Use age-appropriate activities', 'Educational cognitive',
                'skill-building materials', 'No corrections needed'
            ]
            
            generic_count = 0
            for value in values:
                for indicator in generic_indicators:
                    if indicator.lower() in value.lower():
                        generic_count += 1
                        break
            
            print(f"   🚨 Generic content: {generic_count}/{total_values} ({generic_count/total_values:.1%})")
            
            # Show most common values
            print(f"   📋 Most common values:")
            for value, count in value_counts.most_common(3):
                print(f"      '{value}' - {count} times ({count/total_values:.1%})")
            
            # Store analysis
            column_analysis[header] = {
                'index': col_index,
                'total_values': total_values,
                'unique_values': unique_values,
                'uniqueness_ratio': unique_values/total_values,
                'generic_count': generic_count,
                'generic_ratio': generic_count/total_values,
                'most_common': value_counts.most_common(3)
            }
        
        # Identify problematic columns
        print(f"\n🚨 PROBLEMATIC COLUMNS ANALYSIS:")
        print("=" * 70)
        
        # Sort by generic ratio (highest first)
        sorted_columns = sorted(column_analysis.items(), 
                              key=lambda x: x[1]['generic_ratio'], 
                              reverse=True)
        
        print(f"📊 Columns ranked by generic content:")
        print("-" * 50)
        
        for header, analysis in sorted_columns:
            if analysis['generic_ratio'] > 0.1:  # More than 10% generic content
                print(f"   🔴 {header}: {analysis['generic_ratio']:.1%} generic")
            elif analysis['generic_ratio'] > 0.05:  # More than 5% generic content
                print(f"   🟡 {header}: {analysis['generic_ratio']:.1%} generic")
            else:
                print(f"   🟢 {header}: {analysis['generic_ratio']:.1%} generic")
        
        # Show specific examples of generic content
        print(f"\n🎯 EXAMPLES OF GENERIC CONTENT:")
        print("-" * 50)
        
        # Look at the example row provided by user
        example_activity = None
        for row, row_num in cognitive_activities:
            if 'Innovation Breakthrough Lab' in row:
                example_activity = row
                break
        
        if example_activity:
            print(f"📋 Example Activity: Innovation Breakthrough Lab")
            print("-" * 50)
            
            for col_index, header in enumerate(headers):
                if col_index < len(example_activity):
                    value = example_activity[col_index]
                    if any(indicator.lower() in value.lower() for indicator in generic_indicators):
                        print(f"   🔴 {header}: {value}")
                    elif len(value) > 50 and ('cognitive' in value.lower() or 'age-appropriate' in value.lower()):
                        print(f"   🟡 {header}: {value[:100]}...")
        
        return True
        
    except Exception as e:
        print(f"❌ Error analyzing generic columns: {e}")
        return False

def main():
    """Main function to analyze generic columns"""
    print("🔍 Analyze Generic Columns")
    print("=" * 50)
    print("🎯 Identify columns with generic, repetitive information")
    
    success = analyze_generic_columns()
    
    if success:
        print(f"\n✅ SUCCESS! Generic columns identified!")
        return True
    else:
        print(f"\n❌ FAILED to analyze generic columns!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Generic columns identified!")
    else:
        print(f"\n❌ FAILED to analyze generic columns!")
