-- 🚀 Quick BigQuery Queries for Essential Growth Activities
-- Copy and paste these queries into BigQuery Console: https://console.cloud.google.com/bigquery

-- 📊 Query 1: Overview - Total activities and basic stats
SELECT 
  COUNT(*) as total_activities,
  COUNT(DISTINCT `Pillar`) as pillars,
  COUNT(DISTINCT `Age Group`) as age_groups,
  COUNT(DISTINCT `Difficulty Level`) as difficulty_levels
FROM `unschooling-464413.essential_growth.activities_simple`;

-- 📊 Query 2: Activities by Pillar (with percentages)
SELECT 
  `Pillar`,
  COUNT(*) as activity_count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
FROM `unschooling-464413.essential_growth.activities_simple`
GROUP BY `Pillar`
ORDER BY activity_count DESC;

-- 📊 Query 3: Activities by Age Group
SELECT 
  `Age Group`,
  COUNT(*) as activity_count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
FROM `unschooling-464413.essential_growth.activities_simple`
GROUP BY `Age Group`
ORDER BY `Age Group`;

-- 📊 Query 4: Activities by Difficulty Level
SELECT 
  `Difficulty Level`,
  COUNT(*) as activity_count
FROM `unschooling-464413.essential_growth.activities_simple`
GROUP BY `Difficulty Level`
ORDER BY activity_count DESC;

-- 📊 Query 5: Top 10 Activities by Materials Length
SELECT 
  `Activity ID`,
  `Pillar`,
  `Age Group`,
  `Topic`,
  LENGTH(`Materials`) as materials_length
FROM `unschooling-464413.essential_growth.activities_simple`
ORDER BY materials_length DESC
LIMIT 10;

-- 📊 Query 6: Activities by Time Duration
SELECT 
  `Estimated Time`,
  COUNT(*) as activity_count
FROM `unschooling-464413.essential_growth.activities_simple`
GROUP BY `Estimated Time`
ORDER BY activity_count DESC;

-- 📊 Query 7: Activities by Supervision Level
SELECT 
  `Supervision Level`,
  `Age Group`,
  COUNT(*) as count
FROM `unschooling-464413.essential_growth.activities_simple`
GROUP BY `Supervision Level`, `Age Group`
ORDER BY `Supervision Level`, count DESC;

-- 📊 Query 8: Sample Activities (first 5)
SELECT 
  `Activity ID`,
  `Pillar`,
  `Age Group`,
  `Topic`,
  `Difficulty Level`,
  `Estimated Time`
FROM `unschooling-464413.essential_growth.activities_simple`
ORDER BY `Activity ID`
LIMIT 5;

-- 📊 Query 9: Activities by Category
SELECT 
  `Category`,
  `Pillar`,
  COUNT(*) as count
FROM `unschooling-464413.essential_growth.activities_simple`
GROUP BY `Category`, `Pillar`
ORDER BY count DESC;

-- 📊 Query 10: Complex Analysis - Activities by Pillar and Age Group
SELECT 
  `Pillar`,
  `Age Group`,
  `Difficulty Level`,
  COUNT(*) as activity_count,
  AVG(LENGTH(`Materials`)) as avg_materials_length,
  AVG(LENGTH(`Steps`)) as avg_steps_length
FROM `unschooling-464413.essential_growth.activities_simple`
GROUP BY `Pillar`, `Age Group`, `Difficulty Level`
ORDER BY `Pillar`, `Age Group`, activity_count DESC;

-- 📊 Query 11: Find Beginner Activities for Infants
SELECT 
  `Activity ID`,
  `Topic`,
  `Category`,
  `Estimated Time`,
  `Materials`
FROM `unschooling-464413.essential_growth.activities_simple`
WHERE `Age Group` = 'Infant (0-1)'
  AND `Difficulty Level` = 'Beginner'
ORDER BY `Topic`
LIMIT 10;

-- 📊 Query 12: Activities with Longest Steps
SELECT 
  `Activity ID`,
  `Pillar`,
  `Age Group`,
  `Topic`,
  LENGTH(`Steps`) as steps_length,
  `Steps`
FROM `unschooling-464413.essential_growth.activities_simple`
ORDER BY steps_length DESC
LIMIT 5;

