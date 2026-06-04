package furniture.furniture.controller;

import furniture.furniture.dto.CartDto;
import furniture.furniture.dto.CartItemDto;
import furniture.furniture.dto.CartRequest;
import furniture.furniture.model.CartItem;
import furniture.furniture.model.Product;
import furniture.furniture.model.User;
import furniture.furniture.repository.CartItemRepository;
import furniture.furniture.repository.ProductRepository;
import jakarta.transaction.Transactional;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
@Transactional
public class CartController {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    @GetMapping
    public ResponseEntity<CartDto> getCart(@AuthenticationPrincipal User currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }

        List<CartItem> items = cartItemRepository.findByUser(currentUser);
        List<CartItemDto> itemDtos = items.stream()
                .map(this::toDto)
                .collect(Collectors.toList());

        BigDecimal total = itemDtos.stream()
                .map(CartItemDto::subTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return ResponseEntity.ok(new CartDto(itemDtos, total));
    }

    @PostMapping("/items")
    public ResponseEntity<?> addToCart(
            @AuthenticationPrincipal User currentUser,
            @Valid @RequestBody CartRequest request
    ) {
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }

        Product product = productRepository.findById(request.productId()).orElse(null);
        if (product == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error: Product not found!"));
        }

        // Validate stock level
        if (product.getQuantity() < request.quantity()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error: Only " + product.getQuantity() + " items available in stock!"));
        }

        CartItem cartItem = cartItemRepository.findByUserAndProduct(currentUser, product)
                .orElse(null);

        if (cartItem == null) {
            cartItem = CartItem.builder()
                    .user(currentUser)
                    .product(product)
                    .quantity(request.quantity())
                    .build();
        } else {
            // Update quantity
            int newQuantity = cartItem.getQuantity() + request.quantity();
            if (product.getQuantity() < newQuantity) {
                return ResponseEntity.badRequest().body(Map.of("message", "Error: Total quantity in cart exceeds available stock (" + product.getQuantity() + ")!"));
            }
            cartItem.setQuantity(newQuantity);
        }

        cartItemRepository.save(cartItem);
        return ResponseEntity.ok(Map.of("message", "Item added to cart successfully!"));
    }

    @PutMapping("/items/{id}")
    public ResponseEntity<?> updateCartQuantity(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser,
            @RequestParam int quantity
    ) {
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }

        if (quantity <= 0) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error: Quantity must be greater than zero!"));
        }

        CartItem cartItem = cartItemRepository.findById(id).orElse(null);
        if (cartItem == null || !cartItem.getUser().getId().equals(currentUser.getId())) {
            return ResponseEntity.notFound().build();
        }

        Product product = cartItem.getProduct();
        if (product.getQuantity() < quantity) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error: Only " + product.getQuantity() + " items available in stock!"));
        }

        cartItem.setQuantity(quantity);
        cartItemRepository.save(cartItem);
        return ResponseEntity.ok(Map.of("message", "Cart quantity updated successfully!"));
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<?> removeCartItem(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser
    ) {
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }

        CartItem cartItem = cartItemRepository.findById(id).orElse(null);
        if (cartItem == null || !cartItem.getUser().getId().equals(currentUser.getId())) {
            return ResponseEntity.notFound().build();
        }

        cartItemRepository.delete(cartItem);
        return ResponseEntity.ok(Map.of("message", "Item removed from cart successfully!"));
    }

    @DeleteMapping
    public ResponseEntity<?> clearCart(@AuthenticationPrincipal User currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }

        cartItemRepository.deleteByUser(currentUser);
        return ResponseEntity.ok(Map.of("message", "Cart cleared successfully!"));
    }

    private CartItemDto toDto(CartItem item) {
        BigDecimal price = item.getProduct().getPrice();
        BigDecimal subTotal = price.multiply(BigDecimal.valueOf(item.getQuantity()));
        return new CartItemDto(
                item.getId(),
                item.getProduct().getId(),
                item.getProduct().getName(),
                price,
                item.getProduct().getImagePath(),
                item.getQuantity(),
                subTotal
        );
    }
}
