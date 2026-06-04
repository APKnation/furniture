package furniture.furniture.dto;

import jakarta.validation.constraints.NotBlank;

public record CheckoutRequest(
    @NotBlank String shippingAddress,
    @NotBlank String paymentMethod
) {}
