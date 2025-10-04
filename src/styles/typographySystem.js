// Unified Typography System for Homepage
// This ensures consistent font sizes, weights, and families across all elements

export const typographySystem = {
  // Font families
  fontFamily: {
    primary: '-apple-system, "system-ui", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    secondary: 'Inter, -apple-system, "system-ui", "Segoe UI", Roboto, sans-serif',
    serif: 'Times, "Times New Roman", serif'
  },

  // Font weights
  fontWeight: {
    light: '300',
    normal: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
    extrabold: '800'
  },

  // Font sizes (in pixels)
  fontSize: {
    // Headings
    h1: '48px',      // Main page titles
    h2: '36px',      // Section titles
    h3: '24px',      // Subsection titles
    h4: '20px',      // Card titles
    h5: '16px',      // Small headings
    h6: '14px',      // Smallest headings
    
    // Body text
    large: '20px',   // Large body text
    body: '16px',    // Regular body text
    small: '14px',   // Small body text
    tiny: '12px'     // Tiny text
  },

  // Line heights
  lineHeight: {
    tight: '1.2',
    normal: '1.5',
    relaxed: '1.6',
    loose: '1.8'
  },

  // Colors
  color: {
    primary: '#1e293b',      // Dark blue-gray
    secondary: '#475569',    // Medium blue-gray
    muted: '#64748b',        // Light blue-gray
    light: '#94a3b8',        // Very light blue-gray
    white: '#ffffff',
    black: '#000000'
  },

  // Apply consistent typography styles
  getHeadingStyle: (level, options = {}) => {
    const sizes = {
      1: typographySystem.fontSize.h1,
      2: typographySystem.fontSize.h2,
      3: typographySystem.fontSize.h3,
      4: typographySystem.fontSize.h4,
      5: typographySystem.fontSize.h5,
      6: typographySystem.fontSize.h6
    };

    const weights = {
      1: typographySystem.fontWeight.bold,
      2: typographySystem.fontWeight.semibold,
      3: typographySystem.fontWeight.semibold,
      4: typographySystem.fontWeight.medium,
      5: typographySystem.fontWeight.medium,
      6: typographySystem.fontWeight.normal
    };

    return {
      fontFamily: options.fontFamily || typographySystem.fontFamily.primary,
      fontSize: options.fontSize || sizes[level],
      fontWeight: options.fontWeight || weights[level],
      lineHeight: options.lineHeight || typographySystem.lineHeight.tight,
      color: options.color || typographySystem.color.primary,
      margin: options.margin || '0 0 1rem 0',
      ...options.additional
    };
  },

  getBodyStyle: (size = 'body', options = {}) => {
    const sizes = {
      large: typographySystem.fontSize.large,
      body: typographySystem.fontSize.body,
      small: typographySystem.fontSize.small,
      tiny: typographySystem.fontSize.tiny
    };

    return {
      fontFamily: options.fontFamily || typographySystem.fontFamily.primary,
      fontSize: options.fontSize || sizes[size],
      fontWeight: options.fontWeight || typographySystem.fontWeight.normal,
      lineHeight: options.lineHeight || typographySystem.lineHeight.normal,
      color: options.color || typographySystem.color.secondary,
      margin: options.margin || '0 0 0.75rem 0',
      ...options.additional
    };
  },

  // Predefined styles for common elements
  styles: {
    // Main page title
    pageTitle: {
      fontFamily: typographySystem.fontFamily.primary,
      fontSize: typographySystem.fontSize.h1,
      fontWeight: typographySystem.fontWeight.bold,
      lineHeight: typographySystem.lineHeight.tight,
      color: typographySystem.color.primary,
      margin: '0 0 1.5rem 0'
    },

    // Section title
    sectionTitle: {
      fontFamily: typographySystem.fontFamily.primary,
      fontSize: typographySystem.fontSize.h2,
      fontWeight: typographySystem.fontWeight.semibold,
      lineHeight: typographySystem.lineHeight.tight,
      color: typographySystem.color.primary,
      margin: '0 0 1.25rem 0'
    },

    // Subsection title
    subsectionTitle: {
      fontFamily: typographySystem.fontFamily.primary,
      fontSize: typographySystem.fontSize.h3,
      fontWeight: typographySystem.fontWeight.semibold,
      lineHeight: typographySystem.lineHeight.tight,
      color: typographySystem.color.primary,
      margin: '0 0 1rem 0'
    },

    // Card title
    cardTitle: {
      fontFamily: typographySystem.fontFamily.primary,
      fontSize: typographySystem.fontSize.h4,
      fontWeight: typographySystem.fontWeight.medium,
      lineHeight: typographySystem.lineHeight.tight,
      color: typographySystem.color.primary,
      margin: '0 0 0.75rem 0'
    },

    // Small heading
    smallHeading: {
      fontFamily: typographySystem.fontFamily.primary,
      fontSize: typographySystem.fontSize.h5,
      fontWeight: typographySystem.fontWeight.medium,
      lineHeight: typographySystem.lineHeight.tight,
      color: typographySystem.color.primary,
      margin: '0 0 0.5rem 0'
    },

    // Body text
    bodyText: {
      fontFamily: typographySystem.fontFamily.primary,
      fontSize: typographySystem.fontSize.body,
      fontWeight: typographySystem.fontWeight.normal,
      lineHeight: typographySystem.lineHeight.normal,
      color: typographySystem.color.secondary,
      margin: '0 0 0.75rem 0'
    },

    // Large body text
    largeBodyText: {
      fontFamily: typographySystem.fontFamily.primary,
      fontSize: typographySystem.fontSize.large,
      fontWeight: typographySystem.fontWeight.normal,
      lineHeight: typographySystem.lineHeight.relaxed,
      color: typographySystem.color.secondary,
      margin: '0 0 1rem 0'
    },

    // Small body text
    smallBodyText: {
      fontFamily: typographySystem.fontFamily.primary,
      fontSize: typographySystem.fontSize.small,
      fontWeight: typographySystem.fontWeight.normal,
      lineHeight: typographySystem.lineHeight.normal,
      color: typographySystem.color.muted,
      margin: '0 0 0.5rem 0'
    },

    // Tiny text
    tinyText: {
      fontFamily: typographySystem.fontFamily.primary,
      fontSize: typographySystem.fontSize.tiny,
      fontWeight: typographySystem.fontWeight.normal,
      lineHeight: typographySystem.lineHeight.normal,
      color: typographySystem.color.muted,
      margin: '0 0 0.25rem 0'
    }
  }
};

export default typographySystem;
