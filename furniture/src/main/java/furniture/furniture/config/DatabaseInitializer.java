package furniture.furniture.config;

import furniture.furniture.model.Category;
import furniture.furniture.model.Product;
import furniture.furniture.model.Role;
import furniture.furniture.model.User;

import furniture.furniture.repository.CategoryRepository;
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

    private final CategoryRepository categoryRepository;
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
                    .build();
            userRepository.save(admin);
        }
    }

    private void seedCatalog() {
        if (categoryRepository.count() < 6) {
            categoryRepository.save(Category.builder().name("Living Room").build());
            categoryRepository.save(Category.builder().name("Bedroom").build());
            categoryRepository.save(Category.builder().name("Dining Room").build());
            categoryRepository.save(Category.builder().name("Home Office").build());
            categoryRepository.save(Category.builder().name("Storage").build());
            categoryRepository.save(Category.builder().name("Outdoor").build());
        }
    }
}
