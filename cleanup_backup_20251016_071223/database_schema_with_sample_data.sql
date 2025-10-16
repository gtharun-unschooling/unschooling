-- =====================================================
-- DATABASE SCHEMA WITH SAMPLE DATA (10% of actual data)
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. CONTENT TYPES TABLE
-- =====================================================
CREATE TABLE content_types (
    id SERIAL PRIMARY KEY,
    type_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    parent_type VARCHAR(50),
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insert content types
INSERT INTO content_types (type_name, description, parent_type) VALUES
('niche', 'Subject-specific learning content', NULL),
('essential_growth', 'Holistic development pillars', NULL),
('activity', 'Individual learning activities', NULL),
('topic', 'Learning topics within niches/pillars', NULL),
('material', 'Learning materials and resources', NULL),
('assessment', 'Progress assessment tools', NULL),
('parent_guide', 'Parent guidance content', NULL);

-- =====================================================
-- 2. CATEGORIES TABLE
-- =====================================================
CREATE TABLE categories (
    id SERIAL PRIMARY KEY,
    category_name VARCHAR(100) UNIQUE NOT NULL,
    category_type VARCHAR(50) NOT NULL, -- 'niche_category' or 'pillar'
    description TEXT,
    color_code VARCHAR(7), -- Hex color
    icon_name VARCHAR(50),
    sort_order INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample categories (10% of your data)
INSERT INTO categories (category_name, category_type, description, color_code, icon_name, sort_order) VALUES
-- Niche Categories (sample)
('Core Academic', 'niche_category', 'Traditional academic subjects', '#3b82f6', 'books', 1),
('Creative Arts', 'niche_category', 'Artistic and creative disciplines', '#8b5cf6', 'paint-palette', 2),
('Technology', 'niche_category', 'Tech and digital skills', '#06b6d4', 'cpu', 3),
('Life Skills', 'niche_category', 'Practical life skills', '#10b981', 'user-check', 4),
('Physical & Social', 'niche_category', 'Physical and social activities', '#f59e0b', 'heart', 5),

-- Essential Growth Pillars (sample)
('Play & Creativity', 'pillar', 'Fuel imagination and joyful exploration', '#fce7f3', 'paint-palette', 1),
('Cognitive Skills', 'pillar', 'Sharpen thinking and memory', '#dbeafe', 'brainstorm', 2),
('Physical & Social Play', 'pillar', 'Boost strength and social bonds', '#d1fae5', 'teamwork', 3),
('Language & Speech', 'pillar', 'Enhance communication skills', '#fef3c7', 'speech-bubble', 4),
('Learning Tools', 'pillar', 'Creative and critical learning tools', '#ede9fe', 'books', 5);

-- =====================================================
-- 3. AGE GROUPS TABLE
-- =====================================================
CREATE TABLE age_groups (
    id SERIAL PRIMARY KEY,
    age_range VARCHAR(20) UNIQUE NOT NULL,
    min_age INTEGER NOT NULL,
    max_age INTEGER NOT NULL,
    description TEXT,
    sort_order INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

INSERT INTO age_groups (age_range, min_age, max_age, description, sort_order) VALUES
('Infant (0-1)', 0, 1, 'Infant development stage', 1),
('Toddler (1-3)', 1, 3, 'Toddler development stage', 2),
('Preschooler (3-5)', 3, 5, 'Preschool development stage', 3),
('Child (6-8)', 6, 8, 'Early childhood stage', 4),
('Pre-Teen (9-12)', 9, 12, 'Pre-teen development stage', 5),
('Teen (13-18)', 13, 18, 'Teenage development stage', 6);

-- =====================================================
-- 4. MAIN CONTENT TABLE (FLEXIBLE)
-- =====================================================
CREATE TABLE content (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    
    -- Basic identification
    title VARCHAR(500) NOT NULL,
    content_type_id INTEGER REFERENCES content_types(id),
    category_id INTEGER REFERENCES categories(id),
    age_group_id INTEGER REFERENCES age_groups(id),
    
    -- Content details (flexible JSON structure)
    content_data JSONB NOT NULL DEFAULT '{}',
    
    -- Metadata
    topic_number INTEGER,
    difficulty_level VARCHAR(50),
    estimated_duration INTEGER, -- minutes
    setup_time INTEGER, -- minutes
    supervision_level VARCHAR(50),
    
    -- Tags and classification
    tags TEXT[],
    hashtags TEXT[],
    skills TEXT[],
    
    -- Source tracking (for Google Sheets sync)
    source_type VARCHAR(50) NOT NULL DEFAULT 'direct_db',
    source_id VARCHAR(255),
    source_page VARCHAR(100),
    
    -- Status and versioning
    status VARCHAR(50) DEFAULT 'active',
    version INTEGER DEFAULT 1,
    validation_score INTEGER,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    last_synced_at TIMESTAMP,
    
    -- Audit fields
    created_by VARCHAR(100),
    updated_by VARCHAR(100),
    feedback TEXT,
    corrections_needed TEXT
);

-- =====================================================
-- 5. ACTIVITIES TABLE (SPECIFIC TO YOUR SHEET DATA)
-- =====================================================
CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    content_id UUID REFERENCES content(id),
    
    -- Activity-specific fields (from your Google Sheets)
    activity_id VARCHAR(255) UNIQUE NOT NULL,
    pillar VARCHAR(100),
    activity_type VARCHAR(100),
    
    -- Activity details
    objective TEXT NOT NULL,
    explanation TEXT,
    steps TEXT,
    materials TEXT,
    additional_info TEXT,
    
    -- Kit information
    kit_materials TEXT,
    materials_at_home TEXT,
    materials_to_buy TEXT,
    general_instructions TEXT,
    
    -- Tracking
    last_updated DATE,
    feedback TEXT,
    corrections_needed TEXT,
    validation_score INTEGER,
    
    -- Sync tracking
    source_type VARCHAR(50) DEFAULT 'google_sheets',
    source_row_id VARCHAR(255),
    synced_at TIMESTAMP DEFAULT NOW(),
    
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 6. SYNC LOG TABLE
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

-- =====================================================
-- CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Content table indexes
CREATE INDEX idx_content_type ON content(content_type_id);
CREATE INDEX idx_content_category ON content(category_id);
CREATE INDEX idx_content_age_group ON content(age_group_id);
CREATE INDEX idx_content_source ON content(source_type, source_page);
CREATE INDEX idx_content_status ON content(status);
CREATE INDEX idx_content_tags ON content USING GIN(tags);
CREATE INDEX idx_content_skills ON content USING GIN(skills);
CREATE INDEX idx_content_data ON content USING GIN(content_data);

-- Activities table indexes
CREATE INDEX idx_activities_content ON activities(content_id);
CREATE INDEX idx_activities_pillar ON activities(pillar);
CREATE INDEX idx_activities_type ON activities(activity_type);
CREATE INDEX idx_activities_source ON activities(source_type, source_row_id);

-- Sync log indexes
CREATE INDEX idx_sync_log_source ON sync_log(source_type, source_page);
CREATE INDEX idx_sync_log_status ON sync_log(sync_status);
CREATE INDEX idx_sync_log_date ON sync_log(synced_at);

-- =====================================================
-- INSERT SAMPLE DATA (10% of your actual data)
-- =====================================================

-- Sample Niche Content (from your topicsdata.json)
INSERT INTO content (
    title, content_type_id, category_id, age_group_id, topic_number, 
    content_data, difficulty_level, estimated_duration, hashtags, 
    source_type, source_id, source_page, created_by
) VALUES 
(
    'Understanding Money', 
    1, -- niche content type
    1, -- Core Academic category
    3, -- Preschooler (3-5) age group
    1, -- topic number
    '{
        "objective": "To introduce the concept of money and its purpose.",
        "explanation": "Money is a tool we use to exchange goods and services. It has different forms, such as coins and bills. Each coin and bill has a specific value.",
        "activities": [
            {
                "name": "Money Sorting",
                "materials": ["Mix of real or play Indian coins and bills", "sorting trays or bowls"],
                "steps": [
                    "Provide a mix of ₹1, ₹2, ₹5, ₹10 coins and ₹10, ₹20, ₹50 bills",
                    "Ask the child to separate coins and bills into two groups",
                    "Further sort them by value",
                    "Encourage the child to count each group aloud"
                ],
                "achievement": "Child identifies money by form and value",
                "skills_gained": ["Visual classification", "Basic counting", "Early money-handling skill"]
            },
            {
                "name": "Shopping Pretend Play",
                "materials": ["Play money", "toys or snacks", "table or shelf for setup"],
                "steps": [
                    "Set up a pretend store",
                    "Give the child play money",
                    "Let them buy items",
                    "Practice giving money and receiving change"
                ],
                "achievement": "Basic money exchange understanding",
                "skills_gained": ["Real-life simulation", "Confidence using money"]
            }
        ]
    }'::jsonb,
    'Beginner',
    20, -- 20 minutes
    ARRAY['#Finance', '#Money', '#Invest'],
    'direct_db',
    'finance_topic_1',
    'niches_sheet',
    'Tharun'
),
(
    'Coins and Bills', 
    1, -- niche content type
    1, -- Core Academic category
    3, -- Preschooler (3-5) age group
    2, -- topic number
    '{
        "objective": "To learn about different coins and bills and their values.",
        "explanation": "Introduce common coins and bills used in your country. Explain the value of each coin and bill. Demonstrate how to count money using different combinations.",
        "activities": [
            {
                "name": "Coin Recognition Game",
                "materials": ["Real or play coins and bills", "coin/bill chart"],
                "steps": [
                    "Show the child a coin or bill",
                    "Ask them to name its value",
                    "Match it to the correct space on the chart"
                ],
                "achievement": "Recognize and name common money types",
                "skills_gained": ["Memory skills", "Visual identification", "Currency knowledge"]
            }
        ]
    }'::jsonb,
    'Beginner',
    21, -- 21 minutes
    ARRAY['#Finance', '#Money', '#Invest'],
    'direct_db',
    'finance_topic_2',
    'niches_sheet',
    'Tharun'
);

-- Sample Essential Growth Activities (from your sheet_data_Activities.json)
INSERT INTO content (
    title, content_type_id, category_id, age_group_id, 
    content_data, difficulty_level, estimated_duration, hashtags, 
    source_type, source_id, source_page, created_by
) VALUES 
(
    'Baby''s First Texture Discovery', 
    3, -- activity content type
    6, -- Play & Creativity pillar
    1, -- Infant (0-1) age group
    '{
        "objective": "Introduce baby to different textures and develop sensory awareness",
        "explanation": "Create a safe exploration space with various textures. Baby touches and feels different materials while you describe each one. Perfect for developing sensory skills and bonding time.",
        "estimated_time": "10-15 minutes",
        "setup_time": "5 minutes",
        "supervision_level": "High",
        "materials": [
            "Soft fabric squares",
            "Smooth wooden blocks",
            "Crinkly paper",
            "Soft brush",
            "Shallow tray"
        ],
        "steps": [
            "Choose when baby is calm and alert",
            "Place different textures in a shallow tray",
            "Let baby explore each texture",
            "Describe what they''re feeling",
            "Watch for reactions and preferences",
            "Clean up when baby shows signs of being done"
        ],
        "skills": [
            "Sensory awareness",
            "Tactile exploration",
            "Hand-eye coordination",
            "Language development"
        ],
        "kit_materials": "Activity kit (supplied by us); Step-by-step guide (supplied by us); Progress tracking sheet (supplied by us)",
        "general_instructions": "Supervise closely during texture tray adventure. Ensure baby is comfortable and safe. Follow baby''s cues and stop if they show signs of distress. Keep sessions short and positive."
    }'::jsonb,
    'Beginner',
    15, -- 15 minutes average
    ARRAY['#SensoryPlay', '#InfantActivities', '#TextureExploration', '#BabyDevelopment'],
    'google_sheets',
    'play-creativity-infant-0-1-sensory-exploration-1',
    'activities_sheet',
    'Tharun'
),
(
    'Squishy Sensory Fun', 
    3, -- activity content type
    6, -- Play & Creativity pillar
    1, -- Infant (0-1) age group
    '{
        "objective": "Develop tactile responsiveness and visual attention through safe gel play",
        "explanation": "Create a colorful gel bag that baby can safely squish and explore. Watch their eyes light up as they discover the squishy texture and moving colors. Perfect for tummy time and sensory development.",
        "estimated_time": "10-15 minutes",
        "setup_time": "5 minutes",
        "supervision_level": "High",
        "materials": [
            "Clear ziplock bag",
            "Hair gel",
            "Food coloring",
            "Duct tape",
            "Soft mat"
        ],
        "steps": [
            "Mix gel with food coloring",
            "Fill ziplock bag with colored gel",
            "Seal bag tightly with duct tape",
            "Place on soft mat",
            "Let baby squish and explore",
            "Watch for reactions and engagement"
        ],
        "skills": [
            "Tactile responsiveness",
            "Visual attention",
            "Hand control",
            "Sensory exploration"
        ],
        "kit_materials": "Activity kit (supplied by us); Step-by-step guide (supplied by us); Progress tracking sheet (supplied by us)",
        "general_instructions": "Supervise closely during gel bag squish play. Ensure baby is comfortable and safe. Follow baby''s cues and stop if they show signs of distress. Keep sessions short and positive."
    }'::jsonb,
    'Beginner',
    15, -- 15 minutes average
    ARRAY['#SensoryBag', '#TummyTime', '#HandControl', '#VisualTracking'],
    'google_sheets',
    'play-creativity-infant-0-1-sensory-exploration-2',
    'activities_sheet',
    'Tharun'
);

