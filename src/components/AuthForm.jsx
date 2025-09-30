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
    setErrorCode('');

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/dashboard');
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        setNewUser(userCredential.user);
        
        // Check if email verification is required
        if (!userCredential.user.emailVerified) {
          setShowEmailVerification(true);
        } else {
          // If email is already verified, go to profile onboarding
          setShowProfileOnboarding(true);
        }
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

  // Fix password visibility toggle
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    setError('');
    setErrorCode('');
    
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(auth, provider);
      
      // For Google OAuth, email is automatically verified
      // Check if this is a new user (no profile data)
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

  // Handle email verification completion
  const handleEmailVerified = () => {
    setShowEmailVerification(false);
    setShowProfileOnboarding(true);
  };

  // Handle email verification skip
  const handleEmailVerificationSkip = () => {
    setShowEmailVerification(false);
    setShowProfileOnboarding(true);
  };

  // Handle profile onboarding completion
  const handleProfileComplete = () => {
    setShowProfileOnboarding(false);
    navigate('/dashboard');
  };

  // Handle profile onboarding skip
  const handleProfileSkip = () => {
    setShowProfileOnboarding(false);
    navigate('/dashboard');
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
    paddingRight: '60px', // Make room for toggle button
  };

  const passwordToggleStyle = {
    position: 'absolute',
    right: '12px',
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
    zIndex: 10,
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
    background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05) 0%, rgba(239, 68, 68, 0.1) 100%)',
    color: '#dc2626',
    padding: spacing.md,
    borderRadius: '12px',
    marginBottom: spacing.lg,
    fontSize: '0.9rem',
    border: '1px solid rgba(239, 68, 68, 0.2)',
    boxShadow: '0 2px 8px rgba(239, 68, 68, 0.1)',
    position: 'relative',
    overflow: 'hidden'
  };

  const loadingStyle = {
    opacity: 0.7,
    pointerEvents: 'none',
  };

  // Show email verification if needed
  if (showEmailVerification) {
    return (
      <EmailVerification 
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
            : 'Create your account and start your personalized learning experience'
          }
        </p>

        {error && (
          <div 
            style={{
              ...errorStyle,
              animation: 'slideInError 0.3s ease-out'
            }}
          >
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'flex-start',
              marginBottom: spacing.sm 
            }}>
              <div style={{ flex: 1 }}>{error}</div>
              <button
                onClick={() => {
                  setError('');
                  setErrorCode('');
                }}
                style={{
                  background: 'none',
                  border: 'none',
                  color: '#dc2626',
                  cursor: 'pointer',
                  fontSize: '1.2rem',
                  padding: '0',
                  marginLeft: spacing.sm,
                  lineHeight: 1
                }}
                aria-label="Dismiss error"
              >
                ×
              </button>
            </div>
            {(() => {
              const suggestion = getActionSuggestion(errorCode, isLogin);
              return suggestion ? (
                <div style={{ 
                  fontSize: '0.85rem', 
                  color: '#059669', 
                  borderTop: '1px solid rgba(5, 150, 105, 0.2)', 
                  paddingTop: spacing.sm,
                  marginTop: spacing.sm
                }}>
                  💡 {suggestion}
                </div>
              ) : null;
            })()}
            
            {/* Show action button for specific errors */}
            {errorCode === 'auth/email-already-in-use' && !isLogin && (
              <div style={{ 
                marginTop: spacing.md,
                textAlign: 'center'
              }}>
                <button
                  onClick={() => {
                    setIsLogin(true);
                    setError('');
                    setErrorCode('');
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: `${spacing.sm} ${spacing.md}`,
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
                  onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  Sign In Instead
                </button>
              </div>
            )}
            
            {errorCode === 'auth/user-not-found' && isLogin && (
              <div style={{ 
                marginTop: spacing.md,
                textAlign: 'center'
              }}>
                <button
                  onClick={() => {
                    setIsLogin(false);
                    setError('');
                    setErrorCode('');
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: `${spacing.sm} ${spacing.md}`,
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
                  onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  Create Account Instead
                </button>
              </div>
            )}
            
            {errorCode === 'auth/wrong-password' && isLogin && (
              <div style={{ 
                marginTop: spacing.md,
                textAlign: 'center'
              }}>
                <button
                  onClick={() => window.location.href = '/password-reset'}
                  style={{
                    background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: `${spacing.sm} ${spacing.md}`,
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
                  onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  Reset Password
                </button>
              </div>
            )}
            
            {errorCode === 'auth/network-request-failed' && (
              <div style={{ 
                marginTop: spacing.md,
                textAlign: 'center'
              }}>
                <button
                  onClick={() => {
                    setError('');
                    setErrorCode('');
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: `${spacing.sm} ${spacing.md}`,
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
                  onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  Try Again
                </button>
              </div>
            )}
            
            {(errorCode === 'auth/user-disabled' || errorCode === 'auth/operation-not-allowed') && (
              <div style={{ 
                marginTop: spacing.md,
                textAlign: 'center'
              }}>
                <button
                  onClick={() => window.open('mailto:support@unschooling.com?subject=Account Issue', '_blank')}
                  style={{
                    background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: `${spacing.sm} ${spacing.md}`,
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
                  onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  Contact Support
                </button>
              </div>
            )}
            
            {errorCode === 'auth/requires-recent-login' && (
              <div style={{ 
                marginTop: spacing.md,
                textAlign: 'center'
              }}>
                <button
                  onClick={() => {
                    setError('');
                    setErrorCode('');
                  }}
                  style={{
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: `${spacing.sm} ${spacing.md}`,
                    fontSize: '0.9rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'translateY(-1px)'}
                  onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  Sign In Again
                </button>
              </div>
            )}
          </div>
        )}

        <form onSubmit={handleEmailAuth}>
          <div style={inputGroupStyle}>
            <label htmlFor="email" style={{ 
              display: 'block', 
              marginBottom: spacing.xs, 
              fontWeight: 600, 
              color: colors.text.primary 
            }}>
              Email Address
            </label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="auth-input"
              style={inputStyle}
              required
              autoComplete="email"
            />
          </div>

          <div style={inputGroupStyle}>
            <label htmlFor="password" style={{ 
              display: 'block', 
              marginBottom: spacing.xs, 
              fontWeight: 600, 
              color: colors.text.primary 
            }}>
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="auth-input"
                style={passwordInputStyle}
                required
                autoComplete={isLogin ? 'current-password' : 'new-password'}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="auth-password-toggle"
                style={passwordToggleStyle}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                tabIndex={0}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
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
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setErrorCode('');
            }}
            className="auth-toggle-link"
            style={toggleLinkStyle}

          >
            {isLogin ? 'Sign up' : 'Sign in'}
          </span>
        </div>
        
        {/* Password Reset Link for Login */}
        {isLogin && (
          <div style={{
            textAlign: 'center',
            marginTop: spacing.md,
            fontSize: '0.9rem'
          }}>
            <span 
              onClick={() => window.location.href = '/password-reset'}
              style={{
                color: '#667eea',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
  
            >
              Forgot your password?
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AuthForm;
