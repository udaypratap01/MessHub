import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Settings.css";

function Settings({ user, setIsAuthenticated, setUser }) {
  const navigate = useNavigate();
  
  const [profileName, setProfileName] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [updatingName, setUpdatingName] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);
  const [deletingAccount, setDeletingAccount] = useState(false);

  const [userEmail, setUserEmail] = useState("");
  const [userRole, setUserRole] = useState("");
  
  // 🔥 Delete Account Modal
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // 🔥 Fetch current user profile on mount
  useEffect(() => {
    fetchUserProfile();
  }, []);

  // 📋 Fetch user profile from API
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

      const response = await axios.get("http://localhost:8080/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("✅ User profile fetched:", response.data);

      const userData = response.data;
      setProfileName(userData.name || "");
      setUserEmail(userData.email || "");
      setUserRole(userData.role || "");
    } catch (err) {
      console.error("❌ Error fetching profile:", err);
      console.log("📡 Response Status:", err.response?.status);
      console.log("📦 Response Data:", err.response?.data);
      console.log("📋 Error Message:", err.message);
      const storedToken = localStorage.getItem("token");
      console.log("🔑 Token in localStorage:", storedToken ? "✅ Present" : "❌ Missing");
      
      if (err.response?.status === 403) {
        setError("❌ Access Denied: Check your role permissions in backend SecurityConfig");
      } else {
        const errorMessage = err.response?.data?.message || "Failed to load profile";
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  // 💾 Update user name
  const handleUpdateName = async (e) => {
    e.preventDefault();

    try {
      setUpdatingName(true);
      setError("");
      setSuccess("");

      // Validation
      if (!profileName.trim()) {
        setError("Name cannot be empty");
        setUpdatingName(false);
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Not logged in. Please login first.");
        setUpdatingName(false);
        return;
      }

      console.log("📍 Updating name to:", profileName);

      const response = await axios.put(
        "http://localhost:8080/api/users/update",
        { name: profileName },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Name updated:", response.data);

      setSuccess("✅ Name updated successfully!");

      // Update localStorage
      const storedUser = JSON.parse(localStorage.getItem("user"));
      if (storedUser) {
        storedUser.name = profileName;
        localStorage.setItem("user", JSON.stringify(storedUser));
      }

      // Clear message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("❌ Error updating name:", err);

      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
      } else if (err.response?.status === 400) {
        setError(err.response?.data?.message || "Invalid input");
      } else {
        setError(err.response?.data?.message || "Failed to update name");
      }
    } finally {
      setUpdatingName(false);
    }
  };

  // 🔐 Change password
  const handleChangePassword = async (e) => {
    e.preventDefault();

    try {
      setChangingPassword(true);
      setError("");
      setSuccess("");

      // Validation
      if (!oldPassword) {
        setError("Old password is required");
        setChangingPassword(false);
        return;
      }

      if (!newPassword) {
        setError("New password is required");
        setChangingPassword(false);
        return;
      }

      if (!confirmPassword) {
        setError("Please confirm your new password");
        setChangingPassword(false);
        return;
      }

      if (newPassword.length < 6) {
        setError("New password must be at least 6 characters");
        setChangingPassword(false);
        return;
      }

      if (newPassword !== confirmPassword) {
        setError("Passwords do not match");
        setChangingPassword(false);
        return;
      }

      if (oldPassword === newPassword) {
        setError("New password must be different from old password");
        setChangingPassword(false);
        return;
      }

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Not logged in. Please login first.");
        setChangingPassword(false);
        return;
      }

      console.log("🔐 Changing password...");

      const response = await axios.put(
        "http://localhost:8080/api/users/change-password",
        {
          oldPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Password changed:", response.data);

      setSuccess("✅ Password changed successfully!");

      // Clear password fields
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");

      // Clear message after 3 seconds
      setTimeout(() => setSuccess(""), 3000);
    } catch (err) {
      console.error("❌ Error changing password:", err);

      if (err.response?.status === 401) {
        if (err.response?.data?.message?.includes("incorrect")) {
          setError("Old password is incorrect");
        } else {
          setError("Session expired. Please login again.");
        }
      } else if (err.response?.status === 400) {
        setError(err.response?.data?.message || "Invalid input");
      } else {
        setError(err.response?.data?.message || "Failed to change password");
      }
    } finally {
      setChangingPassword(false);
    }
  };

  // 🔥 DELETE ACCOUNT HANDLER
  const handleDeleteAccount = async () => {
    try {
      setDeletingAccount(true);
      setError("");
      setSuccess("");

      const token = localStorage.getItem("token");
      if (!token) {
        console.error("❌ No token found in localStorage");
        setError("Not logged in. Please login first.");
        setDeletingAccount(false);
        return;
      }

      console.log("🗑️ Starting account deletion process...");
      console.log("📝 Token:", token.substring(0, 20) + "...");

      // Make DELETE request
      const response = await axios.delete(
        "http://localhost:8080/api/users/delete",
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Delete request successful:", response.data);
      console.log("📊 Response status:", response.status);

      // Close modal
      setShowDeleteModal(false);

      // Clear localStorage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      console.log("✅ localStorage cleared");

      // Update state
      setIsAuthenticated(false);
      setUser(null);
      console.log("✅ Auth state updated");

      // Show success message briefly
      setSuccess("✅ Account deleted successfully. Redirecting to login...");

      // Redirect to login after 2 seconds
      setTimeout(() => {
        console.log("🔄 Redirecting to home page...");
        navigate("/");
      }, 2000);
    } catch (err) {
      setDeletingAccount(false);
      
      console.error("❌ Error deleting account:", err);
      console.error("❌ Error response:", err.response);
      console.error("❌ Error status:", err.response?.status);
      console.error("❌ Error data:", err.response?.data);
      console.error("❌ Error message:", err.message);

      // Detailed error handling
      if (err.response?.status === 401) {
        console.error("❌ 401 Unauthorized - Token invalid or expired");
        setError("❌ Session expired. Please login again.");
      } else if (err.response?.status === 403) {
        console.error("❌ 403 Forbidden - User not authorized");
        setError("❌ You don't have permission to delete this account.");
      } else if (err.response?.status === 404) {
        console.error("❌ 404 Not Found - User not found in database");
        setError("❌ User account not found in the system.");
      } else if (err.response?.status === 400) {
        console.error("❌ 400 Bad Request - Invalid request");
        setError(err.response?.data?.message || "❌ Invalid request. Please try again.");
      } else if (err.response?.status === 500) {
        console.error("❌ 500 Server Error");
        setError(err.response?.data?.message || "❌ Server error. Please try again later.");
      } else if (err.request && !err.response) {
        console.error("❌ No response received - Server may be down");
        setError("❌ Cannot connect to server. Please check your connection and try again.");
      } else {
        console.error("❌ Unknown error occurred");
        setError(err.response?.data?.message || "❌ Failed to delete account. Please try again.");
      }
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-container">
        <h1 className="settings-title">⚙️ Account Settings</h1>
        <p className="settings-subtitle">Manage your account and preferences</p>

        {/* Error Message */}
        {error && (
          <div className="alert alert-error">
            {error}
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="alert alert-success">
            {success}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="loading-container">
            <p>⏳ Loading your profile...</p>
          </div>
        ) : (
          <>
            {/* User Info Section */}
            <div className="settings-card">
              <h2>👤 User Information</h2>
              <div className="info-section">
                <div className="info-item">
                  <label>Email:</label>
                  <p className="info-value">{userEmail}</p>
                </div>
                <div className="info-item">
                  <label>Role:</label>
                  <p className="info-value">
                    <span className={`role-badge role-${userRole?.toLowerCase()}`}>
                      {userRole}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            {/* Update Name Section */}
            <div className="settings-card">
              <h2>✏️ Update Profile</h2>
              <form onSubmit={handleUpdateName}>
                <div className="form-group">
                  <label htmlFor="name">Full Name:</label>
                  <input
                    type="text"
                    id="name"
                    value={profileName}
                    onChange={(e) => setProfileName(e.target.value)}
                    placeholder="Enter your full name"
                    disabled={updatingName}
                    className="form-input"
                  />
                </div>

                <button
                  type="submit"
                  disabled={updatingName || !profileName.trim()}
                  className="btn btn-primary"
                >
                  {updatingName ? "⏳ Updating..." : "✅ Update Name"}
                </button>
              </form>
            </div>

            {/* Change Password Section */}
            <div className="settings-card">
              <h2>🔐 Change Password</h2>
              <p className="section-description">
                Ensure your account is secure with a strong password
              </p>

              <form onSubmit={handleChangePassword}>
                <div className="form-group">
                  <label htmlFor="oldPassword">Current Password:</label>
                  <input
                    type="password"
                    id="oldPassword"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Enter your current password"
                    disabled={changingPassword}
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword">New Password:</label>
                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password (min 6 characters)"
                    disabled={changingPassword}
                    className="form-input"
                  />
                  <small className="form-hint">
                    Password must be at least 6 characters long
                  </small>
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm New Password:</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your new password"
                    disabled={changingPassword}
                    className="form-input"
                  />
                </div>

                <button
                  type="submit"
                  disabled={changingPassword || !oldPassword || !newPassword || !confirmPassword}
                  className="btn btn-danger"
                >
                  {changingPassword ? "⏳ Changing..." : "🔐 Change Password"}
                </button>
              </form>
            </div>

            {/* Password Requirements */}
            <div className="settings-card info-card">
              <h3>🛡️ Password Security Tips</h3>
              <ul className="tips-list">
                <li>✅ Use at least 6 characters</li>
                <li>✅ Mix uppercase and lowercase letters</li>
                <li>✅ Include numbers and special characters</li>
                <li>✅ Never share your password</li>
                <li>✅ Change password regularly</li>
              </ul>
            </div>

            {/* 🔥 DELETE ACCOUNT SECTION - DANGER ZONE */}
            <div className="settings-card danger-card">
              <h2>🔥 Danger Zone</h2>
              <p className="danger-message">
                ⚠️ This action is <strong>irreversible</strong> and will permanently delete your account and all associated data.
              </p>
              <button
                className="btn btn-delete"
                onClick={() => setShowDeleteModal(true)}
                disabled={deletingAccount}
              >
                🗑️ Delete Account
              </button>
            </div>
          </>
        )}
      </div>

      {/* 🔥 DELETE ACCOUNT CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className="modal-overlay" onClick={() => !deletingAccount && setShowDeleteModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>⚠️ Delete Account?</h2>
              <button
                className="modal-close"
                onClick={() => !deletingAccount && setShowDeleteModal(false)}
                disabled={deletingAccount}
              >
                ✕
              </button>
            </div>

            <div className="modal-body">
              <p className="modal-warning">
                🔴 <strong>WARNING:</strong> This action is <strong>permanent and irreversible.</strong>
              </p>
              <p>
                Deleting your account will:
              </p>
              <ul className="modal-list">
                <li>🗑️ Permanently delete your account</li>
                <li>🗑️ Remove all your personal data</li>
                <li>🗑️ Cancel all pending orders</li>
                <li>🗑️ Delete your order history</li>
                <li>🗑️ Cannot be recovered</li>
              </ul>
              <p className="modal-confirm">
                Are you absolutely sure you want to delete your account?
              </p>
            </div>

            <div className="modal-footer">
              <button
                className="btn btn-cancel"
                onClick={() => setShowDeleteModal(false)}
                disabled={deletingAccount}
              >
                Cancel
              </button>
              <button
                className="btn btn-delete-confirm"
                onClick={handleDeleteAccount}
                disabled={deletingAccount}
              >
                {deletingAccount ? "⏳ Deleting..." : "Yes, Delete Account"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Settings;
