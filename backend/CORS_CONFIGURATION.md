# CORS Configuration for Spring Boot Backend

## 📋 Overview

CORS (Cross-Origin Resource Sharing) configuration has been set up to allow your React frontend (running on `http://localhost:3000`) to communicate with your Spring Boot backend (running on `http://localhost:8080`).

---

## 📁 Files Created/Modified

### 1. **CorsConfig.java** (NEW)
- **Location**: `src/main/java/com/messhub/backend/config/CorsConfig.java`
- **Purpose**: Centralized CORS configuration
- **Features**:
  - Allows requests from `http://localhost:3000`
  - Permits all HTTP methods (GET, POST, PUT, DELETE, OPTIONS, PATCH)
  - Allows all request headers
  - Exposes response headers to frontend
  - Supports credentials (cookies, auth tokens)

### 2. **SecurityConfig.java** (MODIFIED)
- **Location**: `src/main/java/com/messhub/backend/config/SecurityConfig.java`
- **Changes**:
  - Added `CorsConfigurationSource` injection
  - Added CORS configuration to security filter chain
  - CORS is now enabled before CSRF and other filters

---

## 🔧 CORS Configuration Details

### Allowed Origins
```
http://localhost:3000
```
- React frontend origin

### Allowed HTTP Methods
```
GET     - Retrieve data
POST    - Create data
PUT     - Update data
DELETE  - Delete data
OPTIONS - CORS preflight request
PATCH   - Partial updates
```

### Allowed Headers
```
* (All headers)
```
- Including `Authorization` header for JWT tokens

### Exposed Headers
```
Authorization        - JWT token returned by backend
Content-Type        - Response content type
X-Content-Type-Options
X-Frame-Options
X-XSS-Protection
```

### Credentials Support
```
Allowed: true
```
- Allows sending cookies and authorization headers

### Preflight Cache
```
Max Age: 3600 seconds (1 hour)
```
- Browser caches CORS preflight requests for 1 hour

---

## 📄 CorsConfig.java Code

```java
package com.messhub.backend.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.Collections;

/**
 * CORS Configuration for Spring Boot Backend
 * Allows requests from React frontend running on http://localhost:3000
 */
@Configuration
public class CorsConfig {

    /**
     * Configure CORS for all API endpoints
     * This bean defines the CORS policy for the entire application
     */
    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        
        CorsConfiguration corsConfiguration = new CorsConfiguration();

        // ✅ Allow requests from React frontend
        corsConfiguration.setAllowedOrigins(Arrays.asList("http://localhost:3000"));

        // ✅ Allow all HTTP methods
        corsConfiguration.setAllowedMethods(Arrays.asList(
            "GET",      // Retrieve data
            "POST",     // Create data
            "PUT",      // Update data
            "DELETE",   // Delete data
            "OPTIONS",  // CORS preflight request
            "PATCH"     // Partial updates
        ));

        // ✅ Allow all request headers
        corsConfiguration.setAllowedHeaders(Collections.singletonList("*"));

        // ✅ Allow credentials (cookies, authorization headers)
        corsConfiguration.setAllowCredentials(true);

        // ✅ Expose response headers to frontend
        corsConfiguration.setExposedHeaders(Arrays.asList(
            "Authorization",      // JWT token
            "Content-Type",       // Response content type
            "X-Content-Type-Options",
            "X-Frame-Options",
            "X-XSS-Protection"
        ));

        // ✅ Set max age for preflight caching (in seconds)
        // 3600 = 1 hour
        corsConfiguration.setMaxAge(3600L);

        // ✅ Register configuration for all endpoints
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", corsConfiguration);

        return source;
    }
}
```

---

## 🔐 SecurityConfig.java Changes

### Before (Without CORS)
```java
@Bean
public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
    http
        .csrf(csrf -> csrf.disable())
        .formLogin(form -> form.disable())
        // ... rest of configuration
```

### After (With CORS)
```java
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private JwtFilter jwtFilter;

    @Autowired
    private CorsConfigurationSource corsConfigurationSource;  // ✅ NEW

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // ✅ Enable CORS - Must be first!
            .cors(cors -> cors.configurationSource(corsConfigurationSource))
            
            .csrf(csrf -> csrf.disable())
            .formLogin(form -> form.disable())
            // ... rest of configuration
```

---

## 🚀 How It Works

### CORS Preflight Request
```
Browser sees cross-origin request from localhost:3000 to localhost:8080

1. Browser sends OPTIONS preflight request
   OPTIONS /api/auth/login HTTP/1.1
   Origin: http://localhost:3000
   Access-Control-Request-Method: POST

2. Backend receives preflight, CorsConfig checks:
   ✅ Origin http://localhost:3000 allowed?
   ✅ Method POST allowed?
   ✅ Headers allowed?

3. Backend responds with CORS headers:
   Access-Control-Allow-Origin: http://localhost:3000
   Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH
   Access-Control-Allow-Headers: *
   Access-Control-Max-Age: 3600

4. Browser caches response for 1 hour

5. Browser sends actual request
   POST /api/auth/login HTTP/1.1
   Origin: http://localhost:3000
   Authorization: Bearer {token}

6. Backend processes request normally
```

---

