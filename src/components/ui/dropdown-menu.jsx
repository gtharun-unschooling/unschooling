import React, { useState, useRef, useEffect } from 'react';

export const DropdownMenu = ({ children }) => <div style={{ position: 'relative' }}>{children}</div>;

export const DropdownMenuTrigger = ({ children, onClick }) => (
  <div onClick={onClick} style={{ cursor: 'pointer' }}>{children}</div>
);

export const DropdownMenuContent = ({ children, open }) => {
  if (!open) return null;
  return (
    <div style={{
      position: 'absolute',
      right: 0,
      top: 'calc(100% + 8px)',
      backgroundColor: 'white',
      border: '1px solid #ddd',
      borderRadius: '8px',
      boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
      zIndex: 50,
      padding: '8px',
      minWidth: '160px',
    }}>
      {children}
    </div>
  );
};

export const DropdownMenuItem = ({ children, onClick }) => (
  <div
    onClick={onClick}
    style={{
      padding: '8px',
      cursor: 'pointer',
      borderRadius: '4px',
      transition: 'background 0.2s',
    }}
    onMouseEnter={(e) => e.currentTarget.style.background = '#f3f3f3'}
    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
  >
    {children}
  </div>
);

export const DropdownMenuLabel = ({ children }) => (
  <div style={{ fontWeight: 'bold', padding: '6px 8px', fontSize: '14px' }}>{children}</div>
);

export const DropdownMenuSeparator = () => <hr style={{ margin: '6px 0' }} />;
