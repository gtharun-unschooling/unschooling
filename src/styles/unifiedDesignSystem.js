/**
 * Unified Design System for Homepage
 * Creates cohesive visual language across all sections
 */

export const unifiedDesignSystem = {
  // Primary color palette - consistent across all sections
  colors: {
    primary: {
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      solid: '#667eea',
      dark: '#5a67d8',
      light: '#e6fffa'
    },
    secondary: {
      gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      solid: '#f093fb',
      dark: '#e879f9',
      light: '#fdf2f8'
    },
    accent: {
      gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      solid: '#4facfe',
      dark: '#0ea5e9',
      light: '#f0f9ff'
    },
    neutral: {
      white: '#ffffff',
      light: '#f8fafc',
      medium: '#e2e8f0',
      dark: '#475569',
      black: '#1e293b'
    }
  },

  // Background patterns - consistent visual elements
  backgrounds: {
    // Subtle geometric patterns for visual interest
    pattern1: `
      radial-gradient(circle at 20% 80%, rgba(102, 126, 234, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 80% 20%, rgba(118, 75, 162, 0.05) 0%, transparent 50%),
      radial-gradient(circle at 40% 40%, rgba(240, 147, 251, 0.03) 0%, transparent 50%)
    `,
    pattern2: `
      linear-gradient(135deg, rgba(102, 126, 234, 0.02) 0%, rgba(240, 147, 251, 0.02) 100%),
      radial-gradient(circle at 60% 60%, rgba(79, 172, 254, 0.03) 0%, transparent 50%)
    `,
    pattern3: `
      linear-gradient(45deg, rgba(118, 75, 162, 0.02) 0%, rgba(79, 172, 254, 0.02) 100%),
      radial-gradient(circle at 30% 70%, rgba(102, 126, 234, 0.03) 0%, transparent 50%)
    `
  },

  // Section variants - each section gets a unique but harmonious style
  sectionVariants: {
    hero: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      pattern: 'radial-gradient(circle at 20% 80%, rgba(255,255,255,0.1) 0%, transparent 50%)',
      textColor: '#ffffff',
      cardBackground: 'rgba(255, 255, 255, 0.1)',
      borderColor: 'rgba(255, 255, 255, 0.2)'
    },
    approach: {
      background: '#ffffff',
      pattern: 'radial-gradient(circle at 20% 80%, rgba(102, 126, 234, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(118, 75, 162, 0.05) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(240, 147, 251, 0.03) 0%, transparent 50%)',
      textColor: '#1e293b',
      cardBackground: '#f8fafc',
      borderColor: 'rgba(102, 126, 234, 0.1)'
    },
    whyWorks: {
      background: '#f8fafc',
      pattern: 'linear-gradient(135deg, rgba(102, 126, 234, 0.02) 0%, rgba(240, 147, 251, 0.02) 100%), radial-gradient(circle at 60% 60%, rgba(79, 172, 254, 0.03) 0%, transparent 50%)',
      textColor: '#1e293b',
      cardBackground: '#ffffff',
      borderColor: 'rgba(240, 147, 251, 0.1)'
    },
    howItWorks: {
      background: '#ffffff',
      pattern: 'linear-gradient(45deg, rgba(118, 75, 162, 0.02) 0%, rgba(79, 172, 254, 0.02) 100%), radial-gradient(circle at 30% 70%, rgba(102, 126, 234, 0.03) 0%, transparent 50%)',
      textColor: '#1e293b',
      cardBackground: '#f0f9ff',
      borderColor: 'rgba(79, 172, 254, 0.1)'
    },
    testimonials: {
      background: '#f0f9ff',
      pattern: 'radial-gradient(circle at 20% 80%, rgba(102, 126, 234, 0.05) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(118, 75, 162, 0.05) 0%, transparent 50%), radial-gradient(circle at 40% 40%, rgba(240, 147, 251, 0.03) 0%, transparent 50%)',
      textColor: '#1e293b',
      cardBackground: '#ffffff',
      borderColor: 'rgba(102, 126, 234, 0.15)'
    },
    pricing: {
      background: '#ffffff',
      pattern: 'linear-gradient(135deg, rgba(102, 126, 234, 0.02) 0%, rgba(240, 147, 251, 0.02) 100%), radial-gradient(circle at 60% 60%, rgba(79, 172, 254, 0.03) 0%, transparent 50%)',
      textColor: '#1e293b',
      cardBackground: '#f8fafc',
      borderColor: 'rgba(240, 147, 251, 0.15)'
    },
    faq: {
      background: '#f8fafc',
      pattern: 'linear-gradient(45deg, rgba(118, 75, 162, 0.02) 0%, rgba(79, 172, 254, 0.02) 100%), radial-gradient(circle at 30% 70%, rgba(102, 126, 234, 0.03) 0%, transparent 50%)',
      textColor: '#1e293b',
      cardBackground: '#ffffff',
      borderColor: 'rgba(79, 172, 254, 0.15)'
    },
    cta: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      pattern: 'radial-gradient(circle at 60% 40%, rgba(255,255,255,0.1) 0%, transparent 50%)',
      textColor: '#ffffff',
      cardBackground: 'rgba(255, 255, 255, 0.1)',
      borderColor: 'rgba(255, 255, 255, 0.2)'
    }
  },

  // Consistent spacing system
  spacing: {
    section: {
      mobile: '2rem 0',
      desktop: '3rem 0'
    },
    container: {
      mobile: '1rem 0.5rem',
      desktop: '1.5rem 1rem'
    }
  },

  // Consistent typography scale
  typography: {
    sectionTitle: {
      fontSize: {
        mobile: '1.8rem',
        desktop: '2.5rem'
      },
      fontWeight: '700',
      lineHeight: '1.2'
    },
    sectionSubtitle: {
      fontSize: {
        mobile: '1rem',
        desktop: '1.2rem'
      },
      fontWeight: '400',
      lineHeight: '1.6'
    }
  },

  // Consistent border radius and shadows
  effects: {
    borderRadius: {
      small: '8px',
      medium: '12px',
      large: '16px',
      xlarge: '20px'
    },
    shadows: {
      light: '0 2px 8px rgba(0, 0, 0, 0.08)',
      medium: '0 4px 16px rgba(0, 0, 0, 0.12)',
      heavy: '0 8px 32px rgba(0, 0, 0, 0.16)'
    }
  },

  // Animation and transitions
  transitions: {
    smooth: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    fast: 'all 0.2s ease',
    slow: 'all 0.5s ease'
  }
};

export default unifiedDesignSystem;
