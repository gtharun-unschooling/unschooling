import React, { useState } from 'react';
import SecurityDashboard from '../../components/security/SecurityDashboard';
import DataEncryption from '../../components/security/DataEncryption';
import AccessControl from '../../components/security/AccessControl';
import ThreatDetection from '../../components/security/ThreatDetection';

const SecurityDashboardPage = () => {
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
        return <SecurityDashboard />;
      case 'encryption':
        return <DataEncryption />;
      case 'access':
        return <AccessControl />;
      case 'threats':
        return <ThreatDetection />;
      default:
        return <SecurityDashboard />;
    }
  };

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={{ margin: '0 0 20px 0', color: '#1e293b' }}>
          🔒 Security Dashboard
        </h1>
        <div style={tabsStyle}>
          <button
            style={activeTab === 'overview' ? activeTabStyle : tabStyle}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button
            style={activeTab === 'encryption' ? activeTabStyle : tabStyle}
            onClick={() => setActiveTab('encryption')}
          >
            🔐 Encryption
          </button>
          <button
            style={activeTab === 'access' ? activeTabStyle : tabStyle}
            onClick={() => setActiveTab('access')}
          >
            🔑 Access Control
          </button>
          <button
            style={activeTab === 'threats' ? activeTabStyle : tabStyle}
            onClick={() => setActiveTab('threats')}
          >
            🚨 Threat Detection
          </button>
        </div>
      </div>
      
      {renderActiveComponent()}
    </div>
  );
};

export default SecurityDashboardPage;
