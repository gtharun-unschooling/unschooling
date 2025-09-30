import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box, Typography, Card, CardContent, Container, Button, Chip,
  Grid, List, ListItem, ListItemText, ListItemIcon, Paper, Divider
} from '@mui/material';
import {
  AccessTime, School, Psychology, FitnessCenter, MusicNote, Palette,
  ArrowBack, PlayArrow, Star, Bookmark, Share
} from '@mui/icons-material';
import UniversalBackButton from '../../components/ui/UniversalBackButton';

const ActivityDetailPage_Variant1 = () => {
  const { ageGroup, category, activitySlug } = useParams();
  const navigate = useNavigate();
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadActivity = async () => {
      try {
        // Determine which pillar based on the current URL path
        const currentPath = window.location.pathname;
        const isCognitiveSkills = currentPath.includes('/cognitive-skills/');
        const dataPath = isCognitiveSkills 
          ? '/data/essential-growth/cognitive-skills/activities.json'
          : '/data/essential-growth/play-creativity/activities.json';
        
        const response = await fetch(dataPath);
        const data = await response.json();
        
        // Find the activity based on URL parameters
        const foundActivity = data.ageGroups
          ?.find(group => group.ageGroup.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-') === ageGroup)
          ?.categories.find(cat => cat.category.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-') === category)
          ?.activities.find(act => act.topic.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-') === activitySlug);
        
        if (foundActivity) {
          setActivity(foundActivity);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error loading activity:', error);
        setLoading(false);
      }
    };

    loadActivity();
  }, [ageGroup, category, activitySlug]);

  const handleBackClick = () => {
    // Determine which pillar based on the current URL path
    const currentPath = window.location.pathname;
    const isCognitiveSkills = currentPath.includes('/cognitive-skills/');
    const backPath = isCognitiveSkills 
      ? '/essential-growth/cognitive-skills'
      : '/essential-growth/play-creativity';
    navigate(backPath);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography variant="h6">Loading activity...</Typography>
      </Box>
    );
  }

  if (!activity) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography variant="h6" color="error">Activity not found</Typography>
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
        <Box mb={4}>
          <UniversalBackButton 
            text={window.location.pathname.includes('/cognitive-skills/') 
              ? "← Back to Cognitive Skills" 
              : "← Back to Play & Creativity"} 
            variant="luxury" 
            onClick={handleBackClick}
          />
        </Box>

        <Card sx={{
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '24px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <CardContent sx={{ p: 4 }}>
            {/* Header */}
            <Box textAlign="center" mb={4}>
              <Typography variant="h2" sx={{ 
                fontWeight: 'bold',
                color: '#2d3748',
                mb: 2
              }}>
                {activity.topic}
              </Typography>
              <Typography variant="h5" sx={{ 
                color: '#718096',
                mb: 3
              }}>
                {activity.objective}
              </Typography>
              
              <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap">
                <Chip
                  icon={<AccessTime />}
                  label={activity.estimatedTime}
                  sx={{
                    background: 'rgba(34, 197, 94, 0.1)',
                    color: '#22c55e',
                    fontWeight: 'bold'
                  }}
                />
                <Chip
                  icon={<School />}
                  label={`Age: ${activity.age}`}
                  sx={{
                    background: 'rgba(59, 130, 246, 0.1)',
                    color: '#3b82f6',
                    fontWeight: 'bold'
                  }}
                />
              </Box>
            </Box>

            <Divider sx={{ my: 4 }} />

            {/* VARIANT 1: 2x2 Grid Layout */}
            <Grid container spacing={4}>
              {/* Top Row: Materials & Steps */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, borderRadius: '16px', background: 'rgba(34, 197, 94, 0.05)', height: '100%' }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: '#2d3748' }}>
                    Materials Needed
                  </Typography>
                  <List>
                    {activity.activity.materials.map((material, index) => (
                      <ListItem key={index} sx={{ py: 0.5 }}>
                        <ListItemIcon sx={{ minWidth: 30 }}>
                          <Star sx={{ fontSize: 16, color: '#fbbf24' }} />
                        </ListItemIcon>
                        <ListItemText 
                          primary={material}
                          primaryTypographyProps={{ variant: 'body1' }}
                        />
                      </ListItem>
                    ))}
                  </List>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, borderRadius: '16px', background: 'rgba(168, 85, 247, 0.05)', height: '100%' }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: '#2d3748' }}>
                    Steps to Follow
                  </Typography>
                  <List>
                    {activity.activity.steps.map((step, index) => {
                      // Handle both array and comma-separated string formats
                      const stepText = Array.isArray(step) ? step.join('') : step;
                      // Clean up any existing numbering (remove all patterns like "1. ", "2. ", "3. ", etc.)
                      // This handles cases like "3. 3. Step text" -> "Step text"
                      let cleanStep = stepText.trim();
                      // Remove all leading number patterns (handles multiple duplicates)
                      while (cleanStep.match(/^\d+\.\s*/)) {
                        cleanStep = cleanStep.replace(/^\d+\.\s*/, '');
                      }
                      
                      return (
                        <ListItem key={index} sx={{ py: 1.5, alignItems: 'flex-start' }}>
                          <ListItemIcon sx={{ minWidth: 50, mt: 0.5 }}>
                            <Box sx={{
                              width: 32,
                              height: 32,
                              borderRadius: '50%',
                              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              color: 'white',
                              fontWeight: 'bold',
                              fontSize: '1rem'
                            }}>
                              {index + 1}
                            </Box>
                          </ListItemIcon>
                          <ListItemText 
                            primary={cleanStep}
                            primaryTypographyProps={{ 
                              variant: 'body1', 
                              sx: { 
                                lineHeight: 1.6,
                                color: '#2d3748',
                                fontWeight: 500
                              } 
                            }}
                          />
                        </ListItem>
                      );
                    })}
                  </List>
                </Paper>
              </Grid>

              {/* Bottom Row: Skills & Tags */}
              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, borderRadius: '16px', background: 'rgba(255, 193, 7, 0.05)', height: '100%' }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: '#2d3748' }}>
                    Skills Your Child Will Develop
                  </Typography>
                  <Box display="flex" gap={1.5} flexWrap="wrap">
                    {activity.activity.skills.map((skill, index) => {
                      // Handle both array and comma-separated string formats
                      const skillText = Array.isArray(skill) ? skill.join('') : skill;
                      // Split by comma if it's a comma-separated string
                      const skillsList = skillText.includes(',') 
                        ? skillText.split(',').map(s => s.trim()).filter(s => s)
                        : [skillText];
                      
                      return skillsList.map((individualSkill, skillIndex) => (
                        <Chip
                          key={`${index}-${skillIndex}`}
                          label={individualSkill}
                          sx={{
                            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '0.9rem',
                            py: 1.5,
                            px: 2,
                            borderRadius: '20px',
                            boxShadow: '0 2px 8px rgba(34, 197, 94, 0.3)',
                            '&:hover': {
                              transform: 'scale(1.05)',
                              boxShadow: '0 4px 12px rgba(34, 197, 94, 0.4)'
                            }
                          }}
                        />
                      ));
                    })}
                  </Box>
                </Paper>
              </Grid>

              <Grid item xs={12} md={6}>
                <Paper sx={{ p: 3, borderRadius: '16px', background: 'rgba(168, 85, 247, 0.05)', height: '100%' }}>
                  <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: '#2d3748' }}>
                    Tags
                  </Typography>
                  <Box display="flex" gap={1.5} flexWrap="wrap">
                    {activity.hashtags.map((tag, index) => {
                      // Handle both array and comma-separated string formats
                      const tagText = Array.isArray(tag) ? tag.join('') : tag;
                      // Split by comma if it's a comma-separated string
                      const tagsList = tagText.includes(',') 
                        ? tagText.split(',').map(t => t.trim()).filter(t => t)
                        : [tagText];
                      
                      return tagsList.map((individualTag, tagIndex) => (
                        <Chip
                          key={`${index}-${tagIndex}`}
                          label={individualTag}
                          sx={{
                            background: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
                            color: 'white',
                            fontWeight: 'bold',
                            fontSize: '0.85rem',
                            py: 1,
                            px: 1.5,
                            borderRadius: '15px',
                            boxShadow: '0 2px 6px rgba(168, 85, 247, 0.3)',
                            '&:hover': {
                              transform: 'scale(1.05)',
                              boxShadow: '0 3px 8px rgba(168, 85, 247, 0.4)'
                            }
                          }}
                        />
                      ));
                    })}
                  </Box>
                </Paper>
              </Grid>
            </Grid>

            {/* Action Buttons */}
            <Box textAlign="center" mt={4}>
              <Button
                variant="contained"
                size="large"
                startIcon={<PlayArrow />}
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  color: 'white',
                  borderRadius: '25px',
                  px: 4,
                  py: 2,
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  textTransform: 'none',
                  '&:hover': {
                    background: 'linear-gradient(135deg, #5a67d8 0%, #6b46c1 100%)',
                    transform: 'scale(1.05)'
                  }
                }}
              >
                Start This Activity
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default ActivityDetailPage_Variant1;
