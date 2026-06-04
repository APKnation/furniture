package furniture.furniture.dto;

import java.math.BigDecimal;

public record CartItemDto(
    Long id,
    Long productId,
    String productName,
    BigDecimal productPrice,
    String productImage,
    Integer quantity,
    BigDecimal subTotal
) {}
