import React, { useState, useEffect } from 'react';
import { db, auth } from '../firebase';
import { doc, getDoc } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';
import { useLocation, useNavigate } from 'react-router-dom';
import BackButton from './BackButton';

import comprehensiveLoggingService from '../services/comprehensiveLoggingService';
import config from '../config/config';
import { createUnifiedWeeklyPlan, formatPlanForDisplay } from '../utils/unifiedPlanFormat';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('❌ Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ 
          padding: '20px', 
          background: '#fff3cd', 
          border: '1px solid #ffeaa7', 
          borderRadius: '8px',
          margin: '10px 0'
        }}>
          <h3>⚠️ Something went wrong with this section</h3>
          <p>Please try refreshing the page or contact support if the issue persists.</p>
          <button 
            onClick={() => this.setState({ hasError: false, error: null })}
            style={{
              background: '#007bff',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Try Again
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

const CustomisedWeeklyPlan = () => {
  // Use real authentication instead of mock user
  const [user, authLoading, authError] = useAuthState(auth);
  
  // Load real data from Firebase
  const [plans, setPlans] = useState({});
  const [selectedMonth, setSelectedMonth] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [expandedDayRow, setExpandedDayRow] = useState({}); // { [weekKey]: dayKey }
  const [childName, setChildName] = useState('');
  const [topicsData, setTopicsData] = useState([]);
  const [generatingPlan, setGeneratingPlan] = useState(false);
  const [showDbInfo, setShowDbInfo] = useState(false);
  const [dbData, setDbData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (user && location.state?.data) {
      console.log('🔍 DEBUG - Location state data:', location.state.data);
      console.log('🔍 DEBUG - Location state keys:', Object.keys(location.state.data));
      console.log('🔍 DEBUG - Location state matched_topics:', location.state.data.matched_topics);
      console.log('🔍 DEBUG - Location state data type:', typeof location.state.data);
      console.log('🔍 DEBUG - Location state data.data:', location.state.data.data);
      console.log('🔍 DEBUG - Location state data.data?.matched_topics:', location.state.data.data?.matched_topics);
      
      // Create unified plan format
      const childProfile = {
        child_name: location.state.childName || '',
        child_age: 5, // Default age if not available
        interests: location.state.data.interests || [],
        learning_style: 'mixed',
        plan_type: 'hybrid'
      };
      
      const unifiedPlan = createUnifiedWeeklyPlan(location.state.data, childProfile);
      const formattedPlan = formatPlanForDisplay(unifiedPlan);
    } else if (user && location.state?.matched_topics) {
      // NEW: Handle direct backend response structure (after ProfileForm fix)
      console.log('✅ NEW: Direct backend response structure detected');
      console.log('🔍 DEBUG - Direct matched_topics:', location.state.matched_topics);
      console.log('🔍 DEBUG - Direct matched_topics length:', location.state.matched_topics?.length);
      console.log('🔍 DEBUG - Direct location state keys:', Object.keys(location.state));
      
      // Create unified plan format from direct backend response
      const childProfile = {
        child_name: location.state.childName || '',
        child_age: 5, // Default age if not available
        interests: location.state.interests || [],
        learning_style: 'mixed',
        plan_type: 'hybrid'
      };
      
      const unifiedPlan = createUnifiedWeeklyPlan(location.state, childProfile);
      const formattedPlan = formatPlanForDisplay(unifiedPlan);
      
      console.log('🔄 NEW PROFILE DATA RECEIVED - REFRESHING PLAN DISPLAY');
      console.log('📊 Unified Plan:', unifiedPlan);
      console.log('🎨 Formatted Plan:', formattedPlan);
      
      const monthName = location.state.month || new Date().toLocaleString('default', { month: 'long' }) + ' ' + new Date().getFullYear();
      setPlans({ [monthName]: formattedPlan });
      setSelectedMonth(monthName);
      setChildName(location.state.childName || '');
      setLoading(false);
      
      // Track agent activity for plan generation
      const planData = {
        child_name: location.state.childName || '',
        plan_data: formattedPlan,
        month: monthName,
        user_id: user.uid
      };
      
      console.log('🤖 Plan Generation Agent Activity Tracked');
      
      // Log weekly plan page access
      comprehensiveLoggingService.logUserJourneyStep(user.uid, 'weekly_plan_page_accessed', 'User accessed customized weekly plan page', {
        childName: location.state.childName || '',
        planData: location.state,
        pageType: 'customized_weekly_plan'
      });
      
      // Force re-render when new data is received
      console.log('🔄 NEW PROFILE DATA RECEIVED - REFRESHING PLAN DISPLAY');
    } else if (user) {
      loadPlansFromFirebase();
    }
  }, [user, location.state]);

  // Load topics data when component mounts
  useEffect(() => {
    if (user) {
      loadTopicsData();
    }
  }, [user]);
  
  // Remove mock data loading - will load real data from Firebase
  // useEffect(() => {
  //   if (user) {
      console.log('📊 Loading real plans data from Firebase');
  //     // setChildName('Rahul'); // This line is removed as per the new_code
  //     // setLoading(false); // This line is removed as per the new_code
  //   }
  // }, [user]);

  // Load topics data from API
  // Generate a new plan using the backend API
  const generateNewPlan = async (childData) => {
    try {
      setGeneratingPlan(true);
      setError('');
      console.log('🚀 Generating new plan for child:', childData);
      
      // Create profile data from child data
      const profileData = {
        child_name: childData.name || childData.child_name || 'Child',
        child_age: childData.age || childData.child_age || 5,
        interests: childData.interests || [],
        preferred_learning_style: childData.learning_style || 'mixed',
        goals: childData.goals || [],
        plan_type: childData.plan_type || 'hybrid'
      };
      
      console.log('📤 Profile data for plan generation:', profileData);
      
      // Call the backend API to generate plan
      const response = await fetch('https://unschooling-backend-790275794964.us-central1.run.app/api/generate-plan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-API-Key': 'unschooling-api-key-2024',
          'Accept': 'application/json',
        },
        body: JSON.stringify({ 
          profile: profileData
        }),
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('✅ Plan generated successfully:', result);
        
        if (result.success && result.data) {
          // Save the generated plan to Firebase
          const currentMonth = new Date().toLocaleString('default', { month: 'long' }) + ' ' + new Date().getFullYear();
          const newPlans = {
            ...plans,
            [currentMonth]: result.data
          };
          
          // Update Firebase
          const { doc, updateDoc } = await import('firebase/firestore');
          const childRef = doc(db, `users/${user.uid}/children`, childName);
          await updateDoc(childRef, {
            plans: newPlans
          });
          
          // Update local state
          setPlans(newPlans);
          setSelectedMonth(currentMonth);
          
          console.log('✅ Plan saved to Firebase and local state updated');
        } else {
          console.error('❌ Plan generation failed:', result);
          setError('Failed to generate plan. Please try again.');
        }
      } else {
        console.error('❌ Backend API error:', response.status, response.statusText);
        setError('Failed to connect to plan generation service.');
      }
    } catch (error) {
      console.error('❌ Error generating plan:', error);
      setError('Failed to generate plan: ' + error.message);
    } finally {
      setGeneratingPlan(false);
    }
  };

  const loadTopicsData = async () => {
    try {
      console.log('🔍 Loading topics data from:', `${config.API_BASE_URL}/api/topics`);
      const response = await fetch(`${config.API_BASE_URL}/api/topics`);
      console.log('🔍 Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        // Extract the topics array from the response
        const topicsArray = data.topics || data;
        setTopicsData(topicsArray);
        console.log('✅ Topics data loaded:', topicsArray.length, 'topics');
        console.log('🔍 Sample topics:', topicsArray.slice(0, 3).map(t => ({ Topic: t.Topic, Niche: t.Niche })));
      } else {
        console.error('❌ Failed to load topics data, status:', response.status);
      }
    } catch (error) {
      console.error('❌ Error loading topics data:', error);
    }
  };

  // Find similar topics for suggestions
  const findSimilarTopics = (topicName) => {
    if (!topicsData || !Array.isArray(topicsData) || topicsData.length === 0) return [];
    
    const cleanTopicName = topicName?.trim().toLowerCase();
    if (!cleanTopicName) return [];
    
    // Filter valid topics
    const validTopics = topicsData.filter(t => 
      t && t.Topic && 
      t.Topic.trim() !== '' && 
      t.Niche && 
      t.Niche.trim() !== ''
    );
    
    // Find topics that contain any word from the search term
    const searchWords = cleanTopicName.split(/\s+/);
    const similarTopics = validTopics.filter(t => {
      const topicWords = t.Topic.toLowerCase().split(/\s+/);
      return searchWords.some(searchWord => 
        topicWords.some(topicWord => 
          topicWord.includes(searchWord) || searchWord.includes(topicWord)
        )
      );
    });
    
    // Return top 5 similar topics
    return similarTopics.slice(0, 5);
  };

  // Find topic data by name
  const findTopicData = (topicName) => {
    console.log('🔍 Finding topic data for:', topicName);
    console.log('🔍 Available topics count:', topicsData?.length || 0);
    console.log('🔍 Topics data type:', typeof topicsData);
    console.log('🔍 Topics data:', topicsData);
    
    if (!topicsData || !Array.isArray(topicsData) || topicsData.length === 0) {
      console.log('❌ No topics data available or not an array');
      return null;
    }
    
    // Clean the topic name for better matching
    const cleanTopicName = topicName?.trim();
    if (!cleanTopicName) {
      console.log('❌ Empty topic name provided');
      return null;
    }
    
    console.log('🔍 Cleaned topic name:', cleanTopicName);
    
    // Filter out empty or invalid topics first
    const validTopics = topicsData.filter(t => {
      // Handle both standardized and original formats
      const topic = t.topic || t.Topic;
      const niche = t.niche || t.Niche;
      return t && topic && topic.trim() !== '' && niche && niche.trim() !== '';
    });
    
    console.log('🔍 Valid topics count:', validTopics.length);
    
    // Try exact match first
    let topic = validTopics.find(t => {
      const topicName = t.topic || t.Topic;
      return topicName.toLowerCase().trim() === cleanTopicName.toLowerCase();
    });
    
    if (topic) {
      console.log('✅ Exact match found:', topic.topic || topic.Topic, 'Niche:', topic.niche || topic.Niche);
      return topic;
    }
    
    // If no exact match, try partial match
    topic = validTopics.find(t => {
      const topicName = t.topic || t.Topic;
      return topicName.toLowerCase().includes(cleanTopicName.toLowerCase()) ||
        cleanTopicName.toLowerCase().includes(topicName.toLowerCase());
    });
    
    if (topic) {
      console.log('✅ Partial match found:', topic.topic || topic.Topic, 'Niche:', topic.niche || topic.Niche);
      return topic;
    }
    
    // Try fuzzy matching - remove common words and try again
    const simplifiedTopicName = cleanTopicName.toLowerCase().replace(/\b(introduction to|basics of|fundamentals of|overview of|understanding|learning)\b/g, '').trim();
    if (simplifiedTopicName && simplifiedTopicName !== cleanTopicName.toLowerCase()) {
      console.log('🔍 Trying simplified topic name:', simplifiedTopicName);
      topic = validTopics.find(t => {
        const topicName = t.topic || t.Topic;
        return topicName.toLowerCase().includes(simplifiedTopicName) ||
          simplifiedTopicName.includes(topicName.toLowerCase());
      });
      
      if (topic) {
        console.log('✅ Fuzzy match found:', topic.topic || topic.Topic, 'Niche:', topic.niche || topic.Niche);
        return topic;
      }
    }
    
    // Try word-by-word matching
    const searchWords = cleanTopicName.toLowerCase().split(/\s+/);
    topic = validTopics.find(t => {
      const topicName = t.topic || t.Topic;
      const topicWords = topicName.toLowerCase().split(/\s+/);
      return searchWords.some(searchWord => 
        topicWords.some(topicWord => 
          topicWord.includes(searchWord) || searchWord.includes(topicWord)
        )
      );
    });
    
    if (topic) {
      console.log('✅ Word-by-word match found:', topic.topic || topic.Topic, 'Niche:', topic.niche || topic.Niche);
      return topic;
    }
    
    console.log('❌ No match found for:', cleanTopicName);
    return null;
  };

  // Navigate to topic detail page
  const navigateToTopic = (topicName) => {
    console.log('🔍 Navigating to topic:', topicName);
    const topicData = findTopicData(topicName);
    console.log('🔍 Found topic data:', topicData);
    
    // Handle both standardized and original formats
    const niche = topicData?.niche || topicData?.Niche;
    const topic = topicData?.topic || topicData?.Topic;
    
    if (topicData && niche && topic) {
      const nicheSlug = niche.toLowerCase().replace(/\s+/g, '-');
      const topicSlug = topic.toLowerCase().replace(/\s+/g, '-');
      const url = `/niche/${nicheSlug}/${topicSlug}`;
      console.log('🔍 Generated URL:', url);
      console.log('🔍 Original niche:', niche);
      console.log('🔍 Original topic:', topic);
      console.log('🔍 Niche slug:', nicheSlug);
      console.log('🔍 Topic slug:', topicSlug);
      
      // Validate URL before navigation
      if (nicheSlug && topicSlug) {
        // Try React Router navigation first, fallback to window.open
        try {
          navigate(url, { 
            state: { 
              from: 'weekly-plan',
              childName: childName,
              selectedMonth: selectedMonth
            }
          });
        } catch (error) {
          console.log('❌ React Router navigation failed, using window.open');
          window.open(url, '_blank');
        }
      } else {
        console.log('❌ Invalid URL generated - missing niche or topic slug');
        console.log('🔍 Niche slug:', nicheSlug);
        console.log('🔍 Topic slug:', topicSlug);
        alert(`Unable to navigate to topic "${topicName}". Topic or niche information is missing.`);
      }
    } else {
      console.log('❌ Topic not found in database or missing data:', topicName);
      console.log('🔍 Topic data:', topicData);
      
      // Find similar topics to suggest
      const similarTopics = findSimilarTopics(topicName);
      if (similarTopics.length > 0) {
        const suggestions = similarTopics.map(t => `${t.topic || t.Topic} (${t.niche || t.Niche})`).join('\n');
        alert(`Topic "${topicName}" not found in database.\n\nSimilar topics available:\n${suggestions}\n\nPlease check if the topic name is correct.`);
      } else {
        console.log('🔍 Available topics:', topicsData.slice(0, 10).map(t => ({ Topic: t.topic || t.Topic, Niche: t.niche || t.Niche })));
        alert(`Topic "${topicName}" not found in database. Please check if the topic name is correct.`);
      }
    }
  };

  const loadPlansFromFirebase = async () => {
    try {
      setLoading(true);
      
      // If no specific child is provided, get the first child
      let childName = location.state?.childName;
      let childData;
      
      if (!childName) {
        // Get the first child from Firestore
        const { collection, getDocs, query, orderBy, limit } = await import('firebase/firestore');
        const childrenRef = collection(db, `users/${user.uid}/children`);
        const childrenQuery = query(childrenRef, orderBy('createdAt', 'asc'), limit(1));
        const childrenSnapshot = await getDocs(childrenQuery);
        
        if (!childrenSnapshot.empty) {
          childData = childrenSnapshot.docs[0].data();
          childName = childData.name || childData.child_name || 'Child';
          setChildName(childName);
        } else {
          // No children found, show error
          setError('No children found. Please create a child profile first.');
          setLoading(false);
          return;
        }
      } else {
        // Use the provided child name
        setChildName(childName);
        const childRef = doc(db, `users/${user.uid}/children`, childName);
        const childSnap = await getDoc(childRef);
        
        if (childSnap.exists()) {
          childData = childSnap.data();
        } else {
          setError(`Child profile for "${childName}" not found.`);
          setLoading(false);
          return;
        }
      }
      
              // Now we have childData, set the plans
        const existingPlans = childData.plans || {};
        setPlans(existingPlans);
        
        // Set default selected month
        const availableMonths = Object.keys(existingPlans);
        if (availableMonths.length > 0) {
          setSelectedMonth(availableMonths[0]);
        } else {
          // No plans exist, generate a new plan
          console.log('🔍 No existing plans found, generating new plan...');
          await generateNewPlan(childData);
        }
        
        // Log Firebase plan loading
        comprehensiveLoggingService.logUserJourneyStep(user.uid, 'firebase_plan_loaded', 'Weekly plan loaded from Firebase', {
          childName: childName,
          availableMonths: availableMonths,
          selectedMonth: availableMonths[0] || 'none'
        });
    } catch (err) {
      console.error('Error loading plans:', err);
      setError(err.message);
      
      // Log error
      comprehensiveLoggingService.logUserJourneyStep(user.uid, 'firebase_plan_load_error', 'Error loading plan from Firebase', {
        error: err.message,
        childName: location.state?.childName || 'unknown'
      });
    } finally {
      setLoading(false);
    }
  };

  // Clean month names to remove "current" or similar text
  const cleanMonthName = (monthName) => {
    if (!monthName) return '';
    return monthName
      .replace(/current/i, '')
      .replace(/^[\s\-_]+/, '')
      .replace(/[\s\-_]+$/, '')
      .trim();
  };

  const cleanSelectedMonth = cleanMonthName(selectedMonth);
  const planData = plans && cleanSelectedMonth ? plans[cleanSelectedMonth] : null;
  const months = plans ? Object.keys(plans).map(cleanMonthName).filter(Boolean) : [];
  const childMonths = location.state?.childMonths || months;

  // Helper function to get plan data with backward compatibility
  const getPlanData = (planData) => {
    if (!planData) return null;
    
    console.log('🔍 DEBUG - Raw plan data:', planData);
    console.log('🔍 DEBUG - Plan data keys:', Object.keys(planData));
    console.log('🔍 DEBUG - Matched topics:', planData.matched_topics);
    console.log('🔍 DEBUG - Profile analysis:', planData.profile_analysis);
    console.log('🔍 DEBUG - Type of matched_topics:', typeof planData.matched_topics);
    console.log('🔍 DEBUG - Length of matched_topics:', planData.matched_topics?.length);
    
    // CRITICAL FIX: Check if this is a direct backend response (not nested)
    if (planData.matched_topics && Array.isArray(planData.matched_topics)) {
      console.log('✅ Found direct backend response structure');
      console.log('🔍 DEBUG - Direct matched_topics:', planData.matched_topics);
      console.log('🔍 DEBUG - Direct matched_topics length:', planData.matched_topics.length);
      
      const result = {
        isNewStructure: true,
        weeklyPlan: planData.weekly_plan,
        matched_topics: planData.matched_topics, // Use the direct matched_topics
        profile_analysis: planData.profile_analysis,
        learning_objectives: planData.learning_objectives,
        recommended_activities: planData.recommended_activities,
        progress_tracking: planData.progress_tracking,
        review_insights: planData.review_insights,
        systematic_approach: planData.systematic_approach,
        llm_integration: planData.llm_integration,
        agent_timings: planData.agent_timings
      };
      console.log('🔍 DEBUG - Processed direct result:', result);
      console.log('🔍 DEBUG - Result matched_topics:', result.matched_topics);
      console.log('🔍 DEBUG - Result matched_topics length:', result.matched_topics?.length);
      return result;
    }
    
    // Check if data is nested under a 'data' property (backend response structure)
    if (planData.data && planData.data.matched_topics) {
      console.log('✅ Found nested data structure (backend response)');
      console.log('🔍 DEBUG - Nested matched_topics:', planData.data.matched_topics);
      const nestedData = planData.data;
      const result = {
        isNewStructure: true,
        weeklyPlan: nestedData.weekly_plan,
        matched_topics: nestedData.matched_topics,
        profile_analysis: nestedData.profile_analysis,
        learning_objectives: nestedData.learning_objectives,
        recommended_activities: nestedData.recommended_activities,
        progress_tracking: nestedData.progress_tracking,
        review_insights: nestedData.review_insights,
        systematic_approach: nestedData.systematic_approach,
        llm_integration: planData.llm_integration,
        agent_timings: planData.agent_timings
      };
      console.log('🔍 DEBUG - Processed nested result:', result);
      console.log('🔍 DEBUG - Result matched_topics:', result.matched_topics);
      console.log('🔍 DEBUG - Result weeklyPlan:', result.weeklyPlan);
      return result;
    }
    
    // Check if it's the new structure from backend
    if (planData.weekly_plan) {
      console.log('✅ Using backend structure (weekly_plan)');
      
      // Handle the new backend structure with "weeks" array
      let processedWeeklyPlan = planData.weekly_plan;
      
      // If the backend returns {weeks: [{week: 1, days: [...]}]}, convert to {week_1: {days: [...]}}
      if (planData.weekly_plan.weeks && Array.isArray(planData.weekly_plan.weeks)) {
        console.log('🔄 Converting backend weeks array to frontend format');
        processedWeeklyPlan = {};
        
        planData.weekly_plan.weeks.forEach(weekData => {
          const weekNumber = weekData.week;
          const weekKey = `week_${weekNumber}`;
          
          // Convert days array to object format
          const daysObject = {};
          if (weekData.days && Array.isArray(weekData.days)) {
            weekData.days.forEach(dayData => {
              const dayNumber = dayData.day;
              const dayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
              const dayName = dayNames[dayNumber - 1] || `day${dayNumber}`;
              daysObject[dayName] = dayData;
            });
          }
          
          processedWeeklyPlan[weekKey] = daysObject;
        });
        
        console.log('✅ Converted weekly plan structure:', processedWeeklyPlan);
      }
      
      const result = {
        isNewStructure: true,
        weeklyPlan: processedWeeklyPlan,
        matched_topics: planData.matched_topics,
        profile_analysis: planData.profile_analysis,
        learning_objectives: planData.learning_objectives,
        recommended_activities: planData.recommended_activities,
        progress_tracking: planData.progress_tracking,
        review_insights: planData.review_insights,
        systematic_approach: planData.systematic_approach,
        llm_integration: planData.llm_integration,
        agent_timings: planData.agent_timings
      };
      console.log('🔍 DEBUG - Processed result:', result);
      console.log('🔍 DEBUG - Result matched_topics:', result.matched_topics);
      console.log('🔍 DEBUG - Result weeklyPlan:', result.weeklyPlan);
      return result;
    }
    
    // Check if it's the old structure
    if (planData.weekly_learning_plan) {
      console.log('✅ Using old structure (weekly_learning_plan)');
      const result = {
        isNewStructure: false,
        weeklyPlan: planData.weekly_learning_plan,
        matched_topics: planData.matched_topics,
        profile_analysis: planData.profile_analysis,
        learning_objectives: planData.learning_objectives,
        recommended_activities: planData.recommended_activities,
        progress_tracking: planData.progress_tracking,
        llm_integration: planData.llm_integration,
        agent_timings: planData.agent_timings
      };
      console.log('🔍 DEBUG - Processed result:', result);
      console.log('🔍 DEBUG - Result matched_topics:', result.matched_topics);
      return result;
    }
    
    // Handle flat structure where days are not grouped into weeks
    console.log('🔄 Converting flat structure to weekly format');
    const flatData = planData;
    const weeklyPlan = {};
    
    // Find all day keys
    const dayKeys = Object.keys(flatData).filter(key => 
      key.toLowerCase().includes('day') || 
      key.toLowerCase().includes('monday') ||
      key.toLowerCase().includes('tuesday') ||
      key.toLowerCase().includes('wednesday') ||
      key.toLowerCase().includes('thursday') ||
      key.toLowerCase().includes('friday') ||
      key.toLowerCase().includes('saturday') ||
      key.toLowerCase().includes('sunday')
    );
    
    console.log('🔍 DEBUG - Found day keys:', dayKeys);
    
    // Group days into weeks (assuming 7 days per week)
    const daysPerWeek = 7;
    
    for (let weekIndex = 0; weekIndex < 4; weekIndex++) { // 4 weeks now
      const weekKey = `week_${weekIndex + 1}`;
      weeklyPlan[weekKey] = {};
      
      for (let dayIndex = 0; dayIndex < daysPerWeek; dayIndex++) {
        const dayNumber = weekIndex * daysPerWeek + dayIndex + 1;
        const dayKey = `day ${dayNumber}`;
        const dayKeyAlt = `day${dayNumber}`;
        
        // Map to standard day names
        const dayNames = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
        const standardDayKey = dayNames[dayIndex];
        
        // Check for various possible day key formats
        if (flatData[dayKey]) {
          console.log(`✅ Found data for ${dayKey} -> ${standardDayKey}`);
          weeklyPlan[weekKey][standardDayKey] = flatData[dayKey];
        } else if (flatData[dayKeyAlt]) {
          console.log(`✅ Found data for ${dayKeyAlt} -> ${standardDayKey}`);
          weeklyPlan[weekKey][standardDayKey] = flatData[dayKeyAlt];
        } else if (flatData[standardDayKey]) {
          console.log(`✅ Found data for ${standardDayKey}`);
          weeklyPlan[weekKey][standardDayKey] = flatData[standardDayKey];
        }
      }
    }
    
    console.log('🔍 DEBUG - Converted weekly plan:', weeklyPlan);
    
    const result = {
      isNewStructure: false,
      weeklyPlan: weeklyPlan,
      matched_topics: flatData.matched_topics,
      profile_analysis: flatData.profile_analysis,
      learning_objectives: flatData.learning_objectives,
      recommended_activities: flatData.recommended_activities,
      progress_tracking: flatData.progress_tracking,
      llm_integration: flatData.llm_integration,
      agent_timings: flatData.agent_timings
    };
    console.log('🔍 DEBUG - Final processed result:', result);
    console.log('🔍 DEBUG - Final matched_topics:', result.matched_topics);
    return result;
  };

  const processedPlanData = getPlanData(planData);

  // Make sure getDayData is defined before any usage in the render
  const getDayData = (weekData, dayKey) => {
    try {
      if (!weekData || !weekData[dayKey]) {
        console.log(`🔍 No data for ${dayKey} in week data:`, weekData);
        return null;
      }
      
      const dayData = weekData[dayKey];
      console.log(`🔍 Raw day data for ${dayKey}:`, dayData);
      
      // Handle both old and new structures
      if (processedPlanData?.isNewStructure) {
        const result = {
          topic: String(dayData.topic || dayData.topic_title || 'No Topic'),
          subject: String(dayData.niche || dayData.subject_area || 'No Subject'),
          objective: String(dayData.objective || dayData.learning_objective || 'No Objective'),
          primaryActivity: String(dayData.activity || dayData.primary_activity || 'No Activity'),
          secondaryActivity: dayData.secondary_activity ? String(dayData.secondary_activity) : null,
          duration: String(dayData.duration || dayData.estimated_duration || '30 minutes'),
          difficulty: String(dayData.difficulty_level || 'Beginner'),
          materials: String(dayData.materials_needed || 'Basic materials')
        };
        console.log(`🔍 Processed day data (new structure):`, result);
        return result;
      } else {
        // Handle old structure with various field names
        const result = {
          topic: String(dayData.topic || dayData.Topic || dayData["Topic"] || 'No Topic'),
          subject: String(dayData.niche || dayData.Niche || dayData["Niche"] || 'No Subject'),
          objective: String(dayData.objective || dayData.Objective || dayData["Objective"] || 'No Objective'),
          primaryActivity: String(dayData.activity_1 || dayData["Activity 1"] || dayData.activity || 'No Activity'),
          secondaryActivity: dayData.activity_2 || dayData["Activity 2"] ? String(dayData.activity_2 || dayData["Activity 2"]) : null,
          duration: String(dayData.estimated_time || dayData["Estimated Time"] || dayData.duration || '30 minutes'),
          difficulty: String(dayData.difficulty || dayData["Difficulty"] || 'Not specified'),
          materials: String(dayData.materials || dayData["Materials"] || 'Not specified')
        };
        console.log(`🔍 Processed day data (old structure):`, result);
        return result;
      }
    } catch (error) {
      console.error(`❌ Error in getDayData for ${dayKey}:`, error);
      // Return a safe default object instead of null
      return {
        topic: 'Error loading topic',
        subject: 'Error loading subject',
        objective: 'Error loading objective',
        primaryActivity: 'Error loading activity',
        secondaryActivity: null,
        duration: '30 minutes',
        difficulty: 'Not specified',
        materials: 'Not specified'
      };
    }
  };

  // Log day expansion for monitoring
  const handleDayExpansion = (weekKey, dayKey) => {
    try {
      console.log(`🔍 Expanding day: ${weekKey} - ${dayKey}`);
      console.log(`🔍 Current expanded state:`, expandedDayRow);
      console.log(`🔍 Processed plan data:`, processedPlanData);
      console.log(`🔍 Weekly plan:`, processedPlanData?.weeklyPlan);
      console.log(`🔍 Week data:`, processedPlanData?.weeklyPlan?.[weekKey]);
      
      setExpandedDayRow(row => {
        const newState = { ...row, [weekKey]: row[weekKey] === dayKey ? null : dayKey };
        console.log(`🔍 New expanded state:`, newState);
        return newState;
      });
      
      // Log day expansion
      if (user) {
        try {
          const dayData = getDayData(processedPlanData?.weeklyPlan?.[weekKey], dayKey);
          comprehensiveLoggingService.logUserJourneyStep(user.uid, 'day_details_expanded', 'User expanded day details', {
            childName: childName,
            weekKey: weekKey,
            dayKey: dayKey,
            dayData: dayData
          });
        } catch (logError) {
          console.error('❌ Error logging day expansion:', logError);
        }
      }
    } catch (error) {
      console.error('❌ Error in handleDayExpansion:', error);
      // Don't throw the error, just log it to prevent the "Something went wrong" message
    }
  };

  const WEEK_COLORS = [
    '#e3f2fd', // Week 1: Light Blue
    '#e8f5e9', // Week 2: Light Green
    '#fff3e0', // Week 3: Light Orange
    '#f3e5f5', // Week 4: Light Purple
  ];
  const WEEK_ACCENTS = [
    '#2196f3', // Blue
    '#43a047', // Green
    '#fb8c00', // Orange
    '#8e24aa', // Purple
  ];

  const styles = {
    container: {
      padding: '20px',
      maxWidth: '1400px',
      margin: '0 auto',
      fontFamily: 'Arial, sans-serif',
      overflowX: 'hidden'
    },
    header: {
      textAlign: 'center',
      marginBottom: '30px',
      color: '#6a4c93'
    },
    childName: {
      fontSize: '32px',
      fontWeight: 'bold',
      color: '#6a4c93',
      marginBottom: '10px'
    },
    monthSelector: {
      marginBottom: '30px',
      textAlign: 'center'
    },
    select: {
      background: 'transparent',
      border: 'none',
      fontSize: '16px',
      fontWeight: '700',
      color: '#667eea',
      cursor: 'pointer',
      outline: 'none',
      minWidth: '120px',
      textAlign: 'center',
      fontFamily: 'inherit',
      letterSpacing: '0.5px',
    },
    weeksContainer: {
      display: 'grid',
      gap: '40px',
      maxWidth: '100%',
      overflowX: 'hidden'
    },
    weekCard: {
      border: '3px solid',
      borderRadius: '16px',
      padding: '30px',
      boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
      maxWidth: '100%',
      overflowX: 'hidden',
      position: 'relative'
    },
    weekHeader: {
      fontSize: '28px',
      fontWeight: 'bold',
      marginBottom: '25px',
      padding: '15px 20px',
      borderRadius: '12px',
      textAlign: 'center',
      border: '3px solid',
      textTransform: 'uppercase',
      letterSpacing: '2px'
    },
    daysContainer: {
      display: 'grid',
      gap: '12px',
      maxWidth: '100%',
      overflowX: 'hidden'
    },
    dayCard: {
      border: '2px solid #e0e0e0',
      borderRadius: '12px',
      padding: '16px 20px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      maxWidth: '100%',
      overflowX: 'hidden',
      backgroundColor: 'white'
    },
    expandedDetails: {
      background: '#f8f9fa',
      borderRadius: '12px',
      padding: '20px',
      marginTop: '12px',
      border: '2px solid #e0e0e0',
      maxWidth: '100%',
      overflowX: 'hidden',
      boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)'
    },
    message: {
      textAlign: 'center',
      padding: '40px',
      fontSize: '18px',
      color: '#666'
    }
  };

  const ModernSelect = ({ value, onChange, options }) => (
    <div style={{
      position: 'relative',
      display: 'inline-block',
      minWidth: '180px',
    }}>
      <select 
        value={value} 
        onChange={onChange} 
        style={{
          ...styles.select,
          appearance: 'none',
          WebkitAppearance: 'none',
          MozAppearance: 'none',
          backgroundImage: `url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23667eea' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e")`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right 8px center',
          backgroundSize: '16px',
          paddingRight: '40px',
          paddingLeft: '16px',
          paddingTop: '12px',
          paddingBottom: '12px',
          borderRadius: '12px',
          border: '2px solid rgba(102, 126, 234, 0.3)',
          backgroundColor: 'rgba(255, 255, 255, 0.9)',
          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.15)',
          transition: 'all 0.3s ease',
          fontWeight: '600',
          fontSize: '16px',
          color: '#667eea',
          cursor: 'pointer',
          minWidth: '180px',
          textAlign: 'center',
          fontFamily: 'inherit',
          letterSpacing: '0.5px',
        }}
        onFocus={(e) => {
          e.target.style.borderColor = '#667eea';
          e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.25)';
        }}
        onBlur={(e) => {
          e.target.style.borderColor = 'rgba(102, 126, 234, 0.3)';
          e.target.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.15)';
        }}
      >
        {options.map(option => (
          <option 
            key={option} 
            value={option}
            style={{
              backgroundColor: '#fff',
              color: '#667eea',
              padding: '8px',
              fontSize: '14px',
              fontWeight: '500',
            }}
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  );

  // Show loading while auth is initializing
  if (authLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.message}>Loading authentication...</div>
      </div>
    );
  }

  // Show error if auth failed
  if (authError) {
    return (
      <div style={styles.container}>
        <div style={styles.message}>Authentication error: {authError.message}</div>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (!user) {
    return (
      <div style={styles.container}>
        <div style={styles.message}>
          Please log in to view your weekly plan.
          <br />
          <button 
            onClick={() => navigate('/login')}
            style={{
              background: '#667eea',
              color: 'white',
              border: 'none',
              padding: '12px 24px',
              borderRadius: '8px',
              cursor: 'pointer',
              marginTop: '16px',
              fontSize: '1rem'
            }}
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.message}>Loading your customized weekly plan...</div>
      </div>
    );
  }

  if (generatingPlan) {
    return (
      <div style={styles.container}>
        <div style={styles.message}>
          🚀 Generating your personalized learning plan...
          <br />
          <small style={{ fontSize: '0.9rem', opacity: 0.8 }}>
            This may take a few moments as our AI creates the perfect plan for {childName}
          </small>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={styles.container}>
        <div style={styles.message}>Error: {error}</div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div style={styles.container}>
        <BackButton />
        
        {/* Hero Section */}
        <div style={{
          width: '100%',
          padding: '60px 0 40px 0',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)',
          borderRadius: '0 0 40px 40px',
          boxShadow: '0 12px 40px rgba(102, 126, 234, 0.4)',
          textAlign: 'center',
          marginBottom: '40px',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Decorative Elements */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '200px',
            height: '200px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.1) 0%, transparent 70%)',
            borderRadius: '50%',
          }} />
          <div style={{
            position: 'absolute',
            bottom: '-30px',
            left: '-30px',
            width: '150px',
            height: '150px',
            background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
            borderRadius: '50%',
          }} />
          
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: '900',
            color: '#fff',
            letterSpacing: '3px',
            margin: '0 0 20px 0',
            textShadow: '0 4px 20px rgba(0,0,0,0.3)',
            lineHeight: '1.1',
            position: 'relative',
            zIndex: '2',
          }}>
            🎯 Personalized Learning Journey
          </h1>
          
          {/* Systematic Approach Display */}
          {processedPlanData?.systematic_approach && (
            <div style={{
              background: 'rgba(255,255,255,0.95)',
              borderRadius: '20px',
              padding: '30px',
              margin: '20px auto',
              maxWidth: '800px',
              boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
              position: 'relative',
              zIndex: '2',
            }}>
              <h3 style={{
                color: '#667eea',
                fontSize: '1.5rem',
                fontWeight: '700',
                marginBottom: '20px',
                textAlign: 'center'
              }}>
                🤖 AI Agent Decision Process
              </h3>
              
              {/* Agent Flow */}
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '20px',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                {processedPlanData.systematic_approach.agent_flow?.map((agent, idx) => (
                  <div key={idx} style={{
                    background: '#667eea',
                    color: 'white',
                    padding: '12px 20px',
                    borderRadius: '25px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    textAlign: 'center',
                    flex: '1',
                    minWidth: '150px',
                    boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                  }}>
                    <div style={{ fontSize: '1.2rem', marginBottom: '4px' }}>
                      {agent.agent === 'match_agent' ? '🎯' : 
                       agent.agent === 'schedule_agent' ? '📅' : '🔍'}
                    </div>
                    <div style={{ textTransform: 'capitalize' }}>
                      {agent.agent.replace('_', ' ')}
                    </div>
                    <div style={{ fontSize: '0.8rem', opacity: 0.9 }}>
                      {agent.status}
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Plan Structure */}
              {processedPlanData.systematic_approach.plan_structure && (
                <div style={{
                  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                  borderRadius: '15px',
                  padding: '20px',
                  color: 'white',
                  marginTop: '20px'
                }}>
                  <h4 style={{ marginBottom: '15px', fontSize: '1.2rem' }}>
                    📋 4-Week Systematic Approach
                  </h4>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '15px'
                  }}>
                    {Object.entries(processedPlanData.systematic_approach.plan_structure).map(([week, data]) => {
                      if (week === 'total_weeks') return null;
                      return (
                        <div key={week} style={{
                          background: 'rgba(255,255,255,0.2)',
                          borderRadius: '10px',
                          padding: '15px',
                          textAlign: 'center'
                        }}>
                          <div style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '5px' }}>
                            {data.theme}
                          </div>
                          <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>
                            {data.focus}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}
          
          <p style={{
            fontSize: '1.2rem',
            color: 'rgba(255,255,255,0.9)',
            margin: '0 0 40px 0',
            fontWeight: '400',
            letterSpacing: '1px',
            position: 'relative',
            zIndex: '2',
          }}>
            Tailored weekly activities designed just for your child
          </p>
          
          {/* Enhanced Name and Month Display */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            gap: '24px',
            marginTop: '40px',
            flexWrap: 'wrap',
            position: 'relative',
            zIndex: '2',
          }}>
            
            {/* Database Info Button */}
            <button
              onClick={() => setShowDbInfo(!showDbInfo)}
              style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                padding: '8px 16px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>🔍</span>
              {showDbInfo ? 'Hide Debug' : 'Show Debug'}
            </button>
            {/* Child Name Card */}
            <div style={{
              background: 'linear-gradient(135deg, #fff 0%, #f8f9ff 100%)',
              color: '#667eea',
              fontWeight: '800',
              fontSize: '18px',
              borderRadius: '20px',
              padding: '16px 32px',
              boxShadow: '0 8px 25px rgba(255,255,255,0.4)',
              letterSpacing: '1px',
              minWidth: '120px',
              textAlign: 'center',
              border: '3px solid rgba(255,255,255,0.3)',
              display: 'inline-block',
              backdropFilter: 'blur(10px)',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                height: '3px',
                background: 'linear-gradient(90deg, #667eea, #764ba2, #f093fb)',
              }} />
              <span style={{ fontSize: '20px', marginRight: '8px' }}>👶</span>
              {childName}
            </div>
            
            {/* Month Selector */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,249,255,0.95) 100%)',
              borderRadius: '20px',
              padding: '16px 24px',
              boxShadow: '0 8px 25px rgba(255,255,255,0.4)',
              minWidth: '140px',
              border: '3px solid rgba(255,255,255,0.3)',
              backdropFilter: 'blur(10px)',
              position: 'relative',
              overflow: 'hidden',
            }}>
              <div style={{
                position: 'absolute',
                top: '0',
                left: '0',
                right: '0',
                height: '3px',
                background: 'linear-gradient(90deg, #667eea, #764ba2, #f093fb)',
              }} />
              <span style={{ fontSize: '18px', marginRight: '12px', color: '#667eea' }}>📅</span>
              <ModernSelect
                value={cleanSelectedMonth}
                onChange={(e) => {
                  setSelectedMonth(e.target.value);
                  if (user) {
                    comprehensiveLoggingService.logUserJourneyStep(user.uid, 'month_changed', 'User changed selected month', {
                      childName: childName,
                      previousMonth: cleanSelectedMonth,
                      newMonth: e.target.value
                    });
                  }
                }}
                options={months}
              />
            </div>
          </div>
        </div>

        {/* Month Selector for mobile */}
        {months.length > 1 && (
          <div style={styles.monthSelector}>
            <ModernSelect
              value={cleanSelectedMonth}
              onChange={(e) => {
                setSelectedMonth(e.target.value);
                // Log month change
                if (user) {
                  comprehensiveLoggingService.logUserJourneyStep(user.uid, 'month_changed', 'User changed selected month', {
                    childName: childName,
                    previousMonth: cleanSelectedMonth,
                    newMonth: e.target.value
                  });
                }
              }}
              options={months}
            />
          </div>
        )}

        {/* Debug Information */}
        <div style={{
          background: '#f8f9fa',
          border: '1px solid #dee2e6',
          borderRadius: '8px',
          padding: '20px',
          marginBottom: '20px',
          fontSize: '0.9rem'
        }}>
          <h4 style={{ margin: '0 0 12px 0', color: '#495057' }}>🔍 Debug Information</h4>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '16px' }}>
            <div><strong>User:</strong> {user ? user.email : 'Not logged in'}</div>
            <div><strong>Child Name:</strong> {childName || 'Not set'}</div>
            <div><strong>Selected Month:</strong> {selectedMonth || 'Not set'}</div>
            <div><strong>Plans Count:</strong> {Object.keys(plans).length}</div>
            <div><strong>Available Months:</strong> {Object.keys(plans).join(', ') || 'None'}</div>
            <div><strong>Location State:</strong> {location.state ? 'Has data' : 'No data'}</div>
          </div>
          
          {location.state && (
            <div style={{ marginTop: '12px' }}>
              <strong>Location State Data:</strong>
              <pre style={{ 
                background: '#e9ecef', 
                padding: '8px', 
                borderRadius: '4px',
                overflow: 'auto',
                maxHeight: '150px',
                fontSize: '0.8rem'
              }}>
                {JSON.stringify(location.state, null, 2)}
              </pre>
            </div>
          )}
          
          {Object.keys(plans).length > 0 && (
            <div style={{ marginTop: '12px' }}>
              <strong>Plans Data:</strong>
              <pre style={{ 
                background: '#e9ecef', 
                padding: '8px', 
                borderRadius: '4px',
                overflow: 'auto',
                maxHeight: '150px',
                fontSize: '0.8rem'
              }}>
                {JSON.stringify(plans, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* Plan Overview Header */}
        {plans[selectedMonth] && plans[selectedMonth].overview && (
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: 'white',
            padding: '2rem',
            borderRadius: '16px',
            marginBottom: '2rem',
            textAlign: 'center',
            boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
          }}>
            <h1 style={{ margin: '0 0 1rem 0', fontSize: '2.5rem', fontWeight: '700' }}>
              {plans[selectedMonth].overview.title}
            </h1>
            <p style={{ margin: '0 0 1.5rem 0', fontSize: '1.2rem', opacity: 0.9 }}>
              {plans[selectedMonth].overview.subtitle}
            </p>
            
            {/* Child Info Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem', maxWidth: '600px', margin: '0 auto' }}>
              <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '1rem', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>👶</div>
                <div style={{ fontWeight: '600' }}>{plans[selectedMonth].overview.childInfo.name}</div>
                <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Child</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '1rem', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎂</div>
                <div style={{ fontWeight: '600' }}>{plans[selectedMonth].overview.childInfo.age} years</div>
                <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Age</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '1rem', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎯</div>
                <div style={{ fontWeight: '600' }}>{plans[selectedMonth].overview.childInfo.interests.length}</div>
                <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Interests</div>
              </div>
              <div style={{ background: 'rgba(255, 255, 255, 0.1)', padding: '1rem', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
                <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎨</div>
                <div style={{ fontWeight: '600' }}>{plans[selectedMonth].overview.childInfo.learningStyle}</div>
                <div style={{ fontSize: '0.9rem', opacity: 0.8 }}>Learning Style</div>
              </div>
            </div>
          </div>
        )}

        {/* Debug Info Dialog */}
        {showDbInfo && (
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'white',
            border: '2px solid #667eea',
            borderRadius: '12px',
            padding: '20px',
            maxWidth: '80vw',
            maxHeight: '80vh',
            overflow: 'auto',
            zIndex: 1000,
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '16px',
              borderBottom: '1px solid #eee',
              paddingBottom: '8px'
            }}>
              <h3 style={{ margin: 0, color: '#667eea' }}>🔍 Debug Information</h3>
              <button
                onClick={() => setShowDbInfo(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '20px',
                  cursor: 'pointer',
                  color: '#667eea'
                }}
              >
                ✕
              </button>
            </div>
            
            <div style={{ fontSize: '12px', fontFamily: 'monospace' }}>
              <h4>📊 Plan Data Structure:</h4>
              <pre style={{ 
                background: '#f5f5f5', 
                padding: '8px', 
                borderRadius: '4px',
                overflow: 'auto',
                maxHeight: '200px'
              }}>
                {JSON.stringify(processedPlanData, null, 2)}
              </pre>
              
              <h4>📅 Available Weeks:</h4>
              <pre style={{ 
                background: '#f5f5f5', 
                padding: '8px', 
                borderRadius: '4px'
              }}>
                {JSON.stringify(Object.keys(processedPlanData?.weeklyPlan || {}), null, 2)}
              </pre>
              
              <h4>🎯 Matched Topics:</h4>
              <pre style={{ 
                background: '#f5f5f5', 
                padding: '8px', 
                borderRadius: '4px',
                overflow: 'auto',
                maxHeight: '200px'
              }}>
                {JSON.stringify(processedPlanData?.matched_topics?.slice(0, 3), null, 2)}
              </pre>
            </div>
          </div>
        )}

        {!processedPlanData ? (
          <div style={styles.message}>No plan data for this month.</div>
        ) : (
          <>
            {/* Weekly Schedule - 4 Weeks with 7 Days Each */}
            <div style={{
              background: '#fff',
              border: '3px solid #667eea',
              borderRadius: '20px',
              padding: '40px',
              marginBottom: '40px',
              boxShadow: '0 12px 40px rgba(102, 126, 234, 0.15)',
              maxWidth: '100%',
              marginLeft: 'auto',
              marginRight: 'auto',
              overflowX: 'hidden'
            }}>
              <h2 style={{ 
                color: '#667eea', 
                fontWeight: '800', 
                fontSize: '32px', 
                marginBottom: '20px',
                textAlign: 'center',
                textShadow: '0 2px 8px rgba(102, 126, 234, 0.2)'
              }}>
                📅 Personalized Learning Plan for {childName}
              </h2>
              
              
              {/* Weekly Plan - 4 weeks with 7 days each */}
              <div style={styles.weeksContainer}>
                {(() => {
                  const availableWeeks = Object.keys(processedPlanData.weeklyPlan);
                  console.log('🔍 Available weeks in data:', availableWeeks);
                  
                  // Handle both old format (week_1, week_2, etc.) and new format (discovery_week, skills_week, etc.)
                  const weekOrder = ['discovery_week', 'skills_week', 'creation_week', 'project_week', 'week_1', 'week_2', 'week_3', 'week_4'];
                  const filteredWeeks = Object.entries(processedPlanData.weeklyPlan)
                    .filter(([weekKey]) => weekOrder.includes(weekKey))
                    .sort(([a], [b]) => {
                      const aIndex = weekOrder.indexOf(a);
                      const bIndex = weekOrder.indexOf(b);
                      return aIndex - bIndex;
                    });
                  console.log('🔍 Filtered weeks to display:', filteredWeeks.map(([key]) => key));
                  return filteredWeeks.map(([weekKey, weekData], weekIdx) => (
                    <ErrorBoundary key={weekKey}>
                      <div style={{
                        ...styles.weekCard,
                        background: WEEK_COLORS[weekIdx % WEEK_COLORS.length],
                        borderColor: WEEK_ACCENTS[weekIdx % WEEK_ACCENTS.length],
                        boxShadow: `0 8px 32px ${WEEK_ACCENTS[weekIdx % WEEK_ACCENTS.length]}30`,
                        marginBottom: '40px',
                        maxWidth: '100%',
                        overflowX: 'hidden'
                      }}>
                        <h2 style={{
                          ...styles.weekHeader,
                          color: WEEK_ACCENTS[weekIdx % WEEK_ACCENTS.length],
                          background: 'rgba(255,255,255,0.9)',
                          borderColor: WEEK_ACCENTS[weekIdx % WEEK_ACCENTS.length],
                        }}>
                          {weekKey === 'discovery_week' ? 'DISCOVERY WEEK' :
                           weekKey === 'skills_week' ? 'SKILLS WEEK' :
                           weekKey === 'creation_week' ? 'CREATION WEEK' :
                           weekKey === 'project_week' ? 'PROJECT WEEK' :
                           weekKey.replace('_', ' ').toUpperCase()}
                        </h2>
                        
                        {/* Week Theme and Description */}
                        {weekData.week_theme && (
                          <div style={{
                            background: 'rgba(255,255,255,0.95)',
                            borderRadius: '15px',
                            padding: '20px',
                            margin: '20px 0',
                            border: `2px solid ${WEEK_ACCENTS[weekIdx % WEEK_ACCENTS.length]}30`
                          }}>
                            <h3 style={{
                              color: WEEK_ACCENTS[weekIdx % WEEK_ACCENTS.length],
                              fontSize: '1.3rem',
                              fontWeight: '700',
                              marginBottom: '10px'
                            }}>
                              {weekData.week_theme}
                            </h3>
                            <p style={{
                              color: '#666',
                              fontSize: '0.95rem',
                              marginBottom: '10px'
                            }}>
                              {weekData.week_description}
                            </p>
                            <div style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              alignItems: 'center',
                              flexWrap: 'wrap',
                              gap: '10px'
                            }}>
                              <div style={{
                                background: WEEK_ACCENTS[weekIdx % WEEK_ACCENTS.length],
                                color: 'white',
                                padding: '8px 15px',
                                borderRadius: '20px',
                                fontSize: '0.85rem',
                                fontWeight: '600'
                              }}>
                                🎯 {weekData.week_goal}
                              </div>
                              <div style={{
                                background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                color: 'white',
                                padding: '8px 15px',
                                borderRadius: '20px',
                                fontSize: '0.85rem',
                                fontWeight: '600'
                              }}>
                                💪 {weekData.motivation_focus}
                              </div>
                            </div>
                            
                            {/* Project Week Special Display */}
                            {weekData.project_week && (
                              <div style={{
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                borderRadius: '12px',
                                padding: '15px',
                                marginTop: '15px',
                                color: 'white'
                              }}>
                                <h4 style={{ fontSize: '1.1rem', marginBottom: '10px' }}>
                                  🎨 {weekData.project_week.project_name}
                                </h4>
                                <div style={{ fontSize: '0.9rem', marginBottom: '8px' }}>
                                  <strong>Goal:</strong> {weekData.project_week.project_goal}
                                </div>
                                <div style={{ fontSize: '0.9rem', marginBottom: '8px' }}>
                                  <strong>Outcome:</strong> {weekData.project_week.project_outcome}
                                </div>
                                <div style={{ fontSize: '0.9rem' }}>
                                  <strong>Presentation:</strong> {weekData.project_week.project_presentation}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                        <div style={{ ...styles.daysContainer, gap: '0' }}>
                          {["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"].map((dayKey, dayIdx) => {
                            const dayData = getDayData(weekData, dayKey);
                            const accent = WEEK_ACCENTS[weekIdx % WEEK_ACCENTS.length];
                            return (
                              <ErrorBoundary key={dayKey}>
                                <React.Fragment>
                                  <div
                                    style={{
                                      ...styles.dayCard,
                                      background: '#fff',
                                      borderLeft: `6px solid ${accent}`,
                                      margin: '0 0 12px 0',
                                      boxShadow: expandedDayRow[weekKey] === dayKey ? `0 4px 16px ${accent}40` : '0 2px 8px rgba(0,0,0,0.1)',
                                      transition: 'all 0.3s ease',
                                      display: 'flex',
                                      alignItems: 'center',
                                      minHeight: '60px',
                                      height: '60px',
                                      position: 'relative',
                                      cursor: 'pointer',
                                      overflow: 'hidden',
                                      padding: '0 16px',
                                      borderRadius: '12px',
                                      maxWidth: '100%'
                                    }}
                                    onClick={() => {
                                      try {
                                        handleDayExpansion(weekKey, dayKey);
                                      } catch (error) {
                                        console.error(`❌ Error clicking day card for ${weekKey} - ${dayKey}:`, error);
                                      }
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.background = '#f8f9fa'}
                                    onMouseLeave={e => e.currentTarget.style.background = '#fff'}
                                  >
                                    {/* Day name */}
                                    <div style={{
                                      minWidth: '100px',
                                      fontWeight: '800',
                                      fontSize: '16px',
                                      color: accent,
                                      textAlign: 'left',
                                      padding: '0 12px',
                                      letterSpacing: '1px',
                                      flexShrink: '0',
                                    }}>{dayKey.charAt(0).toUpperCase() + dayKey.slice(1)}</div>
                                    {/* Topic/title and Smart Helper */}
                                    <div style={{
                                      flex: '1',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '12px',
                                      fontSize: '15px',
                                      fontWeight: '600',
                                      color: '#333',
                                      overflow: 'hidden',
                                      whiteSpace: 'nowrap',
                                      textOverflow: 'ellipsis',
                                    }}>
                                      {dayData ? (
                                        <>
                                          <span 
                                            style={{ 
                                              fontWeight: '700',
                                              cursor: findTopicData(dayData.topic) ? 'pointer' : 'default',
                                              color: findTopicData(dayData.topic) ? '#667eea' : '#333',
                                              textDecoration: findTopicData(dayData.topic) ? 'underline' : 'none',
                                              transition: 'all 0.2s ease'
                                            }}
                                            onClick={() => {
                                              if (findTopicData(dayData.topic)) {
                                                navigateToTopic(dayData.topic);
                                              }
                                            }}
                                            title={findTopicData(dayData.topic) ? 'Click to view topic details' : 'Topic not found in database'}
                                          >
                                            {String(dayData.topic || '')}
                                          </span>
                                          <span style={{ fontSize: '18px', marginLeft: '6px' }} title="Smart Helper">🤖</span>
                                        </>
                                      ) : (
                                        <span style={{ color: '#bbb', fontStyle: 'italic' }}>No activities planned</span>
                                      )}
                                    </div>
                                    {/* Expand/View Button */}
                                    <button
                                      className={`expand-button ${expandedDayRow[weekKey] === dayKey ? 'expanded' : ''}`}
                                      style={{
                                        background: expandedDayRow[weekKey] === dayKey ? accent : '#f3f0fa',
                                        color: expandedDayRow[weekKey] === dayKey ? '#fff' : accent,
                                        border: 'none',
                                        borderRadius: '50%',
                                        width: '32px',
                                        height: '32px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '16px',
                                        marginRight: '8px',
                                        marginLeft: '8px',
                                        boxShadow: expandedDayRow[weekKey] === dayKey ? `0 2px 8px ${accent}50` : 'none',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease',
                                        outline: 'none',
                                      }}
                                      tabIndex={0}
                                      aria-label={expandedDayRow[weekKey] === dayKey ? `Hide details for ${dayKey}` : `Show details for ${dayKey}`}
                                      onClick={e => {
                                        try {
                                          e.stopPropagation();
                                          console.log(`🔍 Button clicked for ${weekKey} - ${dayKey}`);
                                          handleDayExpansion(weekKey, dayKey);
                                        } catch (error) {
                                          console.error(`❌ Error clicking button for ${weekKey} - ${dayKey}:`, error);
                                          // Don't let the error bubble up to prevent "Something went wrong"
                                        }
                                      }}
                                    >
                                      {expandedDayRow[weekKey] === dayKey ? (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15" /></svg>
                                      ) : (
                                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={accent} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9" /></svg>
                                      )}
                                    </button>
                                  </div>
                                  {/* Expanded details inline below the day row, within the week card */}
                                  {expandedDayRow[weekKey] === dayKey && dayData && (
                                    <ErrorBoundary>
                                      <div 
                                        className="expanded-day-details"
                                        data-expanded="true"
                                        data-week={weekKey}
                                        data-day={dayKey}
                                        style={{
                                          width: 'calc(100% - 32px)',
                                          margin: '0 16px 16px 16px',
                                          background: '#f8f9fa',
                                          borderRadius: '12px',
                                          boxShadow: `0 4px 20px ${accent}30`,
                                          border: `2px solid ${accent}`,
                                          padding: '20px 24px',
                                          color: '#333',
                                          fontSize: '15px',
                                          fontWeight: '500',
                                          position: 'relative',
                                          zIndex: '1',
                                          maxWidth: '100%',
                                          overflowX: 'hidden',
                                          transform: 'translateY(0)',
                                          opacity: '1',
                                          transition: 'all 0.3s ease'
                                        }}
                                      >
                                        <div 
                                          style={{ 
                                            color: accent, 
                                            fontWeight: '800', 
                                            fontSize: '18px', 
                                            marginBottom: '16px',
                                            cursor: findTopicData(dayData.topic) ? 'pointer' : 'default',
                                            textDecoration: findTopicData(dayData.topic) ? 'underline' : 'none',
                                            transition: 'all 0.2s ease'
                                          }}
                                          onClick={() => {
                                            if (findTopicData(dayData.topic)) {
                                              navigateToTopic(dayData.topic);
                                            }
                                          }}
                                          title={findTopicData(dayData.topic) ? 'Click to view topic details' : 'Topic not found in database'}
                                        >
                                          {String(dayData.topic || '')}
                                        </div>
                                        <div style={{ marginBottom: '12px' }}><span style={{ color: '#667eea', fontWeight: '700' }}>🎯 Learning Objective:</span> <span style={{ color: '#333', marginLeft: '8px' }}>{String(dayData.objective || '')}</span></div>
                                        <div style={{ marginBottom: '12px' }}><span style={{ color: '#667eea', fontWeight: '700' }}>⏱️ Duration:</span> <span style={{ color: '#333', marginLeft: '8px' }}>{String(dayData.duration || '')}</span></div>
                                        <div style={{ marginBottom: '12px' }}><span style={{ color: '#667eea', fontWeight: '700' }}>📊 Difficulty:</span> <span style={{ color: '#333', marginLeft: '8px' }}>{String(dayData.difficulty || '')}</span></div>
                                        
                                        {/* Enhanced Activity Display */}
                                        {dayData.activity && (
                                          <div style={{ marginBottom: '12px' }}>
                                            <span style={{ color: '#667eea', fontWeight: '700' }}>🎮 Main Activity:</span> 
                                            <span style={{ color: '#333', marginLeft: '8px' }}>{String(dayData.activity)}</span>
                                          </div>
                                        )}
                                        
                                        {dayData.secondary_activity && (
                                          <div style={{ marginBottom: '12px' }}>
                                            <span style={{ color: '#667eea', fontWeight: '700' }}>🌟 Secondary Activity:</span> 
                                            <span style={{ color: '#333', marginLeft: '8px' }}>{String(dayData.secondary_activity)}</span>
                                          </div>
                                        )}
                                        
                                        {/* Motivation Element */}
                                        {dayData.motivation_element && (
                                          <div style={{
                                            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                                            borderRadius: '10px',
                                            padding: '12px',
                                            marginBottom: '12px',
                                            color: 'white',
                                            fontWeight: '600'
                                          }}>
                                            💪 {dayData.motivation_element}
                                          </div>
                                        )}
                                        
                                        {/* Success Metric */}
                                        {dayData.success_metric && (
                                          <div style={{ marginBottom: '12px' }}>
                                            <span style={{ color: '#667eea', fontWeight: '700' }}>✅ Success Metric:</span> 
                                            <span style={{ color: '#333', marginLeft: '8px' }}>{String(dayData.success_metric)}</span>
                                          </div>
                                        )}
                                        
                                        {/* Project Integration for Week 4 */}
                                        {dayData.project_integration && (
                                          <div style={{
                                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                            borderRadius: '10px',
                                            padding: '12px',
                                            marginBottom: '12px',
                                            color: 'white'
                                          }}>
                                            <div style={{ fontWeight: '700', marginBottom: '5px' }}>
                                              🎨 Project Component: {dayData.project_integration.component_name}
                                            </div>
                                            <div style={{ fontSize: '0.9rem', marginBottom: '5px' }}>
                                              {dayData.project_integration.contribution}
                                            </div>
                                            <div style={{ fontSize: '0.9rem', fontStyle: 'italic' }}>
                                              {dayData.project_integration.presentation_prep}
                                            </div>
                                          </div>
                                        )}
                                        
                                        <div style={{ marginBottom: '16px' }}><span style={{ color: '#667eea', fontWeight: '700' }}>📊 Difficulty:</span> <span style={{ color: '#333', marginLeft: '8px' }}>{String(dayData.difficulty || '')}</span></div>
                                        {(() => {
                                          const topicFound = findTopicData(dayData.topic);
                                          console.log('🔍 Topic found for button:', dayData.topic, 'Result:', topicFound);
                                          return topicFound;
                                        })() && (
                                          <button
                                            style={{
                                              backgroundColor: accent,
                                              color: 'white',
                                              border: 'none',
                                              borderRadius: '8px',
                                              padding: '10px 20px',
                                              fontSize: '14px',
                                              fontWeight: '600',
                                              cursor: 'pointer',
                                              transition: 'all 0.2s ease',
                                              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                            }}
                                            onClick={() => {
                                              console.log('🔍 View Details button clicked for topic:', dayData.topic);
                                              navigateToTopic(dayData.topic);
                                            }}
                                            onMouseEnter={(e) => {
                                              e.target.style.transform = 'translateY(-2px)';
                                              e.target.style.boxShadow = '0 4px 12px rgba(0,0,0,0.2)';
                                            }}
                                            onMouseLeave={(e) => {
                                              e.target.style.transform = 'translateY(0)';
                                              e.target.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)';
                                            }}
                                          >
                                            📖 View Details
                                          </button>
                                        )}
                                      </div>
                                    </ErrorBoundary>
                                  )}
                                </React.Fragment>
                              </ErrorBoundary>
                            );
                          })}
                        </div>
                      </div>
                    </ErrorBoundary>
                  ));
                })()}
              </div>
            </div>
          </>
        )}
      </div>
    </ErrorBoundary>
  );
};

export default CustomisedWeeklyPlan;

