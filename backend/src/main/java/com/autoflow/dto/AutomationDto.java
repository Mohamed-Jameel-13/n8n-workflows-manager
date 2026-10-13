package com.autoflow.dto;

import java.util.ArrayList;
import java.util.List;

public class AutomationDto {
    private String id;
    private String name;
    private String description;
    private String status;
    private String type;
    private LastRunDto lastRun;
    private List<TagDto> tags = new ArrayList<>();
    private Integer runCount;
    private String createdAt;
    private List<LogDto> logs = new ArrayList<>();
    private String n8nWorkflowId;
    private String webhookUrl;
    private Double successRate;

    public AutomationDto() {}

    public String getId() {
        return id;
    }

    public void setId(String id) {
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public LastRunDto getLastRun() {
        return lastRun;
    }

    public void setLastRun(LastRunDto lastRun) {
        this.lastRun = lastRun;
    }

    public List<TagDto> getTags() {
        return tags;
    }

    public void setTags(List<TagDto> tags) {
        this.tags = tags;
    }

    public Integer getRunCount() {
        return runCount;
    }

    public void setRunCount(Integer runCount) {
        this.runCount = runCount;
    }

    public String getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(String createdAt) {
        this.createdAt = createdAt;
    }

    public List<LogDto> getLogs() {
        return logs;
    }

    public void setLogs(List<LogDto> logs) {
        this.logs = logs;
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

    public Double getSuccessRate() {
        return successRate;
    }

    public void setSuccessRate(Double successRate) {
        this.successRate = successRate;
    }
}
