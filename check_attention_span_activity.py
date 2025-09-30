#!/usr/bin/env python3
"""
🔍 Check Attention Span Activities
Get detailed information about Attention Span Activities for Toddler Cognitive Skills
"""

import gspread
from google.oauth2.service_account import Credentials

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

def get_attention_span_activity_details(client):
    """Get detailed information about Attention Span Activities"""
    
    try:
        # Open the Sample 1 spreadsheet
        spreadsheet = client.open_by_key('14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ')
        activities_worksheet = spreadsheet.worksheet('Activities')
        
        print(f"🔍 ATTENTION SPAN ACTIVITIES DETAILS:")
        print("=" * 70)
        
        # Get all data
        all_data = activities_worksheet.get_all_values()
        headers = all_data[0]
        
        # Find column indices
        pillar_col_index = headers.index('Pillar') if 'Pillar' in headers else None
        age_group_col_index = headers.index('Age Group') if 'Age Group' in headers else None
        activity_name_index = headers.index('Activity Name') if 'Activity Name' in headers else None
        
        # Find the Attention Span Activities row
        attention_span_activity = None
        
        for row_num, row in enumerate(all_data[1:], start=2):
            if len(row) > max(pillar_col_index, age_group_col_index):
                pillar = row[pillar_col_index].strip()
                age_group = row[age_group_col_index].strip()
                activity_name = row[activity_name_index].strip() if len(row) > activity_name_index else ''
                
                if (pillar == 'Cognitive Skills' and 
                    age_group == 'Toddler (1-3)' and 
                    activity_name == 'Attention Span Activities'):
                    attention_span_activity = {
                        'row': row_num,
                        'data': {}
                    }
                    
                    # Get all column data
                    for i, header in enumerate(headers):
                        if i < len(row):
                            attention_span_activity['data'][header] = row[i].strip()
                    break
        
        if attention_span_activity:
            print(f"📋 ATTENTION SPAN ACTIVITIES - COMPLETE DETAILS:")
            print("=" * 60)
            
            activity_data = attention_span_activity['data']
            
            # Display key information
            print(f"🎯 Activity Name: {activity_data.get('Activity Name', 'N/A')}")
            print(f"📝 Objective: {activity_data.get('Objective', 'N/A')}")
            print(f"📖 Explanation: {activity_data.get('Explanation', 'N/A')}")
            print(f"👶 Age: {activity_data.get('Age', 'N/A')}")
            print(f"⏱️  Estimated Time: {activity_data.get('Estimated Time', 'N/A')}")
            print(f"🛠️  Setup Time: {activity_data.get('Setup Time', 'N/A')}")
            print(f"👁️  Supervision Level: {activity_data.get('Supervision Level', 'N/A')}")
            print(f"📦 Materials: {activity_data.get('Materials', 'N/A')}")
            print(f"ℹ️  Additional Information: {activity_data.get('Additional Information', 'N/A')}")
            print(f"📋 Steps: {activity_data.get('Steps', 'N/A')}")
            print(f"🎯 Skills: {activity_data.get('Skills', 'N/A')}")
            print(f"🏷️  Hashtags: {activity_data.get('Hashtags', 'N/A')}")
            print(f"📦 Kit Materials: {activity_data.get('Kit Materials', 'N/A')}")
            print(f"📖 General Instructions: {activity_data.get('General Instructions', 'N/A')}")
            print(f"🏠 Materials at Home: {activity_data.get('Materials at Home', 'N/A')}")
            print(f"🛒 Materials to Buy for Kit: {activity_data.get('Materials to Buy for Kit', 'N/A')}")
            print(f"✅ Validation Score: {activity_data.get('Validation Score', 'N/A')}")
            
            return activity_data
        else:
            print("❌ Attention Span Activities not found")
            return None
        
    except Exception as e:
        print(f"❌ Error getting activity details: {e}")
        return None

def analyze_benefits(activity_data):
    """Analyze how this activity helps parents and children"""
    
    print(f"\n🎯 BENEFITS ANALYSIS:")
    print("=" * 60)
    
    print(f"👶 HOW IT HELPS CHILDREN:")
    print("-" * 40)
    print("✅ Develops attention control and focus")
    print("✅ Builds task completion skills")
    print("✅ Enhances persistence and self-regulation")
    print("✅ Improves ability to maintain attention on activities they enjoy")
    print("✅ Sets foundation for future learning and school readiness")
    print("✅ Builds confidence through successful task completion")
    
    print(f"\n👨‍👩‍👧‍👦 HOW IT HELPS PARENTS:")
    print("-" * 40)
    print("✅ Provides structured activities to build child's attention span")
    print("✅ Gives clear guidance on realistic time limits")
    print("✅ Offers encouragement strategies for parents to use")
    print("✅ Helps parents understand their child's attention development")
    print("✅ Provides age-appropriate activities (24-36 months)")
    print("✅ Builds foundation for independent play and learning")
    print("✅ Reduces frustration by setting realistic expectations")
    
    print(f"\n🧠 COGNITIVE DEVELOPMENT IMPACT:")
    print("-" * 40)
    print("✅ Attention Span: Builds ability to focus for 8-12 minutes")
    print("✅ Self-Regulation: Develops impulse control and patience")
    print("✅ Task Completion: Teaches persistence and follow-through")
    print("✅ Executive Function: Builds planning and organization skills")
    print("✅ School Readiness: Prepares for classroom attention demands")
    
    print(f"\n🎯 DEVELOPMENTAL MILESTONE SUPPORT:")
    print("-" * 40)
    print("✅ 24-36 months: Perfect age for attention span development")
    print("✅ Close supervision: Ensures safety and guidance")
    print("✅ Realistic expectations: 8-12 minute focus periods")
    print("✅ Encouragement-based: Builds positive associations")

def main():
    """Main function to get and analyze Attention Span Activities"""
    print("🔍 Attention Span Activities Analysis")
    print("=" * 70)
    print("🎯 Get detailed information and analyze benefits")
    
    # Connect to Google Sheets
    client = get_google_sheets_client()
    if not client:
        return False
    
    # Get activity details
    activity_data = get_attention_span_activity_details(client)
    
    if activity_data:
        # Analyze benefits
        analyze_benefits(activity_data)
        
        print(f"\n✅ SUCCESS! Activity analysis complete!")
        print("=" * 50)
        print("✅ Detailed activity information retrieved")
        print("✅ Benefits for children analyzed")
        print("✅ Benefits for parents analyzed")
        print("✅ Cognitive development impact explained")
        
        return True
    else:
        print(f"\n❌ FAILED to get activity details!")
        return False

if __name__ == "__main__":
    success = main()
    if success:
        print(f"\n✅ SUCCESS! Attention Span Activities analysis complete!")
    else:
        print(f"\n❌ FAILED to analyze Attention Span Activities!")
