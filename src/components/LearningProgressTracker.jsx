import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Avatar,
  LinearProgress,
  Button,
  CircularProgress,
  Alert,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  IconButton
} from '@mui/material';
import {
  TrendingUp,
  School,
  Timer,
  Star,
  EmojiEvents,
  Lightbulb,
  Psychology,
  CheckCircle,
  Schedule
} from '@mui/icons-material';

const LearningProgressTracker = () => {
  const [user] = useAuthState(auth);
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [learningHistory, setLearningHistory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      loadChildrenData();
    }
  }, [user]);

  const loadChildrenData = async () => {
    try {
      setLoading(true);
      const childrenRef = collection(db, `users/${user.uid}/children`);
      const childrenSnapshot = await getDocs(childrenRef);
      
      const childrenList = [];
      for (const childDoc of childrenSnapshot.docs) {
        const childData = childDoc.data();
        childrenList.push({
          id: childDoc.id,
          name: childData.child_name || childData.name || 'Unknown Child',
          age: childData.child_age || childData.age || 5,
          interests: Array.isArray(childData.interests) ? childData.interests : [],
          learningStyle: childData.preferred_learning_style || 'mixed'
        });
      }
      
      setChildren(childrenList);
      if (childrenList.length > 0) {
        setSelectedChild(childrenList[0]);
        await loadLearningHistory(childrenList[0].id);
      }
    } catch (error) {
      console.error('Error loading children:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadLearningHistory = async (childId) => {
    try {
      // In a real implementation, this would load from your learning history system
      // For now, we'll create a sample history structure
      const sampleHistory = {
        child_id: childId,
        created_at: new Date().toISOString(),
        last_activity: new Date().toISOString(),
        learning_sessions: [
          {
            session_id: "session_1",
            topic_id: "Finance_Understanding_Money",
            topic_name: "Understanding Money",
            niche: "Finance",
            age_group: "Toddler",
            difficulty: "Beginner",
            learning_stage: "basic",
            started_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            completed_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000 + 30 * 60 * 1000).toISOString(),
            time_spent_minutes: 30,
            activities_completed: ["Money Sorting", "Shopping Pretend Play"],
            parent_rating: 5,
            child_engagement: "high",
            notes: "Child loved the shopping game!",
            status: "completed"
          },
          {
            session_id: "session_2",
            topic_id: "Finance_Coins_and_Bills",
            topic_name: "Coins and Bills",
            niche: "Finance",
            age_group: "Toddler",
            difficulty: "Beginner",
            learning_stage: "basic",
            started_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
            completed_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000 + 25 * 60 * 1000).toISOString(),
            time_spent_minutes: 25,
            activities_completed: ["Coin Sorting", "Value Matching"],
            parent_rating: 4,
            child_engagement: "medium",
            notes: "Good understanding of coin values",
            status: "completed"
          }
        ],
        achievements: [
          {
            id: "first_topic",
            name: "First Steps",
            description: "Completed your first learning topic",
            icon: "🌟",
            unlocked_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
          }
        ],
        progress_summary: {
          total_sessions: 2,
          total_topics_completed: 2,
          total_learning_time_minutes: 55,
          total_learning_time_hours: 0.92,
          learning_streak_days: 2,
          average_session_length_minutes: 27.5,
          average_engagement_score: 4.5,
          average_parent_rating: 4.5,
          niche_progress: {
            "Finance": {
              completed: 2,
              total_time: 55,
              sessions: []
            }
          },
          stage_progress: {
            "basic": {
              completed: 2,
              total_time: 55
            }
          },
          difficulty_progress: {
            "Beginner": {
              completed: 2,
              total_time: 55
            }
          },
          recent_activity: {
            last_week: 2,
            last_month: 2,
            last_3_months: 2
          },
          strengths: ["high engagement and motivation"],
          areas_for_growth: ["building regular learning habits"],
          recommended_next_topics: [
            {
              type: "niche_continuation",
              niche: "Finance",
              reason: "High success rate in Finance (avg rating: 4.5)",
              priority: "high"
            }
          ]
        }
      };

      setLearningHistory(sampleHistory);
    } catch (error) {
      console.error('Error loading learning history:', error);
    }
  };

  const handleChildSelect = async (child) => {
    setSelectedChild(child);
    await loadLearningHistory(child.id);
  };

  const formatTime = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };


  if (loading) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f5f5f5'
      }}>
        <Box sx={{ textAlign: 'center' }}>
          <CircularProgress size={80} sx={{ mb: 2 }} />
          <Typography variant="h6" color="text.secondary">
            Loading learning progress...
          </Typography>
        </Box>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f5f5f5'
      }}>
        <Alert severity="error" sx={{ maxWidth: 500 }}>
          <Typography variant="h6" gutterBottom>
            Error Loading Progress
          </Typography>
          <Typography>{error}</Typography>
        </Alert>
      </Box>
    );
  }

  if (!learningHistory) {
    return (
      <Box sx={{ 
        minHeight: '100vh', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        backgroundColor: '#f5f5f5'
      }}>
        <Paper sx={{ p: 4, textAlign: 'center', maxWidth: 400 }}>
          <School sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            No Learning History
          </Typography>
          <Typography color="text.secondary">
            Start learning to see your progress!
          </Typography>
        </Paper>
      </Box>
    );
  }

  const progress = learningHistory.progress_summary;

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <Paper elevation={1} sx={{ mb: 3 }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h3" component="h1" gutterBottom color="primary">
            Learning Progress Tracker
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Track your child's learning journey, achievements, and progress
          </Typography>
        </Box>
      </Paper>

      <Box sx={{ maxWidth: '1200px', mx: 'auto', p: 3 }}>
        {/* Child Selection */}
        {children.length > 0 && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Select Child
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2 }}>
                {children.map((child) => (
                  <Button
                    key={child.id}
                    onClick={() => handleChildSelect(child)}
                    variant={selectedChild?.id === child.id ? 'contained' : 'outlined'}
                    sx={{ 
                      minWidth: 200,
                      textAlign: 'left',
                      justifyContent: 'flex-start',
                      p: 2
                    }}
                  >
                    <Box>
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>
                        {child.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Age: {child.age} • {child.learningStyle}
                      </Typography>
                    </Box>
                  </Button>
                ))}
              </Box>
            </CardContent>
          </Card>
        )}

        {/* Progress Overview */}
        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <CardContent>
                <Typography variant="h3" color="primary.main" gutterBottom>
                  {progress.total_topics_completed}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Topics Completed
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <CardContent>
                <Typography variant="h3" color="success.main" gutterBottom>
                  {formatTime(progress.total_learning_time_minutes)}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Total Learning Time
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <CardContent>
                <Typography variant="h3" color="secondary.main" gutterBottom>
                  {progress.learning_streak_days}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Learning Streak (Days)
                </Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <Card sx={{ textAlign: 'center', p: 2 }}>
              <CardContent>
                <Typography variant="h3" color="warning.main" gutterBottom>
                  {progress.average_parent_rating}/5
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Average Rating
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          {/* Learning Sessions */}
          <Grid item xs={12} lg={8}>
            <Card>
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h6" component="h2">
                  Recent Learning Sessions
                </Typography>
              </Box>
              <List>
                {learningHistory.learning_sessions.map((session, index) => (
                  <React.Fragment key={session.session_id}>
                    <ListItem sx={{ p: 3 }}>
                      <ListItemAvatar>
                        <Avatar sx={{ bgcolor: 'primary.main' }}>
                          <School />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box>
                            <Typography variant="h6" gutterBottom>
                              {session.topic_name}
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                              <Chip label={session.niche} size="small" color="primary" />
                              <Chip label={session.age_group} size="small" color="success" />
                              <Chip label={session.difficulty} size="small" color="secondary" />
                              <Chip label={session.learning_stage} size="small" color="warning" />
                            </Box>
                            <Grid container spacing={2} sx={{ mb: 2 }}>
                              <Grid item xs={6}>
                                <Typography variant="body2" color="text.secondary">
                                  <Timer sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                                  Time: {formatTime(session.time_spent_minutes)}
                                </Typography>
                              </Grid>
                              <Grid item xs={6}>
                                <Typography variant="body2" color="text.secondary">
                                  <TrendingUp sx={{ fontSize: 16, mr: 1, verticalAlign: 'middle' }} />
                                  Engagement: {session.child_engagement}
                                </Typography>
                              </Grid>
                            </Grid>
                            {session.activities_completed.length > 0 && (
                              <Box sx={{ mb: 2 }}>
                                <Typography variant="body2" color="text.secondary" gutterBottom>
                                  Activities:
                                </Typography>
                                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                  {session.activities_completed.map((activity, idx) => (
                                    <Chip 
                                      key={idx} 
                                      label={activity} 
                                      size="small" 
                                      color="success" 
                                      variant="outlined"
                                    />
                                  ))}
                                </Box>
                              </Box>
                            )}
                            {session.notes && (
                              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                "{session.notes}"
                              </Typography>
                            )}
                          </Box>
                        }
                        secondary={
                          <Box sx={{ textAlign: 'right' }}>
                            <Typography variant="body2" color="text.secondary">
                              {new Date(session.completed_at).toLocaleDateString()}
                            </Typography>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', mt: 1 }}>
                              <Star sx={{ color: 'warning.main', mr: 0.5 }} />
                              <Typography variant="h6" color="warning.main">
                                {session.parent_rating}/5
                              </Typography>
                            </Box>
                          </Box>
                        }
                      />
                    </ListItem>
                    {index < learningHistory.learning_sessions.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Card>
          </Grid>

          {/* Achievements and Insights */}
          <Grid item xs={12} lg={4}>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
              {/* Achievements */}
              <Card>
                <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                  <Typography variant="h6" component="h2">
                    Achievements
                  </Typography>
                </Box>
                <Box sx={{ p: 2 }}>
                  {learningHistory.achievements.length > 0 ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {learningHistory.achievements.map((achievement) => (
                        <Paper 
                          key={achievement.id} 
                          sx={{ 
                            p: 2, 
                            background: 'linear-gradient(135deg, #fff3cd 0%, #ffeaa7 100%)',
                            border: '1px solid #ffc107'
                          }}
                        >
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Avatar sx={{ bgcolor: 'warning.main', width: 48, height: 48 }}>
                              <EmojiEvents />
                            </Avatar>
                            <Box>
                              <Typography variant="subtitle1" fontWeight="bold">
                                {achievement.name}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {achievement.description}
                              </Typography>
                              <Typography variant="caption" color="text.secondary">
                                {new Date(achievement.unlocked_at).toLocaleDateString()}
                              </Typography>
                            </Box>
                          </Box>
                        </Paper>
                      ))}
                    </Box>
                  ) : (
                    <Box sx={{ textAlign: 'center', py: 4 }}>
                      <Typography color="text.secondary">
                        No achievements yet. Keep learning!
                      </Typography>
                    </Box>
                  )}
                </Box>
              </Card>

              {/* Strengths */}
              {progress.strengths.length > 0 && (
                <Card>
                  <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                    <Typography variant="h6" component="h2">
                      Strengths
                    </Typography>
                  </Box>
                  <Box sx={{ p: 2 }}>
                    <List dense>
                      {progress.strengths.map((strength, idx) => (
                        <ListItem key={idx} sx={{ py: 0.5 }}>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'success.main', width: 24, height: 24 }}>
                              <CheckCircle sx={{ fontSize: 16 }} />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText primary={strength} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </Card>
              )}

              {/* Growth Areas */}
              {progress.areas_for_growth.length > 0 && (
                <Card>
                  <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                    <Typography variant="h6" component="h2">
                      Areas for Growth
                    </Typography>
                  </Box>
                  <Box sx={{ p: 2 }}>
                    <List dense>
                      {progress.areas_for_growth.map((area, idx) => (
                        <ListItem key={idx} sx={{ py: 0.5 }}>
                          <ListItemAvatar>
                            <Avatar sx={{ bgcolor: 'info.main', width: 24, height: 24 }}>
                              <Lightbulb sx={{ fontSize: 16 }} />
                            </Avatar>
                          </ListItemAvatar>
                          <ListItemText primary={area} />
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                </Card>
              )}

              {/* Recommendations */}
              {progress.recommended_next_topics.length > 0 && (
                <Card>
                  <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                    <Typography variant="h6" component="h2">
                      Recommendations
                    </Typography>
                  </Box>
                  <Box sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {progress.recommended_next_topics.map((rec, idx) => (
                        <Paper 
                          key={idx} 
                          sx={{ 
                            p: 2, 
                            bgcolor: 'primary.50', 
                            border: '1px solid',
                            borderColor: 'primary.200'
                          }}
                        >
                          <Typography variant="subtitle2" color="primary.main" gutterBottom>
                            {rec.type.replace('_', ' ')}
                          </Typography>
                          <Typography variant="body2" color="primary.dark" gutterBottom>
                            {rec.reason}
                          </Typography>
                          <Chip 
                            label={`Priority: ${rec.priority}`} 
                            size="small" 
                            color="primary" 
                            variant="outlined"
                          />
                        </Paper>
                      ))}
                    </Box>
                  </Box>
                </Card>
              )}
            </Box>
          </Grid>
        </Grid>

        {/* Progress Charts */}
        <Grid container spacing={3} sx={{ mt: 3 }}>
          {/* Niche Progress */}
          <Grid item xs={12} lg={6}>
            <Card>
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h6" component="h2">
                  Progress by Niche
                </Typography>
              </Box>
              <Box sx={{ p: 3 }}>
                {Object.entries(progress.niche_progress).map(([niche, data]) => (
                  <Box key={niche} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle2" fontWeight="bold">
                        {niche}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {data.completed} topics • {formatTime(data.total_time)}
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={(data.completed / Math.max(progress.total_topics_completed, 1)) * 100}
                      sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        backgroundColor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: 'primary.main'
                        }
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </Card>
          </Grid>

          {/* Stage Progress */}
          <Grid item xs={12} lg={6}>
            <Card>
              <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                <Typography variant="h6" component="h2">
                  Progress by Learning Stage
                </Typography>
              </Box>
              <Box sx={{ p: 3 }}>
                {Object.entries(progress.stage_progress).map(([stage, data]) => (
                  <Box key={stage} sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                      <Typography variant="subtitle2" fontWeight="bold" sx={{ textTransform: 'capitalize' }}>
                        {stage}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {data.completed} topics • {formatTime(data.total_time)}
                      </Typography>
                    </Box>
                    <LinearProgress 
                      variant="determinate" 
                      value={(data.completed / Math.max(progress.total_topics_completed, 1)) * 100}
                      sx={{ 
                        height: 8, 
                        borderRadius: 4,
                        backgroundColor: 'grey.200',
                        '& .MuiLinearProgress-bar': {
                          backgroundColor: 'success.main'
                        }
                      }}
                    />
                  </Box>
                ))}
              </Box>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default LearningProgressTracker;
