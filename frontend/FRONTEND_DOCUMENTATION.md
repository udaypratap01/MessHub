# 🎨 React Frontend - Menu Management System

## 📖 Overview

This React frontend provides a complete user interface for the MessHub mess management system. It includes authentication, dashboard, and menu management features with a beautiful, responsive design.

---

## ✨ Features

### 🔐 Authentication
- Login page with email and password
- JWT token storage in localStorage
- Automatic session persistence on page refresh
- Form validation and error handling
- Logout functionality

### 📊 Dashboard
- Welcome message with user information
- Role-based greeting (ADMIN/STUDENT)
- Navigation cards to different sections
- Quick access to menu management
- Responsive grid layout

### 📋 Menu Management
- View all weekly menus
- Admin-only form to add new menus
- Real-time menu list updates
- Beautiful card-based layout
- Mobile-responsive design

### 🛡️ Security
- Protected routes preventing unauthorized access
- JWT token validation on every request
- Role-based feature visibility
- Automatic logout on token expiration

---

## 🚀 Getting Started

### Prerequisites
- Node.js 14+ installed
- npm or yarn package manager
- Backend running on http://localhost:8080

### Installation

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
```

3. **Start development server**
```bash
npm start
```

The app will open at `http://localhost:3000`

---

## 📁 Project Structure

```
src/
├── pages/                  # Page components
│   ├── Login.js           # Login form page
│   ├── Dashboard.js       # Main dashboard
│   └── Menu.js            # Menu management page
├── components/            # Reusable components
│   └── ProtectedRoute.js  # Route guard component
├── styles/               # CSS files
│   ├── Login.css
│   ├── Dashboard.css
│   └── Menu.css
├── App.js               # Main application component
├── App.css              # Global styles
└── index.js             # React entry point
```

---

## 🔄 Component Hierarchy

```
App.js
├── BrowserRouter
│   └── Routes
│       ├── Route: / (Login)
│       ├── Route: /dashboard (Protected)
│       │   └── Dashboard
│       ├── Route: /menu (Protected)
│       │   └── Menu
│       └── Route: * (Catch-all)
```

---

## 📄 File Documentation

### App.js - Main Application Component

**Purpose**: Central routing and authentication state management

**Key Features**:
- BrowserRouter setup with React Router v7
- Global authentication state (`isAuthenticated`, `user`, `loading`)
- useEffect hook checking localStorage on app load
- Protected routes using ProtectedRoute component
- Automatic redirect to dashboard if authenticated

**State Variables**:
- `isAuthenticated` (boolean) - User login status
- `loading` (boolean) - Loading state during token check
- `user` (object) - Current user info with email and role

**Routing Logic**:
```
/ → Login page (or redirect to /dashboard if authenticated)
/dashboard → Dashboard (protected)
/menu → Menu page (protected)
* → Redirect to / (invalid routes)
```

---

### pages/Login.js - User Authentication

**Purpose**: Handle user login and authentication

**Features**:
- Email and password input fields
- Form validation before submission
- API call to POST /api/auth/login
- JWT token storage in localStorage
- Error handling with user feedback
- Automatic redirect to dashboard on success
- Loading state during API call

**Form Fields**:
- Email (required, email format)
- Password (required, minimum length)

**API Integration**:
```javascript
POST http://localhost:8080/api/auth/login
Headers: {
  'Content-Type': 'application/json'
}
Body: {
  email: "user@example.com",
  password: "password123"
}
```

**Response Handling**:
- Success: Store token and user info, redirect to /dashboard
- Error: Display error message, keep user on login page

**localStorage Keys**:
- `token` - JWT token for API authentication
- `user` - User object with email, name, and role

---

### pages/Dashboard.js - Main Dashboard

**Purpose**: Display user information and provide navigation

**Features**:
- Welcome message with user name
- Role badge showing ADMIN or STUDENT
- Navigation cards to different features
- Logout button in navbar
- Responsive grid layout
- Admin-specific content

**Components**:
- Navbar with MessHub branding and logout button
- Welcome card with user greeting
- Dashboard grid with feature cards
- Admin panel for administrators

**Navigation**:
- Menu Management card → /menu
- Settings card (placeholder)
- Other feature cards (expandable)

**Logout Functionality**:
- Removes token and user data from localStorage
- Updates authentication state
- Redirects to login page
- Shows confirmation message

---

### pages/Menu.js - Menu Management Page

**Purpose**: Display and manage weekly menus

**Features**:
- Fetch all menus from backend on component load
- Display menus in responsive grid layout
- Admin-only form to add new menus
- Real-time list updates
- Error handling and loading states
- Back button to dashboard

**User Roles**:
- **Students**: View-only access to menus
- **Admins**: Can add new menus

**Admin Form Features**:
- Day of week dropdown (Monday-Sunday)
- Text inputs for breakfast, lunch, dinner
- Client-side validation
- Server-side authorization checks
- Success/error messages

**API Endpoints**:
```
GET /api/menu - Retrieve all menus
POST /api/menu - Add new menu (admin only)
```

**Menu Card Layout**:
- Day of week as header with gradient background
- Three meal sections (breakfast, lunch, dinner)
- Emoji icons for meal types
- Hover effects and animations

---

### components/ProtectedRoute.js - Route Guard

**Purpose**: Prevent unauthorized access to protected pages

**Logic**:
```javascript
if (!isAuthenticated) {
  redirect to /login
} else {
  render protected component
}
```

**Usage**:
```javascript
<Route element={<ProtectedRoute isAuthenticated={auth}><Component /></ProtectedRoute>} />
```

---

## 🎨 Styling

### Design System

