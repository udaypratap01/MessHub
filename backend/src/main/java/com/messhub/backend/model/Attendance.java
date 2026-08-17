package com.messhub.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

/**
 * Attendance - MongoDB document for tracking student meal attendance
 * Records attendance status (PRESENT/ABSENT) for each meal (BREAKFAST/LUNCH/DINNER)
 */
@Document(collection = "attendance")
public class Attendance {

	@Id
	private String id;
	
	// User Information
	private String userEmail;     // Email from JWT
	private String userName;      // Name from database
	
	// Attendance Details
	private String date;          // Format: YYYY-MM-DD (current date)
	private String mealType;      // BREAKFAST, LUNCH, or DINNER
	private String status;        // PRESENT or ABSENT
	
	// Timestamp
	private LocalDateTime createdAt;

	// Constructors
	public Attendance() {
	}

	public Attendance(String userEmail, String userName, String date, String mealType, String status) {
		this.userEmail = userEmail;
		this.userName = userName;
		this.date = date;
		this.mealType = mealType;
		this.status = status;
		this.createdAt = LocalDateTime.now();
	}

	// Getters and Setters
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getUserEmail() {
		return userEmail;
	}

	public void setUserEmail(String userEmail) {
		this.userEmail = userEmail;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	public String getDate() {
		return date;
	}

	public void setDate(String date) {
		this.date = date;
	}

	public String getMealType() {
		return mealType;
	}

	public void setMealType(String mealType) {
		this.mealType = mealType;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	@Override
	public String toString() {
		return "Attendance{" +
				"id='" + id + '\'' +
				", userEmail='" + userEmail + '\'' +
				", userName='" + userName + '\'' +
				", date='" + date + '\'' +
				", mealType='" + mealType + '\'' +
				", status='" + status + '\'' +
				", createdAt=" + createdAt +
				'}';
	}
}
