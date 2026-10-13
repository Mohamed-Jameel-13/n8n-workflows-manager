package com.autoflow.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "execution_logs")
public class ExecutionLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "automation_id")
    @JsonBackReference
    private Automation automation;

    @Column(name = "automation_name", length = 150)
    private String automationName;

    @Column(nullable = false)
    private LocalDateTime timestamp;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private RunStatus status;

    @Column(length = 500)
    private String message;

    @Column(length = 50)
    private String duration;

    @Column(name = "trigger_type", length = 100)
    private String trigger;

    @Column(name = "n8n_execution_id", length = 100)
    private String n8nExecutionId;

    @Column(columnDefinition = "TEXT")
    private String payload;

    public ExecutionLog() {
        this.timestamp = LocalDateTime.now();
        this.status = RunStatus.SUCCESS;
    }

    public ExecutionLog(Automation automation, LocalDateTime timestamp, RunStatus status, String message, String duration, String trigger) {
        this.automation = automation;
        this.automationName = automation != null ? automation.getName() : null;
        this.timestamp = timestamp != null ? timestamp : LocalDateTime.now();
        this.status = status != null ? status : RunStatus.SUCCESS;
        this.message = message;
        this.duration = duration != null ? duration : "1.0s";
        this.trigger = trigger != null ? trigger : "API";
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Automation getAutomation() {
        return automation;
    }

    public void setAutomation(Automation automation) {
        this.automation = automation;
        if (automation != null && this.automationName == null) {
            this.automationName = automation.getName();
        }
    }

    public String getAutomationName() {
        return automationName != null ? automationName : (automation != null ? automation.getName() : "Unknown Automation");
    }

    public void setAutomationName(String automationName) {
        this.automationName = automationName;
    }

    public LocalDateTime getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(LocalDateTime timestamp) {
        this.timestamp = timestamp;
    }

    public RunStatus getStatus() {
        return status;
    }

    public void setStatus(RunStatus status) {
        this.status = status;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getDuration() {
        return duration;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public String getTrigger() {
        return trigger;
    }

    public void setTrigger(String trigger) {
        this.trigger = trigger;
    }

    public String getN8nExecutionId() {
        return n8nExecutionId;
    }

    public void setN8nExecutionId(String n8nExecutionId) {
        this.n8nExecutionId = n8nExecutionId;
    }

    public String getPayload() {
        return payload;
    }

    public void setPayload(String payload) {
        this.payload = payload;
    }
}
