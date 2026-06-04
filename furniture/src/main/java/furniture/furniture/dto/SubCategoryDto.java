package furniture.furniture.dto;

import java.time.LocalDateTime;

public record SubCategoryDto(
    Long id,
    String name,
    Long categoryId,
    String categoryName,
    LocalDateTime creationDate
) {}
