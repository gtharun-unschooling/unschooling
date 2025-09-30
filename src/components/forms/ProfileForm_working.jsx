import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuth } from '../../contexts/AuthContext';
import apiService from '../../services/apiService';
import './ProfileForm.css';

const ProfileForm = ({ originalProfile = null, onSubmit = null }) => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  
  // Form state
  const [childName, setChildName] = useState(originalProfile?.childName || '');
  const [childAge, setChildAge] = useState(originalProfile?.childAge || '');
  const [interests, setInterests] = useState(originalProfile?.interests || []);
  const [dislikes, setDislikes] = useState(originalProfile?.dislikes || []);
  const [learningStyle, setLearningStyle] = useState(originalProfile?.preferred_learning_style || '');
  const [selectedGoals, setSelectedGoals] = useState(originalProfile?.goals || []);
  const [planType, setPlanType] = useState(originalProfile?.plan_type || 'comprehensive');
  
  // UI state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');
  const [loadingStep, setLoadingStep] = useState('');
  const [showScheduleGenerator, setShowScheduleGenerator] = useState(false);
  const [debugInfo, setDebugInfo] = useState([]);
  
  // Available options
  const interestOptions = [
    'Reading', 'Writing', 'Math', 'Science', 'Art', 'Music', 'Sports', 'Technology',
    'History', 'Geography', 'Languages', 'Cooking', 'Gardening', 'Animals', 'Nature',
    'Building', 'Dancing', 'Acting', 'Photography', 'Coding', 'Robotics', 'Puzzles',
    'Board Games', 'Video Games', 'Crafts', 'Painting', 'Drawing', 'Sculpting'
  ];
  
  const learningStyleOptions = [
    { value: 'visual', label: 'Visual (Pictures, diagrams, videos)' },
    { value: 'auditory', label: 'Auditory (Listening, discussions, music)' },
    { value: 'kinesthetic', label: 'Kinesthetic (Hands-on, movement, experiments)' },
    { value: 'reading_writing', label: 'Reading/Writing (Books, notes, writing)' },
    { value: 'mixed', label: 'Mixed (Combination of all styles)' }
  ];
  
  const goalOptions = [
    'Academic Excellence', 'Creative Expression', 'Physical Fitness', 'Social Skills',
    'Problem Solving', 'Critical Thinking', 'Communication', 'Leadership',
    'Independence', 'Curiosity', 'Confidence', 'Empathy', 'Resilience', 'Time Management'
  ];
  
  const planTypeOptions = [
    { value: 'comprehensive', label: 'Comprehensive (All subjects)' },
    { value: 'focused', label: 'Focused (Specific interests)' },
    { value: 'balanced', label: 'Balanced (Mix of academic and creative)' }
  ];

  // Debug logging function
  const addDebugInfo = (message) => {
    const timestamp = new Date().toLocaleTimeString();
    setDebugInfo(prev => [...prev, `[${timestamp}] ${message}`]);
    console.log(`[${timestamp}] ${message}`);
  };

  // Handle interest selection
  const handleInterestToggle = (interest) => {
    setInterests(prev => 
      prev.includes(interest) 
        ? prev.filter(i => i !== interest)
        : [...prev, interest]
    );
  };

  // Handle dislike selection
  const handleDislikeToggle = (dislike) => {
    setDislikes(prev => 
      prev.includes(dislike) 
        ? prev.filter(d => d !== dislike)
        : [...prev, dislike]
    );
  };

  // Handle goal selection
  const handleGoalToggle = (goal) => {
    setSelectedGoals(prev => 
      prev.includes(goal) 
        ? prev.filter(g => g !== goal)
        : [...prev, goal]
    );
  };

  // Form validation
  const validateForm = () => {
    if (!childName.trim()) {
      setFormError('Please enter your child\'s name');
      return false;
    }
    if (!childAge || childAge < 1 || childAge > 18) {
      setFormError('Please enter a valid age between 1 and 18');
      return false;
    }
    if (interests.length === 0) {
      setFormError('Please select at least one interest');
      return false;
    }
    if (!learningStyle) {
      setFormError('Please select a learning style');
      return false;
    }
    if (selectedGoals.length === 0) {
      setFormError('Please select at least one goal');
      return false;
    }
    return true;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setFormError('');
    setDebugInfo([]);
    
    try {
      addDebugInfo('🚀 STARTING PROFILE SUBMISSION...');
      
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      // Create child document reference
      const childRef = doc(db, 'users', currentUser.uid, 'children', childName.toLowerCase().replace(/\s+/g, '_'));
      
      addDebugInfo('📝 SAVING PROFILE TO FIRESTORE...');
      
      // Prepare profile data
      const profileData = {
        childName: childName.trim(),
        childAge: parseInt(childAge),
        interests: interests,
        dislikes: dislikes,
        preferred_learning_style: learningStyle,
        goals: selectedGoals,
        plan_type: planType,
        createdAt: originalProfile ? originalProfile.createdAt : serverTimestamp(),
        updatedAt: serverTimestamp(),
        parentId: currentUser.uid,
        parentEmail: currentUser.email
      };

      // Save profile to Firestore
      await setDoc(childRef, profileData, { merge: true });
      addDebugInfo('✅ PROFILE SAVED TO FIRESTORE');

      if (!originalProfile) {
        // Show schedule generator instead of navigating away
        setShowScheduleGenerator(true);
        addDebugInfo('✅ Profile saved, showing schedule generator');
      } else {
        setLoadingStep('Generating Plan...');
        addDebugInfo('🔄 PROFILE SUBMISSION STEP: Generating Plan...');
        
        try {
          // Send to backend
          addDebugInfo("📡 CALLING API SERVICE...");
          const res = await apiService.generatePlan({
            child_name: childName,
            child_age: childAge,
            interests: interests,
            dislikes: dislikes,
            preferred_learning_style: learningStyle,
            goals: selectedGoals,
            plan_type: planType
          });
          addDebugInfo(`📥 API RESPONSE RECEIVED: ${res.success ? 'SUCCESS' : 'FAILED'}`);
          
          if (res.success) {
            addDebugInfo('✅ PLAN GENERATION SUCCESSFUL');
            
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
            
            // Sanitize the data to remove any invalid nested entities for Firebase
            const sanitizedPlans = {};
            Object.keys(newPlans).forEach(key => {
              const plan = newPlans[key];
              // Convert to JSON and back to remove any non-serializable objects
              try {
                sanitizedPlans[key] = JSON.parse(JSON.stringify(plan));
              } catch (error) {
                console.error('Error sanitizing plan:', error);
                sanitizedPlans[key] = plan;
              }
            });

            // Update the document with the new plan
            await updateDoc(childRef, {
              plans: sanitizedPlans,
              months: months,
              lastPlanGenerated: serverTimestamp()
            });
            
            addDebugInfo('✅ PLAN SAVED TO FIRESTORE');
            
            // Show success message and navigate after a delay
            setLoadingStep('Plan generated successfully!');
            setTimeout(() => {
              navigate('/plans', { 
                state: { 
                  childName,
                  childMonths: months
                } 
              });
            }, 1000); // Reduced timeout to 1 second
          } else {
            throw new Error(res.message || "Failed to generate plan");
          }
        } catch (err) {
          addDebugInfo(`❌ ERROR CALLING BACKEND: ${err.message}`);
          console.error("❌ ERROR CALLING BACKEND:", err);
          
          // Backend failed - show error and don't proceed
          addDebugInfo("❌ BACKEND FAILED - Cannot generate plan");
          console.error("❌ Backend failed - cannot generate plan:", err);
          setFormError("Failed to generate learning plan. Please try again later.");
          return;
        }
      }
    } else {
        // This is an existing profile - generate a new plan anyway
        addDebugInfo("🔄 GENERATING PLAN FOR EXISTING PROFILE");
        console.log('🔄 GENERATING PLAN FOR EXISTING PROFILE...');
        try {
          // Send to backend
          addDebugInfo("📡 CALLING API SERVICE FOR EXISTING PROFILE...");
          console.log('📡 CALLING API SERVICE FOR EXISTING PROFILE...');
          const res = await apiService.generatePlan({
            child_name: childName,
            child_age: childAge,
            interests: interests,
            dislikes: dislikes,
            preferred_learning_style: learningStyle,
            goals: selectedGoals,
            plan_type: planType
          });
          addDebugInfo(`📥 API RESPONSE RECEIVED FOR EXISTING PROFILE: ${res.success ? 'SUCCESS' : 'FAILED'}`);
          console.log(`📥 API RESPONSE RECEIVED FOR EXISTING PROFILE: ${res.success ? 'SUCCESS' : 'FAILED'}`);
          
          if (res.success) {
            addDebugInfo('✅ PLAN GENERATION SUCCESSFUL FOR EXISTING PROFILE');
            console.log('✅ PLAN GENERATION SUCCESSFUL FOR EXISTING PROFILE');
            
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
            
            // Sanitize the data to remove any invalid nested entities for Firebase
            const sanitizedPlans = {};
            Object.keys(newPlans).forEach(key => {
              const plan = newPlans[key];
              // Convert to JSON and back to remove any non-serializable objects
              try {
                sanitizedPlans[key] = JSON.parse(JSON.stringify(plan));
              } catch (error) {
                console.error('Error sanitizing plan:', error);
                sanitizedPlans[key] = plan;
              }
            });

            // Update the document with the new plan
            await updateDoc(childRef, {
              plans: sanitizedPlans,
              months: months,
              lastPlanGenerated: serverTimestamp()
            });
            
            addDebugInfo('✅ PLAN SAVED TO FIRESTORE FOR EXISTING PROFILE');
            console.log('✅ PLAN SAVED TO FIRESTORE FOR EXISTING PROFILE');
            
            // Show success message and navigate after a delay
            setLoadingStep('Plan generated successfully!');
            setTimeout(() => {
              navigate('/plans', { 
                state: { 
                  childName,
                  childMonths: months
                } 
              });
            }, 1000); // Reduced timeout to 1 second
          } else {
            throw new Error(res.message || "Failed to generate plan");
          }
        } catch (err) {
          addDebugInfo(`❌ ERROR CALLING BACKEND FOR EXISTING PROFILE: ${err.message}`);
          console.error("❌ ERROR CALLING BACKEND FOR EXISTING PROFILE:", err);
          
          // Backend failed - show error and don't proceed
          addDebugInfo("❌ BACKEND FAILED FOR EXISTING PROFILE - Cannot generate plan");
          console.error("❌ Backend failed for existing profile - cannot generate plan:", err);
          setFormError("Failed to generate learning plan. Please try again later.");
          return;
        }
      }
    } catch (error) {
      addDebugInfo(`❌ ERROR: ${error.message}`);
      console.error('Profile submission error:', error);
      setFormError(error.message || 'An error occurred while saving the profile');
    } finally {
      setIsSubmitting(false);
      setLoadingStep('');
    }
  };

  // Handle schedule generator completion
  const handleScheduleComplete = () => {
    setShowScheduleGenerator(false);
    navigate('/plans');
  };

  if (showScheduleGenerator) {
    return (
      <div className="profile-form-container">
        <div className="schedule-generator">
          <h2>Schedule Generator</h2>
          <p>Your child profile has been saved successfully!</p>
          <p>Would you like to generate a learning schedule?</p>
          <div className="button-group">
            <button 
              onClick={handleScheduleComplete}
              className="btn btn-primary"
            >
              Generate Schedule
            </button>
            <button 
              onClick={() => navigate('/plans')}
              className="btn btn-secondary"
            >
              Skip for Now
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-form-container">
      <div className="profile-form">
        <h2>{originalProfile ? 'Edit Child Profile' : 'Create Child Profile'}</h2>
        
        {formError && (
          <div className="error-message">
            {formError}
          </div>
        )}
        
        {isSubmitting && (
          <div className="loading-overlay">
            <div className="loading-spinner"></div>
            <p>{loadingStep || 'Processing...'}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Child Name */}
          <div className="form-group">
            <label htmlFor="childName">Child's Name *</label>
            <input
              type="text"
              id="childName"
              value={childName}
              onChange={(e) => setChildName(e.target.value)}
              placeholder="Enter your child's name"
              required
            />
          </div>

          {/* Child Age */}
          <div className="form-group">
            <label htmlFor="childAge">Child's Age *</label>
            <input
              type="number"
              id="childAge"
              value={childAge}
              onChange={(e) => setChildAge(e.target.value)}
              placeholder="Enter age (1-18)"
              min="1"
              max="18"
              required
            />
          </div>

          {/* Interests */}
          <div className="form-group">
            <label>Interests * (Select all that apply)</label>
            <div className="checkbox-grid">
              {interestOptions.map(interest => (
                <label key={interest} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={interests.includes(interest)}
                    onChange={() => handleInterestToggle(interest)}
                  />
                  <span className="checkmark"></span>
                  {interest}
                </label>
              ))}
            </div>
          </div>

          {/* Dislikes */}
          <div className="form-group">
            <label>Dislikes (Select if applicable)</label>
            <div className="checkbox-grid">
              {interestOptions.map(dislike => (
                <label key={dislike} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={dislikes.includes(dislike)}
                    onChange={() => handleDislikeToggle(dislike)}
                  />
                  <span className="checkmark"></span>
                  {dislike}
                </label>
              ))}
            </div>
          </div>

          {/* Learning Style */}
          <div className="form-group">
            <label htmlFor="learningStyle">Preferred Learning Style *</label>
            <select
              id="learningStyle"
              value={learningStyle}
              onChange={(e) => setLearningStyle(e.target.value)}
              required
            >
              <option value="">Select a learning style</option>
              {learningStyleOptions.map(style => (
                <option key={style.value} value={style.value}>
                  {style.label}
                </option>
              ))}
            </select>
          </div>

          {/* Goals */}
          <div className="form-group">
            <label>Learning Goals * (Select all that apply)</label>
            <div className="checkbox-grid">
              {goalOptions.map(goal => (
                <label key={goal} className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={selectedGoals.includes(goal)}
                    onChange={() => handleGoalToggle(goal)}
                  />
                  <span className="checkmark"></span>
                  {goal}
                </label>
              ))}
            </div>
          </div>

          {/* Plan Type */}
          <div className="form-group">
            <label htmlFor="planType">Plan Type *</label>
            <select
              id="planType"
              value={planType}
              onChange={(e) => setPlanType(e.target.value)}
              required
            >
              {planTypeOptions.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          {/* Submit Button */}
          <div className="form-actions">
            <button
              type="submit"
              disabled={isSubmitting}
              className="btn btn-primary btn-large"
            >
              {isSubmitting ? 'Processing...' : (originalProfile ? 'Update Profile & Generate Plan' : 'Create Profile')}
            </button>
          </div>
        </form>

        {/* Debug Info */}
        {debugInfo.length > 0 && (
          <div className="debug-info">
            <h3>Debug Information</h3>
            <div className="debug-log">
              {debugInfo.map((info, index) => (
                <div key={index} className="debug-line">{info}</div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileForm;
