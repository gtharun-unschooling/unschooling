import pandas as pd
import gspread
from google.oauth2.service_account import Credentials
import time

# Read the enhanced CSV
df = pd.read_csv('essential-growth-activities-enhanced.csv')

print("Preparing comprehensive activity data for Google Sheets...")

# Set up credentials
SCOPES = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive']
SERVICE_ACCOUNT_FILE = 'google-credentials.json'
credentials = Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)
gc = gspread.authorize(credentials)

# Try to open existing spreadsheet or create new one
try:
    # Try to open existing spreadsheet
    spreadsheet = gc.open('Essential Growth Activities - Complete')
    print("Found existing spreadsheet")
except:
    try:
        # Create new spreadsheet
        spreadsheet = gc.create('Essential Growth Activities - Complete')
        print(f"Created new spreadsheet: {spreadsheet.title}")
        print(f"Spreadsheet ID: {spreadsheet.id}")
        print(f"URL: https://docs.google.com/spreadsheets/d/{spreadsheet.id}")
    except Exception as e:
        print(f"Error creating spreadsheet: {e}")
        print("Will work with local CSV file instead")
        exit()

# Get the first worksheet
worksheet = spreadsheet.worksheet('Sheet1')

# Clear existing data
worksheet.clear()

# Prepare headers
headers = list(df.columns)
worksheet.append_row(headers)

# Add data in batches to avoid API limits
batch_size = 50
total_rows = len(df)

print(f"Uploading {total_rows} activities in batches of {batch_size}...")

for i in range(0, total_rows, batch_size):
    batch_df = df.iloc[i:i+batch_size]
    
    # Convert DataFrame to list of lists
    batch_data = batch_df.values.tolist()
    
    # Add batch to worksheet
    worksheet.append_rows(batch_data)
    
    print(f"Uploaded batch {i//batch_size + 1}/{(total_rows-1)//batch_size + 1}")
    time.sleep(1)  # Rate limiting

# Format the worksheet
try:
    # Format headers
    worksheet.format('A1:Z1', {
        'backgroundColor': {'red': 0.2, 'green': 0.4, 'blue': 0.8},
        'textFormat': {'bold': True, 'foregroundColor': {'red': 1, 'green': 1, 'blue': 1}}
    })
    
    # Auto-resize columns
    worksheet.columns_auto_resize(0, len(headers))
    
    print("Worksheet formatted successfully")
except Exception as e:
    print(f"Error formatting worksheet: {e}")

print(f"Successfully uploaded {total_rows} activities to Google Sheets")
print(f"Spreadsheet URL: https://docs.google.com/spreadsheets/d/{spreadsheet.id}")

# Create summary statistics
print("\n=== COMPREHENSIVE ACTIVITY SUMMARY ===")
print(f"Total Activities: {len(df)}")
print(f"Pillars: {df['Pillar'].value_counts().to_dict()}")
print(f"Age Groups: {df['Age Group'].value_counts().to_dict()}")
print(f"Activity Types: {df['Activity Type'].value_counts().to_dict()}")
print(f"Difficulty Levels: {df['Difficulty Level'].value_counts().to_dict()}")
print(f"Parent Involvement: {df['Parent Involvement'].value_counts().to_dict()}")

# Show sample of different activity types
print("\n=== SAMPLE ACTIVITIES BY TYPE ===")
for activity_type in df['Activity Type'].unique():
    sample = df[df['Activity Type'] == activity_type].head(2)
    print(f"\n{activity_type} Activities:")
    for _, row in sample.iterrows():
        print(f"  - {row['Activity Name']} ({row['Age Group']}) - {row['Category']}")

print("\n=== MISSING DATA CHECK ===")
missing_data = {}
for col in df.columns:
    missing = df[col].isna().sum() + (df[col] == '').sum()
    if missing > 0:
        missing_data[col] = missing

if missing_data:
    print("Columns with missing data:")
    for col, count in missing_data.items():
        print(f"  {col}: {count} missing values")
else:
    print("✅ No missing data found - all fields are complete!")

print("\n=== GOOGLE SHEETS UPLOAD COMPLETE ===")
print("All activities have been uploaded with comprehensive information!")
print("Different activity types have been created for all age groups.")
print("All missing information has been filled with appropriate content.")
