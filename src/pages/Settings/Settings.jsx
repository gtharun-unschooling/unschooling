import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './Settings.css';

const Settings = () => {
  const { currentUser, userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    weekly: true,
    achievements: true
  });
  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    progressVisible: false,
    allowContact: true
  });

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handlePrivacyChange = (key) => {
    setPrivacy(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const tabs = [
    { id: 'profile', label: 'Profile Settings', icon: '👤' },
    { id: 'notifications', label: 'Notifications', icon: '🔔' },
    { id: 'privacy', label: 'Privacy & Security', icon: '🔒' },
    { id: 'preferences', label: 'Learning Preferences', icon: '⚙️' }
  ];

  return (
    <div className="settings-page">
      <div className="settings-header">
        <h1>Settings</h1>
        <p>Manage your account preferences and settings</p>
      </div>

      <div className="settings-container">
        {/* Settings Navigation */}
        <div className="settings-nav">
          {tabs.map(tab => (
            <button
              key={tab.id}
              className={`nav-tab ${activeTab === tab.id ? 'active' : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span className="tab-icon">{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Settings Content */}
        <div className="settings-content">
          {/* Profile Settings */}
          {activeTab === 'profile' && (
            <div className="settings-section">
              <h2>Profile Settings</h2>
              <div className="profile-info">
                <div className="profile-avatar">
                  <span className="avatar-text">
                    {currentUser?.email?.charAt(0).toUpperCase() || 'U'}
                  </span>
                </div>
                <div className="profile-details">
                  <h3>{currentUser?.email || 'User'}</h3>
                  <p>Member since {new Date().getFullYear()}</p>
                </div>
              </div>
              
              <div className="form-group">
                <label>Display Name</label>
                <input 
                  type="text" 
                  placeholder="Enter display name"
                  defaultValue={userProfile?.displayName || ''}
                />
              </div>
              
              <div className="form-group">
                <label>Email</label>
                <input 
                  type="email" 
                  value={currentUser?.email || ''}
                  disabled
                />
                <small>Email cannot be changed</small>
              </div>
              
              <button className="save-btn">Save Changes</button>
            </div>
          )}

          {/* Notification Settings */}
          {activeTab === 'notifications' && (
            <div className="settings-section">
              <h2>Notification Preferences</h2>
              
              <div className="notification-item">
                <div className="notification-info">
                  <h4>Email Notifications</h4>
                  <p>Receive updates via email</p>
                </div>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={notifications.email}
                    onChange={() => handleNotificationChange('email')}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="notification-item">
                <div className="notification-info">
                  <h4>Push Notifications</h4>
                  <p>Receive push notifications in browser</p>
                </div>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={notifications.push}
                    onChange={() => handleNotificationChange('push')}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="notification-item">
                <div className="notification-info">
                  <h4>Weekly Reports</h4>
                  <p>Get weekly learning progress summaries</p>
                </div>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={notifications.weekly}
                    onChange={() => handleNotificationChange('weekly')}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="notification-item">
                <div className="notification-info">
                  <h4>Achievement Alerts</h4>
                  <p>Get notified when you earn achievements</p>
                </div>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={notifications.achievements}
                    onChange={() => handleNotificationChange('achievements')}
                  />
                  <span className="slider"></span>
                </label>
              </div>
            </div>
          )}

          {/* Privacy Settings */}
          {activeTab === 'privacy' && (
            <div className="settings-section">
              <h2>Privacy & Security</h2>
              
              <div className="privacy-item">
                <div className="privacy-info">
                  <h4>Profile Visibility</h4>
                  <p>Allow other users to see your profile</p>
                </div>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={privacy.profileVisible}
                    onChange={() => handlePrivacyChange('profileVisible')}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="privacy-item">
                <div className="privacy-info">
                  <h4>Progress Visibility</h4>
                  <p>Allow others to see your learning progress</p>
                </div>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={privacy.progressVisible}
                    onChange={() => handlePrivacyChange('progressVisible')}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="privacy-item">
                <div className="privacy-info">
                  <h4>Allow Contact</h4>
                  <p>Allow other users to contact you</p>
                </div>
                <label className="toggle">
                  <input
                    type="checkbox"
                    checked={privacy.allowContact}
                    onChange={() => handlePrivacyChange('allowContact')}
                  />
                  <span className="slider"></span>
                </label>
              </div>

              <div className="security-section">
                <h4>Security</h4>
                <button className="change-password-btn">Change Password</button>
                <button className="two-factor-btn">Enable Two-Factor Authentication</button>
              </div>
            </div>
          )}

          {/* Learning Preferences */}
          {activeTab === 'preferences' && (
            <div className="settings-section">
              <h2>Learning Preferences</h2>
              
              <div className="form-group">
                <label>Preferred Learning Style</label>
                <select defaultValue="visual">
                  <option value="visual">Visual</option>
                  <option value="auditory">Auditory</option>
                  <option value="kinesthetic">Hands-on</option>
                  <option value="reading">Reading</option>
                </select>
              </div>

              <div className="form-group">
                <label>Daily Learning Goal (minutes)</label>
                <input 
                  type="number" 
                  min="15" 
                  max="180" 
                  defaultValue="30"
                />
              </div>

              <div className="form-group">
                <label>Difficulty Level</label>
                <select defaultValue="intermediate">
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div className="form-group">
                <label>Preferred Subjects</label>
                <div className="checkbox-group">
                  <label className="checkbox-item">
                    <input type="checkbox" defaultChecked /> Science
                  </label>
                  <label className="checkbox-item">
                    <input type="checkbox" defaultChecked /> Finance
                  </label>
                  <label className="checkbox-item">
                    <input type="checkbox" /> Art
                  </label>
                  <label className="checkbox-item">
                    <input type="checkbox" /> Technology
                  </label>
                  <label className="checkbox-item">
                    <input type="checkbox" /> History
                  </label>
                </div>
              </div>

              <button className="save-btn">Save Preferences</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Settings;
