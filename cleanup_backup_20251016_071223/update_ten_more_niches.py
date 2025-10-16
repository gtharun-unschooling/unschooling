#!/usr/bin/env python3

import gspread
from google.oauth2.service_account import Credentials

def update_ten_more_niches():
    """
    Update 10 more niches with engaging, unique content
    """
    try:
        # Set up credentials
        SCOPES = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive']
        SERVICE_ACCOUNT_FILE = 'google-credentials.json'
        credentials = Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)
        gc = gspread.authorize(credentials)
        
        print("🎯 UPDATING 10 MORE NICHES WITH ENGAGING CONTENT")
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
            
            # Define the 10 niches with their complete content
            niches_data = {
                "Sports": {
                    "row": 17,
                    "content": [
                        "16",  # SNo
                        "Sports",  # Niche
                        "sports",  # Niche Slug
                        "Champion Your Way to Victory & Team Spirit 🏆⚽",  # Hero Tagline
                        "Master Any Sport You Love & Build Unbreakable Team Bonds",  # Sub heading
                        "<ul><li>Kids feel intimidated by competitive sports</li><li>They think they're not athletic enough</li><li>Sports seem too serious and pressure-filled</li></ul>",  # Problems
                        "<ul><li>Fun skill-building games and challenges</li><li>Team spirit and sportsmanship activities</li><li>Personal fitness goals and achievements</li><li>Sports history and legendary athlete stories</li></ul>",  # Approach Steps
                        "<ul><li>They discover their hidden athletic talents</li><li>They love the thrill of competition and teamwork</li><li>They build confidence and leadership skills</li></ul>",  # Why Kids Love This
                        "#FF5722",  # Color
                        "#E64A19",  # Primary Color
                        "#FFAB91",  # Secondary Color
                        "#FFF3E0",  # Background Color
                        "sports-hero.svg",  # Illustration
                        "Physical Fitness, Leadership & Team Building, Games & Recreational Skills"  # Suggestion
                    ]
                },
                "Design Thinking & Creativity": {
                    "row": 18,
                    "content": [
                        "17",  # SNo
                        "Design Thinking & Creativity",  # Niche
                        "design-thinking-creativity",  # Niche Slug
                        "Solve Problems Like a Genius Inventor & Design the Future 🧠💡",  # Hero Tagline
                        "Unleash Your Inner Innovator & Create Solutions That Change the World",  # Sub heading
                        "<ul><li>Kids think creativity is only for 'artistic' people</li><li>They don't know how to approach complex problems</li><li>Innovation feels too advanced for their age</li></ul>",  # Problems
                        "<ul><li>Design challenges with everyday problems</li><li>Prototype building with simple materials</li><li>User empathy and feedback sessions</li><li>Innovation showcase and presentation skills</li></ul>",  # Approach Steps
                        "<ul><li>They become confident problem-solvers</li><li>They love creating and testing their ideas</li><li>They develop critical thinking and innovation skills</li></ul>",  # Why Kids Love This
                        "#673AB7",  # Color
                        "#512DA8",  # Primary Color
                        "#B39DDB",  # Secondary Color
                        "#F3E5F5",  # Background Color
                        "design-thinking-hero.svg",  # Illustration
                        "Arts & Crafts, Product Design & User Experience (UX), Entrepreneurship"  # Suggestion
                    ]
                },
                "Photography & Videography": {
                    "row": 19,
                    "content": [
                        "18",  # SNo
                        "Photography & Videography",  # Niche
                        "photography-videography",  # Niche Slug
                        "Capture Life's Magic Moments & Tell Stories That Matter 📸🎬",  # Hero Tagline
                        "Become a Visual Storyteller & Document Your World in Stunning Detail",  # Sub heading
                        "<ul><li>Kids think photography requires expensive equipment</li><li>They don't understand composition and storytelling</li><li>Video editing seems too technical and complex</li></ul>",  # Problems
                        "<ul><li>Smartphone photography masterclasses</li><li>Storytelling through visual sequences</li><li>Basic editing and post-production skills</li><li>Photo and video challenge projects</li></ul>",  # Approach Steps
                        "<ul><li>They discover their artistic eye and storytelling voice</li><li>They love capturing and sharing their perspective</li><li>They develop technical skills and creative confidence</li></ul>",  # Why Kids Love This
                        "#607D8B",  # Color
                        "#455A64",  # Primary Color
                        "#90A4AE",  # Secondary Color
                        "#ECEFF1",  # Background Color
                        "photography-hero.svg",  # Illustration
                        "Arts & Crafts, Filmmaking, Content Creation"  # Suggestion
                    ]
                },
                "Trading & Investments": {
                    "row": 20,
                    "content": [
                        "19",  # SNo
                        "Trading & Investments",  # Niche
                        "trading-investments",  # Niche Slug
                        "Build Your Money Empire & Make Smart Financial Moves 💰📈",  # Hero Tagline
                        "Learn the Art of Smart Investing & Grow Your Wealth Like a Pro",  # Sub heading
                        "<ul><li>Kids think investing is only for adults with lots of money</li><li>They don't understand how markets and investments work</li><li>Financial concepts seem boring and complicated</li></ul>",  # Problems
                        "<ul><li>Virtual trading games and simulations</li><li>Real-world company research and analysis</li><li>Investment strategy planning and execution</li><li>Financial goal setting and portfolio building</li></ul>",  # Approach Steps
                        "<ul><li>They become confident about money and investing</li><li>They love the excitement of market movements</li><li>They develop long-term financial thinking</li></ul>",  # Why Kids Love This
                        "#4CAF50",  # Color
                        "#388E3C",  # Primary Color
                        "#A5D6A7",  # Secondary Color
                        "#E8F5E8",  # Background Color
                        "trading-hero.svg",  # Illustration
                        "Finance, Entrepreneurship, Mathematics"  # Suggestion
                    ]
                },
                "Games & Recreational Skills": {
                    "row": 21,
                    "content": [
                        "20",  # SNo
                        "Games & Recreational Skills",  # Niche
                        "games-recreational-skills",  # Niche Slug
                        "Master Every Game & Become the Ultimate Play Champion 🎮🏆",  # Hero Tagline
                        "Level Up Your Gaming Skills & Discover New Ways to Have Fun",  # Sub heading
                        "<ul><li>Kids get frustrated when they can't win games</li><li>They don't know how to improve their skills</li><li>Gaming feels isolating and anti-social</li></ul>",  # Problems
                        "<ul><li>Strategy development and tactical thinking</li><li>Team gaming and collaboration skills</li><li>Game design and creation projects</li><li>Healthy gaming habits and balance</li></ul>",  # Approach Steps
                        "<ul><li>They become confident and skilled players</li><li>They love the challenge and social aspects</li><li>They develop strategic thinking and teamwork</li></ul>",  # Why Kids Love This
                        "#9C27B0",  # Color
                        "#7B1FA2",  # Primary Color
                        "#CE93D8",  # Secondary Color
                        "#F3E5F5",  # Background Color
                        "games-hero.svg",  # Illustration
                        "Sports, Leadership & Team Building, Design Thinking & Creativity"  # Suggestion
                    ]
                },
                "Mathematics": {
                    "row": 22,
                    "content": [
                        "21",  # SNo
                        "Mathematics",  # Niche
                        "mathematics",  # Niche Slug
                        "Crack the Code of Numbers & Unlock the Universe's Secrets 🔢🌌",  # Hero Tagline
                        "Discover the Hidden Patterns in Everything & Solve Puzzles That Amaze",  # Sub heading
                        "<ul><li>Kids think math is boring and irrelevant to real life</li><li>They get anxious about numbers and calculations</li><li>Mathematical concepts seem abstract and confusing</li></ul>",  # Problems
                        "<ul><li>Real-world math applications and projects</li><li>Puzzle-solving and brain teaser challenges</li><li>Mathematical art and creative expressions</li><li>Number pattern discovery and exploration</li></ul>",  # Approach Steps
                        "<ul><li>They discover the beauty and logic in numbers</li><li>They love solving puzzles and cracking codes</li><li>They develop confidence in mathematical thinking</li></ul>",  # Why Kids Love This
                        "#3F51B5",  # Color
                        "#303F9F",  # Primary Color
                        "#9FA8DA",  # Secondary Color
                        "#E8EAF6",  # Background Color
                        "mathematics-hero.svg",  # Illustration
                        "Coding & Programming, Trading & Investments, General Science"  # Suggestion
                    ]
                },
                "Creative & Academic Writing": {
                    "row": 23,
                    "content": [
                        "22",  # SNo
                        "Creative & Academic Writing",  # Niche
                        "creative-academic-writing",  # Niche Slug
                        "Craft Stories That Captivate & Express Ideas That Inspire ✍️📚",  # Hero Tagline
                        "Find Your Unique Voice & Share Your Thoughts with the World",  # Sub heading
                        "<ul><li>Kids struggle to express their ideas in writing</li><li>They think writing is boring and formal</li><li>They don't know how to make their words engaging</li></ul>",  # Problems
                        "<ul><li>Creative storytelling and imagination exercises</li><li>Writing techniques and style development</li><li>Peer feedback and collaborative writing</li><li>Publishing and sharing their work</li></ul>",  # Approach Steps
                        "<ul><li>They discover their unique writing voice</li><li>They love creating and sharing their stories</li><li>They develop confidence in expressing their ideas</li></ul>",  # Why Kids Love This
                        "#795548",  # Color
                        "#5D4037",  # Primary Color
                        "#BCAAA4",  # Secondary Color
                        "#EFEBE9",  # Background Color
                        "writing-hero.svg",  # Illustration
                        "Communication, Content Creation, Children's Books"  # Suggestion
                    ]
                },
                "Social Media Literacy": {
                    "row": 24,
                    "content": [
                        "23",  # SNo
                        "Social Media Literacy",  # Niche
                        "social-media-literacy",  # Niche Slug
                        "Navigate the Digital World Safely & Build Your Positive Online Presence 📱✨",  # Hero Tagline
                        "Master Social Media Like a Pro & Create Content That Makes a Difference",  # Sub heading
                        "<ul><li>Kids don't understand online safety and privacy</li><li>They struggle with cyberbullying and negative interactions</li><li>They don't know how to create meaningful content</li></ul>",  # Problems
                        "<ul><li>Digital citizenship and online safety training</li><li>Content creation and storytelling skills</li><li>Positive online community building</li><li>Critical thinking about online information</li></ul>",  # Approach Steps
                        "<ul><li>They become confident and safe digital citizens</li><li>They love creating and sharing positive content</li><li>They develop critical thinking about online media</li></ul>",  # Why Kids Love This
                        "#00BCD4",  # Color
                        "#0097A7",  # Primary Color
                        "#80DEEA",  # Secondary Color
                        "#E0F2F1",  # Background Color
                        "social-media-hero.svg",  # Illustration
                        "Communication, Content Creation, Photography & Videography"  # Suggestion
                    ]
                },
                "Educational Apps": {
                    "row": 25,
                    "content": [
                        "24",  # SNo
                        "Educational Apps",  # Niche
                        "educational-apps",  # Niche Slug
                        "Turn Your Phone Into a Learning Powerhouse & Master Any Subject 📱🎓",  # Hero Tagline
                        "Discover the Best Learning Apps & Transform Screen Time Into Brain Time",  # Sub heading
                        "<ul><li>Kids waste time on mindless apps and games</li><li>They don't know which educational apps are effective</li><li>Screen time feels like a waste of learning opportunities</li></ul>",  # Problems
                        "<ul><li>Curated educational app recommendations</li><li>Learning goal setting and progress tracking</li><li>App review and evaluation skills</li><li>Digital learning strategy development</li></ul>",  # Approach Steps
                        "<ul><li>They discover amazing learning tools and resources</li><li>They love the interactive and engaging format</li><li>They develop self-directed learning skills</li></ul>",  # Why Kids Love This
                        "#FF9800",  # Color
                        "#F57C00",  # Primary Color
                        "#FFCC02",  # Secondary Color
                        "#FFF8E1",  # Background Color
                        "educational-apps-hero.svg",  # Illustration
                        "Coding & Programming, Teaching & Pedagogy, Mathematics"  # Suggestion
                    ]
                },
                "Teaching & Pedagogy": {
                    "row": 26,
                    "content": [
                        "25",  # SNo
                        "Teaching & Pedagogy",  # Niche
                        "teaching-pedagogy",  # Niche Slug
                        "Become a Master Teacher & Inspire Others to Learn and Grow 👩‍🏫🌟",  # Hero Tagline
                        "Develop Your Teaching Superpowers & Help Others Discover Their Potential",  # Sub heading
                        "<ul><li>Kids don't know how to explain things clearly to others</li><li>They struggle with patience when teaching friends</li><li>They don't understand different learning styles</li></ul>",  # Problems
                        "<ul><li>Teaching techniques and communication skills</li><li>Learning style identification and adaptation</li><li>Lesson planning and activity design</li><li>Peer tutoring and mentoring programs</li></ul>",  # Approach Steps
                        "<ul><li>They become confident and effective teachers</li><li>They love helping others learn and succeed</li><li>They develop leadership and communication skills</li></ul>",  # Why Kids Love This
                        "#E91E63",  # Color
                        "#C2185B",  # Primary Color
                        "#F8BBD0",  # Secondary Color
                        "#FFF0F5",  # Background Color
                        "teaching-hero.svg",  # Illustration
                        "Leadership & Team Building, Communication, Educational Apps"  # Suggestion
                    ]
                }
            }
            
            # Update each niche
            for niche_name, data in niches_data.items():
                print(f"\n📝 Updating {niche_name} (row {data['row']})...")
                
                # Update the row
                niche_ws.update(f'A{data["row"]}:N{data["row"]}', [data['content']])
                print(f"✅ {niche_name} updated successfully!")
            
            print(f"\n🎉 All 10 niches updated with engaging, unique content!")
            print(f"📊 Updated niches: {list(niches_data.keys())}")
            
            return True
            
        else:
            print("❌ 'Niche Description' worksheet not found")
            return False
        
    except Exception as e:
        print(f"❌ Error updating sheet: {e}")
        return False

if __name__ == "__main__":
    success = update_ten_more_niches()
    if success:
        print("\n🎉 All 10 niches successfully updated with engaging, unique content!")
    else:
        print("\n❌ Failed to update niches in Google Sheets.")
