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

    private final org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;

    @GetMapping("/dashboard")
    public ResponseEntity<DashboardStatsDto> getDashboardStats() {
        long newOrders = orderRepository.countByStatus(OrderStatus.NEW);
        long confirmedOrders = orderRepository.countByStatus(OrderStatus.CONFIRMED);
        long deliveredOrders = orderRepository.countByStatus(OrderStatus.DELIVERED);
        long canceledOrders = orderRepository.countByStatus(OrderStatus.CANCELED);
        long totalOrders = orderRepository.count();

        long totalProducts = productRepository.count();
    long totalBrands = 0;
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

    @PostMapping("/users")
    public ResponseEntity<?> addUser(@jakarta.validation.Valid @RequestBody furniture.furniture.dto.AdminUserRequest request) {
        if (userRepository.findByEmail(request.email()).isPresent()) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", "Error: Email is already in use!"));
        }
        User user = User.builder()
                .name(request.name())
                .email(request.email())
                .password(passwordEncoder.encode("password123"))
                .mobileNumber(request.mobileNumber())
                .role(Role.USER)
                .build();
        userRepository.save(user);
        return ResponseEntity.ok(java.util.Map.of("message", "User created successfully!"));
    }

    @PutMapping("/users/{id}")
    public ResponseEntity<?> updateUser(@PathVariable Long id, @jakarta.validation.Valid @RequestBody furniture.furniture.dto.AdminUserRequest request) {
        User user = userRepository.findById(id).orElse(null);
        if (user == null) {
            return ResponseEntity.notFound().build();
        }
        // Check if email is taken by another user
        java.util.Optional<User> existing = userRepository.findByEmail(request.email());
        if (existing.isPresent() && !existing.get().getId().equals(id)) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", "Error: Email is already in use!"));
        }

        user.setName(request.name());
        user.setEmail(request.email());
        user.setMobileNumber(request.mobileNumber());
        userRepository.save(user);
        return ResponseEntity.ok(java.util.Map.of("message", "User updated successfully!"));
    }

    @DeleteMapping("/users/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable Long id) {
        if (!userRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        try {
            userRepository.deleteById(id);
            return ResponseEntity.ok(java.util.Map.of("message", "User deleted successfully!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(java.util.Map.of("message", "Cannot delete user. They may be linked to existing orders."));
        }
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

        BigDecimal averageOrderValue = BigDecimal.ZERO;
        if (orderDtos.size() > 0) {
            averageOrderValue = totalSales.divide(BigDecimal.valueOf(orderDtos.size()), 2, java.math.RoundingMode.HALF_UP);
        }

        return ResponseEntity.ok(new ReportDto(orderDtos, orderDtos.size(), totalSales, averageOrderValue));
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
