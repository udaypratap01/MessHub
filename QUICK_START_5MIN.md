# 🚀 Quick Start - Get Menu API Working in 5 Minutes

## ⏱️ 5-Minute Setup

### Step 1: Start Backend (Terminal 1)
```bash
cd backend
./gradlew bootRun
```
⏳ Wait for: `Started BackendApplication in X.XXX seconds`

### Step 2: Start Frontend (Terminal 2)
```bash
cd frontend
npm start
```
⏳ Wait for: Browser opens at `http://localhost:3000`

### Step 3: Test Login
1. Browser shows Login page
2. Enter credentials:
   ```
   Email: admin@test.com
   Password: password123
   ```
3. Click Login button
4. Should redirect to Dashboard with welcome message

### Step 4: Go to Menu Page
1. On Dashboard, look for a Menu link or button
2. If not visible, you may need to add it (see section below)
3. Click Menu
4. Should see "No menus available yet" or list of menus

### Step 5: Add a Menu (If Admin)
1. Click "+ Add New Menu" button
2. Fill the form:
   ```
   Day: Monday
   Breakfast: Eggs and Toast
   Lunch: Rice and Curry
   Dinner: Pasta and Salad
   ```
3. Click "Save Menu"
4. Menu should appear in the list below

✅ **If all this works, you're done!**

---

## ❌ If Something Doesn't Work

### Problem: "Failed to load menus" Error

**Step 1: Open Browser DevTools**
- Press `F12`
- Go to **Console** tab

**Step 2: Look for Error Logs**
Find messages starting with:
- ⚠️ = Warning
- ❌ = Error
- 📊 = Debug info

**Step 3: Find Your Error Below**

| Console Shows | Solution |
|---|---|
| `⚠️ No token found in localStorage` | Login first |
| `Response Status: 401` | Token expired - logout & login again |
| `Response Status: 403` | User doesn't have permission (role issue) |
| `Response Status: 404` | Backend not running - restart it |
| `connect ECONNREFUSED` | Backend crashed - restart with `./gradlew bootRun` |

**Step 4: Check Network Tab**
1. Still in DevTools, click **Network** tab
2. Try to load menu again
3. Look for request to `http://localhost:8080/api/menu`
4. Click on it
5. Check:
   - **Status**: Should be 200 (success) or 401/403 (permission)
   - **Response**: Should show menu data (if 200)

### Problem: Backend Won't Start

**Check Port 8080 is Free**
```bash
# Windows PowerShell
netstat -ano | findstr :8080

# If something is using port 8080, stop it or use different port
```

**Or try with verbose logging**
```bash
./gradlew bootRun --info
```

### Problem: Frontend Won't Start

**Clear npm cache**
```bash
cd frontend
npm cache clean --force
rm -r node_modules package-lock.json
npm install
npm start
```

---

## 🔧 Adding Menu Link to Navigation

If the Menu page isn't linked from Dashboard:

### Edit `/frontend/src/pages/Dashboard.js`:

Find where you have other navigation, add:
```javascript
import { Link } from 'react-router-dom';

// Inside the return JSX, add a link:
<Link to="/menu" className="nav-link">
  📋 Menu Management
</Link>
```

### Edit `/frontend/src/App.js`:

Make sure you have:
```javascript
import Menu from './pages/Menu';

// Inside Routes:
<Route 
  path="/menu" 
  element={<ProtectedRoute><Menu user={user} /></ProtectedRoute>} 
/>
```

---

## ✅ Verification Checklist

Run through this after setup:

- [ ] Backend starts without errors (`Started BackendApplication...`)
- [ ] Frontend opens in browser at `http://localhost:3000`
- [ ] Login page displays with email and password inputs
- [ ] Can login with `admin@test.com` / `password123`
- [ ] Dashboard shows after successful login
- [ ] Can navigate to Menu page
- [ ] Menu page loads without "Failed to load menus" error
- [ ] Menu page shows "No menus available yet" or existing menus
- [ ] Admin user sees "+ Add New Menu" button
- [ ] Can fill menu form without validation errors
- [ ] Can save menu and it appears in the list
- [ ] Browser console shows ✅ logs (not ❌ logs)

If all checkmarks are ✓, your setup is **complete and working**!

---

## 📱 What Should Display

### Login Page
```
┌─────────────────────────────────┐
│                                 │
│   🔐 Login to MessHub          │
│                                 │
│   📧 Email: [_______________]   │
│                                 │
│   🔒 Password: [_____________]  │
│                                 │
│      [     Login Button     ]    │
│                                 │
└─────────────────────────────────┘
```

### Dashboard Page
```
┌─────────────────────────────────┐
│ ← Back to Home                  │
│                                 │
│    Welcome, Admin User!         │
│    Role: ADMIN                  │
│    Email: admin@test.com        │
│                                 │
│  [📋 Menu Management]           │
│  [📝 Other Features...]         │
│                                 │
│  [🚪 Logout]                    │
│                                 │
└─────────────────────────────────┘
```

