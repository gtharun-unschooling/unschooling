#!/usr/bin/env python3
"""
Simple Cleanup Command
Usage: python3 cleanup.py
"""

from cleanup_sheet_activities import SheetCleanup

# Configuration presets for different age groups
PRESETS = {
    'child-6-8': {
        'start_row': 62,
        'end_row': 81,
        'age': '👧 Child (6–8)',
        'pillar': 'Play & Creativity',
        'categories': [
            'Creative Arts & Crafts',
            'Building & Construction',
            'Storytelling',
            'Music & Dance'
        ],
        'color_name': 'Light Peach',
        'rgb': {'red': 1.0, 'green': 0.9, 'blue': 0.85}
    },
    'preteen-9-12': {
        'start_row': 82,
        'end_row': 101,
        'age': '👦 Pre-Teen (9–12)',
        'pillar': 'Play & Creativity',
        'categories': [
            'Advanced Creative Projects',
            'Design & Innovation',
            'Performing Arts',
            'Digital Creativity'
        ],
        'color_name': 'Light Lavender',
        'rgb': {'red': 0.92, 'green': 0.85, 'blue': 1.0}
    },
    'teen-13-18': {
        'start_row': 102,
        'end_row': 121,
        'age': '🧑 Teen (13–18)',
        'pillar': 'Play & Creativity',
        'categories': [
            'Professional Creative Skills',
            'Entrepreneurship',
            'Advanced Arts',
            'Innovation Projects'
        ],
        'color_name': 'Light Mint',
        'rgb': {'red': 0.85, 'green': 1.0, 'blue': 0.95}
    }
}

SPREADSHEET_ID = '14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ'

def main():
    """Run cleanup with menu selection"""
    print("\n" + "="*60)
    print("🧹 SHEET CLEANUP TOOL")
    print("="*60)
    print("\nSelect age group to clean up:")
    print("\n1. 👧 Child (6–8) - Rows 62-81")
    print("2. 👦 Pre-Teen (9–12) - Rows 82-101")
    print("3. 🧑 Teen (13–18) - Rows 102-121")
    print("4. Custom range")
    
    choice = input("\nEnter choice (1-4): ").strip()
    
    if choice == '1':
        config = PRESETS['child-6-8']
    elif choice == '2':
        config = PRESETS['preteen-9-12']
    elif choice == '3':
        config = PRESETS['teen-13-18']
    elif choice == '4':
        # Custom configuration
        print("\nCustom configuration:")
        start_row = int(input("Start row: "))
        end_row = int(input("End row: "))
        age = input("Age (e.g., '👧 Child (6–8)'): ")
        pillar = input("Pillar (e.g., 'Play & Creativity'): ")
        
        categories = []
        print("Enter categories (one per line, empty line to finish):")
        while True:
            cat = input("  Category: ").strip()
            if not cat:
                break
            categories.append(cat)
        
        color_name = input("Color name (e.g., 'Light Blue'): ")
        r = float(input("Red (0-1): "))
        g = float(input("Green (0-1): "))
        b = float(input("Blue (0-1): "))
        
        config = {
            'start_row': start_row,
            'end_row': end_row,
            'age': age,
            'pillar': pillar,
            'categories': categories,
            'color_name': color_name,
            'rgb': {'red': r, 'green': g, 'blue': b}
        }
    else:
        print("❌ Invalid choice")
        return
    
    # Confirm
    print(f"\n📋 Configuration:")
    print(f"  Rows: {config['start_row']}-{config['end_row']}")
    print(f"  Age: {config['age']}")
    print(f"  Pillar: {config['pillar']}")
    print(f"  Categories: {', '.join(config['categories'])}")
    print(f"  Color: {config['color_name']}")
    
    confirm = input("\nProceed? (yes/no): ").strip().lower()
    if confirm not in ['yes', 'y']:
        print("❌ Cancelled")
        return
    
    # Run cleanup
    cleanup = SheetCleanup(SPREADSHEET_ID)
    cleanup.run_cleanup(**config)

if __name__ == "__main__":
    main()


