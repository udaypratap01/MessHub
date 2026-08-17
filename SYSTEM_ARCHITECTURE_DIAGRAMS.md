# 📊 System Architecture Diagrams

## 1. Complete Authentication & Menu API Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER AUTHENTICATION FLOW                     │
└─────────────────────────────────────────────────────────────────┘

STEP 1: Login
┌──────────────────┐
│  React Frontend  │
│   Login.js       │
│                  │
│ [Email Input]    │
│ [Password Input] │
│ [Login Button]   │
└────────┬─────────┘
         │ POST /api/auth/login
         │ { email, password }
         ↓
┌──────────────────────────────┐
│   Spring Boot Backend         │
│   AuthController.login()      │
│                               │
│ 1. Find user in MongoDB       │
│ 2. Verify password            │
│ 3. Generate JWT token         │
│ 4. Return token + user data   │
└────────┬──────────────────────┘
         │ HTTP 200
         │ { token, user }
         ↓
┌──────────────────┐
│  React Frontend  │
│   Login.js       │
│                  │
│ localStorage.setItem('token')│
│ localStorage.setItem('user') │
│ navigate('/dashboard')       │
└──────────────────┘


STEP 2: Access Protected Page (Menu)
┌──────────────────┐
│  React Frontend  │
│   Menu.js        │
│                  │
│ useEffect()      │
│ fetchMenus()     │
└────────┬─────────┘
         │ GET /api/menu
         │ Headers: {
         │   Authorization: Bearer <token>
         │ }
         ↓
┌──────────────────────────────────────────┐
│     Spring Boot Security Chain           │
│                                          │
│ 1. CorsFilter                            │
│    ✓ Allows preflight (OPTIONS)          │
│    ✓ Allows CORS headers                 │
│                      ↓                   │
│ 2. JwtFilter                             │
│    ✓ Extract token from header           │
│    ✓ Validate token using JwtUtil        │
│    ✓ Extract email from token            │
│    ✓ Look up user in MongoDB             │
│    ✓ Get user's role (ADMIN/STUDENT)     │
│    ✓ Set Spring Security authorities     │
│                      ↓                   │
│ 3. SecurityConfig                        │
│    ✓ Check endpoint: /api/menu GET       │
│    ✓ Check auth: hasAnyRole(             │
│         ADMIN, STUDENT                   │
│       )                                  │
│    ✓ Is user authorized? YES → Allow     │
│                      ↓                   │
│ 4. MenuController.getAllMenus()          │
│    ✓ Query MongoDB menus collection      │
│    ✓ Return List<Menu>                   │
└────────┬───────────────────────────────┘
         │ HTTP 200
         │ [menu1, menu2, menu3, ...]
         ↓
┌──────────────────┐
│  React Frontend  │
│   Menu.js        │
│                  │
│ setMenus(data)   │
│ Render menus     │
│ Display on page  │
└──────────────────┘
```

---

## 2. Request-Response Format

### Login Request/Response

```
REQUEST:
────────────────────────────────────────
POST /api/auth/login HTTP/1.1
Host: localhost:8080
Content-Type: application/json

{
  "email": "admin@test.com",
  "password": "password123"
}


RESPONSE:
────────────────────────────────────────
HTTP/1.1 200 OK
Content-Type: application/json

{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Admin User",
    "email": "admin@test.com",
    "role": "ADMIN"
  }
}
```

### Get Menus Request/Response

```
REQUEST:
────────────────────────────────────────
GET /api/menu HTTP/1.1
Host: localhost:8080
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Content-Type: application/json


RESPONSE (Success):
────────────────────────────────────────
HTTP/1.1 200 OK
Content-Type: application/json

[
  {
    "id": "507f1f77bcf86cd799439012",
    "day": "Monday",
    "breakfast": "Eggs and Toast",
    "lunch": "Rice and Curry",
    "dinner": "Pasta and Salad"
  },
  {
    "id": "507f1f77bcf86cd799439013",
    "day": "Tuesday",
    "breakfast": "Oatmeal and Fruits",
    "lunch": "Chicken Biryani",
    "dinner": "Dhal and Rice"
  }
]


