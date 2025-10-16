-- =====================================================
-- GCP POSTGRESQL DATABASE SCHEMA WITH SAMPLE DATA
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. NICHE CATEGORIES TABLE
-- =====================================================
CREATE TABLE niche_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    color_code VARCHAR(7),
    icon_name VARCHAR(50),
    sort_order INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insert niche categories
INSERT INTO niche_categories (category_name, description, color_code, icon_name, sort_order) VALUES
('Core Academic', 'Traditional academic subjects', '#3b82f6', 'books', 1),
('Creative Arts', 'Artistic and creative disciplines', '#8b5cf6', 'paint-palette', 2),
('Technology', 'Tech and digital skills', '#06b6d4', 'cpu', 3),
('Life Skills', 'Practical life skills', '#10b981', 'user-check', 4),
('Physical & Social', 'Physical and social activities', '#f59e0b', 'heart', 5);

-- =====================================================
-- 2. NICHES TABLE
-- =====================================================
CREATE TABLE niches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    niche_name VARCHAR(100) UNIQUE NOT NULL,
    niche_slug VARCHAR(100) UNIQUE NOT NULL,
    category_id UUID REFERENCES niche_categories(id),
    hero_tagline TEXT,
    sub_heading TEXT,
    problems TEXT,
    approach_steps TEXT,
    why_kids_love TEXT,
    color_code VARCHAR(7),
    primary_color VARCHAR(7),
    secondary_color VARCHAR(7),
    background_color VARCHAR(7),
    illustration VARCHAR(100),
    suggestion TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample niches
INSERT INTO niches (niche_name, niche_slug, category_id, hero_tagline, sub_heading, color_code, primary_color, suggestion) VALUES
('Finance', 'finance', (SELECT id FROM niche_categories WHERE category_name = 'Core Academic'), 
 'Let''s Make Finance Fun & Future-Proof for Kids', 'Empowering Kids to Understand Money and Build Smart Habits Early', 
 '#F1C40F', '#F39C12', 'Entrepreneurship, Mathematics'),
('AI', 'ai', (SELECT id FROM niche_categories WHERE category_name = 'Technology'),
 'Introduce Kids to the Future with AI', 'Building AI Literacy and Critical Thinking Skills', 
 '#6366f1', '#8b5cf6', 'Coding, Mathematics'),
('Dance', 'dance', (SELECT id FROM niche_categories WHERE category_name = 'Creative Arts'),
 'Express Yourself Through Movement', 'Building Confidence and Creativity Through Dance', 
 '#ec4899', '#f43f5e', 'Music, Physical Fitness');

-- =====================================================
-- 3. NICHE TOPICS TABLE
-- =====================================================
CREATE TABLE niche_topics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    niche_id UUID REFERENCES niches(id),
    topic_number INTEGER NOT NULL,
    topic_name VARCHAR(500) NOT NULL,
    objective TEXT NOT NULL,
    explanation TEXT,
    hashtags TEXT,
    estimated_time VARCHAR(20),
    age INTEGER NOT NULL, -- Simple integer from 3 to 18
    activity_1 TEXT,
    activity_2 TEXT,
    source_type VARCHAR(50) DEFAULT 'direct_db',
    source_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(niche_id, topic_number)
);

