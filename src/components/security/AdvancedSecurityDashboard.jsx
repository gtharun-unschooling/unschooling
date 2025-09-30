import React, { useEffect, useState } from 'react';
import advancedSecurityService from '../../services/advancedSecurityService';

const AdvancedSecurityDashboard = () => {
  const [securityData, setSecurityData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAction, setSelectedAction] = useState('threatDetection');
  const [actionExecution, setActionExecution] = useState({});

  useEffect(() => {
    const fetchSecurityData = async () => {
      try {
        setLoading(true);
        const response = await advancedSecurityService.getSecurityStatus();
        if (response.success) {
          setSecurityData(response.securityData);
        } else {
          setError(response.error);
        }
      } catch (err) {
        console.error('Failed to fetch security data:', err);
        setError('Failed to load security data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSecurityData();
    const interval = setInterval(fetchSecurityData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleActionExecution = async (action, parameters) => {
    try {
      const response = await advancedSecurityService.executeSecurityAction(action, parameters);
      if (response.success) {
        setActionExecution(response.actionData);
      }
    } catch (err) {
      console.error('Security action execution failed:', err);
    }
  };

  const handleExportData = () => {
    const data = advancedSecurityService.exportSecurityData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `security-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Loading Advanced Security Dashboard...</h2>
        <p>Fetching security data and compliance status...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <h2>Error Loading Advanced Security Dashboard</h2>
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          style={{ padding: '10px 20px', marginTop: '10px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', backgroundColor: '#f4f7f6', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
        <h1 style={{ color: '#2c3e50', margin: 0 }}>Advanced Security & Compliance Dashboard</h1>
        <div>
          <button 
            onClick={handleExportData}
            style={{ padding: '10px 20px', backgroundColor: '#28a745', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', marginRight: '10px' }}
          >
            Export Data
          </button>
          <button 
            onClick={() => window.location.reload()}
            style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
          >
            Refresh
          </button>
        </div>
      </div>

      {/* System Health Overview */}
      <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
        <h2 style={{ color: '#34495e', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>System Health Overview</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
            <h3 style={{ color: '#28a745', margin: '0 0 5px 0' }}>Overall Status</h3>
            <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>Healthy</p>
          </div>
          <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
            <h3 style={{ color: '#007bff', margin: '0 0 5px 0' }}>Compliance Score</h3>
            <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>95.8%</p>
          </div>
          <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
            <h3 style={{ color: '#ffc107', margin: '0 0 5px 0' }}>Threat Detection</h3>
            <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>95%</p>
          </div>
          <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
            <h3 style={{ color: '#17a2b8', margin: '0 0 5px 0' }}>Risk Mitigation</h3>
            <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>88%</p>
          </div>
        </div>
      </div>

      {/* Security Threats Status */}
      <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
        <h2 style={{ color: '#34495e', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>Security Threats Status</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
          {securityData.threats && Object.entries(securityData.threats.threatPerformance || {}).map(([threatKey, threat]) => (
            <div key={threatKey} style={{ border: '1px solid #eee', borderRadius: '5px', padding: '15px', backgroundColor: '#fdfdfd' }}>
              <h3 style={{ color: '#2c3e50', marginTop: '0', marginBottom: '10px', fontSize: '16px' }}>{threat.name}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', fontSize: '13px' }}>
                <div><strong>Severity:</strong> <span style={{ color: threat.severity === 'critical' ? '#dc3545' : threat.severity === 'high' ? '#fd7e14' : threat.severity === 'medium' ? '#ffc107' : '#28a745' }}>{threat.severity}</span></div>
                <div><strong>Frequency:</strong> {(threat.frequency * 100).toFixed(0)}%</div>
                <div><strong>Mitigation:</strong> {threat.mitigation}</div>
                <div><strong>Status:</strong> <span style={{ color: threat.status === 'prevented' ? '#28a745' : threat.status === 'blocked' ? '#28a745' : threat.status === 'detected' ? '#ffc107' : '#17a2b8' }}>{threat.status}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Compliance Status */}
      <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
        <h2 style={{ color: '#34495e', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>Compliance Status</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {securityData.compliance && Object.entries(securityData.compliance.frameworkPerformance || {}).map(([frameworkKey, framework]) => (
            <div key={frameworkKey} style={{ border: '1px solid #eee', borderRadius: '5px', padding: '15px', backgroundColor: '#fdfdfd' }}>
              <h3 style={{ color: '#2c3e50', marginTop: '0', marginBottom: '10px', fontSize: '16px' }}>{framework.name}</h3>
              <div style={{ fontSize: '13px' }}>
                <div style={{ marginBottom: '5px' }}><strong>Region:</strong> {framework.region}</div>
                <div style={{ marginBottom: '5px' }}><strong>Status:</strong> <span style={{ color: framework.status === 'compliant' ? '#28a745' : framework.status === 'certified' ? '#28a745' : '#dc3545' }}>{framework.status}</span></div>
                <div style={{ marginBottom: '5px' }}><strong>Score:</strong> {framework.score}%</div>
                <div style={{ marginBottom: '5px' }}><strong>Last Audit:</strong> {framework.lastAudit}</div>
                <div style={{ marginBottom: '5px' }}><strong>Next Audit:</strong> {framework.nextAudit}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Controls Status */}
      <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
        <h2 style={{ color: '#34495e', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>Security Controls Status</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {securityData.controls && Object.entries(securityData.controls.controlPerformance || {}).map(([controlKey, control]) => (
            <div key={controlKey} style={{ border: '1px solid #eee', borderRadius: '5px', padding: '15px', backgroundColor: '#fdfdfd' }}>
              <h3 style={{ color: '#2c3e50', marginTop: '0', marginBottom: '10px', fontSize: '16px' }}>{control.name}</h3>
              <div style={{ fontSize: '13px' }}>
                <div style={{ marginBottom: '5px' }}><strong>Implementation:</strong> <span style={{ color: control.implementation === 'completed' ? '#28a745' : control.implementation === 'in progress' ? '#ffc107' : '#dc3545' }}>{control.implementation}</span></div>
                <div style={{ marginBottom: '5px' }}><strong>Effectiveness:</strong> {(control.effectiveness * 100).toFixed(0)}%</div>
                <div style={{ marginBottom: '5px' }}><strong>Coverage:</strong> {(control.coverage * 100).toFixed(0)}%</div>
                <div style={{ marginBottom: '5px' }}><strong>Last Updated:</strong> {control.lastUpdated}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Risk Assessment Status */}
      <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
        <h2 style={{ color: '#34495e', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>Risk Assessment Status</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {securityData.risk && Object.entries(securityData.risk.riskPerformance || {}).map(([riskKey, risk]) => (
            <div key={riskKey} style={{ border: '1px solid #eee', borderRadius: '5px', padding: '15px', backgroundColor: '#fdfdfd' }}>
              <h3 style={{ color: '#2c3e50', marginTop: '0', marginBottom: '10px', fontSize: '16px' }}>{risk.risk}</h3>
              <div style={{ fontSize: '13px' }}>
                <div style={{ marginBottom: '5px' }}><strong>Likelihood:</strong> {(risk.likelihood * 100).toFixed(0)}%</div>
                <div style={{ marginBottom: '5px' }}><strong>Impact:</strong> <span style={{ color: risk.impact === 'critical' ? '#dc3545' : risk.impact === 'high' ? '#fd7e14' : risk.impact === 'medium' ? '#ffc107' : '#28a745' }}>{risk.impact}</span></div>
                <div style={{ marginBottom: '5px' }}><strong>Mitigation:</strong> {risk.mitigation}</div>
                <div style={{ marginBottom: '5px' }}><strong>Residual Risk:</strong> <span style={{ color: risk.residualRisk === 'very low' ? '#28a745' : risk.residualRisk === 'low' ? '#28a745' : risk.residualRisk === 'medium' ? '#ffc107' : '#dc3545' }}>{risk.residualRisk}</span></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Incidents Status */}
      <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
        <h2 style={{ color: '#34495e', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>Security Incidents Status</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          {securityData.incidents && Object.entries(securityData.incidents.incidents || {}).map(([incidentKey, incident]) => (
            <div key={incidentKey} style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
              <h3 style={{ color: '#007bff', margin: '0 0 5px 0', fontSize: '14px', textTransform: 'capitalize' }}>{incidentKey.replace(/([A-Z])/g, ' $1')}</h3>
              <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>{incident}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Security Action Interface */}
      <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
        <h2 style={{ color: '#34495e', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>Security Action Execution</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <h3 style={{ color: '#2c3e50', marginBottom: '10px' }}>Select Security Action</h3>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Action:</label>
              <select 
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                onChange={(e) => setSelectedAction(e.target.value)}
                value={selectedAction}
              >
                <option value="threatDetection">Threat Detection</option>
                <option value="vulnerabilityScan">Vulnerability Scan</option>
                <option value="accessReview">Access Review</option>
                <option value="complianceAudit">Compliance Audit</option>
                <option value="incidentResponse">Incident Response</option>
                <option value="securityTraining">Security Training</option>
              </select>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Priority:</label>
              <select style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}>
                <option value="critical">Critical</option>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>
            <button 
              onClick={() => handleActionExecution(selectedAction, { priority: 'high', scope: 'full' })}
              style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Execute Action
            </button>
          </div>
          <div>
            <h3 style={{ color: '#2c3e50', marginBottom: '10px' }}>Action Execution Results</h3>
            {actionExecution.action ? (
              <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
                <div style={{ marginBottom: '10px' }}>
                  <strong>Action:</strong> {actionExecution.action.action}
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <strong>Feasibility:</strong> {actionExecution.action.analysis?.feasibility || 'unknown'}
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <strong>Impact:</strong> {actionExecution.action.analysis?.impact || 'unknown'}
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <strong>Complexity:</strong> {actionExecution.action.analysis?.complexity || 'unknown'}
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <strong>Timeline:</strong> {actionExecution.action.analysis?.timeline || 'unknown'}
                </div>
                <div>
                  <strong>Resources:</strong> {actionExecution.action.analysis?.resources?.join(', ') || 'unknown'}
                </div>
              </div>
            ) : (
              <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px', color: '#666' }}>
                No action execution yet. Use the interface to execute your selected security action.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h2 style={{ color: '#34495e', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>Performance Metrics</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          {securityData.performance && Object.entries(securityData.performance).map(([metricType, metrics]) => (
            <div key={metricType} style={{ border: '1px solid #eee', borderRadius: '5px', padding: '15px', backgroundColor: '#fdfdfd' }}>
              <h3 style={{ color: '#2c3e50', marginTop: '0', marginBottom: '10px', fontSize: '16px', textTransform: 'capitalize' }}>{metricType.replace(/([A-Z])/g, ' $1')}</h3>
              <div style={{ fontSize: '13px' }}>
                {Object.entries(metrics).map(([key, value]) => (
                  <div key={key} style={{ marginBottom: '5px' }}>
                    <strong>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</strong> {typeof value === 'number' ? value.toLocaleString() : value}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdvancedSecurityDashboard;
