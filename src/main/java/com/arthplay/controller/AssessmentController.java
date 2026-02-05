package com.arthplay.controller;

import com.arthplay.model.AssessmentSession;
import com.arthplay.model.QuestionAnswer;
import com.arthplay.service.AssessmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/assessment")
@CrossOrigin(origins = "*") // frontend safe
public class AssessmentController {

    @Autowired
    private AssessmentService assessmentService;

    /* ── Extract user email from JWT ── */
    private String getCurrentUserEmail() {
        Authentication auth =
                SecurityContextHolder.getContext().getAuthentication();

        if (auth == null || !auth.isAuthenticated()) {
            throw new RuntimeException("Unauthorized");
        }

        return auth.getName(); // email from JWT
    }

    /* ── POST /api/assessment/submit ── */
    @PostMapping("/submit")
    public ResponseEntity<AssessmentSession> submit(
            @RequestBody Map<String, Object> body
    ) {
        List<Map<String, Object>> rawAnswers =
                (List<Map<String, Object>>) body.getOrDefault(
                        "answers", Collections.emptyList()
                );

        List<QuestionAnswer> answers = rawAnswers.stream()
                .map(m -> QuestionAnswer.builder()
                        .questionId(((Number) m.get("questionId")).intValue())
                        .questionText((String) m.get("questionText"))
                        .selectedOption(((Number) m.get("selectedOption")).intValue())
                        .selectedText((String) m.get("selectedText"))
                        .securityImpact(((Number) m.get("securityImpact")).intValue())
                        .happinessImpact(((Number) m.get("happinessImpact")).intValue())
                        .build()
                )
                .toList();

        int finalSecurity =
                ((Number) body.get("finalSecurity")).intValue();
        int finalHappiness =
                ((Number) body.get("finalHappiness")).intValue();

        AssessmentSession session = assessmentService.saveSession(
                getCurrentUserEmail(),
                answers,
                finalSecurity,
                finalHappiness
        );

        return ResponseEntity.ok(session);
    }

    /* ── GET /api/assessment/history ── */
    @GetMapping("/history")
    public ResponseEntity<List<AssessmentSession>> history() {
        return ResponseEntity.ok(
                assessmentService.getHistory(getCurrentUserEmail())
        );
    }
}
