-- Import All Local Data to Staging Database
-- This imports all your local JSON data to the staging environment

-- Connect to staging database
\c unschooling_staging;

-- =====================================================
-- 1. IMPORT NICHE CATEGORIES FROM YOUR JSON DATA
-- =====================================================
INSERT INTO niche_categories_staging (category_name, description, color_code, icon_name, sort_order) VALUES
-- From your src/data/niches/index.json
('Core Academic', 'Fundamental academic subjects and skills', '#3B82F6', 'graduation-cap', 1),
('Creative Arts', 'Artistic expression and creative skills', '#EC4899', 'paint-palette', 2),
('Technology', 'Digital skills and technology literacy', '#8B5CF6', 'cpu', 3),
('Life Skills', 'Essential life and social skills', '#10B981', 'user-circle', 4),
('Physical & Social', 'Physical activities and social interaction', '#F59E0B', 'users', 5),
('Science & Engineering', 'Scientific exploration and engineering', '#EF4444', 'flask', 6),
('Sustainability & Environment', 'Environmental awareness and sustainability', '#22C55E', 'leaf', 7),
('Health & Wellness', 'Physical and mental health', '#F97316', 'heart', 8),
('Media & Communication', 'Communication and media skills', '#6366F1', 'megaphone', 9);

-- =====================================================
-- 2. IMPORT NICHES FROM YOUR JSON DATA
-- =====================================================
INSERT INTO niches_staging (niche_name, niche_slug, category_id, hero_tagline, sub_heading, problems, approach_steps, why_kids_love, color_code, primary_color, secondary_color, background_color, illustration, suggestion) VALUES
-- Core Academic niches
('Finance', 'finance', (SELECT id FROM niche_categories_staging WHERE category_name = 'Core Academic'), 
 'Master money management from age 3', 'Empowering Kids to Understand Money and Build Smart Habits Early',
 'Kids struggle with financial concepts and money management', 'Step 1: Introduction, Step 2: Practice, Step 3: Application',
 'Fun activities and real-world relevance', '#059669', '#F39C12', '#F1C40F', '#FFF8DC', 'finance-hero.png', 'Entrepreneurship, Mathematics'),

('Communication', 'communication', (SELECT id FROM niche_categories_staging WHERE category_name = 'Core Academic'),
 'Express yourself clearly and confidently', 'Develop effective communication skills',
 'Kids struggle with expressing thoughts clearly', 'Step 1: Listening, Step 2: Speaking, Step 3: Practice',
 'Interactive games and storytelling', '#DC2626', '#EF4444', '#F87171', '#FEF2F2', 'communication-hero.png', 'Public Speaking, Leadership'),

('Mathematics', 'mathematics', (SELECT id FROM niche_categories_staging WHERE category_name = 'Core Academic'),
 'Make numbers your friend', 'Build strong mathematical foundations',
 'Math anxiety and abstract concepts', 'Step 1: Visual learning, Step 2: Practice, Step 3: Application',
 'Hands-on activities and games', '#7C3AED', '#8B5CF6', '#A78BFA', '#F3F4F6', 'math-hero.png', 'Finance, Science'),

('History', 'history', (SELECT id FROM niche_categories_staging WHERE category_name = 'Core Academic'),
 'Discover the stories of our past', 'Explore historical events and cultures',
 'History seems boring and irrelevant', 'Step 1: Stories, Step 2: Context, Step 3: Connection',
 'Exciting stories and role-playing', '#B45309', '#D97706', '#F59E0B', '#FFFBEB', 'history-hero.png', 'Civics, Culture'),

('Civics & Government', 'civics-government', (SELECT id FROM niche_categories_staging WHERE category_name = 'Core Academic'),
 'Understand how society works', 'Learn about civic responsibility and governance',
 'Complex government structures', 'Step 1: Local, Step 2: National, Step 3: Global',
 'Real-world examples and simulations', '#1D4ED8', '#3B82F6', '#60A5FA', '#EFF6FF', 'civics-hero.png', 'History, Leadership'),

-- Creative Arts niches
('Dance', 'dance', (SELECT id FROM niche_categories_staging WHERE category_name = 'Creative Arts'),
 'Express Yourself Through Movement', 'Building Confidence and Creativity Through Dance',
 'Lack of confidence in movement', 'Step 1: Basic moves, Step 2: Choreography, Step 3: Performance',
 'Music, rhythm, and self-expression', '#ec4899', '#f43f5e', '#fb7185', '#fdf2f8', 'dance-hero.png', 'Music, Physical Fitness'),