-- 📊 Query 13: Activities by Activity Type
SELECT 
  `Activity Type`,
  COUNT(*) as count
FROM `unschooling-464413.essential_growth.activities_simple`
WHERE `Activity Type` IS NOT NULL
GROUP BY `Activity Type`
ORDER BY count DESC;

-- 📊 Query 14: Search for Specific Skills
SELECT 
  `Activity ID`,
  `Pillar`,
  `Age Group`,
  `Topic`,
  `Skills`
FROM `unschooling-464413.essential_growth.activities_simple`
WHERE `Skills` LIKE '%creativity%'
   OR `Skills` LIKE '%problem%'
   OR `Skills` LIKE '%motor%'
ORDER BY `Pillar`, `Age Group`;

-- 📊 Query 15: Time Analysis - Most Common Durations
SELECT 
  `Estimated Time`,
  COUNT(*) as count,
  ROUND(COUNT(*) * 100.0 / SUM(COUNT(*)) OVER(), 2) as percentage
FROM `unschooling-464413.essential_growth.activities_simple`
GROUP BY `Estimated Time`
ORDER BY count DESC;

-- 📊 Query 16: Materials Analysis - Average Length by Pillar
SELECT 
  `Pillar`,
  COUNT(*) as activity_count,
  AVG(LENGTH(`Materials`)) as avg_materials_length,
  MIN(LENGTH(`Materials`)) as min_materials_length,
  MAX(LENGTH(`Materials`)) as max_materials_length
FROM `unschooling-464413.essential_growth.activities_simple`
GROUP BY `Pillar`
ORDER BY avg_materials_length DESC;

-- 📊 Query 17: Recent Activities (by Last Updated)
SELECT 
  `Activity ID`,
  `Pillar`,
  `Age Group`,
  `Topic`,
  `Last Updated`
FROM `unschooling-464413.essential_growth.activities_simple`
ORDER BY `Last Updated` DESC
LIMIT 10;

-- 📊 Query 18: Activities by Hashtags
SELECT 
  `Hashtags`,
  COUNT(*) as count
FROM `unschooling-464413.essential_growth.activities_simple`
WHERE `Hashtags` IS NOT NULL
GROUP BY `Hashtags`
ORDER BY count DESC
LIMIT 10;

-- 📊 Query 19: Cross-tabulation - Pillar vs Age Group
SELECT 
  `Pillar`,
  SUM(CASE WHEN `Age Group` = 'Infant (0-1)' THEN 1 ELSE 0 END) as Infant,
  SUM(CASE WHEN `Age Group` = 'Toddler (1-3)' THEN 1 ELSE 0 END) as Toddler,
  SUM(CASE WHEN `Age Group` = 'Preschooler (3-5)' THEN 1 ELSE 0 END) as Preschooler,
  SUM(CASE WHEN `Age Group` = 'Child (6-8)' THEN 1 ELSE 0 END) as Child,
  SUM(CASE WHEN `Age Group` = 'Pre-Teen (9-12)' THEN 1 ELSE 0 END) as PreTeen,
  SUM(CASE WHEN `Age Group` = 'Teen (13-18)' THEN 1 ELSE 0 END) as Teen
FROM `unschooling-464413.essential_growth.activities_simple`
GROUP BY `Pillar`
ORDER BY `Pillar`;

-- 📊 Query 20: Summary Statistics
SELECT 
  'Total Activities' as metric,
  COUNT(*) as value
FROM `unschooling-464413.essential_growth.activities_simple`
UNION ALL
SELECT 
  'Average Materials Length',
  ROUND(AVG(LENGTH(`Materials`)), 2)
FROM `unschooling-464413.essential_growth.activities_simple`
UNION ALL
SELECT 
  'Average Steps Length',
  ROUND(AVG(LENGTH(`Steps`)), 2)
FROM `unschooling-464413.essential_growth.activities_simple`
UNION ALL
SELECT 
  'Most Common Time',
  (SELECT `Estimated Time` 
   FROM `unschooling-464413.essential_growth.activities_simple`
   GROUP BY `Estimated Time`
   ORDER BY COUNT(*) DESC
   LIMIT 1)
FROM `unschooling-464413.essential_growth.activities_simple`
LIMIT 1;
