/**
 * Business Intelligence Dashboard Component
 * Comprehensive view of business analytics, forecasting, and strategic insights
 */

import React, { useState, useEffect } from 'react';
import predictiveAnalyticsService from '../../services/predictiveAnalyticsService';

const BusinessIntelligenceDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = async () => {
    try {
      setLoading(true);
      const data = predictiveAnalyticsService.exportPredictiveAnalyticsData();
      setAnalyticsData(data);
      setError(null);
    } catch (err) {
      setError('Failed to load analytics data');
      console.error('Error loading analytics data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    if (analyticsData) {
      const dataStr = JSON.stringify(analyticsData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `business-intelligence-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'trained': return '#10b981';
      case 'training': return '#f59e0b';
      case 'error': return '#ef4444';
      case 'operational': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getAccuracyColor = (accuracy) => {
    if (accuracy >= 0.9) return '#10b981';
    if (accuracy >= 0.8) return '#3b82f6';
    if (accuracy >= 0.7) return '#f59e0b';
    return '#ef4444';
  };

  const getHealthColor = (health) => {
    switch (health) {
      case 'excellent': return '#10b981';
      case 'good': return '#3b82f6';
      case 'needs_improvement': return '#f59e0b';
      case 'critical': return '#ef4444';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', color: '#6b7280' }}>Loading business intelligence data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', color: '#ef4444' }}>Error: {error}</div>
        <button
          onClick={loadAnalyticsData}
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

  if (!analyticsData) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', color: '#6b7280' }}>No analytics data available</div>
      </div>
    );
  }

  const { models, metrics, capabilities, status } = analyticsData;

  return (
    <div style={{ padding: '20px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', marginBottom: '10px' }}>
          Business Intelligence Dashboard
        </h1>
        <p style={{ fontSize: '16px', color: '#6b7280' }}>
          Advanced analytics, forecasting, and strategic business insights
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
            onClick={loadAnalyticsData}
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
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: getAccuracyColor(status.averageAccuracy) }}>
              {(status.averageAccuracy * 100).toFixed(1)}%
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Average Accuracy</div>
          </div>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: getHealthColor(status.systemHealth) }}>
              {status.systemHealth.toUpperCase()}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>System Health</div>
          </div>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>
              {Object.keys(models).length}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Active Models</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', gap: '10px', borderBottom: '2px solid #e5e7eb' }}>
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'forecasting', label: 'Forecasting' },
            { id: 'models', label: 'Prediction Models' },
            { id: 'metrics', label: 'Analytics Metrics' },
            { id: 'capabilities', label: 'Capabilities' },
            { id: 'insights', label: 'Business Insights' }
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
          {/* Forecasting Capabilities Overview */}
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>
              Forecasting Capabilities
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {Object.entries(capabilities).map(([capability, data]) => (
                <div key={capability} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '10px', textTransform: 'capitalize' }}>
                    {capability.replace(/([A-Z])/g, ' $1').trim()}
                  </h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Status:</span>
                    <span
                      style={{
                        padding: '2px 8px',
                        backgroundColor: data.enabled ? '#10b981' : '#ef4444',
                        color: 'white',
                        borderRadius: '12px',
                        fontSize: '10px',
                        fontWeight: 'bold'
                      }}
                    >
                      {data.enabled ? 'Enabled' : 'Disabled'}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Accuracy:</span>
                    <span style={{ fontSize: '14px', fontWeight: 'bold', color: getAccuracyColor(data.accuracy) }}>
                      {(data.accuracy * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Horizon:</span>
                    <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#1f2937' }}>
                      {data.horizon}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>Granularity:</span>
                    <span style={{ fontSize: '14px', fontWeight: 'bold', color: '#1f2937' }}>
                      {data.granularity}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Analytics Metrics Summary */}
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>
              Analytics Metrics Summary
            </h2>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>
                    {(metrics.modelPerformance.averageAccuracy * 100).toFixed(1)}%
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>Average Model Accuracy</div>
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
                    {(metrics.dataQuality.completeness * 100).toFixed(1)}%
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>Data Quality</div>
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>
                    {(metrics.forecastReliability.shortTerm * 100).toFixed(1)}%
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>Forecast Reliability</div>
                </div>
                <div>
                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>
                    {(metrics.businessImpact.decisionAccuracy * 100).toFixed(1)}%
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>Decision Accuracy</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Forecasting Tab */}
      {activeTab === 'forecasting' && (
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>
            Forecasting Models
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
            {Object.entries(models).filter(([key, model]) => 
              ['revenue', 'userChurn', 'marketTrends', 'competitivePosition'].includes(key)
            ).map(([modelName, model]) => (
              <div key={modelName} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937' }}>
                    {model.name}
                  </h3>
                  <span
                    style={{
                      padding: '2px 8px',
                      backgroundColor: getStatusColor(model.status),
                      color: 'white',
                      borderRadius: '12px',
                      fontSize: '10px',
                      fontWeight: 'bold'
                    }}
                  >
                    {model.status}
                  </span>
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '15px' }}>
                  Type: {model.type}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px', marginBottom: '15px' }}>
                  <div>
                    <span style={{ fontWeight: 'bold', color: '#1f2937' }}>Accuracy:</span>
                    <span style={{ color: getAccuracyColor(model.accuracy), marginLeft: '5px' }}>
                      {(model.accuracy * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div>
                    <span style={{ fontWeight: 'bold', color: '#1f2937' }}>Last Trained:</span>
                    <span style={{ color: '#6b7280', marginLeft: '5px' }}>
                      {new Date(model.lastTrained).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {model.features && (
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#1f2937', marginBottom: '5px' }}>Key Features:</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      {model.features.slice(0, 3).join(', ')}
                      {model.features.length > 3 && ` +${model.features.length - 3} more`}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prediction Models Tab */}
      {activeTab === 'models' && (
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>
            All Prediction Models
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
            {Object.entries(models).map(([modelName, model]) => (
              <div key={modelName} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937' }}>
                    {model.name}
                  </h3>
                  <span
                    style={{
                      padding: '2px 8px',
                      backgroundColor: getStatusColor(model.status),
                      color: 'white',
                      borderRadius: '12px',
                      fontSize: '10px',
                      fontWeight: 'bold'
                    }}
                  >
                    {model.status}
                  </span>
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '15px' }}>
                  Type: {model.type}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px', marginBottom: '15px' }}>
                  <div>
                    <span style={{ fontWeight: 'bold', color: '#1f2937' }}>Accuracy:</span>
                    <span style={{ color: getAccuracyColor(model.accuracy), marginLeft: '5px' }}>
                      {(model.accuracy * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div>
                    <span style={{ fontWeight: 'bold', color: '#1f2937' }}>Last Trained:</span>
                    <span style={{ color: '#6b7280', marginLeft: '5px' }}>
                      {new Date(model.lastTrained).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                {model.features && (
                  <div>
                    <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#1f2937', marginBottom: '5px' }}>Features:</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      {model.features.slice(0, 3).join(', ')}
                      {model.features.length > 3 && ` +${model.features.length - 3} more`}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Analytics Metrics Tab */}
      {activeTab === 'metrics' && (
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>
            Analytics Metrics
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

      {/* Capabilities Tab */}
      {activeTab === 'capabilities' && (
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>
            Forecasting Capabilities
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
            {Object.entries(capabilities).map(([capability, data]) => (
              <div key={capability} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px', textTransform: 'capitalize' }}>
                  {capability.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px', marginBottom: '15px' }}>
                  <div>
                    <span style={{ fontWeight: 'bold', color: '#1f2937' }}>Enabled:</span>
                    <span style={{ color: data.enabled ? '#10b981' : '#ef4444', marginLeft: '5px' }}>
                      {data.enabled ? 'Yes' : 'No'}
                    </span>
                  </div>
                  <div>
                    <span style={{ fontWeight: 'bold', color: '#1f2937' }}>Accuracy:</span>
                    <span style={{ color: getAccuracyColor(data.accuracy), marginLeft: '5px' }}>
                      {(data.accuracy * 100).toFixed(1)}%
                    </span>
                  </div>
                  <div>
                    <span style={{ fontWeight: 'bold', color: '#1f2937' }}>Horizon:</span>
                    <span style={{ color: '#6b7280', marginLeft: '5px' }}>{data.horizon}</span>
                  </div>
                  <div>
                    <span style={{ fontWeight: 'bold', color: '#1f2937' }}>Granularity:</span>
                    <span style={{ color: '#6b7280', marginLeft: '5px' }}>{data.granularity}</span>
                  </div>
                </div>
                {data.lastUpdated && (
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    Last Updated: {new Date(data.lastUpdated).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Business Insights Tab */}
      {activeTab === 'insights' && (
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>
            Business Insights
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>
                Prediction Accuracy
              </h3>
              {Object.entries(metrics.predictionAccuracy).map(([predictionType, accuracy]) => (
                <div key={predictionType} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#6b7280', textTransform: 'capitalize' }}>
                    {predictionType.replace(/([A-Z])/g, ' $1').trim()}:
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: getAccuracyColor(accuracy) }}>
                    {(accuracy * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
            
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>
                Business Impact
              </h3>
              {Object.entries(metrics.businessImpact).map(([impactType, value]) => (
                <div key={impactType} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#6b7280', textTransform: 'capitalize' }}>
                    {impactType.replace(/([A-Z])/g, ' $1').trim()}:
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#1f2937' }}>
                    {(value * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
            
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>
                Risk Metrics
              </h3>
              {Object.entries(metrics.riskMetrics).map(([riskType, value]) => (
                <div key={riskType} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#6b7280', textTransform: 'capitalize' }}>
                    {riskType.replace(/([A-Z])/g, ' $1').trim()}:
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#1f2937' }}>
                    {(value * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
            
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>
                Growth Metrics
              </h3>
              {Object.entries(metrics.growthMetrics).map(([growthType, value]) => (
                <div key={growthType} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontSize: '12px', color: '#6b7280', textTransform: 'capitalize' }}>
                    {growthType.replace(/([A-Z])/g, ' $1').trim()}:
                  </span>
                  <span style={{ fontSize: '12px', fontWeight: 'bold', color: '#1f2937' }}>
                    {(value * 100).toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessIntelligenceDashboard;
