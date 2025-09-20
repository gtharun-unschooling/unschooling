import React, { useState } from 'react';
import ProgressTracker from './ProgressTracker';

const ScheduleDisplay = ({ scheduleData, childProfile, onActivityComplete }) => {
  const [expandedWeek, setExpandedWeek] = useState(null);
  const [completedActivities, setCompletedActivities] = useState(new Set());

  const handleActivityComplete = (weekIndex, dayIndex, activityIndex) => {
    const activityId = `${weekIndex}-${dayIndex}-${activityIndex}`;
    const newCompleted = new Set(completedActivities);
    
    if (newCompleted.has(activityId)) {
      newCompleted.delete(activityId);
    } else {
      newCompleted.add(activityId);
    }
    
    setCompletedActivities(newCompleted);
    
    // Call parent callback
    if (onActivityComplete) {
      onActivityComplete(activityId, newCompleted.has(activityId));
    }
  };

  const getWeekTitle = (weekIndex) => {
    const titles = [
      "Foundation & Introduction (Motivation Week)",
      "Deep Dive & Exploration", 
      "Application & Practice (Motivation Week)",
      "Project & Mastery (Project Week)"
    ];
    return titles[weekIndex] || `Week ${weekIndex + 1}`;
  };

  const getDayName = (dayIndex) => {
    const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
    return days[dayIndex] || `Day ${dayIndex + 1}`;
  };

  const getProgressPercentage = (weekIndex) => {
    const weekActivities = scheduleData.weekly_plan?.[weekIndex] || [];
    if (weekActivities.length === 0) return 0;
    
    let completedCount = 0;
    let totalCount = 0;
    
    weekActivities.forEach((day, dayIndex) => {
      if (day.activities) {
        day.activities.forEach((_, activityIndex) => {
          totalCount++;
          const activityId = `${weekIndex}-${dayIndex}-${activityIndex}`;
          if (completedActivities.has(activityId)) {
            completedCount++;
          }
        });
      }
    });
    
    return totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  };

  const containerStyle = {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
    fontFamily: 'system-ui, -apple-system, sans-serif'
  };

  const headerStyle = {
    textAlign: 'center',
    marginBottom: '30px',
    padding: '20px',
    backgroundColor: '#f8fafc',
    borderRadius: '12px',
    border: '1px solid #e2e8f0'
  };

  const weekCardStyle = {
    marginBottom: '20px',
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    overflow: 'hidden',
    backgroundColor: '#ffffff'
  };

  const weekHeaderStyle = {
    padding: '16px 20px',
    backgroundColor: '#f1f5f9',
    borderBottom: '1px solid #e2e8f0',
    cursor: 'pointer',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  };

  const progressBarStyle = {
    width: '100%',
    height: '8px',
    backgroundColor: '#e2e8f0',
    borderRadius: '4px',
    overflow: 'hidden',
    marginTop: '8px'
  };

  const progressFillStyle = (percentage) => ({
    width: `${percentage}%`,
    height: '100%',
    backgroundColor: percentage === 100 ? '#10b981' : '#3b82f6',
    transition: 'width 0.3s ease'
  });

  const dayGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '16px',
    padding: '20px'
  };

  const dayCardStyle = {
    border: '1px solid #e2e8f0',
    borderRadius: '8px',
    padding: '16px',
    backgroundColor: '#fafafa'
  };

  const activityStyle = {
    padding: '12px',
    margin: '8px 0',
    border: '1px solid #e2e8f0',
    borderRadius: '6px',
    backgroundColor: '#ffffff',
    display: 'flex',
    alignItems: 'center',
    gap: '12px'
  };

  const completedActivityStyle = {
    ...activityStyle,
    backgroundColor: '#f0fdf4',
    borderColor: '#10b981'
  };

  const checkboxStyle = {
    width: '18px',
    height: '18px',
    cursor: 'pointer'
  };

  if (!scheduleData || !scheduleData.weekly_plan) {
    return (
      <div style={containerStyle}>
        <div style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
          <h3>No schedule data available</h3>
          <p>Please generate a schedule first.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <div style={headerStyle}>
        <h1 style={{ margin: '0 0 8px 0', color: '#1e293b' }}>
          📚 Learning Schedule for {childProfile?.child_name || 'Your Child'}
        </h1>
        <p style={{ margin: '0', color: '#64748b' }}>
          {childProfile?.plan_type || 'Hybrid'} Plan • Age {childProfile?.child_age || 'N/A'} • 
          {childProfile?.interests?.join(', ') || 'Various Interests'}
        </p>
      </div>

      {/* Progress Tracker */}
      {scheduleData.schedule_id && (
        <ProgressTracker
          childId={scheduleData.child_id}
          scheduleId={scheduleData.schedule_id}
          onProgressUpdate={onActivityComplete}
        />
      )}

      {scheduleData.weekly_plan.map((week, weekIndex) => {
        const progress = getProgressPercentage(weekIndex);
        const isExpanded = expandedWeek === weekIndex;
        
        return (
          <div key={weekIndex} style={weekCardStyle}>
            <div 
              style={weekHeaderStyle}
              onClick={() => setExpandedWeek(isExpanded ? null : weekIndex)}
            >
              <div>
                <h3 style={{ margin: '0', color: '#1e293b' }}>
                  Week {weekIndex + 1}: {getWeekTitle(weekIndex)}
                </h3>
                <div style={progressBarStyle}>
                  <div style={progressFillStyle(progress)}></div>
                </div>
                <p style={{ margin: '4px 0 0 0', fontSize: '14px', color: '#64748b' }}>
                  {progress}% Complete
                </p>
              </div>
              <div style={{ fontSize: '20px', color: '#64748b' }}>
                {isExpanded ? '▼' : '▶'}
              </div>
            </div>
            
            {isExpanded && (
              <div style={dayGridStyle}>
                {week.map((day, dayIndex) => (
                  <div key={dayIndex} style={dayCardStyle}>
                    <h4 style={{ margin: '0 0 12px 0', color: '#374151' }}>
                      {getDayName(dayIndex)}
                    </h4>
                    {day.activities?.map((activity, activityIndex) => {
                      const activityId = `${weekIndex}-${dayIndex}-${activityIndex}`;
                      const isCompleted = completedActivities.has(activityId);
                      
                      return (
                        <div 
                          key={activityIndex} 
                          style={isCompleted ? completedActivityStyle : activityStyle}
                        >
                          <input
                            type="checkbox"
                            checked={isCompleted}
                            onChange={() => handleActivityComplete(weekIndex, dayIndex, activityIndex)}
                            style={checkboxStyle}
                          />
                          <div style={{ flex: 1 }}>
                            <div style={{ 
                              fontWeight: '500', 
                              color: isCompleted ? '#059669' : '#374151',
                              textDecoration: isCompleted ? 'line-through' : 'none'
                            }}>
                              {activity.title || activity.name || `Activity ${activityIndex + 1}`}
                            </div>
                            {activity.description && (
                              <div style={{ 
                                fontSize: '14px', 
                                color: '#64748b',
                                marginTop: '4px'
                              }}>
                                {activity.description}
                              </div>
                            )}
                            {activity.duration && (
                              <div style={{ 
                                fontSize: '12px', 
                                color: '#9ca3af',
                                marginTop: '4px'
                              }}>
                                ⏱️ {activity.duration}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default ScheduleDisplay;
