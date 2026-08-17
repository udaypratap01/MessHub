# React Authentication System - Visual Guide

## 🏗️ Application Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      App.js (Main)                           │
│                                                              │
│  State:                                                     │
│  • isAuthenticated: boolean                                │
│  • loading: boolean                                        │
│  • user: object                                            │
│                                                              │
│  useEffect: Check localStorage for token on load          │
│                                                              │
│  ┌────────────────────────────────────────────────────────┐│
│  │           React Router Configuration                    ││
│  │                                                          ││
│  │  Route "/" ──► Login Component ─────┬─────────────────┐││
│  │                                      │                 ││
│  │  Route "/dashboard" ──► ProtectedRoute               │││
│  │                              │                        │││
│  │                              ▼                        │││
│  │                         Dashboard Component           │││
│  │                                      │                 ││
│  │                                      └─────────────────┘││
│  │                                                          ││
│  │  Route "*" ──► Redirect to "/"                        ││
│  └────────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────────┘
```

---

## 🔐 Authentication Flow Diagram

```
┌──────────────────────────────────────────────────────────────┐
│                    User Journey                              │
└──────────────────────────────────────────────────────────────┘

START
  │
  ▼
┌─────────────────────┐
│  Visit localhost:3000
│  ▼
│  App.js checks token
│  ▼
│  ┌──────────────────┐
│  │ Token exists?    │
│  └──────────────────┘
│  /          \
│ YES         NO
│ /             \
▼              ▼
[Token OK]     [No Token]
│              │
▼              ▼
Auto-      Show Login
Redirect   Page
│          │
│          ▼
│      User enters
│      credentials
│      │
│      ▼
│      Click Login
│      │
│      ▼
│      API Call:
│      POST /api/auth/login
│      ├─ email
│      └─ password
│      │
│      ▼
│      ┌──────────────────┐
│      │ Response valid?  │
│      └──────────────────┘
│      /            \
│     YES           NO
│    /               \
│   ▼                ▼
│ Store Token    Show Error
│ Store User     Message
│ setAuth(true)  Try Again
│ │
│ ▼
└──►
    │
    ▼
┌─────────────────────┐
│  Dashboard Page     │
│  ├─ Username        │
│  ├─ User Role       │
│  ├─ User Info       │
│  ├─ Features        │
│  └─ Logout Button   │
│      │
│      ▼
│   Click Logout
│      │
│      ▼
│   Clear Token
│   Clear User
│      │
│      ▼
└──►Login Page
    │
    └──► (repeat flow)
```

---

## 📁 Component Tree

```
App (Provider of auth state)
│
├─── BrowserRouter
│    │
│    └─── Routes
│         │
│         ├─── Route "/"
│         │    │
│         │    └─── Conditional:
│         │         ├─ isAuthenticated?
│         │         │  └─ Navigate to /dashboard
│         │         └─ else
│         │            └─ Login Component
│         │                │
│         │                └─ Props:
│         │                   ├─ setIsAuthenticated
│         │                   └─ setUser
│         │
│         ├─── Route "/dashboard"
│         │    │
│         │    └─── ProtectedRoute (checks isAuthenticated)
│         │         │
│         │         └─── If authorized:
│         │              Dashboard Component
│         │              │
│         │              └─ Props:
│         │                 ├─ setIsAuthenticated
│         │                 ├─ setUser
│         │                 └─ user
│         │
│         └─── Route "*"
│              │
│              └─── Navigate to "/"
```

---

## 🔄 Data Flow

```
┌─────────────────────────────────────┐
│     App.js (State Container)       │
│                                     │
│  isAuthenticated                   │
│  └─ Passed down as prop            │
│     │                               │
│     ├─ to Login                    │
│     └─ to ProtectedRoute           │
│                                     │
│  user                               │
│  └─ Passed down as prop            │
│     │                               │
│     └─ to Dashboard                │
│                                     │
│  setIsAuthenticated                │
│  └─ Callback passed down          │
│     │                               │
│     ├─ to Login (called on success) │
│     └─ to Dashboard (called on logout)
│                                     │
│  setUser                            │
│  └─ Callback passed down           │
│     │                               │
│     ├─ to Login (called on success) │
│     └─ to Dashboard (called on logout)
└─────────────────────────────────────┘
         │                 │
         │                 │
         ▼                 ▼
┌──────────────────┐  ┌───────────────┐
│  Login.js        │  │  Dashboard.js │
│                  │  │               │
│  State:          │  │  Uses:        │
│  ├─ email        │  │  ├─ props.user
│  ├─ password     │  │  ├─ props.setIsAuth
│  ├─ loading      │  │  └─ localStorage
│  └─ error        │  │
│                  │  │  Calls:
│  Actions:        │  │  ├─ setIsAuth
│  └─ handleLogin  │  │  ├─ setUser
│     └─ API Call  │  │  └─ useNavigate
│        └─ Store  │  │
│           token  │  │
│        └─ Call   │  │
│           setAuth│  │
│        └─ Redir  │  │
└──────────────────┘  └───────────────┘
```

---

## 🔑 Token & User Storage

```
localStorage
│
├─── "token" (string)
│    │
│    ├─ Value: JWT token
│    ├─ Set by: Login component on success
│    ├─ Used by: App to check authentication
│    ├─ Cleared by: Dashboard logout button
│    └─ Example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
│
└─── "user" (JSON string)
     │
     ├─ Value: JSON stringified user object
     ├─ Structure:
     │  {
     │    "id": 1,
     │    "name": "John Doe",
     │    "email": "john@example.com",
     │    "role": "STUDENT"
     │  }
     ├─ Set by: Login component on success
     ├─ Used by: Dashboard to display user info
     ├─ Cleared by: Dashboard logout button
     └─ Retrieved with: JSON.parse(localStorage.getItem('user'))
