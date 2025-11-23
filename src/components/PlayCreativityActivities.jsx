import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, Grid, Chip, Button,
  Container, Avatar, Badge, Fade, Zoom, Paper, Divider, Slider
} from '@mui/material';
import {
  AccessTime, Group, Palette, MusicNote,
  Psychology, FitnessCenter, School, Nature, EmojiEvents,
  Star, Favorite, Share, Bookmark, PlayArrow
} from '@mui/icons-material';
import SimpleBackButton from './ui/SimpleBackButton';

const PlayCreativityActivities = ({ onBackClick }) => {
  const navigate = useNavigate();
  const [activitiesData, setActivitiesData] = useState(null);
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

  const handleActivityClick = (activity, category, ageGroup) => {
    // Create URL-friendly slugs using Niche method (simple and consistent)
    const activitySlug = activity.topic.toLowerCase().replace(/\s+/g, '-');
    const ageGroupSlug = ageGroup.toLowerCase().replace(/\s+/g, '-');
    const categorySlug = category.toLowerCase().replace(/\s+/g, '-');
    
    // Navigate to the activity detail page
    navigate(`/essential-growth/play-creativity/${ageGroupSlug}/${categorySlug}/${activitySlug}`);
  };

  useEffect(() => {
    const loadActivities = async () => {
      try {
        const response = await fetch('/data/essential-growth/play-creativity/activities.json');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        setActivitiesData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error loading Play & Creativity activities:', error);
        setLoading(false);
      }
    };

    loadActivities();
  }, []);

  const getCategoryIcon = (category) => {
    const iconMap = {
      'Sensory Exploration': <Psychology />,
      'Tummy Time Play': <FitnessCenter />,
      'Interactive Sounds & Textures': <MusicNote />,
      'Parent-Child Bonding Activities': <Group />,
      'Pretend Play': <Palette />,
      'Building with Blocks': <School />,
      'Drawing & Scribbling': <Palette />,
      'Exploring Musical Instruments': <MusicNote />
    };
    return iconMap[category] || <EmojiEvents />;
  };

  const getAgeGroupIcon = (ageGroup) => {
    const iconMap = {
      'Infant (0-1)': '👶',
      'Toddler (1-3)': '🧒',
      'Preschooler (3-5)': '👧',
      'Child (6-8)': '👦',
      'Pre-Teen (9-12)': '🧑',
      'Teen (13-18)': '👨'
    };
    return iconMap[ageGroup] || '🎯';
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography >Loading Play & Creativity activities...</Typography>
      </Box>
    );
  }

  if (!activitiesData || !activitiesData.ageGroups) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography  color="error">
          Unable to load Play & Creativity activities
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem 0'
    }}>
      <Container maxWidth="lg">
        {/* Back Button */}
        <Box mb={4}>
          <SimpleBackButton 
            onClick={onBackClick}
            size="medium"
          />
        </Box>
        
        {/* Hero Header */}
        <Fade in timeout={800}>
          <Box textAlign="center" mb={6} sx={{ color: 'white' }}>
            <Typography  component="h1" gutterBottom sx={{ 
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              mb: 2
            }}>
              🎨 Play & Creativity Activities
            </Typography>
            <Typography  sx={{ 
              opacity: 0.9,
              maxWidth: '700px',
              margin: '0 auto',
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
            }}>
              Fuel imagination and joyful exploration through hands-on activities and creative expression
            </Typography>
          </Box>
        </Fade>

        {/* Age Slider */}
        <Fade in timeout={1000}>
          <Box mb={6} sx={{
            background: 'rgba(255,255,255,0.95)',
            borderRadius: '24px',
            padding: '3rem',
            boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
            backdropFilter: 'blur(10px)',
            maxWidth: '800px',
            margin: '0 auto 3rem auto'
          }}>
            <Typography variant="h5" gutterBottom sx={{ 
              fontWeight: '700', 
              mb: 2, 
              color: '#2d3748',
              textAlign: 'center'
            }}>
              Select Your Child's Age
            </Typography>
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 3, mt: 4 }}>
              <Avatar sx={{
                width: 70,
                height: 70,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                fontSize: '2rem',
                fontWeight: 'bold',
                boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
              }}>
                {selectedAge}
              </Avatar>
              
              <Box sx={{ flex: 1 }}>
                <Typography variant="body1" sx={{ 
                  color: '#4a5568', 
                  mb: 2,
                  fontWeight: '600'
                }}>
                  Age Group: <span style={{ 
                    color: '#667eea', 
                    fontWeight: '700',
                    fontSize: '1.1rem'
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
                    color: '#667eea',
                    '& .MuiSlider-thumb': {
                      width: 24,
                      height: 24,
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      boxShadow: '0 3px 10px rgba(102, 126, 234, 0.4)',
                      '&:hover': {
                        boxShadow: '0 0 0 8px rgba(102, 126, 234, 0.16)'
                      }
                    },
                    '& .MuiSlider-track': {
                      background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      height: 8
                    },
                    '& .MuiSlider-rail': {
                      opacity: 0.3,
                      height: 8
                    },
                    '& .MuiSlider-mark': {
                      backgroundColor: '#667eea',
                      height: 12,
                      width: 3
                    },
                    '& .MuiSlider-markLabel': {
                      color: '#718096',
                      fontWeight: '600'
                    }
                  }}
                />
              </Box>
            </Box>
          </Box>
        </Fade>

        {/* Activities Display */}
        {selectedAgeGroup && (
          <Fade in timeout={1200}>
            <Box sx={{ 
              background: 'rgba(255,255,255,0.95)',
              borderRadius: '24px',
              padding: '3rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              backdropFilter: 'blur(10px)'
            }}>

              <Grid container spacing={4}>
                {(() => {
                  // Handle "All Ages" structure - filter and group by actual age
                  const allAgesGroup = activitiesData.ageGroups.find(g => g.ageGroup === 'All Ages');
                  
                  if (allAgesGroup) {
                    // Get all activities from the single category
                    const allActivities = allAgesGroup.categories[0]?.activities || [];
                    
                    // Extract age group keyword for matching (e.g., "Child" from "Child (6-8)")
                    const ageKeyword = selectedAgeGroup.split(' ')[0]; // "Child", "Infant", etc.
                    
                    // Filter by selected age group (more robust matching)
                    const filteredActivities = allActivities.filter(act => {
                      if (!act.age) return false;
                      // Remove emojis and compare (act.age might be "👦 Child (6–8)")
                      const cleanAge = act.age.replace(/[\u{1F300}-\u{1F9FF}]/gu, '').trim();
                      return cleanAge.includes(ageKeyword);
                    });
                    
                    console.log(`🔍 Filtered ${filteredActivities.length} activities for ${selectedAgeGroup}`);
                    
                    // Group by category field (from Google Sheet sync)
                    const grouped = {};
                    filteredActivities.forEach(act => {
                      const cat = act.category || 'Play & Creativity';
                      if (!grouped[cat]) {
                        grouped[cat] = [];
                      }
                      grouped[cat].push(act);
                    });
                    
                    console.log(`📊 Grouped into ${Object.keys(grouped).length} categories:`, Object.keys(grouped));
                    
                    return Object.entries(grouped).map(([categoryName, activities], categoryIndex) => (
                      <Grid item xs={12} key={categoryIndex}>
                        <Box sx={{
                          background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
                          borderRadius: '16px',
                          padding: '2rem',
                          border: '2px solid #e5e7eb',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                          mb: 3
                        }}>
                          {/* Category Header */}
                          <Box sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            borderRadius: '12px',
                            padding: '1.5rem',
                            mb: 2.5,
                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                          }}>
                            <Typography variant="h4" sx={{ 
                              fontWeight: '800',
                              color: 'white',
                              mb: 0.5,
                              fontSize: '1.8rem'
                            }}>
                              {categoryName}
                            </Typography>
                            <Typography variant="body2" sx={{ 
                              color: 'rgba(255,255,255,0.95)',
                              lineHeight: 1.5,
                              fontSize: '0.9rem',
                              fontWeight: '500'
                            }}>
                              {activities.length} engaging activities for {selectedAgeGroup}
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
                                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
                                    borderColor: '#667eea',
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
                                  color: '#667eea',
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
                      </Grid>
                    ));
                  }
                  
                  // Fallback to original structure
                  return activitiesData.ageGroups
                    .find(group => group.ageGroup === selectedAgeGroup)
                    ?.categories.map((category, categoryIndex) => (
                    <Grid item xs={12} key={categoryIndex}>
                      <Zoom in timeout={1400 + (categoryIndex * 200)}>
                        <Box sx={{
                          background: 'linear-gradient(135deg, #f8f9fa 0%, #ffffff 100%)',
                          borderRadius: '16px',
                          padding: '2rem',
                          border: '2px solid #e5e7eb',
                          boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
                          mb: 3
                        }}>
                          {/* Category Header - Highlighted Block */}
                          <Box sx={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            borderRadius: '12px',
                            padding: '1.5rem',
                            mb: 2.5,
                            boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                          }}>
                            <Typography variant="h4" sx={{ 
                              fontWeight: '800',
                              color: 'white',
                              mb: 1,
                              fontSize: '1.8rem'
                            }}>
                              {category.category}
                            </Typography>
                            <Typography variant="body2" sx={{ 
                              color: 'rgba(255,255,255,0.95)',
                              lineHeight: 1.5,
                              fontSize: '0.9rem',
                              fontWeight: '500'
                            }}>
                              {category.description}
                            </Typography>
                          </Box>

                          {/* Activities - Clean Rows */}
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
                                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.2)',
                                    borderColor: '#667eea',
                                    background: '#f9fafb',
                                    transform: 'translateX(4px)'
                                  }
                                }}
                              >
                                {/* Topic Name - Bold and Clear */}
                                <Typography sx={{ 
                                  fontWeight: '700',
                                  color: '#1f2937',
                                  fontSize: '1.1rem',
                                  flex: 1,
                                  letterSpacing: '0.01em'
                                }}>
                                  {activity.activity?.name || activity.topic || 'Activity'}
                                </Typography>
                                
                                {/* Time - Right Side */}
                                <Chip
                                  icon={<AccessTime sx={{ fontSize: '0.9rem' }} />}
                                  label={activity.estimatedTime}
                                  size="small"
                                  sx={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    color: 'white',
                                    fontWeight: '600',
                                    fontSize: '0.8rem'
                                  }}
                                />
                              </Paper>
                            ))}
                          </Box>
                        </Box>
                      </Zoom>
                    </Grid>
                  ));
                })()}
              </Grid>
            </Box>
          </Fade>
        )}
      </Container>
    </Box>
  );
};

export default PlayCreativityActivities;