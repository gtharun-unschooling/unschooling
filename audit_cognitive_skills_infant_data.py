#!/usr/bin/env python3
"""
🔍 Comprehensive Column-by-Column Audit of Cognitive Skills Infant Data
Detailed analysis of data quality, completeness, and consistency
"""

import gspread
from google.oauth2.service_account import Credentials
import json

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
        print("✅ Connected to Google Sheets")
        return client
    except Exception as e:
        print(f"❌ Error connecting to Google Sheets: {e}")
        return None

def comprehensive_audit_infant_data(client):
    """Perform comprehensive column-by-column audit of infant data"""
    try:
        # Find the spreadsheet
        all_sheets = client.list_spreadsheet_files()
        target_sheet = None
        
        for sheet in all_sheets:
            title = sheet.get('name', sheet.get('title', '')).lower()
            if 'sample' in title or 'essential' in title:
                target_sheet = sheet
                break
        
        if not target_sheet:
            print("❌ No suitable spreadsheet found")
            return None
        
        # Open the spreadsheet
        spreadsheet = client.open_by_key(target_sheet['id'])
        worksheet = spreadsheet.get_worksheet(0)
        
        print(f"📤 Working with: {target_sheet.get('name', 'Unknown')}")
        
        # Get all data
        all_data = worksheet.get_all_values()
        if not all_data:
            print("❌ No data found")
            return None
        
        headers = all_data[0]
        print(f"\n📋 AUDITING {len(headers)} COLUMNS")
        print("=" * 60)
        
        # Find column indices for key fields
        column_indices = {}
        for i, header in enumerate(headers):
            column_indices[header] = i
        
        # Filter for Cognitive Skills infant data
        infant_data = []
        pillar_col_index = column_indices.get('Pillar')
        age_group_col_index = column_indices.get('Age Group')
        
        for row_num, row in enumerate(all_data[1:], start=2):
            if (len(row) > pillar_col_index and row[pillar_col_index].strip() == 'Cognitive Skills' and
                len(row) > age_group_col_index and 'infant' in row[age_group_col_index].lower()):
                infant_data.append((row_num, row))
        
        print(f"👶 Found {len(infant_data)} Cognitive Skills infant activities")
        
        if not infant_data:
            print("❌ No infant data found")
            return None
        
        # Comprehensive column-by-column audit
        print(f"\n🔍 COMPREHENSIVE COLUMN-BY-COLUMN AUDIT")
        print("=" * 60)
        
        audit_results = {}
        
        # Define critical columns and their expected characteristics
        critical_columns = {
            'Activity ID': {'required': True, 'type': 'identifier', 'description': 'Unique identifier for activity'},
            'Pillar': {'required': True, 'type': 'text', 'description': 'Should be "Cognitive Skills"'},
            'Age Group': {'required': True, 'type': 'text', 'description': 'Should be "Infant (0-1)"'},
            'Category': {'required': True, 'type': 'text', 'description': 'Cognitive development category'},
            'Category Description': {'required': True, 'type': 'text', 'description': 'Description of the category'},
            'Topic Number': {'required': True, 'type': 'number', 'description': 'Sequential topic number'},
            'Topic': {'required': True, 'type': 'text', 'description': 'Activity topic/title'},
            'Activity Name': {'required': True, 'type': 'text', 'description': 'Name of the activity'},
            'Objective': {'required': True, 'type': 'text', 'description': 'Learning objective'},
            'Explanation': {'required': True, 'type': 'text', 'description': 'Detailed explanation'},
            'Age': {'required': True, 'type': 'text', 'description': 'Specific age range'},
            'Estimated Time': {'required': True, 'type': 'text', 'description': 'Activity duration'},
            'Materials': {'required': True, 'type': 'text', 'description': 'Required materials'},
            'Steps': {'required': True, 'type': 'text', 'description': 'Step-by-step instructions'},
            'Skills': {'required': True, 'type': 'text', 'description': 'Skills developed'},
            'Hashtags': {'required': True, 'type': 'text', 'description': 'Relevant hashtags'},
            'Difficulty Level': {'required': False, 'type': 'text', 'description': 'Difficulty assessment'},
            'Activity Type': {'required': False, 'type': 'text', 'description': 'Type of activity'},
            'Setup Time': {'required': False, 'type': 'text', 'description': 'Time to setup'},
            'Supervision Level': {'required': False, 'type': 'text', 'description': 'Supervision required'},
            'Additional Information': {'required': False, 'type': 'text', 'description': 'Extra information'},
            'Kit Materials': {'required': False, 'type': 'text', 'description': 'Kit-specific materials'},
            'General Instructions': {'required': False, 'type': 'text', 'description': 'General guidance'},
            'Materials at Home': {'required': False, 'type': 'text', 'description': 'Home-available materials'},
            'Materials to Buy for Kit': {'required': False, 'type': 'text', 'description': 'Kit materials to purchase'}
        }
        
        # Audit each column
        for column_name, column_spec in critical_columns.items():
            if column_name not in column_indices:
                audit_results[column_name] = {'status': 'MISSING', 'issues': ['Column not found in headers']}
                continue
            
            col_index = column_indices[column_name]
            issues = []
            empty_count = 0
            content_samples = []
            
            print(f"\n📊 AUDITING COLUMN: {column_name}")
            print(f"   Description: {column_spec['description']}")
            print(f"   Required: {'Yes' if column_spec['required'] else 'No'}")
            
            # Check each row for this column
            for row_num, row in infant_data:
                if col_index < len(row):
                    value = row[col_index].strip()
                    if not value:
                        empty_count += 1
                        if column_spec['required']:
                            issues.append(f"Row {row_num}: Empty required field")
                    else:
                        # Collect samples for analysis
                        if len(content_samples) < 3:
                            content_samples.append((row_num, value[:100] + "..." if len(value) > 100 else value))
                        
                        # Specific validations based on column type
                        if column_name == 'Pillar' and value != 'Cognitive Skills':
                            issues.append(f"Row {row_num}: Invalid pillar '{value}'")
                        elif column_name == 'Age Group' and 'infant' not in value.lower():
                            issues.append(f"Row {row_num}: Invalid age group '{value}'")
                        elif column_name == 'Topic Number':
                            try:
                                int(value)
                            except ValueError:
                                issues.append(f"Row {row_num}: Invalid topic number '{value}'")
                        elif column_name == 'Estimated Time' and not any(char in value for char in ['min', 'hour', 'minute']):
                            issues.append(f"Row {row_num}: Unclear time format '{value}'")
                        elif column_name == 'Steps' and not any(char in value for char in ['1.', '2.', '3.', '•', ';']):
                            issues.append(f"Row {row_num}: Steps may not be properly formatted")
                        elif column_name == 'Skills' and not any(char in value for char in [',', ';']):
                            issues.append(f"Row {row_num}: Skills may not be properly separated")
                        elif column_name == 'Hashtags' and not value.startswith('#'):
                            issues.append(f"Row {row_num}: Hashtags may not be properly formatted")
                else:
                    empty_count += 1
                    if column_spec['required']:
                        issues.append(f"Row {row_num}: Column not present in row")
            
            # Calculate completion percentage
            total_rows = len(infant_data)
            completion_rate = ((total_rows - empty_count) / total_rows) * 100
            
            # Determine status
            if empty_count == 0 and not issues:
                status = "EXCELLENT"
            elif empty_count == 0 and len(issues) < 3:
                status = "GOOD"
            elif completion_rate >= 80 and len(issues) < 5:
                status = "ACCEPTABLE"
            else:
                status = "NEEDS_IMPROVEMENT"
            
            audit_results[column_name] = {
                'status': status,
                'completion_rate': completion_rate,
                'empty_count': empty_count,
                'total_rows': total_rows,
                'issues': issues,
                'samples': content_samples
            }
            
            print(f"   Status: {status}")
            print(f"   Completion: {completion_rate:.1f}% ({total_rows - empty_count}/{total_rows})")
            if issues:
                print(f"   Issues: {len(issues)} found")
                for issue in issues[:3]:  # Show first 3 issues
                    print(f"     - {issue}")
                if len(issues) > 3:
                    print(f"     - ... and {len(issues) - 3} more")
            else:
                print(f"   Issues: None")
            
            if content_samples:
                print(f"   Sample content:")
                for row_num, sample in content_samples:
                    print(f"     Row {row_num}: {sample}")
        
        # Overall assessment
        print(f"\n📋 OVERALL ASSESSMENT")
        print("=" * 40)
        
        excellent_count = sum(1 for result in audit_results.values() if result['status'] == 'EXCELLENT')
        good_count = sum(1 for result in audit_results.values() if result['status'] == 'GOOD')
        acceptable_count = sum(1 for result in audit_results.values() if result['status'] == 'ACCEPTABLE')
        needs_improvement_count = sum(1 for result in audit_results.values() if result['status'] == 'NEEDS_IMPROVEMENT')
        
        total_columns = len(audit_results)
        
        print(f"✅ Excellent: {excellent_count}/{total_columns} columns")
        print(f"🟢 Good: {good_count}/{total_columns} columns")
        print(f"🟡 Acceptable: {acceptable_count}/{total_columns} columns")
        print(f"🔴 Needs Improvement: {needs_improvement_count}/{total_columns} columns")
        
        # Critical issues summary
        critical_issues = []
        for column_name, result in audit_results.items():
            if result['status'] == 'NEEDS_IMPROVEMENT':
                critical_issues.extend([f"{column_name}: {issue}" for issue in result['issues'][:2]])
        
        if critical_issues:
            print(f"\n🚨 CRITICAL ISSUES TO ADDRESS:")
            for issue in critical_issues[:10]:
                print(f"   - {issue}")
        else:
            print(f"\n🎉 NO CRITICAL ISSUES FOUND!")
        
        # Recommendations
        print(f"\n💡 RECOMMENDATIONS:")
        if needs_improvement_count > 0:
            print("   1. Address columns marked as 'NEEDS_IMPROVEMENT'")
            print("   2. Fill in missing required fields")
            print("   3. Standardize formatting in identified areas")
        if excellent_count + good_count >= total_columns * 0.8:
            print("   ✅ Data quality is generally excellent!")
            print("   ✅ Minor improvements can enhance consistency")
        else:
            print("   ⚠️  Significant improvements needed")
            print("   ⚠️  Focus on critical columns first")
        
        return {
            'total_activities': len(infant_data),
            'total_columns': total_columns,
            'audit_results': audit_results,
            'summary': {
                'excellent': excellent_count,
                'good': good_count,
                'acceptable': acceptable_count,
                'needs_improvement': needs_improvement_count
            }
        }
        
    except Exception as e:
        print(f"❌ Error during audit: {e}")
        return None

