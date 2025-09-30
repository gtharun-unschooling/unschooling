/**
 * ========================================
 * RESPONSIVE UTILITIES
 * Clear separation between Desktop and Mobile styles
 * ========================================
 */

// Breakpoint constants
export const BREAKPOINTS = {
  MOBILE: 768,      // Below 768px is mobile
  TABLET: 1024,     // 768px - 1024px is tablet
  DESKTOP: 1025     // Above 1024px is desktop
};

// Hook to detect screen size
export const useResponsive = () => {
  const [screenSize, setScreenSize] = useState('desktop');

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      if (width < BREAKPOINTS.MOBILE) {
        setScreenSize('mobile');
      } else if (width < BREAKPOINTS.TABLET) {
        setScreenSize('tablet');
      } else {
        setScreenSize('desktop');
      }
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return {
    isMobile: screenSize === 'mobile',
    isTablet: screenSize === 'tablet',
    isDesktop: screenSize === 'desktop',
    screenSize
  };
};

// Utility function to create responsive styles
export const createResponsiveStyles = (desktopStyles, mobileStyles, tabletStyles = null) => {
  return {
    desktop: desktopStyles,
    mobile: mobileStyles,
    tablet: tabletStyles || desktopStyles // Fallback to desktop if no tablet styles
  };
};

// CSS-in-JS responsive style helper
export const getResponsiveStyle = (styles, currentScreenSize) => {
  switch (currentScreenSize) {
    case 'mobile':
      return styles.mobile;
    case 'tablet':
      return styles.tablet || styles.desktop;
    case 'desktop':
    default:
      return styles.desktop;
  }
};

// Media query helpers for CSS
export const MEDIA_QUERIES = {
  MOBILE: `@media (max-width: ${BREAKPOINTS.MOBILE - 1}px)`,
  TABLET: `@media (min-width: ${BREAKPOINTS.MOBILE}px) and (max-width: ${BREAKPOINTS.TABLET - 1}px)`,
  DESKTOP: `@media (min-width: ${BREAKPOINTS.TABLET}px)`,
  MOBILE_AND_TABLET: `@media (max-width: ${BREAKPOINTS.TABLET - 1}px)`,
  TABLET_AND_DESKTOP: `@media (min-width: ${BREAKPOINTS.MOBILE}px)`
};

// Common responsive values
export const RESPONSIVE_VALUES = {
  // Font sizes
  FONT_SIZES: {
    HERO: {
      DESKTOP: 'clamp(3rem, 8vw, 7rem)',
      MOBILE: 'clamp(2.5rem, 7vw, 4rem)'
    },
    SUBTITLE: {
      DESKTOP: 'clamp(2rem, 6vw, 5rem)',
      MOBILE: 'clamp(2rem, 6vw, 3.5rem)'
    },
    BODY: {
      DESKTOP: '1.1rem',
      MOBILE: '1rem'
    },
    SMALL: {
      DESKTOP: '0.9rem',
      MOBILE: '0.85rem'
    }
  },
  
  // Spacing
  SPACING: {
    SECTION_PADDING: {
      DESKTOP: '2vh 2vw',
      MOBILE: '1vh 4vw'
    },
    CONTAINER_PADDING: {
      DESKTOP: '0 2rem',
      MOBILE: '0 1rem'
    }
  },
  
  // Dropdown dimensions
  DROPDOWN: {
    WIDTH: {
      DESKTOP: '320px',
      MOBILE: '200px'
    },
    POSITION: {
      DESKTOP: 'right: 0',
      MOBILE: 'right: 10px'
    }
  }
};

// CSS class helpers
export const RESPONSIVE_CLASSES = {
  MOBILE_ONLY: 'mobile-only',
  DESKTOP_ONLY: 'desktop-only',
  TABLET_ONLY: 'tablet-only',
  MOBILE_AND_TABLET: 'mobile-tablet-only',
  TABLET_AND_DESKTOP: 'tablet-desktop-only'
};

// Helper to conditionally apply classes
export const getResponsiveClass = (screenSize, baseClass = '') => {
  const classes = [baseClass];
  
  switch (screenSize) {
    case 'mobile':
      classes.push(RESPONSIVE_CLASSES.MOBILE_ONLY);
      break;
    case 'tablet':
      classes.push(RESPONSIVE_CLASSES.TABLET_ONLY);
      break;
    case 'desktop':
      classes.push(RESPONSIVE_CLASSES.DESKTOP_ONLY);
      break;
  }
  
  return classes.filter(Boolean).join(' ');
};

// Import React hooks
import { useState, useEffect } from 'react';
