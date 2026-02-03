package com.arthplay.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import lombok.*;

// ============================================================
// GAME STATE — live game metrics that persist across sessions
// ============================================================
@Document(collection = "game_states")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class GameState {

    @Id
    private String id;

    private String userId;
    private Integer money;          // current balance
    private Integer happiness;      // 0-100
    private Integer security;       // 0-100
    private Integer streak;         // consecutive-day streak
    private String selectedAvatar;  // current avatar choice
    private Integer scenarioIndex;  // which scenario the user is on
    private LocalDateTime updatedAt;
}
