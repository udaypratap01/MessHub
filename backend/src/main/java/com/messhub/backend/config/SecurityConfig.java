package com.messhub.backend.config;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfigurationSource;
import com.messhub.backend.filter.JwtFilter;

/**
 * Security Configuration for Spring Boot Backend
 * Enables CORS and JWT authentication for all endpoints
 */
@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Autowired
    private CorsConfigurationSource corsConfigurationSource;

    @Autowired
    private JwtFilter jwtFilter;

    /**
     * Configure security for HTTP requests
     * Enables CORS, disables CSRF, and sets up JWT authentication
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        System.out.println("🔐 Configuring Security Chain");
        System.out.println("   ✓ CORS enabled for http://localhost:3000");
        System.out.println("   ✓ JWT authentication configured");
        System.out.println("   ✓ CSRF disabled (stateless API)");

        http
            // ✅ ENABLE CORS with the configured source
            .cors(cors -> cors.configurationSource(corsConfigurationSource))

            // ✅ DISABLE CSRF (stateless API with JWT)
            .csrf(csrf -> csrf.disable())

            // ✅ USE STATELESS SESSION (JWT-based)
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

            // ✅ CONFIGURE ENDPOINT AUTHORIZATION
            .authorizeHttpRequests(auth -> auth
                // Public endpoints (no authentication required)
                .requestMatchers(HttpMethod.POST, "/api/auth/login").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/auth/register").permitAll()
                .requestMatchers(HttpMethod.DELETE, "/api/auth/me").permitAll()

                // Menu endpoints (accessible to all authenticated users)
                .requestMatchers(HttpMethod.GET, "/api/menu").permitAll()
                .requestMatchers(HttpMethod.POST, "/api/menu").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/menu/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/menu/**").hasRole("ADMIN")

                // Extra Food endpoints - GET allows all authenticated users
                .requestMatchers(HttpMethod.GET, "/api/extra-food").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/extra-food").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/extra-food/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/extra-food/**").hasRole("ADMIN")

                // Orders endpoints
                .requestMatchers(HttpMethod.GET, "/api/orders").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/orders").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/orders/bulk").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/orders/admin").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/orders/my").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/orders/all").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/orders/**").authenticated()

                // Attendance endpoints
                .requestMatchers(HttpMethod.GET, "/api/attendance").authenticated()
                .requestMatchers(HttpMethod.POST, "/api/attendance/checkin").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/attendance/admin").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/attendance/my").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/attendance/all").hasRole("ADMIN")

                // Bill endpoints
                .requestMatchers(HttpMethod.GET, "/api/bill").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/bill/my").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/bill/admin").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/bill").hasRole("ADMIN")
                .requestMatchers(HttpMethod.GET, "/api/bills").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/bills/admin").hasRole("ADMIN")

                // Users endpoints
                .requestMatchers(HttpMethod.GET, "/api/users").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/users").hasRole("ADMIN")
                // ✅ FIXED: Allow STUDENT to access /api/users/me (own profile)
                .requestMatchers(HttpMethod.GET, "/api/users/me").authenticated()
                .requestMatchers(HttpMethod.PUT, "/api/users/update").authenticated()
                .requestMatchers(HttpMethod.PUT, "/api/users/change-password").authenticated()
                .requestMatchers(HttpMethod.DELETE, "/api/users/delete").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/users/**").hasRole("ADMIN")

                // Dashboard endpoints
                .requestMatchers(HttpMethod.GET, "/api/dashboard").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/dashboard/summary").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/dashboard/admin").hasRole("ADMIN")

                // Notifications endpoints
                .requestMatchers(HttpMethod.GET, "/api/notifications").authenticated()

                // Feedback endpoints (from feedback system)
                .requestMatchers(HttpMethod.POST, "/api/feedback").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/feedback/my").authenticated()
                .requestMatchers(HttpMethod.GET, "/api/feedback/all").hasRole("ADMIN")

                // All other requests require authentication
                .anyRequest().authenticated()
            )

            // ✅ ADD JWT FILTER
            .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class);

        System.out.println("✅ Security Chain Configured Successfully");

        return http.build();
    }
}
