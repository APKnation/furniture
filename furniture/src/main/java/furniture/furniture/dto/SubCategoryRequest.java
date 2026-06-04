package furniture.furniture.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record SubCategoryRequest(
    @NotBlank String name,
    @NotNull Long categoryId
) {}
