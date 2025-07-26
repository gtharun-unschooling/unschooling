import { useState, useEffect } from "react";
import { db, auth } from "../../firebase";
import { doc, setDoc, getDoc, updateDoc, collection, getDocs } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { useNavigate } from "react-router-dom";
import { colors, spacing, typography } from "../../styles/designTokens";
import "./ProfileForm.css";
import BackButton from "../BackButton";
import apiService from "../../services/api";
import { useDebug } from "../../contexts/DebugContext";

// Load data files
let topicsData = null;
let nichesData = null;

// Function to load data files
const loadDataFiles = async () => {
  try {
    // Load topics data
    const topicsResponse = await fetch('/topicsdata.json');
    if (topicsResponse.ok) {
      topicsData = await topicsResponse.json();
    }
    
    // Load niches data
    const nichesResponse = await fetch('/nichesdata.json');
    if (nichesResponse.ok) {
      nichesData = await nichesResponse.json();
    }
  } catch (error) {
    console.warn('Could not load data files:', error);
  }
};

// Enhanced plan generation with data access
const generateEnhancedPlan = (profile) => {
  console.log('🎯 ===== ENHANCED PLAN GENERATION STARTED =====');
  console.log('👤 PROFILE FOR ENHANCED PLAN:', JSON.stringify(profile, null, 2));
  
  const child_age = profile.child_age;
  const interests = profile.interests;
  const learning_style = profile.preferred_learning_style;
  const goals = profile.goals;
  
  console.log('📊 ENHANCED PLAN PARAMETERS:');
  console.log('   Child Age:', child_age);
  console.log('   Interests:', interests);
  console.log('   Learning Style:', learning_style);
  console.log('   Goals:', goals);
  console.log('   Topics Data Available:', topicsData ? `${topicsData.length} topics` : 'No data');
  console.log('   Niches Data Available:', nichesData ? `${nichesData.length} niches` : 'No data');
  
  // Find matching topics from the data
  let matched_topics = [];
  if (topicsData && interests.length > 0) {
    console.log('🔍 ENHANCED PLAN - SEARCHING FOR MATCHING TOPICS...');
    console.log('   Available niches in topics data:', [...new Set(topicsData.map(t => t.Niche))]);
    console.log('   Looking for interests:', interests);
    
    for (const topic of topicsData) {
      if (interests.includes(topic.Niche)) {
        // Simple age matching
        const age_range = topic.Age || "";
        const age_match = age_range.includes(String(child_age)) || age_range.includes("5-12") || age_range.includes("3 and 4");
        
        console.log(`   Checking: "${topic.Topic}" (Niche: ${topic.Niche}, Age: ${age_range})`);
        console.log(`     Interest match: ${interests.includes(topic.Niche) ? '✅' : '❌'}`);
        console.log(`     Age match: ${age_match ? '✅' : '❌'}`);
        
        if (age_match) {
          matched_topics.push(topic);
          console.log(`   ✅ ENHANCED PLAN SELECTED: "${topic.Topic}" for ${topic.Niche}`);
          if (matched_topics.length >= 4) {
            console.log('   📋 Reached maximum of 4 topics, stopping search');
            break;
          }
        }
      }
    }
    console.log(`📋 ENHANCED PLAN TOTAL MATCHED TOPICS: ${matched_topics.length}`);
    console.log('   Selected topics:', matched_topics.map(t => `${t.Topic} (${t.Niche})`));
  }
  
  // If no matches found, create generic topics
  if (matched_topics.length === 0) {
    console.log('⚠️ ENHANCED PLAN - NO MATCHES FOUND, CREATING GENERIC TOPICS');
    matched_topics = interests.map(interest => ({
      Topic: `Introduction to ${interest}`,
      Niche: interest,
      Age: `${child_age}-${child_age + 2}`,
      Objective: `Learn the basics of ${interest} through fun activities`,
      "Activity 1": `Explore ${interest} through hands-on activities`,
      "Activity 2": `Create a project related to ${interest}`
    }));
    console.log('   Created generic topics:', matched_topics.map(t => t.Topic));
  }
  
  // Create weekly plan based on matched topics
  console.log('📅 ENHANCED PLAN - CREATING WEEKLY PLAN...');
  const weekly_plan = {};
  const days = ["monday", "tuesday", "wednesday", "thursday", "friday"];
  
  for (let week = 1; week <= 4; week++) {
    const week_plan = {};
    days.forEach((day, index) => {
      const topic = matched_topics[index % matched_topics.length];
      week_plan[day] = {
        topic: topic.Topic,
        niche: topic.Niche,
        objective: topic.Objective || `Learn about ${topic.Topic}`,
        activity_1: topic["Activity 1"] || `Explore ${topic.Topic} through hands-on activities`,
        activity_2: topic["Activity 2"] || `Create a project related to ${topic.Topic}`,
        learning_style: learning_style,
        estimated_time: topic["Estimated Time"] || "30 mins"
      };
    });
    weekly_plan[`week_${week}`] = week_plan;
    console.log(`   Week ${week} created with ${days.length} days`);
  }
  
  const result = {
    child_profile: {
      age: child_age,
      interests: interests,
      learning_style: learning_style,
      goals: goals
    },
    matched_topics: matched_topics,
    weekly_plan: weekly_plan,
    learning_objectives: matched_topics.map(topic => topic.Objective || `Develop skills in ${topic.Niche}`).slice(0, 4),
    recommended_activities: [
      `Interactive ${interests[0] || 'learning'} games`,
      "Creative projects and crafts",
      "Outdoor exploration activities",
      "Reading and storytelling sessions"
    ],
    progress_tracking: {
      weekly_checkpoints: ["Week 1", "Week 2", "Week 3", "Week 4"],
      milestones: ["Basic understanding", "Skill development", "Confidence building", "Mastery achievement"]
    }
  };
  
  console.log('🎉 ===== ENHANCED PLAN GENERATION COMPLETED =====');
  console.log('📤 ENHANCED PLAN RESULT:', JSON.stringify(result, null, 2));
  console.log('🎯 ===== ENHANCED PLAN END =====');
  
  return result;
};

