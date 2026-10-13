package com.autoflow.service;

import com.autoflow.entity.*;
import com.autoflow.repository.AutomationRepository;
import com.autoflow.repository.WorkflowRepository;
import com.autoflow.repository.WorkspaceSettingsRepository;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.HttpStatusCodeException;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class N8nClientService {

    private static final Logger log = LoggerFactory.getLogger(N8nClientService.class);

    private final RestTemplate restTemplate;
    private final WorkspaceSettingsRepository workspaceSettingsRepository;
    private final AutomationRepository automationRepository;
    private final WorkflowRepository workflowRepository;
    private final ObjectMapper objectMapper;

    @Value("${n8n.base-url:http://localhost:5678}")
    private String defaultBaseUrl;

    @Value("${n8n.api-key:}")
    private String defaultApiKey;

    @Value("${n8n.webhook-base-url:http://localhost:5678/webhook}")
    private String defaultWebhookBaseUrl;

    public N8nClientService(RestTemplate restTemplate,
                            WorkspaceSettingsRepository workspaceSettingsRepository,
                            AutomationRepository automationRepository,
                            WorkflowRepository workflowRepository) {
        this.restTemplate = restTemplate;
        this.workspaceSettingsRepository = workspaceSettingsRepository;
        this.automationRepository = automationRepository;
        this.workflowRepository = workflowRepository;
        this.objectMapper = new ObjectMapper();
    }

    public String getN8nBaseUrl() {
        return workspaceSettingsRepository.findAll().stream().findFirst()
                .map(WorkspaceSettings::getN8nBaseUrl)
                .filter(url -> url != null && !url.isBlank())
                .orElse(defaultBaseUrl);
    }

    public String getN8nApiKey() {
        return workspaceSettingsRepository.findAll().stream().findFirst()
                .map(WorkspaceSettings::getN8nApiKey)
                .filter(key -> key != null && !key.isBlank())
                .orElse(defaultApiKey);
    }

    public String getN8nWebhookBaseUrl() {
        return workspaceSettingsRepository.findAll().stream().findFirst()
                .map(WorkspaceSettings::getN8nWebhookBaseUrl)
                .filter(url -> url != null && !url.isBlank())
                .orElse(defaultWebhookBaseUrl);
    }

    public String getCleanWebhookBaseUrl() {
        String webhookBase = getN8nWebhookBaseUrl();
        if (webhookBase == null || webhookBase.isBlank() || webhookBase.contains("localhost")) {
            String baseUrl = sanitizeUrl(getN8nBaseUrl());
            return baseUrl + "/webhook";
        }
        String sanitized = sanitizeUrl(webhookBase);
        int idx = sanitized.indexOf("/webhook");
        if (idx != -1) {
            return sanitized.substring(0, idx + 8);
        }
        return sanitized + "/webhook";
    }

    public void setN8nBaseUrl(String url) {
        this.defaultBaseUrl = url;
    }

    public void setN8nApiKey(String key) {
        this.defaultApiKey = key;
    }

    public void setN8nWebhookBaseUrl(String url) {
        this.defaultWebhookBaseUrl = url;
    }

    /**
     * Check health and connectivity to current configured n8n instance.
     */
    public Map<String, Object> checkHealth() {
        return testConnection(getN8nBaseUrl(), getN8nApiKey());
    }

    /**
     * Test connection to a specific n8n instance URL and API Key.
     */
    public Map<String, Object> testConnection(String baseUrl, String apiKey) {
        Map<String, Object> result = new HashMap<>();
        String cleanBaseUrl = sanitizeUrl(baseUrl != null && !baseUrl.isBlank() ? baseUrl : getN8nBaseUrl());
        String effectiveApiKey = (apiKey != null && !apiKey.isBlank()) ? apiKey : getN8nApiKey();

        result.put("baseUrl", cleanBaseUrl);

        if (effectiveApiKey != null && !effectiveApiKey.isBlank()) {
            String workflowsUrl = cleanBaseUrl + "/api/v1/workflows?limit=5";
            try {
                HttpHeaders headers = new HttpHeaders();
                headers.set("X-N8N-API-KEY", effectiveApiKey);
                HttpEntity<Void> request = new HttpEntity<>(headers);

                ResponseEntity<String> response = restTemplate.exchange(workflowsUrl, HttpMethod.GET, request, String.class);
                if (response.getStatusCode().is2xxSuccessful()) {
                    int count = 0;
                    try {
                        JsonNode root = objectMapper.readTree(response.getBody());
                        if (root.has("data") && root.get("data").isArray()) {
                            count = root.get("data").size();
                        }
                    } catch (Exception ignored) {}

                    result.put("connected", true);
                    result.put("authenticated", true);
                    result.put("status", "UP");
                    result.put("workflowCount", count);
                    result.put("message", "Successfully connected and authenticated with n8n instance");
                    return result;
                }
            } catch (HttpStatusCodeException e) {
                if (e.getStatusCode().value() == 401 || e.getStatusCode().value() == 403) {
                    result.put("connected", true);
                    result.put("authenticated", false);
                    result.put("status", "UNAUTHORIZED");
                    result.put("message", "Connected to n8n server, but the API Key was rejected (401 Unauthorized)");
                    return result;
                }
                log.warn("n8n API test returned HTTP {}: {}", e.getStatusCode().value(), e.getMessage());
            } catch (Exception e) {
                log.warn("n8n authenticated test failed: {}", e.getMessage());
            }
        }

        String healthUrl = cleanBaseUrl + "/healthz";
        try {
            ResponseEntity<String> response = restTemplate.getForEntity(healthUrl, String.class);
            if (response.getStatusCode().is2xxSuccessful()) {
                result.put("connected", true);
                result.put("authenticated", false);
                result.put("status", "UP");
                result.put("message", "n8n server is reachable. Add your n8n API Key to enable workflow sync and executions.");
                return result;
            }
        } catch (Exception e) {
            log.warn("n8n healthz check failed at {}: {}", healthUrl, e.getMessage());
        }

        result.put("connected", false);
        result.put("authenticated", false);
        result.put("status", "DOWN");
        result.put("message", "Could not reach n8n server at " + cleanBaseUrl + ". Check that n8n is running and accessible.");
        return result;
    }

    /**
     * Fetch real workflow list directly from n8n instance API.
     */
    public List<Map<String, Object>> fetchWorkflowsFromN8n() {
        String baseUrl = sanitizeUrl(getN8nBaseUrl());
        String apiKey = getN8nApiKey();

        if (apiKey == null || apiKey.isBlank()) {
            throw new IllegalStateException("n8n API Key is not configured. Please enter your API Key in Settings.");
        }

        String url = baseUrl + "/api/v1/workflows";
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("X-N8N-API-KEY", apiKey);
            HttpEntity<Void> request = new HttpEntity<>(headers);

            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, request, String.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());
                List<Map<String, Object>> workflows = new ArrayList<>();
                if (root.has("data") && root.get("data").isArray()) {
                    for (JsonNode wf : root.get("data")) {
                        Map<String, Object> map = new HashMap<>();
                        map.put("id", wf.path("id").asText());
                        map.put("name", wf.path("name").asText("Unnamed Workflow"));
                        map.put("active", wf.path("active").asBoolean(false));
                        map.put("createdAt", wf.path("createdAt").asText(""));
                        map.put("updatedAt", wf.path("updatedAt").asText(""));
                        workflows.add(map);
                    }
                }
                return workflows;
            }
        } catch (HttpStatusCodeException e) {
            throw new RuntimeException("n8n API error (" + e.getStatusCode().value() + "): " + e.getResponseBodyAsString(), e);
        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch workflows from n8n: " + e.getMessage(), e);
        }

        return Collections.emptyList();
    }

    /**
     * Fetch full JSON detail of a specific n8n workflow.
     */
    public JsonNode fetchWorkflowDetails(String n8nId) {
        String baseUrl = sanitizeUrl(getN8nBaseUrl());
        String apiKey = getN8nApiKey();
        if (apiKey == null || apiKey.isBlank()) return null;

        String url = baseUrl + "/api/v1/workflows/" + n8nId;
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("X-N8N-API-KEY", apiKey);
            HttpEntity<Void> request = new HttpEntity<>(headers);
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, request, String.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                return objectMapper.readTree(response.getBody());
            }
        } catch (Exception e) {
            log.warn("Failed to fetch detail for workflow {}: {}", n8nId, e.getMessage());
        }
        return null;
    }

    /**
     * Extract webhook path from workflow nodes.
     */
    public String extractWebhookPath(JsonNode wfDetail) {
        if (wfDetail == null || !wfDetail.has("nodes")) return null;
        JsonNode nodes = wfDetail.get("nodes");
        if (nodes.isArray()) {
            for (JsonNode node : nodes) {
                String type = node.path("type").asText("");
                if (type.toLowerCase().contains("webhook")) {
                    JsonNode params = node.path("parameters");
                    String path = params.path("path").asText("");
                    if (!path.isBlank()) {
                        return path;
                    }
                    String webhookId = node.path("webhookId").asText("");
                    if (!webhookId.isBlank()) {
                        return webhookId;
                    }
                }
            }
        }
        return null;
    }

    /**
     * Activate a workflow in the live n8n instance.
     */
    public boolean activateWorkflow(String n8nWorkflowId) {
        if (n8nWorkflowId == null || n8nWorkflowId.isBlank()) return false;
        String baseUrl = sanitizeUrl(getN8nBaseUrl());
        String apiKey = getN8nApiKey();
        if (apiKey == null || apiKey.isBlank()) return false;

        String url = baseUrl + "/api/v1/workflows/" + n8nWorkflowId + "/activate";
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("X-N8N-API-KEY", apiKey);
            HttpEntity<Void> request = new HttpEntity<>(headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            log.info("Activated workflow {} in n8n: HTTP {}", n8nWorkflowId, response.getStatusCode().value());
            return response.getStatusCode().is2xxSuccessful();
        } catch (Exception e) {
            log.warn("Failed to activate workflow {} in n8n: {}", n8nWorkflowId, e.getMessage());
            return false;
        }
    }

    /**
     * Deactivate a workflow in the live n8n instance.
     */
    public boolean deactivateWorkflow(String n8nWorkflowId) {
        if (n8nWorkflowId == null || n8nWorkflowId.isBlank()) return false;
        String baseUrl = sanitizeUrl(getN8nBaseUrl());
        String apiKey = getN8nApiKey();
        if (apiKey == null || apiKey.isBlank()) return false;

        String url = baseUrl + "/api/v1/workflows/" + n8nWorkflowId + "/deactivate";
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("X-N8N-API-KEY", apiKey);
            HttpEntity<Void> request = new HttpEntity<>(headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            log.info("Deactivated workflow {} in n8n: HTTP {}", n8nWorkflowId, response.getStatusCode().value());
            return response.getStatusCode().is2xxSuccessful();
        } catch (Exception e) {
            log.warn("Failed to deactivate workflow {} in n8n: {}", n8nWorkflowId, e.getMessage());
            return false;
        }
    }

    /**
     * Create a new workflow in the live n8n instance.
     */
    public String createWorkflowInN8n(String name) {
        String baseUrl = sanitizeUrl(getN8nBaseUrl());
        String apiKey = getN8nApiKey();
        if (apiKey == null || apiKey.isBlank()) return null;

        String url = baseUrl + "/api/v1/workflows";
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("X-N8N-API-KEY", apiKey);
            headers.setContentType(MediaType.APPLICATION_JSON);
            Map<String, Object> body = Map.of(
                    "name", name != null && !name.isBlank() ? name : "New AutoFlow Workflow",
                    "nodes", List.of(),
                    "connections", Map.of(),
                    "settings", Map.of()
            );
            HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
            ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);
            if (response.getStatusCode().is2xxSuccessful() && response.getBody() != null) {
                JsonNode root = objectMapper.readTree(response.getBody());
                String id = root.path("id").asText(null);
                log.info("Created workflow in live n8n: ID {}", id);
                return id;
            }
        } catch (Exception e) {
            log.warn("Failed to create workflow in n8n: {}", e.getMessage());
        }
        return null;
    }

    /**
     * Delete a workflow in the live n8n instance.
     */
    public boolean deleteWorkflowInN8n(String n8nWorkflowId) {
        if (n8nWorkflowId == null || n8nWorkflowId.isBlank()) return false;
        String baseUrl = sanitizeUrl(getN8nBaseUrl());
        String apiKey = getN8nApiKey();
        if (apiKey == null || apiKey.isBlank()) return false;

        String url = baseUrl + "/api/v1/workflows/" + n8nWorkflowId;
        try {
            HttpHeaders headers = new HttpHeaders();
            headers.set("X-N8N-API-KEY", apiKey);
            HttpEntity<Void> request = new HttpEntity<>(headers);
            ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.DELETE, request, String.class);
            log.info("Deleted workflow {} in n8n: HTTP {}", n8nWorkflowId, response.getStatusCode().value());
            return response.getStatusCode().is2xxSuccessful();
        } catch (Exception e) {
            log.warn("Failed to delete workflow {} from n8n: {}", n8nWorkflowId, e.getMessage());
            return false;
        }
    }

    /**
     * Sync real n8n workflows into AutoFlow's MySQL database.
     * Extracts exact trigger nodes, custom webhook paths, and tags.
     */
    public Map<String, Object> syncWorkflowsFromN8n() {
        List<Map<String, Object>> n8nWorkflows = fetchWorkflowsFromN8n();
        int createdCount = 0;
        int updatedCount = 0;
        String webhookBase = getCleanWebhookBaseUrl();

        for (Map<String, Object> wfMap : n8nWorkflows) {
            String n8nId = (String) wfMap.get("id");
            String name = (String) wfMap.get("name");
            boolean active = Boolean.TRUE.equals(wfMap.get("active"));

            // Fetch workflow details to inspect nodes and triggers
            JsonNode wfDetail = fetchWorkflowDetails(n8nId);
            String webhookPath = extractWebhookPath(wfDetail);
            String computedWebhookUrl = null;
            if (webhookPath != null) {
                computedWebhookUrl = webhookBase + "/" + (webhookPath.startsWith("/") ? webhookPath.substring(1) : webhookPath);
            }

            int stepCount = 3;
            if (wfDetail != null && wfDetail.has("nodes") && wfDetail.get("nodes").isArray()) {
                stepCount = Math.max(1, wfDetail.get("nodes").size());
            }

            // Determine appropriate AutomationType and primary tag
            String lowerName = (name != null ? name : "").toLowerCase();
            AutomationType detectedType = AutomationType.N8N;
            String primaryTag = "n8n";
            String tagVariant = "purple";

            if (lowerName.contains("whatsapp") || lowerName.contains("evolution") || lowerName.contains("chat")) {
                detectedType = AutomationType.WHATSAPP;
                primaryTag = "whatsapp";
                tagVariant = "green";
            } else if (lowerName.contains("cron") || lowerName.contains("schedule")) {
                detectedType = AutomationType.CRON;
                primaryTag = "cron";
                tagVariant = "blue";
            }

            // 1. Sync or create Automation
            Optional<Automation> existingAuto = automationRepository.findByN8nWorkflowId(n8nId);
            Automation automation;
            if (existingAuto.isPresent()) {
                automation = existingAuto.get();
                automation.setName(name);
                automation.setStatus(active ? AutomationStatus.ENABLED : AutomationStatus.DISABLED);
                if (computedWebhookUrl != null) {
                    automation.setWebhookUrl(computedWebhookUrl);
                }
                automation.setType(detectedType);
                updatedCount++;
            } else {
                automation = new Automation(name, "Synchronized from n8n instance", detectedType,
                        active ? AutomationStatus.ENABLED : AutomationStatus.DISABLED);
                automation.setN8nWorkflowId(n8nId);
                if (computedWebhookUrl != null) {
                    automation.setWebhookUrl(computedWebhookUrl);
                }
                automation.addTag(new AutomationTag(primaryTag, tagVariant));
                automation.addTag(new AutomationTag("n8n", "purple"));
                createdCount++;
            }
            automationRepository.save(automation);

            // 2. Sync or create Workflow
            Optional<Workflow> existingWf = workflowRepository.findByN8nWorkflowId(n8nId);
            Workflow workflow;
            if (existingWf.isPresent()) {
                workflow = existingWf.get();
                workflow.setName(name);
                workflow.setStatus(active ? WorkflowStatus.ACTIVE : WorkflowStatus.PAUSED);
                workflow.setSteps(stepCount);
                workflow.setLastEdited(LocalDateTime.now());
            } else {
                workflow = new Workflow(name, stepCount, active ? WorkflowStatus.ACTIVE : WorkflowStatus.PAUSED);
                workflow.setN8nWorkflowId(n8nId);
            }
            workflowRepository.save(workflow);
        }

        Map<String, Object> result = new HashMap<>();
        result.put("success", true);
        result.put("totalFetched", n8nWorkflows.size());
        result.put("created", createdCount);
        result.put("updated", updatedCount);
        result.put("message", String.format("Successfully synced %d workflows from n8n (%d created, %d updated)",
                n8nWorkflows.size(), createdCount, updatedCount));
        return result;
    }

    /**
     * Trigger execution for an automation via n8n webhook with automatic activation fallback.
     */
    public Map<String, Object> triggerExecution(String automationName, String n8nWorkflowId, String customWebhookUrl, Map<String, Object> payload) {
        long startTime = System.currentTimeMillis();
        Map<String, Object> executionResult = new HashMap<>();

        String targetUrl = null;
        if (customWebhookUrl != null && !customWebhookUrl.isBlank()) {
            targetUrl = customWebhookUrl.trim();
        } else if (n8nWorkflowId != null && !n8nWorkflowId.isBlank()) {
            Optional<Automation> autoOpt = automationRepository.findByN8nWorkflowId(n8nWorkflowId);
            if (autoOpt.isPresent() && autoOpt.get().getWebhookUrl() != null && !autoOpt.get().getWebhookUrl().isBlank()) {
                targetUrl = autoOpt.get().getWebhookUrl().trim();
            } else {
                JsonNode wfDetail = fetchWorkflowDetails(n8nWorkflowId);
                String path = extractWebhookPath(wfDetail);
                if (path != null) {
                    String resolvedUrl = getCleanWebhookBaseUrl() + "/" + (path.startsWith("/") ? path.substring(1) : path);
                    targetUrl = resolvedUrl;
                    autoOpt.ifPresent(a -> {
                        a.setWebhookUrl(resolvedUrl);
                        automationRepository.save(a);
                    });
                }
            }
        }

        if (targetUrl == null) {
            executionResult.put("success", false);
            executionResult.put("duration", "0.0s");
            executionResult.put("executionId", "err_no_webhook");
            executionResult.put("message", "Workflow '" + automationName + "' has no Webhook trigger node configured in n8n. Add a Webhook node in n8n or specify a custom Webhook URL.");
            return executionResult;
        }

        return executePostWithRetry(targetUrl, automationName, n8nWorkflowId, payload, startTime);
    }

    private Map<String, Object> executePostWithRetry(String targetUrl, String automationName, String n8nWorkflowId, Map<String, Object> payload, long startTime) {
        Map<String, Object> executionResult = new HashMap<>();
        try {
            return doHttpPost(targetUrl, automationName, payload, startTime);
        } catch (HttpStatusCodeException e) {
            String respBody = e.getResponseBodyAsString();

            // If n8n returned 404 with hint that workflow must be active: auto-activate and retry!
            if (e.getStatusCode().value() == 404 && respBody.contains("workflow must be active") && n8nWorkflowId != null && !n8nWorkflowId.isBlank()) {
                log.info("Workflow {} is currently deactivated in n8n. Auto-activating to execute trigger...", n8nWorkflowId);
                boolean activated = activateWorkflow(n8nWorkflowId);
                if (activated) {
                    automationRepository.findByN8nWorkflowId(n8nWorkflowId).ifPresent(a -> {
                        a.setStatus(AutomationStatus.ENABLED);
                        automationRepository.save(a);
                    });
                    workflowRepository.findByN8nWorkflowId(n8nWorkflowId).ifPresent(w -> {
                        w.setStatus(WorkflowStatus.ACTIVE);
                        workflowRepository.save(w);
                    });

                    // Retry execution now that workflow is activated
                    try {
                        return doHttpPost(targetUrl, automationName, payload, startTime);
                    } catch (Exception retryEx) {
                        log.warn("Retry failed after activation: {}", retryEx.getMessage());
                    }
                }
            }

            long durationMs = System.currentTimeMillis() - startTime;
            String durationStr = String.format(Locale.US, "%.1fs", Math.max(durationMs / 1000.0, 0.1));
            executionResult.put("success", false);
            executionResult.put("duration", durationStr);
            executionResult.put("executionId", "err_http_" + e.getStatusCode().value());
            executionResult.put("message", "n8n error: HTTP " + e.getStatusCode().value() + " - " + extractMessageFromN8nError(respBody, e.getStatusText()));
            return executionResult;
        } catch (Exception e) {
            long durationMs = System.currentTimeMillis() - startTime;
            String durationStr = String.format(Locale.US, "%.1fs", Math.max(durationMs / 1000.0, 0.1));
            executionResult.put("success", false);
            executionResult.put("duration", durationStr);
            executionResult.put("executionId", "err_conn");
            executionResult.put("message", "Connection error: " + (e.getMessage() != null ? e.getMessage() : e.getClass().getSimpleName()));
            return executionResult;
        }
    }

    private Map<String, Object> doHttpPost(String targetUrl, String automationName, Map<String, Object> payload, long startTime) {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        String apiKey = getN8nApiKey();
        if (apiKey != null && !apiKey.isBlank()) {
            headers.set("X-N8N-API-KEY", apiKey);
        }

        Map<String, Object> body = payload != null ? new HashMap<>(payload) : new HashMap<>();
        body.put("triggeredAt", LocalDateTime.now().toString());
        body.put("source", "AutoFlow");
        body.put("automation", automationName);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);
        ResponseEntity<String> response = restTemplate.postForEntity(targetUrl, request, String.class);

        long durationMs = System.currentTimeMillis() - startTime;
        String durationStr = String.format(Locale.US, "%.1fs", Math.max(durationMs / 1000.0, 0.1));

        Map<String, Object> result = new HashMap<>();
        boolean success = response.getStatusCode().is2xxSuccessful();
        result.put("success", success);
        result.put("duration", durationStr);
        result.put("executionId", "n8n_" + UUID.randomUUID().toString().substring(0, 8));

        String respText = response.getBody();
        String displayMsg = "Workflow started successfully";
        if (respText != null && respText.contains("Workflow was started")) {
            displayMsg = "Workflow started successfully in n8n";
        } else if (respText != null && !respText.isBlank() && respText.length() < 120) {
            displayMsg = respText;
        }
        result.put("message", displayMsg);
        return result;
    }

    private String extractMessageFromN8nError(String body, String defaultText) {
        if (body != null && !body.isBlank()) {
            try {
                JsonNode node = objectMapper.readTree(body);
                if (node.has("message")) return node.get("message").asText();
            } catch (Exception ignored) {}
        }
        return defaultText != null ? defaultText : "Unknown error";
    }

    private String sanitizeUrl(String url) {
        if (url == null) return "http://localhost:5678";
        String trimmed = url.trim();
        while (trimmed.endsWith("/")) {
            trimmed = trimmed.substring(0, trimmed.length() - 1);
        }
        return trimmed;
    }
}
