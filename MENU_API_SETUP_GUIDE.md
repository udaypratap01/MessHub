# 📋 Menu API Integration - Complete Setup & Troubleshooting Guide

## 🎯 Overview
This guide explains how the Menu API works, what was fixed, and how to troubleshoot any issues.

---

## ✅ What Was Fixed

### 1. **Enhanced Error Handling in React (Menu.js)**
- ✅ Added detailed console logging for debugging
- ✅ Better error messages for different HTTP status codes (401, 403, 404, 500)
- ✅ Token validation before making API calls
- ✅ Added `withCredentials: true` for CORS
- ✅ Detailed error response logging to help identify issues

### 2. **Backend Configuration (Already Correct)**
- ✅ SecurityConfig allows GET /api/menu for ADMIN and STUDENT roles
- ✅ SecurityConfig allows POST /api/menu for ADMIN only
- ✅ JwtFilter extracts user role from database and sets authorities
- ✅ MenuController returns proper JSON responses

---

## 🏗️ Architecture Overview

### Frontend Flow (React)
```
Login Page
    ↓
User enters email & password
    ↓
POST /api/auth/login
    ↓
Store token & user data in localStorage
    ↓
Navigate to Dashboard
    ↓
User clicks "Menu" link
    ↓
Menu Component loads
    ↓
fetchMenus() function:
  - Gets token from localStorage
  - Makes GET request to /api/menu with Bearer token
  - Displays menus or error message
```

### Backend Flow (Spring Boot)
```
GET /api/menu (with Authorization header)
    ↓
CorsFilter (handles CORS)
    ↓
JwtFilter:
  - Extracts token from Authorization header
  - Validates token using JwtUtil
  - Extracts email from token
  - Looks up user in MongoDB
  - Gets user's role (ADMIN or STUDENT)
  - Sets Spring Security authorities
    ↓
SecurityConfig checks authorization:
  - If role is ADMIN or STUDENT → ALLOWED
  - Otherwise → FORBIDDEN (403)
    ↓
MenuController.getAllMenus():
  - Queries MongoDB for all Menu documents
  - Returns List<Menu> as JSON
    ↓
Response with HTTP 200 + Menu data
```

---

## 🔐 Role-Based Access Control

### GET /api/menu (View Menus)
- **Allowed Roles**: ADMIN, STUDENT
- **Token Required**: YES
- **Response**: List of all menus

### POST /api/menu (Add Menu)
- **Allowed Roles**: ADMIN only
- **Token Required**: YES
- **Body**: JSON with day, breakfast, lunch, dinner
- **Response**: Created menu object (HTTP 201)

---

## 🛠️ Troubleshooting

### Problem 1: "Failed to load menus" Error
**Diagnosis Steps:**
1. Open browser DevTools (F12)
2. Go to Console tab
3. Look for error logs with ⚠️, ❌, 📊 prefixes
4. Check the Network tab to see the actual request/response

**Common Causes & Solutions:**

#### A. Token Not Found
```
Error: No token found in localStorage
```
**Solution:**
- Log out and log in again
- Check that Login page correctly stores token in localStorage
- In Console, run: `console.log(localStorage.getItem('token'))`

#### B. 401 Unauthorized
```
Response Status: 401
```
**Causes:**
- Token is expired (tokens expire after 1 hour by default)
- Token is malformed
- Token was tampered with

**Solutions:**
1. Log out: Click logout button
2. Log in again to get a fresh token
3. Check backend: Is JwtUtil configured with correct secret key?

#### C. 403 Forbidden
```
Response Status: 403
```
**Causes:**
- User role doesn't have permission for this endpoint
- User was created without a role in MongoDB

**Solutions:**
1. Check user's role in MongoDB database:
   ```bash
   # In MongoDB shell
   db.user.findOne({ email: "student@test.com" })
   # Check the "role" field - should be "ADMIN" or "STUDENT"
   ```
2. Update user's role if needed:
   ```bash
   db.user.updateOne(
     { email: "student@test.com" },
     { $set: { role: "STUDENT" } }
   )
   ```

#### D. 404 Not Found
```
Response Status: 404
```
**Causes:**
- Backend server is not running
- Wrong backend URL in React code

**Solutions:**
1. Start backend: `./gradlew bootRun` (Windows: `gradlew.bat bootRun`)
2. Verify backend is running: Visit http://localhost:8080 in browser
3. Check Menu.js has correct URL: `http://localhost:8080/api/menu`

#### E. Connection Refused
```
Error: connect ECONNREFUSED 127.0.0.1:8080
```
**Solution:**
- Backend is not running
- Start it with: `./gradlew bootRun`
- Wait 30-60 seconds for Spring Boot to start

---

## 🧪 Manual Testing

### Test 1: Backend API with Thunder Client
1. Open Thunder Client extension
2. Create new request:
   ```
   Method: GET
   URL: http://localhost:8080/api/menu
   Headers:
     Authorization: Bearer <your-token>
     Content-Type: application/json
   ```
3. Should return HTTP 200 with list of menus (may be empty if no menus added)

### Test 2: React Frontend
1. Start React: `npm start` (in frontend directory)
2. Login with valid credentials
3. Navigate to Menu page
4. Should see list of menus (or empty state if none exist)
5. If ADMIN: Should see "Add New Menu" button
6. If STUDENT: Should NOT see "Add New Menu" button

### Test 3: Create a New Menu (ADMIN only)
1. Login as ADMIN user
2. Go to Menu page
3. Click "+ Add New Menu"
4. Fill form:
   - Day: Monday
   - Breakfast: Eggs and Toast
   - Lunch: Rice and Curry
   - Dinner: Pasta and Salad
