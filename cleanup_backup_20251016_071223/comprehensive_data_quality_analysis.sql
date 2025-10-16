-- COMPREHENSIVE DATA QUALITY ANALYSIS
-- Based on Enhanced Sample Data with Real Content Structure

-- 1. DATABASE OVERVIEW WITH REALISTIC COUNTS
SELECT '=== DATABASE OVERVIEW (ENHANCED DATA) ===' as section;
SELECT 
    'Niche Categories' as table_name, 
    COUNT(*) as record_count,
    'Reference data - 9 categories' as description
FROM niche_categories
UNION ALL
SELECT 'Niches', COUNT(*), 'Content data - 17 niches' FROM niches
UNION ALL
SELECT 'Niche Topics', COUNT(*), 'Content data - 13 topics' FROM niche_topics
UNION ALL
SELECT 'Essential Growth Pillars', COUNT(*), 'Reference data - 6 pillars' FROM essential_growth_pillars
UNION ALL
SELECT 'Essential Growth Activities', COUNT(*), 'Content data - 12 activities' FROM essential_growth_activities
UNION ALL
SELECT 'Age Groups', COUNT(*), 'Reference data - 6 age groups' FROM essential_growth_age_groups
UNION ALL
SELECT 'Sync Log', COUNT(*), 'System data - 4 sync records' FROM sync_log;

-- 2. NICHE CATEGORIES QUALITY ANALYSIS
SELECT '=== NICHE CATEGORIES QUALITY ===' as section;
SELECT 
    category_name,
    color_code,
    icon_name,
    CASE 
        WHEN category_name IS NULL THEN '❌ MISSING NAME'
        WHEN color_code IS NULL THEN '❌ MISSING COLOR'
        WHEN icon_name IS NULL THEN '❌ MISSING ICON'
        WHEN LENGTH(description) < 10 THEN '⚠️ SHORT DESCRIPTION'
        ELSE '✅ COMPLETE'
    END as data_quality,
    LENGTH(description) as desc_length
FROM niche_categories
ORDER BY sort_order;

-- 3. NICHES QUALITY ANALYSIS
SELECT '=== NICHES QUALITY ANALYSIS ===' as section;
SELECT 
    n.niche_name,
    nc.category_name,
    n.hero_tagline,
    CASE 
        WHEN n.niche_name IS NULL THEN '❌ MISSING NAME'
        WHEN n.niche_slug IS NULL THEN '❌ MISSING SLUG'
        WHEN nc.category_name IS NULL THEN '❌ MISSING CATEGORY'
        WHEN n.hero_tagline IS NULL THEN '❌ MISSING TAGLINE'
        WHEN LENGTH(n.description) < 20 THEN '⚠️ SHORT DESCRIPTION'
        ELSE '✅ COMPLETE'
    END as data_quality,
    LENGTH(n.description) as desc_length
FROM niches n
LEFT JOIN niche_categories nc ON n.category_id = nc.id
ORDER BY n.niche_name;

-- 4. NICHE TOPICS QUALITY ANALYSIS
SELECT '=== NICHE TOPICS QUALITY ANALYSIS ===' as section;
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
        WHEN nt.estimated_time IS NULL THEN '❌ MISSING TIME'
        WHEN LENGTH(nt.explanation) < 20 THEN '⚠️ SHORT EXPLANATION'
        ELSE '✅ COMPLETE'
    END as data_quality,
    LENGTH(nt.explanation) as explanation_length
FROM niche_topics nt
LEFT JOIN niches n ON nt.niche_id = n.id
ORDER BY n.niche_name, nt.topic_number;

-- 5. ESSENTIAL GROWTH PILLARS QUALITY ANALYSIS
SELECT '=== ESSENTIAL GROWTH PILLARS QUALITY ===' as section;
SELECT 
    pillar_name,
    pillar_slug,
    color_code,
    CASE 
        WHEN pillar_name IS NULL THEN '❌ MISSING NAME'
        WHEN pillar_slug IS NULL THEN '❌ MISSING SLUG'
        WHEN color_code IS NULL THEN '❌ MISSING COLOR'
        WHEN LENGTH(description) < 20 THEN '⚠️ SHORT DESCRIPTION'
        ELSE '✅ COMPLETE'
    END as data_quality,
    LENGTH(description) as desc_length
FROM essential_growth_pillars
ORDER BY pillar_name;

-- 6. ESSENTIAL GROWTH ACTIVITIES QUALITY ANALYSIS
SELECT '=== ESSENTIAL GROWTH ACTIVITIES QUALITY ===' as section;
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
        WHEN ea.validation_score IS NULL THEN '❌ MISSING SCORE'
        WHEN ea.validation_score < 0 OR ea.validation_score > 100 THEN '❌ INVALID SCORE'
        WHEN LENGTH(ea.explanation) < 20 THEN '⚠️ SHORT EXPLANATION'
        ELSE '✅ COMPLETE'
    END as data_quality,
    LENGTH(ea.explanation) as explanation_length
FROM essential_growth_activities ea
LEFT JOIN essential_growth_pillars ep ON ea.pillar_id = ep.id
ORDER BY ep.pillar_name, ea.topic_number;

-- 7. DATA INTEGRITY CHECKS
SELECT '=== DATA INTEGRITY CHECKS ===' as section;

-- Check for orphaned records
SELECT 'Orphaned Niche Topics' as issue, COUNT(*) as count
FROM niche_topics nt
LEFT JOIN niches n ON nt.niche_id = n.id
WHERE n.id IS NULL

UNION ALL

SELECT 'Orphaned Activities' as issue, COUNT(*) as count
FROM essential_growth_activities ea
LEFT JOIN essential_growth_pillars ep ON ea.pillar_id = ep.id
WHERE ep.id IS NULL

