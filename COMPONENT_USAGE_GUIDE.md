# Frontend UI Components - Quick Reference Guide

## 🎯 How to Use the New Components

### 1. Using the Card Component

**Purpose:** Display metric cards with values, icons, and trends

```javascript
import Card from '../components/Card';

<Card
  icon="🍽️"
  title="Total Meals"
  value={120}
  color="blue"           // blue, purple, green, orange, red, pink
  trend="up"             // up or down
  trendValue="12%"
  onClick={() => handleClick()}
/>
```

**Props:**
- `icon` - Emoji or icon character
- `title` - Card title/label
- `value` - Main value to display
- `color` - Color theme (default: 'blue')
- `trend` - Trend direction ('up' or 'down')
- `trendValue` - Percentage change
- `onClick` - Click handler
- `children` - Additional content to render
- `className` - Additional CSS classes

---

### 2. Using the Table Component

**Purpose:** Display data in a structured table format

```javascript
import Table from '../components/Table';

const columns = [
  { key: 'id', label: 'Order ID', width: '15%' },
  { key: 'item', label: 'Item', width: '20%' },
  { key: 'status', label: 'Status', width: '15%' },
  { key: 'actions', label: 'Actions', width: '20%' }
];

const data = [
  { 
    id: 'ORD001', 
    item: 'Biryani',
    status: <span className="table-cell-status completed">Completed</span>,
    actions: <div className="table-actions">
      <button className="table-action-btn">View</button>
      <button className="table-action-btn delete">Delete</button>
    </div>
  }
];

<Table 
  columns={columns}
  data={data}
  emptyMessage="No orders found"
/>
```

**Status Badge Classes:**
- `table-cell-status completed` / `active` / `approved` → Green
- `table-cell-status pending` / `warning` → Orange
- `table-cell-status rejected` / `failed` / `cancelled` → Red
- `table-cell-status pending-review` → Blue

---

### 3. Using the Sidebar Component

**Purpose:** Main navigation sidebar with role-based menus

```javascript
import Sidebar from '../components/Sidebar';

<Sidebar 
  isCollapsed={sidebarCollapsed}
  onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
  currentUser={user}
  onLogout={handleLogout}
/>
```

**Features:**
- Automatically shows different menus for ADMIN vs STUDENT
- Auto-highlights current page based on route
- Collapsible for mobile devices
- Settings and Logout buttons

---

### 4. Using the Navbar Component

**Purpose:** Top navigation with search and user profile

```javascript
import Navbar from '../components/Navbar';

<Navbar 
  pageTitle="Dashboard"
  currentUser={user}
  onLogout={handleLogout}
  sidebarCollapsed={sidebarCollapsed}
/>
```

**Features:**
- Search bar
- Notification button with badge counter
- User profile dropdown with logout
- Responsive design

---

### 5. Using the Layout Component

**Purpose:** Main container combining Sidebar, Navbar, and content

```javascript
import Layout from '../components/Layout';

<Layout 
  currentUser={user}
  onLogout={handleLogout}
>
  {/* Your page content here */}
</Layout>
```

**Features:**
- Handles sidebar toggle
- Responsive margin adjustments
- Automatic navbar + sidebar integration
- Content scrolling

---

## 🎨 CSS Classes for Styling

### Button Classes
```html
<button className="btn btn-primary">Primary Button</button>
<button className="btn btn-secondary">Secondary Button</button>
<button className="btn btn-danger">Delete Button</button>
<button className="btn btn-success">Success Button</button>
<button className="btn btn-sm">Small Button</button>
<button className="btn btn-lg">Large Button</button>
```

### Card Grid Layout
```html
<div className="card-grid">
  <!-- Cards automatically arrange based on screen size -->
</div>
```

### Alerts
```html
<div className="alert alert-warning">⚠️ Warning message</div>
<div className="alert alert-success">✅ Success message</div>
<div className="alert alert-error">❌ Error message</div>
```

