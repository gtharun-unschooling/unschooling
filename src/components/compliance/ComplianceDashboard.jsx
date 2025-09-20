import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';

const ComplianceDashboard = () => {
  const [user] = useAuthState(auth);
  const [complianceData, setComplianceData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStandard, setSelectedStandard] = useState('all');

  useEffect(() => {
    if (user) {
      loadComplianceData();
    }
  }, [user, selectedStandard]);

  const loadComplianceData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8000/api/compliance/dashboard?user_id=${user.uid}&standard=${selectedStandard}`);
      
      if (!response.ok) {
        throw new Error('Failed to load compliance data');
      }

      const data = await response.json();
      setComplianceData(data);
    } catch (err) {
      setError(err.message);
      // Fallback to sample data
      setComplianceData(getSampleComplianceData());
    } finally {
      setIsLoading(false);
    }
  };

  const getSampleComplianceData = () => {
    return {
      complianceOverview: {
        overallScore: 92,
        totalStandards: 4,
        compliantStandards: 4,
        nonCompliantStandards: 0,
        lastAudit: "2024-01-15T10:00:00Z",
        nextAudit: "2024-04-15T10:00:00Z"
      },
      standards: {
        gdpr: {
          name: "General Data Protection Regulation",
          status: "compliant",
          score: 95,
          lastAudit: "2024-01-15T10:00:00Z",
          nextAudit: "2024-04-15T10:00:00Z",
          issues: 0,
          requirements: [
            {
              id: "gdpr_001",
              title: "Data Processing Lawfulness",
              status: "compliant",
              description: "All data processing activities have legal basis",
              lastChecked: "2024-01-15T10:00:00Z"
            },
            {
              id: "gdpr_002",
              title: "Data Subject Rights",
              status: "compliant",
              description: "Users can access, rectify, and delete their data",
              lastChecked: "2024-01-15T10:00:00Z"
            },
            {
              id: "gdpr_003",
              title: "Data Minimization",
              status: "compliant",
              description: "Only necessary data is collected and processed",
              lastChecked: "2024-01-15T10:00:00Z"
            },
            {
              id: "gdpr_004",
              title: "Data Security",
              status: "compliant",
              description: "Appropriate technical and organizational measures in place",
              lastChecked: "2024-01-15T10:00:00Z"
            },
            {
              id: "gdpr_005",
              title: "Privacy by Design",
              status: "compliant",
              description: "Privacy considerations integrated into system design",
              lastChecked: "2024-01-15T10:00:00Z"
            }
          ]
        },
        coppa: {
          name: "Children's Online Privacy Protection Act",
          status: "compliant",
          score: 90,
          lastAudit: "2024-01-10T14:00:00Z",
          nextAudit: "2024-04-10T14:00:00Z",
          issues: 0,
          requirements: [
            {
              id: "coppa_001",
              title: "Parental Consent",
              status: "compliant",
              description: "Verifiable parental consent obtained before collecting child data",
              lastChecked: "2024-01-10T14:00:00Z"
            },
            {
              id: "coppa_002",
              title: "Data Collection Limits",
              status: "compliant",
              description: "Only necessary information collected from children",
              lastChecked: "2024-01-10T14:00:00Z"
            },
            {
              id: "coppa_003",
              title: "Data Security",
              status: "compliant",
              description: "Reasonable security measures to protect child data",
              lastChecked: "2024-01-10T14:00:00Z"
            },
            {
              id: "coppa_004",
              title: "Data Sharing Restrictions",
              status: "compliant",
              description: "Child data not shared with third parties without consent",
              lastChecked: "2024-01-10T14:00:00Z"
            },
            {
              id: "coppa_005",
              title: "Parental Access",
              status: "compliant",
              description: "Parents can review, delete, and refuse further collection",
              lastChecked: "2024-01-10T14:00:00Z"
            }
          ]
        },
        fips140: {
          name: "Federal Information Processing Standard 140",
          status: "compliant",
          score: 88,
          lastAudit: "2024-01-05T09:00:00Z",
          nextAudit: "2024-04-05T09:00:00Z",
          issues: 0,
          requirements: [
            {
              id: "fips_001",
              title: "Cryptographic Module Security",
              status: "compliant",
              description: "Cryptographic modules meet FIPS 140-2 Level 2 requirements",
              lastChecked: "2024-01-05T09:00:00Z"
            },
            {
              id: "fips_002",
              title: "Key Management",
              status: "compliant",
              description: "Proper key generation, distribution, and storage",
              lastChecked: "2024-01-05T09:00:00Z"
            },
            {
              id: "fips_003",
              title: "Cryptographic Algorithms",
              status: "compliant",
              description: "Use of approved cryptographic algorithms",
              lastChecked: "2024-01-05T09:00:00Z"
            }
          ]
        },
        iso27001: {
          name: "ISO 27001 Information Security Management",
          status: "compliant",
          score: 94,
          lastAudit: "2024-01-01T08:00:00Z",
          nextAudit: "2024-04-01T08:00:00Z",
          issues: 0,
          requirements: [
            {
              id: "iso_001",
              title: "Information Security Policy",
              status: "compliant",
              description: "Comprehensive information security policy in place",
              lastChecked: "2024-01-01T08:00:00Z"
            },
            {
              id: "iso_002",
              title: "Risk Assessment",
              status: "compliant",
              description: "Regular risk assessments and mitigation strategies",
              lastChecked: "2024-01-01T08:00:00Z"
            },
            {
              id: "iso_003",
              title: "Access Control",
              status: "compliant",
              description: "Proper access control mechanisms implemented",
              lastChecked: "2024-01-01T08:00:00Z"
            },
            {
              id: "iso_004",
              title: "Incident Management",
              status: "compliant",
              description: "Security incident response procedures established",
              lastChecked: "2024-01-01T08:00:00Z"
            }
          ]
        }
      },
      dataProcessing: {
        legalBasis: [
          {
            id: "basis_001",
            type: "consent",
            description: "User consent for learning analytics and progress tracking",
            dataTypes: ["learning_progress", "performance_metrics", "engagement_data"],
            users: 1250,
            lastUpdated: "2024-01-20T10:00:00Z"
          },
          {
            id: "basis_002",
            type: "contract",
            description: "Service provision and user account management",
            dataTypes: ["user_profile", "account_info", "billing_data"],
            users: 1250,
            lastUpdated: "2024-01-20T10:00:00Z"
          },
          {
            id: "basis_003",
            type: "legitimate_interest",
            description: "System security and fraud prevention",
            dataTypes: ["security_logs", "access_records", "threat_detection"],
            users: 1250,
            lastUpdated: "2024-01-20T10:00:00Z"
          }
        ],
        dataRetention: {
          userProfiles: "7 years after account closure",
          learningData: "5 years after last activity",
          securityLogs: "2 years",
          analyticsData: "3 years",
          mediaFiles: "5 years after last access"
        }
      },
      userRights: {
        dataSubjectRequests: [
          {
            id: "request_001",
            type: "access",
            userId: "user_123",
            status: "completed",
            submittedAt: "2024-01-20T14:30:00Z",
            completedAt: "2024-01-21T09:15:00Z",
            description: "User requested access to all personal data"
          },
          {
            id: "request_002",
            type: "deletion",
            userId: "user_456",
            status: "in_progress",
            submittedAt: "2024-01-22T10:45:00Z",
            completedAt: null,
            description: "User requested deletion of account and all data"
          },
          {
            id: "request_003",
            type: "rectification",
            userId: "user_789",
            status: "completed",
            submittedAt: "2024-01-19T16:20:00Z",
            completedAt: "2024-01-19T17:30:00Z",
            description: "User requested correction of personal information"
          }
        ],
        consentManagement: {
          totalConsents: 1250,
          activeConsents: 1180,
          withdrawnConsents: 70,
          consentTypes: {
            "learning_analytics": 1180,
            "marketing_communications": 950,
            "data_sharing": 800,
            "cookies": 1250
          }
        }
      },
      privacyMetrics: {
        dataBreaches: {
          total: 0,
          reported: 0,
          resolved: 0,
          lastIncident: null
        },
        privacyImpactAssessments: {
          total: 12,
          completed: 12,
          pending: 0,
          lastAssessment: "2024-01-15T10:00:00Z"
        },
        trainingCompliance: {
          totalStaff: 25,
          trained: 25,
          trainingRate: 100,
          lastTraining: "2024-01-10T14:00:00Z"
        }
      }
    };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'compliant': return '#10b981';
      case 'non-compliant': return '#ef4444';
      case 'in_progress': return '#f59e0b';
      case 'pending': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return '#10b981';
    if (score >= 70) return '#f59e0b';
    return '#ef4444';
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
          Loading compliance dashboard...
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
          📋 Compliance Dashboard
        </h1>
        <div style={{ fontSize: '14px', color: '#64748b' }}>
          Monitor compliance with privacy and security standards
        </div>
      </div>

      {/* Filters */}
      <div style={filterStyle}>
        <select
          value={selectedStandard}
          onChange={(e) => setSelectedStandard(e.target.value)}
          style={selectStyle}
        >
          <option value="all">All Standards</option>
          <option value="gdpr">GDPR</option>
          <option value="coppa">COPPA</option>
          <option value="fips140">FIPS 140</option>
          <option value="iso27001">ISO 27001</option>
        </select>
      </div>

      {/* Compliance Overview */}
      <div style={gridStyle}>
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            📊 Overall Compliance Score
          </h3>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: getScoreColor(complianceData?.complianceOverview?.overallScore || 0), marginBottom: '8px' }}>
              {complianceData?.complianceOverview?.overallScore || 0}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>
              out of 100
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            ✅ Compliant Standards
          </h3>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#10b981', marginBottom: '8px' }}>
              {complianceData?.complianceOverview?.compliantStandards || 0}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>
              of {complianceData?.complianceOverview?.totalStandards || 0} standards
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            🔍 Last Audit
          </h3>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '8px' }}>
              {new Date(complianceData?.complianceOverview?.lastAudit || Date.now()).toLocaleDateString()}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>
              Next: {new Date(complianceData?.complianceOverview?.nextAudit || Date.now()).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            🚨 Non-Compliant
          </h3>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#ef4444', marginBottom: '8px' }}>
              {complianceData?.complianceOverview?.nonCompliantStandards || 0}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>
              standards need attention
            </div>
          </div>
        </div>
      </div>

      {/* Compliance Standards */}
      <div style={cardStyle}>
        <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
          📋 Compliance Standards
        </h3>
        {Object.entries(complianceData?.standards || {}).map(([key, standard]) => (
          <div key={key} style={{
            padding: '16px',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            marginBottom: '12px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
              <div>
                <div style={{ fontWeight: '500', color: '#1e293b', marginBottom: '4px' }}>
                  {standard.name}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  Last audit: {new Date(standard.lastAudit).toLocaleDateString()}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{
                  padding: '2px 8px',
                  backgroundColor: getStatusColor(standard.status),
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: '500',
                  textTransform: 'capitalize'
                }}>
                  {standard.status}
                </span>
                <span style={{
                  padding: '2px 8px',
                  backgroundColor: getScoreColor(standard.score),
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {standard.score}%
                </span>
              </div>
            </div>
            <div style={progressBarStyle}>
              <div style={progressFillStyle(standard.score)}></div>
            </div>
            <div style={{ fontSize: '12px', color: '#64748b', marginTop: '8px' }}>
              Issues: {standard.issues} • Next audit: {new Date(standard.nextAudit).toLocaleDateString()}
            </div>
          </div>
        ))}
      </div>

      <div style={gridStyle}>
        {/* Data Processing */}
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            🔄 Data Processing
          </h3>
          {complianceData?.dataProcessing?.legalBasis?.map((basis, index) => (
            <div key={index} style={{
              padding: '12px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              marginBottom: '8px'
            }}>
              <div style={{ fontWeight: '500', color: '#1e293b', marginBottom: '4px' }}>
                {basis.type.replace(/_/g, ' ').toUpperCase()}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
                {basis.description}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                Users: {basis.users} • Data: {basis.dataTypes.join(', ')}
              </div>
            </div>
          ))}
        </div>

        {/* User Rights */}
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            👤 User Rights
          </h3>
          <div style={{ marginBottom: '16px' }}>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b', marginBottom: '8px' }}>
              Data Subject Requests
            </div>
            {complianceData?.userRights?.dataSubjectRequests?.map((request, index) => (
              <div key={index} style={{
                padding: '8px',
                border: '1px solid #e2e8f0',
                borderRadius: '4px',
                marginBottom: '4px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '12px', color: '#1e293b' }}>
                    {request.type.toUpperCase()}
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
                <div style={{ fontSize: '10px', color: '#64748b' }}>
                  {new Date(request.submittedAt).toLocaleDateString()}
                </div>
              </div>
            ))}
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b', marginBottom: '8px' }}>
              Consent Management
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              <div>Total Consents: {complianceData?.userRights?.consentManagement?.totalConsents}</div>
              <div>Active: {complianceData?.userRights?.consentManagement?.activeConsents}</div>
              <div>Withdrawn: {complianceData?.userRights?.consentManagement?.withdrawnConsents}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Privacy Metrics */}
      <div style={cardStyle}>
        <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
          📊 Privacy Metrics
        </h3>
        <div style={gridStyle}>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b', marginBottom: '8px' }}>
              Data Breaches
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              <div>Total: {complianceData?.privacyMetrics?.dataBreaches?.total}</div>
              <div>Reported: {complianceData?.privacyMetrics?.dataBreaches?.reported}</div>
              <div>Resolved: {complianceData?.privacyMetrics?.dataBreaches?.resolved}</div>
            </div>
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b', marginBottom: '8px' }}>
              Privacy Impact Assessments
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              <div>Total: {complianceData?.privacyMetrics?.privacyImpactAssessments?.total}</div>
              <div>Completed: {complianceData?.privacyMetrics?.privacyImpactAssessments?.completed}</div>
              <div>Pending: {complianceData?.privacyMetrics?.privacyImpactAssessments?.pending}</div>
            </div>
          </div>
          <div>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b', marginBottom: '8px' }}>
              Training Compliance
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              <div>Staff Trained: {complianceData?.privacyMetrics?.trainingCompliance?.trained}/{complianceData?.privacyMetrics?.trainingCompliance?.totalStaff}</div>
              <div>Training Rate: {complianceData?.privacyMetrics?.trainingCompliance?.trainingRate}%</div>
              <div>Last Training: {new Date(complianceData?.privacyMetrics?.trainingCompliance?.lastTraining || Date.now()).toLocaleDateString()}</div>
            </div>
          </div>
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

export default ComplianceDashboard;
