package com.autoflow.service;

import com.autoflow.dto.CreateWorkflowRequest;
import com.autoflow.dto.WorkflowDto;
import com.autoflow.entity.Automation;
import com.autoflow.entity.AutomationStatus;
import com.autoflow.entity.AutomationType;
import com.autoflow.entity.AutomationTag;
import com.autoflow.entity.Workflow;
import com.autoflow.entity.WorkflowStatus;
import com.autoflow.repository.AutomationRepository;
import com.autoflow.repository.WorkflowRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class WorkflowService {

    private static final Logger log = LoggerFactory.getLogger(WorkflowService.class);

    private final WorkflowRepository workflowRepository;
    private final AutomationRepository automationRepository;
    private final N8nClientService n8nClientService;

    public WorkflowService(WorkflowRepository workflowRepository,
                           AutomationRepository automationRepository,
                           N8nClientService n8nClientService) {
        this.workflowRepository = workflowRepository;
        this.automationRepository = automationRepository;
        this.n8nClientService = n8nClientService;
    }

    @Transactional(readOnly = true)
    public List<WorkflowDto> getAllWorkflows() {
        return workflowRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public Optional<WorkflowDto> getWorkflowById(Long id) {
        return workflowRepository.findById(id).map(this::toDto);
    }

    @Transactional
    public WorkflowDto createWorkflow(CreateWorkflowRequest request) {
        WorkflowStatus status = WorkflowStatus.fromString(request.getStatus());
        String n8nId = request.getN8nWorkflowId();

        // If no n8n workflow ID is provided, try creating it in the live n8n instance
        if (n8nId == null || n8nId.isBlank()) {
            try {
                String createdN8nId = n8nClientService.createWorkflowInN8n(request.getName());
                if (createdN8nId != null) {
                    n8nId = createdN8nId;
                }
            } catch (Exception e) {
                log.warn("Could not create workflow in live n8n: {}", e.getMessage());
            }
        }

        Workflow workflow = new Workflow(request.getName(), request.getSteps(), status);
        workflow.setN8nWorkflowId(n8nId);
        workflow.setDefinitionJson(request.getDefinitionJson());
        Workflow saved = workflowRepository.save(workflow);

        // Also create or sync matching Automation so it appears in Automations tab
        if (n8nId != null && !n8nId.isBlank()) {
            Optional<Automation> existing = automationRepository.findByN8nWorkflowId(n8nId);
            if (existing.isEmpty()) {
                Automation auto = new Automation(
                        request.getName(),
                        "Workflow created via AutoFlow",
                        AutomationType.N8N,
                        status == WorkflowStatus.ACTIVE ? AutomationStatus.ENABLED : AutomationStatus.DISABLED
                );
                auto.setN8nWorkflowId(n8nId);
                auto.addTag(new AutomationTag("n8n", "purple"));
                automationRepository.save(auto);
            }
        }

        return toDto(saved);
    }

    @Transactional
    public Optional<WorkflowDto> toggleWorkflowStatus(Long id) {
        return workflowRepository.findById(id).map(workflow -> {
            boolean willBeActive = (workflow.getStatus() != WorkflowStatus.ACTIVE);
            WorkflowStatus newStatus = willBeActive ? WorkflowStatus.ACTIVE : WorkflowStatus.PAUSED;
            String n8nId = workflow.getN8nWorkflowId();

            // 1. Live toggle in n8n instance if connected
            if (n8nId != null && !n8nId.isBlank()) {
                try {
                    if (willBeActive) {
                        n8nClientService.activateWorkflow(n8nId);
                    } else {
                        n8nClientService.deactivateWorkflow(n8nId);
                    }
                } catch (Exception e) {
                    log.warn("Failed to toggle workflow {} in live n8n: {}", n8nId, e.getMessage());
                }

                // 2. Synchronize linked Automation entity
                automationRepository.findByN8nWorkflowId(n8nId).ifPresent(auto -> {
                    auto.setStatus(willBeActive ? AutomationStatus.ENABLED : AutomationStatus.DISABLED);
                    auto.setUpdatedAt(LocalDateTime.now());
                    automationRepository.save(auto);
                });
            }

            workflow.setStatus(newStatus);
            workflow.setLastEdited(LocalDateTime.now());
            return toDto(workflowRepository.save(workflow));
        });
    }

    @Transactional
    public boolean deleteWorkflow(Long id) {
        return workflowRepository.findById(id).map(workflow -> {
            String n8nId = workflow.getN8nWorkflowId();
            if (n8nId != null && !n8nId.isBlank()) {
                // Delete from live n8n
                try {
                    n8nClientService.deleteWorkflowInN8n(n8nId);
                } catch (Exception e) {
                    log.warn("Failed to delete workflow {} from n8n: {}", n8nId, e.getMessage());
                }
                // Also remove linked automation
                automationRepository.findByN8nWorkflowId(n8nId).ifPresent(automationRepository::delete);
            }
            workflowRepository.delete(workflow);
            return true;
        }).orElse(false);
    }

    private WorkflowDto toDto(Workflow w) {
        String lastEdited = formatTimeAgo(w.getLastEdited());
        return new WorkflowDto(
                w.getId(),
                w.getName(),
                w.getSteps(),
                w.getStatus().getDisplay(),
                lastEdited,
                w.getN8nWorkflowId()
        );
    }

    private String formatTimeAgo(LocalDateTime time) {
        if (time == null) return "Just now";
        Duration d = Duration.between(time, LocalDateTime.now());
        long mins = d.toMinutes();
        if (mins < 1) return "Just now";
        if (mins < 60) return mins + "m ago";
        long hours = d.toHours();
        if (hours < 24) return hours + "h ago";
        long days = d.toDays();
        return days + "d ago";
    }
}
