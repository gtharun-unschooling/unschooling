import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// Google Analytics configuration
const GA_TRACKING_ID = process.env.REACT_APP_GA_TRACKING_ID || 'G-XXXXXXXXXX';

// Initialize Google Analytics
export const initializeGA = () => {
  if (typeof window !== 'undefined' && GA_TRACKING_ID) {
    // Load Google Analytics script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    function gtag() {
      window.dataLayer.push(arguments);
    }
    window.gtag = gtag;
    gtag('js', new Date());
    gtag('config', GA_TRACKING_ID, {
      page_title: document.title,
      page_location: window.location.href,
    });
  }
};

// Track page views
export const trackPageView = (path) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', GA_TRACKING_ID, {
      page_path: path,
      page_title: document.title,
      page_location: window.location.href,
    });
  }
};

// Track custom events
export const trackEvent = (action, category, label, value) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value,
    });
  }
};

// Track user interactions
export const trackUserInteraction = (interactionType, details) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'user_interaction', {
      event_category: 'engagement',
      event_label: interactionType,
      custom_parameters: details,
    });
  }
};

// Track conversion events
export const trackConversion = (conversionType, value, currency = 'INR') => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'conversion', {
      send_to: GA_TRACKING_ID,
      event_category: 'conversion',
      event_label: conversionType,
      value: value,
      currency: currency,
    });
  }
};

// Track subscription events
export const trackSubscription = (planName, planPrice) => {
  trackEvent('subscription', 'business', planName, planPrice);
  trackConversion('subscription', planPrice);
};

// Track learning progress
export const trackLearningProgress = (childAge, activityType, progressValue) => {
  trackEvent('learning_progress', 'education', `${childAge}_${activityType}`, progressValue);
};

// Track content engagement
export const trackContentEngagement = (contentType, contentId, engagementType) => {
  trackEvent('content_engagement', 'content', `${contentType}_${engagementType}`, contentId);
};

// Google Analytics Provider Component
const GoogleAnalytics = ({ children }) => {
  const location = useLocation();

  useEffect(() => {
    // Initialize GA on first load
    initializeGA();
  }, []);

  useEffect(() => {
    // Track page views on route changes
    if (typeof window !== 'undefined' && window.gtag) {
      trackPageView(location.pathname);
    }
  }, [location]);

  return <>{children}</>;
};

export default GoogleAnalytics;
