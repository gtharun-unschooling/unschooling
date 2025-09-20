/**
 * Monitoring Dashboard Component
 * Comprehensive system monitoring, observability, and real-time alerting
 */

import React, { useState, useEffect } from 'react';
import advancedMonitoringService from '../../services/advancedMonitoringService';

const MonitoringDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [monitoringData, setMonitoringData] = useState(null);
  const [realTimeData, setRealTimeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadMonitoringData();
    const interval = setInterval(loadRealTimeData, 5000); // Update every 5 seconds
    return () => clearInterval(interval);
  }, []);

  const loadMonitoringData = async () => {
    try {
      setLoading(true);
      const data = advancedMonitoringService.exportMonitoringData();
      setMonitoringData(data);
      setError(null);
    } catch (err) {
      setError('Failed to load monitoring data');
      console.error('Error loading monitoring data:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadRealTimeData = async () => {
    try {
      const data = await advancedMonitoringService.getRealTimeMonitoringStatus();
      if (data.success) {
        setRealTimeData(data.realTimeData);
      }
    } catch (err) {
      console.error('Error loading real-time data:', err);
    }
  };

  const handleExportData = () => {
    if (monitoringData) {
      const dataStr = JSON.stringify(monitoringData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `monitoring-data-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return '#10b981';
      case 'excellent': return '#10b981';
      case 'good': return '#3b82f6';
      case 'warning': return '#f59e0b';
      case 'critical': return '#ef4444';
      case 'unhealthy': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getHealthColor = (health) => {
    switch (health) {
      case 'excellent': return '#10b981';
      case 'good': return '#3b82f6';
      case 'needs_attention': return '#f59e0b';
      case 'critical': return '#ef4444';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', color: '#6b7280' }}>Loading monitoring data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', color: '#ef4444' }}>Error: {error}</div>
        <button
          onClick={loadMonitoringData}
          style={{
            marginTop: '10px',
            padding: '8px 16px',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!monitoringData) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', color: '#6b7280' }}>No monitoring data available</div>
      </div>
    );
  }

  const { systemHealth } = monitoringData;

  return (
    <div style={{ padding: '20px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', marginBottom: '10px' }}>
          Advanced Monitoring Dashboard
        </h1>
        <p style={{ fontSize: '16px', color: '#6b7280' }}>
          Comprehensive system monitoring, observability, and real-time alerting
        </p>
        <div style={{ marginTop: '15px' }}>
          <button
            onClick={handleExportData}
            style={{
              padding: '8px 16px',
              backgroundColor: '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            Export Data
          </button>
          <button
            onClick={loadMonitoringData}
            style={{
              padding: '8px 16px',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Refresh
          </button>
        </div>
      </div>

      {/* System Health Status */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>
          System Health Status
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: getStatusColor(systemHealth.overall) }}>
              {systemHealth.overall.toUpperCase()}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Overall Status</div>
          </div>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: getHealthColor('excellent') }}>
              {systemHealth.metrics.uptime}%
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>System Uptime</div>
          </div>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: getHealthColor('excellent') }}>
              {systemHealth.metrics.responseTime}ms
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Response Time</div>
          </div>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: getHealthColor('excellent') }}>
              {systemHealth.metrics.throughput}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Requests/sec</div>
          </div>
        </div>
      </div>

      {/* Real-time Metrics */}
      {realTimeData && (
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>
            Real-time Metrics
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            {Object.entries(realTimeData.systemMetrics || {}).map(([metric, value]) => (
              <div key={metric} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '10px', textTransform: 'capitalize' }}>
                  {metric.replace(/_/g, ' ')}
                </h3>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>
                  {typeof value === 'number' && value < 1 ? (value * 100).toFixed(1) + '%' : value}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '5px' }}>
                  Current Value
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', gap: '10px', borderBottom: '2px solid #e5e7eb' }}>
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'performance', label: 'Performance' },
            { id: 'infrastructure', label: 'Infrastructure' },
            { id: 'userexperience', label: 'User Experience' },
            { id: 'business', label: 'Business Metrics' },
            { id: 'security', label: 'Security' },
            { id: 'alerts', label: 'Alerts' },
            { id: 'logs', label: 'Logs' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 20px',
                backgroundColor: activeTab === tab.id ? '#3b82f6' : 'transparent',
                color: activeTab === tab.id ? 'white' : '#6b7280',
                border: 'none',
                borderRadius: '4px 4px 0 0',
                cursor: 'pointer',
                fontWeight: activeTab === tab.id ? 'bold' : 'normal'
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <div>
          {/* Service Health Overview */}
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>
              Service Health Overview
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {Object.entries(systemHealth.services).map(([serviceName, health]) => (
                <div key={serviceName} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '10px', textTransform: 'capitalize' }}>
                    {serviceName}
                  </h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Status:</span>
                    <span
                      style={{
                        padding: '2px 8px',
                        backgroundColor: getStatusColor(health),
                        color: 'white',
                        borderRadius: '12px',
                        fontSize: '10px',
                        fontWeight: 'bold'
                      }}
                    >
                      {health}
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    Last Updated: {new Date().toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Metrics Summary */}
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>
              Key Metrics Summary
            </h2>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
                    {systemHealth.metrics.uptime}%
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>System Uptime</div>
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>
                    {systemHealth.metrics.responseTime}ms
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>Response Time</div>
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>
                    {systemHealth.metrics.errorRate}%
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>Error Rate</div>
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>
                    {systemHealth.metrics.throughput}
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>Throughput</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === 'performance' && realTimeData && (
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>
            Performance Metrics
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {Object.entries(realTimeData.applicationMetrics || {}).map(([metric, value]) => (
              <div key={metric} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '10px', textTransform: 'capitalize' }}>
                  {metric.replace(/_/g, ' ')}
                </h3>
                {typeof value === 'object' && value !== null ? (
                  <div>
                    {Object.entries(value).map(([key, val]) => (
                      <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '12px', color: '#6b7280', textTransform: 'capitalize' }}>
                          {key.replace(/_/g, ' ')}:
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#1f2937' }}>
                          {typeof val === 'number' && val < 1 ? (val * 100).toFixed(1) + '%' : val}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>
                    {typeof value === 'number' && value < 1 ? (value * 100).toFixed(1) + '%' : value}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* User Experience Tab */}
      {activeTab === 'userexperience' && realTimeData && (
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>
            User Experience Metrics
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            {Object.entries(realTimeData.userMetrics || {}).map(([metric, value]) => (
              <div key={metric} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '10px', textTransform: 'capitalize' }}>
                  {metric.replace(/_/g, ' ')}
                </h3>
                {typeof value === 'object' && value !== null ? (
                  <div>
                    {Object.entries(value).map(([key, val]) => (
                      <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '12px', color: '#6b7280', textTransform: 'capitalize' }}>
                          {key.replace(/_/g, ' ')}:
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#1f2937' }}>
                          {typeof val === 'number' && val < 1 ? (val * 100).toFixed(1) + '%' : val}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>
                    {typeof value === 'number' && value < 1 ? (value * 100).toFixed(1) + '%' : value}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Business Metrics Tab */}
      {activeTab === 'business' && realTimeData && (
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>
            Business Metrics
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            {Object.entries(realTimeData.businessMetrics || {}).map(([metric, value]) => (
              <div key={metric} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '10px', textTransform: 'capitalize' }}>
                  {metric.replace(/_/g, ' ')}
                </h3>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>
                  {typeof value === 'number' && value < 1 ? (value * 100).toFixed(1) + '%' : 
                   typeof value === 'number' && value > 1000 ? '$' + value.toLocaleString() : value}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '5px' }}>
                  Current Value
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && realTimeData && (
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>
            Security Metrics
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {Object.entries(realTimeData.securityMetrics || {}).map(([metric, value]) => (
              <div key={metric} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '10px', textTransform: 'capitalize' }}>
                  {metric.replace(/_/g, ' ')}
                </h3>
                {typeof value === 'object' && value !== null ? (
                  <div>
                    {Object.entries(value).map(([key, val]) => (
                      <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '12px', color: '#6b7280', textTransform: 'capitalize' }}>
                          {key.replace(/_/g, ' ')}:
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#1f2937' }}>
                          {typeof val === 'number' && val < 1 ? (val * 100).toFixed(1) + '%' : val}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>
                    {typeof value === 'number' && value < 1 ? (value * 100).toFixed(1) + '%' : value}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Alerts Tab */}
      {activeTab === 'alerts' && (
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>
            Alert Management
          </h2>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
                  0
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>Active Alerts</div>
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>
                  15
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>Alert History</div>
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>
                  0
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>Performance Alerts</div>
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>
                  0
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>Security Alerts</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Logs Tab */}
      {activeTab === 'logs' && (
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>
            Log Management
          </h2>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
                  1,250
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>Error Logs</div>
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>
                  5,680
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>Access Logs</div>
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>
                  2,340
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>Performance Logs</div>
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>
                  890
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>Security Logs</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonitoringDashboard;
