/**
 * Infrastructure Dashboard Component
 * Production infrastructure management, auto-scaling, and deployment automation
 */

import React, { useState, useEffect } from 'react';
import productionInfrastructureService from '../../services/productionInfrastructureService';

const InfrastructureDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [infrastructureData, setInfrastructureData] = useState(null);
  const [deploymentData, setDeploymentData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadInfrastructureData();
  }, []);

  const loadInfrastructureData = async () => {
    try {
      setLoading(true);
      const infraData = productionInfrastructureService.exportInfrastructureData();
      setInfrastructureData(infraData);
      
      const deployData = await productionInfrastructureService.getDeploymentStatus();
      setDeploymentData(deployData);
      
      setError(null);
    } catch (err) {
      setError('Failed to load infrastructure data');
      console.error('Error loading infrastructure data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    if (infrastructureData) {
      const dataStr = JSON.stringify(infrastructureData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `infrastructure-data-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return '#10b981';
      case 'active': return '#10b981';
      case 'enabled': return '#10b981';
      case 'completed': return '#10b981';
      case 'valid': return '#10b981';
      case 'compliant': return '#10b981';
      case 'verified': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'critical': return '#ef4444';
      case 'unhealthy': return '#ef4444';
      case 'failed': return '#ef4444';
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
        <div style={{ fontSize: '18px', color: '#6b7280' }}>Loading infrastructure data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', color: '#ef4444' }}>Error: {error}</div>
        <button
          onClick={loadInfrastructureData}
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

  if (!infrastructureData) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', color: '#6b7280' }}>No infrastructure data available</div>
      </div>
    );
  }

  const { systemHealth } = infrastructureData;

  return (
    <div style={{ padding: '20px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', marginBottom: '10px' }}>
          Production Infrastructure Dashboard
        </h1>
        <p style={{ fontSize: '16px', color: '#6b7280' }}>
          Production infrastructure management, auto-scaling, and deployment automation
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
            onClick={loadInfrastructureData}
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
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Throughput</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', gap: '10px', borderBottom: '2px solid #e5e7eb' }}>
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'servers', label: 'Servers' },
            { id: 'databases', label: 'Databases' },
            { id: 'caches', label: 'Caches' },
            { id: 'cdn', label: 'CDN' },
            { id: 'loadbalancers', label: 'Load Balancers' },
            { id: 'autoscaling', label: 'Auto Scaling' },
            { id: 'security', label: 'Security' },
            { id: 'backups', label: 'Backups' },
            { id: 'deployment', label: 'Deployment' }
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
          {/* Infrastructure Health Overview */}
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>
              Infrastructure Health Overview
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {Object.entries(systemHealth.infrastructure).map(([serviceName, health]) => (
                <div key={serviceName} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '10px', textTransform: 'capitalize' }}>
                    {serviceName.replace(/([A-Z])/g, ' $1').trim()}
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
              Key Infrastructure Metrics
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

      {/* Servers Tab */}
      {activeTab === 'servers' && (
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>
            Server Infrastructure
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>Server Overview</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px' }}>
                <div>
                  <span style={{ fontWeight: 'bold', color: '#1f2937' }}>Total Servers:</span>
                  <span style={{ color: '#6b7280', marginLeft: '5px' }}>8</span>
                </div>
                <div>
                  <span style={{ fontWeight: 'bold', color: '#1f2937' }}>Active Servers:</span>
                  <span style={{ color: '#6b7280', marginLeft: '5px' }}>8</span>
                </div>
                <div>
                  <span style={{ fontWeight: 'bold', color: '#1f2937' }}>CPU Utilization:</span>
                  <span style={{ color: '#6b7280', marginLeft: '5px' }}>65.2%</span>
                </div>
                <div>
                  <span style={{ fontWeight: 'bold', color: '#1f2937' }}>Memory Utilization:</span>
                  <span style={{ color: '#6b7280', marginLeft: '5px' }}>72.8%</span>
                </div>
              </div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>Server Health</h3>
              <div style={{ fontSize: '12px' }}>
                {['web-server-1', 'web-server-2', 'api-server-1', 'api-server-2'].map(server => (
                  <div key={server} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ color: '#6b7280' }}>{server}:</span>
                    <span
                      style={{
                        padding: '2px 6px',
                        backgroundColor: getStatusColor('healthy'),
                        color: 'white',
                        borderRadius: '8px',
                        fontSize: '10px',
                        fontWeight: 'bold'
                      }}
                    >
                      healthy
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Databases Tab */}
      {activeTab === 'databases' && (
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>
            Database Infrastructure
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>Database Overview</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px' }}>
                <div>
                  <span style={{ fontWeight: 'bold', color: '#1f2937' }}>Total Databases:</span>
                  <span style={{ color: '#6b7280', marginLeft: '5px' }}>3</span>
                </div>
                <div>
                  <span style={{ fontWeight: 'bold', color: '#1f2937' }}>Active Databases:</span>
                  <span style={{ color: '#6b7280', marginLeft: '5px' }}>3</span>
                </div>
                <div>
                  <span style={{ fontWeight: 'bold', color: '#1f2937' }}>Query Time:</span>
                  <span style={{ color: '#6b7280', marginLeft: '5px' }}>45ms</span>
                </div>
                <div>
                  <span style={{ fontWeight: 'bold', color: '#1f2937' }}>Cache Hit Rate:</span>
                  <span style={{ color: '#6b7280', marginLeft: '5px' }}>92.5%</span>
                </div>
              </div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>Database Health</h3>
              <div style={{ fontSize: '12px' }}>
                {['primary-db', 'replica-db-1', 'replica-db-2'].map(db => (
                  <div key={db} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ color: '#6b7280' }}>{db}:</span>
                    <span
                      style={{
                        padding: '2px 6px',
                        backgroundColor: getStatusColor('healthy'),
                        color: 'white',
                        borderRadius: '8px',
                        fontSize: '10px',
                        fontWeight: 'bold'
                      }}
                    >
                      healthy
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Auto Scaling Tab */}
      {activeTab === 'autoscaling' && (
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>
            Auto Scaling Configuration
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>Scaling Status</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px' }}>
                <div>
                  <span style={{ fontWeight: 'bold', color: '#1f2937' }}>Enabled:</span>
                  <span style={{ color: '#6b7280', marginLeft: '5px' }}>Yes</span>
                </div>
                <div>
                  <span style={{ fontWeight: 'bold', color: '#1f2937' }}>Current Instances:</span>
                  <span style={{ color: '#6b7280', marginLeft: '5px' }}>6</span>
                </div>
                <div>
                  <span style={{ fontWeight: 'bold', color: '#1f2937' }}>CPU Utilization:</span>
                  <span style={{ color: '#6b7280', marginLeft: '5px' }}>65.2%</span>
                </div>
                <div>
                  <span style={{ fontWeight: 'bold', color: '#1f2937' }}>Memory Utilization:</span>
                  <span style={{ color: '#6b7280', marginLeft: '5px' }}>72.8%</span>
                </div>
              </div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>Scaling Policies</h3>
              <div style={{ fontSize: '12px' }}>
                {['web-tier', 'api-tier', 'database-tier'].map(tier => (
                  <div key={tier} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ color: '#6b7280' }}>{tier}:</span>
                    <span style={{ color: '#1f2937', fontWeight: 'bold' }}>2-10 instances</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>
            Security Infrastructure
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>Security Status</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px' }}>
                <div>
                  <span style={{ fontWeight: 'bold', color: '#1f2937' }}>SSL Certificates:</span>
                  <span style={{ color: '#6b7280', marginLeft: '5px' }}>Valid</span>
                </div>
                <div>
                  <span style={{ fontWeight: 'bold', color: '#1f2937' }}>Firewall Rules:</span>
                  <span style={{ color: '#6b7280', marginLeft: '5px' }}>25 Active</span>
                </div>
                <div>
                  <span style={{ fontWeight: 'bold', color: '#1f2937' }}>Encryption:</span>
                  <span style={{ color: '#6b7280', marginLeft: '5px' }}>Enabled</span>
                </div>
                <div>
                  <span style={{ fontWeight: 'bold', color: '#1f2937' }}>Compliance:</span>
                  <span style={{ color: '#6b7280', marginLeft: '5px' }}>Compliant</span>
                </div>
              </div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>Vulnerability Status</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px' }}>
                <div>
                  <span style={{ fontWeight: 'bold', color: '#1f2937' }}>Critical:</span>
                  <span style={{ color: '#6b7280', marginLeft: '5px' }}>0</span>
                </div>
                <div>
                  <span style={{ fontWeight: 'bold', color: '#1f2937' }}>High:</span>
                  <span style={{ color: '#6b7280', marginLeft: '5px' }}>1</span>
                </div>
                <div>
                  <span style={{ fontWeight: 'bold', color: '#1f2937' }}>Medium:</span>
                  <span style={{ color: '#6b7280', marginLeft: '5px' }}>3</span>
                </div>
                <div>
                  <span style={{ fontWeight: 'bold', color: '#1f2937' }}>Low:</span>
                  <span style={{ color: '#6b7280', marginLeft: '5px' }}>7</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Deployment Tab */}
      {activeTab === 'deployment' && deploymentData && (
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>
            Deployment Status
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>Deployment Metrics</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px' }}>
                <div>
                  <span style={{ fontWeight: 'bold', color: '#1f2937' }}>Total Deployments:</span>
                  <span style={{ color: '#6b7280', marginLeft: '5px' }}>45</span>
                </div>
                <div>
                  <span style={{ fontWeight: 'bold', color: '#1f2937' }}>Success Rate:</span>
                  <span style={{ color: '#6b7280', marginLeft: '5px' }}>95.6%</span>
                </div>
                <div>
                  <span style={{ fontWeight: 'bold', color: '#1f2937' }}>Deployment Duration:</span>
                  <span style={{ color: '#6b7280', marginLeft: '5px' }}>8.5min</span>
                </div>
                <div>
                  <span style={{ fontWeight: 'bold', color: '#1f2937' }}>Rollbacks:</span>
                  <span style={{ color: '#6b7280', marginLeft: '5px' }}>1</span>
                </div>
              </div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>Environment Status</h3>
              <div style={{ fontSize: '12px' }}>
                {Object.entries(deploymentData.deploymentData?.environments || {}).map(([env, status]) => (
                  <div key={env} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ color: '#6b7280', textTransform: 'capitalize' }}>{env}:</span>
                    <span
                      style={{
                        padding: '2px 6px',
                        backgroundColor: getStatusColor(status.health),
                        color: 'white',
                        borderRadius: '8px',
                        fontSize: '10px',
                        fontWeight: 'bold'
                      }}
                    >
                      {status.health}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InfrastructureDashboard;
