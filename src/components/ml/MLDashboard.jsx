import React, { useEffect, useState } from 'react';
import advancedAIService from '../../services/advancedAIService';

const MLDashboard = () => {
  const [aiData, setAiData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedModel, setSelectedModel] = useState('gpt4');
  const [modelSelection, setModelSelection] = useState({});
  const [systemHealth, setSystemHealth] = useState({});

  useEffect(() => {
    const fetchAIData = async () => {
      try {
        setLoading(true);
        const response = await advancedAIService.getAIStatus();
        if (response.success) {
          setAiData(response.aiData);
          setSystemHealth(response.systemHealth);
        } else {
          setError(response.error);
        }
      } catch (err) {
        console.error('Failed to fetch AI data:', err);
        setError('Failed to load AI data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchAIData();
    const interval = setInterval(fetchAIData, 30000); // Refresh every 30 seconds
    return () => clearInterval(interval);
  }, []);

  const handleModelSelection = async (taskType, requirements) => {
    try {
      const response = await advancedAIService.executeModelSelection(taskType, requirements);
      if (response.success) {
        setModelSelection(response.selectionData);
      }
    } catch (err) {
      console.error('Model selection failed:', err);
    }
  };

  const handleExportData = () => {
    const data = advancedAIService.exportAIData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ai-data-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Loading AI Dashboard...</h2>
        <p>Fetching AI model data and system status...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <h2>Error Loading AI Dashboard</h2>
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
        <h1 style={{ color: '#2c3e50', margin: 0 }}>AI & Machine Learning Dashboard</h1>
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
            <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>{systemHealth.overall}</p>
          </div>
          <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
            <h3 style={{ color: '#007bff', margin: '0 0 5px 0' }}>Model Accuracy</h3>
            <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>{systemHealth.metrics?.modelAccuracy}%</p>
          </div>
          <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
            <h3 style={{ color: '#ffc107', margin: '0 0 5px 0' }}>Pipeline Efficiency</h3>
            <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>{systemHealth.metrics?.pipelineEfficiency}%</p>
          </div>
          <div style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
            <h3 style={{ color: '#17a2b8', margin: '0 0 5px 0' }}>Performance Score</h3>
            <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>{systemHealth.metrics?.performanceScore}%</p>
          </div>
        </div>
      </div>

      {/* AI Models Status */}
      <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
        <h2 style={{ color: '#34495e', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>AI Models Status</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '15px' }}>
          {aiData.models && Object.entries(aiData.models.modelPerformance || {}).map(([modelKey, model]) => (
            <div key={modelKey} style={{ border: '1px solid #eee', borderRadius: '5px', padding: '15px', backgroundColor: '#fdfdfd' }}>
              <h3 style={{ color: '#2c3e50', marginTop: '0', marginBottom: '10px', fontSize: '16px' }}>{model.name}</h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5px', fontSize: '13px' }}>
                <div><strong>Accuracy:</strong> {model.accuracy}%</div>
                <div><strong>Speed:</strong> {model.speed}%</div>
                <div><strong>Cost:</strong> {model.cost}%</div>
                <div><strong>Success Rate:</strong> {model.successRate}%</div>
              </div>
              <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
                <div>Usage: {aiData.models.modelUsage?.[modelKey]?.usageCount || 0} requests</div>
                <div>Last Used: {aiData.models.modelUsage?.[modelKey]?.lastUsed ? new Date(aiData.models.modelUsage[modelKey].lastUsed).toLocaleString() : 'Never'}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ML Pipeline Status */}
      <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
        <h2 style={{ color: '#34495e', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>ML Pipeline Status</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {aiData.mlPipeline && Object.entries(aiData.mlPipeline).map(([pipelineType, pipeline]) => (
            <div key={pipelineType} style={{ border: '1px solid #eee', borderRadius: '5px', padding: '15px', backgroundColor: '#fdfdfd' }}>
              <h3 style={{ color: '#2c3e50', marginTop: '0', marginBottom: '10px', fontSize: '16px', textTransform: 'capitalize' }}>{pipelineType}</h3>
              <div style={{ fontSize: '13px' }}>
                <div style={{ marginBottom: '5px' }}><strong>Status:</strong> <span style={{ color: pipeline.status === 'active' ? '#28a745' : '#dc3545' }}>{pipeline.status}</span></div>
                {pipeline.activeJobs !== undefined && <div style={{ marginBottom: '5px' }}><strong>Active Jobs:</strong> {pipeline.activeJobs}</div>}
                {pipeline.completedJobs !== undefined && <div style={{ marginBottom: '5px' }}><strong>Completed Jobs:</strong> {pipeline.completedJobs}</div>}
                {pipeline.failedJobs !== undefined && <div style={{ marginBottom: '5px' }}><strong>Failed Jobs:</strong> {pipeline.failedJobs}</div>}
                {pipeline.deployedModels !== undefined && <div style={{ marginBottom: '5px' }}><strong>Deployed Models:</strong> {pipeline.deployedModels}</div>}
                {pipeline.monitoredModels !== undefined && <div style={{ marginBottom: '5px' }}><strong>Monitored Models:</strong> {pipeline.monitoredModels}</div>}
                {pipeline.accuracy !== undefined && <div style={{ marginBottom: '5px' }}><strong>Accuracy:</strong> {pipeline.accuracy}%</div>}
                {pipeline.latency !== undefined && <div style={{ marginBottom: '5px' }}><strong>Latency:</strong> {pipeline.latency}ms</div>}
                {pipeline.performanceScore !== undefined && <div style={{ marginBottom: '5px' }}><strong>Performance Score:</strong> {pipeline.performanceScore}%</div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Personalization Engine Status */}
      <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
        <h2 style={{ color: '#34495e', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>Personalization Engine Status</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          {aiData.personalization && Object.entries(aiData.personalization).map(([engineType, engine]) => (
            <div key={engineType} style={{ border: '1px solid #eee', borderRadius: '5px', padding: '15px', backgroundColor: '#fdfdfd' }}>
              <h3 style={{ color: '#2c3e50', marginTop: '0', marginBottom: '10px', fontSize: '16px', textTransform: 'capitalize' }}>{engineType.replace(/([A-Z])/g, ' $1')}</h3>
              <div style={{ fontSize: '13px' }}>
                <div style={{ marginBottom: '5px' }}><strong>Status:</strong> <span style={{ color: engine.status === 'active' ? '#28a745' : '#dc3545' }}>{engine.status}</span></div>
                {engine.accuracy !== undefined && <div style={{ marginBottom: '5px' }}><strong>Accuracy:</strong> {engine.accuracy}%</div>}
                {engine.quality !== undefined && <div style={{ marginBottom: '5px' }}><strong>Quality:</strong> {engine.quality}%</div>}
                {engine.effectiveness !== undefined && <div style={{ marginBottom: '5px' }}><strong>Effectiveness:</strong> {engine.effectiveness}%</div>}
                {engine.recommendationsGenerated !== undefined && <div style={{ marginBottom: '5px' }}><strong>Recommendations:</strong> {engine.recommendationsGenerated.toLocaleString()}</div>}
                {engine.insightsGenerated !== undefined && <div style={{ marginBottom: '5px' }}><strong>Insights:</strong> {engine.insightsGenerated.toLocaleString()}</div>}
                {engine.predictionsGenerated !== undefined && <div style={{ marginBottom: '5px' }}><strong>Predictions:</strong> {engine.predictionsGenerated.toLocaleString()}</div>}
                {engine.contentGenerated !== undefined && <div style={{ marginBottom: '5px' }}><strong>Content:</strong> {engine.contentGenerated.toLocaleString()}</div>}
                {engine.pathsOptimized !== undefined && <div style={{ marginBottom: '5px' }}><strong>Paths Optimized:</strong> {engine.pathsOptimized.toLocaleString()}</div>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Model Selection Interface */}
      <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
        <h2 style={{ color: '#34495e', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>Model Selection Interface</h2>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
          <div>
            <h3 style={{ color: '#2c3e50', marginBottom: '10px' }}>Select Model for Task</h3>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Task Type:</label>
              <select 
                style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
                onChange={(e) => setSelectedModel(e.target.value)}
                value={selectedModel}
              >
                <option value="text-generation">Text Generation</option>
                <option value="analysis">Analysis</option>
                <option value="translation">Translation</option>
                <option value="summarization">Summarization</option>
              </select>
            </div>
            <div style={{ marginBottom: '10px' }}>
              <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>Performance Priority:</label>
              <select style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}>
                <option value="accuracy">Accuracy</option>
                <option value="speed">Speed</option>
                <option value="cost">Cost</option>
              </select>
            </div>
            <button 
              onClick={() => handleModelSelection(selectedModel, { performance: 'accuracy', speed: 'fast', cost: 'medium' })}
              style={{ padding: '10px 20px', backgroundColor: '#007bff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
            >
              Select Optimal Model
            </button>
          </div>
          <div>
            <h3 style={{ color: '#2c3e50', marginBottom: '10px' }}>Selection Results</h3>
            {modelSelection.selectedModel ? (
              <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
                <div style={{ marginBottom: '10px' }}>
                  <strong>Selected Model:</strong> {modelSelection.selectedModel.selectedModel}
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <strong>Score:</strong> {modelSelection.selectedModel.score}
                </div>
                <div style={{ marginBottom: '10px' }}>
                  <strong>Reasoning:</strong> {modelSelection.selectedModel.reasoning}
                </div>
                <div>
                  <strong>Alternatives:</strong> {modelSelection.selectedModel.alternatives?.join(', ')}
                </div>
              </div>
            ) : (
              <div style={{ padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px', color: '#666' }}>
                No model selected yet. Use the interface to select an optimal model for your task.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Performance Metrics */}
      <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
        <h2 style={{ color: '#34495e', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>Performance Metrics</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          {aiData.performance && Object.entries(aiData.performance).map(([metricType, metrics]) => (
            <div key={metricType} style={{ border: '1px solid #eee', borderRadius: '5px', padding: '15px', backgroundColor: '#fdfdfd' }}>
              <h3 style={{ color: '#2c3e50', marginTop: '0', marginBottom: '10px', fontSize: '16px', textTransform: 'capitalize' }}>{metricType.replace(/([A-Z])/g, ' $1')}</h3>
              <div style={{ fontSize: '13px' }}>
                {Object.entries(metrics).map(([key, value]) => (
                  <div key={key} style={{ marginBottom: '5px' }}>
                    <strong>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</strong> {value}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* A/B Testing Status */}
      <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', marginBottom: '30px' }}>
        <h2 style={{ color: '#34495e', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>A/B Testing Status</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          {aiData.abTesting && Object.entries(aiData.abTesting).map(([key, value]) => (
            <div key={key} style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
              <h3 style={{ color: '#007bff', margin: '0 0 5px 0', fontSize: '14px', textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}</h3>
              <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>{value}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Fallback System Status */}
      <div style={{ backgroundColor: '#ffffff', padding: '20px', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <h2 style={{ color: '#34495e', borderBottom: '1px solid #eee', paddingBottom: '10px', marginBottom: '15px' }}>Fallback System Status</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '15px' }}>
          {aiData.fallback && Object.entries(aiData.fallback).map(([key, value]) => (
            <div key={key} style={{ textAlign: 'center', padding: '15px', backgroundColor: '#f8f9fa', borderRadius: '5px' }}>
              <h3 style={{ color: '#28a745', margin: '0 0 5px 0', fontSize: '14px', textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}</h3>
              <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>{value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default MLDashboard;