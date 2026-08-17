# 🔍 Delete Menu - Debugging Guide

## 🎯 When Things Go Wrong

### Issue 1: "Invalid menu ID format"

**Symptoms:**
```
Error: "Invalid menu ID format"
Status: 400
```

**Debugging Steps:**

1. **Check Backend Console:**
   ```
   ❌ Invalid ObjectId format: undefined
   ❌ Invalid ObjectId format: null
   ❌ Invalid ObjectId format: short-id
   ```

2. **Check Frontend Console (F12):**
   ```javascript
   🔥 Deleting menu ID: undefined
   ```
   ↑ **ID is undefined!** This is the problem.

3. **Check Menu Object:**
   ```javascript
   // In console, inspect menu object
   🔥 Full menu object: { day: "Monday", breakfast: "...", ... }
   // ⚠️ No _id or id field!
   ```

4. **Root Causes:**
   - Menu object from API doesn't have `_id` field
   - API returns menu with different ID field name
   - Menu state is corrupted

**Solutions:**

a) **Check Backend API Response:**
   ```javascript
   // In browser Network tab
   GET /api/menu → Response
   
   // Should see:
   [
     {
       "id": "507f1f77bcf86cd799439011",  // or "_id"
       "day": "Monday",
       "breakfast": "...",
       ...
     }
   ]
   ```

b) **Check Menu.js POST handler:**
   ```javascript
   // In handleAddMenu success
   const res = await axios.post('/api/menu', formData);
   console.log('📝 New menu response:', res.data);
   // Check if response has _id or id field
   ```

c) **Fix Menu.java if needed:**
   ```java
   // Make sure id field serializes correctly
   @Id
   @JsonSerialize(using = ToStringSerializer.class)
   private ObjectId id;
   
   // Add getter if missing
   public String getId() {
       return id != null ? id.toString() : null;
   }
   ```

---

### Issue 2: "Menu not found" (404)

**Symptoms:**
```
Error: "Menu not found"
Status: 404
```

**Debugging Steps:**

1. **Check Backend Console:**
   ```
   ❌ Menu not found: ObjectId('507f1f77bcf86cd799439011')
   ```

2. **Check MongoDB:**
   ```javascript
   // In MongoDB compass or mongosh
   db.menus.find()
   
   // Check if menu with that ID exists
   // If empty, database has no menus
   ```

3. **Check if Menu was actually created:**
   ```javascript
   // Go to Menu page
   // If list is empty, no menus in DB
   // Try adding a menu first
   ```

4. **Stale State Issue:**
   ```javascript
   // In console
   🔥 Deleting menu ID: 507f1f77bcf86cd799439011
   // But this ID doesn't exist in DB anymore
   // (Maybe deleted by another user)
   ```

**Solutions:**

a) **Refresh menu list:**
   ```javascript
   // In Menu.js, add refresh after error
   setMenus([]);  // Clear local state
   fetchMenus();  // Reload from server
   ```

b) **Check Database:**
   ```
   1. Open MongoDB Compass
   2. Connect to localhost:27017
   3. Go to: messhub → menus collection
   4. Search for menu ID
   5. If not there → already deleted
   ```

c) **Prevent duplicate deletes:**
   ```javascript
   // In handleDeleteMenu
   const [deleting, setDeleting] = useState(false);
   
   if (deleting) return;  // Prevent multiple clicks
   ```

---

### Issue 3: "Menu ID is missing"

**Symptoms:**
```
Error: "Error: Menu ID is missing"
Status: (no request made)
```

**Debugging Steps:**

1. **Frontend Console:**
   ```
   ❌ Menu ID is missing: { day: "Monday", breakfast: "..." }
   ```
   ↑ Menu object has no _id field

2. **Check API Response Format:**
   ```javascript
   // In Network tab, check /api/menu GET response
   // Each menu should have:
   {
     "_id": "507f1f77bcf86cd799439011",  // ✅ Must have this
     "day": "Monday",
     "breakfast": "...",
     ...
   }
   ```

