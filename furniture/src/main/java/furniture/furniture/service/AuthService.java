package furniture.furniture.service;

import furniture.furniture.dto.AuthRequest;
import furniture.furniture.dto.AuthResponse;
import furniture.furniture.dto.RecoverPasswordRequest;
import furniture.furniture.dto.RegisterRequest;
import furniture.furniture.model.Role;
import furniture.furniture.model.User;
import furniture.furniture.repository.UserRepository;
import furniture.furniture.security.JwtService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public void register(RegisterRequest request) {
        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new IllegalArgumentException("Error: Email is already in use!");
        }

        User user = User.builder()
                .name(request.name())
                .email(request.email())
                .password(passwordEncoder.encode(request.password()))
                .mobileNumber(request.mobileNumber())
                .role(Role.USER)
                .build();

        userRepository.save(user);
    }

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new UsernameNotFoundException("User not found: " + request.email()));

        String token = jwtService.generateToken(user);
        return new AuthResponse(
                token,
                user.getEmail(),
                user.getName(),
                user.getRole().name()
        );
    }

    public void recoverPassword(RecoverPasswordRequest request) {
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new IllegalArgumentException("Error: User with this email does not exist!"));

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
    }
}
