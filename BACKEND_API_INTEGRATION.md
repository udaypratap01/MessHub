# 🔗 Backend API Integration Guide

## Overview
The Admin Dashboard now fetches **real data** from the backend API instead of using hardcoded values. This guide explains the required API endpoints and data formats.

---

## 🎯 Current API Implementation

### Dashboard Summary Endpoint
**Endpoint:** `GET /api/admin/dashboard`  
**Authentication:** Required (Bearer Token)  
**Timeout:** 10 seconds  
**Fallback:** Uses mock data if unavailable

---

## 📊 Required API Response Format

### Success Response (200 OK)
```json
{
  "totalStudents": 245,
  "totalOrders": 1840,
  "foodPrepared": 589,
  "foodWaste": 42,
  "revenueThisMonth": 45230,
  "revenuePercentage": 75,
  "attendanceRate": 92.5,
  "avgRating": 4.5,
  "recentOrders": [
    {
      "id": 1,
      "student": "Rajesh Kumar",
      "items": "Paneer Pizza, Coke",
      "amount": "₹280",
      "status": "Delivered",
      "time": "2 mins ago"
    },
    {
      "id": 2,
      "student": "Priya Singh",
      "items": "Samosa, Chai",
      "amount": "₹45",
      "status": "Preparing",
      "time": "5 mins ago"
    }
  ],
  "topItems": [
    {
      "name": "Paneer Pizza",
      "sales": 156,
      "revenue": "₹4,680"
    },
    {
      "name": "Biryani",
      "sales": 142,
      "revenue": "₹3,120"
    }
  ]
}
```

---

## 🔌 Data Field Descriptions

### Key Metrics
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `totalStudents` | Number | Total registered students | 245 |
| `totalOrders` | Number | Total orders placed | 1840 |
| `foodPrepared` | Number | Items prepared today | 589 |
| `foodWaste` | Number | Food waste in kg | 42 |

### Secondary Metrics
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `revenueThisMonth` | Number | Total revenue (in rupees) | 45230 |
| `revenuePercentage` | Number | % of monthly target (0-100) | 75 |
| `attendanceRate` | Number | Attendance percentage (0-100) | 92.5 |
| `avgRating` | Number | Average rating (0-5) | 4.5 |

### Recent Orders
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `id` | Number | Order ID | 1 |
| `student` | String | Student name | "Rajesh Kumar" |
| `items` | String | Ordered items | "Paneer Pizza, Coke" |
| `amount` | String | Order amount (with currency) | "₹280" |
| `status` | String | Order status | "Delivered", "Preparing", "Pending" |
| `time` | String | Time elapsed | "2 mins ago" |

### Top Items
| Field | Type | Description | Example |
|-------|------|-------------|---------|
| `name` | String | Item name | "Paneer Pizza" |
| `sales` | Number | Number of sales | 156 |
| `revenue` | String | Revenue (with currency) | "₹4,680" |

---

## 🔐 Authentication Header

All API requests include the Bearer token:
```javascript
headers: {
  Authorization: `Bearer ${localStorage.getItem('token')}`,
  'Content-Type': 'application/json'
}
```

**Token Storage:** The token is stored in `localStorage` after successful login.

---

## 📝 Spring Boot Backend Implementation Example

### Create Dashboard DTO
```java
@Data
@Builder
public class DashboardSummaryDTO {
    private Integer totalStudents;
    private Integer totalOrders;
    private Integer foodPrepared;
    private Integer foodWaste;
    private Double revenueThisMonth;
    private Integer revenuePercentage;
    private Double attendanceRate;
    private Double avgRating;
    private List<OrderDTO> recentOrders;
    private List<ItemDTO> topItems;
}
```

### Create Controller Endpoint
```java
@RestController
@RequestMapping("/api/admin")
@CrossOrigin(origins = "http://localhost:3000")
public class AdminController {
    
    @Autowired
    private AdminService adminService;
    
    @GetMapping("/dashboard")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<DashboardSummaryDTO> getDashboard(
            @RequestHeader("Authorization") String token) {
        try {
            DashboardSummaryDTO dashboard = adminService.getDashboardSummary();
            return ResponseEntity.ok(dashboard);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }
}
```

