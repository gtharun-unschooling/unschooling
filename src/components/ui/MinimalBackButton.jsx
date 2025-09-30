import React from 'react';
import { useNavigate } from 'react-router-dom';

const MinimalBackButton = ({ heroColors, onClick }) => {
  const navigate = useNavigate();

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (onClick) {
      onClick();
      return;
    }
    
    // Check if we can go back in history
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      // If no history, navigate to home
      navigate('/');
    }
  };

  const getTextColor = (backgroundColor) => {
    // Simple contrast calculation
    const hex = backgroundColor?.replace('#', '') || 'f8fafc';
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#1f2937' : '#ffffff';
  };

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
    fontSize: '1.2rem',
    transition: 'transform 0.2s ease',
  };

  return (
    <button
      data-testid="back-button"
      onClick={handleClick}
      style={buttonStyle}
      onMouseEnter={(e) => {
        e.target.style.transform = 'scale(1.1)';
        e.target.style.background = 'rgba(255, 255, 255, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.target.style.transform = 'scale(1)';
        e.target.style.background = 'rgba(255, 255, 255, 0.2)';
      }}
      aria-label="Go back"
      title="Go back"
    >
      <span style={iconStyle}>←</span>
    </button>
  );
};

export default MinimalBackButton;
