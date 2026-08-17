# Menu.js - Complete Updated Code

## Overview
This is the complete Menu.js file with enhanced error handling, debugging capabilities, and proper JWT token integration.

## Key Improvements Made:

1. ✅ **Token Validation** - Checks if token exists before making API calls
2. ✅ **Enhanced Error Logging** - Logs detailed error information to browser console
3. ✅ **Better Error Messages** - User-friendly error messages for different HTTP status codes
4. ✅ **CORS Support** - Added `withCredentials: true` for proper CORS handling
5. ✅ **Debugging Info** - Prefixed logs (⚠️, ❌, 📊, ✅) for easy identification in console
6. ✅ **Response Logging** - Logs successful API responses for debugging

## Complete Code

```javascript
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/Menu.css';

function Menu({ user }) {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    day: '',
    breakfast: '',
    lunch: '',
    dinner: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  // 🔥 Fetch all menus on component mount
  useEffect(() => {
    fetchMenus();
  }, []);

  // 📡 Get all menus from backend
  const fetchMenus = async () => {
    try {
      setLoading(true);
      setError('');
      const token = localStorage.getItem('token');

      // 🔍 Debug: Log token info
      if (!token) {
        console.warn('⚠️ No token found in localStorage');
        setError('No authentication token found. Please login again.');
        setLoading(false);
        return;
      }

      console.log('📊 Fetching menus with token:', token.substring(0, 20) + '...');

      const response = await axios.get('http://localhost:8080/api/menu', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      console.log('✅ Menus fetched successfully:', response.data);
      setMenus(response.data || []);
    } catch (err) {
      console.error('❌ Error fetching menus:', err);
      
      // 🔍 Enhanced error logging
      if (err.response) {
        console.error('📊 Response Status:', err.response.status);
        console.error('📊 Response Data:', err.response.data);
        console.error('📊 Response Headers:', err.response.headers);
        
        if (err.response.status === 401) {
          setError('Unauthorized: Invalid or expired token. Please login again.');
        } else if (err.response.status === 403) {
          setError('Forbidden: You do not have permission to access menus.');
        } else if (err.response.status === 404) {
          setError('Menu endpoint not found. Backend may be unavailable.');
        } else {
          setError(`Error: ${err.response.data?.message || 'Failed to load menus'}`);
        }
      } else if (err.request) {
        console.error('📊 Request made but no response received:', err.request);
        setError('No response from server. Make sure backend is running on http://localhost:8080');
      } else {
        console.error('📊 Error setting up request:', err.message);
        setError('Failed to load menus. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ✏️ Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // ➕ Handle adding new menu (Admin only)
  const handleAddMenu = async (e) => {
    e.preventDefault();

    if (!formData.day || !formData.breakfast || !formData.lunch || !formData.dinner) {
      setError('Please fill in all fields');
      return;
    }

    try {
      setSubmitting(true);
      setError('');
      const token = localStorage.getItem('token');

      if (!token) {
        setError('No authentication token found. Please login again.');
        setSubmitting(false);
        return;
      }

      console.log('📤 Adding new menu:', formData);

      const response = await axios.post('http://localhost:8080/api/menu', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        withCredentials: true
      });

      console.log('✅ Menu added successfully:', response.data);

      // ✅ Add new menu to list
      setMenus(prev => [...prev, response.data]);
      
      // 🔄 Reset form
      setFormData({
        day: '',
        breakfast: '',
        lunch: '',
        dinner: ''
      });
      setShowForm(false);
      
      alert('Menu added successfully!');
    } catch (err) {
      console.error('❌ Error adding menu:', err);
      
      // 🔍 Enhanced error logging
      if (err.response?.status === 403) {
        setError('Only admins can add menus.');
      } else if (err.response?.status === 401) {
        setError('Unauthorized: Invalid or expired token. Please login again.');
      } else if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError('Failed to add menu. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // 🏠 Handle back to dashboard
  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  if (loading) {
    return <div className="menu-container"><div className="loading">Loading menus...</div></div>;
  }

  return (
    <div className="menu-container">
      {/* 🔝 Header */}
      <div className="menu-header">
        <button className="back-btn" onClick={handleBackToDashboard}>← Back to Dashboard</button>
        <h1>📋 Menu Management</h1>
        <p className="user-info">Logged in as: <strong>{user?.name || 'User'}</strong> ({user?.role || 'N/A'})</p>
      </div>

      {/* ❌ Error Message */}
      {error && <div className="error-message">{error}</div>}

      {/* ➕ Add Menu Form (Admin Only) */}
      {user?.role === 'ADMIN' && (
        <div className="add-menu-section">
          <button 
            className="add-btn" 
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? '✕ Cancel' : '+ Add New Menu'}
          </button>

          {showForm && (
            <form className="menu-form" onSubmit={handleAddMenu}>
              <div className="form-group">
                <label htmlFor="day">Day of Week</label>
                <select
                  id="day"
                  name="day"
                  value={formData.day}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select a day</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Sunday">Sunday</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="breakfast">Breakfast</label>
                <input
                  type="text"
                  id="breakfast"
                  name="breakfast"
                  placeholder="e.g., Eggs and Toast"
                  value={formData.breakfast}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="lunch">Lunch</label>
                <input
                  type="text"
                  id="lunch"
                  name="lunch"
                  placeholder="e.g., Rice and Curry"
                  value={formData.lunch}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="dinner">Dinner</label>
                <input
                  type="text"
                  id="dinner"
                  name="dinner"
                  placeholder="e.g., Pasta and Salad"
                  value={formData.dinner}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <button type="submit" className="submit-btn" disabled={submitting}>
                {submitting ? 'Saving...' : 'Save Menu'}
              </button>
            </form>
          )}
        </div>
      )}

      {/* 📋 Menu List */}
      <div className="menus-section">
        <h2>Weekly Menus</h2>
        
        {menus.length === 0 ? (
          <div className="empty-state">
            <p>No menus available yet.</p>
            {user?.role === 'ADMIN' && <p>Click "Add New Menu" to create one.</p>}
          </div>
        ) : (
          <div className="menu-grid">
            {menus.map(menu => (
              <div key={menu.id} className="menu-card">
                <div className="menu-day">{menu.day}</div>
                <div className="menu-details">
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
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default Menu;
```

