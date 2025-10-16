#!/usr/bin/env python3
"""
🔍 Comprehensive Audit of All Columns
Detailed analysis of all columns to identify exactly what still needs fixing
"""

import gspread
from google.oauth2.service_account import Credentials
from collections import Counter
import re

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
        return False

def analyze_column_robotic_content(column_name, values, total_activities):
    """Analyze robotic content in a specific column"""
    
    # Remove empty values
    non_empty_values = [v for v in values if v.strip()]
    
    if not non_empty_values:
        return {
            'completion_rate': 0,
            'robotic_score': 0,
            'uniqueness_ratio': 0,
            'issues': ['Empty column']
        }
    
    # Calculate completion rate
    completion_rate = len(non_empty_values) / total_activities
    
    # Check for robotic patterns
    robotic_patterns = [
        # Explanation patterns
        r'^Your (baby|child|toddler|preschooler|teen)',
        r'^This (engaging|comprehensive) activity',
        r'^Develop (essential|core) cognitive skills',
        r'^Age-appropriate (activities|materials|tools)',
        
        # Materials patterns
        r'Age-appropriate learning materials, interactive tools, educational resources, comfortable workspace',
        r'Educational cognitive development kits, age-appropriate tools',
        r'Household cognitive activities, family learning opportunities',
        
        # Additional Information patterns
        r'Use age-appropriate activities for \d+-\d+ years\. Guide skill development\. Celebrate cognitive growth',
        r'Guide skill development\. Celebrate cognitive growth',
        
        # Feedback patterns
        r'Ready for parent engagement - all content verified and complete',
        
        # Corrections patterns
        r'No corrections needed - activity is complete and age-appropriate',
        
        # General Instructions patterns
        r'Use age-appropriate activities for \d+-\d+ years\. Guide skill development',
        
        # Kit Materials patterns
        r'Educational cognitive development kits, age-appropriate tools, skill-building materials',
        
        # Materials at Home patterns
        r'Household cognitive activities, family learning opportunities, everyday skill-building',
        
        # Materials to Buy patterns
        r'Educational cognitive development kits, age-appropriate tools, skill-building materials for \d+-\d+ years'
    ]
    
    robotic_count = 0
    for value in non_empty_values:
        for pattern in robotic_patterns:
            if re.search(pattern, value, re.IGNORECASE):
                robotic_count += 1
                break
    
    robotic_score = (robotic_count / len(non_empty_values)) * 100
    
    # Calculate uniqueness
    unique_values = len(set(non_empty_values))
    uniqueness_ratio = unique_values / len(non_empty_values)
    
    # Check for specific issues
    issues = []
    
    # Check for repetition
    value_counts = Counter(non_empty_values)
    most_common = value_counts.most_common(3)
    for value, count in most_common:
        if count > total_activities * 0.1:  # More than 10% repetition
            issues.append(f'High repetition: "{value[:50]}..." ({count} times)')
    
    # Check for generic content
    generic_indicators = ['age-appropriate', 'cognitive development', 'essential skills', 'hands-on', 'educational']
    generic_count = sum(1 for value in non_empty_values 
                       if any(indicator in value.lower() for indicator in generic_indicators))
    
    if generic_count > len(non_empty_values) * 0.3:  # More than 30% generic
        issues.append(f'High generic content ({generic_count}/{len(non_empty_values)})')
    
    # Check for empty or very short content
    short_count = sum(1 for value in non_empty_values if len(value.strip()) < 20)
    if short_count > 0:
        issues.append(f'Very short content: {short_count} entries')
    
    return {
        'completion_rate': completion_rate,
        'robotic_score': robotic_score,
        'uniqueness_ratio': uniqueness_ratio,
        'issues': issues,
        'most_common': most_common[:3]
    }

