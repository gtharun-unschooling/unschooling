import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RealAgentTesting = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [error, setError] = useState(null);
  const [testProfile, setTestProfile] = useState({
    child_name: "Test Child",
    child_age: 7,
    interests: ["AI", "Science", "Technology"],
    preferred_learning_style: "visual",
    goals: ["problem-solving", "creativity"],
    plan_type: "hybrid"
  });

  const runRealAgentTest = async () => {
    setIsLoading(true);
    setError(null);
    setTestResults(null);

    try {
      console.log('🧪 Starting Real Agent Test...');
      console.log('📋 Test Profile:', testProfile);

      const startTime = Date.now();
      
      // Call the actual backend API
      const response = await fetch('https://unschooling-backend-790275794964.us-central1.run.app/api/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'unschooling-api-key-2024',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ profile: testProfile })
      });

      const endTime = Date.now();
      const totalTime = endTime - startTime;

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      console.log('✅ Agent System Response:', data);

      // Analyze the response
      const analysis = analyzeAgentResponse(data, totalTime);
      setTestResults(analysis);

    } catch (err) {
      console.error('❌ Agent Test Failed:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const analyzeAgentResponse = (data, totalTime) => {
    const analysis = {
      timestamp: new Date().toISOString(),
      totalResponseTime: totalTime,
      success: data.success,
      message: data.message,
      agentFlow: data.agent_flow,
      realAgents: data.real_agents,
      agentTimings: data.agent_timings || {},
      llmIntegration: data.llm_integration || {},
      dataAnalysis: {},
      issues: [],
      recommendations: []
    };

    // Analyze the data structure
    if (data.data) {
      analysis.dataAnalysis = {
        hasMatchedTopics: !!data.data.matched_topics,
        matchedTopicsCount: data.data.matched_topics?.length || 0,
        hasWeeklyPlan: !!data.data.weekly_plan,
        weeklyPlanWeeks: Object.keys(data.data.weekly_plan || {}).length,
        hasProfileAnalysis: !!data.data.profile_analysis,
        hasLearningRecommendations: !!data.data.learning_recommendations
      };

      // Check for issues
      if (analysis.dataAnalysis.matchedTopicsCount < 28) {
        analysis.issues.push(`Only ${analysis.dataAnalysis.matchedTopicsCount} topics matched (need 28 for full plan)`);
      }

      if (analysis.dataAnalysis.weeklyPlanWeeks < 4) {
        analysis.issues.push(`Only ${analysis.dataAnalysis.weeklyPlanWeeks} weeks in plan (need 4 weeks)`);
      }

      if (!analysis.dataAnalysis.hasProfileAnalysis) {
        analysis.issues.push('Profile analysis missing from response');
      }

      if (!analysis.dataAnalysis.hasLearningRecommendations) {
        analysis.issues.push('Learning recommendations missing from response');
      }
    }

    // Analyze agent timings
    if (analysis.agentTimings) {
      const agents = Object.keys(analysis.agentTimings);
      if (agents.length < 4) {
        analysis.issues.push(`Only ${agents.length} agents executed (need 4: Profile, Match, Schedule, Reviewer)`);
      }

      // Check for slow agents
      Object.entries(analysis.agentTimings).forEach(([agent, timing]) => {
        if (timing.execution_time_seconds > 5) {
          analysis.issues.push(`${agent} took ${timing.execution_time_seconds}s (slow)`);
        }
      });
    }

    // Analyze LLM integration
    if (analysis.llmIntegration) {
      if (!analysis.llmIntegration.gemini_available) {
        analysis.issues.push('Gemini LLM not available (using fallback mode)');
      }

      const llmUsage = [
        analysis.llmIntegration.profile_agent_llm_used,
        analysis.llmIntegration.schedule_agent_llm_used,
        analysis.llmIntegration.reviewer_agent_llm_used
      ].filter(Boolean).length;

      if (llmUsage === 0) {
        analysis.issues.push('No LLM integration used (all agents in fallback mode)');
      }
    }

    // Generate recommendations
    if (analysis.issues.length === 0) {
      analysis.recommendations.push('✅ All agents working correctly');
    } else {
      analysis.recommendations.push('🔧 Configure Gemini API for enhanced LLM features');
      analysis.recommendations.push('📚 Ensure topic database has 28+ topics available');
      analysis.recommendations.push('⚡ Optimize agent execution times');
    }

    return analysis;
  };

  const updateTestProfile = (field, value) => {
    setTestProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const updateInterests = (interest, checked) => {
    setTestProfile(prev => ({
      ...prev,
      interests: checked 
        ? [...prev.interests, interest]
        : prev.interests.filter(i => i !== interest)
    }));
  };

  const updateGoals = (goal, checked) => {
    setTestProfile(prev => ({
      ...prev,
      goals: checked 
        ? [...prev.goals, goal]
        : prev.goals.filter(g => g !== goal)
    }));
  };

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
              🧪 Real Agent Performance Testing
            </h1>
            <p style={{ margin: 0, color: '#64748b', fontSize: '1.1rem' }}>
              Test your 4-agent system with real profile data and get detailed performance analysis
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/agents')}
            style={{
              padding: '12px 24px',
              background: '#6b7280',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600'
            }}
          >
            ← Back to Agent Reports
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Test Profile Configuration */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e2e8f0'
        }}>
          <h2 style={{ margin: '0 0 20px 0', fontSize: '1.5rem', fontWeight: '600', color: '#1e293b' }}>
            📋 Test Profile Configuration
          </h2>

          {/* Basic Information */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
              Child Name
            </label>
            <input
              type="text"
              value={testProfile.child_name}
              onChange={(e) => updateTestProfile('child_name', e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            />
          </div>

          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
              Age
            </label>
            <select
              value={testProfile.child_age}
              onChange={(e) => updateTestProfile('child_age', parseInt(e.target.value))}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            >
              {[5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(age => (
                <option key={age} value={age}>{age} years old</option>
              ))}
            </select>
          </div>

          {/* Interests */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', color: '#374151' }}>
              Interests
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              {['AI', 'Science', 'Technology', 'Art', 'Music', 'Mathematics', 'Reading', 'Sports', 'Nature', 'Cooking'].map(interest => (
                <label key={interest} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={testProfile.interests.includes(interest)}
                    onChange={(e) => updateInterests(interest, e.target.checked)}
                  />
                  <span>{interest}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Learning Style */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
              Learning Style
            </label>
            <select
              value={testProfile.preferred_learning_style}
              onChange={(e) => updateTestProfile('preferred_learning_style', e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            >
              <option value="visual">Visual</option>
              <option value="auditory">Auditory</option>
              <option value="kinesthetic">Kinesthetic</option>
              <option value="mixed">Mixed</option>
            </select>
          </div>

          {/* Goals */}
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '12px', fontWeight: '600', color: '#374151' }}>
              Goals
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
              {['problem-solving', 'creativity', 'critical-thinking', 'communication', 'collaboration', 'independence'].map(goal => (
                <label key={goal} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <input
                    type="checkbox"
                    checked={testProfile.goals.includes(goal)}
                    onChange={(e) => updateGoals(goal, e.target.checked)}
                  />
                  <span style={{ textTransform: 'capitalize' }}>{goal.replace('-', ' ')}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Plan Type */}
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
              Plan Type
            </label>
            <select
              value={testProfile.plan_type}
              onChange={(e) => updateTestProfile('plan_type', e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '1rem'
              }}
            >
              <option value="hybrid">Hybrid</option>
              <option value="fusion">Fusion</option>
              <option value="traditional">Traditional</option>
            </select>
          </div>

          {/* Run Test Button */}
          <button
            onClick={runRealAgentTest}
            disabled={isLoading}
            style={{
              width: '100%',
              padding: '16px',
              background: isLoading ? '#9ca3af' : '#3b82f6',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              fontSize: '1.1rem',
              fontWeight: '600'
            }}
          >
            {isLoading ? '🔄 Testing Agents...' : '🧪 Run Real Agent Test'}
          </button>
        </div>

        {/* Test Results */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e2e8f0'
        }}>
          <h2 style={{ margin: '0 0 20px 0', fontSize: '1.5rem', fontWeight: '600', color: '#1e293b' }}>
            📊 Test Results
          </h2>

          {isLoading && (
            <div style={{ textAlign: 'center', padding: '40px' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🔄</div>
              <p style={{ color: '#64748b' }}>Testing agent system...</p>
              <p style={{ fontSize: '0.9rem', color: '#9ca3af' }}>This may take 3-5 seconds</p>
            </div>
          )}

          {error && (
            <div style={{
              padding: '20px',
              background: '#fef2f2',
              border: '2px solid #ef4444',
              borderRadius: '8px',
              marginBottom: '20px'
            }}>
              <h3 style={{ margin: '0 0 8px 0', color: '#dc2626' }}>❌ Test Failed</h3>
              <p style={{ margin: 0, color: '#991b1b' }}>{error}</p>
            </div>
          )}

          {testResults && (
            <div>
              {/* Summary */}
              <div style={{
                padding: '20px',
                background: testResults.success ? '#f0fdf4' : '#fef2f2',
                border: `2px solid ${testResults.success ? '#22c55e' : '#ef4444'}`,
                borderRadius: '8px',
                marginBottom: '20px'
              }}>
                <h3 style={{ margin: '0 0 12px 0', color: testResults.success ? '#166534' : '#dc2626' }}>
                  {testResults.success ? '✅ Test Passed' : '❌ Test Failed'}
                </h3>
                <p style={{ margin: '0 0 8px 0', color: '#374151' }}>{testResults.message}</p>
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#6b7280' }}>
                  Response Time: {testResults.totalResponseTime}ms
                </p>
              </div>

              {/* Agent Flow */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ margin: '0 0 8px 0', color: '#1e293b' }}>🔄 Agent Flow</h4>
                <p style={{ margin: 0, color: '#64748b' }}>{testResults.agentFlow}</p>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.9rem', color: '#9ca3af' }}>
                  Real Agents: {testResults.realAgents ? 'Yes' : 'No'}
                </p>
              </div>

              {/* Data Analysis */}
              {testResults.dataAnalysis && (
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ margin: '0 0 12px 0', color: '#1e293b' }}>📊 Data Analysis</h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                    <div style={{ padding: '8px', background: '#f8fafc', borderRadius: '4px' }}>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Topics Matched</div>
                      <div style={{ fontWeight: '600', color: '#1e293b' }}>
                        {testResults.dataAnalysis.matchedTopicsCount}
                      </div>
                    </div>
                    <div style={{ padding: '8px', background: '#f8fafc', borderRadius: '4px' }}>
                      <div style={{ fontSize: '0.8rem', color: '#64748b' }}>Weekly Plan</div>
                      <div style={{ fontWeight: '600', color: '#1e293b' }}>
                        {testResults.dataAnalysis.weeklyPlanWeeks} weeks
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Issues */}
              {testResults.issues.length > 0 && (
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ margin: '0 0 12px 0', color: '#dc2626' }}>⚠️ Issues Found</h4>
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    {testResults.issues.map((issue, index) => (
                      <li key={index} style={{ color: '#991b1b', marginBottom: '4px' }}>
                        {issue}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Recommendations */}
              {testResults.recommendations.length > 0 && (
                <div>
                  <h4 style={{ margin: '0 0 12px 0', color: '#1e293b' }}>💡 Recommendations</h4>
                  <ul style={{ margin: 0, paddingLeft: '20px' }}>
                    {testResults.recommendations.map((rec, index) => (
                      <li key={index} style={{ color: '#374151', marginBottom: '4px' }}>
                        {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {!isLoading && !error && !testResults && (
            <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
              <div style={{ fontSize: '3rem', marginBottom: '16px' }}>🧪</div>
              <p>Configure your test profile and click "Run Real Agent Test" to begin</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RealAgentTesting;
