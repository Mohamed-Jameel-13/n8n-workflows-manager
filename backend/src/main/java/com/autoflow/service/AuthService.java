package com.autoflow.service;

import com.autoflow.dto.AuthResponse;
import com.autoflow.dto.LoginRequest;
import com.autoflow.dto.SignupRequest;
import com.autoflow.entity.User;
import com.autoflow.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;
import java.util.UUID;

@Service
public class AuthService {

    private final UserRepository userRepository;

    public AuthService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Transactional(readOnly = true)
    public Optional<AuthResponse> login(LoginRequest request) {
        if (request.getUsername() == null || request.getPassword() == null) {
            return Optional.empty();
        }

        String username = request.getUsername().trim();
        Optional<User> userOpt = userRepository.findByUsername(username);

        if (userOpt.isPresent()) {
            User user = userOpt.get();
            if (user.getPassword().equals(request.getPassword())) {
                String token = "jwt_" + UUID.randomUUID().toString().replace("-", "");
                return Optional.of(new AuthResponse(
                        token,
                        user.getId(),
                        user.getUsername(),
                        user.getEmail(),
                        user.getFullName(),
                        user.getRole()
                ));
            }
        }

        return Optional.empty();
    }

    @Transactional
    public AuthResponse signup(SignupRequest request) {
        if (request.getUsername() == null || request.getUsername().trim().isBlank()) {
            throw new IllegalArgumentException("Username cannot be empty");
        }
        if (request.getPassword() == null || request.getPassword().isBlank()) {
            throw new IllegalArgumentException("Password cannot be empty");
        }

        String username = request.getUsername().trim();
        if (userRepository.existsByUsername(username)) {
            throw new IllegalArgumentException("Username '" + username + "' already exists");
        }

        String email = request.getEmail() != null && !request.getEmail().isBlank() ?
                request.getEmail().trim() : username + "@autoflow.io";
        String fullName = request.getFullName() != null && !request.getFullName().isBlank() ?
                request.getFullName().trim() : username;

        User user = new User(username, request.getPassword(), fullName, email, "USER");
        User saved = userRepository.save(user);

        String token = "jwt_" + UUID.randomUUID().toString().replace("-", "");
        return new AuthResponse(token, saved.getId(), saved.getUsername(), saved.getEmail(), saved.getFullName(), saved.getRole());
    }

    @Transactional(readOnly = true)
    public Optional<AuthResponse> getUserByUsername(String username) {
        return userRepository.findByUsername(username)
                .map(u -> new AuthResponse("current", u.getId(), u.getUsername(), u.getEmail(), u.getFullName(), u.getRole()));
    }
}
