package com.messhub.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.bson.types.ObjectId;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;
import java.time.LocalDateTime;

/**
 * Order - MongoDB document for extra food orders
 * Tracks student orders for extra food items
 */
@Document(collection = "orders")
public class Order {

	@Id
	@JsonSerialize(using = ToStringSerializer.class)
	private ObjectId id;
	
	private String userEmail;        // Student email who ordered
	private String userName;         // Student name (denormalized for display)
	private String foodId;           // ID of extra food item
	private String foodName;         // Food name (denormalized for display)
	private Integer quantity;        // Quantity ordered
	private Double pricePerUnit;     // Price per unit at time of order
	private Double totalPrice;       // Total price (quantity * pricePerUnit)
	private String status;           // BOOKED, CANCELLED, COMPLETED
	private String paymentStatus;    // PAID, PENDING
	private LocalDateTime createdAt; // Order timestamp
	
	// ✅ Constructors
	public Order() {
	}

	public Order(String userEmail, String userName, String foodId, String foodName, Integer quantity, 
	             Double pricePerUnit, Double totalPrice) {
		this.userEmail = userEmail;
		this.userName = userName;
		this.foodId = foodId;
		this.foodName = foodName;
		this.quantity = quantity;
		this.pricePerUnit = pricePerUnit;
		this.totalPrice = totalPrice;
		this.status = "BOOKED";
		this.paymentStatus = "PENDING";
		this.createdAt = LocalDateTime.now();
	}

	// ✅ Getters and Setters
	public ObjectId getId() {
		return id;
	}

	public void setId(ObjectId id) {
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

	public String getFoodId() {
		return foodId;
	}

	public void setFoodId(String foodId) {
		this.foodId = foodId;
	}

	public String getFoodName() {
		return foodName;
	}

	public void setFoodName(String foodName) {
		this.foodName = foodName;
	}

	public Integer getQuantity() {
		return quantity;
	}

	public void setQuantity(Integer quantity) {
		this.quantity = quantity;
	}

	public Double getPricePerUnit() {
		return pricePerUnit;
	}

	public void setPricePerUnit(Double pricePerUnit) {
		this.pricePerUnit = pricePerUnit;
	}

	public Double getTotalPrice() {
		return totalPrice;
	}

	public void setTotalPrice(Double totalPrice) {
		this.totalPrice = totalPrice;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public String getPaymentStatus() {
		return paymentStatus;
	}

	public void setPaymentStatus(String paymentStatus) {
		this.paymentStatus = paymentStatus;
	}

	public LocalDateTime getCreatedAt() {
		return createdAt;
	}

	public void setCreatedAt(LocalDateTime createdAt) {
		this.createdAt = createdAt;
	}

	@Override
	public String toString() {
		return "Order{" +
				"id=" + id +
				", userEmail='" + userEmail + '\'' +
				", userName='" + userName + '\'' +
				", foodId='" + foodId + '\'' +
				", foodName='" + foodName + '\'' +
				", quantity=" + quantity +
				", pricePerUnit=" + pricePerUnit +
				", totalPrice=" + totalPrice +
				", status='" + status + '\'' +
				", paymentStatus='" + paymentStatus + '\'' +
				", createdAt=" + createdAt +
				'}';
	}
}
