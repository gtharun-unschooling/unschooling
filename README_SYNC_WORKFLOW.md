# 🔄 Essential Growth Sync Workflow

## 🎯 **SINGLE SOURCE OF TRUTH SETUP**

Your Essential Growth data now follows this workflow:

### **📊 Google Sheets = Your Primary Data Source**
- ✅ Make ALL changes in Google Sheets
- ✅ Edit activities, materials, steps, skills
- ✅ Add new activities or categories
- ✅ Update descriptions and objectives

### **🔄 Automated Sync Process**
- ✅ Run sync script to pull changes from Google Sheets
- ✅ Local JSON files automatically updated
- ✅ Website displays latest data

---

## 🚀 **HOW TO USE**

### **1. Make Changes in Google Sheets**
- Open your Google Sheets
- Edit any activities, materials, steps, etc.
- Save your changes

### **2. Sync to Website**
```bash
# Run this command to sync changes
python sync_essential_growth.py
```

### **3. Deploy to Website**
- Deploy the updated JSON files to your website
- Changes are now live!

---

## 📁 **FILES UPDATED AUTOMATICALLY**

When you run the sync script, these files are updated:

```
public/data/essential-growth/
├── play-creativity/
│   ├── activities.json (120 activities)
│   └── index.json (metadata)
├── cognitive-skills/
│   ├── activities.json (20 activities)
│   └── index.json (metadata)
└── index.json (framework)
```

---

## ✅ **BENEFITS**

- **Single Source of Truth**: Google Sheets only
- **No Manual JSON Editing**: Everything automated
- **Version Control**: All changes tracked in Google Sheets
- **Collaboration**: Multiple people can edit in Google Sheets
- **Backup**: Google Sheets provides automatic backup
- **Easy Updates**: Just run one command to sync

---

## 🎯 **YOUR NEW WORKFLOW**

1. **Edit in Google Sheets** → Make changes
2. **Run Sync Script** → `python sync_essential_growth.py`
3. **Deploy to Website** → Upload updated JSON files
4. **Changes Live** → Website shows latest data

**That's it! No more manual JSON editing needed!** 🎉
