# 🔗 Auth Components Integration Guide

## Overview

This guide explains how to integrate the modern Auth components into your complete application with proper state management, routing, and API handling.

---

## 📋 Complete App Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.js
│   │   ├── Sidebar.js
│   │   ├── Card.js
│   │   ├── Table.js
│   │   ├── Layout.js
│   │   └── Dashboard.js
│   ├── pages/
│   │   ├── Login.js          ← Auth component
│   │   ├── Signup.js         ← Auth component
│   │   └── Dashboard.js
│   ├── styles/
│   │   ├── Auth.css          ← Auth styling
│   │   ├── Global.css
│   │   ├── Navbar.css
│   │   ├── Sidebar.css
│   │   ├── Card.css
│   │   ├── Table.css
│   │   ├── Layout.css
│   │   └── Dashboard.css
│   ├── App.js                ← Main app
│   ├── App.css
│   └── index.js
├── public/
├── package.json
└── AUTH_COMPONENTS_GUIDE.md
```

---

## 🎯 Integration Steps

### Step 1: Set Up App.js with State Management

```javascript
// src/App.js
import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state from localStorage on app mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      setIsAuthenticated(true);
      setUser(JSON.parse(userData));
    }

    setLoading(false);
  }, []);

  // Show loading spinner while checking auth state
  if (loading) {
    return <div className="loading-screen">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login 
                setIsAuthenticated={setIsAuthenticated}
                setUser={setUser}
              />
            )
          }
        />

        <Route
          path="/signup"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Signup 
                setIsAuthenticated={setIsAuthenticated}
                setUser={setUser}
              />
            )
          }
        />

        {/* Protected Routes */}
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <Dashboard 
                user={user}
                setUser={setUser}
                setIsAuthenticated={setIsAuthenticated}
              />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Catch-all: redirect to login */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
```

### Step 2: Update App.css

```css
/* src/App.css */

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: #0f0c29;
}

.loading-screen {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 18px;
  font-weight: 600;
}

/* Prevent body scroll on auth pages */
.auth-page {
  width: 100%;
  min-height: 100vh;
}

/* Ensure Dashboard has proper layout */
.dashboard {
  display: flex;
  min-height: 100vh;
  background: #f5f5f5;
}
```

### Step 3: Create Protected Route Component (Optional)

```javascript
// src/components/ProtectedRoute.js
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ 
  isAuthenticated, 
  element: Component, 
  ...rest 
}) {
  return isAuthenticated ? <Component {...rest} /> : <Navigate to="/" replace />;
}

export default ProtectedRoute;
```

### Step 4: Set Up API Interceptor (Optional but Recommended)

```javascript
// src/utils/axios-config.js
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor: Add token to every request
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    // If 401 (Unauthorized), clear auth and redirect to login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export default apiClient;
```

### Step 5: Update Login.js to Use API Client (Optional)

```javascript
// src/pages/Login.js - Update imports
import apiClient from '../utils/axios-config';

// Then replace axios.post with apiClient.post
const response = await apiClient.post(
  '/auth/login',  // Relative path since we set baseURL
  { email: email.trim(), password: password.trim() }
);
```

---

## 🔐 Token Management

### Store JWT Token

```javascript
// When login succeeds
const token = response.data.token;
localStorage.setItem('token', token);
localStorage.setItem('user', JSON.stringify(response.data.user));

// Set axios default header
axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```

### Retrieve Token

```javascript
// When making API calls
const token = localStorage.getItem('token');

const config = {
  headers: {
    'Authorization': `Bearer ${token}`
  }
};

axios.get('/api/protected-endpoint', config);
```

### Clear Token on Logout

```javascript
// In Dashboard logout function
function handleLogout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  setIsAuthenticated(false);
  setUser(null);
  navigate('/');
}
```

---

## 🔄 State Management Flow

### Complete Auth Flow

```
1. User visits app (/)
   └─ App checks localStorage for token
   └─ If exists: setIsAuthenticated(true) → redirect to /dashboard
   └─ If not exists: show Login page

