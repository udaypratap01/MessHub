import React, { useState, useEffect } from "react";
import axios from "axios";
import "./AnalyticsDashboard.css";

function AnalyticsDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // 🔥 Fetch dashboard data on mount
  useEffect(() => {
    fetchDashboardData();
  }, []);

  // 📊 Fetch dashboard summary from API
  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Not logged in. Please login first.");
        setLoading(false);
        return;
      }

      console.log("📊 Fetching dashboard analytics...");

      const response = await axios.get("http://localhost:8080/api/dashboard/summary", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("✅ Dashboard data fetched:", response.data);
      setDashboardData(response.data.data);

    } catch (err) {
      console.error("❌ Error fetching dashboard:", err);

      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
      } else if (err.response?.status === 403) {
        setError("You don't have permission to access the dashboard.");
      } else {
        const errorMessage = err.response?.data?.message || "Failed to load dashboard";
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="analytics-page">
        <div className="analytics-container">
          <div className="loading-state">
            <div className="spinner"></div>
            <p>⏳ Loading dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="analytics-page">
        <div className="analytics-container">
          <div className="error-state">
            <p className="error-icon">❌</p>
            <h2>Error Loading Dashboard</h2>
            <p className="error-message">{error}</p>
            <button onClick={fetchDashboardData} className="btn btn-retry">
              🔄 Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="analytics-page">
        <div className="analytics-container">
          <div className="error-state">
            <p className="error-icon">⚠️</p>
            <h2>No Data Available</h2>
            <p className="error-message">Unable to load dashboard data</p>
            <button onClick={fetchDashboardData} className="btn btn-retry">
              🔄 Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Extract data
  const totalStudents = dashboardData.totalStudents || 0;
  const totalMealsServed = dashboardData.totalMealsServed || 0;
  const foodPrepared = dashboardData.foodPrepared || 0;
  const foodConsumed = dashboardData.foodConsumed || 0;
  const foodWaste = dashboardData.foodWaste || 0;
  const wastePercentage = parseFloat(dashboardData.wastePercentage) || 0;
  const consumptionPercentage = parseFloat(dashboardData.consumptionPercentage) || 0;

  return (
    <div className="analytics-page">
      <div className="analytics-container">
        {/* Header */}
        <div className="analytics-header">
          <h1>📊 Food Analytics Dashboard</h1>
          <p className="analytics-subtitle">Real-time food consumption and waste analysis</p>
        </div>

        {/* Summary Cards Grid */}
        <div className="cards-grid">
          {/* Card 1: Total Students */}
          <div className="analytics-card card-students">
            <div className="card-header">
              <span className="card-icon">👥</span>
              <span className="card-title">Total Students</span>
            </div>
            <div className="card-value">{totalStudents}</div>
            <p className="card-subtitle">Active registered students</p>
          </div>

          {/* Card 2: Meals Served */}
          <div className="analytics-card card-meals">
            <div className="card-header">
              <span className="card-icon">🍽️</span>
              <span className="card-title">Meals Served</span>
            </div>
            <div className="card-value">{totalMealsServed}</div>
            <p className="card-subtitle">Total attendance records</p>
          </div>

          {/* Card 3: Food Prepared */}
          <div className="analytics-card card-prepared">
            <div className="card-header">
              <span className="card-icon">🍛</span>
              <span className="card-title">Food Prepared</span>
            </div>
            <div className="card-value">{foodPrepared}</div>
            <p className="card-subtitle">Units prepared for consumption</p>
          </div>

          {/* Card 4: Food Consumed */}
          <div className="analytics-card card-consumed">
            <div className="card-header">
              <span className="card-icon">✔️</span>
              <span className="card-title">Food Consumed</span>
            </div>
            <div className="card-value">{foodConsumed}</div>
            <p className="card-subtitle">Consumed ({consumptionPercentage}%)</p>
          </div>

          {/* Card 5: Food Waste */}
          <div className="analytics-card card-waste">
            <div className="card-header">
              <span className="card-icon">❌</span>
              <span className="card-title">Food Waste</span>
            </div>
            <div className="card-value">{foodWaste}</div>
            <p className="card-subtitle">Wasted ({wastePercentage}%)</p>
          </div>

          {/* Card 6: Waste Percentage */}
          <div className="analytics-card card-percentage">
            <div className="card-header">
              <span className="card-icon">📈</span>
              <span className="card-title">Waste Rate</span>
            </div>
            <div className="card-value">{wastePercentage}%</div>
            <p className="card-subtitle">Percentage of food wasted</p>
          </div>
        </div>

        {/* Charts Section */}
        <div className="charts-section">
          <div className="chart-container">
            {/* Bar Chart: Prepared vs Consumed */}
            <div className="chart-card">
              <h3>📊 Food Comparison</h3>
              <div className="simple-bar-chart">
                <div className="chart-bar-group">
                  <div className="bar-wrapper">
                    <div
                      className="bar bar-prepared"
                      style={{
                        height: foodPrepared > 0 ? (foodPrepared / Math.max(foodPrepared, foodConsumed)) * 200 + "px" : "0px",
                      }}
                    >
                      <span className="bar-label">{foodPrepared}</span>
                    </div>
                    <p className="bar-name">Prepared</p>
                  </div>

                  <div className="bar-wrapper">
                    <div
                      className="bar bar-consumed"
                      style={{
                        height: foodConsumed > 0 ? (foodConsumed / Math.max(foodPrepared, foodConsumed)) * 200 + "px" : "0px",
                      }}
                    >
                      <span className="bar-label">{foodConsumed}</span>
                    </div>
                    <p className="bar-name">Consumed</p>
                  </div>

                  <div className="bar-wrapper">
                    <div
                      className="bar bar-waste"
                      style={{
                        height: foodWaste > 0 ? (foodWaste / Math.max(foodPrepared, foodConsumed)) * 200 + "px" : "0px",
                      }}
                    >
                      <span className="bar-label">{foodWaste}</span>
                    </div>
                    <p className="bar-name">Waste</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pie Chart: Consumption vs Waste */}
            <div className="chart-card">
              <h3>🥧 Consumption Analysis</h3>
              <div className="pie-chart-container">
                <svg viewBox="0 0 100 100" className="pie-chart">
                  {/* Consumed slice */}
                  {consumptionPercentage > 0 && (
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#4caf50"
                      strokeWidth="30"
                      strokeDasharray={`${(consumptionPercentage / 100) * 251.2} 251.2`}
                      strokeDashoffset="0"
                      transform="rotate(-90 50 50)"
                    />
                  )}
                  {/* Waste slice */}
                  {wastePercentage > 0 && (
                    <circle
                      cx="50"
                      cy="50"
                      r="40"
                      fill="none"
                      stroke="#f44336"
                      strokeWidth="30"
                      strokeDasharray={`${(wastePercentage / 100) * 251.2} 251.2`}
                      strokeDashoffset={-((consumptionPercentage / 100) * 251.2)}
                      transform="rotate(-90 50 50)"
                    />
                  )}
                </svg>
                <div className="pie-legend">
                  <div className="legend-item">
                    <span className="legend-color legend-consumed"></span>
                    <span className="legend-text">Consumed: {consumptionPercentage}%</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-color legend-waste"></span>
                    <span className="legend-text">Waste: {wastePercentage}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics Table */}
        <div className="statistics-section">
          <h3>📋 Detailed Statistics</h3>
          <div className="stats-table">
            <div className="stat-row">
              <span className="stat-label">Total Students</span>
              <span className="stat-value">{totalStudents}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Total Meals Served</span>
              <span className="stat-value">{totalMealsServed}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Food Prepared (units)</span>
              <span className="stat-value">{foodPrepared}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Food Consumed (units)</span>
              <span className="stat-value">{foodConsumed}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Food Waste (units)</span>
              <span className="stat-value stat-waste">{foodWaste}</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Consumption Rate</span>
              <span className="stat-value stat-success">{consumptionPercentage}%</span>
            </div>
            <div className="stat-row">
              <span className="stat-label">Waste Rate</span>
              <span className="stat-value stat-warning">{wastePercentage}%</span>
            </div>
          </div>
        </div>

        {/* Insights */}
        <div className="insights-section">
          <h3>💡 Insights & Recommendations</h3>
          <div className="insights-grid">
            <div className="insight-card">
              <span className="insight-icon">📈</span>
              <h4>Consumption Rate</h4>
              <p>
                {consumptionPercentage >= 90
                  ? "✅ Excellent consumption rate! Very minimal waste."
                  : consumptionPercentage >= 75
                  ? "🟡 Good consumption rate. Room for slight improvement."
                  : "⚠️ Low consumption rate. Review portion planning."}
              </p>
            </div>

            <div className="insight-card">
              <span className="insight-icon">🎯</span>
              <h4>Waste Management</h4>
              <p>
                {wastePercentage <= 10
                  ? "✅ Excellent waste management. Keep up the good work!"
                  : wastePercentage <= 20
                  ? "🟡 Moderate waste levels. Optimization possible."
                  : "⚠️ High waste levels. Review preparation quantities."}
              </p>
            </div>

            <div className="insight-card">
              <span className="insight-icon">👥</span>
              <h4>Meal Coverage</h4>
              <p>
                {totalMealsServed >= totalStudents * 2
                  ? "✅ High meal attendance. Students are regularly attending."
                  : totalMealsServed >= totalStudents
                  ? "🟡 Moderate attendance. Encourage more participation."
                  : "⚠️ Low attendance. Improve meal appeal and timing."}
              </p>
            </div>
          </div>
        </div>

        {/* Refresh Button */}
        <div className="action-section">
          <button onClick={fetchDashboardData} className="btn btn-primary">
            🔄 Refresh Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default AnalyticsDashboard;