('Music', 'music', (SELECT id FROM niche_categories_staging WHERE category_name = 'Creative Arts'),
 'Create harmony in your world', 'Develop musical skills and appreciation',
 'Difficulty with rhythm and coordination', 'Step 1: Listening, Step 2: Playing, Step 3: Creating',
 'Instruments, songs, and creativity', '#F59E0B', '#D97706', '#FBBF24', '#FFFBEB', 'music-hero.png', 'Dance, Arts'),

('Arts & Crafts', 'arts-crafts', (SELECT id FROM niche_categories_staging WHERE category_name = 'Creative Arts'),
 'Create beauty with your hands', 'Explore artistic expression through crafts',
 'Messy materials and cleanup', 'Step 1: Simple projects, Step 2: Techniques, Step 3: Mastery',
 'Colors, textures, and creativity', '#EF4444', '#DC2626', '#F87171', '#FEF2F2', 'arts-hero.png', 'Design, Creativity'),

('Design Thinking & Creativity', 'design-thinking-creativity', (SELECT id FROM niche_categories_staging WHERE category_name = 'Creative Arts'),
 'Think outside the box', 'Develop creative problem-solving skills',
 'Fear of making mistakes', 'Step 1: Brainstorming, Step 2: Prototyping, Step 3: Testing',
 'Open-ended challenges and innovation', '#8B5CF6', '#7C3AED', '#A78BFA', '#F3F4F6', 'design-hero.png', 'Arts, Innovation'),

-- Technology niches
('AI & Machine Learning', 'ai', (SELECT id FROM niche_categories_staging WHERE category_name = 'Technology'),
 'Shape the future with artificial intelligence', 'Learn about AI and its applications',
 'Complex algorithms and concepts', 'Step 1: Understanding, Step 2: Applications, Step 3: Ethics',
 'Futuristic technology and possibilities', '#6366F1', '#4F46E5', '#818CF8', '#EEF2FF', 'ai-hero.png', 'Coding, Mathematics'),

('Coding & Programming', 'coding-programming', (SELECT id FROM niche_categories_staging WHERE category_name = 'Technology'),
 'Build the digital world', 'Master programming fundamentals',
 'Abstract logic and syntax', 'Step 1: Visual coding, Step 2: Text coding, Step 3: Projects',
 'Creating games and apps', '#059669', '#047857', '#10B981', '#ECFDF5', 'coding-hero.png', 'AI, Robotics'),

('Robotics', 'robotics', (SELECT id FROM niche_categories_staging WHERE category_name = 'Technology'),
 'Bring machines to life', 'Design and program robots',
 'Complex hardware and programming', 'Step 1: Building, Step 2: Programming, Step 3: Automation',
 'Physical robots and automation', '#DC2626', '#B91C1C', '#EF4444', '#FEF2F2', 'robotics-hero.png', 'Coding, Engineering'),

('Cybersecurity', 'cybersecurity', (SELECT id FROM niche_categories_staging WHERE category_name = 'Technology'),
 'Protect the digital world', 'Learn to keep information safe',
 'Complex security concepts', 'Step 1: Awareness, Step 2: Protection, Step 3: Response',
 'Digital detective work and protection', '#B45309', '#92400E', '#D97706', '#FFFBEB', 'cybersecurity-hero.png', 'Coding, Ethics'),

-- Life Skills niches
('Entrepreneurship', 'entrepreneurship', (SELECT id FROM niche_categories_staging WHERE category_name = 'Life Skills'),
 'Turn ideas into reality', 'Develop entrepreneurial mindset and skills',
 'Fear of failure and risk', 'Step 1: Ideation, Step 2: Planning, Step 3: Execution',
 'Creating businesses and solving problems', '#10B981', '#047857', '#34D399', '#ECFDF5', 'entrepreneurship-hero.png', 'Finance, Leadership'),

('Leadership & Team Building', 'leadership-team-building', (SELECT id FROM niche_categories_staging WHERE category_name = 'Life Skills'),
 'Lead with confidence and empathy', 'Build leadership and collaboration skills',
 'Fear of responsibility and conflict', 'Step 1: Self-awareness, Step 2: Team dynamics, Step 3: Leadership',
 'Team projects and leadership roles', '#3B82F6', '#1D4ED8', '#60A5FA', '#EFF6FF', 'leadership-hero.png', 'Communication, Teamwork'),

