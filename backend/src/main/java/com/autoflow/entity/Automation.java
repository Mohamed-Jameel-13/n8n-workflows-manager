package com.autoflow.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "automations")
public class Automation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AutomationStatus status = AutomationStatus.ENABLED;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AutomationType type = AutomationType.N8N;

    @Column(name = "last_run_time")
    private LocalDateTime lastRunTime;

    @Enumerated(EnumType.STRING)
    @Column(name = "last_run_status", length = 20)
    private RunStatus lastRunStatus;

    @Column(name = "run_count", nullable = false)
    private Integer runCount = 0;

    @Column(name = "n8n_workflow_id", length = 100)
    private String n8nWorkflowId;

    @Column(name = "webhook_url", length = 500)
    private String webhookUrl;

    @Column(name = "cron_expression", length = 50)
    private String cronExpression;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    @Column(name = "updated_at")
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "automation", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @JsonManagedReference
    private List<AutomationTag> tags = new ArrayList<>();

    @OneToMany(mappedBy = "automation", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.LAZY)
    @OrderBy("timestamp DESC")
    @JsonManagedReference
    private List<ExecutionLog> logs = new ArrayList<>();

    public Automation() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public Automation(String name, String description, AutomationType type, AutomationStatus status) {
        this.name = name;
        this.description = description;
        this.type = type != null ? type : AutomationType.N8N;
        this.status = status != null ? status : AutomationStatus.ENABLED;
        this.runCount = 0;
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public void addTag(AutomationTag tag) {
        tags.add(tag);
        tag.setAutomation(this);
    }

    public void removeTag(AutomationTag tag) {
        tags.remove(tag);
        tag.setAutomation(null);
    }

    public void addLog(ExecutionLog log) {
        logs.add(0, log);
        log.setAutomation(this);
        this.lastRunTime = log.getTimestamp();
        this.lastRunStatus = log.getStatus();
        this.runCount = (this.runCount != null ? this.runCount : 0) + 1;
        this.updatedAt = LocalDateTime.now();
    }

    // Getters and Setters
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public AutomationStatus getStatus() {
        return status;
    }

    public void setStatus(AutomationStatus status) {
        this.status = status;
    }

    public AutomationType getType() {
        return type;
    }

    public void setType(AutomationType type) {
        this.type = type;
    }

    public LocalDateTime getLastRunTime() {
        return lastRunTime;
    }

    public void setLastRunTime(LocalDateTime lastRunTime) {
        this.lastRunTime = lastRunTime;
    }

    public RunStatus getLastRunStatus() {
        return lastRunStatus;
    }

    public void setLastRunStatus(RunStatus lastRunStatus) {
        this.lastRunStatus = lastRunStatus;
    }

    public Integer getRunCount() {
        return runCount != null ? runCount : 0;
    }

    public void setRunCount(Integer runCount) {
        this.runCount = runCount;
    }

    public String getN8nWorkflowId() {
        return n8nWorkflowId;
    }

    public void setN8nWorkflowId(String n8nWorkflowId) {
        this.n8nWorkflowId = n8nWorkflowId;
    }

    public String getWebhookUrl() {
        return webhookUrl;
    }

    public void setWebhookUrl(String webhookUrl) {
        this.webhookUrl = webhookUrl;
    }

    public String getCronExpression() {
        return cronExpression;
    }

    public void setCronExpression(String cronExpression) {
        this.cronExpression = cronExpression;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public List<AutomationTag> getTags() {
        return tags;
    }

    public void setTags(List<AutomationTag> tags) {
        this.tags = tags;
    }

    public List<ExecutionLog> getLogs() {
        return logs;
    }

    public void setLogs(List<ExecutionLog> logs) {
        this.logs = logs;
    }
}
