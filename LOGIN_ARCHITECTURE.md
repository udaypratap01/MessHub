# 🔐 LOGIN SYSTEM - VISUAL FLOW & ARCHITECTURE

## 🔄 LOGIN FLOW DIAGRAM

```
┌─────────────────────────────────────────────────────────────────┐
│                     USER ENTERS CREDENTIALS                       │
│              Email: admin@gmail.com                                │
│              Password: 123456                                      │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│          🖥️ FRONTEND: Login.js                                    │
│                                                                    │
│  1. console.log("🔐 LOGIN ATTEMPT")                              │
│  2. POST to http://localhost:8080/api/auth/login                 │
│     {email: "admin@gmail.com", password: "123456"}               │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼ HTTP REQUEST
┌─────────────────────────────────────────────────────────────────┐
│        🔐 BACKEND: AuthController.java                            │
│                                                                    │
│  1. Receive login request                                         │
│  2. console.log("🔐 LOGIN REQUEST RECEIVED")                     │
│  3. Normalize email: admin@gmail.com → admin@gmail.com           │
│  4. console.log("✓ Normalized email")                            │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│        📦 MONGODB: Users Collection                               │
│                                                                    │
│  1. console.log("🔍 Searching for user in database...")          │
│  2. Query: db.users.find() where email="admin@gmail.com"         │
│  3. Result: User found                                            │
│  4. console.log("   ✓ Found matching user")                      │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│        ✓ CHECK PASSWORD                                           │
│                                                                    │
│  1. console.log("🔑 Checking password...")                       │
│  2. Stored: 123456                                                │
│  3. Input:  123456                                                │
│  4. Match:  YES ✓                                                 │
│  5. console.log("✓ Password correct!")                           │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│        🎫 GENERATE JWT TOKEN                                      │
│                                                                    │
│  1. console.log("🎯 Generating JWT token...")                    │
│  2. Email: admin@gmail.com                                        │
│  3. Role: ADMIN                                                   │
│  4. Secret Key: [32+ character key]                              │
│  5. Expiration: 1 hour                                            │
│  6. Result: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...             │
│  7. console.log("✓ Token created successfully")                  │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼ HTTP RESPONSE (200 OK)
┌─────────────────────────────────────────────────────────────────┐
│        Response JSON:                                             │
│        {                                                          │
│          "message": "Login successful",                           │
│          "token": "eyJhbGciOiJIUzI1NiIs...",                      │
│          "user": {                                                │
│            "id": "507f1f77bcf86cd799439011",                     │
│            "name": "Admin",                                       │
│            "email": "admin@gmail.com",                            │
│            "role": "ADMIN"                                        │
│          }                                                        │
│        }                                                          │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│          🖥️ FRONTEND: Process Response                            │
│                                                                    │
│  1. console.log("✅ SUCCESS RESPONSE", response.data)            │
│  2. Extract token: "eyJhbGciOiJIUzI1NiIs..."                     │
│  3. console.log("🔑 Token received", token)                      │
│  4. localStorage.setItem("token", token)                         │
│  5. console.log("👤 User data", user)                            │
│  6. localStorage.setItem("user", JSON.stringify(user))           │
│  7. setIsAuthenticated(true)                                      │
│  8. navigate("/dashboard")                                        │
│  9. console.log("🎉 Login successful!")                          │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│        💾 BROWSER STORAGE                                         │
│                                                                    │
│  localStorage:                                                    │
│  {                                                                │
│    "token": "eyJhbGciOiJIUzI1NiIs...",                           │
│    "user": "{\"id\":\"...\",\"name\":\"Admin\",\"email\":\"...\" │
│  }                                                                │
└──────────────────────────┬──────────────────────────────────────┘
                           │
                           ▼
┌─────────────────────────────────────────────────────────────────┐
│        🏠 DASHBOARD PAGE                                          │
│                                                                    │
│  ✅ User authenticated                                            │
│  ✅ Token available for API calls                                 │
│  ✅ User info displayed                                           │
│  ✅ Can access protected routes                                   │
└─────────────────────────────────────────────────────────────────┘
```

---

## ❌ ERROR FLOW DIAGRAM

### Scenario 1: User Not Found

```
📝 Input: admin@gmail.com (doesn't exist in DB)
                │
                ▼
    🔍 Search in MongoDB
                │
                ▼
    ❌ NOT FOUND
                │
                ▼
┌──────────────────────────────────┐
│ Response (404):                   │
│ {                                 │
│   "message": "User not found.     │
│    Please check your email."      │
│ }                                 │
└──────────────────────────────────┘
                │
                ▼
    🖥️ Frontend shows error
    "User not found. Please check
     your email."
                │
                ▼
    📊 Backend logs show:
    ❌ USER NOT FOUND: admin@gmail.com
       Available users in DB:
         - test@gmail.com
```

### Scenario 2: Wrong Password

