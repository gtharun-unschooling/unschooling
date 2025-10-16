#!/usr/bin/env python3

import gspread
from google.oauth2.service_account import Credentials

def fix_all_hero_taglines():
    """
    Fix ALL hero taglines to be completely unique without repetitive '&' patterns
    """
    try:
        # Set up credentials
        SCOPES = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive']
        SERVICE_ACCOUNT_FILE = 'google-credentials.json'
        credentials = Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)
        gc = gspread.authorize(credentials)
        
        print("🎨 FIXING ALL HERO TAGLINES TO BE COMPLETELY UNIQUE")
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
            
            # Completely unique hero taglines with varied structures
            unique_hero_taglines = {
                "History": "Time Travel Adventures Meet the Heroes Who Changed Everything 🏛️⏰",
                "Fashion & Styling": "Personal Style Becomes Your Most Powerful Form of Expression 👗✨",
                "Arts & Crafts": "Everyday Materials Transform Into Extraordinary Masterpieces 🎨🖌️",
                "Behavioral Science": "Human Behavior Unlocks Its Mysteries Through Careful Observation 🕵️🧠",
                "General Science": "Kitchen Experiments Reveal the Hidden Science in Daily Life 🔬🌍",
                "Sports": "Athletic Excellence Builds Champions on and off the Field 🏆⚽",
                "Design Thinking & Creativity": "Innovation Solves Real Problems with Creative Solutions 🧠💡",
                "Photography & Videography": "Visual Stories Capture Life's Most Precious Moments 📸🎬",
                "Trading & Investments": "Financial Wisdom Grows Wealth Through Smart Decisions 💰📈",
                "Games & Recreational Skills": "Gaming Mastery Opens Doors to Endless Entertainment 🎮🏆",
                "Mathematics": "Number Patterns Unlock the Universe's Greatest Mysteries 🔢🌌",
                "Creative & Academic Writing": "Words Become Bridges Between Imagination and Reality ✍️📚",
                "Social Media Literacy": "Digital Citizenship Creates Positive Online Communities 📱✨",
                "Educational Apps": "Mobile Learning Transforms Every Device Into a Classroom 📱🎓",
                "Teaching & Pedagogy": "Educational Excellence Inspires the Next Generation of Learners 👩‍🏫🌟",
                "Children's Books": "Literary Adventures Ignite Lifelong Passion for Reading 📚✨",
                "Public Speaking & Debate": "Confident Communication Commands Attention and Respect 🎤💪",
                "Electronics": "Circuit Mastery Controls the Power of Modern Technology ⚡🔧",
                "Electrical Engineering Basics": "Electrical Systems Power the Infrastructure of Tomorrow 🔌⚡",
                "Law & Legal Education": "Legal Knowledge Empowers Citizens to Seek Justice ⚖️🛡️",
                "Emotional Intelligence": "Emotional Awareness Strengthens Every Human Connection 💝🧠",
                "Culture & Heritage": "Cultural Pride Celebrates the Rich Diversity of Humanity 🌍🏺",
                "Food & Nutrition": "Culinary Skills Nourish Both Body and Soul 🍎👨‍🍳",
                "Health & Hygiene": "Wellness Habits Create the Foundation for a Thriving Life 🦸‍♀️💪",
                "Human Biology": "Body Systems Reveal the Incredible Complexity of Life 🧬🔬",
                "Physical Fitness": "Strength Training Builds Confidence That Lasts a Lifetime 💪🏃‍♀️",
                "Leadership & Team Building": "Natural Leadership Inspires Teams to Achieve Greatness 👑🌟",
                "Internet of Things (IoT)": "Connected Devices Create Smarter, More Efficient Living 🌐🤖",
                "Automobiles & Engineering": "Vehicle Design Revolutionizes the Future of Transportation 🚗⚙️",
                "Sustainability & Environment": "Environmental Stewardship Protects Our Planet's Future 🌱🌍",
                "Spirituality & Devotion": "Inner Light Guides Young Hearts Toward Peace and Purpose 🕉️✨",
                "Robotics": "Robotic Engineering Brings Machines to Life Through Programming 🤖⚙️",
                "Space Exploration": "Astronomical Adventures Unlock the Mysteries of the Universe 🚀🌌",
                "Renewable Energy": "Sustainable Energy Solutions Power a Greener Future 🌱⚡",
                "Cybersecurity": "Digital Security Skills Defend Against Cyber Threats 🔒🛡️",
                "Marine Biology": "Marine Science Explores the Fascinating World Beneath the Waves 🐠🌊",
                "Architecture & Design": "Architectural Vision Creates Spaces That Enhance Human Experience 🏗️✨",
                "Psychology": "Psychological Science Reveals the Complex Workings of Human Thought 🧠💭",
                "Filmmaking": "Film Production Brings Stories to Life Through Visual Storytelling 🎬🎭",
                "Cryptocurrency & Blockchain": "Blockchain Technology Revolutionizes How We Think About Money 💰🔗",
                "Agriculture & Soil Science": "Agricultural Science Nourishes Communities Through Food Production 🌾🌱",
                "Supply Chain & Logistics": "Logistics Excellence Ensures Products Reach People When Needed 📦🚚",
                "Aerospace & Flight Sciences": "Aerospace Engineering Defies Gravity and Opens New Horizons ✈️🚁",
                "Smart Urban Living": "Urban Innovation Transforms Cities Into Sustainable Communities 🏙️🤖",
                "Media Production & Broadcasting": "Broadcasting Excellence Reaches Audiences Through Professional Media 📺🎙️",
                "Content Creation": "Creative Content Development Engages Audiences and Builds Communities 📝💻",
                "Product Design & User Experience (UX)": "User-Centered Design Creates Products That Solve Real Problems 🎯✨",
                "Emergency Response & Safety Skills": "Emergency Preparedness Builds Confidence and Life-Saving Skills 🚨🦸‍♂️",
                "Construction & Structural Engineering": "Structural Engineering Creates Safe, Durable Buildings 🏗️🔧",
                "Tools & Machines Literacy": "Mechanical Literacy Empowers Kids to Create and Fix Things 🔧⚙️",
                "Ayurveda & Natural Healing": "Traditional Healing Practices Restore Balance and Promote Wellness 🌿💚",
                "Applied Chemistry & Materials": "Chemical Science Develops New Materials That Solve Problems 🧪⚗️",
                "Fundamental Physics & Forces": "Physics Principles Reveal the Fundamental Laws That Govern Everything ⚛️🌌"
            }
            
            # Update each niche with unique hero tagline
            for niche_name, new_tagline in unique_hero_taglines.items():
                print(f"\n📝 Updating {niche_name}...")
                
                # Find the row for this niche
                all_values = niche_ws.get_all_values()
                niche_row = None
                
                for i, row in enumerate(all_values, 1):
                    if len(row) > 1 and row[1] == niche_name:  # Column B is the Niche name
                        niche_row = i
                        break
                
                if niche_row:
                    # Update only the hero tagline (column D)
                    niche_ws.update_cell(niche_row, 4, new_tagline)
                    print(f"✅ {niche_name}: '{new_tagline}'")
                else:
                    print(f"❌ Could not find {niche_name} in the sheet")
            
            print(f"\n🎉 All hero taglines now have completely unique, varied structures!")
            print("✨ No more repetitive '&' patterns - each one is truly different!")
            
            return True
            
        else:
            print("❌ 'Niche Description' worksheet not found")
            return False
        
    except Exception as e:
        print(f"❌ Error updating sheet: {e}")
        return False

if __name__ == "__main__":
    success = fix_all_hero_taglines()
    if success:
        print("\n🎉 All hero taglines are now completely unique and varied!")
    else:
        print("\n❌ Failed to update hero taglines.")
