import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';

const SecurityDashboard = () => {
  const [user] = useAuthState(auth);
  const [securityData, setSecurityData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('7_days');

  useEffect(() => {
    if (user) {
      loadSecurityData();
    }
  }, [user, selectedTimeframe]);

  const loadSecurityData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8000/api/security/dashboard?user_id=${user.uid}&timeframe=${selectedTimeframe}`);
      
      if (!response.ok) {
        throw new Error('Failed to load security data');
      }

      const data = await response.json();
      setSecurityData(data);
    } catch (err) {
      setError(err.message);
      // Fallback to sample data
      setSecurityData(getSampleSecurityData());
    } finally {
      setIsLoading(false);
    }
  };

  const getSampleSecurityData = () => {
    return {
      securityOverview: {
        totalThreats: 3,
        blockedAttempts: 127,
        dataBreaches: 0,
        encryptionStatus: "active",
        lastSecurityScan: "2024-01-22T14:30:00Z",
        securityScore: 95
      },
      threatDetection: {
        recentThreats: [
          {
            threatId: "threat_001",
            type: "suspicious_login",
            severity: "medium",
            description: "Multiple failed login attempts from unknown IP",
            detectedAt: "2024-01-22T10:15:00Z",
            status: "blocked",
            source: "192.168.1.100",
            userAffected: "child1"
          },
          {
            threatId: "threat_002",
            type: "data_access_anomaly",
            severity: "low",
            description: "Unusual data access pattern detected",
            detectedAt: "2024-01-21T16:45:00Z",
            status: "investigating",
            source: "internal",
            userAffected: "child2"
          },
          {
            threatId: "threat_003",
            type: "malware_detection",
            severity: "high",
            description: "Potential malware signature detected in uploaded file",
            detectedAt: "2024-01-20T09:30:00Z",
            status: "quarantined",
            source: "file_upload",
            userAffected: "child1"
          }
        ],
        threatTypes: {
          "suspicious_login": 45,
          "data_access_anomaly": 32,
          "malware_detection": 8,
          "phishing_attempt": 15,
          "brute_force": 27
        }
      },
      encryptionStatus: {
        dataAtRest: {
          status: "encrypted",
          algorithm: "AES-256",
          coverage: 100,
          lastUpdated: "2024-01-22T12:00:00Z"
        },
        dataInTransit: {
          status: "encrypted",
          protocol: "TLS 1.3",
          coverage: 100,
          lastUpdated: "2024-01-22T12:00:00Z"
        },
        userData: {
          status: "encrypted",
          algorithm: "AES-256",
          coverage: 100,
          lastUpdated: "2024-01-22T12:00:00Z"
        },
        backups: {
          status: "encrypted",
          algorithm: "AES-256",
          coverage: 100,
          lastUpdated: "2024-01-22T12:00:00Z"
        }
      },
      accessControl: {
        activeSessions: [
          {
            sessionId: "session_001",
            userId: "user_123",
            device: "Chrome on macOS",
            ipAddress: "192.168.1.50",
            location: "San Francisco, CA",
            lastActivity: "2024-01-22T14:25:00Z",
            status: "active"
          },
          {
            sessionId: "session_002",
            userId: "user_456",
            device: "Safari on iOS",
            ipAddress: "192.168.1.75",
            location: "San Francisco, CA",
            lastActivity: "2024-01-22T13:45:00Z",
            status: "active"
          }
        ],
        failedLogins: [
          {
            attemptId: "attempt_001",
            userId: "user_123",
            ipAddress: "192.168.1.100",
            timestamp: "2024-01-22T10:15:00Z",
            reason: "invalid_password",
            blocked: true
          },
          {
            attemptId: "attempt_002",
            userId: "user_456",
            ipAddress: "192.168.1.100",
            timestamp: "2024-01-22T10:14:00Z",
            reason: "invalid_password",
            blocked: true
          }
        ]
      },
      complianceStatus: {
        gdpr: {
          status: "compliant",
          lastAudit: "2024-01-15T10:00:00Z",
          nextAudit: "2024-04-15T10:00:00Z",
          issues: 0
        },
        coppa: {
          status: "compliant",
          lastAudit: "2024-01-10T14:00:00Z",
          nextAudit: "2024-04-10T14:00:00Z",
          issues: 0
        },
        fips: {
          status: "compliant",
          lastAudit: "2024-01-05T09:00:00Z",
          nextAudit: "2024-04-05T09:00:00Z",
          issues: 0
        }
      },
      securityMetrics: {
        dailyThreats: [
          { date: "2024-01-16", threats: 2, blocked: 2 },
          { date: "2024-01-17", threats: 5, blocked: 5 },
          { date: "2024-01-18", threats: 1, blocked: 1 },
          { date: "2024-01-19", threats: 3, blocked: 3 },
          { date: "2024-01-20", threats: 4, blocked: 4 },
          { date: "2024-01-21", threats: 2, blocked: 2 },
          { date: "2024-01-22", threats: 3, blocked: 3 }
        ],
        encryptionCoverage: {
          dataAtRest: 100,
          dataInTransit: 100,
          userData: 100,
          backups: 100
        }
      }
    };
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'blocked': return '#ef4444';
      case 'investigating': return '#f59e0b';
      case 'quarantined': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getComplianceColor = (status) => {
    switch (status) {
      case 'compliant': return '#10b981';
      case 'warning': return '#f59e0b';
      case 'non-compliant': return '#ef4444';
      default: return '#6b7280';
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

  const progressBarStyle = {
    width: '100%',
    height: '8px',
    backgroundColor: '#e2e8f0',
    borderRadius: '4px',
    overflow: 'hidden',
    marginBottom: '8px'
  };

  const progressFillStyle = (percentage) => ({
    width: `${percentage}%`,
    height: '100%',
    backgroundColor: '#10b981',
    transition: 'width 0.3s ease'
  });

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
          Loading security dashboard...
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
          🔒 Security Dashboard
        </h1>
        <div style={{ fontSize: '14px', color: '#64748b' }}>
          Monitor and manage security threats and compliance
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

      {/* Security Overview */}
      <div style={gridStyle}>
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            🛡️ Security Score
          </h3>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#10b981', marginBottom: '8px' }}>
              {securityData?.securityOverview?.securityScore || 0}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>
              out of 100
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            🚨 Active Threats
          </h3>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#ef4444', marginBottom: '8px' }}>
              {securityData?.securityOverview?.totalThreats || 0}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>
              threats detected
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            🛡️ Blocked Attempts
          </h3>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '8px' }}>
              {securityData?.securityOverview?.blockedAttempts || 0}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>
              attempts blocked
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            🔐 Encryption Status
          </h3>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#10b981', marginBottom: '8px' }}>
              {securityData?.securityOverview?.encryptionStatus === 'active' ? '✅' : '❌'}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>
              {securityData?.securityOverview?.encryptionStatus || 'unknown'}
            </div>
          </div>
        </div>
      </div>

      <div style={gridStyle}>
        {/* Recent Threats */}
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            🚨 Recent Threats
          </h3>
          {securityData?.threatDetection?.recentThreats?.map((threat, index) => (
            <div key={index} style={{
              padding: '12px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              marginBottom: '8px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                <div style={{ fontWeight: '500', color: '#1e293b' }}>
                  {threat.type.replace(/_/g, ' ').toUpperCase()}
                </div>
                <span style={{
                  padding: '2px 6px',
                  backgroundColor: getSeverityColor(threat.severity),
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: '500',
                  textTransform: 'capitalize'
                }}>
                  {threat.severity}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
                {threat.description}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '10px', color: '#64748b' }}>
                  {new Date(threat.detectedAt).toLocaleDateString()}
                </div>
                <span style={{
                  padding: '2px 6px',
                  backgroundColor: getStatusColor(threat.status),
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: '500',
                  textTransform: 'capitalize'
                }}>
                  {threat.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Encryption Status */}
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            🔐 Encryption Status
          </h3>
          {Object.entries(securityData?.encryptionStatus || {}).map(([key, value]) => (
            <div key={key} style={{ marginBottom: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ fontWeight: '500', color: '#1e293b', textTransform: 'capitalize' }}>
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </div>
                <div style={{
                  padding: '2px 6px',
                  backgroundColor: value.status === 'encrypted' ? '#10b981' : '#ef4444',
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: '500',
                  textTransform: 'capitalize'
                }}>
                  {value.status}
                </div>
              </div>
              <div style={progressBarStyle}>
                <div style={progressFillStyle(value.coverage)}></div>
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                {value.coverage}% coverage • {value.algorithm || value.protocol}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={gridStyle}>
        {/* Active Sessions */}
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            👥 Active Sessions
          </h3>
          {securityData?.accessControl?.activeSessions?.map((session, index) => (
            <div key={index} style={{
              padding: '12px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              marginBottom: '8px'
            }}>
              <div style={{ fontWeight: '500', color: '#1e293b', marginBottom: '4px' }}>
                {session.device}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
                {session.ipAddress} • {session.location}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontSize: '10px', color: '#64748b' }}>
                  Last activity: {new Date(session.lastActivity).toLocaleString()}
                </div>
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
              </div>
            </div>
          ))}
        </div>

        {/* Compliance Status */}
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            📋 Compliance Status
          </h3>
          {Object.entries(securityData?.complianceStatus || {}).map(([key, value]) => (
            <div key={key} style={{
              padding: '12px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              marginBottom: '8px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ fontWeight: '500', color: '#1e293b', textTransform: 'uppercase' }}>
                  {key}
                </div>
                <span style={{
                  padding: '2px 6px',
                  backgroundColor: getComplianceColor(value.status),
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: '500',
                  textTransform: 'capitalize'
                }}>
                  {value.status}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                <div>Last audit: {new Date(value.lastAudit).toLocaleDateString()}</div>
                <div>Next audit: {new Date(value.nextAudit).toLocaleDateString()}</div>
                <div>Issues: {value.issues}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Metrics Chart */}
      <div style={cardStyle}>
        <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
          📊 Security Metrics (Last 7 Days)
        </h3>
        <div style={{ display: 'flex', alignItems: 'end', gap: '8px', height: '120px', marginBottom: '16px' }}>
          {securityData?.securityMetrics?.dailyThreats?.map((day, index) => (
            <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: '100%',
                height: `${(day.threats / 5) * 100}px`,
                backgroundColor: '#ef4444',
                borderRadius: '4px 4px 0 0',
                marginBottom: '4px'
              }}></div>
              <div style={{ fontSize: '10px', color: '#64748b' }}>
                {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
              </div>
              <div style={{ fontSize: '10px', color: '#64748b' }}>
                {day.threats} threats
              </div>
            </div>
          ))}
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

export default SecurityDashboard;
