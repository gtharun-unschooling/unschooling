import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';

const AchievementSystem = () => {
  const [user] = useAuthState(auth);
  const [achievements, setAchievements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedRarity, setSelectedRarity] = useState('all');

  useEffect(() => {
    if (user) {
      loadAchievements();
    }
  }, [user, selectedCategory, selectedRarity]);

  const loadAchievements = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8000/api/gamification/achievements?user_id=${user.uid}&category=${selectedCategory}&rarity=${selectedRarity}`);
      
      if (!response.ok) {
        throw new Error('Failed to load achievements');
      }

      const data = await response.json();
      setAchievements(data.achievements || []);
    } catch (err) {
      setError(err.message);
      // Fallback to sample data
      setAchievements(getSampleAchievements());
    } finally {
      setIsLoading(false);
    }
  };

  const getSampleAchievements = () => {
    return [
      {
        achievementId: "first_activity",
        title: "First Steps",
        description: "Complete your first learning activity",
        icon: "🌟",
        category: "milestone",
        rarity: "common",
        points: 50,
        isEarned: true,
        earnedAt: "2024-01-10T10:30:00Z",
        progress: 1,
        target: 1
      },
      {
        achievementId: "week_streak",
        title: "Week Warrior",
        description: "Complete activities for 7 consecutive days",
        icon: "🔥",
        category: "streak",
        rarity: "rare",
        points: 200,
        isEarned: true,
        earnedAt: "2024-01-17T15:45:00Z",
        progress: 7,
        target: 7
      },
      {
        achievementId: "month_streak",
        title: "Monthly Master",
        description: "Complete activities for 30 consecutive days",
        icon: "👑",
        category: "streak",
        rarity: "legendary",
        points: 500,
        isEarned: false,
        earnedAt: null,
        progress: 12,
        target: 30
      },
      {
        achievementId: "science_master",
        title: "Science Master",
        description: "Complete 10 science experiments",
        icon: "🧪",
        category: "subject",
        rarity: "epic",
        points: 300,
        isEarned: true,
        earnedAt: "2024-01-20T14:20:00Z",
        progress: 10,
        target: 10
      },
      {
        achievementId: "math_whiz",
        title: "Math Whiz",
        description: "Complete 15 math activities",
        icon: "🔢",
        category: "subject",
        rarity: "epic",
        points: 400,
        isEarned: false,
        earnedAt: null,
        progress: 8,
        target: 15
      },
      {
        achievementId: "art_enthusiast",
        title: "Art Enthusiast",
        description: "Create 5 art projects",
        icon: "🎨",
        category: "subject",
        rarity: "rare",
        points: 250,
        isEarned: true,
        earnedAt: "2024-01-22T11:15:00Z",
        progress: 5,
        target: 5
      },
      {
        achievementId: "reading_champion",
        title: "Reading Champion",
        description: "Read 20 books or stories",
        icon: "📚",
        category: "subject",
        rarity: "epic",
        points: 350,
        isEarned: false,
        earnedAt: null,
        progress: 12,
        target: 20
      },
      {
        achievementId: "speed_demon",
        title: "Speed Demon",
        description: "Complete 5 activities in one day",
        icon: "⚡",
        category: "performance",
        rarity: "rare",
        points: 150,
        isEarned: false,
        earnedAt: null,
        progress: 3,
        target: 5
      },
      {
        achievementId: "perfectionist",
        title: "Perfectionist",
        description: "Get perfect scores on 10 activities",
        icon: "💯",
        category: "performance",
        rarity: "epic",
        points: 300,
        isEarned: false,
        earnedAt: null,
        progress: 6,
        target: 10
      },
      {
        achievementId: "explorer",
        title: "Explorer",
        description: "Try activities from 5 different categories",
        icon: "🗺️",
        category: "exploration",
        rarity: "rare",
        points: 200,
        isEarned: true,
        earnedAt: "2024-01-15T09:20:00Z",
        progress: 5,
        target: 5
      }
    ];
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

  const getRarityName = (rarity) => {
    switch (rarity) {
      case 'common': return 'Common';
      case 'rare': return 'Rare';
      case 'epic': return 'Epic';
      case 'legendary': return 'Legendary';
      default: return 'Common';
    }
  };

  const getCategoryName = (category) => {
    switch (category) {
      case 'milestone': return 'Milestones';
      case 'streak': return 'Streaks';
      case 'subject': return 'Subjects';
      case 'performance': return 'Performance';
      case 'exploration': return 'Exploration';
      default: return 'Other';
    }
  };

  const getProgressPercentage = (progress, target) => {
    return Math.min((progress / target) * 100, 100);
  };

  const filteredAchievements = achievements.filter(achievement => {
    const categoryMatch = selectedCategory === 'all' || achievement.category === selectedCategory;
    const rarityMatch = selectedRarity === 'all' || achievement.rarity === selectedRarity;
    return categoryMatch && rarityMatch;
  });

  const earnedAchievements = filteredAchievements.filter(a => a.isEarned);
  const availableAchievements = filteredAchievements.filter(a => !a.isEarned);

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
    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
    gap: '20px'
  };

  const cardStyle = {
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  };

  const achievementCardStyle = (isEarned) => ({
    padding: '16px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    opacity: isEarned ? 1 : 0.7,
    backgroundColor: isEarned ? '#f0fdf4' : '#fafafa'
  });

  const progressBarStyle = {
    width: '100%',
    height: '8px',
    backgroundColor: '#e2e8f0',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '8px'
  };

  const progressFillStyle = (percentage) => ({
    width: `${percentage}%`,
    height: '100%',
    backgroundColor: '#10b981',
    transition: 'width 0.3s ease'
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
          Loading achievements...
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
          🏅 Achievement System
        </h1>
        <div style={{ fontSize: '14px', color: '#64748b' }}>
          Track your progress and unlock amazing achievements!
        </div>
      </div>

      {/* Filters */}
      <div style={filterStyle}>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={selectStyle}
        >
          <option value="all">All Categories</option>
          <option value="milestone">Milestones</option>
          <option value="streak">Streaks</option>
          <option value="subject">Subjects</option>
          <option value="performance">Performance</option>
          <option value="exploration">Exploration</option>
        </select>

        <select
          value={selectedRarity}
          onChange={(e) => setSelectedRarity(e.target.value)}
          style={selectStyle}
        >
          <option value="all">All Rarities</option>
          <option value="common">Common</option>
          <option value="rare">Rare</option>
          <option value="epic">Epic</option>
          <option value="legendary">Legendary</option>
        </select>
      </div>

      <div style={gridStyle}>
        {/* Earned Achievements */}
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            ✅ Earned Achievements ({earnedAchievements.length})
          </h3>
          {earnedAchievements.length > 0 ? (
            earnedAchievements.map((achievement, index) => (
              <div key={index} style={achievementCardStyle(true)}>
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
            ))
          ) : (
            <div style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>
              No earned achievements yet. Keep learning to unlock your first achievement!
            </div>
          )}
        </div>

        {/* Available Achievements */}
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            🎯 Available Achievements ({availableAchievements.length})
          </h3>
          {availableAchievements.length > 0 ? (
            availableAchievements.map((achievement, index) => (
              <div key={index} style={achievementCardStyle(false)}>
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
            ))
          ) : (
            <div style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>
              No available achievements found for the selected filters.
            </div>
          )}
        </div>
      </div>

      {/* Achievement Statistics */}
      <div style={cardStyle}>
        <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
          📊 Achievement Statistics
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
              {earnedAchievements.length}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              Achievements Earned
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>
              {availableAchievements.length}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              Available to Earn
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>
              {earnedAchievements.reduce((sum, a) => sum + a.points, 0)}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              Total Points Earned
            </div>
          </div>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>
              {Math.round((earnedAchievements.length / (earnedAchievements.length + availableAchievements.length)) * 100)}%
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              Completion Rate
            </div>
          </div>
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

export default AchievementSystem;
