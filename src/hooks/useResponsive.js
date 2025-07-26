import { useState, useEffect } from 'react';

/**
 * Custom hook for responsive design
 * Provides screen size detection and responsive utilities
 */
export const useResponsive = () => {
  const [screenSize, setScreenSize] = useState({
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
  });

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setScreenSize({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
        width,
      });
    };

    // Check initial size
    checkScreenSize();

    // Add event listener
    window.addEventListener('resize', checkScreenSize);

    // Cleanup
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  return {
    ...screenSize,
    // Utility functions
    isSmallScreen: screenSize.isMobile,
    isMediumScreen: screenSize.isTablet,
    isLargeScreen: screenSize.isDesktop,
    // Responsive values helper
    responsive: (mobile, tablet, desktop) => {
      if (screenSize.isMobile) return mobile;
      if (screenSize.isTablet) return tablet;
      return desktop;
    },
  };
};

export default useResponsive; 