5. Click "Save Menu"
6. Should see new menu in the list

---

## 📊 Key Files

### Frontend
- **`/frontend/src/pages/Menu.js`** - Main Menu component
  - `fetchMenus()` - Gets all menus from API
  - `handleAddMenu()` - Adds new menu (ADMIN only)
  - Includes enhanced error logging

- **`/frontend/src/pages/Login.js`** - Login component
  - Authenticates user
  - Stores token in localStorage

### Backend
- **`/backend/src/main/java/.../controller/MenuController.java`** - REST API endpoints
  - GET /api/menu → Returns list of menus
  - POST /api/menu → Creates new menu (ADMIN only)

- **`/backend/src/main/java/.../filter/JwtFilter.java`** - JWT authentication
  - Extracts token from Authorization header
  - Validates token
  - Looks up user role from database
  - Sets Spring Security authorities

- **`/backend/src/main/java/.../config/SecurityConfig.java`** - Security rules
  - Defines which endpoints are accessible by which roles
  - Configures CORS
  - Integrates JWT filter

- **`/backend/src/main/java/.../util/JwtUtil.java`** - JWT utilities
  - Generates tokens
  - Validates tokens
  - Extracts claims

---

## 🚀 Starting the Application

### Terminal 1: Start Backend
```bash
cd backend
./gradlew bootRun
# or on Windows:
gradlew.bat bootRun
```
Wait for: `Started BackendApplication in X.XXX seconds`

### Terminal 2: Start Frontend
```bash
cd frontend
npm install  # if not already done
npm start
```
Wait for browser to open at http://localhost:3000

### Test Flow
1. Browser opens with Login page
2. Enter email: `admin@test.com` and password: `password123`
3. Should redirect to Dashboard
4. Click "Menu" link
5. Should see list of menus (empty initially)
6. Click "+ Add New Menu" (if ADMIN)
7. Fill form and save
8. New menu appears in list

---

## 🔧 Database Check

If menus not appearing, check MongoDB:

```bash
# Connect to MongoDB
mongo

# Select database
use messhub

# Check users
db.user.find().pretty()

# Check menus
db.menu.find().pretty()

# Check a specific user's role
db.user.findOne({ email: "admin@test.com" })
```

Expected output for user:
```json
{
  "_id": ObjectId(...),
  "name": "Admin User",
  "email": "admin@test.com",
  "password": "password123",
  "role": "ADMIN"
}
```

---

## 📝 Common Configuration Issues

### Issue: CORS Error in Browser Console
```
Access to XMLHttpRequest at 'http://localhost:8080/api/menu' from origin 'http://localhost:3000' 
has been blocked by CORS policy
```
**Solution:**
- Backend CorsConfig is already set up in SecurityConfig
- Verify SecurityConfig has `.cors(Customizer.withDefaults())`
- Restart backend if you made changes

### Issue: JWT Secret Not Matching
**Solution:**
- Both backend and frontend use same token (generated by backend)
- No configuration needed on frontend
- Check backend property: `jwt.secret` in `application.properties`

### Issue: Token Expiration
Default: 3600000 milliseconds = 1 hour

To change in `application.properties`:
```properties
jwt.expiration=7200000  # 2 hours
```

---

## ✅ Validation Checklist

Before assuming there's a bug, verify:

- [ ] Backend is running (`./gradlew bootRun`)
- [ ] Frontend is running (`npm start`)
- [ ] You logged in successfully
- [ ] Token exists in localStorage
- [ ] Browser DevTools shows the actual error message
- [ ] User has correct role in MongoDB (ADMIN or STUDENT)
- [ ] MongoDB is running
- [ ] Network tab shows the exact request/response

---

## 📚 References

### Files Modified in This Session
- `/frontend/src/pages/Menu.js` - Enhanced error handling and logging

### Files Already Configured (No Changes Needed)
- `/backend/src/main/java/.../config/SecurityConfig.java`
- `/backend/src/main/java/.../filter/JwtFilter.java`
- `/backend/src/main/java/.../controller/MenuController.java`
- `/backend/src/main/java/.../model/Menu.java`
- `/backend/src/main/java/.../repository/MenuRepository.java`

---

## 🎓 How to Debug Further

### Enable Backend Logging
In `application.properties`:
```properties
logging.level.com.messhub.backend=DEBUG
logging.level.org.springframework.security=DEBUG
```

Then restart backend and check console for detailed logs.

### Check Token Contents
In browser Console:
```javascript
// Get token
const token = localStorage.getItem('token');
console.log('Token:', token);

// Decode token (base64 decode)
const parts = token.split('.');
const decoded = JSON.parse(atob(parts[1]));
console.log('Token Claims:', decoded);
// Look for 'sub' (subject = email) and other claims
```

### Monitor Network Requests
1. Open DevTools (F12)
2. Go to Network tab
3. Filter by XHR (XMLHttpRequest)
4. Perform action that makes API call
5. Click on the request
6. Check:
   - Headers → Authorization header format
   - Response → Actual error from server

---

## 🎯 Next Steps

If everything is working:
- ✅ Add more menu items
- ✅ Test with different user roles
- ✅ Style the Menu component as desired
- ✅ Add more features (edit, delete menus)

If still having issues:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Screenshot the error
4. Check Network tab for request/response details
5. Share the error details for further debugging

---

## 📞 Support

If you encounter issues:
1. Check this guide's "Troubleshooting" section
2. Look at browser console errors (F12 → Console)
3. Check Network tab to see actual API response
4. Verify backend is running and responsive
5. Check MongoDB contains users with correct roles

Good luck! 🚀
