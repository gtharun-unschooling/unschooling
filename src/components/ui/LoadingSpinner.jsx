/**
 * Enhanced loading spinner component with accessibility and multiple variants.
 */

import React from 'react';
import './LoadingSpinner.css';

const LoadingSpinner = ({ 
  size = 'medium', 
  color = '#3b82f6', 
  variant = 'spinner',
  text = '',
  className = ''
}) => {
  const sizeMap = {
    tiny: '16px',
    small: '24px',
    medium: '32px',
    large: '48px',
    xlarge: '64px'
  };

  const renderSpinner = () => {
    switch (variant) {
      case 'dots':
        return (
          <div className={`loading-dots ${size}`}>
            <div className="dot"></div>
            <div className="dot"></div>
            <div className="dot"></div>
          </div>
        );
      case 'pulse':
        return (
          <div className={`loading-pulse ${size}`} style={{ backgroundColor: color }}></div>
        );
      case 'bars':
        return (
          <div className={`loading-bars ${size}`}>
            <div className="bar" style={{ backgroundColor: color }}></div>
            <div className="bar" style={{ backgroundColor: color }}></div>
            <div className="bar" style={{ backgroundColor: color }}></div>
          </div>
        );
      default:
        return (
          <div 
            className={`loading-spinner ${size}`}
            style={{
              borderColor: `${color}20`,
              borderTopColor: color
            }}
            role="status"
            aria-label="Loading"
          ></div>
        );
    }
  };

  return (
    <div className={`loading-container ${className}`}>
      {renderSpinner()}
      {text && (
        <div className="loading-text" style={{ color }}>
          {text}
        </div>
      )}
    </div>
  );
};

export default LoadingSpinner; 