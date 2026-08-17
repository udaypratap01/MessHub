import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Loader from '../components/Loader';
import '../styles/ModernMenu.css';

function Menu({ user, setIsAuthenticated, setUser }) {
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

  useEffect(() => {
    fetchMenus();
  }, []);

  // 🔥 GLOBAL TOKEN SET (VERY IMPORTANT)
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
  }, []);

  // 🔹 FETCH MENUS
  const fetchMenus = async () => {
    try {
      setLoading(true);
      setError('');

      const res = await axios.get('http://localhost:8080/api/menu');

      setMenus(res.data || []);

    } catch (err) {
      console.log(err);

      // ✅ Extract message string from error response
      const errorMessage = typeof err.response?.data === 'object' 
        ? err.response?.data?.message 
        : err.response?.data;

      if (err.response?.status === 401) {
        setError('Unauthorized - Login again');
      } else if (err.response?.status === 403) {
        setError('Access denied');
      } else {
        setError(errorMessage || 'Failed to load menus');
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔹 INPUT CHANGE
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 🔹 ADD MENU (ADMIN ONLY)
  const handleAddMenu = async (e) => {
    e.preventDefault();
    setError('');

    if (!formData.day || !formData.breakfast || !formData.lunch || !formData.dinner) {
      setError('All fields are required');
      return;
    }

    try {
      setSubmitting(true);

      const res = await axios.post(
        'http://localhost:8080/api/menu',
        formData
      );

      setMenus(prev => [...prev, res.data]);

      setFormData({
        day: '',
        breakfast: '',
        lunch: '',
        dinner: ''
      });

      setShowForm(false);
      alert('Menu added successfully!');

    } catch (err) {
      // ✅ Extract message string from error response
      const errorMessage = typeof err.response?.data === 'object' 
        ? err.response?.data?.message 
        : err.response?.data;

      if (err.response?.status === 403) {
        setError('Only ADMIN can add menu');
      } else {
        setError(errorMessage || 'Failed to add menu');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // 🔹 DELETE MENU (ADMIN ONLY)
  const handleDeleteMenu = async (menu) => {
    // ✅ Extract ID with fallback
    const id = menu._id || menu.id;

    // ✅ Validation
    if (!id) {
      setError('Error: Menu ID is missing');
      console.error('❌ Menu ID is missing:', menu);
      return;
    }

    if (!window.confirm('Are you sure you want to delete this menu?')) {
      return;
    }

    try {
      setError('');
      console.log('🔥 Deleting menu ID:', id);
      console.log('🔥 Full menu object:', menu);

      const response = await axios.delete(
        `http://localhost:8080/api/menu/${id}`
      );

      console.log('✅ Delete response:', response.data);

      // ✅ Update state - remove deleted menu
      setMenus(prev => prev.filter(m => (m._id || m.id) !== id));

      alert('Menu deleted successfully!');

    } catch (err) {
      console.error('❌ Delete error response:', err.response?.data);
      console.error('❌ Delete error status:', err.response?.status);
      console.error('❌ Delete error message:', err.message);
      
      // ✅ Extract message string from error response
      const errorMessage = typeof err.response?.data === 'object' 
        ? err.response?.data?.message 
        : err.response?.data;

      if (err.response?.status === 403) {
        setError('Only ADMIN can delete menu');
      } else if (err.response?.status === 404) {
        setError(errorMessage || 'Menu not found');
      } else if (err.response?.status === 400) {
        setError(errorMessage || 'Invalid menu ID');
      } else if (err.response?.status === 500) {
        setError('Server error: ' + (errorMessage || 'Unknown error'));
      } else {
        setError(errorMessage || 'Failed to delete menu');
      }
    }
  };

  // 🔹 LOADING
  if (loading) {
    return <Loader fullPage={true} size="medium" text="Loading menu..." />;
  }

  return (
    <div className="menu-page">
      {/* HEADER */}
        <div className="menu-page-header">
          <div className="header-content">
            <h1>📋 Weekly Menu</h1>
            <p>Plan your meals for the week</p>
          </div>
        </div>

        {/* ERROR MESSAGE */}
        {error && (
          <div className="error-banner">
            <span>⚠️ {error}</span>
            <button onClick={() => setError('')}>×</button>
          </div>
        )}

        {/* ✅ ADMIN ONLY - ADD MENU FORM */}
        {user?.role === 'ADMIN' && (
          <div className="admin-section">
            <button className="add-menu-btn" onClick={() => setShowForm(!showForm)}>
              {showForm ? '✕ Cancel' : '+ Add Menu Item'}
            </button>

            {showForm && (
              <form className="menu-form" onSubmit={handleAddMenu}>
                <div className="form-group">
                  <label>Select Day</label>
                  <select name="day" value={formData.day} onChange={handleInputChange} required>
                    <option value="">Choose a day...</option>
                    <option>Monday</option>
                    <option>Tuesday</option>
                    <option>Wednesday</option>
                    <option>Thursday</option>
                    <option>Friday</option>
                    <option>Saturday</option>
                    <option>Sunday</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>🍳 Breakfast</label>
                  <input
                    name="breakfast"
                    placeholder="e.g., Idli, Sambar, Chutney"
                    value={formData.breakfast}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>🍛 Lunch</label>
                  <input
                    name="lunch"
                    placeholder="e.g., Rice, Dal, Curry, Vegetables"
                    value={formData.lunch}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>🍽️ Dinner</label>
                  <input
                    name="dinner"
                    placeholder="e.g., Roti, Sabzi, Raita"
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

        {/* MENU LIST */}
        <div className="menu-grid">
          {menus.length === 0 ? (
            <div className="empty-state">
              <p>📭 No menus available yet</p>
              {user?.role === 'ADMIN' && <p>Create one to get started!</p>}
            </div>
          ) : (
            menus.map((menu, index) => (
              <div key={menu._id} className="menu-day-card" style={{ animationDelay: `${index * 0.1}s` }}>
                <div className="day-badge">{menu.day}</div>

                <div className="meal-item">
                  <span className="meal-icon">🍳</span>
                  <div className="meal-content">
                    <p className="meal-label">Breakfast</p>
                    <p className="meal-name">{menu.breakfast}</p>
                  </div>
                </div>

                <div className="meal-item">
                  <span className="meal-icon">🍛</span>
                  <div className="meal-content">
                    <p className="meal-label">Lunch</p>
                    <p className="meal-name">{menu.lunch}</p>
                  </div>
                </div>

                <div className="meal-item">
                  <span className="meal-icon">🍽️</span>
                  <div className="meal-content">
                    <p className="meal-label">Dinner</p>
                    <p className="meal-name">{menu.dinner}</p>
                  </div>
                </div>

                {/* 🔐 DELETE BUTTON - ADMIN ONLY */}
                {user?.role === 'ADMIN' && (
                  <button
                    className="delete-menu-btn"
                    onClick={() => handleDeleteMenu(menu)}
                    title="Delete menu"
                  >
                    🗑️
                  </button>
                )}
              </div>
            ))
          )}
        </div>
    </div>
  );
}

export default Menu;