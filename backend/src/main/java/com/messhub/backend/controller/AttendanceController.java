package com.messhub.backend.controller;

import com.messhub.backend.model.Attendance;
import com.messhub.backend.model.User;
import com.messhub.backend.repository.AttendanceRepository;
import com.messhub.backend.repository.UserRepository;
import com.messhub.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeFormatter;
import java.util.*;

/**
 * AttendanceController - REST API controller for Attendance operations
 * Manages student meal attendance (BREAKFAST/LUNCH/DINNER) with role-based access
 * 
 * Student Endpoints:
 * - POST /api/attendance → Mark attendance for a meal
 * - GET /api/attendance/my → View own attendance
 * 
 * Admin Endpoints:
 * - GET /api/attendance/all → View all students attendance
 * 
 * Security: All endpoints require valid JWT token
 */
@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

	@Autowired
	private AttendanceRepository attendanceRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private JwtUtil jwtUtil;

	/**
	 * Mark attendance for a student meal
	 * POST /api/attendance
	 * 🔐 Only STUDENT can access
	 * 
	 * Request body:
	 * {
	 *   "mealType": "BREAKFAST" / "LUNCH" / "DINNER"
	 * }
	 * 
	 * Rules:
	 * - One attendance per meal per day
	 * - Status auto-set to "PRESENT"
	 * - Date auto-set to today
	 * - Prevents duplicate entries
	 * 
	 * @param attendanceRequest Map containing mealType
	 * @param authHeader JWT token in Authorization header
	 * @return Saved attendance record with HTTP 201 CREATED
	 */
	@PostMapping
	public ResponseEntity<?> markAttendance(
			@RequestBody Map<String, String> attendanceRequest,
			@RequestHeader(value = "Authorization", required = false) String authHeader) {

		System.out.println("\n=== ATTENDANCE MARK REQUEST ===");

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
			System.out.println("❌ ERROR: Invalid authorization header format");
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(Map.of("message", "Invalid authorization header format"));
		}

		if (!jwtUtil.validateToken(token)) {
			System.out.println("❌ ERROR: Invalid or expired token");
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(Map.of("message", "Invalid or expired token"));
		}

		// ✅ Step 2: Extract user email from JWT token
		String userEmail = jwtUtil.extractUsername(token);
		if (userEmail == null || userEmail.trim().isEmpty()) {
			System.out.println("❌ ERROR: Could not extract email from token");
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(Map.of("message", "Could not extract email from token"));
		}
		System.out.println("✅ User Email Extracted: " + userEmail);

		// ✅ Step 3: Find user and get user name
		Optional<User> userOptional = userRepository.findByEmailIgnoreCase(userEmail);
		if (userOptional.isEmpty()) {
			System.out.println("❌ ERROR: User not found");
			return ResponseEntity.status(HttpStatus.NOT_FOUND)
					.body(Map.of("message", "User not found"));
		}

		User user = userOptional.get();
		System.out.println("✅ User Found: " + user.getName());

		// ✅ Step 4: Extract and validate mealType
		String mealType = attendanceRequest.get("mealType");
		if (mealType == null || mealType.trim().isEmpty()) {
			System.out.println("❌ ERROR: Meal type is required");
			return ResponseEntity.badRequest()
					.body(Map.of("message", "Meal type (BREAKFAST/LUNCH/DINNER) is required"));
		}

		mealType = mealType.toUpperCase();
		if (!mealType.equals("BREAKFAST") && !mealType.equals("LUNCH") && !mealType.equals("DINNER")) {
			System.out.println("❌ ERROR: Invalid meal type");
			return ResponseEntity.badRequest()
					.body(Map.of("message", "Meal type must be BREAKFAST, LUNCH, or DINNER"));
		}
		System.out.println("✅ Meal Type: " + mealType);

		// ✅ Step 5: Get today's date in YYYY-MM-DD format
		String today = LocalDate.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd"));
		System.out.println("✅ Today's Date: " + today);

		// ✅ Step 6: Check for duplicate attendance (prevent same meal same day)
		Optional<Attendance> existingAttendance = 
			attendanceRepository.findByUserEmailAndDateAndMealType(userEmail, today, mealType);

		if (existingAttendance.isPresent()) {
			System.out.println("❌ ERROR: Attendance already marked for " + mealType + " today");
			return ResponseEntity.badRequest()
					.body(Map.of(
						"message", "Attendance already marked for " + mealType + " today",
						"alreadyMarked", true,
						"mealType", mealType,
						"date", today
					));
		}

		// ✅ Step 7: Create and save attendance record
		Attendance attendance = new Attendance(
			userEmail,
			user.getName(),
			today,
			mealType,
			"PRESENT"
		);

		Attendance savedAttendance = attendanceRepository.save(attendance);
		System.out.println("✅ Attendance Marked: " + savedAttendance.getId());

		Map<String, Object> response = new HashMap<>();
		response.put("message", mealType + " attendance marked as PRESENT");
		response.put("attendance", savedAttendance);
		return ResponseEntity.status(HttpStatus.CREATED).body(response);
	}

	/**
	 * Get own attendance records
	 * GET /api/attendance/my
	 * 🔐 Only STUDENT can access
	 * 
	 * @param authHeader JWT token in Authorization header
	 * @return List of student's attendance records
	 */
	@GetMapping("/my")
	public ResponseEntity<?> getMyAttendance(
			@RequestHeader(value = "Authorization", required = false) String authHeader) {

		System.out.println("\n=== ATTENDANCE VIEW (STUDENT) REQUEST ===");

		// ✅ Validate JWT token
		if (authHeader == null || authHeader.trim().isEmpty()) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(Map.of("message", "Authorization header is missing"));
		}

		String token = null;
		if (authHeader.startsWith("Bearer ")) {
			token = authHeader.substring(7);
		} else {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(Map.of("message", "Invalid authorization header format"));
		}

		if (!jwtUtil.validateToken(token)) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(Map.of("message", "Invalid or expired token"));
		}

		// ✅ Extract user email
		String userEmail = jwtUtil.extractUsername(token);
		System.out.println("✅ User Email: " + userEmail);

		// ✅ Get student's attendance records
		List<Attendance> attendanceList = attendanceRepository.findByUserEmail(userEmail);
		System.out.println("✅ Found " + attendanceList.size() + " attendance records");

		Map<String, Object> response = new HashMap<>();
		response.put("message", "Your attendance records");
		response.put("email", userEmail);
		response.put("count", attendanceList.size());
		response.put("attendances", attendanceList);
		return ResponseEntity.ok(response);
	}

	/**
	 * Get all attendance records (Admin only)
	 * GET /api/attendance/all
	 * 🔐 Only ADMIN can access
	 * 
	 * @param authHeader JWT token in Authorization header
	 * @return List of all attendance records
	 */
	@GetMapping("/all")
	public ResponseEntity<?> getAllAttendance(
			@RequestHeader(value = "Authorization", required = false) String authHeader) {

		System.out.println("\n=== ATTENDANCE VIEW ALL (ADMIN) REQUEST ===");

		// ✅ Validate JWT token
		if (authHeader == null || authHeader.trim().isEmpty()) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(Map.of("message", "Authorization header is missing"));
		}

		String token = null;
		if (authHeader.startsWith("Bearer ")) {
			token = authHeader.substring(7);
		} else {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(Map.of("message", "Invalid authorization header format"));
		}

		if (!jwtUtil.validateToken(token)) {
			return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
					.body(Map.of("message", "Invalid or expired token"));
		}

		// ✅ Extract user email and verify admin role
		String userEmail = jwtUtil.extractUsername(token);
		System.out.println("✅ Admin Email: " + userEmail);

		Optional<User> adminOptional = userRepository.findByEmailIgnoreCase(userEmail);
		if (adminOptional.isEmpty()) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND)
					.body(Map.of("message", "Admin user not found"));
		}

		User admin = adminOptional.get();
		if (!"ADMIN".equalsIgnoreCase(admin.getRole())) {
			System.out.println("❌ ERROR: User is not ADMIN");
			return ResponseEntity.status(HttpStatus.FORBIDDEN)
					.body(Map.of("message", "Only ADMIN can access all attendance records"));
		}

		// ✅ Get all attendance records
		List<Attendance> allAttendances = attendanceRepository.findAll();
		System.out.println("✅ Found " + allAttendances.size() + " total attendance records");

		Map<String, Object> response = new HashMap<>();
		response.put("message", "All attendance records (ADMIN view)");
		response.put("count", allAttendances.size());
		response.put("attendances", allAttendances);
		return ResponseEntity.ok(response);
	}
}
