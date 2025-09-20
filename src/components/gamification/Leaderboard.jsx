import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';

const Leaderboard = () => {
  const [user] = useAuthState(auth);
  const [leaderboardData, setLeaderboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('all_time');
  const [selectedCategory, setSelectedCategory] = useState('overall');

  useEffect(() => {
    if (user) {
      loadLeaderboardData();
    }
  }, [user, selectedTimeframe, selectedCategory]);

  const loadLeaderboardData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8000/api/gamification/leaderboard?user_id=${user.uid}&timeframe=${selectedTimeframe}&category=${selectedCategory}`);
      
      if (!response.ok) {
        throw new Error('Failed to load leaderboard data');
      }

      const data = await response.json();
      setLeaderboardData(data);
    } catch (err) {
      setError(err.message);
      // Fallback to sample data
      setLeaderboardData(getSampleLeaderboardData());
    } finally {
      setIsLoading(false);
    }
  };

  const getSampleLeaderboardData = () => {
    return {
      overall: [
        { rank: 1, childName: "Emma", level: 12, xp: 18500, streak: 25, points: 4200, avatar: "👧" },
        { rank: 2, childName: "Alex", level: 11, xp: 17200, streak: 18, points: 3950, avatar: "👦" },
        { rank: 3, childName: "Maya", level: 10, xp: 15900, streak: 22, points: 3700, avatar: "👧" },
        { rank: 4, childName: "Liam", level: 9, xp: 14200, streak: 15, points: 3200, avatar: "👦" },
        { rank: 5, childName: "Zoe", level: 8, xp: 12800, streak: 12, points: 2900, avatar: "👧" },
        { rank: 6, childName: "Noah", level: 8, xp: 12500, streak: 10, points: 2850, avatar: "👦" },
        { rank: 7, childName: "Ava", level: 7, xp: 11200, streak: 8, points: 2600, avatar: "👧" },
        { rank: 8, childName: "Ethan", level: 7, xp: 10800, streak: 14, points: 2450, avatar: "👦" },
        { rank: 9, childName: "Sophia", level: 6, xp: 9800, streak: 6, points: 2200, avatar: "👧" },
        { rank: 10, childName: "Lucas", level: 6, xp: 9200, streak: 9, points: 2100, avatar: "👦" }
      ],
      weekly: [
        { rank: 1, childName: "Maya", level: 10, xp: 15900, streak: 22, points: 3700, avatar: "👧", weeklyXP: 1200 },
        { rank: 2, childName: "Emma", level: 12, xp: 18500, streak: 25, points: 4200, avatar: "👧", weeklyXP: 1100 },
        { rank: 3, childName: "Alex", level: 11, xp: 17200, streak: 18, points: 3950, avatar: "👦", weeklyXP: 950 },
        { rank: 4, childName: "Liam", level: 9, xp: 14200, streak: 15, points: 3200, avatar: "👦", weeklyXP: 800 },
        { rank: 5, childName: "Zoe", level: 8, xp: 12800, streak: 12, points: 2900, avatar: "👧", weeklyXP: 750 }
      ],
      monthly: [
        { rank: 1, childName: "Emma", level: 12, xp: 18500, streak: 25, points: 4200, avatar: "👧", monthlyXP: 4500 },
        { rank: 2, childName: "Alex", level: 11, xp: 17200, streak: 18, points: 3950, avatar: "👦", monthlyXP: 4200 },
        { rank: 3, childName: "Maya", level: 10, xp: 15900, streak: 22, points: 3700, avatar: "👧", monthlyXP: 3800 },
        { rank: 4, childName: "Liam", level: 9, xp: 14200, streak: 15, points: 3200, avatar: "👦", monthlyXP: 3200 },
        { rank: 5, childName: "Zoe", level: 8, xp: 12800, streak: 12, points: 2900, avatar: "👧", monthlyXP: 2900 }
      ],
      currentUser: {
        rank: 6,
        childName: "Current User",
        level: 8,
        xp: 12500,
        streak: 10,
        points: 2850,
        avatar: "👤"
      },
      categories: {
        science: [
          { rank: 1, childName: "Emma", level: 12, xp: 18500, streak: 25, points: 4200, avatar: "👧", scienceXP: 1200 },
          { rank: 2, childName: "Maya", level: 10, xp: 15900, streak: 22, points: 3700, avatar: "👧", scienceXP: 1100 },
          { rank: 3, childName: "Alex", level: 11, xp: 17200, streak: 18, points: 3950, avatar: "👦", scienceXP: 950 }
        ],
        art: [
          { rank: 1, childName: "Zoe", level: 8, xp: 12800, streak: 12, points: 2900, avatar: "👧", artXP: 800 },
          { rank: 2, childName: "Ava", level: 7, xp: 11200, streak: 8, points: 2600, avatar: "👧", artXP: 750 },
          { rank: 3, childName: "Sophia", level: 6, xp: 9800, streak: 6, points: 2200, avatar: "👧", artXP: 650 }
        ],
        math: [
          { rank: 1, childName: "Alex", level: 11, xp: 17200, streak: 18, points: 3950, avatar: "👦", mathXP: 1000 },
          { rank: 2, childName: "Liam", level: 9, xp: 14200, streak: 15, points: 3200, avatar: "👦", mathXP: 900 },
          { rank: 3, childName: "Noah", level: 8, xp: 12500, streak: 10, points: 2850, avatar: "👦", mathXP: 800 }
        ]
      }
    };
  };

  const getCurrentLeaderboard = () => {
    if (!leaderboardData) return [];
    
    if (selectedCategory === 'overall') {
      switch (selectedTimeframe) {
        case 'weekly': return leaderboardData.weekly || [];
        case 'monthly': return leaderboardData.monthly || [];
        default: return leaderboardData.overall || [];
      }
    } else {
      return leaderboardData.categories?.[selectedCategory] || [];
    }
  };

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case 1: return '#f59e0b';
      case 2: return '#6b7280';
      case 3: return '#cd7f32';
      default: return '#64748b';
    }
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '20px'
  };

  const cardStyle = {
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  };

  const leaderboardItemStyle = (rank, isCurrentUser = false) => ({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    marginBottom: '8px',
    backgroundColor: isCurrentUser ? '#f0f9ff' : 'white',
    borderColor: isCurrentUser ? '#3b82f6' : '#e2e8f0'
  });

  const currentUserCardStyle = {
    padding: '20px',
    backgroundColor: '#f0f9ff',
    borderRadius: '12px',
    border: '2px solid #3b82f6',
    marginBottom: '20px'
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
          Loading leaderboard...
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

  const currentLeaderboard = getCurrentLeaderboard();

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={{ margin: '0', color: '#1e293b' }}>
          🏆 Leaderboard
        </h1>
        <div style={{ fontSize: '14px', color: '#64748b' }}>
          Compete with friends and see who's on top!
        </div>
      </div>

      {/* Filters */}
      <div style={filterStyle}>
        <select
          value={selectedTimeframe}
          onChange={(e) => setSelectedTimeframe(e.target.value)}
          style={selectStyle}
        >
          <option value="all_time">All Time</option>
          <option value="monthly">This Month</option>
          <option value="weekly">This Week</option>
        </select>

        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={selectStyle}
        >
          <option value="overall">Overall</option>
          <option value="science">Science</option>
          <option value="art">Art</option>
          <option value="math">Math</option>
        </select>
      </div>

      {/* Current User Position */}
      {leaderboardData?.currentUser && (
        <div style={currentUserCardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            🎯 Your Position
          </h3>
          <div style={leaderboardItemStyle(leaderboardData.currentUser.rank, true)}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                backgroundColor: getRankColor(leaderboardData.currentUser.rank),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '14px',
                fontWeight: 'bold',
                color: 'white'
              }}>
                {getRankIcon(leaderboardData.currentUser.rank)}
              </div>
              <div style={{ fontSize: '24px' }}>{leaderboardData.currentUser.avatar}</div>
              <div>
                <div style={{ fontWeight: '500', color: '#1e293b' }}>
                  {leaderboardData.currentUser.childName}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  Level {leaderboardData.currentUser.level} • {leaderboardData.currentUser.xp} XP
                </div>
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b' }}>
                {leaderboardData.currentUser.points} points
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                {leaderboardData.currentUser.streak} day streak
              </div>
            </div>
          </div>
        </div>
      )}

      <div style={gridStyle}>
        {/* Main Leaderboard */}
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            🏆 Top Performers
          </h3>
          {currentLeaderboard.length > 0 ? (
            currentLeaderboard.map((player, index) => (
              <div key={index} style={leaderboardItemStyle(player.rank)}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    borderRadius: '50%',
                    backgroundColor: getRankColor(player.rank),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: 'bold',
                    color: 'white'
                  }}>
                    {getRankIcon(player.rank)}
                  </div>
                  <div style={{ fontSize: '24px' }}>{player.avatar}</div>
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
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b' }}>
                    {player.points} points
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    {player.streak} day streak
                  </div>
                  {player.weeklyXP && (
                    <div style={{ fontSize: '12px', color: '#10b981' }}>
                      +{player.weeklyXP} this week
                    </div>
                  )}
                  {player.monthlyXP && (
                    <div style={{ fontSize: '12px', color: '#10b981' }}>
                      +{player.monthlyXP} this month
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', color: '#64748b', padding: '20px' }}>
              No leaderboard data available for the selected filters.
            </div>
          )}
        </div>

        {/* Leaderboard Statistics */}
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            📊 Leaderboard Stats
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '16px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>
                {currentLeaderboard.length}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                Total Players
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
                {currentLeaderboard.length > 0 ? Math.round(currentLeaderboard.reduce((sum, p) => sum + p.xp, 0) / currentLeaderboard.length) : 0}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                Avg XP
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>
                {currentLeaderboard.length > 0 ? Math.round(currentLeaderboard.reduce((sum, p) => sum + p.streak, 0) / currentLeaderboard.length) : 0}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                Avg Streak
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>
                {currentLeaderboard.length > 0 ? Math.round(currentLeaderboard.reduce((sum, p) => sum + p.points, 0) / currentLeaderboard.length) : 0}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                Avg Points
              </div>
            </div>
          </div>

          {/* Top Categories */}
          <div style={{ marginTop: '20px' }}>
            <h4 style={{ margin: '0 0 12px 0', color: '#1e293b' }}>
              🎯 Top Categories
            </h4>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {['science', 'art', 'math'].map(category => (
                <div key={category} style={{
                  padding: '8px 12px',
                  backgroundColor: '#f1f5f9',
                  borderRadius: '6px',
                  fontSize: '12px',
                  color: '#64748b',
                  textTransform: 'capitalize'
                }}>
                  {category}
                </div>
              ))}
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

export default Leaderboard;
