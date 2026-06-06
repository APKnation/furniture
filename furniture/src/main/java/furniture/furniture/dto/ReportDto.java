package furniture.furniture.dto;

import java.math.BigDecimal;
import java.util.List;

public record ReportDto(
    List<OrderDto> orders,
    long totalOrders,
    BigDecimal totalSales,
    BigDecimal averageOrderValue
) {}
