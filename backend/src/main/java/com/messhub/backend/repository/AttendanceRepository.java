package com.messhub.backend.repository;

import com.messhub.backend.model.Attendance;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * AttendanceRepository - MongoDB repository for Attendance operations
 * Provides CRUD operations and custom queries for attendance records
 */
@Repository
public interface AttendanceRepository extends MongoRepository<Attendance, String> {
	
	/**
	 * Find all attendance records for a specific user email
	 * @param userEmail The email of the user
	 * @return List of attendance records for the user
	 */
	List<Attendance> findByUserEmail(String userEmail);

	/**
	 * Find attendance record for a specific user on a specific date for a specific meal
	 * Used to prevent duplicate attendance entries
	 * @param userEmail The email of the user
	 * @param date The date (YYYY-MM-DD format)
	 * @param mealType The meal type (BREAKFAST, LUNCH, DINNER)
	 * @return Optional containing attendance record if found
	 */
	Optional<Attendance> findByUserEmailAndDateAndMealType(String userEmail, String date, String mealType);

	/**
	 * Find all attendance records for a specific date
	 * @param date The date to search for
	 * @return List of attendance records for the date
	 */
	List<Attendance> findByDate(String date);

	/**
	 * Find all attendance records for a specific date and meal type
	 * @param date The date to search for
	 * @param mealType The meal type
	 * @return List of attendance records
	 */
	List<Attendance> findByDateAndMealType(String date, String mealType);
}
