import React, { useEffect, useState } from 'react';
import globalExpansionService from '../../services/globalExpansionService';

const GlobalExpansionDashboard = () => {
  const [expansionData, setExpansionData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMarket, setSelectedMarket] = useState('europe');
  const [marketEntry, setMarketEntry] = useState({});

  useEffect(() => {
    const fetchExpansionData = async () => {
      try {
        setLoading(true);
        const response = await globalExpansionService.getGlobalExpansionStatus();
        if (response.success) {
          setExpansionData(response.expansionData);
        } else {
          setError(response.error);
        }
      } catch (err) {
        console.error('Failed to fetch expansion data:', err);
        setError('Failed to load expansion data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchExpansionData();
    const interval = setInterval(fetchExpansionData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleMarketEntry = async (market, strategy) => {
    try {
      const response = await globalExpansionService.executeMarketEntry(market, strategy);
      if (response.success) {
        setMarketEntry(response.entryData);
      }
    } catch (err) {
      console.error('Market entry analysis failed:', err);
    }
  };

  const handleExportData = () => {
    const data = globalExpansionService.exportExpansionData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `global-expansion-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Loading Global Expansion Dashboard...</h2>
        <p>Fetching market data and expansion status...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <h2>Error Loading Global Expansion Dashboard</h2>
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
        <h1 style={{ color: '#2c3e50', margin: 0 }}>Global Market Expansion Dashboard</h1>
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
            <h3 style={{ color: '#007bff', margin: '0 0 5px 0' }}>Market Coverage</h3>
            <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>15%</p>
          </div>
          <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
            <h3 style={{ color: '#ffc107', margin: '0 0 5px 0' }}>Localization Progress</h3>
            <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>25%</p>
          </div>
          <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
            <h3 style={{ color: '#17a2b8', margin: '0 0 5px 0' }}>Expansion ROI</h3>
            <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>2.8x</p>
          </div>
        </div>
      </div>

      {/* Target Markets Status */}
      <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
        <h2 style={{ color: '#34495e', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>Target Markets Status</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
          {expansionData.targetMarkets && Object.entries(expansionData.targetMarkets.marketPerformance || {}).map(([marketKey, market]) => (
            <div key={marketKey} style={{ border: '1px solid #eee', borderRadius: '5px', padding: '15px', backgroundColor: '#fdfdfd' }}>
              <h3 style={{ color: '#2c3e50', marginTop: '0', marginBottom: '10px', fontSize: '16px' }}>{market.name}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', fontSize: '13px' }}>
                <div><strong>Priority:</strong> {market.priority}</div>
                <div><strong>Potential:</strong> ${market.potential.toLocaleString()}</div>
                <div><strong>Effort:</strong> {market.effort}</div>
                <div><strong>Timeframe:</strong> {market.timeframe}</div>
              </div>
              <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
                <div>Progress: {expansionData.targetMarkets.marketProgress?.[marketKey]?.progress ? (expansionData.targetMarkets.marketProgress[marketKey].progress * 100).toFixed(0) + '%' : '0%'}</div>
                <div>Status: {expansionData.targetMarkets.marketProgress?.[marketKey]?.status || 'Not started'}</div>
                <div>Users: {expansionData.targetMarkets.marketProgress?.[marketKey]?.users || 0}</div>
                <div>Revenue: ${expansionData.targetMarkets.marketProgress?.[marketKey]?.revenue || 0}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Localization Status */}
      <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
        <h2 style={{ color: '#34495e', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>Localization Status</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div>
            <h3 style={{ color: '#2c3e50', marginBottom: '10px' }}>Language Support</h3>
            <div style={{ fontSize: '13px' }}>
              {expansionData.localization && expansionData.localization.languages && expansionData.localization.languages.map((lang, index) => (
                <div key={index} style={{ marginBottom: '8px', padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                  <div><strong>{lang.language}</strong> - {lang.market}</div>
                  <div>Users: {lang.users.toLocaleString()}</div>
                  <div>Priority: {lang.priority} | Effort: {lang.effort}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 style={{ color: '#2c3e50', marginBottom: '10px' }}>Localization Progress</h3>
            <div style={{ fontSize: '13px' }}>
              {expansionData.localization && expansionData.localization.localizationProgress && Object.entries(expansionData.localization.localizationProgress).map(([lang, progress]) => (
                <div key={lang} style={{ marginBottom: '8px', padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                  <div><strong>{lang.charAt(0).toUpperCase() + lang.slice(1)}</strong></div>
                  <div>Progress: {(progress.progress * 100).toFixed(0)}%</div>
                  <div>Status: {progress.status}</div>
                  <div>Completion: {progress.completionDate}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Market Analysis */}
      <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
        <h2 style={{ color: '#34495e', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>Market Analysis</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div>
            <h3 style={{ color: '#2c3e50', marginBottom: '10px' }}>Competitive Landscape</h3>
            <div style={{ fontSize: '13px' }}>
              {expansionData.marketAnalysis && expansionData.marketAnalysis.competitiveLandscape && expansionData.marketAnalysis.competitiveLandscape.map((market, index) => (
                <div key={index} style={{ marginBottom: '8px', padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                  <div><strong>{market.region}</strong></div>
                  <div>Competitors: {market.competitors}</div>
                  <div>Market Share: {(market.marketShare * 100).toFixed(1)}%</div>
                  <div>Entry Barriers: {market.entryBarriers}</div>
                  <div>Opportunities: {market.opportunities}</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 style={{ color: '#2c3e50', marginBottom: '10px' }}>Market Opportunities</h3>
            <div style={{ fontSize: '13px' }}>
              {expansionData.marketAnalysis && expansionData.marketAnalysis.marketOpportunities && expansionData.marketAnalysis.marketOpportunities.map((opportunity, index) => (
                <div key={index} style={{ marginBottom: '8px', padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                  <div><strong>{opportunity.market}</strong></div>
                  <div>Opportunity: {opportunity.opportunity}</div>
                  <div>Potential: ${opportunity.potential.toLocaleString()}</div>
                  <div>Effort: {opportunity.effort}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Expansion Strategy */}
      <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
        <h2 style={{ color: '#34495e', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>Expansion Strategy</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <div>
            <h3 style={{ color: '#2c3e50', marginBottom: '10px' }}>Expansion Phases</h3>
            <div style={{ fontSize: '13px' }}>
              {expansionData.expansionStrategy && expansionData.expansionStrategy.phases && expansionData.expansionStrategy.phases.map((phase, index) => (
                <div key={index} style={{ marginBottom: '8px', padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                  <div><strong>{phase.phase}</strong></div>
                  <div>Markets: {phase.markets.join(', ')}</div>
                  <div>Duration: {phase.duration}</div>
                  <div>Investment: ${phase.investment.toLocaleString()}</div>
                  <div>Expected ROI: {phase.expectedROI}x</div>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 style={{ color: '#2c3e50', marginBottom: '10px' }}>Partnerships</h3>
            <div style={{ fontSize: '13px' }}>
              {expansionData.expansionStrategy && expansionData.expansionStrategy.partnerships && expansionData.expansionStrategy.partnerships.map((partnership, index) => (
                <div key={index} style={{ marginBottom: '8px', padding: '8px', backgroundColor: '#f8f9fa', borderRadius: '4px' }}>
                  <div><strong>{partnership.type}</strong></div>
                  <div>Markets: {partnership.markets.join(', ')}</div>
                  <div>Benefits: {partnership.benefits.join(', ')}</div>
                  <div>Cost: {partnership.cost}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Market Entry Interface */}
      <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
        <h2 style={{ color: '#34495e', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>Market Entry Analysis</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <h3 style={{ color: '#2c3e50', marginBottom: '10px' }}>Select Market for Entry Analysis</h3>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Market:</label>
              <select 
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                onChange={(e) => setSelectedMarket(e.target.value)}
                value={selectedMarket}
              >
                <option value="europe">Europe</option>
                <option value="asia">Asia</option>
                <option value="latinAmerica">Latin America</option>
                <option value="africa">Africa</option>
                <option value="oceania">Oceania</option>
              </select>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Entry Strategy:</label>
              <select style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}>
                <option value="direct">Direct Entry</option>
                <option value="partnership">Partnership</option>
                <option value="acquisition">Acquisition</option>
                <option value="franchise">Franchise</option>
              </select>
            </div>
            <button 
              onClick={() => handleMarketEntry(selectedMarket, 'direct')}
              style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Analyze Market Entry
            </button>
          </div>
          <div>
            <h3 style={{ color: '#2c3e50', marginBottom: '10px' }}>Entry Analysis Results</h3>
            {marketEntry.market ? (
              <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
                <div style={{ marginBottom: '10px' }}>
                  <strong>Market:</strong> {marketEntry.market.market}
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <strong>Market Size:</strong> ${marketEntry.market.analysis?.marketSize?.toLocaleString() || 0}
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <strong>Competition:</strong> {marketEntry.market.analysis?.competition || 0} competitors
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <strong>Entry Barriers:</strong> {marketEntry.market.analysis?.entryBarriers || 'medium'}
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <strong>Opportunities:</strong> {marketEntry.market.analysis?.opportunities || 'medium'}
                </div>
                <div>
                  <strong>Investment Required:</strong> ${marketEntry.investment?.total?.toLocaleString() || 0}
                </div>
              </div>
            ) : (
              <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px', color: '#666' }}>
                No market entry analysis yet. Use the interface to analyze market entry for your selected market.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h2 style={{ color: '#34495e', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>Performance Metrics</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          {expansionData.performance && Object.entries(expansionData.performance).map(([metricType, metrics]) => (
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

export default GlobalExpansionDashboard;
