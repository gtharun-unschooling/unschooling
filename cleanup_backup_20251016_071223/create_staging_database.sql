-- Create Staging Database for Safe Data Migration
-- This creates a separate staging environment for testing and modification

-- Create staging database
CREATE DATABASE unschooling_staging;

-- Connect to staging database
\c unschooling_staging;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. STAGING NICHE CATEGORIES TABLE
-- =====================================================
CREATE TABLE niche_categories_staging (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    color_code VARCHAR(7),
    icon_name VARCHAR(50),
    sort_order INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 2. STAGING NICHES TABLE
-- =====================================================
CREATE TABLE niches_staging (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    niche_name VARCHAR(100) UNIQUE NOT NULL,
    niche_slug VARCHAR(100) UNIQUE NOT NULL,
    category_id UUID REFERENCES niche_categories_staging(id),
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

-- =====================================================
-- 3. STAGING NICHE TOPICS TABLE
-- =====================================================
CREATE TABLE niche_topics_staging (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    niche_id UUID REFERENCES niches_staging(id),
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

-- =====================================================
-- 4. STAGING ESSENTIAL GROWTH PILLARS TABLE
-- =====================================================
CREATE TABLE essential_growth_pillars_staging (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pillar_name VARCHAR(100) UNIQUE NOT NULL,
    pillar_slug VARCHAR(100) UNIQUE NOT NULL,
    color_code VARCHAR(7),
    icon_name VARCHAR(50),
    description TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 5. STAGING ESSENTIAL GROWTH AGE GROUPS TABLE
-- =====================================================
CREATE TABLE essential_growth_age_groups_staging (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    age_range VARCHAR(20) UNIQUE NOT NULL,
    min_age INTEGER NOT NULL,
    max_age INTEGER NOT NULL,
    description TEXT,
    sort_order INTEGER,
    created_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 6. STAGING ESSENTIAL GROWTH ACTIVITIES TABLE
-- =====================================================
CREATE TABLE essential_growth_activities_staging (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    pillar_id UUID REFERENCES essential_growth_pillars_staging(id),
    activity_id VARCHAR(50) UNIQUE NOT NULL,
    age_group VARCHAR(20) NOT NULL,
    category VARCHAR(100),
    category_description TEXT,
    topic_number INTEGER NOT NULL,
    activity_name VARCHAR(500) NOT NULL,
    objective TEXT NOT NULL,
    explanation TEXT,
    estimated_time VARCHAR(20),
    setup_time VARCHAR(20),
    supervision_level VARCHAR(50),
    validation_score INTEGER CHECK (validation_score >= 0 AND validation_score <= 100),
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- =====================================================
-- 7. STAGING SYNC LOG TABLE
-- =====================================================
CREATE TABLE sync_log_staging (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sync_type VARCHAR(50) NOT NULL,
    source VARCHAR(255),
    target VARCHAR(255),
    records_processed INTEGER DEFAULT 0,
    success_count INTEGER DEFAULT 0,
    error_count INTEGER DEFAULT 0,
    sync_duration_ms INTEGER,
    sync_status VARCHAR(50),
    error_details TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_niches_staging_category_id ON niches_staging(category_id);
CREATE INDEX idx_niche_topics_staging_niche_id ON niche_topics_staging(niche_id);
CREATE INDEX idx_essential_growth_activities_staging_pillar_id ON essential_growth_activities_staging(pillar_id);
CREATE INDEX idx_essential_growth_activities_staging_age_group ON essential_growth_activities_staging(age_group);
CREATE INDEX idx_sync_log_staging_created_at ON sync_log_staging(created_at);

-- Success message
SELECT 'Staging database created successfully!' as status;