## 🔑 Key Changes Explained

### 1. Token Validation
```javascript
if (!token) {
  console.warn('⚠️ No token found in localStorage');
  setError('No authentication token found. Please login again.');
  setLoading(false);
  return;
}
```
**Why**: Prevents making API calls without authentication, showing clear error to user.

### 2. Authorization Header Format
```javascript
headers: {
  'Authorization': `Bearer ${token}`,
  'Content-Type': 'application/json'
}
```
**Why**: Spring Security JWT filter expects `Bearer <token>` format.

### 3. CORS Credentials
```javascript
withCredentials: true
```
**Why**: Allows credentials (cookies, authorization headers) to be sent with CORS requests.

### 4. Enhanced Error Handling
```javascript
if (err.response) {
  // Server responded with error status
  if (err.response.status === 401) { /* unauthorized */ }
  else if (err.response.status === 403) { /* forbidden */ }
  else if (err.response.status === 404) { /* not found */ }
} else if (err.request) {
  // Request made but no response (server down)
} else {
  // Error setting up request
}
```
**Why**: Different errors need different solutions (refresh token, check permissions, start server, etc).

### 5. Console Logging
```javascript
console.log('📊 Fetching menus with token:', token.substring(0, 20) + '...');
console.log('✅ Menus fetched successfully:', response.data);
console.error('❌ Error fetching menus:', err);
```
**Why**: Easy debugging - search for emojis in browser console to find relevant logs.

## 🧪 Testing the API

### In Browser Console (F12 → Console)
```javascript
// Check if token exists
console.log(localStorage.getItem('token'));

// Manually test the API call
const token = localStorage.getItem('token');
fetch('http://localhost:8080/api/menu', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(r => r.json())
.then(data => console.log('Menus:', data))
.catch(e => console.error('Error:', e));
```

## 🎯 What to Check if API Fails

1. **Open DevTools**: F12 → Console tab
2. **Look for logs** with prefixes: ⚠️, ❌, 📊, ✅
3. **Check Network tab**: 
   - Method: GET
   - URL: http://localhost:8080/api/menu
   - Status: Should be 200 for success
   - Response: Should show array of menu objects

4. **Verify Backend**:
   - Terminal shows "Started BackendApplication"
   - Visit http://localhost:8080 - should respond (no content expected but no error)

5. **Verify MongoDB**:
   - Check if users collection has your user with correct role
   - Check if menus collection exists (may be empty initially)

## ✅ Success Indicators

- ✅ No console errors
- ✅ Network tab shows Status 200
- ✅ Menu items display on page
- ✅ Menus visible to both ADMIN and STUDENT roles
- ✅ Only ADMIN sees "Add New Menu" button
- ✅ Can successfully add new menus as ADMIN

## 🚨 Common Issues & Solutions

| Error | Cause | Solution |
|-------|-------|----------|
| "No token found" | Not logged in | Login first |
| 401 Unauthorized | Token expired | Logout & login again |
| 403 Forbidden | Wrong role | User needs STUDENT or ADMIN role |
| 404 Not Found | Backend offline | Start backend with `./gradlew bootRun` |
| Connection Refused | Backend port blocked | Check if port 8080 is in use |

---

This file is production-ready with comprehensive error handling and debugging capabilities! 🚀
