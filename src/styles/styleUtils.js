/**
 * Style Utilities for Unschooling React
 * Helper functions for generating consistent styles
 */

import { colors, spacing, typography, borderRadius, shadows, transitions } from './designTokens';

/**
 * Generate responsive styles
 */
export const responsive = {
  sm: (styles) => ({
    [`@media (min-width: 640px)`]: styles,
  }),
  md: (styles) => ({
    [`@media (min-width: 768px)`]: styles,
  }),
  lg: (styles) => ({
    [`@media (min-width: 1024px)`]: styles,
  }),
  xl: (styles) => ({
    [`@media (min-width: 1280px)`]: styles,
  }),
};

/**
 * Generate flexbox utilities
 */
export const flex = {
  center: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  between: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  start: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  end: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  column: {
    display: 'flex',
    flexDirection: 'column',
  },
  wrap: {
    display: 'flex',
    flexWrap: 'wrap',
  },
};

/**
 * Generate spacing utilities
 */
export const getSpacing = (size) => spacing[size] || size;

/**
 * Generate typography styles
 */
export const text = {
  h1: {
    fontSize: typography.fontSize['5xl'],
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.lineHeight.tight,
    fontFamily: typography.fontFamily.primary,
    color: colors.text.primary,
  },
  h2: {
    fontSize: typography.fontSize['4xl'],
    fontWeight: typography.fontWeight.bold,
    lineHeight: typography.lineHeight.tight,
    fontFamily: typography.fontFamily.primary,
    color: colors.text.primary,
  },
  h3: {
    fontSize: typography.fontSize['3xl'],
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.tight,
    fontFamily: typography.fontFamily.primary,
    color: colors.text.primary,
  },
  h4: {
    fontSize: typography.fontSize['2xl'],
    fontWeight: typography.fontWeight.semibold,
    lineHeight: typography.lineHeight.normal,
    fontFamily: typography.fontFamily.primary,
    color: colors.text.primary,
  },
  h5: {
    fontSize: typography.fontSize.xl,
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.lineHeight.normal,
    fontFamily: typography.fontFamily.primary,
    color: colors.text.primary,
  },
  h6: {
    fontSize: typography.fontSize.lg,
    fontWeight: typography.fontWeight.medium,
    lineHeight: typography.lineHeight.normal,
    fontFamily: typography.fontFamily.primary,
    color: colors.text.primary,
  },
  body: {
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.normal,
    fontFamily: typography.fontFamily.primary,
    color: colors.text.secondary,
  },
  small: {
    fontSize: typography.fontSize.sm,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.normal,
    fontFamily: typography.fontFamily.primary,
    color: colors.text.tertiary,
  },
  caption: {
    fontSize: typography.fontSize.xs,
    fontWeight: typography.fontWeight.normal,
    lineHeight: typography.lineHeight.normal,
    fontFamily: typography.fontFamily.primary,
    color: colors.text.muted,
  },
};

/**
 * Generate button styles
 */
export const button = {
  primary: {
    backgroundColor: colors.brand.blue,
    color: colors.text.inverse,
    border: 'none',
    borderRadius: borderRadius.lg,
    padding: `${spacing.md} ${spacing.xl}`,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    cursor: 'pointer',
    transition: transitions.normal,
    boxShadow: shadows.sm,
    '&:hover': {
      backgroundColor: colors.primary[700],
      transform: 'translateY(-1px)',
      boxShadow: shadows.md,
    },
    '&:active': {
      transform: 'translateY(0)',
    },
    '&:disabled': {
      backgroundColor: colors.neutral[300],
      cursor: 'not-allowed',
      transform: 'none',
    },
  },
  secondary: {
    backgroundColor: 'transparent',
    color: colors.brand.blue,
    border: `2px solid ${colors.brand.blue}`,
    borderRadius: borderRadius.lg,
    padding: `${spacing.md} ${spacing.xl}`,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    cursor: 'pointer',
    transition: transitions.normal,
    '&:hover': {
      backgroundColor: colors.brand.blue,
      color: colors.text.inverse,
    },
    '&:disabled': {
      borderColor: colors.neutral[300],
      color: colors.neutral[400],
      cursor: 'not-allowed',
    },
  },
  danger: {
    backgroundColor: colors.error[500],
    color: colors.text.inverse,
    border: 'none',
    borderRadius: borderRadius.lg,
    padding: `${spacing.md} ${spacing.xl}`,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    cursor: 'pointer',
    transition: transitions.normal,
    '&:hover': {
      backgroundColor: colors.error[600],
    },
  },
  ghost: {
    backgroundColor: 'transparent',
    color: colors.text.primary,
    border: 'none',
    borderRadius: borderRadius.lg,
    padding: `${spacing.md} ${spacing.xl}`,
    fontSize: typography.fontSize.base,
    fontWeight: typography.fontWeight.medium,
    cursor: 'pointer',
    transition: transitions.normal,
    '&:hover': {
      backgroundColor: colors.neutral[100],
    },
  },
};

