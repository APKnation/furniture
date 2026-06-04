package furniture.furniture.config;

import furniture.furniture.model.Brand;
import furniture.furniture.model.Category;
import furniture.furniture.model.SubCategory;
import furniture.furniture.model.Product;
import furniture.furniture.model.Role;
import furniture.furniture.model.User;

import furniture.furniture.repository.BrandRepository;
import furniture.furniture.repository.CategoryRepository;
import furniture.furniture.repository.SubCategoryRepository;
import furniture.furniture.repository.ProductRepository;
import furniture.furniture.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DatabaseInitializer implements CommandLineRunner {

    private final UserRepository userRepository;

    private final BrandRepository brandRepository;
    private final CategoryRepository categoryRepository;
    private final SubCategoryRepository subCategoryRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) throws Exception {
        // Seed Admin User
        seedAdmin();
        // Seed Catalog
        seedCatalog();
    }




    private void seedAdmin() {
        if (userRepository.findByEmail("admin@furniture.com").isEmpty()) {
            User admin = User.builder()
                    .name("Admin Superuser")
                    .email("admin@furniture.com")
                    .password(passwordEncoder.encode("admin123"))
                    .mobileNumber("1234567890")
                    .role(Role.ADMIN)
                    .securityQuestion("What is your favorite color?")
                    .securityAnswer("blue")
                    .address("HQ Administrator Suite 1")
                    .build();
            userRepository.save(admin);
        }
    }

    private void seedCatalog() {
        if (categoryRepository.count() < 6) {
            Category livingRoom = categoryRepository.findByName("Living Room").orElseGet(() -> categoryRepository.save(Category.builder().name("Living Room").build()));
            Category bedroom = categoryRepository.findByName("Bedroom").orElseGet(() -> categoryRepository.save(Category.builder().name("Bedroom").build()));
            Category diningRoom = categoryRepository.findByName("Dining Room").orElseGet(() -> categoryRepository.save(Category.builder().name("Dining Room").build()));
            Category homeOffice = categoryRepository.findByName("Home Office").orElseGet(() -> categoryRepository.save(Category.builder().name("Home Office").build()));
            Category storage = categoryRepository.findByName("Storage").orElseGet(() -> categoryRepository.save(Category.builder().name("Storage").build()));
            Category outdoor = categoryRepository.findByName("Outdoor").orElseGet(() -> categoryRepository.save(Category.builder().name("Outdoor").build()));

            // Living Room Subcategories
            subCategoryRepository.saveAll(List.of(
                    SubCategory.builder().name("Sofas").category(livingRoom).build(),
                    SubCategory.builder().name("Coffee Tables").category(livingRoom).build(),
                    SubCategory.builder().name("TV Stands").category(livingRoom).build()
            ));

            // Bedroom Subcategories
            subCategoryRepository.saveAll(List.of(
                    SubCategory.builder().name("Beds").category(bedroom).build(),
                    SubCategory.builder().name("Wardrobes").category(bedroom).build(),
                    SubCategory.builder().name("Nightstands").category(bedroom).build()
            ));

            // Dining Room Subcategories
            subCategoryRepository.saveAll(List.of(
                    SubCategory.builder().name("Dining Tables").category(diningRoom).build(),
                    SubCategory.builder().name("Dining Chairs").category(diningRoom).build()
            ));

            // Home Office Subcategories
            subCategoryRepository.saveAll(List.of(
                    SubCategory.builder().name("Office Desks").category(homeOffice).build(),
                    SubCategory.builder().name("Office Chairs").category(homeOffice).build(),
                    SubCategory.builder().name("Bookshelves").category(homeOffice).build()
            ));

            // Storage Subcategories
            subCategoryRepository.saveAll(List.of(
                    SubCategory.builder().name("Cabinets").category(storage).build(),
                    SubCategory.builder().name("Shoe Racks").category(storage).build()
            ));

            // Outdoor Subcategories
            subCategoryRepository.saveAll(List.of(
                    SubCategory.builder().name("Patio Sets").category(outdoor).build(),
                    SubCategory.builder().name("Outdoor Sofas").category(outdoor).build()
            ));
        }

        if (brandRepository.count() == 0) {
            Brand ikea = Brand.builder().name("Ikea").description("Scandinavian modern furniture and accessories").build();
            Brand ashley = Brand.builder().name("Ashley").description("Classic American home furnishings").build();
            Brand wayfair = Brand.builder().name("Wayfair").description("Stylish and affordable home decor").build();
            brandRepository.saveAll(List.of(ikea, ashley, wayfair));
        }
    }
}
