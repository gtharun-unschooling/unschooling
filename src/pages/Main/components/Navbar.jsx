import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../../firebase';
import { signOut } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';
import { colors, spacing, typography, shadows, transitions } from '../../../styles/designTokens';
import './Navbar.css';

const Navbar = () => {
  const [user] = useAuthState(auth);
  const navigate = useNavigate();
  const [isMobile, setIsMobile] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [userEmoji, setUserEmoji] = useState('👤');
  const dropdownRef = useRef(null);
  const avatarRef = useRef(null);

  // Random emoji avatars for users
  const emojiAvatars = [
    '😊', '🤖', '🦄', '🐱', '🐶', '🦁', '🐯', '🐨', '🐼', '🐸',
    '🦋', '🐙', '🦕', '🦖', '🐉', '🦅', '🦉', '🦇', '🦊', '🐺',
    '🐻', '🐨', '🐯', '🦁', '🐮', '🐷', '🐸', '🐵', '🐔', '🐧',
    '🦆', '🦉', '🦇', '🐺', '🐗', '🐴', '🦄', '🐝', '🐛', '🦋'
  ];

  // Responsive breakpoint detection
  useEffect(() => {
    const checkScreenSize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  // Set random emoji for user
  useEffect(() => {
    if (user) {
      const randomEmoji = emojiAvatars[Math.floor(Math.random() * emojiAvatars.length)];
      setUserEmoji(randomEmoji);
    }
  }, [user]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isDropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target) &&
        avatarRef.current &&
        !avatarRef.current.contains(event.target)
      ) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isDropdownOpen]);

  const navbarStyles = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: isMobile ? `${spacing.md} ${spacing.lg}` : `${spacing.lg} ${spacing['2xl']}`,
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
    boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
    transition: 'all 0.3s ease',
  };

  const logoStyle = {
    textDecoration: 'none',
    color: colors.text.primary,
    fontWeight: 700,
    fontSize: isMobile ? '1.25rem' : '1.5rem',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    backgroundClip: 'text',
    transition: 'all 0.3s ease',
  };

  const userSectionStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: isMobile ? spacing.sm : spacing.md,
  };

  const greetingStyle = {
    color: colors.text.secondary,
    fontSize: isMobile ? '0.8rem' : '1rem',
    fontWeight: 500,
    marginRight: spacing.sm,
    textAlign: 'right',
  };

  const avatarContainerStyle = {
    position: 'relative',
    cursor: 'pointer',
  };

  const avatarStyle = {
    width: isMobile ? '40px' : '48px',
    height: isMobile ? '40px' : '48px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: isMobile ? '1.2rem' : '1.5rem',
    border: '3px solid rgba(255, 255, 255, 0.8)',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    cursor: 'pointer',
  };

  const avatarHoverStyle = {
    transform: 'scale(1.05)',
    boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
  };

  const dropdownStyle = {
    position: 'absolute',
    top: '100%',
    right: 0,
    marginTop: spacing.sm,
    background: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '16px',
    padding: spacing.md,
    minWidth: '200px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    opacity: isDropdownOpen ? 1 : 0,
    visibility: isDropdownOpen ? 'visible' : 'hidden',
    transform: isDropdownOpen ? 'translateY(0)' : 'translateY(-10px)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    zIndex: 1001,
  };

  const dropdownItemStyle = {
    display: 'flex',
    alignItems: 'center',
    gap: spacing.sm,
    padding: `${spacing.sm} ${spacing.md}`,
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    fontSize: '0.9rem',
    color: colors.text.primary,
    textDecoration: 'none',
    border: 'none',
    background: 'none',
    width: '100%',
    textAlign: 'left',
  };

  const loginButtonStyle = {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '12px',
    padding: `${spacing.sm} ${spacing.lg}`,
    fontSize: isMobile ? '0.875rem' : '1rem',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
  };

  const handleLogout = () => {
    signOut(auth).then(() => {
      navigate('/');
      setIsDropdownOpen(false);
    });
  };

  const goToProfile = () => {
    navigate('/child-profile');
    setIsDropdownOpen(false);
  };

  const goToHome = () => {
    navigate('/');
    setIsDropdownOpen(false);
  };

  const goToMonthlyPlan = () => {
    navigate('/customised-weekly-plan');
    setIsDropdownOpen(false);
  };

  const getUserDisplayName = () => {
    if (user?.displayName) {
      return user.displayName;
    }
    if (user?.email) {
      return user.email.split('@')[0];
    }
    return 'User';
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 17) return 'Good afternoon';
    return 'Good evening';
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="navbar-container" style={navbarStyles}>
      <Link to="/" className="navbar-logo" style={logoStyle}>
        Unschooling
      </Link>
      
      <div style={userSectionStyle}>
        {user ? (
          <>
            <div className="user-greeting" style={greetingStyle}>
              {isMobile ? (
                <div>
                  <div>{getGreeting()}! 👋</div>
                  <div style={{ fontSize: '0.7rem', marginTop: '2px' }}>
                    {getUserDisplayName()}
                  </div>
                </div>
              ) : (
                `${getGreeting()}, ${getUserDisplayName()}! 👋`
              )}
            </div>
            <div style={avatarContainerStyle}>
              <div
                ref={avatarRef}
                className="user-avatar"
                style={{
                  ...avatarStyle,
                  ...(isDropdownOpen ? avatarHoverStyle : {})
                }}
                onClick={toggleDropdown}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
                }}
              >
                {userEmoji}
              </div>
              
              <div ref={dropdownRef} className="dropdown-menu" style={dropdownStyle}>
                <button
                  className="dropdown-item"
                  style={dropdownItemStyle}
                  onClick={goToHome}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(102, 126, 234, 0.1)';
                    e.target.style.color = '#667eea';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'none';
                    e.target.style.color = colors.text.primary;
                  }}
                >
                  🏠 Home
                </button>
                
                <button
                  className="dropdown-item"
                  style={dropdownItemStyle}
                  onClick={goToProfile}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(102, 126, 234, 0.1)';
                    e.target.style.color = '#667eea';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'none';
                    e.target.style.color = colors.text.primary;
                  }}
                >
                  🧠 Child Profile
                </button>

                {/* New Monthly Plan menu item */}
                <button
                  className="dropdown-item"
                  style={dropdownItemStyle}
                  onClick={goToMonthlyPlan}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(102, 126, 234, 0.1)';
                    e.target.style.color = '#667eea';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'none';
                    e.target.style.color = colors.text.primary;
                  }}
                >
                  📅 My Monthly Plan
                </button>
                
                <button
                  className="dropdown-item"
                  style={dropdownItemStyle}
                  onClick={handleLogout}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(239, 68, 68, 0.1)';
                    e.target.style.color = '#dc2626';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'none';
                    e.target.style.color = colors.text.primary;
                  }}
                >
                  🚪 Logout
                </button>
              </div>
            </div>
          </>
        ) : (
          <button
            className="login-button"
            style={loginButtonStyle}
            onClick={() => navigate('/login')}
            onMouseEnter={(e) => {
              e.target.style.transform = 'translateY(-2px)';
              e.target.style.boxShadow = '0 8px 25px rgba(102, 126, 234, 0.4)';
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = 'translateY(0)';
              e.target.style.boxShadow = '0 4px 15px rgba(102, 126, 234, 0.3)';
            }}
          >
            Sign In
          </button>
        )}
      </div>
    </div>
  );
};

export default Navbar; 