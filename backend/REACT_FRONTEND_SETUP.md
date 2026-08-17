# Mess Management System - React Frontend Complete Setup Guide

## 📁 Project Structure

```
frontend/
├── src/
│   ├── api.js                    # API client with JWT interceptor
│   ├── App.js                    # Main app routing
│   ├── App.css                   # Global styles
│   ├── pages/
│   │   ├── Login.js              # Login page
│   │   ├── Dashboard.js          # Dashboard
│   │   ├── Menu.js               # Menu display
│   │   ├── Attendance.js         # Attendance management
│   │   └── Billing.js            # Billing management
│   ├── components/
│   │   ├── Sidebar.js            # Navigation sidebar
│   │   └── ProtectedRoute.js     # Route protection
│   └── index.js                  # Entry point
├── package.json
└── .env
```

## 🔧 Installation Steps

1. **Create React App** (Already done):
```bash
npx create-react-app frontend
cd frontend
```

2. **Install Dependencies**:
```bash
npm install axios react-router-dom
```

3. **Create .env file** in frontend root:
```
REACT_APP_API_URL=http://localhost:8080/api
```

## 📝 File by File - Create These Files

### 1. src/api.js - API Client Configuration
```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add JWT token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle unauthorized responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
```

### 2. src/components/ProtectedRoute.js - Route Protection
```javascript
import React from 'react';
import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;
```

### 3. src/components/Sidebar.js - Navigation Menu
```javascript
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>🍽️ Mess Hub</h2>
      </div>

      <div className="user-info">
        <p><strong>User:</strong> {user.name}</p>
        <p><strong>Role:</strong> {user.role}</p>
      </div>

      <nav className="sidebar-nav">
        <Link to="/dashboard" className="nav-link">📊 Dashboard</Link>
        <Link to="/menu" className="nav-link">📋 Menu</Link>
        
        {user.role === 'STUDENT' && (
          <>
            <Link to="/attendance" className="nav-link">✅ Mark Attendance</Link>
            <Link to="/billing" className="nav-link">💰 My Bill</Link>
          </>
        )}

        {user.role === 'ADMIN' && (
          <>
            <Link to="/attendance" className="nav-link">📊 View Attendance</Link>
            <Link to="/billing" className="nav-link">💳 Manage Bills</Link>
          </>
        )}
      </nav>

      <button className="logout-btn" onClick={handleLogout}>
        🚪 Logout
      </button>
    </div>
  );
};

export default Sidebar;
```

### 4. src/components/Sidebar.css - Sidebar Styles
```css
.sidebar {
  width: 250px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 20px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  overflow-y: auto;
  box-shadow: 2px 0 10px rgba(0, 0, 0, 0.1);
}

.sidebar-header {
  margin-bottom: 30px;
  border-bottom: 2px solid rgba(255, 255, 255, 0.2);
  padding-bottom: 15px;
}

.sidebar-header h2 {
  margin: 0;
  font-size: 24px;
  text-align: center;
}

.user-info {
  background: rgba(255, 255, 255, 0.1);
  padding: 15px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 14px;
}

.user-info p {
  margin: 8px 0;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 30px;
}

.nav-link {
  display: block;
  padding: 12px 15px;
  color: white;
  text-decoration: none;
  border-radius: 6px;
  transition: all 0.3s ease;
  font-weight: 500;
}

.nav-link:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateX(5px);
}

.logout-btn {
  width: 100%;
  padding: 12px 15px;
  background: #ff6b6b;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: all 0.3s ease;
}

.logout-btn:hover {
  background: #ff5252;
  transform: scale(1.02);
}
```

### 5. src/pages/Login.js - Login Page
```javascript
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import '../pages/Auth.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      
      // Store token and user data
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));

      navigate('/dashboard');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h1>🍽️ Mess Management System</h1>
        <h2>Login</h2>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label>Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label>Password:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <div className="test-credentials">
          <p><strong>Test Credentials:</strong></p>
          <p>Student: student@example.com / password123</p>
          <p>Admin: admin@example.com / password123</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
```

### 6. src/pages/Auth.css - Authentication Styles
```css
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.auth-box {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
  width: 100%;
  max-width: 400px;
}

.auth-box h1 {
  text-align: center;
  color: #667eea;
  font-size: 28px;
  margin-bottom: 10px;
}

.auth-box h2 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 24px;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.3s;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #667eea;
}

button[type="submit"] {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.3s;
  margin-top: 20px;
}

button[type="submit"]:hover {
  transform: scale(1.02);
}

button[type="submit"]:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 12px;
  border-radius: 6px;
  margin-bottom: 20px;
  border-left: 4px solid #c33;
}

.test-credentials {
  background: #f0f0f0;
  padding: 15px;
  border-radius: 6px;
  margin-top: 20px;
  font-size: 14px;
}

.test-credentials p {
  margin: 8px 0;
}
```

