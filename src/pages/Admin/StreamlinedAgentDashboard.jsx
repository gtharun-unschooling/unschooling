/**
 * Clean Agent Performance Dashboard
 * Shows only: LLM Input/Output + Agent Input/Output for each agent
 * Auto-updates when child is selected
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const StreamlinedAgentDashboard = () => {
  const navigate = useNavigate();
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadChildren();
  }, []);

  // Auto-run tests when child is selected
  useEffect(() => {
    if (selectedChild) {
      runAgentTest(selectedChild);
    }
  }, [selectedChild]);

  // Load children from Firestore
  const loadChildren = async () => {
    try {
      console.log('🔍 Loading children from Firestore...');
      const { collection, getDocs } = await import('firebase/firestore');
      const { db } = await import('../../firebase');
      
      const usersRef = collection(db, 'users');
      const usersSnapshot = await getDocs(usersRef);
      
      console.log('📊 Users found:', usersSnapshot.size);
      
      if (usersSnapshot.empty) {
        console.log('⚠️ No users found in database');
        setChildren([]);
        return;
      }
      
      const allChildren = [];
      
      for (const userDoc of usersSnapshot.docs) {
        const userId = userDoc.id;
        const userData = userDoc.data();
        console.log(`👤 Processing user: ${userId}`, userData);
        
        const childrenRef = collection(db, `users/${userId}/children`);
        const childrenSnapshot = await getDocs(childrenRef);
        
        console.log(`👶 Children found for user ${userId}:`, childrenSnapshot.size);
        
        childrenSnapshot.forEach((childDoc) => {
          const childData = childDoc.data();
          console.log(`👶 Child data:`, childData);
          allChildren.push({
            id: childDoc.id,
            userId: userId,
            name: childData.name || childData.child_name || 'Unknown',
            age: childData.age || childData.child_age || 0,
            interests: childData.interests || [],
            learningStyle: childData.learningStyle || childData.learning_style || 'visual',
            planType: childData.planType || childData.plan_type || 'hybrid',
            goals: childData.goals || [],
            ...childData
          });
        });
      }
      
      console.log('✅ Total children loaded:', allChildren.length);
      setChildren(allChildren);
    } catch (error) {
      console.error('❌ Error loading children:', error);
      setError(`Failed to load children: ${error.message}`);
    }
  };

  const runAgentTest = async (child) => {
    setIsLoading(true);
    setError(null);
    setTestResults(null);

    try {
      // Create test profile using real child data
      const testProfile = {
        child_name: child.name,
        child_age: child.age,
        interests: child.interests && child.interests.length > 0 ? child.interests : ["AI", "Science"],
        learning_style: child.learningStyle || "visual",
        plan_type: child.planType || "hybrid"
      };

      const response = await fetch('https://unschooling-backend-790275794964.us-central1.run.app/api/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'unschooling-api-key-2024',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ profile: testProfile })
      });

      if (response.ok) {
        const data = await response.json();
        console.log('📊 Backend response:', data);
        
        // Extract clean agent data - only what's actually generated for this child
        const agentResults = {};
        
        // Profile Agent - using actual backend structure
        if (data.data?.profile_analysis) {
          agentResults.profileAgent = {
            success: true,
            executionTime: data.agent_timings?.profile_agent?.execution_time_seconds || 0,
            llmInput: `Child Profile: ${child.name}, Age: ${child.age}, Interests: ${child.interests?.join(', ') || 'None'}, Learning Style: ${child.learningStyle || 'Not specified'}`,
            llmOutput: data.data.profile_analysis?.llm_insights || {},
            agentInput: testProfile,
            agentOutput: {
              profile_analysis: data.data.profile_analysis,
              child_profile: data.data.child_profile,
              preferred_activities: data.data.profile_analysis?.preferred_activities || [],
              cognitive_assessment: data.data.profile_analysis?.llm_insights?.cognitive_assessment || {},
              attention_span: data.data.profile_analysis?.llm_insights?.attention_span || {}
            }
          };
        }

        // Match Agent - using actual backend structure
        if (data.data?.matched_topics) {
          agentResults.matchAgent = {
            success: true,
            executionTime: data.agent_timings?.match_agent?.execution_time_seconds || 0,
            llmInput: `Profile Analysis + Topics Database (${data.data.matched_topics?.length || 0} topics available)`,
            llmOutput: data.data.match_analysis || {},
            agentInput: data.data.profile_analysis,
            agentOutput: {
              matched_topics: data.data.matched_topics || [],
              completed_topics: data.data.completed_topics || [],
              available_niches: data.data.available_niches || []
            }
          };
        }

        // Schedule Agent - using actual backend structure
        if (data.data?.weekly_plan) {
          agentResults.scheduleAgent = {
            success: true,
            executionTime: data.agent_timings?.schedule_agent?.execution_time_seconds || 0,
            llmInput: `Matched Topics + Profile Analysis + Scheduling Logic`,
            llmOutput: data.data.schedule_analysis || {},
            agentInput: {
              profile_analysis: data.data.profile_analysis,
              matched_topics: data.data.matched_topics
            },
            agentOutput: {
              weekly_plan: data.data.weekly_plan,
              learning_objectives: data.data.learning_objectives || [],
              recommended_activities: data.data.recommended_activities || []
            }
          };
        }

        // Reviewer Agent - using actual backend structure
        if (data.data?.review_insights) {
          agentResults.reviewerAgent = {
            success: true,
            executionTime: data.agent_timings?.reviewer_agent?.execution_time_seconds || 0,
            llmInput: `Complete Schedule + Weekly Plan + Learning Objectives`,
            llmOutput: data.data.llm_raw_output || {},
            agentInput: {
              weekly_plan: data.data.weekly_plan,
              learning_objectives: data.data.learning_objectives,
              matched_topics: data.data.matched_topics
            },
            agentOutput: {
              review_insights: data.data.review_insights,
              daily_tasks: data.data.daily_tasks || {},
              final_plan: data.data.final_plan || {}
            }
          };
        }

        setTestResults({
          childName: child.name,
          success: data.success || true,
          responseTime: data.agent_timings?.total_time || 0,
          agentResults: agentResults,
          timestamp: new Date().toISOString()
        });

      } else {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error running agent test:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderAgentCard = (agentName, agentData) => {
    if (!agentData) return null;

    return (
      <div key={agentName} style={{
        border: '1px solid #e5e7eb',
        borderRadius: '8px',
        padding: '16px',
        marginBottom: '16px',
        backgroundColor: '#ffffff'
      }}>
        <h3 style={{
          margin: '0 0 16px 0',
          fontSize: '1.1rem',
          fontWeight: '600',
          color: '#374151',
          textTransform: 'capitalize'
        }}>
          {agentName.replace('Agent', ' Agent')}
          <span style={{
            marginLeft: '8px',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '0.8rem',
            backgroundColor: agentData.success ? '#dcfce7' : '#fef2f2',
            color: agentData.success ? '#166534' : '#dc2626'
          }}>
            {agentData.success ? '✅ Success' : '❌ Failed'}
          </span>
          <span style={{
            marginLeft: '8px',
            fontSize: '0.8rem',
            color: '#6b7280'
          }}>
            ({agentData.executionTime?.toFixed(2)}s)
          </span>
        </h3>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
          {/* LLM Input/Output */}
          <div>
            <h4 style={{
              margin: '0 0 8px 0',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#dc2626',
              borderBottom: '1px solid #fecaca',
              paddingBottom: '4px'
            }}>
              🤖 LLM Input/Output
            </h4>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>Input:</div>
              <div style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '4px',
                padding: '8px',
                fontSize: '0.8rem',
                color: '#991b1b',
                fontFamily: 'monospace'
              }}>
                {agentData.llmInput}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>Output:</div>
              <div style={{
                background: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: '4px',
                padding: '8px',
                fontSize: '0.8rem',
                color: '#991b1b',
                fontFamily: 'monospace',
                maxHeight: '150px',
                overflowY: 'auto'
              }}>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                  {JSON.stringify(agentData.llmOutput, null, 2)}
                </pre>
              </div>
            </div>
          </div>

          {/* Agent Input/Output */}
          <div>
            <h4 style={{
              margin: '0 0 8px 0',
              fontSize: '0.9rem',
              fontWeight: '600',
              color: '#059669',
              borderBottom: '1px solid #bbf7d0',
              paddingBottom: '4px'
            }}>
              🎯 Agent Input/Output
            </h4>
            <div style={{ marginBottom: '12px' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>Input:</div>
              <div style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '4px',
                padding: '8px',
                fontSize: '0.8rem',
                color: '#166534',
                fontFamily: 'monospace',
                maxHeight: '100px',
                overflowY: 'auto'
              }}>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                  {JSON.stringify(agentData.agentInput, null, 2)}
                </pre>
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>Output:</div>
              <div style={{
                background: '#f0fdf4',
                border: '1px solid #bbf7d0',
                borderRadius: '4px',
                padding: '8px',
                fontSize: '0.8rem',
                color: '#166534',
                fontFamily: 'monospace',
                maxHeight: '150px',
                overflowY: 'auto'
              }}>
                <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                  {JSON.stringify(agentData.agentOutput, null, 2)}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '20px' }}>
        <button
          onClick={() => navigate('/admin')}
          style={{
            padding: '8px 16px',
            backgroundColor: '#6b7280',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            marginBottom: '16px'
          }}
        >
          ← Back to Admin
        </button>
        
        <h1 style={{ margin: '0 0 20px 0', fontSize: '1.8rem', fontWeight: '600', color: '#111827' }}>
          Agent Performance Dashboard
        </h1>
        
        <p style={{ margin: '0 0 20px 0', color: '#6b7280' }}>
          Select a child to automatically view agent performance data. Shows only LLM Input/Output and Agent Input/Output for each agent.
        </p>
      </div>

      {/* Child Selection */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600', color: '#374151' }}>
          Select Child:
        </label>
        <select
          value={selectedChild?.id || ''}
          onChange={(e) => {
            const child = children.find(c => c.id === e.target.value);
            setSelectedChild(child || null);
          }}
          style={{
            padding: '8px 12px',
            border: '1px solid #d1d5db',
            borderRadius: '4px',
            fontSize: '1rem',
            minWidth: '200px'
          }}
        >
          <option value="">Select a child...</option>
          {children.map((child) => (
            <option key={child.id} value={child.id}>
              {child.name} (Age: {child.age})
            </option>
          ))}
        </select>
      </div>

      {/* Loading State */}
      {isLoading && (
        <div style={{
          padding: '20px',
          textAlign: 'center',
          backgroundColor: '#f9fafb',
          border: '1px solid #e5e7eb',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <div style={{ fontSize: '1rem', color: '#6b7280' }}>
            🔄 Running agent tests for {selectedChild?.name}...
          </div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div style={{
          padding: '16px',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          marginBottom: '20px'
        }}>
          <div style={{ color: '#dc2626', fontWeight: '600' }}>❌ Error:</div>
          <div style={{ color: '#991b1b', marginTop: '4px' }}>{error}</div>
        </div>
      )}

      {/* Test Results */}
      {testResults && (
        <div>
          <div style={{
            padding: '16px',
            backgroundColor: '#f0fdf4',
            border: '1px solid #bbf7d0',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <h2 style={{ margin: '0 0 8px 0', fontSize: '1.2rem', color: '#166534' }}>
              ✅ Agent Test Results for {testResults.childName}
            </h2>
            <div style={{ fontSize: '0.9rem', color: '#166534' }}>
              Total Response Time: {testResults.responseTime}ms | 
              Tested at: {new Date(testResults.timestamp).toLocaleString()}
            </div>
          </div>

          {/* Agent Results */}
          <div>
            {renderAgentCard('profileAgent', testResults.agentResults?.profileAgent)}
            {renderAgentCard('matchAgent', testResults.agentResults?.matchAgent)}
            {renderAgentCard('scheduleAgent', testResults.agentResults?.scheduleAgent)}
            {renderAgentCard('reviewerAgent', testResults.agentResults?.reviewerAgent)}
          </div>
        </div>
      )}

      {/* No Child Selected */}
      {!selectedChild && !isLoading && (
        <div style={{
          padding: '40px',
          textAlign: 'center',
          backgroundColor: '#f9fafb',
          border: '1px solid #e5e7eb',
          borderRadius: '8px'
        }}>
          <div style={{ fontSize: '1.1rem', color: '#6b7280' }}>
            👆 Select a child above to view agent performance data
          </div>
        </div>
      )}
    </div>
  );
};

export default StreamlinedAgentDashboard;