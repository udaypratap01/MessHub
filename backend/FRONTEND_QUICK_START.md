# Mess Management System - Complete Frontend Setup Guide

## ✅ What's Been Done

✅ React app created in `frontend/` directory  
✅ Dependencies installed: `axios` and `react-router-dom`  
✅ Complete code provided in `REACT_FRONTEND_SETUP.md`

## 🚀 Quick Setup (Copy-Paste Instructions)

### Step 1: Create All Required Files

Navigate to `frontend/src/` and create these files with the code from `REACT_FRONTEND_SETUP.md`:

**Components Folder:**
```bash
mkdir components
# Create: Sidebar.js, Sidebar.css, ProtectedRoute.js
```

**Pages Folder:**
```bash
mkdir pages
# Create: Login.js, Auth.css, Dashboard.js, Menu.js, Attendance.js, Billing.js, Pages.css
```

**Root Files:**
```
# Update: App.js, App.css, index.js
# Create: api.js
```

### Step 2: File Structure After Setup

```
frontend/
├── src/
│   ├── api.js                    ✅ API configuration with JWT
│   ├── App.js                    ✅ Main routing
│   ├── App.css                   ✅ Global styles
│   ├── index.js                  ✅ Entry point
│   ├── components/
│   │   ├── Sidebar.js            ✅ Navigation menu
│   │   ├── Sidebar.css           ✅ Sidebar styles
│   │   └── ProtectedRoute.js     ✅ Route protection
│   └── pages/
│       ├── Login.js              ✅ Login page
│       ├── Auth.css              ✅ Auth styles
│       ├── Dashboard.js          ✅ Dashboard
│       ├── Menu.js               ✅ Menu page
│       ├── Attendance.js         ✅ Attendance page
│       ├── Billing.js            ✅ Billing page
│       └── Pages.css             ✅ Page styles
├── package.json                  ✅ Dependencies installed
└── .env                          ✅ Environment variables
```

### Step 3: Run the Application

**Terminal 1 - Start Backend:**
```bash
cd backend
.\gradlew.bat bootRun
# Or use your IDE's Run button for Spring Boot
```

**Terminal 2 - Start Frontend:**
```bash
cd frontend
npm start
```

**Result:**
- Backend API running at: `http://localhost:8080`
- Frontend running at: `http://localhost:3000`
- Auto-opens browser to login page

### Step 4: Test the Application

**Login with Test Credentials:**

STUDENT Account:
- Email: `student@example.com`
- Password: `password123`

ADMIN Account:
- Email: `admin@example.com`
- Password: `password123`

## 📱 Features by Role

### STUDENT Can:
- 👤 View profile on dashboard
- 📋 View weekly menu
- ✅ Mark daily attendance
- 💰 View personal billing

### ADMIN Can:
- 👤 View profile on dashboard
- 📋 Create/update menu
- 📊 View all student attendance
- 💳 Generate bills for students
- 📈 View all bills

## 🔒 Security Implementation

```javascript
// Automatic JWT Token Handling:
1. User logs in
2. Token stored in localStorage
3. Every API request includes: Authorization: Bearer <token>
4. If token expires (401): Auto-logout & redirect to login
5. Protected routes check for token before allowing access
```

## 📚 File Descriptions

| File | Purpose |
|------|---------|
| `api.js` | Axios instance with JWT interceptors |
| `ProtectedRoute.js` | Wrapper to protect routes from unauthorized access |
| `Sidebar.js` | Navigation menu with role-based links |
| `Login.js` | Login form with JWT token handling |
| `Dashboard.js` | Welcome page with user info |
| `Menu.js` | Display weekly menu from backend |
| `Attendance.js` | Mark/view attendance records |
| `Billing.js` | Generate/view bills based on attendance |

## 🎨 Design Features

- **Gradient Purple Theme**: Professional gradient backgrounds
- **Responsive Layout**: Works on desktop and mobile
- **Sidebar Navigation**: Fixed left sidebar with role-based links
- **Card-Based Design**: Modern card layouts for data
- **Smooth Animations**: Hover effects and transitions
- **Status Indicators**: Color-coded attendance (Green/Red)
- **Loading States**: Shows loading messages while fetching

## 🔍 API Integration

All endpoints are called with automatic JWT token:

```javascript
// Example: Get Menu
GET /api/menu
Headers: { Authorization: "Bearer <jwt_token>" }

// Example: Mark Attendance
POST /api/attendance
Body: { date: "2026-04-15", status: "PRESENT" }
Headers: { Authorization: "Bearer <jwt_token>" }
```

## ⚙️ Environment Configuration

Create `.env` in frontend root (optional):
```
REACT_APP_API_URL=http://localhost:8080/api
```

The app uses `http://localhost:8080/api` by default.

## 🐛 Troubleshooting

### Issue: CORS Error
**Solution**: Ensure backend is running on port 8080

### Issue: "Token is undefined"
**Solution**: Clear localStorage and login again
```javascript
localStorage.clear();
```

### Issue: 401 Unauthorized
**Solution**: Token expired, login again

### Issue: Cannot connect to backend
**Solution**: 
- Check backend is running: `http://localhost:8080`
- Check port is correct in `api.js`

## 📝 Next Steps

1. ✅ Create all files from `REACT_FRONTEND_SETUP.md`
2. ✅ Start backend (Spring Boot)
3. ✅ Start frontend (React)
4. ✅ Test with credentials provided
5. ✅ Customize styling as needed

## 🎯 Complete Feature Checklist

Frontend:
- ✅ Login page with JWT authentication
- ✅ Protected routes (redirect to login if no token)
- ✅ Dashboard with user information
- ✅ Menu display page
- ✅ Student: Mark attendance
- ✅ Admin: View all attendance
- ✅ Student: View own bills
- ✅ Admin: Generate bills
- ✅ Admin: View all bills
- ✅ Sidebar navigation with role-based links
- ✅ Logout functionality
- ✅ Error handling and messages
- ✅ Responsive design

Backend Integration:
- ✅ JWT token in localStorage
- ✅ Automatic token in request headers
- ✅ Auto-logout on 401 error
- ✅ All CRUD operations
- ✅ Role-based access control

## 💡 Tips for Customization

1. **Change Colors**: Modify gradient colors in CSS files
2. **Change Port**: Update `api.js` baseURL and backend `application.properties`
3. **Add More Pages**: Follow the pattern in `pages/` folder
4. **Customize Components**: Edit CSS files in each component

## 🚀 Ready to Go!

Your complete Mess Management System is ready with:
- ✅ Spring Boot REST API
- ✅ MongoDB database
- ✅ JWT authentication
- ✅ Role-based access control
- ✅ React frontend with all features
- ✅ Responsive design

Start building! 🎉