RESPONSE (Error - No Token):
────────────────────────────────────────
HTTP/1.1 403 Forbidden
Content-Type: application/json

{
  "error": "Access Denied"
}


RESPONSE (Error - Invalid Token):
────────────────────────────────────────
HTTP/1.1 401 Unauthorized
Content-Type: application/json

{
  "error": "Invalid Token"
}
```

---

## 3. Role-Based Access Control Matrix

```
┌──────────────────────────────────────────────────────────┐
│              ACCESS CONTROL MATRIX                        │
├──────────────────────────────────────────────────────────┤
│ Endpoint                │ ADMIN  │ STUDENT │ ANONYMOUS   │
├─────────────────────────┼────────┼─────────┼─────────────┤
│ POST /api/auth/login    │   ✓    │    ✓    │      ✓      │
│ GET /api/menu           │   ✓    │    ✓    │      ✗      │
│ POST /api/menu          │   ✓    │    ✗    │      ✗      │
│ POST /api/attendance    │   ✗    │    ✓    │      ✗      │
│ GET /api/attendance     │   ✓    │    ✓    │      ✗      │
│ POST /api/bill/generate │   ✓    │    ✗    │      ✗      │
│ GET /api/bill           │   ✓    │    ✓    │      ✗      │
└──────────────────────────────────────────────────────────┘

Legend:
✓ = Access Allowed
✗ = Access Denied (HTTP 403)
Anonymous = No JWT token
```

---

## 4. Token Validation Flow

```
┌─────────────────────────────────────────────┐
│   Browser sends request with token          │
│                                             │
│   GET /api/menu                             │
│   Authorization: Bearer eyJhbGc...          │
└──────────────────┬──────────────────────────┘
                   │
                   ↓
        ┌──────────────────────┐
        │   JwtFilter          │
        │                      │
        │ Get Authorization    │
        │ header value         │
        └──────────┬───────────┘
                   │
                   ↓
        ┌──────────────────────────────┐
        │ Extract token                │
        │ Remove "Bearer " prefix      │
        │                              │
        │ token = header.substring(7)  │
        └──────────┬───────────────────┘
                   │
                   ↓
        ┌──────────────────────────────┐
        │ JwtUtil.validateToken()      │
        │                              │
        │ ✓ Verify signature           │
        │ ✓ Check expiration           │
        │ ✓ Parse claims               │
        └──────────┬───────────────────┘
                   │
                   ├─→ Invalid? → Return null
                   │
                   ↓
        ┌──────────────────────────────┐
        │ JwtUtil.extractUsername()    │
        │                              │
        │ Get email from token.subject │
        └──────────┬───────────────────┘
                   │
                   ↓
        ┌──────────────────────────────┐
        │ UserRepository.findAll()     │
        │                              │
        │ Find user by email in        │
        │ MongoDB users collection     │
        └──────────┬───────────────────┘
                   │
                   ├─→ Not found? → No auth
                   │
                   ↓
        ┌──────────────────────────────┐
        │ Get user.role from DB        │
        │                              │
        │ role = "ADMIN" or "STUDENT"  │
        └──────────┬───────────────────┘
                   │
                   ↓
        ┌──────────────────────────────┐
        │ Set Spring Security Auth     │
        │                              │
        │ authorities.add(             │
        │   new SimpleGrantedAuthority │
        │   ("ROLE_" + role)           │
        │ )                            │
        │                              │
        │ SecurityContext.setAuth()    │
        └──────────┬───────────────────┘
                   │
                   ↓
        ┌──────────────────────────────┐
        │ SecurityConfig checks auth   │
        │                              │
        │ .requestMatchers("GET",      │
        │   "/api/menu"                │
        │ ).hasAnyRole(                │
        │   "ADMIN", "STUDENT"         │
        │ )                            │
        └──────────┬───────────────────┘
                   │
                   ├─→ User has role? → ALLOW
                   │
                   └─→ No role? → DENY (403)
                   │
                   ↓
        ┌──────────────────────────────┐
        │ MenuController.getAllMenus() │
        │ Execute and return data      │
        └──────────────────────────────┘
