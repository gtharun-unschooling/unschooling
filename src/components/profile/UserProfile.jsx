import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { colors, spacing, typography } from '../../styles/designTokens';
import MinimalBackButton from '../ui/MinimalBackButton';
import './UserProfile.css';

const UserProfile = () => {
  const { userProfile, updateUserProfile, sendVerificationEmail, currentUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  
  // Form state
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    preferences: {
      notifications: true,
      language: 'en',
      timezone: ''
    }
  });

  // Initialize form data when profile loads
  useEffect(() => {
    if (userProfile) {
      setFormData({
        firstName: userProfile.profile?.firstName || '',
        lastName: userProfile.profile?.lastName || '',
        phone: userProfile.profile?.phone || '',
        preferences: {
          notifications: userProfile.profile?.preferences?.notifications ?? true,
          language: userProfile.profile?.preferences?.language || 'en',
          timezone: userProfile.profile?.preferences?.timezone || ''
        }
      });
    }
  }, [userProfile]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: type === 'checkbox' ? checked : value
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: type === 'checkbox' ? checked : value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      const updates = {
        profile: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          phone: formData.phone,
          preferences: formData.preferences
        }
      };

      await updateUserProfile(updates);
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
    } finally {
      setLoading(false);
    }
  };

  const handleVerificationEmail = async () => {
    try {
      await sendVerificationEmail();
      setMessage({ type: 'success', text: 'Verification email sent! Check your inbox.' });
    } catch (error) {
      setMessage({ type: 'error', text: error.message || 'Failed to send verification email' });
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return 'N/A';
    return new Date(timestamp.seconds * 1000).toLocaleDateString();
  };

  const getRoleDisplayName = (role) => {
    return role === 'admin' ? 'Administrator' : 'Parent';
  };

  const getSubscriptionStatus = (subscription) => {
    if (!subscription) return 'No subscription';
    return subscription.status === 'active' ? 'Active' : 'Inactive';
  };

  if (!userProfile) {
    return (
      <div style={containerStyle}>
        <div style={loadingStyle}>Loading profile...</div>
      </div>
    );
  }

  return (
    <div style={containerStyle}>
      <MinimalBackButton 
        heroColors={{
          backgroundColor: '#f8fafc',
          primaryColor: '#3b82f6',
          nicheColor: '#1e40af'
        }}
      />
      <div style={headerStyle}>
        <h1 style={titleStyle}>User Profile</h1>
        <button
          onClick={() => setIsEditing(!isEditing)}
          style={editButtonStyle}
          disabled={loading}
        >
          {isEditing ? 'Cancel' : 'Edit Profile'}
        </button>
      </div>

      {message.text && (
        <div style={{
          ...messageStyle,
          ...(message.type === 'success' ? successMessageStyle : errorMessageStyle)
        }}>
          {message.text}
        </div>
      )}

      <div style={profileGridStyle}>
        {/* Profile Picture Section */}
        <div style={sectionStyle}>
          <h3 style={sectionTitleStyle}>Profile Picture</h3>
          <div style={profilePictureStyle}>
            <img
              src={userProfile.profile?.profilePicture || '/images/default-avatar.png'}
              alt="Profile"
              style={avatarStyle}
            />
            <div style={pictureInfoStyle}>
              <p style={infoTextStyle}>
                {userProfile.profile?.profilePicture ? 'Profile picture set' : 'No profile picture'}
              </p>
              {isEditing && (
                <button style={uploadButtonStyle}>
                  Upload New Picture
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Basic Information */}
        <div style={sectionStyle}>
          <h3 style={sectionTitleStyle}>Basic Information</h3>
          {isEditing ? (
            <form onSubmit={handleSubmit} style={formStyle}>
              <div style={inputGroupStyle}>
                <label style={labelStyle}>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  style={inputStyle}
                  placeholder="Enter first name"
                />
              </div>
              
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  style={inputStyle}
                  placeholder="Enter last name"
                />
              </div>
              
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  style={inputStyle}
                  placeholder="Enter phone number"
                />
              </div>

              <div style={buttonGroupStyle}>
                <button
                  type="submit"
                  style={saveButtonStyle}
                  disabled={loading}
                >
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div style={infoGridStyle}>
              <div style={infoItemStyle}>
                <span style={infoLabelStyle}>First Name:</span>
                <span style={infoValueStyle}>
                  {userProfile.profile?.firstName || 'Not set'}
                </span>
              </div>
              <div style={infoItemStyle}>
                <span style={infoLabelStyle}>Last Name:</span>
                <span style={infoValueStyle}>
                  {userProfile.profile?.lastName || 'Not set'}
                </span>
              </div>
              <div style={infoItemStyle}>
                <span style={infoLabelStyle}>Phone:</span>
                <span style={infoValueStyle}>
                  {userProfile.profile?.phone || 'Not set'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Account Information */}
        <div style={sectionStyle}>
          <h3 style={sectionTitleStyle}>Account Information</h3>
          <div style={infoGridStyle}>
            <div style={infoItemStyle}>
              <span style={infoLabelStyle}>Email:</span>
              <span style={infoValueStyle}>
                {userProfile.email}
                {!currentUser?.emailVerified && (
                  <span style={unverifiedStyle}> (Unverified)</span>
                )}
              </span>
            </div>
            <div style={infoItemStyle}>
              <span style={infoLabelStyle}>Role:</span>
              <span style={infoValueStyle}>
                {getRoleDisplayName(userProfile.role)}
              </span>
            </div>
            <div style={infoItemStyle}>
              <span style={infoLabelStyle}>Member Since:</span>
              <span style={infoValueStyle}>
                {formatDate(userProfile.createdAt)}
              </span>
            </div>
            <div style={infoItemStyle}>
              <span style={infoLabelStyle}>Last Login:</span>
              <span style={infoValueStyle}>
                {formatDate(userProfile.lastLogin)}
              </span>
            </div>
          </div>
          
          {!currentUser?.emailVerified && (
            <div style={verificationSectionStyle}>
              <p style={verificationTextStyle}>
                Please verify your email address to access all features.
              </p>
              <button
                onClick={handleVerificationEmail}
                style={verificationButtonStyle}
                disabled={loading}
              >
                Send Verification Email
              </button>
            </div>
          )}
        </div>

        {/* Preferences */}
        <div style={sectionStyle}>
          <h3 style={sectionTitleStyle}>Preferences</h3>
          {isEditing ? (
            <div style={preferencesFormStyle}>
              <div style={checkboxGroupStyle}>
                <label style={checkboxLabelStyle}>
                  <input
                    type="checkbox"
                    name="preferences.notifications"
                    checked={formData.preferences.notifications}
                    onChange={handleInputChange}
                    style={checkboxStyle}
                  />
                  Receive email notifications
                </label>
              </div>
              
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Language</label>
                <select
                  name="preferences.language"
                  value={formData.preferences.language}
                  onChange={handleInputChange}
                  style={selectStyle}
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
              
              <div style={inputGroupStyle}>
                <label style={labelStyle}>Timezone</label>
                <select
                  name="preferences.timezone"
                  value={formData.preferences.timezone}
                  onChange={handleInputChange}
                  style={selectStyle}
                >
                  <option value="">Select timezone</option>
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">Eastern Time</option>
                  <option value="America/Chicago">Central Time</option>
                  <option value="America/Denver">Mountain Time</option>
                  <option value="America/Los_Angeles">Pacific Time</option>
                </select>
              </div>
            </div>
          ) : (
            <div style={infoGridStyle}>
              <div style={infoItemStyle}>
                <span style={infoLabelStyle}>Notifications:</span>
                <span style={infoValueStyle}>
                  {userProfile.profile?.preferences?.notifications ? 'Enabled' : 'Disabled'}
                </span>
              </div>
              <div style={infoItemStyle}>
                <span style={infoLabelStyle}>Language:</span>
                <span style={infoValueStyle}>
                  {userProfile.profile?.preferences?.language === 'en' ? 'English' : 
                   userProfile.profile?.preferences?.language === 'es' ? 'Spanish' :
                   userProfile.profile?.preferences?.language === 'fr' ? 'French' :
                   userProfile.profile?.preferences?.language === 'de' ? 'German' : 'English'}
                </span>
              </div>
              <div style={infoItemStyle}>
                <span style={infoLabelStyle}>Timezone:</span>
                <span style={infoValueStyle}>
                  {userProfile.profile?.preferences?.timezone || 'Not set'}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Subscription Information */}
        <div style={sectionStyle}>
          <h3 style={sectionTitleStyle}>Subscription</h3>
          <div style={infoGridStyle}>
            <div style={infoItemStyle}>
              <span style={infoLabelStyle}>Plan:</span>
              <span style={infoValueStyle}>
                {userProfile.subscription?.plan || 'Free'}
              </span>
            </div>
            <div style={infoItemStyle}>
              <span style={infoLabelStyle}>Status:</span>
              <span style={{
                ...infoValueStyle,
                ...(userProfile.subscription?.status === 'active' ? activeStatusStyle : inactiveStatusStyle)
              }}>
                {getSubscriptionStatus(userProfile.subscription)}
              </span>
            </div>
            {userProfile.subscription?.startDate && (
              <div style={infoItemStyle}>
                <span style={infoLabelStyle}>Start Date:</span>
                <span style={infoValueStyle}>
                  {formatDate(userProfile.subscription.startDate)}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// Styles
const containerStyle = {
  maxWidth: '1200px',
  margin: '0 auto',
  padding: spacing.xl,
  fontFamily: typography.fontFamily.primary,
};

const headerStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  marginBottom: spacing['2xl'],
  paddingBottom: spacing.lg,
  borderBottom: `2px solid ${colors.border.light}`,
};

const titleStyle = {
  fontSize: '2.5rem',
  fontWeight: 800,
  color: colors.text.primary,
  margin: 0,
};

const editButtonStyle = {
  padding: `${spacing.md} ${spacing.lg}`,
  backgroundColor: colors.primary.main,
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontSize: '1rem',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  ':hover': {
    backgroundColor: colors.primary.dark,
  },
};

const messageStyle = {
  padding: spacing.md,
  borderRadius: '8px',
  marginBottom: spacing.lg,
  fontSize: '0.9rem',
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

const profileGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))',
  gap: spacing.xl,
};

const sectionStyle = {
  backgroundColor: 'white',
  borderRadius: '12px',
  padding: spacing.xl,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
  border: `1px solid ${colors.border.light}`,
};

const sectionTitleStyle = {
  fontSize: '1.5rem',
  fontWeight: 700,
  color: colors.text.primary,
  marginBottom: spacing.lg,
  paddingBottom: spacing.sm,
  borderBottom: `1px solid ${colors.border.light}`,
};

const profilePictureStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: spacing.lg,
};

const avatarStyle = {
  width: '80px',
  height: '80px',
  borderRadius: '50%',
  objectFit: 'cover',
  border: `3px solid ${colors.primary.main}`,
};

const pictureInfoStyle = {
  flex: 1,
};

const infoTextStyle = {
  margin: '0 0 8px 0',
  color: colors.text.secondary,
};

const uploadButtonStyle = {
  padding: `${spacing.sm} ${spacing.md}`,
  backgroundColor: colors.secondary.main,
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  fontSize: '0.9rem',
  cursor: 'pointer',
};

const formStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.md,
};

const inputGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.xs,
};

const labelStyle = {
  fontSize: '0.9rem',
  fontWeight: 600,
  color: colors.text.primary,
};

const inputStyle = {
  padding: spacing.sm,
  border: `1px solid ${colors.border.light}`,
  borderRadius: '6px',
  fontSize: '1rem',
  transition: 'border-color 0.2s ease',
  ':focus': {
    borderColor: colors.primary.main,
    outline: 'none',
  },
};

const selectStyle = {
  ...inputStyle,
  cursor: 'pointer',
};

const buttonGroupStyle = {
  display: 'flex',
  gap: spacing.md,
  marginTop: spacing.md,
};

const saveButtonStyle = {
  padding: `${spacing.md} ${spacing.lg}`,
  backgroundColor: colors.primary.main,
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontSize: '1rem',
  fontWeight: 600,
  cursor: 'pointer',
  transition: 'all 0.2s ease',
  ':hover': {
    backgroundColor: colors.primary.dark,
  },
};

const infoGridStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.md,
};

const infoItemStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  padding: spacing.sm,
  backgroundColor: colors.background.light,
  borderRadius: '6px',
};

