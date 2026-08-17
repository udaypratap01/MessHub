package com.messhub.backend.controller;

import com.messhub.backend.model.Attendance;
import com.messhub.backend.model.Order;
import com.messhub.backend.model.User;
import com.messhub.backend.repository.AttendanceRepository;
import com.messhub.backend.repository.OrderRepository;
import com.messhub.backend.repository.UserRepository;
import com.messhub.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * DashboardController - REST API controller for Analytics and Dashboard operations
 * Provides endpoints for viewing food analytics and consumption statistics
 * 
 * Admin Endpoints:
 * - GET /api/dashboard/summary → Get food analytics summary
 * 
 * Security: All endpoints require valid JWT token and ADMIN role
 */
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private AttendanceRepository attendanceRepository;

	@Autowired
	private OrderRepository orderRepository;

	@Autowired
	private JwtUtil jwtUtil;

	/**
	 * Get dashboard summary with food analytics
	 * GET /api/dashboard/summary
	 * 🔐 Only ADMIN can access
	 * 
	 * Calculates:
	 * - Total students (STUDENT role users)
	 * - Total meals served (attendance records)
	 * - Food prepared (default estimate or from inventory)
	 * - Food consumed (attendance + extra food orders)
	 * - Food waste (prepared - consumed)
	 * 
	 * @param authHeader JWT token in Authorization header
	 * @return Dashboard summary with HTTP 200 OK
	 */
	@GetMapping("/summary")
	public ResponseEntity<?> getDashboardSummary(
			@RequestHeader(value = "Authorization", required = false) String authHeader) {

		try {
			// ✅ Validate token
			if (authHeader == null || !authHeader.startsWith("Bearer ")) {
				return new ResponseEntity<>(
					Map.of("message", "Authorization token required"),
					HttpStatus.UNAUTHORIZED);
			}

			String token = authHeader.substring(7);
			if (!jwtUtil.validateToken(token)) {
				return new ResponseEntity<>(
					Map.of("message", "Invalid or expired token"),
					HttpStatus.UNAUTHORIZED);
			}

			// ✅ Extract email and verify ADMIN role
			String userEmail = jwtUtil.extractUsername(token);
			if (userEmail == null || userEmail.isEmpty()) {
				return new ResponseEntity<>(
					Map.of("message", "Unable to extract user email from token"),
					HttpStatus.UNAUTHORIZED);
			}

			// ✅ Find user and check if ADMIN
			Optional<User> userOptional = userRepository.findAll()
					.stream()
					.filter(u -> u.getEmail().equalsIgnoreCase(userEmail))
					.findFirst();

			if (userOptional.isEmpty()) {
				return new ResponseEntity<>(
					Map.of("message", "User not found"),
					HttpStatus.NOT_FOUND);
			}

			User user = userOptional.get();
			if (!"ADMIN".equalsIgnoreCase(user.getRole())) {
				return new ResponseEntity<>(
					Map.of("message", "Only ADMIN can access dashboard"),
					HttpStatus.FORBIDDEN);
			}

			// 📊 Calculate analytics
			Map<String, Object> summary = calculateDashboardSummary();

			// ✅ Prepare response
			Map<String, Object> response = new HashMap<>();
			response.put("message", "Dashboard summary retrieved");
			response.put("timestamp", LocalDate.now());
			response.put("data", summary);

			System.out.println("✅ Dashboard summary retrieved by: " + userEmail);

			return new ResponseEntity<>(response, HttpStatus.OK);

		} catch (Exception e) {
			System.err.println("❌ Error fetching dashboard summary: " + e.getMessage());
			return new ResponseEntity<>(
				Map.of("message", "Error fetching dashboard summary: " + e.getMessage()),
				HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * Calculate dashboard analytics
	 * Private method to compute all metrics
	 * 
	 * @return Map containing all analytics metrics
	 */
	private Map<String, Object> calculateDashboardSummary() {
		Map<String, Object> summary = new HashMap<>();

		// 1️⃣ COUNT TOTAL STUDENTS (STUDENT role)
		List<User> allUsers = userRepository.findAll();
		long totalStudents = allUsers.stream()
				.filter(user -> "STUDENT".equalsIgnoreCase(user.getRole()))
				.count();

		// 2️⃣ COUNT TOTAL MEALS SERVED (attendance records)
		List<Attendance> allAttendances = attendanceRepository.findAll();
		long totalMealsServed = allAttendances.stream()
				.filter(attendance -> "PRESENT".equalsIgnoreCase(attendance.getStatus()))
				.count();

		// 3️⃣ CALCULATE FOOD PREPARED
		// Assumption: Each student gets 3 meals per day
		// Food prepared = total students * 3 meals * average daily preparation
		// For demo: We'll estimate based on students
		long foodPrepared = totalStudents * 3; // Simple estimate: 3 meals per student

		// Alternative: Get from menu items (if tracking quantity)
		// This would require a MenuItem table with quantity tracking
		// For now, using simple calculation

		// 4️⃣ CALCULATE FOOD CONSUMED
		// Food consumed = attendance count + extra food orders
		long extraFoodOrdered = 0;
		List<Order> allOrders = orderRepository.findAll();
		if (allOrders != null && !allOrders.isEmpty()) {
			extraFoodOrdered = allOrders.size(); // Count of extra food orders
		}

		long foodConsumed = totalMealsServed + extraFoodOrdered;

		// 5️⃣ CALCULATE FOOD WASTE
		long foodWaste = Math.max(0, foodPrepared - foodConsumed);

		// 6️⃣ CALCULATE WASTE PERCENTAGE
		double wastePercentage = foodPrepared > 0 ? 
				((double) foodWaste / foodPrepared) * 100 : 0;

		// 7️⃣ CALCULATE CONSUMPTION PERCENTAGE
		double consumptionPercentage = foodPrepared > 0 ? 
				((double) foodConsumed / foodPrepared) * 100 : 0;

		// ✅ Add metrics to summary
		summary.put("totalStudents", totalStudents);
		summary.put("totalMealsServed", totalMealsServed);
		summary.put("extraFoodOrders", extraFoodOrdered);
		summary.put("foodPrepared", foodPrepared);
		summary.put("foodConsumed", foodConsumed);
		summary.put("foodWaste", foodWaste);
		summary.put("wastePercentage", String.format("%.2f", wastePercentage));
		summary.put("consumptionPercentage", String.format("%.2f", consumptionPercentage));

		// 📊 Additional metrics
		summary.put("attendanceCount", totalMealsServed);
		summary.put("orderCount", extraFoodOrdered);

		System.out.println("📊 Dashboard Metrics:");
		System.out.println("   Total Students: " + totalStudents);
		System.out.println("   Meals Served: " + totalMealsServed);
		System.out.println("   Food Prepared: " + foodPrepared);
		System.out.println("   Food Consumed: " + foodConsumed);
		System.out.println("   Food Waste: " + foodWaste + " (" + wastePercentage + "%)");

		return summary;
	}

	/**
	 * Get daily analytics
	 * GET /api/dashboard/daily
	 * 🔐 Only ADMIN can access
	 * 
	 * Returns analytics for a specific date
	 * 
	 * @param authHeader JWT token in Authorization header
	 * @param date Date to fetch (format: YYYY-MM-DD)
	 * @return Daily analytics with HTTP 200 OK
	 */
	@GetMapping("/daily")
	public ResponseEntity<?> getDailyAnalytics(
			@RequestHeader(value = "Authorization", required = false) String authHeader,
			@RequestParam(required = false) String date) {

		try {
			// ✅ Validate token
			if (authHeader == null || !authHeader.startsWith("Bearer ")) {
				return new ResponseEntity<>(
					Map.of("message", "Authorization token required"),
					HttpStatus.UNAUTHORIZED);
			}

			String token = authHeader.substring(7);
			if (!jwtUtil.validateToken(token)) {
				return new ResponseEntity<>(
					Map.of("message", "Invalid or expired token"),
					HttpStatus.UNAUTHORIZED);
			}

			// ✅ Extract email and verify ADMIN role
			String userEmail = jwtUtil.extractUsername(token);
			Optional<User> userOptional = userRepository.findAll()
					.stream()
					.filter(u -> u.getEmail().equalsIgnoreCase(userEmail))
					.findFirst();

			if (userOptional.isEmpty() || !"ADMIN".equalsIgnoreCase(userOptional.get().getRole())) {
				return new ResponseEntity<>(
					Map.of("message", "Only ADMIN can access dashboard"),
					HttpStatus.FORBIDDEN);
			}

			// 📊 Use today's date if not provided
			String targetDate = date != null && !date.isEmpty() ? date : LocalDate.now().toString();

			// 📊 Calculate daily metrics
			List<Attendance> dayAttendances = attendanceRepository.findByDate(targetDate);
			long mealsTodayServed = dayAttendances.stream()
					.filter(a -> "PRESENT".equalsIgnoreCase(a.getStatus()))
					.count();

			long foodTodayConsumed = mealsTodayServed + (long) dayAttendances.size();

			// ✅ Prepare response
			Map<String, Object> response = new HashMap<>();
			response.put("message", "Daily analytics retrieved");
			response.put("date", targetDate);
			response.put("data", Map.of(
				"mealsServed", mealsTodayServed,
				"foodConsumed", foodTodayConsumed,
				"attendanceRecords", dayAttendances.size()
			));

			return new ResponseEntity<>(response, HttpStatus.OK);

		} catch (Exception e) {
			System.err.println("❌ Error fetching daily analytics: " + e.getMessage());
			return new ResponseEntity<>(
				Map.of("message", "Error fetching daily analytics: " + e.getMessage()),
				HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
