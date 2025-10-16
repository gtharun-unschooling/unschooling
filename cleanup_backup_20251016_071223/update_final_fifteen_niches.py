#!/usr/bin/env python3

import gspread
from google.oauth2.service_account import Credentials

def update_final_fifteen_niches():
    """
    Update the final 15 niches with engaging, unique content
    """
    try:
        # Set up credentials
        SCOPES = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive']
        SERVICE_ACCOUNT_FILE = 'google-credentials.json'
        credentials = Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)
        gc = gspread.authorize(credentials)
        
        print("🎯 UPDATING FINAL 15 NICHES WITH ENGAGING CONTENT")
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
            
            # Define the final 15 niches with their complete content
            niches_data = {
                "Children's Books": {
                    "row": 27,
                    "content": [
                        "26",  # SNo
                        "Children's Books",  # Niche
                        "childrens-books",  # Niche Slug
                        "Dive Into Magical Worlds & Discover Stories That Change Everything 📚✨",  # Hero Tagline
                        "Explore Endless Adventures & Find Books That Speak to Your Soul",  # Sub heading
                        "<ul><li>Kids think reading is boring and old-fashioned</li><li>They struggle to find books that interest them</li><li>Reading feels like homework instead of fun</li></ul>",  # Problems
                        "<ul><li>Personalized book recommendations and discovery</li><li>Interactive reading activities and discussions</li><li>Book creation and storytelling projects</li><li>Reading challenges and achievement systems</li></ul>",  # Approach Steps
                        "<ul><li>They discover books that truly captivate them</li><li>They love the adventure and imagination in stories</li><li>They develop a lifelong love of reading</li></ul>",  # Why Kids Love This
                        "#8D6E63",  # Color
                        "#5D4037",  # Primary Color
                        "#D7CCC8",  # Secondary Color
                        "#F5F5F5",  # Background Color
                        "childrens-books-hero.svg",  # Illustration
                        "Creative & Academic Writing, Communication, Teaching & Pedagogy"  # Suggestion
                    ]
                },
                "Public Speaking & Debate": {
                    "row": 28,
                    "content": [
                        "27",  # SNo
                        "Public Speaking & Debate",  # Niche
                        "public-speaking-debate",  # Niche Slug
                        "Command the Room & Make Your Voice Impossible to Ignore 🎤💪",  # Hero Tagline
                        "Build Unshakeable Confidence & Master the Art of Persuasion",  # Sub heading
                        "<ul><li>Kids get terrified of speaking in front of others</li><li>They don't know how to organize their thoughts</li><li>They think their opinions don't matter</li></ul>",  # Problems
                        "<ul><li>Confidence-building exercises and practice sessions</li><li>Speech writing and presentation skills</li><li>Debate techniques and argument construction</li><li>Public speaking challenges and competitions</li></ul>",  # Approach Steps
                        "<ul><li>They become confident and articulate speakers</li><li>They love the power of their voice and ideas</li><li>They develop leadership and persuasion skills</li></ul>",  # Why Kids Love This
                        "#FF5722",  # Color
                        "#E64A19",  # Primary Color
                        "#FFAB91",  # Secondary Color
                        "#FFF3E0",  # Background Color
                        "public-speaking-hero.svg",  # Illustration
                        "Communication, Leadership & Team Building, Civics & Government"  # Suggestion
                    ]
                },
                "Electronics": {
                    "row": 29,
                    "content": [
                        "28",  # SNo
                        "Electronics",  # Niche
                        "electronics",  # Niche Slug
                        "Build Amazing Gadgets & Control the Power of Electricity ⚡🔧",  # Hero Tagline
                        "Master the Magic of Circuits & Create Devices That Amaze Everyone",  # Sub heading
                        "<ul><li>Kids think electronics are too complex and dangerous</li><li>They don't understand how devices actually work</li><li>Building circuits seems intimidating and technical</li></ul>",  # Problems
                        "<ul><li>Safe electronics projects with step-by-step guides</li><li>Circuit building and component identification</li><li>Gadget creation and modification projects</li><li>Electronics safety and troubleshooting skills</li></ul>",  # Approach Steps
                        "<ul><li>They become confident electronics builders</li><li>They love creating and controlling their own devices</li><li>They develop technical problem-solving skills</li></ul>",  # Why Kids Love This
                        "#607D8B",  # Color
                        "#455A64",  # Primary Color
                        "#90A4AE",  # Secondary Color
                        "#ECEFF1",  # Background Color
                        "electronics-hero.svg",  # Illustration
                        "Electrical Engineering Basics, Robotics, Coding & Programming"  # Suggestion
                    ]
                },
                "Electrical Engineering Basics": {
                    "row": 30,
                    "content": [
                        "29",  # SNo
                        "Electrical Engineering Basics",  # Niche
                        "electrical-engineering-basics",  # Niche Slug
                        "Harness the Power of Electricity & Engineer the Future 🔌⚡",  # Hero Tagline
                        "Understand the Forces That Power Our World & Design Electrical Solutions",  # Sub heading
                        "<ul><li>Kids think electrical engineering is too advanced</li><li>They don't understand how electricity works</li><li>Engineering concepts seem abstract and confusing</li></ul>",  # Problems
                        "<ul><li>Electrical theory through hands-on experiments</li><li>Circuit design and analysis projects</li><li>Power systems and energy conversion</li><li>Engineering problem-solving and design thinking</li></ul>",  # Approach Steps
                        "<ul><li>They become confident electrical engineers</li><li>They love understanding and controlling electrical power</li><li>They develop analytical and design thinking skills</li></ul>",  # Why Kids Love This
                        "#FF9800",  # Color
                        "#F57C00",  # Primary Color
                        "#FFCC02",  # Secondary Color
                        "#FFF8E1",  # Background Color
                        "electrical-engineering-hero.svg",  # Illustration
                        "Electronics, Robotics, Renewable Energy"  # Suggestion
                    ]
                },
                "Law & Legal Education": {
                    "row": 31,
                    "content": [
                        "30",  # SNo
                        "Law & Legal Education",  # Niche
                        "law-legal-education",  # Niche Slug
                        "Fight for Justice & Stand Up for What's Right ⚖️🛡️",  # Hero Tagline
                        "Understand Your Rights & Learn How to Make the World More Fair",  # Sub heading
                        "<ul><li>Kids think law is boring and only for adults</li><li>They don't understand their rights and responsibilities</li><li>Legal concepts seem complicated and intimidating</li></ul>",  # Problems
                        "<ul><li>Mock trials and legal role-playing games</li><li>Rights and responsibilities exploration</li><li>Legal case studies and analysis</li><li>Advocacy and social justice projects</li></ul>",  # Approach Steps
                        "<ul><li>They become confident about their rights</li><li>They love fighting for justice and fairness</li><li>They develop critical thinking and advocacy skills</li></ul>",  # Why Kids Love This
                        "#795548",  # Color
                        "#5D4037",  # Primary Color
                        "#BCAAA4",  # Secondary Color
                        "#EFEBE9",  # Background Color
                        "law-hero.svg",  # Illustration
                        "Civics & Government, Public Speaking & Debate, Leadership & Team Building"  # Suggestion
                    ]
                },
                "Emotional Intelligence": {
                    "row": 32,
                    "content": [
                        "31",  # SNo
                        "Emotional Intelligence",  # Niche
                        "emotional-intelligence",  # Niche Slug
                        "Master Your Emotions & Build Stronger Relationships 💝🧠",  # Hero Tagline
                        "Understand Yourself & Others Better Than Ever Before",  # Sub heading
                        "<ul><li>Kids struggle to understand and manage their emotions</li><li>They don't know how to read other people's feelings</li><li>Emotional concepts seem confusing and overwhelming</li></ul>",  # Problems
                        "<ul><li>Emotion identification and expression exercises</li><li>Empathy building and perspective-taking activities</li><li>Conflict resolution and communication skills</li><li>Mindfulness and emotional regulation techniques</li></ul>",  # Approach Steps
                        "<ul><li>They become emotionally aware and confident</li><li>They love understanding themselves and others</li><li>They develop stronger relationships and social skills</li></ul>",  # Why Kids Love This
                        "#E91E63",  # Color
                        "#C2185B",  # Primary Color
                        "#F8BBD0",  # Secondary Color
                        "#FFF0F5",  # Background Color
                        "emotional-intelligence-hero.svg",  # Illustration
                        "Behavioral Science, Communication, Leadership & Team Building"  # Suggestion
                    ]
                },
                "Culture & Heritage": {
                    "row": 33,
                    "content": [
                        "32",  # SNo
                        "Culture & Heritage",  # Niche
                        "culture-heritage",  # Niche Slug
                        "Explore Your Roots & Celebrate the Rich Tapestry of Humanity 🌍🏺",  # Hero Tagline
                        "Discover Your Cultural Identity & Appreciate the Beauty of Diversity",  # Sub heading
                        "<ul><li>Kids don't understand their own cultural background</li><li>They don't appreciate the diversity around them</li><li>Cultural traditions seem old-fashioned and irrelevant</li></ul>",  # Problems
                        "<ul><li>Family history and genealogy exploration</li><li>Cultural celebration and tradition learning</li><li>Diversity appreciation and global awareness</li><li>Heritage preservation and storytelling projects</li></ul>",  # Approach Steps
                        "<ul><li>They become proud of their cultural identity</li><li>They love learning about different cultures</li><li>They develop respect and appreciation for diversity</li></ul>",  # Why Kids Love This
                        "#8BC34A",  # Color
                        "#689F38",  # Primary Color
                        "#C5E1A5",  # Secondary Color
                        "#F1F8E9",  # Background Color
                        "culture-heritage-hero.svg",  # Illustration
                        "History, Travel, Communication"  # Suggestion
                    ]
                },
                "Food & Nutrition": {
                    "row": 34,
                    "content": [
                        "33",  # SNo
                        "Food & Nutrition",  # Niche
                        "food-nutrition",  # Niche Slug
                        "Cook Up Health & Happiness in Your Kitchen 🍎👨‍🍳",  # Hero Tagline
                        "Master the Art of Healthy Cooking & Fuel Your Body for Success",  # Sub heading
                        "<ul><li>Kids think healthy food is boring and tasteless</li><li>They don't understand how food affects their bodies</li><li>Cooking seems complicated and dangerous</li></ul>",  # Problems
                        "<ul><li>Fun cooking projects with healthy ingredients</li><li>Nutrition education through interactive activities</li><li>Meal planning and preparation skills</li><li>Food science experiments and taste testing</li></ul>",  # Approach Steps
                        "<ul><li>They become confident and healthy cooks</li><li>They love creating delicious and nutritious meals</li><li>They develop lifelong healthy eating habits</li></ul>",  # Why Kids Love This
                        "#FF9800",  # Color
                        "#F57C00",  # Primary Color
                        "#FFCC02",  # Secondary Color
                        "#FFF8E1",  # Background Color
                        "food-nutrition-hero.svg",  # Illustration
                        "Health & Hygiene, Human Biology, Sustainability & Environment"  # Suggestion
                    ]
                },
                "Health & Hygiene": {
                    "row": 35,
                    "content": [
                        "34",  # SNo
                        "Health & Hygiene",  # Niche
                        "health-hygiene",  # Niche Slug
                        "Build Superhero Health Habits & Feel Amazing Every Day 🦸‍♀️💪",  # Hero Tagline
                        "Master the Secrets of Staying Healthy & Strong for Life",  # Sub heading
                        "<ul><li>Kids don't understand why hygiene habits matter</li><li>They think health is only about not getting sick</li><li>Healthy habits seem boring and unnecessary</li></ul>",  # Problems
                        "<ul><li>Interactive hygiene and health education</li><li>Healthy habit building and tracking systems</li><li>Disease prevention and wellness activities</li><li>Personal care and self-care skill development</li></ul>",  # Approach Steps
                        "<ul><li>They become health-conscious and confident</li><li>They love feeling strong and energetic</li><li>They develop lifelong healthy lifestyle habits</li></ul>",  # Why Kids Love This
                        "#4CAF50",  # Color
                        "#388E3C",  # Primary Color
                        "#A5D6A7",  # Secondary Color
                        "#E8F5E8",  # Background Color
                        "health-hygiene-hero.svg",  # Illustration
                        "Human Biology, Physical Fitness, Food & Nutrition"  # Suggestion
                    ]
                },
                "Human Biology": {
                    "row": 36,
                    "content": [
                        "35",  # SNo
                        "Human Biology",  # Niche
                        "human-biology",  # Niche Slug
                        "Explore the Amazing Machine That Is Your Body 🧬🔬",  # Hero Tagline
                        "Discover the Incredible Systems That Keep You Alive and Thriving",  # Sub heading
                        "<ul><li>Kids think biology is gross and complicated</li><li>They don't understand how their bodies work</li><li>Scientific concepts seem abstract and boring</li></ul>",  # Problems
                        "<ul><li>Interactive body system exploration and learning</li><li>Hands-on biology experiments and observations</li><li>Health and wellness connection activities</li><li>Anatomy and physiology discovery projects</li></ul>",  # Approach Steps
                        "<ul><li>They become fascinated by their own bodies</li><li>They love understanding how life works</li><li>They develop scientific thinking and curiosity</li></ul>",  # Why Kids Love This
                        "#E91E63",  # Color
                        "#C2185B",  # Primary Color
                        "#F8BBD0",  # Secondary Color
                        "#FFF0F5",  # Background Color
                        "human-biology-hero.svg",  # Illustration
                        "Health & Hygiene, General Science, Physical Fitness"  # Suggestion
                    ]
                },
                "Physical Fitness": {
                    "row": 37,
                    "content": [
                        "36",  # SNo
                        "Physical Fitness",  # Niche
                        "physical-fitness",  # Niche Slug
                        "Transform Into a Fitness Superhero & Conquer Any Challenge 💪🏃‍♀️",  # Hero Tagline
                        "Build Unstoppable Strength & Energy That Powers Everything You Do",  # Sub heading
                        "<ul><li>Kids think exercise is boring and hard work</li><li>They don't understand how fitness benefits them</li><li>Physical activity seems like punishment</li></ul>",  # Problems
                        "<ul><li>Fun fitness games and challenges</li><li>Personal fitness goal setting and tracking</li><li>Strength building and endurance activities</li><li>Sports and recreational fitness programs</li></ul>",  # Approach Steps
                        "<ul><li>They become strong and energetic</li><li>They love the feeling of physical accomplishment</li><li>They develop confidence and discipline</li></ul>",  # Why Kids Love This
                        "#FF5722",  # Color
                        "#E64A19",  # Primary Color
                        "#FFAB91",  # Secondary Color
                        "#FFF3E0",  # Background Color
                        "physical-fitness-hero.svg",  # Illustration
                        "Sports, Health & Hygiene, Human Biology"  # Suggestion
                    ]
                },
                "Leadership & Team Building": {
                    "row": 38,
                    "content": [
                        "37",  # SNo
                        "Leadership & Team Building",  # Niche
                        "leadership-team-building",  # Niche Slug
                        "Rise as a Natural Leader & Inspire Others to Greatness 👑🌟",  # Hero Tagline
                        "Develop the Skills That Make People Want to Follow You",  # Sub heading
                        "<ul><li>Kids don't know how to lead without being bossy</li><li>They struggle with teamwork and collaboration</li><li>Leadership seems intimidating and complicated</li></ul>",  # Problems
                        "<ul><li>Leadership skill development and practice</li><li>Team building activities and challenges</li><li>Communication and conflict resolution</li><li>Project management and delegation skills</li></ul>",  # Approach Steps
                        "<ul><li>They become confident and respected leaders</li><li>They love inspiring and helping others succeed</li><li>They develop strong teamwork and social skills</li></ul>",  # Why Kids Love This
                        "#9C27B0",  # Color
                        "#7B1FA2",  # Primary Color
                        "#CE93D8",  # Secondary Color
                        "#F3E5F5",  # Background Color
                        "leadership-hero.svg",  # Illustration
                        "Public Speaking & Debate, Emotional Intelligence, Teaching & Pedagogy"  # Suggestion
                    ]
                },
                "Internet of Things (IoT)": {
                    "row": 39,
                    "content": [
                        "38",  # SNo
                        "Internet of Things (IoT)",  # Niche
                        "internet-of-things",  # Niche Slug
                        "Connect Everything & Build the Smart World of Tomorrow 🌐🤖",  # Hero Tagline
                        "Create Intelligent Devices That Talk to Each Other and Make Life Easier",  # Sub heading
                        "<ul><li>Kids think IoT is too technical and complex</li><li>They don't understand how devices connect</li><li>Smart technology seems like magic</li></ul>",  # Problems
                        "<ul><li>IoT project building with sensors and devices</li><li>Smart home automation and control systems</li><li>Data collection and analysis activities</li><li>Future technology exploration and design</li></ul>",  # Approach Steps
                        "<ul><li>They become confident IoT creators</li><li>They love building smart and connected devices</li><li>They develop technical and innovation skills</li></ul>",  # Why Kids Love This
                        "#00BCD4",  # Color
                        "#0097A7",  # Primary Color
                        "#80DEEA",  # Secondary Color
                        "#E0F2F1",  # Background Color
                        "iot-hero.svg",  # Illustration
                        "Electronics, Robotics, Coding & Programming"  # Suggestion
                    ]
                },
                "Automobiles & Engineering": {
                    "row": 40,
                    "content": [
                        "39",  # SNo
                        "Automobiles & Engineering",  # Niche
                        "automobiles-engineering",  # Niche Slug
                        "Design the Cars of Tomorrow & Engineer the Future of Transportation 🚗⚙️",  # Hero Tagline
                        "Master the Engineering Behind Every Vehicle & Create Your Dream Car",  # Sub heading
                        "<ul><li>Kids think automotive engineering is too advanced</li><li>They don't understand how cars actually work</li><li>Engineering seems boring and technical</li></ul>",  # Problems
                        "<ul><li>Automotive engineering projects and experiments</li><li>Vehicle design and modification activities</li><li>Mechanical systems and component learning</li><li>Future transportation innovation and design</li></ul>",  # Approach Steps
                        "<ul><li>They become confident automotive engineers</li><li>They love understanding and designing vehicles</li><li>They develop mechanical and design thinking skills</li></ul>",  # Why Kids Love This
                        "#607D8B",  # Color
                        "#455A64",  # Primary Color
                        "#90A4AE",  # Secondary Color
                        "#ECEFF1",  # Background Color
                        "automobiles-hero.svg",  # Illustration
                        "Electrical Engineering Basics, Design Thinking & Creativity, Mathematics"  # Suggestion
                    ]
                },
                "Sustainability & Environment": {
                    "row": 41,
                    "content": [
                        "40",  # SNo
                        "Sustainability & Environment",  # Niche
                        "sustainability-environment",  # Niche Slug
                        "Save the Planet & Create a Greener Future for Everyone 🌱🌍",  # Hero Tagline
                        "Become an Environmental Hero & Make a Real Difference in the World",  # Sub heading
                        "<ul><li>Kids think environmental issues are too big to solve</li><li>They don't understand how their actions matter</li><li>Sustainability seems boring and preachy</li></ul>",  # Problems
                        "<ul><li>Environmental action projects and initiatives</li><li>Sustainable living and conservation activities</li><li>Eco-friendly innovation and design challenges</li><li>Community environmental impact and awareness</li></ul>",  # Approach Steps
                        "<ul><li>They become passionate environmental advocates</li><li>They love making a real difference in the world</li><li>They develop responsibility and global citizenship</li></ul>",  # Why Kids Love This
                        "#4CAF50",  # Color
                        "#388E3C",  # Primary Color
                        "#A5D6A7",  # Secondary Color
                        "#E8F5E8",  # Background Color
                        "sustainability-hero.svg",  # Illustration
                        "Nature Exploration, Food & Nutrition, General Science"  # Suggestion
                    ]
                }
            }
            
            # Update each niche
            for niche_name, data in niches_data.items():
                print(f"\n📝 Updating {niche_name} (row {data['row']})...")
                
                # Update the row
                niche_ws.update(f'A{data["row"]}:N{data["row"]}', [data['content']])
                print(f"✅ {niche_name} updated successfully!")
            
            print(f"\n🎉 All 15 final niches updated with engaging, unique content!")
            print(f"📊 Updated niches: {list(niches_data.keys())}")
            
            return True
            
        else:
            print("❌ 'Niche Description' worksheet not found")
            return False
        
    except Exception as e:
        print(f"❌ Error updating sheet: {e}")
        return False

if __name__ == "__main__":
    success = update_final_fifteen_niches()
    if success:
        print("\n🎉 All 15 final niches successfully updated with engaging, unique content!")
    else:
        print("\n❌ Failed to update niches in Google Sheets.")
