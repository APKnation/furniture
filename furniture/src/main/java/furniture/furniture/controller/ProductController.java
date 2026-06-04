package furniture.furniture.controller;

import furniture.furniture.dto.ProductDto;
import furniture.furniture.dto.ProductRequest;
import furniture.furniture.model.Brand;
import furniture.furniture.model.Product;
import furniture.furniture.model.SubCategory;
import furniture.furniture.repository.BrandRepository;
import furniture.furniture.repository.ProductRepository;
import furniture.furniture.repository.SubCategoryRepository;
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
    private final BrandRepository brandRepository;
    private final SubCategoryRepository subCategoryRepository;

    @GetMapping("/api/products")
    public List<ProductDto> getProducts(
            @RequestParam(required = false) Long brandId,
            @RequestParam(required = false) Long subCategoryId,
            @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String search
    ) {
        List<Product> products;

        if (search != null && !search.trim().isEmpty()) {
            products = productRepository.searchProducts(search.trim());
        } else if (brandId != null) {
            products = productRepository.findByBrandId(brandId);
        } else if (subCategoryId != null) {
            products = productRepository.findBySubCategoryId(subCategoryId);
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
        Brand brand = brandRepository.findById(request.brandId()).orElse(null);
        if (brand == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error: Brand not found!"));
        }

        SubCategory subCategory = subCategoryRepository.findById(request.subCategoryId()).orElse(null);
        if (subCategory == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error: Sub-category not found!"));
        }

        Product product = Product.builder()
                .name(request.name())
                .description(request.description())
                .price(request.price())
                .quantity(request.quantity())
                .imagePath(request.imagePath())
                .brand(brand)
                .subCategory(subCategory)
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

        Brand brand = brandRepository.findById(request.brandId()).orElse(null);
        if (brand == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error: Brand not found!"));
        }

        SubCategory subCategory = subCategoryRepository.findById(request.subCategoryId()).orElse(null);
        if (subCategory == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error: Sub-category not found!"));
        }

        product.setName(request.name());
        product.setDescription(request.description());
        product.setPrice(request.price());
        product.setQuantity(request.quantity());
        product.setImagePath(request.imagePath());
        product.setBrand(brand);
        product.setSubCategory(subCategory);

        productRepository.save(product);
        return ResponseEntity.ok(Map.of("message", "Product updated successfully!"));
    }

    private ProductDto toDto(Product p) {
        return new ProductDto(
                p.getId(),
                p.getName(),
                p.getDescription(),
                p.getPrice(),
                p.getQuantity(),
                p.getImagePath(),
                p.getBrand().getId(),
                p.getBrand().getName(),
                p.getSubCategory().getId(),
                p.getSubCategory().getName(),
                p.getSubCategory().getCategory().getId(),
                p.getSubCategory().getCategory().getName(),
                p.getCreationDate()
        );
    }
}
