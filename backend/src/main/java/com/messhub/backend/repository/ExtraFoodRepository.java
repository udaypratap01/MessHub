package com.messhub.backend.repository;

import com.messhub.backend.model.ExtraFood;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import org.bson.types.ObjectId;

@Repository
public interface ExtraFoodRepository extends MongoRepository<ExtraFood, ObjectId> {
    // Find by ID using ObjectId
    ExtraFood findById(String id);
}
