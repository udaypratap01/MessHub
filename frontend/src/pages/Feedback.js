import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Feedback.css';

export default function Feedback({ user }) {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        category: 'FOOD',
        rating: 5,
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [myFeedback, setMyFeedback] = useState([]);
    const [showMyFeedback, setShowMyFeedback] = useState(false);
    const [fetchingFeedback, setFetchingFeedback] = useState(false);

    // Handle form input change
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: name === 'rating' ? parseInt(value) : value
        });
    };

    // Submit feedback
    const handleSubmitFeedback = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            console.log("📨 Submitting feedback:", formData);

            // Validate form
            if (!formData.category || formData.category.trim() === '') {
                setError('Please select a category');
                setLoading(false);
                return;
            }

            if (!formData.message || formData.message.trim() === '') {
                setError('Please enter a message');
                setLoading(false);
                return;
            }

            if (formData.rating < 1 || formData.rating > 5) {
                setError('Rating must be between 1 and 5');
                setLoading(false);
                return;
            }

            // Get JWT token
            const token = localStorage.getItem('token');
            if (!token) {
                setError('Session expired. Please login again.');
                setTimeout(() => navigate('/login'), 2000);
                setLoading(false);
                return;
            }

            // Submit feedback
            const response = await axios.post(
                'http://localhost:8080/api/feedback',
                formData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                }
            );

            console.log("✅ Feedback submitted:", response.data);

            // Reset form
            setFormData({
                category: 'FOOD',
                rating: 5,
                message: ''
            });
            setSubmitted(true);
            setError('');

            // Hide success message after 3 seconds
            setTimeout(() => {
                setSubmitted(false);
            }, 3000);

        } catch (err) {
            console.error("❌ Error submitting feedback:", err);

            if (err.response) {
                if (err.response.status === 401) {
                    setError('Session expired. Please login again.');
                    setTimeout(() => navigate('/login'), 2000);
                } else if (err.response.status === 403) {
                    setError('Only students can submit feedback');
                } else {
                    setError(err.response.data?.message || 'Error submitting feedback');
                }
            } else {
                setError('Network error. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    // Fetch my feedback
    const handleFetchMyFeedback = async () => {
        setFetchingFeedback(true);
        setError('');

        try {
            console.log("📖 Fetching my feedback...");

            const token = localStorage.getItem('token');
            if (!token) {
                setError('Session expired. Please login again.');
                setTimeout(() => navigate('/login'), 2000);
                return;
            }

            const response = await axios.get(
                'http://localhost:8080/api/feedback/my',
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            console.log("✅ Feedback fetched:", response.data);
            setMyFeedback(response.data.data || []);
            setShowMyFeedback(true);

        } catch (err) {
            console.error("❌ Error fetching feedback:", err);

            if (err.response?.status === 401) {
                setError('Session expired. Please login again.');
                setTimeout(() => navigate('/login'), 2000);
            } else {
                setError('Error fetching feedback. Please try again.');
            }
        } finally {
            setFetchingFeedback(false);
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

    return (
        <div className="feedback-container">
            {/* Navbar */}
            <div className="feedback-navbar">
                <button className="back-btn" onClick={() => navigate('/dashboard')}>
                    ← Back to Dashboard
                </button>
                <h1 className="feedback-title">💬 Feedback & Reviews</h1>
                <div className="spacer"></div>
            </div>

            {/* Main Content */}
            <div className="feedback-content">
                {/* Submit Feedback Section */}
                <div className="feedback-card">
                    <div className="card-header">
                        <h2>📝 Submit Your Feedback</h2>
                        <p>Help us improve by sharing your thoughts</p>
                    </div>

                    {submitted && (
                        <div className="success-message">
                            ✅ Thank you! Your feedback has been submitted successfully.
                        </div>
                    )}

                    {error && (
                        <div className="error-message">
                            ❌ {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmitFeedback} className="feedback-form">
                        {/* Category Dropdown */}
                        <div className="form-group">
                            <label htmlFor="category">Category *</label>
                            <select
                                id="category"
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="FOOD">🍽️ Food Quality</option>
                                <option value="MANAGEMENT">📋 Management & Service</option>
                                <option value="CLEANLINESS">🧹 Cleanliness & Hygiene</option>
                            </select>
                        </div>

                        {/* Rating Slider */}
                        <div className="form-group">
                            <label htmlFor="rating">Rating: {renderStars(formData.rating)}</label>
                            <input
                                type="range"
                                id="rating"
                                name="rating"
                                min="1"
                                max="5"
                                value={formData.rating}
                                onChange={handleInputChange}
                                className="rating-slider"
                            />
                            <div className="rating-labels">
                                <span>Poor (1)</span>
                                <span>Excellent (5)</span>
                            </div>
                        </div>

                        {/* Message Textarea */}
                        <div className="form-group">
                            <label htmlFor="message">
                                Your Feedback ({formData.message.length}/500)
                            </label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleInputChange}
                                placeholder="Please share your detailed feedback..."
                                maxLength="500"
                                rows="5"
                                required
                            ></textarea>
                        </div>

                        {/* Submit Button */}
                        <div className="form-actions">
                            <button
                                type="submit"
                                className="submit-btn"
                                disabled={loading || !formData.message.trim()}
                            >
                                {loading ? '⏳ Submitting...' : '✓ Submit Feedback'}
                            </button>
                        </div>
                    </form>
                </div>

                {/* My Feedback Section */}
                <div className="feedback-card">
                    <div className="card-header">
                        <h2>📚 Your Feedback History</h2>
                        <button
                            className="view-btn"
                            onClick={handleFetchMyFeedback}
                            disabled={fetchingFeedback}
                        >
                            {fetchingFeedback ? '⏳ Loading...' : '👁️ View My Feedback'}
                        </button>
                    </div>

                    {showMyFeedback && (
                        <div className="feedback-list">
                            {myFeedback.length === 0 ? (
                                <div className="empty-state">
                                    <p>📭 You haven't submitted any feedback yet.</p>
                                </div>
                            ) : (
                                myFeedback.map((feedback) => (
                                    <div key={feedback.id} className="feedback-item">
                                        <div className="feedback-item-header">
                                            <span
                                                className="category-badge"
                                                style={{ backgroundColor: getCategoryColor(feedback.category) }}
                                            >
                                                {feedback.category}
                                            </span>
                                            <span className="rating-display">
                                                {renderStars(feedback.rating)}
                                            </span>
                                            <span className="date-display">
                                                📅 {formatDate(feedback.createdAt)}
                                            </span>
                                        </div>
                                        <p className="feedback-message">{feedback.message}</p>
                                    </div>
                                ))
                            )}
                        </div>
                    )}
                </div>

                {/* Stats Section */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">📝</div>
                        <div className="stat-content">
                            <h3>{myFeedback.length}</h3>
                            <p>Feedback Submitted</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">⭐</div>
                        <div className="stat-content">
                            <h3>
                                {myFeedback.length > 0
                                    ? (myFeedback.reduce((sum, f) => sum + f.rating, 0) / myFeedback.length).toFixed(1)
                                    : 'N/A'}
                            </h3>
                            <p>Average Rating</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-icon">📊</div>
                        <div className="stat-content">
                            <h3>{myFeedback.length > 0 ? Math.max(...myFeedback.map(f => f.rating)) : 'N/A'}</h3>
                            <p>Highest Rating</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
