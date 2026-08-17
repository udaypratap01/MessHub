# Menu Management - Complete Code Reference

## 📋 Backend Code

### Menu.java - Data Model

```java
package com.messhub.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Menu - MongoDB document for storing daily meal information
 * Contains breakfast, lunch, and dinner details for each day
 */
@Document(collection = "menus")
public class Menu {

	@Id
	private String id;
	private String day;
	private String breakfast;
	private String lunch;
	private String dinner;

	// Constructors
	public Menu() {
	}

	public Menu(String day, String breakfast, String lunch, String dinner) {
		this.day = day;
		this.breakfast = breakfast;
		this.lunch = lunch;
		this.dinner = dinner;
	}

	// Getters and Setters
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getDay() {
		return day;
	}

	public void setDay(String day) {
		this.day = day;
	}

	public String getBreakfast() {
		return breakfast;
	}

	public void setBreakfast(String breakfast) {
		this.breakfast = breakfast;
	}

	public String getLunch() {
		return lunch;
	}

	public void setLunch(String lunch) {
		this.lunch = lunch;
	}

	public String getDinner() {
		return dinner;
	}

	public void setDinner(String dinner) {
		this.dinner = dinner;
	}

	@Override
	public String toString() {
		return "Menu{" +
				"id='" + id + '\'' +
				", day='" + day + '\'' +
				", breakfast='" + breakfast + '\'' +
				", lunch='" + lunch + '\'' +
				", dinner='" + dinner + '\'' +
				'}';
	}
}
```

---

### MenuRepository.java - Data Access Layer

```java
package com.messhub.backend.repository;

import com.messhub.backend.model.Menu;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * MenuRepository - MongoDB repository for Menu operations
 * Extends MongoRepository to provide CRUD operations
 */
@Repository
public interface MenuRepository extends MongoRepository<Menu, String> {
	// MongoRepository provides CRUD operations by default
	// Custom queries can be added here if needed
	
	// Example custom methods (if needed):
	// List<Menu> findByDay(String day);
	// List<Menu> findByDayContaining(String dayPattern);
}
```

---

### MenuController.java - REST API Controller

```java
package com.messhub.backend.controller;

import com.messhub.backend.model.Menu;
import com.messhub.backend.repository.MenuRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * MenuController - REST API controller for Menu operations
 * Provides endpoints for managing daily menu items with role-based access control
 * 
 * Access Control:
 * - POST /api/menu → Only ADMIN role
 * - GET /api/menu → ADMIN and STUDENT roles
 * 
 * All endpoints require valid JWT token
 */
@RestController
@RequestMapping("/api/menu")
public class MenuController {

	@Autowired
	private MenuRepository menuRepository;

	/**
	 * Add a new menu item
	 * POST /api/menu
	 * 🔐 Only ADMIN can access (requires ROLE_ADMIN)
	 * 
	 * @param menu Menu object to save
	 * @return Saved menu with generated ID and HTTP 201 CREATED
	 */
	@PostMapping
	public ResponseEntity<Menu> addMenu(@RequestBody Menu menu) {
		// ✅ Validate menu input
		if (menu == null) {
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		
		// ✅ Save menu to MongoDB
		Menu savedMenu = menuRepository.save(menu);
		return new ResponseEntity<>(savedMenu, HttpStatus.CREATED);
	}

	/**
	 * Get all menu items
	 * GET /api/menu
	 * 🔐 ADMIN and STUDENT can access (requires ROLE_ADMIN or ROLE_STUDENT)
	 * 
	 * @return List of all menu items and HTTP 200 OK
	 */
	@GetMapping
	public ResponseEntity<List<Menu>> getAllMenus() {
		List<Menu> menus = menuRepository.findAll();
		return new ResponseEntity<>(menus, HttpStatus.OK);
	}
}
```

---

## 🎨 Frontend Code

