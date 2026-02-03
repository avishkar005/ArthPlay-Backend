package com.arthplay.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import lombok.*;

// ============================================================
// USER DOCUMENT — Stores registration & login credentials
// ============================================================
@Document(collection = "users")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class User {

    @Id
    private String id;

    private String email;          // unique login identifier
    private String passwordHash;   // BCrypt-hashed password
    private String displayName;    // chosen at registration
    private String role;           // "USER" | "ADMIN"

    private LocalDateTime createdAt;
    private LocalDateTime lastLoginAt;
}