**Color Palette**:
- Primary: `#667eea` (blue-purple)
- Secondary: `#764ba2` (purple)
- Background: Gradient `135deg, #667eea → #764ba2`
- Text: `#333` (dark)
- Error: `#c33` (red)

**Typography**:
- Font: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif
- Headings: 24-32px, font-weight 600-700
- Body: 14-16px, font-weight 400-600

**Spacing**:
- Container padding: 20-30px
- Card padding: 15-20px
- Gaps: 15-20px

**Responsive Breakpoints**:
- Desktop: 1200px+
- Tablet: 768-1200px
- Mobile: < 768px

---

## 🔐 Authentication Flow

```
1. User visits http://localhost:3000
2. App.js checks localStorage for token
3. If token exists:
   → Set isAuthenticated = true
   → Load Dashboard
4. If token doesn't exist:
   → Redirect to Login page
5. User enters email/password
6. Submit POST /api/auth/login
7. Receive JWT token from backend
8. Store token in localStorage
9. Redirect to /dashboard
10. Dashboard renders protected components
```

---

## 🧪 Testing

### Test Scenarios

**1. Login Flow**
- [ ] Open http://localhost:3000
- [ ] Enter valid credentials
- [ ] Click Login button
- [ ] Should redirect to /dashboard
- [ ] Token should be in localStorage

**2. Protected Routes**
- [ ] Try accessing /dashboard without token
- [ ] Should redirect to /login
- [ ] Try accessing /menu without token
- [ ] Should redirect to /login

**3. Menu Page (Student)**
- [ ] Login as student
- [ ] Click Menu Management card
- [ ] Should see list of menus
- [ ] Should NOT see Add New Menu button

**4. Menu Page (Admin)**
- [ ] Login as admin
- [ ] Click Menu Management card
- [ ] Should see "Add New Menu" button
- [ ] Fill and submit form
- [ ] New menu should appear in list

**5. Session Persistence**
- [ ] Login to account
- [ ] Refresh page (F5)
- [ ] Should remain logged in
- [ ] User info should still be visible

**6. Logout**
- [ ] Click Logout button
- [ ] Should redirect to /login
- [ ] localStorage should be cleared
- [ ] Try refreshing - should stay on login

---

## 🛠️ Configuration

### API Base URL

Edit API URLs in component files:

**Login.js**:
```javascript
const response = await axios.post('http://localhost:8080/api/auth/login', ...);
```

**Menu.js**:
```javascript
const response = await axios.get('http://localhost:8080/api/menu', ...);
const response = await axios.post('http://localhost:8080/api/menu', ...);
```

### Environment Variables (Optional)

Create `.env` file:
```
REACT_APP_API_BASE_URL=http://localhost:8080
```

Update components to use:
```javascript
const apiBase = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';
```

---

## 📦 Dependencies

### Core Dependencies
```json
{
  "react": "^19.2.5",
  "react-dom": "^19.2.5",
  "react-router-dom": "^7.14.1",
  "axios": "^1.15.0"
}
```

### Dev Dependencies
```json
{
  "@testing-library/react": "^16.3.2",
  "@testing-library/jest-dom": "^6.6.3",
  "jest": "^27.5.1"
}
```

---

## 🚀 Available Scripts

### Development
```bash
npm start          # Start development server (port 3000)
npm test          # Run tests
npm run build     # Build for production
npm run eject     # Eject from create-react-app (irreversible)
```

---

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| CORS error | Ensure backend CorsConfig allows localhost:3000 |
| Login not working | Check backend is running on 8080, verify API endpoint |
| Menu page not loading | Check JWT token in localStorage is valid |
| Components not rendering | Check browser console for React errors |
| Styles not loading | Ensure CSS files are imported in JS files |
| localStorage not working | Check browser storage is enabled |

---

## 💡 Best Practices

### State Management
- ✅ Use useState for component-level state
- ✅ Use useEffect for side effects (API calls, localStorage)
- ✅ Keep authentication state in App.js
- ✅ Consider Redux for complex global state

### Performance
- ✅ Use lazy loading for routes
- ✅ Memoize expensive computations
- ✅ Debounce API calls
- ✅ Optimize images and assets

### Security
- ✅ Store JWT in localStorage (not sessionStorage)
- ✅ Include token in all API requests
- ✅ Validate forms client-side before submission
- ✅ Clear localStorage on logout
- ✅ Never store sensitive data in localStorage

### Code Organization
- ✅ Separate pages and components
- ✅ Keep styles in dedicated CSS files
- ✅ Use meaningful component and variable names
- ✅ Add comments for complex logic
- ✅ Keep components focused and reusable

---

## 📝 Future Enhancements

1. **Context API** - Move authentication state to Context
2. **Redux** - Centralized state management
3. **TypeScript** - Type safety
4. **Error Boundary** - Global error handling
5. **Lazy Loading** - Code splitting with React.lazy()
6. **PWA** - Progressive Web App features
7. **Testing** - Unit and integration tests
8. **Accessibility** - WCAG compliance
9. **Internationalization** - Multi-language support
10. **Dark Mode** - Theme toggle

---

## 📚 Related Documentation

- [Backend Setup](../backend/COMPLETE_SYSTEM_GUIDE.md)
- [CORS Configuration](../backend/CORS_CONFIG.md)
- [Menu Implementation](../backend/MENU_IMPLEMENTATION.md)
- [System Overview](../SYSTEM_OVERVIEW.md)

---

## 📞 Support

For issues:
1. Check browser console (F12 → Console)
2. Check backend logs
3. Verify API endpoints are correct
4. Ensure backend is running on 8080
5. Check MongoDB is running
6. Clear localStorage and try again

---

**Version**: 1.0 | **Status**: Production Ready | **Last Updated**: December 2024

**Happy coding! 🎉**