const infoLabelStyle = {
  fontWeight: 600,
  color: colors.text.secondary,
};

const infoValueStyle = {
  color: colors.text.primary,
  fontWeight: 500,
};

const unverifiedStyle = {
  color: colors.error.main,
  fontWeight: 600,
};

const verificationSectionStyle = {
  marginTop: spacing.lg,
  padding: spacing.md,
  backgroundColor: 'rgba(255, 193, 7, 0.1)',
  borderRadius: '8px',
  border: '1px solid rgba(255, 193, 7, 0.3)',
};

const verificationTextStyle = {
  margin: '0 0 12px 0',
  color: '#856404',
  fontSize: '0.9rem',
};

const verificationButtonStyle = {
  padding: `${spacing.sm} ${spacing.md}`,
  backgroundColor: '#ffc107',
  color: '#212529',
  border: 'none',
  borderRadius: '6px',
  fontSize: '0.9rem',
  fontWeight: 600,
  cursor: 'pointer',
};

const preferencesFormStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: spacing.md,
};

const checkboxGroupStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: spacing.sm,
};

const checkboxLabelStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: spacing.sm,
  cursor: 'pointer',
  fontSize: '0.9rem',
};

const checkboxStyle = {
  width: '16px',
  height: '16px',
  cursor: 'pointer',
};

const activeStatusStyle = {
  color: '#16a34a',
  fontWeight: 600,
};

const inactiveStatusStyle = {
  color: colors.text.secondary,
};

const loadingStyle = {
  textAlign: 'center',
  padding: spacing['2xl'],
  color: colors.text.secondary,
  fontSize: '1.1rem',
};

export default UserProfile;
