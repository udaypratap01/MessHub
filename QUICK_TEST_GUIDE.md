# 🎯 QUICK START - DELETE ACCOUNT TESTING GUIDE

## 1️⃣ START SERVERS (2 terminals)

### Terminal 1: Backend
```bash
cd backend
./gradlew bootRun
```

Wait for:
```
Started BackendApplication in X seconds
Tomcat initialized with port 8080
```

### Terminal 2: Frontend
```bash
cd frontend
npm start
```

Wait for:
```
Compiled successfully!
You can now view the app in the browser at http://localhost:3000
```

---

## 2️⃣ LOGIN TO APP

1. Open `http://localhost:3000`
2. Click "Login"
3. Enter credentials:
   - Email: `student@example.com`
   - Password: `password123`
4. Click "Login"
5. Should see Dashboard

---

## 3️⃣ NAVIGATE TO SETTINGS

Option A: Click profile icon (top right) → Settings
Option B: Go to `http://localhost:3000/settings`

You should see:
```
⚙️ Account Settings
  ↓
Profile Information Card (blue)
  ↓
Change Password Card (blue)
  ↓
🔥 Danger Zone (RED CARD) ← This is important!
  ↓
🗑️ Delete Account (RED BUTTON)
```

---

## 4️⃣ OPEN BROWSER CONSOLE

Press `F12` on keyboard
→ Click "Console" tab
→ Clear any previous logs

---

## 5️⃣ TEST DELETE ACCOUNT

### Click Delete Button
```
1. Scroll down to "🔥 Danger Zone" section
2. Click "🗑️ Delete Account" button (red)
```

### Expected: Modal Appears
```
⚠️ Delete Account?
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
WARNING: This is permanent and irreversible

  🗑️ Permanently delete your account
  🗑️ Remove all personal data
  🗑️ Cancel pending orders
  🗑️ Delete order history
  🗑️ Cannot be recovered

[Cancel] [Yes, Delete Account]
```

### Test Modal Buttons (Optional)
- Click ✕ button → Modal closes
- Click "Cancel" → Modal closes
- Click outside modal → Modal closes

### Confirm Deletion
```
1. Click "Yes, Delete Account"
```

### Expected: Console Logs Appear
```
🗑️ Starting account deletion process...
📝 Token: eyJhbGc...
✅ Delete request successful: {message: "Account deleted successfully", deletedEmail: "student@example.com"}
📊 Response status: 200
✅ localStorage cleared
✅ Auth state updated
🔄 Redirecting to home page...
```

### Expected: After 2 Seconds
```
- Page redirects to home page (/)
- No longer logged in
- Try to access /settings → Redirected to login
```

---

## ✅ VERIFICATION CHECKLIST

### Console Logs
- [ ] See "🗑️ Starting account deletion process..."
- [ ] See "✅ Delete request successful..."
- [ ] See response status 200
- [ ] See "✅ localStorage cleared"
- [ ] See "✅ Auth state updated"
- [ ] See "🔄 Redirecting to home page..."

### Frontend Behavior
- [ ] Modal appears with all 5 warnings
- [ ] Can close modal with ✕ or Cancel
- [ ] After confirmation, success message shows
- [ ] After 2 seconds, redirects to home

### User State
- [ ] User is logged out after deletion
- [ ] Cannot access /settings without login
- [ ] Cannot login again with deleted account

---

## 🔍 IF SOMETHING GOES WRONG

### Problem: "Failed to delete account" (Generic Error)

**Check 1: Is Backend Running?**
```bash
# In another terminal
curl http://localhost:8080/api/menu
# Should see: 200 OK
```

**Check 2: Console Logs**
- Open F12 → Console tab
- Should see detailed error logs
- Look for error status code (401, 404, 500, etc.)

**Check 3: Network Tab**
- F12 → Network tab
- Click Delete Account
- Look for DELETE request to /api/users/delete
- Check response status and body

**Check 4: Backend Logs**
- Check backend terminal for errors
- Should show "DELETE /api/users/delete" message
- Should show success or error details

### Problem: 401 Unauthorized

**Cause:** JWT token invalid or expired
**Solution:**
1. Logout
2. Clear localStorage (F12 → Application → localStorage → Clear All)
3. Login again
4. Try delete again

### Problem: 404 Not Found

**Cause:** DELETE endpoint doesn't exist (backend not built)
**Solution:**
```bash
cd backend
./gradlew clean build -x test
./gradlew bootRun
```

### Problem: 500 Server Error

**Cause:** Backend error during deletion
**Solution:**
1. Check backend console for error message
2. Check MongoDB is running
3. Restart backend server

### Problem: Cannot Connect to Server

**Cause:** Backend not running or on wrong port
**Solution:**
```bash
# Kill any existing processes on port 8080
# Start backend again
./gradlew bootRun
```

---

## 🎯 SUCCESS CRITERIA

✅ Delete feature works if:
1. Modal appears when clicking delete button
2. Delete request shown in Network tab (status 200)
3. Console shows "✅ Delete request successful"
4. User redirected to home after 2 seconds
5. User cannot login again with deleted email
6. Deleted user not in database

---

## 📊 WHAT ACTUALLY HAPPENS

```
User in Settings Page
       ↓
Clicks "🗑️ Delete Account"
       ↓
Modal with 5 warnings appears
       ↓
User clicks "Yes, Delete Account"
       ↓
Frontend gets JWT token from localStorage
       ↓
Frontend sends: DELETE /api/users/delete
               with header: Authorization: Bearer {token}
       ↓
Backend receives request
       ↓
Backend validates JWT token
       ↓
Backend extracts email from token
       ↓
Backend finds user in MongoDB by email
       ↓
Backend deletes user from MongoDB
       ↓
Backend returns: 200 OK + success message
       ↓
Frontend receives success
       ↓
Frontend clears localStorage
       ↓
Frontend updates auth state
       ↓
Frontend shows success message
       ↓
After 2 seconds: Frontend redirects to home
       ↓
User is now logged out
       ↓
Deleted user cannot login again
```

---

## 🚀 YOU'RE READY!

All systems are configured and ready to test. Follow the 5 steps above to test the complete Delete Account feature.

If everything works as described, the feature is **production-ready**! ✅

---

**Quick Links:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api
- Settings Page: http://localhost:3000/settings
- DevTools: F12 (Console & Network tabs)

