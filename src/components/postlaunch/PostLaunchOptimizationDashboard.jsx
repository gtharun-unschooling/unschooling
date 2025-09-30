/**
 * Post-Launch Optimization Dashboard Component
 * Post-launch monitoring, optimization, and continuous improvement
 */

import React, { useState, useEffect } from 'react';
import postLaunchOptimizationService from '../../services/postLaunchOptimizationService';

const PostLaunchOptimizationDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [optimizationData, setOptimizationData] = useState(null);
  const [optimizationStatus, setOptimizationStatus] = useState(null);
  const [monitoringData, setMonitoringData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadOptimizationData();
  }, []);

  const loadOptimizationData = async () => {
    try {
      setLoading(true);
      const data = postLaunchOptimizationService.exportOptimizationData();
      setOptimizationData(data);
      
      const status = await postLaunchOptimizationService.getPostLaunchOptimizationStatus();
      setOptimizationStatus(status);
      
      const monitoring = await postLaunchOptimizationService.monitorPostLaunchPerformance();
      setMonitoringData(monitoring);
      
      setError(null);
    } catch (err) {
      setError('Failed to load optimization data');
      console.error('Error loading optimization data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    if (optimizationData) {
      const dataStr = JSON.stringify(optimizationData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `post-launch-optimization-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'optimized': return '#10b981';
      case 'active': return '#3b82f6';
      case 'good': return '#3b82f6';
      case 'completed': return '#10b981';
      case 'implemented': return '#10b981';
      case 'in_progress': return '#f59e0b';
      case 'planned': return '#6b7280';
      case 'needs-improvement': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return '#10b981';
    if (score >= 80) return '#3b82f6';
    if (score >= 70) return '#f59e0b';
    return '#ef4444';
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', color: '#6b7280' }}>Loading optimization data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', color: '#ef4444' }}>Error: {error}</div>
        <button
          onClick={loadOptimizationData}
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

  if (!optimizationData) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', color: '#6b7280' }}>No optimization data available</div>
      </div>
    );
  }

  const { systemHealth } = optimizationData;

  return (
    <div style={{ padding: '20px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', marginBottom: '10px' }}>
          Post-Launch Optimization Dashboard
        </h1>
        <p style={{ fontSize: '16px', color: '#6b7280' }}>
          Post-launch monitoring, optimization, and continuous improvement
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
            onClick={loadOptimizationData}
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

      {/* Optimization Status */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>
          Optimization Status
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: getStatusColor(systemHealth.optimization.performance) }}>
              {systemHealth.optimization.performance.toUpperCase()}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Performance</div>
          </div>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: getStatusColor(systemHealth.optimization.support) }}>
              {systemHealth.optimization.support.toUpperCase()}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Support</div>
          </div>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: getStatusColor(systemHealth.optimization.continuousImprovement) }}>
              {systemHealth.optimization.continuousImprovement.toUpperCase()}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Continuous Improvement</div>
          </div>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: getStatusColor(systemHealth.optimization.monitoring) }}>
              {systemHealth.optimization.monitoring.toUpperCase()}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Monitoring</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', gap: '10px', borderBottom: '2px solid #e5e7eb' }}>
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'performance', label: 'Performance' },
            { id: 'support', label: 'Support' },
            { id: 'continuous', label: 'Continuous Improvement' },
            { id: 'monitoring', label: 'Monitoring' },
            { id: 'optimization', label: 'Optimization' },
            { id: 'metrics', label: 'Metrics' },
            { id: 'recommendations', label: 'Recommendations' }
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
          {/* Optimization Overview */}
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>
              Optimization Overview
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {Object.entries(systemHealth.optimization).map(([optimizationType, status]) => (
                <div key={optimizationType} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '10px', textTransform: 'capitalize' }}>
                    {optimizationType.replace(/([A-Z])/g, ' $1').trim()}
                  </h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Status:</span>
                    <span
                      style={{
                        padding: '2px 8px',
                        backgroundColor: getStatusColor(status),
                        color: 'white',
                        borderRadius: '12px',
                        fontSize: '10px',
                        fontWeight: 'bold'
                      }}
                    >
                      {status}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Score:</span>
                    <span style={{ fontSize: '18px', fontWeight: 'bold', color: getScoreColor(systemHealth.metrics[optimizationType]) }}>
                      {systemHealth.metrics[optimizationType]}%
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Key Metrics Summary */}
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>
              Key Optimization Metrics
            </h2>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
                    {systemHealth.metrics.performance}%
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>Performance Score</div>
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>
                    {systemHealth.metrics.support}%
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>Support Score</div>
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>
                    {systemHealth.metrics.continuousImprovement}%
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>Continuous Improvement</div>
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>
                    {systemHealth.metrics.monitoring}%
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>Monitoring Score</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Performance Tab */}
      {activeTab === 'performance' && optimizationStatus && (
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>
            Performance Optimization
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>Performance Metrics</h3>
              <div style={{ fontSize: '12px' }}>
                {Object.entries(optimizationStatus.optimizationData?.performance?.metrics || {}).map(([metric, value]) => (
                  <div key={metric} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ color: '#6b7280', textTransform: 'capitalize' }}>
                      {metric.replace(/([A-Z])/g, ' $1').trim()}:
                    </span>
                    <span style={{ color: '#1f2937', fontWeight: 'bold' }}>
                      {typeof value === 'number' && value < 1 ? (value * 100).toFixed(1) + '%' : value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>Optimizations</h3>
              <div style={{ fontSize: '12px' }}>
                {(optimizationStatus.optimizationData?.performance?.optimizations || []).map((opt, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ color: '#6b7280', textTransform: 'capitalize' }}>
                      {opt.type.replace(/_/g, ' ')}:
                    </span>
                    <span
                      style={{
                        padding: '1px 6px',
                        backgroundColor: opt.impact === 'high' ? '#10b981' : opt.impact === 'medium' ? '#f59e0b' : '#6b7280',
                        color: 'white',
                        borderRadius: '8px',
                        fontSize: '9px',
                        fontWeight: 'bold'
                      }}
                    >
                      {opt.impact}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Support Tab */}
      {activeTab === 'support' && optimizationStatus && (
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>
            Support Optimization
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>Support Metrics</h3>
              <div style={{ fontSize: '12px' }}>
                {Object.entries(optimizationStatus.optimizationData?.support?.metrics || {}).map(([metric, value]) => (
                  <div key={metric} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ color: '#6b7280', textTransform: 'capitalize' }}>
                      {metric.replace(/([A-Z])/g, ' $1').trim()}:
                    </span>
                    <span style={{ color: '#1f2937', fontWeight: 'bold' }}>
                      {typeof value === 'number' && value < 1 ? (value * 100).toFixed(1) + '%' : 
                       typeof value === 'number' && value > 1000 ? '$' + value.toLocaleString() : value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>Support Optimizations</h3>
              <div style={{ fontSize: '12px' }}>
                {(optimizationStatus.optimizationData?.support?.optimizations || []).map((opt, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ color: '#6b7280', textTransform: 'capitalize' }}>
                      {opt.type.replace(/_/g, ' ')}:
                    </span>
                    <span
                      style={{
                        padding: '1px 6px',
                        backgroundColor: opt.impact === 'high' ? '#10b981' : opt.impact === 'medium' ? '#f59e0b' : '#6b7280',
                        color: 'white',
                        borderRadius: '8px',
                        fontSize: '9px',
                        fontWeight: 'bold'
                      }}
                    >
                      {opt.impact}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Continuous Improvement Tab */}
      {activeTab === 'continuous' && optimizationStatus && (
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>
            Continuous Improvement
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>Improvement Metrics</h3>
              <div style={{ fontSize: '12px' }}>
                {Object.entries(optimizationStatus.optimizationData?.continuousImprovement?.metrics || {}).map(([metric, value]) => (
                  <div key={metric} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ color: '#6b7280', textTransform: 'capitalize' }}>
                      {metric.replace(/([A-Z])/g, ' $1').trim()}:
                    </span>
                    <span style={{ color: '#1f2937', fontWeight: 'bold' }}>
                      {typeof value === 'number' && value < 1 ? (value * 100).toFixed(1) + '%' : 
                       typeof value === 'number' && value > 1000 ? '$' + value.toLocaleString() : value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>Improvement Categories</h3>
              <div style={{ fontSize: '12px' }}>
                {(optimizationStatus.optimizationData?.continuousImprovement?.improvements || []).map((improvement, index) => (
                  <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ color: '#6b7280', textTransform: 'capitalize' }}>
                      {improvement.category.replace(/_/g, ' ')}:
                    </span>
                    <span style={{ color: '#1f2937', fontWeight: 'bold' }}>
                      {improvement.count} ({improvement.impact})
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Monitoring Tab */}
      {activeTab === 'monitoring' && monitoringData && (
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>
            Post-Launch Monitoring
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {Object.entries(monitoringData.monitoringData || {}).map(([monitoringType, data]) => (
              <div key={monitoringType} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px', textTransform: 'capitalize' }}>
                  {monitoringType.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
                <div style={{ fontSize: '12px' }}>
                  {Object.entries(data).map(([metric, value]) => (
                    <div key={metric} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                      <span style={{ color: '#6b7280', textTransform: 'capitalize' }}>
                        {metric.replace(/([A-Z])/g, ' $1').trim()}:
                      </span>
                      <span style={{ color: '#1f2937', fontWeight: 'bold' }}>
                        {typeof value === 'object' ? JSON.stringify(value).slice(0, 20) + '...' :
                         typeof value === 'number' && value < 1 ? (value * 100).toFixed(1) + '%' : 
                         typeof value === 'number' && value > 1000 ? '$' + value.toLocaleString() : value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PostLaunchOptimizationDashboard;
