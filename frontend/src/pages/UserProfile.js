import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./UserProfile.css";

function UserProfile({ user }) {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  //  Fetch user profile from API
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Not logged in. Please login first.");
        setLoading(false);
        return;
      }

      console.log("🔍 Fetching user profile...");

      const response = await axios.get("http://localhost:8080/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("✅ User profile fetched:", response.data);
      setProfileData(response.data);

    } catch (err) {
      console.error("❌ Error fetching profile:", err);
      console.log("📡 Response Status:", err.response?.status);
      console.log("📦 Response Data:", err.response?.data);
      console.log("📋 Error Message:", err.message);
      const storedToken = localStorage.getItem("token");
      console.log("🔑 Token in localStorage:", storedToken ? "✅ Present" : "❌ Missing");
      console.log("👤 User data in localStorage:", localStorage.getItem("user"));

      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
        // Optionally redirect to login
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } else if (err.response?.status === 403) {
        setError("❌ Access Denied: You don't have permission to view this profile (Check role in backend)");
      } else {
        const errorMessage = err.response?.data?.message || "Failed to load profile";
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  // 🔥 Fetch user profile on mount
  useEffect(() => {
    fetchUserProfile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 🔄 Retry function
  const handleRetry = () => {
    fetchUserProfile();
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>⏳ Loading your profile...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <div className="error-state">
            <p className="error-icon">❌</p>
            <h2>Error Loading Profile</h2>
            <p className="error-message">{error}</p>
            <button onClick={handleRetry} className="btn btn-retry">
              🔄 Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="profile-page">
        <div className="profile-container">
          <div className="error-state">
            <p className="error-icon">⚠️</p>
            <h2>No Profile Data</h2>
            <p className="error-message">Unable to load user profile data</p>
            <button onClick={handleRetry} className="btn btn-retry">
              🔄 Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <div className="profile-container">
        <div className="profile-header">
          <h1>👤 My Profile</h1>
          <p className="profile-subtitle">View your account information</p>
        </div>

        {/* Main Profile Card */}
        <div className="profile-card">
          {/* Profile Avatar Section */}
          <div className="avatar-section">
            <div className="avatar">
              {profileData.name?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="name-info">
              <h2 className="profile-name">{profileData.name || "User"}</h2>
              <p className="profile-email">{profileData.email || "N/A"}</p>
            </div>
          </div>

          {/* Divider */}
          <div className="divider"></div>

          {/* Profile Details Grid */}
          <div className="profile-details">
            {/* Email Card */}
            <div className="detail-card">
              <div className="detail-header">
                <span className="detail-icon">📧</span>
                <span className="detail-label">Email Address</span>
              </div>
              <div className="detail-content">
                <p className="detail-value">{profileData.email || "N/A"}</p>
              </div>
            </div>

            {/* Role Card */}
            <div className="detail-card">
              <div className="detail-header">
                <span className="detail-icon">
                  {profileData.role?.toUpperCase() === "ADMIN" ? "👨‍💼" : "👨‍🎓"}
                </span>
                <span className="detail-label">Account Role</span>
              </div>
              <div className="detail-content">
                <span className={`role-badge role-${profileData.role?.toLowerCase()}`}>
                  {profileData.role?.toUpperCase() || "STUDENT"}
                </span>
              </div>
            </div>

            {/* ID Card */}
            <div className="detail-card">
              <div className="detail-header">
                <span className="detail-icon">🔑</span>
                <span className="detail-label">User ID</span>
              </div>
              <div className="detail-content">
                <p className="detail-value detail-id">{profileData.id || "N/A"}</p>
                <button
                  className="copy-btn"
                  onClick={() => {
                    navigator.clipboard.writeText(profileData.id);
                    alert("User ID copied to clipboard!");
                  }}
                  title="Copy to clipboard"
                >
                  📋
                </button>
              </div>
            </div>

            {/* Account Status Card */}
            <div className="detail-card">
              <div className="detail-header">
                <span className="detail-icon">✅</span>
                <span className="detail-label">Account Status</span>
              </div>
              <div className="detail-content">
                <p className="status-active">Active</p>
              </div>
            </div>
          </div>

          {/* Additional Info Section */}
          <div className="additional-info">
            <h3>📋 Additional Information</h3>
            <div className="info-table">
              <div className="info-row">
                <span className="info-label">Member Since:</span>
                <span className="info-value">April 17, 2026</span>
              </div>
              <div className="info-row">
                <span className="info-label">Last Updated:</span>
                <span className="info-value">Just now</span>
              </div>
              <div className="info-row">
                <span className="info-label">Account Type:</span>
                <span className="info-value">{profileData.role?.toUpperCase() || "STUDENT"}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button
            onClick={handleRetry}
            className="btn btn-secondary"
            title="Refresh profile information"
          >
            🔄 Refresh
          </button>
          <button
            onClick={() => navigate("/settings")}
            className="btn btn-primary"
            title="Go to account settings"
          >
            ⚙️ Go to Settings
          </button>
        </div>

        {/* Profile Sections Info */}
        <div className="info-box">
          <h4>💡 What can you do?</h4>
          <ul className="tips-list">
            <li>📧 View your email address</li>
            <li>👤 Check your account role and permissions</li>
            <li>🔄 Refresh your profile information</li>
            <li>⚙️ Go to settings to update your name or password</li>
            <li>📊 View orders and attendance from dashboard</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

export default UserProfile;
