package com.messhub.backend.controller;

import com.messhub.backend.model.User;
import com.messhub.backend.repository.UserRepository;
import com.messhub.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

/**
 * UserController - REST API controller for User operations
 * Provides endpoints for creating, retrieving, and updating users
 * 
 * Settings Endpoints:
 * - GET /api/users/me → Get current user profile
 * - PUT /api/users/update → Update user name
 * - PUT /api/users/change-password → Change password
 * 
 * All settings endpoints require valid JWT token
 */
@RestController
@RequestMapping("/api/users")
public class UserController {

	@Autowired
	private UserRepository userRepository;

	@Autowired
	private JwtUtil jwtUtil;

	/**
	 * Save a new user
	 * POST /api/users
	 * @param user User object to save
	 * @return Saved user with generated ID
	 */
	@PostMapping
	public ResponseEntity<User> saveUser(@RequestBody User user) {
		if (user == null) {
			return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
		}
		User savedUser = userRepository.save(user);
		return new ResponseEntity<>(savedUser, HttpStatus.CREATED);
	}

	/**
	 * Get all users
	 * GET /api/users
	 * @return List of all users
	 */
	@GetMapping
	public ResponseEntity<List<User>> getAllUsers() {
		List<User> users = userRepository.findAll();
		return new ResponseEntity<>(users, HttpStatus.OK);
	}

