import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../styles/Navbar.css';

function Navbar({ user, onMenuClick }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const userName = user?.name || 'User';
  const userInitial = userName.charAt(0).toUpperCase();

  // Get page title from location
  const getPageTitle = () => {
    const path = location.pathname;
    const titles = {
      '/dashboard': 'Dashboard',
      '/menu': 'Menu',
      '/extra-food': 'Extra Food',
      '/attendance': 'Attendance',
      '/orders': 'My Orders',
      '/admin-orders': 'Orders Management',
      '/feedback': 'Feedback',
      '/admin-feedback': 'Feedback Management',
      '/notifications': 'Notifications',
      '/profile': 'Profile',
      '/settings': 'Settings',
      '/analytics': 'Analytics',
    };
    return titles[path] || 'MessHub';
  };

  const handleProfileClick = () => {
    navigate('/profile');
    setShowUserMenu(false);
  };

  const handleSettingsClick = () => {
    navigate('/settings');
    setShowUserMenu(false);
  };

  const handleNotificationsClick = () => {
    navigate('/notifications');
    setShowUserMenu(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Left: Menu Button */}
        <div className="navbar-left">
          <button className="menu-toggle" onClick={onMenuClick} title="Toggle Menu">
            ☰
          </button>
          <h1 className="page-title">{getPageTitle()}</h1>
        </div>

        {/* Right: Actions */}
        <div className="navbar-right">
          {/* Notifications */}
          <button 
            className="navbar-icon notifications-btn" 
            onClick={handleNotificationsClick}
            title="Notifications"
          >
            🔔
            <span className="notification-badge">3</span>
          </button>

          {/* User Profile Menu */}
          <div className="user-menu">
            <button 
              className="user-profile-btn" 
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="user-avatar">{userInitial}</div>
              <span className="user-name-label">{userName}</span>
              <span className="dropdown-icon">▼</span>
            </button>

            {/* User Dropdown Menu */}
            {showUserMenu && (
              <div className="user-dropdown">
                <div className="dropdown-header">
                  <div className="dropdown-avatar">{userInitial}</div>
                  <div>
                    <p className="dropdown-name">{userName}</p>
                    <p className="dropdown-role">{user?.role || 'Student'}</p>
                  </div>
                </div>

                <div className="dropdown-items">
                  <button className="dropdown-item" onClick={handleProfileClick}>
                    👤 Profile
                  </button>
                  <button className="dropdown-item" onClick={handleSettingsClick}>
                    ⚙️ Settings
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* User Menu Overlay (close on click) */}
      {showUserMenu && (
        <div 
          className="dropdown-overlay" 
          onClick={() => setShowUserMenu(false)}
        ></div>
      )}
    </nav>
  );
}

export default Navbar;
