package com.messhub.backend.controller;

import com.messhub.backend.model.Menu;
import com.messhub.backend.repository.MenuRepository;
import org.bson.types.ObjectId;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/menu")
public class MenuController {

    @Autowired
    private MenuRepository menuRepository;

    // 🔐 ADMIN ONLY
    @PostMapping
    public ResponseEntity<?> addMenu(@RequestBody Menu menu) {

        // ✅ Validation
        if (menu == null ||
            menu.getDay() == null || menu.getDay().isEmpty() ||
            menu.getBreakfast() == null || menu.getBreakfast().isEmpty() ||
            menu.getLunch() == null || menu.getLunch().isEmpty() ||
            menu.getDinner() == null || menu.getDinner().isEmpty()) {

            return ResponseEntity
                    .badRequest()
                    .body("All fields are required");
        }

        // ✅ Save
        Menu savedMenu = menuRepository.save(menu);

        return ResponseEntity.status(HttpStatus.CREATED).body(savedMenu);
    }

    // 🔐 ADMIN + STUDENT
    @GetMapping
    public ResponseEntity<?> getAllMenus() {

        List<Menu> menus = menuRepository.findAll();

        // ✅ Empty handling (important)
        if (menus.isEmpty()) {
            return ResponseEntity.ok(List.of()); // empty list भेजे
        }

        return ResponseEntity.ok(menus);
    }

    // 🔐 ADMIN ONLY
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteMenu(@PathVariable String id) {

        // ✅ Step 1: Validate ID is not null/empty
        if (id == null || id.trim().isEmpty()) {
            System.out.println("❌ Menu ID is null or empty");
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Menu ID is required"));
        }

        // ✅ Step 2: Validate ObjectId format
        if (!ObjectId.isValid(id)) {
            System.out.println("❌ Invalid ObjectId format: " + id);
            return ResponseEntity.badRequest()
                    .body(Map.of("message", "Invalid menu ID format"));
        }

        try {
            // ✅ Step 3: Convert String to ObjectId
            ObjectId objectId = new ObjectId(id);
            System.out.println("🔥 Attempting to delete menu with ID: " + objectId);

            // ✅ Step 4: Check if menu exists
            if (!menuRepository.existsById(objectId)) {
                System.out.println("❌ Menu not found: " + objectId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("message", "Menu not found"));
            }

            // ✅ Step 5: Delete
            menuRepository.deleteById(objectId);
            System.out.println("✅ Menu deleted successfully: " + objectId);

            return ResponseEntity.ok(Map.of("message", "Menu deleted successfully"));

        } catch (Exception e) {
            // Any unexpected error
            System.out.println("❌ Delete error: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Error deleting menu: " + e.getMessage()));
        }
    }
}