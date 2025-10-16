-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create tables
CREATE TABLE IF NOT EXISTS niche_categories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    color_code VARCHAR(7),
    icon_name VARCHAR(50),
    sort_order INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS niches (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

CREATE TABLE IF NOT EXISTS niche_topics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    niche_id UUID REFERENCES niches(id),
    topic_number INTEGER NOT NULL,
    topic_name VARCHAR(500) NOT NULL,
    objective TEXT NOT NULL,
    explanation TEXT,
    hashtags TEXT,
    estimated_time VARCHAR(20),
    age INTEGER NOT NULL,
    activity_1 TEXT,
    activity_2 TEXT,
    source_type VARCHAR(50) DEFAULT 'direct_db',
    source_id VARCHAR(255),
    created_at TIMESTAMP DEFAULT NOW(),
    UNIQUE(niche_id, topic_number)
);

CREATE TABLE IF NOT EXISTS essential_growth_pillars (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    pillar_name VARCHAR(100) UNIQUE NOT NULL,
    pillar_slug VARCHAR(100) UNIQUE NOT NULL,
    color_code VARCHAR(7),
    icon_name VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS essential_growth_age_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    age_range VARCHAR(20) UNIQUE NOT NULL,
    min_age INTEGER NOT NULL,
    max_age INTEGER NOT NULL,
    description TEXT,
    sort_order INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS essential_growth_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

CREATE TABLE IF NOT EXISTS sync_log (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_niches_category ON niches(category_id);
CREATE INDEX IF NOT EXISTS idx_niche_topics_niche ON niche_topics(niche_id);
CREATE INDEX IF NOT EXISTS idx_niche_topics_age ON niche_topics(age);
CREATE INDEX IF NOT EXISTS idx_essential_activities_pillar ON essential_growth_activities(pillar_id);
CREATE INDEX IF NOT EXISTS idx_essential_activities_age_group ON essential_growth_activities(age_group);

-- Insert sample data
INSERT INTO niche_categories (category_name, description, color_code, icon_name, sort_order) VALUES
('Core Academic', 'Traditional academic subjects', '#3b82f6', 'books', 1),
('Creative Arts', 'Artistic and creative disciplines', '#8b5cf6', 'paint-palette', 2),
('Technology', 'Tech and digital skills', '#06b6d4', 'cpu', 3)
ON CONFLICT (category_name) DO NOTHING;

INSERT INTO niches (niche_name, niche_slug, category_id, hero_tagline, sub_heading, color_code, primary_color, suggestion) VALUES
('Finance', 'finance', (SELECT id FROM niche_categories WHERE category_name = 'Core Academic'), 
 'Let''s Make Finance Fun & Future-Proof for Kids', 'Empowering Kids to Understand Money and Build Smart Habits Early', 
 '#F1C40F', '#F39C12', 'Entrepreneurship, Mathematics'),
('AI', 'ai', (SELECT id FROM niche_categories WHERE category_name = 'Technology'),
 'Introduce Kids to the Future with AI', 'Building AI Literacy and Critical Thinking Skills', 
 '#6366f1', '#8b5cf6', 'Coding, Mathematics')
ON CONFLICT (niche_name) DO NOTHING;

INSERT INTO niche_topics (niche_id, topic_number, topic_name, objective, explanation, hashtags, estimated_time, age, activity_1, source_id) VALUES
((SELECT id FROM niches WHERE niche_slug = 'finance'), 1, 'Understanding Money', 
 'To introduce the concept of money and its purpose.',
 'Money is a tool we use to exchange goods and services. It has different forms, such as coins and bills. Each coin and bill has a specific value.',
 '#Finance #Money #Invest', '20 mins', 3,
 'Money Sorting\nMaterials Needed: Mix of real or play Indian coins and bills, sorting trays or bowls.\nSteps to Follow:\n• Provide a mix of ₹1, ₹2, ₹5, ₹10 coins and ₹10, ₹20, ₹50 bills.\n• Ask the child to separate coins and bills into two groups.\n• Further sort them by value.\n• Encourage the child to count each group aloud.\nWhat Should Be Achieved:\nChild identifies money by form and value.\nWhat is Gained:\n• Visual classification\n• Basic counting\n• Early money-handling skill',
 'finance_topic_1')
ON CONFLICT (niche_id, topic_number) DO NOTHING;

INSERT INTO essential_growth_pillars (pillar_name, pillar_slug, color_code, icon_name, description) VALUES
('Play & Creativity', 'play-creativity', '#fce7f3', 'paint-palette', 'Fuel imagination and joyful exploration through hands-on activities and creative expression'),
('Cognitive Skills', 'cognitive-skills', '#dbeafe', 'brainstorm', 'Sharpen thinking, memory, and decision-making skills')
ON CONFLICT (pillar_name) DO NOTHING;

INSERT INTO essential_growth_age_groups (age_range, min_age, max_age, description, sort_order) VALUES
('Infant (0-1)', 0, 1, 'Infant development stage', 1),
('Toddler (1-3)', 1, 3, 'Toddler development stage', 2),
('Preschooler (3-5)', 3, 5, 'Preschool development stage', 3),
('Child (6-8)', 6, 8, 'Early childhood stage', 4),
('Pre-Teen (9-12)', 9, 12, 'Pre-teen development stage', 5),
('Teen (13-18)', 13, 18, 'Teenage development stage', 6)
ON CONFLICT (age_range) DO NOTHING;

INSERT INTO essential_growth_activities (
    pillar_id, activity_id, age_group, category, activity_name, objective, 
    explanation, estimated_time, supervision_level, materials, steps, 
    skills, hashtags, validation_score, source_type, source_row_id
) VALUES
((SELECT id FROM essential_growth_pillars WHERE pillar_slug = 'play-creativity'), 
 'play-creativity-infant-0-1-sensory-exploration-1', 'Infant (0-1)', 'Sensory Exploration',
 'Baby''s First Texture Discovery', 
 'Introduce baby to different textures and develop sensory awareness',
 'Create a safe exploration space with various textures. Baby touches and feels different materials while you describe each one. Perfect for developing sensory skills and bonding time.',
 '10-15 minutes', 'High',
 'Soft fabric squares; Smooth wooden blocks; Crinkly paper; Soft brush; Shallow tray',
 '1. Choose when baby is calm and alert; 2. Place different textures in a shallow tray; 3. Let baby explore each texture; 4. Describe what they''re feeling; 5. Watch for reactions and preferences; 6. Clean up when baby shows signs of being done',
 'Sensory awareness, Tactile exploration, Hand-eye coordination, Language development',
 '#SensoryPlay, #InfantActivities, #TextureExploration, #BabyDevelopment',
 100, 'google_sheets', 'row_1')
ON CONFLICT (activity_id) DO NOTHING;