('Emotional Intelligence', 'emotional-intelligence', (SELECT id FROM niche_categories_staging WHERE category_name = 'Life Skills'),
 'Understand and manage emotions', 'Develop emotional awareness and regulation',
 'Difficulty expressing and managing emotions', 'Step 1: Recognition, Step 2: Expression, Step 3: Regulation',
 'Emotional awareness and empathy', '#EC4899', '#DB2777', '#F472B6', '#FDF2F8', 'emotional-hero.png', 'Communication, Mindfulness'),

('Public Speaking & Debate', 'public-speaking-debate', (SELECT id FROM niche_categories_staging WHERE category_name = 'Life Skills'),
 'Speak with confidence and clarity', 'Master the art of public speaking',
 'Fear of speaking in public', 'Step 1: Practice, Step 2: Structure, Step 3: Delivery',
 'Confidence building and expression', '#F59E0B', '#D97706', '#FBBF24', '#FFFBEB', 'speaking-hero.png', 'Communication, Leadership');

-- =====================================================
-- 3. IMPORT NICHE TOPICS FROM YOUR JSON DATA
-- =====================================================
INSERT INTO niche_topics_staging (niche_id, topic_number, topic_name, objective, explanation, hashtags, estimated_time, age, activity_1, activity_2, source_id) VALUES
-- Finance topics (from your src/data/niches/finance/topics.json)
((SELECT id FROM niches_staging WHERE niche_slug = 'finance'), 1, 'Understanding Money', 
 'To introduce the concept of money and its purpose.',
 'Money is a tool we use to exchange goods and services. It has different forms, such as coins and bills. Each coin and bill has a specific value.',
 '#Finance #Money #Invest', '20 mins', 3,
 'Money Sorting\nMaterials Needed: Mix of real or play Indian coins and bills, sorting trays or bowls.\nSteps to Follow:\n• Provide a mix of ₹1, ₹2, ₹5, ₹10 coins and ₹10, ₹20, ₹50 bills.\n• Ask the child to separate coins and bills into two groups.\n• Further sort them by value.\n• Encourage the child to count each group aloud.\nWhat Should Be Achieved:\nChild identifies money by form and value.\nWhat is Gained:\n• Visual classification\n• Basic counting\n• Early money-handling skill',
 'Shopping Pretend Play\nMaterials Needed: Play money, toys or snacks, table or shelf for setup.\nSteps to Follow:\n• Set up a pretend store.\n• Give the child play money.\n• Let them "buy" items.\n• Practice giving money and receiving change.\nWhat Should Be Achieved:\nBasic money exchange understanding.\nWhat is Gained:\n• Real-life simulation\n• Confidence using money',
 'finance_topic_1'),

((SELECT id FROM niches_staging WHERE niche_slug = 'finance'), 2, 'Counting Coins', 
 'To learn to count different coin values',
 'Practice counting coins of different denominations to understand their values and relationships.',
 '#Finance #Money #Counting', '25 mins', 4,
 'Coin Recognition Game\nMaterials Needed: Real or play coins and bills, coin/bill chart.\nSteps to Follow:\n• Show the child a coin or bill.\n• Ask them to name its value.\n• Match it to the correct space on the chart.\nWhat Should Be Achieved:\nRecognize and name common money types.\nWhat is Gained:\n• Memory skills\n• Visual identification\n• Currency knowledge',
 'Money Matching\nMaterials Needed: Pairs of coins/bills or matching cards.\nSteps to Follow:\n• Lay out the cards face down.\n• Take turns flipping cards to find matches.\n• Match same values together.\nWhat Should Be Achieved:\nUnderstand money equivalence.\nWhat is Gained:\n• Matching skills\n• Value recognition',
 'finance_topic_2'),

((SELECT id FROM niches_staging WHERE niche_slug = 'finance'), 3, 'Saving Money', 
 'To understand the concept of saving',
 'Learn why saving money is important and how to start saving for goals.',
 '#Finance #Saving #Goals', '30 mins', 5,
 'Piggy Bank Activity\nMaterials Needed: Piggy bank, coins, savings chart.\nSteps to Follow:\n• Give the child a piggy bank.\n• Show them how to save coins.\n• Create a savings chart for goals.\n• Track progress regularly.\nWhat Should Be Achieved:\nUnderstanding of saving concept.\nWhat is Gained:\n• Goal setting\n• Delayed gratification\n• Financial planning',
 'Savings Goal Chart\nMaterials Needed: Chart paper, stickers, markers.\nSteps to Follow:\n• Create a savings goal chart.\n• Set a small achievable goal.\n• Track progress with stickers.\n• Celebrate when goal is reached.\nWhat Should Be Achieved:\nGoal-oriented saving behavior.\nWhat is Gained:\n• Planning skills\n• Achievement motivation\n• Financial discipline',
 'finance_topic_3'),

