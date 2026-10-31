# Theme System Documentation

## Overview
Pixora AI now features a complete Dark Mode and Light Mode theme system with smooth transitions and persistent user preferences.

## Features
- ✅ **Dark Mode & Light Mode** - Full support across all pages
- ✅ **System Preference Detection** - Automatically follows OS theme preference
- ✅ **Persistent Storage** - Theme choice saved in localStorage
- ✅ **Smooth Transitions** - 300ms animated theme switching
- ✅ **Theme Toggle Button** - Available in Navbar, Dashboard, and Admin layouts
- ✅ **Premium UI** - Different card backgrounds and colors for each theme
- ✅ **Tailwind Dark Mode** - Using class-based dark mode strategy

## Implementation

### Core Files
- `client/src/context/ThemeContext.jsx` - Theme state management
- `client/src/components/ThemeToggle.jsx` - Toggle button component
- `client/tailwind.config.js` - Dark mode configuration
- `client/src/index.css` - Theme-aware CSS classes

### Usage

#### Using Theme Context
```jsx
import { useTheme } from '../context/ThemeContext';

function MyComponent() {
  const { theme, isDark, toggleTheme } = useTheme();
  
  return (
    <div className={isDark ? 'dark-specific-class' : 'light-specific-class'}>
      <button onClick={toggleTheme}>Toggle Theme</button>
    </div>
  );
}
```

#### Tailwind Dark Mode Classes
```jsx
// Text colors
<p className="text-slate-900 dark:text-white">Primary text</p>
<p className="text-slate-500 dark:text-slate-400">Secondary text</p>

// Backgrounds
<div className="bg-white dark:bg-slate-800">Card</div>
<div className="bg-slate-50 dark:bg-[#0f172a]">Page background</div>

// Borders
<div className="border border-slate-200 dark:border-slate-700">Bordered element</div>

// Hover states
<button className="hover:bg-slate-50 dark:hover:bg-slate-700/10">Button</button>
```

### Theme Toggle Locations
1. **Public Navbar** - Top right, next to auth buttons
2. **Dashboard Sidebar** - Top right in sidebar header
3. **Admin Sidebar** - Top right in sidebar header
4. **Mobile Headers** - Visible on mobile layouts

### Color Palette

#### Light Mode
- Background: `#f1f5f9` (slate-50)
- Card: `#ffffff` with transparency
- Text Primary: `#0f172a` (slate-900)
- Text Secondary: `#64748b` (slate-500)
- Borders: `#e2e8f0` (slate-200)

#### Dark Mode
- Background: `#0f172a` (slate-950)
- Card: `#1e293b` (slate-800) with transparency
- Text Primary: `#f8fafc` (slate-50)
- Text Secondary: `#94a3b8` (slate-400)
- Borders: `#334155` (slate-700)

### CSS Classes

#### Utility Classes
- `.glass` - Glassmorphism effect (theme-aware)
- `.glass-dark` - Darker glass effect (theme-aware)
- `.card` - Standard card styling (theme-aware)
- `.card-hover` - Card with hover effects (theme-aware)
- `.input-field` - Form input styling (theme-aware)
- `.btn-primary` - Primary button (gradient, works in both themes)
- `.btn-outline` - Outline button (theme-aware)
- `.sidebar-link` - Sidebar navigation link (theme-aware)

#### Text Helpers
- `.text-primary` - Primary text color (theme-aware)
- `.text-secondary` - Secondary text color (theme-aware)
- `.text-muted` - Muted text color (theme-aware)

### Chart.js Theme Support
Charts automatically adapt to the current theme using the `isDark` value from `useTheme()`:

```jsx
const { isDark } = useTheme();

const chartOptions = {
  scales: {
    x: {
      grid: { color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.06)' },
      ticks: { color: isDark ? '#94a3b8' : '#64748b' },
    },
  },
};
```

### Transition Configuration
All theme transitions are configured in `index.css`:
```css
*, *::before, *::after {
  transition: background-color 0.3s ease, border-color 0.3s ease, color 0.2s ease;
}
```

### LocalStorage Key
Theme preference is stored as: `pixora_theme` with values `'dark'` or `'light'`

### System Preference Detection
On first visit (no saved preference), the theme follows the OS preference:
```javascript
window.matchMedia('(prefers-color-scheme: dark)').matches
```

## Testing
1. Toggle theme using the button - should switch smoothly
2. Refresh page - theme should persist
3. Change OS theme preference (no saved preference) - should follow OS
4. Check all pages for proper theme support
5. Verify charts update colors on theme change

## Browser Support
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Full support
