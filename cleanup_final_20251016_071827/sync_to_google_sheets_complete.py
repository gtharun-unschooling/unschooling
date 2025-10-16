import gspread
from google.oauth2.service_account import Credentials
import pandas as pd
import time

def sync_enhanced_activities_to_google_sheets():
    """
    Sync the enhanced activities to Google Sheets
    """
    # Read the enhanced CSV
    df = pd.read_csv('essential-growth-activities-enhanced.csv')
    
    print('=== SYNCING ENHANCED ACTIVITIES TO GOOGLE SHEETS ===')
    print(f'Total activities to sync: {len(df)}')
    print(f'Pillars: {df["Pillar"].value_counts().to_dict()}')
    print(f'Age Groups: {df["Age Group"].value_counts().to_dict()}')
    print(f'Activity Types: {df["Activity Type"].value_counts().to_dict()}')
    
    # Set up credentials
    SCOPES = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive']
    SERVICE_ACCOUNT_FILE = 'google-credentials.json'
    credentials = Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)
    gc = gspread.authorize(credentials)
    
    try:
        # List all spreadsheets
        spreadsheets = gc.list_spreadsheet_files()
        print(f'\nFound {len(spreadsheets)} spreadsheets:')
        for sheet in spreadsheets:
            print(f'- {sheet["name"]} (ID: {sheet["id"]})')
        
        if spreadsheets:
            # Use the first available spreadsheet
            spreadsheet = gc.open_by_key(spreadsheets[0]['id'])
            print(f'\nUsing spreadsheet: {spreadsheet.title}')
            
            # Get the first worksheet
            worksheet = spreadsheet.worksheet('Sheet1')
            
            # Clear existing data
            worksheet.clear()
            print('✅ Cleared existing data')
            
            # Prepare headers
            headers = list(df.columns)
            worksheet.append_row(headers)
            print(f'✅ Added headers: {len(headers)} columns')
            
            # Add data in batches to avoid API limits
            batch_size = 25
            total_rows = len(df)
            
            print(f'\n📤 Uploading {total_rows} activities in batches of {batch_size}...')
            
            for i in range(0, total_rows, batch_size):
                batch_df = df.iloc[i:i+batch_size]
                batch_data = batch_df.values.tolist()
                worksheet.append_rows(batch_data)
                print(f'✅ Uploaded batch {i//batch_size + 1}/{(total_rows-1)//batch_size + 1}')
                time.sleep(2)  # Rate limiting
            
            print(f'\n🎉 Successfully synced {total_rows} activities to Google Sheets!')
            print(f'📊 Spreadsheet URL: https://docs.google.com/spreadsheets/d/{spreadsheet.id}')
            
            # Create summary
            print('\n=== SYNC SUMMARY ===')
            print(f'Total activities synced: {total_rows}')
            print(f'Pillars: {df["Pillar"].value_counts().to_dict()}')
            print(f'Age Groups: {df["Age Group"].value_counts().to_dict()}')
            print(f'Activity Types: {df["Activity Type"].value_counts().to_dict()}')
            print(f'Difficulty Levels: {df["Difficulty Level"].value_counts().to_dict()}')
            print(f'Parent Involvement: {df["Parent Involvement"].value_counts().to_dict()}')
            
            return True
            
        else:
            print('❌ No spreadsheets found. Please create a spreadsheet first.')
            return False
            
    except Exception as e:
        print(f'❌ Error syncing to Google Sheets: {e}')
        print('Creating local backup instead...')
        
        # Create a comprehensive local backup
        timestamp = pd.Timestamp.now().strftime('%Y%m%d_%H%M%S')
        backup_filename = f'essential-growth-activities-enhanced-backup-{timestamp}.csv'
        df.to_csv(backup_filename, index=False)
        print(f'✅ Created local backup: {backup_filename}')
        
        # Create summary file
        summary = f'''
# Essential Growth Activities - Enhanced
Total Activities: {len(df)}
Pillars: {df['Pillar'].value_counts().to_dict()}
Age Groups: {df['Age Group'].value_counts().to_dict()}
Activity Types: {df['Activity Type'].value_counts().to_dict()}
Difficulty Levels: {df['Difficulty Level'].value_counts().to_dict()}
Parent Involvement: {df['Parent Involvement'].value_counts().to_dict()}

## New Categories Added:
{df['Category'].value_counts().to_dict()}

## Sample Activities:
{df[['Pillar', 'Age Group', 'Category', 'Activity Name']].head(10).to_string()}
'''
        
        with open('essential-growth-activities-summary.txt', 'w') as f:
            f.write(summary)
        
        print('✅ Created comprehensive local backup and summary')
        print('📁 Files created:')
        print(f'   - {backup_filename} (main data)')
        print('   - essential-growth-activities-summary.txt (summary)')
        
        return False

if __name__ == "__main__":
    success = sync_enhanced_activities_to_google_sheets()
    if success:
        print('\n🎉 Google Sheets sync completed successfully!')
    else:
        print('\n📁 Local backup created. You can manually upload to Google Sheets later.')