def main():
    """Main function to perform comprehensive audit"""
    print("🔍 Comprehensive Column-by-Column Audit of Cognitive Skills Infant Data")
    print("=" * 80)
    
    # Connect to Google Sheets
    client = get_google_sheets_client()
    if not client:
        return False
    
    # Perform audit
    audit_results = comprehensive_audit_infant_data(client)
    
    if audit_results:
        print(f"\n🎯 FINAL VERDICT:")
        print("=" * 30)
        
        summary = audit_results['summary']
        total = audit_results['total_columns']
        quality_score = (summary['excellent'] * 4 + summary['good'] * 3 + summary['acceptable'] * 2 + summary['needs_improvement'] * 1) / (total * 4) * 100
        
        print(f"📊 Quality Score: {quality_score:.1f}/100")
        print(f"📈 Data Completeness: {audit_results['total_activities']} infant activities")
        print(f"📋 Column Coverage: {audit_results['total_columns']} columns audited")
        
        if quality_score >= 90:
            print(f"🏆 EXCELLENT JOB! Data quality is outstanding!")
        elif quality_score >= 75:
            print(f"👍 GOOD JOB! Data quality is solid with minor improvements needed")
        elif quality_score >= 60:
            print(f"⚠️  ACCEPTABLE JOB! Some improvements needed")
        else:
            print(f"🔴 NEEDS WORK! Significant improvements required")
        
        return True
    else:
        print("❌ Audit failed")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ Comprehensive audit completed!")
    else:
        print(f"\n❌ Comprehensive audit failed!")