### Menu Page
```
┌─────────────────────────────────┐
│ ← Back to Dashboard             │
│                                 │
│   📋 Menu Management            │
│   Logged in as: Admin User      │
│   (ADMIN)                       │
│                                 │
│  [+ Add New Menu]               │
│                                 │
│  ┌───────────────────────────┐  │
│  │ 📅 Monday                 │  │
│  │ 🌅 Breakfast: Eggs & Toast│  │
│  │ 🍽️  Lunch: Rice & Curry   │  │
│  │ 🌙 Dinner: Pasta & Salad  │  │
│  └───────────────────────────┘  │
│                                 │
│  [More menu cards...]           │
│                                 │
└─────────────────────────────────┘
```

---

## 🆘 Still Having Issues?

### Debug Checklist:

1. **Is backend running?**
   ```bash
   # Check terminal where you ran ./gradlew bootRun
   # Should show: "Started BackendApplication in X.XXX seconds"
   ```

2. **Is frontend running?**
   ```bash
   # Browser should be at http://localhost:3000
   # Check if terminal shows no errors
   ```

3. **Open DevTools (F12)**
   - Go to Console tab
   - Look for emoji-prefixed logs (❌, ✅, 📊, ⚠️)
   - Screenshot or note the error

4. **Check Network Tab**
   - Make an action that calls API (login, load menu, etc)
   - Look for requests to `localhost:8080`
   - Check the response status and body

5. **Check Backend Logs**
   - Look at terminal where you ran `./gradlew bootRun`
   - Any error messages there?

6. **Check MongoDB**
   ```bash
   mongo
   use messhub
   db.user.find().pretty()  # See all users
   db.menu.find().pretty()  # See all menus
   ```

### If Still Stuck:

1. Stop backend: Ctrl+C in terminal
2. Stop frontend: Ctrl+C in terminal
3. Wait 10 seconds
4. Start fresh:
   ```bash
   # Terminal 1
   cd backend
   ./gradlew clean bootRun
   
   # Terminal 2 (wait for backend to start)
   cd frontend
   npm start
   ```

---

## 🎓 Understanding the Error Messages

When something fails, you'll see detailed error logs. Here's what they mean:

### ⚠️ Warning Logs (Orange)
```
⚠️ No token found in localStorage
```
**Means:** You're not logged in. Go to login page first.

### ❌ Error Logs (Red)
```
❌ Error fetching menus: Error: Request failed with status code 401
```
**Means:** API returned 401 (unauthorized). Token is invalid or expired.

### 📊 Debug Logs (Blue)
```
📊 Response Status: 403
📊 Response Data: {...}
```
**Means:** Request was made, got a response, but showing details for debugging.

### ✅ Success Logs (Green)
```
✅ Menus fetched successfully: [{...}, {...}]
```
**Means:** API call worked perfectly!

---

## 💡 Pro Tips

### Tip 1: Check Token Format
In browser console, paste this:
```javascript
const token = localStorage.getItem('token');
console.log('Token exists:', !!token);
console.log('Token starts with "ey":', token?.startsWith('ey'));
```

### Tip 2: Manual API Test
```javascript
fetch('http://localhost:8080/api/menu', {
  headers: {
    'Authorization': 'Bearer ' + localStorage.getItem('token')
  }
})
.then(r => r.json())
.then(data => console.log('Menus:', data))
.catch(e => console.error('Error:', e))
```

### Tip 3: Check User Role
```javascript
const user = JSON.parse(localStorage.getItem('user'));
console.log('Your role:', user?.role);
// Should be "ADMIN" or "STUDENT"
```

### Tip 4: Enable Backend Debug Logging
Edit `backend/src/main/resources/application.properties`:
```properties
logging.level.com.messhub.backend=DEBUG
logging.level.org.springframework.security=DEBUG
```
Then restart backend to see detailed logs.

---

## 🎯 Common Mistakes (Don't Make These!)

| Mistake | Effect | Fix |
|---------|--------|-----|
| Don't start backend | "Connection refused" error | Start with `./gradlew bootRun` |
| Don't start frontend | Page won't load | Start with `npm start` |
| Don't login before accessing menu | "No token" error | Login first |
| Token expired (after 1 hour) | 401 Unauthorized | Logout and login again |
| User doesn't have role in MongoDB | 403 Forbidden | Add role to user in MongoDB |
| Backend on wrong port (not 8080) | 404 Not Found | Use default port 8080 |
| Frontend on wrong URL | CORS error | Use http://localhost:3000 |

---

## 📞 Quick Support Matrix

| What's Wrong | Where to Look | What to Check |
|---|---|---|
| Login fails | Browser console | Email/password correct? Backend running? |
| Menu loads but empty | MongoDB | Any menus in `db.menu.find()`? |
| Menu gives error | DevTools → Console | Error log prefix (⚠️, ❌, 📊)? |
| Only admin can add menus | SecurityConfig | ✓ (This is correct behavior!) |
| Students can't see menus | Backend logs | User has STUDENT role in DB? |
| CORS errors | Backend CORS config | CorsConfig has `localhost:3000`? |

---

## ✨ You're All Set!

Your Menu API system is now:
- ✅ Configured
- ✅ Running
- ✅ Tested
- ✅ Ready to use

**Next steps:**
1. Add more menus
2. Test with different user roles
3. Add edit/delete functionality
4. Style it however you like
5. Deploy to production

**Happy coding!** 🚀
