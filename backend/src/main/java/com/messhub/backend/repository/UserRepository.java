package com.messhub.backend.repository;

import com.messhub.backend.model.User;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends MongoRepository<User, String> {

    // ✅ ADD THIS METHOD (VERY IMPORTANT)
    Optional<User> findByEmailIgnoreCase(String email);

}