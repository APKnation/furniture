package furniture.furniture.dto;

import java.math.BigDecimal;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record ProductRequest(
    @NotBlank String name,
    String description,
    @NotNull @PositiveOrZero BigDecimal price,
    @NotNull @PositiveOrZero Integer quantity,
    String imagePath,
    @NotNull Long categoryId
) {}