### Utility Classes
```html
<!-- Flexbox -->
<div className="flex">Flex container</div>
<div className="flex-center">Centered both ways</div>
<div className="flex-between">Space between</div>

<!-- Spacing -->
<div className="gap-sm">Small gap</div>
<div className="gap-md">Medium gap</div>
<div className="gap-lg">Large gap</div>

<!-- Margins -->
<div className="mt-lg">Large top margin</div>
<div className="mb-md">Medium bottom margin</div>

<!-- Padding -->
<div className="p-lg">Large padding</div>

<!-- Text -->
<div className="text-center">Centered text</div>
<div className="text-muted">Muted text color</div>
<div className="text-bold">Bold text</div>

<!-- Others -->
<div className="rounded">Border radius</div>
<div className="shadow">Box shadow</div>
<div className="cursor-pointer">Pointer cursor</div>
```

### Responsive Classes
All components automatically respond to screen size. Additional styling at:
- **Desktop:** > 1024px
- **Tablet:** 768px - 1024px
- **Mobile:** 480px - 768px
- **Extra Small:** < 480px

---

## 🎯 Color Themes

### Card Colors
```javascript
color="blue"      // #667eea
color="purple"    // #764ba2
color="green"     // #34a853
color="orange"    // #ff9800
color="red"       // #ff6b6b
color="pink"      // #ec407a
```

---

## 📝 Common Patterns

### Dashboard Page Template
```javascript
import React, { useState, useEffect } from 'react';
import Card from '../components/Card';
import Table from '../components/Table';
import '../styles/Dashboard.css';

function Dashboard({ user }) {
  const [stats, setStats] = useState({});

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>Page Title</h1>
          <p>Subtitle</p>
        </div>

        <div className="dashboard-section">
          <h2 className="section-title">Metrics</h2>
          <div className="card-grid">
            <Card icon="📊" title="Metric" value={100} color="blue" />
          </div>
        </div>

        <div className="dashboard-section">
          <h2 className="section-title">Data</h2>
          <Table columns={columns} data={data} />
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
```

### Form Template
```html
<div className="form-group">
  <label>Label</label>
  <input type="text" placeholder="Enter value" />
  <div className="form-error">Error message</div>
</div>

<button className="btn btn-primary">Submit</button>
```

### Empty State Template
```html
<div className="empty-state">
  <div className="empty-state-icon">📋</div>
  <h3 className="empty-state-title">No Data</h3>
  <p className="empty-state-text">Nothing to display</p>
  <button className="empty-state-action">Create New</button>
</div>
```

---

## 🔧 Customization

### Changing Colors
Edit `src/styles/Global.css` and update CSS custom properties:
```css
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --success-color: #34a853;
  --warning-color: #ff9800;
  --danger-color: #ff6b6b;
}
```

### Adding New Card Colors
Edit `src/styles/Card.css`:
```css
.card-cyan {
  --primary-color: #00bcd4;
  --bg-color: rgba(0, 188, 212, 0.05);
}
```

Then use: `<Card color="cyan" ... />`

### Adjusting Spacing
Edit `src/styles/Global.css` spacing variables:
```css
:root {
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;
}
```

---

## 📱 Responsive Testing

Test components at these widths:
- **1920px** - Desktop (HD)
- **1024px** - Desktop (Laptop)
- **768px** - Tablet
- **480px** - Mobile
- **320px** - Extra small phone

All components have been tested and optimized for these sizes.

---

## 🚀 Performance Tips

1. **Use Card Component** instead of custom metric cards for consistency
2. **Implement Virtual Scrolling** for large tables (Table component supports this)
3. **Memoize Components** that don't need re-renders
4. **Lazy Load Images** in cards with fallback icons
5. **Use CSS Variables** for theming instead of inline styles

---

## 🐛 Troubleshooting

### Cards not showing colors
- Ensure `Card.css` is imported in component
- Check `color` prop matches available theme

### Table not displaying
- Verify `columns` array has correct structure: `{ key, label, width }`
- Ensure `data` is an array of objects matching column keys

### Responsive not working
- Check browser width at the actual breakpoint
- Clear browser cache (Ctrl+Shift+Delete)
- Verify Global.css is imported first in index.js

### Styles not applying
- Check CSS import order (Global.css should be first)
- Verify file paths are correct
- Look for conflicting CSS rules

---

## 📚 Additional Resources

- **Dashboard.js** - Complete example using all components
- **Global.css** - Base styles and utilities
- **Component files** - Look at prop definitions and examples

---

**Last Updated:** 2024
**Version:** 1.0
**Status:** Production Ready ✅
