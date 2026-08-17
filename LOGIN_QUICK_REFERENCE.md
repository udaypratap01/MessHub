# 🔑 LOGIN SYSTEM - QUICK REFERENCE

## ⚡ 60-Second Setup

```bash
# Terminal 1: Backend
cd backend
mvn clean install
mvn spring-boot:run

# Terminal 2: Frontend
cd frontend
npm start

# Open: http://localhost:3000
```

---

## 📋 TEST CREDENTIALS

### Admin User
```
Email:    admin@gmail.com
Password: 123456
Role:     ADMIN
```

### Student User
```
Email:    student@gmail.com
Password: 123456
Role:     STUDENT
```

**Note:** Create these users via **Sign up** page if they don't exist

---

## 🔍 WHERE TO LOOK FOR LOGS

### Frontend Logs (Browser)
```
Press: F12 → Console tab

Look for:
🔐 LOGIN ATTEMPT
✅ SUCCESS RESPONSE
❌ ERROR RESPONSE
🎉 Login successful!
```

### Backend Logs (Terminal)
```
Look for:
🔐 LOGIN REQUEST RECEIVED
✓ Normalized email
🔍 Searching for user in database
❌ USER NOT FOUND (if error)
✓ User found
✓ Password correct
✅ LOGIN SUCCESSFUL
```

---

## ❌ COMMON ERRORS & FIXES

### Error: "User not found"
```
✓ Check: User exists in MongoDB
  db.users.find()

✓ Check: Email is lowercase
  admin@gmail.com ✅
  Admin@Gmail.com ❌

✓ Fix: Create user via signup
```

### Error: "Invalid password"
```
✓ Check: Password matches exactly
  Database:  123456
  Input:     123456

✓ Check: No spaces or typos

✓ Fix: Clear browser data and retry
  localStorage.clear()
```

### Error: "Network error"
```
✓ Check: Backend is running
  mvn spring-boot:run

✓ Check: URL is correct
  http://localhost:8080

✓ Check: No firewall blocking
```

### Error: "Token not found"
```
✓ Check: JWT secret configured
  application.properties has:
  jwt.secret=...

✓ Check: Token generation logs
  Backend shows: ✓ Token created
```

---

## ✅ VERIFICATION CHECKLIST

Before testing, verify:

- [ ] MongoDB is running
- [ ] Backend started: `mvn spring-boot:run`
- [ ] Frontend started: `npm start`
- [ ] At least one user exists in DB
- [ ] Browser on http://localhost:3000
- [ ] DevTools Console open (F12)
- [ ] Terminal showing backend logs

---

## 🎯 STEP-BY-STEP TEST

### Step 1: Open http://localhost:3000
You should see login page

### Step 2: Enter credentials
```
Email:    admin@gmail.com
Password: 123456
```

### Step 3: Click Login
Check both:
- Browser console (should show logs)
- Backend terminal (should show logs)

### Step 4: If successful
- Redirects to dashboard
- User name shows in top-right
- localStorage has token

### Step 5: If failed
- Error message displays
- Check console logs
- Check backend logs
- Follow fix guide

---

## 📞 DEBUGGING COMMANDS

### Clear localStorage
```javascript
// Browser console:
localStorage.clear()
location.reload()
```

### Check stored token
```javascript
// Browser console:
localStorage.getItem('token')
// Should return long string starting with "eyJ"
```

### Check stored user
```javascript
// Browser console:
JSON.parse(localStorage.getItem('user'))
// Should show: {id, name, email, role}
```

### View all users in DB
```javascript
// MongoDB console:
db.users.find()
// Shows all users in database
```

### Create test user
```javascript
// MongoDB console:
db.users.insertOne({
  name: "Test User",
  email: "test@gmail.com",
  password: "123456",
  role: "STUDENT"
})
```

---

## 🔐 SECURITY NOTES

### ⚠️ Important
- Passwords are stored **plain text** (for development only)
- In production, use bcrypt for password hashing
- JWT secret must be 32+ characters
- Keep JWT secret safe (use environment variables)

### Before Production
```java
// ❌ Don't do this in production
newUser.setPassword(password);  // Plain text!

// ✅ Do this in production
String hashedPassword = BCrypt.hashpw(password, BCrypt.gensalt());
newUser.setPassword(hashedPassword);
```

---

## 📱 BROWSER STORAGE

After successful login:

**localStorage:**
```javascript
{
  token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  user: "{\"id\":\"...\",\"name\":\"Admin\",\"email\":\"admin@gmail.com\",\"role\":\"ADMIN\"}"
}
```

**Verified in App.js:**
```javascript
const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user'));

if (token && user) {
  setIsAuthenticated(true);
  // Show dashboard
}
```

---

## 🚀 QUICK TROUBLESHOOT

| Issue | Check | Fix |
|-------|-------|-----|
| Login fails | User exists? | Create via signup |
| Wrong password | Password exact? | Check for typos/spaces |
| Network error | Backend running? | `mvn spring-boot:run` |
| Token null | JWT config ok? | Check application.properties |
| Page won't load | MongoDB running? | Start MongoDB |
| Logs empty | Console open? | Press F12 |

---

## 📊 API ENDPOINT

### Login Endpoint
```
POST http://localhost:8080/api/auth/login
Content-Type: application/json

Request:
{
  "email": "admin@gmail.com",
  "password": "123456"
}

Response (200 OK):
{
  "message": "Login successful",
  "token": "eyJ...",
  "user": {
    "id": "507f...",
    "name": "Admin",
    "email": "admin@gmail.com",
    "role": "ADMIN"
  }
}

Error (404):
{
  "message": "User not found. Please check your email."
}

Error (401):
{
  "message": "Invalid password. Please try again."
}
```

---

## 🎓 UNDERSTAND THE FLOW

```
1. Frontend: User enters email/password
2. Frontend: Click "Login" button
3. Frontend: POST to /api/auth/login
4. Backend: Receive request
5. Backend: Find user in MongoDB
6. Backend: Check password
7. Backend: Generate JWT token
8. Backend: Return token + user data
9. Frontend: Store token in localStorage
10. Frontend: Store user in localStorage
11. Frontend: Set isAuthenticated = true
12. Frontend: Redirect to dashboard
13. App.js: Check token exists
14. App.js: Show dashboard
15. User: Logged in! ✅
```

---

## 🔧 LATEST CHANGES

**What was improved:**

✅ Frontend: Enhanced error handling + console logs
✅ Backend: Step-by-step logging in AuthController
✅ JWT: Token generation logging in JwtUtil
✅ All files: 0 compilation errors

**Files modified:**
- `frontend/src/pages/Login.js`
- `backend/src/main/java/com/messhub/backend/controller/AuthController.java`
- `backend/src/main/java/com/messhub/backend/util/JwtUtil.java`

---

## 📚 DOCUMENTATION

For more details, see:
- `LOGIN_FIX_SUMMARY.md` - Full summary of changes
- `LOGIN_DEBUG_GUIDE.md` - Comprehensive debugging guide
- `README_FEEDBACK_SYSTEM.md` - Full system overview

---

**Last Updated:** April 17, 2026
**Status:** ✅ Ready to test
**Next Step:** Start backend and frontend, then try login