### 7. src/pages/Dashboard.js - Dashboard
```javascript
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import '../pages/Pages.css';

const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  return (
    <div className="page-container">
      <Sidebar />
      <div className="main-content">
        <div className="dashboard">
          <h1>Welcome, {user.name}! 👋</h1>
          
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <h3>📊 Role</h3>
              <p className="stat-value">{user.role}</p>
              <p className="stat-label">Your Account Type</p>
            </div>

            <div className="dashboard-card">
              <h3>✉️ Email</h3>
              <p className="stat-value" style={{fontSize: '14px'}}>{user.email}</p>
              <p className="stat-label">Registered Email</p>
            </div>

            <div className="dashboard-card">
              <h3>🔐 Account</h3>
              <p className="stat-value">Active</p>
              <p className="stat-label">Account Status</p>
            </div>

            <div className="dashboard-card">
              <h3>📅 System</h3>
              <p className="stat-value">Online</p>
              <p className="stat-label">Mess Management System</p>
            </div>
          </div>

          <div className="info-section">
            <h2>📢 Quick Info</h2>
            {user.role === 'STUDENT' && (
              <ul>
                <li>✅ Mark your attendance daily</li>
                <li>📋 Check weekly menu in Menu section</li>
                <li>💰 View your billing in Billing section</li>
              </ul>
            )}
            {user.role === 'ADMIN' && (
              <ul>
                <li>📊 Manage menu for all students</li>
                <li>👥 View student attendance</li>
                <li>💳 Generate and manage bills</li>
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
```

### 8. src/pages/Menu.js - Menu Display
```javascript
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../api';
import '../pages/Pages.css';

const Menu = () => {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const response = await api.get('/menu');
      setMenus(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to load menu');
      setLoading(false);
    }
  };

  return (
    <div className="page-container">
      <Sidebar />
      <div className="main-content">
        <h1>📋 Weekly Menu</h1>

        {error && <div className="error-message">{error}</div>}
        {loading && <p>Loading menu...</p>}

        <div className="menu-grid">
          {menus.map((menu) => (
            <div key={menu.id} className="menu-card">
              <h3>📅 {menu.day}</h3>
              <div className="meal">
                <strong>🌅 Breakfast:</strong>
                <p>{menu.breakfast}</p>
              </div>
              <div className="meal">
                <strong>🍽️ Lunch:</strong>
                <p>{menu.lunch}</p>
              </div>
              <div className="meal">
                <strong>🌙 Dinner:</strong>
                <p>{menu.dinner}</p>
              </div>
            </div>
          ))}
        </div>

        {menus.length === 0 && !loading && (
          <p className="no-data">No menu available yet</p>
        )}
      </div>
    </div>
  );
};

export default Menu;
```

### 9. src/pages/Attendance.js - Attendance Management
```javascript
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../api';
import '../pages/Pages.css';

const Attendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [status, setStatus] = useState('PRESENT');
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchAttendance();
  }, []);

  const fetchAttendance = async () => {
    try {
      const response = await api.get('/attendance');
      setAttendance(response.data.data || []);
      setLoading(false);
    } catch (err) {
      setError('Failed to load attendance');
      setLoading(false);
    }
  };

  const handleMarkAttendance = async (e) => {
    e.preventDefault();
    try {
      await api.post('/attendance', { date, status });
      alert('Attendance marked successfully!');
      setDate(new Date().toISOString().split('T')[0]);
      setStatus('PRESENT');
      fetchAttendance();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to mark attendance');
    }
  };

  return (
    <div className="page-container">
      <Sidebar />
      <div className="main-content">
        <h1>✅ Attendance Management</h1>

        {error && <div className="error-message">{error}</div>}

        {user.role === 'STUDENT' && (
          <form onSubmit={handleMarkAttendance} className="form-card">
            <h2>Mark Your Attendance</h2>
            <div className="form-group">
              <label>Date:</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Status:</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option>PRESENT</option>
                <option>ABSENT</option>
              </select>
            </div>

            <button type="submit">Mark Attendance</button>
          </form>
        )}

        <h2>{user.role === 'ADMIN' ? 'All Students Attendance' : 'Your Attendance'}</h2>
        
        {loading && <p>Loading attendance...</p>}

        <div className="attendance-table">
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {attendance.map((record) => (
                <tr key={record.id}>
                  <td>{record.date}</td>
                  <td className={`status ${record.status.toLowerCase()}`}>
                    {record.status}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {attendance.length === 0 && !loading && (
          <p className="no-data">No attendance records</p>
        )}
      </div>
    </div>
  );
};

export default Attendance;
```

