import { spacing, typography, colors } from './designTokens';

// Breakpoints
export const breakpoints = {
  mobile: '480px',
  tablet: '768px',
  desktop: '1024px',
  wide: '1280px',
};

// Responsive spacing
export const responsiveSpacing = {
  mobile: {
    xs: spacing.xs,
    sm: spacing.sm,
    md: spacing.md,
    lg: spacing.lg,
    xl: spacing.xl,
    '2xl': spacing['2xl'],
    '3xl': spacing['3xl'],
  },
  tablet: {
    xs: spacing.sm,
    sm: spacing.md,
    md: spacing.lg,
    lg: spacing.xl,
    xl: spacing['2xl'],
    '2xl': spacing['3xl'],
    '3xl': spacing['4xl'],
  },
  desktop: {
    xs: spacing.sm,
    sm: spacing.md,
    md: spacing.lg,
    lg: spacing.xl,
    xl: spacing['2xl'],
    '2xl': spacing['3xl'],
    '3xl': spacing['4xl'],
  },
};

// Responsive typography
export const responsiveTypography = {
  mobile: {
    h1: { fontSize: '1.75rem', lineHeight: 1.2 },
    h2: { fontSize: '1.5rem', lineHeight: 1.3 },
    h3: { fontSize: '1.25rem', lineHeight: 1.4 },
    h4: { fontSize: '1.125rem', lineHeight: 1.4 },
    h5: { fontSize: '1rem', lineHeight: 1.5 },
    h6: { fontSize: '0.875rem', lineHeight: 1.5 },
    body: { fontSize: '0.875rem', lineHeight: 1.6 },
    small: { fontSize: '0.75rem', lineHeight: 1.5 },
  },
  tablet: {
    h1: { fontSize: '2.25rem', lineHeight: 1.2 },
    h2: { fontSize: '1.875rem', lineHeight: 1.3 },
    h3: { fontSize: '1.5rem', lineHeight: 1.4 },
    h4: { fontSize: '1.25rem', lineHeight: 1.4 },
    h5: { fontSize: '1.125rem', lineHeight: 1.5 },
    h6: { fontSize: '1rem', lineHeight: 1.5 },
    body: { fontSize: '1rem', lineHeight: 1.6 },
    small: { fontSize: '0.875rem', lineHeight: 1.5 },
  },
  desktop: {
    h1: { fontSize: '3rem', lineHeight: 1.2 },
    h2: { fontSize: '2.25rem', lineHeight: 1.3 },
    h3: { fontSize: '1.875rem', lineHeight: 1.4 },
    h4: { fontSize: '1.5rem', lineHeight: 1.4 },
    h5: { fontSize: '1.25rem', lineHeight: 1.5 },
    h6: { fontSize: '1.125rem', lineHeight: 1.5 },
    body: { fontSize: '1rem', lineHeight: 1.6 },
    small: { fontSize: '0.875rem', lineHeight: 1.5 },
  },
};

// Responsive container styles
export const responsiveContainer = {
  mobile: {
    maxWidth: '100%',
    padding: `0 ${spacing.md}`,
    margin: '0 auto',
  },
  tablet: {
    maxWidth: '100%',
    padding: `0 ${spacing.lg}`,
    margin: '0 auto',
  },
  desktop: {
    maxWidth: '1200px',
    padding: `0 ${spacing.xl}`,
    margin: '0 auto',
  },
  wide: {
    maxWidth: '1400px',
    padding: `0 ${spacing.xl}`,
    margin: '0 auto',
  },
};

// Responsive section styles
export const responsiveSection = {
  mobile: {
    padding: `${spacing.xl} 0`,
  },
  tablet: {
    padding: `${spacing['2xl']} 0`,
  },
  desktop: {
    padding: `${spacing['3xl']} 0`,
  },
  wide: {
    padding: `${spacing['4xl']} 0`,
  },
};

// Responsive card styles
export const responsiveCard = {
  mobile: {
    padding: spacing.md,
    borderRadius: '8px',
    fontSize: '0.875rem',
  },
  tablet: {
    padding: spacing.lg,
    borderRadius: '12px',
    fontSize: '1rem',
  },
  desktop: {
    padding: spacing.xl,
    borderRadius: '16px',
    fontSize: '1rem',
  },
};

// Responsive button styles
export const responsiveButton = {
  mobile: {
    padding: `${spacing.sm} ${spacing.md}`,
    fontSize: '0.875rem',
    borderRadius: '6px',
  },
  tablet: {
    padding: `${spacing.md} ${spacing.lg}`,
    fontSize: '1rem',
    borderRadius: '8px',
  },
  desktop: {
    padding: `${spacing.md} ${spacing.xl}`,
    fontSize: '1rem',
    borderRadius: '8px',
  },
};

// Utility function to get responsive value
export const getResponsiveValue = (values, screenSize) => {
  if (typeof values === 'object' && values[screenSize]) {
    return values[screenSize];
  }
  if (Array.isArray(values)) {
    const index = screenSize === 'mobile' ? 0 : screenSize === 'tablet' ? 1 : 2;
    return values[index] || values[0];
  }
  return values;
};

// Media query helper
export const mediaQuery = {
  mobile: `@media (max-width: ${breakpoints.mobile})`,
  tablet: `@media (min-width: ${breakpoints.mobile}) and (max-width: ${breakpoints.tablet})`,
  desktop: `@media (min-width: ${breakpoints.tablet}) and (max-width: ${breakpoints.desktop})`,
  wide: `@media (min-width: ${breakpoints.desktop})`,
  mobileAndTablet: `@media (max-width: ${breakpoints.tablet})`,
  tabletAndUp: `@media (min-width: ${breakpoints.mobile})`,
  desktopAndUp: `@media (min-width: ${breakpoints.tablet})`,
}; 