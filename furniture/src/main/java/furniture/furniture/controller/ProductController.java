package furniture.furniture.controller;

import furniture.furniture.dto.ProductDto;
import furniture.furniture.dto.ProductRequest;
import furniture.furniture.model.Category;
import furniture.furniture.model.Product;
import furniture.furniture.repository.CategoryRepository;
import furniture.furniture.repository.ProductRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class ProductController {

    private final ProductRepository productRepository;
    private final CategoryRepository categoryRepository;

    @GetMapping("/api/products")
    public List<ProductDto> getProducts(
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String search
    ) {
        List<Product> products;

        if (search != null && !search.trim().isEmpty()) {
            products = productRepository.searchProducts(search.trim());
        } else if (categoryId != null) {
            products = productRepository.findByCategoryId(categoryId);
        } else {
            products = productRepository.findAll();
        }

        return products.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @GetMapping("/api/products/{id}")
    public ResponseEntity<ProductDto> getProductById(@PathVariable Long id) {
        Product product = productRepository.findById(id).orElse(null);
        if (product == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(toDto(product));
    }

    @PostMapping("/api/admin/products")
    public ResponseEntity<?> addProduct(@Valid @RequestBody ProductRequest request) {
        Category category = categoryRepository.findById(request.categoryId()).orElse(null);
        if (category == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error: Category not found!"));
        }

        Product product = Product.builder()
                .name(request.name())
                .description(request.description())
                .price(request.price())
                .quantity(request.quantity())
                .imagePath(request.imagePath())
                .category(category)
                .build();

        productRepository.save(product);
        return ResponseEntity.ok(Map.of("message", "Product added successfully!"));
    }

    @PutMapping("/api/admin/products/{id}")
    public ResponseEntity<?> updateProduct(
            @PathVariable Long id,
            @Valid @RequestBody ProductRequest request
    ) {
        Product product = productRepository.findById(id).orElse(null);
        if (product == null) {
            return ResponseEntity.notFound().build();
        }

        Category category = categoryRepository.findById(request.categoryId()).orElse(null);
        if (category == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error: Category not found!"));
        }

        product.setName(request.name());
        product.setDescription(request.description());
        product.setPrice(request.price());
        product.setQuantity(request.quantity());
        product.setImagePath(request.imagePath());
        product.setCategory(category);

        productRepository.save(product);
        return ResponseEntity.ok(Map.of("message", "Product updated successfully!"));
    }

    @DeleteMapping("/api/admin/products/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Long id) {
        if (!productRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        try {
            productRepository.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Product deleted successfully!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Cannot delete product. It may be linked to existing orders."));
        }
    }

    @PostMapping("/api/admin/products/upload")
    public ResponseEntity<?> uploadProductImage(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error: File is empty!"));
        }

        try {
            Path uploadDir = Paths.get("./uploads");
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }

            String originalFileName = file.getOriginalFilename();
            String fileExtension = "";
            if (originalFileName != null && originalFileName.contains(".")) {
                fileExtension = originalFileName.substring(originalFileName.lastIndexOf("."));
            }
            String uniqueFileName = UUID.randomUUID().toString() + fileExtension;

            Path targetPath = uploadDir.resolve(uniqueFileName);
            Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

            String imagePath = "http://localhost:8080/uploads/" + uniqueFileName;
            return ResponseEntity.ok(Map.of("imagePath", imagePath));
        } catch (IOException e) {
            return ResponseEntity.internalServerError().body(Map.of("message", "Error uploading file: " + e.getMessage()));
        }
    }

    private ProductDto toDto(Product p) {
        return new ProductDto(
                p.getId(),
                p.getName(),
                p.getDescription(),
                p.getPrice(),
                p.getQuantity(),
                p.getImagePath(),
                p.getCategory().getId(),
                p.getCategory().getName(),
                p.getCreationDate()
        );
    }
}
