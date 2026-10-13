package com.autoflow.repository;

import com.autoflow.entity.ApiKey;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface ApiKeyRepository extends JpaRepository<ApiKey, Long> {
    List<ApiKey> findByRevokedFalseOrderByCreatedAtDesc();
    Optional<ApiKey> findByApiKey(String apiKey);
}
