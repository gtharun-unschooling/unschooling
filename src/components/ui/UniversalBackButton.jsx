import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { colorSystem } from '../../styles/colors';

const UniversalBackButton = ({ 
  text = 'Back', 
  variant = 'primary', 
  size = 'medium',
  showIcon = true,
  customStyle = {},
  customOnClick = null,
  className = ''
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
    } else if (canGoBack) {
      navigate(-1);
    } else {
      navigate(previousRoute);
    }
  };

  // Size variants
  const sizeStyles = {
    small: {
      padding: '8px 16px',
      fontSize: '0.875rem',
      iconSize: '16px',
      borderRadius: '6px',
    },
    medium: {
      padding: '12px 20px',
      fontSize: '1rem',
      iconSize: '18px',
      borderRadius: '8px',
    },
    large: {
      padding: '16px 24px',
      fontSize: '1.125rem',
      iconSize: '20px',
      borderRadius: '10px',
    },
  };

  // Color variants
  const variantStyles = {
    primary: {
      background: colorSystem.luxury.sapphire[500],
      backgroundHover: colorSystem.luxury.sapphire[600],
      color: colorSystem.text.inverse,
      border: `1px solid ${colorSystem.luxury.sapphire[500]}`,
      shadow: `0 2px 8px ${colorSystem.luxury.sapphire[200]}`,
    },
    secondary: {
      background: colorSystem.neutral[100],
      backgroundHover: colorSystem.neutral[200],
      color: colorSystem.text.primary,
      border: `1px solid ${colorSystem.neutral[300]}`,
      shadow: `0 2px 8px ${colorSystem.neutral[100]}`,
    },
    ghost: {
      background: 'transparent',
      backgroundHover: colorSystem.neutral[50],
      color: colorSystem.text.secondary,
      border: `1px solid transparent`,
      shadow: 'none',
    },
    luxury: {
      background: `linear-gradient(135deg, ${colorSystem.luxury.emerald[500]} 0%, ${colorSystem.luxury.teal[500]} 100%)`,
      backgroundHover: `linear-gradient(135deg, ${colorSystem.luxury.emerald[600]} 0%, ${colorSystem.luxury.teal[600]} 100%)`,
      color: colorSystem.text.inverse,
      border: `1px solid ${colorSystem.luxury.emerald[500]}`,
      shadow: `0 4px 12px ${colorSystem.luxury.emerald[200]}`,
    },
  };

  const currentSize = sizeStyles[size];
  const currentVariant = variantStyles[variant];

  const buttonStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '8px',
    padding: currentSize.padding,
    fontSize: currentSize.fontSize,
    fontWeight: '500',
    borderRadius: currentSize.borderRadius,
    background: currentVariant.background,
    color: currentVariant.color,
    border: currentVariant.border,
    boxShadow: currentVariant.shadow,
    cursor: 'pointer',
    transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
    textDecoration: 'none',
    outline: 'none',
    fontFamily: 'inherit',
    lineHeight: '1.5',
    letterSpacing: '0.025em',
    position: 'relative',
    overflow: 'hidden',
    ...customStyle,
  };

  const iconStyle = {
    width: currentSize.iconSize,
    height: currentSize.iconSize,
    transition: 'transform 0.2s ease',
  };

  return (
    <button
      onClick={handleClick}
      style={buttonStyle}
      className={`universal-back-button ${className}`}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = currentVariant.backgroundHover;
        e.currentTarget.style.transform = 'translateY(-1px)';
        e.currentTarget.style.boxShadow = variant === 'luxury' 
          ? `0 6px 16px ${colorSystem.luxury.emerald[300]}`
          : `0 4px 12px ${colorSystem.neutral[200]}`;
        
        // Animate icon
        if (showIcon) {
          const icon = e.currentTarget.querySelector('.back-icon');
          if (icon) {
            icon.style.transform = 'translateX(-2px)';
          }
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = currentVariant.background;
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = currentVariant.shadow;
        
        // Reset icon
        if (showIcon) {
          const icon = e.currentTarget.querySelector('.back-icon');
          if (icon) {
            icon.style.transform = 'translateX(0)';
          }
        }
      }}
      onFocus={(e) => {
        e.currentTarget.style.outline = `2px solid ${colorSystem.luxury.sapphire[400]}`;
        e.currentTarget.style.outlineOffset = '2px';
      }}
      onBlur={(e) => {
        e.currentTarget.style.outline = 'none';
      }}
      aria-label={`Go back ${text.toLowerCase()}`}
    >
      {showIcon && (
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
      )}
      <span>{text}</span>
    </button>
  );
};

// CSS-in-JS styles for additional polish
const additionalStyles = `
  .universal-back-button {
    position: relative;
    z-index: 1;
  }
  
  .universal-back-button::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%);
    border-radius: inherit;
    opacity: 0;
    transition: opacity 0.2s ease;
    pointer-events: none;
  }
  
  .universal-back-button:hover::before {
    opacity: 1;
  }
  
  .universal-back-button:active {
    transform: translateY(0) scale(0.98) !important;
  }
  
  .back-icon {
    flex-shrink: 0;
  }
  
  /* Responsive adjustments */
  @media (max-width: 768px) {
    .universal-back-button {
      padding: 10px 16px !important;
      font-size: 0.9rem !important;
    }
  }
  
  @media (max-width: 480px) {
    .universal-back-button {
      padding: 8px 12px !important;
      font-size: 0.875rem !important;
      gap: 6px !important;
    }
  }
`;

// Inject styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = additionalStyles;
  document.head.appendChild(styleSheet);
}

export default UniversalBackButton;
