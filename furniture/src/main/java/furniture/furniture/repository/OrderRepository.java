package furniture.furniture.repository;

import furniture.furniture.model.Order;
import furniture.furniture.model.OrderStatus;
import furniture.furniture.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUser(User user);
    List<Order> findByUserId(Long userId);
    Optional<Order> findByOrderNumber(String orderNumber);
    long countByStatus(OrderStatus status);

    @Query("SELECT o FROM Order o WHERE o.orderDate BETWEEN :startDate AND :endDate")
    List<Order> findOrdersByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);

    @Query("SELECT SUM(o.totalAmount) FROM Order o WHERE o.status != 'CANCELED' AND o.orderDate BETWEEN :startDate AND :endDate")
    BigDecimal sumSalesByDateRange(@Param("startDate") LocalDateTime startDate, @Param("endDate") LocalDateTime endDate);
}
