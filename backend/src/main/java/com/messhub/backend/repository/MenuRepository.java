package com.messhub.backend.repository;

import com.messhub.backend.model.Menu;
import org.bson.types.ObjectId;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

/**
 * MenuRepository - MongoDB repository for Menu operations
 * Extends MongoRepository to provide CRUD operations
 * 
 * 🔥 IMPORTANT: Using ObjectId as the ID type to match Menu model
 */
@Repository
public interface MenuRepository extends MongoRepository<Menu, ObjectId> {
	// MongoRepository provides CRUD operations by default
	// Custom queries can be added here if needed
}
