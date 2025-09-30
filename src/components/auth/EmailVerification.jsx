import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { colors, spacing, typography } from '../../styles/designTokens';
import './EmailVerification.css';

const EmailVerification = ({ onVerified, onSkip }) => {
  const { currentUser, sendVerificationEmail, userProfile } = useAuth();
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [isChecking, setIsChecking] = useState(false);

  // Check verification status periodically
  useEffect(() => {
    if (!currentUser || currentUser.emailVerified) return;

    const checkVerification = async () => {
      setIsChecking(true);
      try {
        await currentUser.reload();
        if (currentUser.emailVerified) {
          onVerified?.();
        }
      } catch (error) {
        console.error('Error checking verification:', error);
      } finally {
        setIsChecking(false);
      }
    };

    const interval = setInterval(checkVerification, 3000); // Check every 3 seconds
    return () => clearInterval(interval);
  }, [currentUser, onVerified]);

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleResendVerification = async () => {
    if (countdown > 0) return;
    
    setIsResending(true);
    setResendSuccess(false);
    
    try {
      await sendVerificationEmail();
      setResendSuccess(true);
      setCountdown(60); // 60 second cooldown
    } catch (error) {
      console.error('Error resending verification:', error);
    } finally {
      setIsResending(false);
    }
  };

  const handleSkip = () => {
    onSkip?.();
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

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: spacing['3xl'],
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
    width: '100%',
    maxWidth: '500px',
    position: 'relative',
    zIndex: 2,
    border: '1px solid rgba(255, 255, 255, 0.2)',
    textAlign: 'center',
  };

  const iconStyle = {
    fontSize: '4rem',
    marginBottom: spacing.lg,
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
  };

  const titleStyle = {
    fontSize: '2rem',
    fontWeight: 700,
    marginBottom: spacing.md,
    color: '#1e293b',
  };

  const subtitleStyle = {
    fontSize: '1.1rem',
    color: '#64748b',
    marginBottom: spacing.xl,
    lineHeight: 1.6,
  };

  const emailStyle = {
    background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
    padding: spacing.md,
    borderRadius: '12px',
    marginBottom: spacing.xl,
    fontSize: '1.1rem',
    fontWeight: 600,
    color: '#475569',
    border: '1px solid #cbd5e1',
  };

  const buttonStyle = {
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: `${spacing.md} ${spacing.xl}`,
    fontSize: '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    margin: spacing.sm,
    minWidth: '140px',
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    background: 'transparent',
    color: '#64748b',
    border: '2px solid #e2e8f0',
  };

  const resendButtonStyle = {
    ...buttonStyle,
    background: countdown > 0 ? '#94a3b8' : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    cursor: countdown > 0 ? 'not-allowed' : 'pointer',
  };

  const successStyle = {
    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(5, 150, 105, 0.1) 100%)',
    color: '#059669',
    padding: spacing.md,
    borderRadius: '12px',
    marginBottom: spacing.lg,
    fontSize: '0.9rem',
    border: '1px solid rgba(16, 185, 129, 0.2)',
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        <div style={iconStyle}>📧</div>
        
        <h1 style={titleStyle}>Verify Your Email</h1>
        
        <p style={subtitleStyle}>
          We've sent a verification link to your email address. 
          Please check your inbox and click the link to verify your account.
        </p>

        <div style={emailStyle}>
          {currentUser?.email}
        </div>

        {resendSuccess && (
          <div style={successStyle}>
            ✅ Verification email sent! Check your inbox.
          </div>
        )}

        <div style={{ marginBottom: spacing.xl }}>
          <button
            style={resendButtonStyle}
            onClick={handleResendVerification}
            disabled={isResending || countdown > 0}
          >
            {isResending ? 'Sending...' : 
             countdown > 0 ? `Resend in ${countdown}s` : 
             'Resend Email'}
          </button>
        </div>

        <div style={{ 
          borderTop: '1px solid #e2e8f0', 
          paddingTop: spacing.lg,
          marginTop: spacing.lg 
        }}>
          <p style={{ 
            fontSize: '0.9rem', 
            color: '#64748b', 
            marginBottom: spacing.md 
          }}>
            Can't find the email? Check your spam folder or try resending.
          </p>
          
          <button
            style={secondaryButtonStyle}
            onClick={handleSkip}
          >
            Skip for Now
          </button>
        </div>

        {isChecking && (
          <div style={{ 
            marginTop: spacing.lg,
            fontSize: '0.9rem',
            color: '#3b82f6'
          }}>
            🔄 Checking verification status...
          </div>
        )}
      </div>
    </div>
  );
};

export default EmailVerification;