-- Sample Activities table entries
INSERT INTO activities (
    activity_id, content_id, pillar, activity_type, objective, explanation,
    steps, materials, kit_materials, general_instructions, validation_score,
    source_type, source_row_id, synced_at
) VALUES 
(
    'play-creativity-infant-0-1-sensory-exploration-1',
    (SELECT id FROM content WHERE title = 'Baby''s First Texture Discovery'),
    'Play & Creativity',
    'Sensory',
    'Introduce baby to different textures and develop sensory awareness',
    'Create a safe exploration space with various textures. Baby touches and feels different materials while you describe each one. Perfect for developing sensory skills and bonding time.',
    '1. Choose when baby is calm and alert; 2. Place different textures in a shallow tray; 3. Let baby explore each texture; 4. Describe what they''re feeling; 5. Watch for reactions and preferences; 6. Clean up when baby shows signs of being done',
    'Soft fabric squares; Smooth wooden blocks; Crinkly paper; Soft brush; Shallow tray',
    'Activity kit (supplied by us); Step-by-step guide (supplied by us); Progress tracking sheet (supplied by us)',
    'Supervise closely during texture tray adventure. Ensure baby is comfortable and safe. Follow baby''s cues and stop if they show signs of distress. Keep sessions short and positive.',
    100,
    'google_sheets',
    'row_1',
    NOW()
),
(
    'play-creativity-infant-0-1-sensory-exploration-2',
    (SELECT id FROM content WHERE title = 'Squishy Sensory Fun'),
    'Play & Creativity',
    'Sensory',
    'Develop tactile responsiveness and visual attention through safe gel play',
    'Create a colorful gel bag that baby can safely squish and explore. Watch their eyes light up as they discover the squishy texture and moving colors. Perfect for tummy time and sensory development.',
    '1. Mix gel with food coloring; 2. Fill ziplock bag with colored gel; 3. Seal bag tightly with duct tape; 4. Place on soft mat; 5. Let baby squish and explore; 6. Watch for reactions and engagement',
    'Clear ziplock bag; Hair gel; Food coloring; Duct tape; Soft mat',
    'Activity kit (supplied by us); Step-by-step guide (supplied by us); Progress tracking sheet (supplied by us)',
    'Supervise closely during gel bag squish play. Ensure baby is comfortable and safe. Follow baby''s cues and stop if they show signs of distress. Keep sessions short and positive.',
    65,
    'google_sheets',
    'row_2',
    NOW()
);

