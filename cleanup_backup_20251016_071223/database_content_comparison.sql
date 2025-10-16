-- DATABASE CONTENT COMPARISON
-- Shows exactly what's CURRENTLY in your database vs what's MISSING

-- 1. CURRENT NICHE CATEGORIES (What you have now)
SELECT '=== CURRENT NICHE CATEGORIES IN DATABASE ===' as section;
SELECT 
    category_name,
    color_code,
    icon_name,
    description
FROM niche_categories
ORDER BY sort_order;

-- 2. CURRENT NICHES (What you have now)
SELECT '=== CURRENT NICHES IN DATABASE ===' as section;
SELECT 
    n.niche_name,
    nc.category_name,
    n.hero_tagline,
    n.color_code
FROM niches n
LEFT JOIN niche_categories nc ON n.category_id = nc.id
ORDER BY n.niche_name;

-- 3. CURRENT NICHE TOPICS (What you have now)
SELECT '=== CURRENT NICHE TOPICS IN DATABASE ===' as section;
SELECT 
    nt.topic_name,
    n.niche_name,
    nt.age,
    nt.estimated_time,
    nt.objective
FROM niche_topics nt
LEFT JOIN niches n ON nt.niche_id = n.id
ORDER BY n.niche_name, nt.topic_number;

-- 4. CURRENT ESSENTIAL GROWTH ACTIVITIES (What you have now)
SELECT '=== CURRENT ESSENTIAL GROWTH ACTIVITIES IN DATABASE ===' as section;
SELECT 
    ea.activity_name,
    ep.pillar_name,
    ea.age_group,
    ea.validation_score,
    ea.objective
FROM essential_growth_activities ea
LEFT JOIN essential_growth_pillars ep ON ea.pillar_id = ep.id
ORDER BY ep.pillar_name, ea.topic_number;

-- 5. WHAT'S MISSING - NICHE CATEGORIES
SELECT '=== MISSING NICHE CATEGORIES ===' as section;
SELECT 
    'Science & Engineering' as missing_category,
    'Scientific exploration and engineering' as description,
    '#EF4444' as color_code,
    'flask' as icon_name
UNION ALL
SELECT 
    'Sustainability & Environment',
    'Environmental awareness and sustainability',
    '#22C55E',
    'leaf'
UNION ALL
SELECT 
    'Health & Wellness',
    'Physical and mental health',
    '#F97316',
    'heart'
UNION ALL
SELECT 
    'Media & Communication',
    'Communication and media skills',
    '#6366F1',
    'megaphone';

-- 6. WHAT'S MISSING - NICHES
SELECT '=== MISSING NICHES ===' as section;
SELECT 
    'Communication' as missing_niche,
    'Core Academic' as category,
    'Express yourself clearly and confidently' as tagline
UNION ALL
SELECT 'Mathematics', 'Core Academic', 'Make numbers your friend'
UNION ALL
SELECT 'History', 'Core Academic', 'Discover the stories of our past'
UNION ALL
SELECT 'Civics & Government', 'Core Academic', 'Understand how society works'
UNION ALL
SELECT 'Music', 'Creative Arts', 'Create harmony in your world'
UNION ALL
SELECT 'Arts & Crafts', 'Creative Arts', 'Create beauty with your hands'
UNION ALL
SELECT 'Design Thinking & Creativity', 'Creative Arts', 'Think outside the box'
UNION ALL
SELECT 'Coding & Programming', 'Technology', 'Build the digital world'
UNION ALL
SELECT 'Robotics', 'Technology', 'Bring machines to life'
UNION ALL
SELECT 'Cybersecurity', 'Technology', 'Protect the digital world'
UNION ALL
SELECT 'Entrepreneurship', 'Life Skills', 'Turn ideas into reality'
UNION ALL
SELECT 'Leadership & Team Building', 'Life Skills', 'Lead with confidence and empathy'
UNION ALL
SELECT 'Emotional Intelligence', 'Life Skills', 'Understand and manage emotions'
UNION ALL
SELECT 'Public Speaking & Debate', 'Life Skills', 'Speak with confidence and clarity';

-- 7. WHAT'S MISSING - NICHE TOPICS
SELECT '=== MISSING NICHE TOPICS ===' as section;
SELECT 
    'Counting Coins' as missing_topic,
    'Finance' as niche,
    4 as age,
    '25 mins' as time,
    'To learn to count different coin values' as objective
