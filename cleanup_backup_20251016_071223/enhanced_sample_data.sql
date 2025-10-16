-- Enhanced Sample Data Based on Real JSON Content
-- This adds more realistic data based on your actual content structure

-- First, let's add more niche categories based on your real data
INSERT INTO niche_categories (category_name, color_code, icon_name, description, sort_order) VALUES
('Core Academic', '#3B82F6', 'graduation-cap', 'Fundamental academic subjects and skills', 1),
('Creative Arts', '#EC4899', 'paint-palette', 'Artistic expression and creative skills', 2),
('Technology', '#8B5CF6', 'cpu', 'Digital skills and technology literacy', 3),
('Life Skills', '#10B981', 'user-circle', 'Essential life and social skills', 4),
('Physical & Social', '#F59E0B', 'users', 'Physical activities and social interaction', 5),
('Science & Engineering', '#EF4444', 'flask', 'Scientific exploration and engineering', 6),
('Sustainability & Environment', '#22C55E', 'leaf', 'Environmental awareness and sustainability', 7),
('Health & Wellness', '#F97316', 'heart', 'Physical and mental health', 8),
('Media & Communication', '#6366F1', 'megaphone', 'Communication and media skills', 9);

-- Add more niches based on your real data
INSERT INTO niches (niche_name, niche_slug, category_id, hero_tagline, description, color_code, icon_name, sort_order) VALUES
-- Core Academic
('Finance', 'finance', 1, 'Master money management from age 3', 'Learn financial literacy through age-appropriate activities', '#059669', 'coins', 1),
('Communication', 'communication', 1, 'Express yourself clearly and confidently', 'Develop effective communication skills', '#DC2626', 'message-circle', 2),
('Mathematics', 'mathematics', 1, 'Make numbers your friend', 'Build strong mathematical foundations', '#7C3AED', 'calculator', 3),
('History', 'history', 1, 'Discover the stories of our past', 'Explore historical events and cultures', '#B45309', 'book-open', 4),
('Civics & Government', 'civics-government', 1, 'Understand how society works', 'Learn about civic responsibility and governance', '#1D4ED8', 'building', 5),

-- Creative Arts
('Dance', 'dance', 2, 'Move to the rhythm of life', 'Express yourself through movement and dance', '#EC4899', 'music', 6),
('Music', 'music', 2, 'Create harmony in your world', 'Develop musical skills and appreciation', '#F59E0B', 'headphones', 7),
('Arts & Crafts', 'arts-crafts', 2, 'Create beauty with your hands', 'Explore artistic expression through crafts', '#EF4444', 'palette', 8),
('Design Thinking & Creativity', 'design-thinking-creativity', 2, 'Think outside the box', 'Develop creative problem-solving skills', '#8B5CF6', 'lightbulb', 9),

-- Technology
('AI & Machine Learning', 'ai', 3, 'Shape the future with artificial intelligence', 'Learn about AI and its applications', '#6366F1', 'brain', 10),
('Coding & Programming', 'coding-programming', 3, 'Build the digital world', 'Master programming fundamentals', '#059669', 'code', 11),
('Robotics', 'robotics', 3, 'Bring machines to life', 'Design and program robots', '#DC2626', 'robot', 12),
('Cybersecurity', 'cybersecurity', 3, 'Protect the digital world', 'Learn to keep information safe', '#B45309', 'shield', 13),

-- Life Skills
('Entrepreneurship', 'entrepreneurship', 4, 'Turn ideas into reality', 'Develop entrepreneurial mindset and skills', '#10B981', 'rocket', 14),
('Leadership & Team Building', 'leadership-team-building', 4, 'Lead with confidence and empathy', 'Build leadership and collaboration skills', '#3B82F6', 'users', 15),
('Emotional Intelligence', 'emotional-intelligence', 4, 'Understand and manage emotions', 'Develop emotional awareness and regulation', '#EC4899', 'heart', 16),
('Public Speaking & Debate', 'public-speaking-debate', 4, 'Speak with confidence and clarity', 'Master the art of public speaking', '#F59E0B', 'mic', 17);

-- Add more niche topics based on real data structure
INSERT INTO niche_topics (topic_name, niche_id, topic_number, objective, explanation, age, estimated_time, difficulty_level, materials_needed, learning_outcomes) VALUES
-- Finance topics (ages 3-18)
('Understanding Money', 1, 1, 'To introduce the concept of money and its purpose', 'Money is a tool we use to exchange goods and services. It has different forms, such as coins and bills. Each coin and bill has a specific value.', 3, '20 mins', 'Beginner', 'Play money, sorting trays', 'Visual classification, Basic counting, Early money-handling skills'),
('Counting Coins', 1, 2, 'To learn to count different coin values', 'Practice counting coins of different denominations to understand their values and relationships.', 4, '25 mins', 'Beginner', 'Real coins, counting mats', 'Number recognition, Basic arithmetic, Money values'),
('Saving Money', 1, 3, 'To understand the concept of saving', 'Learn why saving money is important and how to start saving for goals.', 5, '30 mins', 'Beginner', 'Piggy bank, savings chart', 'Goal setting, Delayed gratification, Financial planning'),
('Budgeting Basics', 1, 4, 'To learn how to plan spending', 'Understand the difference between needs and wants, and how to budget money.', 8, '45 mins', 'Intermediate', 'Budget worksheet, play money', 'Planning skills, Decision making, Financial responsibility'),
('Investment Concepts', 1, 5, 'To introduce basic investment principles', 'Learn about different types of investments and how money can grow over time.', 12, '60 mins', 'Advanced', 'Investment simulation game', 'Long-term thinking, Risk assessment, Financial growth'),

