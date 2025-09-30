import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { colors, spacing, typography } from '../../styles/designTokens';
import './PasswordReset.css';

const PasswordReset = () => {
  const { sendPasswordReset } = useAuth();
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  const validateEmail = (email) => {
    // More strict email validation that requires proper domain structure
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && email.includes('.') && email.split('@')[1].includes('.');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Clear any previous messages
    setMessage({ type: '', text: '' });
    
    // Client-side email validation
    if (!email.trim()) {
      setMessage({
        type: 'error',
        text: 'Please enter your email address'
      });
      return;
    }
    
    if (!validateEmail(email)) {
      setMessage({
        type: 'error',
        text: 'Please enter a valid email address'
      });
      return;
    }
    
    setLoading(true);

    try {
      console.log('🔄 Sending password reset email to:', email);
      await sendPasswordReset(email);
      setMessage({
        type: 'success',
        text: 'Password reset email sent! Check your inbox and follow the instructions. If you don\'t see it, check your spam folder.'
      });
      setEmail('');
    } catch (error) {
      console.error('❌ Password reset error:', error);
      
      let errorMessage = 'Failed to send password reset email';
      
      // Provide specific error messages based on error codes
      if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection and try again.';
      } else if (error.code === 'auth/user-not-found') {
        errorMessage = 'No account found with this email address. Please check your email or create a new account.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Please enter a valid email address.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many requests. Please wait a few minutes before trying again.';
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      setMessage({
        type: 'error',
        text: errorMessage
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle email input change with validation
  const handleEmailChange = (e) => {
    const newEmail = e.target.value;
    setEmail(newEmail);
    
    // Clear error message when user starts typing a valid email
    if (message.text && message.type === 'error') {
      const isValid = validateEmail(newEmail);
      if (isValid) {
        setMessage({ type: '', text: '' });
      }
    }
  };

  const containerStyle = {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    fontFamily: typography.fontFamily.primary,
  };

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: spacing['3xl'],
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
    width: '100%',
    maxWidth: '450px',
    border: '1px solid rgba(255, 255, 255, 0.2)',
  };

  const titleStyle = {
    fontSize: '2.5rem',
    fontWeight: 800,
    textAlign: 'center',
    marginBottom: spacing.md,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  };

  const subtitleStyle = {
    fontSize: '1.1rem',
    color: colors.text.secondary,
    textAlign: 'center',
    marginBottom: spacing['2xl'],
    lineHeight: 1.6,
  };

  const formStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.lg,
  };

  const inputGroupStyle = {
    display: 'flex',
    flexDirection: 'column',
    gap: spacing.xs,
  };

  const labelStyle = {
    fontSize: '1rem',
    fontWeight: 600,
    color: colors.text.primary,
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

  const buttonStyle = {
    width: '100%',
    padding: `${spacing.md} ${spacing.lg}`,
    border: 'none',
    borderRadius: '12px',
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
  };

  const buttonHoverStyle = {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
  };

  const messageStyle = {
    padding: spacing.md,
    borderRadius: '8px',
    marginBottom: spacing.lg,
    fontSize: '0.9rem',
    textAlign: 'center',
  };

  const successMessageStyle = {
    backgroundColor: 'rgba(34, 197, 94, 0.1)',
    color: '#16a34a',
    border: '1px solid rgba(34, 197, 94, 0.2)',
  };

  const errorMessageStyle = {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    color: '#dc2626',
    border: '1px solid rgba(239, 68, 68, 0.2)',
  };

  const backLinkStyle = {
    textAlign: 'center',
    marginTop: spacing.lg,
    color: colors.text.secondary,
    fontSize: '0.9rem',
  };

  const linkStyle = {
    color: '#667eea',
    cursor: 'pointer',
    fontWeight: 600,
    textDecoration: 'none',
  };

  const loadingStyle = {
    opacity: 0.7,
    pointerEvents: 'none',
  };

  return (
    <div style={containerStyle}>
      <div className={`password-reset-card ${loading ? 'password-reset-loading' : ''}`} style={{ ...cardStyle, ...(loading ? loadingStyle : {}) }}>
        <h1 style={titleStyle}>Reset Password</h1>
        
        <p style={subtitleStyle}>
          Enter your email address and we'll send you a link to reset your password.
        </p>

        {message.text && (
          <div 

            style={{
              ...messageStyle,
              ...(message.type === 'success' ? successMessageStyle : errorMessageStyle)
            }}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} style={formStyle}>
          <div style={inputGroupStyle}>
            <label htmlFor="email" style={labelStyle}>
              Email Address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your email address"
              style={inputStyle}
              required
              disabled={loading}
  
            />
          </div>

          <button 
            type="submit" 
            style={buttonStyle}
            disabled={loading}

          >
            {loading ? 'Sending...' : 'Send Reset Email'}
          </button>

          <div style={{
            textAlign: 'center',
            marginTop: spacing.lg,
            fontSize: '0.9rem'
          }}>
            <span 
              onClick={() => window.location.href = '/login'}
              style={{
                color: '#667eea',
                cursor: 'pointer',
                textDecoration: 'underline',
                marginRight: '20px'
              }}
            >
              ← Back to Login
            </span>
            <span 
              onClick={() => window.open('/firebase-test', '_blank')}
              style={{
                color: '#667eea',
                cursor: 'pointer',
                textDecoration: 'underline'
              }}
            >
              🔧 Test Connection
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PasswordReset;
