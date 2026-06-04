package furniture.furniture.config;

import furniture.furniture.model.*;
import furniture.furniture.repository.*;
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


        if (pageRepository.findByPageName("aboutus").isEmpty()) {

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
        if (brandRepository.count() == 0) {
            Brand ikea = Brand.builder().name("Ikea").description("Scandinavian modern furniture and accessories").build();
            Brand ashley = Brand.builder().name("Ashley").description("Classic American home furnishings").build();
            Brand wayfair = Brand.builder().name("Wayfair").description("Stylish and affordable home decor").build();
            brandRepository.saveAll(List.of(ikea, ashley, wayfair));

            Category livingRoom = Category.builder().name("Living Room").build();
            Category bedroom = Category.builder().name("Bedroom").build();
            Category diningRoom = Category.builder().name("Dining Room").build();
            categoryRepository.saveAll(List.of(livingRoom, bedroom, diningRoom));

            SubCategory sofas = SubCategory.builder().name("Sofas").category(livingRoom).build();
            SubCategory beds = SubCategory.builder().name("Beds").category(bedroom).build();
            SubCategory tables = SubCategory.builder().name("Dining Tables").category(diningRoom).build();
            subCategoryRepository.saveAll(List.of(sofas, beds, tables));

            Product product1 = Product.builder()
                    .name("Elegant Leather Sofa")
                    .description("Premium top-grain leather sofa with high-density foam cushions for maximum comfort.")
                    .price(new BigDecimal("899.99"))
                    .quantity(20)
                    .brand(ikea)
                    .subCategory(sofas)
                    .imagePath("/images/leather-sofa.jpg")
                    .build();

            Product product2 = Product.builder()
                    .name("Modern King Bed Frame")
                    .description("Sturdy wooden bed frame with upholstered headboard. Mattress not included.")
                    .price(new BigDecimal("450.00"))
                    .quantity(15)
                    .brand(ashley)
                    .subCategory(beds)
                    .imagePath("/images/king-bed.jpg")
                    .build();

            Product product3 = Product.builder()
                    .name("Solid Oak Dining Table")
                    .description("Beautiful solid oak dining table, seats up to 6 people comfortably.")
                    .price(new BigDecimal("620.00"))
                    .quantity(10)
                    .brand(wayfair)
                    .subCategory(tables)
                    .imagePath("/images/dining-table.jpg")
                    .build();

            productRepository.saveAll(List.of(product1, product2, product3));
        }
    }
}
