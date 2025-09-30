import React, { useState, useEffect } from 'react';
import { getEnvironmentInfo, logEnvironmentInfo } from '../config/config.js';

const EnvironmentSwitcher = () => {
  const [envInfo, setEnvInfo] = useState(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const info = getEnvironmentInfo();
    setEnvInfo(info);
    logEnvironmentInfo();
  }, []);

  if (!envInfo || !envInfo.debug) {
    return null; // Don't show in production
  }

  const getEnvironmentColor = () => {
    switch (envInfo.environment) {
      case 'local': return '#10B981'; // Green
      case 'staging': return '#F59E0B'; // Yellow
      case 'production': return '#EF4444'; // Red
      default: return '#6B7280'; // Gray
    }
  };

  const getEnvironmentIcon = () => {
    switch (envInfo.environment) {
      case 'local': return '🏠';
      case 'staging': return '🧪';
      case 'production': return '🌐';
      default: return '❓';
    }
  };

  return (
    <div className="environment-switcher">
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="env-toggle-btn"
        style={{
          position: 'fixed',
          top: '10px',
          right: '10px',
          zIndex: 9999,
          background: getEnvironmentColor(),
          color: 'white',
          border: 'none',
          borderRadius: '20px',
          padding: '8px 12px',
          fontSize: '12px',
          fontWeight: 'bold',
          cursor: 'pointer',
          boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
        }}
      >
        {getEnvironmentIcon()} {envInfo.environment.toUpperCase()}
      </button>

      {isVisible && (
        <div
          className="env-info-panel"
          style={{
            position: 'fixed',
            top: '50px',
            right: '10px',
            zIndex: 9998,
            background: 'white',
            border: '1px solid #e5e7eb',
            borderRadius: '8px',
            padding: '16px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            minWidth: '300px',
            fontSize: '12px'
          }}
        >
          <h4 style={{ margin: '0 0 12px 0', color: '#374151' }}>
            Environment Information
          </h4>
          
          <div style={{ marginBottom: '8px' }}>
            <strong>Environment:</strong> {envInfo.environment}
          </div>
          
          <div style={{ marginBottom: '8px' }}>
            <strong>API Base URL:</strong> 
            <div style={{ 
              wordBreak: 'break-all', 
              color: '#6B7280',
              marginTop: '2px'
            }}>
              {envInfo.apiBaseUrl}
            </div>
          </div>
          
          <div style={{ marginBottom: '8px' }}>
            <strong>Warehouse API:</strong>
            <div style={{ 
              wordBreak: 'break-all', 
              color: '#6B7280',
              marginTop: '2px'
            }}>
              {envInfo.warehouseApiUrl}
            </div>
          </div>
          
          <div style={{ marginBottom: '8px' }}>
            <strong>Local Backend:</strong> {envInfo.useLocalBackend ? '✅ Yes' : '❌ No'}
          </div>
          
          <div style={{ marginBottom: '8px' }}>
            <strong>Debug Mode:</strong> {envInfo.debug ? '✅ Enabled' : '❌ Disabled'}
          </div>

          <div style={{ 
            marginTop: '12px', 
            paddingTop: '12px', 
            borderTop: '1px solid #e5e7eb',
            fontSize: '11px',
            color: '#6B7280'
          }}>
            💡 Switch environments using the dev scripts in your terminal
          </div>
        </div>
      )}
    </div>
  );
};

export default EnvironmentSwitcher;
