import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';

const ThreatDetection = () => {
  const [user] = useAuthState(auth);
  const [threatData, setThreatData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState('7_days');
  const [selectedSeverity, setSelectedSeverity] = useState('all');

  useEffect(() => {
    if (user) {
      loadThreatData();
    }
  }, [user, selectedTimeframe, selectedSeverity]);

  const loadThreatData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8000/api/security/threat-detection?user_id=${user.uid}&timeframe=${selectedTimeframe}&severity=${selectedSeverity}`);
      
      if (!response.ok) {
        throw new Error('Failed to load threat detection data');
      }

      const data = await response.json();
      setThreatData(data);
    } catch (err) {
      setError(err.message);
      // Fallback to sample data
      setThreatData(getSampleThreatData());
    } finally {
      setIsLoading(false);
    }
  };

  const getSampleThreatData = () => {
    return {
      threatOverview: {
        totalThreats: 23,
        highSeverity: 3,
        mediumSeverity: 8,
        lowSeverity: 12,
        blockedThreats: 20,
        activeThreats: 3,
        lastScan: "2024-01-22T14:30:00Z"
      },
      recentThreats: [
        {
          threatId: "threat_001",
          type: "suspicious_login",
          severity: "high",
          title: "Multiple Failed Login Attempts",
          description: "Detected 15 failed login attempts from IP 203.0.113.45 within 5 minutes",
          source: "203.0.113.45",
          target: "user_123",
          detectedAt: "2024-01-22T10:15:00Z",
          status: "blocked",
          confidence: 95,
          impact: "account_compromise",
          mitigation: "IP blocked, account locked",
          affectedUsers: ["user_123"],
          indicators: ["multiple_failed_logins", "unusual_ip", "rapid_attempts"]
        },
        {
          threatId: "threat_002",
          type: "malware_detection",
          severity: "high",
          title: "Malware Signature Detected",
          description: "Potential malware signature detected in uploaded file: homework.pdf",
          source: "file_upload",
          target: "child1",
          detectedAt: "2024-01-22T09:30:00Z",
          status: "quarantined",
          confidence: 88,
          impact: "system_infection",
          mitigation: "File quarantined, user notified",
          affectedUsers: ["child1"],
          indicators: ["malware_signature", "suspicious_file", "unusual_behavior"]
        },
        {
          threatId: "threat_003",
          type: "data_access_anomaly",
          severity: "medium",
          title: "Unusual Data Access Pattern",
          description: "User accessed 50+ child profiles in 10 minutes, unusual for normal usage",
          source: "internal",
          target: "user_456",
          detectedAt: "2024-01-21T16:45:00Z",
          status: "investigating",
          confidence: 75,
          impact: "data_breach",
          mitigation: "Access restricted, investigation ongoing",
          affectedUsers: ["user_456"],
          indicators: ["unusual_access_pattern", "bulk_data_access", "off_hours_activity"]
        },
        {
          threatId: "threat_004",
          type: "phishing_attempt",
          severity: "medium",
          title: "Phishing Email Detected",
          description: "Suspicious email with malicious link detected in user inbox",
          source: "email",
          target: "parent_emma",
          detectedAt: "2024-01-21T14:20:00Z",
          status: "blocked",
          confidence: 82,
          impact: "credential_theft",
          mitigation: "Email blocked, user warned",
          affectedUsers: ["parent_emma"],
          indicators: ["suspicious_link", "phishing_content", "unknown_sender"]
        },
        {
          threatId: "threat_005",
          type: "brute_force",
          severity: "high",
          title: "Brute Force Attack",
          description: "Automated brute force attack detected on admin panel",
          source: "198.51.100.23",
          target: "admin_panel",
          detectedAt: "2024-01-20T11:30:00Z",
          status: "blocked",
          confidence: 92,
          impact: "system_compromise",
          mitigation: "IP blocked, rate limiting enabled",
          affectedUsers: ["admin_users"],
          indicators: ["rapid_requests", "automated_pattern", "admin_targeting"]
        }
      ],
      threatTypes: {
        "suspicious_login": {
          count: 8,
          severity: "medium",
          description: "Unusual login patterns or failed attempts"
        },
        "malware_detection": {
          count: 3,
          severity: "high",
          description: "Malicious software or files detected"
        },
        "data_access_anomaly": {
          count: 5,
          severity: "medium",
          description: "Unusual data access patterns"
        },
        "phishing_attempt": {
          count: 4,
          severity: "medium",
          description: "Phishing emails or malicious links"
        },
        "brute_force": {
          count: 3,
          severity: "high",
          description: "Automated attack attempts"
        }
      },
      threatMetrics: {
        dailyThreats: [
          { date: "2024-01-16", threats: 2, blocked: 2, severity: { high: 0, medium: 1, low: 1 } },
          { date: "2024-01-17", threats: 5, blocked: 5, severity: { high: 1, medium: 2, low: 2 } },
          { date: "2024-01-18", threats: 1, blocked: 1, severity: { high: 0, medium: 0, low: 1 } },
          { date: "2024-01-19", threats: 3, blocked: 3, severity: { high: 0, medium: 2, low: 1 } },
          { date: "2024-01-20", threats: 4, blocked: 4, severity: { high: 1, medium: 1, low: 2 } },
          { date: "2024-01-21", threats: 2, blocked: 2, severity: { high: 0, medium: 1, low: 1 } },
          { date: "2024-01-22", threats: 6, blocked: 5, severity: { high: 2, medium: 2, low: 2 } }
        ],
        threatSources: {
          "external_ip": 12,
          "internal_user": 6,
          "file_upload": 3,
          "email": 2
        }
      },
      securityRules: [
        {
          ruleId: "rule_001",
          name: "Failed Login Protection",
          description: "Block IP after 5 failed login attempts",
          status: "active",
          lastTriggered: "2024-01-22T10:15:00Z",
          triggerCount: 8
        },
        {
          ruleId: "rule_002",
          name: "Malware Detection",
          description: "Scan uploaded files for malware signatures",
          status: "active",
          lastTriggered: "2024-01-22T09:30:00Z",
          triggerCount: 3
        },
        {
          ruleId: "rule_003",
          name: "Data Access Monitoring",
          description: "Alert on unusual data access patterns",
          status: "active",
          lastTriggered: "2024-01-21T16:45:00Z",
          triggerCount: 5
        },
        {
          ruleId: "rule_004",
          name: "Phishing Protection",
          description: "Block suspicious emails and links",
          status: "active",
          lastTriggered: "2024-01-21T14:20:00Z",
          triggerCount: 4
        }
      ]
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
      case 'blocked': return '#10b981';
      case 'quarantined': return '#8b5cf6';
      case 'investigating': return '#f59e0b';
      case 'active': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'suspicious_login': return '🔐';
      case 'malware_detection': return '🦠';
      case 'data_access_anomaly': return '📊';
      case 'phishing_attempt': return '🎣';
      case 'brute_force': return '💥';
      default: return '⚠️';
    }
  };

  const handleAcknowledgeThreat = async (threatId) => {
    try {
      const response = await fetch('http://localhost:8000/api/security/acknowledge-threat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.uid,
          threat_id: threatId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to acknowledge threat');
      }

      // Reload threat data after acknowledgment
      loadThreatData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleBlockThreat = async (threatId) => {
    try {
      const response = await fetch('http://localhost:8000/api/security/block-threat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.uid,
          threat_id: threatId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to block threat');
      }

      // Reload threat data after blocking
      loadThreatData();
    } catch (err) {
      setError(err.message);
    }
  };

  const filteredThreats = threatData?.recentThreats?.filter(threat => {
    return selectedSeverity === 'all' || threat.severity === selectedSeverity;
  }) || [];

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
    backgroundColor: '#3b82f6',
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
          Loading threat detection data...
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
          🚨 Threat Detection
        </h1>
        <div style={{ fontSize: '14px', color: '#64748b' }}>
          Monitor and respond to security threats
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

        <select
          value={selectedSeverity}
          onChange={(e) => setSelectedSeverity(e.target.value)}
          style={selectStyle}
        >
          <option value="all">All Severities</option>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </div>

      {/* Threat Overview */}
      <div style={gridStyle}>
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            🚨 Total Threats
          </h3>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#ef4444', marginBottom: '8px' }}>
              {threatData?.threatOverview?.totalThreats || 0}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>
              threats detected
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            🛡️ Blocked Threats
          </h3>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#10b981', marginBottom: '8px' }}>
              {threatData?.threatOverview?.blockedThreats || 0}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>
              threats blocked
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            ⚠️ Active Threats
          </h3>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#f59e0b', marginBottom: '8px' }}>
              {threatData?.threatOverview?.activeThreats || 0}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>
              threats active
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            🔍 Last Scan
          </h3>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '8px' }}>
              {new Date(threatData?.threatOverview?.lastScan || Date.now()).toLocaleTimeString()}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>
              {new Date(threatData?.threatOverview?.lastScan || Date.now()).toLocaleDateString()}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Threats */}
      <div style={cardStyle}>
        <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
          🚨 Recent Threats ({filteredThreats.length})
        </h3>
        {filteredThreats.map((threat, index) => (
          <div key={index} style={{
            padding: '16px',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            marginBottom: '12px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ fontSize: '24px' }}>{getTypeIcon(threat.type)}</div>
                <div>
                  <div style={{ fontWeight: '500', color: '#1e293b', marginBottom: '4px' }}>
                    {threat.title}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    {threat.description}
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{
                  padding: '2px 8px',
                  backgroundColor: getSeverityColor(threat.severity),
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: '500',
                  textTransform: 'capitalize'
                }}>
                  {threat.severity}
                </span>
                <span style={{
                  padding: '2px 8px',
                  backgroundColor: getStatusColor(threat.status),
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: '500',
                  textTransform: 'capitalize'
                }}>
                  {threat.status}
                </span>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '12px' }}>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '500', color: '#1e293b' }}>Source</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>{threat.source}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '500', color: '#1e293b' }}>Target</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>{threat.target}</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '500', color: '#1e293b' }}>Confidence</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>{threat.confidence}%</div>
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '500', color: '#1e293b' }}>Impact</div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>{threat.impact.replace(/_/g, ' ')}</div>
              </div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', fontWeight: '500', color: '#1e293b', marginBottom: '4px' }}>Mitigation</div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>{threat.mitigation}</div>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '12px', fontWeight: '500', color: '#1e293b', marginBottom: '4px' }}>Indicators</div>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {threat.indicators.map((indicator, idx) => (
                  <span key={idx} style={{
                    padding: '2px 6px',
                    backgroundColor: '#f1f5f9',
                    color: '#64748b',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: '500'
                  }}>
                    {indicator.replace(/_/g, ' ')}
                  </span>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                Detected: {new Date(threat.detectedAt).toLocaleString()}
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <button
                  style={buttonStyle}
                  onClick={() => handleAcknowledgeThreat(threat.threatId)}
                >
                  Acknowledge
                </button>
                <button
                  style={{
                    ...buttonStyle,
                    backgroundColor: '#ef4444'
                  }}
                  onClick={() => handleBlockThreat(threat.threatId)}
                >
                  Block
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div style={gridStyle}>
        {/* Threat Types */}
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            📊 Threat Types
          </h3>
          {Object.entries(threatData?.threatTypes || {}).map(([type, data]) => (
            <div key={type} style={{
              padding: '12px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              marginBottom: '8px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                <div>
                  <div style={{ fontWeight: '500', color: '#1e293b', textTransform: 'capitalize' }}>
                    {type.replace(/_/g, ' ')}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    {data.description}
                  </div>
                </div>
                <span style={{
                  padding: '2px 6px',
                  backgroundColor: getSeverityColor(data.severity),
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: '500',
                  textTransform: 'capitalize'
                }}>
                  {data.severity}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                Count: {data.count}
              </div>
            </div>
          ))}
        </div>

        {/* Security Rules */}
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            🛡️ Security Rules
          </h3>
          {threatData?.securityRules?.map((rule, index) => (
            <div key={index} style={{
              padding: '12px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              marginBottom: '8px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                <div>
                  <div style={{ fontWeight: '500', color: '#1e293b' }}>
                    {rule.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    {rule.description}
                  </div>
                </div>
                <span style={{
                  padding: '2px 6px',
                  backgroundColor: rule.status === 'active' ? '#10b981' : '#6b7280',
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: '500',
                  textTransform: 'capitalize'
                }}>
                  {rule.status}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                <div>Last triggered: {new Date(rule.lastTriggered).toLocaleString()}</div>
                <div>Trigger count: {rule.triggerCount}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Threat Metrics Chart */}
      <div style={cardStyle}>
        <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
          📊 Threat Metrics (Last 7 Days)
        </h3>
        <div style={{ display: 'flex', alignItems: 'end', gap: '8px', height: '120px', marginBottom: '16px' }}>
          {threatData?.threatMetrics?.dailyThreats?.map((day, index) => (
            <div key={index} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{
                width: '100%',
                height: `${(day.threats / 10) * 100}px`,
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

export default ThreatDetection;
