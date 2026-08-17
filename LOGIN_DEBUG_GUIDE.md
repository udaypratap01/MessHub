# 🔐 LOGIN SYSTEM - DEBUG & FIX GUIDE

## ✅ WHAT WAS FIXED

### 1. Frontend (Login.js) - Enhanced Error Handling
```javascript
✅ Added detailed console logging
✅ Better error message display
✅ Network error detection
✅ Proper HTTP status code handling
```

### 2. Backend (AuthController.java) - Complete Logging
```java
✅ Added step-by-step logs
✅ Shows which step fails
✅ Lists all users in database
✅ Shows password comparison
✅ Confirms token generation
```

### 3. JWT (JwtUtil.java) - Token Generation Logging
```java
✅ Logs token creation process
✅ Shows secret key validation
✅ Confirms token signing
✅ Catches generation errors
```

---

## 🔍 HOW TO DEBUG

### Step 1: Check Frontend Console (Browser)
Open browser DevTools (F12) and go to **Console** tab:

```
Look for these logs:
🔐 LOGIN ATTEMPT - Email: xxx Password: xxx
✅ SUCCESS RESPONSE: {...}
🔑 Token received: eyJhbGc...
👤 User data: {id, name, email, role}
🎉 Login successful!
```

**If you see errors instead:**
```
❌ ERROR OBJECT: ...
❌ ERROR RESPONSE: ...
❌ ERROR MESSAGE: ...
🔴 Final error message: "..."
```

### Step 2: Check Backend Logs (Terminal)
When you run the backend, look for:

```
🔐 LOGIN REQUEST RECEIVED
   Email from request: admin@gmail.com
   Password from request: ***
✓ Normalized email: admin@gmail.com
🔍 Searching for user in database...
   ✓ Found matching user: admin@gmail.com
✓ User found: Admin Name
🔑 Checking password...
   Stored password: 123456
   Input password: 123456
✓ Password correct!
🎯 Generating JWT token...
   📝 Building token for: admin@gmail.com (role: ADMIN)
     🔐 Secret key length: XX
     ⏰ Expiration (ms): 3600000
     ✓ Token signed successfully
   ✓ Token created successfully (length: XXX)
✅ LOGIN SUCCESSFUL for user: admin@gmail.com
================================================
```

---

## ❌ COMMON ISSUES & FIXES

### Issue 1: "User not found"
**Cause:** User doesn't exist in MongoDB

**Fix:**
1. Create a test user via signup page
2. OR manually insert user in MongoDB:
   ```javascript
   db.users.insertOne({
     name: "Admin",
     email: "admin@gmail.com",
     password: "123456",
     role: "ADMIN"
   })
   ```

**Verify in logs:**
```
❌ USER NOT FOUND: admin@gmail.com
   Available users in DB:
     - test@gmail.com (role: STUDENT)
```

---

### Issue 2: "Invalid password"
**Cause:** Password doesn't match

**Fix:**
1. Check if password is stored correctly
2. Verify password field isn't null
3. Don't forget `.trim()` on inputs

**Verify in logs:**
```
🔑 Checking password...
   Stored password: 123456
   Input password: 12345
❌ PASSWORD MISMATCH
```

---

### Issue 3: "Network error"
**Cause:** Backend not running or wrong URL

**Fix:**
1. Start backend: `mvn spring-boot:run`
2. Check URL: `http://localhost:8080/api/auth/login`
3. Check CORS is enabled

**Verify in logs:**
```
❌ ERROR MESSAGE: Network Error
   The server is not running or CORS issue
```

---

### Issue 4: "Token not found in response"
**Cause:** JwtUtil failed to generate token

**Fix:**
1. Check JWT secret in application.properties
2. Verify JwtUtil is autowired
3. Check secret key length (min 32 chars)

**Backend logs:**
```
❌ Token generation failed: ...
```

---

## 🧪 TESTING STEPS

### Manual Test (Recommended)

