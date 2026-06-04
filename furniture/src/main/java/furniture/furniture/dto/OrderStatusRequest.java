package furniture.furniture.dto;

import jakarta.validation.constraints.NotBlank;

public record OrderStatusRequest(
    @NotBlank String status
) {}