	/**
	 * Get current user profile
	 * GET /api/users/me
	 * 🔐 Requires valid JWT token
	 * 
	 * Extracts email from JWT token and returns user profile
	 * 
	 * @param authHeader JWT token in Authorization header
	 * @return User profile with HTTP 200 OK
	 */
	@GetMapping("/me")
	public ResponseEntity<?> getCurrentUser(
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

			// ✅ Extract email from token
			String userEmail = jwtUtil.extractUsername(token);
			if (userEmail == null || userEmail.isEmpty()) {
				return new ResponseEntity<>(
					Map.of("message", "Unable to extract user email from token"),
					HttpStatus.UNAUTHORIZED);
			}

			// ✅ Find user by email
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

			// ✅ Prepare response (don't send password)
			Map<String, Object> response = new HashMap<>();
			response.put("message", "User profile retrieved");
			response.put("id", user.getId());
			response.put("name", user.getName());
			response.put("email", user.getEmail());
			response.put("role", user.getRole());

			return new ResponseEntity<>(response, HttpStatus.OK);

		} catch (Exception e) {
			System.err.println("❌ Error fetching user profile: " + e.getMessage());
			return new ResponseEntity<>(
				Map.of("message", "Error fetching user profile: " + e.getMessage()),
				HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * Update user name
	 * PUT /api/users/update
	 * 🔐 Requires valid JWT token
	 * 
	 * Request body:
	 * {
	 *   "name": "New Name"
	 * }
	 * 
	 * @param authHeader JWT token in Authorization header
	 * @param updateRequest Map containing new name
	 * @return Updated user profile with HTTP 200 OK
	 */
	@PutMapping("/update")
	public ResponseEntity<?> updateUser(
			@RequestHeader(value = "Authorization", required = false) String authHeader,
			@RequestBody Map<String, String> updateRequest) {

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

			// ✅ Extract email from token
			String userEmail = jwtUtil.extractUsername(token);
			if (userEmail == null || userEmail.isEmpty()) {
				return new ResponseEntity<>(
					Map.of("message", "Unable to extract user email from token"),
					HttpStatus.UNAUTHORIZED);
			}

			// ✅ Validate input
			String newName = updateRequest.get("name");
			if (newName == null || newName.trim().isEmpty()) {
				return new ResponseEntity<>(
					Map.of("message", "Name is required"),
					HttpStatus.BAD_REQUEST);
			}

			// ✅ Find user by email
			Optional<User> userOptional = userRepository.findAll()
					.stream()
					.filter(u -> u.getEmail().equalsIgnoreCase(userEmail))
					.findFirst();

			if (userOptional.isEmpty()) {
				return new ResponseEntity<>(
					Map.of("message", "User not found"),
					HttpStatus.NOT_FOUND);
			}

			// ✅ Update user name
			User user = userOptional.get();
			user.setName(newName.trim());
			User updatedUser = userRepository.save(user);

			// ✅ Prepare response
			Map<String, Object> response = new HashMap<>();
			response.put("message", "Name updated successfully");
			response.put("id", updatedUser.getId());
			response.put("name", updatedUser.getName());
			response.put("email", updatedUser.getEmail());
			response.put("role", updatedUser.getRole());

			System.out.println("✅ User name updated: " + updatedUser.getEmail());

			return new ResponseEntity<>(response, HttpStatus.OK);

		} catch (Exception e) {
			System.err.println("❌ Error updating user: " + e.getMessage());
			return new ResponseEntity<>(
				Map.of("message", "Error updating user: " + e.getMessage()),
				HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * Change user password
	 * PUT /api/users/change-password
	 * 🔐 Requires valid JWT token
	 * 
	 * Request body:
	 * {
	 *   "oldPassword": "current123",
	 *   "newPassword": "new123456"
	 * }
	 * 
	 * Validates old password before changing to new password
	 * 
	 * @param authHeader JWT token in Authorization header
	 * @param passwordRequest Map containing oldPassword and newPassword
	 * @return Success/error message with HTTP 200 OK or error status
	 */
	@PutMapping("/change-password")
	public ResponseEntity<?> changePassword(
			@RequestHeader(value = "Authorization", required = false) String authHeader,
			@RequestBody Map<String, String> passwordRequest) {

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

			// ✅ Extract email from token
			String userEmail = jwtUtil.extractUsername(token);
			if (userEmail == null || userEmail.isEmpty()) {
				return new ResponseEntity<>(
					Map.of("message", "Unable to extract user email from token"),
					HttpStatus.UNAUTHORIZED);
			}

			// ✅ Validate input
			String oldPassword = passwordRequest.get("oldPassword");
			String newPassword = passwordRequest.get("newPassword");

			if (oldPassword == null || oldPassword.isEmpty()) {
				return new ResponseEntity<>(
					Map.of("message", "Old password is required"),
					HttpStatus.BAD_REQUEST);
			}

			if (newPassword == null || newPassword.isEmpty()) {
				return new ResponseEntity<>(
					Map.of("message", "New password is required"),
					HttpStatus.BAD_REQUEST);
			}

			if (newPassword.length() < 6) {
				return new ResponseEntity<>(
					Map.of("message", "New password must be at least 6 characters"),
					HttpStatus.BAD_REQUEST);
			}

			if (oldPassword.equals(newPassword)) {
				return new ResponseEntity<>(
					Map.of("message", "New password must be different from old password"),
					HttpStatus.BAD_REQUEST);
			}

			// ✅ Find user by email
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

			// ✅ Validate old password
			if (!user.getPassword().equals(oldPassword)) {
				return new ResponseEntity<>(
					Map.of("message", "Old password is incorrect"),
					HttpStatus.UNAUTHORIZED);
			}

			// ✅ Update password
			user.setPassword(newPassword);
			User updatedUser = userRepository.save(user);

			// ✅ Prepare response
			Map<String, Object> response = new HashMap<>();
			response.put("message", "Password changed successfully");
			response.put("email", updatedUser.getEmail());

			System.out.println("✅ Password changed for user: " + updatedUser.getEmail());

			return new ResponseEntity<>(response, HttpStatus.OK);

		} catch (Exception e) {
			System.err.println("❌ Error changing password: " + e.getMessage());
			return new ResponseEntity<>(
				Map.of("message", "Error changing password: " + e.getMessage()),
				HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}

	/**
	 * Delete user account
	 * DELETE /api/users/delete
	 * 🔐 Requires valid JWT token
	 * 
	 * Permanently deletes the authenticated user's account
	 * This is an irreversible operation
	 * 
	 * @param authHeader JWT token in Authorization header
	 * @return Success message with HTTP 200 OK
	 */
	@DeleteMapping("/delete")
	public ResponseEntity<?> deleteAccount(
			@RequestHeader(value = "Authorization", required = false) String authHeader) {

		try {
			// ✅ Validate token
			if (authHeader == null || !authHeader.startsWith("Bearer ")) {
				System.err.println("❌ DELETE /api/users/delete - Authorization header missing or invalid");
				return new ResponseEntity<>(
					Map.of("message", "Authorization token required"),
					HttpStatus.UNAUTHORIZED);
			}

			String token = authHeader.substring(7);
			if (!jwtUtil.validateToken(token)) {
				System.err.println("❌ DELETE /api/users/delete - Token validation failed");
				return new ResponseEntity<>(
					Map.of("message", "Invalid or expired token"),
					HttpStatus.UNAUTHORIZED);
			}

			// ✅ Extract email from token
			String userEmail = jwtUtil.extractUsername(token);
			if (userEmail == null || userEmail.isEmpty()) {
				System.err.println("❌ DELETE /api/users/delete - Unable to extract email from token");
				return new ResponseEntity<>(
					Map.of("message", "Unable to extract user email from token"),
					HttpStatus.UNAUTHORIZED);
			}

			System.out.println("🗑️ DELETE /api/users/delete - Attempting to delete user: " + userEmail);

			// ✅ Find user by email
			Optional<User> userOptional = userRepository.findAll()
					.stream()
					.filter(u -> u.getEmail().equalsIgnoreCase(userEmail))
					.findFirst();

			if (userOptional.isEmpty()) {
				System.err.println("❌ User not found for deletion: " + userEmail);
				return new ResponseEntity<>(
					Map.of("message", "User not found"),
					HttpStatus.NOT_FOUND);
			}

			User user = userOptional.get();

			// ✅ Delete user account
			userRepository.delete(user);

			System.out.println("✅ Account successfully deleted for user: " + userEmail);

			// ✅ Prepare response
			Map<String, Object> response = new HashMap<>();
			response.put("message", "Account deleted successfully");
			response.put("deletedEmail", userEmail);

			return new ResponseEntity<>(response, HttpStatus.OK);

		} catch (Exception e) {
			System.err.println("❌ Error deleting account: " + e.getMessage());
			e.printStackTrace();
			return new ResponseEntity<>(
				Map.of("message", "Error deleting account: " + e.getMessage()),
				HttpStatus.INTERNAL_SERVER_ERROR);
		}
	}
}
