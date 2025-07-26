/**
 * Styled Components for Unschooling React
 * Reusable UI components with consistent styling
 */

import React from 'react';
import { colors, spacing, typography, borderRadius, shadows, transitions } from '../../styles/designTokens';
import { button, card, input, text, flex, mergeStyles } from '../../styles/styleUtils';

// Button Components
export const Button = ({ 
  variant = 'primary', 
  size = 'md', 
  children, 
  disabled = false,
  onClick,
  style = {},
  ...props 
}) => {
  const sizeStyles = {
    sm: { padding: `${spacing.sm} ${spacing.md}`, fontSize: typography.fontSize.sm },
    md: { padding: `${spacing.md} ${spacing.xl}`, fontSize: typography.fontSize.base },
    lg: { padding: `${spacing.lg} ${spacing['2xl']}`, fontSize: typography.fontSize.lg },
  };

  const buttonStyles = mergeStyles(
    button[variant] || button.primary,
    sizeStyles[size] || sizeStyles.md,
    disabled && { opacity: 0.6, cursor: 'not-allowed' },
    style
  );

  return (
    <button
      style={buttonStyles}
      onClick={onClick}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
};

// Card Components
export const Card = ({ 
  variant = 'base', 
  children, 
  style = {}, 
  onClick,
  ...props 
}) => {
  const cardStyles = mergeStyles(
    card[variant] || card.base,
    onClick && { cursor: 'pointer' },
    style
  );

  return (
    <div style={cardStyles} onClick={onClick} {...props}>
      {children}
    </div>
  );
};

// Input Components
export const Input = ({ 
  error = false, 
  children, 
  style = {}, 
  ...props 
}) => {
  const inputStyles = mergeStyles(
    input.base,
    error && input.error,
    style
  );

  return (
    <input style={inputStyles} {...props}>
      {children}
    </input>
  );
};

// Text Components
export const Heading = ({ 
  level = 1, 
  children, 
  style = {}, 
  ...props 
}) => {
  const headingStyles = mergeStyles(
    text[`h${level}`] || text.h1,
    style
  );

  const Tag = `h${level}`;
  
  return (
    <Tag style={headingStyles} {...props}>
      {children}
    </Tag>
  );
};

export const Text = ({ 
  variant = 'body', 
  children, 
  style = {}, 
  ...props 
}) => {
  const textStyles = mergeStyles(
    text[variant] || text.body,
    style
  );

  return (
    <p style={textStyles} {...props}>
      {children}
    </p>
  );
};

// Layout Components
export const Container = ({ 
  variant = 'base', 
  children, 
  style = {}, 
  ...props 
}) => {
  const containerStyles = {
    base: {
      maxWidth: '1200px',
      margin: '0 auto',
      padding: `0 ${spacing.xl}`,
      '@media (max-width: 768px)': {
        padding: `0 ${spacing.md}`,
      },
    },
    narrow: {
      maxWidth: '800px',
      margin: '0 auto',
      padding: `0 ${spacing.xl}`,
      '@media (max-width: 768px)': {
        padding: `0 ${spacing.md}`,
      },
    },
    wide: {
      maxWidth: '1400px',
      margin: '0 auto',
      padding: `0 ${spacing.xl}`,
      '@media (max-width: 768px)': {
        padding: `0 ${spacing.md}`,
      },
    },
  };

  const styles = mergeStyles(
    containerStyles[variant] || containerStyles.base,
    style
  );

  return (
    <div style={styles} {...props}>
      {children}
    </div>
  );
};

export const Section = ({ 
  variant = 'base', 
  children, 
  style = {}, 
  ...props 
}) => {
  const sectionStyles = {
    base: {
      padding: `${spacing['3xl']} ${spacing.xl}`,
      width: '100%',
      '@media (max-width: 768px)': {
        padding: `${spacing['2xl']} ${spacing.md}`,
      },
    },
    narrow: {
      padding: `${spacing['2xl']} ${spacing.xl}`,
      width: '100%',
      '@media (max-width: 768px)': {
        padding: `${spacing.xl} ${spacing.md}`,
      },
    },
    wide: {
      padding: `${spacing['4xl']} ${spacing.xl}`,
      width: '100%',
      '@media (max-width: 768px)': {
        padding: `${spacing['3xl']} ${spacing.md}`,
      },
    },
  };

  const styles = mergeStyles(
    sectionStyles[variant] || sectionStyles.base,
    style
  );

  return (
    <section style={styles} {...props}>
      {children}
    </section>
  );
};

// Flex Components
export const Flex = ({ 
  direction = 'row', 
  align = 'center', 
  justify = 'flex-start',
  wrap = false,
  gap = spacing.md,
  children, 
  style = {}, 
  ...props 
}) => {
  const flexStyles = mergeStyles(
    {
      display: 'flex',
      flexDirection: direction,
      alignItems: align,
      justifyContent: justify,
      flexWrap: wrap ? 'wrap' : 'nowrap',
      gap: gap,
    },
    style
  );

  return (
    <div style={flexStyles} {...props}>
      {children}
    </div>
  );
};

// Badge Component
export const Badge = ({ 
  variant = 'primary', 
  children, 
  style = {}, 
  ...props 
}) => {
  const badgeVariants = {
    primary: {
      backgroundColor: colors.primary[100],
      color: colors.primary[700],
    },
    secondary: {
      backgroundColor: colors.secondary[100],
      color: colors.secondary[700],
    },
    success: {
      backgroundColor: colors.success[100],
      color: colors.success[700],
    },
    warning: {
      backgroundColor: colors.warning[100],
      color: colors.warning[700],
    },
    error: {
      backgroundColor: colors.error[100],
      color: colors.error[700],
    },
  };

  const badgeStyles = mergeStyles(
    {
      display: 'inline-flex',
      alignItems: 'center',
      padding: `${spacing.xs} ${spacing.sm}`,
      borderRadius: borderRadius.full,
      fontSize: typography.fontSize.sm,
      fontWeight: typography.fontWeight.medium,
      lineHeight: 1,
    },
    badgeVariants[variant] || badgeVariants.primary,
    style
  );

  return (
    <span style={badgeStyles} {...props}>
      {children}
    </span>
  );
};

// Divider Component
export const Divider = ({ 
  orientation = 'horizontal', 
  style = {}, 
  ...props 
}) => {
  const dividerStyles = mergeStyles(
    {
      backgroundColor: colors.neutral[200],
      ...(orientation === 'horizontal' 
        ? { height: '1px', width: '100%' }
        : { width: '1px', height: '100%' }
      ),
    },
    style
  );

  return (
    <div style={dividerStyles} {...props} />
  );
};

// Spacer Component
export const Spacer = ({ 
  size = 'md', 
  axis = 'vertical', 
  style = {}, 
  ...props 
}) => {
  const spacerStyles = mergeStyles(
    {
      ...(axis === 'horizontal' 
        ? { width: spacing[size], height: 'auto' }
        : { height: spacing[size], width: 'auto' }
      ),
    },
    style
  );

  return (
    <div style={spacerStyles} {...props} />
  );
}; 