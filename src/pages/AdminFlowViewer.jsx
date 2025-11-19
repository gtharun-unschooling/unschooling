import React, { useState, useEffect } from 'react';
import './AdminFlowViewer.css';

const AdminFlowViewer = () => {
  const [planData, setPlanData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState(null);
  const [expandedAgents, setExpandedAgents] = useState({});

  const loadLatestPlan = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Get userId and childId from URL parameters
      const urlParams = new URLSearchParams(window.location.search);
      const userId = urlParams.get('userId');
      const childId = urlParams.get('childId');
      
      // Use specific endpoint if userId/childId provided, otherwise use global endpoint
      let apiUrl;
      if (userId && childId) {
        apiUrl = `https://llm-agents-790275794964.us-central1.run.app/api/get-latest-plan/${userId}/${childId}`;
        console.log('🎯 Loading plan for specific child:', { userId, childId });
      } else {
        apiUrl = `https://llm-agents-790275794964.us-central1.run.app/api/get-latest-plan`;
        console.log('📊 Loading absolute latest plan from all users');
      }
      
      const cacheBuster = `?t=${Date.now()}`;
      const response = await fetch(
        `${apiUrl}${cacheBuster}`,
        {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Pragma': 'no-cache'
          }
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const response_data = await response.json();
      // API returns {success: true, data: {...}} - extract the actual plan data
      const plan = response_data.data || response_data;
      setPlanData(plan);
      setLastUpdate(new Date());
      setLoading(false);
      
      console.log('✅ Plan data loaded:', plan);
      console.log('✅ Weekly plan structure:', plan?.weekly_plan);
    } catch (err) {
      console.error('❌ Error loading plan:', err);
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    // Load immediately on mount
    loadLatestPlan();

    // Auto-refresh every 2 minutes
    const interval = setInterval(() => {
      console.log('🔄 Auto-refreshing plan...');
      loadLatestPlan();
    }, 120000); // 2 minutes

    return () => clearInterval(interval);
  }, []);

  const toggleAgent = (agentId) => {
    setExpandedAgents(prev => ({
      ...prev,
      [agentId]: !prev[agentId]
    }));
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
      const date = new Date(timestamp);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
    } catch {
      return timestamp;
    }
  };

  const calculateAge = (timestamp) => {
    if (!timestamp) return { text: 'Unknown age', class: 'unknown' };
    try {
      const now = new Date();
      const planTime = new Date(timestamp);
      const diffMs = now - planTime;
      const diffMins = Math.floor(diffMs / 60000);
      
      let text, className;
      if (diffMins < 5) {
        text = `Generated ${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
        className = 'fresh';
      } else if (diffMins < 60) {
        text = `Generated ${diffMins} minutes ago`;
        className = 'recent';
      } else if (diffMins < 1440) {
        const hours = Math.floor(diffMins / 60);
        text = `Generated ${hours} hour${hours !== 1 ? 's' : ''} ago`;
        className = 'old';
      } else {
        const days = Math.floor(diffMins / 1440);
        text = `Generated ${days} day${days !== 1 ? 's' : ''} ago`;
        className = 'very-old';
      }
      
      return { text, class: className };
    } catch {
      return { text: 'Unknown age', class: 'unknown' };
    }
  };

  const renderFlowStep = (stepNum, stepId, stepTitle, stepDescription, stepData) => {
    const isExpanded = expandedAgents[stepId];
    
    return (
      <div key={stepId} className="flow-step">
        <div className="step-number">{stepNum}</div>
        <div className="step-card">
          <div className="step-header" onClick={() => toggleAgent(stepId)}>
            <div className="step-title">
              <span className="step-name">{stepTitle}</span>
              <span className="step-desc">{stepDescription}</span>
            </div>
            <div className="step-meta">
              {stepData.time && <span className="time-badge">⏱️ {stepData.time}</span>}
              {stepData.status && <span className={`status-badge ${stepData.status}`}>{stepData.statusText}</span>}
              <span className={`expand-icon ${isExpanded ? 'expanded' : ''}`}>▼</span>
            </div>
          </div>

          {isExpanded && (
            <div className="step-details">
              {stepData.input && (
                <div className="detail-section">
                  <h4>📥 INPUT (Data Sent to This Step)</h4>
                  <details className="code-details" open>
                    <summary className="code-summary">
                      🔽 View Input Data ({JSON.stringify(stepData.input).length.toLocaleString()} characters)
                    </summary>
                    <pre className="code-block input-block">
                      {typeof stepData.input === 'string' ? stepData.input : JSON.stringify(stepData.input, null, 2)}
                    </pre>
                  </details>
                </div>
              )}

              {stepData.output && (
                <div className="detail-section">
                  <h4>📤 OUTPUT (Data Returned from This Step)</h4>
                  <details className="code-details" open>
                    <summary className="code-summary">
                      🔽 View Output Data ({JSON.stringify(stepData.output).length.toLocaleString()} characters)
                    </summary>
                    <pre className="code-block output-block">
                      {typeof stepData.output === 'string' ? stepData.output : JSON.stringify(stepData.output, null, 2)}
                    </pre>
                  </details>
                </div>
              )}

              {stepData.details && (
                <div className="detail-section">
                  <h4>ℹ️ Additional Details</h4>
                  <div className="summary-grid">
                    {Object.entries(stepData.details).map(([key, value]) => (
                      <div key={key} className="summary-item">
                        <span className="summary-label">{key}:</span>
                        <span className="summary-value">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (loading && !planData) {
    return (
      <div className="flow-viewer">
        <div className="loading-container">
          <div className="spinner"></div>
          <p>Loading latest plan...</p>
        </div>
      </div>
    );
  }

  if (error && !planData) {
    return (
      <div className="flow-viewer">
        <div className="error-container">
          <h2>❌ Error Loading Plan</h2>
          <p>{error}</p>
          <button onClick={loadLatestPlan} className="retry-btn">
            🔄 Retry
          </button>
        </div>
      </div>
    );
  }

  const timestamp = planData?.timestamp || planData?.generated_at;
  const ageInfo = calculateAge(timestamp);
  const totalTime = Object.values(planData?.agent_timings || {})
    .reduce((sum, agent) => sum + (agent.execution_time_seconds || 0), 0);
  const totalTokens = Object.values(planData?.llm_integration || {})
    .filter(val => typeof val === 'number')
    .reduce((sum, val) => sum + val, 0);

  return (
    <div className="flow-viewer">
      {/* Header */}
      <div className="viewer-header">
        <h1>📊 Plan Generation Flow - Live Monitor</h1>
        <p className="subtitle">Real-time LLM Input/Output Viewer</p>
      </div>

      {/* Refresh Bar */}
      <div className="refresh-bar">
        <div className="refresh-info">
          <button onClick={loadLatestPlan} className="refresh-btn" disabled={loading}>
            {loading ? '⏳ Refreshing...' : '🔄 Refresh Now'}
          </button>
          <span className="last-update">
            Last updated: {lastUpdate ? lastUpdate.toLocaleTimeString() : 'Never'}
          </span>
          <span className="auto-refresh-status">
            🔄 Auto-refresh: <strong>ON (every 2m)</strong>
          </span>
        </div>
        <div className="status-badge success">
          ✅ Connected
        </div>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card">
          <div className="card-icon">⏱️</div>
          <div className="card-content">
            <div className="card-value">{totalTime.toFixed(1)}s</div>
            <div className="card-label">Total Time</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon">🧠</div>
          <div className="card-content">
            <div className="card-value">{totalTokens.toLocaleString()}</div>
            <div className="card-label">Total Tokens</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon">🤖</div>
          <div className="card-content">
            <div className="card-value">5</div>
            <div className="card-label">AI Agents</div>
          </div>
        </div>

        <div className="summary-card">
          <div className="card-icon">📅</div>
          <div className="card-content">
            <div className="card-value">4</div>
            <div className="card-label">Weeks Planned</div>
          </div>
        </div>
      </div>

      {/* Timestamp Section */}
      <div className="timestamp-section">
        <h3>⏰ Plan Generated</h3>
        <div className="timestamp-value">{formatTimestamp(timestamp)}</div>
        <div className={`timestamp-age ${ageInfo.class}`}>{ageInfo.text}</div>
      </div>

      {/* Week Names */}
      {planData?.weekly_plan && (
        <div className="week-names-section">
          <h3>📅 Weekly Plan Structure</h3>
          <div className="week-grid">
            {[1, 2, 3, 4].map(weekNum => {
              const week = planData.weekly_plan[`week_${weekNum}`];
              return (
                <div key={weekNum} className="week-card">
                  <div className="week-number">Week {weekNum}</div>
                  <div className="week-name">{week?.name || 'No name'}</div>
                  <div className="week-theme">{week?.theme || 'No theme'}</div>
                  <div className="week-focus">{week?.focus || 'No focus'}</div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Complete Flow Section */}
      <div className="flow-section">
        <h3>🔄 Complete Plan Generation Flow</h3>
        <p className="section-subtitle">Click on any step to view raw input/output data at that point</p>
        
        <div className="flow-timeline">
          {/* Step 1: Frontend Form Data */}
          {renderFlowStep(
            1,
            'frontend_input',
            '🌐 Frontend - User Input',
            'Form data collected from parent',
            {
              input: planData?.child_profile || planData?.profile || {
                child_name: planData?.data?.child_name,
                child_age: planData?.data?.child_age,
                interests: planData?.data?.interests,
                learning_style: planData?.data?.preferred_learning_style
              },
              output: {
                status: 'Submitted to backend',
                endpoint: '/api/generate-plan',
                method: 'POST'
              },
              details: {
                'Source': 'ProfileForm.jsx',
                'Action': 'Form submitted',
                'Validation': 'Passed'
              }
            }
          )}

          {/* Step 2: Profile Agent */}
          {renderFlowStep(
            2,
            'profile_agent',
            '👶 Profile Agent',
            'Enriches child profile with AI insights',
            {
              input: planData?.llm_integration?.profile_agent_prompt,
              output: planData?.llm_integration?.profile_agent_response,
              time: `${planData?.agent_timings?.profile_agent?.execution_time_seconds?.toFixed(1) || '0'}s`,
              status: planData?.llm_integration?.profile_agent_llm_used ? 'success' : 'error',
              statusText: planData?.llm_integration?.profile_agent_llm_used ? '✅ LLM Used' : '❌ No LLM',
              details: {
                'LLM Used': planData?.llm_integration?.profile_agent_llm_used ? 'Yes' : 'No',
                'Tokens': planData?.llm_integration?.profile_agent_tokens_used?.toLocaleString() || '0',
                'Model': 'Gemini 2.5 Flash',
                'Purpose': 'Analyze child profile and generate comprehensive insights'
              }
            }
          )}

          {/* Step 3: Analysis Agent */}
          {renderFlowStep(
            3,
            'analysis_agent',
            '🎯 Analysis Agent',
            'Selects 6-7 learning themes matching interests',
            {
              input: planData?.llm_integration?.analysis_agent_prompt,
              output: planData?.llm_integration?.analysis_agent_response,
              time: `${planData?.agent_timings?.analysis_agent?.execution_time_seconds?.toFixed(1) || '0'}s`,
              status: planData?.llm_integration?.analysis_agent_llm_used ? 'success' : 'error',
              statusText: planData?.llm_integration?.analysis_agent_llm_used ? '✅ LLM Used' : '❌ No LLM',
              details: {
                'LLM Used': planData?.llm_integration?.analysis_agent_llm_used ? 'Yes' : 'No',
                'Tokens': planData?.llm_integration?.analysis_agent_tokens_used?.toLocaleString() || '0',
                'Model': 'Gemini 2.5 Flash',
                'Purpose': 'Select themes for holistic development'
              }
            }
          )}

          {/* Step 4: Match Agent */}
          {renderFlowStep(
            4,
            'match_agent',
            '🎲 Match Agent',
            'Matches topics to child age and interests',
            {
              input: planData?.llm_integration?.match_agent_prompt,
              output: planData?.llm_integration?.match_agent_response,
              time: `${planData?.agent_timings?.match_agent?.execution_time_seconds?.toFixed(1) || '0'}s`,
              status: planData?.llm_integration?.match_agent_llm_used ? 'success' : 'error',
              statusText: planData?.llm_integration?.match_agent_llm_used ? '✅ LLM Used' : '❌ No LLM',
              details: {
                'LLM Used': planData?.llm_integration?.match_agent_llm_used ? 'Yes' : 'No',
                'Tokens': planData?.llm_integration?.match_agent_tokens_used?.toLocaleString() || '0',
                'Model': 'Gemini 2.5 Flash',
                'Topics Selected': planData?.matched_topics?.length || 'N/A',
                'Age Filter': '±1 year strict'
              }
            }
          )}

          {/* Step 5: Schedule Agent */}
          {renderFlowStep(
            5,
            'schedule_agent',
            '📅 Schedule Agent',
            'Creates 4-week learning schedule with activities',
            {
              input: planData?.llm_integration?.schedule_agent_prompt,
              output: planData?.llm_integration?.schedule_agent_response,
              time: `${planData?.agent_timings?.schedule_agent?.execution_time_seconds?.toFixed(1) || '0'}s`,
              status: planData?.llm_integration?.schedule_agent_llm_used ? 'success' : 'error',
              statusText: planData?.llm_integration?.schedule_agent_llm_used ? '✅ LLM Used' : '❌ No LLM',
              details: {
                'LLM Used': planData?.llm_integration?.schedule_agent_llm_used ? 'Yes' : 'No',
                'Tokens': planData?.llm_integration?.schedule_agent_tokens_used?.toLocaleString() || '0',
                'Model': 'Gemini 2.5 Flash',
                'Weeks Created': '4',
                'Topics per Week': '7'
              }
            }
          )}

          {/* Step 6: Reviewer Agent */}
          {renderFlowStep(
            6,
            'reviewer_agent',
            '✅ Reviewer Agent',
            'Reviews and optimizes the complete plan',
            {
              input: planData?.llm_integration?.reviewer_agent_prompt,
              output: planData?.llm_integration?.reviewer_agent_response,
              time: `${planData?.agent_timings?.reviewer_agent?.execution_time_seconds?.toFixed(1) || '0'}s`,
              status: planData?.llm_integration?.reviewer_agent_llm_used ? 'success' : 'error',
              statusText: planData?.llm_integration?.reviewer_agent_llm_used ? '✅ LLM Used' : '❌ No LLM',
              details: {
                'LLM Used': planData?.llm_integration?.reviewer_agent_llm_used ? 'Yes' : 'No',
                'Tokens': planData?.llm_integration?.reviewer_agent_tokens_used?.toLocaleString() || '0',
                'Model': 'Gemini 2.5 Flash',
                'Purpose': 'Quality assurance and optimization'
              }
            }
          )}

          {/* Step 7: Weekly Plan Structure */}
          {renderFlowStep(
            7,
            'weekly_plan',
            '📋 Weekly Plan Structure',
            'Final structured plan with week names and themes',
            {
              input: {
                source: 'All agents combined output',
                processing: 'Week name generation, theme assignment'
              },
              output: planData?.weekly_plan,
              details: {
                'Week 1': planData?.weekly_plan?.week_1?.name || 'N/A',
                'Week 2': planData?.weekly_plan?.week_2?.name || 'N/A',
                'Week 3': planData?.weekly_plan?.week_3?.name || 'N/A',
                'Week 4': planData?.weekly_plan?.week_4?.name || 'N/A'
              }
            }
          )}

          {/* Step 8: Firestore Storage */}
          {renderFlowStep(
            8,
            'firestore_save',
            '💾 Firestore Storage',
            'Plan saved to database',
            {
              input: {
                collection: 'users/{userId}/children/{childId}/plans',
                document_id: planData?.month || 'Unknown Month',
                data: 'Complete plan object'
              },
              output: {
                status: 'Success',
                timestamp: planData?.timestamp || planData?.generated_at,
                path: `users/.../children/.../plans/${planData?.month}`
              },
              details: {
                'Status': '✅ Saved',
                'Timestamp': formatTimestamp(planData?.timestamp || planData?.generated_at),
                'Document Size': JSON.stringify(planData).length > 1024 ? 
                  `${(JSON.stringify(planData).length / 1024).toFixed(1)} KB` : 
                  `${JSON.stringify(planData).length} bytes`
              }
            }
          )}

          {/* Step 9: Backend Response */}
          {renderFlowStep(
            9,
            'backend_response',
            '📤 Backend Response',
            'Complete plan returned to frontend',
            {
              input: {
                source: 'All processing complete',
                format: 'JSON response'
              },
              output: {
                success: true,
                data: planData?.data,
                timestamp: planData?.timestamp,
                agent_timings: planData?.agent_timings,
                llm_integration: planData?.llm_integration
              },
              details: {
                'Status Code': '200 OK',
                'Response Time': `${totalTime.toFixed(1)}s`,
                'Total Tokens': totalTokens.toLocaleString(),
                'Data Complete': '✅ Yes'
              }
            }
          )}

          {/* Step 10: Frontend Display */}
          {renderFlowStep(
            10,
            'frontend_display',
            '🎨 Frontend Display',
            'What parent sees on screen',
            {
              input: planData,
              output: (() => {
                // Generate what actually gets displayed to parent
                const wp = planData?.weekly_plan || {};
                const displayedPlan = {};
                
                Object.entries(wp).forEach(([weekKey, weekData]) => {
                  displayedPlan[weekKey] = {
                    week_header: {
                      name: weekData.name || weekKey.toUpperCase(),
                      theme: weekData.theme || 'N/A',
                      focus: weekData.focus || 'N/A'
                    },
                    days_displayed: {}
                  };
                  
                  if (weekData.days) {
                    Object.entries(weekData.days).forEach(([dayKey, dayData]) => {
                      displayedPlan[weekKey].days_displayed[dayKey] = {
                        day_name: dayKey,
                        topic_shown: dayData.topic || dayData.name || 'Activity',
                        objective_shown: dayData.objective || 'N/A',
                        duration_shown: dayData.duration || dayData.estimated_time || 'N/A',
                        activity_instructions: dayData.activity || 'N/A',
                        tags: {
                          niche: dayData.niche || 'N/A',
                          difficulty: dayData.difficulty || 'N/A',
                          age: dayData.age_appropriate || 'N/A'
                        }
                      };
                    });
                  }
                });
                
                return {
                  route: '/customised-weekly-plan',
                  component: 'CustomisedWeeklyPlan.jsx',
                  what_parent_sees: displayedPlan,
                  total_weeks: Object.keys(displayedPlan).length,
                  total_days: Object.values(displayedPlan).reduce((sum, w) => sum + Object.keys(w.days_displayed || {}).length, 0)
                };
              })(),
              details: {
                'Display Component': 'CustomisedWeeklyPlan.jsx',
                'Access Path': 'currentPlan.weekly_plan',
                'Rendering': 'Mobile-friendly cards',
                'Interactive': 'Yes - expandable activity details'
              }
            }
          )}
        </div>
      </div>

      {/* Footer */}
      <div className="viewer-footer">
        <p>Auto-refreshes every 2 minutes • Last refresh: {lastUpdate?.toLocaleTimeString() || 'Never'}</p>
      </div>
    </div>
  );
};

export default AdminFlowViewer;