**1. Clear browser data:**
```javascript
// In browser console:
localStorage.clear()
```

**2. Start backend:**
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

**3. Start frontend:**
```bash
cd frontend
npm start
```

**4. Go to http://localhost:3000**

**5. Create test user (if needed):**
- Click "Sign up here"
- Name: "Test User"
- Email: "test@gmail.com"
- Password: "123456"
- Role: "STUDENT"
- Click Signup

**6. Try login:**
- Email: "test@gmail.com"
- Password: "123456"
- Click Login

**7. Check logs:**
- Frontend console (F12)
- Backend terminal

---

## 📊 REQUEST/RESPONSE FORMAT

### Correct Login Request
```json
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "admin@gmail.com",
  "password": "123456"
}
```

### Correct Login Response (200 OK)
```json
{
  "message": "Login successful",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "507f1f77bcf86cd799439011",
    "name": "Admin",
    "email": "admin@gmail.com",
    "role": "ADMIN"
  }
}
```

### Error Response (404 Not Found)
```json
{
  "message": "User not found. Please check your email."
}
```

### Error Response (401 Unauthorized)
```json
{
  "message": "Invalid password. Please try again."
}
```

---

## 🔑 KEY FILES MODIFIED

### 1. Frontend: `frontend/src/pages/Login.js`
**Changes:**
- ✅ Added detailed console.log statements
- ✅ Better error message extraction
- ✅ Network error detection
- ✅ HTTP status code handling

**New Logs:**
```javascript
console.log("🔐 LOGIN ATTEMPT - Email:", email, "Password:", password);
console.log("✅ SUCCESS RESPONSE:", response.data);
console.log("🔑 Token received:", token.substring(0, 20) + "...");
console.log("❌ ERROR OBJECT:", err);
console.log("❌ ERROR RESPONSE:", err.response?.data);
```

### 2. Backend: `backend/src/main/java/com/messhub/backend/controller/AuthController.java`
**Changes:**
- ✅ Step-by-step logging
- ✅ Shows email normalization
- ✅ Lists all users in DB
- ✅ Shows password comparison
- ✅ Confirms token generation

**New Logs:**
```java
System.out.println("🔐 LOGIN REQUEST RECEIVED");
System.out.println("   Email from request: " + email);
System.out.println("✓ Normalized email: " + normalizedEmail);
System.out.println("🔍 Searching for user in database...");
System.out.println("❌ USER NOT FOUND: " + normalizedEmail);
System.out.println("❌ PASSWORD MISMATCH");
System.out.println("✅ LOGIN SUCCESSFUL for user: " + user.getEmail());
```

### 3. JWT: `backend/src/main/java/com/messhub/backend/util/JwtUtil.java`
**Changes:**
- ✅ Token generation logging
- ✅ Error handling with stack trace
- ✅ Confirms token signing

**New Logs:**
```java
System.out.println("   📝 Building token for: " + email);
System.out.println("     🔐 Secret key length: " + jwtSecret.length());
System.out.println("   ✓ Token created successfully");
System.out.println("   ❌ Token generation failed: " + e.getMessage());
```

---

## ✅ VERIFICATION CHECKLIST

- [ ] Backend is running on http://localhost:8080
- [ ] Frontend is running on http://localhost:3000
- [ ] MongoDB is connected
- [ ] At least one user exists in database
- [ ] Email in database is lowercase
- [ ] Password in database matches input
- [ ] JWT secret is configured (min 32 chars)
- [ ] Console logs show all steps
- [ ] No "Network Error" message
- [ ] No "Token not found" error
- [ ] Token is stored in localStorage
- [ ] User data is stored in localStorage
- [ ] Dashboard page loads after login

---

## 🎯 QUICK FIX CHECKLIST

If login is failing, check in this order:

1. **Backend running?**
   ```bash
   # Terminal shows "Tomcat started on port 8080"
   ```

2. **User exists in DB?**
   ```javascript
   // MongoDB console:
   db.users.find()
   ```

