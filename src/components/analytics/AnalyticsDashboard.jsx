import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';

const AnalyticsDashboard = () => {
  const [user] = useAuthState(auth);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTimeRange, setSelectedTimeRange] = useState('7_days');
  const [selectedMetric, setSelectedMetric] = useState('learning_outcomes');

  useEffect(() => {
    if (user) {
      loadAnalyticsData();
    }
  }, [user, selectedTimeRange, selectedMetric]);

  const loadAnalyticsData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8000/api/analytics/learning-outcomes?time_range=${selectedTimeRange}&metric=${selectedMetric}`);
      
      if (!response.ok) {
        throw new Error('Failed to load analytics data');
      }

      const data = await response.json();
      setAnalyticsData(data);
    } catch (err) {
      setError(err.message);
      // Fallback to sample data
      setAnalyticsData(getSampleAnalyticsData());
    } finally {
      setIsLoading(false);
    }
  };

  const getSampleAnalyticsData = () => {
    return {
      learningOutcomes: {
        totalChildren: 127,
        averageCompletionRate: 78.5,
        topPerformingAgeGroups: [
          { age: '5-6', completionRate: 85.2, children: 32 },
          { age: '7-8', completionRate: 82.1, children: 45 },
          { age: '9-10', completionRate: 76.8, children: 38 },
          { age: '11-12', completionRate: 71.3, children: 12 }
        ],
        topicEngagement: [
          { topic: 'Science Experiments', engagement: 92.3, completions: 89 },
          { topic: 'Art & Crafts', engagement: 88.7, completions: 76 },
          { topic: 'Mathematics', engagement: 84.2, completions: 65 },
          { topic: 'Reading & Writing', engagement: 79.8, completions: 58 },
          { topic: 'Music & Dance', engagement: 76.5, completions: 43 }
        ],
        learningProgress: [
          { week: 1, averageProgress: 25.3 },
          { week: 2, averageProgress: 48.7 },
          { week: 3, averageProgress: 72.1 },
          { week: 4, averageProgress: 89.4 }
        ]
      },
      userEngagement: {
        dailyActiveUsers: 89,
        weeklyActiveUsers: 234,
        monthlyActiveUsers: 567,
        averageSessionDuration: '24.5 minutes',
        sessionFrequency: 3.2,
        featureUsage: [
          { feature: 'Schedule Generation', usage: 95.2, users: 108 },
          { feature: 'Progress Tracking', usage: 87.3, users: 99 },
          { feature: 'Content Library', usage: 76.8, users: 87 },
          { feature: 'Parent Portal', usage: 68.4, users: 78 },
          { feature: 'Delivery Tracking', usage: 54.7, users: 62 }
        ]
      },
      businessMetrics: {
        totalRevenue: 12450.75,
        monthlyRecurringRevenue: 8750.25,
        customerLifetimeValue: 245.80,
        churnRate: 8.3,
        conversionRate: 12.7,
        averageRevenuePerUser: 98.50
      },
      performanceMetrics: {
        averageResponseTime: '1.2s',
        systemUptime: '99.8%',
        errorRate: 0.2,
        agentAccuracy: 94.7,
        costPerSession: 0.15
      }
    };
  };

  const timeRangeOptions = [
    { value: '1_day', label: 'Last 24 Hours' },
    { value: '7_days', label: 'Last 7 Days' },
    { value: '30_days', label: 'Last 30 Days' },
    { value: '90_days', label: 'Last 90 Days' },
    { value: '1_year', label: 'Last Year' }
  ];

  const metricOptions = [
    { value: 'learning_outcomes', label: 'Learning Outcomes' },
    { value: 'user_engagement', label: 'User Engagement' },
    { value: 'business_metrics', label: 'Business Metrics' },
    { value: 'performance', label: 'Performance' }
  ];

  const containerStyle = {
    padding: '20px',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid #e2e8f0'
  };

  const controlsStyle = {
    display: 'flex',
    gap: '16px',
    alignItems: 'center',
    marginBottom: '20px'
  };

  const selectStyle = {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    backgroundColor: 'white'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  };

  const cardStyle = {
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  };

  const metricCardStyle = {
    ...cardStyle,
    textAlign: 'center'
  };

  const chartContainerStyle = {
    height: '300px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0',
    marginTop: '16px'
  };

  if (isLoading) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{
            width: '24px',
            height: '24px',
            border: '2px solid #3b82f6',
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 12px'
          }}></div>
          Loading analytics data...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <div style={{
          padding: '16px',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          color: '#dc2626'
        }}>
          <strong>Error:</strong> {error}
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={{ margin: '0', color: '#1e293b' }}>
          📊 Analytics Dashboard
        </h1>
        <div style={{ fontSize: '14px', color: '#64748b' }}>
          Real-time insights and performance metrics
        </div>
      </div>

      <div style={controlsStyle}>
        <select
          value={selectedTimeRange}
          onChange={(e) => setSelectedTimeRange(e.target.value)}
          style={selectStyle}
        >
          {timeRangeOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
        <select
          value={selectedMetric}
          onChange={(e) => setSelectedMetric(e.target.value)}
          style={selectStyle}
        >
          {metricOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* Key Metrics Overview */}
      <div style={gridStyle}>
        <div style={metricCardStyle}>
          <h3 style={{ margin: '0 0 8px 0', color: '#1e293b' }}>Total Children</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6' }}>
            {analyticsData?.learningOutcomes?.totalChildren || 0}
          </div>
        </div>
        
        <div style={metricCardStyle}>
          <h3 style={{ margin: '0 0 8px 0', color: '#1e293b' }}>Avg Completion Rate</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981' }}>
            {analyticsData?.learningOutcomes?.averageCompletionRate || 0}%
          </div>
        </div>
        
        <div style={metricCardStyle}>
          <h3 style={{ margin: '0 0 8px 0', color: '#1e293b' }}>Daily Active Users</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f59e0b' }}>
            {analyticsData?.userEngagement?.dailyActiveUsers || 0}
          </div>
        </div>
        
        <div style={metricCardStyle}>
          <h3 style={{ margin: '0 0 8px 0', color: '#1e293b' }}>Monthly Revenue</h3>
          <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#8b5cf6' }}>
            ${analyticsData?.businessMetrics?.monthlyRecurringRevenue?.toFixed(2) || '0.00'}
          </div>
        </div>
      </div>

      {/* Learning Outcomes Chart */}
      {selectedMetric === 'learning_outcomes' && (
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            Learning Outcomes by Age Group
          </h3>
          <div style={chartContainerStyle}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '18px', color: '#64748b', marginBottom: '16px' }}>
                📈 Completion Rates by Age
              </div>
              <div style={{ display: 'flex', gap: '20px', justifyContent: 'center', flexWrap: 'wrap' }}>
                {analyticsData?.learningOutcomes?.topPerformingAgeGroups?.map((group, index) => (
                  <div key={index} style={{
                    padding: '12px',
                    backgroundColor: '#f0f9ff',
                    borderRadius: '8px',
                    border: '1px solid #0ea5e9',
                    minWidth: '120px'
                  }}>
                    <div style={{ fontWeight: 'bold', color: '#0c4a6e' }}>
                      Ages {group.age}
                    </div>
                    <div style={{ fontSize: '24px', color: '#0c4a6e', fontWeight: 'bold' }}>
                      {group.completionRate}%
                    </div>
                    <div style={{ fontSize: '12px', color: '#0c4a6e' }}>
                      {group.children} children
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* User Engagement Chart */}
      {selectedMetric === 'user_engagement' && (
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            Feature Usage Analytics
          </h3>
          <div style={chartContainerStyle}>
            <div style={{ width: '100%' }}>
              {analyticsData?.userEngagement?.featureUsage?.map((feature, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '12px',
                  marginBottom: '8px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '6px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div>
                    <div style={{ fontWeight: '500', color: '#1e293b' }}>
                      {feature.feature}
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>
                      {feature.users} users
                    </div>
                  </div>
                  <div style={{
                    padding: '4px 8px',
                    backgroundColor: '#10b981',
                    color: 'white',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '500'
                  }}>
                    {feature.usage}%
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Business Metrics Chart */}
      {selectedMetric === 'business_metrics' && (
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            Business Performance Metrics
          </h3>
          <div style={chartContainerStyle}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', width: '100%' }}>
              <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#f0f9ff', borderRadius: '8px' }}>
                <div style={{ fontSize: '14px', color: '#0c4a6e', marginBottom: '8px' }}>Customer LTV</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0c4a6e' }}>
                  ${analyticsData?.businessMetrics?.customerLifetimeValue?.toFixed(2)}
                </div>
              </div>
              <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#fef2f2', borderRadius: '8px' }}>
                <div style={{ fontSize: '14px', color: '#dc2626', marginBottom: '8px' }}>Churn Rate</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626' }}>
                  {analyticsData?.businessMetrics?.churnRate}%
                </div>
              </div>
              <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#f0fdf4', borderRadius: '8px' }}>
                <div style={{ fontSize: '14px', color: '#059669', marginBottom: '8px' }}>Conversion Rate</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#059669' }}>
                  {analyticsData?.businessMetrics?.conversionRate}%
                </div>
              </div>
              <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#fef3c7', borderRadius: '8px' }}>
                <div style={{ fontSize: '14px', color: '#d97706', marginBottom: '8px' }}>ARPU</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#d97706' }}>
                  ${analyticsData?.businessMetrics?.averageRevenuePerUser?.toFixed(2)}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Performance Metrics Chart */}
      {selectedMetric === 'performance' && (
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            System Performance Metrics
          </h3>
          <div style={chartContainerStyle}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', width: '100%' }}>
              <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#f0f9ff', borderRadius: '8px' }}>
                <div style={{ fontSize: '14px', color: '#0c4a6e', marginBottom: '8px' }}>Response Time</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0c4a6e' }}>
                  {analyticsData?.performanceMetrics?.averageResponseTime}
                </div>
              </div>
              <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#f0fdf4', borderRadius: '8px' }}>
                <div style={{ fontSize: '14px', color: '#059669', marginBottom: '8px' }}>Uptime</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#059669' }}>
                  {analyticsData?.performanceMetrics?.systemUptime}
                </div>
              </div>
              <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#fef2f2', borderRadius: '8px' }}>
                <div style={{ fontSize: '14px', color: '#dc2626', marginBottom: '8px' }}>Error Rate</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626' }}>
                  {analyticsData?.performanceMetrics?.errorRate}%
                </div>
              </div>
              <div style={{ textAlign: 'center', padding: '16px', backgroundColor: '#fef3c7', borderRadius: '8px' }}>
                <div style={{ fontSize: '14px', color: '#d97706', marginBottom: '8px' }}>Agent Accuracy</div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#d97706' }}>
                  {analyticsData?.performanceMetrics?.agentAccuracy}%
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AnalyticsDashboard;
