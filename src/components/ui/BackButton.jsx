import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const BackButton = ({ 
  to, 
  from,
  text = "← Back", 
  variant = "primary",
  size = "medium",
  className = "",
  style = {}
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    if (to) {
      navigate(to);
    } else if (from) {
      // Smart navigation based on source
      switch (from) {
        case 'weekly-plan':
          navigate('/customised-weekly-plan');
          break;
        case 'profile':
          navigate('/profile');
          break;
        case 'niches':
          navigate('/niches');
          break;
        case 'niche':
          // Extract niche slug from current path and go back to niche page
          const pathParts = location.pathname.split('/');
          if (pathParts.length >= 3) {
            navigate(`/niche/${pathParts[2]}`);
          } else {
            navigate('/niches');
          }
          break;
        case 'home':
          navigate('/');
          break;
        default:
          navigate(from);
      }
    } else {
      // Check if we're on a topic page and came from weekly plan
      const isTopicPage = location.pathname.includes('/niche/') && location.pathname.split('/').length >= 4;
      if (isTopicPage) {
        // Check if we have state information about where we came from
        const state = location.state;
        if (state && state.from === 'weekly-plan') {
          navigate('/customised-weekly-plan');
        } else {
          // Default fallback - go back in history
          navigate(-1);
        }
      } else {
        navigate(-1);
      }
    }
  };

  const baseStyle = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '0.5rem',
    padding: size === 'small' ? '0.5rem 1rem' : size === 'large' ? '1rem 2rem' : '0.75rem 1.5rem',
    borderRadius: '9999px',
    fontWeight: '600',
    fontSize: size === 'small' ? '0.875rem' : size === 'large' ? '1.125rem' : '1rem',
    textDecoration: 'none',
    border: 'none',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    ...style
  };

           const variantStyles = {
           primary: {
             backgroundColor: '#667eea',
             color: '#ffffff',
             boxShadow: '0 4px 15px rgba(102, 126, 234, 0.3)',
             '&:hover': {
               backgroundColor: '#5a67d8',
               transform: 'translateY(-2px)',
               boxShadow: '0 8px 25px rgba(102, 126, 234, 0.4)',
             }
           },
           secondary: {
             backgroundColor: '#f3f4f6',
             color: '#374151',
             border: '1px solid #d1d5db',
             '&:hover': {
               backgroundColor: '#e5e7eb',
               transform: 'translateY(-2px)',
               boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
             }
           },
           colorful: {
             backgroundColor: '#ff6b6b',
             color: '#ffffff',
             boxShadow: '0 4px 15px rgba(255, 107, 107, 0.3)',
             '&:hover': {
               backgroundColor: '#ff5252',
               transform: 'translateY(-2px)',
               boxShadow: '0 8px 25px rgba(255, 107, 107, 0.4)',
             }
           },
           finance: {
             backgroundColor: '#10b981',
             color: '#ffffff',
             boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)',
             '&:hover': {
               backgroundColor: '#059669',
               transform: 'translateY(-2px)',
               boxShadow: '0 8px 25px rgba(16, 185, 129, 0.4)',
             }
           },
           communication: {
             backgroundColor: '#3b82f6',
             color: '#ffffff',
             boxShadow: '0 4px 15px rgba(59, 130, 246, 0.3)',
             '&:hover': {
               backgroundColor: '#2563eb',
               transform: 'translateY(-2px)',
               boxShadow: '0 8px 25px rgba(59, 130, 246, 0.4)',
             }
           },
           entrepreneurship: {
             backgroundColor: '#f59e0b',
             color: '#ffffff',
             boxShadow: '0 4px 15px rgba(245, 158, 11, 0.3)',
             '&:hover': {
               backgroundColor: '#d97706',
               transform: 'translateY(-2px)',
               boxShadow: '0 8px 25px rgba(245, 158, 11, 0.4)',
             }
           },
           science: {
             backgroundColor: '#8b5cf6',
             color: '#ffffff',
             boxShadow: '0 4px 15px rgba(139, 92, 246, 0.3)',
             '&:hover': {
               backgroundColor: '#7c3aed',
               transform: 'translateY(-2px)',
               boxShadow: '0 8px 25px rgba(139, 92, 246, 0.4)',
             }
           },
           art: {
             backgroundColor: '#ec4899',
             color: '#ffffff',
             boxShadow: '0 4px 15px rgba(236, 72, 153, 0.3)',
             '&:hover': {
               backgroundColor: '#db2777',
               transform: 'translateY(-2px)',
               boxShadow: '0 8px 25px rgba(236, 72, 153, 0.4)',
             }
           },
           technology: {
             backgroundColor: '#6366f1',
             color: '#ffffff',
             boxShadow: '0 4px 15px rgba(99, 102, 241, 0.3)',
             '&:hover': {
               backgroundColor: '#4f46e5',
               transform: 'translateY(-2px)',
               boxShadow: '0 8px 25px rgba(99, 102, 241, 0.4)',
             }
           },
           health: {
             backgroundColor: '#ef4444',
             color: '#ffffff',
             boxShadow: '0 4px 15px rgba(239, 68, 68, 0.3)',
             '&:hover': {
               backgroundColor: '#dc2626',
               transform: 'translateY(-2px)',
               boxShadow: '0 8px 25px rgba(239, 68, 68, 0.4)',
             }
           },
           environment: {
             backgroundColor: '#22c55e',
             color: '#ffffff',
             boxShadow: '0 4px 15px rgba(34, 197, 94, 0.3)',
             '&:hover': {
               backgroundColor: '#16a34a',
               transform: 'translateY(-2px)',
               boxShadow: '0 8px 25px rgba(34, 197, 94, 0.4)',
             }
           },
           outline: {
             backgroundColor: 'transparent',
             color: '#667eea',
             border: '2px solid #667eea',
             '&:hover': {
               backgroundColor: '#667eea',
               color: '#ffffff',
               transform: 'translateY(-2px)',
               boxShadow: '0 8px 25px rgba(102, 126, 234, 0.3)',
             }
           },
           ghost: {
             backgroundColor: 'transparent',
             color: '#6b7280',
             '&:hover': {
               backgroundColor: '#f3f4f6',
               color: '#374151',
               transform: 'translateY(-1px)',
             }
           }
         };

           const buttonStyle = {
           ...baseStyle,
           ...(variantStyles[variant] || variantStyles.primary),
           '&:active': {
             transform: 'translateY(0)',
           }
         };

  return (
    <button
      onClick={handleClick}
      className={`back-button ${className}`}
      style={buttonStyle}
                   onMouseEnter={(e) => {
               const currentVariant = variantStyles[variant] || variantStyles.primary;
               const hoverStyles = currentVariant['&:hover'];
               if (hoverStyles) {
                 Object.assign(e.target.style, hoverStyles);
               }
             }}
             onMouseLeave={(e) => {
               Object.assign(e.target.style, buttonStyle);
             }}
    >
               <span style={{ 
           fontSize: size === 'small' ? '0.875rem' : size === 'large' ? '1.125rem' : '1rem',
           lineHeight: 1,
           transition: 'transform 0.2s ease'
         }}>
           ←
         </span>
      {text}
    </button>
  );
};

export default BackButton; 