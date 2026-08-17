# 🧪 Testing Guide - Admin & Bill System

## Quick Start

### Prerequisites
1. Backend running: `./gradlew bootRun` or `java -jar backend-0.0.1-SNAPSHOT.jar`
2. Frontend running: `npm start` (port 3000)
3. MongoDB running locally or configured in application.properties

---

## Test Scenarios

### Scenario 1: Admin Adds Food Item

**Setup:**
1. Login as admin (email: `admin@example.com`, role: ADMIN)
2. Navigate to Dashboard → "Extra Food Items"

**Steps:**
1. Scroll down to see the form "➕ Add New Food Item"
2. Fill in:
   - Food Name: "Paneer Tikka"
   - Price: "180"
   - Quantity: "20"
3. Click "✅ Add Food" button
4. Should see: "Food added successfully!" message
5. Form should auto-clear
6. New food item should appear in the list below

**Expected Result:** ✅ Food item appears in grid with delete button visible

---

### Scenario 2: Admin Deletes Food Item

**Setup:**
1. Login as admin
2. Navigate to Extra Food Items page
3. Should see food cards with "🗑️ Delete" button (RED)

**Steps:**
1. Click "🗑️ Delete" button on any food item
2. Confirmation dialog appears: "Are you sure you want to delete this food item?"
3. Click "OK" to confirm
4. Wait for request to complete
5. Should see: "Food item deleted successfully!" message

**Expected Result:** ✅ Food card disappears from list

**Note:** If no delete button visible:
- Open DevTools → Console
- Check that `console.log("🔍 ExtraFood DEBUG:")` shows `isAdmin: true`
- If false, check localStorage for role

---

### Scenario 3: Student Views My Bill

**Setup:**
1. Login as student (any non-admin account)
2. Must have placed at least 1 food order previously

**Steps:**
1. Go to Dashboard
2. Click "💰 View My Bill" card
3. Wait for page to load
4. Should see:
   - Student email at top
   - Summary cards showing:
     - Total Bill Amount (₹)
     - Total Orders (count)
     - Average per Order (₹)
5. Scroll down to see orders table with:
   - Food Item name
   - Quantity ordered
   - Price per Unit
   - Total Price (in red)
   - Order Date
   - Status badge

**Expected Result:** ✅ All order details displayed correctly

---

### Scenario 4: Admin Views All Orders

**Setup:**
1. Login as admin
2. Dashboard visible

**Steps:**
1. Click "View All Orders" in Admin Panel section
2. Page loads with table showing:
   - Student Email
   - Food Name
   - Quantity
   - Total Price
   - Order Date
   - Status
3. Should also see summary cards:
   - Total Orders
   - Total Revenue
   - Average Order Value
   - Orders Today

**Expected Result:** ✅ All student orders visible with correct details

---

### Scenario 5: Student Cannot See Admin Features

**Setup:**
1. Login as student (non-admin)
2. Navigate to Extra Food Items

**Steps:**
1. Look for "➕ Add New Food Item" form - SHOULD NOT EXIST
2. Look for "🗑️ Delete" buttons on food cards - SHOULD NOT EXIST
3. Student should only see food cards to order from
4. Dashboard should NOT show "Admin Panel" section

**Expected Result:** ✅ No admin features visible to students

---

### Scenario 6: Order Food and Check Bill

**Complete Flow:**
1. Login as STUDENT
2. Navigate to "Extra Food Items"
3. Order 2 items (e.g., 2x Biryani @ ₹150 = ₹300)
4. Order another item (1x Paneer @ ₹100 = ₹100)
5. Total should be ₹400
6. Go to Dashboard → "View My Bill"
7. Should show:
   - Total Bill Amount: ₹400
   - Total Orders: 2
   - Average per Order: ₹200

**Expected Result:** ✅ Bill correctly calculated and displayed

---

## Test Cases Checklist

### Frontend Tests
- [ ] Admin can see add food form
- [ ] Admin can add food with all fields required
- [ ] Admin can delete food with confirmation
- [ ] Delete button is RED and full-width
- [ ] Student cannot see add form
- [ ] Student cannot see delete buttons
- [ ] Bill page shows correct total
- [ ] Bill page shows order details table
- [ ] Bill page is responsive on mobile
- [ ] Loading state shows on bill page
- [ ] Error state handles missing token
- [ ] Empty state shows when no orders