-- Insert sample niche topics
INSERT INTO niche_topics (niche_id, topic_number, topic_name, objective, explanation, hashtags, estimated_time, age, activity_1, activity_2, source_id) VALUES
-- Finance topics
((SELECT id FROM niches WHERE niche_slug = 'finance'), 1, 'Understanding Money', 
 'To introduce the concept of money and its purpose.',
 'Money is a tool we use to exchange goods and services. It has different forms, such as coins and bills. Each coin and bill has a specific value.',
 '#Finance #Money #Invest', '20 mins', 3,
 'Money Sorting\nMaterials Needed: Mix of real or play Indian coins and bills, sorting trays or bowls.\nSteps to Follow:\n• Provide a mix of ₹1, ₹2, ₹5, ₹10 coins and ₹10, ₹20, ₹50 bills.\n• Ask the child to separate coins and bills into two groups.\n• Further sort them by value.\n• Encourage the child to count each group aloud.\nWhat Should Be Achieved:\nChild identifies money by form and value.\nWhat is Gained:\n• Visual classification\n• Basic counting\n• Early money-handling skill',
 'Shopping Pretend Play\nMaterials Needed: Play money, toys or snacks, table or shelf for setup.\nSteps to Follow:\n• Set up a pretend store.\n• Give the child play money.\n• Let them "buy" items.\n• Practice giving money and receiving change.\nWhat Should Be Achieved:\nBasic money exchange understanding.\nWhat is Gained:\n• Real-life simulation\n• Confidence using money',
 'finance_topic_1'),

((SELECT id FROM niches WHERE niche_slug = 'finance'), 2, 'Coins and Bills', 
 'To learn about different coins and bills and their values.',
 'Introduce common coins and bills used in your country. Explain the value of each coin and bill. Demonstrate how to count money using different combinations.',
 '#Finance #Money #Invest', '21 mins', 3,
 'Coin Recognition Game\nMaterials Needed: Real or play coins and bills, coin/bill chart.\nSteps to Follow:\n• Show the child a coin or bill.\n• Ask them to name its value.\n• Match it to the correct space on the chart.\nWhat Should Be Achieved:\nRecognize and name common money types.\nWhat is Gained:\n• Memory skills\n• Visual identification\n• Currency knowledge',
 'Money Matching\nMaterials Needed: Pairs of coins/bills or matching cards.\nSteps to Follow:\n• Lay out the cards face down.\n• Take turns flipping cards to find matches.\n• Match same values together.\nWhat Should Be Achieved:\nUnderstand money equivalence.\nWhat is Gained:\n• Matching skills\n• Value recognition',
 'finance_topic_2'),

-- AI topics
((SELECT id FROM niches WHERE niche_slug = 'ai'), 1, 'What is AI?', 
 'To introduce the concept of artificial intelligence in simple terms.',
 'AI is like having a very smart robot friend that can learn and help us with tasks. It can recognize pictures, understand speech, and even play games with us.',
 '#AI #Technology #Future', '25 mins', 8,
 'AI Picture Game\nMaterials Needed: Pictures of animals, objects, and AI-generated images.\nSteps to Follow:\n• Show the child different pictures.\n• Ask them to identify which ones might be made by AI.\n• Discuss what makes something "artificial" vs "natural".\nWhat Should Be Achieved:\nBasic understanding of AI capabilities.\nWhat is Gained:\n• Critical thinking\n• Technology awareness\n• Pattern recognition',
 'Robot Friend Drawing\nMaterials Needed: Paper, crayons, markers.\nSteps to Follow:\n• Ask the child to draw their ideal AI robot friend.\n• Discuss what the robot would help them with.\n• Talk about how robots learn and remember things.\nWhat Should Be Achieved:\nCreative thinking about AI applications.\nWhat is Gained:\n• Creativity\n• Problem-solving\n• Future thinking',
 'ai_topic_1');

