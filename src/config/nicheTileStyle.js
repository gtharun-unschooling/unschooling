/**
 * Niche Tile Style Configuration
 * 
 * This file controls the visual style of niche tiles.
 * Set USE_ENHANCED_TILE_STYLE to true to use the enhanced design,
 * or false to revert to the default design.
 * 
 * You can also toggle this via localStorage:
 * localStorage.setItem('nicheTileStyle', 'enhanced') // or 'default'
 */

// Set to true for enhanced style, false for default
const USE_ENHANCED_TILE_STYLE = true;

// Get style preference from localStorage if available (only in browser)
const getTileStylePreference = () => {
  if (typeof window === 'undefined' || !window.localStorage) {
    return USE_ENHANCED_TILE_STYLE;
  }
  try {
    const stored = localStorage.getItem('nicheTileStyle');
    if (stored === 'enhanced' || stored === 'default') {
      return stored === 'enhanced';
    }
  } catch (e) {
    // localStorage might not be available
  }
  return USE_ENHANCED_TILE_STYLE;
};

export const isEnhancedStyle = getTileStylePreference();

// Function to toggle style (can be called from browser console)
export const toggleTileStyle = () => {
  const current = getTileStylePreference();
  const newStyle = !current ? 'enhanced' : 'default';
  localStorage.setItem('nicheTileStyle', newStyle);
  window.location.reload(); // Reload to apply new style
};

// Default tile styles (original design)
export const defaultTileStyles = {
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: '1rem',
    padding: '1.2rem',
    boxShadow: '0 8px 25px rgba(0, 0, 0, 0.08)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    cursor: 'pointer',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    maxWidth: '400px',
    margin: '0 auto',
    background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.7) 100%)',
  },
  hover: {
    transform: 'translateY(-8px) scale(1.02)',
    boxShadow: '0 20px 60px rgba(0, 0, 0, 0.15)',
  },
  hoverLeave: {
    transform: 'translateY(0) scale(1)',
    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
  },
};

// Enhanced tile styles (new modern design - EXTREMELY VISIBLE)
export const enhancedTileStyles = {
  card: {
    backgroundColor: 'rgba(255, 255, 255, 1)',
    borderRadius: '2.5rem', // EXTREMELY rounded - VERY VISIBLE
    padding: '2rem', // Much more padding - VERY VISIBLE
    border: '3px solid rgba(0, 0, 0, 0.12)', // Thick visible border - VERY VISIBLE
    borderTop: '3px solid rgba(0, 0, 0, 0.12)',
    borderRight: '3px solid rgba(0, 0, 0, 0.12)',
    borderBottom: '3px solid rgba(0, 0, 0, 0.12)',
    // borderLeft will be set inline by niche.Color, so we don't override it
    cursor: 'pointer',
    transition: 'all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1)',
    position: 'relative',
    overflow: 'hidden',
    maxWidth: '400px',
    margin: '0 auto',
    background: 'linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(248,250,252,1) 100%)',
    // EXTREMELY visible shadows - VERY VISIBLE
    boxShadow: '0 12px 40px rgba(0, 0, 0, 0.15), 0 4px 12px rgba(0, 0, 0, 0.1), inset 0 2px 0 rgba(255,255,255,0.9)',
  },
  hover: {
    transform: 'translateY(-16px) scale(1.05)', // More dramatic hover
    boxShadow: '0 24px 80px rgba(0, 0, 0, 0.16), 0 8px 24px rgba(0, 0, 0, 0.12), inset 0 1px 0 rgba(255,255,255,0.8)',
  },
  hoverLeave: {
    transform: 'translateY(0) scale(1)',
    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08), inset 0 1px 0 rgba(255,255,255,0.8)',
  },
};

// Get the active tile styles based on preference
export const getTileStyles = () => {
  return isEnhancedStyle ? enhancedTileStyles : defaultTileStyles;
};

// Export for easy access
export default {
  isEnhancedStyle,
  toggleTileStyle,
  getTileStyles,
  defaultTileStyles,
  enhancedTileStyles,
};

