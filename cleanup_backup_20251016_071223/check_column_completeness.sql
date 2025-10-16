-- CHECK COLUMN COMPLETENESS
-- This checks if any COLUMNS are missing data (NULL or empty) in your existing records

-- 1. CHECK NICHE CATEGORIES COLUMN COMPLETENESS
SELECT '=== NICHE CATEGORIES COLUMN COMPLETENESS ===' as section;
SELECT 
    category_name,
    CASE WHEN category_name IS NULL OR category_name = '' THEN '❌ MISSING' ELSE '✅ OK' END as category_name_status,
    CASE WHEN description IS NULL OR description = '' THEN '❌ MISSING' ELSE '✅ OK' END as description_status,
    CASE WHEN color_code IS NULL OR color_code = '' THEN '❌ MISSING' ELSE '✅ OK' END as color_code_status,
    CASE WHEN icon_name IS NULL OR icon_name = '' THEN '❌ MISSING' ELSE '✅ OK' END as icon_name_status,
    CASE WHEN sort_order IS NULL THEN '❌ MISSING' ELSE '✅ OK' END as sort_order_status
FROM niche_categories
ORDER BY sort_order;

-- 2. CHECK NICHES COLUMN COMPLETENESS
SELECT '=== NICHES COLUMN COMPLETENESS ===' as section;
SELECT 
    niche_name,
    CASE WHEN niche_name IS NULL OR niche_name = '' THEN '❌ MISSING' ELSE '✅ OK' END as niche_name_status,
    CASE WHEN niche_slug IS NULL OR niche_slug = '' THEN '❌ MISSING' ELSE '✅ OK' END as niche_slug_status,
    CASE WHEN hero_tagline IS NULL OR hero_tagline = '' THEN '❌ MISSING' ELSE '✅ OK' END as hero_tagline_status,
    CASE WHEN sub_heading IS NULL OR sub_heading = '' THEN '❌ MISSING' ELSE '✅ OK' END as sub_heading_status,
    CASE WHEN color_code IS NULL OR color_code = '' THEN '❌ MISSING' ELSE '✅ OK' END as color_code_status,
    CASE WHEN primary_color IS NULL OR primary_color = '' THEN '❌ MISSING' ELSE '✅ OK' END as primary_color_status,
    CASE WHEN suggestion IS NULL OR suggestion = '' THEN '❌ MISSING' ELSE '✅ OK' END as suggestion_status
FROM niches
ORDER BY niche_name;

-- 3. CHECK NICHE TOPICS COLUMN COMPLETENESS
SELECT '=== NICHE TOPICS COLUMN COMPLETENESS ===' as section;
SELECT 
    topic_name,
    CASE WHEN topic_name IS NULL OR topic_name = '' THEN '❌ MISSING' ELSE '✅ OK' END as topic_name_status,
    CASE WHEN objective IS NULL OR objective = '' THEN '❌ MISSING' ELSE '✅ OK' END as objective_status,
    CASE WHEN explanation IS NULL OR explanation = '' THEN '❌ MISSING' ELSE '✅ OK' END as explanation_status,
    CASE WHEN hashtags IS NULL OR hashtags = '' THEN '❌ MISSING' ELSE '✅ OK' END as hashtags_status,
    CASE WHEN estimated_time IS NULL OR estimated_time = '' THEN '❌ MISSING' ELSE '✅ OK' END as estimated_time_status,
    CASE WHEN age IS NULL THEN '❌ MISSING' ELSE '✅ OK' END as age_status,
    CASE WHEN activity_1 IS NULL OR activity_1 = '' THEN '❌ MISSING' ELSE '✅ OK' END as activity_1_status,
    CASE WHEN activity_2 IS NULL OR activity_2 = '' THEN '❌ MISSING' ELSE '✅ OK' END as activity_2_status,
    CASE WHEN source_id IS NULL OR source_id = '' THEN '❌ MISSING' ELSE '✅ OK' END as source_id_status
FROM niche_topics
ORDER BY topic_name;

