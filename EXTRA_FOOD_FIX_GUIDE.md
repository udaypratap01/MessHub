# 🍕 Extra Food Page - Fix Guide

## ✅ PROBLEM FIXED
The Extra Food page was showing "Failed to load food" error because:
1. **Backend SecurityConfig** didn't authorize GET requests to `/api/extra-food`
2. **Frontend** wasn't sending JWT token in the API request
3. **Error logging** was insufficient to diagnose the issue

---

## 🔧 BACKEND FIX

### File: `backend/src/main/java/com/messhub/backend/config/SecurityConfig.java`

**What was wrong:**
- The `/api/extra-food` GET endpoint had no security rule defined
- Students couldn't access the endpoint

**What was fixed:**
Added explicit security rules for all extra-food endpoints:

```java
// Extra Food endpoints
.requestMatchers(HttpMethod.GET, "/api/extra-food").hasAnyRole("ADMIN", "STUDENT")
.requestMatchers(HttpMethod.POST, "/api/extra-food").hasRole("ADMIN")
.requestMatchers(HttpMethod.PUT, "/api/extra-food/**").hasRole("ADMIN")
.requestMatchers(HttpMethod.DELETE, "/api/extra-food/**").hasRole("ADMIN")
```

**Authorization Rules:**
- ✅ **GET** `/api/extra-food` - ADMIN + STUDENT (can view food items)
- ✅ **POST** `/api/extra-food` - ADMIN only (can add new items)
- ✅ **PUT** `/api/extra-food/{id}` - ADMIN only (can update items)
- ✅ **DELETE** `/api/extra-food/{id}` - ADMIN only (can delete items)

---

## 🔧 FRONTEND FIX

### File: `frontend/src/pages/ExtraFood.js`

**What was wrong:**
```javascript
// ❌ BEFORE - No token, no error handling
useEffect(() => {
  const fetchFoods = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/extra-food");
      console.log("FOODS:", res.data);
      setFoods(res.data || []);
    } catch {
      setError("Failed to load food");
    }
  };
  fetchFoods();
}, []);
```

**Problems:**
1. ❌ No JWT token in Authorization header
2. ❌ Generic catch block with no error details
3. ❌ No distinction between 401, 403, and 500 errors

**What was fixed:**
```javascript
// ✅ AFTER - Token sent, detailed error logging
useEffect(() => {
  const fetchFoods = async () => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        setError("Not logged in. Please login first.");
        return;
      }

      console.log("📦 Fetching extra food items...");

      const res = await axios.get("http://localhost:8080/api/extra-food", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      console.log("✅ Foods loaded:", res.data);
      setFoods(res.data || []);
      setError("");

    } catch (err) {
      console.error("❌ Error fetching foods:", err);
      console.log("📡 Response Status:", err.response?.status);
      console.log("📦 Response Data:", err.response?.data);

      if (err.response?.status === 401) {
        setError("Session expired. Please login again.");
      } else if (err.response?.status === 403) {
        setError("You don't have permission to view food items.");
      } else {
        setError(err.response?.data?.message || "Failed to load food");
      }
    }
  };

  fetchFoods();
}, []);
```

**Improvements:**
1. ✅ Token retrieved from localStorage
2. ✅ Early return if token is missing
3. ✅ Authorization header with Bearer token
4. ✅ Detailed console logging for debugging
5. ✅ Specific error messages for 401, 403, and other errors
6. ✅ Clear error state on success

---

## 🔍 ERROR DIAGNOSIS

When the page fails to load food, check the browser console for these messages:

### 📡 Response Status: 401 (Unauthorized)
**Cause:** Token is invalid or missing
**Fix:** User needs to log in again

### 📡 Response Status: 403 (Forbidden)
**Cause:** User role doesn't have permission
**Fix:** Check SecurityConfig for proper role configuration

### 📡 Response Status: 500 (Server Error)
**Cause:** Backend error
**Fix:** Check backend logs for detailed error message

