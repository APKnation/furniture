package furniture.furniture.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public record OrderDto(
    Long id,
    String orderNumber,
    LocalDateTime orderDate,
    String status,
    BigDecimal totalAmount,
    String shippingAddress,
    String paymentStatus,
    String paymentMethod,
    String bankName,
    String mobileProvider,
    String phoneNumber,
    String creditCardNumber,
    Long userId,
    String userName,
    String userEmail,
    List<OrderItemDto> items
) {}
