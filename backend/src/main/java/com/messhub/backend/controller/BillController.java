package com.messhub.backend.controller;

import com.messhub.backend.model.Attendance;
import com.messhub.backend.model.Bill;
import com.messhub.backend.model.User;
import com.messhub.backend.model.Order;
import com.messhub.backend.repository.AttendanceRepository;
import com.messhub.backend.repository.BillRepository;
import com.messhub.backend.repository.UserRepository;
import com.messhub.backend.repository.OrderRepository;
import com.messhub.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * BillController - REST API controller for Bill operations
 * Manages student billing with attendance-based calculation
 * 
 * Billing Logic:
 * - Rate: ₹100 per day (present)
 * - Bill Amount = Total Present Days * 100
 * 
 * Access Control:
 * - POST /api/bill/generate → Only ADMIN (generate bills for all students)
 * - GET /api/bill → ADMIN (view all bills) and STUDENT (view own bill)
 * 
 * All endpoints require valid JWT token
 */
@RestController
@RequestMapping("/api/bill")
public class BillController {

	private static final double RATE_PER_DAY = 100.0; // ₹100 per day

	@Autowired
	private BillRepository billRepository;

	@Autowired
	private AttendanceRepository attendanceRepository;

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private OrderRepository orderRepository;

	@Autowired
	private JwtUtil jwtUtil;

