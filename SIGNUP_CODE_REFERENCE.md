# 📝 SIGNUP - COMPLETE CODE REFERENCE

## 🎯 Backend Code

### AuthController.java - Register Method

**Location:** `backend/src/main/java/com/messhub/backend/controller/AuthController.java`

```java
// 🔐 SIGNUP - NO AUTHENTICATION REQUIRED
@PostMapping("/register")
public ResponseEntity<?> register(@RequestBody Map<String, String> registerRequest) {

    // ✅ Step 1: Validate input
    String name = registerRequest.get("name");
    String email = registerRequest.get("email");
    String password = registerRequest.get("password");
    String role = registerRequest.get("role");

    if (name == null || name.trim().isEmpty()) {
        return ResponseEntity.badRequest()
                .body(Map.of("message", "Name is required"));
    }

    if (email == null || email.trim().isEmpty()) {
        return ResponseEntity.badRequest()
                .body(Map.of("message", "Email is required"));
    }

    if (password == null || password.isEmpty()) {
        return ResponseEntity.badRequest()
                .body(Map.of("message", "Password is required"));
    }

    // ✅ Step 2: Check if email already exists
    String normalizedEmail = email.trim().toLowerCase();

    boolean emailExists = userRepository.findAll()
            .stream()
            .anyMatch(u -> u.getEmail() != null && 
                          u.getEmail().trim().toLowerCase().equals(normalizedEmail));

    if (emailExists) {
        return ResponseEntity.badRequest()
                .body(Map.of("message", "Email already exists"));
    }

    // ✅ Step 3: Set default role if not provided
    if (role == null || role.trim().isEmpty()) {
        role = "STUDENT";
    }

    // ✅ Step 4: Create new user
    User newUser = new User();
    newUser.setName(name.trim());
    newUser.setEmail(normalizedEmail);
    newUser.setPassword(password);  // In production, hash this!
    newUser.setRole(role.toUpperCase());

    // ✅ Step 5: Save to database
    User savedUser = userRepository.save(newUser);

    System.out.println("✅ User registered: " + savedUser.getEmail());

    // ✅ Step 6: Return response
    Map<String, Object> response = new HashMap<>();
    response.put("message", "User registered successfully");

    Map<String, Object> userData = new HashMap<>();
    userData.put("id", savedUser.getId());
    userData.put("name", savedUser.getName());
    userData.put("email", savedUser.getEmail());
    userData.put("role", savedUser.getRole());

    response.put("user", userData);

    return ResponseEntity.status(HttpStatus.CREATED).body(response);
}
```

### SecurityConfig.java - Public Access

**Update the authorizeHttpRequests section:**

```java
.authorizeHttpRequests(auth -> auth

    // ✅ PUBLIC
    .requestMatchers("/api/auth/login").permitAll()
    .requestMatchers("/api/auth/register").permitAll()  // ← ADD THIS LINE
    .requestMatchers("/", "/status").permitAll()
    
    // ... rest of config
)
```

---

## 💻 Frontend Code

### Signup.js

**Location:** `frontend/src/pages/Signup.js`

```javascript
import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "../styles/Signup.css";

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

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // ✅ Validation
    if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
      setError("Please fill all fields");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 4) {
      setError("Password must be at least 4 characters");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/register",
        {
          name: formData.name.trim(),
          email: formData.email.trim(),
          password: formData.password,
          role: formData.role
        }
      );

      console.log("🎉 Signup successful 👉", response.data);

      setSuccess("Signup successful! Redirecting to login...");

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
      console.log("❌ Signup error 👉", err.response || err);

      if (err.response?.data?.message) {
        setError(err.response.data.message);
      } else {
        setError("Signup failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-page">
      <div className="signup-container">
        <div className="signup-box">
          <h1>Create Account</h1>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <form onSubmit={handleSignup}>

            <input
              type="text"
              name="name"
              placeholder="Full Name"
              value={formData.name}
              onChange={handleChange}
            />

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
            />

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
            />

            <select name="role" value={formData.role} onChange={handleChange}>
              <option value="STUDENT">Student</option>
              <option value="ADMIN">Admin</option>
            </select>

            <button type="submit" disabled={loading}>
              {loading ? "Creating Account..." : "Sign Up"}
            </button>

          </form>

          <p className="login-link">
            Already have an account? <Link to="/">Login here</Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Signup;
```

