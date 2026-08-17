# 📚 Extra Food - Code Reference & Snippets

## ✅ Backend Configuration

### Complete SecurityConfig Extra Food Rules
```java
// Extra Food endpoints
.requestMatchers(HttpMethod.GET, "/api/extra-food").hasAnyRole("ADMIN", "STUDENT")
.requestMatchers(HttpMethod.POST, "/api/extra-food").hasRole("ADMIN")
.requestMatchers(HttpMethod.PUT, "/api/extra-food/**").hasRole("ADMIN")
.requestMatchers(HttpMethod.DELETE, "/api/extra-food/**").hasRole("ADMIN")
```

---

## ✅ Frontend - Get Foods (Fixed Pattern)

### Pattern 1: Basic GET with Token
```javascript
useEffect(() => {
  const fetchFoods = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Not logged in. Please login first.");
        return;
      }

      const res = await axios.get("http://localhost:8080/api/extra-food", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      setFoods(res.data || []);
      setError("");

    } catch (err) {
      console.error("❌ Error:", err);
      
      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
      } else if (err.response?.status === 403) {
        setError("You don't have permission.");
      } else {
        setError(err.response?.data?.message || "Failed to load");
      }
    }
  };

  fetchFoods();
}, []);
```

---

### Pattern 2: GET with Loading State
```javascript
useEffect(() => {
  const fetchFoods = async () => {
    try {
      setLoading(true);
      setError("");

      const token = localStorage.getItem("token");
      if (!token) {
        setError("Not logged in.");
        setLoading(false);
        return;
      }

      const res = await axios.get("http://localhost:8080/api/extra-food", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setFoods(res.data || []);

    } catch (err) {
      setError(err.response?.data?.message || "Failed to load");
    } finally {
      setLoading(false);
    }
  };

  fetchFoods();
}, []);
```

---

### Pattern 3: GET with Timeout
```javascript
const fetchFoods = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return;

    const res = await axios.get(
      "http://localhost:8080/api/extra-food",
      {
        headers: { Authorization: `Bearer ${token}` },
        timeout: 5000,  // 5 second timeout
      }
    );

    setFoods(res.data || []);
  } catch (err) {
    if (err.code === 'ECONNABORTED') {
      setError("Request timeout. Backend may be down.");
    } else {
      setError(err.response?.data?.message || "Failed to load");
    }
  }
};
```

---

## ✅ Frontend - Add Food (Admin)

### Pattern 1: Basic POST
```javascript
const handleAddFood = async (e) => {
  e.preventDefault();
  
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Not logged in.");
      return;
    }

    const res = await axios.post(
      "http://localhost:8080/api/extra-food",
      {
        name: name.trim(),
        price: Number(price),
        quantity: Number(quantity),
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    setSuccess("Food added successfully!");
    // Clear form
    setName("");
    setPrice("");
    setQuantity("");
    // Refresh list
    fetchFoods();

  } catch (err) {
    if (err.response?.status === 403) {
      setError("Only admins can add food.");
    } else if (err.response?.status === 400) {
      setError(err.response.data.message || "Invalid input");
    } else {
      setError("Failed to add food");
    }
  }
};
```

---

### Pattern 2: POST with Validation
```javascript
const handleAddFood = async (e) => {
  e.preventDefault();
  setError("");

  // Client-side validation
  if (!name || !price || !quantity) {
    setError("All fields required");
    return;
  }

  if (isNaN(price) || price <= 0) {
    setError("Price must be > 0");
    return;
  }

  if (isNaN(quantity) || quantity < 0) {
    setError("Quantity must be >= 0");
    return;
  }

  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not logged in");

    setLoading(true);

    const res = await axios.post(
      "http://localhost:8080/api/extra-food",
      {
        name: name.trim(),
        price: Number(price),
        quantity: Number(quantity),
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setSuccess("Added: " + res.data.name);
    setName("");
    setPrice("");
    setQuantity("");

  } catch (err) {
    setError(err.response?.data?.message || err.message);
  } finally {
    setLoading(false);
  }
};
```

