import React, { useState, useEffect } from 'react';
import { Box, Button, Typography, Paper, Switch, FormControlLabel, Divider } from '@mui/material';
import { Cookie, Settings, CheckCircle } from '@mui/icons-material';

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [cookiePreferences, setCookiePreferences] = useState({
    essential: true,
    analytics: false,
    marketing: false,
    preferences: false
  });

  useEffect(() => {
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const preferences = {
      essential: true,
      analytics: true,
      marketing: true,
      preferences: true
    };
    setCookiePreferences(preferences);
    savePreferences(preferences);
    setShowBanner(false);
  };

  const handleRejectAll = () => {
    const preferences = {
      essential: true,
      analytics: false,
      marketing: false,
      preferences: false
    };
    setCookiePreferences(preferences);
    savePreferences(preferences);
    setShowBanner(false);
  };

  const handleSavePreferences = () => {
    savePreferences(cookiePreferences);
    setShowBanner(false);
    setShowSettings(false);
  };

  const savePreferences = (preferences) => {
    localStorage.setItem('cookieConsent', JSON.stringify(preferences));
    localStorage.setItem('cookieConsentDate', new Date().toISOString());
    
    // Initialize analytics if accepted
    if (preferences.analytics) {
      initializeAnalytics();
    }
    
    // Initialize marketing if accepted
    if (preferences.marketing) {
      initializeMarketing();
    }
  };

  const initializeAnalytics = () => {
    // Google Analytics initialization
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        'analytics_storage': 'granted'
      });
    }
  };

  const initializeMarketing = () => {
    // Marketing tools initialization
    if (typeof window !== 'undefined' && window.gtag) {
      window.gtag('consent', 'update', {
        'ad_storage': 'granted'
      });
    }
  };

  const handlePreferenceChange = (type) => {
    setCookiePreferences(prev => ({
      ...prev,
      [type]: !prev[type]
    }));
  };

  if (!showBanner) return null;

  return (
    <Box
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 9999,
        p: 2,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        backdropFilter: 'blur(10px)'
      }}
    >
      <Paper
        elevation={8}
        sx={{
          maxWidth: 600,
          mx: 'auto',
          p: 3,
          borderRadius: 2
        }}
      >
        {!showSettings ? (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Cookie sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" component="h2">
                Cookie Consent
              </Typography>
            </Box>
            
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              We use cookies to enhance your experience, analyze site traffic, and personalize content. 
              By clicking "Accept All", you consent to our use of cookies. You can customize your preferences below.
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
              <Button
                variant="outlined"
                onClick={() => setShowSettings(true)}
                startIcon={<Settings />}
                sx={{ minWidth: 140 }}
              >
                Customize
              </Button>
              <Button
                variant="outlined"
                onClick={handleRejectAll}
                sx={{ minWidth: 120 }}
              >
                Reject All
              </Button>
              <Button
                variant="contained"
                onClick={handleAcceptAll}
                startIcon={<CheckCircle />}
                sx={{ minWidth: 140 }}
              >
                Accept All
              </Button>
            </Box>
          </>
        ) : (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Settings sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" component="h2">
                Cookie Preferences
              </Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={cookiePreferences.essential}
                    disabled
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      Essential Cookies
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Required for basic website functionality. Cannot be disabled.
                    </Typography>
                  </Box>
                }
              />
            </Box>

            <Divider sx={{ my: 2 }} />

            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={cookiePreferences.analytics}
                    onChange={() => handlePreferenceChange('analytics')}
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      Analytics Cookies
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Help us understand how visitors interact with our website.
                    </Typography>
                  </Box>
                }
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={cookiePreferences.marketing}
                    onChange={() => handlePreferenceChange('marketing')}
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      Marketing Cookies
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Used to deliver personalized advertisements and track campaign performance.
                    </Typography>
                  </Box>
                }
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={cookiePreferences.preferences}
                    onChange={() => handlePreferenceChange('preferences')}
                    color="primary"
                  />
                }
                label={
                  <Box>
                    <Typography variant="body2" fontWeight="bold">
                      Preference Cookies
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Remember your settings and preferences for a better experience.
                    </Typography>
                  </Box>
                }
              />
            </Box>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
              <Button
                variant="outlined"
                onClick={() => setShowSettings(false)}
                sx={{ minWidth: 120 }}
              >
                Back
              </Button>
              <Button
                variant="contained"
                onClick={handleSavePreferences}
                startIcon={<CheckCircle />}
                sx={{ minWidth: 140 }}
              >
                Save Preferences
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Box>
  );
};

export default CookieConsent;
