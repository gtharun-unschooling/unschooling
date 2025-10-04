import React, { useState, useEffect } from 'react';

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted');
    setShowBanner(false);
  };

  if (!showBanner) return null;

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      background: 'rgba(0, 0, 0, 0.6)',
      color: 'white',
      padding: '1px 6px',
      fontSize: '8px',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: '4px',
      zIndex: 10000,
      height: '12px'
    }}>
      <span>Cookies</span>
      <button 
        onClick={handleAccept}
        style={{
          background: 'transparent',
          border: '1px solid rgba(255,255,255,0.2)',
          color: 'white',
          padding: '0px 2px',
          fontSize: '7px',
          cursor: 'pointer',
          borderRadius: '1px',
          lineHeight: '1'
        }}
      >
        OK
      </button>
    </div>
  );
};

export default CookieConsent;
