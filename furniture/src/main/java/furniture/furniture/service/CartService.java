package furniture.furniture.service;

import furniture.furniture.dto.CartDto;
import furniture.furniture.dto.CartItemDto;
import furniture.furniture.dto.CartRequest;
import furniture.furniture.model.CartItem;
import furniture.furniture.model.Product;
import furniture.furniture.model.User;
import furniture.furniture.repository.CartItemRepository;
import furniture.furniture.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;

    public CartDto getCart(User currentUser) {
        List<CartItem> items = cartItemRepository.findByUser(currentUser);
        List<CartItemDto> itemDtos = items.stream()
                .map(this::toDto)
                .collect(Collectors.toList());

        BigDecimal total = itemDtos.stream()
                .map(CartItemDto::subTotal)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        return new CartDto(itemDtos, total);
    }

    public void addToCart(User currentUser, CartRequest request) {
        Product product = productRepository.findById(request.productId())
                .orElseThrow(() -> new IllegalArgumentException("Error: Product not found!"));

        if (product.getQuantity() < request.quantity()) {
            throw new IllegalArgumentException("Error: Only " + product.getQuantity() + " items available in stock!");
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
            int newQuantity = cartItem.getQuantity() + request.quantity();
            if (product.getQuantity() < newQuantity) {
                throw new IllegalArgumentException("Error: Total quantity in cart exceeds available stock (" + product.getQuantity() + ")!");
            }
            cartItem.setQuantity(newQuantity);
        }

        cartItemRepository.save(cartItem);
    }

    public void updateCartQuantity(Long id, User currentUser, int quantity) {
        if (quantity <= 0) {
            throw new IllegalArgumentException("Error: Quantity must be greater than zero!");
        }

        CartItem cartItem = cartItemRepository.findById(id).orElse(null);
        if (cartItem == null || !cartItem.getUser().getId().equals(currentUser.getId())) {
            throw new IllegalStateException("Cart item not found");
        }

        Product product = cartItem.getProduct();
        if (product.getQuantity() < quantity) {
            throw new IllegalArgumentException("Error: Only " + product.getQuantity() + " items available in stock!");
        }

        cartItem.setQuantity(quantity);
        cartItemRepository.save(cartItem);
    }

    public void removeCartItem(Long id, User currentUser) {
        CartItem cartItem = cartItemRepository.findById(id).orElse(null);
        if (cartItem == null || !cartItem.getUser().getId().equals(currentUser.getId())) {
            throw new IllegalStateException("Cart item not found");
        }

        cartItemRepository.delete(cartItem);
    }

    public void clearCart(User currentUser) {
        cartItemRepository.deleteByUser(currentUser);
    }

    public void mergeCart(User currentUser, List<CartRequest> items) {
        for (CartRequest request : items) {
            try {
                addToCart(currentUser, request);
            } catch (IllegalArgumentException e) {
                // Skip items that fail (out of stock, not found, etc.)
            }
        }
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
