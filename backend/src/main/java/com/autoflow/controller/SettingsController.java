package com.autoflow.controller;

import com.autoflow.dto.*;
import com.autoflow.service.SettingsService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/settings")
public class SettingsController {

    private final SettingsService settingsService;

    public SettingsController(SettingsService settingsService) {
        this.settingsService = settingsService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getSettings() {
        return ResponseEntity.ok(Map.of(
                "profile", settingsService.getUserProfile(),
                "workspace", settingsService.getWorkspace(),
                "apiKeys", settingsService.getApiKeys()
        ));
    }

    @GetMapping("/profile")
    public ResponseEntity<UserProfileDto> getProfile() {
        return ResponseEntity.ok(settingsService.getUserProfile());
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfileDto> updateProfile(@RequestBody UserProfileDto dto) {
        return ResponseEntity.ok(settingsService.updateUserProfile(dto));
    }

    @GetMapping("/workspace")
    public ResponseEntity<WorkspaceDto> getWorkspace() {
        return ResponseEntity.ok(settingsService.getWorkspace());
    }

    @PutMapping("/workspace")
    public ResponseEntity<WorkspaceDto> updateWorkspace(@RequestBody WorkspaceDto dto) {
        return ResponseEntity.ok(settingsService.updateWorkspace(dto));
    }

    @GetMapping("/api-keys")
    public ResponseEntity<List<ApiKeyDto>> getApiKeys() {
        return ResponseEntity.ok(settingsService.getApiKeys());
    }

    @PostMapping("/api-keys")
    public ResponseEntity<ApiKeyDto> generateApiKey(@RequestBody(required = false) GenerateApiKeyRequest request) {
        String name = request != null ? request.getName() : "New API Key";
        ApiKeyDto created = settingsService.generateApiKey(name);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    @DeleteMapping("/api-keys/{id}")
    public ResponseEntity<?> revokeApiKey(@PathVariable Long id) {
        boolean revoked = settingsService.revokeApiKey(id);
        if (revoked) {
            return ResponseEntity.ok(Map.of("message", "API key revoked successfully"));
        }
        return ResponseEntity.notFound().build();
    }
}
