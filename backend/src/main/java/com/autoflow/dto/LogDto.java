package com.autoflow.dto;

public class LogDto {
    private Long id;
    private String timestamp;
    private String status;
    private String message;
    private String duration;
    private String trigger;
    private String automationName;

    public LogDto() {}

    public LogDto(Long id, String timestamp, String status, String message, String duration, String trigger, String automationName) {
        this.id = id;
        this.timestamp = timestamp;
        this.status = status;
        this.message = message;
        this.duration = duration;
        this.trigger = trigger;
        this.automationName = automationName;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(String timestamp) {
        this.timestamp = timestamp;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
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

    public String getAutomationName() {
        return automationName;
    }

    public void setAutomationName(String automationName) {
        this.automationName = automationName;
    }
}
