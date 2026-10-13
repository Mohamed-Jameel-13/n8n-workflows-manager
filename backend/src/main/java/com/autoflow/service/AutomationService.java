package com.autoflow.service;

import com.autoflow.dto.*;
import com.autoflow.entity.*;
import com.autoflow.repository.AutomationRepository;
import com.autoflow.repository.ExecutionLogRepository;
import com.autoflow.repository.WorkflowRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AutomationService {

    private static final Logger log = LoggerFactory.getLogger(AutomationService.class);

    private final AutomationRepository automationRepository;
    private final ExecutionLogRepository executionLogRepository;
    private final WorkflowRepository workflowRepository;
    private final N8nClientService n8nClientService;

    private static final DateTimeFormatter DATE_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd");
    private static final DateTimeFormatter DATETIME_FORMATTER = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    public AutomationService(AutomationRepository automationRepository,
                             ExecutionLogRepository executionLogRepository,
                             WorkflowRepository workflowRepository,
                             N8nClientService n8nClientService) {
        this.automationRepository = automationRepository;
        this.executionLogRepository = executionLogRepository;
        this.workflowRepository = workflowRepository;
        this.n8nClientService = n8nClientService;
    }

    @Transactional(readOnly = true)
    public List<AutomationDto> getAllAutomations(String typeFilter, String search) {
        AutomationType filterType = null;
        if (typeFilter != null && !typeFilter.isBlank() && !typeFilter.equalsIgnoreCase("all")) {
            filterType = AutomationType.fromString(typeFilter);
        }

        String query = (search != null && !search.isBlank()) ? search.trim() : null;
        List<Automation> automations = automationRepository.searchAutomations(filterType, query);

        return automations.stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<AutomationDto> getAutomationById(Long id) {
        return automationRepository.findById(id).map(this::toDto);
    }

    @Transactional
    public AutomationDto createAutomation(CreateAutomationRequest request) {
        AutomationType type = AutomationType.fromString(request.getType());
        AutomationStatus status = AutomationStatus.fromString(request.getStatus());
        String n8nId = request.getN8nWorkflowId();

        // If no n8n workflow ID is given and type is N8N, create it in live n8n
        if ((n8nId == null || n8nId.isBlank()) && type == AutomationType.N8N) {
            try {
                String createdId = n8nClientService.createWorkflowInN8n(request.getName());
                if (createdId != null) {
                    n8nId = createdId;
                }
            } catch (Exception e) {
                log.warn("Failed to create workflow in n8n: {}", e.getMessage());
            }
        }

        Automation automation = new Automation(request.getName(), request.getDescription(), type, status);
        automation.setN8nWorkflowId(n8nId);
        automation.setWebhookUrl(request.getWebhookUrl());
        automation.setCronExpression(request.getCronExpression());

        if (request.getTags() != null) {
            for (TagDto t : request.getTags()) {
                automation.addTag(new AutomationTag(t.getLabel(), t.getVariant()));
            }
        }

        Automation saved = automationRepository.save(automation);

        // Also sync or create matching Workflow entity
        if (n8nId != null && !n8nId.isBlank()) {
            Optional<Workflow> existingWf = workflowRepository.findByN8nWorkflowId(n8nId);
            if (existingWf.isEmpty()) {
                Workflow wf = new Workflow(
                        request.getName(),
                        3,
                        status == AutomationStatus.ENABLED ? WorkflowStatus.ACTIVE : WorkflowStatus.PAUSED
                );
                wf.setN8nWorkflowId(n8nId);
                workflowRepository.save(wf);
            }
        }

        return toDto(saved);
    }

    @Transactional
    public Optional<AutomationDto> updateAutomation(Long id, UpdateAutomationRequest request) {
        return automationRepository.findById(id).map(automation -> {
            if (request.getName() != null) automation.setName(request.getName());
            if (request.getDescription() != null) automation.setDescription(request.getDescription());
            if (request.getStatus() != null) automation.setStatus(AutomationStatus.fromString(request.getStatus()));
            if (request.getType() != null) automation.setType(AutomationType.fromString(request.getType()));
            if (request.getN8nWorkflowId() != null) automation.setN8nWorkflowId(request.getN8nWorkflowId());
            if (request.getWebhookUrl() != null) automation.setWebhookUrl(request.getWebhookUrl());
            if (request.getCronExpression() != null) automation.setCronExpression(request.getCronExpression());

            if (request.getTags() != null) {
                automation.getTags().clear();
                for (TagDto t : request.getTags()) {
                    automation.addTag(new AutomationTag(t.getLabel(), t.getVariant()));
                }
            }

            automation.setUpdatedAt(LocalDateTime.now());
            Automation saved = automationRepository.save(automation);

            // Also update matching workflow name if changed
            if (automation.getN8nWorkflowId() != null) {
                workflowRepository.findByN8nWorkflowId(automation.getN8nWorkflowId()).ifPresent(wf -> {
                    if (request.getName() != null) wf.setName(request.getName());
                    wf.setLastEdited(LocalDateTime.now());
                    workflowRepository.save(wf);
                });
            }

            return toDto(saved);
        });
    }

    @Transactional
    public Optional<AutomationDto> toggleStatus(Long id) {
        return automationRepository.findById(id).map(automation -> {
            boolean willBeEnabled = (automation.getStatus() != AutomationStatus.ENABLED);
            automation.setStatus(willBeEnabled ? AutomationStatus.ENABLED : AutomationStatus.DISABLED);
            automation.setUpdatedAt(LocalDateTime.now());
            String n8nId = automation.getN8nWorkflowId();

            // 1. Live toggle in n8n instance if connected
            if (n8nId != null && !n8nId.isBlank()) {
                try {
                    if (willBeEnabled) {
                        n8nClientService.activateWorkflow(n8nId);
                    } else {
                        n8nClientService.deactivateWorkflow(n8nId);
                    }
                } catch (Exception e) {
                    log.warn("Failed to toggle workflow {} in live n8n: {}", n8nId, e.getMessage());
                }

                // 2. Synchronize linked Workflow entity
                workflowRepository.findByN8nWorkflowId(n8nId).ifPresent(wf -> {
                    wf.setStatus(willBeEnabled ? WorkflowStatus.ACTIVE : WorkflowStatus.PAUSED);
                    wf.setLastEdited(LocalDateTime.now());
                    workflowRepository.save(wf);
                });
            }

            return toDto(automationRepository.save(automation));
        });
    }

    @Transactional
    public Optional<RunAutomationResponse> runAutomation(Long id) {
        return automationRepository.findById(id).map(automation -> {
            Map<String, Object> runResult = n8nClientService.triggerExecution(
                    automation.getName(),
                    automation.getN8nWorkflowId(),
                    automation.getWebhookUrl(),
                    Map.of("id", automation.getId(), "name", automation.getName())
            );

            boolean success = Boolean.TRUE.equals(runResult.get("success"));
            String duration = (String) runResult.getOrDefault("duration", "1.2s");
            String message = (String) runResult.getOrDefault("message", "Automation executed successfully");
            String executionId = (String) runResult.getOrDefault("executionId", "exec_" + System.currentTimeMillis());

            LocalDateTime now = LocalDateTime.now();
            ExecutionLog log = new ExecutionLog(
                    automation,
                    now,
                    success ? RunStatus.SUCCESS : RunStatus.FAILED,
                    message,
                    duration,
                    automation.getType() == AutomationType.WHATSAPP ? "WhatsApp" : (automation.getType() == AutomationType.CRON ? "Cron" : "n8n Webhook")
            );
            log.setN8nExecutionId(executionId);

            automation.addLog(log);
            automationRepository.save(automation);

            // Also touch lastEdited on Workflow
            if (automation.getN8nWorkflowId() != null) {
                workflowRepository.findByN8nWorkflowId(automation.getN8nWorkflowId()).ifPresent(wf -> {
                    wf.setLastEdited(now);
                    workflowRepository.save(wf);
                });
            }

            LogDto logDto = new LogDto(
                    log.getId(),
                    log.getTimestamp().format(DATETIME_FORMATTER),
                    log.getStatus().toLowerCase(),
                    log.getMessage(),
                    log.getDuration(),
                    log.getTrigger(),
                    automation.getName()
            );

            return new RunAutomationResponse(
                    success,
                    message,
                    duration,
                    now.format(DATETIME_FORMATTER),
                    executionId,
                    logDto
            );
        });
    }

    @Transactional
    public boolean deleteAutomation(Long id) {
        return automationRepository.findById(id).map(automation -> {
            String n8nId = automation.getN8nWorkflowId();
            if (n8nId != null && !n8nId.isBlank()) {
                // Delete from live n8n
                try {
                    n8nClientService.deleteWorkflowInN8n(n8nId);
                } catch (Exception e) {
                    log.warn("Failed to delete workflow {} from n8n: {}", n8nId, e.getMessage());
                }
                // Also remove linked workflow
                workflowRepository.findByN8nWorkflowId(n8nId).ifPresent(workflowRepository::delete);
            }
            automationRepository.delete(automation);
            return true;
        }).orElse(false);
    }

    public AutomationDto toDto(Automation a) {
        AutomationDto dto = new AutomationDto();
        dto.setId(String.valueOf(a.getId()));
        dto.setName(a.getName());
        dto.setDescription(a.getDescription());
        dto.setStatus(a.getStatus() != null ? a.getStatus().toLowerCase() : "disabled");
        dto.setType(a.getType() != null ? a.getType().toLowerCase() : "n8n");
        dto.setRunCount(a.getRunCount());
        dto.setN8nWorkflowId(a.getN8nWorkflowId());
        dto.setWebhookUrl(a.getWebhookUrl());

        if (a.getCreatedAt() != null) {
            dto.setCreatedAt(a.getCreatedAt().format(DATE_FORMATTER));
        }

        if (a.getLastRunTime() != null) {
            String timeAgo = formatTimeAgo(a.getLastRunTime());
            String status = a.getLastRunStatus() != null ? a.getLastRunStatus().toLowerCase() : "success";
            dto.setLastRun(new LastRunDto(timeAgo, status));
        }

        if (a.getTags() != null) {
            dto.setTags(a.getTags().stream()
                    .map(t -> new TagDto(t.getLabel(), t.getVariant()))
                    .collect(Collectors.toList()));
        }

        if (a.getLogs() != null && !a.getLogs().isEmpty()) {
            List<LogDto> logDtos = a.getLogs().stream()
                    .map(l -> new LogDto(
                            l.getId(),
                            l.getTimestamp().format(DATETIME_FORMATTER),
                            l.getStatus().toLowerCase(),
                            l.getMessage(),
                            l.getDuration(),
                            l.getTrigger(),
                            a.getName()
                    ))
                    .collect(Collectors.toList());
            dto.setLogs(logDtos);

            long successCount = a.getLogs().stream().filter(l -> l.getStatus() == RunStatus.SUCCESS).count();
            dto.setSuccessRate(Math.round(((double) successCount / a.getLogs().size() * 100.0) * 10.0) / 10.0);
        } else {
            dto.setSuccessRate(100.0);
        }

        return dto;
    }

    private String formatTimeAgo(LocalDateTime time) {
        if (time == null) return "Never";
        Duration d = Duration.between(time, LocalDateTime.now());
        long mins = d.toMinutes();
        if (mins < 1) return "Just now";
        if (mins < 60) return mins + " minutes ago";
        long hours = d.toHours();
        if (hours < 24) return hours + (hours == 1 ? " hour ago" : " hours ago");
        long days = d.toDays();
        if (days < 30) return days + (days == 1 ? " day ago" : " days ago");
        return time.format(DATE_FORMATTER);
    }
}