UNION ALL
SELECT 'Saving Money', 'Finance', 5, '30 mins', 'To understand the concept of saving'
UNION ALL
SELECT 'Budgeting Basics', 'Finance', 8, '45 mins', 'To learn how to plan spending'
UNION ALL
SELECT 'Investment Concepts', 'Finance', 12, '60 mins', 'To introduce basic investment principles'
UNION ALL
SELECT 'Speaking Clearly', 'Communication', 3, '15 mins', 'To develop clear speech patterns'
UNION ALL
SELECT 'Listening Skills', 'Communication', 4, '20 mins', 'To improve active listening abilities'
UNION ALL
SELECT 'Body Language', 'Communication', 6, '30 mins', 'To understand non-verbal communication'
UNION ALL
SELECT 'Presentation Skills', 'Communication', 10, '60 mins', 'To deliver effective presentations'
UNION ALL
SELECT 'Machine Learning Basics', 'AI', 8, '45 mins', 'To understand how machines learn'
UNION ALL
SELECT 'AI Ethics', 'AI', 12, '60 mins', 'To understand the ethics of AI'
UNION ALL
SELECT 'What is an Entrepreneur?', 'Entrepreneurship', 5, '25 mins', 'To understand entrepreneurship basics'
UNION ALL
SELECT 'Business Ideas', 'Entrepreneurship', 7, '40 mins', 'To generate creative business ideas'
UNION ALL
SELECT 'Business Planning', 'Entrepreneurship', 10, '90 mins', 'To create a simple business plan';

-- 8. WHAT'S MISSING - ESSENTIAL GROWTH ACTIVITIES
SELECT '=== MISSING ESSENTIAL GROWTH ACTIVITIES ===' as section;
SELECT 
    'Color Mixing Magic' as missing_activity,
    'Play & Creativity' as pillar,
    'Toddler (1-3)' as age_group,
    88 as validation_score,
    'Explore color theory through hands-on experimentation' as objective
UNION ALL
SELECT 'Story Building Blocks', 'Play & Creativity', 'Preschooler (3-5)', 92, 'Develop narrative skills through creative storytelling'
UNION ALL
SELECT 'Drama Role Play', 'Play & Creativity', 'Child (6-8)', 90, 'Express emotions and situations through dramatic play'
UNION ALL
SELECT 'Creative Problem Solving', 'Play & Creativity', 'Pre-Teen (9-12)', 94, 'Use creative thinking to solve real-world challenges'
UNION ALL
SELECT 'Digital Art Creation', 'Play & Creativity', 'Teen (13-18)', 87, 'Express creativity through digital media'
UNION ALL
SELECT 'Memory Matching Game', 'Cognitive Skills', 'Toddler (1-3)', 89, 'Improve memory and concentration through matching activities'
UNION ALL
SELECT 'Pattern Recognition', 'Cognitive Skills', 'Preschooler (3-5)', 91, 'Develop logical thinking through pattern identification'
UNION ALL
SELECT 'Critical Thinking Puzzles', 'Cognitive Skills', 'Child (6-8)', 93, 'Enhance analytical thinking through problem-solving'
UNION ALL
SELECT 'Strategic Planning Game', 'Cognitive Skills', 'Pre-Teen (9-12)', 96, 'Develop strategic thinking through planning games'
UNION ALL
SELECT 'Cooperative Building', 'Physical & Social Play', 'Preschooler (3-5)', 88, 'Build teamwork skills through collaborative construction'
UNION ALL
SELECT 'Group Sports', 'Physical & Social Play', 'Child (6-8)', 90, 'Develop physical fitness and social skills through team sports'
UNION ALL
SELECT 'Leadership Challenges', 'Physical & Social Play', 'Pre-Teen (9-12)', 92, 'Practice leadership skills through group activities'
UNION ALL
SELECT 'Vocabulary Building', 'Language & Speech', 'Toddler (1-3)', 87, 'Expand vocabulary through interactive word games'
UNION ALL
SELECT 'Storytelling Circle', 'Language & Speech', 'Preschooler (3-5)', 89, 'Improve verbal communication through storytelling'
UNION ALL
SELECT 'Debate and Discussion', 'Language & Speech', 'Pre-Teen (9-12)', 94, 'Develop persuasive speaking and critical thinking';

-- 9. SUMMARY COMPARISON
SELECT '=== SUMMARY: CURRENT vs MISSING ===' as section;
SELECT 
    'Niche Categories' as data_type,
    (SELECT COUNT(*) FROM niche_categories) as current_count,
    9 as expected_count,
    (9 - (SELECT COUNT(*) FROM niche_categories)) as missing_count
UNION ALL
SELECT 
    'Niches',
    (SELECT COUNT(*) FROM niches),
    17,
    (17 - (SELECT COUNT(*) FROM niches))
UNION ALL
SELECT 
    'Niche Topics',
    (SELECT COUNT(*) FROM niche_topics),
    13,
    (13 - (SELECT COUNT(*) FROM niche_topics))
UNION ALL
SELECT 
    'Essential Growth Activities',
    (SELECT COUNT(*) FROM essential_growth_activities),
    12,
    (12 - (SELECT COUNT(*) FROM essential_growth_activities));
