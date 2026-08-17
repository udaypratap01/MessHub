# 🔧 COMPLETE FIX FOR 403 ACCESS DENIED - ROLE-BASED AUTHORIZATION

**Problem:** All protected APIs returning 403 Access Denied  
**Root Cause:** JWT doesn't include role claims, so role can't be extracted  
**Solution:** Include role in JWT → Extract role from JWT → Set Spring Security authority correctly

---

## ✅ WHY 403 WAS HAPPENING

```
1. AuthController generates JWT with ONLY email as subject
2. JwtFilter tries to extract role from JWT (but it doesn't exist!)
3. Even if role was extracted, it was uppercase "ADMIN" but Spring Security needs "ROLE_ADMIN"
4. SecurityContext has NO authorities → Spring Security sees unauthorized user
5. All endpoints return 403 Forbidden
```

---

## ✅ HOW TO FIX (3 CHANGES)

### Change 1: JwtUtil.java - ADD ROLE TO JWT CLAIMS

**COMPLETE FILE:**

```java
package com.messhub.backend.util;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

@Component
public class JwtUtil {

    @Value("${jwt.secret:your-secret-key-change-this-in-production-min-32-chars}")
    private String jwtSecret;

    @Value("${jwt.expiration:3600000}")
    private long jwtExpiration;

    // ✅ FIXED: Include role in token
    public String generateToken(String email, String role) {
        Map<String, Object> claims = new HashMap<>();
        claims.put("role", role); // 🔥 ADD ROLE TO JWT
        return createToken(claims, email);
    }
    
    // ✅ Overload for backward compatibility
    public String generateToken(String email) {
        Map<String, Object> claims = new HashMap<>();
        return createToken(claims, email);
    }

    private String createToken(Map<String, Object> claims, String email) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);

        SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());

        return Jwts.builder()
                .setClaims(claims)
                .setSubject(email)
                .setIssuedAt(now)
                .setExpiration(expiryDate)
                .signWith(key)
                .compact();
    }

    public boolean validateToken(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());

            Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);

            return true;
        } catch (Exception e) {
            return false;
        }
    }

    public String extractUsername(String token) {
        try {
            return extractAllClaims(token).getSubject();
        } catch (Exception e) {
            return null;
        }
    }

    // ✅ NEW: Extract role from token
    public String extractRole(String token) {
        try {
            Claims claims = extractAllClaims(token);
            Object role = claims.get("role");
            return role != null ? role.toString() : null;
        } catch (Exception e) {
            return null;
        }
    }

    public Claims extractAllClaims(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());

            return Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

        } catch (Exception e) {
            return null;
        }
    }
}
```

---

### Change 2: JwtFilter.java - EXTRACT ROLE FROM JWT

**COMPLETE FILE:**

```java
package com.messhub.backend.filter;

import com.messhub.backend.util.JwtUtil;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Collections;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                   HttpServletResponse response,
                                   FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");

        // No token → continue (request might be public)
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        // Extract token
        String token = authHeader.substring(7);

        try {
            // ✅ Extract BOTH email and role from JWT
            String email = jwtUtil.extractUsername(token);
            String role = jwtUtil.extractRole(token);

            // Check if user is not already authenticated
            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {

                // Validate JWT signature
                if (jwtUtil.validateToken(token)) {

                    // ✅ Use role from JWT (already in token!)
                    if (role != null) {
                        
                        // 🔥 IMPORTANT: Add ROLE_ prefix for Spring Security
                        UsernamePasswordAuthenticationToken authToken =
                                new UsernamePasswordAuthenticationToken(
                                        email,
                                        null,
                                        Collections.singletonList(
                                                new SimpleGrantedAuthority("ROLE_" + role.toUpperCase())
                                        )
                                );

                        SecurityContextHolder.getContext().setAuthentication(authToken);
                    }
                }
            }

        } catch (Exception e) {
            // Ignore invalid token
        }

        // Continue with request
        filterChain.doFilter(request, response);
    }
}
```

---

### Change 3: AuthController.java - INCLUDE ROLE IN TOKEN GENERATION

**CHANGE THIS LINE (around line 65):**

```java
// OLD:
String token = jwtUtil.generateToken(user.getEmail());

// NEW:
String token = jwtUtil.generateToken(user.getEmail(), user.getRole());
```

**COMPLETE RELEVANT METHOD:**

```java
@PostMapping("/login")
public ResponseEntity<?> login(@RequestBody Map<String, String> loginRequest) {

    String email = loginRequest.get("email");
    String password = loginRequest.get("password");

    // Validation
    if (email == null || email.trim().isEmpty() ||
        password == null || password.isEmpty()) {

        return ResponseEntity.badRequest()
                .body(Map.of("message", "Email and password are required"));
    }

    String normalizedEmail = email.trim().toLowerCase();

    // Find user
    User user = userRepository.findAll()
            .stream()
            .filter(u -> {
                if (u.getEmail() == null) return false;
                return u.getEmail().trim().toLowerCase().equals(normalizedEmail);
            })
            .findFirst()
            .orElse(null);

    if (user == null) {
        return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("message", "User not found"));
    }

    // Check password
    if (!user.getPassword().equals(password)) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("message", "Invalid password"));
    }

    // ✅ GENERATE TOKEN WITH ROLE
    String token = jwtUtil.generateToken(user.getEmail(), user.getRole());

    // Response
    Map<String, Object> response = new HashMap<>();
    response.put("message", "Login successful");
    response.put("token", token);

    Map<String, Object> userData = new HashMap<>();
    userData.put("id", user.getId());
    userData.put("name", user.getName());
    userData.put("email", user.getEmail());
    userData.put("role", user.getRole());

    response.put("user", userData);

    return ResponseEntity.ok(response);
}
```