-- Communication topics
((SELECT id FROM niches_staging WHERE niche_slug = 'communication'), 1, 'Speaking Clearly', 
 'To develop clear speech patterns',
 'Practice speaking clearly and confidently in different situations.',
 '#Communication #Speaking #Confidence', '15 mins', 3,
 'Mirror Practice\nMaterials Needed: Mirror, picture cards.\nSteps to Follow:\n• Stand in front of mirror.\n• Practice saying words clearly.\n• Use picture cards for vocabulary.\n• Focus on pronunciation.\nWhat Should Be Achieved:\nClear speech patterns.\nWhat is Gained:\n• Articulation\n• Confidence\n• Self-expression',
 'Storytelling Practice\nMaterials Needed: Story books, recording device.\nSteps to Follow:\n• Read a story together.\n• Ask child to retell the story.\n• Record their version.\n• Practice clear pronunciation.\nWhat Should Be Achieved:\nClear storytelling ability.\nWhat is Gained:\n• Narrative skills\n• Confidence\n• Communication',
 'communication_topic_1'),

((SELECT id FROM niches_staging WHERE niche_slug = 'communication'), 2, 'Listening Skills', 
 'To improve active listening abilities',
 'Learn to listen carefully and respond appropriately to others.',
 '#Communication #Listening #Attention', '20 mins', 4,
 'Listening Game\nMaterials Needed: Story books, listening games.\nSteps to Follow:\n• Read a story aloud.\n• Ask questions about the story.\n• Practice active listening techniques.\n• Respond appropriately.\nWhat Should Be Achieved:\nActive listening skills.\nWhat is Gained:\n• Attention\n• Comprehension\n• Social skills',
 'Follow Instructions Game\nMaterials Needed: Simple instructions, props.\nSteps to Follow:\n• Give simple instructions.\n• Ask child to follow them.\n• Increase complexity gradually.\n• Practice listening carefully.\nWhat Should Be Achieved:\nInstruction following ability.\nWhat is Gained:\n• Attention to detail\n• Processing skills\n• Compliance',
 'communication_topic_2'),

-- AI topics
((SELECT id FROM niches_staging WHERE niche_slug = 'ai'), 1, 'What is AI?', 
 'To introduce the concept of artificial intelligence in simple terms',
 'AI is like having a very smart robot friend that can learn and help us with tasks. It can recognize pictures, understand speech, and even play games with us.',
 '#AI #Technology #Future', '25 mins', 6,
 'AI Picture Game\nMaterials Needed: Pictures of animals, objects, and AI-generated images.\nSteps to Follow:\n• Show the child different pictures.\n• Ask them to identify which ones might be made by AI.\n• Discuss what makes something "artificial" vs "natural".\nWhat Should Be Achieved:\nBasic understanding of AI capabilities.\nWhat is Gained:\n• Critical thinking\n• Technology awareness\n• Pattern recognition',
 'Robot Friend Drawing\nMaterials Needed: Paper, crayons, markers.\nSteps to Follow:\n• Ask the child to draw their ideal AI robot friend.\n• Discuss what the robot would help them with.\n• Talk about how robots learn and remember things.\nWhat Should Be Achieved:\nCreative thinking about AI applications.\nWhat is Gained:\n• Creativity\n• Problem-solving\n• Future thinking',
 'ai_topic_1'),

((SELECT id FROM niches_staging WHERE niche_slug = 'ai'), 2, 'Machine Learning Basics', 
 'To understand how machines learn',
 'Explore how computers can learn from data and make predictions.',
 '#AI #MachineLearning #Data', '45 mins', 8,
 'Pattern Recognition Game\nMaterials Needed: Pattern cards, data examples.\nSteps to Follow:\n• Show patterns in data.\n• Ask child to predict next item.\n• Discuss how machines learn patterns.\n• Practice with different datasets.\nWhat Should Be Achieved:\nUnderstanding of machine learning concepts.\nWhat is Gained:\n• Pattern recognition\n• Problem solving\n• Technology literacy',
 'Data Collection Activity\nMaterials Needed: Chart paper, markers, simple data.\nSteps to Follow:\n• Collect simple data (favorite colors, etc.).\n• Organize data in charts.\n• Look for patterns.\n• Make predictions based on data.\nWhat Should Be Achieved:\nBasic data analysis skills.\nWhat is Gained:\n• Data literacy\n• Analytical thinking\n• Prediction skills',
 'ai_topic_2');

