package com.arthplay.service;

import com.arthplay.model.UserProfile;
import com.arthplay.repository.UserProfileRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class ProfileService {

    @Autowired
    private UserProfileRepository profileRepo;

    /* ── GET or create empty profile ── */
    public UserProfile getProfile(String userId) {
        return profileRepo.findByUserId(userId)
                .orElse(UserProfile.builder()
                        .userId(userId)
                        .build());
    }

    /* ── CREATE / UPDATE ── */
    public UserProfile saveProfile(String userId, UserProfile incoming) {
        UserProfile profile = profileRepo.findByUserId(userId)
                .orElse(UserProfile.builder().userId(userId).build());

        profile.setFullName(incoming.getFullName());
        profile.setAge(incoming.getAge());
        profile.setOccupation(incoming.getOccupation());
        profile.setMonthlyIncome(incoming.getMonthlyIncome());
        profile.setFinancialGoal(incoming.getFinancialGoal());
        if (incoming.getSelectedAvatar() != null)
            profile.setSelectedAvatar(incoming.getSelectedAvatar());
        profile.setUpdatedAt(LocalDateTime.now());

        return profileRepo.save(profile);
    }
}
