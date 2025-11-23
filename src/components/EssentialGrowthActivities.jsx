import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, Grid, Chip, Button,
  Container, Avatar, Badge, Fade, Zoom, Paper, Divider, Slider
} from '@mui/material';
import { AccessTime } from '@mui/icons-material';
import SimpleBackButton from './ui/SimpleBackButton';

// Category color palette (vibrant, distinct colors)
const CATEGORY_COLORS = [
  '#667eea', // Purple
  '#f093fb', // Pink
  '#4facfe', // Blue
  '#43e97b', // Green
  '#fa709a', // Rose
  '#30cfd0', // Cyan
  '#ff9a9e', // Coral
  '#ffecd2', // Peach
  '#a8edea', // Aqua
  '#fed6e3', // Light Pink
  '#fcb69f', // Orange
  '#ffeaa7', // Yellow
  '#74b9ff', // Sky Blue
  '#a29bfe', // Lavender
  '#55efc4', // Mint
  '#fd79a8', // Hot Pink
  '#fdcb6e', // Gold
  '#6c5ce7', // Violet
  '#e17055', // Terracotta
  '#00b894', // Emerald
];

// Pillar configuration
const PILLAR_CONFIG = {
  'play-creativity': {
    name: 'Play & Creativity',
    color: '#667eea',
    description: 'Explore creative activities designed to spark imagination and innovation'
  },
  'cognitive-skills': {
    name: 'Cognitive Skills',
    color: '#f093fb',
    description: 'Develop thinking, learning, and problem-solving abilities'
  },
  'physical-social-play': {
    name: 'Physical & Social Play',
    color: '#4facfe',
    description: 'Build physical fitness and social interaction skills'
  },
  'language-speech': {
    name: 'Language & Speech',
    color: '#43e97b',
    description: 'Enhance communication and language development'
  },
  'learning-tools': {
    name: 'Learning Tools',
    color: '#fa709a',
    description: 'Master essential tools and techniques for learning'
  },
  'nature-exploration': {
    name: 'Nature & Exploration',
    color: '#30cfd0',
    description: 'Discover the natural world through hands-on exploration'
  },
  'mindfulness-wellbeing': {
    name: 'Mindfulness & Well-being',
    color: '#a8edea',
    description: 'Cultivate inner peace and emotional balance'
  },
  'music-rhythm': {
    name: 'Music & Rhythm',
    color: '#fed6e3',
    description: 'Express through music and develop rhythmic awareness'
  },
  'visual-arts': {
    name: 'Visual Arts',
    color: '#ff9a9e',
    description: 'Create and appreciate visual forms of expression'
  },
  'science-innovation': {
    name: 'Science & Innovation',
    color: '#ffecd2',
    description: 'Explore scientific concepts through experimentation'
  },
  'emotional-intelligence': {
    name: 'Emotional Intelligence',
    color: '#fcb69f',
    description: 'Understand and manage emotions effectively'
  },
  'cultural-awareness': {
    name: 'Cultural Awareness',
    color: '#ffeaa7',
    description: 'Appreciate diversity and cultural richness'
  },
  'teamwork-leadership': {
    name: 'Teamwork & Leadership',
    color: '#74b9ff',
    description: 'Develop collaboration and leadership skills'
  },
  'problem-solving-logic': {
    name: 'Problem Solving & Logic',
    color: '#a29bfe',
    description: 'Strengthen logical thinking and problem-solving abilities'
  },
  'health-fitness': {
    name: 'Health & Fitness',
    color: '#55efc4',
    description: 'Build healthy habits and physical wellness'
  },
  'social-skills': {
    name: 'Social Skills',
    color: '#fd79a8',
    description: 'Navigate social situations with confidence'
  },
  'fine-motor-skills': {
    name: 'Fine Motor Skills',
    color: '#fdcb6e',
    description: 'Develop precision and hand-eye coordination'
  },
  'memory-recall': {
    name: 'Memory & Recall',
    color: '#6c5ce7',
    description: 'Enhance memory and information retention'
  }
};

