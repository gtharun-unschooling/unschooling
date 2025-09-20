import React, { useState } from 'react';
import PersonalizationEngine from '../../components/personalization/PersonalizationEngine';
import AdaptiveLearningPaths from '../../components/personalization/AdaptiveLearningPaths';
import ChildProfiles from '../../components/personalization/ChildProfiles';
import AIRecommendations from '../../components/personalization/AIRecommendations';

const PersonalizationDashboard = () => {
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
        return <PersonalizationEngine />;
      case 'paths':
        return <AdaptiveLearningPaths />;
      case 'profiles':
        return <ChildProfiles />;
      case 'recommendations':
        return <AIRecommendations />;
      default:
        return <PersonalizationEngine />;
    }
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={{ margin: '0 0 20px 0', color: '#1e293b' }}>
          🎯 Personalization Engine
        </h1>
        <div style={tabsStyle}>
          <button
            style={activeTab === 'overview' ? activeTabStyle : tabStyle}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button
            style={activeTab === 'paths' ? activeTabStyle : tabStyle}
            onClick={() => setActiveTab('paths')}
          >
            🛤️ Learning Paths
          </button>
          <button
            style={activeTab === 'profiles' ? activeTabStyle : tabStyle}
            onClick={() => setActiveTab('profiles')}
          >
            👤 Child Profiles
          </button>
          <button
            style={activeTab === 'recommendations' ? activeTabStyle : tabStyle}
            onClick={() => setActiveTab('recommendations')}
          >
            🤖 AI Recommendations
          </button>
        </div>
      </div>
      
      {renderActiveComponent()}
    </div>
  );
};

export default PersonalizationDashboard;
