-- =====================================================
-- GCP POSTGRESQL QUERY EXAMPLES
-- =====================================================

-- =====================================================
-- 1. BASIC QUERIES - NICHE DATA
-- =====================================================

-- Get all niches in Core Academic category
SELECT n.niche_name, n.hero_tagline, nc.category_name
FROM niches n
JOIN niche_categories nc ON n.category_id = nc.id
WHERE nc.category_name = 'Core Academic';

-- Get all topics for Finance niche
SELECT topic_name, objective, age, estimated_time
FROM niche_topics_with_details
WHERE niche_name = 'Finance'
ORDER BY topic_number;

-- Get topics for specific age (e.g., age 5)
SELECT nt.topic_name, nt.objective, n.niche_name, nc.category_name
FROM niche_topics nt
JOIN niches n ON nt.niche_id = n.id
JOIN niche_categories nc ON n.category_id = nc.id
WHERE nt.age = 5
ORDER BY n.niche_name, nt.topic_number;

-- Get topics for age range (e.g., ages 6-8)
SELECT nt.topic_name, nt.objective, n.niche_name, nt.age
FROM niche_topics nt
JOIN niches n ON nt.niche_id = n.id
WHERE nt.age BETWEEN 6 AND 8
ORDER BY nt.age, n.niche_name;

-- Search topics by hashtags
SELECT topic_name, objective, niche_name, hashtags
FROM niche_topics_with_details
WHERE hashtags LIKE '%Finance%' OR hashtags LIKE '%Money%';

-- Get all niches with their topic counts
SELECT n.niche_name, nc.category_name, COUNT(nt.id) as topic_count
FROM niches n
JOIN niche_categories nc ON n.category_id = nc.id
LEFT JOIN niche_topics nt ON n.id = nt.niche_id
GROUP BY n.id, n.niche_name, nc.category_name
ORDER BY topic_count DESC;

-- =====================================================
-- 2. BASIC QUERIES - ESSENTIAL GROWTH DATA
-- =====================================================

-- Get all activities for Play & Creativity pillar
SELECT activity_name, objective, age_group, category, estimated_time, validation_score
FROM essential_activities_with_details
WHERE pillar_name = 'Play & Creativity'
ORDER BY age_group, topic_number;

-- Get activities for specific age group (e.g., Infant 0-1)
SELECT ea.activity_name, ea.objective, ea.category, ep.pillar_name, ea.validation_score
FROM essential_growth_activities ea
JOIN essential_growth_pillars ep ON ea.pillar_id = ep.id
WHERE ea.age_group = 'Infant (0-1)'
ORDER BY ep.pillar_name, ea.topic_number;

-- Get activities by category (e.g., Sensory Exploration)
SELECT activity_name, objective, age_group, pillar_name, estimated_time
FROM essential_activities_with_details
WHERE category = 'Sensory Exploration'
ORDER BY age_group;

-- Get high-quality activities (validation score > 80)
SELECT activity_name, objective, pillar_name, age_group, validation_score
FROM essential_activities_with_details
WHERE validation_score > 80
ORDER BY validation_score DESC;

-- Get activities by supervision level
SELECT activity_name, age_group, pillar_name, supervision_level, estimated_time
FROM essential_activities_with_details
WHERE supervision_level = 'High'
ORDER BY age_group, pillar_name;

-- Get all pillars with their activity counts
SELECT ep.pillar_name, COUNT(ea.id) as activity_count
FROM essential_growth_pillars ep
LEFT JOIN essential_growth_activities ea ON ep.id = ea.pillar_id
GROUP BY ep.id, ep.pillar_name
ORDER BY activity_count DESC;

-- =====================================================
-- 3. CROSS-DATA QUERIES
-- =====================================================

-- Get content suitable for age 5 (both niches and essential growth)
-- Niches content for age 5
SELECT 'Niche' as content_type, nt.topic_name as title, nt.objective, n.niche_name as category, 'Age ' || nt.age as age_info
FROM niche_topics nt
JOIN niches n ON nt.niche_id = n.id
WHERE nt.age = 5

UNION ALL

-- Essential growth content for age 5 (Child 6-8 group includes age 5)
SELECT 'Essential Growth' as content_type, ea.activity_name as title, ea.objective, ea.category, ea.age_group as age_info
FROM essential_growth_activities ea
WHERE ea.age_group = 'Child (6-8)' OR ea.age_group = 'Preschooler (3-5)'
ORDER BY content_type, title;

-- Get all content by source type
SELECT 'Niche Topics' as table_name, COUNT(*) as count, 'direct_db' as source_type
FROM niche_topics
WHERE source_type = 'direct_db'

UNION ALL

SELECT 'Essential Growth Activities' as table_name, COUNT(*) as count, source_type
FROM essential_growth_activities
GROUP BY source_type

ORDER BY table_name, source_type;

-- =====================================================
-- 4. ANALYTICS QUERIES
-- =====================================================

-- Get content distribution by age
SELECT 
    CASE 
        WHEN age BETWEEN 3 AND 5 THEN '3-5'
        WHEN age BETWEEN 6 AND 8 THEN '6-8'
        WHEN age BETWEEN 9 AND 12 THEN '9-12'
        WHEN age BETWEEN 13 AND 15 THEN '13-15'
        WHEN age BETWEEN 16 AND 18 THEN '16-18'
    END as age_group,
    COUNT(*) as topic_count
FROM niche_topics
GROUP BY 
    CASE 
        WHEN age BETWEEN 3 AND 5 THEN '3-5'
        WHEN age BETWEEN 6 AND 8 THEN '6-8'
        WHEN age BETWEEN 9 AND 12 THEN '9-12'
        WHEN age BETWEEN 13 AND 15 THEN '13-15'
        WHEN age BETWEEN 16 AND 18 THEN '16-18'
    END
