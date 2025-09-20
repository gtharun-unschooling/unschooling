import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';

const DataEncryption = () => {
  const [user] = useAuthState(auth);
  const [encryptionData, setEncryptionData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    if (user) {
      loadEncryptionData();
    }
  }, [user, selectedCategory]);

  const loadEncryptionData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8000/api/security/encryption?user_id=${user.uid}&category=${selectedCategory}`);
      
      if (!response.ok) {
        throw new Error('Failed to load encryption data');
      }

      const data = await response.json();
      setEncryptionData(data);
    } catch (err) {
      setError(err.message);
      // Fallback to sample data
      setEncryptionData(getSampleEncryptionData());
    } finally {
      setIsLoading(false);
    }
  };

  const getSampleEncryptionData = () => {
    return {
      encryptionOverview: {
        totalDataEncrypted: "2.4 TB",
        encryptionCoverage: 100,
        lastEncryptionUpdate: "2024-01-22T12:00:00Z",
        encryptionAlgorithms: ["AES-256", "RSA-4096", "SHA-256"],
        keyRotationStatus: "active"
      },
      dataCategories: {
        userProfiles: {
          status: "encrypted",
          algorithm: "AES-256",
          coverage: 100,
          lastEncrypted: "2024-01-22T12:00:00Z",
          keyRotation: "2024-02-22T12:00:00Z",
          size: "150 GB",
          records: 1250
        },
        learningData: {
          status: "encrypted",
          algorithm: "AES-256",
          coverage: 100,
          lastEncrypted: "2024-01-22T12:00:00Z",
          keyRotation: "2024-02-22T12:00:00Z",
          size: "800 GB",
          records: 45000
        },
        progressTracking: {
          status: "encrypted",
          algorithm: "AES-256",
          coverage: 100,
          lastEncrypted: "2024-01-22T12:00:00Z",
          keyRotation: "2024-02-22T12:00:00Z",
          size: "300 GB",
          records: 18000
        },
        analyticsData: {
          status: "encrypted",
          algorithm: "AES-256",
          coverage: 100,
          lastEncrypted: "2024-01-22T12:00:00Z",
          keyRotation: "2024-02-22T12:00:00Z",
          size: "200 GB",
          records: 8500
        },
        mediaFiles: {
          status: "encrypted",
          algorithm: "AES-256",
          coverage: 100,
          lastEncrypted: "2024-01-22T12:00:00Z",
          keyRotation: "2024-02-22T12:00:00Z",
          size: "950 GB",
          records: 25000
        }
      },
      keyManagement: {
        activeKeys: [
          {
            keyId: "key_001",
            algorithm: "AES-256",
            status: "active",
            created: "2024-01-15T10:00:00Z",
            expires: "2024-02-15T10:00:00Z",
            usage: "user_data",
            rotationCount: 3
          },
          {
            keyId: "key_002",
            algorithm: "RSA-4096",
            status: "active",
            created: "2024-01-10T14:00:00Z",
            expires: "2024-04-10T14:00:00Z",
            usage: "api_communication",
            rotationCount: 1
          },
          {
            keyId: "key_003",
            algorithm: "AES-256",
            status: "active",
            created: "2024-01-20T09:00:00Z",
            expires: "2024-02-20T09:00:00Z",
            usage: "file_storage",
            rotationCount: 2
          }
        ],
        keyRotationSchedule: {
          frequency: "monthly",
          nextRotation: "2024-02-22T12:00:00Z",
          automaticRotation: true,
          manualRotationAvailable: true
        }
      },
      encryptionMetrics: {
        encryptionPerformance: {
          averageEncryptionTime: "0.15s",
          averageDecryptionTime: "0.12s",
          throughput: "1.2 GB/s",
          cpuUsage: "8.5%"
        },
        securityMetrics: {
          encryptionStrength: "256-bit",
          keyLength: "256-bit",
          hashAlgorithm: "SHA-256",
          certificateValidity: "valid"
        }
      },
      complianceStatus: {
        fips140: {
          status: "compliant",
          level: "Level 2",
          lastValidation: "2024-01-15T10:00:00Z",
          nextValidation: "2024-04-15T10:00:00Z"
        },
        commonCriteria: {
          status: "compliant",
          level: "EAL4+",
          lastValidation: "2024-01-10T14:00:00Z",
          nextValidation: "2024-04-10T14:00:00Z"
        },
        iso27001: {
          status: "compliant",
          lastAudit: "2024-01-05T09:00:00Z",
          nextAudit: "2024-04-05T09:00:00Z"
        }
      }
    };
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'encrypted': return '#10b981';
      case 'active': return '#10b981';
      case 'compliant': return '#10b981';
      case 'valid': return '#10b981';
      case 'pending': return '#f59e0b';
      case 'expired': return '#ef4444';
      case 'non-compliant': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getAlgorithmColor = (algorithm) => {
    switch (algorithm) {
      case 'AES-256': return '#3b82f6';
      case 'RSA-4096': return '#8b5cf6';
      case 'SHA-256': return '#10b981';
      default: return '#6b7280';
    }
  };

  const handleRotateKey = async (keyId) => {
    try {
      const response = await fetch('http://localhost:8000/api/security/rotate-key', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.uid,
          key_id: keyId
        })
      });

      if (!response.ok) {
        throw new Error('Failed to rotate key');
      }

      // Reload encryption data after key rotation
      loadEncryptionData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEncryptData = async (category) => {
    try {
      const response = await fetch('http://localhost:8000/api/security/encrypt-data', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.uid,
          category: category
        })
      });

      if (!response.ok) {
        throw new Error('Failed to encrypt data');
      }

      // Reload encryption data after encryption
      loadEncryptionData();
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
          Loading encryption data...
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
          🔐 Data Encryption
        </h1>
        <div style={{ fontSize: '14px', color: '#64748b' }}>
          Manage data encryption and key management
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
          <option value="userProfiles">User Profiles</option>
          <option value="learningData">Learning Data</option>
          <option value="progressTracking">Progress Tracking</option>
          <option value="analyticsData">Analytics Data</option>
          <option value="mediaFiles">Media Files</option>
        </select>
      </div>

      {/* Encryption Overview */}
      <div style={gridStyle}>
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            📊 Encryption Overview
          </h3>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981', marginBottom: '8px' }}>
              {encryptionData?.encryptionOverview?.totalDataEncrypted || '0 TB'}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '16px' }}>
              total data encrypted
            </div>
            <div style={progressBarStyle}>
              <div style={progressFillStyle(encryptionData?.encryptionOverview?.encryptionCoverage || 0)}></div>
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              {encryptionData?.encryptionOverview?.encryptionCoverage || 0}% coverage
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            🔑 Key Management
          </h3>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6', marginBottom: '8px' }}>
              {encryptionData?.keyManagement?.activeKeys?.length || 0}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>
              active keys
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              Next rotation: {new Date(encryptionData?.keyManagement?.keyRotationSchedule?.nextRotation || Date.now()).toLocaleDateString()}
            </div>
          </div>
        </div>

        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            ⚡ Performance
          </h3>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f59e0b', marginBottom: '8px' }}>
              {encryptionData?.encryptionMetrics?.encryptionPerformance?.averageEncryptionTime || '0s'}
            </div>
            <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '8px' }}>
              avg encryption time
            </div>
            <div style={{ fontSize: '12px', color: '#64748b' }}>
              Throughput: {encryptionData?.encryptionMetrics?.encryptionPerformance?.throughput || '0 GB/s'}
            </div>
          </div>
        </div>
      </div>

      {/* Data Categories */}
      <div style={cardStyle}>
        <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
          📁 Data Categories
        </h3>
        <div style={gridStyle}>
          {Object.entries(encryptionData?.dataCategories || {}).map(([category, data]) => (
            <div key={category} style={{
              padding: '16px',
              border: '1px solid #e2e8f0',
              borderRadius: '8px',
              marginBottom: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '12px' }}>
                <div>
                  <div style={{ fontWeight: '500', color: '#1e293b', textTransform: 'capitalize', marginBottom: '4px' }}>
                    {category.replace(/([A-Z])/g, ' $1').trim()}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    {data.size} • {data.records.toLocaleString()} records
                  </div>
                </div>
                <span style={{
                  padding: '2px 8px',
                  backgroundColor: getStatusColor(data.status),
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: '500',
                  textTransform: 'capitalize'
                }}>
                  {data.status}
                </span>
              </div>
              <div style={progressBarStyle}>
                <div style={progressFillStyle(data.coverage)}></div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '8px' }}>
                <div style={{ fontSize: '12px', color: '#64748b' }}>
                  {data.coverage}% coverage • {data.algorithm}
                </div>
                <button
                  style={buttonStyle}
                  onClick={() => handleEncryptData(category)}
                >
                  Re-encrypt
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={gridStyle}>
        {/* Active Keys */}
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            🔑 Active Keys
          </h3>
          {encryptionData?.keyManagement?.activeKeys?.map((key, index) => (
            <div key={index} style={{
              padding: '12px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              marginBottom: '8px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '8px' }}>
                <div>
                  <div style={{ fontWeight: '500', color: '#1e293b' }}>
                    {key.keyId}
                  </div>
                  <div style={{ fontSize: '12px', color: '#64748b' }}>
                    {key.usage.replace(/_/g, ' ')}
                  </div>
                </div>
                <span style={{
                  padding: '2px 6px',
                  backgroundColor: getAlgorithmColor(key.algorithm),
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: '500'
                }}>
                  {key.algorithm}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
                <div>Created: {new Date(key.created).toLocaleDateString()}</div>
                <div>Expires: {new Date(key.expires).toLocaleDateString()}</div>
                <div>Rotations: {key.rotationCount}</div>
              </div>
              <button
                style={{
                  ...buttonStyle,
                  backgroundColor: '#f59e0b'
                }}
                onClick={() => handleRotateKey(key.keyId)}
              >
                Rotate Key
              </button>
            </div>
          ))}
        </div>

        {/* Compliance Status */}
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
            📋 Compliance Status
          </h3>
          {Object.entries(encryptionData?.complianceStatus || {}).map(([standard, data]) => (
            <div key={standard} style={{
              padding: '12px',
              border: '1px solid #e2e8f0',
              borderRadius: '6px',
              marginBottom: '8px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <div style={{ fontWeight: '500', color: '#1e293b', textTransform: 'uppercase' }}>
                  {standard}
                </div>
                <span style={{
                  padding: '2px 6px',
                  backgroundColor: getStatusColor(data.status),
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '10px',
                  fontWeight: '500',
                  textTransform: 'capitalize'
                }}>
                  {data.status}
                </span>
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                {data.level && <div>Level: {data.level}</div>}
                <div>Last validation: {new Date(data.lastValidation || data.lastAudit).toLocaleDateString()}</div>
                <div>Next validation: {new Date(data.nextValidation || data.nextAudit).toLocaleDateString()}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Encryption Algorithms */}
      <div style={cardStyle}>
        <h3 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
          🔧 Encryption Algorithms
        </h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          {encryptionData?.encryptionOverview?.encryptionAlgorithms?.map((algorithm, index) => (
            <div key={index} style={{
              padding: '8px 16px',
              backgroundColor: getAlgorithmColor(algorithm),
              color: 'white',
              borderRadius: '6px',
              fontSize: '14px',
              fontWeight: '500'
            }}>
              {algorithm}
            </div>
          ))}
        </div>
        <div style={{ marginTop: '16px', fontSize: '12px', color: '#64748b' }}>
          <div>Encryption Strength: {encryptionData?.encryptionMetrics?.securityMetrics?.encryptionStrength}</div>
          <div>Key Length: {encryptionData?.encryptionMetrics?.securityMetrics?.keyLength}</div>
          <div>Hash Algorithm: {encryptionData?.encryptionMetrics?.securityMetrics?.hashAlgorithm}</div>
          <div>Certificate Status: {encryptionData?.encryptionMetrics?.securityMetrics?.certificateValidity}</div>
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

export default DataEncryption;
