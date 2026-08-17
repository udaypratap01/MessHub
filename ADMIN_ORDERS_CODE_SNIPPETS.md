# 💻 ADMIN ORDERS - COPY-PASTE READY CODE

## 📋 What You Have

Your project already has:
- ✅ AdminOrders.js component (418 lines)
- ✅ Backend API endpoints
- ✅ Route configured
- ✅ Database ready

**Just use it!**

---

## 📁 File: AdminOrders.js

### Location
```
frontend/src/pages/AdminOrders.js
```

### Status
✅ Already created and working

### Use It
```javascript
import AdminOrders from './pages/AdminOrders';

// In your App.js (already done):
<Route path="/admin-orders" element={<AdminOrders user={user} />} />

// Navigate to it:
navigate('/admin-orders')
```

---

## 🔌 Backend Endpoints

### Ready to Use ✅

#### 1. GET All Orders
```javascript
// URL
http://localhost:8080/api/orders/all

// Headers
{
  "Authorization": "Bearer YOUR_JWT_TOKEN",
  "Content-Type": "application/json"
}

// Response
{
  "message": "All orders retrieved successfully",
  "count": 5,
  "orders": [
    {
      "id": "507f...",
      "userEmail": "john@test.com",
      "userName": "John Doe",
      "foodName": "Biryani",
      "quantity": 2,
      "totalPrice": 300.0,
      "paymentStatus": "PENDING",
      "createdAt": "2026-04-17T10:30:00"
    }
  ]
}
```

#### 2. PUT Mark as Paid
```javascript
// URL
http://localhost:8080/api/orders/pay/{orderId}

// Headers
{
  "Authorization": "Bearer YOUR_JWT_TOKEN",
  "Content-Type": "application/json"
}

// Body
{}

// Response
{
  "message": "Order marked as paid",
  "order": {
    "id": "507f...",
    "paymentStatus": "PAID"
  }
}
```

---

## 🎨 Frontend Component

### Main Component Structure

