import React, { useState } from 'react';
import GamificationDashboard from '../../components/gamification/GamificationDashboard';
import AchievementSystem from '../../components/gamification/AchievementSystem';
import Leaderboard from '../../components/gamification/Leaderboard';
import ProgressTracking from '../../components/gamification/ProgressTracking';
import RewardSystem from '../../components/gamification/RewardSystem';

const GamificationDashboardPage = () => {
  const [activeTab, setActiveTab] = useState('overview');

  const tabStyle = {
    padding: '12px 24px',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: '16px',
    fontWeight: '500',
    color: '#64748b',
    borderBottom: '2px solid transparent',
    transition: 'all 0.2s ease'
  };

  const activeTabStyle = {
    ...tabStyle,
    color: '#3b82f6',
    borderBottomColor: '#3b82f6'
  };

  const containerStyle = {
    fontFamily: 'system-ui, -apple-system, sans-serif'
  };

  const headerStyle = {
    padding: '20px',
    backgroundColor: '#f8fafc',
    borderBottom: '1px solid #e2e8f0'
  };

  const tabsStyle = {
    display: 'flex',
    gap: '0',
    marginBottom: '0'
  };

  const renderActiveComponent = () => {
    switch (activeTab) {
      case 'overview':
        return <GamificationDashboard />;
      case 'achievements':
        return <AchievementSystem />;
      case 'leaderboard':
        return <Leaderboard />;
      case 'progress':
        return <ProgressTracking />;
      case 'rewards':
        return <RewardSystem />;
      default:
        return <GamificationDashboard />;
    }
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={{ margin: '0 0 20px 0', color: '#1e293b' }}>
          🎮 Gamification System
        </h1>
        <div style={tabsStyle}>
          <button
            style={activeTab === 'overview' ? activeTabStyle : tabStyle}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button
            style={activeTab === 'achievements' ? activeTabStyle : tabStyle}
            onClick={() => setActiveTab('achievements')}
          >
            🏅 Achievements
          </button>
          <button
            style={activeTab === 'leaderboard' ? activeTabStyle : tabStyle}
            onClick={() => setActiveTab('leaderboard')}
          >
            🏆 Leaderboard
          </button>
          <button
            style={activeTab === 'progress' ? activeTabStyle : tabStyle}
            onClick={() => setActiveTab('progress')}
          >
            📈 Progress
          </button>
          <button
            style={activeTab === 'rewards' ? activeTabStyle : tabStyle}
            onClick={() => setActiveTab('rewards')}
          >
            🎁 Rewards
          </button>
        </div>
      </div>
      
      {renderActiveComponent()}
    </div>
  );
};

export default GamificationDashboardPage;
