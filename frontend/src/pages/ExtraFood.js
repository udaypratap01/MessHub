import React, { useState, useEffect } from "react";
import axios from "axios";
import Loader from '../components/Loader';
import '../styles/ModernExtraFood.css';

function ExtraFood({ user, setIsAuthenticated, setUser }) {
  const [foods, setFoods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [cart, setCart] = useState({});
  const [formData, setFormData] = useState({
    name: "",
    price: "",
    quantity: ""
  });
  const [submitting, setSubmitting] = useState(false);

  // 🔥 SET GLOBAL TOKEN
  useEffect(() => {
    const token = localStorage.getItem("token");
    console.log("🔐 Token from localStorage:", token ? `${token.substring(0, 20)}...` : "NOT FOUND");
    
    if (token) {
      axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      console.log("✅ Authorization header set");
    } else {
      console.warn("⚠️ No token found - requests will fail with 403");
    }
  }, []);

  // 🔹 FETCH FOOD ITEMS
  const fetchFoods = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        console.warn("⚠️ No token available - request will likely fail with 403");
        setError("Authentication required. Please login first.");
        setLoading(false);
        return;
      }

      console.log("📦 Fetching extra foods with token:", token.substring(0, 20) + "...");

      const res = await axios.get("http://localhost:8080/api/extra-food", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      });
      
      // Normalize food data - ensure all foods have id property
      const normalizedFoods = (res.data || []).map(f => ({
        ...f,
        id: f._id || f.id,
        _id: f._id || f.id
      }));

      console.log("✅ Foods loaded:", normalizedFoods);
      setFoods(normalizedFoods);
    } catch (err) {
      console.error("❌ Error fetching foods:", err.response?.status, err.response?.data);
      
      const errorMessage = typeof err.response?.data === 'object' 
        ? err.response?.data?.message 
        : err.response?.data;
      
      if (err.response?.status === 403) {
        setError("Access denied. Your token may be invalid or expired. Please login again.");
      } else if (err.response?.status === 401) {
        setError("Not authorized. Please login.");
      } else {
        setError(errorMessage || "Failed to load food items");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFoods();
  }, []);

  // 🔹 HANDLE INPUT CHANGE
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 🔹 ADD FOOD ITEM (ADMIN ONLY)
  const handleAddFood = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.price || !formData.quantity) {
      setError("All fields are required");
      return;
    }

    if (isNaN(formData.price) || formData.price <= 0) {
      setError("Price must be a positive number");
      return;
    }

    if (isNaN(formData.quantity) || formData.quantity < 0) {
      setError("Quantity must be a non-negative number");
      return;
    }

    try {
      setSubmitting(true);

      const res = await axios.post(
        "http://localhost:8080/api/extra-food",
        {
          name: formData.name.trim(),
          price: Number(formData.price),
          quantity: Number(formData.quantity)
        }
      );

      setFoods(prev => [...prev, res.data]);
      setFormData({ name: "", price: "", quantity: "" });
      setShowAddForm(false);
      alert("Food item added successfully!");

    } catch (err) {
      const errorMessage = typeof err.response?.data === 'object' 
        ? err.response?.data?.message 
        : err.response?.data;

      if (err.response?.status === 403) {
        setError("Only ADMIN can add food items");
      } else {
        setError(errorMessage || "Failed to add food item");
      }
    } finally {
      setSubmitting(false);
    }
  };

  // 🔹 DELETE FOOD ITEM (ADMIN ONLY)
  const handleDeleteFood = async (food) => {
    const id = food._id || food.id;

    if (!id) {
      setError("Error: Food ID is missing");
      return;
    }

    if (!window.confirm(`Delete "${food.name}" from menu?`)) {
      return;
    }

    try {
      setError("");
      await axios.delete(`http://localhost:8080/api/extra-food/${id}`);

      setFoods(prev => prev.filter(f => (f._id || f.id) !== id));
      alert("Food item deleted successfully!");

    } catch (err) {
      const errorMessage = typeof err.response?.data === 'object' 
        ? err.response?.data?.message 
        : err.response?.data;

      if (err.response?.status === 403) {
        setError("Only ADMIN can delete food items");
      } else {
        setError(errorMessage || "Failed to delete food item");
      }
    }
  };

  // 🔹 UPDATE CART
  const handleAddToCart = (food) => {
    const id = food?._id || food?.id;
    if (!id) {
      setError("Error: Food ID is missing");
      return;
    }
    setCart(prev => ({
      ...prev,
      [id]: (prev[id] || 0) + 1
    }));
  };

  const handleRemoveFromCart = (foodId) => {
    setCart(prev => ({
      ...prev,
      [foodId]: Math.max(0, (prev[foodId] || 0) - 1)
    }));
  };

  const handleClearCart = () => {
    setCart({});
  };

  // 🔹 BOOK FOOD FROM CART
  const handleBookFood = async () => {
    try {
      setError("");
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Authentication required. Please login.");
        return;
      }

      // Prepare order items from cart
      const orderItems = Object.keys(cart)
        .filter(foodId => cart[foodId] > 0)
        .map(foodId => {
          const food = foods.find(f => (f._id || f.id) === foodId);
          if (!food) return null;
          return {
            foodId: foodId,
            quantity: cart[foodId]
          };
        })
        .filter(item => item !== null);

      if (orderItems.length === 0) {
        setError("Please add items to cart before booking");
        return;
      }

      console.log("📦 Booking items with token:", token.substring(0, 20) + "...");
      console.log("📦 Order items:", orderItems);

      // Try bulk order first, fallback to individual orders
      try {
        const response = await axios.post(
          "http://localhost:8080/api/orders/bulk",
          {
            items: orderItems
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json"
            }
          }
        );

        console.log("✅ Order booked successfully:", response.data);
        
        setSuccess("Food booked successfully! 🎉");
        setCart({});
        setTimeout(() => setSuccess(""), 3000);

      } catch (bulkErr) {
        // If bulk endpoint doesn't exist, try individual orders
        console.warn("⚠️ Bulk endpoint failed, trying individual orders:", bulkErr.response?.status);
        
        for (const item of orderItems) {
          const response = await axios.post(
            "http://localhost:8080/api/orders",
            {
              foodId: item.foodId,
              quantity: item.quantity
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
              }
            }
          );
          console.log("✅ Individual order placed:", response.data);
        }
        
        setSuccess("Food booked successfully! 🎉");
        setCart({});
        setTimeout(() => setSuccess(""), 3000);
      }

    } catch (err) {
      console.error("❌ Booking error:", err.response?.status, err.response?.data);
      
      if (err.response?.status === 403) {
        setError("Access denied (403). Your authentication may have expired. Please login again.");
      } else if (err.response?.status === 401) {
        setError("Not authorized (401). Please login.");
      } else {
        const errorMessage = err.response?.data?.message || err.message || "Failed to book food";
        setError(errorMessage);
      }
    }
  };

  // 🔹 CALCULATE TOTALS
  const cartTotal = Object.keys(cart).reduce((sum, foodId) => {
    const food = foods.find(f => f._id === foodId);
    return sum + (food?.price || 0) * cart[foodId];
  }, 0);

  const cartItems = Object.keys(cart).filter(foodId => cart[foodId] > 0).length;

  if (loading) {
    return <Loader fullPage={true} size="medium" text="Loading food items..." />;
  }

  return (
    <div className="extra-food-page">
        {/* HEADER */}
        <div className="food-page-header">
          <div className="header-content">
            <h1>🍕 Extra Food Options</h1>
            <p>Order additional food items anytime</p>
          </div>
        </div>

      {/* ERROR MESSAGE */}
      {error && (
        <div className="error-banner">
          <span>⚠️ {error}</span>
          <button onClick={() => setError('')}>×</button>
        </div>
      )}

      {/* SUCCESS MESSAGE */}
      {success && (
        <div className="success-banner">
          <span>✅ {success}</span>
          <button onClick={() => setSuccess('')}>×</button>
        </div>
      )}        {/* ADMIN SECTION */}
        {user?.role === 'ADMIN' && (
          <div className="admin-section">
            <button className="add-food-btn" onClick={() => setShowAddForm(!showAddForm)}>
              {showAddForm ? '✕ Cancel' : '+ Add Food Item'}
            </button>

            {showAddForm && (
              <form className="food-form" onSubmit={handleAddFood}>
                <div className="form-group">
                  <label>Food Name</label>
                  <input
                    name="name"
                    placeholder="e.g., Paneer Pizza, Samosa"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Price (₹)</label>
                    <input
                      name="price"
                      type="number"
                      placeholder="0.00"
                      step="0.01"
                      value={formData.price}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Available Qty</label>
                    <input
                      name="quantity"
                      type="number"
                      placeholder="0"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="submit-btn" disabled={submitting}>
                  {submitting ? 'Saving...' : 'Add Item'}
                </button>
              </form>
            )}
          </div>
        )}

        <div className="food-page-content">
          {/* FOOD GRID */}
          <div className="food-section">
            <h2>Available Items</h2>
            {foods.length === 0 ? (
              <div className="empty-state">
                <p>😋 No food items available yet</p>
              </div>
            ) : (
              <div className="food-grid">
                {foods.map((food, index) => {
                  const foodId = food._id || food.id;
                  if (!foodId) {
                    console.warn("⚠️ Food missing ID:", food);
                    return null;
                  }

                  return (
                    <div key={foodId} className="food-card" style={{ animationDelay: `${index * 0.1}s` }}>
                      <div className="food-header">
                        <span className="food-icon">🍽️</span>
                        {user?.role === 'ADMIN' && (
                          <button
                            className="delete-food-btn"
                            onClick={() => handleDeleteFood(food)}
                            title="Delete item"
                          >
                            🗑️
                          </button>
                        )}
                      </div>

                      <h3 className="food-name">{food.name}</h3>

                      <div className="food-info">
                        <div className="info-item">
                          <span className="label">Price</span>
                          <span className="value">₹{food.price.toFixed(2)}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Available</span>
                          <span className="value">{food.quantity} qty</span>
                        </div>
                      </div>

                      <div className="food-actions">
                        {cart[foodId] ? (
                          <div className="quantity-control">
                            <button onClick={() => handleRemoveFromCart(foodId)}>−</button>
                            <span>{cart[foodId]}</span>
                            <button onClick={() => handleAddToCart(food)}>+</button>
                          </div>
                        ) : (
                          <button className="add-to-cart-btn" onClick={() => handleAddToCart(food)}>
                            Add to Cart
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* CART SIDEBAR */}
          {cartItems > 0 && (
            <div className="cart-sidebar">
              <div className="cart-header">
                <h3>🛒 Your Cart</h3>
                <span className="cart-badge">{cartItems}</span>
              </div>

              <div className="cart-items">
                {Object.keys(cart).filter(foodId => cart[foodId] > 0).map(foodId => {
                  const food = foods.find(f => (f._id || f.id) === foodId);
                  if (!food) return null;

                  return (
                    <div key={foodId} className="cart-item">
                      <div className="item-details">
                        <p className="item-name">{food.name}</p>
                        <p className="item-qty">{cart[foodId]} × ₹{food.price.toFixed(2)}</p>
                      </div>
                      <p className="item-total">₹{(food.price * cart[foodId]).toFixed(2)}</p>
                    </div>
                  );
                })}
              </div>

              <div className="cart-footer">
                <div className="cart-total">
                  <span>Total:</span>
                  <span className="total-amount">₹{cartTotal.toFixed(2)}</span>
                </div>
                <button className="order-btn" onClick={handleBookFood}>Order Now</button>
                <button className="clear-cart-btn" onClick={handleClearCart}>Clear Cart</button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  export default ExtraFood;
