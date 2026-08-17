import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Loader from '../components/Loader';
import '../styles/AdminDashboard.css';

function AdminDashboard({ user, setIsAuthenticated, setUser }) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dashboardData, setDashboardData] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get token from localStorage
        const token = localStorage.getItem('token');
        console.log('🔐 Token from localStorage:', token ? 'Present' : 'Missing');
        
        // Fetch real data from backend
        const response = await axios.get(
          'http://localhost:8080/api/dashboard/summary',
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            },
            timeout: 10000 // 10 second timeout
          }
        );

        console.log('✅ API Response:', response.status, response.data);

        // Set real data from backend
        if (response.data && response.data.data) {
          setDashboardData(response.data.data);
        } else if (response.data) {
          setDashboardData(response.data);
        } else {
          throw new Error('No data received from server');
        }
        
        setLoading(false);
      } catch (err) {
        console.error('❌ Error fetching dashboard data:', err);
        console.log('📍 Error Status:', err.response?.status);
        console.log('📍 Error Data:', err.response?.data);
        console.log('📍 Error Message:', err.message);
        
        // Fallback to default data if API fails
        console.warn('⚠️ Using fallback data - Backend may be unavailable');
        setDashboardData({
          totalStudents: 245,
          totalOrders: 1840,
          foodPrepared: 589,
          foodWaste: 42,
          revenueThisMonth: 45230,
          ordersThisMonth: 156,
          attendanceRate: 92.5,
          avgRating: 4.5,
          recentOrders: [
            { id: 1, student: 'Rajesh Kumar', items: 'Paneer Pizza, Coke', amount: '₹280', status: 'Delivered', time: '2 mins ago' },
            { id: 2, student: 'Priya Singh', items: 'Samosa, Chai', amount: '₹45', status: 'Preparing', time: '5 mins ago' },
            { id: 3, student: 'Amit Patel', items: 'Biryani, Raita', amount: '₹220', status: 'Pending', time: '8 mins ago' },
            { id: 4, student: 'Neha Sharma', items: 'Dosa, Sambar', amount: '₹120', status: 'Delivered', time: '12 mins ago' },
          ],
          topItems: [
            { name: 'Paneer Pizza', sales: 156, revenue: '₹4,680' },
            { name: 'Biryani', sales: 142, revenue: '₹3,120' },
            { name: 'Samosa', sales: 189, revenue: '₹1,890' },
            { name: 'Chai', sales: 203, revenue: '₹2,030' },
          ]
        });
        
        setError(err.message);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  return (
    <div className="admin-dashboard-page">
      <div className="admin-dashboard">
        {/* Show error message if API fails */}
        {error && (
          <div className="error-banner">
            <p>⚠️ {error}</p>
            <small>Using fallback data. Please ensure the backend server is running.</small>
          </div>
        )}

        {loading ? (
          <div className="dashboard-loading">
            <Loader size="small" text="Loading dashboard..." />
          </div>
        ) : (
          <>
            {/* PAGE HEADER */}
            <div className="dashboard-header-admin">
              <div className="header-content">
                <h1>📊 Admin Dashboard</h1>
                <p>Welcome back! Here's your mess overview</p>
              </div>
              <div className="header-date">
                {new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
              </div>
            </div>

            {/* KEY METRICS */}
            <div className="metrics-grid">
              {/* Students Card */}
              <div className="metric-card" style={{ animationDelay: '0s' }}>
                <div className="card-header">
                  <span className="card-icon">👥</span>
                  <span className="card-badge">Total</span>
                </div>
                <div className="card-body">
                  <p className="card-label">Students</p>
                  <p className="card-value">{dashboardData?.totalStudents || '0'}</p>
                  <p className="card-trend">↑ 12% from last month</p>
                </div>
                <div className="card-accent accent-blue"></div>
              </div>

              {/* Orders Card */}
              <div className="metric-card" style={{ animationDelay: '0.1s' }}>
                <div className="card-header">
                  <span className="card-icon">📦</span>
                  <span className="card-badge">Total</span>
                </div>
                <div className="card-body">
                  <p className="card-label">Orders</p>
                  <p className="card-value">{dashboardData?.totalOrders || '0'}</p>
                  <p className="card-trend">↑ 8% from last month</p>
                </div>
                <div className="card-accent accent-green"></div>
              </div>

              {/* Food Prepared Card */}
              <div className="metric-card" style={{ animationDelay: '0.2s' }}>
                <div className="card-header">
                  <span className="card-icon">🍛</span>
                  <span className="card-badge">Today</span>
                </div>
                <div className="card-body">
                  <p className="card-label">Food Prepared</p>
                  <p className="card-value">{dashboardData?.foodPrepared || '0'}</p>
                  <p className="card-trend">↑ 23 more than yesterday</p>
                </div>
                <div className="card-accent accent-orange"></div>
              </div>

              {/* Food Waste Card */}
              <div className="metric-card" style={{ animationDelay: '0.3s' }}>
                <div className="card-header">
                  <span className="card-icon">❌</span>
                  <span className="card-badge">Today</span>
                </div>
                <div className="card-body">
                  <p className="card-label">Food Waste</p>
                  <p className="card-value">{dashboardData?.foodWaste || '0'} kg</p>
                  <p className="card-trend">↓ 5% improvement</p>
                </div>
                <div className="card-accent accent-red"></div>
              </div>
            </div>

            {/* SECONDARY METRICS */}
            <div className="secondary-metrics">
              {/* Revenue Card */}
              <div className="secondary-card" style={{ animationDelay: '0.4s' }}>
                <div className="card-icon-large">💰</div>
                <p className="card-label">Revenue (This Month)</p>
                <p className="card-value-large">₹{(dashboardData?.revenueThisMonth || 0).toLocaleString()}</p>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${dashboardData?.revenuePercentage || 75}%` }}></div>
                </div>
                <p className="card-subtitle">{dashboardData?.revenuePercentage || 75}% of monthly target</p>
              </div>

              {/* Attendance Card */}
              <div className="secondary-card" style={{ animationDelay: '0.5s' }}>
                <div className="card-icon-large">✅</div>
                <p className="card-label">Attendance Rate</p>
                <p className="card-value-large">{dashboardData?.attendanceRate || 0}%</p>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${dashboardData?.attendanceRate || 0}%` }}></div>
                </div>
                <p className="card-subtitle">Well maintained</p>
              </div>

              {/* Rating Card */}
              <div className="secondary-card" style={{ animationDelay: '0.6s' }}>
                <div className="card-icon-large">⭐</div>
                <p className="card-label">Average Rating</p>
                <p className="card-value-large">{dashboardData?.avgRating || 0}/5</p>
                <div className="rating-stars">
                  {'⭐'.repeat(Math.floor(dashboardData?.avgRating || 0))}
                  {(dashboardData?.avgRating || 0) % 1 !== 0 && '✨'}
                </div>
                <p className="card-subtitle">From {dashboardData?.totalOrders || 0} reviews</p>
              </div>
            </div>

            {/* BOTTOM SECTION - TWO COLUMNS */}
            <div className="dashboard-bottom">
              {/* RECENT ORDERS */}
              <div className="dashboard-section">
                <div className="section-header">
                  <h2>📦 Recent Orders</h2>
                  <Link to="/admin-orders" className="view-all">View All →</Link>
                </div>

                <div className="orders-list">
                  {dashboardData?.recentOrders && dashboardData.recentOrders.length > 0 ? (
                    dashboardData.recentOrders.map((order, index) => (
                      <div key={order.id} className="order-item" style={{ animationDelay: `${0.7 + index * 0.05}s` }}>
                        <div className="order-info">
                          <p className="order-student">{order.student}</p>
                          <p className="order-items">{order.items}</p>
                        </div>

                        <div className="order-details">
                          <span className="order-amount">{order.amount}</span>
                          <span className={`order-status status-${order.status.toLowerCase()}`}>
                            {order.status}
                          </span>
                          <span className="order-time">{order.time}</span>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="no-data">No recent orders</p>
                  )}
                </div>
              </div>

              {/* TOP SELLING ITEMS */}
              <div className="dashboard-section">
                <div className="section-header">
                  <h2>🔥 Top Selling Items</h2>
                  <Link to="/menu" className="view-all">Manage →</Link>
                </div>

                <div className="items-list">
                  {dashboardData?.topItems && dashboardData.topItems.length > 0 ? (
                    dashboardData.topItems.map((item, index) => (
                      <div key={index} className="item-row" style={{ animationDelay: `${0.7 + index * 0.05}s` }}>
                        <div className="item-rank">#{index + 1}</div>
                        <div className="item-info">
                          <p className="item-name">{item.name}</p>
                          <p className="item-sales">{item.sales} sales</p>
                        </div>
                        <div className="item-revenue">{item.revenue}</div>
                      </div>
                    ))
                  ) : (
                    <p className="no-data">No items data available</p>
                  )}
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default AdminDashboard;
