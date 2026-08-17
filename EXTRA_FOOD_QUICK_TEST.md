# 🚀 Extra Food - Quick Start Testing Guide

## ⚡ START APPLICATION

### Terminal 1: Backend
```powershell
cd "d:\Coding\project\mess project\backend"
.\gradlew bootRun
```

**Expected Output:**
```
🔐 Configuring Security Chain
   ✓ CORS enabled for http://localhost:3000
   ✓ JWT authentication configured
   ✓ CSRF disabled (stateless API)
✅ Security Chain Configured Successfully
```

### Terminal 2: Frontend
```powershell
cd "d:\Coding\project\mess project\frontend"
npm start
```

**Expected Output:**
```
Compiled successfully!
On Your Network: http://localhost:3000
```

---

## 🔐 LOGIN

1. Open http://localhost:3000
2. Enter email: `student@test.com` (or `admin@test.com`)
3. Enter password: `password123`
4. Click "Login"
5. Should redirect to /dashboard

**Verify:** Check localStorage
```javascript
// In browser console:
localStorage.getItem('token')  // Should show JWT token
localStorage.getItem('user')   // Should show user object
```

---

## 🍕 TEST EXTRA FOOD PAGE

### Step 1: Navigate to Extra Food
1. From Dashboard, click "Extra Food" in menu
2. URL should be: `http://localhost:3000/extra-food`

### Step 2: Verify Foods Load
**Expected:**
- Food list appears (if items exist in database)
- Console shows: `✅ Foods loaded: [...]`
- No red error message

**Browser Console Check:**
```javascript
// Open DevTools (F12) → Console tab
// Should see these logs:
📦 Fetching extra food items...
✅ Foods loaded: [Array(n)]
```

### Step 3: If No Foods Appear
**Check:** Are foods in database?

**Backend Console:**
- Logs should show API request received
- No 401 or 403 errors

**Frontend Console:**
- Check for error message
- Should show detailed error if any

---

## 👨‍💼 ADMIN: ADD NEW FOOD ITEM

### Prerequisites
- Logged in as ADMIN user
- On Extra Food page

### Steps
1. Fill form:
   - **Food Name:** "Samosa"
   - **Price:** "15"
   - **Quantity:** "50"

2. Click "Add Food"

3. **Expected:**
   - Success message: "Food added successfully!"
   - New item appears in list
   - Form clears
   - Console shows: `✅ Food added: {...}`

### Troubleshooting
- **Error: "You don't have permission"** → User is not ADMIN
- **Error: "Price must be > 0"** → Enter valid price
- **Error: "Name required"** → Fill in all fields

---

## 👨‍🎓 STUDENT: BOOK FOOD ITEM

### Prerequisites
- Logged in as STUDENT user
- On Extra Food page
- Foods are displayed

### Steps
1. Find a food item in the list
2. Enter quantity: "2"
3. Click "Book Food"

4. **Expected:**
   - Success message appears
   - Quantity field clears
   - Order is created
   - Console shows: `✅ Order created: {...}`

### Verify Order
1. Navigate to "Dashboard"
2. Check "Recent Orders" section
3. Should show the booked food item

---

## 🔍 DEBUGGING

### Check Token in LocalStorage
```javascript
// In browser console:
const token = localStorage.getItem('token');
console.log('Token:', token);

// Decode token at: https://jwt.io/
// Paste token and verify expiry
```

### Check API Response
```javascript
// In browser console, Network tab:
1. Go to Network tab (F12)
2. Filter: "extra-food"
3. Click on the request
4. Check Response tab for data
5. Check Headers for Authorization
```

### View Backend Logs
```powershell
# In backend terminal, should see:
📦 Fetching extra food items...
✅ Foods loaded: [...]
```

### Check SecurityConfig
```powershell
# In backend terminal startup:
✓ CORS enabled for http://localhost:3000
✓ JWT authentication configured
```

---

## ⚠️ COMMON ISSUES

