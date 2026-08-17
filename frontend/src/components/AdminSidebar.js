import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/AdminSidebar.css';

function AdminSidebar({ user, setIsAuthenticated, setUser }) {
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: '📊', label: 'Dashboard', path: '/dashboard' },
    { icon: '🍽️', label: 'Menu', path: '/menu' },
    { icon: '🍕', label: 'Extra Food', path: '/extra-food' },
    { icon: '📦', label: 'Orders', path: '/orders' },
    { icon: '👥', label: 'Attendance', path: '/attendance' },
    { icon: '💬', label: 'Feedback', path: '/feedback' },
    { icon: '🔔', label: 'Notifications', path: '/notifications' },
    { icon: '👤', label: 'Users', path: '/users' },
    { icon: '⚙️', label: 'Settings', path: '/settings' }
  ];

  const handleNavClick = (path) => {
    navigate(path);
    setIsMobileOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <>
      {/* Mobile Menu Toggle */}
      <button className="mobile-menu-toggle" onClick={() => setIsMobileOpen(!isMobileOpen)}>
        {isMobileOpen ? '✕' : '☰'}
      </button>

      {/* Sidebar Overlay (Mobile) */}
      {isMobileOpen && (
        <div className="sidebar-overlay" onClick={() => setIsMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`admin-sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
        {/* Header */}
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">🍽️</span>
            <span className="logo-text">MessHub</span>
          </div>
          <span className="admin-badge">ADMIN</span>
        </div>

        {/* Menu Items */}
        <nav className="sidebar-menu">
          {menuItems.map((item, index) => (
            <button
              key={item.path}
              className={`menu-item ${isActive(item.path) ? 'active' : ''}`}
              onClick={() => handleNavClick(item.path)}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-label">{item.label}</span>
              {isActive(item.path) && <div className="active-indicator" />}
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">{user?.name?.charAt(0).toUpperCase() || 'A'}</div>
            <div className="user-details">
              <p className="user-name">{user?.name || 'Admin'}</p>
              <p className="user-role">Administrator</p>
            </div>
          </div>

          <button className="settings-btn" title="Settings">
            ⚙️
          </button>

          <button className="logout-btn" onClick={handleLogout}>
            🚪 Logout
          </button>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;
