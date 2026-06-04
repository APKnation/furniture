package furniture.furniture.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record RegisterRequest(
    @NotBlank String name,
    @NotBlank @Email String email,
    @NotBlank String password,
    String mobileNumber,
    String securityQuestion,
    String securityAnswer,
    String address
) {}