### Menu.js - React Component

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

      const response = await axios.get('http://localhost:8080/api/menu', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      setMenus(response.data || []);
    } catch (err) {
      console.error('Error fetching menus:', err);
      setError('Failed to load menus. Please try again.');
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

      const response = await axios.post('http://localhost:8080/api/menu', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

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
      console.error('Error adding menu:', err);
      
      if (err.response?.status === 403) {
        setError('Only admins can add menus.');
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

---

### Menu.css - Styling

```css
/* 🎨 Menu Page Styling */

.menu-container {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

/* 🔝 Header Section */
.menu-header {
  background: white;
  border-radius: 12px;
  padding: 30px;
  margin-bottom: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
  position: relative;
}

.back-btn {
  position: absolute;
  top: 20px;
  left: 20px;
  background: #667eea;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
}

.back-btn:hover {
  background: #764ba2;
  transform: translateX(-5px);
}

.menu-header h1 {
  color: #333;
  margin: 0 0 10px 0;
  font-size: 32px;
  text-align: center;
}

.user-info {
  color: #666;
  text-align: center;
  margin: 0;
  font-size: 14px;
}

/* ❌ Error Message */
.error-message {
  background: #fee;
  color: #c33;
  border-left: 4px solid #c33;
  padding: 15px;
  border-radius: 6px;
  margin-bottom: 20px;
  animation: slideIn 0.3s ease;
}

/* ➕ Add Menu Section */
.add-menu-section {
  background: white;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.add-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.3s ease;
  display: block;
  margin-bottom: 20px;
}

.add-btn:hover {
  background: #764ba2;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.add-btn:active {
  transform: translateY(0);
}

/* 📋 Menu Form */
.menu-form {
  background: #f9f9f9;
  padding: 20px;
  border-radius: 8px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-group label {
  color: #333;
  font-weight: 600;
  margin-bottom: 8px;
  font-size: 14px;
}

.form-group input,
.form-group select {
  padding: 12px;
  border: 2px solid #e0e0e0;
  border-radius: 6px;
  font-size: 14px;
  transition: border-color 0.3s ease;
  font-family: inherit;
}

.form-group input:focus,
.form-group select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 8px rgba(102, 126, 234, 0.2);
}

.submit-btn {
  background: #667eea;
  color: white;
  border: none;
  padding: 12px 25px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  grid-column: 1 / -1;
  transition: all 0.3s ease;
}

.submit-btn:hover:not(:disabled) {
  background: #764ba2;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* 📋 Menus Section */
.menus-section {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
}

.menus-section h2 {
  color: #333;
  margin-top: 0;
  margin-bottom: 25px;
  font-size: 24px;
  border-bottom: 2px solid #667eea;
  padding-bottom: 10px;
}

/* 📚 Menu Grid */
.menu-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

/* 🎴 Menu Card */
.menu-card {
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
  border: 2px solid transparent;
}

.menu-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.15);
  border-color: #667eea;
}

.menu-day {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
  padding: 15px;
  font-size: 18px;
  font-weight: 700;
  text-align: center;
}

.menu-details {
  padding: 20px;
}

.meal {
  margin-bottom: 15px;
}

.meal:last-child {
  margin-bottom: 0;
}

.meal strong {
  color: #333;
  font-size: 14px;
  display: block;
  margin-bottom: 5px;
}

.meal p {
  color: #555;
  margin: 0;
  padding: 8px;
  background: white;
  border-radius: 6px;
  border-left: 3px solid #667eea;
  font-size: 14px;
}

/* 📭 Empty State */
.empty-state {
  text-align: center;
  padding: 40px 20px;
  color: #999;
}

.empty-state p {
  font-size: 16px;
  margin: 10px 0;
}

/* ⏳ Loading State */
.loading {
  text-align: center;
  padding: 40px;
  color: white;
  font-size: 18px;
  font-weight: 600;
}

/* 📱 Responsive Design */
@media (max-width: 768px) {
  .menu-container {
    padding: 10px;
  }

  .menu-header {
    padding: 20px;
  }

  .menu-header h1 {
    font-size: 24px;
    margin-top: 40px;
  }

  .back-btn {
    width: calc(100% - 40px);
    position: static;
    margin-bottom: 15px;
  }

  .menu-form {
    grid-template-columns: 1fr;
  }

  .menu-grid {
    grid-template-columns: 1fr;
  }

  .menus-section {
    padding: 20px;
  }
}

/* ✨ Animations */
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

---

## 🔧 Integration Points

### App.js Routes

```javascript
import Menu from './pages/Menu';

// Inside Routes component:
<Route
  path="/menu"
  element={
    <ProtectedRoute isAuthenticated={isAuthenticated}>
      <Menu user={user} />
    </ProtectedRoute>
  }
/>
```

### SecurityConfig.java Rules

```java
.requestMatchers("GET", "/api/menu").hasAnyRole("ADMIN", "STUDENT")
.requestMatchers("POST", "/api/menu").hasRole("ADMIN")
```

---

## 📊 Data Flow Diagram

```
User Login
    ↓
Store JWT Token in localStorage
    ↓
Navigate to /menu
    ↓
ProtectedRoute checks token
    ↓
Menu.js component renders
    ↓
useEffect calls fetchMenus()
    ↓
axios GET /api/menu with Bearer token
    ↓
Spring Security validates token
    ↓
SecurityConfig checks hasAnyRole("ADMIN", "STUDENT")
    ↓
MenuController.getAllMenus() executes
    ↓
MenuRepository.findAll() queries MongoDB
    ↓
Return menu list to React
    ↓
Display menus in grid layout

Admin Adding Menu:
    ↓
Click "+ Add New Menu"
    ↓
Fill form and submit
    ↓
axios POST /api/menu with Bearer token
    ↓
Spring Security validates token
    ↓
SecurityConfig checks hasRole("ADMIN")
    ↓
MenuController.addMenu() executes
    ↓
MenuRepository.save() saves to MongoDB
    ↓
Return saved menu to React
    ↓
Update menus list in component state
    ↓
Show success message
```

---

**Version**: 1.0 | **Status**: Production Ready | **Last Updated**: December 2024
