package furniture.furniture.controller;

import furniture.furniture.dto.BrandRequest;
import furniture.furniture.model.Brand;
import furniture.furniture.repository.BrandRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class BrandController {

    private final BrandRepository brandRepository;

    @GetMapping("/api/brands")
    public List<Brand> getAllBrands() {
        return brandRepository.findAll();
    }

    @PostMapping("/api/admin/brands")
    public ResponseEntity<?> addBrand(@Valid @RequestBody BrandRequest request) {
        if (brandRepository.findByName(request.name()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error: Brand name already exists!"));
        }
        Brand brand = Brand.builder()
                .name(request.name())
                .description(request.description())
                .build();
        brandRepository.save(brand);
        return ResponseEntity.ok(Map.of("message", "Brand added successfully!"));
    }

    @PutMapping("/api/admin/brands/{id}")
    public ResponseEntity<?> updateBrand(
            @PathVariable Long id,
            @Valid @RequestBody BrandRequest request
    ) {
        Brand brand = brandRepository.findById(id)
                .orElse(null);
        if (brand == null) {
            return ResponseEntity.notFound().build();
        }

        // Check if name is unique among other brands
        var existing = brandRepository.findByName(request.name()).orElse(null);
        if (existing != null && !existing.getId().equals(id)) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error: Brand name already exists!"));
        }

        brand.setName(request.name());
        brand.setDescription(request.description());
        brandRepository.save(brand);
        return ResponseEntity.ok(Map.of("message", "Brand updated successfully!"));
    }
}