```
📝 Input: admin@gmail.com (exists)
     Password: wrong123
                │
                ▼
    ✓ User found in DB
                │
                ▼
    🔑 Check password
       Stored: 123456
       Input:  wrong123
                │
                ▼
    ❌ PASSWORD MISMATCH
                │
                ▼
┌──────────────────────────────────┐
│ Response (401):                   │
│ {                                 │
│   "message": "Invalid password.   │
│    Please try again."             │
│ }                                 │
└──────────────────────────────────┘
                │
                ▼
    🖥️ Frontend shows error
    "Invalid password. Please try
     again."
                │
                ▼
    📊 Backend logs show:
    ❌ PASSWORD MISMATCH
       Stored password: 123456
       Input password: wrong123
```

### Scenario 3: Network Error

```
🖥️ Frontend tries to send request
                │
                ▼
    🌐 POST to http://localhost:8080
                │
                ▼
    ❌ CANNOT REACH SERVER
    (Backend not running or wrong URL)
                │
                ▼
    Network Error
                │
                ▼
    🖥️ Frontend catches error:
    err.message === "Network Error"
                │
                ▼
┌──────────────────────────────────┐
│ Show error message:               │
│ "Network error. Please check      │
│  if the server is running."       │
└──────────────────────────────────┘
                │
                ▼
    💡 User starts backend:
    mvn spring-boot:run
```

---

## 🏗️ SYSTEM ARCHITECTURE

```
┌────────────────────────────────────────────────────────────┐
│                    FRONTEND (React)                         │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Login.js Component                          │  │
│  │                                                        │  │
│  │  • Form with email & password inputs                 │  │
│  │  • handleLogin() function                            │  │
│  │  • Error message display                             │  │
│  │  • Loading state                                     │  │
│  │  • Console logging (debugging)                       │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                   │
│                         │ axios.post()                      │
│                         │                                   │
└─────────────────────────┼───────────────────────────────────┘
                          │
                          │ HTTP POST
                          │ /api/auth/login
                          │
┌─────────────────────────┼───────────────────────────────────┐
│                         ▼                                   │
│                    BACKEND (Spring Boot)                    │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │         AuthController.java                          │  │
│  │                                                        │  │
│  │  @PostMapping("/login")                             │  │
│  │  - Validate input                                   │  │
│  │  - Find user in database                            │  │
│  │  - Check password                                   │  │
│  │  - Generate JWT token                              │  │
│  │  - System.out.println() logging                     │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                   │
│                         │ userRepository.findAll()          │
│                         │                                   │
│  ┌──────────────────────┼──────────────────────────────┐   │
│  │                      ▼                              │   │
│  │            MONGODB (Database)                       │   │
│  │                                                     │   │
│  │  Collection: users                                │   │
│  │  {                                                 │   │
│  │    _id: ObjectId(...),                            │   │
│  │    name: "Admin",                                 │   │
│  │    email: "admin@gmail.com",                      │   │
│  │    password: "123456",                            │   │
│  │    role: "ADMIN"                                  │   │
│  │  }                                                 │   │
│  └─────────────────────────────────────────────────────┘   │
│                         │                                   │
│                         │ User found                        │
│                         │                                   │
│  ┌──────────────────────┼──────────────────────────────┐   │
│  │                      ▼                              │   │
│  │            JwtUtil.java                            │   │
│  │                                                     │   │
│  │  generateToken(email, role)                       │   │
│  │  - Create claims map                              │   │
│  │  - Build JWT with email + role                    │   │
│  │  - Sign with secret key                           │   │
│  │  - Return token                                   │   │
│  │  - System.out.println() logging                   │   │
│  └─────────────────────────────────────────────────────┘   │
│                         │                                   │
│                         │ token generated                   │
│                         │                                   │
│  ┌──────────────────────┼──────────────────────────────┐   │
│  │                      ▼                              │   │
│  │     ResponseEntity.ok(response)                    │   │
│  │     HTTP 200 OK with:                             │   │
│  │     - token: "eyJhbGci..."                        │   │
│  │     - user: {id, name, email, role}              │   │
│  │     - message: "Login successful"                │   │
│  └─────────────────────────────────────────────────────┘   │
└─────────────────────────┬─────────────────────────────────┘
                          │
                          │ HTTP Response (200)
                          │
┌─────────────────────────┼───────────────────────────────────┐
│                         ▼                                   │
│                  FRONTEND (React)                           │
│                                                             │
│  ┌──────────────────────────────────────────────────────┐  │
│  │      Process Response & Update State                 │  │
│  │                                                        │  │
│  │  1. Extract token from response                      │  │
│  │  2. localStorage.setItem("token", token)             │  │
│  │  3. localStorage.setItem("user", userData)           │  │
│  │  4. setIsAuthenticated(true)                         │  │
│  │  5. navigate("/dashboard")                           │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                   │
│                         ▼                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │      App.js: Authentication Check                    │  │
│  │                                                        │  │
│  │  useEffect(() => {                                 │  │
│  │    const token = localStorage.getItem('token');   │  │
│  │    if (token && isValid) {                         │  │
│  │      setIsAuthenticated(true);                     │  │
│  │    }                                                │  │
│  │  })                                                 │  │
│  └──────────────────────────────────────────────────────┘  │
│                         │                                   │
│                         ▼                                   │
│  ┌──────────────────────────────────────────────────────┐  │
│  │           Dashboard Page Loaded                      │  │
│  │                                                        │  │
│  │  ✅ User is logged in                                │  │
│  │  ✅ Token available for API calls                    │  │
│  │  ✅ User info visible                                │  │
│  │  ✅ Can access protected routes                      │  │
│  └──────────────────────────────────────────────────────┘  │
└────────────────────────────────────────────────────────────┘
```

