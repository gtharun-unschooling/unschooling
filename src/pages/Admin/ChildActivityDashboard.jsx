import React, { useState, useEffect } from 'react';

const ChildActivityDashboard = () => {
  const [selectedChild, setSelectedChild] = useState(null);
  const [selectedAccount, setSelectedAccount] = useState(null);
  const [timeRange, setTimeRange] = useState('1_hour');
  const [childActivity, setChildActivity] = useState(null);
  const [allChildren, setAllChildren] = useState(null);
  const [realTimeActivity, setRealTimeActivity] = useState([]);
  const [filterOptions, setFilterOptions] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  // Load filter options
  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/admin/filter-options');
        if (response.ok) {
          const data = await response.json();
          setFilterOptions(data);
        }
      } catch (error) {
        console.error('Error loading filter options:', error);
      }
    };

    loadFilterOptions();
  }, []);

  // Load all children data
  useEffect(() => {
    const loadAllChildren = async () => {
      try {
        const url = selectedAccount 
          ? `http://localhost:8000/api/admin/all-children-activity?account_id=${selectedAccount}`
          : 'http://localhost:8000/api/admin/all-children-activity';
        const response = await fetch(url);
        if (response.ok) {
          const data = await response.json();
          setAllChildren(data);
        }
      } catch (error) {
        console.error('Error loading all children:', error);
      }
    };

    loadAllChildren();
  }, [selectedAccount]);

  // Load real-time activity feed
  useEffect(() => {
    const loadRealTimeActivity = async () => {
      try {
        const response = await fetch(`http://localhost:8000/api/admin/real-time-activity?time_range=${timeRange}`);
        if (response.ok) {
          const data = await response.json();
          setRealTimeActivity(data.activities || []);
        }
      } catch (error) {
        console.error('Error loading real-time activity:', error);
      }
    };

    loadRealTimeActivity();
    
    // Auto-refresh every 10 seconds
    const interval = setInterval(loadRealTimeActivity, 10000);
    return () => clearInterval(interval);
  }, [timeRange]);

  // Load specific child activity
  const loadChildActivity = async (childId) => {
    if (!childId) return;
    
    setIsLoading(true);
    try {
      const url = selectedAccount 
        ? `http://localhost:8000/api/admin/child-activity/${childId}?time_range=${timeRange}&account_id=${selectedAccount}`
        : `http://localhost:8000/api/admin/child-activity/${childId}?time_range=${timeRange}`;
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        setChildActivity(data);
        setSelectedChild(childId);
      }
    } catch (error) {
      console.error('Error loading child activity:', error);
    } finally {
      setIsLoading(false);
      setLastRefresh(new Date());
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
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '1rem',
    marginBottom: '1.5rem'
  };

  const activityItemStyle = {
    padding: '1rem',
    border: '1px solid #e5e7eb',
    borderRadius: '0.375rem',
    marginBottom: '0.5rem',
    backgroundColor: '#ffffff'
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

  return (
    <div style={containerStyle}>
      {/* Header */}
      <div style={headerStyle}>
        <div style={headerContentStyle}>
          <div>
            <h1 style={titleStyle}>Child Activity Dashboard</h1>
            <p style={subtitleStyle}>
              Real-time tracking of all child activities and agent interactions
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
              {filterOptions?.accounts?.map((account) => (
                <option key={account.account_id} value={account.account_id}>
                  {account.display_name}
                </option>
              ))}
            </select>
            
            {/* Child Filter */}
            <select
              value={selectedChild || ''}
              onChange={(e) => {
                const childId = e.target.value;
                if (childId) {
                  loadChildActivity(childId);
                } else {
                  setSelectedChild(null);
                  setChildActivity(null);
                }
              }}
              style={selectStyle}
            >
              <option value="">Select Child</option>
              {filterOptions?.children?.map((child) => (
                <option key={child.child_id} value={child.child_id}>
                  {child.child_name} ({child.total_activities} activities)
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
              onClick={() => window.location.reload()}
              style={buttonStyle}
            >
              Refresh
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={contentStyle}>
        {/* All Children Overview */}
        {allChildren && (
          <div style={cardStyle}>
            <h2 style={{ marginBottom: '1rem', color: '#111827' }}>
              All Children Overview ({getTimeRangeLabel(timeRange)})
            </h2>
            
            <div style={gridStyle}>
              <div style={metricStyle}>
                <div style={metricValueStyle}>{allChildren.total_children}</div>
                <div style={metricLabelStyle}>Total Children</div>
              </div>
              <div style={metricStyle}>
                <div style={metricValueStyle}>{allChildren.global_stats?.total_activities || 0}</div>
                <div style={metricLabelStyle}>Total Activities</div>
              </div>
              <div style={metricStyle}>
                <div style={metricValueStyle}>{allChildren.global_stats?.total_tokens || 0}</div>
                <div style={metricLabelStyle}>Total Tokens</div>
              </div>
              <div style={metricStyle}>
                <div style={metricValueStyle}>${(allChildren.global_stats?.total_cost || 0).toFixed(2)}</div>
                <div style={metricLabelStyle}>Total Cost</div>
              </div>
            </div>

            {/* Children List */}
            <h3 style={{ marginBottom: '1rem', color: '#111827' }}>
              Children {selectedAccount ? `(Filtered by Account)` : ''}
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
              {Object.entries(allChildren.children || {}).map(([childId, childData]) => (
                <div
                  key={childId}
                  style={{
                    ...activityItemStyle,
                    cursor: 'pointer',
                    border: selectedChild === childId ? '2px solid #2563eb' : '1px solid #e5e7eb'
                  }}
                  onClick={() => loadChildActivity(childId)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h4 style={{ margin: 0, color: '#111827' }}>{childData.child_name}</h4>
                    <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                      {formatTime(childData.last_activity)}
                    </span>
                  </div>
                  
                  {/* Account Information */}
                  {childData.account_info && (
                    <div style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                      Account: {childData.account_info.account_email || childData.account_info.account_id}
                    </div>
                  )}
                  
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
          
          {realTimeActivity.length > 0 ? (
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {realTimeActivity.map((activity, index) => (
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
                  
                  {activity.details && (
                    <div style={{ marginTop: '0.5rem', fontSize: '0.875rem', color: '#6b7280' }}>
                      <details>
                        <summary style={{ cursor: 'pointer' }}>Details</summary>
                        <pre style={{ marginTop: '0.5rem', fontSize: '0.75rem', backgroundColor: '#f9fafb', padding: '0.5rem', borderRadius: '0.25rem', overflow: 'auto' }}>
                          {JSON.stringify(activity.details, null, 2)}
                        </pre>
                      </details>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p style={{ color: '#6b7280', textAlign: 'center', padding: '2rem' }}>
              No activities found for the selected time range.
            </p>
          )}
        </div>

        {/* Selected Child Details */}
        {childActivity && !childActivity.error && (
          <div style={cardStyle}>
            <h2 style={{ marginBottom: '1rem', color: '#111827' }}>
              {childActivity.child_info?.child_name} - Detailed Activity ({getTimeRangeLabel(timeRange)})
            </h2>
            
            {/* Child Summary */}
            <div style={gridStyle}>
              <div style={metricStyle}>
                <div style={metricValueStyle}>{childActivity.summary?.total_activities || 0}</div>
                <div style={metricLabelStyle}>Total Activities</div>
              </div>
              <div style={metricStyle}>
                <div style={metricValueStyle}>{childActivity.summary?.total_tokens || 0}</div>
                <div style={metricLabelStyle}>Total Tokens</div>
              </div>
              <div style={metricStyle}>
                <div style={metricValueStyle}>${(childActivity.summary?.total_cost || 0).toFixed(2)}</div>
                <div style={metricLabelStyle}>Total Cost</div>
              </div>
              <div style={metricStyle}>
                <div style={metricValueStyle}>{childActivity.summary?.success_rate?.toFixed(1) || 0}%</div>
                <div style={metricLabelStyle}>Success Rate</div>
              </div>
            </div>

            {/* Agent Breakdown */}
            {childActivity.agent_breakdown && Object.keys(childActivity.agent_breakdown).length > 0 && (
              <div>
                <h3 style={{ marginBottom: '1rem', color: '#111827' }}>Agent Performance</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                  {Object.entries(childActivity.agent_breakdown).map(([agent, data]) => (
                    <div key={agent} style={metricStyle}>
                      <div style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '0.5rem' }}>{agent}</div>
                      <div style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                        <div>Calls: {data.calls}</div>
                        <div>Tokens: {data.tokens}</div>
                        <div>Cost: ${data.cost.toFixed(3)}</div>
                        <div>Time: {formatDuration(data.execution_time)}</div>
                        <div>Success: {data.success_rate.toFixed(1)}%</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recent Activities */}
            {childActivity.recent_activities && childActivity.recent_activities.length > 0 && (
              <div>
                <h3 style={{ marginBottom: '1rem', color: '#111827' }}>Recent Activities</h3>
                <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                  {childActivity.recent_activities.map((activity, index) => (
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
                          <span style={{ fontWeight: '500' }}>{activity.action}</span>
                        </div>
                        <span style={{ fontSize: '0.75rem', color: '#6b7280' }}>
                          {formatTime(activity.timestamp)}
                        </span>
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
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ChildActivityDashboard;
