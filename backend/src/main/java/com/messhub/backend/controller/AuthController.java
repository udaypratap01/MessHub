package com.messhub.backend.controller;

import com.messhub.backend.model.User;
import com.messhub.backend.repository.UserRepository;
import com.messhub.backend.util.JwtUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {

        String email = loginRequest.get("email");
        String password = loginRequest.get("password");

        System.out.println("🔐 LOGIN REQUEST RECEIVED");
        System.out.println("   Email from request: " + email);
        System.out.println("   Password from request: " + (password != null ? "***" : "NULL"));

        // ✅ Validation
        if (email == null || email.trim().isEmpty() ||
            password == null || password.isEmpty()) {

            System.out.println("❌ VALIDATION FAILED: Missing email or password");
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email and password are required"));
        }

        // 🔥 NORMALIZE EMAIL
        String normalizedEmail = email.trim().toLowerCase();
        System.out.println("✓ Normalized email: " + normalizedEmail);

        // � FIND USER IN DATABASE
        System.out.println("🔍 Searching for user in database...");
        User user = userRepository.findAll()
                .stream()
                .filter(u -> {
                    if (u.getEmail() == null) return false;
                    boolean matches = u.getEmail().trim().toLowerCase().equals(normalizedEmail);
                    if (matches) {
                        System.out.println("   ✓ Found matching user: " + u.getEmail());
                    }
                    return matches;
                })
                .findFirst()
                .orElse(null);

        if (user == null) {
            System.out.println("❌ USER NOT FOUND: " + normalizedEmail);
            System.out.println("   Available users in DB:");
            userRepository.findAll().forEach(u -> 
                System.out.println("     - " + u.getEmail() + " (role: " + u.getRole() + ")")
            );
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "User not found. Please check your email."));
        }

        System.out.println("✓ User found: " + user.getName());

        // ✅ PASSWORD CHECK
        System.out.println("🔑 Checking password...");
        System.out.println("   Stored password: " + user.getPassword());
        System.out.println("   Input password: " + password);
        
        if (!user.getPassword().equals(password)) {
            System.out.println("❌ PASSWORD MISMATCH");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Invalid password. Please try again."));
        }

        System.out.println("✓ Password correct!");

        // ✅ GENERATE TOKEN (WITH ROLE)
        System.out.println("🎯 Generating JWT token...");
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
        
        if (token == null || token.isEmpty()) {
            System.out.println("❌ TOKEN GENERATION FAILED");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to generate authentication token"));
        }
        
        System.out.println("✓ Token generated successfully");
        System.out.println("   Token (first 50 chars): " + token.substring(0, Math.min(50, token.length())));

        // ✅ BUILD RESPONSE
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Login successful");
        response.put("token", token);

        Map<String, Object> userData = new HashMap<>();
        userData.put("id", user.getId());
        userData.put("name", user.getName());
        userData.put("email", user.getEmail());
        userData.put("role", user.getRole());

        response.put("user", userData);

        System.out.println("✅ LOGIN SUCCESSFUL for user: " + user.getEmail());
        System.out.println("================================================");

        return ResponseEntity.ok(response);
    }

    // 🔐 SIGNUP - NO AUTHENTICATION REQUIRED
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> registerRequest) {

        // ✅ Step 1: Validate input
        String name = registerRequest.get("name");
        String email = registerRequest.get("email");
        String password = registerRequest.get("password");
        String role = registerRequest.get("role");

        if (name == null || name.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Name is required"));
        }

        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email is required"));
        }

        if (password == null || password.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Password is required"));
        }

        // ✅ Step 2: Check if email already exists
        String normalizedEmail = email.trim().toLowerCase();

        boolean emailExists = userRepository.findAll()
                .stream()
                .anyMatch(u -> u.getEmail() != null && 
                              u.getEmail().trim().toLowerCase().equals(normalizedEmail));

        if (emailExists) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Email already exists"));
        }

        // ✅ Step 3: Set default role if not provided
        if (role == null || role.trim().isEmpty()) {
            role = "STUDENT";
        }

        // ✅ Step 4: Create new user
        User newUser = new User();
        newUser.setName(name.trim());
        newUser.setEmail(normalizedEmail);
        newUser.setPassword(password);  // In production, hash this!
        newUser.setRole(role.toUpperCase());

        // ✅ Step 5: Save to database
        User savedUser = userRepository.save(newUser);

        System.out.println("✅ User registered: " + savedUser.getEmail());

        // ✅ Step 6: Return response
        Map<String, Object> response = new HashMap<>();
        response.put("message", "User registered successfully");

        Map<String, Object> userData = new HashMap<>();
        userData.put("id", savedUser.getId());
        userData.put("name", savedUser.getName());
        userData.put("email", savedUser.getEmail());
        userData.put("role", savedUser.getRole());

        response.put("user", userData);

        return ResponseEntity.status(HttpStatus.CREATED).body(response);
    }

    // 🗑️ DELETE ACCOUNT - AUTHENTICATION REQUIRED
    @DeleteMapping("/me")
    public ResponseEntity<?> deleteAccount(@RequestHeader(value = "Authorization", required = false) String authHeader) {

        // ✅ Step 1: Validate Authorization header
        if (authHeader == null || authHeader.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Authorization header is missing"));
        }

        // ✅ Step 2: Extract token from "Bearer <token>"
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

        // ✅ Step 4: Extract email from token
        String email = jwtUtil.extractUsername(token);
        if (email == null || email.trim().isEmpty()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("message", "Could not extract email from token"));
        }

        // ✅ Step 5: Find user by email
        User user = userRepository.findByEmailIgnoreCase(email).orElse(null);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("message", "User not found"));
        }

        // ✅ Step 6: Delete user from database
        String userId = user.getId();
        if (userId != null && !userId.trim().isEmpty()) {
            userRepository.deleteById(userId);
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error: User ID is invalid"));
        }

        System.out.println("✅ Account deleted: " + email);

        // ✅ Step 7: Return success response
        return ResponseEntity.ok(Map.of("message", "Account deleted successfully"));
    }
}