package com.arthplay.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import lombok.*;

// ============================================================
// USER PROFILE — Stores profile updates (name, age, income…)
// ============================================================
@Document(collection = "user_profiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserProfile {

    @Id
    private String id;

    private String userId;            // FK → users.id
    private String fullName;
    private Integer age;
    private String occupation;
    private String monthlyIncome;      // stored as string (e.g. "₹25,000")
    private String financialGoal;
    private String selectedAvatar;     // farmer | woman | student | youngadult

    private LocalDateTime updatedAt;
}
