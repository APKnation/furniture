package furniture.furniture.service;

import furniture.furniture.dto.AdminUserRequest;
import furniture.furniture.dto.DashboardStatsDto;
import furniture.furniture.dto.OrderDto;
import furniture.furniture.dto.OrderItemDto;
import furniture.furniture.dto.ReportDto;
import furniture.furniture.dto.SalesTrendDto;
import furniture.furniture.dto.TopProductDto;
import furniture.furniture.model.*;
import furniture.furniture.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.PageRequest;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class AdminService {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final OrderItemRepository orderItemRepository;
    private final PasswordEncoder passwordEncoder;

    public DashboardStatsDto getDashboardStats() {
        long newOrders = orderRepository.countByStatus(OrderStatus.NEW);
        long confirmedOrders = orderRepository.countByStatus(OrderStatus.CONFIRMED);
        long deliveredOrders = orderRepository.countByStatus(OrderStatus.DELIVERED);
        long canceledOrders = orderRepository.countByStatus(OrderStatus.CANCELED);
        long totalOrders = orderRepository.count();

        long totalProducts = productRepository.count();
        long totalBrands = 0;
        long totalRegisteredUsers = userRepository.findByRole(Role.USER).size();

        // Calculate Revenue and AOV
        List<Order> validOrders = orderRepository.findAll().stream()
                .filter(o -> o.getStatus() != OrderStatus.CANCELED)
                .collect(Collectors.toList());
        
        BigDecimal totalRevenue = validOrders.stream()
                .map(Order::getTotalAmount)
                .reduce(BigDecimal.ZERO, BigDecimal::add);
                
        BigDecimal averageOrderValue = BigDecimal.ZERO;
        if (!validOrders.isEmpty()) {
            averageOrderValue = totalRevenue.divide(BigDecimal.valueOf(validOrders.size()), 2, java.math.RoundingMode.HALF_UP);
        }

        // Fetch Top Products
        List<TopProductDto> topProducts = orderItemRepository.findTopSellingProducts(PageRequest.of(0, 5));

        return new DashboardStatsDto(
                newOrders, confirmedOrders, deliveredOrders, canceledOrders,
                totalOrders, totalProducts, totalBrands, totalRegisteredUsers,
                totalRevenue, averageOrderValue, topProducts
        );
    }

    public List<?> getRegisteredUsers() {
        List<User> users = userRepository.findByRole(Role.USER);
        return users.stream().map(u -> Map.of(
                "id", u.getId(),
                "name", u.getName(),
                "email", u.getEmail(),
                "mobileNumber", u.getMobileNumber() == null ? "" : u.getMobileNumber(),
                "regDate", u.getRegDate()
        )).collect(Collectors.toList());
    }

    public void addUser(AdminUserRequest request) {
        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new IllegalArgumentException("Error: Email is already in use!");
        }
        User user = User.builder()
                .name(request.name())
                .email(request.email())
                .password(passwordEncoder.encode("password123"))
                .mobileNumber(request.mobileNumber())
                .role(Role.USER)
                .build();
        userRepository.save(user);
    }

    public void updateUser(Long id, AdminUserRequest request) {
        User user = userRepository.findById(id).orElseThrow(() -> new RuntimeException("User not found"));
        Optional<User> existing = userRepository.findByEmail(request.email());
        if (existing.isPresent() && !existing.get().getId().equals(id)) {
            throw new IllegalArgumentException("Error: Email is already in use!");
        }
        user.setName(request.name());
        user.setEmail(request.email());
        user.setMobileNumber(request.mobileNumber());
        userRepository.save(user);
    }

    public void deleteUser(Long id) {
        if (!userRepository.existsById(id)) {
            throw new RuntimeException("User not found");
        }
        try {
            userRepository.deleteById(id);
        } catch (Exception e) {
            throw new IllegalStateException("Cannot delete user. They may be linked to existing orders.");
        }
    }

    public List<SalesTrendDto> getSalesTrend(LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(LocalTime.MAX);
        List<Order> orders = orderRepository.findOrdersByDateRange(startDateTime, endDateTime);
        Map<LocalDate, BigDecimal> dailyTotals = orders.stream()
                .collect(Collectors.groupingBy(o -> o.getOrderDate().toLocalDate(),
                        Collectors.mapping(Order::getTotalAmount,
                                Collectors.reducing(BigDecimal.ZERO, BigDecimal::add))));
        return dailyTotals.entrySet().stream()
                .map(e -> new SalesTrendDto(e.getKey(), e.getValue()))
                .sorted(java.util.Comparator.comparing(SalesTrendDto::date))
                .collect(Collectors.toList());
    }

    public ReportDto getSalesReport(LocalDate startDate, LocalDate endDate) {
        LocalDateTime startDateTime = startDate.atStartOfDay();
        LocalDateTime endDateTime = endDate.atTime(LocalTime.MAX);
        List<Order> orders = orderRepository.findOrdersByDateRange(startDateTime, endDateTime);
        BigDecimal totalSales = orderRepository.sumSalesByDateRange(startDateTime, endDateTime);
        if (totalSales == null) {
            totalSales = BigDecimal.ZERO;
        }
        List<OrderDto> orderDtos = orders.stream()
                .map(this::toOrderDto)
                .collect(Collectors.toList());
        BigDecimal averageOrderValue = BigDecimal.ZERO;
        if (!orderDtos.isEmpty()) {
            averageOrderValue = totalSales.divide(BigDecimal.valueOf(orderDtos.size()), 2, java.math.RoundingMode.HALF_UP);
        }
        return new ReportDto(orderDtos, orderDtos.size(), totalSales, averageOrderValue);
    }
    private OrderDto toOrderDto(Order o) {
        List<OrderItemDto> items = o.getOrderItems().stream().map(item -> {
            BigDecimal price = item.getPrice();
            BigDecimal subTotal = price.multiply(BigDecimal.valueOf(item.getQuantity()));
            return new OrderItemDto(
                    item.getId(),
                    item.getProduct().getId(),
                    item.getProduct().getName(),
                    item.getProduct().getImagePath(),
                    item.getQuantity(),
                    price,
                    subTotal
            );
        }).collect(Collectors.toList());
        return new OrderDto(
                o.getId(),
                o.getOrderNumber(),
                o.getOrderDate(),
                o.getStatus().name(),
                o.getTotalAmount(),
                o.getShippingAddress(),
                o.getPaymentStatus(),
                o.getPaymentMethod(),
                o.getBankName(),
                o.getMobileProvider(),
                o.getPhoneNumber(),
                o.getCreditCardNumber(),
                o.getUser().getId(),
                o.getUser().getName(),
                o.getUser().getEmail(),
                items
        );
    }
}





