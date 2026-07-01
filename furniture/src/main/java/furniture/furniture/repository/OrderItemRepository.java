package furniture.furniture.repository;

import furniture.furniture.model.OrderItem;
import furniture.furniture.dto.TopProductDto;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByOrderId(Long orderId);

    @Query("SELECT new furniture.furniture.dto.TopProductDto(p.id, p.name, SUM(oi.quantity), SUM(oi.price * oi.quantity)) FROM OrderItem oi JOIN oi.product p JOIN oi.order o WHERE o.status != 'CANCELED' GROUP BY p.id, p.name ORDER BY SUM(oi.quantity) DESC")
    List<TopProductDto> findTopSellingProducts(Pageable pageable);
}
