import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import launchSchedule from '../../data/startup_launch_schedule.json';

const AdminLaunch = () => {
  const navigate = useNavigate();
  const [currentWeek, setCurrentWeek] = useState(1);
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewMode, setViewMode] = useState('overview'); // overview, daily, weekly, monthly

  // Get current date and calculate progress
  const today = new Date();
  const startDate = new Date(launchSchedule.launchTimeline.startDate);
  const launchDate = new Date(launchSchedule.launchTimeline.launchDate);
  const daysElapsed = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
  const totalDays = Math.floor((launchDate - startDate) / (1000 * 60 * 60 * 24));
  const progressPercentage = Math.min((daysElapsed / totalDays) * 100, 100);

  // Get today's tasks
  const todayString = today.toISOString().split('T')[0];
  const todaySchedule = launchSchedule.dailySchedule.find(day => day.date === todayString);

  // Get current week's data
  const currentWeekData = launchSchedule.weeklyGoals.find(week => week.week === currentWeek);
  const currentWeekDays = launchSchedule.dailySchedule.filter(day => day.week === currentWeek);

  // Calculate completion stats
  const completedTasks = launchSchedule.dailySchedule.filter(day => 
    new Date(day.date) < today
  ).length;
  const totalTasks = launchSchedule.dailySchedule.length;
  const completionRate = (completedTasks / totalTasks) * 100;

  const getStatusColor = (priority) => {
    switch (priority) {
      case 'High': return '#ef4444';
      case 'Medium': return '#f59e0b';
      case 'Low': return '#22c55e';
      default: return '#6b7280';
    }
  };

  const getCategoryColor = (category) => {
    switch (category) {
      case 'Backend': return '#3b82f6';
      case 'Frontend': return '#10b981';
      case 'AI': return '#8b5cf6';
      case 'UX/UI': return '#f59e0b';
      case 'Testing': return '#ef4444';
      case 'Marketing': return '#ec4899';
      case 'Analytics': return '#06b6d4';
      case 'Security': return '#84cc16';
      default: return '#6b7280';
    }
  };

  const renderOverview = () => (
    <div>
      {/* Launch Progress */}
      <div style={{
        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
        borderRadius: '16px',
        padding: '32px',
        color: '#ffffff',
        marginBottom: '24px',
        boxShadow: '0 8px 32px rgba(59, 130, 246, 0.3)'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ margin: '0 0 8px 0', fontSize: '2.5rem', fontWeight: '700' }}>
              🚀 Startup Launch Dashboard
            </h1>
            <p style={{ margin: 0, fontSize: '1.1rem', opacity: 0.9 }}>
              {daysElapsed} days completed • {totalDays - daysElapsed} days to launch
            </p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '3rem', fontWeight: '700', marginBottom: '8px' }}>
              {Math.round(progressPercentage)}%
            </div>
            <div style={{ fontSize: '1rem', opacity: 0.9 }}>Complete</div>
          </div>
        </div>
        
        {/* Progress Bar */}
        <div style={{
          width: '100%',
          height: '12px',
          background: 'rgba(255, 255, 255, 0.2)',
          borderRadius: '6px',
          overflow: 'hidden',
          marginBottom: '16px'
        }}>
          <div style={{
            width: `${progressPercentage}%`,
            height: '100%',
            background: '#ffffff',
            borderRadius: '6px',
            transition: 'width 0.3s ease'
          }}></div>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', opacity: 0.8 }}>
          <span>Started: {startDate.toLocaleDateString()}</span>
          <span>Launch: {launchDate.toLocaleDateString()}</span>
        </div>
      </div>

      {/* Key Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#3b82f6', marginBottom: '8px' }}>
            {completedTasks}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Days Completed</div>
        </div>
        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#10b981', marginBottom: '8px' }}>
            {Math.round(completionRate)}%
          </div>
          <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Completion Rate</div>
        </div>
        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#f59e0b', marginBottom: '8px' }}>
            {currentWeek}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Current Week</div>
        </div>
        <div style={{
          background: '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          textAlign: 'center',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ fontSize: '2rem', fontWeight: '700', color: '#8b5cf6', marginBottom: '8px' }}>
            {totalDays - daysElapsed}
          </div>
          <div style={{ fontSize: '0.9rem', color: '#64748b' }}>Days Remaining</div>
        </div>
      </div>

      {/* Today's Focus */}
      {todaySchedule && (
        <div style={{
          background: '#ffffff',
          borderRadius: '16px',
          padding: '24px',
          marginBottom: '24px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ margin: '0 0 20px 0', fontSize: '1.5rem', fontWeight: '600', color: '#1e293b' }}>
            🎯 Today's Focus: {todaySchedule.focus}
          </h3>
          <div style={{ display: 'grid', gap: '16px' }}>
            {todaySchedule.tasks.map((task, index) => (
              <div key={index} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '16px',
                background: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', color: '#1e293b', marginBottom: '4px' }}>
                    {task.time} - {task.task}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                    {task.expectedOutcome}
                  </div>
                </div>
                <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                  <span style={{
                    padding: '4px 8px',
                    background: getCategoryColor(task.category) + '20',
                    color: getCategoryColor(task.category),
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: '500'
                  }}>
                    {task.category}
                  </span>
                  <span style={{
                    padding: '4px 8px',
                    background: getStatusColor(task.priority) + '20',
                    color: getStatusColor(task.priority),
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: '500'
                  }}>
                    {task.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Weekly Goals */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '24px',
        marginBottom: '24px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '1.5rem', fontWeight: '600', color: '#1e293b' }}>
          📅 Week {currentWeek} Goals: {currentWeekData?.theme}
        </h3>
        <div style={{ display: 'grid', gap: '12px' }}>
          {currentWeekData?.goals.map((goal, index) => (
            <div key={index} style={{
              display: 'flex',
              alignItems: 'center',
              padding: '12px 16px',
              background: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{
                width: '8px',
                height: '8px',
                background: '#3b82f6',
                borderRadius: '50%',
                marginRight: '12px'
              }}></div>
              <span style={{ color: '#1e293b', fontWeight: '500' }}>{goal}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Key Milestones */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '1.5rem', fontWeight: '600', color: '#1e293b' }}>
          🏆 Key Milestones
        </h3>
        <div style={{ display: 'grid', gap: '16px' }}>
          {launchSchedule.keyMilestones.map((milestone, index) => {
            const milestoneDate = new Date(milestone.date);
            const isCompleted = milestoneDate < today;
            const isCurrent = milestoneDate.toDateString() === today.toDateString();
            
            return (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                padding: '16px',
                background: isCompleted ? '#f0fdf4' : isCurrent ? '#fef3c7' : '#f8fafc',
                borderRadius: '8px',
                border: `1px solid ${isCompleted ? '#bbf7d0' : isCurrent ? '#fde68a' : '#e2e8f0'}`,
                opacity: isCompleted ? 0.7 : 1
              }}>
                <div style={{
                  width: '12px',
                  height: '12px',
                  background: isCompleted ? '#22c55e' : isCurrent ? '#f59e0b' : '#6b7280',
                  borderRadius: '50%',
                  marginRight: '16px'
                }}></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', color: '#1e293b', marginBottom: '4px' }}>
                    {milestone.milestone}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                    {milestone.description}
                  </div>
                </div>
                <div style={{ fontSize: '0.875rem', color: '#64748b', fontWeight: '500' }}>
                  {milestoneDate.toLocaleDateString()}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const renderDailyView = () => (
    <div>
      <h2 style={{ margin: '0 0 24px 0', fontSize: '2rem', fontWeight: '600', color: '#1e293b' }}>
        📅 Daily Schedule
      </h2>
      <div style={{ display: 'grid', gap: '16px' }}>
        {launchSchedule.dailySchedule.map((day, index) => (
          <div key={index} style={{
            background: '#ffffff',
            borderRadius: '12px',
            padding: '20px',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e2e8f0',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
            ':hover': {
              boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)'
            }
          }}
          onClick={() => setSelectedDate(day.date)}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <div>
                <h3 style={{ margin: '0 0 4px 0', fontSize: '1.25rem', fontWeight: '600', color: '#1e293b' }}>
                  {day.day} - {new Date(day.date).toLocaleDateString()}
                </h3>
                <p style={{ margin: 0, color: '#64748b', fontSize: '1rem' }}>
                  Week {day.week} • {day.focus}
                </p>
              </div>
              <div style={{ display: 'flex', gap: '8px' }}>
                {day.tasks.map((task, taskIndex) => (
                  <span key={taskIndex} style={{
                    padding: '4px 8px',
                    background: getCategoryColor(task.category) + '20',
                    color: getCategoryColor(task.category),
                    borderRadius: '4px',
                    fontSize: '0.75rem',
                    fontWeight: '500'
                  }}>
                    {task.category}
                  </span>
                ))}
              </div>
            </div>
            <div style={{ display: 'grid', gap: '8px' }}>
              {day.tasks.map((task, taskIndex) => (
                <div key={taskIndex} style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  padding: '8px 12px',
                  background: '#f8fafc',
                  borderRadius: '6px'
                }}>
                  <span style={{ fontSize: '0.875rem', color: '#1e293b' }}>
                    {task.time} - {task.task}
                  </span>
                  <span style={{
                    padding: '2px 6px',
                    background: getStatusColor(task.priority) + '20',
                    color: getStatusColor(task.priority),
                    borderRadius: '3px',
                    fontSize: '0.7rem',
                    fontWeight: '500'
                  }}>
                    {task.priority}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderWeeklyView = () => (
    <div>
      <h2 style={{ margin: '0 0 24px 0', fontSize: '2rem', fontWeight: '600', color: '#1e293b' }}>
        📊 Weekly Overview
      </h2>
      <div style={{ display: 'grid', gap: '20px' }}>
        {launchSchedule.weeklyGoals.map((week, index) => (
          <div key={index} style={{
            background: '#ffffff',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: '600', color: '#1e293b' }}>
                Week {week.week}: {week.theme}
              </h3>
              <span style={{
                padding: '6px 12px',
                background: week.week === currentWeek ? '#3b82f6' : '#6b7280',
                color: '#ffffff',
                borderRadius: '6px',
                fontSize: '0.875rem',
                fontWeight: '500'
              }}>
                {week.week === currentWeek ? 'Current' : week.week < currentWeek ? 'Completed' : 'Upcoming'}
              </span>
            </div>
            <div style={{ display: 'grid', gap: '12px' }}>
              {week.goals.map((goal, goalIndex) => (
                <div key={goalIndex} style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '12px 16px',
                  background: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0'
                }}>
                  <div style={{
                    width: '8px',
                    height: '8px',
                    background: '#3b82f6',
                    borderRadius: '50%',
                    marginRight: '12px'
                  }}></div>
                  <span style={{ color: '#1e293b', fontWeight: '500' }}>{goal}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

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
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
          <div>
            <h1 style={{ margin: '0 0 8px 0', fontSize: '2.5rem', fontWeight: '700', color: '#1e293b' }}>
              🚀 Startup Launch Dashboard
            </h1>
            <p style={{ margin: 0, color: '#64748b', fontSize: '1.1rem' }}>
              Complete startup launch schedule with daily 2-hour work blocks
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

        {/* View Toggle */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {['overview', 'daily', 'weekly'].map(view => (
            <button
              key={view}
              onClick={() => setViewMode(view)}
              style={{
                padding: '12px 24px',
                background: viewMode === view ? '#3b82f6' : '#f1f5f9',
                color: viewMode === view ? '#ffffff' : '#64748b',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '1rem',
                fontWeight: '600',
                textTransform: 'capitalize',
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                transition: 'all 0.2s ease'
              }}
            >
              {view}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      {viewMode === 'overview' && renderOverview()}
      {viewMode === 'daily' && renderDailyView()}
      {viewMode === 'weekly' && renderWeeklyView()}
    </div>
  );
};

export default AdminLaunch;


