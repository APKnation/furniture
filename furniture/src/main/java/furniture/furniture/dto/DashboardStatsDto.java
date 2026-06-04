package furniture.furniture.dto;

public record DashboardStatsDto(
    long totalNewOrders,
    long totalConfirmedOrders,
    long totalDeliveredOrders,
    long totalCanceledOrders,
    long totalOrders,
    long totalProducts,
    long totalBrands,
    long totalRegisteredUsers
) {}
