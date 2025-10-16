-- Database Data Quality Analysis
-- Let's check what's actually in your database

-- 1. Check all tables and record counts
SELECT 
    'Niche Categories' as table_name, 
    COUNT(*) as record_count,
    'Reference data' as data_type
FROM niche_categories
UNION ALL
SELECT 
    'Niches' as table_name, 
    COUNT(*) as record_count,
    'Reference data' as data_type
FROM niches
UNION ALL
SELECT 
    'Niche Topics' as table_name, 
    COUNT(*) as record_count,
    'Content data' as data_type
FROM niche_topics
UNION ALL
SELECT 
    'Essential Growth Pillars' as table_name, 
    COUNT(*) as record_count,
    'Reference data' as data_type
FROM essential_growth_pillars
UNION ALL
SELECT 
    'Essential Growth Age Groups' as table_name, 
    COUNT(*) as record_count,
    'Reference data' as data_type
FROM essential_growth_age_groups
UNION ALL
SELECT 
    'Essential Growth Activities' as table_name, 
    COUNT(*) as record_count,
    'Content data' as data_type
FROM essential_growth_activities
UNION ALL
SELECT 
    'Sync Log' as table_name, 
    COUNT(*) as record_count,
    'System data' as data_type
FROM sync_log
ORDER BY table_name;

-- 2. Check niche categories data quality
SELECT 'NICHE CATEGORIES ANALYSIS' as section;
SELECT 
    category_name,
    color_code,
    icon_name,
    sort_order,
    CASE 
        WHEN category_name IS NULL THEN '❌ MISSING NAME'
        WHEN color_code IS NULL THEN '⚠️ MISSING COLOR'
        WHEN icon_name IS NULL THEN '⚠️ MISSING ICON'
        ELSE '✅ COMPLETE'
    END as data_quality
FROM niche_categories
ORDER BY sort_order;

-- 3. Check niches data quality
SELECT 'NICHES ANALYSIS' as section;
SELECT 
    n.niche_name,
    n.niche_slug,
    nc.category_name,
    CASE 
        WHEN n.niche_name IS NULL THEN '❌ MISSING NAME'
        WHEN n.niche_slug IS NULL THEN '❌ MISSING SLUG'
        WHEN nc.category_name IS NULL THEN '❌ MISSING CATEGORY'
        WHEN n.hero_tagline IS NULL THEN '⚠️ MISSING TAGLINE'
        ELSE '✅ COMPLETE'
    END as data_quality
FROM niches n
LEFT JOIN niche_categories nc ON n.category_id = nc.id
ORDER BY n.niche_name;

-- 4. Check niche topics data quality
SELECT 'NICHE TOPICS ANALYSIS' as section;
SELECT 
    nt.topic_name,
    n.niche_name,
    nt.age,
    nt.estimated_time,
    CASE 
        WHEN nt.topic_name IS NULL THEN '❌ MISSING TITLE'
        WHEN n.niche_name IS NULL THEN '❌ MISSING NICHE'
        WHEN nt.age IS NULL THEN '❌ MISSING AGE'
        WHEN nt.age < 3 OR nt.age > 18 THEN '❌ INVALID AGE'
        WHEN nt.objective IS NULL THEN '❌ MISSING OBJECTIVE'
        WHEN nt.estimated_time IS NULL THEN '⚠️ MISSING TIME'
        ELSE '✅ COMPLETE'
    END as data_quality
FROM niche_topics nt
LEFT JOIN niches n ON nt.niche_id = n.id
ORDER BY n.niche_name, nt.topic_number;

-- 5. Check essential growth pillars data quality
SELECT 'ESSENTIAL GROWTH PILLARS ANALYSIS' as section;
SELECT 
    pillar_name,
    pillar_slug,
    color_code,
    CASE 
        WHEN pillar_name IS NULL THEN '❌ MISSING NAME'
        WHEN pillar_slug IS NULL THEN '❌ MISSING SLUG'
        WHEN color_code IS NULL THEN '⚠️ MISSING COLOR'
        WHEN description IS NULL THEN '⚠️ MISSING DESCRIPTION'
        ELSE '✅ COMPLETE'
    END as data_quality
FROM essential_growth_pillars
ORDER BY pillar_name;

-- 6. Check essential growth age groups data quality
SELECT 'ESSENTIAL GROWTH AGE GROUPS ANALYSIS' as section;
SELECT 
    age_range,
    min_age,
    max_age,
    CASE 
        WHEN age_range IS NULL THEN '❌ MISSING RANGE'
        WHEN min_age IS NULL THEN '❌ MISSING MIN AGE'
        WHEN max_age IS NULL THEN '❌ MISSING MAX AGE'
        WHEN min_age > max_age THEN '❌ INVALID RANGE'
        ELSE '✅ COMPLETE'
    END as data_quality
FROM essential_growth_age_groups
ORDER BY sort_order;

-- 7. Check essential growth activities data quality
SELECT 'ESSENTIAL GROWTH ACTIVITIES ANALYSIS' as section;
SELECT 
    ea.activity_name,
    ep.pillar_name,
    ea.age_group,
    ea.validation_score,
    CASE 
        WHEN ea.activity_name IS NULL THEN '❌ MISSING NAME'
        WHEN ep.pillar_name IS NULL THEN '❌ MISSING PILLAR'
        WHEN ea.age_group IS NULL THEN '❌ MISSING AGE GROUP'
        WHEN ea.objective IS NULL THEN '❌ MISSING OBJECTIVE'
        WHEN ea.validation_score IS NULL THEN '⚠️ MISSING SCORE'
        WHEN ea.validation_score < 0 OR ea.validation_score > 100 THEN '❌ INVALID SCORE'
        ELSE '✅ COMPLETE'
    END as data_quality
FROM essential_growth_activities ea
LEFT JOIN essential_growth_pillars ep ON ea.pillar_id = ep.id
ORDER BY ep.pillar_name, ea.topic_number;

-- 8. Check for data inconsistencies
SELECT 'DATA INCONSISTENCY CHECKS' as section;

-- Check for orphaned records
SELECT 'Orphaned Niche Topics' as issue, COUNT(*) as count
FROM niche_topics nt
LEFT JOIN niches n ON nt.niche_id = n.id
WHERE n.id IS NULL

UNION ALL

SELECT 'Orphaned Activities' as issue, COUNT(*) as count
FROM essential_growth_activities ea
LEFT JOIN essential_growth_pillars ep ON ea.pillar_id = ep.id
WHERE ep.id IS NULL;

-- Check for duplicate activity IDs
SELECT 'Duplicate Activity IDs' as issue, COUNT(*) as count
FROM (
    SELECT activity_id, COUNT(*) as dup_count
    FROM essential_growth_activities
    GROUP BY activity_id
    HAVING COUNT(*) > 1
) duplicates;

-- Check for age range consistency
SELECT 'Age Range Issues' as issue, COUNT(*) as count
FROM essential_growth_activities ea
WHERE ea.age_group NOT IN (
    SELECT age_range FROM essential_growth_age_groups
);
