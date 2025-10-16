-- Check for Missing Data in Current Database
-- This will show us what data is missing compared to our enhanced sample

-- 1. Check current record counts
SELECT '=== CURRENT DATABASE COUNTS ===' as section;
SELECT 
    'Niche Categories' as table_name, 
    COUNT(*) as current_count,
    'Expected: 9' as expected_count,
    CASE WHEN COUNT(*) < 9 THEN '❌ MISSING DATA' ELSE '✅ COMPLETE' END as status
FROM niche_categories
UNION ALL
SELECT 'Niches', COUNT(*), 'Expected: 17', CASE WHEN COUNT(*) < 17 THEN '❌ MISSING DATA' ELSE '✅ COMPLETE' END FROM niches
UNION ALL
SELECT 'Niche Topics', COUNT(*), 'Expected: 13', CASE WHEN COUNT(*) < 13 THEN '❌ MISSING DATA' ELSE '✅ COMPLETE' END FROM niche_topics
UNION ALL
SELECT 'Essential Growth Pillars', COUNT(*), 'Expected: 6', CASE WHEN COUNT(*) < 6 THEN '❌ MISSING DATA' ELSE '✅ COMPLETE' END FROM essential_growth_pillars
UNION ALL
SELECT 'Essential Growth Activities', COUNT(*), 'Expected: 12', CASE WHEN COUNT(*) < 12 THEN '❌ MISSING DATA' ELSE '✅ COMPLETE' END FROM essential_growth_activities
UNION ALL
SELECT 'Age Groups', COUNT(*), 'Expected: 6', CASE WHEN COUNT(*) < 6 THEN '❌ MISSING DATA' ELSE '✅ COMPLETE' END FROM essential_growth_age_groups
UNION ALL
SELECT 'Sync Log', COUNT(*), 'Expected: 4', CASE WHEN COUNT(*) < 4 THEN '❌ MISSING DATA' ELSE '✅ COMPLETE' END FROM sync_log;

-- 2. Check for missing niche categories
SELECT '=== MISSING NICHE CATEGORIES ===' as section;
SELECT 
    'Missing Categories' as category_name,
    'Need to add' as status
WHERE NOT EXISTS (SELECT 1 FROM niche_categories WHERE category_name IN (
    'Core Academic', 'Creative Arts', 'Technology', 'Life Skills', 
    'Physical & Social', 'Science & Engineering', 'Sustainability & Environment',
    'Health & Wellness', 'Media & Communication'
));

-- 3. Check for missing niches
SELECT '=== MISSING NICHES ===' as section;
SELECT 
    'Missing Niches' as niche_name,
    'Need to add' as status
WHERE NOT EXISTS (SELECT 1 FROM niches WHERE niche_name IN (
    'Finance', 'Communication', 'Mathematics', 'History', 'Civics & Government',
    'Dance', 'Music', 'Arts & Crafts', 'Design Thinking & Creativity',
    'AI & Machine Learning', 'Coding & Programming', 'Robotics', 'Cybersecurity',
    'Entrepreneurship', 'Leadership & Team Building', 'Emotional Intelligence', 'Public Speaking & Debate'
));

-- 4. Check for missing niche topics
SELECT '=== MISSING NICHE TOPICS ===' as section;
SELECT 
    'Missing Topics' as topic_name,
    'Need to add' as status
WHERE NOT EXISTS (SELECT 1 FROM niche_topics WHERE topic_name IN (
    'Understanding Money', 'Counting Coins', 'Saving Money', 'Budgeting Basics', 'Investment Concepts',
    'Speaking Clearly', 'Listening Skills', 'Body Language', 'Presentation Skills',
    'What is AI?', 'Machine Learning Basics', 'AI Ethics',
    'What is an Entrepreneur?', 'Business Ideas', 'Business Planning'
));

-- 5. Check for missing essential growth activities
SELECT '=== MISSING ESSENTIAL GROWTH ACTIVITIES ===' as section;
SELECT 
    'Missing Activities' as activity_name,
    'Need to add' as status
WHERE NOT EXISTS (SELECT 1 FROM essential_growth_activities WHERE activity_name IN (
    'Texture Tray Adventure', 'Color Mixing Magic', 'Story Building Blocks', 'Drama Role Play',
    'Creative Problem Solving', 'Digital Art Creation', 'Memory Matching Game', 'Pattern Recognition',
    'Critical Thinking Puzzles', 'Strategic Planning Game', 'Cooperative Building', 'Group Sports',
    'Leadership Challenges', 'Vocabulary Building', 'Storytelling Circle', 'Debate and Discussion'
));

-- 6. Check for missing sync log entries
SELECT '=== MISSING SYNC LOG ENTRIES ===' as section;
SELECT 
    'Missing Sync Logs' as sync_type,
    'Need to add' as status
WHERE NOT EXISTS (SELECT 1 FROM sync_log WHERE sync_type IN (
    'google_sheets', 'direct_insert'
));

-- 7. Check what data we actually have
SELECT '=== ACTUAL DATA WE HAVE ===' as section;

-- Show current niche categories
SELECT 'Current Niche Categories:' as info;
SELECT category_name FROM niche_categories ORDER BY sort_order;

-- Show current niches
SELECT 'Current Niches:' as info;
SELECT niche_name FROM niches ORDER BY niche_name;

-- Show current niche topics
SELECT 'Current Niche Topics:' as info;
SELECT topic_name FROM niche_topics ORDER BY topic_name;

-- Show current essential growth activities
SELECT 'Current Essential Growth Activities:' as info;
SELECT activity_name FROM essential_growth_activities ORDER BY activity_name;
