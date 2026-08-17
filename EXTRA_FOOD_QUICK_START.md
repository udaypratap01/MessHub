# 🍕 EXTRA FOOD ORDERING - QUICK START (5 MIN)

## ⚡ What's New

Complete extra food ordering system is implemented!
- Admins can add/manage food items
- Students can browse and book food
- Quantity auto-decreases after booking
- Price locked at booking time

---

## 📦 6 Backend Files Created

✅ ExtraFood.java (model)  
✅ Order.java (model)  
✅ ExtraFoodRepository.java (repo)  
✅ OrderRepository.java (repo)  
✅ ExtraFoodController.java (API)  
✅ OrderController.java (API)  

---

## 📱 Frontend Files

✅ ExtraFood.js (React component - 280 lines)  
✅ ExtraFood.css (Responsive styling - 400 lines)  
✅ App.js (Added /extra-food route)  
✅ Dashboard.js (Added food card link)  

---

## 🚀 Deploy in 3 Steps

### 1. Build Backend
```powershell
cd backend
./gradlew clean build
./gradlew bootRun
```

### 2. Start Frontend
```powershell
cd frontend
npm start
```

### 3. Test It
1. Login at http://localhost:3000
2. Dashboard → Click "Extra Food Items" 🍕
3. If ADMIN → Add food items
4. If STUDENT → Book food items

---

## 🎯 User Workflows

### ADMIN Workflow
```
Login
  ↓
Dashboard
  ↓
Click "Extra Food Items" 🍕
  ↓
Click "+ Add Food Item"
  ↓
Enter: Name, Price, Quantity
  ↓
Click "Add Food Item"
  ↓
Success! Food appears in grid
  ↓
Can delete with trash icon 🗑️
```

### STUDENT Workflow
```
Login
  ↓
Dashboard
  ↓
Click "Extra Food Items" 🍕
  ↓
See all available food items
  ↓
Enter quantity for any item
  ↓
Click "Book Now"
  ↓
Success! Quantity decreases
  ↓
Order saved to history
```

---

## 📊 API Endpoints

### ADMIN
```
POST /api/extra-food          → Add food
GET  /api/extra-food          → View all food
PUT  /api/extra-food/{id}     → Update food
DELETE /api/extra-food/{id}   → Delete food
GET  /api/orders              → View all orders
```

### STUDENT
```
POST /api/orders              → Book food
GET  /api/orders/my           → View own orders
```

---

## ✨ Key Features

✅ Admin can add/delete food items  
✅ Student can browse and book  
✅ Quantity auto-decreases  
✅ Price locked at booking time  
✅ Real-time updates  
✅ JWT authentication  
✅ Error handling  
✅ Mobile responsive  

---

## 🔐 Security

✅ JWT token required  
✅ Email from token (can't spoof)  
✅ Role-based access  
✅ Quantity validation  
✅ Price validation  

---

## 📝 Database

**Collections Created:**
- `extra_food` - Food items with price & quantity
- `orders` - Student bookings with price & status

---

## 🧪 Quick Test

### Add Food (Admin)
1. Login as ADMIN
2. Go to /extra-food
3. Click "+ Add Food Item"
4. Fill: Name="Samosa", Price="20.50", Quantity="100"
5. Click "Add Food Item"
6. ✅ Should see: Samosa, ₹20.50, 100 units

### Book Food (Student)
1. Login as STUDENT
2. Go to /extra-food
3. Find Samosa
4. Enter quantity: 5
5. Click "Book Now"
6. ✅ Should see: "Samosa booked successfully!"
7. Quantity becomes: 95 units

---

## 💡 Important Details

| Aspect | Details |
|--------|---------|
| Authentication | JWT Bearer token |
| User Identification | Email from JWT (secure) |
| Quantity Check | Before booking allowed |
| Price Lock | Stored at booking time |
| Status | Always "BOOKED" for now |
| Mobile | Fully responsive |

---

## 🐛 If Something Breaks

1. **Backend won't start:** Check port 8080 is free
2. **Frontend won't load:** Check backend running
3. **Can't add food:** Ensure logged in as ADMIN
4. **Can't book:** Ensure logged in as STUDENT
5. **Quantity not updating:** Refresh page
6. **Auth error:** Clear localStorage, re-login

---

## 📂 Files Summary

| File | Size | Purpose |
|------|------|---------|
| ExtraFood.java | 60 lines | Model |
| Order.java | 120 lines | Model |
| Repositories | 25 lines | DB queries |
| Controllers | 360 lines | APIs |
| ExtraFood.js | 280 lines | React UI |
| ExtraFood.css | 400 lines | Styling |

**Total:** ~1,250 lines of production code

---

## ✅ Status

**All files created** ✅  
**Backend compiled** ✅  
**Frontend updated** ✅  
**Routes configured** ✅  
**Security working** ✅  
**Mobile responsive** ✅  
**Ready to use!** ✅  

---

**Extra Food Ordering System is LIVE!** 🍕✨

Go to Dashboard → Extra Food Items 🍕