-- Communication topics
('Speaking Clearly', 2, 1, 'To develop clear speech patterns', 'Practice speaking clearly and confidently in different situations.', 3, '15 mins', 'Beginner', 'Mirror, picture cards', 'Articulation, Confidence, Self-expression'),
('Listening Skills', 2, 2, 'To improve active listening abilities', 'Learn to listen carefully and respond appropriately to others.', 4, '20 mins', 'Beginner', 'Story books, listening games', 'Attention, Comprehension, Social skills'),
('Body Language', 2, 3, 'To understand non-verbal communication', 'Learn how body language affects communication and how to use it effectively.', 6, '30 mins', 'Intermediate', 'Role-play scenarios', 'Non-verbal awareness, Social cues, Confidence'),
('Presentation Skills', 2, 4, 'To deliver effective presentations', 'Master the art of presenting information clearly and engagingly.', 10, '60 mins', 'Advanced', 'Presentation materials', 'Public speaking, Organization, Confidence'),

-- AI topics
('What is AI?', 10, 1, 'To understand artificial intelligence basics', 'Learn what artificial intelligence is and how it affects our daily lives.', 6, '30 mins', 'Beginner', 'AI examples, simple explanations', 'Technology awareness, Critical thinking, Future readiness'),
('Machine Learning Basics', 10, 2, 'To understand how machines learn', 'Explore how computers can learn from data and make predictions.', 8, '45 mins', 'Intermediate', 'Data examples, simple algorithms', 'Pattern recognition, Problem solving, Technology literacy'),
('AI Ethics', 10, 3, 'To understand the ethics of AI', 'Discuss the responsible use of artificial intelligence and its impact on society.', 12, '60 mins', 'Advanced', 'Ethics scenarios, discussion guides', 'Ethical thinking, Social responsibility, Critical analysis'),

-- Entrepreneurship topics
('What is an Entrepreneur?', 14, 1, 'To understand entrepreneurship basics', 'Learn what entrepreneurs do and how they solve problems in the world.', 5, '25 mins', 'Beginner', 'Entrepreneur stories, simple examples', 'Problem identification, Innovation mindset, Goal setting'),
('Business Ideas', 14, 2, 'To generate creative business ideas', 'Practice brainstorming and evaluating business opportunities.', 7, '40 mins', 'Intermediate', 'Idea generation tools, market research', 'Creativity, Market awareness, Critical thinking'),
('Business Planning', 14, 3, 'To create a simple business plan', 'Learn the basic components of a business plan and how to create one.', 10, '90 mins', 'Advanced', 'Business plan template, market research', 'Planning, Analysis, Strategic thinking');

-- Add more essential growth activities based on real data
INSERT INTO essential_growth_activities (activity_id, activity_name, pillar_id, topic_number, objective, explanation, age_group, estimated_time, difficulty_level, materials_needed, learning_outcomes, validation_score, created_at, updated_at) VALUES
-- Play & Creativity activities
('PC001', 'Texture Tray Adventure', 1, 1, 'Stimulate tactile senses through safe material exploration', 'Provide a tray with different safe materials (e.g., silk, sponge). Baby explores textures with hands.', 'Infant (0-1)', '10-15 min', 'Beginner', 'Safe textured materials, tray, activity kit', 'Tactile exploration, Sensory awareness, Hand-eye coordination', 95, NOW(), NOW()),
('PC002', 'Color Mixing Magic', 1, 2, 'Explore color theory through hands-on experimentation', 'Mix primary colors to create secondary colors and observe the changes.', 'Toddler (1-3)', '20-25 min', 'Beginner', 'Primary color paints, mixing containers, paper', 'Color recognition, Cause and effect, Fine motor skills', 88, NOW(), NOW()),
('PC003', 'Story Building Blocks', 1, 3, 'Develop narrative skills through creative storytelling', 'Use picture cards and props to create and tell original stories.', 'Preschooler (3-5)', '30-35 min', 'Intermediate', 'Picture cards, story props, recording device', 'Imagination, Language development, Sequencing', 92, NOW(), NOW()),
('PC004', 'Drama Role Play', 1, 4, 'Express emotions and situations through dramatic play', 'Act out different scenarios and emotions to develop empathy and communication.', 'Child (6-8)', '45-50 min', 'Intermediate', 'Costumes, props, scenario cards', 'Empathy, Communication, Emotional expression', 90, NOW(), NOW()),
('PC005', 'Creative Problem Solving', 1, 5, 'Use creative thinking to solve real-world challenges', 'Present open-ended problems and brainstorm creative solutions.', 'Pre-Teen (9-12)', '60-75 min', 'Advanced', 'Problem cards, brainstorming tools, presentation materials', 'Critical thinking, Innovation, Collaboration', 94, NOW(), NOW()),
('PC006', 'Digital Art Creation', 1, 6, 'Express creativity through digital media', 'Create digital artwork using various software tools and techniques.', 'Teen (13-18)', '90-120 min', 'Advanced', 'Digital art software, tablet/stylus, tutorials', 'Digital literacy, Artistic expression, Technical skills', 87, NOW(), NOW()),

