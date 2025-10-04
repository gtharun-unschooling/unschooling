import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, getDoc, collection, getDocs, query, orderBy, updateDoc } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import config from '../config/config';

const CustomisedWeeklyPlan = () => {
  const { currentUser: user, loading: authLoading, error: authError } = useAuth();
  const [plans, setPlans] = useState({});
  const [selectedMonth, setSelectedMonth] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [childName, setChildName] = useState('');
  const [generatingPlan, setGeneratingPlan] = useState(false);
  const [availableChildren, setAvailableChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState('');
  const [currentPlan, setCurrentPlan] = useState(null);
  const [agentPerformance, setAgentPerformance] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  // Load available children (using same method as ProfileForm.jsx)
  const loadAvailableChildren = async () => {
    if (!user) {
      console.log('❌ No user found, skipping loadAvailableChildren');
      return;
    }
    
    console.log('🔍 Starting loadAvailableChildren...');
    console.log('👤 User UID:', user.uid);
    console.log('🔗 Database instance:', db);
    
    try {
      console.log('📂 Creating collection reference...');
      const childrenRef = collection(db, `users/${user.uid}/children`);
      console.log('📂 Collection ref:', childrenRef);
      console.log('📂 Collection path:', childrenRef.path);
      
      console.log('📥 Fetching documents...');
      console.log('📥 Full collection path:', `users/${user.uid}/children`);
      
      const childrenSnapshot = await getDocs(childrenRef);
      console.log('📥 Snapshot received:', childrenSnapshot);
      console.log('📊 Snapshot size:', childrenSnapshot.size);
      
      const childrenList = [];
      
      childrenSnapshot.forEach((doc) => {
        console.log('📄 Processing doc:', doc.id, doc.data());
        const data = doc.data();
        childrenList.push({
          id: doc.id,
          name: data.child_name || data.name || doc.id,
          age: data.child_age || data.age || 5,
          interests: data.interests || data.child_interests || [],
          ...data
        });
      });
      
      console.log('✅ Final children list:', childrenList);
      setAvailableChildren(childrenList);
      console.log('💾 Available children state updated');
      
      // If there are children, select the first one by default
      if (childrenList.length > 0 && !selectedChild) {
        console.log('🎯 Auto-selecting first child:', childrenList[0]);
        setSelectedChild(childrenList[0].id);
        setChildName(childrenList[0].name);
        loadPlansForChild(childrenList[0].id);
      } else if (childrenList.length === 0) {
        console.log('⚠️ No children found in Firestore');
        console.log('👶 User needs to create child profiles first');
        
        // Clear state when no children found
        setAvailableChildren([]);
        setSelectedChild('');
        setChildName('');
        setError('');
      }
    } catch (error) {
      console.error('❌ Error loading children:', error);
      setError('Failed to load child profiles: ' + error.message);
    }
  };

  // Load plans for specific child
  const loadPlansForChild = async (childId) => {
    try {
      setLoading(true);
      const childRef = doc(db, `users/${user.uid}/children`, childId);
      const childSnap = await getDoc(childRef);
      
      if (childSnap.exists()) {
        const childData = childSnap.data();
        const existingPlans = childData.plans || {};
        setPlans(existingPlans);
        
        if (Object.keys(existingPlans).length === 0) {
          // No plans exist, generate new one
          generateNewPlan(childData);
        } else {
          // Set the first available month as selected
          const months = Object.keys(existingPlans);
          if (months.length > 0) {
            setSelectedMonth(months[0]);
            setCurrentPlan(existingPlans[months[0]]);
          }
        }
      }
    } catch (error) {
      console.error('❌ Error loading plans:', error);
      setError('Failed to load plans');
    } finally {
      setLoading(false);
    }
  };

  // Generate new plan
  const generateNewPlan = async (childData) => {
    try {
      setGeneratingPlan(true);
      setError('');
      
      const profileData = {
        child_name: childData.name || childData.child_name || 'Child',
        child_age: childData.age || childData.child_age || 5,
        interests: childData.interests || [],
        preferred_learning_style: 'mixed',
        plan_type: 'hybrid'
      };
      
      const response = await fetch('http://localhost:8000/api/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'unschooling-api-key-2024',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ profile: profileData }),
      });
      
      if (response.ok) {
        const result = await response.json();
        
        if (result.success && result.data) {
          const currentMonth = new Date().toLocaleString('default', { month: 'long' }) + ' ' + new Date().getFullYear();
          const newPlans = {
            ...plans,
            [currentMonth]: result.data
          };
          
          // Save to Firebase
          const childRef = doc(db, `users/${user.uid}/children`, selectedChild);
          await updateDoc(childRef, {
            plans: newPlans
          });
          
          setPlans(newPlans);
          setSelectedMonth(currentMonth);
          setCurrentPlan(result.data);
          
          // Store agent performance data
          if (result.data.agent_timings) {
            setAgentPerformance(result.data.agent_timings);
          }
        } else {
          setError('Failed to generate plan');
        }
      } else {
        setError('Failed to connect to plan generation service');
      }
    } catch (error) {
      console.error('❌ Error generating plan:', error);
      setError('Failed to generate plan: ' + error.message);
    } finally {
      setGeneratingPlan(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadAvailableChildren();
    }
  }, [user]);

  if (authLoading) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div>Loading...</div>
      </div>
    );
  }

  if (authError) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red' }}>
        <div>Error: {authError.message}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <div>Please log in to view your learning plans.</div>
        <button 
          onClick={() => navigate('/login')}
          style={{
            background: '#4CAF50',
            color: 'white',
            border: 'none',
            padding: '10px 20px',
            borderRadius: '4px',
            cursor: 'pointer',
            marginTop: '10px'
          }}
        >
          Go to Login
        </button>
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Back Button */}
      <button 
        onClick={() => navigate('/dashboard')}
        style={{
          background: '#4CAF50',
          color: 'white',
          border: 'none',
          padding: '12px 24px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '16px',
          fontWeight: 'bold',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '20px'
        }}
      >
        ← Back to Dashboard
      </button>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '40px',
        borderRadius: '12px',
        textAlign: 'center',
        marginBottom: '30px'
      }}>
        <h1 style={{ margin: '0 0 10px 0', fontSize: '2.5rem' }}>
          🎯 Personalized Learning Journey
        </h1>
        <p style={{ margin: '0', fontSize: '1.2rem', opacity: 0.9 }}>
          Tailored weekly activities designed just for your child
        </p>
      </div>

      {/* Debug Info */}
      <div style={{
        background: '#e3f2fd',
        border: '1px solid #2196f3',
        borderRadius: '8px',
        padding: '15px',
        marginBottom: '20px',
        fontSize: '14px'
      }}>
        <h4 style={{ margin: '0 0 10px 0', color: '#1976d2' }}>🔍 Debug Information</h4>
        <div><strong>Available Children:</strong> {availableChildren.length}</div>
        <div><strong>Selected Child:</strong> {selectedChild || 'None'}</div>
        <div><strong>Child Name:</strong> {childName || 'Not set'}</div>
        <div><strong>Current Plan:</strong> {currentPlan ? 'Loaded' : 'None'}</div>
        <div><strong>User ID:</strong> {user?.uid || 'Not authenticated'}</div>
        <div><strong>Firebase DB:</strong> {db ? 'Connected' : 'Not connected'}</div>
        <div style={{ marginTop: '10px' }}>
          <button
            onClick={loadAvailableChildren}
            style={{
              background: '#2196f3',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            🔄 Reload Children
          </button>
          <button
            onClick={() => {
              console.log('🔍 Manual debug - User:', user);
              console.log('🔍 Manual debug - DB:', db);
              console.log('🔍 Manual debug - Available children:', availableChildren);
            }}
            style={{
              background: '#ff9800',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              marginRight: '10px'
            }}
          >
            🐛 Console Debug
          </button>
          <button
            onClick={() => {
              console.log('🧪 Creating manual test child...');
              const testChild = {
                id: 'manual-test-' + Date.now(),
                name: 'Manual Test Child',
                age: 7,
                interests: ['science', 'art', 'music']
              };
              setAvailableChildren([testChild]);
              setSelectedChild(testChild.id);
              setChildName(testChild.name);
              setError('');
              console.log('✅ Manual test child created:', testChild);
            }}
            style={{
              background: '#4caf50',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            🧪 Create Test Child
          </button>
        </div>
      </div>

      {/* Child Profile Selection */}
      {availableChildren.length > 0 && (
        <div style={{
          background: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <h3 style={{ margin: '0 0 15px 0', color: '#495057' }}>👶 Select Child Profile</h3>
          <select
            value={selectedChild}
            onChange={(e) => {
              const childId = e.target.value;
              console.log('🔄 Child selection changed:', childId);
              const child = availableChildren.find(c => c.id === childId);
              if (child) {
                console.log('👶 Selected child:', child);
                setSelectedChild(childId);
                setChildName(child.name);
                setCurrentPlan(null); // Clear current plan
                setAgentPerformance(null); // Clear performance data
                loadPlansForChild(childId);
              }
            }}
            style={{
              padding: '12px',
              borderRadius: '6px',
              border: '2px solid #ddd',
              fontSize: '16px',
              width: '100%',
              maxWidth: '400px',
              background: 'white'
            }}
          >
            <option value="">Select a child...</option>
            {availableChildren.map((child) => (
              <option key={child.id} value={child.id}>
                {child.name} (Age {child.age})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* No Children Message */}
      {availableChildren.length === 0 && user && (
        <div style={{
          background: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '20px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#856404' }}>⚠️ No Child Profiles Found</h3>
          <p style={{ margin: '0 0 15px 0', color: '#856404' }}>
            You need to create a child profile first to generate learning plans.
          </p>
          <button
            onClick={() => navigate('/dashboard')}
            style={{
              background: '#007bff',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '16px'
            }}
          >
            Go to Dashboard
          </button>
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div style={{
          background: '#f8d7da',
          color: '#721c24',
          padding: '15px',
          borderRadius: '6px',
          marginBottom: '20px',
          border: '1px solid #f5c6cb'
        }}>
          ❌ {error}
        </div>
      )}

      {/* Loading State */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '18px', marginBottom: '10px' }}>Loading plans...</div>
        </div>
      )}

      {/* Generating Plan */}
      {generatingPlan && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{ fontSize: '18px', marginBottom: '10px' }}>🎯 Generating personalized plan...</div>
          <div style={{ fontSize: '14px', color: '#666' }}>This may take a few moments</div>
        </div>
      )}

      {/* No Children */}
      {availableChildren.length === 0 && !loading && (
        <div style={{
          background: '#fff3cd',
          border: '1px solid #ffeaa7',
          borderRadius: '8px',
          padding: '20px',
          textAlign: 'center'
        }}>
          <h3 style={{ margin: '0 0 10px 0', color: '#856404' }}>No Child Profiles Found</h3>
          <p style={{ margin: '0 0 15px 0', color: '#856404' }}>
            Please create a child profile first to generate learning plans.
          </p>
          <button 
            onClick={() => navigate('/profile')}
            style={{
              background: '#007bff',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Create Child Profile
          </button>
        </div>
      )}

      {/* Plans Display */}
      {Object.keys(plans).length > 0 && (
        <div>
          <h3 style={{ marginBottom: '20px', color: '#333' }}>
            📅 Learning Plans for {childName}
          </h3>
          
          {/* Month Selection */}
          {Object.keys(plans).length > 1 && (
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 'bold' }}>
                Select Month:
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                style={{
                  padding: '10px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  fontSize: '16px',
                  minWidth: '200px'
                }}
              >
                {Object.keys(plans).map((month) => (
                  <option key={month} value={month}>{month}</option>
                ))}
              </select>
            </div>
          )}

          {/* Plan Content */}
          {currentPlan && (
            <div style={{
              background: 'white',
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '30px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h4 style={{ margin: '0', color: '#333' }}>
                  📅 {selectedMonth} Learning Plan for {childName}
                </h4>
                <button
                  onClick={() => {
                    const childData = availableChildren.find(child => child.id === selectedChild);
                    if (childData) {
                      generateNewPlan(childData);
                    }
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    padding: '10px 20px',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
                    fontWeight: '600',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)';
                  }}
                >
                  🚀 Generate New Plan
                </button>
              </div>
              
              {/* Weekly Plan Display */}
              {currentPlan.weekly_plan && (
                <div>
                  {Object.entries(currentPlan.weekly_plan).map(([weekKey, weekData]) => (
                    <div key={weekKey} style={{ marginBottom: '30px' }}>
                      <h5 style={{ 
                        background: '#f8f9fa', 
                        padding: '10px', 
                        borderRadius: '6px',
                        margin: '0 0 15px 0',
                        color: '#495057',
                        textTransform: 'capitalize'
                      }}>
                        {weekKey.replace('_', ' ')} Week
                      </h5>
                      
                      <div style={{ overflowX: 'auto' }}>
                        <table style={{
                          width: '100%',
                          borderCollapse: 'collapse',
                          border: '1px solid #ddd',
                          borderRadius: '6px',
                          overflow: 'hidden'
                        }}>
                          <thead>
                            <tr style={{ background: '#f8f9fa' }}>
                              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Day</th>
                              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Topic</th>
                              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Activity</th>
                              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Duration</th>
                              <th style={{ padding: '12px', border: '1px solid #ddd', textAlign: 'left' }}>Materials</th>
                            </tr>
                          </thead>
                          <tbody>
                            {Object.entries(weekData).map(([dayKey, dayData]) => (
                              <tr key={dayKey}>
                                <td style={{ padding: '12px', border: '1px solid #ddd', fontWeight: 'bold' }}>
                                  {dayKey.charAt(0).toUpperCase() + dayKey.slice(1)}
                                </td>
                                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                                  {dayData.topic || 'N/A'}
                                </td>
                                <td style={{ padding: '12px', border: '1px solid #ddd', maxWidth: '300px' }}>
                                  <div style={{ fontSize: '14px' }}>
                                    {dayData.activity ? (
                                      typeof dayData.activity === 'string' ? 
                                        dayData.activity.substring(0, 100) + '...' : 
                                        'Activity details available'
                                    ) : 'N/A'}
                                  </div>
                                </td>
                                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                                  {dayData.duration || 'N/A'}
                                </td>
                                <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                                  {dayData.materials_needed ? 
                                    (Array.isArray(dayData.materials_needed) ? 
                                      dayData.materials_needed.join(', ') : 
                                      dayData.materials_needed) : 'N/A'}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Agent Performance Section */}
          {agentPerformance && (
            <div style={{
              background: '#f8f9fa',
              border: '2px solid #007bff',
              borderRadius: '8px',
              padding: '20px',
              marginTop: '30px'
            }}>
              <h3 style={{ margin: '0 0 20px 0', color: '#007bff' }}>
                🤖 Agent Performance Metrics & JSON Breakdown
              </h3>
              
              {/* Agent Execution Times */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>⚡ Execution Times</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                  {Object.entries(agentPerformance).filter(([key]) => !key.includes('total_execution_time')).map(([agentName, timing]) => (
                    <div key={agentName} style={{
                      background: 'white',
                      padding: '10px',
                      borderRadius: '6px',
                      border: '1px solid #ddd'
                    }}>
                      <strong>{agentName.replace('_', ' ').toUpperCase()}:</strong> {timing.execution_time_seconds?.toFixed(4)}s
                    </div>
                  ))}
                </div>
              </div>

              {/* Total Execution Time */}
              {agentPerformance.total_execution_time && (
                <div style={{
                  background: '#e3f2fd',
                  padding: '15px',
                  borderRadius: '6px',
                  marginBottom: '20px'
                }}>
                  <strong>Total Execution Time:</strong> {agentPerformance.total_execution_time.toFixed(4)}s
                </div>
              )}

              {/* LLM Usage Stats */}
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>🧠 LLM Usage</h4>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '10px' }}>
                  {Object.entries(agentPerformance).filter(([key]) => !key.includes('total_execution_time')).map(([agentName, timing]) => (
                    <div key={agentName} style={{
                      background: 'white',
                      padding: '10px',
                      borderRadius: '6px',
                      border: '1px solid #ddd'
                    }}>
                      <div><strong>{agentName.replace('_', ' ').toUpperCase()}:</strong></div>
                      <div>LLM Used: {timing.llm_used ? '✅ Yes' : '❌ No'}</div>
                      <div>Tokens: {timing.tokens_used || 0}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Detailed Agent Breakdown */}
              <div style={{ marginTop: '30px' }}>
                <h4 style={{ margin: '0 0 20px 0', color: '#495057' }}>📊 Detailed Agent Breakdown</h4>
                {Object.entries(agentPerformance).filter(([key]) => !key.includes('total_execution_time')).map(([agentName, timing]) => (
                  <div key={agentName} style={{
                    background: 'white',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    padding: '20px',
                    marginBottom: '20px'
                  }}>
                    <h5 style={{
                      margin: '0 0 15px 0',
                      color: '#007bff',
                      fontSize: '1.1rem',
                      borderBottom: '2px solid #007bff',
                      paddingBottom: '8px'
                    }}>
                      {agentName.replace('_', ' ').toUpperCase()} AGENT
                    </h5>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                      {/* LLM Input/Output */}
                      <div>
                        <h6 style={{
                          margin: '0 0 8px 0',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          color: '#dc2626',
                          borderBottom: '1px solid #fecaca',
                          paddingBottom: '4px'
                        }}>
                          🤖 LLM Input/Output
                        </h6>
                        <div style={{ marginBottom: '12px' }}>
                          <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>Input (Prompt):</div>
                          <div style={{
                            background: '#fef2f2',
                            border: '1px solid #fecaca',
                            borderRadius: '4px',
                            padding: '8px',
                            fontSize: '0.8rem',
                            color: '#991b1b',
                            fontFamily: 'monospace',
                            maxHeight: '100px',
                            overflowY: 'auto'
                          }}>
                            <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                              {timing.llm_prompt || 'No LLM prompt available'}
                            </pre>
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>Output (Response):</div>
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
                              {timing.llm_response || 'No LLM response available'}
                            </pre>
                          </div>
                        </div>
                      </div>

                      {/* Agent Processing Data */}
                      <div>
                        <h6 style={{
                          margin: '0 0 8px 0',
                          fontSize: '0.9rem',
                          fontWeight: '600',
                          color: '#059669',
                          borderBottom: '1px solid #bbf7d0',
                          paddingBottom: '4px'
                        }}>
                          🎯 Agent Processing Data
                        </h6>
                        <div style={{ marginBottom: '12px' }}>
                          <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>Input Data:</div>
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
                              {JSON.stringify(timing.input_data || {}, null, 2)}
                            </pre>
                          </div>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.8rem', fontWeight: '600', color: '#374151', marginBottom: '4px' }}>Output Data:</div>
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
                              {JSON.stringify(timing.output_data || {}, null, 2)}
                            </pre>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Raw Agent Data */}
              <details style={{ marginTop: '20px' }}>
                <summary style={{ cursor: 'pointer', fontWeight: 'bold', color: '#007bff' }}>
                  🔍 View Complete Raw Agent Data
                </summary>
                <pre style={{
                  background: '#f5f5f5',
                  padding: '15px',
                  borderRadius: '6px',
                  overflow: 'auto',
                  fontSize: '12px',
                  marginTop: '10px',
                  maxHeight: '400px'
                }}>
                  {JSON.stringify(agentPerformance, null, 2)}
                </pre>
              </details>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default CustomisedWeeklyPlan;
