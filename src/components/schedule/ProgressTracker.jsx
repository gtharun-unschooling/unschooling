import React, { useState, useEffect } from 'react';
import { doc, updateDoc, onSnapshot, serverTimestamp } from 'firebase/firestore';
import { db } from '../../firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../firebase';

const ProgressTracker = ({ childId, scheduleId, onProgressUpdate }) => {
  const [user] = useAuthState(auth);
  const [progress, setProgress] = useState({
    completedActivities: [],
    currentWeek: 0,
    totalActivities: 0,
    completedCount: 0,
    lastUpdated: null
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !childId || !scheduleId) return;

    const progressRef = doc(db, 'users', user.uid, 'children', childId, 'scheduleProgress', scheduleId);
    
    const unsubscribe = onSnapshot(progressRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        setProgress({
          completedActivities: data.completedActivities || [],
          currentWeek: data.currentWeek || 0,
          totalActivities: data.totalActivities || 0,
          completedCount: data.completedCount || 0,
          lastUpdated: data.lastUpdated?.toDate() || null
        });
      } else {
        // Initialize progress document
        setDoc(progressRef, {
          completedActivities: [],
          currentWeek: 0,
          totalActivities: 0,
          completedCount: 0,
          lastUpdated: serverTimestamp()
        });
      }
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [user, childId, scheduleId]);

  const updateActivityProgress = async (activityId, isCompleted) => {
    if (!user || !childId || !scheduleId) return;

    try {
      let newCompletedActivities = [...progress.completedActivities];
      
      if (isCompleted) {
        if (!newCompletedActivities.includes(activityId)) {
          newCompletedActivities.push(activityId);
        }
      } else {
        newCompletedActivities = newCompletedActivities.filter(id => id !== activityId);
      }

      const newCompletedCount = newCompletedActivities.length;
      
      // Calculate current week based on progress
      const newCurrentWeek = Math.min(Math.floor((newCompletedCount / Math.max(progress.totalActivities, 1)) * 4), 3);

      // Update via backend API
      const updateResponse = await fetch(`http://localhost:8000/api/schedules/${scheduleId}/progress`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.uid,
          child_id: childId,
          completedActivities: newCompletedActivities,
          completedCount: newCompletedCount,
          currentWeek: newCurrentWeek,
          totalActivities: progress.totalActivities
        })
      });

      if (!updateResponse.ok) {
        throw new Error('Failed to update progress');
      }

      // Update local state
      setProgress(prev => ({
        ...prev,
        completedActivities: newCompletedActivities,
        completedCount: newCompletedCount,
        currentWeek: newCurrentWeek,
        lastUpdated: new Date()
      }));

      // Notify parent component
      onProgressUpdate?.({
        activityId,
        isCompleted,
        totalCompleted: newCompletedCount,
        currentWeek: newCurrentWeek
      });

    } catch (error) {
      console.error('Error updating progress:', error);
    }
  };

  const getProgressPercentage = () => {
    if (progress.totalActivities === 0) return 0;
    return Math.round((progress.completedCount / progress.totalActivities) * 100);
  };

  const getWeekProgress = (weekIndex) => {
    // This would need to be calculated based on actual schedule structure
    // For now, return a simple calculation
    const weekStart = Math.floor((weekIndex / 4) * progress.totalActivities);
    const weekEnd = Math.floor(((weekIndex + 1) / 4) * progress.totalActivities);
    const weekTotal = weekEnd - weekStart;
    const weekCompleted = progress.completedActivities.filter(id => {
      // Parse activity ID to get week number
      const parts = id.split('-');
      return parts[0] === weekIndex.toString();
    }).length;
    
    return weekTotal > 0 ? Math.round((weekCompleted / weekTotal) * 100) : 0;
  };

  const containerStyle = {
    padding: '20px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid #e2e8f0',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  };

  const headerStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px'
  };

  const progressBarStyle = {
    width: '100%',
    height: '12px',
    backgroundColor: '#e2e8f0',
    borderRadius: '6px',
    overflow: 'hidden',
    marginBottom: '16px'
  };

  const progressFillStyle = (percentage) => ({
    width: `${percentage}%`,
    height: '100%',
    backgroundColor: percentage === 100 ? '#10b981' : '#3b82f6',
    transition: 'width 0.3s ease'
  });

  const weekGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '12px',
    marginTop: '16px'
  };

  const weekCardStyle = {
    padding: '12px',
    backgroundColor: '#ffffff',
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    textAlign: 'center'
  };

  const weekProgressBarStyle = {
    width: '100%',
    height: '6px',
    backgroundColor: '#f1f5f9',
    borderRadius: '3px',
    overflow: 'hidden',
    marginTop: '8px'
  };

  if (isLoading) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{
            width: '24px',
            height: '24px',
            border: '2px solid #3b82f6',
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 12px'
          }}></div>
          Loading progress...
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h3 style={{ margin: '0', color: '#1e293b' }}>
          📊 Learning Progress
        </h3>
        <div style={{ fontSize: '14px', color: '#64748b' }}>
          {progress.completedCount} / {progress.totalActivities} activities
        </div>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
          <span style={{ fontSize: '14px', color: '#374151' }}>Overall Progress</span>
          <span style={{ fontSize: '14px', color: '#374151', fontWeight: '500' }}>
            {getProgressPercentage()}%
          </span>
        </div>
        <div style={progressBarStyle}>
          <div style={progressFillStyle(getProgressPercentage())}></div>
        </div>
      </div>

      <div style={weekGridStyle}>
        {[0, 1, 2, 3].map(weekIndex => {
          const weekProgress = getWeekProgress(weekIndex);
          const isCurrentWeek = weekIndex === progress.currentWeek;
          
          return (
            <div key={weekIndex} style={{
              ...weekCardStyle,
              borderColor: isCurrentWeek ? '#3b82f6' : '#e2e8f0',
              backgroundColor: isCurrentWeek ? '#f0f9ff' : '#ffffff'
            }}>
              <div style={{ 
                fontSize: '14px', 
                fontWeight: '500',
                color: isCurrentWeek ? '#1d4ed8' : '#374151'
              }}>
                Week {weekIndex + 1}
                {isCurrentWeek && ' (Current)'}
              </div>
              <div style={{ fontSize: '12px', color: '#64748b', marginTop: '4px' }}>
                {weekProgress}% Complete
              </div>
              <div style={weekProgressBarStyle}>
                <div style={progressFillStyle(weekProgress)}></div>
              </div>
            </div>
          );
        })}
      </div>

      {progress.lastUpdated && (
        <div style={{ 
          marginTop: '16px', 
          fontSize: '12px', 
          color: '#9ca3af',
          textAlign: 'center'
        }}>
          Last updated: {progress.lastUpdated.toLocaleString()}
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

export default ProgressTracker;
