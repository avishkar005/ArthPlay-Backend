package com.arthplay.controller;

import com.arthplay.model.AssessmentSession;
import com.arthplay.model.QuestionAnswer;
import com.arthplay.security.JwtUtils;
import com.arthplay.service.AssessmentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import jakarta.servlet.http.HttpServletRequest;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/assessment")
public class AssessmentController {

    @Autowired private AssessmentService assessmentService;
    @Autowired private JwtUtils          jwtUtils;

    private String extractUserId() {
        HttpServletRequest req = ((ServletRequestAttributes)
                RequestContextHolder.getRequestAttributes()).getRequest();
        String token = req.getHeader("Authorization").substring(7);
        return jwtUtils.extractUserId(token);
    }

    /* ── POST /api/assessment/submit ── */
    @PostMapping("/submit")
    public ResponseEntity<AssessmentSession> submit(@RequestBody Map<String, Object> body) {
        @SuppressWarnings("unchecked")
        List<Map<String, Object>> rawAnswers = (List<Map<String, Object>>) body.get("answers");

        List<QuestionAnswer> answers = rawAnswers.stream().map(m -> QuestionAnswer.builder()
                .questionId(((Number) m.get("questionId")).intValue())
                .questionText((String) m.get("questionText"))
                .selectedOption(((Number) m.get("selectedOption")).intValue())
                .selectedText((String) m.get("selectedText"))
                .securityImpact(((Number) m.get("securityImpact")).intValue())
                .happinessImpact(((Number) m.get("happinessImpact")).intValue())
                .build()
        ).toList();

        int finalSecurity  = ((Number) body.get("finalSecurity")).intValue();
        int finalHappiness = ((Number) body.get("finalHappiness")).intValue();

        AssessmentSession session = assessmentService.saveSession(
                extractUserId(), answers, finalSecurity, finalHappiness);

        return ResponseEntity.ok(session);
    }

    /* ── GET /api/assessment/history ── */
    @GetMapping("/history")
    public ResponseEntity<List<AssessmentSession>> history() {
        return ResponseEntity.ok(assessmentService.getHistory(extractUserId()));
    }
}
