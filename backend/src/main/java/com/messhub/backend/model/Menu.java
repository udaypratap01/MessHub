package com.messhub.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.bson.types.ObjectId;
import com.fasterxml.jackson.databind.annotation.JsonSerialize;
import com.fasterxml.jackson.databind.ser.std.ToStringSerializer;

/**
 * Menu - MongoDB document for storing daily meal information
 * Contains breakfast, lunch, and dinner details for each day
 * 
 * 🔥 IMPORTANT: Using ObjectId instead of String for @Id field
 * This ensures proper mapping with MongoDB's _id field
 */
@Document(collection = "menus")
public class Menu {

	@Id
	@JsonSerialize(using = ToStringSerializer.class)  // 🔥 Serialize ObjectId as String in JSON
	private ObjectId id;  // 🔥 MongoDB ObjectId - proper type for _id field
	private String day;
	private String breakfast;
	private String lunch;
	private String dinner;

	// ✅ Constructors
	public Menu() {
	}

	public Menu(String day, String breakfast, String lunch, String dinner) {
		this.day = day;
		this.breakfast = breakfast;
		this.lunch = lunch;
		this.dinner = dinner;
	}

	// ✅ Getters and Setters
	public ObjectId getId() {
		return id;
	}

	public void setId(ObjectId id) {
		this.id = id;
	}

	public String getDay() {
		return day;
	}

	public void setDay(String day) {
		this.day = day;
	}

	public String getBreakfast() {
		return breakfast;
	}

	public void setBreakfast(String breakfast) {
		this.breakfast = breakfast;
	}

	public String getLunch() {
		return lunch;
	}

	public void setLunch(String lunch) {
		this.lunch = lunch;
	}

	public String getDinner() {
		return dinner;
	}

	public void setDinner(String dinner) {
		this.dinner = dinner;
	}

	@Override
	public String toString() {
		return "Menu{" +
				"id='" + id + '\'' +
				", day='" + day + '\'' +
				", breakfast='" + breakfast + '\'' +
				", lunch='" + lunch + '\'' +
				", dinner='" + dinner + '\'' +
				'}';
	}
}
