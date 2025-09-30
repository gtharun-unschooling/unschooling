#!/usr/bin/env python3
"""
🔍 Audit All Columns Quality
Comprehensive analysis of all columns in Cognitive Skills pillar for robotic content and quality
"""

import gspread
from google.oauth2.service_account import Credentials
from collections import defaultdict, Counter
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
        return None

def analyze_column_quality(column_name, values, total_activities):
    """Analyze the quality of a specific column"""
    
    # Remove empty values
    non_empty_values = [v for v in values if v.strip()]
    
    if not non_empty_values:
        return {
            'completion_rate': 0,
            'uniqueness_ratio': 0,
            'robotic_score': 100,
            'quality_score': 0,
            'issues': ['Empty column']
        }
    
    # Calculate completion rate
    completion_rate = len(non_empty_values) / total_activities
    
    # Calculate uniqueness ratio
    unique_values = len(set(non_empty_values))
    uniqueness_ratio = unique_values / len(non_empty_values)
    
    # Check for robotic patterns
    robotic_patterns = [
        r'^Your (baby|child|toddler|preschooler|teen)',
        r'^This (engaging|comprehensive) activity',
        r'^Develop (essential|core) cognitive skills',
        r'^Age-appropriate (activities|materials|tools)',
        r'^Use age-appropriate activities',
        r'^Guide skill development',
        r'^Celebrate cognitive growth',
        r'^Hands-on, age-appropriate exercises',
        r'^Educational cognitive development kits',
        r'^No corrections needed',
        r'^Ready for parent engagement',
        r'^Cognitive Development, Critical Thinking, Problem Solving',
        r'^Essential cognitive skills through hands-on',
        r'^The structured approach builds confidence',
        r'^Children gain practical experience',
        r'^Mental flexibility and analytical skills'
    ]
    
    robotic_count = 0
    for value in non_empty_values:
        for pattern in robotic_patterns:
            if re.search(pattern, value, re.IGNORECASE):
                robotic_count += 1
                break
    
    robotic_score = (robotic_count / len(non_empty_values)) * 100
    
    # Check for specific issues
    issues = []
    
    # Check for repetition
    value_counts = Counter(non_empty_values)
    most_common = value_counts.most_common(3)
    for value, count in most_common:
        if count > total_activities * 0.1:  # More than 10% repetition
            issues.append(f'High repetition: "{value[:50]}..." ({count} times)')
    
    # Check for generic content
    generic_indicators = ['age-appropriate', 'cognitive development', 'essential skills', 'hands-on']
    generic_count = sum(1 for value in non_empty_values 
                       if any(indicator in value.lower() for indicator in generic_indicators))
    
    if generic_count > len(non_empty_values) * 0.3:  # More than 30% generic
        issues.append(f'High generic content ({generic_count}/{len(non_empty_values)})')
    
    # Check for empty or very short content
    short_count = sum(1 for value in non_empty_values if len(value.strip()) < 20)
    if short_count > 0:
        issues.append(f'Very short content: {short_count} entries')
    
    # Calculate overall quality score
    quality_score = 0
    quality_score += completion_rate * 25  # 25 points for completion
    quality_score += uniqueness_ratio * 25  # 25 points for uniqueness
    quality_score += max(0, (100 - robotic_score) * 0.3)  # 30 points for non-robotic content
    quality_score += max(0, (100 - len(issues) * 10))  # 20 points for fewer issues
    
    return {
        'completion_rate': completion_rate,
        'uniqueness_ratio': uniqueness_ratio,
        'robotic_score': robotic_score,
        'quality_score': min(100, quality_score),
        'issues': issues,
        'most_common': most_common[:3]
    }

