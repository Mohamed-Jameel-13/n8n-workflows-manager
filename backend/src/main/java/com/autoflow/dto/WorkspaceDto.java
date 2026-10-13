package com.autoflow.dto;

public class WorkspaceDto {
    private String name;
    private String slug;
    private String plan;
    private String n8nBaseUrl;
    private String n8nApiKey;
    private String n8nWebhookBaseUrl;

    public WorkspaceDto() {}

    public WorkspaceDto(String name, String slug, String plan, String n8nBaseUrl, String n8nApiKey, String n8nWebhookBaseUrl) {
        this.name = name;
        this.slug = slug;
        this.plan = plan;
        this.n8nBaseUrl = n8nBaseUrl;
        this.n8nApiKey = n8nApiKey;
        this.n8nWebhookBaseUrl = n8nWebhookBaseUrl;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getSlug() {
        return slug;
    }

    public void setSlug(String slug) {
        this.slug = slug;
    }

    public String getPlan() {
        return plan;
    }

    public void setPlan(String plan) {
        this.plan = plan;
    }

    public String getN8nBaseUrl() {
        return n8nBaseUrl;
    }

    public void setN8nBaseUrl(String n8nBaseUrl) {
        this.n8nBaseUrl = n8nBaseUrl;
    }

    public String getN8nApiKey() {
        return n8nApiKey;
    }

    public void setN8nApiKey(String n8nApiKey) {
        this.n8nApiKey = n8nApiKey;
    }

    public String getN8nWebhookBaseUrl() {
        return n8nWebhookBaseUrl;
    }

    public void setN8nWebhookBaseUrl(String n8nWebhookBaseUrl) {
        this.n8nWebhookBaseUrl = n8nWebhookBaseUrl;
    }
}