def comprehensive_audit_all_columns():
    """Comprehensive audit of all columns"""
    
    try:
        print(f"🔍 COMPREHENSIVE AUDIT OF ALL COLUMNS:")
        print("=" * 80)
        
        # Connect to Google Sheets
        client = get_google_sheets_client()
        if not client:
            return False
        
        # Open spreadsheet
        spreadsheet = client.open_by_key('14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ')
        activities_worksheet = spreadsheet.worksheet('Activities')
        
        # Get headers
        headers = activities_worksheet.row_values(1)
        
        # Get all data
        all_data = activities_worksheet.get_all_values()
        
        # Filter Cognitive Skills activities
        cognitive_activities = []
        pillar_col_index = headers.index('Pillar') if 'Pillar' in headers else 1
        
        for row in all_data[1:]:
            if len(row) > pillar_col_index and row[pillar_col_index].strip() == 'Cognitive Skills':
                cognitive_activities.append(row)
        
        total_activities = len(cognitive_activities)
        print(f"📊 Total Cognitive Skills Activities: {total_activities}")
        print(f"📊 Total Columns: {len(headers)}")
        print()
        
        # Analyze each column
        column_analysis = {}
        
        for col_index, header in enumerate(headers):
            if col_index >= len(cognitive_activities[0]) if cognitive_activities else True:
                continue
                
            print(f"📊 Column {col_index}: '{header}'")
            print("-" * 60)
            
            # Extract values for this column
            values = []
            for row in cognitive_activities:
                if col_index < len(row):
                    values.append(row[col_index])
            
            # Analyze robotic content
            analysis = analyze_column_robotic_content(header, values, total_activities)
            column_analysis[header] = analysis
            
            print(f"   📈 Completion Rate: {analysis['completion_rate']:.1%}")
            print(f"   🔢 Uniqueness Ratio: {analysis['uniqueness_ratio']:.1%}")
            print(f"   🤖 Robotic Score: {analysis['robotic_score']:.1f}% (lower is better)")
            
            if analysis['issues']:
                print(f"   🚨 Issues:")
                for issue in analysis['issues']:
                    print(f"      - {issue}")
            
            if analysis['most_common']:
                print(f"   📋 Most Common Values:")
                for value, count in analysis['most_common']:
                    print(f"      '{value[:50]}{'...' if len(value) > 50 else ''}' - {count} times")
            
            print()
        
        # Overall assessment
        print(f"🎯 OVERALL COGNITIVE SKILLS ASSESSMENT:")
        print("=" * 80)
        
        # Calculate overall scores
        avg_completion = sum(a['completion_rate'] for a in column_analysis.values()) / len(column_analysis)
        avg_uniqueness = sum(a['uniqueness_ratio'] for a in column_analysis.values()) / len(column_analysis)
        avg_robotic = sum(a['robotic_score'] for a in column_analysis.values()) / len(column_analysis)
        
        print(f"📊 Overall Completion Rate: {avg_completion:.1%}")
        print(f"📊 Overall Uniqueness Ratio: {avg_uniqueness:.1%}")
        print(f"📊 Overall Robotic Score: {avg_robotic:.1f}% (lower is better)")
        print()
        
        # Rank columns by robotic content (worst first)
        sorted_columns = sorted(column_analysis.items(), key=lambda x: x[1]['robotic_score'], reverse=True)
        
        print(f"🚨 MOST ROBOTIC COLUMNS (NEED FIXING):")
        print("-" * 60)
        for header, analysis in sorted_columns:
            if analysis['robotic_score'] > 20:  # Only show columns with >20% robotic content
                print(f"   ❌ {header}: {analysis['robotic_score']:.1f}% robotic")
                if analysis['issues']:
                    print(f"      Issues: {', '.join(analysis['issues'][:2])}")
        
        print(f"\n✅ BEST PERFORMING COLUMNS:")
        print("-" * 60)
        for header, analysis in sorted_columns:
            if analysis['robotic_score'] < 10:  # Only show columns with <10% robotic content
                print(f"   ✅ {header}: {analysis['robotic_score']:.1f}% robotic")
        
        # Specific recommendations
        print(f"\n💡 PRIORITY FIXES NEEDED:")
        print("-" * 60)
        
        high_priority = [header for header, analysis in sorted_columns if analysis['robotic_score'] > 40]
        medium_priority = [header for header, analysis in sorted_columns if 20 < analysis['robotic_score'] <= 40]
        
        if high_priority:
            print(f"🔴 HIGH PRIORITY (>40% robotic):")
            for header in high_priority:
                print(f"   - {header}")
        
        if medium_priority:
            print(f"🟡 MEDIUM PRIORITY (20-40% robotic):")
            for header in medium_priority:
                print(f"   - {header}")
        
        print(f"\n📈 GRADE ASSESSMENT:")
        print("-" * 60)
        if avg_robotic < 20:
            grade = "A"
            comment = "Excellent - minimal robotic content"
        elif avg_robotic < 40:
            grade = "B"
            comment = "Good - some robotic content needs fixing"
        elif avg_robotic < 60:
            grade = "C"
            comment = "Fair - significant robotic content"
        else:
            grade = "D"
            comment = "Poor - high robotic content"
        
        print(f"   Grade: {grade} ({avg_robotic:.1f}% robotic)")
        print(f"   Comment: {comment}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error in comprehensive audit: {e}")
        return False

def main():
    """Main function to run comprehensive audit"""
    print("🔍 Comprehensive Audit of All Columns")
    print("=" * 50)
    print("🎯 Detailed analysis of all columns to identify what needs fixing")
    
    success = comprehensive_audit_all_columns()
    
    if success:
        print(f"\n✅ SUCCESS! Comprehensive audit completed!")
        return True
    else:
        print(f"\n❌ FAILED to complete comprehensive audit!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Comprehensive audit completed!")
    else:
        print(f"\n❌ FAILED to complete comprehensive audit!")