3. **Check State Update:**
   ```javascript
   // In handleAddMenu success
   setMenus(prev => [...prev, res.data]);
   // Verify res.data has _id field
   ```

**Solutions:**

a) **Force field name in MongoDB:**
   ```java
   // In Menu.java, use @JsonProperty if needed
   @Id
   @JsonProperty("_id")
   @JsonSerialize(using = ToStringSerializer.class)
   private ObjectId id;
   ```

b) **Debug Response in Frontend:**
   ```javascript
   const handleAddMenu = async (e) => {
     const res = await axios.post('/api/menu', formData);
     console.log('Complete response:', res.data);
     console.log('Has _id?', res.data._id);
     console.log('Has id?', res.data.id);
   };
   ```

c) **Check MenuRepository:**
   ```java
   // Make sure repository extends correct interface
   public interface MenuRepository extends MongoRepository<Menu, ObjectId> {
   }
   ```

---

### Issue 4: Multiple Delete Attempts

**Symptoms:**
```
First delete: Works ✅
Second delete: Returns 404 ❌
```

**Cause:**
Menu already deleted, but local state still has it.

**Solution:**

```javascript
const handleDeleteMenu = async (menu) => {
  const id = menu._id || menu.id;

  // ✅ Remove from state immediately (optimistic update)
  setMenus(prev => prev.filter(m => (m._id || m.id) !== id));

  try {
    // Then confirm with server
    const response = await axios.delete(`/api/menu/${id}`);
    // Already removed from state, so no need to update
  } catch (err) {
    // If delete fails, add menu back to state
    setMenus(prev => [...prev, menu]);
    setError('Delete failed, menu restored');
  }
};
```

---

### Issue 5: Token Issues

**Symptoms:**
```
Status: 401 (Unauthorized)
```

**Debugging:**

1. **Check Token in Storage:**
   ```javascript
   // In browser console
   localStorage.getItem('token')
   // Should return: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   // If nothing → not logged in
   ```

2. **Check Authorization Header:**
   ```javascript
   // In Network tab, look at DELETE request headers
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   // Should be there
   ```

3. **Token Expired:**
   ```javascript
   // If token is old, try logging in again
   localStorage.removeItem('token');
   // Refresh page
   // Login again
   ```

**Solution:**

```javascript
// In Menu.js useEffect
useEffect(() => {
  const token = localStorage.getItem('token');
  if (!token) {
    navigate('/login');  // Redirect if no token
  }
  axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
}, [navigate]);
```

---

### Issue 6: Role Check Fails

**Symptoms:**
```
Status: 403 (Forbidden)
Error: "Access denied"
```

**Debugging:**

1. **Check User Role:**
   ```javascript
   // In console
   console.log(user)
   // Should see: { name: "...", role: "ADMIN" }
   // If role is "STUDENT" → can't delete
   ```

2. **Check JWT Token:**
   ```javascript
   // Decode JWT token
   const token = localStorage.getItem('token');
   const decoded = JSON.parse(atob(token.split('.')[1]));
   console.log('JWT content:', decoded);
   // Should have: { sub: "...", role: "ADMIN", ... }
   ```

3. **Check Backend SecurityConfig:**
   ```java
   // Should have:
   .authorizeHttpRequests(authz -> authz
       .requestMatchers(HttpMethod.DELETE, "/api/menu/**").hasRole("ADMIN")
       ...
   )
   ```

**Solution:**

```javascript
// Frontend: Hide delete button for non-ADMIN
{user?.role === 'ADMIN' && (
  <button onClick={() => handleDeleteMenu(menu)}>Delete</button>
)}
```

---

## 🔧 Console Output Reference

### ✅ Successful Delete
```
🔥 Deleting menu ID: 507f1f77bcf86cd799439011
🔥 Full menu object: { _id: "507f1f77bcf86cd799439011", day: "Monday", ... }
✅ Delete response: { message: "Menu deleted successfully" }
```

