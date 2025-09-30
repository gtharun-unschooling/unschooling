# 📁 Media Assets Structure

This folder contains all media assets for the website, organized by category.

## 🎯 Niche Icons (`/niches/`)

### Current Icons Available:
- `ai-icon.svg` - Artificial Intelligence (3D circuit/brain design)
- `writing-icon.svg` - Creative Writing (3D pen/book design)
- `default-icon.svg` - Default fallback icon for other niches

### Icon Specifications:
- **Format**: SVG (scalable vector graphics)
- **Size**: 64x64px base size
- **Style**: 3D gradient design with drop shadows
- **Colors**: Brand-consistent gradients (purple, orange, gray)

### Adding New Niche Icons:

1. **Create the SVG file** in `/public/media/niches/`
2. **Name convention**: `{niche-slug}-icon.svg`
3. **Update the mapping** in `src/components/ui/NicheIcon.jsx`:
   ```jsx
   const iconMap = {
     'Artificial Intelligence': '/media/niches/ai-icon.svg',
     'Creative Writing': '/media/niches/writing-icon.svg',
     'New Niche Name': '/media/niches/new-niche-icon.svg', // Add here
   };
   ```

### Icon Design Guidelines:
- Use consistent 3D gradient styling
- Include drop shadows for depth
- Use brand colors from design system
- Ensure 64x64px base size
- Keep file size under 5KB

## 🖼️ Other Media Categories:
- `/images/` - General website images
- `/icons/` - UI icons and symbols
- `/videos/` - Video content (if needed)
- `/documents/` - PDFs and downloadable files

## 📝 Usage in Components:

```jsx
import NicheIcon from '../components/ui/NicheIcon';

// In your component:
<NicheIcon 
  niche="Artificial Intelligence" 
  size="large" 
  className="custom-class"
/>
```

## 🎨 Design System Integration:
Icons use the brand color palette:
- Primary: `#667eea` to `#764ba2` (purple gradient)
- Secondary: `#f59e0b` to `#d97706` (orange gradient)
- Neutral: `#6b7280` to `#4b5563` (gray gradient)
