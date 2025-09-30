import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';

const DataGovernance = () => {
  const [user] = useAuthState(auth);
  const [governanceData, setGovernanceData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    if (user) {
      loadGovernanceData();
    }
  }, [user, selectedCategory]);

  const loadGovernanceData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8000/api/compliance/data-governance?user_id=${user.uid}&category=${selectedCategory}`);
      
      if (!response.ok) {
        throw new Error('Failed to load data governance data');
      }

      const data = await response.json();
      setGovernanceData(data);
    } catch (err) {
      setError(err.message);
      // Fallback to sample data
      setGovernanceData(getSampleGovernanceData());
    } finally {
      setIsLoading(false);
    }
  };

  const getSampleGovernanceData = () => {
    return {
      governanceOverview: {
        totalDataAssets: 45,
        classifiedAssets: 42,
        unclassifiedAssets: 3,
        dataQualityScore: 94,
        lastDataAudit: "2024-01-20T10:00:00Z",
        nextDataAudit: "2024-02-20T10:00:00Z"
      },
      dataClassification: {
        categories: [
          {
            id: "class_001",
            name: "Public",
            description: "Data that can be freely shared and published",
            color: "#10b981",
            count: 8,
            examples: ["public_announcements", "help_documentation", "faq_content"],
            handlingRequirements: ["no_restrictions", "can_be_shared", "no_encryption_required"]
          },
          {
            id: "class_002",
            name: "Internal",
            description: "Data for internal use only, not for public disclosure",
            color: "#3b82f6",
            count: 15,
            examples: ["internal_reports", "staff_directory", "company_policies"],
            handlingRequirements: ["internal_access_only", "basic_encryption", "access_logging"]
          },
          {
            id: "class_003",
            name: "Confidential",
            description: "Sensitive data requiring protection and restricted access",
            color: "#f59e0b",
            count: 12,
            examples: ["user_profiles", "learning_progress", "performance_metrics"],
            handlingRequirements: ["restricted_access", "strong_encryption", "audit_trail", "data_masking"]
          },
          {
            id: "class_004",
            name: "Restricted",
            description: "Highly sensitive data with strict access controls",
            color: "#ef4444",
            count: 7,
            examples: ["payment_info", "security_logs", "admin_credentials"],
            handlingRequirements: ["strict_access_controls", "end_to_end_encryption", "continuous_monitoring", "data_loss_prevention"]
          }
        ],
        unclassifiedAssets: [
          {
            id: "asset_001",
            name: "user_feedback_data",
            description: "Raw user feedback and comments",
            location: "database/feedback_table",
            size: "2.3 GB",
            lastAccessed: "2024-01-22T14:30:00Z",
            suggestedClassification: "confidential"
          },
          {
            id: "asset_002",
            name: "system_logs",
            description: "Application and system logs",
            location: "logs/system_logs",
            size: "15.7 GB",
            lastAccessed: "2024-01-22T12:15:00Z",
            suggestedClassification: "internal"
          },
          {
            id: "asset_003",
            name: "backup_files",
            description: "Database backup files",
            location: "backups/daily_backups",
            size: "45.2 GB",
            lastAccessed: "2024-01-22T06:00:00Z",
            suggestedClassification: "restricted"
          }
        ]
      },
      dataQuality: {
        metrics: {
          completeness: 96.5,
          accuracy: 94.2,
          consistency: 97.8,
          timeliness: 92.1,
          validity: 95.7
        },
        issues: [
          {
            id: "issue_001",
            type: "completeness",
            severity: "medium",
            description: "Missing email addresses for 3.5% of user profiles",
            affectedRecords: 44,
            detectedAt: "2024-01-22T10:30:00Z",
            status: "investigating"
          },
          {
            id: "issue_002",
            type: "accuracy",
            severity: "low",
            description: "Inconsistent date formats in learning progress data",
            affectedRecords: 12,
            detectedAt: "2024-01-21T16:45:00Z",
            status: "resolved"
          },
          {
            id: "issue_003",
            type: "consistency",
            severity: "high",
            description: "Duplicate user records found in database",
            affectedRecords: 8,
            detectedAt: "2024-01-20T14:20:00Z",
            status: "in_progress"
          }
        ]
      },
      dataLineage: {
        flows: [
          {
            id: "flow_001",
            name: "User Registration Flow",
            description: "Data flow from user registration to profile creation",
            source: "registration_form",
            destination: "user_profiles_table",
            dataTypes: ["personal_info", "contact_details", "preferences"],
            transformations: ["validation", "encryption", "normalization"],
            lastUpdated: "2024-01-15T10:00:00Z"
          },
          {
            id: "flow_002",
            name: "Learning Progress Flow",
            description: "Learning activity data to progress tracking",
            source: "learning_activities",
            destination: "progress_analytics",
            dataTypes: ["activity_data", "performance_metrics", "engagement_stats"],
            transformations: ["aggregation", "calculation", "anonymization"],
            lastUpdated: "2024-01-10T14:00:00Z"
          },
          {
            id: "flow_003",
            name: "Analytics Data Flow",
            description: "Raw data to analytics dashboard",
            source: "raw_analytics_data",
            destination: "analytics_dashboard",
            dataTypes: ["usage_stats", "performance_data", "user_behavior"],
            transformations: ["filtering", "aggregation", "visualization"],
            lastUpdated: "2024-01-05T09:00:00Z"
          }
        ]
      },
      dataRetention: {
        policies: [
          {
            id: "policy_001",
            dataType: "user_profiles",
            retentionPeriod: "7 years after account closure",
            legalBasis: "contract",
            description: "User profile data retained for customer service and legal compliance",
            lastReview: "2024-01-15T10:00:00Z",
            nextReview: "2024-04-15T10:00:00Z",
            complianceStatus: "compliant"
          },
          {
            id: "policy_002",
            dataType: "learning_data",
            retentionPeriod: "5 years after last activity",
            legalBasis: "legitimate_interest",
            description: "Learning progress and performance data for educational insights",
            lastReview: "2024-01-15T10:00:00Z",
            nextReview: "2024-04-15T10:00:00Z",
            complianceStatus: "compliant"
          },
          {
            id: "policy_003",
            dataType: "security_logs",
            retentionPeriod: "2 years",
            legalBasis: "legitimate_interest",
            description: "Security and access logs for threat detection and compliance",
            lastReview: "2024-01-15T10:00:00Z",
            nextReview: "2024-04-15T10:00:00Z",
            complianceStatus: "compliant"
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
          }
        ]
      },
      accessControls: {
        dataAccess: [
          {
            id: "access_001",
            dataType: "user_profiles",
            accessLevel: "confidential",
            authorizedUsers: ["admin", "customer_service", "data_analyst"],
            permissions: ["read", "update"],
            restrictions: ["no_export", "audit_required"],
            lastReview: "2024-01-15T10:00:00Z"
          },
          {
            id: "access_002",
            dataType: "learning_data",
            accessLevel: "confidential",
            authorizedUsers: ["admin", "data_analyst", "researcher"],
            permissions: ["read", "aggregate"],
            restrictions: ["anonymization_required", "no_pii_access"],
            lastReview: "2024-01-15T10:00:00Z"
          },
          {
            id: "access_003",
            dataType: "payment_info",
            accessLevel: "restricted",
            authorizedUsers: ["admin", "billing_specialist"],
            permissions: ["read"],
            restrictions: ["pci_compliance", "encryption_required", "audit_trail"],
            lastReview: "2024-01-15T10:00:00Z"
          }
        ]
      }
    };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'compliant': return '#10b981';
      case 'non-compliant': return '#ef4444';
      case 'in_progress': return '#f59e0b';
      case 'investigating': return '#f59e0b';
      case 'resolved': return '#10b981';
      case 'scheduled': return '#3b82f6';
      default: return '#6b7280';
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  const getAccessLevelColor = (level) => {
    switch (level) {
      case 'public': return '#10b981';
      case 'internal': return '#3b82f6';
      case 'confidential': return '#f59e0b';
      case 'restricted': return '#ef4444';
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
          Loading data governance data...
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
          📊 Data Governance
        </h1>
        <div style={{ fontSize: '14px', color: '#64748b' }}>
          Manage data classification, quality, and governance policies
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
          <option value="classification">Data Classification</option>
          <option value="quality">Data Quality</option>
          <option value="lineage">Data Lineage</option>
          <option value="retention">Data Retention</option>
          <option value="access">Access Controls</option>
        </select>
      </div>

      {/* Governance Overview */}
      <div style={gridStyle}>
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            📊 Total Data Assets
          </h3>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '8px' }}>
              {governanceData?.governanceOverview?.totalDataAssets || 0}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>
              data assets
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            🏷️ Classified Assets
          </h3>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#10b981', marginBottom: '8px' }}>
              {governanceData?.governanceOverview?.classifiedAssets || 0}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>
              of {governanceData?.governanceOverview?.totalDataAssets || 0} assets
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            ⚠️ Unclassified Assets
          </h3>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#ef4444', marginBottom: '8px' }}>
              {governanceData?.governanceOverview?.unclassifiedAssets || 0}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>
              need classification
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            📈 Data Quality Score
          </h3>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '48px', fontWeight: 'bold', color: '#10b981', marginBottom: '8px' }}>
              {governanceData?.governanceOverview?.dataQualityScore || 0}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b' }}>
              out of 100
            </div>
          </div>
        </div>
      </div>

      {/* Data Classification */}
      <div style={cardStyle}>
        <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
          🏷️ Data Classification
        </h3>
        <div style={gridStyle}>
          {governanceData?.dataClassification?.categories?.map((category, index) => (
            <div key={index} style={{
              padding: '16px',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              marginBottom: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontWeight: '500', color: '#1e293b', marginBottom: '4px' }}>
                    {category.name}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    {category.description}
                  </div>
                </div>
                <span style={{
                  padding: '2px 8px',
                  backgroundColor: category.color,
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {category.count} assets
                </span>
              </div>
              <div style={{ marginBottom: '8px' }}>
                <div style={{ fontSize: '12px', fontWeight: '500', color: '#1e293b', marginBottom: '4px' }}>
                  Examples:
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  {category.examples.join(', ')}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '12px', fontWeight: '500', color: '#1e293b', marginBottom: '4px' }}>
                  Handling Requirements:
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  {category.handlingRequirements.join(', ')}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Quality */}
      <div style={cardStyle}>
        <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
          📈 Data Quality Metrics
        </h3>
        <div style={gridStyle}>
          {Object.entries(governanceData?.dataQuality?.metrics || {}).map(([metric, value]) => (
            <div key={metric} style={{
              padding: '16px',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              marginBottom: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ fontWeight: '500', color: '#1e293b', textTransform: 'capitalize' }}>
                  {metric}
                </div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981' }}>
                  {value}%
                </div>
              </div>
              <div style={progressBarStyle}>
                <div style={progressFillStyle(value)}></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Data Quality Issues */}
      <div style={cardStyle}>
        <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
          🚨 Data Quality Issues
        </h3>
        {governanceData?.dataQuality?.issues?.map((issue, index) => (
          <div key={index} style={{
            padding: '12px',
            border: '1px solid #e2e8f0',
            borderRadius: '6px',
            marginBottom: '8px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
              <div>
                <div style={{ fontWeight: '500', color: '#1e293b', marginBottom: '4px' }}>
                  {issue.type.toUpperCase()}
                </div>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  {issue.description}
                </div>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span style={{
                  padding: '2px 6px',
                  backgroundColor: getSeverityColor(issue.severity),
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: '500',
                  textTransform: 'capitalize'
                }}>
                  {issue.severity}
                </span>
                <span style={{
                  padding: '2px 6px',
                  backgroundColor: getStatusColor(issue.status),
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: '500',
                  textTransform: 'capitalize'
                }}>
                  {issue.status}
                </span>
              </div>
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              <div>Affected records: {issue.affectedRecords}</div>
              <div>Detected: {new Date(issue.detectedAt).toLocaleString()}</div>
            </div>
          </div>
        ))}
      </div>

      <div style={gridStyle}>
        {/* Data Lineage */}
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            🔄 Data Lineage
          </h3>
          {governanceData?.dataLineage?.flows?.map((flow, index) => (
            <div key={index} style={{
              padding: '12px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              marginBottom: '8px'
            }}>
              <div style={{ fontWeight: '500', color: '#1e293b', marginBottom: '4px' }}>
                {flow.name}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
                {flow.description}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
                <div>Source: {flow.source}</div>
                <div>Destination: {flow.destination}</div>
                <div>Data types: {flow.dataTypes.join(', ')}</div>
                <div>Transformations: {flow.transformations.join(', ')}</div>
              </div>
              <div style={{ fontSize: '10px', color: '#64748b' }}>
                Last updated: {new Date(flow.lastUpdated).toLocaleDateString()}
              </div>
            </div>
          ))}
        </div>

        {/* Access Controls */}
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            🔐 Access Controls
          </h3>
          {governanceData?.accessControls?.dataAccess?.map((access, index) => (
            <div key={index} style={{
              padding: '12px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              marginBottom: '8px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                <div>
                  <div style={{ fontWeight: '500', color: '#1e293b', marginBottom: '4px' }}>
                    {access.dataType.replace(/_/g, ' ').toUpperCase()}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    Authorized users: {access.authorizedUsers.join(', ')}
                  </div>
                </div>
                <span style={{
                  padding: '2px 6px',
                  backgroundColor: getAccessLevelColor(access.accessLevel),
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: '500',
                  textTransform: 'capitalize'
                }}>
                  {access.accessLevel}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
                <div>Permissions: {access.permissions.join(', ')}</div>
                <div>Restrictions: {access.restrictions.join(', ')}</div>
              </div>
              <div style={{ fontSize: '10px', color: '#64748b' }}>
                Last review: {new Date(access.lastReview).toLocaleDateString()}
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

export default DataGovernance;
