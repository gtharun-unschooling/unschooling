import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { db } from '../../firebase';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import MinimalBackButton from '../../components/ui/MinimalBackButton';
import { colors, spacing, typography } from '../../styles/designTokens';

const ActivityLogs = () => {
  const { currentUser } = useAuth();
  const [activityLogs, setActivityLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedChild, setSelectedChild] = useState(null);
  const [children, setChildren] = useState([]);
  const [filter, setFilter] = useState('all'); // all, completed, in-progress, pending

  useEffect(() => {
    if (currentUser) {
      loadChildren();
    }
  }, [currentUser]);

  useEffect(() => {
    if (selectedChild) {
      loadActivityLogs();
    }
  }, [selectedChild]);

  const loadChildren = async () => {
    try {
      const childrenRef = collection(db, `users/${currentUser.uid}/children`);
      const childrenSnapshot = await getDocs(childrenRef);
      
      const childrenList = childrenSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setChildren(childrenList);
      if (childrenList.length > 0) {
        setSelectedChild(childrenList[0]);
      }
    } catch (error) {
      console.error('Error loading children:', error);
    }
  };

  const loadActivityLogs = async () => {
    try {
      setLoading(true);
      
      // Sample data for demonstration
      const sampleLogs = [
        {
          id: '1',
          childId: selectedChild?.id,
          childName: selectedChild?.name,
          activityName: 'Science Experiment: Volcano Eruption',
          niche: 'Science',
          status: 'completed',
          startTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
          endTime: new Date(Date.now() - 1 * 60 * 60 * 1000), // 1 hour ago
          duration: 60, // minutes
          difficulty: 'Beginner',
          skills: ['Problem Solving', 'Scientific Method', 'Observation'],
          materials: ['Baking soda', 'Vinegar', 'Food coloring', 'Bottle'],
          notes: 'Child was very engaged and asked many questions about chemical reactions.',
          rating: 5
        },
        {
          id: '2',
          childId: selectedChild?.id,
          childName: selectedChild?.name,
          activityName: 'Creative Writing: My Dream Adventure',
          niche: 'Creative Writing',
          status: 'in-progress',
          startTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
          endTime: null,
          duration: null,
          difficulty: 'Intermediate',
          skills: ['Creative Writing', 'Imagination', 'Storytelling'],
          materials: ['Paper', 'Pencils', 'Colored markers'],
          notes: 'Child is working on a creative story about space exploration.',
          rating: null
        },
        {
          id: '3',
          childId: selectedChild?.id,
          childName: selectedChild?.name,
          activityName: 'Math Puzzle: Number Patterns',
          niche: 'Mathematics',
          status: 'completed',
          startTime: new Date(Date.now() - 48 * 60 * 60 * 1000), // 2 days ago
          endTime: new Date(Date.now() - 47 * 60 * 60 * 1000), // 1 day 23 hours ago
          duration: 45,
          difficulty: 'Beginner',
          skills: ['Pattern Recognition', 'Number Sense', 'Logical Thinking'],
          materials: ['Number cards', 'Worksheet', 'Pencils'],
          notes: 'Completed all patterns correctly. Showed strong logical thinking.',
          rating: 4
        },
        {
          id: '4',
          childId: selectedChild?.id,
          childName: selectedChild?.name,
          activityName: 'Art Project: Nature Collage',
          niche: 'Arts & Crafts',
          status: 'pending',
          startTime: null,
          endTime: null,
          duration: null,
          difficulty: 'Beginner',
          skills: ['Fine Motor Skills', 'Creativity', 'Nature Awareness'],
          materials: ['Leaves', 'Flowers', 'Glue', 'Paper', 'Scissors'],
          notes: 'Scheduled for this weekend when we can collect natural materials.',
          rating: null
        }
      ];
      
      setActivityLogs(sampleLogs);
    } catch (error) {
      console.error('Error loading activity logs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredLogs = activityLogs.filter(log => {
    if (filter === 'all') return true;
    return log.status === filter;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return '#10b981';
      case 'in-progress': return '#f59e0b';
      case 'pending': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return '✅';
      case 'in-progress': return '🔄';
      case 'pending': return '⏳';
      default: return '❓';
    }
  };

  const formatDuration = (minutes) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const formatDate = (date) => {
    if (!date) return 'N/A';
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    padding: spacing.xl,
    fontFamily: typography.fontFamily.primary
  };

  const cardStyle = {
    background: 'white',
    borderRadius: '16px',
    padding: spacing.xl,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    border: '1px solid #e2e8f0',
    marginBottom: spacing.lg
  };

  const headerStyle = {
    fontSize: '2.5rem',
    fontWeight: '700',
    color: '#1e293b',
    marginBottom: spacing.sm,
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm
  };

  const filterButtonStyle = (isActive) => ({
    padding: '8px 16px',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '0.9rem',
    fontWeight: '600',
    transition: 'all 0.3s ease',
    background: isActive ? '#3b82f6' : '#f1f5f9',
    color: isActive ? 'white' : '#64748b'
  });

  const logItemStyle = {
    padding: spacing.lg,
    border: '1px solid #e2e8f0',
    borderRadius: '12px',
    marginBottom: spacing.md,
    background: 'white',
    transition: 'all 0.3s ease'
  };

  if (loading) {
    return (
      <div style={containerStyle}>
        <MinimalBackButton 
          heroColors={{
            backgroundColor: '#f8fafc',
            primaryColor: '#3b82f6',
            nicheColor: '#1e40af'
          }}
        />
        <div style={{ textAlign: 'center', padding: spacing['2xl'] }}>
          <div style={{ fontSize: '1.2rem', color: '#64748b' }}>Loading activity logs...</div>
        </div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <MinimalBackButton 
        heroColors={{
          backgroundColor: '#f8fafc',
          primaryColor: '#3b82f6',
          nicheColor: '#1e40af'
        }}
      />
      
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={cardStyle}>
          <h1 style={headerStyle}>
            📊 Activity Logs
          </h1>
          <p style={{ fontSize: '1.1rem', color: '#64748b', margin: 0 }}>
            Detailed tracking of all learning activities and progress
          </p>
        </div>

        {/* Child Selection */}
        {children.length > 1 && (
          <div style={cardStyle}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '1.2rem', color: '#1e293b' }}>
              Select Child
            </h3>
            <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap' }}>
              {children.map(child => (
                <button
                  key={child.id}
                  onClick={() => setSelectedChild(child)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    border: '2px solid',
                    borderColor: selectedChild?.id === child.id ? '#3b82f6' : '#e2e8f0',
                    background: selectedChild?.id === child.id ? '#dbeafe' : 'white',
                    color: selectedChild?.id === child.id ? '#1e40af' : '#64748b',
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    fontWeight: '600'
                  }}
                >
                  👶 {child.name}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Filters */}
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 16px 0', fontSize: '1.2rem', color: '#1e293b' }}>
            Filter Activities
          </h3>
          <div style={{ display: 'flex', gap: spacing.sm, flexWrap: 'wrap' }}>
            {[
              { key: 'all', label: 'All Activities' },
              { key: 'completed', label: 'Completed' },
              { key: 'in-progress', label: 'In Progress' },
              { key: 'pending', label: 'Pending' }
            ].map(filterOption => (
              <button
                key={filterOption.key}
                onClick={() => setFilter(filterOption.key)}
                style={filterButtonStyle(filter === filterOption.key)}
              >
                {filterOption.label}
              </button>
            ))}
          </div>
        </div>

        {/* Activity Logs */}
        <div style={cardStyle}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '1.2rem', color: '#1e293b' }}>
            {selectedChild?.name}'s Activities ({filteredLogs.length})
          </h3>
          
          {filteredLogs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: spacing['2xl'], color: '#64748b' }}>
              <div style={{ fontSize: '3rem', marginBottom: spacing.md }}>📝</div>
              <div style={{ fontSize: '1.1rem' }}>No activities found for the selected filter.</div>
            </div>
          ) : (
            <div>
              {filteredLogs.map(log => (
                <div key={log.id} style={logItemStyle}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: spacing.md }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.sm }}>
                        <span style={{ fontSize: '1.2rem' }}>{getStatusIcon(log.status)}</span>
                        <h4 style={{ margin: 0, fontSize: '1.1rem', color: '#1e293b', fontWeight: '600' }}>
                          {log.activityName}
                        </h4>
                        <span style={{
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontSize: '0.7rem',
                          fontWeight: '600',
                          textTransform: 'uppercase',
                          background: getStatusColor(log.status) + '20',
                          color: getStatusColor(log.status)
                        }}>
                          {log.status}
                        </span>
                      </div>
                      
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: spacing.md, marginBottom: spacing.md }}>
                        <div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '2px' }}>Niche</div>
                          <div style={{ fontSize: '0.9rem', fontWeight: '500', color: '#1e293b' }}>{log.niche}</div>
                        </div>
                        
                        <div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '2px' }}>Difficulty</div>
                          <div style={{ fontSize: '0.9rem', fontWeight: '500', color: '#1e293b' }}>{log.difficulty}</div>
                        </div>
                        
                        <div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '2px' }}>Duration</div>
                          <div style={{ fontSize: '0.9rem', fontWeight: '500', color: '#1e293b' }}>{formatDuration(log.duration)}</div>
                        </div>
                        
                        <div>
                          <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '2px' }}>Started</div>
                          <div style={{ fontSize: '0.9rem', fontWeight: '500', color: '#1e293b' }}>{formatDate(log.startTime)}</div>
                        </div>
                      </div>
                      
                      <div style={{ marginBottom: spacing.md }}>
                        <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>Skills Developed</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: spacing.sm }}>
                          {log.skills.map((skill, index) => (
                            <span key={index} style={{
                              padding: '2px 6px',
                              background: '#f0f9ff',
                              color: '#0369a1',
                              borderRadius: '4px',
                              fontSize: '0.7rem'
                            }}>
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      {log.notes && (
                        <div style={{ marginBottom: spacing.md }}>
                          <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '4px' }}>Notes</div>
                          <div style={{ fontSize: '0.9rem', color: '#374151', background: '#f8fafc', padding: spacing.sm, borderRadius: '6px' }}>
                            {log.notes}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ActivityLogs;
