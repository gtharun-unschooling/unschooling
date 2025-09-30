import React, { useState, useEffect } from 'react';
import { db, auth } from '../../firebase';
import { collection, getDocs, doc, getDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { createUnifiedWeeklyPlan, getPlanSummary } from '../../utils/unifiedPlanFormat';

const UnifiedDashboard = () => {
  console.log('🚀 UnifiedDashboard component rendering...');
  
  const [user] = useAuthState(auth);
  const [children, setChildren] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAgent, setSelectedAgent] = useState(null);
  const [showAgentModal, setShowAgentModal] = useState(false);
  
  console.log('🔍 Dashboard state:', { user, loading, error, childrenCount: children.length });

  // 4 Agents configuration
  const agents = [
    { id: 1, name: 'Profile Agent', color: '#3b82f6', icon: '👤', description: 'Analyzes child profile and extracts key information for personalized learning' },
    { id: 2, name: 'Match Agent', color: '#10b981', icon: '🔗', description: 'Matches topics to child profile using systematic approach with history consideration' },
    { id: 3, name: 'Schedule Agent', color: '#8b5cf6', icon: '📅', description: 'Creates systematic 4-week learning plans with structured activities' },
    { id: 4, name: 'Reviewer Agent', color: '#f59e0b', icon: '📝', description: 'Reviews and optimizes learning plans for effectiveness and engagement' }
  ];

  useEffect(() => {
    console.log('🔍 Dashboard useEffect triggered');
    console.log('👤 User state:', user);
    console.log('👤 User UID:', user?.uid);
    console.log('👤 User email:', user?.email);
    
    if (user) {
      console.log('✅ User authenticated, loading children data...');
      loadRealChildrenData();
    } else {
      console.log('❌ No user authenticated');
      setLoading(false);
    }
  }, [user]);

  const loadRealChildrenData = async () => {
    try {
      setLoading(true);
      setError(null); // Clear any previous errors
      console.log('🔍 Loading real children data from Firestore...');
      
      if (!user || !user.uid) {
        throw new Error('User not authenticated');
      }
      
      // Get children collection from Firestore
      const childrenRef = collection(db, `users/${user.uid}/children`);
      const childrenSnapshot = await getDocs(childrenRef);
      
      console.log(`🔍 Found ${childrenSnapshot.docs.length} children in Firestore`);
      
      const childrenList = [];
      
      for (const childDoc of childrenSnapshot.docs) {
        try {
          const childData = childDoc.data();
          console.log('👶 Processing child:', childDoc.id, childData);
          
          // Validate child data
          if (!childData) {
            console.warn('⚠️ Skipping child with no data:', childDoc.id);
            continue;
          }
          
          // Get agent activities from the child's data
          const agentActivities = await getAgentActivities(childDoc.id, childData);
          
          console.log(`🔍 Child ${childDoc.id} plans data:`, childData.plans);
          console.log(`🔍 Child ${childDoc.id} agent activities:`, agentActivities);
          
          childrenList.push({
            id: childDoc.id,
            name: childData.child_name || childData.name || childDoc.id || 'Unknown Child',
            age: childData.child_age || childData.age || 5,
            interests: Array.isArray(childData.interests) ? childData.interests : [],
            learningStyle: childData.preferred_learning_style || childData.learning_style || 'mixed',
            planType: childData.plan_type || 'hybrid',
            goals: Array.isArray(childData.goals) ? childData.goals : [],
            createdAt: childData.created_at || null,
            updatedAt: childData.updated_at || null,
            plans: childData.plans || {},
            months: Array.isArray(childData.months) ? childData.months : [],
            agentActivities: agentActivities
          });
        } catch (childError) {
          console.error(`❌ Error processing child ${childDoc.id}:`, childError);
          // Continue with other children instead of failing completely
        }
      }
      
      console.log('✅ Loaded children:', childrenList);
      
      // Helper function to get timestamp value
      const getTimestamp = (timestamp) => {
        if (!timestamp) return new Date(0);
        if (timestamp && typeof timestamp === 'object' && timestamp.toDate) {
          // Firestore timestamp
          return timestamp.toDate();
        } else if (timestamp instanceof Date) {
          // Regular Date object
          return timestamp;
        } else if (typeof timestamp === 'string' || typeof timestamp === 'number') {
          // String or number timestamp
          return new Date(timestamp);
        }
        return new Date(0);
      };
      
      // Debug: Log timestamp values for each child
      childrenList.forEach((child, index) => {
        try {
          console.log(`👶 Child ${index + 1} (${child.name}):`, {
            createdAt: child.createdAt,
            updatedAt: child.updatedAt,
            createdAtType: typeof child.createdAt,
            updatedAtType: typeof child.updatedAt,
            hasToDate: child.createdAt?.toDate ? 'Yes' : 'No',
            updatedHasToDate: child.updatedAt?.toDate ? 'Yes' : 'No'
          });
        } catch (error) {
          console.warn(`⚠️ Error logging child ${index + 1} (${child.name}):`, error);
        }
      });
      
      // Sort children by latest updated or created date in descending order
      const sortedChildren = childrenList.sort((a, b) => {
        try {
          const aTime = getTimestamp(a.updatedAt || a.createdAt);
          const bTime = getTimestamp(b.updatedAt || b.createdAt);
          
          // Descending order: newest first, oldest last
          return bTime - aTime;
        } catch (error) {
          console.warn('⚠️ Error during sorting, using original order:', error);
          return 0; // Keep original order if sorting fails
        }
      });
      
      // Debug: Log the sorted order with timestamps
      console.log('📅 Sorted children by timestamp (descending):');
      sortedChildren.forEach((child, index) => {
        try {
          const timestamp = child.updatedAt || child.createdAt;
          const timestampValue = getTimestamp(timestamp);
          console.log(`  ${index + 1}. ${child.name} - ${timestampValue.toISOString()}`);
        } catch (error) {
          console.warn(`⚠️ Error logging timestamp for child ${child.name}:`, error);
          console.log(`  ${index + 1}. ${child.name} - Timestamp error`);
        }
      });
      setChildren(sortedChildren);
      
    } catch (err) {
      console.error('❌ Error loading children:', err);
      setError(err.message || 'Failed to load children data');
    } finally {
      setLoading(false);
    }
  };

  const getAgentActivities = async (childId, childData) => {
    const activities = {};
    
    try {
      // Validate input data
      if (!childData || typeof childData !== 'object') {
        throw new Error('Invalid child data provided');
      }
      
      // Profile Agent Activity
      activities[1] = {
        status: 'Active',
        lastAction: childData.updated_at ? 'Profile updated' : 'Profile created',
        timestamp: formatTimestamp(childData.updated_at || childData.created_at),
        details: {
          interests: Array.isArray(childData.interests) ? childData.interests.length : 0,
          learningStyle: childData.preferred_learning_style || childData.learning_style || 'mixed',
          goals: Array.isArray(childData.goals) ? childData.goals.length : 0
        },
        fullDetails: {
          childName: childData.child_name || childData.name || childId || 'Unknown Child',
          age: childData.child_age || childData.age || 5,
          interests: Array.isArray(childData.interests) ? childData.interests : [],
          learningStyle: childData.preferred_learning_style || childData.learning_style || 'mixed',
          goals: Array.isArray(childData.goals) ? childData.goals : [],
          planType: childData.plan_type || 'hybrid',
          createdAt: childData.created_at || null,
          updatedAt: childData.updated_at || null
        }
      };

      // Match Agent Activity
      const plans = childData.plans || {};
      const planMonths = Object.keys(plans);
      if (planMonths.length > 0 && typeof plans === 'object') {
        try {
          const latestPlan = plans[planMonths[planMonths.length - 1]];
          if (latestPlan && typeof latestPlan === 'object') {
            const matchedTopics = latestPlan.matched_topics || [];
            console.log(`🔍 Match Agent for child ${childId}: Found ${matchedTopics.length} topics in plan`);
            console.log(`🔍 Topics data:`, matchedTopics);
            
            const niches = Array.isArray(matchedTopics) ? 
              [...new Set(matchedTopics.map(t => (t && typeof t === 'object' ? (t.Niche || t.niche) : null)).filter(Boolean))] : [];
            
            activities[2] = {
              status: 'Active',
              lastAction: `Matched ${matchedTopics.length} topics`,
              timestamp: formatTimestamp(childData.updated_at || childData.created_at),
              details: {
                matchedTopics: matchedTopics.length,
                niches: niches
              },
              fullDetails: {
                matchedTopics: matchedTopics,
                niches: niches,
                totalTopics: matchedTopics.length,
                matchCriteria: {
                  age: childData.child_age || childData.age || 5,
                  interests: Array.isArray(childData.interests) ? childData.interests : [],
                  learningStyle: childData.preferred_learning_style || childData.learning_style || 'mixed'
                }
              }
            };
          } else {
            throw new Error('Invalid plan structure');
          }
        } catch (planError) {
          console.warn(`⚠️ Error processing plan for child ${childId}:`, planError);
          activities[2] = {
            status: 'Error',
            lastAction: 'Plan data corrupted',
            timestamp: 'Error occurred',
            details: { matchedTopics: 0, niches: [] },
            fullDetails: {
              matchedTopics: [],
              niches: [],
              totalTopics: 0,
              matchCriteria: {
                age: childData.child_age || childData.age || 5,
                interests: Array.isArray(childData.interests) ? childData.interests : [],
                learningStyle: childData.preferred_learning_style || childData.learning_style || 'mixed'
              }
            }
          };
        }
      } else {
        activities[2] = {
          status: 'Waiting',
          lastAction: 'No topics matched yet',
          timestamp: 'No plans generated',
          details: { matchedTopics: 0, niches: [] },
          fullDetails: {
            matchedTopics: [],
            niches: [],
            totalTopics: 0,
            matchCriteria: {
              age: childData.child_age || childData.age,
              interests: childData.interests || [],
              learningStyle: childData.preferred_learning_style || childData.learning_style
            }
          }
        };
      }

      // Schedule Agent Activity
      if (planMonths.length > 0) {
        const latestPlan = plans[planMonths[planMonths.length - 1]];
        
        // Create unified plan format
        const unifiedPlan = createUnifiedWeeklyPlan(latestPlan, childData);
        const planSummary = getPlanSummary(unifiedPlan);
        
        activities[3] = {
          status: 'Active',
          lastAction: `Created ${planSummary.totalWeeks} week ${planSummary.planType} plan`,
          timestamp: formatTimestamp(childData.updated_at || childData.created_at),
          details: {
            weeksPlanned: planSummary.totalWeeks,
            planType: planSummary.planType,
            totalActivities: planSummary.totalActivities,
            estimatedDuration: planSummary.estimatedDuration
          },
          fullDetails: unifiedPlan
        };
      } else {
        activities[3] = {
          status: 'Waiting',
          lastAction: 'No schedule created yet',
          timestamp: 'No plans generated',
          details: { weeksPlanned: 0, planType: childData.plan_type },
          fullDetails: createUnifiedWeeklyPlan({}, childData)
        };
      }

      // Reviewer Agent Activity
      if (planMonths.length > 0) {
        const latestPlan = plans[planMonths[planMonths.length - 1]];
        
        // Create unified plan format with review data
        const unifiedPlan = createUnifiedWeeklyPlan(latestPlan, childData);
        const planSummary = getPlanSummary(unifiedPlan);
        
        activities[4] = {
          status: 'Active',
          lastAction: 'Plan reviewed and optimized',
          timestamp: formatTimestamp(childData.updated_at || childData.created_at),
          details: {
            reviewInsights: unifiedPlan.review.insights ? 'Available' : 'Not available',
            learningObjectives: planSummary.learningObjectives,
            effectiveness: unifiedPlan.review.effectiveness || 0
          },
          fullDetails: unifiedPlan
        };
      } else {
        activities[4] = {
          status: 'Waiting',
          lastAction: 'No plan to review yet',
          timestamp: 'No plans generated',
          details: { reviewInsights: 'None', learningObjectives: 0, effectiveness: 0 },
          fullDetails: createUnifiedWeeklyPlan({}, childData)
        };
      }

    } catch (err) {
      console.error('❌ Error getting agent activities:', err);
      // Set default activities if error occurs
      [1, 2, 3, 4].forEach(agentId => {
        activities[agentId] = {
          status: 'Error',
          lastAction: 'Unable to load activity',
          timestamp: 'Error occurred',
          details: {},
          fullDetails: {}
        };
      });
    }
    
    // Ensure all agents have activities
    [1, 2, 3, 4].forEach(agentId => {
      if (!activities[agentId]) {
        activities[agentId] = {
          status: 'Unknown',
          lastAction: 'No data available',
          timestamp: 'Unknown',
          details: {},
          fullDetails: {}
        };
      }
    });
    
    return activities;
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'Unknown';
    
    try {
      // Handle Firestore timestamps
      let date;
      if (timestamp && typeof timestamp === 'object' && timestamp.toDate) {
        date = timestamp.toDate();
      } else if (timestamp instanceof Date) {
        date = timestamp;
      } else if (typeof timestamp === 'string' || typeof timestamp === 'number') {
        date = new Date(timestamp);
      } else {
        return 'Invalid timestamp';
      }
      
      // Validate the date
      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }
      
      const now = new Date();
      const diffMs = now - date;
      const diffMins = Math.floor(diffMs / (1000 * 60));
      const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
      const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
      
      if (diffMins < 1) return 'Just now';
      if (diffMins < 60) return `${diffMins} minutes ago`;
      if (diffHours < 24) return `${diffHours} hours ago`;
      if (diffDays < 7) return `${diffDays} days ago`;
      
      return date.toLocaleDateString();
    } catch (err) {
      console.warn('⚠️ Error formatting timestamp:', err, timestamp);
      return 'Unknown';
    }
  };

  const handleAgentClick = (agent, child, activity) => {
    if (!agent || !child || !activity) {
      console.warn('⚠️ Missing data for agent click:', { agent, child, activity });
      return;
    }
    
    try {
      setSelectedAgent({ agent, child, activity });
      setShowAgentModal(true);
    } catch (error) {
      console.error('❌ Error opening agent modal:', error);
    }
  };

  const closeAgentModal = () => {
    setShowAgentModal(false);
    setSelectedAgent(null);
  };

  const renderAgentDetails = () => {
    if (!selectedAgent || !selectedAgent.agent || !selectedAgent.child || !selectedAgent.activity) {
      console.warn('⚠️ Missing data for agent modal:', selectedAgent);
      return null;
    }
    
    const { agent, child, activity } = selectedAgent;
    
    // Additional validation
    if (!agent || !child || !activity) {
      console.error('❌ Invalid agent data in modal:', { agent, child, activity });
      return null;
    }
    
    return (
      <div style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '1rem'
      }}>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '12px',
          padding: '2rem',
          maxWidth: '800px',
          maxHeight: '90vh',
          overflow: 'auto',
          position: 'relative'
        }}>
          {/* Close Button */}
          <button
            onClick={closeAgentModal}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'none',
              border: 'none',
              fontSize: '1.5rem',
              cursor: 'pointer',
              color: '#6b7280'
            }}
          >
            ✕
          </button>

          {/* Header */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginBottom: '2rem',
            paddingBottom: '1rem',
            borderBottom: '2px solid #e5e7eb'
          }}>
            <div style={{
              width: '60px',
              height: '60px',
              borderRadius: '50%',
              backgroundColor: agent.color,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2rem',
              color: 'white',
              marginRight: '1rem'
            }}>
              {agent.icon}
            </div>
            <div>
              <h2 style={{ fontSize: '2rem', margin: '0 0 0.5rem 0', color: '#1f2937' }}>
                {agent.name}
              </h2>
              <p style={{ color: '#6b7280', margin: 0 }}>
                {agent.description}
              </p>
            </div>
          </div>

          {/* Child Info */}
          <div style={{ 
            backgroundColor: '#f3f4f6', 
            padding: '1rem', 
            borderRadius: '8px',
            marginBottom: '2rem'
          }}>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#374151' }}>
              👶 Working for: {child.name}
            </h3>
            <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>
              Age: {child.age} • Learning Style: {child.learningStyle} • Plan Type: {child.planType}
            </div>
          </div>

          {/* Agent Status */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            marginBottom: '2rem',
            padding: '1rem',
            backgroundColor: activity.status === 'Active' ? '#f0fdf4' : 
                           activity.status === 'Waiting' ? '#fffbeb' : '#fef2f2',
            borderRadius: '8px',
            border: `2px solid ${activity.status === 'Active' ? '#10b981' : 
                               activity.status === 'Waiting' ? '#f59e0b' : '#ef4444'}`
          }}>
            <span style={{
              backgroundColor: activity.status === 'Active' ? '#10b981' : 
                             activity.status === 'Waiting' ? '#f59e0b' : '#ef4444',
              color: 'white',
              padding: '0.5rem 1rem',
              borderRadius: '20px',
              fontSize: '1rem',
              fontWeight: '600'
            }}>
              {activity.status}
            </span>
            <div style={{ marginLeft: '1rem' }}>
              <div style={{ fontWeight: '600', color: '#374151' }}>
                {activity.lastAction}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                {activity.timestamp}
              </div>
            </div>
          </div>

          {/* Detailed Information */}
          <div>
            <h3 style={{ margin: '0 0 1rem 0', color: '#374151' }}>
              📊 Detailed Information
            </h3>
            
            {agent.id === 1 && renderProfileAgentDetails(activity.fullDetails)}
            {agent.id === 2 && renderMatchAgentDetails(activity.fullDetails)}
            {agent.id === 3 && renderScheduleAgentDetails(activity.fullDetails)}
            {agent.id === 4 && renderReviewerAgentDetails(activity.fullDetails)}
          </div>
        </div>
      </div>
    );
  };

  const renderProfileAgentDetails = (details) => {
    // Safety check for details
    if (!details || typeof details !== 'object') {
      return (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>
          <div>❌ No profile data available</div>
        </div>
      );
    }
    
    // Helper function to safely render values
    const safeRenderValue = (value) => {
      if (value === null || value === undefined) return 'Unknown';
      if (typeof value === 'string') return value;
      if (typeof value === 'number') return value.toString();
      if (typeof value === 'boolean') return value ? 'Yes' : 'No';
      if (Array.isArray(value)) return value.join(', ');
      if (typeof value === 'object') {
        try {
          return JSON.stringify(value, null, 2);
        } catch (e) {
          return '[Complex Object]';
        }
      }
      return String(value);
    };
    
    const safeDetails = {
      childName: safeRenderValue(details.childName),
      age: safeRenderValue(details.age),
      learningStyle: safeRenderValue(details.learningStyle),
      planType: safeRenderValue(details.planType),
      interests: Array.isArray(details.interests) ? details.interests : [],
      goals: Array.isArray(details.goals) ? details.goals : [],
      createdAt: details.createdAt || null,
      updatedAt: details.updatedAt || null
    };
    
    return (
      <div style={{ display: 'grid', gap: '1rem' }}>
        <div style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#374151' }}>👤 Profile Analysis</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
            <div><strong>Name:</strong> {safeDetails.childName}</div>
            <div><strong>Age:</strong> {safeDetails.age}</div>
            <div><strong>Learning Style:</strong> {safeDetails.learningStyle}</div>
            <div><strong>Plan Type:</strong> {safeDetails.planType}</div>
          </div>
        </div>
        
        <div style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#374151' }}>🎯 Interests ({safeDetails.interests.length})</h4>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {safeDetails.interests.length > 0 ? (
              safeDetails.interests.map((interest, index) => (
                <span key={index} style={{
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem'
                }}>
                  {safeRenderValue(interest)}
                </span>
              ))
            ) : (
              <span style={{ color: '#6b7280', fontStyle: 'italic' }}>No interests specified</span>
            )}
          </div>
        </div>
        
        {safeDetails.goals.length > 0 && (
          <div style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#374151' }}>🎯 Goals ({safeDetails.goals.length})</h4>
            <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
              {safeDetails.goals.map((goal, index) => (
                <li key={index} style={{ marginBottom: '0.25rem', color: '#374151' }}>
                  {safeRenderValue(goal)}
                </li>
              ))}
            </ul>
          </div>
        )}
        
        <div style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#374151' }}>⏰ Timeline</h4>
          <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
            <div><strong>Created:</strong> {formatTimestamp(safeDetails.createdAt)}</div>
            <div><strong>Last Updated:</strong> {formatTimestamp(safeDetails.updatedAt)}</div>
          </div>
        </div>
      </div>
    );
  };

  const renderMatchAgentDetails = (details) => {
    // Safety check for details
    if (!details || typeof details !== 'object') {
      return (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>
          <div>❌ No matching data available</div>
        </div>
      );
    }
    
    console.log('🔍 renderMatchAgentDetails received details:', details);
    console.log('🔍 matchedTopics count:', details.matchedTopics?.length);
    console.log('🔍 matchedTopics data:', details.matchedTopics);
    
    // Helper function to safely render values
    const safeRenderValue = (value) => {
      if (value === null || value === undefined) return 'Unknown';
      if (typeof value === 'string') return value;
      if (typeof value === 'number') return value.toString();
      if (typeof value === 'boolean') return value ? 'Yes' : 'No';
      if (Array.isArray(value)) return value.join(', ');
      if (typeof value === 'object') {
        try {
          return JSON.stringify(value, null, 2);
        } catch (e) {
          return '[Complex Object]';
        }
      }
      return String(value);
    };
    
    const safeDetails = {
      totalTopics: details.totalTopics || 0,
      niches: Array.isArray(details.niches) ? details.niches : [],
      matchedTopics: Array.isArray(details.matchedTopics) ? details.matchedTopics : [],
      matchCriteria: details.matchCriteria && typeof details.matchCriteria === 'object' ? {
        age: safeRenderValue(details.matchCriteria.age),
        learningStyle: safeRenderValue(details.matchCriteria.learningStyle),
        interests: Array.isArray(details.matchCriteria.interests) ? details.matchCriteria.interests : []
      } : { age: 'Unknown', learningStyle: 'Unknown', interests: [] }
    };
    
    return (
      <div style={{ display: 'grid', gap: '1rem' }}>
        <div style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#374151' }}>🔗 Matching Results</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
            <div><strong>Total Topics:</strong> {safeDetails.totalTopics}</div>
            <div><strong>Niches Found:</strong> {safeDetails.niches.length}</div>
          </div>
        </div>
        
        {safeDetails.niches.length > 0 && (
          <div style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#374151' }}>🌐 Niches Available</h4>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
              {safeDetails.niches.map((niche, index) => (
                <span key={index} style={{
                  backgroundColor: '#10b981',
                  color: 'white',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem'
                }}>
                  {safeRenderValue(niche)}
                </span>
              ))}
            </div>
          </div>
        )}
        
        <div style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#374151' }}>🎯 Matching Criteria</h4>
          <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
            <div><strong>Age:</strong> {safeDetails.matchCriteria.age}</div>
            <div><strong>Learning Style:</strong> {safeDetails.matchCriteria.learningStyle}</div>
            <div><strong>Interests:</strong> {safeDetails.matchCriteria.interests.length > 0 ? safeDetails.matchCriteria.interests.map(interest => safeRenderValue(interest)).join(', ') : 'None specified'}</div>
          </div>
        </div>
        
        {safeDetails.matchedTopics.length > 0 && (
          <div style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#374151' }}>📚 All Matched Topics ({safeDetails.matchedTopics.length})</h4>
            <div style={{ maxHeight: '400px', overflow: 'auto' }}>
              {safeDetails.matchedTopics.map((topic, index) => (
                <div key={index} style={{ 
                  padding: '0.5rem', 
                  backgroundColor: 'white', 
                  borderRadius: '4px',
                  marginBottom: '0.5rem',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{ fontWeight: '600', color: '#374151' }}>
                    {index + 1}. {safeRenderValue(topic.Topic || topic.topic || 'Unknown Topic')}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>
                    Niche: {safeRenderValue(topic.Niche || topic.niche || 'Unknown')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderScheduleAgentDetails = (details) => {
    // Safety check for details
    if (!details || typeof details !== 'object') {
      return (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>
          <div>❌ No schedule data available</div>
        </div>
        );
    }
    
    // Helper function to safely render values
    const safeRenderValue = (value) => {
      if (value === null || value === undefined) return 'Unknown';
      if (typeof value === 'string') return value;
      if (typeof value === 'number') return value.toString();
      if (typeof value === 'boolean') return value ? 'Yes' : 'No';
      if (Array.isArray(value)) return value.join(', ');
      if (typeof value === 'object') {
        try {
          return JSON.stringify(value, null, 2);
        } catch (e) {
          return '[Complex Object]';
        }
      }
      return String(value);
    };
    
    // Extract data from unified format
    const metadata = details.metadata || {};
    const weeklyStructure = details.weeklyStructure || {};
    const weeklyPlans = details.weeklyPlans || {};
    const learningObjectives = details.learningObjectives?.primary || [];
    const summary = details.summary || {};
    
    // Check if we have actual weekly data
    const hasWeeklyData = Object.keys(weeklyPlans).length > 0;
    
    return (
      <div style={{ display: 'grid', gap: '1.5rem' }}>
        {/* Schedule Summary Card */}
        <div style={{ 
          backgroundColor: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
          background: 'linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%)',
          padding: '1.5rem', 
          borderRadius: '12px',
          color: 'white',
          boxShadow: '0 4px 6px rgba(139, 92, 246, 0.25)'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            📅 Schedule Agent Summary
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>{weeklyStructure.totalWeeks || 0}</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Weeks Planned</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>{weeklyStructure.planType || 'Standard'}</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Plan Type</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>
                {hasWeeklyData ? '✅' : '⏳'}
              </div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                {hasWeeklyData ? 'Active' : 'Pending'}
              </div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>{summary.totalActivities || 0}</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Total Activities</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', marginBottom: '0.25rem' }}>{summary.estimatedDuration || '0m'}</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Total Duration</div>
            </div>
          </div>
        </div>

        {/* Learning Objectives */}
        {learningObjectives.length > 0 && (
          <div style={{ backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ margin: '0 0 1rem 0', color: '#1e293b', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              🎯 Learning Objectives ({learningObjectives.length})
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '0.75rem' }}>
              {learningObjectives.map((objective, index) => (
                <div key={index} style={{ 
                  backgroundColor: 'white', 
                  padding: '0.75rem', 
                  borderRadius: '8px', 
                  border: '1px solid #e2e8f0',
                  fontSize: '0.9rem',
                  color: '#475569'
                }}>
                  {safeRenderValue(objective)}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Weekly Plan Breakdown */}
        {hasWeeklyData ? (
          <div style={{ backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ margin: '0 0 1rem 0', color: '#1e293b', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              📋 Weekly Learning Plan
            </h4>
            <div style={{ display: 'grid', gap: '1rem' }}>
              {Object.entries(weeklyPlans).map(([weekKey, weekData]) => {
                if (!weekData || typeof weekData !== 'object') return null;
                
                return (
                  <div key={weekKey} style={{ 
                    backgroundColor: 'white', 
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    overflow: 'hidden'
                  }}>
                    {/* Week Header */}
                    <div style={{ 
                      backgroundColor: '#8b5cf6', 
                      color: 'white', 
                      padding: '1rem',
                      fontWeight: '600',
                      fontSize: '1.1rem'
                    }}>
                      {weekData.weekTitle || weekKey}
                    </div>
                    
                    {/* Week Content */}
                    <div style={{ padding: '1rem' }}>
                      {/* Week Theme/Goal */}
                      {(weekData.theme || weekData.goal) && (
                        <div style={{ marginBottom: '1rem', padding: '0.75rem', backgroundColor: '#f1f5f9', borderRadius: '8px' }}>
                          {weekData.theme && (
                            <div style={{ marginBottom: '0.5rem' }}>
                              <strong style={{ color: '#475569' }}>🎨 Theme:</strong> {safeRenderValue(weekData.theme)}
                            </div>
                          )}
                          {weekData.goal && (
                            <div>
                              <strong style={{ color: '#475569' }}>🎯 Goal:</strong> {safeRenderValue(weekData.goal)}
                            </div>
                          )}
                          {weekData.focus && (
                            <div>
                              <strong style={{ color: '#475569' }}>🎯 Focus:</strong> {safeRenderValue(weekData.focus)}
                            </div>
                          )}
                        </div>
                      )}
                      
                      {/* Daily Activities */}
                      {weekData.days && Object.keys(weekData.days).length > 0 && (
                        <div>
                          <h5 style={{ margin: '0 0 0.75rem 0', color: '#475569', fontSize: '1rem' }}>
                            📅 Daily Activities
                          </h5>
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                            {Object.entries(weekData.days).map(([dayKey, dayData]) => {
                              if (!dayData || typeof dayData !== 'object') return null;
                              
                              return (
                                <div key={dayKey} style={{ 
                                  padding: '0.75rem', 
                                  backgroundColor: '#f8fafc', 
                                  borderRadius: '8px',
                                  border: '1px solid #e2e8f0'
                                }}>
                                  <div style={{ fontWeight: '600', color: '#475569', marginBottom: '0.5rem', textTransform: 'capitalize' }}>
                                    {dayData.dayName || dayKey}
                                  </div>
                                  {dayData.topic && (
                                    <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.25rem' }}>
                                      <strong>Topic:</strong> {safeRenderValue(dayData.topic)}
                                    </div>
                                  )}
                                  {dayData.objective && (
                                    <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.25rem' }}>
                                      <strong>Objective:</strong> {safeRenderValue(dayData.objective)}
                                    </div>
                                  )}
                                  {dayData.estimatedTime && (
                                    <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '0.25rem' }}>
                                      <strong>Duration:</strong> {safeRenderValue(dayData.estimatedTime)}
                                    </div>
                                  )}
                                  {dayData.activities && dayData.activities.length > 0 && (
                                    <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                                      <strong>Activities:</strong> {safeRenderValue(dayData.activities)}
                                    </div>
                                  )}
                                </div>
                              );
                            }).filter(Boolean)}
                          </div>
                        </div>
                      )}
                      
                      {/* Week Objectives */}
                      {weekData.objectives && weekData.objectives.length > 0 && (
                        <div style={{ marginTop: '1rem', padding: '0.75rem', backgroundColor: '#f1f5f9', borderRadius: '8px' }}>
                          <h6 style={{ margin: '0 0 0.5rem 0', color: '#475569', fontSize: '0.9rem' }}>
                            🎯 Week Objectives
                          </h6>
                          <ul style={{ margin: 0, paddingLeft: '1.5rem', fontSize: '0.9rem', color: '#64748b' }}>
                            {weekData.objectives.map((objective, idx) => (
                              <li key={idx}>{safeRenderValue(objective)}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {/* Fallback: Show raw week data if no structured activities */}
                      {(!weekData.days || Object.keys(weekData.days).length === 0) && (
                        <div style={{ fontSize: '0.9rem', color: '#64748b', fontStyle: 'italic' }}>
                          <div>📝 Week data available but no daily activities structured</div>
                          <details style={{ marginTop: '0.5rem' }}>
                            <summary style={{ cursor: 'pointer', color: '#8b5cf6' }}>View raw week data</summary>
                            <pre style={{ 
                              marginTop: '0.5rem', 
                              padding: '0.5rem', 
                              backgroundColor: '#f1f5f9', 
                              borderRadius: '4px',
                              fontSize: '0.8rem',
                              overflow: 'auto'
                            }}>
                              {JSON.stringify(weekData, null, 2)}
                            </pre>
                          </details>
                        </div>
                      )}
                    </div>
                  </div>
                );
              }).filter(Boolean)}
            </div>
          </div>
        ) : (
          /* No Weekly Data Available */
          <div style={{ 
            backgroundColor: '#fef3c7', 
            padding: '2rem', 
            borderRadius: '12px', 
            border: '1px solid #f59e0b',
            textAlign: 'center',
            color: '#92400e'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#92400e' }}>No Weekly Plan Available</h4>
            <p style={{ margin: 0, fontSize: '0.9rem', opacity: 0.8 }}>
              The Schedule Agent hasn't created a weekly learning plan yet. 
              This usually happens after the Match Agent finds suitable topics.
            </p>
          </div>
        )}

        {/* Plan Structure (if available) */}
        {weeklyStructure && Object.keys(weeklyStructure).length > 0 && (
          <div style={{ backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ margin: '0 0 1rem 0', color: '#1e293b', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              🏗️ Plan Structure
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
              {Object.entries(weeklyStructure).map(([key, value]) => (
                <div key={key} style={{ 
                  backgroundColor: 'white', 
                  padding: '0.75rem', 
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{ fontWeight: '600', color: '#475569', marginBottom: '0.25rem' }}>
                    {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                  </div>
                  <div style={{ fontSize: '0.9rem', color: '#64748b' }}>
                    {safeRenderValue(value)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Matched Topics (if available) */}
        {details.matchedTopics && details.matchedTopics.length > 0 && (
          <div style={{ backgroundColor: '#f8fafc', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
            <h4 style={{ margin: '0 0 1rem 0', color: '#1e293b', fontSize: '1.1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              🔗 Matched Topics ({details.matchedTopics.length})
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '0.75rem' }}>
              {details.matchedTopics.map((topic, index) => (
                <div key={topic.id || index} style={{ 
                  backgroundColor: 'white', 
                  padding: '0.75rem', 
                  borderRadius: '8px', 
                  border: '1px solid #e2e8f0',
                  fontSize: '0.9rem'
                }}>
                  <div style={{ fontWeight: '600', color: '#475569', marginBottom: '0.5rem' }}>
                    {topic.name}
                  </div>
                  <div style={{ color: '#64748b', marginBottom: '0.25rem' }}>
                    <strong>Niche:</strong> {topic.niche}
                  </div>
                  <div style={{ color: '#64748b', marginBottom: '0.25rem' }}>
                    <strong>Objective:</strong> {topic.objective}
                  </div>
                  <div style={{ color: '#64748b' }}>
                    <strong>Duration:</strong> {topic.estimatedTime}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderReviewerAgentDetails = (details) => {
    // Safety check for details
    if (!details || typeof details !== 'object') {
      return (
        <div style={{ padding: '2rem', textAlign: 'center', color: '#ef4444' }}>
          <div>❌ No review data available</div>
        </div>
      );
    }
    
    const safeDetails = {
      learningObjectives: Array.isArray(details.learningObjectives) ? details.learningObjectives : [],
      recommendations: Array.isArray(details.recommendations) ? details.recommendations : [],
      progressTracking: details.progressTracking && typeof details.progressTracking === 'object' ? details.progressTracking : {},
      reviewInsights: details.reviewInsights && typeof details.reviewInsights === 'object' ? details.reviewInsights : {}
    };
    
    // Helper function to safely render values
    const safeRenderValue = (value) => {
      if (value === null || value === undefined) return 'N/A';
      if (typeof value === 'string') return value;
      if (typeof value === 'number') return value.toString();
      if (typeof value === 'boolean') return value ? 'Yes' : 'No';
      if (Array.isArray(value)) return value.join(', ');
      if (typeof value === 'object') {
        try {
          return JSON.stringify(value, null, 2);
        } catch (e) {
          return '[Complex Object]';
        }
      }
      return String(value);
    };
    
    return (
      <div style={{ display: 'grid', gap: '1rem' }}>
        <div style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '8px' }}>
          <h4 style={{ margin: '0 0 0.5rem 0', color: '#374151' }}>📝 Review Summary</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
            <div><strong>Learning Objectives:</strong> {safeDetails.learningObjectives.length}</div>
            <div><strong>Recommendations:</strong> {safeDetails.recommendations.length}</div>
          </div>
        </div>
        
        {safeDetails.learningObjectives.length > 0 && (
          <div style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#374151' }}>🎯 Learning Objectives</h4>
            <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
              {safeDetails.learningObjectives.slice(0, 5).map((objective, index) => (
                <li key={index} style={{ marginBottom: '0.25rem', color: '#374151' }}>
                  {safeRenderValue(objective)}
                </li>
              ))}
            </ul>
            {safeDetails.learningObjectives.length > 5 && (
              <div style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.8rem', fontStyle: 'italic', marginTop: '0.5rem' }}>
                ... and {safeDetails.learningObjectives.length - 5} more objectives
              </div>
            )}
          </div>
        )}
        
        {safeDetails.recommendations.length > 0 && (
          <div style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#374151' }}>💡 Recommendations</h4>
            <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
              {safeDetails.recommendations.slice(0, 5).map((rec, index) => (
                <li key={index} style={{ marginBottom: '0.25rem', color: '#374151' }}>
                  {safeRenderValue(rec)}
                </li>
              ))}
            </ul>
            {safeDetails.recommendations.length > 5 && (
              <div style={{ textAlign: 'center', color: '#6b7280', fontSize: '0.8rem', fontStyle: 'italic', marginTop: '0.5rem' }}>
                ... and {safeDetails.recommendations.length - 5} more recommendations
              </div>
            )}
          </div>
        )}
        
        {safeDetails.progressTracking && Object.keys(safeDetails.progressTracking).length > 0 && (
          <div style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#374151' }}>📊 Progress Tracking</h4>
            <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
              {Object.entries(safeDetails.progressTracking).map(([key, value]) => (
                <div key={key} style={{ marginBottom: '0.5rem' }}>
                  <strong>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</strong> {safeRenderValue(value)}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {safeDetails.reviewInsights && Object.keys(safeDetails.reviewInsights).length > 0 && (
          <div style={{ backgroundColor: '#f9fafb', padding: '1rem', borderRadius: '8px' }}>
            <h4 style={{ margin: '0 0 0.5rem 0', color: '#374151' }}>🔍 Review Insights</h4>
            <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
              {Object.entries(safeDetails.reviewInsights).map(([key, value]) => (
                <div key={key} style={{ marginBottom: '0.5rem' }}>
                  <strong>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</strong> {safeRenderValue(value)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>⏳</div>
        <div>Loading real children and agent data...</div>
        <div style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#6b7280' }}>
          User: {user ? `${user.email} (${user.uid})` : 'Not authenticated'}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem', color: '#ef4444' }}>❌</div>
        <div style={{ color: '#ef4444', fontSize: '1.1rem', marginBottom: '1rem' }}>
          Error loading data: {error}
        </div>
        <div style={{ 
          color: '#6b7280', 
          fontSize: '0.9rem', 
          marginBottom: '1.5rem',
          maxWidth: '500px',
          margin: '0 auto 1.5rem auto'
        }}>
          This could be due to:
          <ul style={{ textAlign: 'left', display: 'inline-block', margin: '0.5rem 0' }}>
            <li>Network connectivity issues</li>
            <li>Firebase authentication problems</li>
            <li>Database access permissions</li>
            <li>Data structure inconsistencies</li>
          </ul>
        </div>
        <button 
          onClick={loadRealChildrenData}
          style={{
            marginTop: '1rem',
            padding: '0.75rem 1.5rem',
            backgroundColor: '#3b82f6',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '1rem',
            fontWeight: '500'
          }}
        >
          🔄 Retry Loading Data
        </button>
        <div style={{ 
          marginTop: '1rem', 
          fontSize: '0.8rem', 
          color: '#9ca3af' 
        }}>
          If the problem persists, check your internet connection and try refreshing the page.
        </div>
      </div>
    );
  }

  if (children.length === 0) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>👶</div>
        <div style={{ marginBottom: '1rem' }}>No children found</div>
        <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>
          Create a child profile first to see agent activities
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto' }}>
      {/* Debug Info */}
      <div style={{ 
        backgroundColor: '#f3f4f6', 
        padding: '1rem', 
        borderRadius: '8px', 
        marginBottom: '2rem',
        fontSize: '0.9rem',
        color: '#6b7280'
      }}>
        <strong>Debug Info:</strong> User: {user ? `${user.email} (${user.uid})` : 'Not authenticated'} | 
        Children: {children.length} | Loading: {loading.toString()} | Error: {error || 'None'}
      </div>
      
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '2.5rem', color: '#1f2937', marginBottom: '0.5rem' }}>
          🎯 4 AGENTS DASHBOARD
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#6b7280' }}>
          Real-time agent activities for each child
        </p>
        <div style={{ 
          marginTop: '1rem', 
          padding: '0.5rem 1rem', 
          backgroundColor: '#10b981', 
          color: 'white', 
          borderRadius: '20px',
          fontSize: '0.9rem',
          display: 'inline-block'
        }}>
          📊 {children.length} children • {agents.length} agents • Connected to real data
        </div>
        <div style={{ 
          marginTop: '0.5rem', 
          padding: '0.5rem 1rem', 
          backgroundColor: '#3b82f6', 
          color: 'white', 
          borderRadius: '20px',
          fontSize: '0.8rem',
          display: 'inline-block'
        }}>
          💡 Click on any agent to see detailed information
        </div>
      </div>

      {/* Children Cards */}
      <div style={{ display: 'grid', gap: '2rem' }}>
        {children.map((child) => (
          <div key={child.id} style={{
            border: '2px solid #e5e7eb',
            borderRadius: '12px',
            padding: '1.5rem',
            backgroundColor: '#f9fafb'
          }}>
            {/* Child Header */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              marginBottom: '1.5rem',
              paddingBottom: '1rem',
              borderBottom: '2px solid #e5e7eb'
            }}>
              <div style={{
                width: '60px',
                height: '60px',
                borderRadius: '50%',
                backgroundColor: '#8b5cf6',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                color: 'white',
                marginRight: '1rem'
              }}>
                👶
              </div>
              <div style={{ flex: 1 }}>
                <h2 style={{ fontSize: '1.8rem', margin: '0 0 0.5rem 0', color: '#1f2937' }}>
                  {child.name}
                </h2>
                <div style={{ color: '#6b7280', marginBottom: '0.5rem' }}>
                  Age: {child.age} • Learning Style: {child.learningStyle} • Plan Type: {child.planType}
                </div>
                <div style={{ color: '#6b7280', fontSize: '0.9rem' }}>
                  Interests: {Array.isArray(child.interests) && child.interests.length > 0 ? child.interests.join(', ') : 'None specified'}
                </div>
                {Array.isArray(child.goals) && child.goals.length > 0 && (
                  <div style={{ color: '#6b7280', fontSize: '0.9rem', marginTop: '0.25rem' }}>
                    Goals: {child.goals.join(', ')}
                  </div>
                )}
              </div>
              <div style={{ textAlign: 'right', fontSize: '0.8rem', color: '#6b7280' }}>
                <div>Created: {formatTimestamp(child.createdAt)}</div>
                <div>Updated: {formatTimestamp(child.updatedAt)}</div>
                <div>Plans: {child.plans && typeof child.plans === 'object' ? Object.keys(child.plans).length : 0}</div>
              </div>
            </div>

            {/* 4 Agents Grid */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
              gap: '1rem'
            }}>
              {agents.map((agent) => {
                const activity = child.agentActivities && child.agentActivities[agent.id] ? child.agentActivities[agent.id] : {
                  status: 'Unknown',
                  lastAction: 'No data available',
                  timestamp: 'Unknown',
                  details: {},
                  fullDetails: {}
                };
                return (
                  <div 
                    key={agent.id} 
                    onClick={() => handleAgentClick(agent, child, activity)}
                    style={{
                      border: `2px solid ${agent.color}`,
                      borderRadius: '8px',
                      padding: '1rem',
                      backgroundColor: 'white',
                      position: 'relative',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      ':hover': {
                        transform: 'translateY(-2px)',
                        boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)'
                      }
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    {/* Click Indicator */}
                    <div style={{
                      position: 'absolute',
                      top: '0.5rem',
                      right: '0.5rem',
                      fontSize: '0.7rem',
                      color: agent.color,
                      fontWeight: '600'
                    }}>
                      👆 Click
                    </div>

                    {/* Agent Header */}
                    <div style={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      marginBottom: '0.75rem'
                    }}>
                      <div style={{
                        width: '40px',
                        height: '40px',
                        borderRadius: '50%',
                        backgroundColor: agent.color,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.2rem',
                        color: 'white',
                        marginRight: '0.75rem'
                      }}>
                        {agent.icon}
                      </div>
                      <div>
                        <h3 style={{ 
                          fontSize: '1.1rem', 
                          margin: '0', 
                          color: '#1f2937',
                          fontWeight: '600'
                        }}>
                          {agent.name}
                        </h3>
                      </div>
                    </div>

                    {/* Agent Status */}
                    <div style={{ marginBottom: '0.75rem' }}>
                      <span style={{
                        backgroundColor: activity.status === 'Active' ? '#10b981' : 
                                       activity.status === 'Waiting' ? '#f59e0b' : '#ef4444',
                        color: 'white',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '500'
                      }}>
                        {activity.status}
                      </span>
                    </div>

                    {/* Last Action */}
                    <div style={{ marginBottom: '0.5rem' }}>
                      <div style={{ 
                        fontSize: '0.9rem', 
                        color: '#374151',
                        fontWeight: '500'
                      }}>
                        Last Action:
                      </div>
                      <div style={{ 
                        fontSize: '0.85rem', 
                        color: '#6b7280',
                        lineHeight: '1.4'
                      }}>
                        {activity.lastAction}
                      </div>
                    </div>

                    {/* Agent Details */}
                    {activity.details && Object.keys(activity.details).length > 0 && (
                      <div style={{ marginBottom: '0.5rem' }}>
                        <div style={{ 
                          fontSize: '0.8rem', 
                          color: '#6b7280',
                          lineHeight: '1.3'
                        }}>
                          {Object.entries(activity.details).map(([key, value]) => (
                            <div key={key} style={{ marginBottom: '0.25rem' }}>
                              <strong>{key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}:</strong> {value}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Timestamp */}
                    <div style={{ 
                      fontSize: '0.75rem', 
                      color: '#9ca3af',
                      fontStyle: 'italic'
                    }}>
                      {activity.timestamp}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Summary Footer */}
      <div style={{ 
        marginTop: '3rem', 
        padding: '1.5rem', 
        backgroundColor: '#f3f4f6', 
        borderRadius: '8px',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '1.1rem', color: '#374151', marginBottom: '0.5rem' }}>
          📊 <strong>Real Data Summary:</strong> {children.length} children • {agents.length} agents • Live from Firestore
        </div>
        <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
          Each agent shows real activity based on your child profiles and generated plans
        </div>
      </div>

      {/* Agent Details Modal */}
      {showAgentModal && renderAgentDetails()}
    </div>
  );
};

export default UnifiedDashboard; 