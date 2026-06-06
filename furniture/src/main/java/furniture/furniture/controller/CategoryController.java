package furniture.furniture.controller;

import furniture.furniture.dto.CategoryRequest;
import furniture.furniture.model.Category;
import furniture.furniture.service.CategoryService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CategoryController {

    private final CategoryService categoryService;

    @GetMapping("/api/categories")
    public List<Category> getAllCategories() {
        return categoryService.getAllCategories();
    }

    @PostMapping("/api/admin/categories")
    public ResponseEntity<?> addCategory(@Valid @RequestBody CategoryRequest request) {
        try {
            categoryService.addCategory(request);
            return ResponseEntity.ok(Map.of("message", "Category added successfully!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/api/admin/categories/{id}")
    public ResponseEntity<?> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategoryRequest request
    ) {
        try {
            categoryService.updateCategory(id, request);
            return ResponseEntity.ok(Map.of("message", "Category updated successfully!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (RuntimeException e) {
            if (e.getMessage().equals("Category not found")) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