```

---

## 🌐 API Integration

```
Login.js
│
├─ Form inputs:
│  ├─ email
│  └─ password
│
├─ Validation
│  └─ Both fields required
│
├─ API Call:
│  POST http://localhost:8080/api/auth/login
│  Content-Type: application/json
│  │
│  ├─ Request Body:
│  │  {
│  │    "email": "user@example.com",
│  │    "password": "password123"
│  │  }
│  │
│  └─ Response Success (200):
│     {
│       "token": "JWT token here",
│       "user": {
│         "id": 1,
│         "name": "John Doe",
│         "email": "john@example.com",
│         "role": "STUDENT"
│       }
│     }
│
├─ On Success:
│  ├─ localStorage.setItem('token', response.data.token)
│  ├─ localStorage.setItem('user', JSON.stringify(response.data.user))
│  ├─ setIsAuthenticated(true)
│  ├─ setUser(response.data.user)
│  └─ navigate('/dashboard')
│
└─ On Error:
   ├─ Display error message
   └─ Stay on login page
```

---

## 🛡️ Route Protection

```
User accesses /dashboard
│
▼
ProtectedRoute Component
│
├─ Check: isAuthenticated?
│
├─ YES:
│  └─ Render Dashboard
│
└─ NO:
   └─ <Navigate to="/" />
      │
      └─ Redirect to Login
```

---

## 🎨 Component States

### Login Component States
```
┌────────────────────────────────┐
│ Login Component States         │
├────────────────────────────────┤
│                                │
│ Initial State:                 │
│ ├─ email: ""                   │
│ ├─ password: ""                │
│ ├─ loading: false              │
│ └─ error: ""                   │
│                                │
│ User Typing:                   │
│ ├─ email: "user@..."           │
│ ├─ password: "pass..."         │
│ ├─ loading: false              │
│ └─ error: ""                   │
│                                │
│ Submitting:                    │
│ ├─ email: "user@..."           │
│ ├─ password: "pass..."         │
│ ├─ loading: true               │
│ └─ error: ""                   │
│                                │
│ Error:                         │
│ ├─ email: "user@..."           │
│ ├─ password: "pass..."         │
│ ├─ loading: false              │
│ └─ error: "Invalid creds"      │
│                                │
│ Success:                       │
│ → Redirect to /dashboard       │
│                                │
└────────────────────────────────┘
```

---

## 🔄 Session Lifecycle

```
Session Start
│
├─ App Load
│  └─ Check localStorage['token']
│
├─ Token exists?
│  ├─ YES: setIsAuthenticated(true)
│  └─ NO: setIsAuthenticated(false)
│
├─ Display appropriate page
│  ├─ If authenticated: Dashboard
│  └─ If not: Login
│
├─ User is authenticated
│  ├─ Can access dashboard
│  ├─ Token persists in localStorage
│  └─ Survives page refresh
│
├─ User action: Click Logout
│  ├─ Clear token from localStorage
│  ├─ Clear user from localStorage
│  ├─ setIsAuthenticated(false)
│  ├─ setUser(null)
│  └─ Redirect to login
│
└─ Session End
   └─ Login page shown again
```

---

## 📱 Responsive Breakpoints

```
Desktop (> 768px)
├─ Two column layout
├─ Navbar side-by-side
├─ Large cards
└─ Full spacing

Tablet (480px - 768px)
├─ Single/dual column
├─ Stacked navbar
├─ Medium cards
└─ Adjusted spacing

Mobile (< 480px)
├─ Single column
├─ Stacked navbar
├─ Compact cards
└─ Minimal padding
```

---

## ⚡ Performance Flow

```
App Load (once)
└─ useEffect runs
   └─ Check localStorage (fast, local)
   └─ setLoading(false)
   └─ Render app

Route Change
└─ Router renders appropriate component
└─ No API call unless login

Login
└─ API call to backend (async)
└─ Wait for response
└─ Update state
└─ Navigate to dashboard

Dashboard
└─ Read from localStorage (fast, local)
└─ Render user data
└─ No API calls needed

Logout
└─ Clear localStorage (fast, local)
└─ Update state
└─ Navigate to login
```

---

## 🎯 Key Takeaways

1. **Routing**: React Router manages navigation
2. **State**: App.js holds auth state
3. **Protection**: ProtectedRoute guards dashboard
4. **Storage**: localStorage persists token
5. **Flow**: Login → API → Store → Redirect
6. **Logout**: Clear → Redirect → Login
7. **Security**: Token always validated
8. **UX**: Smooth transitions & feedback

---

## 📚 Related Files

- `App.js` - Main router and state
- `pages/Login.js` - Login form
- `pages/Dashboard.js` - Protected page
- `components/ProtectedRoute.js` - Route guard
- `styles/Login.css` - Login styling
- `styles/Dashboard.css` - Dashboard styling

All components work together to create a seamless authentication experience!
