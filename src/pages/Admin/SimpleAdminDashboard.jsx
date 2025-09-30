import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const SimpleAdminDashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  
  // Data states
  const [systemHealth, setSystemHealth] = useState({
    status: 'loading',
    uptime: '0%',
    responseTime: '0ms',
    activeUsers: 0,
    totalRequests: 0,
    errorRate: '0%',
    services: {}
  });
  const [customerMetrics, setCustomerMetrics] = useState({
    totalUsers: 0,
    activeToday: 0,
    newUsers: 0,
    retentionRate: '0%',
    averageSessionTime: '0m 0s',
    topFeatures: [],
    userJourney: {}
  });
  const [agentPerformance, setAgentPerformance] = useState({});
  const [costTracking, setCostTracking] = useState({
    totalCost: '$0.00',
    dailyCost: '$0.00',
    monthlyCost: '$0.00',
    costBreakdown: {},
    usageStats: {},
    projections: {}
  });
  const [recentActivity, setRecentActivity] = useState([]);
  const [alerts, setAlerts] = useState([]);

  // Load data from API
  useEffect(() => {
    const loadAdminData = async () => {
      try {
        setIsLoading(true);
        const response = await fetch('http://localhost:8000/api/admin/metrics');
        if (response.ok) {
          const data = await response.json();
          setSystemHealth(data.systemHealth || {});
          setCustomerMetrics(data.customerMetrics || {});
          setAgentPerformance(data.agentPerformance || {});
          setCostTracking(data.costTracking || {});
          setRecentActivity(data.recentActivity || []);
          setAlerts(data.alerts || []);
        } else {
          console.error('Failed to load admin metrics');
        }
      } catch (error) {
        console.error('Error loading admin data:', error);
      } finally {
        setIsLoading(false);
        setLastRefresh(new Date());
      }
    };

    loadAdminData();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadAdminData, 30000);
    return () => clearInterval(interval);
  }, []);

  const refreshData = async () => {
    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    setLastRefresh(new Date());
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num?.toString() || '0';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'error': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getAlertColor = (type) => {
    switch (type) {
      case 'error': return '#ef4444';
      case 'warning': return '#f59e0b';
      case 'info': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'customers', label: 'Customers' },
    { id: 'agents', label: 'Agents' },
    { id: 'costs', label: 'Costs' },
    { id: 'system', label: 'System' },
    { id: 'alerts', label: 'Alerts' }
  ];

  // Styles
  const containerStyle = {
    minHeight: '100vh',
    backgroundColor: '#f9fafb',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  };

  const headerStyle = {
    backgroundColor: '#ffffff',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
    borderBottom: '1px solid #e5e7eb',
    padding: '1rem 0'
  };

  const headerContentStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 1rem',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const titleStyle = {
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#111827',
    margin: 0
  };

  const subtitleStyle = {
    fontSize: '0.875rem',
    color: '#6b7280',
    margin: '0.25rem 0 0 0'
  };

  const buttonStyle = {
    padding: '0.5rem 1rem',
    backgroundColor: '#2563eb',
    color: '#ffffff',
    borderRadius: '0.375rem',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500'
  };

  const tabStyle = {
    display: 'flex',
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #e5e7eb',
    padding: '0 1rem'
  };

  const tabButtonStyle = {
    padding: '1rem 1.5rem',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#6b7280',
    borderBottom: '2px solid transparent'
  };

  const activeTabStyle = {
    ...tabButtonStyle,
    color: '#2563eb',
    borderBottomColor: '#2563eb'
  };

  const contentStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '2rem 1rem'
  };

  const cardStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '0.5rem',
    padding: '1.5rem',
    marginBottom: '1.5rem',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '1rem',
    marginBottom: '1.5rem'
  };

  const metricStyle = {
    backgroundColor: '#ffffff',
    borderRadius: '0.5rem',
    padding: '1rem',
    textAlign: 'center',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  };

  const metricValueStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
    color: '#111827',
    margin: '0.5rem 0'
  };

  const metricLabelStyle = {
    fontSize: '0.875rem',
    color: '#6b7280',
    margin: 0
  };

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={headerContentStyle}>
          <div>
            <h1 style={titleStyle}>Admin Dashboard</h1>
            <p style={subtitleStyle}>
              Last updated: {lastRefresh.toLocaleTimeString()}
            </p>
          </div>
          <button
            onClick={refreshData}
            disabled={isLoading}
            style={{ ...buttonStyle, opacity: isLoading ? 0.5 : 1 }}
          >
            {isLoading ? 'Loading...' : 'Refresh'}
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div style={tabStyle}>
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={activeTab === tab.id ? activeTabStyle : tabButtonStyle}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div style={contentStyle}>
        {activeTab === 'overview' && (
          <div>
            <h2 style={{ marginBottom: '1.5rem', color: '#111827' }}>System Overview</h2>
            
            {/* Key Metrics */}
            <div style={gridStyle}>
              <div style={metricStyle}>
                <div style={metricValueStyle}>{systemHealth.activeUsers || 0}</div>
                <div style={metricLabelStyle}>Active Users</div>
              </div>
              <div style={metricStyle}>
                <div style={metricValueStyle}>{systemHealth.responseTime || '0ms'}</div>
                <div style={metricLabelStyle}>Response Time</div>
              </div>
              <div style={metricStyle}>
                <div style={metricValueStyle}>{systemHealth.uptime || '0%'}</div>
                <div style={metricLabelStyle}>Uptime</div>
              </div>
              <div style={metricStyle}>
                <div style={metricValueStyle}>{systemHealth.errorRate || '0%'}</div>
                <div style={metricLabelStyle}>Error Rate</div>
              </div>
            </div>

            {/* System Health */}
            <div style={cardStyle}>
              <h3 style={{ marginBottom: '1rem', color: '#111827' }}>System Health</h3>
              <div style={gridStyle}>
                {Object.entries(systemHealth.services || {}).map(([service, data]) => (
                  <div key={service} style={{ ...metricStyle, textAlign: 'left' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                      <span style={{ fontWeight: '500', textTransform: 'capitalize' }}>{service}</span>
                      <span style={{ 
                        padding: '0.25rem 0.5rem', 
                        borderRadius: '0.25rem', 
                        fontSize: '0.75rem',
                        backgroundColor: getStatusColor(data.status) + '20',
                        color: getStatusColor(data.status)
                      }}>
                        {data.status}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      Response: {data.responseTime || 'N/A'}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'customers' && (
          <div>
            <h2 style={{ marginBottom: '1.5rem', color: '#111827' }}>Customer Analytics</h2>
            
            <div style={gridStyle}>
              <div style={metricStyle}>
                <div style={metricValueStyle}>{formatNumber(customerMetrics.totalUsers)}</div>
                <div style={metricLabelStyle}>Total Users</div>
              </div>
              <div style={metricStyle}>
                <div style={metricValueStyle}>{formatNumber(customerMetrics.activeToday)}</div>
                <div style={metricLabelStyle}>Active Today</div>
              </div>
              <div style={metricStyle}>
                <div style={metricValueStyle}>{formatNumber(customerMetrics.newUsers)}</div>
                <div style={metricLabelStyle}>New Users</div>
              </div>
              <div style={metricStyle}>
                <div style={metricValueStyle}>{customerMetrics.retentionRate || '0%'}</div>
                <div style={metricLabelStyle}>Retention Rate</div>
              </div>
            </div>

            <div style={cardStyle}>
              <h3 style={{ marginBottom: '1rem', color: '#111827' }}>User Journey</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {Object.entries(customerMetrics.userJourney || {}).map(([step, count]) => (
                  <div key={step} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                    <span style={{ textTransform: 'capitalize' }}>{step.replace(/([A-Z])/g, ' $1')}</span>
                    <span style={{ fontWeight: '500' }}>{formatNumber(count)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'agents' && (
          <div>
            <h2 style={{ marginBottom: '1.5rem', color: '#111827' }}>Agent Performance</h2>
            
            <div style={gridStyle}>
              {Object.entries(agentPerformance || {}).map(([agentName, metrics]) => (
                <div key={agentName} style={cardStyle}>
                  <h3 style={{ marginBottom: '1rem', textTransform: 'capitalize' }}>
                    {agentName.replace('Agent', ' Agent')}
                  </h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Success Rate:</span>
                      <span style={{ fontWeight: '500' }}>{metrics.successRate || '0%'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Avg Time:</span>
                      <span style={{ fontWeight: '500' }}>{metrics.averageTime || '0s'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Cost/Exec:</span>
                      <span style={{ fontWeight: '500' }}>{metrics.costPerExecution || '$0.00'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>Executions:</span>
                      <span style={{ fontWeight: '500' }}>{metrics.totalExecutions || 0}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'costs' && (
          <div>
            <h2 style={{ marginBottom: '1.5rem', color: '#111827' }}>Cost Tracking</h2>
            
            <div style={gridStyle}>
              <div style={metricStyle}>
                <div style={metricValueStyle}>{costTracking.totalCost || '$0.00'}</div>
                <div style={metricLabelStyle}>Total Cost</div>
              </div>
              <div style={metricStyle}>
                <div style={metricValueStyle}>{costTracking.dailyCost || '$0.00'}</div>
                <div style={metricLabelStyle}>Daily Cost</div>
              </div>
              <div style={metricStyle}>
                <div style={metricValueStyle}>{costTracking.monthlyCost || '$0.00'}</div>
                <div style={metricLabelStyle}>Monthly Cost</div>
              </div>
            </div>

            <div style={cardStyle}>
              <h3 style={{ marginBottom: '1rem', color: '#111827' }}>Cost Breakdown</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {Object.entries(costTracking.costBreakdown || {}).map(([service, cost]) => (
                  <div key={service} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                    <span style={{ textTransform: 'capitalize' }}>{service}</span>
                    <span style={{ fontWeight: '500' }}>{cost}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div>
            <h2 style={{ marginBottom: '1.5rem', color: '#111827' }}>System Details</h2>
            
            <div style={cardStyle}>
              <h3 style={{ marginBottom: '1rem', color: '#111827' }}>System Status</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Status:</span>
                  <span style={{ 
                    fontWeight: '500', 
                    color: getStatusColor(systemHealth.status),
                    textTransform: 'capitalize'
                  }}>
                    {systemHealth.status}
                  </span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Uptime:</span>
                  <span style={{ fontWeight: '500' }}>{systemHealth.uptime}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Response Time:</span>
                  <span style={{ fontWeight: '500' }}>{systemHealth.responseTime}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span>Total Requests:</span>
                  <span style={{ fontWeight: '500' }}>{formatNumber(systemHealth.totalRequests)}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'alerts' && (
          <div>
            <h2 style={{ marginBottom: '1.5rem', color: '#111827' }}>System Alerts</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {alerts.map(alert => (
                <div key={alert.id} style={{
                  ...cardStyle,
                  borderLeft: `4px solid ${getAlertColor(alert.type)}`
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <h3 style={{ margin: 0, color: '#111827' }}>{alert.title}</h3>
                    <span style={{ 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '0.25rem', 
                      fontSize: '0.75rem',
                      backgroundColor: getAlertColor(alert.type) + '20',
                      color: getAlertColor(alert.type),
                      textTransform: 'capitalize'
                    }}>
                      {alert.severity}
                    </span>
                  </div>
                  <p style={{ margin: '0.5rem 0', color: '#6b7280' }}>{alert.message}</p>
                  <div style={{ fontSize: '0.75rem', color: '#9ca3af' }}>{alert.timestamp}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SimpleAdminDashboard;
