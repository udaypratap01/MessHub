# Menu Management - Quick Reference Guide

## ⚡ Quick Start

### For Students
1. Login to your account
2. Click on "Menu Management" card in dashboard
3. View all available menus with meal details
4. Go back to dashboard when done

### For Admins
1. Login to your admin account
2. Click on "Menu Management" card in dashboard
3. Click "+ Add New Menu" button
4. Fill in day, breakfast, lunch, and dinner items
5. Click "Save Menu"
6. New menu appears in the list

---

## 🔌 API Quick Reference

### Get All Menus
```bash
curl -X GET http://localhost:8080/api/menu \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json"
```

### Add New Menu (Admin Only)
```bash
curl -X POST http://localhost:8080/api/menu \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "day": "Monday",
    "breakfast": "Eggs and Toast",
    "lunch": "Rice and Curry",
    "dinner": "Pasta and Salad"
  }'
```

---

## 🎯 Component Structure

### Frontend Files
- **Menu.js** - Main menu component with state management
- **Menu.css** - Styling with gradient design and responsive layout

### Backend Files
- **Menu.java** - Model with 5 fields (id, day, breakfast, lunch, dinner)
- **MenuRepository.java** - Data access layer
- **MenuController.java** - REST endpoints with role-based access

---

## 🔐 Permissions Matrix

| Role | GET /api/menu | POST /api/menu |
|------|---------------|----------------|
| Student | ✅ Allowed | ❌ Denied |
| Admin | ✅ Allowed | ✅ Allowed |
| Guest | ❌ Denied | ❌ Denied |

---

## 🧩 Data Model

```json
{
  "id": "507f1f77bcf86cd799439011",
  "day": "Monday",
  "breakfast": "Eggs and Toast",
  "lunch": "Rice and Curry",
  "dinner": "Pasta and Salad"
}
```

**Fields**:
- `id` - Auto-generated MongoDB ObjectId (String)
- `day` - Day of week (Monday-Sunday)
- `breakfast` - Breakfast item description
- `lunch` - Lunch item description
- `dinner` - Dinner item description

---

## 🎨 UI Features

### Student View
- Read-only menu list
- Grid layout with 7 cards per week
- Meal items with emoji icons
- Back to dashboard button

### Admin View
- Read-only menu list (same as student)
- "+ Add New Menu" button
- Toggle-able form with validation
- Day dropdown, text inputs for meals
- Real-time list updates

---

## ⚠️ Common Issues & Solutions

| Issue | Solution |
|-------|----------|
| Menus not loading | Check JWT token, verify backend is running |
| Add button not showing | Ensure logged in as admin, check user role |
| 403 Forbidden error | Student trying to add menu (admin only) |
| 401 Unauthorized | Invalid or expired JWT token |
| CORS error | Backend CORS not configured for localhost:3000 |

---

## 🔑 Key Points to Remember

1. **Authentication Required**: All menu endpoints require valid JWT token
2. **Role-Based**: POST only for admins, GET for both roles
3. **MongoDB**: Menu data persists in MongoDB database
4. **Real-time UI**: Menu list updates immediately after adding
5. **Responsive**: Works on mobile, tablet, and desktop screens
6. **Protected Routes**: Menu page accessible only to logged-in users

---

## 📝 Form Validation

**Validation Rules**:
- All fields are required (day, breakfast, lunch, dinner)
- Day must be selected from dropdown (Monday-Sunday)
- Breakfast, lunch, dinner: minimum 1 character
- No special character validation
- Empty form shows error message

---

## 🚀 Performance Tips

1. **API Calls**: Menus fetched once on component mount
2. **Caching**: Consider implementing Redux for menu state
3. **Pagination**: Add pagination for large menu lists
4. **Search/Filter**: Add day or meal type filters
5. **Database**: Create index on `day` field for faster queries

---

## 📌 Next Features to Consider

1. Edit existing menu items
2. Delete menu items (admin)
3. Search/filter menus by day
4. Meal preferences/dietary restrictions
5. Menu ratings/feedback from students
6. Scheduled menus with recurring patterns
7. Notification system for new menus

---

## 🔗 Related Routes

- `/` - Login page
- `/dashboard` - Main dashboard
- `/menu` - Menu management (new)
- All routes require authentication

---

## 💡 Development Notes

**Backend Notes**:
- MenuController uses constructor injection (via @Autowired)
- HTTP status codes: 200 (OK), 201 (Created), 400 (Bad Request), 403 (Forbidden), 401 (Unauthorized)
- Error handling with proper response entities

**Frontend Notes**:
- Uses axios for API calls with try-catch error handling
- State management with React hooks (useState, useEffect)
- Conditional rendering for admin features
- Loading and error states properly managed

---

## 📞 Quick Help

**Reset Menu List**: Refresh the page (Ctrl+R or Cmd+R)

**Clear Cache**: 
```javascript
// Open browser console and run:
localStorage.clear();
location.reload();
```

**Check JWT Token**:
```javascript
// Open browser console and run:
console.log(localStorage.getItem('token'));
```

**Check User Info**:
```javascript
// Open browser console and run:
console.log(JSON.parse(localStorage.getItem('user')));
```

---

**Version**: 1.0 | **Status**: Production Ready | **Last Updated**: December 2024
