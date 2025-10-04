import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Navbar.css';

const Navbar = () => {
  const { currentUser, signOut } = useAuth();
  const navigate = useNavigate();
  const [isHamburgerOpen, setIsHamburgerOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const profileDropdownRef = useRef(null);

  const handleLogout = async () => {
    try {
      console.log('🚪 Logout initiated...');
      setIsProfileDropdownOpen(false);
      await signOut();
      console.log('🚪 Sign out completed, navigating to homepage...');
      navigate('/');
    } catch (error) {
      console.error('Logout error:', error);
      navigate('/');
    }
  };

  const toggleHamburger = () => {
    setIsHamburgerOpen(!isHamburgerOpen);
  };

  const closeHamburger = () => {
    setIsHamburgerOpen(false);
  };

  const toggleProfileDropdown = (e) => {
    console.log('🔄 toggleProfileDropdown called, current state:', isProfileDropdownOpen);
    e.preventDefault();
    e.stopPropagation();
    const newState = !isProfileDropdownOpen;
    console.log('🔄 Setting new state to:', newState);
    setIsProfileDropdownOpen(newState);
    console.log('🔄 State update triggered');
  };

  const handleProfileOption = (action) => {
    switch (action) {
      case 'profile':
        navigate('/child-profile');
        break;
      case 'billing':
        navigate('/billing');
        break;
      case 'progress':
        navigate('/progress');
        break;
      case 'help':
        navigate('/help');
        break;
      case 'preferences':
        alert('Preferences feature coming soon!');
        break;
      case 'logout':
        handleLogout();
        break;
      default:
        break;
    }
    setIsProfileDropdownOpen(false);
  };

  // Function to get user initials for mobile
  const getUserInitials = (user) => {
    if (!user) return 'U';
    
    const displayName = user.displayName || '';
    const email = user.email || '';
    
    // If we have a display name, use first letters of first and last name
    if (displayName && displayName.trim()) {
      const names = displayName.trim().split(' ');
      if (names.length >= 2) {
        return (names[0][0] + names[names.length - 1][0]).toUpperCase();
      } else {
        return names[0][0].toUpperCase();
      }
    }
    
    // If no display name, use first letter of email username
    if (email) {
      const username = email.split('@')[0];
      if (username.length >= 2) {
        return username.substring(0, 2).toUpperCase();
      } else {
        return username[0].toUpperCase();
      }
    }
    
    return 'U'; // Default
  };

  // Function to get gender-based emoji
  const getGenderEmoji = (user) => {
    if (!user) return '👤';
    
    // Try to get gender from user profile or email
    const email = user.email?.toLowerCase() || '';
    const displayName = user.displayName?.toLowerCase() || '';
    
    // Simple heuristic based on common names
    const maleNames = ['john', 'mike', 'david', 'james', 'robert', 'william', 'tharun'];
    const femaleNames = ['mary', 'jane', 'sarah', 'lisa', 'emma', 'sophia'];
    
    if (maleNames.some(name => email.includes(name) || displayName.includes(name))) {
      return '👨';
    } else if (femaleNames.some(name => email.includes(name) || displayName.includes(name))) {
      return '👩';
    }
    
    return '👤'; // Default
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          {/* Left side: Hamburger Menu + Logo */}
          <div className="navbar-left">
            <button 
              className="hamburger-btn"
              onClick={toggleHamburger}
              aria-label="Toggle navigation menu"
            >
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
              <span className="hamburger-line"></span>
            </button>

            <Link to="/" className="navbar-logo">
              Unschooling
            </Link>
          </div>
          
          {/* Right side: Navigation Menu */}
          <div className="navbar-menu">
            <Link to="/what-we-do" className="nav-link">
              What We Do
            </Link>
            <Link to="/plans" className="nav-link">
              Pricing
            </Link>
            
            {currentUser ? (
              <div className="profile-dropdown-container" ref={profileDropdownRef}>
                <button 
                  className="profile-btn"
                  onClick={toggleProfileDropdown}
                  aria-label="Open profile menu"
                >
                  {/* Desktop: Show full name */}
                  <span className="profile-name-short desktop-profile">
                    {currentUser.displayName || currentUser.email?.split('@')[0] || 'User'}
                  </span>
                  {/* Mobile: Show initials only */}
                  <span className="profile-initials mobile-profile">
                    {getUserInitials(currentUser)}
                  </span>
                  <span className="dropdown-arrow">▼</span>
                </button>
                
                {isProfileDropdownOpen && (
                  <div 
                    className="profile-dropdown mobile-dropdown-left"
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      zIndex: 1002,
                      pointerEvents: 'auto'
                    }}
                  >
                    <div className="profile-header">
                      <div className="profile-emoji">
                        {getGenderEmoji(currentUser)}
                      </div>
                      <div className="profile-info">
                        <div className="profile-name">
                          <span className="profile-emoji-inline">{getGenderEmoji(currentUser)}</span>
                          {currentUser.displayName || currentUser.email?.split('@')[0] || 'User'}
                        </div>
                        <div className="profile-email-display">
                          {currentUser.email}
                        </div>
                      </div>
                    </div>

                    <div className="profile-options">
                      <button 
                        className="profile-option"
                        onClick={() => handleProfileOption('profile')}
                      >
                        <span className="option-icon">👶</span>
                        <span className="option-text">Child Profile</span>
                      </button>
                      
                      <button 
                        className="profile-option"
                        onClick={() => handleProfileOption('billing')}
                      >
                        <span className="option-icon">💳</span>
                        <span className="option-text">Billing</span>
                      </button>
                      
                      <button 
                        className="profile-option"
                        onClick={() => handleProfileOption('progress')}
                      >
                        <span className="option-icon">📊</span>
                        <span className="option-text">Progress</span>
                      </button>
                      
                      <button 
                        className="profile-option"
                        onClick={() => handleProfileOption('help')}
                      >
                        <span className="option-icon">❓</span>
                        <span className="option-text">Help</span>
                      </button>
                      
                      <button 
                        className="profile-option"
                        onClick={() => handleProfileOption('preferences')}
                      >
                        <span className="option-icon">⚙️</span>
                        <span className="option-text">Preferences</span>
                      </button>

                      <div className="profile-divider"></div>

                      <button 
                        className="profile-option profile-option-logout"
                        onClick={() => handleProfileOption('logout')}
                      >
                        <span className="option-icon">🚪</span>
                        <span className="option-text">Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link to="/login" className="nav-link login-btn">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </nav>

      {/* Left Side Hamburger Menu */}
      <div className={`hamburger-menu ${isHamburgerOpen ? 'open' : ''}`}>
        <div className="hamburger-header">
          <h3>Menu</h3>
          <button className="close-btn" onClick={closeHamburger}>
            ✕
          </button>
        </div>
        <div className="hamburger-content">
          <div className="menu-section">
            <h4>🏠 Main</h4>
            <Link to="/" className="menu-link" onClick={closeHamburger}>
              <span className="menu-icon">🏠</span>
              <span>Home</span>
            </Link>
            <Link to="/what-we-do" className="menu-link" onClick={closeHamburger}>
              <span className="menu-icon">🌟</span>
              <span>What We Do</span>
            </Link>
            <Link to="/plans" className="menu-link" onClick={closeHamburger}>
              <span className="menu-icon">💰</span>
              <span>Pricing</span>
            </Link>
            <Link to="/about" className="menu-link" onClick={closeHamburger}>
              <span className="menu-icon">ℹ️</span>
              <span>About Us</span>
            </Link>
            <Link to="/faq" className="menu-link" onClick={closeHamburger}>
              <span className="menu-icon">❓</span>
              <span>FAQ</span>
            </Link>
            <Link to="/contact" className="menu-link" onClick={closeHamburger}>
              <span className="menu-icon">📞</span>
              <span>Contact Us</span>
            </Link>
          </div>

          {currentUser && (
            <div className="menu-section">
              <h4>📚 Learning</h4>
              <Link to="/dashboard" className="menu-link" onClick={closeHamburger}>
                <span className="menu-icon">📊</span>
                <span>Dashboard</span>
              </Link>
              <Link to="/child-profile" className="menu-link" onClick={closeHamburger}>
                <span className="menu-icon">👶</span>
                <span>Child Profile</span>
              </Link>
              <Link to="/customised-weekly-plan" className="menu-link" onClick={closeHamburger}>
                <span className="menu-icon">🗓️</span>
                <span>Weekly Plan</span>
              </Link>
              <Link to="/progress" className="menu-link" onClick={closeHamburger}>
                <span className="menu-icon">📈</span>
                <span>Progress Tracker</span>
              </Link>
              <Link to="/billing" className="menu-link" onClick={closeHamburger}>
                <span className="menu-icon">💳</span>
                <span>Billing</span>
              </Link>
              <Link to="/settings" className="menu-link" onClick={closeHamburger}>
                <span className="menu-icon">⚙️</span>
                <span>Settings</span>
              </Link>
              <button className="menu-link logout-link" onClick={handleLogout}>
                <span className="menu-icon">🚪</span>
                <span>Logout</span>
              </button>
            </div>
          )}

          {currentUser && (currentUser.role === 'admin' || currentUser.role === 'founder') && (
            <div className="menu-section">
              <h4>👑 Admin</h4>
              <Link to="/admin/dashboard" className="menu-link" onClick={closeHamburger}>
                <span className="menu-icon">👑</span>
                <span>Admin Dashboard</span>
              </Link>
              <Link to="/admin/tracker" className="menu-link" onClick={closeHamburger}>
                <span className="menu-icon">🔍</span>
                <span>Admin Tracker</span>
              </Link>
              <Link to="/admin/schedule" className="menu-link" onClick={closeHamburger}>
                <span className="menu-icon">📅</span>
                <span>Admin Schedule</span>
              </Link>
              <Link to="/admin/content" className="menu-link" onClick={closeHamburger}>
                <span className="menu-icon">📝</span>
                <span>Content Management</span>
              </Link>
              <Link to="/admin/child-progress" className="menu-link" onClick={closeHamburger}>
                <span className="menu-icon">👶📈</span>
                <span>Child Progress</span>
              </Link>
              <Link to="/admin/agent-reporting" className="menu-link" onClick={closeHamburger}>
                <span className="menu-icon">🤖</span>
                <span>Agent Reporting</span>
              </Link>
            </div>
          )}
        </div>
      </div>
      {isHamburgerOpen && <div className="hamburger-overlay" onClick={closeHamburger}></div>}
    </>
  );
};

export default Navbar;