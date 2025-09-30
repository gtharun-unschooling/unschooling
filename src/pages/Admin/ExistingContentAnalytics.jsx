import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ExistingContentAnalytics = () => {
  const navigate = useNavigate();
  const [topicsData, setTopicsData] = useState([]);
  const [nichesData, setNichesData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedNiche, setSelectedNiche] = useState('all');
  const [selectedAge, setSelectedAge] = useState('all');

  useEffect(() => {
    loadExistingData();
  }, []);

  const loadExistingData = async () => {
    try {
      // Load topics data
      const topicsResponse = await fetch('/topicsdata.json');
      const topics = await topicsResponse.json();
      setTopicsData(topics);

      // Load niches data
      const nichesResponse = await fetch('/nichesdata.json');
      const niches = await nichesResponse.json();
      setNichesData(niches);
    } catch (error) {
      console.error('Error loading existing data:', error);
    } finally {
      setLoading(false);
    }
  };

  // Calculate statistics
  const getStatistics = () => {
    const totalTopics = topicsData.length;
    const niches = [...new Set(topicsData.map(topic => topic.Niche))];
    const ageGroups = [...new Set(topicsData.map(topic => topic.Age))].sort((a, b) => a - b);
    
    // Count by niche
    const nicheCounts = niches.reduce((acc, niche) => {
      acc[niche] = topicsData.filter(topic => topic.Niche === niche).length;
      return acc;
    }, {});

    // Count by age
    const ageCounts = ageGroups.reduce((acc, age) => {
      acc[age] = topicsData.filter(topic => topic.Age === age).length;
      return acc;
    }, {});

    // Count by niche and age
    const nicheAgeMatrix = niches.reduce((acc, niche) => {
      acc[niche] = ageGroups.reduce((ageAcc, age) => {
        ageAcc[age] = topicsData.filter(topic => topic.Niche === niche && topic.Age === age).length;
        return ageAcc;
      }, {});
      return acc;
    }, {});

    return {
      totalTopics,
      niches,
      ageGroups,
      nicheCounts,
      ageCounts,
      nicheAgeMatrix
    };
  };

  const stats = getStatistics();

  // Filter data based on selections
  const filteredTopics = topicsData.filter(topic => {
    const nicheMatch = selectedNiche === 'all' || topic.Niche === selectedNiche;
    const ageMatch = selectedAge === 'all' || topic.Age === parseInt(selectedAge);
    return nicheMatch && ageMatch;
  });

  const getNicheColor = (niche) => {
    const nicheData = nichesData.find(n => n.Niche === niche);
    return nicheData ? nicheData.Color : '#6b7280';
  };

  const getAgeGroupLabel = (age) => {
    if (age >= 3 && age <= 5) return 'Early Childhood (3-5)';
    if (age >= 6 && age <= 8) return 'Primary (6-8)';
    if (age >= 9 && age <= 12) return 'Elementary (9-12)';
    return `Age ${age}`;
  };

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
        padding: '20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '1.5rem', color: '#64748b', marginBottom: '16px' }}>
            📊 Loading your existing content...
          </div>
          <div style={{ fontSize: '1rem', color: '#9ca3af' }}>
            Analyzing {stats.totalTopics} topics across {stats.niches.length} niches
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '32px',
        marginBottom: '24px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h1 style={{ margin: '0 0 8px 0', fontSize: '2.5rem', fontWeight: '700', color: '#1e293b' }}>
              📊 Existing Content Analytics
            </h1>
            <p style={{ margin: 0, color: '#64748b', fontSize: '1.1rem' }}>
              Complete overview of your {stats.totalTopics} existing topics across {stats.niches.length} niches
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/content')}
            style={{
              padding: '12px 24px',
              background: '#3b82f6',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}
          >
            ← Back to Content Management
          </button>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
              Filter by Niche:
            </label>
            <select
              value={selectedNiche}
              onChange={(e) => setSelectedNiche(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '0.9rem'
              }}
            >
              <option value="all">All Niches</option>
              {stats.niches.map(niche => (
                <option key={niche} value={niche}>{niche}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#374151' }}>
              Filter by Age:
            </label>
            <select
              value={selectedAge}
              onChange={(e) => setSelectedAge(e.target.value)}
              style={{
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '0.9rem'
              }}
            >
              <option value="all">All Ages</option>
              {stats.ageGroups.map(age => (
                <option key={age} value={age}>Age {age}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Statistics Overview */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '32px',
        marginBottom: '24px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{ margin: '0 0 24px 0', fontSize: '1.5rem', fontWeight: '600', color: '#1e293b' }}>
          📈 Content Statistics Overview
        </h3>
        
        {/* Main Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          <div style={{
            padding: '24px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '8px' }}>
              {stats.totalTopics}
            </div>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Total Topics</div>
          </div>
          
          <div style={{
            padding: '24px',
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            color: 'white',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '8px' }}>
              {stats.niches.length}
            </div>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Niches</div>
          </div>
          
          <div style={{
            padding: '24px',
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: 'white',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '8px' }}>
              {stats.ageGroups.length}
            </div>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Age Groups</div>
          </div>
          
          <div style={{
            padding: '24px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: 'white',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '8px' }}>
              {filteredTopics.length}
            </div>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Filtered Results</div>
          </div>
        </div>

        {/* Niche Breakdown */}
        <div style={{ marginBottom: '32px' }}>
          <h4 style={{ margin: '0 0 16px 0', fontSize: '1.2rem', fontWeight: '600', color: '#1e293b' }}>
            🎯 Topics by Niche
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '16px' }}>
            {stats.niches.map(niche => (
              <div key={niche} style={{
                padding: '20px',
                background: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                borderLeft: `4px solid ${getNicheColor(niche)}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                  <h5 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600', color: '#1e293b' }}>
                    {niche}
                  </h5>
                  <span style={{
                    padding: '4px 12px',
                    background: getNicheColor(niche),
                    color: 'white',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '600'
                  }}>
                    {stats.nicheCounts[niche]} topics
                  </span>
                </div>
                <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                  {Math.round((stats.nicheCounts[niche] / stats.totalTopics) * 100)}% of total content
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Age Group Breakdown */}
        <div style={{ marginBottom: '32px' }}>
          <h4 style={{ margin: '0 0 16px 0', fontSize: '1.2rem', fontWeight: '600', color: '#1e293b' }}>
            👶 Topics by Age Group
          </h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
            {stats.ageGroups.map(age => (
              <div key={age} style={{
                padding: '20px',
                background: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <h5 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600', color: '#1e293b' }}>
                    Age {age}
                  </h5>
                  <span style={{
                    padding: '4px 12px',
                    background: '#3b82f6',
                    color: 'white',
                    borderRadius: '20px',
                    fontSize: '0.8rem',
                    fontWeight: '600'
                  }}>
                    {stats.ageCounts[age]} topics
                  </span>
                </div>
                <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                  {getAgeGroupLabel(age)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Niche vs Age Matrix */}
        <div>
          <h4 style={{ margin: '0 0 16px 0', fontSize: '1.2rem', fontWeight: '600', color: '#1e293b' }}>
            📊 Content Matrix: Niche × Age Group
          </h4>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', background: 'white', borderRadius: '8px', overflow: 'hidden' }}>
              <thead>
                <tr style={{ background: '#f8fafc' }}>
                  <th style={{ padding: '12px', textAlign: 'left', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
                    Niche
                  </th>
                  {stats.ageGroups.map(age => (
                    <th key={age} style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
                      Age {age}
                    </th>
                  ))}
                  <th style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#374151', borderBottom: '1px solid #e5e7eb' }}>
                    Total
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.niches.map(niche => (
                  <tr key={niche}>
                    <td style={{ padding: '12px', fontWeight: '600', color: '#1e293b', borderBottom: '1px solid #e5e7eb' }}>
                      {niche}
                    </td>
                    {stats.ageGroups.map(age => (
                      <td key={age} style={{ padding: '12px', textAlign: 'center', borderBottom: '1px solid #e5e7eb' }}>
                        <span style={{
                          padding: '4px 8px',
                          background: stats.nicheAgeMatrix[niche][age] > 0 ? '#dbeafe' : '#f3f4f6',
                          color: stats.nicheAgeMatrix[niche][age] > 0 ? '#1e40af' : '#6b7280',
                          borderRadius: '4px',
                          fontSize: '0.8rem',
                          fontWeight: '500'
                        }}>
                          {stats.nicheAgeMatrix[niche][age]}
                        </span>
                      </td>
                    ))}
                    <td style={{ padding: '12px', textAlign: 'center', fontWeight: '600', color: '#1e293b', borderBottom: '1px solid #e5e7eb' }}>
                      {stats.nicheCounts[niche]}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Filtered Topics List */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '1.5rem', fontWeight: '600', color: '#1e293b' }}>
          📝 {filteredTopics.length} Topics Found
        </h3>
        
        {filteredTopics.length > 0 ? (
          <div style={{ display: 'grid', gap: '16px' }}>
            {filteredTopics.slice(0, 20).map((topic, index) => (
              <div key={index} style={{
                padding: '20px',
                background: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                borderLeft: `4px solid ${getNicheColor(topic.Niche)}`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ flex: 1 }}>
                    <h4 style={{ margin: '0 0 8px 0', fontSize: '1.1rem', fontWeight: '600', color: '#1e293b' }}>
                      {topic.Topic}
                    </h4>
                    <p style={{ margin: '0 0 12px 0', color: '#64748b', fontSize: '0.9rem' }}>
                      {topic.Objective}
                    </p>
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                      <span style={{
                        padding: '4px 8px',
                        background: getNicheColor(topic.Niche),
                        color: 'white',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: '500'
                      }}>
                        {topic.Niche}
                      </span>
                      <span style={{
                        padding: '4px 8px',
                        background: '#fef3c7',
                        color: '#92400e',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: '500'
                      }}>
                        Age {topic.Age}
                      </span>
                      <span style={{
                        padding: '4px 8px',
                        background: '#dbeafe',
                        color: '#1e40af',
                        borderRadius: '4px',
                        fontSize: '0.75rem',
                        fontWeight: '500'
                      }}>
                        {topic['Estimated Time']}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {filteredTopics.length > 20 && (
              <div style={{ textAlign: 'center', padding: '20px', color: '#64748b' }}>
                ... and {filteredTopics.length - 20} more topics
              </div>
            )}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
            No topics found with the current filters
          </div>
        )}
      </div>
    </div>
  );
};

export default ExistingContentAnalytics;
