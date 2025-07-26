/**
 * Global Styles for Unschooling React
 * Base styles and CSS resets for consistent appearance
 */

import { colors, typography } from './designTokens';

export const globalStyles = {
  // CSS Reset and Base Styles
  '*': {
    margin: 0,
    padding: 0,
    boxSizing: 'border-box',
  },

  'html, body': {
    height: '100%',
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.base,
    lineHeight: typography.lineHeight.normal,
    color: colors.text.primary,
    backgroundColor: colors.background.primary,
    WebkitFontSmoothing: 'antialiased',
    MozOsxFontSmoothing: 'grayscale',
  },

  '#root': {
    height: '100%',
  },

  // Typography
  'h1, h2, h3, h4, h5, h6': {
    fontFamily: typography.fontFamily.primary,
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.lineHeight.tight,
    color: colors.text.primary,
  },

  'p': {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.base,
    lineHeight: typography.lineHeight.normal,
    color: colors.text.secondary,
    marginBottom: '1rem',
  },

  'a': {
    color: colors.primary[600],
    textDecoration: 'none',
    transition: 'color 0.2s ease-in-out',
    '&:hover': {
      color: colors.primary[700],
      textDecoration: 'underline',
    },
  },

  // Form Elements
  'input, textarea, select, button': {
    fontFamily: typography.fontFamily.primary,
    fontSize: typography.fontSize.base,
  },

  'button': {
    cursor: 'pointer',
    border: 'none',
    background: 'none',
    fontFamily: 'inherit',
  },

  'input:focus, textarea:focus, select:focus': {
    outline: 'none',
  },

  // Lists
  'ul, ol': {
    listStyle: 'none',
  },

  // Images
  'img': {
    maxWidth: '100%',
    height: 'auto',
  },

  // Scrollbar Styling
  '::-webkit-scrollbar': {
    width: '8px',
    height: '8px',
  },

  '::-webkit-scrollbar-track': {
    background: colors.neutral[100],
  },

  '::-webkit-scrollbar-thumb': {
    background: colors.neutral[300],
    borderRadius: '4px',
    '&:hover': {
      background: colors.neutral[400],
    },
  },

  // Selection
  '::selection': {
    backgroundColor: colors.primary[200],
    color: colors.text.primary,
  },

  // Focus styles for accessibility
  '*:focus-visible': {
    outline: `2px solid ${colors.primary[500]}`,
    outlineOffset: '2px',
  },

  // Utility classes
  '.sr-only': {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: 0,
  },

  '.visually-hidden': {
    position: 'absolute',
    width: '1px',
    height: '1px',
    padding: 0,
    margin: '-1px',
    overflow: 'hidden',
    clip: 'rect(0, 0, 0, 0)',
    whiteSpace: 'nowrap',
    border: 0,
  },
};

/**
 * Apply global styles to the document
 */
export const applyGlobalStyles = () => {
  const styleElement = document.createElement('style');
  styleElement.id = 'global-styles';
  
  const cssRules = Object.entries(globalStyles)
    .map(([selector, styles]) => {
      const cssProperties = Object.entries(styles)
        .map(([property, value]) => {
          // Handle nested selectors (like :hover)
          if (typeof value === 'object') {
            const nestedRules = Object.entries(value)
              .map(([nestedProperty, nestedValue]) => `${nestedProperty}: ${nestedValue};`)
              .join(' ');
            return `${selector} ${property} { ${nestedRules} }`;
          }
          return `${property}: ${value};`;
        })
        .join(' ');
      
      return `${selector} { ${cssProperties} }`;
    })
    .join('\n');
  
  styleElement.textContent = cssRules;
  
  // Remove existing global styles if they exist
  const existingStyles = document.getElementById('global-styles');
  if (existingStyles) {
    existingStyles.remove();
  }
  
  document.head.appendChild(styleElement);
};

/**
 * Remove global styles from the document
 */
export const removeGlobalStyles = () => {
  const styleElement = document.getElementById('global-styles');
  if (styleElement) {
    styleElement.remove();
  }
}; 