### Create Service Implementation
```java
@Service
public class AdminService {
    
    @Autowired
    private StudentRepository studentRepository;
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private MenuItemRepository menuItemRepository;
    
    public DashboardSummaryDTO getDashboardSummary() {
        // Fetch real data from database
        Integer totalStudents = studentRepository.countByActive(true);
        Integer totalOrders = orderRepository.count();
        Integer foodPrepared = orderRepository.countByStatusAndDateToday("Completed");
        Integer foodWaste = calculateFoodWaste();
        
        Double revenue = orderRepository.sumRevenueThisMonth();
        Integer revenuePercentage = calculateRevenuePercentage(revenue);
        
        Double attendanceRate = calculateAttendanceRate();
        Double avgRating = calculateAverageRating();
        
        List<OrderDTO> recentOrders = getRecentOrders(4);
        List<ItemDTO> topItems = getTopSellingItems(4);
        
        return DashboardSummaryDTO.builder()
                .totalStudents(totalStudents)
                .totalOrders(totalOrders)
                .foodPrepared(foodPrepared)
                .foodWaste(foodWaste)
                .revenueThisMonth(revenue)
                .revenuePercentage(revenuePercentage)
                .attendanceRate(attendanceRate)
                .avgRating(avgRating)
                .recentOrders(recentOrders)
                .topItems(topItems)
                .build();
    }
    
    private List<OrderDTO> getRecentOrders(int limit) {
        return orderRepository.findTop4ByOrderByCreatedAtDesc()
                .stream()
                .map(order -> new OrderDTO(
                    order.getId(),
                    order.getStudent().getName(),
                    order.getItems(),
                    "₹" + order.getAmount(),
                    order.getStatus(),
                    getTimeAgo(order.getCreatedAt())
                ))
                .collect(Collectors.toList());
    }
}
```

---

## 🧪 Testing the API

### Using cURL
```bash
curl -X GET http://localhost:8080/api/admin/dashboard \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json"
```

### Using Postman
1. Open Postman
2. Create new GET request to `http://localhost:8080/api/admin/dashboard`
3. Add header: `Authorization: Bearer YOUR_TOKEN`
4. Send request
5. Verify response matches the format above

---

## ⚠️ Error Handling

### Network Error
If the backend is unavailable:
- Dashboard shows **error banner** with warning
- Falls back to **mock data** automatically
- No crash or blank screen
- User can still see the dashboard

### Error Banner Message
```
⚠️ Error message displayed
Using fallback data. Please ensure the backend server is running.
```

### Common Errors

| Error | Cause | Solution |
|-------|-------|----------|
| 401 Unauthorized | Invalid/missing token | Check token in localStorage |
| 403 Forbidden | User is not ADMIN | Verify user role in backend |
| 500 Server Error | Backend error | Check backend logs |
| Timeout | Backend too slow | Increase timeout or optimize queries |

---

## 🔄 Refresh Data

The dashboard automatically fetches data on page load. To manually refresh:

```javascript
// Add a refresh button in the dashboard header
const handleRefresh = async () => {
  setLoading(true);
  // Data will be fetched again by useEffect
  window.location.reload();
};
```

---

## 🚀 Production Checklist

- [ ] Backend API endpoint `/api/admin/dashboard` implemented
- [ ] All fields returned in correct format
- [ ] Authentication token validation working
- [ ] CORS configured for frontend domain
- [ ] Database queries optimized
- [ ] Error handling implemented
- [ ] Response time < 2 seconds
- [ ] Data updates in real-time (optional)
- [ ] Tested with Postman/cURL
- [ ] Frontend builds without errors

---

## 📱 API Response Time Optimization

For best performance:
- Database queries should complete in < 500ms
- Total API response time < 2 seconds
- Consider caching if data doesn't change frequently
- Use database indexes for common queries

### Example Indexes for Orders Table
```sql
CREATE INDEX idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_student_id ON orders(student_id);
```

---

## 🔗 Additional Endpoints (Future)

Once dashboard is working, consider adding:

```
GET /api/admin/orders          - All orders with pagination
GET /api/admin/orders/:id      - Order details
GET /api/admin/students        - All students
GET /api/admin/menu            - Menu management
GET /api/admin/feedback        - Customer feedback
GET /api/admin/analytics       - Advanced analytics
```

---

## 💡 Tips

1. **Token Management**: Store token securely, refresh before expiry
2. **Error Logging**: Log API errors to help debug issues
3. **Data Validation**: Validate API response before using
4. **Caching**: Cache dashboard data for 1-5 minutes to reduce load
5. **WebSocket**: Use WebSocket for real-time data updates
6. **Pagination**: Use pagination for large datasets

---

**Status:** ✅ Ready for Backend Implementation  
**Last Updated:** April 17, 2026  
**Version:** 1.0
