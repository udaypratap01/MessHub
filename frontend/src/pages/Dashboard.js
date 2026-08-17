import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Card from '../components/Card';
import StudentDashboard from './StudentDashboard';
import AdminDashboard from './AdminDashboard';
import Loader from '../components/Loader';
import '../styles/Dashboard.css';

function Dashboard({ setIsAuthenticated, setUser, user }) {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError(err.response?.data?.message || 'Failed to load dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const currentUser = user || JSON.parse(localStorage.getItem('user') || '{}');
  const userName = currentUser?.name || currentUser?.email || 'Dashboard User';
  const userRole = currentUser?.role || 'STUDENT';
  const isAdmin = userRole === 'ADMIN';

  // Route students to modern StudentDashboard
  if (userRole === 'STUDENT') {
    return <StudentDashboard user={user} setIsAuthenticated={setIsAuthenticated} setUser={setUser} />;
  }

  // Route admins to modern AdminDashboard
  if (userRole === 'ADMIN') {
    return <AdminDashboard user={user} setIsAuthenticated={setIsAuthenticated} setUser={setUser} />;
  }

  if (loading) {
    return <Loader fullPage={true} text="Loading dashboard..." />;
  }

  if (error) {
    return (
      <div className="dashboard-error">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h2>Error Loading Dashboard</h2>
          <p>{error}</p>
          <button 
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="dashboard-error">
        <div className="error-container">
          <div className="error-icon">📊</div>
          <h2>No Data Available</h2>
          <p>Dashboard data could not be loaded. Please try again later.</p>
          <button 
            className="btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Refresh
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-container">
        {/* Header Section */}
        <div className="dashboard-header fade-in">
          <h1>Welcome back, {userName}! 👋</h1>
          <p>Here's what's happening in your mess today</p>
        </div>

        {/* Key Metrics */}
        <div className="dashboard-section slide-in-up">
          <h2 className="section-title">📊 Key Metrics</h2>
          <div className="card-grid">
            <Card
              icon="🍽️"
              title="Total Meals"
              value={stats.totalMeals || 0}
              color="blue"
              trend="up"
              trendValue={stats.mealTrend || '0%'}
              onClick={() => navigate('/menu')}
            />
            <Card
              icon="♻️"
              title="Food Waste"
              value={`${stats.foodWaste || 0}%`}
              color="orange"
              trend="down"
              trendValue={stats.wasteTrend || '0%'}
            />
            <Card
              icon="📦"
              title="Total Orders"
              value={stats.totalOrders || 0}
              color="green"
              trend="up"
              trendValue={stats.orderTrend || '0%'}
              onClick={() => isAdmin ? navigate('/admin-orders') : navigate('/bill')}
            />
            <Card
              icon="✅"
              title="Attendance"
              value={`${stats.attendanceRate || 0}%`}
              color="purple"
              trend="up"
              trendValue={stats.attendanceTrend || '0%'}
              onClick={() => navigate('/attendance')}
            />
          </div>
        </div>

        {/* Quick Access Cards */}
        <div className="dashboard-section slide-in-up" style={{ animationDelay: '0.1s' }}>
          <h2 className="section-title">🚀 Quick Access</h2>
          <div className="card-grid">
            <div 
              className="quick-access-card"
              onClick={() => navigate('/menu')}
              style={{ cursor: 'pointer' }}
            >
              <div className="qa-icon">📋</div>
              <h3>Menu</h3>
              <p>View weekly menu items</p>
            </div>

            <div 
              className="quick-access-card"
              onClick={() => navigate('/extra-food')}
              style={{ cursor: 'pointer' }}
            >
              <div className="qa-icon">🍕</div>
              <h3>Extra Food</h3>
              <p>Order additional items</p>
            </div>

            <div 
              className="quick-access-card"
              onClick={() => navigate('/attendance')}
              style={{ cursor: 'pointer' }}
            >
              <div className="qa-icon">📍</div>
              <h3>Attendance</h3>
              <p>Mark your attendance</p>
            </div>

            <div 
              className="quick-access-card"
              onClick={() => navigate('/feedback')}
              style={{ cursor: 'pointer' }}
            >
              <div className="qa-icon">💬</div>
              <h3>Feedback</h3>
              <p>Share your reviews</p>
            </div>

            {isAdmin && (
              <>
                <div 
                  className="quick-access-card"
                  onClick={() => navigate('/admin-orders')}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="qa-icon">📊</div>
                  <h3>All Orders</h3>
                  <p>Monitor all orders</p>
                </div>

                <div 
                  className="quick-access-card"
                  onClick={() => navigate('/analytics')}
                  style={{ cursor: 'pointer' }}
                >
                  <div className="qa-icon">📈</div>
                  <h3>Analytics</h3>
                  <p>View food analytics</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Admin Section */}
        {isAdmin && (
          <div className="dashboard-section slide-in-up" style={{ animationDelay: '0.2s' }}>
            <h2 className="section-title">👨‍💼 Admin Dashboard</h2>
            <div className="admin-stats">
              <div className="admin-stat-item">
                <div className="stat-icon">👥</div>
                <div className="stat-info">
                  <p className="stat-label">Total Users</p>
                  <p className="stat-value">{stats.totalUsers || 0}</p>
                </div>
              </div>
              <div className="admin-stat-item">
                <div className="stat-icon">💰</div>
                <div className="stat-info">
                  <p className="stat-label">Monthly Revenue</p>
                  <p className="stat-value">₹45,000</p>
                </div>
              </div>
              <div className="admin-stat-item">
                <div className="stat-icon">🍽️</div>
                <div className="stat-info">
                  <p className="stat-label">Meals Served</p>
                  <p className="stat-value">2,450</p>
                </div>
              </div>
              <div className="admin-stat-item">
                <div className="stat-icon">⭐</div>
                <div className="stat-info">
                  <p className="stat-label">Avg. Rating</p>
                  <p className="stat-value">4.5/5</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;