-- Sample Sync Log entries
INSERT INTO sync_log (
    source_type, source_page, operation, sync_status, 
    records_processed, records_success, records_failed, synced_at
) VALUES 
(
    'google_sheets', 'activities_sheet', 'bulk_sync', 'success',
    50, 48, 2, NOW() - INTERVAL '1 hour'
),
(
    'google_sheets', 'niches_sheet', 'bulk_sync', 'success',
    25, 25, 0, NOW() - INTERVAL '2 hours'
);

-- =====================================================
-- SAMPLE QUERIES TO TEST THE STRUCTURE
-- =====================================================

-- Query 1: Get all activities for Play & Creativity pillar
-- SELECT c.title, c.content_data, a.activity_type, a.validation_score
-- FROM content c
-- JOIN activities a ON c.id = a.content_id
-- JOIN categories cat ON c.category_id = cat.id
-- WHERE cat.category_name = 'Play & Creativity';

-- Query 2: Get all content by age group
-- SELECT c.title, c.difficulty_level, c.estimated_duration, ag.age_range
-- FROM content c
-- JOIN age_groups ag ON c.age_group_id = ag.id
-- WHERE ag.age_range = 'Infant (0-1)';

-- Query 3: Get content by source type
-- SELECT title, source_type, source_page, created_at
-- FROM content
-- WHERE source_type = 'google_sheets';

