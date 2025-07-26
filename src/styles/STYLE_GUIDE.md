# Style Guide - Unschooling React Design System

This document outlines the design system and styling conventions for the Unschooling React application.

## 🎨 Design Tokens

### Colors

#### Primary Colors
- **Primary Blue**: `#0ea5e9` - Main brand color
- **Primary Dark**: `#0369a1` - Hover states
- **Primary Light**: `#e0f2fe` - Backgrounds

#### Brand Colors
- **Brand Blue**: `#264653` - Primary brand color
- **Light Blue**: `#ADD8E6` - Hero background
- **Coral**: `#FF6347` - Call-to-action
- **Orange**: `#f4a261` - Accent
- **Teal**: `#2a9d8f` - Success states
- **Red**: `#e63946` - Error states

#### Semantic Colors
- **Success**: Green variants for positive actions
- **Warning**: Yellow/Orange variants for warnings
- **Error**: Red variants for errors
- **Neutral**: Gray scale for text and borders

### Typography

#### Font Families
- **Primary**: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif`
- **Secondary**: `'Georgia', serif`
- **Mono**: `'SF Mono', Monaco, 'Cascadia Code', 'Roboto Mono', Consolas, monospace`

#### Font Sizes
- **xs**: `0.75rem` (12px) - Captions
- **sm**: `0.875rem` (14px) - Small text
- **base**: `1rem` (16px) - Body text
- **lg**: `1.125rem` (18px) - Large text
- **xl**: `1.25rem` (20px) - Extra large
- **2xl**: `1.5rem` (24px) - Headings
- **3xl**: `1.875rem` (30px) - Large headings
- **4xl**: `2.25rem` (36px) - Extra large headings
- **5xl**: `3rem` (48px) - Hero headings
- **6xl**: `3.75rem` (60px) - Display headings
- **7xl**: `4.5rem` (72px) - Large display

#### Font Weights
- **light**: 300
- **normal**: 400
- **medium**: 500
- **semibold**: 600
- **bold**: 700
- **extrabold**: 800

### Spacing

#### Scale
- **xs**: `0.25rem` (4px)
- **sm**: `0.5rem` (8px)
- **md**: `1rem` (16px)
- **lg**: `1.5rem` (24px)
- **xl**: `2rem` (32px)
- **2xl**: `3rem` (48px)
- **3xl**: `4rem` (64px)
- **4xl**: `6rem` (96px)
- **5xl**: `8rem` (128px)

### Border Radius

#### Scale
- **none**: `0`
- **sm**: `0.125rem` (2px)
- **base**: `0.25rem` (4px)
- **md**: `0.375rem` (6px)
- **lg**: `0.5rem` (8px)
- **xl**: `0.75rem` (12px)
- **2xl**: `1rem` (16px)
- **3xl**: `1.5rem` (24px)
- **full**: `9999px`

### Shadows

#### Scale
- **sm**: Subtle shadow for cards
- **base**: Default shadow
- **md**: Medium shadow for elevated elements
- **lg**: Large shadow for modals
- **xl**: Extra large shadow for overlays
- **2xl**: Maximum shadow for emphasis

## 🧩 Components

### Button

```jsx
import { Button } from '../components/ui/StyledComponents';

// Primary button
<Button variant="primary" size="md" onClick={handleClick}>
  Click me
</Button>

// Secondary button
<Button variant="secondary" size="lg">
  Learn More
</Button>

// Danger button
<Button variant="danger" disabled={isLoading}>
  Delete
</Button>
```

**Variants**: `primary`, `secondary`, `danger`, `ghost`
**Sizes**: `sm`, `md`, `lg`

### Card

```jsx
import { Card } from '../components/ui/StyledComponents';

// Base card
<Card>
  <h3>Card Title</h3>
  <p>Card content</p>
</Card>

// Interactive card
<Card variant="interactive" onClick={handleClick}>
  Clickable card
</Card>
```

**Variants**: `base`, `elevated`, `interactive`

### Input

```jsx
import { Input } from '../components/ui/StyledComponents';

// Basic input
<Input 
  placeholder="Enter your name"
  value={name}
  onChange={handleChange}
/>

// Error state
<Input 
  error={true}
  placeholder="Invalid input"
/>
```

### Typography

```jsx
import { Heading, Text } from '../components/ui/StyledComponents';

// Headings
<Heading level={1}>Main Heading</Heading>
<Heading level={2}>Section Heading</Heading>

// Text
<Text variant="body">Body text</Text>
<Text variant="small">Small text</Text>
<Text variant="caption">Caption text</Text>
```

### Layout

```jsx
import { Container, Section, Flex, Spacer } from '../components/ui/StyledComponents';

// Container
<Container variant="base">
  <h1>Content</h1>
</Container>

