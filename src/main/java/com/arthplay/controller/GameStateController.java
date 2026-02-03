package com.arthplay.controller;

import com.arthplay.model.GameState;
import com.arthplay.security.JwtUtils;
import com.arthplay.service.GameStateService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import jakarta.servlet.http.HttpServletRequest;

@RestController
@RequestMapping("/api/game")
public class GameStateController {

    @Autowired private GameStateService gameStateService;
    @Autowired private JwtUtils         jwtUtils;

    private String extractUserId() {
        HttpServletRequest req = ((ServletRequestAttributes)
                RequestContextHolder.getRequestAttributes()).getRequest();
        String token = req.getHeader("Authorization").substring(7);
        return jwtUtils.extractUserId(token);
    }

    /* ── GET /api/game/state ── */
    @GetMapping("/state")
    public ResponseEntity<GameState> getState() {
        return ResponseEntity.ok(gameStateService.getState(extractUserId()));
    }

    /* ── PUT /api/game/state ── */
    @PutMapping("/state")
    public ResponseEntity<GameState> updateState(@RequestBody GameState body) {
        return ResponseEntity.ok(gameStateService.updateState(extractUserId(), body));
    }
}