ORDER BY age_group;

-- Get essential growth activities by age group
SELECT age_group, COUNT(*) as activity_count, AVG(validation_score) as avg_quality_score
FROM essential_growth_activities
GROUP BY age_group
ORDER BY 
    CASE age_group
        WHEN 'Infant (0-1)' THEN 1
        WHEN 'Toddler (1-3)' THEN 2
        WHEN 'Preschooler (3-5)' THEN 3
        WHEN 'Child (6-8)' THEN 4
        WHEN 'Pre-Teen (9-12)' THEN 5
        WHEN 'Teen (13-18)' THEN 6
    END;

-- Get sync statistics
SELECT 
    source_type,
    source_page,
    COUNT(*) as sync_operations,
    SUM(records_processed) as total_records,
    SUM(records_success) as successful_records,
    SUM(records_failed) as failed_records,
    ROUND(AVG(records_success::float / records_processed * 100), 2) as success_rate
FROM sync_log
GROUP BY source_type, source_page
ORDER BY source_type, source_page;

-- =====================================================
-- 5. SEARCH QUERIES
-- =====================================================

-- Search across all content by keyword
SELECT 'Niche Topic' as content_type, nt.topic_name as title, nt.objective, n.niche_name as category
FROM niche_topics nt
JOIN niches n ON nt.niche_id = n.id
WHERE nt.topic_name ILIKE '%money%' OR nt.objective ILIKE '%money%'

UNION ALL

SELECT 'Essential Growth Activity' as content_type, ea.activity_name as title, ea.objective, ea.category
FROM essential_growth_activities ea
WHERE ea.activity_name ILIKE '%money%' OR ea.objective ILIKE '%money%'

ORDER BY content_type, title;

-- Search by skills
SELECT activity_name, objective, skills, pillar_name, age_group
FROM essential_activities_with_details
WHERE skills ILIKE '%problem%' OR skills ILIKE '%thinking%'
ORDER BY pillar_name, age_group;

-- =====================================================
-- 6. INSERT/UPDATE QUERIES
-- =====================================================

-- Add new niche topic directly to database
INSERT INTO niche_topics (niche_id, topic_number, topic_name, objective, explanation, hashtags, estimated_time, age, activity_1, source_type, source_id)
VALUES (
    (SELECT id FROM niches WHERE niche_slug = 'finance'),
    10,
    'Digital Banking Basics',
    'To introduce the concept of digital banking and online money management.',
    'Digital banking allows us to manage money through apps and websites. It''s convenient but requires understanding of security and responsibility.',
    '#Finance #DigitalBanking #Technology',
    '30 mins',
    12,
    'Banking App Exploration\nMaterials Needed: Parent''s banking app (supervised), paper, pen.\nSteps to Follow:\n• Show child how to check account balance\n• Explain different features safely\n• Discuss online security\nWhat Should Be Achieved:\nBasic understanding of digital banking.\nWhat is Gained:\n• Technology literacy\n• Financial awareness\n• Security consciousness',
    'direct_db',
    'finance_topic_10_manual'
);

-- Update validation score for an activity
UPDATE essential_growth_activities 
SET validation_score = 95, 
    updated_at = NOW(),
    feedback = 'Excellent activity with clear instructions'
WHERE activity_id = 'play-creativity-infant-0-1-sensory-exploration-1';

-- Add new essential growth activity
INSERT INTO essential_growth_activities (
    pillar_id, activity_id, age_group, category, activity_name, objective, 
    explanation, estimated_time, supervision_level, materials, steps, 
    skills, hashtags, validation_score, source_type, source_id
)
VALUES (
    (SELECT id FROM essential_growth_pillars WHERE pillar_slug = 'cognitive-skills'),
    'cognitive-skills-preschooler-3-5-memory-1',
    'Preschooler (3-5)',
    'Memory Games',
    'Memory Card Matching',
    'Develop memory skills and concentration through card matching games.',
    'Use colorful picture cards to play memory matching games. Children flip cards to find pairs, improving their memory and concentration.',
    '15-20 minutes',
    'Medium',
    'Picture cards (12-16 pairs), flat surface',
    '1. Shuffle cards and place face down; 2. Take turns flipping two cards; 3. Keep pairs if they match; 4. Continue until all pairs found; 5. Count pairs to determine winner',
    'Memory, Concentration, Turn-taking, Visual recognition',
    '#MemoryGames, #PreschoolerActivities, #CognitiveDevelopment',
    90,
    'direct_db',
    'cognitive_memory_1_manual'
);

-- =====================================================
-- 7. DELETE QUERIES (Use with caution!)
-- =====================================================

-- Delete a specific topic (be careful with this!)
-- DELETE FROM niche_topics WHERE id = 'specific-uuid-here';

-- Delete activities with low validation scores (example)
-- DELETE FROM essential_growth_activities WHERE validation_score < 30;

-- =====================================================
-- 8. MAINTENANCE QUERIES
-- =====================================================

-- Check for orphaned records
SELECT 'Orphaned niche topics' as issue, COUNT(*) as count
FROM niche_topics nt
LEFT JOIN niches n ON nt.niche_id = n.id
WHERE n.id IS NULL

UNION ALL

SELECT 'Orphaned essential growth activities' as issue, COUNT(*) as count
FROM essential_growth_activities ea
LEFT JOIN essential_growth_pillars ep ON ea.pillar_id = ep.id
WHERE ep.id IS NULL;

-- Check for duplicate activity IDs
SELECT activity_id, COUNT(*) as duplicate_count
FROM essential_growth_activities
GROUP BY activity_id
HAVING COUNT(*) > 1;

-- Get database size information
SELECT 
    schemaname,
    tablename,
    pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
