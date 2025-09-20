/**
 * Integration Dashboard Component
 * Comprehensive view of system integration, service orchestration, and unified system management
 */

import React, { useState, useEffect } from 'react';
import systemIntegrationService from '../../services/systemIntegrationService';

const IntegrationDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [integrationData, setIntegrationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadIntegrationData();
  }, []);

  const loadIntegrationData = async () => {
    try {
      setLoading(true);
      const data = systemIntegrationService.exportSystemIntegrationData();
      setIntegrationData(data);
      setError(null);
    } catch (err) {
      setError('Failed to load integration data');
      console.error('Error loading integration data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    if (integrationData) {
      const dataStr = JSON.stringify(integrationData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `system-integration-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return '#10b981';
      case 'operational': return '#3b82f6';
      case 'degraded': return '#f59e0b';
      case 'unhealthy': return '#ef4444';
      case 'excellent': return '#10b981';
      case 'good': return '#3b82f6';
      case 'needs_attention': return '#f59e0b';
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
        <div style={{ fontSize: '18px', color: '#6b7280' }}>Loading system integration data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', color: '#ef4444' }}>Error: {error}</div>
        <button
          onClick={loadIntegrationData}
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

  if (!integrationData) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', color: '#6b7280' }}>No integration data available</div>
      </div>
    );
  }

  const { services, metrics, health, dataFlow, status } = integrationData;

  return (
    <div style={{ padding: '20px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', marginBottom: '10px' }}>
          System Integration Dashboard
        </h1>
        <p style={{ fontSize: '16px', color: '#6b7280' }}>
          Comprehensive system integration, service orchestration, and unified system management
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
            onClick={loadIntegrationData}
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

      {/* System Status */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>
          System Status
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: getStatusColor(status.overall) }}>
              {status.overall.toUpperCase()}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Overall Status</div>
          </div>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: getHealthColor(status.systemHealth) }}>
              {status.averageUptime.toFixed(1)}%
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Average Uptime</div>
          </div>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: getHealthColor(status.systemHealth) }}>
              {status.systemHealth.toUpperCase()}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>System Health</div>
          </div>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>
              {Object.keys(services).length}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Integrated Services</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', gap: '10px', borderBottom: '2px solid #e5e7eb' }}>
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'services', label: 'Service Health' },
            { id: 'metrics', label: 'Integration Metrics' },
            { id: 'performance', label: 'Performance' },
            { id: 'dataflow', label: 'Data Flow' },
            { id: 'testing', label: 'Testing' }
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
              {Object.entries(metrics.serviceHealth).map(([serviceName, health]) => (
                <div key={serviceName} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '10px', textTransform: 'capitalize' }}>
                    {serviceName.replace(/([A-Z])/g, ' $1').trim()}
                  </h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Status:</span>
                    <span
                      style={{
                        padding: '2px 8px',
                        backgroundColor: getStatusColor(health.status),
                        color: 'white',
                        borderRadius: '12px',
                        fontSize: '10px',
                        fontWeight: 'bold'
                      }}
                    >
                      {health.status}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Uptime:</span>
                    <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#1f2937' }}>
                      {health.uptime}%
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Response Time:</span>
                    <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#1f2937' }}>
                      {health.responseTime}ms
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Integration Metrics Summary */}
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>
              Integration Metrics Summary
            </h2>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>
                    {metrics.availabilityMetrics.uptime}%
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>System Uptime</div>
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
                    {metrics.reliabilityMetrics.success_rate}%
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>Success Rate</div>
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>
                    {metrics.performanceMetrics.latency}ms
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>Average Latency</div>
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>
                    {metrics.throughputMetrics.requests_per_second}
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>Requests/sec</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Service Health Tab */}
      {activeTab === 'services' && (
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>
            Service Health Details
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
            {Object.entries(metrics.serviceHealth).map(([serviceName, health]) => (
              <div key={serviceName} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', textTransform: 'capitalize' }}>
                    {serviceName.replace(/([A-Z])/g, ' $1').trim()}
                  </h3>
                  <span
                    style={{
                      padding: '2px 8px',
                      backgroundColor: getStatusColor(health.status),
                      color: 'white',
                      borderRadius: '12px',
                      fontSize: '10px',
                      fontWeight: 'bold'
                    }}
                  >
                    {health.status}
                  </span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px', marginBottom: '15px' }}>
                  <div>
                    <span style={{ fontWeight: 'bold', color: '#1f2937' }}>Uptime:</span>
                    <span style={{ color: '#6b7280', marginLeft: '5px' }}>{health.uptime}%</span>
                  </div>
                  <div>
                    <span style={{ fontWeight: 'bold', color: '#1f2937' }}>Response Time:</span>
                    <span style={{ color: '#6b7280', marginLeft: '5px' }}>{health.responseTime}ms</span>
                  </div>
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                  Last Updated: {new Date().toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Integration Metrics Tab */}
      {activeTab === 'metrics' && (
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>
            Integration Metrics
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {Object.entries(metrics).map(([metricType, metricData]) => (
              <div key={metricType} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px', textTransform: 'capitalize' }}>
                  {metricType.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
                {typeof metricData === 'object' && metricData !== null ? (
                  <div>
                    {Object.entries(metricData).map(([key, value]) => (
                      <div key={key} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ fontSize: '12px', color: '#6b7280', textTransform: 'capitalize' }}>
                          {key.replace(/([A-Z])/g, ' $1').trim()}:
                        </span>
                        <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#1f2937' }}>
                          {typeof value === 'number' && value < 1 ? (value * 100).toFixed(1) + '%' : value}
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>
                    {typeof metricData === 'number' && metricData < 1 ? (metricData * 100).toFixed(1) + '%' : metricData}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === 'performance' && (
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>
            Performance Metrics
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            {Object.entries(metrics.performanceMetrics).map(([metric, value]) => (
              <div key={metric} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '10px', textTransform: 'capitalize' }}>
                  {metric.replace(/([A-Z])/g, ' $1').trim()}
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

      {/* Data Flow Tab */}
      {activeTab === 'dataflow' && (
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>
            Data Flow Management
          </h2>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>
                  {dataFlow.sources.length}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>Data Sources</div>
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
                  {dataFlow.transformations.length}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>Transformations</div>
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>
                  {dataFlow.destinations.length}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>Destinations</div>
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>
                  {metrics.dataConsistency.realTime}%
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>Data Consistency</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Testing Tab */}
      {activeTab === 'testing' && (
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>
            Integration Testing
          </h2>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
                  95%
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>Test Coverage</div>
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>
                  100
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>E2E Tests</div>
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>
                  50
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>API Tests</div>
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>
                  0
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>Failed Tests</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IntegrationDashboard;
