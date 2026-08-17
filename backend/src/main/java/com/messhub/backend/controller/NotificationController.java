package com.messhub.backend.controller;

import com.messhub.backend.model.Notification;
import com.messhub.backend.model.User;
import com.messhub.backend.repository.NotificationRepository;
import com.messhub.backend.repository.UserRepository;
import com.messhub.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.*;

/**
 * NotificationController - REST API controller for Notification operations
 * Manages system announcements with role-based access
 * 
 * Admin Endpoints:
 * - POST /api/notifications → Create announcement
 * 
 * All Users Endpoints:
 * - GET /api/notifications → Get all notifications
 * 
 * Security: All endpoints require valid JWT token
 */
@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

	@Autowired
	private NotificationRepository notificationRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private JwtUtil jwtUtil;

	/**
	 * Create a new notification (announcement)
	 * POST /api/notifications
	 * 🔐 Only ADMIN can access
	 * 
	 * Request body:
	 * {
	 *   "title": "Announcement Title",
	 *   "message": "Announcement message content"
	 * }
	 * 
	 * Rules:
	 * - Admin email extracted from JWT token
	 * - Current timestamp automatically set
	 * - Admin name fetched from database
	 * 
	 * @param notificationRequest Map containing title and message
	 * @param authHeader JWT token in Authorization header
	 * @return Created notification with HTTP 201 CREATED
	 */
	@PostMapping
	public ResponseEntity<?> createNotification(
			@RequestBody Map<String, String> notificationRequest,
			@RequestHeader(value = "Authorization", required = false) String authHeader) {

		System.out.println("\n=== NOTIFICATION CREATE REQUEST ===");

		// ✅ Step 1: Validate JWT token
		if (authHeader == null || authHeader.trim().isEmpty()) {
			System.out.println("❌ ERROR: Authorization header is missing");
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(Map.of("message", "Authorization header is missing"));
		}

		String token = null;
		if (authHeader.startsWith("Bearer ")) {
			token = authHeader.substring(7);
		} else {
			System.out.println("❌ ERROR: Invalid Authorization header format");
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(Map.of("message", "Invalid Authorization header format"));
		}

		// ✅ Step 2: Extract email from JWT
		String adminEmail = null;
		try {
			adminEmail = jwtUtil.extractUsername(token);
			System.out.println("✅ Token verified for email: " + adminEmail);
		} catch (Exception e) {
			System.out.println("❌ ERROR: Invalid JWT token - " + e.getMessage());
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(Map.of("message", "Invalid JWT token"));
		}

		// ✅ Step 3: Verify user exists and get details
		Optional<User> adminUser = userRepository.findByEmailIgnoreCase(adminEmail);
		if (adminUser.isEmpty()) {
			System.out.println("❌ ERROR: Admin user not found with email: " + adminEmail);
			return ResponseEntity.status(HttpStatus.NOT_FOUND)
					.body(Map.of("message", "Admin user not found"));
		}

		User admin = adminUser.get();

		// ✅ Step 4: Verify user is ADMIN
		if (admin.getRole() == null || !admin.getRole().equals("ADMIN")) {
			System.out.println("❌ ERROR: User is not an admin. Role: " + admin.getRole());
			return ResponseEntity.status(HttpStatus.FORBIDDEN)
					.body(Map.of("message", "Only admins can create notifications"));
		}

		// ✅ Step 5: Validate request body
		String title = notificationRequest.get("title");
		String message = notificationRequest.get("message");

		if (title == null || title.trim().isEmpty()) {
			System.out.println("❌ ERROR: Title is required");
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body(Map.of("message", "Title is required"));
		}

		if (message == null || message.trim().isEmpty()) {
			System.out.println("❌ ERROR: Message is required");
			return ResponseEntity.status(HttpStatus.BAD_REQUEST)
					.body(Map.of("message", "Message is required"));
		}

		// ✅ Step 6: Create and save notification
		try {
			Notification notification = new Notification(
					title.trim(),
					message.trim(),
					adminEmail,
					admin.getName()
			);

			Notification savedNotification = notificationRepository.save(notification);

			System.out.println("✅ Notification created successfully!");
			System.out.println("   ID: " + savedNotification.getId());
			System.out.println("   Title: " + savedNotification.getTitle());
			System.out.println("   Created by: " + savedNotification.getCreatedByName());
			System.out.println("   Timestamp: " + savedNotification.getCreatedAt());

			return ResponseEntity.status(HttpStatus.CREATED)
					.body(Map.of(
							"message", "Notification created successfully",
							"data", savedNotification
					));

		} catch (Exception e) {
			System.out.println("❌ ERROR: Failed to create notification - " + e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("message", "Failed to create notification"));
		}
	}

	/**
	 * Get all notifications (latest first)
	 * GET /api/notifications
	 * 🔐 ADMIN and STUDENT can access
	 * 
	 * Returns all notifications sorted by creation date (newest first)
	 * No pagination needed for now
	 * 
	 * @param authHeader JWT token in Authorization header
	 * @return List of all notifications with HTTP 200 OK
	 */
	@GetMapping
	public ResponseEntity<?> getAllNotifications(
			@RequestHeader(value = "Authorization", required = false) String authHeader) {

		System.out.println("\n=== NOTIFICATIONS FETCH REQUEST ===");

		// ✅ Step 1: Validate JWT token
		if (authHeader == null || authHeader.trim().isEmpty()) {
			System.out.println("❌ ERROR: Authorization header is missing");
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(Map.of("message", "Authorization header is missing"));
		}

		String token = null;
		if (authHeader.startsWith("Bearer ")) {
			token = authHeader.substring(7);
		} else {
			System.out.println("❌ ERROR: Invalid Authorization header format");
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(Map.of("message", "Invalid Authorization header format"));
		}

		// ✅ Step 2: Extract email from JWT
		String userEmail = null;
		try {
			userEmail = jwtUtil.extractUsername(token);
			System.out.println("✅ Token verified for email: " + userEmail);
		} catch (Exception e) {
			System.out.println("❌ ERROR: Invalid JWT token - " + e.getMessage());
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(Map.of("message", "Invalid JWT token"));
		}

		// ✅ Step 3: Verify user exists
		Optional<User> user = userRepository.findByEmailIgnoreCase(userEmail);
		if (user.isEmpty()) {
			System.out.println("❌ ERROR: User not found with email: " + userEmail);
			return ResponseEntity.status(HttpStatus.NOT_FOUND)
					.body(Map.of("message", "User not found"));
		}

		// ✅ Step 4: Fetch all notifications (latest first)
		try {
			List<Notification> notifications = notificationRepository.findAllByOrderByCreatedAtDesc();

			System.out.println("✅ Fetched " + notifications.size() + " notifications");

			return ResponseEntity.status(HttpStatus.OK)
					.body(Map.of(
							"message", "Notifications retrieved successfully",
							"count", notifications.size(),
							"data", notifications
					));

		} catch (Exception e) {
			System.out.println("❌ ERROR: Failed to fetch notifications - " + e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("message", "Failed to fetch notifications"));
		}
	}

	/**
	 * Get notifications created by a specific admin
	 * GET /api/notifications/by/:email
	 * 🔐 ADMIN only (can view own notifications)
	 * 
	 * @param adminEmail The email of the admin
	 * @param authHeader JWT token in Authorization header
	 * @return List of notifications created by the admin with HTTP 200 OK
	 */
	@GetMapping("/by/{email}")
	public ResponseEntity<?> getNotificationsByAdmin(
			@PathVariable String email,
			@RequestHeader(value = "Authorization", required = false) String authHeader) {

		System.out.println("\n=== NOTIFICATIONS BY ADMIN FETCH REQUEST ===");

		// ✅ Step 1: Validate JWT token
		if (authHeader == null || authHeader.trim().isEmpty()) {
			System.out.println("❌ ERROR: Authorization header is missing");
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(Map.of("message", "Authorization header is missing"));
		}

		String token = null;
		if (authHeader.startsWith("Bearer ")) {
			token = authHeader.substring(7);
		} else {
			System.out.println("❌ ERROR: Invalid Authorization header format");
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(Map.of("message", "Invalid Authorization header format"));
		}

		// ✅ Step 2: Extract email from JWT
		String currentUserEmail = null;
		try {
			currentUserEmail = jwtUtil.extractUsername(token);
			System.out.println("✅ Token verified for email: " + currentUserEmail);
		} catch (Exception e) {
			System.out.println("❌ ERROR: Invalid JWT token - " + e.getMessage());
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(Map.of("message", "Invalid JWT token"));
		}

		// ✅ Step 3: Verify current user is ADMIN
		Optional<User> currentUser = userRepository.findByEmailIgnoreCase(currentUserEmail);
		if (currentUser.isEmpty() || !currentUser.get().getRole().equals("ADMIN")) {
			System.out.println("❌ ERROR: User is not an admin");
			return ResponseEntity.status(HttpStatus.FORBIDDEN)
					.body(Map.of("message", "Only admins can view admin notifications"));
		}

		// ✅ Step 4: Fetch notifications by admin email
		try {
			List<Notification> notifications = notificationRepository.findByCreatedByOrderByCreatedAtDesc(email);

			System.out.println("✅ Fetched " + notifications.size() + " notifications by admin: " + email);

			return ResponseEntity.status(HttpStatus.OK)
					.body(Map.of(
							"message", "Admin notifications retrieved successfully",
							"count", notifications.size(),
							"data", notifications
					));

		} catch (Exception e) {
			System.out.println("❌ ERROR: Failed to fetch admin notifications - " + e.getMessage());
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
					.body(Map.of("message", "Failed to fetch notifications"));
		}
	}
}
