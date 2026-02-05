package com.arthplay.controller;

import com.arthplay.model.GameState;
import com.arthplay.service.GameStateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;

@RestController
@RequestMapping("/api/game")
public class GameStateController {

    @Autowired
    private GameStateService gameStateService;

    private String getCurrentUserEmail() {
        Authentication auth =
                SecurityContextHolder.getContext().getAuthentication();
        return auth.getName(); // comes from JWT
    }

    /* ── GET /api/game/state ── */
    @GetMapping("/state")
    public ResponseEntity<GameState> getState() {
        return ResponseEntity.ok(
                gameStateService.getState(getCurrentUserEmail())
        );
    }

    /* ── PUT /api/game/state ── */
    @PutMapping("/state")
    public ResponseEntity<GameState> updateState(
            @RequestBody GameState body
    ) {
        return ResponseEntity.ok(
                gameStateService.updateState(getCurrentUserEmail(), body)
        );
    }
}
