package furniture.furniture.controller;

import furniture.furniture.dto.SubCategoryDto;
import furniture.furniture.dto.SubCategoryRequest;
import furniture.furniture.model.Category;
import furniture.furniture.model.SubCategory;
import furniture.furniture.repository.CategoryRepository;
import furniture.furniture.repository.SubCategoryRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class SubCategoryController {

    private final SubCategoryRepository subCategoryRepository;
    private final CategoryRepository categoryRepository;

    @GetMapping("/api/subcategories")
    public List<SubCategoryDto> getAllSubCategories() {
        return subCategoryRepository.findAll().stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/api/subcategories/category/{categoryId}")
    public List<SubCategoryDto> getSubCategoriesByCategory(@PathVariable Long categoryId) {
        return subCategoryRepository.findByCategoryId(categoryId).stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @PostMapping("/api/admin/subcategories")
    public ResponseEntity<?> addSubCategory(@Valid @RequestBody SubCategoryRequest request) {
        Category category = categoryRepository.findById(request.categoryId())
                .orElse(null);
        if (category == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error: Category not found!"));
        }

        SubCategory subCategory = SubCategory.builder()
                .name(request.name())
                .category(category)
                .build();
        subCategoryRepository.save(subCategory);
        return ResponseEntity.ok(Map.of("message", "Sub-category added successfully!"));
    }

    @PutMapping("/api/admin/subcategories/{id}")
    public ResponseEntity<?> updateSubCategory(
            @PathVariable Long id,
            @Valid @RequestBody SubCategoryRequest request
    ) {
        SubCategory subCategory = subCategoryRepository.findById(id)
                .orElse(null);
        if (subCategory == null) {
            return ResponseEntity.notFound().build();
        }

        Category category = categoryRepository.findById(request.categoryId())
                .orElse(null);
        if (category == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error: Category not found!"));
        }

        subCategory.setName(request.name());
        subCategory.setCategory(category);
        subCategoryRepository.save(subCategory);
        return ResponseEntity.ok(Map.of("message", "Sub-category updated successfully!"));
    }

    private SubCategoryDto toDto(SubCategory subCategory) {
        return new SubCategoryDto(
                subCategory.getId(),
                subCategory.getName(),
                subCategory.getCategory().getId(),
                subCategory.getCategory().getName(),
                subCategory.getCreationDate()
        );
    }
}
