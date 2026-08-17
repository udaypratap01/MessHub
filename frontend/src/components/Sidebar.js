import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/StudentSidebar.css';

function Sidebar({ user, setIsAuthenticated, setUser }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  // Determine user role
  const userRole = user?.role || 'STUDENT';
  const isAdmin = userRole === 'ADMIN';

  // Menu items for different roles
  const adminMenu = [
    { label: 'Dashboard', icon: '📊', path: '/dashboard' },
    { label: 'Menu Management', icon: '📋', path: '/menu' },
    { label: 'Extra Food', icon: '🍕', path: '/extra-food' },
    { label: 'Orders', icon: '📦', path: '/admin-orders' },
    { label: 'Attendance', icon: '👥', path: '/attendance' },
    { label: 'Feedback', icon: '⭐', path: '/admin-feedback' },
    { label: 'Notifications', icon: '🔔', path: '/notifications' },
    { label: 'Analytics', icon: '📈', path: '/analytics-dashboard' },
  ];

  const studentMenu = [
    { label: 'Dashboard', icon: '📊', path: '/dashboard' },
    { label: 'Menu', icon: '📋', path: '/menu' },
    { label: 'Extra Food', icon: '🍕', path: '/extra-food' },
    { label: 'Attendance', icon: '✓', path: '/attendance' },
    { label: 'My Orders', icon: '📦', path: '/orders' },
    { label: 'Feedback', icon: '⭐', path: '/feedback' },
    { label: 'Notifications', icon: '🔔', path: '/notifications' },
    { label: 'Profile', icon: '👤', path: '/profile' },
  ];

  const menuItems = isAdmin ? adminMenu : studentMenu;

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    setUser(null);
    setIsMobileOpen(false);
    navigate('/');
  };

  const handleNavClick = (path) => {
    navigate(path);
    setIsMobileOpen(false); // Close mobile menu after click
  };
  return (
    <>
      {/* Mobile Menu Toggle Button - Only visible on mobile */}
      <button className="mobile-menu-toggle" onClick={() => setIsMobileOpen(!isMobileOpen)}>
        {isMobileOpen ? '✕' : '☰'}
      </button>

      {/* Mobile Overlay - Click to close menu */}
      {isMobileOpen && (
        <div className="sidebar-overlay" onClick={() => setIsMobileOpen(false)}></div>
      )}

      {/* Sidebar */}
      <aside className={`student-sidebar ${isMobileOpen ? 'mobile-open' : ''}`}>
        {/* Logo Section */}
        <div className="sidebar-header">
          <div className="logo-container">
            <div className="logo-icon">🍽️</div>
            <div className="logo-text">MessHub</div>
          </div>
          {/* Close button for mobile */}
          <button 
            className="sidebar-close-mobile"
            onClick={() => setIsMobileOpen(false)}
          >
            ✕
          </button>
        </div>

        {/* Role Badge */}
        <div className="sidebar-role-section">
          <span className={`role-badge ${isAdmin ? 'admin' : 'student'}`}>
            {isAdmin ? '👨‍💼 ADMIN' : '👨‍🎓 STUDENT'}
          </span>
          {user?.name && <p className="user-name">{user.name}</p>}
        </div>

        {/* Menu Items */}
        <nav className="sidebar-menu">
          {menuItems.map((item, index) => (
            <button
              key={item.path}
              className={`menu-item ${isActive(item.path)}`}
              onClick={() => handleNavClick(item.path)}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <span className="menu-icon">{item.icon}</span>
              <span className="menu-label">{item.label}</span>
              {isActive(item.path) && <div className="active-indicator"></div>}
            </button>
          ))}
        </nav>

        {/* Settings & Logout */}
        <div className="sidebar-footer">
          <button
            className="footer-item settings-btn"
            onClick={() => handleNavClick('/settings')}
          >
            <span className="menu-icon">⚙️</span>
            <span className="menu-label">Settings</span>
          </button>

          <button
            className="footer-item logout-btn"
            onClick={handleLogout}
          >
            <span className="menu-icon">🚪</span>
            <span className="menu-label">Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default Sidebar;
