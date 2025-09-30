import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const MinimalBackButton = ({ 
  customOnClick = null,
  className = '',
  heroColors = null // Pass hero section colors to sync
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine if we can go back in history
  const canGoBack = window.history.length > 1;
  
  // Get the previous route from state or default to home
  const previousRoute = location.state?.from || '/';

  const handleClick = () => {
    if (customOnClick) {
      customOnClick();
    } else if (canGoBack && window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  // Get text color based on background brightness
  const getTextColor = (bgColor) => {
    if (!bgColor) return '#1f2937';
    const hex = bgColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#1f2937' : '#ffffff';
  };

  // Sync with hero section colors if provided
  const buttonStyle = {
    position: 'absolute', // Position relative to the page container
    top: '1rem', // Position at the very top of the page
    left: '2rem',
    zIndex: 1000,
    background: 'rgba(255, 255, 255, 0.2)',
    backdropFilter: 'blur(10px)',
    border: 'none',
    borderRadius: '50%',
    width: '48px',
    height: '48px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
    color: heroColors ? getTextColor(heroColors.backgroundColor) : '#1f2937',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
  };

  const iconStyle = {
    width: '20px',
    height: '20px',
    transition: 'transform 0.2s ease',
  };

  return (
    <button
      onClick={handleClick}
      style={buttonStyle}
      className={`minimal-back-button ${className}`}
      data-testid="back-button"
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.3)';
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 6px 20px rgba(0, 0, 0, 0.15)';
        
        // Animate icon
        const icon = e.currentTarget.querySelector('.back-icon');
        if (icon) {
          icon.style.transform = 'translateX(-2px)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255, 255, 255, 0.2)';
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 4px 16px rgba(0, 0, 0, 0.1)';
        
        // Reset icon
        const icon = e.currentTarget.querySelector('.back-icon');
        if (icon) {
          icon.style.transform = 'translateX(0)';
        }
      }}
      onFocus={(e) => {
        e.currentTarget.style.outline = '2px solid rgba(59, 130, 246, 0.5)';
        e.currentTarget.style.outlineOffset = '2px';
      }}
      onBlur={(e) => {
        e.currentTarget.style.outline = 'none';
      }}
      aria-label="Go back"
    >
      <svg
        className="back-icon"
        style={iconStyle}
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M19 12H5M12 19l-7-7 7-7" />
      </svg>
    </button>
  );
};

export default MinimalBackButton;
