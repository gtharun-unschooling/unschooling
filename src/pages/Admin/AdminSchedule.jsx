import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdminSchedule = () => {
  const navigate = useNavigate();
  const [scheduleView, setScheduleView] = useState('launch');

  // Founder's Daily Action Plan
  const launchPlan = [
    {
      date: '2024-09-12',
      title: '✅ Customer Foundation (COMPLETED)',
      status: 'completed',
      tasks: [
        { task: '✅ User registration & login flow', time: '4 hours', status: 'completed' },
        { task: '✅ Profile creation & onboarding', time: '3 hours', status: 'completed' },
        { task: '✅ Basic customer dashboard', time: '2 hours', status: 'completed' }
      ]
    },
    {
      date: '2024-09-13',
      title: '✅ Payment & Plans (COMPLETED)',
      status: 'completed',
      tasks: [
        { task: '✅ Subscription plans setup', time: '3 hours', status: 'completed' },
        { task: '✅ Payment processing integration', time: '4 hours', status: 'completed' },
        { task: '✅ Billing & invoice system', time: '2 hours', status: 'completed' }
      ]
    },
    {
      date: '2024-09-14',
      title: '📚 Core Features & Content',
      status: 'pending',
      tasks: [
        { task: '✅ Build learning content management system', time: '6 hours', status: 'completed', priority: 'high' },
        { task: '✅ Create child progress tracking dashboard', time: '4 hours', status: 'completed', priority: 'high' },
        { task: '🔴 Build automated learning schedule generation system (4 agents)', time: '8 hours', status: 'pending', priority: 'high' },
        { task: '🔴 Implement inventory management for activity materials', time: '6 hours', status: 'pending', priority: 'high' },
        { task: 'Set up educational materials database', time: '3 hours', status: 'pending', priority: 'medium' },
        { task: 'Design parent-child activity scheduler', time: '3 hours', status: 'pending', priority: 'medium' }
      ]
    },
    {
      date: '2024-09-15',
      title: '💬 Communication & Support',
      status: 'pending',
      tasks: [
        { task: 'Build customer chat & help system', time: '5 hours', status: 'pending', priority: 'high' },
        { task: 'Set up email notification system', time: '3 hours', status: 'pending', priority: 'high' },
        { task: 'Create FAQ & knowledge base', time: '2 hours', status: 'pending', priority: 'medium' },
        { task: 'Configure SMS alerts for parents', time: '2 hours', status: 'pending', priority: 'low' }
      ]
    },
    {
      date: '2024-09-16',
      title: '🔧 Backend Infrastructure',
      status: 'pending',
      tasks: [
        { task: 'Optimize database & setup backup', time: '4 hours', status: 'pending', priority: 'high' },
        { task: 'Implement API security & rate limiting', time: '3 hours', status: 'pending', priority: 'high' },
        { task: 'Set up server monitoring & logging', time: '2 hours', status: 'pending', priority: 'medium' },
        { task: 'Configure CDN for content delivery', time: '2 hours', status: 'pending', priority: 'medium' }
      ]
    },
    {
      date: '2024-09-17',
      title: '📱 Mobile & Performance',
      status: 'pending',
      tasks: [
        { task: 'Develop mobile app (PWA)', time: '6 hours', status: 'pending', priority: 'high' },
        { task: 'Optimize website speed', time: '3 hours', status: 'pending', priority: 'high' },
        { task: 'Set up push notifications', time: '2 hours', status: 'pending', priority: 'medium' },
        { task: 'Optimize images & lazy loading', time: '2 hours', status: 'pending', priority: 'medium' }
      ]
    },
    {
      date: '2024-09-18',
      title: '📊 Analytics & Tracking',
      status: 'pending',
      tasks: [
        { task: 'Set up Google Analytics & tracking', time: '3 hours', status: 'pending', priority: 'high' },
        { task: 'Implement user behavior tracking', time: '3 hours', status: 'pending', priority: 'high' },
        { task: 'Create conversion funnel analysis', time: '2 hours', status: 'pending', priority: 'medium' },
        { task: 'Build A/B testing framework', time: '2 hours', status: 'pending', priority: 'low' }
      ]
    },
    {
      date: '2024-09-19',
      title: '📢 Marketing Foundation',
      status: 'pending',
      tasks: [
        { task: 'Optimize website for SEO', time: '4 hours', status: 'pending', priority: 'high' },
        { task: 'Set up social media accounts', time: '2 hours', status: 'pending', priority: 'high' },
        { task: 'Create content marketing strategy', time: '3 hours', status: 'pending', priority: 'medium' },
        { task: 'Set up email marketing automation', time: '2 hours', status: 'pending', priority: 'medium' }
      ]
    },
    {
      date: '2024-09-20',
      title: '⚖️ Legal & Compliance',
      status: 'pending',
      tasks: [
        { task: 'Write terms of service & privacy policy', time: '4 hours', status: 'pending', priority: 'high' },
        { task: 'Set up GDPR compliance', time: '3 hours', status: 'pending', priority: 'high' },
        { task: 'Implement child safety & COPPA compliance', time: '3 hours', status: 'pending', priority: 'high' },
        { task: 'Complete business registration & licenses', time: '2 hours', status: 'pending', priority: 'medium' }
      ]
    },
    {
      date: '2024-09-21',
      title: '🧪 Testing & Quality Assurance',
      status: 'pending',
      tasks: [
        { task: 'Set up end-to-end testing automation', time: '4 hours', status: 'pending', priority: 'high' },
        { task: 'Conduct security vulnerability testing', time: '3 hours', status: 'pending', priority: 'high' },
        { task: 'Perform load testing & performance checks', time: '2 hours', status: 'pending', priority: 'medium' },
        { task: 'Execute user acceptance testing', time: '3 hours', status: 'pending', priority: 'medium' }
      ]
    },
    {
      date: '2024-09-22',
      title: '🧪 Beta Launch Preparation',
      status: 'pending',
      tasks: [
        { task: 'Recruit beta users', time: '3 hours', status: 'pending', priority: 'high' },
        { task: 'Build feedback collection system', time: '3 hours', status: 'pending', priority: 'high' },
        { task: 'Create beta testing documentation', time: '2 hours', status: 'pending', priority: 'medium' },
        { task: 'Set up bug tracking & resolution', time: '2 hours', status: 'pending', priority: 'medium' }
      ]
    },
    {
      date: '2024-09-23',
      title: '📢 Marketing Campaign Launch',
      status: 'pending',
      tasks: [
        { task: 'Launch pre-launch marketing campaign', time: '4 hours', status: 'pending', priority: 'high' },
        { task: 'Reach out to influencers & partners', time: '3 hours', status: 'pending', priority: 'high' },
        { task: 'Write press release & create media kit', time: '3 hours', status: 'pending', priority: 'medium' },
        { task: 'Plan launch event', time: '2 hours', status: 'pending', priority: 'medium' }
      ]
    },
    {
      date: '2024-09-24',
      title: '🚀 Final Launch Preparation',
      status: 'pending',
      tasks: [
        { task: 'Set up production environment', time: '3 hours', status: 'pending', priority: 'high' },
        { task: 'Conduct final security audit', time: '2 hours', status: 'pending', priority: 'high' },
        { task: 'Set up launch day monitoring', time: '2 hours', status: 'pending', priority: 'high' },
        { task: 'Train customer support team', time: '2 hours', status: 'pending', priority: 'medium' }
      ]
    },
    {
      date: '2024-09-25',
      title: '🎉 LAUNCH DAY',
      status: 'pending',
      tasks: [
        { task: 'Go live & monitor all systems', time: '8 hours', status: 'pending', priority: 'high' },
        { task: 'Announce launch on social media', time: '2 hours', status: 'pending', priority: 'high' },
        { task: 'Monitor customer onboarding', time: '4 hours', status: 'pending', priority: 'high' },
        { task: 'Resolve real-time issues', time: '6 hours', status: 'pending', priority: 'high' }
      ]
    }
  ];

  // Calculate progress
  const totalTasks = 38; // Updated to include new tasks
  const completedTasks = 6; // Completed tasks (Days 1-2)
  const progressPercentage = Math.round((completedTasks / totalTasks) * 100);
  const daysRemaining = 12;

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
              📋 Startup Launch Schedule
            </h1>
            <p style={{ margin: 0, color: '#64748b', fontSize: '1.1rem' }}>
              Complete roadmap from foundation to market launch - September 12-25, 2024
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

        {/* Progress Summary */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white',
          padding: '24px',
          borderRadius: '12px',
          textAlign: 'center'
        }}>
          <h2 style={{ margin: '0 0 16px 0', fontSize: '1.8rem', fontWeight: '600' }}>
            🚀 Launch Progress Summary
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '20px' }}>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '4px' }}>{progressPercentage}%</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Overall Progress</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '4px' }}>{completedTasks}</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Tasks Completed</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '4px' }}>{daysRemaining}</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Days Remaining</div>
            </div>
            <div>
              <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '4px' }}>Sep 25</div>
              <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Launch Date</div>
            </div>
          </div>
        </div>
      </div>

      {/* Launch Plan */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '32px',
        marginBottom: '24px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0'
      }}>
        <h2 style={{ margin: '0 0 24px 0', fontSize: '1.8rem', fontWeight: '600', color: '#1e293b' }}>
          📅 Daily Action Plan
        </h2>

        {/* Launch Plan Days */}
        <div style={{ display: 'grid', gap: '20px' }}>
          {launchPlan.map((day, index) => (
            <div key={index} style={{
              padding: '24px',
              background: day.status === 'completed' ? '#f0fdf4' : '#f8fafc',
              borderRadius: '12px',
              border: `2px solid ${day.status === 'completed' ? '#22c55e' : '#e2e8f0'}`,
              transition: 'all 0.3s ease'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div>
                  <h3 style={{ margin: '0 0 4px 0', fontSize: '1.3rem', fontWeight: '600', color: '#1e293b' }}>
                    {day.title}
                  </h3>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem' }}>
                    {new Date(day.date).toLocaleDateString('en-US', { 
                      weekday: 'long', 
                      year: 'numeric', 
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </p>
                </div>
                <div style={{
                  padding: '6px 12px',
                  background: day.status === 'completed' ? '#22c55e' : '#f59e0b',
                  color: 'white',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  textTransform: 'uppercase'
                }}>
                  {day.status}
                </div>
              </div>

              {/* Tasks */}
              <div style={{ display: 'grid', gap: '12px' }}>
                {day.tasks.map((task, taskIndex) => (
                  <div key={taskIndex} style={{
                    padding: '16px',
                    background: task.status === 'completed' ? '#ffffff' : '#f1f5f9',
                    borderRadius: '8px',
                    border: `1px solid ${task.status === 'completed' ? '#22c55e' : '#e2e8f0'}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ 
                        fontWeight: '600', 
                        color: '#1e293b', 
                        marginBottom: '4px',
                        textDecoration: task.status === 'completed' ? 'line-through' : 'none',
                        opacity: task.status === 'completed' ? 0.7 : 1
                      }}>
                        {task.task}
                      </div>
                      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <span style={{ 
                          fontSize: '0.8rem', 
                          color: '#64748b',
                          background: '#f1f5f9',
                          padding: '2px 6px',
                          borderRadius: '4px'
                        }}>
                          ⏱️ {task.time}
                        </span>
                        {task.priority && (
                          <span style={{
                            fontSize: '0.8rem',
                            color: task.priority === 'high' ? '#ef4444' : task.priority === 'medium' ? '#f59e0b' : '#22c55e',
                            background: task.priority === 'high' ? '#fef2f2' : task.priority === 'medium' ? '#fef3c7' : '#f0fdf4',
                            padding: '2px 6px',
                            borderRadius: '4px',
                            fontWeight: '600'
                          }}>
                            {task.priority === 'high' ? '🔴 High' : task.priority === 'medium' ? '🟡 Medium' : '🟢 Low'}
                          </span>
                        )}
                      </div>
                    </div>
                    <div style={{
                      padding: '4px 8px',
                      background: task.status === 'completed' ? '#22c55e' : '#f59e0b',
                      color: 'white',
                      borderRadius: '4px',
                      fontSize: '0.7rem',
                      fontWeight: '600',
                      textTransform: 'uppercase'
                    }}>
                      {task.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '24px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '1.25rem', fontWeight: '600', color: '#1e293b' }}>
          Quick Actions
        </h3>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
          <button style={{
            padding: '12px 20px',
            background: '#3b82f6',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '600',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            + Add Task
          </button>
          <button style={{
            padding: '12px 20px',
            background: '#10b981',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '600',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            📅 Calendar View
          </button>
          <button style={{
            padding: '12px 20px',
            background: '#8b5cf6',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '600',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            📊 Analytics
          </button>
          <button style={{
            padding: '12px 20px',
            background: '#f59e0b',
            color: '#ffffff',
            border: 'none',
            borderRadius: '8px',
            cursor: 'pointer',
            fontSize: '0.9rem',
            fontWeight: '600',
            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
          }}>
            📤 Export
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminSchedule;