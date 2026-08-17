# Menu Management System - Complete Implementation Guide

## 📋 Overview

The Menu Management System is a complete feature that allows admins to create and manage weekly meal menus, while students can view the menu items. The system is fully integrated with the authentication system and role-based access control.

---

## 🏗️ Architecture

### Backend Components

**1. Menu Model (`Menu.java`)**
- MongoDB document representing daily menu items
- Fields: `id`, `day`, `breakfast`, `lunch`, `dinner`
- Stored in `menus` collection

**2. MenuRepository (`MenuRepository.java`)**
- Extends `MongoRepository<Menu, String>`
- Provides CRUD operations automatically
- Database interaction layer

**3. MenuController (`MenuController.java`)**
- REST API controller with `/api/menu` base URL
- Two main endpoints: GET (retrieve menus) and POST (add new menus)
- Role-based access control integrated with Spring Security

### Frontend Components

**1. Menu Page (`Menu.js`)**
- React functional component using hooks
- Displays list of all menus in a grid layout
- Admin-only form to add new menus
- Real-time menu list updates

**2. Menu Styling (`Menu.css`)**
- Modern gradient design matching the application theme
- Responsive grid layout for menu cards
- Interactive form with validation feedback
- Mobile-friendly design

---

## 🔐 Security & Authorization

### Role-Based Access Control

| Endpoint | Method | Required Role | Action |
|----------|--------|---------------|--------|
| `/api/menu` | GET | ADMIN, STUDENT | View all menus |
| `/api/menu` | POST | ADMIN | Create new menu |

### Implementation

All authorization is handled at the `SecurityConfig` level:

```java
.requestMatchers("GET", "/api/menu").hasAnyRole("ADMIN", "STUDENT")
.requestMatchers("POST", "/api/menu").hasRole("ADMIN")
```

The controller methods are automatically protected by Spring Security filters before execution.

### JWT Authentication

All menu endpoints require a valid JWT token in the `Authorization` header:

```
Authorization: Bearer <jwt_token>
```

---

## 📡 API Endpoints

### 1. GET /api/menu - Retrieve All Menus

**Access**: ADMIN and STUDENT roles

**Request**:
```http
GET http://localhost:8080/api/menu
Authorization: Bearer <jwt_token>
Content-Type: application/json
```

**Response (Success - 200 OK)**:
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "day": "Monday",
    "breakfast": "Eggs and Toast",
    "lunch": "Rice and Curry",
    "dinner": "Pasta and Salad"
  },
  {
    "id": "507f1f77bcf86cd799439012",
    "day": "Tuesday",
    "breakfast": "Pancakes",
    "lunch": "Chicken Biryani",
    "dinner": "Soup and Bread"
  }
]
```

**Response (No Menus - 200 OK)**:
```json
[]
```

**Response (Unauthorized - 401)**:
```json
{
  "error": "Invalid or expired token"
}
```

**Response (Forbidden - 403)**:
```json
{
  "error": "Access denied"
}
```

---

### 2. POST /api/menu - Create New Menu

**Access**: ADMIN role only

**Request**:
```http
POST http://localhost:8080/api/menu
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "day": "Wednesday",
  "breakfast": "Oatmeal with Fruits",
  "lunch": "Fish and Vegetables",
  "dinner": "Daal and Roti"
}
```

**Response (Success - 201 CREATED)**:
```json
{
  "id": "507f1f77bcf86cd799439013",
  "day": "Wednesday",
  "breakfast": "Oatmeal with Fruits",
  "lunch": "Fish and Vegetables",
  "dinner": "Daal and Roti"
}
```

**Response (Bad Request - 400)**:
```json
{
  "error": "Invalid menu data"
}
```

**Response (Forbidden - 403)**:
```json
{
  "error": "Only admins can add menus"
}
```

---

## 🎯 Frontend Usage

### Routing

The Menu page is accessible at `/menu` and is protected by the `ProtectedRoute` component:

```javascript
<Route
  path="/menu"
  element={
    <ProtectedRoute isAuthenticated={isAuthenticated}>
      <Menu user={user} />
    </ProtectedRoute>
  }
