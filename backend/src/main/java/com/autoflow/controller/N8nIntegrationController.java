package com.autoflow.controller;

import com.autoflow.service.N8nClientService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/n8n")
public class N8nIntegrationController {

    private final N8nClientService n8nClientService;

    public N8nIntegrationController(N8nClientService n8nClientService) {
        this.n8nClientService = n8nClientService;
    }

    @GetMapping("/health")
    public ResponseEntity<Map<String, Object>> checkHealth() {
        return ResponseEntity.ok(n8nClientService.checkHealth());
    }

    @PostMapping("/test-connection")
    public ResponseEntity<Map<String, Object>> testConnection(@RequestBody(required = false) Map<String, String> request) {
        String baseUrl = request != null ? request.get("baseUrl") : null;
        String apiKey = request != null ? request.get("apiKey") : null;
        return ResponseEntity.ok(n8nClientService.testConnection(baseUrl, apiKey));
    }

    @GetMapping("/workflows")
    public ResponseEntity<List<Map<String, Object>>> getWorkflows() {
        return ResponseEntity.ok(n8nClientService.fetchWorkflowsFromN8n());
    }

    @PostMapping("/sync-workflows")
    public ResponseEntity<Map<String, Object>> syncWorkflows() {
        return ResponseEntity.ok(n8nClientService.syncWorkflowsFromN8n());
    }

    @PostMapping("/webhook/{slug}")
    public ResponseEntity<Map<String, Object>> receiveWebhook(
            @PathVariable String slug,
            @RequestBody(required = false) Map<String, Object> payload) {
        return ResponseEntity.ok(Map.of(
                "received", true,
                "webhookSlug", slug,
                "status", "PROCESSED",
                "timestamp", System.currentTimeMillis()
        ));
    }
}
