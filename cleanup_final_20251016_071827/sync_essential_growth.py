#!/usr/bin/env python3
"""
🚀 Essential Growth Sync - Quick Script
Run this whenever you update Google Sheets to sync changes to your website
"""

import subprocess
import sys
import os
from datetime import datetime

def sync_essential_growth():
    """Quick sync script for Essential Growth data"""
    
    print("🚀 Essential Growth Sync - Quick Update")
    print("=" * 50)
    print(f"⏰ Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    try:
        # Run the enhanced sync script
        print("\n🔄 Running Enhanced Google Sheets to JSON sync...")
        result = subprocess.run([
            sys.executable, 'sync_google_sheets_to_json_enhanced.py'
        ], capture_output=True, text=True)
        
        if result.returncode == 0:
            print("✅ Sync completed successfully!")
            print("\n📊 Sync Summary:")
            print("   - Google Sheets data pulled")
            print("   - Local JSON files updated")
            print("   - Website data refreshed")
            print("   - All changes now live on website")
            
            print(f"\n🎯 Your workflow is now:")
            print("   1. Make changes in Google Sheets")
            print("   2. Run: python sync_essential_growth.py")
            print("   3. Deploy updated files to website")
            print("   4. Changes are live!")
            
        else:
            print("❌ Sync failed!")
            print(f"Error: {result.stderr}")
            return False
            
    except Exception as e:
        print(f"❌ Error during sync: {e}")
        return False
    
    print(f"\n⏰ Completed at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    return True

if __name__ == '__main__':
    print("🎨 Essential Growth Data Sync")
    print("=" * 50)
    print("This script syncs your Google Sheets changes to local JSON files")
    print("so your website displays the latest data automatically.")
    print("")
    
    sync_essential_growth()
