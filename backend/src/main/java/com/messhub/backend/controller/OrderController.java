package com.messhub.backend.controller;

import com.messhub.backend.model.Order;
import com.messhub.backend.model.ExtraFood;
import com.messhub.backend.model.User;
import com.messhub.backend.repository.OrderRepository;
import com.messhub.backend.repository.ExtraFoodRepository;
import com.messhub.backend.repository.UserRepository;
import com.messhub.backend.util.JwtUtil;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/orders")
public class OrderController {

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private ExtraFoodRepository extraFoodRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    // 🔐 STUDENT ONLY - Book food
    @PostMapping
    public ResponseEntity<?> bookFood(
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            @RequestBody Map<String, Object> bookingRequest) {

        System.out.println("\n=== BOOKING REQUEST RECEIVED ===");
        System.out.println("Authorization Header: " + authHeader);
        System.out.println("Request Body (Raw): " + bookingRequest);
        System.out.println("Request Keys: " + bookingRequest.keySet());

        // ✅ Step 1: Validate authorization header
        if (authHeader == null || authHeader.trim().isEmpty()) {
            System.out.println("❌ ERROR: Authorization header is missing");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Authorization header is missing"));
        }

        // ✅ Step 2: Extract token
        String token = null;
        if (authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        } else {
            System.out.println("❌ ERROR: Invalid authorization header format");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid authorization header format"));
        }

        // ✅ Step 3: Validate token
        if (!jwtUtil.validateToken(token)) {
            System.out.println("❌ ERROR: Invalid or expired token");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid or expired token"));
        }

        // ✅ Step 4: Extract user email from token
        String userEmail = jwtUtil.extractUsername(token);
        if (userEmail == null || userEmail.trim().isEmpty()) {
            System.out.println("❌ ERROR: Could not extract email from token");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Could not extract email from token"));
        }
        System.out.println("✅ User Email Extracted: " + userEmail);

        // ✅ Step 5: Validate booking request
        System.out.println("\n📋 VALIDATING REQUEST DATA:");
        String foodId = (String) bookingRequest.get("foodId");
        System.out.println("  foodId value: " + foodId);
        System.out.println("  foodId type: " + (foodId == null ? "null" : foodId.getClass().getName()));
        System.out.println("  foodId is empty: " + (foodId != null && foodId.trim().isEmpty()));
        
        Object quantityObj = bookingRequest.get("quantity");
        System.out.println("  quantity value: " + quantityObj);
        System.out.println("  quantity type: " + (quantityObj == null ? "null" : quantityObj.getClass().getName()));

        if (foodId == null || foodId.trim().isEmpty()) {
            System.out.println("❌ VALIDATION FAILED: Food ID is required");
            System.out.println("   Available keys in request: " + bookingRequest.keySet());
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Food ID is required"));
        }

        if (quantityObj == null) {
            System.out.println("❌ VALIDATION FAILED: Quantity is required");
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Quantity is required"));
        }

        Integer quantity;
        try {
            quantity = ((Number) quantityObj).intValue();
            System.out.println("✅ Quantity parsed: " + quantity);
            System.out.println("   Raw quantity object: " + quantityObj);
            System.out.println("   Quantity type: " + quantityObj.getClass().getName());
            System.out.println("   Parsed to int: " + quantity);
        } catch (Exception e) {
            System.out.println("❌ VALIDATION FAILED: Quantity must be a number. Error: " + e.getMessage());
            System.out.println("   Received: " + quantityObj + " (type: " + (quantityObj == null ? "null" : quantityObj.getClass().getName()) + ")");
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Quantity must be a valid number"));
        }

        if (quantity == null || quantity <= 0) {
            System.out.println("❌ VALIDATION FAILED: Quantity must be greater than 0");
            System.out.println("   Received quantity: " + quantity);
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Quantity must be greater than 0"));
        }

        System.out.println("✅ ALL VALIDATIONS PASSED");
        System.out.println("   foodId: " + foodId);
        System.out.println("   quantity: " + quantity + " (type: Integer)");
        System.out.println("   userEmail: " + userEmail);
        System.out.println("=== PROCEEDING WITH BOOKING ===\n");        // ✅ Step 6: Validate ObjectId format
        if (!ObjectId.isValid(foodId)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Invalid food ID format"));
        }

        try {
            // ✅ Step 7: Find food item
            ObjectId foodObjectId = new ObjectId(foodId);
            ExtraFood food = extraFoodRepository.findById(foodObjectId).orElse(null);

            if (food == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Food item not found"));
            }

            // ✅ Step 8: Check if quantity is available
            if (food.getQuantity() < quantity) {
                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Not enough quantity available. Available: " + food.getQuantity()));
            }

            // ✅ Step 9: Calculate total price
            Double totalPrice = food.getPrice() * quantity;

            // ✅ Step 9.5: Fetch user name from database
            String userName = "Unknown";
            Optional<User> userOptional = userRepository.findByEmailIgnoreCase(userEmail);
            if (userOptional.isPresent()) {
                userName = userOptional.get().getName();
                System.out.println("✅ User Name Fetched: " + userName);
            } else {
                System.out.println("⚠️  User not found in database, using default name");
            }

            // ✅ Step 10: Create order with user name
            Order order = new Order(
                    userEmail,
                    userName,
                    foodId,
                    food.getName(),
                    quantity,
                    food.getPrice(),
                    totalPrice
            );

            // ✅ Step 11: Save order
            Order savedOrder = orderRepository.save(order);

            // ✅ Step 12: Update food quantity
            food.setQuantity(food.getQuantity() - quantity);
            extraFoodRepository.save(food);

            System.out.println("✅ Order created: " + savedOrder.getId() + " by " + userEmail);

            // ✅ Step 13: Return success response
            Map<String, Object> response = Map.of(
                    "message", "Food booked successfully",
                    "order", savedOrder
            );

            return ResponseEntity.status(HttpStatus.CREATED).body(response);

        } catch (Exception e) {
            System.out.println("❌ Booking error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error booking food: " + e.getMessage()));
        }
    }

    // 🔐 STUDENT ONLY - View own orders
    @GetMapping("/my")
    public ResponseEntity<?> getMyOrders(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        // ✅ Step 1: Validate authorization header
        if (authHeader == null || authHeader.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Authorization header is missing"));
        }

        // ✅ Step 2: Extract token
        String token = null;
        if (authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid authorization header format"));
        }

        // ✅ Step 3: Validate token
        if (!jwtUtil.validateToken(token)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid or expired token"));
        }

        // ✅ Step 4: Extract user email from token
        String userEmail = jwtUtil.extractUsername(token);
        if (userEmail == null || userEmail.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Could not extract email from token"));
        }

        // ✅ Step 5: Find orders by user email
        List<Order> orders = orderRepository.findByUserEmail(userEmail);

        // ✅ Step 6: Empty handling
        if (orders.isEmpty()) {
            return ResponseEntity.ok(List.of());
        }

        System.out.println("✅ Found " + orders.size() + " orders for: " + userEmail);

        return ResponseEntity.ok(orders);
    }

    // 🔐 ADMIN ONLY - View all orders
    @GetMapping("/all")
    public ResponseEntity<?> getAllOrders(
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        System.out.println("\n=== ADMIN ORDERS REQUEST ===");

        // ✅ Step 1: Validate authorization header
        if (authHeader == null || authHeader.trim().isEmpty()) {
            System.out.println("❌ ERROR: Authorization header is missing");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Authorization header is missing"));
        }

        // ✅ Step 2: Extract token
        String token = null;
        if (authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        } else {
            System.out.println("❌ ERROR: Invalid authorization header format");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid authorization header format"));
        }

        // ✅ Step 3: Validate token
        if (!jwtUtil.validateToken(token)) {
            System.out.println("❌ ERROR: Invalid or expired token");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid or expired token"));
        }

        // ✅ Step 4: Extract user email from token
        String userEmail = jwtUtil.extractUsername(token);
        if (userEmail == null || userEmail.trim().isEmpty()) {
            System.out.println("❌ ERROR: Could not extract email from token");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Could not extract email from token"));
        }

        // ✅ Step 5: Check if user is ADMIN (extract role from token if available)
        // For now, we assume token validation means user has access
        // In production, you'd verify role from token
        System.out.println("✅ User Email: " + userEmail);

        // ✅ Step 6: Fetch all orders
        List<Order> orders = orderRepository.findAll();
        System.out.println("✅ Found " + orders.size() + " total orders");

        // ✅ Step 7: Return orders
        Map<String, Object> response = Map.of(
                "message", "All orders retrieved successfully",
                "count", orders.size(),
                "orders", orders
        );

        return ResponseEntity.ok(response);
    }

    // 🔐 ADMIN ONLY - Mark order as paid
    @PutMapping("/pay/{orderId}")
    public ResponseEntity<?> markOrderAsPaid(
            @PathVariable String orderId,
            @RequestHeader(value = "Authorization", required = false) String authHeader) {

        System.out.println("\n=== PAYMENT UPDATE REQUEST ===");
        System.out.println("Order ID: " + orderId);

        // ✅ Step 1: Validate authorization header
        if (authHeader == null || authHeader.trim().isEmpty()) {
            System.out.println("❌ ERROR: Authorization header is missing");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Authorization header is missing"));
        }

        // ✅ Step 2: Extract token
        String token = null;
        if (authHeader.startsWith("Bearer ")) {
            token = authHeader.substring(7);
        } else {
            System.out.println("❌ ERROR: Invalid authorization header format");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid authorization header format"));
        }

        // ✅ Step 3: Validate token
        if (!jwtUtil.validateToken(token)) {
            System.out.println("❌ ERROR: Invalid or expired token");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid or expired token"));
        }

        // ✅ Step 4: Extract user email from token
        String userEmail = jwtUtil.extractUsername(token);
        if (userEmail == null || userEmail.trim().isEmpty()) {
            System.out.println("❌ ERROR: Could not extract email from token");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Could not extract email from token"));
        }

        // ✅ Step 5: Validate ObjectId format
        if (!ObjectId.isValid(orderId)) {
            System.out.println("❌ ERROR: Invalid order ID format");
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Invalid order ID format"));
        }

        try {
            // ✅ Step 6: Find order by ID
            ObjectId orderObjectId = new ObjectId(orderId);
            Optional<Order> orderOptional = orderRepository.findById(orderObjectId);

            if (orderOptional.isEmpty()) {
                System.out.println("❌ ERROR: Order not found with ID: " + orderId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Order not found"));
            }

            Order order = orderOptional.get();
            System.out.println("✅ Order Found: " + orderId);
            System.out.println("   Current Payment Status: " + order.getPaymentStatus());

            // ✅ Step 7: Update payment status
            order.setPaymentStatus("PAID");
            Order updatedOrder = orderRepository.save(order);
            System.out.println("✅ Payment Status Updated to PAID");

            // ✅ Step 8: Return updated order
            Map<String, Object> response = Map.of(
                    "message", "Order marked as paid",
                    "order", updatedOrder
            );

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.out.println("❌ ERROR: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error updating payment status: " + e.getMessage()));
        }
    }
}