/>
```

### Component Props

**Menu Component Props**:
- `user` (Object) - Current user object with `name`, `email`, and `role`

### State Management

The Menu component manages:
- `menus` - Array of all menus from backend
- `loading` - Loading state during API calls
- `error` - Error messages for user feedback
- `showForm` - Toggle form visibility (admin only)
- `formData` - Form input values
- `submitting` - Submitting state for form

### Key Functions

**fetchMenus()**: 
- Fetches all menus from `/api/menu`
- Called on component mount
- Updates `menus` state

**handleAddMenu()**: 
- Validates form inputs
- Sends POST request to `/api/menu`
- Updates menu list on success
- Resets form and hides form

**handleInputChange()**: 
- Updates `formData` state as user types
- Supports all form fields

**handleBackToDashboard()**: 
- Navigates back to `/dashboard`

---

## 🧪 Testing Guide

### 1. Testing as Student Role

**Setup**:
1. Login with a student account
2. Navigate to `/menu`

**Expected Behavior**:
- ✅ Menu list displays all menus
- ✅ No "Add New Menu" button visible
- ✅ Can see breakfast, lunch, and dinner items
- ✅ Back button returns to dashboard

**API Call**:
```
GET /api/menu (Status: 200)
```

### 2. Testing as Admin Role

**Setup**:
1. Login with an admin account
2. Navigate to `/menu`

**Expected Behavior**:
- ✅ Menu list displays all menus
- ✅ "Add New Menu" button is visible
- ✅ Clicking button shows form
- ✅ Can enter menu details and submit

**Adding a Menu**:
1. Click "Add New Menu" button
2. Select day from dropdown
3. Enter breakfast, lunch, dinner items
4. Click "Save Menu"
5. New menu appears in list immediately

**API Call**:
```
POST /api/menu (Status: 201)
New menu object returned with generated ID
```

### 3. Testing Authorization

**Test 1: Student trying to add menu**
```
POST /api/menu with student JWT
Expected: 403 Forbidden
```

**Test 2: Without JWT token**
```
GET /api/menu without Authorization header
Expected: 401 Unauthorized
```

**Test 3: With invalid JWT**
```
GET /api/menu with invalid token
Expected: 401 Unauthorized
```

---

## 🛠️ Configuration

### Backend Properties

No special configuration needed. The system uses:
- Spring Boot default MongoDB connection
- Spring Security for JWT validation
- Spring Data MongoDB for repository operations

### Frontend Configuration

API base URL is hardcoded as `http://localhost:8080` in the Menu component:

```javascript
axios.get('http://localhost:8080/api/menu', {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json'
  }
});
```

To change the base URL, update the component or create an environment variable.

---

## 📁 File Structure

```
backend/
├── src/main/java/com/messhub/backend/
│   ├── model/
│   │   └── Menu.java
│   ├── repository/
│   │   └── MenuRepository.java
│   └── controller/
│       └── MenuController.java

frontend/
├── src/
│   ├── pages/
│   │   └── Menu.js
│   └── styles/
│       └── Menu.css
```

---

## 🚀 Deployment Checklist

- [ ] Backend: MenuController compiles without errors
- [ ] Backend: MenuRepository is properly annotated with @Repository
- [ ] Backend: Menu model has @Document and @Id annotations
- [ ] Frontend: Menu.js component is properly imported in App.js
- [ ] Frontend: Menu route is added to React Router
- [ ] Frontend: Menu.css file exists and is properly imported
- [ ] API: JWT token is passed in Authorization header
- [ ] API: CORS is properly configured for localhost:3000
- [ ] API: Menu endpoints have correct role-based access control
- [ ] Database: MongoDB is running and accessible
- [ ] Testing: Manual tests pass for both student and admin roles

---

## 🐛 Troubleshooting

### Issue: Menu list not loading

**Possible Causes**:
1. JWT token is invalid or expired
2. Backend is not running on localhost:8080
3. MongoDB is not running
4. CORS is not properly configured

**Solution**:
1. Check browser console for error messages
2. Verify token in localStorage is valid
3. Check backend logs for errors
4. Restart backend and MongoDB

### Issue: "Add New Menu" form not appearing for admin

**Possible Causes**:
1. User role is not properly set as "ADMIN"
2. User object is not passed to Menu component

**Solution**:
1. Check user role in localStorage
2. Verify user object is correctly passed from Dashboard
3. Check React Developer Tools for component props

### Issue: 403 Forbidden when adding menu

**Possible Causes**:
1. User role is not "ADMIN"
2. JWT token does not include ADMIN role in claims

**Solution**:
1. Login with admin account
2. Check backend JWT filter for proper role encoding
3. Verify SecurityConfig has correct role matcher

---

## 📚 Related Documentation

- [Authentication System Guide](./AUTHENTICATION_SETUP.md)
- [CORS Configuration Guide](./CORS_CONFIG.md)
- [Spring Security Configuration](./SECURITY_CONFIG.md)
- [Frontend Quick Start](./FRONTEND_QUICK_START.md)

---

## 📞 Support

For issues or questions:
1. Check the troubleshooting section above
2. Review browser console and backend logs
3. Verify all components are properly configured
4. Ensure MongoDB and backend are running

---

**Last Updated**: December 2024
**Version**: 1.0
**Status**: Production Ready