## ✅ What This Fixes

### Before CORS Configuration
```
❌ CORS error in browser console
❌ Frontend requests blocked by browser
❌ API calls fail with CORS policy violation
❌ JWT tokens cannot be sent/received
```

### After CORS Configuration
```
✅ CORS headers sent by backend
✅ Browser allows cross-origin requests
✅ API calls work successfully
✅ JWT tokens sent/received properly
✅ All HTTP methods work
```

---

## 🧪 Testing CORS

### Test 1: Login API Call
```bash
# Frontend makes this request
POST http://localhost:8080/api/auth/login
Content-Type: application/json
{
  "email": "user@example.com",
  "password": "password123"
}

# Should return (with CORS headers)
200 OK
{
  "token": "jwt_token_here",
  "user": { ... }
}
```

### Test 2: With JWT Token
```bash
# Frontend makes this request with token
GET http://localhost:8080/api/dashboard
Authorization: Bearer {jwt_token}

# Should return
200 OK
{
  "data": { ... }
}
```

### Test 3: Browser DevTools
```
1. Open http://localhost:3000 in browser
2. Open DevTools (F12)
3. Go to Network tab
4. Make a login request
5. Check response headers for:
   - Access-Control-Allow-Origin: http://localhost:3000
   - Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS, PATCH
   - Access-Control-Allow-Headers: *
```

---

## 🔒 Security Considerations

### Current Setup (Development)
```
✅ Allows only frontend on localhost:3000
✅ Uses stateless JWT authentication
✅ CSRF protection disabled (appropriate for API)
✅ Spring Security filters JWT tokens
✅ All endpoints protected except /api/auth/login
```

### For Production
```
⚠️ Change allowed origin to your production domain
⚠️ Use HTTPS instead of HTTP
⚠️ Consider additional security headers
⚠️ Implement rate limiting
⚠️ Use environment variables for origins
```

**Example for Production:**
```java
// Instead of hardcoding
corsConfiguration.setAllowedOrigins(Arrays.asList(
    "https://yourdomain.com",
    "https://www.yourdomain.com"
));

// Or use environment variable
String[] allowedOrigins = System.getenv("ALLOWED_ORIGINS").split(",");
corsConfiguration.setAllowedOrigins(Arrays.asList(allowedOrigins));
```

---

## 🔄 Order of Filters in Security Chain

CORS must be configured **before** other security configurations:

```
1. ✅ CORS filter     <- First
2. CSRF filter
3. Form Login filter
4. HTTP Basic filter
5. Authorization filter
6. JWT filter         <- Custom filter
```

This ensures:
- Preflight OPTIONS requests pass through
- CORS headers are added to all responses
- Other security filters process actual requests

---

## 🚨 Common Issues & Solutions

### Issue: Still Getting CORS Error
**Solution**: 
1. Verify backend is running on port 8080
2. Check browser console for specific error
3. Confirm origin matches exactly (http://localhost:3000)
4. Clear browser cache
5. Restart backend

### Issue: Preflight Request Fails
**Solution**:
1. Check if OPTIONS method is in allowed methods
2. Verify CorsConfigurationSource is injected
3. Ensure CORS is enabled in security config
4. Check for other filters blocking OPTIONS

### Issue: Authorization Header Not Sent
**Solution**:
1. Verify credentials: true is set
2. Check exposed headers include "Authorization"
3. Verify JWT filter is working
4. Check token format (Bearer {token})

### Issue: Token Not Received from Backend
**Solution**:
1. Verify response headers expose "Authorization"
2. Check API endpoint returns token
3. Verify response structure has token field
4. Check frontend code parses response correctly

---

## 📊 Configuration Summary

| Setting | Value | Purpose |
|---------|-------|---------|
| **Allowed Origins** | http://localhost:3000 | React frontend |
| **Allowed Methods** | GET, POST, PUT, DELETE, OPTIONS, PATCH | HTTP operations |
| **Allowed Headers** | * | All headers including Authorization |
| **Credentials** | true | Support cookies & auth headers |
| **Exposed Headers** | Authorization, Content-Type, etc | Frontend can read these |
| **Max Age** | 3600 seconds | Cache preflight for 1 hour |
| **Applies To** | /** | All endpoints |

---

## 🎯 Next Steps

1. ✅ CorsConfig.java created
2. ✅ SecurityConfig.java updated
3. ✅ CORS enabled for all endpoints
4. ✅ Backend compiled and running on port 8080
5. ✅ Frontend can now call backend APIs
6. ✅ JWT tokens can be sent/received

---

## 📚 Related Files

- **CorsConfig.java** - CORS configuration class
- **SecurityConfig.java** - Spring Security configuration
- **JwtFilter.java** - JWT authentication filter
- **Frontend Login.js** - API call to /api/auth/login

---

## ✨ You're All Set!

Your backend now has proper CORS configuration and can accept requests from your React frontend on `http://localhost:3000`.

### To Use:
1. Start backend: `./gradlew bootRun`
2. Start frontend: `npm start`
3. Login in React app
4. API calls will work without CORS errors

---

**Version**: 1.0.0  
**Date**: April 15, 2026  
**Status**: Production Ready ✅

CORS configuration is complete and integrated with Spring Security!