-- Query 4: Search content by tags
-- SELECT title, hashtags, skills
-- FROM content
-- WHERE hashtags @> ARRAY['#SensoryPlay'];

-- =====================================================
-- VIEWS FOR COMMON QUERIES
-- =====================================================

-- View: Content with category and age group info
CREATE VIEW content_with_details AS
SELECT 
    c.id,
    c.title,
    ct.type_name as content_type,
    cat.category_name,
    cat.color_code,
    ag.age_range,
    c.difficulty_level,
    c.estimated_duration,
    c.hashtags,
    c.skills,
    c.source_type,
    c.source_page,
    c.created_at,
    c.updated_at
FROM content c
JOIN content_types ct ON c.content_type_id = ct.id
JOIN categories cat ON c.category_id = cat.id
JOIN age_groups ag ON c.age_group_id = ag.id;

-- View: Activities with full details
CREATE VIEW activities_with_details AS
SELECT 
    a.activity_id,
    c.title,
    a.pillar,
    a.activity_type,
    a.objective,
    ag.age_range,
    c.difficulty_level,
    c.estimated_duration,
    a.validation_score,
    a.source_type,
    a.synced_at
FROM activities a
JOIN content c ON a.content_id = c.id
JOIN age_groups ag ON c.age_group_id = ag.id;

-- =====================================================
-- COMMENTS AND DOCUMENTATION
-- =====================================================

COMMENT ON TABLE content IS 'Main flexible content table storing all learning materials';
COMMENT ON TABLE activities IS 'Specific activities table linked to Google Sheets data';
COMMENT ON TABLE categories IS 'Categories for both niches and essential growth pillars';
COMMENT ON TABLE age_groups IS 'Age group definitions with min/max ages';
COMMENT ON TABLE sync_log IS 'Track all sync operations from Google Sheets and other sources';

COMMENT ON COLUMN content.content_data IS 'Flexible JSONB structure for storing any content type';
COMMENT ON COLUMN content.source_type IS 'Source of content: google_sheets, direct_db, api';
COMMENT ON COLUMN content.source_page IS 'Google Sheets page name for tracking';
COMMENT ON COLUMN activities.activity_id IS 'Unique identifier from Google Sheets';
COMMENT ON COLUMN activities.validation_score IS 'Quality score 0-100 for content validation';
