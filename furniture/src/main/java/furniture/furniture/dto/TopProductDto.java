package furniture.furniture.dto;

import java.math.BigDecimal;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TopProductDto {
    private Long id;
    private String name;
    private long unitsSold;
    private BigDecimal revenue;
}
