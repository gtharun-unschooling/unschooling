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
import { getAuthErrorMessage, getActionSuggestion } from '../utils/errorMessages';
import EmailVerification from './auth/EmailVerification';
import ProfileOnboarding from './onboarding/ProfileOnboarding';
import './AuthForm.css';

const AuthForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [errorCode, setErrorCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [showProfileOnboarding, setShowProfileOnboarding] = useState(false);
  const [newUser, setNewUser] = useState(null);
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
        opacity: Math.random() * 0.5 + 0.2
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
        ctx.fillStyle = `rgba(59, 130, 246, ${particle.opacity})`;
        ctx.fill();
      });
      
      requestAnimationFrame(animate);
    };
    
    animate();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setErrorCode('');
    
    try {
      let userCredential;
      
      if (isLogin) {
        userCredential = await signInWithEmailAndPassword(auth, email, password);
      } else {
        userCredential = await createUserWithEmailAndPassword(auth, email, password);
      }
      
      // Check if email is verified
      if (!userCredential.user.emailVerified) {
        setNewUser(userCredential.user);
        setShowEmailVerification(true);
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      const code = error.code || 'default';
      const userFriendlyMessage = getAuthErrorMessage(code, isLogin);
      setErrorCode(code);
      setError(userFriendlyMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setError('');
    setErrorCode('');
    
    try {
      const provider = new GoogleAuthProvider();
      provider.addScope('email');
      provider.addScope('profile');
      
      const userCredential = await signInWithPopup(auth, provider);
      
      // For Google OAuth, email is automatically verified
      if (userCredential.user.metadata.creationTime === userCredential.user.metadata.lastSignInTime) {
        setNewUser(userCredential.user);
        setShowProfileOnboarding(true);
      } else {
        navigate('/dashboard');
      }
    } catch (error) {
      const code = error.code || 'default';
      const userFriendlyMessage = getAuthErrorMessage(code, isLogin);
      setErrorCode(code);
      setError(userFriendlyMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEmailVerified = () => {
    setShowEmailVerification(false);
    setShowProfileOnboarding(true);
  };

  const handleEmailVerificationSkip = () => {
    setShowEmailVerification(false);
    setShowProfileOnboarding(true);
  };

  const handleProfileComplete = () => {
    setShowProfileOnboarding(false);
    navigate('/dashboard');
  };

  const handleProfileSkip = () => {
    setShowProfileOnboarding(false);
    navigate('/dashboard');
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Show email verification if needed
  if (showEmailVerification) {
    return (
      <EmailVerification 
        user={newUser}
        onVerified={handleEmailVerified}
        onSkip={handleEmailVerificationSkip}
      />
    );
  }

  // Show profile onboarding if needed
  if (showProfileOnboarding) {
    return (
      <ProfileOnboarding 
        onComplete={handleProfileComplete}
        onSkip={handleProfileSkip}
      />
    );
  }

  // Styles
  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    position: 'relative',
    overflow: 'hidden'
  };

  const animatedBgStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    zIndex: 0
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    borderRadius: '20px',
    padding: '40px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
    width: '100%',
    maxWidth: '400px',
    position: 'relative',
    zIndex: 1,
    transition: 'all 0.3s ease'
  };

  const loadingStyle = {
    opacity: 0.7,
    pointerEvents: 'none'
  };

  const titleStyle = {
    fontSize: '2rem',
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: '2rem',
    color: '#1f2937',
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: '10px',
    fontSize: '16px',
    marginBottom: '1rem',
    transition: 'border-color 0.3s ease',
    outline: 'none',
    background: 'rgba(255, 255, 255, 0.9)'
  };

  const buttonStyle = {
    width: '100%',
    padding: '12px',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    marginBottom: '1rem',
    position: 'relative',
    overflow: 'hidden'
  };

  const primaryButtonStyle = {
    ...buttonStyle,
    background: 'linear-gradient(135deg, #667eea, #764ba2)',
    color: 'white',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.4)'
  };

  const googleButtonStyle = {
    ...buttonStyle,
    background: 'white',
    color: '#374151',
    border: '2px solid #e5e7eb',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px'
  };

  const linkStyle = {
    color: '#667eea',
    textDecoration: 'none',
    cursor: 'pointer',
    fontSize: '14px'
  };

  const errorStyle = {
    color: '#ef4444',
    fontSize: '14px',
    marginTop: '0.5rem',
    textAlign: 'center'
  };

  return (
    <div style={containerStyle}>
      <canvas id="animated-bg" style={animatedBgStyle}></canvas>
      
      <div className={`auth-card ${isLoading ? 'auth-loading' : ''}`} style={{ ...cardStyle, ...(isLoading ? loadingStyle : {}) }}>
        <h1 className="auth-title" style={titleStyle}>
          {isLogin ? 'Welcome Back' : 'Join Us'}
        </h1>
        
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={inputStyle}
            onFocus={(e) => e.target.style.borderColor = '#667eea'}
            onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
          />
          
          <div style={{ position: 'relative' }}>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={inputStyle}
              onFocus={(e) => e.target.style.borderColor = '#667eea'}
              onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#6b7280'
              }}
            >
              {showPassword ? '👁️' : '👁️‍🗨️'}
            </button>
          </div>
          
          {error && (
            <div style={errorStyle}>
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={isLoading}
            style={primaryButtonStyle}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 6px 20px rgba(102, 126, 234, 0.6)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.4)';
            }}
          >
            {isLoading ? '⏳' : (isLogin ? 'Sign In' : 'Sign Up')}
          </button>
        </form>
        
        <div style={{ textAlign: 'center', margin: '1rem 0' }}>
          <span style={{ color: '#6b7280' }}>or</span>
        </div>
        
        <button
          onClick={handleGoogleAuth}
          disabled={isLoading}
          style={googleButtonStyle}
          onMouseEnter={(e) => {
            e.target.style.transform = 'translateY(-2px)';
            e.target.style.boxShadow = '0 4px 15px rgba(0, 0, 0, 0.1)';
          }}
          onMouseLeave={(e) => {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = 'none';
          }}
        >
          <span>🔍</span>
          Continue with Google
        </button>
        
        <div style={{ textAlign: 'center', marginTop: '1.5rem' }}>
          <button
            onClick={() => setIsLogin(!isLogin)}
            style={linkStyle}
            onMouseEnter={(e) => e.target.style.textDecoration = 'underline'}
            onMouseLeave={(e) => e.target.style.textDecoration = 'none'}
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;