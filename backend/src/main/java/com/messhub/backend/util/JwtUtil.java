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
        try {
            System.out.println("   📝 Building token for: " + email + " (role: " + role + ")");
            
            Map<String, Object> claims = new HashMap<>();
            claims.put("role", role); // 🔥 ADD ROLE TO JWT
            
            String token = createToken(claims, email);
            
            System.out.println("   ✓ Token created successfully (length: " + token.length() + ")");
            return token;
        } catch (Exception e) {
            System.out.println("   ❌ Token generation failed: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }
    
    // ✅ Overload for backward compatibility
    public String generateToken(String email) {
        try {
            System.out.println("   📝 Building token for: " + email);
            
            Map<String, Object> claims = new HashMap<>();
            String token = createToken(claims, email);
            
            System.out.println("   ✓ Token created successfully (length: " + token.length() + ")");
            return token;
        } catch (Exception e) {
            System.out.println("   ❌ Token generation failed: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    private String createToken(Map<String, Object> claims, String email) {
        try {
            Date now = new Date();
            Date expiryDate = new Date(now.getTime() + jwtExpiration);

            System.out.println("     🔐 Secret key length: " + jwtSecret.length());
            System.out.println("     ⏰ Expiration (ms): " + jwtExpiration);
            
            SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());

            String token = Jwts.builder()
                    .setClaims(claims)              // ✅ FIX
                    .setSubject(email)              // ✅ FIX
                    .setIssuedAt(now)               // ✅ FIX
                    .setExpiration(expiryDate)      // ✅ FIX
                    .signWith(key)
                    .compact();
            
            System.out.println("     ✓ Token signed successfully");
            return token;
        } catch (Exception e) {
            System.out.println("     ❌ Token creation failed: " + e.getMessage());
            e.printStackTrace();
            return null;
        }
    }

    public boolean validateToken(String token) {
        try {
            SecretKey key = Keys.hmacShaKeyFor(jwtSecret.getBytes());

            Jwts.parserBuilder()               // ✅ FIX
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

            return Jwts.parserBuilder()       // ✅ FIX
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token)
                    .getBody();

        } catch (Exception e) {
            return null;
        }
    }
}