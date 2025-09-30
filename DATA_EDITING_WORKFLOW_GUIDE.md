# 📝 Data Editing Workflow Guide

## 🎯 **The Problem Solved**
You want to edit your data directly in Cursor (not in Excel/Google Sheets) and have those changes automatically sync to Google Sheets for review and feedback.

## 🚀 **Complete Solution**

### **📁 Files Created:**
- `sync_csv_to_sheets.py` - Syncs CSV changes to Google Sheets
- `edit_data_workflow.py` - Manages the editing workflow
- `easy_sync_commands.sh` - Simple commands for editing and syncing

### **🎯 Workflow:**

#### **Step 1: Edit Data in Cursor**
```bash
./easy_sync_commands.sh edit
```
- ✅ Opens CSV file in Cursor
- ✅ Creates automatic backup
- ✅ Shows editing instructions

#### **Step 2: Make Changes**
- Edit the CSV file directly in Cursor
- Modify any column (Materials, Steps, Skills, etc.)
- Add new activities or update existing ones
- Save changes (Ctrl/Cmd + S)

#### **Step 3: Sync to Google Sheets**
```bash
./easy_sync_commands.sh sync
```
- ✅ Syncs all changes to Google Sheets
- ✅ Preserves formatting and filters
- ✅ Shows Google Sheets URL

#### **Step 4: Review in Google Sheets**
- Open the Google Sheets URL
- Use filters to review changes
- Add feedback in the Feedback column
- Export changes back if needed

## 🔧 **Setup Instructions**

### **Prerequisites:**
1. **Google Credentials** (if not already set up):
   ```bash
   # Follow the setup from previous instructions
   # You should have: google-credentials.json
   ```

2. **Python Dependencies** (if not already installed):
   ```bash
   source sheets_env/bin/activate
   pip install gspread oauth2client pandas
   ```

### **First Time Setup:**
1. **Create Google Sheet** (one time only):
   ```bash
   python3 sync_csv_to_sheets.py
   ```
   This creates your Google Sheet with all current data.

2. **Start Editing**:
   ```bash
   ./easy_sync_commands.sh edit
   ```

## 📊 **Available Commands**

### **Edit Data:**
```bash
./easy_sync_commands.sh edit
```
- Opens CSV in Cursor
- Creates backup
- Shows editing instructions

### **Sync Changes:**
```bash
./easy_sync_commands.sh sync
```
- Syncs CSV changes to Google Sheets
- Updates formatting and filters
- Shows Google Sheets URL

### **Create Backup:**
```bash
./easy_sync_commands.sh backup
```
- Creates timestamped backup
- Stores in `data_backups/` folder

### **Show Help:**
```bash
./easy_sync_commands.sh help
```
- Shows all available commands
- Displays typical workflow

## 🎯 **Typical Editing Session**

### **1. Start Editing:**
```bash
./easy_sync_commands.sh edit
```
- CSV opens in Cursor
- Backup created automatically

### **2. Make Changes:**
- Edit materials, steps, skills
- Update activity descriptions
- Add new activities
- Modify difficulty levels

### **3. Sync Changes:**
```bash
./easy_sync_commands.sh sync
```
- Changes appear in Google Sheets
- Formatting preserved
- Filters updated

### **4. Review & Feedback:**
- Open Google Sheets URL
- Use filters to focus on changes
- Add feedback in Feedback column
- Export if needed

## 📋 **Data Structure**

### **Columns You Can Edit:**
- **Activity ID** - Unique identifier
- **Pillar** - Play & Creativity, Cognitive Skills
- **Age Group** - Infant (0-1), Toddler (1-3), etc.
- **Difficulty Level** - Beginner, Intermediate, Advanced
- **Activity Type** - Sensory, Physical, Cognitive, Creative
- **Category** - Specific category within age group
- **Topic** - Activity name
- **Objective** - What the activity achieves
- **Explanation** - How the activity works
- **Materials** - Semicolon-separated list
- **Steps** - Semicolon-separated list
- **Skills** - Semicolon-separated list
- **Estimated Time** - Duration (e.g., "10-15 min")
- **Setup Time** - Preparation time
- **Supervision Level** - High, Medium, Low

### **Editing Tips:**
- Use semicolons (;) to separate lists
- Keep Activity IDs unique
- Use consistent time formats
- Save frequently (Ctrl/Cmd + S)

## 🔄 **Sync Features**

### **Automatic Features:**
- ✅ Preserves all formatting
- ✅ Updates filters
- ✅ Maintains conditional formatting
- ✅ Creates backups before sync
- ✅ Shows Google Sheets URL

### **Error Handling:**
- ✅ Validates CSV file exists
- ✅ Checks Google credentials
- ✅ Shows clear error messages
- ✅ Creates backups before changes

## 🎉 **Benefits**

### **✅ Edit in Cursor:**
- Use your favorite editor
- Full control over data
- Version control with Git
- Easy bulk changes

### **✅ Review in Google Sheets:**
- Visual formatting
- Easy filtering
- Collaborative feedback
- Export capabilities

### **✅ Best of Both Worlds:**
- Edit locally with power tools
- Review visually in Google Sheets
- Automatic sync between both
- Backup and version control

## 🚀 **Quick Start**

1. **First time setup:**
   ```bash
   python3 sync_csv_to_sheets.py
   ```

2. **Start editing:**
   ```bash
   ./easy_sync_commands.sh edit
   ```

3. **Make changes in Cursor**

4. **Sync to Google Sheets:**
   ```bash
   ./easy_sync_commands.sh sync
   ```

5. **Review in Google Sheets**

**Your data editing workflow is now complete! Edit in Cursor, sync to Google Sheets!** 🎉