---

## 📊 DATA FLOW DIAGRAM

```
USER INPUT
├─ email: "admin@gmail.com"
└─ password: "123456"
        │
        ▼
FRONTEND VALIDATION
├─ Check not empty
├─ console.log(email, password)
└─ Send to backend
        │
        ▼
BACKEND RECEIVES
├─ Extract email & password
├─ System.out.println(email)
└─ Normalize email
        │
        ▼
DATABASE QUERY
├─ Find user by normalized email
├─ Return user object
└─ System.out.println(result)
        │
        ▼
PASSWORD CHECK
├─ Compare stored vs input
├─ If match → continue
├─ If not → return 401 error
└─ System.out.println(match status)
        │
        ▼
TOKEN GENERATION
├─ JwtUtil.generateToken(email, role)
├─ Create JWT with claims
├─ Sign with secret key
├─ System.out.println(token)
└─ Return token string
        │
        ▼
BUILD RESPONSE
├─ Create response object
├─ Add token
├─ Add user data
├─ Add success message
└─ Return HTTP 200
        │
        ▼
FRONTEND RECEIVES
├─ Extract token
├─ Extract user data
├─ console.log(response)
└─ Validate token exists
        │
        ▼
STORE IN BROWSER
├─ localStorage.setItem("token", token)
├─ localStorage.setItem("user", userData)
└─ console.log(stored)
        │
        ▼
UPDATE APPLICATION STATE
├─ setIsAuthenticated(true)
├─ setUser(userData)
└─ Navigate to /dashboard
        │
        ▼
SHOW DASHBOARD
├─ Load user's home page
├─ Fetch data with token
└─ User logged in ✅
```

---

## 🔒 SECURITY LAYERS

```
Layer 1: INPUT VALIDATION
├─ Frontend: Check email & password not empty
├─ Frontend: Basic format validation
└─ Backend: Validate email and password received

Layer 2: DATABASE VERIFICATION
├─ Query database for user
├─ Verify email exists
├─ Handle case-insensitive search
└─ Return 404 if not found

Layer 3: PASSWORD AUTHENTICATION
├─ Compare input password with stored
├─ Exact match required (case-sensitive)
├─ Log attempt for auditing
└─ Return 401 if mismatch

Layer 4: JWT TOKEN GENERATION
├─ Use secure secret key (32+ chars)
├─ Include email in subject
├─ Include role in claims
├─ Set expiration time (1 hour)
├─ Sign with HMAC-SHA256
└─ Return token to frontend

Layer 5: BROWSER STORAGE
├─ Store token in localStorage
├─ Store user data in localStorage
├─ Token sent in Authorization header
├─ Backend validates token on each request
└─ Expire token after 1 hour

Layer 6: API SECURITY
├─ All protected endpoints require token
├─ Token validated in @RequestHeader
├─ Extract email from token
├─ Verify token signature
├─ Check expiration
└─ Grant access only if valid
```

---

## 🎯 WHAT EACH COMPONENT DOES

```
┌─────────────┐
│  Frontend   │  Shows login form, collects credentials,
│  Login.js   │  sends to backend, handles response/errors
└─────────────┘

┌──────────────────┐
│  Backend Auth    │  Receives credentials, finds user,
│  Controller      │  checks password, generates token
└──────────────────┘

┌─────────────┐
│  JWT Util   │  Creates JWT token with claims and
│             │  secret key signature
└─────────────┘

┌─────────────┐
│  MongoDB    │  Stores user data (email, password,
│             │  role, etc.)
└─────────────┘

┌─────────────┐
│  App.js     │  Checks if user logged in, shows
│             │  login or dashboard
└─────────────┘

┌─────────────┐
│  Browser    │  Stores token and user data in
│  Storage    │  localStorage for persistence
└─────────────┘
```

---

**Status:** ✅ **ARCHITECTURE DOCUMENTED**
**Last Updated:** April 17, 2026