UNION ALL

SELECT 'Orphaned Niches' as issue, COUNT(*) as count
FROM niches n
LEFT JOIN niche_categories nc ON n.category_id = nc.id
WHERE nc.id IS NULL;

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

-- 8. CONTENT COMPLETENESS ANALYSIS
SELECT '=== CONTENT COMPLETENESS ANALYSIS ===' as section;

-- Topics per niche
SELECT 
    n.niche_name,
    COUNT(nt.id) as topic_count,
    CASE 
        WHEN COUNT(nt.id) = 0 THEN '❌ NO TOPICS'
        WHEN COUNT(nt.id) < 3 THEN '⚠️ FEW TOPICS'
        WHEN COUNT(nt.id) >= 3 THEN '✅ GOOD COVERAGE'
    END as coverage_status
FROM niches n
LEFT JOIN niche_topics nt ON n.id = nt.niche_id
GROUP BY n.id, n.niche_name
ORDER BY topic_count DESC;

-- Activities per pillar
SELECT 
    ep.pillar_name,
    COUNT(ea.id) as activity_count,
    CASE 
        WHEN COUNT(ea.id) = 0 THEN '❌ NO ACTIVITIES'
        WHEN COUNT(ea.id) < 2 THEN '⚠️ FEW ACTIVITIES'
        WHEN COUNT(ea.id) >= 2 THEN '✅ GOOD COVERAGE'
    END as coverage_status
FROM essential_growth_pillars ep
LEFT JOIN essential_growth_activities ea ON ep.id = ea.pillar_id
GROUP BY ep.id, ep.pillar_name
ORDER BY activity_count DESC;

-- 9. VALIDATION SCORES ANALYSIS
SELECT '=== VALIDATION SCORES ANALYSIS ===' as section;
SELECT 
    CASE 
        WHEN validation_score >= 90 THEN '🟢 EXCELLENT (90-100)'
        WHEN validation_score >= 80 THEN '🟡 GOOD (80-89)'
        WHEN validation_score >= 70 THEN '🟠 FAIR (70-79)'
        WHEN validation_score < 70 THEN '🔴 POOR (<70)'
        ELSE '❌ MISSING SCORE'
    END as score_range,
    COUNT(*) as activity_count,
    ROUND(AVG(validation_score), 1) as avg_score
FROM essential_growth_activities
GROUP BY score_range
ORDER BY avg_score DESC;

-- 10. AGE DISTRIBUTION ANALYSIS
SELECT '=== AGE DISTRIBUTION ANALYSIS ===' as section;

-- Niche topics age distribution
SELECT 
    CASE 
        WHEN age BETWEEN 3 AND 5 THEN 'Early Childhood (3-5)'
        WHEN age BETWEEN 6 AND 8 THEN 'Childhood (6-8)'
        WHEN age BETWEEN 9 AND 12 THEN 'Pre-Teen (9-12)'
        WHEN age BETWEEN 13 AND 15 THEN 'Teen (13-15)'
        WHEN age BETWEEN 16 AND 18 THEN 'Young Adult (16-18)'
        ELSE 'Invalid Age'
    END as age_group,
    COUNT(*) as topic_count
FROM niche_topics
GROUP BY age_group
ORDER BY MIN(age);

-- Essential growth activities age distribution
SELECT 
    age_group,
    COUNT(*) as activity_count
FROM essential_growth_activities
GROUP BY age_group
ORDER BY age_group;

-- 11. SYNC LOG ANALYSIS
SELECT '=== SYNC LOG ANALYSIS ===' as section;
SELECT 
    sync_type,
    sync_status,
    COUNT(*) as sync_count,
    ROUND(AVG(sync_duration_ms), 0) as avg_duration_ms,
    SUM(records_processed) as total_records,
    SUM(success_count) as successful_records,
    SUM(error_count) as failed_records
FROM sync_log
GROUP BY sync_type, sync_status
ORDER BY sync_type, sync_status;

-- 12. OVERALL DATA QUALITY SUMMARY
SELECT '=== OVERALL DATA QUALITY SUMMARY ===' as section;
SELECT 
    'Total Records' as metric,
    (SELECT COUNT(*) FROM niche_categories) + 
    (SELECT COUNT(*) FROM niches) + 
    (SELECT COUNT(*) FROM niche_topics) + 
    (SELECT COUNT(*) FROM essential_growth_pillars) + 
    (SELECT COUNT(*) FROM essential_growth_activities) + 
    (SELECT COUNT(*) FROM essential_growth_age_groups) + 
    (SELECT COUNT(*) FROM sync_log) as value,
    'All tables' as description

UNION ALL

SELECT 
    'Complete Records',
    (SELECT COUNT(*) FROM niche_topics WHERE topic_name IS NOT NULL AND objective IS NOT NULL AND age IS NOT NULL),
    'Niche topics with all required fields'

UNION ALL

SELECT 
    'Valid Ages',
    (SELECT COUNT(*) FROM niche_topics WHERE age BETWEEN 3 AND 18),
    'Niche topics with valid age ranges'

UNION ALL

SELECT 
    'High Quality Activities',
    (SELECT COUNT(*) FROM essential_growth_activities WHERE validation_score >= 80),
    'Activities with validation score >= 80'

UNION ALL

SELECT 
    'Data Integrity',
    (SELECT COUNT(*) FROM niche_topics nt JOIN niches n ON nt.niche_id = n.id) +
    (SELECT COUNT(*) FROM essential_growth_activities ea JOIN essential_growth_pillars ep ON ea.pillar_id = ep.id),
    'Records with valid relationships';
