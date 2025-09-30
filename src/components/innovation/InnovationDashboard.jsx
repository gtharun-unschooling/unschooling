/**
 * Innovation Dashboard Component
 * Comprehensive view of innovation pipeline, technology trends, and future planning
 */

import React, { useState, useEffect } from 'react';
import innovationService from '../../services/innovationService';

const InnovationDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [innovationData, setInnovationData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadInnovationData();
  }, []);

  const loadInnovationData = async () => {
    try {
      setLoading(true);
      const data = innovationService.exportInnovationData();
      setInnovationData(data);
      setError(null);
    } catch (err) {
      setError('Failed to load innovation data');
      console.error('Error loading innovation data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleExportData = () => {
    if (innovationData) {
      const dataStr = JSON.stringify(innovationData, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `innovation-data-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      URL.revokeObjectURL(url);
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      case 'very_low': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getMaturityColor = (maturity) => {
    switch (maturity) {
      case 'mature': return '#10b981';
      case 'emerging': return '#f59e0b';
      case 'experimental': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'development': return '#3b82f6';
      case 'planning': return '#f59e0b';
      case 'proposed': return '#6b7280';
      case 'running': return '#10b981';
      default: return '#6b7280';
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', color: '#6b7280' }}>Loading innovation data...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', color: '#ef4444' }}>Error: {error}</div>
        <button
          onClick={loadInnovationData}
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

  if (!innovationData) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div style={{ fontSize: '18px', color: '#6b7280' }}>No innovation data available</div>
      </div>
    );
  }

  const { innovationMetrics, technologyTrends, innovationPipeline, featureRoadmap, innovationRoadmap, competitivePositioning, marketExpansionStrategies } = innovationData;

  return (
    <div style={{ padding: '20px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      {/* Header */}
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', marginBottom: '10px' }}>
          Innovation Dashboard
        </h1>
        <p style={{ fontSize: '16px', color: '#6b7280' }}>
          Research, development, and future planning for innovative features
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
            onClick={loadInnovationData}
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

      {/* Navigation Tabs */}
      <div style={{ marginBottom: '30px' }}>
        <div style={{ display: 'flex', gap: '10px', borderBottom: '2px solid #e5e7eb' }}>
          {[
            { id: 'overview', label: 'Overview' },
            { id: 'technology', label: 'Technology Trends' },
            { id: 'pipeline', label: 'Innovation Pipeline' },
            { id: 'roadmap', label: 'Feature Roadmap' },
            { id: 'competitive', label: 'Competitive Analysis' },
            { id: 'market', label: 'Market Expansion' }
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
          {/* Innovation Metrics */}
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>
              Innovation Metrics
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
              <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6' }}>
                  {innovationMetrics.researchProjects}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>Research Projects</div>
              </div>
              <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#10b981' }}>
                  {innovationMetrics.prototypesCreated}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>Prototypes Created</div>
              </div>
              <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#f59e0b' }}>
                  {innovationMetrics.experimentsRun}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>Experiments Run</div>
              </div>
              <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>
                  {innovationMetrics.featuresLaunched}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>Features Launched</div>
              </div>
              <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ef4444' }}>
                  {innovationMetrics.innovationScore}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>Innovation Score</div>
              </div>
            </div>
          </div>

          {/* Innovation Roadmap */}
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>
              Innovation Roadmap
            </h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
              {Object.entries(innovationRoadmap).map(([quarter, data]) => (
                <div key={quarter} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                  <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '10px' }}>
                    {quarter.replace('_', ' ').toUpperCase()}
                  </h3>
                  <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '15px' }}>
                    Focus: {data.focus}
                  </div>
                  <div style={{ marginBottom: '15px' }}>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>Goals:</div>
                    <ul style={{ fontSize: '12px', color: '#6b7280', paddingLeft: '20px' }}>
                      {data.goals.map((goal, index) => (
                        <li key={index}>{goal}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>Metrics:</div>
                    <div style={{ fontSize: '12px', color: '#6b7280' }}>
                      {data.metrics.join(', ')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Technology Trends Tab */}
      {activeTab === 'technology' && (
        <div>
          {Object.entries(technologyTrends).map(([category, trends]) => (
            <div key={category} style={{ marginBottom: '30px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px', textTransform: 'capitalize' }}>
                {category} Trends
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
                {trends.map((trend, index) => (
                  <div key={index} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937' }}>
                        {trend.technology}
                      </h3>
                      <div style={{ display: 'flex', gap: '5px' }}>
                        <span
                          style={{
                            padding: '2px 8px',
                            backgroundColor: getMaturityColor(trend.maturity),
                            color: 'white',
                            borderRadius: '12px',
                            fontSize: '10px',
                            fontWeight: 'bold'
                          }}
                        >
                          {trend.maturity}
                        </span>
                        <span
                          style={{
                            padding: '2px 8px',
                            backgroundColor: getPriorityColor(trend.priority),
                            color: 'white',
                            borderRadius: '12px',
                            fontSize: '10px',
                            fontWeight: 'bold'
                          }}
                        >
                          {trend.priority}
                        </span>
                      </div>
                    </div>
                    <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '10px' }}>
                      {trend.description || trend.useCase}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px' }}>
                      <div>
                        <span style={{ fontWeight: 'bold', color: '#1f2937' }}>Impact:</span>
                        <span style={{ color: '#6b7280', marginLeft: '5px' }}>{trend.impact}</span>
                      </div>
                      <div>
                        <span style={{ fontWeight: 'bold', color: '#1f2937' }}>Adoption:</span>
                        <span style={{ color: '#6b7280', marginLeft: '5px' }}>{trend.adoption}</span>
                      </div>
                      <div>
                        <span style={{ fontWeight: 'bold', color: '#1f2937' }}>Timeline:</span>
                        <span style={{ color: '#6b7280', marginLeft: '5px' }}>{trend.timeline}</span>
                      </div>
                      <div>
                        <span style={{ fontWeight: 'bold', color: '#1f2937' }}>Priority:</span>
                        <span style={{ color: '#6b7280', marginLeft: '5px' }}>{trend.priority}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Innovation Pipeline Tab */}
      {activeTab === 'pipeline' && (
        <div>
          {Object.entries(innovationPipeline).map(([type, items]) => (
            <div key={type} style={{ marginBottom: '30px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px', textTransform: 'capitalize' }}>
                {type} Pipeline
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
                {items.map((item, index) => (
                  <div key={index} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                      <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937' }}>
                        {item.title}
                      </h3>
                      <span
                        style={{
                          padding: '2px 8px',
                          backgroundColor: getStatusColor(item.status),
                          color: 'white',
                          borderRadius: '12px',
                          fontSize: '10px',
                          fontWeight: 'bold'
                        }}
                      >
                        {item.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '15px' }}>
                      {item.description}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px', marginBottom: '15px' }}>
                      <div>
                        <span style={{ fontWeight: 'bold', color: '#1f2937' }}>Start Date:</span>
                        <span style={{ color: '#6b7280', marginLeft: '5px' }}>{item.startDate}</span>
                      </div>
                      <div>
                        <span style={{ fontWeight: 'bold', color: '#1f2937' }}>Completion:</span>
                        <span style={{ color: '#6b7280', marginLeft: '5px' }}>{item.expectedCompletion}</span>
                      </div>
                      {item.priority && (
                        <div>
                          <span style={{ fontWeight: 'bold', color: '#1f2937' }}>Priority:</span>
                          <span style={{ color: '#6b7280', marginLeft: '5px' }}>{item.priority}</span>
                        </div>
                      )}
                      {item.budget && (
                        <div>
                          <span style={{ fontWeight: 'bold', color: '#1f2937' }}>Budget:</span>
                          <span style={{ color: '#6b7280', marginLeft: '5px' }}>${item.budget.toLocaleString()}</span>
                        </div>
                      )}
                    </div>
                    {item.team && (
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#1f2937', marginBottom: '5px' }}>Team:</div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          {Array.isArray(item.team) ? item.team.join(', ') : item.team}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Feature Roadmap Tab */}
      {activeTab === 'roadmap' && (
        <div>
          {Object.entries(featureRoadmap).map(([timeline, features]) => (
            <div key={timeline} style={{ marginBottom: '30px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px', textTransform: 'capitalize' }}>
                {timeline} Features
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
                {features.map((feature, index) => (
                  <div key={index} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                    <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '10px' }}>
                      {feature.title}
                    </h3>
                    <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '15px' }}>
                      {feature.description}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px', marginBottom: '15px' }}>
                      <div>
                        <span style={{ fontWeight: 'bold', color: '#1f2937' }}>Timeline:</span>
                        <span style={{ color: '#6b7280', marginLeft: '5px' }}>{feature.timeline}</span>
                      </div>
                      <div>
                        <span style={{ fontWeight: 'bold', color: '#1f2937' }}>Effort:</span>
                        <span style={{ color: '#6b7280', marginLeft: '5px' }}>{feature.effort}</span>
                      </div>
                      <div>
                        <span style={{ fontWeight: 'bold', color: '#1f2937' }}>Impact:</span>
                        <span style={{ color: '#6b7280', marginLeft: '5px' }}>{feature.impact}</span>
                      </div>
                      <div>
                        <span style={{ fontWeight: 'bold', color: '#1f2937' }}>Dependencies:</span>
                        <span style={{ color: '#6b7280', marginLeft: '5px' }}>
                          {feature.dependencies.length > 0 ? feature.dependencies.join(', ') : 'None'}
                        </span>
                      </div>
                    </div>
                    {feature.team && (
                      <div>
                        <div style={{ fontSize: '12px', fontWeight: 'bold', color: '#1f2937', marginBottom: '5px' }}>Team:</div>
                        <div style={{ fontSize: '12px', color: '#6b7280' }}>
                          {Array.isArray(feature.team) ? feature.team.join(', ') : feature.team}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Competitive Analysis Tab */}
      {activeTab === 'competitive' && (
        <div>
          <div style={{ marginBottom: '30px' }}>
            <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>
              Competitive Positioning
            </h2>
            <div style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>
                Current Position: {competitivePositioning.currentPosition}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#10b981', marginBottom: '10px' }}>Strengths</h3>
                  <ul style={{ fontSize: '12px', color: '#6b7280', paddingLeft: '20px' }}>
                    {competitivePositioning.strengths.map((strength, index) => (
                      <li key={index}>{strength}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#ef4444', marginBottom: '10px' }}>Weaknesses</h3>
                  <ul style={{ fontSize: '12px', color: '#6b7280', paddingLeft: '20px' }}>
                    {competitivePositioning.weaknesses.map((weakness, index) => (
                      <li key={index}>{weakness}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '10px' }}>Opportunities</h3>
                  <ul style={{ fontSize: '12px', color: '#6b7280', paddingLeft: '20px' }}>
                    {competitivePositioning.opportunities.map((opportunity, index) => (
                      <li key={index}>{opportunity}</li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 style={{ fontSize: '14px', fontWeight: 'bold', color: '#f59e0b', marginBottom: '10px' }}>Threats</h3>
                  <ul style={{ fontSize: '12px', color: '#6b7280', paddingLeft: '20px' }}>
                    {competitivePositioning.threats.map((threat, index) => (
                      <li key={index}>{threat}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Market Expansion Tab */}
      {activeTab === 'market' && (
        <div>
          <h2 style={{ fontSize: '20px', fontWeight: 'bold', color: '#1f2937', marginBottom: '15px' }}>
            Market Expansion Strategies
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '20px' }}>
            {marketExpansionStrategies.map((strategy, index) => (
              <div key={index} style={{ backgroundColor: 'white', padding: '20px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
                <h3 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1f2937', marginBottom: '10px' }}>
                  {strategy.market}
                </h3>
                <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '15px' }}>
                  {strategy.strategy}
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '12px' }}>
                  <div>
                    <span style={{ fontWeight: 'bold', color: '#1f2937' }}>Timeline:</span>
                    <span style={{ color: '#6b7280', marginLeft: '5px' }}>{strategy.timeline}</span>
                  </div>
                  <div>
                    <span style={{ fontWeight: 'bold', color: '#1f2937' }}>Effort:</span>
                    <span style={{ color: '#6b7280', marginLeft: '5px' }}>{strategy.effort}</span>
                  </div>
                  <div>
                    <span style={{ fontWeight: 'bold', color: '#1f2937' }}>Potential:</span>
                    <span style={{ color: '#6b7280', marginLeft: '5px' }}>{strategy.potential}</span>
                  </div>
                  <div>
                    <span style={{ fontWeight: 'bold', color: '#1f2937' }}>Priority:</span>
                    <span style={{ color: '#6b7280', marginLeft: '5px' }}>{strategy.priority}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default InnovationDashboard;
