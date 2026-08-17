import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../styles/Auth.css";

function Login({ setIsAuthenticated, setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showError, setShowError] = useState(false);
  const [formVisible, setFormVisible] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    // Trigger form animation on mount
    setTimeout(() => setFormVisible(true), 100);
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setShowError(false);

    if (!email || !password) {
      setError("Please fill all fields");
      setShowError(true);
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/login",
        {
          email: email.trim(),
          password: password.trim(),
        },
        {
          timeout: 10000,
          headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
          }
        }
      );

      const token = response.data.token;

      if (!token) {
        throw new Error("Token not found in response");
      }

      localStorage.setItem("token", token);

      if (response.data.user) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        setUser(response.data.user);
      }

      setIsAuthenticated(true);
      navigate("/dashboard");

    } catch (err) {
      let errorMessage = "Login failed. Please try again.";

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
      } else if (err.response?.status === 404) {
        errorMessage = "User not found. Please check your email.";
      } else if (err.response?.status === 401) {
        errorMessage = "Invalid email or password.";
      } else if (err.response?.status === 400) {
        errorMessage = err.response.data?.message || "Invalid request.";
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
    <div className="auth-page auth-login">
      {/* Animated gradient background */}
      <div className="gradient-bg"></div>

      {/* Content */}
      <div className="auth-container">
        <div className={`auth-card ${formVisible ? 'visible' : ''}`}>
          {/* Header */}
          <div className="auth-header">
            <h1 className="auth-title">Welcome Back</h1>
            <p className="auth-subtitle">Login to your MessHub account</p>
          </div>

          {/* Error Message */}
          {showError && error && (
            <div className="error-toast">
              <span className="error-icon">⚠️</span>
              <span className="error-text">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="auth-form">
            {/* Email Input */}
            <div className="form-group">
              <div className="input-wrapper">
                <span className="input-icon">✉️</span>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
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
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="form-input"
                  disabled={loading}
                  autoComplete="current-password"
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

            {/* Login Button */}
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="spinner"></span>
                  Logging in...
                </>
              ) : (
                <>
                  Login
                  <span className="btn-icon">→</span>
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="auth-divider">
            <span>New to MessHub?</span>
          </div>

          {/* Signup Link */}
          <Link to="/signup" className="btn btn-secondary">
            Create Account
          </Link>

          {/* Footer */}
          <p className="auth-footer">
            Having issues? <a href="#help" className="help-link">Get help</a>
          </p>
        </div>

        {/* Background decoration */}
        <div className="decoration decoration-1"></div>
        <div className="decoration decoration-2"></div>
      </div>
    </div>
  );
}

export default Login;