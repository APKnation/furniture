package furniture.furniture.controller;

import furniture.furniture.dto.DashboardStatsDto;
import furniture.furniture.dto.OrderDto;
import furniture.furniture.dto.OrderItemDto;
import furniture.furniture.dto.ReportDto;
import furniture.furniture.model.*;
import furniture.furniture.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AdminController {

    private final UserRepository userRepository;
    private final OrderRepository orderRepository;
    private final ProductRepository productRepository;
    private final BrandRepository brandRepository;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStatsDto> getDashboardStats() {
        long newOrders = orderRepository.countByStatus(OrderStatus.NEW);
        long confirmedOrders = orderRepository.countByStatus(OrderStatus.CONFIRMED);
        long deliveredOrders = orderRepository.countByStatus(OrderStatus.DELIVERED);
        long canceledOrders = orderRepository.countByStatus(OrderStatus.CANCELED);
        long totalOrders = orderRepository.count();

        long totalProducts = productRepository.count();
        long totalBrands = brandRepository.count();
        long totalRegisteredUsers = userRepository.findByRole(Role.USER).size();

        DashboardStatsDto stats = new DashboardStatsDto(
                newOrders,
                confirmedOrders,
                deliveredOrders,
                canceledOrders,
                totalOrders,
                totalProducts,
                totalBrands,
                totalRegisteredUsers
        );
        return ResponseEntity.ok(stats);
    }

    @GetMapping("/users")
    public ResponseEntity<?> getRegisteredUsers() {
        List<User> users = userRepository.findByRole(Role.USER);
        List<?> userDtos = users.stream().map(u -> java.util.Map.of(
                "id", u.getId(),
                "name", u.getName(),
                "email", u.getEmail(),
                "mobileNumber", u.getMobileNumber() == null ? "" : u.getMobileNumber(),
                "regDate", u.getRegDate()
        )).collect(Collectors.toList());

        return ResponseEntity.ok(userDtos);
    }

    @GetMapping("/reports")
    public ResponseEntity<ReportDto> getSalesReport(
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate
    ) {
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

        return ResponseEntity.ok(new ReportDto(orderDtos, orderDtos.size(), totalSales));
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
                o.getUser().getId(),
                o.getUser().getName(),
                o.getUser().getEmail(),
                items
        );
    }
}