-- =====================================================
-- 4. ESSENTIAL GROWTH PILLARS TABLE
-- =====================================================
CREATE TABLE essential_growth_pillars (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pillar_name VARCHAR(100) UNIQUE NOT NULL,
    pillar_slug VARCHAR(100) UNIQUE NOT NULL,
    color_code VARCHAR(7),
    icon_name VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insert essential growth pillars
INSERT INTO essential_growth_pillars (pillar_name, pillar_slug, color_code, icon_name, description) VALUES
('Play & Creativity', 'play-creativity', '#fce7f3', 'paint-palette', 'Fuel imagination and joyful exploration through hands-on activities and creative expression'),
('Cognitive Skills', 'cognitive-skills', '#dbeafe', 'brainstorm', 'Sharpen thinking, memory, and decision-making skills'),
('Physical & Social Play', 'physical-social-play', '#d1fae5', 'teamwork', 'Boost strength and social bonds through play'),
('Language & Speech', 'language-speech', '#fef3c7', 'speech-bubble', 'Enhance communication and vocabulary skills'),
('Learning Tools', 'learning-tools', '#ede9fe', 'books', 'Introduce creative and critical learning tools');

-- =====================================================
-- 5. ESSENTIAL GROWTH AGE GROUPS TABLE
-- =====================================================
CREATE TABLE essential_growth_age_groups (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    age_range VARCHAR(20) UNIQUE NOT NULL,
    min_age INTEGER NOT NULL,
    max_age INTEGER NOT NULL,
    description TEXT,
    sort_order INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insert essential growth age groups
INSERT INTO essential_growth_age_groups (age_range, min_age, max_age, description, sort_order) VALUES
('Infant (0-1)', 0, 1, 'Infant development stage', 1),
('Toddler (1-3)', 1, 3, 'Toddler development stage', 2),
('Preschooler (3-5)', 3, 5, 'Preschool development stage', 3),
('Child (6-8)', 6, 8, 'Early childhood stage', 4),
('Pre-Teen (9-12)', 9, 12, 'Pre-teen development stage', 5),
('Teen (13-18)', 13, 18, 'Teenage development stage', 6);

-- =====================================================
-- 6. ESSENTIAL GROWTH ACTIVITIES TABLE
-- =====================================================
CREATE TABLE essential_growth_activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pillar_id UUID REFERENCES essential_growth_pillars(id),
    activity_id VARCHAR(255) UNIQUE NOT NULL,
    age_group VARCHAR(20) NOT NULL,
    category VARCHAR(100) NOT NULL,
    category_description TEXT,
    topic_number INTEGER,
    activity_name VARCHAR(500) NOT NULL,
    objective TEXT NOT NULL,
    explanation TEXT,
    estimated_time VARCHAR(20),
    setup_time VARCHAR(20),
    supervision_level VARCHAR(20),
    materials TEXT,
    additional_info TEXT,
    steps TEXT,
    skills TEXT,
    hashtags TEXT,
    kit_materials TEXT,
    general_instructions TEXT,
    materials_at_home TEXT,
    materials_to_buy TEXT,
    validation_score INTEGER,
    source_type VARCHAR(50) DEFAULT 'google_sheets',
    source_row_id VARCHAR(255),
    synced_at TIMESTAMP DEFAULT NOW(),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample essential growth activities
INSERT INTO essential_growth_activities (
    pillar_id, activity_id, age_group, category, category_description, topic_number, 
    activity_name, objective, explanation, estimated_time, setup_time, supervision_level,
    materials, steps, skills, hashtags, kit_materials, general_instructions, validation_score,
    source_type, source_row_id
) VALUES
-- Play & Creativity activities
((SELECT id FROM essential_growth_pillars WHERE pillar_slug = 'play-creativity'), 
 'play-creativity-infant-0-1-sensory-exploration-1', 'Infant (0-1)', 'Sensory Exploration',
 'Activities focusing on developing tactile, visual, and auditory awareness through safe, gentle exploration of different textures, sounds, and visual stimuli appropriate for 0-1 year olds.',
 1, 'Baby''s First Texture Discovery', 
 'Introduce baby to different textures and develop sensory awareness',
 'Create a safe exploration space with various textures. Baby touches and feels different materials while you describe each one. Perfect for developing sensory skills and bonding time.',
 '10-15 minutes', '5 minutes', 'High',
 'Soft fabric squares; Smooth wooden blocks; Crinkly paper; Soft brush; Shallow tray',
 '1. Choose when baby is calm and alert; 2. Place different textures in a shallow tray; 3. Let baby explore each texture; 4. Describe what they''re feeling; 5. Watch for reactions and preferences; 6. Clean up when baby shows signs of being done',
 'Sensory awareness, Tactile exploration, Hand-eye coordination, Language development',
 '#SensoryPlay, #InfantActivities, #TextureExploration, #BabyDevelopment',
 'Activity kit (supplied by us); Step-by-step guide (supplied by us); Progress tracking sheet (supplied by us)',
 'Supervise closely during texture tray adventure. Ensure baby is comfortable and safe. Follow baby''s cues and stop if they show signs of distress. Keep sessions short and positive.',
 100, 'google_sheets', 'row_1'),

((SELECT id FROM essential_growth_pillars WHERE pillar_slug = 'play-creativity'), 
 'play-creativity-infant-0-1-sensory-exploration-2', 'Infant (0-1)', 'Sensory Exploration',
 'Activities focusing on developing tactile, visual, and auditory awareness through safe, gentle exploration of different textures, sounds, and visual stimuli appropriate for 0-1 year olds.',
 2, 'Squishy Sensory Fun', 
 'Develop tactile responsiveness and visual attention through safe gel play',
 'Create a colorful gel bag that baby can safely squish and explore. Watch their eyes light up as they discover the squishy texture and moving colors. Perfect for tummy time and sensory development.',
 '10-15 minutes', '5 minutes', 'High',
 'Clear ziplock bag; Hair gel; Food coloring; Duct tape; Soft mat',
 '1. Mix gel with food coloring; 2. Fill ziplock bag with colored gel; 3. Seal bag tightly with duct tape; 4. Place on soft mat; 5. Let baby squish and explore; 6. Watch for reactions and engagement',
 'Tactile responsiveness, Visual attention, Hand control, Sensory exploration',
 '#SensoryBag, #TummyTime, #HandControl, #VisualTracking',
 'Activity kit (supplied by us); Step-by-step guide (supplied by us); Progress tracking sheet (supplied by us)',
 'Supervise closely during gel bag squish play. Ensure baby is comfortable and safe. Follow baby''s cues and stop if they show signs of distress. Keep sessions short and positive.',
 65, 'google_sheets', 'row_2'),

-- Cognitive Skills activities
((SELECT id FROM essential_growth_pillars WHERE pillar_slug = 'cognitive-skills'), 
 'cognitive-skills-toddler-1-3-problem-solving-1', 'Toddler (1-3)', 'Problem Solving',
 'Activities that encourage logical thinking, pattern recognition, and simple problem-solving skills appropriate for toddlers.',
 1, 'Simple Puzzle Fun', 
 'Develop problem-solving skills and hand-eye coordination',
 'Introduce age-appropriate puzzles that challenge toddlers to think logically while having fun. Perfect for building confidence and cognitive development.',
 '15-20 minutes', '5 minutes', 'Medium',
 'Large-piece puzzles (2-4 pieces); Puzzle board; Storage container',
 '1. Choose puzzles appropriate for toddler''s age; 2. Show them how pieces fit together; 3. Let them try independently; 4. Offer gentle guidance when needed; 5. Celebrate successes; 6. Store puzzles properly when done',
 'Problem-solving, Hand-eye coordination, Logical thinking, Patience, Spatial awareness',
 '#ProblemSolving, #ToddlerActivities, #CognitiveDevelopment, #Puzzles',
 'Activity kit (supplied by us); Step-by-step guide (supplied by us); Progress tracking sheet (supplied by us)',
 'Supervise during puzzle play. Offer encouragement and gentle hints. Let toddlers explore and make mistakes - it''s part of learning!',
 85, 'google_sheets', 'row_3');

-- =====================================================
-- 7. SYNC LOG TABLE
-- =====================================================
CREATE TABLE sync_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_type VARCHAR(50) NOT NULL,
    source_page VARCHAR(100),
    operation VARCHAR(50),
    record_id UUID,
    sync_status VARCHAR(50),
    error_message TEXT,
    records_processed INTEGER DEFAULT 0,
    records_success INTEGER DEFAULT 0,
    records_failed INTEGER DEFAULT 0,
    synced_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample sync log entries
INSERT INTO sync_log (source_type, source_page, operation, sync_status, records_processed, records_success, records_failed, synced_at) VALUES
('google_sheets', 'activities_sheet', 'bulk_sync', 'success', 50, 48, 2, NOW() - INTERVAL '1 hour'),
('google_sheets', 'niches_sheet', 'bulk_sync', 'success', 25, 25, 0, NOW() - INTERVAL '2 hours'),
('direct_db', 'manual_addition', 'insert', 'success', 1, 1, 0, NOW() - INTERVAL '30 minutes');

-- =====================================================
-- CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Niche tables indexes
CREATE INDEX idx_niches_category ON niches(category_id);
CREATE INDEX idx_niche_topics_niche ON niche_topics(niche_id);
CREATE INDEX idx_niche_topics_age ON niche_topics(age);
CREATE INDEX idx_niche_topics_source ON niche_topics(source_type, source_id);

-- Essential growth tables indexes
CREATE INDEX idx_essential_activities_pillar ON essential_growth_activities(pillar_id);
CREATE INDEX idx_essential_activities_age_group ON essential_growth_activities(age_group);
CREATE INDEX idx_essential_activities_category ON essential_growth_activities(category);
CREATE INDEX idx_essential_activities_source ON essential_growth_activities(source_type, source_row_id);
CREATE INDEX idx_essential_activities_validation ON essential_growth_activities(validation_score);

-- Sync log indexes
CREATE INDEX idx_sync_log_source ON sync_log(source_type, source_page);
CREATE INDEX idx_sync_log_status ON sync_log(sync_status);
CREATE INDEX idx_sync_log_date ON sync_log(synced_at);

-- =====================================================
-- CREATE VIEWS FOR COMMON QUERIES
-- =====================================================

-- View: Niche topics with category and niche info
CREATE VIEW niche_topics_with_details AS
SELECT 
    nt.id,
    nt.topic_name,
    nt.objective,
    nt.age,
    nt.estimated_time,
    nt.hashtags,
    n.niche_name,
    n.niche_slug,
    nc.category_name,
    nc.color_code,
    nt.created_at
FROM niche_topics nt
JOIN niches n ON nt.niche_id = n.id
JOIN niche_categories nc ON n.category_id = nc.id;

-- View: Essential growth activities with pillar info
CREATE VIEW essential_activities_with_details AS
SELECT 
    ea.id,
    ea.activity_name,
    ea.objective,
    ea.age_group,
    ea.category,
    ea.estimated_time,
    ea.supervision_level,
    ea.validation_score,
    ep.pillar_name,
    ep.pillar_slug,
    ep.color_code,
    ea.created_at
FROM essential_growth_activities ea
JOIN essential_growth_pillars ep ON ea.pillar_id = ep.id;

-- =====================================================
-- COMMENTS AND DOCUMENTATION
-- =====================================================

COMMENT ON TABLE niche_categories IS 'Categories for organizing niches (Core Academic, Creative Arts, etc.)';
COMMENT ON TABLE niches IS 'Individual niches like Finance, AI, Dance, etc.';
COMMENT ON TABLE niche_topics IS 'Topics within each niche with age-appropriate content';
COMMENT ON TABLE essential_growth_pillars IS 'Essential growth pillars for holistic development';
COMMENT ON TABLE essential_growth_activities IS 'Activities within each pillar organized by age groups';
COMMENT ON TABLE essential_growth_age_groups IS 'Age group definitions for essential growth activities';
COMMENT ON TABLE sync_log IS 'Track all sync operations from Google Sheets and other sources';

COMMENT ON COLUMN niche_topics.age IS 'Simple integer from 3 to 18 for age-appropriate content';
COMMENT ON COLUMN essential_growth_activities.age_group IS 'Categorized age group like Infant (0-1), Toddler (1-3), etc.';
COMMENT ON COLUMN essential_growth_activities.validation_score IS 'Quality score 0-100 for content validation';
COMMENT ON COLUMN sync_log.records_processed IS 'Total number of records processed in sync operation';
