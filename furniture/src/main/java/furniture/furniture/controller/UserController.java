package furniture.furniture.controller;

import furniture.furniture.dto.ChangePasswordRequest;
import furniture.furniture.dto.UpdateProfileRequest;
import furniture.furniture.model.User;
import furniture.furniture.repository.UserRepository;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class UserController {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @GetMapping("/profile")
    public ResponseEntity<?> getProfile(@AuthenticationPrincipal User currentUser) {
        if (currentUser == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }
        return ResponseEntity.ok(Map.of(
                "id", currentUser.getId(),
                "name", currentUser.getName(),
                "email", currentUser.getEmail(),
                "mobileNumber", currentUser.getMobileNumber() == null ? "" : currentUser.getMobileNumber(),
                "address", currentUser.getAddress() == null ? "" : currentUser.getAddress(),
                "securityQuestion", currentUser.getSecurityQuestion() == null ? "" : currentUser.getSecurityQuestion(),
                "securityAnswer", currentUser.getSecurityAnswer() == null ? "" : currentUser.getSecurityAnswer(),
                "role", currentUser.getRole().name()
        ));
    }

    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(
            @AuthenticationPrincipal User currentUser,
            @Valid @RequestBody UpdateProfileRequest request
    ) {
        if (currentUser == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }

        User user = userRepository.findById(currentUser.getId()).orElseThrow();
        user.setName(request.name());
        user.setMobileNumber(request.mobileNumber());
        user.setAddress(request.address());
        user.setSecurityQuestion(request.securityQuestion());
        user.setSecurityAnswer(request.securityAnswer());

        userRepository.save(user);
        return ResponseEntity.ok(Map.of("message", "Profile updated successfully!"));
    }

    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(
            @AuthenticationPrincipal User currentUser,
            @Valid @RequestBody ChangePasswordRequest request
    ) {
        if (currentUser == null) {
            return ResponseEntity.status(401).body(Map.of("message", "Unauthorized"));
        }

        User user = userRepository.findById(currentUser.getId()).orElseThrow();
        if (!passwordEncoder.matches(request.oldPassword(), user.getPassword())) {
            return ResponseEntity.badRequest().body(Map.of("message", "Error: Incorrect old password!"));
        }

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);

        return ResponseEntity.ok(Map.of("message", "Password changed successfully!"));
    }
}
