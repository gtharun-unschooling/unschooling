import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, Grid, Chip, Button,
  Container, Avatar, Badge, Fade, Zoom, Paper, Divider
} from '@mui/material';
import {
  AccessTime, Group, Psychology, Lightbulb,
  School, Nature, EmojiEvents, Star, Favorite, Share, Bookmark, PlayArrow
} from '@mui/icons-material';
import SimpleBackButton from '../../components/ui/SimpleBackButton';

const CognitiveSkillsPage = () => {
  const navigate = useNavigate();
  const [activitiesData, setActivitiesData] = useState(null);
  const [selectedAgeGroup, setSelectedAgeGroup] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await fetch('/data/essential-growth/cognitive-skills/activities.json');
        if (!response.ok) {
          throw new Error('Failed to fetch activities');
        }
        const data = await response.json();
        setActivitiesData(data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching cognitive skills activities:', error);
        setLoading(false);
      }
    };

    fetchActivities();
  }, []);

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
    navigate(`/essential-growth/cognitive-skills/${ageGroupSlug}/${categorySlug}/${activitySlug}`);
  };

  const getAgeGroupIcon = (ageGroup) => {
    const iconMap = {
      'Infant (0-1)': <Psychology />,
      'Toddler (1-3)': <School />,
      'Preschooler (3-5)': <Lightbulb />,
      'Child (6-8)': <EmojiEvents />,
      'Pre-Teen (9-12)': <Star />,
      'Teen (13-18)': <Nature />
    };
    return iconMap[ageGroup] || <Group />;
  };

  const getAgeGroupColor = (ageGroup) => {
    const colorMap = {
      'Infant (0-1)': '#fce7f3',
      'Toddler (1-3)': '#dbeafe',
      'Preschooler (3-5)': '#d1fae5',
      'Child (6-8)': '#fef3c7',
      'Pre-Teen (9-12)': '#ede9fe',
      'Teen (13-18)': '#fee2e2'
    };
    return colorMap[ageGroup] || '#f3f4f6';
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography variant="h6">Loading Cognitive Skills activities...</Typography>
      </Box>
    );
  }

  if (!activitiesData) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography variant="h6" color="error">Unable to load Cognitive Skills activities</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      py: 4
    }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 4 }}>
          <SimpleBackButton
            onClick={() => navigate('/essential-growth')}
            size="medium"
          />
        </Box>
        
        <Fade in timeout={1000}>
          <Paper elevation={8} sx={{ p: 4, borderRadius: '20px', backgroundColor: 'rgba(255,255,255,0.95)' }}>
            <Typography variant="h3" component="h1" gutterBottom sx={{ 
              fontWeight: 'bold', 
              color: '#667eea', 
              textAlign: 'center',
              mb: 2
            }}>
              🧠 Cognitive Skills
            </Typography>
            
            <Typography variant="h6" sx={{ 
              textAlign: 'center', 
              color: '#666', 
              mb: 4,
              fontStyle: 'italic'
            }}>
              Sharpen thinking, memory, and decision-making skills through progressive cognitive development activities
            </Typography>

            <Divider sx={{ mb: 4 }} />

            {/* Age Group Selection */}
            <Box sx={{ mb: 4 }}>
              <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#764ba2', mb: 3 }}>
                Choose Age Group:
              </Typography>
              <Grid container spacing={2}>
                {activitiesData.ageGroups.map((ageGroup, index) => (
                  <Grid item xs={12} sm={6} md={4} key={index}>
                    <Zoom in timeout={500 + index * 100}>
                      <Card
                        sx={{
                          cursor: 'pointer',
                          transition: 'all 0.3s ease',
                          background: getAgeGroupColor(ageGroup.ageGroup),
                          '&:hover': {
                            transform: 'translateY(-5px)',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.2)'
                          }
                        }}
                        onClick={() => setSelectedAgeGroup(selectedAgeGroup === ageGroup.ageGroup ? null : ageGroup.ageGroup)}
                      >
                        <CardContent sx={{ textAlign: 'center', p: 3 }}>
                          <Avatar sx={{ 
                            width: 60, 
                            height: 60, 
                            mx: 'auto', 
                            mb: 2,
                            backgroundColor: '#667eea'
                          }}>
                            {getAgeGroupIcon(ageGroup.ageGroup)}
                          </Avatar>
                          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                            {ageGroup.ageGroup}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {ageGroup.categories.length} categories • {ageGroup.categories.reduce((total, cat) => total + cat.activities.length, 0)} activities
                          </Typography>
                        </CardContent>
                      </Card>
                    </Zoom>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Categories and Activities */}
            {selectedAgeGroup && (
              <Fade in timeout={800}>
                <Box>
                  <Typography variant="h5" gutterBottom sx={{ fontWeight: 'bold', color: '#764ba2', mb: 3 }}>
                    Categories for {selectedAgeGroup}:
                  </Typography>
                  
                  {activitiesData.ageGroups
                    .find(ag => ag.ageGroup === selectedAgeGroup)
                    ?.categories.map((category, catIndex) => (
                      <Box key={catIndex} sx={{ mb: 4 }}>
                        <Typography variant="h6" sx={{ 
                          fontWeight: 'bold', 
                          color: '#667eea', 
                          mb: 2,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}>
                          <Psychology sx={{ fontSize: 24 }} />
                          {category.category}
                        </Typography>
                        
                        <Typography variant="body2" sx={{ color: '#666', mb: 2, fontStyle: 'italic' }}>
                          {category.description}
                        </Typography>

                        <Grid container spacing={2}>
                          {category.activities.map((activity, actIndex) => (
                            <Grid item xs={12} sm={6} md={4} key={actIndex}>
                              <Zoom in timeout={600 + actIndex * 100}>
                                <Card sx={{
                                  height: '100%',
                                  transition: 'all 0.3s ease',
                                  '&:hover': {
                                    transform: 'translateY(-3px)',
                                    boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
                                  }
                                }}>
                                  <CardContent>
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                                      <Typography variant="h6" sx={{ 
                                        fontWeight: 'bold', 
                                        color: '#333',
                                        fontSize: '1.1rem'
                                      }}>
                                        {activity.topic}
                                      </Typography>
                                      <Chip 
                                        label={`#${activity.topicNumber}`} 
                                        size="small" 
                                        color="primary" 
                                        variant="outlined"
                                      />
                                    </Box>
                                    
                                    <Typography variant="body2" sx={{ color: '#666', mb: 2, minHeight: '40px' }}>
                                      {activity.objective}
                                    </Typography>

                                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                                      <Chip 
                                        icon={<AccessTime />} 
                                        label={activity.estimatedTime} 
                                        size="small" 
                                        color="primary" 
                                        variant="outlined"
                                      />
                                      <Chip 
                                        label={activity.age} 
                                        size="small" 
                                        color="secondary" 
                                        variant="outlined"
                                      />
                                    </Box>

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
                                  </CardContent>
                                </Card>
                              </Zoom>
                            </Grid>
                          ))}
                        </Grid>
                      </Box>
                    ))}
                </Box>
              </Fade>
            )}
          </Paper>
        </Fade>
      </Container>
    </Box>
  );
};

export default CognitiveSkillsPage;
