package com.messhub.backend.controller;

import com.messhub.backend.model.ExtraFood;
import com.messhub.backend.repository.ExtraFoodRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/extra-food")
public class ExtraFoodController {

    @Autowired
    private ExtraFoodRepository extraFoodRepository;

    // 🔐 ADMIN ONLY - Add extra food item
    @PostMapping
    public ResponseEntity<?> addExtraFood(@RequestBody ExtraFood extraFood) {

        // ✅ Step 1: Validate input
        if (extraFood == null ||
            extraFood.getName() == null || extraFood.getName().trim().isEmpty() ||
            extraFood.getPrice() == null || extraFood.getPrice() <= 0 ||
            extraFood.getQuantity() == null || extraFood.getQuantity() < 0) {

            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Name, price (>0), and quantity (>=0) are required"));
        }

        // ✅ Step 2: Save to database
        ExtraFood savedFood = extraFoodRepository.save(extraFood);

        System.out.println("✅ Extra food added: " + savedFood.getName());

        return ResponseEntity.status(HttpStatus.CREATED).body(savedFood);
    }

    // 🔐 ADMIN + STUDENT - View all extra food items
    @GetMapping
    public ResponseEntity<?> getAllExtraFood() {

        List<ExtraFood> foods = extraFoodRepository.findAll();

        // ✅ Empty handling
        if (foods.isEmpty()) {
            return ResponseEntity.ok(List.of());
        }

        return ResponseEntity.ok(foods);
    }

    // 🔐 ADMIN ONLY - Update extra food item
    @PutMapping("/{id}")
    public ResponseEntity<?> updateExtraFood(@PathVariable String id, @RequestBody ExtraFood extraFood) {

        // ✅ Step 1: Validate ID
        if (id == null || id.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Food ID is required"));
        }

        // ✅ Step 2: Validate ObjectId format
        if (!ObjectId.isValid(id)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Invalid food ID format"));
        }

        try {
            // ✅ Step 3: Convert to ObjectId
            ObjectId objectId = new ObjectId(id);

            // ✅ Step 4: Check if exists
            if (!extraFoodRepository.existsById(objectId)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Extra food not found"));
            }

            // ✅ Step 5: Validate input
            if (extraFood == null ||
                extraFood.getName() == null || extraFood.getName().trim().isEmpty() ||
                extraFood.getPrice() == null || extraFood.getPrice() <= 0 ||
                extraFood.getQuantity() == null || extraFood.getQuantity() < 0) {

                return ResponseEntity.badRequest()
                        .body(Map.of("message", "Name, price (>0), and quantity (>=0) are required"));
            }

            // ✅ Step 6: Update
            extraFood.setId(objectId);
            ExtraFood updated = extraFoodRepository.save(extraFood);

            System.out.println("✅ Extra food updated: " + updated.getName());

            return ResponseEntity.ok(updated);

        } catch (Exception e) {
            System.out.println("❌ Update error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error updating food: " + e.getMessage()));
        }
    }

    // 🔐 ADMIN ONLY - Delete extra food item
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteExtraFood(@PathVariable String id) {

        // ✅ Step 1: Validate ID
        if (id == null || id.trim().isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Food ID is required"));
        }

        // ✅ Step 2: Validate ObjectId format
        if (!ObjectId.isValid(id)) {
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Invalid food ID format"));
        }

        try {
            // ✅ Step 3: Convert to ObjectId
            ObjectId objectId = new ObjectId(id);

            // ✅ Step 4: Check if exists
            if (!extraFoodRepository.existsById(objectId)) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Extra food not found"));
            }

            // ✅ Step 5: Delete
            extraFoodRepository.deleteById(objectId);

            System.out.println("✅ Extra food deleted: " + id);

            return ResponseEntity.ok(Map.of("message", "Extra food deleted successfully"));

        } catch (Exception e) {
            System.out.println("❌ Delete error: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error deleting food: " + e.getMessage()));
        }
    }
}
