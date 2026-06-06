package furniture.furniture.service;

import furniture.furniture.dto.CategoryRequest;
import furniture.furniture.model.Category;
import furniture.furniture.repository.CategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;

    public List<Category> getAllCategories() {
        return categoryRepository.findAll();
    }

    public void addCategory(CategoryRequest request) {
        if (categoryRepository.findByName(request.name()).isPresent()) {
            throw new IllegalArgumentException("Error: Category name already exists!");
        }
        Category category = Category.builder()
                .name(request.name())
                .build();
        categoryRepository.save(category);
    }

    public void updateCategory(Long id, CategoryRequest request) {
        Category category = categoryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Category not found"));

        var existing = categoryRepository.findByName(request.name()).orElse(null);
        if (existing != null && !existing.getId().equals(id)) {
            throw new IllegalArgumentException("Error: Category name already exists!");
        }

        category.setName(request.name());
        categoryRepository.save(category);
    }
}