```

---

## 5. Database Schema

### Users Collection (MongoDB)

```javascript
db.user.insertOne({
  _id: ObjectId("507f1f77bcf86cd799439011"),
  name: "Admin User",
  email: "admin@test.com",
  password: "password123",  // ⚠️ Should be hashed in production!
  role: "ADMIN"
})

db.user.insertOne({
  _id: ObjectId("507f1f77bcf86cd799439012"),
  name: "Student User",
  email: "student@test.com",
  password: "password123",  // ⚠️ Should be hashed in production!
  role: "STUDENT"
})
```

### Menus Collection (MongoDB)

```javascript
db.menu.insertOne({
  _id: ObjectId("507f1f77bcf86cd799439013"),
  day: "Monday",
  breakfast: "Eggs and Toast",
  lunch: "Rice and Curry",
  dinner: "Pasta and Salad"
})

db.menu.insertOne({
  _id: ObjectId("507f1f77bcf86cd799439014"),
  day: "Tuesday",
  breakfast: "Oatmeal and Fruits",
  lunch: "Chicken Biryani",
  dinner: "Dhal and Rice"
})
```

---

## 6. React Component Hierarchy

```
App.js
├── Routes
│   ├── / (home)
│   ├── /login
│   │   └── Login.js
│   │       ├── Form inputs (email, password)
│   │       ├── Form validation
│   │       └── API call to /api/auth/login
│   │
│   ├── /dashboard (Protected)
│   │   └── Dashboard.js
│   │       ├── Display user info
│   │       ├── Navigation links
│   │       └── Logout button
│   │
│   ├── /menu (Protected)
│   │   └── Menu.js ← ✅ UPDATED
│   │       ├── useState hooks for menus, loading, error
│   │       ├── useEffect to fetch menus on mount
│   │       ├── fetchMenus() function
│   │       │   └── GET /api/menu with JWT token
│   │       ├── handleInputChange() for form
│   │       ├── handleAddMenu() for POST request
│   │       │   └── POST /api/menu with menu data
│   │       ├── Menu form (ADMIN only)
│   │       │   ├── Day selector
│   │       │   ├── Breakfast input
│   │       │   ├── Lunch input
│   │       │   └── Dinner input
│   │       └── Menu grid/list display
│   │           └── Menu cards showing meals
│   │
│   └── (other routes...)
│
└── ProtectedRoute wrapper
    └── Checks localStorage for token
```

---

## 7. Error Handling Flow in Menu.js

```
fetchMenus() called
    ↓
Check if token exists
    ├─→ NO → Show "No token found" error
    │
    └─→ YES
        ↓
    Make axios GET request
        ├─→ SUCCESS (200)
        │   ├── Console: ✅ Menus loaded
        │   └── setMenus(data)
        │
        └─→ ERROR
            │
            ├─→ Response received?
            │   │
            │   ├─→ YES
            │   │   ├─→ Status 401? → "Token expired"
            │   │   ├─→ Status 403? → "Permission denied"
            │   │   ├─→ Status 404? → "Backend offline"
            │   │   └─→ Other? → Show server error message
            │   │
            │   └─→ NO
            │       ├─→ Request made? → "No response from server"
            │       └─→ Request failed? → "Error setting up request"
            │
            └── Console: ❌ Error logged with details
```

---

## 8. Component State Management

### Menu.js State Variables

```javascript
const [menus, setMenus]           // Array of menu objects
const [loading, setLoading]       // Boolean - true while fetching
const [error, setError]           // String - error message
const [showForm, setShowForm]     // Boolean - form visibility
const [formData, setFormData]     // Object - form field values
const [submitting, setSubmitting] // Boolean - true while posting

