package com.autoflow.dto;

import java.util.List;

public class CreateAutomationRequest {
    private String name;
    private String description;
    private String type; // 'whatsapp' | 'n8n' | 'cron'
    private String status; // 'enabled' | 'disabled'
    private List<TagDto> tags;
    private String n8nWorkflowId;
    private String webhookUrl;
    private String cronExpression;

    public CreateAutomationRequest() {}

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

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public List<TagDto> getTags() {
        return tags;
    }

    public void setTags(List<TagDto> tags) {
        this.tags = tags;
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
}