3. **Email format correct?**
   ```javascript
   // Should be lowercase
   admin@gmail.com  ✅
   Admin@Gmail.com  ❌
   ```

4. **Password matches exactly?**
   ```javascript
   // Database:    password: "123456"
   // Input:       123456
   // They must match exactly (case-sensitive)
   ```

5. **Logs show token generation?**
   ```
   ✓ Token created successfully
   ✅ LOGIN SUCCESSFUL
   ```

6. **Token in localStorage?**
   ```javascript
   // Browser console:
   localStorage.getItem('token')  // Should show long string starting with "eyJ"
   ```

---

## 📝 EXAMPLE TEST SCENARIO

### Scenario: Test with admin user

**Database setup:**
```javascript
db.users.insertOne({
  _id: ObjectId(),
  name: "Admin User",
  email: "admin@gmail.com",
  password: "123456",
  role: "ADMIN"
})
```

**Frontend input:**
- Email: `admin@gmail.com`
- Password: `123456`

**Expected Frontend Logs:**
```
🔐 LOGIN ATTEMPT - Email: admin@gmail.com Password: 123456
✅ SUCCESS RESPONSE: {message: "Login successful", token: "eyJ...", user: {...}}
🔑 Token received: eyJhbGciOiJIUzI1NiIs...
👤 User data: {id: "...", name: "Admin User", email: "admin@gmail.com", role: "ADMIN"}
🎉 Login successful!
```

**Expected Backend Logs:**
```
🔐 LOGIN REQUEST RECEIVED
   Email from request: admin@gmail.com
   Password from request: ***
✓ Normalized email: admin@gmail.com
🔍 Searching for user in database...
   ✓ Found matching user: admin@gmail.com
✓ User found: Admin User
🔑 Checking password...
   Stored password: 123456
   Input password: 123456
✓ Password correct!
🎯 Generating JWT token...
   📝 Building token for: admin@gmail.com (role: ADMIN)
     🔐 Secret key length: XX
     ⏰ Expiration (ms): 3600000
     ✓ Token signed successfully
   ✓ Token created successfully (length: XXX)
✅ LOGIN SUCCESSFUL for user: admin@gmail.com
================================================
```

**Expected localStorage:**
```javascript
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": "{\"id\":\"...\",\"name\":\"Admin User\",\"email\":\"admin@gmail.com\",\"role\":\"ADMIN\"}"
}
```

**Dashboard should load successfully** ✅

---

## 💡 TROUBLESHOOTING TIPS

### Tip 1: Use Postman/Thunder Client to test API directly
```
POST http://localhost:8080/api/auth/login
Headers: Content-Type: application/json

Body:
{
  "email": "admin@gmail.com",
  "password": "123456"
}
```

### Tip 2: Clear localStorage between tests
```javascript
// Browser console:
localStorage.clear()
location.reload()
```

### Tip 3: Check MongoDB connection
```bash
# MongoDB console:
mongosh
use messhub
db.users.find()
```

### Tip 4: Verify JWT secret in properties
```properties
# application.properties:
jwt.secret=your-secret-key-change-this-in-production-min-32-chars
jwt.expiration=3600000
```

### Tip 5: Check CORS configuration
```java
// SecurityConfig.java should have:
.cors(cors -> cors.configurationSource(...))
```

---

## 🚀 FINAL VERIFICATION

When everything is working, you should see:

✅ Login form accepts credentials
✅ No error message
✅ Redirects to dashboard
✅ User info shows in top-right
✅ localStorage has token
✅ All console logs show success

**If you're still having issues:**

1. Share the **backend logs** (entire output)
2. Share the **frontend console logs** (entire output)
3. Check **MongoDB** has at least one user
4. Verify **email format** (lowercase, no spaces)
5. Verify **password** matches exactly

---

**Status:** 🚀 **LOGIN SYSTEM ENHANCED WITH DETAILED LOGGING**

Last Updated: April 17, 2026
