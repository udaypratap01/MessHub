# 🚀 SIGNUP - QUICK START GUIDE

## ✅ What's New

**Signup API + Frontend Form** for user registration

---

## 📋 Files Changed

| File | Change | Type |
|------|--------|------|
| AuthController.java | Added register() method | Backend |
| SecurityConfig.java | Added /register to public routes | Backend |
| Signup.js | New signup page component | Frontend |
| Signup.css | New signup styling | Frontend |
| Login.js | Added signup link | Frontend |
| App.js | Added signup route | Frontend |

---

## 🎯 How It Works

### Backend Signup
```
POST /api/auth/register
{
  "name": "User Name",
  "email": "user@example.com",
  "password": "password123",
  "role": "STUDENT"  // optional
}

Response (201):
{
  "message": "User registered successfully",
  "user": {
    "id": "...",
    "name": "User Name",
    "email": "user@example.com",
    "role": "STUDENT"
  }
}
```

### Frontend Form
```
Form Fields:
- Full Name (required)
- Email (required, unique)
- Password (required, 4+ chars)
- Confirm Password (must match)
- Role (optional, default STUDENT)

On Success:
- Show success message
- Redirect to login (2 sec)

On Error:
- Show error message
- Form stays, user can retry
```

---

## 🧪 Quick Test

1. **Start backend:**
   ```powershell
   ./gradlew bootRun
   ```

2. **Start frontend:**
   ```powershell
   npm start
   ```

3. **Go to:** http://localhost:3000/signup

4. **Fill form:**
   - Name: "Test User"
   - Email: "test@example.com"
   - Password: "test123"
   - Confirm: "test123"
   - Role: "STUDENT"

5. **Click Sign Up**

6. **Expected:**
   - ✅ Success message
   - ✅ Redirect to login
   - ✅ Login with registered email

---

## 🔐 Security

✅ Public endpoint (no authentication required)  
✅ Email uniqueness enforced  
✅ Password validation  
✅ Input sanitization  
✅ Password not in response  

⚠️ TODO: Hash passwords in production

---

## 📊 API Endpoint

```
POST /api/auth/register
Content-Type: application/json

Required Fields:
- name (string, required)
- email (string, required, unique)
- password (string, required)

Optional Fields:
- role (string, defaults to "STUDENT")

Success: 201 Created
Error: 400 Bad Request
```

---

## 💻 Frontend Routes

```
/          → Login (or Signup link)
/signup    → Registration form
/dashboard → Protected (authenticated users)
/menu      → Protected (authenticated users)
```

---

## 🎨 UI Features

✅ Modern gradient background  
✅ Form validation  
✅ Error messages (red)  
✅ Success messages (green)  
✅ Loading button states  
✅ Password confirmation field  
✅ Role dropdown  
✅ Link to login page  
✅ Responsive design  

---

## 🔄 Complete Workflow

```
1. User clicks "Sign up here" on login page
   ↓
2. Form opens at /signup
   ↓
3. User fills: name, email, password, role
   ↓
4. Click "Sign Up" button
   ↓
5. Frontend validates:
   - All fields filled
   - Passwords match
   - Password >= 4 chars
   ↓
6. Send POST to /api/auth/register
   ↓
7. Backend validates:
   - All fields not empty
   - Email is unique
   ↓
8. Save new user to MongoDB
   ↓
9. Return 201 + user data
   ↓
10. Frontend shows success
    ↓
11. Auto-redirect to login (2 sec)
    ↓
12. User logs in with email + password
    ↓
13. JWT token generated
    ↓
14. Access dashboard
```

---

## 🚀 Ready to Use

Backend: ✅ Compile and run  
Frontend: ✅ Start dev server  
Routes: ✅ All configured  
Database: ✅ User saved to MongoDB  

**Just run and test!**

---

## 📞 Troubleshooting

| Issue | Solution |
|-------|----------|
| Form doesn't load | Check App.js has Signup import + route |
| Can't signup | Check backend is running on 8080 |
| Email error | Clear test data in MongoDB |
| CORS error | Check SecurityConfig has registerAll() |
| Password mismatch error | Ensure both password fields match |
| No redirect after signup | Check setTimeout in handleSignup |

---

## ✨ What's Different

**Before:**
- No signup functionality
- Could only login with pre-existing users
- Manual user creation in database

**After:**
- ✅ Users can self-register
- ✅ Form validation
- ✅ Email uniqueness check
- ✅ Role selection
- ✅ Automatic redirect to login

---

## 📚 See Also

- `SIGNUP_IMPLEMENTATION.md` - Complete documentation
- `AuthController.java` - Register method code
- `Signup.js` - Form component code
- `Signup.css` - Form styling

