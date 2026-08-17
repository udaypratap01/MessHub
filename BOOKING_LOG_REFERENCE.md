# 🔍 BOOKING FLOW - EXPECTED LOG OUTPUT

## Frontend Console (F12 → Console Tab)

When you click "Book Now" button, you should see:

```
=== BOOKING FUNCTION CALLED ===
FULL FOOD OBJECT: {
  _id: "507f1f77bcf86cd799439011"
  name: "Samosa"
  price: 20
  quantity: 50
  __v: 0
  (other properties)
}
Food properties: {
  name: "Samosa"
  price: 20
  quantity: 50
  _id: "507f1f77bcf86cd799439011"
  id: undefined
}
EXTRACTED ID: 507f1f77bcf86cd799439011 type: string
ID is valid: true
📊 Booking quantity: 2
📤 Sending to API: {foodId: "507f1f77bcf86cd799439011", quantity: 2}
Headers: {Authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."}
✅ Booking successful: {
  message: "Order created successfully"
  (response data)
}
```

---

## Backend Console (Terminal)

In the terminal where you ran `./gradlew.bat bootRun`, you should see:

```
=== BOOKING REQUEST RECEIVED ===
Authorization Header: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
Request Body (Raw): {foodId=507f1f77bcf86cd799439011, quantity=2}
Request Keys: [foodId, quantity]

✅ User Email Extracted: student@example.com

📋 VALIDATING REQUEST DATA:
  foodId value: 507f1f77bcf86cd799439011
  foodId type: java.lang.String
  foodId is empty: false
  quantity value: 2
  quantity type: java.lang.Integer

✅ Quantity parsed: 2
✅ ALL VALIDATIONS PASSED
   foodId: 507f1f77bcf86cd799439011
   quantity: 2
   userEmail: student@example.com
=== PROCEEDING WITH BOOKING ===
```

Then you'll see more logs as it processes the booking:
```
✅ Found food: Samosa (50 units available)
✅ Quantity validation passed: requested 2, available 50
✅ Order created: Order(id=..., userEmail=student@example.com, foodId=507f1f77bcf86cd799439011, ...)
✅ Food quantity updated: Samosa now has 48 units
```

---

## Error Scenarios & Expected Logs

### ❌ Scenario 1: Frontend Not Sending foodId

**Frontend Console:**
```
EXTRACTED ID: undefined type: undefined
```

**Backend Console:** (May not even reach here if frontend validation catches it)
```
Request Keys: [quantity]  // ← foodId is MISSING
foodId value: null
foodId is empty: true
❌ VALIDATION FAILED: Food ID is required
   Available keys in request: [quantity]
```

**Fix:** Check if `food._id` exists in frontend food object

---

### ❌ Scenario 2: foodId is Empty String

**Frontend Console:**
```
EXTRACTED ID:  type: string  // ← Notice it's empty
ID is valid: false
```

**Backend Console:**
```
foodId value: 
foodId is empty: true  // ← Empty!
❌ VALIDATION FAILED: Food ID is required
```

**Fix:** Validate food object before passing, add null check

---

### ❌ Scenario 3: Invalid Token

**Frontend Console:**
```
📤 Sending to API: {foodId: "507f1f77bcf86cd799439011", quantity: 2}
❌ Booking error: Error: Request failed with status code 401
📊 Response status: 401
```

**Backend Console:**
```
Authorization Header: null  // ← Missing!
❌ ERROR: Authorization header is missing
```

**Fix:** Login again, token has expired or not saved

---

### ❌ Scenario 4: Wrong Request Key Name

**Frontend Console:**
```
📤 Sending to API: {food_id: "507f1f77bcf86cd799439011", quantity: 2}
// ↑ Notice: food_id instead of foodId
```

**Backend Console:**
```
Request Keys: [food_id, quantity]  // ← Wrong key!
foodId value: null  // ← foodId key doesn't exist
❌ VALIDATION FAILED: Food ID is required
   Available keys in request: [food_id, quantity]
```

**Fix:** Check frontend is sending exact key `foodId` (camelCase)

---

### ❌ Scenario 5: Food Quantity Not Available

**Frontend & Backend pass validation, then:**