---

## ✅ Frontend - Book Food (Student)

### Pattern: POST Order
```javascript
const handleBookFood = async (foodId, quantity) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      setError("Not logged in.");
      return;
    }

    if (!quantity || quantity <= 0) {
      setError("Enter valid quantity");
      return;
    }

    setLoading(true);

    const res = await axios.post(
      "http://localhost:8080/api/orders",
      {
        foodId: foodId,
        quantity: Number(quantity),
        type: "EXTRA_FOOD",  // Important for backend
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setSuccess("Order placed! Order ID: " + res.data._id);
    setQuantities({});  // Clear selections
    
    // Refresh orders list
    fetchOrders();

  } catch (err) {
    if (err.response?.status === 400) {
      setError(err.response.data.message || "Invalid order");
    } else if (err.response?.status === 404) {
      setError("Food item not found");
    } else {
      setError("Failed to place order");
    }
  } finally {
    setLoading(false);
  }
};
```

---

## ✅ Frontend - Update Food (Admin)

### Pattern: PUT Request
```javascript
const handleUpdateFood = async (foodId, updatedData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not logged in");

    const res = await axios.put(
      `http://localhost:8080/api/extra-food/${foodId}`,
      {
        name: updatedData.name,
        price: Number(updatedData.price),
        quantity: Number(updatedData.quantity),
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setSuccess("Food updated!");
    // Refresh list
    fetchFoods();

  } catch (err) {
    setError(err.response?.data?.message || "Update failed");
  }
};
```

---

## ✅ Frontend - Delete Food (Admin)

### Pattern: DELETE Request
```javascript
const handleDeleteFood = async (foodId) => {
  if (!window.confirm("Delete this food item?")) return;

  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Not logged in");

    await axios.delete(
      `http://localhost:8080/api/extra-food/${foodId}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setSuccess("Food deleted!");
    // Refresh list
    fetchFoods();

  } catch (err) {
    if (err.response?.status === 404) {
      setError("Food not found");
    } else if (err.response?.status === 403) {
      setError("Only admins can delete");
    } else {
      setError("Delete failed");
    }
  }
};
```

---

## 🔍 Error Handling Patterns

### Pattern 1: Detailed Error Handling
```javascript
catch (err) {
  console.error("API Error:", err);
  console.log("Status:", err.response?.status);
  console.log("Data:", err.response?.data);

  if (!err.response) {
    // Network error
    setError("Network error. Is backend running?");
  } else if (err.response.status === 400) {
    // Validation error
    setError(err.response.data.message);
  } else if (err.response.status === 401) {
    // Token issue
    setError("Session expired. Please login again.");
  } else if (err.response.status === 403) {
    // Permission issue
    setError("You don't have permission for this action.");
  } else if (err.response.status === 404) {
    // Not found
    setError("Item not found.");
  } else if (err.response.status === 500) {
    // Server error
    setError("Server error. Check backend logs.");
  } else {
    // Generic
    setError("Something went wrong: " + err.message);
  }
}
```

---

### Pattern 2: User-Friendly Error Messages
```javascript
const getErrorMessage = (error) => {
  if (!error.response) {
    return "Connection failed. Is the backend running?";
  }

  const status = error.response.status;
  const data = error.response.data;

  const messages = {
    400: () => data.message || "Invalid input",
    401: () => "Please login again",
    403: () => "You don't have permission",
    404: () => "Item not found",
    500: () => "Server error",
  };

  return messages[status]?.() || "Failed to process request";
};

// Usage:
.catch(err => setError(getErrorMessage(err)))
```

---

## 🧪 Testing Code Snippets

### Test 1: Login and Check Token
```javascript
// In browser console after login:
const token = localStorage.getItem('token');
console.log('Token:', token);
console.log('Token length:', token?.length);

// Decode token:
const parts = token.split('.');
const payload = JSON.parse(atob(parts[1]));
console.log('User:', payload);
```

---

### Test 2: Check API Response
```javascript
// In browser console, Network tab:
// 1. Trigger the food fetch
// 2. Find 'extra-food' request
// 3. Click on it, check:

// Request Headers should have:
// Authorization: Bearer {token}

// Response should be:
// [
//   { _id: "...", name: "...", price: 15, quantity: 50 },
//   ...
// ]
```

---

### Test 3: Manual API Call
```javascript
// In browser console:
const token = localStorage.getItem('token');

fetch('http://localhost:8080/api/extra-food', {
  method: 'GET',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
})
.then(res => res.json())
.then(data => console.log('Foods:', data))
.catch(err => console.error('Error:', err));
```

---

### Test 4: Add Food as Admin
```javascript
// In browser console:
const token = localStorage.getItem('token');

fetch('http://localhost:8080/api/extra-food', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    name: 'Test Food',
    price: 25,
    quantity: 10
  })
})
.then(res => res.json())
.then(data => console.log('Added:', data))
.catch(err => console.error('Error:', err));
```

---

## 🛠️ Helper Functions

### Helper 1: Token Manager
```javascript
const TokenManager = {
  // Get token
  getToken: () => localStorage.getItem('token'),
  
  // Set token
  setToken: (token) => localStorage.setItem('token', token),
  
  // Clear token
  clearToken: () => localStorage.removeItem('token'),
  
  // Check if token exists
  hasToken: () => !!localStorage.getItem('token'),
  
  // Get auth headers
  getAuthHeaders: () => ({
    'Authorization': `Bearer ${localStorage.getItem('token')}`,
    'Content-Type': 'application/json'
  })
};

// Usage:
// axios.get(url, { headers: TokenManager.getAuthHeaders() })
```

---

### Helper 2: API Client
```javascript
const createApiClient = () => {
  const client = axios.create({
    baseURL: 'http://localhost:8080/api'
  });

  // Add auth header to all requests
  client.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  return client;
};

// Usage:
const api = createApiClient();
// api.get('/extra-food')  // Token added automatically
```

---

### Helper 3: Error Formatter
```javascript
const formatError = (error) => {
  if (!error.response) {
    return {
      code: 'NETWORK',
      message: 'Network error',
      details: error.message
    };
  }

  return {
    code: error.response.status,
    message: error.response.data?.message || 'Error',
    details: error.response.data
  };
};

// Usage:
catch (err) {
  const formatted = formatError(err);
  console.error(formatted);
}
```

---

## 📋 Copy-Paste Ready Code Blocks

### Block 1: Complete ExtraFood GET
```javascript
const fetchExtraFoods = async () => {
  try {
    setLoading(true);
    setError("");

    const token = localStorage.getItem("token");
    if (!token) {
      setError("Please login first");
      setLoading(false);
      return;
    }

    const response = await axios.get(
      "http://localhost:8080/api/extra-food",
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        }
      }
    );

    setFoods(response.data || []);
    setError("");
    console.log("✅ Foods loaded:", response.data);

  } catch (err) {
    console.error("❌ Error:", err);
    console.log("Status:", err.response?.status);
    console.log("Data:", err.response?.data);

    if (err.response?.status === 401) {
      setError("Session expired. Please login again.");
    } else if (err.response?.status === 403) {
      setError("Access denied.");
    } else {
      setError(err.response?.data?.message || "Failed to load foods");
    }
  } finally {
    setLoading(false);
  }
};
```

---

## 🔗 Related Code Files

| File | Purpose | Key Function |
|------|---------|--------------|
| `SecurityConfig.java` | Backend security rules | Authorization for endpoints |
| `ExtraFoodController.java` | API endpoints | GET, POST, PUT, DELETE |
| `ExtraFood.js` | Frontend component | Display and manage foods |
| `ExtraFoodRepository.java` | Database access | MongoDB queries |
| `ExtraFood.java` | Data model | Food item structure |

