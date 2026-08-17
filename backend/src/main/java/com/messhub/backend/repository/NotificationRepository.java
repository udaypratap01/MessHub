package com.messhub.backend.repository;

import com.messhub.backend.model.Notification;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * NotificationRepository - MongoDB repository for Notification operations
 * Provides CRUD operations and custom queries for notifications
 */
@Repository
public interface NotificationRepository extends MongoRepository<Notification, String> {
	
	/**
	 * Find all notifications sorted by creation date (latest first)
	 * @return List of all notifications ordered by createdAt descending
	 */
	List<Notification> findAllByOrderByCreatedAtDesc();
	
	/**
	 * Find notifications created by a specific admin
	 * @param createdBy The admin email
	 * @return List of notifications created by the admin
	 */
	List<Notification> findByCreatedByOrderByCreatedAtDesc(String createdBy);
}
