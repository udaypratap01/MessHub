package com.messhub.backend.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * HomeController - Main API controller for the MessHub Backend
 * Provides basic health check and status endpoints
 */
@RestController
public class HomeController {

	/**
	 * Root endpoint - Returns a welcome message
	 * @return Welcome message with emojis
	 */
	@GetMapping("/")
	public String home() {
		return "Backend is running 🚀🔥";
	}

	/**
	 * Status endpoint - Returns API status
	 * @return API status message
	 */
	@GetMapping("/status")
	public String status() {
		return "API working ✅";
	}
}
