# Universal Mobile Typography System

## Overview
This document outlines the universal typography system implemented across all pages for consistent mobile experience.

## File Location
- **Main CSS File**: `src/styles/universalMobileTypography.css`
- **Applied to**: All pages (import in each component)

## Typography Hierarchy

### Desktop (Default)
- **H1**: 48px, 700 weight, 1.2 line-height
- **H2**: 36px, 600 weight, 1.2 line-height  
- **H3**: 24px, 600 weight, 1.2 line-height
- **H4**: 20px, 500 weight, 1.2 line-height
- **H5**: 16px, 500 weight, 1.3 line-height
- **H6**: 14px, 500 weight, 1.3 line-height
- **Body**: 16px, 400 weight, 1.6 line-height

### Tablet (≤768px)
- **H1**: 36px, 700 weight, 1.2 line-height
- **H2**: 28px, 600 weight, 1.2 line-height
- **H3**: 20px, 600 weight, 1.2 line-height
- **H4**: 18px, 500 weight, 1.2 line-height
- **H5**: 14px, 500 weight, 1.3 line-height
- **H6**: 12px, 500 weight, 1.3 line-height
- **Body**: 14px, 400 weight, 1.6 line-height

### Mobile (≤480px)
- **H1**: 28px, 700 weight, 1.2 line-height
- **H2**: 24px, 600 weight, 1.2 line-height
- **H3**: 18px, 600 weight, 1.2 line-height
- **H4**: 16px, 500 weight, 1.2 line-height
- **H5**: 12px, 500 weight, 1.3 line-height
- **H6**: 10px, 500 weight, 1.3 line-height
- **Body**: 12px, 400 weight, 1.6 line-height

## Font Family
```css
font-family: -apple-system, "system-ui", "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif
```

## Color Scheme
- **Headings**: #1e293b (Dark gray)
- **Body Text**: #374151 (Medium gray)

## Utility Classes

### Display Text
- `.display-large`: 3rem → 2.5rem (tablet) → 2rem (mobile)
- `.display-medium`: 2.5rem → 2rem (tablet) → 1.8rem (mobile)
- `.display-small`: 2rem → 1.8rem (tablet) → 1.5rem (mobile)

### Body Text Variants
- `.body-large`: 18px → 16px (tablet) → 14px (mobile)
- `.body-medium`: 16px → 14px (tablet) → 12px (mobile)
- `.body-small`: 14px → 12px (tablet) → 11px (mobile)

## Niche Page Specific Classes

### Hero Section Classes
- `.niche-hero-section`: Main hero container
- `.niche-hero-content`: Content wrapper with proper spacing
- `.niche-hero-tagline`: Main tagline text
- `.niche-hero-subheading`: Subheading text

### Mobile Adjustments
- **Padding Top**: 80px (tablet) → 70px (mobile)
- **Tagline Size**: 1.8rem (mobile)
- **Subheading Size**: 0.85rem (mobile)
- **Line Heights**: Optimized for mobile readability

## Implementation

### 1. Import in Component
```javascript
import '../../styles/universalMobileTypography.css';
```

### 2. Apply Classes
```jsx
<section className="niche-hero-section">
  <div className="niche-hero-content">
    <h1 className="niche-hero-tagline">Main Title</h1>
    <p className="niche-hero-subheading">Subtitle</p>
  </div>
</section>
```

### 3. Use Utility Classes
```jsx
<h1 className="display-large">Large Display Text</h1>
<p className="body-medium">Regular body text</p>
```

## Back Button Overlap Fix

### Problem
Back button was overlapping with hero content on mobile devices.

### Solution
1. **Added padding-top** to hero sections on mobile
2. **Adjusted title positioning** to avoid overlap
3. **Used CSS classes** for consistent spacing

### Implementation
```css
@media (max-width: 768px) {
  .niche-hero-section {
    padding-top: 80px !important;
  }
  
  .niche-hero-content {
    margin-top: 2rem !important;
  }
}
```

## Usage Guidelines

### Do's
- ✅ Always import the universal typography CSS
- ✅ Use semantic HTML elements (h1, h2, h3, etc.)
- ✅ Apply utility classes for special cases
- ✅ Test on mobile devices
- ✅ Use the provided CSS classes for niche pages

### Don'ts
- ❌ Don't override font sizes with inline styles
- ❌ Don't use custom font families without good reason
- ❌ Don't skip mobile testing
- ❌ Don't ignore the back button overlap issue

## Testing Checklist

### Mobile (375px)
- [ ] No back button overlap
- [ ] Readable font sizes
- [ ] Proper line heights
- [ ] Adequate spacing

### Tablet (768px)
- [ ] Balanced typography
- [ ] No overlap issues
- [ ] Good readability

### Desktop (1200px+)
- [ ] Professional appearance
- [ ] Proper hierarchy
- [ ] No layout issues

## Future Updates

When updating this system:
1. Update the CSS file
2. Test across all viewports
3. Update this documentation
4. Notify team of changes
5. Apply to all pages consistently

## Applied Pages

### ✅ Completed
- Finance Niche Page (`/niche/finance`)
  - ✅ Back button overlap fixed
  - ✅ Title centered on mobile, positioned correctly on tablet/desktop
  - ✅ Icon size increased and proportional
  - ✅ Universal mobile typography applied
  - ✅ CSS-based responsive design working

### 🔄 In Progress
- All other niche pages (ready to apply same system)
- Dashboard pages
- Admin pages
- Other main pages

### 📋 To Do
- Apply universal typography to remaining pages as requested
- Test thoroughly on all devices
- Gather feedback and iterate

## Recent Updates

### Finance Niche Page Fixes (Completed)
1. **Back Button Overlap**: Fixed by adding proper padding-top to hero sections
2. **Title Positioning**: Centered on mobile (≤768px), positioned correctly on larger screens
3. **Icon Sizing**: Increased from small to 77px font-size with 130px container
4. **Responsive Design**: CSS-based media queries for reliable cross-device behavior
5. **Universal Typography**: Applied consistent font sizes across all viewports

### Technical Implementation
- **CSS Media Queries**: `@media (max-width: 768px)` for mobile, `@media (min-width: 769px)` for desktop
- **CSS Specificity**: Used `!important` to override inline styles
- **Icon Scaling**: Mobile-optimized icon sizes with proportional containers
- **Title Positioning**: `left: 50%; transform: translateX(-50%)` for mobile centering