// Original interest options (reduced to 25 for better UX)
const interestOptions = [
  "Finance", "Communication", "AI", "Entrepreneurship", "Dance", "Music", 
  "Nature Exploration", "Travel", "Coding & Programming", "Civics & Government",
  "History", "Fashion & Styling", "Arts & Crafts", "Behavioral Science", "General Science",
  "Sports", "Design Thinking & Creativity", "Photography & Videography", "Trading & Investments",
  "Games & Recreational Skills", "Mathematics", "Creative & Academic Writing", "Social Media Literacy",
  "Educational Apps", "Teaching & Pedagogy"
];

const learningStyles = [
  { id: "hands-on", label: "Hands-on Learning", icon: "🔧", color: "#FF6B6B" },
  { id: "visual", label: "Visual Learning", icon: "👁️", color: "#4ECDC4" },
  { id: "auditory", label: "Auditory Learning", icon: "🎧", color: "#45B7D1" },
  { id: "reading", label: "Reading & Writing", icon: "📚", color: "#96CEB4" },
  { id: "mixed", label: "Mixed Approach", icon: "🌈", color: "#FFEAA7" }
];

const goals = [
  { id: "confidence", label: "Build Confidence", icon: "💪", color: "#FF6B6B" },
  { id: "real-world", label: "Real-world Skills", icon: "🌍", color: "#4ECDC4" },
  { id: "creativity", label: "Creativity", icon: "🎨", color: "#45B7D1" },
  { id: "focus", label: "Focus & Attention", icon: "🎯", color: "#96CEB4" },
  { id: "curiosity", label: "Curiosity", icon: "🔍", color: "#FFEAA7" },
  { id: "problem-solving", label: "Problem Solving", icon: "🧩", color: "#DDA0DD" }
];

const PLAN_TYPES = [
  {
    id: 'hybrid',
    name: 'Hybrid Monthly Plan',
    description: 'Each week is different: themes, skills, and a real-world project. Great for variety and deep dives.'
  },
  {
    id: 'fusion',
    name: 'Holistic Fusion Plan',
    description: 'Every week follows the same balanced routine. Great for consistency and all-round growth.'
  }
];

