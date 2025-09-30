import React, { useState } from 'react';
import ComplianceDashboard from '../../components/compliance/ComplianceDashboard';
import PrivacyManagement from '../../components/compliance/PrivacyManagement';
import DataGovernance from '../../components/compliance/DataGovernance';

const ComplianceDashboardPage = () => {
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
        return <ComplianceDashboard />;
      case 'privacy':
        return <PrivacyManagement />;
      case 'governance':
        return <DataGovernance />;
      default:
        return <ComplianceDashboard />;
    }
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={{ margin: '0 0 20px 0', color: '#1e293b' }}>
          📋 Compliance Dashboard
        </h1>
        <div style={tabsStyle}>
          <button
            style={activeTab === 'overview' ? activeTabStyle : tabStyle}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button
            style={activeTab === 'privacy' ? activeTabStyle : tabStyle}
            onClick={() => setActiveTab('privacy')}
          >
            🔒 Privacy Management
          </button>
          <button
            style={activeTab === 'governance' ? activeTabStyle : tabStyle}
            onClick={() => setActiveTab('governance')}
          >
            📊 Data Governance
          </button>
        </div>
      </div>
      
      {renderActiveComponent()}
    </div>
  );
};

export default ComplianceDashboardPage;
