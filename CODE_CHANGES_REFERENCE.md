# 🔍 EXACT CODE CHANGES - DELETE ACCOUNT FEATURE

## File 1: UserController.java

### Location
`backend/src/main/java/com/messhub/backend/controller/UserController.java`

### Change: Added DELETE Endpoint (Lines 243-310)

```java
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
```

---

## File 2: SecurityConfig.java

### Location
`backend/src/main/java/com/messhub/backend/config/SecurityConfig.java`

### Change: Added DELETE Endpoint Security Rule

**Added this line:**
```java
.requestMatchers(HttpMethod.DELETE, "/api/users/delete").authenticated()
```

**Context:**
```java
// Users endpoints
.requestMatchers(HttpMethod.GET, "/api/users").hasRole("ADMIN")
.requestMatchers(HttpMethod.POST, "/api/users").hasRole("ADMIN")
.requestMatchers(HttpMethod.GET, "/api/users/me").authenticated()
.requestMatchers(HttpMethod.PUT, "/api/users/update").authenticated()
.requestMatchers(HttpMethod.PUT, "/api/users/change-password").authenticated()
.requestMatchers(HttpMethod.DELETE, "/api/users/delete").authenticated()  // ← NEW
.requestMatchers(HttpMethod.GET, "/api/users/**").hasRole("ADMIN")
```

---

## File 3: Settings.js

### Location
`frontend/src/pages/Settings.js`

### Change: Enhanced handleDeleteAccount Function

**Key Improvements:**
- ✅ Added token validation logging
- ✅ Added response status logging
- ✅ Added localStorage cleanup logging
- ✅ Added auth state update logging
- ✅ Expanded from 2 error cases to 7 cases
- ✅ Added status-specific error messages (401, 403, 404, 400, 500, connection)
- ✅ Added detailed error logging to console

**New Error Scenarios Handled:**
1. No token in localStorage
2. 401 Unauthorized (token invalid/expired)
3. 403 Forbidden (not authorized)
4. 404 Not Found (user not in database)
5. 400 Bad Request (invalid request)
6. 500 Server Error (server crash)
7. Connection Error (server unreachable)
8. Unknown errors (catch-all)

---

## Summary

| File | Type | Changes | Lines |
|------|------|---------|-------|
| UserController.java | Backend | Added DELETE endpoint | +68 |
| SecurityConfig.java | Backend | Added security rule | +1 |
| Settings.js | Frontend | Enhanced error handling | +40 (replaced ~80) |
| **Total** | - | - | **~109** |

---

## Verification

### Build Status
```
✅ Backend: BUILD SUCCESSFUL
✅ Frontend: Compiled successfully
✅ No errors or warnings
```

### Test Status
```
✅ Backend API running on port 8080
✅ Frontend running on port 3000
✅ Both servers responding to requests
```

### Ready for Testing
✅ All code changes applied and compiled
✅ No compile errors
✅ No runtime errors
✅ Comprehensive error handling
✅ Detailed logging for debugging

