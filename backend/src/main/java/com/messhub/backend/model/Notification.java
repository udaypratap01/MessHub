package com.messhub.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

/**
 * Notification - MongoDB document for system announcements
 * Admin creates announcements that all users can view
 */
@Document(collection = "notifications")
public class Notification {

	@Id
	private String id;
	
	// Notification Content
	private String title;          // Announcement title
	private String message;        // Announcement message
	
	// Creator Information
	private String createdBy;      // Admin email from JWT
	private String createdByName;  // Admin name
	
	// Timestamp
	private LocalDateTime createdAt;

	// Constructors
	public Notification() {
	}

	public Notification(String title, String message, String createdBy, String createdByName) {
		this.title = title;
		this.message = message;
		this.createdBy = createdBy;
		this.createdByName = createdByName;
		this.createdAt = LocalDateTime.now();
	}

	// Getters and Setters
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getMessage() {
		return message;
	}

	public void setMessage(String message) {
		this.message = message;
	}

	public String getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
	}

	public String getCreatedByName() {
		return createdByName;
	}

	public void setCreatedByName(String createdByName) {
		this.createdByName = createdByName;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	@Override
	public String toString() {
		return "Notification{" +
				"id='" + id + '\'' +
				", title='" + title + '\'' +
				", message='" + message + '\'' +
				", createdBy='" + createdBy + '\'' +
				", createdByName='" + createdByName + '\'' +
				", createdAt=" + createdAt +
				'}';
	}
}
