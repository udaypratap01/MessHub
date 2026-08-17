import React, { useState, useEffect } from "react";
import axios from "axios";

function AdminOrders({ user }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentUpdating, setPaymentUpdating] = useState({});
  const [paymentSuccess, setPaymentSuccess] = useState("");

  // 🔥 Fetch all orders on component mount
  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          setError("Not logged in. Please login first.");
          setLoading(false);
          return;
        }

        console.log("📋 Fetching all orders for admin...");

        const response = await axios.get("http://localhost:8080/api/orders/all", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        console.log("✅ Orders fetched:", response.data);

        // Extract orders array from response
        const ordersList = response.data.orders || response.data || [];
        setOrders(ordersList);

        if (ordersList.length === 0) {
          console.log("ℹ️ No orders found");
        }

      } catch (err) {
        console.error("❌ Error fetching orders:", err);
        const errorMessage = err.response?.data?.message || err.message || "Failed to load orders";
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    fetchAllOrders();
  }, []);

  // 💳 Mark order as paid
  const handleMarkAsPaid = async (orderId) => {
    try {
      setPaymentUpdating(prev => ({ ...prev, [orderId]: true }));
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Not logged in. Please login first.");
        return;
      }

      console.log("💳 Marking order as paid:", orderId);

      const response = await axios.put(
        `http://localhost:8080/api/orders/pay/${orderId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("✅ Payment updated:", response.data);

      // Update local state
      setOrders(orders.map(order =>
        order.id === orderId
          ? { ...order, paymentStatus: "PAID" }
          : order
      ));

      setPaymentSuccess("Payment marked as completed!");
      setTimeout(() => setPaymentSuccess(""), 3000);

    } catch (err) {
      console.error("❌ Error updating payment:", err);
      const errorMessage = err.response?.data?.message || err.message || "Failed to update payment";
      setError(errorMessage);
    } finally {
      setPaymentUpdating(prev => ({ ...prev, [orderId]: false }));
    }
  };

  // 🎨 Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-IN", {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateString;
    }
  };

  // 🎨 Render content
  return (
    <div style={{ padding: "20px" }}>
      <h2 style={{ color: "#ffffff" }}>📊 Admin Orders Dashboard</h2>
      <p style={{ color: "#cbd5f5" }}>View all student food orders</p>

      {/* ❌ Error message */}
      {error && (
        <div style={{
          backgroundColor: "rgba(239, 68, 68, 0.15)",
          color: "#fca5a5",
          padding: "12px",
          borderRadius: "8px",
          marginBottom: "15px",
          border: "1px solid rgba(239, 68, 68, 0.3)",
        }}>
          ❌ {error}
        </div>
      )}

      {/* ✅ Success message */}
      {paymentSuccess && (
        <div style={{
          backgroundColor: "rgba(16, 185, 129, 0.15)",
          color: "#86efac",
          padding: "12px",
          borderRadius: "8px",
          marginBottom: "15px",
          border: "1px solid rgba(16, 185, 129, 0.3)",
        }}>
          ✅ {paymentSuccess}
        </div>
      )}

      {/* ⏳ Loading state */}
      {loading && (
        <div style={{
          textAlign: "center",
          padding: "30px",
          color: "#cbd5f5",
        }}>
          <p>⏳ Loading orders...</p>
        </div>
      )}

      {/* ✅ Orders table */}
      {!loading && !error && (
        <>
          <div style={{
            backgroundColor: "rgba(99, 102, 241, 0.1)",
            padding: "12px",
            borderRadius: "8px",
            marginBottom: "15px",
            border: "1px solid rgba(99, 102, 241, 0.2)",
            color: "#cbd5f5",
          }}>
            <strong>📦 Total Orders: {orders.length}</strong>
          </div>

          {orders.length === 0 ? (
            <div style={{
              textAlign: "center",
              padding: "40px",
              backgroundColor: "rgba(255,255,255,0.05)",
              borderRadius: "8px",
              color: "#cbd5f5",
              border: "1px solid rgba(255,255,255,0.1)",
            }}>
              <p>📭 No orders yet</p>
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{
                width: "100%",
                borderCollapse: "collapse",
                backgroundColor: "rgba(255,255,255,0.05)",
                boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                borderRadius: "8px",
                overflow: "hidden",
              }}>
                <thead>
                  <tr style={{
                    background: "linear-gradient(45deg, #6a5af9, #8f94fb)",
                    color: "#ffffff",
                  }}>
                    <th style={{
                      padding: "14px 12px",
                      textAlign: "left",
                      fontWeight: "bold",
                      borderBottom: "2px solid rgba(255,255,255,0.2)",
                    }}>
                      Student Name
                    </th>
                    <th style={{
                      padding: "14px 12px",
                      textAlign: "left",
                      fontWeight: "bold",
                      borderBottom: "2px solid rgba(255,255,255,0.2)",
                    }}>
                      Student Email
                    </th>
                    <th style={{
                      padding: "14px 12px",
                      textAlign: "left",
                      fontWeight: "bold",
                      borderBottom: "2px solid rgba(255,255,255,0.2)",
                    }}>
                      Food Name
                    </th>
                    <th style={{
                      padding: "14px 12px",
                      textAlign: "center",
                      fontWeight: "bold",
                      borderBottom: "2px solid rgba(255,255,255,0.2)",
                    }}>
                      Quantity
                    </th>
                    <th style={{
                      padding: "14px 12px",
                      textAlign: "right",
                      fontWeight: "bold",
                      borderBottom: "2px solid rgba(255,255,255,0.2)",
                    }}>
                      Total Price (₹)
                    </th>
                    <th style={{
                      padding: "14px 12px",
                      textAlign: "left",
                      fontWeight: "bold",
                      borderBottom: "2px solid rgba(255,255,255,0.2)",
                    }}>
                      Order Date
                    </th>
                    <th style={{
                      padding: "14px 12px",
                      textAlign: "center",
                      fontWeight: "bold",
                      borderBottom: "2px solid rgba(255,255,255,0.2)",
                    }}>
                      Payment Status
                    </th>
                    <th style={{
                      padding: "14px 12px",
                      textAlign: "center",
                      fontWeight: "bold",
                      borderBottom: "2px solid rgba(255,255,255,0.2)",
                    }}>
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr
                      key={order.id}
                      style={{
                        backgroundColor: index % 2 === 0 ? "transparent" : "rgba(0,0,0,0.25)",
                        borderBottom: "1px solid rgba(255,255,255,0.1)",
                        transition: "background-color 0.2s ease",
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "rgba(102,126,234,0.2)"}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = index % 2 === 0 ? "transparent" : "rgba(0,0,0,0.25)"}
                    >
                      <td style={{
                        padding: "12px",
                        textAlign: "left",
                        fontWeight: "500",
                        color: "#ffffff",
                      }}>
                        {order.userName || "Unknown"}
                      </td>
                      <td style={{
                        padding: "12px",
                        textAlign: "left",
                        color: "#cfcfff",
                      }}>
                        {order.userEmail}
                      </td>
                      <td style={{
                        padding: "12px",
                        textAlign: "left",
                        color: "#ffffff",
                      }}>
                        {order.foodName || "Unknown"}
                      </td>
                      <td style={{
                        padding: "12px",
                        textAlign: "center",
                        fontWeight: "500",
                        color: "#ffffff",
                      }}>
                        {order.quantity}
                      </td>
                      <td style={{
                        padding: "12px",
                        textAlign: "right",
                        fontWeight: "500",
                        color: "#4caf50",
                      }}>
                        ₹{order.totalPrice?.toFixed(2) || "0.00"}
                      </td>
                      <td style={{
                        padding: "12px",
                        textAlign: "left",
                        fontSize: "0.9em",
                        color: "#ffffff",
                      }}>
                        {formatDate(order.createdAt)}
                      </td>
                      <td style={{
                        padding: "12px",
                        textAlign: "center",
                      }}>
                        <span style={{
                          backgroundColor: order.paymentStatus === "PAID" ? "#10b981" : "#f59e0b",
                          color: "white",
                          padding: "6px 10px",
                          borderRadius: "6px",
                          fontSize: "0.85em",
                          fontWeight: "600",
                          display: "inline-block",
                          boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
                        }}>
                          {order.paymentStatus === "PAID" ? "✅ Paid" : "⏳ Pending"}
                        </span>
                      </td>
                      <td style={{
                        padding: "12px",
                        textAlign: "center",
                      }}>
                        {order.paymentStatus === "PAID" ? (
                          <span style={{
                            color: "#10b981",
                            fontWeight: "600",
                          }}>
                            ✅ Completed
                          </span>
                        ) : (
                          <button
                            onClick={() => handleMarkAsPaid(order.id)}
                            disabled={paymentUpdating[order.id]}
                            style={{
                              background: paymentUpdating[order.id] 
                                ? "rgba(255,255,255,0.1)" 
                                : "linear-gradient(135deg, #6366f1, #8b5cf6)",
                              color: "white",
                              padding: "8px 14px",
                              border: "none",
                              borderRadius: "6px",
                              cursor: paymentUpdating[order.id] ? "not-allowed" : "pointer",
                              fontSize: "0.85em",
                              fontWeight: "600",
                              transition: "all 0.2s ease",
                              opacity: paymentUpdating[order.id] ? 0.6 : 1,
                            }}
                            onMouseEnter={(e) => {
                              if (!paymentUpdating[order.id]) {
                                e.currentTarget.style.boxShadow = "0 4px 12px rgba(99, 102, 241, 0.4)";
                                e.currentTarget.style.transform = "translateY(-2px)";
                              }
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.boxShadow = "none";
                              e.currentTarget.style.transform = "translateY(0)";
                            }}
                          >
                            {paymentUpdating[order.id] ? "⏳ Updating..." : "💳 Mark Paid"}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* 📊 Summary stats */}
          {orders.length > 0 && (
            <div style={{
              marginTop: "20px",
              padding: "15px",
              backgroundColor: "rgba(255,255,255,0.05)",
              borderRadius: "8px",
              border: "1px solid rgba(255,255,255,0.1)",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "15px",
            }}>
              <div>
                <p style={{ margin: "0 0 8px 0", color: "#cbd5f5", fontSize: "0.9em", fontWeight: "500" }}>
                  Total Orders
                </p>
                <p style={{ margin: "0", fontSize: "1.8em", fontWeight: "bold", color: "#6366f1" }}>
                  {orders.length}
                </p>
              </div>
              <div>
                <p style={{ margin: "0 0 8px 0", color: "#cbd5f5", fontSize: "0.9em", fontWeight: "500" }}>
                  Total Revenue
                </p>
                <p style={{ margin: "0", fontSize: "1.8em", fontWeight: "bold", color: "#10b981" }}>
                  ₹{orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0).toFixed(2)}
                </p>
              </div>
              <div>
                <p style={{ margin: "0 0 8px 0", color: "#cbd5f5", fontSize: "0.9em", fontWeight: "500" }}>
                  Total Items Booked
                </p>
                <p style={{ margin: "0", fontSize: "1.8em", fontWeight: "bold", color: "#f59e0b" }}>
                  {orders.reduce((sum, order) => sum + (order.quantity || 0), 0)}
                </p>
              </div>
              <div>
                <p style={{ margin: "0 0 8px 0", color: "#cbd5f5", fontSize: "0.9em", fontWeight: "500" }}>
                  Unique Customers
                </p>
                <p style={{ margin: "0", fontSize: "1.8em", fontWeight: "bold", color: "#8b5cf6" }}>
                  {new Set(orders.map(o => o.userEmail)).size}
                </p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default AdminOrders;
