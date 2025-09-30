import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';

const AccessControl = () => {
  const [user] = useAuthState(auth);
  const [accessData, setAccessData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('7_days');

  useEffect(() => {
    if (user) {
      loadAccessData();
    }
  }, [user, selectedTimeframe]);

  const loadAccessData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8000/api/security/access-control?user_id=${user.uid}&timeframe=${selectedTimeframe}`);
      
      if (!response.ok) {
        throw new Error('Failed to load access control data');
      }

      const data = await response.json();
      setAccessData(data);
    } catch (err) {
      setError(err.message);
      // Fallback to sample data
      setAccessData(getSampleAccessData());
    } finally {
      setIsLoading(false);
    }
  };

  const getSampleAccessData = () => {
    return {
      accessOverview: {
        totalUsers: 1250,
        activeSessions: 89,
        failedLogins: 23,
        blockedIPs: 5,
        lastSecurityScan: "2024-01-22T14:30:00Z"
      },
      activeSessions: [
        {
          sessionId: "session_001",
          userId: "user_123",
          username: "parent_emma",
          device: "Chrome on macOS",
          ipAddress: "192.168.1.50",
          location: "San Francisco, CA",
          userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
          loginTime: "2024-01-22T09:15:00Z",
          lastActivity: "2024-01-22T14:25:00Z",
          status: "active",
          role: "parent",
          permissions: ["read_children", "view_progress", "manage_schedule"]
        },
        {
          sessionId: "session_002",
          userId: "user_456",
          username: "child_alex",
          device: "Safari on iOS",
          ipAddress: "192.168.1.75",
          location: "San Francisco, CA",
          userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)",
          loginTime: "2024-01-22T13:45:00Z",
          lastActivity: "2024-01-22T14:20:00Z",
          status: "active",
          role: "child",
          permissions: ["view_activities", "submit_progress", "earn_achievements"]
        },
        {
          sessionId: "session_003",
          userId: "user_789",
          username: "admin_user",
          device: "Firefox on Windows",
          ipAddress: "192.168.1.100",
          location: "San Francisco, CA",
          userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0)",
          loginTime: "2024-01-22T08:30:00Z",
          lastActivity: "2024-01-22T14:15:00Z",
          status: "active",
          role: "admin",
          permissions: ["full_access", "manage_users", "view_analytics", "system_admin"]
        }
      ],
      failedLogins: [
        {
          attemptId: "attempt_001",
          userId: "user_123",
          username: "parent_emma",
          ipAddress: "192.168.1.100",
          timestamp: "2024-01-22T10:15:00Z",
          reason: "invalid_password",
          userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)",
          location: "San Francisco, CA",
          blocked: true,
          attempts: 3
        },
        {
          attemptId: "attempt_002",
          userId: "unknown",
          username: "hacker_user",
          ipAddress: "203.0.113.45",
          timestamp: "2024-01-22T09:45:00Z",
          reason: "invalid_username",
          userAgent: "curl/7.68.0",
          location: "Unknown",
          blocked: true,
          attempts: 5
        },
        {
          attemptId: "attempt_003",
          userId: "user_456",
          username: "child_alex",
          ipAddress: "192.168.1.75",
          timestamp: "2024-01-21T16:30:00Z",
          reason: "account_locked",
          userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)",
          location: "San Francisco, CA",
          blocked: true,
          attempts: 1
        }
      ],
      blockedIPs: [
        {
          ipAddress: "203.0.113.45",
          reason: "multiple_failed_logins",
          blockedAt: "2024-01-22T09:45:00Z",
          expiresAt: "2024-01-23T09:45:00Z",
          attempts: 15,
          location: "Unknown",
          status: "blocked"
        },
        {
          ipAddress: "198.51.100.23",
          reason: "suspicious_activity",
          blockedAt: "2024-01-21T14:20:00Z",
          expiresAt: "2024-01-24T14:20:00Z",
          attempts: 8,
          location: "Unknown",
          status: "blocked"
        },
        {
          ipAddress: "192.0.2.100",
          reason: "brute_force_attack",
          blockedAt: "2024-01-20T11:30:00Z",
          expiresAt: "2024-01-27T11:30:00Z",
          attempts: 25,
          location: "Unknown",
          status: "blocked"
        }
      ],
      userRoles: {
        admin: {
          count: 5,
          permissions: ["full_access", "manage_users", "view_analytics", "system_admin"],
          description: "Full system access and administration"
        },
        parent: {
          count: 450,
          permissions: ["read_children", "view_progress", "manage_schedule", "view_reports"],
          description: "Parent access to child data and progress"
        },
        child: {
          count: 795,
          permissions: ["view_activities", "submit_progress", "earn_achievements", "view_profile"],
          description: "Child access to learning activities and progress"
        }
      },
      accessMetrics: {
        dailyLogins: [
          { date: "2024-01-16", logins: 45, failures: 2 },
          { date: "2024-01-17", logins: 52, failures: 1 },
          { date: "2024-01-18", logins: 38, failures: 3 },
          { date: "2024-01-19", logins: 61, failures: 1 },
          { date: "2024-01-20", logins: 48, failures: 4 },
          { date: "2024-01-21", logins: 55, failures: 2 },
          { date: "2024-01-22", logins: 42, failures: 3 }
        ],
        sessionDuration: {
          average: "2.5 hours",
          median: "1.8 hours",
          max: "8.2 hours"
        }
      }
    };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'blocked': return '#ef4444';
      case 'expired': return '#6b7280';
      case 'suspended': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin': return '#ef4444';
      case 'parent': return '#3b82f6';
      case 'child': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getReasonColor = (reason) => {
    switch (reason) {
      case 'invalid_password': return '#f59e0b';
      case 'invalid_username': return '#ef4444';
      case 'account_locked': return '#8b5cf6';
      case 'multiple_failed_logins': return '#ef4444';
      case 'suspicious_activity': return '#f59e0b';
      case 'brute_force_attack': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const handleTerminateSession = async (sessionId) => {
    try {
      const response = await fetch('http://localhost:8000/api/security/terminate-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.uid,
          session_id: sessionId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to terminate session');
      }

      // Reload access data after termination
      loadAccessData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleUnblockIP = async (ipAddress) => {
    try {
      const response = await fetch('http://localhost:8000/api/security/unblock-ip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.uid,
          ip_address: ipAddress
        })
      });

      if (!response.ok) {
        throw new Error('Failed to unblock IP');
      }

      // Reload access data after unblocking
      loadAccessData();
    } catch (err) {
      setError(err.message);
    }
  };

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

  const filterStyle = {
    display: 'flex',
    gap: '12px',
    marginBottom: '20px',
    flexWrap: 'wrap'
  };

  const selectStyle = {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    backgroundColor: 'white',
    fontSize: '14px'
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

  const buttonStyle = {
    padding: '6px 12px',
    backgroundColor: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '12px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
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
          Loading access control data...
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
          🔐 Access Control
        </h1>
        <div style={{ fontSize: '14px', color: '#64748b' }}>
          Monitor and manage user access and security
        </div>
      </div>

      {/* Filters */}
      <div style={filterStyle}>
        <select
          value={selectedTimeframe}
          onChange={(e) => setSelectedTimeframe(e.target.value)}
          style={selectStyle}
        >
          <option value="7_days">Last 7 Days</option>
          <option value="30_days">Last 30 Days</option>
          <option value="90_days">Last 90 Days</option>
          <option value="all_time">All Time</option>
        </select>
      </div>

      {/* Access Overview */}
      <div style={gridStyle}>
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            👥 Total Users
          </h3>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '8px' }}>
              {accessData?.accessOverview?.totalUsers || 0}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>
              registered users
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            🔄 Active Sessions
          </h3>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#10b981', marginBottom: '8px' }}>
              {accessData?.accessOverview?.activeSessions || 0}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>
              current sessions
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            ❌ Failed Logins
          </h3>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#ef4444', marginBottom: '8px' }}>
              {accessData?.accessOverview?.failedLogins || 0}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>
              failed attempts
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            🚫 Blocked IPs
          </h3>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#f59e0b', marginBottom: '8px' }}>
              {accessData?.accessOverview?.blockedIPs || 0}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>
              blocked addresses
            </div>
          </div>
        </div>
      </div>

      <div style={gridStyle}>
        {/* Active Sessions */}
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            🔄 Active Sessions
          </h3>
          {accessData?.activeSessions?.map((session, index) => (
            <div key={index} style={{
              padding: '12px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              marginBottom: '8px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                <div>
                  <div style={{ fontWeight: '500', color: '#1e293b' }}>
                    {session.username}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    {session.device}
                  </div>
                </div>
                <span style={{
                  padding: '2px 6px',
                  backgroundColor: getRoleColor(session.role),
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: '500',
                  textTransform: 'capitalize'
                }}>
                  {session.role}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
                <div>{session.ipAddress} • {session.location}</div>
                <div>Last activity: {new Date(session.lastActivity).toLocaleString()}</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  padding: '2px 6px',
                  backgroundColor: getStatusColor(session.status),
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: '500',
                  textTransform: 'capitalize'
                }}>
                  {session.status}
                </span>
                <button
                  style={buttonStyle}
                  onClick={() => handleTerminateSession(session.sessionId)}
                >
                  Terminate
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Failed Logins */}
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            ❌ Failed Logins
          </h3>
          {accessData?.failedLogins?.map((attempt, index) => (
            <div key={index} style={{
              padding: '12px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              marginBottom: '8px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                <div>
                  <div style={{ fontWeight: '500', color: '#1e293b' }}>
                    {attempt.username}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    {attempt.ipAddress} • {attempt.location}
                  </div>
                </div>
                <span style={{
                  padding: '2px 6px',
                  backgroundColor: getReasonColor(attempt.reason),
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: '500',
                  textTransform: 'capitalize'
                }}>
                  {attempt.reason.replace(/_/g, ' ')}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
                <div>{new Date(attempt.timestamp).toLocaleString()}</div>
                <div>Attempts: {attempt.attempts}</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  padding: '2px 6px',
                  backgroundColor: attempt.blocked ? '#ef4444' : '#10b981',
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: '500',
                  textTransform: 'capitalize'
                }}>
                  {attempt.blocked ? 'blocked' : 'allowed'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={gridStyle}>
        {/* Blocked IPs */}
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            🚫 Blocked IPs
          </h3>
          {accessData?.blockedIPs?.map((blocked, index) => (
            <div key={index} style={{
              padding: '12px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              marginBottom: '8px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                <div>
                  <div style={{ fontWeight: '500', color: '#1e293b' }}>
                    {blocked.ipAddress}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    {blocked.location}
                  </div>
                </div>
                <span style={{
                  padding: '2px 6px',
                  backgroundColor: getReasonColor(blocked.reason),
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: '500',
                  textTransform: 'capitalize'
                }}>
                  {blocked.reason.replace(/_/g, ' ')}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
                <div>Blocked: {new Date(blocked.blockedAt).toLocaleString()}</div>
                <div>Expires: {new Date(blocked.expiresAt).toLocaleString()}</div>
                <div>Attempts: {blocked.attempts}</div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  padding: '2px 6px',
                  backgroundColor: getStatusColor(blocked.status),
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: '500',
                  textTransform: 'capitalize'
                }}>
                  {blocked.status}
                </span>
                <button
                  style={{
                    ...buttonStyle,
                    backgroundColor: '#10b981'
                  }}
                  onClick={() => handleUnblockIP(blocked.ipAddress)}
                >
                  Unblock
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* User Roles */}
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            👥 User Roles
          </h3>
          {Object.entries(accessData?.userRoles || {}).map(([role, data]) => (
            <div key={role} style={{
              padding: '12px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              marginBottom: '8px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                <div>
                  <div style={{ fontWeight: '500', color: '#1e293b', textTransform: 'capitalize' }}>
                    {role}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    {data.description}
                  </div>
                </div>
                <span style={{
                  padding: '2px 6px',
                  backgroundColor: getRoleColor(role),
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: '500',
                  textTransform: 'capitalize'
                }}>
                  {data.count} users
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                <div>Permissions: {data.permissions.join(', ')}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Access Metrics Chart */}
      <div style={cardStyle}>
        <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
          📊 Access Metrics (Last 7 Days)
        </h3>
        <div style={{ display: 'flex', alignItems: 'end', gap: '8px', height: '120px', marginBottom: '16px' }}>
          {accessData?.accessMetrics?.dailyLogins?.map((day, index) => (
            <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: '100%',
                height: `${(day.logins / 70) * 100}px`,
                backgroundColor: '#3b82f6',
                borderRadius: '4px 4px 0 0',
                marginBottom: '4px'
              }}></div>
              <div style={{ fontSize: '10px', color: '#64748b' }}>
                {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
              <div style={{ fontSize: '10px', color: '#64748b' }}>
                {day.logins} logins
              </div>
            </div>
          ))}
        </div>
        <div style={{ fontSize: '12px', color: '#64748b' }}>
          <div>Average session duration: {accessData?.accessMetrics?.sessionDuration?.average}</div>
          <div>Median session duration: {accessData?.accessMetrics?.sessionDuration?.median}</div>
          <div>Maximum session duration: {accessData?.accessMetrics?.sessionDuration?.max}</div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default AccessControl;
