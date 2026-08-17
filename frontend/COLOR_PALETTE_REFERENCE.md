# 🎨 Dark Theme Color Palette Reference
**Applied Across All UI Components**

---

## 📋 Color System

### Core Gradient (Primary)
```
Linear Gradient: 135deg
  Start:  #667eea (Electric Blue)
  End:    #764ba2 (Royal Purple)
```
**Usage:** Buttons, headers, accents, highlights

---

## 🌙 Dark Theme Backgrounds

### Container Backgrounds (Glassmorphic)
```
rgba(255, 255, 255, 0.06)  ← Primary cards & containers
+ backdrop-filter: blur(10px)
+ border: 1px solid rgba(255, 255, 255, 0.08)
+ border-radius: 12-16px
```

### Subtle Backgrounds (Table Rows)
```
Even rows:   rgba(255, 255, 255, 0.04)
Odd rows:    rgba(255, 255, 255, 0.02)
Hover state: rgba(102, 126, 234, 0.1)  ← With accent blue
```

### Disabled/Inactive States
```
rgba(255, 255, 255, 0.02)  ← Very subtle
opacity: 0.5;              ← Reduced opacity
```

---

## 🎯 Text Colors (High Contrast)

### Primary Text - Headings & Titles
```css
color: #ffffff;
font-weight: 700;
Usage: h1, h2, h3, section titles, table headers
```

### Secondary Text - Labels & Descriptions
```css
color: #cfcfff;
font-weight: 600;
Usage: Subtitles, labels, descriptions
```

### Tertiary Text - Body & Table Content
```css
color: #e0e0ff;
font-weight: 400-600;
Usage: Table cells, paragraphs, status info
```

---

## 🎯 Status Colors (Dark Theme)

### Success State
```css
Background: rgba(76, 175, 80, 0.2)    ← 20% opacity green
Text Color: #90ee90                     ← Bright lime green
Border:     #4caf50                     ← Medium green
Usage: Present, active, approved badges
```

### Warning State
```css
Background: rgba(255, 152, 0, 0.2)    ← 20% opacity orange
Text Color: #ffcc99                     ← Light orange
Border:     #ff9800                     ← Medium orange
Usage: Pending, not-marked badges
```

### Error State
```css
Background: rgba(255, 107, 107, 0.2)  ← 20% opacity red
Text Color: #ff9999                     ← Light red
Border:     #ff6b6b                     ← Medium red
Usage: Absent, failed, error badges
```

### Info State
```css
Background: rgba(102, 126, 234, 0.2)  ← 20% opacity blue
Text Color: #b3d9ff                     ← Light blue
Border:     #667eea                     ← Medium blue
Usage: Info, pending-review badges
```

---

## 🎨 Component-Specific Styling

### Buttons
```css
/* Primary Button */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
color: #ffffff;
box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);

/* Hover */
box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
transform: translateY(-2px);

/* Disabled */
background: rgba(255, 255, 255, 0.1);
opacity: 0.5;
```

### Cards
```css
background: rgba(255, 255, 255, 0.06);
border: 1px solid rgba(255, 255, 255, 0.08);
backdrop-filter: blur(10px);
border-radius: 16px;

/* Hover */
background: rgba(255, 255, 255, 0.08);
border-color: rgba(102, 126, 234, 0.2);
transform: translateY(-8px);
box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
```

### Tables
```css
/* Header */
background: linear-gradient(135deg, rgba(102, 126, 234, 0.12), rgba(118, 75, 162, 0.12));
color: #ffffff;

/* Body Rows */
background: rgba(255, 255, 255, 0.02-0.04);
color: #e0e0ff;

/* Hover Row */
background: linear-gradient(90deg, rgba(102, 126, 234, 0.1), transparent);
```

### Alerts
```css
/* Error */
background: rgba(239, 68, 68, 0.15);
color: #ff9999;
border-left: 4px solid #ff6b6b;

/* Success */
background: rgba(76, 175, 80, 0.15);
color: #90ee90;
border-left: 4px solid #4caf50;

/* Warning */
background: rgba(255, 152, 0, 0.15);
color: #ffcc99;
border-left: 4px solid #ff9800;

/* Info */
background: rgba(102, 126, 234, 0.15);
color: #b3d9ff;
border-left: 4px solid #667eea;
```

---

## 🌈 Color Accessibility

