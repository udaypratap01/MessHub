package com.messhub.backend.repository;

import com.messhub.backend.model.Order;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import org.bson.types.ObjectId;
import java.util.List;

@Repository
public interface OrderRepository extends MongoRepository<Order, ObjectId> {
    // Find orders by user email
    List<Order> findByUserEmail(String userEmail);
    
    // Find order by ID using ObjectId
    Order findById(String id);
}
