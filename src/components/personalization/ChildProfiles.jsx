import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';

const ChildProfiles = () => {
  const [user] = useAuthState(auth);
  const [childProfiles, setChildProfiles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedChild, setSelectedChild] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  useEffect(() => {
    if (user) {
      loadChildProfiles();
    }
  }, [user]);

  const loadChildProfiles = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8000/api/personalization/child-profiles?user_id=${user.uid}`);
      
      if (!response.ok) {
        throw new Error('Failed to load child profiles');
      }

      const data = await response.json();
      setChildProfiles(data.profiles || []);
    } catch (err) {
      setError(err.message);
      // Fallback to sample data
      setChildProfiles(getSampleChildProfiles());
    } finally {
      setIsLoading(false);
    }
  };

  const getSampleChildProfiles = () => {
    return [
      {
        childId: "child1",
        name: "Emma",
        age: 8,
        grade: "3rd",
        learningStyle: "visual",
        interests: ["science", "art", "reading"],
        strengths: ["problem-solving", "creativity", "attention-to-detail"],
        challenges: ["math", "focus"],
        currentLevel: "intermediate",
        preferredTime: "morning",
        attentionSpan: "medium",
        motivationFactors: ["achievements", "recognition", "fun"],
        personality: "curious",
        goals: ["improve math skills", "explore more science experiments"],
        learningPreferences: {
          preferredFormat: "interactive",
          visualStyle: "colorful",
          instructionLength: "concise",
          feedbackType: "immediate"
        },
        performanceHistory: {
          averageCompletionRate: 85,
          averageAccuracy: 82,
          improvementRate: 15,
          retentionRate: 88
        },
        createdAt: "2024-01-10T10:30:00Z",
        lastUpdated: "2024-01-22T14:20:00Z"
      },
      {
        childId: "child2",
        name: "Alex",
        age: 10,
        grade: "5th",
        learningStyle: "kinesthetic",
        interests: ["math", "sports", "building"],
        strengths: ["logical-thinking", "physical-activity", "teamwork"],
        challenges: ["reading", "patience"],
        currentLevel: "advanced",
        preferredTime: "afternoon",
        attentionSpan: "short",
        motivationFactors: ["competition", "rewards", "challenges"],
        personality: "active",
        goals: ["master multiplication", "build more projects"],
        learningPreferences: {
          preferredFormat: "hands-on",
          visualStyle: "minimal",
          instructionLength: "brief",
          feedbackType: "immediate"
        },
        performanceHistory: {
          averageCompletionRate: 78,
          averageAccuracy: 85,
          improvementRate: 12,
          retentionRate: 82
        },
        createdAt: "2024-01-12T09:15:00Z",
        lastUpdated: "2024-01-21T16:45:00Z"
      }
    ];
  };

  const getLearningStyleColor = (style) => {
    switch (style) {
      case 'visual': return '#3b82f6';
      case 'auditory': return '#10b981';
      case 'kinesthetic': return '#f59e0b';
      case 'reading': return '#8b5cf6';
      default: return '#6b7280';
    }
  };

  const getLevelColor = (level) => {
    switch (level) {
      case 'beginner': return '#10b981';
      case 'intermediate': return '#f59e0b';
      case 'advanced': return '#ef4444';
      default: return '#6b7280';
    }
  };

  const getAttentionSpanColor = (span) => {
    switch (span) {
      case 'short': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'long': return '#10b981';
      default: return '#6b7280';
    }
  };

  const handleEditProfile = (child) => {
    setSelectedChild(child);
    setEditForm({
      name: child.name,
      age: child.age,
      grade: child.grade,
      learningStyle: child.learningStyle,
      interests: child.interests.join(', '),
      strengths: child.strengths.join(', '),
      challenges: child.challenges.join(', '),
      currentLevel: child.currentLevel,
      preferredTime: child.preferredTime,
      attentionSpan: child.attentionSpan,
      motivationFactors: child.motivationFactors.join(', '),
      personality: child.personality,
      goals: child.goals.join(', ')
    });
    setIsEditing(true);
  };

  const handleSaveProfile = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/personalization/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.uid,
          child_id: selectedChild.childId,
          ...editForm,
          interests: editForm.interests.split(',').map(s => s.trim()),
          strengths: editForm.strengths.split(',').map(s => s.trim()),
          challenges: editForm.challenges.split(',').map(s => s.trim()),
          motivationFactors: editForm.motivationFactors.split(',').map(s => s.trim()),
          goals: editForm.goals.split(',').map(s => s.trim())
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update profile');
      }

      // Reload profiles after update
      loadChildProfiles();
      setIsEditing(false);
      setSelectedChild(null);
    } catch (err) {
      setError(err.message);
    }
  };

  const containerStyle = {
    padding: '20px',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid #e2e8f0'
  };

  const gridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
    gap: '20px',
    marginBottom: '30px'
  };

  const cardStyle = {
    padding: '20px',
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
  };

  const formStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '16px',
    marginBottom: '20px'
  };

  const inputStyle = {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px'
  };

  const selectStyle = {
    padding: '8px 12px',
    border: '1px solid #d1d5db',
    borderRadius: '6px',
    fontSize: '14px',
    backgroundColor: 'white'
  };

  const buttonStyle = {
    padding: '8px 16px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.2s ease'
  };

  if (isLoading) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <div style={{
            width: '24px',
            height: '24px',
            border: '2px solid #3b82f6',
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 12px'
          }}></div>
          Loading child profiles...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={containerStyle}>
        <div style={{
          padding: '16px',
          backgroundColor: '#fef2f2',
          border: '1px solid #fecaca',
          borderRadius: '8px',
          color: '#dc2626'
        }}>
          <strong>Error:</strong> {error}
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={{ margin: '0', color: '#1e293b' }}>
          👤 Child Profiles
        </h1>
        <div style={{ fontSize: '14px', color: '#64748b' }}>
          Manage and customize learning profiles for each child
        </div>
      </div>

      {/* Child Profiles Grid */}
      <div style={gridStyle}>
        {childProfiles.map((child, index) => (
          <div key={index} style={cardStyle}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '16px' }}>
              <div>
                <h3 style={{ margin: '0 0 8px 0', color: '#1e293b' }}>
                  {child.name} (Age {child.age})
                </h3>
                <div style={{ fontSize: '14px', color: '#64748b', marginBottom: '12px' }}>
                  Grade {child.grade} • {child.personality} personality
                </div>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                  <span style={{
                    padding: '2px 8px',
                    backgroundColor: getLearningStyleColor(child.learningStyle),
                    color: 'white',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '500',
                    textTransform: 'capitalize'
                  }}>
                    {child.learningStyle}
                  </span>
                  <span style={{
                    padding: '2px 8px',
                    backgroundColor: getLevelColor(child.currentLevel),
                    color: 'white',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '500',
                    textTransform: 'capitalize'
                  }}>
                    {child.currentLevel}
                  </span>
                  <span style={{
                    padding: '2px 8px',
                    backgroundColor: getAttentionSpanColor(child.attentionSpan),
                    color: 'white',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: '500',
                    textTransform: 'capitalize'
                  }}>
                    {child.attentionSpan} attention
                  </span>
                </div>
              </div>
              <button
                style={{
                  ...buttonStyle,
                  backgroundColor: '#6b7280',
                  padding: '6px 12px',
                  fontSize: '12px'
                }}
                onClick={() => handleEditProfile(child)}
              >
                Edit
              </button>
            </div>

            {/* Profile Details */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b', marginBottom: '8px' }}>
                Interests & Strengths
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
                <strong>Interests:</strong> {child.interests.join(', ')}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
                <strong>Strengths:</strong> {child.strengths.join(', ')}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '4px' }}>
                <strong>Challenges:</strong> {child.challenges.join(', ')}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                <strong>Goals:</strong> {child.goals.join(', ')}
              </div>
            </div>

            {/* Performance Metrics */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b', marginBottom: '8px' }}>
                Performance Metrics
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#10b981' }}>
                    {child.performanceHistory.averageCompletionRate}%
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748b' }}>Completion</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#3b82f6' }}>
                    {child.performanceHistory.averageAccuracy}%
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748b' }}>Accuracy</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#f59e0b' }}>
                    {child.performanceHistory.improvementRate}%
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748b' }}>Improvement</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#8b5cf6' }}>
                    {child.performanceHistory.retentionRate}%
                  </div>
                  <div style={{ fontSize: '10px', color: '#64748b' }}>Retention</div>
                </div>
              </div>
            </div>

            {/* Learning Preferences */}
            <div>
              <div style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b', marginBottom: '8px' }}>
                Learning Preferences
              </div>
              <div style={{ fontSize: '12px', color: '#64748b' }}>
                <div>Format: {child.learningPreferences.preferredFormat}</div>
                <div>Style: {child.learningPreferences.visualStyle}</div>
                <div>Instructions: {child.learningPreferences.instructionLength}</div>
                <div>Feedback: {child.learningPreferences.feedbackType}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Edit Modal */}
      {isEditing && selectedChild && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto'
          }}>
            <h2 style={{ margin: '0 0 20px 0', color: '#1e293b' }}>
              Edit Profile: {selectedChild.name}
            </h2>
            
            <div style={formStyle}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1e293b', marginBottom: '4px' }}>
                  Name
                </label>
                <input
                  type="text"
                  value={editForm.name || ''}
                  onChange={(e) => setEditForm({...editForm, name: e.target.value})}
                  style={inputStyle}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1e293b', marginBottom: '4px' }}>
                  Age
                </label>
                <input
                  type="number"
                  value={editForm.age || ''}
                  onChange={(e) => setEditForm({...editForm, age: parseInt(e.target.value)})}
                  style={inputStyle}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1e293b', marginBottom: '4px' }}>
                  Grade
                </label>
                <input
                  type="text"
                  value={editForm.grade || ''}
                  onChange={(e) => setEditForm({...editForm, grade: e.target.value})}
                  style={inputStyle}
                />
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1e293b', marginBottom: '4px' }}>
                  Learning Style
                </label>
                <select
                  value={editForm.learningStyle || ''}
                  onChange={(e) => setEditForm({...editForm, learningStyle: e.target.value})}
                  style={selectStyle}
                >
                  <option value="visual">Visual</option>
                  <option value="auditory">Auditory</option>
                  <option value="kinesthetic">Kinesthetic</option>
                  <option value="reading">Reading</option>
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1e293b', marginBottom: '4px' }}>
                  Current Level
                </label>
                <select
                  value={editForm.currentLevel || ''}
                  onChange={(e) => setEditForm({...editForm, currentLevel: e.target.value})}
                  style={selectStyle}
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1e293b', marginBottom: '4px' }}>
                  Preferred Time
                </label>
                <select
                  value={editForm.preferredTime || ''}
                  onChange={(e) => setEditForm({...editForm, preferredTime: e.target.value})}
                  style={selectStyle}
                >
                  <option value="morning">Morning</option>
                  <option value="afternoon">Afternoon</option>
                  <option value="evening">Evening</option>
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1e293b', marginBottom: '4px' }}>
                  Attention Span
                </label>
                <select
                  value={editForm.attentionSpan || ''}
                  onChange={(e) => setEditForm({...editForm, attentionSpan: e.target.value})}
                  style={selectStyle}
                >
                  <option value="short">Short</option>
                  <option value="medium">Medium</option>
                  <option value="long">Long</option>
                </select>
              </div>
              
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1e293b', marginBottom: '4px' }}>
                  Personality
                </label>
                <select
                  value={editForm.personality || ''}
                  onChange={(e) => setEditForm({...editForm, personality: e.target.value})}
                  style={selectStyle}
                >
                  <option value="curious">Curious</option>
                  <option value="active">Active</option>
                  <option value="calm">Calm</option>
                  <option value="creative">Creative</option>
                  <option value="analytical">Analytical</option>
                </select>
              </div>
              
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1e293b', marginBottom: '4px' }}>
                  Interests (comma-separated)
                </label>
                <input
                  type="text"
                  value={editForm.interests || ''}
                  onChange={(e) => setEditForm({...editForm, interests: e.target.value})}
                  style={inputStyle}
                  placeholder="science, art, reading"
                />
              </div>
              
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1e293b', marginBottom: '4px' }}>
                  Strengths (comma-separated)
                </label>
                <input
                  type="text"
                  value={editForm.strengths || ''}
                  onChange={(e) => setEditForm({...editForm, strengths: e.target.value})}
                  style={inputStyle}
                  placeholder="problem-solving, creativity, attention-to-detail"
                />
              </div>
              
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1e293b', marginBottom: '4px' }}>
                  Challenges (comma-separated)
                </label>
                <input
                  type="text"
                  value={editForm.challenges || ''}
                  onChange={(e) => setEditForm({...editForm, challenges: e.target.value})}
                  style={inputStyle}
                  placeholder="math, focus, patience"
                />
              </div>
              
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1e293b', marginBottom: '4px' }}>
                  Motivation Factors (comma-separated)
                </label>
                <input
                  type="text"
                  value={editForm.motivationFactors || ''}
                  onChange={(e) => setEditForm({...editForm, motivationFactors: e.target.value})}
                  style={inputStyle}
                  placeholder="achievements, recognition, fun"
                />
              </div>
              
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#1e293b', marginBottom: '4px' }}>
                  Goals (comma-separated)
                </label>
                <input
                  type="text"
                  value={editForm.goals || ''}
                  onChange={(e) => setEditForm({...editForm, goals: e.target.value})}
                  style={inputStyle}
                  placeholder="improve math skills, explore science experiments"
                />
              </div>
            </div>
            
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                style={{
                  ...buttonStyle,
                  backgroundColor: '#6b7280'
                }}
                onClick={() => {
                  setIsEditing(false);
                  setSelectedChild(null);
                }}
              >
                Cancel
              </button>
              <button
                style={buttonStyle}
                onClick={handleSaveProfile}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ChildProfiles;