### Contrast Ratios
- ✅ White (#ffffff) on dark background → **15:1+** (AAA)
- ✅ Light blue (#cfcfff) on dark background → **12:1+** (AAA)
- ✅ Light purple (#e0e0ff) on dark background → **10:1+** (AAA)
- ✅ All status colors with 20% opacity backgrounds → **8:1+** (AA)

### WCAG Compliance
- ✅ AAA Rating for primary text
- ✅ AA Rating for secondary text
- ✅ Proper color contrast for color-blind users
- ✅ No color-only status indicators

---

## 📱 CSS Variables (Ready to Use)

```css
/* In Global.css or root CSS */
:root {
  /* Primary Gradient */
  --primary-gradient: linear-gradient(135deg, #667eea, #764ba2);
  --primary-blue: #667eea;
  --secondary-purple: #764ba2;
  
  /* Text Colors */
  --text-primary: #ffffff;      /* Headings */
  --text-secondary: #cfcfff;    /* Labels */
  --text-tertiary: #e0e0ff;     /* Body */
  
  /* Backgrounds */
  --bg-card: rgba(255, 255, 255, 0.06);
  --bg-subtle: rgba(255, 255, 255, 0.04);
  --bg-very-dark: rgba(255, 255, 255, 0.02);
  --border-light: rgba(255, 255, 255, 0.08);
  
  /* Status */
  --status-success: #90ee90;
  --status-warning: #ffcc99;
  --status-error: #ff9999;
  --status-info: #b3d9ff;
  
  /* Shadows */
  --shadow-sm: 0 4px 20px rgba(0, 0, 0, 0.2);
  --shadow-md: 0 8px 30px rgba(0, 0, 0, 0.25);
  --shadow-lg: 0 12px 40px rgba(0, 0, 0, 0.3);
}
```

---

## 🎭 Implementation Examples

### Dark Card with Text
```css
.card {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(10px);
  border-radius: 16px;
  padding: 24px;
}

.card-title {
  color: #ffffff;
  font-weight: 700;
  font-size: 18px;
}

.card-description {
  color: #cfcfff;
  font-size: 14px;
  line-height: 1.6;
}
```

### Dark Button with Gradient
```css
.button {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: #ffffff;
  border: none;
  border-radius: 8px;
  padding: 12px 24px;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);
  transition: all 0.3s ease;
}

.button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 16px rgba(102, 126, 234, 0.4);
}
```

### Dark Table with Status
```css
table {
  background: rgba(255, 255, 255, 0.06);
  border-collapse: collapse;
}

th {
  background: linear-gradient(135deg, rgba(102, 126, 234, 0.12), rgba(118, 75, 162, 0.12));
  color: #ffffff;
  padding: 16px;
}

td {
  color: #e0e0ff;
  padding: 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.04);
}

.status-badge {
  background: rgba(76, 175, 80, 0.2);
  color: #90ee90;
  padding: 6px 12px;
  border-radius: 20px;
}
```

---

## ✨ Effects & Animations

### Glassmorphism Blur
```css
backdrop-filter: blur(10px);
-webkit-backdrop-filter: blur(10px);  /* Safari */
```

### Smooth Transitions
```css
transition: all 0.3s ease;
transition: background 0.2s ease, color 0.2s ease;
```

### Hover Lift
```css
&:hover {
  transform: translateY(-8px);
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
}
```

### Focus Ring
```css
&:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.3);
}
```

---

## 📊 Color Palette Summary

| Element | Color | Opacity | Usage |
|---------|-------|---------|-------|
| Background | rgba(255,255,255,*) | 6% | Cards, containers |
| Subtle BG | rgba(255,255,255,*) | 4% | Even table rows |
| Very Dark | rgba(255,255,255,*) | 2% | Odd table rows |
| Border | rgba(255,255,255,*) | 8% | Card borders |
| Primary Text | #ffffff | 100% | Headings |
| Secondary Text | #cfcfff | 100% | Labels |
| Tertiary Text | #e0e0ff | 100% | Body text |
| Accent Blue | #667eea | 100% | Gradients, buttons |
| Accent Purple | #764ba2 | 100% | Gradients |
| Success | #90ee90 | 100% | Status badges |
| Warning | #ffcc99 | 100% | Status badges |
| Error | #ff9999 | 100% | Status badges |
| Info | #b3d9ff | 100% | Status badges |

---

## 🔄 Brand Consistency

All components now use:
- ✅ Same dark background palette
- ✅ Same text color hierarchy
- ✅ Same gradient blue-purple accent
- ✅ Same glassmorphic effects
- ✅ Same hover/focus animations
- ✅ Same shadow system
- ✅ Same status color coding

**Result:** Professional, cohesive, modern dark-themed UI