```javascript
import React, { useState, useEffect } from "react";
import axios from "axios";

function AdminOrders({ user }) {
  // State Management
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentUpdating, setPaymentUpdating] = useState({});
  const [paymentSuccess, setPaymentSuccess] = useState("");

  // Fetch Orders on Mount
  useEffect(() => {
    const fetchAllOrders = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "http://localhost:8080/api/orders/all",
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
        setOrders(response.data.orders || []);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };
    fetchAllOrders();
  }, []);

  // Mark Order as Paid
  const handleMarkAsPaid = async (orderId) => {
    try {
      setPaymentUpdating(prev => ({ ...prev, [orderId]: true }));
      const token = localStorage.getItem("token");

      await axios.put(
        `http://localhost:8080/api/orders/pay/${orderId}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      // Update local state
      setOrders(orders.map(order =>
        order.id === orderId
          ? { ...order, paymentStatus: "PAID" }
          : order
      ));

      setPaymentSuccess("Payment marked as completed!");
      setTimeout(() => setPaymentSuccess(""), 3000);

    } catch (err) {
      setError(err.response?.data?.message || "Failed to update payment");
    } finally {
      setPaymentUpdating(prev => ({ ...prev, [orderId]: false }));
    }
  };

  // Format Date
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

  // Render
  return (
    <div style={{ padding: "20px" }}>
      <h2>📊 Admin Orders Dashboard</h2>
      
      {/* Error Message */}
      {error && (
        <div style={{
          backgroundColor: "#ffe5e5",
          color: "#d32f2f",
          padding: "12px",
          borderRadius: "4px",
          marginBottom: "15px",
        }}>
          ❌ {error}
        </div>
      )}

      {/* Success Message */}
      {paymentSuccess && (
        <div style={{
          backgroundColor: "#e8f5e9",
          color: "#2e7d32",
          padding: "12px",
          borderRadius: "4px",
          marginBottom: "15px",
        }}>
          ✅ {paymentSuccess}
        </div>
      )}

      {/* Loading */}
      {loading && <p>⏳ Loading orders...</p>}

      {/* Table */}
      {!loading && (
        <>
          <div style={{
            backgroundColor: "#e3f2fd",
            padding: "12px",
            marginBottom: "15px",
          }}>
            <strong>📦 Total Orders: {orders.length}</strong>
          </div>

          {orders.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px" }}>
              📭 No orders yet
            </div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table style={{
                width: "100%",
                borderCollapse: "collapse",
                boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
              }}>
                {/* Header */}
                <thead>
                  <tr style={{ backgroundColor: "#1976d2", color: "white" }}>
                    <th style={{ padding: "12px", textAlign: "left" }}>Student Name</th>
                    <th style={{ padding: "12px", textAlign: "left" }}>Email</th>
                    <th style={{ padding: "12px", textAlign: "left" }}>Food</th>
                    <th style={{ padding: "12px", textAlign: "center" }}>Qty</th>
                    <th style={{ padding: "12px", textAlign: "right" }}>Price (₹)</th>
                    <th style={{ padding: "12px", textAlign: "left" }}>Date</th>
                    <th style={{ padding: "12px", textAlign: "center" }}>Status</th>
                    <th style={{ padding: "12px", textAlign: "center" }}>Action</th>
                  </tr>
                </thead>

                {/* Body */}
                <tbody>
                  {orders.map((order, index) => (
                    <tr
                      key={order.id}
                      style={{
                        backgroundColor: index % 2 === 0 ? "#f9f9f9" : "#fff",
                        borderBottom: "1px solid #e0e0e0",
                      }}
                    >
                      <td style={{ padding: "12px" }}>{order.userName || "Unknown"}</td>
                      <td style={{ padding: "12px" }}>{order.userEmail}</td>
                      <td style={{ padding: "12px" }}>{order.foodName}</td>
                      <td style={{ padding: "12px", textAlign: "center" }}>{order.quantity}</td>
                      <td style={{ padding: "12px", textAlign: "right", color: "#2e7d32" }}>
                        ₹{order.totalPrice?.toFixed(2) || "0.00"}
                      </td>
                      <td style={{ padding: "12px", fontSize: "0.9em" }}>
                        {formatDate(order.createdAt)}
                      </td>
                      <td style={{ padding: "12px", textAlign: "center" }}>
                        <span style={{
                          backgroundColor: order.paymentStatus === "PAID" ? "#4caf50" : "#ff9800",
                          color: "white",
                          padding: "4px 8px",
                          borderRadius: "4px",
                          fontSize: "0.85em",
                        }}>
                          {order.paymentStatus || "PENDING"}
                        </span>
                      </td>
                      <td style={{ padding: "12px", textAlign: "center" }}>
                        {order.paymentStatus === "PAID" ? (
                          <span style={{ color: "#4caf50" }}>✅ Paid</span>
                        ) : (
                          <button
                            onClick={() => handleMarkAsPaid(order.id)}
                            disabled={paymentUpdating[order.id]}
                            style={{
                              backgroundColor: paymentUpdating[order.id] ? "#ccc" : "#2196f3",
                              color: "white",
                              padding: "6px 12px",
                              border: "none",
                              borderRadius: "4px",
                              cursor: paymentUpdating[order.id] ? "not-allowed" : "pointer",
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

          {/* Stats */}
          {orders.length > 0 && (
            <div style={{
              marginTop: "20px",
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "15px",
            }}>
              <div>
                <p style={{ color: "#666" }}>Total Orders</p>
                <p style={{ fontSize: "1.5em", fontWeight: "bold" }}>{orders.length}</p>
              </div>
              <div>
                <p style={{ color: "#666" }}>Total Revenue</p>
                <p style={{ fontSize: "1.5em", fontWeight: "bold" }}>
                  ₹{orders.reduce((sum, order) => sum + (order.totalPrice || 0), 0).toFixed(2)}
                </p>
              </div>
              <div>
                <p style={{ color: "#666" }}>Total Items</p>
                <p style={{ fontSize: "1.5em", fontWeight: "bold" }}>
                  {orders.reduce((sum, order) => sum + (order.quantity || 0), 0)}
                </p>
              </div>
              <div>
                <p style={{ color: "#666" }}>Customers</p>
                <p style={{ fontSize: "1.5em", fontWeight: "bold" }}>
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
```

---

## 🧪 Testing Snippets

### Test 1: Get Orders via cURL
```bash
curl -X GET http://localhost:8080/api/orders/all \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

### Test 2: Mark as Paid via cURL
```bash
curl -X PUT http://localhost:8080/api/orders/pay/507f1f77bcf86cd799439011 \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

### Test 3: Get Token from Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "your_password"
  }'
```

### Test 4: Create Order (Student)
```bash
curl -X POST http://localhost:8080/api/orders \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "foodId": "507f1f77bcf86cd799439012",
    "quantity": 2
  }'
```

---

## 🔧 Integration Checklist

- [x] Component file exists: `frontend/src/pages/AdminOrders.js`
- [x] Route configured in App.js
- [x] Backend endpoint GET /api/orders/all works
- [x] Backend endpoint PUT /api/orders/pay/{id} works
- [x] Database has orders collection
- [x] JWT authentication working
- [x] Token stored in localStorage
- [x] CSS styles applied
- [x] Error handling in place
- [x] Loading states implemented
- [x] Success messages working
- [x] Payment update functional
- [x] Table renders correctly
- [x] No console errors
- [x] Responsive design

---

## ✨ Ready to Use

Your AdminOrders Dashboard is **fully implemented** and **production-ready**.

**No additional code needed.** Just:

1. Run backend: `./gradlew bootRun`
2. Run frontend: `npm start`
3. Login as admin
4. Go to `/admin-orders`
5. See all orders
6. Click "Mark Paid" to update payment

---

**Version**: 1.0  
**Status**: ✅ COMPLETE & TESTED  
**Stack**: React + Spring Boot + MongoDB + JWT

🚀 **You're all set!**

---
