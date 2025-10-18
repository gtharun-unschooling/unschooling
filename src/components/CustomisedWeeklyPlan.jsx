import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, getDoc, collection, getDocs, query, orderBy, updateDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useAuth } from '../contexts/AuthContext';
import { useLocation, useNavigate } from 'react-router-dom';
import config from '../config/config';
import MinimalBackButton from './ui/MinimalBackButton';

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

  // Load plans for specific child (UPDATED: reads from subcollection)
  const loadPlansForChild = async (childId) => {
    try {
      setLoading(true);
      console.log('📂 Loading plans for child:', childId);
      
      // Read plans from subcollection (not nested object)
      const plansRef = collection(db, `users/${user.uid}/children/${childId}/plans`);
      const plansQuery = query(plansRef, orderBy('created_at', 'desc'));
      const plansSnapshot = await getDocs(plansQuery);
      
      console.log('📊 Found plans:', plansSnapshot.size);
      
      const existingPlans = {};
      plansSnapshot.forEach((planDoc) => {
        const planData = planDoc.data();
        // Use month field or create one from created_at
        const monthKey = planData.month || (
          planData.created_at 
            ? new Date(planData.created_at.toDate()).toLocaleString('default', { month: 'long', year: 'numeric' })
            : 'Latest Plan'
        );
        existingPlans[monthKey] = {
          ...planData,
          planId: planDoc.id // Store the document ID
        };
      });
      
      setPlans(existingPlans);
      
      if (Object.keys(existingPlans).length === 0) {
        console.log('⚠️ No plans found, need to generate one');
        // Get child data for generation
        const childRef = doc(db, `users/${user.uid}/children`, childId);
        const childSnap = await getDoc(childRef);
        if (childSnap.exists()) {
          generateNewPlan(childSnap.data(), childId); // Pass childId explicitly
        }
      } else {
        console.log('✅ Loaded plans:', Object.keys(existingPlans));
        // Set the first available month as selected
        const months = Object.keys(existingPlans);
        if (months.length > 0) {
          setSelectedMonth(months[0]);
          setCurrentPlan(existingPlans[months[0]]);
        }
      }
    } catch (error) {
      console.error('❌ Error loading plans:', error);
      setError('Failed to load plans: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // Generate new plan (UPDATED: saves to subcollection)
  const generateNewPlan = async (childData, childId = null) => {
    try {
      setGeneratingPlan(true);
      setError('');
      
      // Use provided childId or fall back to selectedChild or childData.id
      const actualChildId = childId || selectedChild || childData.id || childData.childId;
      
      if (!actualChildId) {
        throw new Error('Child ID is required to generate a plan');
      }
      
      console.log('🆔 Using child ID:', actualChildId);
      
      const profileData = {
        userId: user.uid,
        childId: actualChildId,
        child_name: childData.name || childData.child_name || 'Child',
        child_age: childData.age || childData.child_age || 5,
        interests: childData.interests || [],
        preferred_learning_style: childData.preferred_learning_style || 'mixed',
        plan_type: childData.plan_type || 'hybrid'
      };
      
      console.log('🚀 Generating plan with profile:', profileData);
      
      const apiUrl = `${config.API_BASE_URL}${config.ENDPOINTS.GENERATE_PLAN}`;
      console.log('🌐 API URL:', apiUrl);
      
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'unschooling-api-key-2024',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ childProfile: profileData, planType: profileData.plan_type }),
      });
      
      if (response.ok) {
        const result = await response.json();
        
        if (result.success && result.data) {
          const currentMonth = new Date().toLocaleString('default', { month: 'long', year: 'numeric' });
          
          console.log('✅ Plan generated successfully');
          
          // Save to subcollection (NOT nested in child document)
          const planRef = doc(collection(db, `users/${user.uid}/children/${actualChildId}/plans`));
          const planDocument = {
            ...result.data,
            month: currentMonth,
            status: 'active',
            created_at: serverTimestamp(),
            updated_at: serverTimestamp()
          };
          
          await setDoc(planRef, planDocument);
          console.log('💾 Plan saved to subcollection:', planRef.id);
          
          // Update local state
          const newPlans = {
            ...plans,
            [currentMonth]: {
              ...result.data,
              planId: planRef.id
            }
          };
          
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
      <div style={{ padding: '20px', textAlign: 'center', position: 'relative' }}>
        <MinimalBackButton 
          heroColors={{
            backgroundColor: '#ffffff',
            primaryColor: '#667eea',
            nicheColor: '#764ba2'
          }}
        />
        <div>Loading...</div>
      </div>
    );
  }

  if (authError) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', color: 'red', position: 'relative' }}>
        <MinimalBackButton 
          heroColors={{
            backgroundColor: '#ffffff',
            primaryColor: '#667eea',
            nicheColor: '#764ba2'
          }}
        />
        <div>Error: {authError.message}</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ padding: '20px', textAlign: 'center', position: 'relative' }}>
        <MinimalBackButton 
          heroColors={{
            backgroundColor: '#ffffff',
            primaryColor: '#667eea',
            nicheColor: '#764ba2'
          }}
        />
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
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto', position: 'relative' }}>
      {/* Back Button - Standard minimal button */}
      <MinimalBackButton 
        heroColors={{
          backgroundColor: '#ffffff',
          primaryColor: '#667eea',
          nicheColor: '#764ba2'
        }}
      />

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


      {/* Child Profile Selection */}
      {availableChildren.length > 0 && (
        <div style={{
          background: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '20px'
        }}>
          <h4 style={{ margin: '0 0 15px 0', color: '#495057' }}>👶 Select Child Profile</h4>
          <select
            value={selectedChild}
            onChange={(e) => {
              const childId = e.target.value;
              const child = availableChildren.find(c => c.id === childId);
              if (child) {
                setSelectedChild(childId);
                setChildName(child.name);
                setCurrentPlan(null);
                setAgentPerformance(null);
                loadPlansForChild(childId);
              }
            }}
            style={{
              padding: '12px',
              borderRadius: '6px',
              border: '1px solid #ced4da',
              fontSize: '16px',
              width: '100%',
              background: 'white',
              marginBottom: '20px',
              cursor: 'pointer'
            }}
          >
            {availableChildren.map((child) => (
              <option key={child.id} value={child.id}>
                {child.name} (Age {child.age})
              </option>
            ))}
          </select>
          
          {/* Month Selector - Always show when plans exist */}
          {Object.keys(plans).length > 0 && (
            <>
              <h4 style={{ margin: '0 0 10px 0', color: '#495057' }}>📅 Select Month</h4>
              <select
                value={selectedMonth}
                onChange={(e) => {
                  setSelectedMonth(e.target.value);
                  setCurrentPlan(plans[e.target.value]);
                }}
                style={{
                  padding: '12px',
                  borderRadius: '6px',
                  border: '1px solid #ced4da',
                  fontSize: '16px',
                  width: '100%',
                  background: 'white',
                  cursor: 'pointer'
                }}
              >
                {Object.keys(plans).sort((a, b) => {
                  // Sort descending - newest first
                  const dateA = new Date(a);
                  const dateB = new Date(b);
                  return dateB - dateA;
                }).map(month => (
                  <option key={month} value={month}>
                    {month}
                  </option>
                ))}
              </select>
            </>
          )}
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
      {currentPlan && (
        <div>
            <div style={{
              background: 'white',
              border: '1px solid #ddd',
              borderRadius: '8px',
              padding: '20px',
              marginBottom: '30px'
            }}>
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ margin: '0', color: '#333' }}>
                  📅 Learning Plan ({selectedMonth})
                </h4>
              </div>
              
              {/* Weekly Plan Display - Responsive Cards */}
              {currentPlan.weekly_plan && (
                <div>
                  {Object.entries(currentPlan.weekly_plan).map(([weekKey, weekData]) => (
                    <div key={weekKey} style={{ marginBottom: '30px' }}>
                      <h5 style={{ 
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                        color: 'white',
                        padding: '12px 16px', 
                        borderRadius: '8px',
                        margin: '0 0 15px 0',
                        textTransform: 'capitalize',
                        fontSize: '1.1rem',
                        fontWeight: '700',
                        boxShadow: '0 2px 8px rgba(102, 126, 234, 0.2)'
                      }}>
                        {weekKey.replace('_', ' ')} Week
                      </h5>
                      
                      {/* Mobile-Friendly Card Layout */}
                      <div style={{ 
                        display: 'grid',
                        gap: '15px'
                      }}>
                        {Object.entries(weekData).map(([dayKey, dayData]) => (
                          <div key={dayKey} style={{
                            background: 'white',
                            border: '1px solid #e0e0e0',
                            borderRadius: '10px',
                            padding: '14px 18px',
                            boxShadow: '0 1px 4px rgba(0, 0, 0, 0.06)',
                            transition: 'all 0.2s ease',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '15px'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.1)';
                            e.currentTarget.style.transform = 'translateX(4px)';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = '0 1px 4px rgba(0, 0, 0, 0.06)';
                            e.currentTarget.style.transform = 'translateX(0)';
                          }}>
                            
                            {/* Day */}
                            <div style={{
                              minWidth: '90px',
                              fontWeight: '700',
                              color: '#667eea',
                              fontSize: '0.95rem',
                              textTransform: 'capitalize'
                            }}>
                              {dayKey}
                            </div>
                            
                            {/* Topic Title */}
                            <div style={{
                              flex: '1',
                              fontSize: '1rem',
                              fontWeight: '600',
                              color: '#333',
                              lineHeight: '1.3'
                            }}>
                              {dayData.topic || 'Activity'}
                            </div>
                            
                            {/* Duration */}
                            {dayData.duration && (
                              <div style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                color: 'white',
                                padding: '6px 14px',
                                borderRadius: '20px',
                                fontSize: '0.85rem',
                                fontWeight: '700',
                                whiteSpace: 'nowrap',
                                minWidth: '70px',
                                textAlign: 'center'
                              }}>
                                {dayData.duration}
                              </div>
                            )}
                          </div>
                        ))}
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
