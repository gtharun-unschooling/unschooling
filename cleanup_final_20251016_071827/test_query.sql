-- Test query to verify database setup
SELECT 
    'Niche Categories' as table_name, COUNT(*) as record_count
FROM niche_categories
UNION ALL
SELECT 
    'Niches' as table_name, COUNT(*) as record_count
FROM niches
UNION ALL
SELECT 
    'Niche Topics' as table_name, COUNT(*) as record_count
FROM niche_topics
UNION ALL
SELECT 
    'Essential Growth Pillars' as table_name, COUNT(*) as record_count
FROM essential_growth_pillars
UNION ALL
SELECT 
    'Essential Growth Activities' as table_name, COUNT(*) as record_count
FROM essential_growth_activities
ORDER BY table_name;
