// src/components/AuthForm.jsx
import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider
} from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { colors, spacing, typography } from '../styles/designTokens';
import './AuthForm.css';

const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(null);
  const navigate = useNavigate();

  // Animated background effect
  useEffect(() => {
    const canvas = document.getElementById('animated-bg');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const particleCount = 50;

    // Create particles
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        size: Math.random() * 3 + 1,
        color: `hsl(${Math.random() * 360}, 70%, 60%)`
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      particles.forEach(particle => {
        particle.x += particle.vx;
        particle.y += particle.vy;
        
        if (particle.x < 0 || particle.x > canvas.width) particle.vx *= -1;
        if (particle.y < 0 || particle.y > canvas.height) particle.vy *= -1;
        
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fillStyle = particle.color;
        ctx.fill();
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/');
      } else {
        await createUserWithEmailAndPassword(auth, email, password);
        navigate('/');
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setError('');
    
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate('/');
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: typography.fontFamily.primary,
  };

  const animatedBgStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 1,
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: spacing['3xl'],
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
    width: '100%',
    maxWidth: '400px',
    position: 'relative',
    zIndex: 2,
    border: '1px solid rgba(255, 255, 255, 0.2)',
    transform: 'translateY(0)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  };

  const titleStyle = {
    fontSize: '2.5rem',
    fontWeight: 800,
    textAlign: 'center',
    marginBottom: spacing.lg,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  };

  const subtitleStyle = {
    fontSize: '1rem',
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing['2xl'],
    lineHeight: 1.6,
  };

  const inputGroupStyle = {
    marginBottom: spacing.lg,
    position: 'relative',
  };

  const inputStyle = {
    width: '100%',
    padding: `${spacing.md} ${spacing.lg}`,
    border: '2px solid rgba(102, 126, 234, 0.2)',
    borderRadius: '12px',
    fontSize: '1rem',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    transition: 'all 0.3s ease',
    boxSizing: 'border-box',
    outline: 'none',
  };

  const passwordInputStyle = {
    ...inputStyle,
    paddingRight: '3rem',
  };

  const passwordToggleStyle = {
    position: 'absolute',
    right: spacing.md,
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '1.2rem',
    color: colors.text.secondary,
    padding: spacing.xs,
    borderRadius: '4px',
    transition: 'color 0.2s ease',
  };

  const buttonStyle = {
    width: '100%',
    padding: `${spacing.md} ${spacing.lg}`,
    border: 'none',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginBottom: spacing.md,
    position: 'relative',
    overflow: 'hidden',
  };

  const getPrimaryButtonStyle = () => ({
    ...buttonStyle,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    boxShadow: hoveredButton === 'primary' 
      ? '0 8px 25px rgba(102, 126, 234, 0.4)' 
      : '0 4px 15px rgba(102, 126, 234, 0.3)',
    transform: hoveredButton === 'primary' ? 'translateY(-2px)' : 'translateY(0)',
  });

  const getGoogleButtonStyle = () => ({
    ...buttonStyle,
    background: 'white',
    color: '#333',
    border: '2px solid #e0e0e0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    boxShadow: hoveredButton === 'google' 
      ? '0 4px 15px rgba(0, 0, 0, 0.1)' 
      : 'none',
    borderColor: hoveredButton === 'google' ? '#667eea' : '#e0e0e0',
  });

  const dividerStyle = {
    display: 'flex',
    alignItems: 'center',
    margin: `${spacing.lg} 0`,
    color: colors.text.secondary,
    fontSize: '0.9rem',
  };

  const dividerLineStyle = {
    flex: 1,
    height: '1px',
    background: 'linear-gradient(90deg, transparent, #e0e0e0, transparent)',
  };

  const toggleStyle = {
    textAlign: 'center',
    marginTop: spacing.lg,
    color: colors.text.secondary,
    fontSize: '0.9rem',
  };

  const toggleLinkStyle = {
    color: '#667eea',
    cursor: 'pointer',
    fontWeight: 600,
    textDecoration: 'none',
  };

  const errorStyle = {
    background: 'rgba(239, 68, 68, 0.1)',
    color: '#dc2626',
    padding: spacing.md,
    borderRadius: '8px',
    marginBottom: spacing.lg,
    fontSize: '0.9rem',
    border: '1px solid rgba(239, 68, 68, 0.2)',
  };

  const loadingStyle = {
    opacity: 0.7,
    pointerEvents: 'none',
  };

  return (
    <div style={containerStyle}>
      <canvas id="animated-bg" style={animatedBgStyle}></canvas>
      
      <div className={`auth-card ${isLoading ? 'auth-loading' : ''}`} style={{ ...cardStyle, ...(isLoading ? loadingStyle : {}) }}>
        <h1 className="auth-title" style={titleStyle}>
          {isLogin ? 'Welcome Back' : 'Join Us'}
        </h1>
        
        <p className="auth-subtitle" style={subtitleStyle}>
          {isLogin 
            ? 'Sign in to continue your learning journey' 
            : 'Create your account and start exploring'
          }
        </p>

        {error && <div style={errorStyle}>{error}</div>}

        <form onSubmit={handleEmailAuth}>
          <div style={inputGroupStyle}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
              style={inputStyle}
              required
            />
          </div>

          <div style={inputGroupStyle}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="auth-input"
              style={passwordInputStyle}
              required
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="auth-password-toggle"
              style={passwordToggleStyle}
            >
              {showPassword ? '🙈' : '👁️'}
            </button>
          </div>

          <button 
            type="submit" 
            style={getPrimaryButtonStyle()}
            disabled={isLoading}
            onMouseEnter={() => setHoveredButton('primary')}
            onMouseLeave={() => setHoveredButton(null)}
          >
            {isLoading ? '⏳ Loading...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
        </form>

        <div style={dividerStyle}>
          <div style={dividerLineStyle}></div>
          <span style={{ margin: `0 ${spacing.md}` }}>or</span>
          <div style={dividerLineStyle}></div>
        </div>

        <button 
          onClick={handleGoogleAuth}
          style={getGoogleButtonStyle()}
          disabled={isLoading}
          onMouseEnter={() => setHoveredButton('google')}
          onMouseLeave={() => setHoveredButton(null)}
        >
          <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>

        <div style={toggleStyle}>
          <span>
            {isLogin ? "Don't have an account? " : "Already have an account? "}
          </span>
          <span 
            onClick={() => setIsLogin(!isLogin)}
            className="auth-toggle-link"
            style={toggleLinkStyle}
          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
