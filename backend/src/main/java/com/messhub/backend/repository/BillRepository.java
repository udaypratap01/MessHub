package com.messhub.backend.repository;

import com.messhub.backend.model.Bill;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * BillRepository - MongoDB repository for Bill operations
 * Extends MongoRepository to provide CRUD operations
 */
@Repository
public interface BillRepository extends MongoRepository<Bill, String> {
	
	/**
	 * Find all bills for a specific user
	 * @param userId The ID of the user (student)
	 * @return List of bills for the user
	 */
	List<Bill> findByUserId(String userId);

	/**
	 * Find bill for a specific user in a specific month
	 * @param userId The ID of the user
	 * @param month The month to search for
	 * @return Bill record if found
	 */
	Bill findByUserIdAndMonth(String userId, String month);
}
