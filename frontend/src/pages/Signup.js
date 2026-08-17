import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../styles/Auth.css";

function Signup({ setIsAuthenticated, setUser }) {

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "STUDENT"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showError, setShowError] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setTimeout(() => setFormVisible(true), 100);
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setShowError(false);

    // ✅ Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill all fields");
      setShowError(true);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setShowError(true);
      return;
    }

    if (formData.password.length < 4) {
      setError("Password must be at least 4 characters");
      setShowError(true);
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        "http://localhost:8080/api/auth/register",
        {
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          role: formData.role
        },
        {
          timeout: 10000,
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          }
        }
      );

      setSuccess("Account created! Redirecting to login...");

      // Clear form
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "STUDENT"
      });

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/");
      }, 2000);

    } catch (err) {
      let errorMessage = "Signup failed. Please try again.";

      if (err.code === "ECONNABORTED") {
        errorMessage = "Connection timeout. Backend may not be responding.";
      } else if (err.code === "ECONNREFUSED") {
        errorMessage = "Backend is not running on http://localhost:8080";
      } else if (err.code === "ENOTFOUND") {
        errorMessage = "Network error. Cannot find server.";
      } else if (err.request && !err.response) {
        errorMessage = "Server is not responding. Check if backend is running.";
      } else if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.response?.status === 400) {
        errorMessage = err.response.data?.message || "Invalid request. Please check your input.";
      } else if (err.response?.status === 409) {
        errorMessage = "Email already exists. Please use a different email.";
      } else if (err.message === "Network Error") {
        errorMessage = "Network error. Please check if the server is running.";
      }

      setError(errorMessage);
      setShowError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page auth-signup">
      {/* Animated gradient background */}
      <div className="gradient-bg"></div>

      {/* Content */}
      <div className="auth-container">
        <div className={`auth-card ${formVisible ? 'visible' : ''}`}>
          {/* Header */}
          <div className="auth-header">
            <h1 className="auth-title">Join MessHub</h1>
            <p className="auth-subtitle">Create your account to get started</p>
          </div>

          {/* Error Message */}
          {showError && error && (
            <div className="error-toast">
              <span className="error-icon">⚠️</span>
              <span className="error-text">{error}</span>
            </div>
          )}

          {/* Success Message */}
          {success && (
            <div className="error-toast" style={{ background: "rgba(34, 197, 94, 0.15)", borderColor: "rgba(34, 197, 94, 0.5)" }}>
              <span className="error-icon">✅</span>
              <span className="error-text" style={{ color: "#22c55e" }}>{success}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSignup} className="auth-form">
            {/* Name Input */}
            <div className="form-group">
              <div className="input-wrapper">
                <span className="input-icon">👤</span>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="form-input"
                  disabled={loading}
                  autoComplete="name"
                  required
                />
                <label className="floating-label">Full Name</label>
              </div>
            </div>

            {/* Email Input */}
            <div className="form-group">
              <div className="input-wrapper">
                <span className="input-icon">📧</span>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}

                  
                  className="form-input"
                  disabled={loading}
                  autoComplete="email"
                  required
                />
                <label className="floating-label">Email Address</label>
              </div>
            </div>

            {/* Password Input */}
            <div className="form-group">
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="form-input"
                  disabled={loading}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                >
                  {showPassword ? "👁️" : "👁️‍🗨️"}
                </button>
                <label className="floating-label">Password</label>
              </div>
            </div>

            {/* Confirm Password Input */}
            <div className="form-group">
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="form-input"
                  disabled={loading}
                  autoComplete="new-password"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                >
                  {showConfirmPassword ? "👁️" : "👁️‍🗨️"}
                </button>
                <label className="floating-label">Confirm Password</label>
              </div>
            </div>

            {/* Role Select */}
            <div className="form-group">
              <div className="input-wrapper">
                <span className="input-icon">👨‍💼</span>
                <select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className="form-input"
                  disabled={loading}
                  required
                >
                  <option value="STUDENT">Student</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
            </div>

            {/* Signup Button */}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Creating Account...
                </>
              ) : (
                <>
                  Sign Up
                  <span className="btn-icon">→</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="auth-divider">
            <span>Already have an account?</span>
          </div>

          {/* Login Link */}
          <Link to="/" className="btn btn-secondary">
            Back to Login
          </Link>

          {/* Footer */}
          <p className="auth-footer">
            By signing up, you agree to our <a href="#terms" className="help-link">Terms of Service</a>
          </p>
        </div>

        {/* Background decoration */}
        <div className="decoration decoration-1"></div>
        <div className="decoration decoration-2"></div>
      </div>
    </div>
  );
}

export default Signup;
