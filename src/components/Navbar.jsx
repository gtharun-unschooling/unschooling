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
      setIsProfileDropdownOpen(false); // Close dropdown immediately
      await signOut();
      console.log('🚪 Sign out completed, navigating to login...');
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if there's an error, try to navigate to login
      navigate('/login');
    }
  };

  const toggleHamburger = () => {
    setIsHamburgerOpen(!isHamburgerOpen);
  };

  const closeHamburger = () => {
    setIsHamburgerOpen(false);
  };

  const toggleProfileDropdown = () => {
    console.log('🔄 toggleProfileDropdown called, current state:', isProfileDropdownOpen);
    const newState = !isProfileDropdownOpen;
    console.log('🔄 Setting new state to:', newState);
    setIsProfileDropdownOpen(newState);
    
    // Force dropdown to be positioned to the LEFT on mobile
    if (newState && window.innerWidth <= 768) {
      setTimeout(() => {
        const dropdown = document.querySelector('.profile-dropdown');
        
        if (dropdown) {
          // Force LEFT positioning on mobile - position near the button but ensure it's visible
          dropdown.style.position = 'fixed';
          
          // Position dropdown to the left of the button, but ensure it doesn't go off-screen
          const buttonElement = document.querySelector('.profile-btn');
          const buttonRect = buttonElement.getBoundingClientRect();
          const viewportWidth = window.innerWidth;
          const dropdownWidth = 200; // Preferred width (compact for mobile)
          
          // Position dropdown at the right edge of screen
          const rightPosition = 10; // 10px margin from right edge
          
          dropdown.style.left = 'auto';
          dropdown.style.right = `${rightPosition}px`;
          dropdown.style.top = '70px';
          dropdown.style.transform = 'none';
          dropdown.style.transformOrigin = 'top right';
          
          // Move dropdown to body to avoid parent positioning issues
          document.body.appendChild(dropdown);
          
          // Ensure dropdown width doesn't exceed viewport
          const maxWidth = viewportWidth - 20; // 10px margin on each side
          const preferredWidth = Math.min(200, maxWidth);
          
          dropdown.style.width = `${preferredWidth}px`;
          dropdown.style.maxWidth = `${maxWidth}px`;
        }
      }, 10);
    }
  };

  const closeProfileDropdown = () => {
    setIsProfileDropdownOpen(false);
  };

  // Function to get gender-based emoji
  const getGenderEmoji = (user) => {
    // Check if user has gender preference stored
    const userGender = user?.gender || user?.metadata?.gender;
    
    if (userGender) {
      switch (userGender.toLowerCase()) {
        case 'male':
        case 'm':
          return '👨';
        case 'female':
        case 'f':
          return '👩';
        case 'non-binary':
        case 'nb':
          return '🧑';
        default:
          return '👤';
      }
    }
    
    // Fallback: try to guess from name or use default
    const name = user?.displayName || user?.email?.split('@')[0] || '';
    
    // Simple heuristic based on common names (you can expand this)
    const maleNames = ['john', 'mike', 'david', 'chris', 'alex', 'sam', 'james', 'robert', 'william', 'richard', 'tharun', 'tarun', 'arun', 'kumar', 'raj', 'suresh', 'ramesh', 'vijay', 'suresh', 'prakash'];
    const femaleNames = ['sarah', 'jessica', 'emily', 'jennifer', 'lisa', 'maria', 'susan', 'karen', 'nancy', 'helen', 'priya', 'sita', 'laxmi', 'kavya', 'anjali', 'meera', 'radha', 'geeta', 'sunita', 'rekha'];
    
    const lowerName = name.toLowerCase();
    
    if (maleNames.some(maleName => lowerName.includes(maleName))) {
      return '👨';
    } else if (femaleNames.some(femaleName => lowerName.includes(femaleName))) {
      return '👩';
    }
    
    // Default neutral emoji
    return '👤';
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
      case 'preferences':
        // For now, just show an alert. You can create a preferences page later
        alert('Preferences feature coming soon! You can set your gender preference here.');
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
                  <span className="profile-name-short">
                    {currentUser.displayName || currentUser.email?.split('@')[0] || 'User'}
                  </span>
                  <span className="dropdown-arrow">▼</span>
                </button>
                
                {isProfileDropdownOpen && (
                  <div 
                    className="profile-dropdown-container"
                    style={{ 
                      position: 'relative',
                      zIndex: 1000,
                      pointerEvents: 'auto'
                    }}
                  >
                    <div 
                      className="profile-dropdown mobile-dropdown-left"
                      style={{
                        pointerEvents: 'auto',
                        zIndex: 1002
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
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          console.log('🚪 Logout button clicked directly');
                          handleLogout();
                        }}
                        onMouseDown={(e) => {
                          e.preventDefault();
                          console.log('🚪 Logout button mouse down');
                        }}
                        onMouseUp={(e) => {
                          e.preventDefault();
                          console.log('🚪 Logout button mouse up');
                        }}
                        style={{ 
                          cursor: 'pointer',
                          pointerEvents: 'auto',
                          zIndex: 1004,
                          position: 'relative'
                        }}
                      >
                        <span className="option-icon">🚪</span>
                        <span className="option-text">Logout</span>
                      </button>
                    </div>
                    
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

          {/* Learning & Progress */}
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
              <Link to="/deliveries" className="menu-link" onClick={closeHamburger}>
                <span className="menu-icon">📦</span>
                <span>My Deliveries</span>
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


          {/* Company Info */}
          <div className="menu-section">
            <h4>🏢 Company</h4>
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
