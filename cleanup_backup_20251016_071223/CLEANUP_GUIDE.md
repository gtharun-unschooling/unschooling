# 🧹 Sheet Cleanup Guide

## Quick Command

To perform cleanup on new rows, simply run:

```bash
python3 cleanup.py
```

This will give you a menu to choose which age group to clean up.

## What Cleanup Does

The cleanup process performs these actions automatically (in order):

### 🚨 CRITICAL FIRST STEP:
1. ✅ **Remove Duplicate Header Rows** - Detects and deletes any duplicate header rows in the data
   - Checks first 10 columns to identify headers
   - Works even if Age/Pillar/Category columns are empty
   - **This MUST happen first before any other operations!**

### Then proceeds with:
2. ✅ **Remove Duplicate Columns** - Detects and deletes any duplicate column headers
3. ✅ **Populate Age, Pillar, Category** - Fills in missing data for specified rows
4. ✅ **Fill SNo Column** - Numbers activities 1-20 for each age group within a pillar
5. ✅ **Fix Formatting** - Adds line breaks between:
   - Materials items (• item1\n• item2)
   - Steps (1. step\n2. step)
   - Skills (• skill1\n• skill2)
6. ✅ **Apply Color Coding** - Colors rows based on age group with light colors

### Why Duplicate Header Removal is First:
When you copy/paste new activities from another source, the column headers often get pasted as a data row. This duplicate header row must be removed BEFORE populating Age/Pillar/Category, otherwise it will fill those cells and make the duplicate harder to detect later.

## Completed Cleanups

### ✅ Rows 2-21: 👶 Infant (0–1)
- **Color:** Light Blue
- **Categories:** Sensory Exploration, Tummy Time Play, Interactive Sounds & Textures, Parent-Child Bonding Activities
- **Status:** Complete ✓

### ✅ Rows 22-41: 🚼 Toddler (1–3)
- **Color:** Light Green
- **Categories:** Pretend Play, Building with Blocks, Drawing & Scribbling, Exploring Musical Instruments
- **Status:** Complete ✓

### ✅ Rows 42-61: 🧒 Preschooler (3–5)
- **Color:** Light Yellow
- **Categories:** Imaginative Play with Dolls, Simple Crafting, Role-playing Games, Shape Sorting & Color Matching
- **Status:** Complete ✓

## Planned Cleanups (Presets Available)

### 📋 Rows 62-81: 👧 Child (6–8)
- **Color:** Light Peach
- **Categories:** Creative Arts & Crafts, Building & Construction, Storytelling, Music & Dance
- **Command:** Choose option 1 in cleanup.py

### 📋 Rows 82-101: 👦 Pre-Teen (9–12)
- **Color:** Light Lavender
- **Categories:** Advanced Creative Projects, Design & Innovation, Performing Arts, Digital Creativity
- **Command:** Choose option 2 in cleanup.py

### 📋 Rows 102-121: 🧑 Teen (13–18)
- **Color:** Light Mint
- **Categories:** Professional Creative Skills, Entrepreneurship, Advanced Arts, Innovation Projects
- **Command:** Choose option 3 in cleanup.py

## Manual Cleanup

If you need to run cleanup on a custom range:

```python
from cleanup_sheet_activities import SheetCleanup

cleanup = SheetCleanup('14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ')
cleanup.run_cleanup(
    start_row=62,
    end_row=81,
    age='👧 Child (6–8)',
    pillar='Play & Creativity',
    categories=[
        'Creative Arts & Crafts',
        'Building & Construction',
        'Storytelling',
        'Music & Dance'
    ],
    color_name='Light Peach',
    rgb={'red': 1.0, 'green': 0.9, 'blue': 0.85}
)
```

## Color Palette Reference

| Age Group | Color Name | RGB Values |
|-----------|-----------|------------|
| 👶 Infant (0–1) | Light Blue | (0.85, 0.92, 1.0) |
| 🚼 Toddler (1–3) | Light Green | (0.85, 1.0, 0.85) |
| 🧒 Preschooler (3–5) | Light Yellow | (1.0, 1.0, 0.85) |
| 👧 Child (6–8) | Light Peach | (1.0, 0.9, 0.85) |
| 👦 Pre-Teen (9–12) | Light Lavender | (0.92, 0.85, 1.0) |
| 🧑 Teen (13–18) | Light Mint | (0.85, 1.0, 0.95) |

## Troubleshooting

### Issue: "Service account not found"
**Solution:** Ensure `google-sheets-service-account.json` exists in the root directory

### Issue: "Worksheet not found"
**Solution:** Check that the sheet name is exactly "EG Activities"

### Issue: "Permission denied"
**Solution:** Ensure the service account has edit access to the Google Sheet

### Issue: Row count mismatch
**Solution:** Check the actual number of rows in your sheet before running cleanup

## Files

- `cleanup.py` - Simple command-line cleanup tool
- `cleanup_sheet_activities.py` - Full cleanup class with all functions
- `CLEANUP_GUIDE.md` - This guide

## Example Usage

```bash
# Run cleanup for next age group
$ python3 cleanup.py

🧹 SHEET CLEANUP TOOL
Select age group to clean up:

1. 👧 Child (6–8) - Rows 62-81
2. 👦 Pre-Teen (9–12) - Rows 82-101
3. 🧑 Teen (13–18) - Rows 102-121
4. Custom range

Enter choice (1-4): 1

📋 Configuration:
  Rows: 62-81
  Age: 👧 Child (6–8)
  Pillar: Play & Creativity
  Categories: Creative Arts & Crafts, Building & Construction, Storytelling, Music & Dance
  Color: Light Peach

Proceed? (yes/no): yes

[Cleanup runs automatically]
✅ CLEANUP COMPLETE!
```

## Summary

Simply say **"cleanup"** and I'll run the appropriate cleanup for your next batch of activities! 🎉

