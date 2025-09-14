import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { collection, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { db } from '../../firebase';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { userProfile, signOut } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [agentMetrics, setAgentMetrics] = useState({
    profileAgent: { totalRuns: 0, successRate: 0, avgExecutionTime: 0, llmUsage: 0, errors: 0, lastError: null },
    matchAgent: { totalRuns: 0, successRate: 0, avgExecutionTime: 0, topicsSelected: 0, nichesCovered: 0, errors: 0, lastError: null, currentSessionTopics: 0 },
    scheduleAgent: { totalRuns: 0, successRate: 0, avgExecutionTime: 0, plansCreated: 0, duplicationPrevented: 0, errors: 0, lastError: null },
    reviewerAgent: { totalRuns: 0, successRate: 0, avgExecutionTime: 0, llmUsage: 0, optimizationsSuggested: 0, errors: 0, lastError: null }
  });
  const [systemHealth, setSystemHealth] = useState({
    backendStatus: 'unknown',
    llmStatus: 'unknown',
    databaseStatus: 'unknown',
    lastHealthCheck: null,
    backendVersion: null,
    pythonVersion: null,
    memoryUsage: null,
    uptime: null
  });
  const [recentExecutions, setRecentExecutions] = useState([]);
  const [errorLogs, setErrorLogs] = useState([]);
  const [performanceMetrics, setPerformanceMetrics] = useState({
    avgResponseTime: 0,
    peakResponseTime: 0,
    totalRequests: 0,
    failedRequests: 0,
    llmTokenUsage: 0,
    databaseQueries: 0
  });
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeUsers: 0,
    adminUsers: 0,
    parentUsers: 0,
    totalPlansGenerated: 0,
    totalTopicsMatched: 0,
    avgPlanQuality: 0
  });

  useEffect(() => {
    fetchUsers();
    fetchAgentMetrics();
    checkSystemHealth();
    fetchRecentExecutions();
    fetchErrorLogs();
    fetchPerformanceMetrics();
    // Delay API test to ensure backend is ready
    setTimeout(() => {
      testCurrentAPI();
    }, 1000);
  }, []);
  
  // Monitor state changes for debugging
  useEffect(() => {
    console.log('🔍 Agent metrics updated:', {
      currentSessionTopics: agentMetrics.matchAgent.currentSessionTopics,
      topicsSelected: agentMetrics.matchAgent.topicsSelected,
      apiStatus: agentMetrics.matchAgent.apiStatus
    });
  }, [agentMetrics.matchAgent.currentSessionTopics, agentMetrics.matchAgent.topicsSelected, agentMetrics.matchAgent.apiStatus]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const usersRef = collection(db, 'users');
      const q = query(usersRef, orderBy('createdAt', 'desc'), limit(50));
      const querySnapshot = await getDocs(q);
      
      const usersData = [];
      let totalUsers = 0;
      let activeUsers = 0;
      let adminUsers = 0;
      let parentUsers = 0;
      let totalPlans = 0;
      let totalTopics = 0;
      let planQualitySum = 0;
      let planCount = 0;

      querySnapshot.forEach((doc) => {
        const userData = { id: doc.id, ...doc.data() };
        usersData.push(userData);
        
        totalUsers++;
        if (userData.subscription?.status === 'active') activeUsers++;
        if (userData.role === 'admin') adminUsers++;
        if (userData.role === 'parent') parentUsers++;
        
        // Count plans and topics
        if (userData.children) {
          Object.values(userData.children).forEach(child => {
            if (child.plans) {
              Object.values(child.plans).forEach(plan => {
                totalPlans++;
                if (plan.matched_topics) {
                  totalTopics += plan.matched_topics.length;
                }
                if (plan.review_insights?.plan_quality) {
                  planQualitySum += 1; // Count plans with quality data
                  planCount++;
                }
              });
            }
          });
        }
      });

      setUsers(usersData);
      setStats({
        totalUsers,
        activeUsers,
        adminUsers,
        parentUsers,
        totalPlansGenerated: totalPlans,
        totalTopicsMatched: totalTopics,
        avgPlanQuality: planCount > 0 ? (planQualitySum / planCount * 100).toFixed(1) : 0
      });
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchAgentMetrics = async () => {
    try {
      // Simplified placeholder to avoid heavy client parsing issues
      setAgentMetrics(prev => ({
        ...prev,
        profileAgent: { ...prev.profileAgent, totalRuns: 0, successRate: 0, avgExecutionTime: 0, llmUsage: 0, errors: 0 },
        matchAgent: { ...prev.matchAgent, totalRuns: 0, successRate: 0, avgExecutionTime: 0, topicsSelected: 0, nichesCovered: 0, errors: 0 },
        scheduleAgent: { ...prev.scheduleAgent, totalRuns: 0, successRate: 0, avgExecutionTime: 0, plansCreated: 0, duplicationPrevented: 0, errors: 0 },
        reviewerAgent: { ...prev.reviewerAgent, totalRuns: 0, successRate: 0, avgExecutionTime: 0, llmUsage: 0, optimizationsSuggested: 0, errors: 0 }
      }));
    } catch (error) {
      console.error('Error fetching agent metrics:', error);
    }
  };

  const checkSystemHealth = async () => {
    try {
      // Check backend health
      const backendResponse = await fetch('http://localhost:8000/health');
      const backendData = await backendResponse.json();
      
      setSystemHealth({
        backendStatus: backendData.status === 'healthy' ? 'healthy' : 'unhealthy',
        llmStatus: backendData.llm_integration?.gemini_available ? 'available' : 'unavailable',
        databaseStatus: backendData.data_loaded ? 'connected' : 'disconnected',
        lastHealthCheck: new Date().toLocaleTimeString(),
        backendVersion: backendData.version || 'unknown',
        pythonVersion: backendData.python_version || 'unknown',
        memoryUsage: backendData.memory_usage || 'unknown',
        uptime: backendData.uptime || 'unknown'
      });
    } catch (error) {
      setSystemHealth({
        backendStatus: 'unreachable',
        llmStatus: 'unknown',
        databaseStatus: 'unknown',
        lastHealthCheck: new Date().toLocaleTimeString(),
        backendVersion: 'unknown',
        pythonVersion: 'unknown',
        memoryUsage: 'unknown',
        uptime: 'unknown'
      });
    }
  };

  const fetchRecentExecutions = async () => {
    try {
      // Fetch recent plan executions to show developer debugging info
      const usersRef = collection(db, 'users');
      const querySnapshot = await getDocs(usersRef);
      
      const executions = [];
      
      querySnapshot.forEach((userDoc) => {
        const userData = userDoc.data();
        if (userData.children) {
          Object.values(userData.children).forEach(child => {
            if (child.plans) {
              Object.values(child.plans).forEach(plan => {
                if (plan.agent_timings) {
                  executions.push({
                    id: `${userDoc.id}-${child.id}-${plan.id}`,
                    user: userData.email || 'Unknown',
                    child: child.name || 'Unknown',
                    timestamp: plan.created_at || new Date(),
                    totalTime: plan.agent_timings?.total_execution_time || 0,
                    agents: Object.keys(plan.agent_timings).filter(key => key !== 'total_execution_time'),
                    status: plan.success ? 'success' : 'failed',
                    error: plan.error || null,
                    llmTokens: (plan.agent_timings?.profile_agent?.tokens_used || 0) +
                               (plan.agent_timings?.reviewer_agent?.tokens_used || 0)
                  });
                }
              });
            }
          });
        }
      });
      
      // Sort by timestamp and take last 10
      executions.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setRecentExecutions(executions.slice(0, 10));
    } catch (error) {
      console.error('Error fetching recent executions:', error);
    }
  };

  const fetchErrorLogs = async () => {
    try {
      // Fetch error logs from plans
      const usersRef = collection(db, 'users');
      const querySnapshot = await getDocs(usersRef);
      
      const errors = [];
      
      querySnapshot.forEach((userDoc) => {
        const userData = userDoc.data();
        if (userData.children) {
          Object.values(userData.children).forEach(child => {
            if (child.plans) {
              Object.values(child.plans).forEach(plan => {
                if (plan.error || plan.agent_timings) {
                  // Check for errors in agent timings
                  Object.entries(plan.agent_timings || {}).forEach(([agent, timing]) => {
                    if (timing.error) {
                      errors.push({
                        id: `${userDoc.id}-${child.id}-${plan.id}-${agent}`,
                        timestamp: plan.created_at || new Date(),
                        user: userData.email || 'Unknown',
                        agent: agent,
                        error: timing.error,
                        executionTime: timing.execution_time_seconds || 0,
                        stackTrace: timing.stack_trace || null
                      });
                    }
                  });
                  
                  // Check for plan-level errors
                  if (plan.error) {
                    errors.push({
                      id: `${userDoc.id}-${child.id}-${plan.id}-plan`,
                      timestamp: plan.created_at || new Date(),
                      user: userData.email || 'Unknown',
                      agent: 'plan_level',
                      error: plan.error,
                      executionTime: 0,
                      stackTrace: plan.stack_trace || null
                    });
                  }
                }
              });
            }
          });
        }
      });
      
      // Sort by timestamp and take last 10
      errors.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      setErrorLogs(errors.slice(0, 10));
    } catch (error) {
      console.error('Error fetching error logs:', error);
    }
  };

  const testCurrentAPI = async () => {
    try {
      console.log('🚀 Starting API test...');
      
      // Update status to testing
      setAgentMetrics(prev => ({
        ...prev,
        matchAgent: {
          ...prev.matchAgent,
          apiStatus: '🔄 Testing...'
        }
      }));
      
      console.log('🔍 Calling API endpoint: http://localhost:8000/api/generate-plan');
      
      // Test the current API to get real-time data
      const response = await fetch('http://localhost:8000/api/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          profile: {
            child_name: "DashboardTest",
            child_age: 5,
            interests: ["AI", "Technology"],
            preferred_learning_style: "visual",
            goals: ["problem-solving"],
            plan_type: "hybrid"
          }
        })
      });
      
      console.log('📡 API Response Status:', response.status, response.statusText);
      
      if (response.ok) {
        const data = await response.json();
        console.log('🔍 Full API Response:', data);
        console.log('🔍 Response structure:', {
          success: data.success,
          hasData: !!data.data,
          hasMatchedTopics: !!data.data?.matched_topics,
          topicsLength: data.data?.matched_topics?.length,
          dataKeys: data.data ? Object.keys(data.data) : 'No data'
        });
        
        if (data.success && data.data.matched_topics) {
          const currentTopics = data.data.matched_topics.length;
          const currentNiches = new Set(data.data.matched_topics.map(topic => topic.Niche || topic.niche)).size;
          
          console.log(`🚀 Current API Test: ${currentTopics} topics, ${currentNiches} niches`);
          console.log(`📋 First few topics:`, data.data.matched_topics.slice(0, 3));
          
          // CRITICAL FIX: Update the match agent metrics with current session data
          setAgentMetrics(prev => {
            console.log('🔄 Updating agent metrics with:', {
              currentTopics,
              currentNiches,
              previousTopics: prev.matchAgent.topicsSelected,
              previousNiches: prev.matchAgent.nichesCovered
            });
            
            return {
              ...prev,
              matchAgent: {
                ...prev.matchAgent,
                currentSessionTopics: currentTopics,
                topicsSelected: prev.matchAgent.topicsSelected + currentTopics,
                nichesCovered: prev.matchAgent.nichesCovered + currentNiches,
                apiStatus: `✅ ${currentTopics} topics generated`
              }
            };
          });
          
          console.log('✅ Successfully updated agent metrics');
        } else {
          setAgentMetrics(prev => ({
            ...prev,
            matchAgent: {
              ...prev.matchAgent,
              apiStatus: '❌ No topics in response'
            }
          }));
        }
      } else {
        setAgentMetrics(prev => ({
          ...prev,
          matchAgent: {
            ...prev.matchAgent,
            apiStatus: `❌ HTTP ${response.status}`
          }
        }));
      }
    } catch (error) {
      console.error('Error testing current API:', error);
      setAgentMetrics(prev => ({
        ...prev,
        matchAgent: {
          ...prev.matchAgent,
          apiStatus: '❌ Network error'
        }
      }));
    }
  };

  const fetchPerformanceMetrics = async () => {
    try {
      // Calculate performance metrics from recent executions
      const usersRef = collection(db, 'users');
      const querySnapshot = await getDocs(usersRef);
      
      let totalRequests = 0;
      let failedRequests = 0;
      let totalResponseTime = 0;
      let peakResponseTime = 0;
      let totalLLMTokens = 0;
      let totalDBQueries = 0;
      
      querySnapshot.forEach((userDoc) => {
        const userData = userDoc.data();
        if (userData.children) {
          Object.values(userData.children).forEach(child => {
            if (child.plans) {
              Object.values(child.plans).forEach(plan => {
                totalRequests++;
                if (plan.error) failedRequests++;
                
                if (plan.agent_timings?.total_execution_time) {
                  const responseTime = plan.agent_timings.total_execution_time;
                  totalResponseTime += responseTime;
                  if (responseTime > peakResponseTime) peakResponseTime = responseTime;
                }
                
                // Count LLM tokens
                if (plan.agent_timings?.profile_agent?.tokens_used) {
                  totalLLMTokens += plan.agent_timings.profile_agent.tokens_used;
                }
                if (plan.agent_timings?.reviewer_agent?.tokens_used) {
                  totalLLMTokens += plan.agent_timings.reviewer_agent.tokens_used;
                }
                
                // Estimate database queries (each plan fetch counts as queries)
                totalDBQueries += 3; // Rough estimate: user + child + plan
              });
            }
          });
        }
      });
      
      setPerformanceMetrics({
        avgResponseTime: totalRequests > 0 ? (totalResponseTime / totalRequests).toFixed(2) : 0,
        peakResponseTime: peakResponseTime.toFixed(2),
        totalRequests,
        failedRequests,
        llmTokenUsage: totalLLMTokens,
        databaseQueries: totalDBQueries
      });
    } catch (error) {
      console.error('Error fetching performance metrics:', error);
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
      return new Date(timestamp.seconds * 1000).toLocaleDateString();
    } catch (error) {
      return 'Invalid date';
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
      return new Date(timestamp.seconds * 1000).toLocaleString();
    } catch (error) {
      return 'Invalid date';
    }
  };

  const getRoleDisplayName = (role) => {
    return role === 'admin' ? 'Administrator' : 'Parent';
  };

  const getSubscriptionStatus = (subscription) => {
    if (!subscription) return 'No subscription';
    return subscription.status === 'active' ? 'Active' : 'Inactive';
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Error signing out:', error);
      setError('Failed to sign out. Please try again.');
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'healthy':
      case 'available':
      case 'connected':
        return '#4CAF50';
      case 'unhealthy':
      case 'unavailable':
      case 'disconnected':
        return '#f44336';
      case 'unreachable':
        return '#ff9800';
      default:
        return '#9e9e9e';
    }
  };

  if (loading) {
    return (
      <div className="admin-dashboard-container">
        <div className="loading-container">Loading developer dashboard...</div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard-container">
      <div className="admin-header">
        <h1>🔧 AI Agent Developer Dashboard</h1>
        <p>Developer View: Debug, Monitor & Optimize AI Agent System</p>
        <button onClick={handleSignOut} className="sign-out-button">
          Sign Out
        </button>
      </div>

      {/* System Health Overview */}
      <div className="stats-grid">
        {/* Business KPIs (from founder view) */}
        <div className="stat-card">
          <div className="stat-number">₹{stats.totalUsers * 1000}</div>
          <div className="stat-label">Est. Monthly Revenue (placeholder)</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.activeUsers}</div>
          <div className="stat-label">Active Customers</div>
        </div>
        <div className="stat-card">
          <div className="stat-number">{stats.totalPlansGenerated}</div>
          <div className="stat-label">Plans Generated</div>
        </div>
        <div className="stat-card system-health">
          <h3>🏥 System Health</h3>
          <div className="health-indicators">
            <div className="health-item">
              <span className="health-label">Backend:</span>
              <span className="health-status" style={{ color: getStatusColor(systemHealth.backendStatus) }}>
                {systemHealth.backendStatus.toUpperCase()}
              </span>
            </div>
            <div className="health-item">
              <span className="health-label">LLM:</span>
              <span className="health-status" style={{ color: getStatusColor(systemHealth.llmStatus) }}>
                {systemHealth.llmStatus.toUpperCase()}
              </span>
            </div>
            <div className="health-item">
              <span className="health-label">Database:</span>
              <span className="health-status" style={{ color: getStatusColor(systemHealth.databaseStatus) }}>
                {systemHealth.databaseStatus.toUpperCase()}
              </span>
            </div>
            <div className="health-item">
              <span className="health-label">Last Check:</span>
              <span className="health-status">{systemHealth.lastHealthCheck}</span>
            </div>
          </div>
          <div className="health-details">
            <div className="health-detail-item">
              <span>Backend Version:</span> <span>{systemHealth.backendVersion}</span>
            </div>
            <div className="health-detail-item">
              <span>Python Version:</span> <span>{systemHealth.pythonVersion}</span>
            </div>
            <div className="health-detail-item">
              <span>Memory Usage:</span> <span>{systemHealth.memoryUsage}</span>
            </div>
            <div className="health-detail-item">
              <span>Uptime:</span> <span>{systemHealth.uptime}</span>
            </div>
          </div>
          <button onClick={checkSystemHealth} className="refresh-button">
            🔄 Refresh Health
          </button>
        </div>

        <div className="stat-card">
          <div className="stat-number">{performanceMetrics.totalRequests}</div>
          <div className="stat-label">Total Requests</div>
        </div>

        <div className="stat-card">
          <div className="stat-number">{performanceMetrics.avgResponseTime}s</div>
          <div className="stat-label">Avg Response Time</div>
        </div>

        <div className="stat-card">
          <div className="stat-number">{performanceMetrics.llmTokenUsage}</div>
          <div className="stat-label">LLM Tokens Used</div>
        </div>

        <div className="stat-card">
          <div className="stat-number">{performanceMetrics.databaseQueries}</div>
          <div className="stat-label">DB Queries</div>
        </div>
      </div>

      {/* AI Agent Performance Metrics */}
      <div className="section">
        <h2 className="section-title">🤖 AI Agent Performance Metrics</h2>
        
        <div className="agent-metrics-grid">
          {/* Profile Agent */}
          <div className="agent-card">
            <h3>👤 Profile Agent</h3>
            <div className="metric-item">
              <span className="metric-label">Total Runs:</span>
              <span className="metric-value">{agentMetrics.profileAgent.totalRuns}</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Success Rate:</span>
              <span className="metric-value">{agentMetrics.profileAgent.successRate}%</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Avg Time:</span>
              <span className="metric-value">{agentMetrics.profileAgent.avgExecutionTime}s</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">LLM Usage:</span>
              <span className="metric-value">{agentMetrics.profileAgent.llmUsage}%</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Errors:</span>
              <span className="metric-value error">{agentMetrics.profileAgent.errors}</span>
            </div>
            {agentMetrics.profileAgent.lastError && (
              <div className="error-detail">
                <span className="error-label">Last Error:</span>
                <span className="error-message">{agentMetrics.profileAgent.lastError}</span>
              </div>
            )}
            <div className="agent-status">
              Status: <span className="status-active">✅ Active</span>
            </div>
          </div>

          {/* Match Agent */}
          <div className="agent-card">
            <h3>🎯 Match Agent</h3>
            <div className="metric-item">
              <span className="metric-label">Total Runs:</span>
              <span className="metric-value">{agentMetrics.matchAgent.totalRuns}</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Success Rate:</span>
              <span className="metric-value">{agentMetrics.matchAgent.successRate}%</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Avg Time:</span>
              <span className="metric-value">{agentMetrics.matchAgent.avgExecutionTime}s</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Topics Selected:</span>
              <span className="metric-value">{agentMetrics.matchAgent.topicsSelected}</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Current Session:</span>
              <span className="metric-value current-session">{agentMetrics.matchAgent.currentSessionTopics} topics</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">API Status:</span>
              <span className="metric-value api-status">{agentMetrics.matchAgent.apiStatus || '🔄 Testing...'}</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Last Updated:</span>
              <span className="metric-value">{new Date().toLocaleTimeString()}</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Niches Covered:</span>
              <span className="metric-value">{agentMetrics.matchAgent.nichesCovered}</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Plan Source:</span>
              <span className="metric-value" style={{backgroundColor: '#dcfce7', color: '#166534'}}>Latest Plan</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Errors:</span>
              <span className="metric-value error">{agentMetrics.matchAgent.errors}</span>
            </div>
            {agentMetrics.matchAgent.lastError && (
              <div className="error-detail">
                <span className="error-label">Last Error:</span>
                <span className="error-message">{agentMetrics.matchAgent.lastError}</span>
              </div>
            )}
            <div className="agent-status">
              Status: <span className="status-active">✅ Active</span>
            </div>
            
            {/* Test Buttons Section */}
            <div style={{marginTop: '15px', padding: '15px', backgroundColor: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0'}}>
              <h4 style={{margin: '0 0 10px 0', color: '#374151', fontSize: '1rem'}}>🧪 Test Controls</h4>
              <button 
                onClick={testCurrentAPI} 
                className="action-button"
                style={{marginBottom: '8px'}}
              >
                🔄 Test API Now
              </button>
              <button 
                onClick={() => {
                  console.log('🔄 Force refreshing dashboard...');
                  fetchAgentMetrics();
                  testCurrentAPI();
                }} 
                className="action-button"
                style={{backgroundColor: '#f59e0b'}}
              >
                🔄 Force Refresh Dashboard
              </button>
            </div>
          </div>

          {/* Schedule Agent */}
          <div className="agent-card">
            <h3>📅 Schedule Agent</h3>
            <div className="metric-item">
              <span className="metric-label">Total Runs:</span>
              <span className="metric-value">{agentMetrics.scheduleAgent.totalRuns}</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Success Rate:</span>
              <span className="metric-value">{agentMetrics.scheduleAgent.successRate}%</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Avg Time:</span>
              <span className="metric-value">{agentMetrics.scheduleAgent.avgExecutionTime}s</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Plans Created:</span>
              <span className="metric-value">{agentMetrics.scheduleAgent.plansCreated}</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Duplication Prevented:</span>
              <span className="metric-value">{agentMetrics.scheduleAgent.duplicationPrevented}</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Errors:</span>
              <span className="metric-value error">{agentMetrics.scheduleAgent.errors}</span>
            </div>
            {agentMetrics.scheduleAgent.lastError && (
              <div className="error-detail">
                <span className="error-label">Last Error:</span>
                <span className="error-message">{agentMetrics.scheduleAgent.lastError}</span>
              </div>
            )}
            <div className="agent-status">
              Status: <span className="status-active">✅ Active</span>
            </div>
          </div>

          {/* Reviewer Agent */}
          <div className="agent-card">
            <h3>🔍 Reviewer Agent</h3>
            <div className="metric-item">
              <span className="metric-label">Total Runs:</span>
              <span className="metric-value">{agentMetrics.reviewerAgent.totalRuns}</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Success Rate:</span>
              <span className="metric-value">{agentMetrics.reviewerAgent.successRate}%</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Avg Time:</span>
              <span className="metric-value">{agentMetrics.reviewerAgent.avgExecutionTime}s</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">LLM Usage:</span>
              <span className="metric-value">{agentMetrics.reviewerAgent.llmUsage}%</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Optimizations:</span>
              <span className="metric-value">{agentMetrics.reviewerAgent.optimizationsSuggested}</span>
            </div>
            <div className="metric-item">
              <span className="metric-label">Error Rate:</span>
              <span className="metric-value error">{agentMetrics.reviewerAgent.errors}%</span>
            </div>
            {agentMetrics.reviewerAgent.lastError && (
              <div className="error-detail">
                <span className="error-label">Last Error:</span>
                <span className="error-message">{agentMetrics.reviewerAgent.lastError}</span>
              </div>
            )}
            <div className="agent-status">
              Status: <span className="status-active">✅ Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Executions */}
      <div className="section">
        <h2 className="section-title">📊 Recent Executions</h2>
        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Child</th>
                <th>Timestamp</th>
                <th>Total Time</th>
                <th>Agents Used</th>
                <th>Status</th>
                <th>LLM Tokens</th>
              </tr>
            </thead>
            <tbody>
              {recentExecutions.map((execution) => (
                <tr key={execution.id}>
                  <td>{execution.user}</td>
                  <td>{execution.child}</td>
                  <td>{formatTimestamp(execution.timestamp)}</td>
                  <td>{execution.totalTime}s</td>
                  <td>
                    <div className="agent-tags">
                      {execution.agents.map(agent => (
                        <span key={agent} className="agent-tag">{agent}</span>
                      ))}
                    </div>
                  </td>
                  <td>
                    <span className={`status-badge ${execution.status}`}>
                      {execution.status}
                    </span>
                  </td>
                  <td>{execution.llmTokens}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Error Logs */}
      <div className="section">
        <h2 className="section-title">🚨 Error Logs</h2>
        {errorLogs.length === 0 ? (
          <p className="no-errors">✅ No errors found in recent executions</p>
        ) : (
          <div className="admin-table">
            <table>
              <thead>
                <tr>
                  <th>Timestamp</th>
                  <th>User</th>
                  <th>Agent</th>
                  <th>Error Message</th>
                  <th>Execution Time</th>
                </tr>
              </thead>
              <tbody>
                {errorLogs.map((error) => (
                  <tr key={error.id} className="error-row">
                    <td>{formatTimestamp(error.timestamp)}</td>
                    <td>{error.user}</td>
                    <td>
                      <span className="agent-tag error">{error.agent}</span>
                    </td>
                    <td className="error-message-cell">
                      <div className="error-message">{error.error}</div>
                      {error.stackTrace && (
                        <details className="stack-trace">
                          <summary>Stack Trace</summary>
                          <pre>{error.stackTrace}</pre>
                        </details>
                      )}
                    </td>
                    <td>{error.executionTime}s</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Recent User Activity */}
      <div className="section">
        <h2 className="section-title">👥 Recent User Activity</h2>
        <div className="admin-table">
          <table>
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Member Since</th>
                <th>Subscription</th>
              </tr>
            </thead>
            <tbody>
              {users.slice(0, 10).map((user) => (
                <tr key={user.id}>
                  <td>
                    <div className="user-info">
                      <div className="user-name">
                        {user.profile?.firstName && user.profile?.lastName 
                          ? `${user.profile.firstName} ${user.profile.lastName}`
                          : user.displayName || 'No name set'
                        }
                      </div>
                      <div className="user-username">@{user.id}</div>
                    </div>
                  </td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`role-badge ${user.role || 'parent'}`}>
                      {getRoleDisplayName(user.role || 'parent')}
                    </span>
                  </td>
                  <td>{formatDate(user.createdAt)}</td>
                  <td>
                    <div className="subscription-info">
                      <span className={`subscription-plan ${getSubscriptionStatus(user.subscription).toLowerCase().replace(' ', '-')}`}>
                        {getSubscriptionStatus(user.subscription)}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="section">
        <h2 className="section-title">⚡ Quick Actions</h2>
        <div className="quick-actions-grid">
          <button onClick={checkSystemHealth} className="action-button">
            🔄 Refresh System Health
          </button>
          <button onClick={fetchAgentMetrics} className="action-button">
            📊 Update Agent Metrics
          </button>
          <button onClick={fetchRecentExecutions} className="action-button">
            📈 Refresh Executions
          </button>
          <button onClick={fetchErrorLogs} className="action-button">
            🚨 Check Error Logs
          </button>
          <button onClick={fetchPerformanceMetrics} className="action-button">
            ⚡ Performance Metrics
          </button>
          <button onClick={fetchUsers} className="action-button">
            👥 Refresh User Data
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
