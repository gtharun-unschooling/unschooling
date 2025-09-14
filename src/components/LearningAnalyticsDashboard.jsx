import React, { useState, useEffect } from 'react';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const LearningAnalyticsDashboard = ({ 
  userId, 
  childId, 
  style = {} 
}) => {
  const [analyticsData, setAnalyticsData] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedTimeframe, setSelectedTimeframe] = useState('week');
  const [selectedView, setSelectedView] = useState('overview');

  // Load analytics data
  const loadAnalyticsData = async () => {
    if (!userId || !childId) return;
    
    setLoading(true);
    try {
      const childRef = doc(db, `users/${userId}/children/${childId}`);
      const childSnap = await getDoc(childRef);
      
      if (childSnap.exists()) {
        const data = childSnap.data();
        const history = data.learning_history || [];
        const achievements = data.achievements || [];
        const progress = data.progress_data || {};
        
        // Calculate analytics
        const analytics = calculateAnalytics(history, achievements, progress);
        setAnalyticsData(analytics);
      }
    } catch (error) {
      console.error('Error loading analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate comprehensive analytics
  const calculateAnalytics = (history, achievements, progress) => {
    if (history.length === 0) {
      return {
        totalSessions: 0,
        totalTime: 0,
        averageSessionLength: 0,
        completionRate: 0,
        favoriteTopics: [],
        learningStreak: 0,
        weeklyProgress: [],
        monthlyProgress: [],
        achievementProgress: achievements.length,
        topicDiversity: 0,
        timeDistribution: {},
        learningPatterns: {}
      };
    }

    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Basic statistics
    const totalSessions = history.length;
    const totalTime = history.reduce((sum, h) => sum + (h.duration || 0), 0);
    const averageSessionLength = totalTime / totalSessions;
    const completedSessions = history.filter(h => h.completed).length;
    const completionRate = (completedSessions / totalSessions) * 100;

    // Topic analysis
    const topicCounts = {};
    history.forEach(h => {
      topicCounts[h.topic] = (topicCounts[h.topic] || 0) + 1;
    });
    
    const favoriteTopics = Object.entries(topicCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([topic, count]) => ({ topic, count }));

    // Learning streak
    let learningStreak = 0;
    let currentStreak = 0;
    const sortedHistory = [...history].sort((a, b) => new Date(b.endTime) - new Date(a.endTime));
    
    for (let i = 0; i < sortedHistory.length; i++) {
      const sessionDate = new Date(sortedHistory[i].endTime);
      const prevDate = i > 0 ? new Date(sortedHistory[i - 1].endTime) : null;
      
      if (prevDate) {
        const dayDiff = Math.floor((prevDate - sessionDate) / (1000 * 60 * 60 * 24));
        if (dayDiff <= 1) {
          currentStreak++;
        } else {
          break;
        }
      } else {
        currentStreak = 1;
      }
    }
    learningStreak = currentStreak;

    // Weekly progress
    const weeklyProgress = [];
    for (let i = 0; i < 4; i++) {
      const weekStart = new Date(now.getTime() - (i * 7 * 24 * 60 * 60 * 1000));
      const weekEnd = new Date(weekStart.getTime() + (7 * 24 * 60 * 60 * 1000));
      
      const weekSessions = history.filter(h => {
        const sessionDate = new Date(h.endTime);
        return sessionDate >= weekStart && sessionDate < weekEnd;
      });
      
      weeklyProgress.unshift({
        week: `Week ${4 - i}`,
        sessions: weekSessions.length,
        time: weekSessions.reduce((sum, h) => sum + (h.duration || 0), 0),
        completed: weekSessions.filter(h => h.completed).length
      });
    }

    // Monthly progress
    const monthlyProgress = [];
    for (let i = 0; i < 3; i++) {
      const monthStart = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const monthEnd = new Date(now.getFullYear(), now.getMonth() - i + 1, 0);
      
      const monthSessions = history.filter(h => {
        const sessionDate = new Date(h.endTime);
        return sessionDate >= monthStart && sessionDate <= monthEnd;
      });
      
      monthlyProgress.unshift({
        month: monthStart.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
        sessions: monthSessions.length,
        time: monthSessions.reduce((sum, h) => sum + (h.duration || 0), 0),
        completed: monthSessions.filter(h => h.completed).length
      });
    }

    // Time distribution by hour
    const timeDistribution = {};
    for (let hour = 0; hour < 24; hour++) {
      timeDistribution[hour] = 0;
    }
    
    history.forEach(h => {
      const sessionHour = new Date(h.endTime).getHours();
      timeDistribution[sessionHour] += h.duration || 0;
    });

    // Learning patterns
    const learningPatterns = {
      byDayOfWeek: {},
      byTopicType: {},
      sessionLengths: []
    };

    // Day of week analysis
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    daysOfWeek.forEach(day => learningPatterns.byDayOfWeek[day] = 0);
    
    history.forEach(h => {
      const dayOfWeek = new Date(h.endTime).getDay();
      learningPatterns.byDayOfWeek[daysOfWeek[dayOfWeek]] += h.duration || 0;
    });

    // Topic type analysis
    history.forEach(h => {
      const topicType = h.type || 'general';
      learningPatterns.byTopicType[topicType] = (learningPatterns.byTopicType[topicType] || 0) + (h.duration || 0);
    });

    // Session length analysis
    learningPatterns.sessionLengths = history.map(h => h.duration || 0).sort((a, b) => a - b);

    return {
      totalSessions,
      totalTime,
      averageSessionLength,
      completionRate,
      favoriteTopics,
      learningStreak,
      weeklyProgress,
      monthlyProgress,
      achievementProgress: achievements.length,
      topicDiversity: Object.keys(topicCounts).length,
      timeDistribution,
      learningPatterns
    };
  };

  // Load data when component mounts or dependencies change
  useEffect(() => {
    loadAnalyticsData();
  }, [userId, childId]);

  const containerStyle = {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e0e0e0',
    ...style
  };

  const tabStyle = {
    padding: '12px 20px',
    border: 'none',
    background: 'transparent',
    cursor: 'pointer',
    borderBottom: '3px solid transparent',
    fontWeight: 600,
    fontSize: '14px',
    transition: 'all 0.2s'
  };

  const activeTabStyle = {
    ...tabStyle,
    borderBottomColor: '#4ECDC4',
    color: '#4ECDC4'
  };

  const metricCardStyle = {
    background: '#f8f9fa',
    padding: '20px',
    borderRadius: '8px',
    border: '1px solid #e0e0e0',
    textAlign: 'center'
  };

  const metricValueStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#4ECDC4',
    marginBottom: '8px'
  };

  const metricLabelStyle = {
    fontSize: '14px',
    color: '#666',
    fontWeight: 500
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '24px', color: '#666' }}>📊 Loading Analytics...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <h2 style={{ marginBottom: '24px', color: '#333' }}>📊 Learning Analytics Dashboard</h2>
      
      {/* Timeframe Selector */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {['week', 'month', 'all'].map(timeframe => (
            <button
              key={timeframe}
              onClick={() => setSelectedTimeframe(timeframe)}
              style={selectedTimeframe === timeframe ? activeTabStyle : tabStyle}
            >
              {timeframe === 'week' ? '📅 This Week' : 
               timeframe === 'month' ? '📆 This Month' : '📊 All Time'}
            </button>
          ))}
        </div>
      </div>

      {/* View Selector */}
      <div style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {['overview', 'progress', 'patterns', 'achievements'].map(view => (
            <button
              key={view}
              onClick={() => setSelectedView(view)}
              style={selectedView === view ? activeTabStyle : tabStyle}
            >
              {view === 'overview' ? '📋 Overview' : 
               view === 'progress' ? '📈 Progress' : 
               view === 'patterns' ? '🔍 Patterns' : '🏆 Achievements'}
            </button>
          ))}
        </div>
      </div>

      {/* Overview View */}
      {selectedView === 'overview' && (
        <div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
            <div style={metricCardStyle}>
              <div style={metricValueStyle}>{analyticsData.totalSessions}</div>
              <div style={metricLabelStyle}>Total Learning Sessions</div>
            </div>
            <div style={metricCardStyle}>
              <div style={metricValueStyle}>{Math.round(analyticsData.totalTime)}</div>
              <div style={metricLabelStyle}>Total Learning Time (min)</div>
            </div>
            <div style={metricCardStyle}>
              <div style={metricValueStyle}>{Math.round(analyticsData.averageSessionLength)}</div>
              <div style={metricLabelStyle}>Avg Session Length (min)</div>
            </div>
            <div style={metricCardStyle}>
              <div style={metricValueStyle}>{Math.round(analyticsData.completionRate)}%</div>
              <div style={metricLabelStyle}>Completion Rate</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {/* Learning Streak */}
            <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
              <h3 style={{ marginBottom: '16px', color: '#333' }}>🔥 Learning Streak</h3>
              <div style={{ fontSize: '3rem', textAlign: 'center', color: '#ff6b6b', marginBottom: '8px' }}>
                {analyticsData.learningStreak}
              </div>
              <div style={{ textAlign: 'center', color: '#666' }}>
                {analyticsData.learningStreak === 0 ? 'Start your learning journey!' :
                 analyticsData.learningStreak === 1 ? 'Great start! Keep it up!' :
                 `${analyticsData.learningStreak} days in a row! Amazing consistency!`}
              </div>
            </div>

            {/* Favorite Topics */}
            <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
              <h3 style={{ marginBottom: '16px', color: '#333' }}>⭐ Favorite Topics</h3>
              {analyticsData.favoriteTopics.length === 0 ? (
                <div style={{ color: '#666', fontStyle: 'italic' }}>No learning data yet</div>
              ) : (
                <div>
                  {analyticsData.favoriteTopics.map((topic, index) => (
                    <div key={index} style={{ 
                      display: 'flex', 
                      justifyContent: 'space-between', 
                      alignItems: 'center',
                      padding: '8px 0',
                      borderBottom: index < analyticsData.favoriteTopics.length - 1 ? '1px solid #e0e0e0' : 'none'
                    }}>
                      <span style={{ fontWeight: 500 }}>{topic.topic}</span>
                      <span style={{ color: '#4ECDC4', fontWeight: 600 }}>{topic.count} sessions</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Progress View */}
      {selectedView === 'progress' && (
        <div>
          <h3 style={{ marginBottom: '20px', color: '#333' }}>📈 Learning Progress</h3>
          
          {/* Weekly Progress */}
          <div style={{ marginBottom: '32px' }}>
            <h4 style={{ marginBottom: '16px', color: '#666' }}>Weekly Progress (Last 4 Weeks)</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              {analyticsData.weeklyProgress.map((week, index) => (
                <div key={index} style={{ 
                  background: '#f8f9fa', 
                  padding: '16px', 
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0'
                }}>
                  <div style={{ fontWeight: 600, marginBottom: '8px' }}>{week.week}</div>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>
                    <div>Sessions: {week.sessions}</div>
                    <div>Time: {week.time} min</div>
                    <div>Completed: {week.completed}</div>
                    {week.sessions > 0 && (
                      <div style={{ color: '#4ECDC4', fontWeight: 600 }}>
                        Success: {Math.round((week.completed / week.sessions) * 100)}%
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Monthly Progress */}
          <div>
            <h4 style={{ marginBottom: '16px', color: '#666' }}>Monthly Progress (Last 3 Months)</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              {analyticsData.monthlyProgress.map((month, index) => (
                <div key={index} style={{ 
                  background: '#f8f9fa', 
                  padding: '16px', 
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0'
                }}>
                  <div style={{ fontWeight: 600, marginBottom: '8px' }}>{month.month}</div>
                  <div style={{ fontSize: '0.9rem', color: '#666' }}>
                    <div>Sessions: {month.sessions}</div>
                    <div>Time: {month.time} min</div>
                    <div>Completed: {month.completed}</div>
                    {month.sessions > 0 && (
                      <div style={{ color: '#4ECDC4', fontWeight: 600 }}>
                        Success: {Math.round((month.completed / month.sessions) * 100)}%
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Patterns View */}
      {selectedView === 'patterns' && (
        <div>
          <h3 style={{ marginBottom: '20px', color: '#333' }}>🔍 Learning Patterns</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
            {/* Time Distribution */}
            <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
              <h4 style={{ marginBottom: '16px', color: '#666' }}>⏰ Learning Time Distribution</h4>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: '8px' }}>
                {Object.entries(analyticsData.timeDistribution).map(([hour, time]) => (
                  <div key={hour} style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '0.8rem', color: '#666' }}>
                      {hour === '0' ? '12 AM' : hour === '12' ? '12 PM' : hour < 12 ? `${hour} AM` : `${hour - 12} PM`}
                    </div>
                    <div style={{ 
                      background: '#4ECDC4', 
                      height: `${Math.max(20, (time / Math.max(...Object.values(analyticsData.timeDistribution))) * 100)}px`,
                      borderRadius: '4px',
                      marginTop: '4px'
                    }}></div>
                    <div style={{ fontSize: '0.7rem', color: '#666', marginTop: '4px' }}>
                      {time} min
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Day of Week Analysis */}
            <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
              <h4 style={{ marginBottom: '16px', color: '#666' }}>📅 Learning by Day of Week</h4>
              {Object.entries(analyticsData.learningPatterns.byDayOfWeek).map(([day, time]) => (
                <div key={day} style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '8px 0',
                  borderBottom: '1px solid #e0e0e0'
                }}>
                  <span style={{ fontWeight: 500 }}>{day}</span>
                  <span style={{ color: '#4ECDC4', fontWeight: 600 }}>{time} min</span>
                </div>
              ))}
            </div>
          </div>

          {/* Topic Type Analysis */}
          <div style={{ marginTop: '24px' }}>
            <h4 style={{ marginBottom: '16px', color: '#666' }}>📚 Learning by Topic Type</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              {Object.entries(analyticsData.learningPatterns.byTopicType).map(([type, time]) => (
                <div key={type} style={{ 
                  background: '#f8f9fa', 
                  padding: '16px', 
                  borderRadius: '8px',
                  border: '1px solid #e0e0e0',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '1.2rem', marginBottom: '8px' }}>
                    {type === 'academic' ? '📚' : type === 'creative' ? '🎨' : '🔍'}
                  </div>
                  <div style={{ fontWeight: 600, marginBottom: '4px' }}>
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </div>
                  <div style={{ color: '#4ECDC4', fontWeight: 600 }}>{time} min</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Achievements View */}
      {selectedView === 'achievements' && (
        <div>
          <h3 style={{ marginBottom: '20px', color: '#333' }}>🏆 Achievement Progress</h3>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            {/* Achievement Summary */}
            <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
              <h4 style={{ marginBottom: '16px', color: '#666' }}>📊 Achievement Summary</h4>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', color: '#ffd700', marginBottom: '8px' }}>
                  {analyticsData.achievementProgress}
                </div>
                <div style={{ color: '#666' }}>
                  {analyticsData.achievementProgress === 0 ? 'No achievements yet' :
                   analyticsData.achievementProgress === 1 ? '1 achievement earned!' :
                   `${analyticsData.achievementProgress} achievements earned!`}
                </div>
              </div>
            </div>

            {/* Topic Diversity */}
            <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
              <h4 style={{ marginBottom: '16px', color: '#666' }}>🔍 Topic Diversity</h4>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', color: '#45b7d1', marginBottom: '8px' }}>
                  {analyticsData.topicDiversity}
                </div>
                <div style={{ color: '#666' }}>
                  {analyticsData.topicDiversity === 0 ? 'No topics explored yet' :
                   analyticsData.topicDiversity === 1 ? '1 topic explored' :
                   `${analyticsData.topicDiversity} different topics explored`}
                </div>
              </div>
            </div>

            {/* Learning Consistency */}
            <div style={{ background: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
              <h4 style={{ marginBottom: '16px', color: '#666' }}>📈 Learning Consistency</h4>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '3rem', color: '#96ceb4', marginBottom: '8px' }}>
                  {analyticsData.learningStreak}
                </div>
                <div style={{ color: '#666' }}>
                  {analyticsData.learningStreak === 0 ? 'Start building consistency' :
                   analyticsData.learningStreak === 1 ? '1 day streak' :
                   `${analyticsData.learningStreak} day learning streak`}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningAnalyticsDashboard;
