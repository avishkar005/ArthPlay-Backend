package com.arthplay.service;

import com.arthplay.model.AssessmentSession;
import com.arthplay.model.QuestionAnswer;
import com.arthplay.repository.AssessmentSessionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class AssessmentService {

    @Autowired
    private AssessmentSessionRepository sessionRepo;

    /* ── derive a text category from the two scores ── */
    private String categorise(int security, int happiness) {
        int avg = (security + happiness) / 2;
        if (avg >= 75) return "Excellent";
        if (avg >= 55) return "Good";
        if (avg >= 35) return "Average";
        return "Needs Improvement";
    }

    /* ── persist a completed session ── */
    public AssessmentSession saveSession(String userId,
                                         List<QuestionAnswer> answers,
                                         int finalSecurity,
                                         int finalHappiness) {
        AssessmentSession session = AssessmentSession.builder()
                .userId(userId)
                .answers(answers)
                .finalSecurity(finalSecurity)
                .finalHappiness(finalHappiness)
                .resultCategory(categorise(finalSecurity, finalHappiness))
                .completedAt(LocalDateTime.now())
                .build();

        return sessionRepo.save(session);
    }

    /* ── fetch history ── */
    public List<AssessmentSession> getHistory(String userId) {
        return sessionRepo.findByUserIdOrderByCompletedAtDesc(userId);
    }
}