---

### Change 4: SecurityConfig.java - VERIFY CORRECT SETUP

**Your SecurityConfig is correct, just make sure it has this:**

```java
.authorizeHttpRequests(auth -> auth
    // Public endpoints
    .requestMatchers("/api/auth/login").permitAll()
    .requestMatchers("/", "/status").permitAll()
    
    // CORS preflight
    .requestMatchers(HttpMethod.OPTIONS, "/**").permitAll()

    // Protected endpoints
    .requestMatchers(HttpMethod.POST, "/api/menu").hasRole("ADMIN")
    .requestMatchers(HttpMethod.GET, "/api/menu").hasAnyRole("ADMIN", "STUDENT")
    
    // All other requests authenticated
    .anyRequest().authenticated()
)

// Add JWT filter
.addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);
```

---

## ✅ HOW ROLE-BASED AUTHORIZATION WORKS IN SPRING SECURITY

```
1. User logs in → AuthController.login() called
2. AuthController generates JWT with role claim
3. JWT sent to frontend as: { "token": "eyJ...", "user": {...} }
4. Frontend stores token in localStorage
5. Frontend sends token in Authorization header: "Bearer eyJ..."

6. Next request comes to backend
7. JwtFilter intercepts request
8. JwtFilter extracts token from Authorization header
9. JwtFilter parses JWT using JwtUtil
10. JwtFilter extracts email and role from JWT claims
11. JwtFilter creates authentication with authority "ROLE_ADMIN" or "ROLE_STUDENT"
12. JwtFilter sets authentication in SecurityContext

13. Request reaches SecurityConfig
14. SecurityConfig checks @PostMapping endpoint → hasRole("ADMIN")
15. SecurityConfig compares authorities: "ROLE_ADMIN" == hasRole("ADMIN") ✅
16. Request allowed to reach controller
17. Response sent to frontend
```

---

## ✅ FLOW DIAGRAM

```
LOGIN REQUEST
    ↓
AuthController.login()
    ↓
Generate JWT: Jwts.builder()
    .setClaims({ "role": "ADMIN" })  ← Role in JWT!
    .setSubject(email)
    .signWith(key)
    .compact()
    ↓
Return: { "token": "eyJ...", "user": {...} }
    ↓
Frontend stores token in localStorage
    ↓
NEXT REQUEST (with Bearer token)
    ↓
JwtFilter intercepts
    ↓
Extract from Authorization header: "Bearer eyJ..."
    ↓
Parse JWT: Jwts.parserBuilder().parseClaimsJws(token)
    ↓
Extract from claims: email, role
    ↓
Create UsernamePasswordAuthenticationToken:
    - principal: email
    - credentials: null
    - authorities: [ SimpleGrantedAuthority("ROLE_ADMIN") ]
    ↓
Set in SecurityContext
    ↓
SecurityConfig checks authorization:
    - hasRole("ADMIN") → Checks if authorities contains "ROLE_ADMIN" ✅
    ↓
Request allowed
    ↓
Controller processes request
    ↓
Response sent
```

---

## ✅ JWT STRUCTURE

**JWT Header.Payload.Signature**

**Payload (decoded):**
```json
{
  "role": "ADMIN",           ← 🔥 This is new!
  "sub": "admin@test.com",
  "iat": 1713274800,
  "exp": 1713278400
}
```

---

## ✅ TESTING

### Test 1: Admin Login

```bash
POST http://localhost:8080/api/auth/login
Content-Type: application/json

{
  "email": "admin@test.com",
  "password": "admin123"
}

Response:
{
  "message": "Login successful",
  "token": "eyJ...",
  "user": {
    "id": "...",
    "name": "Admin",
    "email": "admin@test.com",
    "role": "ADMIN"
  }
}
```

### Test 2: Use token to access menu (POST - ADMIN only)

```bash
POST http://localhost:8080/api/menu
Authorization: Bearer eyJ...
Content-Type: application/json

{
  "day": "Monday",
  "breakfast": "Eggs",
  "lunch": "Rice",
  "dinner": "Pasta"
}

Expected: 201 CREATED ✅
```

### Test 3: Use token to access menu (GET - ADMIN + STUDENT)

```bash
GET http://localhost:8080/api/menu
Authorization: Bearer eyJ...

Expected: 200 OK with menu list ✅
```

### Test 4: Student tries to POST (should get 403)

```bash
POST http://localhost:8080/api/menu
Authorization: Bearer <STUDENT_TOKEN>
Content-Type: application/json

{...}

Expected: 403 FORBIDDEN ✅
```

---

## ✅ KEY POINTS

| Concept | Details |
|---------|---------|
| JWT Claims | Must include role: `claims.put("role", role)` |
| Extract Role | Use `jwtUtil.extractRole(token)` |
| Authority Format | Must be `ROLE_` + uppercase: `ROLE_ADMIN` |
| hasRole() Check | Spring compares: `hasRole("ADMIN")` ↔ `ROLE_ADMIN` |
| SimpleGrantedAuthority | Wraps role string with ROLE_ prefix |
| SecurityContext | Stores authentication with authorities |

---

## ✅ SUMMARY

**3 Files to Update:**
1. **JwtUtil.java** - Add `generateToken(email, role)` and `extractRole(token)`
2. **JwtFilter.java** - Extract role from JWT, use it for authority
3. **AuthController.java** - Pass role to token generation

**1 File to Verify:**
4. **SecurityConfig.java** - Check hasRole() and hasAnyRole() are correct

**Done!** 403 Access Denied is now fixed! ✅
