import React from 'react';
import { useNavigate } from 'react-router-dom';

const About = () => {
  const navigate = useNavigate();

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '800px',
        margin: '0 auto',
        background: '#ffffff',
        borderRadius: '16px',
        padding: '40px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <h1 style={{ 
            margin: '0 0 16px 0', 
            fontSize: '2.5rem', 
            fontWeight: '700', 
            color: '#1e293b',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            About Unschooling
          </h1>
          <p style={{ 
            margin: 0, 
            color: '#64748b', 
            fontSize: '1.1rem',
            lineHeight: '1.6'
          }}>
            Empowering children through personalized, engaging learning experiences
          </p>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ 
            margin: '0 0 16px 0', 
            fontSize: '1.8rem', 
            fontWeight: '600', 
            color: '#1e293b' 
          }}>
            🎯 Our Mission
          </h2>
          <p style={{ 
            margin: '0 0 16px 0', 
            color: '#64748b', 
            fontSize: '1rem',
            lineHeight: '1.6'
          }}>
            At Unschooling, we believe every child has unique learning needs and interests. Our platform 
            provides personalized educational experiences that adapt to each child's learning style, pace, 
            and interests, making learning fun, engaging, and effective.
          </p>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ 
            margin: '0 0 16px 0', 
            fontSize: '1.8rem', 
            fontWeight: '600', 
            color: '#1e293b' 
          }}>
            🌟 What We Offer
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            <div style={{
              padding: '20px',
              background: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e2e8f0'
            }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '1.2rem', fontWeight: '600', color: '#1e293b' }}>
                📚 Comprehensive Learning
              </h3>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5' }}>
                Over 400 topics across Finance, Entrepreneurship, Communication, and AI for ages 3-12.
              </p>
            </div>
            <div style={{
              padding: '20px',
              background: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e2e8f0'
            }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '1.2rem', fontWeight: '600', color: '#1e293b' }}>
                🎮 Interactive Activities
              </h3>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5' }}>
                800+ hands-on activities designed to make learning engaging and memorable.
              </p>
            </div>
            <div style={{
              padding: '20px',
              background: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e2e8f0'
            }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '1.2rem', fontWeight: '600', color: '#1e293b' }}>
                📊 Progress Tracking
              </h3>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5' }}>
                Detailed analytics and progress reports for parents and children.
              </p>
            </div>
            <div style={{
              padding: '20px',
              background: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e2e8f0'
            }}>
              <h3 style={{ margin: '0 0 12px 0', fontSize: '1.2rem', fontWeight: '600', color: '#1e293b' }}>
                🏆 Achievement System
              </h3>
              <p style={{ margin: 0, color: '#64748b', fontSize: '0.9rem', lineHeight: '1.5' }}>
                Gamified learning with badges, streaks, and milestones to motivate children.
              </p>
            </div>
          </div>
        </div>

        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ 
            margin: '0 0 16px 0', 
            fontSize: '1.8rem', 
            fontWeight: '600', 
            color: '#1e293b' 
          }}>
            🛡️ Safety & Privacy
          </h2>
          <p style={{ 
            margin: '0 0 16px 0', 
            color: '#64748b', 
            fontSize: '1rem',
            lineHeight: '1.6'
          }}>
            We prioritize your child's safety and privacy. Our platform is COPPA compliant and uses 
            industry-standard security measures to protect your family's data. All content is 
            age-appropriate and regularly reviewed by our educational experts.
          </p>
        </div>

        <div style={{ textAlign: 'center', marginTop: '40px' }}>
          <button
            onClick={() => navigate('/')}
            style={{
              padding: '12px 24px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
              marginRight: '12px'
            }}
          >
            ← Back to Home
          </button>
          <button
            onClick={() => navigate('/plans')}
            style={{
              padding: '12px 24px',
              background: '#22c55e',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontSize: '1rem',
              fontWeight: '600',
              boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
            }}
          >
            View Pricing
          </button>
        </div>
      </div>
    </div>
  );
};

export default About;
