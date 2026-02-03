package com.arthplay.service;

import com.arthplay.model.GameState;
import com.arthplay.repository.GameStateRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class GameStateService {

    @Autowired
    private GameStateRepository gameStateRepo;

    /* ── fetch or initialise ── */
    public GameState getState(String userId) {
        return gameStateRepo.findByUserId(userId)
                .orElse(GameState.builder()
                        .userId(userId)
                        .money(10000)
                        .happiness(75)
                        .security(60)
                        .streak(0)
                        .scenarioIndex(0)
                        .build());
    }

    /* ── full-state upsert from frontend ── */
    public GameState updateState(String userId, GameState incoming) {
        GameState state = gameStateRepo.findByUserId(userId)
                .orElse(GameState.builder().userId(userId).build());

        state.setMoney(incoming.getMoney());
        state.setHappiness(incoming.getHappiness());
        state.setSecurity(incoming.getSecurity());
        state.setStreak(incoming.getStreak());
        if (incoming.getSelectedAvatar() != null)
            state.setSelectedAvatar(incoming.getSelectedAvatar());
        if (incoming.getScenarioIndex() != null)
            state.setScenarioIndex(incoming.getScenarioIndex());
        state.setUpdatedAt(LocalDateTime.now());

        return gameStateRepo.save(state);
    }
}
