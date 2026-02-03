package com.arthplay.controller;

import com.arthplay.model.UserProfile;
import com.arthplay.security.JwtUtils;
import com.arthplay.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired private ProfileService profileService;
    @Autowired private JwtUtils        jwtUtils;

    private String extractUserId() {
        HttpServletRequest req = ((ServletRequestAttributes)
                RequestContextHolder.getRequestAttributes()).getRequest();
        String token = req.getHeader("Authorization").substring(7);
        return jwtUtils.extractUserId(token);
    }

    /* ── GET /api/profile ── */
    @GetMapping
    public ResponseEntity<UserProfile> getProfile() {
        return ResponseEntity.ok(profileService.getProfile(extractUserId()));
    }

    /* ── PUT /api/profile ── */
    @PutMapping
    public ResponseEntity<UserProfile> updateProfile(@RequestBody UserProfile body) {
        return ResponseEntity.ok(profileService.saveProfile(extractUserId(), body));
    }
}
