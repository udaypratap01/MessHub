package com.messhub.backend.repository;

import com.messhub.backend.model.Feedback;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface FeedbackRepository extends MongoRepository<Feedback, String> {
    
    // Get all feedback by user email (sorted by date, latest first)
    List<Feedback> findByUserEmailOrderByCreatedAtDesc(String userEmail);
    
    // Get all feedback (sorted by date, latest first)
    List<Feedback> findAllByOrderByCreatedAtDesc();
}
