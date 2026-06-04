package furniture.furniture.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record ProductDto(
    Long id,
    String name,
    String description,
    BigDecimal price,
    Integer quantity,
    String imagePath,
    Long brandId,
    String brandName,
    Long subCategoryId,
    String subCategoryName,
    Long categoryId,
    String categoryName,
    LocalDateTime creationDate
) {}
