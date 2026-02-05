package com.arthplay.controller;

import com.arthplay.model.UserProfile;
import com.arthplay.service.ProfileService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    @Autowired
    private ProfileService profileService;

    private String getCurrentUserEmail() {
        Authentication auth = SecurityContextHolder
                .getContext()
                .getAuthentication();
        return auth.getName(); // email / username from JWT
    }

    /* ── GET /api/profile ── */
    @GetMapping
    public ResponseEntity<UserProfile> getProfile() {
        return ResponseEntity.ok(
                profileService.getProfile(getCurrentUserEmail())
        );
    }

    /* ── PUT /api/profile ── */
    @PutMapping
    public ResponseEntity<UserProfile> updateProfile(
            @RequestBody UserProfile body
    ) {
        return ResponseEntity.ok(
                profileService.saveProfile(getCurrentUserEmail(), body)
        );
    }
}