### ❌ Error fetching foods: Network Error
**Cause:** Backend is not running or URL is wrong
**Fix:** Ensure backend is running on `http://localhost:8080`

---

## ✅ VERIFICATION CHECKLIST

**Backend:**
- ✅ SecurityConfig has `/api/extra-food` GET rule with `hasAnyRole("ADMIN", "STUDENT")`
- ✅ ExtraFoodController has `@GetMapping` method
- ✅ Backend compiles without errors

**Frontend:**
- ✅ ExtraFood.js retrieves token from localStorage
- ✅ Token is sent in Authorization header
- ✅ Error messages distinguish between 401, 403, and 500
- ✅ Frontend compiles without errors

**Runtime:**
- ✅ Backend is running on `http://localhost:8080`
- ✅ User is logged in and has valid JWT token
- ✅ User role is either ADMIN or STUDENT
- ✅ Extra food items exist in MongoDB collection

---

## 🧪 TESTING

### Test 1: Student User Views Food List
1. Log in as a STUDENT
2. Navigate to Extra Food page
3. **Expected:** Food list loads and displays items (if any exist)
4. **Verify:** Console shows "✅ Foods loaded:" message

### Test 2: Admin Adds Food Item
1. Log in as ADMIN
2. Navigate to Extra Food page
3. Fill in: Name, Price, Quantity
4. Click "Add Food"
5. **Expected:** Food is added and appears in list
6. **Verify:** Console shows "✅ Food added:" message

### Test 3: Student Books Food
1. Log in as STUDENT
2. Navigate to Extra Food page
3. Select quantity for an item
4. Click "Book Food"
5. **Expected:** Order is placed successfully
6. **Verify:** Success message appears

### Test 4: Token Missing
1. Clear localStorage: `localStorage.clear()`
2. Navigate to Extra Food page
3. **Expected:** Error message "Not logged in. Please login first."
4. **Verify:** Page doesn't crash, shows proper error

---

## 📋 SUMMARY OF CHANGES

### Backend Changes:
| File | Change | Lines |
|------|--------|-------|
| `SecurityConfig.java` | Added extra-food authorization rules | 4 rules |

### Frontend Changes:
| File | Change | Lines |
|------|--------|-------|
| `ExtraFood.js` | Added token + error handling to GET request | ~35 lines |

### Build Status:
✅ Backend: `BUILD SUCCESSFUL`
✅ Frontend: `Compiled successfully`

---

## 🚀 NEXT STEPS

1. **Start Backend:** `./gradlew bootRun` (in backend directory)
2. **Start Frontend:** `npm start` (in frontend directory)
3. **Login:** Use test account
4. **Navigate:** Go to Extra Food page
5. **Verify:** Food items load without error
6. **Check Console:** Verify "✅ Foods loaded:" message

---

## 📞 TROUBLESHOOTING

**Still seeing "Failed to load food"?**
1. Check browser console for detailed error messages
2. Verify backend is running: `curl http://localhost:8080/api/extra-food` (should fail with 401 without token)
3. Verify token exists: `localStorage.getItem('token')` in console
4. Check MongoDB has data: Backend logs should show food count
5. Restart both frontend and backend

**Getting 403 Forbidden?**
1. Check your user role in MongoDB
2. Verify SecurityConfig has `hasAnyRole("ADMIN", "STUDENT")`
3. Check role name case sensitivity (should be uppercase)

**Getting 401 Unauthorized?**
1. Log out and log in again
2. Check token is valid: Paste token in `jwt.io` to decode
3. Check token expiry time

---

## 📚 RELATED FILES

- `backend/src/main/java/com/messhub/backend/controller/ExtraFoodController.java` - API endpoints
- `backend/src/main/java/com/messhub/backend/repository/ExtraFoodRepository.java` - Database access
- `backend/src/main/java/com/messhub/backend/model/ExtraFood.java` - Data model
- `frontend/src/pages/ExtraFood.js` - UI component
- `frontend/src/styles/ExtraFood.css` - Styling (if exists)

