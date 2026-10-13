package com.autoflow.service;

import com.autoflow.dto.ApiKeyDto;
import com.autoflow.dto.UserProfileDto;
import com.autoflow.dto.WorkspaceDto;
import com.autoflow.entity.ApiKey;
import com.autoflow.entity.User;
import com.autoflow.entity.WorkspaceSettings;
import com.autoflow.repository.ApiKeyRepository;
import com.autoflow.repository.UserRepository;
import com.autoflow.repository.WorkspaceSettingsRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class SettingsService {

    private final UserRepository userRepository;
    private final WorkspaceSettingsRepository workspaceSettingsRepository;
    private final ApiKeyRepository apiKeyRepository;
    private final N8nClientService n8nClientService;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("MMM d, yyyy");

    public SettingsService(UserRepository userRepository,
                           WorkspaceSettingsRepository workspaceSettingsRepository,
                           ApiKeyRepository apiKeyRepository,
                           N8nClientService n8nClientService) {
        this.userRepository = userRepository;
        this.workspaceSettingsRepository = workspaceSettingsRepository;
        this.apiKeyRepository = apiKeyRepository;
        this.n8nClientService = n8nClientService;
    }

    @Transactional(readOnly = true)
    public UserProfileDto getUserProfile() {
        Optional<User> userOpt = userRepository.findByUsername("admin");
        if (userOpt.isPresent()) {
            User u = userOpt.get();
            return new UserProfileDto(u.getFullName(), u.getEmail(), u.getAvatarUrl());
        }
        return new UserProfileDto("John Doe", "john@acme.com", null);
    }

    @Transactional
    public UserProfileDto updateUserProfile(UserProfileDto dto) {
        User user = userRepository.findByUsername("admin")
                .orElseGet(() -> new User("admin", "123", "John Doe", "john@acme.com", "ADMIN"));
        if (dto.getFullName() != null) user.setFullName(dto.getFullName());
        if (dto.getEmail() != null) user.setEmail(dto.getEmail());
        if (dto.getAvatarUrl() != null) user.setAvatarUrl(dto.getAvatarUrl());
        userRepository.save(user);
        return new UserProfileDto(user.getFullName(), user.getEmail(), user.getAvatarUrl());
    }

    @Transactional(readOnly = true)
    public WorkspaceDto getWorkspace() {
        WorkspaceSettings settings = workspaceSettingsRepository.findAll().stream().findFirst()
                .orElseGet(() -> new WorkspaceSettings("Acme Corp", "acme", "PRO"));
        return new WorkspaceDto(
                settings.getWorkspaceName(),
                settings.getWorkspaceSlug(),
                settings.getPlan(),
                settings.getN8nBaseUrl(),
                settings.getN8nApiKey(),
                settings.getN8nWebhookBaseUrl()
        );
    }

    @Transactional
    public WorkspaceDto updateWorkspace(WorkspaceDto dto) {
        WorkspaceSettings settings = workspaceSettingsRepository.findAll().stream().findFirst()
                .orElseGet(WorkspaceSettings::new);

        if (dto.getName() != null) settings.setWorkspaceName(dto.getName());
        if (dto.getSlug() != null) settings.setWorkspaceSlug(dto.getSlug());
        if (dto.getPlan() != null) settings.setPlan(dto.getPlan());
        if (dto.getN8nBaseUrl() != null) {
            settings.setN8nBaseUrl(dto.getN8nBaseUrl());
            n8nClientService.setN8nBaseUrl(dto.getN8nBaseUrl());
        }
        if (dto.getN8nApiKey() != null) {
            settings.setN8nApiKey(dto.getN8nApiKey());
            n8nClientService.setN8nApiKey(dto.getN8nApiKey());
        }
        if (dto.getN8nWebhookBaseUrl() != null) {
            settings.setN8nWebhookBaseUrl(dto.getN8nWebhookBaseUrl());
            n8nClientService.setN8nWebhookBaseUrl(dto.getN8nWebhookBaseUrl());
        }

        WorkspaceSettings saved = workspaceSettingsRepository.save(settings);
        return new WorkspaceDto(
                saved.getWorkspaceName(),
                saved.getWorkspaceSlug(),
                saved.getPlan(),
                saved.getN8nBaseUrl(),
                saved.getN8nApiKey(),
                saved.getN8nWebhookBaseUrl()
        );
    }

    @Transactional(readOnly = true)
    public List<ApiKeyDto> getApiKeys() {
        return apiKeyRepository.findByRevokedFalseOrderByCreatedAtDesc()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ApiKeyDto generateApiKey(String name) {
        String random = UUID.randomUUID().toString().replace("-", "").substring(0, 16);
        String fullKey = "af_live_" + random;
        String maskedKey = "af_live_" + random.substring(0, 4) + "..." + random.substring(random.length() - 3);

        ApiKey apiKey = new ApiKey(name != null && !name.isBlank() ? name : "API Key", fullKey, maskedKey);
        ApiKey saved = apiKeyRepository.save(apiKey);
        return toDto(saved);
    }

    @Transactional
    public boolean revokeApiKey(Long id) {
        return apiKeyRepository.findById(id).map(key -> {
            key.setRevoked(true);
            apiKeyRepository.save(key);
            return true;
        }).orElse(false);
    }

    private ApiKeyDto toDto(ApiKey k) {
        String created = k.getCreatedAt() != null ? k.getCreatedAt().format(DATE_FORMATTER) : "Recently";
        String lastUsed = "Just now";
        return new ApiKeyDto(k.getId(), k.getName(), k.getApiKey(), created, lastUsed);
    }
}