	/**
	 * Generate bills for all students based on attendance
	 * POST /api/bill/generate
	 * 🔐 Only ADMIN can access (requires ROLE_ADMIN)
	 * 
	 * Request body:
	 * {
	 *   "month": "2026-04"
	 * }
	 * 
	 * Logic:
	 * 1. Get all STUDENT users from database
	 * 2. Count PRESENT days for each student in given month
	 * 3. Calculate amount = presentDays * 100
	 * 4. Save/Update bill in MongoDB
	 * 
	 * @param billRequest Map containing month
	 * @param authentication Current authenticated admin user
	 * @return Generated bills summary with HTTP 201 CREATED
	 */
	@PostMapping("/generate")
	public ResponseEntity<?> generateBills(@RequestBody Map<String, String> billRequest,
										   Authentication authentication) {

		// ✅ Extract month from request
		String month = billRequest.get("month");

		// ✅ Validate input
		if (month == null || month.isEmpty()) {
			Map<String, String> errorResponse = new HashMap<>();
			errorResponse.put("message", "Month is required (format: YYYY-MM)");
			return new ResponseEntity<>(errorResponse, HttpStatus.BAD_REQUEST);
		}

		try {
			// ✅ Get all STUDENT users
			List<User> allUsers = userRepository.findAll();
			List<User> studentUsers = allUsers.stream()
					.filter(user -> "STUDENT".equalsIgnoreCase(user.getRole()))
					.collect(Collectors.toList());

			if (studentUsers.isEmpty()) {
				Map<String, String> infoResponse = new HashMap<>();
				infoResponse.put("message", "No students found");
				return new ResponseEntity<>(infoResponse, HttpStatus.OK);
			}

			// ✅ Generate bills for each student
			int billsGenerated = 0;
			List<Bill> generatedBills = new java.util.ArrayList<>();

			for (User student : studentUsers) {
				// 🔐 Count PRESENT days in the given month
				List<Attendance> monthlyAttendance = attendanceRepository.findByUserEmail(student.getEmail())
						.stream()
						.filter(attendance -> attendance.getDate().startsWith(month) && 
												"PRESENT".equalsIgnoreCase(attendance.getStatus()))
						.collect(Collectors.toList());

				int presentDays = monthlyAttendance.size();

				// 📊 Calculate amount
				double amount = presentDays * RATE_PER_DAY;

				// ✅ Check if bill already exists for this month
				Bill existingBill = billRepository.findByUserIdAndMonth(student.getId(), month);
				Bill bill;

				if (existingBill != null) {
					// Update existing bill
					existingBill.setTotalPresentDays(presentDays);
					existingBill.setAmount(amount);
					bill = existingBill;
				} else {
					// Create new bill
					bill = new Bill(student.getId(), month, presentDays, amount);
				}

				// ✅ Save bill to MongoDB
				bill = billRepository.save(bill);
				generatedBills.add(bill);
				billsGenerated++;
			}

			// ✅ Prepare response
			Map<String, Object> successResponse = new HashMap<>();
			successResponse.put("message", "Bills generated successfully");
			successResponse.put("month", month);
			successResponse.put("rate", RATE_PER_DAY + " per day");
			successResponse.put("totalBillsGenerated", billsGenerated);
			successResponse.put("bills", generatedBills);

			return new ResponseEntity<>(successResponse, HttpStatus.CREATED);

		} catch (Exception e) {
			Map<String, String> errorResponse = new HashMap<>();
			errorResponse.put("message", "Error generating bills: " + e.getMessage());
			return new ResponseEntity<>(errorResponse, HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * Get bills
	 * GET /api/bill
	 * 🔐 ADMIN and STUDENT can access
	 * - ADMIN: View all bills
	 * - STUDENT: View only their own bill
	 * 
	 * Query parameters:
	 * - month (optional): Filter by specific month
	 * 
	 * @param authentication Current authenticated user
	 * @param month Optional month filter (format: YYYY-MM)
	 * @return List of bills (filtered based on role and month) with HTTP 200 OK
	 */
	@GetMapping
	public ResponseEntity<?> getBills(Authentication authentication,
									   @RequestParam(required = false) String month) {

		// ✅ Get current user email from JWT token
		String userEmail = (String) authentication.getPrincipal();

		// ✅ Find user by email
		List<User> users = userRepository.findAll();
		Optional<User> userOptional = users.stream()
				.filter(user -> user.getEmail().equals(userEmail))
				.findFirst();

		if (userOptional.isEmpty()) {
			Map<String, String> errorResponse = new HashMap<>();
			errorResponse.put("message", "User not found");
			return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
		}

		User user = userOptional.get();
		List<Bill> billList;

		// 🔐 Check if user is ADMIN or STUDENT
		if ("ADMIN".equalsIgnoreCase(user.getRole())) {
			// ADMIN: Return all bills
			billList = billRepository.findAll();

			// Filter by month if provided
			if (month != null && !month.isEmpty()) {
				billList = billList.stream()
						.filter(bill -> bill.getMonth().equals(month))
						.collect(Collectors.toList());
			}

			Map<String, Object> response = new HashMap<>();
			response.put("message", "All bills (ADMIN view)");
			response.put("role", "ADMIN");
			response.put("month_filter", month != null ? month : "All months");
			response.put("totalBills", billList.size());
			response.put("data", billList);

			return new ResponseEntity<>(response, HttpStatus.OK);

		} else {
			// STUDENT: Return only their own bills
			billList = billRepository.findByUserId(user.getId());

			// Filter by month if provided
			if (month != null && !month.isEmpty()) {
				billList = billList.stream()
						.filter(bill -> bill.getMonth().equals(month))
						.collect(Collectors.toList());
			}

			// Calculate total amount for displayed bills
			double totalAmount = billList.stream()
					.mapToDouble(Bill::getAmount)
					.sum();

			Map<String, Object> response = new HashMap<>();
			response.put("message", "Your bills");
			response.put("role", "STUDENT");
			response.put("email", user.getEmail());
			response.put("month_filter", month != null ? month : "All months");
			response.put("totalBills", billList.size());
			response.put("totalAmount", totalAmount);
			response.put("data", billList);

			return new ResponseEntity<>(response, HttpStatus.OK);
		}
	}

	// Get student's food order bill
	@GetMapping("/my")
	public ResponseEntity<?> getMyFoodBill(
			@RequestHeader(value = "Authorization", required = false) String authHeader) {
		
		try {
			// Validate token
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

			// Extract email from token
			String userEmail = jwtUtil.extractUsername(token);
			if (userEmail == null || userEmail.isEmpty()) {
				return new ResponseEntity<>(
					Map.of("message", "Unable to extract user email from token"),
					HttpStatus.UNAUTHORIZED);
			}

			// Get all orders for this user
			List<Order> userOrders = orderRepository.findByUserEmail(userEmail);

			// Calculate total food bill
			double totalFoodBill = userOrders.stream()
					.mapToDouble(Order::getTotalPrice)
					.sum();

			// Prepare response
			Map<String, Object> response = new HashMap<>();
			response.put("message", "Your food order bill");
			response.put("email", userEmail);
			response.put("totalFoodBill", totalFoodBill);
			response.put("orderCount", userOrders.size());
			response.put("orders", userOrders);

			return new ResponseEntity<>(response, HttpStatus.OK);

		} catch (Exception e) {
			return new ResponseEntity<>(
				Map.of("message", "Error fetching food bill: " + e.getMessage()),
				HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
