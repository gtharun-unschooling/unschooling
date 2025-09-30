import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { useNavigate } from 'react-router-dom';
import { colors, spacing, typography } from '../styles/designTokens';

const Home = () => {
  console.log('🏠 Home component rendering with viewMode toggle');
  const { currentUser, userProfile } = useAuth();
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState('child'); // 'child' or 'parent'
  const [stats, setStats] = useState({
    totalChildren: 0,
    totalPlans: 0,
    activeLearning: 0,
    completedActivities: 0
  });
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
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
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
  };

  const headerStyle = {
    background: viewMode === 'child' 
      ? 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)'  // Child: Orange theme
      : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', // Parent: Blue theme
    color: 'white',
    padding: `${spacing['2xl']} ${spacing.xl}`,
    marginBottom: spacing.xl,
    transition: 'background 0.3s ease',
  };

  const cardStyle = {
    background: 'white',
    borderRadius: '16px',
    padding: spacing.xl,
    boxShadow: viewMode === 'child' 
      ? '0 4px 6px rgba(245, 158, 11, 0.1)' 
      : '0 4px 6px rgba(0, 0, 0, 0.05)',
    border: viewMode === 'child' 
      ? '1px solid #fde68a' 
      : '1px solid #e2e8f0',
    transition: 'all 0.3s ease',
  };

  const statCardStyle = {
    ...cardStyle,
    textAlign: 'center',
    cursor: 'pointer',
  };

  const buttonStyle = {
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
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
      {/* Header */}
      <div style={headerStyle}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h1 style={{ fontSize: '2.5rem', margin: '0 0 0.5rem 0', fontWeight: '700' }}>
                {viewMode === 'child' ? '🌟 My Learning Journey' : '👨‍👩‍👧‍👦 Family Dashboard'}
              </h1>
              <p style={{ fontSize: '1.2rem', margin: 0, opacity: 0.9 }}>
                {viewMode === 'child' 
                  ? 'Track your progress and discover new learning opportunities'
                  : 'Monitor your children\'s learning progress and achievements'
                }
              </p>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '25px',
              padding: '4px',
              display: 'flex',
              gap: '4px'
            }}>
              <button
                onClick={() => setViewMode('child')}
                style={{
                  background: viewMode === 'child' ? 'white' : 'transparent',
                  color: viewMode === 'child' ? '#667eea' : 'white',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
              >
                🌟 Child View
              </button>
              <button
                onClick={() => setViewMode('parent')}
                style={{
                  background: viewMode === 'parent' ? 'white' : 'transparent',
                  color: viewMode === 'parent' ? '#667eea' : 'white',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '8px 16px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  transition: 'all 0.3s ease'
                }}
              >
                👨‍👩‍👧‍👦 Parent View
              </button>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: `0 ${spacing.xl}` }}>
        {/* Quick Stats */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: spacing.lg,
          marginBottom: spacing.xl
        }}>
          <div style={statCardStyle} onClick={() => navigate('/child-profile')}>
            <div style={{ fontSize: '3rem', marginBottom: spacing.md }}>👶</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#3b82f6', marginBottom: spacing.sm }}>
              {stats.totalChildren}
            </div>
            <div style={{ color: '#64748b', fontSize: '1.1rem' }}>
              {stats.totalChildren === 1 ? 'Child Profile' : 'Child Profiles'}
            </div>
          </div>

          <div style={statCardStyle} onClick={() => navigate('/enhanced-dashboard')}>
            <div style={{ fontSize: '3rem', marginBottom: spacing.md }}>📚</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#10b981', marginBottom: spacing.sm }}>
              {stats.totalPlans}
            </div>
            <div style={{ color: '#64748b', fontSize: '1.1rem' }}>
              Learning Plans
            </div>
          </div>

          <div style={statCardStyle} onClick={() => navigate('/progress-tracker')}>
            <div style={{ fontSize: '3rem', marginBottom: spacing.md }}>📈</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#8b5cf6', marginBottom: spacing.sm }}>
              {stats.activeLearning}
            </div>
            <div style={{ color: '#64748b', fontSize: '1.1rem' }}>
              Active Learning
            </div>
          </div>

          <div style={statCardStyle} onClick={() => navigate('/learning')}>
            <div style={{ fontSize: '3rem', marginBottom: spacing.md }}>✅</div>
            <div style={{ fontSize: '2rem', fontWeight: '700', color: '#f59e0b', marginBottom: spacing.sm }}>
              {stats.completedActivities}
            </div>
            <div style={{ color: '#64748b', fontSize: '1.1rem' }}>
              Completed Activities
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
          gap: spacing.xl,
          marginBottom: spacing.xl
        }}>
          {/* Children Overview */}
          <div style={cardStyle}>
            <h2 style={{ fontSize: '1.5rem', margin: '0 0 1rem 0', color: '#1e293b', display: 'flex', alignItems: 'center', gap: spacing.sm }}>
              👶 Your Children
            </h2>
            {children.length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
                {children.slice(0, 3).map((child) => (
                  <div key={child.id} style={{
                    padding: spacing.md,
                    background: '#f8fafc',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease'
                  }}
                  onClick={() => navigate('/child-profile')}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ fontWeight: '600', color: '#1e293b', fontSize: '1.1rem' }}>
                          {child.name}
                        </div>
                        <div style={{ color: '#64748b', fontSize: '0.9rem' }}>
                          Age {child.age} • {child.learningStyle} learner
                        </div>
                      </div>
                      <div style={{ fontSize: '1.5rem' }}>
                        {getStatusIcon('active')}
                      </div>
                    </div>
                    {child.interests.length > 0 && (
                      <div style={{ marginTop: spacing.sm }}>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.25rem' }}>
                          Interests:
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.25rem' }}>
                          {child.interests.slice(0, 3).map((interest, index) => (
                            <span key={index} style={{
                              background: '#3b82f6',
                              color: 'white',
                              padding: '0.125rem 0.5rem',
                              borderRadius: '12px',
                              fontSize: '0.75rem'
                            }}>
                              {interest}
                            </span>
                          ))}
                          {child.interests.length > 3 && (
                            <span style={{
                              background: '#e2e8f0',
                              color: '#64748b',
                              padding: '0.125rem 0.5rem',
                              borderRadius: '12px',
                              fontSize: '0.75rem'
                            }}>
                              +{child.interests.length - 3}
                            </span>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {children.length > 3 && (
                  <div style={{ textAlign: 'center', color: '#64748b', fontSize: '0.9rem' }}>
                    +{children.length - 3} more children
                  </div>
                )}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: spacing.xl }}>
                <div style={{ fontSize: '3rem', marginBottom: spacing.md }}>👶</div>
                <div style={{ color: '#64748b', marginBottom: spacing.lg }}>
                  No children profiles yet
                </div>
                <button
                  style={buttonStyle}
                  onClick={() => navigate('/child-profile')}
                >
                  Create First Profile
                </button>
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div style={cardStyle}>
            <h2 style={{ fontSize: '1.5rem', margin: '0 0 1rem 0', color: '#1e293b', display: 'flex', alignItems: 'center', gap: spacing.sm }}>
              ⚡ Quick Actions
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
              <button
                style={{
                  ...buttonStyle,
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  width: '100%',
                  textAlign: 'center'
                }}
                onClick={() => navigate('/child-profile')}
              >
                👤 Create Child Profile
              </button>
              
              <button
                style={{
                  ...buttonStyle,
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                  width: '100%',
                  textAlign: 'center'
                }}
                onClick={() => navigate('/enhanced-dashboard')}
              >
                📚 Browse Learning Topics
              </button>
              
              <button
                style={{
                  ...buttonStyle,
                  background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  width: '100%',
                  textAlign: 'center'
                }}
                onClick={() => navigate('/progress-tracker')}
              >
                📈 Track Progress
              </button>
              
              <button
                style={{
                  ...buttonStyle,
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  width: '100%',
                  textAlign: 'center'
                }}
                onClick={() => navigate('/learning')}
              >
                🎯 Start Learning
              </button>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div style={cardStyle}>
          <h2 style={{ fontSize: '1.5rem', margin: '0 0 1rem 0', color: '#1e293b', display: 'flex', alignItems: 'center', gap: spacing.sm }}>
            📋 Recent Activity
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: spacing.md }}>
            {children.length > 0 ? (
              children.slice(0, 2).map((child) => (
                <div key={child.id} style={{
                  padding: spacing.md,
                  background: '#f8fafc',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: '600', color: '#1e293b' }}>
                        {child.name}'s Learning Plan
                      </div>
                      <div style={{ color: '#64748b', fontSize: '0.9rem' }}>
                        Last updated: {child.updatedAt ? new Date(child.updatedAt).toLocaleDateString() : 'Never'}
                      </div>
                    </div>
                    <div style={{
                      background: '#10b981',
                      color: 'white',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '500'
                    }}>
                      Active
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', color: '#64748b', padding: spacing.lg }}>
                No recent activity. Create a child profile to get started!
              </div>
            )}
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
