package furniture.furniture.controller;

import furniture.furniture.dto.CheckoutRequest;
import furniture.furniture.dto.OrderDto;
import furniture.furniture.dto.OrderItemDto;
import furniture.furniture.dto.OrderStatusRequest;
import furniture.furniture.model.*;
import furniture.furniture.repository.*;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Transactional
public class OrderController {

    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    @PostMapping("/api/orders")
    public ResponseEntity<?> checkout(
            @AuthenticationPrincipal User currentUser,
            @Valid @RequestBody CheckoutRequest request
    ) {
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }

        List<CartItem> cartItems = cartItemRepository.findByUser(currentUser);
        if (cartItems.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error: Your cart is empty!"));
        }

        // Validate stock
        for (CartItem item : cartItems) {
            if (item.getProduct().getQuantity() < item.getQuantity()) {
                return ResponseEntity.badRequest().body(Map.of("message", 
                        "Error: Product " + item.getProduct().getName() + " does not have enough stock. Available: " + item.getProduct().getQuantity()));
            }
        }

        BigDecimal total = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        // Create Order
        String orderNum = "ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase();
        Order order = Order.builder()
                .orderNumber(orderNum)
                .user(currentUser)
                .status(OrderStatus.NEW)
                .shippingAddress(request.shippingAddress())
                .paymentMethod(request.paymentMethod())
                .paymentStatus(request.paymentMethod().equalsIgnoreCase("cash_on_delivery") ? "PENDING" : "PAID")
                .totalAmount(BigDecimal.ZERO) // Temporary
                .build();

        for (CartItem item : cartItems) {
            Product product = item.getProduct();
            
            // Decrement Stock
            product.setQuantity(product.getQuantity() - item.getQuantity());
            productRepository.save(product);

            BigDecimal price = product.getPrice();
            BigDecimal subTotal = price.multiply(BigDecimal.valueOf(item.getQuantity()));
            total = total.add(subTotal);

            OrderItem orderItem = OrderItem.builder()
                    .order(order)
                    .product(product)
                    .quantity(item.getQuantity())
                    .price(price)
                    .build();
            orderItems.add(orderItem);
        }

        order.setTotalAmount(total);
        order.setOrderItems(orderItems);
        orderRepository.save(order);

        // Clear Cart
        cartItemRepository.deleteByUser(currentUser);

        return ResponseEntity.ok(Map.of(
                "message", "Order placed successfully!",
                "orderNumber", orderNum
        ));
    }

    @GetMapping("/api/orders")
    public ResponseEntity<List<OrderDto>> getMyOrders(@AuthenticationPrincipal User currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }

        List<Order> orders = orderRepository.findByUser(currentUser);
        return ResponseEntity.ok(orders.stream().map(this::toDto).collect(Collectors.toList()));
    }

    @GetMapping("/api/orders/{id}")
    public ResponseEntity<?> getOrderDetails(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser
    ) {
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }

        Order order = orderRepository.findById(id).orElse(null);
        if (order == null) {
            return ResponseEntity.notFound().build();
        }

        // Allow owner or admin to view
        if (!order.getUser().getId().equals(currentUser.getId()) && !currentUser.getRole().name().equals("ADMIN")) {
            return ResponseEntity.status(403).body(Map.of("message", "Forbidden: You are not authorized to view this order."));
        }

        return ResponseEntity.ok(toDto(order));
    }

    @PutMapping("/api/orders/{id}/cancel")
    public ResponseEntity<?> cancelOrder(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser
    ) {
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }

        Order order = orderRepository.findById(id).orElse(null);
        if (order == null || !order.getUser().getId().equals(currentUser.getId())) {
            return ResponseEntity.notFound().build();
        }

        if (order.getStatus() != OrderStatus.NEW) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error: Only new orders can be canceled. Current status: " + order.getStatus()));
        }

        // Restore stock
        for (OrderItem item : order.getOrderItems()) {
            Product product = item.getProduct();
            product.setQuantity(product.getQuantity() + item.getQuantity());
            productRepository.save(product);
        }

        order.setStatus(OrderStatus.CANCELED);
        orderRepository.save(order);

        return ResponseEntity.ok(Map.of("message", "Order canceled successfully!"));
    }

    // Admin endpoints
    @GetMapping("/api/admin/orders")
    public ResponseEntity<List<OrderDto>> getAllOrders() {
        return ResponseEntity.ok(orderRepository.findAll().stream().map(this::toDto).collect(Collectors.toList()));
    }

    @GetMapping("/api/admin/orders/search")
    public ResponseEntity<?> searchOrderByNumber(@RequestParam String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber).orElse(null);
        if (order == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(toDto(order));
    }

    @PutMapping("/api/admin/orders/{id}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody OrderStatusRequest request
    ) {
        Order order = orderRepository.findById(id).orElse(null);
        if (order == null) {
            return ResponseEntity.notFound().build();
        }

        OrderStatus newStatus;
        try {
            newStatus = OrderStatus.valueOf(request.status().toUpperCase());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error: Invalid status value!"));
        }

        // If canceling the order from admin, and it was not previously canceled, restore stock
        if (newStatus == OrderStatus.CANCELED && order.getStatus() != OrderStatus.CANCELED) {
            for (OrderItem item : order.getOrderItems()) {
                Product product = item.getProduct();
                product.setQuantity(product.getQuantity() + item.getQuantity());
                productRepository.save(product);
            }
        }
        // If restoring a canceled order, deduct stock (verify availability first)
        else if (newStatus != OrderStatus.CANCELED && order.getStatus() == OrderStatus.CANCELED) {
            for (OrderItem item : order.getOrderItems()) {
                Product product = item.getProduct();
                if (product.getQuantity() < item.getQuantity()) {
                    return ResponseEntity.badRequest().body(Map.of("message", 
                            "Error: Cannot restore order. Product " + product.getName() + " does not have enough stock!"));
                }
                product.setQuantity(product.getQuantity() - item.getQuantity());
                productRepository.save(product);
            }
        }

        order.setStatus(newStatus);
        if (newStatus == OrderStatus.DELIVERED) {
            order.setPaymentStatus("PAID");
        }
        orderRepository.save(order);

        return ResponseEntity.ok(Map.of("message", "Order status updated to " + newStatus + " successfully!"));
    }

    private OrderDto toDto(Order o) {
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
