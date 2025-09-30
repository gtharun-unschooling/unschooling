/**
 * Launch Dashboard Component
 * Launch preparation, go-live execution, and production launch management
 */

import React, { useState, useEffect } from 'react';
import launchReadinessService from '../../services/launchReadinessService';

const LaunchDashboard = () => {
  const [activeTab, setActiveTab] = useState('readiness');
  const [launchData, setLaunchData] = useState(null);
  const [readinessData, setReadinessData] = useState(null);
  const [goLiveData, setGoLiveData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadLaunchData();
  }, []);

  const loadLaunchData = async () => {
    try {
      setLoading(true);
      const data = launchReadinessService.exportLaunchData();
      setLaunchData(data);
      
      const readiness = await launchReadinessService.getLaunchReadinessStatus();
      setReadinessData(readiness);
      
      const goLive = await launchReadinessService.executeGoLiveLaunch();
      setGoLiveData(goLive);
      
      setError(null);
    } catch (err) {
      setError('Failed to load launch data');
      console.error('Error loading launch data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    if (launchData) {
      const dataStr = JSON.stringify(launchData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `launch-data-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'ready': return '#10b981';
      case 'completed': return '#10b981';
      case 'active': return '#3b82f6';
      case 'in-progress': return '#f59e0b';
      case 'pending': return '#6b7280';
      case 'failed': return '#ef4444';
      case 'critical': return '#ef4444';
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
        <div style={{ fontSize: '18px', color: '#6b7280' }}>Loading launch data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', color: '#ef4444' }}>Error: {error}</div>
        <button
          onClick={loadLaunchData}
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

  if (!launchData) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', color: '#6b7280' }}>No launch data available</div>
      </div>
    );
  }

  const { systemHealth } = launchData;

  return (
    <div style={{ padding: '20px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', marginBottom: '10px' }}>
          Launch Readiness Dashboard
        </h1>
        <p style={{ fontSize: '16px', color: '#6b7280' }}>
          Launch preparation, go-live execution, and production launch management
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
            onClick={loadLaunchData}
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

      {/* Launch Status */}
      <div style={{ marginBottom: '30px' }}>
        <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>
          Launch Status
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: getStatusColor(systemHealth.launch.readiness) }}>
              {systemHealth.launch.readiness.toUpperCase()}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Readiness Status</div>
          </div>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: getStatusColor(systemHealth.launch.execution) }}>
              {systemHealth.launch.execution.toUpperCase()}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Execution Status</div>
          </div>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: getStatusColor(systemHealth.launch.monitoring) }}>
              {systemHealth.launch.monitoring.toUpperCase()}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Monitoring Status</div>
          </div>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: getStatusColor(systemHealth.launch.support) }}>
              {systemHealth.launch.support.toUpperCase()}
            </div>
            <div style={{ fontSize: '14px', color: '#6b7280' }}>Support Status</div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', gap: '10px', borderBottom: '2px solid #e5e7eb' }}>
          {[
            { id: 'readiness', label: 'Readiness' },
            { id: 'checklist', label: 'Checklist' },
            { id: 'golive', label: 'Go-Live' },
            { id: 'monitoring', label: 'Monitoring' },
            { id: 'communication', label: 'Communication' },
            { id: 'support', label: 'Support' },
            { id: 'risks', label: 'Risks' },
            { id: 'milestones', label: 'Milestones' }
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

      {/* Readiness Tab */}
      {activeTab === 'readiness' && readinessData && (
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>
            Launch Readiness Assessment
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {Object.entries(readinessData.readinessData || {}).map(([readinessType, data]) => (
              <div key={readinessType} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px', textTransform: 'capitalize' }}>
                  {readinessType.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>Score:</span>
                  <span style={{ fontSize: '24px', fontWeight: 'bold', color: getScoreColor(data.score) }}>
                    {data.score}%
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>Status:</span>
                  <span
                    style={{
                      padding: '2px 8px',
                      backgroundColor: getStatusColor(data.status),
                      color: 'white',
                      borderRadius: '12px',
                      fontSize: '10px',
                      fontWeight: 'bold'
                    }}
                  >
                    {data.status}
                  </span>
                </div>
                {data.components && (
                  <div style={{ fontSize: '12px' }}>
                    {Object.entries(data.components).map(([component, compData]) => (
                      <div key={component} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ color: '#6b7280', textTransform: 'capitalize' }}>
                          {component.replace(/_/g, ' ')}:
                        </span>
                        <span style={{ color: '#1f2937', fontWeight: 'bold' }}>
                          {compData.score}%
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Checklist Tab */}
      {activeTab === 'checklist' && (
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>
            Launch Checklist
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {Object.entries(launchData.launchMetrics.checklist).map(([item, data]) => (
              <div key={item} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px', textTransform: 'capitalize' }}>
                  {item.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>Status:</span>
                  <span
                    style={{
                      padding: '2px 8px',
                      backgroundColor: getStatusColor(data.status),
                      color: 'white',
                      borderRadius: '12px',
                      fontSize: '10px',
                      fontWeight: 'bold'
                    }}
                  >
                    {data.status}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>Score:</span>
                  <span style={{ fontSize: '18px', fontWeight: 'bold', color: getScoreColor(data.score) }}>
                    {data.score}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Go-Live Tab */}
      {activeTab === 'golive' && goLiveData && (
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>
            Go-Live Execution
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {Object.entries(goLiveData.launchData || {}).map(([phase, data]) => (
              <div key={phase} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px', textTransform: 'capitalize' }}>
                  {phase.replace(/([A-Z])/g, ' $1').trim()}
                </h3>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
                  <span style={{ fontSize: '14px', color: '#6b7280' }}>Status:</span>
                  <span
                    style={{
                      padding: '2px 8px',
                      backgroundColor: getStatusColor(data.status),
                      color: 'white',
                      borderRadius: '12px',
                      fontSize: '10px',
                      fontWeight: 'bold'
                    }}
                  >
                    {data.status}
                  </span>
                </div>
                {data.validations && (
                  <div style={{ fontSize: '12px' }}>
                    {Object.entries(data.validations).map(([validation, result]) => (
                      <div key={validation} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ color: '#6b7280', textTransform: 'capitalize' }}>
                          {validation.replace(/_/g, ' ')}:
                        </span>
                        <span
                          style={{
                            padding: '1px 6px',
                            backgroundColor: result === 'passed' ? '#10b981' : '#ef4444',
                            color: 'white',
                            borderRadius: '8px',
                            fontSize: '9px',
                            fontWeight: 'bold'
                          }}
                        >
                          {result}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
                {data.phases && (
                  <div style={{ fontSize: '12px' }}>
                    {data.phases.map((phase, index) => (
                      <div key={index} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                        <span style={{ color: '#6b7280', textTransform: 'capitalize' }}>
                          {phase.phase.replace(/-/g, ' ')}:
                        </span>
                        <span
                          style={{
                            padding: '1px 6px',
                            backgroundColor: getStatusColor(phase.status),
                            color: 'white',
                            borderRadius: '8px',
                            fontSize: '9px',
                            fontWeight: 'bold'
                          }}
                        >
                          {phase.status}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Milestones Tab */}
      {activeTab === 'milestones' && (
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>
            Launch Milestones
          </h2>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
              {launchData.launchConfig.launchMilestones.map((milestone, index) => (
                <div key={index} style={{ padding: '15px', border: '1px solid #e5e7eb', borderRadius: '8px' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#1f2937', marginBottom: '10px', textTransform: 'capitalize' }}>
                    {milestone.milestone.replace(/-/g, ' ')}
                  </h3>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>Target:</span>
                    <span style={{ fontSize: '12px', color: '#1f2937' }}>
                      {new Date(milestone.target).toLocaleString()}
                    </span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '12px', color: '#6b7280' }}>Status:</span>
                    <span
                      style={{
                        padding: '2px 6px',
                        backgroundColor: getStatusColor(milestone.status),
                        color: 'white',
                        borderRadius: '8px',
                        fontSize: '9px',
                        fontWeight: 'bold'
                      }}
                    >
                      {milestone.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Risks Tab */}
      {activeTab === 'risks' && (
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>
            Risk Assessment
          </h2>
          <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
                  {launchData.launchMetrics.risks.criticalRisks.length}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>Critical Risks</div>
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>
                  {launchData.launchMetrics.risks.highRisks.length}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>High Risks</div>
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>
                  {launchData.launchMetrics.risks.mediumRisks.length}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>Medium Risks</div>
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#6b7280' }}>
                  {launchData.launchMetrics.risks.lowRisks.length}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>Low Risks</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LaunchDashboard;