### Signup.css

**Location:** `frontend/src/styles/Signup.css`

```css
.signup-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.signup-container {
  width: 100%;
  max-width: 400px;
  padding: 20px;
}

.signup-box {
  background: white;
  padding: 40px;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.signup-box h1 {
  text-align: center;
  color: #333;
  margin-bottom: 30px;
  font-size: 28px;
}

.signup-box form {
  display: flex;
  flex-direction: column;
}

.signup-box input,
.signup-box select {
  padding: 12px 15px;
  margin-bottom: 15px;
  border: 1px solid #ddd;
  border-radius: 5px;
  font-size: 14px;
  transition: border-color 0.3s;
}

.signup-box input:focus,
.signup-box select:focus {
  outline: none;
  border-color: #667eea;
  box-shadow: 0 0 5px rgba(102, 126, 234, 0.5);
}

.signup-box button {
  padding: 12px;
  background: #667eea;
  color: white;
  border: none;
  border-radius: 5px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background 0.3s;
  margin-bottom: 15px;
}

.signup-box button:hover:not(:disabled) {
  background: #5568d3;
}

.signup-box button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.error-message {
  background: #f8d7da;
  color: #721c24;
  padding: 12px;
  border-radius: 5px;
  margin-bottom: 15px;
  font-size: 14px;
  border: 1px solid #f5c6cb;
}

.success-message {
  background: #d4edda;
  color: #155724;
  padding: 12px;
  border-radius: 5px;
  margin-bottom: 15px;
  font-size: 14px;
  border: 1px solid #c3e6cb;
}

.login-link {
  text-align: center;
  margin-top: 20px;
  color: #666;
  font-size: 14px;
}

.login-link a {
  color: #667eea;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s;
}

.login-link a:hover {
  color: #5568d3;
}
```

### App.js - Add Signup Route

**Add import:**
```javascript
import Signup from './pages/Signup';
```

**Add route:**
```javascript
{/* 📝 SIGNUP ROUTE */}
<Route
  path="/signup"
  element={
    isAuthenticated ? (
      <Navigate to="/dashboard" replace />
    ) : (
      <Signup 
        setIsAuthenticated={setIsAuthenticated} 
        setUser={setUser} 
      />
    )
  }
/>
```

### Login.js - Add Signup Link

**Add import:**
```javascript
import { Link } from "react-router-dom";
```

**Add in form (after closing form tag):**
```javascript
<p className="login-link">
  Don't have an account? <Link to="/signup">Sign up here</Link>
</p>
```

---

## 📊 Request/Response Examples

### Success Request
```
POST http://localhost:8080/api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "STUDENT"
}
```

### Success Response (201)
```json
{
  "message": "User registered successfully",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "STUDENT"
  }
}
```

### Error - Email Exists (400)
```json
{
  "message": "Email already exists"
}
```

### Error - Missing Field (400)
```json
{
  "message": "Password is required"
}
```

---

## ✅ Copy-Paste Ready

All code is ready to copy and paste! Just:

1. **Backend:**
   - Copy register method to AuthController.java
   - Add /register to SecurityConfig.java
   - Rebuild: `./gradlew clean build`

2. **Frontend:**
   - Create Signup.js with provided code
   - Create Signup.css with provided styles
   - Update App.js with import + route
   - Update Login.js with import + link
   - Restart: `npm start`

3. **Test:**
   - Go to http://localhost:3000/signup
   - Fill form
   - Click Sign Up
   - Verify in MongoDB

---

## 🎯 That's It!

Complete signup functionality with all code provided!