### "Failed to load food"
**Check:**
1. Is backend running? (http://localhost:8080 should respond)
2. Is token valid? (Check localStorage)
3. Is user logged in? (Navigate to /dashboard first)
4. Check console for detailed error (401, 403, etc.)

**Fix:**
```powershell
# Restart backend:
cd backend
.\gradlew bootRun

# Clear browser cache and login again
# Or use private/incognito window
```

### "You don't have permission"
**This means:** 403 Forbidden - User role not authorized

**Fix:**
1. Check user role in MongoDB:
   ```javascript
   // Backend code to check:
   // User.role should be "ADMIN" or "STUDENT"
   ```
2. Verify SecurityConfig has the role in authorization rule
3. Check role case sensitivity (must be uppercase)

### "Session expired. Please login again"
**This means:** 401 Unauthorized - Token invalid or expired

**Fix:**
1. Log out
2. Log in again
3. Check token expiry in jwt.io

### API not responding
**Check:** Is backend running?
```powershell
# In PowerShell, test connection:
curl http://localhost:8080/api/menu
# Should return data (if menu items exist)
```

---

## ✅ SUCCESS VERIFICATION CHECKLIST

### Backend Ready ✓
- [ ] Terminal shows: "BUILD SUCCESSFUL"
- [ ] Terminal shows: "✅ Security Chain Configured Successfully"
- [ ] No compilation errors
- [ ] Port 8080 is listening

### Frontend Ready ✓
- [ ] Terminal shows: "Compiled successfully!"
- [ ] Browser shows: http://localhost:3000
- [ ] No build errors or warnings

### Login Successful ✓
- [ ] Redirected to /dashboard
- [ ] localStorage has 'token' and 'user'
- [ ] Menu shows user's name

### Extra Food Works ✓
- [ ] Page loads without error
- [ ] Food items display (if they exist)
- [ ] Console shows: "✅ Foods loaded"
- [ ] No red error messages

### Admin Can Add Food ✓
- [ ] Form appears at top of page
- [ ] Can fill in name, price, quantity
- [ ] "Add Food" button works
- [ ] New item appears in list
- [ ] Success message appears

### Student Can Book Food ✓
- [ ] Can select quantity from dropdown
- [ ] "Book Food" button exists
- [ ] Can click to place order
- [ ] Success message appears
- [ ] Order appears in Dashboard

---

## 🔗 USEFUL LINKS

**MongoDB:**
- Check collections: `db.extraFood.find()`
- View food items: `db.extraFood.find().pretty()`

**Backend Endpoints:**
- API Base: `http://localhost:8080`
- Extra Food: `http://localhost:8080/api/extra-food`
- Menu: `http://localhost:8080/api/menu`

**Frontend Pages:**
- Home: `http://localhost:3000/`
- Dashboard: `http://localhost:3000/dashboard`
- Extra Food: `http://localhost:3000/extra-food`
- Menu: `http://localhost:3000/menu`

**Documentation:**
- Extra Food Fix Guide: `EXTRA_FOOD_FIX_GUIDE.md`
- API Documentation: `EXTRA_FOOD_API_DOCS.md`
- System Guide: `COMPLETE_SYSTEM_GUIDE.md`

---

## 📋 TEST SCENARIOS

### Scenario 1: Fresh User
1. **Logout** from current session
2. **Register** new account with email: `newuser@test.com`
3. **Login** with new account
4. **Go to** Extra Food page
5. **Expected:** Foods load (if they exist in database)

### Scenario 2: Token Expiry
1. **Login** and note the time
2. Wait for token to expire (check expiry in jwt.io)
3. **Try to load** Extra Food page
4. **Expected:** Error "Session expired. Please login again."
5. **Refresh** page and login again

### Scenario 3: Multiple Foods
1. **Login as ADMIN**
2. **Add** 5 different food items
3. **Logout**
4. **Login as STUDENT**
5. **Go to** Extra Food page
6. **Expected:** All 5 items visible

### Scenario 4: Concurrent Users
1. Open two browser windows
2. **Login as ADMIN** in window 1
3. **Login as STUDENT** in window 2
4. **Admin adds** new food item
5. **Check** window 2 - does it show the new item? (Need refresh)

---

## 🎯 NEXT: DEPLOY

When everything works locally:

1. **Build frontend:** `npm run build`
2. **Deploy to server**
3. **Update API URL** in ExtraFood.js
4. **Test in production**

---

## 💡 TIPS

- Use **incognito/private window** to test multiple users
- Check **browser DevTools** (F12) → Network tab for API calls
- Check **browser console** (F12) → Console tab for errors
- Use **backend logs** to see what requests are received
- **Restart both** frontend and backend after code changes
- **Clear localStorage** to test login flow: `localStorage.clear()`

