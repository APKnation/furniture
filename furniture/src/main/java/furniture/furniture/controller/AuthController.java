package furniture.furniture.controller;

import furniture.furniture.dto.*;
import furniture.furniture.model.Role;
import furniture.furniture.model.User;
import furniture.furniture.repository.UserRepository;
import furniture.furniture.security.JwtService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class AuthController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest request) {
        if (userRepository.findByEmail(request.email()).isPresent()) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error: Email is already in use!"));
        }

        User user = User.builder()
                .name(request.name())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .mobileNumber(request.mobileNumber())
                .role(Role.USER)
                .securityQuestion(request.securityQuestion())
                .securityAnswer(request.securityAnswer())
                .address(request.address())
                .build();

        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "User registered successfully!"));
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + request.email()));

        String token = jwtService.generateToken(user);
        return ResponseEntity.ok(new AuthResponse(
                token,
                user.getEmail(),
                user.getName(),
                user.getRole().name()
        ));
    }

    @PostMapping("/recover-password")
    public ResponseEntity<?> recoverPassword(@Valid @RequestBody RecoverPasswordRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElse(null);

        if (user == null) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error: User with this email does not exist!"));
        }

        if (user.getSecurityQuestion() == null || !user.getSecurityQuestion().equalsIgnoreCase(request.securityQuestion()) ||
                user.getSecurityAnswer() == null || !user.getSecurityAnswer().equalsIgnoreCase(request.securityAnswer())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error: Invalid security question or answer!"));
        }

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Password recovered and reset successfully!"));
    }
}
