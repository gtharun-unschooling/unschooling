import React, { useState, useEffect } from 'react';
import {
  Box, Typography, Card, CardContent, Container, Button, Chip,
  Grid, List, ListItem, ListItemText, ListItemIcon, Paper, Divider,
  Tabs, Tab
} from '@mui/material';
import {
  AccessTime, School, PlayArrow, Star
} from '@mui/icons-material';

const LayoutComparison = () => {
  const [activity, setActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    const loadActivity = async () => {
      try {
        const response = await fetch('/data/essential-growth/play-creativity/activities.json');
        const data = await response.json();
        
        // Get the first activity for comparison
        const firstActivity = data.ageGroups?.[0]?.categories?.[0]?.activities?.[0];
        if (firstActivity) {
          setActivity(firstActivity);
        }
        setLoading(false);
      } catch (error) {
        console.error('Error loading activity:', error);
        setLoading(false);
      }
    };

    loadActivity();
  }, []);

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
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

  const renderVariant1 = () => (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center', color: '#2d3748' }}>
        Variant 1: 2x2 Grid Layout
      </Typography>
      <Typography variant="body1" sx={{ mb: 3, textAlign: 'center', color: '#666' }}>
        Materials | Steps (Top Row) • Skills | Tags (Bottom Row)
      </Typography>
      
      <Grid container spacing={3}>
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
                const stepText = Array.isArray(step) ? step.join('') : step;
                let cleanStep = stepText.trim();
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
                const skillText = Array.isArray(skill) ? skill.join('') : skill;
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
                const tagText = Array.isArray(tag) ? tag.join('') : tag;
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
    </Box>
  );

  const renderVariant2 = () => (
    <Box>
      <Typography variant="h4" sx={{ mb: 3, textAlign: 'center', color: '#2d3748' }}>
        Variant 2: Single Column Layout
      </Typography>
      <Typography variant="body1" sx={{ mb: 3, textAlign: 'center', color: '#666' }}>
        Materials → Steps → Skills + Tags (Sequential)
      </Typography>
      
      <Box>
        {/* Materials */}
        <Paper sx={{ p: 3, borderRadius: '16px', background: 'rgba(34, 197, 94, 0.05)', mb: 3 }}>
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

        {/* Steps */}
        <Paper sx={{ p: 3, borderRadius: '16px', background: 'rgba(168, 85, 247, 0.05)', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: '#2d3748' }}>
            Steps to Follow
          </Typography>
          <List>
            {activity.activity.steps.map((step, index) => {
              const stepText = Array.isArray(step) ? step.join('') : step;
              let cleanStep = stepText.trim();
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

        {/* Skills and Tags Combined */}
        <Paper sx={{ p: 3, borderRadius: '16px', background: 'rgba(255, 193, 7, 0.05)', mb: 3 }}>
          <Typography variant="h5" sx={{ fontWeight: 'bold', mb: 2, color: '#2d3748' }}>
            Skills Your Child Will Develop
          </Typography>
          <Box display="flex" gap={1.5} flexWrap="wrap" mb={3}>
            {activity.activity.skills.map((skill, index) => {
              const skillText = Array.isArray(skill) ? skill.join('') : skill;
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
          
          {/* Tags within Skills section */}
          <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1.5, color: '#2d3748' }}>
            Tags
          </Typography>
          <Box display="flex" gap={1.5} flexWrap="wrap">
            {activity.hashtags.map((tag, index) => {
              const tagText = Array.isArray(tag) ? tag.join('') : tag;
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
      </Box>
    </Box>
  );

  return (
    <Box sx={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '2rem 0'
    }}>
      <Container maxWidth="xl">
        <Box textAlign="center" mb={4}>
          <Typography variant="h2" sx={{ 
            fontWeight: 'bold',
            color: 'white',
            mb: 2
          }}>
            Layout Comparison
          </Typography>
          <Typography variant="h5" sx={{ 
            color: 'rgba(255,255,255,0.8)',
            mb: 3
          }}>
            Compare both layout variants for the same activity
          </Typography>
          
          <Box display="flex" justifyContent="center" gap={2} flexWrap="wrap" mb={3}>
            <Chip
              icon={<AccessTime />}
              label={activity.estimatedTime}
              sx={{
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 'bold'
              }}
            />
            <Chip
              icon={<School />}
              label={`Age: ${activity.age}`}
              sx={{
                background: 'rgba(255,255,255,0.2)',
                color: 'white',
                fontWeight: 'bold'
              }}
            />
          </Box>
        </Box>

        <Card sx={{
          background: 'rgba(255,255,255,0.95)',
          borderRadius: '24px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          backdropFilter: 'blur(10px)'
        }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
              <Tabs value={activeTab} onChange={handleTabChange} centered>
                <Tab label="Variant 1: 2x2 Grid" />
                <Tab label="Variant 2: Single Column" />
              </Tabs>
            </Box>

            {activeTab === 0 && renderVariant1()}
            {activeTab === 1 && renderVariant2()}

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

export default LayoutComparison;
