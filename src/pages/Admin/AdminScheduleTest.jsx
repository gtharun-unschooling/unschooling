import React from 'react';
import { useNavigate } from 'react-router-dom';

const AdminScheduleTest = () => {
  const navigate = useNavigate();

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
              📋 Founder's Daily Action Plan
            </h1>
            <p style={{ margin: 0, color: '#64748b', fontSize: '1.1rem' }}>
              Complete startup launch roadmap from foundation to market launch
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
      </div>

      {/* Progress Summary */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        padding: '24px',
        borderRadius: '16px',
        marginBottom: '24px',
        boxShadow: '0 8px 32px rgba(102, 126, 234, 0.3)'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '4px' }}>17%</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Overall Progress</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '4px' }}>6/36</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Tasks Completed</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '4px' }}>12</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Days Remaining</div>
          </div>
          <div>
            <div style={{ fontSize: '2rem', fontWeight: '700', marginBottom: '4px' }}>Sep 25</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>Launch Date</div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div style={{
        background: '#ffffff',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0'
      }}>
        <h3 style={{ margin: '0 0 20px 0', fontSize: '1.5rem', fontWeight: '600', color: '#1e293b' }}>
          🚀 Founder's Daily Action Plan (Sep 12-25, 2024)
        </h3>
        
        {/* Day 1 - Completed */}
        <div style={{
          padding: '20px',
          background: '#f0fdf4',
          borderRadius: '12px',
          border: '1px solid #22c55e',
          marginBottom: '16px'
        }}>
          <h4 style={{ color: '#166534', marginBottom: '16px' }}>✅ Sep 12 - Customer Foundation (COMPLETED)</h4>
          <ul style={{ color: '#166534', lineHeight: '1.6' }}>
            <li>✅ User registration & login flow (4 hours)</li>
            <li>✅ Profile creation & onboarding (3 hours)</li>
            <li>✅ Basic customer dashboard (2 hours)</li>
          </ul>
        </div>

        {/* Day 2 - Completed */}
        <div style={{
          padding: '20px',
          background: '#f0fdf4',
          borderRadius: '12px',
          border: '1px solid #22c55e',
          marginBottom: '16px'
        }}>
          <h4 style={{ color: '#166534', marginBottom: '16px' }}>✅ Sep 13 - Payment & Plans (COMPLETED)</h4>
          <ul style={{ color: '#166534', lineHeight: '1.6' }}>
            <li>✅ Subscription plans setup (3 hours)</li>
            <li>✅ Payment processing integration (4 hours)</li>
            <li>✅ Billing & invoice system (2 hours)</li>
          </ul>
        </div>

        {/* Day 3 - Pending */}
        <div style={{
          padding: '20px',
          background: '#fef3c7',
          borderRadius: '12px',
          border: '1px solid #f59e0b',
          marginBottom: '16px'
        }}>
          <h4 style={{ color: '#92400e', marginBottom: '16px' }}>📚 Sep 14 - Core Features & Content</h4>
          <ul style={{ color: '#92400e', lineHeight: '1.6' }}>
            <li>Build learning content management system (6 hours) - HIGH</li>
            <li>Create child progress tracking dashboard (4 hours) - HIGH</li>
            <li>Set up educational materials database (3 hours) - MEDIUM</li>
            <li>Design parent-child activity scheduler (3 hours) - MEDIUM</li>
          </ul>
        </div>

        {/* Day 4 - Pending */}
        <div style={{
          padding: '20px',
          background: '#fef3c7',
          borderRadius: '12px',
          border: '1px solid #f59e0b',
          marginBottom: '16px'
        }}>
          <h4 style={{ color: '#92400e', marginBottom: '16px' }}>💬 Sep 15 - Communication & Support</h4>
          <ul style={{ color: '#92400e', lineHeight: '1.6' }}>
            <li>Build customer chat & help system (5 hours) - HIGH</li>
            <li>Set up email notification system (3 hours) - HIGH</li>
            <li>Create FAQ & knowledge base (2 hours) - MEDIUM</li>
            <li>Configure SMS alerts for parents (2 hours) - LOW</li>
          </ul>
        </div>

        {/* Remaining Days Summary */}
        <div style={{
          padding: '20px',
          background: '#dbeafe',
          borderRadius: '12px',
          border: '1px solid #3b82f6',
          marginTop: '16px'
        }}>
          <h4 style={{ color: '#1e40af', marginBottom: '16px' }}>📋 Remaining Days (Sep 16-25)</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
            <div style={{ color: '#1e40af' }}>🔧 Sep 16: Backend Infrastructure</div>
            <div style={{ color: '#1e40af' }}>📱 Sep 17: Mobile & Performance</div>
            <div style={{ color: '#1e40af' }}>📊 Sep 18: Analytics & Tracking</div>
            <div style={{ color: '#1e40af' }}>📢 Sep 19: Marketing Foundation</div>
            <div style={{ color: '#1e40af' }}>⚖️ Sep 20: Legal & Compliance</div>
            <div style={{ color: '#1e40af' }}>🧪 Sep 21: Testing & QA</div>
            <div style={{ color: '#1e40af' }}>🧪 Sep 22: Beta Preparation</div>
            <div style={{ color: '#1e40af' }}>📢 Sep 23: Marketing Campaign</div>
            <div style={{ color: '#1e40af' }}>🚀 Sep 24: Final Preparation</div>
            <div style={{ color: '#1e40af' }}>🎉 Sep 25: LAUNCH DAY</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminScheduleTest;
