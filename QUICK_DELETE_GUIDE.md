# DELETE Menu - Code Changes Summary

## ✅ 3 Files Modified | 4 Changes Total

---

## 1️⃣ MenuController.java

**Add this DELETE method after the GET method (line 48-66):**

```java
// 🔐 ADMIN ONLY
@DeleteMapping("/{id}")
public ResponseEntity<?> deleteMenu(@PathVariable String id) {

    // ✅ Validate ID
    if (id == null || id.isEmpty()) {
        return ResponseEntity.badRequest()
                .body("Menu ID is required");
    }

    // ✅ Check if menu exists
    if (!menuRepository.existsById(id)) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body("Menu not found");
    }

    // ✅ Delete
    menuRepository.deleteById(id);

    return ResponseEntity.ok("Menu deleted successfully");
}
```

---

## 2️⃣ SecurityConfig.java

**Add this line after GET /api/menu rule (line 62):**

```java
.requestMatchers(HttpMethod.DELETE, "/api/menu/**").hasRole("ADMIN")
```

**Complete MENU section should look like:**
```java
// 🔐 MENU
.requestMatchers(HttpMethod.POST, "/api/menu").hasRole("ADMIN")
.requestMatchers(HttpMethod.GET, "/api/menu").hasAnyRole("ADMIN", "STUDENT")
.requestMatchers(HttpMethod.DELETE, "/api/menu/**").hasRole("ADMIN")
```

---

## 3️⃣ Menu.js - Add Delete Function

**Add this function after handleAddMenu function (line 106):**

```javascript
// 🔹 DELETE MENU (ADMIN ONLY)
const handleDeleteMenu = async (menuId) => {
  if (!window.confirm('Are you sure you want to delete this menu?')) {
    return;
  }

  try {
    setError('');

    await axios.delete(
      `http://localhost:8080/api/menu/${menuId}`
    );

    // ✅ Update state - remove deleted menu
    setMenus(prev => prev.filter(menu => menu._id !== menuId));

    alert('Menu deleted successfully!');

  } catch (err) {
    if (err.response?.status === 403) {
      setError('Only ADMIN can delete menu');
    } else if (err.response?.status === 404) {
      setError('Menu not found');
    } else {
      setError('Failed to delete menu');
    }
  }
};
```

---

## 4️⃣ Menu.js - Add Delete Button to UI

**Update the menu card rendering (replace the entire map section, line 199-208):**

```javascript
{/* ✅ MENU LIST */}
{menus.length === 0 ? (
  <p>No menus available</p>
) : (
  menus.map((menu) => (
    <div key={menu._id} className="menu-card">
      <h3>{menu.day}</h3>
      <p>🍳 Breakfast: {menu.breakfast}</p>
      <p>🍛 Lunch: {menu.lunch}</p>
      <p>🍽 Dinner: {menu.dinner}</p>
      
      {/* 🔐 DELETE BUTTON - ADMIN ONLY */}
      {user?.role === 'ADMIN' && (
        <button
          className="delete-btn"
          onClick={() => handleDeleteMenu(menu._id)}
        >
          🗑 Delete
        </button>
      )}
    </div>
  ))
)}
```

---

## 5️⃣ Menu.CSS - Add Delete Button Styling

**Add at the end of Menu.css file:**

```css
/* 🗑 Delete Button */
.delete-btn {
  background: #ff6b6b;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s ease;
  margin-top: 12px;
  width: 100%;
}

.delete-btn:hover {
  background: #ff5252;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(255, 107, 107, 0.4);
}

.delete-btn:active {
  transform: translateY(0);
}

.delete-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
  transform: none;
}
```

---

## ✅ All Changes Complete!

**Now:**
1. Rebuild backend: `./gradlew.bat bootRun`
2. Restart frontend: `npm start`
3. Login as ADMIN and test delete functionality
4. Verify UI updates instantly without reload

See `DELETE_IMPLEMENTATION_GUIDE.md` for full testing guide.
