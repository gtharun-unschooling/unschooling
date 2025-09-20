import React, { useState, useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';

const ScheduleHistory = ({ childId, onScheduleSelect }) => {
  const [user] = useAuthState(auth);
  const [schedules, setSchedules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user || !childId) return;

    loadSchedules();
  }, [user, childId]);

  const loadSchedules = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`http://localhost:8000/api/schedules/${childId}?user_id=${user.uid}`);
      
      if (!response.ok) {
        throw new Error('Failed to load schedules');
      }

      const data = await response.json();
      setSchedules(data.schedules || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const generateNewSchedule = async () => {
    try {
      setIsLoading(true);
      // This would trigger a new schedule generation
      // For now, just reload the schedules
      await loadSchedules();
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return '#10b981';
      case 'completed': return '#3b82f6';
      case 'archived': return '#6b7280';
      default: return '#6b7280';
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
    marginBottom: '20px',
    padding: '16px',
    backgroundColor: '#f8fafc',
    borderRadius: '8px',
    border: '1px solid #e2e8f0'
  };

  const buttonStyle = {
    padding: '8px 16px',
    backgroundColor: '#3b82f6',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: '500'
  };

  const scheduleCardStyle = {
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '16px',
    marginBottom: '12px',
    backgroundColor: '#ffffff',
    cursor: 'pointer',
    transition: 'all 0.2s'
  };

  const scheduleCardHoverStyle = {
    ...scheduleCardStyle,
    borderColor: '#3b82f6',
    boxShadow: '0 2px 4px rgba(59, 130, 246, 0.1)'
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
          Loading schedule history...
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
        <h3 style={{ margin: '0', color: '#1e293b' }}>
          📅 Schedule History
        </h3>
        <button
          style={buttonStyle}
          onClick={generateNewSchedule}
          disabled={isLoading}
        >
          Generate New Schedule
        </button>
      </div>

      {schedules.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '40px',
          color: '#64748b',
          backgroundColor: '#f8fafc',
          borderRadius: '8px',
          border: '1px solid #e2e8f0'
        }}>
          <h4>No schedules found</h4>
          <p>Generate your first schedule to get started!</p>
        </div>
      ) : (
        <div>
          {schedules.map((schedule, index) => (
            <div
              key={schedule.schedule_id || index}
              style={scheduleCardStyle}
              onMouseOver={(e) => {
                Object.assign(e.target.style, scheduleCardHoverStyle);
              }}
              onMouseOut={(e) => {
                Object.assign(e.target.style, scheduleCardStyle);
              }}
              onClick={() => onScheduleSelect?.(schedule)}
            >
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: '8px'
              }}>
                <div>
                  <h4 style={{ margin: '0 0 4px 0', color: '#1e293b' }}>
                    {schedule.plan_type || 'Hybrid'} Plan - Version {schedule.version || 1}
                  </h4>
                  <p style={{ margin: '0', fontSize: '14px', color: '#64748b' }}>
                    Generated: {formatDate(schedule.generated_at)}
                  </p>
                </div>
                <div style={{
                  padding: '4px 8px',
                  backgroundColor: getStatusColor(schedule.status),
                  color: 'white',
                  borderRadius: '4px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  {schedule.status || 'active'}
                </div>
              </div>
              
              <div style={{ fontSize: '14px', color: '#64748b' }}>
                <div>Age: {schedule.child_age} • Interests: {schedule.interests?.join(', ') || 'Various'}</div>
                <div>Learning Style: {schedule.learning_style || 'Mixed'}</div>
                {schedule.agent_metadata && (
                  <div style={{ marginTop: '8px', fontSize: '12px' }}>
                    Agents: {Object.keys(schedule.agent_metadata).filter(key => 
                      schedule.agent_metadata[key] === 'completed'
                    ).join(', ')}
                  </div>
                )}
              </div>
            </div>
          ))}
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

export default ScheduleHistory;