/**
 * Generate card styles
 */
export const card = {
  base: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.xl,
    boxShadow: shadows.md,
    padding: spacing.xl,
    border: `1px solid ${colors.neutral[200]}`,
  },
  elevated: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.xl,
    boxShadow: shadows.lg,
    padding: spacing.xl,
    border: `1px solid ${colors.neutral[200]}`,
  },
  interactive: {
    backgroundColor: colors.background.primary,
    borderRadius: borderRadius.xl,
    boxShadow: shadows.md,
    padding: spacing.xl,
    border: `1px solid ${colors.neutral[200]}`,
    cursor: 'pointer',
    transition: transitions.normal,
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: shadows.lg,
    },
  },
};

/**
 * Generate input styles
 */
export const input = {
  base: {
    width: '100%',
    padding: `${spacing.md} ${spacing.lg}`,
    fontSize: typography.fontSize.base,
    border: `1px solid ${colors.neutral[300]}`,
    borderRadius: borderRadius.lg,
    backgroundColor: colors.background.primary,
    color: colors.text.primary,
    transition: transitions.normal,
    fontFamily: typography.fontFamily.primary,
    '&:focus': {
      outline: 'none',
      borderColor: colors.primary[500],
      boxShadow: `0 0 0 3px ${colors.primary[100]}`,
    },
    '&:disabled': {
      backgroundColor: colors.neutral[100],
      color: colors.neutral[400],
      cursor: 'not-allowed',
    },
  },
  error: {
    borderColor: colors.error[500],
    '&:focus': {
      borderColor: colors.error[500],
      boxShadow: `0 0 0 3px ${colors.error[100]}`,
    },
  },
};

/**
 * Generate section styles
 */
export const section = {
  base: {
    padding: `${spacing['3xl']} ${spacing.xl}`,
    width: '100%',
  },
  narrow: {
    padding: `${spacing['2xl']} ${spacing.xl}`,
    width: '100%',
  },
  wide: {
    padding: `${spacing['4xl']} ${spacing.xl}`,
    width: '100%',
  },
};

/**
 * Generate container styles
 */
export const container = {
  base: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: `0 ${spacing.xl}`,
  },
  narrow: {
    maxWidth: '800px',
    margin: '0 auto',
    padding: `0 ${spacing.xl}`,
  },
  wide: {
    maxWidth: '1400px',
    margin: '0 auto',
    padding: `0 ${spacing.xl}`,
  },
};

/**
 * Merge multiple style objects
 */
export const mergeStyles = (...styleObjects) => {
  return styleObjects.reduce((merged, current) => {
    return { ...merged, ...current };
  }, {});
};

/**
 * Create responsive styles
 */
export const createResponsiveStyles = (baseStyles, responsiveStyles = {}) => {
  let styles = { ...baseStyles };
  
  Object.entries(responsiveStyles).forEach(([breakpoint, breakpointStyles]) => {
    if (responsive[breakpoint]) {
      styles = { ...styles, ...responsive[breakpoint](breakpointStyles) };
    }
  });
  
  return styles;
}; 