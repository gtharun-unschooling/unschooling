// Professional Typography System for Unschooling Website
// This ensures consistent, professional typography across all components

export const typography = {
  // Font families
  fontFamily: {
    primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    heading: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: 'SFMono-Regular, Consolas, "Liberation Mono", Menlo, Courier, monospace',
  },

  // Font weights
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  // Font sizes - Mobile first approach
  fontSize: {
    xs: '0.75rem',    // 12px
    sm: '0.875rem',   // 14px
    base: '1rem',     // 16px
    lg: '1.125rem',   // 18px
    xl: '1.25rem',    // 20px
    '2xl': '1.5rem',  // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
    '5xl': '3rem',    // 48px
    '6xl': '3.75rem', // 60px
  },

  // Line heights
  lineHeight: {
    tight: 1.25,
    snug: 1.375,
    normal: 1.5,
    relaxed: 1.625,
    loose: 2,
  },

  // Letter spacing
  letterSpacing: {
    tighter: '-0.05em',
    tight: '-0.025em',
    normal: '0em',
    wide: '0.025em',
    wider: '0.05em',
    widest: '0.1em',
  },

  // Professional color palette
  colors: {
    primary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
    },
    secondary: {
      50: '#fefce8',
      100: '#fef9c3',
      200: '#fef08a',
      300: '#fde047',
      400: '#facc15',
      500: '#eab308',
      600: '#ca8a04',
      700: '#a16207',
      800: '#854d0e',
      900: '#713f12',
    },
    accent: {
      50: '#eff6ff',
      100: '#dbeafe',
      200: '#bfdbfe',
      300: '#93c5fd',
      400: '#60a5fa',
      500: '#3b82f6',
      600: '#2563eb',
      700: '#1d4ed8',
      800: '#1e40af',
      900: '#1e3a8a',
    },
  },

  // Text styles
  textStyles: {
    // Headings
    h1: {
      fontSize: { mobile: '2rem', desktop: '3rem' }, // 32px / 48px
      fontWeight: 700,
      lineHeight: 1.2,
      letterSpacing: '-0.025em',
      color: '#1e293b',
    },
    h2: {
      fontSize: { mobile: '1.75rem', desktop: '2.25rem' }, // 28px / 36px
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.025em',
      color: '#1e293b',
    },
    h3: {
      fontSize: { mobile: '1.5rem', desktop: '1.875rem' }, // 24px / 30px
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: '-0.025em',
      color: '#334155',
    },
    h4: {
      fontSize: { mobile: '1.25rem', desktop: '1.5rem' }, // 20px / 24px
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '0em',
      color: '#334155',
    },
    h5: {
      fontSize: { mobile: '1.125rem', desktop: '1.25rem' }, // 18px / 20px
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '0em',
      color: '#475569',
    },
    h6: {
      fontSize: { mobile: '1rem', desktop: '1.125rem' }, // 16px / 18px
      fontWeight: 600,
      lineHeight: 1.4,
      letterSpacing: '0em',
      color: '#475569',
    },

    // Body text
    body: {
      fontSize: { mobile: '0.875rem', desktop: '1rem' }, // 14px / 16px
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: '0em',
      color: '#475569',
    },
    bodyLarge: {
      fontSize: { mobile: '1rem', desktop: '1.125rem' }, // 16px / 18px
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: '0em',
      color: '#475569',
    },
    bodySmall: {
      fontSize: { mobile: '0.75rem', desktop: '0.875rem' }, // 12px / 14px
      fontWeight: 400,
      lineHeight: 1.5,
      letterSpacing: '0em',
      color: '#64748b',
    },

    // Special text
    lead: {
      fontSize: { mobile: '1.125rem', desktop: '1.25rem' }, // 18px / 20px
      fontWeight: 400,
      lineHeight: 1.6,
      letterSpacing: '0em',
      color: '#64748b',
    },
    caption: {
      fontSize: { mobile: '0.75rem', desktop: '0.875rem' }, // 12px / 14px
      fontWeight: 500,
      lineHeight: 1.4,
      letterSpacing: '0.025em',
      color: '#64748b',
    },
    label: {
      fontSize: { mobile: '0.875rem', desktop: '0.875rem' }, // 14px / 14px
      fontWeight: 500,
      lineHeight: 1.4,
      letterSpacing: '0.025em',
      color: '#374151',
    },
  },
};

// Helper function to get responsive font size
export const getResponsiveFontSize = (style, isMobile = false) => {
  const fontSize = style.fontSize;
  if (typeof fontSize === 'object') {
    return isMobile ? fontSize.mobile : fontSize.desktop;
  }
  return fontSize;
};

// Helper function to apply text style
export const applyTextStyle = (styleName, isMobile = false) => {
  const style = typography.textStyles[styleName];
  if (!style) {
    console.warn(`Text style "${styleName}" not found`);
    return {};
  }

  return {
    fontSize: getResponsiveFontSize(style, isMobile),
    fontWeight: style.fontWeight,
    lineHeight: style.lineHeight,
    letterSpacing: style.letterSpacing,
    color: style.color,
    fontFamily: typography.fontFamily.primary,
  };
};

export default typography;
