package furniture.furniture.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record SalesTrendDto(LocalDate date, BigDecimal total) {}
