import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MinimalBackButton from '../../components/ui/MinimalBackButton';

const WhatWeDoPage = () => {
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    position: 'relative',
  };

  const heroStyle = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: isMobile ? '4rem 1rem 2rem' : '6rem 2rem 4rem',
    textAlign: 'center',
    position: 'relative',
  };

  const wheelContainerStyle = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: isMobile ? '2rem 0' : '3rem 0',
    padding: isMobile ? '0 1rem' : '0',
  };

  const wheelStyle = {
    width: isMobile ? '280px' : '400px',
    height: isMobile ? '280px' : '400px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
  };

  const centerCircleStyle = {
    width: isMobile ? '80px' : '120px',
    height: isMobile ? '80px' : '120px',
    borderRadius: '50%',
    background: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: isMobile ? '1rem' : '1.5rem',
    fontWeight: 'bold',
    color: '#667eea',
    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
  };

  const wheelItemStyle = {
    position: 'absolute',
    fontSize: isMobile ? '0.7rem' : '0.9rem',
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    width: isMobile ? '60px' : '80px',
  };

  const sectionStyle = {
    padding: isMobile ? '2rem 1rem' : '4rem 2rem',
    maxWidth: '1200px',
    margin: '0 auto',
  };

  const cardGridStyle = {
    display: 'grid',
    gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: isMobile ? '1.5rem' : '2rem',
    marginTop: isMobile ? '2rem' : '3rem',
  };

  const cardStyle = {
    background: 'white',
    borderRadius: '16px',
    padding: isMobile ? '1.5rem' : '2rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    border: '1px solid #e2e8f0',
    transition: 'all 0.3s ease',
  };

  const headingStyle = {
    fontSize: isMobile ? '2rem' : '2.5rem',
    textAlign: 'center',
    marginBottom: '1rem',
    color: '#1e293b',
    fontWeight: '700',
    lineHeight: '1.2',
  };

  const heroHeadingStyle = {
    fontSize: isMobile ? '2rem' : '3rem',
    margin: '0 0 1rem 0',
    fontWeight: '700',
    lineHeight: '1.2',
  };

  return (
    <div style={containerStyle}>
      <MinimalBackButton 
        heroColors={{
          backgroundColor: '#f8fafc',
          primaryColor: '#667eea',
          nicheColor: '#764ba2'
        }}
      />
      
      {/* Hero Section */}
      <div style={heroStyle}>
        <h1 style={heroHeadingStyle}>
          What We Do
        </h1>
        <p style={{ fontSize: isMobile ? '1rem' : '1.2rem', margin: 0, opacity: 0.9 }}>
          Empowering children through innovative learning approaches
        </p>
      </div>

      {/* Learning Strategy Wheel */}
      <div style={sectionStyle}>
        <h2 style={headingStyle}>
          Our Learning Strategy
        </h2>
        
        <div style={wheelContainerStyle}>
          <div style={wheelStyle}>
            <div style={centerCircleStyle}>
              UNLEARN
            </div>
            
            {/* Wheel Items */}
            <div style={{...wheelItemStyle, top: '20px', left: '50%', transform: 'translateX(-50%)'}}>
              NICHES
            </div>
            <div style={{...wheelItemStyle, top: '50%', right: '20px', transform: 'translateY(-50%)'}}>
              PATHWAYS
            </div>
            <div style={{...wheelItemStyle, bottom: '20px', left: '50%', transform: 'translateX(-50%)'}}>
              ESSENTIAL<br/>GROWTH
            </div>
            <div style={{...wheelItemStyle, top: '50%', left: '20px', transform: 'translateY(-50%)'}}>
              COLLABORATIVE<br/>COMMUNICATION
            </div>
          </div>
        </div>

        <p style={{ 
          textAlign: 'center', 
          fontSize: isMobile ? '0.95rem' : '1.1rem', 
          color: '#64748b',
          maxWidth: '800px',
          margin: isMobile ? '1.5rem auto' : '2rem auto',
          lineHeight: '1.5',
          padding: isMobile ? '0 1rem' : '0'
        }}>
          Our comprehensive approach combines specialized niches with essential growth areas, 
          creating pathways for collaborative communication and holistic development.
        </p>
      </div>

      {/* 4 Core Pillars */}
      <div style={{...sectionStyle, background: '#f8fafc'}}>
        <h2 style={headingStyle}>
          4 Core Pillars
        </h2>
        
        <div style={cardGridStyle}>
          <div style={cardStyle}>
            <div style={{ fontSize: isMobile ? '2.5rem' : '3rem', marginBottom: '1rem' }}>🎯</div>
            <h3 style={{ fontSize: isMobile ? '1.3rem' : '1.5rem', marginBottom: '1rem', color: '#1e293b' }}>
              NICHES
            </h3>
            <p style={{ color: '#64748b', lineHeight: '1.6', fontSize: isMobile ? '0.9rem' : '1rem' }}>
              Specialized learning areas tailored to your child's unique interests and talents.
            </p>
          </div>
          
          <div style={cardStyle}>
            <div style={{ fontSize: isMobile ? '2.5rem' : '3rem', marginBottom: '1rem' }}>🌱</div>
            <h3 style={{ fontSize: isMobile ? '1.3rem' : '1.5rem', marginBottom: '1rem', color: '#1e293b' }}>
              ESSENTIAL GROWTH
            </h3>
            <p style={{ color: '#64748b', lineHeight: '1.6', fontSize: isMobile ? '0.9rem' : '1rem' }}>
              Foundational skills that every child needs for success in life and learning.
            </p>
          </div>
          
          <div style={cardStyle}>
            <div style={{ fontSize: isMobile ? '2.5rem' : '3rem', marginBottom: '1rem' }}>🛤️</div>
            <h3 style={{ fontSize: isMobile ? '1.3rem' : '1.5rem', marginBottom: '1rem', color: '#1e293b' }}>
              PATHWAYS
            </h3>
            <p style={{ color: '#64748b', lineHeight: '1.6', fontSize: isMobile ? '0.9rem' : '1rem' }}>
              Clear routes connecting different learning areas and building comprehensive skills.
            </p>
          </div>
          
          <div style={cardStyle}>
            <div style={{ fontSize: isMobile ? '2.5rem' : '3rem', marginBottom: '1rem' }}>🤝</div>
            <h3 style={{ fontSize: isMobile ? '1.3rem' : '1.5rem', marginBottom: '1rem', color: '#1e293b' }}>
              COLLABORATIVE COMMUNICATION
            </h3>
            <p style={{ color: '#64748b', lineHeight: '1.6', fontSize: isMobile ? '0.9rem' : '1rem' }}>
              Building strong relationships and communication skills through collaborative learning.
            </p>
          </div>
        </div>
      </div>

      {/* How We're Different */}
      <div style={sectionStyle}>
        <h2 style={headingStyle}>
          How We're Different
        </h2>
        
        <div style={cardGridStyle}>
          <div style={cardStyle}>
            <div style={{ fontSize: isMobile ? '2.5rem' : '3rem', marginBottom: '1rem' }}>🎨</div>
            <h3 style={{ fontSize: isMobile ? '1.3rem' : '1.5rem', marginBottom: '1rem', color: '#1e293b' }}>
              Creative Approach
            </h3>
            <p style={{ color: '#64748b', lineHeight: '1.6', fontSize: isMobile ? '0.9rem' : '1rem' }}>
              We move beyond traditional rectangular learning tiles to embrace imaginative, circular learning experiences.
            </p>
          </div>
          
          <div style={cardStyle}>
            <div style={{ fontSize: isMobile ? '2.5rem' : '3rem', marginBottom: '1rem' }}>🌈</div>
            <h3 style={{ fontSize: isMobile ? '1.3rem' : '1.5rem', marginBottom: '1rem', color: '#1e293b' }}>
              Cohesive Design
            </h3>
            <p style={{ color: '#64748b', lineHeight: '1.6', fontSize: isMobile ? '0.9rem' : '1rem' }}>
              Our color-coded system creates a beautiful, cohesive learning environment that inspires.
            </p>
          </div>
          
          <div style={cardStyle}>
            <div style={{ fontSize: isMobile ? '2.5rem' : '3rem', marginBottom: '1rem' }}>🚀</div>
            <h3 style={{ fontSize: isMobile ? '1.3rem' : '1.5rem', marginBottom: '1rem', color: '#1e293b' }}>
              Wow Factor
            </h3>
            <p style={{ color: '#64748b', lineHeight: '1.6', fontSize: isMobile ? '0.9rem' : '1rem' }}>
              Every element is designed to create excitement and engagement in the learning process.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatWeDoPage;
