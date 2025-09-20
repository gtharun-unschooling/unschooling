import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';

const PrivacyManagement = () => {
  const [user] = useAuthState(auth);
  const [privacyData, setPrivacyData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    if (user) {
      loadPrivacyData();
    }
  }, [user, selectedCategory]);

  const loadPrivacyData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8000/api/compliance/privacy-management?user_id=${user.uid}&category=${selectedCategory}`);
      
      if (!response.ok) {
        throw new Error('Failed to load privacy management data');
      }

      const data = await response.json();
      setPrivacyData(data);
    } catch (err) {
      setError(err.message);
      // Fallback to sample data
      setPrivacyData(getSamplePrivacyData());
    } finally {
      setIsLoading(false);
    }
  };

  const getSamplePrivacyData = () => {
    return {
      privacyOverview: {
        totalUsers: 1250,
        consentRate: 94.4,
        dataRetentionCompliance: 100,
        privacyPolicyUpdates: 3,
        lastPrivacyReview: "2024-01-15T10:00:00Z"
      },
      consentManagement: {
        consentTypes: [
          {
            id: "consent_001",
            type: "learning_analytics",
            title: "Learning Analytics",
            description: "Collect and analyze learning progress and performance data",
            required: true,
            users: 1180,
            consentRate: 94.4,
            lastUpdated: "2024-01-20T10:00:00Z",
            legalBasis: "consent"
          },
          {
            id: "consent_002",
            type: "marketing_communications",
            title: "Marketing Communications",
            description: "Send promotional emails and notifications about new features",
            required: false,
            users: 950,
            consentRate: 76.0,
            lastUpdated: "2024-01-20T10:00:00Z",
            legalBasis: "consent"
          },
          {
            id: "consent_003",
            type: "data_sharing",
            title: "Data Sharing",
            description: "Share anonymized data with educational research partners",
            required: false,
            users: 800,
            consentRate: 64.0,
            lastUpdated: "2024-01-20T10:00:00Z",
            legalBasis: "consent"
          },
          {
            id: "consent_004",
            type: "cookies",
            title: "Cookies and Tracking",
            description: "Use cookies for analytics and personalization",
            required: true,
            users: 1250,
            consentRate: 100.0,
            lastUpdated: "2024-01-20T10:00:00Z",
            legalBasis: "consent"
          }
        ],
        consentHistory: [
          {
            id: "history_001",
            userId: "user_123",
            consentType: "learning_analytics",
            action: "granted",
            timestamp: "2024-01-22T14:30:00Z",
            ipAddress: "192.168.1.50",
            userAgent: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7)"
          },
          {
            id: "history_002",
            userId: "user_456",
            consentType: "marketing_communications",
            action: "withdrawn",
            timestamp: "2024-01-22T13:45:00Z",
            ipAddress: "192.168.1.75",
            userAgent: "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)"
          },
          {
            id: "history_003",
            userId: "user_789",
            consentType: "data_sharing",
            action: "granted",
            timestamp: "2024-01-22T12:20:00Z",
            ipAddress: "192.168.1.100",
            userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
          }
        ]
      },
      dataRetention: {
        policies: [
          {
            id: "retention_001",
            dataType: "user_profiles",
            retentionPeriod: "7 years after account closure",
            legalBasis: "contract",
            description: "User profile data retained for customer service and legal compliance",
            lastReview: "2024-01-15T10:00:00Z",
            nextReview: "2024-04-15T10:00:00Z"
          },
          {
            id: "retention_002",
            dataType: "learning_data",
            retentionPeriod: "5 years after last activity",
            legalBasis: "legitimate_interest",
            description: "Learning progress and performance data for educational insights",
            lastReview: "2024-01-15T10:00:00Z",
            nextReview: "2024-04-15T10:00:00Z"
          },
          {
            id: "retention_003",
            dataType: "security_logs",
            retentionPeriod: "2 years",
            legalBasis: "legitimate_interest",
            description: "Security and access logs for threat detection and compliance",
            lastReview: "2024-01-15T10:00:00Z",
            nextReview: "2024-04-15T10:00:00Z"
          },
          {
            id: "retention_004",
            dataType: "analytics_data",
            retentionPeriod: "3 years",
            legalBasis: "consent",
            description: "Analytics and usage data for product improvement",
            lastReview: "2024-01-15T10:00:00Z",
            nextReview: "2024-04-15T10:00:00Z"
          },
          {
            id: "retention_005",
            dataType: "media_files",
            retentionPeriod: "5 years after last access",
            legalBasis: "consent",
            description: "User-uploaded images and videos",
            lastReview: "2024-01-15T10:00:00Z",
            nextReview: "2024-04-15T10:00:00Z"
          }
        ],
        scheduledDeletions: [
          {
            id: "deletion_001",
            dataType: "user_profiles",
            records: 15,
            scheduledDate: "2024-02-15T00:00:00Z",
            reason: "Account closure + 7 years",
            status: "scheduled"
          },
          {
            id: "deletion_002",
            dataType: "learning_data",
            records: 45,
            scheduledDate: "2024-02-20T00:00:00Z",
            reason: "Last activity + 5 years",
            status: "scheduled"
          },
          {
            id: "deletion_003",
            dataType: "security_logs",
            records: 1200,
            scheduledDate: "2024-02-25T00:00:00Z",
            reason: "2 year retention period",
            status: "scheduled"
          }
        ]
      },
      dataSubjectRights: {
        requests: [
          {
            id: "request_001",
            userId: "user_123",
            requestType: "access",
            status: "completed",
            submittedAt: "2024-01-20T14:30:00Z",
            completedAt: "2024-01-21T09:15:00Z",
            description: "User requested access to all personal data",
            dataProvided: ["profile_data", "learning_data", "analytics_data"],
            responseTime: "18 hours 45 minutes"
          },
          {
            id: "request_002",
            userId: "user_456",
            requestType: "deletion",
            status: "in_progress",
            submittedAt: "2024-01-22T10:45:00Z",
            completedAt: null,
            description: "User requested deletion of account and all data",
            dataProvided: [],
            responseTime: null
          },
          {
            id: "request_003",
            userId: "user_789",
            requestType: "rectification",
            status: "completed",
            submittedAt: "2024-01-19T16:20:00Z",
            completedAt: "2024-01-19T17:30:00Z",
            description: "User requested correction of personal information",
            dataProvided: ["updated_profile_data"],
            responseTime: "1 hour 10 minutes"
          },
          {
            id: "request_004",
            userId: "user_101",
            requestType: "portability",
            status: "completed",
            submittedAt: "2024-01-18T11:30:00Z",
            completedAt: "2024-01-18T15:45:00Z",
            description: "User requested data export in machine-readable format",
            dataProvided: ["json_export", "csv_export"],
            responseTime: "4 hours 15 minutes"
          }
        ],
        averageResponseTime: "6 hours 12 minutes",
        complianceRate: 100
      },
      privacyPolicies: {
        currentVersion: "3.2",
        lastUpdated: "2024-01-15T10:00:00Z",
        nextReview: "2024-04-15T10:00:00Z",
        versions: [
          {
            version: "3.2",
            date: "2024-01-15T10:00:00Z",
            changes: ["Updated data retention policies", "Added new consent types", "Clarified data sharing practices"],
            usersNotified: 1250
          },
          {
            version: "3.1",
            date: "2023-10-15T10:00:00Z",
            changes: ["Updated GDPR compliance section", "Added COPPA requirements", "Enhanced user rights information"],
            usersNotified: 1200
          },
          {
            version: "3.0",
            date: "2023-07-15T10:00:00Z",
            changes: ["Major privacy policy overhaul", "Added new data processing activities", "Updated consent management"],
            usersNotified: 1100
          }
        ]
      }
    };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'in_progress': return '#f59e0b';
      case 'pending': return '#6b7280';
      case 'scheduled': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getActionColor = (action) => {
    switch (action) {
      case 'granted': return '#10b981';
      case 'withdrawn': return '#ef4444';
      case 'updated': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getRequestTypeColor = (type) => {
    switch (type) {
      case 'access': return '#3b82f6';
      case 'deletion': return '#ef4444';
      case 'rectification': return '#f59e0b';
      case 'portability': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const handleUpdateConsent = async (consentId, action) => {
    try {
      const response = await fetch('http://localhost:8000/api/compliance/update-consent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.uid,
          consent_id: consentId,
          action: action
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update consent');
      }

      // Reload privacy data after update
      loadPrivacyData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleProcessDataRequest = async (requestId, action) => {
    try {
      const response = await fetch('http://localhost:8000/api/compliance/process-data-request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.uid,
          request_id: requestId,
          action: action
        })
      });

      if (!response.ok) {
        throw new Error('Failed to process data request');
      }

      // Reload privacy data after processing
      loadPrivacyData();
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
          Loading privacy management data...
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
          🔒 Privacy Management
        </h1>
        <div style={{ fontSize: '14px', color: '#64748b' }}>
          Manage user consent, data retention, and privacy rights
        </div>
      </div>

      {/* Filters */}
      <div style={filterStyle}>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          style={selectStyle}
        >
          <option value="all">All Categories</option>
          <option value="consent">Consent Management</option>
          <option value="retention">Data Retention</option>
          <option value="rights">Data Subject Rights</option>
          <option value="policies">Privacy Policies</option>
        </select>
      </div>

      {/* Privacy Overview */}
      <div style={gridStyle}>
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            👥 Total Users
          </h3>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '8px' }}>
              {privacyData?.privacyOverview?.totalUsers || 0}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>
              registered users
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            ✅ Consent Rate
          </h3>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#10b981', marginBottom: '8px' }}>
              {privacyData?.privacyOverview?.consentRate || 0}%
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>
              average consent rate
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            📋 Data Retention Compliance
          </h3>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#10b981', marginBottom: '8px' }}>
              {privacyData?.privacyOverview?.dataRetentionCompliance || 0}%
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>
              compliance rate
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            📄 Policy Updates
          </h3>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#f59e0b', marginBottom: '8px' }}>
              {privacyData?.privacyOverview?.privacyPolicyUpdates || 0}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>
              this year
            </div>
          </div>
        </div>
      </div>

      {/* Consent Management */}
      <div style={cardStyle}>
        <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
          ✅ Consent Management
        </h3>
        <div style={gridStyle}>
          {privacyData?.consentManagement?.consentTypes?.map((consent, index) => (
            <div key={index} style={{
              padding: '16px',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              marginBottom: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontWeight: '500', color: '#1e293b', marginBottom: '4px' }}>
                    {consent.title}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    {consent.description}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <span style={{
                    padding: '2px 6px',
                    backgroundColor: consent.required ? '#ef4444' : '#6b7280',
                    color: 'white',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: '500',
                    textTransform: 'capitalize'
                  }}>
                    {consent.required ? 'required' : 'optional'}
                  </span>
                </div>
              </div>
              <div style={progressBarStyle}>
                <div style={progressFillStyle(consent.consentRate)}></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  {consent.users} users • {consent.consentRate}% consent rate
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  {consent.legalBasis}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={gridStyle}>
        {/* Data Retention Policies */}
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            📅 Data Retention Policies
          </h3>
          {privacyData?.dataRetention?.policies?.map((policy, index) => (
            <div key={index} style={{
              padding: '12px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              marginBottom: '8px'
            }}>
              <div style={{ fontWeight: '500', color: '#1e293b', marginBottom: '4px' }}>
                {policy.dataType.replace(/_/g, ' ').toUpperCase()}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
                {policy.description}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
                Retention: {policy.retentionPeriod}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                Legal basis: {policy.legalBasis.replace(/_/g, ' ')}
              </div>
            </div>
          ))}
        </div>

        {/* Data Subject Rights */}
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            👤 Data Subject Rights
          </h3>
          {privacyData?.dataSubjectRights?.requests?.map((request, index) => (
            <div key={index} style={{
              padding: '12px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              marginBottom: '8px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                <div>
                  <div style={{ fontWeight: '500', color: '#1e293b', marginBottom: '4px' }}>
                    {request.requestType.toUpperCase()}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    {request.description}
                  </div>
                </div>
                <span style={{
                  padding: '2px 6px',
                  backgroundColor: getStatusColor(request.status),
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: '500',
                  textTransform: 'capitalize'
                }}>
                  {request.status}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
                <div>Submitted: {new Date(request.submittedAt).toLocaleString()}</div>
                {request.completedAt && (
                  <div>Completed: {new Date(request.completedAt).toLocaleString()}</div>
                )}
                {request.responseTime && (
                  <div>Response time: {request.responseTime}</div>
                )}
              </div>
              {request.dataProvided.length > 0 && (
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  Data provided: {request.dataProvided.join(', ')}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Privacy Policy Versions */}
      <div style={cardStyle}>
        <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
          📄 Privacy Policy Versions
        </h3>
        <div style={{ marginBottom: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <div style={{ fontWeight: '500', color: '#1e293b' }}>
              Current Version: {privacyData?.privacyPolicies?.currentVersion}
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              Last updated: {new Date(privacyData?.privacyPolicies?.lastUpdated || Date.now()).toLocaleDateString()}
            </div>
          </div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>
            Next review: {new Date(privacyData?.privacyPolicies?.nextReview || Date.now()).toLocaleDateString()}
          </div>
        </div>
        {privacyData?.privacyPolicies?.versions?.map((version, index) => (
          <div key={index} style={{
            padding: '12px',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            marginBottom: '8px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
              <div>
                <div style={{ fontWeight: '500', color: '#1e293b', marginBottom: '4px' }}>
                  Version {version.version}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  {new Date(version.date).toLocaleDateString()}
                </div>
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                {version.usersNotified} users notified
              </div>
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              <div style={{ fontWeight: '500', marginBottom: '4px' }}>Changes:</div>
              <ul style={{ margin: '0', paddingLeft: '16px' }}>
                {version.changes.map((change, idx) => (
                  <li key={idx}>{change}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
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

export default PrivacyManagement;
