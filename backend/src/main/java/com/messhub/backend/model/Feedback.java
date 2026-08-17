package com.messhub.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;

@Document(collection = "feedback")
public class Feedback {

    @Id
    private String id;
    private String userName;
    private String userEmail;
    private String category; // FOOD, MANAGEMENT, CLEANLINESS
    private int rating; // 1-5
    private String message;
    private LocalDateTime createdAt;

    // Constructors
    public Feedback() {
        this.createdAt = LocalDateTime.now();
    }

    public Feedback(String userName, String userEmail, String category, int rating, String message) {
        this.userName = userName;
        this.userEmail = userEmail;
        this.category = category;
        this.rating = rating;
        this.message = message;
        this.createdAt = LocalDateTime.now();
    }

    // Getters and Setters
    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getUserName() {
        return userName;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getCategory() {
        return category;
    }

    public void setCategory(String category) {
        this.category = category;
    }

    public int getRating() {
        return rating;
    }

    public void setRating(int rating) {
        this.rating = rating;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String toString() {
        return "Feedback{" +
                "id='" + id + '\'' +
                ", userName='" + userName + '\'' +
                ", userEmail='" + userEmail + '\'' +
                ", category='" + category + '\'' +
                ", rating=" + rating +
                ", message='" + message + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}
