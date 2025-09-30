import React from 'react';
import { useNavigate } from 'react-router-dom';

const ContentManagementMain = () => {
  const navigate = useNavigate();

  const contentFeatures = [
    {
      title: '📚 Content Library',
      description: 'Manage all learning content, topics, and activities',
      features: ['400+ Topics', '800+ Activities', '4 Niches', '10 Age Groups'],
      action: 'View Library',
      route: '/admin/content-library',
      color: '#22c55e'
    },
    {
      title: '📊 Content Analytics',
      description: 'Analyze content performance and usage statistics',
      features: ['Usage Analytics', 'Performance Metrics', 'Content Insights', 'Trend Analysis'],
      action: 'View Analytics',
      route: '/admin/content-analytics',
      color: '#3b82f6'
    },
    {
      title: '📋 Content Inventory',
      description: 'Complete overview of all content pieces and resources',
      features: ['1,210 Total Pieces', 'Content Distribution', 'Quality Metrics', 'Coverage Analysis'],
      action: 'View Inventory',
      route: '/admin/content-inventory',
      color: '#8b5cf6'
    },
    {
      title: '📈 Progress Tracking',
      description: 'Monitor child learning progress and achievements',
      features: ['Individual Progress', 'Achievement Tracking', 'Learning Analytics', 'Performance Reports'],
      action: 'View Progress',
      route: '/admin/progress',
      color: '#f59e0b'
    }
  ];

  const quickActions = [
    {
      title: 'Add New Content',
      description: 'Create new learning topics and activities',
      icon: '➕',
      route: '/admin/content-library',
      color: '#22c55e'
    },
    {
      title: 'View Existing Content',
      description: 'Browse and manage current content library',
      icon: '📖',
      route: '/admin/content-analytics',
      color: '#3b82f6'
    },
    {
      title: 'Content Statistics',
      description: 'View comprehensive content statistics',
      icon: '📊',
      route: '/admin/content-inventory',
      color: '#8b5cf6'
    },
    {
      title: 'Child Progress',
      description: 'Monitor learning progress and achievements',
      icon: '👶',
      route: '/admin/progress',
      color: '#f59e0b'
    }
  ];

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
              📚 Content Management Hub
            </h1>
            <p style={{ margin: 0, color: '#64748b', fontSize: '1.1rem' }}>
              Centralized platform for managing all learning content, analytics, and progress tracking
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

        {/* Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div style={{
            padding: '20px',
            background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
            color: 'white',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '4px' }}>400</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Learning Topics</div>
          </div>
          <div style={{
            padding: '20px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
            color: 'white',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '4px' }}>800</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Activities</div>
          </div>
          <div style={{
            padding: '20px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
            color: 'white',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '4px' }}>1,210</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Total Content</div>
          </div>
          <div style={{
            padding: '20px',
            background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
            color: 'white',
            borderRadius: '12px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '4px' }}>4</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Learning Niches</div>
          </div>
        </div>
      </div>

      {/* Main Features */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '32px',
        marginBottom: '24px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0'
      }}>
        <h2 style={{ margin: '0 0 24px 0', fontSize: '1.8rem', fontWeight: '600', color: '#1e293b' }}>
          🎯 Content Management Features
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '24px' }}>
          {contentFeatures.map((feature, index) => (
            <div key={index} style={{
              padding: '24px',
              background: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              transition: 'all 0.3s ease'
            }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '1.3rem', fontWeight: '600', color: '#1e293b' }}>
                {feature.title}
              </h3>
              <p style={{ margin: '0 0 16px 0', color: '#64748b', fontSize: '0.95rem', lineHeight: '1.5' }}>
                {feature.description}
              </p>
              
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ margin: '0 0 8px 0', fontSize: '0.9rem', fontWeight: '600', color: '#374151' }}>
                  Key Features:
                </h4>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                  {feature.features.map((item, idx) => (
                    <div key={idx} style={{
                      padding: '4px 8px',
                      background: 'rgba(102, 126, 234, 0.1)',
                      borderRadius: '4px',
                      fontSize: '0.8rem',
                      color: '#4f46e5'
                    }}>
                      {item}
                    </div>
                  ))}
                </div>
              </div>
              
              <button
                onClick={() => navigate(feature.route)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  background: feature.color,
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                  transition: 'all 0.3s ease'
                }}
                onMouseOver={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
                }}
                onMouseOut={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                }}
              >
                {feature.action}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0'
      }}>
        <h2 style={{ margin: '0 0 24px 0', fontSize: '1.8rem', fontWeight: '600', color: '#1e293b' }}>
          ⚡ Quick Actions
        </h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => navigate(action.route)}
              style={{
                padding: '20px',
                background: '#f8fafc',
                border: '1px solid #e2e8f0',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                textAlign: 'left'
              }}
              onMouseOver={(e) => {
                e.target.style.background = '#f1f5f9';
                e.target.style.borderColor = action.color;
                e.target.style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                e.target.style.background = '#f8fafc';
                e.target.style.borderColor = '#e2e8f0';
                e.target.style.transform = 'translateY(0)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', marginBottom: '12px' }}>
                <span style={{ fontSize: '1.5rem', marginRight: '12px' }}>{action.icon}</span>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: '600', color: '#1e293b' }}>
                  {action.title}
                </h3>
              </div>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', lineHeight: '1.4' }}>
                {action.description}
              </p>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ContentManagementMain;
