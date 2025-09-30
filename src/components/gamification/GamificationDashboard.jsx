import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';

const GamificationDashboard = () => {
  const [user] = useAuthState(auth);
  const [gamificationData, setGamificationData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChild, setSelectedChild] = useState(null);

  useEffect(() => {
    if (user) {
      loadGamificationData();
    }
  }, [user, selectedChild]);

  const loadGamificationData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8000/api/gamification/dashboard?user_id=${user.uid}&child_id=${selectedChild || 'all'}`);
      
      if (!response.ok) {
        throw new Error('Failed to load gamification data');
      }

      const data = await response.json();
      setGamificationData(data);
    } catch (err) {
      setError(err.message);
      // Fallback to sample data
      setGamificationData(getSampleGamificationData());
    } finally {
      setIsLoading(false);
    }
  };

  const getSampleGamificationData = () => {
    return {
      userProgress: {
        currentLevel: 8,
        currentXP: 2450,
        xpToNextLevel: 500,
        totalXP: 12450,
        currentStreak: 12,
        longestStreak: 28,
        totalPoints: 3450,
        rank: "Explorer"
      },
      achievements: [
        {
          achievementId: "first_activity",
          title: "First Steps",
          description: "Complete your first learning activity",
          icon: "🌟",
          earnedAt: "2024-01-10T10:30:00Z",
          points: 50,
          rarity: "common"
        },
        {
          achievementId: "week_streak",
          title: "Week Warrior",
          description: "Complete activities for 7 consecutive days",
          icon: "🔥",
          earnedAt: "2024-01-17T15:45:00Z",
          points: 200,
          rarity: "rare"
        },
        {
          achievementId: "science_master",
          title: "Science Master",
          description: "Complete 10 science experiments",
          icon: "🧪",
          earnedAt: "2024-01-20T14:20:00Z",
          points: 300,
          rarity: "epic"
        },
        {
          achievementId: "art_enthusiast",
          title: "Art Enthusiast",
          description: "Create 5 art projects",
          icon: "🎨",
          earnedAt: "2024-01-22T11:15:00Z",
          points: 250,
          rarity: "rare"
        }
      ],
      availableAchievements: [
        {
          achievementId: "month_streak",
          title: "Monthly Master",
          description: "Complete activities for 30 consecutive days",
          icon: "👑",
          points: 500,
          rarity: "legendary",
          progress: 12,
          target: 30
        },
        {
          achievementId: "math_whiz",
          title: "Math Whiz",
          description: "Complete 15 math activities",
          icon: "🔢",
          points: 400,
          rarity: "epic",
          progress: 8,
          target: 15
        },
        {
          achievementId: "reading_champion",
          title: "Reading Champion",
          description: "Read 20 books or stories",
          icon: "📚",
          points: 350,
          rarity: "epic",
          progress: 12,
          target: 20
        }
      ],
      leaderboard: [
        { rank: 1, childName: "Emma", level: 12, xp: 18500, streak: 25 },
        { rank: 2, childName: "Alex", level: 11, xp: 17200, streak: 18 },
        { rank: 3, childName: "Maya", level: 10, xp: 15900, streak: 22 },
        { rank: 4, childName: "Liam", level: 9, xp: 14200, streak: 15 },
        { rank: 5, childName: "Zoe", level: 8, xp: 12800, streak: 12 }
      ],
      recentActivity: [
        {
          type: "achievement_earned",
          title: "Science Master",
          description: "Earned the Science Master achievement!",
          timestamp: "2024-01-20T14:20:00Z",
          points: 300
        },
        {
          type: "level_up",
          title: "Level Up!",
          description: "Reached level 8!",
          timestamp: "2024-01-19T16:30:00Z",
          points: 0
        },
        {
          type: "streak_milestone",
          title: "Streak Milestone",
          description: "10 day streak achieved!",
          timestamp: "2024-01-18T09:15:00Z",
          points: 100
        }
      ]
    };
  };

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return '#6b7280';
      case 'rare': return '#3b82f6';
      case 'epic': return '#8b5cf6';
      case 'legendary': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getProgressPercentage = (progress, target) => {
    return Math.min((progress / target) * 100, 100);
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

  const achievementCardStyle = {
    padding: '16px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  };

  const leaderboardItemStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    marginBottom: '8px'
  };

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
          Loading gamification data...
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
          🎮 Gamification Dashboard
        </h1>
        <div style={{ fontSize: '14px', color: '#64748b' }}>
          Track progress, earn achievements, and compete with friends!
        </div>
      </div>

      {/* User Progress Overview */}
      <div style={gridStyle}>
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            🏆 Current Level
          </h3>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '8px' }}>
              {gamificationData?.userProgress?.currentLevel || 0}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>
              {gamificationData?.userProgress?.rank || 'Beginner'}
            </div>
            <div style={progressBarStyle}>
              <div style={progressFillStyle(
                (gamificationData?.userProgress?.currentXP || 0) / 
                (gamificationData?.userProgress?.xpToNextLevel || 1) * 100
              )}></div>
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              {gamificationData?.userProgress?.currentXP || 0} / {gamificationData?.userProgress?.xpToNextLevel || 0} XP
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            🔥 Current Streak
          </h3>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#f59e0b', marginBottom: '8px' }}>
              {gamificationData?.userProgress?.currentStreak || 0}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>
              days in a row
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '8px' }}>
              Best: {gamificationData?.userProgress?.longestStreak || 0} days
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            ⭐ Total Points
          </h3>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#10b981', marginBottom: '8px' }}>
              {gamificationData?.userProgress?.totalPoints || 0}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>
              points earned
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '8px' }}>
              Total XP: {gamificationData?.userProgress?.totalXP || 0}
            </div>
          </div>
        </div>
      </div>

      <div style={gridStyle}>
        {/* Achievements */}
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            🏅 Earned Achievements
          </h3>
          {gamificationData?.achievements?.map((achievement, index) => (
            <div key={index} style={achievementCardStyle}>
              <div style={{ fontSize: '24px' }}>{achievement.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '500', color: '#1e293b' }}>
                  {achievement.title}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  {achievement.description}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                  Earned: {new Date(achievement.earnedAt).toLocaleDateString()}
                </div>
              </div>
              <div style={{
                padding: '4px 8px',
                backgroundColor: getRarityColor(achievement.rarity),
                color: 'white',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                +{achievement.points}
              </div>
            </div>
          ))}
        </div>

        {/* Available Achievements */}
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            🎯 Available Achievements
          </h3>
          {gamificationData?.availableAchievements?.map((achievement, index) => (
            <div key={index} style={achievementCardStyle}>
              <div style={{ fontSize: '24px', opacity: 0.6 }}>{achievement.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '500', color: '#1e293b' }}>
                  {achievement.title}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  {achievement.description}
                </div>
                <div style={progressBarStyle}>
                  <div style={progressFillStyle(
                    getProgressPercentage(achievement.progress, achievement.target)
                  )}></div>
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  {achievement.progress} / {achievement.target}
                </div>
              </div>
              <div style={{
                padding: '4px 8px',
                backgroundColor: getRarityColor(achievement.rarity),
                color: 'white',
                borderRadius: '4px',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                +{achievement.points}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={gridStyle}>
        {/* Leaderboard */}
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            🏆 Leaderboard
          </h3>
          {gamificationData?.leaderboard?.map((player, index) => (
            <div key={index} style={leaderboardItemStyle}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  backgroundColor: index === 0 ? '#f59e0b' : index === 1 ? '#6b7280' : index === 2 ? '#cd7f32' : '#e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '12px',
                  fontWeight: 'bold',
                  color: 'white'
                }}>
                  {index + 1}
                </div>
                <div>
                  <div style={{ fontWeight: '500', color: '#1e293b' }}>
                    {player.childName}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    Level {player.level} • {player.xp} XP
                  </div>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  {player.streak} day streak
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            📈 Recent Activity
          </h3>
          {gamificationData?.recentActivity?.map((activity, index) => (
            <div key={index} style={{
              padding: '12px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              marginBottom: '8px'
            }}>
              <div style={{ fontWeight: '500', color: '#1e293b' }}>
                {activity.title}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                {activity.description}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                {new Date(activity.timestamp).toLocaleDateString()}
                {activity.points > 0 && (
                  <span style={{ color: '#10b981', marginLeft: '8px' }}>
                    +{activity.points} points
                  </span>
                )}
              </div>
            </div>
          ))}
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

export default GamificationDashboard;
