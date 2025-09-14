import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminTracker = () => {
  const navigate = useNavigate();
  const [timeTracking, setTimeTracking] = useState({
    isTracking: false,
    sessionStart: null,
    todayHours: 0,
    weekHours: 0,
    monthHours: 0,
    dailySessions: [],
    weeklyData: [],
    monthlyData: []
  });

  // Initialize time tracking from localStorage
  useEffect(() => {
    const initializeTimeTracking = () => {
      const saved = localStorage.getItem('timeTracking');
      if (saved) {
        const data = JSON.parse(saved);
        const now = new Date();
        const today = now.toDateString();
        
        // Calculate today's hours from sessions
        const todaySessions = data.dailySessions[today] || [];
        const todayHours = todaySessions.reduce((sum, session) => sum + session.duration, 0);
        
        // Calculate week hours
        const weekStart = getWeekStart(now);
        const weekHours = calculateWeekHours(data.dailySessions, weekStart);
        
        // Calculate month hours
        const monthStart = getMonthStart(now);
        const monthHours = calculateMonthHours(data.dailySessions, monthStart);
        
        setTimeTracking({
          ...data,
          todayHours,
          weekHours,
          monthHours
        });
      }
    };

    initializeTimeTracking();
  }, []);

  // Helper functions
  const getWeekStart = (date) => {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day + (day === 0 ? -6 : 1);
    return new Date(d.setDate(diff));
  };

  const getMonthStart = (date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1);
  };

  const calculateWeekHours = (dailySessions, weekStart) => {
    let total = 0;
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart);
      date.setDate(date.getDate() + i);
      const dayKey = date.toDateString();
      const sessions = dailySessions[dayKey] || [];
      total += sessions.reduce((sum, session) => sum + session.duration, 0);
    }
    return total;
  };

  const calculateMonthHours = (dailySessions, monthStart) => {
    let total = 0;
    const now = new Date();
    const currentDate = new Date(monthStart);
    
    while (currentDate <= now && currentDate.getMonth() === monthStart.getMonth()) {
      const dayKey = currentDate.toDateString();
      const sessions = dailySessions[dayKey] || [];
      total += sessions.reduce((sum, session) => sum + session.duration, 0);
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return total;
  };

  const formatTime = (hours) => {
    const h = Math.floor(hours);
    const m = Math.round((hours - h) * 60);
    return `${h}h ${m}m`;
  };

  const startTimeTracking = () => {
    const now = new Date();
    setTimeTracking(prev => ({
      ...prev,
      isTracking: true,
      sessionStart: now
    }));
  };

  const stopTimeTracking = () => {
    if (!timeTracking.sessionStart) return;
    
    const now = new Date();
    const duration = (now - timeTracking.sessionStart) / (1000 * 60 * 60); // hours
    const today = now.toDateString();
    
    const newSession = {
      id: Date.now(),
      start: timeTracking.sessionStart,
      end: now,
      duration: duration
    };
    
    setTimeTracking(prev => {
      const newDailySessions = {
        ...prev.dailySessions,
        [today]: [...(prev.dailySessions[today] || []), newSession]
      };
      
      const newTodayHours = (prev.dailySessions[today] || []).reduce((sum, session) => sum + session.duration, 0) + duration;
      const newWeekHours = calculateWeekHours(newDailySessions, getWeekStart(now));
      const newMonthHours = calculateMonthHours(newDailySessions, getMonthStart(now));
      
      const updated = {
        ...prev,
        isTracking: false,
        sessionStart: null,
        dailySessions: newDailySessions,
        todayHours: newTodayHours,
        weekHours: newWeekHours,
        monthHours: newMonthHours
      };
      
      // Save to localStorage
      localStorage.setItem('timeTracking', JSON.stringify(updated));
      return updated;
    });
  };

  // Auto-start tracking when page loads (simulating Cursor app focus)
  useEffect(() => {
    if (!timeTracking.isTracking) {
      startTimeTracking();
    }
  }, []);

  // Update time every minute
  useEffect(() => {
    if (!timeTracking.isTracking) return;
    
    const interval = setInterval(() => {
      const now = new Date();
      const duration = (now - timeTracking.sessionStart) / (1000 * 60 * 60);
      const today = now.toDateString();
      
      setTimeTracking(prev => ({
        ...prev,
        todayHours: (prev.dailySessions[today] || []).reduce((sum, session) => sum + session.duration, 0) + duration
      }));
    }, 60000);
    
    return () => clearInterval(interval);
  }, [timeTracking.isTracking, timeTracking.sessionStart]);

  const getRecentSessions = () => {
    const allSessions = [];
    Object.values(timeTracking.dailySessions).forEach(daySessions => {
      allSessions.push(...daySessions);
    });
    return allSessions
      .sort((a, b) => b.start - a.start)
      .slice(0, 10);
  };

  const getMostProductiveDay = () => {
    let maxHours = 0;
    let bestDay = '';
    Object.entries(timeTracking.dailySessions).forEach(([day, sessions]) => {
      const dayHours = sessions.reduce((sum, session) => sum + session.duration, 0);
      if (dayHours > maxHours) {
        maxHours = dayHours;
        bestDay = day;
      }
    });
    return { day: bestDay, hours: maxHours };
  };

  const mostProductive = getMostProductiveDay();
  const totalSessions = Object.values(timeTracking.dailySessions).flat().length;
  const avgSessionLength = totalSessions > 0 ? 
    Object.values(timeTracking.dailySessions).flat().reduce((sum, session) => sum + session.duration, 0) / totalSessions : 0;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '20px'
    }}>
      {/* Header */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '32px',
        marginBottom: '24px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <div>
            <h1 style={{ margin: '0 0 8px 0', fontSize: '2.5rem', fontWeight: '700', color: '#1e293b' }}>
              ⏱️ Time Tracker
            </h1>
            <p style={{ margin: 0, color: '#64748b', fontSize: '1.1rem' }}>
              Track your productivity and work patterns
            </p>
          </div>
          <button
            onClick={() => navigate('/admin')}
            style={{
              padding: '12px 24px',
              background: '#6b7280',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}
          >
            ← Back to Admin
          </button>
        </div>
        
        {/* Status Indicator */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '16px 20px',
          background: timeTracking.isTracking ? '#f0fdf4' : '#fef2f2',
          borderRadius: '12px',
          border: `1px solid ${timeTracking.isTracking ? '#bbf7d0' : '#fecaca'}`
        }}>
          <div style={{
            width: '12px',
            height: '12px',
            borderRadius: '50%',
            background: timeTracking.isTracking ? '#22c55e' : '#ef4444',
            animation: timeTracking.isTracking ? 'pulse 2s infinite' : 'none'
          }}></div>
          <span style={{
            fontWeight: '600',
            color: timeTracking.isTracking ? '#16a34a' : '#dc2626',
            fontSize: '1.1rem'
          }}>
            {timeTracking.isTracking ? 'Currently Tracking' : 'Not Tracking'}
          </span>
          {timeTracking.isTracking && timeTracking.sessionStart && (
            <span style={{ color: '#64748b', fontSize: '0.9rem' }}>
              Session started: {timeTracking.sessionStart.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>

      {/* Main Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '32px' }}>
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '24px',
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#3b82f6', marginBottom: '8px' }}>
            {formatTime(timeTracking.todayHours)}
          </div>
          <div style={{ fontSize: '1rem', color: '#64748b', fontWeight: '500' }}>Today</div>
        </div>
        
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '24px',
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#10b981', marginBottom: '8px' }}>
            {formatTime(timeTracking.weekHours)}
          </div>
          <div style={{ fontSize: '1rem', color: '#64748b', fontWeight: '500' }}>This Week</div>
        </div>
        
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '24px',
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ fontSize: '2.5rem', fontWeight: '700', color: '#8b5cf6', marginBottom: '8px' }}>
            {formatTime(timeTracking.monthHours)}
          </div>
          <div style={{ fontSize: '1rem', color: '#64748b', fontWeight: '500' }}>This Month</div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px' }}>
        {/* Manual Controls */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '1.25rem', fontWeight: '600', color: '#1e293b' }}>
            Manual Controls
          </h3>
          <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
            <button
              onClick={startTimeTracking}
              disabled={timeTracking.isTracking}
              style={{
                padding: '12px 24px',
                background: timeTracking.isTracking ? '#e5e7eb' : '#22c55e',
                color: timeTracking.isTracking ? '#9ca3af' : '#ffffff',
                border: 'none',
                borderRadius: '8px',
                cursor: timeTracking.isTracking ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}
            >
              ▶️ Start
            </button>
            <button
              onClick={stopTimeTracking}
              disabled={!timeTracking.isTracking}
              style={{
                padding: '12px 24px',
                background: !timeTracking.isTracking ? '#e5e7eb' : '#ef4444',
                color: !timeTracking.isTracking ? '#9ca3af' : '#ffffff',
                border: 'none',
                borderRadius: '8px',
                cursor: !timeTracking.isTracking ? 'not-allowed' : 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
              }}
            >
              ⏹️ Stop
            </button>
          </div>
          <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>
            Time tracking starts automatically when you visit this page and stops when you leave.
          </p>
        </div>

        {/* Productivity Insights */}
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '24px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '1.25rem', fontWeight: '600', color: '#1e293b' }}>
            Productivity Insights
          </h3>
          <div style={{ display: 'grid', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#64748b' }}>Most Productive Day:</span>
              <span style={{ fontWeight: '600', color: '#1e293b' }}>
                {mostProductive.day ? new Date(mostProductive.day).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#64748b' }}>Best Day Hours:</span>
              <span style={{ fontWeight: '600', color: '#1e293b' }}>
                {formatTime(mostProductive.hours)}
              </span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#64748b' }}>Total Sessions:</span>
              <span style={{ fontWeight: '600', color: '#1e293b' }}>{totalSessions}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#64748b' }}>Avg Session Length:</span>
              <span style={{ fontWeight: '600', color: '#1e293b' }}>
                {formatTime(avgSessionLength)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Sessions */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '24px',
        marginTop: '24px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '1.25rem', fontWeight: '600', color: '#1e293b' }}>
          Recent Sessions
        </h3>
        {getRecentSessions().length > 0 ? (
          <div style={{ display: 'grid', gap: '12px' }}>
            {getRecentSessions().map(session => (
              <div key={session.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '12px 16px',
                background: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0'
              }}>
                <div>
                  <div style={{ fontWeight: '500', color: '#1e293b' }}>
                    {new Date(session.start).toLocaleDateString()}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                    {new Date(session.start).toLocaleTimeString()} - {new Date(session.end).toLocaleTimeString()}
                  </div>
                </div>
                <div style={{ fontWeight: '600', color: '#3b82f6' }}>
                  {formatTime(session.duration)}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p style={{ color: '#64748b', textAlign: 'center', margin: '20px 0' }}>
            No sessions recorded yet. Start tracking to see your productivity data!
          </p>
        )}
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
      `}</style>
    </div>
  );
};

export default AdminTracker;








