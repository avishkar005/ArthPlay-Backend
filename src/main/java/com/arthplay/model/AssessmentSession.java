package com.arthplay.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDateTime;
import java.util.List;
import lombok.*;

// ============================================================
// ASSESSMENT SESSION — one document per complete run of the
// 8-question behavioural quiz, including derived scores.
// ============================================================
@Document(collection = "assessment_sessions")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssessmentSession {

    @Id
    private String id;

    private String userId;                    // FK → users.id
    private List<QuestionAnswer> answers;      // ordered list of Q&A
    private Integer finalSecurity;             // computed score 0-100
    private Integer finalHappiness;            // computed score 0-100
    private String resultCategory;             // "Excellent" | "Good" | "Average" | "Needs Improvement"
    private LocalDateTime completedAt;
}
