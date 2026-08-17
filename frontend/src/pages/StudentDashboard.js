import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/ModernDashboard.css';

function StudentDashboard({ user, setIsAuthenticated, setUser }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [todayDate, setTodayDate] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        const token = localStorage.getItem('token');
        if (!token) {
          setError('Authentication required');
          setLoading(false);
          return;
        }

        const response = await axios.get('http://localhost:8080/api/dashboard/summary', {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        setStats(response.data);
        setTodayDate(new Date().toLocaleDateString('en-US', {
          weekday: 'long',
          month: 'long',
          day: 'numeric',
        }));

        setRecentOrders([
          { id: 1, date: new Date(Date.now() - 86400000).toLocaleDateString(), item: 'Lunch', price: 250, status: 'completed' },
          { id: 2, date: new Date(Date.now() - 172800000).toLocaleDateString(), item: 'Dinner', price: 250, status: 'completed' },
          { id: 3, date: new Date(Date.now() - 259200000).toLocaleDateString(), item: 'Breakfast', price: 150, status: 'completed' },
        ]);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  console.log('StudentDashboard Rendered', { loading, error, stats });

  if (loading) {
    return (
      <div className="dashboard-loading">
        <div className="loading-spinner"></div>
        <p className="loading-text">Loading your dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <div className="error-icon">⚠️</div>
        <h2>Error Loading Dashboard</h2>
        <p>{error}</p>
        <button className="btn btn-primary mt-lg" onClick={() => window.location.reload()}>
          Retry
        </button>
      </div>
    );
  }

  const userName = user?.name || 'Student';
  const totalMeals = stats?.totalMeals || 24;
  const totalAttendance = stats?.totalAttendance || 92;
  const totalFoodWaste = stats?.totalFoodWaste || 2.5;
  const totalStudents = stats?.totalStudents || 145;

  return (
    <div className="dashboard">
      <div className="dashboard-welcome">
        <div className="welcome-header">
          <div className="welcome-content">
            <h1>Welcome back, {userName}! 👋</h1>
            <p>Here's your meal plan overview</p>
          </div>
          <div className="welcome-time">
            <span>📅</span>
            <span>{todayDate}</span>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon">🍽️</div>
          <div className="stat-label">Meals This Month</div>
          <div className="stat-value">{totalMeals}</div>
          <div className="stat-change positive"><span>📈</span><span>+5 from last month</span></div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-label">Attendance Rate</div>
          <div className="stat-value">{totalAttendance}%</div>
          <div className="stat-change positive"><span>📈</span><span>Excellent</span></div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">♻️</div>
          <div className="stat-label">Food Waste (kg)</div>
          <div className="stat-value">{totalFoodWaste}</div>
          <div className="stat-change neutral"><span>📊</span><span>Keep it low!</span></div>
        </div>

        <div className="stat-card">
          <div className="stat-icon">👥</div>
          <div className="stat-label">Total Students</div>
          <div className="stat-value">{totalStudents}</div>
          <div className="stat-change neutral"><span>🏠</span><span>In mess</span></div>
        </div>
      </div>

      <div className="quick-actions">
        <a href="/menu" className="action-btn">
          <span className="action-icon">📋</span><span>View Menu</span>
        </a>
        <a href="/orders" className="action-btn">
          <span className="action-icon">📦</span><span>My Orders</span>
        </a>
        <a href="/attendance" className="action-btn">
          <span className="action-icon">✓</span><span>Attendance</span>
        </a>
        <a href="/extra-food" className="action-btn">
          <span className="action-icon">🍕</span><span>Extra Food</span>
        </a>
      </div>

      {recentOrders.length > 0 && (
        <div className="upcoming-section">
          <h2 className="section-title"><span className="section-icon">📋</span>Recent Orders</h2>
          <div>
            {recentOrders.slice(0, 5).map((order) => (
              <div key={order.id} className="upcoming-item">
                <div className="upcoming-date">
                  <span className="upcoming-date-day">{order.date.split('/')[1]}</span>
                  <span className="upcoming-date-month">Jan</span>
                </div>
                <div className="upcoming-content">
                  <p className="upcoming-title">{order.item}</p>
                  <p className="upcoming-desc">₹{order.price} • {order.status}</p>
                </div>
                <span className="upcoming-badge">Completed</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="recent-activity">
        <h2 className="section-title"><span className="section-icon">💡</span>Quick Tips</h2>
        <div className="activity-item">
          <div className="activity-icon">🎯</div>
          <div className="activity-content">
            <p className="activity-title">Maintain Attendance</p>
            <p className="activity-desc">Keep attendance above 75% for meal access</p>
          </div>
        </div>
        <div className="activity-item">
          <div className="activity-icon">📅</div>
          <div className="activity-content">
            <p className="activity-title">Check Daily Menu</p>
            <p className="activity-desc">New menu updated every morning at 8 AM</p>
          </div>
        </div>
        <div className="activity-item">
          <div className="activity-icon">🌱</div>
          <div className="activity-content">
            <p className="activity-title">Reduce Food Waste</p>
            <p className="activity-desc">Order only what you can eat</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;
