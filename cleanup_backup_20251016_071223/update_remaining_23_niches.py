#!/usr/bin/env python3

import gspread
from google.oauth2.service_account import Credentials

def update_remaining_23_niches():
    """
    Update the final 23 niches with engaging, unique content
    """
    try:
        # Set up credentials
        SCOPES = ['https://www.googleapis.com/auth/spreadsheets', 'https://www.googleapis.com/auth/drive']
        SERVICE_ACCOUNT_FILE = 'google-credentials.json'
        credentials = Credentials.from_service_account_file(SERVICE_ACCOUNT_FILE, scopes=SCOPES)
        gc = gspread.authorize(credentials)
        
        print("🎯 UPDATING FINAL 23 NICHES WITH ENGAGING CONTENT")
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
            
            # Define the final 23 niches with their complete content
            niches_data = {
                "Spirituality & Devotion": {
                    "row": 42,
                    "content": [
                        "41",  # SNo
                        "Spirituality & Devotion",  # Niche
                        "spirituality-devotion",  # Niche Slug
                        "Connect With Your Inner Light & Find Peace in Every Moment 🕉️✨",  # Hero Tagline
                        "Spiritual Wisdom Guides Young Hearts Toward Inner Peace and Purpose",  # Sub heading
                        "<ul><li>Kids struggle to find meaning and purpose in life</li><li>They don't understand how to connect with their inner self</li><li>Spiritual concepts seem abstract and confusing</li></ul>",  # Problems
                        "<ul><li>Mindfulness and meditation practices for kids</li><li>Values exploration and character development</li><li>Gratitude and compassion building activities</li><li>Spiritual traditions and wisdom sharing</li></ul>",  # Approach Steps
                        "<ul><li>They develop inner peace and emotional balance</li><li>They love connecting with their spiritual side</li><li>They build strong values and character</li></ul>",  # Why Kids Love This
                        "#9C27B0",  # Color
                        "#7B1FA2",  # Primary Color
                        "#CE93D8",  # Secondary Color
                        "#F3E5F5",  # Background Color
                        "spirituality-hero.svg",  # Illustration
                        "Emotional Intelligence, Culture & Heritage, Psychology"  # Suggestion
                    ]
                },
                "Robotics": {
                    "row": 43,
                    "content": [
                        "42",  # SNo
                        "Robotics",  # Niche
                        "robotics",  # Niche Slug
                        "Build Robots That Think & Move Like Living Creatures 🤖⚙️",  # Hero Tagline
                        "Robotic Engineering Brings Machines to Life Through Programming and Design",  # Sub heading
                        "<ul><li>Kids think robotics is too complex and expensive</li><li>They don't understand how robots actually work</li><li>Programming seems intimidating and technical</li></ul>",  # Problems
                        "<ul><li>Robot building projects with step-by-step guides</li><li>Programming and coding for robotic control</li><li>Sensor integration and automation systems</li><li>Robotic competitions and challenges</li></ul>",  # Approach Steps
                        "<ul><li>They become confident robotic engineers</li><li>They love creating and controlling their own robots</li><li>They develop technical and problem-solving skills</li></ul>",  # Why Kids Love This
                        "#607D8B",  # Color
                        "#455A64",  # Primary Color
                        "#90A4AE",  # Secondary Color
                        "#ECEFF1",  # Background Color
                        "robotics-hero.svg",  # Illustration
                        "Electronics, Coding & Programming, AI"  # Suggestion
                    ]
                },
                "Space Exploration": {
                    "row": 44,
                    "content": [
                        "43",  # SNo
                        "Space Exploration",  # Niche
                        "space-exploration",  # Niche Slug
                        "Reach for the Stars & Explore the Infinite Cosmos 🚀🌌",  # Hero Tagline
                        "Astronomical Adventures Unlock the Mysteries of the Universe",  # Sub heading
                        "<ul><li>Kids think space science is too advanced</li><li>They don't understand how space exploration works</li><li>Astronomical concepts seem abstract and distant</li></ul>",  # Problems
                        "<ul><li>Space mission simulations and role-playing</li><li>Astronomy observations and stargazing activities</li><li>Rocket building and launch experiments</li><li>Space technology and engineering projects</li></ul>",  # Approach Steps
                        "<ul><li>They become fascinated by the universe</li><li>They love exploring space and astronomy</li><li>They develop scientific thinking and curiosity</li></ul>",  # Why Kids Love This
                        "#3F51B5",  # Color
                        "#303F9F",  # Primary Color
                        "#9FA8DA",  # Secondary Color
                        "#E8EAF6",  # Background Color
                        "space-exploration-hero.svg",  # Illustration
                        "General Science, Aerospace & Flight Sciences, Mathematics"  # Suggestion
                    ]
                },
                "Renewable Energy": {
                    "row": 45,
                    "content": [
                        "44",  # SNo
                        "Renewable Energy",  # Niche
                        "renewable-energy",  # Niche Slug
                        "Harness Nature's Power & Create Clean Energy for Tomorrow 🌱⚡",  # Hero Tagline
                        "Sustainable Energy Solutions Power a Greener Future for Everyone",  # Sub heading
                        "<ul><li>Kids don't understand how renewable energy works</li><li>They think energy concepts are too technical</li><li>Environmental issues seem too big to solve</li></ul>",  # Problems
                        "<ul><li>Solar and wind energy experiments</li><li>Energy efficiency and conservation projects</li><li>Clean technology innovation challenges</li><li>Sustainable living and green energy solutions</li></ul>",  # Approach Steps
                        "<ul><li>They become passionate about clean energy</li><li>They love building and testing renewable systems</li><li>They develop environmental awareness and responsibility</li></ul>",  # Why Kids Love This
                        "#4CAF50",  # Color
                        "#388E3C",  # Primary Color
                        "#A5D6A7",  # Secondary Color
                        "#E8F5E8",  # Background Color
                        "renewable-energy-hero.svg",  # Illustration
                        "Sustainability & Environment, Electrical Engineering Basics, General Science"  # Suggestion
                    ]
                },
                "Cybersecurity": {
                    "row": 46,
                    "content": [
                        "45",  # SNo
                        "Cybersecurity",  # Niche
                        "cybersecurity",  # Niche Slug
                        "Become a Digital Guardian & Protect the Online World 🔒🛡️",  # Hero Tagline
                        "Digital Security Skills Defend Against Cyber Threats and Keep Data Safe",  # Sub heading
                        "<ul><li>Kids don't understand online security risks</li><li>They think cybersecurity is too technical</li><li>Digital privacy concepts seem confusing</li></ul>",  # Problems
                        "<ul><li>Online safety and privacy protection</li><li>Password security and data protection</li><li>Cyber threat awareness and prevention</li><li>Ethical hacking and security testing</li></ul>",  # Approach Steps
                        "<ul><li>They become confident digital citizens</li><li>They love protecting others from cyber threats</li><li>They develop technical and ethical skills</li></ul>",  # Why Kids Love This
                        "#FF5722",  # Color
                        "#E64A19",  # Primary Color
                        "#FFAB91",  # Secondary Color
                        "#FFF3E0",  # Background Color
                        "cybersecurity-hero.svg",  # Illustration
                        "Coding & Programming, AI, Social Media Literacy"  # Suggestion
                    ]
                },
                "Marine Biology": {
                    "row": 47,
                    "content": [
                        "46",  # SNo
                        "Marine Biology",  # Niche
                        "marine-biology",  # Niche Slug
                        "Dive Into Ocean Depths & Discover Underwater Wonders 🐠🌊",  # Hero Tagline
                        "Marine Science Explores the Fascinating World Beneath the Waves",  # Sub heading
                        "<ul><li>Kids think marine biology is only for scuba divers</li><li>They don't understand ocean ecosystems</li><li>Marine science seems too specialized</li></ul>",  # Problems
                        "<ul><li>Ocean ecosystem exploration and study</li><li>Marine animal behavior and conservation</li><li>Aquatic habitat protection and restoration</li><li>Ocean technology and research methods</li></ul>",  # Approach Steps
                        "<ul><li>They become passionate about ocean life</li><li>They love exploring marine environments</li><li>They develop scientific and conservation skills</li></ul>",  # Why Kids Love This
                        "#00BCD4",  # Color
                        "#0097A7",  # Primary Color
                        "#80DEEA",  # Secondary Color
                        "#E0F2F1",  # Background Color
                        "marine-biology-hero.svg",  # Illustration
                        "Nature Exploration, General Science, Sustainability & Environment"  # Suggestion
                    ]
                },
                "Architecture & Design": {
                    "row": 48,
                    "content": [
                        "47",  # SNo
                        "Architecture & Design",  # Niche
                        "architecture-design",  # Niche Slug
                        "Design Buildings That Inspire & Shape the World Around Us 🏗️✨",  # Hero Tagline
                        "Architectural Vision Creates Spaces That Enhance Human Experience",  # Sub heading
                        "<ul><li>Kids think architecture is too technical and boring</li><li>They don't understand how buildings are designed</li><li>Design concepts seem abstract and complex</li></ul>",  # Problems
                        "<ul><li>Building design and modeling projects</li><li>Space planning and functionality exercises</li><li>Architectural history and style exploration</li><li>Sustainable design and green building practices</li></ul>",  # Approach Steps
                        "<ul><li>They become confident architectural designers</li><li>They love creating and building their own structures</li><li>They develop spatial thinking and creativity</li></ul>",  # Why Kids Love This
                        "#795548",  # Color
                        "#5D4037",  # Primary Color
                        "#BCAAA4",  # Secondary Color
                        "#EFEBE9",  # Background Color
                        "architecture-hero.svg",  # Illustration
                        "Design Thinking & Creativity, Construction & Structural Engineering, Arts & Crafts"  # Suggestion
                    ]
                },
                "Psychology": {
                    "row": 49,
                    "content": [
                        "48",  # SNo
                        "Psychology",  # Niche
                        "psychology",  # Niche Slug
                        "Unlock the Mysteries of the Mind & Understand Human Behavior 🧠💭",  # Hero Tagline
                        "Psychological Science Reveals the Complex Workings of Human Thought and Emotion",  # Sub heading
                        "<ul><li>Kids think psychology is only for adults with problems</li><li>They don't understand how the mind works</li><li>Psychological concepts seem too abstract</li></ul>",  # Problems
                        "<ul><li>Mind and behavior exploration activities</li><li>Emotional intelligence and social skills</li><li>Psychological experiments and observations</li><li>Mental health awareness and self-care</li></ul>",  # Approach Steps
                        "<ul><li>They become more self-aware and empathetic</li><li>They love understanding themselves and others</li><li>They develop emotional and social intelligence</li></ul>",  # Why Kids Love This
                        "#E91E63",  # Color
                        "#C2185B",  # Primary Color
                        "#F8BBD0",  # Secondary Color
                        "#FFF0F5",  # Background Color
                        "psychology-hero.svg",  # Illustration
                        "Behavioral Science, Emotional Intelligence, Human Biology"  # Suggestion
                    ]
                },
                "Filmmaking": {
                    "row": 50,
                    "content": [
                        "49",  # SNo
                        "Filmmaking",  # Niche
                        "filmmaking",  # Niche Slug
                        "Create Cinematic Masterpieces & Tell Stories That Move Hearts 🎬🎭",  # Hero Tagline
                        "Film Production Brings Stories to Life Through Visual Storytelling",  # Sub heading
                        "<ul><li>Kids think filmmaking requires expensive equipment</li><li>They don't understand how movies are made</li><li>Video production seems too technical</li></ul>",  # Problems
                        "<ul><li>Storytelling and scriptwriting workshops</li><li>Camera work and cinematography techniques</li><li>Video editing and post-production skills</li><li>Film analysis and critique activities</li></ul>",  # Approach Steps
                        "<ul><li>They become confident filmmakers and storytellers</li><li>They love creating and sharing their own films</li><li>They develop technical and creative skills</li></ul>",  # Why Kids Love This
                        "#FF9800",  # Color
                        "#F57C00",  # Primary Color
                        "#FFCC02",  # Secondary Color
                        "#FFF8E1",  # Background Color
                        "filmmaking-hero.svg",  # Illustration
                        "Photography & Videography, Creative & Academic Writing, Arts & Crafts"  # Suggestion
                    ]
                },
                "Cryptocurrency & Blockchain": {
                    "row": 51,
                    "content": [
                        "50",  # SNo
                        "Cryptocurrency & Blockchain",  # Niche
                        "cryptocurrency-blockchain",  # Niche Slug
                        "Master Digital Money & Build the Future of Finance 💰🔗",  # Hero Tagline
                        "Blockchain Technology Revolutionizes How We Think About Money and Trust",  # Sub heading
                        "<ul><li>Kids think cryptocurrency is too complex and risky</li><li>They don't understand how digital money works</li><li>Blockchain concepts seem too technical</li></ul>",  # Problems
                        "<ul><li>Digital currency and blockchain education</li><li>Cryptocurrency trading simulations</li><li>Blockchain technology and applications</li><li>Financial technology and innovation</li></ul>",  # Approach Steps
                        "<ul><li>They become confident about digital finance</li><li>They love understanding cutting-edge technology</li><li>They develop financial and technical literacy</li></ul>",  # Why Kids Love This
                        "#FFC107",  # Color
                        "#FF8F00",  # Primary Color
                        "#FFE082",  # Secondary Color
                        "#FFFDE7",  # Background Color
                        "cryptocurrency-hero.svg",  # Illustration
                        "Trading & Investments, Coding & Programming, Mathematics"  # Suggestion
                    ]
                },
                "Agriculture & Soil Science": {
                    "row": 52,
                    "content": [
                        "51",  # SNo
                        "Agriculture & Soil Science",  # Niche
                        "agriculture-soil-science",  # Niche Slug
                        "Grow Your Own Food & Master the Art of Sustainable Farming 🌾🌱",  # Hero Tagline
                        "Agricultural Science Nourishes Communities Through Sustainable Food Production",  # Sub heading
                        "<ul><li>Kids think farming is old-fashioned and boring</li><li>They don't understand how food is grown</li><li>Agricultural science seems too rural</li></ul>",  # Problems
                        "<ul><li>Gardening and farming hands-on projects</li><li>Soil science and plant biology studies</li><li>Sustainable agriculture and food systems</li><li>Agricultural technology and innovation</li></ul>",  # Approach Steps
                        "<ul><li>They become passionate about food production</li><li>They love growing and nurturing plants</li><li>They develop environmental and scientific awareness</li></ul>",  # Why Kids Love This
                        "#8BC34A",  # Color
                        "#689F38",  # Primary Color
                        "#C5E1A5",  # Secondary Color
                        "#F1F8E9",  # Background Color
                        "agriculture-hero.svg",  # Illustration
                        "Nature Exploration, Food & Nutrition, Sustainability & Environment"  # Suggestion
                    ]
                },
                "Supply Chain & Logistics": {
                    "row": 53,
                    "content": [
                        "52",  # SNo
                        "Supply Chain & Logistics",  # Niche
                        "supply-chain-logistics",  # Niche Slug
                        "Master the Art of Moving Things & Keep the World Running Smoothly 📦🚚",  # Hero Tagline
                        "Logistics Excellence Ensures Products Reach People When and Where They Need Them",  # Sub heading
                        "<ul><li>Kids think logistics is boring and uninteresting</li><li>They don't understand how products get to stores</li><li>Supply chain concepts seem too business-focused</li></ul>",  # Problems
                        "<ul><li>Supply chain simulation and role-playing</li><li>Logistics problem-solving and optimization</li><li>Transportation and distribution planning</li><li>Global trade and commerce exploration</li></ul>",  # Approach Steps
                        "<ul><li>They become fascinated by global commerce</li><li>They love solving complex logistical puzzles</li><li>They develop analytical and strategic thinking</li></ul>",  # Why Kids Love This
                        "#607D8B",  # Color
                        "#455A64",  # Primary Color
                        "#90A4AE",  # Secondary Color
                        "#ECEFF1",  # Background Color
                        "supply-chain-hero.svg",  # Illustration
                        "Mathematics, Trading & Investments, Leadership & Team Building"  # Suggestion
                    ]
                },
                "Aerospace & Flight Sciences": {
                    "row": 54,
                    "content": [
                        "53",  # SNo
                        "Aerospace & Flight Sciences",  # Niche
                        "aerospace-flight-sciences",  # Niche Slug
                        "Soar Through the Skies & Engineer the Future of Flight ✈️🚁",  # Hero Tagline
                        "Aerospace Engineering Defies Gravity and Opens New Horizons of Possibility",  # Sub heading
                        "<ul><li>Kids think aerospace is only for rocket scientists</li><li>They don't understand how flight actually works</li><li>Aviation concepts seem too advanced</li></ul>",  # Problems
                        "<ul><li>Flight simulation and aviation experiences</li><li>Aircraft design and engineering projects</li><li>Aerodynamics and flight physics experiments</li><li>Space technology and exploration missions</li></ul>",  # Approach Steps
                        "<ul><li>They become passionate about aviation and space</li><li>They love understanding the science of flight</li><li>They develop engineering and scientific skills</li></ul>",  # Why Kids Love This
                        "#3F51B5",  # Color
                        "#303F9F",  # Primary Color
                        "#9FA8DA",  # Secondary Color
                        "#E8EAF6",  # Background Color
                        "aerospace-hero.svg",  # Illustration
                        "Space Exploration, Mathematics, General Science"  # Suggestion
                    ]
                },
                "Smart Urban Living": {
                    "row": 55,
                    "content": [
                        "54",  # SNo
                        "Smart Urban Living",  # Niche
                        "smart-urban-living",  # Niche Slug
                        "Design Smart Cities & Create the Urban Future of Tomorrow 🏙️🤖",  # Hero Tagline
                        "Urban Innovation Transforms Cities Into Sustainable, Connected Communities",  # Sub heading
                        "<ul><li>Kids think urban planning is boring and technical</li><li>They don't understand how cities are designed</li><li>Smart city concepts seem too futuristic</li></ul>",  # Problems
                        "<ul><li>City planning and urban design projects</li><li>Smart technology integration and IoT systems</li><li>Sustainable urban development and green cities</li><li>Community engagement and civic participation</li></ul>",  # Approach Steps
                        "<ul><li>They become passionate about urban development</li><li>They love designing and improving their communities</li><li>They develop civic engagement and innovation skills</li></ul>",  # Why Kids Love This
                        "#9C27B0",  # Color
                        "#7B1FA2",  # Primary Color
                        "#CE93D8",  # Secondary Color
                        "#F3E5F5",  # Background Color
                        "smart-urban-hero.svg",  # Illustration
                        "Architecture & Design, Internet of Things (IoT), Sustainability & Environment"  # Suggestion
                    ]
                },
                "Media Production & Broadcasting": {
                    "row": 56,
                    "content": [
                        "55",  # SNo
                        "Media Production & Broadcasting",  # Niche
                        "media-production-broadcasting",  # Niche Slug
                        "Create Professional Media & Broadcast Stories That Matter 📺🎙️",  # Hero Tagline
                        "Broadcasting Excellence Reaches Audiences Through Professional Media Production",  # Sub heading
                        "<ul><li>Kids think broadcasting is only for TV professionals</li><li>They don't understand how media production works</li><li>Broadcasting equipment seems too expensive</li></ul>",  # Problems
                        "<ul><li>Media production and broadcasting workshops</li><li>Audio and video production techniques</li><li>Live streaming and digital broadcasting</li><li>Media literacy and communication skills</li></ul>",  # Approach Steps
                        "<ul><li>They become confident media producers</li><li>They love creating and sharing professional content</li><li>They develop technical and communication skills</li></ul>",  # Why Kids Love This
                        "#FF5722",  # Color
                        "#E64A19",  # Primary Color
                        "#FFAB91",  # Secondary Color
                        "#FFF3E0",  # Background Color
                        "media-production-hero.svg",  # Illustration
                        "Filmmaking, Photography & Videography, Public Speaking & Debate"  # Suggestion
                    ]
                },
                "Content Creation": {
                    "row": 57,
                    "content": [
                        "56",  # SNo
                        "Content Creation",  # Niche
                        "content-creation",  # Niche Slug
                        "Craft Compelling Content & Build Your Digital Empire 📝💻",  # Hero Tagline
                        "Creative Content Development Engages Audiences and Builds Online Communities",  # Sub heading
                        "<ul><li>Kids think content creation is only for influencers</li><li>They don't know how to create engaging content</li><li>Digital marketing concepts seem too commercial</li></ul>",  # Problems
                        "<ul><li>Content strategy and planning workshops</li><li>Creative writing and storytelling techniques</li><li>Digital media production and editing</li><li>Audience engagement and community building</li></ul>",  # Approach Steps
                        "<ul><li>They become confident content creators</li><li>They love sharing their ideas and stories</li><li>They develop creative and marketing skills</li></ul>",  # Why Kids Love This
                        "#00BCD4",  # Color
                        "#0097A7",  # Primary Color
                        "#80DEEA",  # Secondary Color
                        "#E0F2F1",  # Background Color
                        "content-creation-hero.svg",  # Illustration
                        "Creative & Academic Writing, Social Media Literacy, Photography & Videography"  # Suggestion
                    ]
                },
                "Product Design & User Experience (UX)": {
                    "row": 58,
                    "content": [
                        "57",  # SNo
                        "Product Design & User Experience (UX)",  # Niche
                        "product-design-ux",  # Niche Slug
                        "Design Products That Delight & Create Experiences People Love 🎯✨",  # Hero Tagline
                        "User-Centered Design Creates Products That Solve Real Problems Beautifully",  # Sub heading
                        "<ul><li>Kids think product design is too technical</li><li>They don't understand how user experience works</li><li>Design thinking seems too abstract</li></ul>",  # Problems
                        "<ul><li>User research and empathy building</li><li>Product prototyping and testing</li><li>Interface design and usability principles</li><li>Design thinking and innovation processes</li></ul>",  # Approach Steps
                        "<ul><li>They become confident product designers</li><li>They love creating solutions that help people</li><li>They develop empathy and design thinking skills</li></ul>",  # Why Kids Love This
                        "#673AB7",  # Color
                        "#512DA8",  # Primary Color
                        "#B39DDB",  # Secondary Color
                        "#F3E5F5",  # Background Color
                        "product-design-hero.svg",  # Illustration
                        "Design Thinking & Creativity, Coding & Programming, Arts & Crafts"  # Suggestion
                    ]
                },
                "Emergency Response & Safety Skills": {
                    "row": 59,
                    "content": [
                        "58",  # SNo
                        "Emergency Response & Safety Skills",  # Niche
                        "emergency-response-safety",  # Niche Slug
                        "Become a Safety Hero & Save Lives When It Matters Most 🚨🦸‍♂️",  # Hero Tagline
                        "Emergency Preparedness Builds Confidence and Life-Saving Skills",  # Sub heading
                        "<ul><li>Kids think emergency response is only for adults</li><li>They don't know how to handle emergency situations</li><li>Safety skills seem scary and overwhelming</li></ul>",  # Problems
                        "<ul><li>First aid and emergency response training</li><li>Safety awareness and prevention education</li><li>Crisis management and leadership skills</li><li>Community safety and preparedness planning</li></ul>",  # Approach Steps
                        "<ul><li>They become confident safety leaders</li><li>They love helping and protecting others</li><li>They develop leadership and responsibility skills</li></ul>",  # Why Kids Love This
                        "#F44336",  # Color
                        "#D32F2F",  # Primary Color
                        "#FFCDD2",  # Secondary Color
                        "#FFEBEE",  # Background Color
                        "emergency-response-hero.svg",  # Illustration
                        "Leadership & Team Building, Health & Hygiene, Physical Fitness"  # Suggestion
                    ]
                },
                "Construction & Structural Engineering": {
                    "row": 60,
                    "content": [
                        "59",  # SNo
                        "Construction & Structural Engineering",  # Niche
                        "construction-structural-engineering",  # Niche Slug
                        "Build Structures That Stand Strong & Shape the Built Environment 🏗️🔧",  # Hero Tagline
                        "Structural Engineering Creates Safe, Durable Buildings That Withstand Time",  # Sub heading
                        "<ul><li>Kids think construction is dangerous and dirty</li><li>They don't understand how buildings are built</li><li>Engineering concepts seem too technical</li></ul>",  # Problems
                        "<ul><li>Building construction and safety projects</li><li>Structural design and engineering principles</li><li>Construction technology and innovation</li><li>Architectural planning and project management</li></ul>",  # Approach Steps
                        "<ul><li>They become confident builders and engineers</li><li>They love creating and constructing structures</li><li>They develop technical and problem-solving skills</li></ul>",  # Why Kids Love This
                        "#795548",  # Color
                        "#5D4037",  # Primary Color
                        "#BCAAA4",  # Secondary Color
                        "#EFEBE9",  # Background Color
                        "construction-hero.svg",  # Illustration
                        "Architecture & Design, Mathematics, Tools & Machines Literacy"  # Suggestion
                    ]
                },
                "Tools & Machines Literacy": {
                    "row": 61,
                    "content": [
                        "60",  # SNo
                        "Tools & Machines Literacy",  # Niche
                        "tools-machines-literacy",  # Niche Slug
                        "Master Every Tool & Build Anything You Can Imagine 🔧⚙️",  # Hero Tagline
                        "Mechanical Literacy Empowers Kids to Create and Fix Things with Confidence",  # Sub heading
                        "<ul><li>Kids think tools are dangerous and scary</li><li>They don't understand how machines work</li><li>Mechanical concepts seem too complex</li></ul>",  # Problems
                        "<ul><li>Tool safety and proper usage training</li><li>Machine operation and maintenance skills</li><li>Mechanical problem-solving and repair</li><li>Construction and building projects</li></ul>",  # Approach Steps
                        "<ul><li>They become confident tool users</li><li>They love building and fixing things</li><li>They develop mechanical and practical skills</li></ul>",  # Why Kids Love This
                        "#607D8B",  # Color
                        "#455A64",  # Primary Color
                        "#90A4AE",  # Secondary Color
                        "#ECEFF1",  # Background Color
                        "tools-machines-hero.svg",  # Illustration
                        "Construction & Structural Engineering, Electronics, Design Thinking & Creativity"  # Suggestion
                    ]
                },
                "Ayurveda & Natural Healing": {
                    "row": 62,
                    "content": [
                        "61",  # SNo
                        "Ayurveda & Natural Healing",  # Niche
                        "ayurveda-natural-healing",  # Niche Slug
                        "Discover Ancient Wisdom & Heal Naturally with Nature's Gifts 🌿💚",  # Hero Tagline
                        "Traditional Healing Practices Restore Balance and Promote Natural Wellness",  # Sub heading
                        "<ul><li>Kids think natural healing is old-fashioned</li><li>They don't understand how traditional medicine works</li><li>Wellness concepts seem too alternative</li></ul>",  # Problems
                        "<ul><li>Herbal medicine and natural remedies</li><li>Holistic wellness and lifestyle practices</li><li>Mind-body connection and stress management</li><li>Traditional healing and cultural wisdom</li></ul>",  # Approach Steps
                        "<ul><li>They become passionate about natural wellness</li><li>They love learning traditional healing methods</li><li>They develop holistic health awareness</li></ul>",  # Why Kids Love This
                        "#8BC34A",  # Color
                        "#689F38",  # Primary Color
                        "#C5E1A5",  # Secondary Color
                        "#F1F8E9",  # Background Color
                        "ayurveda-hero.svg",  # Illustration
                        "Health & Hygiene, Food & Nutrition, Culture & Heritage"  # Suggestion
                    ]
                },
                "Applied Chemistry & Materials": {
                    "row": 63,
                    "content": [
                        "62",  # SNo
                        "Applied Chemistry & Materials",  # Niche
                        "applied-chemistry-materials",  # Niche Slug
                        "Mix, React & Create Amazing Materials That Change the World 🧪⚗️",  # Hero Tagline
                        "Chemical Science Develops New Materials That Solve Real-World Problems",  # Sub heading
                        "<ul><li>Kids think chemistry is dangerous and boring</li><li>They don't understand how materials are created</li><li>Chemical concepts seem too abstract</li></ul>",  # Problems
                        "<ul><li>Safe chemistry experiments and reactions</li><li>Material science and properties exploration</li><li>Chemical engineering and product development</li><li>Environmental chemistry and sustainability</li></ul>",  # Approach Steps
                        "<ul><li>They become fascinated by chemical reactions</li><li>They love creating and testing new materials</li><li>They develop scientific and analytical skills</li></ul>",  # Why Kids Love This
                        "#FF9800",  # Color
                        "#F57C00",  # Primary Color
                        "#FFCC02",  # Secondary Color
                        "#FFF8E1",  # Background Color
                        "applied-chemistry-hero.svg",  # Illustration
                        "General Science, Food & Nutrition, Sustainability & Environment"  # Suggestion
                    ]
                },
                "Fundamental Physics & Forces": {
                    "row": 64,
                    "content": [
                        "63",  # SNo
                        "Fundamental Physics & Forces",  # Niche
                        "fundamental-physics-forces",  # Niche Slug
                        "Unlock the Universe's Secrets & Master the Forces That Shape Reality ⚛️🌌",  # Hero Tagline
                        "Physics Principles Reveal the Fundamental Laws That Govern Everything",  # Sub heading
                        "<ul><li>Kids think physics is too difficult and abstract</li><li>They don't understand how forces work</li><li>Physical concepts seem too theoretical</li></ul>",  # Problems
                        "<ul><li>Physics experiments and demonstrations</li><li>Force and motion exploration activities</li><li>Energy and matter investigation projects</li><li>Scientific method and hypothesis testing</li></ul>",  # Approach Steps
                        "<ul><li>They become fascinated by the laws of physics</li><li>They love understanding how the universe works</li><li>They develop scientific thinking and curiosity</li></ul>",  # Why Kids Love This
                        "#3F51B5",  # Color
                        "#303F9F",  # Primary Color
                        "#9FA8DA",  # Secondary Color
                        "#E8EAF6",  # Background Color
                        "fundamental-physics-hero.svg",  # Illustration
                        "General Science, Mathematics, Space Exploration"  # Suggestion
                    ]
                }
            }
            
            # Update each niche
            for niche_name, data in niches_data.items():
                print(f"\n📝 Updating {niche_name} (row {data['row']})...")
                
                # Update the row
                niche_ws.update(f'A{data["row"]}:N{data["row"]}', [data['content']])
                print(f"✅ {niche_name} updated successfully!")
            
            print(f"\n🎉 All 23 final niches updated with engaging, unique content!")
            print(f"📊 Updated niches: {list(niches_data.keys())}")
            
            return True
            
        else:
            print("❌ 'Niche Description' worksheet not found")
            return False
        
    except Exception as e:
        print(f"❌ Error updating sheet: {e}")
        return False

if __name__ == "__main__":
    success = update_remaining_23_niches()
    if success:
        print("\n🎉 All 23 final niches successfully updated with engaging, unique content!")
    else:
        print("\n❌ Failed to update niches in Google Sheets.")
