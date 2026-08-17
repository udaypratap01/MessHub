package com.messhub.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

/**
 * Bill - MongoDB document for storing student billing information
 * Calculates bill amount based on attendance (present days)
 * Rate: ₹100 per day
 */
@Document(collection = "bills")
public class Bill {

	@Id
	private String id;
	private String userId;
	private String month;
	private int totalPresentDays;
	private double amount; // totalPresentDays * 100

	// Constructors
	public Bill() {
	}

	public Bill(String userId, String month, int totalPresentDays, double amount) {
		this.userId = userId;
		this.month = month;
		this.totalPresentDays = totalPresentDays;
		this.amount = amount;
	}

	// Getters and Setters
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getUserId() {
		return userId;
	}

	public void setUserId(String userId) {
		this.userId = userId;
	}

	public String getMonth() {
		return month;
	}

	public void setMonth(String month) {
		this.month = month;
	}

	public int getTotalPresentDays() {
		return totalPresentDays;
	}

	public void setTotalPresentDays(int totalPresentDays) {
		this.totalPresentDays = totalPresentDays;
	}

	public double getAmount() {
		return amount;
	}

	public void setAmount(double amount) {
		this.amount = amount;
	}

	@Override
	public String toString() {
		return "Bill{" +
				"id='" + id + '\'' +
				", userId='" + userId + '\'' +
				", month='" + month + '\'' +
				", totalPresentDays=" + totalPresentDays +
				", amount=" + amount +
				'}';
	}
}