-- 4. CHECK ESSENTIAL GROWTH PILLARS COLUMN COMPLETENESS
SELECT '=== ESSENTIAL GROWTH PILLARS COLUMN COMPLETENESS ===' as section;
SELECT 
    pillar_name,
    CASE WHEN pillar_name IS NULL OR pillar_name = '' THEN '❌ MISSING' ELSE '✅ OK' END as pillar_name_status,
    CASE WHEN pillar_slug IS NULL OR pillar_slug = '' THEN '❌ MISSING' ELSE '✅ OK' END as pillar_slug_status,
    CASE WHEN color_code IS NULL OR color_code = '' THEN '❌ MISSING' ELSE '✅ OK' END as color_code_status,
    CASE WHEN icon_name IS NULL OR icon_name = '' THEN '❌ MISSING' ELSE '✅ OK' END as icon_name_status,
    CASE WHEN description IS NULL OR description = '' THEN '❌ MISSING' ELSE '✅ OK' END as description_status
FROM essential_growth_pillars
ORDER BY pillar_name;

-- 5. CHECK ESSENTIAL GROWTH ACTIVITIES COLUMN COMPLETENESS
SELECT '=== ESSENTIAL GROWTH ACTIVITIES COLUMN COMPLETENESS ===' as section;
SELECT 
    activity_name,
    CASE WHEN activity_name IS NULL OR activity_name = '' THEN '❌ MISSING' ELSE '✅ OK' END as activity_name_status,
    CASE WHEN activity_id IS NULL OR activity_id = '' THEN '❌ MISSING' ELSE '✅ OK' END as activity_id_status,
    CASE WHEN age_group IS NULL OR age_group = '' THEN '❌ MISSING' ELSE '✅ OK' END as age_group_status,
    CASE WHEN category IS NULL OR category = '' THEN '❌ MISSING' ELSE '✅ OK' END as category_status,
    CASE WHEN category_description IS NULL OR category_description = '' THEN '❌ MISSING' ELSE '✅ OK' END as category_description_status,
    CASE WHEN objective IS NULL OR objective = '' THEN '❌ MISSING' ELSE '✅ OK' END as objective_status,
    CASE WHEN explanation IS NULL OR explanation = '' THEN '❌ MISSING' ELSE '✅ OK' END as explanation_status,
    CASE WHEN estimated_time IS NULL OR estimated_time = '' THEN '❌ MISSING' ELSE '✅ OK' END as estimated_time_status,
    CASE WHEN setup_time IS NULL OR setup_time = '' THEN '❌ MISSING' ELSE '✅ OK' END as setup_time_status,
    CASE WHEN supervision_level IS NULL OR supervision_level = '' THEN '❌ MISSING' ELSE '✅ OK' END as supervision_level_status,
    CASE WHEN validation_score IS NULL THEN '❌ MISSING' ELSE '✅ OK' END as validation_score_status
FROM essential_growth_activities
ORDER BY activity_name;

-- 6. CHECK ESSENTIAL GROWTH AGE GROUPS COLUMN COMPLETENESS
SELECT '=== ESSENTIAL GROWTH AGE GROUPS COLUMN COMPLETENESS ===' as section;
SELECT 
    age_range,
    CASE WHEN age_range IS NULL OR age_range = '' THEN '❌ MISSING' ELSE '✅ OK' END as age_range_status,
    CASE WHEN min_age IS NULL THEN '❌ MISSING' ELSE '✅ OK' END as min_age_status,
    CASE WHEN max_age IS NULL THEN '❌ MISSING' ELSE '✅ OK' END as max_age_status,
    CASE WHEN description IS NULL OR description = '' THEN '❌ MISSING' ELSE '✅ OK' END as description_status,
    CASE WHEN sort_order IS NULL THEN '❌ MISSING' ELSE '✅ OK' END as sort_order_status
FROM essential_growth_age_groups
ORDER BY sort_order;