const EssentialGrowthActivities = () => {
  const navigate = useNavigate();
  const { pillarSlug } = useParams(); // Get pillar from URL
  
  const [activitiesData, setActivitiesData] = useState(null);
  const [pillarConfig, setPillarConfig] = useState(null);
  const [selectedAge, setSelectedAge] = useState(6); // Default age 6
  const [loading, setLoading] = useState(true);
  
  // Map numeric age to age group
  const getAgeGroupFromAge = (age) => {
    if (age <= 1) return 'Infant (0-1)';
    if (age <= 3) return 'Toddler (1-3)';
    if (age <= 5) return 'Preschooler (3-5)';
    if (age <= 8) return 'Child (6-8)';
    if (age <= 12) return 'Pre-Teen (9-12)';
    return 'Teen (13-18)';
  };
  
  const selectedAgeGroup = getAgeGroupFromAge(selectedAge);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        
        // Load pillar config
        const configResponse = await fetch('/data/essential-growth-config.json');
        const configData = await configResponse.json();
        const pillar = configData.pillars.find(p => p.slug === pillarSlug);
        
        if (pillar) {
          setPillarConfig(pillar);
          console.log(`✅ Loaded ${pillarSlug} config:`, pillar);
        } else {
          // Fallback to default
          setPillarConfig({
            name: 'Essential Growth',
            color: '#667eea',
            primaryColor: '#667eea',
            description: 'Explore essential growth activities'
          });
        }
        
        // Load activities
        const activitiesResponse = await fetch(`/data/essential-growth/${pillarSlug}/activities.json`);
        const activitiesData = await activitiesResponse.json();
        setActivitiesData(activitiesData);
        console.log(`✅ Loaded ${pillarSlug} activities:`, activitiesData);
        
      } catch (error) {
        console.error(`❌ Error loading ${pillarSlug} data:`, error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [pillarSlug]);

  const handleActivityClick = (activity, category, ageGroup) => {
    console.log('Activity clicked:', { activity, category, ageGroup });
    // Create clean slug from activity name (using Niche method: simple and consistent)
    const activityName = activity.topic || activity.activity?.name || 'activity';
    const activitySlug = activityName.toLowerCase().replace(/\s+/g, '-');
    navigate(`/essential-growth/${pillarSlug}/${activitySlug}`);
  };

  const handleBackClick = () => {
    navigate('/essential-growth');
  };

  if (loading || !pillarConfig) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography variant="h5">Loading...</Typography>
      </Box>
    );
  }

  if (!activitiesData) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Typography variant="h5">No activities found</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: `linear-gradient(135deg, ${pillarConfig.primaryColor} 0%, ${pillarConfig.secondaryColor} 100%)`,
      py: 4
    }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Fade in timeout={800}>
          <Box mb={4}>
            <SimpleBackButton 
              onClick={handleBackClick}
              size="medium"
            />
            
            <Typography variant="h2" sx={{ 
              fontWeight: '900', 
              color: 'white', 
              mb: 2,
              fontSize: '4.5rem',
              textShadow: '0 4px 20px rgba(0,0,0,0.3)',
              letterSpacing: '-0.02em',
              textAlign: 'center'
            }}>
              {pillarConfig.name}
            </Typography>
            
            <Typography variant="h5" sx={{ 
              color: 'rgba(255,255,255,0.95)', 
              fontWeight: '500',
              maxWidth: '900px',
              textAlign: 'center',
              margin: '0 auto',
              fontSize: '1.5rem',
              lineHeight: '1.6'
            }}>
              {pillarConfig.description}
            </Typography>
          </Box>
        </Fade>

        {/* Age Selector */}
        <Fade in timeout={1000}>
          <Box mb={4} sx={{ 
            background: 'white',
            borderRadius: '12px',
            padding: '1.25rem',
            boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
            maxWidth: '600px',
            margin: '0 auto 2rem auto'
          }}>
            <Typography variant="h6" gutterBottom sx={{ 
              fontWeight: '600',
              color: '#1f2937',
              mb: 2,
              fontSize: '1.1rem'
            }}>
              Select Your Child's Age
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 2 }}>
              <Avatar sx={{ 
                bgcolor: pillarConfig.primaryColor,
                width: 42, 
                height: 42,
                fontSize: '1.1rem',
                fontWeight: '700'
              }}>
                {selectedAge}
              </Avatar>
              
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" sx={{ 
                  color: '#6b7280',
                  mb: 0.5,
                  fontWeight: '500',
                  fontSize: '0.9rem'
                }}>
                  Age Group: <span style={{ 
                    color: pillarConfig.primaryColor, 
                    fontWeight: '700' 
                  }}>{selectedAgeGroup}</span>
                </Typography>
                
                <Slider
                  value={selectedAge}
                  onChange={(e, newValue) => setSelectedAge(newValue)}
                  min={0}
                  max={18}
                  step={1}
                  marks={[
                    { value: 0, label: '0' },
                    { value: 6, label: '6' },
                    { value: 12, label: '12' },
                    { value: 18, label: '18' }
                  ]}
                  valueLabelDisplay="auto"
                  sx={{
                    color: pillarConfig.primaryColor,
                    '& .MuiSlider-thumb': {
                      width: 24,
                      height: 24,
                      backgroundColor: pillarConfig.primaryColor,
                    },
                    '& .MuiSlider-track': {
                      height: 8,
                      backgroundColor: pillarConfig.primaryColor,
                    },
                    '& .MuiSlider-rail': {
                      height: 8,
                      opacity: 0.3,
                      backgroundColor: pillarConfig.primaryColor,
                    }
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Fade>
      </Container>

      {/* Activities List - With Padding */}
      <Box sx={{ px: { xs: 2, sm: 3, md: 4 } }}>
        <Fade in timeout={1200}>
          <Box sx={{
            background: 'transparent',
            padding: '0'
          }}>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, width: '100%' }}>
              {(() => {
                // Handle "All Ages" structure - filter and group by actual age
                const allAgesGroup = activitiesData.ageGroups.find(g => g.ageGroup === 'All Ages');
                
                if (allAgesGroup) {
                  // Get all activities from the single category
                  const allActivities = allAgesGroup.categories[0]?.activities || [];
                  
                  // Extract age group keyword for matching
                  const ageKeyword = selectedAgeGroup.split(' ')[0];
                  
                  // Filter by selected age group (robust matching)
                  const filteredActivities = allActivities.filter(act => {
                    if (!act.age) return false;
                    // Remove emojis and compare
                    const cleanAge = act.age.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim();
                    return cleanAge.includes(ageKeyword);
                  });
                  
                  console.log(`🔍 Filtered ${filteredActivities.length} activities for ${selectedAgeGroup}`);
                  
                  // Group by category field
                  const grouped = {};
                  filteredActivities.forEach(act => {
                    const cat = act.category || pillarConfig.name;
                    if (!grouped[cat]) {
                      grouped[cat] = [];
                    }
                    grouped[cat].push(act);
                  });
                  
                  console.log(`📊 Grouped into ${Object.keys(grouped).length} categories:`, Object.keys(grouped));
                  
                  return Object.entries(grouped).map(([categoryName, activities], categoryIndex) => {
                    // Get unique color for this category
                    const categoryColor = CATEGORY_COLORS[categoryIndex % CATEGORY_COLORS.length];
                    
                    return (
                    <Box key={categoryIndex} sx={{ width: '100%' }}>
                      <Box sx={{
                        background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
                        borderRadius: '16px',
                        padding: { xs: '1.5rem', sm: '2rem', md: '3rem' },
                        border: '2px solid #e5e7eb',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                        width: '100%'
                      }}>
                        {/* Category Header */}
                        <Box sx={{
                          background: `linear-gradient(135deg, ${categoryColor} 0%, ${categoryColor}dd 100%)`,
                          borderRadius: '12px',
                          padding: '1.5rem',
                          mb: 2.5,
                          boxShadow: `0 4px 12px ${categoryColor}50`
                        }}>
                          <Typography variant="h3" sx={{ 
                            fontWeight: '900',
                            color: 'white',
                            fontSize: '2.8rem',
                            letterSpacing: '-0.01em'
                          }}>
                            {categoryName}
                          </Typography>
                        </Box>

                        {/* Activities */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                          {activities.map((activity, activityIndex) => (
                            <Paper
                              key={activityIndex}
                              onClick={() => handleActivityClick(activity, categoryName, selectedAgeGroup)}
                              sx={{
                                p: 2,
                                borderRadius: '10px',
                                background: 'white',
                                border: '1px solid #e5e7eb',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: 2,
                                '&:hover': {
                                  boxShadow: `0 4px 12px ${categoryColor}40`,
                                  borderColor: categoryColor,
                                  background: '#f9fafb',
                                  transform: 'translateX(4px)'
                                }
                              }}
                            >
                              {/* Topic Name */}
                              <Typography sx={{ 
                                fontWeight: '700',
                                color: '#1f2937',
                                fontSize: '1.05rem',
                                flex: 1,
                                letterSpacing: '0.01em'
                              }}>
                                {activity.activity?.name || activity.topic || 'Activity'}
                              </Typography>
                              
                              {/* Time - Simple Text */}
                              <Typography sx={{
                                fontSize: '0.85rem',
                                color: categoryColor,
                                fontWeight: '600',
                                whiteSpace: 'nowrap',
                                minWidth: '70px',
                                textAlign: 'right'
                              }}>
                                {activity.estimatedTime}
                              </Typography>
                            </Paper>
                          ))}
                        </Box>
                      </Box>
                    </Box>
                    );
                  });
                }
                
                // Fallback to original structure
                return activitiesData.ageGroups
                  .find(group => group.ageGroup === selectedAgeGroup)
                  ?.categories.map((category, categoryIndex) => {
                    // Get unique color for this category
                    const categoryColor = CATEGORY_COLORS[categoryIndex % CATEGORY_COLORS.length];
                    
                    return (
                  <Box key={categoryIndex} sx={{ width: '100%' }}>
                    <Zoom in timeout={1400 + (categoryIndex * 200)}>
                      <Box sx={{
                        background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
                        borderRadius: '16px',
                        padding: { xs: '1.5rem', sm: '2rem', md: '3rem' },
                        border: '2px solid #e5e7eb',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                        width: '100%'
                      }}>
                        {/* Category Header */}
                        <Box sx={{
                          background: `linear-gradient(135deg, ${categoryColor} 0%, ${categoryColor}dd 100%)`,
                          borderRadius: '12px',
                          padding: '1.5rem',
                          mb: 2.5,
                          boxShadow: `0 4px 12px ${categoryColor}50`
                        }}>
                          <Typography variant="h3" sx={{ 
                            fontWeight: '900',
                            color: 'white',
                            fontSize: '2.8rem',
                            letterSpacing: '-0.01em'
                          }}>
                            {category.category}
                          </Typography>
                        </Box>

                        {/* Activities */}
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                          {category.activities.map((activity, activityIndex) => (
                            <Paper
                              key={activityIndex}
                              onClick={() => handleActivityClick(activity, category.category, selectedAgeGroup)}
                              sx={{
                                p: 2,
                                borderRadius: '10px',
                                background: 'white',
                                border: '1px solid #e5e7eb',
                                cursor: 'pointer',
                                transition: 'all 0.2s ease',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: 2,
                                '&:hover': {
                                  boxShadow: `0 4px 12px ${categoryColor}40`,
                                  borderColor: categoryColor,
                                  background: '#f9fafb',
                                  transform: 'translateX(4px)'
                                }
                              }}
                            >
                              {/* Topic Name */}
                              <Typography sx={{ 
                                fontWeight: '700',
                                color: '#1f2937',
                                fontSize: '1.05rem',
                                flex: 1,
                                letterSpacing: '0.01em'
                              }}>
                                {activity.activity?.name || activity.topic || 'Activity'}
                              </Typography>
                              
                              {/* Time */}
                              <Typography sx={{
                                fontSize: '0.85rem',
                                color: categoryColor,
                                fontWeight: '600',
                                whiteSpace: 'nowrap',
                                minWidth: '70px',
                                textAlign: 'right'
                              }}>
                                {activity.estimatedTime}
                              </Typography>
                            </Paper>
                          ))}
                        </Box>
                      </Box>
                    </Zoom>
                  </Box>
                    );
                  });
              })()}
            </Box>
          </Box>
        </Fade>
      </Box>
    </Box>
  );
};

export default EssentialGrowthActivities;

