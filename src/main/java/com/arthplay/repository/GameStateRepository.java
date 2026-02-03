package com.arthplay.repository;

import com.arthplay.model.GameState;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.Optional;

public interface GameStateRepository extends MongoRepository<GameState, String> {
    Optional<GameState> findByUserId(String userId);
}