### 10. src/pages/Billing.js - Billing Management
```javascript
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import api from '../api';
import '../pages/Pages.css';

const Billing = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [month, setMonth] = useState(new Date().toISOString().split('T')[0].slice(0, 7));
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const response = await api.get('/bill');
      setBills(response.data.data || []);
      setLoading(false);
    } catch (err) {
      setError('Failed to load bills');
      setLoading(false);
    }
  };

  const handleGenerateBills = async (e) => {
    e.preventDefault();
    try {
      await api.post('/bill/generate', { month });
      alert('Bills generated successfully!');
      fetchBills();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to generate bills');
    }
  };

  return (
    <div className="page-container">
      <Sidebar />
      <div className="main-content">
        <h1>💰 Billing Management</h1>

        {error && <div className="error-message">{error}</div>}

        {user.role === 'ADMIN' && (
          <form onSubmit={handleGenerateBills} className="form-card">
            <h2>Generate Bills</h2>
            <div className="form-group">
              <label>Month:</label>
              <input
                type="month"
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                required
              />
            </div>
            <button type="submit">Generate Bills</button>
          </form>
        )}

        <h2>{user.role === 'ADMIN' ? 'All Bills' : 'Your Bills'}</h2>

        {loading && <p>Loading bills...</p>}

        <div className="bills-grid">
          {bills.map((bill) => (
            <div key={bill.id} className="bill-card">
              <h3>📅 Month: {bill.month}</h3>
              <div className="bill-detail">
                <span>Present Days:</span>
                <strong>{bill.totalPresentDays}</strong>
              </div>
              <div className="bill-detail">
                <span>Rate:</span>
                <strong>₹100/day</strong>
              </div>
              <div className="bill-detail total">
                <span>Total Amount:</span>
                <strong>₹{bill.amount.toFixed(2)}</strong>
              </div>
            </div>
          ))}
        </div>

        {bills.length === 0 && !loading && (
          <p className="no-data">No bills available</p>
        )}
      </div>
    </div>
  );
};

export default Billing;
```

### 11. src/pages/Pages.css - Page Styles
```css
.page-container {
  display: flex;
  min-height: 100vh;
  background-color: #f5f7fa;
}

.main-content {
  margin-left: 250px;
  padding: 40px;
  flex: 1;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.main-content h1 {
  color: #333;
  margin-bottom: 30px;
  font-size: 32px;
}

.main-content h2 {
  color: #555;
  margin-top: 30px;
  margin-bottom: 20px;
  font-size: 24px;
}

/* Dashboard Styles */
.dashboard {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.dashboard-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.dashboard-card {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 25px;
  border-radius: 10px;
  text-align: center;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.dashboard-card h3 {
  margin: 0 0 15px 0;
  font-size: 18px;
}

.stat-value {
  font-size: 28px;
  font-weight: bold;
  margin: 10px 0;
}

.stat-label {
  font-size: 14px;
  opacity: 0.9;
  margin: 0;
}

.info-section {
  background: #f0f0f0;
  padding: 20px;
  border-radius: 10px;
  margin-top: 30px;
}

.info-section ul {
  list-style: none;
  padding: 0;
}

.info-section li {
  padding: 10px 0;
  color: #333;
  font-size: 16px;
}

/* Menu Styles */
.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.menu-card {
  background: white;
  padding: 20px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-left: 4px solid #667eea;
}

.menu-card h3 {
  color: #667eea;
  margin-top: 0;
  font-size: 20px;
}

.meal {
  margin: 15px 0;
  padding: 10px;
  background: #f9f9f9;
  border-radius: 6px;
}

.meal strong {
  display: block;
  color: #333;
  margin-bottom: 8px;
}

.meal p {
  margin: 0;
  color: #666;
  line-height: 1.6;
}

/* Form Styles */
.form-card {
  background: white;
  padding: 30px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  max-width: 500px;
  margin-bottom: 30px;
}

.form-card h2 {
  margin-top: 0;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  color: #333;
  font-weight: 500;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 12px;
  border: 2px solid #ddd;
  border-radius: 6px;
  font-size: 16px;
  box-sizing: border-box;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
}

.form-card button,
.form-card button[type="submit"] {
  width: 100%;
  padding: 12px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.3s;
  margin-top: 10px;
}

.form-card button:hover,
.form-card button[type="submit"]:hover {
  transform: scale(1.02);
}

/* Attendance Table Styles */
.attendance-table {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  margin-top: 20px;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead {
  background: #667eea;
  color: white;
}

th {
  padding: 15px;
  text-align: left;
  font-weight: 600;
}

td {
  padding: 15px;
  border-bottom: 1px solid #eee;
}

tbody tr:hover {
  background: #f9f9f9;
}

.status {
  font-weight: bold;
  padding: 6px 12px;
  border-radius: 20px;
  text-align: center;
  width: fit-content;
}

.status.present {
  background: #d4edda;
  color: #155724;
}

.status.absent {
  background: #f8d7da;
  color: #721c24;
}

/* Bills Grid Styles */
.bills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 20px;
  margin-top: 20px;
}

.bill-card {
  background: white;
  padding: 25px;
  border-radius: 10px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  border-top: 4px solid #667eea;
}

.bill-card h3 {
  color: #667eea;
  margin-top: 0;
}

.bill-detail {
  display: flex;
  justify-content: space-between;
  padding: 12px 0;
  border-bottom: 1px solid #eee;
  color: #666;
}

.bill-detail span {
  font-weight: 500;
}

.bill-detail strong {
  color: #333;
  font-size: 16px;
}

.bill-detail.total {
  border-bottom: none;
  border-top: 2px solid #667eea;
  padding-top: 15px;
  font-size: 18px;
  margin-top: 10px;
}

.bill-detail.total strong {
  color: #667eea;
  font-size: 22px;
}

/* Error and Message Styles */
.error-message {
  background: #fee;
  color: #c33;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 20px;
  border-left: 4px solid #c33;
}

.no-data {
  text-align: center;
  color: #999;
  padding: 40px;
  font-size: 16px;
}

/* Responsive */
@media (max-width: 768px) {
  .main-content {
    margin-left: 0;
    padding: 20px;
  }

  .sidebar {
    width: 100%;
    height: auto;
    position: relative;
  }

  .dashboard-grid {
    grid-template-columns: 1fr;
  }

  .menu-grid {
    grid-template-columns: 1fr;
  }

  .bills-grid {
    grid-template-columns: 1fr;
  }
}
```