// Section
<Section variant="wide">
  <h2>Section Content</h2>
</Section>

// Flex layout
<Flex direction="row" align="center" justify="space-between">
  <div>Left content</div>
  <div>Right content</div>
</Flex>

// Spacing
<Spacer size="lg" />
<Spacer size="xl" axis="horizontal" />
```

## 📱 Responsive Design

### Breakpoints
- **sm**: `640px` - Small devices
- **md**: `768px` - Medium devices
- **lg**: `1024px` - Large devices
- **xl**: `1280px` - Extra large devices
- **2xl**: `1536px` - 2X large devices

### Usage

```jsx
import { createResponsiveStyles } from '../styles/styleUtils';

const responsiveStyles = createResponsiveStyles(
  // Base styles
  {
    fontSize: '1rem',
    padding: '1rem',
  },
  // Responsive overrides
  {
    md: {
      fontSize: '1.125rem',
      padding: '1.5rem',
    },
    lg: {
      fontSize: '1.25rem',
      padding: '2rem',
    },
  }
);
```

## 🎯 Best Practices

### 1. Use Design Tokens
Always use design tokens instead of hardcoded values:

```jsx
// ✅ Good
import { colors, spacing } from '../styles/designTokens';

const styles = {
  backgroundColor: colors.background.primary,
  padding: spacing.lg,
};

// ❌ Bad
const styles = {
  backgroundColor: '#ffffff',
  padding: '24px',
};
```

### 2. Use Styled Components
Prefer styled components over inline styles:

```jsx
// ✅ Good
import { Button, Card, Text } from '../components/ui/StyledComponents';

<Card>
  <Text variant="body">Content</Text>
  <Button variant="primary">Action</Button>
</Card>

// ❌ Bad
<div style={{ padding: '1rem', backgroundColor: '#fff' }}>
  <p style={{ fontSize: '1rem' }}>Content</p>
  <button style={{ padding: '0.5rem 1rem' }}>Action</button>
</div>
```

### 3. Consistent Spacing
Use the spacing scale consistently:

```jsx
// ✅ Good
import { spacing } from '../styles/designTokens';

const styles = {
  marginTop: spacing.lg,
  padding: spacing.xl,
  gap: spacing.md,
};

// ❌ Bad
const styles = {
  marginTop: '20px',
  padding: '30px',
  gap: '12px',
};
```

### 4. Semantic Colors
Use semantic colors for different states:

```jsx
// ✅ Good
import { colors } from '../styles/designTokens';

const styles = {
  color: colors.success[500], // Success state
  backgroundColor: colors.error[100], // Error background
  borderColor: colors.warning[300], // Warning border
};

// ❌ Bad
const styles = {
  color: '#22c55e',
  backgroundColor: '#fef2f2',
  borderColor: '#fbbf24',
};
```

### 5. Typography Hierarchy
Use consistent typography hierarchy:

```jsx
// ✅ Good
import { Heading, Text } from '../components/ui/StyledComponents';

<Heading level={1}>Page Title</Heading>
<Heading level={2}>Section Title</Heading>
<Text variant="body">Body content</Text>
<Text variant="small">Supporting text</Text>

// ❌ Bad
<h1 style={{ fontSize: '2rem' }}>Page Title</h1>
<h2 style={{ fontSize: '1.5rem' }}>Section Title</h2>
<p style={{ fontSize: '1rem' }}>Body content</p>
<span style={{ fontSize: '0.875rem' }}>Supporting text</span>
```

## 🔧 Customization

### Adding New Colors
Add new colors to `designTokens.js`:

```jsx
export const colors = {
  // ... existing colors
  custom: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    // ... add more shades
    900: '#0c4a6e',
  },
};
```

### Adding New Components
Create new styled components in `StyledComponents.jsx`:

```jsx
export const CustomComponent = ({ variant = 'default', children, style = {}, ...props }) => {
  const variants = {
    default: { /* default styles */ },
    special: { /* special styles */ },
  };

  const componentStyles = mergeStyles(
    variants[variant] || variants.default,
    style
  );

  return (
    <div style={componentStyles} {...props}>
      {children}
    </div>
  );
};
```

### Adding New Utilities
Add new utility functions to `styleUtils.js`:

```jsx
export const newUtility = (param) => ({
  // Return style object
  property: value,
});
```

## 📚 Resources

- [Design Tokens](./designTokens.js) - All design tokens
- [Style Utils](./styleUtils.js) - Utility functions
- [Styled Components](./StyledComponents.jsx) - Reusable components
- [Global Styles](./globalStyles.js) - Base styles

## 🤝 Contributing

When adding new styles or components:

1. Follow the existing patterns
2. Use design tokens consistently
3. Add documentation for new components
4. Test across different screen sizes
5. Ensure accessibility standards are met 