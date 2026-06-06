package furniture.furniture.controller;

import furniture.furniture.dto.CartDto;
import furniture.furniture.dto.CartRequest;
import furniture.furniture.model.User;
import furniture.furniture.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class CartController {

    private final CartService cartService;

    @GetMapping
    public ResponseEntity<CartDto> getCart(@AuthenticationPrincipal User currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(cartService.getCart(currentUser));
    }

    @PostMapping("/items")
    public ResponseEntity<?> addToCart(
            @AuthenticationPrincipal User currentUser,
            @Valid @RequestBody CartRequest request
    ) {
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }
        try {
            cartService.addToCart(currentUser, request);
            return ResponseEntity.ok(Map.of("message", "Item added to cart successfully!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        }
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
        try {
            cartService.updateCartQuantity(id, currentUser, quantity);
            return ResponseEntity.ok(Map.of("message", "Cart quantity updated successfully!"));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (IllegalStateException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/items/{id}")
    public ResponseEntity<?> removeCartItem(
            @PathVariable Long id,
            @AuthenticationPrincipal User currentUser
    ) {
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }
        try {
            cartService.removeCartItem(id, currentUser);
            return ResponseEntity.ok(Map.of("message", "Item removed from cart successfully!"));
        } catch (IllegalStateException e) {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping
    public ResponseEntity<?> clearCart(@AuthenticationPrincipal User currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(401).build();
        }
        cartService.clearCart(currentUser);
        return ResponseEntity.ok(Map.of("message", "Cart cleared successfully!"));
    }
}
