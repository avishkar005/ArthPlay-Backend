package com.arthplay.service;

import com.arthplay.model.User;
import com.arthplay.repository.UserRepository;
import com.arthplay.security.JwtUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Map;

@Service
public class AuthService {

    @Autowired private UserRepository        userRepo;
    @Autowired private PasswordEncoder       passwordEncoder;
    @Autowired private JwtUtils              jwtUtils;
    @Autowired private AuthenticationManager authManager;

    /* ── REGISTER ── */
    public Map<String, String> register(String email, String password, String displayName) {
        if (userRepo.existsByEmail(email))
            throw new RuntimeException("Email already registered");

        User user = User.builder()
                .email(email)
                .passwordHash(passwordEncoder.encode(password))
                .displayName(displayName)
                .role("USER")
                .createdAt(LocalDateTime.now())
                .lastLoginAt(LocalDateTime.now())
                .build();

        User saved = userRepo.save(user);
        String token = jwtUtils.generateToken(saved.getEmail(), saved.getId());

        return Map.of(
                "token",       token,
                "userId",     saved.getId(),
                "email",       saved.getEmail(),
                "displayName", saved.getDisplayName()
        );
    }

    /* ── LOGIN ── */
    public Map<String, String> login(String email, String password) {
        // Spring Security validates credentials; throws on failure
        authManager.authenticate(
                new UsernamePasswordAuthenticationToken(email, password));

        User user = userRepo.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        user.setLastLoginAt(LocalDateTime.now());
        userRepo.save(user);

        String token = jwtUtils.generateToken(user.getEmail(), user.getId());

        return Map.of(
                "token",       token,
                "userId",     user.getId(),
                "email",       user.getEmail(),
                "displayName", user.getDisplayName()
        );
    }
}
