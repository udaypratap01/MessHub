# Complete Code Reference - React Authentication System

## 📄 Complete App.js

```javascript
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Check if token exists in localStorage on app load
    const token = localStorage.getItem('token');
    if (token) {
      setIsAuthenticated(true);
      // Optionally fetch user data here
      const userData = localStorage.getItem('user');
      if (userData) {
        setUser(JSON.parse(userData));
      }
    }
    setLoading(false);
  }, []);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login setIsAuthenticated={setIsAuthenticated} setUser={setUser} />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Dashboard setIsAuthenticated={setIsAuthenticated} setUser={setUser} user={user} />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
```

## 📄 Complete pages/Login.js

```javascript
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Login.css';

function Login({ setIsAuthenticated, setUser }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    // Validation
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', {
        email: email,
        password: password,
      });

      // Extract token (handle both 'token' and 'jwt' keys)
      const token = response.data.token || response.data.jwt;

      if (token) {
        // Store JWT token in localStorage
        localStorage.setItem('token', token);

        // Store user data in localStorage if available
        if (response.data.user) {
          localStorage.setItem('user', JSON.stringify(response.data.user));
          setUser(response.data.user);
        }

        // Update authentication state
        setIsAuthenticated(true);

        // Show success message
        alert('Login successful!');

        // Redirect to dashboard
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      if (error.response?.data?.message) {
        setError(error.response.data.message);
      } else {
        setError('Login failed. Please check your credentials and try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-box">
          <h1 className="login-title">Login</h1>
          <p className="login-subtitle">Sign in to your account</p>

          {error && <div className="error-message">{error}</div>}

          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                className="form-input"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                className="form-input"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
              />
            </div>

            <button type="submit" className="login-button" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <p className="login-footer">
            Don't have an account? <span className="signup-link">Sign up</span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
```

## 📄 Complete pages/Dashboard.js

```javascript
import { useNavigate } from 'react-router-dom';
import '../styles/Dashboard.css';

function Dashboard({ setIsAuthenticated, setUser, user }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove token from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Update authentication state
    setIsAuthenticated(false);
    setUser(null);

    // Show logout message
    alert('You have been logged out');

    // Redirect to login
    navigate('/');
  };

  // Get user data from localStorage if not passed as prop
  const currentUser = user || JSON.parse(localStorage.getItem('user') || '{}');
  const userName = currentUser?.name || currentUser?.email || 'User';
  const userRole = currentUser?.role || 'STUDENT';

  return (
    <div className="dashboard-page">
      <nav className="navbar">
        <div className="navbar-content">
          <h2 className="navbar-brand">MessHub</h2>
          <button onClick={handleLogout} className="logout-button">
            Logout
          </button>
        </div>
      </nav>

      <div className="dashboard-container">
        <div className="welcome-card">
          <div className="welcome-content">
            <h1 className="welcome-title">Welcome, {userName}!</h1>
            <p className="welcome-subtitle">
              You are logged in as <span className="role-badge">{userRole}</span>
            </p>
          </div>
        </div>

        <div className="dashboard-grid">
          <div className="dashboard-card">
            <div className="card-icon">👤</div>
            <h3>User Information</h3>
            <p>Email: {currentUser?.email}</p>
            <p>Role: {userRole}</p>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">📊</div>
            <h3>Dashboard</h3>
            <p>View your profile and settings</p>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">⚙️</div>
            <h3>Settings</h3>
            <p>Manage your account preferences</p>
          </div>

          <div className="dashboard-card">
            <div className="card-icon">🔔</div>
            <h3>Notifications</h3>
            <p>Stay updated with latest announcements</p>
          </div>
        </div>

        {userRole === 'ADMIN' && (
          <div className="admin-section">
            <h2>Admin Panel</h2>
            <div className="admin-card">
              <p>Welcome Admin! You have access to administrative features.</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
```

## 📄 Complete components/ProtectedRoute.js

```javascript
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ isAuthenticated, children }) {
  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/" replace />;
  }

  // Allow access if authenticated
  return children;
}

export default ProtectedRoute;
```

---

## 🎨 Complete src/App.css

```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #root {
  width: 100%;
  height: 100%;
}

.App {
  min-height: 100vh;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.loading {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  font-size: 20px;
  font-weight: 600;
}
```

---

## 🎨 Complete src/styles/Login.css

See COMPLETE_IMPLEMENTATION.md for full CSS

---

## 🎨 Complete src/styles/Dashboard.css

See COMPLETE_IMPLEMENTATION.md for full CSS

---

## 🔄 Component Relationships

```
App
├── Router (from react-router-dom)
│   └── Routes
│       ├── Route "/" → Login
│       │   ├── setIsAuthenticated (prop)
│       │   └── setUser (prop)
│       ├── Route "/dashboard" → ProtectedRoute
│       │   └── Dashboard
│       │       ├── user (prop)
│       │       ├── setIsAuthenticated (prop)
│       │       └── setUser (prop)
│       └── Route "*" → Redirect to "/"
```

## 🔑 Props Flow

```
App (holds state)
  ├─ setIsAuthenticated → Login
  ├─ setUser → Login
  └─ Dashboard
      ├─ isAuthenticated (for ProtectedRoute)
      ├─ user
      ├─ setIsAuthenticated
      └─ setUser
```

## 📊 State Hierarchy

```
App (Top-level state)
├── isAuthenticated: boolean
├── loading: boolean
├── user: object | null
├── setIsAuthenticated: function
└── setUser: function

Login (Form state)
├── email: string
├── password: string
├── loading: boolean
└── error: string

Dashboard (No internal state)
├── Reads from localStorage
└── Uses props from App
```

## 🚀 Execution Flow

### App Load
```
App mounts
  → useEffect runs
  → Check localStorage for 'token'
  → If exists: setIsAuthenticated(true)
  → Retrieve 'user' from localStorage
  → setLoading(false)
  → Render App with current auth state
```

### Login Flow
```
User fills form
  → Click "Login"
  → Form validation
  → POST to http://localhost:8080/api/auth/login
  → If success:
    → Store token in localStorage
    → Store user in localStorage
    → setIsAuthenticated(true)
    → setUser(userData)
    → navigate('/dashboard')
  → If error:
    → Display error message
    → Stay on login page
```

### Dashboard Access
```
User navigates to /dashboard
  → ProtectedRoute checks isAuthenticated
  → If true: Render Dashboard
  → If false: Redirect to "/"
```

### Logout Flow
```
User clicks "Logout"
  → localStorage.removeItem('token')
  → localStorage.removeItem('user')
  → setIsAuthenticated(false)
  → setUser(null)
  → navigate('/')
  → Show login page
```

---

## 🧪 Testing Checklist

- [ ] Login form renders correctly
- [ ] Email validation works
- [ ] Password validation works
- [ ] API call is made on submit
- [ ] Token is stored in localStorage
- [ ] User data is stored in localStorage
- [ ] Redirect to dashboard works
- [ ] Dashboard displays user name
- [ ] Dashboard displays user role
- [ ] Admin section shows for ADMIN role
- [ ] Logout button removes token
- [ ] Logout button clears user data
- [ ] Redirect to login after logout works
- [ ] Direct dashboard access redirects to login
- [ ] Page refresh keeps user logged in
- [ ] Error messages display correctly
- [ ] Loading state works
- [ ] Responsive design works on mobile