-- =====================================================
-- 4. IMPORT ESSENTIAL GROWTH PILLARS FROM YOUR JSON DATA
-- =====================================================
INSERT INTO essential_growth_pillars_staging (pillar_name, pillar_slug, color_code, icon_name, description) VALUES
-- From your src/data/essential-growth/index.json
('Play & Creativity', 'play-creativity', '#fce7f3', 'paint-palette', 'Fuel imagination and joyful exploration through hands-on activities and creative expression'),
('Cognitive Skills', 'cognitive-skills', '#dbeafe', 'brainstorm', 'Sharpen thinking, memory, and decision-making skills'),
('Physical & Social Play', 'physical-social-play', '#d1fae5', 'teamwork', 'Boost strength and social bonds through play'),
('Language & Speech', 'language-speech', '#fef3c7', 'speech-bubble', 'Enhance communication and vocabulary skills'),
('Learning Tools', 'learning-tools', '#ede9fe', 'books', 'Introduce creative and critical learning tools'),
('Nature & Exploration', 'nature-exploration', '#fee2e2', 'compass', 'Connect deeply with nature and discoveries'),
('Mindfulness & Well-being', 'mindfulness-wellbeing', '#e0e7ff', 'lotus', 'Foster inner calm, resilience, and balance'),
('Music & Rhythm', 'music-rhythm', '#ccfbf1', 'musical-notes', 'Ignite creativity through sounds and movement'),
('Visual Arts', 'visual-arts', '#ffedd5', 'paint-brush', 'Develop expression and creative storytelling'),
('Science & Innovation', 'science-innovation', '#cffafe', 'physics', 'Spark curiosity through scientific exploration'),
('Emotional Intelligence', 'emotional-intelligence', '#ecfccb', 'mental-health', 'Grow self-awareness and empathy skills'),
('Cultural Awareness', 'cultural-awareness', '#ffe4e6', 'global-citizen', 'Celebrate diversity and global understanding'),
('Teamwork & Leadership', 'teamwork-leadership', '#e0f2fe', 'leadership', 'Build cooperation and inspiring leadership skills'),
('Problem Solving & Logic', 'problem-solving-logic', '#fef9c3', 'logic', 'Tackle challenges with smart thinking'),
('Health & Fitness', 'health-fitness', '#fae8ff', 'fitness', 'Boost physical wellness and daily energy'),
('Social Skills', 'social-skills', '#d1fae5', 'group', 'Strengthen connection, empathy, and respect'),
('Fine Motor Skills', 'fine-motor-skills', '#ede9fe', 'puzzle', 'Refine precision and hand-eye coordination'),
('Memory & Recall', 'memory-recall', '#fef08a', 'mind-map', 'Enhance remembering and quick thinking');

-- =====================================================
-- 5. IMPORT ESSENTIAL GROWTH AGE GROUPS FROM YOUR JSON DATA
-- =====================================================
INSERT INTO essential_growth_age_groups_staging (age_range, min_age, max_age, description, sort_order) VALUES
-- From your src/data/essential-growth/index.json
('Infant (0-1)', 0, 1, 'Infant development stage', 1),
('Toddler (1-3)', 1, 3, 'Toddler development stage', 2),
('Preschooler (3-5)', 3, 5, 'Preschooler development stage', 3),
('Child (6-8)', 6, 8, 'Child development stage', 4),
('Pre-Teen (9-12)', 9, 12, 'Pre-teen development stage', 5),
('Teen (13-18)', 13, 18, 'Teen development stage', 6);

