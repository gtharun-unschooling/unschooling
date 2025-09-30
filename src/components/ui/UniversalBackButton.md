# Universal Back Button Component

A simple, elegant, and universal back button component for the Unschooling website.

## Features

- **Universal Navigation**: Automatically handles browser history and fallback routes
- **Multiple Variants**: Primary, Secondary, Ghost, and Luxury styles
- **Responsive Design**: Adapts to different screen sizes
- **Accessibility**: Full keyboard navigation and screen reader support
- **Customizable**: Flexible props for different use cases
- **Premium Styling**: Uses the luxury color system for consistent branding

## Usage

### Basic Usage
```jsx
import UniversalBackButton from '../components/ui/UniversalBackButton';

// Simple back button
<UniversalBackButton />
```

### With Custom Text
```jsx
<UniversalBackButton text="← Back to Home" />
```

### Different Variants
```jsx
// Primary (default)
<UniversalBackButton variant="primary" />

// Secondary
<UniversalBackButton variant="secondary" />

// Ghost (transparent)
<UniversalBackButton variant="ghost" />

// Luxury (gradient)
<UniversalBackButton variant="luxury" />
```

### Different Sizes
```jsx
<UniversalBackButton size="small" />
<UniversalBackButton size="medium" />  // default
<UniversalBackButton size="large" />
```

### Without Icon
```jsx
<UniversalBackButton showIcon={false} />
```

### Custom Click Handler
```jsx
<UniversalBackButton 
  customOnClick={() => {
    // Custom navigation logic
    navigate('/custom-route');
  }}
/>
```

### Custom Styling
```jsx
<UniversalBackButton 
  customStyle={{
    backgroundColor: '#custom-color',
    borderRadius: '20px'
  }}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `text` | string | 'Back' | Text to display on the button |
| `variant` | string | 'primary' | Style variant: 'primary', 'secondary', 'ghost', 'luxury' |
| `size` | string | 'medium' | Button size: 'small', 'medium', 'large' |
| `showIcon` | boolean | true | Whether to show the back arrow icon |
| `customStyle` | object | {} | Custom CSS styles to apply |
| `customOnClick` | function | null | Custom click handler (overrides default navigation) |
| `className` | string | '' | Additional CSS class names |

## Navigation Logic

1. **Custom Handler**: If `customOnClick` is provided, it will be used
2. **Browser History**: If browser history is available, it goes back one step
3. **Fallback Route**: Otherwise, navigates to the previous route from location state
4. **Default Fallback**: Finally falls back to the home page

## Examples in Use

### Niche Pages
```jsx
<UniversalBackButton text="← Back to Home" variant="luxury" />
```

### Topic Pages
```jsx
<UniversalBackButton text="← Back to Finance" variant="luxury" />
```

### Essential Growth Page
```jsx
<UniversalBackButton text="← Back to Home" variant="luxury" />
```

## Styling

The component uses the luxury color system for consistent branding:

- **Primary**: Sapphire blue
- **Secondary**: Light gray
- **Ghost**: Transparent with hover effects
- **Luxury**: Emerald to teal gradient

## Accessibility

- Full keyboard navigation support
- Screen reader friendly with proper ARIA labels
- Focus indicators for keyboard users
- High contrast colors for better visibility

## Responsive Behavior

- Automatically adjusts padding and font size on mobile
- Maintains touch-friendly tap targets
- Optimized for different screen sizes

## Testing

Visit `/back-button-test` to see all variants and sizes in action.
