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
