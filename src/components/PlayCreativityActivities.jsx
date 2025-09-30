import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, Grid, Chip, Button,
  Container, Avatar, Badge, Fade, Zoom, Paper, Divider
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
  const [selectedAgeGroup, setSelectedAgeGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleActivityClick = (activity, category, ageGroup) => {
    // Create a URL-friendly slug for the activity
    const activitySlug = activity.topic
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
    
    const ageGroupSlug = ageGroup
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
    
    const categorySlug = category
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();
    
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
        <Typography variant="h6">Loading Play & Creativity activities...</Typography>
      </Box>
    );
  }

  if (!activitiesData || !activitiesData.ageGroups) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography variant="h6" color="error">
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
            <Typography variant="h2" component="h1" gutterBottom sx={{ 
              fontWeight: 'bold',
              textShadow: '2px 2px 4px rgba(0,0,0,0.3)',
              mb: 2
            }}>
              🎨 Play & Creativity Activities
            </Typography>
            <Typography variant="h5" sx={{ 
              opacity: 0.9,
              maxWidth: '700px',
              margin: '0 auto',
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
            }}>
              Fuel imagination and joyful exploration through hands-on activities and creative expression
            </Typography>
          </Box>
        </Fade>

        {/* Age Group Selection */}
        <Fade in timeout={1000}>
          <Box mb={6}>
            <Typography variant="h4" gutterBottom sx={{ 
              fontWeight: '700', 
              mb: 4, 
              color: 'white',
              textAlign: 'center',
              textShadow: '1px 1px 2px rgba(0,0,0,0.3)'
            }}>
              Choose Your Child's Age Group
            </Typography>
            <Grid container spacing={3}>
              {activitiesData.ageGroups.map((ageGroup, index) => (
                <Grid item xs={12} sm={6} md={4} key={index}>
                  <Zoom in timeout={1200 + (index * 200)}>
                    <Card
                      sx={{
                        cursor: 'pointer',
                        transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                        background: selectedAgeGroup === ageGroup.ageGroup 
                          ? 'linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%)'
                          : 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                        border: selectedAgeGroup === ageGroup.ageGroup 
                          ? '3px solid #ff4757' 
                          : '2px solid rgba(255,255,255,0.2)',
                        borderRadius: '20px',
                        boxShadow: selectedAgeGroup === ageGroup.ageGroup
                          ? '0 20px 40px rgba(255, 71, 87, 0.4)'
                          : '0 10px 30px rgba(0,0,0,0.1)',
                        transform: selectedAgeGroup === ageGroup.ageGroup 
                          ? 'scale(1.05)' 
                          : 'scale(1)',
                        '&:hover': {
                          transform: 'translateY(-8px) scale(1.02)',
                          boxShadow: '0 25px 50px rgba(0,0,0,0.2)'
                        }
                      }}
                      onClick={() => setSelectedAgeGroup(
                        selectedAgeGroup === ageGroup.ageGroup ? null : ageGroup.ageGroup
                      )}
                    >
                      <CardContent sx={{ textAlign: 'center', py: 2 }}>
                        <Avatar
                          sx={{
                            width: 50,
                            height: 50,
                            mx: 'auto',
                            mb: 1,
                            background: selectedAgeGroup === ageGroup.ageGroup
                              ? 'linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%)'
                              : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            fontSize: '1.5rem',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                          }}
                        >
                          {getAgeGroupIcon(ageGroup.ageGroup)}
                        </Avatar>
                        <Typography variant="h6" component="h3" gutterBottom sx={{
                          fontWeight: 'bold',
                          color: selectedAgeGroup === ageGroup.ageGroup ? 'white' : '#2d3748'
                        }}>
                          {ageGroup.ageGroup}
                        </Typography>
                        {selectedAgeGroup === ageGroup.ageGroup && (
                          <Chip
                            icon={<PlayArrow />}
                            label="Selected"
                            sx={{
                              mt: 1,
                              background: 'rgba(255,255,255,0.2)',
                              color: 'white',
                              fontWeight: 'bold'
                            }}
                          />
                        )}
                      </CardContent>
                    </Card>
                  </Zoom>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Fade>

        {/* Activities Display */}
        {selectedAgeGroup && (
          <Fade in timeout={1200}>
            <Box sx={{ 
              background: 'rgba(255,255,255,0.95)',
              borderRadius: '24px',
              padding: '2rem',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              backdropFilter: 'blur(10px)'
            }}>
              <Box display="flex" alignItems="center" mb={4}>
                <Avatar
                  sx={{
                    width: 60,
                    height: 60,
                    mr: 3,
                    background: 'linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%)',
                    fontSize: '1.5rem'
                  }}
                >
                  {getAgeGroupIcon(selectedAgeGroup)}
                </Avatar>
                <Box>
                  <Typography variant="h3" sx={{ 
                    fontWeight: 'bold',
                    color: '#2d3748',
                    mb: 1
                  }}>
                    {selectedAgeGroup} Activities
                  </Typography>
                  <Typography variant="h6" sx={{ 
                    color: '#718096',
                    fontWeight: '500'
                  }}>
                    {activitiesData.ageGroups
                      .find(group => group.ageGroup === selectedAgeGroup)
                      ?.categories.reduce((total, cat) => total + cat.activities.length, 0)} creative activities to explore
                  </Typography>
                </Box>
              </Box>

              <Grid container spacing={3}>
                {activitiesData.ageGroups
                  .find(group => group.ageGroup === selectedAgeGroup)
                  ?.categories.map((category, categoryIndex) => (
                    <Grid item xs={12} md={6} key={categoryIndex}>
                      <Zoom in timeout={1400 + (categoryIndex * 200)}>
                        <Card
                          sx={{
                            height: '100%',
                            background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                            borderRadius: '20px',
                            border: '2px solid rgba(102, 126, 234, 0.1)',
                            boxShadow: '0 10px 30px rgba(0,0,0,0.1)',
                            transition: 'all 0.3s ease',
                            '&:hover': {
                              transform: 'translateY(-5px)',
                              boxShadow: '0 20px 40px rgba(0,0,0,0.15)',
                              border: '2px solid rgba(102, 126, 234, 0.3)'
                            }
                          }}
                        >
                          <CardContent sx={{ p: 3 }}>
                            <Box display="flex" alignItems="center" mb={2}>
                              <Avatar
                                sx={{
                                  width: 50,
                                  height: 50,
                                  mr: 2,
                                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                  color: 'white'
                                }}
                              >
                                {getCategoryIcon(category.category)}
                              </Avatar>
                              <Box flexGrow={1}>
                                <Typography variant="h6" sx={{ 
                                  fontWeight: 'bold',
                                  color: '#2d3748',
                                  mb: 0.5
                                }}>
                                  {category.category}
                                </Typography>
                                <Typography variant="body2" sx={{ 
                                  color: '#718096',
                                  lineHeight: 1.4
                                }}>
                                  {category.description}
                                </Typography>
                              </Box>
                              <Badge
                                badgeContent={category.activities.length}
                                color="primary"
                                sx={{
                                  '& .MuiBadge-badge': {
                                    background: 'linear-gradient(135deg, #ff6b6b 0%, #ffa500 100%)',
                                    fontWeight: 'bold'
                                  }
                                }}
                              >
                                <Chip
                                  label="Activities"
                                  size="small"
                                  sx={{
                                    background: 'rgba(102, 126, 234, 0.1)',
                                    color: '#667eea',
                                    fontWeight: 'bold'
                                  }}
                                />
                              </Badge>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Box>
                              {category.activities.map((activity, activityIndex) => (
                                <Paper
                                  key={activityIndex}
                                  sx={{
                                    p: 2,
                                    mb: 2,
                                    borderRadius: '12px',
                                    background: 'rgba(255,255,255,0.7)',
                                    border: '1px solid rgba(0,0,0,0.05)',
                                    transition: 'all 0.2s ease',
                                    '&:hover': {
                                      background: 'rgba(102, 126, 234, 0.05)',
                                      border: '1px solid rgba(102, 126, 234, 0.2)'
                                    }
                                  }}
                                >
                                  <Box display="flex" alignItems="start" justifyContent="space-between">
                                    <Box flexGrow={1}>
                                      <Typography variant="h6" sx={{ 
                                        fontWeight: '600',
                                        color: '#2d3748',
                                        mb: 1
                                      }}>
                                        {activity.topic}
                                      </Typography>
                                      <Typography variant="body2" sx={{ 
                                        color: '#718096',
                                        mb: 2,
                                        lineHeight: 1.5
                                      }}>
                                        {activity.objective}
                                      </Typography>
                                      <Box display="flex" gap={1} flexWrap="wrap">
                                        <Chip
                                          icon={<AccessTime />}
                                          label={activity.estimatedTime}
                                          size="small"
                                          sx={{
                                            background: 'rgba(34, 197, 94, 0.1)',
                                            color: '#22c55e',
                                            fontWeight: 'bold'
                                          }}
                                        />
                                        <Chip
                                          label={`Age: ${activity.age}`}
                                          size="small"
                                          sx={{
                                            background: 'rgba(59, 130, 246, 0.1)',
                                            color: '#3b82f6',
                                            fontWeight: 'bold'
                                          }}
                                        />
                                        {activity.hashtags.slice(0, 2).map((tag, tagIndex) => (
                                          <Chip
                                            key={tagIndex}
                                            label={tag}
                                            size="small"
                                            sx={{
                                              background: 'rgba(168, 85, 247, 0.1)',
                                              color: '#a855f7',
                                              fontWeight: 'bold'
                                            }}
                                          />
                                        ))}
                                      </Box>
                                    </Box>
                                    <Box display="flex" flexDirection="column" alignItems="center" ml={2}>
                                      <Button
                                        size="small"
                                        startIcon={<PlayArrow />}
                                        onClick={() => handleActivityClick(activity, category.category, selectedAgeGroup)}
                                        sx={{
                                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                          color: 'white',
                                          borderRadius: '20px',
                                          px: 2,
                                          py: 1,
                                          fontWeight: 'bold',
                                          textTransform: 'none',
                                          '&:hover': {
                                            background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                                            transform: 'scale(1.05)'
                                          }
                                        }}
                                      >
                                        Start
                                      </Button>
                                    </Box>
                                  </Box>
                                </Paper>
                              ))}
                            </Box>
                          </CardContent>
                        </Card>
                      </Zoom>
                    </Grid>
                  ))}
              </Grid>
            </Box>
          </Fade>
        )}
      </Container>
    </Box>
  );
};

export default PlayCreativityActivities;