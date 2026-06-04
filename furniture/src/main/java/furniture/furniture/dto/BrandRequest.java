package furniture.furniture.dto;

import jakarta.validation.constraints.NotBlank;

public record BrandRequest(
    @NotBlank String name,
    String description
) {}