-- =====================================================
-- 6. IMPORT ESSENTIAL GROWTH ACTIVITIES FROM YOUR JSON DATA
-- =====================================================
INSERT INTO essential_growth_activities_staging (activity_id, activity_name, pillar_id, topic_number, objective, explanation, age_group, estimated_time, difficulty_level, materials_needed, learning_outcomes, validation_score, created_at, updated_at) VALUES
-- From your src/data/essential-growth/play-creativity/activities.json
('PC001', 'Texture Tray Adventure', (SELECT id FROM essential_growth_pillars_staging WHERE pillar_slug = 'play-creativity'), 1, 
 'Stimulate tactile senses through safe material exploration', 
 'Provide a tray with different safe materials (e.g., silk, sponge). Baby explores textures with hands.',
 'Infant (0-1)', '10-15 min', 'Beginner', 'Safe textured materials, tray, activity kit', 
 'Tactile exploration, Sensory awareness, Hand-eye coordination', 95, NOW(), NOW()),

('PC002', 'Color Mixing Magic', (SELECT id FROM essential_growth_pillars_staging WHERE pillar_slug = 'play-creativity'), 2,
 'Explore color theory through hands-on experimentation',
 'Mix primary colors to create secondary colors and observe the changes.',
 'Toddler (1-3)', '20-25 min', 'Beginner', 'Primary color paints, mixing containers, paper',
 'Color recognition, Cause and effect, Fine motor skills', 88, NOW(), NOW()),

('PC003', 'Story Building Blocks', (SELECT id FROM essential_growth_pillars_staging WHERE pillar_slug = 'play-creativity'), 3,
 'Develop narrative skills through creative storytelling',
 'Use picture cards and props to create and tell original stories.',
 'Preschooler (3-5)', '30-35 min', 'Intermediate', 'Picture cards, story props, recording device',
 'Imagination, Language development, Sequencing', 92, NOW(), NOW()),

-- Cognitive Skills activities
('CS001', 'Memory Matching Game', (SELECT id FROM essential_growth_pillars_staging WHERE pillar_slug = 'cognitive-skills'), 1,
 'Improve memory and concentration through matching activities',
 'Play memory games with cards or objects to enhance recall abilities.',
 'Toddler (1-3)', '15-20 min', 'Beginner', 'Memory cards, matching objects',
 'Memory, Concentration, Visual recognition', 89, NOW(), NOW()),

('CS002', 'Pattern Recognition', (SELECT id FROM essential_growth_pillars_staging WHERE pillar_slug = 'cognitive-skills'), 2,
 'Develop logical thinking through pattern identification',
 'Identify and complete patterns using shapes, colors, or numbers.',
 'Preschooler (3-5)', '25-30 min', 'Beginner', 'Pattern cards, shape blocks, number tiles',
 'Logic, Pattern recognition, Sequencing', 91, NOW(), NOW()),

-- Physical & Social Play activities
('PS001', 'Cooperative Building', (SELECT id FROM essential_growth_pillars_staging WHERE pillar_slug = 'physical-social-play'), 1,
 'Build teamwork skills through collaborative construction',
 'Work together to build structures using blocks or other materials.',
 'Preschooler (3-5)', '30-35 min', 'Beginner', 'Building blocks, construction materials',
 'Teamwork, Communication, Spatial skills', 88, NOW(), NOW()),

-- Language & Speech activities
('LS001', 'Vocabulary Building', (SELECT id FROM essential_growth_pillars_staging WHERE pillar_slug = 'language-speech'), 1,
 'Expand vocabulary through interactive word games',
 'Learn new words through games, stories, and conversations.',
 'Toddler (1-3)', '20-25 min', 'Beginner', 'Picture books, word cards, games',
 'Vocabulary, Language development, Communication', 87, NOW(), NOW());

-- =====================================================
-- 7. IMPORT SYNC LOG ENTRIES
-- =====================================================
INSERT INTO sync_log_staging (sync_type, source, target, records_processed, success_count, error_count, sync_duration_ms, sync_status, error_details, created_at) VALUES
('google_sheets', 'Google Sheets - Niche Topics', 'PostgreSQL - niche_topics_staging', 45, 42, 3, 2500, 'completed_with_errors', '3 records had missing age values', NOW()),
('google_sheets', 'Google Sheets - Essential Growth', 'PostgreSQL - essential_growth_activities_staging', 18, 18, 0, 1800, 'completed', NULL, NOW()),
('direct_insert', 'Admin Panel', 'PostgreSQL - niches_staging', 17, 17, 0, 500, 'completed', NULL, NOW()),
('google_sheets', 'Google Sheets - Categories', 'PostgreSQL - niche_categories_staging', 9, 9, 0, 800, 'completed', NULL, NOW());

-- Success message
SELECT 'All local data imported to staging database successfully!' as status;
