import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../styles/Bill.css';

function Bill() {
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Get user from localStorage
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    } else {
      setError('User not logged in');
      setLoading(false);
      return;
    }

    fetchBill();
  }, []);

  const fetchBill = async () => {
    try {
      setLoading(true);
      setError('');

      // Get token from localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        setError('No authorization token found. Please login again.');
        setLoading(false);
        return;
      }

      // Fetch bill data
      const response = await axios.get(
        'http://localhost:8080/api/bill/my',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      setBill(response.data);
      setError('');
    } catch (err) {
      console.error('Error fetching bill:', err);
      const errorMessage = err.response?.data?.message || err.message || 'Failed to fetch bill';
      setError(errorMessage);
      setBill(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bill-container">
        <div className="loading">
          <p>Loading your bill...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bill-container">
        <div className="error-box">
          <h2>❌ Error</h2>
          <p>{error}</p>
          <button onClick={fetchBill} className="retry-btn">
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!bill) {
    return (
      <div className="bill-container">
        <div className="no-data">
          <h2>📋 No Bill Data</h2>
          <p>Unable to load your bill information.</p>
        </div>
      </div>
    );
  }

  // Ensure orders array exists
  const orders = bill.orders && Array.isArray(bill.orders) ? bill.orders : [];
  const totalBill = bill.totalFoodBill || 0;
  const orderCount = bill.orderCount || orders.length || 0;

  return (
    <div className="bill-container">
      <div className="bill-header">
        <h1>🧾 Your Food Order Bill</h1>
        <p className="email">📧 {user?.email || 'N/A'}</p>
      </div>

      {/* Summary Cards */}
      <div className="summary-cards">
        <div className="summary-card total-bill">
          <h3>Total Bill Amount</h3>
          <p className="amount">₹{totalBill.toFixed(2)}</p>
        </div>

        <div className="summary-card order-count">
          <h3>Total Orders</h3>
          <p className="count">{orderCount}</p>
        </div>

        {orderCount > 0 && (
          <div className="summary-card avg-order">
            <h3>Average per Order</h3>
            <p className="amount">
              ₹{(totalBill / orderCount).toFixed(2)}
            </p>
          </div>
        )}
      </div>

      {/* Orders Table */}
      {orders && orders.length > 0 ? (
        <div className="orders-section">
          <h2>📦 Your Orders</h2>
          <div className="table-responsive">
            <table className="orders-table">
              <thead>
                <tr>
                  <th>Food Item</th>
                  <th>Quantity</th>
                  <th>Price per Unit</th>
                  <th>Total Price</th>
                  <th>Order Date</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order, index) => {
                  const orderId = order._id || order.id || `order-${index}`;
                  const foodName = order.foodName || 'Unknown';
                  const quantity = order.quantity || 0;
                  const pricePerUnit = order.pricePerUnit || order.price || 0;
                  const totalPrice = order.totalPrice || (pricePerUnit * quantity) || 0;
                  const createdAt = order.createdAt || new Date().toISOString();
                  const status = order.status || 'Pending';

                  return (
                    <tr key={orderId}>
                      <td className="food-name">
                        🍽️ {foodName}
                      </td>
                      <td className="quantity">{quantity}</td>
                      <td className="price">
                        ₹{parseFloat(pricePerUnit).toFixed(2)}
                      </td>
                      <td className="total-price">
                        <strong>₹{parseFloat(totalPrice).toFixed(2)}</strong>
                      </td>
                      <td className="date">
                        {new Date(createdAt).toLocaleDateString('en-IN', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </td>
                      <td className="status">
                        <span className={`status-badge ${status?.toLowerCase() || 'pending'}`}>
                          {status}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="no-orders">
          <p>📭 No orders found</p>
        </div>
      )}

      {/* Additional Info */}
      <div className="bill-footer">
        <p>💡 This bill shows all your food orders from the mess.</p>
        <p>📞 For any discrepancies, contact the admin.</p>
        <button onClick={fetchBill} className="refresh-btn">
          🔄 Refresh Bill
        </button>
      </div>
    </div>
  );
}

export default Bill;
