#!/usr/bin/env python3

import gspread
from google.oauth2.service_account import Credentials

def update_four_niches():
    """
    Update Fashion & Styling, Arts & Crafts, Behavioral Science, and General Science niches
    """
    try:
        # Set up credentials
        SCOPES = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive']
        SERVICE_ACCOUNT_FILE = 'google-credentials.json'
        credentials = Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)
        gc = gspread.authorize(credentials)
        
        print("🎨 UPDATING FOUR NICHES IN GOOGLE SHEETS")
        print("=" * 60)
        
        # Get the spreadsheet
        spreadsheet = gc.open_by_key('14B3XhlDkQwFLcwFlmrM1xwkJ4ZkW0z_lKQE-3qZiyvQ')
        print(f"📊 Spreadsheet: {spreadsheet.title}")
        
        # Get the 'Niche Description' worksheet
        niche_ws = None
        for ws in spreadsheet.worksheets():
            if 'niche' in ws.title.lower() and 'description' in ws.title.lower():
                niche_ws = ws
                break
        
        if niche_ws:
            print(f"✅ Found worksheet: {niche_ws.title}")
            
            # Define the four niches with their content
            niches_data = {
                "Fashion & Styling": {
                    "row": 13,
                    "content": [
                        "12",  # SNo
                        "Fashion & Styling",  # Niche
                        "fashion-styling",  # Niche Slug
                        "Express Your Unique Style & Creativity 👗✨",  # Hero Tagline
                        "Helping Kids Discover Personal Style Through Creative Fashion Exploration",  # Sub heading
                        "<ul><li>Kids struggle to express their personality through clothes</li><li>They follow trends instead of finding their own style</li><li>Fashion feels intimidating and expensive</li></ul>",  # Problems
                        "<ul><li>DIY fashion projects with everyday materials</li><li>Style personality discovery games</li><li>Upcycling and sustainable fashion challenges</li><li>Fashion show planning and presentation</li></ul>",  # Approach Steps
                        "<ul><li>They develop confidence in their unique style</li><li>They love creating and showcasing outfits</li><li>They understand sustainable fashion choices</li></ul>",  # Why Kids Love This
                        "#E91E63",  # Color
                        "#C2185B",  # Primary Color
                        "#F8BBD0",  # Secondary Color
                        "#FFF0F5",  # Background Color
                        "fashion-hero.svg",  # Illustration
                        "Arts & Crafts, Communication, Entrepreneurship"  # Suggestion
                    ]
                },
                "Arts & Crafts": {
                    "row": 14,
                    "content": [
                        "13",  # SNo
                        "Arts & Crafts",  # Niche
                        "arts-crafts",  # Niche Slug
                        "Create, Craft & Imagine Endless Possibilities 🎨🖌️",  # Hero Tagline
                        "Unlocking Creative Potential Through Hands-On Artistic Expression",  # Sub heading
                        "<ul><li>Kids think they're 'not artistic' or 'not creative'</li><li>Art supplies seem expensive and intimidating</li><li>They lack confidence in their creative abilities</li></ul>",  # Problems
                        "<ul><li>Simple DIY craft projects with household items</li><li>Step-by-step artistic techniques</li><li>Creative challenges and competitions</li><li>Art gallery creation and sharing</li></ul>",  # Approach Steps
                        "<ul><li>They discover their hidden artistic talents</li><li>They love creating beautiful things from scratch</li><li>They gain confidence in their creative abilities</li></ul>",  # Why Kids Love This
                        "#9C27B0",  # Color
                        "#7B1FA2",  # Primary Color
                        "#CE93D8",  # Secondary Color
                        "#F3E5F5",  # Background Color
                        "arts-crafts-hero.svg",  # Illustration
                        "Fashion & Styling, Design Thinking & Creativity, Photography & Videography"  # Suggestion
                    ]
                },
                "Behavioral Science": {
                    "row": 15,
                    "content": [
                        "14",  # SNo
                        "Behavioral Science",  # Niche
                        "behavioral-science",  # Niche Slug
                        "Understand People & Behavior Like a Detective 🕵️🧠",  # Hero Tagline
                        "Exploring Human Behavior Through Fun Experiments and Observations",  # Sub heading
                        "<ul><li>Kids don't understand why people act the way they do</li><li>They struggle with social interactions and relationships</li><li>Behavioral concepts seem too complex for kids</li></ul>",  # Problems
                        "<ul><li>Fun behavioral experiments and observations</li><li>Social interaction role-playing games</li><li>Emotion recognition and empathy building</li><li>Family behavior study projects</li></ul>",  # Approach Steps
                        "<ul><li>They become better at understanding others</li><li>They develop stronger social skills</li><li>They love being 'behavior detectives'</li></ul>",  # Why Kids Love This
                        "#FF9800",  # Color
                        "#F57C00",  # Primary Color
                        "#FFCC02",  # Secondary Color
                        "#FFF8E1",  # Background Color
                        "behavioral-science-hero.svg",  # Illustration
                        "Psychology, Emotional Intelligence, Leadership & Team Building"  # Suggestion
                    ]
                },
                "General Science": {
                    "row": 16,
                    "content": [
                        "15",  # SNo
                        "General Science",  # Niche
                        "general-science",  # Niche Slug
                        "Become a Mini Scientist & Explore the World 🔬🌍",  # Hero Tagline
                        "Igniting Scientific Curiosity Through Hands-On Experiments and Discovery",  # Sub heading
                        "<ul><li>Science feels boring and too theoretical</li><li>Kids don't see how science applies to their daily lives</li><li>Experiments seem dangerous or too complex</li></ul>",  # Problems
                        "<ul><li>Safe, fun experiments with household items</li><li>Daily science discoveries and observations</li><li>Science journaling and hypothesis testing</li><li>Family science fair projects</li></ul>",  # Approach Steps
                        "<ul><li>They become curious about how things work</li><li>They love conducting their own experiments</li><li>They develop critical thinking skills</li></ul>",  # Why Kids Love This
                        "#4CAF50",  # Color
                        "#388E3C",  # Primary Color
                        "#A5D6A7",  # Secondary Color
                        "#E8F5E8",  # Background Color
                        "general-science-hero.svg",  # Illustration
                        "Nature Exploration, Applied Chemistry & Materials, Fundamental Physics & Forces"  # Suggestion
                    ]
                }
            }
            
            # Update each niche
            for niche_name, data in niches_data.items():
                print(f"\n📝 Updating {niche_name} (row {data['row']})...")
                
                # Update the row
                niche_ws.update(f'A{data["row"]}:N{data["row"]}', [data['content']])
                print(f"✅ {niche_name} updated successfully!")
            
            print(f"\n🎉 All four niches updated successfully!")
            print(f"📊 Updated niches: {list(niches_data.keys())}")
            
            return True
            
        else:
            print("❌ 'Niche Description' worksheet not found")
            return False
        
    except Exception as e:
        print(f"❌ Error updating sheet: {e}")
        return False

if __name__ == "__main__":
    success = update_four_niches()
    if success:
        print("\n🎉 All four niches successfully updated in Google Sheets!")
    else:
        print("\n❌ Failed to update niches in Google Sheets.")
