package furniture.furniture.repository;

import furniture.furniture.model.CartItem;
import furniture.furniture.model.User;
import furniture.furniture.model.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUser(User user);
    List<CartItem> findByUserId(Long userId);
    Optional<CartItem> findByUserAndProduct(User user, Product product);
    void deleteByUser(User user);
    void deleteByUserId(Long userId);
}
