import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from '../components/Loader';
import '../styles/ModernMyOrders.css';

function MyOrders({ user, setIsAuthenticated, setUser }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");

  // 🔥 FETCH USER'S ORDERS
  useEffect(() => {
    const fetchMyOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          setError("Not logged in. Please login first.");
          setLoading(false);
          return;
        }

        console.log("📦 Fetching my orders for user:", user?.email);

        const response = await axios.get("http://localhost:8080/api/orders/my", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        console.log("✅ My Orders Response:", response.data);

        // Handle both array and object responses
        const ordersList = Array.isArray(response.data) ? response.data : response.data.orders || [];
        
        // Normalize order IDs
        const normalizedOrders = ordersList.map(order => ({
          ...order,
          id: order._id || order.id,
          _id: order._id || order.id
        }));

        console.log("✅ Normalized Orders:", normalizedOrders);

        setOrders(normalizedOrders);

        if (normalizedOrders.length === 0) {
          console.log("ℹ️ No orders found for this user");
        }

      } catch (err) {
        console.error("❌ Error fetching orders:", err);
        const errorMessage = err.response?.data?.message || err.message || "Failed to load orders";
        setError(errorMessage);
        
        // Handle auth errors
        if (err.response?.status === 401 || err.response?.status === 403) {
          console.log("🔐 Auth error - clearing token");
          localStorage.removeItem("token");
          setIsAuthenticated(false);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [user, setIsAuthenticated]);

  // 🔥 FILTER ORDERS BY STATUS
  const getFilteredOrders = () => {
    if (filterStatus === "ALL") {
      return orders;
    }
    return orders.filter(order => order.status === filterStatus);
  };

  const filteredOrders = getFilteredOrders();

  // 🎨 GET STATUS COLOR AND ICON
  const getStatusDisplay = (status) => {
    const statusMap = {
      BOOKED: { color: "#fbbf24", icon: "📌", label: "Booked" },
      CANCELLED: { color: "#ef4444", icon: "❌", label: "Cancelled" },
      COMPLETED: { color: "#10b981", icon: "✅", label: "Completed" },
      PENDING: { color: "#f59e0b", icon: "⏳", label: "Pending" }
    };
    return statusMap[status] || { color: "#94a3b8", icon: "❓", label: status };
  };

  // 🎨 GET PAYMENT STATUS COLOR
  const getPaymentStatusDisplay = (paymentStatus) => {
    const paymentMap = {
      PAID: { color: "#10b981", icon: "💳", label: "Paid" },
      PENDING: { color: "#f59e0b", icon: "⏳", label: "Pending" },
      CANCELLED: { color: "#ef4444", icon: "❌", label: "Cancelled" }
    };
    return paymentMap[paymentStatus] || { color: "#94a3b8", icon: "❓", label: paymentStatus };
  };

  // 📅 FORMAT DATE
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return <Loader fullPage={true} size="medium" text="Loading your orders..." />;
  }

  return (
    <div className="my-orders-page">
      {/* HEADER */}
      <div className="orders-page-header">
        <div className="header-content">
          <h1>📦 My Orders</h1>
          <p>Track your food orders and status</p>
        </div>
        <div className="orders-count">
          <span className="count-badge">{orders.length}</span>
          <span>Total Orders</span>
        </div>
      </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="error-banner">
          <span className="error-icon">⚠️</span>
          <div>
            <p className="error-title">Error Loading Orders</p>
            <p className="error-message">{error}</p>
          </div>
          <button className="error-close" onClick={() => setError("")}>×</button>
        </div>
      )}

      {/* FILTER BUTTONS */}
      <div className="filter-section">
        <div className="filter-buttons">
          {["ALL", "BOOKED", "COMPLETED", "CANCELLED"].map(status => (
            <button
              key={status}
              className={`filter-btn ${filterStatus === status ? "active" : ""}`}
              onClick={() => setFilterStatus(status)}
            >
              {status === "ALL" ? "🔄 All" : `${getStatusDisplay(status).icon} ${getStatusDisplay(status).label}`}
              <span className="filter-count">
                {status === "ALL" ? orders.length : orders.filter(o => o.status === status).length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* ORDERS LIST */}
      <div className="orders-container">
        {filteredOrders.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>No Orders Found</h3>
            <p>
              {filterStatus === "ALL"
                ? "You haven't placed any orders yet."
                : `No ${getStatusDisplay(filterStatus).label.toLowerCase()} orders.`}
            </p>
            <a href="/extra-food" className="btn btn-primary">
              🍕 Order Food Now
            </a>
          </div>
        ) : (
          <div className="orders-grid">
            {filteredOrders.map((order, index) => {
              const statusDisplay = getStatusDisplay(order.status || "PENDING");
              const paymentDisplay = getPaymentStatusDisplay(order.paymentStatus || "PENDING");

              return (
                <div
                  key={order._id || order.id || index}
                  className="order-card"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {/* ORDER HEADER */}
                  <div className="order-header">
                    <div className="order-id-section">
                      <span className="order-id-label">Order ID</span>
                      <span className="order-id">{String(order._id || order.id).substring(0, 8).toUpperCase()}</span>
                    </div>
                    <div className="order-status-badges">
                      <span
                        className="status-badge"
                        style={{ backgroundColor: statusDisplay.color }}
                        title={statusDisplay.label}
                      >
                        {statusDisplay.icon} {statusDisplay.label}
                      </span>
                      <span
                        className="payment-badge"
                        style={{ backgroundColor: paymentDisplay.color }}
                        title={paymentDisplay.label}
                      >
                        {paymentDisplay.icon} {paymentDisplay.label}
                      </span>
                    </div>
                  </div>

                  {/* ORDER DETAILS */}
                  <div className="order-details">
                    {/* FOOD INFO */}
                    <div className="detail-row">
                      <span className="detail-label">🍽️ Food Item</span>
                      <span className="detail-value">{order.foodName || "Unknown"}</span>
                    </div>

                    {/* QUANTITY & PRICE */}
                    <div className="detail-row">
                      <span className="detail-label">📊 Quantity</span>
                      <span className="detail-value">{order.quantity || 0} units</span>
                    </div>

                    <div className="detail-row">
                      <span className="detail-label">💰 Price Per Unit</span>
                      <span className="detail-value">₹{(order.pricePerUnit || 0).toFixed(2)}</span>
                    </div>

                    <div className="detail-row total-price-row">
                      <span className="detail-label">💵 Total Price</span>
                      <span className="detail-value total-price">₹{(order.totalPrice || 0).toFixed(2)}</span>
                    </div>

                    {/* DATE */}
                    <div className="detail-row">
                      <span className="detail-label">📅 Order Date</span>
                      <span className="detail-value">{formatDate(order.createdAt)}</span>
                    </div>
                  </div>

                  {/* ORDER ACTIONS */}
                  <div className="order-actions">
                    {order.status === "BOOKED" && order.paymentStatus === "PENDING" && (
                      <button className="btn btn-pay" disabled>
                        💳 Payment Pending
                      </button>
                    )}
                    {order.status === "COMPLETED" && (
                      <button className="btn btn-success" disabled>
                        ✅ Order Completed
                      </button>
                    )}
                    {order.status === "CANCELLED" && (
                      <button className="btn btn-cancelled" disabled>
                        ❌ Cancelled
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* SUMMARY SECTION */}
      {orders.length > 0 && (
        <div className="orders-summary">
          <div className="summary-card">
            <div className="summary-icon">📦</div>
            <div className="summary-content">
              <p className="summary-label">Total Orders</p>
              <p className="summary-value">{orders.length}</p>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon">💵</div>
            <div className="summary-content">
              <p className="summary-label">Total Spent</p>
              <p className="summary-value">₹{orders.reduce((sum, o) => sum + (o.totalPrice || 0), 0).toFixed(2)}</p>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon">✅</div>
            <div className="summary-content">
              <p className="summary-label">Completed</p>
              <p className="summary-value">{orders.filter(o => o.status === "COMPLETED").length}</p>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon">⏳</div>
            <div className="summary-content">
              <p className="summary-label">Pending</p>
              <p className="summary-value">{orders.filter(o => o.status === "BOOKED").length}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default MyOrders;