2. User enters credentials and clicks Login
   └─ Login.js validates form
   └─ Sends POST /api/auth/login
   └─ Backend returns { token, user }
   └─ Login.js stores token and user
   └─ Login.js calls setIsAuthenticated(true)
   └─ App redirects to /dashboard

3. User is now authenticated
   └─ Can access /dashboard
   └─ Dashboard receives user data
   └─ All API requests include token in header

4. User clicks Logout
   └─ Dashboard calls handleLogout
   └─ Clears localStorage
   └─ Calls setIsAuthenticated(false)
   └─ App redirects to /

5. User session expires
   └─ Backend returns 401 Unauthorized
   └─ Interceptor catches 401
   └─ Clears localStorage
   └─ Redirects to /
```

---

## 🔌 API Endpoints Reference

### Authentication Endpoints

```
POST /api/auth/login
├─ Request: { email: string, password: string }
└─ Response: { token: string, user: { id, name, email, role } }

POST /api/auth/register
├─ Request: { name: string, email: string, password: string, role: string }
└─ Response: { message: string, user?: object }

GET /api/auth/profile
├─ Headers: Authorization: Bearer {token}
└─ Response: { id, name, email, role, createdAt }

POST /api/auth/logout
├─ Headers: Authorization: Bearer {token}
└─ Response: { message: string }
```

### Protected Endpoints (require token)

```
GET /api/dashboard
GET /api/extra-food
GET /api/users
POST /api/feedback
DELETE /api/account
```

---

## 🎨 Styling Integration

### CSS File Loading Order

```javascript
// src/index.js
import './styles/Global.css';      // 1. Global styles
import './styles/Auth.css';        // 2. Auth styles (imported in Login/Signup)
import './styles/Navbar.css';      // 3. Component styles
import './styles/Sidebar.css';
import './styles/Card.css';
import './styles/Table.css';
import './styles/Layout.css';
import './styles/Dashboard.css';
import './App.css';                // 4. App styles
```

### CSS Variable System (Optional Enhancement)

```css
/* src/styles/Global.css */
:root {
  /* Colors */
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --accent-color: #f093fb;
  --bg-dark: #0f0c29;
  --text-primary: #ffffff;
  --text-secondary: rgba(255, 255, 255, 0.75);
  --error-color: #ff6b6b;
  --success-color: #22c55e;

  /* Spacing */
  --spacing-xs: 4px;
  --spacing-sm: 8px;
  --spacing-md: 16px;
  --spacing-lg: 24px;
  --spacing-xl: 32px;

  /* Typography */
  --font-size-sm: 12px;
  --font-size-md: 14px;
  --font-size-lg: 16px;
  --font-size-xl: 20px;

  /* Border Radius */
  --radius-sm: 8px;
  --radius-md: 12px;
  --radius-lg: 20px;
}

/* Then use in Auth.css */
.auth-card {
  background: rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  padding: var(--spacing-xl) var(--spacing-lg);
}
```

---

## 🧪 Testing Integration

### Test Login Flow

```javascript
// cypress/e2e/login.cy.js
describe('Login Flow', () => {
  it('should login successfully', () => {
    cy.visit('http://localhost:3000');
    cy.get('input[type="email"]').type('test@example.com');
    cy.get('input[type="password"]').type('password123');
    cy.get('button').contains('Login').click();
    cy.url().should('include', '/dashboard');
  });

  it('should show error on invalid credentials', () => {
    cy.visit('http://localhost:3000');
    cy.get('input[type="email"]').type('wrong@example.com');
    cy.get('input[type="password"]').type('wrongpassword');
    cy.get('button').contains('Login').click();
    cy.get('.error-toast').should('be.visible');
  });
});
```

### Test Signup Flow

```javascript
// cypress/e2e/signup.cy.js
describe('Signup Flow', () => {
  it('should signup successfully', () => {
    cy.visit('http://localhost:3000/signup');
    cy.get('input[placeholder*="name"]').type('John Doe');
    cy.get('input[type="email"]').type('newuser@example.com');
    cy.get('input[type="password"]').first().type('password123');
    cy.get('input[type="password"]').last().type('password123');
    cy.get('button').contains('Sign Up').click();
    cy.get('.error-toast').should('not.exist');
  });
});
```

---

## 📊 Build Optimization

### Bundle Analysis

```bash
# Install bundle analyzer
npm install --save-dev source-map-explorer

