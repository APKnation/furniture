package furniture.furniture.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record AdminUserRequest(
    @NotBlank String name,
    @NotBlank @Email String email,
    String mobileNumber
) {}
