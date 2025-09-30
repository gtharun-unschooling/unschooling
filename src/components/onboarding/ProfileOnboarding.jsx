import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { colors, spacing, typography } from '../../styles/designTokens';
import './ProfileOnboarding.css';

const ProfileOnboarding = ({ onComplete, onSkip }) => {
  const { currentUser, updateUserProfile, userProfile } = useAuth();
  const [currentStep, setCurrentStep] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    preferences: {
      notifications: true,
      language: 'en',
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }
  });

  const steps = [
    {
      id: 'welcome',
      title: 'Welcome to Unschooling!',
      subtitle: 'Let\'s set up your profile to personalize your experience',
      icon: '👋',
      fields: []
    },
    {
      id: 'personal',
      title: 'Personal Information',
      subtitle: 'Tell us a bit about yourself',
      icon: '👤',
      fields: ['firstName', 'lastName']
    },
    {
      id: 'contact',
      title: 'Contact Information',
      subtitle: 'How can we reach you?',
      icon: '📞',
      fields: ['phone']
    },
    {
      id: 'preferences',
      title: 'Preferences',
      subtitle: 'Customize your experience',
      icon: '⚙️',
      fields: ['preferences']
    },
    {
      id: 'complete',
      title: 'All Set!',
      subtitle: 'Your profile is ready. Let\'s start learning!',
      icon: '🎉',
      fields: []
    }
  ];

  useEffect(() => {
    if (userProfile) {
      setFormData(prev => ({
        ...prev,
        firstName: userProfile.profile?.firstName || '',
        lastName: userProfile.profile?.lastName || '',
        phone: userProfile.profile?.phone || '',
        preferences: {
          ...prev.preferences,
          ...userProfile.profile?.preferences
        }
      }));
    }
  }, [userProfile]);

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleNext = async () => {
    if (currentStep === steps.length - 1) {
      await handleComplete();
      return;
    }
    setCurrentStep(prev => prev + 1);
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleComplete = async () => {
    setIsLoading(true);
    try {
      await updateUserProfile({
        profile: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          preferences: formData.preferences
        }
      });
      onComplete?.();
    } catch (error) {
      console.error('Error updating profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSkip = () => {
    onSkip?.();
  };

  const isStepValid = () => {
    const currentStepData = steps[currentStep];
    return currentStepData.fields.every(field => {
      if (field === 'preferences') return true; // Preferences are optional
      const value = field.includes('.') 
        ? formData[field.split('.')[0]]?.[field.split('.')[1]]
        : formData[field];
      return value && value.trim() !== '';
    });
  };

  const renderStepContent = () => {
    const step = steps[currentStep];
    
    switch (step.id) {
      case 'welcome':
        return (
          <div className="onboarding-step-content">
            <div className="welcome-content">
              <h2>Get Started in 3 Easy Steps</h2>
              <div className="steps-preview">
                <div className="step-preview">
                  <div className="step-preview-icon">👤</div>
                  <div className="step-preview-text">Personal Info</div>
                </div>
                <div className="step-preview">
                  <div className="step-preview-icon">📞</div>
                  <div className="step-preview-text">Contact Details</div>
                </div>
                <div className="step-preview">
                  <div className="step-preview-icon">⚙️</div>
                  <div className="step-preview-text">Preferences</div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'personal':
        return (
          <div className="onboarding-step-content">
            <div className="form-group">
              <label htmlFor="firstName">First Name *</label>
              <input
                id="firstName"
                type="text"
                value={formData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                placeholder="Enter your first name"
                className="onboarding-input"
              />
            </div>
            <div className="form-group">
              <label htmlFor="lastName">Last Name *</label>
              <input
                id="lastName"
                type="text"
                value={formData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                placeholder="Enter your last name"
                className="onboarding-input"
              />
            </div>
          </div>
        );

      case 'contact':
        return (
          <div className="onboarding-step-content">
            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                placeholder="Enter your phone number (optional)"
                className="onboarding-input"
              />
              <small className="form-help">We'll use this for important updates and support</small>
            </div>
          </div>
        );

      case 'preferences':
        return (
          <div className="onboarding-step-content">
            <div className="form-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={formData.preferences.notifications}
                  onChange={(e) => handleInputChange('preferences.notifications', e.target.checked)}
                  className="onboarding-checkbox"
                />
                <span className="checkbox-text">
                  <strong>Email Notifications</strong>
                  <small>Get updates about your learning progress and new features</small>
                </span>
              </label>
            </div>
            <div className="form-group">
              <label htmlFor="language">Language</label>
              <select
                id="language"
                value={formData.preferences.language}
                onChange={(e) => handleInputChange('preferences.language', e.target.value)}
                className="onboarding-select"
              >
                <option value="en">English</option>
                <option value="es">Español</option>
                <option value="fr">Français</option>
                <option value="de">Deutsch</option>
              </select>
            </div>
          </div>
        );

      case 'complete':
        return (
          <div className="onboarding-step-content">
            <div className="completion-content">
              <h2>Profile Complete!</h2>
              <div className="profile-summary">
                <div className="profile-item">
                  <strong>Name:</strong> {formData.firstName} {formData.lastName}
                </div>
                {formData.phone && (
                  <div className="profile-item">
                    <strong>Phone:</strong> {formData.phone}
                  </div>
                )}
                <div className="profile-item">
                  <strong>Notifications:</strong> {formData.preferences.notifications ? 'Enabled' : 'Disabled'}
                </div>
                <div className="profile-item">
                  <strong>Language:</strong> {formData.preferences.language.toUpperCase()}
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
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

  const cardStyle = {
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '24px',
    padding: spacing['3xl'],
    boxShadow: '0 25px 50px rgba(0, 0, 0, 0.15)',
    width: '100%',
    maxWidth: '600px',
    position: 'relative',
    zIndex: 2,
    border: '1px solid rgba(255, 255, 255, 0.2)',
  };

  const progressStyle = {
    width: '100%',
    height: '6px',
    background: '#e2e8f0',
    borderRadius: '3px',
    marginBottom: spacing.xl,
    overflow: 'hidden',
  };

  const progressBarStyle = {
    height: '100%',
    background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
    borderRadius: '3px',
    transition: 'width 0.3s ease',
    width: `${((currentStep + 1) / steps.length) * 100}%`,
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
    minWidth: '120px',
  };

  const secondaryButtonStyle = {
    ...buttonStyle,
    background: 'transparent',
    color: '#64748b',
    border: '2px solid #e2e8f0',
  };

  const disabledButtonStyle = {
    ...buttonStyle,
    background: '#94a3b8',
    cursor: 'not-allowed',
  };

  return (
    <div style={containerStyle}>
      <div style={cardStyle}>
        {/* Progress Bar */}
        <div style={progressStyle}>
          <div style={progressBarStyle}></div>
        </div>

        {/* Step Header */}
        <div className="onboarding-header">
          <div className="step-icon">{steps[currentStep].icon}</div>
          <h1 className="step-title">{steps[currentStep].title}</h1>
          <p className="step-subtitle">{steps[currentStep].subtitle}</p>
        </div>

        {/* Step Content */}
        {renderStepContent()}

        {/* Navigation */}
        <div className="onboarding-navigation">
          {currentStep > 0 && (
            <button
              style={secondaryButtonStyle}
              onClick={handlePrevious}
              disabled={isLoading}
            >
              Previous
            </button>
          )}
          
          <div className="navigation-spacer"></div>
          
          <button
            style={isStepValid() && !isLoading ? buttonStyle : disabledButtonStyle}
            onClick={handleNext}
            disabled={!isStepValid() || isLoading}
          >
            {isLoading ? 'Saving...' : 
             currentStep === steps.length - 1 ? 'Complete' : 'Next'}
          </button>
        </div>

        {/* Skip Option */}
        {currentStep < steps.length - 1 && (
          <div className="skip-section">
            <button
              style={{
                background: 'none',
                border: 'none',
                color: '#94a3b8',
                fontSize: '0.9rem',
                cursor: 'pointer',
                textDecoration: 'underline',
              }}
              onClick={handleSkip}
            >
              Skip for now
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProfileOnboarding;
