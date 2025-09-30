import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { colors, spacing, typography } from '../styles/designTokens';
import MinimalBackButton from './ui/MinimalBackButton';

const Home = () => {
  const { currentUser, userProfile } = useAuth();
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalChildren: 0,
    totalPlans: 0,
    activeLearning: 0,
    completedActivities: 0
  });
  const [achievements, setAchievements] = useState([]);
  const [recentAchievements, setRecentAchievements] = useState([]);
  const [activeTab, setActiveTab] = useState('overview');
  const [viewMode, setViewMode] = useState('parent'); // Default to parent view
  const [selectedChild, setSelectedChild] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      loadDashboardData();
    } else {
      setLoading(false);
    }
  }, [currentUser]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Load children data
      const childrenRef = collection(db, `users/${currentUser.uid}/children`);
      const childrenSnapshot = await getDocs(childrenRef);
      
      const childrenList = [];
      let totalPlans = 0;
      let activeLearning = 0;
      let completedActivities = 0;

      for (const childDoc of childrenSnapshot.docs) {
        const childData = childDoc.data();
        const child = {
          id: childDoc.id,
          name: childData.child_name || childData.name || 'Unknown Child',
          age: childData.child_age || childData.age || 5,
          interests: Array.isArray(childData.interests) ? childData.interests : [],
          learningStyle: childData.preferred_learning_style || childData.learning_style || 'mixed',
          planType: childData.plan_type || 'hybrid',
          goals: Array.isArray(childData.goals) ? childData.goals : [],
          plans: childData.plans || {},
          createdAt: childData.created_at || null,
          updatedAt: childData.updated_at || null
        };

        // Count plans and activities
        if (child.plans && typeof child.plans === 'object') {
          totalPlans += Object.keys(child.plans).length;
          activeLearning += Object.keys(child.plans).length > 0 ? 1 : 0;
        }

        childrenList.push(child);
      }

      setChildren(childrenList);
      setStats({
        totalChildren: childrenList.length,
        totalPlans,
        activeLearning,
        completedActivities: Math.floor(totalPlans * 0.3) // Mock data
      });

      // Set first child as selected
      if (childrenList.length > 0) {
        setSelectedChild(childrenList[0]);
      }

      // Load achievements data
      loadAchievements();
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAchievements = () => {
    // Sample achievements data - in real app, this would come from the database
    const sampleAchievements = [
      { 
        id: 1, 
        title: 'Finance Explorer', 
        description: 'Completed 10 Finance topics', 
        icon: '🏆', 
        type: 'niche',
        earnedAt: '2024-09-10',
        rarity: 'gold',
        points: 100
      },
      { 
        id: 2, 
        title: 'Learning Streak', 
        description: '12 days in a row', 
        icon: '🔥', 
        type: 'streak',
        earnedAt: '2024-09-12',
        rarity: 'silver',
        points: 75
      },
      { 
        id: 3, 
        title: 'High Scorer', 
        description: 'Average score above 85%', 
        icon: '⭐', 
        type: 'performance',
        earnedAt: '2024-09-08',
        rarity: 'gold',
        points: 90
      },
      { 
        id: 4, 
        title: 'Activity Master', 
        description: 'Completed 50+ activities', 
        icon: '🎯', 
        type: 'milestone',
        earnedAt: '2024-09-05',
        rarity: 'platinum',
        points: 150
      },
      { 
        id: 5, 
        title: 'Quick Learner', 
        description: 'Completed 5 topics in one day', 
        icon: '⚡', 
        type: 'speed',
        earnedAt: '2024-09-03',
        rarity: 'silver',
        points: 60
      },
      { 
        id: 6, 
        title: 'Perfect Score', 
        description: 'Got 100% on 3 activities', 
        icon: '💯', 
        type: 'performance',
        earnedAt: '2024-08-28',
        rarity: 'gold',
        points: 120
      }
    ];

    setAchievements(sampleAchievements);
    setRecentAchievements(sampleAchievements.slice(0, 3)); // Show 3 most recent
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'completed': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return '🟢';
      case 'pending': return '🟡';
      case 'completed': return '🔵';
      default: return '⚪';
    }
  };

  const containerStyle = {
    minHeight: '100vh',
    background: viewMode === 'child' 
      ? 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)'  // Child: Warm yellow theme
      : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', // Parent: Cool gray theme
    fontFamily: typography.fontFamily.primary,
    transition: 'background 0.3s ease',
    position: 'relative' // Needed for MinimalBackButton positioning
  };

  const headerStyle = {
    background: viewMode === 'child' 
      ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'  // Child: Orange theme
      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Parent: Blue theme
    color: 'white',
    padding: `${spacing['2xl']} ${spacing.xl}`,
    paddingTop: '5rem', // Add top padding to account for back button
    marginBottom: spacing.xl,
    transition: 'background 0.3s ease'
  };

  const cardStyle = {
    background: 'white',
    borderRadius: '16px',
    padding: spacing.xl,
    boxShadow: viewMode === 'child' 
      ? '0 4px 6px rgba(245, 158, 11, 0.1)'  // Child: Orange shadow
      : '0 4px 6px rgba(0, 0, 0, 0.05)',     // Parent: Gray shadow
    border: viewMode === 'child' 
      ? '1px solid #fbbf24'                   // Child: Orange border
      : '1px solid #e2e8f0',                  // Parent: Gray border
    transition: 'all 0.3s ease',
  };

  const statCardStyle = {
    ...cardStyle,
    textAlign: 'center',
    cursor: 'pointer',
  };

  const buttonStyle = {
    background: viewMode === 'child' 
      ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'  // Child: Orange theme
      : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)', // Parent: Blue theme
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: `${spacing.md} ${spacing.xl}`,
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    display: 'inline-block',
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          flexDirection: 'column',
          gap: spacing.lg
        }}>
          <div style={{
            width: '50px',
            height: '50px',
            border: '4px solid #e2e8f0',
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite'
          }}></div>
          <div style={{ color: '#64748b', fontSize: '1.1rem' }}>
            Loading your dashboard...
          </div>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div style={containerStyle}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          flexDirection: 'column',
          gap: spacing.lg,
          textAlign: 'center',
          padding: spacing.xl
        }}>
          <div style={{ fontSize: '4rem' }}>👋</div>
          <h1 style={{ fontSize: '2.5rem', color: '#1e293b', margin: 0 }}>
            Welcome to Unschooling
          </h1>
          <p style={{ fontSize: '1.2rem', color: '#64748b', maxWidth: '600px' }}>
            Your personalized learning platform is ready. Sign in to access your dashboard and start your learning journey.
          </p>
          <button
            style={buttonStyle}
            onClick={() => navigate('/login')}
          >
            Get Started
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <MinimalBackButton 
        heroColors={{
          backgroundColor: '#f8fafc',
          primaryColor: '#3b82f6',
          nicheColor: '#1e40af'
        }}
      />
      {/* Header */}
      <div style={headerStyle}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
            <div>
          <h1 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0', fontWeight: '700' }}>
            {getGreeting()}, {userProfile?.profile?.firstName || 'there'}! 👋
          </h1>
          <p style={{ fontSize: '1.2rem', margin: 0, opacity: 0.9 }}>
            Welcome to your personalized learning dashboard
          </p>
            </div>
            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <div style={{
                padding: '8px 16px',
                background: viewMode === 'child' ? 'rgba(245, 158, 11, 0.2)' : 'rgba(59, 130, 246, 0.2)',
                borderRadius: '20px',
                border: `2px solid ${viewMode === 'child' ? '#f59e0b' : '#3b82f6'}`,
                fontSize: '0.9rem',
                fontWeight: '600',
                color: viewMode === 'child' ? '#92400e' : '#1e40af'
              }}>
                {viewMode === 'child' ? '🌟 CHILD VIEW' : '👨‍👩‍👧‍👦 PARENT VIEW'}
              </div>
              <button
                onClick={() => setViewMode(viewMode === 'child' ? 'parent' : 'child')}
                style={{
                  padding: '12px 24px',
                  background: viewMode === 'child' 
                    ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'  // Switch to parent colors
                    : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)', // Switch to child colors
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '12px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.15)',
                  transition: 'all 0.3s ease',
                  transform: 'scale(1)',
                  ':hover': {
                    transform: 'scale(1.05)'
                  }
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                }}
              >
                {viewMode === 'child' ? '👨‍👩‍👧‍👦 Switch to Parent' : '🌟 Switch to Child'}
              </button>
            </div>
          </div>

          {/* Child Selector for Parent View */}
          {viewMode === 'parent' && children.length > 0 && (
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              {children.map((child) => (
                <button
                  key={child.id}
                  onClick={() => setSelectedChild(child)}
                  style={{
                    padding: '12px 20px',
                    background: selectedChild?.id === child.id ? '#3b82f6' : 'rgba(255, 255, 255, 0.2)',
                    color: selectedChild?.id === child.id ? '#ffffff' : '#ffffff',
                    border: `2px solid ${selectedChild?.id === child.id ? '#3b82f6' : 'rgba(255, 255, 255, 0.3)'}`,
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
                  <span style={{ fontSize: '1.2rem' }}>👶</span>
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ fontWeight: '600' }}>{child.name}</div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                      {child.age} years • {child.learningStyle}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: `0 ${spacing.xl}` }}>
        {/* Quick Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: spacing.lg,
          marginBottom: spacing.xl,
          position: 'relative'
        }}>
          <div style={statCardStyle} onClick={() => navigate('/child-profile')}>
            <div style={{ fontSize: '3rem', marginBottom: spacing.md }}>👶</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: viewMode === 'child' ? '#f59e0b' : '#3b82f6', marginBottom: spacing.sm }}>
              {stats.totalChildren}
            </div>
            <div style={{ color: '#64748b', fontSize: '1.1rem' }}>
              {stats.totalChildren === 1 ? 'Child Profile' : 'Child Profiles'}
            </div>
          </div>

          <div style={statCardStyle} onClick={() => navigate('/dashboard/learning')}>
            <div style={{ fontSize: '3rem', marginBottom: spacing.md }}>📚</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#10b981', marginBottom: spacing.sm }}>
              {stats.totalPlans}
            </div>
            <div style={{ color: '#64748b', fontSize: '1.1rem' }}>
              Learning Plans
            </div>
          </div>

          <div style={statCardStyle} onClick={() => navigate('/niche')}>
            <div style={{ fontSize: '3rem', marginBottom: spacing.md }}>📈</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#8b5cf6', marginBottom: spacing.sm }}>
              {stats.activeLearning}
            </div>
            <div style={{ color: '#64748b', fontSize: '1.1rem' }}>
              Browse Topics
            </div>
          </div>

          <div style={statCardStyle} onClick={() => navigate('/dashboard/learning')}>
            <div style={{ fontSize: '3rem', marginBottom: spacing.md }}>✅</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#f59e0b', marginBottom: spacing.sm }}>
              {stats.completedActivities}
            </div>
            <div style={{ color: '#64748b', fontSize: '1.1rem' }}>
              Completed Activities
            </div>
          </div>
          
          {/* Demo Data Indicator for Stats */}
          <div style={{
            position: 'absolute',
            top: '10px',
            right: '10px',
            background: 'rgba(255, 255, 255, 0.7)',
            color: '#6b7280',
            padding: '0.25rem 0.5rem',
            borderRadius: '12px',
            fontSize: '0.7rem',
            fontWeight: '400',
            zIndex: 5
          }}>
            Sample Data
          </div>
        </div>

        {/* Tabs Section */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
            {['overview', 'achievements', 'progress', 'insights'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                style={{
                  padding: '12px 24px',
                  background: activeTab === tab 
                    ? (viewMode === 'child' ? '#f59e0b' : '#3b82f6')  // Child: Orange, Parent: Blue
                    : '#f8fafc',
                  color: activeTab === tab ? '#ffffff' : '#64748b',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  textTransform: 'capitalize',
                  transition: 'all 0.3s ease'
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
                📊 {viewMode === 'child' ? 'My' : (selectedChild ? selectedChild.name + '\'s' : 'Your')} Learning Overview
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
                    📚 Learning Stats
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#22c55e' }}>
                        {stats.totalPlans}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Learning Plans</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#f59e0b' }}>
                        {stats.activeLearning}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Active Learning</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ef4444' }}>
                        {stats.completedActivities}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Completed</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#3b82f6' }}>
                        {stats.totalChildren}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Children</div>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}

          {activeTab === 'achievements' && (
            <div>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '1.5rem', fontWeight: '600', color: '#1e293b' }}>
                🏆 {viewMode === 'child' ? 'My' : (selectedChild ? selectedChild.name + '\'s' : 'Your')} Achievements
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
                
                {achievements.slice(0, 6).map((achievement) => (
                  <div key={achievement.id} style={{
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
                      Earned on {new Date(achievement.earnedAt).toLocaleDateString()}
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
                📈 {viewMode === 'child' ? 'My' : (selectedChild ? selectedChild.name + '\'s' : 'Your')} Progress Timeline
              </h3>
              
              <div style={{
                padding: '24px',
                    background: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <h4 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: '600', color: '#1e293b' }}>
                  📅 Recent Progress
                </h4>
                <div style={{ display: 'grid', gap: '12px' }}>
                  <div style={{
                    padding: '20px',
                    background: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <h5 style={{ margin: 0, fontSize: '1rem', fontWeight: '600', color: '#1e293b' }}>
                        This Week
                      </h5>
                      <div style={{
                        padding: '4px 12px',
                        background: '#22c55e',
                        color: 'white',
                        borderRadius: '6px',
                        fontSize: '0.9rem',
                        fontWeight: '600'
                      }}>
                        85% Avg
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '16px' }}>
                      <div>
                        <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#3b82f6' }}>
                          8
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Topics</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#22c55e' }}>
                          16
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Activities</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#f59e0b' }}>
                          4.5h
                        </div>
                        <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Learning Time</div>
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
                💡 {viewMode === 'child' ? 'My' : (selectedChild ? selectedChild.name + '\'s' : 'Your')} Learning Insights
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
                    <div style={{
                      padding: '8px 12px',
                      background: 'rgba(34, 197, 94, 0.1)',
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      color: '#166534'
                    }}>
                      Consistent learning habits
                    </div>
                    <div style={{
                      padding: '8px 12px',
                      background: 'rgba(34, 197, 94, 0.1)',
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      color: '#166534'
                    }}>
                      High engagement levels
                    </div>
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
                    <div style={{
                      padding: '8px 12px',
                      background: 'rgba(59, 130, 246, 0.1)',
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      color: '#1e40af'
                    }}>
                      Try more hands-on activities
                    </div>
                    <div style={{
                      padding: '8px 12px',
                      background: 'rgba(59, 130, 246, 0.1)',
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      color: '#1e40af'
                    }}>
                      Explore new learning niches
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Parent Dashboard - Comprehensive Child Information */}
        {viewMode === 'parent' && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
            gap: spacing.xl,
            marginBottom: spacing.xl
          }}>
            
            {/* Child Overview Card */}
            {selectedChild && (
              <div style={cardStyle}>
                <h3 style={{ fontSize: '1.5rem', margin: '0 0 20px 0', color: '#1e293b', display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                  👶 {selectedChild.name}'s Overview
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: spacing.md, marginBottom: spacing.lg }}>
                  <div style={{ textAlign: 'center', padding: spacing.md, background: '#f8fafc', borderRadius: '8px' }}>
                    <div style={{ fontSize: '2rem', fontWeight: '700', color: '#3b82f6', marginBottom: spacing.sm }}>
                      {selectedChild.age}
                    </div>
                    <div style={{ color: '#64748b', fontSize: '0.9rem' }}>Years Old</div>
                  </div>
                  
                  <div style={{ textAlign: 'center', padding: spacing.md, background: '#f8fafc', borderRadius: '8px' }}>
                    <div style={{ fontSize: '2rem', fontWeight: '700', color: '#10b981', marginBottom: spacing.sm }}>
                      {selectedChild.interests?.length || 0}
                    </div>
                    <div style={{ color: '#64748b', fontSize: '0.9rem' }}>Interests</div>
                  </div>
                </div>
                
                <div style={{ marginBottom: spacing.lg }}>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem', color: '#374151' }}>Learning Style</h4>
                  <div style={{ 
                    padding: '8px 12px', 
                    background: '#dbeafe', 
                    borderRadius: '6px', 
                    display: 'inline-block',
                    fontSize: '0.9rem',
                    color: '#1e40af',
                    textTransform: 'capitalize'
                  }}>
                    {selectedChild.learningStyle || 'Visual'}
                  </div>
                        </div>
                
                <div>
                  <h4 style={{ margin: '0 0 8px 0', fontSize: '1rem', color: '#374151' }}>Current Interests</h4>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.sm }}>
                    {(selectedChild.interests || []).map((interest, index) => (
                            <span key={index} style={{
                        padding: '4px 8px',
                        background: '#ecfdf5',
                        color: '#065f46',
                        borderRadius: '4px',
                        fontSize: '0.8rem'
                            }}>
                              {interest}
                            </span>
                          ))}
                  </div>
                        </div>
                      </div>
                    )}
            
            {/* Progress Tracking Card */}
            <div style={cardStyle}>
              <h3 style={{ fontSize: '1.5rem', margin: '0 0 20px 0', color: '#1e293b', display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                📊 Progress Tracking
              </h3>
              
              <div style={{ marginBottom: spacing.lg }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing.sm }}>
                  <span style={{ fontSize: '0.9rem', color: '#64748b' }}>This Week's Activities</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1e293b' }}>12/15</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '80%', height: '100%', background: 'linear-gradient(90deg, #10b981, #059669)', borderRadius: '4px' }}></div>
                </div>
              </div>
              
              <div style={{ marginBottom: spacing.lg }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing.sm }}>
                  <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Monthly Learning Hours</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1e293b' }}>24.5h</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '65%', height: '100%', background: 'linear-gradient(90deg, #3b82f6, #1d4ed8)', borderRadius: '4px' }}></div>
                </div>
              </div>
              
              <div style={{ marginBottom: spacing.lg }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: spacing.sm }}>
                  <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Skill Development</span>
                  <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1e293b' }}>8/12</span>
                </div>
                <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ width: '67%', height: '100%', background: 'linear-gradient(90deg, #f59e0b, #d97706)', borderRadius: '4px' }}></div>
                </div>
              </div>
              
              <div style={{ 
                padding: spacing.md, 
                background: '#f0f9ff', 
                borderRadius: '8px', 
                border: '1px solid #bae6fd' 
              }}>
                <div style={{ fontSize: '0.9rem', color: '#0369a1', fontWeight: '600', marginBottom: spacing.sm }}>
                  💡 Learning Insight
                </div>
                <div style={{ fontSize: '0.85rem', color: '#0c4a6e', lineHeight: '1.4' }}>
                  {selectedChild?.name || 'Your child'} shows strong engagement with hands-on activities. Consider incorporating more tactile learning experiences.
                </div>
              </div>
            </div>
            
            {/* Activity Monitoring Card */}
            <div style={cardStyle}>
              <h3 style={{ fontSize: '1.5rem', margin: '0 0 20px 0', color: '#1e293b', display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                🎯 Activity Monitoring
              </h3>
              
              <div style={{ marginBottom: spacing.lg }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '1rem', color: '#374151' }}>Recent Activities</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: spacing.sm, background: '#f8fafc', borderRadius: '6px' }}>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: '500', color: '#1e293b' }}>Science Experiment</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>2 hours ago</div>
                    </div>
                    <div style={{ padding: '2px 6px', background: '#dcfce7', color: '#166534', borderRadius: '4px', fontSize: '0.7rem' }}>
                      Completed
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: spacing.sm, background: '#f8fafc', borderRadius: '6px' }}>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: '500', color: '#1e293b' }}>Creative Writing</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>1 day ago</div>
                    </div>
                    <div style={{ padding: '2px 6px', background: '#fef3c7', color: '#92400e', borderRadius: '4px', fontSize: '0.7rem' }}>
                      In Progress
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: spacing.sm, background: '#f8fafc', borderRadius: '6px' }}>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: '500', color: '#1e293b' }}>Math Puzzle</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>2 days ago</div>
                    </div>
                    <div style={{ padding: '2px 6px', background: '#dcfce7', color: '#166534', borderRadius: '4px', fontSize: '0.7rem' }}>
                      Completed
                    </div>
                  </div>
                </div>
              </div>
              
              <div style={{ marginBottom: spacing.lg }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '1rem', color: '#374151' }}>Learning Streak</h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                  <div style={{ fontSize: '2rem' }}>🔥</div>
                  <div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#f59e0b' }}>7 days</div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Keep it up!</div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Goals & Milestones Card */}
            <div style={cardStyle}>
              <h3 style={{ fontSize: '1.5rem', margin: '0 0 20px 0', color: '#1e293b', display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                🎯 Goals & Milestones
              </h3>
              
              <div style={{ marginBottom: spacing.lg }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '1rem', color: '#374151' }}>Current Goals</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                  <div style={{ padding: spacing.sm, background: '#f0f9ff', borderRadius: '6px', border: '1px solid #bae6fd' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: '500', color: '#1e293b', marginBottom: '4px' }}>
                      Complete 10 Science Activities
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Progress: 7/10</div>
                  </div>
                  
                  <div style={{ padding: spacing.sm, background: '#f0fdf4', borderRadius: '6px', border: '1px solid #bbf7d0' }}>
                    <div style={{ fontSize: '0.9rem', fontWeight: '500', color: '#1e293b', marginBottom: '4px' }}>
                      Read 5 Books This Month
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Progress: 3/5</div>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '1rem', color: '#374151' }}>Recent Milestones</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.sm }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                    <div style={{ fontSize: '1.2rem' }}>🏆</div>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: '500', color: '#1e293b' }}>First Science Experiment</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Completed yesterday</div>
                    </div>
                  </div>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                    <div style={{ fontSize: '1.2rem' }}>⭐</div>
                    <div>
                      <div style={{ fontSize: '0.9rem', fontWeight: '500', color: '#1e293b' }}>Math Problem Solver</div>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Earned 3 days ago</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Navigation */}
          <div style={cardStyle}>
            <h2 style={{ fontSize: '1.5rem', margin: '0 0 1rem 0', color: '#1e293b', display: 'flex', alignItems: 'center', gap: spacing.sm }}>
            🚀 Quick Navigation
            </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: spacing.md }}>
              <button
                style={{
                  ...buttonStyle,
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  width: '100%',
                  textAlign: 'center'
                }}
              onClick={() => navigate('/activity-logs')}
              >
              📊 Activity Logs
              </button>
              
              <button
                style={{
                  ...buttonStyle,
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                  width: '100%',
                  textAlign: 'center'
                }}
              onClick={() => navigate('/dashboard/learning')}
              >
              📚 Learning Hub
              </button>
              
              <button
                style={{
                  ...buttonStyle,
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  width: '100%',
                  textAlign: 'center'
                }}
              onClick={() => navigate('/child-profile')}
              >
              👤 Child Profile
              </button>
              
              <button
                style={{
                  ...buttonStyle,
                background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  width: '100%',
                  textAlign: 'center'
                }}
              onClick={() => navigate('/niche')}
              >
              🔍 Browse Topics
              </button>
          </div>
        </div>

        {/* Footer */}
        <div style={{
          textAlign: 'center',
          padding: spacing.xl,
          color: '#64748b',
          fontSize: '0.9rem'
        }}>
          <p>Need help? Check out our <a href="/help" style={{ color: '#3b82f6', textDecoration: 'none' }}>Help Center</a></p>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default Home;
