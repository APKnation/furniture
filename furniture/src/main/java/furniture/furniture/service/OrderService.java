package furniture.furniture.service;

import furniture.furniture.dto.CheckoutRequest;
import furniture.furniture.dto.OrderDto;
import furniture.furniture.dto.OrderItemDto;
import furniture.furniture.dto.OrderStatusRequest;
import furniture.furniture.model.*;
import furniture.furniture.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class OrderService {

    private final OrderRepository orderRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    public String checkout(User currentUser, CheckoutRequest request) {
        List<CartItem> cartItems = cartItemRepository.findByUser(currentUser);
        if (cartItems.isEmpty()) {
            throw new IllegalArgumentException("Error: Your cart is empty!");
        }

        // Validate stock
        for (CartItem item : cartItems) {
            if (item.getProduct().getQuantity() < item.getQuantity()) {
                throw new IllegalArgumentException("Error: Product " + item.getProduct().getName() + " does not have enough stock. Available: " + item.getProduct().getQuantity());
            }
        }

        BigDecimal total = BigDecimal.ZERO;
        List<OrderItem> orderItems = new ArrayList<>();

        // Create Order
        String orderNum = "ORD-" + UUID.randomUUID().toString().substring(0,3).toUpperCase();
        Order order = Order.builder()
                .orderNumber(orderNum)
                .user(currentUser)
                .status(OrderStatus.NEW)
                .shippingAddress(request.shippingAddress())
                .paymentMethod(request.paymentMethod())
                .paymentStatus(request.paymentMethod().equalsIgnoreCase("cash_on_delivery") ? "PENDING" : "PAID")
                .bankName(request.bankName())
                .mobileProvider(request.mobileProvider())
                .phoneNumber(request.phoneNumber())
                .creditCardNumber(request.creditCardNumber())
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

        return orderNum;
    }

    public List<OrderDto> getMyOrders(User currentUser) {
        List<Order> orders = orderRepository.findByUser(currentUser);
        return orders.stream().map(this::toDto).collect(Collectors.toList());
    }

    public OrderDto getOrderDetails(Long id, User currentUser) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getUser().getId().equals(currentUser.getId()) && !currentUser.getRole().name().equals("ADMIN")) {
            throw new SecurityException("Forbidden: You are not authorized to view this order.");
        }

        return toDto(order);
    }

    public void cancelOrder(Long id, User currentUser) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        if (!order.getUser().getId().equals(currentUser.getId())) {
            throw new RuntimeException("Order not found"); // Mask as not found
        }

        if (order.getStatus() != OrderStatus.NEW) {
            throw new IllegalArgumentException("Error: Only new orders can be canceled. Current status: " + order.getStatus());
        }

        // Restore stock
        for (OrderItem item : order.getOrderItems()) {
            Product product = item.getProduct();
            product.setQuantity(product.getQuantity() + item.getQuantity());
            productRepository.save(product);
        }

        order.setStatus(OrderStatus.CANCELED);
        orderRepository.save(order);
    }

    public List<OrderDto> getAllOrders() {
        return orderRepository.findAll().stream().map(this::toDto).collect(Collectors.toList());
    }

    public OrderDto searchOrderByNumber(String orderNumber) {
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new RuntimeException("Order not found"));
        return toDto(order);
    }

    public void updateOrderStatus(Long id, OrderStatusRequest request) {
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Order not found"));

        OrderStatus newStatus;
        try {
            newStatus = OrderStatus.valueOf(request.status().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Error: Invalid status value!");
        }

        if (newStatus == OrderStatus.CANCELED && order.getStatus() != OrderStatus.CANCELED) {
            for (OrderItem item : order.getOrderItems()) {
                Product product = item.getProduct();
                product.setQuantity(product.getQuantity() + item.getQuantity());
                productRepository.save(product);
            }
        }
        else if (newStatus != OrderStatus.CANCELED && order.getStatus() == OrderStatus.CANCELED) {
            for (OrderItem item : order.getOrderItems()) {
                Product product = item.getProduct();
                if (product.getQuantity() < item.getQuantity()) {
                    throw new IllegalArgumentException("Error: Cannot restore order. Product " + product.getName() + " does not have enough stock!");
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
