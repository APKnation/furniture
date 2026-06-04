package furniture.furniture.controller;

import furniture.furniture.dto.CategoryRequest;
import furniture.furniture.model.Category;
import furniture.furniture.repository.CategoryRepository;
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

    private final CategoryRepository categoryRepository;

    @GetMapping("/api/categories")
    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    @PostMapping("/api/admin/categories")
    public ResponseEntity<?> addCategory(@Valid @RequestBody CategoryRequest request) {
        if (categoryRepository.findByName(request.name()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error: Category name already exists!"));
        }
        Category category = Category.builder()
                .name(request.name())
                .build();
        categoryRepository.save(category);
        return ResponseEntity.ok(Map.of("message", "Category added successfully!"));
    }

    @PutMapping("/api/admin/categories/{id}")
    public ResponseEntity<?> updateCategory(
            @PathVariable Long id,
            @Valid @RequestBody CategoryRequest request
    ) {
        Category category = categoryRepository.findById(id)
                .orElse(null);
        if (category == null) {
            return ResponseEntity.notFound().build();
        }

        var existing = categoryRepository.findByName(request.name()).orElse(null);
        if (existing != null && !existing.getId().equals(id)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error: Category name already exists!"));
        }

        category.setName(request.name());
        categoryRepository.save(category);
        return ResponseEntity.ok(Map.of("message", "Category updated successfully!"));
    }
}