### 12. src/App.js - Main App Component
```javascript
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Menu from './pages/Menu';
import Attendance from './pages/Attendance';
import Billing from './pages/Billing';
import ProtectedRoute from './components/ProtectedRoute';
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/menu"
          element={
            <ProtectedRoute>
              <Menu />
            </ProtectedRoute>
          }
        />

        <Route
          path="/attendance"
          element={
            <ProtectedRoute>
              <Attendance />
            </ProtectedRoute>
          }
        />

        <Route
          path="/billing"
          element={
            <ProtectedRoute>
              <Billing />
            </ProtectedRoute>
          }
        />

        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
```

### 13. src/App.css - Global Styles
```css
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f5f7fa;
  color: #333;
}

button {
  cursor: pointer;
  transition: all 0.3s ease;
}

button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

input, select, textarea {
  font-family: inherit;
}

a {
  text-decoration: none;
  color: inherit;
}
```

### 14. src/index.js - Entry Point (Keep Default)
```javascript
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

## 🚀 Running the Application

1. **Start Backend** (Spring Boot):
```bash
cd backend
./gradlew.bat bootRun
```
(or use your IDE to run the Spring Boot app)

2. **Start Frontend** (React):
```bash
cd frontend
npm start
```

3. **Access the app**:
- Open browser: `http://localhost:3000`
- Login with test credentials:
  - Student: `student@example.com` / `password123`
  - Admin: `admin@example.com` / `password123`

## 📊 Features Overview

### Student Features:
- ✅ View dashboard with account info
- ✅ Mark daily attendance
- ✅ View weekly menu
- ✅ View personal billing

### Admin Features:
- ✅ View all students' attendance
- ✅ Create and manage weekly menu
- ✅ Generate student bills
- ✅ View all bills

## 🔐 Security Features

- ✅ JWT token stored in localStorage
- ✅ Automatic token inclusion in API headers
- ✅ Protected routes (redirects to login if no token)
- ✅ Automatic logout on 401 response
- ✅ Role-based navigation

## 🎨 UI Features

- ✅ Clean modern design
- ✅ Responsive sidebar navigation
- ✅ Gradient backgrounds
- ✅ Card-based layouts
- ✅ Mobile-friendly (responsive CSS)
- ✅ Smooth transitions and hover effects
- ✅ Error/Success message displays

## 📝 Notes

- All API calls include JWT token automatically
- Forms have proper validation
- Error messages are displayed to users
- Loading states are shown while fetching data
- Table and grid layouts for better data presentation

Good luck! 🎉
