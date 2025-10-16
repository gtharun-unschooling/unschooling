#!/usr/bin/env python3
"""
Interactive Google Sheets Session
Sheet is loaded and ready for changes
"""

import gspread
from gspread_formatting import *

# Load your sheet
gc = gspread.service_account('google-sheets-service-account.json')
sheet = gc.open_by_key('14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ')
ws = sheet.worksheet('Metadata')

print("✅ Interactive Session Started!")
print("📊 Sheet loaded: Metadata")
print("🎯 Tell me your next change...")
print("=" * 50)

# Sheet is ready for changes
# You can now tell me what to change and I'll apply it directly