### Backend Tests
- [ ] POST /api/extra-food returns 201 (created)
- [ ] DELETE /api/extra-food/{id} returns 200 (deleted)
- [ ] GET /api/bill/my returns 200 with correct data
- [ ] GET /api/bill/my without token returns 401
- [ ] GET /api/bill/my with invalid token returns 401
- [ ] totalFoodBill equals sum of order totalPrice values
- [ ] orderCount matches number of orders
- [ ] Email extracted correctly from JWT

### Security Tests
- [ ] Student cannot access admin endpoints
- [ ] Missing token returns 401 unauthorized
- [ ] Invalid token returns 401 unauthorized
- [ ] Student can only see their own bill
- [ ] Role claim correctly included in JWT

---

## Debug Commands

### Browser Console (While on Bill page)
```javascript
// Check token
localStorage.getItem('token')

// Check user data
JSON.parse(localStorage.getItem('user'))

// Check if user is admin
const user = JSON.parse(localStorage.getItem('user'));
console.log(user.role === 'ADMIN');

// Check ExtraFood debug logs
// Look for: "🔍 ExtraFood DEBUG:" in console
```

### Backend Logs
Look for:
```
GET /api/bill/my
Authorization: Bearer {token}
Email extracted: student@example.com
Orders found: 3
Total bill: 450.00
```

### Network Debugging (DevTools)
1. Open DevTools → Network tab
2. Perform action
3. Click on request
4. Check:
   - Status (should be 200 for success, 401 for auth errors)
   - Request Headers (Authorization: Bearer token)
   - Response (should have data)

---

## Common Issues & Solutions

### Issue: "Authorization token required"
**Cause:** Token not sent in header  
**Solution:** Check localStorage has valid token. Try re-login.

### Issue: Admin buttons not showing
**Cause:** Role not correctly detected  
**Solution:**
```javascript
// In DevTools console:
const user = JSON.parse(localStorage.getItem('user'));
console.log('Role:', user.role); // Should be "ADMIN"
```

### Issue: Bill shows ₹0.00
**Cause:** No orders found for user  
**Solution:** First, place some food orders as student, then check bill.

### Issue: Delete button not working
**Cause:** Network error or server issue  
**Solution:** Check browser console for error message. Verify backend is running.

### Issue: Add food form not submitting
**Cause:** Validation error  
**Solution:** Check all fields are filled. Prices must be > 0. Name cannot be empty.

---

## Performance Notes

- Bill page loads in ~500-1000ms (depends on number of orders)
- Each API call includes Bearer token validation
- Frontend filters data locally (no pagination needed for small datasets)
- Table is responsive and works on mobile with horizontal scroll

---

## Test Data Setup

### Create Test Admin
```
Email: admin@test.com
Password: admin123
Role: ADMIN
```

### Create Test Student
```
Email: student@test.com
Password: student123
Role: STUDENT
```

### Sample Food Items to Add
1. Biryani - ₹150/unit - Qty: 30
2. Paneer Tikka - ₹120/unit - Qty: 25
3. Butter Chicken - ₹180/unit - Qty: 20
4. Dal Makhani - ₹80/unit - Qty: 40
5. Roti - ₹5/unit - Qty: 100

### Sample Orders (Place as Student)
1. 2x Biryani = ₹300
2. 1x Paneer Tikka = ₹120
3. 2x Butter Chicken = ₹360
4. 3x Dal Makhani = ₹240
5. 10x Roti = ₹50

**Expected Bill Total:** ₹1,070

---

## Sign-off Checklist

- [ ] All admin features working
- [ ] All student features working
- [ ] Bill calculation correct
- [ ] No console errors
- [ ] No 404 errors
- [ ] Responsive on mobile
- [ ] Token handling secure
- [ ] Role-based access working
- [ ] Error messages helpful
- [ ] UI looks professional

---

**Last Updated:** January 2024  
**Version:** 1.0
