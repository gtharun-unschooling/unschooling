import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const AdminNav = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const adminLinks = [
    { path: '/admin', label: 'ADMIN PANEL', icon: '⚙️' }
  ];

  const isActive = (path) => location.pathname === path;

  // Admin-specific styling - different from regular navbar
  const adminNavStyle = {
    position: 'fixed',
    top: '20px',
    left: '20px',
    zIndex: 1000
  };

  const adminButtonStyle = {
    backgroundColor: '#ff6b6b',
    color: '#ffffff',
    border: 'none',
    borderRadius: '50%',
    width: '60px',
    height: '60px',
    fontSize: '1.8rem',
    cursor: 'pointer',
    boxShadow: '0 8px 25px rgba(255, 107, 107, 0.4)',
    transition: 'all 0.3s ease',
    border: '3px solid #ff4757',
    fontFamily: 'monospace',
    fontWeight: 'bold'
  };

  const adminMenuStyle = {
    position: 'absolute',
    top: '70px',
    left: '0',
    backgroundColor: 'rgba(26, 26, 46, 0.95)',
    backdropFilter: 'blur(20px)',
    borderRadius: '15px',
    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.5)',
    padding: '20px',
    minWidth: '250px',
    border: '2px solid #ff4757',
    color: '#ffffff'
  };

  const adminMenuHeaderStyle = {
    fontSize: '1rem',
    fontWeight: 'bold',
    color: '#ff6b6b',
    marginBottom: '15px',
    borderBottom: '2px solid #ff4757',
    paddingBottom: '10px',
    textAlign: 'center',
    fontFamily: 'monospace',
    textTransform: 'uppercase',
    letterSpacing: '2px'
  };

  const adminLinkStyle = (isActive) => ({
    display: 'flex',
    alignItems: 'center',
    padding: '15px 20px',
    textDecoration: 'none',
    color: isActive ? '#ff6b6b' : '#f1f2f6',
    backgroundColor: isActive ? 'rgba(255, 107, 107, 0.2)' : 'transparent',
    borderRadius: '10px',
    marginBottom: '10px',
    transition: 'all 0.3s ease',
    fontWeight: isActive ? 'bold' : 'normal',
    fontFamily: 'monospace',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    border: `2px solid ${isActive ? '#ff6b6b' : 'transparent'}`,
    '&:hover': {
      backgroundColor: 'rgba(255, 107, 107, 0.1)',
      transform: 'translateX(5px)'
    }
  });

  return (
    <div style={adminNavStyle}>
      {/* Admin Toggle Button - Cyberpunk style */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        style={adminButtonStyle}
        onMouseEnter={(e) => {
          e.target.style.transform = 'scale(1.1)';
          e.target.style.boxShadow = '0 12px 35px rgba(255, 107, 107, 0.6)';
        }}
        onMouseLeave={(e) => {
          e.target.style.transform = 'scale(1)';
          e.target.style.boxShadow = '0 8px 25px rgba(255, 107, 107, 0.4)';
        }}
      >
        ⚙️
      </button>

      {/* Admin Menu - Dark theme */}
      {isOpen && (
        <div style={adminMenuStyle}>
          <div style={adminMenuHeaderStyle}>
            ADMIN TOOLS
          </div>
          
          {adminLinks.map((link) => (
            <Link
              key={link.label}
              to={link.path}
              style={adminLinkStyle(isActive(link.path))}
              onClick={() => setIsOpen(false)}
            >
              <span style={{ marginRight: '15px', fontSize: '1.2rem' }}>{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </div>
      )}

      {/* Backdrop to close menu */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999
          }}
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminNav; 