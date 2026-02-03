package com.arthplay.repository;

import com.arthplay.model.AssessmentSession;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface AssessmentSessionRepository extends MongoRepository<AssessmentSession, String> {
    List<AssessmentSession> findByUserIdOrderByCompletedAtDesc(String userId);
    // Returns all sessions for a user, newest first
}
