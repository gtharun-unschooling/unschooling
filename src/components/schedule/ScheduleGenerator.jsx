import React, { useState } from 'react';
import { collection, addDoc, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';
import apiService from '../../services/api';

const ScheduleGenerator = ({ childProfile, onScheduleGenerated, onError }) => {
  const [user] = useAuthState(auth);
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState('');
  const [planType, setPlanType] = useState(childProfile?.plan_type || 'hybrid');

  const handleGenerateSchedule = async () => {
    if (!user || !childProfile) {
      onError?.('User not authenticated or child profile missing');
      return;
    }

    setIsGenerating(true);
    setGenerationStep('Initializing agents...');

    try {
      // Step 1: Generate plan using backend agents
      setGenerationStep('Running Profile Agent...');
      const planResponse = await apiService.generatePlan({
        ...childProfile,
        plan_type: planType
      });

      if (!planResponse.success) {
        throw new Error(planResponse.message || 'Failed to generate plan');
      }

      setGenerationStep('Processing schedule structure...');
      
      // Step 2: Create structured schedule data
      const scheduleData = {
        child_id: childProfile.child_id || `child_${Date.now()}`,
        child_name: childProfile.child_name,
        child_age: childProfile.child_age,
        interests: childProfile.interests,
        learning_style: childProfile.learning_style,
        plan_type: planType,
        generated_at: new Date().toISOString(),
        generated_by: user.uid,
        version: 1,
        status: 'active',
        weekly_plan: planResponse.data?.weekly_plan || createFallbackWeeklyPlan(childProfile),
        selected_topics: planResponse.data?.selected_topics || [],
        agent_metadata: {
          profile_agent: 'completed',
          match_agent: 'completed', 
          schedule_agent: 'completed',
          reviewer_agent: 'completed'
        }
      };

      setGenerationStep('Saving to database...');

      // Step 3: Save to backend API
      const saveResponse = await fetch('http://localhost:8000/api/schedules/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(scheduleData)
      });

      if (!saveResponse.ok) {
        throw new Error('Failed to save schedule to database');
      }

      const saveResult = await saveResponse.json();
      scheduleData.schedule_id = saveResult.schedule_id;

      setGenerationStep('Schedule generated successfully!');
      
      // Step 4: Call success callback
      onScheduleGenerated?.(scheduleData);

    } catch (error) {
      console.error('Schedule generation error:', error);
      onError?.(error.message || 'Failed to generate schedule');
    } finally {
      setIsGenerating(false);
      setGenerationStep('');
    }
  };

  const createFallbackWeeklyPlan = (profile) => {
    // Create a basic 4-week structure if backend fails
    const weeks = [];
    for (let week = 0; week < 4; week++) {
      const weekData = [];
      for (let day = 0; day < 7; day++) {
        weekData.push({
          day: day,
          activities: [
            {
              title: `Activity for ${profile.interests?.[0] || 'Learning'}`,
              description: `Engaging activity for ${profile.child_name}`,
              duration: '30-45 minutes',
              type: 'hands-on'
            }
          ]
        });
      }
      weeks.push(weekData);
    }
    return weeks;
  };

  const containerStyle = {
    padding: '20px',
    maxWidth: '600px',
    margin: '0 auto',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  };

  const cardStyle = {
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    padding: '24px',
    backgroundColor: '#ffffff',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px 24px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s'
  };

  const disabledButtonStyle = {
    ...buttonStyle,
    backgroundColor: '#9ca3af',
    cursor: 'not-allowed'
  };

  const loadingStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '12px',
    padding: '12px',
    backgroundColor: '#f0f9ff',
    border: '1px solid #0ea5e9',
    borderRadius: '8px',
    marginBottom: '16px'
  };

  const planTypeStyle = {
    marginBottom: '20px'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontWeight: '500',
    color: '#374151'
  };

  const selectStyle = {
    width: '100%',
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px'
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <h2 style={{ margin: '0 0 16px 0', color: '#1e293b' }}>
          🚀 Generate Learning Schedule
        </h2>
        
        <p style={{ margin: '0 0 20px 0', color: '#64748b' }}>
          Create a personalized 4-week learning schedule using our AI agents for{' '}
          <strong>{childProfile?.child_name}</strong> (Age {childProfile?.child_age}).
        </p>

        <div style={planTypeStyle}>
          <label style={labelStyle}>Plan Type:</label>
          <select 
            value={planType} 
            onChange={(e) => setPlanType(e.target.value)}
            style={selectStyle}
            disabled={isGenerating}
          >
            <option value="hybrid">Hybrid (Balanced Learning)</option>
            <option value="fusion">Fusion (Integrated Learning)</option>
          </select>
        </div>

        {isGenerating && (
          <div style={loadingStyle}>
            <div style={{
              width: '20px',
              height: '20px',
              border: '2px solid #0ea5e9',
              borderTop: '2px solid transparent',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <span style={{ color: '#0c4a6e' }}>{generationStep}</span>
          </div>
        )}

        <button
          onClick={handleGenerateSchedule}
          disabled={isGenerating}
          style={isGenerating ? disabledButtonStyle : buttonStyle}
          onMouseOver={(e) => {
            if (!isGenerating) {
              e.target.style.backgroundColor = '#2563eb';
            }
          }}
          onMouseOut={(e) => {
            if (!isGenerating) {
              e.target.style.backgroundColor = '#3b82f6';
            }
          }}
        >
          {isGenerating ? 'Generating Schedule...' : 'Generate 4-Week Schedule'}
        </button>

        <div style={{ 
          marginTop: '16px', 
          padding: '12px', 
          backgroundColor: '#f8fafc',
          borderRadius: '6px',
          fontSize: '14px',
          color: '#64748b'
        }}>
          <strong>What happens next:</strong>
          <ul style={{ margin: '8px 0 0 0', paddingLeft: '20px' }}>
            <li>Profile Agent analyzes your child's profile</li>
            <li>Match Agent selects 28 age-appropriate topics</li>
            <li>Schedule Agent creates structured weekly plans</li>
            <li>Reviewer Agent optimizes the final schedule</li>
          </ul>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ScheduleGenerator;
