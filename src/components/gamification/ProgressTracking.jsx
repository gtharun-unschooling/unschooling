import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';

const ProgressTracking = () => {
  const [user] = useAuthState(auth);
  const [progressData, setProgressData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('7_days');
  const [selectedChild, setSelectedChild] = useState('all');

  useEffect(() => {
    if (user) {
      loadProgressData();
    }
  }, [user, selectedTimeframe, selectedChild]);

  const loadProgressData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8000/api/gamification/progress?user_id=${user.uid}&timeframe=${selectedTimeframe}&child_id=${selectedChild}`);
      
      if (!response.ok) {
        throw new Error('Failed to load progress data');
      }

      const data = await response.json();
      setProgressData(data);
    } catch (err) {
      setError(err.message);
      // Fallback to sample data
      setProgressData(getSampleProgressData());
    } finally {
      setIsLoading(false);
    }
  };

  const getSampleProgressData = () => {
    return {
      currentLevel: 8,
      currentXP: 2450,
      xpToNextLevel: 500,
      totalXP: 12450,
      currentStreak: 12,
      longestStreak: 28,
      totalPoints: 3450,
      rank: "Explorer",
      weeklyProgress: [
        { day: 'Mon', xp: 120, activities: 3, streak: 1 },
        { day: 'Tue', xp: 180, activities: 4, streak: 2 },
        { day: 'Wed', xp: 150, activities: 3, streak: 3 },
        { day: 'Thu', xp: 200, activities: 5, streak: 4 },
        { day: 'Fri', xp: 160, activities: 4, streak: 5 },
        { day: 'Sat', xp: 140, activities: 3, streak: 6 },
        { day: 'Sun', xp: 220, activities: 6, streak: 7 }
      ],
      monthlyProgress: [
        { week: 1, xp: 1200, activities: 25, streak: 7 },
        { week: 2, xp: 1400, activities: 28, streak: 14 },
        { week: 3, xp: 1100, activities: 22, streak: 21 },
        { week: 4, xp: 1600, activities: 32, streak: 28 }
      ],
      subjectProgress: [
        { subject: 'Science', xp: 3200, activities: 45, completionRate: 85, level: 6 },
        { subject: 'Art', xp: 2800, activities: 38, completionRate: 78, level: 5 },
        { subject: 'Math', xp: 2600, activities: 42, completionRate: 82, level: 5 },
        { subject: 'Reading', xp: 2400, activities: 35, completionRate: 75, level: 4 },
        { subject: 'Music', xp: 1800, activities: 28, completionRate: 70, level: 4 }
      ],
      achievements: [
        { title: 'First Steps', earnedAt: '2024-01-10', points: 50 },
        { title: 'Week Warrior', earnedAt: '2024-01-17', points: 200 },
        { title: 'Science Master', earnedAt: '2024-01-20', points: 300 },
        { title: 'Art Enthusiast', earnedAt: '2024-01-22', points: 250 }
      ],
      goals: [
        { title: 'Complete 30 activities this month', progress: 25, target: 30, type: 'activity' },
        { title: 'Maintain 20-day streak', progress: 12, target: 20, type: 'streak' },
        { title: 'Earn 1000 XP this week', progress: 750, target: 1000, type: 'xp' },
        { title: 'Unlock 5 new achievements', progress: 3, target: 5, type: 'achievement' }
      ],
      recentActivity: [
        { type: 'activity_completed', title: 'Rainbow Milk Experiment', xp: 150, timestamp: '2024-01-22T14:30:00Z' },
        { type: 'achievement_earned', title: 'Art Enthusiast', xp: 250, timestamp: '2024-01-22T11:15:00Z' },
        { type: 'level_up', title: 'Level 8 Reached!', xp: 0, timestamp: '2024-01-21T16:45:00Z' },
        { type: 'streak_milestone', title: '10 Day Streak!', xp: 100, timestamp: '2024-01-20T09:20:00Z' }
      ]
    };
  };

  const getProgressPercentage = (progress, target) => {
    return Math.min((progress / target) * 100, 100);
  };

  const getLevelProgressPercentage = () => {
    if (!progressData) return 0;
    return (progressData.currentXP / progressData.xpToNextLevel) * 100;
  };

  const containerStyle = {
    padding: '20px',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid #e2e8f0'
  };

  const filterStyle = {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
    flexWrap: 'wrap'
  };

  const selectStyle = {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    backgroundColor: 'white',
    fontSize: '14px'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  };

  const cardStyle = {
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  };

  const progressBarStyle = {
    width: '100%',
    height: '12px',
    backgroundColor: '#e2e8f0',
    borderRadius: '6px',
    overflow: 'hidden',
    marginBottom: '8px'
  };

  const progressFillStyle = (percentage) => ({
    width: `${percentage}%`,
    height: '100%',
    backgroundColor: '#10b981',
    transition: 'width 0.3s ease'
  });

  const chartBarStyle = (height) => ({
    width: '100%',
    height: `${height}px`,
    backgroundColor: '#3b82f6',
    borderRadius: '4px 4px 0 0',
    transition: 'height 0.3s ease'
  });

  if (isLoading) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{
            width: '24px',
            height: '24px',
            border: '2px solid #3b82f6',
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 12px'
          }}></div>
          Loading progress data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <div style={{
          padding: '16px',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          color: '#dc2626'
        }}>
          <strong>Error:</strong> {error}
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={{ margin: '0', color: '#1e293b' }}>
          📈 Progress Tracking
        </h1>
        <div style={{ fontSize: '14px', color: '#64748b' }}>
          Track your learning journey and celebrate achievements!
        </div>
      </div>

      {/* Filters */}
      <div style={filterStyle}>
        <select
          value={selectedTimeframe}
          onChange={(e) => setSelectedTimeframe(e.target.value)}
          style={selectStyle}
        >
          <option value="7_days">Last 7 Days</option>
          <option value="30_days">Last 30 Days</option>
          <option value="90_days">Last 90 Days</option>
          <option value="all_time">All Time</option>
        </select>

        <select
          value={selectedChild}
          onChange={(e) => setSelectedChild(e.target.value)}
          style={selectStyle}
        >
          <option value="all">All Children</option>
          <option value="child1">Child 1</option>
          <option value="child2">Child 2</option>
        </select>
      </div>

      {/* Current Level Progress */}
      <div style={gridStyle}>
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            🏆 Current Level
          </h3>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '8px' }}>
              {progressData?.currentLevel || 0}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>
              {progressData?.rank || 'Beginner'}
            </div>
            <div style={progressBarStyle}>
              <div style={progressFillStyle(getLevelProgressPercentage())}></div>
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              {progressData?.currentXP || 0} / {progressData?.xpToNextLevel || 0} XP
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            🔥 Current Streak
          </h3>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#f59e0b', marginBottom: '8px' }}>
              {progressData?.currentStreak || 0}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>
              days in a row
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '8px' }}>
              Best: {progressData?.longestStreak || 0} days
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            ⭐ Total Points
          </h3>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#10b981', marginBottom: '8px' }}>
              {progressData?.totalPoints || 0}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>
              points earned
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '8px' }}>
              Total XP: {progressData?.totalXP || 0}
            </div>
          </div>
        </div>
      </div>

      <div style={gridStyle}>
        {/* Weekly Progress Chart */}
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            📊 Weekly Progress
          </h3>
          <div style={{ display: 'flex', alignItems: 'end', gap: '8px', height: '120px', marginBottom: '16px' }}>
            {progressData?.weeklyProgress?.map((day, index) => (
              <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={chartBarStyle((day.xp / 250) * 100)}></div>
                <div style={{ fontSize: '10px', color: '#64748b', marginTop: '4px' }}>
                  {day.day}
                </div>
                <div style={{ fontSize: '10px', color: '#64748b' }}>
                  {day.xp} XP
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Subject Progress */}
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            📚 Subject Progress
          </h3>
          {progressData?.subjectProgress?.map((subject, index) => (
            <div key={index} style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ fontWeight: '500', color: '#1e293b' }}>
                  {subject.subject}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  Level {subject.level}
                </div>
              </div>
              <div style={progressBarStyle}>
                <div style={progressFillStyle(subject.completionRate)}></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b' }}>
                <span>{subject.activities} activities</span>
                <span>{subject.completionRate}% complete</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={gridStyle}>
        {/* Goals */}
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            🎯 Current Goals
          </h3>
          {progressData?.goals?.map((goal, index) => (
            <div key={index} style={{ marginBottom: '16px' }}>
              <div style={{ fontWeight: '500', color: '#1e293b', marginBottom: '8px' }}>
                {goal.title}
              </div>
              <div style={progressBarStyle}>
                <div style={progressFillStyle(getProgressPercentage(goal.progress, goal.target))}></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '12px', color: '#64748b' }}>
                <span>{goal.progress} / {goal.target}</span>
                <span>{Math.round(getProgressPercentage(goal.progress, goal.target))}%</span>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Achievements */}
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            🏅 Recent Achievements
          </h3>
          {progressData?.achievements?.map((achievement, index) => (
            <div key={index} style={{
              padding: '12px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              marginBottom: '8px',
              backgroundColor: '#f0fdf4'
            }}>
              <div style={{ fontWeight: '500', color: '#1e293b' }}>
                {achievement.title}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                Earned: {new Date(achievement.earnedAt).toLocaleDateString()}
              </div>
              <div style={{ fontSize: '12px', color: '#10b981', marginTop: '4px' }}>
                +{achievement.points} points
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div style={cardStyle}>
        <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
          📈 Recent Activity
        </h3>
        {progressData?.recentActivity?.map((activity, index) => (
          <div key={index} style={{
            padding: '12px',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            marginBottom: '8px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <div style={{ fontWeight: '500', color: '#1e293b' }}>
                {activity.title}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                {new Date(activity.timestamp).toLocaleDateString()}
              </div>
            </div>
            {activity.xp > 0 && (
              <div style={{
                padding: '4px 8px',
                backgroundColor: '#10b981',
                color: 'white',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                +{activity.xp} XP
              </div>
            )}
          </div>
        ))}
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

export default ProgressTracking;