# Add to package.json scripts
"scripts": {
  "analyze": "source-map-explorer 'build/static/js/*.js'"
}

# Run analysis
npm run build
npm run analyze
```

### Code Splitting

```javascript
// src/App.js - Lazy load Auth pages
import { lazy, Suspense } from 'react';

const Login = lazy(() => import('./pages/Login'));
const Signup = lazy(() => import('./pages/Signup'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

function App() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Suspense>
  );
}
```

---

## 🚀 Production Checklist

- [ ] Environment variables set up (API_URL, etc.)
- [ ] HTTPS enabled on backend
- [ ] CORS properly configured
- [ ] Token refresh logic implemented
- [ ] Error boundaries added
- [ ] Loading states for all API calls
- [ ] Form validation working
- [ ] Mobile responsive verified
- [ ] Accessibility tested (keyboard nav, screen reader)
- [ ] Performance optimized (bundle size < 200KB)
- [ ] Browser cache handled
- [ ] Error logging/monitoring set up
- [ ] Tests passing (unit + e2e)
- [ ] Build verified (`npm run build`)

---

## 🐛 Common Integration Issues

### Issue: Token not being sent with requests

**Solution**: Add interceptor to attach token to all requests

```javascript
axios.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
```

### Issue: User logged out when page refreshes

**Solution**: Restore auth state from localStorage

```javascript
useEffect(() => {
  const token = localStorage.getItem('token');
  if (token) {
    setIsAuthenticated(true);
    setUser(JSON.parse(localStorage.getItem('user')));
  }
}, []);
```

### Issue: CORS errors from backend

**Solution**: Backend needs to allow credentials

```java
// Spring Boot CORS configuration
@Configuration
public class CorsConfig implements WebMvcConfigurer {
  @Override
  public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/api/**")
      .allowedOrigins("http://localhost:3000")
      .allowedMethods("*")
      .allowCredentials(true);
  }
}
```

### Issue: 404 on /api/auth/login

**Solution**: Verify backend endpoint exists and is not blocked by security filters

```java
// In SecurityConfig, allow auth endpoints
http.authorizeRequests()
  .antMatchers("/api/auth/**").permitAll()
  .anyRequest().authenticated();
```

---

## 📚 File Checklist

Essential files for auth integration:

```
✅ src/pages/Login.js
✅ src/pages/Signup.js
✅ src/pages/Dashboard.js
✅ src/styles/Auth.css
✅ src/App.js (updated)
✅ src/index.js
✅ src/App.css (updated)
✅ package.json (has all dependencies)

Optional:
⬜ src/utils/axios-config.js (API interceptor)
⬜ src/components/ProtectedRoute.js (Protected routes)
⬜ src/utils/token-manager.js (Token utilities)
⬜ .env.local (Environment variables)
```

---

## 🎯 Next Steps

1. **Implement App.js** with state management
2. **Test Login/Signup** flows locally
3. **Set up API interceptor** for token management
4. **Implement logout** in Dashboard
5. **Add protected routes** for restricted access
6. **Test token refresh** (if needed)
7. **Performance optimize** with code splitting
8. **Deploy to production**

---

## 💡 Pro Tips

1. **Always verify token exists** before making protected requests
2. **Clear auth state** on 401 responses
3. **Use environment variables** for API endpoints
4. **Implement token refresh** for better UX
5. **Log all auth events** for debugging
6. **Test on real devices** before production
7. **Monitor error rates** in production
8. **Keep tokens short-lived** (15-30 minutes)

---

**Version**: 1.0.0  
**Last Updated**: January 2025  
**Status**: ✅ Complete Integration Guide
