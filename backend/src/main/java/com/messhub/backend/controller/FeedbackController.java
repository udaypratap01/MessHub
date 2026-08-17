package com.messhub.backend.controller;

import com.messhub.backend.model.Feedback;
import com.messhub.backend.model.User;
import com.messhub.backend.repository.FeedbackRepository;
import com.messhub.backend.repository.UserRepository;
import com.messhub.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/feedback")
public class FeedbackController {

    @Autowired
    private FeedbackRepository feedbackRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    // 📨 POST - Submit feedback (STUDENT only)
    @PostMapping
    public ResponseEntity<?> submitFeedback(
            @RequestHeader("Authorization") String authHeader,
            @RequestBody Map<String, Object> request) {

        try {
            System.out.println("📨 Submitting feedback...");

            // Validate Authorization header
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                System.out.println("❌ Invalid Authorization header");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Missing or invalid Authorization header"));
            }

            // Extract token
            String token = authHeader.substring(7);
            if (!jwtUtil.validateToken(token)) {
                System.out.println("❌ Invalid JWT token");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Invalid or expired JWT token"));
            }

            // Extract user email from JWT
            String userEmail = jwtUtil.extractUsername(token);
            System.out.println("👤 User Email: " + userEmail);

            // Fetch user from database
            User user = userRepository.findByEmailIgnoreCase(userEmail).orElse(null);
            if (user == null) {
                System.out.println("❌ User not found: " + userEmail);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "User not found"));
            }

            // 🔍 DEBUG: Print user role
            String userRole = user.getRole();
            System.out.println("🔍 DEBUG - User role from DB: '" + userRole + "' (type: " + (userRole != null ? userRole.getClass().getSimpleName() : "NULL") + ")");
            
            // Verify user is STUDENT (case-insensitive)
            if (userRole == null || !"STUDENT".equalsIgnoreCase(userRole.trim())) {
                System.out.println("❌ Only students can submit feedback");
                System.out.println("   User role: '" + userRole + "'");
                System.out.println("   Expected: 'STUDENT'");
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "Only students can submit feedback"));
            }
            
            System.out.println("✅ User is STUDENT - Proceeding with feedback submission");

            // Validate category
            String category = (String) request.get("category");
            if (category == null || category.trim().isEmpty()) {
                System.out.println("❌ Category is required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Category is required"));
            }

            // Validate rating
            Object ratingObj = request.get("rating");
            if (ratingObj == null) {
                System.out.println("❌ Rating is required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Rating is required"));
            }

            int rating;
            try {
                rating = ((Number) ratingObj).intValue();
            } catch (Exception e) {
                System.out.println("❌ Invalid rating format");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Rating must be a number"));
            }

            if (rating < 1 || rating > 5) {
                System.out.println("❌ Rating must be between 1 and 5");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Rating must be between 1 and 5"));
            }

            // Validate message
            String message = (String) request.get("message");
            if (message == null || message.trim().isEmpty()) {
                System.out.println("❌ Message is required");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Message is required"));
            }

            if (message.length() > 500) {
                System.out.println("❌ Message too long");
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                        .body(Map.of("message", "Message must be 500 characters or less"));
            }

            // Create and save feedback
            Feedback feedback = new Feedback(
                    user.getName(),
                    user.getEmail(),
                    category,
                    rating,
                    message
            );

            Feedback savedFeedback = feedbackRepository.save(feedback);
            System.out.println("✅ Feedback saved: " + savedFeedback.getId());

            return ResponseEntity.status(HttpStatus.CREATED)
                    .body(Map.of(
                            "message", "Feedback submitted successfully",
                            "data", savedFeedback
                    ));

        } catch (Exception e) {
            System.out.println("❌ Error submitting feedback: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error submitting feedback: " + e.getMessage()));
        }
    }

    // 📖 GET - View own feedback (STUDENT only)
    @GetMapping("/my")
    public ResponseEntity<?> getMyFeedback(
            @RequestHeader("Authorization") String authHeader) {

        try {
            System.out.println("📖 Fetching user's feedback...");

            // Validate Authorization header
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                System.out.println("❌ Invalid Authorization header");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Missing or invalid Authorization header"));
            }

            // Extract token
            String token = authHeader.substring(7);
            if (!jwtUtil.validateToken(token)) {
                System.out.println("❌ Invalid JWT token");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Invalid or expired JWT token"));
            }

            // Extract user email from JWT
            String userEmail = jwtUtil.extractUsername(token);
            System.out.println("👤 User Email: " + userEmail);

            // Fetch user from database
            User user = userRepository.findByEmailIgnoreCase(userEmail).orElse(null);
            if (user == null) {
                System.out.println("❌ User not found: " + userEmail);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "User not found"));
            }

            // Get user's feedback (latest first)
            List<Feedback> userFeedback = feedbackRepository.findByUserEmailOrderByCreatedAtDesc(userEmail);
            System.out.println("✅ Found " + userFeedback.size() + " feedback entries");

            return ResponseEntity.ok(Map.of(
                    "message", "User feedback retrieved successfully",
                    "count", userFeedback.size(),
                    "data", userFeedback
            ));

        } catch (Exception e) {
            System.out.println("❌ Error fetching feedback: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error fetching feedback: " + e.getMessage()));
        }
    }

    // 📊 GET - View all feedback (ADMIN only)
    @GetMapping("/all")
    public ResponseEntity<?> getAllFeedback(
            @RequestHeader("Authorization") String authHeader) {

        try {
            System.out.println("📊 Fetching all feedback...");

            // Validate Authorization header
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                System.out.println("❌ Invalid Authorization header");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Missing or invalid Authorization header"));
            }

            // Extract token
            String token = authHeader.substring(7);
            if (!jwtUtil.validateToken(token)) {
                System.out.println("❌ Invalid JWT token");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("message", "Invalid or expired JWT token"));
            }

            // Extract admin email from JWT
            String adminEmail = jwtUtil.extractUsername(token);
            System.out.println("👤 Admin Email: " + adminEmail);

            // Fetch admin user from database
            User admin = userRepository.findByEmailIgnoreCase(adminEmail).orElse(null);
            if (admin == null) {
                System.out.println("❌ Admin not found: " + adminEmail);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Admin not found"));
            }

            // 🔍 DEBUG: Print admin role
            String adminRole = admin.getRole();
            System.out.println("🔍 DEBUG - Admin role from DB: '" + adminRole + "' (type: " + (adminRole != null ? adminRole.getClass().getSimpleName() : "NULL") + ")");
            
            // Verify admin role (case-insensitive)
            if (adminRole == null || !"ADMIN".equalsIgnoreCase(adminRole.trim())) {
                System.out.println("❌ Permission denied - Not an admin");
                System.out.println("   User role: '" + adminRole + "'");
                System.out.println("   Expected: 'ADMIN'");
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("message", "Permission denied - Admin access required"));
            }
            
            System.out.println("✅ User is ADMIN - Proceeding with feedback retrieval");

            // Get all feedback (latest first)
            List<Feedback> allFeedback = feedbackRepository.findAllByOrderByCreatedAtDesc();
            System.out.println("✅ Found " + allFeedback.size() + " total feedback entries");

            return ResponseEntity.ok(Map.of(
                    "message", "All feedback retrieved successfully",
                    "count", allFeedback.size(),
                    "data", allFeedback
            ));

        } catch (Exception e) {
            System.out.println("❌ Error fetching all feedback: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error fetching feedback: " + e.getMessage()));
        }
    }
}
