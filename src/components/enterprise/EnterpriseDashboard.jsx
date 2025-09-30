import React, { useEffect, useState } from 'react';
import enterpriseService from '../../services/enterpriseService';

const EnterpriseDashboard = () => {
  const [enterpriseData, setEnterpriseData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedStrategy, setSelectedStrategy] = useState('whiteLabel');
  const [strategyExecution, setStrategyExecution] = useState({});

  useEffect(() => {
    const fetchEnterpriseData = async () => {
      try {
        setLoading(true);
        const response = await enterpriseService.getEnterpriseStatus();
        if (response.success) {
          setEnterpriseData(response.enterpriseData);
        } else {
          setError(response.error);
        }
      } catch (err) {
        console.error('Failed to fetch enterprise data:', err);
        setError('Failed to load enterprise data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchEnterpriseData();
    const interval = setInterval(fetchEnterpriseData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleStrategyExecution = async (strategy, parameters) => {
    try {
      const response = await enterpriseService.executeEnterpriseStrategy(strategy, parameters);
      if (response.success) {
        setStrategyExecution(response.strategyData);
      }
    } catch (err) {
      console.error('Strategy execution failed:', err);
    }
  };

  const handleExportData = () => {
    const data = enterpriseService.exportEnterpriseData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `enterprise-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Loading Enterprise Dashboard...</h2>
        <p>Fetching enterprise data and B2B solutions...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <h2>Error Loading Enterprise Dashboard</h2>
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
        <h1 style={{ color: '#2c3e50', margin: 0 }}>Enterprise & B2B Market Development Dashboard</h1>
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
            <h3 style={{ color: '#007bff', margin: '0 0 5px 0' }}>Customer Satisfaction</h3>
            <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>4.5/5</p>
          </div>
          <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
            <h3 style={{ color: '#ffc107', margin: '0 0 5px 0' }}>Sales Conversion</h3>
            <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>36%</p>
          </div>
          <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
            <h3 style={{ color: '#17a2b8', margin: '0 0 5px 0' }}>Customer Retention</h3>
            <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>88%</p>
          </div>
        </div>
      </div>

      {/* Enterprise Customers Status */}
      <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
        <h2 style={{ color: '#34495e', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>Enterprise Customers Status</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
          {enterpriseData.customers && Object.entries(enterpriseData.customers.customerTiers || {}).map(([tierKey, tier]) => (
            <div key={tierKey} style={{ border: '1px solid #eee', borderRadius: '5px', padding: '15px', backgroundColor: '#fdfdfd' }}>
              <h3 style={{ color: '#2c3e50', marginTop: '0', marginBottom: '10px', fontSize: '16px' }}>{tier.name}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', fontSize: '13px' }}>
                <div><strong>Min Seats:</strong> {tier.minSeats}</div>
                <div><strong>Avg Deal:</strong> ${tier.avgDealSize.toLocaleString()}</div>
                <div><strong>Sales Cycle:</strong> {tier.salesCycle}</div>
                <div><strong>Priority:</strong> {tier.priority}</div>
              </div>
              <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
                <div>Customers: {enterpriseData.customers.customerMetrics?.[tierKey]?.customers || 0}</div>
                <div>Revenue: ${enterpriseData.customers.customerMetrics?.[tierKey]?.revenue || 0}</div>
                <div>Satisfaction: {enterpriseData.customers.customerMetrics?.[tierKey]?.satisfaction || 0}/5</div>
                <div>Retention: {(enterpriseData.customers.customerMetrics?.[tierKey]?.retention || 0) * 100}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* B2B Solutions Status */}
      <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
        <h2 style={{ color: '#34495e', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>B2B Solutions Status</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {enterpriseData.solutions && Object.entries(enterpriseData.solutions.solutionPerformance || {}).map(([solutionKey, solution]) => (
            <div key={solutionKey} style={{ border: '1px solid #eee', borderRadius: '5px', padding: '15px', backgroundColor: '#fdfdfd' }}>
              <h3 style={{ color: '#2c3e50', marginTop: '0', marginBottom: '10px', fontSize: '16px' }}>{solution.name}</h3>
              <div style={{ fontSize: '13px' }}>
                <div style={{ marginBottom: '5px' }}><strong>Target:</strong> {solution.target}</div>
                <div style={{ marginBottom: '5px' }}><strong>Revenue:</strong> ${solution.revenue.toLocaleString()}</div>
                <div style={{ marginBottom: '5px' }}><strong>Effort:</strong> {solution.effort}</div>
                <div style={{ marginBottom: '5px' }}><strong>Timeframe:</strong> {solution.timeframe}</div>
              </div>
              <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
                <div>Customers: {enterpriseData.solutions.solutionMetrics?.[solutionKey]?.customers || 0}</div>
                <div>Revenue: ${enterpriseData.solutions.solutionMetrics?.[solutionKey]?.revenue || 0}</div>
                <div>Satisfaction: {enterpriseData.solutions.solutionMetrics?.[solutionKey]?.satisfaction || 0}/5</div>
                <div>Adoption: {(enterpriseData.solutions.solutionMetrics?.[solutionKey]?.adoption || 0) * 100}%</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Enterprise Features Status */}
      <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
        <h2 style={{ color: '#34495e', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>Enterprise Features Status</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {enterpriseData.features && Object.entries(enterpriseData.features.featurePerformance || {}).map(([featureKey, feature]) => (
            <div key={featureKey} style={{ border: '1px solid #eee', borderRadius: '5px', padding: '15px', backgroundColor: '#fdfdfd' }}>
              <h3 style={{ color: '#2c3e50', marginTop: '0', marginBottom: '10px', fontSize: '16px' }}>{feature.name}</h3>
              <div style={{ fontSize: '13px' }}>
                <div style={{ marginBottom: '5px' }}><strong>Implementation:</strong> <span style={{ color: feature.implementation === 'completed' ? '#28a745' : feature.implementation === 'in progress' ? '#ffc107' : '#dc3545' }}>{feature.implementation}</span></div>
                <div style={{ marginBottom: '5px' }}><strong>Adoption:</strong> {(feature.adoption * 100).toFixed(0)}%</div>
                <div style={{ marginBottom: '5px' }}><strong>Satisfaction:</strong> {feature.customerSatisfaction}/5</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Sales Pipeline Status */}
      <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
        <h2 style={{ color: '#34495e', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>Sales Pipeline Status</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          {enterpriseData.sales && Object.entries(enterpriseData.sales.pipeline || {}).map(([stageKey, stage]) => (
            <div key={stageKey} style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
              <h3 style={{ color: '#007bff', margin: '0 0 5px 0', fontSize: '14px', textTransform: 'capitalize' }}>{stageKey}</h3>
              <p style={{ margin: '0 0 5px 0', fontSize: '18px', fontWeight: 'bold' }}>{stage.total}</p>
              <p style={{ margin: '0 0 5px 0', fontSize: '14px' }}>Value: ${stage.value?.toLocaleString() || 0}</p>
              <p style={{ margin: '0', fontSize: '12px', color: '#666' }}>Avg: ${stage.avgDealSize?.toLocaleString() || 0}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Partnerships Status */}
      <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
        <h2 style={{ color: '#34495e', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>Partnerships Status</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {enterpriseData.partnerships && Object.entries(enterpriseData.partnerships.partnerships || {}).map(([typeKey, partnerships]) => (
            <div key={typeKey} style={{ border: '1px solid #eee', borderRadius: '5px', padding: '15px', backgroundColor: '#fdfdfd' }}>
              <h3 style={{ color: '#2c3e50', marginTop: '0', marginBottom: '10px', fontSize: '16px', textTransform: 'capitalize' }}>{typeKey} Partnerships</h3>
              <div style={{ fontSize: '13px' }}>
                {partnerships.map((partnership, index) => (
                  <div key={index} style={{ marginBottom: '8px', padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                    <div><strong>{partnership.partner}</strong></div>
                    <div>Type: {partnership.type}</div>
                    <div>Status: <span style={{ color: partnership.status === 'active' ? '#28a745' : partnership.status === 'negotiating' ? '#ffc107' : '#dc3545' }}>{partnership.status}</span></div>
                    <div>Revenue: ${partnership.revenue.toLocaleString()}</div>
                    <div>Benefits: {partnership.benefits.join(', ')}</div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Strategy Execution Interface */}
      <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
        <h2 style={{ color: '#34495e', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>Enterprise Strategy Execution</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <h3 style={{ color: '#2c3e50', marginBottom: '10px' }}>Select Strategy for Execution</h3>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Strategy:</label>
              <select 
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                onChange={(e) => setSelectedStrategy(e.target.value)}
                value={selectedStrategy}
              >
                <option value="whiteLabel">White Label Solution</option>
                <option value="api">API Platform</option>
                <option value="integration">Integration Services</option>
                <option value="consulting">Consulting Services</option>
                <option value="licensing">Content Licensing</option>
              </select>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Implementation Approach:</label>
              <select style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}>
                <option value="agile">Agile Development</option>
                <option value="waterfall">Waterfall</option>
                <option value="hybrid">Hybrid</option>
                <option value="rapid">Rapid Prototyping</option>
              </select>
            </div>
            <button 
              onClick={() => handleStrategyExecution(selectedStrategy, { approach: 'agile', timeline: '12 months' })}
              style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Execute Strategy
            </button>
          </div>
          <div>
            <h3 style={{ color: '#2c3e50', marginBottom: '10px' }}>Strategy Execution Results</h3>
            {strategyExecution.strategy ? (
              <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
                <div style={{ marginBottom: '10px' }}>
                  <strong>Strategy:</strong> {strategyExecution.strategy.strategy}
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <strong>Feasibility:</strong> {strategyExecution.strategy.analysis?.feasibility || 'unknown'}
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <strong>Market Size:</strong> ${strategyExecution.strategy.analysis?.marketSize?.toLocaleString() || 0}
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <strong>Competition:</strong> {strategyExecution.strategy.analysis?.competition || 'unknown'}
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <strong>Differentiation:</strong> {strategyExecution.strategy.analysis?.differentiation || 'unknown'}
                </div>
                <div>
                  <strong>Investment Required:</strong> ${strategyExecution.investment?.total?.toLocaleString() || 0}
                </div>
              </div>
            ) : (
              <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px', color: '#666' }}>
                No strategy execution yet. Use the interface to execute your selected strategy.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h2 style={{ color: '#34495e', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>Performance Metrics</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          {enterpriseData.performance && Object.entries(enterpriseData.performance).map(([metricType, metrics]) => (
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

export default EnterpriseDashboard;
