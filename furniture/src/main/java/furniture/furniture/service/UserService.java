package furniture.furniture.service;

import furniture.furniture.dto.ChangePasswordRequest;
import furniture.furniture.dto.UpdateProfileRequest;
import furniture.furniture.model.User;
import furniture.furniture.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    public void updateProfile(User currentUser, UpdateProfileRequest request) {
        User user = userRepository.findById(currentUser.getId()).orElseThrow();
        user.setName(request.name());
        user.setMobileNumber(request.mobileNumber());
        userRepository.save(user);
    }

    public void changePassword(User currentUser, ChangePasswordRequest request) {
        User user = userRepository.findById(currentUser.getId()).orElseThrow();
        if (!passwordEncoder.matches(request.oldPassword(), user.getPassword())) {
            throw new IllegalArgumentException("Error: Incorrect old password!");
        }

        user.setPassword(passwordEncoder.encode(request.newPassword()));
        userRepository.save(user);
    }
}
