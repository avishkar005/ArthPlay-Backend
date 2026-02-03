package com.arthplay.controller;

import com.arthplay.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    /* ── POST /api/auth/register ── */
    @PostMapping("/register")
    public ResponseEntity<?> register(@RequestBody Map<String, String> body) {
        try {
            String email       = body.get("email");
            String password    = body.get("password");
            String displayName = body.get("displayName");

            if (email == null || password == null || displayName == null)
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "email, password, displayName are required"));

            Map<String, String> result = authService.register(email, password, displayName);
            return ResponseEntity.ok(result);

        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(Map.of("error", e.getMessage()));
        }
    }

    /* ── POST /api/auth/login ── */
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody Map<String, String> body) {
        try {
            String email    = body.get("email");
            String password = body.get("password");

            if (email == null || password == null)
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "email and password are required"));

            Map<String, String> result = authService.login(email, password);
            return ResponseEntity.ok(result);

        } catch (Exception e) {
            return ResponseEntity.status(401)
                    .body(Map.of("error", "Invalid email or password"));
        }
    }
}