def audit_cognitive_skills_quality():
    """Comprehensive audit of Cognitive Skills pillar quality"""
    
    try:
        print(f"🔍 COMPREHENSIVE COGNITIVE SKILLS QUALITY AUDIT:")
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
            
            # Analyze quality
            analysis = analyze_column_quality(header, values, total_activities)
            column_analysis[header] = analysis
            
            print(f"   📈 Completion Rate: {analysis['completion_rate']:.1%}")
            print(f"   🔢 Uniqueness Ratio: {analysis['uniqueness_ratio']:.1%}")
            print(f"   🤖 Robotic Score: {analysis['robotic_score']:.1f}% (lower is better)")
            print(f"   ⭐ Quality Score: {analysis['quality_score']:.1f}/100")
            
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
        print(f"🎯 OVERALL COGNITIVE SKILLS PILLAR ASSESSMENT:")
        print("=" * 80)
        
        # Calculate overall scores
        avg_completion = sum(a['completion_rate'] for a in column_analysis.values()) / len(column_analysis)
        avg_uniqueness = sum(a['uniqueness_ratio'] for a in column_analysis.values()) / len(column_analysis)
        avg_robotic = sum(a['robotic_score'] for a in column_analysis.values()) / len(column_analysis)
        avg_quality = sum(a['quality_score'] for a in column_analysis.values()) / len(column_analysis)
        
        print(f"📊 Overall Completion Rate: {avg_completion:.1%}")
        print(f"📊 Overall Uniqueness Ratio: {avg_uniqueness:.1%}")
        print(f"📊 Overall Robotic Score: {avg_robotic:.1f}% (lower is better)")
        print(f"⭐ Overall Quality Score: {avg_quality:.1f}/100")
        print()
        
        # Rank columns by quality
        sorted_columns = sorted(column_analysis.items(), key=lambda x: x[1]['quality_score'], reverse=True)
        
        print(f"🏆 TOP PERFORMING COLUMNS:")
        print("-" * 40)
        for header, analysis in sorted_columns[:5]:
            print(f"   ✅ {header}: {analysis['quality_score']:.1f}/100")
        
        print(f"\n🚨 PROBLEMATIC COLUMNS:")
        print("-" * 40)
        for header, analysis in sorted_columns[-5:]:
            print(f"   ❌ {header}: {analysis['quality_score']:.1f}/100")
            if analysis['issues']:
                print(f"      Issues: {', '.join(analysis['issues'][:2])}")
        
        # Specific robotic content analysis
        print(f"\n🤖 ROBOTIC CONTENT ANALYSIS:")
        print("-" * 40)
        robotic_columns = [(header, analysis) for header, analysis in column_analysis.items() 
                          if analysis['robotic_score'] > 20]
        
        if robotic_columns:
            print(f"🚨 Columns with high robotic content (>20%):")
            for header, analysis in sorted(robotic_columns, key=lambda x: x[1]['robotic_score'], reverse=True):
                print(f"   ❌ {header}: {analysis['robotic_score']:.1f}% robotic")
        else:
            print(f"✅ No columns with high robotic content detected!")
        
        # Recommendations
        print(f"\n💡 RECOMMENDATIONS:")
        print("-" * 40)
        
        if avg_robotic > 30:
            print(f"🔴 HIGH PRIORITY: Reduce robotic content (currently {avg_robotic:.1f}%)")
        
        if avg_completion < 0.8:
            print(f"🟡 MEDIUM PRIORITY: Improve completion rates (currently {avg_completion:.1%})")
        
        if avg_uniqueness < 0.5:
            print(f"🟡 MEDIUM PRIORITY: Increase content uniqueness (currently {avg_uniqueness:.1%})")
        
        if avg_quality < 70:
            print(f"🔴 HIGH PRIORITY: Overall quality needs improvement (currently {avg_quality:.1f}/100)")
        
        print(f"\n📈 GRADE ASSESSMENT:")
        print("-" * 40)
        if avg_quality >= 90:
            grade = "A+"
            comment = "Excellent quality - professional, unique, engaging content"
        elif avg_quality >= 80:
            grade = "A"
            comment = "Good quality with minor improvements needed"
        elif avg_quality >= 70:
            grade = "B"
            comment = "Fair quality - several areas need improvement"
        elif avg_quality >= 60:
            grade = "C"
            comment = "Below average - significant improvements required"
        else:
            grade = "D"
            comment = "Poor quality - major overhaul needed"
        
        print(f"   Grade: {grade} ({avg_quality:.1f}/100)")
        print(f"   Comment: {comment}")
        
        return True
        
    except Exception as e:
        print(f"❌ Error auditing quality: {e}")
        return False

def main():
    """Main function to audit all columns"""
    print("🔍 Audit All Columns Quality")
    print("=" * 50)
    print("🎯 Comprehensive analysis of Cognitive Skills pillar quality")
    
    success = audit_cognitive_skills_quality()
    
    if success:
        print(f"\n✅ SUCCESS! Quality audit completed!")
        return True
    else:
        print(f"\n❌ FAILED to audit quality!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Quality audit completed!")
    else:
        print(f"\n❌ FAILED to audit quality!")
