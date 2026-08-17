package com.messhub.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.bson.types.ObjectId;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

/**
 * ExtraFood - MongoDB document for extra food items
 * Allows students to order additional food beyond regular menu
 * Admin can add/manage extra food items
 */
@Document(collection = "extra_food")
public class ExtraFood {

	@Id
	@JsonSerialize(using = ToStringSerializer.class)
	private ObjectId id;
	
	private String name;
	private Double price;
	private Integer quantity;  // Available quantity
	
	// ✅ Constructors
	public ExtraFood() {
	}

	public ExtraFood(String name, Double price, Integer quantity) {
		this.name = name;
		this.price = price;
		this.quantity = quantity;
	}

	// ✅ Getters and Setters
	public ObjectId getId() {
		return id;
	}

	public void setId(ObjectId id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Double getPrice() {
		return price;
	}

	public void setPrice(Double price) {
		this.price = price;
	}

	public Integer getQuantity() {
		return quantity;
	}

	public void setQuantity(Integer quantity) {
		this.quantity = quantity;
	}

	@Override
	public String toString() {
		return "ExtraFood{" +
				"id=" + id +
				", name='" + name + '\'' +
				", price=" + price +
				", quantity=" + quantity +
				'}';
	}
}
