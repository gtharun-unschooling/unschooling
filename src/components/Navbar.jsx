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
      await signOut();
      navigate('/');
      setIsProfileDropdownOpen(false);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const toggleHamburger = () => {
    setIsHamburgerOpen(!isHamburgerOpen);
  };

  const closeHamburger = () => {
    setIsHamburgerOpen(false);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const closeProfileDropdown = () => {
    setIsProfileDropdownOpen(false);
  };

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileDropdownRef.current && !profileDropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

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
      case 'logout':
        handleLogout();
        break;
      default:
        break;
    }
    setIsProfileDropdownOpen(false);
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-container">
          {/* Hamburger Menu Button */}
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
          
          <div className="navbar-menu">
            <Link to="/niche" className="nav-link">
              Explore
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
                  <div className="profile-avatar">
                    {currentUser.email ? currentUser.email.charAt(0).toUpperCase() : '👤'}
                  </div>
                  <span className="profile-name-short">
                    {currentUser.displayName || currentUser.email?.split('@')[0] || 'User'}
                  </span>
                  <span className="dropdown-arrow">▼</span>
                </button>
                
                {isProfileDropdownOpen && (
                  <div className="profile-dropdown">
                    <div className="profile-header">
                      <div className="profile-avatar-large">
                        {currentUser.email ? currentUser.email.charAt(0).toUpperCase() : '👤'}
                      </div>
                      <div className="profile-info">
                        <div className="profile-name">
                          {currentUser.displayName || currentUser.email?.split('@')[0] || 'User'}
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
          {/* Main Navigation */}
          <div className="menu-section">
            <h4>🏠 Main</h4>
            <Link to="/" className="menu-link" onClick={closeHamburger}>
              <span className="menu-icon">🏠</span>
              <span>Home</span>
            </Link>
            <Link to="/niche" className="menu-link" onClick={closeHamburger}>
              <span className="menu-icon">🔍</span>
              <span>Explore</span>
            </Link>
            <Link to="/plans" className="menu-link" onClick={closeHamburger}>
              <span className="menu-icon">💰</span>
              <span>Pricing</span>
            </Link>
          </div>

          {/* Learning & Progress */}
          {currentUser && (
            <div className="menu-section">
              <h4>📚 Learning</h4>
              <Link to="/dashboard" className="menu-link" onClick={closeHamburger}>
                <span className="menu-icon">📊</span>
                <span>Dashboard</span>
              </Link>
              <Link to="/progress" className="menu-link" onClick={closeHamburger}>
                <span className="menu-icon">📈</span>
                <span>Progress</span>
              </Link>
              <Link to="/child-profile" className="menu-link" onClick={closeHamburger}>
                <span className="menu-icon">👶</span>
                <span>Child Profile</span>
              </Link>
            </div>
          )}

          {/* Account & Billing */}
          {currentUser && (
            <div className="menu-section">
              <h4>👤 Account</h4>
              <Link to="/billing" className="menu-link" onClick={closeHamburger}>
                <span className="menu-icon">💳</span>
                <span>Billing</span>
              </Link>
              <Link to="/help" className="menu-link" onClick={closeHamburger}>
                <span className="menu-icon">❓</span>
                <span>Help & Support</span>
              </Link>
            </div>
          )}

          {/* Admin Section */}
          {currentUser && (
            <div className="menu-section">
              <h4>⚙️ Admin</h4>
              <Link to="/admin" className="menu-link" onClick={closeHamburger}>
                <span className="menu-icon">🔧</span>
                <span>Admin Panel</span>
              </Link>
            </div>
          )}

          {/* Company Info */}
          <div className="menu-section">
            <h4>🏢 Company</h4>
            <Link to="/about" className="menu-link" onClick={closeHamburger}>
              <span className="menu-icon">ℹ️</span>
              <span>About Us</span>
            </Link>
            <Link to="/contact" className="menu-link" onClick={closeHamburger}>
              <span className="menu-icon">📞</span>
              <span>Contact</span>
            </Link>
            <Link to="/safety" className="menu-link" onClick={closeHamburger}>
              <span className="menu-icon">🛡️</span>
              <span>Safety</span>
            </Link>
            <Link to="/privacy" className="menu-link" onClick={closeHamburger}>
              <span className="menu-icon">🔒</span>
              <span>Privacy Policy</span>
            </Link>
            <Link to="/terms" className="menu-link" onClick={closeHamburger}>
              <span className="menu-icon">📋</span>
              <span>Terms of Service</span>
            </Link>
          </div>

          {/* Authentication */}
          {!currentUser && (
            <div className="menu-section">
              <h4>🔐 Account</h4>
              <Link to="/login" className="menu-link" onClick={closeHamburger}>
                <span className="menu-icon">🔑</span>
                <span>Sign In</span>
              </Link>
              <Link to="/register" className="menu-link" onClick={closeHamburger}>
                <span className="menu-icon">📝</span>
                <span>Sign Up</span>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Overlay to close menu when clicking outside */}
      {isHamburgerOpen && (
        <div className="hamburger-overlay" onClick={closeHamburger}></div>
      )}

    </>
  );
};

export default Navbar;
