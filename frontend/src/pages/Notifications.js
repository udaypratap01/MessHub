import { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Notifications.css';
import { useNavigate } from 'react-router-dom';

function Notifications({ user }) {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ title: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const userRole = user?.role || 'STUDENT';
  const isAdmin = userRole === 'ADMIN';

  // Fetch notifications on component mount
  useEffect(() => {
    console.log("Notifications component loaded");
    fetchNotifications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch all notifications
  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Authentication token not found. Please login again.');
        navigate('/');
        return;
      }

      console.log("Fetching notifications...");
      const response = await axios.get('http://localhost:8080/api/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      console.log("Notifications fetched:", response.data);
      setNotifications(response.data.data || []);
      setError('');
    } catch (err) {
      console.error("Error fetching notifications:", err);

      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
        navigate('/');
      } else if (err.response?.status === 403) {
        setError('You do not have permission to view notifications.');
      } else {
        setError(err.response?.data?.message || 'Failed to fetch notifications');
      }
    } finally {
      setLoading(false);
    }
  };

  // Handle form input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Submit new notification
  const handleSubmitNotification = async (e) => {
    e.preventDefault();
    console.log("Submitting notification:", formData);

    if (!formData.title.trim() || !formData.message.trim()) {
      alert('Please fill in both title and message');
      return;
    }

    try {
      setSubmitting(true);
      const token = localStorage.getItem('token');

      if (!token) {
        setError('Authentication token not found. Please login again.');
        navigate('/');
        return;
      }

      const response = await axios.post(
        'http://localhost:8080/api/notifications',
        {
          title: formData.title.trim(),
          message: formData.message.trim(),
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log("Notification created:", response.data);
      alert('Notification posted successfully!');
      setFormData({ title: '', message: '' });
      setShowForm(false);
      fetchNotifications(); // Refresh list

    } catch (err) {
      console.error("Error creating notification:", err);

      if (err.response?.status === 401) {
        setError('Session expired. Please login again.');
        navigate('/');
      } else if (err.response?.status === 403) {
        setError('Only admins can create notifications.');
      } else {
        setError(err.response?.data?.message || 'Failed to create notification');
        alert(err.response?.data?.message || 'Failed to create notification');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Format date to readable string
  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="notifications-page">
      {/* Navbar */}
      <nav className="navbar">
        <div className="navbar-content">
          <h2 className="navbar-brand">📢 Notifications</h2>
          <div className="navbar-buttons">
            <button onClick={() => navigate('/dashboard')} className="back-button">
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="notifications-container">
        {/* Admin Create Form */}
        {isAdmin && (
          <div className="admin-section">
            <div className="form-header">
              <h2>📝 Create Announcement</h2>
              <button
                className="toggle-btn"
                onClick={() => setShowForm(!showForm)}
              >
                {showForm ? '✕ Close' : '+ New Announcement'}
              </button>
            </div>

            {showForm && (
              <form className="notification-form" onSubmit={handleSubmitNotification}>
                <div className="form-group">
                  <label htmlFor="title">Announcement Title *</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    placeholder="Enter announcement title (e.g., Menu Update, Holiday Notice)"
                    value={formData.title}
                    onChange={handleInputChange}
                    maxLength={100}
                    required
                  />
                  <small>{formData.title.length}/100</small>
                </div>

                <div className="form-group">
                  <label htmlFor="message">Announcement Message *</label>
                  <textarea
                    id="message"
                    name="message"
                    placeholder="Enter announcement message (detailed information for users)"
                    value={formData.message}
                    onChange={handleInputChange}
                    rows={6}
                    maxLength={500}
                    required
                  />
                  <small>{formData.message.length}/500</small>
                </div>

                <div className="form-actions">
                  <button
                    type="submit"
                    className="btn-submit"
                    disabled={submitting || !formData.title.trim() || !formData.message.trim()}
                  >
                    {submitting ? '⏳ Posting...' : '✓ Post Announcement'}
                  </button>
                  <button
                    type="button"
                    className="btn-cancel"
                    onClick={() => {
                      setShowForm(false);
                      setFormData({ title: '', message: '' });
                    }}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        )}

        {/* Notifications List */}
        <div className="notifications-section">
          <h2>📬 Latest Announcements</h2>

          {loading && (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading announcements...</p>
            </div>
          )}

          {error && (
            <div className="error-state">
              <p className="error-message">⚠️ {error}</p>
              <button onClick={fetchNotifications} className="btn-retry">
                Retry
              </button>
            </div>
          )}

          {!loading && !error && notifications.length === 0 && (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <p>No announcements yet</p>
              <small>Check back later for updates</small>
            </div>
          )}

          {!loading && !error && notifications.length > 0 && (
            <div className="notifications-list">
              {notifications.map((notification) => (
                <div key={notification.id} className="notification-card">
                  <div className="card-header">
                    <div className="title-section">
                      <h3 className="notification-title">
                        📌 {notification.title}
                      </h3>
                      <p className="notification-meta">
                        By: {notification.createdByName} ({notification.createdBy})
                      </p>
                    </div>
                    <div className="date-section">
                      <time className="notification-date">
                        {formatDate(notification.createdAt)}
                      </time>
                    </div>
                  </div>

                  <div className="card-body">
                    <p className="notification-message">
                      {notification.message}
                    </p>
                  </div>

                  <div className="card-footer">
                    <span className="notification-type">📢 Announcement</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Statistics (Admin only) */}
        {isAdmin && notifications.length > 0 && (
          <div className="statistics-section">
            <h2>📊 Announcement Statistics</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">{notifications.length}</div>
                <div className="stat-label">Total Announcements</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">
                  {notifications.filter(n => n.createdBy === user?.email).length}
                </div>
                <div className="stat-label">Your Announcements</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">
                  {new Date(notifications[0]?.createdAt).toLocaleDateString()}
                </div>
                <div className="stat-label">Latest Announcement</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Notifications;
