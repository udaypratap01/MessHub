import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/AdminFeedback.css';

export default function AdminFeedback({ user }) {
    const navigate = useNavigate();
    const [feedbackList, setFeedbackList] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [sortBy, setSortBy] = useState('date');
    const [filterCategory, setFilterCategory] = useState('ALL');
    const [filterRating, setFilterRating] = useState(0);

    // Fetch all feedback on component load
    useEffect(() => {
        fetchAllFeedback();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fetch all feedback from API
    const fetchAllFeedback = async () => {
        setLoading(true);
        setError('');

        try {
            console.log("📊 Fetching all feedback (admin)...");

            const token = localStorage.getItem('token');
            if (!token) {
                setError('Session expired. Please login again.');
                setTimeout(() => navigate('/login'), 2000);
                return;
            }

            const response = await axios.get(
                'http://localhost:8080/api/feedback/all',
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            console.log("✅ All feedback fetched:", response.data);
            setFeedbackList(response.data.data || []);
            setError('');

        } catch (err) {
            console.error("❌ Error fetching feedback:", err);

            if (err.response?.status === 401) {
                setError('Session expired. Please login again.');
                setTimeout(() => navigate('/login'), 2000);
            } else if (err.response?.status === 403) {
                setError('Only admins can view all feedback');
                setTimeout(() => navigate('/dashboard'), 2000);
            } else {
                setError('Error fetching feedback. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    // Get star rating display
    const renderStars = (rating) => {
        return '⭐'.repeat(rating) + '☆'.repeat(5 - rating);
    };

    // Get category color
    const getCategoryColor = (category) => {
        const colors = {
            'FOOD': '#FF6B6B',
            'MANAGEMENT': '#4ECDC4',
            'CLEANLINESS': '#45B7D1'
        };
        return colors[category] || '#999';
    };

    // Filter feedback based on category and rating
    const getFilteredFeedback = () => {
        let filtered = feedbackList;

        // Filter by category
        if (filterCategory !== 'ALL') {
            filtered = filtered.filter(f => f.category === filterCategory);
        }

        // Filter by minimum rating
        if (filterRating > 0) {
            filtered = filtered.filter(f => f.rating >= filterRating);
        }

        // Sort
        if (sortBy === 'date') {
            filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        } else if (sortBy === 'rating-high') {
            filtered.sort((a, b) => b.rating - a.rating);
        } else if (sortBy === 'rating-low') {
            filtered.sort((a, b) => a.rating - b.rating);
        } else if (sortBy === 'category') {
            filtered.sort((a, b) => a.category.localeCompare(b.category));
        }

        return filtered;
    };

    // Get statistics
    const getStatistics = () => {
        if (feedbackList.length === 0) {
            return {
                total: 0,
                avgRating: 0,
                byCategory: {}
            };
        }

        const total = feedbackList.length;
        const avgRating = (feedbackList.reduce((sum, f) => sum + f.rating, 0) / total).toFixed(1);
        const byCategory = {};

        feedbackList.forEach(f => {
            if (!byCategory[f.category]) {
                byCategory[f.category] = 0;
            }
            byCategory[f.category]++;
        });

        return { total, avgRating, byCategory };
    };

    const stats = getStatistics();
    const filteredFeedback = getFilteredFeedback();

    return (
        <div className="admin-feedback-container">
            {/* Navbar */}
            <div className="admin-navbar">
                <button className="back-btn" onClick={() => navigate('/dashboard')}>
                    ← Back to Dashboard
                </button>
                <h1 className="admin-title">📊 All Feedback & Reviews</h1>
                <button className="refresh-btn" onClick={fetchAllFeedback} disabled={loading}>
                    {loading ? '⏳' : '🔄'} Refresh
                </button>
            </div>

            {/* Main Content */}
            <div className="admin-content">
                {/* Error Message */}
                {error && (
                    <div className="error-banner">
                        ❌ {error}
                        <button onClick={() => setError('')}>×</button>
                    </div>
                )}

                {/* Statistics */}
                {!loading && feedbackList.length > 0 && (
                    <div className="stats-section">
                        <div className="stat-box">
                            <h3>📝</h3>
                            <p className="stat-label">Total Feedback</p>
                            <p className="stat-value">{stats.total}</p>
                        </div>

                        <div className="stat-box">
                            <h3>⭐</h3>
                            <p className="stat-label">Average Rating</p>
                            <p className="stat-value">{stats.avgRating}/5</p>
                        </div>

                        <div className="stat-box">
                            <h3>🍽️</h3>
                            <p className="stat-label">Food Feedback</p>
                            <p className="stat-value">{stats.byCategory['FOOD'] || 0}</p>
                        </div>

                        <div className="stat-box">
                            <h3>📋</h3>
                            <p className="stat-label">Management Feedback</p>
                            <p className="stat-value">{stats.byCategory['MANAGEMENT'] || 0}</p>
                        </div>

                        <div className="stat-box">
                            <h3>🧹</h3>
                            <p className="stat-label">Cleanliness Feedback</p>
                            <p className="stat-value">{stats.byCategory['CLEANLINESS'] || 0}</p>
                        </div>
                    </div>
                )}

                {/* Filters */}
                <div className="filter-section">
                    <div className="filter-group">
                        <label>Sort By:</label>
                        <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                            <option value="date">📅 Latest First</option>
                            <option value="rating-high">⭐ Highest Rating</option>
                            <option value="rating-low">⭐ Lowest Rating</option>
                            <option value="category">📂 Category</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Category:</label>
                        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)}>
                            <option value="ALL">All Categories</option>
                            <option value="FOOD">🍽️ Food Quality</option>
                            <option value="MANAGEMENT">📋 Management</option>
                            <option value="CLEANLINESS">🧹 Cleanliness</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Minimum Rating:</label>
                        <select value={filterRating} onChange={(e) => setFilterRating(parseInt(e.target.value))}>
                            <option value="0">All Ratings</option>
                            <option value="1">⭐ 1+ Star</option>
                            <option value="2">⭐⭐ 2+ Stars</option>
                            <option value="3">⭐⭐⭐ 3+ Stars</option>
                            <option value="4">⭐⭐⭐⭐ 4+ Stars</option>
                            <option value="5">⭐⭐⭐⭐⭐ 5 Stars</option>
                        </select>
                    </div>

                    <div className="filter-info">
                        Showing {filteredFeedback.length} of {feedbackList.length} feedback
                    </div>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="loading-state">
                        <div className="spinner"></div>
                        <p>Loading feedback...</p>
                    </div>
                )}

                {/* Feedback Table */}
                {!loading && (
                    <>
                        {feedbackList.length === 0 ? (
                            <div className="empty-state">
                                <p>📭 No feedback submitted yet</p>
                            </div>
                        ) : filteredFeedback.length === 0 ? (
                            <div className="empty-state">
                                <p>No feedback matches the selected filters</p>
                            </div>
                        ) : (
                            <div className="feedback-table-wrapper">
                                <table className="feedback-table">
                                    <thead>
                                        <tr>
                                            <th>Name</th>
                                            <th>Email</th>
                                            <th>Category</th>
                                            <th>Rating</th>
                                            <th>Message</th>
                                            <th>Date</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredFeedback.map((feedback) => (
                                            <tr key={feedback.id}>
                                                <td className="name-cell">
                                                    <div className="name-badge">
                                                        {feedback.userName.charAt(0).toUpperCase()}
                                                    </div>
                                                    {feedback.userName}
                                                </td>
                                                <td className="email-cell">{feedback.userEmail}</td>
                                                <td className="category-cell">
                                                    <span
                                                        className="category-tag"
                                                        style={{ backgroundColor: getCategoryColor(feedback.category) }}
                                                    >
                                                        {feedback.category}
                                                    </span>
                                                </td>
                                                <td className="rating-cell">
                                                    {renderStars(feedback.rating)}
                                                </td>
                                                <td className="message-cell">
                                                    <div className="message-content">
                                                        {feedback.message}
                                                    </div>
                                                </td>
                                                <td className="date-cell">
                                                    {formatDate(feedback.createdAt)}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