export default function ProfileForm({ onSubmit }) {
  const [user] = useAuthState(auth);
  const [childAge, setChildAge] = useState(5);
  const [interests, setInterests] = useState([]);
  const [dislikes, setDislikes] = useState([]);
  const [learningStyle, setLearningStyle] = useState("");
  const [selectedGoals, setSelectedGoals] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [showUpdateMessage, setShowUpdateMessage] = useState(false); // NEW
  const navigate = useNavigate();
  const [originalProfile, setOriginalProfile] = useState(null);
  const [hasChanges, setHasChanges] = useState(false);
  const [childName, setChildName] = useState("");
  const { debugInfo, addDebugInfo } = useDebug();
  const [planType, setPlanType] = useState('hybrid');
  
  // Child management state
  const [children, setChildren] = useState([]);
  const [selectedChild, setSelectedChild] = useState(null);
  const [isAddingNewChild, setIsAddingNewChild] = useState(false);
  const [currentChildIndex, setCurrentChildIndex] = useState(0);

  // Load children on mount and data files
  useEffect(() => {
    if (!user) return;
    // Save user email at user doc level
    const userRef = doc(db, "users", user.uid);
    setDoc(userRef, { user_email: user.email }, { merge: true });
    // Load data files for enhanced plan generation
    loadDataFiles();
    // Load existing children
    loadChildren();
  }, [user]);

  // Load existing children from Firebase
  const loadChildren = async () => {
    if (!user) return;
    
    try {
      const childrenRef = collection(db, `users/${user.uid}/children`);
      const childrenSnapshot = await getDocs(childrenRef);
      const childrenList = [];
      
      childrenSnapshot.forEach((doc) => {
        childrenList.push({
          id: doc.id,
          name: doc.id,
          ...doc.data()
        });
      });
      
      setChildren(childrenList);
      console.log('Loaded children:', childrenList);
      
      // If there are children, select the first one by default
      if (childrenList.length > 0) {
        selectChild(childrenList[0], 0);
      }
    } catch (error) {
      console.error('Error loading children:', error);
    }
  };

  // Select a child to edit
  const selectChild = (child, index) => {
    setSelectedChild(child);
    setCurrentChildIndex(index);
    setChildName(child.name);
    setChildAge(child.child_age || 5);
    setInterests(child.interests || []);
    setDislikes(child.dislikes || []);
    setLearningStyle(child.preferred_learning_style || "");
    setSelectedGoals(child.goals || []);
    setPlanType(child.plan_type || 'hybrid'); // Load plan type
    setOriginalProfile(child);
    setHasChanges(false);
    setIsAddingNewChild(false);
  };

  // Navigate to next child
  const nextChild = () => {
    if (currentChildIndex < children.length - 1) {
      const nextIndex = currentChildIndex + 1;
      selectChild(children[nextIndex], nextIndex);
    }
  };

  // Navigate to previous child
  const prevChild = () => {
    if (currentChildIndex > 0) {
      const prevIndex = currentChildIndex - 1;
      selectChild(children[prevIndex], prevIndex);
    }
  };

  // Add a new child
  const addNewChild = () => {
    setIsAddingNewChild(true);
    setSelectedChild(null);
    setCurrentChildIndex(-1);
    setChildName("");
    setChildAge(5);
    setInterests([]);
    setDislikes([]);
    setLearningStyle("");
    setSelectedGoals([]);
    setPlanType('hybrid'); // Reset plan type for new child
    setOriginalProfile(null);
    setHasChanges(false);
  };

  // Cancel adding new child
  const cancelAddChild = () => {
    if (children.length > 0) {
      // If there are children, select the first one
      selectChild(children[0], 0);
    } else {
      setIsAddingNewChild(false);
    }
  };

  // Track changes
  useEffect(() => {
    if (!originalProfile) {
      setHasChanges(
        childAge !== 5 ||
        interests.length > 0 ||
        dislikes.length > 0 ||
        learningStyle !== "" ||
        selectedGoals.length > 0 ||
        planType !== 'hybrid' // Check if plan type changed
      );
      // Hide update message if any change
      setShowUpdateMessage(false);
      return;
    }
    const changed =
      childAge !== originalProfile.child_age ||
      JSON.stringify(interests) !== JSON.stringify(originalProfile.interests) ||
      JSON.stringify(dislikes) !== JSON.stringify(originalProfile.dislikes) ||
      learningStyle !== originalProfile.preferred_learning_style ||
      JSON.stringify(selectedGoals) !== JSON.stringify(originalProfile.goals) ||
      planType !== originalProfile.plan_type; // Check if plan type changed
    setHasChanges(changed);
    // Hide update message if any change
    if (changed) setShowUpdateMessage(false);
  }, [childAge, interests, dislikes, learningStyle, selectedGoals, originalProfile, planType]);

  // Cancel changes
  const handleCancel = () => {
    if (isAddingNewChild) {
      cancelAddChild();
      return;
    }
    
    if (!originalProfile) {
      setChildAge(5);
      setInterests([]);
      setDislikes([]);
      setLearningStyle("");
      setSelectedGoals([]);
      setPlanType('hybrid'); // Reset plan type on cancel
    } else {
      setChildAge(originalProfile.child_age);
      setInterests(originalProfile.interests);
      setDislikes(originalProfile.dislikes);
      setLearningStyle(originalProfile.preferred_learning_style);
      setSelectedGoals(originalProfile.goals);
      setPlanType(originalProfile.plan_type); // Reset plan type on cancel
    }
  };

  const toggleArrayItem = (value, array, setArray) => {
    setArray(array.includes(value) ? array.filter((v) => v !== value) : [...array, value]);
  };

  const handleSubmit = async () => {
    if (!user) {
      console.error("User not authenticated");
      return;
    }
    if (!childName.trim()) {
      alert("Child name is required.");
      return;
    }
    
    addDebugInfo("🎯 PROFILE SUBMISSION STARTED");
    addDebugInfo(`👤 User: ${user.email}`);
    addDebugInfo(`📝 Child Name: ${childName}`);
    addDebugInfo(`📝 Child Age: ${childAge}`);
    addDebugInfo(`📝 Interests: ${interests.join(', ')}`);
    addDebugInfo(`📝 Learning Style: ${learningStyle}`);
    addDebugInfo(`📝 Goals: ${selectedGoals.join(', ')}`);
    addDebugInfo(`📝 Plan Type: ${planType}`);
    
    console.log('🎯 ===== PROFILE SUBMISSION STARTED =====');
    console.log('👤 USER:', user.email);
    console.log('📝 FORM DATA:');
    console.log('   Child Name:', childName);
    console.log('   Child Age:', childAge);
    console.log('   Interests:', interests);
    console.log('   Dislikes:', dislikes);
    console.log('   Learning Style:', learningStyle);
    console.log('   Goals:', selectedGoals);
    console.log('   Plan Type:', planType);
    
    setIsLoading(true);
    
    const profile = {
      child_name: childName,
      child_age: childAge,
      interests,
      dislikes,
      preferred_learning_style: learningStyle,
      goals: selectedGoals,
      plan_type: planType
    };

    addDebugInfo(`📤 Profile object created with ${interests.length} interests`);
    console.log('📤 PROFILE OBJECT CREATED:', JSON.stringify(profile, null, 2));

    try {
      // Save user email at user doc level
      const userRef = doc(db, "users", user.uid);
      await setDoc(userRef, { user_email: user.email }, { merge: true });
      console.log('✅ User email saved to Firebase');
      
      // Save child profile under users/{user_uid}/children/{child_name}
      const childRef = doc(collection(db, `users/${user.uid}/children`), childName);
      await setDoc(childRef, profile, { merge: true });
      console.log('✅ Child profile saved to Firebase');
      
      // Initialize months array if it doesn't exist
      const childSnap = await getDoc(childRef);
      let existingData = childSnap.exists() ? childSnap.data() : {};
      let months = existingData.months || [];
      
      // Add current month if not already present
      const currentDate = new Date();
      const monthYear = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' }).replace(/ /g, '');
      
      if (!months.includes(monthYear)) {
        months.push(monthYear);
        await setDoc(childRef, { months: months }, { merge: true });
        console.log('✅ Months column updated:', months);
      }
      
      setOriginalProfile(profile); // update originalProfile after save
      setHasChanges(false);
      // If this is an update (not first time), show update message
      if (originalProfile) {
        setShowUpdateMessage(true); // persistent until next change
      }

      // Only show the plan modal if it's a new profile (no originalProfile)
      if (!originalProfile) {
        addDebugInfo("🔄 GENERATING PLAN FOR NEW PROFILE");
        console.log('🔄 GENERATING PLAN FOR NEW PROFILE...');
        try {
          // Send to backend
          addDebugInfo("📡 CALLING API SERVICE...");
          console.log('📡 CALLING API SERVICE...');
          const res = await apiService.generatePlan(profile);
          addDebugInfo(`📥 API RESPONSE RECEIVED: ${res.success ? 'SUCCESS' : 'FAILED'}`);
          console.log('📥 API RESPONSE RECEIVED:', res);
          
          if (res.success) {
            console.log('✅ PLAN GENERATION SUCCESSFUL');
            // Save plan to Firestore under 'plans' field keyed by month
            const currentDate = new Date();
            const monthYear = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' }).replace(/ /g, ''); // e.g., July2025
            // Get existing plans (if any)
            const snap = await getDoc(childRef);
            let existingPlans = {};
            let existingData = snap.exists() ? snap.data() : {};
            if (existingData.plans) {
              existingPlans = existingData.plans;
            }
            const newPlans = { ...existingPlans, [monthYear]: res.data };
            
            // Update months array
            let months = existingData.months || [];
            if (!months.includes(monthYear)) {
              months.push(monthYear);
            }
            
            await setDoc(childRef, { 
              plans: newPlans,
              months: months
            }, { merge: true });
            console.log('✅ Plan and months saved to Firebase');
            
            // Update children list if this is a new child
            if (isAddingNewChild) {
              await loadChildren();
            }
            
            setShowSuccessMessage(true);
            // Navigate after showing success message
            setTimeout(() => {
              console.log('🚀 NAVIGATING TO PLAN PAGE...');
              navigate("/customised-weekly-plan", { 
                state: { 
                  data: res.data, 
                  childName,
                  childMonths: months
                } 
              });
            }, 3000);
          } else {
            throw new Error(res.message || "Failed to generate plan");
          }

          if (onSubmit) onSubmit(res);
        } catch (err) {
          addDebugInfo(`❌ ERROR CALLING BACKEND: ${err.message}`);
          console.error("❌ ERROR CALLING BACKEND:", err);
          
          // Create an enhanced plan using the data files
          addDebugInfo("🔄 FALLING BACK TO ENHANCED PLAN GENERATION");
          console.log('🔄 FALLING BACK TO ENHANCED PLAN GENERATION...');
          const enhancedPlan = generateEnhancedPlan(profile);
          addDebugInfo("✅ ENHANCED PLAN GENERATED");
          console.log('✅ ENHANCED PLAN GENERATED:', enhancedPlan);

          // Save enhanced plan to Firestore
          const currentDate = new Date();
          const monthYear = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' }).replace(/ /g, '');
          const snap = await getDoc(childRef);
          let existingPlans = {};
          let existingData = snap.exists() ? snap.data() : {};
          if (existingData.plans) {
            existingPlans = existingData.plans;
          }
          const newPlans = { ...existingPlans, [monthYear]: enhancedPlan };
          
          // Update months array
          let months = existingData.months || [];
          if (!months.includes(monthYear)) {
            months.push(monthYear);
          }
          
          await setDoc(childRef, { 
            plans: newPlans,
            months: months
          }, { merge: true });
          console.log('✅ Enhanced plan and months saved to Firebase');
          
          // Update children list if this is a new child
          if (isAddingNewChild) {
            await loadChildren();
          }
          
          setShowSuccessMessage(true);
          setTimeout(() => {
            console.log('🚀 NAVIGATING TO PLAN PAGE (ENHANCED)...');
            navigate("/customised-weekly-plan", { 
              state: { 
                data: enhancedPlan, 
                childName,
                childMonths: months
              } 
            });
          }, 3000);
        }
      }
    } catch (err) {
      console.error("❌ ERROR SUBMITTING PROFILE:", err);
      alert("Failed to generate plan. Please try again.");
    } finally {
      setIsLoading(false);
      console.log('🎯 ===== PROFILE SUBMISSION COMPLETED =====');
    }
  };

  // Update the child name button style function:
  const getChildButtonStyle = (isSelected) => ({
    background: isSelected ? '#4ECDC4' : '#f3f0fa',
    color: isSelected ? '#fff' : '#264653',
    border: isSelected ? '2px solid #264653' : '1px solid #bdbdbd',
    borderRadius: '8px',
    padding: '8px 18px',
    margin: '0 6px',
    fontWeight: 600,
    fontSize: '1rem',
    cursor: 'pointer',
    boxShadow: isSelected ? '0 2px 8px #4ECDC440' : 'none',
    transition: 'all 0.2s',
    outline: isSelected ? '2px solid #6a4c93' : 'none',
    letterSpacing: '0.5px',
    minWidth: 80,
  });

  // Inline Child Selector Component
  const InlineChildSelector = () => {
    if (children.length === 0 && !isAddingNewChild) return null;
    
    return (
      <div style={{
        marginBottom: spacing.xl,
        padding: spacing.lg,
        background: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '16px',
        border: '1px solid rgba(255, 255, 255, 0.2)',
        backdropFilter: 'blur(10px)',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: spacing.md,
        }}>
          <h3 style={{
            fontSize: '1.2rem',
            fontWeight: 600,
            color: 'white',
            margin: 0,
          }}>
            {isAddingNewChild ? '➕ Adding New Child' : `👶 ${selectedChild?.name || 'Select Child'}`}
          </h3>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
            {/* Compact child names */}
            {children.length > 0 && !isAddingNewChild && (
              <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm }}>
                {children.map((child, idx) => (
                  <button
                    key={child.name}
                    style={getChildButtonStyle(selectedChild && selectedChild.name === child.name)}
                    onClick={() => selectChild(child, idx)}
                  >
                    {child.name}
                  </button>
                ))}
              </div>
            )}
            
            <button
              onClick={addNewChild}
              style={{
                padding: `${spacing.sm} ${spacing.md}`,
                background: 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)',
                border: 'none',
                borderRadius: '8px',
                color: 'white',
                cursor: 'pointer',
                fontSize: '0.9rem',
                fontWeight: 600,
                transition: 'all 0.3s ease',
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-1px)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
              }}
            >
              ➕ Add Child
            </button>
          </div>
        </div>
        
        {/* Show current child's selections */}
        {selectedChild && !isAddingNewChild && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: spacing.md,
            marginTop: spacing.md,
          }}>
            <div style={{ color: 'white', fontSize: '0.9rem' }}>
              <strong>Age:</strong> {selectedChild.child_age || 'Not set'} years
            </div>
            <div style={{ color: 'white', fontSize: '0.9rem' }}>
              <strong>Interests:</strong> {selectedChild.interests?.length || 0} selected
            </div>
            <div style={{ color: 'white', fontSize: '0.9rem' }}>
              <strong>Learning Style:</strong> {selectedChild.preferred_learning_style || 'Not set'}
            </div>
            <div style={{ color: 'white', fontSize: '0.9rem' }}>
              <strong>Goals:</strong> {selectedChild.goals?.length || 0} selected
            </div>
            <div style={{ color: 'white', fontSize: '0.9rem' }}>
              <strong>Plan Type:</strong> {selectedChild.plan_type || 'Not set'}
            </div>
          </div>
        )}
        
        {/* Cancel button for new child */}
        {isAddingNewChild && (
          <button
            onClick={cancelAddChild}
            style={{
              marginTop: spacing.md,
              padding: `${spacing.sm} ${spacing.md}`,
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(255, 255, 255, 0.3)',
              borderRadius: '8px',
              color: 'white',
              cursor: 'pointer',
              fontSize: '0.9rem',
              transition: 'all 0.3s ease',
            }}
          >
            ❌ Cancel Adding New Child
          </button>
        )}
      </div>
    );
  };

  // Container styles
  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: `${spacing.xl} 0`,
    fontFamily: typography.fontFamily.primary,
  };

  const cardStyle = {
    maxWidth: '900px',
    margin: '0 auto',
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: spacing.xl,
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  };

  const titleStyle = {
    fontSize: '2.5rem',
    fontWeight: 800,
    textAlign: 'center',
    marginBottom: spacing.lg,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  };

  const subtitleStyle = {
    fontSize: '1.1rem',
    textAlign: 'center',
    color: colors.text.secondary,
    marginBottom: spacing['2xl'],
    lineHeight: 1.6,
  };

  const sectionStyle = {
    marginBottom: spacing['2xl'],
    padding: spacing.lg,
    background: 'rgba(255, 255, 255, 0.5)',
    borderRadius: '16px',
    border: '1px solid rgba(255, 255, 255, 0.3)',
  };

  const sectionTitleStyle = {
    fontSize: '1.5rem',
    fontWeight: 700,
    marginBottom: spacing.md,
    color: colors.text.primary,
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
  };

  const labelStyle = {
    fontSize: '1rem',
    fontWeight: 600,
    color: colors.text.primary,
    marginBottom: spacing.sm,
  };

  // Age slider styles
  const sliderContainerStyle = {
    padding: spacing.lg,
    background: 'linear-gradient(135deg, #FF6B6B 0%, #FFE66D 100%)',
    borderRadius: '12px',
    textAlign: 'center',
  };

  const ageDisplayStyle = {
    fontSize: '3rem',
    fontWeight: 800,
    color: 'white',
    marginBottom: spacing.sm,
    textShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
  };

  const sliderStyle = {
    width: '100%',
    height: '8px',
    borderRadius: '4px',
    background: 'rgba(255, 255, 255, 0.3)',
    outline: 'none',
    cursor: 'pointer',
  };

  // Scrollable grid styles
  const scrollableGridStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: spacing.sm,
    maxHeight: '200px',
    overflowY: 'auto',
    padding: spacing.sm,
    background: 'rgba(255, 255, 255, 0.3)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  };

  const getInterestButtonStyle = (isSelected) => ({
    padding: `${spacing.sm} ${spacing.md}`,
    borderRadius: '20px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 600,
    transition: 'all 0.3s ease',
    background: isSelected 
      ? 'linear-gradient(135deg, #4ECDC4 0%, #44A08D 100%)'
      : 'rgba(255, 255, 255, 0.8)',
    color: isSelected ? 'white' : colors.text.primary,
    boxShadow: isSelected 
      ? '0 4px 15px rgba(78, 205, 196, 0.4)'
      : '0 2px 8px rgba(0, 0, 0, 0.1)',
    transform: isSelected ? 'scale(1.05)' : 'scale(1)',
  });

  const getDislikeButtonStyle = (isSelected) => ({
    padding: `${spacing.sm} ${spacing.md}`,
    borderRadius: '20px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: 600,
    transition: 'all 0.3s ease',
    background: isSelected 
      ? 'linear-gradient(135deg, #FF6B6B 0%, #EE5A52 100%)'
      : 'rgba(255, 255, 255, 0.8)',
    color: isSelected ? 'white' : colors.text.primary,
    boxShadow: isSelected 
      ? '0 4px 15px rgba(255, 107, 107, 0.4)'
      : '0 2px 8px rgba(0, 0, 0, 0.1)',
    transform: isSelected ? 'scale(1.05)' : 'scale(1)',
  });

  const learningStyleGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: spacing.md,
    marginTop: spacing.md,
  };

  const getLearningStyleButtonStyle = (style, isSelected) => ({
    padding: spacing.lg,
    borderRadius: '16px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 600,
    transition: 'all 0.3s ease',
    background: isSelected 
      ? style.color
      : 'rgba(255, 255, 255, 0.8)',
    color: isSelected ? 'white' : colors.text.primary,
    boxShadow: isSelected 
      ? `0 8px 25px ${style.color}40`
      : '0 4px 15px rgba(0, 0, 0, 0.1)',
    transform: isSelected ? 'scale(1.02)' : 'scale(1)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: spacing.sm,
  });

  const getGoalButtonStyle = (goal, isSelected) => ({
    padding: `${spacing.md} ${spacing.lg}`,
    borderRadius: '16px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1rem',
    fontWeight: 600,
    transition: 'all 0.3s ease',
    background: isSelected 
      ? goal.color
      : 'rgba(255, 255, 255, 0.8)',
    color: isSelected ? 'white' : colors.text.primary,
    boxShadow: isSelected 
      ? `0 8px 25px ${goal.color}40`
      : '0 4px 15px rgba(0, 0, 0, 0.1)',
    transform: isSelected ? 'scale(1.02)' : 'scale(1)',
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
  });

  const submitButtonStyle = {
    width: '100%',
    padding: `${spacing.lg} ${spacing.xl}`,
    fontSize: '1.25rem',
    fontWeight: 700,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '16px',
    cursor: isLoading ? 'not-allowed' : 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
    opacity: isLoading ? 0.7 : 1,
    marginTop: spacing.xl,
  };

  const successMessageStyle = {
    position: 'fixed',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    background: 'rgba(255, 255, 255, 0.98)',
    backdropFilter: 'blur(20px)',
    borderRadius: '20px',
    padding: spacing['2xl'],
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.2)',
    textAlign: 'center',
    zIndex: 1000,
    border: '1px solid rgba(255, 255, 255, 0.3)',
    maxWidth: '500px',
    width: '90%',
  };

  return (
    <div style={containerStyle} className="profile-form-container">
      {/* DebugDisplay component is removed as debug info is now global */}
      <div style={cardStyle} className="profile-form-card profile-form-glass">
        {/* Back button at top left */}
        <div style={{ position: 'relative', minHeight: '40px' }}>
          <div style={{ position: 'absolute', top: 0, left: 0 }}>
            <BackButton />
          </div>
        </div>
        <h1 style={titleStyle} className="profile-form-title profile-form-gradient-text">🌟 Let's Create Your Child's Perfect Learning Journey! 🌟</h1>
        <p style={subtitleStyle} className="profile-form-subtitle">
          Help us understand your child better so we can create a personalized learning experience 
          that matches their unique interests, style, and goals.
        </p>

        {/* Inline Child Selector */}
        <InlineChildSelector />

        {/* Child Name Section */}
        <div style={sectionStyle} className="profile-form-section">
          <h2 style={sectionTitleStyle} className="profile-form-section-title">
            👶 Child Name
          </h2>
          <input
            type="text"
            value={childName}
            onChange={e => setChildName(e.target.value)}
            placeholder="Enter your child's name"
            disabled={selectedChild && !isAddingNewChild} // Disable if editing existing child
            style={{
              width: '100%',
              padding: spacing.md,
              fontSize: '1.1rem',
              borderRadius: '8px',
              border: '1px solid #ccc',
              marginBottom: spacing.lg,
              backgroundColor: selectedChild && !isAddingNewChild ? '#f5f5f5' : 'white',
              color: selectedChild && !isAddingNewChild ? '#666' : 'black',
            }}
            required
          />
          {selectedChild && !isAddingNewChild && (
            <p style={{ 
              fontSize: '0.9rem', 
              color: '#666', 
              fontStyle: 'italic',
              marginTop: spacing.sm 
            }}>
              Child name cannot be changed once created. Create a new child profile to use a different name.
            </p>
          )}
        </div>

        {/* Age Section */}
        <div style={sectionStyle} className="profile-form-section">
          <h2 style={sectionTitleStyle} className="profile-form-section-title">
            🎂 How old is your child?
          </h2>
          <div style={sliderContainerStyle}>
            <div style={ageDisplayStyle} className="profile-form-age-display">{childAge} years</div>
            <input
              type="range"
              min="2"
              max="18"
              value={childAge}
              onChange={(e) => setChildAge(parseInt(e.target.value))}
              style={sliderStyle}
              className="profile-form-slider"
            />
            <p style={{ color: 'white', marginTop: spacing.sm, fontWeight: 600 }}>
              Slide to adjust age
            </p>
          </div>
        </div>

          {/* Interests Section */}
          <div style={sectionStyle} className="profile-form-section">
            <h2 style={sectionTitleStyle} className="profile-form-section-title">
              ❤️ What does your child love to do?
            </h2>
            <p style={labelStyle}>Select all the activities that interest your child:</p>
            <div style={scrollableGridStyle} className="profile-form-scrollable">
              {interestOptions.map((interest) => {
                const isSelected = interests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    style={getInterestButtonStyle(isSelected)}
                    className="profile-form-button profile-form-transition"
                    onClick={() => toggleArrayItem(interest, interests, setInterests)}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dislikes Section */}
          <div style={sectionStyle} className="profile-form-section">
            <h2 style={sectionTitleStyle} className="profile-form-section-title">
              😔 What does your child avoid or dislike?
            </h2>
            <p style={labelStyle}>Select things your child tends to avoid:</p>
            <div style={scrollableGridStyle} className="profile-form-scrollable">
              {interestOptions.map((interest) => {
                const isSelected = dislikes.includes(interest);
                return (
                  <button
                    key={interest + "-dislike"}
                    type="button"
                    style={getDislikeButtonStyle(isSelected)}
                    className="profile-form-button profile-form-transition"
                    onClick={() => toggleArrayItem(interest, dislikes, setDislikes)}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Learning Style Section */}
          <div style={sectionStyle} className="profile-form-section">
            <h2 style={sectionTitleStyle} className="profile-form-section-title">
              🎯 How does your child learn best?
            </h2>
            <p style={labelStyle}>Click on the learning style that best describes your child:</p>
            <div style={learningStyleGridStyle} className="profile-form-learning-grid">
              {learningStyles.map((style) => {
                const isSelected = learningStyle === style.id;
                return (
                  <button
                    key={style.id}
                    type="button"
                    style={getLearningStyleButtonStyle(style, isSelected)}
                    className="profile-form-button profile-form-transition"
                    onClick={() => setLearningStyle(style.id)}
                  >
                    <span style={{ fontSize: '2rem' }}>{style.icon}</span>
                    <span>{style.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Goals Section */}
          <div style={sectionStyle} className="profile-form-section">
            <h2 style={sectionTitleStyle} className="profile-form-section-title">
              🎯 What are your main learning goals?
            </h2>
            <p style={labelStyle}>Select the goals that matter most to you:</p>
            <div style={learningStyleGridStyle} className="profile-form-learning-grid">
              {goals.map((goal) => {
                const isSelected = selectedGoals.includes(goal.id);
                return (
                  <button
                    key={goal.id}
                    type="button"
                    style={getGoalButtonStyle(goal, isSelected)}
                    className="profile-form-button profile-form-transition"
                    onClick={() => toggleArrayItem(goal.id, selectedGoals, setSelectedGoals)}
                  >
                    <span style={{ fontSize: '1.5rem' }}>{goal.icon}</span>
                    <span>{goal.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Plan Type Selection Section */}
          <div style={{ margin: '32px 0', padding: '20px', background: '#f8f9fa', borderRadius: '10px', border: '2px solid #6a4c93' }}>
            <h2 style={{ color: '#6a4c93', marginBottom: 12 }}>Choose Your Plan Type</h2>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
              {PLAN_TYPES.map(type => (
                <div key={type.id} style={{ flex: 1, minWidth: 220, background: planType === type.id ? '#e0e7ff' : 'white', border: planType === type.id ? '2px solid #6a4c93' : '1px solid #ddd', borderRadius: 8, padding: 16, cursor: 'pointer', boxShadow: planType === type.id ? '0 2px 8px #6a4c9340' : 'none', transition: 'all 0.2s' }} onClick={() => setPlanType(type.id)}>
                  <input type="radio" id={type.id} name="planType" value={type.id} checked={planType === type.id} onChange={() => setPlanType(type.id)} style={{ marginRight: 8 }} />
                  <label htmlFor={type.id} style={{ fontWeight: 'bold', fontSize: 17, color: '#264653' }}>{type.name}</label>
                  <div style={{ margin: '8px 0', color: '#555', fontSize: 14 }}>{type.description}</div>
                </div>
              ))}
            </div>
            <div style={{ marginTop: 18, background: '#f3f0fa', borderRadius: 8, padding: 12, fontSize: 15 }}>
              <strong>Quick Comparison:</strong>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 8 }}>
                <thead>
                  <tr style={{ background: '#e0e7ff', fontSize: 14 }}>
                    <th style={{ padding: 6, border: '1px solid #ddd' }}></th>
                    <th style={{ padding: 6, border: '1px solid #ddd' }}>Hybrid</th>
                    <th style={{ padding: 6, border: '1px solid #ddd' }}>Fusion</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td style={{ padding: 6, border: '1px solid #ddd' }}>Weekly Flow</td><td style={{ padding: 6, border: '1px solid #ddd' }}>Different each week</td><td style={{ padding: 6, border: '1px solid #ddd' }}>Same every week</td></tr>
                  <tr><td style={{ padding: 6, border: '1px solid #ddd' }}>Best For</td><td style={{ padding: 6, border: '1px solid #ddd' }}>Variety, projects</td><td style={{ padding: 6, border: '1px solid #ddd' }}>Routine, balance</td></tr>
                  <tr><td style={{ padding: 6, border: '1px solid #ddd' }}>Parent Effort</td><td style={{ padding: 6, border: '1px solid #ddd' }}>More planning</td><td style={{ padding: 6, border: '1px solid #ddd' }}>Easy to follow</td></tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Show persistent update confirmation message just above the buttons */}
          {showUpdateMessage && (
            <div style={{
              background: '#e6ffe6',
              color: '#267326',
              border: '1px solid #b3ffb3',
              borderRadius: '12px',
              padding: '1rem',
              marginBottom: '1.5rem',
              textAlign: 'center',
              fontWeight: 600,
              fontSize: '1.1rem',
            }}>
              Your child profile has been updated.
            </div>
          )}

          {/* Submit/Update and Cancel Buttons */}
          <div style={{ display: 'flex', gap: spacing.lg, marginTop: spacing.xl }}>
            <button
              style={{ ...submitButtonStyle, flex: 1, opacity: hasChanges ? 1 : 0.6, cursor: hasChanges ? 'pointer' : 'not-allowed' }}
              className={`profile-form-button profile-form-transition ${isLoading ? 'profile-form-loading' : ''}`}
              onClick={handleSubmit}
              disabled={isLoading || !hasChanges}
            >
              {isAddingNewChild 
                ? (isLoading ? '⏳ Creating Plan...' : '🚀 Create My Child\'s Plan!')
                : originalProfile 
                  ? (isLoading ? '⏳ Updating...' : '💾 Update Profile') 
                  : (isLoading ? '⏳ Creating Your Plan...' : '🚀 Generate My Child\'s Perfect Plan!')
              }
            </button>
            {hasChanges && (
              <button
                style={{ ...submitButtonStyle, background: '#eee', color: '#764ba2', flex: 1, boxShadow: 'none', border: '1px solid #764ba2' }}
                onClick={handleCancel}
                disabled={isLoading}
                type="button"
              >
                Cancel
              </button>
            )}
          </div>
        </div>

      {/* Success Message Modal */}
      {showSuccessMessage && (
        <div style={successMessageStyle}>
          <div style={{ fontSize: '4rem', marginBottom: spacing.md }}>🎉</div>
          <h2 style={{ 
            fontSize: '1.8rem', 
            fontWeight: 700, 
            marginBottom: spacing.md,
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            Your Child's Plan is Ready!
          </h2>
          <p style={{ 
            fontSize: '1.1rem', 
            color: colors.text.secondary, 
            marginBottom: spacing.lg,
            lineHeight: 1.6 
          }}>
            We've successfully created a personalized learning plan for your child. 
            You'll be redirected to your monthly plan in a few seconds...
          </p>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            gap: spacing.sm,
            fontSize: '1rem',
            color: colors.text.secondary 
          }}>
            <div style={{ 
              width: '20px', 
              height: '20px', 
              border: '2px solid #667eea', 
              borderTop: '2px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            Redirecting to your plan...
          </div>
        </div>
      )}
      <div style={{ marginTop: 32, textAlign: 'center' }}>
        <button
          type="button"
          disabled={!selectedChild || !selectedChild.plans || Object.keys(selectedChild.plans).length === 0}
          style={{
            background: (!selectedChild || !selectedChild.plans || Object.keys(selectedChild.plans).length === 0) ? '#bdbdbd' : '#6a4c93',
            color: 'white',
            border: 'none',
            borderRadius: 8,
            padding: '12px 32px',
            fontSize: '1.1rem',
            fontWeight: 600,
            cursor: (!selectedChild || !selectedChild.plans || Object.keys(selectedChild.plans).length === 0) ? 'not-allowed' : 'pointer',
            opacity: (!selectedChild || !selectedChild.plans || Object.keys(selectedChild.plans).length === 0) ? 0.6 : 1,
            marginTop: 8,
            transition: 'all 0.2s',
          }}
          onClick={() => {
            if (selectedChild && selectedChild.plans && Object.keys(selectedChild.plans).length > 0) {
              // Get the latest month
              const months = Object.keys(selectedChild.plans);
              const latestMonth = months[months.length - 1];
              navigate('/customised-weekly-plan', {
                state: {
                  childName: selectedChild.name,
                  childMonths: months,
                  data: selectedChild.plans[latestMonth],
                }
              });
            }
          }}
        >
          Go to Weekly Plan
        </button>
        <div style={{ fontSize: 13, color: '#888', marginTop: 6 }}>
          {(!selectedChild || !selectedChild.plans || Object.keys(selectedChild.plans).length === 0)
            ? 'Generate a plan first to view the weekly plan.'
            : 'View the latest monthly plan for this child.'}
        </div>
      </div>
    </div>
  );
}
