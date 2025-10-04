import React from 'react';
import { Link } from 'react-router-dom';
import { colors, spacing, typography } from '../../styles/designTokens';

const WhatWeDoPage = () => {
  const containerStyle = {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
    fontFamily: typography.fontFamily.primary,
  };

  // Responsive wheel styles - good for both desktop and mobile
  const wheelStyle = {
    width: 'clamp(300px, 50vw, 600px)',
    height: 'clamp(300px, 50vw, 600px)',
    borderRadius: '50%',
    background: 'conic-gradient(from 0deg, #10b981 0deg, #3b82f6 90deg, #f59e0b 180deg, #ef4444 270deg, #10b981 360deg)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    boxShadow: '0 20px 50px rgba(0,0,0,0.2)',
    border: '6px solid white',
    transition: 'all 0.3s ease'
  };

  const centerStyle = {
    width: 'clamp(100px, 18vw, 150px)',
    height: 'clamp(100px, 18vw, 150px)',
    borderRadius: '50%',
    background: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: 'inset 0 0 30px rgba(0,0,0,0.1)',
    border: '3px solid rgba(255,255,255,0.8)'
  };

  const textStyle = {
    fontSize: 'clamp(0.8rem, 2vw, 1.6rem)',
    fontWeight: 'bold',
    textShadow: '3px 3px 6px rgba(0,0,0,0.4)',
    textAlign: 'center',
    lineHeight: '1.3',
    color: 'white'
  };

  const heroStyle = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    padding: `${spacing['3xl']} ${spacing.xl}`,
    textAlign: 'center',
  };

  const cardStyle = {
    background: 'white',
    borderRadius: '20px',
    padding: spacing['2xl'],
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
    border: '1px solid #e2e8f0',
    transition: 'all 0.3s ease',
    marginBottom: spacing.xl,
  };

  // Enhanced button style that matches the hero section vibe
  const heroButtonStyle = {
    background: 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 50%, #45b7d1 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '25px',
    padding: 'clamp(0.8rem, 2.5vw, 1.2rem) clamp(2rem, 5vw, 3rem)',
    fontSize: 'clamp(1rem, 2.5vw, 1.2rem)',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
    textDecoration: 'none',
    display: 'inline-block',
    position: 'relative',
    overflow: 'hidden',
    boxShadow: '0 8px 25px rgba(255, 107, 107, 0.3), 0 4px 12px rgba(78, 205, 196, 0.2)',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    border: '2px solid rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
  };

  // Hover effects for the hero button
  const heroButtonHoverStyle = {
    transform: 'translateY(-3px) scale(1.05)',
    boxShadow: '0 15px 35px rgba(255, 107, 107, 0.4), 0 8px 20px rgba(78, 205, 196, 0.3)',
    background: 'linear-gradient(135deg, #ff5252 0%, #26c6da 50%, #29b6f6 100%)',
  };

  // Standard button style for other sections
  const buttonStyle = {
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: `${spacing.md} ${spacing.xl}`,
    fontSize: '1rem',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    textDecoration: 'none',
    display: 'inline-block',
  };

  const strategySectionStyle = {
    ...cardStyle,
    background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)',
    border: '2px solid #0ea5e9',
  };

  const experienceSectionStyle = {
    ...cardStyle,
    background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
    border: '2px solid #22c55e',
  };

  const pillarSectionStyle = {
    ...cardStyle,
    background: 'linear-gradient(135deg, #fefce8 0%, #fef3c7 100%)',
    border: '2px solid #eab308',
  };

  const pillarGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: spacing.lg,
    marginTop: spacing.lg,
  };

  const pillarCardStyle = {
    background: 'white',
    borderRadius: '16px',
    padding: spacing.lg,
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
    border: '1px solid #e2e8f0',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
  };

  const ageGroupStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: spacing.md,
    marginTop: spacing.lg,
  };

  const ageCardStyle = {
    background: 'white',
    borderRadius: '12px',
    padding: spacing.md,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
    border: '1px solid #e2e8f0',
    textAlign: 'center',
  };

  return (
    <div style={containerStyle}>
      <style>
        {`
          @keyframes float {
            0%, 100% { transform: translateY(0px) rotate(0deg); }
            25% { transform: translateY(-10px) rotate(2deg); }
            50% { transform: translateY(-5px) rotate(-1deg); }
            75% { transform: translateY(-15px) rotate(1deg); }
          }
        `}
      </style>
      {/* Hero Section */}
      <div style={{
        ...heroStyle,
        position: 'relative',
        overflow: 'hidden'
      }}>
        {/* Background Pattern */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `
            radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
            radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
            radial-gradient(circle at 40% 40%, rgba(255,255,255,0.05) 0%, transparent 50%)
          `,
          pointerEvents: 'none'
        }}></div>
        
        {/* Floating Elements */}
        <div style={{
          position: 'absolute',
          top: '10%',
          left: '5%',
          fontSize: '2rem',
          opacity: 0.3,
          animation: 'float 6s ease-in-out infinite'
        }}>✨</div>
        <div style={{
          position: 'absolute',
          top: '20%',
          right: '10%',
          fontSize: '1.5rem',
          opacity: 0.3,
          animation: 'float 8s ease-in-out infinite reverse'
        }}>🌟</div>
        <div style={{
          position: 'absolute',
          bottom: '15%',
          left: '15%',
          fontSize: '1.8rem',
          opacity: 0.3,
          animation: 'float 7s ease-in-out infinite'
        }}>💫</div>
        
        <div style={{ 
          maxWidth: '1200px', 
          margin: '0 auto', 
          padding: '0 1rem',
          position: 'relative',
          zIndex: 2
        }}>
          <h1 style={{ 
            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)', 
            margin: '0 0 1rem 0', 
            fontWeight: '700',
            textAlign: 'center',
            textShadow: '0 4px 20px rgba(0,0,0,0.3)',
            letterSpacing: '-0.02em'
          }}>
            What We Do 🌟
          </h1>
          
          {/* Decorative line */}
          <div style={{
            width: '120px',
            height: '6px',
            background: 'linear-gradient(90deg, #ffd700, #ff6b6b, #4ecdc4)',
            margin: '0 auto 2rem auto',
            borderRadius: '3px',
            boxShadow: '0 2px 10px rgba(255,255,255,0.3)'
          }}></div>
          
          <p style={{ 
            fontSize: 'clamp(1rem, 2.5vw, 1.2rem)', 
            margin: '0 auto 2rem auto', 
            opacity: 0.95, 
            maxWidth: '800px',
            textAlign: 'center',
            lineHeight: '1.8',
            fontWeight: '500',
            textShadow: '0 2px 10px rgba(0,0,0,0.2)'
          }}>
            Transforming how children learn through personalized, engaging experiences that adapt to their unique needs and interests
          </p>
          
          <div style={{ 
            textAlign: 'center',
            position: 'relative',
            zIndex: 2,
            marginTop: '2rem'
          }}>
            <Link 
              to="/plans" 
              style={heroButtonStyle}
              onMouseEnter={(e) => {
                Object.assign(e.target.style, heroButtonHoverStyle);
              }}
              onMouseLeave={(e) => {
                Object.assign(e.target.style, heroButtonStyle);
              }}
            >
              <span style={{
                position: 'relative',
                zIndex: 2,
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                🚀 Start Your Journey
              </span>
            </Link>
          </div>
        </div>
      </div>

      <div style={{ 
        maxWidth: '1200px', 
        margin: '0 auto', 
        padding: '0 clamp(1rem, 4vw, 2rem)'
      }}>
        {/* Our Strategy - Creative Hexagonal Design */}
        <div style={{
          background: 'linear-gradient(135deg, #ff6b6b 0%, #4ecdc4 50%, #45b7d1 100%)',
          borderRadius: 'clamp(15px, 4vw, 30px)',
          padding: 'clamp(2rem, 6vw, 4rem) clamp(1rem, 4vw, 2rem)',
          position: 'relative',
          overflow: 'hidden',
          marginBottom: spacing['2xl']
        }}>
          {/* Background Pattern */}
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%),
              radial-gradient(circle at 40% 40%, rgba(255,255,255,0.05) 0%, transparent 50%)
            `,
            pointerEvents: 'none'
          }}></div>
          
          {/* Floating Elements */}
          <div style={{
            position: 'absolute',
            top: '10%',
            left: '5%',
            fontSize: '2rem',
            opacity: 0.3,
            animation: 'float 6s ease-in-out infinite'
          }}>✨</div>
          <div style={{
            position: 'absolute',
            top: '20%',
            right: '10%',
            fontSize: '1.5rem',
            opacity: 0.3,
            animation: 'float 8s ease-in-out infinite reverse'
          }}>🌟</div>
          <div style={{
            position: 'absolute',
            bottom: '15%',
            left: '15%',
            fontSize: '1.8rem',
            opacity: 0.3,
            animation: 'float 7s ease-in-out infinite'
          }}>💫</div>
          
          <div style={{ textAlign: 'center', marginBottom: '3rem', position: 'relative', zIndex: 2 }}>
            <h2 style={{ 
              fontSize: '2.5rem', 
              margin: '0 0 1rem 0', 
              color: 'white',
              fontWeight: '800',
              textShadow: '0 4px 20px rgba(0,0,0,0.3)',
              letterSpacing: '-0.02em'
            }}>
              🎯 Our Learning Strategy
            </h2>
            <div style={{
              width: '120px',
              height: '6px',
              background: 'linear-gradient(90deg, #ffd700, #ff6b6b, #4ecdc4)',
              margin: '0 auto 2rem auto',
              borderRadius: '3px',
              boxShadow: '0 2px 10px rgba(255,255,255,0.3)'
            }}></div>
            <p style={{ 
              fontSize: '1.2rem', 
              color: 'rgba(255,255,255,0.95)', 
              lineHeight: '1.8', 
              maxWidth: '900px',
              margin: '0 auto',
              fontWeight: '500',
              textShadow: '0 2px 10px rgba(0,0,0,0.2)'
            }}>
              We believe in learning by doing, not just reading. Our approach is built on action, exploration, and hands-on discovery.
            </p>
          </div>
          
          {/* 3x2 Matrix Strategy Circles - Fixed Layout */}
          <div style={{ 
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: 'clamp(0.5rem, 2vw, 1.5rem)',
            maxWidth: '850px',
            margin: '0 auto',
            position: 'relative',
            zIndex: 2,
            padding: '2rem 0',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            {/* Row 1 */}
            <div style={{
              width: 'clamp(120px, 20vw, 200px)',
              height: 'clamp(120px, 20vw, 200px)',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ff9a9e, #fecfef)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              boxShadow: '0 10px 30px rgba(102, 126, 234, 0.3)',
              border: '4px solid rgba(255,255,255,0.2)',
              padding: 'clamp(0.8rem, 2vw, 1.2rem)',
              margin: '0 auto'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.1)';
              e.target.style.boxShadow = '0 20px 40px rgba(102, 126, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 10px 30px rgba(102, 126, 234, 0.3)';
            }}>
              <div style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', marginBottom: '0.3rem' }}>🚀</div>
              <h3 style={{ fontSize: 'clamp(0.8rem, 1.8vw, 1.2rem)', fontWeight: '700', margin: '0 0 0.3rem 0' }}>EXPLORE</h3>
              <p style={{ fontSize: 'clamp(0.6rem, 1.2vw, 0.8rem)', lineHeight: '1.2', margin: '0', opacity: '0.9' }}>
                Discover new worlds, ideas, and possibilities
              </p>
            </div>

            <div style={{
              width: 'clamp(120px, 20vw, 200px)',
              height: 'clamp(120px, 20vw, 200px)',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #a8edea, #fed6e3)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              boxShadow: '0 10px 30px rgba(240, 147, 251, 0.3)',
              border: '4px solid rgba(255,255,255,0.2)',
              padding: 'clamp(0.8rem, 2vw, 1.2rem)',
              margin: '0 auto'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.1)';
              e.target.style.boxShadow = '0 20px 40px rgba(240, 147, 251, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 10px 30px rgba(240, 147, 251, 0.3)';
            }}>
              <div style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', marginBottom: '0.3rem' }}>💡</div>
              <h3 style={{ fontSize: 'clamp(0.8rem, 1.8vw, 1.2rem)', fontWeight: '700', margin: '0 0 0.3rem 0' }}>INNOVATE</h3>
              <p style={{ fontSize: 'clamp(0.6rem, 1.2vw, 0.8rem)', lineHeight: '1.2', margin: '0', opacity: '0.9' }}>
                Create, invent, and think outside the box
              </p>
            </div>

            <div style={{
              width: 'clamp(120px, 20vw, 200px)',
              height: 'clamp(120px, 20vw, 200px)',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ffecd2, #fcb69f)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              boxShadow: '0 10px 30px rgba(79, 172, 254, 0.3)',
              border: '4px solid rgba(255,255,255,0.2)',
              padding: 'clamp(0.8rem, 2vw, 1.2rem)',
              margin: '0 auto'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.1)';
              e.target.style.boxShadow = '0 20px 40px rgba(79, 172, 254, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 10px 30px rgba(79, 172, 254, 0.3)';
            }}>
              <div style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', marginBottom: '0.3rem' }}>🧠</div>
              <h3 style={{ fontSize: 'clamp(0.8rem, 1.8vw, 1.2rem)', fontWeight: '700', margin: '0 0 0.3rem 0' }}>THINK</h3>
              <p style={{ fontSize: 'clamp(0.6rem, 1.2vw, 0.8rem)', lineHeight: '1.2', margin: '0', opacity: '0.9' }}>
                Analyze, reason, and solve problems creatively
              </p>
            </div>

            {/* Row 2 */}
            <div style={{
              width: 'clamp(120px, 20vw, 200px)',
              height: 'clamp(120px, 20vw, 200px)',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #d299c2, #fef9d7)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              boxShadow: '0 10px 30px rgba(210, 153, 194, 0.3)',
              border: '4px solid rgba(255,255,255,0.2)',
              padding: 'clamp(0.8rem, 2vw, 1.2rem)',
              margin: '0 auto'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.1)';
              e.target.style.boxShadow = '0 20px 40px rgba(210, 153, 194, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 10px 30px rgba(210, 153, 194, 0.3)';
            }}>
              <div style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', marginBottom: '0.3rem' }}>👥</div>
              <h3 style={{ fontSize: 'clamp(0.8rem, 1.8vw, 1.2rem)', fontWeight: '700', margin: '0 0 0.3rem 0' }}>COLLABORATE</h3>
              <p style={{ fontSize: 'clamp(0.6rem, 1.2vw, 0.8rem)', lineHeight: '1.2', margin: '0', opacity: '0.9' }}>
                Work together, share ideas, and learn from others
              </p>
            </div>

            <div style={{
              width: 'clamp(120px, 20vw, 200px)',
              height: 'clamp(120px, 20vw, 200px)',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #ff9a9e, #fad0c4)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              boxShadow: '0 10px 30px rgba(250, 112, 154, 0.3)',
              border: '4px solid rgba(255,255,255,0.2)',
              padding: 'clamp(0.8rem, 2vw, 1.2rem)',
              margin: '0 auto'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.1)';
              e.target.style.boxShadow = '0 20px 40px rgba(250, 112, 154, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 10px 30px rgba(250, 112, 154, 0.3)';
            }}>
              <div style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', marginBottom: '0.3rem' }}>🎨</div>
              <h3 style={{ fontSize: 'clamp(0.8rem, 1.8vw, 1.2rem)', fontWeight: '700', margin: '0 0 0.3rem 0' }}>CREATE</h3>
              <p style={{ fontSize: 'clamp(0.6rem, 1.2vw, 0.8rem)', lineHeight: '1.2', margin: '0', opacity: '0.9' }}>
                Build, design, and bring ideas to life
              </p>
            </div>

            <div style={{
              width: 'clamp(120px, 20vw, 200px)',
              height: 'clamp(120px, 20vw, 200px)',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #a8edea, #fed6e3)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              textAlign: 'center',
              color: 'white',
              cursor: 'pointer',
              transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              boxShadow: '0 10px 30px rgba(168, 237, 234, 0.3)',
              border: '4px solid rgba(255,255,255,0.2)',
              padding: 'clamp(0.8rem, 2vw, 1.2rem)',
              margin: '0 auto'
            }}
            onMouseEnter={(e) => {
              e.target.style.transform = 'scale(1.1)';
              e.target.style.boxShadow = '0 20px 40px rgba(168, 237, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'scale(1)';
              e.target.style.boxShadow = '0 10px 30px rgba(168, 237, 234, 0.3)';
            }}>
              <div style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)', marginBottom: '0.3rem' }}>🏆</div>
              <h3 style={{ fontSize: 'clamp(0.8rem, 1.8vw, 1.2rem)', fontWeight: '700', margin: '0 0 0.3rem 0' }}>ACHIEVE</h3>
              <p style={{ fontSize: 'clamp(0.6rem, 1.2vw, 0.8rem)', lineHeight: '1.2', margin: '0', opacity: '0.9' }}>
                Set goals, work hard, and celebrate success
              </p>
            </div>
          </div>
        </div>

        {/* 4 Core Pillars */}
        <div style={{
          ...experienceSectionStyle,
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          color: 'white'
        }}>
          <h2 style={{ fontSize: '2rem', margin: '0 0 1rem 0', color: 'white', textAlign: 'center' }}>
            🏗️ The 4 Core Pillars of Unschooling
          </h2>
          
          {/* Visual Wheel */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: spacing['2xl'] }}>
            <div style={wheelStyle}>
              <div style={centerStyle}>
              </div>
              
              {/* Pillar 1 - Top */}
              <Link to="/niche" style={{
                position: 'absolute',
                top: '60px',
                left: '50%',
                transform: 'translateX(-50%)',
                ...textStyle,
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateX(-50%) scale(1.1)';
                e.target.style.textShadow = '4px 4px 8px rgba(0,0,0,0.6)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateX(-50%) scale(1)';
                e.target.style.textShadow = '3px 3px 6px rgba(0,0,0,0.4)';
              }}>
                NICHE
              </Link>
              
              {/* Pillar 2 - Right */}
              <Link to="/growth" style={{
                position: 'absolute',
                right: '30px',
                top: '50%',
                transform: 'translateY(-50%)',
                ...textStyle,
                textDecoration: 'none',
                cursor: 'pointer',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-50%) scale(1.1)';
                e.target.style.textShadow = '4px 4px 8px rgba(0,0,0,0.6)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(-50%) scale(1)';
                e.target.style.textShadow = '3px 3px 6px rgba(0,0,0,0.4)';
              }}>
                ESSENTIAL<br />GROWTH
              </Link>
              
              {/* Pillar 3 - Bottom */}
              <div style={{
                position: 'absolute',
                bottom: '60px',
                left: '50%',
                transform: 'translateX(-50%)',
                ...textStyle
              }}>
                COLLABORATIVE<br />COMMUNICATION
              </div>
              
              {/* Pillar 4 - Left */}
              <div style={{
                position: 'absolute',
                left: '30px',
                top: '50%',
                transform: 'translateY(-50%)',
                ...textStyle
              }}>
                REAL-WORLD<br />PATHWAYS
              </div>
            </div>
          </div>

          {/* Pillar Details */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: 'clamp(1rem, 3vw, 1.5rem)'
          }}>
            <Link to="/niche" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{
                ...ageCardStyle,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.15)'
                }
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
              }}>
                <div style={{ fontSize: '3rem', marginBottom: spacing.sm }}>🎨</div>
                <h3 style={{ fontSize: '1.3rem', color: '#14532d', marginBottom: spacing.sm }}>1. Niches – Explore Your World</h3>
                <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: spacing.sm }}>
                  Children choose from diverse topics (finance, robotics, nature, literature, art, AI, etc.) and explore them at their own pace.
                </p>
              </div>
            </Link>
            
            <Link to="/growth" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div style={{
                ...ageCardStyle,
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 15px 35px rgba(0,0,0,0.15)'
                }
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 15px 35px rgba(0,0,0,0.15)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
              }}>
                <div style={{ fontSize: '3rem', marginBottom: spacing.sm }}>🧠</div>
                <h3 style={{ fontSize: '1.3rem', color: '#14532d', marginBottom: spacing.sm }}>2. Essential Growth – Build Core Skills</h3>
                <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: spacing.sm }}>
                  Focus on creativity, problem-solving, logical thinking, social skills, communication, adaptability, and emotional balance.
                </p>
              </div>
            </Link>
            
            <div style={ageCardStyle}>
              <div style={{ fontSize: '3rem', marginBottom: spacing.sm }}>🤝</div>
              <h3 style={{ fontSize: '1.3rem', color: '#14532d', marginBottom: spacing.sm }}>3. Collaborative Communication – Learn Together</h3>
              <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: spacing.sm }}>
                Children come together to talk, share, build, and create through group activities, events, workshops, and projects.
              </p>
            </div>
            
            <div style={ageCardStyle}>
              <div style={{ fontSize: '3rem', marginBottom: spacing.sm }}>🎯</div>
              <h3 style={{ fontSize: '1.3rem', color: '#14532d', marginBottom: spacing.sm }}>4. Real-World Pathways – Apply & Achieve</h3>
              <p style={{ color: '#475569', fontSize: '0.9rem', marginBottom: spacing.sm }}>
                Children put their learning into action by shaping their future goals. Whether it's becoming a video editor, musician, athlete, or entrepreneur.
              </p>
            </div>
          </div>

          {/* In Short Section - Simplified Horizontal */}
          <div style={{ 
            textAlign: 'center', 
            marginTop: spacing.xl, 
            padding: spacing.xl, 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '20px',
            position: 'relative',
            overflow: 'hidden'
          }}>
            {/* Background Pattern */}
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `
                radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%),
                radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)
              `,
              pointerEvents: 'none'
            }}></div>
            
            <h3 style={{ 
              fontSize: '2rem', 
              color: 'white', 
              marginBottom: spacing.xl,
              fontWeight: '700',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)'
            }}>
              ⚡ In Short
            </h3>
            
            <div style={{ 
              display: 'flex', 
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              gap: 'clamp(0.5rem, 2vw, 1rem)',
              position: 'relative',
              zIndex: 2,
              flexWrap: 'wrap'
            }}>
              {/* Item 1 */}
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                gap: spacing.xs,
                flex: '0 0 auto',
                minWidth: 'clamp(100px, 20vw, 120px)',
                maxWidth: '150px'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #ff6b6b, #ff8e8e)',
                  color: 'white',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  boxShadow: '0 3px 10px rgba(255, 107, 107, 0.4)',
                  marginBottom: spacing.xs
                }}>
                  1
                </div>
                <div style={{ color: 'white', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '0.2rem' }}>Niches</div>
                  <div style={{ fontSize: '0.7rem', opacity: '0.9' }}>What you explore</div>
                </div>
              </div>

              {/* Arrow 1 */}
              <div style={{ 
                fontSize: 'clamp(0.8rem, 2vw, 1.4rem)', 
                color: 'rgba(255,255,255,0.8)', 
                margin: '0 clamp(0.2rem, 1vw, 0.5rem)',
                display: 'none'
              }}>→</div>

              {/* Item 2 */}
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                gap: spacing.xs,
                flex: '0 0 auto',
                minWidth: 'clamp(100px, 20vw, 120px)',
                maxWidth: '150px'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #4ecdc4, #44a08d)',
                  color: 'white',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  boxShadow: '0 3px 10px rgba(78, 205, 196, 0.4)',
                  marginBottom: spacing.xs
                }}>
                  2
                </div>
                <div style={{ color: 'white', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '0.2rem' }}>Essential Growth</div>
                  <div style={{ fontSize: '0.7rem', opacity: '0.9' }}>How you grow</div>
                </div>
              </div>

              {/* Arrow 2 */}
              <div style={{ 
                fontSize: 'clamp(0.8rem, 2vw, 1.4rem)', 
                color: 'rgba(255,255,255,0.8)', 
                margin: '0 clamp(0.2rem, 1vw, 0.5rem)',
                display: 'none'
              }}>→</div>

              {/* Item 3 */}
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                gap: spacing.xs,
                flex: '0 0 auto',
                minWidth: 'clamp(100px, 20vw, 120px)',
                maxWidth: '150px'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #f093fb, #f5576c)',
                  color: 'white',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  boxShadow: '0 3px 10px rgba(240, 147, 251, 0.4)',
                  marginBottom: spacing.xs
                }}>
                  3
                </div>
                <div style={{ color: 'white', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '0.2rem' }}>Collaborative Communication</div>
                  <div style={{ fontSize: '0.7rem', opacity: '0.9' }}>How you connect</div>
                </div>
              </div>

              {/* Arrow 3 */}
              <div style={{ 
                fontSize: 'clamp(0.8rem, 2vw, 1.4rem)', 
                color: 'rgba(255,255,255,0.8)', 
                margin: '0 clamp(0.2rem, 1vw, 0.5rem)',
                display: 'none'
              }}>→</div>

              {/* Item 4 */}
              <div style={{ 
                display: 'flex', 
                flexDirection: 'column',
                alignItems: 'center',
                gap: spacing.xs,
                flex: '0 0 auto',
                minWidth: 'clamp(100px, 20vw, 120px)',
                maxWidth: '150px'
              }}>
                <div style={{
                  background: 'linear-gradient(135deg, #ffecd2, #fcb69f)',
                  color: 'white',
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  boxShadow: '0 3px 10px rgba(255, 236, 210, 0.4)',
                  marginBottom: spacing.xs
                }}>
                  4
                </div>
                <div style={{ color: 'white', textAlign: 'center' }}>
                  <div style={{ fontSize: '0.9rem', fontWeight: '700', marginBottom: '0.2rem' }}>Real-World Pathways</div>
                  <div style={{ fontSize: '0.7rem', opacity: '0.9' }}>Where you're headed</div>
                </div>
              </div>
            </div>
          </div>
        </div>


        {/* How We're Different */}
        <div style={{
          ...cardStyle,
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          color: 'white'
        }}>
          <h2 style={{ fontSize: '2rem', margin: '0 0 1rem 0', color: 'white', textAlign: 'center' }}>
            ⚡ How We're Different
          </h2>
          <p style={{ fontSize: '1.1rem', color: 'white', lineHeight: '1.6', marginBottom: spacing.lg }}>
            Unlike traditional education systems, we focus on personalized learning experiences that adapt to each child's unique needs, interests, and learning style.
          </p>

          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
            gap: 'clamp(1rem, 3vw, 1.5rem)'
          }}>
            <div>
              <h3 style={{ fontSize: '1.3rem', color: '#1e293b', marginBottom: spacing.sm }}>🎯 Personalized Learning</h3>
              <p style={{ color: '#475569', lineHeight: '1.5', fontSize: '0.9rem' }}>
                Every child gets a customized learning path that adapts to their pace, interests, and learning style.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.3rem', color: '#1e293b', marginBottom: spacing.sm }}>🏠 Home-Based Learning</h3>
              <p style={{ color: '#475569', lineHeight: '1.5', fontSize: '0.9rem' }}>
                Learn in the comfort of your home with activities designed for real-world application.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.3rem', color: '#1e293b', marginBottom: spacing.sm }}>👨‍👩‍👧‍👦 Family-Centered</h3>
              <p style={{ color: '#475569', lineHeight: '1.5', fontSize: '0.9rem' }}>
                Parents are actively involved in their child's learning journey with guidance and support.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.3rem', color: '#1e293b', marginBottom: spacing.sm }}>📊 Progress Tracking</h3>
              <p style={{ color: '#475569', lineHeight: '1.5', fontSize: '0.9rem' }}>
                Detailed progress tracking helps you see your child's growth and celebrate achievements.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.3rem', color: '#1e293b', marginBottom: spacing.sm }}>🎁 Physical Materials</h3>
              <p style={{ color: '#475569', lineHeight: '1.5', fontSize: '0.9rem' }}>
                Receive carefully curated physical materials and kits delivered to your door.
              </p>
            </div>
            <div>
              <h3 style={{ fontSize: '1.3rem', color: '#1e293b', marginBottom: spacing.sm }}>🔄 Continuous Support</h3>
              <p style={{ color: '#475569', lineHeight: '1.5', fontSize: '0.9rem' }}>
                Ongoing support from our team of educators and child development experts.
              </p>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div style={{ ...cardStyle, textAlign: 'center', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white' }}>
          <h2 style={{ fontSize: '2rem', margin: '0 0 1rem 0' }}>
            Ready to Transform Your Child's Learning Journey? 🚀
          </h2>
          <p style={{ fontSize: '1.1rem', margin: '0 0 2rem 0', opacity: 0.9 }}>
            Join thousands of families who are already experiencing the joy of personalized, engaging learning at home.
          </p>
          <div style={{ display: 'flex', gap: spacing.md, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/plans" style={{ ...buttonStyle, background: 'white', color: '#667eea' }}>
              View Plans & Pricing
            </Link>
            <Link to="/child-profile" style={{ ...buttonStyle, background: 'rgba(255,255,255,0.2)', border: '2px solid white' }}>
              Create Child Profile
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WhatWeDoPage;
