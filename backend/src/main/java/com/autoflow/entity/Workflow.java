package com.autoflow.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "workflows")
public class Workflow {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false)
    private Integer steps = 1;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private WorkflowStatus status = WorkflowStatus.ACTIVE;

    @Column(name = "last_edited")
    private LocalDateTime lastEdited;

    @Column(name = "n8n_workflow_id", length = 100)
    private String n8nWorkflowId;

    @Column(name = "definition_json", columnDefinition = "LONGTEXT")
    private String definitionJson;

    @Column(name = "created_at")
    private LocalDateTime createdAt;

    public Workflow() {
        this.createdAt = LocalDateTime.now();
        this.lastEdited = LocalDateTime.now();
    }

    public Workflow(String name, Integer steps, WorkflowStatus status) {
        this.name = name;
        this.steps = steps != null ? steps : 1;
        this.status = status != null ? status : WorkflowStatus.ACTIVE;
        this.createdAt = LocalDateTime.now();
        this.lastEdited = LocalDateTime.now();
    }

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

    public Integer getSteps() {
        return steps;
    }

    public void setSteps(Integer steps) {
        this.steps = steps;
    }

    public WorkflowStatus getStatus() {
        return status;
    }

    public void setStatus(WorkflowStatus status) {
        this.status = status;
    }

    public LocalDateTime getLastEdited() {
        return lastEdited;
    }

    public void setLastEdited(LocalDateTime lastEdited) {
        this.lastEdited = lastEdited;
    }

    public String getN8nWorkflowId() {
        return n8nWorkflowId;
    }

    public void setN8nWorkflowId(String n8nWorkflowId) {
        this.n8nWorkflowId = n8nWorkflowId;
    }

    public String getDefinitionJson() {
        return definitionJson;
    }

    public void setDefinitionJson(String definitionJson) {
        this.definitionJson = definitionJson;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}
