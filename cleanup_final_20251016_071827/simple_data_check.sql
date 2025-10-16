-- Simple Data Quality Check
-- This will show you exactly what's in your database

-- 1. BASIC COUNTS
SELECT '=== DATABASE OVERVIEW ===' as info;
SELECT 
    'Niche Categories' as table_name, COUNT(*) as count FROM niche_categories
UNION ALL
SELECT 'Niches', COUNT(*) FROM niches
UNION ALL
SELECT 'Niche Topics', COUNT(*) FROM niche_topics
UNION ALL
SELECT 'Essential Growth Pillars', COUNT(*) FROM essential_growth_pillars
UNION ALL
SELECT 'Essential Growth Activities', COUNT(*) FROM essential_growth_activities
UNION ALL
SELECT 'Age Groups', COUNT(*) FROM essential_growth_age_groups;

-- 2. NICHE CATEGORIES QUALITY
SELECT '=== NICHE CATEGORIES ===' as info;
SELECT category_name, color_code, icon_name FROM niche_categories ORDER BY sort_order;

-- 3. NICHES QUALITY
SELECT '=== NICHES ===' as info;
SELECT n.niche_name, nc.category_name, n.hero_tagline 
FROM niches n 
LEFT JOIN niche_categories nc ON n.category_id = nc.id;

-- 4. NICHE TOPICS QUALITY
SELECT '=== NICHE TOPICS ===' as info;
SELECT nt.topic_name, n.niche_name, nt.age, nt.estimated_time, nt.objective
FROM niche_topics nt
LEFT JOIN niches n ON nt.niche_id = n.id;

-- 5. ESSENTIAL GROWTH PILLARS QUALITY
SELECT '=== ESSENTIAL GROWTH PILLARS ===' as info;
SELECT pillar_name, color_code, description FROM essential_growth_pillars;

-- 6. AGE GROUPS QUALITY
SELECT '=== AGE GROUPS ===' as info;
SELECT age_range, min_age, max_age FROM essential_growth_age_groups ORDER BY sort_order;

-- 7. ESSENTIAL GROWTH ACTIVITIES QUALITY
SELECT '=== ESSENTIAL GROWTH ACTIVITIES ===' as info;
SELECT ea.activity_name, ep.pillar_name, ea.age_group, ea.validation_score, ea.objective
FROM essential_growth_activities ea
LEFT JOIN essential_growth_pillars ep ON ea.pillar_id = ep.id;
