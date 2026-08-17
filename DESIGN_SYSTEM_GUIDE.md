# Design System & Styling Guide

## 📐 Design Tokens

### Color Palette

#### Primary Colors
```
Primary Gradient: linear-gradient(135deg, #667eea, #764ba2)
Primary: #667eea (Blue)
Secondary: #764ba2 (Purple)
```

#### Semantic Colors
```
Success: #34a853 (Green)
Warning: #ff9800 (Orange)
Danger: #ff6b6b (Red)
Info: #667eea (Blue)
```

#### Text Colors
```
Primary (Headings): #111827 (Very Dark)
Secondary (Body): #6b7280 (Medium Gray)
Light (Muted): #9ca3af (Light Gray)
```

#### Background Colors
```
Primary (Cards): #ffffff (White)
Secondary (Page): #f9fafb (Off White)
Tertiary (Hover): #f3f4f6 (Light Gray)
```

#### Border Colors
```
Default: #e5e7eb (Light Gray)
```

---

### Spacing Scale

```
0px    (None)
4px    (XS)    --spacing-xs
8px    (SM)    --spacing-sm
12px   (intermediate)
16px   (MD)    --spacing-md
20px   (intermediate)
24px   (LG)    --spacing-lg
32px   (XL)    --spacing-xl
40px+  (custom)
```

**Usage Pattern:**
- **Padding:** 16px - 24px for content
- **Margins:** 24px - 32px for sections
- **Gaps:** 16px - 24px for flex/grid
- **Borders:** 8px - 12px for small elements

---

### Typography

#### Font Family
```
Primary: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
         'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif
```

#### Font Sizes
```
H1: 32px - Page titles
H2: 28px - Section titles
H3: 24px - Subsection titles
H4: 20px - Card titles
H5: 16px - Normal headings
H6: 14px - Small headings
Body: 14px - Normal text
Small: 13px - Captions
```

#### Font Weights
```
Regular: 400
Medium: 500
Semibold: 600
Bold: 700
```

#### Line Heights
```
Headings: 1.2 (120%)
Body: 1.6 (160%)
Dense: 1.4 (140%)
```

---

### Border Radius

```
4px    (xs)    Minimal rounding - small UI elements
6px    (sm)    Small buttons, form fields
8px    (md)    Medium buttons, dropdown menus
12px   (md)    Larger containers, cards
16px   (lg)    Large cards, main containers
20px+  (pill)  Pill-shaped (50% height)
```

---

### Shadows

#### Elevation System

```css
Flat (No Shadow):
  Box-shadow: none

Elevation 1 (sm):
  0 4px 20px rgba(0, 0, 0, 0.08)
  Used for: Hover states, small cards

Elevation 2 (md):
  0 8px 30px rgba(0, 0, 0, 0.1)
  Used for: Dropdowns, modals, overlays

Elevation 3 (lg):
  0 12px 40px rgba(0, 0, 0, 0.12)
  Used for: Large modals, major interactions
```

#### Shadow Usage
- **Cards (default):** sm shadow
- **Cards (hover):** md shadow
- **Dropdowns:** md shadow
- **Modals:** lg shadow
- **Floating buttons:** md shadow

---

### Transitions & Animations

#### Timing
```
--transition-fast: 0.15s ease    (subtle hover effects)
--transition-base: 0.3s ease     (standard animations)
--transition-slow: 0.5s ease     (page transitions)
```

#### Easing Functions
```
ease          - Default, natural feeling
ease-in-out   - Smooth start and end
ease-in       - Slow start
ease-out      - Slow end
linear        - Constant speed
```

#### Common Animations
```
Fade In:      opacity: 0 → 1 (0.3s ease)
Slide Up:     translateY: 20px → 0 (0.3s ease)
Slide Left:   translateX: -100% → 0 (0.3s ease)
Scale:        transform: scale(0.95) → 1 (0.3s ease)
```

---

### Component Sizing

#### Buttons
```
Small:        6px 12px    (font-size: 12px)
Medium:       10px 20px   (font-size: 14px) [Default]
Large:        14px 28px   (font-size: 16px)
Full Width:   100% width
```

#### Input Fields
```
Height:       40px
Padding:      10px 14px
Border:       2px solid
Border Radius: 6px
Focus Border:  #667eea
Focus Shadow:  0 0 0 3px rgba(102, 126, 234, 0.1)
```

#### Card Sizes
```
Small:        280px (default)
Medium:       350px
Large:        420px
Responsive:   minmax(280px, 1fr) in grid
```

---

## 📦 Component Styling Patterns

### Card Component
```
Layout:
  - Header (icon + title + trend)
  - Value (large, gradient text)
  - Content (optional)
  - Footer (optional action)

Hover State:
  - translateY(-8px)
  - shadow: md
  - top border gradient appears

Colors:
  - Icon background: Semantic color @ 5% opacity
  - Text: Primary for title, large gradient for value
  - Trend: Success or Danger based on direction
```

### Table Component
```
Layout:
  - Header row (darker background)
  - Data rows (alternating styles)
  - Action buttons (compact)
  - Status badges (color-coded)

Hover State:
  - Row background: gradient overlay
  - Action buttons: border highlight

Status Badges:
  - Success: Green background + text
  - Warning: Orange background + text
  - Danger: Red background + text
  - Info: Blue background + text
```

