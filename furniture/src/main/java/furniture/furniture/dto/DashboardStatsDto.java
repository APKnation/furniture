package furniture.furniture.dto;

import java.math.BigDecimal;
import java.util.List;

public record DashboardStatsDto(
    long totalNewOrders,
    long totalConfirmedOrders,
    long totalDeliveredOrders,
    long totalCanceledOrders,
    long totalOrders,
    long totalProducts,
    long totalBrands,
    long totalRegisteredUsers,
    BigDecimal totalRevenue,
    BigDecimal averageOrderValue,
    List<TopProductDto> topProducts
) {}

