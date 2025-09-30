#!/usr/bin/env python3
"""
🔄 Bidirectional Sync: CSV ↔ Google Sheets
Easy commands for syncing in both directions
"""

import sys
import os

def show_help():
    """Show help information"""
    print("🔄 Bidirectional Sync Commands")
    print("=" * 40)
    print("Usage: python bidirectional_sync.py [command]")
    print("")
    print("Commands:")
    print("  upload    - Upload CSV to Google Sheets")
    print("  download  - Download from Google Sheets to CSV")
    print("  sync      - Full bidirectional sync")
    print("  help      - Show this help")
    print("")
    print("Examples:")
    print("  python bidirectional_sync.py upload")
    print("  python bidirectional_sync.py download")
    print("  python bidirectional_sync.py sync")

def upload_csv_to_sheets():
    """Upload CSV to Google Sheets"""
    print("📤 Uploading CSV to Google Sheets...")
    os.system("source sheets_env/bin/activate && python upload_with_proper_sa.py")

def download_sheets_to_csv():
    """Download from Google Sheets to CSV"""
    print("📥 Downloading from Google Sheets to CSV...")
    os.system("source sheets_env/bin/activate && python sync_from_sheets_to_csv.py")

def full_sync():
    """Full bidirectional sync"""
    print("🔄 Full Bidirectional Sync")
    print("=" * 40)
    print("Step 1: Upload CSV to Google Sheets...")
    upload_csv_to_sheets()
    print("\nStep 2: Download from Google Sheets to CSV...")
    download_sheets_to_csv()
    print("\n🎉 Full sync complete!")

def main():
    """Main function"""
    if len(sys.argv) < 2:
        show_help()
        return
    
    command = sys.argv[1].lower()
    
    if command == 'upload':
        upload_csv_to_sheets()
    elif command == 'download':
        download_sheets_to_csv()
    elif command == 'sync':
        full_sync()
    elif command == 'help':
        show_help()
    else:
        print(f"❌ Unknown command: {command}")
        show_help()

if __name__ == '__main__':
    main()
