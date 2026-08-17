import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Menu from "./pages/Menu";
import ExtraFood from "./pages/ExtraFood";
import MyOrders from "./pages/MyOrders";
import AdminOrders from "./pages/AdminOrders";
import Attendance from "./pages/Attendance";
import Settings from "./pages/Settings";
import UserProfile from "./pages/UserProfile";
import AnalyticsDashboard from "./pages/AnalyticsDashboard";
import Notifications from "./pages/Notifications";
import Feedback from "./pages/Feedback";
import AdminFeedback from "./pages/AdminFeedback";
import Bill from "./pages/Bill";

import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./components/Layout";

import "./App.css";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const userData = localStorage.getItem("user");

    if (token && token !== "undefined" && token !== "null") {
      setIsAuthenticated(true);

      if (userData) {
        try {
          setUser(JSON.parse(userData));
        } catch (e) {
          console.log("User parse error:", e);
        }
      }
    } else {
      setIsAuthenticated(false);
    }

    setLoading(false);
  }, []);

  // 🔥 IMPORTANT: loader should NOT break layout
  if (loading) {
    return (
      <div className="loading-screen">
        Loading...
      </div>
    );
  }

  return (
    <Router>
      <Routes>

        {/* 🔑 LOGIN */}
        <Route
          path="/"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Login setIsAuthenticated={setIsAuthenticated} setUser={setUser} />
            )
          }
        />

        {/* 📝 SIGNUP */}
        <Route
          path="/signup"
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <Signup setIsAuthenticated={setIsAuthenticated} setUser={setUser} />
            )
          }
        />

        {/* 🔐 PROTECTED + LAYOUT */}
        <Route
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Layout
                user={user}
                setIsAuthenticated={setIsAuthenticated}
                setUser={setUser}
              />
            </ProtectedRoute>
          }
        >
          {/* 🔥 DEFAULT REDIRECT */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* 📊 DASHBOARD */}
          <Route path="/dashboard" element={<Dashboard user={user} />} />

          {/* 🍽 MENU */}
          <Route path="/menu" element={<Menu user={user} />} />

          {/* 🍕 EXTRA FOOD */}
          <Route path="/extra-food" element={<ExtraFood user={user} />} />

          {/* 📦 ORDERS - ADMIN VIEW */}
          <Route path="/admin-orders" element={<AdminOrders user={user} />} />

          {/* 📦 ORDERS - STUDENT VIEW (MY ORDERS) */}
          <Route path="/orders" element={<MyOrders user={user} setIsAuthenticated={setIsAuthenticated} setUser={setUser} />} />

          {/* 👥 ATTENDANCE */}
          <Route path="/attendance" element={<Attendance user={user} />} />

          {/* ⚙ SETTINGS */}
          <Route path="/settings" element={<Settings user={user} />} />

          {/* 👤 PROFILE */}
          <Route path="/profile" element={<UserProfile user={user} />} />

          {/* 📊 ANALYTICS */}
          <Route path="/analytics-dashboard" element={<AnalyticsDashboard />} />

          {/* 🔔 NOTIFICATIONS */}
          <Route path="/notifications" element={<Notifications user={user} />} />

          {/* 💬 FEEDBACK */}
          <Route path="/feedback" element={<Feedback user={user} />} />

          {/* 🧠 ADMIN FEEDBACK */}
          <Route path="/admin-feedback" element={<AdminFeedback user={user} />} />

          {/* 💰 BILL */}
          <Route path="/bill" element={<Bill />} />
        </Route>

        {/* ❌ FALLBACK */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Routes>
    </Router>
  );
}

export default App;