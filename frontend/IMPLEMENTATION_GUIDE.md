# React Authentication & Dashboard Implementation

## Project Structure

```
frontend/src/
├── App.js                          (Main app with routing)
├── App.css                         (Global styles)
├── pages/
│   ├── Login.js                    (Login page component)
│   └── Dashboard.js                (Dashboard page component)
├── components/
│   └── ProtectedRoute.js           (Route protection component)
└── styles/
    ├── Login.css                   (Login page styles)
    └── Dashboard.css               (Dashboard page styles)
```

## Features Implemented

### 1. Authentication System
- ✅ JWT token storage in localStorage
- ✅ User data persistence
- ✅ Token-based API calls
- ✅ Error handling with user feedback

### 2. Routing & Navigation
- ✅ React Router v7 integration
- ✅ Protected routes with ProtectedRoute component
- ✅ Automatic redirection after login
- ✅ Redirect to login on logout
- ✅ Redirect to dashboard if already logged in

### 3. Login Page
- ✅ Email and password input fields
- ✅ Form validation
- ✅ Loading state management
- ✅ Error message display
- ✅ API integration with backend
- ✅ Token storage after successful login
- ✅ User data storage for display

### 4. Dashboard Page
- ✅ Welcome message with user name
- ✅ User role display (ADMIN/STUDENT)
- ✅ User information card
- ✅ Navigation bar with logout button
- ✅ Admin panel (visible only to ADMIN role)
- ✅ Responsive grid layout
- ✅ Logout functionality

### 5. Security Features
- ✅ Protected routes prevent unauthorized access
- ✅ Token validation on app load
- ✅ Automatic redirect for unauthenticated users
- ✅ Token removal on logout

## API Integration

### Login API Call
```
POST http://localhost:8080/api/auth/login
Content-Type: application/json

Request:
{
  "email": "user@example.com",
  "password": "password123"
}

Expected Response:
{
  "token": "jwt_token_here",
  "user": {
    "id": 1,
    "name": "John Doe",
    "email": "user@example.com",
    "role": "STUDENT"
  }
}
```

## How It Works

1. **App Load**: App checks for token in localStorage
2. **Login**: User enters credentials → API call → Token stored
3. **Protected Routes**: ProtectedRoute checks for token before rendering
4. **Dashboard Access**: Only accessible with valid token
5. **Logout**: Clears token and redirects to login

## Routing

- `/` → Login page (redirects to /dashboard if authenticated)
- `/dashboard` → Protected Dashboard (redirects to / if not authenticated)
- `*` → Redirects to login

## State Management

- `isAuthenticated`: Tracks authentication status
- `user`: Stores current user data
- `loading`: Handles initial app load state
- Email, password, error: Managed in Login component

## Styles

### Color Scheme
- Primary: #667eea (Blue)
- Secondary: #764ba2 (Purple)
- Success: #28a745 (Green)
- Error: #c33 (Red)

### Responsive Design
- Mobile-first approach
- Breakpoint at 768px for tablets
- Breakpoint at 480px for mobile phones

## Installation & Running

```bash
# Install dependencies (if not already done)
cd frontend
npm install

# Start development server
npm start

# App runs on http://localhost:3000
```

## Token Usage in API Calls

To use token in API calls (if needed in the future):

```javascript
import axios from 'axios';

const token = localStorage.getItem('token');
const headers = {
  Authorization: `Bearer ${token}`
};

const response = await axios.get('http://localhost:8080/api/protected', { headers });
```

## Notes

- The app expects backend to return either `token` or `jwt` key
- User data is optional but recommended for display
- Role-based UI (ADMIN panel) is conditionally rendered
- All components use React functional components with hooks
- Error handling with user-friendly messages
