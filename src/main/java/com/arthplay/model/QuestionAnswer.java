package com.arthplay.model;

import lombok.*;

// ============================================================
// Embedded sub-document inside AssessmentSession.answers
// ============================================================
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class QuestionAnswer {
    private Integer questionId;      // 1-10
    private String questionText;     // snapshot of the question
    private Integer selectedOption;  // 0, 1, or 2
    private String selectedText;     // snapshot of chosen option text
    private Integer securityImpact;  // +/- delta
    private Integer happinessImpact; // +/- delta
}
