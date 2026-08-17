# 🗑️ DELETE ACCOUNT - IMPLEMENTATION GUIDE

Complete step-by-step guide for implementing delete account feature.

---

## 📋 Table of Contents

1. [What's Being Implemented](#whats-being-implemented)
2. [Files to Modify](#files-to-modify)
3. [Step-by-Step Guide](#step-by-step-guide)
4. [Security Details](#security-details)
5. [Testing Procedures](#testing-procedures)
6. [Troubleshooting](#troubleshooting)

---

## 🎯 What's Being Implemented

**Feature Name:** Account Deletion (Self-Service)

**Purpose:** Allow logged-in users to permanently delete their own accounts

**Security:** JWT authentication required, users can only delete themselves

**User Impact:** Red "Delete Account" button on dashboard

---

## 📂 Files to Modify

### Backend Files (1 file)
1. **AuthController.java**
   - Location: `backend/src/main/java/com/messhub/backend/controller/AuthController.java`
   - Change Type: Add new method
   - Lines to add: 45 lines
   - Method: `deleteAccount(String authHeader)`
   - Endpoint: `DELETE /api/auth/me`

### Frontend Files (2 files)
1. **Dashboard.js**
   - Location: `frontend/src/pages/Dashboard.js`
   - Changes: Add import, add function, update JSX
   - Lines to add: 68 lines

2. **Dashboard.css**
   - Location: `frontend/src/styles/Dashboard.css`
   - Changes: Add button styles and mobile responsive
   - Lines to add: 25 lines

**Note:** No changes needed to SecurityConfig.java (uses existing patterns)

---

## 🛠️ Step-by-Step Guide

### PART 1: Backend Implementation

#### Step 1.1: Open AuthController.java

```
File: backend/src/main/java/com/messhub/backend/controller/AuthController.java
Look for: The closing brace } of the register() method
```

#### Step 1.2: Add Delete Account Method

Paste this code at the end of AuthController class (before final closing brace):

```java
// 🗑️ DELETE ACCOUNT - AUTHENTICATION REQUIRED
@DeleteMapping("/me")
public ResponseEntity<?> deleteAccount(@RequestHeader(value = "Authorization", required = false) String authHeader) {

    // ✅ Step 1: Validate Authorization header
    if (authHeader == null || authHeader.trim().isEmpty()) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Authorization header is missing"));
    }

    // ✅ Step 2: Extract token from "Bearer <token>"
    String token = null;
    if (authHeader.startsWith("Bearer ")) {
        token = authHeader.substring(7);
    } else {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Invalid authorization header format"));
    }

    // ✅ Step 3: Validate token
    if (!jwtUtil.validateToken(token)) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Invalid or expired token"));
    }

    // ✅ Step 4: Extract email from token
    String email = jwtUtil.extractUsername(token);
    if (email == null || email.trim().isEmpty()) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Could not extract email from token"));
    }

    // ✅ Step 5: Find user by email
    User user = userRepository.findByEmailIgnoreCase(email).orElse(null);
    if (user == null) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "User not found"));
    }

    // ✅ Step 6: Delete user from database
    String userId = user.getId();
    if (userId != null && !userId.trim().isEmpty()) {
        userRepository.deleteById(userId);
    } else {
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("message", "Error: User ID is invalid"));
    }

    System.out.println("✅ Account deleted: " + email);

    // ✅ Step 7: Return success response
    return ResponseEntity.ok(Map.of("message", "Account deleted successfully"));
}
```

#### Step 1.3: Verify Backend Compilation

Run this command:
```powershell
cd backend
./gradlew clean build
```

**Expected Output:**
```
BUILD SUCCESSFUL
```

**If error:** Check that all parentheses and braces match

---

### PART 2: Frontend Implementation

#### Step 2.1: Update Dashboard.js - Add Import

Open `frontend/src/pages/Dashboard.js`

Find this line:
```javascript
import { useNavigate } from 'react-router-dom';
```

Change to:
```javascript
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
```

#### Step 2.2: Add Delete Account Function

Find this code block:
```javascript
const handleLogout = () => {
  // Remove token from localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // ... rest of function
};
```

After the closing brace of `handleLogout`, add:

```javascript
// 🗑️ DELETE ACCOUNT FUNCTION
const handleDeleteAccount = async () => {
  // Step 1: Show confirmation
  const confirmed = window.confirm(
    'Are you sure you want to delete your account? This action cannot be undone.'
  );

  if (!confirmed) {
    return; // User cancelled
  }

  try {
    // Step 2: Get token from localStorage
    const token = localStorage.getItem('token');

    if (!token) {
      alert('Error: No authentication token found. Please login again.');
      navigate('/');
      return;
    }

    // Step 3: Call delete API
    const response = await axios.delete(
      'http://localhost:8080/api/auth/me',
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );

    // Step 4: Show success message
    alert('Your account has been deleted successfully.');

    // Step 5: Clear localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');

    // Step 6: Update state
    setIsAuthenticated(false);
    setUser(null);

    // Step 7: Redirect to login
    navigate('/');

  } catch (error) {
    // Handle errors
    console.error('❌ Delete account error:', error);

    if (error.response?.status === 401) {
      alert('Error: Unauthorized. Please login again.');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setIsAuthenticated(false);
      setUser(null);
      navigate('/');
    } else if (error.response?.status === 404) {
      alert('Error: User not found.');
    } else if (error.response?.data?.message) {
      alert(`Error: ${error.response.data.message}`);
    } else {
      alert('Error: Failed to delete account. Please try again.');
    }
  }
};
```

#### Step 2.3: Update Dashboard.js - Add Delete Button

Find this JSX:
```javascript
<nav className="navbar">
  <div className="navbar-content">
    <h2 className="navbar-brand">MessHub</h2>
    <button onClick={handleLogout} className="logout-button">
      Logout
    </button>
  </div>
</nav>
```

Change to:
```javascript
<nav className="navbar">
  <div className="navbar-content">
    <h2 className="navbar-brand">MessHub</h2>
    <div className="navbar-buttons">
      <button onClick={handleDeleteAccount} className="delete-button" title="Delete your account">
        Delete Account
      </button>
      <button onClick={handleLogout} className="logout-button">
        Logout
      </button>
    </div>
  </div>
</nav>
```

**Verify:** Dashboard.js should have no red squiggly lines

---

#### Step 2.4: Update Dashboard.css - Add Styles

Open `frontend/src/styles/Dashboard.css`

Find this section:
```css
.navbar-brand {
  font-size: 28px;
  font-weight: 700;
  color: white;
  margin: 0;
}

.logout-button {
```

Add between `navbar-brand` and `logout-button`:

```css
.navbar-buttons {
  display: flex;
  gap: 12px;
  align-items: center;
}

.delete-button {
  padding: 10px 24px;
  font-size: 14px;
  font-weight: 600;
  color: white;
  background: #ff6b6b;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.delete-button:hover {
  background: #ff5252;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.3);
}

.delete-button:active {
  transform: translateY(0);
}
```

#### Step 2.5: Update Dashboard.css - Mobile Responsive

Find the `@media (max-width: 768px)` section

Add after `.navbar-content` rules:

```css
.navbar-buttons {
  width: 100%;
  flex-direction: column;
  gap: 8px;
}

.delete-button,
.logout-button {
  width: 100%;
}
```

---

### PART 3: Verification

#### Verify Backend
```powershell
# Terminal 1
cd backend
./gradlew bootRun

# Should see in logs:
# [main] o.s.b.w.embedded.tomcat.TomcatWebServer : Tomcat started on port(s): 8080
```

#### Verify Frontend
```powershell
# Terminal 2
cd frontend
npm start

# Should see in browser:
# http://localhost:3000 opens automatically
# Webpack compilation successful message
```

#### Verify Button Appears
1. Login at http://localhost:3000
2. Go to Dashboard
3. Look for red "Delete Account" button in top navbar
4. Should appear BEFORE "Logout" button

---

## 🔐 Security Details

### JWT Token Flow

```
1. User logs in
   ↓
2. Backend sends JWT token
   ↓
3. Frontend stores in localStorage
   ↓
4. User clicks Delete Account
   ↓
5. Frontend reads token from localStorage
   ↓
6. Frontend sends DELETE request with "Bearer TOKEN" header
   ↓
7. Backend extracts "Bearer " prefix
   ↓
8. Backend validates token signature
   ↓
9. Backend extracts email from token subject
   ↓
10. Backend finds user by email
    ↓
11. Backend deletes user
    ↓
12. Backend returns success
```

### Why This is Secure

✅ **No Passwords Sent:** Only JWT token in header  
✅ **Email from Token:** Can't be modified by frontend  
✅ **Token Signature:** Verified on backend  
✅ **User Isolation:** Users can only delete themselves  
✅ **Confirmation Dialog:** Prevents accidents  
✅ **HTTP DELETE:** RESTful standard  

---

## 🧪 Testing Procedures

### Test 1: Successful Deletion

**Setup:**
1. Create new test account (email: test-delete@example.com)
2. Login with test account
3. Go to Dashboard

**Test:**
1. Click "Delete Account" button
2. See confirmation dialog: "Are you sure you want to delete your account? This action cannot be undone."
3. Click "OK"

**Expected Results:**
- ✅ Success alert: "Your account has been deleted successfully."
- ✅ Redirected to login page
- ✅ localStorage cleared (no token or user)
- ✅ User not in MongoDB anymore

**Verify in MongoDB:**
```bash
db.users.find({email: "test-delete@example.com"})
# Result: (empty - user deleted)
```

---

### Test 2: Cancel Deletion

**Setup:**
1. Login to Dashboard

**Test:**
1. Click "Delete Account" button
2. See confirmation dialog
3. Click "Cancel"

**Expected Results:**
- ✅ Confirmation dialog closes
- ✅ Stay on Dashboard
- ✅ Account still exists in database
- ✅ localStorage not cleared

---

### Test 3: Invalid Token

**Setup:**
1. Login to Dashboard
2. Open DevTools (F12)
3. In Console, manually modify token:
   ```javascript
   localStorage.setItem('token', 'invalid.token.value');
   ```

**Test:**
1. Click "Delete Account"
2. Click "OK" on confirmation

**Expected Results:**
- ✅ Error alert: "Unauthorized. Please login again."
- ✅ Redirected to login
- ✅ Account NOT deleted

---

### Test 4: Token Expired

**Setup:**
1. Wait for JWT token to expire (default: 1 hour)
   - OR manually modify expiration in console
2. Click "Delete Account"

**Expected Results:**
- ✅ Error: "Invalid or expired token"
- ✅ Redirected to login

---

### Test 5: User Not Found

**Setup:**
1. This happens if user is deleted outside the app
2. Not easily reproducible in normal flow

**Expected Results:**
- ✅ Error: "User not found"

---

## 🐛 Troubleshooting

### Issue 1: Delete button not showing

**Symptom:** No red "Delete Account" button on dashboard

**Causes:**
- Dashboard.js not updated
- Dashboard.css not reloaded
- Browser cache

**Solution:**
- [ ] Verify Dashboard.js changes (look for `handleDeleteAccount`)
- [ ] Verify Dashboard.css has `.delete-button` styles
- [ ] Clear browser cache (Ctrl+Shift+Delete)
- [ ] Hard refresh page (Ctrl+Shift+R)
- [ ] Restart npm server

---

### Issue 2: Delete button doesn't work

**Symptom:** Click button, nothing happens

**Causes:**
- Backend not running
- Network error
- Authorization header wrong

**Solution:**
- [ ] Verify backend running: `http://localhost:8080/api/auth/login` works
- [ ] Open DevTools (F12) → Network tab
- [ ] Click Delete Account
- [ ] Check if DELETE request appears
- [ ] Check Status (should attempt request)
- [ ] Check headers (should have Authorization)

---

### Issue 3: Error: "No authentication token found"

**Symptom:** Error after clicking delete, redirects to login

**Causes:**
- localStorage corrupted
- Browser cache issue
- Token was cleared

**Solution:**
- [ ] Clear localStorage: `localStorage.clear()`
- [ ] Login again
- [ ] Verify token in localStorage (F12 → Application)
- [ ] Retry delete

---

### Issue 4: Backend shows 401 Unauthorized

**Symptom:** Delete request fails with 401

**Causes:**
- Token format wrong
- Token invalid
- Authorization header missing

**Solution:**
- [ ] Check backend logs for exact error
- [ ] Verify Authorization header format: `Bearer TOKEN`
- [ ] Re-login to get fresh token
- [ ] Check JwtUtil.validateToken() works
- [ ] Check JwtUtil.extractUsername() returns email

---

### Issue 5: User deleted but error shown

**Symptom:** User deleted from DB but error message displayed

**Causes:**
- Response parsing error
- Frontend error handling issue

**Solution:**
- [ ] Check browser console for JavaScript errors
- [ ] Check network response in DevTools
- [ ] Check backend logs
- [ ] Clear console and retry

---

## 📊 What Gets Deleted

When user deletes account, these are removed:

### MongoDB Deletion
```javascript
// This document is DELETED:
{
  "_id": ObjectId("..."),
  "name": "John Doe",
  "email": "john@example.com",
  "password": "...",
  "role": "STUDENT"
}
```

### localStorage Cleanup
```javascript
// REMOVED from browser storage:
localStorage.token        // JWT token
localStorage.user         // User data object
```

### NOT Deleted (for future enhancement)
- User's menus (if stored separately)
- User's orders
- Activity logs
- Audit trails

**Note:** Current implementation only deletes user document. If you have related data in other collections, implement cascade delete or soft delete.

---

## ✅ Final Checklist

Before marking as complete:

- [ ] Backend compiles without errors
- [ ] Frontend runs without console errors
- [ ] Delete button appears on dashboard
- [ ] Delete button is red color
- [ ] Delete button is before logout button
- [ ] Click button shows confirmation dialog
- [ ] Cancel dialog closes without action
- [ ] OK on dialog calls backend API
- [ ] Success message shown
- [ ] User redirected to login
- [ ] User deleted from MongoDB
- [ ] localStorage cleared
- [ ] Cannot login with deleted email
- [ ] Mobile responsive (buttons stack on small screen)
- [ ] No red squiggly lines in code
- [ ] All tests pass

---

## 🚀 Deployment

When ready for production:

1. **Build Backend:**
   ```powershell
   cd backend
   ./gradlew clean build -DskipTests
   ```

2. **Deploy JAR:**
   ```powershell
   # Copy backend-0.0.1-SNAPSHOT.jar to production server
   java -jar backend-0.0.1-SNAPSHOT.jar
   ```

3. **Build Frontend:**
   ```powershell
   cd frontend
   npm run build
   ```

4. **Deploy to static hosting:**
   ```powershell
   # Upload build/ folder to web server
   ```

---

## 📚 Related Documentation

- `DELETE_ACCOUNT_QUICK_START.md` - 5-minute overview
- `DELETE_ACCOUNT_CODE_REFERENCE.md` - All code snippets
- `COMPLETE_SYSTEM_GUIDE.md` - Full system architecture
- `JWT_SECURITY.md` - Token details

---

**Status: Ready for Implementation** ✅

Follow the steps above to add delete account feature to your application!

