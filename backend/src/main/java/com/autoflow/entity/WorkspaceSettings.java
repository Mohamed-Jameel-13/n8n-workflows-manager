package com.autoflow.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "workspace_settings")
public class WorkspaceSettings {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "workspace_name", length = 100)
    private String workspaceName = "Acme Corp";

    @Column(name = "workspace_slug", length = 50)
    private String workspaceSlug = "acme";

    @Column(length = 20)
    private String plan = "PRO";

    @Column(name = "n8n_base_url", length = 500)
    private String n8nBaseUrl = "http://localhost:5678";

    @Column(name = "n8n_api_key", columnDefinition = "TEXT")
    private String n8nApiKey = "";

    @Column(name = "n8n_webhook_base_url", length = 500)
    private String n8nWebhookBaseUrl = "http://localhost:5678/webhook";

    public WorkspaceSettings() {}

    public WorkspaceSettings(String workspaceName, String workspaceSlug, String plan) {
        this.workspaceName = workspaceName;
        this.workspaceSlug = workspaceSlug;
        this.plan = plan;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getWorkspaceName() {
        return workspaceName;
    }

    public void setWorkspaceName(String workspaceName) {
        this.workspaceName = workspaceName;
    }

    public String getWorkspaceSlug() {
        return workspaceSlug;
    }

    public void setWorkspaceSlug(String workspaceSlug) {
        this.workspaceSlug = workspaceSlug;
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
