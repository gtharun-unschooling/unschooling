import React, { useState, useEffect } from 'react';

const UltimateAdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedChild, setSelectedChild] = useState('UUUU'); // Default to UUUU child
  const [selectedAccount, setSelectedAccount] = useState('K4hCLJm3xPNO1npC1sQiJjDs8Xm1'); // Default to gtharun04@gmail.com
  const [timeRange, setTimeRange] = useState('all'); // Default to All Time
  const [data, setData] = useState({
    systemHealth: null,
    customerMetrics: null,
    agentPerformance: null,
    costTracking: null,
    childActivity: null,
    filterOptions: null,
    realTimeActivity: []
  });
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Load all data
  useEffect(() => {
    loadAllData();
    const interval = setInterval(loadAllData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, [selectedAccount, timeRange]);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      // Load all data in parallel
      const [
        systemHealthRes,
        filterOptionsRes,
        childActivityRes,
        realTimeRes
      ] = await Promise.all([
        fetch('http://localhost:8000/api/admin/metrics'),
        fetch('http://localhost:8000/api/admin/filter-options'),
        fetch(selectedAccount 
          ? `http://localhost:8000/api/admin/all-children-activity?account_id=${selectedAccount}`
          : 'http://localhost:8000/api/admin/all-children-activity'
        ),
        fetch(`http://localhost:8000/api/admin/real-time-activity?time_range=${timeRange}`)
      ]);

      const systemHealth = systemHealthRes.ok ? await systemHealthRes.json() : null;
      const filterOptions = filterOptionsRes.ok ? await filterOptionsRes.json() : null;
      const childActivity = childActivityRes.ok ? await childActivityRes.json() : null;
      const realTime = realTimeRes.ok ? await realTimeRes.json() : null;

      setData({
        systemHealth,
        customerMetrics: systemHealth?.customerMetrics,
        agentPerformance: systemHealth?.agentPerformance,
        costTracking: systemHealth?.costTracking,
        childActivity,
        filterOptions,
        realTimeActivity: realTime?.activities || []
      });

      setLastRefresh(new Date());
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp * 1000);
    return date.toLocaleString();
  };

  const formatDuration = (seconds) => {
    if (seconds < 60) return `${seconds.toFixed(1)}s`;
    if (seconds < 3600) return `${(seconds / 60).toFixed(1)}m`;
    return `${(seconds / 3600).toFixed(1)}h`;
  };

  const getTimeRangeLabel = (range) => {
    const labels = {
      '5_minutes': 'Last 5 Minutes',
      '10_minutes': 'Last 10 Minutes',
      '1_hour': 'Last Hour',
      '24_hours': 'Last 24 Hours',
      '7_days': 'Last 7 Days',
      '30_days': 'Last 30 Days',
      'all': 'All Time'
    };
    return labels[range] || range;
  };

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
    maxWidth: '1400px',
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

  const tabStyle = {
    padding: '0.5rem 1rem',
    border: 'none',
    backgroundColor: 'transparent',
    cursor: 'pointer',
    fontSize: '0.875rem',
    fontWeight: '500',
    color: '#6b7280',
    borderBottom: '2px solid transparent'
  };

  const activeTabStyle = {
    ...tabStyle,
    color: '#2563eb',
    borderBottomColor: '#2563eb'
  };

  const selectStyle = {
    padding: '0.5rem 0.75rem',
    border: '1px solid #d1d5db',
    borderRadius: '0.375rem',
    fontSize: '0.875rem',
    backgroundColor: '#ffffff',
    marginRight: '1rem'
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

  const contentStyle = {
    maxWidth: '1400px',
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
    fontSize: '1.5rem',
    fontWeight: 'bold',
    color: '#111827',
    margin: '0.5rem 0'
  };

  const metricLabelStyle = {
    fontSize: '0.875rem',
    color: '#6b7280',
    margin: 0
  };

  const activityItemStyle = {
    padding: '1rem',
    border: '1px solid #e5e7eb',
    borderRadius: '0.375rem',
    marginBottom: '0.5rem',
    backgroundColor: '#ffffff'
  };

  const renderOverview = () => (
    <div>
      {/* System Health */}
      {data.systemHealth && (
        <div style={cardStyle}>
          <h2 style={{ marginBottom: '1rem', color: '#111827' }}>System Health</h2>
          <div style={gridStyle}>
            <div style={metricStyle}>
              <div style={metricValueStyle}>{data.systemHealth.systemHealth?.status || 'Unknown'}</div>
              <div style={metricLabelStyle}>Status</div>
            </div>
            <div style={metricStyle}>
              <div style={metricValueStyle}>{data.systemHealth.systemHealth?.uptime || '0h 0m'}</div>
              <div style={metricLabelStyle}>Uptime</div>
            </div>
            <div style={metricStyle}>
              <div style={metricValueStyle}>{data.systemHealth.systemHealth?.totalRequests || 0}</div>
              <div style={metricLabelStyle}>Total Requests</div>
            </div>
            <div style={metricStyle}>
              <div style={metricValueStyle}>{data.systemHealth.systemHealth?.errorRate || '0%'}</div>
              <div style={metricLabelStyle}>Error Rate</div>
            </div>
          </div>
        </div>
      )}

      {/* Cost Tracking */}
      {data.costTracking && (
        <div style={cardStyle}>
          <h2 style={{ marginBottom: '1rem', color: '#111827' }}>Cost Tracking</h2>
          <div style={gridStyle}>
            <div style={metricStyle}>
              <div style={metricValueStyle}>{data.costTracking.totalCost || '$0.00'}</div>
              <div style={metricLabelStyle}>Total Cost</div>
            </div>
            <div style={metricStyle}>
              <div style={metricValueStyle}>{data.costTracking.dailyCost || '$0.00'}</div>
              <div style={metricLabelStyle}>Daily Cost</div>
            </div>
            <div style={metricStyle}>
              <div style={metricValueStyle}>{data.costTracking.monthlyCost || '$0.00'}</div>
              <div style={metricLabelStyle}>Monthly Cost</div>
            </div>
            <div style={metricStyle}>
              <div style={metricValueStyle}>{data.costTracking.usageStats?.totalTokens || 0}</div>
              <div style={metricLabelStyle}>Total Tokens</div>
            </div>
          </div>
        </div>
      )}

      {/* Children Overview */}
      {data.childActivity && (
        <div style={cardStyle}>
          <h2 style={{ marginBottom: '1rem', color: '#111827' }}>Children Overview</h2>
          <div style={gridStyle}>
            <div style={metricStyle}>
              <div style={metricValueStyle}>{data.childActivity.total_children || 0}</div>
              <div style={metricLabelStyle}>Total Children</div>
            </div>
            <div style={metricStyle}>
              <div style={metricValueStyle}>{data.childActivity.global_stats?.total_activities || 0}</div>
              <div style={metricLabelStyle}>Total Activities</div>
            </div>
            <div style={metricStyle}>
              <div style={metricValueStyle}>{data.childActivity.global_stats?.total_tokens || 0}</div>
              <div style={metricLabelStyle}>Total Tokens</div>
            </div>
            <div style={metricStyle}>
              <div style={metricValueStyle}>${(data.childActivity.global_stats?.total_cost || 0).toFixed(2)}</div>
              <div style={metricLabelStyle}>Total Cost</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderAgentPerformance = () => (
    <div>
      {data.agentPerformance && Object.keys(data.agentPerformance).length > 0 ? (
        <div style={cardStyle}>
          <h2 style={{ marginBottom: '1rem', color: '#111827' }}>Agent Performance</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            {Object.entries(data.agentPerformance).map(([agent, metrics]) => (
              <div key={agent} style={metricStyle}>
                <h3 style={{ marginBottom: '0.5rem', color: '#111827' }}>{agent}</h3>
                <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                  <div>Executions: {metrics.totalExecutions}</div>
                  <div>Success Rate: {metrics.successRate}</div>
                  <div>Avg Time: {metrics.averageTime}</div>
                  <div>Cost/Execution: {metrics.costPerExecution}</div>
                  <div>Performance: {metrics.performance}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div style={cardStyle}>
          <h2 style={{ marginBottom: '1rem', color: '#111827' }}>Agent Performance</h2>
          <p style={{ color: '#6b7280', textAlign: 'center' }}>No agent performance data available</p>
        </div>
      )}
    </div>
  );

  const renderChildActivity = () => (
    <div>
      {/* Children List */}
      {data.childActivity && data.childActivity.children && (
        <div style={cardStyle}>
          <h2 style={{ marginBottom: '1rem', color: '#111827' }}>
            Children {selectedAccount ? `(Filtered by Account)` : ''}
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
            {Object.entries(data.childActivity.children).map(([childId, childData]) => (
              <div
                key={childId}
                style={{
                  ...activityItemStyle,
                  cursor: 'pointer',
                  border: selectedChild === childId ? '2px solid #2563eb' : '1px solid #e5e7eb'
                }}
                onClick={() => setSelectedChild(childId)}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h4 style={{ margin: 0, color: '#111827' }}>{childData.child_name}</h4>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {formatTime(childData.last_activity)}
                  </span>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#6b7280' }}>
                  <span>Activities: {childData.total_activities}</span>
                  <span>Cost: ${childData.total_cost.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#6b7280' }}>
                  <span>Tokens: {childData.total_tokens}</span>
                  <span>24h: {childData.recent_activities_24h} activities</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Real-Time Activity Feed */}
      <div style={cardStyle}>
        <h2 style={{ marginBottom: '1rem', color: '#111827' }}>
          Real-Time Activity Feed ({getTimeRangeLabel(timeRange)})
        </h2>
        
        {data.realTimeActivity.length > 0 ? (
          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            {data.realTimeActivity.map((activity, index) => (
              <div key={index} style={activityItemStyle}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ 
                      padding: '0.25rem 0.5rem', 
                      borderRadius: '0.25rem', 
                      fontSize: '0.75rem',
                      backgroundColor: activity.success ? '#10b981' : '#ef4444',
                      color: '#ffffff'
                    }}>
                      {activity.agent_name}
                    </span>
                    <span style={{ fontWeight: '500' }}>{activity.child_name}</span>
                    {activity.account_email && (
                      <span style={{ 
                        fontSize: '0.75rem', 
                        color: '#6b7280',
                        backgroundColor: '#f3f4f6',
                        padding: '0.125rem 0.375rem',
                        borderRadius: '0.25rem'
                      }}>
                        {activity.account_email}
                      </span>
                    )}
                  </div>
                  <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                    {formatTime(activity.timestamp)}
                  </span>
                </div>
                
                <div style={{ marginBottom: '0.5rem' }}>
                  <strong>{activity.action}</strong>
                </div>
                
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.875rem', color: '#6b7280' }}>
                  <span>Type: {activity.activity_type}</span>
                  <span>Time: {formatDuration(activity.execution_time)}</span>
                  <span>Tokens: {activity.tokens_used}</span>
                  <span>Cost: ${activity.cost.toFixed(4)}</span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
            No activities found for the selected time range.
          </p>
        )}
      </div>
    </div>
  );

  const renderHistory = () => (
    <div>
      <div style={cardStyle}>
        <h2 style={{ marginBottom: '1rem', color: '#111827' }}>Complete Activity History</h2>
        <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
          Historical data and analytics will be displayed here.
          Use the time range filter to view different periods.
        </p>
      </div>
    </div>
  );

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={headerContentStyle}>
          <div>
            <h1 style={titleStyle}>Ultimate Admin Dashboard</h1>
            <p style={subtitleStyle}>
              Complete system monitoring, agent performance, and child activity tracking
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
            {/* Account Filter */}
            <select
              value={selectedAccount || ''}
              onChange={(e) => setSelectedAccount(e.target.value || null)}
              style={selectStyle}
            >
              <option value="">All Accounts</option>
              {data.filterOptions?.accounts?.map((account) => (
                <option key={account.account_id} value={account.account_id}>
                  {account.display_name}
                </option>
              ))}
            </select>
            
            {/* Time Range Filter */}
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              style={selectStyle}
            >
              <option value="5_minutes">Last 5 Minutes</option>
              <option value="10_minutes">Last 10 Minutes</option>
              <option value="1_hour">Last Hour</option>
              <option value="24_hours">Last 24 Hours</option>
              <option value="7_days">Last 7 Days</option>
              <option value="30_days">Last 30 Days</option>
              <option value="all">All Time</option>
            </select>
            
            <button
              onClick={loadAllData}
              style={buttonStyle}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : 'Refresh'}
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div style={{ backgroundColor: '#ffffff', borderBottom: '1px solid #e5e7eb' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 1rem', display: 'flex' }}>
          <button
            style={activeTab === 'overview' ? activeTabStyle : tabStyle}
            onClick={() => setActiveTab('overview')}
          >
            📊 Overview
          </button>
          <button
            style={activeTab === 'agents' ? activeTabStyle : tabStyle}
            onClick={() => setActiveTab('agents')}
          >
            🤖 Agent Performance
          </button>
          <button
            style={activeTab === 'children' ? activeTabStyle : tabStyle}
            onClick={() => setActiveTab('children')}
          >
            👶 Child Activity
          </button>
          <button
            style={activeTab === 'history' ? activeTabStyle : tabStyle}
            onClick={() => setActiveTab('history')}
          >
            📈 History & Analytics
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={contentStyle}>
        {activeTab === 'overview' && renderOverview()}
        {activeTab === 'agents' && renderAgentPerformance()}
        {activeTab === 'children' && renderChildActivity()}
        {activeTab === 'history' && renderHistory()}
      </div>

      {/* Footer */}
      <div style={{ 
        backgroundColor: '#f9fafb', 
        borderTop: '1px solid #e5e7eb', 
        padding: '1rem 0',
        textAlign: 'center',
        fontSize: '0.875rem',
        color: '#6b7280'
      }}>
        Last updated: {lastRefresh.toLocaleString()} | Auto-refresh every 30 seconds
      </div>
    </div>
  );
};

export default UltimateAdminDashboard;