-- 7. CHECK SYNC LOG COLUMN COMPLETENESS
SELECT '=== SYNC LOG COLUMN COMPLETENESS ===' as section;
SELECT 
    source_type,
    CASE WHEN source_type IS NULL OR source_type = '' THEN '❌ MISSING' ELSE '✅ OK' END as source_type_status,
    CASE WHEN source_page IS NULL OR source_page = '' THEN '❌ MISSING' ELSE '✅ OK' END as source_page_status,
    CASE WHEN operation IS NULL OR operation = '' THEN '❌ MISSING' ELSE '✅ OK' END as operation_status,
    CASE WHEN sync_status IS NULL OR sync_status = '' THEN '❌ MISSING' ELSE '✅ OK' END as sync_status_status,
    CASE WHEN records_processed IS NULL THEN '❌ MISSING' ELSE '✅ OK' END as records_processed_status,
    CASE WHEN records_success IS NULL THEN '❌ MISSING' ELSE '✅ OK' END as records_success_status,
    CASE WHEN records_failed IS NULL THEN '❌ MISSING' ELSE '✅ OK' END as records_failed_status,
    CASE WHEN synced_at IS NULL THEN '❌ MISSING' ELSE '✅ OK' END as synced_at_status
FROM sync_log
ORDER BY synced_at;

-- 8. SUMMARY OF MISSING COLUMNS
SELECT '=== SUMMARY: MISSING COLUMNS COUNT ===' as section;

-- Count missing columns in niche_categories
SELECT 
    'Niche Categories' as table_name,
    SUM(CASE WHEN category_name IS NULL OR category_name = '' THEN 1 ELSE 0 END) as missing_category_name,
    SUM(CASE WHEN description IS NULL OR description = '' THEN 1 ELSE 0 END) as missing_description,
    SUM(CASE WHEN color_code IS NULL OR color_code = '' THEN 1 ELSE 0 END) as missing_color_code,
    SUM(CASE WHEN icon_name IS NULL OR icon_name = '' THEN 1 ELSE 0 END) as missing_icon_name,
    SUM(CASE WHEN sort_order IS NULL THEN 1 ELSE 0 END) as missing_sort_order
FROM niche_categories

UNION ALL

-- Count missing columns in niches
SELECT 
    'Niches',
    SUM(CASE WHEN niche_name IS NULL OR niche_name = '' THEN 1 ELSE 0 END),
    SUM(CASE WHEN niche_slug IS NULL OR niche_slug = '' THEN 1 ELSE 0 END),
    SUM(CASE WHEN hero_tagline IS NULL OR hero_tagline = '' THEN 1 ELSE 0 END),
    SUM(CASE WHEN sub_heading IS NULL OR sub_heading = '' THEN 1 ELSE 0 END),
    SUM(CASE WHEN color_code IS NULL OR color_code = '' THEN 1 ELSE 0 END)
FROM niches

UNION ALL

-- Count missing columns in niche_topics
SELECT 
    'Niche Topics',
    SUM(CASE WHEN topic_name IS NULL OR topic_name = '' THEN 1 ELSE 0 END),
    SUM(CASE WHEN objective IS NULL OR objective = '' THEN 1 ELSE 0 END),
    SUM(CASE WHEN explanation IS NULL OR explanation = '' THEN 1 ELSE 0 END),
    SUM(CASE WHEN hashtags IS NULL OR hashtags = '' THEN 1 ELSE 0 END),
    SUM(CASE WHEN estimated_time IS NULL OR estimated_time = '' THEN 1 ELSE 0 END)
FROM niche_topics

UNION ALL

-- Count missing columns in essential_growth_activities
SELECT 
    'Essential Growth Activities',
    SUM(CASE WHEN activity_name IS NULL OR activity_name = '' THEN 1 ELSE 0 END),
    SUM(CASE WHEN activity_id IS NULL OR activity_id = '' THEN 1 ELSE 0 END),
    SUM(CASE WHEN age_group IS NULL OR age_group = '' THEN 1 ELSE 0 END),
    SUM(CASE WHEN objective IS NULL OR objective = '' THEN 1 ELSE 0 END),
    SUM(CASE WHEN explanation IS NULL OR explanation = '' THEN 1 ELSE 0 END)
FROM essential_growth_activities;
