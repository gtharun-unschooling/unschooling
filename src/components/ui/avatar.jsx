import React from 'react';

export const Avatar = ({ children }) => (
  <div style={{
    width: '32px',
    height: '32px',
    borderRadius: '50%',
    backgroundColor: '#ccc',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '14px',
  }}>
    {children}
  </div>
);

export const AvatarFallback = ({ children }) => <>{children}</>;