// State transitions for fetching menus:
loading: true  →  loading: false, error: ''  →  (success)
loading: false, menus: [...]  →  (data loaded)
                           OR
loading: false, error: 'message'  →  (error shown)
```

---

## 9. Security Layers

```
┌────────────────────────────────────────────────┐
│           SECURITY LAYERS                      │
├────────────────────────────────────────────────┤
│                                                │
│ LAYER 1: CORS (Cross-Origin Resource Sharing) │
│ ├─ Whitelist domains (localhost:3000)         │
│ ├─ Whitelist HTTP methods (GET, POST, etc)    │
│ └─ Whitelist headers (Authorization, etc)     │
│                                                │
│ LAYER 2: JWT TOKEN                            │
│ ├─ Token generated at login                   │
│ ├─ Signed with secret key                     │
│ ├─ Expires after 1 hour                       │
│ └─ Sent in Authorization header               │
│                                                │
│ LAYER 3: JWT VALIDATION (JwtFilter)           │
│ ├─ Extract token from header                  │
│ ├─ Verify signature                           │
│ ├─ Check expiration                           │
│ └─ Validate format (Bearer prefix)            │
│                                                │
│ LAYER 4: USER LOOKUP                          │
│ ├─ Find user in MongoDB by email              │
│ ├─ Retrieve user's role                       │
│ └─ Load user's permissions                    │
│                                                │
│ LAYER 5: AUTHORIZATION (SecurityConfig)       │
│ ├─ Check if user has required role            │
│ ├─ Match endpoint with role requirements      │
│ └─ Allow or deny access                       │
│                                                │
│ LAYER 6: ENDPOINT LOGIC (Controller)          │
│ ├─ Execute business logic                     │
│ ├─ Query database                             │
│ └─ Return response                            │
│                                                │
└────────────────────────────────────────────────┘

Request Flow Through Layers:
HTTP Request
    ↓
CorsFilter (Layer 1)
    ↓
JwtFilter (Layers 2 & 3 & 4)
    ↓
SecurityConfig (Layer 5)
    ↓
Controller (Layer 6)
    ↓
HTTP Response
```

---

## 10. File Dependencies

```
Frontend Dependencies:
──────────────────────
App.js
├── react
├── react-router-dom
│   ├── Login.js
│   │   ├── axios (for API calls)
│   │   ├── localStorage (for token storage)
│   │   └── useNavigate (for routing)
│   │
│   ├── Dashboard.js
│   │   ├── useNavigate
│   │   ├── localStorage
│   │   └── Link (for navigation)
│   │
│   └── Menu.js ✅ UPDATED
│       ├── axios
│       ├── localStorage
│       ├── useNavigate
│       ├── useState (for menus, loading, error, form)
│       └── useEffect (for fetchMenus on mount)
│
└── ProtectedRoute.js
    ├── localStorage
    └── Navigate (for redirect)


Backend Dependencies:
─────────────────────
BackendApplication.java
├── Spring Boot
│   ├── Spring Web (REST API)
│   ├── Spring Security
│   │   ├── JwtFilter.java
│   │   │   ├── JwtUtil
│   │   │   └── UserRepository
│   │   │
│   │   └── SecurityConfig.java
│   │       ├── CorsConfig.java
│   │       └── JWT Filter bean
│   │
│   ├── Spring Data MongoDB
│   │   ├── UserRepository
│   │   └── MenuRepository
│   │
│   └── Controllers
│       ├── AuthController
│       │   ├── UserRepository
│       │   └── JwtUtil
│       │
│       └── MenuController
│           └── MenuRepository
│
├── Models
│   ├── User.java
│   └── Menu.java
│
└── Utilities
    └── JwtUtil.java
        └── io.jsonwebtoken (JWT library)
```

---

This diagram set provides a complete visual understanding of how your Menu API system works from frontend to backend! 🎯