**Backend Console:**
```
✅ ALL VALIDATIONS PASSED
✅ Found food: Samosa (2 units available)
❌ Quantity error: Requested 5, but only 2 available
```

**Frontend Console:**
```
❌ Booking error
Response data: {message: "Not enough quantity available"}
```

**Fix:** User selected more quantity than available, input max is already limited

---

## Log Tracing Guide

### Question: "Food ID is required" - Where is the issue?

**Follow these steps:**

1. **Check Frontend Console First:**
   ```
   EXTRACTED ID: ?
   ```
   - If `undefined` → Issue in frontend, food._id missing
   - If valid ID → Go to step 2

2. **Check Backend Console:**
   ```
   Request Keys: [...]
   ```
   - If `foodId` missing → Frontend not sending it
   - If `foodId` present → Check next line

3. **Check foodId Value:**
   ```
   foodId value: ?
   ```
   - If `null` → Key exists but value is null
   - If empty string `""` → Frontend sending empty
   - If valid ID → Should pass validation

4. **Check Validation Output:**
   ```
   ✅ ALL VALIDATIONS PASSED or ❌ VALIDATION FAILED
   ```
   - If validation passes → Issue is elsewhere
   - If validation fails → See which line failed

---

## Complete Booking Log Sequence

Here's the COMPLETE expected log from start to finish:

```
========== FRONTEND CONSOLE ==========

=== BOOKING FUNCTION CALLED ===
FULL FOOD OBJECT: {_id: "507f1f77bcf86cd799439011", name: "Samosa", price: 20, quantity: 50}
Food properties: {name: "Samosa", price: 20, quantity: 50, _id: "507f1f77bcf86cd799439011", id: undefined}
EXTRACTED ID: 507f1f77bcf86cd799439011 type: string
ID is valid: true
📊 Booking quantity: 2
📤 Sending to API: {foodId: "507f1f77bcf86cd799439011", quantity: 2}
Headers: {Authorization: "Bearer eyJhbGciOi..."}

========== BACKEND CONSOLE ==========

=== BOOKING REQUEST RECEIVED ===
Authorization Header: Bearer eyJhbGciOi...
Request Body (Raw): {foodId=507f1f77bcf86cd799439011, quantity=2}
Request Keys: [foodId, quantity]

✅ User Email Extracted: student@example.com

📋 VALIDATING REQUEST DATA:
  foodId value: 507f1f77bcf86cd799439011
  foodId type: java.lang.String
  foodId is empty: false
  quantity value: 2
  quantity type: java.lang.Integer

✅ Quantity parsed: 2
✅ ALL VALIDATIONS PASSED
   foodId: 507f1f77bcf86cd799439011
   quantity: 2
   userEmail: student@example.com
=== PROCEEDING WITH BOOKING ===

(More backend processing...)

✅ Order created successfully

========== FRONTEND CONSOLE AGAIN ==========

✅ Booking successful: {message: "Order created successfully", data: {...}}
```

---

## Quick Reference

| What to Check | Frontend Location | Backend Location |
|---------------|-------------------|------------------|
| Full food object | `FULL FOOD OBJECT:` | - |
| Extracted ID | `EXTRACTED ID:` | - |
| Request being sent | `Sending to API:` | `Request Body (Raw):` |
| Request keys | - | `Request Keys:` |
| foodId value | - | `foodId value:` |
| foodId type | `type: string` | `foodId type: java.lang.String` |
| Validation status | - | `ALL VALIDATIONS PASSED` or error |
| Success | `Booking successful:` | `Order created successfully` |

---

## Debugging Checklist

- [ ] Frontend console shows `FULL FOOD OBJECT` with `_id` property
- [ ] Frontend console shows `EXTRACTED ID` with valid MongoDB ObjectId
- [ ] Frontend console shows `Sending to API` with correct foodId and quantity
- [ ] Backend console shows `Request Keys: [foodId, quantity]`
- [ ] Backend console shows `foodId value: [valid-id]` (not null, not empty)
- [ ] Backend console shows `✅ ALL VALIDATIONS PASSED`
- [ ] Backend processes booking and creates order
- [ ] Frontend shows success message
- [ ] Food quantity decreases
- [ ] Order appears in student's view

If any of these fail, the logs will tell you exactly which step failed!