-- Cognitive Skills activities
('CS001', 'Memory Matching Game', 2, 1, 'Improve memory and concentration through matching activities', 'Play memory games with cards or objects to enhance recall abilities.', 'Toddler (1-3)', '15-20 min', 'Beginner', 'Memory cards, matching objects', 'Memory, Concentration, Visual recognition', 89, NOW(), NOW()),
('CS002', 'Pattern Recognition', 2, 2, 'Develop logical thinking through pattern identification', 'Identify and complete patterns using shapes, colors, or numbers.', 'Preschooler (3-5)', '25-30 min', 'Beginner', 'Pattern cards, shape blocks, number tiles', 'Logic, Pattern recognition, Sequencing', 91, NOW(), NOW()),
('CS003', 'Critical Thinking Puzzles', 2, 3, 'Enhance analytical thinking through problem-solving', 'Solve puzzles and brain teasers that require logical reasoning.', 'Child (6-8)', '40-45 min', 'Intermediate', 'Puzzle books, brain teasers, logic games', 'Analysis, Reasoning, Persistence', 93, NOW(), NOW()),
('CS004', 'Strategic Planning Game', 2, 4, 'Develop strategic thinking through planning games', 'Play strategy games that require planning and foresight.', 'Pre-Teen (9-12)', '60-90 min', 'Advanced', 'Strategy board games, planning worksheets', 'Strategic thinking, Planning, Decision making', 96, NOW(), NOW()),

-- Physical & Social Play activities
('PS001', 'Cooperative Building', 3, 1, 'Build teamwork skills through collaborative construction', 'Work together to build structures using blocks or other materials.', 'Preschooler (3-5)', '30-35 min', 'Beginner', 'Building blocks, construction materials', 'Teamwork, Communication, Spatial skills', 88, NOW(), NOW()),
('PS002', 'Group Sports', 3, 2, 'Develop physical fitness and social skills through team sports', 'Participate in age-appropriate team sports and games.', 'Child (6-8)', '45-60 min', 'Intermediate', 'Sports equipment, playing field', 'Physical fitness, Teamwork, Sportsmanship', 90, NOW(), NOW()),
('PS003', 'Leadership Challenges', 3, 3, 'Practice leadership skills through group activities', 'Take turns leading group activities and making decisions.', 'Pre-Teen (9-12)', '60-75 min', 'Advanced', 'Leadership scenarios, group activities', 'Leadership, Decision making, Communication', 92, NOW(), NOW()),

-- Language & Speech activities
('LS001', 'Vocabulary Building', 4, 1, 'Expand vocabulary through interactive word games', 'Learn new words through games, stories, and conversations.', 'Toddler (1-3)', '20-25 min', 'Beginner', 'Picture books, word cards, games', 'Vocabulary, Language development, Communication', 87, NOW(), NOW()),
('LS002', 'Storytelling Circle', 4, 2, 'Improve verbal communication through storytelling', 'Share stories and practice speaking clearly and expressively.', 'Preschooler (3-5)', '30-35 min', 'Beginner', 'Story prompts, props, recording device', 'Verbal communication, Imagination, Confidence', 89, NOW(), NOW()),
('LS003', 'Debate and Discussion', 4, 3, 'Develop persuasive speaking and critical thinking', 'Participate in age-appropriate debates and discussions.', 'Pre-Teen (9-12)', '60-75 min', 'Advanced', 'Debate topics, research materials', 'Persuasion, Critical thinking, Public speaking', 94, NOW(), NOW());

-- Add sync log entries to show data management
INSERT INTO sync_log (sync_type, source, target, records_processed, success_count, error_count, sync_duration_ms, sync_status, error_details, created_at) VALUES
('google_sheets', 'Google Sheets - Niche Topics', 'PostgreSQL - niche_topics', 45, 42, 3, 2500, 'completed_with_errors', '3 records had missing age values', NOW()),
('google_sheets', 'Google Sheets - Essential Growth', 'PostgreSQL - essential_growth_activities', 18, 18, 0, 1800, 'completed', NULL, NOW()),
('direct_insert', 'Admin Panel', 'PostgreSQL - niches', 17, 17, 0, 500, 'completed', NULL, NOW()),
('google_sheets', 'Google Sheets - Categories', 'PostgreSQL - niche_categories', 9, 9, 0, 800, 'completed', NULL, NOW());
