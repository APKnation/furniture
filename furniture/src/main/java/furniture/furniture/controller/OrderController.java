package furniture.furniture.controller;

import furniture.furniture.dto.CheckoutRequest;
import furniture.furniture.dto.OrderDto;
import furniture.furniture.dto.OrderStatusRequest;
import furniture.furniture.model.User;
import furniture.furniture.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class OrderController {

    private final OrderService orderService;

    @PostMapping("/api/orders")
    public ResponseEntity<?> checkout(
            @AuthenticationPrincipal User currentUser,
            @Valid @RequestBody CheckoutRequest request
    ) {
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }
        try {
            String orderNum = orderService.checkout(currentUser, request);
            return ResponseEntity.ok(Map.of(
                    "message", "Order placed successfully!",
                    "orderNumber", orderNum
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @GetMapping("/api/orders")
    public ResponseEntity<List<OrderDto>> getMyOrders(@AuthenticationPrincipal User currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(orderService.getMyOrders(currentUser));
    }

    @GetMapping("/api/orders/{id}")
    public ResponseEntity<?> getOrderDetails(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser
    ) {
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }
        try {
            return ResponseEntity.ok(orderService.getOrderDetails(id, currentUser));
        } catch (SecurityException e) {
            return ResponseEntity.status(403).body(Map.of("message", e.getMessage()));
        } catch (RuntimeException e) {
            if (e.getMessage().equals("Order not found")) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/api/orders/{id}/cancel")
    public ResponseEntity<?> cancelOrder(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser
    ) {
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }
        try {
            orderService.cancelOrder(id, currentUser);
            return ResponseEntity.ok(Map.of("message", "Order canceled successfully!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (RuntimeException e) {
            if (e.getMessage().equals("Order not found")) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    // Admin endpoints
    @GetMapping("/api/admin/orders")
    public ResponseEntity<List<OrderDto>> getAllOrders() {
        return ResponseEntity.ok(orderService.getAllOrders());
    }

    @GetMapping("/api/admin/orders/search")
    public ResponseEntity<?> searchOrderByNumber(@RequestParam String orderNumber) {
        try {
            return ResponseEntity.ok(orderService.searchOrderByNumber(orderNumber));
        } catch (RuntimeException e) {
            if (e.getMessage().equals("Order not found")) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }

    @PutMapping("/api/admin/orders/{id}/status")
    public ResponseEntity<?> updateOrderStatus(
            @PathVariable Long id,
            @Valid @RequestBody OrderStatusRequest request
    ) {
        try {
            orderService.updateOrderStatus(id, request);
            return ResponseEntity.ok(Map.of("message", "Order status updated to " + request.status().toUpperCase() + " successfully!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (RuntimeException e) {
            if (e.getMessage().equals("Order not found")) {
                return ResponseEntity.notFound().build();
            }
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
    }
}