### ❌ Invalid ID
```
🔥 Deleting menu ID: undefined
❌ Menu ID is missing: { day: "Monday", ... }
```

### ❌ Not Found
```
🔥 Deleting menu ID: 507f1f77bcf86cd799439011
❌ Delete error response: { message: "Menu not found" }
❌ Delete error status: 404
```

### ❌ Invalid Format
```
🔥 Deleting menu ID: short-id
❌ Delete error response: { message: "Invalid menu ID format" }
❌ Delete error status: 400
```

### ❌ Forbidden
```
❌ Delete error response: (undefined - caught by SecurityConfig)
❌ Delete error status: 403
```

---

## 🎯 Quickest Fixes

### If you get "Invalid menu ID format":
1. Open DevTools (F12) → Console
2. Look for: `🔥 Deleting menu ID: ???`
3. If it says `undefined` → Menu object missing _id
4. Solution: Check Backend API response has `_id` field
5. If it shows valid ID → Backend ObjectId.isValid() issue
6. Solution: Ensure ID is exactly 24 hex characters

### If you get "Menu not found":
1. The menu was deleted or doesn't exist in DB
2. Open DevTools → Network
3. Look at GET /api/menu response
4. Count how many menus exist
5. Add a new menu first, then try delete

### If delete button doesn't show:
1. Check user role: `localStorage.getItem('token')`
2. User must be ADMIN
3. If STUDENT → button hidden by React logic
4. Check: `{user?.role === 'ADMIN' && <button>Delete</button>}`

---

## 📊 Decision Tree

```
Error when clicking delete?

├─ No error, but "Menu ID is missing" appears
│  └─ API response doesn't have _id field
│     └─ Check Backend Menu.java serialization
│
├─ "Invalid menu ID format" (400)
│  └─ Check console: what ID was sent?
│     ├─ undefined or null?
│        └─ Menu object missing _id
│           └─ Add console.log in fetchMenus to check API response
│     └─ Invalid format (not 24 hex)?
│        └─ Check ObjectId.isValid() logic in backend
│
├─ "Menu not found" (404)
│  └─ ID is valid, but menu doesn't exist
│     └─ Check MongoDB if menu still exists
│        └─ May have been deleted by another user
│
├─ Delete button doesn't appear
│  └─ Check user role
│     ├─ Not ADMIN? → Button hidden
│     └─ No token? → Redirect to login
│
└─ Any other error → Check backend logs
```

---

## 🚀 Quick Test Script

```javascript
// Paste in browser console to test delete
(async () => {
  // 1. Get all menus
  const menus = await fetch('/api/menu', {
    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
  }).then(r => r.json());
  
  console.log('📝 Available menus:', menus);
  
  if (menus.length === 0) {
    console.log('❌ No menus to delete!');
    return;
  }
  
  // 2. Try to delete first menu
  const id = menus[0]._id || menus[0].id;
  console.log('🔥 Attempting to delete:', id);
  
  const response = await fetch(`/api/menu/${id}`, {
    method: 'DELETE',
    headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
  }).then(r => r.json());
  
  console.log('✅ Response:', response);
})();
```

---

## 📞 When All Else Fails

1. **Check Backend Logs:**
   ```
   Look for:
   - 🔥 Attempting to delete menu...
   - ❌ Invalid ObjectId format...
   - ✅ Menu deleted successfully...
   ```

2. **Restart Backend:**
   ```powershell
   # Stop current backend
   # Run: ./gradlew bootRun
   ```

3. **Clear Frontend Cache:**
   ```
   F12 → Application → Storage → Clear all
   Refresh page
   ```

4. **Check Network Tab:**
   ```
   F12 → Network
   Try to delete
   Look at request and response
   ```

5. **Check MongoDB:**
   ```
   Open MongoDB Compass
   Check menus collection
   Verify menu exists with correct _id
   ```

