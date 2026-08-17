# 🍕 Extra Food API Documentation

## Base URL
```
http://localhost:8080/api/extra-food
```

---

## Endpoints

### 1. 📦 GET - List All Extra Food Items
**Endpoint:** `GET /api/extra-food`

**Authorization:** Required (ADMIN + STUDENT)

**Headers:**
```http
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

**Response (Success 200):**
```json
[
  {
    "_id": "507f1f77bcf86cd799439011",
    "name": "Samosa",
    "price": 15.00,
    "quantity": 50,
    "createdAt": "2024-01-15T10:30:00Z",
    "updatedAt": "2024-01-15T10:30:00Z"
  },
  {
    "_id": "507f1f77bcf86cd799439012",
    "name": "Pakora",
    "price": 20.00,
    "quantity": 30,
    "createdAt": "2024-01-15T10:31:00Z",
    "updatedAt": "2024-01-15T10:31:00Z"
  }
]
```

**Response (Empty 200):**
```json
[]
```

**Error Responses:**
- **401 Unauthorized:** Token missing or invalid
- **403 Forbidden:** User role doesn't have permission

**Frontend Implementation:**
```javascript
const token = localStorage.getItem("token");

const response = await axios.get(
  "http://localhost:8080/api/extra-food",
  {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }
);

const foods = response.data;
```

---

### 2. ➕ POST - Add New Extra Food Item
**Endpoint:** `POST /api/extra-food`

**Authorization:** Required (ADMIN only)

**Headers:**
```http
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Samosa",
  "price": 15.00,
  "quantity": 50
}
```

**Response (Success 201):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Samosa",
  "price": 15.00,
  "quantity": 50,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:30:00Z"
}
```

**Error Responses:**
- **400 Bad Request:** Invalid input (missing fields, negative price, etc.)
- **401 Unauthorized:** Token missing or invalid
- **403 Forbidden:** Only admins can add food items

**Validation Rules:**
- `name` - Required, non-empty string
- `price` - Required, must be > 0
- `quantity` - Required, must be >= 0

**Frontend Implementation:**
```javascript
const token = localStorage.getItem("token");

const response = await axios.post(
  "http://localhost:8080/api/extra-food",
  {
    name: "Samosa",
    price: 15.00,
    quantity: 50,
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }
);

console.log("Food added:", response.data);
```

---

### 3. ✏️ PUT - Update Extra Food Item
**Endpoint:** `PUT /api/extra-food/{id}`

**Authorization:** Required (ADMIN only)

**Parameters:**
- `id` (path): MongoDB ObjectId of the food item

**Headers:**
```http
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

**Request Body:**
```json
{
  "name": "Samosa",
  "price": 18.00,
  "quantity": 45
}
```

**Response (Success 200):**
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "Samosa",
  "price": 18.00,
  "quantity": 45,
  "createdAt": "2024-01-15T10:30:00Z",
  "updatedAt": "2024-01-15T10:32:00Z"
}
```

**Error Responses:**
- **400 Bad Request:** Invalid ID format or input
- **401 Unauthorized:** Token missing or invalid
- **403 Forbidden:** Only admins can update food items
- **404 Not Found:** Food item doesn't exist

**Frontend Implementation:**
```javascript
const token = localStorage.getItem("token");
const foodId = "507f1f77bcf86cd799439011";

const response = await axios.put(
  `http://localhost:8080/api/extra-food/${foodId}`,
  {
    name: "Samosa",
    price: 18.00,
    quantity: 45,
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }
);

console.log("Food updated:", response.data);
```

---

### 4. 🗑️ DELETE - Delete Extra Food Item
**Endpoint:** `DELETE /api/extra-food/{id}`

**Authorization:** Required (ADMIN only)

**Parameters:**
- `id` (path): MongoDB ObjectId of the food item

**Headers:**
```http
Authorization: Bearer {JWT_TOKEN}
Content-Type: application/json
```

**Response (Success 200):**
```json
{
  "message": "Extra food deleted successfully"
}
```

**Error Responses:**
- **400 Bad Request:** Invalid ID format
- **401 Unauthorized:** Token missing or invalid
- **403 Forbidden:** Only admins can delete food items
- **404 Not Found:** Food item doesn't exist

**Frontend Implementation:**
```javascript
const token = localStorage.getItem("token");
const foodId = "507f1f77bcf86cd799439011";

