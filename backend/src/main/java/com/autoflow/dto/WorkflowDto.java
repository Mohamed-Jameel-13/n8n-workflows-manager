package com.autoflow.dto;

public class WorkflowDto {
    private Long id;
    private String name;
    private Integer steps;
    private String status; // 'Active' | 'Paused'
    private String lastEdited;
    private String n8nWorkflowId;

    public WorkflowDto() {}

    public WorkflowDto(Long id, String name, Integer steps, String status, String lastEdited, String n8nWorkflowId) {
        this.id = id;
        this.name = name;
        this.steps = steps;
        this.status = status;
        this.lastEdited = lastEdited;
        this.n8nWorkflowId = n8nWorkflowId;
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

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getLastEdited() {
        return lastEdited;
    }

    public void setLastEdited(String lastEdited) {
        this.lastEdited = lastEdited;
    }

    public String getN8nWorkflowId() {
        return n8nWorkflowId;
    }

    public void setN8nWorkflowId(String n8nWorkflowId) {
        this.n8nWorkflowId = n8nWorkflowId;
    }
}
