import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ChildProgressDashboard = () => {
  const navigate = useNavigate();
  const [selectedChild, setSelectedChild] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [children, setChildren] = useState([]);
  const [users, setUsers] = useState([]);
  const [progressData, setProgressData] = useState({});
  const [llmOutputs, setLlmOutputs] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Mock data - in real app, this would come from Firebase
  const mockUsers = [
    {
      id: 'user_001',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@email.com',
      role: 'Parent',
      joinDate: '2024-08-01',
      childrenCount: 2,
      avatar: '👩‍💼',
      subscription: 'Premium',
      lastActive: '2024-09-14T10:30:00Z'
    },
    {
      id: 'user_002',
      name: 'Michael Chen',
      email: 'michael.chen@email.com',
      role: 'Parent',
      joinDate: '2024-08-15',
      childrenCount: 1,
      avatar: '👨‍💻',
      subscription: 'Basic',
      lastActive: '2024-09-13T16:45:00Z'
    },
    {
      id: 'user_003',
      name: 'Maria Rodriguez',
      email: 'maria.rodriguez@email.com',
      role: 'Educator',
      joinDate: '2024-09-01',
      childrenCount: 5,
      avatar: '👩‍🏫',
      subscription: 'Educator',
      lastActive: '2024-09-14T09:15:00Z'
    }
  ];

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
      lastActivity: '2024-09-12T14:30:00Z'
    },
    {
      id: 'child_002',
      name: 'Liam Chen',
      age: 9,
      grade: '4th Grade',
      avatar: '👦',
      joinDate: '2024-08-20',
      totalTopics: 38,
      completedTopics: 28,
      inProgressTopics: 6,
      pendingTopics: 4,
      totalActivities: 76,
      completedActivities: 56,
      averageScore: 92,
      learningStreak: 8,
      favoriteNiche: 'AI',
      learningStyle: 'Kinesthetic',
      lastActivity: '2024-09-11T16:45:00Z'
    },
    {
      id: 'child_003',
      name: 'Sophia Rodriguez',
      age: 6,
      grade: '1st Grade',
      avatar: '👧',
      joinDate: '2024-09-01',
      totalTopics: 22,
      completedTopics: 15,
      inProgressTopics: 4,
      pendingTopics: 3,
      totalActivities: 44,
      completedActivities: 30,
      averageScore: 78,
      learningStreak: 5,
      favoriteNiche: 'Communication',
      learningStyle: 'Auditory',
      lastActivity: '2024-09-10T10:15:00Z'
    }
  ];

  const mockProgressData = {
    'child_001': {
      weeklyProgress: [
        { week: 'Week 1', topicsCompleted: 8, activitiesCompleted: 16, score: 85 },
        { week: 'Week 2', topicsCompleted: 12, activitiesCompleted: 24, score: 88 },
        { week: 'Week 3', topicsCompleted: 10, activitiesCompleted: 20, score: 87 },
        { week: 'Week 4', topicsCompleted: 2, activitiesCompleted: 4, score: 90 }
      ],
      nicheProgress: [
        { niche: 'Finance', completed: 12, total: 15, percentage: 80 },
        { niche: 'Entrepreneurship', completed: 8, total: 10, percentage: 80 },
        { niche: 'Communication', completed: 7, total: 10, percentage: 70 },
        { niche: 'AI', completed: 5, total: 10, percentage: 50 }
      ],
      recentActivities: [
        { topic: 'Understanding Money', niche: 'Finance', score: 95, date: '2024-09-12' },
        { topic: 'Basic Business Concepts', niche: 'Entrepreneurship', score: 88, date: '2024-09-11' },
        { topic: 'Public Speaking', niche: 'Communication', score: 82, date: '2024-09-10' }
      ],
      achievements: [
        { title: 'Finance Explorer', description: 'Completed 10 Finance topics', date: '2024-09-10', icon: '🏆' },
        { title: 'Learning Streak', description: '12 days in a row', date: '2024-09-12', icon: '🔥' },
        { title: 'High Scorer', description: 'Average score above 85%', date: '2024-09-08', icon: '⭐' }
      ]
    }
  };

  const mockLlmOutputs = {
    'child_001': {
      profileAnalysis: {
        cognitiveAssessment: {
          level: 'intermediate',
          score: 78,
          strengths: ['Visual Learning', 'Pattern Recognition', 'Creative Thinking'],
          areasForImprovement: ['Attention Span', 'Sequential Processing'],
          recommendations: ['Use visual aids', 'Break tasks into smaller chunks']
        },
        learningStyle: {
          primary: 'Visual',
          secondary: 'Kinesthetic',
          confidence: 0.85,
          evidence: ['Prefers diagrams over text', 'Enjoys hands-on activities']
        },
        interestMapping: {
          'AI': 0.92,
          'Science': 0.88,
          'Entrepreneurship': 0.75,
          'Finance': 0.68
        },
        personalizedActivities: [
          'AI-powered drawing games',
          'Science experiment simulations',
          'Virtual business planning',
          'Interactive money management'
        ],
        llmInsights: {
          personalityTraits: ['Curious', 'Creative', 'Independent'],
          learningPatterns: ['Peak performance in morning', 'Prefers collaborative learning'],
          motivationalFactors: ['Achievement badges', 'Peer recognition', 'Creative freedom']
        }
      },
      recentGenerations: [
        {
          timestamp: '2024-09-14T10:30:00Z',
          prompt: 'Generate learning plan for 7-year-old interested in AI and Science',
          response: {
            activities: 18,
            processingTime: '45.2s',
            confidence: 0.89,
            topics: ['AI in Animals', 'Cleaning Robots', 'AI Artists', 'Science Experiments']
          }
        },
        {
          timestamp: '2024-09-13T14:15:00Z',
          prompt: 'Create personalized activities for visual learner',
          response: {
            activities: 15,
            processingTime: '38.7s',
            confidence: 0.92,
            topics: ['Picture books', 'Drawing activities', 'Visual puzzles']
          }
        }
      ]
    },
    'child_002': {
      profileAnalysis: {
        cognitiveAssessment: {
          level: 'advanced',
          score: 91,
          strengths: ['Logical Reasoning', 'Problem Solving', 'Memory Retention'],
          areasForImprovement: ['Social Learning', 'Emotional Intelligence'],
          recommendations: ['Group activities', 'Emotional awareness exercises']
        },
        learningStyle: {
          primary: 'Kinesthetic',
          secondary: 'Auditory',
          confidence: 0.93,
          evidence: ['Learns by doing', 'Responds well to verbal instructions']
        },
        interestMapping: {
          'AI': 0.95,
          'Entrepreneurship': 0.88,
          'Science': 0.82,
          'Finance': 0.79
        },
        personalizedActivities: [
          'Building AI models',
          'Business simulation games',
          'Hands-on science projects',
          'Investment strategy games'
        ],
        llmInsights: {
          personalityTraits: ['Analytical', 'Goal-oriented', 'Persistent'],
          learningPatterns: ['Consistent daily progress', 'Prefers structured learning'],
          motivationalFactors: ['Competition', 'Progress tracking', 'Skill mastery']
        }
      },
      recentGenerations: [
        {
          timestamp: '2024-09-14T09:45:00Z',
          prompt: 'Advanced learning plan for 9-year-old AI enthusiast',
          response: {
            activities: 22,
            processingTime: '52.1s',
            confidence: 0.94,
            topics: ['Machine Learning Basics', 'AI Ethics', 'Robotics', 'Data Analysis']
          }
        }
      ]
    }
  };

  useEffect(() => {
    // Simulate loading data
    setTimeout(() => {
      setUsers(mockUsers);
      setChildren(mockChildren);
      setProgressData(mockProgressData);
      setLlmOutputs(mockLlmOutputs);
      setSelectedUser(mockUsers[0]);
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
            📊 Loading progress data...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '20px'
    }}>
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
              📊 Child Progress Dashboard
            </h1>
            <p style={{ margin: 0, color: '#64748b', fontSize: '1.1rem' }}>
              Track learning progress, achievements, and analytics for each child
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/content')}
            style={{
              padding: '12px 24px',
              background: '#3b82f6',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}
          >
            ← Back to Content Management
          </button>
        </div>

        {/* User Selector */}
        <div style={{ marginBottom: '24px' }}>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '1.2rem', fontWeight: '600', color: '#1e293b' }}>
            👤 Select User Account
          </h3>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            {users.map((user) => (
              <button
                key={user.id}
                onClick={() => setSelectedUser(user)}
                style={{
                  padding: '12px 20px',
                  background: selectedUser?.id === user.id ? '#8b5cf6' : '#f8fafc',
                  color: selectedUser?.id === user.id ? '#ffffff' : '#64748b',
                  border: `2px solid ${selectedUser?.id === user.id ? '#8b5cf6' : '#e2e8f0'}`,
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
                <span style={{ fontSize: '1.2rem' }}>{user.avatar}</span>
                <div style={{ textAlign: 'left' }}>
                  <div style={{ fontWeight: '600' }}>{user.name}</div>
                  <div style={{ fontSize: '0.8rem', opacity: 0.8 }}>
                    {user.role} • {user.subscription}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Child Selector */}
        <div>
          <h3 style={{ margin: '0 0 12px 0', fontSize: '1.2rem', fontWeight: '600', color: '#1e293b' }}>
            👶 Select Child
          </h3>
          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {children.map((child) => (
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
        </div>
      </div>

      {selectedChild && (
        <>
          {/* Child Overview Cards */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '20px',
            marginBottom: '24px'
          }}>
            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                <span style={{ fontSize: '2rem', marginRight: '12px' }}>{selectedChild.avatar}</span>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '1.2rem', fontWeight: '600', color: '#1e293b' }}>
                    {selectedChild.name}
                  </h3>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>
                    {selectedChild.age} years • {selectedChild.grade}
                  </p>
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#3b82f6' }}>
                    {getProgressPercentage(selectedChild.completedTopics, selectedChild.totalTopics)}%
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Progress</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: '700', color: getScoreColor(selectedChild.averageScore) }}>
                    {selectedChild.averageScore}%
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Avg Score</div>
                </div>
              </div>
            </div>

            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
              border: '1px solid #e2e8f0'
            }}>
              <h4 style={{ margin: '0 0 16px 0', fontSize: '1rem', fontWeight: '600', color: '#1e293b' }}>
                📚 Learning Progress
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#22c55e' }}>
                    {selectedChild.completedTopics}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Completed</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#f59e0b' }}>
                    {selectedChild.inProgressTopics}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>In Progress</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#ef4444' }}>
                    {selectedChild.pendingTopics}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Pending</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#3b82f6' }}>
                    {selectedChild.totalTopics}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Total</div>
                </div>
              </div>
            </div>

            <div style={{
              background: '#ffffff',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
              border: '1px solid #e2e8f0'
            }}>
              <h4 style={{ margin: '0 0 16px 0', fontSize: '1rem', fontWeight: '600', color: '#1e293b' }}>
                🎯 Learning Stats
              </h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '700', color: getStreakColor(selectedChild.learningStreak) }}>
                    {selectedChild.learningStreak}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Day Streak</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#8b5cf6' }}>
                    {selectedChild.favoriteNiche}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Favorite Niche</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#06b6d4' }}>
                    {selectedChild.learningStyle}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Learning Style</div>
                </div>
                <div>
                  <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#f59e0b' }}>
                    {selectedChild.completedActivities}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Activities Done</div>
                </div>
              </div>
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
            <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
              {['overview', 'progress', 'achievements', 'analytics', 'llm-outputs'].map((tab) => (
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
                  📊 Learning Overview
                </h3>
                
                {/* Progress Bars */}
                <div style={{ marginBottom: '24px' }}>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '1.1rem', fontWeight: '600', color: '#1e293b' }}>
                    Overall Progress
                  </h4>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Topics Completed</span>
                      <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1e293b' }}>
                        {selectedChild.completedTopics}/{selectedChild.totalTopics}
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '8px',
                      background: '#e2e8f0',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${getProgressPercentage(selectedChild.completedTopics, selectedChild.totalTopics)}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #22c55e 0%, #16a34a 100%)',
                        transition: 'width 0.3s ease'
                      }}></div>
                    </div>
                  </div>
                  
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Activities Completed</span>
                      <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1e293b' }}>
                        {selectedChild.completedActivities}/{selectedChild.totalActivities}
                      </span>
                    </div>
                    <div style={{
                      width: '100%',
                      height: '8px',
                      background: '#e2e8f0',
                      borderRadius: '4px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${getProgressPercentage(selectedChild.completedActivities, selectedChild.totalActivities)}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #3b82f6 0%, #2563eb 100%)',
                        transition: 'width 0.3s ease'
                      }}></div>
                    </div>
                  </div>
                </div>

                {/* Recent Activities */}
                <div>
                  <h4 style={{ margin: '0 0 12px 0', fontSize: '1.1rem', fontWeight: '600', color: '#1e293b' }}>
                    Recent Activities
                  </h4>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {progressData[selectedChild.id]?.recentActivities?.map((activity, index) => (
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
                            {activity.niche} • {activity.date}
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

            {activeTab === 'progress' && (
              <div>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '1.5rem', fontWeight: '600', color: '#1e293b' }}>
                  📈 Progress Tracking
                </h3>
                
                {/* Weekly Progress */}
                <div style={{ marginBottom: '32px' }}>
                  <h4 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: '600', color: '#1e293b' }}>
                    Weekly Progress
                  </h4>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {progressData[selectedChild.id]?.weeklyProgress?.map((week, index) => (
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
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                          <div>
                            <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#3b82f6' }}>
                              {week.topicsCompleted}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Topics Completed</div>
                          </div>
                          <div>
                            <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#22c55e' }}>
                              {week.activitiesCompleted}
                            </div>
                            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Activities Completed</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Niche Progress */}
                <div>
                  <h4 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: '600', color: '#1e293b' }}>
                    Progress by Niche
                  </h4>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    {progressData[selectedChild.id]?.nicheProgress?.map((niche, index) => (
                      <div key={index} style={{
                        padding: '20px',
                        background: '#f8fafc',
                        borderRadius: '12px',
                        border: '1px solid #e2e8f0'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                          <h5 style={{ margin: 0, fontSize: '1rem', fontWeight: '600', color: '#1e293b' }}>
                            {niche.niche}
                          </h5>
                          <div style={{ fontSize: '1rem', fontWeight: '600', color: '#1e293b' }}>
                            {niche.percentage}%
                          </div>
                        </div>
                        <div style={{
                          width: '100%',
                          height: '8px',
                          background: '#e2e8f0',
                          borderRadius: '4px',
                          overflow: 'hidden',
                          marginBottom: '8px'
                        }}>
                          <div style={{
                            width: `${niche.percentage}%`,
                            height: '100%',
                            background: 'linear-gradient(90deg, #8b5cf6 0%, #7c3aed 100%)',
                            transition: 'width 0.3s ease'
                          }}></div>
                        </div>
                        <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                          {niche.completed} of {niche.total} topics completed
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
                  🏆 Achievements & Badges
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
                  {progressData[selectedChild.id]?.achievements?.map((achievement, index) => (
                    <div key={index} style={{
                      padding: '24px',
                      background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
                      borderRadius: '16px',
                      border: '1px solid #f59e0b',
                      textAlign: 'center'
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
                        Earned on {achievement.date}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'analytics' && (
              <div>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '1.5rem', fontWeight: '600', color: '#1e293b' }}>
                  📊 Learning Analytics
                </h3>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                  <div style={{
                    padding: '24px',
                    background: '#f0fdf4',
                    borderRadius: '12px',
                    border: '1px solid #22c55e',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>⏱️</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#166534', marginBottom: '4px' }}>
                      2.5 hours
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#166534' }}>Average Session Time</div>
                  </div>
                  
                  <div style={{
                    padding: '24px',
                    background: '#dbeafe',
                    borderRadius: '12px',
                    border: '1px solid #3b82f6',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📅</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#1e40af', marginBottom: '4px' }}>
                      85%
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#1e40af' }}>Completion Rate</div>
                  </div>
                  
                  <div style={{
                    padding: '24px',
                    background: '#fef3c7',
                    borderRadius: '12px',
                    border: '1px solid #f59e0b',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🎯</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#92400e', marginBottom: '4px' }}>
                      {selectedChild.learningStreak}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#92400e' }}>Day Learning Streak</div>
                  </div>
                  
                  <div style={{
                    padding: '24px',
                    background: '#f3e8ff',
                    borderRadius: '12px',
                    border: '1px solid #8b5cf6',
                    textAlign: 'center'
                  }}>
                    <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📈</div>
                    <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#6b21a8', marginBottom: '4px' }}>
                      +12%
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#6b21a8' }}>Progress This Month</div>
                  </div>
                </div>

                {/* Learning Insights */}
                <div style={{
                  padding: '24px',
                  background: '#f8fafc',
                  borderRadius: '12px',
                  border: '1px solid #e2e8f0'
                }}>
                  <h4 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: '600', color: '#1e293b' }}>
                    💡 Learning Insights
                  </h4>
                  <div style={{ display: 'grid', gap: '12px' }}>
                    <div style={{ padding: '12px', background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <strong style={{ color: '#1e293b' }}>Strengths:</strong> 
                      <span style={{ color: '#64748b', marginLeft: '8px' }}>
                        Excels in {selectedChild.favoriteNiche} topics and shows consistent learning patterns
                      </span>
                    </div>
                    <div style={{ padding: '12px', background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <strong style={{ color: '#1e293b' }}>Learning Style:</strong> 
                      <span style={{ color: '#64748b', marginLeft: '8px' }}>
                        {selectedChild.learningStyle} learner who benefits from hands-on activities
                      </span>
                    </div>
                    <div style={{ padding: '12px', background: '#ffffff', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                      <strong style={{ color: '#1e293b' }}>Recommendations:</strong> 
                      <span style={{ color: '#64748b', marginLeft: '8px' }}>
                        Continue with current pace and consider advanced topics in {selectedChild.favoriteNiche}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'llm-outputs' && (
              <div>
                <h3 style={{ margin: '0 0 20px 0', fontSize: '1.5rem', fontWeight: '600', color: '#1e293b' }}>
                  🤖 LLM Agent Outputs & Analysis
                </h3>
                
                {selectedChild && llmOutputs[selectedChild.id] && (
                  <>
                    {/* Profile Analysis */}
                    <div style={{ marginBottom: '32px' }}>
                      <h4 style={{ margin: '0 0 16px 0', fontSize: '1.2rem', fontWeight: '600', color: '#1e293b' }}>
                        🧠 Profile Analysis
                      </h4>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                        {/* Cognitive Assessment */}
                        <div style={{
                          padding: '20px',
                          background: '#f0fdf4',
                          borderRadius: '12px',
                          border: '1px solid #22c55e'
                        }}>
                          <h5 style={{ margin: '0 0 12px 0', fontSize: '1rem', fontWeight: '600', color: '#166534' }}>
                            🧠 Cognitive Assessment
                          </h5>
                          <div style={{ marginBottom: '12px' }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#166534' }}>
                              {llmOutputs[selectedChild.id].profileAnalysis.cognitiveAssessment.level.toUpperCase()}
                            </div>
                            <div style={{ fontSize: '0.9rem', color: '#166534' }}>
                              Score: {llmOutputs[selectedChild.id].profileAnalysis.cognitiveAssessment.score}/100
                            </div>
                          </div>
                          <div>
                            <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#166534', marginBottom: '8px' }}>Strengths:</div>
                            {llmOutputs[selectedChild.id].profileAnalysis.cognitiveAssessment.strengths.map((strength, index) => (
                              <div key={index} style={{ fontSize: '0.8rem', color: '#166534', marginBottom: '4px' }}>
                                • {strength}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Learning Style */}
                        <div style={{
                          padding: '20px',
                          background: '#dbeafe',
                          borderRadius: '12px',
                          border: '1px solid #3b82f6'
                        }}>
                          <h5 style={{ margin: '0 0 12px 0', fontSize: '1rem', fontWeight: '600', color: '#1e40af' }}>
                            🎯 Learning Style
                          </h5>
                          <div style={{ marginBottom: '12px' }}>
                            <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#1e40af' }}>
                              {llmOutputs[selectedChild.id].profileAnalysis.learningStyle.primary}
                            </div>
                            <div style={{ fontSize: '0.9rem', color: '#1e40af' }}>
                              Secondary: {llmOutputs[selectedChild.id].profileAnalysis.learningStyle.secondary}
                            </div>
                            <div style={{ fontSize: '0.9rem', color: '#1e40af' }}>
                              Confidence: {Math.round(llmOutputs[selectedChild.id].profileAnalysis.learningStyle.confidence * 100)}%
                            </div>
                          </div>
                        </div>

                        {/* Interest Mapping */}
                        <div style={{
                          padding: '20px',
                          background: '#fef3c7',
                          borderRadius: '12px',
                          border: '1px solid #f59e0b'
                        }}>
                          <h5 style={{ margin: '0 0 12px 0', fontSize: '1rem', fontWeight: '600', color: '#92400e' }}>
                            🎨 Interest Mapping
                          </h5>
                          {Object.entries(llmOutputs[selectedChild.id].profileAnalysis.interestMapping).map(([interest, score]) => (
                            <div key={interest} style={{ marginBottom: '8px' }}>
                              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                                <span style={{ fontSize: '0.9rem', color: '#92400e' }}>{interest}</span>
                                <span style={{ fontSize: '0.9rem', fontWeight: '600', color: '#92400e' }}>
                                  {Math.round(score * 100)}%
                                </span>
                              </div>
                              <div style={{
                                width: '100%',
                                height: '6px',
                                background: '#fde68a',
                                borderRadius: '3px',
                                overflow: 'hidden'
                              }}>
                                <div style={{
                                  width: `${score * 100}%`,
                                  height: '100%',
                                  background: '#f59e0b',
                                  transition: 'width 0.3s ease'
                                }}></div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* LLM Insights */}
                      <div style={{
                        padding: '20px',
                        background: '#f3e8ff',
                        borderRadius: '12px',
                        border: '1px solid #8b5cf6'
                      }}>
                        <h5 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: '600', color: '#6b21a8' }}>
                          💡 LLM Insights
                        </h5>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
                          <div>
                            <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#6b21a8', marginBottom: '8px' }}>Personality Traits:</div>
                            {llmOutputs[selectedChild.id].profileAnalysis.llmInsights.personalityTraits.map((trait, index) => (
                              <div key={index} style={{ fontSize: '0.8rem', color: '#6b21a8', marginBottom: '4px' }}>
                                • {trait}
                              </div>
                            ))}
                          </div>
                          <div>
                            <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#6b21a8', marginBottom: '8px' }}>Learning Patterns:</div>
                            {llmOutputs[selectedChild.id].profileAnalysis.llmInsights.learningPatterns.map((pattern, index) => (
                              <div key={index} style={{ fontSize: '0.8rem', color: '#6b21a8', marginBottom: '4px' }}>
                                • {pattern}
                              </div>
                            ))}
                          </div>
                          <div>
                            <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#6b21a8', marginBottom: '8px' }}>Motivational Factors:</div>
                            {llmOutputs[selectedChild.id].profileAnalysis.llmInsights.motivationalFactors.map((factor, index) => (
                              <div key={index} style={{ fontSize: '0.8rem', color: '#6b21a8', marginBottom: '4px' }}>
                                • {factor}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Recent Generations */}
                    <div>
                      <h4 style={{ margin: '0 0 16px 0', fontSize: '1.2rem', fontWeight: '600', color: '#1e293b' }}>
                        🚀 Recent LLM Generations
                      </h4>
                      <div style={{ display: 'grid', gap: '16px' }}>
                        {llmOutputs[selectedChild.id].recentGenerations.map((generation, index) => (
                          <div key={index} style={{
                            padding: '20px',
                            background: '#f8fafc',
                            borderRadius: '12px',
                            border: '1px solid #e2e8f0'
                          }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                              <div>
                                <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1e293b', marginBottom: '4px' }}>
                                  {new Date(generation.timestamp).toLocaleString()}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
                                  {generation.prompt}
                                </div>
                              </div>
                              <div style={{
                                padding: '6px 12px',
                                background: '#22c55e',
                                color: 'white',
                                borderRadius: '6px',
                                fontSize: '0.8rem',
                                fontWeight: '600'
                              }}>
                                {Math.round(generation.response.confidence * 100)}% confidence
                              </div>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '12px', marginBottom: '12px' }}>
                              <div>
                                <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#3b82f6' }}>
                                  {generation.response.activities}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Activities Generated</div>
                              </div>
                              <div>
                                <div style={{ fontSize: '1.2rem', fontWeight: '700', color: '#f59e0b' }}>
                                  {generation.response.processingTime}
                                </div>
                                <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Processing Time</div>
                              </div>
                            </div>
                            <div>
                              <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1e293b', marginBottom: '8px' }}>Generated Topics:</div>
                              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                {generation.response.topics.map((topic, topicIndex) => (
                                  <span key={topicIndex} style={{
                                    padding: '4px 8px',
                                    background: '#e2e8f0',
                                    borderRadius: '4px',
                                    fontSize: '0.8rem',
                                    color: '#64748b'
                                  }}>
                                    {topic}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default ChildProgressDashboard;