const response = await axios.delete(
  `http://localhost:8080/api/extra-food/${foodId}`,
  {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  }
);

console.log("Food deleted:", response.data);
```

---

## 🔐 Security Configuration

**SecurityConfig.java:**
```java
// Extra Food endpoints
.requestMatchers(HttpMethod.GET, "/api/extra-food").hasAnyRole("ADMIN", "STUDENT")
.requestMatchers(HttpMethod.POST, "/api/extra-food").hasRole("ADMIN")
.requestMatchers(HttpMethod.PUT, "/api/extra-food/**").hasRole("ADMIN")
.requestMatchers(HttpMethod.DELETE, "/api/extra-food/**").hasRole("ADMIN")
```

**Authorization Levels:**
| Method | Endpoint | STUDENT | ADMIN |
|--------|----------|---------|-------|
| GET | /api/extra-food | ✅ | ✅ |
| POST | /api/extra-food | ❌ | ✅ |
| PUT | /api/extra-food/{id} | ❌ | ✅ |
| DELETE | /api/extra-food/{id} | ❌ | ✅ |

---

## 🔑 JWT Token

**Token Format:**
```
Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

**How to Get Token:**
1. Call `POST /api/auth/login` with email and password
2. Response contains `token` field
3. Store in localStorage: `localStorage.setItem('token', token)`
4. Include in all subsequent requests

**How to Use Token:**
```javascript
const token = localStorage.getItem('token');

axios.get('http://localhost:8080/api/extra-food', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

---

## 🧪 Testing with cURL

### 1. Get All Food Items
```bash
curl -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:8080/api/extra-food
```

### 2. Add New Food Item
```bash
curl -X POST \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"name":"Samosa","price":15,"quantity":50}' \
     http://localhost:8080/api/extra-food
```

### 3. Update Food Item
```bash
curl -X PUT \
     -H "Authorization: Bearer YOUR_TOKEN" \
     -H "Content-Type: application/json" \
     -d '{"name":"Samosa","price":18,"quantity":45}' \
     http://localhost:8080/api/extra-food/507f1f77bcf86cd799439011
```

### 4. Delete Food Item
```bash
curl -X DELETE \
     -H "Authorization: Bearer YOUR_TOKEN" \
     http://localhost:8080/api/extra-food/507f1f77bcf86cd799439011
```

---

## 📊 Data Model

**ExtraFood MongoDB Document:**
```java
@Document(collection = "extraFood")
public class ExtraFood {
  @Id
  private ObjectId id;
  
  @Field("name")
  private String name;
  
  @Field("price")
  private Double price;
  
  @Field("quantity")
  private Integer quantity;
  
  @CreatedDate
  private LocalDateTime createdAt;
  
  @LastModifiedDate
  private LocalDateTime updatedAt;
}
```

**Field Constraints:**
- `name` - Required, min 1 char, max 100 chars
- `price` - Required, > 0, up to 2 decimal places
- `quantity` - Required, >= 0, integer
- `id` - Auto-generated MongoDB ObjectId

---

## 🔗 Related Endpoints

- **Authentication:** `POST /api/auth/login`
- **Orders:** `POST /api/orders` (book food items)
- **Orders List:** `GET /api/orders`
- **Dashboard:** `GET /api/dashboard/summary`

---

## 📝 Common Error Messages

| Status | Message | Cause | Fix |
|--------|---------|-------|-----|
| 401 | Unauthorized | Token missing/invalid | Re-login |
| 403 | Access Denied | Role not authorized | Check role in SecurityConfig |
| 400 | Price must be > 0 | Invalid price value | Enter valid price |
| 400 | Name required | Empty name field | Enter food name |
| 404 | Food not found | ID doesn't exist | Check food ID |
| 500 | Internal Error | Backend error | Check backend logs |

---

## ✅ Verification Checklist

- [ ] Backend runs on `http://localhost:8080`
- [ ] JWT token is valid and not expired
- [ ] User role is ADMIN or STUDENT
- [ ] SecurityConfig authorizes the endpoint
- [ ] MongoDB has `extraFood` collection
- [ ] Token is in Authorization header
- [ ] Content-Type is `application/json`

