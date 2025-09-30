import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import MinimalBackButton from '../components/ui/MinimalBackButton';

const ProgressDashboard = () => {
  const { currentUser, userProfile } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [viewMode, setViewMode] = useState('child'); // 'child' or 'parent'
  const [selectedChild, setSelectedChild] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock data - in real app, this would come from Firebase
  const mockChildren = [
    {
      id: 'child_001',
      name: 'Emma Johnson',
      age: 7,
      grade: '2nd Grade',
      avatar: '👧',
      joinDate: '2024-08-15',
      totalTopics: 45,
      completedTopics: 32,
      inProgressTopics: 8,
      pendingTopics: 5,
      totalActivities: 90,
      completedActivities: 64,
      averageScore: 87,
      learningStreak: 12,
      favoriteNiche: 'Finance',
      learningStyle: 'Visual',
      lastActivity: '2024-09-12T14:30:00Z',
      weeklyProgress: [
        { week: 'This Week', topicsCompleted: 8, activitiesCompleted: 16, score: 85, hours: 4.5 },
        { week: 'Last Week', topicsCompleted: 12, activitiesCompleted: 24, score: 88, hours: 6.2 },
        { week: '2 Weeks Ago', topicsCompleted: 10, activitiesCompleted: 20, score: 87, hours: 5.8 }
      ],
      monthlyProgress: [
        { month: 'September 2024', topicsCompleted: 20, activitiesCompleted: 40, score: 87, hours: 16.5 },
        { month: 'August 2024', topicsCompleted: 12, activitiesCompleted: 24, score: 85, hours: 12.3 }
      ],
      yearlyProgress: {
        totalTopics: 32,
        totalActivities: 64,
        averageScore: 87,
        totalHours: 28.8,
        achievements: 8,
        favoriteNiche: 'Finance',
        learningStreak: 12
      },
      currentPlan: {
        month: 'September 2024',
        plannedTopics: 25,
        completedTopics: 20,
        plannedActivities: 50,
        completedActivities: 40,
        focusAreas: ['Finance Basics', 'Money Management', 'Saving Goals'],
        upcomingTopics: ['Investment Basics', 'Budget Planning', 'Financial Goals']
      },
      achievements: [
        { title: 'Finance Explorer', description: 'Completed 10 Finance topics', date: '2024-09-10', icon: '🏆', type: 'niche' },
        { title: 'Learning Streak', description: '12 days in a row', date: '2024-09-12', icon: '🔥', type: 'streak' },
        { title: 'High Scorer', description: 'Average score above 85%', date: '2024-09-08', icon: '⭐', type: 'performance' },
        { title: 'Activity Master', description: 'Completed 50+ activities', date: '2024-09-05', icon: '🎯', type: 'milestone' },
        { title: 'Quick Learner', description: 'Completed 5 topics in one day', date: '2024-09-03', icon: '⚡', type: 'speed' },
        { title: 'Perfect Score', description: 'Got 100% on 3 activities', date: '2024-08-28', icon: '💯', type: 'performance' }
      ],
      recentActivities: [
        { topic: 'Understanding Money', niche: 'Finance', score: 95, date: '2024-09-12', time: '2:30 PM' },
        { topic: 'Basic Business Concepts', niche: 'Entrepreneurship', score: 88, date: '2024-09-11', time: '4:15 PM' },
        { topic: 'Public Speaking', niche: 'Communication', score: 82, date: '2024-09-10', time: '3:45 PM' },
        { topic: 'Saving vs Spending', niche: 'Finance', score: 92, date: '2024-09-09', time: '2:00 PM' },
        { topic: 'Teamwork Skills', niche: 'Communication', score: 85, date: '2024-09-08', time: '5:30 PM' }
      ],
      learningInsights: {
        strengths: ['Finance topics', 'Visual learning', 'Consistent practice'],
        improvements: ['AI concepts', 'Complex problem solving'],
        recommendations: ['Try more hands-on activities', 'Practice with real money examples'],
        nextGoals: ['Complete Finance niche', 'Start Entrepreneurship basics', 'Improve AI understanding']
      }
    }
  ];

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setSelectedChild(mockChildren[0]);
      setLoading(false);
    }, 1000);
  }, []);

  const getProgressPercentage = (completed, total) => {
    return total > 0 ? Math.round((completed / total) * 100) : 0;
  };

  const getScoreColor = (score) => {
    if (score >= 90) return '#22c55e';
    if (score >= 80) return '#3b82f6';
    if (score >= 70) return '#f59e0b';
    return '#ef4444';
  };

  const getStreakColor = (streak) => {
    if (streak >= 10) return '#22c55e';
    if (streak >= 5) return '#f59e0b';
    return '#ef4444';
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', color: '#64748b', marginBottom: '16px' }}>
            📊 Loading your progress...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '20px',
      position: 'relative'
    }}>
      <MinimalBackButton 
        heroColors={{
          backgroundColor: '#f8fafc',
          primaryColor: '#3b82f6',
          nicheColor: '#1e40af'
        }}
      />
      {/* Header */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '32px',
        marginBottom: '24px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h1 style={{ margin: '0 0 8px 0', fontSize: '2.5rem', fontWeight: '700', color: '#1e293b' }}>
              {viewMode === 'child' ? '🌟 My Learning Progress' : '👨‍👩‍👧‍👦 Family Progress'}
            </h1>
            <p style={{ margin: 0, color: '#64748b', fontSize: '1.1rem' }}>
              {viewMode === 'child' 
                ? 'Track your achievements, progress, and learning journey!' 
                : 'Monitor your children\'s learning progress and achievements'
              }
            </p>
          </div>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              onClick={() => setViewMode(viewMode === 'child' ? 'parent' : 'child')}
              style={{
                padding: '12px 24px',
                background: viewMode === 'child' ? '#3b82f6' : '#8b5cf6',
                color: '#ffffff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}
            >
              {viewMode === 'child' ? '👨‍👩‍👧‍👦 Parent View' : '🌟 Child View'}
            </button>
          </div>
        </div>

        {/* Child Selector for Parent View */}
        {viewMode === 'parent' && (
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {mockChildren.map((child) => (
              <button
                key={child.id}
                onClick={() => setSelectedChild(child)}
                style={{
                  padding: '12px 20px',
                  background: selectedChild?.id === child.id ? '#3b82f6' : '#f8fafc',
                  color: selectedChild?.id === child.id ? '#ffffff' : '#64748b',
                  border: `2px solid ${selectedChild?.id === child.id ? '#3b82f6' : '#e2e8f0'}`,
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.3s ease'
                }}
              >
                <span style={{ fontSize: '1.2rem' }}>{child.avatar}</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: '600' }}>{child.name}</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                    {child.age} years • {child.grade}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>

      {selectedChild && (
        <>
          {/* Quick Stats Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '20px',
            marginBottom: '24px',
            position: 'relative'
          }}>
            {/* Sample Data Overlay */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: 'rgba(255, 255, 255, 0.3)',
              borderRadius: '16px',
              pointerEvents: 'none',
              zIndex: 10,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <div style={{
                background: 'rgba(0, 0, 0, 0.1)',
                color: '#64748b',
                padding: '4px 8px',
                borderRadius: '6px',
                fontSize: '0.8rem',
                fontWeight: '600',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Sample Data
              </div>
            </div>
            
            <div style={{
              background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
              color: 'white',
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'center',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
              position: 'relative'
            }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '8px' }}>
                {getProgressPercentage(selectedChild.completedTopics, selectedChild.totalTopics)}%
              </div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Overall Progress</div>
            </div>
            
            <div style={{
              background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
              color: 'white',
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'center',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
              position: 'relative'
            }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '8px' }}>
                {selectedChild.averageScore}%
              </div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Average Score</div>
            </div>
            
            <div style={{
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              color: 'white',
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'center',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
              position: 'relative'
            }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '8px' }}>
                {selectedChild.learningStreak}
              </div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Day Streak</div>
            </div>
            
            <div style={{
              background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
              color: 'white',
              borderRadius: '16px',
              padding: '24px',
              textAlign: 'center',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
              position: 'relative'
            }}>
              <div style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '8px' }}>
                {selectedChild.achievements.length}
              </div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Achievements</div>
            </div>
          </div>

          {/* Tabs */}
          <div style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            marginBottom: '24px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
              {['overview', 'achievements', 'progress', 'plans', 'insights'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  style={{
                    padding: '12px 24px',
                    background: activeTab === tab ? '#3b82f6' : '#f8fafc',
                    color: activeTab === tab ? '#ffffff' : '#64748b',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    textTransform: 'capitalize'
                  }}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {activeTab === 'overview' && (
              <div>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '1.5rem', fontWeight: '600', color: '#1e293b' }}>
                  📊 {viewMode === 'child' ? 'My' : selectedChild.name + '\'s'} Learning Overview
                </h3>
                
                {/* Progress Summary */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                  <div style={{
                    padding: '24px',
                    background: '#f8fafc',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <h4 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: '600', color: '#1e293b' }}>
                      📚 Topics Progress
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#22c55e' }}>
                          {selectedChild.completedTopics}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Completed</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#f59e0b' }}>
                          {selectedChild.inProgressTopics}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>In Progress</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ef4444' }}>
                          {selectedChild.pendingTopics}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Pending</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#3b82f6' }}>
                          {selectedChild.totalTopics}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Total</div>
                      </div>
                    </div>
                  </div>

                  <div style={{
                    padding: '24px',
                    background: '#f8fafc',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <h4 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: '600', color: '#1e293b' }}>
                      🎯 Learning Stats
                    </h4>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#8b5cf6' }}>
                          {selectedChild.favoriteNiche}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Favorite Niche</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#06b6d4' }}>
                          {selectedChild.learningStyle}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Learning Style</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#f59e0b' }}>
                          {selectedChild.completedActivities}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Activities Done</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: getStreakColor(selectedChild.learningStreak) }}>
                          {selectedChild.learningStreak}
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Day Streak</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activities */}
                <div>
                  <h4 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: '600', color: '#1e293b' }}>
                    🕒 Recent Activities
                  </h4>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {selectedChild.recentActivities.map((activity, index) => (
                      <div key={index} style={{
                        padding: '16px',
                        background: '#f8fafc',
                        borderRadius: '8px',
                        border: '1px solid #e2e8f0',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div>
                          <div style={{ fontWeight: '600', color: '#1e293b', marginBottom: '4px' }}>
                            {activity.topic}
                          </div>
                          <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                            {activity.niche} • {formatDate(activity.date)} at {activity.time}
                          </div>
                        </div>
                        <div style={{
                          padding: '6px 12px',
                          background: getScoreColor(activity.score),
                          color: 'white',
                          borderRadius: '6px',
                          fontSize: '0.9rem',
                          fontWeight: '600'
                        }}>
                          {activity.score}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'achievements' && (
              <div>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '1.5rem', fontWeight: '600', color: '#1e293b' }}>
                  🏆 {viewMode === 'child' ? 'My' : selectedChild.name + '\'s'} Achievements
                </h3>
                
                <div style={{ 
                  display: 'grid', 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
                  gap: '20px',
                  position: 'relative'
                }}>
                  {/* Sample Data Overlay for Achievements */}
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: 'rgba(255, 255, 255, 0.3)',
                    borderRadius: '16px',
                    pointerEvents: 'none',
                    zIndex: 10,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <div style={{
                      background: 'rgba(0, 0, 0, 0.1)',
                      color: '#64748b',
                      padding: '4px 8px',
                      borderRadius: '6px',
                      fontSize: '0.8rem',
                      fontWeight: '600',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px'
                    }}>
                      Sample Data
                    </div>
                  </div>
                  
                  {selectedChild.achievements.map((achievement, index) => (
                    <div key={index} style={{
                      padding: '24px',
                      background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                      borderRadius: '16px',
                      border: '1px solid #f59e0b',
                      textAlign: 'center',
                      position: 'relative'
                    }}>
                      <div style={{ fontSize: '3rem', marginBottom: '16px' }}>
                        {achievement.icon}
                      </div>
                      <h4 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', fontWeight: '600', color: '#92400e' }}>
                        {achievement.title}
                      </h4>
                      <p style={{ margin: '0 0 12px 0', color: '#92400e', fontSize: '0.9rem' }}>
                        {achievement.description}
                      </p>
                      <div style={{ fontSize: '0.8rem', color: '#a16207', opacity: 0.8 }}>
                        Earned on {formatDate(achievement.date)}
                      </div>
                      <div style={{
                        marginTop: '8px',
                        padding: '4px 8px',
                        background: 'rgba(146, 64, 14, 0.1)',
                        borderRadius: '4px',
                        fontSize: '0.7rem',
                        color: '#92400e',
                        textTransform: 'uppercase',
                        fontWeight: '600'
                      }}>
                        {achievement.type}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'progress' && (
              <div>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '1.5rem', fontWeight: '600', color: '#1e293b' }}>
                  📈 {viewMode === 'child' ? 'My' : selectedChild.name + '\'s'} Progress Timeline
                </h3>
                
                {/* Weekly Progress */}
                <div style={{ marginBottom: '32px' }}>
                  <h4 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: '600', color: '#1e293b' }}>
                    📅 Weekly Progress
                  </h4>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {selectedChild.weeklyProgress.map((week, index) => (
                      <div key={index} style={{
                        padding: '20px',
                        background: '#f8fafc',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <h5 style={{ margin: 0, fontSize: '1rem', fontWeight: '600', color: '#1e293b' }}>
                            {week.week}
                          </h5>
                          <div style={{
                            padding: '4px 12px',
                            background: getScoreColor(week.score),
                            color: 'white',
                            borderRadius: '6px',
                            fontSize: '0.9rem',
                            fontWeight: '600'
                          }}>
                            {week.score}% Avg
                          </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '16px' }}>
                          <div>
                            <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#3b82f6' }}>
                              {week.topicsCompleted}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Topics</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#22c55e' }}>
                              {week.activitiesCompleted}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Activities</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#f59e0b' }}>
                              {week.hours}h
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Learning Time</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Monthly Progress */}
                <div style={{ marginBottom: '32px' }}>
                  <h4 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: '600', color: '#1e293b' }}>
                    📆 Monthly Progress
                  </h4>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {selectedChild.monthlyProgress.map((month, index) => (
                      <div key={index} style={{
                        padding: '20px',
                        background: '#f8fafc',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <h5 style={{ margin: 0, fontSize: '1rem', fontWeight: '600', color: '#1e293b' }}>
                            {month.month}
                          </h5>
                          <div style={{
                            padding: '4px 12px',
                            background: getScoreColor(month.score),
                            color: 'white',
                            borderRadius: '6px',
                            fontSize: '0.9rem',
                            fontWeight: '600'
                          }}>
                            {month.score}% Avg
                          </div>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '16px' }}>
                          <div>
                            <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#3b82f6' }}>
                              {month.topicsCompleted}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Topics</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#22c54e' }}>
                              {month.activitiesCompleted}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Activities</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#f59e0b' }}>
                              {month.hours}h
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Learning Time</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Yearly Summary */}
                <div>
                  <h4 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: '600', color: '#1e293b' }}>
                    🎯 Yearly Summary
                  </h4>
                  <div style={{
                    padding: '24px',
                    background: 'linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%)',
                    borderRadius: '12px',
                    border: '1px solid #3b82f6'
                  }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px' }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1e40af', marginBottom: '4px' }}>
                          {selectedChild.yearlyProgress.totalTopics}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: '#1e40af' }}>Total Topics</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1e40af', marginBottom: '4px' }}>
                          {selectedChild.yearlyProgress.totalActivities}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: '#1e40af' }}>Total Activities</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1e40af', marginBottom: '4px' }}>
                          {selectedChild.yearlyProgress.averageScore}%
                        </div>
                        <div style={{ fontSize: '0.9rem', color: '#1e40af' }}>Average Score</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1e40af', marginBottom: '4px' }}>
                          {selectedChild.yearlyProgress.totalHours}h
                        </div>
                        <div style={{ fontSize: '0.9rem', color: '#1e40af' }}>Learning Time</div>
                      </div>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '2rem', fontWeight: '700', color: '#1e40af', marginBottom: '4px' }}>
                          {selectedChild.yearlyProgress.achievements}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: '#1e40af' }}>Achievements</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'plans' && (
              <div>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '1.5rem', fontWeight: '600', color: '#1e293b' }}>
                  📋 {viewMode === 'child' ? 'My' : selectedChild.name + '\'s'} Learning Plans
                </h3>
                
                {/* Current Month Plan */}
                <div style={{ marginBottom: '32px' }}>
                  <h4 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: '600', color: '#1e293b' }}>
                    📅 Current Month Plan - {selectedChild.currentPlan.month}
                  </h4>
                  <div style={{
                    padding: '24px',
                    background: '#f8fafc',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                      <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#3b82f6', marginBottom: '4px' }}>
                          {selectedChild.currentPlan.completedTopics}/{selectedChild.currentPlan.plannedTopics}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Topics Progress</div>
                        <div style={{
                          width: '100%',
                          height: '6px',
                          background: '#e2e8f0',
                          borderRadius: '3px',
                          marginTop: '8px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${getProgressPercentage(selectedChild.currentPlan.completedTopics, selectedChild.currentPlan.plannedTopics)}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)',
                            transition: 'width 0.3s ease'
                          }}></div>
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#22c55e', marginBottom: '4px' }}>
                          {selectedChild.currentPlan.completedActivities}/{selectedChild.currentPlan.plannedActivities}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Activities Progress</div>
                        <div style={{
                          width: '100%',
                          height: '6px',
                          background: '#e2e8f0',
                          borderRadius: '3px',
                          marginTop: '8px',
                          overflow: 'hidden'
                        }}>
                          <div style={{
                            width: `${getProgressPercentage(selectedChild.currentPlan.completedActivities, selectedChild.currentPlan.plannedActivities)}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, #22c55e 0%, #16a34a 100%)',
                            transition: 'width 0.3s ease'
                          }}></div>
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
                      <div>
                        <h5 style={{ margin: '0 0 12px 0', fontSize: '1rem', fontWeight: '600', color: '#1e293b' }}>
                          🎯 Focus Areas This Month
                        </h5>
                        <div style={{ display: 'grid', gap: '8px' }}>
                          {selectedChild.currentPlan.focusAreas.map((area, index) => (
                            <div key={index} style={{
                              padding: '8px 12px',
                              background: '#dbeafe',
                              borderRadius: '6px',
                              fontSize: '0.9rem',
                              color: '#1e40af'
                            }}>
                              {area}
                            </div>
                          ))}
                        </div>
                      </div>
                      <div>
                        <h5 style={{ margin: '0 0 12px 0', fontSize: '1rem', fontWeight: '600', color: '#1e293b' }}>
                          🔮 Upcoming Topics
                        </h5>
                        <div style={{ display: 'grid', gap: '8px' }}>
                          {selectedChild.currentPlan.upcomingTopics.map((topic, index) => (
                            <div key={index} style={{
                              padding: '8px 12px',
                              background: '#fef3c7',
                              borderRadius: '6px',
                              fontSize: '0.9rem',
                              color: '#92400e'
                            }}>
                              {topic}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'insights' && (
              <div>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '1.5rem', fontWeight: '600', color: '#1e293b' }}>
                  💡 {viewMode === 'child' ? 'My' : selectedChild.name + '\'s'} Learning Insights
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
                  <div style={{
                    padding: '24px',
                    background: '#f0fdf4',
                    borderRadius: '12px',
                    border: '1px solid #22c55e'
                  }}>
                    <h4 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: '600', color: '#166534' }}>
                      ✅ Strengths
                    </h4>
                    <div style={{ display: 'grid', gap: '8px' }}>
                      {selectedChild.learningInsights.strengths.map((strength, index) => (
                        <div key={index} style={{
                          padding: '8px 12px',
                          background: 'rgba(34, 197, 94, 0.1)',
                          borderRadius: '6px',
                          fontSize: '0.9rem',
                          color: '#166534'
                        }}>
                          {strength}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div style={{
                    padding: '24px',
                    background: '#fef3c7',
                    borderRadius: '12px',
                    border: '1px solid #f59e0b'
                  }}>
                    <h4 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: '600', color: '#92400e' }}>
                      📈 Areas for Improvement
                    </h4>
                    <div style={{ display: 'grid', gap: '8px' }}>
                      {selectedChild.learningInsights.improvements.map((improvement, index) => (
                        <div key={index} style={{
                          padding: '8px 12px',
                          background: 'rgba(245, 158, 11, 0.1)',
                          borderRadius: '6px',
                          fontSize: '0.9rem',
                          color: '#92400e'
                        }}>
                          {improvement}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div style={{
                    padding: '24px',
                    background: '#dbeafe',
                    borderRadius: '12px',
                    border: '1px solid #3b82f6'
                  }}>
                    <h4 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: '600', color: '#1e40af' }}>
                      💡 Recommendations
                    </h4>
                    <div style={{ display: 'grid', gap: '8px' }}>
                      {selectedChild.learningInsights.recommendations.map((recommendation, index) => (
                        <div key={index} style={{
                          padding: '8px 12px',
                          background: 'rgba(59, 130, 246, 0.1)',
                          borderRadius: '6px',
                          fontSize: '0.9rem',
                          color: '#1e40af'
                        }}>
                          {recommendation}
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div style={{
                    padding: '24px',
                    background: '#f3e8ff',
                    borderRadius: '12px',
                    border: '1px solid #8b5cf6'
                  }}>
                    <h4 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: '600', color: '#6b21a8' }}>
                      🎯 Next Goals
                    </h4>
                    <div style={{ display: 'grid', gap: '8px' }}>
                      {selectedChild.learningInsights.nextGoals.map((goal, index) => (
                        <div key={index} style={{
                          padding: '8px 12px',
                          background: 'rgba(139, 92, 246, 0.1)',
                          borderRadius: '6px',
                          fontSize: '0.9rem',
                          color: '#6b21a8'
                        }}>
                          {goal}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ProgressDashboard;