### Sidebar Component
```
Layout:
  - Logo section (top)
  - Menu items (scrollable)
  - Footer (settings + logout)

Colors:
  - Background: Gradient (primary → secondary)
  - Text: White
  - Active: Bottom border + highlight
  - Hover: Opacity change

Responsive:
  - Desktop: 280px wide
  - Tablet: 70px wide
  - Mobile: 60px wide (icons only)
```

### Navbar Component
```
Layout:
  - Left: Search bar
  - Center: Page title
  - Right: Notifications + Profile

Dropdown:
  - Header: Gradient background
  - Items: Hover highlight
  - Dividers: Border color
  - Logout: Red text on hover

Responsive:
  - Desktop: Full search visible
  - Tablet: Minimal search
  - Mobile: Search hidden, icon only
```

---

## 🎨 Theming Guidelines

### Changing Primary Color
Update in `Global.css`:
```css
:root {
  --primary-gradient: linear-gradient(135deg, #your-color-1, #your-color-2);
  --primary-color: #your-color-1;
  --secondary-color: #your-color-2;
}
```

All components using `--primary-color` will automatically update.

### Adding Dark Mode
Create `Global.dark.css`:
```css
@media (prefers-color-scheme: dark) {
  :root {
    --text-primary: #ffffff;
    --bg-primary: #1a1a1a;
    --bg-secondary: #242424;
    /* ... other dark colors ... */
  }
}
```

### Seasonal Themes
Create new CSS files and toggle via JavaScript:
```javascript
document.documentElement.setAttribute('data-theme', 'christmas');
```

Then use in CSS:
```css
[data-theme="christmas"] {
  --primary-color: #d41c3d;
}
```

---

## 📱 Responsive Design

### Breakpoints
```
Phone (Mobile First):        0px - 480px
Tablet (Portrait):           480px - 768px
Laptop (Landscape):          768px - 1024px
Desktop (Full):              1024px+
UltraWide:                   1440px+
```

### Implementation
```css
/* Mobile First (Base) */
.card {
  padding: 12px;
  font-size: 14px;
}

/* Tablet */
@media (min-width: 768px) {
  .card {
    padding: 16px;
    font-size: 14px;
  }
}

/* Desktop */
@media (min-width: 1024px) {
  .card {
    padding: 24px;
    font-size: 16px;
  }
}
```

### Layout Adjustments

**Grid Columns:**
- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3-4 columns

**Spacing:**
- Mobile: 12-16px
- Tablet: 16-20px
- Desktop: 24-32px

**Typography:**
- Mobile: 14px base
- Tablet: 14px base
- Desktop: 16px base

---

## ♿ Accessibility

### Color Contrast
```
Text on Background:  Minimum 4.5:1
UI Components:       Minimum 3:1
```

### Focus States
```css
button:focus {
  outline: 2px solid #667eea;
  outline-offset: 2px;
}
```

### Touch Targets
```
Minimum: 44px × 44px (mobile)
Recommended: 48px × 48px
Mobile buttons: Minimum 44px
```

### Semantic HTML
```html
<nav>       <!-- Navigation -->
<header>    <!-- Page header -->
<main>      <!-- Main content -->
<article>   <!-- Article content -->
<section>   <!-- Content section -->
<aside>     <!-- Sidebar content -->
<footer>    <!-- Page footer -->
```

---

## 🚀 Performance Optimization

### CSS Best Practices
1. **Use CSS Variables** for theming
2. **Minimize Specificity** (avoid deeply nested selectors)
3. **Use Shorthand** (`padding: 10px` not `padding-top`, etc.)
4. **Group Related Rules** together
5. **Avoid !important** (use proper specificity instead)

### Animation Performance
- Use `transform` and `opacity` (GPU accelerated)
- Avoid `left`, `top`, `width` animations
- Use `will-change` for complex animations
- Keep animations under 0.5s

### Responsive Performance
- Mobile-first approach
- Use `min-width` media queries
- Optimize images for different sizes
- Load only necessary CSS for each breakpoint

---

## 📋 Checklist for New Components

- [ ] Follow color palette
- [ ] Use spacing scale (4/8/12/16/24/32px)
- [ ] Implement hover/focus states
- [ ] Add responsive design (3+ breakpoints)
- [ ] Use transitions (0.15s-0.3s)
- [ ] Add box-shadow for elevation
- [ ] Ensure accessibility (contrast, focus)
- [ ] Test on mobile/tablet/desktop
- [ ] Document component props
- [ ] Add loading/empty states

---

## 🎯 Design Review Checklist

- [ ] Colors match palette?
- [ ] Spacing consistent with scale?
- [ ] Typography matches hierarchy?
- [ ] Shadows create proper elevation?
- [ ] Responsive at all breakpoints?
- [ ] Touch targets 44px minimum?
- [ ] Color contrast 4.5:1?
- [ ] Animations smooth (0.3s)?
- [ ] No layout shifts?
- [ ] Performance optimized?

---

**Version:** 1.0
**Last Updated:** 2024
**Status:** Current ✅
